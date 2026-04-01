const W = {};
function Q(d, a) {
  W[d] || (W[d] = document.querySelector('[data-ln-template="' + d + '"]'));
  const p = W[d];
  return p ? p.content.cloneNode(!0) : (console.warn("[" + a + '] Template "' + d + '" not found'), null);
}
function E(d, a, p) {
  d.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: p || {}
  }));
}
function q(d, a, p) {
  const m = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: p || {}
  });
  return d.dispatchEvent(m), m;
}
function S(d, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      S(d, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  d();
}
function tt(d, a) {
  return new Proxy(Object.assign({}, d), {
    set(p, m, b) {
      const g = p[m];
      return g === b || (p[m] = b, a(m, b, g)), !0;
    }
  });
}
function et(d, a) {
  let p = !1;
  return function() {
    p || (p = !0, queueMicrotask(function() {
      p = !1, d(), a && a();
    }));
  };
}
(function() {
  const d = "lnHttp";
  if (window[d] !== void 0) return;
  const a = {};
  document.addEventListener("ln-http:request", function(p) {
    const m = p.detail || {};
    if (!m.url) return;
    const b = p.target, g = (m.method || (m.body ? "POST" : "GET")).toUpperCase(), f = m.abort, l = m.tag;
    let r = m.url;
    f && (a[f] && a[f].abort(), a[f] = new AbortController());
    const n = { Accept: "application/json" };
    m.ajax && (n["X-Requested-With"] = "XMLHttpRequest");
    const i = {
      method: g,
      credentials: "same-origin",
      headers: n
    };
    if (f && (i.signal = a[f].signal), m.body && g === "GET") {
      const o = new URLSearchParams();
      for (const t in m.body)
        m.body[t] != null && o.set(t, m.body[t]);
      const e = o.toString();
      e && (r += (r.includes("?") ? "&" : "?") + e);
    } else m.body && (n["Content-Type"] = "application/json", i.body = JSON.stringify(m.body));
    fetch(r, i).then(function(o) {
      f && delete a[f];
      const e = o.ok, t = o.status;
      return o.json().then(function(s) {
        return { ok: e, status: t, data: s };
      }).catch(function() {
        return { ok: !1, status: t, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(o) {
      o.tag = l;
      const e = o.ok ? "ln-http:success" : "ln-http:error";
      E(b, e, o);
    }).catch(function(o) {
      f && o.name !== "AbortError" && delete a[f], o.name !== "AbortError" && E(b, "ln-http:error", { tag: l, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[d] = !0;
})();
(function() {
  const d = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function p(i) {
    if (!i.hasAttribute(d) || i[a]) return;
    i[a] = !0;
    const o = l(i);
    m(o.links), b(o.forms);
  }
  function m(i) {
    for (const o of i) {
      if (o[a + "Trigger"] || o.hostname && o.hostname !== window.location.hostname) continue;
      const e = o.getAttribute("href");
      if (e && e.includes("#")) continue;
      const t = function(s) {
        if (s.ctrlKey || s.metaKey || s.button === 1) return;
        s.preventDefault();
        const h = o.getAttribute("href");
        h && f("GET", h, null, o);
      };
      o.addEventListener("click", t), o[a + "Trigger"] = t;
    }
  }
  function b(i) {
    for (const o of i) {
      if (o[a + "Trigger"]) continue;
      const e = function(t) {
        t.preventDefault();
        const s = o.method.toUpperCase(), h = o.action, u = new FormData(o);
        for (const c of o.querySelectorAll('button, input[type="submit"]'))
          c.disabled = !0;
        f(s, h, u, o, function() {
          for (const c of o.querySelectorAll('button, input[type="submit"]'))
            c.disabled = !1;
        });
      };
      o.addEventListener("submit", e), o[a + "Trigger"] = e;
    }
  }
  function g(i) {
    if (!i[a]) return;
    const o = l(i);
    for (const e of o.links)
      e[a + "Trigger"] && (e.removeEventListener("click", e[a + "Trigger"]), delete e[a + "Trigger"]);
    for (const e of o.forms)
      e[a + "Trigger"] && (e.removeEventListener("submit", e[a + "Trigger"]), delete e[a + "Trigger"]);
    delete i[a];
  }
  function f(i, o, e, t, s) {
    if (q(t, "ln-ajax:before-start", { method: i, url: o }).defaultPrevented) return;
    E(t, "ln-ajax:start", { method: i, url: o }), t.classList.add("ln-ajax--loading");
    const u = document.createElement("span");
    u.className = "ln-ajax-spinner", t.appendChild(u);
    function c() {
      t.classList.remove("ln-ajax--loading");
      const L = t.querySelector(".ln-ajax-spinner");
      L && L.remove(), s && s();
    }
    let y = o;
    const v = document.querySelector('meta[name="csrf-token"]'), _ = v ? v.getAttribute("content") : null;
    e instanceof FormData && _ && e.append("_token", _);
    const w = {
      method: i,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (_ && (w.headers["X-CSRF-TOKEN"] = _), i === "GET" && e) {
      const L = new URLSearchParams(e);
      y = o + (o.includes("?") ? "&" : "?") + L.toString();
    } else i !== "GET" && e && (w.body = e);
    fetch(y, w).then(function(L) {
      const T = L.ok;
      return L.json().then(function(C) {
        return { ok: T, status: L.status, data: C };
      });
    }).then(function(L) {
      const T = L.data;
      if (L.ok) {
        if (T.title && (document.title = T.title), T.content)
          for (const C in T.content) {
            const x = document.getElementById(C);
            x && (x.innerHTML = T.content[C]);
          }
        if (t.tagName === "A") {
          const C = t.getAttribute("href");
          C && window.history.pushState({ ajax: !0 }, "", C);
        } else t.tagName === "FORM" && t.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", y);
        E(t, "ln-ajax:success", { method: i, url: y, data: T });
      } else
        E(t, "ln-ajax:error", { method: i, url: y, status: L.status, data: T });
      if (T.message && window.lnToast) {
        const C = T.message;
        window.lnToast.enqueue({
          type: C.type || (L.ok ? "success" : "error"),
          title: C.title || "",
          message: C.body || ""
        });
      }
      E(t, "ln-ajax:complete", { method: i, url: y }), c();
    }).catch(function(L) {
      E(t, "ln-ajax:error", { method: i, url: y, error: L }), E(t, "ln-ajax:complete", { method: i, url: y }), c();
    });
  }
  function l(i) {
    const o = { links: [], forms: [] };
    return i.tagName === "A" && i.getAttribute(d) !== "false" ? o.links.push(i) : i.tagName === "FORM" && i.getAttribute(d) !== "false" ? o.forms.push(i) : (o.links = Array.from(i.querySelectorAll('a:not([data-ln-ajax="false"])')), o.forms = Array.from(i.querySelectorAll('form:not([data-ln-ajax="false"])'))), o;
  }
  function r() {
    S(function() {
      new MutationObserver(function(o) {
        for (const e of o)
          if (e.type === "childList") {
            for (const t of e.addedNodes)
              if (t.nodeType === 1 && (p(t), !t.hasAttribute(d))) {
                for (const h of t.querySelectorAll("[" + d + "]"))
                  p(h);
                const s = t.closest && t.closest("[" + d + "]");
                if (s && s.getAttribute(d) !== "false") {
                  const h = l(t);
                  m(h.links), b(h.forms);
                }
              }
          } else e.type === "attributes" && p(e.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-ajax");
  }
  function n() {
    for (const i of document.querySelectorAll("[" + d + "]"))
      p(i);
  }
  window[a] = p, window[a].destroy = g, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const d = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function p(n) {
    m(n), b(n);
  }
  function m(n) {
    const i = Array.from(n.querySelectorAll("[" + d + "]"));
    n.hasAttribute && n.hasAttribute(d) && i.push(n);
    for (const o of i)
      o[a] || (o[a] = new g(o));
  }
  function b(n) {
    const i = Array.from(n.querySelectorAll("[data-ln-modal-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-modal-for") && i.push(n);
    for (const o of i)
      o[a + "Trigger"] || (o[a + "Trigger"] = !0, o.addEventListener("click", function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const t = o.getAttribute("data-ln-modal-for"), s = document.getElementById(t);
        !s || !s[a] || s[a].toggle();
      }));
  }
  function g(n) {
    this.dom = n, this.isOpen = n.getAttribute(d) === "open";
    const i = this;
    return this._onEscape = function(o) {
      o.key === "Escape" && i.close();
    }, this._onFocusTrap = function(o) {
      if (o.key !== "Tab") return;
      const e = i.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (e.length === 0) return;
      const t = e[0], s = e[e.length - 1];
      o.shiftKey ? document.activeElement === t && (o.preventDefault(), s.focus()) : document.activeElement === s && (o.preventDefault(), t.focus());
    }, this._onClose = function(o) {
      o.preventDefault(), i.close();
    }, l(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  g.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(d, "open");
  }, g.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(d, "close");
  }, g.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const n = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const i of n)
      i[a + "Close"] && (i.removeEventListener("click", i[a + "Close"]), delete i[a + "Close"]);
    E(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
  };
  function f(n) {
    const i = n[a];
    if (!i) return;
    const e = n.getAttribute(d) === "open";
    if (e !== i.isOpen)
      if (e) {
        if (q(n, "ln-modal:before-open", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(d, "close");
          return;
        }
        i.isOpen = !0, n.setAttribute("aria-modal", "true"), n.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", i._onEscape), document.addEventListener("keydown", i._onFocusTrap);
        const s = n.querySelector('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
        if (s) s.focus();
        else {
          const h = n.querySelector("a[href], button:not([disabled])");
          h && h.focus();
        }
        E(n, "ln-modal:open", { modalId: n.id, target: n });
      } else {
        if (q(n, "ln-modal:before-close", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(d, "open");
          return;
        }
        i.isOpen = !1, n.removeAttribute("aria-modal"), document.removeEventListener("keydown", i._onEscape), document.removeEventListener("keydown", i._onFocusTrap), E(n, "ln-modal:close", { modalId: n.id, target: n }), document.querySelector("[" + d + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function l(n) {
    const i = n.dom.querySelectorAll("[data-ln-modal-close]");
    for (const o of i)
      o[a + "Close"] || (o.addEventListener("click", n._onClose), o[a + "Close"] = n._onClose);
  }
  function r() {
    S(function() {
      new MutationObserver(function(i) {
        for (let o = 0; o < i.length; o++) {
          const e = i[o];
          if (e.type === "childList")
            for (let t = 0; t < e.addedNodes.length; t++) {
              const s = e.addedNodes[t];
              s.nodeType === 1 && (m(s), b(s));
            }
          else e.type === "attributes" && (e.attributeName === d && e.target[a] ? f(e.target) : (m(e.target), b(e.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, "data-ln-modal-for"]
      });
    }, "ln-modal");
  }
  window[a] = p, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const p = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments);
      for (const o of m)
        o();
    }, history._lnNavPatched = !0;
  }
  function b(i) {
    if (!i.hasAttribute(d) || p.has(i)) return;
    const o = i.getAttribute(d);
    if (!o) return;
    const e = g(i, o);
    p.set(i, e), i[a] = e;
  }
  function g(i, o) {
    let e = Array.from(i.querySelectorAll("a"));
    l(e, o, window.location.pathname);
    const t = function() {
      e = Array.from(i.querySelectorAll("a")), l(e, o, window.location.pathname);
    };
    window.addEventListener("popstate", t), m.push(t);
    const s = new MutationObserver(function(h) {
      for (const u of h)
        if (u.type === "childList") {
          for (const c of u.addedNodes)
            if (c.nodeType === 1) {
              if (c.tagName === "A")
                e.push(c), l([c], o, window.location.pathname);
              else if (c.querySelectorAll) {
                const y = Array.from(c.querySelectorAll("a"));
                e = e.concat(y), l(y, o, window.location.pathname);
              }
            }
          for (const c of u.removedNodes)
            if (c.nodeType === 1) {
              if (c.tagName === "A")
                e = e.filter(function(y) {
                  return y !== c;
                });
              else if (c.querySelectorAll) {
                const y = Array.from(c.querySelectorAll("a"));
                e = e.filter(function(v) {
                  return !y.includes(v);
                });
              }
            }
        }
    });
    return s.observe(i, { childList: !0, subtree: !0 }), {
      navElement: i,
      activeClass: o,
      observer: s,
      updateHandler: t,
      destroy: function() {
        s.disconnect(), window.removeEventListener("popstate", t);
        const h = m.indexOf(t);
        h !== -1 && m.splice(h, 1), p.delete(i), delete i[a];
      }
    };
  }
  function f(i) {
    try {
      return new URL(i, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return i.replace(/\/$/, "") || "/";
    }
  }
  function l(i, o, e) {
    const t = f(e);
    for (const s of i) {
      const h = s.getAttribute("href");
      if (!h) continue;
      const u = f(h);
      s.classList.remove(o);
      const c = u === t, y = u !== "/" && t.startsWith(u + "/");
      (c || y) && s.classList.add(o);
    }
  }
  function r() {
    S(function() {
      new MutationObserver(function(o) {
        for (const e of o)
          if (e.type === "childList") {
            for (const t of e.addedNodes)
              if (t.nodeType === 1 && (t.hasAttribute && t.hasAttribute(d) && b(t), t.querySelectorAll))
                for (const s of t.querySelectorAll("[" + d + "]"))
                  b(s);
          } else e.type === "attributes" && e.target.hasAttribute && e.target.hasAttribute(d) && b(e.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-nav");
  }
  window[a] = b;
  function n() {
    for (const i of document.querySelectorAll("[" + d + "]"))
      b(i);
  }
  r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
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
  const a = /* @__PURE__ */ new WeakMap();
  function p(f) {
    if (a.has(f)) return;
    const l = f.getAttribute("data-ln-select");
    let r = {};
    if (l && l.trim() !== "")
      try {
        r = JSON.parse(l);
      } catch (o) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", o);
      }
    const i = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: f.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...r };
    try {
      const o = new d(f, i);
      a.set(f, o);
      const e = f.closest("form");
      e && e.addEventListener("reset", () => {
        setTimeout(() => {
          o.clear(), o.clearOptions(), o.sync();
        }, 0);
      });
    } catch (o) {
      console.warn("[ln-select] Failed to initialize Tom Select:", o);
    }
  }
  function m(f) {
    const l = a.get(f);
    l && (l.destroy(), a.delete(f));
  }
  function b() {
    for (const f of document.querySelectorAll("select[data-ln-select]"))
      p(f);
  }
  function g() {
    S(function() {
      new MutationObserver(function(l) {
        for (const r of l) {
          if (r.type === "attributes") {
            r.target.matches && r.target.matches("select[data-ln-select]") && p(r.target);
            continue;
          }
          for (const n of r.addedNodes)
            if (n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && p(n), n.querySelectorAll))
              for (const i of n.querySelectorAll("select[data-ln-select]"))
                p(i);
          for (const n of r.removedNodes)
            if (n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && m(n), n.querySelectorAll))
              for (const i of n.querySelectorAll("select[data-ln-select]"))
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
    b(), g();
  }) : (b(), g()), window.lnSelect = {
    initialize: p,
    destroy: m,
    getInstance: function(f) {
      return a.get(f);
    }
  };
})();
(function() {
  const d = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function p(r = document.body) {
    m(r);
  }
  function m(r) {
    if (r.nodeType !== 1) return;
    const n = Array.from(r.querySelectorAll("[" + d + "]"));
    r.hasAttribute && r.hasAttribute(d) && n.push(r);
    for (const i of n)
      i[a] || (i[a] = new g(i));
  }
  function b() {
    const r = (location.hash || "").replace("#", ""), n = {};
    if (!r) return n;
    for (const i of r.split("&")) {
      const o = i.indexOf(":");
      o > 0 && (n[i.slice(0, o)] = i.slice(o + 1));
    }
    return n;
  }
  function g(r) {
    return this.dom = r, f.call(this), this;
  }
  function f() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const n of this.tabs) {
      const i = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      i && (this.mapTabs[i] = n);
    }
    for (const n of this.panels) {
      const i = (n.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      i && (this.mapPanels[i] = n);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const r = this;
    this._clickHandlers = [];
    for (const n of this.tabs) {
      if (n[a + "Trigger"]) continue;
      n[a + "Trigger"] = !0;
      const i = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        const e = (n.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (e)
          if (r.hashEnabled) {
            const t = b();
            t[r.nsKey] = e;
            const s = Object.keys(t).map(function(h) {
              return h + ":" + t[h];
            }).join("&");
            location.hash === "#" + s ? r.activate(e) : location.hash = s;
          } else
            r.activate(e);
      };
      n.addEventListener("click", i), r._clickHandlers.push({ el: n, handler: i });
    }
    this._hashHandler = function() {
      if (!r.hashEnabled) return;
      const n = b();
      r.activate(r.nsKey in n ? n[r.nsKey] : r.defaultKey);
    }, this.hashEnabled ? (window.addEventListener("hashchange", this._hashHandler), this._hashHandler()) : this.activate(this.defaultKey);
  }
  g.prototype.activate = function(r) {
    var n;
    (!r || !(r in this.mapPanels)) && (r = this.defaultKey);
    for (const i in this.mapTabs) {
      const o = this.mapTabs[i];
      i === r ? (o.setAttribute("data-active", ""), o.setAttribute("aria-selected", "true")) : (o.removeAttribute("data-active"), o.setAttribute("aria-selected", "false"));
    }
    for (const i in this.mapPanels) {
      const o = this.mapPanels[i], e = i === r;
      o.classList.toggle("hidden", !e), o.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const i = (n = this.mapPanels[r]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      i && setTimeout(() => i.focus({ preventScroll: !0 }), 0);
    }
    E(this.dom, "ln-tabs:change", { key: r, tab: this.mapTabs[r], panel: this.mapPanels[r] });
  }, g.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: r, handler: n } of this._clickHandlers)
        r.removeEventListener("click", n);
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), E(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function l() {
    S(function() {
      new MutationObserver(function(n) {
        for (const i of n) {
          if (i.type === "attributes") {
            m(i.target);
            continue;
          }
          for (const o of i.addedNodes)
            m(o);
        }
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-tabs");
  }
  l(), window[a] = p, p(document.body);
})();
(function() {
  const d = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function p(r) {
    m(r), b(r);
  }
  function m(r) {
    const n = Array.from(r.querySelectorAll("[" + d + "]"));
    r.hasAttribute && r.hasAttribute(d) && n.push(r);
    for (const i of n)
      i[a] || (i[a] = new g(i));
  }
  function b(r) {
    const n = Array.from(r.querySelectorAll("[data-ln-toggle-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-toggle-for") && n.push(r);
    for (const i of n) {
      if (i[a + "Trigger"]) return;
      i[a + "Trigger"] = !0, i.addEventListener("click", function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const e = i.getAttribute("data-ln-toggle-for"), t = document.getElementById(e);
        if (!t || !t[a]) return;
        const s = i.getAttribute("data-ln-toggle-action") || "toggle";
        t[a][s]();
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
    this.dom[a] && (E(this.dom, "ln-toggle:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function f(r) {
    const n = r[a];
    if (!n) return;
    const o = r.getAttribute(d) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (q(r, "ln-toggle:before-open", { target: r }).defaultPrevented) {
          r.setAttribute(d, "close");
          return;
        }
        n.isOpen = !0, r.classList.add("open"), E(r, "ln-toggle:open", { target: r });
      } else {
        if (q(r, "ln-toggle:before-close", { target: r }).defaultPrevented) {
          r.setAttribute(d, "open");
          return;
        }
        n.isOpen = !1, r.classList.remove("open"), E(r, "ln-toggle:close", { target: r });
      }
  }
  function l() {
    S(function() {
      new MutationObserver(function(n) {
        for (let i = 0; i < n.length; i++) {
          const o = n[i];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const t = o.addedNodes[e];
              t.nodeType === 1 && (m(t), b(t));
            }
          else o.type === "attributes" && (o.attributeName === d && o.target[a] ? f(o.target) : (m(o.target), b(o.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, "data-ln-toggle-for"]
      });
    }, "ln-toggle");
  }
  window[a] = p, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function p(f) {
    m(f);
  }
  function m(f) {
    const l = Array.from(f.querySelectorAll("[" + d + "]"));
    f.hasAttribute && f.hasAttribute(d) && l.push(f);
    for (const r of l)
      r[a] || (r[a] = new b(r));
  }
  function b(f) {
    return this.dom = f, this._onToggleOpen = function(l) {
      const r = f.querySelectorAll("[data-ln-toggle]");
      for (const n of r)
        n !== l.detail.target && n.getAttribute("data-ln-toggle") === "open" && n.setAttribute("data-ln-toggle", "close");
      E(f, "ln-accordion:change", { target: l.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), E(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function g() {
    S(function() {
      new MutationObserver(function(l) {
        for (const r of l)
          if (r.type === "childList")
            for (const n of r.addedNodes)
              n.nodeType === 1 && m(n);
          else r.type === "attributes" && m(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-accordion");
  }
  window[a] = p, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function p(f) {
    m(f);
  }
  function m(f) {
    const l = Array.from(f.querySelectorAll("[" + d + "]"));
    f.hasAttribute && f.hasAttribute(d) && l.push(f);
    for (const r of l)
      r[a] || (r[a] = new b(r));
  }
  function b(f) {
    if (this.dom = f, this.toggleEl = f.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = f.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const r of this.toggleEl.children)
        r.setAttribute("role", "menuitem");
    const l = this;
    return this._onToggleOpen = function(r) {
      r.detail.target === l.toggleEl && (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "true"), l._teleportToBody(), l._addOutsideClickListener(), l._addScrollRepositionListener(), l._addResizeCloseListener(), E(f, "ln-dropdown:open", { target: r.detail.target }));
    }, this._onToggleClose = function(r) {
      r.detail.target === l.toggleEl && (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "false"), l._removeOutsideClickListener(), l._removeScrollRepositionListener(), l._removeResizeCloseListener(), l._teleportBack(), E(f, "ln-dropdown:close", { target: r.detail.target }));
    }, this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose), this;
  }
  b.prototype._positionMenu = function() {
    const f = this.dom.querySelector("[data-ln-toggle-for]");
    if (!f || !this.toggleEl) return;
    const l = f.getBoundingClientRect(), r = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    r && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const n = this.toggleEl.offsetWidth, i = this.toggleEl.offsetHeight;
    r && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const o = window.innerWidth, e = window.innerHeight, t = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    let s;
    l.bottom + t + i <= e ? s = l.bottom + t : l.top - t - i >= 0 ? s = l.top - t - i : s = Math.max(0, e - i);
    let h;
    l.right - n >= 0 ? h = l.right - n : l.left + n <= o ? h = l.left : h = Math.max(0, o - n), this.toggleEl.style.top = s + "px", this.toggleEl.style.left = h + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, b.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, b.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const f = this;
    this._boundDocClick = function(l) {
      f.dom.contains(l.target) || f.toggleEl && f.toggleEl.contains(l.target) || f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, setTimeout(function() {
      document.addEventListener("click", f._boundDocClick);
    }, 0);
  }, b.prototype._removeOutsideClickListener = function() {
    this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, b.prototype._addScrollRepositionListener = function() {
    const f = this;
    this._boundScrollReposition = function() {
      f._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, b.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, b.prototype._addResizeCloseListener = function() {
    const f = this;
    this._boundResizeClose = function() {
      f.toggleEl && f.toggleEl.getAttribute("data-ln-toggle") === "open" && f.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, b.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, b.prototype.destroy = function() {
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose), E(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function g() {
    S(function() {
      new MutationObserver(function(l) {
        for (const r of l)
          if (r.type === "childList")
            for (const n of r.addedNodes)
              n.nodeType === 1 && m(n);
          else r.type === "attributes" && m(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-dropdown");
  }
  window[a] = p, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const d = "data-ln-toast", a = "lnToast", p = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[a] !== void 0 && window[a] !== null) return;
  function m(e = document.body) {
    return b(e), o;
  }
  function b(e) {
    if (!e || e.nodeType !== 1) return;
    const t = Array.from(e.querySelectorAll("[" + d + "]"));
    e.hasAttribute && e.hasAttribute(d) && t.push(e);
    for (const s of t)
      s[a] || new g(s);
  }
  function g(e) {
    this.dom = e, e[a] = this, this.timeoutDefault = parseInt(e.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(e.getAttribute("data-ln-toast-max") || "5", 10);
    for (const t of Array.from(e.querySelectorAll("[data-ln-toast-item]")))
      f(t);
    return this;
  }
  g.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const e of Array.from(this.dom.children))
        r(e);
      delete this.dom[a];
    }
  };
  function f(e) {
    const t = ((e.getAttribute("data-type") || "info") + "").toLowerCase(), s = e.getAttribute("data-title"), h = (e.innerText || e.textContent || "").trim();
    e.className = "ln-toast__item", e.removeAttribute("data-ln-toast-item");
    const u = document.createElement("div");
    u.className = "ln-toast__card ln-toast__card--" + t, u.setAttribute("role", t === "error" ? "alert" : "status"), u.setAttribute("aria-live", t === "error" ? "assertive" : "polite");
    const c = document.createElement("div");
    c.className = "ln-toast__side", c.innerHTML = p[t] || p.info;
    const y = document.createElement("div");
    y.className = "ln-toast__content";
    const v = document.createElement("div");
    v.className = "ln-toast__head";
    const _ = document.createElement("strong");
    _.className = "ln-toast__title", _.textContent = s || (t === "success" ? "Success" : t === "error" ? "Error" : t === "warn" ? "Warning" : "Information");
    const w = document.createElement("button");
    if (w.type = "button", w.className = "ln-toast__close ln-icon-close", w.setAttribute("aria-label", "Close"), w.addEventListener("click", () => r(e)), v.appendChild(_), y.appendChild(v), y.appendChild(w), h) {
      const L = document.createElement("div");
      L.className = "ln-toast__body";
      const T = document.createElement("p");
      T.textContent = h, L.appendChild(T), y.appendChild(L);
    }
    u.appendChild(c), u.appendChild(y), e.innerHTML = "", e.appendChild(u), requestAnimationFrame(() => e.classList.add("ln-toast__item--in"));
  }
  function l(e, t) {
    for (; e.dom.children.length >= e.max; ) e.dom.removeChild(e.dom.firstElementChild);
    e.dom.appendChild(t), requestAnimationFrame(() => t.classList.add("ln-toast__item--in"));
  }
  function r(e) {
    !e || !e.parentNode || (clearTimeout(e._timer), e.classList.remove("ln-toast__item--in"), e.classList.add("ln-toast__item--out"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 200));
  }
  function n(e = {}) {
    let t = e.container;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), !t)
      return console.warn("[ln-toast] No toast container found"), null;
    const s = t[a] || new g(t), h = Number.isFinite(e.timeout) ? e.timeout : s.timeoutDefault, u = (e.type || "info").toLowerCase(), c = document.createElement("li");
    c.className = "ln-toast__item";
    const y = document.createElement("div");
    y.className = "ln-toast__card ln-toast__card--" + u, y.setAttribute("role", u === "error" ? "alert" : "status"), y.setAttribute("aria-live", u === "error" ? "assertive" : "polite");
    const v = document.createElement("div");
    v.className = "ln-toast__side", v.innerHTML = p[u] || p.info;
    const _ = document.createElement("div");
    _.className = "ln-toast__content";
    const w = document.createElement("div");
    w.className = "ln-toast__head";
    const L = document.createElement("strong");
    L.className = "ln-toast__title", L.textContent = e.title || (u === "success" ? "Success" : u === "error" ? "Error" : u === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close ln-icon-close", T.setAttribute("aria-label", "Close"), T.addEventListener("click", () => r(c)), w.appendChild(L), _.appendChild(w), _.appendChild(T), e.message || e.data && e.data.errors) {
      const C = document.createElement("div");
      if (C.className = "ln-toast__body", e.message)
        if (Array.isArray(e.message)) {
          const x = document.createElement("ul");
          for (const B of e.message) {
            const N = document.createElement("li");
            N.textContent = B, x.appendChild(N);
          }
          C.appendChild(x);
        } else {
          const x = document.createElement("p");
          x.textContent = e.message, C.appendChild(x);
        }
      if (e.data && e.data.errors) {
        const x = document.createElement("ul");
        for (const B of Object.values(e.data.errors).flat()) {
          const N = document.createElement("li");
          N.textContent = B, x.appendChild(N);
        }
        C.appendChild(x);
      }
      _.appendChild(C);
    }
    return y.appendChild(v), y.appendChild(_), c.appendChild(y), l(s, c), h > 0 && (c._timer = setTimeout(() => r(c), h)), c;
  }
  function i(e) {
    let t = e;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement || (t = document.querySelector("[" + d + "]") || document.getElementById("ln-toast-container")), !!t)
      for (const s of Array.from(t.children))
        r(s);
  }
  const o = function(e) {
    return m(e);
  };
  o.enqueue = n, o.clear = i, S(function() {
    new MutationObserver(function(t) {
      for (const s of t) {
        if (s.type === "attributes") {
          b(s.target);
          continue;
        }
        for (const h of s.addedNodes)
          b(h);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
  }, "ln-toast"), window[a] = o, window.addEventListener("ln-toast:enqueue", function(e) {
    e.detail && o.enqueue(e.detail);
  }), m(document.body);
})();
(function() {
  const d = "data-ln-upload", a = "lnUpload", p = "data-ln-upload-dict", m = "data-ln-upload-accept", b = "data-ln-upload-context";
  if (window[a] !== void 0) return;
  function g(t, s) {
    const h = t.querySelector("[" + p + '="' + s + '"]');
    return h ? h.textContent : s;
  }
  function f(t) {
    if (t === 0) return "0 B";
    const s = 1024, h = ["B", "KB", "MB", "GB"], u = Math.floor(Math.log(t) / Math.log(s));
    return parseFloat((t / Math.pow(s, u)).toFixed(1)) + " " + h[u];
  }
  function l(t) {
    return t.split(".").pop().toLowerCase();
  }
  function r(t) {
    return t === "docx" && (t = "doc"), ["pdf", "doc", "epub"].includes(t) ? "ln-icon-file-" + t : "ln-icon-file";
  }
  function n(t, s) {
    if (!s) return !0;
    const h = "." + l(t.name);
    return s.split(",").map(function(c) {
      return c.trim().toLowerCase();
    }).includes(h.toLowerCase());
  }
  function i(t) {
    if (t.hasAttribute("data-ln-upload-initialized")) return;
    t.setAttribute("data-ln-upload-initialized", "true");
    const s = t.querySelector(".ln-upload__zone"), h = t.querySelector(".ln-upload__list"), u = t.getAttribute(m) || "";
    if (!s || !h) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", t);
      return;
    }
    let c = t.querySelector('input[type="file"]');
    c || (c = document.createElement("input"), c.type = "file", c.multiple = !0, c.classList.add("hidden"), u && (c.accept = u.split(",").map(function(A) {
      return A = A.trim(), A.startsWith(".") ? A : "." + A;
    }).join(",")), t.appendChild(c));
    const y = t.getAttribute(d) || "/files/upload", v = t.getAttribute(b) || "", _ = /* @__PURE__ */ new Map();
    let w = 0;
    function L() {
      const A = document.querySelector('meta[name="csrf-token"]');
      return A ? A.getAttribute("content") : "";
    }
    function T(A) {
      if (!n(A, u)) {
        const O = g(t, "invalid-type");
        E(t, "ln-upload:invalid", {
          file: A,
          message: O
        }), E(window, "ln-toast:enqueue", {
          type: "error",
          title: "Invalid File",
          message: O || "This file type is not allowed"
        });
        return;
      }
      const k = "file-" + ++w, D = l(A.name), P = r(D), I = document.createElement("li");
      I.className = "ln-upload__item ln-upload__item--uploading " + P, I.setAttribute("data-file-id", k);
      const U = document.createElement("span");
      U.className = "ln-upload__name", U.textContent = A.name;
      const F = document.createElement("span");
      F.className = "ln-upload__size", F.textContent = "0%";
      const R = document.createElement("button");
      R.type = "button", R.className = "ln-upload__remove ln-icon-close", R.title = g(t, "remove"), R.textContent = "×", R.disabled = !0;
      const j = document.createElement("div");
      j.className = "ln-upload__progress";
      const z = document.createElement("div");
      z.className = "ln-upload__progress-bar", j.appendChild(z), I.appendChild(U), I.appendChild(F), I.appendChild(R), I.appendChild(j), h.appendChild(I);
      const K = new FormData();
      K.append("file", A), K.append("context", v);
      const M = new XMLHttpRequest();
      M.upload.addEventListener("progress", function(O) {
        if (O.lengthComputable) {
          const H = Math.round(O.loaded / O.total * 100);
          z.style.width = H + "%", F.textContent = H + "%";
        }
      }), M.addEventListener("load", function() {
        if (M.status >= 200 && M.status < 300) {
          let O;
          try {
            O = JSON.parse(M.responseText);
          } catch {
            V("Invalid response");
            return;
          }
          I.classList.remove("ln-upload__item--uploading"), F.textContent = f(O.size || A.size), R.disabled = !1, _.set(k, {
            serverId: O.id,
            name: O.name,
            size: O.size
          }), C(), E(t, "ln-upload:uploaded", {
            localId: k,
            serverId: O.id,
            name: O.name
          });
        } else {
          let O = "Upload failed";
          try {
            O = JSON.parse(M.responseText).message || O;
          } catch {
          }
          V(O);
        }
      }), M.addEventListener("error", function() {
        V("Network error");
      });
      function V(O) {
        I.classList.remove("ln-upload__item--uploading"), I.classList.add("ln-upload__item--error"), z.style.width = "100%", F.textContent = g(t, "error"), R.disabled = !1, E(t, "ln-upload:error", {
          file: A,
          message: O
        }), E(window, "ln-toast:enqueue", {
          type: "error",
          title: "Upload Error",
          message: O || g(t, "upload-failed") || "Failed to upload file"
        });
      }
      M.open("POST", y), M.setRequestHeader("X-CSRF-TOKEN", L()), M.setRequestHeader("Accept", "application/json"), M.send(K);
    }
    function C() {
      for (const A of t.querySelectorAll('input[name="file_ids[]"]'))
        A.remove();
      for (const [, A] of _) {
        const k = document.createElement("input");
        k.type = "hidden", k.name = "file_ids[]", k.value = A.serverId, t.appendChild(k);
      }
    }
    function x(A) {
      const k = _.get(A), D = h.querySelector('[data-file-id="' + A + '"]');
      if (!k || !k.serverId) {
        D && D.remove(), _.delete(A), C();
        return;
      }
      D && D.classList.add("ln-upload__item--deleting"), fetch("/files/" + k.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": L(),
          Accept: "application/json"
        }
      }).then(function(P) {
        P.status === 200 ? (D && D.remove(), _.delete(A), C(), E(t, "ln-upload:removed", {
          localId: A,
          serverId: k.serverId
        })) : (D && D.classList.remove("ln-upload__item--deleting"), E(window, "ln-toast:enqueue", {
          type: "error",
          title: "Error",
          message: g(t, "delete-error") || "Failed to delete file"
        }));
      }).catch(function(P) {
        console.warn("[ln-upload] Delete error:", P), D && D.classList.remove("ln-upload__item--deleting"), E(window, "ln-toast:enqueue", {
          type: "error",
          title: "Network Error",
          message: "Could not connect to server"
        });
      });
    }
    function B(A) {
      for (const k of A)
        T(k);
      c.value = "";
    }
    const N = function() {
      c.click();
    }, X = function() {
      B(this.files);
    }, Y = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }, G = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.add("ln-upload__zone--dragover");
    }, J = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.remove("ln-upload__zone--dragover");
    }, Z = function(A) {
      A.preventDefault(), A.stopPropagation(), s.classList.remove("ln-upload__zone--dragover"), B(A.dataTransfer.files);
    }, $ = function(A) {
      if (A.target.classList.contains("ln-upload__remove")) {
        const k = A.target.closest(".ln-upload__item");
        k && x(k.getAttribute("data-file-id"));
      }
    };
    s.addEventListener("click", N), c.addEventListener("change", X), s.addEventListener("dragenter", Y), s.addEventListener("dragover", G), s.addEventListener("dragleave", J), s.addEventListener("drop", Z), h.addEventListener("click", $), t.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(_.values()).map(function(A) {
          return A.serverId;
        });
      },
      getFiles: function() {
        return Array.from(_.values());
      },
      clear: function() {
        for (const [, A] of _)
          A.serverId && fetch("/files/" + A.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": L(),
              Accept: "application/json"
            }
          });
        _.clear(), h.innerHTML = "", C(), E(t, "ln-upload:cleared", {});
      },
      destroy: function() {
        s.removeEventListener("click", N), c.removeEventListener("change", X), s.removeEventListener("dragenter", Y), s.removeEventListener("dragover", G), s.removeEventListener("dragleave", J), s.removeEventListener("drop", Z), h.removeEventListener("click", $), _.clear(), h.innerHTML = "", C(), t.removeAttribute("data-ln-upload-initialized"), delete t.lnUploadAPI;
      }
    };
  }
  function o() {
    for (const t of document.querySelectorAll("[" + d + "]"))
      i(t);
  }
  function e() {
    S(function() {
      new MutationObserver(function(s) {
        for (const h of s)
          if (h.type === "childList") {
            for (const u of h.addedNodes)
              if (u.nodeType === 1) {
                u.hasAttribute(d) && i(u);
                for (const c of u.querySelectorAll("[" + d + "]"))
                  i(c);
              }
          } else h.type === "attributes" && h.target.hasAttribute(d) && i(h.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: i,
    initAll: o
  }, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const d = "lnExternalLinks";
  if (window[d] !== void 0) return;
  function a(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function p(l) {
    l.getAttribute("data-ln-external-link") !== "processed" && a(l) && (l.target = "_blank", l.rel = "noopener noreferrer", l.setAttribute("data-ln-external-link", "processed"), E(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    }));
  }
  function m(l) {
    l = l || document.body;
    for (const r of l.querySelectorAll("a, area"))
      p(r);
  }
  function b() {
    document.body.addEventListener("click", function(l) {
      const r = l.target.closest("a, area");
      r && r.getAttribute("data-ln-external-link") === "processed" && E(r, "ln-external-links:clicked", {
        link: r,
        href: r.href,
        text: r.textContent || r.title || ""
      });
    });
  }
  function g() {
    S(function() {
      new MutationObserver(function(r) {
        for (const n of r)
          if (n.type === "childList") {
            for (const i of n.addedNodes)
              if (i.nodeType === 1 && (i.matches && (i.matches("a") || i.matches("area")) && p(i), i.querySelectorAll))
                for (const o of i.querySelectorAll("a, area"))
                  p(o);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function f() {
    b(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[d] = {
    process: m
  }, f();
})();
(function() {
  const d = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let p = null;
  function m() {
    p = document.createElement("div"), p.className = "ln-link-status", document.body.appendChild(p);
  }
  function b(c) {
    p && (p.textContent = c, p.classList.add("ln-link-status--visible"));
  }
  function g() {
    p && p.classList.remove("ln-link-status--visible");
  }
  function f(c, y) {
    if (y.target.closest("a, button, input, select, textarea")) return;
    const v = c.querySelector("a");
    if (!v) return;
    const _ = v.getAttribute("href");
    if (!_) return;
    if (y.ctrlKey || y.metaKey || y.button === 1) {
      window.open(_, "_blank");
      return;
    }
    q(c, "ln-link:navigate", { target: c, href: _, link: v }).defaultPrevented || v.click();
  }
  function l(c) {
    const y = c.querySelector("a");
    if (!y) return;
    const v = y.getAttribute("href");
    v && b(v);
  }
  function r() {
    g();
  }
  function n(c) {
    c[a + "Row"] || (c[a + "Row"] = !0, c.querySelector("a") && (c._lnLinkClick = function(y) {
      f(c, y);
    }, c._lnLinkEnter = function() {
      l(c);
    }, c.addEventListener("click", c._lnLinkClick), c.addEventListener("mouseenter", c._lnLinkEnter), c.addEventListener("mouseleave", r)));
  }
  function i(c) {
    c[a + "Row"] && (c._lnLinkClick && c.removeEventListener("click", c._lnLinkClick), c._lnLinkEnter && c.removeEventListener("mouseenter", c._lnLinkEnter), c.removeEventListener("mouseleave", r), delete c._lnLinkClick, delete c._lnLinkEnter, delete c[a + "Row"]);
  }
  function o(c) {
    if (!c[a + "Init"]) return;
    const y = c.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const v = y === "TABLE" && c.querySelector("tbody") || c;
      for (const _ of v.querySelectorAll("tr"))
        i(_);
    } else
      i(c);
    delete c[a + "Init"];
  }
  function e(c) {
    if (c[a + "Init"]) return;
    c[a + "Init"] = !0;
    const y = c.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const v = y === "TABLE" && c.querySelector("tbody") || c;
      for (const _ of v.querySelectorAll("tr"))
        n(_);
    } else n(c);
  }
  function t(c) {
    c.hasAttribute && c.hasAttribute(d) && e(c);
    const y = c.querySelectorAll ? c.querySelectorAll("[" + d + "]") : [];
    for (const v of y)
      e(v);
  }
  function s() {
    S(function() {
      new MutationObserver(function(y) {
        for (const v of y)
          if (v.type === "childList")
            for (const _ of v.addedNodes)
              _.nodeType === 1 && (t(_), _.tagName === "TR" && _.closest("[" + d + "]") && n(_));
          else v.type === "attributes" && t(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-link");
  }
  function h(c) {
    t(c);
  }
  window[a] = { init: h, destroy: o };
  function u() {
    m(), s(), h(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const d = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function p(i) {
    const o = i.getAttribute("data-ln-progress");
    return o !== null && o !== "";
  }
  function m(i) {
    b(i);
  }
  function b(i) {
    const o = Array.from(i.querySelectorAll(d));
    for (const e of o)
      p(e) && !e[a] && (e[a] = new g(e));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && p(i) && !i[a] && (i[a] = new g(i));
  }
  function g(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, n.call(this), l.call(this), r.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function f() {
    new MutationObserver(function(o) {
      for (const e of o)
        if (e.type === "childList")
          for (const t of e.addedNodes)
            t.nodeType === 1 && b(t);
        else e.type === "attributes" && b(e.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-progress"]
    });
  }
  f();
  function l() {
    const i = this, o = new MutationObserver(function(e) {
      for (const t of e)
        (t.attributeName === "data-ln-progress" || t.attributeName === "data-ln-progress-max") && n.call(i);
    });
    o.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = o;
  }
  function r() {
    const i = this, o = this.dom.parentElement;
    if (!o || !o.hasAttribute("data-ln-progress-max")) return;
    const e = new MutationObserver(function(t) {
      for (const s of t)
        s.attributeName === "data-ln-progress-max" && n.call(i);
    });
    e.observe(o, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = e;
  }
  function n() {
    const i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, o = this.dom.parentElement, t = (o && o.hasAttribute("data-ln-progress-max") ? parseFloat(o.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let s = t > 0 ? i / t * 100 : 0;
    s < 0 && (s = 0), s > 100 && (s = 100), this.dom.style.width = s + "%", E(this.dom, "ln-progress:change", { target: this.dom, value: i, max: t, percentage: s });
  }
  window[a] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "data-ln-filter", a = "lnFilter", p = "data-ln-filter-initialized", m = "data-ln-filter-key", b = "data-ln-filter-value", g = "data-ln-filter-hide", f = "data-active";
  if (window[a] !== void 0) return;
  function l(o) {
    r(o);
  }
  function r(o) {
    const e = o.querySelectorAll("[" + d + "]");
    for (const t of e)
      t[a] || (t[a] = new n(t));
    o.hasAttribute && o.hasAttribute(d) && !o[a] && (o[a] = new n(o));
  }
  function n(o) {
    if (o.hasAttribute(p)) return this;
    this.dom = o, this.targetId = o.getAttribute(d), this.buttons = Array.from(o.querySelectorAll("button")), this._pendingEvents = [];
    const e = this, t = et(
      function() {
        e._render();
      },
      function() {
        e._afterRender();
      }
    );
    this.state = tt({
      key: null,
      value: null
    }, t), this._attachHandlers();
    for (let s = 0; s < this.buttons.length; s++) {
      const h = this.buttons[s];
      if (h.hasAttribute(f) && h.getAttribute(b) !== "") {
        this.state.key = h.getAttribute(m), this.state.value = h.getAttribute(b);
        break;
      }
    }
    return this.buttons.forEach(function(s) {
      s.setAttribute("aria-pressed", s.hasAttribute(f) ? "true" : "false");
    }), o.setAttribute(p, ""), this;
  }
  n.prototype._attachHandlers = function() {
    const o = this;
    this.buttons.forEach(function(e) {
      e[a + "Bound"] || (e[a + "Bound"] = !0, e.addEventListener("click", function() {
        const t = e.getAttribute(m), s = e.getAttribute(b);
        s === "" ? (o._pendingEvents.push({ name: "ln-filter:changed", detail: { key: t, value: "" } }), o.reset()) : (o._pendingEvents.push({ name: "ln-filter:changed", detail: { key: t, value: s } }), o.state.key = t, o.state.value = s);
      }));
    });
  }, n.prototype._render = function() {
    const o = this, e = this.state.key, t = this.state.value;
    this.buttons.forEach(function(u) {
      const c = u.getAttribute(m), y = u.getAttribute(b);
      let v = !1;
      e === null && t === null ? v = y === "" : v = c === e && y === t, v ? (u.setAttribute(f, ""), u.setAttribute("aria-pressed", "true")) : (u.removeAttribute(f), u.setAttribute("aria-pressed", "false"));
    });
    const s = document.getElementById(o.targetId);
    if (!s) return;
    const h = s.children;
    for (let u = 0; u < h.length; u++) {
      const c = h[u];
      if (e === null && t === null) {
        c.removeAttribute(g);
        continue;
      }
      const y = c.getAttribute("data-" + e);
      c.removeAttribute(g), y !== null && t && y.toLowerCase() !== t.toLowerCase() && c.setAttribute(g, "true");
    }
  }, n.prototype._afterRender = function() {
    const o = this._pendingEvents;
    this._pendingEvents = [];
    for (let e = 0; e < o.length; e++)
      this._dispatchOnBoth(o[e].name, o[e].detail);
  }, n.prototype._dispatchOnBoth = function(o, e) {
    E(this.dom, o, e);
    const t = document.getElementById(this.targetId);
    t && t !== this.dom && E(t, o, e);
  }, n.prototype.filter = function(o, e) {
    this._pendingEvents.push({ name: "ln-filter:changed", detail: { key: o, value: e } }), this.state.key = o, this.state.value = e;
  }, n.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.value = null;
  }, n.prototype.getActive = function() {
    return this.state.key === null && this.state.value === null ? null : { key: this.state.key, value: this.state.value };
  };
  function i() {
    S(function() {
      new MutationObserver(function(e) {
        for (const t of e)
          if (t.type === "childList")
            for (const s of t.addedNodes)
              s.nodeType === 1 && r(s);
          else t.type === "attributes" && r(t.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-filter");
  }
  window[a] = l, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    l(document.body);
  }) : l(document.body);
})();
(function() {
  const d = "data-ln-search", a = "lnSearch", p = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function g(n) {
    f(n);
  }
  function f(n) {
    const i = Array.from(n.querySelectorAll("[" + d + "]"));
    n.hasAttribute && n.hasAttribute(d) && i.push(n), i.forEach(function(o) {
      o[a] || (o[a] = new l(o));
    });
  }
  function l(n) {
    if (n.hasAttribute(p)) return this;
    this.dom = n, this.targetId = n.getAttribute(d);
    const i = n.tagName;
    return this.input = i === "INPUT" || i === "TEXTAREA" ? n : n.querySelector('[name="search"]') || n.querySelector('input[type="search"]') || n.querySelector('input[type="text"]'), this._debounceTimer = null, this._attachHandler(), n.setAttribute(p, ""), this;
  }
  l.prototype._attachHandler = function() {
    if (!this.input) return;
    const n = this;
    this._onInput = function() {
      clearTimeout(n._debounceTimer), n._debounceTimer = setTimeout(function() {
        n._search(n.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, l.prototype._search = function(n) {
    const i = document.getElementById(this.targetId);
    if (!i || q(i, "ln-search:change", { term: n, targetId: this.targetId }).defaultPrevented) return;
    const e = i.children;
    e.length;
    for (let t = 0; t < e.length; t++) {
      const s = e[t];
      s.removeAttribute(m), n && !s.textContent.replace(/\s+/g, " ").toLowerCase().includes(n) && s.setAttribute(m, "true");
    }
  }, l.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this.dom.removeAttribute(p), delete this.dom[a]);
  };
  function r() {
    S(function() {
      new MutationObserver(function(i) {
        i.forEach(function(o) {
          o.type === "childList" ? o.addedNodes.forEach(function(e) {
            e.nodeType === 1 && f(e);
          }) : o.type === "attributes" && f(o.target);
        });
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-search");
  }
  window[a] = g, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const d = "lnTableSort", a = "data-ln-sort", p = "data-ln-sort-active";
  if (window[d] !== void 0) return;
  function m(l) {
    b(l);
  }
  function b(l) {
    const r = Array.from(l.querySelectorAll("table"));
    l.tagName === "TABLE" && r.push(l), r.forEach(function(n) {
      if (n[d]) return;
      const i = Array.from(n.querySelectorAll("th[" + a + "]"));
      i.length && (n[d] = new g(n, i));
    });
  }
  function g(l, r) {
    this.table = l, this.ths = r, this._col = -1, this._dir = null;
    const n = this;
    return r.forEach(function(i, o) {
      i[d + "Bound"] || (i[d + "Bound"] = !0, i.addEventListener("click", function() {
        n._handleClick(o, i);
      }));
    }), this;
  }
  g.prototype._handleClick = function(l, r) {
    let n;
    this._col !== l ? n = "asc" : this._dir === "asc" ? n = "desc" : this._dir === "desc" ? n = null : n = "asc", this.ths.forEach(function(i) {
      i.removeAttribute(p);
    }), n === null ? (this._col = -1, this._dir = null) : (this._col = l, this._dir = n, r.setAttribute(p, n)), E(this.table, "ln-table:sort", {
      column: l,
      sortType: r.getAttribute(a),
      direction: n
    });
  };
  function f() {
    S(function() {
      new MutationObserver(function(r) {
        r.forEach(function(n) {
          n.type === "childList" ? n.addedNodes.forEach(function(i) {
            i.nodeType === 1 && b(i);
          }) : n.type === "attributes" && b(n.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
    }, "ln-table-sort");
  }
  window[d] = m, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "data-ln-table", a = "lnTable", p = "data-ln-sort", m = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const f = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function l(o) {
    r(o);
  }
  function r(o) {
    const e = Array.from(o.querySelectorAll("[" + d + "]"));
    o.hasAttribute && o.hasAttribute(d) && e.push(o), e.forEach(function(t) {
      t[a] || (t[a] = new n(t));
    });
  }
  function n(o) {
    this.dom = o, this.table = o.querySelector("table"), this.tbody = o.querySelector("tbody"), this.thead = o.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const e = o.querySelector(".ln-table__toolbar");
    e && o.style.setProperty("--ln-table-toolbar-h", e.offsetHeight + "px");
    const t = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const s = new MutationObserver(function() {
        t.tbody.rows.length > 0 && (s.disconnect(), t._parseRows());
      });
      s.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(s) {
      s.preventDefault(), t._searchTerm = s.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), E(o, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-search:change", this._onSearch), this._onSort = function(s) {
      t._sortCol = s.detail.direction === null ? -1 : s.detail.column, t._sortDir = s.detail.direction, t._sortType = s.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), E(o, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(s) {
      const h = s.detail.key, u = s.detail.value;
      u ? t._columnFilters[h] = u.toLowerCase() : delete t._columnFilters[h], t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), E(o, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-filter:changed", this._onColumnFilter), this;
  }
  n.prototype._parseRows = function() {
    const o = this.tbody.rows, e = this.ths;
    this._data = [];
    const t = [];
    for (let s = 0; s < e.length; s++)
      t[s] = e[s].getAttribute(p);
    o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < o.length; s++) {
      const h = o[s], u = [], c = [], y = [];
      for (let v = 0; v < h.cells.length; v++) {
        const _ = h.cells[v], w = _.textContent.trim(), L = _.hasAttribute("data-ln-value") ? _.getAttribute("data-ln-value") : w, T = t[v];
        c[v] = w.toLowerCase(), T === "number" || T === "date" ? u[v] = parseFloat(L) || 0 : T === "string" ? u[v] = String(L) : u[v] = null, v < h.cells.length - 1 && y.push(w.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: c,
        html: h.outerHTML,
        searchText: y.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), E(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    const o = this._searchTerm, e = this._columnFilters, t = Object.keys(e).length > 0, s = this.ths, h = {};
    if (t)
      for (let _ = 0; _ < s.length; _++) {
        const w = s[_].getAttribute("data-ln-filter-col");
        w && (h[w] = _);
      }
    if (!o && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(_) {
      if (o && _.searchText.indexOf(o) === -1) return !1;
      if (t)
        for (const w in e) {
          const L = h[w];
          if (L !== void 0 && _.rawTexts[L] !== e[w]) return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, c = this._sortDir === "desc" ? -1 : 1, y = this._sortType === "number" || this._sortType === "date", v = f ? f.compare : function(_, w) {
      return _ < w ? -1 : _ > w ? 1 : 0;
    };
    this._filteredData.sort(function(_, w) {
      const L = _.sortKeys[u], T = w.sortKeys[u];
      return y ? (L - T) * c : v(L, T) * c;
    });
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const o = document.createElement("colgroup");
    this.ths.forEach(function(e) {
      const t = document.createElement("col");
      t.style.width = e.offsetWidth + "px", o.appendChild(t);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, n.prototype._render = function() {
    if (!this.tbody) return;
    const o = this._filteredData.length;
    o === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, n.prototype._renderAll = function() {
    const o = [], e = this._filteredData;
    for (let t = 0; t < e.length; t++) o.push(e[t].html);
    this.tbody.innerHTML = o.join("");
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const o = this;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const o = this._filteredData, e = o.length, t = this._rowHeight;
    if (!t || !e) return;
    const h = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, c = h + u, y = window.scrollY - c, v = Math.max(0, Math.floor(y / t) - 15), _ = Math.min(v + Math.ceil(window.innerHeight / t) + 30, e);
    if (v === this._vStart && _ === this._vEnd) return;
    this._vStart = v, this._vEnd = _;
    const w = this.ths.length || 1, L = v * t, T = (e - _) * t, C = "";
    L > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + L + 'px;padding:0;border:none"></td></tr>');
    for (let x = v; x < _; x++) C += o[x].html;
    T > 0 && (C += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + w + '" style="height:' + T + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = C;
  }, n.prototype._showEmptyState = function() {
    const o = this.ths.length || 1, e = this.dom.querySelector("template[" + m + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(o)), e && t.appendChild(document.importNode(e.content, !0));
    const s = document.createElement("tr");
    s.className = "ln-table__empty", s.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(s), E(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  };
  function i() {
    S(function() {
      new MutationObserver(function(e) {
        e.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(s) {
            s.nodeType === 1 && r(s);
          }) : t.type === "attributes" && r(t.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table");
  }
  window[a] = l, i(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    l(document.body);
  }) : l(document.body);
})();
(function() {
  const d = "[data-ln-circular-progress]", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const p = "http://www.w3.org/2000/svg", m = 36, b = 16, g = 2 * Math.PI * b;
  function f(s) {
    l(s);
  }
  function l(s) {
    const h = Array.from(s.querySelectorAll(d));
    for (const u of h)
      u[a] || (u[a] = new r(u));
    s.hasAttribute && s.hasAttribute("data-ln-circular-progress") && !s[a] && (s[a] = new r(s));
  }
  function r(s) {
    return this.dom = s, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, i.call(this), t.call(this), e.call(this), s.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  r.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function n(s, h) {
    const u = document.createElementNS(p, s);
    for (const c in h)
      u.setAttribute(c, h[c]);
    return u;
  }
  function i() {
    this.svg = n("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: b,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: b,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": g,
      "stroke-dashoffset": g,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    new MutationObserver(function(h) {
      for (const u of h)
        if (u.type === "childList")
          for (const c of u.addedNodes)
            c.nodeType === 1 && l(c);
        else u.type === "attributes" && l(u.target);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress"]
    });
  }
  o();
  function e() {
    const s = this, h = new MutationObserver(function(u) {
      for (const c of u)
        (c.attributeName === "data-ln-circular-progress" || c.attributeName === "data-ln-circular-progress-max") && t.call(s);
    });
    h.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = h;
  }
  function t() {
    const s = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, h = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = h > 0 ? s / h * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const c = g - u / 100 * g;
    this.progressCircle.setAttribute("stroke-dashoffset", c);
    const y = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = y !== null ? y : Math.round(u) + "%", E(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: s,
      max: h,
      percentage: u
    });
  }
  window[a] = f, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const d = "data-ln-sortable", a = "lnSortable", p = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function m(r) {
    b(r);
  }
  function b(r) {
    const n = Array.from(r.querySelectorAll("[" + d + "]"));
    r.hasAttribute && r.hasAttribute(d) && n.push(r);
    for (const i of n)
      i[a] || (i[a] = new g(i));
  }
  function g(r) {
    this.dom = r, this.isEnabled = r.getAttribute(d) !== "disabled", this._dragging = null, r.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(i) {
      n.isEnabled && n._handlePointerDown(i);
    }, r.addEventListener("pointerdown", this._onPointerDown), this;
  }
  g.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(d, "");
  }, g.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(d, "disabled");
  }, g.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), E(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function f(r) {
    const n = r[a];
    if (!n) return;
    const i = r.getAttribute(d) !== "disabled";
    i !== n.isEnabled && (n.isEnabled = i);
  }
  g.prototype._handlePointerDown = function(r) {
    let n = r.target.closest("[" + p + "]"), i;
    if (n) {
      for (i = n; i && i.parentElement !== this.dom; )
        i = i.parentElement;
      if (!i || i.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + p + "]")) return;
      for (i = r.target; i && i.parentElement !== this.dom; )
        i = i.parentElement;
      if (!i || i.parentElement !== this.dom) return;
      n = i;
    }
    const e = Array.from(this.dom.children).indexOf(i);
    if (q(this.dom, "ln-sortable:before-drag", {
      item: i,
      index: e
    }).defaultPrevented) return;
    r.preventDefault(), n.setPointerCapture(r.pointerId), this._dragging = i, i.classList.add("ln-sortable--dragging"), i.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), E(this.dom, "ln-sortable:drag-start", {
      item: i,
      index: e
    });
    const s = this, h = function(c) {
      s._handlePointerMove(c);
    }, u = function(c) {
      s._handlePointerEnd(c), n.removeEventListener("pointermove", h), n.removeEventListener("pointerup", u), n.removeEventListener("pointercancel", u);
    };
    n.addEventListener("pointermove", h), n.addEventListener("pointerup", u), n.addEventListener("pointercancel", u);
  }, g.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), i = this._dragging;
    for (const o of n)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const o of n) {
      if (o === i) continue;
      const e = o.getBoundingClientRect(), t = e.top + e.height / 2;
      if (r.clientY >= e.top && r.clientY < t) {
        o.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= t && r.clientY <= e.bottom) {
        o.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, g.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const n = this._dragging, i = Array.from(this.dom.children), o = i.indexOf(n);
    let e = null, t = null;
    for (const s of i) {
      if (s.classList.contains("ln-sortable--drop-before")) {
        e = s, t = "before";
        break;
      }
      if (s.classList.contains("ln-sortable--drop-after")) {
        e = s, t = "after";
        break;
      }
    }
    for (const s of i)
      s.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== n) {
      t === "before" ? this.dom.insertBefore(n, e) : this.dom.insertBefore(n, e.nextElementSibling);
      const h = Array.from(this.dom.children).indexOf(n);
      E(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: o,
        newIndex: h
      });
    }
    this._dragging = null;
  };
  function l() {
    S(function() {
      new MutationObserver(function(n) {
        for (let i = 0; i < n.length; i++) {
          const o = n[i];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const t = o.addedNodes[e];
              t.nodeType === 1 && b(t);
            }
          else o.type === "attributes" && (o.attributeName === d && o.target[a] ? f(o.target) : b(o.target));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-sortable");
  }
  window[a] = m, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "data-ln-confirm", a = "lnConfirm", p = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function b(n) {
    g(n);
  }
  function g(n) {
    const i = Array.from(n.querySelectorAll("[" + d + "]"));
    n.hasAttribute && n.hasAttribute(d) && i.push(n);
    for (const o of i)
      o[a] || (o[a] = new f(o));
  }
  function f(n) {
    this.dom = n, this.confirming = !1, this.originalText = n.textContent.trim(), this.confirmText = n.getAttribute(d) || "Confirm?", this.revertTimer = null;
    const i = this;
    return this._onClick = function(o) {
      i.confirming ? i._reset() : (o.preventDefault(), o.stopImmediatePropagation(), i._enterConfirm());
    }, n.addEventListener("click", this._onClick), this;
  }
  f.prototype._getTimeout = function() {
    const n = parseFloat(this.dom.getAttribute(p));
    return isNaN(n) || n <= 0 ? 3 : n;
  }, f.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true"), this.dom.className.match(/ln-icon-/) && this.originalText === "" ? (this.isIconButton = !0, this.originalIconClass = Array.from(this.dom.classList).find(function(n) {
      return n.startsWith("ln-icon-");
    }), this.originalIconClass && this.dom.classList.remove(this.originalIconClass), this.dom.classList.add("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), E(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const n = this, i = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      n._reset();
    }, i);
  }, f.prototype._reset = function() {
    this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton ? (this.dom.classList.remove("ln-icon-check", "text-success", "ln-confirm-tooltip"), this.originalIconClass && this.dom.classList.add(this.originalIconClass), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1) : this.dom.textContent = this.originalText, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, f.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  };
  function l(n) {
    const i = n[a];
    !i || !i.confirming || i._startTimer();
  }
  function r() {
    S(function() {
      new MutationObserver(function(i) {
        for (let o = 0; o < i.length; o++) {
          const e = i[o];
          if (e.type === "childList")
            for (let t = 0; t < e.addedNodes.length; t++) {
              const s = e.addedNodes[t];
              s.nodeType === 1 && g(s);
            }
          else e.type === "attributes" && (e.attributeName === p && e.target[a] ? l(e.target) : g(e.target));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d, p]
      });
    }, "ln-confirm");
  }
  window[a] = b, r(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const d = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const p = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(l) {
    b(l);
  }
  function b(l) {
    const r = Array.from(l.querySelectorAll("[" + d + "]"));
    l.hasAttribute && l.hasAttribute(d) && r.push(l);
    for (const n of r)
      n[a] || (n[a] = new g(n));
  }
  function g(l) {
    this.dom = l, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = l.getAttribute(d + "-default") || "", this.badgesEl = l.querySelector("[" + d + "-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const r = l.getAttribute(d + "-locales");
    if (this.locales = p, r)
      try {
        this.locales = JSON.parse(r);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const n = this;
    return this._onRequestAdd = function(i) {
      i.detail && i.detail.lang && n.addLanguage(i.detail.lang);
    }, this._onRequestRemove = function(i) {
      i.detail && i.detail.lang && n.removeLanguage(i.detail.lang);
    }, l.addEventListener("ln-translations:request-add", this._onRequestAdd), l.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  g.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const r of l) {
      const n = r.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const i of n)
        i.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, g.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const r of l) {
      const n = r.getAttribute("data-ln-translatable-lang");
      n && n !== this.defaultLang && this.activeLanguages.add(n);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, g.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let r = 0;
    for (const i in this.locales) {
      if (!this.locales.hasOwnProperty(i) || this.activeLanguages.has(i)) continue;
      r++;
      const o = Q("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const e = o.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", i), e.textContent = this.locales[i], e.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(i));
      }), this.menuEl.appendChild(o);
    }
    const n = this.dom.querySelector("[" + d + "-add]");
    n && (n.style.display = r === 0 ? "none" : "");
  }, g.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(r) {
      const n = Q("ln-translations-badge", "ln-translations");
      if (!n) return;
      const i = n.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", r);
      const o = i.querySelector("span");
      o.textContent = l.locales[r] || r.toUpperCase();
      const e = i.querySelector("button");
      e.setAttribute("aria-label", "Remove " + (l.locales[r] || r.toUpperCase())), e.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), l.removeLanguage(r));
      }), l.badgesEl.appendChild(n);
    });
  }, g.prototype.addLanguage = function(l, r) {
    if (this.activeLanguages.has(l)) return;
    const n = this.locales[l] || l;
    if (q(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: n
    }).defaultPrevented) return;
    this.activeLanguages.add(l), r = r || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of o) {
      const t = e.getAttribute("data-ln-translatable"), s = e.getAttribute("data-ln-translations-prefix") || "", h = e.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!h) continue;
      const u = h.cloneNode(!1);
      s ? u.name = s + "[trans][" + l + "][" + t + "]" : u.name = "trans[" + l + "][" + t + "]", u.value = r[t] !== void 0 ? r[t] : "", u.removeAttribute("id"), u.placeholder = n + " translation", u.setAttribute("data-ln-translatable-lang", l);
      const c = e.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), y = c.length > 0 ? c[c.length - 1] : h;
      y.parentNode.insertBefore(u, y.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), E(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: n
    });
  }, g.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || q(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const n = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const i of n)
      i.parentNode.removeChild(i);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), E(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: l
    });
  }, g.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, g.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const l = this.defaultLang, r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const n of r)
      n.getAttribute("data-ln-translatable-lang") !== l && n.parentNode.removeChild(n);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  };
  function f() {
    S(function() {
      new MutationObserver(function(r) {
        for (const n of r)
          if (n.type === "childList")
            for (const i of n.addedNodes)
              i.nodeType === 1 && b(i);
          else n.type === "attributes" && b(n.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-translations");
  }
  window[a] = m, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const d = "data-ln-autosave", a = "lnAutosave", p = "data-ln-autosave-clear", m = "ln-autosave:";
  if (window[a] !== void 0) return;
  function b(e) {
    g(e);
  }
  function g(e) {
    const t = Array.from(e.querySelectorAll("[" + d + "]"));
    e.hasAttribute && e.hasAttribute(d) && t.push(e);
    for (const s of t)
      s[a] || (s[a] = new f(s));
  }
  function f(e) {
    const t = l(e);
    if (!t) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", e);
      return;
    }
    this.dom = e, this.key = t;
    const s = this;
    return this._onFocusout = function(h) {
      const u = h.target;
      r(u) && u.name && s.save();
    }, this._onChange = function(h) {
      const u = h.target;
      r(u) && u.name && s.save();
    }, this._onSubmit = function() {
      s.clear();
    }, this._onReset = function() {
      s.clear();
    }, this._onClearClick = function(h) {
      h.target.closest("[" + p + "]") && s.clear();
    }, e.addEventListener("focusout", this._onFocusout), e.addEventListener("change", this._onChange), e.addEventListener("submit", this._onSubmit), e.addEventListener("reset", this._onReset), e.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  f.prototype.save = function() {
    const e = n(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(e));
    } catch {
      return;
    }
    E(this.dom, "ln-autosave:saved", { target: this.dom, data: e });
  }, f.prototype.restore = function() {
    let e;
    try {
      e = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!e) return;
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      return;
    }
    q(this.dom, "ln-autosave:before-restore", { target: this.dom, data: t }).defaultPrevented || (i(this.dom, t), E(this.dom, "ln-autosave:restored", { target: this.dom, data: t }));
  }, f.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    E(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, f.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), E(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function l(e) {
    const s = e.getAttribute(d) || e.id;
    return s ? m + window.location.pathname + ":" + s : null;
  }
  function r(e) {
    const t = e.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }
  function n(e) {
    const t = {}, s = e.elements;
    for (let h = 0; h < s.length; h++) {
      const u = s[h];
      if (!(!u.name || u.disabled || u.type === "file" || u.type === "submit" || u.type === "button"))
        if (u.type === "checkbox")
          t[u.name] || (t[u.name] = []), u.checked && t[u.name].push(u.value);
        else if (u.type === "radio")
          u.checked && (t[u.name] = u.value);
        else if (u.type === "select-multiple") {
          t[u.name] = [];
          for (let c = 0; c < u.options.length; c++)
            u.options[c].selected && t[u.name].push(u.options[c].value);
        } else
          t[u.name] = u.value;
    }
    return t;
  }
  function i(e, t) {
    const s = e.elements, h = [];
    for (let u = 0; u < s.length; u++) {
      const c = s[u];
      if (!c.name || !(c.name in t) || c.type === "file" || c.type === "submit" || c.type === "button") continue;
      const y = t[c.name];
      if (c.type === "checkbox")
        c.checked = Array.isArray(y) && y.indexOf(c.value) !== -1, h.push(c);
      else if (c.type === "radio")
        c.checked = c.value === y, h.push(c);
      else if (c.type === "select-multiple") {
        if (Array.isArray(y))
          for (let v = 0; v < c.options.length; v++)
            c.options[v].selected = y.indexOf(c.options[v].value) !== -1;
        h.push(c);
      } else
        c.value = y, h.push(c);
    }
    for (let u = 0; u < h.length; u++)
      h[u].dispatchEvent(new Event("input", { bubbles: !0 })), h[u].dispatchEvent(new Event("change", { bubbles: !0 })), h[u].lnSelect && h[u].lnSelect.setValue && h[u].lnSelect.setValue(t[h[u].name]);
  }
  function o() {
    S(function() {
      new MutationObserver(function(t) {
        for (let s = 0; s < t.length; s++)
          if (t[s].type === "childList") {
            const h = t[s].addedNodes;
            for (let u = 0; u < h.length; u++)
              h[u].nodeType === 1 && g(h[u]);
          } else t[s].type === "attributes" && g(t[s].target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-autosave");
  }
  window[a] = b, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const d = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
  function p(f) {
    m(f);
  }
  function m(f) {
    const l = Array.from(f.querySelectorAll("[" + d + "]"));
    f.hasAttribute && f.hasAttribute(d) && l.push(f);
    for (const r of l)
      r[a] || (r[a] = new b(r));
  }
  function b(f) {
    if (f.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", f.tagName), this;
    this.dom = f;
    const l = this;
    return this._onInput = function() {
      l._resize();
    }, f.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  };
  function g() {
    S(function() {
      new MutationObserver(function(l) {
        for (const r of l)
          if (r.type === "childList")
            for (const n of r.addedNodes)
              n.nodeType === 1 && m(n);
          else r.type === "attributes" && m(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [d]
      });
    }, "ln-autoresize");
  }
  window[a] = p, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
