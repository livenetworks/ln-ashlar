(function() {
  const p = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0)
    return;
  function b(e) {
    if (console.log(e), !e.hasAttribute(p) || e[c])
      return;
    e[c] = !0, console.log("constructor called with:", e);
    let t = h(e);
    console.log("Items found:", t), E(t.links), y(t.forms);
  }
  function E(e) {
    e.forEach(function(t) {
      if (t._lnAjaxAttached)
        return;
      const o = t.getAttribute("href");
      o && o.includes("#") || (t._lnAjaxAttached = !0, t.addEventListener("click", function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1)
          return;
        i.preventDefault();
        const s = t.getAttribute("href");
        s && v("GET", s, null, t);
      }));
    });
  }
  function y(e) {
    e.forEach(function(t) {
      t._lnAjaxAttached || (t._lnAjaxAttached = !0, t.addEventListener("submit", function(o) {
        o.preventDefault();
        const i = t.method.toUpperCase(), s = t.action, r = new FormData(t);
        console.log("Form submitted:", i, s), t.querySelectorAll('button, input[type="submit"]').forEach(function(d) {
          d.disabled = !0;
        }), v(i, s, r, t, function() {
          t.querySelectorAll('button, input[type="submit"]').forEach(function(d) {
            d.disabled = !1;
          });
        });
      }));
    });
  }
  function v(e, t, o, i, s) {
    console.log("Making AJAX request:", e, t), i.classList.add("ln-ajax--loading");
    let r = t;
    const d = document.querySelector('meta[name="csrf-token"]'), f = d ? d.getAttribute("content") : null;
    o instanceof FormData && f && o.append("_token", f);
    const m = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (f && (m.headers["X-CSRF-TOKEN"] = f), e === "GET" && o) {
      const u = new URLSearchParams(o);
      r = t + (t.includes("?") ? "&" : "?") + u.toString();
    } else e !== "GET" && o && (m.body = o);
    fetch(r, m).then((u) => u.json()).then((u) => {
      if (u.title && (document.title = u.title), u.content)
        for (let g in u.content) {
          const L = document.getElementById(g);
          L && (L.innerHTML = u.content[g]);
        }
      if (i.tagName === "A") {
        let g = i.getAttribute("href");
        g && window.history.pushState({ ajax: !0 }, "", g);
      } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", r);
      u.message && window.lnToast && window.lnToast.enqueue({
        type: u.message.type,
        title: u.message.title,
        message: u.message.body,
        data: u.message.data
      }), i.classList.remove("ln-ajax--loading"), s && s();
    }).catch((u) => {
      console.error("AJAX error:", u), i.classList.remove("ln-ajax--loading"), s && s();
    });
  }
  function h(e) {
    let t = {
      links: [],
      forms: []
    };
    if (e.tagName === "A" && e.getAttribute(p) !== "false")
      t.links.push(e);
    else if (e.tagName === "FORM" && e.getAttribute(p) !== "false")
      t.forms.push(e);
    else {
      let o = e.querySelectorAll('a:not([data-ln-ajax="false"])') || [], i = e.querySelectorAll('form:not([data-ln-ajax="false"])') || [];
      t.links = Array.from(o), t.forms = Array.from(i);
    }
    return t;
  }
  function a() {
    new MutationObserver(function(t) {
      t.forEach(function(o) {
        o.type == "childList" && o.addedNodes.forEach(function(i) {
          i.nodeType === 1 && (b(i), i.hasAttribute && !i.hasAttribute(p) && i.querySelectorAll("[" + p + "]").forEach(function(r) {
            b(r);
          }));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  a(), window[c] = b;
  function n() {
    document.querySelectorAll("[" + p + "]").forEach(function(t) {
      b(t);
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const p = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0)
    return;
  function b(n) {
    const e = document.getElementById(n);
    if (!e) {
      console.warn('Modal with ID "' + n + '" not found');
      return;
    }
    e.classList.contains("ln-modal--open") ? (e.classList.remove("ln-modal--open"), document.body.classList.remove("ln-modal-open")) : (e.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"));
  }
  function E(n) {
    const e = document.getElementById(n);
    e && (e.classList.remove("ln-modal--open"), document.body.classList.remove("ln-modal-open"));
  }
  function y(n) {
    const e = n.querySelectorAll("[data-ln-modal-close]"), t = n.id;
    e.forEach(function(o) {
      o.addEventListener("click", function(i) {
        i.preventDefault(), E(t);
      });
    });
  }
  function v(n) {
    n.forEach(function(e) {
      e.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1)
          return;
        t.preventDefault();
        const o = e.getAttribute(p);
        o && b(o);
      });
    });
  }
  function h() {
    const n = document.querySelectorAll("[" + p + "]");
    v(n), document.querySelectorAll("[id]").forEach(function(t) {
      t.classList.contains("ln-modal") && y(t);
    }), document.addEventListener("keydown", function(t) {
      (t.key === "Escape" || t.keyCode === 27) && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(i) {
        E(i.id);
      });
    });
  }
  function a() {
    new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(o) {
          if (o.nodeType === 1) {
            o.hasAttribute(p) && v([o]);
            const i = o.querySelectorAll("[" + p + "]");
            i.length > 0 && v(i), o.id && o.classList.contains("ln-modal") && y(o);
            const s = o.querySelectorAll(".ln-modal");
            s.length > 0 && s.forEach(function(r) {
              y(r);
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
    toggle: b,
    close: E,
    open: function(n) {
      const e = document.getElementById(n);
      e && (e.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"));
    }
  }, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
(function() {
  const p = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0)
    return;
  const b = /* @__PURE__ */ new WeakMap();
  function E(n) {
    if (!n.hasAttribute(p) || b.has(n)) return;
    const e = n.getAttribute(p);
    if (!e) return;
    const t = y(n, e);
    b.set(n, t);
  }
  function y(n, e) {
    let t = Array.from(n.querySelectorAll("a"));
    h(t, e, window.location.pathname);
    const o = function() {
      t = Array.from(n.querySelectorAll("a")), h(t, e, window.location.pathname);
    };
    window.addEventListener("popstate", o);
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments), t = Array.from(n.querySelectorAll("a")), h(t, e, window.location.pathname);
    };
    const s = new MutationObserver(function(r) {
      r.forEach(function(d) {
        d.type === "childList" && (d.addedNodes.forEach(function(f) {
          if (f.nodeType === 1) {
            if (f.tagName === "A")
              t.push(f), h([f], e, window.location.pathname);
            else if (f.querySelectorAll) {
              const m = Array.from(f.querySelectorAll("a"));
              t = t.concat(m), h(m, e, window.location.pathname);
            }
          }
        }), d.removedNodes.forEach(function(f) {
          if (f.nodeType === 1) {
            if (f.tagName === "A")
              t = t.filter(function(m) {
                return m !== f;
              });
            else if (f.querySelectorAll) {
              const m = Array.from(f.querySelectorAll("a"));
              t = t.filter(function(u) {
                return !m.includes(u);
              });
            }
          }
        }));
      });
    });
    return s.observe(n, {
      childList: !0,
      subtree: !0
    }), {
      navElement: n,
      activeClass: e,
      observer: s
    };
  }
  function v(n) {
    try {
      return new URL(n, window.location.origin).pathname.replace(/\/$/, "") || "/";
    } catch {
      return n.replace(/\/$/, "") || "/";
    }
  }
  function h(n, e, t) {
    const o = v(t);
    n.forEach(function(i) {
      const s = i.getAttribute("href");
      if (!s) return;
      const r = v(s);
      i.classList.remove(e);
      const d = r === o, f = r !== "/" && o.startsWith(r + "/");
      (d || f) && i.classList.add(e);
    });
  }
  window[c] = E;
  function a() {
    document.querySelectorAll("[" + p + "]").forEach(function(e) {
      E(e);
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const p = window.TomSelect;
  if (!p) {
    window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const c = /* @__PURE__ */ new WeakMap();
  function b(h) {
    if (c.has(h))
      return;
    const a = h.getAttribute("data-ln-select");
    let n = {};
    if (a && a.trim() !== "")
      try {
        n = JSON.parse(a);
      } catch (o) {
        console.warn("Invalid JSON in data-ln-select attribute:", o);
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
      placeholder: h.getAttribute("placeholder") || "Select...",
      // Load throttle for search
      loadThrottle: 300
    }, ...n };
    try {
      const o = new p(h, t);
      c.set(h, o);
      const i = h.closest("form");
      i && i.addEventListener("reset", () => {
        setTimeout(() => {
          o.clear(), o.clearOptions(), o.sync();
        }, 0);
      });
    } catch (o) {
      console.error("Failed to initialize Tom Select:", o);
    }
  }
  function E(h) {
    const a = c.get(h);
    a && (a.destroy(), c.delete(h));
  }
  function y() {
    document.querySelectorAll("select[data-ln-select]").forEach(b);
  }
  function v() {
    new MutationObserver((a) => {
      a.forEach((n) => {
        n.addedNodes.forEach((e) => {
          e.nodeType === 1 && (e.matches && e.matches("select[data-ln-select]") && b(e), e.querySelectorAll && e.querySelectorAll("select[data-ln-select]").forEach(b));
        }), n.removedNodes.forEach((e) => {
          e.nodeType === 1 && (e.matches && e.matches("select[data-ln-select]") && E(e), e.querySelectorAll && e.querySelectorAll("select[data-ln-select]").forEach(E));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    y(), v();
  }) : (y(), v()), window.lnSelect = {
    initialize: b,
    destroy: E,
    getInstance: (h) => c.get(h)
  };
})();
(function() {
  const p = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function b(a = document.body) {
    E(a);
  }
  function E(a) {
    if (a.nodeType !== 1) return;
    let n = Array.from(a.querySelectorAll("[" + p + "]"));
    a.hasAttribute && a.hasAttribute(p) && n.push(a), n.forEach(function(e) {
      e[c] || (e[c] = new y(e));
    });
  }
  function y(a) {
    return this.dom = a, v.call(this), this;
  }
  function v() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const a of this.tabs) {
      const n = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      n && (this.mapTabs[n] = a);
    }
    for (const a of this.panels) {
      const n = (a.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = a);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.tabs.forEach((a) => {
      a.addEventListener("click", () => {
        const n = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        n && (location.hash === "#" + n ? this.activate(n) : location.hash = n);
      });
    }), this._hashHandler = () => {
      const a = (location.hash || "").replace("#", "").toLowerCase();
      this.activate(a || this.defaultKey);
    }, window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
  }
  y.prototype.activate = function(a) {
    var n;
    (!a || !(a in this.mapPanels)) && (a = this.defaultKey);
    for (const e in this.mapTabs) {
      const t = this.mapTabs[e], o = e === a;
      t.setAttribute("data-active", o ? "true" : "false"), t.setAttribute("aria-selected", o ? "true" : "false");
    }
    for (const e in this.mapPanels) {
      const t = this.mapPanels[e], o = e === a;
      t.classList.toggle("hidden", !o), t.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (n = this.mapPanels[a]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
  };
  function h() {
    new MutationObserver(function(n) {
      n.forEach(function(e) {
        e.addedNodes.forEach(function(t) {
          E(t);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  h(), window[c] = b, b(document.body);
})();
(function() {
  const p = "data-ln-toast", c = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function E(s = document.body) {
    return y(s), o;
  }
  function y(s) {
    if (!s || s.nodeType !== 1) return;
    let r = Array.from(s.querySelectorAll("[" + p + "]"));
    s.hasAttribute && s.hasAttribute(p) && r.push(s), r.forEach((d) => {
      d[c] || new v(d);
    });
  }
  function v(s) {
    return this.dom = s, s[c] = this, this.timeoutDefault = parseInt(s.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(s.getAttribute("data-ln-toast-max") || "5", 10), Array.from(s.querySelectorAll("[data-ln-toast-item]")).forEach((r) => {
      h(r);
    }), this;
  }
  function h(s) {
    const r = ((s.getAttribute("data-type") || "info") + "").toLowerCase(), d = s.getAttribute("data-title"), f = (s.innerText || s.textContent || "").trim();
    s.className = "ln-toast__item", s.removeAttribute("data-ln-toast-item");
    const m = document.createElement("div");
    m.className = "ln-toast__card ln-toast__card--" + r, m.setAttribute("role", r === "error" ? "alert" : "status"), m.setAttribute("aria-live", r === "error" ? "assertive" : "polite");
    const u = document.createElement("div");
    u.className = "ln-toast__side", u.innerHTML = b[r] || b.info;
    const g = document.createElement("div");
    g.className = "ln-toast__content";
    const L = document.createElement("div");
    L.className = "ln-toast__head";
    const w = document.createElement("strong");
    w.className = "ln-toast__title", w.textContent = d || (r === "success" ? "Success" : r === "error" ? "Error" : r === "warn" ? "Warning" : "Information");
    const C = document.createElement("button");
    if (C.type = "button", C.className = "ln-toast__close", C.setAttribute("aria-label", "Close"), C.innerHTML = "&times;", C.addEventListener("click", () => n(s)), L.appendChild(w), g.appendChild(L), g.appendChild(C), f) {
      const S = document.createElement("div");
      S.className = "ln-toast__body";
      const x = document.createElement("p");
      x.textContent = f, S.appendChild(x), g.appendChild(S);
    }
    m.appendChild(u), m.appendChild(g), s.innerHTML = "", s.appendChild(m), requestAnimationFrame(() => s.classList.add("ln-toast__item--in"));
  }
  function a(s, r) {
    for (; s.dom.children.length >= s.max; ) s.dom.removeChild(s.dom.firstElementChild);
    s.dom.appendChild(r), requestAnimationFrame(() => r.classList.add("ln-toast__item--in"));
  }
  function n(s) {
    !s || !s.parentNode || (clearTimeout(s._timer), s.classList.remove("ln-toast__item--in"), s.classList.add("ln-toast__item--out"), setTimeout(() => {
      s.parentNode && s.parentNode.removeChild(s);
    }, 200));
  }
  function e(s = {}) {
    let r = s.container;
    if (typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + p + "]") || document.getElementById("ln-toast-container")), !r) return null;
    const d = r[c] || new v(r), f = Number.isFinite(s.timeout) ? s.timeout : d.timeoutDefault, m = (s.type || "info").toLowerCase(), u = document.createElement("li");
    u.className = "ln-toast__item";
    const g = document.createElement("div");
    g.className = "ln-toast__card ln-toast__card--" + m, g.setAttribute("role", m === "error" ? "alert" : "status"), g.setAttribute("aria-live", m === "error" ? "assertive" : "polite");
    const L = document.createElement("div");
    L.className = "ln-toast__side", L.innerHTML = b[m] || b.info;
    const w = document.createElement("div");
    w.className = "ln-toast__content";
    const C = document.createElement("div");
    C.className = "ln-toast__head";
    const S = document.createElement("strong");
    S.className = "ln-toast__title", S.textContent = s.title || (m === "success" ? "Success" : m === "error" ? "Error" : m === "warn" ? "Warning" : "Information");
    const x = document.createElement("button");
    if (x.type = "button", x.className = "ln-toast__close", x.setAttribute("aria-label", "Close"), x.innerHTML = "&times;", x.addEventListener("click", () => n(u)), C.appendChild(S), w.appendChild(C), w.appendChild(x), s.message || s.data && s.data.errors) {
      const q = document.createElement("div");
      if (q.className = "ln-toast__body", s.message)
        if (Array.isArray(s.message)) {
          const O = document.createElement("ul");
          s.message.forEach(function(D) {
            const l = document.createElement("li");
            l.textContent = D, O.appendChild(l);
          }), q.appendChild(O);
        } else {
          const O = document.createElement("p");
          O.textContent = s.message, O.style.margin = "0", q.appendChild(O);
        }
      if (s.data && s.data.errors) {
        const O = document.createElement("ul");
        Object.values(s.data.errors).flat().forEach((D) => {
          const l = document.createElement("li");
          l.textContent = D, O.appendChild(l);
        }), q.appendChild(O);
      }
      w.appendChild(q);
    }
    return g.appendChild(L), g.appendChild(w), u.appendChild(g), a(d, u), f > 0 && (u._timer = setTimeout(() => n(u), f)), u;
  }
  function t(s) {
    let r = s;
    typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + p + "]") || document.getElementById("ln-toast-container")), r && Array.from(r.children).forEach(n);
  }
  const o = function(s) {
    return E(s);
  };
  o.enqueue = e, o.clear = t, new MutationObserver((s) => {
    s.forEach((r) => r.addedNodes.forEach((d) => y(d)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[c] = o, window.addEventListener("ln-toast:enqueue", function(s) {
    s.detail && o.enqueue(s.detail);
  }), E(document.body);
})();
(function() {
  const p = "data-ln-upload", c = "lnUpload", b = "data-ln-upload-dict", E = "data-ln-upload-accept", y = "data-ln-upload-context";
  if (window[c] !== void 0)
    return;
  function v(r, d) {
    const f = r.querySelector("[" + b + '="' + d + '"]');
    return f ? f.textContent : d;
  }
  function h(r) {
    if (r === 0) return "0 B";
    const d = 1024, f = ["B", "KB", "MB", "GB"], m = Math.floor(Math.log(r) / Math.log(d));
    return parseFloat((r / Math.pow(d, m)).toFixed(1)) + " " + f[m];
  }
  function a(r) {
    return r.split(".").pop().toLowerCase();
  }
  function n(r) {
    return r === "docx" && (r = "doc"), ["pdf", "doc", "epub"].includes(r) ? "ln-icon-file-" + r : "ln-icon-file";
  }
  function e(r, d) {
    if (!d) return !0;
    const f = "." + a(r.name);
    return d.split(",").map(function(u) {
      return u.trim().toLowerCase();
    }).includes(f.toLowerCase());
  }
  function t(r, d, f) {
    r.dispatchEvent(new CustomEvent(d, {
      bubbles: !0,
      detail: f
    }));
  }
  function o(r) {
    if (r.hasAttribute("data-ln-upload-initialized")) return;
    r.setAttribute("data-ln-upload-initialized", "true");
    const d = r.querySelector(".ln-upload__zone"), f = r.querySelector(".ln-upload__list"), m = r.getAttribute(E) || "";
    let u = r.querySelector('input[type="file"]');
    u || (u = document.createElement("input"), u.type = "file", u.multiple = !0, u.style.display = "none", m && (u.accept = m.split(",").map(function(l) {
      return l = l.trim(), l.startsWith(".") ? l : "." + l;
    }).join(",")), r.appendChild(u));
    const g = r.getAttribute(p) || "/files/upload", L = r.getAttribute(y) || "", w = /* @__PURE__ */ new Map();
    let C = 0;
    function S() {
      const l = document.querySelector('meta[name="csrf-token"]');
      return l ? l.getAttribute("content") : "";
    }
    function x(l) {
      if (!e(l, m)) {
        const A = v(r, "invalid-type");
        t(r, "ln-upload:invalid", {
          file: l,
          message: A
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Invalid File",
            message: A || "This file type is not allowed"
          }
        }));
        return;
      }
      const _ = "file-" + ++C, T = a(l.name), B = n(T), N = document.createElement("li");
      N.className = "ln-upload__item ln-upload__item--uploading " + B, N.setAttribute("data-file-id", _);
      const z = document.createElement("span");
      z.className = "ln-upload__name", z.textContent = l.name;
      const I = document.createElement("span");
      I.className = "ln-upload__size", I.textContent = "0%";
      const k = document.createElement("button");
      k.type = "button", k.className = "ln-upload__remove", k.title = v(r, "remove"), k.textContent = "×", k.disabled = !0;
      const U = document.createElement("div");
      U.className = "ln-upload__progress";
      const F = document.createElement("div");
      F.className = "ln-upload__progress-bar", U.appendChild(F), N.appendChild(z), N.appendChild(I), N.appendChild(k), N.appendChild(U), f.appendChild(N);
      const H = new FormData();
      H.append("file", l), H.append("context", L);
      const M = new XMLHttpRequest();
      M.upload.addEventListener("progress", function(A) {
        if (A.lengthComputable) {
          const j = Math.round(A.loaded / A.total * 100);
          F.style.width = j + "%", I.textContent = j + "%";
        }
      }), M.addEventListener("load", function() {
        if (M.status >= 200 && M.status < 300) {
          var A;
          try {
            A = JSON.parse(M.responseText);
          } catch {
            P("Invalid response");
            return;
          }
          N.classList.remove("ln-upload__item--uploading"), I.textContent = h(A.size || l.size), k.disabled = !1, w.set(_, {
            serverId: A.id,
            name: A.name,
            size: A.size
          }), q(), t(r, "ln-upload:uploaded", {
            localId: _,
            serverId: A.id,
            name: A.name
          });
        } else {
          var j = "Upload failed";
          try {
            var R = JSON.parse(M.responseText);
            j = R.message || j;
          } catch {
          }
          P(j);
        }
      }), M.addEventListener("error", function() {
        P("Network error");
      });
      function P(A) {
        N.classList.remove("ln-upload__item--uploading"), N.classList.add("ln-upload__item--error"), F.style.width = "100%", I.textContent = v(r, "error"), k.disabled = !1, t(r, "ln-upload:error", {
          file: l,
          message: A
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: A || v(r, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      M.open("POST", g), M.setRequestHeader("X-CSRF-TOKEN", S()), M.setRequestHeader("Accept", "application/json"), M.send(H);
    }
    function q() {
      r.querySelectorAll('input[name="file_ids[]"]').forEach(function(l) {
        l.remove();
      }), w.forEach(function(l) {
        const _ = document.createElement("input");
        _.type = "hidden", _.name = "file_ids[]", _.value = l.serverId, r.appendChild(_);
      });
    }
    function O(l) {
      const _ = w.get(l), T = f.querySelector('[data-file-id="' + l + '"]');
      if (!_ || !_.serverId) {
        T && T.remove(), w.delete(l), q();
        return;
      }
      T && T.classList.add("ln-upload__item--deleting"), fetch("/files/" + _.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": S(),
          Accept: "application/json"
        }
      }).then((B) => {
        B.status === 200 ? (T && T.remove(), w.delete(l), q(), t(r, "ln-upload:removed", {
          localId: l,
          serverId: _.serverId
        })) : (T && T.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: v(r, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((B) => {
        console.error("Delete error:", B), T && T.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function D(l) {
      Array.from(l).forEach(function(_) {
        x(_);
      }), u.value = "";
    }
    d.addEventListener("click", function() {
      u.click();
    }), u.addEventListener("change", function() {
      D(this.files);
    }), d.addEventListener("dragenter", function(l) {
      l.preventDefault(), l.stopPropagation(), d.classList.add("ln-upload__zone--dragover");
    }), d.addEventListener("dragover", function(l) {
      l.preventDefault(), l.stopPropagation(), d.classList.add("ln-upload__zone--dragover");
    }), d.addEventListener("dragleave", function(l) {
      l.preventDefault(), l.stopPropagation(), d.classList.remove("ln-upload__zone--dragover");
    }), d.addEventListener("drop", function(l) {
      l.preventDefault(), l.stopPropagation(), d.classList.remove("ln-upload__zone--dragover"), D(l.dataTransfer.files);
    }), f.addEventListener("click", function(l) {
      if (l.target.classList.contains("ln-upload__remove")) {
        const _ = l.target.closest(".ln-upload__item");
        _ && O(_.getAttribute("data-file-id"));
      }
    }), r.lnUploadAPI = {
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
        }), w.clear(), f.innerHTML = "", q(), t(r, "ln-upload:cleared", {});
      }
    };
  }
  function i() {
    document.querySelectorAll("[" + p + "]").forEach(o);
  }
  function s() {
    new MutationObserver(function(d) {
      d.forEach(function(f) {
        f.type === "childList" && f.addedNodes.forEach(function(m) {
          m.nodeType === 1 && (m.hasAttribute(p) && o(m), m.querySelectorAll("[" + p + "]").forEach(o));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[c] = {
    init: o,
    initAll: i
  }, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const p = "lnExternalLinks";
  if (window[p] !== void 0)
    return;
  function c(n, e, t) {
    n.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      detail: t
    }));
  }
  function b(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function E(n) {
    n.getAttribute("data-ln-external-link") !== "processed" && b(n) && (n.target = "_blank", n.rel = "noopener noreferrer", n.setAttribute("data-ln-external-link", "processed"), c(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    }));
  }
  function y(n) {
    n = n || document.body, n.querySelectorAll("a, area").forEach(function(t) {
      E(t);
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
  function h() {
    new MutationObserver(function(e) {
      e.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(o) {
          if (o.nodeType === 1) {
            o.matches && (o.matches("a") || o.matches("area")) && E(o);
            const i = o.querySelectorAll && o.querySelectorAll("a, area");
            i && i.forEach(E);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function a() {
    v(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      y();
    }) : y();
  }
  window[p] = {
    process: y
  }, a();
})();
(function() {
  const p = "[data-ln-box]", c = "lnBox";
  if (window[c] !== void 0)
    return;
  function b(t) {
    E(t);
  }
  function E(t) {
    let o = t.querySelectorAll(p) || [];
    t.hasAttribute("data-ln-box") && o.push(t), o.forEach(function(i) {
      i[c] || (i[c] = new y(i));
    });
  }
  function y(t) {
    return this.dom = t, h.call(this), a.call(this), this;
  }
  function v() {
    new MutationObserver(function(o) {
      o.forEach(function(i) {
        i.type === "childList" && i.addedNodes.forEach(function(s) {
          s.nodeType === 1 && E(s);
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  v();
  function h() {
    return this.buttons = {}, this.buttons.collapse = this.dom.querySelectorAll('[data-ln-box-action="collapse"]'), this.buttons.expand = this.dom.querySelectorAll('[data-ln-box-action="expand"]'), this;
  }
  function a() {
    this.buttons.collapse.forEach((t) => {
      t.addEventListener("click", (o) => {
        n.call(this);
      }, !1);
    }), this.buttons.expand.forEach((t) => {
      t.addEventListener("click", (o) => {
        e.call(this);
      }, !1);
    });
  }
  function n() {
    this.dom.setAttribute("data-ln-box", "collapsed");
  }
  function e() {
    this.dom.setAttribute("data-ln-box", "");
  }
  window[c] = b, y.prototype.collapse = n, y.prototype.expand = e, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnBox(document.body);
  }) : window.lnBox(document.body);
})();
(function() {
  const p = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0)
    return;
  function b(e) {
    var t = e.getAttribute("data-ln-progress");
    return t !== null && t !== "";
  }
  function E(e) {
    y(e);
  }
  function y(e) {
    var t = e.querySelectorAll(p) || [];
    t.forEach(function(o) {
      b(o) && !o[c] && (o[c] = new v(o));
    }), e.hasAttribute && e.hasAttribute("data-ln-progress") && b(e) && !e[c] && (e[c] = new v(e));
  }
  function v(e) {
    return this.dom = e, n.call(this), a.call(this), this;
  }
  function h() {
    var e = new MutationObserver(function(t) {
      t.forEach(function(o) {
        o.type === "childList" && o.addedNodes.forEach(function(i) {
          i.nodeType === 1 && y(i);
        });
      });
    });
    e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  h();
  function a() {
    var e = this, t = new MutationObserver(function(o) {
      o.forEach(function(i) {
        (i.attributeName === "data-ln-progress" || i.attributeName === "data-ln-progress-max") && n.call(e);
      });
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    });
  }
  function n() {
    var e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100, o = t > 0 ? e / t * 100 : 0;
    o < 0 && (o = 0), o > 100 && (o = 100), this.dom.style.width = o + "%";
  }
  window[c] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    window.lnProgress(document.body);
  }) : window.lnProgress(document.body);
})();
