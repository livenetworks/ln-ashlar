(function() {
  const h = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0)
    return;
  function E(t, n, e) {
    t.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function y(t, n, e) {
    var i = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return t.dispatchEvent(i), i;
  }
  function A(t) {
    if (!t.hasAttribute(h) || t[c])
      return;
    t[c] = !0;
    const n = f(t);
    _(n.links), g(n.forms);
  }
  function _(t) {
    t.forEach(function(n) {
      if (n._lnAjaxAttached) return;
      const e = n.getAttribute("href");
      e && e.includes("#") || (n._lnAjaxAttached = !0, n.addEventListener("click", function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1)
          return;
        i.preventDefault();
        const u = n.getAttribute("href");
        u && b("GET", u, null, n);
      }));
    });
  }
  function g(t) {
    t.forEach(function(n) {
      n._lnAjaxAttached || (n._lnAjaxAttached = !0, n.addEventListener("submit", function(e) {
        e.preventDefault();
        const i = n.method.toUpperCase(), u = n.action, l = new FormData(n);
        n.querySelectorAll('button, input[type="submit"]').forEach(function(d) {
          d.disabled = !0;
        }), b(i, u, l, n, function() {
          n.querySelectorAll('button, input[type="submit"]').forEach(function(d) {
            d.disabled = !1;
          });
        });
      }));
    });
  }
  function b(t, n, e, i, u) {
    var l = y(i, "ln-ajax:before-start", { method: t, url: n });
    if (l.defaultPrevented) return;
    E(i, "ln-ajax:start", { method: t, url: n }), i.classList.add("ln-ajax--loading");
    const d = document.createElement("span");
    d.className = "ln-ajax-spinner", i.appendChild(d);
    function r() {
      i.classList.remove("ln-ajax--loading");
      const w = i.querySelector(".ln-ajax-spinner");
      w && w.remove(), u && u();
    }
    let s = n;
    const p = document.querySelector('meta[name="csrf-token"]'), v = p ? p.getAttribute("content") : null;
    e instanceof FormData && v && e.append("_token", v);
    const T = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (v && (T.headers["X-CSRF-TOKEN"] = v), t === "GET" && e) {
      const w = new URLSearchParams(e);
      s = n + (n.includes("?") ? "&" : "?") + w.toString();
    } else t !== "GET" && e && (T.body = e);
    fetch(s, T).then((w) => w.json()).then((w) => {
      if (w.title && (document.title = w.title), w.content)
        for (let L in w.content) {
          const O = document.getElementById(L);
          O && (O.innerHTML = w.content[L]);
        }
      if (i.tagName === "A") {
        const L = i.getAttribute("href");
        L && window.history.pushState({ ajax: !0 }, "", L);
      } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", s);
      E(i, "ln-ajax:success", { method: t, url: s, data: w }), E(i, "ln-ajax:complete", { method: t, url: s }), r();
    }).catch((w) => {
      E(i, "ln-ajax:error", { method: t, url: s, error: w }), E(i, "ln-ajax:complete", { method: t, url: s }), r();
    });
  }
  function f(t) {
    const n = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(h) !== "false" ? n.links.push(t) : t.tagName === "FORM" && t.getAttribute(h) !== "false" ? n.forms.push(t) : (n.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function a() {
    new MutationObserver(function(n) {
      n.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(i) {
          if (i.nodeType === 1 && (A(i), !i.hasAttribute(h))) {
            i.querySelectorAll("[" + h + "]").forEach(function(d) {
              A(d);
            });
            var u = i.closest && i.closest("[" + h + "]");
            if (u && u.getAttribute(h) !== "false") {
              var l = f(i);
              console.log("[ln-ajax] re-attach on injected node:", i, "links:", l.links.length, "forms:", l.forms.length), _(l.links), g(l.forms);
            }
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function o() {
    document.querySelectorAll("[" + h + "]").forEach(function(t) {
      A(t);
    });
  }
  window[c] = A, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0)
    return;
  function E(t, n, e) {
    t.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: Object.assign({ modalId: t.id, target: t }, {})
    }));
  }
  function y(t, n) {
    var e = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: { modalId: t.id, target: t }
    });
    return t.dispatchEvent(e), e;
  }
  function A(t) {
    const n = document.getElementById(t);
    if (!n) {
      console.warn('Modal with ID "' + t + '" not found');
      return;
    }
    var e = y(n, "ln-modal:before-open");
    e.defaultPrevented || (n.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"), E(n, "ln-modal:open"));
  }
  function _(t) {
    const n = document.getElementById(t);
    if (n) {
      var e = y(n, "ln-modal:before-close");
      e.defaultPrevented || (n.classList.remove("ln-modal--open"), E(n, "ln-modal:close"), document.querySelector(".ln-modal.ln-modal--open") || document.body.classList.remove("ln-modal-open"));
    }
  }
  function g(t) {
    const n = document.getElementById(t);
    if (!n) {
      console.warn('Modal with ID "' + t + '" not found');
      return;
    }
    n.classList.contains("ln-modal--open") ? _(t) : A(t);
  }
  function b(t) {
    const n = t.querySelectorAll("[data-ln-modal-close]"), e = t.id;
    n.forEach(function(i) {
      i._lnModalCloseAttached || (i._lnModalCloseAttached = !0, i.addEventListener("click", function(u) {
        u.preventDefault(), _(e);
      }));
    });
  }
  function f(t) {
    t.forEach(function(n) {
      n._lnModalAttached || (n._lnModalAttached = !0, n.addEventListener("click", function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1)
          return;
        e.preventDefault();
        const i = n.getAttribute(h);
        i && g(i);
      }));
    });
  }
  function a() {
    const t = document.querySelectorAll("[" + h + "]");
    f(t), document.querySelectorAll(".ln-modal").forEach(function(e) {
      b(e);
    }), document.addEventListener("keydown", function(e) {
      e.key === "Escape" && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(u) {
        _(u.id);
      });
    });
  }
  function o() {
    new MutationObserver(function(n) {
      n.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(i) {
          if (i.nodeType === 1) {
            i.hasAttribute(h) && f([i]);
            const u = i.querySelectorAll("[" + h + "]");
            u.length > 0 && f(u), i.id && i.classList.contains("ln-modal") && b(i);
            const l = i.querySelectorAll(".ln-modal");
            l.length > 0 && l.forEach(function(d) {
              b(d);
            });
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    open: A,
    close: _,
    toggle: g
  }, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0)
    return;
  const E = /* @__PURE__ */ new WeakMap();
  var y = [];
  if (!history._lnNavPatched) {
    var A = history.pushState;
    history.pushState = function() {
      A.apply(history, arguments), y.forEach(function(t) {
        t();
      });
    }, history._lnNavPatched = !0;
  }
  function _(t) {
    if (!t.hasAttribute(h) || E.has(t)) return;
    const n = t.getAttribute(h);
    if (!n) return;
    const e = g(t, n);
    E.set(t, e);
  }
  function g(t, n) {
    let e = Array.from(t.querySelectorAll("a"));
    f(e, n, window.location.pathname);
    var i = function() {
      e = Array.from(t.querySelectorAll("a")), f(e, n, window.location.pathname);
    };
    window.addEventListener("popstate", i), y.push(i);
    const u = new MutationObserver(function(l) {
      l.forEach(function(d) {
        d.type === "childList" && (d.addedNodes.forEach(function(r) {
          if (r.nodeType === 1) {
            if (r.tagName === "A")
              e.push(r), f([r], n, window.location.pathname);
            else if (r.querySelectorAll) {
              const s = Array.from(r.querySelectorAll("a"));
              e = e.concat(s), f(s, n, window.location.pathname);
            }
          }
        }), d.removedNodes.forEach(function(r) {
          if (r.nodeType === 1) {
            if (r.tagName === "A")
              e = e.filter(function(s) {
                return s !== r;
              });
            else if (r.querySelectorAll) {
              const s = Array.from(r.querySelectorAll("a"));
              e = e.filter(function(p) {
                return !s.includes(p);
              });
            }
          }
        }));
      });
    });
    return u.observe(t, { childList: !0, subtree: !0 }), { navElement: t, activeClass: n, observer: u };
  }
  function b(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function f(t, n, e) {
    const i = b(e);
    t.forEach(function(u) {
      const l = u.getAttribute("href");
      if (!l) return;
      const d = b(l);
      u.classList.remove(n);
      const r = d === i, s = d !== "/" && i.startsWith(d + "/");
      (r || s) && u.classList.add(n);
    });
  }
  function a() {
    var t = new MutationObserver(function(n) {
      n.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(i) {
          i.nodeType === 1 && (i.hasAttribute && i.hasAttribute(h) && _(i), i.querySelectorAll && i.querySelectorAll("[" + h + "]").forEach(_));
        });
      });
    });
    t.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[c] = _;
  function o() {
    document.querySelectorAll("[" + h + "]").forEach(_);
  }
  a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
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
  function E(g) {
    if (c.has(g))
      return;
    const b = g.getAttribute("data-ln-select");
    let f = {};
    if (b && b.trim() !== "")
      try {
        f = JSON.parse(b);
      } catch (t) {
        console.warn("Invalid JSON in data-ln-select attribute:", t);
      }
    const o = { ...{
      // Allow clearing selection
      allowEmptyOption: !0,
      // Show dropdown arrow
      controlInput: null,
      // Disable creation by default
      create: !1,
      // Highlight matching text
      highlight: !0,
      // Close dropdown after selection (for single select)
      closeAfterSelect: !0,
      // Placeholder handling
      placeholder: g.getAttribute("placeholder") || "Select...",
      // Load throttle for search
      loadThrottle: 300
    }, ...f };
    try {
      const t = new h(g, o);
      c.set(g, t);
      const n = g.closest("form");
      n && n.addEventListener("reset", () => {
        setTimeout(() => {
          t.clear(), t.clearOptions(), t.sync();
        }, 0);
      });
    } catch (t) {
      console.error("Failed to initialize Tom Select:", t);
    }
  }
  function y(g) {
    const b = c.get(g);
    b && (b.destroy(), c.delete(g));
  }
  function A() {
    document.querySelectorAll("select[data-ln-select]").forEach(E);
  }
  function _() {
    new MutationObserver((b) => {
      b.forEach((f) => {
        f.addedNodes.forEach((a) => {
          a.nodeType === 1 && (a.matches && a.matches("select[data-ln-select]") && E(a), a.querySelectorAll && a.querySelectorAll("select[data-ln-select]").forEach(E));
        }), f.removedNodes.forEach((a) => {
          a.nodeType === 1 && (a.matches && a.matches("select[data-ln-select]") && y(a), a.querySelectorAll && a.querySelectorAll("select[data-ln-select]").forEach(y));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    A(), _();
  }) : (A(), _()), window.lnSelect = {
    initialize: E,
    destroy: y,
    getInstance: (g) => c.get(g)
  };
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function E(a = document.body) {
    y(a);
  }
  function y(a) {
    if (a.nodeType !== 1) return;
    let o = Array.from(a.querySelectorAll("[" + h + "]"));
    a.hasAttribute && a.hasAttribute(h) && o.push(a), o.forEach(function(t) {
      t[c] || (t[c] = new _(t));
    });
  }
  function A() {
    const a = (location.hash || "").replace("#", ""), o = {};
    return a && a.split("&").forEach(function(t) {
      const n = t.indexOf(":");
      n > 0 && (o[t.slice(0, n)] = t.slice(n + 1));
    }), o;
  }
  function _(a) {
    return this.dom = a, g.call(this), this;
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
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.tabs.forEach((a) => {
      a.addEventListener("click", () => {
        const o = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (o)
          if (this.hashEnabled) {
            const t = A();
            t[this.nsKey] = o;
            const n = Object.keys(t).map(function(e) {
              return e + ":" + t[e];
            }).join("&");
            location.hash === "#" + n ? this.activate(o) : location.hash = n;
          } else
            this.activate(o);
      });
    }), this._hashHandler = () => {
      if (!this.hashEnabled) return;
      const a = A();
      this.activate(this.nsKey in a ? a[this.nsKey] : this.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  _.prototype.activate = function(a) {
    var o;
    (!a || !(a in this.mapPanels)) && (a = this.defaultKey);
    for (const t in this.mapTabs) {
      const n = this.mapTabs[t];
      t === a ? (n.setAttribute("data-active", ""), n.setAttribute("aria-selected", "true")) : (n.removeAttribute("data-active"), n.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const n = this.mapPanels[t], e = t === a;
      n.classList.toggle("hidden", !e), n.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (o = this.mapPanels[a]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    b(this.dom, "ln-tabs:change", { key: a, tab: this.mapTabs[a], panel: this.mapPanels[a] });
  };
  function b(a, o, t) {
    a.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function f() {
    new MutationObserver(function(o) {
      o.forEach(function(t) {
        t.addedNodes.forEach(function(n) {
          y(n);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  f(), window[c] = E, E(document.body);
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function E(a) {
    y(a), A(a);
  }
  function y(a) {
    var o = Array.from(a.querySelectorAll("[" + h + "]"));
    a.hasAttribute && a.hasAttribute(h) && o.push(a), o.forEach(function(t) {
      t[c] || (t[c] = new _(t));
    });
  }
  function A(a) {
    var o = Array.from(a.querySelectorAll("[data-ln-toggle-for]"));
    a.hasAttribute && a.hasAttribute("data-ln-toggle-for") && o.push(a), o.forEach(function(t) {
      t[c + "Trigger"] || (t[c + "Trigger"] = !0, t.addEventListener("click", function(n) {
        if (!(n.ctrlKey || n.metaKey || n.button === 1)) {
          n.preventDefault();
          var e = t.getAttribute("data-ln-toggle-for"), i = document.getElementById(e);
          if (!(!i || !i[c])) {
            var u = t.getAttribute("data-ln-toggle-action") || "toggle";
            i[c][u]();
          }
        }
      }));
    });
  }
  function _(a) {
    return this.dom = a, this.isOpen = a.getAttribute(h) === "open", this.isOpen && a.classList.add("open"), this;
  }
  _.prototype.open = function() {
    if (!this.isOpen) {
      var a = b(this.dom, "ln-toggle:before-open", { target: this.dom });
      a.defaultPrevented || (this.isOpen = !0, this.dom.classList.add("open"), g(this.dom, "ln-toggle:open", { target: this.dom }));
    }
  }, _.prototype.close = function() {
    if (this.isOpen) {
      var a = b(this.dom, "ln-toggle:before-close", { target: this.dom });
      a.defaultPrevented || (this.isOpen = !1, this.dom.classList.remove("open"), g(this.dom, "ln-toggle:close", { target: this.dom }));
    }
  }, _.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  };
  function g(a, o, t) {
    a.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function b(a, o, t) {
    var n = new CustomEvent(o, {
      bubbles: !0,
      cancelable: !0,
      detail: t || {}
    });
    return a.dispatchEvent(n), n;
  }
  function f() {
    var a = new MutationObserver(function(o) {
      o.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(n) {
          n.nodeType === 1 && (y(n), A(n));
        });
      });
    });
    a.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = E, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function E(b) {
    y(b);
  }
  function y(b) {
    var f = Array.from(b.querySelectorAll("[" + h + "]"));
    b.hasAttribute && b.hasAttribute(h) && f.push(b), f.forEach(function(a) {
      a[c] || (a[c] = new A(a));
    });
  }
  function A(b) {
    return this.dom = b, b.addEventListener("ln-toggle:open", function(f) {
      var a = b.querySelectorAll("[data-ln-toggle]");
      a.forEach(function(o) {
        o !== f.detail.target && o.lnToggle && o.lnToggle.isOpen && o.lnToggle.close();
      }), _(b, "ln-accordion:change", { target: f.detail.target });
    }), this;
  }
  function _(b, f, a) {
    b.dispatchEvent(new CustomEvent(f, {
      bubbles: !0,
      detail: a || {}
    }));
  }
  function g() {
    var b = new MutationObserver(function(f) {
      f.forEach(function(a) {
        a.type === "childList" && a.addedNodes.forEach(function(o) {
          o.nodeType === 1 && y(o);
        });
      });
    });
    b.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = E, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const h = "data-ln-toast", c = "lnToast", E = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function y(e = document.body) {
    return A(e), t;
  }
  function A(e) {
    if (!e || e.nodeType !== 1) return;
    let i = Array.from(e.querySelectorAll("[" + h + "]"));
    e.hasAttribute && e.hasAttribute(h) && i.push(e), i.forEach((u) => {
      u[c] || new _(u);
    });
  }
  function _(e) {
    return this.dom = e, e[c] = this, this.timeoutDefault = parseInt(e.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(e.getAttribute("data-ln-toast-max") || "5", 10), Array.from(e.querySelectorAll("[data-ln-toast-item]")).forEach((i) => {
      g(i);
    }), this;
  }
  function g(e) {
    const i = ((e.getAttribute("data-type") || "info") + "").toLowerCase(), u = e.getAttribute("data-title"), l = (e.innerText || e.textContent || "").trim();
    e.className = "ln-toast__item", e.removeAttribute("data-ln-toast-item");
    const d = document.createElement("div");
    d.className = "ln-toast__card ln-toast__card--" + i, d.setAttribute("role", i === "error" ? "alert" : "status"), d.setAttribute("aria-live", i === "error" ? "assertive" : "polite");
    const r = document.createElement("div");
    r.className = "ln-toast__side", r.innerHTML = E[i] || E.info;
    const s = document.createElement("div");
    s.className = "ln-toast__content";
    const p = document.createElement("div");
    p.className = "ln-toast__head";
    const v = document.createElement("strong");
    v.className = "ln-toast__title", v.textContent = u || (i === "success" ? "Success" : i === "error" ? "Error" : i === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close ln-icon-close", T.setAttribute("aria-label", "Close"), T.addEventListener("click", () => f(e)), p.appendChild(v), s.appendChild(p), s.appendChild(T), l) {
      const w = document.createElement("div");
      w.className = "ln-toast__body";
      const L = document.createElement("p");
      L.textContent = l, w.appendChild(L), s.appendChild(w);
    }
    d.appendChild(r), d.appendChild(s), e.innerHTML = "", e.appendChild(d), requestAnimationFrame(() => e.classList.add("ln-toast__item--in"));
  }
  function b(e, i) {
    for (; e.dom.children.length >= e.max; ) e.dom.removeChild(e.dom.firstElementChild);
    e.dom.appendChild(i), requestAnimationFrame(() => i.classList.add("ln-toast__item--in"));
  }
  function f(e) {
    !e || !e.parentNode || (clearTimeout(e._timer), e.classList.remove("ln-toast__item--in"), e.classList.add("ln-toast__item--out"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 200));
  }
  function a(e = {}) {
    let i = e.container;
    if (typeof i == "string" && (i = document.querySelector(i)), i instanceof HTMLElement || (i = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !i) return null;
    const u = i[c] || new _(i), l = Number.isFinite(e.timeout) ? e.timeout : u.timeoutDefault, d = (e.type || "info").toLowerCase(), r = document.createElement("li");
    r.className = "ln-toast__item";
    const s = document.createElement("div");
    s.className = "ln-toast__card ln-toast__card--" + d, s.setAttribute("role", d === "error" ? "alert" : "status"), s.setAttribute("aria-live", d === "error" ? "assertive" : "polite");
    const p = document.createElement("div");
    p.className = "ln-toast__side", p.innerHTML = E[d] || E.info;
    const v = document.createElement("div");
    v.className = "ln-toast__content";
    const T = document.createElement("div");
    T.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = e.title || (d === "success" ? "Success" : d === "error" ? "Error" : d === "warn" ? "Warning" : "Information");
    const L = document.createElement("button");
    if (L.type = "button", L.className = "ln-toast__close ln-icon-close", L.setAttribute("aria-label", "Close"), L.addEventListener("click", () => f(r)), T.appendChild(w), v.appendChild(T), v.appendChild(L), e.message || e.data && e.data.errors) {
      const O = document.createElement("div");
      if (O.className = "ln-toast__body", e.message)
        if (Array.isArray(e.message)) {
          const S = document.createElement("ul");
          e.message.forEach(function(M) {
            const m = document.createElement("li");
            m.textContent = M, S.appendChild(m);
          }), O.appendChild(S);
        } else {
          const S = document.createElement("p");
          S.textContent = e.message, O.appendChild(S);
        }
      if (e.data && e.data.errors) {
        const S = document.createElement("ul");
        Object.values(e.data.errors).flat().forEach((M) => {
          const m = document.createElement("li");
          m.textContent = M, S.appendChild(m);
        }), O.appendChild(S);
      }
      v.appendChild(O);
    }
    return s.appendChild(p), s.appendChild(v), r.appendChild(s), b(u, r), l > 0 && (r._timer = setTimeout(() => f(r), l)), r;
  }
  function o(e) {
    let i = e;
    typeof i == "string" && (i = document.querySelector(i)), i instanceof HTMLElement || (i = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), i && Array.from(i.children).forEach(f);
  }
  const t = function(e) {
    return y(e);
  };
  t.enqueue = a, t.clear = o, new MutationObserver((e) => {
    e.forEach((i) => i.addedNodes.forEach((u) => A(u)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[c] = t, window.addEventListener("ln-toast:enqueue", function(e) {
    e.detail && t.enqueue(e.detail);
  }), y(document.body);
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", E = "data-ln-upload-dict", y = "data-ln-upload-accept", A = "data-ln-upload-context";
  if (window[c] !== void 0)
    return;
  function _(i, u) {
    const l = i.querySelector("[" + E + '="' + u + '"]');
    return l ? l.textContent : u;
  }
  function g(i) {
    if (i === 0) return "0 B";
    const u = 1024, l = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(i) / Math.log(u));
    return parseFloat((i / Math.pow(u, d)).toFixed(1)) + " " + l[d];
  }
  function b(i) {
    return i.split(".").pop().toLowerCase();
  }
  function f(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "ln-icon-file-" + i : "ln-icon-file";
  }
  function a(i, u) {
    if (!u) return !0;
    const l = "." + b(i.name);
    return u.split(",").map(function(r) {
      return r.trim().toLowerCase();
    }).includes(l.toLowerCase());
  }
  function o(i, u, l) {
    i.dispatchEvent(new CustomEvent(u, {
      bubbles: !0,
      detail: l
    }));
  }
  function t(i) {
    if (i.hasAttribute("data-ln-upload-initialized")) return;
    i.setAttribute("data-ln-upload-initialized", "true");
    const u = i.querySelector(".ln-upload__zone"), l = i.querySelector(".ln-upload__list"), d = i.getAttribute(y) || "";
    let r = i.querySelector('input[type="file"]');
    r || (r = document.createElement("input"), r.type = "file", r.multiple = !0, r.style.display = "none", d && (r.accept = d.split(",").map(function(m) {
      return m = m.trim(), m.startsWith(".") ? m : "." + m;
    }).join(",")), i.appendChild(r));
    const s = i.getAttribute(h) || "/files/upload", p = i.getAttribute(A) || "", v = /* @__PURE__ */ new Map();
    let T = 0;
    function w() {
      const m = document.querySelector('meta[name="csrf-token"]');
      return m ? m.getAttribute("content") : "";
    }
    function L(m) {
      if (!a(m, d)) {
        const q = _(i, "invalid-type");
        o(i, "ln-upload:invalid", {
          file: m,
          message: q
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: q || "This file type is not allowed"
          }
        }));
        return;
      }
      const C = "file-" + ++T, D = b(m.name), N = f(D), I = document.createElement("li");
      I.className = "ln-upload__item ln-upload__item--uploading " + N, I.setAttribute("data-file-id", C);
      const H = document.createElement("span");
      H.className = "ln-upload__name", H.textContent = m.name;
      const k = document.createElement("span");
      k.className = "ln-upload__size", k.textContent = "0%";
      const R = document.createElement("button");
      R.type = "button", R.className = "ln-upload__remove ln-icon-close", R.title = _(i, "remove"), R.textContent = "×", R.disabled = !0;
      const z = document.createElement("div");
      z.className = "ln-upload__progress";
      const F = document.createElement("div");
      F.className = "ln-upload__progress-bar", z.appendChild(F), I.appendChild(H), I.appendChild(k), I.appendChild(R), I.appendChild(z), l.appendChild(I);
      const U = new FormData();
      U.append("file", m), U.append("context", p);
      const x = new XMLHttpRequest();
      x.upload.addEventListener("progress", function(q) {
        if (q.lengthComputable) {
          const B = Math.round(q.loaded / q.total * 100);
          F.style.width = B + "%", k.textContent = B + "%";
        }
      }), x.addEventListener("load", function() {
        if (x.status >= 200 && x.status < 300) {
          var q;
          try {
            q = JSON.parse(x.responseText);
          } catch {
            j("Invalid response");
            return;
          }
          I.classList.remove("ln-upload__item--uploading"), k.textContent = g(q.size || m.size), R.disabled = !1, v.set(C, {
            serverId: q.id,
            name: q.name,
            size: q.size
          }), O(), o(i, "ln-upload:uploaded", {
            localId: C,
            serverId: q.id,
            name: q.name
          });
        } else {
          var B = "Upload failed";
          try {
            var P = JSON.parse(x.responseText);
            B = P.message || B;
          } catch {
          }
          j(B);
        }
      }), x.addEventListener("error", function() {
        j("Network error");
      });
      function j(q) {
        I.classList.remove("ln-upload__item--uploading"), I.classList.add("ln-upload__item--error"), F.style.width = "100%", k.textContent = _(i, "error"), R.disabled = !1, o(i, "ln-upload:error", {
          file: m,
          message: q
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: q || _(i, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      x.open("POST", s), x.setRequestHeader("X-CSRF-TOKEN", w()), x.setRequestHeader("Accept", "application/json"), x.send(U);
    }
    function O() {
      i.querySelectorAll('input[name="file_ids[]"]').forEach(function(m) {
        m.remove();
      }), v.forEach(function(m) {
        const C = document.createElement("input");
        C.type = "hidden", C.name = "file_ids[]", C.value = m.serverId, i.appendChild(C);
      });
    }
    function S(m) {
      const C = v.get(m), D = l.querySelector('[data-file-id="' + m + '"]');
      if (!C || !C.serverId) {
        D && D.remove(), v.delete(m), O();
        return;
      }
      D && D.classList.add("ln-upload__item--deleting"), fetch("/files/" + C.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": w(),
          Accept: "application/json"
        }
      }).then((N) => {
        N.status === 200 ? (D && D.remove(), v.delete(m), O(), o(i, "ln-upload:removed", {
          localId: m,
          serverId: C.serverId
        })) : (D && D.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: _(i, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((N) => {
        console.error("Delete error:", N), D && D.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function M(m) {
      Array.from(m).forEach(function(C) {
        L(C);
      }), r.value = "";
    }
    u.addEventListener("click", function() {
      r.click();
    }), r.addEventListener("change", function() {
      M(this.files);
    }), u.addEventListener("dragenter", function(m) {
      m.preventDefault(), m.stopPropagation(), u.classList.add("ln-upload__zone--dragover");
    }), u.addEventListener("dragover", function(m) {
      m.preventDefault(), m.stopPropagation(), u.classList.add("ln-upload__zone--dragover");
    }), u.addEventListener("dragleave", function(m) {
      m.preventDefault(), m.stopPropagation(), u.classList.remove("ln-upload__zone--dragover");
    }), u.addEventListener("drop", function(m) {
      m.preventDefault(), m.stopPropagation(), u.classList.remove("ln-upload__zone--dragover"), M(m.dataTransfer.files);
    }), l.addEventListener("click", function(m) {
      if (m.target.classList.contains("ln-upload__remove")) {
        const C = m.target.closest(".ln-upload__item");
        C && S(C.getAttribute("data-file-id"));
      }
    }), i.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(v.values()).map(function(m) {
          return m.serverId;
        });
      },
      getFiles: function() {
        return Array.from(v.values());
      },
      clear: function() {
        v.forEach(function(m) {
          m.serverId && fetch("/files/" + m.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": w(),
              Accept: "application/json"
            }
          });
        }), v.clear(), l.innerHTML = "", O(), o(i, "ln-upload:cleared", {});
      }
    };
  }
  function n() {
    document.querySelectorAll("[" + h + "]").forEach(t);
  }
  function e() {
    new MutationObserver(function(u) {
      u.forEach(function(l) {
        l.type === "childList" && l.addedNodes.forEach(function(d) {
          d.nodeType === 1 && (d.hasAttribute(h) && t(d), d.querySelectorAll("[" + h + "]").forEach(t));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    init: t,
    initAll: n
  }, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0)
    return;
  function c(f, a, o) {
    f.dispatchEvent(new CustomEvent(a, {
      bubbles: !0,
      detail: o
    }));
  }
  function E(f) {
    return f.hostname && f.hostname !== window.location.hostname;
  }
  function y(f) {
    f.getAttribute("data-ln-external-link") !== "processed" && E(f) && (f.target = "_blank", f.rel = "noopener noreferrer", f.setAttribute("data-ln-external-link", "processed"), c(f, "ln-external-links:processed", {
      link: f,
      href: f.href
    }));
  }
  function A(f) {
    f = f || document.body, f.querySelectorAll("a, area").forEach(function(o) {
      y(o);
    });
  }
  function _() {
    document.body.addEventListener("click", function(f) {
      const a = f.target.closest("a, area");
      a && a.getAttribute("data-ln-external-link") === "processed" && c(a, "ln-external-links:clicked", {
        link: a,
        href: a.href,
        text: a.textContent || a.title || ""
      });
    });
  }
  function g() {
    new MutationObserver(function(a) {
      a.forEach(function(o) {
        o.type === "childList" && o.addedNodes.forEach(function(t) {
          if (t.nodeType === 1) {
            t.matches && (t.matches("a") || t.matches("area")) && y(t);
            const n = t.querySelectorAll && t.querySelectorAll("a, area");
            n && n.forEach(y);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function b() {
    _(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      A();
    }) : A();
  }
  window[h] = {
    process: A
  }, b();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  function E(l, d, r) {
    var s = new CustomEvent(d, {
      bubbles: !0,
      cancelable: !0,
      detail: r || {}
    });
    return l.dispatchEvent(s), s;
  }
  var y = null;
  function A() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function _(l) {
    y && (y.textContent = l, y.classList.add("ln-link-status--visible"));
  }
  function g() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function b(l, d) {
    if (!d.target.closest("a, button, input, select, textarea")) {
      var r = l.querySelector("a");
      if (r) {
        var s = r.getAttribute("href");
        if (s) {
          if (d.ctrlKey || d.metaKey || d.button === 1) {
            window.open(s, "_blank");
            return;
          }
          var p = E(l, "ln-link:navigate", { target: l, href: s, link: r });
          p.defaultPrevented || r.click();
        }
      }
    }
  }
  function f(l) {
    var d = l.querySelector("a");
    if (d) {
      var r = d.getAttribute("href");
      r && _(r);
    }
  }
  function a() {
    g();
  }
  function o(l) {
    l._lnLinkInit || (l._lnLinkInit = !0, l.querySelector("a") && (l.addEventListener("click", function(d) {
      b(l, d);
    }), l.addEventListener("mouseenter", function() {
      f(l);
    }), l.addEventListener("mouseleave", a)));
  }
  function t(l) {
    if (!l._lnLinkInit) {
      l._lnLinkInit = !0;
      var d = l.tagName;
      if (d === "TABLE" || d === "TBODY") {
        var r = d === "TABLE" && l.querySelector("tbody") || l, s = r.querySelectorAll("tr");
        s.forEach(o);
      } else o(l);
    }
  }
  function n(l) {
    l.hasAttribute && l.hasAttribute(h) && t(l);
    var d = l.querySelectorAll ? l.querySelectorAll("[" + h + "]") : [];
    d.forEach(t);
  }
  function e() {
    var l = new MutationObserver(function(d) {
      d.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(s) {
          if (s.nodeType === 1 && (n(s), s.tagName === "TR")) {
            var p = s.closest("[" + h + "]");
            p && o(s);
          }
        });
      });
    });
    l.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function i(l) {
    n(l);
  }
  window[c] = { init: i };
  function u() {
    A(), e(), i(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0)
    return;
  function E(o) {
    var t = o.getAttribute("data-ln-progress");
    return t !== null && t !== "";
  }
  function y(o) {
    _(o);
  }
  function A(o, t, n) {
    o.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function _(o) {
    var t = Array.from(o.querySelectorAll(h));
    t.forEach(function(n) {
      E(n) && !n[c] && (n[c] = new g(n));
    }), o.hasAttribute && o.hasAttribute("data-ln-progress") && E(o) && !o[c] && (o[c] = new g(o));
  }
  function g(o) {
    return this.dom = o, a.call(this), f.call(this), this;
  }
  function b() {
    var o = new MutationObserver(function(t) {
      t.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(e) {
          e.nodeType === 1 && _(e);
        });
      });
    });
    o.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  b();
  function f() {
    var o = this, t = new MutationObserver(function(n) {
      n.forEach(function(e) {
        (e.attributeName === "data-ln-progress" || e.attributeName === "data-ln-progress-max") && a.call(o);
      });
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    });
  }
  function a() {
    var o = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100, n = t > 0 ? o / t * 100 : 0;
    n < 0 && (n = 0), n > 100 && (n = 100), this.dom.style.width = n + "%", A(this.dom, "ln-progress:change", { target: this.dom, value: o, max: t, percentage: n });
  }
  window[c] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnProgress(document.body);
  }) : window.lnProgress(document.body);
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", E = "data-ln-filter-initialized", y = "data-ln-filter-key", A = "data-ln-filter-value", _ = "data-ln-filter-hide";
  if (window[c] !== void 0) return;
  function g(t) {
    b(t);
  }
  function b(t) {
    var n = Array.from(t.querySelectorAll("[" + h + "]"));
    t.hasAttribute && t.hasAttribute(h) && n.push(t), n.forEach(function(e) {
      e[c] || (e[c] = new f(e));
    });
  }
  function f(t) {
    return t.hasAttribute(E) ? this : (this.dom = t, this.targetId = t.getAttribute(h), this.buttons = Array.from(t.querySelectorAll("button")), this._attachHandlers(), t.setAttribute(E, ""), this);
  }
  f.prototype._attachHandlers = function() {
    var t = this;
    this.buttons.forEach(function(n) {
      n[c + "Bound"] || (n[c + "Bound"] = !0, n.addEventListener("click", function(e) {
        t.buttons.forEach(function(i) {
          i.classList.remove("active");
        }), n.classList.add("active"), t._filter(n);
      }));
    });
  }, f.prototype._filter = function(t) {
    var n = document.getElementById(this.targetId);
    if (n) {
      var e = t.getAttribute(y), i = t.getAttribute(A);
      if (e) {
        for (var u = n.querySelectorAll("[data-" + e + "]"), l = 0, d = u.length, r = 0; r < u.length; r++) {
          var s = u[r];
          s.removeAttribute(_), i !== "" && !s.getAttribute("data-" + e).toLowerCase().includes(i.toLowerCase()) ? s.setAttribute(_, "true") : l++;
        }
        a(this.dom, "ln-filter:change", {
          targetId: this.targetId,
          key: e,
          value: i,
          matched: l,
          total: d
        });
      }
    }
  };
  function a(t, n, e) {
    t.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function o() {
    var t = new MutationObserver(function(n) {
      n.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(i) {
          i.nodeType === 1 && b(i);
        });
      });
    });
    t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = g, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", E = "data-ln-search-initialized", y = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function _(o) {
    g(o);
  }
  function g(o) {
    var t = Array.from(o.querySelectorAll("[" + h + "]"));
    o.hasAttribute && o.hasAttribute(h) && t.push(o), t.forEach(function(n) {
      n[c] || (n[c] = new b(n));
    });
  }
  function b(o) {
    return o.hasAttribute(E) ? this : (this.dom = o, this.targetId = o.getAttribute(h), this.input = o.querySelector('[name="search"]') || o.querySelector('input[type="search"]') || o.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), o.setAttribute(E, ""), this);
  }
  b.prototype._attachHandler = function() {
    if (this.input) {
      var o = this;
      this.input.addEventListener("input", function() {
        clearTimeout(o._debounceTimer), o._debounceTimer = setTimeout(function() {
          o._search(o.input.value.trim().toLowerCase());
        }, 150);
      });
    }
  }, b.prototype._search = function(o) {
    var t = document.getElementById(this.targetId);
    if (t) {
      for (var n = t.children, e = 0, i = n.length, u = 0; u < n.length; u++) {
        var l = n[u];
        l.removeAttribute(y), o && !l.textContent.replace(/\s+/g, " ").toLowerCase().includes(o) ? l.setAttribute(y, "true") : e++;
      }
      f(this.dom, "ln-search:change", {
        targetId: this.targetId,
        term: o,
        matched: e,
        total: i
      });
    }
  };
  function f(o, t, n) {
    o.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function a() {
    var o = new MutationObserver(function(t) {
      t.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(e) {
          e.nodeType === 1 && g(e);
        });
      });
    });
    o.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = _, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", E = "data-ln-table-search", y = "data-ln-table-clear", A = "data-ln-sort", _ = "data-ln-sort-active", g = "data-ln-table-initialized";
  var o = typeof Intl < "u" ? new Intl.Collator("mk", { sensitivity: "base" }) : null;
  if (window[c] !== void 0) return;
  function t(r) {
    n(r);
  }
  function n(r) {
    var s = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && s.push(r), s.forEach(function(p) {
      p[c] || (p[c] = new e(p));
    });
  }
  function e(r) {
    if (r.hasAttribute(g)) return this;
    this.dom = r, this.table = r.querySelector("table"), this.tbody = r.querySelector("tbody"), this.thead = r.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.countEl = r.querySelector(".ln-table__count"), this.footerCountEl = r.querySelector(".ln-table__footer strong"), this.timingEl = r.querySelector(".ln-table__timing"), this.searchInput = r.id ? document.querySelector("[" + E + '="' + r.id + '"]') : null, this._data = [], this._filteredData = [], this._sortCol = -1, this._sortDir = null, this._searchTerm = "", this._totalCount = 0, this._debounceTimer = null, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    var s = r.querySelector(".ln-table__toolbar");
    if (s) {
      var p = s.offsetHeight;
      r.style.setProperty("--ln-table-toolbar-h", p + "px");
    }
    var v = this;
    return this.tbody && this.tbody.rows.length > 0 ? (this._parseRows(), this._attachSortHandlers()) : this.tbody && (this._tbodyObserver = new MutationObserver(function() {
      v.tbody.rows.length > 0 && (v._tbodyObserver.disconnect(), v._parseRows(), v._attachSortHandlers());
    }), this._tbodyObserver.observe(this.tbody, { childList: !0 })), this._attachSearchHandler(), this._attachClearHandler(), r.setAttribute(g, ""), this;
  }
  e.prototype._parseRows = function() {
    var r = this.tbody.rows, s = this.ths;
    this._data = [];
    for (var p = [], v = 0; v < s.length; v++)
      p[v] = s[v].getAttribute(A);
    r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (var T = 0; T < r.length; T++) {
      for (var w = r[T], L = [], O = [], S = 0; S < w.cells.length; S++) {
        var M = w.cells[S], m = M.textContent.trim(), C = M.hasAttribute("data-ln-value") ? M.getAttribute("data-ln-value") : m, D = p[S];
        D === "number" || D === "date" ? L[S] = parseFloat(C) || 0 : D === "string" ? L[S] = String(C) : L[S] = null, S < w.cells.length - 1 && O.push(m.toLowerCase());
      }
      this._data.push({
        index: T,
        sortKeys: L,
        html: w.outerHTML,
        searchText: O.join(" ")
      });
    }
    this._totalCount = this._data.length, this._filteredData = this._data, this._render();
  }, e.prototype._lockColumnWidths = function() {
    if (!(!this.table || !this.thead || this._colgroup)) {
      for (var r = this.ths, s = document.createElement("colgroup"), p = 0; p < r.length; p++) {
        var v = document.createElement("col");
        v.style.width = r[p].offsetWidth + "px", s.appendChild(v);
      }
      this.table.insertBefore(s, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = s;
    }
  }, e.prototype._attachSortHandlers = function() {
    var r = this;
    this.ths.forEach(function(s, p) {
      s.hasAttribute(A) && (s[c + "SortBound"] || (s[c + "SortBound"] = !0, s.addEventListener("click", function() {
        r._handleSort(p, s);
      })));
    });
  }, e.prototype._handleSort = function(r, s) {
    var p = s.getAttribute(A), v;
    this._sortCol !== r ? v = "asc" : this._sortDir === "asc" ? v = "desc" : this._sortDir === "desc" ? v = null : v = "asc", this.ths.forEach(function(L) {
      L.removeAttribute(_);
    });
    var T = performance.now();
    v === null ? (this._sortCol = -1, this._sortDir = null, this._applyFilter()) : (this._sortCol = r, this._sortDir = v, s.setAttribute(_, v), this._sortData(r, p, v)), this._vStart = -1, this._vEnd = -1, this._render();
    var w = performance.now() - T;
    this._updateTiming(w), i(this.dom, "ln-table:sort", {
      column: r,
      direction: v,
      duration: w
    });
  }, e.prototype._sortData = function(r, s, p) {
    var v = p === "desc" ? -1 : 1, T = s === "number" || s === "date", w = o ? o.compare : function(L, O) {
      return L < O ? -1 : L > O ? 1 : 0;
    };
    this._filteredData.sort(function(L, O) {
      var S = L.sortKeys[r], M = O.sortKeys[r];
      return T ? (S - M) * v : w(S, M) * v;
    });
  }, e.prototype._attachSearchHandler = function() {
    if (this.searchInput) {
      var r = this;
      this.searchInput.addEventListener("input", function() {
        clearTimeout(r._debounceTimer), r._debounceTimer = setTimeout(function() {
          var s = performance.now();
          if (r._searchTerm = r.searchInput.value.trim().toLowerCase(), r._applyFilter(), r._sortCol >= 0 && r._sortDir) {
            var p = r.ths[r._sortCol], v = p.getAttribute(A);
            r._sortData(r._sortCol, v, r._sortDir);
          }
          r._vStart = -1, r._vEnd = -1, r._render();
          var T = performance.now() - s;
          r._updateTiming(T), i(r.dom, "ln-table:filter", {
            term: r._searchTerm,
            matched: r._filteredData.length,
            total: r._totalCount,
            duration: T
          });
        }, 150);
      });
    }
  }, e.prototype._applyFilter = function() {
    if (!this._searchTerm)
      this._filteredData = this._data.slice();
    else {
      var r = this._searchTerm;
      this._filteredData = this._data.filter(function(s) {
        return s.searchText.indexOf(r) !== -1;
      });
    }
  }, e.prototype._attachClearHandler = function() {
    var r = this;
    this.dom.addEventListener("click", function(s) {
      var p = s.target.closest("[" + y + "]");
      if (p) {
        if (r.searchInput && (r.searchInput.value = "", r.searchInput.focus()), r._searchTerm = "", r._applyFilter(), r._sortCol >= 0 && r._sortDir) {
          var v = r.ths[r._sortCol], T = v.getAttribute(A);
          r._sortData(r._sortCol, T, r._sortDir);
        }
        r._vStart = -1, r._vEnd = -1, r._render(), r._updateTiming(0);
      }
    });
  }, e.prototype._render = function() {
    if (this.tbody) {
      var r = this._filteredData.length;
      r === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll()), this._updateCounts(r, this._totalCount);
    }
  }, e.prototype._renderAll = function() {
    for (var r = [], s = this._filteredData, p = 0; p < s.length; p++)
      r.push(s[p].html);
    this.tbody.innerHTML = r.join("");
  }, e.prototype._enableVirtualScroll = function() {
    if (!this._virtual) {
      this._virtual = !0;
      var r = this;
      this._scrollHandler = function() {
        r._rafId || (r._rafId = requestAnimationFrame(function() {
          r._rafId = null, r._renderVirtual();
        }));
      }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
    }
  }, e.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, e.prototype._renderVirtual = function() {
    var r = this._filteredData, s = r.length, p = this._rowHeight;
    if (!(!p || !s)) {
      var v = this.table.getBoundingClientRect(), T = v.top + window.scrollY, w = window.scrollY, L = this.thead ? this.thead.offsetHeight : 0, O = T + L, S = w - O, M = Math.floor(S / p) - 15;
      M = Math.max(0, M);
      var m = Math.ceil(window.innerHeight / p) + 30, C = Math.min(M + m, s);
      if (!(M === this._vStart && C === this._vEnd)) {
        this._vStart = M, this._vEnd = C;
        var D = this.ths.length || 1, N = M * p, I = (s - C) * p, H = "";
        N > 0 && (H += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + D + '" style="height:' + N + 'px;padding:0;border:none"></td></tr>');
        for (var k = M; k < C; k++)
          H += r[k].html;
        I > 0 && (H += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + D + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = H;
      }
    }
  }, e.prototype._showEmptyState = function() {
    var r = this.ths.length || 1, s = l(this._searchTerm);
    this.tbody.innerHTML = '<tr class="ln-table__empty"><td colspan="' + r + '"><article class="ln-table__empty-state"><span class="ln-icon-filter ln-icon--xl"></span><h3>Нема резултати</h3><p>Пребарувањето „<strong>' + s + '</strong>“ не врати резултати.</p><button class="btn btn--secondary" ' + y + ">Исчисти пребарување</button></article></td></tr>";
  }, e.prototype._updateCounts = function(r, s) {
    var p = u(s);
    this.countEl && (this._searchTerm && r !== s ? this.countEl.innerHTML = "<strong>" + u(r) + "</strong> / " + p + " записи" : this.countEl.textContent = p + " записи"), this.footerCountEl && (this.footerCountEl.textContent = this._searchTerm ? u(r) + " / " + p : p);
  }, e.prototype._updateTiming = function(r) {
    this.timingEl && (this.timingEl.textContent = r > 0 ? r.toFixed(0) + "ms" : "");
  };
  function i(r, s, p) {
    r.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: p || {}
    }));
  }
  function u(r) {
    return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function l(r) {
    var s = document.createElement("div");
    return s.textContent = r, s.innerHTML;
  }
  function d() {
    var r = new MutationObserver(function(s) {
      s.forEach(function(p) {
        p.type === "childList" && p.addedNodes.forEach(function(v) {
          v.nodeType === 1 && n(v);
        });
      });
    });
    r.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = t, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body);
})();
