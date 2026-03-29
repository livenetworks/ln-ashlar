(function() {
  const f = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function _(e, n, t) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function b(e, n, t) {
    const o = new CustomEvent(n, {
      bubbles: !0,
      cancelable: !0,
      detail: t || {}
    });
    return e.dispatchEvent(o), o;
  }
  function g(e) {
    if (!e.hasAttribute(f) || e[a]) return;
    e[a] = !0;
    const n = s(e);
    v(n.links), m(n.forms);
  }
  function v(e) {
    for (const n of e) {
      if (n[a + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const t = n.getAttribute("href");
      if (t && t.includes("#")) continue;
      const o = function(d) {
        if (d.ctrlKey || d.metaKey || d.button === 1) return;
        d.preventDefault();
        const c = n.getAttribute("href");
        c && u("GET", c, null, n);
      };
      n.addEventListener("click", o), n[a + "Trigger"] = o;
    }
  }
  function m(e) {
    for (const n of e) {
      if (n[a + "Trigger"]) continue;
      const t = function(o) {
        o.preventDefault();
        const d = n.method.toUpperCase(), c = n.action, l = new FormData(n);
        for (const p of n.querySelectorAll('button, input[type="submit"]'))
          p.disabled = !0;
        u(d, c, l, n, function() {
          for (const p of n.querySelectorAll('button, input[type="submit"]'))
            p.disabled = !1;
        });
      };
      n.addEventListener("submit", t), n[a + "Trigger"] = t;
    }
  }
  function h(e) {
    if (!e[a]) return;
    const n = s(e);
    for (const t of n.links)
      t[a + "Trigger"] && (t.removeEventListener("click", t[a + "Trigger"]), delete t[a + "Trigger"]);
    for (const t of n.forms)
      t[a + "Trigger"] && (t.removeEventListener("submit", t[a + "Trigger"]), delete t[a + "Trigger"]);
    delete e[a];
  }
  function u(e, n, t, o, d) {
    if (b(o, "ln-ajax:before-start", { method: e, url: n }).defaultPrevented) return;
    _(o, "ln-ajax:start", { method: e, url: n }), o.classList.add("ln-ajax--loading");
    const l = document.createElement("span");
    l.className = "ln-ajax-spinner", o.appendChild(l);
    function p() {
      o.classList.remove("ln-ajax--loading");
      const w = o.querySelector(".ln-ajax-spinner");
      w && w.remove(), d && d();
    }
    let y = n;
    const E = document.querySelector('meta[name="csrf-token"]'), L = E ? E.getAttribute("content") : null;
    t instanceof FormData && L && t.append("_token", L);
    const C = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (L && (C.headers["X-CSRF-TOKEN"] = L), e === "GET" && t) {
      const w = new URLSearchParams(t);
      y = n + (n.includes("?") ? "&" : "?") + w.toString();
    } else e !== "GET" && t && (C.body = t);
    fetch(y, C).then(function(w) {
      var T = w.ok;
      return w.json().then(function(O) {
        return { ok: T, status: w.status, data: O };
      });
    }).then(function(w) {
      var T = w.data;
      if (w.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const x in T.content) {
            const M = document.getElementById(x);
            M && (M.innerHTML = T.content[x]);
          }
        if (o.tagName === "A") {
          const x = o.getAttribute("href");
          x && window.history.pushState({ ajax: !0 }, "", x);
        } else o.tagName === "FORM" && o.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", y);
        _(o, "ln-ajax:success", { method: e, url: y, data: T });
      } else
        _(o, "ln-ajax:error", { method: e, url: y, status: w.status, data: T });
      if (T.message && window.lnToast) {
        var O = T.message;
        window.lnToast.enqueue({
          type: O.type || (w.ok ? "success" : "error"),
          title: O.title || "",
          message: O.body || ""
        });
      }
      _(o, "ln-ajax:complete", { method: e, url: y }), p();
    }).catch(function(w) {
      _(o, "ln-ajax:error", { method: e, url: y, error: w }), _(o, "ln-ajax:complete", { method: e, url: y }), p();
    });
  }
  function s(e) {
    const n = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(f) !== "false" ? n.links.push(e) : e.tagName === "FORM" && e.getAttribute(f) !== "false" ? n.forms.push(e) : (n.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function i() {
    new MutationObserver(function(n) {
      for (const t of n)
        if (t.type === "childList") {
          for (const o of t.addedNodes)
            if (o.nodeType === 1 && (g(o), !o.hasAttribute(f))) {
              for (const c of o.querySelectorAll("[" + f + "]"))
                g(c);
              const d = o.closest && o.closest("[" + f + "]");
              if (d && d.getAttribute(f) !== "false") {
                const c = s(o);
                v(c.links), m(c.forms);
              }
            }
        } else t.type === "attributes" && g(t.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  function r() {
    for (const e of document.querySelectorAll("[" + f + "]"))
      g(e);
  }
  window[a] = g, window[a].destroy = h, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const f = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function _(r) {
    b(r), g(r);
  }
  function b(r) {
    const e = Array.from(r.querySelectorAll("[" + f + "]"));
    r.hasAttribute && r.hasAttribute(f) && e.push(r);
    for (const n of e)
      n[a] || (n[a] = new v(n));
  }
  function g(r) {
    const e = Array.from(r.querySelectorAll("[data-ln-modal-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-modal-for") && e.push(r);
    for (const n of e)
      n[a + "Trigger"] || (n[a + "Trigger"] = !0, n.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const o = n.getAttribute("data-ln-modal-for"), d = document.getElementById(o);
        !d || !d[a] || d[a].toggle();
      }));
  }
  function v(r) {
    this.dom = r, this.isOpen = r.getAttribute(f) === "open";
    const e = this;
    return this._onEscape = function(n) {
      n.key === "Escape" && e.close();
    }, this._onFocusTrap = function(n) {
      if (n.key === "Tab") {
        var t = e.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (t.length !== 0) {
          var o = t[0], d = t[t.length - 1];
          n.shiftKey ? document.activeElement === o && (n.preventDefault(), d.focus()) : document.activeElement === d && (n.preventDefault(), o.focus());
        }
      }
    }, this._onClose = function(n) {
      n.preventDefault(), e.close();
    }, s(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  v.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(f, "open");
  }, v.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "close");
  }, v.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, v.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + f + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const r = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of r)
      e[a + "Close"] && (e.removeEventListener("click", e[a + "Close"]), delete e[a + "Close"]);
    h(this.dom, "ln-modal:destroyed"), delete this.dom[a];
  };
  function m(r) {
    var e = r[a];
    if (e) {
      var n = r.getAttribute(f), t = n === "open";
      if (t !== e.isOpen)
        if (t) {
          var o = u(r, "ln-modal:before-open");
          if (o.defaultPrevented) {
            r.setAttribute(f, "close");
            return;
          }
          e.isOpen = !0, r.setAttribute("aria-modal", "true"), r.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", e._onEscape), document.addEventListener("keydown", e._onFocusTrap);
          var d = r.querySelector('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])');
          d && d.focus(), h(r, "ln-modal:open");
        } else {
          var o = u(r, "ln-modal:before-close");
          if (o.defaultPrevented) {
            r.setAttribute(f, "open");
            return;
          }
          e.isOpen = !1, r.removeAttribute("aria-modal"), document.removeEventListener("keydown", e._onEscape), document.removeEventListener("keydown", e._onFocusTrap), h(r, "ln-modal:close"), document.querySelector("[" + f + '="open"]') || document.body.classList.remove("ln-modal-open");
        }
    }
  }
  function h(r, e, n) {
    r.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: Object.assign({ modalId: r.id, target: r }, {})
    }));
  }
  function u(r, e, n) {
    var t = new CustomEvent(e, {
      bubbles: !0,
      cancelable: !0,
      detail: Object.assign({ modalId: r.id, target: r }, {})
    });
    return r.dispatchEvent(t), t;
  }
  function s(r) {
    const e = r.dom.querySelectorAll("[data-ln-modal-close]");
    for (const n of e)
      n[a + "Close"] || (n.addEventListener("click", r._onClose), n[a + "Close"] = r._onClose);
  }
  function i() {
    var r = new MutationObserver(function(e) {
      for (var n = 0; n < e.length; n++) {
        var t = e[n];
        if (t.type === "childList")
          for (var o = 0; o < t.addedNodes.length; o++) {
            var d = t.addedNodes[o];
            d.nodeType === 1 && (b(d), g(d));
          }
        else t.type === "attributes" && (t.attributeName === f && t.target[a] ? m(t.target) : (b(t.target), g(t.target)));
      }
    });
    r.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f, "data-ln-modal-for"]
    });
  }
  window[a] = _, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const f = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const _ = /* @__PURE__ */ new WeakMap(), b = [];
  if (!history._lnNavPatched) {
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments);
      for (const r of b)
        r();
    }, history._lnNavPatched = !0;
  }
  function g(i) {
    if (!i.hasAttribute(f) || _.has(i)) return;
    const r = i.getAttribute(f);
    if (!r) return;
    const e = v(i, r);
    _.set(i, e), i[a] = e;
  }
  function v(i, r) {
    let e = Array.from(i.querySelectorAll("a"));
    h(e, r, window.location.pathname);
    const n = function() {
      e = Array.from(i.querySelectorAll("a")), h(e, r, window.location.pathname);
    };
    window.addEventListener("popstate", n), b.push(n);
    const t = new MutationObserver(function(o) {
      for (const d of o)
        if (d.type === "childList") {
          for (const c of d.addedNodes)
            if (c.nodeType === 1) {
              if (c.tagName === "A")
                e.push(c), h([c], r, window.location.pathname);
              else if (c.querySelectorAll) {
                const l = Array.from(c.querySelectorAll("a"));
                e = e.concat(l), h(l, r, window.location.pathname);
              }
            }
          for (const c of d.removedNodes)
            if (c.nodeType === 1) {
              if (c.tagName === "A")
                e = e.filter(function(l) {
                  return l !== c;
                });
              else if (c.querySelectorAll) {
                const l = Array.from(c.querySelectorAll("a"));
                e = e.filter(function(p) {
                  return !l.includes(p);
                });
              }
            }
        }
    });
    return t.observe(i, { childList: !0, subtree: !0 }), {
      navElement: i,
      activeClass: r,
      observer: t,
      updateHandler: n,
      destroy: function() {
        t.disconnect(), window.removeEventListener("popstate", n);
        const o = b.indexOf(n);
        o !== -1 && b.splice(o, 1), _.delete(i), delete i[a];
      }
    };
  }
  function m(i) {
    try {
      return new URL(i, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return i.replace(/\/$/, "") || "/";
    }
  }
  function h(i, r, e) {
    const n = m(e);
    for (const t of i) {
      const o = t.getAttribute("href");
      if (!o) continue;
      const d = m(o);
      t.classList.remove(r);
      const c = d === n, l = d !== "/" && n.startsWith(d + "/");
      (c || l) && t.classList.add(r);
    }
  }
  function u() {
    new MutationObserver(function(r) {
      for (const e of r)
        if (e.type === "childList") {
          for (const n of e.addedNodes)
            if (n.nodeType === 1 && (n.hasAttribute && n.hasAttribute(f) && g(n), n.querySelectorAll))
              for (const t of n.querySelectorAll("[" + f + "]"))
                g(t);
        } else e.type === "attributes" && e.target.hasAttribute && e.target.hasAttribute(f) && g(e.target);
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] });
  }
  window[a] = g;
  function s() {
    for (const i of document.querySelectorAll("[" + f + "]"))
      g(i);
  }
  u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const f = window.TomSelect;
  if (!f) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const a = /* @__PURE__ */ new WeakMap();
  function _(m) {
    if (a.has(m)) return;
    const h = m.getAttribute("data-ln-select");
    let u = {};
    if (h && h.trim() !== "")
      try {
        u = JSON.parse(h);
      } catch (r) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", r);
      }
    const i = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: m.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...u };
    try {
      const r = new f(m, i);
      a.set(m, r);
      const e = m.closest("form");
      e && e.addEventListener("reset", () => {
        setTimeout(() => {
          r.clear(), r.clearOptions(), r.sync();
        }, 0);
      });
    } catch (r) {
      console.warn("[ln-select] Failed to initialize Tom Select:", r);
    }
  }
  function b(m) {
    const h = a.get(m);
    h && (h.destroy(), a.delete(m));
  }
  function g() {
    for (const m of document.querySelectorAll("select[data-ln-select]"))
      _(m);
  }
  function v() {
    new MutationObserver(function(h) {
      for (const u of h) {
        if (u.type === "attributes") {
          u.target.matches && u.target.matches("select[data-ln-select]") && _(u.target);
          continue;
        }
        for (const s of u.addedNodes)
          if (s.nodeType === 1 && (s.matches && s.matches("select[data-ln-select]") && _(s), s.querySelectorAll))
            for (const i of s.querySelectorAll("select[data-ln-select]"))
              _(i);
        for (const s of u.removedNodes)
          if (s.nodeType === 1 && (s.matches && s.matches("select[data-ln-select]") && b(s), s.querySelectorAll))
            for (const i of s.querySelectorAll("select[data-ln-select]"))
              b(i);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-select"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(), v();
  }) : (g(), v()), window.lnSelect = {
    initialize: _,
    destroy: b,
    getInstance: function(m) {
      return a.get(m);
    }
  };
})();
(function() {
  const f = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function _(s = document.body) {
    b(s);
  }
  function b(s) {
    if (s.nodeType !== 1) return;
    const i = Array.from(s.querySelectorAll("[" + f + "]"));
    s.hasAttribute && s.hasAttribute(f) && i.push(s);
    for (const r of i)
      r[a] || (r[a] = new v(r));
  }
  function g() {
    const s = (location.hash || "").replace("#", ""), i = {};
    if (!s) return i;
    for (const r of s.split("&")) {
      const e = r.indexOf(":");
      e > 0 && (i[r.slice(0, e)] = r.slice(e + 1));
    }
    return i;
  }
  function v(s) {
    return this.dom = s, m.call(this), this;
  }
  function m() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const i of this.tabs) {
      const r = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      r && (this.mapTabs[r] = i);
    }
    for (const i of this.panels) {
      const r = (i.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      r && (this.mapPanels[r] = i);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const s = this;
    this._clickHandlers = [];
    for (const i of this.tabs) {
      if (i[a + "Trigger"]) continue;
      i[a + "Trigger"] = !0;
      const r = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        const n = (i.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (n)
          if (s.hashEnabled) {
            const t = g();
            t[s.nsKey] = n;
            const o = Object.keys(t).map(function(d) {
              return d + ":" + t[d];
            }).join("&");
            location.hash === "#" + o ? s.activate(n) : location.hash = o;
          } else
            s.activate(n);
      };
      i.addEventListener("click", r), s._clickHandlers.push({ el: i, handler: r });
    }
    this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const i = g();
      s.activate(s.nsKey in i ? i[s.nsKey] : s.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  v.prototype.activate = function(s) {
    var i;
    (!s || !(s in this.mapPanels)) && (s = this.defaultKey);
    for (const r in this.mapTabs) {
      const e = this.mapTabs[r];
      r === s ? (e.setAttribute("data-active", ""), e.setAttribute("aria-selected", "true")) : (e.removeAttribute("data-active"), e.setAttribute("aria-selected", "false"));
    }
    for (const r in this.mapPanels) {
      const e = this.mapPanels[r], n = r === s;
      e.classList.toggle("hidden", !n), e.setAttribute("aria-hidden", n ? "false" : "true");
    }
    if (this.autoFocus) {
      const r = (i = this.mapPanels[s]) == null ? void 0 : i.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      r && setTimeout(() => r.focus({ preventScroll: !0 }), 0);
    }
    h(this.dom, "ln-tabs:change", { key: s, tab: this.mapTabs[s], panel: this.mapPanels[s] });
  }, v.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: s, handler: i } of this._clickHandlers)
        s.removeEventListener("click", i);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), h(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function h(s, i, r) {
    s.dispatchEvent(new CustomEvent(i, {
      bubbles: !0,
      detail: r || {}
    }));
  }
  function u() {
    new MutationObserver(function(i) {
      for (const r of i) {
        if (r.type === "attributes") {
          b(r.target);
          continue;
        }
        for (const e of r.addedNodes)
          b(e);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] });
  }
  u(), window[a] = _, _(document.body);
})();
(function() {
  const f = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function _(i) {
    b(i), g(i);
  }
  function b(i) {
    const r = Array.from(i.querySelectorAll("[" + f + "]"));
    i.hasAttribute && i.hasAttribute(f) && r.push(i);
    for (const e of r)
      e[a] || (e[a] = new v(e));
  }
  function g(i) {
    const r = Array.from(i.querySelectorAll("[data-ln-toggle-for]"));
    i.hasAttribute && i.hasAttribute("data-ln-toggle-for") && r.push(i);
    for (const e of r) {
      if (e[a + "Trigger"]) return;
      e[a + "Trigger"] = !0, e.addEventListener("click", function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        n.preventDefault();
        const t = e.getAttribute("data-ln-toggle-for"), o = document.getElementById(t);
        if (!o || !o[a]) return;
        const d = e.getAttribute("data-ln-toggle-action") || "toggle";
        o[a][d]();
      });
    }
  }
  function v(i) {
    return this.dom = i, this.isOpen = i.getAttribute(f) === "open", this.isOpen && i.classList.add("open"), this;
  }
  v.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(f, "open");
  }, v.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "close");
  }, v.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, v.prototype.destroy = function() {
    this.dom[a] && (h(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function m(i) {
    var r = i[a];
    if (r) {
      var e = i.getAttribute(f), n = e === "open";
      if (n !== r.isOpen)
        if (n) {
          var t = u(i, "ln-toggle:before-open", { target: i });
          if (t.defaultPrevented) {
            i.setAttribute(f, "close");
            return;
          }
          r.isOpen = !0, i.classList.add("open"), h(i, "ln-toggle:open", { target: i });
        } else {
          var t = u(i, "ln-toggle:before-close", { target: i });
          if (t.defaultPrevented) {
            i.setAttribute(f, "open");
            return;
          }
          r.isOpen = !1, i.classList.remove("open"), h(i, "ln-toggle:close", { target: i });
        }
    }
  }
  function h(i, r, e) {
    i.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function u(i, r, e) {
    var n = new CustomEvent(r, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return i.dispatchEvent(n), n;
  }
  function s() {
    var i = new MutationObserver(function(r) {
      for (var e = 0; e < r.length; e++) {
        var n = r[e];
        if (n.type === "childList")
          for (var t = 0; t < n.addedNodes.length; t++) {
            var o = n.addedNodes[t];
            o.nodeType === 1 && (b(o), g(o));
          }
        else n.type === "attributes" && (n.attributeName === f && n.target[a] ? m(n.target) : (b(n.target), g(n.target)));
      }
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f, "data-ln-toggle-for"]
    });
  }
  window[a] = _, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const f = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function _(h) {
    b(h);
  }
  function b(h) {
    const u = Array.from(h.querySelectorAll("[" + f + "]"));
    h.hasAttribute && h.hasAttribute(f) && u.push(h);
    for (const s of u)
      s[a] || (s[a] = new g(s));
  }
  function g(h) {
    return this.dom = h, this._onToggleOpen = function(u) {
      const s = h.querySelectorAll("[data-ln-toggle]");
      for (const i of s)
        i !== u.detail.target && i.getAttribute("data-ln-toggle") === "open" && i.setAttribute("data-ln-toggle", "close");
      v(h, "ln-accordion:change", { target: u.detail.target });
    }, h.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), v(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function v(h, u, s) {
    h.dispatchEvent(new CustomEvent(u, {
      bubbles: !0,
      detail: s || {}
    }));
  }
  function m() {
    new MutationObserver(function(u) {
      for (const s of u)
        if (s.type === "childList")
          for (const i of s.addedNodes)
            i.nodeType === 1 && b(i);
        else s.type === "attributes" && b(s.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = _, m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const f = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function _(h) {
    b(h);
  }
  function b(h) {
    const u = Array.from(h.querySelectorAll("[" + f + "]"));
    h.hasAttribute && h.hasAttribute(f) && u.push(h);
    for (const s of u)
      s[a] || (s[a] = new g(s));
  }
  function g(h) {
    if (this.dom = h, this.toggleEl = h.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = h.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const s of this.toggleEl.children)
        s.setAttribute("role", "menuitem");
    const u = this;
    return this._onToggleOpen = function(s) {
      s.detail.target === u.toggleEl && (u.triggerBtn && u.triggerBtn.setAttribute("aria-expanded", "true"), u._teleportToBody(), u._addOutsideClickListener(), u._addScrollRepositionListener(), u._addResizeCloseListener(), v(h, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      s.detail.target === u.toggleEl && (u.triggerBtn && u.triggerBtn.setAttribute("aria-expanded", "false"), u._removeOutsideClickListener(), u._removeScrollRepositionListener(), u._removeResizeCloseListener(), u._teleportBack(), v(h, "ln-dropdown:close", { target: s.detail.target }));
    }, this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose), this;
  }
  g.prototype._positionMenu = function() {
    const h = this.dom.querySelector("[data-ln-toggle-for]");
    if (!h || !this.toggleEl) return;
    const u = h.getBoundingClientRect(), s = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    s && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const i = this.toggleEl.offsetWidth, r = this.toggleEl.offsetHeight;
    s && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const e = window.innerWidth, n = window.innerHeight, t = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    var o;
    u.bottom + t + r <= n ? o = u.bottom + t : u.top - t - r >= 0 ? o = u.top - t - r : o = Math.max(0, n - r);
    var d;
    u.right - i >= 0 ? d = u.right - i : u.left + i <= e ? d = u.left : d = Math.max(0, e - i), this.toggleEl.style.top = o + "px", this.toggleEl.style.left = d + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, g.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, g.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, g.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const h = this;
    this._boundDocClick = function(u) {
      h.dom.contains(u.target) || h.toggleEl && h.toggleEl.contains(u.target) || h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
    }, setTimeout(function() {
      document.addEventListener("click", h._boundDocClick);
    }, 0);
  }, g.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, g.prototype._addScrollRepositionListener = function() {
    const h = this;
    this._boundScrollReposition = function() {
      h._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, g.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, g.prototype._addResizeCloseListener = function() {
    const h = this;
    this._boundResizeClose = function() {
      h.toggleEl && h.toggleEl.getAttribute("data-ln-toggle") === "open" && h.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, g.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose), v(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function v(h, u, s) {
    h.dispatchEvent(new CustomEvent(u, {
      bubbles: !0,
      detail: s || {}
    }));
  }
  function m() {
    new MutationObserver(function(u) {
      for (const s of u)
        if (s.type === "childList")
          for (const i of s.addedNodes)
            i.nodeType === 1 && b(i);
        else s.type === "attributes" && b(s.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = _, m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const f = "data-ln-toast", a = "lnToast", _ = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[a] !== void 0 && window[a] !== null) return;
  function b(n = document.body) {
    return g(n), r;
  }
  function g(n) {
    if (!n || n.nodeType !== 1) return;
    const t = Array.from(n.querySelectorAll("[" + f + "]"));
    n.hasAttribute && n.hasAttribute(f) && t.push(n);
    for (const o of t)
      o[a] || new v(o);
  }
  function v(n) {
    this.dom = n, n[a] = this, this.timeoutDefault = parseInt(n.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(n.getAttribute("data-ln-toast-max") || "5", 10);
    for (const t of Array.from(n.querySelectorAll("[data-ln-toast-item]")))
      m(t);
    return this;
  }
  v.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const n of Array.from(this.dom.children))
        u(n);
      delete this.dom[a];
    }
  };
  function m(n) {
    const t = ((n.getAttribute("data-type") || "info") + "").toLowerCase(), o = n.getAttribute("data-title"), d = (n.innerText || n.textContent || "").trim();
    n.className = "ln-toast__item", n.removeAttribute("data-ln-toast-item");
    const c = document.createElement("div");
    c.className = "ln-toast__card ln-toast__card--" + t, c.setAttribute("role", t === "error" ? "alert" : "status"), c.setAttribute("aria-live", t === "error" ? "assertive" : "polite");
    const l = document.createElement("div");
    l.className = "ln-toast__side", l.innerHTML = _[t] || _.info;
    const p = document.createElement("div");
    p.className = "ln-toast__content";
    const y = document.createElement("div");
    y.className = "ln-toast__head";
    const E = document.createElement("strong");
    E.className = "ln-toast__title", E.textContent = o || (t === "success" ? "Success" : t === "error" ? "Error" : t === "warn" ? "Warning" : "Information");
    const L = document.createElement("button");
    if (L.type = "button", L.className = "ln-toast__close ln-icon-close", L.setAttribute("aria-label", "Close"), L.addEventListener("click", () => u(n)), y.appendChild(E), p.appendChild(y), p.appendChild(L), d) {
      const C = document.createElement("div");
      C.className = "ln-toast__body";
      const w = document.createElement("p");
      w.textContent = d, C.appendChild(w), p.appendChild(C);
    }
    c.appendChild(l), c.appendChild(p), n.innerHTML = "", n.appendChild(c), requestAnimationFrame(() => n.classList.add("ln-toast__item--in"));
  }
  function h(n, t) {
    for (; n.dom.children.length >= n.max; ) n.dom.removeChild(n.dom.firstElementChild);
    n.dom.appendChild(t), requestAnimationFrame(() => t.classList.add("ln-toast__item--in"));
  }
  function u(n) {
    !n || !n.parentNode || (clearTimeout(n._timer), n.classList.remove("ln-toast__item--in"), n.classList.add("ln-toast__item--out"), setTimeout(() => {
      n.parentNode && n.parentNode.removeChild(n);
    }, 200));
  }
  function s(n = {}) {
    let t = n.container;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), !t)
      return console.warn("[ln-toast] No toast container found"), null;
    const o = t[a] || new v(t), d = Number.isFinite(n.timeout) ? n.timeout : o.timeoutDefault, c = (n.type || "info").toLowerCase(), l = document.createElement("li");
    l.className = "ln-toast__item";
    const p = document.createElement("div");
    p.className = "ln-toast__card ln-toast__card--" + c, p.setAttribute("role", c === "error" ? "alert" : "status"), p.setAttribute("aria-live", c === "error" ? "assertive" : "polite");
    const y = document.createElement("div");
    y.className = "ln-toast__side", y.innerHTML = _[c] || _.info;
    const E = document.createElement("div");
    E.className = "ln-toast__content";
    const L = document.createElement("div");
    L.className = "ln-toast__head";
    const C = document.createElement("strong");
    C.className = "ln-toast__title", C.textContent = n.title || (c === "success" ? "Success" : c === "error" ? "Error" : c === "warn" ? "Warning" : "Information");
    const w = document.createElement("button");
    if (w.type = "button", w.className = "ln-toast__close ln-icon-close", w.setAttribute("aria-label", "Close"), w.addEventListener("click", () => u(l)), L.appendChild(C), E.appendChild(L), E.appendChild(w), n.message || n.data && n.data.errors) {
      const T = document.createElement("div");
      if (T.className = "ln-toast__body", n.message)
        if (Array.isArray(n.message)) {
          const O = document.createElement("ul");
          for (const x of n.message) {
            const M = document.createElement("li");
            M.textContent = x, O.appendChild(M);
          }
          T.appendChild(O);
        } else {
          const O = document.createElement("p");
          O.textContent = n.message, T.appendChild(O);
        }
      if (n.data && n.data.errors) {
        const O = document.createElement("ul");
        for (const x of Object.values(n.data.errors).flat()) {
          const M = document.createElement("li");
          M.textContent = x, O.appendChild(M);
        }
        T.appendChild(O);
      }
      E.appendChild(T);
    }
    return p.appendChild(y), p.appendChild(E), l.appendChild(p), h(o, l), d > 0 && (l._timer = setTimeout(() => u(l), d)), l;
  }
  function i(n) {
    let t = n;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), !!t)
      for (const o of Array.from(t.children))
        u(o);
  }
  const r = function(n) {
    return b(n);
  };
  r.enqueue = s, r.clear = i, new MutationObserver(function(n) {
    for (const t of n) {
      if (t.type === "attributes") {
        g(t.target);
        continue;
      }
      for (const o of t.addedNodes)
        g(o);
    }
  }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] }), window[a] = r, window.addEventListener("ln-toast:enqueue", function(n) {
    n.detail && r.enqueue(n.detail);
  }), b(document.body);
})();
(function() {
  const f = "data-ln-upload", a = "lnUpload", _ = "data-ln-upload-dict", b = "data-ln-upload-accept", g = "data-ln-upload-context";
  if (window[a] !== void 0) return;
  function v(t, o) {
    const d = t.querySelector("[" + _ + '="' + o + '"]');
    return d ? d.textContent : o;
  }
  function m(t) {
    if (t === 0) return "0 B";
    const o = 1024, d = ["B", "KB", "MB", "GB"], c = Math.floor(Math.log(t) / Math.log(o));
    return parseFloat((t / Math.pow(o, c)).toFixed(1)) + " " + d[c];
  }
  function h(t) {
    return t.split(".").pop().toLowerCase();
  }
  function u(t) {
    return t === "docx" && (t = "doc"), ["pdf", "doc", "epub"].includes(t) ? "ln-icon-file-" + t : "ln-icon-file";
  }
  function s(t, o) {
    if (!o) return !0;
    const d = "." + h(t.name);
    return o.split(",").map(function(l) {
      return l.trim().toLowerCase();
    }).includes(d.toLowerCase());
  }
  function i(t, o, d) {
    t.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: d
    }));
  }
  function r(t) {
    if (t.hasAttribute("data-ln-upload-initialized")) return;
    t.setAttribute("data-ln-upload-initialized", "true");
    const o = t.querySelector(".ln-upload__zone"), d = t.querySelector(".ln-upload__list"), c = t.getAttribute(b) || "";
    if (!o || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", t);
      return;
    }
    let l = t.querySelector('input[type="file"]');
    l || (l = document.createElement("input"), l.type = "file", l.multiple = !0, l.style.display = "none", c && (l.accept = c.split(",").map(function(A) {
      return A = A.trim(), A.startsWith(".") ? A : "." + A;
    }).join(",")), t.appendChild(l));
    const p = t.getAttribute(f) || "/files/upload", y = t.getAttribute(g) || "", E = /* @__PURE__ */ new Map();
    let L = 0;
    function C() {
      const A = document.querySelector('meta[name="csrf-token"]');
      return A ? A.getAttribute("content") : "";
    }
    function w(A) {
      if (!s(A, c)) {
        const S = v(t, "invalid-type");
        i(t, "ln-upload:invalid", {
          file: A,
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
      const k = "file-" + ++L, D = h(A.name), B = u(D), I = document.createElement("li");
      I.className = "ln-upload__item ln-upload__item--uploading " + B, I.setAttribute("data-file-id", k);
      const P = document.createElement("span");
      P.className = "ln-upload__name", P.textContent = A.name;
      const R = document.createElement("span");
      R.className = "ln-upload__size", R.textContent = "0%";
      const N = document.createElement("button");
      N.type = "button", N.className = "ln-upload__remove ln-icon-close", N.title = v(t, "remove"), N.textContent = "×", N.disabled = !0;
      const z = document.createElement("div");
      z.className = "ln-upload__progress";
      const H = document.createElement("div");
      H.className = "ln-upload__progress-bar", z.appendChild(H), I.appendChild(P), I.appendChild(R), I.appendChild(N), I.appendChild(z), d.appendChild(I);
      const U = new FormData();
      U.append("file", A), U.append("context", y);
      const q = new XMLHttpRequest();
      q.upload.addEventListener("progress", function(S) {
        if (S.lengthComputable) {
          const F = Math.round(S.loaded / S.total * 100);
          H.style.width = F + "%", R.textContent = F + "%";
        }
      }), q.addEventListener("load", function() {
        if (q.status >= 200 && q.status < 300) {
          let S;
          try {
            S = JSON.parse(q.responseText);
          } catch {
            K("Invalid response");
            return;
          }
          I.classList.remove("ln-upload__item--uploading"), R.textContent = m(S.size || A.size), N.disabled = !1, E.set(k, {
            serverId: S.id,
            name: S.name,
            size: S.size
          }), T(), i(t, "ln-upload:uploaded", {
            localId: k,
            serverId: S.id,
            name: S.name
          });
        } else {
          let S = "Upload failed";
          try {
            S = JSON.parse(q.responseText).message || S;
          } catch {
          }
          K(S);
        }
      }), q.addEventListener("error", function() {
        K("Network error");
      });
      function K(S) {
        I.classList.remove("ln-upload__item--uploading"), I.classList.add("ln-upload__item--error"), H.style.width = "100%", R.textContent = v(t, "error"), N.disabled = !1, i(t, "ln-upload:error", {
          file: A,
          message: S
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: S || v(t, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      q.open("POST", p), q.setRequestHeader("X-CSRF-TOKEN", C()), q.setRequestHeader("Accept", "application/json"), q.send(U);
    }
    function T() {
      for (const A of t.querySelectorAll('input[name="file_ids[]"]'))
        A.remove();
      for (const [, A] of E) {
        const k = document.createElement("input");
        k.type = "hidden", k.name = "file_ids[]", k.value = A.serverId, t.appendChild(k);
      }
    }
    function O(A) {
      const k = E.get(A), D = d.querySelector('[data-file-id="' + A + '"]');
      if (!k || !k.serverId) {
        D && D.remove(), E.delete(A), T();
        return;
      }
      D && D.classList.add("ln-upload__item--deleting"), fetch("/files/" + k.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": C(),
          Accept: "application/json"
        }
      }).then(function(B) {
        B.status === 200 ? (D && D.remove(), E.delete(A), T(), i(t, "ln-upload:removed", {
          localId: A,
          serverId: k.serverId
        })) : (D && D.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: v(t, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch(function(B) {
        console.warn("[ln-upload] Delete error:", B), D && D.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function x(A) {
      for (const k of A)
        w(k);
      l.value = "";
    }
    const M = function() {
      l.click();
    }, V = function() {
      x(this.files);
    }, W = function(A) {
      A.preventDefault(), A.stopPropagation(), o.classList.add("ln-upload__zone--dragover");
    }, j = function(A) {
      A.preventDefault(), A.stopPropagation(), o.classList.add("ln-upload__zone--dragover");
    }, X = function(A) {
      A.preventDefault(), A.stopPropagation(), o.classList.remove("ln-upload__zone--dragover");
    }, Y = function(A) {
      A.preventDefault(), A.stopPropagation(), o.classList.remove("ln-upload__zone--dragover"), x(A.dataTransfer.files);
    }, J = function(A) {
      if (A.target.classList.contains("ln-upload__remove")) {
        const k = A.target.closest(".ln-upload__item");
        k && O(k.getAttribute("data-file-id"));
      }
    };
    o.addEventListener("click", M), l.addEventListener("change", V), o.addEventListener("dragenter", W), o.addEventListener("dragover", j), o.addEventListener("dragleave", X), o.addEventListener("drop", Y), d.addEventListener("click", J), t.lnUploadAPI = {
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
        E.clear(), d.innerHTML = "", T(), i(t, "ln-upload:cleared", {});
      },
      destroy: function() {
        o.removeEventListener("click", M), l.removeEventListener("change", V), o.removeEventListener("dragenter", W), o.removeEventListener("dragover", j), o.removeEventListener("dragleave", X), o.removeEventListener("drop", Y), d.removeEventListener("click", J), E.clear(), d.innerHTML = "", T(), t.removeAttribute("data-ln-upload-initialized"), delete t.lnUploadAPI;
      }
    };
  }
  function e() {
    for (const t of document.querySelectorAll("[" + f + "]"))
      r(t);
  }
  function n() {
    new MutationObserver(function(o) {
      for (const d of o)
        if (d.type === "childList") {
          for (const c of d.addedNodes)
            if (c.nodeType === 1) {
              c.hasAttribute(f) && r(c);
              for (const l of c.querySelectorAll("[" + f + "]"))
                r(l);
            }
        } else d.type === "attributes" && d.target.hasAttribute(f) && r(d.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = {
    init: r,
    initAll: e
  }, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const f = "lnExternalLinks";
  if (window[f] !== void 0) return;
  function a(u, s, i) {
    u.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: i
    }));
  }
  function _(u) {
    return u.hostname && u.hostname !== window.location.hostname;
  }
  function b(u) {
    u.getAttribute("data-ln-external-link") !== "processed" && _(u) && (u.target = "_blank", u.rel = "noopener noreferrer", u.setAttribute("data-ln-external-link", "processed"), a(u, "ln-external-links:processed", {
      link: u,
      href: u.href
    }));
  }
  function g(u) {
    u = u || document.body;
    for (const s of u.querySelectorAll("a, area"))
      b(s);
  }
  function v() {
    document.body.addEventListener("click", function(u) {
      const s = u.target.closest("a, area");
      s && s.getAttribute("data-ln-external-link") === "processed" && a(s, "ln-external-links:clicked", {
        link: s,
        href: s.href,
        text: s.textContent || s.title || ""
      });
    });
  }
  function m() {
    new MutationObserver(function(s) {
      for (const i of s)
        if (i.type === "childList") {
          for (const r of i.addedNodes)
            if (r.nodeType === 1 && (r.matches && (r.matches("a") || r.matches("area")) && b(r), r.querySelectorAll))
              for (const e of r.querySelectorAll("a, area"))
                b(e);
        }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function h() {
    v(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      g();
    }) : g();
  }
  window[f] = {
    process: g
  }, h();
})();
(function() {
  const f = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  function _(l, p, y) {
    const E = new CustomEvent(p, {
      bubbles: !0,
      cancelable: !0,
      detail: y || {}
    });
    return l.dispatchEvent(E), E;
  }
  let b = null;
  function g() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function v(l) {
    b && (b.textContent = l, b.classList.add("ln-link-status--visible"));
  }
  function m() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function h(l, p) {
    if (p.target.closest("a, button, input, select, textarea")) return;
    const y = l.querySelector("a");
    if (!y) return;
    const E = y.getAttribute("href");
    if (!E) return;
    if (p.ctrlKey || p.metaKey || p.button === 1) {
      window.open(E, "_blank");
      return;
    }
    _(l, "ln-link:navigate", { target: l, href: E, link: y }).defaultPrevented || y.click();
  }
  function u(l) {
    const p = l.querySelector("a");
    if (!p) return;
    const y = p.getAttribute("href");
    y && v(y);
  }
  function s() {
    m();
  }
  function i(l) {
    l[a + "Row"] || (l[a + "Row"] = !0, l.querySelector("a") && (l._lnLinkClick = function(p) {
      h(l, p);
    }, l._lnLinkEnter = function() {
      u(l);
    }, l.addEventListener("click", l._lnLinkClick), l.addEventListener("mouseenter", l._lnLinkEnter), l.addEventListener("mouseleave", s)));
  }
  function r(l) {
    l[a + "Row"] && (l._lnLinkClick && l.removeEventListener("click", l._lnLinkClick), l._lnLinkEnter && l.removeEventListener("mouseenter", l._lnLinkEnter), l.removeEventListener("mouseleave", s), delete l._lnLinkClick, delete l._lnLinkEnter, delete l[a + "Row"]);
  }
  function e(l) {
    if (!l[a + "Init"]) return;
    const p = l.tagName;
    if (p === "TABLE" || p === "TBODY") {
      const y = p === "TABLE" && l.querySelector("tbody") || l;
      for (const E of y.querySelectorAll("tr"))
        r(E);
    } else
      r(l);
    delete l[a + "Init"];
  }
  function n(l) {
    if (l[a + "Init"]) return;
    l[a + "Init"] = !0;
    const p = l.tagName;
    if (p === "TABLE" || p === "TBODY") {
      const y = p === "TABLE" && l.querySelector("tbody") || l;
      for (const E of y.querySelectorAll("tr"))
        i(E);
    } else i(l);
  }
  function t(l) {
    l.hasAttribute && l.hasAttribute(f) && n(l);
    const p = l.querySelectorAll ? l.querySelectorAll("[" + f + "]") : [];
    for (const y of p)
      n(y);
  }
  function o() {
    new MutationObserver(function(p) {
      for (const y of p)
        if (y.type === "childList")
          for (const E of y.addedNodes)
            E.nodeType === 1 && (t(E), E.tagName === "TR" && E.closest("[" + f + "]") && i(E));
        else y.type === "attributes" && t(y.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  function d(l) {
    t(l);
  }
  window[a] = { init: d, destroy: e };
  function c() {
    g(), o(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const f = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function _(r) {
    const e = r.getAttribute("data-ln-progress");
    return e !== null && e !== "";
  }
  function b(r) {
    v(r);
  }
  function g(r, e, n) {
    r.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function v(r) {
    const e = Array.from(r.querySelectorAll(f));
    for (const n of e)
      _(n) && !n[a] && (n[a] = new m(n));
    r.hasAttribute && r.hasAttribute("data-ln-progress") && _(r) && !r[a] && (r[a] = new m(r));
  }
  function m(r) {
    return this.dom = r, this._attrObserver = null, this._parentObserver = null, i.call(this), u.call(this), s.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function h() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList")
          for (const t of n.addedNodes)
            t.nodeType === 1 && v(t);
        else n.type === "attributes" && v(n.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-progress"]
    });
  }
  h();
  function u() {
    const r = this, e = new MutationObserver(function(n) {
      for (const t of n)
        (t.attributeName === "data-ln-progress" || t.attributeName === "data-ln-progress-max") && i.call(r);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function s() {
    const r = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const n = new MutationObserver(function(t) {
      for (const o of t)
        o.attributeName === "data-ln-progress-max" && i.call(r);
    });
    n.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function i() {
    const r = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, t = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let o = t > 0 ? r / t * 100 : 0;
    o < 0 && (o = 0), o > 100 && (o = 100), this.dom.style.width = o + "%", g(this.dom, "ln-progress:change", { target: this.dom, value: r, max: t, percentage: o });
  }
  window[a] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-filter", a = "lnFilter", _ = "data-ln-filter-initialized", b = "data-ln-filter-key", g = "data-ln-filter-value", v = "data-ln-filter-hide", m = "data-active";
  if (window[a] !== void 0) return;
  function h(e) {
    u(e);
  }
  function u(e) {
    var n = Array.from(e.querySelectorAll("[" + f + "]"));
    e.hasAttribute && e.hasAttribute(f) && n.push(e), n.forEach(function(t) {
      t[a] || (t[a] = new s(t));
    });
  }
  function s(e) {
    return e.hasAttribute(_) ? this : (this.dom = e, this.targetId = e.getAttribute(f), this.buttons = Array.from(e.querySelectorAll("button")), this._attachHandlers(), this.buttons.forEach(function(n) {
      n.setAttribute("aria-pressed", n.hasAttribute(m) ? "true" : "false");
    }), e.setAttribute(_, ""), this);
  }
  s.prototype._attachHandlers = function() {
    var e = this;
    this.buttons.forEach(function(n) {
      n[a + "Bound"] || (n[a + "Bound"] = !0, n.addEventListener("click", function() {
        var t = n.getAttribute(b), o = n.getAttribute(g);
        o === "" ? e.reset() : (e._setActive(n), e._applyFilter(t, o), i(e.dom, "ln-filter:changed", { key: t, value: o }));
      }));
    });
  }, s.prototype._applyFilter = function(e, n) {
    var t = document.getElementById(this.targetId);
    if (t)
      for (var o = Array.from(t.children), d = 0; d < o.length; d++) {
        var c = o[d], l = c.getAttribute("data-" + e);
        c.removeAttribute(v), l !== null && n && l.toLowerCase() !== n.toLowerCase() && c.setAttribute(v, "true");
      }
  }, s.prototype._setActive = function(e) {
    this.buttons.forEach(function(n) {
      n.removeAttribute(m), n.setAttribute("aria-pressed", "false");
    }), e && (e.setAttribute(m, ""), e.setAttribute("aria-pressed", "true"));
  }, s.prototype.filter = function(e, n) {
    this._setActive(null);
    for (var t = 0; t < this.buttons.length; t++) {
      var o = this.buttons[t];
      if (o.getAttribute(b) === e && o.getAttribute(g) === n) {
        this._setActive(o);
        break;
      }
    }
    this._applyFilter(e, n), i(this.dom, "ln-filter:changed", { key: e, value: n });
  }, s.prototype.reset = function() {
    var e = document.getElementById(this.targetId);
    if (e)
      for (var n = Array.from(e.children), t = 0; t < n.length; t++)
        n[t].removeAttribute(v);
    for (var o = null, t = 0; t < this.buttons.length; t++)
      if (this.buttons[t].getAttribute(g) === "") {
        o = this.buttons[t];
        break;
      }
    this._setActive(o), i(this.dom, "ln-filter:reset", {});
  };
  function i(e, n, t) {
    e.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: t || {}
    }));
  }
  function r() {
    var e = new MutationObserver(function(n) {
      n.forEach(function(t) {
        t.type === "childList" ? t.addedNodes.forEach(function(o) {
          o.nodeType === 1 && u(o);
        }) : t.type === "attributes" && u(t.target);
      });
    });
    e.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = h, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    h(document.body);
  }) : h(document.body);
})();
(function() {
  const f = "data-ln-search", a = "lnSearch", _ = "data-ln-search-initialized", b = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function v(s) {
    m(s);
  }
  function m(s) {
    var i = Array.from(s.querySelectorAll("[" + f + "]"));
    s.hasAttribute && s.hasAttribute(f) && i.push(s), i.forEach(function(r) {
      r[a] || (r[a] = new h(r));
    });
  }
  function h(s) {
    if (s.hasAttribute(_)) return this;
    this.dom = s, this.targetId = s.getAttribute(f);
    var i = s.tagName;
    return this.input = i === "INPUT" || i === "TEXTAREA" ? s : s.querySelector('[name="search"]') || s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), s.setAttribute(_, ""), this;
  }
  h.prototype._attachHandler = function() {
    if (this.input) {
      var s = this;
      this._onInput = function() {
        clearTimeout(s._debounceTimer), s._debounceTimer = setTimeout(function() {
          s._search(s.input.value.trim().toLowerCase());
        }, 150);
      }, this.input.addEventListener("input", this._onInput);
    }
  }, h.prototype._search = function(s) {
    var i = document.getElementById(this.targetId);
    if (i) {
      var r = new CustomEvent("ln-search:change", {
        bubbles: !0,
        cancelable: !0,
        detail: { term: s, targetId: this.targetId }
      });
      if (i.dispatchEvent(r)) {
        var e = i.children;
        e.length;
        for (var n = 0; n < e.length; n++) {
          var t = e[n];
          t.removeAttribute(b), s && !t.textContent.replace(/\s+/g, " ").toLowerCase().includes(s) && t.setAttribute(b, "true");
        }
      }
    }
  }, h.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this.dom.removeAttribute(_), delete this.dom[a]);
  };
  function u() {
    var s = new MutationObserver(function(i) {
      i.forEach(function(r) {
        r.type === "childList" ? r.addedNodes.forEach(function(e) {
          e.nodeType === 1 && m(e);
        }) : r.type === "attributes" && m(r.target);
      });
    });
    s.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = v, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const f = "lnTableSort", a = "data-ln-sort", _ = "data-ln-sort-active";
  if (window[f] !== void 0) return;
  function b(u) {
    g(u);
  }
  function g(u) {
    var s = Array.from(u.querySelectorAll("table"));
    u.tagName === "TABLE" && s.push(u), s.forEach(function(i) {
      if (!i[f]) {
        var r = Array.from(i.querySelectorAll("th[" + a + "]"));
        r.length && (i[f] = new v(i, r));
      }
    });
  }
  function v(u, s) {
    this.table = u, this.ths = s, this._col = -1, this._dir = null;
    var i = this;
    return s.forEach(function(r, e) {
      r[f + "Bound"] || (r[f + "Bound"] = !0, r.addEventListener("click", function() {
        i._handleClick(e, r);
      }));
    }), this;
  }
  v.prototype._handleClick = function(u, s) {
    var i;
    this._col !== u ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(r) {
      r.removeAttribute(_);
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = u, this._dir = i, s.setAttribute(_, i)), m(this.table, "ln-table:sort", {
      column: u,
      sortType: s.getAttribute(a),
      direction: i
    });
  };
  function m(u, s, i) {
    u.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      detail: i || {}
    }));
  }
  function h() {
    var u = new MutationObserver(function(s) {
      s.forEach(function(i) {
        i.type === "childList" ? i.addedNodes.forEach(function(r) {
          r.nodeType === 1 && g(r);
        }) : i.type === "attributes" && g(i.target);
      });
    });
    u.observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
  }
  window[f] = b, h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-table", a = "lnTable", _ = "data-ln-sort", b = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  var m = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function h(e) {
    u(e);
  }
  function u(e) {
    var n = Array.from(e.querySelectorAll("[" + f + "]"));
    e.hasAttribute && e.hasAttribute(f) && n.push(e), n.forEach(function(t) {
      t[a] || (t[a] = new s(t));
    });
  }
  function s(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("tbody"), this.thead = e.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    var n = e.querySelector(".ln-table__toolbar");
    n && e.style.setProperty("--ln-table-toolbar-h", n.offsetHeight + "px");
    var t = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      var o = new MutationObserver(function() {
        t.tbody.rows.length > 0 && (o.disconnect(), t._parseRows());
      });
      o.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(d) {
      d.preventDefault(), t._searchTerm = d.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), i(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch), this._onSort = function(d) {
      t._sortCol = d.detail.direction === null ? -1 : d.detail.column, t._sortDir = d.detail.direction, t._sortType = d.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), i(e, "ln-table:sorted", {
        column: d.detail.column,
        direction: d.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-table:sort", this._onSort), this;
  }
  s.prototype._parseRows = function() {
    var e = this.tbody.rows, n = this.ths;
    this._data = [];
    for (var t = [], o = 0; o < n.length; o++)
      t[o] = n[o].getAttribute(_);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (var d = 0; d < e.length; d++) {
      for (var c = e[d], l = [], p = [], y = 0; y < c.cells.length; y++) {
        var E = c.cells[y], L = E.textContent.trim(), C = E.hasAttribute("data-ln-value") ? E.getAttribute("data-ln-value") : L, w = t[y];
        w === "number" || w === "date" ? l[y] = parseFloat(C) || 0 : w === "string" ? l[y] = String(C) : l[y] = null, y < c.cells.length - 1 && p.push(L.toLowerCase());
      }
      this._data.push({
        sortKeys: l,
        html: c.outerHTML,
        searchText: p.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), i(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    if (!this._searchTerm)
      this._filteredData = this._data.slice();
    else {
      var e = this._searchTerm;
      this._filteredData = this._data.filter(function(c) {
        return c.searchText.indexOf(e) !== -1;
      });
    }
    if (!(this._sortCol < 0 || !this._sortDir)) {
      var n = this._sortCol, t = this._sortDir === "desc" ? -1 : 1, o = this._sortType === "number" || this._sortType === "date", d = m ? m.compare : function(c, l) {
        return c < l ? -1 : c > l ? 1 : 0;
      };
      this._filteredData.sort(function(c, l) {
        var p = c.sortKeys[n], y = l.sortKeys[n];
        return o ? (p - y) * t : d(p, y) * t;
      });
    }
  }, s.prototype._lockColumnWidths = function() {
    if (!(!this.table || !this.thead || this._colgroup)) {
      var e = document.createElement("colgroup");
      this.ths.forEach(function(n) {
        var t = document.createElement("col");
        t.style.width = n.offsetWidth + "px", e.appendChild(t);
      }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
    }
  }, s.prototype._render = function() {
    if (this.tbody) {
      var e = this._filteredData.length;
      e === 0 && this._searchTerm ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
    }
  }, s.prototype._renderAll = function() {
    for (var e = [], n = this._filteredData, t = 0; t < n.length; t++) e.push(n[t].html);
    this.tbody.innerHTML = e.join("");
  }, s.prototype._enableVirtualScroll = function() {
    if (!this._virtual) {
      this._virtual = !0;
      var e = this;
      this._scrollHandler = function() {
        e._rafId || (e._rafId = requestAnimationFrame(function() {
          e._rafId = null, e._renderVirtual();
        }));
      }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
    }
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    var e = this._filteredData, n = e.length, t = this._rowHeight;
    if (!(!t || !n)) {
      var o = this.table.getBoundingClientRect(), d = o.top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, l = d + c, p = window.scrollY - l, y = Math.max(0, Math.floor(p / t) - 15), E = Math.min(y + Math.ceil(window.innerHeight / t) + 30, n);
      if (!(y === this._vStart && E === this._vEnd)) {
        this._vStart = y, this._vEnd = E;
        var L = this.ths.length || 1, C = y * t, w = (n - E) * t, T = "";
        C > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + C + 'px;padding:0;border:none"></td></tr>');
        for (var O = y; O < E; O++) T += e[O].html;
        w > 0 && (T += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + L + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = T;
      }
    }
  }, s.prototype._showEmptyState = function() {
    var e = this.ths.length || 1, n = this.dom.querySelector("template[" + b + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(e)), n && t.appendChild(document.importNode(n.content, !0));
    var o = document.createElement("tr");
    o.className = "ln-table__empty", o.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(o), i(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, s.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  };
  function i(e, n, t) {
    e.dispatchEvent(new CustomEvent(n, { bubbles: !0, detail: t || {} }));
  }
  function r() {
    var e = new MutationObserver(function(n) {
      n.forEach(function(t) {
        t.type === "childList" ? t.addedNodes.forEach(function(o) {
          o.nodeType === 1 && u(o);
        }) : t.type === "attributes" && u(t.target);
      });
    });
    e.observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] });
  }
  window[a] = h, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    h(document.body);
  }) : h(document.body);
})();
(function() {
  const f = "[data-ln-circular-progress]", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const _ = "http://www.w3.org/2000/svg", b = 36, g = 16, v = 2 * Math.PI * g;
  function m(o) {
    u(o);
  }
  function h(o, d, c) {
    o.dispatchEvent(new CustomEvent(d, {
      bubbles: !0,
      detail: c || {}
    }));
  }
  function u(o) {
    const d = Array.from(o.querySelectorAll(f));
    for (const c of d)
      c[a] || (c[a] = new s(c));
    o.hasAttribute && o.hasAttribute("data-ln-circular-progress") && !o[a] && (o[a] = new s(o));
  }
  function s(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, r.call(this), t.call(this), n.call(this), o.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  s.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function i(o, d) {
    const c = document.createElementNS(_, o);
    for (const l in d)
      c.setAttribute(l, d[l]);
    return c;
  }
  function r() {
    this.svg = i("svg", {
      viewBox: "0 0 " + b + " " + b,
      "aria-hidden": "true"
    }), this.trackCircle = i("circle", {
      cx: b / 2,
      cy: b / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = i("circle", {
      cx: b / 2,
      cy: b / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": v,
      "stroke-dashoffset": v,
      transform: "rotate(-90 " + b / 2 + " " + b / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function e() {
    new MutationObserver(function(d) {
      for (const c of d)
        if (c.type === "childList")
          for (const l of c.addedNodes)
            l.nodeType === 1 && u(l);
        else c.type === "attributes" && u(c.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress"]
    });
  }
  e();
  function n() {
    const o = this, d = new MutationObserver(function(c) {
      for (const l of c)
        (l.attributeName === "data-ln-circular-progress" || l.attributeName === "data-ln-circular-progress-max") && t.call(o);
    });
    d.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = d;
  }
  function t() {
    const o = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, d = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let c = d > 0 ? o / d * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100);
    const l = v - c / 100 * v;
    this.progressCircle.setAttribute("stroke-dashoffset", l);
    const p = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = p !== null ? p : Math.round(c) + "%", h(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: o,
      max: d,
      percentage: c
    });
  }
  window[a] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const f = "data-ln-sortable", a = "lnSortable", _ = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function b(i) {
    g(i);
  }
  function g(i) {
    const r = Array.from(i.querySelectorAll("[" + f + "]"));
    i.hasAttribute && i.hasAttribute(f) && r.push(i);
    for (const e of r)
      e[a] || (e[a] = new v(e));
  }
  function v(i) {
    this.dom = i, this.isEnabled = i.getAttribute(f) !== "disabled", this._dragging = null, i.setAttribute("aria-roledescription", "sortable list");
    const r = this;
    return this._onPointerDown = function(e) {
      r.isEnabled && r._handlePointerDown(e);
    }, i.addEventListener("pointerdown", this._onPointerDown), this;
  }
  v.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(f, "");
  }, v.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(f, "disabled");
  }, v.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), h(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function m(i) {
    var r = i[a];
    if (r) {
      var e = i.getAttribute(f) !== "disabled";
      e !== r.isEnabled && (r.isEnabled = e);
    }
  }
  v.prototype._handlePointerDown = function(i) {
    let r = i.target.closest("[" + _ + "]"), e;
    if (r) {
      for (e = r; e && e.parentElement !== this.dom; )
        e = e.parentElement;
      if (!e || e.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + _ + "]")) return;
      for (e = i.target; e && e.parentElement !== this.dom; )
        e = e.parentElement;
      if (!e || e.parentElement !== this.dom) return;
      r = e;
    }
    const t = Array.from(this.dom.children).indexOf(e);
    if (u(this.dom, "ln-sortable:before-drag", {
      item: e,
      index: t
    }).defaultPrevented) return;
    i.preventDefault(), r.setPointerCapture(i.pointerId), this._dragging = e, e.classList.add("ln-sortable--dragging"), e.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), h(this.dom, "ln-sortable:drag-start", {
      item: e,
      index: t
    });
    const d = this, c = function(p) {
      d._handlePointerMove(p);
    }, l = function(p) {
      d._handlePointerEnd(p), r.removeEventListener("pointermove", c), r.removeEventListener("pointerup", l), r.removeEventListener("pointercancel", l);
    };
    r.addEventListener("pointermove", c), r.addEventListener("pointerup", l), r.addEventListener("pointercancel", l);
  }, v.prototype._handlePointerMove = function(i) {
    if (!this._dragging) return;
    const r = Array.from(this.dom.children), e = this._dragging;
    for (const n of r)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of r) {
      if (n === e) continue;
      const t = n.getBoundingClientRect(), o = t.top + t.height / 2;
      if (i.clientY >= t.top && i.clientY < o) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (i.clientY >= o && i.clientY <= t.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, v.prototype._handlePointerEnd = function(i) {
    if (!this._dragging) return;
    const r = this._dragging, e = Array.from(this.dom.children), n = e.indexOf(r);
    let t = null, o = null;
    for (const d of e) {
      if (d.classList.contains("ln-sortable--drop-before")) {
        t = d, o = "before";
        break;
      }
      if (d.classList.contains("ln-sortable--drop-after")) {
        t = d, o = "after";
        break;
      }
    }
    for (const d of e)
      d.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (r.classList.remove("ln-sortable--dragging"), r.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), t && t !== r) {
      o === "before" ? this.dom.insertBefore(r, t) : this.dom.insertBefore(r, t.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(r);
      h(this.dom, "ln-sortable:reordered", {
        item: r,
        oldIndex: n,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function h(i, r, e) {
    i.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function u(i, r, e) {
    const n = new CustomEvent(r, {
      bubbles: !0,
      cancelable: !0,
      detail: e || {}
    });
    return i.dispatchEvent(n), n;
  }
  function s() {
    var i = new MutationObserver(function(r) {
      for (var e = 0; e < r.length; e++) {
        var n = r[e];
        if (n.type === "childList")
          for (var t = 0; t < n.addedNodes.length; t++) {
            var o = n.addedNodes[t];
            o.nodeType === 1 && g(o);
          }
        else n.type === "attributes" && (n.attributeName === f && n.target[a] ? m(n.target) : g(n.target));
      }
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = b, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-confirm", a = "lnConfirm", _ = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function g(i) {
    v(i);
  }
  function v(i) {
    const r = Array.from(i.querySelectorAll("[" + f + "]"));
    i.hasAttribute && i.hasAttribute(f) && r.push(i);
    for (const e of r)
      e[a] || (e[a] = new m(e));
  }
  function m(i) {
    this.dom = i, this.confirming = !1, this.originalText = i.textContent.trim(), this.confirmText = i.getAttribute(f) || "Confirm?", this.revertTimer = null;
    var r = this;
    return this._onClick = function(e) {
      r.confirming ? r._reset() : (e.preventDefault(), e.stopImmediatePropagation(), r._enterConfirm());
    }, i.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    var i = parseFloat(this.dom.getAttribute(_));
    return isNaN(i) || i <= 0 ? 3 : i;
  }, m.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.dom.className.match(/ln-icon-/) && this.originalText === "" ? (this.isIconButton = !0, this.originalIconClass = Array.from(this.dom.classList).find(function(i) {
      return i.startsWith("ln-icon-");
    }), this.originalIconClass && this.dom.classList.remove(this.originalIconClass), this.dom.classList.add("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), u(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    var i = this, r = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      i._reset();
    }, r);
  }, m.prototype._reset = function() {
    this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton ? (this.dom.classList.remove("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.originalIconClass && this.dom.classList.add(this.originalIconClass), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1) : this.dom.textContent = this.originalText, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  };
  function h(i) {
    var r = i[a];
    !r || !r.confirming || r._startTimer();
  }
  function u(i, r, e) {
    i.dispatchEvent(new CustomEvent(r, {
      bubbles: !0,
      detail: e || {}
    }));
  }
  function s() {
    var i = new MutationObserver(function(r) {
      for (var e = 0; e < r.length; e++) {
        var n = r[e];
        if (n.type === "childList")
          for (var t = 0; t < n.addedNodes.length; t++) {
            var o = n.addedNodes[t];
            o.nodeType === 1 && v(o);
          }
        else n.type === "attributes" && (n.attributeName === _ && n.target[a] ? h(n.target) : v(n.target));
      }
    });
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f, _]
    });
  }
  window[a] = g, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const f = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  var _ = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  }, b = {};
  function g(r) {
    return b[r] || (b[r] = document.querySelector('[data-ln-template="' + r + '"]')), b[r].content.cloneNode(!0);
  }
  function v(r) {
    m(r);
  }
  function m(r) {
    const e = Array.from(r.querySelectorAll("[" + f + "]"));
    r.hasAttribute && r.hasAttribute(f) && e.push(r);
    for (const n of e)
      n[a] || (n[a] = new h(n));
  }
  function h(r) {
    this.dom = r, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = r.getAttribute(f + "-default") || "", this.badgesEl = r.querySelector("[" + f + "-active]"), this.menuEl = r.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    var e = r.getAttribute(f + "-locales");
    if (this.locales = _, e)
      try {
        this.locales = JSON.parse(e);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(t) {
      t.detail && t.detail.lang && n.addLanguage(t.detail.lang);
    }, this._onRequestRemove = function(t) {
      t.detail && t.detail.lang && n.removeLanguage(t.detail.lang);
    }, r.addEventListener("ln-translations:request-add", this._onRequestAdd), r.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  h.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const r = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of r) {
      const n = e.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const t of n)
        t.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, h.prototype._detectExisting = function() {
    const r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const e of r) {
      const n = e.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, h.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const r = this;
    let e = 0;
    for (const t in this.locales) {
      if (!this.locales.hasOwnProperty(t) || this.activeLanguages.has(t)) continue;
      e++;
      const o = g("ln-translations-menu-item"), d = o.querySelector("[data-ln-translations-lang]");
      d.setAttribute("data-ln-translations-lang", t), d.textContent = this.locales[t], d.addEventListener("click", function(c) {
        c.ctrlKey || c.metaKey || c.button === 1 || (c.preventDefault(), c.stopPropagation(), r.menuEl.getAttribute("data-ln-toggle") === "open" && r.menuEl.setAttribute("data-ln-toggle", "close"), r.addLanguage(t));
      }), this.menuEl.appendChild(o);
    }
    var n = this.dom.querySelector("[" + f + "-add]");
    n && (n.style.display = e === 0 ? "none" : "");
  }, h.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const r = this;
    this.activeLanguages.forEach(function(e) {
      const n = g("ln-translations-badge"), t = n.querySelector("[data-ln-translations-lang]");
      t.setAttribute("data-ln-translations-lang", e);
      const o = t.querySelector("span");
      o.textContent = r.locales[e] || e.toUpperCase();
      const d = t.querySelector("button");
      d.setAttribute("aria-label", "Remove " + (r.locales[e] || e.toUpperCase())), d.addEventListener("click", function(c) {
        c.ctrlKey || c.metaKey || c.button === 1 || (c.preventDefault(), c.stopPropagation(), r.removeLanguage(e));
      }), r.badgesEl.appendChild(n);
    });
  }, h.prototype.addLanguage = function(r, e) {
    if (this.activeLanguages.has(r)) return;
    const n = this.locales[r] || r;
    if (s(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: r,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(r), e = e || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const d of o) {
      const c = d.getAttribute("data-ln-translatable"), l = d.getAttribute("data-ln-translations-prefix") || "", p = d.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!p) continue;
      const y = p.cloneNode(!1);
      l ? y.name = l + "[trans][" + r + "][" + c + "]" : y.name = "trans[" + r + "][" + c + "]", y.value = e[c] !== void 0 ? e[c] : "", y.removeAttribute("id"), y.placeholder = n + " translation", y.setAttribute("data-ln-translatable-lang", r);
      const E = d.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), L = E.length > 0 ? E[E.length - 1] : p;
      L.parentNode.insertBefore(y, L.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), u(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: r,
      langName: n
    });
  }, h.prototype.removeLanguage = function(r) {
    if (!this.activeLanguages.has(r) || s(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: r
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + r + '"]');
    for (const t of n)
      t.parentNode.removeChild(t);
    this.activeLanguages.delete(r), this._updateDropdown(), this._updateBadges(), u(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: r
    });
  }, h.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, h.prototype.hasLanguage = function(r) {
    return this.activeLanguages.has(r);
  }, h.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const r = this.defaultLang, e = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of e)
      n.getAttribute("data-ln-translatable-lang") !== r && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  };
  function u(r, e, n) {
    r.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: n || {}
    }));
  }
  function s(r, e, n) {
    const t = new CustomEvent(e, {
      bubbles: !0,
      cancelable: !0,
      detail: n || {}
    });
    return r.dispatchEvent(t), t;
  }
  function i() {
    new MutationObserver(function(e) {
      for (const n of e)
        if (n.type === "childList")
          for (const t of n.addedNodes)
            t.nodeType === 1 && m(t);
        else n.type === "attributes" && m(n.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = v, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const f = "data-ln-autosave", a = "lnAutosave", _ = "data-ln-autosave-clear", b = "ln-autosave:";
  if (window[a] !== void 0) return;
  function g(t) {
    v(t);
  }
  function v(t) {
    const o = Array.from(t.querySelectorAll("[" + f + "]"));
    t.hasAttribute && t.hasAttribute(f) && o.push(t);
    for (const d of o)
      d[a] || (d[a] = new m(d));
  }
  function m(t) {
    var o = h(t);
    if (!o) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = o;
    var d = this;
    return this._onFocusout = function(c) {
      var l = c.target;
      u(l) && l.name && d.save();
    }, this._onChange = function(c) {
      var l = c.target;
      u(l) && l.name && d.save();
    }, this._onSubmit = function() {
      d.clear();
    }, this._onReset = function() {
      d.clear();
    }, this._onClearClick = function(c) {
      var l = c.target.closest("[" + _ + "]");
      l && d.clear();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  m.prototype.save = function() {
    var t = s(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(t));
    } catch {
      return;
    }
    r(this.dom, "ln-autosave:saved", { target: this.dom, data: t });
  }, m.prototype.restore = function() {
    var t;
    try {
      t = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (t) {
      var o;
      try {
        o = JSON.parse(t);
      } catch {
        return;
      }
      var d = e(this.dom, "ln-autosave:before-restore", { target: this.dom, data: o });
      d.defaultPrevented || (i(this.dom, o), r(this.dom, "ln-autosave:restored", { target: this.dom, data: o }));
    }
  }, m.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    r(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, m.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), r(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function h(t) {
    var o = t.getAttribute(f), d = o || t.id;
    return d ? b + window.location.pathname + ":" + d : null;
  }
  function u(t) {
    var o = t.tagName;
    return o === "INPUT" || o === "TEXTAREA" || o === "SELECT";
  }
  function s(t) {
    for (var o = {}, d = t.elements, c = 0; c < d.length; c++) {
      var l = d[c];
      if (!(!l.name || l.disabled || l.type === "file" || l.type === "submit" || l.type === "button"))
        if (l.type === "checkbox")
          o[l.name] || (o[l.name] = []), l.checked && o[l.name].push(l.value);
        else if (l.type === "radio")
          l.checked && (o[l.name] = l.value);
        else if (l.type === "select-multiple") {
          o[l.name] = [];
          for (var p = 0; p < l.options.length; p++)
            l.options[p].selected && o[l.name].push(l.options[p].value);
        } else
          o[l.name] = l.value;
    }
    return o;
  }
  function i(t, o) {
    for (var d = t.elements, c = [], l = 0; l < d.length; l++) {
      var p = d[l];
      if (!(!p.name || !(p.name in o) || p.type === "file" || p.type === "submit" || p.type === "button")) {
        var y = o[p.name];
        if (p.type === "checkbox")
          p.checked = Array.isArray(y) && y.indexOf(p.value) !== -1, c.push(p);
        else if (p.type === "radio")
          p.checked = p.value === y, c.push(p);
        else if (p.type === "select-multiple") {
          if (Array.isArray(y))
            for (var E = 0; E < p.options.length; E++)
              p.options[E].selected = y.indexOf(p.options[E].value) !== -1;
          c.push(p);
        } else
          p.value = y, c.push(p);
      }
    }
    for (var L = 0; L < c.length; L++)
      c[L].dispatchEvent(new Event("input", { bubbles: !0 })), c[L].dispatchEvent(new Event("change", { bubbles: !0 })), c[L].lnSelect && c[L].lnSelect.setValue && c[L].lnSelect.setValue(o[c[L].name]);
  }
  function r(t, o, d) {
    t.dispatchEvent(new CustomEvent(o, {
      bubbles: !0,
      detail: d || {}
    }));
  }
  function e(t, o, d) {
    var c = new CustomEvent(o, {
      bubbles: !0,
      cancelable: !0,
      detail: d || {}
    });
    return t.dispatchEvent(c), c;
  }
  function n() {
    var t = new MutationObserver(function(o) {
      for (var d = 0; d < o.length; d++)
        if (o[d].type === "childList")
          for (var c = o[d].addedNodes, l = 0; l < c.length; l++)
            c[l].nodeType === 1 && v(c[l]);
        else o[d].type === "attributes" && v(o[d].target);
    });
    t.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = g, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const f = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function _(m) {
    b(m);
  }
  function b(m) {
    const h = Array.from(m.querySelectorAll("[" + f + "]"));
    m.hasAttribute && m.hasAttribute(f) && h.push(m);
    for (const u of h)
      u[a] || (u[a] = new g(u));
  }
  function g(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const h = this;
    return this._onInput = function() {
      h._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  g.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, g.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  };
  function v() {
    new MutationObserver(function(h) {
      for (const u of h)
        if (u.type === "childList")
          for (const s of u.addedNodes)
            s.nodeType === 1 && b(s);
        else u.type === "attributes" && b(u.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f]
    });
  }
  window[a] = _, v(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
