const _t = {};
function vt(p, a) {
  _t[p] || (_t[p] = document.querySelector('[data-ln-template="' + p + '"]'));
  const y = _t[p];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + p + '" not found'), null);
}
function T(p, a, y) {
  p.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: y || {}
  }));
}
function z(p, a, y) {
  const _ = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return p.dispatchEvent(_), _;
}
function J(p, a) {
  if (!p || !a) return p;
  const y = p.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < y.length; l++) {
    const n = y[l], e = n.getAttribute("data-ln-field");
    a[e] != null && (n.textContent = a[e]);
  }
  const _ = p.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < _.length; l++) {
    const n = _[l], e = n.getAttribute("data-ln-attr").split(",");
    for (let i = 0; i < e.length; i++) {
      const t = e[i].trim().split(":");
      if (t.length !== 2) continue;
      const s = t[0].trim(), c = t[1].trim();
      a[c] != null && n.setAttribute(s, a[c]);
    }
  }
  const g = p.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < g.length; l++) {
    const n = g[l], e = n.getAttribute("data-ln-show");
    e in a && n.classList.toggle("hidden", !a[e]);
  }
  const b = p.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < b.length; l++) {
    const n = b[l], e = n.getAttribute("data-ln-class").split(",");
    for (let i = 0; i < e.length; i++) {
      const t = e[i].trim().split(":");
      if (t.length !== 2) continue;
      const s = t[0].trim(), c = t[1].trim();
      c in a && n.classList.toggle(s, !!a[c]);
    }
  }
  return p;
}
function Tt(p, a) {
  if (!p || !a) return p;
  const y = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const _ = y.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(g, b) {
        return a[b] !== void 0 ? a[b] : "";
      }
    ));
  }
  return p;
}
function W(p, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      W(p, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  p();
}
function ot(p, a, y) {
  if (p) {
    const _ = p.querySelector('[data-ln-template="' + a + '"]');
    if (_) return _.content.cloneNode(!0);
  }
  return vt(a, y);
}
function Ct(p, a) {
  const y = {}, _ = p.querySelectorAll("[" + a + "]");
  for (let g = 0; g < _.length; g++)
    y[_[g].getAttribute(a)] = _[g].textContent, _[g].remove();
  return y;
}
function bt(p, a, y, _) {
  if (p.nodeType !== 1) return;
  const b = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", l = Array.from(p.querySelectorAll(b));
  p.matches && p.matches(b) && l.push(p);
  for (const n of l)
    n[y] || (n[y] = new _(n));
}
function at(p) {
  return !!(p.offsetWidth || p.offsetHeight || p.getClientRects().length);
}
function Et(p) {
  const a = {}, y = p.elements;
  for (let _ = 0; _ < y.length; _++) {
    const g = y[_];
    if (!(!g.name || g.disabled || g.type === "file" || g.type === "submit" || g.type === "button"))
      if (g.type === "checkbox")
        a[g.name] || (a[g.name] = []), g.checked && a[g.name].push(g.value);
      else if (g.type === "radio")
        g.checked && (a[g.name] = g.value);
      else if (g.type === "select-multiple") {
        a[g.name] = [];
        for (let b = 0; b < g.options.length; b++)
          g.options[b].selected && a[g.name].push(g.options[b].value);
      } else
        a[g.name] = g.value;
  }
  return a;
}
function At(p, a) {
  const y = p.elements, _ = [];
  for (let g = 0; g < y.length; g++) {
    const b = y[g];
    if (!b.name || !(b.name in a) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const l = a[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(l) ? l.indexOf(b.value) !== -1 : !!l, _.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(l), _.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(l))
        for (let n = 0; n < b.options.length; n++)
          b.options[n].selected = l.indexOf(b.options[n].value) !== -1;
      _.push(b);
    } else
      b.value = l, _.push(b);
  }
  return _;
}
function $(p) {
  const a = p.closest("[lang]");
  return (a ? a.lang : null) || navigator.language;
}
function B(p, a, y, _, g = {}) {
  const b = g.extraAttributes || [], l = g.onAttributeChange || null, n = g.onInit || null;
  function e(i) {
    const t = i || document.body;
    bt(t, p, a, y), n && n(t);
  }
  return W(function() {
    const i = new MutationObserver(function(s) {
      for (let c = 0; c < s.length; c++) {
        const u = s[c];
        if (u.type === "childList")
          for (let o = 0; o < u.addedNodes.length; o++) {
            const d = u.addedNodes[o];
            d.nodeType === 1 && (bt(d, p, a, y), n && n(d));
          }
        else u.type === "attributes" && (l && u.target[a] ? l(u.target, u.attributeName) : (bt(u.target, p, a, y), n && n(u.target)));
      }
    });
    let t = [];
    if (p.indexOf("[") !== -1) {
      const s = /\[([\w-]+)/g;
      let c;
      for (; (c = s.exec(p)) !== null; )
        t.push(c[1]);
    } else
      t.push(p);
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: t.concat(b)
    });
  }, _ || (p.indexOf("[") === -1 ? p.replace("data-", "") : "component")), window[a] = e, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    e(document.body);
  }) : e(document.body), e;
}
function kt(p, a) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, p(), a && a();
    }));
  };
}
const xt = "ln:";
function Ot() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function wt(p, a) {
  const y = a.getAttribute("data-ln-persist"), _ = y !== null && y !== "" ? y : a.id;
  return _ ? xt + p + ":" + Ot() + ":" + _ : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function ht(p, a) {
  const y = wt(p, a);
  if (!y) return null;
  try {
    const _ = localStorage.getItem(y);
    return _ !== null ? JSON.parse(_) : null;
  } catch {
    return null;
  }
}
function et(p, a, y) {
  const _ = wt(p, a);
  if (_)
    try {
      localStorage.setItem(_, JSON.stringify(y));
    } catch {
    }
}
function ft(p, a, y, _) {
  const g = typeof _ == "number" ? _ : 4, b = window.innerWidth, l = window.innerHeight, n = a.width, e = a.height, i = (y || "bottom").split("-"), t = i[0], s = i[1] === "start" || i[1] === "end" ? i[1] : "center", c = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, u = c[t] || c.bottom;
  function o(v) {
    return v === "top" || v === "bottom" ? s === "start" ? p.left : s === "end" ? p.right - n : p.left + (p.width - n) / 2 : s === "start" ? p.top : s === "end" ? p.bottom - e : p.top + (p.height - e) / 2;
  }
  function d(v) {
    let w, E, A = !0;
    return v === "top" ? (w = p.top - g - e, E = o(v), w < 0 && (A = !1)) : v === "bottom" ? (w = p.bottom + g, E = o(v), w + e > l && (A = !1)) : v === "left" ? (w = o(v), E = p.left - g - n, E < 0 && (A = !1)) : (w = o(v), E = p.right + g, E + n > b && (A = !1)), { top: w, left: E, side: v, fits: A };
  }
  let m = null;
  for (let v = 0; v < u.length; v++) {
    const w = d(u[v]);
    if (w.fits) {
      m = w;
      break;
    }
  }
  m || (m = d(u[0]));
  let r = m.top, h = m.left;
  return n >= b ? h = 0 : (h < 0 && (h = 0), h + n > b && (h = b - n)), e >= l ? r = 0 : (r < 0 && (r = 0), r + e > l && (r = l - e)), { top: r, left: h, placement: m.side };
}
function St(p) {
  if (!p || p.parentNode === document.body)
    return function() {
    };
  const a = p.parentNode, y = document.createComment("ln-teleport");
  return a.insertBefore(y, p), document.body.appendChild(p), function() {
    y.parentNode && (y.parentNode.insertBefore(p, y), y.parentNode.removeChild(y));
  };
}
function yt(p) {
  if (!p) return { width: 0, height: 0 };
  const a = p.style, y = a.visibility, _ = a.display, g = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const b = p.offsetWidth, l = p.offsetHeight;
  return a.visibility = y, a.display = _, a.position = g, { width: b, height: l };
}
(function() {
  if (window.lnHttp) return;
  const p = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function _(i) {
    return typeof i == "string" ? i : i instanceof URL ? i.href : i instanceof Request ? i.url : String(i);
  }
  function g(i, t) {
    return t && t.method ? String(t.method).toUpperCase() : i instanceof Request ? i.method.toUpperCase() : "GET";
  }
  function b(i, t) {
    return t + " " + i;
  }
  function l(i) {
    return i === "GET" || i === "HEAD";
  }
  function n(i, t) {
    t = t || {};
    const s = _(i), c = g(i, t), u = b(s, c);
    l(c) && a.has(u) && (a.get(u).abort(), a.delete(u));
    const o = new AbortController(), d = t.signal;
    d && (d.aborted ? o.abort(d.reason) : d.addEventListener("abort", function() {
      o.abort(d.reason);
    }, { once: !0 }));
    const m = Object.assign({}, t, { signal: o.signal });
    return a.set(u, o), p(i, m).finally(function() {
      a.get(u) === o && a.delete(u);
    });
  }
  n.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = n;
  function e(i) {
    const t = i.detail || {};
    if (!t.url) return;
    const s = i.target, c = (t.method || (t.body ? "POST" : "GET")).toUpperCase(), u = t.key;
    u && y.has(u) && (y.get(u).abort(), y.delete(u));
    const o = new AbortController(), d = t.signal;
    d && (d.aborted ? o.abort(d.reason) : d.addEventListener("abort", function() {
      o.abort(d.reason);
    }, { once: !0 })), u && y.set(u, o);
    const m = { method: c, signal: o.signal };
    t.body !== void 0 && (m.body = t.body), window.fetch(t.url, m).then(function(r) {
      u && y.get(u) === o && y.delete(u), T(s, "ln-http:response", {
        ok: r.ok,
        status: r.status,
        response: r
      });
    }).catch(function(r) {
      u && y.get(u) === o && y.delete(u), !(r && r.name === "AbortError") && T(s, "ln-http:error", {
        ok: !1,
        status: 0,
        error: r
      });
    });
  }
  document.addEventListener("ln-http:request", e), window.lnHttp = {
    cancel: function(i) {
      let t = !1;
      return a.forEach(function(s, c) {
        c.endsWith(" " + i) && (s.abort(), a.delete(c), t = !0);
      }), t;
    },
    cancelByKey: function(i) {
      return y.has(i) ? (y.get(i).abort(), y.delete(i), !0) : !1;
    },
    cancelAll: function() {
      a.forEach(function(i) {
        i.abort();
      }), a.clear(), y.forEach(function(i) {
        i.abort();
      }), y.clear();
    },
    get inflight() {
      const i = [];
      return a.forEach(function(t, s) {
        const c = s.indexOf(" ");
        i.push({ method: s.slice(0, c), url: s.slice(c + 1) });
      }), y.forEach(function(t, s) {
        i.push({ key: s });
      }), i;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", e), window.fetch = p, delete window.lnHttp;
    }
  };
})();
(function() {
  const p = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function y(t) {
    if (!t.hasAttribute(p) || t[a]) return;
    t[a] = !0;
    const s = n(t);
    _(s.links), g(s.forms);
  }
  function _(t) {
    for (const s of t) {
      if (s[a + "Trigger"] || s.hostname && s.hostname !== window.location.hostname) continue;
      const c = s.getAttribute("href");
      if (c && c.includes("#")) continue;
      const u = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const d = s.getAttribute("href");
        d && l("GET", d, null, s);
      };
      s.addEventListener("click", u), s[a + "Trigger"] = u;
    }
  }
  function g(t) {
    for (const s of t) {
      if (s[a + "Trigger"]) continue;
      const c = function(u) {
        u.preventDefault();
        const o = s.method.toUpperCase(), d = s.action, m = new FormData(s);
        for (const r of s.querySelectorAll('button, input[type="submit"]'))
          r.disabled = !0;
        l(o, d, m, s, function() {
          for (const r of s.querySelectorAll('button, input[type="submit"]'))
            r.disabled = !1;
        });
      };
      s.addEventListener("submit", c), s[a + "Trigger"] = c;
    }
  }
  function b(t) {
    if (!t[a]) return;
    const s = n(t);
    for (const c of s.links)
      c[a + "Trigger"] && (c.removeEventListener("click", c[a + "Trigger"]), delete c[a + "Trigger"]);
    for (const c of s.forms)
      c[a + "Trigger"] && (c.removeEventListener("submit", c[a + "Trigger"]), delete c[a + "Trigger"]);
    delete t[a];
  }
  function l(t, s, c, u, o) {
    if (z(u, "ln-ajax:before-start", { method: t, url: s }).defaultPrevented) return;
    T(u, "ln-ajax:start", { method: t, url: s }), u.classList.add("ln-ajax--loading");
    const m = document.createElement("span");
    m.className = "ln-ajax-spinner", u.appendChild(m);
    function r() {
      u.classList.remove("ln-ajax--loading");
      const A = u.querySelector(".ln-ajax-spinner");
      A && A.remove(), o && o();
    }
    let h = s;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    c instanceof FormData && w && c.append("_token", w);
    const E = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), t === "GET" && c) {
      const A = new URLSearchParams(c);
      h = s + (s.includes("?") ? "&" : "?") + A.toString();
    } else t !== "GET" && c && (E.body = c);
    fetch(h, E).then(function(A) {
      const k = A.ok;
      return A.json().then(function(I) {
        return { ok: k, status: A.status, data: I };
      });
    }).then(function(A) {
      const k = A.data;
      if (A.ok) {
        if (k.title && (document.title = k.title), k.content)
          for (const I in k.content) {
            const q = document.getElementById(I);
            q && (q.innerHTML = k.content[I]);
          }
        if (u.tagName === "A") {
          const I = u.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", h);
        T(u, "ln-ajax:success", { method: t, url: h, data: k });
      } else
        T(u, "ln-ajax:error", { method: t, url: h, status: A.status, data: k });
      if (k.message) {
        const I = k.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: I.type || (A.ok ? "success" : "error"),
            title: I.title || "",
            message: I.body || ""
          }
        }));
      }
      T(u, "ln-ajax:complete", { method: t, url: h }), r();
    }).catch(function(A) {
      T(u, "ln-ajax:error", { method: t, url: h, error: A }), T(u, "ln-ajax:complete", { method: t, url: h }), r();
    });
  }
  function n(t) {
    const s = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(p) !== "false" ? s.links.push(t) : t.tagName === "FORM" && t.getAttribute(p) !== "false" ? s.forms.push(t) : (s.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), s.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), s;
  }
  function e() {
    W(function() {
      new MutationObserver(function(s) {
        for (const c of s)
          if (c.type === "childList") {
            for (const u of c.addedNodes)
              if (u.nodeType === 1 && (y(u), !u.hasAttribute(p))) {
                for (const d of u.querySelectorAll("[" + p + "]"))
                  y(d);
                const o = u.closest && u.closest("[" + p + "]");
                if (o && o.getAttribute(p) !== "false") {
                  const d = n(u);
                  _(d.links), g(d.forms);
                }
              }
          } else c.type === "attributes" && y(c.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-ajax");
  }
  function i() {
    for (const t of document.querySelectorAll("[" + p + "]"))
      y(t);
  }
  window[a] = y, window[a].destroy = b, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const p = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function y(l) {
    const n = Array.from(l.querySelectorAll("[data-ln-modal-for]"));
    l.hasAttribute && l.hasAttribute("data-ln-modal-for") && n.push(l);
    for (const e of n) {
      if (e[a + "Trigger"]) continue;
      const i = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const s = e.getAttribute("data-ln-modal-for"), c = document.getElementById(s);
        if (!c) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + s + '"');
          return;
        }
        if (!c[a]) return;
        const u = c.getAttribute(p);
        c.setAttribute(p, u === "open" ? "close" : "open");
      };
      e.addEventListener("click", i), e[a + "Trigger"] = i;
    }
  }
  function _(l) {
    this.dom = l, this.isOpen = l.getAttribute(p) === "open";
    const n = this;
    return this._onEscape = function(e) {
      e.key === "Escape" && n.dom.setAttribute(p, "close");
    }, this._onFocusTrap = function(e) {
      if (e.key !== "Tab") return;
      const i = Array.prototype.filter.call(
        n.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        at
      );
      if (i.length === 0) return;
      const t = i[0], s = i[i.length - 1];
      e.shiftKey ? document.activeElement === t && (e.preventDefault(), s.focus()) : document.activeElement === s && (e.preventDefault(), t.focus());
    }, this._onClose = function(e) {
      e.preventDefault(), n.dom.setAttribute(p, "close");
    }, b(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + p + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const l = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of l)
      e[a + "Close"] && (e.removeEventListener("click", e[a + "Close"]), delete e[a + "Close"]);
    const n = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const e of n)
      e[a + "Trigger"] && (e.removeEventListener("click", e[a + "Trigger"]), delete e[a + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
  };
  function g(l) {
    const n = l[a];
    if (!n) return;
    const i = l.getAttribute(p) === "open";
    if (i !== n.isOpen)
      if (i) {
        if (z(l, "ln-modal:before-open", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(p, "close");
          return;
        }
        n.isOpen = !0, l.setAttribute("aria-modal", "true"), l.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", n._onEscape), document.addEventListener("keydown", n._onFocusTrap);
        const s = document.activeElement;
        n._returnFocusEl = s && s !== document.body ? s : null;
        const c = l.querySelector("[autofocus]");
        if (c && at(c))
          c.focus();
        else {
          const u = l.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), o = Array.prototype.find.call(u, at);
          if (o) o.focus();
          else {
            const d = l.querySelectorAll("a[href], button:not([disabled])"), m = Array.prototype.find.call(d, at);
            m && m.focus();
          }
        }
        T(l, "ln-modal:open", { modalId: l.id, target: l });
      } else {
        if (z(l, "ln-modal:before-close", { modalId: l.id, target: l }).defaultPrevented) {
          l.setAttribute(p, "open");
          return;
        }
        n.isOpen = !1, l.removeAttribute("aria-modal"), document.removeEventListener("keydown", n._onEscape), document.removeEventListener("keydown", n._onFocusTrap), T(l, "ln-modal:close", { modalId: l.id, target: l }), n._returnFocusEl && document.contains(n._returnFocusEl) && typeof n._returnFocusEl.focus == "function" && n._returnFocusEl.focus(), n._returnFocusEl = null, document.querySelector("[" + p + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function b(l) {
    const n = l.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of n)
      e[a + "Close"] || (e.addEventListener("click", l._onClose), e[a + "Close"] = l._onClose);
  }
  B(p, a, _, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: g,
    onInit: y
  });
})();
(function() {
  const p = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(e) {
    if (!y[e]) {
      const i = new Intl.NumberFormat(e, { useGrouping: !0 }), t = i.formatToParts(1234.5);
      let s = "", c = ".";
      for (let u = 0; u < t.length; u++)
        t[u].type === "group" && (s = t[u].value), t[u].type === "decimal" && (c = t[u].value);
      y[e] = { fmt: i, groupSep: s, decimalSep: c };
    }
    return y[e];
  }
  function b(e, i, t) {
    if (t !== null) {
      const s = parseInt(t, 10), c = e + "|d" + s;
      return y[c] || (y[c] = new Intl.NumberFormat(e, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: s })), y[c].format(i);
    }
    return g(e).fmt.format(i);
  }
  function l(e) {
    if (e.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", e.tagName), this;
    this.dom = e;
    const i = document.createElement("input");
    i.type = "hidden", i.name = e.name, e.removeAttribute("name"), e.type = "text", e.setAttribute("inputmode", "decimal"), e.insertAdjacentElement("afterend", i), this._hidden = i;
    const t = this;
    Object.defineProperty(i, "value", {
      get: function() {
        return _.get.call(i);
      },
      set: function(c) {
        _.set.call(i, c), c !== "" && !isNaN(parseFloat(c)) ? t._displayFormatted(parseFloat(c)) : c === "" && (t.dom.value = "");
      }
    }), this._onInput = function() {
      t._handleInput();
    }, e.addEventListener("input", this._onInput), this._onPaste = function(c) {
      c.preventDefault();
      const u = (c.clipboardData || window.clipboardData).getData("text"), o = g($(e)), d = o.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let m = u.replace(new RegExp("[^0-9\\-" + d + ".]", "g"), "");
      o.groupSep && (m = m.split(o.groupSep).join("")), o.decimalSep !== "." && (m = m.replace(o.decimalSep, "."));
      const r = parseFloat(m);
      isNaN(r) ? (e.value = "", t._hidden.value = "") : t.value = r;
    }, e.addEventListener("paste", this._onPaste);
    const s = e.value;
    if (s !== "") {
      const c = parseFloat(s);
      isNaN(c) || (this._displayFormatted(c), _.set.call(i, String(c)));
    }
    return this;
  }
  l.prototype._handleInput = function() {
    const e = this.dom, i = g($(e)), t = e.value;
    if (t === "") {
      this._hidden.value = "", T(e, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (t === "-") {
      this._hidden.value = "";
      return;
    }
    const s = e.selectionStart;
    let c = 0;
    for (let A = 0; A < s; A++)
      /[0-9]/.test(t[A]) && c++;
    let u = t;
    if (i.groupSep && (u = u.split(i.groupSep).join("")), u = u.replace(i.decimalSep, "."), t.endsWith(i.decimalSep) || t.endsWith(".")) {
      const A = u.replace(/\.$/, ""), k = parseFloat(A);
      isNaN(k) || this._setHiddenRaw(k);
      return;
    }
    const o = u.indexOf(".");
    if (o !== -1 && u.slice(o + 1).endsWith("0")) {
      const k = parseFloat(u);
      isNaN(k) || this._setHiddenRaw(k);
      return;
    }
    const d = e.getAttribute("data-ln-number-decimals");
    if (d !== null && o !== -1) {
      const A = parseInt(d, 10);
      u.slice(o + 1).length > A && (u = u.slice(0, o + 1 + A));
    }
    const m = parseFloat(u);
    if (isNaN(m)) return;
    const r = e.getAttribute("data-ln-number-min"), h = e.getAttribute("data-ln-number-max");
    if (r !== null && m < parseFloat(r) || h !== null && m > parseFloat(h)) return;
    let v;
    if (d !== null)
      v = b($(e), m, d);
    else {
      const A = o !== -1 ? u.slice(o + 1).length : 0;
      if (A > 0) {
        const k = $(e) + "|u" + A;
        y[k] || (y[k] = new Intl.NumberFormat($(e), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = y[k].format(m);
      } else
        v = i.fmt.format(m);
    }
    e.value = v;
    let w = c, E = 0;
    for (let A = 0; A < v.length && w > 0; A++)
      E = A + 1, /[0-9]/.test(v[A]) && w--;
    w > 0 && (E = v.length), e.setSelectionRange(E, E), this._setHiddenRaw(m), T(e, "ln-number:input", { value: m, formatted: v });
  }, l.prototype._setHiddenRaw = function(e) {
    _.set.call(this._hidden, String(e));
  }, l.prototype._displayFormatted = function(e) {
    this.dom.value = b($(this.dom), e, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(l.prototype, "value", {
    get: function() {
      const e = this._hidden.value;
      return e === "" ? NaN : parseFloat(e);
    },
    set: function(e) {
      if (typeof e != "number" || isNaN(e)) {
        this.dom.value = "", this._setHiddenRaw("");
        return;
      }
      this._displayFormatted(e), this._setHiddenRaw(e), T(this.dom, "ln-number:input", {
        value: e,
        formatted: this.dom.value
      });
    }
  }), Object.defineProperty(l.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), l.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function n() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + p + "]");
      for (let i = 0; i < e.length; i++) {
        const t = e[i][a];
        t && !isNaN(t.value) && t._displayFormatted(t.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(p, a, l, "ln-number"), n();
})();
(function() {
  const p = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(o, d) {
    const m = o + "|" + JSON.stringify(d);
    return y[m] || (y[m] = new Intl.DateTimeFormat(o, d)), y[m];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, l = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function n(o) {
    return !o || o === "" ? { dateStyle: "medium" } : o.match(b) ? l[o] : null;
  }
  function e(o, d, m) {
    const r = o.getDate(), h = o.getMonth(), v = o.getFullYear(), w = o.getHours(), E = o.getMinutes(), A = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: g(m, { month: "long" }).format(o),
      MMM: g(m, { month: "short" }).format(o),
      MM: String(h + 1).padStart(2, "0"),
      M: String(h + 1),
      dd: String(r).padStart(2, "0"),
      d: String(r),
      HH: String(w).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(k) {
      return A[k];
    });
  }
  function i(o, d, m) {
    const r = n(d);
    return r ? g(m, r).format(o) : e(o, d, m);
  }
  function t(o) {
    if (o.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", o.tagName), this;
    this.dom = o;
    const d = this, m = o.value, r = o.name, h = document.createElement("input");
    h.type = "hidden", h.name = r, o.removeAttribute("name"), o.insertAdjacentElement("afterend", h), this._hidden = h;
    const v = document.createElement("input");
    v.type = "date", v.tabIndex = -1, v.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", h.insertAdjacentElement("afterend", v), this._picker = v, o.type = "text";
    const w = document.createElement("button");
    if (w.type = "button", w.setAttribute("aria-label", "Open date picker"), w.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', v.insertAdjacentElement("afterend", w), this._btn = w, this._lastISO = "", Object.defineProperty(h, "value", {
      get: function() {
        return _.get.call(h);
      },
      set: function(E) {
        if (_.set.call(h, E), E && E !== "") {
          const A = s(E);
          A && (d._displayFormatted(A), _.set.call(v, E));
        } else E === "" && (d.dom.value = "", _.set.call(v, ""));
      }
    }), this._onPickerChange = function() {
      const E = v.value;
      if (E) {
        const A = s(E);
        A && (d._setHiddenRaw(E), d._displayFormatted(A), d._lastISO = E, T(d.dom, "ln-date:change", {
          value: E,
          formatted: d.dom.value,
          date: A
        }));
      } else
        d._setHiddenRaw(""), d.dom.value = "", d._lastISO = "", T(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, v.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const E = d.dom.value.trim();
      if (E === "") {
        d._lastISO !== "" && (d._setHiddenRaw(""), _.set.call(d._picker, ""), d.dom.value = "", d._lastISO = "", T(d.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (d._lastISO) {
        const k = s(d._lastISO);
        if (k) {
          const I = d.dom.getAttribute(p) || "", q = $(d.dom), D = i(k, I, q);
          if (E === D) return;
        }
      }
      const A = c(E);
      if (A) {
        const k = A.getFullYear(), I = String(A.getMonth() + 1).padStart(2, "0"), q = String(A.getDate()).padStart(2, "0"), D = k + "-" + I + "-" + q;
        d._setHiddenRaw(D), _.set.call(d._picker, D), d._displayFormatted(A), d._lastISO = D, T(d.dom, "ln-date:change", {
          value: D,
          formatted: d.dom.value,
          date: A
        });
      } else if (d._lastISO) {
        const k = s(d._lastISO);
        k && d._displayFormatted(k);
      } else
        d.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, w.addEventListener("click", this._onBtnClick), m && m !== "") {
      const E = s(m);
      E && (this._setHiddenRaw(m), _.set.call(v, m), this._displayFormatted(E), this._lastISO = m);
    }
    return this;
  }
  function s(o) {
    if (!o || typeof o != "string") return null;
    const d = o.split("T"), m = d[0].split("-");
    if (m.length < 3) return null;
    const r = parseInt(m[0], 10), h = parseInt(m[1], 10) - 1, v = parseInt(m[2], 10);
    if (isNaN(r) || isNaN(h) || isNaN(v)) return null;
    let w = 0, E = 0;
    if (d[1]) {
      const k = d[1].split(":");
      w = parseInt(k[0], 10) || 0, E = parseInt(k[1], 10) || 0;
    }
    const A = new Date(r, h, v, w, E);
    return A.getFullYear() !== r || A.getMonth() !== h || A.getDate() !== v ? null : A;
  }
  function c(o) {
    if (!o || typeof o != "string" || (o = o.trim(), o.length < 6)) return null;
    let d, m;
    if (o.indexOf(".") !== -1)
      d = ".", m = o.split(".");
    else if (o.indexOf("/") !== -1)
      d = "/", m = o.split("/");
    else if (o.indexOf("-") !== -1)
      d = "-", m = o.split("-");
    else
      return null;
    if (m.length !== 3) return null;
    const r = [];
    for (let A = 0; A < 3; A++) {
      const k = parseInt(m[A], 10);
      if (isNaN(k)) return null;
      r.push(k);
    }
    let h, v, w;
    d === "." ? (h = r[0], v = r[1], w = r[2]) : d === "/" ? (v = r[0], h = r[1], w = r[2]) : m[0].length === 4 ? (w = r[0], v = r[1], h = r[2]) : (h = r[0], v = r[1], w = r[2]), w < 100 && (w += w < 50 ? 2e3 : 1900);
    const E = new Date(w, v - 1, h);
    return E.getFullYear() !== w || E.getMonth() !== v - 1 || E.getDate() !== h ? null : E;
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
  }, t.prototype._setHiddenRaw = function(o) {
    _.set.call(this._hidden, o);
  }, t.prototype._displayFormatted = function(o) {
    const d = this.dom.getAttribute(p) || "", m = $(this.dom);
    this.dom.value = i(o, d, m);
  }, Object.defineProperty(t.prototype, "value", {
    get: function() {
      return _.get.call(this._hidden);
    },
    set: function(o) {
      if (!o || o === "") {
        this._setHiddenRaw(""), _.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const d = s(o);
      d && (this._setHiddenRaw(o), _.set.call(this._picker, o), this._displayFormatted(d), this._lastISO = o, T(this.dom, "ln-date:change", {
        value: o,
        formatted: this.dom.value,
        date: d
      }));
    }
  }), Object.defineProperty(t.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? s(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      const d = o.getFullYear(), m = String(o.getMonth() + 1).padStart(2, "0"), r = String(o.getDate()).padStart(2, "0");
      this.value = d + "-" + m + "-" + r;
    }
  }), Object.defineProperty(t.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), t.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const o = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), o && (this.dom.value = o), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[a];
  };
  function u() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + p + "]");
      for (let d = 0; d < o.length; d++) {
        const m = o[d][a];
        if (m && m.value) {
          const r = s(m.value);
          r && m._displayFormatted(r);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(p, a, t, "ln-date"), u();
})();
(function() {
  const p = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), _ = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const s of _)
        s();
    }, history._lnNavPatched = !0;
  }
  function g(t) {
    if (!t.hasAttribute(p) || y.has(t)) return;
    const s = t.getAttribute(p);
    if (!s) return;
    const c = b(t, s);
    y.set(t, c), t[a] = c;
  }
  function b(t, s) {
    let c = Array.from(t.querySelectorAll("a"));
    n(c, s, window.location.pathname);
    const u = function() {
      c = Array.from(t.querySelectorAll("a")), n(c, s, window.location.pathname);
    };
    window.addEventListener("popstate", u), _.push(u);
    const o = new MutationObserver(function(d) {
      for (const m of d)
        if (m.type === "childList") {
          for (const r of m.addedNodes)
            if (r.nodeType === 1) {
              if (r.tagName === "A")
                c.push(r), n([r], s, window.location.pathname);
              else if (r.querySelectorAll) {
                const h = Array.from(r.querySelectorAll("a"));
                c = c.concat(h), n(h, s, window.location.pathname);
              }
            }
          for (const r of m.removedNodes)
            if (r.nodeType === 1) {
              if (r.tagName === "A")
                c = c.filter(function(h) {
                  return h !== r;
                });
              else if (r.querySelectorAll) {
                const h = Array.from(r.querySelectorAll("a"));
                c = c.filter(function(v) {
                  return !h.includes(v);
                });
              }
            }
        }
    });
    return o.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: s,
      observer: o,
      updateHandler: u,
      destroy: function() {
        o.disconnect(), window.removeEventListener("popstate", u);
        const d = _.indexOf(u);
        d !== -1 && _.splice(d, 1), y.delete(t), delete t[a];
      }
    };
  }
  function l(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function n(t, s, c) {
    const u = l(c);
    for (const o of t) {
      const d = o.getAttribute("href");
      if (!d) continue;
      const m = l(d);
      o.classList.remove(s);
      const r = m === u, h = m !== "/" && u.startsWith(m + "/");
      (r || h) && o.classList.add(s);
    }
  }
  function e() {
    W(function() {
      new MutationObserver(function(s) {
        for (const c of s)
          if (c.type === "childList") {
            for (const u of c.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(p) && g(u), u.querySelectorAll))
                for (const o of u.querySelectorAll("[" + p + "]"))
                  g(o);
          } else c.type === "attributes" && c.target.hasAttribute && c.target.hasAttribute(p) && g(c.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [p] });
    }, "ln-nav");
  }
  window[a] = g;
  function i() {
    for (const t of document.querySelectorAll("[" + p + "]"))
      g(t);
  }
  e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const p = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function y() {
    const l = (location.hash || "").replace("#", ""), n = {};
    if (!l) return n;
    for (const e of l.split("&")) {
      const i = e.indexOf(":");
      i > 0 && (n[e.slice(0, i)] = e.slice(i + 1));
    }
    return n;
  }
  function _(l, n) {
    const e = (l.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (e) return e;
    if (l.tagName !== "A") return "";
    const i = l.getAttribute("href") || "";
    if (!i.startsWith("#")) return "";
    const t = i.slice(1);
    if (!t) return "";
    const s = t.split("&");
    if (n)
      for (const o of s) {
        const d = o.indexOf(":");
        if (d > 0 && o.slice(0, d).toLowerCase().trim() === n)
          return o.slice(d + 1).toLowerCase().trim();
      }
    const c = s[s.length - 1] || "", u = c.indexOf(":");
    return (u > 0 ? c.slice(u + 1) : c).toLowerCase().trim();
  }
  function g(l) {
    return this.dom = l, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const n of this.tabs) {
      const e = _(n, this.nsKey);
      e ? this.mapTabs[e] = n : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', n);
    }
    for (const n of this.panels) {
      const e = (n.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = n);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const l = this;
    this._clickHandlers = [];
    for (const n of this.tabs) {
      if (n[a + "Trigger"]) continue;
      const e = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        const t = _(n, l.nsKey);
        if (t)
          if (n.tagName === "A" && i.preventDefault(), l.hashEnabled) {
            const s = y();
            s[l.nsKey] = t;
            const c = Object.keys(s).map(function(u) {
              return u + ":" + s[u];
            }).join("&");
            location.hash === "#" + c ? l.dom.setAttribute("data-ln-tabs-active", t) : location.hash = c;
          } else
            l.dom.setAttribute("data-ln-tabs-active", t);
      };
      n.addEventListener("click", e), n[a + "Trigger"] = e, l._clickHandlers.push({ el: n, handler: e });
    }
    if (this._hashHandler = function() {
      if (!l.hashEnabled) return;
      const n = y();
      l.dom.setAttribute("data-ln-tabs-active", l.nsKey in n ? n[l.nsKey] : l.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let n = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = ht("tabs", this.dom);
        e !== null && e in this.mapPanels && (n = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", n);
    }
  }
  g.prototype._applyActive = function(l) {
    var n;
    (!l || !(l in this.mapPanels)) && (l = this.defaultKey);
    for (const e in this.mapTabs) {
      const i = this.mapTabs[e];
      e === l ? (i.setAttribute("data-active", ""), i.setAttribute("aria-selected", "true")) : (i.removeAttribute("data-active"), i.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const i = this.mapPanels[e], t = e === l;
      i.classList.toggle("hidden", !t), i.setAttribute("aria-hidden", t ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (n = this.mapPanels[l]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: l, tab: this.mapTabs[l], panel: this.mapPanels[l] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && et("tabs", this.dom, l);
  }, g.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: l, handler: n } of this._clickHandlers)
        l.removeEventListener("click", n), delete l[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(p, a, g, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(l) {
      const n = l.getAttribute("data-ln-tabs-active");
      l[a]._applyActive(n);
    }
  });
})();
(function() {
  const p = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function y(l) {
    const n = Array.from(l.querySelectorAll("[data-ln-toggle-for]"));
    l.hasAttribute && l.hasAttribute("data-ln-toggle-for") && n.push(l);
    for (const e of n) {
      if (e[a + "Trigger"]) continue;
      const i = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        c.preventDefault();
        const u = e.getAttribute("data-ln-toggle-for"), o = document.getElementById(u);
        if (!o || !o[a]) return;
        const d = e.getAttribute("data-ln-toggle-action") || "toggle";
        if (d === "open")
          o.setAttribute(p, "open");
        else if (d === "close")
          o.setAttribute(p, "close");
        else if (d === "toggle") {
          const m = o.getAttribute(p);
          o.setAttribute(p, m === "open" ? "close" : "open");
        }
      };
      e.addEventListener("click", i), e[a + "Trigger"] = i;
      const t = e.getAttribute("data-ln-toggle-for"), s = document.getElementById(t);
      s && s[a] && e.setAttribute("aria-expanded", s[a].isOpen ? "true" : "false");
    }
  }
  function _(l, n) {
    const e = document.querySelectorAll(
      '[data-ln-toggle-for="' + l.id + '"]'
    );
    for (const i of e)
      i.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function g(l) {
    if (this.dom = l, l.hasAttribute("data-ln-persist")) {
      const n = ht("toggle", l);
      n !== null && l.setAttribute(p, n);
    }
    return this.isOpen = l.getAttribute(p) === "open", this.isOpen && l.classList.add("open"), _(l, this.isOpen), this;
  }
  g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const l = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const n of l)
      n[a + "Trigger"] && (n.removeEventListener("click", n[a + "Trigger"]), delete n[a + "Trigger"]);
    delete this.dom[a];
  };
  function b(l) {
    const n = l[a];
    if (!n) return;
    const i = l.getAttribute(p) === "open";
    if (i !== n.isOpen)
      if (i) {
        if (z(l, "ln-toggle:before-open", { target: l }).defaultPrevented) {
          l.setAttribute(p, "close");
          return;
        }
        n.isOpen = !0, l.classList.add("open"), _(l, !0), T(l, "ln-toggle:open", { target: l }), l.hasAttribute("data-ln-persist") && et("toggle", l, "open");
      } else {
        if (z(l, "ln-toggle:before-close", { target: l }).defaultPrevented) {
          l.setAttribute(p, "open");
          return;
        }
        n.isOpen = !1, l.classList.remove("open"), _(l, !1), T(l, "ln-toggle:close", { target: l }), l.hasAttribute("data-ln-persist") && et("toggle", l, "close");
      }
  }
  B(p, a, g, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: b,
    onInit: y
  });
})();
(function() {
  const p = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function y(_) {
    return this.dom = _, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== _) return;
      const b = _.querySelectorAll("[data-ln-toggle]");
      for (const l of b)
        l !== g.detail.target && l.closest("[data-ln-accordion]") === _ && l.getAttribute("data-ln-toggle") === "open" && l.setAttribute("data-ln-toggle", "close");
      T(_, "ln-accordion:change", { target: g.detail.target });
    }, _.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(p, a, y, "ln-accordion");
})();
(function() {
  const p = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function y(_) {
    if (this.dom = _, this.toggleEl = _.querySelector("[data-ln-toggle]"), this._teleportRestore = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = _.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const g = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), g._teleportRestore = St(g.toggleEl), g.toggleEl.style.position = "fixed", g._reposition(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), T(_, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g.toggleEl.style.position = "", g.toggleEl.style.top = "", g.toggleEl.style.left = "", g.toggleEl.style.right = "", g.toggleEl.style.transform = "", g.toggleEl.style.margin = "", g._teleportRestore && (g._teleportRestore(), g._teleportRestore = null), T(_, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const _ = this.triggerBtn.getBoundingClientRect(), g = yt(this.toggleEl), b = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, l = ft(_, g, "bottom-end", b);
    this.toggleEl.style.top = l.top + "px", this.toggleEl.style.left = l.left + "px";
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
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(p, a, y, "ln-dropdown");
})();
(function() {
  const p = "data-ln-popover", a = "lnPopover", y = "data-ln-popover-for", _ = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const g = [];
  let b = null;
  function l() {
    b || (b = function(t) {
      if (t.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function n() {
    g.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function e(t) {
    return this.dom = t, this.isOpen = t.getAttribute(p) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), t.hasAttribute("role") || t.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  e.prototype.open = function(t) {
    this.isOpen || (this.trigger = t || null, this.dom.setAttribute(p, "open"));
  }, e.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(p, "closed");
  }, e.prototype.toggle = function(t) {
    this.isOpen ? this.close() : this.open(t);
  }, e.prototype._applyOpen = function(t) {
    this.isOpen = !0, t && (this.trigger = t), this._previousFocus = document.activeElement, this._teleportRestore = St(this.dom);
    const s = yt(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), m = this.dom.getAttribute(_) || "bottom", r = ft(d, s, m, 8);
      this.dom.style.top = r.top + "px", this.dom.style.left = r.left + "px", this.dom.setAttribute("data-ln-popover-placement", r.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const c = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), u = Array.prototype.find.call(c, at);
    u ? u.focus() : this.dom.focus();
    const o = this;
    this._boundDocClick = function(d) {
      o.dom.contains(d.target) || o.trigger && o.trigger.contains(d.target) || o.close();
    }, o._docClickTimeout = setTimeout(function() {
      o._docClickTimeout = null, document.addEventListener("click", o._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!o.trigger) return;
      const d = o.trigger.getBoundingClientRect(), m = yt(o.dom), r = o.dom.getAttribute(_) || "bottom", h = ft(d, m, r, 8);
      o.dom.style.top = h.top + "px", o.dom.style.left = h.left + "px", o.dom.setAttribute("data-ln-popover-placement", h.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), l(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, e.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const t = g.indexOf(this);
    t !== -1 && g.splice(t, 1), n(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, e.prototype.destroy = function() {
    this.dom[a] && (this.isOpen && this._applyClose(), delete this.dom[a], T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function i(t) {
    this.dom = t;
    const s = t.getAttribute(y);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", s), this._onClick = function(c) {
      if (c.ctrlKey || c.metaKey || c.button === 1) return;
      c.preventDefault();
      const u = document.getElementById(s);
      !u || !u[a] || u[a].toggle(t);
    }, t.addEventListener("click", this._onClick), this;
  }
  i.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, B(p, a, e, "ln-popover", {
    onAttributeChange: function(t) {
      const s = t[a];
      if (!s) return;
      const u = t.getAttribute(p) === "open";
      if (u !== s.isOpen)
        if (u) {
          if (z(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: s.trigger
          }).defaultPrevented) {
            t.setAttribute(p, "closed");
            return;
          }
          s._applyOpen(s.trigger);
        } else {
          if (z(t, "ln-popover:before-close", {
            popoverId: t.id,
            target: t,
            trigger: s.trigger
          }).defaultPrevented) {
            t.setAttribute(p, "open");
            return;
          }
          s._applyClose();
        }
    }
  }), B(y, a + "Trigger", i, "ln-popover-trigger");
})();
(function() {
  const p = "data-ln-tooltip-enhance", a = "data-ln-tooltip", y = "data-ln-tooltip-position", _ = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[_] !== void 0) return;
  let b = 0, l = null, n = null, e = null, i = null, t = null;
  function s() {
    return l && l.parentNode || (l = document.getElementById(g), l || (l = document.createElement("div"), l.id = g, document.body.appendChild(l))), l;
  }
  function c() {
    t || (t = function(r) {
      r.key === "Escape" && d();
    }, document.addEventListener("keydown", t));
  }
  function u() {
    t && (document.removeEventListener("keydown", t), t = null);
  }
  function o(r) {
    if (e === r) return;
    d();
    const h = r.getAttribute(a) || r.getAttribute("title");
    if (!h) return;
    s(), r.hasAttribute("title") && (i = r.getAttribute("title"), r.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = h, r[_ + "Uid"] || (b += 1, r[_ + "Uid"] = "ln-tooltip-" + b), v.id = r[_ + "Uid"], l.appendChild(v);
    const w = v.offsetWidth, E = v.offsetHeight, A = r.getBoundingClientRect(), k = r.getAttribute(y) || "top", I = ft(A, { width: w, height: E }, k, 6);
    v.style.top = I.top + "px", v.style.left = I.left + "px", v.setAttribute("data-ln-tooltip-placement", I.placement), r.setAttribute("aria-describedby", v.id), n = v, e = r, c();
  }
  function d() {
    if (!n) {
      u();
      return;
    }
    e && (e.removeAttribute("aria-describedby"), i !== null && e.setAttribute("title", i)), i = null, n.parentNode && n.parentNode.removeChild(n), n = null, e = null, u();
  }
  function m(r) {
    return this.dom = r, this._onEnter = function() {
      o(r);
    }, this._onLeave = function() {
      e === r && d();
    }, this._onFocus = function() {
      o(r);
    }, this._onBlur = function() {
      e === r && d();
    }, r.addEventListener("mouseenter", this._onEnter), r.addEventListener("mouseleave", this._onLeave), r.addEventListener("focus", this._onFocus, !0), r.addEventListener("blur", this._onBlur, !0), this;
  }
  m.prototype.destroy = function() {
    const r = this.dom;
    r.removeEventListener("mouseenter", this._onEnter), r.removeEventListener("mouseleave", this._onLeave), r.removeEventListener("focus", this._onFocus, !0), r.removeEventListener("blur", this._onBlur, !0), e === r && d(), delete r[_], delete r[_ + "Uid"], T(r, "ln-tooltip:destroyed", { trigger: r });
  }, B(
    "[" + p + "], [" + a + "][title]",
    _,
    m,
    "ln-tooltip"
  );
})();
const It = `<li class="ln-toast__item">
	<div class="ln-toast__card" data-ln-attr="role:role, aria-live:ariaLive">
		<div class="ln-toast__side">
			<svg class="ln-icon" aria-hidden="true"><use href=""></use></svg>
		</div>
		<div class="ln-toast__content">
			<div class="ln-toast__head">
				<strong class="ln-toast__title" data-ln-field="title"></strong>
			</div>
			<button type="button" class="ln-toast__close" aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>
			<div class="ln-toast__body" data-ln-show="hasBody"></div>
		</div>
	</div>
</li>
`;
(function() {
  const p = "data-ln-toast", a = "lnToast", y = "ln-toast-item", _ = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, g = { success: "success", error: "error", warn: "warning", info: "info" }, b = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function l() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const r = document.createElement("template");
    r.setAttribute("data-ln-template", "ln-toast-item"), r.innerHTML = It, document.body.appendChild(r);
  }
  function n(r) {
    if (!r || r.nodeType !== 1) return;
    const h = Array.from(r.querySelectorAll("[" + p + "]"));
    r.hasAttribute && r.hasAttribute(p) && h.push(r);
    for (const v of h)
      v[a] || new e(v);
  }
  function e(r) {
    this.dom = r, r[a] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    for (const h of Array.from(r.querySelectorAll("[data-ln-toast-item]")))
      o(h, r);
    return this;
  }
  e.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const r of Array.from(this.dom.children))
        c(r);
      delete this.dom[a];
    }
  };
  function i(r, h) {
    const v = ((r.type || "info") + "").toLowerCase(), w = ot(h, y, "ln-toast");
    if (!w)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    const E = w.firstElementChild;
    if (!E) return null;
    const A = !!(r.message || r.data && r.data.errors);
    J(E, {
      title: r.title || b[v] || b.info,
      role: v === "error" ? "alert" : "status",
      ariaLive: v === "error" ? "assertive" : "polite",
      hasBody: A
    });
    const k = E.querySelector(".ln-toast__card");
    k && k.classList.add(g[v] || "info");
    const I = E.querySelector(".ln-toast__side");
    if (I) {
      const M = I.querySelector("use");
      M && M.setAttribute("href", "#ln-" + (_[v] || _.info));
    }
    const q = E.querySelector(".ln-toast__body");
    q && A && t(q, r);
    const D = E.querySelector(".ln-toast__close");
    return D && D.addEventListener("click", function() {
      c(E);
    }), E;
  }
  function t(r, h) {
    if (h.message)
      if (Array.isArray(h.message)) {
        const v = document.createElement("ul");
        for (const w of h.message) {
          const E = document.createElement("li");
          E.textContent = w, v.appendChild(E);
        }
        r.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = h.message, r.appendChild(v);
      }
    if (h.data && h.data.errors) {
      const v = document.createElement("ul");
      for (const w of Object.values(h.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = w, v.appendChild(E);
      }
      r.appendChild(v);
    }
  }
  function s(r, h) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(h), requestAnimationFrame(() => h.classList.add("ln-toast__item--in"));
  }
  function c(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function u(r) {
    let h = r && r.container;
    return typeof h == "string" && (h = document.querySelector(h)), h instanceof HTMLElement || (h = document.querySelector("[" + p + "]") || document.getElementById("ln-toast-container")), h || null;
  }
  function o(r, h) {
    const v = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), w = r.getAttribute("data-title"), E = (r.innerText || r.textContent || "").trim(), A = i({
      type: v,
      title: w,
      message: E || void 0
    }, h);
    A && (r.parentNode && r.parentNode.replaceChild(A, r), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function d(r) {
    const h = r.detail || {}, v = u(h);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const w = v[a] || new e(v), E = i(h, v);
    if (!E) return;
    const A = Number.isFinite(h.timeout) ? h.timeout : w.timeoutDefault;
    s(w, E), A > 0 && (E._timer = setTimeout(() => c(E), A));
  }
  function m(r) {
    const h = r && r.detail || {};
    if (h.container) {
      const v = u(h);
      if (v)
        for (const w of Array.from(v.children)) c(w);
    } else {
      const v = document.querySelectorAll("[" + p + "]");
      for (const w of Array.from(v))
        for (const E of Array.from(w.children)) c(E);
    }
  }
  W(function() {
    l(), window.addEventListener("ln-toast:enqueue", d), window.addEventListener("ln-toast:clear", m), new MutationObserver(function(h) {
      for (const v of h) {
        if (v.type === "attributes") {
          n(v.target);
          continue;
        }
        for (const w of v.addedNodes)
          n(w);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [p] }), n(document.body);
  }, "ln-toast");
})();
(function() {
  const p = "data-ln-upload", a = "lnUpload", y = "data-ln-upload-dict", _ = "data-ln-upload-accept", g = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function l() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const o = document.createElement("div");
    o.innerHTML = b;
    const d = o.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[a] !== void 0) return;
  function n(o) {
    if (o === 0) return "0 B";
    const d = 1024, m = ["B", "KB", "MB", "GB"], r = Math.floor(Math.log(o) / Math.log(d));
    return parseFloat((o / Math.pow(d, r)).toFixed(1)) + " " + m[r];
  }
  function e(o) {
    return o.split(".").pop().toLowerCase();
  }
  function i(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "lnc-file-" + o : "ln-file";
  }
  function t(o, d) {
    if (!d) return !0;
    const m = "." + e(o.name);
    return d.split(",").map(function(h) {
      return h.trim().toLowerCase();
    }).includes(m.toLowerCase());
  }
  function s(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true"), l();
    const d = Ct(o, y), m = o.querySelector(".ln-upload__zone"), r = o.querySelector(".ln-upload__list"), h = o.getAttribute(_) || "";
    if (!m || !r) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", o);
      return;
    }
    let v = o.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), h && (v.accept = h.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), o.appendChild(v));
    const w = o.getAttribute(p) || "/files/upload", E = o.getAttribute(g) || "", A = /* @__PURE__ */ new Map();
    let k = 0;
    function I() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function q(R) {
      if (!t(R, h)) {
        const C = d["invalid-type"];
        T(o, "ln-upload:invalid", {
          file: R,
          message: C
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: d["invalid-title"] || "Invalid File",
          message: C || d["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++k, U = e(R.name), X = i(U), ct = ot(o, "ln-upload-item", "ln-upload");
      if (!ct) return;
      const K = ct.firstElementChild;
      if (!K) return;
      K.setAttribute("data-file-id", P), J(K, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + X,
        removeLabel: d.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const st = K.querySelector(".ln-upload__progress-bar"), f = K.querySelector('[data-ln-upload-action="remove"]');
      f && (f.disabled = !0), r.appendChild(K);
      const L = new FormData();
      L.append("file", R), L.append("context", E);
      const S = new XMLHttpRequest();
      S.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const x = Math.round(C.loaded / C.total * 100);
          st.style.width = x + "%", J(K, { sizeText: x + "%" });
        }
      }), S.addEventListener("load", function() {
        if (S.status >= 200 && S.status < 300) {
          let C;
          try {
            C = JSON.parse(S.responseText);
          } catch {
            O("Invalid response");
            return;
          }
          J(K, { sizeText: n(C.size || R.size), uploading: !1 }), f && (f.disabled = !1), A.set(P, {
            serverId: C.id,
            name: C.name,
            size: C.size
          }), D(), T(o, "ln-upload:uploaded", {
            localId: P,
            serverId: C.id,
            name: C.name
          });
        } else {
          let C = d["upload-failed"] || "Upload failed";
          try {
            C = JSON.parse(S.responseText).message || C;
          } catch {
          }
          O(C);
        }
      }), S.addEventListener("error", function() {
        O(d["network-error"] || "Network error");
      });
      function O(C) {
        st && (st.style.width = "100%"), J(K, { sizeText: d.error || "Error", uploading: !1, error: !0 }), f && (f.disabled = !1), T(o, "ln-upload:error", {
          file: R,
          message: C
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: d["error-title"] || "Upload Error",
          message: C || d["upload-failed"] || "Failed to upload file"
        });
      }
      S.open("POST", w), S.setRequestHeader("X-CSRF-TOKEN", I()), S.setRequestHeader("Accept", "application/json"), S.send(L);
    }
    function D() {
      for (const R of o.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const P = document.createElement("input");
        P.type = "hidden", P.name = "file_ids[]", P.value = R.serverId, o.appendChild(P);
      }
    }
    function M(R) {
      const P = A.get(R), U = r.querySelector('[data-file-id="' + R + '"]');
      if (!P || !P.serverId) {
        U && U.remove(), A.delete(R), D();
        return;
      }
      U && J(U, { deleting: !0 }), fetch("/files/" + P.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": I(),
          Accept: "application/json"
        }
      }).then(function(X) {
        X.status === 200 ? (U && U.remove(), A.delete(R), D(), T(o, "ln-upload:removed", {
          localId: R,
          serverId: P.serverId
        })) : (U && J(U, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: d["delete-title"] || "Error",
          message: d["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(X) {
        console.warn("[ln-upload] Delete error:", X), U && J(U, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: d["network-error"] || "Network error",
          message: d["connection-error"] || "Could not connect to server"
        });
      });
    }
    function H(R) {
      for (const P of R)
        q(P);
      v.value = "";
    }
    const V = function() {
      v.click();
    }, Q = function() {
      H(this.files);
    }, Z = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, Y = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.remove("ln-upload__zone--dragover");
    }, it = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.remove("ln-upload__zone--dragover"), H(R.dataTransfer.files);
    }, rt = function(R) {
      const P = R.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !r.contains(P) || P.disabled) return;
      const U = P.closest(".ln-upload__item");
      U && M(U.getAttribute("data-file-id"));
    };
    m.addEventListener("click", V), v.addEventListener("change", Q), m.addEventListener("dragenter", Z), m.addEventListener("dragover", Y), m.addEventListener("dragleave", nt), m.addEventListener("drop", it), r.addEventListener("click", rt), o.lnUploadAPI = {
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
              "X-CSRF-TOKEN": I(),
              Accept: "application/json"
            }
          });
        A.clear(), r.innerHTML = "", D(), T(o, "ln-upload:cleared", {});
      },
      destroy: function() {
        m.removeEventListener("click", V), v.removeEventListener("change", Q), m.removeEventListener("dragenter", Z), m.removeEventListener("dragover", Y), m.removeEventListener("dragleave", nt), m.removeEventListener("drop", it), r.removeEventListener("click", rt), A.clear(), r.innerHTML = "", D(), o.removeAttribute("data-ln-upload-initialized"), delete o.lnUploadAPI;
      }
    };
  }
  function c() {
    for (const o of document.querySelectorAll("[" + p + "]"))
      s(o);
  }
  function u() {
    W(function() {
      new MutationObserver(function(d) {
        for (const m of d)
          if (m.type === "childList") {
            for (const r of m.addedNodes)
              if (r.nodeType === 1) {
                r.hasAttribute(p) && s(r);
                for (const h of r.querySelectorAll("[" + p + "]"))
                  s(h);
              }
          } else m.type === "attributes" && m.target.hasAttribute(p) && s(m.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: s,
    initAll: c
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const p = "lnExternalLinks";
  if (window[p] !== void 0) return;
  function a(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function y(n) {
    if (n.getAttribute("data-ln-external-link") === "processed" || !a(n)) return;
    n.target = "_blank";
    const e = (n.rel || "").split(/\s+/).filter(Boolean);
    e.includes("noopener") || e.push("noopener"), e.includes("noreferrer") || e.push("noreferrer"), n.rel = e.join(" ");
    const i = document.createElement("span");
    i.className = "sr-only", i.textContent = "(opens in new tab)", n.appendChild(i), n.setAttribute("data-ln-external-link", "processed"), T(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    });
  }
  function _(n) {
    n = n || document.body;
    for (const e of n.querySelectorAll("a, area"))
      y(e);
  }
  function g() {
    W(function() {
      document.body.addEventListener("click", function(n) {
        const e = n.target.closest("a, area");
        e && e.getAttribute("data-ln-external-link") === "processed" && T(e, "ln-external-links:clicked", {
          link: e,
          href: e.href,
          text: e.textContent || e.title || ""
        });
      });
    }, "ln-external-links");
  }
  function b() {
    W(function() {
      new MutationObserver(function(e) {
        for (const i of e) {
          if (i.type === "childList") {
            for (const t of i.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && y(t), t.querySelectorAll))
                for (const s of t.querySelectorAll("a, area"))
                  y(s);
          }
          if (i.type === "attributes" && i.attributeName === "href") {
            const t = i.target;
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
  function l() {
    g(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      _();
    }) : _();
  }
  window[p] = {
    process: _
  }, l();
})();
(function() {
  const p = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
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
  function l(r, h) {
    if (h.target.closest("a, button, input, select, textarea")) return;
    const v = r.querySelector("a");
    if (!v) return;
    const w = v.getAttribute("href");
    if (!w) return;
    if (h.ctrlKey || h.metaKey || h.button === 1) {
      window.open(w, "_blank");
      return;
    }
    z(r, "ln-link:navigate", { target: r, href: w, link: v }).defaultPrevented || v.click();
  }
  function n(r) {
    const h = r.querySelector("a");
    if (!h) return;
    const v = h.getAttribute("href");
    v && g(v);
  }
  function e() {
    b();
  }
  function i(r) {
    r[a + "Row"] || (r[a + "Row"] = !0, r.querySelector("a") && (r._lnLinkClick = function(h) {
      l(r, h);
    }, r._lnLinkEnter = function() {
      n(r);
    }, r.addEventListener("click", r._lnLinkClick), r.addEventListener("mouseenter", r._lnLinkEnter), r.addEventListener("mouseleave", e)));
  }
  function t(r) {
    r[a + "Row"] && (r._lnLinkClick && r.removeEventListener("click", r._lnLinkClick), r._lnLinkEnter && r.removeEventListener("mouseenter", r._lnLinkEnter), r.removeEventListener("mouseleave", e), delete r._lnLinkClick, delete r._lnLinkEnter, delete r[a + "Row"]);
  }
  function s(r) {
    if (!r[a + "Init"]) return;
    const h = r.tagName;
    if (h === "TABLE" || h === "TBODY") {
      const v = h === "TABLE" && r.querySelector("tbody") || r;
      for (const w of v.querySelectorAll("tr"))
        t(w);
    } else
      t(r);
    delete r[a + "Init"];
  }
  function c(r) {
    if (r[a + "Init"]) return;
    r[a + "Init"] = !0;
    const h = r.tagName;
    if (h === "TABLE" || h === "TBODY") {
      const v = h === "TABLE" && r.querySelector("tbody") || r;
      for (const w of v.querySelectorAll("tr"))
        i(w);
    } else
      i(r);
  }
  function u(r) {
    r.hasAttribute && r.hasAttribute(p) && c(r);
    const h = r.querySelectorAll ? r.querySelectorAll("[" + p + "]") : [];
    for (const v of h)
      c(v);
  }
  function o() {
    W(function() {
      new MutationObserver(function(h) {
        for (const v of h)
          if (v.type === "childList")
            for (const w of v.addedNodes)
              w.nodeType === 1 && (u(w), w.tagName === "TR" && w.closest("[" + p + "]") && i(w));
          else v.type === "attributes" && u(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [p]
      });
    }, "ln-link");
  }
  function d(r) {
    u(r);
  }
  window[a] = { init: d, destroy: s };
  function m() {
    _(), o(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", m) : m();
})();
(function() {
  const p = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function y(i) {
    _(i);
  }
  function _(i) {
    const t = Array.from(i.querySelectorAll(p));
    for (const s of t)
      s[a] || (s[a] = new g(s));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && !i[a] && (i[a] = new g(i));
  }
  function g(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, e.call(this), l.call(this), n.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function b() {
    W(function() {
      new MutationObserver(function(t) {
        for (const s of t)
          if (s.type === "childList")
            for (const c of s.addedNodes)
              c.nodeType === 1 && _(c);
          else s.type === "attributes" && _(s.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  b();
  function l() {
    const i = this, t = new MutationObserver(function(s) {
      for (const c of s)
        (c.attributeName === "data-ln-progress" || c.attributeName === "data-ln-progress-max") && e.call(i);
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = t;
  }
  function n() {
    const i = this, t = this.dom.parentElement;
    if (!t || !t.hasAttribute("data-ln-progress-max")) return;
    const s = new MutationObserver(function(c) {
      for (const u of c)
        u.attributeName === "data-ln-progress-max" && e.call(i);
    });
    s.observe(t, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = s;
  }
  function e() {
    const i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = this.dom.parentElement, c = (t && t.hasAttribute("data-ln-progress-max") ? parseFloat(t.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = c > 0 ? i / c * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const o = Math.max(0, Math.min(i, c));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(c)), this.dom.setAttribute("aria-valuenow", String(o)), T(this.dom, "ln-progress:change", { target: this.dom, value: i, max: c, percentage: u });
  }
  window[a] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const p = "data-ln-filter", a = "lnFilter", y = "data-ln-filter-initialized", _ = "data-ln-filter-key", g = "data-ln-filter-value", b = "data-ln-filter-hide", l = "data-ln-filter-reset", n = "data-ln-filter-col", e = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function i(o) {
    return o.hasAttribute(l) || o.getAttribute(g) === "";
  }
  function t(o) {
    let d = null;
    const m = [];
    for (let r = 0; r < o.inputs.length; r++) {
      const h = o.inputs[r];
      if (h.checked && !i(h)) {
        d === null && (d = h.getAttribute(_));
        const v = h.getAttribute(g);
        v && m.push(v);
      }
    }
    return { key: d, values: m };
  }
  function s(o, d) {
    if (o.length !== d.length) return !0;
    for (let m = 0; m < o.length; m++) if (o[m] !== d[m]) return !0;
    return !1;
  }
  function c(o) {
    const d = o.dom, m = o.colIndex, r = d.querySelector("template");
    if (!r || m === null) return;
    const h = document.getElementById(o.targetId);
    if (!h) return;
    const v = h.tagName === "TABLE" ? h : h.querySelector("table");
    if (!v || h.hasAttribute("data-ln-table")) return;
    const w = {}, E = [], A = v.tBodies;
    for (let q = 0; q < A.length; q++) {
      const D = A[q].rows;
      for (let M = 0; M < D.length; M++) {
        const H = D[M].cells[m], V = H ? H.textContent.trim() : "";
        V && !w[V] && (w[V] = !0, E.push(V));
      }
    }
    E.sort(function(q, D) {
      return q.localeCompare(D);
    });
    const k = d.querySelector("[" + _ + "]"), I = k ? k.getAttribute(_) : d.getAttribute("data-ln-filter-key") || "col" + m;
    for (let q = 0; q < E.length; q++) {
      const D = r.content.cloneNode(!0), M = D.querySelector("input");
      M && (M.setAttribute(_, I), M.setAttribute(g, E[q]), Tt(D, { text: E[q] }), d.appendChild(D));
    }
  }
  function u(o) {
    if (o.hasAttribute(y)) return this;
    this.dom = o, this.targetId = o.getAttribute(p);
    const d = o.getAttribute(n);
    this.colIndex = d !== null ? parseInt(d, 10) : null, c(this), this.inputs = Array.from(o.querySelectorAll("[" + _ + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(_) : null, this._lastSnapshot = null;
    const m = this, r = kt(
      function() {
        m._render();
      },
      function() {
        m._afterRender();
      }
    );
    this._queueRender = r, this._attachHandlers();
    let h = !1;
    if (o.hasAttribute("data-ln-persist")) {
      const v = ht("filter", o);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let w = 0; w < this.inputs.length; w++) {
          const E = this.inputs[w];
          i(E) ? E.checked = !1 : E.getAttribute(_) === v.key && v.values.indexOf(E.getAttribute(g)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        r(), h = !0;
      }
    }
    if (!h) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !i(this.inputs[v])) {
          r();
          break;
        }
    }
    return o.setAttribute(y, ""), this;
  }
  u.prototype._attachHandlers = function() {
    const o = this;
    this.inputs.forEach(function(d) {
      d[a + "Bound"] || (d[a + "Bound"] = !0, d._lnFilterChange = function() {
        if (i(d)) {
          for (let m = 0; m < o.inputs.length; m++)
            i(o.inputs[m]) || (o.inputs[m].checked = !1);
          d.checked = !0, o._queueRender();
          return;
        }
        if (d.checked)
          for (let m = 0; m < o.inputs.length; m++)
            i(o.inputs[m]) && (o.inputs[m].checked = !1);
        else {
          let m = !1;
          for (let r = 0; r < o.inputs.length; r++)
            if (!i(o.inputs[r]) && o.inputs[r].checked) {
              m = !0;
              break;
            }
          if (!m)
            for (let r = 0; r < o.inputs.length; r++)
              i(o.inputs[r]) && (o.inputs[r].checked = !0);
        }
        o._queueRender();
      }, d.addEventListener("change", d._lnFilterChange));
    });
  }, u.prototype._render = function() {
    const o = this, d = t(this), m = d.key === null || d.values.length === 0, r = [];
    for (let h = 0; h < d.values.length; h++)
      r.push(d.values[h].toLowerCase());
    if (o.colIndex !== null)
      o._filterTableRows(d);
    else {
      const h = document.getElementById(o.targetId);
      if (!h) return;
      const v = h.children;
      for (let w = 0; w < v.length; w++) {
        const E = v[w];
        if (m) {
          E.removeAttribute(b);
          continue;
        }
        const A = E.getAttribute("data-" + d.key);
        E.removeAttribute(b), A !== null && r.indexOf(A.toLowerCase()) === -1 && E.setAttribute(b, "true");
      }
    }
  }, u.prototype._afterRender = function() {
    const o = t(this), d = this._lastSnapshot;
    if (!d || d.key !== o.key || s(d.values, o.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: o.key,
        values: o.values.slice()
      });
      const r = d && d.values.length > 0, h = o.values.length === 0;
      r && h && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: o.key, values: o.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (o.key && o.values.length > 0 ? et("filter", this.dom, { key: o.key, values: o.values.slice() }) : et("filter", this.dom, null));
  }, u.prototype._dispatchOnBoth = function(o, d) {
    T(this.dom, o, d);
    const m = document.getElementById(this.targetId);
    m && m !== this.dom && T(m, o, d);
  }, u.prototype._filterTableRows = function(o) {
    const d = document.getElementById(this.targetId);
    if (!d) return;
    const m = d.tagName === "TABLE" ? d : d.querySelector("table");
    if (!m || d.hasAttribute("data-ln-table")) return;
    const r = o.key || this._filterKey, h = o.values;
    e.has(m) || e.set(m, {});
    const v = e.get(m);
    if (r && h.length > 0) {
      const k = [];
      for (let I = 0; I < h.length; I++)
        k.push(h[I].toLowerCase());
      v[r] = { col: this.colIndex, values: k };
    } else r && delete v[r];
    const w = Object.keys(v), E = w.length > 0, A = m.tBodies;
    for (let k = 0; k < A.length; k++) {
      const I = A[k].rows;
      for (let q = 0; q < I.length; q++) {
        const D = I[q];
        if (!E) {
          D.removeAttribute(b);
          continue;
        }
        let M = !0;
        for (let H = 0; H < w.length; H++) {
          const V = v[w[H]], Q = D.cells[V.col], Z = Q ? Q.textContent.trim().toLowerCase() : "";
          if (V.values.indexOf(Z) === -1) {
            M = !1;
            break;
          }
        }
        M ? D.removeAttribute(b) : D.setAttribute(b, "true");
      }
    }
  }, u.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.colIndex !== null) {
        const o = document.getElementById(this.targetId);
        if (o) {
          const d = o.tagName === "TABLE" ? o : o.querySelector("table");
          if (d && e.has(d)) {
            const m = e.get(d), r = this._filterKey;
            r && m[r] && delete m[r], Object.keys(m).length === 0 && e.delete(d);
          }
        }
      }
      this.inputs.forEach(function(o) {
        o._lnFilterChange && (o.removeEventListener("change", o._lnFilterChange), delete o._lnFilterChange), delete o[a + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[a];
    }
  }, B(p, a, u, "ln-filter");
})();
(function() {
  const p = "data-ln-search", a = "lnSearch", y = "data-ln-search-initialized", _ = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function b(l) {
    if (l.hasAttribute(y)) return this;
    this.dom = l, this.targetId = l.getAttribute(p);
    const n = l.tagName;
    if (this.input = n === "INPUT" || n === "TEXTAREA" ? l : l.querySelector('[name="search"]') || l.querySelector('input[type="search"]') || l.querySelector('input[type="text"]'), this.itemsSelector = l.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const e = this;
      queueMicrotask(function() {
        e._search(e.input.value.trim().toLowerCase());
      });
    }
    return l.setAttribute(y, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const l = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      l.input.value = "", l._search(""), l.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(l._debounceTimer), l._debounceTimer = setTimeout(function() {
        l._search(l.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(l) {
    const n = document.getElementById(this.targetId);
    if (!n || z(n, "ln-search:change", { term: l, targetId: this.targetId }).defaultPrevented) return;
    const i = this.itemsSelector ? n.querySelectorAll(this.itemsSelector) : n.children;
    for (let t = 0; t < i.length; t++) {
      const s = i[t];
      s.removeAttribute(_), l && !s.textContent.replace(/\s+/g, " ").toLowerCase().includes(l) && s.setAttribute(_, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[a]);
  }, B(p, a, b, "ln-search");
})();
(function() {
  const p = "lnTableSort", a = "data-ln-sort", y = "data-ln-sort-active";
  if (window[p] !== void 0) return;
  function _(e) {
    g(e);
  }
  function g(e) {
    const i = Array.from(e.querySelectorAll("table"));
    e.tagName === "TABLE" && i.push(e), i.forEach(function(t) {
      if (t[p]) return;
      const s = Array.from(t.querySelectorAll("th[" + a + "]"));
      s.length && (t[p] = new l(t, s));
    });
  }
  function b(e, i) {
    e.querySelectorAll("[data-ln-sort-icon]").forEach(function(s) {
      const c = s.getAttribute("data-ln-sort-icon");
      i == null ? s.classList.toggle("hidden", c !== null && c !== "") : s.classList.toggle("hidden", c !== i);
    });
  }
  function l(e, i) {
    this.table = e, this.ths = i, this._col = -1, this._dir = null;
    const t = this;
    i.forEach(function(c, u) {
      c[p + "Bound"] || (c[p + "Bound"] = !0, c._lnSortClick = function(o) {
        const d = o.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        d && d !== c || t._handleClick(u, c);
      }, c.addEventListener("click", c._lnSortClick));
    });
    const s = e.closest("[data-ln-table][data-ln-persist]");
    if (s) {
      const c = ht("table-sort", s);
      c && c.dir && c.col >= 0 && c.col < i.length && (this._handleClick(c.col, i[c.col]), c.dir === "desc" && this._handleClick(c.col, i[c.col]));
    }
    return this;
  }
  l.prototype._handleClick = function(e, i) {
    let t;
    this._col !== e ? t = "asc" : this._dir === "asc" ? t = "desc" : this._dir === "desc" ? t = null : t = "asc", this.ths.forEach(function(c) {
      c.removeAttribute(y), b(c, null);
    }), t === null ? (this._col = -1, this._dir = null) : (this._col = e, this._dir = t, i.setAttribute(y, t), b(i, t)), T(this.table, "ln-table:sort", {
      column: e,
      sortType: i.getAttribute(a),
      direction: t
    });
    const s = this.table.closest("[data-ln-table][data-ln-persist]");
    s && (t === null ? et("table-sort", s, null) : et("table-sort", s, { col: e, dir: t }));
  }, l.prototype.destroy = function() {
    this.table[p] && (this.ths.forEach(function(e) {
      e._lnSortClick && (e.removeEventListener("click", e._lnSortClick), delete e._lnSortClick), delete e[p + "Bound"];
    }), delete this.table[p]);
  };
  function n() {
    W(function() {
      new MutationObserver(function(i) {
        i.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(s) {
            s.nodeType === 1 && g(s);
          }) : t.type === "attributes" && g(t.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
    }, "ln-table-sort");
  }
  window[p] = _, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const p = "data-ln-table", a = "lnTable", y = "data-ln-sort", _ = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const l = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function n(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("tbody"), this.thead = e.querySelector("thead");
    const i = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = i ? Array.from(i.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const t = this;
    return this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(s) {
      s.preventDefault(), t._searchTerm = s.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch), this._onSort = function(s) {
      t._sortCol = s.detail.direction === null ? -1 : s.detail.column, t._sortDir = s.detail.direction, t._sortType = s.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:sorted", {
        column: s.detail.column,
        direction: s.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(s) {
      const c = s.detail.key;
      let u = !1;
      for (let m = 0; m < t.ths.length; m++)
        if (t.ths[m].getAttribute("data-ln-filter-col") === c) {
          u = !0;
          break;
        }
      if (!u) return;
      const o = s.detail.values;
      if (!o || o.length === 0)
        delete t._columnFilters[c];
      else {
        const m = [];
        for (let r = 0; r < o.length; r++)
          m.push(o[r].toLowerCase());
        t._columnFilters[c] = m;
      }
      const d = t.dom.querySelector('th[data-ln-filter-col="' + c + '"]');
      d && (o && o.length > 0 ? d.setAttribute("data-ln-filter-active", "") : d.removeAttribute("data-ln-filter-active")), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(s) {
      if (!s.target.closest("[data-ln-table-clear]")) return;
      t._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + e.id + '"]');
      if (u) {
        const d = u.tagName === "INPUT" ? u : u.querySelector("input");
        d && (d.value = "");
      }
      t._columnFilters = {};
      for (let d = 0; d < t.ths.length; d++)
        t.ths[d].removeAttribute("data-ln-filter-active");
      const o = document.querySelectorAll('[data-ln-filter="' + e.id + '"]');
      for (let d = 0; d < o.length; d++) {
        const m = o[d].querySelector("[data-ln-filter-reset]");
        m && (m.checked = !0, m.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
      t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: "",
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("click", this._onClear), this;
  }
  n.prototype._parseRows = function() {
    const e = this.tbody.rows, i = this.ths;
    this._data = [];
    const t = [];
    for (let s = 0; s < i.length; s++)
      t[s] = i[s].getAttribute(y);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let s = 0; s < e.length; s++) {
      const c = e[s], u = [], o = [], d = [];
      for (let m = 0; m < c.cells.length; m++) {
        const r = c.cells[m], h = r.textContent.trim(), v = r.hasAttribute("data-ln-value") ? r.getAttribute("data-ln-value") : h, w = t[m];
        o[m] = h.toLowerCase(), w === "number" || w === "date" ? u[m] = parseFloat(v) || 0 : w === "string" ? u[m] = String(v) : u[m] = null, m < c.cells.length - 1 && d.push(h.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: o,
        html: c.outerHTML,
        searchText: d.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    const e = this._searchTerm, i = this._columnFilters, t = Object.keys(i).length > 0, s = this.ths, c = {};
    if (t)
      for (let r = 0; r < s.length; r++) {
        const h = s[r].getAttribute("data-ln-filter-col");
        h && (c[h] = r);
      }
    if (!e && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(r) {
      if (e && r.searchText.indexOf(e) === -1) return !1;
      if (t)
        for (const h in i) {
          const v = c[h];
          if (v !== void 0 && i[h].indexOf(r.rawTexts[v]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, o = this._sortDir === "desc" ? -1 : 1, d = this._sortType === "number" || this._sortType === "date", m = l ? l.compare : function(r, h) {
      return r < h ? -1 : r > h ? 1 : 0;
    };
    this._filteredData.sort(function(r, h) {
      const v = r.sortKeys[u], w = h.sortKeys[u];
      return d ? (v - w) * o : m(v, w) * o;
    });
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const e = document.createElement("colgroup");
    this.ths.forEach(function(i) {
      const t = document.createElement("col");
      t.style.width = i.offsetWidth + "px", e.appendChild(t);
    }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
  }, n.prototype._render = function() {
    if (!this.tbody) return;
    const e = this._filteredData.length;
    e === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, n.prototype._renderAll = function() {
    const e = [], i = this._filteredData;
    for (let t = 0; t < i.length; t++) e.push(i[t].html);
    this.tbody.innerHTML = e.join("");
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const e = this;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const e = this._filteredData, i = e.length, t = this._rowHeight;
    if (!t || !i) return;
    const c = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, o = c + u, d = window.scrollY - o, m = Math.max(0, Math.floor(d / t) - 15), r = Math.min(m + Math.ceil(window.innerHeight / t) + 30, i);
    if (m === this._vStart && r === this._vEnd) return;
    this._vStart = m, this._vEnd = r;
    const h = this.ths.length || 1, v = m * t, w = (i - r) * t;
    let E = "";
    v > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + h + '" style="height:' + v + 'px;padding:0;border:none"></td></tr>');
    for (let A = m; A < r; A++) E += e[A].html;
    w > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + h + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = E;
  }, n.prototype._showEmptyState = function() {
    const e = this.ths.length || 1, i = this.dom.querySelector("template[" + _ + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(e)), i && t.appendChild(document.importNode(i.content, !0));
    const s = document.createElement("tr");
    s.className = "ln-table__empty", s.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(s), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(p, a, n, "ln-table");
})();
(function() {
  const p = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", _ = 36, g = 16, b = 2 * Math.PI * g;
  function l(s) {
    return this.dom = s, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, e.call(this), t.call(this), i.call(this), s.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  l.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function n(s, c) {
    const u = document.createElementNS(y, s);
    for (const o in c)
      u.setAttribute(o, c[o]);
    return u;
  }
  function e() {
    this.svg = n("svg", {
      viewBox: "0 0 " + _ + " " + _,
      "aria-hidden": "true"
    }), this.trackCircle = n("circle", {
      cx: _ / 2,
      cy: _ / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
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
  function i() {
    const s = this, c = new MutationObserver(function(u) {
      for (const o of u)
        (o.attributeName === "data-ln-circular-progress" || o.attributeName === "data-ln-circular-progress-max") && t.call(s);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = c;
  }
  function t() {
    const s = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = c > 0 ? s / c * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const o = b - u / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", o);
    const d = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = d !== null ? d : Math.round(u) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: s,
      max: c,
      percentage: u
    });
  }
  B(p, a, l, "ln-circular-progress");
})();
(function() {
  const p = "data-ln-sortable", a = "lnSortable", y = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function _(b) {
    this.dom = b, this.isEnabled = b.getAttribute(p) !== "disabled", this._dragging = null, b.setAttribute("aria-roledescription", "sortable list");
    const l = this;
    return this._onPointerDown = function(n) {
      l.isEnabled && l._handlePointerDown(n);
    }, b.addEventListener("pointerdown", this._onPointerDown), this;
  }
  _.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(p, "");
  }, _.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(p, "disabled");
  }, _.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, _.prototype._handlePointerDown = function(b) {
    let l = b.target.closest("[" + y + "]"), n;
    if (l) {
      for (n = l; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (n = b.target; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
      l = n;
    }
    const i = Array.from(this.dom.children).indexOf(n);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: n,
      index: i
    }).defaultPrevented) return;
    b.preventDefault(), l.setPointerCapture(b.pointerId), this._dragging = n, n.classList.add("ln-sortable--dragging"), n.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: n,
      index: i
    });
    const s = this, c = function(o) {
      s._handlePointerMove(o);
    }, u = function(o) {
      s._handlePointerEnd(o), l.removeEventListener("pointermove", c), l.removeEventListener("pointerup", u), l.removeEventListener("pointercancel", u);
    };
    l.addEventListener("pointermove", c), l.addEventListener("pointerup", u), l.addEventListener("pointercancel", u);
  }, _.prototype._handlePointerMove = function(b) {
    if (!this._dragging) return;
    const l = Array.from(this.dom.children), n = this._dragging;
    for (const e of l)
      e.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const e of l) {
      if (e === n) continue;
      const i = e.getBoundingClientRect(), t = i.top + i.height / 2;
      if (b.clientY >= i.top && b.clientY < t) {
        e.classList.add("ln-sortable--drop-before");
        break;
      } else if (b.clientY >= t && b.clientY <= i.bottom) {
        e.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, _.prototype._handlePointerEnd = function(b) {
    if (!this._dragging) return;
    const l = this._dragging, n = Array.from(this.dom.children), e = n.indexOf(l);
    let i = null, t = null;
    for (const s of n) {
      if (s.classList.contains("ln-sortable--drop-before")) {
        i = s, t = "before";
        break;
      }
      if (s.classList.contains("ln-sortable--drop-after")) {
        i = s, t = "after";
        break;
      }
    }
    for (const s of n)
      s.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (l.classList.remove("ln-sortable--dragging"), l.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), i && i !== l) {
      t === "before" ? this.dom.insertBefore(l, i) : this.dom.insertBefore(l, i.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(l);
      T(this.dom, "ln-sortable:reordered", {
        item: l,
        oldIndex: e,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function g(b) {
    const l = b[a];
    if (!l) return;
    const n = b.getAttribute(p) !== "disabled";
    n !== l.isEnabled && (l.isEnabled = n, T(b, n ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: b }));
  }
  B(p, a, _, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const p = "data-ln-confirm", a = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function g(b) {
    this.dom = b, this.confirming = !1, this.originalText = b.textContent.trim(), this.confirmText = b.getAttribute(p) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const l = this;
    return this._onClick = function(n) {
      if (!l.confirming)
        n.preventDefault(), n.stopImmediatePropagation(), l._enterConfirm();
      else {
        if (l._submitted) return;
        l._submitted = !0, l._reset();
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
    const b = this, l = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      b._reset();
    }, l);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var b = this.dom.querySelector("svg.ln-icon use");
      b && this.originalIconHref && b.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, B(p, a, g, "ln-confirm");
})();
(function() {
  const p = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function _(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(p + "-default") || "", this.badgesEl = g.querySelector("[" + p + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = g.getAttribute(p + "-locales");
    if (this.locales = y, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const l = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && l.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && l.removeLanguage(n.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  _.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of g) {
      const l = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of l)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, _.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of g) {
      const l = b.getAttribute("data-ln-translatable-lang");
      l && l !== this.defaultLang && this.activeLanguages.add(l);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, _.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const g = this;
    let b = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      b++;
      const e = vt("ln-translations-menu-item", "ln-translations");
      if (!e) return;
      const i = e.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", n), i.textContent = this.locales[n], i.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(n));
      }), this.menuEl.appendChild(e);
    }
    const l = this.dom.querySelector("[" + p + "-add]");
    l && (l.style.display = b === 0 ? "none" : "");
  }, _.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(b) {
      const l = vt("ln-translations-badge", "ln-translations");
      if (!l) return;
      const n = l.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", b);
      const e = n.querySelector("span");
      e.textContent = g.locales[b] || b.toUpperCase();
      const i = n.querySelector("button");
      i.setAttribute("aria-label", "Remove " + (g.locales[b] || b.toUpperCase())), i.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.removeLanguage(b));
      }), g.badgesEl.appendChild(l);
    });
  }, _.prototype.addLanguage = function(g, b) {
    if (this.activeLanguages.has(g)) return;
    const l = this.locales[g] || g;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: l
    }).defaultPrevented) return;
    this.activeLanguages.add(g), b = b || {};
    const e = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const i of e) {
      const t = i.getAttribute("data-ln-translatable"), s = i.getAttribute("data-ln-translations-prefix") || "", c = i.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!c) continue;
      const u = c.cloneNode(!1);
      s ? u.name = s + "[trans][" + g + "][" + t + "]" : u.name = "trans[" + g + "][" + t + "]", u.value = b[t] !== void 0 ? b[t] : "", u.removeAttribute("id"), u.placeholder = l + " translation", u.setAttribute("data-ln-translatable-lang", g);
      const o = i.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = o.length > 0 ? o[o.length - 1] : c;
      d.parentNode.insertBefore(u, d.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: l
    });
  }, _.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const l = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const n of l)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, _.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, _.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    const g = this.defaultLang, b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const l of b)
      l.getAttribute("data-ln-translatable-lang") !== g && l.parentNode.removeChild(l);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, B(p, a, _, "ln-translations");
})();
(function() {
  const p = "data-ln-autosave", a = "lnAutosave", y = "data-ln-autosave-clear", _ = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[a] !== void 0) return;
  function l(t) {
    const s = n(t);
    if (!s) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = s;
    let c = null;
    function u() {
      const r = Et(t);
      try {
        localStorage.setItem(s, JSON.stringify(r));
      } catch {
        return;
      }
      T(t, "ln-autosave:saved", { target: t, data: r });
    }
    function o() {
      let r;
      try {
        r = localStorage.getItem(s);
      } catch {
        return;
      }
      if (!r) return;
      let h;
      try {
        h = JSON.parse(r);
      } catch {
        return;
      }
      if (z(t, "ln-autosave:before-restore", { target: t, data: h }).defaultPrevented) return;
      const w = At(t, h);
      for (let E = 0; E < w.length; E++)
        w[E].dispatchEvent(new Event("input", { bubbles: !0 })), w[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      T(t, "ln-autosave:restored", { target: t, data: h });
    }
    function d() {
      try {
        localStorage.removeItem(s);
      } catch {
        return;
      }
      T(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(r) {
      const h = r.target;
      e(h) && h.name && u();
    }, this._onChange = function(r) {
      const h = r.target;
      e(h) && h.name && u();
    }, this._onSubmit = function() {
      d();
    }, this._onReset = function() {
      d();
    }, this._onClearClick = function(r) {
      r.target.closest("[" + y + "]") && d();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const m = i(t);
    return m > 0 && (this._onInput = function(r) {
      const h = r.target;
      !e(h) || !h.name || (c !== null && clearTimeout(c), c = setTimeout(u, m));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return c;
    }, o(), this;
  }
  l.prototype.destroy = function() {
    if (this.dom[a]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const t = this._getInputTimer();
        t !== null && clearTimeout(t);
      }
      T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[a];
    }
  };
  function n(t) {
    const c = t.getAttribute(p) || t.id;
    return c ? g + window.location.pathname + ":" + c : null;
  }
  function e(t) {
    const s = t.tagName;
    return s === "INPUT" || s === "TEXTAREA" || s === "SELECT";
  }
  function i(t) {
    if (!t.hasAttribute(_)) return 0;
    const s = t.getAttribute(_);
    if (s === "" || s === null) return 1e3;
    const c = parseInt(s, 10);
    return isNaN(c) || c < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : c;
  }
  B(p, a, l, "ln-autosave");
})();
(function() {
  const p = "data-ln-autoresize", a = "lnAutoresize";
  if (window[a] !== void 0) return;
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
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[a]);
  }, B(p, a, y, "ln-autoresize");
})();
(function() {
  const p = "data-ln-validate", a = "lnValidate", y = "data-ln-validate-errors", _ = "data-ln-validate-error", g = "ln-validate-valid", b = "ln-validate-invalid", l = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[a] !== void 0) return;
  function n(e) {
    this.dom = e, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const i = this, t = e.tagName, s = e.type, c = t === "SELECT" || s === "checkbox" || s === "radio";
    return this._onInput = function() {
      i._touched = !0, i.validate();
    }, this._onChange = function() {
      i._touched = !0, i.validate();
    }, this._onSetCustom = function(u) {
      const o = u.detail && u.detail.error;
      if (!o) return;
      i._customErrors.add(o), i._touched = !0;
      const d = e.closest(".form-element");
      if (d) {
        const m = d.querySelector("[" + _ + '="' + o + '"]');
        m && m.classList.remove("hidden");
      }
      e.classList.remove(g), e.classList.add(b);
    }, this._onClearCustom = function(u) {
      const o = u.detail && u.detail.error, d = e.closest(".form-element");
      if (o) {
        if (i._customErrors.delete(o), d) {
          const m = d.querySelector("[" + _ + '="' + o + '"]');
          m && m.classList.add("hidden");
        }
      } else
        i._customErrors.forEach(function(m) {
          if (d) {
            const r = d.querySelector("[" + _ + '="' + m + '"]');
            r && r.classList.add("hidden");
          }
        }), i._customErrors.clear();
      i._touched && i.validate();
    }, c || e.addEventListener("input", this._onInput), e.addEventListener("change", this._onChange), e.addEventListener("ln-validate:set-custom", this._onSetCustom), e.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  n.prototype.validate = function() {
    const e = this.dom, i = e.validity, s = e.checkValidity() && this._customErrors.size === 0, c = e.closest(".form-element");
    if (c) {
      const o = c.querySelector("[" + y + "]");
      if (o) {
        const d = o.querySelectorAll("[" + _ + "]");
        for (let m = 0; m < d.length; m++) {
          const r = d[m].getAttribute(_), h = l[r];
          h && (i[h] ? d[m].classList.remove("hidden") : d[m].classList.add("hidden"));
        }
      }
    }
    return e.classList.toggle(g, s), e.classList.toggle(b, !s), T(e, s ? "ln-validate:valid" : "ln-validate:invalid", { target: e, field: e.name }), s;
  }, n.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, b);
    const e = this.dom.closest(".form-element");
    if (e) {
      const i = e.querySelectorAll("[" + _ + "]");
      for (let t = 0; t < i.length; t++)
        i[t].classList.add("hidden");
    }
  }, Object.defineProperty(n.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), n.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(g, b), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(p, a, n, "ln-validate");
})();
(function() {
  const p = "data-ln-form", a = "lnForm", y = "data-ln-form-auto", _ = "data-ln-form-debounce", g = "data-ln-validate", b = "lnValidate";
  if (window[a] !== void 0) return;
  function l(n) {
    this.dom = n, this._debounceTimer = null;
    const e = this;
    if (this._onValid = function() {
      e._updateSubmitButton();
    }, this._onInvalid = function() {
      e._updateSubmitButton();
    }, this._onSubmit = function(i) {
      i.preventDefault(), e.submit();
    }, this._onFill = function(i) {
      i.detail && e.fill(i.detail);
    }, this._onFormReset = function() {
      e.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        e._resetValidation();
      }, 0);
    }, n.addEventListener("ln-validate:valid", this._onValid), n.addEventListener("ln-validate:invalid", this._onInvalid), n.addEventListener("submit", this._onSubmit), n.addEventListener("ln-form:fill", this._onFill), n.addEventListener("ln-form:reset", this._onFormReset), n.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, n.hasAttribute(y)) {
      const i = parseInt(n.getAttribute(_)) || 0;
      this._onAutoInput = function() {
        i > 0 ? (clearTimeout(e._debounceTimer), e._debounceTimer = setTimeout(function() {
          e.submit();
        }, i)) : e.submit();
      }, n.addEventListener("input", this._onAutoInput), n.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  l.prototype._updateSubmitButton = function() {
    const n = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!n.length) return;
    const e = this.dom.querySelectorAll("[" + g + "]");
    let i = !1;
    if (e.length > 0) {
      let t = !1, s = !1;
      for (let c = 0; c < e.length; c++) {
        const u = e[c][b];
        u && u._touched && (t = !0), e[c].checkValidity() || (s = !0);
      }
      i = s || !t;
    }
    for (let t = 0; t < n.length; t++)
      n[t].disabled = i;
  }, l.prototype.fill = function(n) {
    const e = At(this.dom, n);
    for (let i = 0; i < e.length; i++) {
      const t = e[i], s = t.tagName === "SELECT" || t.type === "checkbox" || t.type === "radio";
      t.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, l.prototype.submit = function() {
    const n = this.dom.querySelectorAll("[" + g + "]");
    let e = !0;
    for (let t = 0; t < n.length; t++) {
      const s = n[t][b];
      s && (s.validate() || (e = !1));
    }
    if (!e) return;
    const i = Et(this.dom);
    T(this.dom, "ln-form:submit", { data: i });
  }, l.prototype.reset = function() {
    this.dom.reset();
    const n = this.dom.querySelectorAll("input, textarea, select");
    for (let e = 0; e < n.length; e++) {
      const i = n[e], t = i.tagName === "SELECT" || i.type === "checkbox" || i.type === "radio";
      i.dispatchEvent(new Event(t ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), T(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, l.prototype._resetValidation = function() {
    const n = this.dom.querySelectorAll("[" + g + "]");
    for (let e = 0; e < n.length; e++) {
      const i = n[e][b];
      i && i.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      const n = this.dom.querySelectorAll("[" + g + "]");
      for (let e = 0; e < n.length; e++)
        if (!n[e].checkValidity()) return !1;
      return !0;
    }
  }), l.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(p, a, l, "ln-form");
})();
(function() {
  const p = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const y = {}, _ = {};
  function g(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(E, A) {
    const k = (E || "") + "|" + JSON.stringify(A);
    return y[k] || (y[k] = new Intl.DateTimeFormat(E, A)), y[k];
  }
  function l(E) {
    const A = E || "";
    return _[A] || (_[A] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), _[A];
  }
  const n = /* @__PURE__ */ new Set();
  let e = null;
  function i() {
    e || (e = setInterval(s, 6e4));
  }
  function t() {
    e && (clearInterval(e), e = null);
  }
  function s() {
    for (const E of n) {
      if (!document.body.contains(E.dom)) {
        n.delete(E);
        continue;
      }
      r(E);
    }
    n.size === 0 && t();
  }
  function c(E, A) {
    return b(A, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function u(E, A) {
    const k = /* @__PURE__ */ new Date(), I = { month: "short", day: "numeric" };
    return E.getFullYear() !== k.getFullYear() && (I.year = "numeric"), b(A, I).format(E);
  }
  function o(E, A) {
    return b(A, { dateStyle: "medium" }).format(E);
  }
  function d(E, A) {
    return b(A, { timeStyle: "short" }).format(E);
  }
  function m(E, A) {
    const k = Math.floor(Date.now() / 1e3), q = Math.floor(E.getTime() / 1e3) - k, D = Math.abs(q);
    if (D < 10) return l(A).format(0, "second");
    let M, H;
    if (D < 60)
      M = "second", H = q;
    else if (D < 3600)
      M = "minute", H = Math.round(q / 60);
    else if (D < 86400)
      M = "hour", H = Math.round(q / 3600);
    else if (D < 604800)
      M = "day", H = Math.round(q / 86400);
    else if (D < 2592e3)
      M = "week", H = Math.round(q / 604800);
    else
      return u(E, A);
    return l(A).format(H, M);
  }
  function r(E) {
    const A = E.dom.getAttribute("datetime");
    if (!A) return;
    const k = Number(A);
    if (isNaN(k)) return;
    const I = new Date(k * 1e3), q = E.dom.getAttribute(p) || "short", D = g(E.dom);
    let M;
    switch (q) {
      case "relative":
        M = m(I, D);
        break;
      case "full":
        M = c(I, D);
        break;
      case "date":
        M = o(I, D);
        break;
      case "time":
        M = d(I, D);
        break;
      default:
        M = u(I, D);
        break;
    }
    E.dom.textContent = M, q !== "full" && (E.dom.title = c(I, D));
  }
  function h(E) {
    return this.dom = E, r(this), E.getAttribute(p) === "relative" && (n.add(this), i()), this;
  }
  h.prototype.render = function() {
    r(this);
  }, h.prototype.destroy = function() {
    n.delete(this), n.size === 0 && t(), delete this.dom[a];
  };
  function v(E) {
    const A = E[a];
    if (!A) return;
    E.getAttribute(p) === "relative" ? (n.add(A), i()) : (n.delete(A), n.size === 0 && t()), r(A);
  }
  function w(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(p) && E[a] && r(E[a]);
  }
  B(p, a, h, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: w
  });
})();
(function() {
  const p = "data-ln-store", a = "lnStore";
  if (window[a] !== void 0) return;
  const y = "ln_app_cache", _ = "_meta", g = "1.0";
  let b = null, l = null;
  const n = {};
  function e() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(L) {
        const S = Math.random() * 16 | 0;
        return (L === "x" ? S : S & 3 | 8).toString(16);
      });
    }
  }
  function i(f) {
    f && f.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: f });
  }
  function t() {
    const f = document.querySelectorAll("[" + p + "]"), L = {};
    for (let S = 0; S < f.length; S++) {
      const O = f[S].getAttribute(p);
      O && (L[O] = {
        indexes: (f[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(C) {
          return C.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function s() {
    return l || (l = new Promise(function(f, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), f(null);
        return;
      }
      const S = t(), O = Object.keys(S), C = indexedDB.open(y);
      C.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), f(null);
      }, C.onsuccess = function(x) {
        const F = x.target.result, N = Array.from(F.objectStoreNames);
        let j = !1;
        N.indexOf(_) === -1 && (j = !0);
        for (let tt = 0; tt < O.length; tt++)
          if (N.indexOf(O[tt]) === -1) {
            j = !0;
            break;
          }
        if (!j) {
          c(F), b = F, f(F);
          return;
        }
        const lt = F.version;
        F.close();
        const dt = indexedDB.open(y, lt + 1);
        dt.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, dt.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), f(null);
        }, dt.onupgradeneeded = function(tt) {
          const G = tt.target.result;
          G.objectStoreNames.contains(_) || G.createObjectStore(_, { keyPath: "key" });
          for (let pt = 0; pt < O.length; pt++) {
            const mt = O[pt];
            if (!G.objectStoreNames.contains(mt)) {
              const Lt = G.createObjectStore(mt, { keyPath: "id" }), gt = S[mt].indexes;
              for (let ut = 0; ut < gt.length; ut++)
                Lt.createIndex(gt[ut], gt[ut], { unique: !1 });
            }
          }
        }, dt.onsuccess = function(tt) {
          const G = tt.target.result;
          c(G), b = G, f(G);
        };
      };
    }), l);
  }
  function c(f) {
    f.onversionchange = function() {
      f.close(), b = null, l = null;
    };
  }
  function u() {
    return b ? Promise.resolve(b) : (l = null, s());
  }
  function o(f, L) {
    return u().then(function(S) {
      return S ? S.transaction(f, L).objectStore(f) : null;
    });
  }
  function d(f) {
    return new Promise(function(L, S) {
      f.onsuccess = function() {
        L(f.result);
      }, f.onerror = function() {
        i(f.error), S(f.error);
      };
    });
  }
  function m(f) {
    return o(f, "readonly").then(function(L) {
      return L ? d(L.getAll()) : [];
    });
  }
  function r(f, L) {
    return o(f, "readonly").then(function(S) {
      return S ? d(S.get(L)) : null;
    });
  }
  function h(f, L) {
    return o(f, "readwrite").then(function(S) {
      if (S)
        return d(S.put(L));
    });
  }
  function v(f, L) {
    return o(f, "readwrite").then(function(S) {
      if (S)
        return d(S.delete(L));
    });
  }
  function w(f) {
    return o(f, "readwrite").then(function(L) {
      if (L)
        return d(L.clear());
    });
  }
  function E(f) {
    return o(f, "readonly").then(function(L) {
      return L ? d(L.count()) : 0;
    });
  }
  function A(f) {
    return o(_, "readonly").then(function(L) {
      return L ? d(L.get(f)) : null;
    });
  }
  function k(f, L) {
    return o(_, "readwrite").then(function(S) {
      if (S)
        return L.key = f, d(S.put(L));
    });
  }
  function I(f) {
    this.dom = f, this._name = f.getAttribute(p), this._endpoint = f.getAttribute("data-ln-store-endpoint") || "";
    const L = f.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (f.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(C) {
      return C.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, n[this._name] = this;
    const O = this;
    return q(O), Q(O), this;
  }
  function q(f) {
    f._handlers = {
      create: function(L) {
        D(f, L.detail);
      },
      update: function(L) {
        M(f, L.detail);
      },
      delete: function(L) {
        H(f, L.detail);
      },
      bulkDelete: function(L) {
        V(f, L.detail);
      }
    }, f.dom.addEventListener("ln-store:request-create", f._handlers.create), f.dom.addEventListener("ln-store:request-update", f._handlers.update), f.dom.addEventListener("ln-store:request-delete", f._handlers.delete), f.dom.addEventListener("ln-store:request-bulk-delete", f._handlers.bulkDelete);
  }
  function D(f, L) {
    const S = L.data || {}, O = "_temp_" + e(), C = Object.assign({}, S, { id: O });
    h(f._name, C).then(function() {
      return f.totalCount++, T(f.dom, "ln-store:created", {
        store: f._name,
        record: C,
        tempId: O
      }), fetch(f._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(S)
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      return x.json();
    }).then(function(x) {
      return v(f._name, O).then(function() {
        return h(f._name, x);
      }).then(function() {
        T(f.dom, "ln-store:confirmed", {
          store: f._name,
          record: x,
          tempId: O,
          action: "create"
        });
      });
    }).catch(function(x) {
      v(f._name, O).then(function() {
        f.totalCount--, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: C,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function M(f, L) {
    const S = L.id, O = L.data || {}, C = L.expected_version;
    let x = null;
    r(f._name, S).then(function(F) {
      if (!F) throw new Error("Record not found: " + S);
      x = Object.assign({}, F);
      const N = Object.assign({}, F, O);
      return h(f._name, N).then(function() {
        return T(f.dom, "ln-store:updated", {
          store: f._name,
          record: N,
          previous: x
        }), N;
      });
    }).then(function(F) {
      const N = Object.assign({}, O);
      return C && (N.expected_version = C), fetch(f._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(N)
      });
    }).then(function(F) {
      if (F.status === 409)
        return F.json().then(function(N) {
          return h(f._name, x).then(function() {
            T(f.dom, "ln-store:conflict", {
              store: f._name,
              local: x,
              remote: N.current || N,
              field_diffs: N.field_diffs || null
            });
          });
        });
      if (!F.ok) throw new Error("HTTP " + F.status);
      return F.json().then(function(N) {
        return h(f._name, N).then(function() {
          T(f.dom, "ln-store:confirmed", {
            store: f._name,
            record: N,
            action: "update"
          });
        });
      });
    }).catch(function(F) {
      x && h(f._name, x).then(function() {
        T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: x,
          action: "update",
          error: F.message
        });
      });
    });
  }
  function H(f, L) {
    const S = L.id;
    let O = null;
    r(f._name, S).then(function(C) {
      if (C)
        return O = Object.assign({}, C), v(f._name, S).then(function() {
          return f.totalCount--, T(f.dom, "ln-store:deleted", {
            store: f._name,
            id: S
          }), fetch(f._endpoint + "/" + S, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(C) {
      if (!C || !C.ok) throw new Error("HTTP " + (C ? C.status : "unknown"));
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: O,
        action: "delete"
      });
    }).catch(function(C) {
      O && h(f._name, O).then(function() {
        f.totalCount++, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: O,
          action: "delete",
          error: C.message
        });
      });
    });
  }
  function V(f, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let O = [];
    const C = S.map(function(x) {
      return r(f._name, x);
    });
    Promise.all(C).then(function(x) {
      return O = x.filter(Boolean), rt(f._name, S).then(function() {
        return f.totalCount -= S.length, T(f.dom, "ln-store:deleted", {
          store: f._name,
          ids: S
        }), fetch(f._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: S })
        });
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: null,
        ids: S,
        action: "bulk-delete"
      });
    }).catch(function(x) {
      O.length > 0 && it(f._name, O).then(function() {
        f.totalCount += O.length, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: null,
          ids: S,
          action: "bulk-delete",
          error: x.message
        });
      });
    });
  }
  function Q(f) {
    s().then(function() {
      return A(f._name);
    }).then(function(L) {
      L && L.schema_version === g ? (f.lastSyncedAt = L.last_synced_at || null, f.totalCount = L.record_count || 0, f.totalCount > 0 ? (f.isLoaded = !0, T(f.dom, "ln-store:ready", {
        store: f._name,
        count: f.totalCount,
        source: "cache"
      }), Z(f) && nt(f)) : Y(f)) : L && L.schema_version !== g ? w(f._name).then(function() {
        return k(f._name, {
          schema_version: g,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        Y(f);
      }) : Y(f);
    });
  }
  function Z(f) {
    return f._staleThreshold === -1 ? !1 : f.lastSyncedAt ? Math.floor(Date.now() / 1e3) - f.lastSyncedAt > f._staleThreshold : !0;
  }
  function Y(f) {
    return f._endpoint ? (f.isSyncing = !0, f._abortController = new AbortController(), fetch(f._endpoint, { signal: f._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const S = L.data || [], O = L.synced_at || Math.floor(Date.now() / 1e3);
      return it(f._name, S).then(function() {
        return k(f._name, {
          schema_version: g,
          last_synced_at: O,
          record_count: S.length
        });
      }).then(function() {
        f.isLoaded = !0, f.isSyncing = !1, f.lastSyncedAt = O, f.totalCount = S.length, f._abortController = null, T(f.dom, "ln-store:loaded", {
          store: f._name,
          count: S.length
        }), T(f.dom, "ln-store:ready", {
          store: f._name,
          count: S.length,
          source: "server"
        });
      });
    }).catch(function(L) {
      f.isSyncing = !1, f._abortController = null, L.name !== "AbortError" && (f.isLoaded ? T(f.dom, "ln-store:offline", { store: f._name }) : T(f.dom, "ln-store:error", {
        store: f._name,
        action: "full-load",
        error: L.message,
        status: null
      }));
    })) : Promise.resolve();
  }
  function nt(f) {
    if (!f._endpoint || !f.lastSyncedAt) return Y(f);
    f.isSyncing = !0, f._abortController = new AbortController();
    const L = f._endpoint + (f._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + f.lastSyncedAt;
    return fetch(L, { signal: f._abortController.signal }).then(function(S) {
      if (!S.ok) throw new Error("HTTP " + S.status);
      return S.json();
    }).then(function(S) {
      const O = S.data || [], C = S.deleted || [], x = S.synced_at || Math.floor(Date.now() / 1e3), F = O.length > 0 || C.length > 0;
      let N = Promise.resolve();
      return O.length > 0 && (N = N.then(function() {
        return it(f._name, O);
      })), C.length > 0 && (N = N.then(function() {
        return rt(f._name, C);
      })), N.then(function() {
        return E(f._name);
      }).then(function(j) {
        return f.totalCount = j, k(f._name, {
          schema_version: g,
          last_synced_at: x,
          record_count: j
        });
      }).then(function() {
        f.isSyncing = !1, f.lastSyncedAt = x, f._abortController = null, T(f.dom, "ln-store:synced", {
          store: f._name,
          added: O.length,
          deleted: C.length,
          changed: F
        });
      });
    }).catch(function(S) {
      f.isSyncing = !1, f._abortController = null, S.name !== "AbortError" && T(f.dom, "ln-store:offline", { store: f._name });
    });
  }
  function it(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(O, C) {
          const x = S.transaction(f, "readwrite"), F = x.objectStore(f);
          for (let N = 0; N < L.length; N++)
            F.put(L[N]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            i(x.error), C(x.error);
          };
        });
    });
  }
  function rt(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(O, C) {
          const x = S.transaction(f, "readwrite"), F = x.objectStore(f);
          for (let N = 0; N < L.length; N++)
            F.delete(L[N]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            C(x.error);
          };
        });
    });
  }
  let R = null;
  R = function() {
    if (document.visibilityState !== "visible") return;
    const f = Object.keys(n);
    for (let L = 0; L < f.length; L++) {
      const S = n[f[L]];
      S.isLoaded && !S.isSyncing && Z(S) && nt(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const P = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function U(f, L) {
    if (!L || !L.field) return f;
    const S = L.field, O = L.direction === "desc";
    return f.slice().sort(function(C, x) {
      const F = C[S], N = x[S];
      if (F == null && N == null) return 0;
      if (F == null) return O ? 1 : -1;
      if (N == null) return O ? -1 : 1;
      let j;
      return typeof F == "string" && typeof N == "string" ? j = P.compare(F, N) : j = F < N ? -1 : F > N ? 1 : 0, O ? -j : j;
    });
  }
  function X(f, L) {
    if (!L) return f;
    const S = Object.keys(L);
    return S.length === 0 ? f : f.filter(function(O) {
      for (let C = 0; C < S.length; C++) {
        const x = S[C], F = L[x];
        if (!Array.isArray(F) || F.length === 0) continue;
        const N = O[x];
        let j = !1;
        for (let lt = 0; lt < F.length; lt++)
          if (String(N) === String(F[lt])) {
            j = !0;
            break;
          }
        if (!j) return !1;
      }
      return !0;
    });
  }
  function ct(f, L, S) {
    if (!L || !S || S.length === 0) return f;
    const O = L.toLowerCase();
    return f.filter(function(C) {
      for (let x = 0; x < S.length; x++) {
        const F = C[S[x]];
        if (F != null && String(F).toLowerCase().indexOf(O) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function K(f, L, S) {
    if (f.length === 0) return 0;
    if (S === "count") return f.length;
    let O = 0, C = 0;
    for (let x = 0; x < f.length; x++) {
      const F = parseFloat(f[x][L]);
      isNaN(F) || (O += F, C++);
    }
    return S === "sum" ? O : S === "avg" && C > 0 ? O / C : 0;
  }
  I.prototype.getAll = function(f) {
    const L = this;
    return f = f || {}, m(L._name).then(function(S) {
      const O = S.length;
      f.filters && (S = X(S, f.filters)), f.search && (S = ct(S, f.search, L._searchFields));
      const C = S.length;
      if (f.sort && (S = U(S, f.sort)), f.offset || f.limit) {
        const x = f.offset || 0, F = f.limit || S.length;
        S = S.slice(x, x + F);
      }
      return {
        data: S,
        total: O,
        filtered: C
      };
    });
  }, I.prototype.getById = function(f) {
    return r(this._name, f);
  }, I.prototype.count = function(f) {
    const L = this;
    return f ? m(L._name).then(function(S) {
      return X(S, f).length;
    }) : E(L._name);
  }, I.prototype.aggregate = function(f, L) {
    return m(this._name).then(function(O) {
      return K(O, f, L);
    });
  }, I.prototype.forceSync = function() {
    return nt(this);
  }, I.prototype.fullReload = function() {
    const f = this;
    return w(f._name).then(function() {
      return f.isLoaded = !1, f.lastSyncedAt = null, f.totalCount = 0, Y(f);
    });
  }, I.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete n[this._name], Object.keys(n).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[a], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function st() {
    return u().then(function(f) {
      if (!f) return;
      const L = Array.from(f.objectStoreNames);
      return new Promise(function(S, O) {
        const C = f.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          C.objectStore(L[x]).clear();
        C.oncomplete = function() {
          S();
        }, C.onerror = function() {
          O(C.error);
        };
      });
    }).then(function() {
      const f = Object.keys(n);
      for (let L = 0; L < f.length; L++) {
        const S = n[f[L]];
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      }
    });
  }
  B(p, a, I, "ln-store"), window[a].clearAll = st, window[a].init = window[a];
})();
(function() {
  const p = "data-ln-data-table", a = "lnDataTable";
  if (window[a] !== void 0) return;
  const g = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function b(n) {
    return g ? g.format(n) : String(n);
  }
  function l(n) {
    this.dom = n, this.name = n.getAttribute(p) || "", this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-data-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(i) {
      return i.getAttribute("data-ln-col") && i.querySelector("[data-ln-col-filter]");
    }).map(function(i) {
      return i.getAttribute("data-ln-col");
    }), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = n.querySelector("[data-ln-data-table-total]"), this._filteredSpan = n.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = n.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const e = this;
    if (this._onSetData = function(i) {
      const t = i.detail || {};
      e._data = t.data || [], e._lastTotal = t.total != null ? t.total : e._data.length, e._lastFiltered = t.filtered != null ? t.filtered : e._data.length, e.totalCount = e._lastTotal, e.visibleCount = e._lastFiltered, e.isLoaded = !0, e._updateFilterOptions(t.filterOptions), e._vStart = -1, e._vEnd = -1, e._renderRows(), e._updateFooter(), T(n, "ln-data-table:rendered", {
        table: e.name,
        total: e.totalCount,
        visible: e.visibleCount
      });
    }, n.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const t = i.detail && i.detail.loading;
      n.classList.toggle("ln-data-table--loading", !!t), t && (e.isLoaded = !1);
    }, n.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(n.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(i) {
      const t = i.target.closest("[data-ln-col-sort]");
      if (!t) return;
      const s = t.closest("th");
      if (!s) return;
      const c = s.getAttribute("data-ln-col");
      c && e._handleSort(c, s);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(i) {
      const t = i.target.closest("[data-ln-col-filter]");
      if (!t) return;
      i.stopPropagation();
      const s = t.closest("th");
      if (!s) return;
      const c = s.getAttribute("data-ln-col");
      if (c) {
        if (e._activeDropdown && e._activeDropdown.field === c) {
          e._closeFilterDropdown();
          return;
        }
        e._openFilterDropdown(c, s, t);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      e._activeDropdown && e._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(i) {
      i.target.closest("[data-ln-data-table-clear-all]") && (e.currentFilters = {}, e._updateFilterIndicators(), T(n, "ln-data-table:clear-filters", { table: e.name }), e._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(i) {
        const t = i.target.closest("[data-ln-row-select]");
        if (!t) return;
        const s = t.closest("[data-ln-row]");
        if (!s) return;
        const c = s.getAttribute("data-ln-row-id");
        c != null && (t.checked ? (e.selectedIds.add(c), s.classList.add("ln-row-selected")) : (e.selectedIds.delete(c), s.classList.remove("ln-row-selected")), e.selectedCount = e.selectedIds.size, e._updateSelectAll(), e._updateFooter(), T(n, "ln-data-table:select", {
          table: e.name,
          selectedIds: e.selectedIds,
          count: e.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = n.querySelector('[data-ln-col-select] input[type="checkbox"]') || n.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const i = document.createElement("input");
        i.type = "checkbox", i.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(i), this._selectAllCheckbox = i;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const i = e._selectAllCheckbox.checked, t = e.tbody ? e.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let s = 0; s < t.length; s++) {
          const c = t[s].getAttribute("data-ln-row-id"), u = t[s].querySelector("[data-ln-row-select]");
          c != null && (i ? (e.selectedIds.add(c), t[s].classList.add("ln-row-selected")) : (e.selectedIds.delete(c), t[s].classList.remove("ln-row-selected")), u && (u.checked = i));
        }
        e.selectedCount = e.selectedIds.size, T(n, "ln-data-table:select-all", {
          table: e.name,
          selected: i
        }), T(n, "ln-data-table:select", {
          table: e.name,
          selectedIds: e.selectedIds,
          count: e.selectedCount
        }), e._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const i = this.tbody.querySelectorAll("[data-ln-row]");
        for (let t = 0; t < i.length; t++) {
          const s = i[t].querySelector("[data-ln-row-select]"), c = i[t].getAttribute("data-ln-row-id");
          s && s.checked && c != null && (this.selectedIds.add(c), i[t].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-row-select]") || i.target.closest("[data-ln-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const t = i.target.closest("[data-ln-row]");
      if (!t) return;
      const s = t.getAttribute("data-ln-row-id"), c = t._lnRecord || {};
      T(n, "ln-data-table:row-click", {
        table: e.name,
        id: s,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const t = i.target.closest("[data-ln-row-action]");
      if (!t) return;
      i.stopPropagation();
      const s = t.closest("[data-ln-row]");
      if (!s) return;
      const c = t.getAttribute("data-ln-row-action"), u = s.getAttribute("data-ln-row-id"), o = s._lnRecord || {};
      T(n, "ln-data-table:row-action", {
        table: e.name,
        id: u,
        action: c,
        record: o
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = n.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      e.currentSearch = e._searchInput.value, T(n, "ln-data-table:search", {
        table: e.name,
        query: e.currentSearch
      }), e._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(i) {
      if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (i.key === "/") {
        e._searchInput && (i.preventDefault(), e._searchInput.focus());
        return;
      }
      const t = e.tbody ? Array.from(e.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (t.length)
        switch (i.key) {
          case "ArrowDown":
            i.preventDefault(), e._focusedRowIndex = Math.min(e._focusedRowIndex + 1, t.length - 1), e._focusRow(t);
            break;
          case "ArrowUp":
            i.preventDefault(), e._focusedRowIndex = Math.max(e._focusedRowIndex - 1, 0), e._focusRow(t);
            break;
          case "Home":
            i.preventDefault(), e._focusedRowIndex = 0, e._focusRow(t);
            break;
          case "End":
            i.preventDefault(), e._focusedRowIndex = t.length - 1, e._focusRow(t);
            break;
          case "Enter":
            if (e._focusedRowIndex >= 0 && e._focusedRowIndex < t.length) {
              i.preventDefault();
              const s = t[e._focusedRowIndex];
              T(n, "ln-data-table:row-click", {
                table: e.name,
                id: s.getAttribute("data-ln-row-id"),
                record: s._lnRecord || {}
              });
            }
            break;
          case " ":
            if (e._selectable && e._focusedRowIndex >= 0 && e._focusedRowIndex < t.length) {
              i.preventDefault();
              const s = t[e._focusedRowIndex].querySelector("[data-ln-row-select]");
              s && (s.checked = !s.checked, s.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            e._activeDropdown && e._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(n, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  l.prototype._handleSort = function(n, e) {
    let i;
    !this.currentSort || this.currentSort.field !== n ? i = "asc" : this.currentSort.direction === "asc" ? i = "desc" : i = null;
    for (let t = 0; t < this.ths.length; t++)
      this.ths[t].classList.remove("ln-sort-asc", "ln-sort-desc");
    i ? (this.currentSort = { field: n, direction: i }, e.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: n,
      direction: i
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
    const n = this.tbody.querySelectorAll("[data-ln-row]");
    let e = n.length > 0;
    for (let i = 0; i < n.length; i++) {
      const t = n[i].getAttribute("data-ln-row-id");
      if (t != null && !this.selectedIds.has(t)) {
        e = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = e;
  }, Object.defineProperty(l.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), l.prototype._focusRow = function(n) {
    for (let e = 0; e < n.length; e++)
      n[e].classList.remove("ln-row-focused"), n[e].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const e = n[this._focusedRowIndex];
      e.classList.add("ln-row-focused"), e.setAttribute("tabindex", "0"), e.focus(), e.scrollIntoView({ block: "nearest" });
    }
  }, l.prototype._openFilterDropdown = function(n, e, i) {
    this._closeFilterDropdown();
    const t = ot(this.dom, this.name + "-column-filter", "ln-data-table") || ot(this.dom, "column-filter", "ln-data-table");
    if (!t) return;
    const s = t.firstElementChild;
    if (!s) return;
    const c = this._getUniqueValues(n), u = s.querySelector("[data-ln-filter-options]"), o = s.querySelector("[data-ln-filter-search]"), d = this.currentFilters[n] || [], m = this;
    if (o && c.length <= 8 && o.classList.add("hidden"), u) {
      for (let h = 0; h < c.length; h++) {
        const v = c[h], w = document.createElement("li"), E = document.createElement("label"), A = document.createElement("input");
        A.type = "checkbox", A.value = v, A.checked = d.length === 0 || d.indexOf(v) !== -1, E.appendChild(A), E.appendChild(document.createTextNode(" " + v)), w.appendChild(E), u.appendChild(w);
      }
      u.addEventListener("change", function(h) {
        h.target.type === "checkbox" && m._onFilterChange(n, u);
      });
    }
    o && o.addEventListener("input", function() {
      const h = o.value.toLowerCase(), v = u.querySelectorAll("li");
      for (let w = 0; w < v.length; w++) {
        const E = v[w].textContent.toLowerCase();
        v[w].classList.toggle("hidden", h && E.indexOf(h) === -1);
      }
    });
    const r = s.querySelector("[data-ln-filter-clear]");
    r && r.addEventListener("click", function() {
      delete m.currentFilters[n], m._closeFilterDropdown(), m._updateFilterIndicators(), T(m.dom, "ln-data-table:filter", {
        table: m.name,
        field: n,
        values: []
      }), m._requestData();
    }), e.appendChild(s), this._activeDropdown = { field: n, th: e, el: s }, s.addEventListener("click", function(h) {
      h.stopPropagation();
    });
  }, l.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, l.prototype._onFilterChange = function(n, e) {
    const i = e.querySelectorAll('input[type="checkbox"]'), t = [];
    let s = !0;
    for (let c = 0; c < i.length; c++)
      i[c].checked ? t.push(i[c].value) : s = !1;
    s || t.length === 0 ? delete this.currentFilters[n] : this.currentFilters[n] = t, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: n,
      values: s ? [] : t
    }), this._requestData();
  }, l.prototype._updateFilterOptions = function(n) {
    if (n !== null && typeof n == "object" && !Array.isArray(n)) {
      const e = Object.keys(n);
      for (let i = 0; i < e.length; i++) {
        const t = e[i], s = n[t];
        if (!Array.isArray(s)) continue;
        const c = {}, u = [];
        for (let o = 0; o < s.length; o++) {
          const d = String(s[o]);
          c[d] || (c[d] = !0, u.push(d));
        }
        this._filterOptions[t] = u.sort();
      }
    } else {
      const e = this._filterableFields, i = this._data;
      for (let t = 0; t < e.length; t++) {
        const s = e[t];
        this._filterOptions[s] || (this._filterOptions[s] = []);
        const c = this._filterOptions[s], u = {};
        for (let o = 0; o < c.length; o++)
          u[c[o]] = !0;
        for (let o = 0; o < i.length; o++) {
          const d = i[o][s];
          if (d != null) {
            const m = String(d);
            u[m] || (u[m] = !0, c.push(m));
          }
        }
        c.sort();
      }
    }
  }, l.prototype._getUniqueValues = function(n) {
    return (this._filterOptions[n] || []).slice().sort();
  }, l.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let e = 0; e < n.length; e++) {
      const i = n[e], t = i.getAttribute("data-ln-col");
      if (!t) continue;
      const s = i.querySelector("[data-ln-col-filter]");
      if (!s) continue;
      const c = this.currentFilters[t] && this.currentFilters[t].length > 0;
      s.classList.toggle("ln-filter-active", !!c);
    }
  }, l.prototype._renderRows = function() {
    if (!this.tbody) return;
    const n = this._data, e = this._lastTotal, i = this._lastFiltered;
    if (e === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (n.length === 0 || i === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    n.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, l.prototype._renderAll = function() {
    const n = this._data, e = document.createDocumentFragment();
    for (let i = 0; i < n.length; i++) {
      const t = this._buildRow(n[i]);
      if (!t) break;
      e.appendChild(t);
    }
    this.tbody.textContent = "", this.tbody.appendChild(e), this._selectable && this._updateSelectAll();
  }, l.prototype._buildRow = function(n) {
    const e = ot(this.dom, this.name + "-row", "ln-data-table");
    if (!e) return null;
    const i = e.querySelector("[data-ln-row]") || e.firstElementChild;
    if (!i) return null;
    if (this._fillRow(i, n), i._lnRecord = n, n.id != null && i.setAttribute("data-ln-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      i.classList.add("ln-row-selected");
      const t = i.querySelector("[data-ln-row-select]");
      t && (t.checked = !0);
    }
    return i;
  }, l.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight) {
      const e = this._buildRow(this._data[0]);
      e && (this.tbody.textContent = "", this.tbody.appendChild(e), this._rowHeight = e.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, l.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, l.prototype._renderVirtual = function() {
    const n = this._data, e = n.length, i = this._rowHeight;
    if (!i || !e) return;
    const s = this.table.getBoundingClientRect().top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, u = s + c, o = window.scrollY - u, d = Math.max(0, Math.floor(o / i) - 15), m = Math.min(d + Math.ceil(window.innerHeight / i) + 30, e);
    if (d === this._vStart && m === this._vEnd) return;
    this._vStart = d, this._vEnd = m;
    const r = this.ths.length || 1, h = d * i, v = (e - m) * i, w = document.createDocumentFragment();
    if (h > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", r), A.style.height = h + "px", E.appendChild(A), w.appendChild(E);
    }
    for (let E = d; E < m; E++) {
      const A = this._buildRow(n[E]);
      A && w.appendChild(A);
    }
    if (v > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", r), A.style.height = v + "px", E.appendChild(A), w.appendChild(E);
    }
    this.tbody.textContent = "", this.tbody.appendChild(w), this._selectable && this._updateSelectAll();
  }, l.prototype._fillRow = function(n, e) {
    const i = n.querySelectorAll("[data-ln-cell]");
    for (let s = 0; s < i.length; s++) {
      const c = i[s], u = c.getAttribute("data-ln-cell");
      e[u] != null && (c.textContent = e[u]);
    }
    const t = n.querySelectorAll("[data-ln-cell-attr]");
    for (let s = 0; s < t.length; s++) {
      const c = t[s], u = c.getAttribute("data-ln-cell-attr").split(",");
      for (let o = 0; o < u.length; o++) {
        const d = u[o].trim().split(":");
        if (d.length !== 2) continue;
        const m = d[0].trim(), r = d[1].trim();
        e[m] != null && c.setAttribute(r, e[m]);
      }
    }
  }, l.prototype._showEmptyState = function(n) {
    const e = ot(this.dom, n, "ln-data-table");
    this.tbody.textContent = "", e && this.tbody.appendChild(e);
  }, l.prototype._updateFooter = function() {
    const n = this._lastTotal, e = this._lastFiltered, i = e < n;
    if (this._totalSpan && (this._totalSpan.textContent = b(n)), this._filteredSpan && (this._filteredSpan.textContent = i ? b(e) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const t = this.selectedIds.size;
      this._selectedSpan.textContent = t > 0 ? b(t) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, l.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[a]);
  }, B(p, a, l, "ln-data-table");
})();
(function() {
  const p = "ln-icons-sprite", a = "#ln-", y = "#lnc-", _ = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let b = null;
  const l = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), e = "lni:", i = "lni:v", t = "1";
  function s() {
    try {
      if (localStorage.getItem(i) !== t) {
        for (let h = localStorage.length - 1; h >= 0; h--) {
          const v = localStorage.key(h);
          v && v.indexOf(e) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(i, t);
      }
    } catch {
    }
  }
  s();
  function c() {
    return b || (b = document.getElementById(p), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = p, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function u(h) {
    return h.indexOf(y) === 0 ? n + "/" + h.slice(y.length) + ".svg" : l + "/" + h.slice(a.length) + ".svg";
  }
  function o(h, v) {
    const w = v.match(/viewBox="([^"]+)"/), E = w ? w[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), k = A ? A[1].trim() : "", I = v.match(/<svg([^>]*)>/i), q = I ? I[1] : "", D = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    D.id = h, D.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const H = q.match(new RegExp(M + '="([^"]*)"'));
      H && D.setAttribute(M, H[1]);
    }), D.innerHTML = k, c().querySelector("defs").appendChild(D);
  }
  function d(h) {
    if (_.has(h) || g.has(h) || h.indexOf(y) === 0 && !n) return;
    const v = h.slice(1);
    try {
      const w = localStorage.getItem(e + v);
      if (w) {
        o(v, w), _.add(h);
        return;
      }
    } catch {
    }
    g.add(h), fetch(u(h)).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      o(v, w), _.add(h), g.delete(h);
      try {
        localStorage.setItem(e + v, w);
      } catch {
      }
    }).catch(function() {
      g.delete(h);
    });
  }
  function m(h) {
    const v = 'use[href^="' + a + '"], use[href^="' + y + '"]', w = h.querySelectorAll ? h.querySelectorAll(v) : [];
    if (h.matches && h.matches(v)) {
      const E = h.getAttribute("href");
      E && d(E);
    }
    Array.prototype.forEach.call(w, function(E) {
      const A = E.getAttribute("href");
      A && d(A);
    });
  }
  function r() {
    m(document), new MutationObserver(function(h) {
      h.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(w) {
            w.nodeType === 1 && m(w);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const w = v.target.getAttribute("href");
          w && (w.indexOf(a) === 0 || w.indexOf(y) === 0) && d(w);
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
