const dt = {};
function tt(d, s) {
  dt[d] || (dt[d] = document.querySelector('[data-ln-template="' + d + '"]'));
  const y = dt[d];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (s || "ln-core") + '] Template "' + d + '" not found'), null);
}
function w(d, s, y) {
  d.dispatchEvent(new CustomEvent(s, {
    bubbles: !0,
    detail: y || {}
  }));
}
function K(d, s, y) {
  const p = new CustomEvent(s, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return d.dispatchEvent(p), p;
}
function F(d, s) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      F(d, s);
    }), console.warn("[" + s + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  d();
}
function I(d, s, y, p) {
  if (d.nodeType !== 1) return;
  const g = Array.from(d.querySelectorAll("[" + s + "]"));
  d.hasAttribute && d.hasAttribute(s) && g.push(d);
  for (const m of g)
    m[y] || (m[y] = new p(m));
}
function ft(d, s) {
  return new Proxy(Object.assign({}, d), {
    set(y, p, g) {
      const m = y[p];
      return m === g || (y[p] = g, s(p, g, m)), !0;
    }
  });
}
function ht(d, s) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, d(), s && s();
    }));
  };
}
(function() {
  const d = "lnHttp";
  if (window[d] !== void 0) return;
  const s = {};
  document.addEventListener("ln-http:request", function(y) {
    const p = y.detail || {};
    if (!p.url) return;
    const g = y.target, m = (p.method || (p.body ? "POST" : "GET")).toUpperCase(), u = p.abort, r = p.tag;
    let a = p.url;
    u && (s[u] && s[u].abort(), s[u] = new AbortController());
    const i = { Accept: "application/json" };
    p.ajax && (i["X-Requested-With"] = "XMLHttpRequest");
    const t = {
      method: m,
      credentials: "same-origin",
      headers: i
    };
    if (u && (t.signal = s[u].signal), p.body && m === "GET") {
      const n = new URLSearchParams();
      for (const o in p.body)
        p.body[o] != null && n.set(o, p.body[o]);
      const e = n.toString();
      e && (a += (a.includes("?") ? "&" : "?") + e);
    } else p.body && (i["Content-Type"] = "application/json", t.body = JSON.stringify(p.body));
    fetch(a, t).then(function(n) {
      u && delete s[u];
      const e = n.ok, o = n.status;
      return n.json().then(function(c) {
        return { ok: e, status: o, data: c };
      }).catch(function() {
        return { ok: !1, status: o, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(n) {
      n.tag = r;
      const e = n.ok ? "ln-http:success" : "ln-http:error";
      w(g, e, n);
    }).catch(function(n) {
      u && n.name !== "AbortError" && delete s[u], n.name !== "AbortError" && w(g, "ln-http:error", { tag: r, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[d] = !0;
})();
(function() {
  const d = "data-ln-ajax", s = "lnAjax";
  if (window[s] !== void 0) return;
  function y(t) {
    if (!t.hasAttribute(d) || t[s]) return;
    t[s] = !0;
    const n = r(t);
    p(n.links), g(n.forms);
  }
  function p(t) {
    for (const n of t) {
      if (n[s + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const e = n.getAttribute("href");
      if (e && e.includes("#")) continue;
      const o = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        c.preventDefault();
        const f = n.getAttribute("href");
        f && u("GET", f, null, n);
      };
      n.addEventListener("click", o), n[s + "Trigger"] = o;
    }
  }
  function g(t) {
    for (const n of t) {
      if (n[s + "Trigger"]) continue;
      const e = function(o) {
        o.preventDefault();
        const c = n.method.toUpperCase(), f = n.action, b = new FormData(n);
        for (const h of n.querySelectorAll('button, input[type="submit"]'))
          h.disabled = !0;
        u(c, f, b, n, function() {
          for (const h of n.querySelectorAll('button, input[type="submit"]'))
            h.disabled = !1;
        });
      };
      n.addEventListener("submit", e), n[s + "Trigger"] = e;
    }
  }
  function m(t) {
    if (!t[s]) return;
    const n = r(t);
    for (const e of n.links)
      e[s + "Trigger"] && (e.removeEventListener("click", e[s + "Trigger"]), delete e[s + "Trigger"]);
    for (const e of n.forms)
      e[s + "Trigger"] && (e.removeEventListener("submit", e[s + "Trigger"]), delete e[s + "Trigger"]);
    delete t[s];
  }
  function u(t, n, e, o, c) {
    if (K(o, "ln-ajax:before-start", { method: t, url: n }).defaultPrevented) return;
    w(o, "ln-ajax:start", { method: t, url: n }), o.classList.add("ln-ajax--loading");
    const b = document.createElement("span");
    b.className = "ln-ajax-spinner", o.appendChild(b);
    function h() {
      o.classList.remove("ln-ajax--loading");
      const L = o.querySelector(".ln-ajax-spinner");
      L && L.remove(), c && c();
    }
    let E = n;
    const k = document.querySelector('meta[name="csrf-token"]'), C = k ? k.getAttribute("content") : null;
    e instanceof FormData && C && e.append("_token", C);
    const S = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (C && (S.headers["X-CSRF-TOKEN"] = C), t === "GET" && e) {
      const L = new URLSearchParams(e);
      E = n + (n.includes("?") ? "&" : "?") + L.toString();
    } else t !== "GET" && e && (S.body = e);
    fetch(E, S).then(function(L) {
      const x = L.ok;
      return L.json().then(function(O) {
        return { ok: x, status: L.status, data: O };
      });
    }).then(function(L) {
      const x = L.data;
      if (L.ok) {
        if (x.title && (document.title = x.title), x.content)
          for (const O in x.content) {
            const N = document.getElementById(O);
            N && (N.innerHTML = x.content[O]);
          }
        if (o.tagName === "A") {
          const O = o.getAttribute("href");
          O && window.history.pushState({ ajax: !0 }, "", O);
        } else o.tagName === "FORM" && o.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", E);
        w(o, "ln-ajax:success", { method: t, url: E, data: x });
      } else
        w(o, "ln-ajax:error", { method: t, url: E, status: L.status, data: x });
      if (x.message && window.lnToast) {
        const O = x.message;
        window.lnToast.enqueue({
          type: O.type || (L.ok ? "success" : "error"),
          title: O.title || "",
          message: O.body || ""
        });
      }
      w(o, "ln-ajax:complete", { method: t, url: E }), h();
    }).catch(function(L) {
      w(o, "ln-ajax:error", { method: t, url: E, error: L }), w(o, "ln-ajax:complete", { method: t, url: E }), h();
    });
  }
  function r(t) {
    const n = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(d) !== "false" ? n.links.push(t) : t.tagName === "FORM" && t.getAttribute(d) !== "false" ? n.forms.push(t) : (n.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function a() {
    F(function() {
      new MutationObserver(function(n) {
        for (const e of n)
          if (e.type === "childList") {
            for (const o of e.addedNodes)
              if (o.nodeType === 1 && (y(o), !o.hasAttribute(d))) {
                for (const f of o.querySelectorAll("[" + d + "]"))
                  y(f);
                const c = o.closest && o.closest("[" + d + "]");
                if (c && c.getAttribute(d) !== "false") {
                  const f = r(o);
                  p(f.links), g(f.forms);
                }
              }
          } else e.type === "attributes" && y(e.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-ajax");
  }
  function i() {
    for (const t of document.querySelectorAll("[" + d + "]"))
      y(t);
  }
  window[s] = y, window[s].destroy = m, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const d = "data-ln-modal", s = "lnModal";
  if (window[s] !== void 0) return;
  function y(i) {
    p(i), g(i);
  }
  function p(i) {
    const t = Array.from(i.querySelectorAll("[" + d + "]"));
    i.hasAttribute && i.hasAttribute(d) && t.push(i);
    for (const n of t)
      n[s] || (n[s] = new m(n));
  }
  function g(i) {
    const t = Array.from(i.querySelectorAll("[data-ln-modal-for]"));
    i.hasAttribute && i.hasAttribute("data-ln-modal-for") && t.push(i);
    for (const n of t)
      n[s + "Trigger"] || (n[s + "Trigger"] = !0, n.addEventListener("click", function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const o = n.getAttribute("data-ln-modal-for"), c = document.getElementById(o);
        !c || !c[s] || c[s].toggle();
      }));
  }
  function m(i) {
    this.dom = i, this.isOpen = i.getAttribute(d) === "open";
    const t = this;
    return this._onEscape = function(n) {
      n.key === "Escape" && t.close();
    }, this._onFocusTrap = function(n) {
      if (n.key !== "Tab") return;
      const e = t.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (e.length === 0) return;
      const o = e[0], c = e[e.length - 1];
      n.shiftKey ? document.activeElement === o && (n.preventDefault(), c.focus()) : document.activeElement === c && (n.preventDefault(), o.focus());
    }, this._onClose = function(n) {
      n.preventDefault(), t.close();
    }, r(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  m.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(d, "open");
  }, m.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(d, "close");
  }, m.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, m.prototype.destroy = function() {
    if (!this.dom[s]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const i = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of i)
      t[s + "Close"] && (t.removeEventListener("click", t[s + "Close"]), delete t[s + "Close"]);
    w(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[s];
  };
  function u(i) {
    const t = i[s];
    if (!t) return;
    const e = i.getAttribute(d) === "open";
    if (e !== t.isOpen)
      if (e) {
        if (K(i, "ln-modal:before-open", { modalId: i.id, target: i }).defaultPrevented) {
          i.setAttribute(d, "close");
          return;
        }
        t.isOpen = !0, i.setAttribute("aria-modal", "true"), i.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", t._onEscape), document.addEventListener("keydown", t._onFocusTrap);
        const c = i.querySelector('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
        if (c) c.focus();
        else {
          const f = i.querySelector("a[href], button:not([disabled])");
          f && f.focus();
        }
        w(i, "ln-modal:open", { modalId: i.id, target: i });
      } else {
        if (K(i, "ln-modal:before-close", { modalId: i.id, target: i }).defaultPrevented) {
          i.setAttribute(d, "open");
          return;
        }
        t.isOpen = !1, i.removeAttribute("aria-modal"), document.removeEventListener("keydown", t._onEscape), document.removeEventListener("keydown", t._onFocusTrap), w(i, "ln-modal:close", { modalId: i.id, target: i }), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function r(i) {
    const t = i.dom.querySelectorAll("[data-ln-modal-close]");
    for (const n of t)
      n[s + "Close"] || (n.addEventListener("click", i._onClose), n[s + "Close"] = i._onClose);
  }
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        for (let n = 0; n < t.length; n++) {
          const e = t[n];
          if (e.type === "childList")
            for (let o = 0; o < e.addedNodes.length; o++) {
              const c = e.addedNodes[o];
              c.nodeType === 1 && (p(c), g(c));
            }
          else e.type === "attributes" && (e.attributeName === d && e.target[s] ? u(e.target) : (p(e.target), g(e.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, "data-ln-modal-for"]
      });
    }, "ln-modal");
  }
  window[s] = y, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const d = "data-ln-nav", s = "lnNav";
  if (window[s] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const n of p)
        n();
    }, history._lnNavPatched = !0;
  }
  function g(t) {
    if (!t.hasAttribute(d) || y.has(t)) return;
    const n = t.getAttribute(d);
    if (!n) return;
    const e = m(t, n);
    y.set(t, e), t[s] = e;
  }
  function m(t, n) {
    let e = Array.from(t.querySelectorAll("a"));
    r(e, n, window.location.pathname);
    const o = function() {
      e = Array.from(t.querySelectorAll("a")), r(e, n, window.location.pathname);
    };
    window.addEventListener("popstate", o), p.push(o);
    const c = new MutationObserver(function(f) {
      for (const b of f)
        if (b.type === "childList") {
          for (const h of b.addedNodes)
            if (h.nodeType === 1) {
              if (h.tagName === "A")
                e.push(h), r([h], n, window.location.pathname);
              else if (h.querySelectorAll) {
                const E = Array.from(h.querySelectorAll("a"));
                e = e.concat(E), r(E, n, window.location.pathname);
              }
            }
          for (const h of b.removedNodes)
            if (h.nodeType === 1) {
              if (h.tagName === "A")
                e = e.filter(function(E) {
                  return E !== h;
                });
              else if (h.querySelectorAll) {
                const E = Array.from(h.querySelectorAll("a"));
                e = e.filter(function(k) {
                  return !E.includes(k);
                });
              }
            }
        }
    });
    return c.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: n,
      observer: c,
      updateHandler: o,
      destroy: function() {
        c.disconnect(), window.removeEventListener("popstate", o);
        const f = p.indexOf(o);
        f !== -1 && p.splice(f, 1), y.delete(t), delete t[s];
      }
    };
  }
  function u(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function r(t, n, e) {
    const o = u(e);
    for (const c of t) {
      const f = c.getAttribute("href");
      if (!f) continue;
      const b = u(f);
      c.classList.remove(n);
      const h = b === o, E = b !== "/" && o.startsWith(b + "/");
      (h || E) && c.classList.add(n);
    }
  }
  function a() {
    F(function() {
      new MutationObserver(function(n) {
        for (const e of n)
          if (e.type === "childList") {
            for (const o of e.addedNodes)
              if (o.nodeType === 1 && (o.hasAttribute && o.hasAttribute(d) && g(o), o.querySelectorAll))
                for (const c of o.querySelectorAll("[" + d + "]"))
                  g(c);
          } else e.type === "attributes" && e.target.hasAttribute && e.target.hasAttribute(d) && g(e.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-nav");
  }
  window[s] = g;
  function i() {
    for (const t of document.querySelectorAll("[" + d + "]"))
      g(t);
  }
  a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
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
  const s = /* @__PURE__ */ new WeakMap();
  function y(u) {
    if (s.has(u)) return;
    const r = u.getAttribute("data-ln-select");
    let a = {};
    if (r && r.trim() !== "")
      try {
        a = JSON.parse(r);
      } catch (n) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", n);
      }
    const t = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: u.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...a };
    try {
      const n = new d(u, t);
      s.set(u, n);
      const e = u.closest("form");
      e && e.addEventListener("reset", () => {
        setTimeout(() => {
          n.clear(), n.clearOptions(), n.sync();
        }, 0);
      });
    } catch (n) {
      console.warn("[ln-select] Failed to initialize Tom Select:", n);
    }
  }
  function p(u) {
    const r = s.get(u);
    r && (r.destroy(), s.delete(u));
  }
  function g() {
    for (const u of document.querySelectorAll("select[data-ln-select]"))
      y(u);
  }
  function m() {
    F(function() {
      new MutationObserver(function(r) {
        for (const a of r) {
          if (a.type === "attributes") {
            a.target.matches && a.target.matches("select[data-ln-select]") && y(a.target);
            continue;
          }
          for (const i of a.addedNodes)
            if (i.nodeType === 1 && (i.matches && i.matches("select[data-ln-select]") && y(i), i.querySelectorAll))
              for (const t of i.querySelectorAll("select[data-ln-select]"))
                y(t);
          for (const i of a.removedNodes)
            if (i.nodeType === 1 && (i.matches && i.matches("select[data-ln-select]") && p(i), i.querySelectorAll))
              for (const t of i.querySelectorAll("select[data-ln-select]"))
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
    g(), m();
  }) : (g(), m()), window.lnSelect = {
    initialize: y,
    destroy: p,
    getInstance: function(u) {
      return s.get(u);
    }
  };
})();
(function() {
  const d = "data-ln-tabs", s = "lnTabs";
  if (window[s] !== void 0 && window[s] !== null) return;
  function y(r = document.body) {
    I(r, d, s, g);
  }
  function p() {
    const r = (location.hash || "").replace("#", ""), a = {};
    if (!r) return a;
    for (const i of r.split("&")) {
      const t = i.indexOf(":");
      t > 0 && (a[i.slice(0, t)] = i.slice(t + 1));
    }
    return a;
  }
  function g(r) {
    return this.dom = r, m.call(this), this;
  }
  function m() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const a of this.tabs) {
      const i = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      i && (this.mapTabs[i] = a);
    }
    for (const a of this.panels) {
      const i = (a.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      i && (this.mapPanels[i] = a);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const r = this;
    this._clickHandlers = [];
    for (const a of this.tabs) {
      if (a[s + "Trigger"]) continue;
      a[s + "Trigger"] = !0;
      const i = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        const n = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (n)
          if (r.hashEnabled) {
            const e = p();
            e[r.nsKey] = n;
            const o = Object.keys(e).map(function(c) {
              return c + ":" + e[c];
            }).join("&");
            location.hash === "#" + o ? r.activate(n) : location.hash = o;
          } else
            r.activate(n);
      };
      a.addEventListener("click", i), r._clickHandlers.push({ el: a, handler: i });
    }
    this._hashHandler = function() {
      if (!r.hashEnabled) return;
      const a = p();
      r.activate(r.nsKey in a ? a[r.nsKey] : r.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  g.prototype.activate = function(r) {
    var a;
    (!r || !(r in this.mapPanels)) && (r = this.defaultKey);
    for (const i in this.mapTabs) {
      const t = this.mapTabs[i];
      i === r ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const i in this.mapPanels) {
      const t = this.mapPanels[i], n = i === r;
      t.classList.toggle("hidden", !n), t.setAttribute("aria-hidden", n ? "false" : "true");
    }
    if (this.autoFocus) {
      const i = (a = this.mapPanels[r]) == null ? void 0 : a.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      i && setTimeout(() => i.focus({ preventScroll: !0 }), 0);
    }
    w(this.dom, "ln-tabs:change", { key: r, tab: this.mapTabs[r], panel: this.mapPanels[r] });
  }, g.prototype.destroy = function() {
    if (this.dom[s]) {
      for (const { el: r, handler: a } of this._clickHandlers)
        r.removeEventListener("click", a);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), w(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[s];
    }
  };
  function u() {
    F(function() {
      new MutationObserver(function(a) {
        for (const i of a) {
          if (i.type === "attributes") {
            I(i.target, d, s, g);
            continue;
          }
          for (const t of i.addedNodes)
            I(t, d, s, g);
        }
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-tabs");
  }
  u(), window[s] = y, y(document.body);
})();
(function() {
  const d = "data-ln-toggle", s = "lnToggle";
  if (window[s] !== void 0) return;
  function y(r) {
    I(r, d, s, g), p(r);
  }
  function p(r) {
    const a = Array.from(r.querySelectorAll("[data-ln-toggle-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-toggle-for") && a.push(r);
    for (const i of a) {
      if (i[s + "Trigger"]) return;
      i[s + "Trigger"] = !0, i.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const n = i.getAttribute("data-ln-toggle-for"), e = document.getElementById(n);
        if (!e || !e[s]) return;
        const o = i.getAttribute("data-ln-toggle-action") || "toggle";
        e[s][o]();
      });
    }
  }
  function g(r) {
    return this.dom = r, this.isOpen = r.getAttribute(d) === "open", this.isOpen && r.classList.add("open"), this;
  }
  g.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(d, "open");
  }, g.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(d, "close");
  }, g.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, g.prototype.destroy = function() {
    this.dom[s] && (w(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function m(r) {
    const a = r[s];
    if (!a) return;
    const t = r.getAttribute(d) === "open";
    if (t !== a.isOpen)
      if (t) {
        if (K(r, "ln-toggle:before-open", { target: r }).defaultPrevented) {
          r.setAttribute(d, "close");
          return;
        }
        a.isOpen = !0, r.classList.add("open"), w(r, "ln-toggle:open", { target: r });
      } else {
        if (K(r, "ln-toggle:before-close", { target: r }).defaultPrevented) {
          r.setAttribute(d, "open");
          return;
        }
        a.isOpen = !1, r.classList.remove("open"), w(r, "ln-toggle:close", { target: r });
      }
  }
  function u() {
    F(function() {
      new MutationObserver(function(a) {
        for (let i = 0; i < a.length; i++) {
          const t = a[i];
          if (t.type === "childList")
            for (let n = 0; n < t.addedNodes.length; n++) {
              const e = t.addedNodes[n];
              e.nodeType === 1 && (I(e, d, s, g), p(e));
            }
          else t.type === "attributes" && (t.attributeName === d && t.target[s] ? m(t.target) : (I(t.target, d, s, g), p(t.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, "data-ln-toggle-for"]
      });
    }, "ln-toggle");
  }
  window[s] = y, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const d = "data-ln-accordion", s = "lnAccordion";
  if (window[s] !== void 0) return;
  function y(m) {
    I(m, d, s, p);
  }
  function p(m) {
    return this.dom = m, this._onToggleOpen = function(u) {
      const r = m.querySelectorAll("[data-ln-toggle]");
      for (const a of r)
        a !== u.detail.target && a.getAttribute("data-ln-toggle") === "open" && a.setAttribute("data-ln-toggle", "close");
      w(m, "ln-accordion:change", { target: u.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  p.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), w(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function g() {
    F(function() {
      new MutationObserver(function(u) {
        for (const r of u)
          if (r.type === "childList")
            for (const a of r.addedNodes)
              a.nodeType === 1 && I(a, d, s, p);
          else r.type === "attributes" && I(r.target, d, s, p);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-accordion");
  }
  window[s] = y, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const d = "data-ln-dropdown", s = "lnDropdown";
  if (window[s] !== void 0) return;
  function y(m) {
    I(m, d, s, p);
  }
  function p(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const r of this.toggleEl.children)
        r.setAttribute("role", "menuitem");
    const u = this;
    return this._onToggleOpen = function(r) {
      r.detail.target === u.toggleEl && (u.triggerBtn && u.triggerBtn.setAttribute("aria-expanded", "true"), u._teleportToBody(), u._addOutsideClickListener(), u._addScrollRepositionListener(), u._addResizeCloseListener(), w(m, "ln-dropdown:open", { target: r.detail.target }));
    }, this._onToggleClose = function(r) {
      r.detail.target === u.toggleEl && (u.triggerBtn && u.triggerBtn.setAttribute("aria-expanded", "false"), u._removeOutsideClickListener(), u._removeScrollRepositionListener(), u._removeResizeCloseListener(), u._teleportBack(), w(m, "ln-dropdown:close", { target: r.detail.target }));
    }, this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose), this;
  }
  p.prototype._positionMenu = function() {
    const m = this.dom.querySelector("[data-ln-toggle-for]");
    if (!m || !this.toggleEl) return;
    const u = m.getBoundingClientRect(), r = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    r && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const a = this.toggleEl.offsetWidth, i = this.toggleEl.offsetHeight;
    r && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, n = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    let o;
    u.bottom + e + i <= n ? o = u.bottom + e : u.top - e - i >= 0 ? o = u.top - e - i : o = Math.max(0, n - i);
    let c;
    u.right - a >= 0 ? c = u.right - a : u.left + a <= t ? c = u.left : c = Math.max(0, t - a), this.toggleEl.style.top = o + "px", this.toggleEl.style.left = c + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, p.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, p.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, p.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const m = this;
    this._boundDocClick = function(u) {
      m.dom.contains(u.target) || m.toggleEl && m.toggleEl.contains(u.target) || m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, setTimeout(function() {
      document.addEventListener("click", m._boundDocClick);
    }, 0);
  }, p.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, p.prototype._addScrollRepositionListener = function() {
    const m = this;
    this._boundScrollReposition = function() {
      m._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, p.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, p.prototype._addResizeCloseListener = function() {
    const m = this;
    this._boundResizeClose = function() {
      m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, p.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, p.prototype.destroy = function() {
    this.dom[s] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose), w(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function g() {
    F(function() {
      new MutationObserver(function(u) {
        for (const r of u)
          if (r.type === "childList")
            for (const a of r.addedNodes)
              a.nodeType === 1 && I(a, d, s, p);
          else r.type === "attributes" && I(r.target, d, s, p);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-dropdown");
  }
  window[s] = y, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const d = "data-ln-toast", s = "lnToast", y = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[s] !== void 0 && window[s] !== null) return;
  function p(e = document.body) {
    return g(e), n;
  }
  function g(e) {
    if (!e || e.nodeType !== 1) return;
    const o = Array.from(e.querySelectorAll("[" + d + "]"));
    e.hasAttribute && e.hasAttribute(d) && o.push(e);
    for (const c of o)
      c[s] || new m(c);
  }
  function m(e) {
    this.dom = e, e[s] = this, this.timeoutDefault = parseInt(e.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(e.getAttribute("data-ln-toast-max") || "5", 10);
    for (const o of Array.from(e.querySelectorAll("[data-ln-toast-item]")))
      u(o);
    return this;
  }
  m.prototype.destroy = function() {
    if (this.dom[s]) {
      for (const e of Array.from(this.dom.children))
        a(e);
      delete this.dom[s];
    }
  };
  function u(e) {
    const o = ((e.getAttribute("data-type") || "info") + "").toLowerCase(), c = e.getAttribute("data-title"), f = (e.innerText || e.textContent || "").trim();
    e.className = "ln-toast__item", e.removeAttribute("data-ln-toast-item");
    const b = document.createElement("div");
    b.className = "ln-toast__card ln-toast__card--" + o, b.setAttribute("role", o === "error" ? "alert" : "status"), b.setAttribute("aria-live", o === "error" ? "assertive" : "polite");
    const h = document.createElement("div");
    h.className = "ln-toast__side", h.innerHTML = y[o] || y.info;
    const E = document.createElement("div");
    E.className = "ln-toast__content";
    const k = document.createElement("div");
    k.className = "ln-toast__head";
    const C = document.createElement("strong");
    C.className = "ln-toast__title", C.textContent = c || (o === "success" ? "Success" : o === "error" ? "Error" : o === "warn" ? "Warning" : "Information");
    const S = document.createElement("button");
    if (S.type = "button", S.className = "ln-toast__close ln-icon-close", S.setAttribute("aria-label", "Close"), S.addEventListener("click", () => a(e)), k.appendChild(C), E.appendChild(k), E.appendChild(S), f) {
      const L = document.createElement("div");
      L.className = "ln-toast__body";
      const x = document.createElement("p");
      x.textContent = f, L.appendChild(x), E.appendChild(L);
    }
    b.appendChild(h), b.appendChild(E), e.innerHTML = "", e.appendChild(b), requestAnimationFrame(() => e.classList.add("ln-toast__item--in"));
  }
  function r(e, o) {
    for (; e.dom.children.length >= e.max; ) e.dom.removeChild(e.dom.firstElementChild);
    e.dom.appendChild(o), requestAnimationFrame(() => o.classList.add("ln-toast__item--in"));
  }
  function a(e) {
    !e || !e.parentNode || (clearTimeout(e._timer), e.classList.remove("ln-toast__item--in"), e.classList.add("ln-toast__item--out"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 200));
  }
  function i(e = {}) {
    let o = e.container;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), !o)
      return console.warn("[ln-toast] No toast container found"), null;
    const c = o[s] || new m(o), f = Number.isFinite(e.timeout) ? e.timeout : c.timeoutDefault, b = (e.type || "info").toLowerCase(), h = document.createElement("li");
    h.className = "ln-toast__item";
    const E = document.createElement("div");
    E.className = "ln-toast__card ln-toast__card--" + b, E.setAttribute("role", b === "error" ? "alert" : "status"), E.setAttribute("aria-live", b === "error" ? "assertive" : "polite");
    const k = document.createElement("div");
    k.className = "ln-toast__side", k.innerHTML = y[b] || y.info;
    const C = document.createElement("div");
    C.className = "ln-toast__content";
    const S = document.createElement("div");
    S.className = "ln-toast__head";
    const L = document.createElement("strong");
    L.className = "ln-toast__title", L.textContent = e.title || (b === "success" ? "Success" : b === "error" ? "Error" : b === "warn" ? "Warning" : "Information");
    const x = document.createElement("button");
    if (x.type = "button", x.className = "ln-toast__close ln-icon-close", x.setAttribute("aria-label", "Close"), x.addEventListener("click", () => a(h)), S.appendChild(L), C.appendChild(S), C.appendChild(x), e.message || e.data && e.data.errors) {
      const O = document.createElement("div");
      if (O.className = "ln-toast__body", e.message)
        if (Array.isArray(e.message)) {
          const N = document.createElement("ul");
          for (const H of e.message) {
            const B = document.createElement("li");
            B.textContent = H, N.appendChild(B);
          }
          O.appendChild(N);
        } else {
          const N = document.createElement("p");
          N.textContent = e.message, O.appendChild(N);
        }
      if (e.data && e.data.errors) {
        const N = document.createElement("ul");
        for (const H of Object.values(e.data.errors).flat()) {
          const B = document.createElement("li");
          B.textContent = H, N.appendChild(B);
        }
        O.appendChild(N);
      }
      C.appendChild(O);
    }
    return E.appendChild(k), E.appendChild(C), h.appendChild(E), r(c, h), f > 0 && (h._timer = setTimeout(() => a(h), f)), h;
  }
  function t(e) {
    let o = e;
    if (typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), !!o)
      for (const c of Array.from(o.children))
        a(c);
  }
  const n = function(e) {
    return p(e);
  };
  n.enqueue = i, n.clear = t, F(function() {
    new MutationObserver(function(o) {
      for (const c of o) {
        if (c.type === "attributes") {
          g(c.target);
          continue;
        }
        for (const f of c.addedNodes)
          g(f);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
  }, "ln-toast"), window[s] = n, window.addEventListener("ln-toast:enqueue", function(e) {
    e.detail && n.enqueue(e.detail);
  }), p(document.body);
})();
(function() {
  const d = "data-ln-upload", s = "lnUpload", y = "data-ln-upload-dict", p = "data-ln-upload-accept", g = "data-ln-upload-context";
  if (window[s] !== void 0) return;
  function m(o, c) {
    const f = o.querySelector("[" + y + '="' + c + '"]');
    return f ? f.textContent : c;
  }
  function u(o) {
    if (o === 0) return "0 B";
    const c = 1024, f = ["B", "KB", "MB", "GB"], b = Math.floor(Math.log(o) / Math.log(c));
    return parseFloat((o / Math.pow(c, b)).toFixed(1)) + " " + f[b];
  }
  function r(o) {
    return o.split(".").pop().toLowerCase();
  }
  function a(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "ln-icon-file-" + o : "ln-icon-file";
  }
  function i(o, c) {
    if (!c) return !0;
    const f = "." + r(o.name);
    return c.split(",").map(function(h) {
      return h.trim().toLowerCase();
    }).includes(f.toLowerCase());
  }
  function t(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true");
    const c = o.querySelector(".ln-upload__zone"), f = o.querySelector(".ln-upload__list"), b = o.getAttribute(p) || "";
    if (!c || !f) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", o);
      return;
    }
    let h = o.querySelector('input[type="file"]');
    h || (h = document.createElement("input"), h.type = "file", h.multiple = !0, h.classList.add("hidden"), b && (h.accept = b.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), o.appendChild(h));
    const E = o.getAttribute(d) || "/files/upload", k = o.getAttribute(g) || "", C = /* @__PURE__ */ new Map();
    let S = 0;
    function L() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function x(R) {
      if (!i(R, b)) {
        const A = m(o, "invalid-type");
        w(o, "ln-upload:invalid", {
          file: R,
          message: A
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: "Invalid File",
          message: A || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++S, j = r(R.name), G = a(j), z = document.createElement("li");
      z.className = "ln-upload__item ln-upload__item--uploading " + G, z.setAttribute("data-file-id", P);
      const ot = document.createElement("span");
      ot.className = "ln-upload__name", ot.textContent = R.name;
      const W = document.createElement("span");
      W.className = "ln-upload__size", W.textContent = "0%";
      const X = document.createElement("button");
      X.type = "button", X.className = "ln-upload__remove ln-icon-close", X.title = m(o, "remove"), X.textContent = "×", X.disabled = !0;
      const l = document.createElement("div");
      l.className = "ln-upload__progress";
      const v = document.createElement("div");
      v.className = "ln-upload__progress-bar", l.appendChild(v), z.appendChild(ot), z.appendChild(W), z.appendChild(X), z.appendChild(l), f.appendChild(z);
      const _ = new FormData();
      _.append("file", R), _.append("context", k);
      const T = new XMLHttpRequest();
      T.upload.addEventListener("progress", function(A) {
        if (A.lengthComputable) {
          const M = Math.round(A.loaded / A.total * 100);
          v.style.width = M + "%", W.textContent = M + "%";
        }
      }), T.addEventListener("load", function() {
        if (T.status >= 200 && T.status < 300) {
          let A;
          try {
            A = JSON.parse(T.responseText);
          } catch {
            D("Invalid response");
            return;
          }
          z.classList.remove("ln-upload__item--uploading"), W.textContent = u(A.size || R.size), X.disabled = !1, C.set(P, {
            serverId: A.id,
            name: A.name,
            size: A.size
          }), O(), w(o, "ln-upload:uploaded", {
            localId: P,
            serverId: A.id,
            name: A.name
          });
        } else {
          let A = "Upload failed";
          try {
            A = JSON.parse(T.responseText).message || A;
          } catch {
          }
          D(A);
        }
      }), T.addEventListener("error", function() {
        D("Network error");
      });
      function D(A) {
        z.classList.remove("ln-upload__item--uploading"), z.classList.add("ln-upload__item--error"), v.style.width = "100%", W.textContent = m(o, "error"), X.disabled = !1, w(o, "ln-upload:error", {
          file: R,
          message: A
        }), w(window, "ln-toast:enqueue", {
          type: "error",
          title: "Upload Error",
          message: A || m(o, "upload-failed") || "Failed to upload file"
        });
      }
      T.open("POST", E), T.setRequestHeader("X-CSRF-TOKEN", L()), T.setRequestHeader("Accept", "application/json"), T.send(_);
    }
    function O() {
      for (const R of o.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of C) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = R.serverId, o.appendChild(P);
      }
    }
    function N(R) {
      const P = C.get(R), j = f.querySelector('[data-file-id="' + R + '"]');
      if (!P || !P.serverId) {
        j && j.remove(), C.delete(R), O();
        return;
      }
      j && j.classList.add("ln-upload__item--deleting"), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": L(),
          Accept: "application/json"
        }
      }).then(function(G) {
        G.status === 200 ? (j && j.remove(), C.delete(R), O(), w(o, "ln-upload:removed", {
          localId: R,
          serverId: P.serverId
        })) : (j && j.classList.remove("ln-upload__item--deleting"), w(window, "ln-toast:enqueue", {
          type: "error",
          title: "Error",
          message: m(o, "delete-error") || "Failed to delete file"
        }));
      }).catch(function(G) {
        console.warn("[ln-upload] Delete error:", G), j && j.classList.remove("ln-upload__item--deleting"), w(window, "ln-toast:enqueue", {
          type: "error",
          title: "Network Error",
          message: "Could not connect to server"
        });
      });
    }
    function H(R) {
      for (const P of R)
        x(P);
      h.value = "";
    }
    const B = function() {
      h.click();
    }, V = function() {
      H(this.files);
    }, et = function(R) {
      R.preventDefault(), R.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }, Y = function(R) {
      R.preventDefault(), R.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }, $ = function(R) {
      R.preventDefault(), R.stopPropagation(), c.classList.remove("ln-upload__zone--dragover");
    }, Q = function(R) {
      R.preventDefault(), R.stopPropagation(), c.classList.remove("ln-upload__zone--dragover"), H(R.dataTransfer.files);
    }, nt = function(R) {
      if (R.target.classList.contains("ln-upload__remove")) {
        const P = R.target.closest(".ln-upload__item");
        P && N(P.getAttribute("data-file-id"));
      }
    };
    c.addEventListener("click", B), h.addEventListener("change", V), c.addEventListener("dragenter", et), c.addEventListener("dragover", Y), c.addEventListener("dragleave", $), c.addEventListener("drop", Q), f.addEventListener("click", nt), o.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(C.values()).map(function(R) {
          return R.serverId;
        });
      },
      getFiles: function() {
        return Array.from(C.values());
      },
      clear: function() {
        for (const [, R] of C)
          R.serverId && fetch("/files/" + R.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": L(),
              Accept: "application/json"
            }
          });
        C.clear(), f.innerHTML = "", O(), w(o, "ln-upload:cleared", {});
      },
      destroy: function() {
        c.removeEventListener("click", B), h.removeEventListener("change", V), c.removeEventListener("dragenter", et), c.removeEventListener("dragover", Y), c.removeEventListener("dragleave", $), c.removeEventListener("drop", Q), f.removeEventListener("click", nt), C.clear(), f.innerHTML = "", O(), o.removeAttribute("data-ln-upload-initialized"), delete o.lnUploadAPI;
      }
    };
  }
  function n() {
    for (const o of document.querySelectorAll("[" + d + "]"))
      t(o);
  }
  function e() {
    F(function() {
      new MutationObserver(function(c) {
        for (const f of c)
          if (f.type === "childList") {
            for (const b of f.addedNodes)
              if (b.nodeType === 1) {
                b.hasAttribute(d) && t(b);
                for (const h of b.querySelectorAll("[" + d + "]"))
                  t(h);
              }
          } else f.type === "attributes" && f.target.hasAttribute(d) && t(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-upload");
  }
  window[s] = {
    init: t,
    initAll: n
  }, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const d = "lnExternalLinks";
  if (window[d] !== void 0) return;
  function s(r) {
    return r.hostname && r.hostname !== window.location.hostname;
  }
  function y(r) {
    r.getAttribute("data-ln-external-link") !== "processed" && s(r) && (r.target = "_blank", r.rel = "noopener noreferrer", r.setAttribute("data-ln-external-link", "processed"), w(r, "ln-external-links:processed", {
      link: r,
      href: r.href
    }));
  }
  function p(r) {
    r = r || document.body;
    for (const a of r.querySelectorAll("a, area"))
      y(a);
  }
  function g() {
    document.body.addEventListener("click", function(r) {
      const a = r.target.closest("a, area");
      a && a.getAttribute("data-ln-external-link") === "processed" && w(a, "ln-external-links:clicked", {
        link: a,
        href: a.href,
        text: a.textContent || a.title || ""
      });
    });
  }
  function m() {
    F(function() {
      new MutationObserver(function(a) {
        for (const i of a)
          if (i.type === "childList") {
            for (const t of i.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && y(t), t.querySelectorAll))
                for (const n of t.querySelectorAll("a, area"))
                  y(n);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function u() {
    g(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[d] = {
    process: p
  }, u();
})();
(function() {
  const d = "data-ln-link", s = "lnLink";
  if (window[s] !== void 0) return;
  let y = null;
  function p() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function g(h) {
    y && (y.textContent = h, y.classList.add("ln-link-status--visible"));
  }
  function m() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function u(h, E) {
    if (E.target.closest("a, button, input, select, textarea")) return;
    const k = h.querySelector("a");
    if (!k) return;
    const C = k.getAttribute("href");
    if (!C) return;
    if (E.ctrlKey || E.metaKey || E.button === 1) {
      window.open(C, "_blank");
      return;
    }
    K(h, "ln-link:navigate", { target: h, href: C, link: k }).defaultPrevented || k.click();
  }
  function r(h) {
    const E = h.querySelector("a");
    if (!E) return;
    const k = E.getAttribute("href");
    k && g(k);
  }
  function a() {
    m();
  }
  function i(h) {
    h[s + "Row"] || (h[s + "Row"] = !0, h.querySelector("a") && (h._lnLinkClick = function(E) {
      u(h, E);
    }, h._lnLinkEnter = function() {
      r(h);
    }, h.addEventListener("click", h._lnLinkClick), h.addEventListener("mouseenter", h._lnLinkEnter), h.addEventListener("mouseleave", a)));
  }
  function t(h) {
    h[s + "Row"] && (h._lnLinkClick && h.removeEventListener("click", h._lnLinkClick), h._lnLinkEnter && h.removeEventListener("mouseenter", h._lnLinkEnter), h.removeEventListener("mouseleave", a), delete h._lnLinkClick, delete h._lnLinkEnter, delete h[s + "Row"]);
  }
  function n(h) {
    if (!h[s + "Init"]) return;
    const E = h.tagName;
    if (E === "TABLE" || E === "TBODY") {
      const k = E === "TABLE" && h.querySelector("tbody") || h;
      for (const C of k.querySelectorAll("tr"))
        t(C);
    } else
      t(h);
    delete h[s + "Init"];
  }
  function e(h) {
    if (h[s + "Init"]) return;
    h[s + "Init"] = !0;
    const E = h.tagName;
    if (E === "TABLE" || E === "TBODY") {
      const k = E === "TABLE" && h.querySelector("tbody") || h;
      for (const C of k.querySelectorAll("tr"))
        i(C);
    } else i(h);
  }
  function o(h) {
    h.hasAttribute && h.hasAttribute(d) && e(h);
    const E = h.querySelectorAll ? h.querySelectorAll("[" + d + "]") : [];
    for (const k of E)
      e(k);
  }
  function c() {
    F(function() {
      new MutationObserver(function(E) {
        for (const k of E)
          if (k.type === "childList")
            for (const C of k.addedNodes)
              C.nodeType === 1 && (o(C), C.tagName === "TR" && C.closest("[" + d + "]") && i(C));
          else k.type === "attributes" && o(k.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-link");
  }
  function f(h) {
    o(h);
  }
  window[s] = { init: f, destroy: n };
  function b() {
    p(), c(), f(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b();
})();
(function() {
  const d = "[data-ln-progress]", s = "lnProgress";
  if (window[s] !== void 0) return;
  function y(t) {
    const n = t.getAttribute("data-ln-progress");
    return n !== null && n !== "";
  }
  function p(t) {
    g(t);
  }
  function g(t) {
    const n = Array.from(t.querySelectorAll(d));
    for (const e of n)
      y(e) && !e[s] && (e[s] = new m(e));
    t.hasAttribute && t.hasAttribute("data-ln-progress") && y(t) && !t[s] && (t[s] = new m(t));
  }
  function m(t) {
    return this.dom = t, this._attrObserver = null, this._parentObserver = null, i.call(this), r.call(this), a.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[s] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[s]);
  };
  function u() {
    new MutationObserver(function(n) {
      for (const e of n)
        if (e.type === "childList")
          for (const o of e.addedNodes)
            o.nodeType === 1 && g(o);
        else e.type === "attributes" && g(e.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-progress"]
    });
  }
  u();
  function r() {
    const t = this, n = new MutationObserver(function(e) {
      for (const o of e)
        (o.attributeName === "data-ln-progress" || o.attributeName === "data-ln-progress-max") && i.call(t);
    });
    n.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = n;
  }
  function a() {
    const t = this, n = this.dom.parentElement;
    if (!n || !n.hasAttribute("data-ln-progress-max")) return;
    const e = new MutationObserver(function(o) {
      for (const c of o)
        c.attributeName === "data-ln-progress-max" && i.call(t);
    });
    e.observe(n, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = e;
  }
  function i() {
    const t = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, n = this.dom.parentElement, o = (n && n.hasAttribute("data-ln-progress-max") ? parseFloat(n.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let c = o > 0 ? t / o * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100), this.dom.style.width = c + "%", w(this.dom, "ln-progress:change", { target: this.dom, value: t, max: o, percentage: c });
  }
  window[s] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-filter", s = "lnFilter", y = "data-ln-filter-initialized", p = "data-ln-filter-key", g = "data-ln-filter-value", m = "data-ln-filter-hide", u = "data-active";
  if (window[s] !== void 0) return;
  function r(t) {
    I(t, d, s, a);
  }
  function a(t) {
    if (t.hasAttribute(y)) return this;
    this.dom = t, this.targetId = t.getAttribute(d), this.buttons = Array.from(t.querySelectorAll("button")), this._pendingEvents = [];
    const n = this, e = ht(
      function() {
        n._render();
      },
      function() {
        n._afterRender();
      }
    );
    this.state = ft({
      key: null,
      value: null
    }, e), this._attachHandlers();
    for (let o = 0; o < this.buttons.length; o++) {
      const c = this.buttons[o];
      if (c.hasAttribute(u) && c.getAttribute(g) !== "") {
        this.state.key = c.getAttribute(p), this.state.value = c.getAttribute(g);
        break;
      }
    }
    return this.buttons.forEach(function(o) {
      o.setAttribute("aria-pressed", o.hasAttribute(u) ? "true" : "false");
    }), t.setAttribute(y, ""), this;
  }
  a.prototype._attachHandlers = function() {
    const t = this;
    this.buttons.forEach(function(n) {
      n[s + "Bound"] || (n[s + "Bound"] = !0, n.addEventListener("click", function() {
        const e = n.getAttribute(p), o = n.getAttribute(g);
        o === "" ? (t._pendingEvents.push({ name: "ln-filter:changed", detail: { key: e, value: "" } }), t.reset()) : (t._pendingEvents.push({ name: "ln-filter:changed", detail: { key: e, value: o } }), t.state.key = e, t.state.value = o);
      }));
    });
  }, a.prototype._render = function() {
    const t = this, n = this.state.key, e = this.state.value;
    this.buttons.forEach(function(f) {
      const b = f.getAttribute(p), h = f.getAttribute(g);
      let E = !1;
      n === null && e === null ? E = h === "" : E = b === n && h === e, E ? (f.setAttribute(u, ""), f.setAttribute("aria-pressed", "true")) : (f.removeAttribute(u), f.setAttribute("aria-pressed", "false"));
    });
    const o = document.getElementById(t.targetId);
    if (!o) return;
    const c = o.children;
    for (let f = 0; f < c.length; f++) {
      const b = c[f];
      if (n === null && e === null) {
        b.removeAttribute(m);
        continue;
      }
      const h = b.getAttribute("data-" + n);
      b.removeAttribute(m), h !== null && e && h.toLowerCase() !== e.toLowerCase() && b.setAttribute(m, "true");
    }
  }, a.prototype._afterRender = function() {
    const t = this._pendingEvents;
    this._pendingEvents = [];
    for (let n = 0; n < t.length; n++)
      this._dispatchOnBoth(t[n].name, t[n].detail);
  }, a.prototype._dispatchOnBoth = function(t, n) {
    w(this.dom, t, n);
    const e = document.getElementById(this.targetId);
    e && e !== this.dom && w(e, t, n);
  }, a.prototype.filter = function(t, n) {
    this._pendingEvents.push({ name: "ln-filter:changed", detail: { key: t, value: n } }), this.state.key = t, this.state.value = n;
  }, a.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.value = null;
  }, a.prototype.getActive = function() {
    return this.state.key === null && this.state.value === null ? null : { key: this.state.key, value: this.state.value };
  };
  function i() {
    F(function() {
      new MutationObserver(function(n) {
        for (const e of n)
          if (e.type === "childList")
            for (const o of e.addedNodes)
              o.nodeType === 1 && I(o, d, s, a);
          else e.type === "attributes" && I(e.target, d, s, a);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-filter");
  }
  window[s] = r, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    r(document.body);
  }) : r(document.body);
})();
(function() {
  const d = "data-ln-search", s = "lnSearch", y = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[s] !== void 0) return;
  function m(a) {
    I(a, d, s, u);
  }
  function u(a) {
    if (a.hasAttribute(y)) return this;
    this.dom = a, this.targetId = a.getAttribute(d);
    const i = a.tagName;
    return this.input = i === "INPUT" || i === "TEXTAREA" ? a : a.querySelector('[name="search"]') || a.querySelector('input[type="search"]') || a.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), a.setAttribute(y, ""), this;
  }
  u.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      clearTimeout(a._debounceTimer), a._debounceTimer = setTimeout(function() {
        a._search(a.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, u.prototype._search = function(a) {
    const i = document.getElementById(this.targetId);
    if (!i || K(i, "ln-search:change", { term: a, targetId: this.targetId }).defaultPrevented) return;
    const n = i.children;
    n.length;
    for (let e = 0; e < n.length; e++) {
      const o = n[e];
      o.removeAttribute(p), a && !o.textContent.replace(/\s+/g, " ").toLowerCase().includes(a) && o.setAttribute(p, "true");
    }
  }, u.prototype.destroy = function() {
    this.dom[s] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this.dom.removeAttribute(y), delete this.dom[s]);
  };
  function r() {
    F(function() {
      new MutationObserver(function(i) {
        i.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(n) {
            n.nodeType === 1 && I(n, d, s, u);
          }) : t.type === "attributes" && I(t.target, d, s, u);
        });
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-search");
  }
  window[s] = m, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "lnTableSort", s = "data-ln-sort", y = "data-ln-sort-active";
  if (window[d] !== void 0) return;
  function p(r) {
    g(r);
  }
  function g(r) {
    const a = Array.from(r.querySelectorAll("table"));
    r.tagName === "TABLE" && a.push(r), a.forEach(function(i) {
      if (i[d]) return;
      const t = Array.from(i.querySelectorAll("th[" + s + "]"));
      t.length && (i[d] = new m(i, t));
    });
  }
  function m(r, a) {
    this.table = r, this.ths = a, this._col = -1, this._dir = null;
    const i = this;
    return a.forEach(function(t, n) {
      t[d + "Bound"] || (t[d + "Bound"] = !0, t.addEventListener("click", function() {
        i._handleClick(n, t);
      }));
    }), this;
  }
  m.prototype._handleClick = function(r, a) {
    let i;
    this._col !== r ? i = "asc" : this._dir === "asc" ? i = "desc" : this._dir === "desc" ? i = null : i = "asc", this.ths.forEach(function(t) {
      t.removeAttribute(y);
    }), i === null ? (this._col = -1, this._dir = null) : (this._col = r, this._dir = i, a.setAttribute(y, i)), w(this.table, "ln-table:sort", {
      column: r,
      sortType: a.getAttribute(s),
      direction: i
    });
  };
  function u() {
    F(function() {
      new MutationObserver(function(a) {
        a.forEach(function(i) {
          i.type === "childList" ? i.addedNodes.forEach(function(t) {
            t.nodeType === 1 && g(t);
          }) : i.type === "attributes" && g(i.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [s] });
    }, "ln-table-sort");
  }
  window[d] = p, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-table", s = "lnTable", y = "data-ln-sort", p = "data-ln-table-empty";
  if (window[s] !== void 0) return;
  const u = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function r(t) {
    I(t, d, s, a);
  }
  function a(t) {
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
      o.preventDefault(), e._searchTerm = o.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), w(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(o) {
      e._sortCol = o.detail.direction === null ? -1 : o.detail.column, e._sortDir = o.detail.direction, e._sortType = o.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), w(t, "ln-table:sorted", {
        column: o.detail.column,
        direction: o.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(o) {
      const c = o.detail.key, f = o.detail.value;
      f ? e._columnFilters[c] = f.toLowerCase() : delete e._columnFilters[c], e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), w(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this;
  }
  a.prototype._parseRows = function() {
    const t = this.tbody.rows, n = this.ths;
    this._data = [];
    const e = [];
    for (let o = 0; o < n.length; o++)
      e[o] = n[o].getAttribute(y);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let o = 0; o < t.length; o++) {
      const c = t[o], f = [], b = [], h = [];
      for (let E = 0; E < c.cells.length; E++) {
        const k = c.cells[E], C = k.textContent.trim(), S = k.hasAttribute("data-ln-value") ? k.getAttribute("data-ln-value") : C, L = e[E];
        b[E] = C.toLowerCase(), L === "number" || L === "date" ? f[E] = parseFloat(S) || 0 : L === "string" ? f[E] = String(S) : f[E] = null, E < c.cells.length - 1 && h.push(C.toLowerCase());
      }
      this._data.push({
        sortKeys: f,
        rawTexts: b,
        html: c.outerHTML,
        searchText: h.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), w(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, n = this._columnFilters, e = Object.keys(n).length > 0, o = this.ths, c = {};
    if (e)
      for (let k = 0; k < o.length; k++) {
        const C = o[k].getAttribute("data-ln-filter-col");
        C && (c[C] = k);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(k) {
      if (t && k.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const C in n) {
          const S = c[C];
          if (S !== void 0 && k.rawTexts[S] !== n[C]) return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const f = this._sortCol, b = this._sortDir === "desc" ? -1 : 1, h = this._sortType === "number" || this._sortType === "date", E = u ? u.compare : function(k, C) {
      return k < C ? -1 : k > C ? 1 : 0;
    };
    this._filteredData.sort(function(k, C) {
      const S = k.sortKeys[f], L = C.sortKeys[f];
      return h ? (S - L) * b : E(S, L) * b;
    });
  }, a.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(n) {
      const e = document.createElement("col");
      e.style.width = n.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, a.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, a.prototype._renderAll = function() {
    const t = [], n = this._filteredData;
    for (let e = 0; e < n.length; e++) t.push(n[e].html);
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
    const t = this._filteredData, n = t.length, e = this._rowHeight;
    if (!e || !n) return;
    const c = this.table.getBoundingClientRect().top + window.scrollY, f = this.thead ? this.thead.offsetHeight : 0, b = c + f, h = window.scrollY - b, E = Math.max(0, Math.floor(h / e) - 15), k = Math.min(E + Math.ceil(window.innerHeight / e) + 30, n);
    if (E === this._vStart && k === this._vEnd) return;
    this._vStart = E, this._vEnd = k;
    const C = this.ths.length || 1, S = E * e, L = (n - k) * e, x = "";
    S > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + C + '" style="height:' + S + 'px;padding:0;border:none"></td></tr>');
    for (let O = E; O < k; O++) x += t[O].html;
    L > 0 && (x += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + C + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = x;
  }, a.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, n = this.dom.querySelector("template[" + p + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), n && e.appendChild(document.importNode(n.content, !0));
    const o = document.createElement("tr");
    o.className = "ln-table__empty", o.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(o), w(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, a.prototype.destroy = function() {
    this.dom[s] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[s]);
  };
  function i() {
    F(function() {
      new MutationObserver(function(n) {
        n.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(o) {
            o.nodeType === 1 && I(o, d, s, a);
          }) : e.type === "attributes" && I(e.target, d, s, a);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table");
  }
  window[s] = r, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    r(document.body);
  }) : r(document.body);
})();
(function() {
  const d = "data-ln-circular-progress", s = "lnCircularProgress";
  if (window[s] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", p = 36, g = 16, m = 2 * Math.PI * g;
  function u(o) {
    I(o, d, s, r);
  }
  function r(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, i.call(this), e.call(this), n.call(this), o.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  r.prototype.destroy = function() {
    this.dom[s] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[s]);
  };
  function a(o, c) {
    const f = document.createElementNS(y, o);
    for (const b in c)
      f.setAttribute(b, c[b]);
    return f;
  }
  function i() {
    this.svg = a("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = a("circle", {
      cx: p / 2,
      cy: p / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = a("circle", {
      cx: p / 2,
      cy: p / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": m,
      "stroke-dashoffset": m,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function t() {
    new MutationObserver(function(c) {
      for (const f of c)
        if (f.type === "childList")
          for (const b of f.addedNodes)
            b.nodeType === 1 && I(b, d, s, r);
        else f.type === "attributes" && I(f.target, d, s, r);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress"]
    });
  }
  t();
  function n() {
    const o = this, c = new MutationObserver(function(f) {
      for (const b of f)
        (b.attributeName === "data-ln-circular-progress" || b.attributeName === "data-ln-circular-progress-max") && e.call(o);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = c;
  }
  function e() {
    const o = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let f = c > 0 ? o / c * 100 : 0;
    f < 0 && (f = 0), f > 100 && (f = 100);
    const b = m - f / 100 * m;
    this.progressCircle.setAttribute("stroke-dashoffset", b);
    const h = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = h !== null ? h : Math.round(f) + "%", w(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: o,
      max: c,
      percentage: f
    });
  }
  window[s] = u, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    u(document.body);
  }) : u(document.body);
})();
(function() {
  const d = "data-ln-sortable", s = "lnSortable", y = "data-ln-sortable-handle";
  if (window[s] !== void 0) return;
  function p(u) {
    I(u, d, s, g);
  }
  function g(u) {
    this.dom = u, this.isEnabled = u.getAttribute(d) !== "disabled", this._dragging = null, u.setAttribute("aria-roledescription", "sortable list");
    const r = this;
    return this._onPointerDown = function(a) {
      r.isEnabled && r._handlePointerDown(a);
    }, u.addEventListener("pointerdown", this._onPointerDown), this;
  }
  g.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(d, "");
  }, g.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(d, "disabled");
  }, g.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), w(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[s]);
  }, g.prototype._handlePointerDown = function(u) {
    let r = u.target.closest("[" + y + "]"), a;
    if (r) {
      for (a = r; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (a = u.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      r = a;
    }
    const t = Array.from(this.dom.children).indexOf(a);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: t
    }).defaultPrevented) return;
    u.preventDefault(), r.setPointerCapture(u.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), w(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: t
    });
    const e = this, o = function(f) {
      e._handlePointerMove(f);
    }, c = function(f) {
      e._handlePointerEnd(f), r.removeEventListener("pointermove", o), r.removeEventListener("pointerup", c), r.removeEventListener("pointercancel", c);
    };
    r.addEventListener("pointermove", o), r.addEventListener("pointerup", c), r.addEventListener("pointercancel", c);
  }, g.prototype._handlePointerMove = function(u) {
    if (!this._dragging) return;
    const r = Array.from(this.dom.children), a = this._dragging;
    for (const i of r)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const i of r) {
      if (i === a) continue;
      const t = i.getBoundingClientRect(), n = t.top + t.height / 2;
      if (u.clientY >= t.top && u.clientY < n) {
        i.classList.add("ln-sortable--drop-before");
        break;
      } else if (u.clientY >= n && u.clientY <= t.bottom) {
        i.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, g.prototype._handlePointerEnd = function(u) {
    if (!this._dragging) return;
    const r = this._dragging, a = Array.from(this.dom.children), i = a.indexOf(r);
    let t = null, n = null;
    for (const e of a) {
      if (e.classList.contains("ln-sortable--drop-before")) {
        t = e, n = "before";
        break;
      }
      if (e.classList.contains("ln-sortable--drop-after")) {
        t = e, n = "after";
        break;
      }
    }
    for (const e of a)
      e.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (r.classList.remove("ln-sortable--dragging"), r.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), t && t !== r) {
      n === "before" ? this.dom.insertBefore(r, t) : this.dom.insertBefore(r, t.nextElementSibling);
      const o = Array.from(this.dom.children).indexOf(r);
      w(this.dom, "ln-sortable:reordered", {
        item: r,
        oldIndex: i,
        newIndex: o
      });
    }
    this._dragging = null;
  };
  function m() {
    F(function() {
      new MutationObserver(function(r) {
        for (let a = 0; a < r.length; a++) {
          const i = r[a];
          if (i.type === "childList")
            for (let t = 0; t < i.addedNodes.length; t++) {
              const n = i.addedNodes[t];
              n.nodeType === 1 && I(n, d, s, g);
            }
          else if (i.type === "attributes") {
            const t = i.target, n = t[s];
            if (n) {
              const e = t.getAttribute(d) !== "disabled";
              e !== n.isEnabled && (n.isEnabled = e, w(t, e ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: t }));
            } else
              I(t, d, s, g);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-sortable");
  }
  window[s] = p, m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-confirm", s = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[s] !== void 0) return;
  function g(a) {
    I(a, d, s, m);
  }
  function m(a) {
    this.dom = a, this.confirming = !1, this.originalText = a.textContent.trim(), this.confirmText = a.getAttribute(d) || "Confirm?", this.revertTimer = null;
    const i = this;
    return this._onClick = function(t) {
      i.confirming ? i._reset() : (t.preventDefault(), t.stopImmediatePropagation(), i._enterConfirm());
    }, a.addEventListener("click", this._onClick), this;
  }
  m.prototype._getTimeout = function() {
    const a = parseFloat(this.dom.getAttribute(y));
    return isNaN(a) || a <= 0 ? 3 : a;
  }, m.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.dom.className.match(/ln-icon-/) && this.originalText === "" ? (this.isIconButton = !0, this.originalIconClass = Array.from(this.dom.classList).find(function(a) {
      return a.startsWith("ln-icon-");
    }), this.originalIconClass && this.dom.classList.remove(this.originalIconClass), this.dom.classList.add("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), w(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, m.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const a = this, i = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      a._reset();
    }, i);
  }, m.prototype._reset = function() {
    this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton ? (this.dom.classList.remove("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.originalIconClass && this.dom.classList.add(this.originalIconClass), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1) : this.dom.textContent = this.originalText, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, m.prototype.destroy = function() {
    this.dom[s] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[s]);
  };
  function u(a) {
    const i = a[s];
    !i || !i.confirming || i._startTimer();
  }
  function r() {
    F(function() {
      new MutationObserver(function(i) {
        for (let t = 0; t < i.length; t++) {
          const n = i[t];
          if (n.type === "childList")
            for (let e = 0; e < n.addedNodes.length; e++) {
              const o = n.addedNodes[e];
              o.nodeType === 1 && I(o, d, s, m);
            }
          else n.type === "attributes" && (n.attributeName === y && n.target[s] ? u(n.target) : I(n.target, d, s, m));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, y]
      });
    }, "ln-confirm");
  }
  window[s] = g, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const d = "data-ln-translations", s = "lnTranslations";
  if (window[s] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(u) {
    I(u, d, s, g);
  }
  function g(u) {
    this.dom = u, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = u.getAttribute(d + "-default") || "", this.badgesEl = u.querySelector("[" + d + "-active]"), this.menuEl = u.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const r = u.getAttribute(d + "-locales");
    if (this.locales = y, r)
      try {
        this.locales = JSON.parse(r);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const a = this;
    return this._onRequestAdd = function(i) {
      i.detail && i.detail.lang && a.addLanguage(i.detail.lang);
    }, this._onRequestRemove = function(i) {
      i.detail && i.detail.lang && a.removeLanguage(i.detail.lang);
    }, u.addEventListener("ln-translations:request-add", this._onRequestAdd), u.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  g.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const u = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const r of u) {
      const a = r.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const i of a)
        i.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, g.prototype._detectExisting = function() {
    const u = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const r of u) {
      const a = r.getAttribute("data-ln-translatable-lang");
      a && a !== this.defaultLang && this.activeLanguages.add(a);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, g.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const u = this;
    let r = 0;
    for (const i in this.locales) {
      if (!this.locales.hasOwnProperty(i) || this.activeLanguages.has(i)) continue;
      r++;
      const t = tt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const n = t.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", i), n.textContent = this.locales[i], n.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), u.menuEl.getAttribute("data-ln-toggle") === "open" && u.menuEl.setAttribute("data-ln-toggle", "close"), u.addLanguage(i));
      }), this.menuEl.appendChild(t);
    }
    const a = this.dom.querySelector("[" + d + "-add]");
    a && (a.style.display = r === 0 ? "none" : "");
  }, g.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const u = this;
    this.activeLanguages.forEach(function(r) {
      const a = tt("ln-translations-badge", "ln-translations");
      if (!a) return;
      const i = a.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", r);
      const t = i.querySelector("span");
      t.textContent = u.locales[r] || r.toUpperCase();
      const n = i.querySelector("button");
      n.setAttribute("aria-label", "Remove " + (u.locales[r] || r.toUpperCase())), n.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), u.removeLanguage(r));
      }), u.badgesEl.appendChild(a);
    });
  }, g.prototype.addLanguage = function(u, r) {
    if (this.activeLanguages.has(u)) return;
    const a = this.locales[u] || u;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: u,
      langName: a
    }).defaultPrevented) return;
    this.activeLanguages.add(u), r = r || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of t) {
      const e = n.getAttribute("data-ln-translatable"), o = n.getAttribute("data-ln-translations-prefix") || "", c = n.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!c) continue;
      const f = c.cloneNode(!1);
      o ? f.name = o + "[trans][" + u + "][" + e + "]" : f.name = "trans[" + u + "][" + e + "]", f.value = r[e] !== void 0 ? r[e] : "", f.removeAttribute("id"), f.placeholder = a + " translation", f.setAttribute("data-ln-translatable-lang", u);
      const b = n.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), h = b.length > 0 ? b[b.length - 1] : c;
      h.parentNode.insertBefore(f, h.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: u,
      langName: a
    });
  }, g.prototype.removeLanguage = function(u) {
    if (!this.activeLanguages.has(u) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: u
    }).defaultPrevented) return;
    const a = this.dom.querySelectorAll('[data-ln-translatable-lang="' + u + '"]');
    for (const i of a)
      i.parentNode.removeChild(i);
    this.activeLanguages.delete(u), this._updateDropdown(), this._updateBadges(), w(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: u
    });
  }, g.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, g.prototype.hasLanguage = function(u) {
    return this.activeLanguages.has(u);
  }, g.prototype.destroy = function() {
    if (!this.dom[s]) return;
    const u = this.defaultLang, r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of r)
      a.getAttribute("data-ln-translatable-lang") !== u && a.parentNode.removeChild(a);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[s];
  };
  function m() {
    F(function() {
      new MutationObserver(function(r) {
        for (const a of r)
          if (a.type === "childList")
            for (const i of a.addedNodes)
              i.nodeType === 1 && I(i, d, s, g);
          else a.type === "attributes" && I(a.target, d, s, g);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-translations");
  }
  window[s] = p, m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-autosave", s = "lnAutosave", y = "data-ln-autosave-clear", p = "ln-autosave:";
  if (window[s] !== void 0) return;
  function g(n) {
    I(n, d, s, m);
  }
  function m(n) {
    const e = u(n);
    if (!e) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = e;
    const o = this;
    return this._onFocusout = function(c) {
      const f = c.target;
      r(f) && f.name && o.save();
    }, this._onChange = function(c) {
      const f = c.target;
      r(f) && f.name && o.save();
    }, this._onSubmit = function() {
      o.clear();
    }, this._onReset = function() {
      o.clear();
    }, this._onClearClick = function(c) {
      c.target.closest("[" + y + "]") && o.clear();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  m.prototype.save = function() {
    const n = a(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(n));
    } catch {
      return;
    }
    w(this.dom, "ln-autosave:saved", { target: this.dom, data: n });
  }, m.prototype.restore = function() {
    let n;
    try {
      n = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!n) return;
    let e;
    try {
      e = JSON.parse(n);
    } catch {
      return;
    }
    K(this.dom, "ln-autosave:before-restore", { target: this.dom, data: e }).defaultPrevented || (i(this.dom, e), w(this.dom, "ln-autosave:restored", { target: this.dom, data: e }));
  }, m.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    w(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, m.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), w(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function u(n) {
    const o = n.getAttribute(d) || n.id;
    return o ? p + window.location.pathname + ":" + o : null;
  }
  function r(n) {
    const e = n.tagName;
    return e === "INPUT" || e === "TEXTAREA" || e === "SELECT";
  }
  function a(n) {
    const e = {}, o = n.elements;
    for (let c = 0; c < o.length; c++) {
      const f = o[c];
      if (!(!f.name || f.disabled || f.type === "file" || f.type === "submit" || f.type === "button"))
        if (f.type === "checkbox")
          e[f.name] || (e[f.name] = []), f.checked && e[f.name].push(f.value);
        else if (f.type === "radio")
          f.checked && (e[f.name] = f.value);
        else if (f.type === "select-multiple") {
          e[f.name] = [];
          for (let b = 0; b < f.options.length; b++)
            f.options[b].selected && e[f.name].push(f.options[b].value);
        } else
          e[f.name] = f.value;
    }
    return e;
  }
  function i(n, e) {
    const o = n.elements, c = [];
    for (let f = 0; f < o.length; f++) {
      const b = o[f];
      if (!b.name || !(b.name in e) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
      const h = e[b.name];
      if (b.type === "checkbox")
        b.checked = Array.isArray(h) && h.indexOf(b.value) !== -1, c.push(b);
      else if (b.type === "radio")
        b.checked = b.value === h, c.push(b);
      else if (b.type === "select-multiple") {
        if (Array.isArray(h))
          for (let E = 0; E < b.options.length; E++)
            b.options[E].selected = h.indexOf(b.options[E].value) !== -1;
        c.push(b);
      } else
        b.value = h, c.push(b);
    }
    for (let f = 0; f < c.length; f++)
      c[f].dispatchEvent(new Event("input", { bubbles: !0 })), c[f].dispatchEvent(new Event("change", { bubbles: !0 })), c[f].lnSelect && c[f].lnSelect.setValue && c[f].lnSelect.setValue(e[c[f].name]);
  }
  function t() {
    F(function() {
      new MutationObserver(function(e) {
        for (let o = 0; o < e.length; o++)
          if (e[o].type === "childList") {
            const c = e[o].addedNodes;
            for (let f = 0; f < c.length; f++)
              c[f].nodeType === 1 && I(c[f], d, s, m);
          } else e[o].type === "attributes" && I(e[o].target, d, s, m);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-autosave");
  }
  window[s] = g, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const d = "data-ln-autoresize", s = "lnAutoresize";
  if (window[s] !== void 0) return;
  function y(m) {
    I(m, d, s, p);
  }
  function p(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const u = this;
    return this._onInput = function() {
      u._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  p.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, p.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[s]);
  };
  function g() {
    F(function() {
      new MutationObserver(function(u) {
        for (const r of u)
          if (r.type === "childList")
            for (const a of r.addedNodes)
              a.nodeType === 1 && I(a, d, s, p);
          else r.type === "attributes" && I(r.target, d, s, p);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-autoresize");
  }
  window[s] = y, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const d = "data-ln-validate", s = "lnValidate", y = "data-ln-validate-errors", p = "data-ln-validate-error", g = "ln-validate-valid", m = "ln-validate-invalid", u = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[s] !== void 0) return;
  function r(t) {
    I(t, d, s, a);
  }
  function a(t) {
    this.dom = t, this._touched = !1;
    const n = this, e = t.tagName, o = t.type, c = e === "SELECT" || o === "checkbox" || o === "radio";
    return this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, c || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), this;
  }
  a.prototype.validate = function() {
    const t = this.dom, n = t.validity, e = t.checkValidity(), o = t.closest(".form-element");
    if (o) {
      const f = o.querySelector("[" + y + "]");
      if (f) {
        const b = f.querySelectorAll("[" + p + "]");
        for (let h = 0; h < b.length; h++) {
          const E = b[h].getAttribute(p), k = u[E];
          k && n[k] ? b[h].classList.remove("hidden") : b[h].classList.add("hidden");
        }
      }
    }
    return t.classList.toggle(g, e), t.classList.toggle(m, !e), w(t, e ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), e;
  }, a.prototype.reset = function() {
    this._touched = !1, this.dom.classList.remove(g, m);
    const t = this.dom.closest(".form-element");
    if (t) {
      const n = t.querySelectorAll("[" + p + "]");
      for (let e = 0; e < n.length; e++)
        n[e].classList.add("hidden");
    }
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity();
    }
  }), a.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.classList.remove(g, m), w(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function i() {
    F(function() {
      new MutationObserver(function(n) {
        for (let e = 0; e < n.length; e++)
          if (n[e].type === "childList") {
            const o = n[e].addedNodes;
            for (let c = 0; c < o.length; c++)
              o[c].nodeType === 1 && I(o[c], d, s, a);
          } else n[e].type === "attributes" && I(n[e].target, d, s, a);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-validate");
  }
  window[s] = r, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    r(document.body);
  }) : r(document.body);
})();
(function() {
  const d = "data-ln-form", s = "lnForm", y = "data-ln-form-auto", p = "data-ln-form-debounce", g = "data-ln-validate", m = "lnValidate";
  if (window[s] !== void 0) return;
  function u(i) {
    I(i, d, s, r);
  }
  function r(i) {
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
    }, i.addEventListener("ln-validate:valid", this._onValid), i.addEventListener("ln-validate:invalid", this._onInvalid), i.addEventListener("submit", this._onSubmit), i.addEventListener("ln-form:fill", this._onFill), i.addEventListener("ln-form:reset", this._onFormReset), i.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, i.hasAttribute(y)) {
      const n = parseInt(i.getAttribute(p)) || 0;
      this._onAutoInput = function() {
        n > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, n)) : t.submit();
      }, i.addEventListener("input", this._onAutoInput), i.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  r.prototype._updateSubmitButton = function() {
    const i = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!i.length) return;
    const t = this.dom.querySelectorAll("[" + g + "]");
    let n = !1;
    if (t.length > 0) {
      let e = !1, o = !1;
      for (let c = 0; c < t.length; c++) {
        const f = t[c][m];
        f && f._touched && (e = !0), t[c].checkValidity() || (o = !0);
      }
      n = o || !e;
    }
    for (let e = 0; e < i.length; e++)
      i[e].disabled = n;
  }, r.prototype._serialize = function() {
    const i = {}, t = this.dom.elements;
    for (let n = 0; n < t.length; n++) {
      const e = t[n];
      if (!(!e.name || e.disabled || e.type === "file" || e.type === "submit" || e.type === "button"))
        if (e.type === "checkbox")
          i[e.name] || (i[e.name] = []), e.checked && i[e.name].push(e.value);
        else if (e.type === "radio")
          e.checked && (i[e.name] = e.value);
        else if (e.type === "select-multiple") {
          i[e.name] = [];
          for (let o = 0; o < e.options.length; o++)
            e.options[o].selected && i[e.name].push(e.options[o].value);
        } else
          i[e.name] = e.value;
    }
    return i;
  }, r.prototype.fill = function(i) {
    const t = this.dom.elements, n = [];
    for (let e = 0; e < t.length; e++) {
      const o = t[e];
      if (!o.name || !(o.name in i) || o.type === "file" || o.type === "submit" || o.type === "button") continue;
      const c = i[o.name];
      if (o.type === "checkbox")
        o.checked = Array.isArray(c) ? c.indexOf(o.value) !== -1 : !!c, n.push(o);
      else if (o.type === "radio")
        o.checked = o.value === String(c), n.push(o);
      else if (o.type === "select-multiple") {
        if (Array.isArray(c))
          for (let f = 0; f < o.options.length; f++)
            o.options[f].selected = c.indexOf(o.options[f].value) !== -1;
        n.push(o);
      } else
        o.value = c, n.push(o);
    }
    for (let e = 0; e < n.length; e++)
      n[e].dispatchEvent(new Event("input", { bubbles: !0 })), n[e].dispatchEvent(new Event("change", { bubbles: !0 }));
  }, r.prototype.submit = function() {
    const i = this.dom.querySelectorAll("[" + g + "]");
    let t = !0;
    for (let e = 0; e < i.length; e++) {
      const o = i[e][m];
      o && (o.validate() || (t = !1));
    }
    if (!t) return;
    const n = this._serialize();
    w(this.dom, "ln-form:submit", { data: n });
  }, r.prototype.reset = function() {
    this.dom.reset(), this._resetValidation();
  }, r.prototype._resetValidation = function() {
    this._invalidFields.clear();
    const i = this.dom.querySelectorAll("[" + g + "]");
    for (let t = 0; t < i.length; t++) {
      const n = i[t][m];
      n && n.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      const i = this.dom.querySelectorAll("[" + g + "]");
      for (let t = 0; t < i.length; t++)
        if (!i[t].checkValidity()) return !1;
      return !0;
    }
  }), r.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), w(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[s]);
  };
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        for (let n = 0; n < t.length; n++)
          if (t[n].type === "childList") {
            const e = t[n].addedNodes;
            for (let o = 0; o < e.length; o++)
              e[o].nodeType === 1 && I(e[o], d, s, r);
          } else t[n].type === "attributes" && I(t[n].target, d, s, r);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-form");
  }
  window[s] = u, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    u(document.body);
  }) : u(document.body);
})();
(function() {
  const d = "data-ln-time", s = "lnTime";
  if (window[s] !== void 0) return;
  const y = {}, p = {};
  function g(S) {
    return S.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function m(S, L) {
    const x = (S || "") + "|" + JSON.stringify(L);
    return y[x] || (y[x] = new Intl.DateTimeFormat(S, L)), y[x];
  }
  function u(S) {
    const L = S || "";
    return p[L] || (p[L] = new Intl.RelativeTimeFormat(S, { numeric: "auto", style: "narrow" })), p[L];
  }
  const r = /* @__PURE__ */ new Set();
  let a = null;
  function i() {
    a || (a = setInterval(n, 6e4));
  }
  function t() {
    a && (clearInterval(a), a = null);
  }
  function n() {
    for (const S of r) {
      if (!document.body.contains(S.dom)) {
        r.delete(S);
        continue;
      }
      h(S);
    }
    r.size === 0 && t();
  }
  function e(S, L) {
    return m(L, { dateStyle: "long", timeStyle: "short" }).format(S);
  }
  function o(S, L) {
    const x = /* @__PURE__ */ new Date(), O = { month: "short", day: "numeric" };
    return S.getFullYear() !== x.getFullYear() && (O.year = "numeric"), m(L, O).format(S);
  }
  function c(S, L) {
    return m(L, { dateStyle: "medium" }).format(S);
  }
  function f(S, L) {
    return m(L, { timeStyle: "short" }).format(S);
  }
  function b(S, L) {
    const x = Math.floor(Date.now() / 1e3), N = Math.floor(S.getTime() / 1e3) - x, H = Math.abs(N);
    if (H < 10) return u(L).format(0, "second");
    let B, V;
    if (H < 60)
      B = "second", V = N;
    else if (H < 3600)
      B = "minute", V = Math.round(N / 60);
    else if (H < 86400)
      B = "hour", V = Math.round(N / 3600);
    else if (H < 604800)
      B = "day", V = Math.round(N / 86400);
    else if (H < 2592e3)
      B = "week", V = Math.round(N / 604800);
    else
      return o(S, L);
    return u(L).format(V, B);
  }
  function h(S) {
    const L = S.dom.getAttribute("datetime");
    if (!L) return;
    const x = Number(L);
    if (isNaN(x)) return;
    const O = new Date(x * 1e3), N = S.dom.getAttribute(d) || "short", H = g(S.dom);
    let B;
    switch (N) {
      case "relative":
        B = b(O, H);
        break;
      case "full":
        B = e(O, H);
        break;
      case "date":
        B = c(O, H);
        break;
      case "time":
        B = f(O, H);
        break;
      default:
        B = o(O, H);
        break;
    }
    S.dom.textContent = B, N !== "full" && (S.dom.title = e(O, H));
  }
  function E(S) {
    return this.dom = S, h(this), S.getAttribute(d) === "relative" && (r.add(this), i()), this;
  }
  E.prototype.render = function() {
    h(this);
  }, E.prototype.destroy = function() {
    r.delete(this), r.size === 0 && t(), delete this.dom[s];
  };
  function k(S) {
    I(S, d, s, E);
  }
  function C() {
    F(function() {
      new MutationObserver(function(L) {
        for (const x of L)
          if (x.type === "childList")
            for (const O of x.addedNodes)
              O.nodeType === 1 && I(O, d, s, E);
          else if (x.type === "attributes") {
            const O = x.target;
            O[s] ? (O.getAttribute(d) === "relative" ? (r.add(O[s]), i()) : (r.delete(O[s]), r.size === 0 && t()), h(O[s])) : I(O, d, s, E);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, "datetime"]
      });
    }, "ln-time");
  }
  C(), window[s] = k, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    k(document.body);
  }) : k(document.body);
})();
(function() {
  const d = "data-ln-store", s = "lnStore";
  if (window[s] !== void 0) return;
  const y = "ln_app_cache", p = "_meta", g = "1.0";
  let m = null, u = null;
  const r = {};
  function a() {
    const l = document.querySelectorAll("[" + d + "]"), v = {};
    for (let _ = 0; _ < l.length; _++) {
      const T = l[_].getAttribute(d);
      T && (v[T] = {
        indexes: (l[_].getAttribute("data-ln-store-indexes") || "").split(",").map(function(D) {
          return D.trim();
        }).filter(Boolean)
      });
    }
    return v;
  }
  function i() {
    return u || (u = new Promise(function(l, v) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), l(null);
        return;
      }
      const _ = a(), T = Object.keys(_), D = indexedDB.open(y);
      D.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), l(null);
      }, D.onsuccess = function(A) {
        const M = A.target.result, q = Array.from(M.objectStoreNames);
        let U = !1;
        q.indexOf(p) === -1 && (U = !0);
        for (let Z = 0; Z < T.length; Z++)
          if (q.indexOf(T[Z]) === -1) {
            U = !0;
            break;
          }
        if (!U) {
          t(M), m = M, l(M);
          return;
        }
        const it = M.version;
        M.close();
        const rt = indexedDB.open(y, it + 1);
        rt.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, rt.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), l(null);
        }, rt.onupgradeneeded = function(Z) {
          const J = Z.target.result;
          J.objectStoreNames.contains(p) || J.createObjectStore(p, { keyPath: "key" });
          for (let at = 0; at < T.length; at++) {
            const lt = T[at];
            if (!J.objectStoreNames.contains(lt)) {
              const ut = J.createObjectStore(lt, { keyPath: "id" }), ct = _[lt].indexes;
              for (let st = 0; st < ct.length; st++)
                ut.createIndex(ct[st], ct[st], { unique: !1 });
            }
          }
        }, rt.onsuccess = function(Z) {
          const J = Z.target.result;
          t(J), m = J, l(J);
        };
      };
    }), u);
  }
  function t(l) {
    l.onversionchange = function() {
      l.close(), m = null, u = null;
    };
  }
  function n() {
    return m ? Promise.resolve(m) : (u = null, i());
  }
  function e(l, v) {
    return n().then(function(_) {
      return _ ? _.transaction(l, v).objectStore(l) : null;
    });
  }
  function o(l) {
    return new Promise(function(v, _) {
      l.onsuccess = function() {
        v(l.result);
      }, l.onerror = function() {
        _(l.error);
      };
    });
  }
  function c(l) {
    return e(l, "readonly").then(function(v) {
      return v ? o(v.getAll()) : [];
    });
  }
  function f(l, v) {
    return e(l, "readonly").then(function(_) {
      return _ ? o(_.get(v)) : null;
    });
  }
  function b(l, v) {
    return e(l, "readwrite").then(function(_) {
      if (_)
        return o(_.put(v));
    });
  }
  function h(l, v) {
    return e(l, "readwrite").then(function(_) {
      if (_)
        return o(_.delete(v));
    });
  }
  function E(l) {
    return e(l, "readwrite").then(function(v) {
      if (v)
        return o(v.clear());
    });
  }
  function k(l) {
    return e(l, "readonly").then(function(v) {
      return v ? o(v.count()) : 0;
    });
  }
  function C(l) {
    return e(p, "readonly").then(function(v) {
      return v ? o(v.get(l)) : null;
    });
  }
  function S(l, v) {
    return e(p, "readwrite").then(function(_) {
      if (_)
        return v.key = l, o(_.put(v));
    });
  }
  function L(l) {
    this.dom = l, this._name = l.getAttribute(d), this._endpoint = l.getAttribute("data-ln-store-endpoint") || "";
    const v = l.getAttribute("data-ln-store-stale");
    this._staleThreshold = v === "never" || v === "-1" ? -1 : parseInt(v, 10) || 300, this._searchFields = (l.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(T) {
      return T.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, r[this._name] = this;
    const _ = this;
    return x(_), V(_), this;
  }
  function x(l) {
    l._handlers = {
      create: function(v) {
        O(l, v.detail);
      },
      update: function(v) {
        N(l, v.detail);
      },
      delete: function(v) {
        H(l, v.detail);
      },
      bulkDelete: function(v) {
        B(l, v.detail);
      }
    }, l.dom.addEventListener("ln-store:request-create", l._handlers.create), l.dom.addEventListener("ln-store:request-update", l._handlers.update), l.dom.addEventListener("ln-store:request-delete", l._handlers.delete), l.dom.addEventListener("ln-store:request-bulk-delete", l._handlers.bulkDelete);
  }
  function O(l, v) {
    const _ = v.data || {}, T = "_temp_" + crypto.randomUUID(), D = Object.assign({}, _, { id: T });
    b(l._name, D).then(function() {
      return l.totalCount++, w(l.dom, "ln-store:created", {
        store: l._name,
        record: D,
        tempId: T
      }), fetch(l._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(_)
      });
    }).then(function(A) {
      if (!A.ok) throw new Error("HTTP " + A.status);
      return A.json();
    }).then(function(A) {
      return h(l._name, T).then(function() {
        return b(l._name, A);
      }).then(function() {
        w(l.dom, "ln-store:confirmed", {
          store: l._name,
          record: A,
          tempId: T,
          action: "create"
        });
      });
    }).catch(function(A) {
      h(l._name, T).then(function() {
        l.totalCount--, w(l.dom, "ln-store:reverted", {
          store: l._name,
          record: D,
          action: "create",
          error: A.message
        });
      });
    });
  }
  function N(l, v) {
    const _ = v.id, T = v.data || {}, D = v.expected_version;
    let A = null;
    f(l._name, _).then(function(M) {
      if (!M) throw new Error("Record not found: " + _);
      A = Object.assign({}, M);
      const q = Object.assign({}, M, T);
      return b(l._name, q).then(function() {
        return w(l.dom, "ln-store:updated", {
          store: l._name,
          record: q,
          previous: A
        }), q;
      });
    }).then(function(M) {
      const q = Object.assign({}, T);
      return D && (q.expected_version = D), fetch(l._endpoint + "/" + _, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(q)
      });
    }).then(function(M) {
      if (M.status === 409)
        return M.json().then(function(q) {
          return b(l._name, A).then(function() {
            w(l.dom, "ln-store:conflict", {
              store: l._name,
              local: A,
              remote: q.current || q,
              field_diffs: q.field_diffs || null
            });
          });
        });
      if (!M.ok) throw new Error("HTTP " + M.status);
      return M.json().then(function(q) {
        return b(l._name, q).then(function() {
          w(l.dom, "ln-store:confirmed", {
            store: l._name,
            record: q,
            action: "update"
          });
        });
      });
    }).catch(function(M) {
      A && b(l._name, A).then(function() {
        w(l.dom, "ln-store:reverted", {
          store: l._name,
          record: A,
          action: "update",
          error: M.message
        });
      });
    });
  }
  function H(l, v) {
    const _ = v.id;
    let T = null;
    f(l._name, _).then(function(D) {
      if (D)
        return T = Object.assign({}, D), h(l._name, _).then(function() {
          return l.totalCount--, w(l.dom, "ln-store:deleted", {
            store: l._name,
            id: _
          }), fetch(l._endpoint + "/" + _, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(D) {
      if (!D || !D.ok) throw new Error("HTTP " + (D ? D.status : "unknown"));
      w(l.dom, "ln-store:confirmed", {
        store: l._name,
        record: T,
        action: "delete"
      });
    }).catch(function(D) {
      T && b(l._name, T).then(function() {
        l.totalCount++, w(l.dom, "ln-store:reverted", {
          store: l._name,
          record: T,
          action: "delete",
          error: D.message
        });
      });
    });
  }
  function B(l, v) {
    const _ = v.ids || [];
    if (_.length === 0) return;
    let T = [];
    const D = _.map(function(A) {
      return f(l._name, A);
    });
    Promise.all(D).then(function(A) {
      return T = A.filter(Boolean), nt(l._name, _).then(function() {
        return l.totalCount -= _.length, w(l.dom, "ln-store:deleted", {
          store: l._name,
          ids: _
        }), fetch(l._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: _ })
        });
      });
    }).then(function(A) {
      if (!A.ok) throw new Error("HTTP " + A.status);
      w(l.dom, "ln-store:confirmed", {
        store: l._name,
        record: null,
        ids: _,
        action: "bulk-delete"
      });
    }).catch(function(A) {
      T.length > 0 && Q(l._name, T).then(function() {
        l.totalCount += T.length, w(l.dom, "ln-store:reverted", {
          store: l._name,
          record: null,
          ids: _,
          action: "bulk-delete",
          error: A.message
        });
      });
    });
  }
  function V(l) {
    i().then(function() {
      return C(l._name);
    }).then(function(v) {
      v && v.schema_version === g ? (l.lastSyncedAt = v.last_synced_at || null, l.totalCount = v.record_count || 0, l.totalCount > 0 ? (l.isLoaded = !0, w(l.dom, "ln-store:ready", {
        store: l._name,
        count: l.totalCount,
        source: "cache"
      }), et(l) && $(l)) : Y(l)) : v && v.schema_version !== g ? E(l._name).then(function() {
        return S(l._name, {
          schema_version: g,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        Y(l);
      }) : Y(l);
    });
  }
  function et(l) {
    return l._staleThreshold === -1 ? !1 : l.lastSyncedAt ? Math.floor(Date.now() / 1e3) - l.lastSyncedAt > l._staleThreshold : !0;
  }
  function Y(l) {
    return l._endpoint ? (l.isSyncing = !0, l._abortController = new AbortController(), fetch(l._endpoint, { signal: l._abortController.signal }).then(function(v) {
      if (!v.ok) throw new Error("HTTP " + v.status);
      return v.json();
    }).then(function(v) {
      const _ = v.data || [], T = v.synced_at || Math.floor(Date.now() / 1e3);
      return Q(l._name, _).then(function() {
        return S(l._name, {
          schema_version: g,
          last_synced_at: T,
          record_count: _.length
        });
      }).then(function() {
        l.isLoaded = !0, l.isSyncing = !1, l.lastSyncedAt = T, l.totalCount = _.length, l._abortController = null, w(l.dom, "ln-store:loaded", {
          store: l._name,
          count: _.length
        }), w(l.dom, "ln-store:ready", {
          store: l._name,
          count: _.length,
          source: "server"
        });
      });
    }).catch(function(v) {
      l.isSyncing = !1, l._abortController = null, v.name !== "AbortError" && (l.isLoaded ? w(l.dom, "ln-store:offline", { store: l._name }) : w(l.dom, "ln-store:error", {
        store: l._name,
        action: "full-load",
        error: v.message,
        status: null
      }));
    })) : Promise.resolve();
  }
  function $(l) {
    if (!l._endpoint || !l.lastSyncedAt) return Y(l);
    l.isSyncing = !0, l._abortController = new AbortController();
    const v = l._endpoint + (l._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + l.lastSyncedAt;
    return fetch(v, { signal: l._abortController.signal }).then(function(_) {
      if (!_.ok) throw new Error("HTTP " + _.status);
      return _.json();
    }).then(function(_) {
      const T = _.data || [], D = _.deleted || [], A = _.synced_at || Math.floor(Date.now() / 1e3), M = T.length > 0 || D.length > 0;
      let q = Promise.resolve();
      return T.length > 0 && (q = q.then(function() {
        return Q(l._name, T);
      })), D.length > 0 && (q = q.then(function() {
        return nt(l._name, D);
      })), q.then(function() {
        return k(l._name);
      }).then(function(U) {
        return l.totalCount = U, S(l._name, {
          schema_version: g,
          last_synced_at: A,
          record_count: U
        });
      }).then(function() {
        l.isSyncing = !1, l.lastSyncedAt = A, l._abortController = null, M ? w(l.dom, "ln-store:synced", {
          store: l._name,
          added: T.length,
          deleted: D.length
        }) : w(l.dom, "ln-store:unchanged", {
          store: l._name
        });
      });
    }).catch(function(_) {
      l.isSyncing = !1, l._abortController = null, _.name !== "AbortError" && w(l.dom, "ln-store:offline", { store: l._name });
    });
  }
  function Q(l, v) {
    return n().then(function(_) {
      if (_)
        return new Promise(function(T, D) {
          const A = _.transaction(l, "readwrite"), M = A.objectStore(l);
          for (let q = 0; q < v.length; q++)
            M.put(v[q]);
          A.oncomplete = function() {
            T();
          }, A.onerror = function() {
            D(A.error);
          };
        });
    });
  }
  function nt(l, v) {
    return n().then(function(_) {
      if (_)
        return new Promise(function(T, D) {
          const A = _.transaction(l, "readwrite"), M = A.objectStore(l);
          for (let q = 0; q < v.length; q++)
            M.delete(v[q]);
          A.oncomplete = function() {
            T();
          }, A.onerror = function() {
            D(A.error);
          };
        });
    });
  }
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState !== "visible") return;
    const l = Object.keys(r);
    for (let v = 0; v < l.length; v++) {
      const _ = r[l[v]];
      _.isLoaded && !_.isSyncing && (_._staleThreshold === -1 || et(_)) && $(_);
    }
  });
  const R = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function P(l, v) {
    if (!v || !v.field) return l;
    const _ = v.field, T = v.direction === "desc";
    return l.slice().sort(function(D, A) {
      const M = D[_], q = A[_];
      if (M == null && q == null) return 0;
      if (M == null) return T ? 1 : -1;
      if (q == null) return T ? -1 : 1;
      let U;
      return typeof M == "string" && typeof q == "string" ? U = R.compare(M, q) : U = M < q ? -1 : M > q ? 1 : 0, T ? -U : U;
    });
  }
  function j(l, v) {
    if (!v) return l;
    const _ = Object.keys(v);
    return _.length === 0 ? l : l.filter(function(T) {
      for (let D = 0; D < _.length; D++) {
        const A = _[D], M = v[A];
        if (!Array.isArray(M) || M.length === 0) continue;
        const q = T[A];
        let U = !1;
        for (let it = 0; it < M.length; it++)
          if (String(q) === String(M[it])) {
            U = !0;
            break;
          }
        if (!U) return !1;
      }
      return !0;
    });
  }
  function G(l, v, _) {
    if (!v || !_ || _.length === 0) return l;
    const T = v.toLowerCase();
    return l.filter(function(D) {
      for (let A = 0; A < _.length; A++) {
        const M = D[_[A]];
        if (M != null && String(M).toLowerCase().indexOf(T) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function z(l, v, _) {
    if (l.length === 0) return 0;
    if (_ === "count") return l.length;
    let T = 0, D = 0;
    for (let A = 0; A < l.length; A++) {
      const M = parseFloat(l[A][v]);
      isNaN(M) || (T += M, D++);
    }
    return _ === "sum" ? T : _ === "avg" && D > 0 ? T / D : 0;
  }
  L.prototype.getAll = function(l) {
    const v = this;
    return l = l || {}, c(v._name).then(function(_) {
      const T = _.length;
      l.filters && (_ = j(_, l.filters)), l.search && (_ = G(_, l.search, v._searchFields));
      const D = _.length;
      if (l.sort && (_ = P(_, l.sort)), l.offset || l.limit) {
        const A = l.offset || 0, M = l.limit || _.length;
        _ = _.slice(A, A + M);
      }
      return {
        data: _,
        total: T,
        filtered: D
      };
    });
  }, L.prototype.getById = function(l) {
    return f(this._name, l);
  }, L.prototype.count = function(l) {
    const v = this;
    return l ? c(v._name).then(function(_) {
      return j(_, l).length;
    }) : k(v._name);
  }, L.prototype.aggregate = function(l, v) {
    return c(this._name).then(function(T) {
      return z(T, l, v);
    });
  }, L.prototype.forceSync = function() {
    return $(this);
  }, L.prototype.fullReload = function() {
    const l = this;
    return E(l._name).then(function() {
      return l.isLoaded = !1, l.lastSyncedAt = null, l.totalCount = 0, Y(l);
    });
  }, L.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete r[this._name], delete this.dom[s], w(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function ot() {
    return n().then(function(l) {
      if (!l) return;
      const v = Array.from(l.objectStoreNames);
      return new Promise(function(_, T) {
        const D = l.transaction(v, "readwrite");
        for (let A = 0; A < v.length; A++)
          D.objectStore(v[A]).clear();
        D.oncomplete = function() {
          _();
        }, D.onerror = function() {
          T(D.error);
        };
      });
    }).then(function() {
      const l = Object.keys(r);
      for (let v = 0; v < l.length; v++) {
        const _ = r[l[v]];
        _.isLoaded = !1, _.isSyncing = !1, _.lastSyncedAt = null, _.totalCount = 0;
      }
    });
  }
  function W(l) {
    I(l, d, s, L);
  }
  function X() {
    F(function() {
      new MutationObserver(function(v) {
        for (let _ = 0; _ < v.length; _++) {
          const T = v[_];
          if (T.type === "childList")
            for (let D = 0; D < T.addedNodes.length; D++) {
              const A = T.addedNodes[D];
              A.nodeType === 1 && I(A, d, s, L);
            }
          else T.type === "attributes" && I(T.target, d, s, L);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-store");
  }
  window[s] = { init: W, clearAll: ot }, X(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    W(document.body);
  }) : W(document.body);
})();
(function() {
  const d = "data-ln-data-table", s = "lnDataTable";
  if (window[s] !== void 0) return;
  const g = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function m(i) {
    return g ? g.format(i) : String(i);
  }
  function u(i) {
    I(i, d, s, r);
  }
  function r(i) {
    this.dom = i, this.name = i.getAttribute(d) || "", this.table = i.querySelector("table"), this.tbody = i.querySelector("[data-ln-data-table-body]") || i.querySelector("tbody"), this.thead = i.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = i.querySelector("[data-ln-data-table-total]"), this._filteredSpan = i.querySelector("[data-ln-data-table-filtered]"), this._countEl = i.querySelector("[data-ln-data-table-count]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== i ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(n) {
      const e = n.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._renderRows(), t._updateFooter(), w(i, "ln-data-table:rendered", {
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
      const c = o.getAttribute("data-ln-col");
      c && t._handleSort(c, o);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(n) {
      const e = n.target.closest("[data-ln-col-filter]");
      if (!e) return;
      n.stopPropagation();
      const o = e.closest("th");
      if (!o) return;
      const c = o.getAttribute("data-ln-col");
      if (c) {
        if (t._activeDropdown && t._activeDropdown.field === c) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(c, o, e);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(n) {
      n.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), w(i, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, i.addEventListener("click", this._onClearAll), this._selectable = i.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(n) {
        const e = n.target.closest("[data-ln-row-select]");
        if (!e) return;
        const o = e.closest("[data-ln-row]");
        if (!o) return;
        const c = o.getAttribute("data-ln-row-id");
        c != null && (e.checked ? (t.selectedIds.add(c), o.classList.add("ln-row-selected")) : (t.selectedIds.delete(c), o.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), w(i, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = i.querySelector('[data-ln-col-select] input[type="checkbox"]') || i.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const n = document.createElement("input");
        n.type = "checkbox", n.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(n), this._selectAllCheckbox = n;
      }
      this._selectAllCheckbox && (this._onSelectAll = function() {
        const n = t._selectAllCheckbox.checked, e = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let o = 0; o < e.length; o++) {
          const c = e[o].getAttribute("data-ln-row-id"), f = e[o].querySelector("[data-ln-row-select]");
          c != null && (n ? (t.selectedIds.add(c), e[o].classList.add("ln-row-selected")) : (t.selectedIds.delete(c), e[o].classList.remove("ln-row-selected")), f && (f.checked = n));
        }
        t.selectedCount = t.selectedIds.size, w(i, "ln-data-table:select-all", {
          table: t.name,
          selected: n
        }), w(i, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        });
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
    }
    return this._onRowClick = function(n) {
      if (n.target.closest("[data-ln-row-select]") || n.target.closest("[data-ln-row-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const e = n.target.closest("[data-ln-row]");
      if (!e) return;
      const o = e.getAttribute("data-ln-row-id"), c = e._lnRecord || {};
      w(i, "ln-data-table:row-click", {
        table: t.name,
        id: o,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(n) {
      const e = n.target.closest("[data-ln-row-action]");
      if (!e) return;
      n.stopPropagation();
      const o = e.closest("[data-ln-row]");
      if (!o) return;
      const c = e.getAttribute("data-ln-row-action"), f = o.getAttribute("data-ln-row-id"), b = o._lnRecord || {};
      w(i, "ln-data-table:row-action", {
        table: t.name,
        id: f,
        action: c,
        record: b
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = i.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, w(i, "ln-data-table:search", {
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
              w(i, "ln-data-table:row-click", {
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
    }, document.addEventListener("keydown", this._onKeydown), w(i, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  r.prototype._handleSort = function(i, t) {
    let n;
    !this.currentSort || this.currentSort.field !== i ? n = "asc" : this.currentSort.direction === "asc" ? n = "desc" : n = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    n ? (this.currentSort = { field: i, direction: n }, t.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, w(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: i,
      direction: n
    }), this._requestData();
  }, r.prototype._requestData = function() {
    w(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, r.prototype._updateSelectAll = function() {
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
  }, Object.defineProperty(r.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), r.prototype._focusRow = function(i) {
    for (let t = 0; t < i.length; t++)
      i[t].classList.remove("ln-row-focused"), i[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < i.length) {
      const t = i[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, r.prototype._openFilterDropdown = function(i, t, n) {
    this._closeFilterDropdown();
    const e = tt(this.name + "-column-filter", "ln-data-table") || tt("column-filter", "ln-data-table");
    if (!e) return;
    const o = e.firstElementChild;
    if (!o) return;
    const c = this._getUniqueValues(i), f = o.querySelector("[data-ln-filter-options]"), b = o.querySelector("[data-ln-filter-search]"), h = this.currentFilters[i] || [], E = this;
    if (b && c.length <= 8 && b.classList.add("hidden"), f) {
      for (let C = 0; C < c.length; C++) {
        const S = c[C], L = document.createElement("li"), x = document.createElement("label"), O = document.createElement("input");
        O.type = "checkbox", O.value = S, O.checked = h.length === 0 || h.indexOf(S) !== -1, x.appendChild(O), x.appendChild(document.createTextNode(" " + S)), L.appendChild(x), f.appendChild(L);
      }
      f.addEventListener("change", function(C) {
        C.target.type === "checkbox" && E._onFilterChange(i, f);
      });
    }
    b && b.addEventListener("input", function() {
      const C = b.value.toLowerCase(), S = f.querySelectorAll("li");
      for (let L = 0; L < S.length; L++) {
        const x = S[L].textContent.toLowerCase();
        S[L].classList.toggle("hidden", C && x.indexOf(C) === -1);
      }
    });
    const k = o.querySelector("[data-ln-filter-clear]");
    k && k.addEventListener("click", function() {
      delete E.currentFilters[i], E._closeFilterDropdown(), E._updateFilterIndicators(), w(E.dom, "ln-data-table:filter", {
        table: E.name,
        field: i,
        values: []
      }), E._requestData();
    }), t.appendChild(o), this._activeDropdown = { field: i, th: t, el: o }, o.addEventListener("click", function(C) {
      C.stopPropagation();
    });
  }, r.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, r.prototype._onFilterChange = function(i, t) {
    const n = t.querySelectorAll('input[type="checkbox"]'), e = [];
    let o = !0;
    for (let c = 0; c < n.length; c++)
      n[c].checked ? e.push(n[c].value) : o = !1;
    o || e.length === 0 ? delete this.currentFilters[i] : this.currentFilters[i] = e, this._updateFilterIndicators(), w(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: i,
      values: o ? [] : e
    }), this._requestData();
  }, r.prototype._getUniqueValues = function(i) {
    const t = {}, n = [], e = this._data;
    for (let o = 0; o < e.length; o++) {
      const c = e[o][i];
      c != null && !t[c] && (t[c] = !0, n.push(String(c)));
    }
    return n.sort(), n;
  }, r.prototype._updateFilterIndicators = function() {
    const i = this.ths;
    for (let t = 0; t < i.length; t++) {
      const n = i[t], e = n.getAttribute("data-ln-col");
      if (!e) continue;
      const o = n.querySelector("[data-ln-col-filter]");
      if (!o) continue;
      const c = this.currentFilters[e] && this.currentFilters[e].length > 0;
      o.classList.toggle("ln-filter-active", !!c);
    }
  }, r.prototype._renderRows = function() {
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
  }, r.prototype._renderAll = function() {
    const i = this._data, t = document.createDocumentFragment();
    for (let n = 0; n < i.length; n++) {
      const e = this._buildRow(i[n]);
      if (!e) break;
      t.appendChild(e);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, r.prototype._buildRow = function(i) {
    const t = tt(this.name + "-row", "ln-data-table");
    if (!t) return null;
    const n = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!n) return null;
    if (this._fillRow(n, i), n._lnRecord = i, i.id != null && n.setAttribute("data-ln-row-id", i.id), this._selectable && i.id != null && this.selectedIds.has(String(i.id))) {
      n.classList.add("ln-row-selected");
      const e = n.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return n;
  }, r.prototype._enableVirtualScroll = function() {
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
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    const i = this._data, t = i.length, n = this._rowHeight;
    if (!n || !t) return;
    const o = this.table.getBoundingClientRect().top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, f = o + c, b = window.scrollY - f, h = Math.max(0, Math.floor(b / n) - 15), E = Math.min(h + Math.ceil(window.innerHeight / n) + 30, t);
    if (h === this._vStart && E === this._vEnd) return;
    this._vStart = h, this._vEnd = E;
    const k = this.ths.length || 1, C = h * n, S = (t - E) * n, L = document.createDocumentFragment();
    if (C > 0) {
      const x = document.createElement("tr");
      x.className = "ln-data-table__spacer", x.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", k), O.style.cssText = "height:" + C + "px;padding:0;border:none", x.appendChild(O), L.appendChild(x);
    }
    for (let x = h; x < E; x++) {
      const O = this._buildRow(i[x]);
      O && L.appendChild(O);
    }
    if (S > 0) {
      const x = document.createElement("tr");
      x.className = "ln-data-table__spacer", x.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", k), O.style.cssText = "height:" + S + "px;padding:0;border:none", x.appendChild(O), L.appendChild(x);
    }
    this.tbody.textContent = "", this.tbody.appendChild(L), this._selectable && this._updateSelectAll();
  }, r.prototype._fillRow = function(i, t) {
    const n = i.querySelectorAll("[data-ln-cell]");
    for (let o = 0; o < n.length; o++) {
      const c = n[o], f = c.getAttribute("data-ln-cell");
      t[f] != null && (c.textContent = t[f]);
    }
    const e = i.querySelectorAll("[data-ln-cell-attr]");
    for (let o = 0; o < e.length; o++) {
      const c = e[o], f = c.getAttribute("data-ln-cell-attr").split(",");
      for (let b = 0; b < f.length; b++) {
        const h = f[b].trim().split(":");
        if (h.length !== 2) continue;
        const E = h[0].trim(), k = h[1].trim();
        t[E] != null && c.setAttribute(k, t[E]);
      }
    }
  }, r.prototype._showEmptyState = function(i) {
    const t = tt(i, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, r.prototype._updateFooter = function() {
    const i = this._lastTotal, t = this._lastFiltered, n = t < i;
    this._totalSpan && (this._totalSpan.textContent = m(i)), this._filteredSpan && (this._filteredSpan.textContent = n ? m(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n);
  }, r.prototype.destroy = function() {
    this.dom[s] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[s]);
  };
  function a() {
    F(function() {
      new MutationObserver(function(t) {
        t.forEach(function(n) {
          n.type === "childList" ? n.addedNodes.forEach(function(e) {
            e.nodeType === 1 && I(e, d, s, r);
          }) : n.type === "attributes" && I(n.target, d, s, r);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-data-table");
  }
  window[s] = u, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    u(document.body);
  }) : u(document.body);
})();
