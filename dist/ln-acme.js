(function() {
  const h = "data-ln-ajax", u = "lnAjax";
  if (window[u] !== void 0)
    return;
  function v(e, n, r) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function E(e, n, r) {
    var t = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: r || {}
    });
    return e.dispatchEvent(t), t;
  }
  function y(e) {
    if (!e.hasAttribute(h) || e[u])
      return;
    e[u] = !0;
    const n = l(e);
    b(n.links), g(n.forms);
  }
  function b(e) {
    e.forEach(function(n) {
      if (n._lnAjaxAttached) return;
      const r = n.getAttribute("href");
      r && r.includes("#") || (n._lnAjaxAttached = !0, n.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1)
          return;
        t.preventDefault();
        const c = n.getAttribute("href");
        c && p("GET", c, null, n);
      }));
    });
  }
  function g(e) {
    e.forEach(function(n) {
      n._lnAjaxAttached || (n._lnAjaxAttached = !0, n.addEventListener("submit", function(r) {
        r.preventDefault();
        const t = n.method.toUpperCase(), c = n.action, a = new FormData(n);
        n.querySelectorAll('button, input[type="submit"]').forEach(function(s) {
          s.disabled = !0;
        }), p(t, c, a, n, function() {
          n.querySelectorAll('button, input[type="submit"]').forEach(function(s) {
            s.disabled = !1;
          });
        });
      }));
    });
  }
  function p(e, n, r, t, c) {
    var a = E(t, "ln-ajax:before-start", { method: e, url: n });
    if (a.defaultPrevented) return;
    v(t, "ln-ajax:start", { method: e, url: n }), t.classList.add("ln-ajax--loading");
    const s = document.createElement("span");
    s.className = "ln-ajax-spinner", t.appendChild(s);
    function d() {
      t.classList.remove("ln-ajax--loading");
      const _ = t.querySelector(".ln-ajax-spinner");
      _ && _.remove(), c && c();
    }
    let m = n;
    const w = document.querySelector('meta[name="csrf-token"]'), A = w ? w.getAttribute("content") : null;
    r instanceof FormData && A && r.append("_token", A);
    const S = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (S.headers["X-CSRF-TOKEN"] = A), e === "GET" && r) {
      const _ = new URLSearchParams(r);
      m = n + (n.includes("?") ? "&" : "?") + _.toString();
    } else e !== "GET" && r && (S.body = r);
    fetch(m, S).then((_) => _.json()).then((_) => {
      if (_.title && (document.title = _.title), _.content)
        for (let T in _.content) {
          const O = document.getElementById(T);
          O && (O.innerHTML = _.content[T]);
        }
      if (t.tagName === "A") {
        const T = t.getAttribute("href");
        T && window.history.pushState({ ajax: !0 }, "", T);
      } else t.tagName === "FORM" && t.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
      v(t, "ln-ajax:success", { method: e, url: m, data: _ }), v(t, "ln-ajax:complete", { method: e, url: m }), d();
    }).catch((_) => {
      v(t, "ln-ajax:error", { method: e, url: m, error: _ }), v(t, "ln-ajax:complete", { method: e, url: m }), d();
    });
  }
  function l(e) {
    const n = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? n.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? n.forms.push(e) : (n.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function o() {
    new MutationObserver(function(n) {
      n.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(t) {
          if (t.nodeType === 1 && (y(t), !t.hasAttribute(h))) {
            t.querySelectorAll("[" + h + "]").forEach(function(s) {
              y(s);
            });
            var c = t.closest && t.closest("[" + h + "]");
            if (c && c.getAttribute(h) !== "false") {
              var a = l(t);
              console.log("[ln-ajax] re-attach on injected node:", t, "links:", a.links.length, "forms:", a.forms.length), b(a.links), g(a.forms);
            }
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function i() {
    document.querySelectorAll("[" + h + "]").forEach(function(e) {
      y(e);
    });
  }
  window[u] = y, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-modal", u = "lnModal";
  if (window[u] !== void 0)
    return;
  function v(e, n, r) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: Object.assign({ modalId: e.id, target: e }, {})
    }));
  }
  function E(e, n) {
    var r = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: { modalId: e.id, target: e }
    });
    return e.dispatchEvent(r), r;
  }
  function y(e) {
    const n = document.getElementById(e);
    if (!n) {
      console.warn('Modal with ID "' + e + '" not found');
      return;
    }
    var r = E(n, "ln-modal:before-open");
    r.defaultPrevented || (n.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"), v(n, "ln-modal:open"));
  }
  function b(e) {
    const n = document.getElementById(e);
    if (n) {
      var r = E(n, "ln-modal:before-close");
      r.defaultPrevented || (n.classList.remove("ln-modal--open"), v(n, "ln-modal:close"), document.querySelector(".ln-modal.ln-modal--open") || document.body.classList.remove("ln-modal-open"));
    }
  }
  function g(e) {
    const n = document.getElementById(e);
    if (!n) {
      console.warn('Modal with ID "' + e + '" not found');
      return;
    }
    n.classList.contains("ln-modal--open") ? b(e) : y(e);
  }
  function p(e) {
    const n = e.querySelectorAll("[data-ln-modal-close]"), r = e.id;
    n.forEach(function(t) {
      t._lnModalCloseAttached || (t._lnModalCloseAttached = !0, t.addEventListener("click", function(c) {
        c.preventDefault(), b(r);
      }));
    });
  }
  function l(e) {
    e.forEach(function(n) {
      n._lnModalAttached || (n._lnModalAttached = !0, n.addEventListener("click", function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1)
          return;
        r.preventDefault();
        const t = n.getAttribute(h);
        t && g(t);
      }));
    });
  }
  function o() {
    const e = document.querySelectorAll("[" + h + "]");
    l(e), document.querySelectorAll(".ln-modal").forEach(function(r) {
      p(r);
    }), document.addEventListener("keydown", function(r) {
      r.key === "Escape" && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(c) {
        b(c.id);
      });
    });
  }
  function i() {
    new MutationObserver(function(n) {
      n.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(t) {
          if (t.nodeType === 1) {
            t.hasAttribute(h) && l([t]);
            const c = t.querySelectorAll("[" + h + "]");
            c.length > 0 && l(c), t.id && t.classList.contains("ln-modal") && p(t);
            const a = t.querySelectorAll(".ln-modal");
            a.length > 0 && a.forEach(function(s) {
              p(s);
            });
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[u] = {
    open: y,
    close: b,
    toggle: g
  }, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const h = "data-ln-nav", u = "lnNav";
  if (window[u] !== void 0)
    return;
  const v = /* @__PURE__ */ new WeakMap();
  var E = [];
  if (!history._lnNavPatched) {
    var y = history.pushState;
    history.pushState = function() {
      y.apply(history, arguments), E.forEach(function(e) {
        e();
      });
    }, history._lnNavPatched = !0;
  }
  function b(e) {
    if (!e.hasAttribute(h) || v.has(e)) return;
    const n = e.getAttribute(h);
    if (!n) return;
    const r = g(e, n);
    v.set(e, r);
  }
  function g(e, n) {
    let r = Array.from(e.querySelectorAll("a"));
    l(r, n, window.location.pathname);
    var t = function() {
      r = Array.from(e.querySelectorAll("a")), l(r, n, window.location.pathname);
    };
    window.addEventListener("popstate", t), E.push(t);
    const c = new MutationObserver(function(a) {
      a.forEach(function(s) {
        s.type === "childList" && (s.addedNodes.forEach(function(d) {
          if (d.nodeType === 1) {
            if (d.tagName === "A")
              r.push(d), l([d], n, window.location.pathname);
            else if (d.querySelectorAll) {
              const m = Array.from(d.querySelectorAll("a"));
              r = r.concat(m), l(m, n, window.location.pathname);
            }
          }
        }), s.removedNodes.forEach(function(d) {
          if (d.nodeType === 1) {
            if (d.tagName === "A")
              r = r.filter(function(m) {
                return m !== d;
              });
            else if (d.querySelectorAll) {
              const m = Array.from(d.querySelectorAll("a"));
              r = r.filter(function(w) {
                return !m.includes(w);
              });
            }
          }
        }));
      });
    });
    return c.observe(e, { childList: !0, subtree: !0 }), { navElement: e, activeClass: n, observer: c };
  }
  function p(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function l(e, n, r) {
    const t = p(r);
    e.forEach(function(c) {
      const a = c.getAttribute("href");
      if (!a) return;
      const s = p(a);
      c.classList.remove(n);
      const d = s === t, m = s !== "/" && t.startsWith(s + "/");
      (d || m) && c.classList.add(n);
    });
  }
  function o() {
    var e = new MutationObserver(function(n) {
      n.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(t) {
          t.nodeType === 1 && (t.hasAttribute && t.hasAttribute(h) && b(t), t.querySelectorAll && t.querySelectorAll("[" + h + "]").forEach(b));
        });
      });
    });
    e.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[u] = b;
  function i() {
    document.querySelectorAll("[" + h + "]").forEach(b);
  }
  o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
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
  const u = /* @__PURE__ */ new WeakMap();
  function v(g) {
    if (u.has(g))
      return;
    const p = g.getAttribute("data-ln-select");
    let l = {};
    if (p && p.trim() !== "")
      try {
        l = JSON.parse(p);
      } catch (e) {
        console.warn("Invalid JSON in data-ln-select attribute:", e);
      }
    const i = { ...{
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
    }, ...l };
    try {
      const e = new h(g, i);
      u.set(g, e);
      const n = g.closest("form");
      n && n.addEventListener("reset", () => {
        setTimeout(() => {
          e.clear(), e.clearOptions(), e.sync();
        }, 0);
      });
    } catch (e) {
      console.error("Failed to initialize Tom Select:", e);
    }
  }
  function E(g) {
    const p = u.get(g);
    p && (p.destroy(), u.delete(g));
  }
  function y() {
    document.querySelectorAll("select[data-ln-select]").forEach(v);
  }
  function b() {
    new MutationObserver((p) => {
      p.forEach((l) => {
        l.addedNodes.forEach((o) => {
          o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && v(o), o.querySelectorAll && o.querySelectorAll("select[data-ln-select]").forEach(v));
        }), l.removedNodes.forEach((o) => {
          o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && E(o), o.querySelectorAll && o.querySelectorAll("select[data-ln-select]").forEach(E));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    y(), b();
  }) : (y(), b()), window.lnSelect = {
    initialize: v,
    destroy: E,
    getInstance: (g) => u.get(g)
  };
})();
(function() {
  const h = "data-ln-tabs", u = "lnTabs";
  if (window[u] !== void 0 && window[u] !== null) return;
  function v(o = document.body) {
    E(o);
  }
  function E(o) {
    if (o.nodeType !== 1) return;
    let i = Array.from(o.querySelectorAll("[" + h + "]"));
    o.hasAttribute && o.hasAttribute(h) && i.push(o), i.forEach(function(e) {
      e[u] || (e[u] = new b(e));
    });
  }
  function y() {
    const o = (location.hash || "").replace("#", ""), i = {};
    return o && o.split("&").forEach(function(e) {
      const n = e.indexOf(":");
      n > 0 && (i[e.slice(0, n)] = e.slice(n + 1));
    }), i;
  }
  function b(o) {
    return this.dom = o, g.call(this), this;
  }
  function g() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const o of this.tabs) {
      const i = (o.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      i && (this.mapTabs[i] = o);
    }
    for (const o of this.panels) {
      const i = (o.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      i && (this.mapPanels[i] = o);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.tabs.forEach((o) => {
      o.addEventListener("click", () => {
        const i = (o.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (i)
          if (this.hashEnabled) {
            const e = y();
            e[this.nsKey] = i;
            const n = Object.keys(e).map(function(r) {
              return r + ":" + e[r];
            }).join("&");
            location.hash === "#" + n ? this.activate(i) : location.hash = n;
          } else
            this.activate(i);
      });
    }), this._hashHandler = () => {
      if (!this.hashEnabled) return;
      const o = y();
      this.activate(this.nsKey in o ? o[this.nsKey] : this.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  b.prototype.activate = function(o) {
    var i;
    (!o || !(o in this.mapPanels)) && (o = this.defaultKey);
    for (const e in this.mapTabs) {
      const n = this.mapTabs[e];
      e === o ? (n.setAttribute("data-active", ""), n.setAttribute("aria-selected", "true")) : (n.removeAttribute("data-active"), n.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const n = this.mapPanels[e], r = e === o;
      n.classList.toggle("hidden", !r), n.setAttribute("aria-hidden", r ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (i = this.mapPanels[o]) == null ? void 0 : i.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    p(this.dom, "ln-tabs:change", { key: o, tab: this.mapTabs[o], panel: this.mapPanels[o] });
  };
  function p(o, i, e) {
    o.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function l() {
    new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.addedNodes.forEach(function(n) {
          E(n);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  l(), window[u] = v, v(document.body);
})();
(function() {
  const h = "data-ln-toggle", u = "lnToggle";
  if (window[u] !== void 0) return;
  function v(o) {
    E(o), y(o);
  }
  function E(o) {
    var i = Array.from(o.querySelectorAll("[" + h + "]"));
    o.hasAttribute && o.hasAttribute(h) && i.push(o), i.forEach(function(e) {
      e[u] || (e[u] = new b(e));
    });
  }
  function y(o) {
    var i = Array.from(o.querySelectorAll("[data-ln-toggle-for]"));
    o.hasAttribute && o.hasAttribute("data-ln-toggle-for") && i.push(o), i.forEach(function(e) {
      e[u + "Trigger"] || (e[u + "Trigger"] = !0, e.addEventListener("click", function(n) {
        if (!(n.ctrlKey || n.metaKey || n.button === 1)) {
          n.preventDefault();
          var r = e.getAttribute("data-ln-toggle-for"), t = document.getElementById(r);
          if (!(!t || !t[u])) {
            var c = e.getAttribute("data-ln-toggle-action") || "toggle";
            t[u][c]();
          }
        }
      }));
    });
  }
  function b(o) {
    this.dom = o, this.isOpen = o.getAttribute(h) === "open", this.isOpen && o.classList.add("open");
    var i = this;
    return o.addEventListener("ln-toggle:request-close", function() {
      i.isOpen && i.close();
    }), o.addEventListener("ln-toggle:request-open", function() {
      i.isOpen || i.open();
    }), this;
  }
  b.prototype.open = function() {
    if (!this.isOpen) {
      var o = p(this.dom, "ln-toggle:before-open", { target: this.dom });
      o.defaultPrevented || (this.isOpen = !0, this.dom.classList.add("open"), g(this.dom, "ln-toggle:open", { target: this.dom }));
    }
  }, b.prototype.close = function() {
    if (this.isOpen) {
      var o = p(this.dom, "ln-toggle:before-close", { target: this.dom });
      o.defaultPrevented || (this.isOpen = !1, this.dom.classList.remove("open"), g(this.dom, "ln-toggle:close", { target: this.dom }));
    }
  }, b.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  };
  function g(o, i, e) {
    o.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function p(o, i, e) {
    var n = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return o.dispatchEvent(n), n;
  }
  function l() {
    var o = new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(n) {
          n.nodeType === 1 && (E(n), y(n));
        });
      });
    });
    o.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[u] = v, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-accordion", u = "lnAccordion";
  if (window[u] !== void 0) return;
  function v(p) {
    E(p);
  }
  function E(p) {
    var l = Array.from(p.querySelectorAll("[" + h + "]"));
    p.hasAttribute && p.hasAttribute(h) && l.push(p), l.forEach(function(o) {
      o[u] || (o[u] = new y(o));
    });
  }
  function y(p) {
    return this.dom = p, p.addEventListener("ln-toggle:open", function(l) {
      var o = p.querySelectorAll("[data-ln-toggle]");
      o.forEach(function(i) {
        i !== l.detail.target && i.dispatchEvent(new CustomEvent("ln-toggle:request-close"));
      }), b(p, "ln-accordion:change", { target: l.detail.target });
    }), this;
  }
  function b(p, l, o) {
    p.dispatchEvent(new CustomEvent(l, {
      bubbles: !0,
      detail: o || {}
    }));
  }
  function g() {
    var p = new MutationObserver(function(l) {
      l.forEach(function(o) {
        o.type === "childList" && o.addedNodes.forEach(function(i) {
          i.nodeType === 1 && E(i);
        });
      });
    });
    p.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[u] = v, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const h = "data-ln-toast", u = "lnToast", v = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[u] !== void 0 && window[u] !== null) return;
  function E(r = document.body) {
    return y(r), e;
  }
  function y(r) {
    if (!r || r.nodeType !== 1) return;
    let t = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && t.push(r), t.forEach((c) => {
      c[u] || new b(c);
    });
  }
  function b(r) {
    return this.dom = r, r[u] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10), Array.from(r.querySelectorAll("[data-ln-toast-item]")).forEach((t) => {
      g(t);
    }), this;
  }
  function g(r) {
    const t = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), c = r.getAttribute("data-title"), a = (r.innerText || r.textContent || "").trim();
    r.className = "ln-toast__item", r.removeAttribute("data-ln-toast-item");
    const s = document.createElement("div");
    s.className = "ln-toast__card ln-toast__card--" + t, s.setAttribute("role", t === "error" ? "alert" : "status"), s.setAttribute("aria-live", t === "error" ? "assertive" : "polite");
    const d = document.createElement("div");
    d.className = "ln-toast__side", d.innerHTML = v[t] || v.info;
    const m = document.createElement("div");
    m.className = "ln-toast__content";
    const w = document.createElement("div");
    w.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = c || (t === "success" ? "Success" : t === "error" ? "Error" : t === "warn" ? "Warning" : "Information");
    const S = document.createElement("button");
    if (S.type = "button", S.className = "ln-toast__close ln-icon-close", S.setAttribute("aria-label", "Close"), S.addEventListener("click", () => l(r)), w.appendChild(A), m.appendChild(w), m.appendChild(S), a) {
      const _ = document.createElement("div");
      _.className = "ln-toast__body";
      const T = document.createElement("p");
      T.textContent = a, _.appendChild(T), m.appendChild(_);
    }
    s.appendChild(d), s.appendChild(m), r.innerHTML = "", r.appendChild(s), requestAnimationFrame(() => r.classList.add("ln-toast__item--in"));
  }
  function p(r, t) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(t), requestAnimationFrame(() => t.classList.add("ln-toast__item--in"));
  }
  function l(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function o(r = {}) {
    let t = r.container;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !t) return null;
    const c = t[u] || new b(t), a = Number.isFinite(r.timeout) ? r.timeout : c.timeoutDefault, s = (r.type || "info").toLowerCase(), d = document.createElement("li");
    d.className = "ln-toast__item";
    const m = document.createElement("div");
    m.className = "ln-toast__card ln-toast__card--" + s, m.setAttribute("role", s === "error" ? "alert" : "status"), m.setAttribute("aria-live", s === "error" ? "assertive" : "polite");
    const w = document.createElement("div");
    w.className = "ln-toast__side", w.innerHTML = v[s] || v.info;
    const A = document.createElement("div");
    A.className = "ln-toast__content";
    const S = document.createElement("div");
    S.className = "ln-toast__head";
    const _ = document.createElement("strong");
    _.className = "ln-toast__title", _.textContent = r.title || (s === "success" ? "Success" : s === "error" ? "Error" : s === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close ln-icon-close", T.setAttribute("aria-label", "Close"), T.addEventListener("click", () => l(d)), S.appendChild(_), A.appendChild(S), A.appendChild(T), r.message || r.data && r.data.errors) {
      const O = document.createElement("div");
      if (O.className = "ln-toast__body", r.message)
        if (Array.isArray(r.message)) {
          const x = document.createElement("ul");
          r.message.forEach(function(D) {
            const f = document.createElement("li");
            f.textContent = D, x.appendChild(f);
          }), O.appendChild(x);
        } else {
          const x = document.createElement("p");
          x.textContent = r.message, O.appendChild(x);
        }
      if (r.data && r.data.errors) {
        const x = document.createElement("ul");
        Object.values(r.data.errors).flat().forEach((D) => {
          const f = document.createElement("li");
          f.textContent = D, x.appendChild(f);
        }), O.appendChild(x);
      }
      A.appendChild(O);
    }
    return m.appendChild(w), m.appendChild(A), d.appendChild(m), p(c, d), a > 0 && (d._timer = setTimeout(() => l(d), a)), d;
  }
  function i(r) {
    let t = r;
    typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), t && Array.from(t.children).forEach(l);
  }
  const e = function(r) {
    return E(r);
  };
  e.enqueue = o, e.clear = i, new MutationObserver((r) => {
    r.forEach((t) => t.addedNodes.forEach((c) => y(c)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[u] = e, window.addEventListener("ln-toast:enqueue", function(r) {
    r.detail && e.enqueue(r.detail);
  }), E(document.body);
})();
(function() {
  const h = "data-ln-upload", u = "lnUpload", v = "data-ln-upload-dict", E = "data-ln-upload-accept", y = "data-ln-upload-context";
  if (window[u] !== void 0)
    return;
  function b(t, c) {
    const a = t.querySelector("[" + v + '="' + c + '"]');
    return a ? a.textContent : c;
  }
  function g(t) {
    if (t === 0) return "0 B";
    const c = 1024, a = ["B", "KB", "MB", "GB"], s = Math.floor(Math.log(t) / Math.log(c));
    return parseFloat((t / Math.pow(c, s)).toFixed(1)) + " " + a[s];
  }
  function p(t) {
    return t.split(".").pop().toLowerCase();
  }
  function l(t) {
    return t === "docx" && (t = "doc"), ["pdf", "doc", "epub"].includes(t) ? "ln-icon-file-" + t : "ln-icon-file";
  }
  function o(t, c) {
    if (!c) return !0;
    const a = "." + p(t.name);
    return c.split(",").map(function(d) {
      return d.trim().toLowerCase();
    }).includes(a.toLowerCase());
  }
  function i(t, c, a) {
    t.dispatchEvent(new CustomEvent(c, {
      bubbles: !0,
      detail: a
    }));
  }
  function e(t) {
    if (t.hasAttribute("data-ln-upload-initialized")) return;
    t.setAttribute("data-ln-upload-initialized", "true");
    const c = t.querySelector(".ln-upload__zone"), a = t.querySelector(".ln-upload__list"), s = t.getAttribute(E) || "";
    let d = t.querySelector('input[type="file"]');
    d || (d = document.createElement("input"), d.type = "file", d.multiple = !0, d.style.display = "none", s && (d.accept = s.split(",").map(function(f) {
      return f = f.trim(), f.startsWith(".") ? f : "." + f;
    }).join(",")), t.appendChild(d));
    const m = t.getAttribute(h) || "/files/upload", w = t.getAttribute(y) || "", A = /* @__PURE__ */ new Map();
    let S = 0;
    function _() {
      const f = document.querySelector('meta[name="csrf-token"]');
      return f ? f.getAttribute("content") : "";
    }
    function T(f) {
      if (!o(f, s)) {
        const C = b(t, "invalid-type");
        i(t, "ln-upload:invalid", {
          file: f,
          message: C
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: C || "This file type is not allowed"
          }
        }));
        return;
      }
      const L = "file-" + ++S, M = p(f.name), B = l(M), k = document.createElement("li");
      k.className = "ln-upload__item ln-upload__item--uploading " + B, k.setAttribute("data-file-id", L);
      const F = document.createElement("span");
      F.className = "ln-upload__name", F.textContent = f.name;
      const I = document.createElement("span");
      I.className = "ln-upload__size", I.textContent = "0%";
      const N = document.createElement("button");
      N.type = "button", N.className = "ln-upload__remove ln-icon-close", N.title = b(t, "remove"), N.textContent = "×", N.disabled = !0;
      const P = document.createElement("div");
      P.className = "ln-upload__progress";
      const z = document.createElement("div");
      z.className = "ln-upload__progress-bar", P.appendChild(z), k.appendChild(F), k.appendChild(I), k.appendChild(N), k.appendChild(P), a.appendChild(k);
      const U = new FormData();
      U.append("file", f), U.append("context", w);
      const q = new XMLHttpRequest();
      q.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const j = Math.round(C.loaded / C.total * 100);
          z.style.width = j + "%", I.textContent = j + "%";
        }
      }), q.addEventListener("load", function() {
        if (q.status >= 200 && q.status < 300) {
          var C;
          try {
            C = JSON.parse(q.responseText);
          } catch {
            R("Invalid response");
            return;
          }
          k.classList.remove("ln-upload__item--uploading"), I.textContent = g(C.size || f.size), N.disabled = !1, A.set(L, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), O(), i(t, "ln-upload:uploaded", {
            localId: L,
            serverId: C.id,
            name: C.name
          });
        } else {
          var j = "Upload failed";
          try {
            var K = JSON.parse(q.responseText);
            j = K.message || j;
          } catch {
          }
          R(j);
        }
      }), q.addEventListener("error", function() {
        R("Network error");
      });
      function R(C) {
        k.classList.remove("ln-upload__item--uploading"), k.classList.add("ln-upload__item--error"), z.style.width = "100%", I.textContent = b(t, "error"), N.disabled = !1, i(t, "ln-upload:error", {
          file: f,
          message: C
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: C || b(t, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      q.open("POST", m), q.setRequestHeader("X-CSRF-TOKEN", _()), q.setRequestHeader("Accept", "application/json"), q.send(U);
    }
    function O() {
      t.querySelectorAll('input[name="file_ids[]"]').forEach(function(f) {
        f.remove();
      }), A.forEach(function(f) {
        const L = document.createElement("input");
        L.type = "hidden", L.name = "file_ids[]", L.value = f.serverId, t.appendChild(L);
      });
    }
    function x(f) {
      const L = A.get(f), M = a.querySelector('[data-file-id="' + f + '"]');
      if (!L || !L.serverId) {
        M && M.remove(), A.delete(f), O();
        return;
      }
      M && M.classList.add("ln-upload__item--deleting"), fetch("/files/" + L.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": _(),
          Accept: "application/json"
        }
      }).then((B) => {
        B.status === 200 ? (M && M.remove(), A.delete(f), O(), i(t, "ln-upload:removed", {
          localId: f,
          serverId: L.serverId
        })) : (M && M.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: b(t, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((B) => {
        console.error("Delete error:", B), M && M.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function D(f) {
      Array.from(f).forEach(function(L) {
        T(L);
      }), d.value = "";
    }
    c.addEventListener("click", function() {
      d.click();
    }), d.addEventListener("change", function() {
      D(this.files);
    }), c.addEventListener("dragenter", function(f) {
      f.preventDefault(), f.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }), c.addEventListener("dragover", function(f) {
      f.preventDefault(), f.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }), c.addEventListener("dragleave", function(f) {
      f.preventDefault(), f.stopPropagation(), c.classList.remove("ln-upload__zone--dragover");
    }), c.addEventListener("drop", function(f) {
      f.preventDefault(), f.stopPropagation(), c.classList.remove("ln-upload__zone--dragover"), D(f.dataTransfer.files);
    }), a.addEventListener("click", function(f) {
      if (f.target.classList.contains("ln-upload__remove")) {
        const L = f.target.closest(".ln-upload__item");
        L && x(L.getAttribute("data-file-id"));
      }
    }), t.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(f) {
          return f.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        A.forEach(function(f) {
          f.serverId && fetch("/files/" + f.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": _(),
              Accept: "application/json"
            }
          });
        }), A.clear(), a.innerHTML = "", O(), i(t, "ln-upload:cleared", {});
      }
    };
  }
  function n() {
    document.querySelectorAll("[" + h + "]").forEach(e);
  }
  function r() {
    new MutationObserver(function(c) {
      c.forEach(function(a) {
        a.type === "childList" && a.addedNodes.forEach(function(s) {
          s.nodeType === 1 && (s.hasAttribute(h) && e(s), s.querySelectorAll("[" + h + "]").forEach(e));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[u] = {
    init: e,
    initAll: n
  }, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0)
    return;
  function u(l, o, i) {
    l.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: i
    }));
  }
  function v(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function E(l) {
    l.getAttribute("data-ln-external-link") !== "processed" && v(l) && (l.target = "_blank", l.rel = "noopener noreferrer", l.setAttribute("data-ln-external-link", "processed"), u(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    }));
  }
  function y(l) {
    l = l || document.body, l.querySelectorAll("a, area").forEach(function(i) {
      E(i);
    });
  }
  function b() {
    document.body.addEventListener("click", function(l) {
      const o = l.target.closest("a, area");
      o && o.getAttribute("data-ln-external-link") === "processed" && u(o, "ln-external-links:clicked", {
        link: o,
        href: o.href,
        text: o.textContent || o.title || ""
      });
    });
  }
  function g() {
    new MutationObserver(function(o) {
      o.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(e) {
          if (e.nodeType === 1) {
            e.matches && (e.matches("a") || e.matches("area")) && E(e);
            const n = e.querySelectorAll && e.querySelectorAll("a, area");
            n && n.forEach(E);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function p() {
    b(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[h] = {
    process: y
  }, p();
})();
(function() {
  const h = "data-ln-link", u = "lnLink";
  if (window[u] !== void 0) return;
  function v(a, s, d) {
    var m = new CustomEvent(s, {
      bubbles: !0,
      cancelable: !0,
      detail: d || {}
    });
    return a.dispatchEvent(m), m;
  }
  var E = null;
  function y() {
    E = document.createElement("div"), E.className = "ln-link-status", document.body.appendChild(E);
  }
  function b(a) {
    E && (E.textContent = a, E.classList.add("ln-link-status--visible"));
  }
  function g() {
    E && E.classList.remove("ln-link-status--visible");
  }
  function p(a, s) {
    if (!s.target.closest("a, button, input, select, textarea")) {
      var d = a.querySelector("a");
      if (d) {
        var m = d.getAttribute("href");
        if (m) {
          if (s.ctrlKey || s.metaKey || s.button === 1) {
            window.open(m, "_blank");
            return;
          }
          var w = v(a, "ln-link:navigate", { target: a, href: m, link: d });
          w.defaultPrevented || d.click();
        }
      }
    }
  }
  function l(a) {
    var s = a.querySelector("a");
    if (s) {
      var d = s.getAttribute("href");
      d && b(d);
    }
  }
  function o() {
    g();
  }
  function i(a) {
    a._lnLinkInit || (a._lnLinkInit = !0, a.querySelector("a") && (a.addEventListener("click", function(s) {
      p(a, s);
    }), a.addEventListener("mouseenter", function() {
      l(a);
    }), a.addEventListener("mouseleave", o)));
  }
  function e(a) {
    if (!a._lnLinkInit) {
      a._lnLinkInit = !0;
      var s = a.tagName;
      if (s === "TABLE" || s === "TBODY") {
        var d = s === "TABLE" && a.querySelector("tbody") || a, m = d.querySelectorAll("tr");
        m.forEach(i);
      } else i(a);
    }
  }
  function n(a) {
    a.hasAttribute && a.hasAttribute(h) && e(a);
    var s = a.querySelectorAll ? a.querySelectorAll("[" + h + "]") : [];
    s.forEach(e);
  }
  function r() {
    var a = new MutationObserver(function(s) {
      s.forEach(function(d) {
        d.type === "childList" && d.addedNodes.forEach(function(m) {
          if (m.nodeType === 1 && (n(m), m.tagName === "TR")) {
            var w = m.closest("[" + h + "]");
            w && i(m);
          }
        });
      });
    });
    a.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function t(a) {
    n(a);
  }
  window[u] = { init: t };
  function c() {
    y(), r(), t(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const h = "[data-ln-progress]", u = "lnProgress";
  if (window[u] !== void 0)
    return;
  function v(i) {
    var e = i.getAttribute("data-ln-progress");
    return e !== null && e !== "";
  }
  function E(i) {
    b(i);
  }
  function y(i, e, n) {
    i.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function b(i) {
    var e = Array.from(i.querySelectorAll(h));
    e.forEach(function(n) {
      v(n) && !n[u] && (n[u] = new g(n));
    }), i.hasAttribute && i.hasAttribute("data-ln-progress") && v(i) && !i[u] && (i[u] = new g(i));
  }
  function g(i) {
    return this.dom = i, o.call(this), l.call(this), this;
  }
  function p() {
    var i = new MutationObserver(function(e) {
      e.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(r) {
          r.nodeType === 1 && b(r);
        });
      });
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  p();
  function l() {
    var i = this, e = new MutationObserver(function(n) {
      n.forEach(function(r) {
        (r.attributeName === "data-ln-progress" || r.attributeName === "data-ln-progress-max") && o.call(i);
      });
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    });
  }
  function o() {
    var i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100, n = e > 0 ? i / e * 100 : 0;
    n < 0 && (n = 0), n > 100 && (n = 100), this.dom.style.width = n + "%", y(this.dom, "ln-progress:change", { target: this.dom, value: i, max: e, percentage: n });
  }
  window[u] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnProgress(document.body);
  }) : window.lnProgress(document.body);
})();
