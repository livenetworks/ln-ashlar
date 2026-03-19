(function() {
  const h = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function b(t, e, n) {
    t.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function m(t, e, n) {
    const o = new CustomEvent(e, {
      bubbles: !0,
      cancelable: !0,
      detail: n || {}
    });
    return t.dispatchEvent(o), o;
  }
  function v(t) {
    if (!t.hasAttribute(h) || t[a]) return;
    t[a] = !0;
    const e = l(t);
    p(e.links), g(e.forms);
  }
  function p(t) {
    for (const e of t) {
      if (e[a + "Trigger"] || e.hostname && e.hostname !== window.location.hostname) continue;
      const n = e.getAttribute("href");
      n && n.includes("#") || (e[a + "Trigger"] = !0, e.addEventListener("click", function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const s = e.getAttribute("href");
        s && u("GET", s, null, e);
      }));
    }
  }
  function g(t) {
    for (const e of t)
      e[a + "Trigger"] || (e[a + "Trigger"] = !0, e.addEventListener("submit", function(n) {
        n.preventDefault();
        const o = e.method.toUpperCase(), s = e.action, d = new FormData(e);
        for (const c of e.querySelectorAll('button, input[type="submit"]'))
          c.disabled = !0;
        u(o, s, d, e, function() {
          for (const c of e.querySelectorAll('button, input[type="submit"]'))
            c.disabled = !1;
        });
      }));
  }
  function u(t, e, n, o, s) {
    if (m(o, "ln-ajax:before-start", { method: t, url: e }).defaultPrevented) return;
    b(o, "ln-ajax:start", { method: t, url: e }), o.classList.add("ln-ajax--loading");
    const c = document.createElement("span");
    c.className = "ln-ajax-spinner", o.appendChild(c);
    function f() {
      o.classList.remove("ln-ajax--loading");
      const A = o.querySelector(".ln-ajax-spinner");
      A && A.remove(), s && s();
    }
    let _ = e;
    const E = document.querySelector('meta[name="csrf-token"]'), w = E ? E.getAttribute("content") : null;
    n instanceof FormData && w && n.append("_token", w);
    const L = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (L.headers["X-CSRF-TOKEN"] = w), t === "GET" && n) {
      const A = new URLSearchParams(n);
      _ = e + (e.includes("?") ? "&" : "?") + A.toString();
    } else t !== "GET" && n && (L.body = n);
    fetch(_, L).then(function(A) {
      return A.json();
    }).then(function(A) {
      if (A.title && (document.title = A.title), A.content)
        for (const C in A.content) {
          const S = document.getElementById(C);
          S && (S.innerHTML = A.content[C]);
        }
      if (o.tagName === "A") {
        const C = o.getAttribute("href");
        C && window.history.pushState({ ajax: !0 }, "", C);
      } else o.tagName === "FORM" && o.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
      b(o, "ln-ajax:success", { method: t, url: _, data: A }), b(o, "ln-ajax:complete", { method: t, url: _ }), f();
    }).catch(function(A) {
      b(o, "ln-ajax:error", { method: t, url: _, error: A }), b(o, "ln-ajax:complete", { method: t, url: _ }), f();
    });
  }
  function l(t) {
    const e = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(h) !== "false" ? e.links.push(t) : t.tagName === "FORM" && t.getAttribute(h) !== "false" ? e.forms.push(t) : (e.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), e.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), e;
  }
  function r() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList") {
          for (const o of n.addedNodes)
            if (o.nodeType === 1 && (v(o), !o.hasAttribute(h))) {
              for (const d of o.querySelectorAll("[" + h + "]"))
                v(d);
              const s = o.closest && o.closest("[" + h + "]");
              if (s && s.getAttribute(h) !== "false") {
                const d = l(o);
                p(d.links), g(d.forms);
              }
            }
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function i() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      v(t);
  }
  window[a] = v, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function b(t, e, n) {
    t.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: Object.assign({ modalId: t.id, target: t }, {})
    }));
  }
  function m(t, e) {
    const n = new CustomEvent(e, {
      bubbles: !0,
      cancelable: !0,
      detail: { modalId: t.id, target: t }
    });
    return t.dispatchEvent(n), n;
  }
  function v(t) {
    const e = document.getElementById(t);
    if (!e) {
      console.warn('[ln-modal] Modal with ID "' + t + '" not found');
      return;
    }
    m(e, "ln-modal:before-open").defaultPrevented || (e.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"), b(e, "ln-modal:open"));
  }
  function p(t) {
    const e = document.getElementById(t);
    !e || m(e, "ln-modal:before-close").defaultPrevented || (e.classList.remove("ln-modal--open"), b(e, "ln-modal:close"), document.querySelector(".ln-modal.ln-modal--open") || document.body.classList.remove("ln-modal-open"));
  }
  function g(t) {
    const e = document.getElementById(t);
    if (!e) {
      console.warn('[ln-modal] Modal with ID "' + t + '" not found');
      return;
    }
    e.classList.contains("ln-modal--open") ? p(t) : v(t);
  }
  function u(t) {
    const e = t.querySelectorAll("[data-ln-modal-close]");
    for (const n of e)
      n[a + "Close"] || (n[a + "Close"] = !0, n.addEventListener("click", function(o) {
        o.preventDefault(), p(t.id);
      }));
  }
  function l(t) {
    for (const e of t)
      e[a + "Trigger"] || (e[a + "Trigger"] = !0, e.addEventListener("click", function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        n.preventDefault();
        const o = e.getAttribute(h);
        o && g(o);
      }));
  }
  function r() {
    const t = document.querySelectorAll("[" + h + "]");
    l(t);
    const e = document.querySelectorAll(".ln-modal");
    for (const n of e)
      u(n);
    document.addEventListener("keydown", function(n) {
      if (n.key === "Escape") {
        const o = document.querySelectorAll(".ln-modal.ln-modal--open");
        for (const s of o)
          p(s.id);
      }
    });
  }
  function i() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList") {
          for (const o of n.addedNodes)
            if (o.nodeType === 1) {
              o.hasAttribute(h) && l([o]);
              const s = o.querySelectorAll("[" + h + "]");
              s.length > 0 && l(s), o.id && o.classList.contains("ln-modal") && u(o);
              const d = o.querySelectorAll(".ln-modal");
              for (const c of d)
                u(c);
            }
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = {
    open: v,
    close: p,
    toggle: g
  }, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const h = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments);
      for (const t of m)
        t();
    }, history._lnNavPatched = !0;
  }
  function v(i) {
    if (!i.hasAttribute(h) || b.has(i)) return;
    const t = i.getAttribute(h);
    if (!t) return;
    const e = p(i, t);
    b.set(i, e), i[a] = e;
  }
  function p(i, t) {
    let e = Array.from(i.querySelectorAll("a"));
    u(e, t, window.location.pathname);
    const n = function() {
      e = Array.from(i.querySelectorAll("a")), u(e, t, window.location.pathname);
    };
    window.addEventListener("popstate", n), m.push(n);
    const o = new MutationObserver(function(s) {
      for (const d of s)
        if (d.type === "childList") {
          for (const c of d.addedNodes)
            if (c.nodeType === 1) {
              if (c.tagName === "A")
                e.push(c), u([c], t, window.location.pathname);
              else if (c.querySelectorAll) {
                const f = Array.from(c.querySelectorAll("a"));
                e = e.concat(f), u(f, t, window.location.pathname);
              }
            }
          for (const c of d.removedNodes)
            if (c.nodeType === 1) {
              if (c.tagName === "A")
                e = e.filter(function(f) {
                  return f !== c;
                });
              else if (c.querySelectorAll) {
                const f = Array.from(c.querySelectorAll("a"));
                e = e.filter(function(_) {
                  return !f.includes(_);
                });
              }
            }
        }
    });
    return o.observe(i, { childList: !0, subtree: !0 }), {
      navElement: i,
      activeClass: t,
      observer: o,
      updateHandler: n,
      destroy: function() {
        o.disconnect(), window.removeEventListener("popstate", n);
        const s = m.indexOf(n);
        s !== -1 && m.splice(s, 1), b.delete(i), delete i[a];
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
  function u(i, t, e) {
    const n = g(e);
    for (const o of i) {
      const s = o.getAttribute("href");
      if (!s) continue;
      const d = g(s);
      o.classList.remove(t);
      const c = d === n, f = d !== "/" && n.startsWith(d + "/");
      (c || f) && o.classList.add(t);
    }
  }
  function l() {
    new MutationObserver(function(t) {
      for (const e of t)
        if (e.type === "childList") {
          for (const n of e.addedNodes)
            if (n.nodeType === 1 && (n.hasAttribute && n.hasAttribute(h) && v(n), n.querySelectorAll))
              for (const o of n.querySelectorAll("[" + h + "]"))
                v(o);
        }
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  window[a] = v;
  function r() {
    for (const i of document.querySelectorAll("[" + h + "]"))
      v(i);
  }
  l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
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
  const a = /* @__PURE__ */ new WeakMap();
  function b(g) {
    if (a.has(g)) return;
    const u = g.getAttribute("data-ln-select");
    let l = {};
    if (u && u.trim() !== "")
      try {
        l = JSON.parse(u);
      } catch (t) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", t);
      }
    const i = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: g.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...l };
    try {
      const t = new h(g, i);
      a.set(g, t);
      const e = g.closest("form");
      e && e.addEventListener("reset", () => {
        setTimeout(() => {
          t.clear(), t.clearOptions(), t.sync();
        }, 0);
      });
    } catch (t) {
      console.warn("[ln-select] Failed to initialize Tom Select:", t);
    }
  }
  function m(g) {
    const u = a.get(g);
    u && (u.destroy(), a.delete(g));
  }
  function v() {
    for (const g of document.querySelectorAll("select[data-ln-select]"))
      b(g);
  }
  function p() {
    new MutationObserver(function(u) {
      for (const l of u) {
        for (const r of l.addedNodes)
          if (r.nodeType === 1 && (r.matches && r.matches("select[data-ln-select]") && b(r), r.querySelectorAll))
            for (const i of r.querySelectorAll("select[data-ln-select]"))
              b(i);
        for (const r of l.removedNodes)
          if (r.nodeType === 1 && (r.matches && r.matches("select[data-ln-select]") && m(r), r.querySelectorAll))
            for (const i of r.querySelectorAll("select[data-ln-select]"))
              m(i);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(), p();
  }) : (v(), p()), window.lnSelect = {
    initialize: b,
    destroy: m,
    getInstance: function(g) {
      return a.get(g);
    }
  };
})();
(function() {
  const h = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function b(r = document.body) {
    m(r);
  }
  function m(r) {
    if (r.nodeType !== 1) return;
    const i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r);
    for (const t of i)
      t[a] || (t[a] = new p(t));
  }
  function v() {
    const r = (location.hash || "").replace("#", ""), i = {};
    if (!r) return i;
    for (const t of r.split("&")) {
      const e = t.indexOf(":");
      e > 0 && (i[t.slice(0, e)] = t.slice(e + 1));
    }
    return i;
  }
  function p(r) {
    return this.dom = r, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const i of this.tabs) {
      const t = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      t && (this.mapTabs[t] = i);
    }
    for (const i of this.panels) {
      const t = (i.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      t && (this.mapPanels[t] = i);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const r = this;
    this._clickHandlers = [];
    for (const i of this.tabs) {
      if (i[a + "Trigger"]) continue;
      i[a + "Trigger"] = !0;
      const t = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        const n = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (n)
          if (r.hashEnabled) {
            const o = v();
            o[r.nsKey] = n;
            const s = Object.keys(o).map(function(d) {
              return d + ":" + o[d];
            }).join("&");
            location.hash === "#" + s ? r.activate(n) : location.hash = s;
          } else
            r.activate(n);
      };
      i.addEventListener("click", t), r._clickHandlers.push({ el: i, handler: t });
    }
    this._hashHandler = function() {
      if (!r.hashEnabled) return;
      const i = v();
      r.activate(r.nsKey in i ? i[r.nsKey] : r.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  p.prototype.activate = function(r) {
    var i;
    (!r || !(r in this.mapPanels)) && (r = this.defaultKey);
    for (const t in this.mapTabs) {
      const e = this.mapTabs[t];
      t === r ? (e.setAttribute("data-active", ""), e.setAttribute("aria-selected", "true")) : (e.removeAttribute("data-active"), e.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const e = this.mapPanels[t], n = t === r;
      e.classList.toggle("hidden", !n), e.setAttribute("aria-hidden", n ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (i = this.mapPanels[r]) == null ? void 0 : i.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    u(this.dom, "ln-tabs:change", { key: r, tab: this.mapTabs[r], panel: this.mapPanels[r] });
  }, p.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: r, handler: i } of this._clickHandlers)
        r.removeEventListener("click", i);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), u(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function u(r, i, t) {
    r.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function l() {
    new MutationObserver(function(i) {
      for (const t of i)
        for (const e of t.addedNodes)
          m(e);
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  l(), window[a] = b, b(document.body);
})();
(function() {
  const h = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function b(r) {
    m(r), v(r);
  }
  function m(r) {
    const i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r);
    for (const t of i)
      t[a] || (t[a] = new p(t));
  }
  function v(r) {
    const i = Array.from(r.querySelectorAll("[data-ln-toggle-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-toggle-for") && i.push(r);
    for (const t of i) {
      if (t[a + "Trigger"]) return;
      t[a + "Trigger"] = !0, t.addEventListener("click", function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const n = t.getAttribute("data-ln-toggle-for"), o = document.getElementById(n);
        if (!o || !o[a]) return;
        const s = t.getAttribute("data-ln-toggle-action") || "toggle";
        o[a][s]();
      });
    }
  }
  function p(r) {
    this.dom = r, this.isOpen = r.getAttribute(h) === "open", this.isOpen && r.classList.add("open");
    const i = this;
    return this._onRequestClose = function() {
      i.isOpen && i.close();
    }, this._onRequestOpen = function() {
      i.isOpen || i.open();
    }, r.addEventListener("ln-toggle:request-close", this._onRequestClose), r.addEventListener("ln-toggle:request-open", this._onRequestOpen), this;
  }
  p.prototype.open = function() {
    this.isOpen || u(this.dom, "ln-toggle:before-open", { target: this.dom }).defaultPrevented || (this.isOpen = !0, this.dom.classList.add("open"), g(this.dom, "ln-toggle:open", { target: this.dom }));
  }, p.prototype.close = function() {
    !this.isOpen || u(this.dom, "ln-toggle:before-close", { target: this.dom }).defaultPrevented || (this.isOpen = !1, this.dom.classList.remove("open"), g(this.dom, "ln-toggle:close", { target: this.dom }));
  }, p.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, p.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), g(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function g(r, i, t) {
    r.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function u(r, i, t) {
    const e = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0,
      detail: t || {}
    });
    return r.dispatchEvent(e), e;
  }
  function l() {
    new MutationObserver(function(i) {
      for (const t of i)
        if (t.type === "childList")
          for (const e of t.addedNodes)
            e.nodeType === 1 && (m(e), v(e));
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = b, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function b(u) {
    m(u);
  }
  function m(u) {
    const l = Array.from(u.querySelectorAll("[" + h + "]"));
    u.hasAttribute && u.hasAttribute(h) && l.push(u);
    for (const r of l)
      r[a] || (r[a] = new v(r));
  }
  function v(u) {
    return this.dom = u, this._onToggleOpen = function(l) {
      const r = u.querySelectorAll("[data-ln-toggle]");
      for (const i of r)
        i !== l.detail.target && i.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
      p(u, "ln-accordion:change", { target: l.detail.target });
    }, u.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), p(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function p(u, l, r) {
    u.dispatchEvent(new CustomEvent(l, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function g() {
    new MutationObserver(function(l) {
      for (const r of l)
        if (r.type === "childList")
          for (const i of r.addedNodes)
            i.nodeType === 1 && m(i);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = b, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function b(u) {
    m(u);
  }
  function m(u) {
    const l = Array.from(u.querySelectorAll("[" + h + "]"));
    u.hasAttribute && u.hasAttribute(h) && l.push(u);
    for (const r of l)
      r[a] || (r[a] = new v(r));
  }
  function v(u) {
    this.dom = u, this.toggleEl = u.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && this.toggleEl.setAttribute("data-ln-dropdown-menu", "");
    const l = this;
    return this._onToggleOpen = function(r) {
      r.detail.target === l.toggleEl && (l._teleportToBody(), l._addOutsideClickListener(), l._addScrollCloseListener(), p(u, "ln-dropdown:open", { target: r.detail.target }));
    }, this._onToggleClose = function(r) {
      r.detail.target === l.toggleEl && (l._removeOutsideClickListener(), l._removeScrollCloseListener(), l._teleportBack(), p(u, "ln-dropdown:close", { target: r.detail.target }));
    }, this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose), this;
  }
  v.prototype._teleportToBody = function() {
    if (!this.toggleEl || this.toggleEl.parentNode === document.body) return;
    const u = this.dom.querySelector("[data-ln-toggle-for]");
    if (!u) return;
    const l = u.getBoundingClientRect();
    this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block";
    const r = this.toggleEl.offsetWidth, i = this.toggleEl.offsetHeight;
    this.toggleEl.style.visibility = "", this.toggleEl.style.display = "";
    const t = window.innerWidth, e = window.innerHeight, n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    var o;
    l.bottom + n + i <= e ? o = l.bottom + n : l.top - n - i >= 0 ? o = l.top - n - i : o = Math.max(0, e - i);
    var s;
    l.right - r >= 0 ? s = l.right - r : l.left + r <= t ? s = l.left : s = Math.max(0, t - r), this.toggleEl.style.top = o + "px", this.toggleEl.style.left = s + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, v.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const u = this;
    this._boundDocClick = function(l) {
      u.dom.contains(l.target) || u.toggleEl && u.toggleEl.contains(l.target) || u.toggleEl && u.toggleEl.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
    }, setTimeout(function() {
      document.addEventListener("click", u._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollCloseListener = function() {
    const u = this;
    this._boundScrollClose = function() {
      u.toggleEl && u.toggleEl.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
    }, window.addEventListener("scroll", this._boundScrollClose, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundScrollClose);
  }, v.prototype._removeScrollCloseListener = function() {
    this._boundScrollClose && (window.removeEventListener("scroll", this._boundScrollClose, { capture: !0 }), window.removeEventListener("resize", this._boundScrollClose), this._boundScrollClose = null);
  }, v.prototype.destroy = function() {
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollCloseListener(), this._teleportBack(), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose), p(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function p(u, l, r) {
    u.dispatchEvent(new CustomEvent(l, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function g() {
    new MutationObserver(function(l) {
      for (const r of l)
        if (r.type === "childList")
          for (const i of r.addedNodes)
            i.nodeType === 1 && m(i);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = b, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-toast", a = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[a] !== void 0 && window[a] !== null) return;
  function m(n = document.body) {
    return v(n), t;
  }
  function v(n) {
    if (!n || n.nodeType !== 1) return;
    const o = Array.from(n.querySelectorAll("[" + h + "]"));
    n.hasAttribute && n.hasAttribute(h) && o.push(n);
    for (const s of o)
      s[a] || new p(s);
  }
  function p(n) {
    this.dom = n, n[a] = this, this.timeoutDefault = parseInt(n.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(n.getAttribute("data-ln-toast-max") || "5", 10);
    for (const o of Array.from(n.querySelectorAll("[data-ln-toast-item]")))
      g(o);
    return this;
  }
  p.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const n of Array.from(this.dom.children))
        l(n);
      delete this.dom[a];
    }
  };
  function g(n) {
    const o = ((n.getAttribute("data-type") || "info") + "").toLowerCase(), s = n.getAttribute("data-title"), d = (n.innerText || n.textContent || "").trim();
    n.className = "ln-toast__item", n.removeAttribute("data-ln-toast-item");
    const c = document.createElement("div");
    c.className = "ln-toast__card ln-toast__card--" + o, c.setAttribute("role", o === "error" ? "alert" : "status"), c.setAttribute("aria-live", o === "error" ? "assertive" : "polite");
    const f = document.createElement("div");
    f.className = "ln-toast__side", f.innerHTML = b[o] || b.info;
    const _ = document.createElement("div");
    _.className = "ln-toast__content";
    const E = document.createElement("div");
    E.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = s || (o === "success" ? "Success" : o === "error" ? "Error" : o === "warn" ? "Warning" : "Information");
    const L = document.createElement("button");
    if (L.type = "button", L.className = "ln-toast__close ln-icon-close", L.setAttribute("aria-label", "Close"), L.addEventListener("click", () => l(n)), E.appendChild(w), _.appendChild(E), _.appendChild(L), d) {
      const A = document.createElement("div");
      A.className = "ln-toast__body";
      const C = document.createElement("p");
      C.textContent = d, A.appendChild(C), _.appendChild(A);
    }
    c.appendChild(f), c.appendChild(_), n.innerHTML = "", n.appendChild(c), requestAnimationFrame(() => n.classList.add("ln-toast__item--in"));
  }
  function u(n, o) {
    for (; n.dom.children.length >= n.max; ) n.dom.removeChild(n.dom.firstElementChild);
    n.dom.appendChild(o), requestAnimationFrame(() => o.classList.add("ln-toast__item--in"));
  }
  function l(n) {
    !n || !n.parentNode || (clearTimeout(n._timer), n.classList.remove("ln-toast__item--in"), n.classList.add("ln-toast__item--out"), setTimeout(() => {
      n.parentNode && n.parentNode.removeChild(n);
    }, 200));
  }
  function r(n = {}) {
    let o = n.container;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !o)
      return console.warn("[ln-toast] No toast container found"), null;
    const s = o[a] || new p(o), d = Number.isFinite(n.timeout) ? n.timeout : s.timeoutDefault, c = (n.type || "info").toLowerCase(), f = document.createElement("li");
    f.className = "ln-toast__item";
    const _ = document.createElement("div");
    _.className = "ln-toast__card ln-toast__card--" + c, _.setAttribute("role", c === "error" ? "alert" : "status"), _.setAttribute("aria-live", c === "error" ? "assertive" : "polite");
    const E = document.createElement("div");
    E.className = "ln-toast__side", E.innerHTML = b[c] || b.info;
    const w = document.createElement("div");
    w.className = "ln-toast__content";
    const L = document.createElement("div");
    L.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = n.title || (c === "success" ? "Success" : c === "error" ? "Error" : c === "warn" ? "Warning" : "Information");
    const C = document.createElement("button");
    if (C.type = "button", C.className = "ln-toast__close ln-icon-close", C.setAttribute("aria-label", "Close"), C.addEventListener("click", () => l(f)), L.appendChild(A), w.appendChild(L), w.appendChild(C), n.message || n.data && n.data.errors) {
      const S = document.createElement("div");
      if (S.className = "ln-toast__body", n.message)
        if (Array.isArray(n.message)) {
          const q = document.createElement("ul");
          for (const N of n.message) {
            const y = document.createElement("li");
            y.textContent = N, q.appendChild(y);
          }
          S.appendChild(q);
        } else {
          const q = document.createElement("p");
          q.textContent = n.message, S.appendChild(q);
        }
      if (n.data && n.data.errors) {
        const q = document.createElement("ul");
        for (const N of Object.values(n.data.errors).flat()) {
          const y = document.createElement("li");
          y.textContent = N, q.appendChild(y);
        }
        S.appendChild(q);
      }
      w.appendChild(S);
    }
    return _.appendChild(E), _.appendChild(w), f.appendChild(_), u(s, f), d > 0 && (f._timer = setTimeout(() => l(f), d)), f;
  }
  function i(n) {
    let o = n;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !!o)
      for (const s of Array.from(o.children))
        l(s);
  }
  const t = function(n) {
    return m(n);
  };
  t.enqueue = r, t.clear = i, new MutationObserver(function(n) {
    for (const o of n)
      for (const s of o.addedNodes)
        v(s);
  }).observe(document.body, { childList: !0, subtree: !0 }), window[a] = t, window.addEventListener("ln-toast:enqueue", function(n) {
    n.detail && t.enqueue(n.detail);
  }), m(document.body);
})();
(function() {
  const h = "data-ln-upload", a = "lnUpload", b = "data-ln-upload-dict", m = "data-ln-upload-accept", v = "data-ln-upload-context";
  if (window[a] !== void 0) return;
  function p(o, s) {
    const d = o.querySelector("[" + b + '="' + s + '"]');
    return d ? d.textContent : s;
  }
  function g(o) {
    if (o === 0) return "0 B";
    const s = 1024, d = ["B", "KB", "MB", "GB"], c = Math.floor(Math.log(o) / Math.log(s));
    return parseFloat((o / Math.pow(s, c)).toFixed(1)) + " " + d[c];
  }
  function u(o) {
    return o.split(".").pop().toLowerCase();
  }
  function l(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "ln-icon-file-" + o : "ln-icon-file";
  }
  function r(o, s) {
    if (!s) return !0;
    const d = "." + u(o.name);
    return s.split(",").map(function(f) {
      return f.trim().toLowerCase();
    }).includes(d.toLowerCase());
  }
  function i(o, s, d) {
    o.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: d
    }));
  }
  function t(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true");
    const s = o.querySelector(".ln-upload__zone"), d = o.querySelector(".ln-upload__list"), c = o.getAttribute(m) || "";
    if (!s || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", o);
      return;
    }
    let f = o.querySelector('input[type="file"]');
    f || (f = document.createElement("input"), f.type = "file", f.multiple = !0, f.style.display = "none", c && (f.accept = c.split(",").map(function(y) {
      return y = y.trim(), y.startsWith(".") ? y : "." + y;
    }).join(",")), o.appendChild(f));
    const _ = o.getAttribute(h) || "/files/upload", E = o.getAttribute(v) || "", w = /* @__PURE__ */ new Map();
    let L = 0;
    function A() {
      const y = document.querySelector('meta[name="csrf-token"]');
      return y ? y.getAttribute("content") : "";
    }
    function C(y) {
      if (!r(y, c)) {
        const T = p(o, "invalid-type");
        i(o, "ln-upload:invalid", {
          file: y,
          message: T
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: T || "This file type is not allowed"
          }
        }));
        return;
      }
      const O = "file-" + ++L, M = u(y.name), R = l(M), D = document.createElement("li");
      D.className = "ln-upload__item ln-upload__item--uploading " + R, D.setAttribute("data-file-id", O);
      const P = document.createElement("span");
      P.className = "ln-upload__name", P.textContent = y.name;
      const I = document.createElement("span");
      I.className = "ln-upload__size", I.textContent = "0%";
      const k = document.createElement("button");
      k.type = "button", k.className = "ln-upload__remove ln-icon-close", k.title = p(o, "remove"), k.textContent = "×", k.disabled = !0;
      const F = document.createElement("div");
      F.className = "ln-upload__progress";
      const H = document.createElement("div");
      H.className = "ln-upload__progress-bar", F.appendChild(H), D.appendChild(P), D.appendChild(I), D.appendChild(k), D.appendChild(F), d.appendChild(D);
      const U = new FormData();
      U.append("file", y), U.append("context", E);
      const x = new XMLHttpRequest();
      x.upload.addEventListener("progress", function(T) {
        if (T.lengthComputable) {
          const B = Math.round(T.loaded / T.total * 100);
          H.style.width = B + "%", I.textContent = B + "%";
        }
      }), x.addEventListener("load", function() {
        if (x.status >= 200 && x.status < 300) {
          let T;
          try {
            T = JSON.parse(x.responseText);
          } catch {
            z("Invalid response");
            return;
          }
          D.classList.remove("ln-upload__item--uploading"), I.textContent = g(T.size || y.size), k.disabled = !1, w.set(O, {
            serverId: T.id,
            name: T.name,
            size: T.size
          }), S(), i(o, "ln-upload:uploaded", {
            localId: O,
            serverId: T.id,
            name: T.name
          });
        } else {
          let T = "Upload failed";
          try {
            T = JSON.parse(x.responseText).message || T;
          } catch {
          }
          z(T);
        }
      }), x.addEventListener("error", function() {
        z("Network error");
      });
      function z(T) {
        D.classList.remove("ln-upload__item--uploading"), D.classList.add("ln-upload__item--error"), H.style.width = "100%", I.textContent = p(o, "error"), k.disabled = !1, i(o, "ln-upload:error", {
          file: y,
          message: T
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: T || p(o, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      x.open("POST", _), x.setRequestHeader("X-CSRF-TOKEN", A()), x.setRequestHeader("Accept", "application/json"), x.send(U);
    }
    function S() {
      for (const y of o.querySelectorAll('input[name="file_ids[]"]'))
        y.remove();
      for (const [, y] of w) {
        const O = document.createElement("input");
        O.type = "hidden", O.name = "file_ids[]", O.value = y.serverId, o.appendChild(O);
      }
    }
    function q(y) {
      const O = w.get(y), M = d.querySelector('[data-file-id="' + y + '"]');
      if (!O || !O.serverId) {
        M && M.remove(), w.delete(y), S();
        return;
      }
      M && M.classList.add("ln-upload__item--deleting"), fetch("/files/" + O.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": A(),
          Accept: "application/json"
        }
      }).then(function(R) {
        R.status === 200 ? (M && M.remove(), w.delete(y), S(), i(o, "ln-upload:removed", {
          localId: y,
          serverId: O.serverId
        })) : (M && M.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: p(o, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch(function(R) {
        console.warn("[ln-upload] Delete error:", R), M && M.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function N(y) {
      for (const O of y)
        C(O);
      f.value = "";
    }
    s.addEventListener("click", function() {
      f.click();
    }), f.addEventListener("change", function() {
      N(this.files);
    }), s.addEventListener("dragenter", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }), s.addEventListener("dragover", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }), s.addEventListener("dragleave", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.remove("ln-upload__zone--dragover");
    }), s.addEventListener("drop", function(y) {
      y.preventDefault(), y.stopPropagation(), s.classList.remove("ln-upload__zone--dragover"), N(y.dataTransfer.files);
    }), d.addEventListener("click", function(y) {
      if (y.target.classList.contains("ln-upload__remove")) {
        const O = y.target.closest(".ln-upload__item");
        O && q(O.getAttribute("data-file-id"));
      }
    }), o.lnUploadAPI = {
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
              "X-CSRF-TOKEN": A(),
              Accept: "application/json"
            }
          });
        w.clear(), d.innerHTML = "", S(), i(o, "ln-upload:cleared", {});
      }
    };
  }
  function e() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      t(o);
  }
  function n() {
    new MutationObserver(function(s) {
      for (const d of s)
        if (d.type === "childList") {
          for (const c of d.addedNodes)
            if (c.nodeType === 1) {
              c.hasAttribute(h) && t(c);
              for (const f of c.querySelectorAll("[" + h + "]"))
                t(f);
            }
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = {
    init: t,
    initAll: e
  }, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function a(l, r, i) {
    l.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: i
    }));
  }
  function b(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function m(l) {
    l.getAttribute("data-ln-external-link") !== "processed" && b(l) && (l.target = "_blank", l.rel = "noopener noreferrer", l.setAttribute("data-ln-external-link", "processed"), a(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    }));
  }
  function v(l) {
    l = l || document.body;
    for (const r of l.querySelectorAll("a, area"))
      m(r);
  }
  function p() {
    document.body.addEventListener("click", function(l) {
      const r = l.target.closest("a, area");
      r && r.getAttribute("data-ln-external-link") === "processed" && a(r, "ln-external-links:clicked", {
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
          for (const t of i.addedNodes)
            if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && m(t), t.querySelectorAll))
              for (const e of t.querySelectorAll("a, area"))
                m(e);
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function u() {
    p(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      v();
    }) : v();
  }
  window[h] = {
    process: v
  }, u();
})();
(function() {
  const h = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  function b(d, c, f) {
    const _ = new CustomEvent(c, {
      bubbles: !0,
      cancelable: !0,
      detail: f || {}
    });
    return d.dispatchEvent(_), _;
  }
  let m = null;
  function v() {
    m = document.createElement("div"), m.className = "ln-link-status", document.body.appendChild(m);
  }
  function p(d) {
    m && (m.textContent = d, m.classList.add("ln-link-status--visible"));
  }
  function g() {
    m && m.classList.remove("ln-link-status--visible");
  }
  function u(d, c) {
    if (c.target.closest("a, button, input, select, textarea")) return;
    const f = d.querySelector("a");
    if (!f) return;
    const _ = f.getAttribute("href");
    if (!_) return;
    if (c.ctrlKey || c.metaKey || c.button === 1) {
      window.open(_, "_blank");
      return;
    }
    b(d, "ln-link:navigate", { target: d, href: _, link: f }).defaultPrevented || f.click();
  }
  function l(d) {
    const c = d.querySelector("a");
    if (!c) return;
    const f = c.getAttribute("href");
    f && p(f);
  }
  function r() {
    g();
  }
  function i(d) {
    d[a + "Row"] || (d[a + "Row"] = !0, d.querySelector("a") && (d.addEventListener("click", function(c) {
      u(d, c);
    }), d.addEventListener("mouseenter", function() {
      l(d);
    }), d.addEventListener("mouseleave", r)));
  }
  function t(d) {
    if (d[a + "Init"]) return;
    d[a + "Init"] = !0;
    const c = d.tagName;
    if (c === "TABLE" || c === "TBODY") {
      const f = c === "TABLE" && d.querySelector("tbody") || d;
      for (const _ of f.querySelectorAll("tr"))
        i(_);
    } else i(d);
  }
  function e(d) {
    d.hasAttribute && d.hasAttribute(h) && t(d);
    const c = d.querySelectorAll ? d.querySelectorAll("[" + h + "]") : [];
    for (const f of c)
      t(f);
  }
  function n() {
    new MutationObserver(function(c) {
      for (const f of c)
        if (f.type === "childList")
          for (const _ of f.addedNodes)
            _.nodeType === 1 && (e(_), _.tagName === "TR" && _.closest("[" + h + "]") && i(_));
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function o(d) {
    e(d);
  }
  window[a] = { init: o };
  function s() {
    v(), n(), o(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const h = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function b(t) {
    const e = t.getAttribute("data-ln-progress");
    return e !== null && e !== "";
  }
  function m(t) {
    p(t);
  }
  function v(t, e, n) {
    t.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function p(t) {
    const e = Array.from(t.querySelectorAll(h));
    for (const n of e)
      b(n) && !n[a] && (n[a] = new g(n));
    t.hasAttribute && t.hasAttribute("data-ln-progress") && b(t) && !t[a] && (t[a] = new g(t));
  }
  function g(t) {
    return this.dom = t, this._attrObserver = null, this._parentObserver = null, i.call(this), l.call(this), r.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function u() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList")
          for (const o of n.addedNodes)
            o.nodeType === 1 && p(o);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  u();
  function l() {
    const t = this, e = new MutationObserver(function(n) {
      for (const o of n)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && i.call(t);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function r() {
    const t = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const n = new MutationObserver(function(o) {
      for (const s of o)
        s.attributeName === "data-ln-progress-max" && i.call(t);
    });
    n.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function i() {
    const t = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, o = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let s = o > 0 ? t / o * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%", v(this.dom, "ln-progress:change", { target: this.dom, value: t, max: o, percentage: s });
  }
  window[a] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-filter", a = "lnFilter", b = "data-ln-filter-initialized", m = "data-ln-filter-key", v = "data-ln-filter-value", p = "data-ln-filter-hide";
  if (window[a] !== void 0) return;
  function g(t) {
    u(t);
  }
  function u(t) {
    var e = Array.from(t.querySelectorAll("[" + h + "]"));
    t.hasAttribute && t.hasAttribute(h) && e.push(t), e.forEach(function(n) {
      n[a] || (n[a] = new l(n));
    });
  }
  function l(t) {
    return t.hasAttribute(b) ? this : (this.dom = t, this.targetId = t.getAttribute(h), this.buttons = Array.from(t.querySelectorAll("button")), this._attachHandlers(), t.setAttribute(b, ""), this);
  }
  l.prototype._attachHandlers = function() {
    var t = this;
    this.buttons.forEach(function(e) {
      e[a + "Bound"] || (e[a + "Bound"] = !0, e.addEventListener("click", function(n) {
        t.buttons.forEach(function(o) {
          o.classList.remove("active");
        }), e.classList.add("active"), t._filter(e);
      }));
    });
  }, l.prototype._filter = function(t) {
    var e = document.getElementById(this.targetId);
    if (e) {
      var n = t.getAttribute(m), o = t.getAttribute(v);
      if (n) {
        for (var s = e.querySelectorAll("[data-" + n + "]"), d = 0, c = s.length, f = 0; f < s.length; f++) {
          var _ = s[f];
          _.removeAttribute(p), o !== "" && !_.getAttribute("data-" + n).toLowerCase().includes(o.toLowerCase()) ? _.setAttribute(p, "true") : d++;
        }
        r(this.dom, "ln-filter:change", {
          targetId: this.targetId,
          key: n,
          value: o,
          matched: d,
          total: c
        });
      }
    }
  };
  function r(t, e, n) {
    t.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function i() {
    var t = new MutationObserver(function(e) {
      e.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(o) {
          o.nodeType === 1 && u(o);
        });
      });
    });
    t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = g, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const h = "data-ln-search", a = "lnSearch", b = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function p(r) {
    g(r);
  }
  function g(r) {
    var i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r), i.forEach(function(t) {
      t[a] || (t[a] = new u(t));
    });
  }
  function u(r) {
    if (r.hasAttribute(b)) return this;
    this.dom = r, this.targetId = r.getAttribute(h);
    var i = r.tagName;
    return this.input = i === "INPUT" || i === "TEXTAREA" ? r : r.querySelector('[name="search"]') || r.querySelector('input[type="search"]') || r.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), r.setAttribute(b, ""), this;
  }
  u.prototype._attachHandler = function() {
    if (this.input) {
      var r = this;
      this.input.addEventListener("input", function() {
        clearTimeout(r._debounceTimer), r._debounceTimer = setTimeout(function() {
          r._search(r.input.value.trim().toLowerCase());
        }, 150);
      });
    }
  }, u.prototype._search = function(r) {
    var i = document.getElementById(this.targetId);
    if (i) {
      var t = new CustomEvent("ln-search:change", {
        bubbles: !0,
        cancelable: !0,
        detail: { term: r, targetId: this.targetId }
      });
      if (i.dispatchEvent(t)) {
        var e = i.children;
        e.length;
        for (var n = 0; n < e.length; n++) {
          var o = e[n];
          o.removeAttribute(m), r && !o.textContent.replace(/\s+/g, " ").toLowerCase().includes(r) && o.setAttribute(m, "true");
        }
      }
    }
  };
  function l() {
    var r = new MutationObserver(function(i) {
      i.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(e) {
          e.nodeType === 1 && g(e);
        });
      });
    });
    r.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = p, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const h = "lnTableSort", a = "data-ln-sort", b = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function m(l) {
    v(l);
  }
  function v(l) {
    var r = Array.from(l.querySelectorAll("table"));
    l.tagName === "TABLE" && r.push(l), r.forEach(function(i) {
      if (!i[h]) {
        var t = Array.from(i.querySelectorAll("th[" + a + "]"));
        t.length && (i[h] = new p(i, t));
      }
    });
  }
  function p(l, r) {
    this.table = l, this.ths = r, this._col = -1, this._dir = null;
    var i = this;
    return r.forEach(function(t, e) {
      t[h + "Bound"] || (t[h + "Bound"] = !0, t.addEventListener("click", function() {
        i._handleClick(e, t);
      }));
    }), this;
  }
  p.prototype._handleClick = function(l, r) {
    var i;
    this._col !== l ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(t) {
      t.removeAttribute(b);
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = l, this._dir = i, r.setAttribute(b, i)), g(this.table, "ln-table:sort", {
      column: l,
      sortType: r.getAttribute(a),
      direction: i
    });
  };
  function g(l, r, i) {
    l.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function u() {
    var l = new MutationObserver(function(r) {
      r.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(t) {
          t.nodeType === 1 && v(t);
        });
      });
    });
    l.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[h] = m, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-table", a = "lnTable", b = "data-ln-sort", m = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  var g = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function u(e) {
    l(e);
  }
  function l(e) {
    var n = Array.from(e.querySelectorAll("[" + h + "]"));
    e.hasAttribute && e.hasAttribute(h) && n.push(e), n.forEach(function(o) {
      o[a] || (o[a] = new r(o));
    });
  }
  function r(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("tbody"), this.thead = e.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    var n = e.querySelector(".ln-table__toolbar");
    n && e.style.setProperty("--ln-table-toolbar-h", n.offsetHeight + "px");
    var o = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      var s = new MutationObserver(function() {
        o.tbody.rows.length > 0 && (s.disconnect(), o._parseRows());
      });
      s.observe(this.tbody, { childList: !0 });
    }
    return e.addEventListener("ln-search:change", function(d) {
      d.preventDefault(), o._searchTerm = d.detail.term, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), i(e, "ln-table:filter", {
        term: o._searchTerm,
        matched: o._filteredData.length,
        total: o._data.length
      });
    }), e.addEventListener("ln-table:sort", function(d) {
      o._sortCol = d.detail.direction === null ? -1 : d.detail.column, o._sortDir = d.detail.direction, o._sortType = d.detail.sortType, o._applyFilterAndSort(), o._vStart = -1, o._vEnd = -1, o._render(), i(e, "ln-table:sorted", {
        column: d.detail.column,
        direction: d.detail.direction,
        matched: o._filteredData.length,
        total: o._data.length
      });
    }), this;
  }
  r.prototype._parseRows = function() {
    var e = this.tbody.rows, n = this.ths;
    this._data = [];
    for (var o = [], s = 0; s < n.length; s++)
      o[s] = n[s].getAttribute(b);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (var d = 0; d < e.length; d++) {
      for (var c = e[d], f = [], _ = [], E = 0; E < c.cells.length; E++) {
        var w = c.cells[E], L = w.textContent.trim(), A = w.hasAttribute("data-ln-value") ? w.getAttribute("data-ln-value") : L, C = o[E];
        C === "number" || C === "date" ? f[E] = parseFloat(A) || 0 : C === "string" ? f[E] = String(A) : f[E] = null, E < c.cells.length - 1 && _.push(L.toLowerCase());
      }
      this._data.push({
        sortKeys: f,
        html: c.outerHTML,
        searchText: _.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), i(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, r.prototype._applyFilterAndSort = function() {
    if (!this._searchTerm)
      this._filteredData = this._data.slice();
    else {
      var e = this._searchTerm;
      this._filteredData = this._data.filter(function(c) {
        return c.searchText.indexOf(e) !== -1;
      });
    }
    if (!(this._sortCol < 0 || !this._sortDir)) {
      var n = this._sortCol, o = this._sortDir === "desc" ? -1 : 1, s = this._sortType === "number" || this._sortType === "date", d = g ? g.compare : function(c, f) {
        return c < f ? -1 : c > f ? 1 : 0;
      };
      this._filteredData.sort(function(c, f) {
        var _ = c.sortKeys[n], E = f.sortKeys[n];
        return s ? (_ - E) * o : d(_, E) * o;
      });
    }
  }, r.prototype._lockColumnWidths = function() {
    if (!(!this.table || !this.thead || this._colgroup)) {
      var e = document.createElement("colgroup");
      this.ths.forEach(function(n) {
        var o = document.createElement("col");
        o.style.width = n.offsetWidth + "px", e.appendChild(o);
      }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
    }
  }, r.prototype._render = function() {
    if (this.tbody) {
      var e = this._filteredData.length;
      e === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
    }
  }, r.prototype._renderAll = function() {
    for (var e = [], n = this._filteredData, o = 0; o < n.length; o++) e.push(n[o].html);
    this.tbody.innerHTML = e.join("");
  }, r.prototype._enableVirtualScroll = function() {
    if (!this._virtual) {
      this._virtual = !0;
      var e = this;
      this._scrollHandler = function() {
        e._rafId || (e._rafId = requestAnimationFrame(function() {
          e._rafId = null, e._renderVirtual();
        }));
      }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
    }
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    var e = this._filteredData, n = e.length, o = this._rowHeight;
    if (!(!o || !n)) {
      var s = this.table.getBoundingClientRect(), d = s.top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, f = d + c, _ = window.scrollY - f, E = Math.max(0, Math.floor(_ / o) - 15), w = Math.min(E + Math.ceil(window.innerHeight / o) + 30, n);
      if (!(E === this._vStart && w === this._vEnd)) {
        this._vStart = E, this._vEnd = w;
        var L = this.ths.length || 1, A = E * o, C = (n - w) * o, S = "";
        A > 0 && (S += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + A + 'px;padding:0;border:none"></td></tr>');
        for (var q = E; q < w; q++) S += e[q].html;
        C > 0 && (S += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = S;
      }
    }
  }, r.prototype._showEmptyState = function() {
    var e = this.ths.length || 1, n = this.dom.querySelector("template[" + m + "]"), o = document.createElement("td");
    o.setAttribute("colspan", String(e)), n && o.appendChild(document.importNode(n.content, !0));
    var s = document.createElement("tr");
    s.className = "ln-table__empty", s.appendChild(o), this.tbody.innerHTML = "", this.tbody.appendChild(s), i(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  };
  function i(e, n, o) {
    e.dispatchEvent(new CustomEvent(n, { bubbles: !0, detail: o || {} }));
  }
  function t() {
    var e = new MutationObserver(function(n) {
      n.forEach(function(o) {
        o.type === "childList" && o.addedNodes.forEach(function(s) {
          s.nodeType === 1 && l(s);
        });
      });
    });
    e.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[a] = u, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    u(document.body);
  }) : u(document.body);
})();
(function() {
  const h = "[data-ln-circular-progress]", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", m = 36, v = 16, p = 2 * Math.PI * v;
  function g(s) {
    l(s);
  }
  function u(s, d, c) {
    s.dispatchEvent(new CustomEvent(d, {
      bubbles: !0,
      detail: c || {}
    }));
  }
  function l(s) {
    const d = Array.from(s.querySelectorAll(h));
    for (const c of d)
      c[a] || (c[a] = new r(c));
    s.hasAttribute && s.hasAttribute("data-ln-circular-progress") && !s[a] && (s[a] = new r(s));
  }
  function r(s) {
    return this.dom = s, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), o.call(this), n.call(this), s.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  r.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function i(s, d) {
    const c = document.createElementNS(b, s);
    for (const f in d)
      c.setAttribute(f, d[f]);
    return c;
  }
  function t() {
    this.svg = i("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = i("circle", {
      cx: m / 2,
      cy: m / 2,
      r: v,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = i("circle", {
      cx: m / 2,
      cy: m / 2,
      r: v,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": p,
      "stroke-dashoffset": p,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function e() {
    new MutationObserver(function(d) {
      for (const c of d)
        if (c.type === "childList")
          for (const f of c.addedNodes)
            f.nodeType === 1 && l(f);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  e();
  function n() {
    const s = this, d = new MutationObserver(function(c) {
      for (const f of c)
        (f.attributeName === "data-ln-circular-progress" || f.attributeName === "data-ln-circular-progress-max") && o.call(s);
    });
    d.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = d;
  }
  function o() {
    const s = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, d = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let c = d > 0 ? s / d * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100);
    const f = p - c / 100 * p;
    this.progressCircle.setAttribute("stroke-dashoffset", f);
    const _ = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = _ !== null ? _ : Math.round(c) + "%", u(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: s,
      max: d,
      percentage: c
    });
  }
  window[a] = g, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const h = "data-ln-sortable", a = "lnSortable", b = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function m(r) {
    v(r);
  }
  function v(r) {
    const i = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && i.push(r);
    for (const t of i)
      t[a] || (t[a] = new p(t));
  }
  function p(r) {
    this.dom = r, this.isEnabled = !0, this._dragging = null;
    const i = this;
    return this._onPointerDown = function(t) {
      i.isEnabled && i._handlePointerDown(t);
    }, r.addEventListener("pointerdown", this._onPointerDown), this._onRequestEnable = function() {
      i.enable();
    }, this._onRequestDisable = function() {
      i.disable();
    }, r.addEventListener("ln-sortable:request-enable", this._onRequestEnable), r.addEventListener("ln-sortable:request-disable", this._onRequestDisable), this;
  }
  p.prototype.enable = function() {
    this.isEnabled = !0;
  }, p.prototype.disable = function() {
    this.isEnabled = !1;
  }, p.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), this.dom.removeEventListener("ln-sortable:request-enable", this._onRequestEnable), this.dom.removeEventListener("ln-sortable:request-disable", this._onRequestDisable), g(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, p.prototype._handlePointerDown = function(r) {
    let i = r.target.closest("[" + b + "]"), t;
    if (i) {
      for (t = i; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (t = r.target; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
      i = t;
    }
    const n = Array.from(this.dom.children).indexOf(t);
    if (u(this.dom, "ln-sortable:before-drag", {
      item: t,
      index: n
    }).defaultPrevented) return;
    r.preventDefault(), i.setPointerCapture(r.pointerId), this._dragging = t, t.classList.add("ln-sortable--dragging"), this.dom.classList.add("ln-sortable--active"), g(this.dom, "ln-sortable:drag-start", {
      item: t,
      index: n
    });
    const s = this, d = function(f) {
      s._handlePointerMove(f);
    }, c = function(f) {
      s._handlePointerEnd(f), i.removeEventListener("pointermove", d), i.removeEventListener("pointerup", c), i.removeEventListener("pointercancel", c);
    };
    i.addEventListener("pointermove", d), i.addEventListener("pointerup", c), i.addEventListener("pointercancel", c);
  }, p.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const i = Array.from(this.dom.children), t = this._dragging;
    for (const e of i)
      e.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const e of i) {
      if (e === t) continue;
      const n = e.getBoundingClientRect(), o = n.top + n.height / 2;
      if (r.clientY >= n.top && r.clientY < o) {
        e.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= o && r.clientY <= n.bottom) {
        e.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const i = this._dragging, t = Array.from(this.dom.children), e = t.indexOf(i);
    let n = null, o = null;
    for (const s of t) {
      if (s.classList.contains("ln-sortable--drop-before")) {
        n = s, o = "before";
        break;
      }
      if (s.classList.contains("ln-sortable--drop-after")) {
        n = s, o = "after";
        break;
      }
    }
    for (const s of t)
      s.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (i.classList.remove("ln-sortable--dragging"), this.dom.classList.remove("ln-sortable--active"), n && n !== i) {
      o === "before" ? this.dom.insertBefore(i, n) : this.dom.insertBefore(i, n.nextElementSibling);
      const d = Array.from(this.dom.children).indexOf(i);
      g(this.dom, "ln-sortable:reordered", {
        item: i,
        oldIndex: e,
        newIndex: d
      });
    }
    this._dragging = null;
  };
  function g(r, i, t) {
    r.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function u(r, i, t) {
    const e = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0,
      detail: t || {}
    });
    return r.dispatchEvent(e), e;
  }
  function l() {
    new MutationObserver(function(i) {
      for (const t of i)
        if (t.type === "childList")
          for (const e of t.addedNodes)
            e.nodeType === 1 && v(e);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = m, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-confirm", a = "lnConfirm";
  if (window[a] !== void 0) return;
  function m(l) {
    v(l);
  }
  function v(l) {
    const r = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && r.push(l);
    for (const i of r)
      i[a] || (i[a] = new p(i));
  }
  function p(l) {
    this.dom = l, this.confirming = !1, this.originalText = l.textContent.trim(), this.confirmText = l.getAttribute(h) || "Confirm?", this.revertTimer = null;
    const r = this;
    return this._onClick = function(i) {
      r.confirming ? r._reset() : (i.preventDefault(), i.stopImmediatePropagation(), r._enterConfirm());
    }, l.addEventListener("click", this._onClick), this;
  }
  p.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", ""), this.dom.textContent = this.confirmText;
    var l = this;
    this.revertTimer = setTimeout(function() {
      l._reset();
    }, 3e3), g(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._reset = function() {
    this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.dom.textContent = this.originalText, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  };
  function g(l, r, i) {
    l.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function u() {
    var l = new MutationObserver(function(r) {
      for (var i = 0; i < r.length; i++)
        if (r[i].type === "childList")
          for (var t = 0; t < r[i].addedNodes.length; t++) {
            var e = r[i].addedNodes[t];
            e.nodeType === 1 && v(e);
          }
    });
    l.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = m, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const h = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  var b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  }, m = {};
  function v(t) {
    return m[t] || (m[t] = document.querySelector('[data-ln-template="' + t + '"]')), m[t].content.cloneNode(!0);
  }
  function p(t) {
    g(t);
  }
  function g(t) {
    const e = Array.from(t.querySelectorAll("[" + h + "]"));
    t.hasAttribute && t.hasAttribute(h) && e.push(t);
    for (const n of e)
      n[a] || (n[a] = new u(n));
  }
  function u(t) {
    this.dom = t, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = t.getAttribute(h + "-default") || "", this.badgesEl = t.querySelector("[" + h + "-active]"), this.menuEl = t.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this._applyDefaultLang(), this._updateDropdown();
    const e = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && e.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && e.removeLanguage(n.detail.lang);
    }, t.addEventListener("ln-translations:request-add", this._onRequestAdd), t.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  u.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of t) {
      const n = e.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of n)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, u.prototype._detectExisting = function() {
    const t = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const e of t) {
      const n = e.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, u.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const t = this;
    let e = 0;
    for (const o in b) {
      if (!b.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      e++;
      const s = v("ln-translations-menu-item"), d = s.querySelector("[data-ln-translations-lang]");
      d.setAttribute("data-ln-translations-lang", o), d.textContent = b[o], d.addEventListener("click", function(c) {
        c.ctrlKey || c.metaKey || c.button === 1 || (c.preventDefault(), c.stopPropagation(), t.menuEl.dispatchEvent(new CustomEvent("ln-toggle:request-close")), t.addLanguage(o));
      }), this.menuEl.appendChild(s);
    }
    var n = this.dom.querySelector("[" + h + "-add]");
    n && (n.style.display = e === 0 ? "none" : "");
  }, u.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const t = this;
    this.activeLanguages.forEach(function(e) {
      const n = v("ln-translations-badge"), o = n.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", e);
      const s = o.querySelector("span");
      s.textContent = b[e] || e.toUpperCase();
      const d = o.querySelector("button");
      d.setAttribute("aria-label", "Remove " + (b[e] || e.toUpperCase())), d.addEventListener("click", function(c) {
        c.ctrlKey || c.metaKey || c.button === 1 || (c.preventDefault(), c.stopPropagation(), t.removeLanguage(e));
      }), t.badgesEl.appendChild(n);
    });
  }, u.prototype.addLanguage = function(t, e) {
    if (this.activeLanguages.has(t)) return;
    const n = b[t] || t;
    if (r(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: t,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(t), e = e || {};
    const s = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const d of s) {
      const c = d.getAttribute("data-ln-translatable"), f = d.getAttribute("data-ln-translations-prefix") || "", _ = d.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!_) continue;
      const E = _.cloneNode(!1);
      f ? E.name = f + "[trans][" + t + "][" + c + "]" : E.name = "trans[" + t + "][" + c + "]", E.value = e[c] !== void 0 ? e[c] : "", E.removeAttribute("id"), E.placeholder = n + " translation", E.setAttribute("data-ln-translatable-lang", t);
      const w = d.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), L = w.length > 0 ? w[w.length - 1] : _;
      L.parentNode.insertBefore(E, L.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), l(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: t,
      langName: n
    });
  }, u.prototype.removeLanguage = function(t) {
    if (!this.activeLanguages.has(t) || r(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: t
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + t + '"]');
    for (const o of n)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(t), this._updateDropdown(), this._updateBadges(), l(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: t
    });
  }, u.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, u.prototype.hasLanguage = function(t) {
    return this.activeLanguages.has(t);
  }, u.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const t = this.defaultLang, e = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of e)
      n.getAttribute("data-ln-translatable-lang") !== t && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  };
  function l(t, e, n) {
    t.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function r(t, e, n) {
    const o = new CustomEvent(e, {
      bubbles: !0,
      cancelable: !0,
      detail: n || {}
    });
    return t.dispatchEvent(o), o;
  }
  function i() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList")
          for (const o of n.addedNodes)
            o.nodeType === 1 && g(o);
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[a] = p, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
