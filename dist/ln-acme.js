(function() {
  const m = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0)
    return;
  function h(e) {
    if (console.log(e), !e.hasAttribute(m) || e[c])
      return;
    e[c] = !0, console.log("constructor called with:", e);
    let t = d(e);
    console.log("Items found:", t), b(t.links), E(t.forms);
  }
  function b(e) {
    e.forEach(function(t) {
      if (t._lnAjaxAttached)
        return;
      const i = t.getAttribute("href");
      i && i.includes("#") || (t._lnAjaxAttached = !0, t.addEventListener("click", function(a) {
        if (a.ctrlKey || a.metaKey || a.button === 1)
          return;
        a.preventDefault();
        const r = t.getAttribute("href");
        r && v("GET", r, null, t);
      }));
    });
  }
  function E(e) {
    e.forEach(function(t) {
      t._lnAjaxAttached || (t._lnAjaxAttached = !0, t.addEventListener("submit", function(i) {
        i.preventDefault();
        const a = t.method.toUpperCase(), r = t.action, o = new FormData(t);
        console.log("Form submitted:", a, r), t.querySelectorAll('button, input[type="submit"]').forEach(function(u) {
          u.disabled = !0;
        }), v(a, r, o, t, function() {
          t.querySelectorAll('button, input[type="submit"]').forEach(function(u) {
            u.disabled = !1;
          });
        });
      }));
    });
  }
  function v(e, t, i, a, r) {
    console.log("Making AJAX request:", e, t), a.classList.add("ln-ajax--loading");
    let o = t;
    const u = document.querySelector('meta[name="csrf-token"]'), p = u ? u.getAttribute("content") : null;
    i instanceof FormData && p && i.append("_token", p);
    const g = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (p && (g.headers["X-CSRF-TOKEN"] = p), e === "GET" && i) {
      const f = new URLSearchParams(i);
      o = t + (t.includes("?") ? "&" : "?") + f.toString();
    } else e !== "GET" && i && (g.body = i);
    fetch(o, g).then((f) => f.json()).then((f) => {
      if (f.title && (document.title = f.title), f.content)
        for (let y in f.content) {
          const L = document.getElementById(y);
          L && (L.innerHTML = f.content[y]);
        }
      if (a.tagName === "A") {
        let y = a.getAttribute("href");
        y && window.history.pushState({ ajax: !0 }, "", y);
      } else a.tagName === "FORM" && a.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", o);
      f.message && window.lnToast && window.lnToast.enqueue({
        type: f.message.type,
        title: f.message.title,
        message: f.message.body,
        data: f.message.data
      }), a.classList.remove("ln-ajax--loading"), r && r();
    }).catch((f) => {
      console.error("AJAX error:", f), a.classList.remove("ln-ajax--loading"), r && r();
    });
  }
  function d(e) {
    let t = {
      links: [],
      forms: []
    };
    if (e.tagName === "A" && e.getAttribute(m) !== "false")
      t.links.push(e);
    else if (e.tagName === "FORM" && e.getAttribute(m) !== "false")
      t.forms.push(e);
    else {
      let i = e.querySelectorAll('a:not([data-ln-ajax="false"])') || [], a = e.querySelectorAll('form:not([data-ln-ajax="false"])') || [];
      t.links = Array.from(i), t.forms = Array.from(a);
    }
    return t;
  }
  function s() {
    new MutationObserver(function(t) {
      t.forEach(function(i) {
        i.type == "childList" && i.addedNodes.forEach(function(a) {
          a.nodeType === 1 && (h(a), a.hasAttribute && !a.hasAttribute(m) && a.querySelectorAll("[" + m + "]").forEach(function(o) {
            h(o);
          }));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  s(), window[c] = h;
  function n() {
    document.querySelectorAll("[" + m + "]").forEach(function(t) {
      h(t);
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const m = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0)
    return;
  function h(n) {
    const e = document.getElementById(n);
    if (!e) {
      console.warn('Modal with ID "' + n + '" not found');
      return;
    }
    e.classList.contains("ln-modal--open") ? (e.classList.remove("ln-modal--open"), document.body.classList.remove("ln-modal-open")) : (e.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"));
  }
  function b(n) {
    const e = document.getElementById(n);
    e && (e.classList.remove("ln-modal--open"), document.body.classList.remove("ln-modal-open"));
  }
  function E(n) {
    const e = n.querySelectorAll("[data-ln-modal-close]"), t = n.id;
    e.forEach(function(i) {
      i.addEventListener("click", function(a) {
        a.preventDefault(), b(t);
      });
    });
  }
  function v(n) {
    n.forEach(function(e) {
      e.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1)
          return;
        t.preventDefault();
        const i = e.getAttribute(m);
        i && h(i);
      });
    });
  }
  function d() {
    const n = document.querySelectorAll("[" + m + "]");
    v(n), document.querySelectorAll("[id]").forEach(function(t) {
      t.classList.contains("ln-modal") && E(t);
    }), document.addEventListener("keydown", function(t) {
      (t.key === "Escape" || t.keyCode === 27) && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(a) {
        b(a.id);
      });
    });
  }
  function s() {
    new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(i) {
          if (i.nodeType === 1) {
            i.hasAttribute(m) && v([i]);
            const a = i.querySelectorAll("[" + m + "]");
            a.length > 0 && v(a), i.id && i.classList.contains("ln-modal") && E(i);
            const r = i.querySelectorAll(".ln-modal");
            r.length > 0 && r.forEach(function(o) {
              E(o);
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
    toggle: h,
    close: b,
    open: function(n) {
      const e = document.getElementById(n);
      e && (e.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"));
    }
  }, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
(function() {
  const m = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0)
    return;
  const h = /* @__PURE__ */ new WeakMap();
  function b(n) {
    if (!n.hasAttribute(m) || h.has(n)) return;
    const e = n.getAttribute(m);
    if (!e) return;
    const t = E(n, e);
    h.set(n, t);
  }
  function E(n, e) {
    let t = Array.from(n.querySelectorAll("a"));
    d(t, e, window.location.pathname);
    const i = function() {
      t = Array.from(n.querySelectorAll("a")), d(t, e, window.location.pathname);
    };
    window.addEventListener("popstate", i);
    const a = history.pushState;
    history.pushState = function() {
      a.apply(history, arguments), t = Array.from(n.querySelectorAll("a")), d(t, e, window.location.pathname);
    };
    const r = new MutationObserver(function(o) {
      o.forEach(function(u) {
        u.type === "childList" && (u.addedNodes.forEach(function(p) {
          if (p.nodeType === 1) {
            if (p.tagName === "A")
              t.push(p), d([p], e, window.location.pathname);
            else if (p.querySelectorAll) {
              const g = Array.from(p.querySelectorAll("a"));
              t = t.concat(g), d(g, e, window.location.pathname);
            }
          }
        }), u.removedNodes.forEach(function(p) {
          if (p.nodeType === 1) {
            if (p.tagName === "A")
              t = t.filter(function(g) {
                return g !== p;
              });
            else if (p.querySelectorAll) {
              const g = Array.from(p.querySelectorAll("a"));
              t = t.filter(function(f) {
                return !g.includes(f);
              });
            }
          }
        }));
      });
    });
    return r.observe(n, {
      childList: !0,
      subtree: !0
    }), {
      navElement: n,
      activeClass: e,
      observer: r
    };
  }
  function v(n) {
    try {
      return new URL(n, window.location.origin).pathname.replace(/\/$/, "") || "/";
    } catch {
      return n.replace(/\/$/, "") || "/";
    }
  }
  function d(n, e, t) {
    const i = v(t);
    n.forEach(function(a) {
      const r = a.getAttribute("href");
      if (!r) return;
      const o = v(r);
      a.classList.remove(e);
      const u = o === i, p = o !== "/" && i.startsWith(o + "/");
      (u || p) && a.classList.add(e);
    });
  }
  window[c] = b;
  function s() {
    document.querySelectorAll("[" + m + "]").forEach(function(e) {
      b(e);
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const m = window.TomSelect;
  if (!m) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const c = /* @__PURE__ */ new WeakMap();
  function h(d) {
    if (c.has(d))
      return;
    const s = d.getAttribute("data-ln-select");
    let n = {};
    if (s && s.trim() !== "")
      try {
        n = JSON.parse(s);
      } catch (i) {
        console.warn("Invalid JSON in data-ln-select attribute:", i);
      }
    const t = { ...{
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
      placeholder: d.getAttribute("placeholder") || "Select...",
      // Load throttle for search
      loadThrottle: 300
    }, ...n };
    try {
      const i = new m(d, t);
      c.set(d, i);
      const a = d.closest("form");
      a && a.addEventListener("reset", () => {
        setTimeout(() => {
          i.clear(), i.clearOptions(), i.sync();
        }, 0);
      });
    } catch (i) {
      console.error("Failed to initialize Tom Select:", i);
    }
  }
  function b(d) {
    const s = c.get(d);
    s && (s.destroy(), c.delete(d));
  }
  function E() {
    document.querySelectorAll("select[data-ln-select]").forEach(h);
  }
  function v() {
    new MutationObserver((s) => {
      s.forEach((n) => {
        n.addedNodes.forEach((e) => {
          e.nodeType === 1 && (e.matches && e.matches("select[data-ln-select]") && h(e), e.querySelectorAll && e.querySelectorAll("select[data-ln-select]").forEach(h));
        }), n.removedNodes.forEach((e) => {
          e.nodeType === 1 && (e.matches && e.matches("select[data-ln-select]") && b(e), e.querySelectorAll && e.querySelectorAll("select[data-ln-select]").forEach(b));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    E(), v();
  }) : (E(), v()), window.lnSelect = {
    initialize: h,
    destroy: b,
    getInstance: (d) => c.get(d)
  };
})();
(function() {
  const m = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function h(s = document.body) {
    b(s);
  }
  function b(s) {
    if (s.nodeType !== 1) return;
    let n = Array.from(s.querySelectorAll("[" + m + "]"));
    s.hasAttribute && s.hasAttribute(m) && n.push(s), n.forEach(function(e) {
      e[c] || (e[c] = new E(e));
    });
  }
  function E(s) {
    return this.dom = s, v.call(this), this;
  }
  function v() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const s of this.tabs) {
      const n = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      n && (this.mapTabs[n] = s);
    }
    for (const s of this.panels) {
      const n = (s.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = s);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.tabs.forEach((s) => {
      s.addEventListener("click", () => {
        const n = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        n && (location.hash === "#" + n ? this.activate(n) : location.hash = n);
      });
    }), this._hashHandler = () => {
      const s = (location.hash || "").replace("#", "").toLowerCase();
      this.activate(s || this.defaultKey);
    }, window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
  }
  E.prototype.activate = function(s) {
    var n;
    (!s || !(s in this.mapPanels)) && (s = this.defaultKey);
    for (const e in this.mapTabs) {
      const t = this.mapTabs[e];
      e === s ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const t = this.mapPanels[e], i = e === s;
      t.classList.toggle("hidden", !i), t.setAttribute("aria-hidden", i ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (n = this.mapPanels[s]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
  };
  function d() {
    new MutationObserver(function(n) {
      n.forEach(function(e) {
        e.addedNodes.forEach(function(t) {
          b(t);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  d(), window[c] = h, h(document.body);
})();
(function() {
  const m = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function h(n) {
    b(n), E(n);
  }
  function b(n) {
    var e = n.querySelectorAll("[" + m + "]") || [];
    n.hasAttribute && n.hasAttribute(m) && (e = Array.from(e), e.push(n)), e.forEach(function(t) {
      t[c] || (t[c] = new v(t));
    });
  }
  function E(n) {
    var e = n.querySelectorAll("[data-ln-toggle-for]") || [];
    n.hasAttribute && n.hasAttribute("data-ln-toggle-for") && (e = Array.from(e), e.push(n)), e.forEach(function(t) {
      t.addEventListener("click", function(i) {
        i.preventDefault();
        var a = t.getAttribute("data-ln-toggle-for"), r = document.getElementById(a);
        if (!(!r || !r[c])) {
          var o = t.getAttribute("data-ln-toggle-action") || "toggle";
          r[c][o]();
        }
      });
    });
  }
  function v(n) {
    return this.dom = n, this.isOpen = n.getAttribute(m) === "open", this.isOpen && n.classList.add("open"), this;
  }
  v.prototype.open = function() {
    this.isOpen || (this.isOpen = !0, this.dom.classList.add("open"), d(this.dom, "ln-toggle:open", { target: this.dom }));
  }, v.prototype.close = function() {
    this.isOpen && (this.isOpen = !1, this.dom.classList.remove("open"), d(this.dom, "ln-toggle:close", { target: this.dom }));
  }, v.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  };
  function d(n, e, t) {
    n.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function s() {
    var n = new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(i) {
          i.nodeType === 1 && (b(i), E(i));
        });
      });
    });
    n.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = h, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    h(document.body);
  }) : h(document.body);
})();
(function() {
  const m = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function h(d) {
    b(d);
  }
  function b(d) {
    var s = d.querySelectorAll("[" + m + "]") || [];
    d.hasAttribute && d.hasAttribute(m) && (s = Array.from(s), s.push(d)), s.forEach(function(n) {
      n[c] || (n[c] = new E(n));
    });
  }
  function E(d) {
    return this.dom = d, d.addEventListener("ln-toggle:open", function(s) {
      var n = d.querySelectorAll("[data-ln-toggle]");
      n.forEach(function(e) {
        e !== s.detail.target && e.lnToggle && e.lnToggle.isOpen && e.lnToggle.close();
      });
    }), this;
  }
  function v() {
    var d = new MutationObserver(function(s) {
      s.forEach(function(n) {
        n.type === "childList" && n.addedNodes.forEach(function(e) {
          e.nodeType === 1 && b(e);
        });
      });
    });
    d.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = h, v(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    h(document.body);
  }) : h(document.body);
})();
(function() {
  const m = "data-ln-toast", c = "lnToast", h = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function b(r = document.body) {
    return E(r), i;
  }
  function E(r) {
    if (!r || r.nodeType !== 1) return;
    let o = Array.from(r.querySelectorAll("[" + m + "]"));
    r.hasAttribute && r.hasAttribute(m) && o.push(r), o.forEach((u) => {
      u[c] || new v(u);
    });
  }
  function v(r) {
    return this.dom = r, r[c] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10), Array.from(r.querySelectorAll("[data-ln-toast-item]")).forEach((o) => {
      d(o);
    }), this;
  }
  function d(r) {
    const o = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), u = r.getAttribute("data-title"), p = (r.innerText || r.textContent || "").trim();
    r.className = "ln-toast__item", r.removeAttribute("data-ln-toast-item");
    const g = document.createElement("div");
    g.className = "ln-toast__card ln-toast__card--" + o, g.setAttribute("role", o === "error" ? "alert" : "status"), g.setAttribute("aria-live", o === "error" ? "assertive" : "polite");
    const f = document.createElement("div");
    f.className = "ln-toast__side", f.innerHTML = h[o] || h.info;
    const y = document.createElement("div");
    y.className = "ln-toast__content";
    const L = document.createElement("div");
    L.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = u || (o === "success" ? "Success" : o === "error" ? "Error" : o === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close", T.setAttribute("aria-label", "Close"), T.innerHTML = "&times;", T.addEventListener("click", () => n(r)), L.appendChild(w), y.appendChild(L), y.appendChild(T), p) {
      const S = document.createElement("div");
      S.className = "ln-toast__body";
      const O = document.createElement("p");
      O.textContent = p, S.appendChild(O), y.appendChild(S);
    }
    g.appendChild(f), g.appendChild(y), r.innerHTML = "", r.appendChild(g), requestAnimationFrame(() => r.classList.add("ln-toast__item--in"));
  }
  function s(r, o) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(o), requestAnimationFrame(() => o.classList.add("ln-toast__item--in"));
  }
  function n(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function e(r = {}) {
    let o = r.container;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + m + "]") || document.getElementById("ln-toast-container")), !o) return null;
    const u = o[c] || new v(o), p = Number.isFinite(r.timeout) ? r.timeout : u.timeoutDefault, g = (r.type || "info").toLowerCase(), f = document.createElement("li");
    f.className = "ln-toast__item";
    const y = document.createElement("div");
    y.className = "ln-toast__card ln-toast__card--" + g, y.setAttribute("role", g === "error" ? "alert" : "status"), y.setAttribute("aria-live", g === "error" ? "assertive" : "polite");
    const L = document.createElement("div");
    L.className = "ln-toast__side", L.innerHTML = h[g] || h.info;
    const w = document.createElement("div");
    w.className = "ln-toast__content";
    const T = document.createElement("div");
    T.className = "ln-toast__head";
    const S = document.createElement("strong");
    S.className = "ln-toast__title", S.textContent = r.title || (g === "success" ? "Success" : g === "error" ? "Error" : g === "warn" ? "Warning" : "Information");
    const O = document.createElement("button");
    if (O.type = "button", O.className = "ln-toast__close", O.setAttribute("aria-label", "Close"), O.innerHTML = "&times;", O.addEventListener("click", () => n(f)), T.appendChild(S), w.appendChild(T), w.appendChild(O), r.message || r.data && r.data.errors) {
      const x = document.createElement("div");
      if (x.className = "ln-toast__body", r.message)
        if (Array.isArray(r.message)) {
          const M = document.createElement("ul");
          r.message.forEach(function(D) {
            const l = document.createElement("li");
            l.textContent = D, M.appendChild(l);
          }), x.appendChild(M);
        } else {
          const M = document.createElement("p");
          M.textContent = r.message, M.style.margin = "0", x.appendChild(M);
        }
      if (r.data && r.data.errors) {
        const M = document.createElement("ul");
        Object.values(r.data.errors).flat().forEach((D) => {
          const l = document.createElement("li");
          l.textContent = D, M.appendChild(l);
        }), x.appendChild(M);
      }
      w.appendChild(x);
    }
    return y.appendChild(L), y.appendChild(w), f.appendChild(y), s(u, f), p > 0 && (f._timer = setTimeout(() => n(f), p)), f;
  }
  function t(r) {
    let o = r;
    typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + m + "]") || document.getElementById("ln-toast-container")), o && Array.from(o.children).forEach(n);
  }
  const i = function(r) {
    return b(r);
  };
  i.enqueue = e, i.clear = t, new MutationObserver((r) => {
    r.forEach((o) => o.addedNodes.forEach((u) => E(u)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[c] = i, window.addEventListener("ln-toast:enqueue", function(r) {
    r.detail && i.enqueue(r.detail);
  }), b(document.body);
})();
(function() {
  const m = "data-ln-upload", c = "lnUpload", h = "data-ln-upload-dict", b = "data-ln-upload-accept", E = "data-ln-upload-context";
  if (window[c] !== void 0)
    return;
  function v(o, u) {
    const p = o.querySelector("[" + h + '="' + u + '"]');
    return p ? p.textContent : u;
  }
  function d(o) {
    if (o === 0) return "0 B";
    const u = 1024, p = ["B", "KB", "MB", "GB"], g = Math.floor(Math.log(o) / Math.log(u));
    return parseFloat((o / Math.pow(u, g)).toFixed(1)) + " " + p[g];
  }
  function s(o) {
    return o.split(".").pop().toLowerCase();
  }
  function n(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "ln-icon-file-" + o : "ln-icon-file";
  }
  function e(o, u) {
    if (!u) return !0;
    const p = "." + s(o.name);
    return u.split(",").map(function(f) {
      return f.trim().toLowerCase();
    }).includes(p.toLowerCase());
  }
  function t(o, u, p) {
    o.dispatchEvent(new CustomEvent(u, {
      bubbles: !0,
      detail: p
    }));
  }
  function i(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true");
    const u = o.querySelector(".ln-upload__zone"), p = o.querySelector(".ln-upload__list"), g = o.getAttribute(b) || "";
    let f = o.querySelector('input[type="file"]');
    f || (f = document.createElement("input"), f.type = "file", f.multiple = !0, f.style.display = "none", g && (f.accept = g.split(",").map(function(l) {
      return l = l.trim(), l.startsWith(".") ? l : "." + l;
    }).join(",")), o.appendChild(f));
    const y = o.getAttribute(m) || "/files/upload", L = o.getAttribute(E) || "", w = /* @__PURE__ */ new Map();
    let T = 0;
    function S() {
      const l = document.querySelector('meta[name="csrf-token"]');
      return l ? l.getAttribute("content") : "";
    }
    function O(l) {
      if (!e(l, g)) {
        const _ = v(o, "invalid-type");
        t(o, "ln-upload:invalid", {
          file: l,
          message: _
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: _ || "This file type is not allowed"
          }
        }));
        return;
      }
      const A = "file-" + ++T, C = s(l.name), F = n(C), N = document.createElement("li");
      N.className = "ln-upload__item ln-upload__item--uploading " + F, N.setAttribute("data-file-id", A);
      const B = document.createElement("span");
      B.className = "ln-upload__name", B.textContent = l.name;
      const I = document.createElement("span");
      I.className = "ln-upload__size", I.textContent = "0%";
      const k = document.createElement("button");
      k.type = "button", k.className = "ln-upload__remove", k.title = v(o, "remove"), k.textContent = "×", k.disabled = !0;
      const U = document.createElement("div");
      U.className = "ln-upload__progress";
      const z = document.createElement("div");
      z.className = "ln-upload__progress-bar", U.appendChild(z), N.appendChild(B), N.appendChild(I), N.appendChild(k), N.appendChild(U), p.appendChild(N);
      const H = new FormData();
      H.append("file", l), H.append("context", L);
      const q = new XMLHttpRequest();
      q.upload.addEventListener("progress", function(_) {
        if (_.lengthComputable) {
          const j = Math.round(_.loaded / _.total * 100);
          z.style.width = j + "%", I.textContent = j + "%";
        }
      }), q.addEventListener("load", function() {
        if (q.status >= 200 && q.status < 300) {
          var _;
          try {
            _ = JSON.parse(q.responseText);
          } catch {
            P("Invalid response");
            return;
          }
          N.classList.remove("ln-upload__item--uploading"), I.textContent = d(_.size || l.size), k.disabled = !1, w.set(A, {
            serverId: _.id,
            name: _.name,
            size: _.size
          }), x(), t(o, "ln-upload:uploaded", {
            localId: A,
            serverId: _.id,
            name: _.name
          });
        } else {
          var j = "Upload failed";
          try {
            var R = JSON.parse(q.responseText);
            j = R.message || j;
          } catch {
          }
          P(j);
        }
      }), q.addEventListener("error", function() {
        P("Network error");
      });
      function P(_) {
        N.classList.remove("ln-upload__item--uploading"), N.classList.add("ln-upload__item--error"), z.style.width = "100%", I.textContent = v(o, "error"), k.disabled = !1, t(o, "ln-upload:error", {
          file: l,
          message: _
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: _ || v(o, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      q.open("POST", y), q.setRequestHeader("X-CSRF-TOKEN", S()), q.setRequestHeader("Accept", "application/json"), q.send(H);
    }
    function x() {
      o.querySelectorAll('input[name="file_ids[]"]').forEach(function(l) {
        l.remove();
      }), w.forEach(function(l) {
        const A = document.createElement("input");
        A.type = "hidden", A.name = "file_ids[]", A.value = l.serverId, o.appendChild(A);
      });
    }
    function M(l) {
      const A = w.get(l), C = p.querySelector('[data-file-id="' + l + '"]');
      if (!A || !A.serverId) {
        C && C.remove(), w.delete(l), x();
        return;
      }
      C && C.classList.add("ln-upload__item--deleting"), fetch("/files/" + A.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": S(),
          Accept: "application/json"
        }
      }).then((F) => {
        F.status === 200 ? (C && C.remove(), w.delete(l), x(), t(o, "ln-upload:removed", {
          localId: l,
          serverId: A.serverId
        })) : (C && C.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: v(o, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((F) => {
        console.error("Delete error:", F), C && C.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function D(l) {
      Array.from(l).forEach(function(A) {
        O(A);
      }), f.value = "";
    }
    u.addEventListener("click", function() {
      f.click();
    }), f.addEventListener("change", function() {
      D(this.files);
    }), u.addEventListener("dragenter", function(l) {
      l.preventDefault(), l.stopPropagation(), u.classList.add("ln-upload__zone--dragover");
    }), u.addEventListener("dragover", function(l) {
      l.preventDefault(), l.stopPropagation(), u.classList.add("ln-upload__zone--dragover");
    }), u.addEventListener("dragleave", function(l) {
      l.preventDefault(), l.stopPropagation(), u.classList.remove("ln-upload__zone--dragover");
    }), u.addEventListener("drop", function(l) {
      l.preventDefault(), l.stopPropagation(), u.classList.remove("ln-upload__zone--dragover"), D(l.dataTransfer.files);
    }), p.addEventListener("click", function(l) {
      if (l.target.classList.contains("ln-upload__remove")) {
        const A = l.target.closest(".ln-upload__item");
        A && M(A.getAttribute("data-file-id"));
      }
    }), o.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(w.values()).map(function(l) {
          return l.serverId;
        });
      },
      getFiles: function() {
        return Array.from(w.values());
      },
      clear: function() {
        w.forEach(function(l) {
          l.serverId && fetch("/files/" + l.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": S(),
              Accept: "application/json"
            }
          });
        }), w.clear(), p.innerHTML = "", x(), t(o, "ln-upload:cleared", {});
      }
    };
  }
  function a() {
    document.querySelectorAll("[" + m + "]").forEach(i);
  }
  function r() {
    new MutationObserver(function(u) {
      u.forEach(function(p) {
        p.type === "childList" && p.addedNodes.forEach(function(g) {
          g.nodeType === 1 && (g.hasAttribute(m) && i(g), g.querySelectorAll("[" + m + "]").forEach(i));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    init: i,
    initAll: a
  }, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const m = "lnExternalLinks";
  if (window[m] !== void 0)
    return;
  function c(n, e, t) {
    n.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: t
    }));
  }
  function h(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function b(n) {
    n.getAttribute("data-ln-external-link") !== "processed" && h(n) && (n.target = "_blank", n.rel = "noopener noreferrer", n.setAttribute("data-ln-external-link", "processed"), c(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    }));
  }
  function E(n) {
    n = n || document.body, n.querySelectorAll("a, area").forEach(function(t) {
      b(t);
    });
  }
  function v() {
    document.body.addEventListener("click", function(n) {
      const e = n.target.closest("a, area");
      e && e.getAttribute("data-ln-external-link") === "processed" && c(e, "ln-external-links:clicked", {
        link: e,
        href: e.href,
        text: e.textContent || e.title || ""
      });
    });
  }
  function d() {
    new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(i) {
          if (i.nodeType === 1) {
            i.matches && (i.matches("a") || i.matches("area")) && b(i);
            const a = i.querySelectorAll && i.querySelectorAll("a, area");
            a && a.forEach(b);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function s() {
    v(), d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      E();
    }) : E();
  }
  window[m] = {
    process: E
  }, s();
})();
(function() {
  const m = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0)
    return;
  function h(e) {
    var t = e.getAttribute("data-ln-progress");
    return t !== null && t !== "";
  }
  function b(e) {
    E(e);
  }
  function E(e) {
    var t = e.querySelectorAll(m) || [];
    t.forEach(function(i) {
      h(i) && !i[c] && (i[c] = new v(i));
    }), e.hasAttribute && e.hasAttribute("data-ln-progress") && h(e) && !e[c] && (e[c] = new v(e));
  }
  function v(e) {
    return this.dom = e, n.call(this), s.call(this), this;
  }
  function d() {
    var e = new MutationObserver(function(t) {
      t.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(a) {
          a.nodeType === 1 && E(a);
        });
      });
    });
    e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  d();
  function s() {
    var e = this, t = new MutationObserver(function(i) {
      i.forEach(function(a) {
        (a.attributeName === "data-ln-progress" || a.attributeName === "data-ln-progress-max") && n.call(e);
      });
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    });
  }
  function n() {
    var e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100, i = t > 0 ? e / t * 100 : 0;
    i < 0 && (i = 0), i > 100 && (i = 100), this.dom.style.width = i + "%";
  }
  window[c] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnProgress(document.body);
  }) : window.lnProgress(document.body);
})();
