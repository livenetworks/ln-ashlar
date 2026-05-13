const _t = {};
function vt(h, c) {
  _t[h] || (_t[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const y = _t[h];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + h + '" not found'), null);
}
function T(h, c, y) {
  h.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: y || {}
  }));
}
function z(h, c, y) {
  const _ = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return h.dispatchEvent(_), _;
}
function J(h, c) {
  if (!h || !c) return h;
  const y = h.querySelectorAll("[data-ln-field]");
  for (let a = 0; a < y.length; a++) {
    const s = y[a], e = s.getAttribute("data-ln-field");
    c[e] != null && (s.textContent = c[e]);
  }
  const _ = h.querySelectorAll("[data-ln-attr]");
  for (let a = 0; a < _.length; a++) {
    const s = _[a], e = s.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < e.length; n++) {
      const t = e[n].trim().split(":");
      if (t.length !== 2) continue;
      const i = t[0].trim(), l = t[1].trim();
      c[l] != null && s.setAttribute(i, c[l]);
    }
  }
  const g = h.querySelectorAll("[data-ln-show]");
  for (let a = 0; a < g.length; a++) {
    const s = g[a], e = s.getAttribute("data-ln-show");
    e in c && s.classList.toggle("hidden", !c[e]);
  }
  const b = h.querySelectorAll("[data-ln-class]");
  for (let a = 0; a < b.length; a++) {
    const s = b[a], e = s.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < e.length; n++) {
      const t = e[n].trim().split(":");
      if (t.length !== 2) continue;
      const i = t[0].trim(), l = t[1].trim();
      l in c && s.classList.toggle(i, !!c[l]);
    }
  }
  return h;
}
function Tt(h, c) {
  if (!h || !c) return h;
  const y = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const _ = y.currentNode;
    _.textContent.indexOf("{{") !== -1 && (_.textContent = _.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(g, b) {
        return c[b] !== void 0 ? c[b] : "";
      }
    ));
  }
  return h;
}
function W(h, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      W(h, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function ot(h, c, y) {
  if (h) {
    const _ = h.querySelector('[data-ln-template="' + c + '"]');
    if (_) return _.content.cloneNode(!0);
  }
  return vt(c, y);
}
function Ct(h, c) {
  const y = {}, _ = h.querySelectorAll("[" + c + "]");
  for (let g = 0; g < _.length; g++)
    y[_[g].getAttribute(c)] = _[g].textContent, _[g].remove();
  return y;
}
function bt(h, c, y, _) {
  if (h.nodeType !== 1) return;
  const b = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", a = Array.from(h.querySelectorAll(b));
  h.matches && h.matches(b) && a.push(h);
  for (const s of a)
    s[y] || (s[y] = new _(s));
}
function at(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function Et(h) {
  const c = {}, y = h.elements;
  for (let _ = 0; _ < y.length; _++) {
    const g = y[_];
    if (!(!g.name || g.disabled || g.type === "file" || g.type === "submit" || g.type === "button"))
      if (g.type === "checkbox")
        c[g.name] || (c[g.name] = []), g.checked && c[g.name].push(g.value);
      else if (g.type === "radio")
        g.checked && (c[g.name] = g.value);
      else if (g.type === "select-multiple") {
        c[g.name] = [];
        for (let b = 0; b < g.options.length; b++)
          g.options[b].selected && c[g.name].push(g.options[b].value);
      } else
        c[g.name] = g.value;
  }
  return c;
}
function At(h, c) {
  const y = h.elements, _ = [];
  for (let g = 0; g < y.length; g++) {
    const b = y[g];
    if (!b.name || !(b.name in c) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const a = c[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(a) ? a.indexOf(b.value) !== -1 : !!a, _.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(a), _.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(a))
        for (let s = 0; s < b.options.length; s++)
          b.options[s].selected = a.indexOf(b.options[s].value) !== -1;
      _.push(b);
    } else
      b.value = a, _.push(b);
  }
  return _;
}
function $(h) {
  const c = h.closest("[lang]");
  return (c ? c.lang : null) || navigator.language;
}
function B(h, c, y, _, g = {}) {
  const b = g.extraAttributes || [], a = g.onAttributeChange || null, s = g.onInit || null;
  function e(n) {
    const t = n || document.body;
    bt(t, h, c, y), s && s(t);
  }
  return W(function() {
    const n = new MutationObserver(function(i) {
      for (let l = 0; l < i.length; l++) {
        const u = i[l];
        if (u.type === "childList")
          for (let o = 0; o < u.addedNodes.length; o++) {
            const d = u.addedNodes[o];
            d.nodeType === 1 && (bt(d, h, c, y), s && s(d));
          }
        else u.type === "attributes" && (a && u.target[c] ? a(u.target, u.attributeName) : (bt(u.target, h, c, y), s && s(u.target)));
      }
    });
    let t = [];
    if (h.indexOf("[") !== -1) {
      const i = /\[([\w-]+)/g;
      let l;
      for (; (l = i.exec(h)) !== null; )
        t.push(l[1]);
    } else
      t.push(h);
    n.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: t.concat(b)
    });
  }, _ || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[c] = e, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    e(document.body);
  }) : e(document.body), e;
}
function kt(h, c) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, h(), c && c();
    }));
  };
}
const Ot = "ln:";
function xt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function wt(h, c) {
  const y = c.getAttribute("data-ln-persist"), _ = y !== null && y !== "" ? y : c.id;
  return _ ? Ot + h + ":" + xt() + ":" + _ : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function ht(h, c) {
  const y = wt(h, c);
  if (!y) return null;
  try {
    const _ = localStorage.getItem(y);
    return _ !== null ? JSON.parse(_) : null;
  } catch {
    return null;
  }
}
function et(h, c, y) {
  const _ = wt(h, c);
  if (_)
    try {
      localStorage.setItem(_, JSON.stringify(y));
    } catch {
    }
}
function ft(h, c, y, _) {
  const g = typeof _ == "number" ? _ : 4, b = window.innerWidth, a = window.innerHeight, s = c.width, e = c.height, n = (y || "bottom").split("-"), t = n[0], i = n[1] === "start" || n[1] === "end" ? n[1] : "center", l = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, u = l[t] || l.bottom;
  function o(v) {
    return v === "top" || v === "bottom" ? i === "start" ? h.left : i === "end" ? h.right - s : h.left + (h.width - s) / 2 : i === "start" ? h.top : i === "end" ? h.bottom - e : h.top + (h.height - e) / 2;
  }
  function d(v) {
    let w, E, A = !0;
    return v === "top" ? (w = h.top - g - e, E = o(v), w < 0 && (A = !1)) : v === "bottom" ? (w = h.bottom + g, E = o(v), w + e > a && (A = !1)) : v === "left" ? (w = o(v), E = h.left - g - s, E < 0 && (A = !1)) : (w = o(v), E = h.right + g, E + s > b && (A = !1)), { top: w, left: E, side: v, fits: A };
  }
  let p = null;
  for (let v = 0; v < u.length; v++) {
    const w = d(u[v]);
    if (w.fits) {
      p = w;
      break;
    }
  }
  p || (p = d(u[0]));
  let r = p.top, m = p.left;
  return s >= b ? m = 0 : (m < 0 && (m = 0), m + s > b && (m = b - s)), e >= a ? r = 0 : (r < 0 && (r = 0), r + e > a && (r = a - e)), { top: r, left: m, placement: p.side };
}
function St(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const c = h.parentNode, y = document.createComment("ln-teleport");
  return c.insertBefore(y, h), document.body.appendChild(h), function() {
    y.parentNode && (y.parentNode.insertBefore(h, y), y.parentNode.removeChild(y));
  };
}
function yt(h) {
  if (!h) return { width: 0, height: 0 };
  const c = h.style, y = c.visibility, _ = c.display, g = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const b = h.offsetWidth, a = h.offsetHeight;
  return c.visibility = y, c.display = _, c.position = g, { width: b, height: a };
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), c = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  function _(n) {
    return typeof n == "string" ? n : n instanceof URL ? n.href : n instanceof Request ? n.url : String(n);
  }
  function g(n, t) {
    return t && t.method ? String(t.method).toUpperCase() : n instanceof Request ? n.method.toUpperCase() : "GET";
  }
  function b(n, t) {
    return t + " " + n;
  }
  function a(n) {
    return n === "GET" || n === "HEAD";
  }
  function s(n, t) {
    t = t || {};
    const i = _(n), l = g(n, t), u = b(i, l);
    a(l) && c.has(u) && (c.get(u).abort(), c.delete(u));
    const o = new AbortController(), d = t.signal;
    d && (d.aborted ? o.abort(d.reason) : d.addEventListener("abort", function() {
      o.abort(d.reason);
    }, { once: !0 }));
    const p = Object.assign({}, t, { signal: o.signal });
    return c.set(u, o), h(n, p).finally(function() {
      c.get(u) === o && c.delete(u);
    });
  }
  s.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = s;
  function e(n) {
    const t = n.detail || {};
    if (!t.url) return;
    const i = n.target, l = (t.method || (t.body ? "POST" : "GET")).toUpperCase(), u = t.key;
    u && y.has(u) && (y.get(u).abort(), y.delete(u));
    const o = new AbortController(), d = t.signal;
    d && (d.aborted ? o.abort(d.reason) : d.addEventListener("abort", function() {
      o.abort(d.reason);
    }, { once: !0 })), u && y.set(u, o);
    const p = { method: l, signal: o.signal };
    t.body !== void 0 && (p.body = t.body), window.fetch(t.url, p).then(function(r) {
      u && y.get(u) === o && y.delete(u), T(i, "ln-http:response", {
        ok: r.ok,
        status: r.status,
        response: r
      });
    }).catch(function(r) {
      u && y.get(u) === o && y.delete(u), !(r && r.name === "AbortError") && T(i, "ln-http:error", {
        ok: !1,
        status: 0,
        error: r
      });
    });
  }
  document.addEventListener("ln-http:request", e), window.lnHttp = {
    cancel: function(n) {
      let t = !1;
      return c.forEach(function(i, l) {
        l.endsWith(" " + n) && (i.abort(), c.delete(l), t = !0);
      }), t;
    },
    cancelByKey: function(n) {
      return y.has(n) ? (y.get(n).abort(), y.delete(n), !0) : !1;
    },
    cancelAll: function() {
      c.forEach(function(n) {
        n.abort();
      }), c.clear(), y.forEach(function(n) {
        n.abort();
      }), y.clear();
    },
    get inflight() {
      const n = [];
      return c.forEach(function(t, i) {
        const l = i.indexOf(" ");
        n.push({ method: i.slice(0, l), url: i.slice(l + 1) });
      }), y.forEach(function(t, i) {
        n.push({ key: i });
      }), n;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", e), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0) return;
  function y(t) {
    if (!t.hasAttribute(h) || t[c]) return;
    t[c] = !0;
    const i = s(t);
    _(i.links), g(i.forms);
  }
  function _(t) {
    for (const i of t) {
      if (i[c + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const l = i.getAttribute("href");
      if (l && l.includes("#")) continue;
      const u = function(o) {
        if (o.ctrlKey || o.metaKey || o.button === 1) return;
        o.preventDefault();
        const d = i.getAttribute("href");
        d && a("GET", d, null, i);
      };
      i.addEventListener("click", u), i[c + "Trigger"] = u;
    }
  }
  function g(t) {
    for (const i of t) {
      if (i[c + "Trigger"]) continue;
      const l = function(u) {
        u.preventDefault();
        const o = i.method.toUpperCase(), d = i.action, p = new FormData(i);
        for (const r of i.querySelectorAll('button, input[type="submit"]'))
          r.disabled = !0;
        a(o, d, p, i, function() {
          for (const r of i.querySelectorAll('button, input[type="submit"]'))
            r.disabled = !1;
        });
      };
      i.addEventListener("submit", l), i[c + "Trigger"] = l;
    }
  }
  function b(t) {
    if (!t[c]) return;
    const i = s(t);
    for (const l of i.links)
      l[c + "Trigger"] && (l.removeEventListener("click", l[c + "Trigger"]), delete l[c + "Trigger"]);
    for (const l of i.forms)
      l[c + "Trigger"] && (l.removeEventListener("submit", l[c + "Trigger"]), delete l[c + "Trigger"]);
    delete t[c];
  }
  function a(t, i, l, u, o) {
    if (z(u, "ln-ajax:before-start", { method: t, url: i }).defaultPrevented) return;
    T(u, "ln-ajax:start", { method: t, url: i }), u.classList.add("ln-ajax--loading");
    const p = document.createElement("span");
    p.className = "ln-ajax-spinner", u.appendChild(p);
    function r() {
      u.classList.remove("ln-ajax--loading");
      const A = u.querySelector(".ln-ajax-spinner");
      A && A.remove(), o && o();
    }
    let m = i;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    l instanceof FormData && w && l.append("_token", w);
    const E = {
      method: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), t === "GET" && l) {
      const A = new URLSearchParams(l);
      m = i + (i.includes("?") ? "&" : "?") + A.toString();
    } else t !== "GET" && l && (E.body = l);
    fetch(m, E).then(function(A) {
      const C = A.ok;
      return A.json().then(function(I) {
        return { ok: C, status: A.status, data: I };
      });
    }).then(function(A) {
      const C = A.data;
      if (A.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const I in C.content) {
            const F = document.getElementById(I);
            F && (F.innerHTML = C.content[I]);
          }
        if (u.tagName === "A") {
          const I = u.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", m);
        T(u, "ln-ajax:success", { method: t, url: m, data: C });
      } else
        T(u, "ln-ajax:error", { method: t, url: m, status: A.status, data: C });
      if (C.message) {
        const I = C.message;
        window.dispatchEvent(new CustomEvent("ln-toast:enqueue", {
          detail: {
            type: I.type || (A.ok ? "success" : "error"),
            title: I.title || "",
            message: I.body || ""
          }
        }));
      }
      T(u, "ln-ajax:complete", { method: t, url: m }), r();
    }).catch(function(A) {
      T(u, "ln-ajax:error", { method: t, url: m, error: A }), T(u, "ln-ajax:complete", { method: t, url: m }), r();
    });
  }
  function s(t) {
    const i = { links: [], forms: [] };
    return t.tagName === "A" && t.getAttribute(h) !== "false" ? i.links.push(t) : t.tagName === "FORM" && t.getAttribute(h) !== "false" ? i.forms.push(t) : (i.links = Array.from(t.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(t.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function e() {
    W(function() {
      new MutationObserver(function(i) {
        for (const l of i)
          if (l.type === "childList") {
            for (const u of l.addedNodes)
              if (u.nodeType === 1 && (y(u), !u.hasAttribute(h))) {
                for (const d of u.querySelectorAll("[" + h + "]"))
                  y(d);
                const o = u.closest && u.closest("[" + h + "]");
                if (o && o.getAttribute(h) !== "false") {
                  const d = s(u);
                  _(d.links), g(d.forms);
                }
              }
          } else l.type === "attributes" && y(l.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function n() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      y(t);
  }
  window[c] = y, window[c].destroy = b, e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function y(a) {
    const s = Array.from(a.querySelectorAll("[data-ln-modal-for]"));
    a.hasAttribute && a.hasAttribute("data-ln-modal-for") && s.push(a);
    for (const e of s) {
      if (e[c + "Trigger"]) continue;
      const n = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        t.preventDefault();
        const i = e.getAttribute("data-ln-modal-for"), l = document.getElementById(i);
        if (!l) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + i + '"');
          return;
        }
        if (!l[c]) return;
        const u = l.getAttribute(h);
        l.setAttribute(h, u === "open" ? "close" : "open");
      };
      e.addEventListener("click", n), e[c + "Trigger"] = n;
    }
  }
  function _(a) {
    this.dom = a, this.isOpen = a.getAttribute(h) === "open";
    const s = this;
    return this._onEscape = function(e) {
      e.key === "Escape" && s.dom.setAttribute(h, "close");
    }, this._onFocusTrap = function(e) {
      if (e.key !== "Tab") return;
      const n = Array.prototype.filter.call(
        s.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        at
      );
      if (n.length === 0) return;
      const t = n[0], i = n[n.length - 1];
      e.shiftKey ? document.activeElement === t && (e.preventDefault(), i.focus()) : document.activeElement === i && (e.preventDefault(), t.focus());
    }, this._onClose = function(e) {
      e.preventDefault(), s.dom.setAttribute(h, "close");
    }, b(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  _.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const a = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of a)
      e[c + "Close"] && (e.removeEventListener("click", e[c + "Close"]), delete e[c + "Close"]);
    const s = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const e of s)
      e[c + "Trigger"] && (e.removeEventListener("click", e[c + "Trigger"]), delete e[c + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
  };
  function g(a) {
    const s = a[c];
    if (!s) return;
    const n = a.getAttribute(h) === "open";
    if (n !== s.isOpen)
      if (n) {
        if (z(a, "ln-modal:before-open", { modalId: a.id, target: a }).defaultPrevented) {
          a.setAttribute(h, "close");
          return;
        }
        s.isOpen = !0, a.setAttribute("aria-modal", "true"), a.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", s._onEscape), document.addEventListener("keydown", s._onFocusTrap);
        const i = document.activeElement;
        s._returnFocusEl = i && i !== document.body ? i : null;
        const l = a.querySelector("[autofocus]");
        if (l && at(l))
          l.focus();
        else {
          const u = a.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), o = Array.prototype.find.call(u, at);
          if (o) o.focus();
          else {
            const d = a.querySelectorAll("a[href], button:not([disabled])"), p = Array.prototype.find.call(d, at);
            p && p.focus();
          }
        }
        T(a, "ln-modal:open", { modalId: a.id, target: a });
      } else {
        if (z(a, "ln-modal:before-close", { modalId: a.id, target: a }).defaultPrevented) {
          a.setAttribute(h, "open");
          return;
        }
        s.isOpen = !1, a.removeAttribute("aria-modal"), document.removeEventListener("keydown", s._onEscape), document.removeEventListener("keydown", s._onFocusTrap), T(a, "ln-modal:close", { modalId: a.id, target: a }), s._returnFocusEl && document.contains(s._returnFocusEl) && typeof s._returnFocusEl.focus == "function" && s._returnFocusEl.focus(), s._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function b(a) {
    const s = a.dom.querySelectorAll("[data-ln-modal-close]");
    for (const e of s)
      e[c + "Close"] || (e.addEventListener("click", a._onClose), e[c + "Close"] = a._onClose);
  }
  B(h, c, _, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: g,
    onInit: y
  });
})();
(function() {
  const h = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(e) {
    if (!y[e]) {
      const n = new Intl.NumberFormat(e, { useGrouping: !0 }), t = n.formatToParts(1234.5);
      let i = "", l = ".";
      for (let u = 0; u < t.length; u++)
        t[u].type === "group" && (i = t[u].value), t[u].type === "decimal" && (l = t[u].value);
      y[e] = { fmt: n, groupSep: i, decimalSep: l };
    }
    return y[e];
  }
  function b(e, n, t) {
    if (t !== null) {
      const i = parseInt(t, 10), l = e + "|d" + i;
      return y[l] || (y[l] = new Intl.NumberFormat(e, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), y[l].format(n);
    }
    return g(e).fmt.format(n);
  }
  function a(e) {
    if (e.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", e.tagName), this;
    this.dom = e;
    const n = document.createElement("input");
    n.type = "hidden", n.name = e.name, e.removeAttribute("name"), e.type = "text", e.setAttribute("inputmode", "decimal"), e.insertAdjacentElement("afterend", n), this._hidden = n;
    const t = this;
    Object.defineProperty(n, "value", {
      get: function() {
        return _.get.call(n);
      },
      set: function(l) {
        _.set.call(n, l), l !== "" && !isNaN(parseFloat(l)) ? t._displayFormatted(parseFloat(l)) : l === "" && (t.dom.value = "");
      }
    }), this._onInput = function() {
      t._handleInput();
    }, e.addEventListener("input", this._onInput), this._onPaste = function(l) {
      l.preventDefault();
      const u = (l.clipboardData || window.clipboardData).getData("text"), o = g($(e)), d = o.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let p = u.replace(new RegExp("[^0-9\\-" + d + ".]", "g"), "");
      o.groupSep && (p = p.split(o.groupSep).join("")), o.decimalSep !== "." && (p = p.replace(o.decimalSep, "."));
      const r = parseFloat(p);
      isNaN(r) ? (e.value = "", t._hidden.value = "") : t.value = r;
    }, e.addEventListener("paste", this._onPaste);
    const i = e.value;
    if (i !== "") {
      const l = parseFloat(i);
      isNaN(l) || (this._displayFormatted(l), _.set.call(n, String(l)));
    }
    return this;
  }
  a.prototype._handleInput = function() {
    const e = this.dom, n = g($(e)), t = e.value;
    if (t === "") {
      this._hidden.value = "", T(e, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (t === "-") {
      this._hidden.value = "";
      return;
    }
    const i = e.selectionStart;
    let l = 0;
    for (let A = 0; A < i; A++)
      /[0-9]/.test(t[A]) && l++;
    let u = t;
    if (n.groupSep && (u = u.split(n.groupSep).join("")), u = u.replace(n.decimalSep, "."), t.endsWith(n.decimalSep) || t.endsWith(".")) {
      const A = u.replace(/\.$/, ""), C = parseFloat(A);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const o = u.indexOf(".");
    if (o !== -1 && u.slice(o + 1).endsWith("0")) {
      const C = parseFloat(u);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const d = e.getAttribute("data-ln-number-decimals");
    if (d !== null && o !== -1) {
      const A = parseInt(d, 10);
      u.slice(o + 1).length > A && (u = u.slice(0, o + 1 + A));
    }
    const p = parseFloat(u);
    if (isNaN(p)) return;
    const r = e.getAttribute("data-ln-number-min"), m = e.getAttribute("data-ln-number-max");
    if (r !== null && p < parseFloat(r) || m !== null && p > parseFloat(m)) return;
    let v;
    if (d !== null)
      v = b($(e), p, d);
    else {
      const A = o !== -1 ? u.slice(o + 1).length : 0;
      if (A > 0) {
        const C = $(e) + "|u" + A;
        y[C] || (y[C] = new Intl.NumberFormat($(e), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = y[C].format(p);
      } else
        v = n.fmt.format(p);
    }
    e.value = v;
    let w = l, E = 0;
    for (let A = 0; A < v.length && w > 0; A++)
      E = A + 1, /[0-9]/.test(v[A]) && w--;
    w > 0 && (E = v.length), e.setSelectionRange(E, E), this._setHiddenRaw(p), T(e, "ln-number:input", { value: p, formatted: v });
  }, a.prototype._setHiddenRaw = function(e) {
    _.set.call(this._hidden, String(e));
  }, a.prototype._displayFormatted = function(e) {
    this.dom.value = b($(this.dom), e, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(a.prototype, "value", {
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
  }), Object.defineProperty(a.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), a.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function s() {
    new MutationObserver(function() {
      const e = document.querySelectorAll("[" + h + "]");
      for (let n = 0; n < e.length; n++) {
        const t = e[n][c];
        t && !isNaN(t.value) && t._displayFormatted(t.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, c, a, "ln-number"), s();
})();
(function() {
  const h = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const y = {}, _ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(o, d) {
    const p = o + "|" + JSON.stringify(d);
    return y[p] || (y[p] = new Intl.DateTimeFormat(o, d)), y[p];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, a = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function s(o) {
    return !o || o === "" ? { dateStyle: "medium" } : o.match(b) ? a[o] : null;
  }
  function e(o, d, p) {
    const r = o.getDate(), m = o.getMonth(), v = o.getFullYear(), w = o.getHours(), E = o.getMinutes(), A = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: g(p, { month: "long" }).format(o),
      MMM: g(p, { month: "short" }).format(o),
      MM: String(m + 1).padStart(2, "0"),
      M: String(m + 1),
      dd: String(r).padStart(2, "0"),
      d: String(r),
      HH: String(w).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return d.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return A[C];
    });
  }
  function n(o, d, p) {
    const r = s(d);
    return r ? g(p, r).format(o) : e(o, d, p);
  }
  function t(o) {
    if (o.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", o.tagName), this;
    this.dom = o;
    const d = this, p = o.value, r = o.name, m = document.createElement("input");
    m.type = "hidden", m.name = r, o.removeAttribute("name"), o.insertAdjacentElement("afterend", m), this._hidden = m;
    const v = document.createElement("input");
    v.type = "date", v.tabIndex = -1, v.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", m.insertAdjacentElement("afterend", v), this._picker = v, o.type = "text";
    const w = document.createElement("button");
    if (w.type = "button", w.setAttribute("aria-label", "Open date picker"), w.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', v.insertAdjacentElement("afterend", w), this._btn = w, this._lastISO = "", Object.defineProperty(m, "value", {
      get: function() {
        return _.get.call(m);
      },
      set: function(E) {
        if (_.set.call(m, E), E && E !== "") {
          const A = i(E);
          A && (d._displayFormatted(A), _.set.call(v, E));
        } else E === "" && (d.dom.value = "", _.set.call(v, ""));
      }
    }), this._onPickerChange = function() {
      const E = v.value;
      if (E) {
        const A = i(E);
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
        const C = i(d._lastISO);
        if (C) {
          const I = d.dom.getAttribute(h) || "", F = $(d.dom), D = n(C, I, F);
          if (E === D) return;
        }
      }
      const A = l(E);
      if (A) {
        const C = A.getFullYear(), I = String(A.getMonth() + 1).padStart(2, "0"), F = String(A.getDate()).padStart(2, "0"), D = C + "-" + I + "-" + F;
        d._setHiddenRaw(D), _.set.call(d._picker, D), d._displayFormatted(A), d._lastISO = D, T(d.dom, "ln-date:change", {
          value: D,
          formatted: d.dom.value,
          date: A
        });
      } else if (d._lastISO) {
        const C = i(d._lastISO);
        C && d._displayFormatted(C);
      } else
        d.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      d._openPicker();
    }, w.addEventListener("click", this._onBtnClick), p && p !== "") {
      const E = i(p);
      E && (this._setHiddenRaw(p), _.set.call(v, p), this._displayFormatted(E), this._lastISO = p);
    }
    return this;
  }
  function i(o) {
    if (!o || typeof o != "string") return null;
    const d = o.split("T"), p = d[0].split("-");
    if (p.length < 3) return null;
    const r = parseInt(p[0], 10), m = parseInt(p[1], 10) - 1, v = parseInt(p[2], 10);
    if (isNaN(r) || isNaN(m) || isNaN(v)) return null;
    let w = 0, E = 0;
    if (d[1]) {
      const C = d[1].split(":");
      w = parseInt(C[0], 10) || 0, E = parseInt(C[1], 10) || 0;
    }
    const A = new Date(r, m, v, w, E);
    return A.getFullYear() !== r || A.getMonth() !== m || A.getDate() !== v ? null : A;
  }
  function l(o) {
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
    const r = [];
    for (let A = 0; A < 3; A++) {
      const C = parseInt(p[A], 10);
      if (isNaN(C)) return null;
      r.push(C);
    }
    let m, v, w;
    d === "." ? (m = r[0], v = r[1], w = r[2]) : d === "/" ? (v = r[0], m = r[1], w = r[2]) : p[0].length === 4 ? (w = r[0], v = r[1], m = r[2]) : (m = r[0], v = r[1], w = r[2]), w < 100 && (w += w < 50 ? 2e3 : 1900);
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
    this.dom.value = n(o, d, p);
  }, Object.defineProperty(t.prototype, "value", {
    get: function() {
      return _.get.call(this._hidden);
    },
    set: function(o) {
      if (!o || o === "") {
        this._setHiddenRaw(""), _.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const d = i(o);
      d && (this._setHiddenRaw(o), _.set.call(this._picker, o), this._displayFormatted(d), this._lastISO = o, T(this.dom, "ln-date:change", {
        value: o,
        formatted: this.dom.value,
        date: d
      }));
    }
  }), Object.defineProperty(t.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? i(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      const d = o.getFullYear(), p = String(o.getMonth() + 1).padStart(2, "0"), r = String(o.getDate()).padStart(2, "0");
      this.value = d + "-" + p + "-" + r;
    }
  }), Object.defineProperty(t.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), t.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const o = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), o && (this.dom.value = o), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function u() {
    new MutationObserver(function() {
      const o = document.querySelectorAll("[" + h + "]");
      for (let d = 0; d < o.length; d++) {
        const p = o[d][c];
        if (p && p.value) {
          const r = i(p.value);
          r && p._displayFormatted(r);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, c, t, "ln-date"), u();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), _ = [];
  if (!history._lnNavPatched) {
    const t = history.pushState;
    history.pushState = function() {
      t.apply(history, arguments);
      for (const i of _)
        i();
    }, history._lnNavPatched = !0;
  }
  function g(t) {
    if (!t.hasAttribute(h) || y.has(t)) return;
    const i = t.getAttribute(h);
    if (!i) return;
    const l = b(t, i);
    y.set(t, l), t[c] = l;
  }
  function b(t, i) {
    let l = Array.from(t.querySelectorAll("a"));
    s(l, i, window.location.pathname);
    const u = function() {
      l = Array.from(t.querySelectorAll("a")), s(l, i, window.location.pathname);
    };
    window.addEventListener("popstate", u), _.push(u);
    const o = new MutationObserver(function(d) {
      for (const p of d)
        if (p.type === "childList") {
          for (const r of p.addedNodes)
            if (r.nodeType === 1) {
              if (r.tagName === "A")
                l.push(r), s([r], i, window.location.pathname);
              else if (r.querySelectorAll) {
                const m = Array.from(r.querySelectorAll("a"));
                l = l.concat(m), s(m, i, window.location.pathname);
              }
            }
          for (const r of p.removedNodes)
            if (r.nodeType === 1) {
              if (r.tagName === "A")
                l = l.filter(function(m) {
                  return m !== r;
                });
              else if (r.querySelectorAll) {
                const m = Array.from(r.querySelectorAll("a"));
                l = l.filter(function(v) {
                  return !m.includes(v);
                });
              }
            }
        }
    });
    return o.observe(t, { childList: !0, subtree: !0 }), {
      navElement: t,
      activeClass: i,
      observer: o,
      updateHandler: u,
      destroy: function() {
        o.disconnect(), window.removeEventListener("popstate", u);
        const d = _.indexOf(u);
        d !== -1 && _.splice(d, 1), y.delete(t), delete t[c];
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
  function s(t, i, l) {
    const u = a(l);
    for (const o of t) {
      const d = o.getAttribute("href");
      if (!d) continue;
      const p = a(d);
      o.classList.remove(i);
      const r = p === u, m = p !== "/" && u.startsWith(p + "/");
      (r || m) && o.classList.add(i);
    }
  }
  function e() {
    W(function() {
      new MutationObserver(function(i) {
        for (const l of i)
          if (l.type === "childList") {
            for (const u of l.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(h) && g(u), u.querySelectorAll))
                for (const o of u.querySelectorAll("[" + h + "]"))
                  g(o);
          } else l.type === "attributes" && l.target.hasAttribute && l.target.hasAttribute(h) && g(l.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[c] = g;
  function n() {
    for (const t of document.querySelectorAll("[" + h + "]"))
      g(t);
  }
  e(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function y() {
    const a = (location.hash || "").replace("#", ""), s = {};
    if (!a) return s;
    for (const e of a.split("&")) {
      const n = e.indexOf(":");
      n > 0 && (s[e.slice(0, n)] = e.slice(n + 1));
    }
    return s;
  }
  function _(a, s) {
    const e = (a.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (e) return e;
    if (a.tagName !== "A") return "";
    const n = a.getAttribute("href") || "";
    if (!n.startsWith("#")) return "";
    const t = n.slice(1);
    if (!t) return "";
    const i = t.split("&");
    if (s)
      for (const o of i) {
        const d = o.indexOf(":");
        if (d > 0 && o.slice(0, d).toLowerCase().trim() === s)
          return o.slice(d + 1).toLowerCase().trim();
      }
    const l = i[i.length - 1] || "", u = l.indexOf(":");
    return (u > 0 ? l.slice(u + 1) : l).toLowerCase().trim();
  }
  function g(a) {
    return this.dom = a, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const s of this.tabs) {
      const e = _(s, this.nsKey);
      e ? this.mapTabs[e] = s : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', s);
    }
    for (const s of this.panels) {
      const e = (s.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      e && (this.mapPanels[e] = s);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const a = this;
    this._clickHandlers = [];
    for (const s of this.tabs) {
      if (s[c + "Trigger"]) continue;
      const e = function(n) {
        if (n.ctrlKey || n.metaKey || n.button === 1) return;
        const t = _(s, a.nsKey);
        if (t)
          if (s.tagName === "A" && n.preventDefault(), a.hashEnabled) {
            const i = y();
            i[a.nsKey] = t;
            const l = Object.keys(i).map(function(u) {
              return u + ":" + i[u];
            }).join("&");
            location.hash === "#" + l ? a.dom.setAttribute("data-ln-tabs-active", t) : location.hash = l;
          } else
            a.dom.setAttribute("data-ln-tabs-active", t);
      };
      s.addEventListener("click", e), s[c + "Trigger"] = e, a._clickHandlers.push({ el: s, handler: e });
    }
    if (this._hashHandler = function() {
      if (!a.hashEnabled) return;
      const s = y();
      a.dom.setAttribute("data-ln-tabs-active", a.nsKey in s ? s[a.nsKey] : a.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let s = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const e = ht("tabs", this.dom);
        e !== null && e in this.mapPanels && (s = e);
      }
      this.dom.setAttribute("data-ln-tabs-active", s);
    }
  }
  g.prototype._applyActive = function(a) {
    var s;
    (!a || !(a in this.mapPanels)) && (a = this.defaultKey);
    for (const e in this.mapTabs) {
      const n = this.mapTabs[e];
      e === a ? (n.setAttribute("data-active", ""), n.setAttribute("aria-selected", "true")) : (n.removeAttribute("data-active"), n.setAttribute("aria-selected", "false"));
    }
    for (const e in this.mapPanels) {
      const n = this.mapPanels[e], t = e === a;
      n.classList.toggle("hidden", !t), n.setAttribute("aria-hidden", t ? "false" : "true");
    }
    if (this.autoFocus) {
      const e = (s = this.mapPanels[a]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      e && setTimeout(() => e.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: a, tab: this.mapTabs[a], panel: this.mapPanels[a] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && et("tabs", this.dom, a);
  }, g.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const { el: a, handler: s } of this._clickHandlers)
        a.removeEventListener("click", s), delete a[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, B(h, c, g, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(a) {
      const s = a.getAttribute("data-ln-tabs-active");
      a[c]._applyActive(s);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function y(a) {
    const s = Array.from(a.querySelectorAll("[data-ln-toggle-for]"));
    a.hasAttribute && a.hasAttribute("data-ln-toggle-for") && s.push(a);
    for (const e of s) {
      if (e[c + "Trigger"]) continue;
      const n = function(l) {
        if (l.ctrlKey || l.metaKey || l.button === 1) return;
        l.preventDefault();
        const u = e.getAttribute("data-ln-toggle-for"), o = document.getElementById(u);
        if (!o || !o[c]) return;
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
      e.addEventListener("click", n), e[c + "Trigger"] = n;
      const t = e.getAttribute("data-ln-toggle-for"), i = document.getElementById(t);
      i && i[c] && e.setAttribute("aria-expanded", i[c].isOpen ? "true" : "false");
    }
  }
  function _(a, s) {
    const e = document.querySelectorAll(
      '[data-ln-toggle-for="' + a.id + '"]'
    );
    for (const n of e)
      n.setAttribute("aria-expanded", s ? "true" : "false");
  }
  function g(a) {
    if (this.dom = a, a.hasAttribute("data-ln-persist")) {
      const s = ht("toggle", a);
      s !== null && a.setAttribute(h, s);
    }
    return this.isOpen = a.getAttribute(h) === "open", this.isOpen && a.classList.add("open"), _(a, this.isOpen), this;
  }
  g.prototype.destroy = function() {
    if (!this.dom[c]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const a = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const s of a)
      s[c + "Trigger"] && (s.removeEventListener("click", s[c + "Trigger"]), delete s[c + "Trigger"]);
    delete this.dom[c];
  };
  function b(a) {
    const s = a[c];
    if (!s) return;
    const n = a.getAttribute(h) === "open";
    if (n !== s.isOpen)
      if (n) {
        if (z(a, "ln-toggle:before-open", { target: a }).defaultPrevented) {
          a.setAttribute(h, "close");
          return;
        }
        s.isOpen = !0, a.classList.add("open"), _(a, !0), T(a, "ln-toggle:open", { target: a }), a.hasAttribute("data-ln-persist") && et("toggle", a, "open");
      } else {
        if (z(a, "ln-toggle:before-close", { target: a }).defaultPrevented) {
          a.setAttribute(h, "open");
          return;
        }
        s.isOpen = !1, a.classList.remove("open"), _(a, !1), T(a, "ln-toggle:close", { target: a }), a.hasAttribute("data-ln-persist") && et("toggle", a, "close");
      }
  }
  B(h, c, g, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: b,
    onInit: y
  });
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
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
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, y, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
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
    this.dom[c] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, y, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", c = "lnPopover", y = "data-ln-popover-for", _ = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const g = [];
  let b = null;
  function a() {
    b || (b = function(t) {
      if (t.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function s() {
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
    this.isOpen = !0, t && (this.trigger = t), this._previousFocus = document.activeElement, this._teleportRestore = St(this.dom);
    const i = yt(this.dom);
    if (this.trigger) {
      const d = this.trigger.getBoundingClientRect(), p = this.dom.getAttribute(_) || "bottom", r = ft(d, i, p, 8);
      this.dom.style.top = r.top + "px", this.dom.style.left = r.left + "px", this.dom.setAttribute("data-ln-popover-placement", r.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const l = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), u = Array.prototype.find.call(l, at);
    u ? u.focus() : this.dom.focus();
    const o = this;
    this._boundDocClick = function(d) {
      o.dom.contains(d.target) || o.trigger && o.trigger.contains(d.target) || o.close();
    }, o._docClickTimeout = setTimeout(function() {
      o._docClickTimeout = null, document.addEventListener("click", o._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!o.trigger) return;
      const d = o.trigger.getBoundingClientRect(), p = yt(o.dom), r = o.dom.getAttribute(_) || "bottom", m = ft(d, p, r, 8);
      o.dom.style.top = m.top + "px", o.dom.style.left = m.left + "px", o.dom.setAttribute("data-ln-popover-placement", m.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), a(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, e.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const t = g.indexOf(this);
    t !== -1 && g.splice(t, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, e.prototype.destroy = function() {
    this.dom[c] && (this.isOpen && this._applyClose(), delete this.dom[c], T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function n(t) {
    this.dom = t;
    const i = t.getAttribute(y);
    return t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", "false"), t.setAttribute("aria-controls", i), this._onClick = function(l) {
      if (l.ctrlKey || l.metaKey || l.button === 1) return;
      l.preventDefault();
      const u = document.getElementById(i);
      !u || !u[c] || u[c].toggle(t);
    }, t.addEventListener("click", this._onClick), this;
  }
  n.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[c + "Trigger"];
  }, B(h, c, e, "ln-popover", {
    onAttributeChange: function(t) {
      const i = t[c];
      if (!i) return;
      const u = t.getAttribute(h) === "open";
      if (u !== i.isOpen)
        if (u) {
          if (z(t, "ln-popover:before-open", {
            popoverId: t.id,
            target: t,
            trigger: i.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "closed");
            return;
          }
          i._applyOpen(i.trigger);
        } else {
          if (z(t, "ln-popover:before-close", {
            popoverId: t.id,
            target: t,
            trigger: i.trigger
          }).defaultPrevented) {
            t.setAttribute(h, "open");
            return;
          }
          i._applyClose();
        }
    }
  }), B(y, c + "Trigger", n, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", c = "data-ln-tooltip", y = "data-ln-tooltip-position", _ = "lnTooltipEnhance", g = "ln-tooltip-portal";
  if (window[_] !== void 0) return;
  let b = 0, a = null, s = null, e = null, n = null, t = null;
  function i() {
    return a && a.parentNode || (a = document.getElementById(g), a || (a = document.createElement("div"), a.id = g, document.body.appendChild(a))), a;
  }
  function l() {
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
    const m = r.getAttribute(c) || r.getAttribute("title");
    if (!m) return;
    i(), r.hasAttribute("title") && (n = r.getAttribute("title"), r.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = m, r[_ + "Uid"] || (b += 1, r[_ + "Uid"] = "ln-tooltip-" + b), v.id = r[_ + "Uid"], a.appendChild(v);
    const w = v.offsetWidth, E = v.offsetHeight, A = r.getBoundingClientRect(), C = r.getAttribute(y) || "top", I = ft(A, { width: w, height: E }, C, 6);
    v.style.top = I.top + "px", v.style.left = I.left + "px", v.setAttribute("data-ln-tooltip-placement", I.placement), r.setAttribute("aria-describedby", v.id), s = v, e = r, l();
  }
  function d() {
    if (!s) {
      u();
      return;
    }
    e && (e.removeAttribute("aria-describedby"), n !== null && e.setAttribute("title", n)), n = null, s.parentNode && s.parentNode.removeChild(s), s = null, e = null, u();
  }
  function p(r) {
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
  p.prototype.destroy = function() {
    const r = this.dom;
    r.removeEventListener("mouseenter", this._onEnter), r.removeEventListener("mouseleave", this._onLeave), r.removeEventListener("focus", this._onFocus, !0), r.removeEventListener("blur", this._onBlur, !0), e === r && d(), delete r[_], delete r[_ + "Uid"], T(r, "ln-tooltip:destroyed", { trigger: r });
  }, B(
    "[" + h + "], [" + c + "][title]",
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
  const h = "data-ln-toast", c = "lnToast", y = "ln-toast-item", _ = { success: "circle-check", error: "circle-x", warn: "alert-triangle", info: "info-circle" }, g = { success: "success", error: "error", warn: "warning", info: "info" }, b = { success: "Success", error: "Error", warn: "Warning", info: "Information" };
  if (window.__lnToastLoaded) return;
  window.__lnToastLoaded = !0;
  function a() {
    if (document.querySelector('[data-ln-template="ln-toast-item"]') || !document.body) return;
    const r = document.createElement("template");
    r.setAttribute("data-ln-template", "ln-toast-item"), r.innerHTML = It, document.body.appendChild(r);
  }
  function s(r) {
    if (!r || r.nodeType !== 1) return;
    const m = Array.from(r.querySelectorAll("[" + h + "]"));
    r.hasAttribute && r.hasAttribute(h) && m.push(r);
    for (const v of m)
      v[c] || new e(v);
  }
  function e(r) {
    this.dom = r, r[c] = this, this.timeoutDefault = parseInt(r.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(r.getAttribute("data-ln-toast-max") || "5", 10);
    for (const m of Array.from(r.querySelectorAll("[data-ln-toast-item]")))
      o(m, r);
    return this;
  }
  e.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const r of Array.from(this.dom.children))
        l(r);
      delete this.dom[c];
    }
  };
  function n(r, m) {
    const v = ((r.type || "info") + "").toLowerCase(), w = ot(m, y, "ln-toast");
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
    const C = E.querySelector(".ln-toast__card");
    C && C.classList.add(g[v] || "info");
    const I = E.querySelector(".ln-toast__side");
    if (I) {
      const M = I.querySelector("use");
      M && M.setAttribute("href", "#ln-" + (_[v] || _.info));
    }
    const F = E.querySelector(".ln-toast__body");
    F && A && t(F, r);
    const D = E.querySelector(".ln-toast__close");
    return D && D.addEventListener("click", function() {
      l(E);
    }), E;
  }
  function t(r, m) {
    if (m.message)
      if (Array.isArray(m.message)) {
        const v = document.createElement("ul");
        for (const w of m.message) {
          const E = document.createElement("li");
          E.textContent = w, v.appendChild(E);
        }
        r.appendChild(v);
      } else {
        const v = document.createElement("p");
        v.textContent = m.message, r.appendChild(v);
      }
    if (m.data && m.data.errors) {
      const v = document.createElement("ul");
      for (const w of Object.values(m.data.errors).flat()) {
        const E = document.createElement("li");
        E.textContent = w, v.appendChild(E);
      }
      r.appendChild(v);
    }
  }
  function i(r, m) {
    for (; r.dom.children.length >= r.max; ) r.dom.removeChild(r.dom.firstElementChild);
    r.dom.appendChild(m), requestAnimationFrame(() => m.classList.add("ln-toast__item--in"));
  }
  function l(r) {
    !r || !r.parentNode || (clearTimeout(r._timer), r.classList.remove("ln-toast__item--in"), r.classList.add("ln-toast__item--out"), setTimeout(() => {
      r.parentNode && r.parentNode.removeChild(r);
    }, 200));
  }
  function u(r) {
    let m = r && r.container;
    return typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), m || null;
  }
  function o(r, m) {
    const v = ((r.getAttribute("data-type") || "info") + "").toLowerCase(), w = r.getAttribute("data-title"), E = (r.innerText || r.textContent || "").trim(), A = n({
      type: v,
      title: w,
      message: E || void 0
    }, m);
    A && (r.parentNode && r.parentNode.replaceChild(A, r), requestAnimationFrame(() => A.classList.add("ln-toast__item--in")));
  }
  function d(r) {
    const m = r.detail || {}, v = u(m);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    const w = v[c] || new e(v), E = n(m, v);
    if (!E) return;
    const A = Number.isFinite(m.timeout) ? m.timeout : w.timeoutDefault;
    i(w, E), A > 0 && (E._timer = setTimeout(() => l(E), A));
  }
  function p(r) {
    const m = r && r.detail || {};
    if (m.container) {
      const v = u(m);
      if (v)
        for (const w of Array.from(v.children)) l(w);
    } else {
      const v = document.querySelectorAll("[" + h + "]");
      for (const w of Array.from(v))
        for (const E of Array.from(w.children)) l(E);
    }
  }
  W(function() {
    a(), window.addEventListener("ln-toast:enqueue", d), window.addEventListener("ln-toast:clear", p), new MutationObserver(function(m) {
      for (const v of m) {
        if (v.type === "attributes") {
          s(v.target);
          continue;
        }
        for (const w of v.addedNodes)
          s(w);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] }), s(document.body);
  }, "ln-toast");
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", y = "data-ln-upload-dict", _ = "data-ln-upload-accept", g = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function a() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const o = document.createElement("div");
    o.innerHTML = b;
    const d = o.firstElementChild;
    d && document.body.appendChild(d);
  }
  if (window[c] !== void 0) return;
  function s(o) {
    if (o === 0) return "0 B";
    const d = 1024, p = ["B", "KB", "MB", "GB"], r = Math.floor(Math.log(o) / Math.log(d));
    return parseFloat((o / Math.pow(d, r)).toFixed(1)) + " " + p[r];
  }
  function e(o) {
    return o.split(".").pop().toLowerCase();
  }
  function n(o) {
    return o === "docx" && (o = "doc"), ["pdf", "doc", "epub"].includes(o) ? "lnc-file-" + o : "ln-file";
  }
  function t(o, d) {
    if (!d) return !0;
    const p = "." + e(o.name);
    return d.split(",").map(function(m) {
      return m.trim().toLowerCase();
    }).includes(p.toLowerCase());
  }
  function i(o) {
    if (o.hasAttribute("data-ln-upload-initialized")) return;
    o.setAttribute("data-ln-upload-initialized", "true"), a();
    const d = Ct(o, y), p = o.querySelector(".ln-upload__zone"), r = o.querySelector(".ln-upload__list"), m = o.getAttribute(_) || "";
    if (!p || !r) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", o);
      return;
    }
    let v = o.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), m && (v.accept = m.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), o.appendChild(v));
    const w = o.getAttribute(h) || "/files/upload", E = o.getAttribute(g) || "", A = /* @__PURE__ */ new Map();
    let C = 0;
    function I() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function F(R) {
      if (!t(R, m)) {
        const k = d["invalid-type"];
        T(o, "ln-upload:invalid", {
          file: R,
          message: k
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: d["invalid-title"] || "Invalid File",
          message: k || d["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const P = "file-" + ++C, U = e(R.name), X = n(U), ct = ot(o, "ln-upload-item", "ln-upload");
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
      S.upload.addEventListener("progress", function(k) {
        if (k.lengthComputable) {
          const O = Math.round(k.loaded / k.total * 100);
          st.style.width = O + "%", J(K, { sizeText: O + "%" });
        }
      }), S.addEventListener("load", function() {
        if (S.status >= 200 && S.status < 300) {
          let k;
          try {
            k = JSON.parse(S.responseText);
          } catch {
            x("Invalid response");
            return;
          }
          J(K, { sizeText: s(k.size || R.size), uploading: !1 }), f && (f.disabled = !1), A.set(P, {
            serverId: k.id,
            name: k.name,
            size: k.size
          }), D(), T(o, "ln-upload:uploaded", {
            localId: P,
            serverId: k.id,
            name: k.name
          });
        } else {
          let k = d["upload-failed"] || "Upload failed";
          try {
            k = JSON.parse(S.responseText).message || k;
          } catch {
          }
          x(k);
        }
      }), S.addEventListener("error", function() {
        x(d["network-error"] || "Network error");
      });
      function x(k) {
        st && (st.style.width = "100%"), J(K, { sizeText: d.error || "Error", uploading: !1, error: !0 }), f && (f.disabled = !1), T(o, "ln-upload:error", {
          file: R,
          message: k
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: d["error-title"] || "Upload Error",
          message: k || d["upload-failed"] || "Failed to upload file"
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
      if (!P || !r.contains(P) || P.disabled) return;
      const U = P.closest(".ln-upload__item");
      U && M(U.getAttribute("data-file-id"));
    };
    p.addEventListener("click", V), v.addEventListener("change", Q), p.addEventListener("dragenter", Z), p.addEventListener("dragover", Y), p.addEventListener("dragleave", nt), p.addEventListener("drop", it), r.addEventListener("click", rt), o.lnUploadAPI = {
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
        p.removeEventListener("click", V), v.removeEventListener("change", Q), p.removeEventListener("dragenter", Z), p.removeEventListener("dragover", Y), p.removeEventListener("dragleave", nt), p.removeEventListener("drop", it), r.removeEventListener("click", rt), A.clear(), r.innerHTML = "", D(), o.removeAttribute("data-ln-upload-initialized"), delete o.lnUploadAPI;
      }
    };
  }
  function l() {
    for (const o of document.querySelectorAll("[" + h + "]"))
      i(o);
  }
  function u() {
    W(function() {
      new MutationObserver(function(d) {
        for (const p of d)
          if (p.type === "childList") {
            for (const r of p.addedNodes)
              if (r.nodeType === 1) {
                r.hasAttribute(h) && i(r);
                for (const m of r.querySelectorAll("[" + h + "]"))
                  i(m);
              }
          } else p.type === "attributes" && p.target.hasAttribute(h) && i(p.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[c] = {
    init: i,
    initAll: l
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function c(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function y(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !c(s)) return;
    s.target = "_blank";
    const e = (s.rel || "").split(/\s+/).filter(Boolean);
    e.includes("noopener") || e.push("noopener"), e.includes("noreferrer") || e.push("noreferrer"), s.rel = e.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", s.appendChild(n), s.setAttribute("data-ln-external-link", "processed"), T(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function _(s) {
    s = s || document.body;
    for (const e of s.querySelectorAll("a, area"))
      y(e);
  }
  function g() {
    W(function() {
      document.body.addEventListener("click", function(s) {
        const e = s.target.closest("a, area");
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
        for (const n of e) {
          if (n.type === "childList") {
            for (const t of n.addedNodes)
              if (t.nodeType === 1 && (t.matches && (t.matches("a") || t.matches("area")) && y(t), t.querySelectorAll))
                for (const i of t.querySelectorAll("a, area"))
                  y(i);
          }
          if (n.type === "attributes" && n.attributeName === "href") {
            const t = n.target;
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
  window[h] = {
    process: _
  }, a();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
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
  function a(r, m) {
    if (m.target.closest("a, button, input, select, textarea")) return;
    const v = r.querySelector("a");
    if (!v) return;
    const w = v.getAttribute("href");
    if (!w) return;
    if (m.ctrlKey || m.metaKey || m.button === 1) {
      window.open(w, "_blank");
      return;
    }
    z(r, "ln-link:navigate", { target: r, href: w, link: v }).defaultPrevented || v.click();
  }
  function s(r) {
    const m = r.querySelector("a");
    if (!m) return;
    const v = m.getAttribute("href");
    v && g(v);
  }
  function e() {
    b();
  }
  function n(r) {
    r[c + "Row"] || (r[c + "Row"] = !0, r.querySelector("a") && (r._lnLinkClick = function(m) {
      a(r, m);
    }, r._lnLinkEnter = function() {
      s(r);
    }, r.addEventListener("click", r._lnLinkClick), r.addEventListener("mouseenter", r._lnLinkEnter), r.addEventListener("mouseleave", e)));
  }
  function t(r) {
    r[c + "Row"] && (r._lnLinkClick && r.removeEventListener("click", r._lnLinkClick), r._lnLinkEnter && r.removeEventListener("mouseenter", r._lnLinkEnter), r.removeEventListener("mouseleave", e), delete r._lnLinkClick, delete r._lnLinkEnter, delete r[c + "Row"]);
  }
  function i(r) {
    if (!r[c + "Init"]) return;
    const m = r.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const v = m === "TABLE" && r.querySelector("tbody") || r;
      for (const w of v.querySelectorAll("tr"))
        t(w);
    } else
      t(r);
    delete r[c + "Init"];
  }
  function l(r) {
    if (r[c + "Init"]) return;
    r[c + "Init"] = !0;
    const m = r.tagName;
    if (m === "TABLE" || m === "TBODY") {
      const v = m === "TABLE" && r.querySelector("tbody") || r;
      for (const w of v.querySelectorAll("tr"))
        n(w);
    } else
      n(r);
  }
  function u(r) {
    r.hasAttribute && r.hasAttribute(h) && l(r);
    const m = r.querySelectorAll ? r.querySelectorAll("[" + h + "]") : [];
    for (const v of m)
      l(v);
  }
  function o() {
    W(function() {
      new MutationObserver(function(m) {
        for (const v of m)
          if (v.type === "childList")
            for (const w of v.addedNodes)
              w.nodeType === 1 && (u(w), w.tagName === "TR" && w.closest("[" + h + "]") && n(w));
          else v.type === "attributes" && u(v.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-link");
  }
  function d(r) {
    u(r);
  }
  window[c] = { init: d, destroy: i };
  function p() {
    _(), o(), d(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function y(n) {
    _(n);
  }
  function _(n) {
    const t = Array.from(n.querySelectorAll(h));
    for (const i of t)
      i[c] || (i[c] = new g(i));
    n.hasAttribute && n.hasAttribute("data-ln-progress") && !n[c] && (n[c] = new g(n));
  }
  function g(n) {
    return this.dom = n, this._attrObserver = null, this._parentObserver = null, e.call(this), a.call(this), s.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function b() {
    W(function() {
      new MutationObserver(function(t) {
        for (const i of t)
          if (i.type === "childList")
            for (const l of i.addedNodes)
              l.nodeType === 1 && _(l);
          else i.type === "attributes" && _(i.target);
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
    const n = this, t = new MutationObserver(function(i) {
      for (const l of i)
        (l.attributeName === "data-ln-progress" || l.attributeName === "data-ln-progress-max") && e.call(n);
    });
    t.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = t;
  }
  function s() {
    const n = this, t = this.dom.parentElement;
    if (!t || !t.hasAttribute("data-ln-progress-max")) return;
    const i = new MutationObserver(function(l) {
      for (const u of l)
        u.attributeName === "data-ln-progress-max" && e.call(n);
    });
    i.observe(t, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = i;
  }
  function e() {
    const n = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, t = this.dom.parentElement, l = (t && t.hasAttribute("data-ln-progress-max") ? parseFloat(t.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = l > 0 ? n / l * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const o = Math.max(0, Math.min(n, l));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(l)), this.dom.setAttribute("aria-valuenow", String(o)), T(this.dom, "ln-progress:change", { target: this.dom, value: n, max: l, percentage: u });
  }
  window[c] = y, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    y(document.body);
  }) : y(document.body);
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", y = "data-ln-filter-initialized", _ = "data-ln-filter-key", g = "data-ln-filter-value", b = "data-ln-filter-hide", a = "data-ln-filter-reset", s = "data-ln-filter-col", e = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function n(o) {
    return o.hasAttribute(a) || o.getAttribute(g) === "";
  }
  function t(o) {
    let d = null;
    const p = [];
    for (let r = 0; r < o.inputs.length; r++) {
      const m = o.inputs[r];
      if (m.checked && !n(m)) {
        d === null && (d = m.getAttribute(_));
        const v = m.getAttribute(g);
        v && p.push(v);
      }
    }
    return { key: d, values: p };
  }
  function i(o, d) {
    if (o.length !== d.length) return !0;
    for (let p = 0; p < o.length; p++) if (o[p] !== d[p]) return !0;
    return !1;
  }
  function l(o) {
    const d = o.dom, p = o.colIndex, r = d.querySelector("template");
    if (!r || p === null) return;
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
    const C = d.querySelector("[" + _ + "]"), I = C ? C.getAttribute(_) : d.getAttribute("data-ln-filter-key") || "col" + p;
    for (let F = 0; F < E.length; F++) {
      const D = r.content.cloneNode(!0), M = D.querySelector("input");
      M && (M.setAttribute(_, I), M.setAttribute(g, E[F]), Tt(D, { text: E[F] }), d.appendChild(D));
    }
  }
  function u(o) {
    if (o.hasAttribute(y)) return this;
    this.dom = o, this.targetId = o.getAttribute(h);
    const d = o.getAttribute(s);
    this.colIndex = d !== null ? parseInt(d, 10) : null, l(this), this.inputs = Array.from(o.querySelectorAll("[" + _ + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(_) : null, this._lastSnapshot = null;
    const p = this, r = kt(
      function() {
        p._render();
      },
      function() {
        p._afterRender();
      }
    );
    this._queueRender = r, this._attachHandlers();
    let m = !1;
    if (o.hasAttribute("data-ln-persist")) {
      const v = ht("filter", o);
      if (v && v.key && Array.isArray(v.values) && v.values.length > 0) {
        for (let w = 0; w < this.inputs.length; w++) {
          const E = this.inputs[w];
          n(E) ? E.checked = !1 : E.getAttribute(_) === v.key && v.values.indexOf(E.getAttribute(g)) !== -1 ? E.checked = !0 : E.checked = !1;
        }
        r(), m = !0;
      }
    }
    if (!m) {
      for (let v = 0; v < this.inputs.length; v++)
        if (this.inputs[v].checked && !n(this.inputs[v])) {
          r();
          break;
        }
    }
    return o.setAttribute(y, ""), this;
  }
  u.prototype._attachHandlers = function() {
    const o = this;
    this.inputs.forEach(function(d) {
      d[c + "Bound"] || (d[c + "Bound"] = !0, d._lnFilterChange = function() {
        if (n(d)) {
          for (let p = 0; p < o.inputs.length; p++)
            n(o.inputs[p]) || (o.inputs[p].checked = !1);
          d.checked = !0, o._queueRender();
          return;
        }
        if (d.checked)
          for (let p = 0; p < o.inputs.length; p++)
            n(o.inputs[p]) && (o.inputs[p].checked = !1);
        else {
          let p = !1;
          for (let r = 0; r < o.inputs.length; r++)
            if (!n(o.inputs[r]) && o.inputs[r].checked) {
              p = !0;
              break;
            }
          if (!p)
            for (let r = 0; r < o.inputs.length; r++)
              n(o.inputs[r]) && (o.inputs[r].checked = !0);
        }
        o._queueRender();
      }, d.addEventListener("change", d._lnFilterChange));
    });
  }, u.prototype._render = function() {
    const o = this, d = t(this), p = d.key === null || d.values.length === 0, r = [];
    for (let m = 0; m < d.values.length; m++)
      r.push(d.values[m].toLowerCase());
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
        E.removeAttribute(b), A !== null && r.indexOf(A.toLowerCase()) === -1 && E.setAttribute(b, "true");
      }
    }
  }, u.prototype._afterRender = function() {
    const o = t(this), d = this._lastSnapshot;
    if (!d || d.key !== o.key || i(d.values, o.values)) {
      this._dispatchOnBoth("ln-filter:changed", {
        key: o.key,
        values: o.values.slice()
      });
      const r = d && d.values.length > 0, m = o.values.length === 0;
      r && m && this._dispatchOnBoth("ln-filter:reset", {}), this._lastSnapshot = { key: o.key, values: o.values.slice() };
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
    const r = o.key || this._filterKey, m = o.values;
    e.has(p) || e.set(p, {});
    const v = e.get(p);
    if (r && m.length > 0) {
      const C = [];
      for (let I = 0; I < m.length; I++)
        C.push(m[I].toLowerCase());
      v[r] = { col: this.colIndex, values: C };
    } else r && delete v[r];
    const w = Object.keys(v), E = w.length > 0, A = p.tBodies;
    for (let C = 0; C < A.length; C++) {
      const I = A[C].rows;
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
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const o = document.getElementById(this.targetId);
        if (o) {
          const d = o.tagName === "TABLE" ? o : o.querySelector("table");
          if (d && e.has(d)) {
            const p = e.get(d), r = this._filterKey;
            r && p[r] && delete p[r], Object.keys(p).length === 0 && e.delete(d);
          }
        }
      }
      this.inputs.forEach(function(o) {
        o._lnFilterChange && (o.removeEventListener("change", o._lnFilterChange), delete o._lnFilterChange), delete o[c + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[c];
    }
  }, B(h, c, u, "ln-filter");
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", y = "data-ln-search-initialized", _ = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function b(a) {
    if (a.hasAttribute(y)) return this;
    this.dom = a, this.targetId = a.getAttribute(h);
    const s = a.tagName;
    if (this.input = s === "INPUT" || s === "TEXTAREA" ? a : a.querySelector('[name="search"]') || a.querySelector('input[type="search"]') || a.querySelector('input[type="text"]'), this.itemsSelector = a.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const e = this;
      queueMicrotask(function() {
        e._search(e.input.value.trim().toLowerCase());
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
    const s = document.getElementById(this.targetId);
    if (!s || z(s, "ln-search:change", { term: a, targetId: this.targetId }).defaultPrevented) return;
    const n = this.itemsSelector ? s.querySelectorAll(this.itemsSelector) : s.children;
    for (let t = 0; t < n.length; t++) {
      const i = n[t];
      i.removeAttribute(_), a && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(a) && i.setAttribute(_, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[c]);
  }, B(h, c, b, "ln-search");
})();
(function() {
  const h = "lnTableSort", c = "data-ln-sort", y = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function _(e) {
    g(e);
  }
  function g(e) {
    const n = Array.from(e.querySelectorAll("table"));
    e.tagName === "TABLE" && n.push(e), n.forEach(function(t) {
      if (t[h]) return;
      const i = Array.from(t.querySelectorAll("th[" + c + "]"));
      i.length && (t[h] = new a(t, i));
    });
  }
  function b(e, n) {
    e.querySelectorAll("[data-ln-sort-icon]").forEach(function(i) {
      const l = i.getAttribute("data-ln-sort-icon");
      n == null ? i.classList.toggle("hidden", l !== null && l !== "") : i.classList.toggle("hidden", l !== n);
    });
  }
  function a(e, n) {
    this.table = e, this.ths = n, this._col = -1, this._dir = null;
    const t = this;
    n.forEach(function(l, u) {
      l[h + "Bound"] || (l[h + "Bound"] = !0, l._lnSortClick = function(o) {
        const d = o.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        d && d !== l || t._handleClick(u, l);
      }, l.addEventListener("click", l._lnSortClick));
    });
    const i = e.closest("[data-ln-table][data-ln-persist]");
    if (i) {
      const l = ht("table-sort", i);
      l && l.dir && l.col >= 0 && l.col < n.length && (this._handleClick(l.col, n[l.col]), l.dir === "desc" && this._handleClick(l.col, n[l.col]));
    }
    return this;
  }
  a.prototype._handleClick = function(e, n) {
    let t;
    this._col !== e ? t = "asc" : this._dir === "asc" ? t = "desc" : this._dir === "desc" ? t = null : t = "asc", this.ths.forEach(function(l) {
      l.removeAttribute(y), b(l, null);
    }), t === null ? (this._col = -1, this._dir = null) : (this._col = e, this._dir = t, n.setAttribute(y, t), b(n, t)), T(this.table, "ln-table:sort", {
      column: e,
      sortType: n.getAttribute(c),
      direction: t
    });
    const i = this.table.closest("[data-ln-table][data-ln-persist]");
    i && (t === null ? et("table-sort", i, null) : et("table-sort", i, { col: e, dir: t }));
  }, a.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(e) {
      e._lnSortClick && (e.removeEventListener("click", e._lnSortClick), delete e._lnSortClick), delete e[h + "Bound"];
    }), delete this.table[h]);
  };
  function s() {
    W(function() {
      new MutationObserver(function(n) {
        n.forEach(function(t) {
          t.type === "childList" ? t.addedNodes.forEach(function(i) {
            i.nodeType === 1 && g(i);
          }) : t.type === "attributes" && g(t.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[h] = _, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", y = "data-ln-sort", _ = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const a = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function s(e) {
    this.dom = e, this.table = e.querySelector("table"), this.tbody = e.querySelector("tbody"), this.thead = e.querySelector("thead");
    const n = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = n ? Array.from(n.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const t = this;
    return this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      t.tbody.rows.length > 0 && (t._emptyTbodyObserver.disconnect(), t._emptyTbodyObserver = null, t._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(i) {
      i.preventDefault(), t._searchTerm = i.detail.term, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-search:change", this._onSearch), this._onSort = function(i) {
      t._sortCol = i.detail.direction === null ? -1 : i.detail.column, t._sortDir = i.detail.direction, t._sortType = i.detail.sortType, t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(i) {
      const l = i.detail.key;
      let u = !1;
      for (let p = 0; p < t.ths.length; p++)
        if (t.ths[p].getAttribute("data-ln-filter-col") === l) {
          u = !0;
          break;
        }
      if (!u) return;
      const o = i.detail.values;
      if (!o || o.length === 0)
        delete t._columnFilters[l];
      else {
        const p = [];
        for (let r = 0; r < o.length; r++)
          p.push(o[r].toLowerCase());
        t._columnFilters[l] = p;
      }
      const d = t.dom.querySelector('th[data-ln-filter-col="' + l + '"]');
      d && (o && o.length > 0 ? d.setAttribute("data-ln-filter-active", "") : d.removeAttribute("data-ln-filter-active")), t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), T(e, "ln-table:filter", {
        term: t._searchTerm,
        matched: t._filteredData.length,
        total: t._data.length
      });
    }, e.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-table-clear]")) return;
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
  s.prototype._parseRows = function() {
    const e = this.tbody.rows, n = this.ths;
    this._data = [];
    const t = [];
    for (let i = 0; i < n.length; i++)
      t[i] = n[i].getAttribute(y);
    e.length > 0 && (this._rowHeight = e[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < e.length; i++) {
      const l = e[i], u = [], o = [], d = [];
      for (let p = 0; p < l.cells.length; p++) {
        const r = l.cells[p], m = r.textContent.trim(), v = r.hasAttribute("data-ln-value") ? r.getAttribute("data-ln-value") : m, w = t[p];
        o[p] = m.toLowerCase(), w === "number" || w === "date" ? u[p] = parseFloat(v) || 0 : w === "string" ? u[p] = String(v) : u[p] = null, p < l.cells.length - 1 && d.push(m.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: o,
        html: l.outerHTML,
        searchText: d.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, s.prototype._applyFilterAndSort = function() {
    const e = this._searchTerm, n = this._columnFilters, t = Object.keys(n).length > 0, i = this.ths, l = {};
    if (t)
      for (let r = 0; r < i.length; r++) {
        const m = i[r].getAttribute("data-ln-filter-col");
        m && (l[m] = r);
      }
    if (!e && !t ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(r) {
      if (e && r.searchText.indexOf(e) === -1) return !1;
      if (t)
        for (const m in n) {
          const v = l[m];
          if (v !== void 0 && n[m].indexOf(r.rawTexts[v]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, o = this._sortDir === "desc" ? -1 : 1, d = this._sortType === "number" || this._sortType === "date", p = a ? a.compare : function(r, m) {
      return r < m ? -1 : r > m ? 1 : 0;
    };
    this._filteredData.sort(function(r, m) {
      const v = r.sortKeys[u], w = m.sortKeys[u];
      return d ? (v - w) * o : p(v, w) * o;
    });
  }, s.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const e = document.createElement("colgroup");
    this.ths.forEach(function(n) {
      const t = document.createElement("col");
      t.style.width = n.offsetWidth + "px", e.appendChild(t);
    }), this.table.insertBefore(e, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = e;
  }, s.prototype._render = function() {
    if (!this.tbody) return;
    const e = this._filteredData.length;
    e === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : e > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, s.prototype._renderAll = function() {
    const e = [], n = this._filteredData;
    for (let t = 0; t < n.length; t++) e.push(n[t].html);
    this.tbody.innerHTML = e.join("");
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const e = this;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const e = this._filteredData, n = e.length, t = this._rowHeight;
    if (!t || !n) return;
    const l = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, o = l + u, d = window.scrollY - o, p = Math.max(0, Math.floor(d / t) - 15), r = Math.min(p + Math.ceil(window.innerHeight / t) + 30, n);
    if (p === this._vStart && r === this._vEnd) return;
    this._vStart = p, this._vEnd = r;
    const m = this.ths.length || 1, v = p * t, w = (n - r) * t;
    let E = "";
    v > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + m + '" style="height:' + v + 'px;padding:0;border:none"></td></tr>');
    for (let A = p; A < r; A++) E += e[A].html;
    w > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + m + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = E;
  }, s.prototype._showEmptyState = function() {
    const e = this.ths.length || 1, n = this.dom.querySelector("template[" + _ + "]"), t = document.createElement("td");
    t.setAttribute("colspan", String(e)), n && t.appendChild(document.importNode(n.content, !0));
    const i = document.createElement("tr");
    i.className = "ln-table__empty", i.appendChild(t), this.tbody.innerHTML = "", this.tbody.appendChild(i), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, s.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, B(h, c, s, "ln-table");
})();
(function() {
  const h = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", _ = 36, g = 16, b = 2 * Math.PI * g;
  function a(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, e.call(this), t.call(this), n.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  a.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[c]);
  };
  function s(i, l) {
    const u = document.createElementNS(y, i);
    for (const o in l)
      u.setAttribute(o, l[o]);
    return u;
  }
  function e() {
    this.svg = s("svg", {
      viewBox: "0 0 " + _ + " " + _,
      "aria-hidden": "true"
    }), this.trackCircle = s("circle", {
      cx: _ / 2,
      cy: _ / 2,
      r: g,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = s("circle", {
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
  function n() {
    const i = this, l = new MutationObserver(function(u) {
      for (const o of u)
        (o.attributeName === "data-ln-circular-progress" || o.attributeName === "data-ln-circular-progress-max") && t.call(i);
    });
    l.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = l;
  }
  function t() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, l = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = l > 0 ? i / l * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const o = b - u / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", o);
    const d = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = d !== null ? d : Math.round(u) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: l,
      percentage: u
    });
  }
  B(h, c, a, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", c = "lnSortable", y = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function _(b) {
    this.dom = b, this.isEnabled = b.getAttribute(h) !== "disabled", this._dragging = null, b.setAttribute("aria-roledescription", "sortable list");
    const a = this;
    return this._onPointerDown = function(s) {
      a.isEnabled && a._handlePointerDown(s);
    }, b.addEventListener("pointerdown", this._onPointerDown), this;
  }
  _.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, _.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, _.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, _.prototype._handlePointerDown = function(b) {
    let a = b.target.closest("[" + y + "]"), s;
    if (a) {
      for (s = a; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (s = b.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      a = s;
    }
    const n = Array.from(this.dom.children).indexOf(s);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: n
    }).defaultPrevented) return;
    b.preventDefault(), a.setPointerCapture(b.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: n
    });
    const i = this, l = function(o) {
      i._handlePointerMove(o);
    }, u = function(o) {
      i._handlePointerEnd(o), a.removeEventListener("pointermove", l), a.removeEventListener("pointerup", u), a.removeEventListener("pointercancel", u);
    };
    a.addEventListener("pointermove", l), a.addEventListener("pointerup", u), a.addEventListener("pointercancel", u);
  }, _.prototype._handlePointerMove = function(b) {
    if (!this._dragging) return;
    const a = Array.from(this.dom.children), s = this._dragging;
    for (const e of a)
      e.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const e of a) {
      if (e === s) continue;
      const n = e.getBoundingClientRect(), t = n.top + n.height / 2;
      if (b.clientY >= n.top && b.clientY < t) {
        e.classList.add("ln-sortable--drop-before");
        break;
      } else if (b.clientY >= t && b.clientY <= n.bottom) {
        e.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, _.prototype._handlePointerEnd = function(b) {
    if (!this._dragging) return;
    const a = this._dragging, s = Array.from(this.dom.children), e = s.indexOf(a);
    let n = null, t = null;
    for (const i of s) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        n = i, t = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        n = i, t = "after";
        break;
      }
    }
    for (const i of s)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (a.classList.remove("ln-sortable--dragging"), a.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), n && n !== a) {
      t === "before" ? this.dom.insertBefore(a, n) : this.dom.insertBefore(a, n.nextElementSibling);
      const l = Array.from(this.dom.children).indexOf(a);
      T(this.dom, "ln-sortable:reordered", {
        item: a,
        oldIndex: e,
        newIndex: l
      });
    }
    this._dragging = null;
  };
  function g(b) {
    const a = b[c];
    if (!a) return;
    const s = b.getAttribute(h) !== "disabled";
    s !== a.isEnabled && (a.isEnabled = s, T(b, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: b }));
  }
  B(h, c, _, "ln-sortable", {
    onAttributeChange: g
  });
})();
(function() {
  const h = "data-ln-confirm", c = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function g(b) {
    this.dom = b, this.confirming = !1, this.originalText = b.textContent.trim(), this.confirmText = b.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const a = this;
    return this._onClick = function(s) {
      if (!a.confirming)
        s.preventDefault(), s.stopImmediatePropagation(), a._enterConfirm();
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
    this.dom[c] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  }, B(h, c, g, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
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
    const a = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && a.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && a.removeLanguage(s.detail.lang);
    }, g.addEventListener("ln-translations:request-add", this._onRequestAdd), g.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  _.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const g = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of g) {
      const a = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const s of a)
        s.setAttribute("data-ln-translatable-lang", this.defaultLang);
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
    for (const s in this.locales) {
      if (!this.locales.hasOwnProperty(s) || this.activeLanguages.has(s)) continue;
      b++;
      const e = vt("ln-translations-menu-item", "ln-translations");
      if (!e) return;
      const n = e.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", s), n.textContent = this.locales[s], n.addEventListener("click", function(t) {
        t.ctrlKey || t.metaKey || t.button === 1 || (t.preventDefault(), t.stopPropagation(), g.menuEl.getAttribute("data-ln-toggle") === "open" && g.menuEl.setAttribute("data-ln-toggle", "close"), g.addLanguage(s));
      }), this.menuEl.appendChild(e);
    }
    const a = this.dom.querySelector("[" + h + "-add]");
    a && (a.style.display = b === 0 ? "none" : "");
  }, _.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const g = this;
    this.activeLanguages.forEach(function(b) {
      const a = vt("ln-translations-badge", "ln-translations");
      if (!a) return;
      const s = a.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", b);
      const e = s.querySelector("span");
      e.textContent = g.locales[b] || b.toUpperCase();
      const n = s.querySelector("button");
      n.setAttribute("aria-label", "Remove " + (g.locales[b] || b.toUpperCase())), n.addEventListener("click", function(t) {
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
    const e = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of e) {
      const t = n.getAttribute("data-ln-translatable"), i = n.getAttribute("data-ln-translations-prefix") || "", l = n.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!l) continue;
      const u = l.cloneNode(!1);
      i ? u.name = i + "[trans][" + g + "][" + t + "]" : u.name = "trans[" + g + "][" + t + "]", u.value = b[t] !== void 0 ? b[t] : "", u.removeAttribute("id"), u.placeholder = a + " translation", u.setAttribute("data-ln-translatable-lang", g);
      const o = n.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), d = o.length > 0 ? o[o.length - 1] : l;
      d.parentNode.insertBefore(u, d.nextSibling);
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
    for (const s of a)
      s.parentNode.removeChild(s);
    this.activeLanguages.delete(g), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: g
    });
  }, _.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, _.prototype.hasLanguage = function(g) {
    return this.activeLanguages.has(g);
  }, _.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const g = this.defaultLang, b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of b)
      a.getAttribute("data-ln-translatable-lang") !== g && a.parentNode.removeChild(a);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, B(h, c, _, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", c = "lnAutosave", y = "data-ln-autosave-clear", _ = "data-ln-autosave-debounce-input", g = "ln-autosave:";
  if (window[c] !== void 0) return;
  function a(t) {
    const i = s(t);
    if (!i) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", t);
      return;
    }
    this.dom = t, this.key = i;
    let l = null;
    function u() {
      const r = Et(t);
      try {
        localStorage.setItem(i, JSON.stringify(r));
      } catch {
        return;
      }
      T(t, "ln-autosave:saved", { target: t, data: r });
    }
    function o() {
      let r;
      try {
        r = localStorage.getItem(i);
      } catch {
        return;
      }
      if (!r) return;
      let m;
      try {
        m = JSON.parse(r);
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
        localStorage.removeItem(i);
      } catch {
        return;
      }
      T(t, "ln-autosave:cleared", { target: t });
    }
    this._onFocusout = function(r) {
      const m = r.target;
      e(m) && m.name && u();
    }, this._onChange = function(r) {
      const m = r.target;
      e(m) && m.name && u();
    }, this._onSubmit = function() {
      d();
    }, this._onReset = function() {
      d();
    }, this._onClearClick = function(r) {
      r.target.closest("[" + y + "]") && d();
    }, t.addEventListener("focusout", this._onFocusout), t.addEventListener("change", this._onChange), t.addEventListener("submit", this._onSubmit), t.addEventListener("reset", this._onReset), t.addEventListener("click", this._onClearClick);
    const p = n(t);
    return p > 0 && (this._onInput = function(r) {
      const m = r.target;
      !e(m) || !m.name || (l !== null && clearTimeout(l), l = setTimeout(u, p));
    }, t.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return l;
    }, o(), this;
  }
  a.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const t = this._getInputTimer();
        t !== null && clearTimeout(t);
      }
      T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c];
    }
  };
  function s(t) {
    const l = t.getAttribute(h) || t.id;
    return l ? g + window.location.pathname + ":" + l : null;
  }
  function e(t) {
    const i = t.tagName;
    return i === "INPUT" || i === "TEXTAREA" || i === "SELECT";
  }
  function n(t) {
    if (!t.hasAttribute(_)) return 0;
    const i = t.getAttribute(_);
    if (i === "" || i === null) return 1e3;
    const l = parseInt(i, 10);
    return isNaN(l) || l < 0 ? (console.warn("ln-autosave: invalid debounce value, using default", t), 1e3) : l;
  }
  B(h, c, a, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
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
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, B(h, c, y, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", c = "lnValidate", y = "data-ln-validate-errors", _ = "data-ln-validate-error", g = "ln-validate-valid", b = "ln-validate-invalid", a = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[c] !== void 0) return;
  function s(e) {
    this.dom = e, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, t = e.tagName, i = e.type, l = t === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(u) {
      const o = u.detail && u.detail.error;
      if (!o) return;
      n._customErrors.add(o), n._touched = !0;
      const d = e.closest(".form-element");
      if (d) {
        const p = d.querySelector("[" + _ + '="' + o + '"]');
        p && p.classList.remove("hidden");
      }
      e.classList.remove(g), e.classList.add(b);
    }, this._onClearCustom = function(u) {
      const o = u.detail && u.detail.error, d = e.closest(".form-element");
      if (o) {
        if (n._customErrors.delete(o), d) {
          const p = d.querySelector("[" + _ + '="' + o + '"]');
          p && p.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(p) {
          if (d) {
            const r = d.querySelector("[" + _ + '="' + p + '"]');
            r && r.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, l || e.addEventListener("input", this._onInput), e.addEventListener("change", this._onChange), e.addEventListener("ln-validate:set-custom", this._onSetCustom), e.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  s.prototype.validate = function() {
    const e = this.dom, n = e.validity, i = e.checkValidity() && this._customErrors.size === 0, l = e.closest(".form-element");
    if (l) {
      const o = l.querySelector("[" + y + "]");
      if (o) {
        const d = o.querySelectorAll("[" + _ + "]");
        for (let p = 0; p < d.length; p++) {
          const r = d[p].getAttribute(_), m = a[r];
          m && (n[m] ? d[p].classList.remove("hidden") : d[p].classList.add("hidden"));
        }
      }
    }
    return e.classList.toggle(g, i), e.classList.toggle(b, !i), T(e, i ? "ln-validate:valid" : "ln-validate:invalid", { target: e, field: e.name }), i;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(g, b);
    const e = this.dom.closest(".form-element");
    if (e) {
      const n = e.querySelectorAll("[" + _ + "]");
      for (let t = 0; t < n.length; t++)
        n[t].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), s.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(g, b), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, s, "ln-validate");
})();
(function() {
  const h = "data-ln-form", c = "lnForm", y = "data-ln-form-auto", _ = "data-ln-form-debounce", g = "data-ln-validate", b = "lnValidate";
  if (window[c] !== void 0) return;
  function a(s) {
    this.dom = s, this._debounceTimer = null;
    const e = this;
    if (this._onValid = function() {
      e._updateSubmitButton();
    }, this._onInvalid = function() {
      e._updateSubmitButton();
    }, this._onSubmit = function(n) {
      n.preventDefault(), e.submit();
    }, this._onFill = function(n) {
      n.detail && e.fill(n.detail);
    }, this._onFormReset = function() {
      e.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        e._resetValidation();
      }, 0);
    }, s.addEventListener("ln-validate:valid", this._onValid), s.addEventListener("ln-validate:invalid", this._onInvalid), s.addEventListener("submit", this._onSubmit), s.addEventListener("ln-form:fill", this._onFill), s.addEventListener("ln-form:reset", this._onFormReset), s.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, s.hasAttribute(y)) {
      const n = parseInt(s.getAttribute(_)) || 0;
      this._onAutoInput = function() {
        n > 0 ? (clearTimeout(e._debounceTimer), e._debounceTimer = setTimeout(function() {
          e.submit();
        }, n)) : e.submit();
      }, s.addEventListener("input", this._onAutoInput), s.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  a.prototype._updateSubmitButton = function() {
    const s = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!s.length) return;
    const e = this.dom.querySelectorAll("[" + g + "]");
    let n = !1;
    if (e.length > 0) {
      let t = !1, i = !1;
      for (let l = 0; l < e.length; l++) {
        const u = e[l][b];
        u && u._touched && (t = !0), e[l].checkValidity() || (i = !0);
      }
      n = i || !t;
    }
    for (let t = 0; t < s.length; t++)
      s[t].disabled = n;
  }, a.prototype.fill = function(s) {
    const e = At(this.dom, s);
    for (let n = 0; n < e.length; n++) {
      const t = e[n], i = t.tagName === "SELECT" || t.type === "checkbox" || t.type === "radio";
      t.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, a.prototype.submit = function() {
    const s = this.dom.querySelectorAll("[" + g + "]");
    let e = !0;
    for (let t = 0; t < s.length; t++) {
      const i = s[t][b];
      i && (i.validate() || (e = !1));
    }
    if (!e) return;
    const n = Et(this.dom);
    T(this.dom, "ln-form:submit", { data: n });
  }, a.prototype.reset = function() {
    this.dom.reset();
    const s = this.dom.querySelectorAll("input, textarea, select");
    for (let e = 0; e < s.length; e++) {
      const n = s[e], t = n.tagName === "SELECT" || n.type === "checkbox" || n.type === "radio";
      n.dispatchEvent(new Event(t ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), T(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, a.prototype._resetValidation = function() {
    const s = this.dom.querySelectorAll("[" + g + "]");
    for (let e = 0; e < s.length; e++) {
      const n = s[e][b];
      n && n.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(a.prototype, "isValid", {
    get: function() {
      const s = this.dom.querySelectorAll("[" + g + "]");
      for (let e = 0; e < s.length; e++)
        if (!s[e].checkValidity()) return !1;
      return !0;
    }
  }), a.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, a, "ln-form");
})();
(function() {
  const h = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
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
  const s = /* @__PURE__ */ new Set();
  let e = null;
  function n() {
    e || (e = setInterval(i, 6e4));
  }
  function t() {
    e && (clearInterval(e), e = null);
  }
  function i() {
    for (const E of s) {
      if (!document.body.contains(E.dom)) {
        s.delete(E);
        continue;
      }
      r(E);
    }
    s.size === 0 && t();
  }
  function l(E, A) {
    return b(A, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function u(E, A) {
    const C = /* @__PURE__ */ new Date(), I = { month: "short", day: "numeric" };
    return E.getFullYear() !== C.getFullYear() && (I.year = "numeric"), b(A, I).format(E);
  }
  function o(E, A) {
    return b(A, { dateStyle: "medium" }).format(E);
  }
  function d(E, A) {
    return b(A, { timeStyle: "short" }).format(E);
  }
  function p(E, A) {
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
    const I = new Date(C * 1e3), F = E.dom.getAttribute(h) || "short", D = g(E.dom);
    let M;
    switch (F) {
      case "relative":
        M = p(I, D);
        break;
      case "full":
        M = l(I, D);
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
    E.dom.textContent = M, F !== "full" && (E.dom.title = l(I, D));
  }
  function m(E) {
    return this.dom = E, r(this), E.getAttribute(h) === "relative" && (s.add(this), n()), this;
  }
  m.prototype.render = function() {
    r(this);
  }, m.prototype.destroy = function() {
    s.delete(this), s.size === 0 && t(), delete this.dom[c];
  };
  function v(E) {
    const A = E[c];
    if (!A) return;
    E.getAttribute(h) === "relative" ? (s.add(A), n()) : (s.delete(A), s.size === 0 && t()), r(A);
  }
  function w(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(h) && E[c] && r(E[c]);
  }
  B(h, c, m, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: w
  });
})();
(function() {
  const h = "data-ln-store", c = "lnStore";
  if (window[c] !== void 0) return;
  const y = "ln_app_cache", _ = "_meta", g = "1.0";
  let b = null, a = null;
  const s = {};
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
  function n(f) {
    f && f.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: f });
  }
  function t() {
    const f = document.querySelectorAll("[" + h + "]"), L = {};
    for (let S = 0; S < f.length; S++) {
      const x = f[S].getAttribute(h);
      x && (L[x] = {
        indexes: (f[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(k) {
          return k.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function i() {
    return a || (a = new Promise(function(f, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), f(null);
        return;
      }
      const S = t(), x = Object.keys(S), k = indexedDB.open(y);
      k.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), f(null);
      }, k.onsuccess = function(O) {
        const q = O.target.result, N = Array.from(q.objectStoreNames);
        let j = !1;
        N.indexOf(_) === -1 && (j = !0);
        for (let tt = 0; tt < x.length; tt++)
          if (N.indexOf(x[tt]) === -1) {
            j = !0;
            break;
          }
        if (!j) {
          l(q), b = q, f(q);
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
          for (let pt = 0; pt < x.length; pt++) {
            const mt = x[pt];
            if (!G.objectStoreNames.contains(mt)) {
              const Lt = G.createObjectStore(mt, { keyPath: "id" }), gt = S[mt].indexes;
              for (let ut = 0; ut < gt.length; ut++)
                Lt.createIndex(gt[ut], gt[ut], { unique: !1 });
            }
          }
        }, dt.onsuccess = function(tt) {
          const G = tt.target.result;
          l(G), b = G, f(G);
        };
      };
    }), a);
  }
  function l(f) {
    f.onversionchange = function() {
      f.close(), b = null, a = null;
    };
  }
  function u() {
    return b ? Promise.resolve(b) : (a = null, i());
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
        n(f.error), S(f.error);
      };
    });
  }
  function p(f) {
    return o(f, "readonly").then(function(L) {
      return L ? d(L.getAll()) : [];
    });
  }
  function r(f, L) {
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
  function C(f, L) {
    return o(_, "readwrite").then(function(S) {
      if (S)
        return L.key = f, d(S.put(L));
    });
  }
  function I(f) {
    this.dom = f, this._name = f.getAttribute(h), this._endpoint = f.getAttribute("data-ln-store-endpoint") || "";
    const L = f.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (f.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(k) {
      return k.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, s[this._name] = this;
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
    const S = L.data || {}, x = "_temp_" + e(), k = Object.assign({}, S, { id: x });
    m(f._name, k).then(function() {
      return f.totalCount++, T(f.dom, "ln-store:created", {
        store: f._name,
        record: k,
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
          record: k,
          action: "create",
          error: O.message
        });
      });
    });
  }
  function M(f, L) {
    const S = L.id, x = L.data || {}, k = L.expected_version;
    let O = null;
    r(f._name, S).then(function(q) {
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
      return k && (N.expected_version = k), fetch(f._endpoint + "/" + S, {
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
    r(f._name, S).then(function(k) {
      if (k)
        return x = Object.assign({}, k), v(f._name, S).then(function() {
          return f.totalCount--, T(f.dom, "ln-store:deleted", {
            store: f._name,
            id: S
          }), fetch(f._endpoint + "/" + S, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(k) {
      if (!k || !k.ok) throw new Error("HTTP " + (k ? k.status : "unknown"));
      T(f.dom, "ln-store:confirmed", {
        store: f._name,
        record: x,
        action: "delete"
      });
    }).catch(function(k) {
      x && m(f._name, x).then(function() {
        f.totalCount++, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: x,
          action: "delete",
          error: k.message
        });
      });
    });
  }
  function V(f, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let x = [];
    const k = S.map(function(O) {
      return r(f._name, O);
    });
    Promise.all(k).then(function(O) {
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
    i().then(function() {
      return A(f._name);
    }).then(function(L) {
      L && L.schema_version === g ? (f.lastSyncedAt = L.last_synced_at || null, f.totalCount = L.record_count || 0, f.totalCount > 0 ? (f.isLoaded = !0, T(f.dom, "ln-store:ready", {
        store: f._name,
        count: f.totalCount,
        source: "cache"
      }), Z(f) && nt(f)) : Y(f)) : L && L.schema_version !== g ? w(f._name).then(function() {
        return C(f._name, {
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
        return C(f._name, {
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
      const x = S.data || [], k = S.deleted || [], O = S.synced_at || Math.floor(Date.now() / 1e3), q = x.length > 0 || k.length > 0;
      let N = Promise.resolve();
      return x.length > 0 && (N = N.then(function() {
        return it(f._name, x);
      })), k.length > 0 && (N = N.then(function() {
        return rt(f._name, k);
      })), N.then(function() {
        return E(f._name);
      }).then(function(j) {
        return f.totalCount = j, C(f._name, {
          schema_version: g,
          last_synced_at: O,
          record_count: j
        });
      }).then(function() {
        f.isSyncing = !1, f.lastSyncedAt = O, f._abortController = null, T(f.dom, "ln-store:synced", {
          store: f._name,
          added: x.length,
          deleted: k.length,
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
        return new Promise(function(x, k) {
          const O = S.transaction(f, "readwrite"), q = O.objectStore(f);
          for (let N = 0; N < L.length; N++)
            q.put(L[N]);
          O.oncomplete = function() {
            x();
          }, O.onerror = function() {
            n(O.error), k(O.error);
          };
        });
    });
  }
  function rt(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(x, k) {
          const O = S.transaction(f, "readwrite"), q = O.objectStore(f);
          for (let N = 0; N < L.length; N++)
            q.delete(L[N]);
          O.oncomplete = function() {
            x();
          }, O.onerror = function() {
            k(O.error);
          };
        });
    });
  }
  let R = null;
  R = function() {
    if (document.visibilityState !== "visible") return;
    const f = Object.keys(s);
    for (let L = 0; L < f.length; L++) {
      const S = s[f[L]];
      S.isLoaded && !S.isSyncing && Z(S) && nt(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const P = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function U(f, L) {
    if (!L || !L.field) return f;
    const S = L.field, x = L.direction === "desc";
    return f.slice().sort(function(k, O) {
      const q = k[S], N = O[S];
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
      for (let k = 0; k < S.length; k++) {
        const O = S[k], q = L[O];
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
    return f.filter(function(k) {
      for (let O = 0; O < S.length; O++) {
        const q = k[S[O]];
        if (q != null && String(q).toLowerCase().indexOf(x) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function K(f, L, S) {
    if (f.length === 0) return 0;
    if (S === "count") return f.length;
    let x = 0, k = 0;
    for (let O = 0; O < f.length; O++) {
      const q = parseFloat(f[O][L]);
      isNaN(q) || (x += q, k++);
    }
    return S === "sum" ? x : S === "avg" && k > 0 ? x / k : 0;
  }
  I.prototype.getAll = function(f) {
    const L = this;
    return f = f || {}, p(L._name).then(function(S) {
      const x = S.length;
      f.filters && (S = X(S, f.filters)), f.search && (S = ct(S, f.search, L._searchFields));
      const k = S.length;
      if (f.sort && (S = U(S, f.sort)), f.offset || f.limit) {
        const O = f.offset || 0, q = f.limit || S.length;
        S = S.slice(O, O + q);
      }
      return {
        data: S,
        total: x,
        filtered: k
      };
    });
  }, I.prototype.getById = function(f) {
    return r(this._name, f);
  }, I.prototype.count = function(f) {
    const L = this;
    return f ? p(L._name).then(function(S) {
      return X(S, f).length;
    }) : E(L._name);
  }, I.prototype.aggregate = function(f, L) {
    return p(this._name).then(function(x) {
      return K(x, f, L);
    });
  }, I.prototype.forceSync = function() {
    return nt(this);
  }, I.prototype.fullReload = function() {
    const f = this;
    return w(f._name).then(function() {
      return f.isLoaded = !1, f.lastSyncedAt = null, f.totalCount = 0, Y(f);
    });
  }, I.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete s[this._name], Object.keys(s).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[c], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function st() {
    return u().then(function(f) {
      if (!f) return;
      const L = Array.from(f.objectStoreNames);
      return new Promise(function(S, x) {
        const k = f.transaction(L, "readwrite");
        for (let O = 0; O < L.length; O++)
          k.objectStore(L[O]).clear();
        k.oncomplete = function() {
          S();
        }, k.onerror = function() {
          x(k.error);
        };
      });
    }).then(function() {
      const f = Object.keys(s);
      for (let L = 0; L < f.length; L++) {
        const S = s[f[L]];
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      }
    });
  }
  B(h, c, I, "ln-store"), window[c].clearAll = st, window[c].init = window[c];
})();
(function() {
  const h = "data-ln-data-table", c = "lnDataTable";
  if (window[c] !== void 0) return;
  const g = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function b(e) {
    return g ? g.format(e) : String(e);
  }
  function a(e) {
    let n = e.parentElement;
    for (; n && n !== document.body && n !== document.documentElement; ) {
      const i = getComputedStyle(n).overflowY;
      if (i === "auto" || i === "scroll") return n;
      n = n.parentElement;
    }
    return null;
  }
  function s(e) {
    if (this.dom = e, this.name = e.getAttribute(h) || "", this.table = e.querySelector("table"), this.tbody = e.querySelector("[data-ln-data-table-body]") || e.querySelector("tbody"), this.thead = e.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(t) {
      return t.getAttribute("data-ln-col") && t.querySelector("[data-ln-col-filter]");
    }).map(function(t) {
      return t.getAttribute("data-ln-col");
    }), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._toolbar = e.querySelector(":scope > header"), this._toolbarRO = null, this._toolbar && typeof ResizeObserver < "u") {
      const t = this;
      this._toolbarRO = new ResizeObserver(function(i) {
        for (let l = 0; l < i.length; l++) {
          const u = i[l].contentRect.height;
          t.dom.style.setProperty("--data-table-toolbar-h", u + "px");
        }
      }), this._toolbarRO.observe(this._toolbar);
    }
    this._totalSpan = e.querySelector("[data-ln-data-table-total]"), this._filteredSpan = e.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== e ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = e.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== e ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const n = this;
    if (this._onSetData = function(t) {
      const i = t.detail || {};
      n._data = i.data || [], n._lastTotal = i.total != null ? i.total : n._data.length, n._lastFiltered = i.filtered != null ? i.filtered : n._data.length, n.totalCount = n._lastTotal, n.visibleCount = n._lastFiltered, n.isLoaded = !0, n._updateFilterOptions(i.filterOptions), n._vStart = -1, n._vEnd = -1, n._renderRows(), n._updateFooter(), T(e, "ln-data-table:rendered", {
        table: n.name,
        total: n.totalCount,
        visible: n.visibleCount
      });
    }, e.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(t) {
      const i = t.detail && t.detail.loading;
      e.classList.toggle("ln-data-table--loading", !!i), i && (n.isLoaded = !1);
    }, e.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(e.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(t) {
      const i = t.target.closest("[data-ln-col-sort]");
      if (!i) return;
      const l = i.closest("th");
      if (!l) return;
      const u = l.getAttribute("data-ln-col");
      u && n._handleSort(u, l);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(t) {
      const i = t.target.closest("[data-ln-col-filter]");
      if (!i) return;
      t.stopPropagation();
      const l = i.closest("th");
      if (!l) return;
      const u = l.getAttribute("data-ln-col");
      if (u) {
        if (n._activeDropdown && n._activeDropdown.field === u) {
          n._closeFilterDropdown();
          return;
        }
        n._openFilterDropdown(u, l, i);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      n._activeDropdown && n._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(t) {
      t.target.closest("[data-ln-data-table-clear-all]") && (n.currentFilters = {}, n._updateFilterIndicators(), T(e, "ln-data-table:clear-filters", { table: n.name }), n._requestData());
    }, e.addEventListener("click", this._onClearAll), this._selectable = e.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(t) {
        const i = t.target.closest("[data-ln-row-select]");
        if (!i) return;
        const l = i.closest("[data-ln-row]");
        if (!l) return;
        const u = l.getAttribute("data-ln-row-id");
        u != null && (i.checked ? (n.selectedIds.add(u), l.classList.add("ln-row-selected")) : (n.selectedIds.delete(u), l.classList.remove("ln-row-selected")), n.selectedCount = n.selectedIds.size, n._updateSelectAll(), n._updateFooter(), T(e, "ln-data-table:select", {
          table: n.name,
          selectedIds: n.selectedIds,
          count: n.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = e.querySelector('[data-ln-col-select] input[type="checkbox"]') || e.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const t = document.createElement("input");
        t.type = "checkbox", t.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(t), this._selectAllCheckbox = t;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const t = n._selectAllCheckbox.checked, i = n.tbody ? n.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let l = 0; l < i.length; l++) {
          const u = i[l].getAttribute("data-ln-row-id"), o = i[l].querySelector("[data-ln-row-select]");
          u != null && (t ? (n.selectedIds.add(u), i[l].classList.add("ln-row-selected")) : (n.selectedIds.delete(u), i[l].classList.remove("ln-row-selected")), o && (o.checked = t));
        }
        n.selectedCount = n.selectedIds.size, T(e, "ln-data-table:select-all", {
          table: n.name,
          selected: t
        }), T(e, "ln-data-table:select", {
          table: n.name,
          selectedIds: n.selectedIds,
          count: n.selectedCount
        }), n._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const t = this.tbody.querySelectorAll("[data-ln-row]");
        for (let i = 0; i < t.length; i++) {
          const l = t[i].querySelector("[data-ln-row-select]"), u = t[i].getAttribute("data-ln-row-id");
          l && l.checked && u != null && (this.selectedIds.add(u), t[i].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(t) {
      if (t.target.closest("[data-ln-row-select]") || t.target.closest("[data-ln-row-action]") || t.target.closest("a") || t.target.closest("button") || t.ctrlKey || t.metaKey || t.button === 1) return;
      const i = t.target.closest("[data-ln-row]");
      if (!i) return;
      const l = i.getAttribute("data-ln-row-id"), u = i._lnRecord || {};
      T(e, "ln-data-table:row-click", {
        table: n.name,
        id: l,
        record: u
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(t) {
      const i = t.target.closest("[data-ln-row-action]");
      if (!i) return;
      t.stopPropagation();
      const l = i.closest("[data-ln-row]");
      if (!l) return;
      const u = i.getAttribute("data-ln-row-action"), o = l.getAttribute("data-ln-row-id"), d = l._lnRecord || {};
      T(e, "ln-data-table:row-action", {
        table: n.name,
        id: o,
        action: u,
        record: d
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = e.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      n.currentSearch = n._searchInput.value, T(e, "ln-data-table:search", {
        table: n.name,
        query: n.currentSearch
      }), n._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(t) {
      if (!e.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (t.key === "/") {
        n._searchInput && (t.preventDefault(), n._searchInput.focus());
        return;
      }
      const i = n.tbody ? Array.from(n.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (i.length)
        switch (t.key) {
          case "ArrowDown":
            t.preventDefault(), n._focusedRowIndex = Math.min(n._focusedRowIndex + 1, i.length - 1), n._focusRow(i);
            break;
          case "ArrowUp":
            t.preventDefault(), n._focusedRowIndex = Math.max(n._focusedRowIndex - 1, 0), n._focusRow(i);
            break;
          case "Home":
            t.preventDefault(), n._focusedRowIndex = 0, n._focusRow(i);
            break;
          case "End":
            t.preventDefault(), n._focusedRowIndex = i.length - 1, n._focusRow(i);
            break;
          case "Enter":
            if (n._focusedRowIndex >= 0 && n._focusedRowIndex < i.length) {
              t.preventDefault();
              const l = i[n._focusedRowIndex];
              T(e, "ln-data-table:row-click", {
                table: n.name,
                id: l.getAttribute("data-ln-row-id"),
                record: l._lnRecord || {}
              });
            }
            break;
          case " ":
            if (n._selectable && n._focusedRowIndex >= 0 && n._focusedRowIndex < i.length) {
              t.preventDefault();
              const l = i[n._focusedRowIndex].querySelector("[data-ln-row-select]");
              l && (l.checked = !l.checked, l.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            n._activeDropdown && n._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(e, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  s.prototype._handleSort = function(e, n) {
    let t;
    !this.currentSort || this.currentSort.field !== e ? t = "asc" : this.currentSort.direction === "asc" ? t = "desc" : t = null;
    for (let i = 0; i < this.ths.length; i++)
      this.ths[i].classList.remove("ln-sort-asc", "ln-sort-desc");
    t ? (this.currentSort = { field: e, direction: t }, n.classList.add(t === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: e,
      direction: t
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
    const e = this.tbody.querySelectorAll("[data-ln-row]");
    let n = e.length > 0;
    for (let t = 0; t < e.length; t++) {
      const i = e[t].getAttribute("data-ln-row-id");
      if (i != null && !this.selectedIds.has(i)) {
        n = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = n;
  }, Object.defineProperty(s.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), s.prototype._focusRow = function(e) {
    for (let n = 0; n < e.length; n++)
      e[n].classList.remove("ln-row-focused"), e[n].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < e.length) {
      const n = e[this._focusedRowIndex];
      n.classList.add("ln-row-focused"), n.setAttribute("tabindex", "0"), n.focus(), n.scrollIntoView({ block: "nearest" });
    }
  }, s.prototype._openFilterDropdown = function(e, n, t) {
    this._closeFilterDropdown();
    const i = ot(this.dom, this.name + "-column-filter", "ln-data-table") || ot(this.dom, "column-filter", "ln-data-table");
    if (!i) return;
    const l = i.firstElementChild;
    if (!l) return;
    const u = this._getUniqueValues(e), o = l.querySelector("[data-ln-filter-options]"), d = l.querySelector("[data-ln-filter-search]"), p = this.currentFilters[e] || [], r = this;
    if (d && u.length <= 8 && d.classList.add("hidden"), o) {
      for (let v = 0; v < u.length; v++) {
        const w = u[v], E = document.createElement("li"), A = document.createElement("label"), C = document.createElement("input");
        C.type = "checkbox", C.value = w, C.checked = p.length === 0 || p.indexOf(w) !== -1, A.appendChild(C), A.appendChild(document.createTextNode(" " + w)), E.appendChild(A), o.appendChild(E);
      }
      o.addEventListener("change", function(v) {
        v.target.type === "checkbox" && r._onFilterChange(e, o);
      });
    }
    d && d.addEventListener("input", function() {
      const v = d.value.toLowerCase(), w = o.querySelectorAll("li");
      for (let E = 0; E < w.length; E++) {
        const A = w[E].textContent.toLowerCase();
        w[E].classList.toggle("hidden", v && A.indexOf(v) === -1);
      }
    });
    const m = l.querySelector("[data-ln-filter-clear]");
    m && m.addEventListener("click", function() {
      delete r.currentFilters[e], r._closeFilterDropdown(), r._updateFilterIndicators(), T(r.dom, "ln-data-table:filter", {
        table: r.name,
        field: e,
        values: []
      }), r._requestData();
    }), n.appendChild(l), this._activeDropdown = { field: e, th: n, el: l }, l.addEventListener("click", function(v) {
      v.stopPropagation();
    });
  }, s.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, s.prototype._onFilterChange = function(e, n) {
    const t = n.querySelectorAll('input[type="checkbox"]'), i = [];
    let l = !0;
    for (let u = 0; u < t.length; u++)
      t[u].checked ? i.push(t[u].value) : l = !1;
    l || i.length === 0 ? delete this.currentFilters[e] : this.currentFilters[e] = i, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: e,
      values: l ? [] : i
    }), this._requestData();
  }, s.prototype._updateFilterOptions = function(e) {
    if (e !== null && typeof e == "object" && !Array.isArray(e)) {
      const n = Object.keys(e);
      for (let t = 0; t < n.length; t++) {
        const i = n[t], l = e[i];
        if (!Array.isArray(l)) continue;
        const u = {}, o = [];
        for (let d = 0; d < l.length; d++) {
          const p = String(l[d]);
          u[p] || (u[p] = !0, o.push(p));
        }
        this._filterOptions[i] = o.sort();
      }
    } else {
      const n = this._filterableFields, t = this._data;
      for (let i = 0; i < n.length; i++) {
        const l = n[i];
        this._filterOptions[l] || (this._filterOptions[l] = []);
        const u = this._filterOptions[l], o = {};
        for (let d = 0; d < u.length; d++)
          o[u[d]] = !0;
        for (let d = 0; d < t.length; d++) {
          const p = t[d][l];
          if (p != null) {
            const r = String(p);
            o[r] || (o[r] = !0, u.push(r));
          }
        }
        u.sort();
      }
    }
  }, s.prototype._getUniqueValues = function(e) {
    return (this._filterOptions[e] || []).slice().sort();
  }, s.prototype._updateFilterIndicators = function() {
    const e = this.ths;
    for (let n = 0; n < e.length; n++) {
      const t = e[n], i = t.getAttribute("data-ln-col");
      if (!i) continue;
      const l = t.querySelector("[data-ln-col-filter]");
      if (!l) continue;
      const u = this.currentFilters[i] && this.currentFilters[i].length > 0;
      l.classList.toggle("ln-filter-active", !!u);
    }
  }, s.prototype._renderRows = function() {
    if (!this.tbody) return;
    const e = this._data, n = this._lastTotal, t = this._lastFiltered;
    if (n === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (e.length === 0 || t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    e.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, s.prototype._renderAll = function() {
    const e = this._data, n = document.createDocumentFragment();
    for (let t = 0; t < e.length; t++) {
      const i = this._buildRow(e[t]);
      if (!i) break;
      n.appendChild(i);
    }
    this.tbody.textContent = "", this.tbody.appendChild(n), this._selectable && this._updateSelectAll();
  }, s.prototype._buildRow = function(e) {
    const n = ot(this.dom, this.name + "-row", "ln-data-table");
    if (!n) return null;
    const t = n.querySelector("[data-ln-row]") || n.firstElementChild;
    if (!t) return null;
    if (this._fillRow(t, e), t._lnRecord = e, e.id != null && t.setAttribute("data-ln-row-id", e.id), this._selectable && e.id != null && this.selectedIds.has(String(e.id))) {
      t.classList.add("ln-row-selected");
      const i = t.querySelector("[data-ln-row-select]");
      i && (i.checked = !0);
    }
    return t;
  }, s.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const e = this;
    if (!this._rowHeight) {
      const t = this._buildRow(this._data[0]);
      t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollContainer = a(this.dom);
    const n = this._scrollContainer || window;
    this._scrollHandler = function() {
      e._rafId || (e._rafId = requestAnimationFrame(function() {
        e._rafId = null, e._renderVirtual();
      }));
    }, n.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const e = this._data, n = e.length, t = this._rowHeight;
    if (!t || !n) return;
    const i = this.thead ? this.thead.offsetHeight : 0, l = this._scrollContainer;
    let u, o;
    if (l) {
      const E = this.table.getBoundingClientRect(), A = l.getBoundingClientRect(), C = E.top - A.top + l.scrollTop + i;
      u = l.scrollTop - C, o = l.clientHeight;
    } else {
      const C = this.table.getBoundingClientRect().top + window.scrollY + i;
      u = window.scrollY - C, o = window.innerHeight;
    }
    const d = Math.max(0, Math.floor(u / t) - 15), p = Math.min(d + Math.ceil(o / t) + 30, n);
    if (d === this._vStart && p === this._vEnd) return;
    this._vStart = d, this._vEnd = p;
    const r = this.ths.length || 1, m = d * t, v = (n - p) * t, w = document.createDocumentFragment();
    if (m > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", r), A.style.height = m + "px", E.appendChild(A), w.appendChild(E);
    }
    for (let E = d; E < p; E++) {
      const A = this._buildRow(e[E]);
      A && w.appendChild(A);
    }
    if (v > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", r), A.style.height = v + "px", E.appendChild(A), w.appendChild(E);
    }
    this.tbody.textContent = "", this.tbody.appendChild(w), this._selectable && this._updateSelectAll();
  }, s.prototype._fillRow = function(e, n) {
    const t = e.querySelectorAll("[data-ln-cell]");
    for (let l = 0; l < t.length; l++) {
      const u = t[l], o = u.getAttribute("data-ln-cell");
      n[o] != null && (u.textContent = n[o]);
    }
    const i = e.querySelectorAll("[data-ln-cell-attr]");
    for (let l = 0; l < i.length; l++) {
      const u = i[l], o = u.getAttribute("data-ln-cell-attr").split(",");
      for (let d = 0; d < o.length; d++) {
        const p = o[d].trim().split(":");
        if (p.length !== 2) continue;
        const r = p[0].trim(), m = p[1].trim();
        n[r] != null && u.setAttribute(m, n[r]);
      }
    }
  }, s.prototype._showEmptyState = function(e) {
    const n = ot(this.dom, e, "ln-data-table");
    this.tbody.textContent = "", n && this.tbody.appendChild(n);
  }, s.prototype._updateFooter = function() {
    const e = this._lastTotal, n = this._lastFiltered, t = n < e;
    if (this._totalSpan && (this._totalSpan.textContent = b(e)), this._filteredSpan && (this._filteredSpan.textContent = t ? b(n) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !t), this._selectedSpan) {
      const i = this.selectedIds.size;
      this._selectedSpan.textContent = i > 0 ? b(i) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._toolbarRO && (this._toolbarRO.disconnect(), this._toolbarRO = null), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[c]);
  }, B(h, c, s, "ln-data-table");
})();
(function() {
  const h = "ln-icons-sprite", c = "#ln-", y = "#lnc-", _ = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
  let b = null;
  const a = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), e = "lni:", n = "lni:v", t = "1";
  function i() {
    try {
      if (localStorage.getItem(n) !== t) {
        for (let m = localStorage.length - 1; m >= 0; m--) {
          const v = localStorage.key(m);
          v && v.indexOf(e) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(n, t);
      }
    } catch {
    }
  }
  i();
  function l() {
    return b || (b = document.getElementById(h), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = h, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function u(m) {
    return m.indexOf(y) === 0 ? s + "/" + m.slice(y.length) + ".svg" : a + "/" + m.slice(c.length) + ".svg";
  }
  function o(m, v) {
    const w = v.match(/viewBox="([^"]+)"/), E = w ? w[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", I = v.match(/<svg([^>]*)>/i), F = I ? I[1] : "", D = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    D.id = m, D.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const H = F.match(new RegExp(M + '="([^"]*)"'));
      H && D.setAttribute(M, H[1]);
    }), D.innerHTML = C, l().querySelector("defs").appendChild(D);
  }
  function d(m) {
    if (_.has(m) || g.has(m) || m.indexOf(y) === 0 && !s) return;
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
    const v = 'use[href^="' + c + '"], use[href^="' + y + '"]', w = m.querySelectorAll ? m.querySelectorAll(v) : [];
    if (m.matches && m.matches(v)) {
      const E = m.getAttribute("href");
      E && d(E);
    }
    Array.prototype.forEach.call(w, function(E) {
      const A = E.getAttribute("href");
      A && d(A);
    });
  }
  function r() {
    p(document), new MutationObserver(function(m) {
      m.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(w) {
            w.nodeType === 1 && p(w);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const w = v.target.getAttribute("href");
          w && (w.indexOf(c) === 0 || w.indexOf(y) === 0) && d(w);
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
