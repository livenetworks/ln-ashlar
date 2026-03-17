(function() {
  const d = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0)
    return;
  function b(e, t, r) {
    e.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function _(e, t, r) {
    var n = new CustomEvent(t, {
      bubbles: !0,
      cancelable: !0,
      detail: r || {}
    });
    return e.dispatchEvent(n), n;
  }
  function y(e) {
    if (!e.hasAttribute(d) || e[c])
      return;
    e[c] = !0;
    const t = l(e);
    m(t.links), E(t.forms);
  }
  function m(e) {
    e.forEach(function(t) {
      if (t._lnAjaxAttached) return;
      const r = t.getAttribute("href");
      r && r.includes("#") || (t._lnAjaxAttached = !0, t.addEventListener("click", function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1)
          return;
        n.preventDefault();
        const s = t.getAttribute("href");
        s && h("GET", s, null, t);
      }));
    });
  }
  function E(e) {
    e.forEach(function(t) {
      t._lnAjaxAttached || (t._lnAjaxAttached = !0, t.addEventListener("submit", function(r) {
        r.preventDefault();
        const n = t.method.toUpperCase(), s = t.action, a = new FormData(t);
        t.querySelectorAll('button, input[type="submit"]').forEach(function(u) {
          u.disabled = !0;
        }), h(n, s, a, t, function() {
          t.querySelectorAll('button, input[type="submit"]').forEach(function(u) {
            u.disabled = !1;
          });
        });
      }));
    });
  }
  function h(e, t, r, n, s) {
    var a = _(n, "ln-ajax:before-start", { method: e, url: t });
    if (a.defaultPrevented) return;
    b(n, "ln-ajax:start", { method: e, url: t }), n.classList.add("ln-ajax--loading");
    const u = document.createElement("span");
    u.className = "ln-ajax-spinner", n.appendChild(u);
    function f() {
      n.classList.remove("ln-ajax--loading");
      const w = n.querySelector(".ln-ajax-spinner");
      w && w.remove(), s && s();
    }
    let p = t;
    const g = document.querySelector('meta[name="csrf-token"]'), A = g ? g.getAttribute("content") : null;
    r instanceof FormData && A && r.append("_token", A);
    const L = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (A && (L.headers["X-CSRF-TOKEN"] = A), e === "GET" && r) {
      const w = new URLSearchParams(r);
      p = t + (t.includes("?") ? "&" : "?") + w.toString();
    } else e !== "GET" && r && (L.body = r);
    fetch(p, L).then((w) => w.json()).then((w) => {
      if (w.title && (document.title = w.title), w.content)
        for (let T in w.content) {
          const C = document.getElementById(T);
          C && (C.innerHTML = w.content[T]);
        }
      if (n.tagName === "A") {
        const T = n.getAttribute("href");
        T && window.history.pushState({ ajax: !0 }, "", T);
      } else n.tagName === "FORM" && n.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", p);
      b(n, "ln-ajax:success", { method: e, url: p, data: w }), b(n, "ln-ajax:complete", { method: e, url: p }), f();
    }).catch((w) => {
      b(n, "ln-ajax:error", { method: e, url: p, error: w }), b(n, "ln-ajax:complete", { method: e, url: p }), f();
    });
  }
  function l(e) {
    const t = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(d) !== "false" ? t.links.push(e) : e.tagName === "FORM" && e.getAttribute(d) !== "false" ? t.forms.push(e) : (t.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), t.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), t;
  }
  function o() {
    new MutationObserver(function(t) {
      t.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(n) {
          if (n.nodeType === 1 && (y(n), !n.hasAttribute(d))) {
            n.querySelectorAll("[" + d + "]").forEach(function(u) {
              y(u);
            });
            var s = n.closest && n.closest("[" + d + "]");
            if (s && s.getAttribute(d) !== "false") {
              var a = l(n);
              console.log("[ln-ajax] re-attach on injected node:", n, "links:", a.links.length, "forms:", a.forms.length), m(a.links), E(a.forms);
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
    document.querySelectorAll("[" + d + "]").forEach(function(e) {
      y(e);
    });
  }
  window[c] = y, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const d = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0)
    return;
  function b(e, t, r) {
    e.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: Object.assign({ modalId: e.id, target: e }, {})
    }));
  }
  function _(e, t) {
    var r = new CustomEvent(t, {
      bubbles: !0,
      cancelable: !0,
      detail: { modalId: e.id, target: e }
    });
    return e.dispatchEvent(r), r;
  }
  function y(e) {
    const t = document.getElementById(e);
    if (!t) {
      console.warn('Modal with ID "' + e + '" not found');
      return;
    }
    var r = _(t, "ln-modal:before-open");
    r.defaultPrevented || (t.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"), b(t, "ln-modal:open"));
  }
  function m(e) {
    const t = document.getElementById(e);
    if (t) {
      var r = _(t, "ln-modal:before-close");
      r.defaultPrevented || (t.classList.remove("ln-modal--open"), b(t, "ln-modal:close"), document.querySelector(".ln-modal.ln-modal--open") || document.body.classList.remove("ln-modal-open"));
    }
  }
  function E(e) {
    const t = document.getElementById(e);
    if (!t) {
      console.warn('Modal with ID "' + e + '" not found');
      return;
    }
    t.classList.contains("ln-modal--open") ? m(e) : y(e);
  }
  function h(e) {
    const t = e.querySelectorAll("[data-ln-modal-close]"), r = e.id;
    t.forEach(function(n) {
      n._lnModalCloseAttached || (n._lnModalCloseAttached = !0, n.addEventListener("click", function(s) {
        s.preventDefault(), m(r);
      }));
    });
  }
  function l(e) {
    e.forEach(function(t) {
      t._lnModalAttached || (t._lnModalAttached = !0, t.addEventListener("click", function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1)
          return;
        r.preventDefault();
        const n = t.getAttribute(d);
        n && E(n);
      }));
    });
  }
  function o() {
    const e = document.querySelectorAll("[" + d + "]");
    l(e), document.querySelectorAll(".ln-modal").forEach(function(r) {
      h(r);
    }), document.addEventListener("keydown", function(r) {
      r.key === "Escape" && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(s) {
        m(s.id);
      });
    });
  }
  function i() {
    new MutationObserver(function(t) {
      t.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(n) {
          if (n.nodeType === 1) {
            n.hasAttribute(d) && l([n]);
            const s = n.querySelectorAll("[" + d + "]");
            s.length > 0 && l(s), n.id && n.classList.contains("ln-modal") && h(n);
            const a = n.querySelectorAll(".ln-modal");
            a.length > 0 && a.forEach(function(u) {
              h(u);
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
    open: y,
    close: m,
    toggle: E
  }, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const d = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0)
    return;
  const b = /* @__PURE__ */ new WeakMap();
  var _ = [];
  if (!history._lnNavPatched) {
    var y = history.pushState;
    history.pushState = function() {
      y.apply(history, arguments), _.forEach(function(e) {
        e();
      });
    }, history._lnNavPatched = !0;
  }
  function m(e) {
    if (!e.hasAttribute(d) || b.has(e)) return;
    const t = e.getAttribute(d);
    if (!t) return;
    const r = E(e, t);
    b.set(e, r);
  }
  function E(e, t) {
    let r = Array.from(e.querySelectorAll("a"));
    l(r, t, window.location.pathname);
    var n = function() {
      r = Array.from(e.querySelectorAll("a")), l(r, t, window.location.pathname);
    };
    window.addEventListener("popstate", n), _.push(n);
    const s = new MutationObserver(function(a) {
      a.forEach(function(u) {
        u.type === "childList" && (u.addedNodes.forEach(function(f) {
          if (f.nodeType === 1) {
            if (f.tagName === "A")
              r.push(f), l([f], t, window.location.pathname);
            else if (f.querySelectorAll) {
              const p = Array.from(f.querySelectorAll("a"));
              r = r.concat(p), l(p, t, window.location.pathname);
            }
          }
        }), u.removedNodes.forEach(function(f) {
          if (f.nodeType === 1) {
            if (f.tagName === "A")
              r = r.filter(function(p) {
                return p !== f;
              });
            else if (f.querySelectorAll) {
              const p = Array.from(f.querySelectorAll("a"));
              r = r.filter(function(g) {
                return !p.includes(g);
              });
            }
          }
        }));
      });
    });
    return s.observe(e, { childList: !0, subtree: !0 }), { navElement: e, activeClass: t, observer: s };
  }
  function h(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function l(e, t, r) {
    const n = h(r);
    e.forEach(function(s) {
      const a = s.getAttribute("href");
      if (!a) return;
      const u = h(a);
      s.classList.remove(t);
      const f = u === n, p = u !== "/" && n.startsWith(u + "/");
      (f || p) && s.classList.add(t);
    });
  }
  function o() {
    var e = new MutationObserver(function(t) {
      t.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(n) {
          n.nodeType === 1 && (n.hasAttribute && n.hasAttribute(d) && m(n), n.querySelectorAll && n.querySelectorAll("[" + d + "]").forEach(m));
        });
      });
    });
    e.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[c] = m;
  function i() {
    document.querySelectorAll("[" + d + "]").forEach(m);
  }
  o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const d = window.TomSelect;
  if (!d) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const c = /* @__PURE__ */ new WeakMap();
  function b(E) {
    if (c.has(E))
      return;
    const h = E.getAttribute("data-ln-select");
    let l = {};
    if (h && h.trim() !== "")
      try {
        l = JSON.parse(h);
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
      placeholder: E.getAttribute("placeholder") || "Select...",
      // Load throttle for search
      loadThrottle: 300
    }, ...l };
    try {
      const e = new d(E, i);
      c.set(E, e);
      const t = E.closest("form");
      t && t.addEventListener("reset", () => {
        setTimeout(() => {
          e.clear(), e.clearOptions(), e.sync();
        }, 0);
      });
    } catch (e) {
      console.error("Failed to initialize Tom Select:", e);
    }
  }
  function _(E) {
    const h = c.get(E);
    h && (h.destroy(), c.delete(E));
  }
  function y() {
    document.querySelectorAll("select[data-ln-select]").forEach(b);
  }
  function m() {
    new MutationObserver((h) => {
      h.forEach((l) => {
        l.addedNodes.forEach((o) => {
          o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && b(o), o.querySelectorAll && o.querySelectorAll("select[data-ln-select]").forEach(b));
        }), l.removedNodes.forEach((o) => {
          o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && _(o), o.querySelectorAll && o.querySelectorAll("select[data-ln-select]").forEach(_));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    y(), m();
  }) : (y(), m()), window.lnSelect = {
    initialize: b,
    destroy: _,
    getInstance: (E) => c.get(E)
  };
})();
(function() {
  const d = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function b(o = document.body) {
    _(o);
  }
  function _(o) {
    if (o.nodeType !== 1) return;
    let i = Array.from(o.querySelectorAll("[" + d + "]"));
    o.hasAttribute && o.hasAttribute(d) && i.push(o), i.forEach(function(e) {
      e[c] || (e[c] = new m(e));
    });
  }
  function y() {
    const o = (location.hash || "").replace("#", ""), i = {};
    return o && o.split("&").forEach(function(e) {
      const t = e.indexOf(":");
      t > 0 && (i[e.slice(0, t)] = e.slice(t + 1));
    }), i;
  }
  function m(o) {
    return this.dom = o, E.call(this), this;
  }
  function E() {
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
            const t = Object.keys(e).map(function(r) {
              return r + ":" + e[r];
            }).join("&");
            location.hash === "#" + t ? this.activate(i) : location.hash = t;
          } else
            this.activate(i);
      });
    }), this._hashHandler = () => {
      if (!this.hashEnabled) return;
      const o = y();
      this.activate(this.nsKey in o ? o[this.nsKey] : this.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  m.prototype.activate = function(o) {
    var i;
    (!o || !(o in this.mapPanels)) && (o = this.defaultKey);
    for (const e in this.mapTabs) {
      const t = this.mapTabs[e];
      e === o ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const t = this.mapPanels[e], r = e === o;
      t.classList.toggle("hidden", !r), t.setAttribute("aria-hidden", r ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (i = this.mapPanels[o]) == null ? void 0 : i.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    h(this.dom, "ln-tabs:change", { key: o, tab: this.mapTabs[o], panel: this.mapPanels[o] });
  };
  function h(o, i, e) {
    o.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function l() {
    new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.addedNodes.forEach(function(t) {
          _(t);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  l(), window[c] = b, b(document.body);
})();
(function() {
  const d = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function b(o) {
    _(o), y(o);
  }
  function _(o) {
    var i = Array.from(o.querySelectorAll("[" + d + "]"));
    o.hasAttribute && o.hasAttribute(d) && i.push(o), i.forEach(function(e) {
      e[c] || (e[c] = new m(e));
    });
  }
  function y(o) {
    var i = Array.from(o.querySelectorAll("[data-ln-toggle-for]"));
    o.hasAttribute && o.hasAttribute("data-ln-toggle-for") && i.push(o), i.forEach(function(e) {
      e[c + "Trigger"] || (e[c + "Trigger"] = !0, e.addEventListener("click", function(t) {
        if (!(t.ctrlKey || t.metaKey || t.button === 1)) {
          t.preventDefault();
          var r = e.getAttribute("data-ln-toggle-for"), n = document.getElementById(r);
          if (!(!n || !n[c])) {
            var s = e.getAttribute("data-ln-toggle-action") || "toggle";
            n[c][s]();
          }
        }
      }));
    });
  }
  function m(o) {
    return this.dom = o, this.isOpen = o.getAttribute(d) === "open", this.isOpen && o.classList.add("open"), this;
  }
  m.prototype.open = function() {
    if (!this.isOpen) {
      var o = h(this.dom, "ln-toggle:before-open", { target: this.dom });
      o.defaultPrevented || (this.isOpen = !0, this.dom.classList.add("open"), E(this.dom, "ln-toggle:open", { target: this.dom }));
    }
  }, m.prototype.close = function() {
    if (this.isOpen) {
      var o = h(this.dom, "ln-toggle:before-close", { target: this.dom });
      o.defaultPrevented || (this.isOpen = !1, this.dom.classList.remove("open"), E(this.dom, "ln-toggle:close", { target: this.dom }));
    }
  }, m.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  };
  function E(o, i, e) {
    o.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function h(o, i, e) {
    var t = new CustomEvent(i, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return o.dispatchEvent(t), t;
  }
  function l() {
    var o = new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(t) {
          t.nodeType === 1 && (_(t), y(t));
        });
      });
    });
    o.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = b, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const d = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function b(h) {
    _(h);
  }
  function _(h) {
    var l = Array.from(h.querySelectorAll("[" + d + "]"));
    h.hasAttribute && h.hasAttribute(d) && l.push(h), l.forEach(function(o) {
      o[c] || (o[c] = new y(o));
    });
  }
  function y(h) {
    return this.dom = h, h.addEventListener("ln-toggle:open", function(l) {
      var o = h.querySelectorAll("[data-ln-toggle]");
      o.forEach(function(i) {
        i !== l.detail.target && i.lnToggle && i.lnToggle.isOpen && i.lnToggle.close();
      }), m(h, "ln-accordion:change", { target: l.detail.target });
    }), this;
  }
  function m(h, l, o) {
    h.dispatchEvent(new CustomEvent(l, {
      bubbles: !0,
      detail: o || {}
    }));
  }
  function E() {
    var h = new MutationObserver(function(l) {
      l.forEach(function(o) {
        o.type === "childList" && o.addedNodes.forEach(function(i) {
          i.nodeType === 1 && _(i);
        });
      });
    });
    h.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = b, E(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const d = "data-ln-toast", c = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function _(r = document.body) {
    return y(r), e;
  }
  function y(r) {
    if (!r || r.nodeType !== 1) return;
    let n = Array.from(r.querySelectorAll("[" + d + "]"));
    r.hasAttribute && r.hasAttribute(d) && n.push(r), n.forEach((s) => {
      s[c] || new m(s);
    });
  }
  function m(r) {
    return this.dom = r, r[c] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10), Array.from(r.querySelectorAll("[data-ln-toast-item]")).forEach((n) => {
      E(n);
    }), this;
  }
  function E(r) {
    const n = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), s = r.getAttribute("data-title"), a = (r.innerText || r.textContent || "").trim();
    r.className = "ln-toast__item", r.removeAttribute("data-ln-toast-item");
    const u = document.createElement("div");
    u.className = "ln-toast__card ln-toast__card--" + n, u.setAttribute("role", n === "error" ? "alert" : "status"), u.setAttribute("aria-live", n === "error" ? "assertive" : "polite");
    const f = document.createElement("div");
    f.className = "ln-toast__side", f.innerHTML = b[n] || b.info;
    const p = document.createElement("div");
    p.className = "ln-toast__content";
    const g = document.createElement("div");
    g.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = s || (n === "success" ? "Success" : n === "error" ? "Error" : n === "warn" ? "Warning" : "Information");
    const L = document.createElement("button");
    if (L.type = "button", L.className = "ln-toast__close ln-icon-close", L.setAttribute("aria-label", "Close"), L.addEventListener("click", () => l(r)), g.appendChild(A), p.appendChild(g), p.appendChild(L), a) {
      const w = document.createElement("div");
      w.className = "ln-toast__body";
      const T = document.createElement("p");
      T.textContent = a, w.appendChild(T), p.appendChild(w);
    }
    u.appendChild(f), u.appendChild(p), r.innerHTML = "", r.appendChild(u), requestAnimationFrame(() => r.classList.add("ln-toast__item--in"));
  }
  function h(r, n) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(n), requestAnimationFrame(() => n.classList.add("ln-toast__item--in"));
  }
  function l(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function o(r = {}) {
    let n = r.container;
    if (typeof n == "string" && (n = document.querySelector(n)), n instanceof HTMLElement || (n = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), !n) return null;
    const s = n[c] || new m(n), a = Number.isFinite(r.timeout) ? r.timeout : s.timeoutDefault, u = (r.type || "info").toLowerCase(), f = document.createElement("li");
    f.className = "ln-toast__item";
    const p = document.createElement("div");
    p.className = "ln-toast__card ln-toast__card--" + u, p.setAttribute("role", u === "error" ? "alert" : "status"), p.setAttribute("aria-live", u === "error" ? "assertive" : "polite");
    const g = document.createElement("div");
    g.className = "ln-toast__side", g.innerHTML = b[u] || b.info;
    const A = document.createElement("div");
    A.className = "ln-toast__content";
    const L = document.createElement("div");
    L.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = r.title || (u === "success" ? "Success" : u === "error" ? "Error" : u === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close ln-icon-close", T.setAttribute("aria-label", "Close"), T.addEventListener("click", () => l(f)), L.appendChild(w), A.appendChild(L), A.appendChild(T), r.message || r.data && r.data.errors) {
      const C = document.createElement("div");
      if (C.className = "ln-toast__body", r.message)
        if (Array.isArray(r.message)) {
          const M = document.createElement("ul");
          r.message.forEach(function(N) {
            const v = document.createElement("li");
            v.textContent = N, M.appendChild(v);
          }), C.appendChild(M);
        } else {
          const M = document.createElement("p");
          M.textContent = r.message, C.appendChild(M);
        }
      if (r.data && r.data.errors) {
        const M = document.createElement("ul");
        Object.values(r.data.errors).flat().forEach((N) => {
          const v = document.createElement("li");
          v.textContent = N, M.appendChild(v);
        }), C.appendChild(M);
      }
      A.appendChild(C);
    }
    return p.appendChild(g), p.appendChild(A), f.appendChild(p), h(s, f), a > 0 && (f._timer = setTimeout(() => l(f), a)), f;
  }
  function i(r) {
    let n = r;
    typeof n == "string" && (n = document.querySelector(n)), n instanceof HTMLElement || (n = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), n && Array.from(n.children).forEach(l);
  }
  const e = function(r) {
    return _(r);
  };
  e.enqueue = o, e.clear = i, new MutationObserver((r) => {
    r.forEach((n) => n.addedNodes.forEach((s) => y(s)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[c] = e, window.addEventListener("ln-toast:enqueue", function(r) {
    r.detail && e.enqueue(r.detail);
  }), _(document.body);
})();
(function() {
  const d = "data-ln-upload", c = "lnUpload", b = "data-ln-upload-dict", _ = "data-ln-upload-accept", y = "data-ln-upload-context";
  if (window[c] !== void 0)
    return;
  function m(n, s) {
    const a = n.querySelector("[" + b + '="' + s + '"]');
    return a ? a.textContent : s;
  }
  function E(n) {
    if (n === 0) return "0 B";
    const s = 1024, a = ["B", "KB", "MB", "GB"], u = Math.floor(Math.log(n) / Math.log(s));
    return parseFloat((n / Math.pow(s, u)).toFixed(1)) + " " + a[u];
  }
  function h(n) {
    return n.split(".").pop().toLowerCase();
  }
  function l(n) {
    return n === "docx" && (n = "doc"), ["pdf", "doc", "epub"].includes(n) ? "ln-icon-file-" + n : "ln-icon-file";
  }
  function o(n, s) {
    if (!s) return !0;
    const a = "." + h(n.name);
    return s.split(",").map(function(f) {
      return f.trim().toLowerCase();
    }).includes(a.toLowerCase());
  }
  function i(n, s, a) {
    n.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: a
    }));
  }
  function e(n) {
    if (n.hasAttribute("data-ln-upload-initialized")) return;
    n.setAttribute("data-ln-upload-initialized", "true");
    const s = n.querySelector(".ln-upload__zone"), a = n.querySelector(".ln-upload__list"), u = n.getAttribute(_) || "";
    let f = n.querySelector('input[type="file"]');
    f || (f = document.createElement("input"), f.type = "file", f.multiple = !0, f.style.display = "none", u && (f.accept = u.split(",").map(function(v) {
      return v = v.trim(), v.startsWith(".") ? v : "." + v;
    }).join(",")), n.appendChild(f));
    const p = n.getAttribute(d) || "/files/upload", g = n.getAttribute(y) || "", A = /* @__PURE__ */ new Map();
    let L = 0;
    function w() {
      const v = document.querySelector('meta[name="csrf-token"]');
      return v ? v.getAttribute("content") : "";
    }
    function T(v) {
      if (!o(v, u)) {
        const O = m(n, "invalid-type");
        i(n, "ln-upload:invalid", {
          file: v,
          message: O
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: O || "This file type is not allowed"
          }
        }));
        return;
      }
      const S = "file-" + ++L, q = h(v.name), B = l(q), I = document.createElement("li");
      I.className = "ln-upload__item ln-upload__item--uploading " + B, I.setAttribute("data-file-id", S);
      const F = document.createElement("span");
      F.className = "ln-upload__name", F.textContent = v.name;
      const k = document.createElement("span");
      k.className = "ln-upload__size", k.textContent = "0%";
      const x = document.createElement("button");
      x.type = "button", x.className = "ln-upload__remove ln-icon-close", x.title = m(n, "remove"), x.textContent = "×", x.disabled = !0;
      const U = document.createElement("div");
      U.className = "ln-upload__progress";
      const H = document.createElement("div");
      H.className = "ln-upload__progress-bar", U.appendChild(H), I.appendChild(F), I.appendChild(k), I.appendChild(x), I.appendChild(U), a.appendChild(I);
      const z = new FormData();
      z.append("file", v), z.append("context", g);
      const D = new XMLHttpRequest();
      D.upload.addEventListener("progress", function(O) {
        if (O.lengthComputable) {
          const R = Math.round(O.loaded / O.total * 100);
          H.style.width = R + "%", k.textContent = R + "%";
        }
      }), D.addEventListener("load", function() {
        if (D.status >= 200 && D.status < 300) {
          var O;
          try {
            O = JSON.parse(D.responseText);
          } catch {
            j("Invalid response");
            return;
          }
          I.classList.remove("ln-upload__item--uploading"), k.textContent = E(O.size || v.size), x.disabled = !1, A.set(S, {
            serverId: O.id,
            name: O.name,
            size: O.size
          }), C(), i(n, "ln-upload:uploaded", {
            localId: S,
            serverId: O.id,
            name: O.name
          });
        } else {
          var R = "Upload failed";
          try {
            var P = JSON.parse(D.responseText);
            R = P.message || R;
          } catch {
          }
          j(R);
        }
      }), D.addEventListener("error", function() {
        j("Network error");
      });
      function j(O) {
        I.classList.remove("ln-upload__item--uploading"), I.classList.add("ln-upload__item--error"), H.style.width = "100%", k.textContent = m(n, "error"), x.disabled = !1, i(n, "ln-upload:error", {
          file: v,
          message: O
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: O || m(n, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      D.open("POST", p), D.setRequestHeader("X-CSRF-TOKEN", w()), D.setRequestHeader("Accept", "application/json"), D.send(z);
    }
    function C() {
      n.querySelectorAll('input[name="file_ids[]"]').forEach(function(v) {
        v.remove();
      }), A.forEach(function(v) {
        const S = document.createElement("input");
        S.type = "hidden", S.name = "file_ids[]", S.value = v.serverId, n.appendChild(S);
      });
    }
    function M(v) {
      const S = A.get(v), q = a.querySelector('[data-file-id="' + v + '"]');
      if (!S || !S.serverId) {
        q && q.remove(), A.delete(v), C();
        return;
      }
      q && q.classList.add("ln-upload__item--deleting"), fetch("/files/" + S.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": w(),
          Accept: "application/json"
        }
      }).then((B) => {
        B.status === 200 ? (q && q.remove(), A.delete(v), C(), i(n, "ln-upload:removed", {
          localId: v,
          serverId: S.serverId
        })) : (q && q.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: m(n, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((B) => {
        console.error("Delete error:", B), q && q.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function N(v) {
      Array.from(v).forEach(function(S) {
        T(S);
      }), f.value = "";
    }
    s.addEventListener("click", function() {
      f.click();
    }), f.addEventListener("change", function() {
      N(this.files);
    }), s.addEventListener("dragenter", function(v) {
      v.preventDefault(), v.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }), s.addEventListener("dragover", function(v) {
      v.preventDefault(), v.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }), s.addEventListener("dragleave", function(v) {
      v.preventDefault(), v.stopPropagation(), s.classList.remove("ln-upload__zone--dragover");
    }), s.addEventListener("drop", function(v) {
      v.preventDefault(), v.stopPropagation(), s.classList.remove("ln-upload__zone--dragover"), N(v.dataTransfer.files);
    }), a.addEventListener("click", function(v) {
      if (v.target.classList.contains("ln-upload__remove")) {
        const S = v.target.closest(".ln-upload__item");
        S && M(S.getAttribute("data-file-id"));
      }
    }), n.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(v) {
          return v.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        A.forEach(function(v) {
          v.serverId && fetch("/files/" + v.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": w(),
              Accept: "application/json"
            }
          });
        }), A.clear(), a.innerHTML = "", C(), i(n, "ln-upload:cleared", {});
      }
    };
  }
  function t() {
    document.querySelectorAll("[" + d + "]").forEach(e);
  }
  function r() {
    new MutationObserver(function(s) {
      s.forEach(function(a) {
        a.type === "childList" && a.addedNodes.forEach(function(u) {
          u.nodeType === 1 && (u.hasAttribute(d) && e(u), u.querySelectorAll("[" + d + "]").forEach(e));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    init: e,
    initAll: t
  }, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
})();
(function() {
  const d = "lnExternalLinks";
  if (window[d] !== void 0)
    return;
  function c(l, o, i) {
    l.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: i
    }));
  }
  function b(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function _(l) {
    l.getAttribute("data-ln-external-link") !== "processed" && b(l) && (l.target = "_blank", l.rel = "noopener noreferrer", l.setAttribute("data-ln-external-link", "processed"), c(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    }));
  }
  function y(l) {
    l = l || document.body, l.querySelectorAll("a, area").forEach(function(i) {
      _(i);
    });
  }
  function m() {
    document.body.addEventListener("click", function(l) {
      const o = l.target.closest("a, area");
      o && o.getAttribute("data-ln-external-link") === "processed" && c(o, "ln-external-links:clicked", {
        link: o,
        href: o.href,
        text: o.textContent || o.title || ""
      });
    });
  }
  function E() {
    new MutationObserver(function(o) {
      o.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(e) {
          if (e.nodeType === 1) {
            e.matches && (e.matches("a") || e.matches("area")) && _(e);
            const t = e.querySelectorAll && e.querySelectorAll("a, area");
            t && t.forEach(_);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function h() {
    m(), E(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[d] = {
    process: y
  }, h();
})();
(function() {
  const d = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  function b(a, u, f) {
    var p = new CustomEvent(u, {
      bubbles: !0,
      cancelable: !0,
      detail: f || {}
    });
    return a.dispatchEvent(p), p;
  }
  var _ = null;
  function y() {
    _ = document.createElement("div"), _.className = "ln-link-status", document.body.appendChild(_);
  }
  function m(a) {
    _ && (_.textContent = a, _.classList.add("ln-link-status--visible"));
  }
  function E() {
    _ && _.classList.remove("ln-link-status--visible");
  }
  function h(a, u) {
    if (!u.target.closest("a, button, input, select, textarea")) {
      var f = a.querySelector("a");
      if (f) {
        var p = f.getAttribute("href");
        if (p) {
          if (u.ctrlKey || u.metaKey || u.button === 1) {
            window.open(p, "_blank");
            return;
          }
          var g = b(a, "ln-link:navigate", { target: a, href: p, link: f });
          g.defaultPrevented || f.click();
        }
      }
    }
  }
  function l(a) {
    var u = a.querySelector("a");
    if (u) {
      var f = u.getAttribute("href");
      f && m(f);
    }
  }
  function o() {
    E();
  }
  function i(a) {
    a._lnLinkInit || (a._lnLinkInit = !0, a.querySelector("a") && (a.addEventListener("click", function(u) {
      h(a, u);
    }), a.addEventListener("mouseenter", function() {
      l(a);
    }), a.addEventListener("mouseleave", o)));
  }
  function e(a) {
    if (!a._lnLinkInit) {
      a._lnLinkInit = !0;
      var u = a.tagName;
      if (u === "TABLE" || u === "TBODY") {
        var f = u === "TABLE" && a.querySelector("tbody") || a, p = f.querySelectorAll("tr");
        p.forEach(i);
      } else i(a);
    }
  }
  function t(a) {
    a.hasAttribute && a.hasAttribute(d) && e(a);
    var u = a.querySelectorAll ? a.querySelectorAll("[" + d + "]") : [];
    u.forEach(e);
  }
  function r() {
    var a = new MutationObserver(function(u) {
      u.forEach(function(f) {
        f.type === "childList" && f.addedNodes.forEach(function(p) {
          if (p.nodeType === 1 && (t(p), p.tagName === "TR")) {
            var g = p.closest("[" + d + "]");
            g && i(p);
          }
        });
      });
    });
    a.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function n(a) {
    t(a);
  }
  window[c] = { init: n };
  function s() {
    y(), r(), n(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const d = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0)
    return;
  function b(i) {
    var e = i.getAttribute("data-ln-progress");
    return e !== null && e !== "";
  }
  function _(i) {
    m(i);
  }
  function y(i, e, t) {
    i.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function m(i) {
    var e = Array.from(i.querySelectorAll(d));
    e.forEach(function(t) {
      b(t) && !t[c] && (t[c] = new E(t));
    }), i.hasAttribute && i.hasAttribute("data-ln-progress") && b(i) && !i[c] && (i[c] = new E(i));
  }
  function E(i) {
    return this.dom = i, o.call(this), l.call(this), this;
  }
  function h() {
    var i = new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(r) {
          r.nodeType === 1 && m(r);
        });
      });
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  h();
  function l() {
    var i = this, e = new MutationObserver(function(t) {
      t.forEach(function(r) {
        (r.attributeName === "data-ln-progress" || r.attributeName === "data-ln-progress-max") && o.call(i);
      });
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    });
  }
  function o() {
    var i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100, t = e > 0 ? i / e * 100 : 0;
    t < 0 && (t = 0), t > 100 && (t = 100), this.dom.style.width = t + "%", y(this.dom, "ln-progress:change", { target: this.dom, value: i, max: e, percentage: t });
  }
  window[c] = _, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnProgress(document.body);
  }) : window.lnProgress(document.body);
})();
(function() {
  const d = "data-ln-filter", c = "lnFilter", b = "data-ln-filter-initialized", _ = "data-ln-filter-key", y = "data-ln-filter-value", m = "data-ln-filter-hide";
  if (window[c] !== void 0) return;
  function E(e) {
    h(e);
  }
  function h(e) {
    var t = Array.from(e.querySelectorAll("[" + d + "]"));
    e.hasAttribute && e.hasAttribute(d) && t.push(e), t.forEach(function(r) {
      r[c] || (r[c] = new l(r));
    });
  }
  function l(e) {
    return e.hasAttribute(b) ? this : (this.dom = e, this.targetId = e.getAttribute(d), this.buttons = Array.from(e.querySelectorAll("button")), this._attachHandlers(), e.setAttribute(b, ""), this);
  }
  l.prototype._attachHandlers = function() {
    var e = this;
    this.buttons.forEach(function(t) {
      t[c + "Bound"] || (t[c + "Bound"] = !0, t.addEventListener("click", function(r) {
        e.buttons.forEach(function(n) {
          n.classList.remove("active");
        }), t.classList.add("active"), e._filter(t);
      }));
    });
  }, l.prototype._filter = function(e) {
    var t = document.getElementById(this.targetId);
    if (t) {
      var r = e.getAttribute(_), n = e.getAttribute(y);
      if (r) {
        for (var s = t.querySelectorAll("[data-" + r + "]"), a = 0, u = s.length, f = 0; f < s.length; f++) {
          var p = s[f];
          p.removeAttribute(m), n !== "" && !p.getAttribute("data-" + r).toLowerCase().includes(n.toLowerCase()) ? p.setAttribute(m, "true") : a++;
        }
        o(this.dom, "ln-filter:change", {
          targetId: this.targetId,
          key: r,
          value: n,
          matched: a,
          total: u
        });
      }
    }
  };
  function o(e, t, r) {
    e.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function i() {
    var e = new MutationObserver(function(t) {
      t.forEach(function(r) {
        r.type === "childList" && r.addedNodes.forEach(function(n) {
          n.nodeType === 1 && h(n);
        });
      });
    });
    e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = E, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const d = "data-ln-search", c = "lnSearch", b = "data-ln-search-initialized", _ = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function m(i) {
    E(i);
  }
  function E(i) {
    var e = Array.from(i.querySelectorAll("[" + d + "]"));
    i.hasAttribute && i.hasAttribute(d) && e.push(i), e.forEach(function(t) {
      t[c] || (t[c] = new h(t));
    });
  }
  function h(i) {
    return i.hasAttribute(b) ? this : (this.dom = i, this.targetId = i.getAttribute(d), this.input = i.querySelector('[name="search"]') || i.querySelector('input[type="search"]') || i.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), i.setAttribute(b, ""), this);
  }
  h.prototype._attachHandler = function() {
    if (this.input) {
      var i = this;
      this.input.addEventListener("input", function() {
        clearTimeout(i._debounceTimer), i._debounceTimer = setTimeout(function() {
          i._search(i.input.value.trim().toLowerCase());
        }, 150);
      });
    }
  }, h.prototype._search = function(i) {
    var e = document.getElementById(this.targetId);
    if (e) {
      for (var t = e.children, r = 0, n = t.length, s = 0; s < t.length; s++) {
        var a = t[s];
        a.removeAttribute(_), i && !a.textContent.replace(/\s+/g, " ").toLowerCase().includes(i) ? a.setAttribute(_, "true") : r++;
      }
      l(this.dom, "ln-search:change", {
        targetId: this.targetId,
        term: i,
        matched: r,
        total: n
      });
    }
  };
  function l(i, e, t) {
    i.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function o() {
    var i = new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(r) {
          r.nodeType === 1 && E(r);
        });
      });
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = m, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "lnTableSearch", c = "data-ln-table-search", b = "data-ln-table-clear", _ = "data-ln-table";
  if (window[d] !== void 0) return;
  function m(o) {
    E(o);
  }
  function E(o) {
    var i = Array.from(o.querySelectorAll("[" + c + "]"));
    o.hasAttribute && o.hasAttribute(c) && i.push(o), i.forEach(function(e) {
      e[d] || (e[d] = new h(e));
    });
  }
  function h(o) {
    this.input = o, this._timer = null;
    var i = this;
    return o.addEventListener("input", function() {
      clearTimeout(i._timer), i._timer = setTimeout(function() {
        i._fire(o.value.trim().toLowerCase());
      }, 150);
    }), this;
  }
  h.prototype._fire = function(o) {
    var i = this.input.getAttribute(c), e = i ? document.getElementById(i) : null;
    e && e.dispatchEvent(new CustomEvent("ln-table:search", {
      bubbles: !0,
      detail: { term: o }
    }));
  }, document.addEventListener("click", function(o) {
    var i = o.target.closest("[" + b + "]");
    if (i) {
      var e = i.closest("[" + _ + "]");
      if (!(!e || !e.id)) {
        var t = document.querySelector("[" + c + '="' + e.id + '"]');
        t && (t.value = "", t.focus(), t[d] && t[d]._fire(""));
      }
    }
  });
  function l() {
    var o = new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.type === "childList" && e.addedNodes.forEach(function(t) {
          t.nodeType === 1 && E(t);
        });
      });
    });
    o.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[d] = m, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "lnTableSort", c = "data-ln-sort", b = "data-ln-sort-active";
  if (window[d] !== void 0) return;
  function _(l) {
    y(l);
  }
  function y(l) {
    var o = Array.from(l.querySelectorAll("table"));
    l.tagName === "TABLE" && o.push(l), o.forEach(function(i) {
      if (!i[d]) {
        var e = Array.from(i.querySelectorAll("th[" + c + "]"));
        e.length && (i[d] = new m(i, e));
      }
    });
  }
  function m(l, o) {
    this.table = l, this.ths = o, this._col = -1, this._dir = null;
    var i = this;
    return o.forEach(function(e, t) {
      e[d + "Bound"] || (e[d + "Bound"] = !0, e.addEventListener("click", function() {
        i._handleClick(t, e);
      }));
    }), this;
  }
  m.prototype._handleClick = function(l, o) {
    var i;
    this._col !== l ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(e) {
      e.removeAttribute(b);
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = l, this._dir = i, o.setAttribute(b, i)), E(this.table, "ln-table:sort", {
      column: l,
      sortType: o.getAttribute(c),
      direction: i
    });
  };
  function E(l, o, i) {
    l.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function h() {
    var l = new MutationObserver(function(o) {
      o.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(e) {
          e.nodeType === 1 && y(e);
        });
      });
    });
    l.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[d] = _, h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const d = "data-ln-table", c = "lnTable", b = "data-ln-sort", _ = "data-ln-table-empty", y = "data-ln-table-initialized";
  if (window[c] !== void 0) return;
  function h(t) {
    l(t);
  }
  function l(t) {
    var r = Array.from(t.querySelectorAll("[" + d + "]"));
    t.hasAttribute && t.hasAttribute(d) && r.push(t), r.forEach(function(n) {
      n[c] || (n[c] = new o(n));
    });
  }
  function o(t) {
    if (t.hasAttribute(y)) return this;
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._totalCount = 0, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null, this._collator = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
    var r = t.querySelector(".ln-table__toolbar");
    r && t.style.setProperty("--ln-table-toolbar-h", r.offsetHeight + "px");
    var n = this;
    return this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._tbodyObserver = new MutationObserver(function() {
      n.tbody.rows.length > 0 && (n._tbodyObserver.disconnect(), n._parseRows());
    }), this._tbodyObserver.observe(this.tbody, { childList: !0 })), t.addEventListener("ln-table:search", function(s) {
      var a = performance.now();
      n._searchTerm = s.detail.term, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), i(t, "ln-table:filter", {
        term: n._searchTerm,
        matched: n._filteredData.length,
        total: n._totalCount,
        duration: performance.now() - a
      });
    }), t.addEventListener("ln-table:sort", function(s) {
      var a = performance.now();
      n._sortCol = s.detail.direction === null ? -1 : s.detail.column, n._sortDir = s.detail.direction, n._sortType = s.detail.sortType, n._applyFilterAndSort(), n._vStart = -1, n._vEnd = -1, n._render(), i(t, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: n._filteredData.length,
        total: n._totalCount,
        duration: performance.now() - a
      });
    }), t.setAttribute(y, ""), this;
  }
  o.prototype._parseRows = function() {
    var t = this.tbody.rows, r = this.ths;
    this._data = [];
    for (var n = [], s = 0; s < r.length; s++)
      n[s] = r[s].getAttribute(b);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (var a = 0; a < t.length; a++) {
      for (var u = t[a], f = [], p = [], g = 0; g < u.cells.length; g++) {
        var A = u.cells[g], L = A.textContent.trim(), w = A.hasAttribute("data-ln-value") ? A.getAttribute("data-ln-value") : L, T = n[g];
        T === "number" || T === "date" ? f[g] = parseFloat(w) || 0 : T === "string" ? f[g] = String(w) : f[g] = null, g < u.cells.length - 1 && p.push(L.toLowerCase());
      }
      this._data.push({
        index: a,
        sortKeys: f,
        html: u.outerHTML,
        searchText: p.join(" ")
      });
    }
    this._totalCount = this._data.length, this._filteredData = this._data.slice(), this._render(), i(this.dom, "ln-table:ready", {
      total: this._totalCount
    });
  }, o.prototype._applyFilterAndSort = function() {
    if (!this._searchTerm)
      this._filteredData = this._data.slice();
    else {
      var t = this._searchTerm;
      this._filteredData = this._data.filter(function(f) {
        return f.searchText.indexOf(t) !== -1;
      });
    }
    if (!(this._sortCol < 0 || !this._sortDir)) {
      var r = this._sortCol, n = this._sortDir === "desc" ? -1 : 1, s = this._sortType === "number" || this._sortType === "date", a = this._collator, u = a ? a.compare : function(f, p) {
        return f < p ? -1 : f > p ? 1 : 0;
      };
      this._filteredData.sort(function(f, p) {
        var g = f.sortKeys[r], A = p.sortKeys[r];
        return s ? (g - A) * n : u(g, A) * n;
      });
    }
  }, o.prototype._lockColumnWidths = function() {
    if (!(!this.table || !this.thead || this._colgroup)) {
      var t = document.createElement("colgroup");
      this.ths.forEach(function(r) {
        var n = document.createElement("col");
        n.style.width = r.offsetWidth + "px", t.appendChild(n);
      }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
    }
  }, o.prototype._render = function() {
    if (this.tbody) {
      var t = this._filteredData.length;
      t === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
    }
  }, o.prototype._renderAll = function() {
    for (var t = [], r = this._filteredData, n = 0; n < r.length; n++) t.push(r[n].html);
    this.tbody.innerHTML = t.join("");
  }, o.prototype._enableVirtualScroll = function() {
    if (!this._virtual) {
      this._virtual = !0;
      var t = this;
      this._scrollHandler = function() {
        t._rafId || (t._rafId = requestAnimationFrame(function() {
          t._rafId = null, t._renderVirtual();
        }));
      }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
    }
  }, o.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, o.prototype._renderVirtual = function() {
    var t = this._filteredData, r = t.length, n = this._rowHeight;
    if (!(!n || !r)) {
      var s = this.table.getBoundingClientRect(), a = s.top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, f = a + u, p = window.scrollY - f, g = Math.max(0, Math.floor(p / n) - 15), A = Math.min(g + Math.ceil(window.innerHeight / n) + 30, r);
      if (!(g === this._vStart && A === this._vEnd)) {
        this._vStart = g, this._vEnd = A;
        var L = this.ths.length || 1, w = g * n, T = (r - A) * n, C = "";
        w > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>');
        for (var M = g; M < A; M++) C += t[M].html;
        T > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + T + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
      }
    }
  }, o.prototype._showEmptyState = function() {
    var t = this.ths.length || 1, r = this.dom.querySelector("template[" + _ + "]"), n = document.createElement("td");
    n.setAttribute("colspan", String(t)), r && n.appendChild(document.importNode(r.content, !0));
    var s = document.createElement("tr");
    s.className = "ln-table__empty", s.appendChild(n), this.tbody.innerHTML = "", this.tbody.appendChild(s), i(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._totalCount
    });
  };
  function i(t, r, n) {
    t.dispatchEvent(new CustomEvent(r, { bubbles: !0, detail: n || {} }));
  }
  function e() {
    var t = new MutationObserver(function(r) {
      r.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(s) {
          s.nodeType === 1 && l(s);
        });
      });
    });
    t.observe(document.body, { childList: !0, subtree: !0 });
  }
  window[c] = h, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    h(document.body);
  }) : h(document.body);
})();
