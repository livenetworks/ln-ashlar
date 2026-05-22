const _t = {};
function vt(m, d) {
  _t[m] || (_t[m] = document.querySelector('[data-ln-template="' + m + '"]'));
  const y = _t[m];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (d || "ln-core") + '] Template "' + m + '" not found'), null);
}
function T(m, d, y) {
  m.dispatchEvent(new CustomEvent(d, {
    bubbles: !0,
    detail: y || {}
  }));
}
function z(m, d, y) {
  const _ = new CustomEvent(d, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return m.dispatchEvent(_), _;
}
function Y(m, d) {
  if (!m || !d) return m;
  const y = m.querySelectorAll("[data-ln-field]");
  for (let a = 0; a < y.length; a++) {
    const l = y[a], o = l.getAttribute("data-ln-field");
    d[o] != null && (l.textContent = d[o]);
  }
  const _ = m.querySelectorAll("[data-ln-attr]");
  for (let a = 0; a < _.length; a++) {
    const l = _[a], o = l.getAttribute("data-ln-attr").split(",");
    for (let e = 0; e < o.length; e++) {
      const t = o[e].trim().split(":");
      if (t.length !== 2) continue;
      const n = t[0].trim(), s = t[1].trim();
      d[s] != null && l.setAttribute(n, d[s]);
    }
  }
  const g = m.querySelectorAll("[data-ln-show]");
  for (let a = 0; a < g.length; a++) {
    const l = g[a], o = l.getAttribute("data-ln-show");
    o in d && l.classList.toggle("hidden", !d[o]);
  }
  const b = m.querySelectorAll("[data-ln-class]");
  for (let a = 0; a < b.length; a++) {
    const l = b[a], o = l.getAttribute("data-ln-class").split(",");
    for (let e = 0; e < o.length; e++) {
      const t = o[e].trim().split(":");
      if (t.length !== 2) continue;
      const n = t[0].trim(), s = t[1].trim();
      s in d && l.classList.toggle(n, !!d[s]);
    }
  }
  return m;
}
function Et(m, d) {
  if (!m || !d) return m;
  const y = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const _ = y.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(g, b) {
        return d[b] !== void 0 ? d[b] : "";
      }
    ));
  }
  return m;
}
function W(m, d) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      W(m, d);
    }), console.warn("[" + d + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  m();
}
function $(m, d, y) {
  if (m) {
    const _ = m.querySelector('[data-ln-template="' + d + '"]');
    if (_) return _.content.cloneNode(!0);
  }
  return vt(d, y);
}
function Ct(m, d) {
  const y = {}, _ = m.querySelectorAll("[" + d + "]");
  for (let g = 0; g < _.length; g++)
    y[_[g].getAttribute(d)] = _[g].textContent, _[g].remove();
  return y;
}
function bt(m, d, y, _) {
  if (m.nodeType !== 1) return;
  const b = d.indexOf("[") !== -1 || d.indexOf(".") !== -1 || d.indexOf("#") !== -1 ? d : "[" + d + "]", a = Array.from(m.querySelectorAll(b));
  m.matches && m.matches(b) && a.push(m);
  for (const l of a)
    l[y] || (l[y] = new _(l));
}
function at(m) {
  return !!(m.offsetWidth || m.offsetHeight || m.getClientRects().length);
}
function At(m) {
  const d = {}, y = m.elements;
  for (let _ = 0; _ < y.length; _++) {
    const g = y[_];
    if (!(!g.name || g.disabled || g.type === "file" || g.type === "submit" || g.type === "button"))
      if (g.type === "checkbox")
        d[g.name] || (d[g.name] = []), g.checked && d[g.name].push(g.value);
      else if (g.type === "radio")
        g.checked && (d[g.name] = g.value);
      else if (g.type === "select-multiple") {
        d[g.name] = [];
        for (let b = 0; b < g.options.length; b++)
          g.options[b].selected && d[g.name].push(g.options[b].value);
      } else
        d[g.name] = g.value;
  }
  return d;
}
function wt(m, d) {
  const y = m.elements, _ = [];
  for (let g = 0; g < y.length; g++) {
    const b = y[g];
    if (!b.name || !(b.name in d) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const a = d[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(a) ? a.indexOf(b.value) !== -1 : !!a, _.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(a), _.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(a))
        for (let l = 0; l < b.options.length; l++)
          b.options[l].selected = a.indexOf(b.options[l].value) !== -1;
      _.push(b);
    } else
      b.value = a, _.push(b);
  }
  return _;
}
function Q(m) {
  const d = m.closest("[lang]");
  return (d ? d.lang : null) || navigator.language;
}
function B(m, d, y, _, g = {}) {
  const b = g.extraAttributes || [], a = g.onAttributeChange || null, l = g.onInit || null;
  function o(e) {
    const t = e || document.body;
    bt(t, m, d, y), l && l(t);
  }
  return W(function() {
    const e = new MutationObserver(function(n) {
      for (let s = 0; s < n.length; s++) {
        const u = n[s];
        if (u.type === "childList")
          for (let i = 0; i < u.addedNodes.length; i++) {
            const c = u.addedNodes[i];
            c.nodeType === 1 && (bt(c, m, d, y), l && l(c));
          }
        else u.type === "attributes" && (a && u.target[d] ? a(u.target, u.attributeName) : (bt(u.target, m, d, y), l && l(u.target)));
      }
    });
    let t = [];
    if (m.indexOf("[") !== -1) {
      const n = /\[([\w-]+)/g;
      let s;
      for (; (s = n.exec(m)) !== null; )
        t.push(s[1]);
    } else
      t.push(m);
    e.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: t.concat(b)
    });
  }, _ || (m.indexOf("[") === -1 ? m.replace("data-", "") : "component")), window[d] = o, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    o(document.body);
  }) : o(document.body), o;
}
function kt(m, d) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, m(), d && d();
    }));
  };
}
const xt = "ln:";
function Ot() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function St(m, d) {
  const y = d.getAttribute("data-ln-persist"), _ = y !== null && y !== "" ? y : d.id;
  return _ ? xt + m + ":" + Ot() + ":" + _ : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', d), null);
}
function ht(m, d) {
  const y = St(m, d);
  if (!y) return null;
  try {
    const _ = localStorage.getItem(y);
    return _ !== null ? JSON.parse(_) : null;
  } catch {
    return null;
  }
}
function nt(m, d, y) {
  const _ = St(m, d);
  if (_)
    try {
      localStorage.setItem(_, JSON.stringify(y));
    } catch {
    }
}
function ft(m, d, y, _) {
  const g = typeof _ == "number" ? _ : 4, b = window.innerWidth, a = window.innerHeight, l = d.width, o = d.height, e = (y || "bottom").split("-"), t = e[0], n = e[1] === "start" || e[1] === "end" ? e[1] : "center", s = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, u = s[t] || s.bottom;
  function i(v) {
    return v === "top" || v === "bottom" ? n === "start" ? m.left : n === "end" ? m.right - l : m.left + (m.width - l) / 2 : n === "start" ? m.top : n === "end" ? m.bottom - o : m.top + (m.height - o) / 2;
  }
  function c(v) {
    let w, E, A = !0;
    return v === "top" ? (w = m.top - g - o, E = i(v), w < 0 && (A = !1)) : v === "bottom" ? (w = m.bottom + g, E = i(v), w + o > a && (A = !1)) : v === "left" ? (w = i(v), E = m.left - g - l, E < 0 && (A = !1)) : (w = i(v), E = m.right + g, E + l > b && (A = !1)), { top: w, left: E, side: v, fits: A };
  }
  let f = null;
  for (let v = 0; v < u.length; v++) {
    const w = c(u[v]);
    if (w.fits) {
      f = w;
      break;
    }
  }
  f || (f = c(u[0]));
  let r = f.top, p = f.left;
  return l >= b ? p = 0 : (p < 0 && (p = 0), p + l > b && (p = b - l)), o >= a ? r = 0 : (r < 0 && (r = 0), r + o > a && (r = a - o)), { top: r, left: p, placement: f.side };
}
function Lt(m) {
  if (!m || m.parentNode === document.body)
    return function() {
    };
  const d = m.parentNode, y = document.createComment("ln-teleport");
  return d.insertBefore(y, m), document.body.appendChild(m), function() {
    y.parentNode && (y.parentNode.insertBefore(m, y), y.parentNode.removeChild(y));
  };
}
function yt(m) {
  if (!m) return { width: 0, height: 0 };
  const d = m.style, y = d.visibility, _ = d.display, g = d.position;
  d.visibility = "hidden", d.display = "block", d.position = "fixed";
  const b = m.offsetWidth, a = m.offsetHeight;
  return d.visibility = y, d.display = _, d.position = g, { width: b, height: a };
}
(function() {
  if (window.lnHttp) return;
  const m = window.fetch.bind(window), d = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function _(e) {
    return typeof e == "string" ? e : e instanceof URL ? e.href : e instanceof Request ? e.url : String(e);
  }
  function g(e, t) {
    return t && t.method ? String(t.method).toUpperCase() : e instanceof Request ? e.method.toUpperCase() : "GET";
  }
  function b(e, t) {
    return t + " " + e;
  }
  function a(e) {
    return e === "GET" || e === "HEAD";
  }
  function l(e, t) {
    t = t || {};
    const n = _(e), s = g(e, t), u = b(n, s);
    a(s) && d.has(u) && (d.get(u).abort(), d.delete(u));
    const i = new AbortController(), c = t.signal;
    c && (c.aborted ? i.abort(c.reason) : c.addEventListener("abort", function() {
      i.abort(c.reason);
    }, { once: !0 }));
    const f = Object.assign({}, t, { signal: i.signal });
    return d.set(u, i), m(e, f).finally(function() {
      d.get(u) === i && d.delete(u);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function o(e) {
    const t = e.detail || {};
    if (!t.url) return;
    const n = e.target, s = (t.method || (t.body ? "POST" : "GET")).toUpperCase(), u = t.key;
    u && y.has(u) && (y.get(u).abort(), y.delete(u));
    const i = new AbortController(), c = t.signal;
    c && (c.aborted ? i.abort(c.reason) : c.addEventListener("abort", function() {
      i.abort(c.reason);
    }, { once: !0 })), u && y.set(u, i);
    const f = { method: s, signal: i.signal };
    t.body !== void 0 && (f.body = t.body), window.fetch(t.url, f).then(function(r) {
      u && y.get(u) === i && y.delete(u), T(n, "ln-http:response", {
        ok: r.ok,
        status: r.status,
        response: r
      });
    }).catch(function(r) {
      u && y.get(u) === i && y.delete(u), !(r && r.name === "AbortError") && T(n, "ln-http:error", {
        ok: !1,
        status: 0,
        error: r
      });
    });
  }
  document.addEventListener("ln-http:request", o), window.lnHttp = {
    cancel: function(e) {
      let t = !1;
      return d.forEach(function(n, s) {
        s.endsWith(" " + e) && (n.abort(), d.delete(s), t = !0);
      }), t;
    },
    cancelByKey: function(e) {
      return y.has(e) ? (y.get(e).abort(), y.delete(e), !0) : !1;
    },
    cancelAll: function() {
      d.forEach(function(e) {
        e.abort();
      }), d.clear(), y.forEach(function(e) {
        e.abort();
      }), y.clear();
    },
    get inflight() {
      const e = [];
      return d.forEach(function(t, n) {
        const s = n.indexOf(" ");
        e.push({ method: n.slice(0, s), url: n.slice(s + 1) });
      }), y.forEach(function(t, n) {
        e.push({ key: n });
      }), e;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", o), window.fetch = m, delete window.lnHttp;
    }
  };
})();
(function() {
  const m = "data-ln-ajax", d = "lnAjax";
  if (window[d] !== void 0) return;
  function y(t) {
    if (!t.hasAttribute(m) || t[d]) return;
    t[d] = !0;
    const n = l(t);
    _(n.links), g(n.forms);
  }
  function _(t) {
    for (const n of t) {
      if (n[d + "Trigger"] || n.hostname && n.hostname !== window.location.hostname) continue;
      const s = n.getAttribute("href");
      if (s && s.includes("#")) continue;
      const u = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        i.preventDefault();
        const c = n.getAttribute("href");
        c && a("GET", c, null, n);
      };
      n.addEventListener("click", u), n[d + "Trigger"] = u;
    }
  }
  function g(t) {
    for (const n of t) {
      if (n[d + "Trigger"]) continue;
      const s = function(u) {
        u.preventDefault();
        const i = n.method.toUpperCase(), c = n.action, f = new FormData(n);
        for (const r of n.querySelectorAll('button, input[type="submit"]'))
          r.disabled = !0;
        a(i, c, f, n, function() {
          for (const r of n.querySelectorAll('button, input[type="submit"]'))
            r.disabled = !1;
        });
      };
      n.addEventListener("submit", s), n[d + "Trigger"] = s;
    }
  }
  function b(t) {
    if (!t[d]) return;
    const n = l(t);
    for (const s of n.links)
      s[d + "Trigger"] && (s.removeEventListener("click", s[d + "Trigger"]), delete s[d + "Trigger"]);
    for (const s of n.forms)
      s[d + "Trigger"] && (s.removeEventListener("submit", s[d + "Trigger"]), delete s[d + "Trigger"]);
    delete t[d];
  }
  function a(t, n, s, u, i) {
    if (z(u, "ln-ajax:before-start", { method: t, url: n }).defaultPrevented) return;
    T(u, "ln-ajax:start", { method: t, url: n }), u.classList.add("ln-ajax--loading");
    const f = document.createElement("span");
    f.className = "ln-ajax-spinner", u.appendChild(f);
    function r() {
      u.classList.remove("ln-ajax--loading");
      const A = u.querySelector(".ln-ajax-spinner");
      A && A.remove(), i && i();
    }
    let p = n;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    s instanceof FormData && w && s.append("_token", w);
    const E = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), t === "GET" && s) {
      const A = new URLSearchParams(s);
      p = n + (n.includes("?") ? "&" : "?") + A.toString();
    } else t !== "GET" && s && (E.body = s);
    fetch(p, E).then(function(A) {
      const C = A.ok;
      return A.json().then(function(O) {
        return { ok: C, status: A.status, data: O };
      });
    }).then(function(A) {
      const C = A.data;
      if (A.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const O in C.content) {
            const F = document.getElementById(O);
            F && (F.innerHTML = C.content[O]);
          }
        if (u.tagName === "A") {
          const O = u.getAttribute("href");
          O && window.history.pushState({ ajax: !0 }, "", O);
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", p);
        T(u, "ln-ajax:success", { method: t, url: p, data: C });
      } else
        T(u, "ln-ajax:error", { method: t, url: p, status: A.status, data: C });
      if (C.message) {
        const O = C.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: O.type || (A.ok ? "success" : "error"),
            title: O.title || "",
            message: O.body || ""
          }
        }));
      }
      T(u, "ln-ajax:complete", { method: t, url: p }), r();
    }).catch(function(A) {
      T(u, "ln-ajax:error", { method: t, url: p, error: A }), T(u, "ln-ajax:complete", { method: t, url: p }), r();
    });
  }
  function l(t) {
    const n = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(m) !== "false" ? n.links.push(t) : t.tagName === "FORM" && t.getAttribute(m) !== "false" ? n.forms.push(t) : (n.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), n.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), n;
  }
  function o() {
    W(function() {
      new MutationObserver(function(n) {
        for (const s of n)
          if (s.type === "childList") {
            for (const u of s.addedNodes)
              if (u.nodeType === 1 && (y(u), !u.hasAttribute(m))) {
                for (const c of u.querySelectorAll("[" + m + "]"))
                  y(c);
                const i = u.closest && u.closest("[" + m + "]");
                if (i && i.getAttribute(m) !== "false") {
                  const c = l(u);
                  _(c.links), g(c.forms);
                }
              }
          } else s.type === "attributes" && y(s.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [m]
      });
    }, "ln-ajax");
  }
  function e() {
    for (const t of document.querySelectorAll("[" + m + "]"))
      y(t);
  }
  window[d] = y, window[d].destroy = b, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const m = "data-ln-modal", d = "lnModal";
  if (window[d] !== void 0) return;
  function y(a) {
    const l = Array.from(a.querySelectorAll("[data-ln-modal-for]"));
    a.hasAttribute && a.hasAttribute("data-ln-modal-for") && l.push(a);
    for (const o of l) {
      if (o[d + "Trigger"]) continue;
      const e = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const n = o.getAttribute("data-ln-modal-for"), s = document.getElementById(n);
        if (!s) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + n + '"');
          return;
        }
        if (!s[d]) return;
        const u = s.getAttribute(m);
        s.setAttribute(m, u === "open" ? "close" : "open");
      };
      o.addEventListener("click", e), o[d + "Trigger"] = e;
    }
  }
  function _(a) {
    this.dom = a, this.isOpen = a.getAttribute(m) === "open";
    const l = this;
    return this._onEscape = function(o) {
      o.key === "Escape" && l.dom.setAttribute(m, "close");
    }, this._onFocusTrap = function(o) {
      if (o.key !== "Tab") return;
      const e = Array.prototype.filter.call(
        l.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        at
      );
      if (e.length === 0) return;
      const t = e[0], n = e[e.length - 1];
      o.shiftKey ? document.activeElement === t && (o.preventDefault(), n.focus()) : document.activeElement === n && (o.preventDefault(), t.focus());
    }, this._onClose = function(o) {
      o.preventDefault(), l.dom.setAttribute(m, "close");
    }, b(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  _.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + m + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const a = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const o of a)
      o[d + "Close"] && (o.removeEventListener("click", o[d + "Close"]), delete o[d + "Close"]);
    const l = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const o of l)
      o[d + "Trigger"] && (o.removeEventListener("click", o[d + "Trigger"]), delete o[d + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[d];
  };
  function g(a) {
    const l = a[d];
    if (!l) return;
    const e = a.getAttribute(m) === "open";
    if (e !== l.isOpen)
      if (e) {
        if (z(a, "ln-modal:before-open", { modalId: a.id, target: a }).defaultPrevented) {
          a.setAttribute(m, "close");
          return;
        }
        l.isOpen = !0, a.setAttribute("aria-modal", "true"), a.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", l._onEscape), document.addEventListener("keydown", l._onFocusTrap);
        const n = document.activeElement;
        l._returnFocusEl = n && n !== document.body ? n : null;
        const s = a.querySelector("[autofocus]");
        if (s && at(s))
          s.focus();
        else {
          const u = a.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), i = Array.prototype.find.call(u, at);
          if (i) i.focus();
          else {
            const c = a.querySelectorAll("a[href], button:not([disabled])"), f = Array.prototype.find.call(c, at);
            f && f.focus();
          }
        }
        T(a, "ln-modal:open", { modalId: a.id, target: a });
      } else {
        if (z(a, "ln-modal:before-close", { modalId: a.id, target: a }).defaultPrevented) {
          a.setAttribute(m, "open");
          return;
        }
        l.isOpen = !1, a.removeAttribute("aria-modal"), document.removeEventListener("keydown", l._onEscape), document.removeEventListener("keydown", l._onFocusTrap), T(a, "ln-modal:close", { modalId: a.id, target: a }), l._returnFocusEl && document.contains(l._returnFocusEl) && typeof l._returnFocusEl.focus == "function" && l._returnFocusEl.focus(), l._returnFocusEl = null, document.querySelector("[" + m + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function b(a) {
    const l = a.dom.querySelectorAll("[data-ln-modal-close]");
    for (const o of l)
      o[d + "Close"] || (o.addEventListener("click", a._onClose), o[d + "Close"] = a._onClose);
  }
  B(m, d, _, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: g,
    onInit: y
  });
})();
(function() {
  const m = "data-ln-number", d = "lnNumber";
  if (window[d] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(o) {
    if (!y[o]) {
      const e = new Intl.NumberFormat(o, { useGrouping: !0 }), t = e.formatToParts(1234.5);
      let n = "", s = ".";
      for (let u = 0; u < t.length; u++)
        t[u].type === "group" && (n = t[u].value), t[u].type === "decimal" && (s = t[u].value);
      y[o] = { fmt: e, groupSep: n, decimalSep: s };
    }
    return y[o];
  }
  function b(o, e, t) {
    if (t !== null) {
      const n = parseInt(t, 10), s = o + "|d" + n;
      return y[s] || (y[s] = new Intl.NumberFormat(o, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: n })), y[s].format(e);
    }
    return g(o).fmt.format(e);
  }
  function a(o) {
    if (o.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", o.tagName), this;
    this.dom = o;
    const e = document.createElement("input");
    e.type = "hidden", e.name = o.name, o.removeAttribute("name"), o.type = "text", o.setAttribute("inputmode", "decimal"), o.insertAdjacentElement("afterend", e), this._hidden = e;
    const t = this;
    Object.defineProperty(e, "value", {
      get: function() {
        return _.get.call(e);
      },
      set: function(s) {
        _.set.call(e, s), s !== "" && !isNaN(parseFloat(s)) ? t._displayFormatted(parseFloat(s)) : s === "" && (t.dom.value = "");
      }
    }), this._onInput = function() {
      t._handleInput();
    }, o.addEventListener("input", this._onInput), this._onPaste = function(s) {
      s.preventDefault();
      const u = (s.clipboardData || window.clipboardData).getData("text"), i = g(Q(o)), c = i.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let f = u.replace(new RegExp("[^0-9\\-" + c + ".]", "g"), "");
      i.groupSep && (f = f.split(i.groupSep).join("")), i.decimalSep !== "." && (f = f.replace(i.decimalSep, "."));
      const r = parseFloat(f);
      isNaN(r) ? (o.value = "", t._hidden.value = "") : t.value = r;
    }, o.addEventListener("paste", this._onPaste);
    const n = o.value;
    if (n !== "") {
      const s = parseFloat(n);
      isNaN(s) || (this._displayFormatted(s), _.set.call(e, String(s)));
    }
    return this;
  }
  a.prototype._handleInput = function() {
    const o = this.dom, e = g(Q(o)), t = o.value;
    if (t === "") {
      this._hidden.value = "", T(o, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (t === "-") {
      this._hidden.value = "";
      return;
    }
    const n = o.selectionStart;
    let s = 0;
    for (let A = 0; A < n; A++)
      /[0-9]/.test(t[A]) && s++;
    let u = t;
    if (e.groupSep && (u = u.split(e.groupSep).join("")), u = u.replace(e.decimalSep, "."), t.endsWith(e.decimalSep) || t.endsWith(".")) {
      const A = u.replace(/\.$/, ""), C = parseFloat(A);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const i = u.indexOf(".");
    if (i !== -1 && u.slice(i + 1).endsWith("0")) {
      const C = parseFloat(u);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const c = o.getAttribute("data-ln-number-decimals");
    if (c !== null && i !== -1) {
      const A = parseInt(c, 10);
      u.slice(i + 1).length > A && (u = u.slice(0, i + 1 + A));
    }
    const f = parseFloat(u);
    if (isNaN(f)) return;
    const r = o.getAttribute("data-ln-number-min"), p = o.getAttribute("data-ln-number-max");
    if (r !== null && f < parseFloat(r) || p !== null && f > parseFloat(p)) return;
    let v;
    if (c !== null)
      v = b(Q(o), f, c);
    else {
      const A = i !== -1 ? u.slice(i + 1).length : 0;
      if (A > 0) {
        const C = Q(o) + "|u" + A;
        y[C] || (y[C] = new Intl.NumberFormat(Q(o), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = y[C].format(f);
      } else
        v = e.fmt.format(f);
    }
    o.value = v;
    let w = s, E = 0;
    for (let A = 0; A < v.length && w > 0; A++)
      E = A + 1, /[0-9]/.test(v[A]) && w--;
    w > 0 && (E = v.length), o.setSelectionRange(E, E), this._setHiddenRaw(f), T(o, "ln-number:input", { value: f, formatted: v });
  }, a.prototype._setHiddenRaw = function(o) {
    _.set.call(this._hidden, String(o));
  }, a.prototype._displayFormatted = function(o) {
    this.dom.value = b(Q(this.dom), o, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(a.prototype, "value", {
    get: function() {
      const o = this._hidden.value;
      return o === "" ? NaN : parseFloat(o);
    },
    set: function(o) {
      if (typeof o != "number" || isNaN(o)) {
        this.dom.value = "", this._setHiddenRaw("");
        return;
      }
      this._displayFormatted(o), this._setHiddenRaw(o), T(this.dom, "ln-number:input", {
        value: o,
        formatted: this.dom.value
      });
    }
  }), Object.defineProperty(a.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), a.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[d]);
  };
  function l() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + m + "]");
      for (let e = 0; e < o.length; e++) {
        const t = o[e][d];
        t && !isNaN(t.value) && t._displayFormatted(t.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(m, d, a, "ln-number"), l();
})();
(function() {
  const m = "data-ln-date", d = "lnDate";
  if (window[d] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(i, c) {
    const f = i + "|" + JSON.stringify(c);
    return y[f] || (y[f] = new Intl.DateTimeFormat(i, c)), y[f];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, a = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function l(i) {
    return !i || i === "" ? { dateStyle: "medium" } : i.match(b) ? a[i] : null;
  }
  function o(i, c, f) {
    const r = i.getDate(), p = i.getMonth(), v = i.getFullYear(), w = i.getHours(), E = i.getMinutes(), A = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: g(f, { month: "long" }).format(i),
      MMM: g(f, { month: "short" }).format(i),
      MM: String(p + 1).padStart(2, "0"),
      M: String(p + 1),
      dd: String(r).padStart(2, "0"),
      d: String(r),
      HH: String(w).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return c.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return A[C];
    });
  }
  function e(i, c, f) {
    const r = l(c);
    return r ? g(f, r).format(i) : o(i, c, f);
  }
  function t(i) {
    if (i.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", i.tagName), this;
    this.dom = i;
    const c = this, f = i.value, r = i.name, p = document.createElement("input");
    p.type = "hidden", p.name = r, i.removeAttribute("name"), i.insertAdjacentElement("afterend", p), this._hidden = p;
    const v = document.createElement("input");
    v.type = "date", v.tabIndex = -1, v.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", p.insertAdjacentElement("afterend", v), this._picker = v, i.type = "text";
    const w = document.createElement("button");
    if (w.type = "button", w.setAttribute("aria-label", "Open date picker"), w.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', v.insertAdjacentElement("afterend", w), this._btn = w, this._lastISO = "", Object.defineProperty(p, "value", {
      get: function() {
        return _.get.call(p);
      },
      set: function(E) {
        if (_.set.call(p, E), E && E !== "") {
          const A = n(E);
          A && (c._displayFormatted(A), _.set.call(v, E));
        } else E === "" && (c.dom.value = "", _.set.call(v, ""));
      }
    }), this._onPickerChange = function() {
      const E = v.value;
      if (E) {
        const A = n(E);
        A && (c._setHiddenRaw(E), c._displayFormatted(A), c._lastISO = E, T(c.dom, "ln-date:change", {
          value: E,
          formatted: c.dom.value,
          date: A
        }));
      } else
        c._setHiddenRaw(""), c.dom.value = "", c._lastISO = "", T(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, v.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const E = c.dom.value.trim();
      if (E === "") {
        c._lastISO !== "" && (c._setHiddenRaw(""), _.set.call(c._picker, ""), c.dom.value = "", c._lastISO = "", T(c.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (c._lastISO) {
        const C = n(c._lastISO);
        if (C) {
          const O = c.dom.getAttribute(m) || "", F = Q(c.dom), D = e(C, O, F);
          if (E === D) return;
        }
      }
      const A = s(E);
      if (A) {
        const C = A.getFullYear(), O = String(A.getMonth() + 1).padStart(2, "0"), F = String(A.getDate()).padStart(2, "0"), D = C + "-" + O + "-" + F;
        c._setHiddenRaw(D), _.set.call(c._picker, D), c._displayFormatted(A), c._lastISO = D, T(c.dom, "ln-date:change", {
          value: D,
          formatted: c.dom.value,
          date: A
        });
      } else if (c._lastISO) {
        const C = n(c._lastISO);
        C && c._displayFormatted(C);
      } else
        c.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      c._openPicker();
    }, w.addEventListener("click", this._onBtnClick), f && f !== "") {
      const E = n(f);
      E && (this._setHiddenRaw(f), _.set.call(v, f), this._displayFormatted(E), this._lastISO = f);
    }
    return this;
  }
  function n(i) {
    if (!i || typeof i != "string") return null;
    const c = i.split("T"), f = c[0].split("-");
    if (f.length < 3) return null;
    const r = parseInt(f[0], 10), p = parseInt(f[1], 10) - 1, v = parseInt(f[2], 10);
    if (isNaN(r) || isNaN(p) || isNaN(v)) return null;
    let w = 0, E = 0;
    if (c[1]) {
      const C = c[1].split(":");
      w = parseInt(C[0], 10) || 0, E = parseInt(C[1], 10) || 0;
    }
    const A = new Date(r, p, v, w, E);
    return A.getFullYear() !== r || A.getMonth() !== p || A.getDate() !== v ? null : A;
  }
  function s(i) {
    if (!i || typeof i != "string" || (i = i.trim(), i.length < 6)) return null;
    let c, f;
    if (i.indexOf(".") !== -1)
      c = ".", f = i.split(".");
    else if (i.indexOf("/") !== -1)
      c = "/", f = i.split("/");
    else if (i.indexOf("-") !== -1)
      c = "-", f = i.split("-");
    else
      return null;
    if (f.length !== 3) return null;
    const r = [];
    for (let A = 0; A < 3; A++) {
      const C = parseInt(f[A], 10);
      if (isNaN(C)) return null;
      r.push(C);
    }
    let p, v, w;
    c === "." ? (p = r[0], v = r[1], w = r[2]) : c === "/" ? (v = r[0], p = r[1], w = r[2]) : f[0].length === 4 ? (w = r[0], v = r[1], p = r[2]) : (p = r[0], v = r[1], w = r[2]), w < 100 && (w += w < 50 ? 2e3 : 1900);
    const E = new Date(w, v - 1, p);
    return E.getFullYear() !== w || E.getMonth() !== v - 1 || E.getDate() !== p ? null : E;
  }
  t.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, t.prototype._setHiddenRaw = function(i) {
    _.set.call(this._hidden, i);
  }, t.prototype._displayFormatted = function(i) {
    const c = this.dom.getAttribute(m) || "", f = Q(this.dom);
    this.dom.value = e(i, c, f);
  }, Object.defineProperty(t.prototype, "value", {
    get: function() {
      return _.get.call(this._hidden);
    },
    set: function(i) {
      if (!i || i === "") {
        this._setHiddenRaw(""), _.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const c = n(i);
      c && (this._setHiddenRaw(i), _.set.call(this._picker, i), this._displayFormatted(c), this._lastISO = i, T(this.dom, "ln-date:change", {
        value: i,
        formatted: this.dom.value,
        date: c
      }));
    }
  }), Object.defineProperty(t.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? n(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      const c = i.getFullYear(), f = String(i.getMonth() + 1).padStart(2, "0"), r = String(i.getDate()).padStart(2, "0");
      this.value = c + "-" + f + "-" + r;
    }
  }), Object.defineProperty(t.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), t.prototype.destroy = function() {
    if (!this.dom[d]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), i && (this.dom.value = i), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[d];
  };
  function u() {
    new MutationObserver(function() {
      const i = document.querySelectorAll("[" + m + "]");
      for (let c = 0; c < i.length; c++) {
        const f = i[c][d];
        if (f && f.value) {
          const r = n(f.value);
          r && f._displayFormatted(r);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(m, d, t, "ln-date"), u();
})();
(function() {
  const m = "data-ln-nav", d = "lnNav";
  if (window[d] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), _ = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const n of _)
        n();
    }, history._lnNavPatched = !0;
  }
  function g(t) {
    if (!t.hasAttribute(m) || y.has(t)) return;
    const n = t.getAttribute(m);
    if (!n) return;
    const s = b(t, n);
    y.set(t, s), t[d] = s;
  }
  function b(t, n) {
    let s = Array.from(t.querySelectorAll("a"));
    l(s, n, window.location.pathname);
    const u = function() {
      s = Array.from(t.querySelectorAll("a")), l(s, n, window.location.pathname);
    };
    window.addEventListener("popstate", u), _.push(u);
    const i = new MutationObserver(function(c) {
      for (const f of c)
        if (f.type === "childList") {
          for (const r of f.addedNodes)
            if (r.nodeType === 1) {
              if (r.tagName === "A")
                s.push(r), l([r], n, window.location.pathname);
              else if (r.querySelectorAll) {
                const p = Array.from(r.querySelectorAll("a"));
                s = s.concat(p), l(p, n, window.location.pathname);
              }
            }
          for (const r of f.removedNodes)
            if (r.nodeType === 1) {
              if (r.tagName === "A")
                s = s.filter(function(p) {
                  return p !== r;
                });
              else if (r.querySelectorAll) {
                const p = Array.from(r.querySelectorAll("a"));
                s = s.filter(function(v) {
                  return !p.includes(v);
                });
              }
            }
        }
    });
    return i.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: n,
      observer: i,
      updateHandler: u,
      destroy: function() {
        i.disconnect(), window.removeEventListener("popstate", u);
        const c = _.indexOf(u);
        c !== -1 && _.splice(c, 1), y.delete(t), delete t[d];
      }
    };
  }
  function a(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function l(t, n, s) {
    const u = a(s);
    for (const i of t) {
      const c = i.getAttribute("href");
      if (!c) continue;
      const f = a(c);
      i.classList.remove(n);
      const r = f === u, p = f !== "/" && u.startsWith(f + "/");
      (r || p) && i.classList.add(n);
    }
  }
  function o() {
    W(function() {
      new MutationObserver(function(n) {
        for (const s of n)
          if (s.type === "childList") {
            for (const u of s.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(m) && g(u), u.querySelectorAll))
                for (const i of u.querySelectorAll("[" + m + "]"))
                  g(i);
          } else s.type === "attributes" && s.target.hasAttribute && s.target.hasAttribute(m) && g(s.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [m] });
    }, "ln-nav");
  }
  window[d] = g;
  function e() {
    for (const t of document.querySelectorAll("[" + m + "]"))
      g(t);
  }
  o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e) : e();
})();
(function() {
  const m = "data-ln-tabs", d = "lnTabs";
  if (window[d] !== void 0 && window[d] !== null) return;
  function y() {
    const a = (location.hash || "").replace("#", ""), l = {};
    if (!a) return l;
    for (const o of a.split("&")) {
      const e = o.indexOf(":");
      e > 0 && (l[o.slice(0, e)] = o.slice(e + 1));
    }
    return l;
  }
  function _(a, l) {
    const o = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (o) return o;
    if (a.tagName !== "A") return "";
    const e = a.getAttribute("href") || "";
    if (!e.startsWith("#")) return "";
    const t = e.slice(1);
    if (!t) return "";
    const n = t.split("&");
    if (l)
      for (const i of n) {
        const c = i.indexOf(":");
        if (c > 0 && i.slice(0, c).toLowerCase().trim() === l)
          return i.slice(c + 1).toLowerCase().trim();
      }
    const s = n[n.length - 1] || "", u = s.indexOf(":");
    return (u > 0 ? s.slice(u + 1) : s).toLowerCase().trim();
  }
  function g(a) {
    return this.dom = a, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const l of this.tabs) {
      const o = _(l, this.nsKey);
      o ? this.mapTabs[o] = l : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', l);
    }
    for (const l of this.panels) {
      const o = (l.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = l);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const a = this;
    this._clickHandlers = [];
    for (const l of this.tabs) {
      if (l[d + "Trigger"]) continue;
      const o = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        const t = _(l, a.nsKey);
        if (t)
          if (l.tagName === "A" && e.preventDefault(), a.hashEnabled) {
            const n = y();
            n[a.nsKey] = t;
            const s = Object.keys(n).map(function(u) {
              return u + ":" + n[u];
            }).join("&");
            location.hash === "#" + s ? a.dom.setAttribute("data-ln-tabs-active", t) : location.hash = s;
          } else
            a.dom.setAttribute("data-ln-tabs-active", t);
      };
      l.addEventListener("click", o), l[d + "Trigger"] = o, a._clickHandlers.push({ el: l, handler: o });
    }
    if (this._hashHandler = function() {
      if (!a.hashEnabled) return;
      const l = y();
      a.dom.setAttribute("data-ln-tabs-active", a.nsKey in l ? l[a.nsKey] : a.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let l = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const o = ht("tabs", this.dom);
        o !== null && o in this.mapPanels && (l = o);
      }
      this.dom.setAttribute("data-ln-tabs-active", l);
    }
  }
  g.prototype._applyActive = function(a) {
    var l;
    (!a || !(a in this.mapPanels)) && (a = this.defaultKey);
    for (const o in this.mapTabs) {
      const e = this.mapTabs[o];
      o === a ? (e.setAttribute("data-active", ""), e.setAttribute("aria-selected", "true")) : (e.removeAttribute("data-active"), e.setAttribute("aria-selected", "false"));
    }
    for (const o in this.mapPanels) {
      const e = this.mapPanels[o], t = o === a;
      e.classList.toggle("hidden", !t), e.setAttribute("aria-hidden", t ? "false" : "true");
    }
    if (this.autoFocus) {
      const o = (l = this.mapPanels[a]) == null ? void 0 : l.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      o && setTimeout(() => o.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: a, tab: this.mapTabs[a], panel: this.mapPanels[a] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && nt("tabs", this.dom, a);
  }, g.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const { el: a, handler: l } of this._clickHandlers)
        a.removeEventListener("click", l), delete a[d + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[d];
    }
  }, B(m, d, g, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(a) {
      const l = a.getAttribute("data-ln-tabs-active");
      a[d]._applyActive(l);
    }
  });
})();
(function() {
  const m = "data-ln-toggle", d = "lnToggle";
  if (window[d] !== void 0) return;
  function y(a) {
    const l = Array.from(a.querySelectorAll("[data-ln-toggle-for]"));
    a.hasAttribute && a.hasAttribute("data-ln-toggle-for") && l.push(a);
    for (const o of l) {
      if (o[d + "Trigger"]) continue;
      const e = function(s) {
        if (s.ctrlKey || s.metaKey || s.button === 1) return;
        s.preventDefault();
        const u = o.getAttribute("data-ln-toggle-for"), i = document.getElementById(u);
        if (!i || !i[d]) return;
        const c = o.getAttribute("data-ln-toggle-action") || "toggle";
        if (c === "open")
          i.setAttribute(m, "open");
        else if (c === "close")
          i.setAttribute(m, "close");
        else if (c === "toggle") {
          const f = i.getAttribute(m);
          i.setAttribute(m, f === "open" ? "close" : "open");
        }
      };
      o.addEventListener("click", e), o[d + "Trigger"] = e;
      const t = o.getAttribute("data-ln-toggle-for"), n = document.getElementById(t);
      n && n[d] && o.setAttribute("aria-expanded", n[d].isOpen ? "true" : "false");
    }
  }
  function _(a, l) {
    const o = document.querySelectorAll(
      '[data-ln-toggle-for="' + a.id + '"]'
    );
    for (const e of o)
      e.setAttribute("aria-expanded", l ? "true" : "false");
  }
  function g(a) {
    if (this.dom = a, a.hasAttribute("data-ln-persist")) {
      const l = ht("toggle", a);
      l !== null && a.setAttribute(m, l);
    }
    return this.isOpen = a.getAttribute(m) === "open", this.isOpen && a.classList.add("open"), _(a, this.isOpen), this;
  }
  g.prototype.destroy = function() {
    if (!this.dom[d]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const a = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const l of a)
      l[d + "Trigger"] && (l.removeEventListener("click", l[d + "Trigger"]), delete l[d + "Trigger"]);
    delete this.dom[d];
  };
  function b(a) {
    const l = a[d];
    if (!l) return;
    const e = a.getAttribute(m) === "open";
    if (e !== l.isOpen)
      if (e) {
        if (z(a, "ln-toggle:before-open", { target: a }).defaultPrevented) {
          a.setAttribute(m, "close");
          return;
        }
        l.isOpen = !0, a.classList.add("open"), _(a, !0), T(a, "ln-toggle:open", { target: a }), a.hasAttribute("data-ln-persist") && nt("toggle", a, "open");
      } else {
        if (z(a, "ln-toggle:before-close", { target: a }).defaultPrevented) {
          a.setAttribute(m, "open");
          return;
        }
        l.isOpen = !1, a.classList.remove("open"), _(a, !1), T(a, "ln-toggle:close", { target: a }), a.hasAttribute("data-ln-persist") && nt("toggle", a, "close");
      }
  }
  B(m, d, g, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: b,
    onInit: y
  });
})();
(function() {
  const m = "data-ln-accordion", d = "lnAccordion";
  if (window[d] !== void 0) return;
  function y(_) {
    return this.dom = _, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== _) return;
      const b = _.querySelectorAll("[data-ln-toggle]");
      for (const a of b)
        a !== g.detail.target && a.closest("[data-ln-accordion]") === _ && a.getAttribute("data-ln-toggle") === "open" && a.setAttribute("data-ln-toggle", "close");
      T(_, "ln-accordion:change", { target: g.detail.target });
    }, _.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(m, d, y, "ln-accordion");
})();
(function() {
  const m = "data-ln-dropdown", d = "lnDropdown";
  if (window[d] !== void 0) return;
  function y(_) {
    if (this.dom = _, this.toggleEl = _.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = _.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const g = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), g._teleportRestore = Lt(g.toggleEl), g.toggleEl.style.position = "fixed", g._reposition(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), T(_, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g.toggleEl.style.position = "", g.toggleEl.style.top = "", g.toggleEl.style.left = "", g.toggleEl.style.right = "", g.toggleEl.style.transform = "", g.toggleEl.style.margin = "", g._teleportRestore && (g._teleportRestore(), g._teleportRestore = null), T(_, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const _ = this.triggerBtn.getBoundingClientRect(), g = yt(this.toggleEl), b = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, a = ft(_, g, "bottom-end", b);
    this.toggleEl.style.top = a.top + "px", this.toggleEl.style.left = a.left + "px";
  }, y.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const _ = this;
    this._boundDocClick = function(g) {
      _.dom.contains(g.target) || _.toggleEl && _.toggleEl.contains(g.target) || _.toggleEl && _.toggleEl.getAttribute("data-ln-toggle") === "open" && _.toggleEl.setAttribute("data-ln-toggle", "close");
    }, _._docClickTimeout = setTimeout(function() {
      _._docClickTimeout = null, document.addEventListener("click", _._boundDocClick);
    }, 0);
  }, y.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, y.prototype._addScrollRepositionListener = function() {
    const _ = this;
    this._boundScrollReposition = function() {
      _._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, y.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, y.prototype._addResizeCloseListener = function() {
    const _ = this;
    this._boundResizeClose = function() {
      _.toggleEl && _.toggleEl.getAttribute("data-ln-toggle") === "open" && _.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, y.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, y.prototype.destroy = function() {
    this.dom[d] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(m, d, y, "ln-dropdown");
})();
(function() {
  const m = "data-ln-popover", d = "lnPopover", y = "data-ln-popover-for", _ = "data-ln-popover-position";
  if (window[d] !== void 0) return;
  const g = [];
  let b = null;
  function a() {
    b || (b = function(t) {
      if (t.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function l() {
    g.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function o(t) {
    return this.dom = t, this.isOpen = t.getAttribute(m) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), t.hasAttribute("role") || t.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  o.prototype.open = function(t) {
    this.isOpen || (this.trigger = t || null, this.dom.setAttribute(m, "open"));
  }, o.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(m, "closed");
  }, o.prototype.toggle = function(t) {
    this.isOpen ? this.close() : this.open(t);
  }, o.prototype._applyOpen = function(t) {
    this.isOpen = !0, t && (this.trigger = t), this._previousFocus = document.activeElement, this._teleportRestore = Lt(this.dom);
    const n = yt(this.dom);
    if (this.trigger) {
      const c = this.trigger.getBoundingClientRect(), f = this.dom.getAttribute(_) || "bottom", r = ft(c, n, f, 8);
      this.dom.style.top = r.top + "px", this.dom.style.left = r.left + "px", this.dom.setAttribute("data-ln-popover-placement", r.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const s = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), u = Array.prototype.find.call(s, at);
    u ? u.focus() : this.dom.focus();
    const i = this;
    this._boundDocClick = function(c) {
      i.dom.contains(c.target) || i.trigger && i.trigger.contains(c.target) || i.close();
    }, i._docClickTimeout = setTimeout(function() {
      i._docClickTimeout = null, document.addEventListener("click", i._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!i.trigger) return;
      const c = i.trigger.getBoundingClientRect(), f = yt(i.dom), r = i.dom.getAttribute(_) || "bottom", p = ft(c, f, r, 8);
      i.dom.style.top = p.top + "px", i.dom.style.left = p.left + "px", i.dom.setAttribute("data-ln-popover-placement", p.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), a(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, o.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const t = g.indexOf(this);
    t !== -1 && g.splice(t, 1), l(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, o.prototype.destroy = function() {
    this.dom[d] && (this.isOpen && this._applyClose(), delete this.dom[d], T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function e(t) {
    this.dom = t;
    const n = t.getAttribute(y);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", n), this._onClick = function(s) {
      if (s.ctrlKey || s.metaKey || s.button === 1) return;
      s.preventDefault();
      const u = document.getElementById(n);
      !u || !u[d] || u[d].toggle(t);
    }, t.addEventListener("click", this._onClick), this;
  }
  e.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[d + "Trigger"];
  }, B(m, d, o, "ln-popover", {
    onAttributeChange: function(t) {
      const n = t[d];
      if (!n) return;
      const u = t.getAttribute(m) === "open";
      if (u !== n.isOpen)
        if (u) {
          if (z(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: n.trigger
          }).defaultPrevented) {
            t.setAttribute(m, "closed");
            return;
          }
          n._applyOpen(n.trigger);
        } else {
          if (z(t, "ln-popover:before-close", {
            popoverId: t.id,
            target: t,
            trigger: n.trigger
          }).defaultPrevented) {
            t.setAttribute(m, "open");
            return;
          }
          n._applyClose();
        }
    }
  }), B(y, d + "Trigger", e, "ln-popover-trigger");
})();
(function() {
  const m = "data-ln-tooltip-enhance", d = "data-ln-tooltip", y = "data-ln-tooltip-position", _ = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[_] !== void 0) return;
  let b = 0, a = null, l = null, o = null, e = null, t = null;
  function n() {
    return a && a.parentNode || (a = document.getElementById(g), a || (a = document.createElement("div"), a.id = g, document.body.appendChild(a))), a;
  }
  function s() {
    t || (t = function(r) {
      r.key === "Escape" && c();
    }, document.addEventListener("keydown", t));
  }
  function u() {
    t && (document.removeEventListener("keydown", t), t = null);
  }
  function i(r) {
    if (o === r) return;
    c();
    const p = r.getAttribute(d) || r.getAttribute("title");
    if (!p) return;
    n(), r.hasAttribute("title") && (e = r.getAttribute("title"), r.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = p, r[_ + "Uid"] || (b += 1, r[_ + "Uid"] = "ln-tooltip-" + b), v.id = r[_ + "Uid"], a.appendChild(v);
    const w = v.offsetWidth, E = v.offsetHeight, A = r.getBoundingClientRect(), C = r.getAttribute(y) || "top", O = ft(A, { width: w, height: E }, C, 6);
    v.style.top = O.top + "px", v.style.left = O.left + "px", v.setAttribute("data-ln-tooltip-placement", O.placement), r.setAttribute("aria-describedby", v.id), l = v, o = r, s();
  }
  function c() {
    if (!l) {
      u();
      return;
    }
    o && (o.removeAttribute("aria-describedby"), e !== null && o.setAttribute("title", e)), e = null, l.parentNode && l.parentNode.removeChild(l), l = null, o = null, u();
  }
  function f(r) {
    return this.dom = r, this._onEnter = function() {
      i(r);
    }, this._onLeave = function() {
      o === r && c();
    }, this._onFocus = function() {
      i(r);
    }, this._onBlur = function() {
      o === r && c();
    }, r.addEventListener("mouseenter", this._onEnter), r.addEventListener("mouseleave", this._onLeave), r.addEventListener("focus", this._onFocus, !0), r.addEventListener("blur", this._onBlur, !0), this;
  }
  f.prototype.destroy = function() {
    const r = this.dom;
    r.removeEventListener("mouseenter", this._onEnter), r.removeEventListener("mouseleave", this._onLeave), r.removeEventListener("focus", this._onFocus, !0), r.removeEventListener("blur", this._onBlur, !0), o === r && c(), delete r[_], delete r[_ + "Uid"], T(r, "ln-tooltip:destroyed", { trigger: r });
  }, B(
    "[" + m + "], [" + d + "][title]",
    _,
    f,
    "ln-tooltip"
  );
})();
const It = `<li class="ln-toast__item">\r
	<div class="ln-toast__card" data-ln-attr="role:role, aria-live:ariaLive">\r
		<div class="ln-toast__side">\r
			<svg class="ln-icon" aria-hidden="true"><use href=""></use></svg>\r
		</div>\r
		<div class="ln-toast__content">\r
			<div class="ln-toast__head">\r
				<strong class="ln-toast__title" data-ln-field="title"></strong>\r
			</div>\r
			<button type="button" class="ln-toast__close" aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>\r
			<div class="ln-toast__body" data-ln-show="hasBody"></div>\r
		</div>\r
	</div>\r
</li>\r
`;
(function() {
  const m = "data-ln-toast", d = "lnToast", y = "ln-toast-item", _ = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, g = { success: "success", error: "error", warn: "warning", info: "info" }, b = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function a() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const r = document.createElement("template");
    r.setAttribute("data-ln-template", "ln-toast-item"), r.innerHTML = It, document.body.appendChild(r);
  }
  function l(r) {
    if (!r || r.nodeType !== 1) return;
    const p = Array.from(r.querySelectorAll("[" + m + "]"));
    r.hasAttribute && r.hasAttribute(m) && p.push(r);
    for (const v of p)
      v[d] || new o(v);
  }
  function o(r) {
    this.dom = r, r[d] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    for (const p of Array.from(r.querySelectorAll("[data-ln-toast-item]")))
      i(p, r);
    return this;
  }
  o.prototype.destroy = function() {
    if (this.dom[d]) {
      for (const r of Array.from(this.dom.children))
        s(r);
      delete this.dom[d];
    }
  };
  function e(r, p) {
    const v = ((r.type || "info") + "").toLowerCase(), w = $(p, y, "ln-toast");
    if (!w)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    const E = w.firstElementChild;
    if (!E) return null;
    const A = !!(r.message || r.data && r.data.errors);
    Y(E, {
      title: r.title || b[v] || b.info,
      role: v === "error" ? "alert" : "status",
      ariaLive: v === "error" ? "assertive" : "polite",
      hasBody: A
    });
    const C = E.querySelector(".ln-toast__card");
    C && C.classList.add(g[v] || "info");
    const O = E.querySelector(".ln-toast__side");
    if (O) {
      const M = O.querySelector("use");
      M && M.setAttribute("href", "#ln-" + (_[v] || _.info));
    }
    const F = E.querySelector(".ln-toast__body");
    F && A && t(F, r);
    const D = E.querySelector(".ln-toast__close");
    return D && D.addEventListener("click", function() {
      s(E);
    }), E;
  }
  function t(r, p) {
    if (p.message)
      if (Array.isArray(p.message)) {
        const v = document.createElement("ul");
        for (const w of p.message) {
          const E = document.createElement("li");
          E.textContent = w, v.appendChild(E);
        }
        r.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = p.message, r.appendChild(v);
      }
    if (p.data && p.data.errors) {
      const v = document.createElement("ul");
      for (const w of Object.values(p.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = w, v.appendChild(E);
      }
      r.appendChild(v);
    }
  }
  function n(r, p) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(p), requestAnimationFrame(() => p.classList.add("ln-toast__item--in"));
  }
  function s(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function u(r) {
    let p = r && r.container;
    return typeof p == "string" && (p = document.querySelector(p)), p instanceof HTMLElement || (p = document.querySelector("[" + m + "]") || document.getElementById("ln-toast-container")), p || null;
  }
  function i(r, p) {
    const v = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), w = r.getAttribute("data-title"), E = (r.innerText || r.textContent || "").trim(), A = e({
      type: v,
      title: w,
      message: E || void 0
    }, p);
    A && (r.parentNode && r.parentNode.replaceChild(A, r), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function c(r) {
    const p = r.detail || {}, v = u(p);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const w = v[d] || new o(v), E = e(p, v);
    if (!E) return;
    const A = Number.isFinite(p.timeout) ? p.timeout : w.timeoutDefault;
    n(w, E), A > 0 && (E._timer = setTimeout(() => s(E), A));
  }
  function f(r) {
    const p = r && r.detail || {};
    if (p.container) {
      const v = u(p);
      if (v)
        for (const w of Array.from(v.children)) s(w);
    } else {
      const v = document.querySelectorAll("[" + m + "]");
      for (const w of Array.from(v))
        for (const E of Array.from(w.children)) s(E);
    }
  }
  W(function() {
    a(), window.addEventListener("ln-toast:enqueue", c), window.addEventListener("ln-toast:clear", f), new MutationObserver(function(p) {
      for (const v of p) {
        if (v.type === "attributes") {
          l(v.target);
          continue;
        }
        for (const w of v.addedNodes)
          l(w);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [m] }), l(document.body);
  }, "ln-toast");
})();
(function() {
  const m = "data-ln-upload", d = "lnUpload", y = "data-ln-upload-dict", _ = "data-ln-upload-accept", g = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function a() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = b;
    const c = i.firstElementChild;
    c && document.body.appendChild(c);
  }
  if (window[d] !== void 0) return;
  function l(i) {
    if (i === 0) return "0 B";
    const c = 1024, f = ["B", "KB", "MB", "GB"], r = Math.floor(Math.log(i) / Math.log(c));
    return parseFloat((i / Math.pow(c, r)).toFixed(1)) + " " + f[r];
  }
  function o(i) {
    return i.split(".").pop().toLowerCase();
  }
  function e(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "lnc-file-" + i : "ln-file";
  }
  function t(i, c) {
    if (!c) return !0;
    const f = "." + o(i.name);
    return c.split(",").map(function(p) {
      return p.trim().toLowerCase();
    }).includes(f.toLowerCase());
  }
  function n(i) {
    if (i.hasAttribute("data-ln-upload-initialized")) return;
    i.setAttribute("data-ln-upload-initialized", "true"), a();
    const c = Ct(i, y), f = i.querySelector(".ln-upload__zone"), r = i.querySelector(".ln-upload__list"), p = i.getAttribute(_) || "";
    if (!f || !r) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let v = i.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), p && (v.accept = p.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), i.appendChild(v));
    const w = i.getAttribute(m) || "/files/upload", E = i.getAttribute(g) || "", A = /* @__PURE__ */ new Map();
    let C = 0;
    function O() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function F(R) {
      if (!t(R, p)) {
        const k = c["invalid-type"];
        T(i, "ln-upload:invalid", {
          file: R,
          message: k
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: c["invalid-title"] || "Invalid File",
          message: k || c["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++C, U = o(R.name), G = e(U), ct = $(i, "ln-upload-item", "ln-upload");
      if (!ct) return;
      const K = ct.firstElementChild;
      if (!K) return;
      K.setAttribute("data-file-id", P), Y(K, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + G,
        removeLabel: c.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const st = K.querySelector(".ln-upload__progress-bar"), h = K.querySelector('[data-ln-upload-action="remove"]');
      h && (h.disabled = !0), r.appendChild(K);
      const L = new FormData();
      L.append("file", R), L.append("context", E);
      const S = new XMLHttpRequest();
      S.upload.addEventListener("progress", function(k) {
        if (k.lengthComputable) {
          const x = Math.round(k.loaded / k.total * 100);
          st.style.width = x + "%", Y(K, { sizeText: x + "%" });
        }
      }), S.addEventListener("load", function() {
        if (S.status >= 200 && S.status < 300) {
          let k;
          try {
            k = JSON.parse(S.responseText);
          } catch {
            I("Invalid response");
            return;
          }
          Y(K, { sizeText: l(k.size || R.size), uploading: !1 }), h && (h.disabled = !1), A.set(P, {
            serverId: k.id,
            name: k.name,
            size: k.size
          }), D(), T(i, "ln-upload:uploaded", {
            localId: P,
            serverId: k.id,
            name: k.name
          });
        } else {
          let k = c["upload-failed"] || "Upload failed";
          try {
            k = JSON.parse(S.responseText).message || k;
          } catch {
          }
          I(k);
        }
      }), S.addEventListener("error", function() {
        I(c["network-error"] || "Network error");
      });
      function I(k) {
        st && (st.style.width = "100%"), Y(K, { sizeText: c.error || "Error", uploading: !1, error: !0 }), h && (h.disabled = !1), T(i, "ln-upload:error", {
          file: R,
          message: k
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: c["error-title"] || "Upload Error",
          message: k || c["upload-failed"] || "Failed to upload file"
        });
      }
      S.open("POST", w), S.setRequestHeader("X-CSRF-TOKEN", O()), S.setRequestHeader("Accept", "application/json"), S.send(L);
    }
    function D() {
      for (const R of i.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = R.serverId, i.appendChild(P);
      }
    }
    function M(R) {
      const P = A.get(R), U = r.querySelector('[data-file-id="' + R + '"]');
      if (!P || !P.serverId) {
        U && U.remove(), A.delete(R), D();
        return;
      }
      U && Y(U, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": O(),
          Accept: "application/json"
        }
      }).then(function(G) {
        G.status === 200 ? (U && U.remove(), A.delete(R), D(), T(i, "ln-upload:removed", {
          localId: R,
          serverId: P.serverId
        })) : (U && Y(U, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: c["delete-title"] || "Error",
          message: c["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(G) {
        console.warn("[ln-upload] Delete error:", G), U && Y(U, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: c["network-error"] || "Network error",
          message: c["connection-error"] || "Could not connect to server"
        });
      });
    }
    function H(R) {
      for (const P of R)
        F(P);
      v.value = "";
    }
    const V = function() {
      v.click();
    }, Z = function() {
      H(this.files);
    }, tt = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, X = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.add("ln-upload__zone--dragover");
    }, it = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.remove("ln-upload__zone--dragover");
    }, ot = function(R) {
      R.preventDefault(), R.stopPropagation(), f.classList.remove("ln-upload__zone--dragover"), H(R.dataTransfer.files);
    }, rt = function(R) {
      const P = R.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !r.contains(P) || P.disabled) return;
      const U = P.closest(".ln-upload__item");
      U && M(U.getAttribute("data-file-id"));
    };
    f.addEventListener("click", V), v.addEventListener("change", Z), f.addEventListener("dragenter", tt), f.addEventListener("dragover", X), f.addEventListener("dragleave", it), f.addEventListener("drop", ot), r.addEventListener("click", rt), i.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(A.values()).map(function(R) {
          return R.serverId;
        });
      },
      getFiles: function() {
        return Array.from(A.values());
      },
      clear: function() {
        for (const [, R] of A)
          R.serverId && fetch("/files/" + R.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": O(),
              Accept: "application/json"
            }
          });
        A.clear(), r.innerHTML = "", D(), T(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        f.removeEventListener("click", V), v.removeEventListener("change", Z), f.removeEventListener("dragenter", tt), f.removeEventListener("dragover", X), f.removeEventListener("dragleave", it), f.removeEventListener("drop", ot), r.removeEventListener("click", rt), A.clear(), r.innerHTML = "", D(), i.removeAttribute("data-ln-upload-initialized"), delete i.lnUploadAPI;
      }
    };
  }
  function s() {
    for (const i of document.querySelectorAll("[" + m + "]"))
      n(i);
  }
  function u() {
    W(function() {
      new MutationObserver(function(c) {
        for (const f of c)
          if (f.type === "childList") {
            for (const r of f.addedNodes)
              if (r.nodeType === 1) {
                r.hasAttribute(m) && n(r);
                for (const p of r.querySelectorAll("[" + m + "]"))
                  n(p);
              }
          } else f.type === "attributes" && f.target.hasAttribute(m) && n(f.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [m]
      });
    }, "ln-upload");
  }
  window[d] = {
    init: n,
    initAll: s
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const m = "lnExternalLinks";
  if (window[m] !== void 0) return;
  function d(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function y(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !d(l)) return;
    l.target = "_blank";
    const o = (l.rel || "").split(/\s+/).filter(Boolean);
    o.includes("noopener") || o.push("noopener"), o.includes("noreferrer") || o.push("noreferrer"), l.rel = o.join(" ");
    const e = document.createElement("span");
    e.className = "sr-only", e.textContent = "(opens in new tab)", l.appendChild(e), l.setAttribute("data-ln-external-link", "processed"), T(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function _(l) {
    l = l || document.body;
    for (const o of l.querySelectorAll("a, area"))
      y(o);
  }
  function g() {
    W(function() {
      document.body.addEventListener("click", function(l) {
        const o = l.target.closest("a, area");
        o && o.getAttribute("data-ln-external-link") === "processed" && T(o, "ln-external-links:clicked", {
          link: o,
          href: o.href,
          text: o.textContent || o.title || ""
        });
      });
    }, "ln-external-links");
  }
  function b() {
    W(function() {
      new MutationObserver(function(o) {
        for (const e of o) {
          if (e.type === "childList") {
            for (const t of e.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && y(t), t.querySelectorAll))
                for (const n of t.querySelectorAll("a, area"))
                  y(n);
          }
          if (e.type === "attributes" && e.attributeName === "href") {
            const t = e.target;
            t.matches && (t.matches("a") || t.matches("area")) && y(t);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["href"]
      });
    }, "ln-external-links");
  }
  function a() {
    g(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      _();
    }) : _();
  }
  window[m] = {
    process: _
  }, a();
})();
(function() {
  const m = "data-ln-link", d = "lnLink";
  if (window[d] !== void 0) return;
  let y = null;
  function _() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function g(r) {
    y && (y.textContent = r, y.classList.add("ln-link-status--visible"));
  }
  function b() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function a(r, p) {
    if (p.target.closest("a, button, input, select, textarea")) return;
    const v = r.querySelector("a");
    if (!v) return;
    const w = v.getAttribute("href");
    if (!w) return;
    if (p.ctrlKey || p.metaKey || p.button === 1) {
      window.open(w, "_blank");
      return;
    }
    z(r, "ln-link:navigate", { target: r, href: w, link: v }).defaultPrevented || v.click();
  }
  function l(r) {
    const p = r.querySelector("a");
    if (!p) return;
    const v = p.getAttribute("href");
    v && g(v);
  }
  function o() {
    b();
  }
  function e(r) {
    r[d + "Row"] || (r[d + "Row"] = !0, r.querySelector("a") && (r._lnLinkClick = function(p) {
      a(r, p);
    }, r._lnLinkEnter = function() {
      l(r);
    }, r.addEventListener("click", r._lnLinkClick), r.addEventListener("mouseenter", r._lnLinkEnter), r.addEventListener("mouseleave", o)));
  }
  function t(r) {
    r[d + "Row"] && (r._lnLinkClick && r.removeEventListener("click", r._lnLinkClick), r._lnLinkEnter && r.removeEventListener("mouseenter", r._lnLinkEnter), r.removeEventListener("mouseleave", o), delete r._lnLinkClick, delete r._lnLinkEnter, delete r[d + "Row"]);
  }
  function n(r) {
    if (!r[d + "Init"]) return;
    const p = r.tagName;
    if (p === "TABLE" || p === "TBODY") {
      const v = p === "TABLE" && r.querySelector("tbody") || r;
      for (const w of v.querySelectorAll("tr"))
        t(w);
    } else
      t(r);
    delete r[d + "Init"];
  }
  function s(r) {
    if (r[d + "Init"]) return;
    r[d + "Init"] = !0;
    const p = r.tagName;
    if (p === "TABLE" || p === "TBODY") {
      const v = p === "TABLE" && r.querySelector("tbody") || r;
      for (const w of v.querySelectorAll("tr"))
        e(w);
    } else
      e(r);
  }
  function u(r) {
    r.hasAttribute && r.hasAttribute(m) && s(r);
    const p = r.querySelectorAll ? r.querySelectorAll("[" + m + "]") : [];
    for (const v of p)
      s(v);
  }
  function i() {
    W(function() {
      new MutationObserver(function(p) {
        for (const v of p)
          if (v.type === "childList")
            for (const w of v.addedNodes)
              w.nodeType === 1 && (u(w), w.tagName === "TR" && w.closest("[" + m + "]") && e(w));
          else v.type === "attributes" && u(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [m]
      });
    }, "ln-link");
  }
  function c(r) {
    u(r);
  }
  window[d] = { init: c, destroy: n };
  function f() {
    _(), i(), c(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
})();
(function() {
  const m = "[data-ln-progress]", d = "lnProgress";
  if (window[d] !== void 0) return;
  function y(e) {
    _(e);
  }
  function _(e) {
    const t = Array.from(e.querySelectorAll(m));
    for (const n of t)
      n[d] || (n[d] = new g(n));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && !e[d] && (e[d] = new g(e));
  }
  function g(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, o.call(this), a.call(this), l.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[d]);
  };
  function b() {
    W(function() {
      new MutationObserver(function(t) {
        for (const n of t)
          if (n.type === "childList")
            for (const s of n.addedNodes)
              s.nodeType === 1 && _(s);
          else n.type === "attributes" && _(n.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  b();
  function a() {
    const e = this, t = new MutationObserver(function(n) {
      for (const s of n)
        (s.attributeName === "data-ln-progress" || s.attributeName === "data-ln-progress-max") && o.call(e);
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = t;
  }
  function l() {
    const e = this, t = this.dom.parentElement;
    if (!t || !t.hasAttribute("data-ln-progress-max")) return;
    const n = new MutationObserver(function(s) {
      for (const u of s)
        u.attributeName === "data-ln-progress-max" && o.call(e);
    });
    n.observe(t, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function o() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = this.dom.parentElement, s = (t && t.hasAttribute("data-ln-progress-max") ? parseFloat(t.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = s > 0 ? e / s * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const i = Math.max(0, Math.min(e, s));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(s)), this.dom.setAttribute("aria-valuenow", String(i)), T(this.dom, "ln-progress:change", { target: this.dom, value: e, max: s, percentage: u });
  }
  window[d] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const m = "data-ln-filter", d = "lnFilter", y = "data-ln-filter-initialized", _ = "data-ln-filter-key", g = "data-ln-filter-value", b = "data-ln-filter-hide", a = "data-ln-filter-reset", l = "data-ln-filter-col", o = /* @__PURE__ */ new WeakMap();
  if (window[d] !== void 0) return;
  function e(i) {
    return i.hasAttribute(a) || i.getAttribute(g) === "";
  }
  function t(i) {
    let c = null;
    const f = [];
    for (let r = 0; r < i.inputs.length; r++) {
      const p = i.inputs[r];
      if (p.checked && !e(p)) {
        c === null && (c = p.getAttribute(_));
        const v = p.getAttribute(g);
        v && f.push(v);
      }
    }
    return { key: c, values: f };
  }
  function n(i, c) {
    if (i.length !== c.length) return !0;
    for (let f = 0; f < i.length; f++) if (i[f] !== c[f]) return !0;
    return !1;
  }
  function s(i) {
    const c = i.dom, f = i.colIndex, r = c.querySelector("template");
    if (!r || f === null) return;
    const p = document.getElementById(i.targetId);
    if (!p) return;
    const v = p.tagName === "TABLE" ? p : p.querySelector("table");
    if (!v || p.hasAttribute("data-ln-table")) return;
    const w = {}, E = [], A = v.tBodies;
    for (let F = 0; F < A.length; F++) {
      const D = A[F].rows;
      for (let M = 0; M < D.length; M++) {
        const H = D[M].cells[f], V = H ? H.textContent.trim() : "";
        V && !w[V] && (w[V] = !0, E.push(V));
      }
    }
    E.sort(function(F, D) {
      return F.localeCompare(D);
    });
    const C = c.querySelector("[" + _ + "]"), O = C ? C.getAttribute(_) : c.getAttribute("data-ln-filter-key") || "col" + f;
    for (let F = 0; F < E.length; F++) {
      const D = r.content.cloneNode(!0), M = D.querySelector("input");
      M && (M.setAttribute(_, O), M.setAttribute(g, E[F]), Et(D, { text: E[F] }), c.appendChild(D));
    }
  }
  function u(i) {
    if (i.hasAttribute(y)) return this;
    this.dom = i, this.targetId = i.getAttribute(m);
    const c = i.getAttribute(l);
    this.colIndex = c !== null ? parseInt(c, 10) : null, s(this), this.inputs = Array.from(i.querySelectorAll("[" + _ + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(_) : null, this._lastSnapshot = null;
    const f = this, r = kt(
      function() {
        f._render();
      },
      function() {
        f._afterRender();
      }
    );
    this._queueRender = r, this._attachHandlers();
    let p = !1;
    if (i.hasAttribute("data-ln-persist")) {
      const v = ht("filter", i);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let w = 0; w < this.inputs.length; w++) {
          const E = this.inputs[w];
          e(E) ? E.checked = !1 : E.getAttribute(_) === v.key && v.values.indexOf(E.getAttribute(g)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        r(), p = !0;
      }
    }
    if (!p) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !e(this.inputs[v])) {
          r();
          break;
        }
    }
    return i.setAttribute(y, ""), this;
  }
  u.prototype._attachHandlers = function() {
    const i = this;
    this.inputs.forEach(function(c) {
      c[d + "Bound"] || (c[d + "Bound"] = !0, c._lnFilterChange = function() {
        if (e(c)) {
          for (let f = 0; f < i.inputs.length; f++)
            e(i.inputs[f]) || (i.inputs[f].checked = !1);
          c.checked = !0, i._queueRender();
          return;
        }
        if (c.checked)
          for (let f = 0; f < i.inputs.length; f++)
            e(i.inputs[f]) && (i.inputs[f].checked = !1);
        else {
          let f = !1;
          for (let r = 0; r < i.inputs.length; r++)
            if (!e(i.inputs[r]) && i.inputs[r].checked) {
              f = !0;
              break;
            }
          if (!f)
            for (let r = 0; r < i.inputs.length; r++)
              e(i.inputs[r]) && (i.inputs[r].checked = !0);
        }
        i._queueRender();
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, u.prototype._render = function() {
    const i = this, c = t(this), f = c.key === null || c.values.length === 0, r = [];
    for (let p = 0; p < c.values.length; p++)
      r.push(c.values[p].toLowerCase());
    if (i.colIndex !== null)
      i._filterTableRows(c);
    else {
      const p = document.getElementById(i.targetId);
      if (!p) return;
      const v = p.children;
      for (let w = 0; w < v.length; w++) {
        const E = v[w];
        if (f) {
          E.removeAttribute(b);
          continue;
        }
        const A = E.getAttribute("data-" + c.key);
        E.removeAttribute(b), A !== null && r.indexOf(A.toLowerCase()) === -1 && E.setAttribute(b, "true");
      }
    }
  }, u.prototype._afterRender = function() {
    const i = t(this), c = this._lastSnapshot;
    if (!c || c.key !== i.key || n(c.values, i.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: i.key,
        values: i.values.slice()
      });
      const r = c && c.values.length > 0, p = i.values.length === 0;
      r && p && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: i.key, values: i.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (i.key && i.values.length > 0 ? nt("filter", this.dom, { key: i.key, values: i.values.slice() }) : nt("filter", this.dom, null));
  }, u.prototype._dispatchOnBoth = function(i, c) {
    T(this.dom, i, c);
    const f = document.getElementById(this.targetId);
    f && f !== this.dom && T(f, i, c);
  }, u.prototype._filterTableRows = function(i) {
    const c = document.getElementById(this.targetId);
    if (!c) return;
    const f = c.tagName === "TABLE" ? c : c.querySelector("table");
    if (!f || c.hasAttribute("data-ln-table")) return;
    const r = i.key || this._filterKey, p = i.values;
    o.has(f) || o.set(f, {});
    const v = o.get(f);
    if (r && p.length > 0) {
      const C = [];
      for (let O = 0; O < p.length; O++)
        C.push(p[O].toLowerCase());
      v[r] = { col: this.colIndex, values: C };
    } else r && delete v[r];
    const w = Object.keys(v), E = w.length > 0, A = f.tBodies;
    for (let C = 0; C < A.length; C++) {
      const O = A[C].rows;
      for (let F = 0; F < O.length; F++) {
        const D = O[F];
        if (!E) {
          D.removeAttribute(b);
          continue;
        }
        let M = !0;
        for (let H = 0; H < w.length; H++) {
          const V = v[w[H]], Z = D.cells[V.col], tt = Z ? Z.textContent.trim().toLowerCase() : "";
          if (V.values.indexOf(tt) === -1) {
            M = !1;
            break;
          }
        }
        M ? D.removeAttribute(b) : D.setAttribute(b, "true");
      }
    }
  }, u.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.colIndex !== null) {
        const i = document.getElementById(this.targetId);
        if (i) {
          const c = i.tagName === "TABLE" ? i : i.querySelector("table");
          if (c && o.has(c)) {
            const f = o.get(c), r = this._filterKey;
            r && f[r] && delete f[r], Object.keys(f).length === 0 && o.delete(c);
          }
        }
      }
      this.inputs.forEach(function(i) {
        i._lnFilterChange && (i.removeEventListener("change", i._lnFilterChange), delete i._lnFilterChange), delete i[d + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[d];
    }
  }, B(m, d, u, "ln-filter");
})();
(function() {
  const m = "data-ln-search", d = "lnSearch", y = "data-ln-search-initialized", _ = "data-ln-search-hide";
  if (window[d] !== void 0) return;
  function b(a) {
    if (a.hasAttribute(y)) return this;
    this.dom = a, this.targetId = a.getAttribute(m);
    const l = a.tagName;
    if (this.input = l === "INPUT" || l === "TEXTAREA" ? a : a.querySelector('[name="search"]') || a.querySelector('input[type="search"]') || a.querySelector('input[type="text"]'), this.itemsSelector = a.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const o = this;
      queueMicrotask(function() {
        o._search(o.input.value.trim().toLowerCase());
      });
    }
    return a.setAttribute(y, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      a.input.value = "", a._search(""), a.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(a._debounceTimer), a._debounceTimer = setTimeout(function() {
        a._search(a.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(a) {
    const l = document.getElementById(this.targetId);
    if (!l || z(l, "ln-search:change", { term: a, targetId: this.targetId }).defaultPrevented) return;
    const e = this.itemsSelector ? l.querySelectorAll(this.itemsSelector) : l.children;
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      n.removeAttribute(_), a && !n.textContent.replace(/\s+/g, " ").toLowerCase().includes(a) && n.setAttribute(_, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[d] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[d]);
  }, B(m, d, b, "ln-search");
})();
(function() {
  const m = "lnTableSort", d = "data-ln-sort", y = "data-ln-sort-active";
  if (window[m] !== void 0) return;
  function _(o) {
    g(o);
  }
  function g(o) {
    const e = Array.from(o.querySelectorAll("table"));
    o.tagName === "TABLE" && e.push(o), e.forEach(function(t) {
      if (t[m]) return;
      const n = Array.from(t.querySelectorAll("th[" + d + "]"));
      n.length && (t[m] = new a(t, n));
    });
  }
  function b(o, e) {
    o.querySelectorAll("[data-ln-sort-icon]").forEach(function(n) {
      const s = n.getAttribute("data-ln-sort-icon");
      e == null ? n.classList.toggle("hidden", s !== null && s !== "") : n.classList.toggle("hidden", s !== e);
    });
  }
  function a(o, e) {
    this.table = o, this.ths = e, this._col = -1, this._dir = null;
    const t = this;
    e.forEach(function(s, u) {
      s[m + "Bound"] || (s[m + "Bound"] = !0, s._lnSortClick = function(i) {
        const c = i.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        c && c !== s || t._handleClick(u, s);
      }, s.addEventListener("click", s._lnSortClick));
    });
    const n = o.closest("[data-ln-table][data-ln-persist]");
    if (n) {
      const s = ht("table-sort", n);
      s && s.dir && s.col >= 0 && s.col < e.length && (this._handleClick(s.col, e[s.col]), s.dir === "desc" && this._handleClick(s.col, e[s.col]));
    }
    return this;
  }
  a.prototype._handleClick = function(o, e) {
    let t;
    this._col !== o ? t = "asc" : this._dir === "asc" ? t = "desc" : this._dir === "desc" ? t = null : t = "asc", this.ths.forEach(function(s) {
      s.removeAttribute(y), b(s, null);
    }), t === null ? (this._col = -1, this._dir = null) : (this._col = o, this._dir = t, e.setAttribute(y, t), b(e, t)), T(this.table, "ln-table:sort", {
      column: o,
      sortType: e.getAttribute(d),
      direction: t
    });
    const n = this.table.closest("[data-ln-table][data-ln-persist]");
    n && (t === null ? nt("table-sort", n, null) : nt("table-sort", n, { col: o, dir: t }));
  }, a.prototype.destroy = function() {
    this.table[m] && (this.ths.forEach(function(o) {
      o._lnSortClick && (o.removeEventListener("click", o._lnSortClick), delete o._lnSortClick), delete o[m + "Bound"];
    }), delete this.table[m]);
  };
  function l() {
    W(function() {
      new MutationObserver(function(e) {
        e.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(n) {
            n.nodeType === 1 && g(n);
          }) : t.type === "attributes" && g(t.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [d] });
    }, "ln-table-sort");
  }
  window[m] = _, l(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const m = "data-ln-table", d = "lnTable", y = "data-ln-sort", _ = "data-ln-table-empty";
  if (window[d] !== void 0) return;
  const a = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function l(o) {
    this.dom = o, this.table = o.querySelector("table"), this.tbody = o.querySelector("tbody"), this.thead = o.querySelector("thead");
    const e = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = e ? Array.from(e.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const t = this;
    return this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(n) {
      n.preventDefault(), t._searchTerm = n.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(o, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-search:change", this._onSearch), this._onSort = function(n) {
      t._sortCol = n.detail.direction === null ? -1 : n.detail.column, t._sortDir = n.detail.direction, t._sortType = n.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(o, "ln-table:sorted", {
        column: n.detail.column,
        direction: n.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(n) {
      const s = n.detail.key;
      let u = !1;
      for (let f = 0; f < t.ths.length; f++)
        if (t.ths[f].getAttribute("data-ln-filter-col") === s) {
          u = !0;
          break;
        }
      if (!u) return;
      const i = n.detail.values;
      if (!i || i.length === 0)
        delete t._columnFilters[s];
      else {
        const f = [];
        for (let r = 0; r < i.length; r++)
          f.push(i[r].toLowerCase());
        t._columnFilters[s] = f;
      }
      const c = t.dom.querySelector('th[data-ln-filter-col="' + s + '"]');
      c && (i && i.length > 0 ? c.setAttribute("data-ln-filter-active", "") : c.removeAttribute("data-ln-filter-active")), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(o, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(n) {
      if (!n.target.closest("[data-ln-table-clear]")) return;
      t._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + o.id + '"]');
      if (u) {
        const c = u.tagName === "INPUT" ? u : u.querySelector("input");
        c && (c.value = "");
      }
      t._columnFilters = {};
      for (let c = 0; c < t.ths.length; c++)
        t.ths[c].removeAttribute("data-ln-filter-active");
      const i = document.querySelectorAll('[data-ln-filter="' + o.id + '"]');
      for (let c = 0; c < i.length; c++) {
        const f = i[c].querySelector("[data-ln-filter-reset]");
        f && (f.checked = !0, f.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
      t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(o, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, o.addEventListener("click", this._onClear), this;
  }
  l.prototype._parseRows = function() {
    const o = this.tbody.rows, e = this.ths;
    this._data = [];
    const t = [];
    for (let n = 0; n < e.length; n++)
      t[n] = e[n].getAttribute(y);
    o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let n = 0; n < o.length; n++) {
      const s = o[n], u = [], i = [], c = [];
      for (let f = 0; f < s.cells.length; f++) {
        const r = s.cells[f], p = r.textContent.trim(), v = r.hasAttribute("data-ln-value") ? r.getAttribute("data-ln-value") : p, w = t[f];
        i[f] = p.toLowerCase(), w === "number" || w === "date" ? u[f] = parseFloat(v) || 0 : w === "string" ? u[f] = String(v) : u[f] = null, f < s.cells.length - 1 && c.push(p.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: i,
        html: s.outerHTML,
        searchText: c.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, l.prototype._applyFilterAndSort = function() {
    const o = this._searchTerm, e = this._columnFilters, t = Object.keys(e).length > 0, n = this.ths, s = {};
    if (t)
      for (let r = 0; r < n.length; r++) {
        const p = n[r].getAttribute("data-ln-filter-col");
        p && (s[p] = r);
      }
    if (!o && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(r) {
      if (o && r.searchText.indexOf(o) === -1) return !1;
      if (t)
        for (const p in e) {
          const v = s[p];
          if (v !== void 0 && e[p].indexOf(r.rawTexts[v]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, i = this._sortDir === "desc" ? -1 : 1, c = this._sortType === "number" || this._sortType === "date", f = a ? a.compare : function(r, p) {
      return r < p ? -1 : r > p ? 1 : 0;
    };
    this._filteredData.sort(function(r, p) {
      const v = r.sortKeys[u], w = p.sortKeys[u];
      return c ? (v - w) * i : f(v, w) * i;
    });
  }, l.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const o = document.createElement("colgroup");
    this.ths.forEach(function(e) {
      const t = document.createElement("col");
      t.style.width = e.offsetWidth + "px", o.appendChild(t);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, l.prototype._render = function() {
    if (!this.tbody) return;
    const o = this._filteredData.length;
    o === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, l.prototype._renderAll = function() {
    const o = [], e = this._filteredData;
    for (let t = 0; t < e.length; t++) o.push(e[t].html);
    this.tbody.innerHTML = o.join("");
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const o = this;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const o = this._filteredData, e = o.length, t = this._rowHeight;
    if (!t || !e) return;
    const s = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, i = s + u, c = window.scrollY - i, f = Math.max(0, Math.floor(c / t) - 15), r = Math.min(f + Math.ceil(window.innerHeight / t) + 30, e);
    if (f === this._vStart && r === this._vEnd) return;
    this._vStart = f, this._vEnd = r;
    const p = this.ths.length || 1, v = f * t, w = (e - r) * t;
    let E = "";
    v > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + p + '" style="height:' + v + 'px;padding:0;border:none"></td></tr>');
    for (let A = f; A < r; A++) E += o[A].html;
    w > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + p + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = E;
  }, l.prototype._showEmptyState = function() {
    const o = this.ths.length || 1, e = this.dom.querySelector("template[" + _ + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(o)), e && t.appendChild(document.importNode(e.content, !0));
    const n = document.createElement("tr");
    n.className = "ln-table__empty", n.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(n), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, l.prototype.destroy = function() {
    this.dom[d] && (this._disableVirtualScroll(), this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[d]);
  }, B(m, d, l, "ln-table");
})();
(function() {
  const m = "data-ln-circular-progress", d = "lnCircularProgress";
  if (window[d] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", _ = 36, g = 16, b = 2 * Math.PI * g;
  function a(n) {
    return this.dom = n, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, o.call(this), t.call(this), e.call(this), n.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  a.prototype.destroy = function() {
    this.dom[d] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[d]);
  };
  function l(n, s) {
    const u = document.createElementNS(y, n);
    for (const i in s)
      u.setAttribute(i, s[i]);
    return u;
  }
  function o() {
    this.svg = l("svg", {
      viewBox: "0 0 " + _ + " " + _,
      "aria-hidden": "true"
    }), this.trackCircle = l("circle", {
      cx: _ / 2,
      cy: _ / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = l("circle", {
      cx: _ / 2,
      cy: _ / 2,
      r: g,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": b,
      "stroke-dashoffset": b,
      transform: "rotate(-90 " + _ / 2 + " " + _ / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function e() {
    const n = this, s = new MutationObserver(function(u) {
      for (const i of u)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max") && t.call(n);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = s;
  }
  function t() {
    const n = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, s = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = s > 0 ? n / s * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const i = b - u / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const c = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = c !== null ? c : Math.round(u) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: n,
      max: s,
      percentage: u
    });
  }
  B(m, d, a, "ln-circular-progress");
})();
(function() {
  const m = "data-ln-sortable", d = "lnSortable", y = "data-ln-sortable-handle";
  if (window[d] !== void 0) return;
  function _(b) {
    this.dom = b, this.isEnabled = b.getAttribute(m) !== "disabled", this._dragging = null, b.setAttribute("aria-roledescription", "sortable list");
    const a = this;
    return this._onPointerDown = function(l) {
      a.isEnabled && a._handlePointerDown(l);
    }, b.addEventListener("pointerdown", this._onPointerDown), this;
  }
  _.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(m, "");
  }, _.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(m, "disabled");
  }, _.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[d]);
  }, _.prototype._handlePointerDown = function(b) {
    let a = b.target.closest("[" + y + "]"), l;
    if (a) {
      for (l = a; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (l = b.target; l && l.parentElement !== this.dom; )
        l = l.parentElement;
      if (!l || l.parentElement !== this.dom) return;
      a = l;
    }
    const e = Array.from(this.dom.children).indexOf(l);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: l,
      index: e
    }).defaultPrevented) return;
    b.preventDefault(), a.setPointerCapture(b.pointerId), this._dragging = l, l.classList.add("ln-sortable--dragging"), l.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: l,
      index: e
    });
    const n = this, s = function(i) {
      n._handlePointerMove(i);
    }, u = function(i) {
      n._handlePointerEnd(i), a.removeEventListener("pointermove", s), a.removeEventListener("pointerup", u), a.removeEventListener("pointercancel", u);
    };
    a.addEventListener("pointermove", s), a.addEventListener("pointerup", u), a.addEventListener("pointercancel", u);
  }, _.prototype._handlePointerMove = function(b) {
    if (!this._dragging) return;
    const a = Array.from(this.dom.children), l = this._dragging;
    for (const o of a)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const o of a) {
      if (o === l) continue;
      const e = o.getBoundingClientRect(), t = e.top + e.height / 2;
      if (b.clientY >= e.top && b.clientY < t) {
        o.classList.add("ln-sortable--drop-before");
        break;
      } else if (b.clientY >= t && b.clientY <= e.bottom) {
        o.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, _.prototype._handlePointerEnd = function(b) {
    if (!this._dragging) return;
    const a = this._dragging, l = Array.from(this.dom.children), o = l.indexOf(a);
    let e = null, t = null;
    for (const n of l) {
      if (n.classList.contains("ln-sortable--drop-before")) {
        e = n, t = "before";
        break;
      }
      if (n.classList.contains("ln-sortable--drop-after")) {
        e = n, t = "after";
        break;
      }
    }
    for (const n of l)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (a.classList.remove("ln-sortable--dragging"), a.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== a) {
      t === "before" ? this.dom.insertBefore(a, e) : this.dom.insertBefore(a, e.nextElementSibling);
      const s = Array.from(this.dom.children).indexOf(a);
      T(this.dom, "ln-sortable:reordered", {
        item: a,
        oldIndex: o,
        newIndex: s
      });
    }
    this._dragging = null;
  };
  function g(b) {
    const a = b[d];
    if (!a) return;
    const l = b.getAttribute(m) !== "disabled";
    l !== a.isEnabled && (a.isEnabled = l, T(b, l ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: b }));
  }
  B(m, d, _, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const m = "data-ln-confirm", d = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[d] !== void 0) return;
  function g(b) {
    this.dom = b, this.confirming = !1, this.originalText = b.textContent.trim(), this.confirmText = b.getAttribute(m) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const a = this;
    return this._onClick = function(l) {
      if (!a.confirming)
        l.preventDefault(), l.stopImmediatePropagation(), a._enterConfirm();
      else {
        if (a._submitted) return;
        a._submitted = !0, a._reset();
      }
    }, b.addEventListener("click", this._onClick), this;
  }
  g.prototype._getTimeout = function() {
    const b = parseFloat(this.dom.getAttribute(y));
    return isNaN(b) || b <= 0 ? 3 : b;
  }, g.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var b = this.dom.querySelector("svg.ln-icon use");
    b && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = b.getAttribute("href"), b.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const b = this, a = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      b._reset();
    }, a);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var b = this.dom.querySelector("svg.ln-icon use");
      b && this.originalIconHref && b.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[d] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[d]);
  }, B(m, d, g, "ln-confirm");
})();
(function() {
  const m = "data-ln-translations", d = "lnTranslations";
  if (window[d] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function _(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(m + "-default") || "", this.badgesEl = g.querySelector("[" + m + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = g.getAttribute(m + "-locales");
    if (this.locales = y, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const a = this;
    return this._onRequestAdd = function(l) {
      l.detail && l.detail.lang && a.addLanguage(l.detail.lang);
    }, this._onRequestRemove = function(l) {
      l.detail && l.detail.lang && a.removeLanguage(l.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  _.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of g) {
      const a = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const l of a)
        l.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, _.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of g) {
      const a = b.getAttribute("data-ln-translatable-lang");
      a && a !== this.defaultLang && this.activeLanguages.add(a);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, _.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const g = this;
    let b = 0;
    for (const l in this.locales) {
      if (!this.locales.hasOwnProperty(l) || this.activeLanguages.has(l)) continue;
      b++;
      const o = vt("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const e = o.querySelector("[data-ln-translations-lang]");
      e.setAttribute("data-ln-translations-lang", l), e.textContent = this.locales[l], e.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(l));
      }), this.menuEl.appendChild(o);
    }
    const a = this.dom.querySelector("[" + m + "-add]");
    a && (a.style.display = b === 0 ? "none" : "");
  }, _.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(b) {
      const a = vt("ln-translations-badge", "ln-translations");
      if (!a) return;
      const l = a.querySelector("[data-ln-translations-lang]");
      l.setAttribute("data-ln-translations-lang", b);
      const o = l.querySelector("span");
      o.textContent = g.locales[b] || b.toUpperCase();
      const e = l.querySelector("button");
      e.setAttribute("aria-label", "Remove " + (g.locales[b] || b.toUpperCase())), e.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.removeLanguage(b));
      }), g.badgesEl.appendChild(a);
    });
  }, _.prototype.addLanguage = function(g, b) {
    if (this.activeLanguages.has(g)) return;
    const a = this.locales[g] || g;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: a
    }).defaultPrevented) return;
    this.activeLanguages.add(g), b = b || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const e of o) {
      const t = e.getAttribute("data-ln-translatable"), n = e.getAttribute("data-ln-translations-prefix") || "", s = e.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!s) continue;
      const u = s.cloneNode(!1);
      n ? u.name = n + "[trans][" + g + "][" + t + "]" : u.name = "trans[" + g + "][" + t + "]", u.value = b[t] !== void 0 ? b[t] : "", u.removeAttribute("id"), u.placeholder = a + " translation", u.setAttribute("data-ln-translatable-lang", g);
      const i = e.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), c = i.length > 0 ? i[i.length - 1] : s;
      c.parentNode.insertBefore(u, c.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: a
    });
  }, _.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const a = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const l of a)
      l.parentNode.removeChild(l);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, _.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, _.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, _.prototype.destroy = function() {
    if (!this.dom[d]) return;
    const g = this.defaultLang, b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of b)
      a.getAttribute("data-ln-translatable-lang") !== g && a.parentNode.removeChild(a);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[d];
  }, B(m, d, _, "ln-translations");
})();
(function() {
  const m = "data-ln-autosave", d = "lnAutosave", y = "data-ln-autosave-clear", _ = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[d] !== void 0) return;
  function a(t) {
    const n = l(t);
    if (!n) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = n;
    let s = null;
    function u() {
      const r = At(t);
      try {
        localStorage.setItem(n, JSON.stringify(r));
      } catch {
        return;
      }
      T(t, "ln-autosave:saved", { target: t, data: r });
    }
    function i() {
      let r;
      try {
        r = localStorage.getItem(n);
      } catch {
        return;
      }
      if (!r) return;
      let p;
      try {
        p = JSON.parse(r);
      } catch {
        return;
      }
      if (z(t, "ln-autosave:before-restore", { target: t, data: p }).defaultPrevented) return;
      const w = wt(t, p);
      for (let E = 0; E < w.length; E++)
        w[E].dispatchEvent(new Event("input", { bubbles: !0 })), w[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      T(t, "ln-autosave:restored", { target: t, data: p });
    }
    function c() {
      try {
        localStorage.removeItem(n);
      } catch {
        return;
      }
      T(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(r) {
      const p = r.target;
      o(p) && p.name && u();
    }, this._onChange = function(r) {
      const p = r.target;
      o(p) && p.name && u();
    }, this._onSubmit = function() {
      c();
    }, this._onReset = function() {
      c();
    }, this._onClearClick = function(r) {
      r.target.closest("[" + y + "]") && c();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const f = e(t);
    return f > 0 && (this._onInput = function(r) {
      const p = r.target;
      !o(p) || !p.name || (s !== null && clearTimeout(s), s = setTimeout(u, f));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return s;
    }, i(), this;
  }
  a.prototype.destroy = function() {
    if (this.dom[d]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const t = this._getInputTimer();
        t !== null && clearTimeout(t);
      }
      T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[d];
    }
  };
  function l(t) {
    const s = t.getAttribute(m) || t.id;
    return s ? g + window.location.pathname + ":" + s : null;
  }
  function o(t) {
    const n = t.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function e(t) {
    if (!t.hasAttribute(_)) return 0;
    const n = t.getAttribute(_);
    if (n === "" || n === null) return 1e3;
    const s = parseInt(n, 10);
    return isNaN(s) || s < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : s;
  }
  B(m, d, a, "ln-autosave");
})();
(function() {
  const m = "data-ln-autoresize", d = "lnAutoresize";
  if (window[d] !== void 0) return;
  function y(_) {
    if (_.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", _.tagName), this;
    this.dom = _;
    const g = this;
    return this._onInput = function() {
      g._resize();
    }, _.addEventListener("input", this._onInput), this._resize(), this;
  }
  y.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, y.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[d]);
  }, B(m, d, y, "ln-autoresize");
})();
(function() {
  const m = "data-ln-validate", d = "lnValidate", y = "data-ln-validate-errors", _ = "data-ln-validate-error", g = "ln-validate-valid", b = "ln-validate-invalid", a = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[d] !== void 0) return;
  function l(o) {
    this.dom = o, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const e = this, t = o.tagName, n = o.type, s = t === "SELECT" || n === "checkbox" || n === "radio";
    return this._onInput = function() {
      e._touched = !0, e.validate();
    }, this._onChange = function() {
      e._touched = !0, e.validate();
    }, this._onSetCustom = function(u) {
      const i = u.detail && u.detail.error;
      if (!i) return;
      e._customErrors.add(i), e._touched = !0;
      const c = o.closest(".form-element");
      if (c) {
        const f = c.querySelector("[" + _ + '="' + i + '"]');
        f && f.classList.remove("hidden");
      }
      o.classList.remove(g), o.classList.add(b);
    }, this._onClearCustom = function(u) {
      const i = u.detail && u.detail.error, c = o.closest(".form-element");
      if (i) {
        if (e._customErrors.delete(i), c) {
          const f = c.querySelector("[" + _ + '="' + i + '"]');
          f && f.classList.add("hidden");
        }
      } else
        e._customErrors.forEach(function(f) {
          if (c) {
            const r = c.querySelector("[" + _ + '="' + f + '"]');
            r && r.classList.add("hidden");
          }
        }), e._customErrors.clear();
      e._touched && e.validate();
    }, s || o.addEventListener("input", this._onInput), o.addEventListener("change", this._onChange), o.addEventListener("ln-validate:set-custom", this._onSetCustom), o.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  l.prototype.validate = function() {
    const o = this.dom, e = o.validity, n = o.checkValidity() && this._customErrors.size === 0, s = o.closest(".form-element");
    if (s) {
      const i = s.querySelector("[" + y + "]");
      if (i) {
        const c = i.querySelectorAll("[" + _ + "]");
        for (let f = 0; f < c.length; f++) {
          const r = c[f].getAttribute(_), p = a[r];
          p && (e[p] ? c[f].classList.remove("hidden") : c[f].classList.add("hidden"));
        }
      }
    }
    return o.classList.toggle(g, n), o.classList.toggle(b, !n), T(o, n ? "ln-validate:valid" : "ln-validate:invalid", { target: o, field: o.name }), n;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, b);
    const o = this.dom.closest(".form-element");
    if (o) {
      const e = o.querySelectorAll("[" + _ + "]");
      for (let t = 0; t < e.length; t++)
        e[t].classList.add("hidden");
    }
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), l.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(g, b), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(m, d, l, "ln-validate");
})();
(function() {
  const m = "data-ln-form", d = "lnForm", y = "data-ln-form-auto", _ = "data-ln-form-debounce", g = "data-ln-validate", b = "lnValidate";
  if (window[d] !== void 0) return;
  function a(l) {
    this.dom = l, this._debounceTimer = null;
    const o = this;
    if (this._onValid = function() {
      o._updateSubmitButton();
    }, this._onInvalid = function() {
      o._updateSubmitButton();
    }, this._onSubmit = function(e) {
      e.preventDefault(), o.submit();
    }, this._onFill = function(e) {
      e.detail && o.fill(e.detail);
    }, this._onFormReset = function() {
      o.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        o._resetValidation();
      }, 0);
    }, l.addEventListener("ln-validate:valid", this._onValid), l.addEventListener("ln-validate:invalid", this._onInvalid), l.addEventListener("submit", this._onSubmit), l.addEventListener("ln-form:fill", this._onFill), l.addEventListener("ln-form:reset", this._onFormReset), l.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, l.hasAttribute(y)) {
      const e = parseInt(l.getAttribute(_)) || 0;
      this._onAutoInput = function() {
        e > 0 ? (clearTimeout(o._debounceTimer), o._debounceTimer = setTimeout(function() {
          o.submit();
        }, e)) : o.submit();
      }, l.addEventListener("input", this._onAutoInput), l.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  a.prototype._updateSubmitButton = function() {
    const l = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!l.length) return;
    const o = this.dom.querySelectorAll("[" + g + "]");
    let e = !1;
    if (o.length > 0) {
      let t = !1, n = !1;
      for (let s = 0; s < o.length; s++) {
        const u = o[s][b];
        u && u._touched && (t = !0), o[s].checkValidity() || (n = !0);
      }
      e = n || !t;
    }
    for (let t = 0; t < l.length; t++)
      l[t].disabled = e;
  }, a.prototype.fill = function(l) {
    const o = wt(this.dom, l);
    for (let e = 0; e < o.length; e++) {
      const t = o[e], n = t.tagName === "SELECT" || t.type === "checkbox" || t.type === "radio";
      t.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, a.prototype.submit = function() {
    const l = this.dom.querySelectorAll("[" + g + "]");
    let o = !0;
    for (let t = 0; t < l.length; t++) {
      const n = l[t][b];
      n && (n.validate() || (o = !1));
    }
    if (!o) return;
    const e = At(this.dom);
    T(this.dom, "ln-form:submit", { data: e });
  }, a.prototype.reset = function() {
    this.dom.reset();
    const l = this.dom.querySelectorAll("input, textarea, select");
    for (let o = 0; o < l.length; o++) {
      const e = l[o], t = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(t ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), T(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, a.prototype._resetValidation = function() {
    const l = this.dom.querySelectorAll("[" + g + "]");
    for (let o = 0; o < l.length; o++) {
      const e = l[o][b];
      e && e.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      const l = this.dom.querySelectorAll("[" + g + "]");
      for (let o = 0; o < l.length; o++)
        if (!l[o].checkValidity()) return !1;
      return !0;
    }
  }), a.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[d]);
  }, B(m, d, a, "ln-form");
})();
(function() {
  const m = "data-ln-time", d = "lnTime";
  if (window[d] !== void 0) return;
  const y = {}, _ = {};
  function g(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(E, A) {
    const C = (E || "") + "|" + JSON.stringify(A);
    return y[C] || (y[C] = new Intl.DateTimeFormat(E, A)), y[C];
  }
  function a(E) {
    const A = E || "";
    return _[A] || (_[A] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), _[A];
  }
  const l = /* @__PURE__ */ new Set();
  let o = null;
  function e() {
    o || (o = setInterval(n, 6e4));
  }
  function t() {
    o && (clearInterval(o), o = null);
  }
  function n() {
    for (const E of l) {
      if (!document.body.contains(E.dom)) {
        l.delete(E);
        continue;
      }
      r(E);
    }
    l.size === 0 && t();
  }
  function s(E, A) {
    return b(A, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function u(E, A) {
    const C = /* @__PURE__ */ new Date(), O = { month: "short", day: "numeric" };
    return E.getFullYear() !== C.getFullYear() && (O.year = "numeric"), b(A, O).format(E);
  }
  function i(E, A) {
    return b(A, { dateStyle: "medium" }).format(E);
  }
  function c(E, A) {
    return b(A, { timeStyle: "short" }).format(E);
  }
  function f(E, A) {
    const C = Math.floor(Date.now() / 1e3), F = Math.floor(E.getTime() / 1e3) - C, D = Math.abs(F);
    if (D < 10) return a(A).format(0, "second");
    let M, H;
    if (D < 60)
      M = "second", H = F;
    else if (D < 3600)
      M = "minute", H = Math.round(F / 60);
    else if (D < 86400)
      M = "hour", H = Math.round(F / 3600);
    else if (D < 604800)
      M = "day", H = Math.round(F / 86400);
    else if (D < 2592e3)
      M = "week", H = Math.round(F / 604800);
    else
      return u(E, A);
    return a(A).format(H, M);
  }
  function r(E) {
    const A = E.dom.getAttribute("datetime");
    if (!A) return;
    const C = Number(A);
    if (isNaN(C)) return;
    const O = new Date(C * 1e3), F = E.dom.getAttribute(m) || "short", D = g(E.dom);
    let M;
    switch (F) {
      case "relative":
        M = f(O, D);
        break;
      case "full":
        M = s(O, D);
        break;
      case "date":
        M = i(O, D);
        break;
      case "time":
        M = c(O, D);
        break;
      default:
        M = u(O, D);
        break;
    }
    E.dom.textContent = M, F !== "full" && (E.dom.title = s(O, D));
  }
  function p(E) {
    return this.dom = E, r(this), E.getAttribute(m) === "relative" && (l.add(this), e()), this;
  }
  p.prototype.render = function() {
    r(this);
  }, p.prototype.destroy = function() {
    l.delete(this), l.size === 0 && t(), delete this.dom[d];
  };
  function v(E) {
    const A = E[d];
    if (!A) return;
    E.getAttribute(m) === "relative" ? (l.add(A), e()) : (l.delete(A), l.size === 0 && t()), r(A);
  }
  function w(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(m) && E[d] && r(E[d]);
  }
  B(m, d, p, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: w
  });
})();
(function() {
  const m = "data-ln-store", d = "lnStore";
  if (window[d] !== void 0) return;
  const y = "ln_app_cache", _ = "_meta", g = "1.0";
  let b = null, a = null;
  const l = {};
  function o() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(L) {
        const S = Math.random() * 16 | 0;
        return (L === "x" ? S : S & 3 | 8).toString(16);
      });
    }
  }
  function e(h) {
    h && h.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: h });
  }
  function t() {
    const h = document.querySelectorAll("[" + m + "]"), L = {};
    for (let S = 0; S < h.length; S++) {
      const I = h[S].getAttribute(m);
      I && (L[I] = {
        indexes: (h[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(k) {
          return k.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function n() {
    return a || (a = new Promise(function(h, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), h(null);
        return;
      }
      const S = t(), I = Object.keys(S), k = indexedDB.open(y);
      k.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), h(null);
      }, k.onsuccess = function(x) {
        const q = x.target.result, N = Array.from(q.objectStoreNames);
        let j = !1;
        N.indexOf(_) === -1 && (j = !0);
        for (let et = 0; et < I.length; et++)
          if (N.indexOf(I[et]) === -1) {
            j = !0;
            break;
          }
        if (!j) {
          s(q), b = q, h(q);
          return;
        }
        const lt = q.version;
        q.close();
        const dt = indexedDB.open(y, lt + 1);
        dt.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, dt.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), h(null);
        }, dt.onupgradeneeded = function(et) {
          const J = et.target.result;
          J.objectStoreNames.contains(_) || J.createObjectStore(_, { keyPath: "key" });
          for (let pt = 0; pt < I.length; pt++) {
            const mt = I[pt];
            if (!J.objectStoreNames.contains(mt)) {
              const Tt = J.createObjectStore(mt, { keyPath: "id" }), gt = S[mt].indexes;
              for (let ut = 0; ut < gt.length; ut++)
                Tt.createIndex(gt[ut], gt[ut], { unique: !1 });
            }
          }
        }, dt.onsuccess = function(et) {
          const J = et.target.result;
          s(J), b = J, h(J);
        };
      };
    }), a);
  }
  function s(h) {
    h.onversionchange = function() {
      h.close(), b = null, a = null;
    };
  }
  function u() {
    return b ? Promise.resolve(b) : (a = null, n());
  }
  function i(h, L) {
    return u().then(function(S) {
      return S ? S.transaction(h, L).objectStore(h) : null;
    });
  }
  function c(h) {
    return new Promise(function(L, S) {
      h.onsuccess = function() {
        L(h.result);
      }, h.onerror = function() {
        e(h.error), S(h.error);
      };
    });
  }
  function f(h) {
    return i(h, "readonly").then(function(L) {
      return L ? c(L.getAll()) : [];
    });
  }
  function r(h, L) {
    return i(h, "readonly").then(function(S) {
      return S ? c(S.get(L)) : null;
    });
  }
  function p(h, L) {
    return i(h, "readwrite").then(function(S) {
      if (S)
        return c(S.put(L));
    });
  }
  function v(h, L) {
    return i(h, "readwrite").then(function(S) {
      if (S)
        return c(S.delete(L));
    });
  }
  function w(h) {
    return i(h, "readwrite").then(function(L) {
      if (L)
        return c(L.clear());
    });
  }
  function E(h) {
    return i(h, "readonly").then(function(L) {
      return L ? c(L.count()) : 0;
    });
  }
  function A(h) {
    return i(_, "readonly").then(function(L) {
      return L ? c(L.get(h)) : null;
    });
  }
  function C(h, L) {
    return i(_, "readwrite").then(function(S) {
      if (S)
        return L.key = h, c(S.put(L));
    });
  }
  function O(h) {
    this.dom = h, this._name = h.getAttribute(m), this._endpoint = h.getAttribute("data-ln-store-endpoint") || "";
    const L = h.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (h.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(k) {
      return k.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, l[this._name] = this;
    const I = this;
    return F(I), Z(I), this;
  }
  function F(h) {
    h._handlers = {
      create: function(L) {
        D(h, L.detail);
      },
      update: function(L) {
        M(h, L.detail);
      },
      delete: function(L) {
        H(h, L.detail);
      },
      bulkDelete: function(L) {
        V(h, L.detail);
      }
    }, h.dom.addEventListener("ln-store:request-create", h._handlers.create), h.dom.addEventListener("ln-store:request-update", h._handlers.update), h.dom.addEventListener("ln-store:request-delete", h._handlers.delete), h.dom.addEventListener("ln-store:request-bulk-delete", h._handlers.bulkDelete);
  }
  function D(h, L) {
    const S = L.data || {}, I = "_temp_" + o(), k = Object.assign({}, S, { id: I });
    p(h._name, k).then(function() {
      return h.totalCount++, T(h.dom, "ln-store:created", {
        store: h._name,
        record: k,
        tempId: I
      }), fetch(h._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(S)
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      return x.json();
    }).then(function(x) {
      return v(h._name, I).then(function() {
        return p(h._name, x);
      }).then(function() {
        T(h.dom, "ln-store:confirmed", {
          store: h._name,
          record: x,
          tempId: I,
          action: "create"
        });
      });
    }).catch(function(x) {
      v(h._name, I).then(function() {
        h.totalCount--, T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: k,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function M(h, L) {
    const S = L.id, I = L.data || {}, k = L.expected_version;
    let x = null;
    r(h._name, S).then(function(q) {
      if (!q) throw new Error("Record not found: " + S);
      x = Object.assign({}, q);
      const N = Object.assign({}, q, I);
      return p(h._name, N).then(function() {
        return T(h.dom, "ln-store:updated", {
          store: h._name,
          record: N,
          previous: x
        }), N;
      });
    }).then(function(q) {
      const N = Object.assign({}, I);
      return k && (N.expected_version = k), fetch(h._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(N)
      });
    }).then(function(q) {
      if (q.status === 409)
        return q.json().then(function(N) {
          return p(h._name, x).then(function() {
            T(h.dom, "ln-store:conflict", {
              store: h._name,
              local: x,
              remote: N.current || N,
              field_diffs: N.field_diffs || null
            });
          });
        });
      if (!q.ok) throw new Error("HTTP " + q.status);
      return q.json().then(function(N) {
        return p(h._name, N).then(function() {
          T(h.dom, "ln-store:confirmed", {
            store: h._name,
            record: N,
            action: "update"
          });
        });
      });
    }).catch(function(q) {
      x && p(h._name, x).then(function() {
        T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: x,
          action: "update",
          error: q.message
        });
      });
    });
  }
  function H(h, L) {
    const S = L.id;
    let I = null;
    r(h._name, S).then(function(k) {
      if (k)
        return I = Object.assign({}, k), v(h._name, S).then(function() {
          return h.totalCount--, T(h.dom, "ln-store:deleted", {
            store: h._name,
            id: S
          }), fetch(h._endpoint + "/" + S, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(k) {
      if (!k || !k.ok) throw new Error("HTTP " + (k ? k.status : "unknown"));
      T(h.dom, "ln-store:confirmed", {
        store: h._name,
        record: I,
        action: "delete"
      });
    }).catch(function(k) {
      I && p(h._name, I).then(function() {
        h.totalCount++, T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: I,
          action: "delete",
          error: k.message
        });
      });
    });
  }
  function V(h, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let I = [];
    const k = S.map(function(x) {
      return r(h._name, x);
    });
    Promise.all(k).then(function(x) {
      return I = x.filter(Boolean), rt(h._name, S).then(function() {
        return h.totalCount -= S.length, T(h.dom, "ln-store:deleted", {
          store: h._name,
          ids: S
        }), fetch(h._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: S })
        });
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      T(h.dom, "ln-store:confirmed", {
        store: h._name,
        record: null,
        ids: S,
        action: "bulk-delete"
      });
    }).catch(function(x) {
      I.length > 0 && ot(h._name, I).then(function() {
        h.totalCount += I.length, T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: null,
          ids: S,
          action: "bulk-delete",
          error: x.message
        });
      });
    });
  }
  function Z(h) {
    n().then(function() {
      return A(h._name);
    }).then(function(L) {
      L && L.schema_version === g ? (h.lastSyncedAt = L.last_synced_at || null, h.totalCount = L.record_count || 0, h.totalCount > 0 ? (h.isLoaded = !0, T(h.dom, "ln-store:ready", {
        store: h._name,
        count: h.totalCount,
        source: "cache"
      }), tt(h) && it(h)) : X(h)) : L && L.schema_version !== g ? w(h._name).then(function() {
        return C(h._name, {
          schema_version: g,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        X(h);
      }) : X(h);
    });
  }
  function tt(h) {
    return h._staleThreshold === -1 ? !1 : h.lastSyncedAt ? Math.floor(Date.now() / 1e3) - h.lastSyncedAt > h._staleThreshold : !0;
  }
  function X(h) {
    return h._endpoint ? (h.isSyncing = !0, h._abortController = new AbortController(), fetch(h._endpoint, { signal: h._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const S = L.data || [], I = L.synced_at || Math.floor(Date.now() / 1e3);
      return ot(h._name, S).then(function() {
        return C(h._name, {
          schema_version: g,
          last_synced_at: I,
          record_count: S.length
        });
      }).then(function() {
        h.isLoaded = !0, h.isSyncing = !1, h.lastSyncedAt = I, h.totalCount = S.length, h._abortController = null, T(h.dom, "ln-store:loaded", {
          store: h._name,
          count: S.length
        }), T(h.dom, "ln-store:ready", {
          store: h._name,
          count: S.length,
          source: "server"
        });
      });
    }).catch(function(L) {
      h.isSyncing = !1, h._abortController = null, L.name !== "AbortError" && (h.isLoaded ? T(h.dom, "ln-store:offline", { store: h._name }) : T(h.dom, "ln-store:error", {
        store: h._name,
        action: "full-load",
        error: L.message,
        status: null
      }));
    })) : Promise.resolve();
  }
  function it(h) {
    if (!h._endpoint || !h.lastSyncedAt) return X(h);
    h.isSyncing = !0, h._abortController = new AbortController();
    const L = h._endpoint + (h._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + h.lastSyncedAt;
    return fetch(L, { signal: h._abortController.signal }).then(function(S) {
      if (!S.ok) throw new Error("HTTP " + S.status);
      return S.json();
    }).then(function(S) {
      const I = S.data || [], k = S.deleted || [], x = S.synced_at || Math.floor(Date.now() / 1e3), q = I.length > 0 || k.length > 0;
      let N = Promise.resolve();
      return I.length > 0 && (N = N.then(function() {
        return ot(h._name, I);
      })), k.length > 0 && (N = N.then(function() {
        return rt(h._name, k);
      })), N.then(function() {
        return E(h._name);
      }).then(function(j) {
        return h.totalCount = j, C(h._name, {
          schema_version: g,
          last_synced_at: x,
          record_count: j
        });
      }).then(function() {
        h.isSyncing = !1, h.lastSyncedAt = x, h._abortController = null, T(h.dom, "ln-store:synced", {
          store: h._name,
          added: I.length,
          deleted: k.length,
          changed: q
        });
      });
    }).catch(function(S) {
      h.isSyncing = !1, h._abortController = null, S.name !== "AbortError" && T(h.dom, "ln-store:offline", { store: h._name });
    });
  }
  function ot(h, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(I, k) {
          const x = S.transaction(h, "readwrite"), q = x.objectStore(h);
          for (let N = 0; N < L.length; N++)
            q.put(L[N]);
          x.oncomplete = function() {
            I();
          }, x.onerror = function() {
            e(x.error), k(x.error);
          };
        });
    });
  }
  function rt(h, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(I, k) {
          const x = S.transaction(h, "readwrite"), q = x.objectStore(h);
          for (let N = 0; N < L.length; N++)
            q.delete(L[N]);
          x.oncomplete = function() {
            I();
          }, x.onerror = function() {
            k(x.error);
          };
        });
    });
  }
  let R = null;
  R = function() {
    if (document.visibilityState !== "visible") return;
    const h = Object.keys(l);
    for (let L = 0; L < h.length; L++) {
      const S = l[h[L]];
      S.isLoaded && !S.isSyncing && tt(S) && it(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const P = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function U(h, L) {
    if (!L || !L.field) return h;
    const S = L.field, I = L.direction === "desc";
    return h.slice().sort(function(k, x) {
      const q = k[S], N = x[S];
      if (q == null && N == null) return 0;
      if (q == null) return I ? 1 : -1;
      if (N == null) return I ? -1 : 1;
      let j;
      return typeof q == "string" && typeof N == "string" ? j = P.compare(q, N) : j = q < N ? -1 : q > N ? 1 : 0, I ? -j : j;
    });
  }
  function G(h, L) {
    if (!L) return h;
    const S = Object.keys(L);
    return S.length === 0 ? h : h.filter(function(I) {
      for (let k = 0; k < S.length; k++) {
        const x = S[k], q = L[x];
        if (!Array.isArray(q) || q.length === 0) continue;
        const N = I[x];
        let j = !1;
        for (let lt = 0; lt < q.length; lt++)
          if (String(N) === String(q[lt])) {
            j = !0;
            break;
          }
        if (!j) return !1;
      }
      return !0;
    });
  }
  function ct(h, L, S) {
    if (!L || !S || S.length === 0) return h;
    const I = L.toLowerCase();
    return h.filter(function(k) {
      for (let x = 0; x < S.length; x++) {
        const q = k[S[x]];
        if (q != null && String(q).toLowerCase().indexOf(I) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function K(h, L, S) {
    if (h.length === 0) return 0;
    if (S === "count") return h.length;
    let I = 0, k = 0;
    for (let x = 0; x < h.length; x++) {
      const q = parseFloat(h[x][L]);
      isNaN(q) || (I += q, k++);
    }
    return S === "sum" ? I : S === "avg" && k > 0 ? I / k : 0;
  }
  O.prototype.getAll = function(h) {
    const L = this;
    return h = h || {}, f(L._name).then(function(S) {
      const I = S.length;
      h.filters && (S = G(S, h.filters)), h.search && (S = ct(S, h.search, L._searchFields));
      const k = S.length;
      if (h.sort && (S = U(S, h.sort)), h.offset || h.limit) {
        const x = h.offset || 0, q = h.limit || S.length;
        S = S.slice(x, x + q);
      }
      return {
        data: S,
        total: I,
        filtered: k
      };
    });
  }, O.prototype.getById = function(h) {
    return r(this._name, h);
  }, O.prototype.count = function(h) {
    const L = this;
    return h ? f(L._name).then(function(S) {
      return G(S, h).length;
    }) : E(L._name);
  }, O.prototype.aggregate = function(h, L) {
    return f(this._name).then(function(I) {
      return K(I, h, L);
    });
  }, O.prototype.forceSync = function() {
    return it(this);
  }, O.prototype.fullReload = function() {
    const h = this;
    return w(h._name).then(function() {
      return h.isLoaded = !1, h.lastSyncedAt = null, h.totalCount = 0, X(h);
    });
  }, O.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete l[this._name], Object.keys(l).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[d], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function st() {
    return u().then(function(h) {
      if (!h) return;
      const L = Array.from(h.objectStoreNames);
      return new Promise(function(S, I) {
        const k = h.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          k.objectStore(L[x]).clear();
        k.oncomplete = function() {
          S();
        }, k.onerror = function() {
          I(k.error);
        };
      });
    }).then(function() {
      const h = Object.keys(l);
      for (let L = 0; L < h.length; L++) {
        const S = l[h[L]];
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      }
    });
  }
  B(m, d, O, "ln-store"), window[d].clearAll = st, window[d].init = window[d];
})();
(function() {
  const m = "data-ln-data-table", d = "lnDataTable";
  if (window[d] !== void 0) return;
  const g = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function b(e) {
    return g ? g.format(e) : String(e);
  }
  function a(e) {
    let t = e.parentElement;
    for (; t && t !== document.body && t !== document.documentElement; ) {
      const s = getComputedStyle(t).overflowY;
      if (s === "auto" || s === "scroll") return t;
      t = t.parentElement;
    }
    return null;
  }
  function l(e) {
    this.dom = e, this.name = e.getAttribute(m) || "", this.table = e.querySelector("table"), this.tbody = e.querySelector("[data-ln-data-table-body]") || e.querySelector("tbody"), this.thead = e.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(n) {
      return n.getAttribute("data-ln-col") && n.querySelector("[data-ln-col-filter]");
    }).map(function(n) {
      return n.getAttribute("data-ln-col");
    }), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._totalSpan = e.querySelector("[data-ln-data-table-total]"), this._filteredSpan = e.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = e.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    return this._onSetData = function(n) {
      const s = n.detail || {};
      t._data = s.data || [], t._lastTotal = s.total != null ? s.total : t._data.length, t._lastFiltered = s.filtered != null ? s.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._updateFilterOptions(s.filterOptions), t._vStart = -1, t._vEnd = -1, t._renderRows(), t._updateFooter(), T(e, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, e.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(n) {
      const s = n.detail && n.detail.loading;
      e.classList.toggle("ln-data-table--loading", !!s), s && (t.isLoaded = !1);
    }, e.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(e.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(n) {
      const s = n.target.closest("[data-ln-col-sort]");
      if (!s) return;
      const u = s.closest("th");
      if (!u) return;
      const i = u.getAttribute("data-ln-col");
      i && t._handleSort(i, u);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(n) {
      const s = n.target.closest("[data-ln-col-filter]");
      if (!s) return;
      n.stopPropagation();
      const u = s.closest("th");
      if (!u) return;
      const i = u.getAttribute("data-ln-col");
      if (i) {
        if (t._activeDropdown && t._activeDropdown.field === i) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(i, u, s);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(n) {
      n.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), T(e, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, e.addEventListener("click", this._onClearAll), this._selectable = e.hasAttribute("data-ln-data-table-selectable"), this._selectableActive = !1, this._selectable && this._enableSelection(), this._onRowClick = function(n) {
      if (n.target.closest("[data-ln-row-select]") || n.target.closest("[data-ln-row-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const s = n.target.closest("[data-ln-row]");
      if (!s) return;
      const u = s.getAttribute("data-ln-row-id"), i = s._lnRecord || {};
      T(e, "ln-data-table:row-click", {
        table: t.name,
        id: u,
        record: i
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(n) {
      const s = n.target.closest("[data-ln-row-action]");
      if (!s) return;
      n.stopPropagation();
      const u = s.closest("[data-ln-row]");
      if (!u) return;
      const i = s.getAttribute("data-ln-row-action"), c = u.getAttribute("data-ln-row-id"), f = u._lnRecord || {};
      T(e, "ln-data-table:row-action", {
        table: t.name,
        id: c,
        action: i,
        record: f
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = e.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, T(e, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(n) {
      if (!e.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (n.key === "/") {
        t._searchInput && (n.preventDefault(), t._searchInput.focus());
        return;
      }
      const s = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (s.length)
        switch (n.key) {
          case "ArrowDown":
            n.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, s.length - 1), t._focusRow(s);
            break;
          case "ArrowUp":
            n.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(s);
            break;
          case "Home":
            n.preventDefault(), t._focusedRowIndex = 0, t._focusRow(s);
            break;
          case "End":
            n.preventDefault(), t._focusedRowIndex = s.length - 1, t._focusRow(s);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < s.length) {
              n.preventDefault();
              const u = s[t._focusedRowIndex];
              T(e, "ln-data-table:row-click", {
                table: t.name,
                id: u.getAttribute("data-ln-row-id"),
                record: u._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < s.length) {
              n.preventDefault();
              const u = s[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              u && (u.checked = !u.checked, u.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(e, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  l.prototype._handleSort = function(e, t) {
    let n;
    !this.currentSort || this.currentSort.field !== e ? n = "asc" : this.currentSort.direction === "asc" ? n = "desc" : n = null;
    for (let s = 0; s < this.ths.length; s++)
      this.ths[s].classList.remove("ln-sort-asc", "ln-sort-desc");
    n ? (this.currentSort = { field: e, direction: n }, t.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: e,
      direction: n
    }), this._requestData();
  }, l.prototype._requestData = function() {
    T(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, l.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const e = this.tbody.querySelectorAll("[data-ln-row]");
    let t = e.length > 0;
    for (let n = 0; n < e.length; n++) {
      const s = e[n].getAttribute("data-ln-row-id");
      if (s != null && !this.selectedIds.has(s)) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, Object.defineProperty(l.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), l.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const e = this;
    if (this._onSelectionChange = function(t) {
      const n = t.target.closest("[data-ln-row-select]");
      if (!n) return;
      const s = n.closest("[data-ln-row]");
      if (!s) return;
      const u = s.getAttribute("data-ln-row-id");
      u != null && (n.checked ? (e.selectedIds.add(u), s.classList.add("ln-row-selected")) : (e.selectedIds.delete(u), s.classList.remove("ln-row-selected")), e.selectedCount = e.selectedIds.size, e._updateSelectAll(), e._updateFooter(), T(e.dom, "ln-data-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const t = document.createElement("input");
      t.type = "checkbox", t.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(t), this._selectAllCheckbox = t;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const t = e._selectAllCheckbox.checked, n = e.tbody ? e.tbody.querySelectorAll("[data-ln-row]") : [];
      for (let s = 0; s < n.length; s++) {
        const u = n[s].getAttribute("data-ln-row-id"), i = n[s].querySelector("[data-ln-row-select]");
        u != null && (t ? (e.selectedIds.add(u), n[s].classList.add("ln-row-selected")) : (e.selectedIds.delete(u), n[s].classList.remove("ln-row-selected")), i && (i.checked = t));
      }
      e.selectedCount = e.selectedIds.size, T(e.dom, "ln-data-table:select-all", {
        table: e.name,
        selected: t
      }), T(e.dom, "ln-data-table:select", {
        table: e.name,
        selectedIds: e.selectedIds,
        count: e.selectedCount
      }), e._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const t = this.tbody.querySelectorAll("[data-ln-row]");
      for (let n = 0; n < t.length; n++) {
        const s = t[n].querySelector("[data-ln-row-select]"), u = t[n].getAttribute("data-ln-row-id");
        s && s.checked && u != null && (this.selectedIds.add(u), t[n].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, l.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const e = this.dom.querySelector("[data-ln-col-select]");
    if (e) {
      const t = e.querySelector('input[type="checkbox"]');
      t && t.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds.clear(), this.selectedCount = 0, this.tbody) {
      const t = this.tbody.querySelectorAll("[data-ln-row]");
      for (let n = 0; n < t.length; n++) {
        t[n].classList.remove("ln-row-selected");
        const s = t[n].querySelector("[data-ln-row-select]");
        s && (s.checked = !1);
      }
    }
    this._updateFooter();
  }, l.prototype._focusRow = function(e) {
    for (let t = 0; t < e.length; t++)
      e[t].classList.remove("ln-row-focused"), e[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < e.length) {
      const t = e[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, l.prototype._openFilterDropdown = function(e, t, n) {
    this._closeFilterDropdown();
    const s = $(this.dom, this.name + "-column-filter", "ln-data-table") || $(this.dom, "column-filter", "ln-data-table");
    if (!s) return;
    const u = s.firstElementChild;
    if (!u) return;
    const i = this._getUniqueValues(e), c = u.querySelector("[data-ln-filter-options]"), f = u.querySelector("[data-ln-filter-search]"), r = this.currentFilters[e] || [], p = this;
    if (f && i.length <= 8 && f.classList.add("hidden"), c) {
      const w = c.querySelector("[data-ln-filter-reset]");
      w && (w.checked = r.length === 0);
      const E = $(u, this.name + "-column-filter-item", "ln-data-table") || $(u, "column-filter-item", "ln-data-table");
      if (E)
        for (let A = 0; A < i.length; A++) {
          const C = i[A], O = E.cloneNode(!0);
          Y(O, { value: C });
          const F = O.querySelector('input[type="checkbox"]');
          F && (F.value = C, F.checked = r.length > 0 && r.indexOf(C) !== -1), c.appendChild(O);
        }
      c.addEventListener("change", function(A) {
        A.target.type === "checkbox" && (p._applyFilterMutualExclusion(A.target, c), p._onFilterChange(e, c));
      });
    }
    f && f.addEventListener("input", function() {
      const w = f.value.toLowerCase(), E = c.querySelectorAll("li");
      for (let A = 0; A < E.length; A++) {
        const C = E[A].textContent.toLowerCase();
        E[A].classList.toggle("hidden", w && C.indexOf(w) === -1);
      }
    });
    const v = u.querySelector("[data-ln-filter-clear]");
    v && v.addEventListener("click", function() {
      delete p.currentFilters[e], p._closeFilterDropdown(), p._updateFilterIndicators(), T(p.dom, "ln-data-table:filter", {
        table: p.name,
        field: e,
        values: []
      }), p._requestData();
    }), t.appendChild(u), this._activeDropdown = { field: e, th: t, el: u }, u.addEventListener("click", function(w) {
      w.stopPropagation();
    });
  }, l.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, l.prototype._applyFilterMutualExclusion = function(e, t) {
    const n = e.hasAttribute("data-ln-filter-reset"), s = t.querySelector("[data-ln-filter-reset]"), u = t.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])');
    if (n) {
      e.checked = !0;
      for (let i = 0; i < u.length; i++) u[i].checked = !1;
    } else if (e.checked)
      s && (s.checked = !1);
    else {
      let i = !1;
      for (let c = 0; c < u.length; c++)
        if (u[c].checked) {
          i = !0;
          break;
        }
      !i && s && (s.checked = !0);
    }
  }, l.prototype._onFilterChange = function(e, t) {
    const n = t.querySelector("[data-ln-filter-reset]"), s = t.querySelectorAll('input[type="checkbox"]:not([data-ln-filter-reset])'), u = [];
    for (let c = 0; c < s.length; c++)
      s[c].checked && u.push(s[c].value);
    const i = n && n.checked || u.length === 0;
    i ? delete this.currentFilters[e] : this.currentFilters[e] = u, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: e,
      values: i ? [] : u
    }), this._requestData();
  }, l.prototype._updateFilterOptions = function(e) {
    if (e !== null && typeof e == "object" && !Array.isArray(e)) {
      const t = Object.keys(e);
      for (let n = 0; n < t.length; n++) {
        const s = t[n], u = e[s];
        if (!Array.isArray(u)) continue;
        const i = {}, c = [];
        for (let f = 0; f < u.length; f++) {
          const r = String(u[f]);
          i[r] || (i[r] = !0, c.push(r));
        }
        this._filterOptions[s] = c.sort();
      }
    } else {
      const t = this._filterableFields, n = this._data;
      for (let s = 0; s < t.length; s++) {
        const u = t[s];
        this._filterOptions[u] || (this._filterOptions[u] = []);
        const i = this._filterOptions[u], c = {};
        for (let f = 0; f < i.length; f++)
          c[i[f]] = !0;
        for (let f = 0; f < n.length; f++) {
          const r = n[f][u];
          if (r != null) {
            const p = String(r);
            c[p] || (c[p] = !0, i.push(p));
          }
        }
        i.sort();
      }
    }
  }, l.prototype._getUniqueValues = function(e) {
    return (this._filterOptions[e] || []).slice().sort();
  }, l.prototype._updateFilterIndicators = function() {
    const e = this.ths;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], s = n.getAttribute("data-ln-col");
      if (!s) continue;
      const u = n.querySelector("[data-ln-col-filter]");
      if (!u) continue;
      const i = this.currentFilters[s] && this.currentFilters[s].length > 0;
      u.classList.toggle("ln-filter-active", !!i);
    }
  }, l.prototype._renderRows = function() {
    if (!this.tbody) return;
    const e = this._data, t = this._lastTotal, n = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (e.length === 0 || n === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    e.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, l.prototype._renderAll = function() {
    const e = this._data, t = document.createDocumentFragment();
    for (let n = 0; n < e.length; n++) {
      const s = this._buildRow(e[n]);
      if (!s) break;
      t.appendChild(s);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, l.prototype._buildRow = function(e) {
    const t = $(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const n = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!n) return null;
    if (this._fillRow(n, e), n._lnRecord = e, e.id != null && n.setAttribute("data-ln-row-id", e.id), this._selectable && e.id != null && this.selectedIds.has(String(e.id))) {
      n.classList.add("ln-row-selected");
      const s = n.querySelector("[data-ln-row-select]");
      s && (s.checked = !0);
    }
    return n;
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    if (!this._rowHeight) {
      const n = this._buildRow(this._data[0]);
      n && (this.tbody.textContent = "", this.tbody.appendChild(n), this._rowHeight = n.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollContainer = a(this.dom);
    const t = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._renderVirtual();
      }));
    }, t.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const e = this._data, t = e.length, n = this._rowHeight;
    if (!n || !t) return;
    const s = this.thead ? this.thead.offsetHeight : 0, u = this._scrollContainer;
    let i, c;
    if (u) {
      const A = this.table.getBoundingClientRect(), C = u.getBoundingClientRect(), O = A.top - C.top + u.scrollTop + s;
      i = u.scrollTop - O, c = u.clientHeight;
    } else {
      const O = this.table.getBoundingClientRect().top + window.scrollY + s;
      i = window.scrollY - O, c = window.innerHeight;
    }
    const f = Math.max(0, Math.floor(i / n) - 15), r = Math.min(f + Math.ceil(c / n) + 30, t);
    if (f === this._vStart && r === this._vEnd) return;
    this._vStart = f, this._vEnd = r;
    const p = this.ths.length || 1, v = f * n, w = (t - r) * n, E = document.createDocumentFragment();
    if (v > 0) {
      const A = document.createElement("tr");
      A.className = "ln-data-table__spacer", A.setAttribute("aria-hidden", "true");
      const C = document.createElement("td");
      C.setAttribute("colspan", p), C.style.height = v + "px", A.appendChild(C), E.appendChild(A);
    }
    for (let A = f; A < r; A++) {
      const C = this._buildRow(e[A]);
      C && E.appendChild(C);
    }
    if (w > 0) {
      const A = document.createElement("tr");
      A.className = "ln-data-table__spacer", A.setAttribute("aria-hidden", "true");
      const C = document.createElement("td");
      C.setAttribute("colspan", p), C.style.height = w + "px", A.appendChild(C), E.appendChild(A);
    }
    this.tbody.textContent = "", this.tbody.appendChild(E), this._selectable && this._updateSelectAll();
  }, l.prototype._fillRow = function(e, t) {
    Et(e, t);
    const n = e.querySelectorAll("[data-ln-cell-attr]");
    for (let s = 0; s < n.length; s++) {
      const u = n[s], i = u.getAttribute("data-ln-cell-attr").split(",");
      for (let c = 0; c < i.length; c++) {
        const f = i[c].trim().split(":");
        if (f.length !== 2) continue;
        const r = f[0].trim(), p = f[1].trim();
        t[r] != null && u.setAttribute(p, t[r]);
      }
    }
  }, l.prototype._showEmptyState = function(e) {
    const t = $(this.dom, e, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, l.prototype._updateFooter = function() {
    const e = this._lastTotal, t = this._lastFiltered, n = t < e;
    if (this._totalSpan && (this._totalSpan.textContent = b(e)), this._filteredSpan && (this._filteredSpan.textContent = n ? b(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const s = this.selectedIds.size;
      this._selectedSpan.textContent = s > 0 ? b(s) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", s === 0);
    }
  }, l.prototype.destroy = function() {
    this.dom[d] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[d]);
  };
  function o(e, t) {
    const n = e[d];
    if (n && t === "data-ln-data-table-selectable") {
      const s = e.hasAttribute("data-ln-data-table-selectable");
      s !== n._selectable && (n._selectable = s, s ? n._enableSelection() : n._disableSelection());
    }
  }
  B(m, d, l, "ln-data-table", {
    extraAttributes: ["data-ln-data-table-selectable"],
    onAttributeChange: o
  });
})();
(function() {
  const m = "ln-icons-sprite", d = "#ln-", y = "#lnc-", _ = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let b = null;
  const a = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), o = "lni:", e = "lni:v", t = "1";
  function n() {
    try {
      if (localStorage.getItem(e) !== t) {
        for (let p = localStorage.length - 1; p >= 0; p--) {
          const v = localStorage.key(p);
          v && v.indexOf(o) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(e, t);
      }
    } catch {
    }
  }
  n();
  function s() {
    return b || (b = document.getElementById(m), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = m, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function u(p) {
    return p.indexOf(y) === 0 ? l + "/" + p.slice(y.length) + ".svg" : a + "/" + p.slice(d.length) + ".svg";
  }
  function i(p, v) {
    const w = v.match(/viewBox="([^"]+)"/), E = w ? w[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", O = v.match(/<svg([^>]*)>/i), F = O ? O[1] : "", D = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    D.id = p, D.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const H = F.match(new RegExp(M + '="([^"]*)"'));
      H && D.setAttribute(M, H[1]);
    }), D.innerHTML = C, s().querySelector("defs").appendChild(D);
  }
  function c(p) {
    if (_.has(p) || g.has(p) || p.indexOf(y) === 0 && !l) return;
    const v = p.slice(1);
    try {
      const w = localStorage.getItem(o + v);
      if (w) {
        i(v, w), _.add(p);
        return;
      }
    } catch {
    }
    g.add(p), fetch(u(p)).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      i(v, w), _.add(p), g.delete(p);
      try {
        localStorage.setItem(o + v, w);
      } catch {
      }
    }).catch(function() {
      g.delete(p);
    });
  }
  function f(p) {
    const v = 'use[href^="' + d + '"], use[href^="' + y + '"]', w = p.querySelectorAll ? p.querySelectorAll(v) : [];
    if (p.matches && p.matches(v)) {
      const E = p.getAttribute("href");
      E && c(E);
    }
    Array.prototype.forEach.call(w, function(E) {
      const A = E.getAttribute("href");
      A && c(A);
    });
  }
  function r() {
    f(document), new MutationObserver(function(p) {
      p.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(w) {
            w.nodeType === 1 && f(w);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const w = v.target.getAttribute("href");
          w && (w.indexOf(d) === 0 || w.indexOf(y) === 0) && c(w);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
