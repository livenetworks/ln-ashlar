const gt = {};
function bt(h, c) {
  gt[h] || (gt[h] = document.querySelector('[data-ln-template="' + h + '"]'));
  const b = gt[h];
  return b ? b.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + h + '" not found'), null);
}
function T(h, c, b) {
  h.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: b || {}
  }));
}
function z(h, c, b) {
  const g = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: b || {}
  });
  return h.dispatchEvent(g), g;
}
function $(h, c) {
  if (!h || !c) return h;
  const b = h.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < b.length; r++) {
    const n = b[r], t = n.getAttribute("data-ln-field");
    c[t] != null && (n.textContent = c[t]);
  }
  const g = h.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < g.length; r++) {
    const n = g[r], t = n.getAttribute("data-ln-attr").split(",");
    for (let i = 0; i < t.length; i++) {
      const e = t[i].trim().split(":");
      if (e.length !== 2) continue;
      const o = e[0].trim(), s = e[1].trim();
      c[s] != null && n.setAttribute(o, c[s]);
    }
  }
  const p = h.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < p.length; r++) {
    const n = p[r], t = n.getAttribute("data-ln-show");
    t in c && n.classList.toggle("hidden", !c[t]);
  }
  const _ = h.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < _.length; r++) {
    const n = _[r], t = n.getAttribute("data-ln-class").split(",");
    for (let i = 0; i < t.length; i++) {
      const e = t[i].trim().split(":");
      if (e.length !== 2) continue;
      const o = e[0].trim(), s = e[1].trim();
      s in c && n.classList.toggle(o, !!c[s]);
    }
  }
  return h;
}
function Tt(h, c) {
  if (!h || !c) return h;
  const b = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (; b.nextNode(); ) {
    const g = b.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(p, _) {
        return c[_] !== void 0 ? c[_] : "";
      }
    ));
  }
  return h;
}
function V(h, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      V(h, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  h();
}
function rt(h, c, b) {
  if (h) {
    const g = h.querySelector('[data-ln-template="' + c + '"]');
    if (g) return g.content.cloneNode(!0);
  }
  return bt(c, b);
}
function Ct(h, c) {
  const b = {}, g = h.querySelectorAll("[" + c + "]");
  for (let p = 0; p < g.length; p++)
    b[g[p].getAttribute(c)] = g[p].textContent, g[p].remove();
  return b;
}
function _t(h, c, b, g) {
  if (h.nodeType !== 1) return;
  const _ = c.indexOf("[") !== -1 || c.indexOf(".") !== -1 || c.indexOf("#") !== -1 ? c : "[" + c + "]", r = Array.from(h.querySelectorAll(_));
  h.matches && h.matches(_) && r.push(h);
  for (const n of r)
    n[b] || (n[b] = new g(n));
}
function st(h) {
  return !!(h.offsetWidth || h.offsetHeight || h.getClientRects().length);
}
function At(h) {
  const c = {}, b = h.elements;
  for (let g = 0; g < b.length; g++) {
    const p = b[g];
    if (!(!p.name || p.disabled || p.type === "file" || p.type === "submit" || p.type === "button"))
      if (p.type === "checkbox")
        c[p.name] || (c[p.name] = []), p.checked && c[p.name].push(p.value);
      else if (p.type === "radio")
        p.checked && (c[p.name] = p.value);
      else if (p.type === "select-multiple") {
        c[p.name] = [];
        for (let _ = 0; _ < p.options.length; _++)
          p.options[_].selected && c[p.name].push(p.options[_].value);
      } else
        c[p.name] = p.value;
  }
  return c;
}
function wt(h, c) {
  const b = h.elements, g = [];
  for (let p = 0; p < b.length; p++) {
    const _ = b[p];
    if (!_.name || !(_.name in c) || _.type === "file" || _.type === "submit" || _.type === "button") continue;
    const r = c[_.name];
    if (_.type === "checkbox")
      _.checked = Array.isArray(r) ? r.indexOf(_.value) !== -1 : !!r, g.push(_);
    else if (_.type === "radio")
      _.checked = _.value === String(r), g.push(_);
    else if (_.type === "select-multiple") {
      if (Array.isArray(r))
        for (let n = 0; n < _.options.length; n++)
          _.options[n].selected = r.indexOf(_.options[n].value) !== -1;
      g.push(_);
    } else
      _.value = r, g.push(_);
  }
  return g;
}
function G(h) {
  const c = h.closest("[lang]");
  return (c ? c.lang : null) || navigator.language;
}
function B(h, c, b, g, p = {}) {
  const _ = p.extraAttributes || [], r = p.onAttributeChange || null, n = p.onInit || null;
  function t(i) {
    const e = i || document.body;
    _t(e, h, c, b), n && n(e);
  }
  return V(function() {
    const i = new MutationObserver(function(o) {
      for (let s = 0; s < o.length; s++) {
        const u = o[s];
        if (u.type === "childList")
          for (let a = 0; a < u.addedNodes.length; a++) {
            const l = u.addedNodes[a];
            l.nodeType === 1 && (_t(l, h, c, b), n && n(l));
          }
        else if (u.type === "attributes") {
          const a = u.attributeName === h || h.indexOf("[" + u.attributeName) !== -1;
          r && u.target[c] && a ? r(u.target, u.attributeName) : (_t(u.target, h, c, b), n && n(u.target));
        }
      }
    });
    let e = [];
    if (h.indexOf("[") !== -1) {
      const o = /\[([\w-]+)/g;
      let s;
      for (; (s = o.exec(h)) !== null; )
        e.push(s[1]);
    } else
      e.push(h);
    i.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: e.concat(_)
    });
  }, g || (h.indexOf("[") === -1 ? h.replace("data-", "") : "component")), window[c] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
const vt = Symbol("deepReactive");
function kt(h, c) {
  function b(g) {
    if (g === null || typeof g != "object" || g[vt]) return g;
    const p = Object.keys(g);
    for (let _ = 0; _ < p.length; _++) {
      const r = g[p[_]];
      r !== null && typeof r == "object" && (g[p[_]] = b(r));
    }
    return new Proxy(g, {
      get(_, r) {
        return r === vt ? !0 : _[r];
      },
      set(_, r, n) {
        const t = _[r];
        return n !== null && typeof n == "object" && (n = b(n)), _[r] = n, t !== n && c(), !0;
      },
      deleteProperty(_, r) {
        return r in _ && (delete _[r], c()), !0;
      }
    });
  }
  return b(h);
}
function xt(h, c) {
  let b = !1;
  return function() {
    b || (b = !0, queueMicrotask(function() {
      b = !1, h(), c && c();
    }));
  };
}
const Ot = "ln:";
function It() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function St(h, c) {
  const b = c.getAttribute("data-ln-persist"), g = b !== null && b !== "" ? b : c.id;
  return g ? Ot + h + ":" + It() + ":" + g : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function ft(h, c) {
  const b = St(h, c);
  if (!b) return null;
  try {
    const g = localStorage.getItem(b);
    return g !== null ? JSON.parse(g) : null;
  } catch {
    return null;
  }
}
function Q(h, c, b) {
  const g = St(h, c);
  if (g)
    try {
      localStorage.setItem(g, JSON.stringify(b));
    } catch {
    }
}
function yt(h, c, b, g) {
  const p = typeof g == "number" ? g : 4, _ = window.innerWidth, r = window.innerHeight, n = c.width, t = c.height, i = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = i[b] || i.bottom;
  function o(l) {
    let m, d, y = !0;
    return l === "top" ? (m = h.top - p - t, d = h.left + (h.width - n) / 2, m < 0 && (y = !1)) : l === "bottom" ? (m = h.bottom + p, d = h.left + (h.width - n) / 2, m + t > r && (y = !1)) : l === "left" ? (m = h.top + (h.height - t) / 2, d = h.left - p - n, d < 0 && (y = !1)) : (m = h.top + (h.height - t) / 2, d = h.right + p, d + n > _ && (y = !1)), { top: m, left: d, side: l, fits: y };
  }
  let s = null;
  for (let l = 0; l < e.length; l++) {
    const m = o(e[l]);
    if (m.fits) {
      s = m;
      break;
    }
  }
  s || (s = o(e[0]));
  let u = s.top, a = s.left;
  return n >= _ ? a = 0 : (a < 0 && (a = 0), a + n > _ && (a = _ - n)), t >= r ? u = 0 : (u < 0 && (u = 0), u + t > r && (u = r - t)), { top: u, left: a, placement: s.side };
}
function Rt(h) {
  if (!h || h.parentNode === document.body)
    return function() {
    };
  const c = h.parentNode, b = document.createComment("ln-teleport");
  return c.insertBefore(b, h), document.body.appendChild(h), function() {
    b.parentNode && (b.parentNode.insertBefore(h, b), b.parentNode.removeChild(b));
  };
}
function Et(h) {
  if (!h) return { width: 0, height: 0 };
  const c = h.style, b = c.visibility, g = c.display, p = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const _ = h.offsetWidth, r = h.offsetHeight;
  return c.visibility = b, c.display = g, c.position = p, { width: _, height: r };
}
(function() {
  if (window.lnHttp) return;
  const h = window.fetch.bind(window), c = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function g(i) {
    return typeof i == "string" ? i : i instanceof URL ? i.href : i instanceof Request ? i.url : String(i);
  }
  function p(i, e) {
    return e && e.method ? String(e.method).toUpperCase() : i instanceof Request ? i.method.toUpperCase() : "GET";
  }
  function _(i, e) {
    return e + " " + i;
  }
  function r(i) {
    return i === "GET" || i === "HEAD";
  }
  function n(i, e) {
    e = e || {};
    const o = g(i), s = p(i, e), u = _(o, s);
    r(s) && c.has(u) && (c.get(u).abort(), c.delete(u));
    const a = new AbortController(), l = e.signal;
    l && (l.aborted ? a.abort(l.reason) : l.addEventListener("abort", function() {
      a.abort(l.reason);
    }, { once: !0 }));
    const m = Object.assign({}, e, { signal: a.signal });
    return c.set(u, a), h(i, m).finally(function() {
      c.get(u) === a && c.delete(u);
    });
  }
  n.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = n;
  function t(i) {
    const e = i.detail || {};
    if (!e.url) return;
    const o = i.target, s = (e.method || (e.body ? "POST" : "GET")).toUpperCase(), u = e.key;
    u && b.has(u) && (b.get(u).abort(), b.delete(u));
    const a = new AbortController(), l = e.signal;
    l && (l.aborted ? a.abort(l.reason) : l.addEventListener("abort", function() {
      a.abort(l.reason);
    }, { once: !0 })), u && b.set(u, a);
    const m = { method: s, signal: a.signal };
    e.body !== void 0 && (m.body = e.body), window.fetch(e.url, m).then(function(d) {
      u && b.get(u) === a && b.delete(u), T(o, "ln-http:response", {
        ok: d.ok,
        status: d.status,
        response: d
      });
    }).catch(function(d) {
      u && b.get(u) === a && b.delete(u), !(d && d.name === "AbortError") && T(o, "ln-http:error", {
        ok: !1,
        status: 0,
        error: d
      });
    });
  }
  document.addEventListener("ln-http:request", t), window.lnHttp = {
    cancel: function(i) {
      let e = !1;
      return c.forEach(function(o, s) {
        s.endsWith(" " + i) && (o.abort(), c.delete(s), e = !0);
      }), e;
    },
    cancelByKey: function(i) {
      return b.has(i) ? (b.get(i).abort(), b.delete(i), !0) : !1;
    },
    cancelAll: function() {
      c.forEach(function(i) {
        i.abort();
      }), c.clear(), b.forEach(function(i) {
        i.abort();
      }), b.clear();
    },
    get inflight() {
      const i = [];
      return c.forEach(function(e, o) {
        const s = o.indexOf(" ");
        i.push({ method: o.slice(0, s), url: o.slice(s + 1) });
      }), b.forEach(function(e, o) {
        i.push({ key: o });
      }), i;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", t), window.fetch = h, delete window.lnHttp;
    }
  };
})();
(function() {
  const h = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0) return;
  function b(e) {
    if (!e.hasAttribute(h) || e[c]) return;
    e[c] = !0;
    const o = n(e);
    g(o.links), p(o.forms);
  }
  function g(e) {
    for (const o of e) {
      if (o[c + "Trigger"] || o.hostname && o.hostname !== window.location.hostname) continue;
      const s = o.getAttribute("href");
      if (s && s.includes("#")) continue;
      const u = function(a) {
        if (a.ctrlKey || a.metaKey || a.button === 1) return;
        a.preventDefault();
        const l = o.getAttribute("href");
        l && r("GET", l, null, o);
      };
      o.addEventListener("click", u), o[c + "Trigger"] = u;
    }
  }
  function p(e) {
    for (const o of e) {
      if (o[c + "Trigger"]) continue;
      const s = function(u) {
        u.preventDefault();
        const a = o.method.toUpperCase(), l = o.action, m = new FormData(o);
        for (const d of o.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        r(a, l, m, o, function() {
          for (const d of o.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      o.addEventListener("submit", s), o[c + "Trigger"] = s;
    }
  }
  function _(e) {
    if (!e[c]) return;
    const o = n(e);
    for (const s of o.links)
      s[c + "Trigger"] && (s.removeEventListener("click", s[c + "Trigger"]), delete s[c + "Trigger"]);
    for (const s of o.forms)
      s[c + "Trigger"] && (s.removeEventListener("submit", s[c + "Trigger"]), delete s[c + "Trigger"]);
    delete e[c];
  }
  function r(e, o, s, u, a) {
    if (z(u, "ln-ajax:before-start", { method: e, url: o }).defaultPrevented) return;
    T(u, "ln-ajax:start", { method: e, url: o }), u.classList.add("ln-ajax--loading");
    const m = document.createElement("span");
    m.className = "ln-ajax-spinner", u.appendChild(m);
    function d() {
      u.classList.remove("ln-ajax--loading");
      const A = u.querySelector(".ln-ajax-spinner");
      A && A.remove(), a && a();
    }
    let y = o;
    const v = document.querySelector('meta[name="csrf-token"]'), w = v ? v.getAttribute("content") : null;
    s instanceof FormData && w && s.append("_token", w);
    const E = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), e === "GET" && s) {
      const A = new URLSearchParams(s);
      y = o + (o.includes("?") ? "&" : "?") + A.toString();
    } else e !== "GET" && s && (E.body = s);
    fetch(y, E).then(function(A) {
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
        } else u.tagName === "FORM" && u.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", y);
        T(u, "ln-ajax:success", { method: e, url: y, data: C });
      } else
        T(u, "ln-ajax:error", { method: e, url: y, status: A.status, data: C });
      if (C.message && window.lnToast) {
        const I = C.message;
        window.lnToast.enqueue({
          type: I.type || (A.ok ? "success" : "error"),
          title: I.title || "",
          message: I.body || ""
        });
      }
      T(u, "ln-ajax:complete", { method: e, url: y }), d();
    }).catch(function(A) {
      T(u, "ln-ajax:error", { method: e, url: y, error: A }), T(u, "ln-ajax:complete", { method: e, url: y }), d();
    });
  }
  function n(e) {
    const o = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(h) !== "false" ? o.links.push(e) : e.tagName === "FORM" && e.getAttribute(h) !== "false" ? o.forms.push(e) : (o.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), o.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), o;
  }
  function t() {
    V(function() {
      new MutationObserver(function(o) {
        for (const s of o)
          if (s.type === "childList") {
            for (const u of s.addedNodes)
              if (u.nodeType === 1 && (b(u), !u.hasAttribute(h))) {
                for (const l of u.querySelectorAll("[" + h + "]"))
                  b(l);
                const a = u.closest && u.closest("[" + h + "]");
                if (a && a.getAttribute(h) !== "false") {
                  const l = n(u);
                  g(l.links), p(l.forms);
                }
              }
          } else s.type === "attributes" && b(s.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-ajax");
  }
  function i() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      b(e);
  }
  window[c] = b, window[c].destroy = _, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
})();
(function() {
  const h = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function b(r) {
    const n = Array.from(r.querySelectorAll("[data-ln-modal-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-modal-for") && n.push(r);
    for (const t of n) {
      if (t[c + "Trigger"]) continue;
      const i = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const o = t.getAttribute("data-ln-modal-for"), s = document.getElementById(o);
        if (!s) {
          console.warn('[ln-modal] No modal found for data-ln-modal-for="' + o + '"');
          return;
        }
        s[c] && s[c].toggle();
      };
      t.addEventListener("click", i), t[c + "Trigger"] = i;
    }
  }
  function g(r) {
    this.dom = r, this.isOpen = r.getAttribute(h) === "open";
    const n = this;
    return this._onEscape = function(t) {
      t.key === "Escape" && n.close();
    }, this._onFocusTrap = function(t) {
      if (t.key !== "Tab") return;
      const i = Array.prototype.filter.call(
        n.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        st
      );
      if (i.length === 0) return;
      const e = i[0], o = i[i.length - 1];
      t.shiftKey ? document.activeElement === e && (t.preventDefault(), o.focus()) : document.activeElement === o && (t.preventDefault(), e.focus());
    }, this._onClose = function(t) {
      t.preventDefault(), n.close();
    }, _(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  g.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(h, "open");
  }, g.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "close");
  }, g.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, g.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), this._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const r = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of r)
      t[c + "Close"] && (t.removeEventListener("click", t[c + "Close"]), delete t[c + "Close"]);
    const n = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const t of n)
      t[c + "Trigger"] && (t.removeEventListener("click", t[c + "Trigger"]), delete t[c + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
  };
  function p(r) {
    const n = r[c];
    if (!n) return;
    const i = r.getAttribute(h) === "open";
    if (i !== n.isOpen)
      if (i) {
        if (z(r, "ln-modal:before-open", { modalId: r.id, target: r }).defaultPrevented) {
          r.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, r.setAttribute("aria-modal", "true"), r.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", n._onEscape), document.addEventListener("keydown", n._onFocusTrap);
        const o = document.activeElement;
        n._returnFocusEl = o && o !== document.body ? o : null;
        const s = r.querySelector("[autofocus]");
        if (s && st(s))
          s.focus();
        else {
          const u = r.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), a = Array.prototype.find.call(u, st);
          if (a) a.focus();
          else {
            const l = r.querySelectorAll("a[href], button:not([disabled])"), m = Array.prototype.find.call(l, st);
            m && m.focus();
          }
        }
        T(r, "ln-modal:open", { modalId: r.id, target: r });
      } else {
        if (z(r, "ln-modal:before-close", { modalId: r.id, target: r }).defaultPrevented) {
          r.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, r.removeAttribute("aria-modal"), document.removeEventListener("keydown", n._onEscape), document.removeEventListener("keydown", n._onFocusTrap), T(r, "ln-modal:close", { modalId: r.id, target: r }), n._returnFocusEl && document.contains(n._returnFocusEl) && typeof n._returnFocusEl.focus == "function" && n._returnFocusEl.focus(), n._returnFocusEl = null, document.querySelector("[" + h + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function _(r) {
    const n = r.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of n)
      t[c + "Close"] || (t.addEventListener("click", r._onClose), t[c + "Close"] = r._onClose);
  }
  B(h, c, g, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: p,
    onInit: b
  });
})();
(function() {
  const h = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const b = {}, g = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(t) {
    if (!b[t]) {
      const i = new Intl.NumberFormat(t, { useGrouping: !0 }), e = i.formatToParts(1234.5);
      let o = "", s = ".";
      for (let u = 0; u < e.length; u++)
        e[u].type === "group" && (o = e[u].value), e[u].type === "decimal" && (s = e[u].value);
      b[t] = { fmt: i, groupSep: o, decimalSep: s };
    }
    return b[t];
  }
  function _(t, i, e) {
    if (e !== null) {
      const o = parseInt(e, 10), s = t + "|d" + o;
      return b[s] || (b[s] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: o })), b[s].format(i);
    }
    return p(t).fmt.format(i);
  }
  function r(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    this.dom = t;
    const i = document.createElement("input");
    i.type = "hidden", i.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", i), this._hidden = i;
    const e = this;
    Object.defineProperty(i, "value", {
      get: function() {
        return g.get.call(i);
      },
      set: function(s) {
        g.set.call(i, s), s !== "" && !isNaN(parseFloat(s)) ? e._displayFormatted(parseFloat(s)) : s === "" && (e.dom.value = "");
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(s) {
      s.preventDefault();
      const u = (s.clipboardData || window.clipboardData).getData("text"), a = p(G(t)), l = a.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let m = u.replace(new RegExp("[^0-9\\-" + l + ".]", "g"), "");
      a.groupSep && (m = m.split(a.groupSep).join("")), a.decimalSep !== "." && (m = m.replace(a.decimalSep, "."));
      const d = parseFloat(m);
      isNaN(d) ? (t.value = "", e._hidden.value = "") : e.value = d;
    }, t.addEventListener("paste", this._onPaste);
    const o = t.value;
    if (o !== "") {
      const s = parseFloat(o);
      isNaN(s) || (this._displayFormatted(s), g.set.call(i, String(s)));
    }
    return this;
  }
  r.prototype._handleInput = function() {
    const t = this.dom, i = p(G(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", T(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const o = t.selectionStart;
    let s = 0;
    for (let A = 0; A < o; A++)
      /[0-9]/.test(e[A]) && s++;
    let u = e;
    if (i.groupSep && (u = u.split(i.groupSep).join("")), u = u.replace(i.decimalSep, "."), e.endsWith(i.decimalSep) || e.endsWith(".")) {
      const A = u.replace(/\.$/, ""), C = parseFloat(A);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const a = u.indexOf(".");
    if (a !== -1 && u.slice(a + 1).endsWith("0")) {
      const C = parseFloat(u);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const l = t.getAttribute("data-ln-number-decimals");
    if (l !== null && a !== -1) {
      const A = parseInt(l, 10);
      u.slice(a + 1).length > A && (u = u.slice(0, a + 1 + A));
    }
    const m = parseFloat(u);
    if (isNaN(m)) return;
    const d = t.getAttribute("data-ln-number-min"), y = t.getAttribute("data-ln-number-max");
    if (d !== null && m < parseFloat(d) || y !== null && m > parseFloat(y)) return;
    let v;
    if (l !== null)
      v = _(G(t), m, l);
    else {
      const A = a !== -1 ? u.slice(a + 1).length : 0;
      if (A > 0) {
        const C = G(t) + "|u" + A;
        b[C] || (b[C] = new Intl.NumberFormat(G(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), v = b[C].format(m);
      } else
        v = i.fmt.format(m);
    }
    t.value = v;
    let w = s, E = 0;
    for (let A = 0; A < v.length && w > 0; A++)
      E = A + 1, /[0-9]/.test(v[A]) && w--;
    w > 0 && (E = v.length), t.setSelectionRange(E, E), this._setHiddenRaw(m), T(t, "ln-number:input", { value: m, formatted: v });
  }, r.prototype._setHiddenRaw = function(t) {
    g.set.call(this._hidden, String(t));
  }, r.prototype._displayFormatted = function(t) {
    this.dom.value = _(G(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(r.prototype, "value", {
    get: function() {
      const t = this._hidden.value;
      return t === "" ? NaN : parseFloat(t);
    },
    set: function(t) {
      if (typeof t != "number" || isNaN(t)) {
        this.dom.value = "", this._setHiddenRaw("");
        return;
      }
      this._displayFormatted(t), this._setHiddenRaw(t), T(this.dom, "ln-number:input", {
        value: t,
        formatted: this.dom.value
      });
    }
  }), Object.defineProperty(r.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), r.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function n() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + h + "]");
      for (let i = 0; i < t.length; i++) {
        const e = t[i][c];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, c, r, "ln-number"), n();
})();
(function() {
  const h = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const b = {}, g = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(a, l) {
    const m = a + "|" + JSON.stringify(l);
    return b[m] || (b[m] = new Intl.DateTimeFormat(a, l)), b[m];
  }
  const _ = /^(short|medium|long)(\s+datetime)?$/, r = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function n(a) {
    return !a || a === "" ? { dateStyle: "medium" } : a.match(_) ? r[a] : null;
  }
  function t(a, l, m) {
    const d = a.getDate(), y = a.getMonth(), v = a.getFullYear(), w = a.getHours(), E = a.getMinutes(), A = {
      yyyy: String(v),
      yy: String(v).slice(-2),
      MMMM: p(m, { month: "long" }).format(a),
      MMM: p(m, { month: "short" }).format(a),
      MM: String(y + 1).padStart(2, "0"),
      M: String(y + 1),
      dd: String(d).padStart(2, "0"),
      d: String(d),
      HH: String(w).padStart(2, "0"),
      mm: String(E).padStart(2, "0")
    };
    return l.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return A[C];
    });
  }
  function i(a, l, m) {
    const d = n(l);
    return d ? p(m, d).format(a) : t(a, l, m);
  }
  function e(a) {
    if (a.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", a.tagName), this;
    this.dom = a;
    const l = this, m = a.value, d = a.name, y = document.createElement("input");
    y.type = "hidden", y.name = d, a.removeAttribute("name"), a.insertAdjacentElement("afterend", y), this._hidden = y;
    const v = document.createElement("input");
    v.type = "date", v.tabIndex = -1, v.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", v), this._picker = v, a.type = "text";
    const w = document.createElement("button");
    if (w.type = "button", w.setAttribute("aria-label", "Open date picker"), w.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', v.insertAdjacentElement("afterend", w), this._btn = w, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return g.get.call(y);
      },
      set: function(E) {
        if (g.set.call(y, E), E && E !== "") {
          const A = o(E);
          A && (l._displayFormatted(A), g.set.call(v, E));
        } else E === "" && (l.dom.value = "", g.set.call(v, ""));
      }
    }), this._onPickerChange = function() {
      const E = v.value;
      if (E) {
        const A = o(E);
        A && (l._setHiddenRaw(E), l._displayFormatted(A), l._lastISO = E, T(l.dom, "ln-date:change", {
          value: E,
          formatted: l.dom.value,
          date: A
        }));
      } else
        l._setHiddenRaw(""), l.dom.value = "", l._lastISO = "", T(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, v.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const E = l.dom.value.trim();
      if (E === "") {
        l._lastISO !== "" && (l._setHiddenRaw(""), g.set.call(l._picker, ""), l.dom.value = "", l._lastISO = "", T(l.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (l._lastISO) {
        const C = o(l._lastISO);
        if (C) {
          const I = l.dom.getAttribute(h) || "", F = G(l.dom), q = i(C, I, F);
          if (E === q) return;
        }
      }
      const A = s(E);
      if (A) {
        const C = A.getFullYear(), I = String(A.getMonth() + 1).padStart(2, "0"), F = String(A.getDate()).padStart(2, "0"), q = C + "-" + I + "-" + F;
        l._setHiddenRaw(q), g.set.call(l._picker, q), l._displayFormatted(A), l._lastISO = q, T(l.dom, "ln-date:change", {
          value: q,
          formatted: l.dom.value,
          date: A
        });
      } else if (l._lastISO) {
        const C = o(l._lastISO);
        C && l._displayFormatted(C);
      } else
        l.dom.value = "";
    }, a.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      l._openPicker();
    }, w.addEventListener("click", this._onBtnClick), m && m !== "") {
      const E = o(m);
      E && (this._setHiddenRaw(m), g.set.call(v, m), this._displayFormatted(E), this._lastISO = m);
    }
    return this;
  }
  function o(a) {
    if (!a || typeof a != "string") return null;
    const l = a.split("T"), m = l[0].split("-");
    if (m.length < 3) return null;
    const d = parseInt(m[0], 10), y = parseInt(m[1], 10) - 1, v = parseInt(m[2], 10);
    if (isNaN(d) || isNaN(y) || isNaN(v)) return null;
    let w = 0, E = 0;
    if (l[1]) {
      const C = l[1].split(":");
      w = parseInt(C[0], 10) || 0, E = parseInt(C[1], 10) || 0;
    }
    const A = new Date(d, y, v, w, E);
    return A.getFullYear() !== d || A.getMonth() !== y || A.getDate() !== v ? null : A;
  }
  function s(a) {
    if (!a || typeof a != "string" || (a = a.trim(), a.length < 6)) return null;
    let l, m;
    if (a.indexOf(".") !== -1)
      l = ".", m = a.split(".");
    else if (a.indexOf("/") !== -1)
      l = "/", m = a.split("/");
    else if (a.indexOf("-") !== -1)
      l = "-", m = a.split("-");
    else
      return null;
    if (m.length !== 3) return null;
    const d = [];
    for (let A = 0; A < 3; A++) {
      const C = parseInt(m[A], 10);
      if (isNaN(C)) return null;
      d.push(C);
    }
    let y, v, w;
    l === "." ? (y = d[0], v = d[1], w = d[2]) : l === "/" ? (v = d[0], y = d[1], w = d[2]) : m[0].length === 4 ? (w = d[0], v = d[1], y = d[2]) : (y = d[0], v = d[1], w = d[2]), w < 100 && (w += w < 50 ? 2e3 : 1900);
    const E = new Date(w, v - 1, y);
    return E.getFullYear() !== w || E.getMonth() !== v - 1 || E.getDate() !== y ? null : E;
  }
  e.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, e.prototype._setHiddenRaw = function(a) {
    g.set.call(this._hidden, a);
  }, e.prototype._displayFormatted = function(a) {
    const l = this.dom.getAttribute(h) || "", m = G(this.dom);
    this.dom.value = i(a, l, m);
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return g.get.call(this._hidden);
    },
    set: function(a) {
      if (!a || a === "") {
        this._setHiddenRaw(""), g.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const l = o(a);
      l && (this._setHiddenRaw(a), g.set.call(this._picker, a), this._displayFormatted(l), this._lastISO = a, T(this.dom, "ln-date:change", {
        value: a,
        formatted: this.dom.value,
        date: l
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const a = this.value;
      return a ? o(a) : null;
    },
    set: function(a) {
      if (!a || !(a instanceof Date) || isNaN(a.getTime())) {
        this.value = "";
        return;
      }
      const l = a.getFullYear(), m = String(a.getMonth() + 1).padStart(2, "0"), d = String(a.getDate()).padStart(2, "0");
      this.value = l + "-" + m + "-" + d;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const a = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), a && (this.dom.value = a), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function u() {
    new MutationObserver(function() {
      const a = document.querySelectorAll("[" + h + "]");
      for (let l = 0; l < a.length; l++) {
        const m = a[l][c];
        if (m && m.value) {
          const d = o(m.value);
          d && m._displayFormatted(d);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  B(h, c, e, "ln-date"), u();
})();
(function() {
  const h = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const b = /* @__PURE__ */ new WeakMap(), g = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const o of g)
        o();
    }, history._lnNavPatched = !0;
  }
  function p(e) {
    if (!e.hasAttribute(h) || b.has(e)) return;
    const o = e.getAttribute(h);
    if (!o) return;
    const s = _(e, o);
    b.set(e, s), e[c] = s;
  }
  function _(e, o) {
    let s = Array.from(e.querySelectorAll("a"));
    n(s, o, window.location.pathname);
    const u = function() {
      s = Array.from(e.querySelectorAll("a")), n(s, o, window.location.pathname);
    };
    window.addEventListener("popstate", u), g.push(u);
    const a = new MutationObserver(function(l) {
      for (const m of l)
        if (m.type === "childList") {
          for (const d of m.addedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                s.push(d), n([d], o, window.location.pathname);
              else if (d.querySelectorAll) {
                const y = Array.from(d.querySelectorAll("a"));
                s = s.concat(y), n(y, o, window.location.pathname);
              }
            }
          for (const d of m.removedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                s = s.filter(function(y) {
                  return y !== d;
                });
              else if (d.querySelectorAll) {
                const y = Array.from(d.querySelectorAll("a"));
                s = s.filter(function(v) {
                  return !y.includes(v);
                });
              }
            }
        }
    });
    return a.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: o,
      observer: a,
      updateHandler: u,
      destroy: function() {
        a.disconnect(), window.removeEventListener("popstate", u);
        const l = g.indexOf(u);
        l !== -1 && g.splice(l, 1), b.delete(e), delete e[c];
      }
    };
  }
  function r(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function n(e, o, s) {
    const u = r(s);
    for (const a of e) {
      const l = a.getAttribute("href");
      if (!l) continue;
      const m = r(l);
      a.classList.remove(o);
      const d = m === u, y = m !== "/" && u.startsWith(m + "/");
      (d || y) && a.classList.add(o);
    }
  }
  function t() {
    V(function() {
      new MutationObserver(function(o) {
        for (const s of o)
          if (s.type === "childList") {
            for (const u of s.addedNodes)
              if (u.nodeType === 1 && (u.hasAttribute && u.hasAttribute(h) && p(u), u.querySelectorAll))
                for (const a of u.querySelectorAll("[" + h + "]"))
                  p(a);
          } else s.type === "attributes" && s.target.hasAttribute && s.target.hasAttribute(h) && p(s.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
    }, "ln-nav");
  }
  window[c] = p;
  function i() {
    for (const e of document.querySelectorAll("[" + h + "]"))
      p(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i) : i();
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
  const c = /* @__PURE__ */ new WeakMap();
  function b(r) {
    if (c.has(r)) return;
    const n = r.getAttribute("data-ln-select");
    let t = {};
    if (n && n.trim() !== "")
      try {
        t = JSON.parse(n);
      } catch (o) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", o);
      }
    const e = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: r.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...t };
    try {
      const o = new h(r, e);
      c.set(r, o);
      const s = r.closest("form");
      if (s) {
        const u = () => {
          setTimeout(() => {
            o.clear(), o.clearOptions(), o.sync();
          }, 0);
        };
        s.addEventListener("reset", u), o._lnResetHandler = u, o._lnResetForm = s;
      }
    } catch (o) {
      console.warn("[ln-select] Failed to initialize Tom Select:", o);
    }
  }
  function g(r) {
    const n = c.get(r);
    n && (n._lnResetForm && n._lnResetHandler && n._lnResetForm.removeEventListener("reset", n._lnResetHandler), n.destroy(), c.delete(r));
  }
  function p() {
    for (const r of document.querySelectorAll("select[data-ln-select]"))
      b(r);
  }
  function _() {
    V(function() {
      new MutationObserver(function(n) {
        for (const t of n) {
          if (t.type === "attributes") {
            t.target.matches && t.target.matches("select[data-ln-select]") && b(t.target);
            continue;
          }
          for (const i of t.addedNodes)
            if (i.nodeType === 1 && (i.matches && i.matches("select[data-ln-select]") && b(i), i.querySelectorAll))
              for (const e of i.querySelectorAll("select[data-ln-select]"))
                b(e);
          for (const i of t.removedNodes)
            if (i.nodeType === 1 && (i.matches && i.matches("select[data-ln-select]") && g(i), i.querySelectorAll))
              for (const e of i.querySelectorAll("select[data-ln-select]"))
                g(e);
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
    p(), _();
  }) : (p(), _()), window.lnSelect = {
    initialize: b,
    destroy: g,
    getInstance: function(r) {
      return c.get(r);
    }
  };
})();
(function() {
  const h = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function b() {
    const r = (location.hash || "").replace("#", ""), n = {};
    if (!r) return n;
    for (const t of r.split("&")) {
      const i = t.indexOf(":");
      i > 0 && (n[t.slice(0, i)] = t.slice(i + 1));
    }
    return n;
  }
  function g(r, n) {
    const t = (r.getAttribute("data-ln-tab") || "").toLowerCase().trim();
    if (t) return t;
    if (r.tagName !== "A") return "";
    const i = r.getAttribute("href") || "";
    if (!i.startsWith("#")) return "";
    const e = i.slice(1);
    if (!e) return "";
    const o = e.split("&");
    if (n)
      for (const a of o) {
        const l = a.indexOf(":");
        if (l > 0 && a.slice(0, l).toLowerCase().trim() === n)
          return a.slice(l + 1).toLowerCase().trim();
      }
    const s = o[o.length - 1] || "", u = s.indexOf(":");
    return (u > 0 ? s.slice(u + 1) : s).toLowerCase().trim();
  }
  function p(r) {
    return this.dom = r, _.call(this), this;
  }
  function _() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey, this.mapTabs = {}, this.mapPanels = {};
    for (const n of this.tabs) {
      const t = g(n, this.nsKey);
      t ? this.mapTabs[t] = n : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', n);
    }
    for (const n of this.panels) {
      const t = (n.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      t && (this.mapPanels[t] = n);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false";
    const r = this;
    this._clickHandlers = [];
    for (const n of this.tabs) {
      if (n[c + "Trigger"]) continue;
      const t = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        const e = g(n, r.nsKey);
        if (e)
          if (n.tagName === "A" && i.preventDefault(), r.hashEnabled) {
            const o = b();
            o[r.nsKey] = e;
            const s = Object.keys(o).map(function(u) {
              return u + ":" + o[u];
            }).join("&");
            location.hash === "#" + s ? r.dom.setAttribute("data-ln-tabs-active", e) : location.hash = s;
          } else
            r.dom.setAttribute("data-ln-tabs-active", e);
      };
      n.addEventListener("click", t), n[c + "Trigger"] = t, r._clickHandlers.push({ el: n, handler: t });
    }
    if (this._hashHandler = function() {
      if (!r.hashEnabled) return;
      const n = b();
      r.activate(r.nsKey in n ? n[r.nsKey] : r.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let n = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const t = ft("tabs", this.dom);
        t !== null && t in this.mapPanels && (n = t);
      }
      this.activate(n);
    }
  }
  p.prototype.activate = function(r) {
    (!r || !(r in this.mapPanels)) && (r = this.defaultKey), this.dom.setAttribute("data-ln-tabs-active", r);
  }, p.prototype._applyActive = function(r) {
    var n;
    (!r || !(r in this.mapPanels)) && (r = this.defaultKey);
    for (const t in this.mapTabs) {
      const i = this.mapTabs[t];
      t === r ? (i.setAttribute("data-active", ""), i.setAttribute("aria-selected", "true")) : (i.removeAttribute("data-active"), i.setAttribute("aria-selected", "false"));
    }
    for (const t in this.mapPanels) {
      const i = this.mapPanels[t], e = t === r;
      i.classList.toggle("hidden", !e), i.setAttribute("aria-hidden", e ? "false" : "true");
    }
    if (this.autoFocus) {
      const t = (n = this.mapPanels[r]) == null ? void 0 : n.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      t && setTimeout(() => t.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: r, tab: this.mapTabs[r], panel: this.mapPanels[r] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && Q("tabs", this.dom, r);
  }, p.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const { el: r, handler: n } of this._clickHandlers)
        r.removeEventListener("click", n), delete r[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, B(h, c, p, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(r) {
      const n = r.getAttribute("data-ln-tabs-active");
      r[c]._applyActive(n);
    }
  });
})();
(function() {
  const h = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function b(r) {
    const n = Array.from(r.querySelectorAll("[data-ln-toggle-for]"));
    r.hasAttribute && r.hasAttribute("data-ln-toggle-for") && n.push(r);
    for (const t of n) {
      if (t[c + "Trigger"]) continue;
      const i = function(s) {
        if (s.ctrlKey || s.metaKey || s.button === 1) return;
        s.preventDefault();
        const u = t.getAttribute("data-ln-toggle-for"), a = document.getElementById(u);
        if (!a || !a[c]) return;
        const l = t.getAttribute("data-ln-toggle-action") || "toggle";
        if (l === "open")
          a.setAttribute(h, "open");
        else if (l === "close")
          a.setAttribute(h, "close");
        else if (l === "toggle") {
          const m = a.getAttribute(h);
          a.setAttribute(h, m === "open" ? "close" : "open");
        }
      };
      t.addEventListener("click", i), t[c + "Trigger"] = i;
      const e = t.getAttribute("data-ln-toggle-for"), o = document.getElementById(e);
      o && o[c] && t.setAttribute("aria-expanded", o[c].isOpen ? "true" : "false");
    }
  }
  function g(r, n) {
    const t = document.querySelectorAll(
      '[data-ln-toggle-for="' + r.id + '"]'
    );
    for (const i of t)
      i.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function p(r) {
    if (this.dom = r, r.hasAttribute("data-ln-persist")) {
      const n = ft("toggle", r);
      n !== null && r.setAttribute(h, n);
    }
    return this.isOpen = r.getAttribute(h) === "open", this.isOpen && r.classList.add("open"), g(r, this.isOpen), this;
  }
  p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const r = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const n of r)
      n[c + "Trigger"] && (n.removeEventListener("click", n[c + "Trigger"]), delete n[c + "Trigger"]);
    delete this.dom[c];
  };
  function _(r) {
    const n = r[c];
    if (!n) return;
    const i = r.getAttribute(h) === "open";
    if (i !== n.isOpen)
      if (i) {
        if (z(r, "ln-toggle:before-open", { target: r }).defaultPrevented) {
          r.setAttribute(h, "close");
          return;
        }
        n.isOpen = !0, r.classList.add("open"), g(r, !0), T(r, "ln-toggle:open", { target: r }), r.hasAttribute("data-ln-persist") && Q("toggle", r, "open");
      } else {
        if (z(r, "ln-toggle:before-close", { target: r }).defaultPrevented) {
          r.setAttribute(h, "open");
          return;
        }
        n.isOpen = !1, r.classList.remove("open"), g(r, !1), T(r, "ln-toggle:close", { target: r }), r.hasAttribute("data-ln-persist") && Q("toggle", r, "close");
      }
  }
  B(h, c, p, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: _,
    onInit: b
  });
})();
(function() {
  const h = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function b(g) {
    return this.dom = g, this._onToggleOpen = function(p) {
      if (p.detail.target.closest("[data-ln-accordion]") !== g) return;
      const _ = g.querySelectorAll("[data-ln-toggle]");
      for (const r of _)
        r !== p.detail.target && r.closest("[data-ln-accordion]") === g && r.getAttribute("data-ln-toggle") === "open" && r.setAttribute("data-ln-toggle", "close");
      T(g, "ln-accordion:change", { target: p.detail.target });
    }, g.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  b.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, b, "ln-accordion");
})();
(function() {
  const h = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function b(g) {
    if (this.dom = g, this.toggleEl = g.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = g.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const _ of this.toggleEl.children)
        _.setAttribute("role", "menuitem");
    const p = this;
    return this._onToggleOpen = function(_) {
      _.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "true"), p._teleportToBody(), p._addOutsideClickListener(), p._addScrollRepositionListener(), p._addResizeCloseListener(), T(g, "ln-dropdown:open", { target: _.detail.target }));
    }, this._onToggleClose = function(_) {
      _.detail.target === p.toggleEl && (p.triggerBtn && p.triggerBtn.setAttribute("aria-expanded", "false"), p._removeOutsideClickListener(), p._removeScrollRepositionListener(), p._removeResizeCloseListener(), p._teleportBack(), T(g, "ln-dropdown:close", { target: _.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  b.prototype._positionMenu = function() {
    const g = this.dom.querySelector("[data-ln-toggle-for]");
    if (!g || !this.toggleEl) return;
    const p = g.getBoundingClientRect(), _ = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    _ && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const r = this.toggleEl.offsetWidth, n = this.toggleEl.offsetHeight;
    _ && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, i = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4;
    let o;
    p.bottom + e + n <= i ? o = p.bottom + e : p.top - e - n >= 0 ? o = p.top - e - n : o = Math.max(0, i - n);
    let s;
    p.right - r >= 0 ? s = p.right - r : p.left + r <= t ? s = p.left : s = Math.max(0, t - r), this.toggleEl.style.top = o + "px", this.toggleEl.style.left = s + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, b.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, b.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, b.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const g = this;
    this._boundDocClick = function(p) {
      g.dom.contains(p.target) || g.toggleEl && g.toggleEl.contains(p.target) || g.toggleEl && g.toggleEl.getAttribute("data-ln-toggle") === "open" && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, g._docClickTimeout = setTimeout(function() {
      g._docClickTimeout = null, document.addEventListener("click", g._boundDocClick);
    }, 0);
  }, b.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, b.prototype._addScrollRepositionListener = function() {
    const g = this;
    this._boundScrollReposition = function() {
      g._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, b.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, b.prototype._addResizeCloseListener = function() {
    const g = this;
    this._boundResizeClose = function() {
      g.toggleEl && g.toggleEl.getAttribute("data-ln-toggle") === "open" && g.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, b.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, b.prototype.destroy = function() {
    this.dom[c] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, b, "ln-dropdown");
})();
(function() {
  const h = "data-ln-popover", c = "lnPopover", b = "data-ln-popover-for", g = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const p = [];
  let _ = null;
  function r() {
    _ || (_ = function(e) {
      if (e.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", _));
  }
  function n() {
    p.length > 0 || _ && (document.removeEventListener("keydown", _), _ = null);
  }
  function t(e) {
    return this.dom = e, this.isOpen = e.getAttribute(h) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, e.hasAttribute("tabindex") || e.setAttribute("tabindex", "-1"), e.hasAttribute("role") || e.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  t.prototype.open = function(e) {
    this.isOpen || (this.trigger = e || null, this.dom.setAttribute(h, "open"));
  }, t.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(h, "closed");
  }, t.prototype.toggle = function(e) {
    this.isOpen ? this.close() : this.open(e);
  }, t.prototype._applyOpen = function(e) {
    this.isOpen = !0, e && (this.trigger = e), this._previousFocus = document.activeElement, this._teleportRestore = Rt(this.dom);
    const o = Et(this.dom);
    if (this.trigger) {
      const l = this.trigger.getBoundingClientRect(), m = this.dom.getAttribute(g) || "bottom", d = yt(l, o, m, 8);
      this.dom.style.top = d.top + "px", this.dom.style.left = d.left + "px", this.dom.setAttribute("data-ln-popover-placement", d.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const s = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), u = Array.prototype.find.call(s, st);
    u ? u.focus() : this.dom.focus();
    const a = this;
    this._boundDocClick = function(l) {
      a.dom.contains(l.target) || a.trigger && a.trigger.contains(l.target) || a.close();
    }, a._docClickTimeout = setTimeout(function() {
      a._docClickTimeout = null, document.addEventListener("click", a._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!a.trigger) return;
      const l = a.trigger.getBoundingClientRect(), m = Et(a.dom), d = a.dom.getAttribute(g) || "bottom", y = yt(l, m, d, 8);
      a.dom.style.top = y.top + "px", a.dom.style.left = y.left + "px", a.dom.setAttribute("data-ln-popover-placement", y.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), r(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, t.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const e = p.indexOf(this);
    e !== -1 && p.splice(e, 1), n(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, t.prototype.destroy = function() {
    this.dom[c] && (this.isOpen && this._applyClose(), delete this.dom[c], T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }));
  };
  function i(e) {
    this.dom = e;
    const o = e.getAttribute(b);
    return e.setAttribute("aria-haspopup", "dialog"), e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-controls", o), this._onClick = function(s) {
      if (s.ctrlKey || s.metaKey || s.button === 1) return;
      s.preventDefault();
      const u = document.getElementById(o);
      !u || !u[c] || u[c].toggle(e);
    }, e.addEventListener("click", this._onClick), this;
  }
  i.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[c + "Trigger"];
  }, B(h, c, t, "ln-popover", {
    onAttributeChange: function(e) {
      const o = e[c];
      if (!o) return;
      const u = e.getAttribute(h) === "open";
      if (u !== o.isOpen)
        if (u) {
          if (z(e, "ln-popover:before-open", {
            popoverId: e.id,
            target: e,
            trigger: o.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "closed");
            return;
          }
          o._applyOpen(o.trigger);
        } else {
          if (z(e, "ln-popover:before-close", {
            popoverId: e.id,
            target: e,
            trigger: o.trigger
          }).defaultPrevented) {
            e.setAttribute(h, "open");
            return;
          }
          o._applyClose();
        }
    }
  }), B(b, c + "Trigger", i, "ln-popover-trigger");
})();
(function() {
  const h = "data-ln-tooltip-enhance", c = "data-ln-tooltip", b = "data-ln-tooltip-position", g = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[g] !== void 0) return;
  let _ = 0, r = null, n = null, t = null, i = null, e = null;
  function o() {
    return r && r.parentNode || (r = document.getElementById(p), r || (r = document.createElement("div"), r.id = p, document.body.appendChild(r))), r;
  }
  function s() {
    e || (e = function(d) {
      d.key === "Escape" && l();
    }, document.addEventListener("keydown", e));
  }
  function u() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function a(d) {
    if (t === d) return;
    l();
    const y = d.getAttribute(c) || d.getAttribute("title");
    if (!y) return;
    o(), d.hasAttribute("title") && (i = d.getAttribute("title"), d.removeAttribute("title"));
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = y, d[g + "Uid"] || (_ += 1, d[g + "Uid"] = "ln-tooltip-" + _), v.id = d[g + "Uid"], r.appendChild(v);
    const w = v.offsetWidth, E = v.offsetHeight, A = d.getBoundingClientRect(), C = d.getAttribute(b) || "top", I = yt(A, { width: w, height: E }, C, 6);
    v.style.top = I.top + "px", v.style.left = I.left + "px", v.setAttribute("data-ln-tooltip-placement", I.placement), d.setAttribute("aria-describedby", v.id), n = v, t = d, s();
  }
  function l() {
    if (!n) {
      u();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), i !== null && t.setAttribute("title", i)), i = null, n.parentNode && n.parentNode.removeChild(n), n = null, t = null, u();
  }
  function m(d) {
    return this.dom = d, this._onEnter = function() {
      a(d);
    }, this._onLeave = function() {
      t === d && l();
    }, this._onFocus = function() {
      a(d);
    }, this._onBlur = function() {
      t === d && l();
    }, d.addEventListener("mouseenter", this._onEnter), d.addEventListener("mouseleave", this._onLeave), d.addEventListener("focus", this._onFocus, !0), d.addEventListener("blur", this._onBlur, !0), this;
  }
  m.prototype.destroy = function() {
    const d = this.dom;
    d.removeEventListener("mouseenter", this._onEnter), d.removeEventListener("mouseleave", this._onLeave), d.removeEventListener("focus", this._onFocus, !0), d.removeEventListener("blur", this._onBlur, !0), t === d && l(), delete d[g], delete d[g + "Uid"], T(d, "ln-tooltip:destroyed", { trigger: d });
  }, B(
    "[" + h + "], [" + c + "][title]",
    g,
    m,
    "ln-tooltip"
  );
})();
(function() {
  const h = "data-ln-toast", c = "lnToast", b = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function g(l = document.body) {
    return p(l), a;
  }
  function p(l) {
    if (!l || l.nodeType !== 1) return;
    const m = Array.from(l.querySelectorAll("[" + h + "]"));
    l.hasAttribute && l.hasAttribute(h) && m.push(l);
    for (const d of m)
      d[c] || new _(d);
  }
  function _(l) {
    this.dom = l, l[c] = this, this.timeoutDefault = parseInt(l.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(l.getAttribute("data-ln-toast-max") || "5", 10);
    for (const m of Array.from(l.querySelectorAll("[data-ln-toast-item]")))
      i(m);
    return this;
  }
  _.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const l of Array.from(this.dom.children))
        o(l);
      delete this.dom[c];
    }
  };
  function r(l) {
    return l === "success" ? "Success" : l === "error" ? "Error" : l === "warn" ? "Warning" : "Information";
  }
  function n(l) {
    return l === "warn" ? "warning" : l;
  }
  function t(l, m, d) {
    const y = document.createElement("div");
    y.className = "ln-toast__card " + n(l), y.setAttribute("role", l === "error" ? "alert" : "status"), y.setAttribute("aria-live", l === "error" ? "assertive" : "polite");
    const v = document.createElement("div");
    v.className = "ln-toast__side", v.innerHTML = b[l] || b.info;
    const w = document.createElement("div");
    w.className = "ln-toast__content";
    const E = document.createElement("div");
    E.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = m || r(l);
    const C = document.createElement("button");
    return C.type = "button", C.className = "ln-toast__close", C.setAttribute("aria-label", "Close"), C.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>', C.addEventListener("click", function() {
      o(d);
    }), E.appendChild(A), w.appendChild(E), w.appendChild(C), y.appendChild(v), y.appendChild(w), { card: y, content: w };
  }
  function i(l) {
    const m = ((l.getAttribute("data-type") || "info") + "").toLowerCase(), d = l.getAttribute("data-title"), y = (l.innerText || l.textContent || "").trim();
    l.className = "ln-toast__item", l.removeAttribute("data-ln-toast-item");
    const v = t(m, d, l);
    if (y) {
      const w = document.createElement("div");
      w.className = "ln-toast__body";
      const E = document.createElement("p");
      E.textContent = y, w.appendChild(E), v.content.appendChild(w);
    }
    l.innerHTML = "", l.appendChild(v.card), requestAnimationFrame(() => l.classList.add("ln-toast__item--in"));
  }
  function e(l, m) {
    for (; l.dom.children.length >= l.max; ) l.dom.removeChild(l.dom.firstElementChild);
    l.dom.appendChild(m), requestAnimationFrame(() => m.classList.add("ln-toast__item--in"));
  }
  function o(l) {
    !l || !l.parentNode || (clearTimeout(l._timer), l.classList.remove("ln-toast__item--in"), l.classList.add("ln-toast__item--out"), setTimeout(() => {
      l.parentNode && l.parentNode.removeChild(l);
    }, 200));
  }
  function s(l = {}) {
    let m = l.container;
    if (typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !m)
      return console.warn("[ln-toast] No toast container found"), null;
    const d = m[c] || new _(m), y = Number.isFinite(l.timeout) ? l.timeout : d.timeoutDefault, v = (l.type || "info").toLowerCase(), w = document.createElement("li");
    w.className = "ln-toast__item";
    const E = t(v, l.title, w);
    if (l.message || l.data && l.data.errors) {
      const A = document.createElement("div");
      if (A.className = "ln-toast__body", l.message)
        if (Array.isArray(l.message)) {
          const C = document.createElement("ul");
          for (const I of l.message) {
            const F = document.createElement("li");
            F.textContent = I, C.appendChild(F);
          }
          A.appendChild(C);
        } else {
          const C = document.createElement("p");
          C.textContent = l.message, A.appendChild(C);
        }
      if (l.data && l.data.errors) {
        const C = document.createElement("ul");
        for (const I of Object.values(l.data.errors).flat()) {
          const F = document.createElement("li");
          F.textContent = I, C.appendChild(F);
        }
        A.appendChild(C);
      }
      E.content.appendChild(A);
    }
    return w.appendChild(E.card), e(d, w), y > 0 && (w._timer = setTimeout(() => o(w), y)), w;
  }
  function u(l) {
    let m = l;
    if (typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + h + "]") || document.getElementById("ln-toast-container")), !!m)
      for (const d of Array.from(m.children))
        o(d);
  }
  const a = function(l) {
    return g(l);
  };
  a.enqueue = s, a.clear = u, V(function() {
    new MutationObserver(function(m) {
      for (const d of m) {
        if (d.type === "attributes") {
          p(d.target);
          continue;
        }
        for (const y of d.addedNodes)
          p(y);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [h] });
  }, "ln-toast"), window[c] = a, window.addEventListener("ln-toast:enqueue", function(l) {
    l.detail && a.enqueue(l.detail);
  }), g(document.body);
})();
(function() {
  const h = "data-ln-upload", c = "lnUpload", b = "data-ln-upload-dict", g = "data-ln-upload-accept", p = "data-ln-upload-context", _ = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function r() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const a = document.createElement("div");
    a.innerHTML = _;
    const l = a.firstElementChild;
    l && document.body.appendChild(l);
  }
  if (window[c] !== void 0) return;
  function n(a) {
    if (a === 0) return "0 B";
    const l = 1024, m = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(a) / Math.log(l));
    return parseFloat((a / Math.pow(l, d)).toFixed(1)) + " " + m[d];
  }
  function t(a) {
    return a.split(".").pop().toLowerCase();
  }
  function i(a) {
    return a === "docx" && (a = "doc"), ["pdf", "doc", "epub"].includes(a) ? "lnc-file-" + a : "ln-file";
  }
  function e(a, l) {
    if (!l) return !0;
    const m = "." + t(a.name);
    return l.split(",").map(function(y) {
      return y.trim().toLowerCase();
    }).includes(m.toLowerCase());
  }
  function o(a) {
    if (a.hasAttribute("data-ln-upload-initialized")) return;
    a.setAttribute("data-ln-upload-initialized", "true"), r();
    const l = Ct(a, b), m = a.querySelector(".ln-upload__zone"), d = a.querySelector(".ln-upload__list"), y = a.getAttribute(g) || "";
    if (!m || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", a);
      return;
    }
    let v = a.querySelector('input[type="file"]');
    v || (v = document.createElement("input"), v.type = "file", v.multiple = !0, v.classList.add("hidden"), y && (v.accept = y.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), a.appendChild(v));
    const w = a.getAttribute(h) || "/files/upload", E = a.getAttribute(p) || "", A = /* @__PURE__ */ new Map();
    let C = 0;
    function I() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function F(R) {
      if (!e(R, y)) {
        const k = l["invalid-type"];
        T(a, "ln-upload:invalid", {
          file: R,
          message: k
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["invalid-title"] || "Invalid File",
          message: k || l["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const H = "file-" + ++C, P = t(R.name), Y = i(P), ct = rt(a, "ln-upload-item", "ln-upload");
      if (!ct) return;
      const K = ct.firstElementChild;
      if (!K) return;
      K.setAttribute("data-file-id", H), $(K, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + Y,
        removeLabel: l.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const it = K.querySelector(".ln-upload__progress-bar"), f = K.querySelector('[data-ln-upload-action="remove"]');
      f && (f.disabled = !0), d.appendChild(K);
      const L = new FormData();
      L.append("file", R), L.append("context", E);
      const S = new XMLHttpRequest();
      S.upload.addEventListener("progress", function(k) {
        if (k.lengthComputable) {
          const x = Math.round(k.loaded / k.total * 100);
          it.style.width = x + "%", $(K, { sizeText: x + "%" });
        }
      }), S.addEventListener("load", function() {
        if (S.status >= 200 && S.status < 300) {
          let k;
          try {
            k = JSON.parse(S.responseText);
          } catch {
            O("Invalid response");
            return;
          }
          $(K, { sizeText: n(k.size || R.size), uploading: !1 }), f && (f.disabled = !1), A.set(H, {
            serverId: k.id,
            name: k.name,
            size: k.size
          }), q(), T(a, "ln-upload:uploaded", {
            localId: H,
            serverId: k.id,
            name: k.name
          });
        } else {
          let k = l["upload-failed"] || "Upload failed";
          try {
            k = JSON.parse(S.responseText).message || k;
          } catch {
          }
          O(k);
        }
      }), S.addEventListener("error", function() {
        O(l["network-error"] || "Network error");
      });
      function O(k) {
        it && (it.style.width = "100%"), $(K, { sizeText: l.error || "Error", uploading: !1, error: !0 }), f && (f.disabled = !1), T(a, "ln-upload:error", {
          file: R,
          message: k
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["error-title"] || "Upload Error",
          message: k || l["upload-failed"] || "Failed to upload file"
        });
      }
      S.open("POST", w), S.setRequestHeader("X-CSRF-TOKEN", I()), S.setRequestHeader("Accept", "application/json"), S.send(L);
    }
    function q() {
      for (const R of a.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const H = document.createElement("input");
        H.type = "hidden", H.name = "file_ids[]", H.value = R.serverId, a.appendChild(H);
      }
    }
    function M(R) {
      const H = A.get(R), P = d.querySelector('[data-file-id="' + R + '"]');
      if (!H || !H.serverId) {
        P && P.remove(), A.delete(R), q();
        return;
      }
      P && $(P, { deleting: !0 }), fetch("/files/" + H.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": I(),
          Accept: "application/json"
        }
      }).then(function(Y) {
        Y.status === 200 ? (P && P.remove(), A.delete(R), q(), T(a, "ln-upload:removed", {
          localId: R,
          serverId: H.serverId
        })) : (P && $(P, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["delete-title"] || "Error",
          message: l["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(Y) {
        console.warn("[ln-upload] Delete error:", Y), P && $(P, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: l["network-error"] || "Network error",
          message: l["connection-error"] || "Could not connect to server"
        });
      });
    }
    function j(R) {
      for (const H of R)
        F(H);
      v.value = "";
    }
    const lt = function() {
      v.click();
    }, at = function() {
      j(this.files);
    }, et = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, W = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.add("ln-upload__zone--dragover");
    }, Z = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.remove("ln-upload__zone--dragover");
    }, tt = function(R) {
      R.preventDefault(), R.stopPropagation(), m.classList.remove("ln-upload__zone--dragover"), j(R.dataTransfer.files);
    }, nt = function(R) {
      const H = R.target.closest('[data-ln-upload-action="remove"]');
      if (!H || !d.contains(H) || H.disabled) return;
      const P = H.closest(".ln-upload__item");
      P && M(P.getAttribute("data-file-id"));
    };
    m.addEventListener("click", lt), v.addEventListener("change", at), m.addEventListener("dragenter", et), m.addEventListener("dragover", W), m.addEventListener("dragleave", Z), m.addEventListener("drop", tt), d.addEventListener("click", nt), a.lnUploadAPI = {
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
        A.clear(), d.innerHTML = "", q(), T(a, "ln-upload:cleared", {});
      },
      destroy: function() {
        m.removeEventListener("click", lt), v.removeEventListener("change", at), m.removeEventListener("dragenter", et), m.removeEventListener("dragover", W), m.removeEventListener("dragleave", Z), m.removeEventListener("drop", tt), d.removeEventListener("click", nt), A.clear(), d.innerHTML = "", q(), a.removeAttribute("data-ln-upload-initialized"), delete a.lnUploadAPI;
      }
    };
  }
  function s() {
    for (const a of document.querySelectorAll("[" + h + "]"))
      o(a);
  }
  function u() {
    V(function() {
      new MutationObserver(function(l) {
        for (const m of l)
          if (m.type === "childList") {
            for (const d of m.addedNodes)
              if (d.nodeType === 1) {
                d.hasAttribute(h) && o(d);
                for (const y of d.querySelectorAll("[" + h + "]"))
                  o(y);
              }
          } else m.type === "attributes" && m.target.hasAttribute(h) && o(m.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [h]
      });
    }, "ln-upload");
  }
  window[c] = {
    init: o,
    initAll: s
  }, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const h = "lnExternalLinks";
  if (window[h] !== void 0) return;
  function c(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function b(n) {
    if (n.getAttribute("data-ln-external-link") === "processed" || !c(n)) return;
    n.target = "_blank";
    const t = (n.rel || "").split(/\s+/).filter(Boolean);
    t.includes("noopener") || t.push("noopener"), t.includes("noreferrer") || t.push("noreferrer"), n.rel = t.join(" ");
    const i = document.createElement("span");
    i.className = "sr-only", i.textContent = "(opens in new tab)", n.appendChild(i), n.setAttribute("data-ln-external-link", "processed"), T(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    });
  }
  function g(n) {
    n = n || document.body;
    for (const t of n.querySelectorAll("a, area"))
      b(t);
  }
  function p() {
    V(function() {
      document.body.addEventListener("click", function(n) {
        const t = n.target.closest("a, area");
        t && t.getAttribute("data-ln-external-link") === "processed" && T(t, "ln-external-links:clicked", {
          link: t,
          href: t.href,
          text: t.textContent || t.title || ""
        });
      });
    }, "ln-external-links");
  }
  function _() {
    V(function() {
      new MutationObserver(function(t) {
        for (const i of t) {
          if (i.type === "childList") {
            for (const e of i.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && b(e), e.querySelectorAll))
                for (const o of e.querySelectorAll("a, area"))
                  b(o);
          }
          if (i.type === "attributes" && i.attributeName === "href") {
            const e = i.target;
            e.matches && (e.matches("a") || e.matches("area")) && b(e);
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
  function r() {
    p(), _(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      g();
    }) : g();
  }
  window[h] = {
    process: g
  }, r();
})();
(function() {
  const h = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  let b = null;
  function g() {
    b = document.createElement("div"), b.className = "ln-link-status", document.body.appendChild(b);
  }
  function p(d) {
    b && (b.textContent = d, b.classList.add("ln-link-status--visible"));
  }
  function _() {
    b && b.classList.remove("ln-link-status--visible");
  }
  function r(d, y) {
    if (y.target.closest("a, button, input, select, textarea")) return;
    const v = d.querySelector("a");
    if (!v) return;
    const w = v.getAttribute("href");
    if (!w) return;
    if (y.ctrlKey || y.metaKey || y.button === 1) {
      window.open(w, "_blank");
      return;
    }
    z(d, "ln-link:navigate", { target: d, href: w, link: v }).defaultPrevented || v.click();
  }
  function n(d) {
    const y = d.querySelector("a");
    if (!y) return;
    const v = y.getAttribute("href");
    v && p(v);
  }
  function t() {
    _();
  }
  function i(d) {
    d[c + "Row"] || (d[c + "Row"] = !0, d.querySelector("a") && (d._lnLinkClick = function(y) {
      r(d, y);
    }, d._lnLinkEnter = function() {
      n(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", t)));
  }
  function e(d) {
    d[c + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", t), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[c + "Row"]);
  }
  function o(d) {
    if (!d[c + "Init"]) return;
    const y = d.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const v = y === "TABLE" && d.querySelector("tbody") || d;
      for (const w of v.querySelectorAll("tr"))
        e(w);
    } else
      e(d);
    delete d[c + "Init"];
  }
  function s(d) {
    if (d[c + "Init"]) return;
    d[c + "Init"] = !0;
    const y = d.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const v = y === "TABLE" && d.querySelector("tbody") || d;
      for (const w of v.querySelectorAll("tr"))
        i(w);
    } else
      i(d);
  }
  function u(d) {
    d.hasAttribute && d.hasAttribute(h) && s(d);
    const y = d.querySelectorAll ? d.querySelectorAll("[" + h + "]") : [];
    for (const v of y)
      s(v);
  }
  function a() {
    V(function() {
      new MutationObserver(function(y) {
        for (const v of y)
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
  function l(d) {
    u(d);
  }
  window[c] = { init: l, destroy: o };
  function m() {
    g(), a(), l(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", m) : m();
})();
(function() {
  const h = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function b(i) {
    g(i);
  }
  function g(i) {
    const e = Array.from(i.querySelectorAll(h));
    for (const o of e)
      o[c] || (o[c] = new p(o));
    i.hasAttribute && i.hasAttribute("data-ln-progress") && !i[c] && (i[c] = new p(i));
  }
  function p(i) {
    return this.dom = i, this._attrObserver = null, this._parentObserver = null, t.call(this), r.call(this), n.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function _() {
    V(function() {
      new MutationObserver(function(e) {
        for (const o of e)
          if (o.type === "childList")
            for (const s of o.addedNodes)
              s.nodeType === 1 && g(s);
          else o.type === "attributes" && g(o.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  _();
  function r() {
    const i = this, e = new MutationObserver(function(o) {
      for (const s of o)
        (s.attributeName === "data-ln-progress" || s.attributeName === "data-ln-progress-max") && t.call(i);
    });
    e.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = e;
  }
  function n() {
    const i = this, e = this.dom.parentElement;
    if (!e || !e.hasAttribute("data-ln-progress-max")) return;
    const o = new MutationObserver(function(s) {
      for (const u of s)
        u.attributeName === "data-ln-progress-max" && t.call(i);
    });
    o.observe(e, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = o;
  }
  function t() {
    const i = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, e = this.dom.parentElement, s = (e && e.hasAttribute("data-ln-progress-max") ? parseFloat(e.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let u = s > 0 ? i / s * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100), this.dom.style.width = u + "%";
    const a = Math.max(0, Math.min(i, s));
    this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", "0"), this.dom.setAttribute("aria-valuemax", String(s)), this.dom.setAttribute("aria-valuenow", String(a)), T(this.dom, "ln-progress:change", { target: this.dom, value: i, max: s, percentage: u });
  }
  window[c] = b, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const h = "data-ln-filter", c = "lnFilter", b = "data-ln-filter-initialized", g = "data-ln-filter-key", p = "data-ln-filter-value", _ = "data-ln-filter-hide", r = "data-ln-filter-reset", n = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function i(s) {
    return s.hasAttribute(r) || s.getAttribute(p) === "";
  }
  function e(s) {
    const u = s.dom, a = s.colIndex, l = u.querySelector("template");
    if (!l || a === null) return;
    const m = document.getElementById(s.targetId);
    if (!m) return;
    const d = m.tagName === "TABLE" ? m : m.querySelector("table");
    if (!d || m.hasAttribute("data-ln-table")) return;
    const y = {}, v = [], w = d.tBodies;
    for (let C = 0; C < w.length; C++) {
      const I = w[C].rows;
      for (let F = 0; F < I.length; F++) {
        const q = I[F].cells[a], M = q ? q.textContent.trim() : "";
        M && !y[M] && (y[M] = !0, v.push(M));
      }
    }
    v.sort(function(C, I) {
      return C.localeCompare(I);
    });
    const E = u.querySelector("[" + g + "]"), A = E ? E.getAttribute(g) : u.getAttribute("data-ln-filter-key") || "col" + a;
    for (let C = 0; C < v.length; C++) {
      const I = l.content.cloneNode(!0), F = I.querySelector("input");
      F && (F.setAttribute(g, A), F.setAttribute(p, v[C]), Tt(I, { text: v[C] }), u.appendChild(I));
    }
  }
  function o(s) {
    if (s.hasAttribute(b)) return this;
    this.dom = s, this.targetId = s.getAttribute(h), this._pendingEvents = [];
    const u = s.getAttribute(n);
    this.colIndex = u !== null ? parseInt(u, 10) : null, e(this), this.inputs = Array.from(s.querySelectorAll("[" + g + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(g) : null;
    const a = this, l = xt(
      function() {
        a._render();
      },
      function() {
        a._afterRender();
      }
    );
    this.state = kt({
      key: null,
      values: []
    }, l), this._attachHandlers();
    let m = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const d = ft("filter", s);
      d && d.key && Array.isArray(d.values) && d.values.length > 0 && (this.state.key = d.key, this.state.values = d.values, m = !0);
    }
    if (!m) {
      let d = null;
      const y = [];
      for (let v = 0; v < this.inputs.length; v++) {
        const w = this.inputs[v];
        if (w.checked && !i(w)) {
          d || (d = w.getAttribute(g));
          const E = w.getAttribute(p);
          E && y.push(E);
        }
      }
      y.length > 0 && (this.state.key = d, this.state.values = y, this._pendingEvents.push({
        name: "ln-filter:changed",
        detail: { key: d, values: y }
      }));
    }
    return s.setAttribute(b, ""), this;
  }
  o.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(u) {
      u[c + "Bound"] || (u[c + "Bound"] = !0, u._lnFilterChange = function() {
        const a = u.getAttribute(g), l = u.getAttribute(p) || "";
        if (i(u)) {
          s._pendingEvents.push({
            name: "ln-filter:changed",
            detail: { key: a, values: [] }
          }), s.reset();
          return;
        }
        if (u.checked)
          s.state.values.indexOf(l) === -1 && (s.state.key = a, s.state.values.push(l));
        else {
          const m = s.state.values.indexOf(l);
          if (m !== -1 && s.state.values.splice(m, 1), s.state.values.length === 0) {
            s._pendingEvents.push({
              name: "ln-filter:changed",
              detail: { key: a, values: [] }
            }), s.reset();
            return;
          }
        }
        s._pendingEvents.push({
          name: "ln-filter:changed",
          detail: { key: s.state.key, values: s.state.values.slice() }
        });
      }, u.addEventListener("change", u._lnFilterChange));
    });
  }, o.prototype._render = function() {
    const s = this, u = this.state.key, a = this.state.values, l = u === null || a.length === 0, m = [];
    for (let d = 0; d < a.length; d++)
      m.push(a[d].toLowerCase());
    if (this.inputs.forEach(function(d) {
      if (l)
        d.checked = i(d);
      else if (i(d))
        d.checked = !1;
      else {
        const y = d.getAttribute(p) || "";
        d.checked = a.indexOf(y) !== -1;
      }
    }), s.colIndex !== null)
      s._filterTableRows();
    else {
      const d = document.getElementById(s.targetId);
      if (!d) return;
      const y = d.children;
      for (let v = 0; v < y.length; v++) {
        const w = y[v];
        if (l) {
          w.removeAttribute(_);
          continue;
        }
        const E = w.getAttribute("data-" + u);
        w.removeAttribute(_), E !== null && m.indexOf(E.toLowerCase()) === -1 && w.setAttribute(_, "true");
      }
    }
  }, o.prototype._afterRender = function() {
    const s = this._pendingEvents;
    this._pendingEvents = [];
    for (let u = 0; u < s.length; u++)
      this._dispatchOnBoth(s[u].name, s[u].detail);
    this.dom.hasAttribute("data-ln-persist") && (this.state.key && this.state.values.length > 0 ? Q("filter", this.dom, { key: this.state.key, values: this.state.values.slice() }) : Q("filter", this.dom, null));
  }, o.prototype._dispatchOnBoth = function(s, u) {
    T(this.dom, s, u);
    const a = document.getElementById(this.targetId);
    a && a !== this.dom && T(a, s, u);
  }, o.prototype._filterTableRows = function() {
    const s = document.getElementById(this.targetId);
    if (!s) return;
    const u = s.tagName === "TABLE" ? s : s.querySelector("table");
    if (!u || s.hasAttribute("data-ln-table")) return;
    const a = this.state.key || this._filterKey, l = this.state.values;
    t.has(u) || t.set(u, {});
    const m = t.get(u);
    if (a && l.length > 0) {
      const w = [];
      for (let E = 0; E < l.length; E++)
        w.push(l[E].toLowerCase());
      m[a] = { col: this.colIndex, values: w };
    } else a && delete m[a];
    const d = Object.keys(m), y = d.length > 0, v = u.tBodies;
    for (let w = 0; w < v.length; w++) {
      const E = v[w].rows;
      for (let A = 0; A < E.length; A++) {
        const C = E[A];
        if (!y) {
          C.removeAttribute(_);
          continue;
        }
        let I = !0;
        for (let F = 0; F < d.length; F++) {
          const q = m[d[F]], M = C.cells[q.col], j = M ? M.textContent.trim().toLowerCase() : "";
          if (q.values.indexOf(j) === -1) {
            I = !1;
            break;
          }
        }
        I ? C.removeAttribute(_) : C.setAttribute(_, "true");
      }
    }
  }, o.prototype.filter = function(s, u) {
    if (Array.isArray(u)) {
      if (u.length === 0) {
        this.reset();
        return;
      }
      this.state.key = s, this.state.values = u.slice();
    } else if (u)
      this.state.key = s, this.state.values = [u];
    else {
      this.reset();
      return;
    }
    this._pendingEvents.push({
      name: "ln-filter:changed",
      detail: { key: this.state.key, values: this.state.values.slice() }
    });
  }, o.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.values = [];
  }, o.prototype.getActive = function() {
    return this.state.key === null || this.state.values.length === 0 ? null : { key: this.state.key, values: this.state.values.slice() };
  }, o.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const u = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (u && t.has(u)) {
            const a = t.get(u), l = this.state.key || this._filterKey;
            l && a[l] && delete a[l], Object.keys(a).length === 0 && t.delete(u);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[c + "Bound"];
      }), this.dom.removeAttribute(b), delete this.dom[c];
    }
  }, B(h, c, o, "ln-filter");
})();
(function() {
  const h = "data-ln-search", c = "lnSearch", b = "data-ln-search-initialized", g = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function _(r) {
    if (r.hasAttribute(b)) return this;
    this.dom = r, this.targetId = r.getAttribute(h);
    const n = r.tagName;
    if (this.input = n === "INPUT" || n === "TEXTAREA" ? r : r.querySelector('[name="search"]') || r.querySelector('input[type="search"]') || r.querySelector('input[type="text"]'), this.itemsSelector = r.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return r.setAttribute(b, ""), this;
  }
  _.prototype._attachHandler = function() {
    if (!this.input) return;
    const r = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      r.input.value = "", r._search(""), r.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(r._debounceTimer), r._debounceTimer = setTimeout(function() {
        r._search(r.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, _.prototype._search = function(r) {
    const n = document.getElementById(this.targetId);
    if (!n || z(n, "ln-search:change", { term: r, targetId: this.targetId }).defaultPrevented) return;
    const i = this.itemsSelector ? n.querySelectorAll(this.itemsSelector) : n.children;
    for (let e = 0; e < i.length; e++) {
      const o = i[e];
      o.removeAttribute(g), r && !o.textContent.replace(/\s+/g, " ").toLowerCase().includes(r) && o.setAttribute(g, "true");
    }
  }, _.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(b), delete this.dom[c]);
  }, B(h, c, _, "ln-search");
})();
(function() {
  const h = "lnTableSort", c = "data-ln-sort", b = "data-ln-sort-active";
  if (window[h] !== void 0) return;
  function g(t) {
    p(t);
  }
  function p(t) {
    const i = Array.from(t.querySelectorAll("table"));
    t.tagName === "TABLE" && i.push(t), i.forEach(function(e) {
      if (e[h]) return;
      const o = Array.from(e.querySelectorAll("th[" + c + "]"));
      o.length && (e[h] = new r(e, o));
    });
  }
  function _(t, i) {
    t.querySelectorAll("[data-ln-sort-icon]").forEach(function(o) {
      const s = o.getAttribute("data-ln-sort-icon");
      i == null ? o.classList.toggle("hidden", s !== null && s !== "") : o.classList.toggle("hidden", s !== i);
    });
  }
  function r(t, i) {
    this.table = t, this.ths = i, this._col = -1, this._dir = null;
    const e = this;
    i.forEach(function(s, u) {
      s[h + "Bound"] || (s[h + "Bound"] = !0, s._lnSortClick = function(a) {
        const l = a.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        l && l !== s || e._handleClick(u, s);
      }, s.addEventListener("click", s._lnSortClick));
    });
    const o = t.closest("[data-ln-table][data-ln-persist]");
    if (o) {
      const s = ft("table-sort", o);
      s && s.dir && s.col >= 0 && s.col < i.length && (this._handleClick(s.col, i[s.col]), s.dir === "desc" && this._handleClick(s.col, i[s.col]));
    }
    return this;
  }
  r.prototype._handleClick = function(t, i) {
    let e;
    this._col !== t ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(s) {
      s.removeAttribute(b), _(s, null);
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = t, this._dir = e, i.setAttribute(b, e), _(i, e)), T(this.table, "ln-table:sort", {
      column: t,
      sortType: i.getAttribute(c),
      direction: e
    });
    const o = this.table.closest("[data-ln-table][data-ln-persist]");
    o && (e === null ? Q("table-sort", o, null) : Q("table-sort", o, { col: t, dir: e }));
  }, r.prototype.destroy = function() {
    this.table[h] && (this.ths.forEach(function(t) {
      t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete t[h + "Bound"];
    }), delete this.table[h]);
  };
  function n() {
    V(function() {
      new MutationObserver(function(i) {
        i.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(o) {
            o.nodeType === 1 && p(o);
          }) : e.type === "attributes" && p(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[h] = g, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    g(document.body);
  }) : g(document.body);
})();
(function() {
  const h = "data-ln-table", c = "lnTable", b = "data-ln-sort", g = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const r = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function n(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const i = t.querySelector(".ln-table__toolbar");
    i && t.style.setProperty("--ln-table-toolbar-h", i.offsetHeight + "px");
    const e = this;
    return this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      e.tbody.rows.length > 0 && (e._emptyTbodyObserver.disconnect(), e._emptyTbodyObserver = null, e._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSearch = function(o) {
      o.preventDefault(), e._searchTerm = o.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(o) {
      e._sortCol = o.detail.direction === null ? -1 : o.detail.column, e._sortDir = o.detail.direction, e._sortType = o.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:sorted", {
        column: o.detail.column,
        direction: o.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(o) {
      const s = o.detail.key;
      let u = !1;
      for (let m = 0; m < e.ths.length; m++)
        if (e.ths[m].getAttribute("data-ln-filter-col") === s) {
          u = !0;
          break;
        }
      if (!u) return;
      const a = o.detail.values;
      if (!a || a.length === 0)
        delete e._columnFilters[s];
      else {
        const m = [];
        for (let d = 0; d < a.length; d++)
          m.push(a[d].toLowerCase());
        e._columnFilters[s] = m;
      }
      const l = e.dom.querySelector('th[data-ln-filter-col="' + s + '"]');
      l && (a && a.length > 0 ? l.setAttribute("data-ln-filter-active", "") : l.removeAttribute("data-ln-filter-active")), e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(o) {
      if (!o.target.closest("[data-ln-table-clear]")) return;
      e._searchTerm = "";
      const u = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (u) {
        const l = u.tagName === "INPUT" ? u : u.querySelector("input");
        l && (l.value = "");
      }
      e._columnFilters = {};
      for (let l = 0; l < e.ths.length; l++)
        e.ths[l].removeAttribute("data-ln-filter-active");
      const a = document.querySelectorAll('[data-ln-filter="' + t.id + '"]');
      for (let l = 0; l < a.length; l++)
        a[l].lnFilter && a[l].lnFilter.reset();
      e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("click", this._onClear), this;
  }
  n.prototype._parseRows = function() {
    const t = this.tbody.rows, i = this.ths;
    this._data = [];
    const e = [];
    for (let o = 0; o < i.length; o++)
      e[o] = i[o].getAttribute(b);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let o = 0; o < t.length; o++) {
      const s = t[o], u = [], a = [], l = [];
      for (let m = 0; m < s.cells.length; m++) {
        const d = s.cells[m], y = d.textContent.trim(), v = d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : y, w = e[m];
        a[m] = y.toLowerCase(), w === "number" || w === "date" ? u[m] = parseFloat(v) || 0 : w === "string" ? u[m] = String(v) : u[m] = null, m < s.cells.length - 1 && l.push(y.toLowerCase());
      }
      this._data.push({
        sortKeys: u,
        rawTexts: a,
        html: s.outerHTML,
        searchText: l.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, i = this._columnFilters, e = Object.keys(i).length > 0, o = this.ths, s = {};
    if (e)
      for (let d = 0; d < o.length; d++) {
        const y = o[d].getAttribute("data-ln-filter-col");
        y && (s[y] = d);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(d) {
      if (t && d.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const y in i) {
          const v = s[y];
          if (v !== void 0 && i[y].indexOf(d.rawTexts[v]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const u = this._sortCol, a = this._sortDir === "desc" ? -1 : 1, l = this._sortType === "number" || this._sortType === "date", m = r ? r.compare : function(d, y) {
      return d < y ? -1 : d > y ? 1 : 0;
    };
    this._filteredData.sort(function(d, y) {
      const v = d.sortKeys[u], w = y.sortKeys[u];
      return l ? (v - w) * a : m(v, w) * a;
    });
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(i) {
      const e = document.createElement("col");
      e.style.width = i.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, n.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, n.prototype._renderAll = function() {
    const t = [], i = this._filteredData;
    for (let e = 0; e < i.length; e++) t.push(i[e].html);
    this.tbody.innerHTML = t.join("");
  }, n.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const t = this;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, n.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, n.prototype._renderVirtual = function() {
    const t = this._filteredData, i = t.length, e = this._rowHeight;
    if (!e || !i) return;
    const s = this.table.getBoundingClientRect().top + window.scrollY, u = this.thead ? this.thead.offsetHeight : 0, a = s + u, l = window.scrollY - a, m = Math.max(0, Math.floor(l / e) - 15), d = Math.min(m + Math.ceil(window.innerHeight / e) + 30, i);
    if (m === this._vStart && d === this._vEnd) return;
    this._vStart = m, this._vEnd = d;
    const y = this.ths.length || 1, v = m * e, w = (i - d) * e;
    let E = "";
    v > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + y + '" style="height:' + v + 'px;padding:0;border:none"></td></tr>');
    for (let A = m; A < d; A++) E += t[A].html;
    w > 0 && (E += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + y + '" style="height:' + w + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = E;
  }, n.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, i = this.dom.querySelector("template[" + g + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), i && e.appendChild(document.importNode(i.content, !0));
    const o = document.createElement("tr");
    o.className = "ln-table__empty", o.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(o), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, n.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, B(h, c, n, "ln-table");
})();
(function() {
  const h = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const b = "http://www.w3.org/2000/svg", g = 36, p = 16, _ = 2 * Math.PI * p;
  function r(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), i.call(this), o.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  r.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[c]);
  };
  function n(o, s) {
    const u = document.createElementNS(b, o);
    for (const a in s)
      u.setAttribute(a, s[a]);
    return u;
  }
  function t() {
    this.svg = n("svg", {
      viewBox: "0 0 " + g + " " + g,
      "aria-hidden": "true"
    }), this.trackCircle = n("circle", {
      cx: g / 2,
      cy: g / 2,
      r: p,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: g / 2,
      cy: g / 2,
      r: p,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": _,
      "stroke-dashoffset": _,
      transform: "rotate(-90 " + g / 2 + " " + g / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function i() {
    const o = this, s = new MutationObserver(function(u) {
      for (const a of u)
        (a.attributeName === "data-ln-circular-progress" || a.attributeName === "data-ln-circular-progress-max") && e.call(o);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = s;
  }
  function e() {
    const o = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, s = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let u = s > 0 ? o / s * 100 : 0;
    u < 0 && (u = 0), u > 100 && (u = 100);
    const a = _ - u / 100 * _;
    this.progressCircle.setAttribute("stroke-dashoffset", a);
    const l = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = l !== null ? l : Math.round(u) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: o,
      max: s,
      percentage: u
    });
  }
  B(h, c, r, "ln-circular-progress");
})();
(function() {
  const h = "data-ln-sortable", c = "lnSortable", b = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function g(_) {
    this.dom = _, this.isEnabled = _.getAttribute(h) !== "disabled", this._dragging = null, _.setAttribute("aria-roledescription", "sortable list");
    const r = this;
    return this._onPointerDown = function(n) {
      r.isEnabled && r._handlePointerDown(n);
    }, _.addEventListener("pointerdown", this._onPointerDown), this;
  }
  g.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(h, "");
  }, g.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(h, "disabled");
  }, g.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, g.prototype._handlePointerDown = function(_) {
    let r = _.target.closest("[" + b + "]"), n;
    if (r) {
      for (n = r; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + b + "]")) return;
      for (n = _.target; n && n.parentElement !== this.dom; )
        n = n.parentElement;
      if (!n || n.parentElement !== this.dom) return;
      r = n;
    }
    const i = Array.from(this.dom.children).indexOf(n);
    if (z(this.dom, "ln-sortable:before-drag", {
      item: n,
      index: i
    }).defaultPrevented) return;
    _.preventDefault(), r.setPointerCapture(_.pointerId), this._dragging = n, n.classList.add("ln-sortable--dragging"), n.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: n,
      index: i
    });
    const o = this, s = function(a) {
      o._handlePointerMove(a);
    }, u = function(a) {
      o._handlePointerEnd(a), r.removeEventListener("pointermove", s), r.removeEventListener("pointerup", u), r.removeEventListener("pointercancel", u);
    };
    r.addEventListener("pointermove", s), r.addEventListener("pointerup", u), r.addEventListener("pointercancel", u);
  }, g.prototype._handlePointerMove = function(_) {
    if (!this._dragging) return;
    const r = Array.from(this.dom.children), n = this._dragging;
    for (const t of r)
      t.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const t of r) {
      if (t === n) continue;
      const i = t.getBoundingClientRect(), e = i.top + i.height / 2;
      if (_.clientY >= i.top && _.clientY < e) {
        t.classList.add("ln-sortable--drop-before");
        break;
      } else if (_.clientY >= e && _.clientY <= i.bottom) {
        t.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, g.prototype._handlePointerEnd = function(_) {
    if (!this._dragging) return;
    const r = this._dragging, n = Array.from(this.dom.children), t = n.indexOf(r);
    let i = null, e = null;
    for (const o of n) {
      if (o.classList.contains("ln-sortable--drop-before")) {
        i = o, e = "before";
        break;
      }
      if (o.classList.contains("ln-sortable--drop-after")) {
        i = o, e = "after";
        break;
      }
    }
    for (const o of n)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (r.classList.remove("ln-sortable--dragging"), r.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), i && i !== r) {
      e === "before" ? this.dom.insertBefore(r, i) : this.dom.insertBefore(r, i.nextElementSibling);
      const s = Array.from(this.dom.children).indexOf(r);
      T(this.dom, "ln-sortable:reordered", {
        item: r,
        oldIndex: t,
        newIndex: s
      });
    }
    this._dragging = null;
  };
  function p(_) {
    const r = _[c];
    if (!r) return;
    const n = _.getAttribute(h) !== "disabled";
    n !== r.isEnabled && (r.isEnabled = n, T(_, n ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: _ }));
  }
  B(h, c, g, "ln-sortable", {
    onAttributeChange: p
  });
})();
(function() {
  const h = "data-ln-confirm", c = "lnConfirm", b = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function p(_) {
    this.dom = _, this.confirming = !1, this.originalText = _.textContent.trim(), this.confirmText = _.getAttribute(h) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const r = this;
    return this._onClick = function(n) {
      if (!r.confirming)
        n.preventDefault(), n.stopImmediatePropagation(), r._enterConfirm();
      else {
        if (r._submitted) return;
        r._submitted = !0, r._reset();
      }
    }, _.addEventListener("click", this._onClick), this;
  }
  p.prototype._getTimeout = function() {
    const _ = parseFloat(this.dom.getAttribute(b));
    return isNaN(_) || _ <= 0 ? 3 : _;
  }, p.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var _ = this.dom.querySelector("svg.ln-icon use");
    _ && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = _.getAttribute("href"), _.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.dom.setAttribute("aria-label", this.confirmText), this.alertNode = document.createElement("span"), this.alertNode.className = "sr-only", this.alertNode.setAttribute("role", "alert"), this.alertNode.textContent = this.confirmText, this.dom.appendChild(this.alertNode)) : this.dom.textContent = this.confirmText, this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, p.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const _ = this, r = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      _._reset();
    }, r);
  }, p.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalIconHref && _.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.alertNode && this.alertNode.parentNode === this.dom && this.dom.removeChild(this.alertNode), this.alertNode = null, this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, p.prototype.destroy = function() {
    this.dom[c] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  }, B(h, c, p, "ln-confirm");
})();
(function() {
  const h = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  const b = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function g(p) {
    this.dom = p, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = p.getAttribute(h + "-default") || "", this.badgesEl = p.querySelector("[" + h + "-active]"), this.menuEl = p.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const _ = p.getAttribute(h + "-locales");
    if (this.locales = b, _)
      try {
        this.locales = JSON.parse(_);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const r = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && r.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && r.removeLanguage(n.detail.lang);
    }, p.addEventListener("ln-translations:request-add", this._onRequestAdd), p.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  g.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const p = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const _ of p) {
      const r = _.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of r)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, g.prototype._detectExisting = function() {
    const p = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const _ of p) {
      const r = _.getAttribute("data-ln-translatable-lang");
      r && r !== this.defaultLang && this.activeLanguages.add(r);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, g.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const p = this;
    let _ = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      _++;
      const t = bt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const i = t.querySelector("[data-ln-translations-lang]");
      i.setAttribute("data-ln-translations-lang", n), i.textContent = this.locales[n], i.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.menuEl.getAttribute("data-ln-toggle") === "open" && p.menuEl.setAttribute("data-ln-toggle", "close"), p.addLanguage(n));
      }), this.menuEl.appendChild(t);
    }
    const r = this.dom.querySelector("[" + h + "-add]");
    r && (r.style.display = _ === 0 ? "none" : "");
  }, g.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const p = this;
    this.activeLanguages.forEach(function(_) {
      const r = bt("ln-translations-badge", "ln-translations");
      if (!r) return;
      const n = r.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", _);
      const t = n.querySelector("span");
      t.textContent = p.locales[_] || _.toUpperCase();
      const i = n.querySelector("button");
      i.setAttribute("aria-label", "Remove " + (p.locales[_] || _.toUpperCase())), i.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), p.removeLanguage(_));
      }), p.badgesEl.appendChild(r);
    });
  }, g.prototype.addLanguage = function(p, _) {
    if (this.activeLanguages.has(p)) return;
    const r = this.locales[p] || p;
    if (z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: p,
      langName: r
    }).defaultPrevented) return;
    this.activeLanguages.add(p), _ = _ || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const i of t) {
      const e = i.getAttribute("data-ln-translatable"), o = i.getAttribute("data-ln-translations-prefix") || "", s = i.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!s) continue;
      const u = s.cloneNode(!1);
      o ? u.name = o + "[trans][" + p + "][" + e + "]" : u.name = "trans[" + p + "][" + e + "]", u.value = _[e] !== void 0 ? _[e] : "", u.removeAttribute("id"), u.placeholder = r + " translation", u.setAttribute("data-ln-translatable-lang", p);
      const a = i.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), l = a.length > 0 ? a[a.length - 1] : s;
      l.parentNode.insertBefore(u, l.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: p,
      langName: r
    });
  }, g.prototype.removeLanguage = function(p) {
    if (!this.activeLanguages.has(p) || z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: p
    }).defaultPrevented) return;
    const r = this.dom.querySelectorAll('[data-ln-translatable-lang="' + p + '"]');
    for (const n of r)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(p), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: p
    });
  }, g.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, g.prototype.hasLanguage = function(p) {
    return this.activeLanguages.has(p);
  }, g.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const p = this.defaultLang, _ = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const r of _)
      r.getAttribute("data-ln-translatable-lang") !== p && r.parentNode.removeChild(r);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, B(h, c, g, "ln-translations");
})();
(function() {
  const h = "data-ln-autosave", c = "lnAutosave", b = "data-ln-autosave-clear", g = "ln-autosave:";
  if (window[c] !== void 0) return;
  function p(n) {
    const t = _(n);
    if (!t) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = t;
    const i = this;
    return this._onFocusout = function(e) {
      const o = e.target;
      r(o) && o.name && i.save();
    }, this._onChange = function(e) {
      const o = e.target;
      r(o) && o.name && i.save();
    }, this._onSubmit = function() {
      i.clear();
    }, this._onReset = function() {
      i.clear();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + b + "]") && i.clear();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  p.prototype.save = function() {
    const n = At(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(n));
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:saved", { target: this.dom, data: n });
  }, p.prototype.restore = function() {
    let n;
    try {
      n = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!n) return;
    let t;
    try {
      t = JSON.parse(n);
    } catch {
      return;
    }
    if (z(this.dom, "ln-autosave:before-restore", { target: this.dom, data: t }).defaultPrevented) return;
    const e = wt(this.dom, t);
    for (let o = 0; o < e.length; o++)
      e[o].dispatchEvent(new Event("input", { bubbles: !0 })), e[o].dispatchEvent(new Event("change", { bubbles: !0 })), e[o].lnSelect && e[o].lnSelect.setValue && e[o].lnSelect.setValue(t[e[o].name]);
    T(this.dom, "ln-autosave:restored", { target: this.dom, data: t });
  }, p.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, p.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function _(n) {
    const i = n.getAttribute(h) || n.id;
    return i ? g + window.location.pathname + ":" + i : null;
  }
  function r(n) {
    const t = n.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }
  B(h, c, p, "ln-autosave");
})();
(function() {
  const h = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
  function b(g) {
    if (g.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", g.tagName), this;
    this.dom = g;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, g.addEventListener("input", this._onInput), this._resize(), this;
  }
  b.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, b.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, B(h, c, b, "ln-autoresize");
})();
(function() {
  const h = "data-ln-validate", c = "lnValidate", b = "data-ln-validate-errors", g = "data-ln-validate-error", p = "ln-validate-valid", _ = "ln-validate-invalid", r = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[c] !== void 0) return;
  function n(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const i = this, e = t.tagName, o = t.type, s = e === "SELECT" || o === "checkbox" || o === "radio";
    return this._onInput = function() {
      i._touched = !0, i.validate();
    }, this._onChange = function() {
      i._touched = !0, i.validate();
    }, this._onSetCustom = function(u) {
      const a = u.detail && u.detail.error;
      if (!a) return;
      i._customErrors.add(a), i._touched = !0;
      const l = t.closest(".form-element");
      if (l) {
        const m = l.querySelector("[" + g + '="' + a + '"]');
        m && m.classList.remove("hidden");
      }
      t.classList.remove(p), t.classList.add(_);
    }, this._onClearCustom = function(u) {
      const a = u.detail && u.detail.error, l = t.closest(".form-element");
      if (a) {
        if (i._customErrors.delete(a), l) {
          const m = l.querySelector("[" + g + '="' + a + '"]');
          m && m.classList.add("hidden");
        }
      } else
        i._customErrors.forEach(function(m) {
          if (l) {
            const d = l.querySelector("[" + g + '="' + m + '"]');
            d && d.classList.add("hidden");
          }
        }), i._customErrors.clear();
      i._touched && i.validate();
    }, s || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  n.prototype.validate = function() {
    const t = this.dom, i = t.validity, o = t.checkValidity() && this._customErrors.size === 0, s = t.closest(".form-element");
    if (s) {
      const a = s.querySelector("[" + b + "]");
      if (a) {
        const l = a.querySelectorAll("[" + g + "]");
        for (let m = 0; m < l.length; m++) {
          const d = l[m].getAttribute(g), y = r[d];
          y && (i[y] ? l[m].classList.remove("hidden") : l[m].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(p, o), t.classList.toggle(_, !o), T(t, o ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), o;
  }, n.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, _);
    const t = this.dom.closest(".form-element");
    if (t) {
      const i = t.querySelectorAll("[" + g + "]");
      for (let e = 0; e < i.length; e++)
        i[e].classList.add("hidden");
    }
  }, Object.defineProperty(n.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), n.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(p, _), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, n, "ln-validate");
})();
(function() {
  const h = "data-ln-form", c = "lnForm", b = "data-ln-form-auto", g = "data-ln-form-debounce", p = "data-ln-validate", _ = "lnValidate";
  if (window[c] !== void 0) return;
  function r(n) {
    this.dom = n, this._debounceTimer = null;
    const t = this;
    if (this._onValid = function() {
      t._updateSubmitButton();
    }, this._onInvalid = function() {
      t._updateSubmitButton();
    }, this._onSubmit = function(i) {
      i.preventDefault(), t.submit();
    }, this._onFill = function(i) {
      i.detail && t.fill(i.detail);
    }, this._onFormReset = function() {
      t.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        t._resetValidation();
      }, 0);
    }, n.addEventListener("ln-validate:valid", this._onValid), n.addEventListener("ln-validate:invalid", this._onInvalid), n.addEventListener("submit", this._onSubmit), n.addEventListener("ln-form:fill", this._onFill), n.addEventListener("ln-form:reset", this._onFormReset), n.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, n.hasAttribute(b)) {
      const i = parseInt(n.getAttribute(g)) || 0;
      this._onAutoInput = function() {
        i > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, i)) : t.submit();
      }, n.addEventListener("input", this._onAutoInput), n.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  r.prototype._updateSubmitButton = function() {
    const n = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!n.length) return;
    const t = this.dom.querySelectorAll("[" + p + "]");
    let i = !1;
    if (t.length > 0) {
      let e = !1, o = !1;
      for (let s = 0; s < t.length; s++) {
        const u = t[s][_];
        u && u._touched && (e = !0), t[s].checkValidity() || (o = !0);
      }
      i = o || !e;
    }
    for (let e = 0; e < n.length; e++)
      n[e].disabled = i;
  }, r.prototype.fill = function(n) {
    const t = wt(this.dom, n);
    for (let i = 0; i < t.length; i++) {
      const e = t[i], o = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(o ? "change" : "input", { bubbles: !0 }));
    }
  }, r.prototype.submit = function() {
    const n = this.dom.querySelectorAll("[" + p + "]");
    let t = !0;
    for (let e = 0; e < n.length; e++) {
      const o = n[e][_];
      o && (o.validate() || (t = !1));
    }
    if (!t) return;
    const i = At(this.dom);
    T(this.dom, "ln-form:submit", { data: i });
  }, r.prototype.reset = function() {
    this.dom.reset();
    const n = this.dom.querySelectorAll("input, textarea, select");
    for (let t = 0; t < n.length; t++) {
      const i = n[t], e = i.tagName === "SELECT" || i.type === "checkbox" || i.type === "radio";
      i.dispatchEvent(new Event(e ? "change" : "input", { bubbles: !0 }));
    }
    this._resetValidation(), T(this.dom, "ln-form:reset-complete", { target: this.dom });
  }, r.prototype._resetValidation = function() {
    const n = this.dom.querySelectorAll("[" + p + "]");
    for (let t = 0; t < n.length; t++) {
      const i = n[t][_];
      i && i.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(r.prototype, "isValid", {
    get: function() {
      const n = this.dom.querySelectorAll("[" + p + "]");
      for (let t = 0; t < n.length; t++)
        if (!n[t].checkValidity()) return !1;
      return !0;
    }
  }), r.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, B(h, c, r, "ln-form");
})();
(function() {
  const h = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
  const b = {}, g = {};
  function p(E) {
    return E.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function _(E, A) {
    const C = (E || "") + "|" + JSON.stringify(A);
    return b[C] || (b[C] = new Intl.DateTimeFormat(E, A)), b[C];
  }
  function r(E) {
    const A = E || "";
    return g[A] || (g[A] = new Intl.RelativeTimeFormat(E, { numeric: "auto", style: "narrow" })), g[A];
  }
  const n = /* @__PURE__ */ new Set();
  let t = null;
  function i() {
    t || (t = setInterval(o, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function o() {
    for (const E of n) {
      if (!document.body.contains(E.dom)) {
        n.delete(E);
        continue;
      }
      d(E);
    }
    n.size === 0 && e();
  }
  function s(E, A) {
    return _(A, { dateStyle: "long", timeStyle: "short" }).format(E);
  }
  function u(E, A) {
    const C = /* @__PURE__ */ new Date(), I = { month: "short", day: "numeric" };
    return E.getFullYear() !== C.getFullYear() && (I.year = "numeric"), _(A, I).format(E);
  }
  function a(E, A) {
    return _(A, { dateStyle: "medium" }).format(E);
  }
  function l(E, A) {
    return _(A, { timeStyle: "short" }).format(E);
  }
  function m(E, A) {
    const C = Math.floor(Date.now() / 1e3), F = Math.floor(E.getTime() / 1e3) - C, q = Math.abs(F);
    if (q < 10) return r(A).format(0, "second");
    let M, j;
    if (q < 60)
      M = "second", j = F;
    else if (q < 3600)
      M = "minute", j = Math.round(F / 60);
    else if (q < 86400)
      M = "hour", j = Math.round(F / 3600);
    else if (q < 604800)
      M = "day", j = Math.round(F / 86400);
    else if (q < 2592e3)
      M = "week", j = Math.round(F / 604800);
    else
      return u(E, A);
    return r(A).format(j, M);
  }
  function d(E) {
    const A = E.dom.getAttribute("datetime");
    if (!A) return;
    const C = Number(A);
    if (isNaN(C)) return;
    const I = new Date(C * 1e3), F = E.dom.getAttribute(h) || "short", q = p(E.dom);
    let M;
    switch (F) {
      case "relative":
        M = m(I, q);
        break;
      case "full":
        M = s(I, q);
        break;
      case "date":
        M = a(I, q);
        break;
      case "time":
        M = l(I, q);
        break;
      default:
        M = u(I, q);
        break;
    }
    E.dom.textContent = M, F !== "full" && (E.dom.title = s(I, q));
  }
  function y(E) {
    return this.dom = E, d(this), E.getAttribute(h) === "relative" && (n.add(this), i()), this;
  }
  y.prototype.render = function() {
    d(this);
  }, y.prototype.destroy = function() {
    n.delete(this), n.size === 0 && e(), delete this.dom[c];
  };
  function v(E) {
    const A = E[c];
    if (!A) return;
    E.getAttribute(h) === "relative" ? (n.add(A), i()) : (n.delete(A), n.size === 0 && e()), d(A);
  }
  function w(E) {
    E.nodeType === 1 && E.hasAttribute && E.hasAttribute(h) && E[c] && d(E[c]);
  }
  B(h, c, y, "ln-time", {
    extraAttributes: ["datetime"],
    onAttributeChange: v,
    onInit: w
  });
})();
(function() {
  const h = "data-ln-store", c = "lnStore";
  if (window[c] !== void 0) return;
  const b = "ln_app_cache", g = "_meta", p = "1.0";
  let _ = null, r = null;
  const n = {};
  function t() {
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
  function e() {
    const f = document.querySelectorAll("[" + h + "]"), L = {};
    for (let S = 0; S < f.length; S++) {
      const O = f[S].getAttribute(h);
      O && (L[O] = {
        indexes: (f[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(k) {
          return k.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function o() {
    return r || (r = new Promise(function(f, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), f(null);
        return;
      }
      const S = e(), O = Object.keys(S), k = indexedDB.open(b);
      k.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), f(null);
      }, k.onsuccess = function(x) {
        const D = x.target.result, N = Array.from(D.objectStoreNames);
        let U = !1;
        N.indexOf(g) === -1 && (U = !0);
        for (let J = 0; J < O.length; J++)
          if (N.indexOf(O[J]) === -1) {
            U = !0;
            break;
          }
        if (!U) {
          s(D), _ = D, f(D);
          return;
        }
        const ot = D.version;
        D.close();
        const dt = indexedDB.open(b, ot + 1);
        dt.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, dt.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), f(null);
        }, dt.onupgradeneeded = function(J) {
          const X = J.target.result;
          X.objectStoreNames.contains(g) || X.createObjectStore(g, { keyPath: "key" });
          for (let ht = 0; ht < O.length; ht++) {
            const pt = O[ht];
            if (!X.objectStoreNames.contains(pt)) {
              const Lt = X.createObjectStore(pt, { keyPath: "id" }), mt = S[pt].indexes;
              for (let ut = 0; ut < mt.length; ut++)
                Lt.createIndex(mt[ut], mt[ut], { unique: !1 });
            }
          }
        }, dt.onsuccess = function(J) {
          const X = J.target.result;
          s(X), _ = X, f(X);
        };
      };
    }), r);
  }
  function s(f) {
    f.onversionchange = function() {
      f.close(), _ = null, r = null;
    };
  }
  function u() {
    return _ ? Promise.resolve(_) : (r = null, o());
  }
  function a(f, L) {
    return u().then(function(S) {
      return S ? S.transaction(f, L).objectStore(f) : null;
    });
  }
  function l(f) {
    return new Promise(function(L, S) {
      f.onsuccess = function() {
        L(f.result);
      }, f.onerror = function() {
        i(f.error), S(f.error);
      };
    });
  }
  function m(f) {
    return a(f, "readonly").then(function(L) {
      return L ? l(L.getAll()) : [];
    });
  }
  function d(f, L) {
    return a(f, "readonly").then(function(S) {
      return S ? l(S.get(L)) : null;
    });
  }
  function y(f, L) {
    return a(f, "readwrite").then(function(S) {
      if (S)
        return l(S.put(L));
    });
  }
  function v(f, L) {
    return a(f, "readwrite").then(function(S) {
      if (S)
        return l(S.delete(L));
    });
  }
  function w(f) {
    return a(f, "readwrite").then(function(L) {
      if (L)
        return l(L.clear());
    });
  }
  function E(f) {
    return a(f, "readonly").then(function(L) {
      return L ? l(L.count()) : 0;
    });
  }
  function A(f) {
    return a(g, "readonly").then(function(L) {
      return L ? l(L.get(f)) : null;
    });
  }
  function C(f, L) {
    return a(g, "readwrite").then(function(S) {
      if (S)
        return L.key = f, l(S.put(L));
    });
  }
  function I(f) {
    this.dom = f, this._name = f.getAttribute(h), this._endpoint = f.getAttribute("data-ln-store-endpoint") || "";
    const L = f.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (f.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(k) {
      return k.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, n[this._name] = this;
    const O = this;
    return F(O), at(O), this;
  }
  function F(f) {
    f._handlers = {
      create: function(L) {
        q(f, L.detail);
      },
      update: function(L) {
        M(f, L.detail);
      },
      delete: function(L) {
        j(f, L.detail);
      },
      bulkDelete: function(L) {
        lt(f, L.detail);
      }
    }, f.dom.addEventListener("ln-store:request-create", f._handlers.create), f.dom.addEventListener("ln-store:request-update", f._handlers.update), f.dom.addEventListener("ln-store:request-delete", f._handlers.delete), f.dom.addEventListener("ln-store:request-bulk-delete", f._handlers.bulkDelete);
  }
  function q(f, L) {
    const S = L.data || {}, O = "_temp_" + t(), k = Object.assign({}, S, { id: O });
    y(f._name, k).then(function() {
      return f.totalCount++, T(f.dom, "ln-store:created", {
        store: f._name,
        record: k,
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
        return y(f._name, x);
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
          record: k,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function M(f, L) {
    const S = L.id, O = L.data || {}, k = L.expected_version;
    let x = null;
    d(f._name, S).then(function(D) {
      if (!D) throw new Error("Record not found: " + S);
      x = Object.assign({}, D);
      const N = Object.assign({}, D, O);
      return y(f._name, N).then(function() {
        return T(f.dom, "ln-store:updated", {
          store: f._name,
          record: N,
          previous: x
        }), N;
      });
    }).then(function(D) {
      const N = Object.assign({}, O);
      return k && (N.expected_version = k), fetch(f._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(N)
      });
    }).then(function(D) {
      if (D.status === 409)
        return D.json().then(function(N) {
          return y(f._name, x).then(function() {
            T(f.dom, "ln-store:conflict", {
              store: f._name,
              local: x,
              remote: N.current || N,
              field_diffs: N.field_diffs || null
            });
          });
        });
      if (!D.ok) throw new Error("HTTP " + D.status);
      return D.json().then(function(N) {
        return y(f._name, N).then(function() {
          T(f.dom, "ln-store:confirmed", {
            store: f._name,
            record: N,
            action: "update"
          });
        });
      });
    }).catch(function(D) {
      x && y(f._name, x).then(function() {
        T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: x,
          action: "update",
          error: D.message
        });
      });
    });
  }
  function j(f, L) {
    const S = L.id;
    let O = null;
    d(f._name, S).then(function(k) {
      if (k)
        return O = Object.assign({}, k), v(f._name, S).then(function() {
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
        record: O,
        action: "delete"
      });
    }).catch(function(k) {
      O && y(f._name, O).then(function() {
        f.totalCount++, T(f.dom, "ln-store:reverted", {
          store: f._name,
          record: O,
          action: "delete",
          error: k.message
        });
      });
    });
  }
  function lt(f, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let O = [];
    const k = S.map(function(x) {
      return d(f._name, x);
    });
    Promise.all(k).then(function(x) {
      return O = x.filter(Boolean), nt(f._name, S).then(function() {
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
      O.length > 0 && tt(f._name, O).then(function() {
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
  function at(f) {
    o().then(function() {
      return A(f._name);
    }).then(function(L) {
      L && L.schema_version === p ? (f.lastSyncedAt = L.last_synced_at || null, f.totalCount = L.record_count || 0, f.totalCount > 0 ? (f.isLoaded = !0, T(f.dom, "ln-store:ready", {
        store: f._name,
        count: f.totalCount,
        source: "cache"
      }), et(f) && Z(f)) : W(f)) : L && L.schema_version !== p ? w(f._name).then(function() {
        return C(f._name, {
          schema_version: p,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        W(f);
      }) : W(f);
    });
  }
  function et(f) {
    return f._staleThreshold === -1 ? !1 : f.lastSyncedAt ? Math.floor(Date.now() / 1e3) - f.lastSyncedAt > f._staleThreshold : !0;
  }
  function W(f) {
    return f._endpoint ? (f.isSyncing = !0, f._abortController = new AbortController(), fetch(f._endpoint, { signal: f._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const S = L.data || [], O = L.synced_at || Math.floor(Date.now() / 1e3);
      return tt(f._name, S).then(function() {
        return C(f._name, {
          schema_version: p,
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
  function Z(f) {
    if (!f._endpoint || !f.lastSyncedAt) return W(f);
    f.isSyncing = !0, f._abortController = new AbortController();
    const L = f._endpoint + (f._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + f.lastSyncedAt;
    return fetch(L, { signal: f._abortController.signal }).then(function(S) {
      if (!S.ok) throw new Error("HTTP " + S.status);
      return S.json();
    }).then(function(S) {
      const O = S.data || [], k = S.deleted || [], x = S.synced_at || Math.floor(Date.now() / 1e3), D = O.length > 0 || k.length > 0;
      let N = Promise.resolve();
      return O.length > 0 && (N = N.then(function() {
        return tt(f._name, O);
      })), k.length > 0 && (N = N.then(function() {
        return nt(f._name, k);
      })), N.then(function() {
        return E(f._name);
      }).then(function(U) {
        return f.totalCount = U, C(f._name, {
          schema_version: p,
          last_synced_at: x,
          record_count: U
        });
      }).then(function() {
        f.isSyncing = !1, f.lastSyncedAt = x, f._abortController = null, T(f.dom, "ln-store:synced", {
          store: f._name,
          added: O.length,
          deleted: k.length,
          changed: D
        });
      });
    }).catch(function(S) {
      f.isSyncing = !1, f._abortController = null, S.name !== "AbortError" && T(f.dom, "ln-store:offline", { store: f._name });
    });
  }
  function tt(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(O, k) {
          const x = S.transaction(f, "readwrite"), D = x.objectStore(f);
          for (let N = 0; N < L.length; N++)
            D.put(L[N]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            i(x.error), k(x.error);
          };
        });
    });
  }
  function nt(f, L) {
    return u().then(function(S) {
      if (S)
        return new Promise(function(O, k) {
          const x = S.transaction(f, "readwrite"), D = x.objectStore(f);
          for (let N = 0; N < L.length; N++)
            D.delete(L[N]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            k(x.error);
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
      S.isLoaded && !S.isSyncing && et(S) && Z(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const H = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function P(f, L) {
    if (!L || !L.field) return f;
    const S = L.field, O = L.direction === "desc";
    return f.slice().sort(function(k, x) {
      const D = k[S], N = x[S];
      if (D == null && N == null) return 0;
      if (D == null) return O ? 1 : -1;
      if (N == null) return O ? -1 : 1;
      let U;
      return typeof D == "string" && typeof N == "string" ? U = H.compare(D, N) : U = D < N ? -1 : D > N ? 1 : 0, O ? -U : U;
    });
  }
  function Y(f, L) {
    if (!L) return f;
    const S = Object.keys(L);
    return S.length === 0 ? f : f.filter(function(O) {
      for (let k = 0; k < S.length; k++) {
        const x = S[k], D = L[x];
        if (!Array.isArray(D) || D.length === 0) continue;
        const N = O[x];
        let U = !1;
        for (let ot = 0; ot < D.length; ot++)
          if (String(N) === String(D[ot])) {
            U = !0;
            break;
          }
        if (!U) return !1;
      }
      return !0;
    });
  }
  function ct(f, L, S) {
    if (!L || !S || S.length === 0) return f;
    const O = L.toLowerCase();
    return f.filter(function(k) {
      for (let x = 0; x < S.length; x++) {
        const D = k[S[x]];
        if (D != null && String(D).toLowerCase().indexOf(O) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function K(f, L, S) {
    if (f.length === 0) return 0;
    if (S === "count") return f.length;
    let O = 0, k = 0;
    for (let x = 0; x < f.length; x++) {
      const D = parseFloat(f[x][L]);
      isNaN(D) || (O += D, k++);
    }
    return S === "sum" ? O : S === "avg" && k > 0 ? O / k : 0;
  }
  I.prototype.getAll = function(f) {
    const L = this;
    return f = f || {}, m(L._name).then(function(S) {
      const O = S.length;
      f.filters && (S = Y(S, f.filters)), f.search && (S = ct(S, f.search, L._searchFields));
      const k = S.length;
      if (f.sort && (S = P(S, f.sort)), f.offset || f.limit) {
        const x = f.offset || 0, D = f.limit || S.length;
        S = S.slice(x, x + D);
      }
      return {
        data: S,
        total: O,
        filtered: k
      };
    });
  }, I.prototype.getById = function(f) {
    return d(this._name, f);
  }, I.prototype.count = function(f) {
    const L = this;
    return f ? m(L._name).then(function(S) {
      return Y(S, f).length;
    }) : E(L._name);
  }, I.prototype.aggregate = function(f, L) {
    return m(this._name).then(function(O) {
      return K(O, f, L);
    });
  }, I.prototype.forceSync = function() {
    return Z(this);
  }, I.prototype.fullReload = function() {
    const f = this;
    return w(f._name).then(function() {
      return f.isLoaded = !1, f.lastSyncedAt = null, f.totalCount = 0, W(f);
    });
  }, I.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete n[this._name], Object.keys(n).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[c], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function it() {
    return u().then(function(f) {
      if (!f) return;
      const L = Array.from(f.objectStoreNames);
      return new Promise(function(S, O) {
        const k = f.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          k.objectStore(L[x]).clear();
        k.oncomplete = function() {
          S();
        }, k.onerror = function() {
          O(k.error);
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
  B(h, c, I, "ln-store"), window[c].clearAll = it, window[c].init = window[c];
})();
(function() {
  const h = "data-ln-data-table", c = "lnDataTable";
  if (window[c] !== void 0) return;
  const p = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function _(n) {
    return p ? p.format(n) : String(n);
  }
  function r(n) {
    this.dom = n, this.name = n.getAttribute(h) || "", this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-data-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._filterOptions = {}, this._filterableFields = this.ths.filter(function(i) {
      return i.getAttribute("data-ln-col") && i.querySelector("[data-ln-col-filter]");
    }).map(function(i) {
      return i.getAttribute("data-ln-col");
    }), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = n.querySelector("[data-ln-data-table-total]"), this._filteredSpan = n.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = n.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(i) {
      const e = i.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._updateFilterOptions(e.filterOptions), t._vStart = -1, t._vEnd = -1, t._renderRows(), t._updateFooter(), T(n, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, n.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const e = i.detail && i.detail.loading;
      n.classList.toggle("ln-data-table--loading", !!e), e && (t.isLoaded = !1);
    }, n.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(n.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(i) {
      const e = i.target.closest("[data-ln-col-sort]");
      if (!e) return;
      const o = e.closest("th");
      if (!o) return;
      const s = o.getAttribute("data-ln-col");
      s && t._handleSort(s, o);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(i) {
      const e = i.target.closest("[data-ln-col-filter]");
      if (!e) return;
      i.stopPropagation();
      const o = e.closest("th");
      if (!o) return;
      const s = o.getAttribute("data-ln-col");
      if (s) {
        if (t._activeDropdown && t._activeDropdown.field === s) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(s, o, e);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(i) {
      i.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), T(n, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(i) {
        const e = i.target.closest("[data-ln-row-select]");
        if (!e) return;
        const o = e.closest("[data-ln-row]");
        if (!o) return;
        const s = o.getAttribute("data-ln-row-id");
        s != null && (e.checked ? (t.selectedIds.add(s), o.classList.add("ln-row-selected")) : (t.selectedIds.delete(s), o.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), T(n, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = n.querySelector('[data-ln-col-select] input[type="checkbox"]') || n.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const i = document.createElement("input");
        i.type = "checkbox", i.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(i), this._selectAllCheckbox = i;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const i = t._selectAllCheckbox.checked, e = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let o = 0; o < e.length; o++) {
          const s = e[o].getAttribute("data-ln-row-id"), u = e[o].querySelector("[data-ln-row-select]");
          s != null && (i ? (t.selectedIds.add(s), e[o].classList.add("ln-row-selected")) : (t.selectedIds.delete(s), e[o].classList.remove("ln-row-selected")), u && (u.checked = i));
        }
        t.selectedCount = t.selectedIds.size, T(n, "ln-data-table:select-all", {
          table: t.name,
          selected: i
        }), T(n, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }), t._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const i = this.tbody.querySelectorAll("[data-ln-row]");
        for (let e = 0; e < i.length; e++) {
          const o = i[e].querySelector("[data-ln-row-select]"), s = i[e].getAttribute("data-ln-row-id");
          o && o.checked && s != null && (this.selectedIds.add(s), i[e].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-row-select]") || i.target.closest("[data-ln-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const e = i.target.closest("[data-ln-row]");
      if (!e) return;
      const o = e.getAttribute("data-ln-row-id"), s = e._lnRecord || {};
      T(n, "ln-data-table:row-click", {
        table: t.name,
        id: o,
        record: s
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const e = i.target.closest("[data-ln-row-action]");
      if (!e) return;
      i.stopPropagation();
      const o = e.closest("[data-ln-row]");
      if (!o) return;
      const s = e.getAttribute("data-ln-row-action"), u = o.getAttribute("data-ln-row-id"), a = o._lnRecord || {};
      T(n, "ln-data-table:row-action", {
        table: t.name,
        id: u,
        action: s,
        record: a
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = n.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, T(n, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(i) {
      if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (i.key === "/") {
        t._searchInput && (i.preventDefault(), t._searchInput.focus());
        return;
      }
      const e = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (e.length)
        switch (i.key) {
          case "ArrowDown":
            i.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, e.length - 1), t._focusRow(e);
            break;
          case "ArrowUp":
            i.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(e);
            break;
          case "Home":
            i.preventDefault(), t._focusedRowIndex = 0, t._focusRow(e);
            break;
          case "End":
            i.preventDefault(), t._focusedRowIndex = e.length - 1, t._focusRow(e);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              i.preventDefault();
              const o = e[t._focusedRowIndex];
              T(n, "ln-data-table:row-click", {
                table: t.name,
                id: o.getAttribute("data-ln-row-id"),
                record: o._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              i.preventDefault();
              const o = e[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              o && (o.checked = !o.checked, o.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(n, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  r.prototype._handleSort = function(n, t) {
    let i;
    !this.currentSort || this.currentSort.field !== n ? i = "asc" : this.currentSort.direction === "asc" ? i = "desc" : i = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    i ? (this.currentSort = { field: n, direction: i }, t.classList.add(i === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: n,
      direction: i
    }), this._requestData();
  }, r.prototype._requestData = function() {
    T(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, r.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-row]");
    let t = n.length > 0;
    for (let i = 0; i < n.length; i++) {
      const e = n[i].getAttribute("data-ln-row-id");
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
  }), r.prototype._focusRow = function(n) {
    for (let t = 0; t < n.length; t++)
      n[t].classList.remove("ln-row-focused"), n[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const t = n[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, r.prototype._openFilterDropdown = function(n, t, i) {
    this._closeFilterDropdown();
    const e = rt(this.dom, this.name + "-column-filter", "ln-data-table") || rt(this.dom, "column-filter", "ln-data-table");
    if (!e) return;
    const o = e.firstElementChild;
    if (!o) return;
    const s = this._getUniqueValues(n), u = o.querySelector("[data-ln-filter-options]"), a = o.querySelector("[data-ln-filter-search]"), l = this.currentFilters[n] || [], m = this;
    if (a && s.length <= 8 && a.classList.add("hidden"), u) {
      for (let y = 0; y < s.length; y++) {
        const v = s[y], w = document.createElement("li"), E = document.createElement("label"), A = document.createElement("input");
        A.type = "checkbox", A.value = v, A.checked = l.length === 0 || l.indexOf(v) !== -1, E.appendChild(A), E.appendChild(document.createTextNode(" " + v)), w.appendChild(E), u.appendChild(w);
      }
      u.addEventListener("change", function(y) {
        y.target.type === "checkbox" && m._onFilterChange(n, u);
      });
    }
    a && a.addEventListener("input", function() {
      const y = a.value.toLowerCase(), v = u.querySelectorAll("li");
      for (let w = 0; w < v.length; w++) {
        const E = v[w].textContent.toLowerCase();
        v[w].classList.toggle("hidden", y && E.indexOf(y) === -1);
      }
    });
    const d = o.querySelector("[data-ln-filter-clear]");
    d && d.addEventListener("click", function() {
      delete m.currentFilters[n], m._closeFilterDropdown(), m._updateFilterIndicators(), T(m.dom, "ln-data-table:filter", {
        table: m.name,
        field: n,
        values: []
      }), m._requestData();
    }), t.appendChild(o), this._activeDropdown = { field: n, th: t, el: o }, o.addEventListener("click", function(y) {
      y.stopPropagation();
    });
  }, r.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, r.prototype._onFilterChange = function(n, t) {
    const i = t.querySelectorAll('input[type="checkbox"]'), e = [];
    let o = !0;
    for (let s = 0; s < i.length; s++)
      i[s].checked ? e.push(i[s].value) : o = !1;
    o || e.length === 0 ? delete this.currentFilters[n] : this.currentFilters[n] = e, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: n,
      values: o ? [] : e
    }), this._requestData();
  }, r.prototype._updateFilterOptions = function(n) {
    if (n !== null && typeof n == "object" && !Array.isArray(n)) {
      const t = Object.keys(n);
      for (let i = 0; i < t.length; i++) {
        const e = t[i], o = n[e];
        if (!Array.isArray(o)) continue;
        const s = {}, u = [];
        for (let a = 0; a < o.length; a++) {
          const l = String(o[a]);
          s[l] || (s[l] = !0, u.push(l));
        }
        this._filterOptions[e] = u.sort();
      }
    } else {
      const t = this._filterableFields, i = this._data;
      for (let e = 0; e < t.length; e++) {
        const o = t[e];
        this._filterOptions[o] || (this._filterOptions[o] = []);
        const s = this._filterOptions[o], u = {};
        for (let a = 0; a < s.length; a++)
          u[s[a]] = !0;
        for (let a = 0; a < i.length; a++) {
          const l = i[a][o];
          if (l != null) {
            const m = String(l);
            u[m] || (u[m] = !0, s.push(m));
          }
        }
        s.sort();
      }
    }
  }, r.prototype._getUniqueValues = function(n) {
    return (this._filterOptions[n] || []).slice().sort();
  }, r.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let t = 0; t < n.length; t++) {
      const i = n[t], e = i.getAttribute("data-ln-col");
      if (!e) continue;
      const o = i.querySelector("[data-ln-col-filter]");
      if (!o) continue;
      const s = this.currentFilters[e] && this.currentFilters[e].length > 0;
      o.classList.toggle("ln-filter-active", !!s);
    }
  }, r.prototype._renderRows = function() {
    if (!this.tbody) return;
    const n = this._data, t = this._lastTotal, i = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (n.length === 0 || i === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    n.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, r.prototype._renderAll = function() {
    const n = this._data, t = document.createDocumentFragment();
    for (let i = 0; i < n.length; i++) {
      const e = this._buildRow(n[i]);
      if (!e) break;
      t.appendChild(e);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, r.prototype._buildRow = function(n) {
    const t = rt(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const i = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!i) return null;
    if (this._fillRow(i, n), i._lnRecord = n, n.id != null && i.setAttribute("data-ln-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      i.classList.add("ln-row-selected");
      const e = i.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return i;
  }, r.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight) {
      const t = this._buildRow(this._data[0]);
      t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, r.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, r.prototype._renderVirtual = function() {
    const n = this._data, t = n.length, i = this._rowHeight;
    if (!i || !t) return;
    const o = this.table.getBoundingClientRect().top + window.scrollY, s = this.thead ? this.thead.offsetHeight : 0, u = o + s, a = window.scrollY - u, l = Math.max(0, Math.floor(a / i) - 15), m = Math.min(l + Math.ceil(window.innerHeight / i) + 30, t);
    if (l === this._vStart && m === this._vEnd) return;
    this._vStart = l, this._vEnd = m;
    const d = this.ths.length || 1, y = l * i, v = (t - m) * i, w = document.createDocumentFragment();
    if (y > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", d), A.style.height = y + "px", E.appendChild(A), w.appendChild(E);
    }
    for (let E = l; E < m; E++) {
      const A = this._buildRow(n[E]);
      A && w.appendChild(A);
    }
    if (v > 0) {
      const E = document.createElement("tr");
      E.className = "ln-data-table__spacer", E.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", d), A.style.height = v + "px", E.appendChild(A), w.appendChild(E);
    }
    this.tbody.textContent = "", this.tbody.appendChild(w), this._selectable && this._updateSelectAll();
  }, r.prototype._fillRow = function(n, t) {
    const i = n.querySelectorAll("[data-ln-cell]");
    for (let o = 0; o < i.length; o++) {
      const s = i[o], u = s.getAttribute("data-ln-cell");
      t[u] != null && (s.textContent = t[u]);
    }
    const e = n.querySelectorAll("[data-ln-cell-attr]");
    for (let o = 0; o < e.length; o++) {
      const s = e[o], u = s.getAttribute("data-ln-cell-attr").split(",");
      for (let a = 0; a < u.length; a++) {
        const l = u[a].trim().split(":");
        if (l.length !== 2) continue;
        const m = l[0].trim(), d = l[1].trim();
        t[m] != null && s.setAttribute(d, t[m]);
      }
    }
  }, r.prototype._showEmptyState = function(n) {
    const t = rt(this.dom, n, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, r.prototype._updateFooter = function() {
    const n = this._lastTotal, t = this._lastFiltered, i = t < n;
    if (this._totalSpan && (this._totalSpan.textContent = _(n)), this._filteredSpan && (this._filteredSpan.textContent = i ? _(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !i), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? _(e) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, r.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[c]);
  }, B(h, c, r, "ln-data-table");
})();
(function() {
  const h = "ln-icons-sprite", c = "#ln-", b = "#lnc-", g = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let _ = null;
  const r = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", i = "lni:v", e = "1";
  function o() {
    try {
      if (localStorage.getItem(i) !== e) {
        for (let y = localStorage.length - 1; y >= 0; y--) {
          const v = localStorage.key(y);
          v && v.indexOf(t) === 0 && localStorage.removeItem(v);
        }
        localStorage.setItem(i, e);
      }
    } catch {
    }
  }
  o();
  function s() {
    return _ || (_ = document.getElementById(h), _ || (_ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), _.id = h, _.setAttribute("hidden", ""), _.setAttribute("aria-hidden", "true"), _.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(_, document.body.firstChild))), _;
  }
  function u(y) {
    return y.indexOf(b) === 0 ? n + "/" + y.slice(b.length) + ".svg" : r + "/" + y.slice(c.length) + ".svg";
  }
  function a(y, v) {
    const w = v.match(/viewBox="([^"]+)"/), E = w ? w[1] : "0 0 24 24", A = v.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", I = v.match(/<svg([^>]*)>/i), F = I ? I[1] : "", q = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    q.id = y, q.setAttribute("viewBox", E), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const j = F.match(new RegExp(M + '="([^"]*)"'));
      j && q.setAttribute(M, j[1]);
    }), q.innerHTML = C, s().querySelector("defs").appendChild(q);
  }
  function l(y) {
    if (g.has(y) || p.has(y) || y.indexOf(b) === 0 && !n) return;
    const v = y.slice(1);
    try {
      const w = localStorage.getItem(t + v);
      if (w) {
        a(v, w), g.add(y);
        return;
      }
    } catch {
    }
    p.add(y), fetch(u(y)).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      a(v, w), g.add(y), p.delete(y);
      try {
        localStorage.setItem(t + v, w);
      } catch {
      }
    }).catch(function() {
      p.delete(y);
    });
  }
  function m(y) {
    const v = 'use[href^="' + c + '"], use[href^="' + b + '"]', w = y.querySelectorAll ? y.querySelectorAll(v) : [];
    if (y.matches && y.matches(v)) {
      const E = y.getAttribute("href");
      E && l(E);
    }
    Array.prototype.forEach.call(w, function(E) {
      const A = E.getAttribute("href");
      A && l(A);
    });
  }
  function d() {
    m(document), new MutationObserver(function(y) {
      y.forEach(function(v) {
        if (v.type === "childList")
          v.addedNodes.forEach(function(w) {
            w.nodeType === 1 && m(w);
          });
        else if (v.type === "attributes" && v.attributeName === "href") {
          const w = v.target.getAttribute("href");
          w && (w.indexOf(c) === 0 || w.indexOf(b) === 0) && l(w);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
