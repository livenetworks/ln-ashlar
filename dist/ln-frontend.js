import X from "tom-select";
(function() {
  const u = "data-ln-ajax", l = "lnAjax";
  if (window[l] != null || window[l] != null)
    return;
  function b(n) {
    if (console.log(n), !n.hasAttribute(u) || n[l])
      return;
    n[l] = !0, console.log("constructor called with:", n);
    let t = v(n);
    console.log("Items found:", t), w(t.links), E(t.forms);
  }
  function w(n) {
    n.forEach(function(t) {
      if (t._lnAjaxAttached)
        return;
      const r = t.getAttribute("href");
      r && r.includes("#") || (t._lnAjaxAttached = !0, t.addEventListener("click", function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1)
          return;
        i.preventDefault();
        const e = t.getAttribute("href");
        e && f("GET", e, null, t);
      }));
    });
  }
  function E(n) {
    n.forEach(function(t) {
      t._lnAjaxAttached || (t._lnAjaxAttached = !0, t.addEventListener("submit", function(r) {
        r.preventDefault();
        const i = t.method.toUpperCase(), e = t.action, s = new FormData(t);
        console.log("Form submitted:", i, e), t.querySelectorAll('button, input[type="submit"]').forEach(function(c) {
          c.disabled = !0;
        }), f(i, e, s, t, function() {
          t.querySelectorAll('button, input[type="submit"]').forEach(function(c) {
            c.disabled = !1;
          });
        });
      }));
    });
  }
  function f(n, t, r, i, e) {
    console.log("Making AJAX request:", n, t), i.classList.add("ln-ajax--loading");
    let s = t;
    const c = document.querySelector('meta[name="csrf-token"]'), h = c ? c.getAttribute("content") : null;
    r instanceof FormData && h && r.append("_token", h);
    const p = {
      method: n,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (h && (p.headers["X-CSRF-TOKEN"] = h), n === "GET" && r) {
      const m = new URLSearchParams(r);
      s = t + (t.includes("?") ? "&" : "?") + m.toString();
    } else n !== "GET" && r && (p.body = r);
    fetch(s, p).then((m) => m.json()).then((m) => {
      if (m.title && (document.title = m.title), m.content)
        for (let g in m.content) {
          const L = document.getElementById(g);
          L && (L.innerHTML = m.content[g]);
        }
      if (i.tagName === "A") {
        let g = i.getAttribute("href");
        g && window.history.pushState({ ajax: !0 }, "", g);
      } else i.tagName === "FORM" && i.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", s);
      m.message && window.lnToast && window.lnToast.enqueue({
        type: m.message.type,
        title: m.message.title,
        message: m.message.body,
        data: m.message.data
      }), i.classList.remove("ln-ajax--loading"), e && e();
    }).catch((m) => {
      console.error("AJAX error:", m), i.classList.remove("ln-ajax--loading"), e && e();
    });
  }
  function v(n) {
    let t = {
      links: [],
      forms: []
    };
    if (n.tagName === "A" && n.getAttribute(u) !== "false")
      t.links.push(n);
    else if (n.tagName === "FORM" && n.getAttribute(u) !== "false")
      t.forms.push(n);
    else {
      let r = n.querySelectorAll('a:not([data-ln-ajax="false"])') || [], i = n.querySelectorAll('form:not([data-ln-ajax="false"])') || [];
      t.links = Array.from(r), t.forms = Array.from(i);
    }
    return t;
  }
  function a() {
    new MutationObserver(function(t) {
      t.forEach(function(r) {
        r.type == "childList" && r.addedNodes.forEach(function(i) {
          i.nodeType === 1 && (b(i), i.hasAttribute && !i.hasAttribute(u) && i.querySelectorAll("[" + u + "]").forEach(function(s) {
            b(s);
          }));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  a(), window[l] = b;
  function o() {
    document.querySelectorAll("[" + u + "]").forEach(function(t) {
      b(t);
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const u = "data-ln-modal", l = "lnModal";
  if (window[l] != null || window[l] != null)
    return;
  function b(o) {
    const n = document.getElementById(o);
    if (!n) {
      console.warn('Modal with ID "' + o + '" not found');
      return;
    }
    n.classList.contains("ln-modal--open") ? (n.classList.remove("ln-modal--open"), document.body.classList.remove("ln-modal-open")) : (n.classList.add("ln-modal--open"), document.body.classList.add("ln-modal-open"));
  }
  function w(o) {
    const n = document.getElementById(o);
    n && (n.classList.remove("ln-modal--open"), document.body.classList.remove("ln-modal-open"));
  }
  function E(o) {
    const n = o.querySelectorAll("[data-ln-modal-close]"), t = o.id;
    n.forEach(function(r) {
      r.addEventListener("click", function(i) {
        i.preventDefault(), w(t);
      });
    });
  }
  function f(o) {
    o.forEach(function(n) {
      n.addEventListener("click", function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1)
          return;
        t.preventDefault();
        const r = n.getAttribute(u);
        r && b(r);
      });
    });
  }
  function v() {
    const o = document.querySelectorAll("[" + u + "]");
    f(o), document.querySelectorAll("[id]").forEach(function(t) {
      t.classList.contains("ln-modal") && E(t);
    }), document.addEventListener("keydown", function(t) {
      (t.key === "Escape" || t.keyCode === 27) && document.querySelectorAll(".ln-modal.ln-modal--open").forEach(function(i) {
        w(i.id);
      });
    });
  }
  function a() {
    new MutationObserver(function(n) {
      n.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(r) {
          if (r.nodeType === 1) {
            r.hasAttribute(u) && f([r]);
            const i = r.querySelectorAll("[" + u + "]");
            i.length > 0 && f(i), r.id && r.classList.contains("ln-modal") && E(r);
            const e = r.querySelectorAll(".ln-modal");
            e.length > 0 && e.forEach(function(s) {
              E(s);
            });
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[l] = {
    toggle: b,
    close: w,
    open: function(o) {
      const n = document.getElementById(o);
      n && (n.classList.add("modal--open"), document.body.classList.add("modal-open"));
    }
  }, a(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", v) : v();
})();
(function() {
  const u = "data-ln-nav", l = "lnNav";
  if (window[l] != null || window[l] != null)
    return;
  const b = /* @__PURE__ */ new WeakMap();
  function w(o) {
    if (!o.hasAttribute(u) || b.has(o)) return;
    const n = o.getAttribute(u);
    if (!n) return;
    const t = E(o, n);
    b.set(o, t);
  }
  function E(o, n) {
    let t = Array.from(o.querySelectorAll("a"));
    v(t, n, window.location.pathname);
    const r = function() {
      t = Array.from(o.querySelectorAll("a")), v(t, n, window.location.pathname);
    };
    window.addEventListener("popstate", r);
    const i = history.pushState;
    history.pushState = function() {
      i.apply(history, arguments), t = Array.from(o.querySelectorAll("a")), v(t, n, window.location.pathname);
    };
    const e = new MutationObserver(function(s) {
      s.forEach(function(c) {
        c.type === "childList" && (c.addedNodes.forEach(function(h) {
          if (h.nodeType === 1) {
            if (h.tagName === "A")
              t.push(h), v([h], n, window.location.pathname);
            else if (h.querySelectorAll) {
              const p = Array.from(h.querySelectorAll("a"));
              t = t.concat(p), v(p, n, window.location.pathname);
            }
          }
        }), c.removedNodes.forEach(function(h) {
          if (h.nodeType === 1) {
            if (h.tagName === "A")
              t = t.filter(function(p) {
                return p !== h;
              });
            else if (h.querySelectorAll) {
              const p = Array.from(h.querySelectorAll("a"));
              t = t.filter(function(m) {
                return !p.includes(m);
              });
            }
          }
        }));
      });
    });
    return e.observe(o, {
      childList: !0,
      subtree: !0
    }), {
      navElement: o,
      activeClass: n,
      observer: e
    };
  }
  function f(o) {
    try {
      return new URL(o, window.location.origin).pathname.replace(/\/$/, "") || "/";
    } catch {
      return o.replace(/\/$/, "") || "/";
    }
  }
  function v(o, n, t) {
    const r = f(t);
    o.forEach(function(i) {
      const e = i.getAttribute("href");
      if (!e) return;
      const s = f(e);
      i.classList.remove(n);
      const c = s === r, h = s !== "/" && r.startsWith(s + "/");
      (c || h) && i.classList.add(n);
    });
  }
  window[l] = w;
  function a() {
    document.querySelectorAll("[" + u + "]").forEach(function(n) {
      w(n);
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
(function() {
  const u = /* @__PURE__ */ new WeakMap();
  function l(f) {
    if (u.has(f))
      return;
    const v = f.getAttribute("data-ln-select");
    let a = {};
    if (v && v.trim() !== "")
      try {
        a = JSON.parse(v);
      } catch (t) {
        console.warn("Invalid JSON in data-ln-select attribute:", t);
      }
    const n = { ...{
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
      placeholder: f.getAttribute("placeholder") || "Select...",
      // Load throttle for search
      loadThrottle: 300
    }, ...a };
    try {
      const t = new X(f, n);
      u.set(f, t);
      const r = f.closest("form");
      r && r.addEventListener("reset", () => {
        setTimeout(() => {
          t.clear(), t.clearOptions(), t.sync();
        }, 0);
      });
    } catch (t) {
      console.error("Failed to initialize Tom Select:", t);
    }
  }
  function b(f) {
    const v = u.get(f);
    v && (v.destroy(), u.delete(f));
  }
  function w() {
    document.querySelectorAll("select[data-ln-select]").forEach(l);
  }
  function E() {
    new MutationObserver((v) => {
      v.forEach((a) => {
        a.addedNodes.forEach((o) => {
          o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && l(o), o.querySelectorAll && o.querySelectorAll("select[data-ln-select]").forEach(l));
        }), a.removedNodes.forEach((o) => {
          o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && b(o), o.querySelectorAll && o.querySelectorAll("select[data-ln-select]").forEach(b));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    w(), E();
  }) : (w(), E()), window.lnSelect = {
    initialize: l,
    destroy: b,
    getInstance: (f) => u.get(f)
  };
})();
(function() {
  const u = "data-ln-tabs", l = "lnTabs";
  if (window[l] !== void 0 && window[l] !== null) return;
  function b(a = document.body) {
    w(a);
  }
  function w(a) {
    if (a.nodeType !== 1) return;
    let o = Array.from(a.querySelectorAll("[" + u + "]"));
    a.hasAttribute && a.hasAttribute(u) && o.push(a), o.forEach(function(n) {
      n[l] || (n[l] = new E(n));
    });
  }
  function E(a) {
    return this.dom = a, f.call(this), this;
  }
  function f() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const a of this.tabs) {
      const o = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      o && (this.mapTabs[o] = a);
    }
    for (const a of this.panels) {
      const o = (a.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = a);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.tabs.forEach((a) => {
      a.addEventListener("click", () => {
        const o = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        o && location.hash === "#" + o && this.activate(o);
      });
    }), this._hashHandler = () => {
      const a = (location.hash || "").replace("#", "").toLowerCase();
      this.activate(a || this.defaultKey);
    }, window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
  }
  E.prototype.activate = function(a) {
    var o;
    (!a || !(a in this.mapPanels)) && (a = this.defaultKey);
    for (const n in this.mapTabs) {
      const t = this.mapTabs[n], r = n === a;
      t.setAttribute("data-active", r ? "true" : "false"), t.setAttribute("aria-selected", r ? "true" : "false");
    }
    for (const n in this.mapPanels) {
      const t = this.mapPanels[n], r = n === a;
      t.classList.toggle("hidden", !r), t.setAttribute("aria-hidden", r ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (o = this.mapPanels[a]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
  };
  function v() {
    new MutationObserver(function(o) {
      o.forEach(function(n) {
        n.addedNodes.forEach(function(t) {
          w(t);
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  v(), window[l] = b, b(document.body);
})();
(function() {
  const u = "data-ln-toast", l = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[l] !== void 0 && window[l] !== null) return;
  function w(e = document.body) {
    return E(e), r;
  }
  function E(e) {
    if (!e || e.nodeType !== 1) return;
    let s = Array.from(e.querySelectorAll("[" + u + "]"));
    e.hasAttribute && e.hasAttribute(u) && s.push(e), s.forEach((c) => {
      c[l] || new f(c);
    });
  }
  function f(e) {
    return this.dom = e, e[l] = this, this.timeoutDefault = parseInt(e.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(e.getAttribute("data-ln-toast-max") || "5", 10), Array.from(e.querySelectorAll("[data-ln-toast-item]")).forEach((s) => {
      v(s);
    }), this;
  }
  function v(e) {
    const s = ((e.getAttribute("data-type") || "info") + "").toLowerCase(), c = e.getAttribute("data-title"), h = (e.innerText || e.textContent || "").trim();
    e.className = "ln-toast__item", e.removeAttribute("data-ln-toast-item");
    const p = document.createElement("div");
    p.className = "ln-toast__card ln-toast__card--" + s, p.setAttribute("role", s === "error" ? "alert" : "status"), p.setAttribute("aria-live", s === "error" ? "assertive" : "polite");
    const m = document.createElement("div");
    m.className = "ln-toast__side", m.innerHTML = b[s] || b.info;
    const g = document.createElement("div");
    g.className = "ln-toast__content";
    const L = document.createElement("div");
    L.className = "ln-toast__head";
    const y = document.createElement("strong");
    y.className = "ln-toast__title", y.textContent = c || (s === "success" ? "Success" : s === "error" ? "Error" : s === "warn" ? "Warning" : "Information");
    const T = document.createElement("button");
    if (T.type = "button", T.className = "ln-toast__close", T.setAttribute("aria-label", "Close"), T.innerHTML = "&times;", T.addEventListener("click", () => o(e)), L.appendChild(y), g.appendChild(L), g.appendChild(T), h) {
      const S = document.createElement("div");
      S.className = "ln-toast__body";
      const x = document.createElement("p");
      x.textContent = h, S.appendChild(x), g.appendChild(S);
    }
    p.appendChild(m), p.appendChild(g), e.innerHTML = "", e.appendChild(p), requestAnimationFrame(() => e.classList.add("ln-toast__item--in"));
  }
  function a(e, s) {
    for (; e.dom.children.length >= e.max; ) e.dom.removeChild(e.dom.firstElementChild);
    e.dom.appendChild(s), requestAnimationFrame(() => s.classList.add("ln-toast__item--in"));
  }
  function o(e) {
    !e || !e.parentNode || (clearTimeout(e._timer), e.classList.remove("ln-toast__item--in"), e.classList.add("ln-toast__item--out"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 200));
  }
  function n(e = {}) {
    let s = e.container;
    if (typeof s == "string" && (s = document.querySelector(s)), s instanceof HTMLElement || (s = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !s) return null;
    const c = s[l] || new f(s), h = Number.isFinite(e.timeout) ? e.timeout : c.timeoutDefault, p = (e.type || "info").toLowerCase(), m = document.createElement("li");
    m.className = "ln-toast__item";
    const g = document.createElement("div");
    g.className = "ln-toast__card ln-toast__card--" + p, g.setAttribute("role", p === "error" ? "alert" : "status"), g.setAttribute("aria-live", p === "error" ? "assertive" : "polite");
    const L = document.createElement("div");
    L.className = "ln-toast__side", L.innerHTML = b[p] || b.info;
    const y = document.createElement("div");
    y.className = "ln-toast__content";
    const T = document.createElement("div");
    T.className = "ln-toast__head";
    const S = document.createElement("strong");
    S.className = "ln-toast__title", S.textContent = e.title || (p === "success" ? "Success" : p === "error" ? "Error" : p === "warn" ? "Warning" : "Information");
    const x = document.createElement("button");
    if (x.type = "button", x.className = "ln-toast__close", x.setAttribute("aria-label", "Close"), x.innerHTML = "&times;", x.addEventListener("click", () => o(m)), T.appendChild(S), y.appendChild(T), y.appendChild(x), e.message || e.data && e.data.errors) {
      const q = document.createElement("div");
      if (q.className = "ln-toast__body", e.message) {
        const N = document.createElement("p");
        N.textContent = e.message, N.style.margin = "0", q.appendChild(N);
      }
      if (e.data && e.data.errors) {
        const N = document.createElement("ul");
        Object.values(e.data.errors).flat().forEach((z) => {
          const d = document.createElement("li");
          d.textContent = z, N.appendChild(d);
        }), q.appendChild(N);
      }
      y.appendChild(q);
    }
    return g.appendChild(L), g.appendChild(y), m.appendChild(g), a(c, m), h > 0 && (m._timer = setTimeout(() => o(m), h)), m;
  }
  function t(e) {
    let s = e;
    typeof s == "string" && (s = document.querySelector(s)), s instanceof HTMLElement || (s = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), s && Array.from(s.children).forEach(o);
  }
  const r = function(e) {
    return w(e);
  };
  r.enqueue = n, r.clear = t, new MutationObserver((e) => {
    e.forEach((s) => s.addedNodes.forEach((c) => E(c)));
  }).observe(document.body, { childList: !0, subtree: !0 }), window[l] = r, window.addEventListener("ln-toast:enqueue", function(e) {
    e.detail && r.enqueue(e.detail);
  }), w(document.body);
})();
(function() {
  const u = "data-ln-upload", l = "lnUpload", b = "data-ln-upload-dict", w = "data-ln-upload-accept", E = "data-ln-upload-context";
  if (window[l] != null || window[l] != null)
    return;
  function f(s, c) {
    const h = s.querySelector("[" + b + '="' + c + '"]');
    return h ? h.textContent : c;
  }
  function v(s) {
    if (s === 0) return "0 B";
    const c = 1024, h = ["B", "KB", "MB", "GB"], p = Math.floor(Math.log(s) / Math.log(c));
    return parseFloat((s / Math.pow(c, p)).toFixed(1)) + " " + h[p];
  }
  function a(s) {
    return s.split(".").pop().toLowerCase();
  }
  function o(s) {
    return s === "docx" && (s = "doc"), ["pdf", "doc", "epub"].includes(s) ? "ln-icon-file-" + s : "ln-icon-file";
  }
  function n(s, c) {
    if (!c) return !0;
    const h = "." + a(s.name);
    return c.split(",").map(function(m) {
      return m.trim().toLowerCase();
    }).includes(h.toLowerCase());
  }
  function t(s, c, h) {
    s.dispatchEvent(new CustomEvent(c, {
      bubbles: !0,
      detail: h
    }));
  }
  function r(s) {
    if (s.hasAttribute("data-ln-upload-initialized")) return;
    s.setAttribute("data-ln-upload-initialized", "true");
    const c = s.querySelector(".ln-upload__zone"), h = s.querySelector(".ln-upload__list"), p = s.querySelector('input[type="file"]'), m = s.getAttribute(w) || "", g = s.getAttribute(u) || "/files/upload", L = s.getAttribute(E) || "", y = /* @__PURE__ */ new Map();
    let T = 0;
    function S() {
      const d = document.querySelector('meta[name="csrf-token"]');
      return d ? d.getAttribute("content") : "";
    }
    function x(d) {
      if (!n(d, m)) {
        const A = f(s, "invalid-type");
        t(s, "ln-upload:invalid", {
          file: d,
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
      const _ = "file-" + ++T, C = a(d.name), j = o(C), M = document.createElement("li");
      M.className = "ln-upload__item ln-upload__item--uploading " + j, M.setAttribute("data-file-id", _);
      const F = document.createElement("span");
      F.className = "ln-upload__name", F.textContent = d.name;
      const D = document.createElement("span");
      D.className = "ln-upload__size", D.textContent = "0%";
      const k = document.createElement("button");
      k.type = "button", k.className = "ln-upload__remove", k.title = f(s, "remove"), k.textContent = "×", k.disabled = !0;
      const U = document.createElement("div");
      U.className = "ln-upload__progress";
      const B = document.createElement("div");
      B.className = "ln-upload__progress-bar", U.appendChild(B), M.appendChild(F), M.appendChild(D), M.appendChild(k), M.appendChild(U), h.appendChild(M);
      const H = new FormData();
      H.append("file", d), H.append("context", L);
      const O = new XMLHttpRequest();
      O.upload.addEventListener("progress", function(A) {
        if (A.lengthComputable) {
          const I = Math.round(A.loaded / A.total * 100);
          B.style.width = I + "%", D.textContent = I + "%";
        }
      }), O.addEventListener("load", function() {
        if (O.status >= 200 && O.status < 300) {
          var A;
          try {
            A = JSON.parse(O.responseText);
          } catch {
            P("Invalid response");
            return;
          }
          M.classList.remove("ln-upload__item--uploading"), D.textContent = v(A.size || d.size), k.disabled = !1, y.set(_, {
            serverId: A.id,
            name: A.name,
            size: A.size
          }), q(), t(s, "ln-upload:uploaded", {
            localId: _,
            serverId: A.id,
            name: A.name
          });
        } else {
          var I = "Upload failed";
          try {
            var R = JSON.parse(O.responseText);
            I = R.message || I;
          } catch {
          }
          P(I);
        }
      }), O.addEventListener("error", function() {
        P("Network error");
      });
      function P(A) {
        M.classList.remove("ln-upload__item--uploading"), M.classList.add("ln-upload__item--error"), B.style.width = "100%", D.textContent = f(s, "error"), k.disabled = !1, t(s, "ln-upload:error", {
          file: d,
          message: A
        }), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Upload Error",
            message: A || f(s, "upload-failed") || "Failed to upload file"
          }
        }));
      }
      O.open("POST", g), O.setRequestHeader("X-CSRF-TOKEN", S()), O.setRequestHeader("Accept", "application/json"), O.send(H);
    }
    function q() {
      s.querySelectorAll('input[name="file_ids[]"]').forEach(function(d) {
        d.remove();
      }), y.forEach(function(d) {
        const _ = document.createElement("input");
        _.type = "hidden", _.name = "file_ids[]", _.value = d.serverId, s.appendChild(_);
      });
    }
    function N(d) {
      const _ = y.get(d), C = h.querySelector('[data-file-id="' + d + '"]');
      if (!_ || !_.serverId) {
        C && C.remove(), y.delete(d), q();
        return;
      }
      C && C.classList.add("ln-upload__item--deleting"), fetch("/files/" + _.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": S(),
          Accept: "application/json"
        }
      }).then((j) => {
        j.status === 200 ? (C && C.remove(), y.delete(d), q(), t(s, "ln-upload:removed", {
          localId: d,
          serverId: _.serverId
        })) : (C && C.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Error",
            message: f(s, "delete-error") || "Failed to delete file"
          }
        })));
      }).catch((j) => {
        console.error("Delete error:", j), C && C.classList.remove("ln-upload__item--deleting"), window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: "error",
            title: "Network Error",
            message: "Could not connect to server"
          }
        }));
      });
    }
    function z(d) {
      Array.from(d).forEach(function(_) {
        x(_);
      }), p.value = "";
    }
    c.addEventListener("click", function() {
      p.click();
    }), p.addEventListener("change", function() {
      z(this.files);
    }), c.addEventListener("dragenter", function(d) {
      d.preventDefault(), d.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }), c.addEventListener("dragover", function(d) {
      d.preventDefault(), d.stopPropagation(), c.classList.add("ln-upload__zone--dragover");
    }), c.addEventListener("dragleave", function(d) {
      d.preventDefault(), d.stopPropagation(), c.classList.remove("ln-upload__zone--dragover");
    }), c.addEventListener("drop", function(d) {
      d.preventDefault(), d.stopPropagation(), c.classList.remove("ln-upload__zone--dragover"), z(d.dataTransfer.files);
    }), h.addEventListener("click", function(d) {
      if (d.target.classList.contains("ln-upload__remove")) {
        const _ = d.target.closest(".ln-upload__item");
        _ && N(_.getAttribute("data-file-id"));
      }
    }), s.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(y.values()).map(function(d) {
          return d.serverId;
        });
      },
      getFiles: function() {
        return Array.from(y.values());
      },
      clear: function() {
        y.forEach(function(d) {
          d.serverId && fetch("/files/" + d.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": S(),
              Accept: "application/json"
            }
          });
        }), y.clear(), h.innerHTML = "", q(), t(s, "ln-upload:cleared", {});
      }
    };
  }
  function i() {
    document.querySelectorAll("[" + u + "]").forEach(r);
  }
  function e() {
    new MutationObserver(function(c) {
      c.forEach(function(h) {
        h.type === "childList" && h.addedNodes.forEach(function(p) {
          p.nodeType === 1 && (p.hasAttribute(u) && r(p), p.querySelectorAll("[" + u + "]").forEach(r));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  window[l] = {
    init: r,
    initAll: i
  }, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const u = "lnExternalLinks";
  if (window[u] != null || window[u] != null)
    return;
  function l(o, n, t) {
    o.dispatchEvent(new CustomEvent(n, {
      bubbles: !0,
      detail: t
    }));
  }
  function b(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function w(o) {
    o.getAttribute("data-ln-external-link") !== "processed" && b(o) && (o.target = "_blank", o.rel = "noopener noreferrer", o.setAttribute("data-ln-external-link", "processed"), l(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    }));
  }
  function E(o) {
    o = o || document.body, o.querySelectorAll("a, area").forEach(function(t) {
      w(t);
    });
  }
  function f() {
    document.body.addEventListener("click", function(o) {
      const n = o.target.closest("a, area");
      n && n.getAttribute("data-ln-external-link") === "processed" && l(n, "ln-external-links:clicked", {
        link: n,
        href: n.href,
        text: n.textContent || n.title || ""
      });
    });
  }
  function v() {
    new MutationObserver(function(n) {
      n.forEach(function(t) {
        t.type === "childList" && t.addedNodes.forEach(function(r) {
          if (r.nodeType === 1) {
            r.matches && (r.matches("a") || r.matches("area")) && w(r);
            const i = r.querySelectorAll && r.querySelectorAll("a, area");
            i && i.forEach(w);
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  function a() {
    f(), v(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      E();
    }) : E();
  }
  window[u] = {
    process: E
  }, a();
})();
(function() {
  const u = "[data-ln-box]", l = "lnBox", b = /* @__PURE__ */ new Set([1, 2, 9, 10, 11]);
  if (window[l] != null || window[l] != null)
    return;
  function w(r) {
    E(r);
  }
  function E(r) {
    let i = r.querySelectorAll(u) || [];
    r.hasAttribute("data-ln-box") && i.push(r), i.forEach(function(e) {
      e[l] || (e[l] = new f(e));
    });
  }
  function f(r) {
    return this.dom = r, a.call(this), o.call(this), this;
  }
  function v() {
    new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.type == "childList" && e.addedNodes.forEach(function(s) {
          b.has(s.nodeType) && E(s);
        });
      });
    }).observe(document.body, {
      childList: !0
    });
  }
  v();
  function a() {
    return this.buttons = {}, this.buttons.collapse = this.dom.querySelectorAll('[data-ln-box-action="collapse"]'), this.buttons.expand = this.dom.querySelectorAll('[data-ln-box-action="expand"]'), this;
  }
  function o() {
    this.buttons.collapse.forEach((r) => {
      r.addEventListener("click", (i) => {
        n.call(this);
      }, !1);
    }), this.buttons.expand.forEach((r) => {
      r.addEventListener("click", (i) => {
        t.call(this);
      }, !1);
    });
  }
  function n() {
    this.dom.setAttribute("data-ln-box", "collapsed");
  }
  function t() {
    this.dom.setAttribute("data-ln-box", "");
  }
  window[l] = w, f.prototype.collapse = n, f.prototype.expand = t;
})();
document.addEventListener("DOMContentLoaded", function() {
  window.lnBox(document.body);
});
(function() {
  const u = "[data-ln-progress]", l = "lnProgress", b = /* @__PURE__ */ new Set([1, 2, 9, 10, 11]);
  if (window[l] != null || window[l] != null)
    return;
  function w(r) {
    E(r);
  }
  function E(r) {
    let i = r.querySelectorAll(u) || [];
    r.hasAttribute("data-ln-progress") && i.push(r), i.forEach(function(e) {
      e[l] || (e[l] = new f(e));
    });
  }
  function f(r) {
    return this.dom = r, o.call(this), a.call(this), n.call(this), this;
  }
  function v() {
    new MutationObserver(function(i) {
      i.forEach(function(e) {
        e.type == "childList" && e.addedNodes.forEach(function(s) {
          b.has(s.nodeType) && E(s);
        });
      });
    }).observe(document.body, {
      childList: !0
    });
  }
  v();
  function a() {
    new MutationObserver((i) => {
      i.forEach((e) => {
        e.attributeName.includes("data-progress") && (console.log(e), this.values = e.target.dataset, t.call(this));
      });
    }).observe(this.dom, {
      attributes: !0,
      attributeOldValue: !0
    });
  }
  function o() {
    return this.values = {}, this.values.progressMin = this.dom.dataset.progressMin || 0, this.values.progressMax = this.dom.dataset.progressMax || 100, this.values.progressValue = this.dom.dataset.progressValue || 100, t.call(this), this;
  }
  function n() {
  }
  function t() {
    console.log(this.dom, this.values);
    let r = this.values.progressMax - this.values.progressMin, e = (this.values.progressValue - this.values.progressMin) * 100 / r;
    e < 0 && (e = 0), this.dom.style.width = e + "%";
  }
  window[l] = w;
})();
document.addEventListener("DOMContentLoaded", function() {
  window.lnProgress(document.body);
});
