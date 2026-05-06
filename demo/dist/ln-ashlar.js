const gt = {};
function bt(h, a) {
  gt[h] || (gt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const y = gt[h];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (a || "ln-core") + '] Template "' + h + '" not found'), null);
}
function T(h, a, y) {
  h.dispatchEvent(new CustomEvent(a, {
    bubbles: !0,
    detail: y || {}
  }));
}
function z(h, a, y) {
  const _ = new CustomEvent(a, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return h.dispatchEvent(_), _;
}
function J(h, a) {
  if (!h || !a) return h;
  const y = h.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < y.length; s++) {
    const n = y[s], e = n.getAttribute("data-ln-field");
    a[e] != null && (n.textContent = a[e]);
  }
  const _ = h.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < _.length; s++) {
    const n = _[s], e = n.getAttribute("data-ln-attr").split(",");
    for (let i = 0; i < e.length; i++) {
      const t = e[i].trim().split(":");
      if (t.length !== 2) continue;
      const r = t[0].trim(), c = t[1].trim();
      a[c] != null && n.setAttribute(r, a[c]);
    }
  }
  const g = h.querySelectorAll("[data-ln-show]");
  for (let s = 0; s < g.length; s++) {
    const n = g[s], e = n.getAttribute("data-ln-show");
    e in a && n.classList.toggle("hidden", !a[e]);
  }
  const b = h.querySelectorAll("[data-ln-class]");
  for (let s = 0; s < b.length; s++) {
    const n = b[s], e = n.getAttribute("data-ln-class").split(",");
    for (let i = 0; i < e.length; i++) {
      const t = e[i].trim().split(":");
      if (t.length !== 2) continue;
      const r = t[0].trim(), c = t[1].trim();
      c in a && n.classList.toggle(r, !!a[c]);
    }
  }
  return h;
}
function Lt(h, a) {
  if (!h || !a) return h;
  const y = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const _ = y.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(g, b) {
        return a[b] !== void 0 ? a[b] : "";
      }
    ));
  }
  return h;
}
function K(h, a) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      K(h, a);
    }), console.warn("[" + a + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function ot(h, a, y) {
  if (h) {
    const _ = h.querySelector('[data-ln-template="' + a + '"]');
    if (_) return _.content.cloneNode(!0);
  }
  return bt(a, y);
}
function Tt(h, a) {
  const y = {}, _ = h.querySelectorAll("[" + a + "]");
  for (let g = 0; g < _.length; g++)
    y[_[g].getAttribute(a)] = _[g].textContent, _[g].remove();
  return y;
}
function _t(h, a, y, _) {
  if (h.nodeType !== 1) return;
  const b = a.indexOf("[") !== -1 || a.indexOf(".") !== -1 || a.indexOf("#") !== -1 ? a : "[" + a + "]", s = Array.from(h.querySelectorAll(b));
  h.matches && h.matches(b) && s.push(h);
  for (const n of s)
    n[y] || (n[y] = new _(n));
}
function at(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Et(h) {
  const a = {}, y = h.elements;
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
function At(h, a) {
  const y = h.elements, _ = [];
  for (let g = 0; g < y.length; g++) {
    const b = y[g];
    if (!b.name || !(b.name in a) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const s = a[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(s) ? s.indexOf(b.value) !== -1 : !!s, _.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(s), _.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < b.options.length; n++)
          b.options[n].selected = s.indexOf(b.options[n].value) !== -1;
      _.push(b);
    } else
      b.value = s, _.push(b);
  }
  return _;
}
function $(h) {
  const a = h.closest("[lang]");
  return (a ? a.lang : null) || navigator.language;
}
function B(h, a, y, _, g = {}) {
  const b = g.extraAttributes || [], s = g.onAttributeChange || null, n = g.onInit || null;
  function e(i) {
    const t = i || document.body;
    _t(t, h, a, y), n && n(t);
  }
  return K(function() {
    const i = new MutationObserver(function(r) {
      for (let c = 0; c < r.length; c++) {
        const u = r[c];
        if (u.type === "childList")
          for (let o = 0; o < u.addedNodes.length; o++) {
            const d = u.addedNodes[o];
            d.nodeType === 1 && (_t(d, h, a, y), n && n(d));
          }
        else u.type === "attributes" && (s && u.target[a] ? s(u.target, u.attributeName) : (_t(u.target, h, a, y), n && n(u.target)));
      }
    });
    let t = [];
    if (h.indexOf("[") !== -1) {
      const r = /\[([\w-]+)/g;
      let c;
      for (; (c = r.exec(h)) !== null; )
        t.push(c[1]);
    } else
      t.push(h);
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: t.concat(b)
    });
  }, _ || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[a] = e, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    e(document.body);
  }) : e(document.body), e;
}
function Ct(h, a) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, h(), a && a();
    }));
  };
}
const kt = "ln:";
function Ot() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function wt(h, a) {
  const y = a.getAttribute("data-ln-persist"), _ = y !== null && y !== "" ? y : a.id;
  return _ ? kt + h + ":" + Ot() + ":" + _ : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
}
function ft(h, a) {
  const y = wt(h, a);
  if (!y) return null;
  try {
    const _ = localStorage.getItem(y);
    return _ !== null ? JSON.parse(_) : null;
  } catch {
    return null;
  }
}
function et(h, a, y) {
  const _ = wt(h, a);
  if (_)
    try {
      localStorage.setItem(_, JSON.stringify(y));
    } catch {
    }
}
function yt(h, a, y, _) {
  const g = typeof _ == "number" ? _ : 4, b = window.innerWidth, s = window.innerHeight, n = a.width, e = a.height, i = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, t = i[y] || i.bottom;
  function r(d) {
    let p, l, m = !0;
    return d === "top" ? (p = h.top - g - e, l = h.left + (h.width - n) / 2, p < 0 && (m = !1)) : d === "bottom" ? (p = h.bottom + g, l = h.left + (h.width - n) / 2, p + e > s && (m = !1)) : d === "left" ? (p = h.top + (h.height - e) / 2, l = h.left - g - n, l < 0 && (m = !1)) : (p = h.top + (h.height - e) / 2, l = h.right + g, l + n > b && (m = !1)), { top: p, left: l, side: d, fits: m };
  }
  let c = null;
  for (let d = 0; d < t.length; d++) {
    const p = r(t[d]);
    if (p.fits) {
      c = p;
      break;
    }
  }
  c || (c = r(t[0]));
  let u = c.top, o = c.left;
  return n >= b ? o = 0 : (o < 0 && (o = 0), o + n > b && (o = b - n)), e >= s ? u = 0 : (u < 0 && (u = 0), u + e > s && (u = s - e)), { top: u, left: o, placement: c.side };
}
function xt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const a = h.parentNode, y = document.createComment("ln-teleport");
  return a.insertBefore(y, h), document.body.appendChild(h), function() {
    y.parentNode && (y.parentNode.insertBefore(h, y), y.parentNode.removeChild(y));
  };
}
function vt(h) {
  if (!h) return { width: 0, height: 0 };
  const a = h.style, y = a.visibility, _ = a.display, g = a.position;
  a.visibility = "hidden", a.display = "block", a.position = "fixed";
  const b = h.offsetWidth, s = h.offsetHeight;
  return a.visibility = y, a.display = _, a.position = g, { width: b, height: s };
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), a = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function _(i) {
    return typeof i == "string" ? i : i instanceof URL ? i.href : i instanceof Request ? i.url : String(i);
  }
  function g(i, t) {
    return t && t.method ? String(t.method).toUpperCase() : i instanceof Request ? i.method.toUpperCase() : "GET";
  }
  function b(i, t) {
    return t + " " + i;
  }
  function s(i) {
    return i === "GET" || i === "HEAD";
  }
  function n(i, t) {
    t = t || {};
    const r = _(i), c = g(i, t), u = b(r, c);
    s(c) && a.has(u) && (a.get(u).abort(), a.delete(u));
    const o = new AbortController(), d = t.signal;
    d && (d.aborted ? o.abort(d.reason) : d.addEventListener("abort", function() {
      o.abort(d.reason);
    }, { once: !0 }));
    const p = Object.assign({}, t, { signal: o.signal });
    return a.set(u, o), h(i, p).finally(function() {
      a.get(u) === o && a.delete(u);
    });
  }
  n.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = n;
  function e(i) {
    const t = i.detail || {};
    if (!t.url) return;
    const r = i.target, c = (t.method || (t.body ? "POST" : "GET")).toUpperCase(), u = t.key;
    u && y.has(u) && (y.get(u).abort(), y.delete(u));
    const o = new AbortController(), d = t.signal;
    d && (d.aborted ? o.abort(d.reason) : d.addEventListener("abort", function() {
      o.abort(d.reason);
    }, { once: !0 })), u && y.set(u, o);
    const p = { method: c, signal: o.signal };
    t.body !== void 0 && (p.body = t.body), window.fetch(t.url, p).then(function(l) {
      u && y.get(u) === o && y.delete(u), T(r, "ln-http:response", {
        ok: l.ok,
        status: l.status,
        response: l
      });
    }).catch(function(l) {
      u && y.get(u) === o && y.delete(u), !(l && l.name === "AbortError") && T(r, "ln-http:error", {
        ok: !1,
        status: 0,
        error: l
      });
    });
  }
  document.addEventListener("ln-http:request", e), window.lnHttp = {
    cancel: function(i) {
      let t = !1;
      return a.forEach(function(r, c) {
        c.endsWith(" " + i) && (r.abort(), a.delete(c), t = !0);
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
      return a.forEach(function(t, r) {
        const c = r.indexOf(" ");
        i.push({ method: r.slice(0, c), url: r.slice(c + 1) });
      }), y.forEach(function(t, r) {
        i.push({ key: r });
      }), i;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", e), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", a = "lnAjax";
  if (window[a] !== void 0) return;
  function y(t) {
    if (!t.hasAttribute(h) || t[a]) return;
    t[a] = !0;
    const r = n(t);
    _(r.links), g(r.forms);
  }
  function _(t) {
    for (const r of t) {
      if (r[a + "Trigger"] || r.hostname && r.hostname !== window.location.hostname) continue;
      const c = r.getAttribute("href");
      if (c && c.includes("#")) continue;
      const u = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const d = r.getAttribute("href");
        d && s("GET", d, null, r);
      };
      r.addEventListener("click", u), r[a + "Trigger"] = u;
    }
  }
  function g(t) {
    for (const r of t) {
      if (r[a + "Trigger"]) continue;
      const c = function(u) {
        u.preventDefault();
        const o = r.method.toUpperCase(), d = r.action, p = new FormData(r);
        for (const l of r.querySelectorAll('button, input[type="submit"]'))
          l.disabled = !0;
        s(o, d, p, r, function() {
          for (const l of r.querySelectorAll('button, input[type="submit"]'))
            l.disabled = !1;
        });
      };
      r.addEventListener("submit", c), r[a + "Trigger"] = c;
    }
  }
  function b(t) {
    if (!t[a]) return;
    const r = n(t);
    for (const c of r.links)
      c[a + "Trigger"] && (c.removeEventListener("click", c[a + "Trigger"]), delete c[a + "Trigger"]);
    for (const c of r.forms)
      c[a + "Trigger"] && (c.removeEventListener("submit", c[a + "Trigger"]), delete c[a + "Trigger"]);
    delete t[a];
  }
  function s(t, r, c, u, o) {
    if (z(u, "ln-ajax:before-start", { method: t, url: r }).defaultPrevented) return;
    T(u, "ln-ajax:start", { method: t, url: r }), u.classList.add("ln-ajax--loading");
    const p = document.createElement("span");
    p.className = "ln-ajax-spinner", u.appendChild(p);
    function l() {
      u.classList.remove("ln-ajax--loading");
      const A = u.querySelector(".ln-ajax-spinner");
      A && A.remove(), o && o();
    }
    let m = r;
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
      m = r + (r.includes("?") ? "&" : "?") + A.toString();
    } else t !== "GET" && c && (E.body = c);
    fetch(m, E).then(function(A) {
      const k = A.ok;
      return A.json().then(function(I) {
        return { ok: k, status: A.status, data: I };
      });
    }).then(function(A) {
      const k = A.data;
      if (A.ok) {
        if (k.title && (document.title = k.title), k.content)
          for (const I in k.content) {
            const F = document.getElementById(I);
            F && (F.innerHTML = k.content[I]);
          }
        if (u.tagName === "A") {
          const I = u.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
        T(u, "ln-ajax:success", { method: t, url: m, data: k });
      } else
        T(u, "ln-ajax:error", { method: t, url: m, status: A.status, data: k });
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
      T(u, "ln-ajax:complete", { method: t, url: m }), l();
    }).catch(function(A) {
      T(u, "ln-ajax:error", { method: t, url: m, error: A }), T(u, "ln-ajax:complete", { method: t, url: m }), l();
    });
  }
  function n(t) {
    const r = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(h) !== "false" ? r.links.push(t) : t.tagName === "FORM" && t.getAttribute(h) !== "false" ? r.forms.push(t) : (r.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), r.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), r;
  }
  function e() {
    K(function() {
      new MutationObserver(function(r) {
        for (const c of r)
          if (c.type === "childList") {
            for (const u of c.addedNodes)
              if (u.nodeType === 1 && (y(u), !u.hasAttribute(h))) {
                for (const d of u.querySelectorAll("[" + h + "]"))
                  y(d);
                const o = u.closest && u.closest("[" + h + "]");
                if (o && o.getAttribute(h) !== "false") {
                  const d = n(u);
                  _(d.links), g(d.forms);
                }
              }
          } else c.type === "attributes" && y(c.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function i() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      y(t);
  }
  window[a] = y, window[a].destroy = b, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-modal", a = "lnModal";
  if (window[a] !== void 0) return;
  function y(s) {
    const n = Array.from(s.querySelectorAll("[data-ln-modal-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-modal-for") && n.push(s);
    for (const e of n) {
      if (e[a + "Trigger"]) continue;
      const i = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const r = e.getAttribute("data-ln-modal-for"), c = document.getElementById(r);
        if (!c) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + r + '"');
          return;
        }
        if (!c[a]) return;
        const u = c.getAttribute(h);
        c.setAttribute(h, u === "open" ? "close" : "open");
      };
      e.addEventListener("click", i), e[a + "Trigger"] = i;
    }
  }
  function _(s) {
    this.dom = s, this.isOpen = s.getAttribute(h) === "open";
    const n = this;
    return this._onEscape = function(e) {
      e.key === "Escape" && n.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(e) {
      if (e.key !== "Tab") return;
      const i = Array.prototype.filter.call(
        n.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        at
      );
      if (i.length === 0) return;
      const t = i[0], r = i[i.length - 1];
      e.shiftKey ? document.activeElement === t && (e.preventDefault(), r.focus()) : document.activeElement === r && (e.preventDefault(), t.focus());
    }, this._onClose = function(e) {
      e.preventDefault(), n.dom.setAttribute(h, "close");
    }, b(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  _.prototype.destroy = function() {
    if (!this.dom[a]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const s = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of s)
      e[a + "Close"] && (e.removeEventListener("click", e[a + "Close"]), delete e[a + "Close"]);
    const n = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const e of n)
      e[a + "Trigger"] && (e.removeEventListener("click", e[a + "Trigger"]), delete e[a + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[a];
  };
  function g(s) {
    const n = s[a];
    if (!n) return;
    const i = s.getAttribute(h) === "open";
    if (i !== n.isOpen)
      if (i) {
        if (z(s, "ln-modal:before-open", { modalId: s.id, target: s }).defaultPrevented) {
          s.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, s.setAttribute("aria-modal", "true"), s.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", n._onEscape), document.addEventListener("keydown", n._onFocusTrap);
        const r = document.activeElement;
        n._returnFocusEl = r && r !== document.body ? r : null;
        const c = s.querySelector("[autofocus]");
        if (c && at(c))
          c.focus();
        else {
          const u = s.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), o = Array.prototype.find.call(u, at);
          if (o) o.focus();
          else {
            const d = s.querySelectorAll("a[href], button:not([disabled])"), p = Array.prototype.find.call(d, at);
            p && p.focus();
          }
        }
        T(s, "ln-modal:open", { modalId: s.id, target: s });
      } else {
        if (z(s, "ln-modal:before-close", { modalId: s.id, target: s }).defaultPrevented) {
          s.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, s.removeAttribute("aria-modal"), document.removeEventListener("keydown", n._onEscape), document.removeEventListener("keydown", n._onFocusTrap), T(s, "ln-modal:close", { modalId: s.id, target: s }), n._returnFocusEl && document.contains(n._returnFocusEl) && typeof n._returnFocusEl.focus == "function" && n._returnFocusEl.focus(), n._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function b(s) {
    const n = s.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of n)
      e[a + "Close"] || (e.addEventListener("click", s._onClose), e[a + "Close"] = s._onClose);
  }
  B(h, a, _, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: g,
    onInit: y
  });
})();
(function() {
  const h = "data-ln-number", a = "lnNumber";
  if (window[a] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(e) {
    if (!y[e]) {
      const i = new Intl.NumberFormat(e, { useGrouping: !0 }), t = i.formatToParts(1234.5);
      let r = "", c = ".";
      for (let u = 0; u < t.length; u++)
        t[u].type === "group" && (r = t[u].value), t[u].type === "decimal" && (c = t[u].value);
      y[e] = { fmt: i, groupSep: r, decimalSep: c };
    }
    return y[e];
  }
  function b(e, i, t) {
    if (t !== null) {
      const r = parseInt(t, 10), c = e + "|d" + r;
      return y[c] || (y[c] = new Intl.NumberFormat(e, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: r })), y[c].format(i);
    }
    return g(e).fmt.format(i);
  }
  function s(e) {
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
      let p = u.replace(new RegExp("[^0-9\\-" + d + ".]", "g"), "");
      o.groupSep && (p = p.split(o.groupSep).join("")), o.decimalSep !== "." && (p = p.replace(o.decimalSep, "."));
      const l = parseFloat(p);
      isNaN(l) ? (e.value = "", t._hidden.value = "") : t.value = l;
    }, e.addEventListener("paste", this._onPaste);
    const r = e.value;
    if (r !== "") {
      const c = parseFloat(r);
      isNaN(c) || (this._displayFormatted(c), _.set.call(i, String(c)));
    }
    return this;
  }
  s.prototype._handleInput = function() {
    const e = this.dom, i = g($(e)), t = e.value;
    if (t === "") {
      this._hidden.value = "", T(e, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (t === "-") {
      this._hidden.value = "";
      return;
    }
    const r = e.selectionStart;
    let c = 0;
    for (let A = 0; A < r; A++)
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
    const p = parseFloat(u);
    if (isNaN(p)) return;
    const l = e.getAttribute("data-ln-number-min"), m = e.getAttribute("data-ln-number-max");
    if (l !== null && p < parseFloat(l) || m !== null && p > parseFloat(m)) return;
    let v;
    if (d !== null)
      v = b($(e), p, d);
    else {
      const A = o !== -1 ? u.slice(o + 1).length : 0;
      if (A > 0) {
        const k = $(e) + "|u" + A;
        y[k] || (y[k] = new Intl.NumberFormat($(e), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = y[k].format(p);
      } else
        v = i.fmt.format(p);
    }
    e.value = v;
    let w = c, E = 0;
    for (let A = 0; A < v.length && w > 0; A++)
      E = A + 1, /[0-9]/.test(v[A]) && w--;
    w > 0 && (E = v.length), e.setSelectionRange(E, E), this._setHiddenRaw(p), T(e, "ln-number:input", { value: p, formatted: v });
  }, s.prototype._setHiddenRaw = function(e) {
    _.set.call(this._hidden, String(e));
  }, s.prototype._displayFormatted = function(e) {
    this.dom.value = b($(this.dom), e, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(s.prototype, "value", {
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
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[a]);
  };
  function n() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + h + "]");
      for (let i = 0; i < e.length; i++) {
        const t = e[i][a];
        t && !isNaN(t.value) && t._displayFormatted(t.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, a, s, "ln-number"), n();
})();
(function() {
  const h = "data-ln-date", a = "lnDate";
  if (window[a] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(o, d) {
    const p = o + "|" + JSON.stringify(d);
    return y[p] || (y[p] = new Intl.DateTimeFormat(o, d)), y[p];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, s = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function n(o) {
    return !o || o === "" ? { dateStyle: "medium" } : o.match(b) ? s[o] : null;
  }
  function e(o, d, p) {
    const l = o.getDate(), m = o.getMonth(), v = o.getFullYear(), w = o.getHours(), E = o.getMinutes(), A = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: g(p, { month: "long" }).format(o),
      MMM: g(p, { month: "short" }).format(o),
      MM: String(m + 1).padStart(2, "0"),
      M: String(m + 1),
      dd: String(l).padStart(2, "0"),
      d: String(l),
      HH: String(w).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(k) {
      return A[k];
    });
  }
  function i(o, d, p) {
    const l = n(d);
    return l ? g(p, l).format(o) : e(o, d, p);
  }
  function t(o) {
    if (o.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", o.tagName), this;
    this.dom = o;
    const d = this, p = o.value, l = o.name, m = document.createElement("input");
    m.type = "hidden", m.name = l, o.removeAttribute("name"), o.insertAdjacentElement("afterend", m), this._hidden = m;
    const v = document.createElement("input");
    v.type = "date", v.tabIndex = -1, v.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", m.insertAdjacentElement("afterend", v), this._picker = v, o.type = "text";
    const w = document.createElement("button");
    if (w.type = "button", w.setAttribute("aria-label", "Open date picker"), w.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', v.insertAdjacentElement("afterend", w), this._btn = w, this._lastISO = "", Object.defineProperty(m, "value", {
      get: function() {
        return _.get.call(m);
      },
      set: function(E) {
        if (_.set.call(m, E), E && E !== "") {
          const A = r(E);
          A && (d._displayFormatted(A), _.set.call(v, E));
        } else E === "" && (d.dom.value = "", _.set.call(v, ""));
      }
    }), this._onPickerChange = function() {
      const E = v.value;
      if (E) {
        const A = r(E);
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
        const k = r(d._lastISO);
        if (k) {
          const I = d.dom.getAttribute(h) || "", F = $(d.dom), D = i(k, I, F);
          if (E === D) return;
        }
      }
      const A = c(E);
      if (A) {
        const k = A.getFullYear(), I = String(A.getMonth() + 1).padStart(2, "0"), F = String(A.getDate()).padStart(2, "0"), D = k + "-" + I + "-" + F;
        d._setHiddenRaw(D), _.set.call(d._picker, D), d._displayFormatted(A), d._lastISO = D, T(d.dom, "ln-date:change", {
          value: D,
          formatted: d.dom.value,
          date: A
        });
      } else if (d._lastISO) {
        const k = r(d._lastISO);
        k && d._displayFormatted(k);
      } else
        d.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, w.addEventListener("click", this._onBtnClick), p && p !== "") {
      const E = r(p);
      E && (this._setHiddenRaw(p), _.set.call(v, p), this._displayFormatted(E), this._lastISO = p);
    }
    return this;
  }
  function r(o) {
    if (!o || typeof o != "string") return null;
    const d = o.split("T"), p = d[0].split("-");
    if (p.length < 3) return null;
    const l = parseInt(p[0], 10), m = parseInt(p[1], 10) - 1, v = parseInt(p[2], 10);
    if (isNaN(l) || isNaN(m) || isNaN(v)) return null;
    let w = 0, E = 0;
    if (d[1]) {
      const k = d[1].split(":");
      w = parseInt(k[0], 10) || 0, E = parseInt(k[1], 10) || 0;
    }
    const A = new Date(l, m, v, w, E);
    return A.getFullYear() !== l || A.getMonth() !== m || A.getDate() !== v ? null : A;
  }
  function c(o) {
    if (!o || typeof o != "string" || (o = o.trim(), o.length < 6)) return null;
    let d, p;
    if (o.indexOf(".") !== -1)
      d = ".", p = o.split(".");
    else if (o.indexOf("/") !== -1)
      d = "/", p = o.split("/");
    else if (o.indexOf("-") !== -1)
      d = "-", p = o.split("-");
    else
      return null;
    if (p.length !== 3) return null;
    const l = [];
    for (let A = 0; A < 3; A++) {
      const k = parseInt(p[A], 10);
      if (isNaN(k)) return null;
      l.push(k);
    }
    let m, v, w;
    d === "." ? (m = l[0], v = l[1], w = l[2]) : d === "/" ? (v = l[0], m = l[1], w = l[2]) : p[0].length === 4 ? (w = l[0], v = l[1], m = l[2]) : (m = l[0], v = l[1], w = l[2]), w < 100 && (w += w < 50 ? 2e3 : 1900);
    const E = new Date(w, v - 1, m);
    return E.getFullYear() !== w || E.getMonth() !== v - 1 || E.getDate() !== m ? null : E;
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
    const d = this.dom.getAttribute(h) || "", p = $(this.dom);
    this.dom.value = i(o, d, p);
  }, Object.defineProperty(t.prototype, "value", {
    get: function() {
      return _.get.call(this._hidden);
    },
    set: function(o) {
      if (!o || o === "") {
        this._setHiddenRaw(""), _.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const d = r(o);
      d && (this._setHiddenRaw(o), _.set.call(this._picker, o), this._displayFormatted(d), this._lastISO = o, T(this.dom, "ln-date:change", {
        value: o,
        formatted: this.dom.value,
        date: d
      }));
    }
  }), Object.defineProperty(t.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? r(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      const d = o.getFullYear(), p = String(o.getMonth() + 1).padStart(2, "0"), l = String(o.getDate()).padStart(2, "0");
      this.value = d + "-" + p + "-" + l;
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
      const o = document.querySelectorAll("[" + h + "]");
      for (let d = 0; d < o.length; d++) {
        const p = o[d][a];
        if (p && p.value) {
          const l = r(p.value);
          l && p._displayFormatted(l);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, a, t, "ln-date"), u();
})();
(function() {
  const h = "data-ln-nav", a = "lnNav";
  if (window[a] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), _ = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const r of _)
        r();
    }, history._lnNavPatched = !0;
  }
  function g(t) {
    if (!t.hasAttribute(h) || y.has(t)) return;
    const r = t.getAttribute(h);
    if (!r) return;
    const c = b(t, r);
    y.set(t, c), t[a] = c;
  }
  function b(t, r) {
    let c = Array.from(t.querySelectorAll("a"));
    n(c, r, window.location.pathname);
    const u = function() {
      c = Array.from(t.querySelectorAll("a")), n(c, r, window.location.pathname);
    };
    window.addEventListener("popstate", u), _.push(u);
    const o = new MutationObserver(function(d) {
      for (const p of d)
        if (p.type === "childList") {
          for (const l of p.addedNodes)
            if (l.nodeType === 1) {
              if (l.tagName === "A")
                c.push(l), n([l], r, window.location.pathname);
              else if (l.querySelectorAll) {
                const m = Array.from(l.querySelectorAll("a"));
                c = c.concat(m), n(m, r, window.location.pathname);
              }
            }
          for (const l of p.removedNodes)
            if (l.nodeType === 1) {
              if (l.tagName === "A")
                c = c.filter(function(m) {
                  return m !== l;
                });
              else if (l.querySelectorAll) {
                const m = Array.from(l.querySelectorAll("a"));
                c = c.filter(function(v) {
                  return !m.includes(v);
                });
              }
            }
        }
    });
    return o.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: r,
      observer: o,
      updateHandler: u,
      destroy: function() {
        o.disconnect(), window.removeEventListener("popstate", u);
        const d = _.indexOf(u);
        d !== -1 && _.splice(d, 1), y.delete(t), delete t[a];
      }
    };
  }
  function s(t) {
    try {
      return new URL(t, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return t.replace(/\/$/, "") || "/";
    }
  }
  function n(t, r, c) {
    const u = s(c);
    for (const o of t) {
      const d = o.getAttribute("href");
      if (!d) continue;
      const p = s(d);
      o.classList.remove(r);
      const l = p === u, m = p !== "/" && u.startsWith(p + "/");
      (l || m) && o.classList.add(r);
    }
  }
  function e() {
    K(function() {
      new MutationObserver(function(r) {
        for (const c of r)
          if (c.type === "childList") {
            for (const u of c.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(h) && g(u), u.querySelectorAll))
                for (const o of u.querySelectorAll("[" + h + "]"))
                  g(o);
          } else c.type === "attributes" && c.target.hasAttribute && c.target.hasAttribute(h) && g(c.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[a] = g;
  function i() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      g(t);
  }
  e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = window.TomSelect;
  if (!h) {
    console.warn("[ln-select] TomSelect not found. Load TomSelect before ln-ashlar."), window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const a = /* @__PURE__ */ new WeakMap();
  function y(s) {
    if (a.has(s)) return;
    const n = s.getAttribute("data-ln-select");
    let e = {};
    if (n && n.trim() !== "")
      try {
        e = JSON.parse(n);
      } catch (r) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", r);
      }
    const t = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: s.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...e };
    try {
      const r = new h(s, t);
      a.set(s, r);
      const c = s.closest("form");
      if (c) {
        const u = () => {
          setTimeout(() => {
            r.clear(), r.clearOptions(), r.sync();
          }, 0);
        };
        c.addEventListener("reset", u), r._lnResetHandler = u, r._lnResetForm = c;
      }
    } catch (r) {
      console.warn("[ln-select] Failed to initialize Tom Select:", r);
    }
  }
  function _(s) {
    const n = a.get(s);
    n && (n._lnResetForm && n._lnResetHandler && n._lnResetForm.removeEventListener("reset", n._lnResetHandler), n.destroy(), a.delete(s));
  }
  function g() {
    for (const s of document.querySelectorAll("select[data-ln-select]"))
      y(s);
  }
  function b() {
    K(function() {
      new MutationObserver(function(n) {
        for (const e of n) {
          if (e.type === "attributes") {
            e.target.matches && e.target.matches("select[data-ln-select]") && y(e.target);
            continue;
          }
          for (const i of e.addedNodes)
            if (i.nodeType === 1 && (i.matches && i.matches("select[data-ln-select]") && y(i), i.querySelectorAll))
              for (const t of i.querySelectorAll("select[data-ln-select]"))
                y(t);
          for (const i of e.removedNodes)
            if (i.nodeType === 1 && (i.matches && i.matches("select[data-ln-select]") && _(i), i.querySelectorAll))
              for (const t of i.querySelectorAll("select[data-ln-select]"))
                _(t);
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
    g(), b();
  }) : (g(), b()), window.lnSelect = {
    initialize: y,
    destroy: _,
    getInstance: function(s) {
      return a.get(s);
    }
  };
})();
(function() {
  const h = "data-ln-tabs", a = "lnTabs";
  if (window[a] !== void 0 && window[a] !== null) return;
  function y() {
    const s = (location.hash || "").replace("#", ""), n = {};
    if (!s) return n;
    for (const e of s.split("&")) {
      const i = e.indexOf(":");
      i > 0 && (n[e.slice(0, i)] = e.slice(i + 1));
    }
    return n;
  }
  function _(s, n) {
    const e = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (e) return e;
    if (s.tagName !== "A") return "";
    const i = s.getAttribute("href") || "";
    if (!i.startsWith("#")) return "";
    const t = i.slice(1);
    if (!t) return "";
    const r = t.split("&");
    if (n)
      for (const o of r) {
        const d = o.indexOf(":");
        if (d > 0 && o.slice(0, d).toLowerCase().trim() === n)
          return o.slice(d + 1).toLowerCase().trim();
      }
    const c = r[r.length - 1] || "", u = c.indexOf(":");
    return (u > 0 ? c.slice(u + 1) : c).toLowerCase().trim();
  }
  function g(s) {
    return this.dom = s, b.call(this), this;
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
    const s = this;
    this._clickHandlers = [];
    for (const n of this.tabs) {
      if (n[a + "Trigger"]) continue;
      const e = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        const t = _(n, s.nsKey);
        if (t)
          if (n.tagName === "A" && i.preventDefault(), s.hashEnabled) {
            const r = y();
            r[s.nsKey] = t;
            const c = Object.keys(r).map(function(u) {
              return u + ":" + r[u];
            }).join("&");
            location.hash === "#" + c ? s.dom.setAttribute("data-ln-tabs-active", t) : location.hash = c;
          } else
            s.dom.setAttribute("data-ln-tabs-active", t);
      };
      n.addEventListener("click", e), n[a + "Trigger"] = e, s._clickHandlers.push({ el: n, handler: e });
    }
    if (this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const n = y();
      s.dom.setAttribute("data-ln-tabs-active", s.nsKey in n ? n[s.nsKey] : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let n = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = ft("tabs", this.dom);
        e !== null && e in this.mapPanels && (n = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", n);
    }
  }
  g.prototype._applyActive = function(s) {
    var n;
    (!s || !(s in this.mapPanels)) && (s = this.defaultKey);
    for (const e in this.mapTabs) {
      const i = this.mapTabs[e];
      e === s ? (i.setAttribute("data-active", ""), i.setAttribute("aria-selected", "true")) : (i.removeAttribute("data-active"), i.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const i = this.mapPanels[e], t = e === s;
      i.classList.toggle("hidden", !t), i.setAttribute("aria-hidden", t ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (n = this.mapPanels[s]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: s, tab: this.mapTabs[s], panel: this.mapPanels[s] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && et("tabs", this.dom, s);
  }, g.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const { el: s, handler: n } of this._clickHandlers)
        s.removeEventListener("click", n), delete s[a + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[a];
    }
  }, B(h, a, g, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(s) {
      const n = s.getAttribute("data-ln-tabs-active");
      s[a]._applyActive(n);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", a = "lnToggle";
  if (window[a] !== void 0) return;
  function y(s) {
    const n = Array.from(s.querySelectorAll("[data-ln-toggle-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-toggle-for") && n.push(s);
    for (const e of n) {
      if (e[a + "Trigger"]) continue;
      const i = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        c.preventDefault();
        const u = e.getAttribute("data-ln-toggle-for"), o = document.getElementById(u);
        if (!o || !o[a]) return;
        const d = e.getAttribute("data-ln-toggle-action") || "toggle";
        if (d === "open")
          o.setAttribute(h, "open");
        else if (d === "close")
          o.setAttribute(h, "close");
        else if (d === "toggle") {
          const p = o.getAttribute(h);
          o.setAttribute(h, p === "open" ? "close" : "open");
        }
      };
      e.addEventListener("click", i), e[a + "Trigger"] = i;
      const t = e.getAttribute("data-ln-toggle-for"), r = document.getElementById(t);
      r && r[a] && e.setAttribute("aria-expanded", r[a].isOpen ? "true" : "false");
    }
  }
  function _(s, n) {
    const e = document.querySelectorAll(
      '[data-ln-toggle-for="' + s.id + '"]'
    );
    for (const i of e)
      i.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function g(s) {
    if (this.dom = s, s.hasAttribute("data-ln-persist")) {
      const n = ft("toggle", s);
      n !== null && s.setAttribute(h, n);
    }
    return this.isOpen = s.getAttribute(h) === "open", this.isOpen && s.classList.add("open"), _(s, this.isOpen), this;
  }
  g.prototype.destroy = function() {
    if (!this.dom[a]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const s = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const n of s)
      n[a + "Trigger"] && (n.removeEventListener("click", n[a + "Trigger"]), delete n[a + "Trigger"]);
    delete this.dom[a];
  };
  function b(s) {
    const n = s[a];
    if (!n) return;
    const i = s.getAttribute(h) === "open";
    if (i !== n.isOpen)
      if (i) {
        if (z(s, "ln-toggle:before-open", { target: s }).defaultPrevented) {
          s.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, s.classList.add("open"), _(s, !0), T(s, "ln-toggle:open", { target: s }), s.hasAttribute("data-ln-persist") && et("toggle", s, "open");
      } else {
        if (z(s, "ln-toggle:before-close", { target: s }).defaultPrevented) {
          s.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, s.classList.remove("open"), _(s, !1), T(s, "ln-toggle:close", { target: s }), s.hasAttribute("data-ln-persist") && et("toggle", s, "close");
      }
  }
  B(h, a, g, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: b,
    onInit: y
  });
})();
(function() {
  const h = "data-ln-accordion", a = "lnAccordion";
  if (window[a] !== void 0) return;
  function y(_) {
    return this.dom = _, this._onToggleOpen = function(g) {
      if (g.detail.target.closest("[data-ln-accordion]") !== _) return;
      const b = _.querySelectorAll("[data-ln-toggle]");
      for (const s of b)
        s !== g.detail.target && s.closest("[data-ln-accordion]") === _ && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      T(_, "ln-accordion:change", { target: g.detail.target });
    }, _.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, y, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", a = "lnDropdown";
  if (window[a] !== void 0) return;
  function y(_) {
    if (this.dom = _, this.toggleEl = _.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = _.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const g = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "true"), g._teleportToBody(), g._addOutsideClickListener(), g._addScrollRepositionListener(), g._addResizeCloseListener(), T(_, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === g.toggleEl && (g.triggerBtn && g.triggerBtn.setAttribute("aria-expanded", "false"), g._removeOutsideClickListener(), g._removeScrollRepositionListener(), g._removeResizeCloseListener(), g._teleportBack(), T(_, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._positionMenu = function() {
    const _ = this.dom.querySelector("[data-ln-toggle-for]");
    if (!_ || !this.toggleEl) return;
    const g = _.getBoundingClientRect(), b = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    b && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const s = this.toggleEl.offsetWidth, n = this.toggleEl.offsetHeight;
    b && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const e = window.innerWidth, i = window.innerHeight, t = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4;
    let r;
    g.bottom + t + n <= i ? r = g.bottom + t : g.top - t - n >= 0 ? r = g.top - t - n : r = Math.max(0, i - n);
    let c;
    g.right - s >= 0 ? c = g.right - s : g.left + s <= e ? c = g.left : c = Math.max(0, e - s), this.toggleEl.style.top = r + "px", this.toggleEl.style.left = c + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, y.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, y.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
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
      _._positionMenu();
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
    this.dom[a] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, y, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", a = "lnPopover", y = "data-ln-popover-for", _ = "data-ln-popover-position";
  if (window[a] !== void 0) return;
  const g = [];
  let b = null;
  function s() {
    b || (b = function(t) {
      if (t.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function n() {
    g.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function e(t) {
    return this.dom = t, this.isOpen = t.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), t.hasAttribute("role") || t.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  e.prototype.open = function(t) {
    this.isOpen || (this.trigger = t || null, this.dom.setAttribute(h, "open"));
  }, e.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, e.prototype.toggle = function(t) {
    this.isOpen ? this.close() : this.open(t);
  }, e.prototype._applyOpen = function(t) {
    this.isOpen = !0, t && (this.trigger = t), this._previousFocus = document.activeElement, this._teleportRestore = xt(this.dom);
    const r = vt(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), p = this.dom.getAttribute(_) || "bottom", l = yt(d, r, p, 8);
      this.dom.style.top = l.top + "px", this.dom.style.left = l.left + "px", this.dom.setAttribute("data-ln-popover-placement", l.placement), this.trigger.setAttribute("aria-expanded", "true");
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
      const d = o.trigger.getBoundingClientRect(), p = vt(o.dom), l = o.dom.getAttribute(_) || "bottom", m = yt(d, p, l, 8);
      o.dom.style.top = m.top + "px", o.dom.style.left = m.left + "px", o.dom.setAttribute("data-ln-popover-placement", m.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), s(), T(this.dom, "ln-popover:open", {
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
    const r = t.getAttribute(y);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", r), this._onClick = function(c) {
      if (c.ctrlKey || c.metaKey || c.button === 1) return;
      c.preventDefault();
      const u = document.getElementById(r);
      !u || !u[a] || u[a].toggle(t);
    }, t.addEventListener("click", this._onClick), this;
  }
  i.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[a + "Trigger"];
  }, B(h, a, e, "ln-popover", {
    onAttributeChange: function(t) {
      const r = t[a];
      if (!r) return;
      const u = t.getAttribute(h) === "open";
      if (u !== r.isOpen)
        if (u) {
          if (z(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: r.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "closed");
            return;
          }
          r._applyOpen(r.trigger);
        } else {
          if (z(t, "ln-popover:before-close", {
            popoverId: t.id,
            target: t,
            trigger: r.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "open");
            return;
          }
          r._applyClose();
        }
    }
  }), B(y, a + "Trigger", i, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", a = "data-ln-tooltip", y = "data-ln-tooltip-position", _ = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[_] !== void 0) return;
  let b = 0, s = null, n = null, e = null, i = null, t = null;
  function r() {
    return s && s.parentNode || (s = document.getElementById(g), s || (s = document.createElement("div"), s.id = g, document.body.appendChild(s))), s;
  }
  function c() {
    t || (t = function(l) {
      l.key === "Escape" && d();
    }, document.addEventListener("keydown", t));
  }
  function u() {
    t && (document.removeEventListener("keydown", t), t = null);
  }
  function o(l) {
    if (e === l) return;
    d();
    const m = l.getAttribute(a) || l.getAttribute("title");
    if (!m) return;
    r(), l.hasAttribute("title") && (i = l.getAttribute("title"), l.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = m, l[_ + "Uid"] || (b += 1, l[_ + "Uid"] = "ln-tooltip-" + b), v.id = l[_ + "Uid"], s.appendChild(v);
    const w = v.offsetWidth, E = v.offsetHeight, A = l.getBoundingClientRect(), k = l.getAttribute(y) || "top", I = yt(A, { width: w, height: E }, k, 6);
    v.style.top = I.top + "px", v.style.left = I.left + "px", v.setAttribute("data-ln-tooltip-placement", I.placement), l.setAttribute("aria-describedby", v.id), n = v, e = l, c();
  }
  function d() {
    if (!n) {
      u();
      return;
    }
    e && (e.removeAttribute("aria-describedby"), i !== null && e.setAttribute("title", i)), i = null, n.parentNode && n.parentNode.removeChild(n), n = null, e = null, u();
  }
  function p(l) {
    return this.dom = l, this._onEnter = function() {
      o(l);
    }, this._onLeave = function() {
      e === l && d();
    }, this._onFocus = function() {
      o(l);
    }, this._onBlur = function() {
      e === l && d();
    }, l.addEventListener("mouseenter", this._onEnter), l.addEventListener("mouseleave", this._onLeave), l.addEventListener("focus", this._onFocus, !0), l.addEventListener("blur", this._onBlur, !0), this;
  }
  p.prototype.destroy = function() {
    const l = this.dom;
    l.removeEventListener("mouseenter", this._onEnter), l.removeEventListener("mouseleave", this._onLeave), l.removeEventListener("focus", this._onFocus, !0), l.removeEventListener("blur", this._onBlur, !0), e === l && d(), delete l[_], delete l[_ + "Uid"], T(l, "ln-tooltip:destroyed", { trigger: l });
  }, B(
    "[" + h + "], [" + a + "][title]",
    _,
    p,
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
  const h = "data-ln-toast", a = "lnToast", y = "ln-toast-item", _ = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, g = { success: "success", error: "error", warn: "warning", info: "info" }, b = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function s() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const l = document.createElement("template");
    l.setAttribute("data-ln-template", "ln-toast-item"), l.innerHTML = It, document.body.appendChild(l);
  }
  function n(l) {
    if (!l || l.nodeType !== 1) return;
    const m = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && m.push(l);
    for (const v of m)
      v[a] || new e(v);
  }
  function e(l) {
    this.dom = l, l[a] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    for (const m of Array.from(l.querySelectorAll("[data-ln-toast-item]")))
      o(m, l);
    return this;
  }
  e.prototype.destroy = function() {
    if (this.dom[a]) {
      for (const l of Array.from(this.dom.children))
        c(l);
      delete this.dom[a];
    }
  };
  function i(l, m) {
    const v = ((l.type || "info") + "").toLowerCase(), w = ot(m, y, "ln-toast");
    if (!w)
      return console.warn('[ln-toast] Template "' + y + '" not found'), null;
    const E = w.firstElementChild;
    if (!E) return null;
    const A = !!(l.message || l.data && l.data.errors);
    J(E, {
      title: l.title || b[v] || b.info,
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
    const F = E.querySelector(".ln-toast__body");
    F && A && t(F, l);
    const D = E.querySelector(".ln-toast__close");
    return D && D.addEventListener("click", function() {
      c(E);
    }), E;
  }
  function t(l, m) {
    if (m.message)
      if (Array.isArray(m.message)) {
        const v = document.createElement("ul");
        for (const w of m.message) {
          const E = document.createElement("li");
          E.textContent = w, v.appendChild(E);
        }
        l.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = m.message, l.appendChild(v);
      }
    if (m.data && m.data.errors) {
      const v = document.createElement("ul");
      for (const w of Object.values(m.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = w, v.appendChild(E);
      }
      l.appendChild(v);
    }
  }
  function r(l, m) {
    for (; l.dom.children.length >= l.max; ) l.dom.removeChild(l.dom.firstElementChild);
    l.dom.appendChild(m), requestAnimationFrame(() => m.classList.add("ln-toast__item--in"));
  }
  function c(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-toast__item--in"), l.classList.add("ln-toast__item--out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function u(l) {
    let m = l && l.container;
    return typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), m || null;
  }
  function o(l, m) {
    const v = ((l.getAttribute("data-type") || "info") + "").toLowerCase(), w = l.getAttribute("data-title"), E = (l.innerText || l.textContent || "").trim(), A = i({
      type: v,
      title: w,
      message: E || void 0
    }, m);
    A && (l.parentNode && l.parentNode.replaceChild(A, l), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function d(l) {
    const m = l.detail || {}, v = u(m);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const w = v[a] || new e(v), E = i(m, v);
    if (!E) return;
    const A = Number.isFinite(m.timeout) ? m.timeout : w.timeoutDefault;
    r(w, E), A > 0 && (E._timer = setTimeout(() => c(E), A));
  }
  function p(l) {
    const m = l && l.detail || {};
    if (m.container) {
      const v = u(m);
      if (v)
        for (const w of Array.from(v.children)) c(w);
    } else {
      const v = document.querySelectorAll("[" + h + "]");
      for (const w of Array.from(v))
        for (const E of Array.from(w.children)) c(E);
    }
  }
  K(function() {
    s(), window.addEventListener("ln-toast:enqueue", d), window.addEventListener("ln-toast:clear", p), new MutationObserver(function(m) {
      for (const v of m) {
        if (v.type === "attributes") {
          n(v.target);
          continue;
        }
        for (const w of v.addedNodes)
          n(w);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), n(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", a = "lnUpload", y = "data-ln-upload-dict", _ = "data-ln-upload-accept", g = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function s() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const o = document.createElement("div");
    o.innerHTML = b;
    const d = o.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[a] !== void 0) return;
  function n(o) {
    if (o === 0) return "0 B";
    const d = 1024, p = ["B", "KB", "MB", "GB"], l = Math.floor(Math.log(o) / Math.log(d));
    return parseFloat((o / Math.pow(d, l)).toFixed(1)) + " " + p[l];
  }
  function e(o) {
    return o.split(".").pop().toLowerCase();
  }
  function i(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "lnc-file-" + o : "ln-file";
  }
  function t(o, d) {
    if (!d) return !0;
    const p = "." + e(o.name);
    return d.split(",").map(function(m) {
      return m.trim().toLowerCase();
    }).includes(p.toLowerCase());
  }
  function r(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true"), s();
    const d = Tt(o, y), p = o.querySelector(".ln-upload__zone"), l = o.querySelector(".ln-upload__list"), m = o.getAttribute(_) || "";
    if (!p || !l) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", o);
      return;
    }
    let v = o.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), m && (v.accept = m.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), o.appendChild(v));
    const w = o.getAttribute(h) || "/files/upload", E = o.getAttribute(g) || "", A = /* @__PURE__ */ new Map();
    let k = 0;
    function I() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function F(R) {
      if (!t(R, m)) {
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
      const W = ct.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", P), J(W, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + X,
        removeLabel: d.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const st = W.querySelector(".ln-upload__progress-bar"), f = W.querySelector('[data-ln-upload-action="remove"]');
      f && (f.disabled = !0), l.appendChild(W);
      const L = new FormData();
      L.append("file", R), L.append("context", E);
      const S = new XMLHttpRequest();
      S.upload.addEventListener("progress", function(C) {
        if (C.lengthComputable) {
          const O = Math.round(C.loaded / C.total * 100);
          st.style.width = O + "%", J(W, { sizeText: O + "%" });
        }
      }), S.addEventListener("load", function() {
        if (S.status >= 200 && S.status < 300) {
          let C;
          try {
            C = JSON.parse(S.responseText);
          } catch {
            x("Invalid response");
            return;
          }
          J(W, { sizeText: n(C.size || R.size), uploading: !1 }), f && (f.disabled = !1), A.set(P, {
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
          x(C);
        }
      }), S.addEventListener("error", function() {
        x(d["network-error"] || "Network error");
      });
      function x(C) {
        st && (st.style.width = "100%"), J(W, { sizeText: d.error || "Error", uploading: !1, error: !0 }), f && (f.disabled = !1), T(o, "ln-upload:error", {
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
      const P = A.get(R), U = l.querySelector('[data-file-id="' + R + '"]');
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
        F(P);
      v.value = "";
    }
    const V = function() {
      v.click();
    }, Q = function() {
      H(this.files);
    }, Z = function(R) {
      R.preventDefault(), R.stopPropagation(), p.classList.add("ln-upload__zone--dragover");
    }, Y = function(R) {
      R.preventDefault(), R.stopPropagation(), p.classList.add("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), p.classList.remove("ln-upload__zone--dragover");
    }, it = function(R) {
      R.preventDefault(), R.stopPropagation(), p.classList.remove("ln-upload__zone--dragover"), H(R.dataTransfer.files);
    }, rt = function(R) {
      const P = R.target.closest('[data-ln-upload-action="remove"]');
      if (!P || !l.contains(P) || P.disabled) return;
      const U = P.closest(".ln-upload__item");
      U && M(U.getAttribute("data-file-id"));
    };
    p.addEventListener("click", V), v.addEventListener("change", Q), p.addEventListener("dragenter", Z), p.addEventListener("dragover", Y), p.addEventListener("dragleave", nt), p.addEventListener("drop", it), l.addEventListener("click", rt), o.lnUploadAPI = {
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
        A.clear(), l.innerHTML = "", D(), T(o, "ln-upload:cleared", {});
      },
      destroy: function() {
        p.removeEventListener("click", V), v.removeEventListener("change", Q), p.removeEventListener("dragenter", Z), p.removeEventListener("dragover", Y), p.removeEventListener("dragleave", nt), p.removeEventListener("drop", it), l.removeEventListener("click", rt), A.clear(), l.innerHTML = "", D(), o.removeAttribute("data-ln-upload-initialized"), delete o.lnUploadAPI;
      }
    };
  }
  function c() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      r(o);
  }
  function u() {
    K(function() {
      new MutationObserver(function(d) {
        for (const p of d)
          if (p.type === "childList") {
            for (const l of p.addedNodes)
              if (l.nodeType === 1) {
                l.hasAttribute(h) && r(l);
                for (const m of l.querySelectorAll("[" + h + "]"))
                  r(m);
              }
          } else p.type === "attributes" && p.target.hasAttribute(h) && r(p.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[a] = {
    init: r,
    initAll: c
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
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
    K(function() {
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
    K(function() {
      new MutationObserver(function(e) {
        for (const i of e) {
          if (i.type === "childList") {
            for (const t of i.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && y(t), t.querySelectorAll))
                for (const r of t.querySelectorAll("a, area"))
                  y(r);
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
  function s() {
    g(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      _();
    }) : _();
  }
  window[h] = {
    process: _
  }, s();
})();
(function() {
  const h = "data-ln-link", a = "lnLink";
  if (window[a] !== void 0) return;
  let y = null;
  function _() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function g(l) {
    y && (y.textContent = l, y.classList.add("ln-link-status--visible"));
  }
  function b() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function s(l, m) {
    if (m.target.closest("a, button, input, select, textarea")) return;
    const v = l.querySelector("a");
    if (!v) return;
    const w = v.getAttribute("href");
    if (!w) return;
    if (m.ctrlKey || m.metaKey || m.button === 1) {
      window.open(w, "_blank");
      return;
    }
    z(l, "ln-link:navigate", { target: l, href: w, link: v }).defaultPrevented || v.click();
  }
  function n(l) {
    const m = l.querySelector("a");
    if (!m) return;
    const v = m.getAttribute("href");
    v && g(v);
  }
  function e() {
    b();
  }
  function i(l) {
    l[a + "Row"] || (l[a + "Row"] = !0, l.querySelector("a") && (l._lnLinkClick = function(m) {
      s(l, m);
    }, l._lnLinkEnter = function() {
      n(l);
    }, l.addEventListener("click", l._lnLinkClick), l.addEventListener("mouseenter", l._lnLinkEnter), l.addEventListener("mouseleave", e)));
  }
  function t(l) {
    l[a + "Row"] && (l._lnLinkClick && l.removeEventListener("click", l._lnLinkClick), l._lnLinkEnter && l.removeEventListener("mouseenter", l._lnLinkEnter), l.removeEventListener("mouseleave", e), delete l._lnLinkClick, delete l._lnLinkEnter, delete l[a + "Row"]);
  }
  function r(l) {
    if (!l[a + "Init"]) return;
    const m = l.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const v = m === "TABLE" && l.querySelector("tbody") || l;
      for (const w of v.querySelectorAll("tr"))
        t(w);
    } else
      t(l);
    delete l[a + "Init"];
  }
  function c(l) {
    if (l[a + "Init"]) return;
    l[a + "Init"] = !0;
    const m = l.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const v = m === "TABLE" && l.querySelector("tbody") || l;
      for (const w of v.querySelectorAll("tr"))
        i(w);
    } else
      i(l);
  }
  function u(l) {
    l.hasAttribute && l.hasAttribute(h) && c(l);
    const m = l.querySelectorAll ? l.querySelectorAll("[" + h + "]") : [];
    for (const v of m)
      c(v);
  }
  function o() {
    K(function() {
      new MutationObserver(function(m) {
        for (const v of m)
          if (v.type === "childList")
            for (const w of v.addedNodes)
              w.nodeType === 1 && (u(w), w.tagName === "TR" && w.closest("[" + h + "]") && i(w));
          else v.type === "attributes" && u(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function d(l) {
    u(l);
  }
  window[a] = { init: d, destroy: r };
  function p() {
    _(), o(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
(function() {
  const h = "[data-ln-progress]", a = "lnProgress";
  if (window[a] !== void 0) return;
  function y(i) {
    _(i);
  }
  function _(i) {
    const t = Array.from(i.querySelectorAll(h));
    for (const r of t)
      r[a] || (r[a] = new g(r));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && !i[a] && (i[a] = new g(i));
  }
  function g(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, e.call(this), s.call(this), n.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[a]);
  };
  function b() {
    K(function() {
      new MutationObserver(function(t) {
        for (const r of t)
          if (r.type === "childList")
            for (const c of r.addedNodes)
              c.nodeType === 1 && _(c);
          else r.type === "attributes" && _(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  b();
  function s() {
    const i = this, t = new MutationObserver(function(r) {
      for (const c of r)
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
    const r = new MutationObserver(function(c) {
      for (const u of c)
        u.attributeName === "data-ln-progress-max" && e.call(i);
    });
    r.observe(t, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
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
  const h = "data-ln-filter", a = "lnFilter", y = "data-ln-filter-initialized", _ = "data-ln-filter-key", g = "data-ln-filter-value", b = "data-ln-filter-hide", s = "data-ln-filter-reset", n = "data-ln-filter-col", e = /* @__PURE__ */ new WeakMap();
  if (window[a] !== void 0) return;
  function i(o) {
    return o.hasAttribute(s) || o.getAttribute(g) === "";
  }
  function t(o) {
    let d = null;
    const p = [];
    for (let l = 0; l < o.inputs.length; l++) {
      const m = o.inputs[l];
      if (m.checked && !i(m)) {
        d === null && (d = m.getAttribute(_));
        const v = m.getAttribute(g);
        v && p.push(v);
      }
    }
    return { key: d, values: p };
  }
  function r(o, d) {
    if (o.length !== d.length) return !0;
    for (let p = 0; p < o.length; p++) if (o[p] !== d[p]) return !0;
    return !1;
  }
  function c(o) {
    const d = o.dom, p = o.colIndex, l = d.querySelector("template");
    if (!l || p === null) return;
    const m = document.getElementById(o.targetId);
    if (!m) return;
    const v = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!v || m.hasAttribute("data-ln-table")) return;
    const w = {}, E = [], A = v.tBodies;
    for (let F = 0; F < A.length; F++) {
      const D = A[F].rows;
      for (let M = 0; M < D.length; M++) {
        const H = D[M].cells[p], V = H ? H.textContent.trim() : "";
        V && !w[V] && (w[V] = !0, E.push(V));
      }
    }
    E.sort(function(F, D) {
      return F.localeCompare(D);
    });
    const k = d.querySelector("[" + _ + "]"), I = k ? k.getAttribute(_) : d.getAttribute("data-ln-filter-key") || "col" + p;
    for (let F = 0; F < E.length; F++) {
      const D = l.content.cloneNode(!0), M = D.querySelector("input");
      M && (M.setAttribute(_, I), M.setAttribute(g, E[F]), Lt(D, { text: E[F] }), d.appendChild(D));
    }
  }
  function u(o) {
    if (o.hasAttribute(y)) return this;
    this.dom = o, this.targetId = o.getAttribute(h);
    const d = o.getAttribute(n);
    this.colIndex = d !== null ? parseInt(d, 10) : null, c(this), this.inputs = Array.from(o.querySelectorAll("[" + _ + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(_) : null, this._lastSnapshot = null;
    const p = this, l = Ct(
      function() {
        p._render();
      },
      function() {
        p._afterRender();
      }
    );
    this._queueRender = l, this._attachHandlers();
    let m = !1;
    if (o.hasAttribute("data-ln-persist")) {
      const v = ft("filter", o);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let w = 0; w < this.inputs.length; w++) {
          const E = this.inputs[w];
          i(E) ? E.checked = !1 : E.getAttribute(_) === v.key && v.values.indexOf(E.getAttribute(g)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        l(), m = !0;
      }
    }
    if (!m) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !i(this.inputs[v])) {
          l();
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
          for (let p = 0; p < o.inputs.length; p++)
            i(o.inputs[p]) || (o.inputs[p].checked = !1);
          d.checked = !0, o._queueRender();
          return;
        }
        if (d.checked)
          for (let p = 0; p < o.inputs.length; p++)
            i(o.inputs[p]) && (o.inputs[p].checked = !1);
        else {
          let p = !1;
          for (let l = 0; l < o.inputs.length; l++)
            if (!i(o.inputs[l]) && o.inputs[l].checked) {
              p = !0;
              break;
            }
          if (!p)
            for (let l = 0; l < o.inputs.length; l++)
              i(o.inputs[l]) && (o.inputs[l].checked = !0);
        }
        o._queueRender();
      }, d.addEventListener("change", d._lnFilterChange));
    });
  }, u.prototype._render = function() {
    const o = this, d = t(this), p = d.key === null || d.values.length === 0, l = [];
    for (let m = 0; m < d.values.length; m++)
      l.push(d.values[m].toLowerCase());
    if (o.colIndex !== null)
      o._filterTableRows(d);
    else {
      const m = document.getElementById(o.targetId);
      if (!m) return;
      const v = m.children;
      for (let w = 0; w < v.length; w++) {
        const E = v[w];
        if (p) {
          E.removeAttribute(b);
          continue;
        }
        const A = E.getAttribute("data-" + d.key);
        E.removeAttribute(b), A !== null && l.indexOf(A.toLowerCase()) === -1 && E.setAttribute(b, "true");
      }
    }
  }, u.prototype._afterRender = function() {
    const o = t(this), d = this._lastSnapshot;
    if (!d || d.key !== o.key || r(d.values, o.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: o.key,
        values: o.values.slice()
      });
      const l = d && d.values.length > 0, m = o.values.length === 0;
      l && m && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: o.key, values: o.values.slice() };
    }
    this.dom.hasAttribute("data-ln-persist") && (o.key && o.values.length > 0 ? et("filter", this.dom, { key: o.key, values: o.values.slice() }) : et("filter", this.dom, null));
  }, u.prototype._dispatchOnBoth = function(o, d) {
    T(this.dom, o, d);
    const p = document.getElementById(this.targetId);
    p && p !== this.dom && T(p, o, d);
  }, u.prototype._filterTableRows = function(o) {
    const d = document.getElementById(this.targetId);
    if (!d) return;
    const p = d.tagName === "TABLE" ? d : d.querySelector("table");
    if (!p || d.hasAttribute("data-ln-table")) return;
    const l = o.key || this._filterKey, m = o.values;
    e.has(p) || e.set(p, {});
    const v = e.get(p);
    if (l && m.length > 0) {
      const k = [];
      for (let I = 0; I < m.length; I++)
        k.push(m[I].toLowerCase());
      v[l] = { col: this.colIndex, values: k };
    } else l && delete v[l];
    const w = Object.keys(v), E = w.length > 0, A = p.tBodies;
    for (let k = 0; k < A.length; k++) {
      const I = A[k].rows;
      for (let F = 0; F < I.length; F++) {
        const D = I[F];
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
            const p = e.get(d), l = this._filterKey;
            l && p[l] && delete p[l], Object.keys(p).length === 0 && e.delete(d);
          }
        }
      }
      this.inputs.forEach(function(o) {
        o._lnFilterChange && (o.removeEventListener("change", o._lnFilterChange), delete o._lnFilterChange), delete o[a + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[a];
    }
  }, B(h, a, u, "ln-filter");
})();
(function() {
  const h = "data-ln-search", a = "lnSearch", y = "data-ln-search-initialized", _ = "data-ln-search-hide";
  if (window[a] !== void 0) return;
  function b(s) {
    if (s.hasAttribute(y)) return this;
    this.dom = s, this.targetId = s.getAttribute(h);
    const n = s.tagName;
    if (this.input = n === "INPUT" || n === "TEXTAREA" ? s : s.querySelector('[name="search"]') || s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]'), this.itemsSelector = s.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const e = this;
      queueMicrotask(function() {
        e._search(e.input.value.trim().toLowerCase());
      });
    }
    return s.setAttribute(y, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const s = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      s.input.value = "", s._search(""), s.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(s._debounceTimer), s._debounceTimer = setTimeout(function() {
        s._search(s.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(s) {
    const n = document.getElementById(this.targetId);
    if (!n || z(n, "ln-search:change", { term: s, targetId: this.targetId }).defaultPrevented) return;
    const i = this.itemsSelector ? n.querySelectorAll(this.itemsSelector) : n.children;
    for (let t = 0; t < i.length; t++) {
      const r = i[t];
      r.removeAttribute(_), s && !r.textContent.replace(/\s+/g, " ").toLowerCase().includes(s) && r.setAttribute(_, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[a] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[a]);
  }, B(h, a, b, "ln-search");
})();
(function() {
  const h = "lnTableSort", a = "data-ln-sort", y = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function _(e) {
    g(e);
  }
  function g(e) {
    const i = Array.from(e.querySelectorAll("table"));
    e.tagName === "TABLE" && i.push(e), i.forEach(function(t) {
      if (t[h]) return;
      const r = Array.from(t.querySelectorAll("th[" + a + "]"));
      r.length && (t[h] = new s(t, r));
    });
  }
  function b(e, i) {
    e.querySelectorAll("[data-ln-sort-icon]").forEach(function(r) {
      const c = r.getAttribute("data-ln-sort-icon");
      i == null ? r.classList.toggle("hidden", c !== null && c !== "") : r.classList.toggle("hidden", c !== i);
    });
  }
  function s(e, i) {
    this.table = e, this.ths = i, this._col = -1, this._dir = null;
    const t = this;
    i.forEach(function(c, u) {
      c[h + "Bound"] || (c[h + "Bound"] = !0, c._lnSortClick = function(o) {
        const d = o.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        d && d !== c || t._handleClick(u, c);
      }, c.addEventListener("click", c._lnSortClick));
    });
    const r = e.closest("[data-ln-table][data-ln-persist]");
    if (r) {
      const c = ft("table-sort", r);
      c && c.dir && c.col >= 0 && c.col < i.length && (this._handleClick(c.col, i[c.col]), c.dir === "desc" && this._handleClick(c.col, i[c.col]));
    }
    return this;
  }
  s.prototype._handleClick = function(e, i) {
    let t;
    this._col !== e ? t = "asc" : this._dir === "asc" ? t = "desc" : this._dir === "desc" ? t = null : t = "asc", this.ths.forEach(function(c) {
      c.removeAttribute(y), b(c, null);
    }), t === null ? (this._col = -1, this._dir = null) : (this._col = e, this._dir = t, i.setAttribute(y, t), b(i, t)), T(this.table, "ln-table:sort", {
      column: e,
      sortType: i.getAttribute(a),
      direction: t
    });
    const r = this.table.closest("[data-ln-table][data-ln-persist]");
    r && (t === null ? et("table-sort", r, null) : et("table-sort", r, { col: e, dir: t }));
  }, s.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(e) {
      e._lnSortClick && (e.removeEventListener("click", e._lnSortClick), delete e._lnSortClick), delete e[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    K(function() {
      new MutationObserver(function(i) {
        i.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(r) {
            r.nodeType === 1 && g(r);
          }) : t.type === "attributes" && g(t.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [a] });
    }, "ln-table-sort");
  }
  window[h] = _, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const h = "data-ln-table", a = "lnTable", y = "data-ln-sort", _ = "data-ln-table-empty";
  if (window[a] !== void 0) return;
  const s = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function n(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("tbody"), this.thead = e.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const i = e.querySelector(".ln-table__toolbar");
    i && e.style.setProperty("--ln-table-toolbar-h", i.offsetHeight + "px");
    const t = this;
    return this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(r) {
      r.preventDefault(), t._searchTerm = r.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch), this._onSort = function(r) {
      t._sortCol = r.detail.direction === null ? -1 : r.detail.column, t._sortDir = r.detail.direction, t._sortType = r.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(r) {
      const c = r.detail.key;
      let u = !1;
      for (let p = 0; p < t.ths.length; p++)
        if (t.ths[p].getAttribute("data-ln-filter-col") === c) {
          u = !0;
          break;
        }
      if (!u) return;
      const o = r.detail.values;
      if (!o || o.length === 0)
        delete t._columnFilters[c];
      else {
        const p = [];
        for (let l = 0; l < o.length; l++)
          p.push(o[l].toLowerCase());
        t._columnFilters[c] = p;
      }
      const d = t.dom.querySelector('th[data-ln-filter-col="' + c + '"]');
      d && (o && o.length > 0 ? d.setAttribute("data-ln-filter-active", "") : d.removeAttribute("data-ln-filter-active")), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(r) {
      if (!r.target.closest("[data-ln-table-clear]")) return;
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
        const p = o[d].querySelector("[data-ln-filter-reset]");
        p && (p.checked = !0, p.dispatchEvent(new Event("change", { bubbles: !0 })));
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
    for (let r = 0; r < i.length; r++)
      t[r] = i[r].getAttribute(y);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let r = 0; r < e.length; r++) {
      const c = e[r], u = [], o = [], d = [];
      for (let p = 0; p < c.cells.length; p++) {
        const l = c.cells[p], m = l.textContent.trim(), v = l.hasAttribute("data-ln-value") ? l.getAttribute("data-ln-value") : m, w = t[p];
        o[p] = m.toLowerCase(), w === "number" || w === "date" ? u[p] = parseFloat(v) || 0 : w === "string" ? u[p] = String(v) : u[p] = null, p < c.cells.length - 1 && d.push(m.toLowerCase());
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
    const e = this._searchTerm, i = this._columnFilters, t = Object.keys(i).length > 0, r = this.ths, c = {};
    if (t)
      for (let l = 0; l < r.length; l++) {
        const m = r[l].getAttribute("data-ln-filter-col");
        m && (c[m] = l);
      }
    if (!e && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(l) {
      if (e && l.searchText.indexOf(e) === -1) return !1;
      if (t)
        for (const m in i) {
          const v = c[m];
          if (v !== void 0 && i[m].indexOf(l.rawTexts[v]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, o = this._sortDir === "desc" ? -1 : 1, d = this._sortType === "number" || this._sortType === "date", p = s ? s.compare : function(l, m) {
      return l < m ? -1 : l > m ? 1 : 0;
    };
    this._filteredData.sort(function(l, m) {
      const v = l.sortKeys[u], w = m.sortKeys[u];
      return d ? (v - w) * o : p(v, w) * o;
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
    const c = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, o = c + u, d = window.scrollY - o, p = Math.max(0, Math.floor(d / t) - 15), l = Math.min(p + Math.ceil(window.innerHeight / t) + 30, i);
    if (p === this._vStart && l === this._vEnd) return;
    this._vStart = p, this._vEnd = l;
    const m = this.ths.length || 1, v = p * t, w = (i - l) * t;
    let E = "";
    v > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + m + '" style="height:' + v + 'px;padding:0;border:none"></td></tr>');
    for (let A = p; A < l; A++) E += e[A].html;
    w > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + m + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = E;
  }, n.prototype._showEmptyState = function() {
    const e = this.ths.length || 1, i = this.dom.querySelector("template[" + _ + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(e)), i && t.appendChild(document.importNode(i.content, !0));
    const r = document.createElement("tr");
    r.className = "ln-table__empty", r.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(r), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, n.prototype.destroy = function() {
    this.dom[a] && (this._disableVirtualScroll(), this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[a]);
  }, B(h, a, n, "ln-table");
})();
(function() {
  const h = "data-ln-circular-progress", a = "lnCircularProgress";
  if (window[a] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", _ = 36, g = 16, b = 2 * Math.PI * g;
  function s(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, e.call(this), t.call(this), i.call(this), r.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  s.prototype.destroy = function() {
    this.dom[a] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[a]);
  };
  function n(r, c) {
    const u = document.createElementNS(y, r);
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
    const r = this, c = new MutationObserver(function(u) {
      for (const o of u)
        (o.attributeName === "data-ln-circular-progress" || o.attributeName === "data-ln-circular-progress-max") && t.call(r);
    });
    c.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = c;
  }
  function t() {
    const r = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, c = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = c > 0 ? r / c * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const o = b - u / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", o);
    const d = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = d !== null ? d : Math.round(u) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: r,
      max: c,
      percentage: u
    });
  }
  B(h, a, s, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", a = "lnSortable", y = "data-ln-sortable-handle";
  if (window[a] !== void 0) return;
  function _(b) {
    this.dom = b, this.isEnabled = b.getAttribute(h) !== "disabled", this._dragging = null, b.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(n) {
      s.isEnabled && s._handlePointerDown(n);
    }, b.addEventListener("pointerdown", this._onPointerDown), this;
  }
  _.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, _.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, _.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[a]);
  }, _.prototype._handlePointerDown = function(b) {
    let s = b.target.closest("[" + y + "]"), n;
    if (s) {
      for (n = s; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (n = b.target; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
      s = n;
    }
    const i = Array.from(this.dom.children).indexOf(n);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: n,
      index: i
    }).defaultPrevented) return;
    b.preventDefault(), s.setPointerCapture(b.pointerId), this._dragging = n, n.classList.add("ln-sortable--dragging"), n.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: n,
      index: i
    });
    const r = this, c = function(o) {
      r._handlePointerMove(o);
    }, u = function(o) {
      r._handlePointerEnd(o), s.removeEventListener("pointermove", c), s.removeEventListener("pointerup", u), s.removeEventListener("pointercancel", u);
    };
    s.addEventListener("pointermove", c), s.addEventListener("pointerup", u), s.addEventListener("pointercancel", u);
  }, _.prototype._handlePointerMove = function(b) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), n = this._dragging;
    for (const e of s)
      e.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const e of s) {
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
    const s = this._dragging, n = Array.from(this.dom.children), e = n.indexOf(s);
    let i = null, t = null;
    for (const r of n) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        i = r, t = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        i = r, t = "after";
        break;
      }
    }
    for (const r of n)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), i && i !== s) {
      t === "before" ? this.dom.insertBefore(s, i) : this.dom.insertBefore(s, i.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(s);
      T(this.dom, "ln-sortable:reordered", {
        item: s,
        oldIndex: e,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function g(b) {
    const s = b[a];
    if (!s) return;
    const n = b.getAttribute(h) !== "disabled";
    n !== s.isEnabled && (s.isEnabled = n, T(b, n ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: b }));
  }
  B(h, a, _, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-confirm", a = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[a] !== void 0) return;
  function g(b) {
    this.dom = b, this.confirming = !1, this.originalText = b.textContent.trim(), this.confirmText = b.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const s = this;
    return this._onClick = function(n) {
      if (!s.confirming)
        n.preventDefault(), n.stopImmediatePropagation(), s._enterConfirm();
      else {
        if (s._submitted) return;
        s._submitted = !0, s._reset();
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
    const b = this, s = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      b._reset();
    }, s);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var b = this.dom.querySelector("svg.ln-icon use");
      b && this.originalIconHref && b.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[a] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[a]);
  }, B(h, a, g, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", a = "lnTranslations";
  if (window[a] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function _(g) {
    this.dom = g, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = g.getAttribute(h + "-default") || "", this.badgesEl = g.querySelector("[" + h + "-active]"), this.menuEl = g.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = g.getAttribute(h + "-locales");
    if (this.locales = y, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const s = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && s.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && s.removeLanguage(n.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  _.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of g) {
      const s = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, _.prototype._detectExisting = function() {
    const g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of g) {
      const s = b.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
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
      const e = bt("ln-translations-menu-item", "ln-translations");
      if (!e) return;
      const i = e.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", n), i.textContent = this.locales[n], i.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(n));
      }), this.menuEl.appendChild(e);
    }
    const s = this.dom.querySelector("[" + h + "-add]");
    s && (s.style.display = b === 0 ? "none" : "");
  }, _.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(b) {
      const s = bt("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", b);
      const e = n.querySelector("span");
      e.textContent = g.locales[b] || b.toUpperCase();
      const i = n.querySelector("button");
      i.setAttribute("aria-label", "Remove " + (g.locales[b] || b.toUpperCase())), i.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.removeLanguage(b));
      }), g.badgesEl.appendChild(s);
    });
  }, _.prototype.addLanguage = function(g, b) {
    if (this.activeLanguages.has(g)) return;
    const s = this.locales[g] || g;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: g,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(g), b = b || {};
    const e = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const i of e) {
      const t = i.getAttribute("data-ln-translatable"), r = i.getAttribute("data-ln-translations-prefix") || "", c = i.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!c) continue;
      const u = c.cloneNode(!1);
      r ? u.name = r + "[trans][" + g + "][" + t + "]" : u.name = "trans[" + g + "][" + t + "]", u.value = b[t] !== void 0 ? b[t] : "", u.removeAttribute("id"), u.placeholder = s + " translation", u.setAttribute("data-ln-translatable-lang", g);
      const o = i.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = o.length > 0 ? o[o.length - 1] : c;
      d.parentNode.insertBefore(u, d.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: g,
      langName: s
    });
  }, _.prototype.removeLanguage = function(g) {
    if (!this.activeLanguages.has(g) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: g
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + g + '"]');
    for (const n of s)
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
    for (const s of b)
      s.getAttribute("data-ln-translatable-lang") !== g && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[a];
  }, B(h, a, _, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", a = "lnAutosave", y = "data-ln-autosave-clear", _ = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[a] !== void 0) return;
  function s(t) {
    const r = n(t);
    if (!r) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = r;
    let c = null;
    function u() {
      const l = Et(t);
      try {
        localStorage.setItem(r, JSON.stringify(l));
      } catch {
        return;
      }
      T(t, "ln-autosave:saved", { target: t, data: l });
    }
    function o() {
      let l;
      try {
        l = localStorage.getItem(r);
      } catch {
        return;
      }
      if (!l) return;
      let m;
      try {
        m = JSON.parse(l);
      } catch {
        return;
      }
      if (z(t, "ln-autosave:before-restore", { target: t, data: m }).defaultPrevented) return;
      const w = At(t, m);
      for (let E = 0; E < w.length; E++)
        w[E].dispatchEvent(new Event("input", { bubbles: !0 })), w[E].dispatchEvent(new Event("change", { bubbles: !0 }));
      T(t, "ln-autosave:restored", { target: t, data: m });
    }
    function d() {
      try {
        localStorage.removeItem(r);
      } catch {
        return;
      }
      T(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(l) {
      const m = l.target;
      e(m) && m.name && u();
    }, this._onChange = function(l) {
      const m = l.target;
      e(m) && m.name && u();
    }, this._onSubmit = function() {
      d();
    }, this._onReset = function() {
      d();
    }, this._onClearClick = function(l) {
      l.target.closest("[" + y + "]") && d();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const p = i(t);
    return p > 0 && (this._onInput = function(l) {
      const m = l.target;
      !e(m) || !m.name || (c !== null && clearTimeout(c), c = setTimeout(u, p));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return c;
    }, o(), this;
  }
  s.prototype.destroy = function() {
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
    const c = t.getAttribute(h) || t.id;
    return c ? g + window.location.pathname + ":" + c : null;
  }
  function e(t) {
    const r = t.tagName;
    return r === "INPUT" || r === "TEXTAREA" || r === "SELECT";
  }
  function i(t) {
    if (!t.hasAttribute(_)) return 0;
    const r = t.getAttribute(_);
    if (r === "" || r === null) return 1e3;
    const c = parseInt(r, 10);
    return isNaN(c) || c < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : c;
  }
  B(h, a, s, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", a = "lnAutoresize";
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
  }, B(h, a, y, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", a = "lnValidate", y = "data-ln-validate-errors", _ = "data-ln-validate-error", g = "ln-validate-valid", b = "ln-validate-invalid", s = {
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
    const i = this, t = e.tagName, r = e.type, c = t === "SELECT" || r === "checkbox" || r === "radio";
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
        const p = d.querySelector("[" + _ + '="' + o + '"]');
        p && p.classList.remove("hidden");
      }
      e.classList.remove(g), e.classList.add(b);
    }, this._onClearCustom = function(u) {
      const o = u.detail && u.detail.error, d = e.closest(".form-element");
      if (o) {
        if (i._customErrors.delete(o), d) {
          const p = d.querySelector("[" + _ + '="' + o + '"]');
          p && p.classList.add("hidden");
        }
      } else
        i._customErrors.forEach(function(p) {
          if (d) {
            const l = d.querySelector("[" + _ + '="' + p + '"]');
            l && l.classList.add("hidden");
          }
        }), i._customErrors.clear();
      i._touched && i.validate();
    }, c || e.addEventListener("input", this._onInput), e.addEventListener("change", this._onChange), e.addEventListener("ln-validate:set-custom", this._onSetCustom), e.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  n.prototype.validate = function() {
    const e = this.dom, i = e.validity, r = e.checkValidity() && this._customErrors.size === 0, c = e.closest(".form-element");
    if (c) {
      const o = c.querySelector("[" + y + "]");
      if (o) {
        const d = o.querySelectorAll("[" + _ + "]");
        for (let p = 0; p < d.length; p++) {
          const l = d[p].getAttribute(_), m = s[l];
          m && (i[m] ? d[p].classList.remove("hidden") : d[p].classList.add("hidden"));
        }
      }
    }
    return e.classList.toggle(g, r), e.classList.toggle(b, !r), T(e, r ? "ln-validate:valid" : "ln-validate:invalid", { target: e, field: e.name }), r;
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
  }, B(h, a, n, "ln-validate");
})();
(function() {
  const h = "data-ln-form", a = "lnForm", y = "data-ln-form-auto", _ = "data-ln-form-debounce", g = "data-ln-validate", b = "lnValidate";
  if (window[a] !== void 0) return;
  function s(n) {
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
  s.prototype._updateSubmitButton = function() {
    const n = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!n.length) return;
    const e = this.dom.querySelectorAll("[" + g + "]");
    let i = !1;
    if (e.length > 0) {
      let t = !1, r = !1;
      for (let c = 0; c < e.length; c++) {
        const u = e[c][b];
        u && u._touched && (t = !0), e[c].checkValidity() || (r = !0);
      }
      i = r || !t;
    }
    for (let t = 0; t < n.length; t++)
      n[t].disabled = i;
  }, s.prototype.fill = function(n) {
    const e = At(this.dom, n);
    for (let i = 0; i < e.length; i++) {
      const t = e[i], r = t.tagName === "SELECT" || t.type === "checkbox" || t.type === "radio";
      t.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, s.prototype.submit = function() {
    const n = this.dom.querySelectorAll("[" + g + "]");
    let e = !0;
    for (let t = 0; t < n.length; t++) {
      const r = n[t][b];
      r && (r.validate() || (e = !1));
    }
    if (!e) return;
    const i = Et(this.dom);
    T(this.dom, "ln-form:submit", { data: i });
  }, s.prototype.reset = function() {
    this.dom.reset();
    const n = this.dom.querySelectorAll("input, textarea, select");
    for (let e = 0; e < n.length; e++) {
      const i = n[e], t = i.tagName === "SELECT" || i.type === "checkbox" || i.type === "radio";
      i.dispatchEvent(new Event(t ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), T(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, s.prototype._resetValidation = function() {
    const n = this.dom.querySelectorAll("[" + g + "]");
    for (let e = 0; e < n.length; e++) {
      const i = n[e][b];
      i && i.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      const n = this.dom.querySelectorAll("[" + g + "]");
      for (let e = 0; e < n.length; e++)
        if (!n[e].checkValidity()) return !1;
      return !0;
    }
  }), s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[a]);
  }, B(h, a, s, "ln-form");
})();
(function() {
  const h = "data-ln-time", a = "lnTime";
  if (window[a] !== void 0) return;
  const y = {}, _ = {};
  function g(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(E, A) {
    const k = (E || "") + "|" + JSON.stringify(A);
    return y[k] || (y[k] = new Intl.DateTimeFormat(E, A)), y[k];
  }
  function s(E) {
    const A = E || "";
    return _[A] || (_[A] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), _[A];
  }
  const n = /* @__PURE__ */ new Set();
  let e = null;
  function i() {
    e || (e = setInterval(r, 6e4));
  }
  function t() {
    e && (clearInterval(e), e = null);
  }
  function r() {
    for (const E of n) {
      if (!document.body.contains(E.dom)) {
        n.delete(E);
        continue;
      }
      l(E);
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
  function p(E, A) {
    const k = Math.floor(Date.now() / 1e3), F = Math.floor(E.getTime() / 1e3) - k, D = Math.abs(F);
    if (D < 10) return s(A).format(0, "second");
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
    return s(A).format(H, M);
  }
  function l(E) {
    const A = E.dom.getAttribute("datetime");
    if (!A) return;
    const k = Number(A);
    if (isNaN(k)) return;
    const I = new Date(k * 1e3), F = E.dom.getAttribute(h) || "short", D = g(E.dom);
    let M;
    switch (F) {
      case "relative":
        M = p(I, D);
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
    E.dom.textContent = M, F !== "full" && (E.dom.title = c(I, D));
  }
  function m(E) {
    return this.dom = E, l(this), E.getAttribute(h) === "relative" && (n.add(this), i()), this;
  }
  m.prototype.render = function() {
    l(this);
  }, m.prototype.destroy = function() {
    n.delete(this), n.size === 0 && t(), delete this.dom[a];
  };
  function v(E) {
    const A = E[a];
    if (!A) return;
    E.getAttribute(h) === "relative" ? (n.add(A), i()) : (n.delete(A), n.size === 0 && t()), l(A);
  }
  function w(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(h) && E[a] && l(E[a]);
  }
  B(h, a, m, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: w
  });
})();
(function() {
  const h = "data-ln-store", a = "lnStore";
  if (window[a] !== void 0) return;
  const y = "ln_app_cache", _ = "_meta", g = "1.0";
  let b = null, s = null;
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
    const f = document.querySelectorAll("[" + h + "]"), L = {};
    for (let S = 0; S < f.length; S++) {
      const x = f[S].getAttribute(h);
      x && (L[x] = {
        indexes: (f[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(C) {
          return C.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function r() {
    return s || (s = new Promise(function(f, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), f(null);
        return;
      }
      const S = t(), x = Object.keys(S), C = indexedDB.open(y);
      C.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), f(null);
      }, C.onsuccess = function(O) {
        const q = O.target.result, N = Array.from(q.objectStoreNames);
        let j = !1;
        N.indexOf(_) === -1 && (j = !0);
        for (let tt = 0; tt < x.length; tt++)
          if (N.indexOf(x[tt]) === -1) {
            j = !0;
            break;
          }
        if (!j) {
          c(q), b = q, f(q);
          return;
        }
        const lt = q.version;
        q.close();
        const dt = indexedDB.open(y, lt + 1);
        dt.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, dt.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), f(null);
        }, dt.onupgradeneeded = function(tt) {
          const G = tt.target.result;
          G.objectStoreNames.contains(_) || G.createObjectStore(_, { keyPath: "key" });
          for (let ht = 0; ht < x.length; ht++) {
            const pt = x[ht];
            if (!G.objectStoreNames.contains(pt)) {
              const St = G.createObjectStore(pt, { keyPath: "id" }), mt = S[pt].indexes;
              for (let ut = 0; ut < mt.length; ut++)
                St.createIndex(mt[ut], mt[ut], { unique: !1 });
            }
          }
        }, dt.onsuccess = function(tt) {
          const G = tt.target.result;
          c(G), b = G, f(G);
        };
      };
    }), s);
  }
  function c(f) {
    f.onversionchange = function() {
      f.close(), b = null, s = null;
    };
  }
  function u() {
    return b ? Promise.resolve(b) : (s = null, r());
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
  function p(f) {
    return o(f, "readonly").then(function(L) {
      return L ? d(L.getAll()) : [];
    });
  }
  function l(f, L) {
    return o(f, "readonly").then(function(S) {
      return S ? d(S.get(L)) : null;
    });
  }
  function m(f, L) {
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
    this.dom = f, this._name = f.getAttribute(h), this._endpoint = f.getAttribute("data-ln-store-endpoint") || "";
    const L = f.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (f.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(C) {
      return C.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, n[this._name] = this;
    const x = this;
    return F(x), Q(x), this;
  }
  function F(f) {
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
    const S = L.data || {}, x = "_temp_" + e(), C = Object.assign({}, S, { id: x });
    m(f._name, C).then(function() {
      return f.totalCount++, T(f.dom, "ln-store:created", {
        store: f._name,
        record: C,
        tempId: x
      }), fetch(f._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(S)
      });
    }).then(function(O) {
      if (!O.ok) throw new Error("HTTP " + O.status);
      return O.json();
    }).then(function(O) {
      return v(f._name, x).then(function() {
        return m(f._name, O);
      }).then(function() {
        T(f.dom, "ln-store:confirmed", {
          store: f._name,
          record: O,
          tempId: x,
          action: "create"
        });
      });
    }).catch(function(O) {
      v(f._name, x).then(function() {
        f.totalCount--, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: C,
          action: "create",
          error: O.message
        });
      });
    });
  }
  function M(f, L) {
    const S = L.id, x = L.data || {}, C = L.expected_version;
    let O = null;
    l(f._name, S).then(function(q) {
      if (!q) throw new Error("Record not found: " + S);
      O = Object.assign({}, q);
      const N = Object.assign({}, q, x);
      return m(f._name, N).then(function() {
        return T(f.dom, "ln-store:updated", {
          store: f._name,
          record: N,
          previous: O
        }), N;
      });
    }).then(function(q) {
      const N = Object.assign({}, x);
      return C && (N.expected_version = C), fetch(f._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(N)
      });
    }).then(function(q) {
      if (q.status === 409)
        return q.json().then(function(N) {
          return m(f._name, O).then(function() {
            T(f.dom, "ln-store:conflict", {
              store: f._name,
              local: O,
              remote: N.current || N,
              field_diffs: N.field_diffs || null
            });
          });
        });
      if (!q.ok) throw new Error("HTTP " + q.status);
      return q.json().then(function(N) {
        return m(f._name, N).then(function() {
          T(f.dom, "ln-store:confirmed", {
            store: f._name,
            record: N,
            action: "update"
          });
        });
      });
    }).catch(function(q) {
      O && m(f._name, O).then(function() {
        T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: O,
          action: "update",
          error: q.message
        });
      });
    });
  }
  function H(f, L) {
    const S = L.id;
    let x = null;
    l(f._name, S).then(function(C) {
      if (C)
        return x = Object.assign({}, C), v(f._name, S).then(function() {
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
        record: x,
        action: "delete"
      });
    }).catch(function(C) {
      x && m(f._name, x).then(function() {
        f.totalCount++, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: x,
          action: "delete",
          error: C.message
        });
      });
    });
  }
  function V(f, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let x = [];
    const C = S.map(function(O) {
      return l(f._name, O);
    });
    Promise.all(C).then(function(O) {
      return x = O.filter(Boolean), rt(f._name, S).then(function() {
        return f.totalCount -= S.length, T(f.dom, "ln-store:deleted", {
          store: f._name,
          ids: S
        }), fetch(f._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: S })
        });
      });
    }).then(function(O) {
      if (!O.ok) throw new Error("HTTP " + O.status);
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: null,
        ids: S,
        action: "bulk-delete"
      });
    }).catch(function(O) {
      x.length > 0 && it(f._name, x).then(function() {
        f.totalCount += x.length, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: null,
          ids: S,
          action: "bulk-delete",
          error: O.message
        });
      });
    });
  }
  function Q(f) {
    r().then(function() {
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
      const S = L.data || [], x = L.synced_at || Math.floor(Date.now() / 1e3);
      return it(f._name, S).then(function() {
        return k(f._name, {
          schema_version: g,
          last_synced_at: x,
          record_count: S.length
        });
      }).then(function() {
        f.isLoaded = !0, f.isSyncing = !1, f.lastSyncedAt = x, f.totalCount = S.length, f._abortController = null, T(f.dom, "ln-store:loaded", {
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
      const x = S.data || [], C = S.deleted || [], O = S.synced_at || Math.floor(Date.now() / 1e3), q = x.length > 0 || C.length > 0;
      let N = Promise.resolve();
      return x.length > 0 && (N = N.then(function() {
        return it(f._name, x);
      })), C.length > 0 && (N = N.then(function() {
        return rt(f._name, C);
      })), N.then(function() {
        return E(f._name);
      }).then(function(j) {
        return f.totalCount = j, k(f._name, {
          schema_version: g,
          last_synced_at: O,
          record_count: j
        });
      }).then(function() {
        f.isSyncing = !1, f.lastSyncedAt = O, f._abortController = null, T(f.dom, "ln-store:synced", {
          store: f._name,
          added: x.length,
          deleted: C.length,
          changed: q
        });
      });
    }).catch(function(S) {
      f.isSyncing = !1, f._abortController = null, S.name !== "AbortError" && T(f.dom, "ln-store:offline", { store: f._name });
    });
  }
  function it(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(x, C) {
          const O = S.transaction(f, "readwrite"), q = O.objectStore(f);
          for (let N = 0; N < L.length; N++)
            q.put(L[N]);
          O.oncomplete = function() {
            x();
          }, O.onerror = function() {
            i(O.error), C(O.error);
          };
        });
    });
  }
  function rt(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(x, C) {
          const O = S.transaction(f, "readwrite"), q = O.objectStore(f);
          for (let N = 0; N < L.length; N++)
            q.delete(L[N]);
          O.oncomplete = function() {
            x();
          }, O.onerror = function() {
            C(O.error);
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
    const S = L.field, x = L.direction === "desc";
    return f.slice().sort(function(C, O) {
      const q = C[S], N = O[S];
      if (q == null && N == null) return 0;
      if (q == null) return x ? 1 : -1;
      if (N == null) return x ? -1 : 1;
      let j;
      return typeof q == "string" && typeof N == "string" ? j = P.compare(q, N) : j = q < N ? -1 : q > N ? 1 : 0, x ? -j : j;
    });
  }
  function X(f, L) {
    if (!L) return f;
    const S = Object.keys(L);
    return S.length === 0 ? f : f.filter(function(x) {
      for (let C = 0; C < S.length; C++) {
        const O = S[C], q = L[O];
        if (!Array.isArray(q) || q.length === 0) continue;
        const N = x[O];
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
  function ct(f, L, S) {
    if (!L || !S || S.length === 0) return f;
    const x = L.toLowerCase();
    return f.filter(function(C) {
      for (let O = 0; O < S.length; O++) {
        const q = C[S[O]];
        if (q != null && String(q).toLowerCase().indexOf(x) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function W(f, L, S) {
    if (f.length === 0) return 0;
    if (S === "count") return f.length;
    let x = 0, C = 0;
    for (let O = 0; O < f.length; O++) {
      const q = parseFloat(f[O][L]);
      isNaN(q) || (x += q, C++);
    }
    return S === "sum" ? x : S === "avg" && C > 0 ? x / C : 0;
  }
  I.prototype.getAll = function(f) {
    const L = this;
    return f = f || {}, p(L._name).then(function(S) {
      const x = S.length;
      f.filters && (S = X(S, f.filters)), f.search && (S = ct(S, f.search, L._searchFields));
      const C = S.length;
      if (f.sort && (S = U(S, f.sort)), f.offset || f.limit) {
        const O = f.offset || 0, q = f.limit || S.length;
        S = S.slice(O, O + q);
      }
      return {
        data: S,
        total: x,
        filtered: C
      };
    });
  }, I.prototype.getById = function(f) {
    return l(this._name, f);
  }, I.prototype.count = function(f) {
    const L = this;
    return f ? p(L._name).then(function(S) {
      return X(S, f).length;
    }) : E(L._name);
  }, I.prototype.aggregate = function(f, L) {
    return p(this._name).then(function(x) {
      return W(x, f, L);
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
      return new Promise(function(S, x) {
        const C = f.transaction(L, "readwrite");
        for (let O = 0; O < L.length; O++)
          C.objectStore(L[O]).clear();
        C.oncomplete = function() {
          S();
        }, C.onerror = function() {
          x(C.error);
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
  B(h, a, I, "ln-store"), window[a].clearAll = st, window[a].init = window[a];
})();
(function() {
  const h = "data-ln-data-table", a = "lnDataTable";
  if (window[a] !== void 0) return;
  const g = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function b(n) {
    return g ? g.format(n) : String(n);
  }
  function s(n) {
    this.dom = n, this.name = n.getAttribute(h) || "", this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-data-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(i) {
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
      const r = t.closest("th");
      if (!r) return;
      const c = r.getAttribute("data-ln-col");
      c && e._handleSort(c, r);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(i) {
      const t = i.target.closest("[data-ln-col-filter]");
      if (!t) return;
      i.stopPropagation();
      const r = t.closest("th");
      if (!r) return;
      const c = r.getAttribute("data-ln-col");
      if (c) {
        if (e._activeDropdown && e._activeDropdown.field === c) {
          e._closeFilterDropdown();
          return;
        }
        e._openFilterDropdown(c, r, t);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      e._activeDropdown && e._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(i) {
      i.target.closest("[data-ln-data-table-clear-all]") && (e.currentFilters = {}, e._updateFilterIndicators(), T(n, "ln-data-table:clear-filters", { table: e.name }), e._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(i) {
        const t = i.target.closest("[data-ln-row-select]");
        if (!t) return;
        const r = t.closest("[data-ln-row]");
        if (!r) return;
        const c = r.getAttribute("data-ln-row-id");
        c != null && (t.checked ? (e.selectedIds.add(c), r.classList.add("ln-row-selected")) : (e.selectedIds.delete(c), r.classList.remove("ln-row-selected")), e.selectedCount = e.selectedIds.size, e._updateSelectAll(), e._updateFooter(), T(n, "ln-data-table:select", {
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
        for (let r = 0; r < t.length; r++) {
          const c = t[r].getAttribute("data-ln-row-id"), u = t[r].querySelector("[data-ln-row-select]");
          c != null && (i ? (e.selectedIds.add(c), t[r].classList.add("ln-row-selected")) : (e.selectedIds.delete(c), t[r].classList.remove("ln-row-selected")), u && (u.checked = i));
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
          const r = i[t].querySelector("[data-ln-row-select]"), c = i[t].getAttribute("data-ln-row-id");
          r && r.checked && c != null && (this.selectedIds.add(c), i[t].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-row-select]") || i.target.closest("[data-ln-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const t = i.target.closest("[data-ln-row]");
      if (!t) return;
      const r = t.getAttribute("data-ln-row-id"), c = t._lnRecord || {};
      T(n, "ln-data-table:row-click", {
        table: e.name,
        id: r,
        record: c
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const t = i.target.closest("[data-ln-row-action]");
      if (!t) return;
      i.stopPropagation();
      const r = t.closest("[data-ln-row]");
      if (!r) return;
      const c = t.getAttribute("data-ln-row-action"), u = r.getAttribute("data-ln-row-id"), o = r._lnRecord || {};
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
              const r = t[e._focusedRowIndex];
              T(n, "ln-data-table:row-click", {
                table: e.name,
                id: r.getAttribute("data-ln-row-id"),
                record: r._lnRecord || {}
              });
            }
            break;
          case " ":
            if (e._selectable && e._focusedRowIndex >= 0 && e._focusedRowIndex < t.length) {
              i.preventDefault();
              const r = t[e._focusedRowIndex].querySelector("[data-ln-row-select]");
              r && (r.checked = !r.checked, r.dispatchEvent(new Event("change", { bubbles: !0 })));
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
  s.prototype._handleSort = function(n, e) {
    let i;
    !this.currentSort || this.currentSort.field !== n ? i = "asc" : this.currentSort.direction === "asc" ? i = "desc" : i = null;
    for (let t = 0; t < this.ths.length; t++)
      this.ths[t].classList.remove("ln-sort-asc", "ln-sort-desc");
    i ? (this.currentSort = { field: n, direction: i }, e.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: n,
      direction: i
    }), this._requestData();
  }, s.prototype._requestData = function() {
    T(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, s.prototype._updateSelectAll = function() {
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
  }, Object.defineProperty(s.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), s.prototype._focusRow = function(n) {
    for (let e = 0; e < n.length; e++)
      n[e].classList.remove("ln-row-focused"), n[e].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const e = n[this._focusedRowIndex];
      e.classList.add("ln-row-focused"), e.setAttribute("tabindex", "0"), e.focus(), e.scrollIntoView({ block: "nearest" });
    }
  }, s.prototype._openFilterDropdown = function(n, e, i) {
    this._closeFilterDropdown();
    const t = ot(this.dom, this.name + "-column-filter", "ln-data-table") || ot(this.dom, "column-filter", "ln-data-table");
    if (!t) return;
    const r = t.firstElementChild;
    if (!r) return;
    const c = this._getUniqueValues(n), u = r.querySelector("[data-ln-filter-options]"), o = r.querySelector("[data-ln-filter-search]"), d = this.currentFilters[n] || [], p = this;
    if (o && c.length <= 8 && o.classList.add("hidden"), u) {
      for (let m = 0; m < c.length; m++) {
        const v = c[m], w = document.createElement("li"), E = document.createElement("label"), A = document.createElement("input");
        A.type = "checkbox", A.value = v, A.checked = d.length === 0 || d.indexOf(v) !== -1, E.appendChild(A), E.appendChild(document.createTextNode(" " + v)), w.appendChild(E), u.appendChild(w);
      }
      u.addEventListener("change", function(m) {
        m.target.type === "checkbox" && p._onFilterChange(n, u);
      });
    }
    o && o.addEventListener("input", function() {
      const m = o.value.toLowerCase(), v = u.querySelectorAll("li");
      for (let w = 0; w < v.length; w++) {
        const E = v[w].textContent.toLowerCase();
        v[w].classList.toggle("hidden", m && E.indexOf(m) === -1);
      }
    });
    const l = r.querySelector("[data-ln-filter-clear]");
    l && l.addEventListener("click", function() {
      delete p.currentFilters[n], p._closeFilterDropdown(), p._updateFilterIndicators(), T(p.dom, "ln-data-table:filter", {
        table: p.name,
        field: n,
        values: []
      }), p._requestData();
    }), e.appendChild(r), this._activeDropdown = { field: n, th: e, el: r }, r.addEventListener("click", function(m) {
      m.stopPropagation();
    });
  }, s.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, s.prototype._onFilterChange = function(n, e) {
    const i = e.querySelectorAll('input[type="checkbox"]'), t = [];
    let r = !0;
    for (let c = 0; c < i.length; c++)
      i[c].checked ? t.push(i[c].value) : r = !1;
    r || t.length === 0 ? delete this.currentFilters[n] : this.currentFilters[n] = t, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: n,
      values: r ? [] : t
    }), this._requestData();
  }, s.prototype._updateFilterOptions = function(n) {
    if (n !== null && typeof n == "object" && !Array.isArray(n)) {
      const e = Object.keys(n);
      for (let i = 0; i < e.length; i++) {
        const t = e[i], r = n[t];
        if (!Array.isArray(r)) continue;
        const c = {}, u = [];
        for (let o = 0; o < r.length; o++) {
          const d = String(r[o]);
          c[d] || (c[d] = !0, u.push(d));
        }
        this._filterOptions[t] = u.sort();
      }
    } else {
      const e = this._filterableFields, i = this._data;
      for (let t = 0; t < e.length; t++) {
        const r = e[t];
        this._filterOptions[r] || (this._filterOptions[r] = []);
        const c = this._filterOptions[r], u = {};
        for (let o = 0; o < c.length; o++)
          u[c[o]] = !0;
        for (let o = 0; o < i.length; o++) {
          const d = i[o][r];
          if (d != null) {
            const p = String(d);
            u[p] || (u[p] = !0, c.push(p));
          }
        }
        c.sort();
      }
    }
  }, s.prototype._getUniqueValues = function(n) {
    return (this._filterOptions[n] || []).slice().sort();
  }, s.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let e = 0; e < n.length; e++) {
      const i = n[e], t = i.getAttribute("data-ln-col");
      if (!t) continue;
      const r = i.querySelector("[data-ln-col-filter]");
      if (!r) continue;
      const c = this.currentFilters[t] && this.currentFilters[t].length > 0;
      r.classList.toggle("ln-filter-active", !!c);
    }
  }, s.prototype._renderRows = function() {
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
  }, s.prototype._renderAll = function() {
    const n = this._data, e = document.createDocumentFragment();
    for (let i = 0; i < n.length; i++) {
      const t = this._buildRow(n[i]);
      if (!t) break;
      e.appendChild(t);
    }
    this.tbody.textContent = "", this.tbody.appendChild(e), this._selectable && this._updateSelectAll();
  }, s.prototype._buildRow = function(n) {
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
  }, s.prototype._enableVirtualScroll = function() {
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
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const n = this._data, e = n.length, i = this._rowHeight;
    if (!i || !e) return;
    const r = this.table.getBoundingClientRect().top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, u = r + c, o = window.scrollY - u, d = Math.max(0, Math.floor(o / i) - 15), p = Math.min(d + Math.ceil(window.innerHeight / i) + 30, e);
    if (d === this._vStart && p === this._vEnd) return;
    this._vStart = d, this._vEnd = p;
    const l = this.ths.length || 1, m = d * i, v = (e - p) * i, w = document.createDocumentFragment();
    if (m > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", l), A.style.height = m + "px", E.appendChild(A), w.appendChild(E);
    }
    for (let E = d; E < p; E++) {
      const A = this._buildRow(n[E]);
      A && w.appendChild(A);
    }
    if (v > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", l), A.style.height = v + "px", E.appendChild(A), w.appendChild(E);
    }
    this.tbody.textContent = "", this.tbody.appendChild(w), this._selectable && this._updateSelectAll();
  }, s.prototype._fillRow = function(n, e) {
    const i = n.querySelectorAll("[data-ln-cell]");
    for (let r = 0; r < i.length; r++) {
      const c = i[r], u = c.getAttribute("data-ln-cell");
      e[u] != null && (c.textContent = e[u]);
    }
    const t = n.querySelectorAll("[data-ln-cell-attr]");
    for (let r = 0; r < t.length; r++) {
      const c = t[r], u = c.getAttribute("data-ln-cell-attr").split(",");
      for (let o = 0; o < u.length; o++) {
        const d = u[o].trim().split(":");
        if (d.length !== 2) continue;
        const p = d[0].trim(), l = d[1].trim();
        e[p] != null && c.setAttribute(l, e[p]);
      }
    }
  }, s.prototype._showEmptyState = function(n) {
    const e = ot(this.dom, n, "ln-data-table");
    this.tbody.textContent = "", e && this.tbody.appendChild(e);
  }, s.prototype._updateFooter = function() {
    const n = this._lastTotal, e = this._lastFiltered, i = e < n;
    if (this._totalSpan && (this._totalSpan.textContent = b(n)), this._filteredSpan && (this._filteredSpan.textContent = i ? b(e) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const t = this.selectedIds.size;
      this._selectedSpan.textContent = t > 0 ? b(t) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", t === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[a] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[a]);
  }, B(h, a, s, "ln-data-table");
})();
(function() {
  const h = "ln-icons-sprite", a = "#ln-", y = "#lnc-", _ = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let b = null;
  const s = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), e = "lni:", i = "lni:v", t = "1";
  function r() {
    try {
      if (localStorage.getItem(i) !== t) {
        for (let m = localStorage.length - 1; m >= 0; m--) {
          const v = localStorage.key(m);
          v && v.indexOf(e) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(i, t);
      }
    } catch {
    }
  }
  r();
  function c() {
    return b || (b = document.getElementById(h), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = h, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function u(m) {
    return m.indexOf(y) === 0 ? n + "/" + m.slice(y.length) + ".svg" : s + "/" + m.slice(a.length) + ".svg";
  }
  function o(m, v) {
    const w = v.match(/viewBox="([^"]+)"/), E = w ? w[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), k = A ? A[1].trim() : "", I = v.match(/<svg([^>]*)>/i), F = I ? I[1] : "", D = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    D.id = m, D.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const H = F.match(new RegExp(M + '="([^"]*)"'));
      H && D.setAttribute(M, H[1]);
    }), D.innerHTML = k, c().querySelector("defs").appendChild(D);
  }
  function d(m) {
    if (_.has(m) || g.has(m) || m.indexOf(y) === 0 && !n) return;
    const v = m.slice(1);
    try {
      const w = localStorage.getItem(e + v);
      if (w) {
        o(v, w), _.add(m);
        return;
      }
    } catch {
    }
    g.add(m), fetch(u(m)).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      o(v, w), _.add(m), g.delete(m);
      try {
        localStorage.setItem(e + v, w);
      } catch {
      }
    }).catch(function() {
      g.delete(m);
    });
  }
  function p(m) {
    const v = 'use[href^="' + a + '"], use[href^="' + y + '"]', w = m.querySelectorAll ? m.querySelectorAll(v) : [];
    if (m.matches && m.matches(v)) {
      const E = m.getAttribute("href");
      E && d(E);
    }
    Array.prototype.forEach.call(w, function(E) {
      const A = E.getAttribute("href");
      A && d(A);
    });
  }
  function l() {
    p(document), new MutationObserver(function(m) {
      m.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(w) {
            w.nodeType === 1 && p(w);
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
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
