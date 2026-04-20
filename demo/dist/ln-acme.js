const vt = {};
function yt(u, l) {
  vt[u] || (vt[u] = document.querySelector('[data-ln-template="' + u + '"]'));
  const v = vt[u];
  return v ? v.content.cloneNode(!0) : (console.warn("[" + (l || "ln-core") + '] Template "' + u + '" not found'), null);
}
function T(u, l, v) {
  u.dispatchEvent(new CustomEvent(l, {
    bubbles: !0,
    detail: v || {}
  }));
}
function K(u, l, v) {
  const m = new CustomEvent(l, {
    bubbles: !0,
    cancelable: !0,
    detail: v || {}
  });
  return u.dispatchEvent(m), m;
}
function Z(u, l) {
  if (!u || !l) return u;
  const v = u.querySelectorAll("[data-ln-field]");
  for (let p = 0; p < v.length; p++) {
    const o = v[p], t = o.getAttribute("data-ln-field");
    l[t] != null && (o.textContent = l[t]);
  }
  const m = u.querySelectorAll("[data-ln-attr]");
  for (let p = 0; p < m.length; p++) {
    const o = m[p], t = o.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < t.length; n++) {
      const e = t[n].trim().split(":");
      if (e.length !== 2) continue;
      const r = e[0].trim(), s = e[1].trim();
      l[s] != null && o.setAttribute(r, l[s]);
    }
  }
  const f = u.querySelectorAll("[data-ln-show]");
  for (let p = 0; p < f.length; p++) {
    const o = f[p], t = o.getAttribute("data-ln-show");
    t in l && o.classList.toggle("hidden", !l[t]);
  }
  const b = u.querySelectorAll("[data-ln-class]");
  for (let p = 0; p < b.length; p++) {
    const o = b[p], t = o.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < t.length; n++) {
      const e = t[n].trim().split(":");
      if (e.length !== 2) continue;
      const r = e[0].trim(), s = e[1].trim();
      s in l && o.classList.toggle(r, !!l[s]);
    }
  }
  return u;
}
function kt(u, l) {
  if (!u || !l) return u;
  const v = document.createTreeWalker(u, NodeFilter.SHOW_TEXT);
  for (; v.nextNode(); ) {
    const m = v.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(f, b) {
        return l[b] !== void 0 ? l[b] : "";
      }
    ));
  }
  return u;
}
function H(u, l) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      H(u, l);
    }), console.warn("[" + l + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  u();
}
function at(u, l, v) {
  if (u) {
    const m = u.querySelector('[data-ln-template="' + l + '"]');
    if (m) return m.content.cloneNode(!0);
  }
  return yt(l, v);
}
function Ot(u, l) {
  const v = {}, m = u.querySelectorAll("[" + l + "]");
  for (let f = 0; f < m.length; f++)
    v[m[f].getAttribute(l)] = m[f].textContent, m[f].remove();
  return v;
}
function P(u, l, v, m) {
  if (u.nodeType !== 1) return;
  const f = Array.from(u.querySelectorAll("[" + l + "]"));
  u.hasAttribute && u.hasAttribute(l) && f.push(u);
  for (const b of f)
    b[v] || (b[v] = new m(b));
}
function ct(u) {
  return !!(u.offsetWidth || u.offsetHeight || u.getClientRects().length);
}
function St(u) {
  const l = {}, v = u.elements;
  for (let m = 0; m < v.length; m++) {
    const f = v[m];
    if (!(!f.name || f.disabled || f.type === "file" || f.type === "submit" || f.type === "button"))
      if (f.type === "checkbox")
        l[f.name] || (l[f.name] = []), f.checked && l[f.name].push(f.value);
      else if (f.type === "radio")
        f.checked && (l[f.name] = f.value);
      else if (f.type === "select-multiple") {
        l[f.name] = [];
        for (let b = 0; b < f.options.length; b++)
          f.options[b].selected && l[f.name].push(f.options[b].value);
      } else
        l[f.name] = f.value;
  }
  return l;
}
function Lt(u, l) {
  const v = u.elements, m = [];
  for (let f = 0; f < v.length; f++) {
    const b = v[f];
    if (!b.name || !(b.name in l) || b.type === "file" || b.type === "submit" || b.type === "button") continue;
    const p = l[b.name];
    if (b.type === "checkbox")
      b.checked = Array.isArray(p) ? p.indexOf(b.value) !== -1 : !!p, m.push(b);
    else if (b.type === "radio")
      b.checked = b.value === String(p), m.push(b);
    else if (b.type === "select-multiple") {
      if (Array.isArray(p))
        for (let o = 0; o < b.options.length; o++)
          b.options[o].selected = p.indexOf(b.options[o].value) !== -1;
      m.push(b);
    } else
      b.value = p, m.push(b);
  }
  return m;
}
function $(u) {
  const l = u.closest("[lang]");
  return (l ? l.lang : null) || navigator.language;
}
function V(u, l, v, m) {
  function f(b) {
    P(b, u, l, v);
  }
  return H(function() {
    new MutationObserver(function(p) {
      for (let o = 0; o < p.length; o++) {
        const t = p[o];
        if (t.type === "childList")
          for (let n = 0; n < t.addedNodes.length; n++) {
            const e = t.addedNodes[n];
            e.nodeType === 1 && P(e, u, l, v);
          }
        else t.type === "attributes" && P(t.target, u, l, v);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [u]
    });
  }, m || u.replace("data-", "")), window[l] = f, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body), f;
}
const wt = Symbol("deepReactive");
function xt(u, l) {
  function v(m) {
    if (m === null || typeof m != "object" || m[wt]) return m;
    const f = Object.keys(m);
    for (let b = 0; b < f.length; b++) {
      const p = m[f[b]];
      p !== null && typeof p == "object" && (m[f[b]] = v(p));
    }
    return new Proxy(m, {
      get(b, p) {
        return p === wt ? !0 : b[p];
      },
      set(b, p, o) {
        const t = b[p];
        return o !== null && typeof o == "object" && (o = v(o)), b[p] = o, t !== o && l(), !0;
      },
      deleteProperty(b, p) {
        return p in b && (delete b[p], l()), !0;
      }
    });
  }
  return v(u);
}
function It(u, l) {
  let v = !1;
  return function() {
    v || (v = !0, queueMicrotask(function() {
      v = !1, u(), l && l();
    }));
  };
}
const Rt = "ln:";
function Dt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Tt(u, l) {
  const v = l.getAttribute("data-ln-persist"), m = v !== null && v !== "" ? v : l.id;
  return m ? Rt + u + ":" + Dt() + ":" + m : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
}
function mt(u, l) {
  const v = Tt(u, l);
  if (!v) return null;
  try {
    const m = localStorage.getItem(v);
    return m !== null ? JSON.parse(m) : null;
  } catch {
    return null;
  }
}
function tt(u, l, v) {
  const m = Tt(u, l);
  if (m)
    try {
      localStorage.setItem(m, JSON.stringify(v));
    } catch {
    }
}
function Et(u, l, v, m) {
  const f = typeof m == "number" ? m : 4, b = window.innerWidth, p = window.innerHeight, o = l.width, t = l.height, n = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = n[v] || n.bottom;
  function r(a) {
    let g, d, _ = !0;
    return a === "top" ? (g = u.top - f - t, d = u.left + (u.width - o) / 2, g < 0 && (_ = !1)) : a === "bottom" ? (g = u.bottom + f, d = u.left + (u.width - o) / 2, g + t > p && (_ = !1)) : a === "left" ? (g = u.top + (u.height - t) / 2, d = u.left - f - o, d < 0 && (_ = !1)) : (g = u.top + (u.height - t) / 2, d = u.right + f, d + o > b && (_ = !1)), { top: g, left: d, side: a, fits: _ };
  }
  let s = null;
  for (let a = 0; a < e.length; a++) {
    const g = r(e[a]);
    if (g.fits) {
      s = g;
      break;
    }
  }
  s || (s = r(e[0]));
  let c = s.top, i = s.left;
  return o >= b ? i = 0 : (i < 0 && (i = 0), i + o > b && (i = b - o)), t >= p ? c = 0 : (c < 0 && (c = 0), c + t > p && (c = p - t)), { top: c, left: i, placement: s.side };
}
function Nt(u) {
  if (!u || u.parentNode === document.body)
    return function() {
    };
  const l = u.parentNode, v = document.createComment("ln-teleport");
  return l.insertBefore(v, u), document.body.appendChild(u), function() {
    v.parentNode && (v.parentNode.insertBefore(u, v), v.parentNode.removeChild(v));
  };
}
function At(u) {
  if (!u) return { width: 0, height: 0 };
  const l = u.style, v = l.visibility, m = l.display, f = l.position;
  l.visibility = "hidden", l.display = "block", l.position = "fixed";
  const b = u.offsetWidth, p = u.offsetHeight;
  return l.visibility = v, l.display = m, l.position = f, { width: b, height: p };
}
(function() {
  const u = "lnHttp";
  if (window[u] !== void 0) return;
  const l = {};
  document.addEventListener("ln-http:request", function(v) {
    const m = v.detail || {};
    if (!m.url) return;
    const f = v.target, b = (m.method || (m.body ? "POST" : "GET")).toUpperCase(), p = m.abort, o = m.tag;
    let t = m.url;
    p && (l[p] && l[p].abort(), l[p] = new AbortController());
    const n = { Accept: "application/json" };
    m.ajax && (n["X-Requested-With"] = "XMLHttpRequest");
    const e = {
      method: b,
      credentials: "same-origin",
      headers: n
    };
    if (p && (e.signal = l[p].signal), m.body && b === "GET") {
      const r = new URLSearchParams();
      for (const c in m.body)
        m.body[c] != null && r.set(c, m.body[c]);
      const s = r.toString();
      s && (t += (t.includes("?") ? "&" : "?") + s);
    } else m.body && (n["Content-Type"] = "application/json", e.body = JSON.stringify(m.body));
    fetch(t, e).then(function(r) {
      p && delete l[p];
      const s = r.ok, c = r.status;
      return r.json().then(function(i) {
        return { ok: s, status: c, data: i };
      }).catch(function() {
        return { ok: !1, status: c, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(r) {
      r.tag = o;
      const s = r.ok ? "ln-http:success" : "ln-http:error";
      T(f, s, r);
    }).catch(function(r) {
      p && r.name !== "AbortError" && delete l[p], r.name !== "AbortError" && T(f, "ln-http:error", { tag: o, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[u] = !0;
})();
(function() {
  const u = "data-ln-ajax", l = "lnAjax";
  if (window[l] !== void 0) return;
  function v(e) {
    if (!e.hasAttribute(u) || e[l]) return;
    e[l] = !0;
    const r = o(e);
    m(r.links), f(r.forms);
  }
  function m(e) {
    for (const r of e) {
      if (r[l + "Trigger"] || r.hostname && r.hostname !== window.location.hostname) continue;
      const s = r.getAttribute("href");
      if (s && s.includes("#")) continue;
      const c = function(i) {
        if (i.ctrlKey || i.metaKey || i.button === 1) return;
        i.preventDefault();
        const a = r.getAttribute("href");
        a && p("GET", a, null, r);
      };
      r.addEventListener("click", c), r[l + "Trigger"] = c;
    }
  }
  function f(e) {
    for (const r of e) {
      if (r[l + "Trigger"]) continue;
      const s = function(c) {
        c.preventDefault();
        const i = r.method.toUpperCase(), a = r.action, g = new FormData(r);
        for (const d of r.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        p(i, a, g, r, function() {
          for (const d of r.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      r.addEventListener("submit", s), r[l + "Trigger"] = s;
    }
  }
  function b(e) {
    if (!e[l]) return;
    const r = o(e);
    for (const s of r.links)
      s[l + "Trigger"] && (s.removeEventListener("click", s[l + "Trigger"]), delete s[l + "Trigger"]);
    for (const s of r.forms)
      s[l + "Trigger"] && (s.removeEventListener("submit", s[l + "Trigger"]), delete s[l + "Trigger"]);
    delete e[l];
  }
  function p(e, r, s, c, i) {
    if (K(c, "ln-ajax:before-start", { method: e, url: r }).defaultPrevented) return;
    T(c, "ln-ajax:start", { method: e, url: r }), c.classList.add("ln-ajax--loading");
    const g = document.createElement("span");
    g.className = "ln-ajax-spinner", c.appendChild(g);
    function d() {
      c.classList.remove("ln-ajax--loading");
      const w = c.querySelector(".ln-ajax-spinner");
      w && w.remove(), i && i();
    }
    let _ = r;
    const E = document.querySelector('meta[name="csrf-token"]'), y = E ? E.getAttribute("content") : null;
    s instanceof FormData && y && s.append("_token", y);
    const A = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (y && (A.headers["X-CSRF-TOKEN"] = y), e === "GET" && s) {
      const w = new URLSearchParams(s);
      _ = r + (r.includes("?") ? "&" : "?") + w.toString();
    } else e !== "GET" && s && (A.body = s);
    fetch(_, A).then(function(w) {
      const C = w.ok;
      return w.json().then(function(k) {
        return { ok: C, status: w.status, data: k };
      });
    }).then(function(w) {
      const C = w.data;
      if (w.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const k in C.content) {
            const M = document.getElementById(k);
            M && (M.innerHTML = C.content[k]);
          }
        if (c.tagName === "A") {
          const k = c.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else c.tagName === "FORM" && c.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", _);
        T(c, "ln-ajax:success", { method: e, url: _, data: C });
      } else
        T(c, "ln-ajax:error", { method: e, url: _, status: w.status, data: C });
      if (C.message && window.lnToast) {
        const k = C.message;
        window.lnToast.enqueue({
          type: k.type || (w.ok ? "success" : "error"),
          title: k.title || "",
          message: k.body || ""
        });
      }
      T(c, "ln-ajax:complete", { method: e, url: _ }), d();
    }).catch(function(w) {
      T(c, "ln-ajax:error", { method: e, url: _, error: w }), T(c, "ln-ajax:complete", { method: e, url: _ }), d();
    });
  }
  function o(e) {
    const r = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(u) !== "false" ? r.links.push(e) : e.tagName === "FORM" && e.getAttribute(u) !== "false" ? r.forms.push(e) : (r.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), r.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), r;
  }
  function t() {
    H(function() {
      new MutationObserver(function(r) {
        for (const s of r)
          if (s.type === "childList") {
            for (const c of s.addedNodes)
              if (c.nodeType === 1 && (v(c), !c.hasAttribute(u))) {
                for (const a of c.querySelectorAll("[" + u + "]"))
                  v(a);
                const i = c.closest && c.closest("[" + u + "]");
                if (i && i.getAttribute(u) !== "false") {
                  const a = o(c);
                  m(a.links), f(a.forms);
                }
              }
          } else s.type === "attributes" && v(s.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-ajax");
  }
  function n() {
    for (const e of document.querySelectorAll("[" + u + "]"))
      v(e);
  }
  window[l] = v, window[l].destroy = b, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = "data-ln-modal", l = "lnModal";
  if (window[l] !== void 0) return;
  function v(n) {
    m(n), f(n);
  }
  function m(n) {
    const e = Array.from(n.querySelectorAll("[" + u + "]"));
    n.hasAttribute && n.hasAttribute(u) && e.push(n);
    for (const r of e)
      r[l] || (r[l] = new b(r));
  }
  function f(n) {
    const e = Array.from(n.querySelectorAll("[data-ln-modal-for]"));
    n.hasAttribute && n.hasAttribute("data-ln-modal-for") && e.push(n);
    for (const r of e) {
      if (r[l + "Trigger"]) continue;
      const s = function(c) {
        if (c.ctrlKey || c.metaKey || c.button === 1) return;
        c.preventDefault();
        const i = r.getAttribute("data-ln-modal-for"), a = document.getElementById(i);
        !a || !a[l] || a[l].toggle();
      };
      r.addEventListener("click", s), r[l + "Trigger"] = s;
    }
  }
  function b(n) {
    this.dom = n, this.isOpen = n.getAttribute(u) === "open";
    const e = this;
    return this._onEscape = function(r) {
      r.key === "Escape" && e.close();
    }, this._onFocusTrap = function(r) {
      if (r.key !== "Tab") return;
      const s = Array.prototype.filter.call(
        e.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ct
      );
      if (s.length === 0) return;
      const c = s[0], i = s[s.length - 1];
      r.shiftKey ? document.activeElement === c && (r.preventDefault(), i.focus()) : document.activeElement === i && (r.preventDefault(), c.focus());
    }, this._onClose = function(r) {
      r.preventDefault(), e.close();
    }, o(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  b.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, b.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, b.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, b.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const n = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const r of n)
      r[l + "Close"] && (r.removeEventListener("click", r[l + "Close"]), delete r[l + "Close"]);
    const e = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const r of e)
      r[l + "Trigger"] && (r.removeEventListener("click", r[l + "Trigger"]), delete r[l + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[l];
  };
  function p(n) {
    const e = n[l];
    if (!e) return;
    const s = n.getAttribute(u) === "open";
    if (s !== e.isOpen)
      if (s) {
        if (K(n, "ln-modal:before-open", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(u, "close");
          return;
        }
        e.isOpen = !0, n.setAttribute("aria-modal", "true"), n.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", e._onEscape), document.addEventListener("keydown", e._onFocusTrap);
        const i = n.querySelector("[autofocus]");
        if (i && ct(i))
          i.focus();
        else {
          const a = n.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), g = Array.prototype.find.call(a, ct);
          if (g) g.focus();
          else {
            const d = n.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(d, ct);
            _ && _.focus();
          }
        }
        T(n, "ln-modal:open", { modalId: n.id, target: n });
      } else {
        if (K(n, "ln-modal:before-close", { modalId: n.id, target: n }).defaultPrevented) {
          n.setAttribute(u, "open");
          return;
        }
        e.isOpen = !1, n.removeAttribute("aria-modal"), document.removeEventListener("keydown", e._onEscape), document.removeEventListener("keydown", e._onFocusTrap), T(n, "ln-modal:close", { modalId: n.id, target: n }), document.querySelector("[" + u + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function o(n) {
    const e = n.dom.querySelectorAll("[data-ln-modal-close]");
    for (const r of e)
      r[l + "Close"] || (r.addEventListener("click", n._onClose), r[l + "Close"] = n._onClose);
  }
  function t() {
    H(function() {
      new MutationObserver(function(e) {
        for (let r = 0; r < e.length; r++) {
          const s = e[r];
          if (s.type === "childList")
            for (let c = 0; c < s.addedNodes.length; c++) {
              const i = s.addedNodes[c];
              i.nodeType === 1 && (m(i), f(i));
            }
          else s.type === "attributes" && (s.attributeName === u && s.target[l] ? p(s.target) : (m(s.target), f(s.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-modal-for"]
      });
    }, "ln-modal");
  }
  window[l] = v, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-number", l = "lnNumber";
  if (window[l] !== void 0) return;
  const v = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function f(t) {
    if (!v[t]) {
      const n = new Intl.NumberFormat(t, { useGrouping: !0 }), e = n.formatToParts(1234.5);
      let r = "", s = ".";
      for (let c = 0; c < e.length; c++)
        e[c].type === "group" && (r = e[c].value), e[c].type === "decimal" && (s = e[c].value);
      v[t] = { fmt: n, groupSep: r, decimalSep: s };
    }
    return v[t];
  }
  function b(t, n, e) {
    if (e !== null) {
      const r = parseInt(e, 10), s = t + "|d" + r;
      return v[s] || (v[s] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: r })), v[s].format(n);
    }
    return f(t).fmt.format(n);
  }
  function p(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    this.dom = t;
    const n = document.createElement("input");
    n.type = "hidden", n.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", n), this._hidden = n;
    const e = this;
    Object.defineProperty(n, "value", {
      get: function() {
        return m.get.call(n);
      },
      set: function(s) {
        m.set.call(n, s), s !== "" && !isNaN(parseFloat(s)) ? e._displayFormatted(parseFloat(s)) : s === "" && (e.dom.value = "");
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(s) {
      s.preventDefault();
      const c = (s.clipboardData || window.clipboardData).getData("text"), i = f($(t)), a = i.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let g = c.replace(new RegExp("[^0-9\\-" + a + ".]", "g"), "");
      i.groupSep && (g = g.split(i.groupSep).join("")), i.decimalSep !== "." && (g = g.replace(i.decimalSep, "."));
      const d = parseFloat(g);
      isNaN(d) ? (t.value = "", e._hidden.value = "") : e.value = d;
    }, t.addEventListener("paste", this._onPaste);
    const r = t.value;
    if (r !== "") {
      const s = parseFloat(r);
      isNaN(s) || (this._displayFormatted(s), m.set.call(n, String(s)));
    }
    return this;
  }
  p.prototype._handleInput = function() {
    const t = this.dom, n = f($(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", T(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const r = t.selectionStart;
    let s = 0;
    for (let w = 0; w < r; w++)
      /[0-9]/.test(e[w]) && s++;
    let c = e;
    if (n.groupSep && (c = c.split(n.groupSep).join("")), c = c.replace(n.decimalSep, "."), e.endsWith(n.decimalSep) || e.endsWith(".")) {
      const w = c.replace(/\.$/, ""), C = parseFloat(w);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const i = c.indexOf(".");
    if (i !== -1 && c.slice(i + 1).endsWith("0")) {
      const C = parseFloat(c);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const a = t.getAttribute("data-ln-number-decimals");
    if (a !== null && i !== -1) {
      const w = parseInt(a, 10);
      c.slice(i + 1).length > w && (c = c.slice(0, i + 1 + w));
    }
    const g = parseFloat(c);
    if (isNaN(g)) return;
    const d = t.getAttribute("data-ln-number-min"), _ = t.getAttribute("data-ln-number-max");
    if (d !== null && g < parseFloat(d) || _ !== null && g > parseFloat(_)) return;
    let E;
    if (a !== null)
      E = b($(t), g, a);
    else {
      const w = i !== -1 ? c.slice(i + 1).length : 0;
      if (w > 0) {
        const C = $(t) + "|u" + w;
        v[C] || (v[C] = new Intl.NumberFormat($(t), { useGrouping: !0, minimumFractionDigits: w, maximumFractionDigits: w })), E = v[C].format(g);
      } else
        E = n.fmt.format(g);
    }
    t.value = E;
    let y = s, A = 0;
    for (let w = 0; w < E.length && y > 0; w++)
      A = w + 1, /[0-9]/.test(E[w]) && y--;
    y > 0 && (A = E.length), t.setSelectionRange(A, A), this._setHiddenRaw(g), T(t, "ln-number:input", { value: g, formatted: E });
  }, p.prototype._setHiddenRaw = function(t) {
    m.set.call(this._hidden, String(t));
  }, p.prototype._displayFormatted = function(t) {
    this.dom.value = b($(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(p.prototype, "value", {
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
  }), Object.defineProperty(p.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function o() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + u + "]");
      for (let n = 0; n < t.length; n++) {
        const e = t[n][l];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  V(u, l, p, "ln-number"), o();
})();
(function() {
  const u = "data-ln-date", l = "lnDate";
  if (window[l] !== void 0) return;
  const v = {}, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function f(i, a) {
    const g = i + "|" + JSON.stringify(a);
    return v[g] || (v[g] = new Intl.DateTimeFormat(i, a)), v[g];
  }
  const b = /^(short|medium|long)(\s+datetime)?$/, p = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function o(i) {
    return !i || i === "" ? { dateStyle: "medium" } : i.match(b) ? p[i] : null;
  }
  function t(i, a, g) {
    const d = i.getDate(), _ = i.getMonth(), E = i.getFullYear(), y = i.getHours(), A = i.getMinutes(), w = {
      yyyy: String(E),
      yy: String(E).slice(-2),
      MMMM: f(g, { month: "long" }).format(i),
      MMM: f(g, { month: "short" }).format(i),
      MM: String(_ + 1).padStart(2, "0"),
      M: String(_ + 1),
      dd: String(d).padStart(2, "0"),
      d: String(d),
      HH: String(y).padStart(2, "0"),
      mm: String(A).padStart(2, "0")
    };
    return a.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return w[C];
    });
  }
  function n(i, a, g) {
    const d = o(a);
    return d ? f(g, d).format(i) : t(i, a, g);
  }
  function e(i) {
    if (i.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", i.tagName), this;
    this.dom = i;
    const a = this, g = i.value, d = i.name, _ = document.createElement("input");
    _.type = "hidden", _.name = d, i.removeAttribute("name"), i.insertAdjacentElement("afterend", _), this._hidden = _;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", _.insertAdjacentElement("afterend", E), this._picker = E, i.type = "text";
    const y = document.createElement("button");
    if (y.type = "button", y.setAttribute("aria-label", "Open date picker"), y.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", y), this._btn = y, this._lastISO = "", Object.defineProperty(_, "value", {
      get: function() {
        return m.get.call(_);
      },
      set: function(A) {
        if (m.set.call(_, A), A && A !== "") {
          const w = r(A);
          w && (a._displayFormatted(w), m.set.call(E, A));
        } else A === "" && (a.dom.value = "", m.set.call(E, ""));
      }
    }), this._onPickerChange = function() {
      const A = E.value;
      if (A) {
        const w = r(A);
        w && (a._setHiddenRaw(A), a._displayFormatted(w), a._lastISO = A, T(a.dom, "ln-date:change", {
          value: A,
          formatted: a.dom.value,
          date: w
        }));
      } else
        a._setHiddenRaw(""), a.dom.value = "", a._lastISO = "", T(a.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const A = a.dom.value.trim();
      if (A === "") {
        a._lastISO !== "" && (a._setHiddenRaw(""), m.set.call(a._picker, ""), a.dom.value = "", a._lastISO = "", T(a.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (a._lastISO) {
        const C = r(a._lastISO);
        if (C) {
          const k = a.dom.getAttribute(u) || "", M = $(a.dom), N = n(C, k, M);
          if (A === N) return;
        }
      }
      const w = s(A);
      if (w) {
        const C = w.getFullYear(), k = String(w.getMonth() + 1).padStart(2, "0"), M = String(w.getDate()).padStart(2, "0"), N = C + "-" + k + "-" + M;
        a._setHiddenRaw(N), m.set.call(a._picker, N), a._displayFormatted(w), a._lastISO = N, T(a.dom, "ln-date:change", {
          value: N,
          formatted: a.dom.value,
          date: w
        });
      } else if (a._lastISO) {
        const C = r(a._lastISO);
        C && a._displayFormatted(C);
      } else
        a.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      a._openPicker();
    }, y.addEventListener("click", this._onBtnClick), g && g !== "") {
      const A = r(g);
      A && (this._setHiddenRaw(g), m.set.call(E, g), this._displayFormatted(A), this._lastISO = g);
    }
    return this;
  }
  function r(i) {
    if (!i || typeof i != "string") return null;
    const a = i.split("T"), g = a[0].split("-");
    if (g.length < 3) return null;
    const d = parseInt(g[0], 10), _ = parseInt(g[1], 10) - 1, E = parseInt(g[2], 10);
    if (isNaN(d) || isNaN(_) || isNaN(E)) return null;
    let y = 0, A = 0;
    if (a[1]) {
      const C = a[1].split(":");
      y = parseInt(C[0], 10) || 0, A = parseInt(C[1], 10) || 0;
    }
    const w = new Date(d, _, E, y, A);
    return w.getFullYear() !== d || w.getMonth() !== _ || w.getDate() !== E ? null : w;
  }
  function s(i) {
    if (!i || typeof i != "string" || (i = i.trim(), i.length < 6)) return null;
    let a, g;
    if (i.indexOf(".") !== -1)
      a = ".", g = i.split(".");
    else if (i.indexOf("/") !== -1)
      a = "/", g = i.split("/");
    else if (i.indexOf("-") !== -1)
      a = "-", g = i.split("-");
    else
      return null;
    if (g.length !== 3) return null;
    const d = [];
    for (let w = 0; w < 3; w++) {
      const C = parseInt(g[w], 10);
      if (isNaN(C)) return null;
      d.push(C);
    }
    let _, E, y;
    a === "." ? (_ = d[0], E = d[1], y = d[2]) : a === "/" ? (E = d[0], _ = d[1], y = d[2]) : g[0].length === 4 ? (y = d[0], E = d[1], _ = d[2]) : (_ = d[0], E = d[1], y = d[2]), y < 100 && (y += y < 50 ? 2e3 : 1900);
    const A = new Date(y, E - 1, _);
    return A.getFullYear() !== y || A.getMonth() !== E - 1 || A.getDate() !== _ ? null : A;
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
  }, e.prototype._setHiddenRaw = function(i) {
    m.set.call(this._hidden, i);
  }, e.prototype._displayFormatted = function(i) {
    const a = this.dom.getAttribute(u) || "", g = $(this.dom);
    this.dom.value = n(i, a, g);
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return m.get.call(this._hidden);
    },
    set: function(i) {
      if (!i || i === "") {
        this._setHiddenRaw(""), m.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const a = r(i);
      a && (this._setHiddenRaw(i), m.set.call(this._picker, i), this._displayFormatted(a), this._lastISO = i, T(this.dom, "ln-date:change", {
        value: i,
        formatted: this.dom.value,
        date: a
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? r(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      const a = i.getFullYear(), g = String(i.getMonth() + 1).padStart(2, "0"), d = String(i.getDate()).padStart(2, "0");
      this.value = a + "-" + g + "-" + d;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), i && (this.dom.value = i), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[l];
  };
  function c() {
    new MutationObserver(function() {
      const i = document.querySelectorAll("[" + u + "]");
      for (let a = 0; a < i.length; a++) {
        const g = i[a][l];
        if (g && g.value) {
          const d = r(g.value);
          d && g._displayFormatted(d);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  V(u, l, e, "ln-date"), c();
})();
(function() {
  const u = "data-ln-nav", l = "lnNav";
  if (window[l] !== void 0) return;
  const v = /* @__PURE__ */ new WeakMap(), m = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const r of m)
        r();
    }, history._lnNavPatched = !0;
  }
  function f(e) {
    if (!e.hasAttribute(u) || v.has(e)) return;
    const r = e.getAttribute(u);
    if (!r) return;
    const s = b(e, r);
    v.set(e, s), e[l] = s;
  }
  function b(e, r) {
    let s = Array.from(e.querySelectorAll("a"));
    o(s, r, window.location.pathname);
    const c = function() {
      s = Array.from(e.querySelectorAll("a")), o(s, r, window.location.pathname);
    };
    window.addEventListener("popstate", c), m.push(c);
    const i = new MutationObserver(function(a) {
      for (const g of a)
        if (g.type === "childList") {
          for (const d of g.addedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                s.push(d), o([d], r, window.location.pathname);
              else if (d.querySelectorAll) {
                const _ = Array.from(d.querySelectorAll("a"));
                s = s.concat(_), o(_, r, window.location.pathname);
              }
            }
          for (const d of g.removedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                s = s.filter(function(_) {
                  return _ !== d;
                });
              else if (d.querySelectorAll) {
                const _ = Array.from(d.querySelectorAll("a"));
                s = s.filter(function(E) {
                  return !_.includes(E);
                });
              }
            }
        }
    });
    return i.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: r,
      observer: i,
      updateHandler: c,
      destroy: function() {
        i.disconnect(), window.removeEventListener("popstate", c);
        const a = m.indexOf(c);
        a !== -1 && m.splice(a, 1), v.delete(e), delete e[l];
      }
    };
  }
  function p(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function o(e, r, s) {
    const c = p(s);
    for (const i of e) {
      const a = i.getAttribute("href");
      if (!a) continue;
      const g = p(a);
      i.classList.remove(r);
      const d = g === c, _ = g !== "/" && c.startsWith(g + "/");
      (d || _) && i.classList.add(r);
    }
  }
  function t() {
    H(function() {
      new MutationObserver(function(r) {
        for (const s of r)
          if (s.type === "childList") {
            for (const c of s.addedNodes)
              if (c.nodeType === 1 && (c.hasAttribute && c.hasAttribute(u) && f(c), c.querySelectorAll))
                for (const i of c.querySelectorAll("[" + u + "]"))
                  f(i);
          } else s.type === "attributes" && s.target.hasAttribute && s.target.hasAttribute(u) && f(s.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
    }, "ln-nav");
  }
  window[l] = f;
  function n() {
    for (const e of document.querySelectorAll("[" + u + "]"))
      f(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", n) : n();
})();
(function() {
  const u = window.TomSelect;
  if (!u) {
    console.warn("[ln-select] TomSelect not found. Load TomSelect before ln-acme."), window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const l = /* @__PURE__ */ new WeakMap();
  function v(p) {
    if (l.has(p)) return;
    const o = p.getAttribute("data-ln-select");
    let t = {};
    if (o && o.trim() !== "")
      try {
        t = JSON.parse(o);
      } catch (r) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", r);
      }
    const e = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: p.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...t };
    try {
      const r = new u(p, e);
      l.set(p, r);
      const s = p.closest("form");
      if (s) {
        const c = () => {
          setTimeout(() => {
            r.clear(), r.clearOptions(), r.sync();
          }, 0);
        };
        s.addEventListener("reset", c), r._lnResetHandler = c, r._lnResetForm = s;
      }
    } catch (r) {
      console.warn("[ln-select] Failed to initialize Tom Select:", r);
    }
  }
  function m(p) {
    const o = l.get(p);
    o && (o._lnResetForm && o._lnResetHandler && o._lnResetForm.removeEventListener("reset", o._lnResetHandler), o.destroy(), l.delete(p));
  }
  function f() {
    for (const p of document.querySelectorAll("select[data-ln-select]"))
      v(p);
  }
  function b() {
    H(function() {
      new MutationObserver(function(o) {
        for (const t of o) {
          if (t.type === "attributes") {
            t.target.matches && t.target.matches("select[data-ln-select]") && v(t.target);
            continue;
          }
          for (const n of t.addedNodes)
            if (n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && v(n), n.querySelectorAll))
              for (const e of n.querySelectorAll("select[data-ln-select]"))
                v(e);
          for (const n of t.removedNodes)
            if (n.nodeType === 1 && (n.matches && n.matches("select[data-ln-select]") && m(n), n.querySelectorAll))
              for (const e of n.querySelectorAll("select[data-ln-select]"))
                m(e);
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
    f(), b();
  }) : (f(), b()), window.lnSelect = {
    initialize: v,
    destroy: m,
    getInstance: function(p) {
      return l.get(p);
    }
  };
})();
(function() {
  const u = "data-ln-tabs", l = "lnTabs";
  if (window[l] !== void 0 && window[l] !== null) return;
  function v(o = document.body) {
    P(o, u, l, f);
  }
  function m() {
    const o = (location.hash || "").replace("#", ""), t = {};
    if (!o) return t;
    for (const n of o.split("&")) {
      const e = n.indexOf(":");
      e > 0 && (t[n.slice(0, e)] = n.slice(e + 1));
    }
    return t;
  }
  function f(o) {
    return this.dom = o, b.call(this), this;
  }
  function b() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const t of this.tabs) {
      const n = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      n && (this.mapTabs[n] = t);
    }
    for (const t of this.panels) {
      const n = (t.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = t);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const o = this;
    this._clickHandlers = [];
    for (const t of this.tabs) {
      if (t[l + "Trigger"]) continue;
      const n = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        const r = (t.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (r)
          if (o.hashEnabled) {
            const s = m();
            s[o.nsKey] = r;
            const c = Object.keys(s).map(function(i) {
              return i + ":" + s[i];
            }).join("&");
            location.hash === "#" + c ? o.dom.setAttribute("data-ln-tabs-active", r) : location.hash = c;
          } else
            o.dom.setAttribute("data-ln-tabs-active", r);
      };
      t.addEventListener("click", n), t[l + "Trigger"] = n, o._clickHandlers.push({ el: t, handler: n });
    }
    if (this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const t = m();
      o.activate(o.nsKey in t ? t[o.nsKey] : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let t = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const n = mt("tabs", this.dom);
        n !== null && n in this.mapPanels && (t = n);
      }
      this.activate(t);
    }
  }
  f.prototype.activate = function(o) {
    (!o || !(o in this.mapPanels)) && (o = this.defaultKey), this.dom.setAttribute("data-ln-tabs-active", o);
  }, f.prototype._applyActive = function(o) {
    var t;
    (!o || !(o in this.mapPanels)) && (o = this.defaultKey);
    for (const n in this.mapTabs) {
      const e = this.mapTabs[n];
      n === o ? (e.setAttribute("data-active", ""), e.setAttribute("aria-selected", "true")) : (e.removeAttribute("data-active"), e.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const e = this.mapPanels[n], r = n === o;
      e.classList.toggle("hidden", !r), e.setAttribute("aria-hidden", r ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (t = this.mapPanels[o]) == null ? void 0 : t.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: o, tab: this.mapTabs[o], panel: this.mapPanels[o] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && tt("tabs", this.dom, o);
  }, f.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const { el: o, handler: t } of this._clickHandlers)
        o.removeEventListener("click", t), delete o[l + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[l];
    }
  };
  function p() {
    H(function() {
      new MutationObserver(function(t) {
        for (const n of t) {
          if (n.type === "attributes") {
            if (n.attributeName === "data-ln-tabs-active" && n.target[l]) {
              const e = n.target.getAttribute("data-ln-tabs-active");
              n.target[l]._applyActive(e);
              continue;
            }
            P(n.target, u, l, f);
            continue;
          }
          for (const e of n.addedNodes)
            P(e, u, l, f);
        }
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u, "data-ln-tabs-active"] });
    }, "ln-tabs");
  }
  p(), window[l] = v, v(document.body);
})();
(function() {
  const u = "data-ln-toggle", l = "lnToggle";
  if (window[l] !== void 0) return;
  function v(o) {
    P(o, u, l, f), m(o);
  }
  function m(o) {
    const t = Array.from(o.querySelectorAll("[data-ln-toggle-for]"));
    o.hasAttribute && o.hasAttribute("data-ln-toggle-for") && t.push(o);
    for (const n of t) {
      if (n[l + "Trigger"]) continue;
      const e = function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1) return;
        r.preventDefault();
        const s = n.getAttribute("data-ln-toggle-for"), c = document.getElementById(s);
        if (!c || !c[l]) return;
        const i = n.getAttribute("data-ln-toggle-action") || "toggle";
        c[l][i]();
      };
      n.addEventListener("click", e), n[l + "Trigger"] = e;
    }
  }
  function f(o) {
    if (this.dom = o, o.hasAttribute("data-ln-persist")) {
      const t = mt("toggle", o);
      t !== null && o.setAttribute(u, t);
    }
    return this.isOpen = o.getAttribute(u) === "open", this.isOpen && o.classList.add("open"), this;
  }
  f.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(u, "open");
  }, f.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "close");
  }, f.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, f.prototype.destroy = function() {
    if (!this.dom[l]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const o = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const t of o)
      t[l + "Trigger"] && (t.removeEventListener("click", t[l + "Trigger"]), delete t[l + "Trigger"]);
    delete this.dom[l];
  };
  function b(o) {
    const t = o[l];
    if (!t) return;
    const e = o.getAttribute(u) === "open";
    if (e !== t.isOpen)
      if (e) {
        if (K(o, "ln-toggle:before-open", { target: o }).defaultPrevented) {
          o.setAttribute(u, "close");
          return;
        }
        t.isOpen = !0, o.classList.add("open"), T(o, "ln-toggle:open", { target: o }), o.hasAttribute("data-ln-persist") && tt("toggle", o, "open");
      } else {
        if (K(o, "ln-toggle:before-close", { target: o }).defaultPrevented) {
          o.setAttribute(u, "open");
          return;
        }
        t.isOpen = !1, o.classList.remove("open"), T(o, "ln-toggle:close", { target: o }), o.hasAttribute("data-ln-persist") && tt("toggle", o, "close");
      }
  }
  function p() {
    H(function() {
      new MutationObserver(function(t) {
        for (let n = 0; n < t.length; n++) {
          const e = t[n];
          if (e.type === "childList")
            for (let r = 0; r < e.addedNodes.length; r++) {
              const s = e.addedNodes[r];
              s.nodeType === 1 && (P(s, u, l, f), m(s));
            }
          else e.type === "attributes" && (e.attributeName === u && e.target[l] ? b(e.target) : (P(e.target, u, l, f), m(e.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "data-ln-toggle-for"]
      });
    }, "ln-toggle");
  }
  window[l] = v, p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    v(document.body);
  }) : v(document.body);
})();
(function() {
  const u = "data-ln-accordion", l = "lnAccordion";
  if (window[l] !== void 0) return;
  function v(m) {
    return this.dom = m, this._onToggleOpen = function(f) {
      const b = m.querySelectorAll("[data-ln-toggle]");
      for (const p of b)
        p !== f.detail.target && p.getAttribute("data-ln-toggle") === "open" && p.setAttribute("data-ln-toggle", "close");
      T(m, "ln-accordion:change", { target: f.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, v, "ln-accordion");
})();
(function() {
  const u = "data-ln-dropdown", l = "lnDropdown";
  if (window[l] !== void 0) return;
  function v(m) {
    if (this.dom = m, this.toggleEl = m.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = m.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const b of this.toggleEl.children)
        b.setAttribute("role", "menuitem");
    const f = this;
    return this._onToggleOpen = function(b) {
      b.detail.target === f.toggleEl && (f.triggerBtn && f.triggerBtn.setAttribute("aria-expanded", "true"), f._teleportToBody(), f._addOutsideClickListener(), f._addScrollRepositionListener(), f._addResizeCloseListener(), T(m, "ln-dropdown:open", { target: b.detail.target }));
    }, this._onToggleClose = function(b) {
      b.detail.target === f.toggleEl && (f.triggerBtn && f.triggerBtn.setAttribute("aria-expanded", "false"), f._removeOutsideClickListener(), f._removeScrollRepositionListener(), f._removeResizeCloseListener(), f._teleportBack(), T(m, "ln-dropdown:close", { target: b.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  v.prototype._positionMenu = function() {
    const m = this.dom.querySelector("[data-ln-toggle-for]");
    if (!m || !this.toggleEl) return;
    const f = m.getBoundingClientRect(), b = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    b && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const p = this.toggleEl.offsetWidth, o = this.toggleEl.offsetHeight;
    b && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, n = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-xs")) * 16 || 4;
    let r;
    f.bottom + e + o <= n ? r = f.bottom + e : f.top - e - o >= 0 ? r = f.top - e - o : r = Math.max(0, n - o);
    let s;
    f.right - p >= 0 ? s = f.right - p : f.left + p <= t ? s = f.left : s = Math.max(0, t - p), this.toggleEl.style.top = r + "px", this.toggleEl.style.left = s + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, v.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, v.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, v.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const m = this;
    this._boundDocClick = function(f) {
      m.dom.contains(f.target) || m.toggleEl && m.toggleEl.contains(f.target) || m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, m._docClickTimeout = setTimeout(function() {
      m._docClickTimeout = null, document.addEventListener("click", m._boundDocClick);
    }, 0);
  }, v.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, v.prototype._addScrollRepositionListener = function() {
    const m = this;
    this._boundScrollReposition = function() {
      m._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, v.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, v.prototype._addResizeCloseListener = function() {
    const m = this;
    this._boundResizeClose = function() {
      m.toggleEl && m.toggleEl.getAttribute("data-ln-toggle") === "open" && m.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, v.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, v.prototype.destroy = function() {
    this.dom[l] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, v, "ln-dropdown");
})();
(function() {
  const u = "data-ln-popover", l = "lnPopover", v = "data-ln-popover-for", m = "data-ln-popover-position";
  if (window[l] !== void 0) return;
  const f = [];
  let b = null;
  function p() {
    b || (b = function(i) {
      if (i.key !== "Escape" || f.length === 0) return;
      f[f.length - 1].close();
    }, document.addEventListener("keydown", b));
  }
  function o() {
    f.length > 0 || b && (document.removeEventListener("keydown", b), b = null);
  }
  function t(i) {
    n(i), e(i);
  }
  function n(i) {
    if (!i || i.nodeType !== 1) return;
    const a = Array.from(i.querySelectorAll("[" + u + "]"));
    i.hasAttribute && i.hasAttribute(u) && a.push(i);
    for (const g of a)
      g[l] || (g[l] = new r(g));
  }
  function e(i) {
    if (!i || i.nodeType !== 1) return;
    const a = Array.from(i.querySelectorAll("[" + v + "]"));
    i.hasAttribute && i.hasAttribute(v) && a.push(i);
    for (const g of a) {
      if (g[l + "Trigger"]) continue;
      const d = g.getAttribute(v);
      g.setAttribute("aria-haspopup", "dialog"), g.setAttribute("aria-expanded", "false"), g.setAttribute("aria-controls", d);
      const _ = function(E) {
        if (E.ctrlKey || E.metaKey || E.button === 1) return;
        E.preventDefault();
        const y = document.getElementById(d);
        !y || !y[l] || y[l].toggle(g);
      };
      g.addEventListener("click", _), g[l + "Trigger"] = _;
    }
  }
  function r(i) {
    return this.dom = i, this.isOpen = i.getAttribute(u) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, i.hasAttribute("tabindex") || i.setAttribute("tabindex", "-1"), i.hasAttribute("role") || i.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  r.prototype.open = function(i) {
    this.isOpen || (this.trigger = i || null, this.dom.setAttribute(u, "open"));
  }, r.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(u, "closed");
  }, r.prototype.toggle = function(i) {
    this.isOpen ? this.close() : this.open(i);
  }, r.prototype._applyOpen = function(i) {
    this.isOpen = !0, i && (this.trigger = i), this._previousFocus = document.activeElement, this._teleportRestore = Nt(this.dom);
    const a = At(this.dom);
    if (this.trigger) {
      const E = this.trigger.getBoundingClientRect(), y = this.dom.getAttribute(m) || "bottom", A = Et(E, a, y, 8);
      this.dom.style.top = A.top + "px", this.dom.style.left = A.left + "px", this.dom.setAttribute("data-ln-popover-placement", A.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const g = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), d = Array.prototype.find.call(g, ct);
    d ? d.focus() : this.dom.focus();
    const _ = this;
    this._boundDocClick = function(E) {
      _.dom.contains(E.target) || _.trigger && _.trigger.contains(E.target) || _.close();
    }, _._docClickTimeout = setTimeout(function() {
      _._docClickTimeout = null, document.addEventListener("click", _._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!_.trigger) return;
      const E = _.trigger.getBoundingClientRect(), y = At(_.dom), A = _.dom.getAttribute(m) || "bottom", w = Et(E, y, A, 8);
      _.dom.style.top = w.top + "px", _.dom.style.left = w.left + "px", _.dom.setAttribute("data-ln-popover-placement", w.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), f.push(this), p(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, r.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const i = f.indexOf(this);
    i !== -1 && f.splice(i, 1), o(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, r.prototype.destroy = function() {
    if (!this.dom[l]) return;
    this.isOpen && this._applyClose();
    const i = document.querySelectorAll("[" + v + '="' + this.dom.id + '"]');
    for (const a of i)
      a[l + "Trigger"] && (a.removeEventListener("click", a[l + "Trigger"]), delete a[l + "Trigger"]);
    T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }), delete this.dom[l];
  };
  function s(i) {
    const a = i[l];
    if (!a) return;
    const d = i.getAttribute(u) === "open";
    if (d !== a.isOpen)
      if (d) {
        if (K(i, "ln-popover:before-open", {
          popoverId: i.id,
          target: i,
          trigger: a.trigger
        }).defaultPrevented) {
          i.setAttribute(u, "closed");
          return;
        }
        a._applyOpen(a.trigger);
      } else {
        if (K(i, "ln-popover:before-close", {
          popoverId: i.id,
          target: i,
          trigger: a.trigger
        }).defaultPrevented) {
          i.setAttribute(u, "open");
          return;
        }
        a._applyClose();
      }
  }
  function c() {
    H(function() {
      new MutationObserver(function(a) {
        for (let g = 0; g < a.length; g++) {
          const d = a[g];
          if (d.type === "childList")
            for (let _ = 0; _ < d.addedNodes.length; _++) {
              const E = d.addedNodes[_];
              E.nodeType === 1 && (n(E), e(E));
            }
          else d.type === "attributes" && (d.attributeName === u && d.target[l] ? s(d.target) : (n(d.target), e(d.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, v]
      });
    }, "ln-popover");
  }
  window[l] = t, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body);
})();
(function() {
  const u = "data-ln-tooltip-enhance", l = "data-ln-tooltip", v = "data-ln-tooltip-position", m = "lnTooltipEnhance", f = "ln-tooltip-portal";
  if (window[m] !== void 0) return;
  let b = 0, p = null, o = null, t = null, n = null, e = null;
  function r() {
    return p && p.parentNode || (p = document.getElementById(f), p || (p = document.createElement("div"), p.id = f, document.body.appendChild(p))), p;
  }
  function s() {
    e || (e = function(y) {
      y.key === "Escape" && a();
    }, document.addEventListener("keydown", e));
  }
  function c() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function i(y) {
    if (t === y) return;
    a();
    const A = y.getAttribute(l) || y.getAttribute("title");
    if (!A) return;
    r(), y.hasAttribute("title") && (n = y.getAttribute("title"), y.removeAttribute("title"));
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = A, y[m + "Uid"] || (b += 1, y[m + "Uid"] = "ln-tooltip-" + b), w.id = y[m + "Uid"], p.appendChild(w);
    const C = w.offsetWidth, k = w.offsetHeight, M = y.getBoundingClientRect(), N = y.getAttribute(v) || "top", q = Et(M, { width: C, height: k }, N, 6);
    w.style.top = q.top + "px", w.style.left = q.left + "px", w.setAttribute("data-ln-tooltip-placement", q.placement), y.setAttribute("aria-describedby", w.id), o = w, t = y, s();
  }
  function a() {
    if (!o) {
      c();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), n !== null && t.setAttribute("title", n)), n = null, o.parentNode && o.parentNode.removeChild(o), o = null, t = null, c();
  }
  function g(y) {
    if (y[m]) return;
    y[m] = !0;
    const A = function() {
      i(y);
    }, w = function() {
      t === y && a();
    }, C = function() {
      i(y);
    }, k = function() {
      t === y && a();
    };
    y.addEventListener("mouseenter", A), y.addEventListener("mouseleave", w), y.addEventListener("focus", C, !0), y.addEventListener("blur", k, !0), y[m + "Cleanup"] = function() {
      y.removeEventListener("mouseenter", A), y.removeEventListener("mouseleave", w), y.removeEventListener("focus", C, !0), y.removeEventListener("blur", k, !0), t === y && a(), delete y[m], delete y[m + "Cleanup"], delete y[m + "Uid"], T(y, "ln-tooltip:destroyed", { trigger: y });
    };
  }
  function d(y) {
    if (!y || y.nodeType !== 1) return;
    const A = Array.from(y.querySelectorAll(
      "[" + u + "], [" + l + "][title]"
    ));
    y.hasAttribute && (y.hasAttribute(u) || y.hasAttribute(l) && y.hasAttribute("title")) && A.push(y);
    for (const w of A)
      g(w);
  }
  function _(y) {
    d(y);
  }
  function E() {
    H(function() {
      new MutationObserver(function(A) {
        for (let w = 0; w < A.length; w++) {
          const C = A[w];
          if (C.type === "childList")
            for (let k = 0; k < C.addedNodes.length; k++) {
              const M = C.addedNodes[k];
              M.nodeType === 1 && d(M);
            }
          else C.type === "attributes" && d(C.target);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, l]
      });
    }, "ln-tooltip");
  }
  window[m] = _, E(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    _(document.body);
  }) : _(document.body);
})();
(function() {
  const u = "data-ln-toast", l = "lnToast", v = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[l] !== void 0 && window[l] !== null) return;
  function m(i = document.body) {
    return f(i), c;
  }
  function f(i) {
    if (!i || i.nodeType !== 1) return;
    const a = Array.from(i.querySelectorAll("[" + u + "]"));
    i.hasAttribute && i.hasAttribute(u) && a.push(i);
    for (const g of a)
      g[l] || new b(g);
  }
  function b(i) {
    this.dom = i, i[l] = this, this.timeoutDefault = parseInt(i.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(i.getAttribute("data-ln-toast-max") || "5", 10);
    for (const a of Array.from(i.querySelectorAll("[data-ln-toast-item]")))
      t(a);
    return this;
  }
  b.prototype.destroy = function() {
    if (this.dom[l]) {
      for (const i of Array.from(this.dom.children))
        e(i);
      delete this.dom[l];
    }
  };
  function p(i) {
    return i === "success" ? "Success" : i === "error" ? "Error" : i === "warn" ? "Warning" : "Information";
  }
  function o(i, a, g) {
    const d = document.createElement("div");
    d.className = "ln-toast__card ln-toast__card--" + i, d.setAttribute("role", i === "error" ? "alert" : "status"), d.setAttribute("aria-live", i === "error" ? "assertive" : "polite");
    const _ = document.createElement("div");
    _.className = "ln-toast__side", _.innerHTML = v[i] || v.info;
    const E = document.createElement("div");
    E.className = "ln-toast__content";
    const y = document.createElement("div");
    y.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = a || p(i);
    const w = document.createElement("button");
    return w.type = "button", w.className = "ln-toast__close", w.setAttribute("aria-label", "Close"), w.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>', w.addEventListener("click", function() {
      e(g);
    }), y.appendChild(A), E.appendChild(y), E.appendChild(w), d.appendChild(_), d.appendChild(E), { card: d, content: E };
  }
  function t(i) {
    const a = ((i.getAttribute("data-type") || "info") + "").toLowerCase(), g = i.getAttribute("data-title"), d = (i.innerText || i.textContent || "").trim();
    i.className = "ln-toast__item", i.removeAttribute("data-ln-toast-item");
    const _ = o(a, g, i);
    if (d) {
      const E = document.createElement("div");
      E.className = "ln-toast__body";
      const y = document.createElement("p");
      y.textContent = d, E.appendChild(y), _.content.appendChild(E);
    }
    i.innerHTML = "", i.appendChild(_.card), requestAnimationFrame(() => i.classList.add("ln-toast__item--in"));
  }
  function n(i, a) {
    for (; i.dom.children.length >= i.max; ) i.dom.removeChild(i.dom.firstElementChild);
    i.dom.appendChild(a), requestAnimationFrame(() => a.classList.add("ln-toast__item--in"));
  }
  function e(i) {
    !i || !i.parentNode || (clearTimeout(i._timer), i.classList.remove("ln-toast__item--in"), i.classList.add("ln-toast__item--out"), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 200));
  }
  function r(i = {}) {
    let a = i.container;
    if (typeof a == "string" && (a = document.querySelector(a)), a instanceof HTMLElement || (a = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !a)
      return console.warn("[ln-toast] No toast container found"), null;
    const g = a[l] || new b(a), d = Number.isFinite(i.timeout) ? i.timeout : g.timeoutDefault, _ = (i.type || "info").toLowerCase(), E = document.createElement("li");
    E.className = "ln-toast__item";
    const y = o(_, i.title, E);
    if (i.message || i.data && i.data.errors) {
      const A = document.createElement("div");
      if (A.className = "ln-toast__body", i.message)
        if (Array.isArray(i.message)) {
          const w = document.createElement("ul");
          for (const C of i.message) {
            const k = document.createElement("li");
            k.textContent = C, w.appendChild(k);
          }
          A.appendChild(w);
        } else {
          const w = document.createElement("p");
          w.textContent = i.message, A.appendChild(w);
        }
      if (i.data && i.data.errors) {
        const w = document.createElement("ul");
        for (const C of Object.values(i.data.errors).flat()) {
          const k = document.createElement("li");
          k.textContent = C, w.appendChild(k);
        }
        A.appendChild(w);
      }
      y.content.appendChild(A);
    }
    return E.appendChild(y.card), n(g, E), d > 0 && (E._timer = setTimeout(() => e(E), d)), E;
  }
  function s(i) {
    let a = i;
    if (typeof a == "string" && (a = document.querySelector(a)), a instanceof HTMLElement || (a = document.querySelector("[" + u + "]") || document.getElementById("ln-toast-container")), !!a)
      for (const g of Array.from(a.children))
        e(g);
  }
  const c = function(i) {
    return m(i);
  };
  c.enqueue = r, c.clear = s, H(function() {
    new MutationObserver(function(a) {
      for (const g of a) {
        if (g.type === "attributes") {
          f(g.target);
          continue;
        }
        for (const d of g.addedNodes)
          f(d);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [u] });
  }, "ln-toast"), window[l] = c, window.addEventListener("ln-toast:enqueue", function(i) {
    i.detail && c.enqueue(i.detail);
  }), m(document.body);
})();
(function() {
  const u = "data-ln-upload", l = "lnUpload", v = "data-ln-upload-dict", m = "data-ln-upload-accept", f = "data-ln-upload-context", b = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function p() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const i = document.createElement("div");
    i.innerHTML = b;
    const a = i.firstElementChild;
    a && document.body.appendChild(a);
  }
  if (window[l] !== void 0) return;
  function o(i) {
    if (i === 0) return "0 B";
    const a = 1024, g = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(i) / Math.log(a));
    return parseFloat((i / Math.pow(a, d)).toFixed(1)) + " " + g[d];
  }
  function t(i) {
    return i.split(".").pop().toLowerCase();
  }
  function n(i) {
    return i === "docx" && (i = "doc"), ["pdf", "doc", "epub"].includes(i) ? "lnc-file-" + i : "ln-file";
  }
  function e(i, a) {
    if (!a) return !0;
    const g = "." + t(i.name);
    return a.split(",").map(function(_) {
      return _.trim().toLowerCase();
    }).includes(g.toLowerCase());
  }
  function r(i) {
    if (i.hasAttribute("data-ln-upload-initialized")) return;
    i.setAttribute("data-ln-upload-initialized", "true"), p();
    const a = Ot(i, v), g = i.querySelector(".ln-upload__zone"), d = i.querySelector(".ln-upload__list"), _ = i.getAttribute(m) || "";
    if (!g || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", i);
      return;
    }
    let E = i.querySelector('input[type="file"]');
    E || (E = document.createElement("input"), E.type = "file", E.multiple = !0, E.classList.add("hidden"), _ && (E.accept = _.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), i.appendChild(E));
    const y = i.getAttribute(u) || "/files/upload", A = i.getAttribute(f) || "", w = /* @__PURE__ */ new Map();
    let C = 0;
    function k() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function M(R) {
      if (!e(R, _)) {
        const S = a["invalid-type"];
        T(i, "ln-upload:invalid", {
          file: R,
          message: S
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["invalid-title"] || "Invalid File",
          message: S || a["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const B = "file-" + ++C, j = t(R.name), G = n(j), ft = at(i, "ln-upload-item", "ln-upload");
      if (!ft) return;
      const W = ft.firstElementChild;
      if (!W) return;
      W.setAttribute("data-file-id", B), Z(W, {
        name: R.name,
        sizeText: "0%",
        iconHref: "#" + G,
        removeLabel: a.remove || "Remove",
        uploading: !0,
        error: !1,
        deleting: !1
      });
      const rt = W.querySelector(".ln-upload__progress-bar"), Y = W.querySelector('[data-ln-upload-action="remove"]');
      Y && (Y.disabled = !0), d.appendChild(W);
      const st = new FormData();
      st.append("file", R), st.append("context", A);
      const h = new XMLHttpRequest();
      h.upload.addEventListener("progress", function(S) {
        if (S.lengthComputable) {
          const O = Math.round(S.loaded / S.total * 100);
          rt.style.width = O + "%", Z(W, { sizeText: O + "%" });
        }
      }), h.addEventListener("load", function() {
        if (h.status >= 200 && h.status < 300) {
          let S;
          try {
            S = JSON.parse(h.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          Z(W, { sizeText: o(S.size || R.size), uploading: !1 }), Y && (Y.disabled = !1), w.set(B, {
            serverId: S.id,
            name: S.name,
            size: S.size
          }), N(), T(i, "ln-upload:uploaded", {
            localId: B,
            serverId: S.id,
            name: S.name
          });
        } else {
          let S = a["upload-failed"] || "Upload failed";
          try {
            S = JSON.parse(h.responseText).message || S;
          } catch {
          }
          L(S);
        }
      }), h.addEventListener("error", function() {
        L(a["network-error"] || "Network error");
      });
      function L(S) {
        rt && (rt.style.width = "100%"), Z(W, { sizeText: a.error || "Error", uploading: !1, error: !0 }), Y && (Y.disabled = !1), T(i, "ln-upload:error", {
          file: R,
          message: S
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["error-title"] || "Upload Error",
          message: S || a["upload-failed"] || "Failed to upload file"
        });
      }
      h.open("POST", y), h.setRequestHeader("X-CSRF-TOKEN", k()), h.setRequestHeader("Accept", "application/json"), h.send(st);
    }
    function N() {
      for (const R of i.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of w) {
        const B = document.createElement("input");
        B.type = "hidden", B.name = "file_ids[]", B.value = R.serverId, i.appendChild(B);
      }
    }
    function q(R) {
      const B = w.get(R), j = d.querySelector('[data-file-id="' + R + '"]');
      if (!B || !B.serverId) {
        j && j.remove(), w.delete(R), N();
        return;
      }
      j && Z(j, { deleting: !0 }), fetch("/files/" + B.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": k(),
          Accept: "application/json"
        }
      }).then(function(G) {
        G.status === 200 ? (j && j.remove(), w.delete(R), N(), T(i, "ln-upload:removed", {
          localId: R,
          serverId: B.serverId
        })) : (j && Z(j, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["delete-title"] || "Error",
          message: a["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(G) {
        console.warn("[ln-upload] Delete error:", G), j && Z(j, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["network-error"] || "Network error",
          message: a["connection-error"] || "Could not connect to server"
        });
      });
    }
    function U(R) {
      for (const B of R)
        M(B);
      E.value = "";
    }
    const dt = function() {
      E.click();
    }, ut = function() {
      U(this.files);
    }, ot = function(R) {
      R.preventDefault(), R.stopPropagation(), g.classList.add("ln-upload__zone--dragover");
    }, X = function(R) {
      R.preventDefault(), R.stopPropagation(), g.classList.add("ln-upload__zone--dragover");
    }, et = function(R) {
      R.preventDefault(), R.stopPropagation(), g.classList.remove("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), g.classList.remove("ln-upload__zone--dragover"), U(R.dataTransfer.files);
    }, it = function(R) {
      const B = R.target.closest('[data-ln-upload-action="remove"]');
      if (!B || !d.contains(B) || B.disabled) return;
      const j = B.closest(".ln-upload__item");
      j && q(j.getAttribute("data-file-id"));
    };
    g.addEventListener("click", dt), E.addEventListener("change", ut), g.addEventListener("dragenter", ot), g.addEventListener("dragover", X), g.addEventListener("dragleave", et), g.addEventListener("drop", nt), d.addEventListener("click", it), i.lnUploadAPI = {
      getFileIds: function() {
        return Array.from(w.values()).map(function(R) {
          return R.serverId;
        });
      },
      getFiles: function() {
        return Array.from(w.values());
      },
      clear: function() {
        for (const [, R] of w)
          R.serverId && fetch("/files/" + R.serverId, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": k(),
              Accept: "application/json"
            }
          });
        w.clear(), d.innerHTML = "", N(), T(i, "ln-upload:cleared", {});
      },
      destroy: function() {
        g.removeEventListener("click", dt), E.removeEventListener("change", ut), g.removeEventListener("dragenter", ot), g.removeEventListener("dragover", X), g.removeEventListener("dragleave", et), g.removeEventListener("drop", nt), d.removeEventListener("click", it), w.clear(), d.innerHTML = "", N(), i.removeAttribute("data-ln-upload-initialized"), delete i.lnUploadAPI;
      }
    };
  }
  function s() {
    for (const i of document.querySelectorAll("[" + u + "]"))
      r(i);
  }
  function c() {
    H(function() {
      new MutationObserver(function(a) {
        for (const g of a)
          if (g.type === "childList") {
            for (const d of g.addedNodes)
              if (d.nodeType === 1) {
                d.hasAttribute(u) && r(d);
                for (const _ of d.querySelectorAll("[" + u + "]"))
                  r(_);
              }
          } else g.type === "attributes" && g.target.hasAttribute(u) && r(g.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-upload");
  }
  window[l] = {
    init: r,
    initAll: s
  }, c(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", s) : s();
})();
(function() {
  const u = "lnExternalLinks";
  if (window[u] !== void 0) return;
  function l(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function v(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !l(o)) return;
    o.target = "_blank", o.rel = "noopener noreferrer";
    const t = document.createElement("span");
    t.className = "sr-only", t.textContent = "(opens in new tab)", o.appendChild(t), o.setAttribute("data-ln-external-link", "processed"), T(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function m(o) {
    o = o || document.body;
    for (const t of o.querySelectorAll("a, area"))
      v(t);
  }
  function f() {
    document.body.addEventListener("click", function(o) {
      const t = o.target.closest("a, area");
      t && t.getAttribute("data-ln-external-link") === "processed" && T(t, "ln-external-links:clicked", {
        link: t,
        href: t.href,
        text: t.textContent || t.title || ""
      });
    });
  }
  function b() {
    H(function() {
      new MutationObserver(function(t) {
        for (const n of t)
          if (n.type === "childList") {
            for (const e of n.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && v(e), e.querySelectorAll))
                for (const r of e.querySelectorAll("a, area"))
                  v(r);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function p() {
    f(), b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      m();
    }) : m();
  }
  window[u] = {
    process: m
  }, p();
})();
(function() {
  const u = "data-ln-link", l = "lnLink";
  if (window[l] !== void 0) return;
  let v = null;
  function m() {
    v = document.createElement("div"), v.className = "ln-link-status", document.body.appendChild(v);
  }
  function f(d) {
    v && (v.textContent = d, v.classList.add("ln-link-status--visible"));
  }
  function b() {
    v && v.classList.remove("ln-link-status--visible");
  }
  function p(d, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const E = d.querySelector("a");
    if (!E) return;
    const y = E.getAttribute("href");
    if (!y) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(y, "_blank");
      return;
    }
    K(d, "ln-link:navigate", { target: d, href: y, link: E }).defaultPrevented || E.click();
  }
  function o(d) {
    const _ = d.querySelector("a");
    if (!_) return;
    const E = _.getAttribute("href");
    E && f(E);
  }
  function t() {
    b();
  }
  function n(d) {
    d[l + "Row"] || (d[l + "Row"] = !0, d.querySelector("a") && (d._lnLinkClick = function(_) {
      p(d, _);
    }, d._lnLinkEnter = function() {
      o(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", t)));
  }
  function e(d) {
    d[l + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", t), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[l + "Row"]);
  }
  function r(d) {
    if (!d[l + "Init"]) return;
    const _ = d.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const E = _ === "TABLE" && d.querySelector("tbody") || d;
      for (const y of E.querySelectorAll("tr"))
        e(y);
    } else
      e(d);
    delete d[l + "Init"];
  }
  function s(d) {
    if (d[l + "Init"]) return;
    d[l + "Init"] = !0;
    const _ = d.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const E = _ === "TABLE" && d.querySelector("tbody") || d;
      for (const y of E.querySelectorAll("tr"))
        n(y);
    } else
      n(d);
  }
  function c(d) {
    d.hasAttribute && d.hasAttribute(u) && s(d);
    const _ = d.querySelectorAll ? d.querySelectorAll("[" + u + "]") : [];
    for (const E of _)
      s(E);
  }
  function i() {
    H(function() {
      new MutationObserver(function(_) {
        for (const E of _)
          if (E.type === "childList")
            for (const y of E.addedNodes)
              y.nodeType === 1 && (c(y), y.tagName === "TR" && y.closest("[" + u + "]") && n(y));
          else E.type === "attributes" && c(E.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-link");
  }
  function a(d) {
    c(d);
  }
  window[l] = { init: a, destroy: r };
  function g() {
    m(), i(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g();
})();
(function() {
  const u = "[data-ln-progress]", l = "lnProgress";
  if (window[l] !== void 0) return;
  function v(e) {
    const r = e.getAttribute("data-ln-progress");
    return r !== null && r !== "";
  }
  function m(e) {
    f(e);
  }
  function f(e) {
    const r = Array.from(e.querySelectorAll(u));
    for (const s of r)
      v(s) && !s[l] && (s[l] = new b(s));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && v(e) && !e[l] && (e[l] = new b(e));
  }
  function b(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, n.call(this), o.call(this), t.call(this), this;
  }
  b.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[l]);
  };
  function p() {
    H(function() {
      new MutationObserver(function(r) {
        for (const s of r)
          if (s.type === "childList")
            for (const c of s.addedNodes)
              c.nodeType === 1 && f(c);
          else s.type === "attributes" && f(s.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  p();
  function o() {
    const e = this, r = new MutationObserver(function(s) {
      for (const c of s)
        (c.attributeName === "data-ln-progress" || c.attributeName === "data-ln-progress-max") && n.call(e);
    });
    r.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = r;
  }
  function t() {
    const e = this, r = this.dom.parentElement;
    if (!r || !r.hasAttribute("data-ln-progress-max")) return;
    const s = new MutationObserver(function(c) {
      for (const i of c)
        i.attributeName === "data-ln-progress-max" && n.call(e);
    });
    s.observe(r, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = s;
  }
  function n() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, r = this.dom.parentElement, c = (r && r.hasAttribute("data-ln-progress-max") ? parseFloat(r.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let i = c > 0 ? e / c * 100 : 0;
    i < 0 && (i = 0), i > 100 && (i = 100), this.dom.style.width = i + "%", T(this.dom, "ln-progress:change", { target: this.dom, value: e, max: c, percentage: i });
  }
  window[l] = m, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const u = "data-ln-filter", l = "lnFilter", v = "data-ln-filter-initialized", m = "data-ln-filter-key", f = "data-ln-filter-value", b = "data-ln-filter-hide", p = "data-ln-filter-reset", o = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[l] !== void 0) return;
  function n(s) {
    return s.hasAttribute(p) || s.getAttribute(f) === "";
  }
  function e(s) {
    const c = s.dom, i = s.colIndex, a = c.querySelector("template");
    if (!a || i === null) return;
    const g = document.getElementById(s.targetId);
    if (!g) return;
    const d = g.tagName === "TABLE" ? g : g.querySelector("table");
    if (!d || g.hasAttribute("data-ln-table")) return;
    const _ = {}, E = [], y = d.tBodies;
    for (let C = 0; C < y.length; C++) {
      const k = y[C].rows;
      for (let M = 0; M < k.length; M++) {
        const N = k[M].cells[i], q = N ? N.textContent.trim() : "";
        q && !_[q] && (_[q] = !0, E.push(q));
      }
    }
    E.sort(function(C, k) {
      return C.localeCompare(k);
    });
    const A = c.querySelector("[" + m + "]"), w = A ? A.getAttribute(m) : c.getAttribute("data-ln-filter-key") || "col" + i;
    for (let C = 0; C < E.length; C++) {
      const k = a.content.cloneNode(!0), M = k.querySelector("input");
      M && (M.setAttribute(m, w), M.setAttribute(f, E[C]), kt(k, { text: E[C] }), c.appendChild(k));
    }
  }
  function r(s) {
    if (s.hasAttribute(v)) return this;
    this.dom = s, this.targetId = s.getAttribute(u), this._pendingEvents = [];
    const c = s.getAttribute(o);
    this.colIndex = c !== null ? parseInt(c, 10) : null, e(this), this.inputs = Array.from(s.querySelectorAll("[" + m + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(m) : null;
    const i = this, a = It(
      function() {
        i._render();
      },
      function() {
        i._afterRender();
      }
    );
    this.state = xt({
      key: null,
      values: []
    }, a), this._attachHandlers();
    let g = !1;
    if (s.hasAttribute("data-ln-persist")) {
      const d = mt("filter", s);
      d && d.key && Array.isArray(d.values) && d.values.length > 0 && (this.state.key = d.key, this.state.values = d.values, g = !0);
    }
    if (!g) {
      let d = null;
      const _ = [];
      for (let E = 0; E < this.inputs.length; E++) {
        const y = this.inputs[E];
        if (y.checked && !n(y)) {
          d || (d = y.getAttribute(m));
          const A = y.getAttribute(f);
          A && _.push(A);
        }
      }
      _.length > 0 && (this.state.key = d, this.state.values = _, this._pendingEvents.push({
        name: "ln-filter:changed",
        detail: { key: d, values: _ }
      }));
    }
    return s.setAttribute(v, ""), this;
  }
  r.prototype._attachHandlers = function() {
    const s = this;
    this.inputs.forEach(function(c) {
      c[l + "Bound"] || (c[l + "Bound"] = !0, c._lnFilterChange = function() {
        const i = c.getAttribute(m), a = c.getAttribute(f) || "";
        if (n(c)) {
          s._pendingEvents.push({
            name: "ln-filter:changed",
            detail: { key: i, values: [] }
          }), s.reset();
          return;
        }
        if (c.checked)
          s.state.values.indexOf(a) === -1 && (s.state.key = i, s.state.values.push(a));
        else {
          const g = s.state.values.indexOf(a);
          if (g !== -1 && s.state.values.splice(g, 1), s.state.values.length === 0) {
            s._pendingEvents.push({
              name: "ln-filter:changed",
              detail: { key: i, values: [] }
            }), s.reset();
            return;
          }
        }
        s._pendingEvents.push({
          name: "ln-filter:changed",
          detail: { key: s.state.key, values: s.state.values.slice() }
        });
      }, c.addEventListener("change", c._lnFilterChange));
    });
  }, r.prototype._render = function() {
    const s = this, c = this.state.key, i = this.state.values, a = c === null || i.length === 0, g = [];
    for (let d = 0; d < i.length; d++)
      g.push(i[d].toLowerCase());
    if (this.inputs.forEach(function(d) {
      if (a)
        d.checked = n(d);
      else if (n(d))
        d.checked = !1;
      else {
        const _ = d.getAttribute(f) || "";
        d.checked = i.indexOf(_) !== -1;
      }
    }), s.colIndex !== null)
      s._filterTableRows();
    else {
      const d = document.getElementById(s.targetId);
      if (!d) return;
      const _ = d.children;
      for (let E = 0; E < _.length; E++) {
        const y = _[E];
        if (a) {
          y.removeAttribute(b);
          continue;
        }
        const A = y.getAttribute("data-" + c);
        y.removeAttribute(b), A !== null && g.indexOf(A.toLowerCase()) === -1 && y.setAttribute(b, "true");
      }
    }
  }, r.prototype._afterRender = function() {
    const s = this._pendingEvents;
    this._pendingEvents = [];
    for (let c = 0; c < s.length; c++)
      this._dispatchOnBoth(s[c].name, s[c].detail);
    this.dom.hasAttribute("data-ln-persist") && (this.state.key && this.state.values.length > 0 ? tt("filter", this.dom, { key: this.state.key, values: this.state.values.slice() }) : tt("filter", this.dom, null));
  }, r.prototype._dispatchOnBoth = function(s, c) {
    T(this.dom, s, c);
    const i = document.getElementById(this.targetId);
    i && i !== this.dom && T(i, s, c);
  }, r.prototype._filterTableRows = function() {
    const s = document.getElementById(this.targetId);
    if (!s) return;
    const c = s.tagName === "TABLE" ? s : s.querySelector("table");
    if (!c || s.hasAttribute("data-ln-table")) return;
    const i = this.state.key || this._filterKey, a = this.state.values;
    t.has(c) || t.set(c, {});
    const g = t.get(c);
    if (i && a.length > 0) {
      const y = [];
      for (let A = 0; A < a.length; A++)
        y.push(a[A].toLowerCase());
      g[i] = { col: this.colIndex, values: y };
    } else i && delete g[i];
    const d = Object.keys(g), _ = d.length > 0, E = c.tBodies;
    for (let y = 0; y < E.length; y++) {
      const A = E[y].rows;
      for (let w = 0; w < A.length; w++) {
        const C = A[w];
        if (!_) {
          C.removeAttribute(b);
          continue;
        }
        let k = !0;
        for (let M = 0; M < d.length; M++) {
          const N = g[d[M]], q = C.cells[N.col], U = q ? q.textContent.trim().toLowerCase() : "";
          if (N.values.indexOf(U) === -1) {
            k = !1;
            break;
          }
        }
        k ? C.removeAttribute(b) : C.setAttribute(b, "true");
      }
    }
  }, r.prototype.filter = function(s, c) {
    if (Array.isArray(c)) {
      if (c.length === 0) {
        this.reset();
        return;
      }
      this.state.key = s, this.state.values = c.slice();
    } else if (c)
      this.state.key = s, this.state.values = [c];
    else {
      this.reset();
      return;
    }
    this._pendingEvents.push({
      name: "ln-filter:changed",
      detail: { key: this.state.key, values: this.state.values.slice() }
    });
  }, r.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.values = [];
  }, r.prototype.getActive = function() {
    return this.state.key === null || this.state.values.length === 0 ? null : { key: this.state.key, values: this.state.values.slice() };
  }, r.prototype.destroy = function() {
    if (this.dom[l]) {
      if (this.colIndex !== null) {
        const s = document.getElementById(this.targetId);
        if (s) {
          const c = s.tagName === "TABLE" ? s : s.querySelector("table");
          if (c && t.has(c)) {
            const i = t.get(c), a = this.state.key || this._filterKey;
            a && i[a] && delete i[a], Object.keys(i).length === 0 && t.delete(c);
          }
        }
      }
      this.inputs.forEach(function(s) {
        s._lnFilterChange && (s.removeEventListener("change", s._lnFilterChange), delete s._lnFilterChange), delete s[l + "Bound"];
      }), this.dom.removeAttribute(v), delete this.dom[l];
    }
  }, V(u, l, r, "ln-filter");
})();
(function() {
  const u = "data-ln-search", l = "lnSearch", v = "data-ln-search-initialized", m = "data-ln-search-hide";
  if (window[l] !== void 0) return;
  function b(p) {
    if (p.hasAttribute(v)) return this;
    this.dom = p, this.targetId = p.getAttribute(u);
    const o = p.tagName;
    if (this.input = o === "INPUT" || o === "TEXTAREA" ? p : p.querySelector('[name="search"]') || p.querySelector('input[type="search"]') || p.querySelector('input[type="text"]'), this.itemsSelector = p.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return p.setAttribute(v, ""), this;
  }
  b.prototype._attachHandler = function() {
    if (!this.input) return;
    const p = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      p.input.value = "", p._search(""), p.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(p._debounceTimer), p._debounceTimer = setTimeout(function() {
        p._search(p.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, b.prototype._search = function(p) {
    const o = document.getElementById(this.targetId);
    if (!o || K(o, "ln-search:change", { term: p, targetId: this.targetId }).defaultPrevented) return;
    const n = this.itemsSelector ? o.querySelectorAll(this.itemsSelector) : o.children;
    for (let e = 0; e < n.length; e++) {
      const r = n[e];
      r.removeAttribute(m), p && !r.textContent.replace(/\s+/g, " ").toLowerCase().includes(p) && r.setAttribute(m, "true");
    }
  }, b.prototype.destroy = function() {
    this.dom[l] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(v), delete this.dom[l]);
  }, V(u, l, b, "ln-search");
})();
(function() {
  const u = "lnTableSort", l = "data-ln-sort", v = "data-ln-sort-active";
  if (window[u] !== void 0) return;
  function m(t) {
    f(t);
  }
  function f(t) {
    const n = Array.from(t.querySelectorAll("table"));
    t.tagName === "TABLE" && n.push(t), n.forEach(function(e) {
      if (e[u]) return;
      const r = Array.from(e.querySelectorAll("th[" + l + "]"));
      r.length && (e[u] = new p(e, r));
    });
  }
  function b(t, n) {
    t.querySelectorAll("[data-ln-sort-icon]").forEach(function(r) {
      const s = r.getAttribute("data-ln-sort-icon");
      n == null ? r.classList.toggle("hidden", s !== null && s !== "") : r.classList.toggle("hidden", s !== n);
    });
  }
  function p(t, n) {
    this.table = t, this.ths = n, this._col = -1, this._dir = null;
    const e = this;
    n.forEach(function(s, c) {
      s[u + "Bound"] || (s[u + "Bound"] = !0, s._lnSortClick = function(i) {
        const a = i.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        a && a !== s || e._handleClick(c, s);
      }, s.addEventListener("click", s._lnSortClick));
    });
    const r = t.closest("[data-ln-table][data-ln-persist]");
    if (r) {
      const s = mt("table-sort", r);
      s && s.dir && s.col >= 0 && s.col < n.length && (this._handleClick(s.col, n[s.col]), s.dir === "desc" && this._handleClick(s.col, n[s.col]));
    }
    return this;
  }
  p.prototype._handleClick = function(t, n) {
    let e;
    this._col !== t ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(s) {
      s.removeAttribute(v), b(s, null);
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = t, this._dir = e, n.setAttribute(v, e), b(n, e)), T(this.table, "ln-table:sort", {
      column: t,
      sortType: n.getAttribute(l),
      direction: e
    });
    const r = this.table.closest("[data-ln-table][data-ln-persist]");
    r && (e === null ? tt("table-sort", r, null) : tt("table-sort", r, { col: t, dir: e }));
  }, p.prototype.destroy = function() {
    this.table[u] && (this.ths.forEach(function(t) {
      t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete t[u + "Bound"];
    }), delete this.table[u]);
  };
  function o() {
    H(function() {
      new MutationObserver(function(n) {
        n.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(r) {
            r.nodeType === 1 && f(r);
          }) : e.type === "attributes" && f(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [l] });
    }, "ln-table-sort");
  }
  window[u] = m, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const u = "data-ln-table", l = "lnTable", v = "data-ln-sort", m = "data-ln-table-empty";
  if (window[l] !== void 0) return;
  const p = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function o(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const n = t.querySelector(".ln-table__toolbar");
    n && t.style.setProperty("--ln-table-toolbar-h", n.offsetHeight + "px");
    const e = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const r = new MutationObserver(function() {
        e.tbody.rows.length > 0 && (r.disconnect(), e._parseRows());
      });
      r.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(r) {
      r.preventDefault(), e._searchTerm = r.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(r) {
      e._sortCol = r.detail.direction === null ? -1 : r.detail.column, e._sortDir = r.detail.direction, e._sortType = r.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:sorted", {
        column: r.detail.column,
        direction: r.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(r) {
      const s = r.detail.key;
      let c = !1;
      for (let g = 0; g < e.ths.length; g++)
        if (e.ths[g].getAttribute("data-ln-filter-col") === s) {
          c = !0;
          break;
        }
      if (!c) return;
      const i = r.detail.values;
      if (!i || i.length === 0)
        delete e._columnFilters[s];
      else {
        const g = [];
        for (let d = 0; d < i.length; d++)
          g.push(i[d].toLowerCase());
        e._columnFilters[s] = g;
      }
      const a = e.dom.querySelector('th[data-ln-filter-col="' + s + '"]');
      a && (i && i.length > 0 ? a.setAttribute("data-ln-filter-active", "") : a.removeAttribute("data-ln-filter-active")), e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(r) {
      if (!r.target.closest("[data-ln-table-clear]")) return;
      e._searchTerm = "";
      const c = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (c) {
        const a = c.tagName === "INPUT" ? c : c.querySelector("input");
        a && (a.value = "");
      }
      e._columnFilters = {};
      for (let a = 0; a < e.ths.length; a++)
        e.ths[a].removeAttribute("data-ln-filter-active");
      const i = document.querySelectorAll('[data-ln-filter="' + t.id + '"]');
      for (let a = 0; a < i.length; a++)
        i[a].lnFilter && i[a].lnFilter.reset();
      e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("click", this._onClear), this;
  }
  o.prototype._parseRows = function() {
    const t = this.tbody.rows, n = this.ths;
    this._data = [];
    const e = [];
    for (let r = 0; r < n.length; r++)
      e[r] = n[r].getAttribute(v);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let r = 0; r < t.length; r++) {
      const s = t[r], c = [], i = [], a = [];
      for (let g = 0; g < s.cells.length; g++) {
        const d = s.cells[g], _ = d.textContent.trim(), E = d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : _, y = e[g];
        i[g] = _.toLowerCase(), y === "number" || y === "date" ? c[g] = parseFloat(E) || 0 : y === "string" ? c[g] = String(E) : c[g] = null, g < s.cells.length - 1 && a.push(_.toLowerCase());
      }
      this._data.push({
        sortKeys: c,
        rawTexts: i,
        html: s.outerHTML,
        searchText: a.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, o.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, n = this._columnFilters, e = Object.keys(n).length > 0, r = this.ths, s = {};
    if (e)
      for (let d = 0; d < r.length; d++) {
        const _ = r[d].getAttribute("data-ln-filter-col");
        _ && (s[_] = d);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(d) {
      if (t && d.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const _ in n) {
          const E = s[_];
          if (E !== void 0 && n[_].indexOf(d.rawTexts[E]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const c = this._sortCol, i = this._sortDir === "desc" ? -1 : 1, a = this._sortType === "number" || this._sortType === "date", g = p ? p.compare : function(d, _) {
      return d < _ ? -1 : d > _ ? 1 : 0;
    };
    this._filteredData.sort(function(d, _) {
      const E = d.sortKeys[c], y = _.sortKeys[c];
      return a ? (E - y) * i : g(E, y) * i;
    });
  }, o.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(n) {
      const e = document.createElement("col");
      e.style.width = n.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, o.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, o.prototype._renderAll = function() {
    const t = [], n = this._filteredData;
    for (let e = 0; e < n.length; e++) t.push(n[e].html);
    this.tbody.innerHTML = t.join("");
  }, o.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0;
    const t = this;
    this._scrollHandler = function() {
      t._rafId || (t._rafId = requestAnimationFrame(function() {
        t._rafId = null, t._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, o.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, o.prototype._renderVirtual = function() {
    const t = this._filteredData, n = t.length, e = this._rowHeight;
    if (!e || !n) return;
    const s = this.table.getBoundingClientRect().top + window.scrollY, c = this.thead ? this.thead.offsetHeight : 0, i = s + c, a = window.scrollY - i, g = Math.max(0, Math.floor(a / e) - 15), d = Math.min(g + Math.ceil(window.innerHeight / e) + 30, n);
    if (g === this._vStart && d === this._vEnd) return;
    this._vStart = g, this._vEnd = d;
    const _ = this.ths.length || 1, E = g * e, y = (n - d) * e;
    let A = "";
    E > 0 && (A += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + _ + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
    for (let w = g; w < d; w++) A += t[w].html;
    y > 0 && (A += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + _ + '" style="height:' + y + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = A;
  }, o.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, n = this.dom.querySelector("template[" + m + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), n && e.appendChild(document.importNode(n.content, !0));
    const r = document.createElement("tr");
    r.className = "ln-table__empty", r.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(r), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, o.prototype.destroy = function() {
    this.dom[l] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[l]);
  }, V(u, l, o, "ln-table");
})();
(function() {
  const u = "data-ln-circular-progress", l = "lnCircularProgress";
  if (window[l] !== void 0) return;
  const v = "http://www.w3.org/2000/svg", m = 36, f = 16, b = 2 * Math.PI * f;
  function p(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), n.call(this), r.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  p.prototype.destroy = function() {
    this.dom[l] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[l]);
  };
  function o(r, s) {
    const c = document.createElementNS(v, r);
    for (const i in s)
      c.setAttribute(i, s[i]);
    return c;
  }
  function t() {
    this.svg = o("svg", {
      viewBox: "0 0 " + m + " " + m,
      "aria-hidden": "true"
    }), this.trackCircle = o("circle", {
      cx: m / 2,
      cy: m / 2,
      r: f,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = o("circle", {
      cx: m / 2,
      cy: m / 2,
      r: f,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": b,
      "stroke-dashoffset": b,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function n() {
    const r = this, s = new MutationObserver(function(c) {
      for (const i of c)
        (i.attributeName === "data-ln-circular-progress" || i.attributeName === "data-ln-circular-progress-max") && e.call(r);
    });
    s.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = s;
  }
  function e() {
    const r = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, s = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let c = s > 0 ? r / s * 100 : 0;
    c < 0 && (c = 0), c > 100 && (c = 100);
    const i = b - c / 100 * b;
    this.progressCircle.setAttribute("stroke-dashoffset", i);
    const a = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = a !== null ? a : Math.round(c) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: r,
      max: s,
      percentage: c
    });
  }
  V(u, l, p, "ln-circular-progress");
})();
(function() {
  const u = "data-ln-sortable", l = "lnSortable", v = "data-ln-sortable-handle";
  if (window[l] !== void 0) return;
  function m(p) {
    P(p, u, l, f);
  }
  function f(p) {
    this.dom = p, this.isEnabled = p.getAttribute(u) !== "disabled", this._dragging = null, p.setAttribute("aria-roledescription", "sortable list");
    const o = this;
    return this._onPointerDown = function(t) {
      o.isEnabled && o._handlePointerDown(t);
    }, p.addEventListener("pointerdown", this._onPointerDown), this;
  }
  f.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(u, "");
  }, f.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(u, "disabled");
  }, f.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[l]);
  }, f.prototype._handlePointerDown = function(p) {
    let o = p.target.closest("[" + v + "]"), t;
    if (o) {
      for (t = o; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + v + "]")) return;
      for (t = p.target; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
      o = t;
    }
    const e = Array.from(this.dom.children).indexOf(t);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: t,
      index: e
    }).defaultPrevented) return;
    p.preventDefault(), o.setPointerCapture(p.pointerId), this._dragging = t, t.classList.add("ln-sortable--dragging"), t.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: t,
      index: e
    });
    const s = this, c = function(a) {
      s._handlePointerMove(a);
    }, i = function(a) {
      s._handlePointerEnd(a), o.removeEventListener("pointermove", c), o.removeEventListener("pointerup", i), o.removeEventListener("pointercancel", i);
    };
    o.addEventListener("pointermove", c), o.addEventListener("pointerup", i), o.addEventListener("pointercancel", i);
  }, f.prototype._handlePointerMove = function(p) {
    if (!this._dragging) return;
    const o = Array.from(this.dom.children), t = this._dragging;
    for (const n of o)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of o) {
      if (n === t) continue;
      const e = n.getBoundingClientRect(), r = e.top + e.height / 2;
      if (p.clientY >= e.top && p.clientY < r) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (p.clientY >= r && p.clientY <= e.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, f.prototype._handlePointerEnd = function(p) {
    if (!this._dragging) return;
    const o = this._dragging, t = Array.from(this.dom.children), n = t.indexOf(o);
    let e = null, r = null;
    for (const s of t) {
      if (s.classList.contains("ln-sortable--drop-before")) {
        e = s, r = "before";
        break;
      }
      if (s.classList.contains("ln-sortable--drop-after")) {
        e = s, r = "after";
        break;
      }
    }
    for (const s of t)
      s.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (o.classList.remove("ln-sortable--dragging"), o.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== o) {
      r === "before" ? this.dom.insertBefore(o, e) : this.dom.insertBefore(o, e.nextElementSibling);
      const c = Array.from(this.dom.children).indexOf(o);
      T(this.dom, "ln-sortable:reordered", {
        item: o,
        oldIndex: n,
        newIndex: c
      });
    }
    this._dragging = null;
  };
  function b() {
    H(function() {
      new MutationObserver(function(o) {
        for (let t = 0; t < o.length; t++) {
          const n = o[t];
          if (n.type === "childList")
            for (let e = 0; e < n.addedNodes.length; e++) {
              const r = n.addedNodes[e];
              r.nodeType === 1 && P(r, u, l, f);
            }
          else if (n.type === "attributes") {
            const e = n.target, r = e[l];
            if (r) {
              const s = e.getAttribute(u) !== "disabled";
              s !== r.isEnabled && (r.isEnabled = s, T(e, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: e }));
            } else
              P(e, u, l, f);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-sortable");
  }
  window[l] = m, b(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const u = "data-ln-confirm", l = "lnConfirm", v = "data-ln-confirm-timeout";
  if (window[l] !== void 0) return;
  function f(t) {
    P(t, u, l, b);
  }
  function b(t) {
    this.dom = t, this.confirming = !1, this.originalText = t.textContent.trim(), this.confirmText = t.getAttribute(u) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const n = this;
    return this._onClick = function(e) {
      if (!n.confirming)
        e.preventDefault(), e.stopImmediatePropagation(), n._enterConfirm();
      else {
        if (n._submitted) return;
        n._submitted = !0, n._reset();
      }
    }, t.addEventListener("click", this._onClick), this;
  }
  b.prototype._getTimeout = function() {
    const t = parseFloat(this.dom.getAttribute(v));
    return isNaN(t) || t <= 0 ? 3 : t;
  }, b.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var t = this.dom.querySelector("svg.ln-icon use");
    t && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = t.getAttribute("href"), t.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, b.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const t = this, n = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      t._reset();
    }, n);
  }, b.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var t = this.dom.querySelector("svg.ln-icon use");
      t && this.originalIconHref && t.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, b.prototype.destroy = function() {
    this.dom[l] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[l]);
  };
  function p(t) {
    const n = t[l];
    !n || !n.confirming || n._startTimer();
  }
  function o() {
    H(function() {
      new MutationObserver(function(n) {
        for (let e = 0; e < n.length; e++) {
          const r = n[e];
          if (r.type === "childList")
            for (let s = 0; s < r.addedNodes.length; s++) {
              const c = r.addedNodes[s];
              c.nodeType === 1 && P(c, u, l, b);
            }
          else r.type === "attributes" && (r.attributeName === v && r.target[l] ? p(r.target) : P(r.target, u, l, b));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, v]
      });
    }, "ln-confirm");
  }
  window[l] = f, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    f(document.body);
  }) : f(document.body);
})();
(function() {
  const u = "data-ln-translations", l = "lnTranslations";
  if (window[l] !== void 0) return;
  const v = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(f) {
    this.dom = f, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = f.getAttribute(u + "-default") || "", this.badgesEl = f.querySelector("[" + u + "-active]"), this.menuEl = f.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const b = f.getAttribute(u + "-locales");
    if (this.locales = v, b)
      try {
        this.locales = JSON.parse(b);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const p = this;
    return this._onRequestAdd = function(o) {
      o.detail && o.detail.lang && p.addLanguage(o.detail.lang);
    }, this._onRequestRemove = function(o) {
      o.detail && o.detail.lang && p.removeLanguage(o.detail.lang);
    }, f.addEventListener("ln-translations:request-add", this._onRequestAdd), f.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const b of f) {
      const p = b.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const o of p)
        o.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const f = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const b of f) {
      const p = b.getAttribute("data-ln-translatable-lang");
      p && p !== this.defaultLang && this.activeLanguages.add(p);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const f = this;
    let b = 0;
    for (const o in this.locales) {
      if (!this.locales.hasOwnProperty(o) || this.activeLanguages.has(o)) continue;
      b++;
      const t = yt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const n = t.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", o), n.textContent = this.locales[o], n.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), f.menuEl.getAttribute("data-ln-toggle") === "open" && f.menuEl.setAttribute("data-ln-toggle", "close"), f.addLanguage(o));
      }), this.menuEl.appendChild(t);
    }
    const p = this.dom.querySelector("[" + u + "-add]");
    p && (p.style.display = b === 0 ? "none" : "");
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const f = this;
    this.activeLanguages.forEach(function(b) {
      const p = yt("ln-translations-badge", "ln-translations");
      if (!p) return;
      const o = p.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", b);
      const t = o.querySelector("span");
      t.textContent = f.locales[b] || b.toUpperCase();
      const n = o.querySelector("button");
      n.setAttribute("aria-label", "Remove " + (f.locales[b] || b.toUpperCase())), n.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), f.removeLanguage(b));
      }), f.badgesEl.appendChild(p);
    });
  }, m.prototype.addLanguage = function(f, b) {
    if (this.activeLanguages.has(f)) return;
    const p = this.locales[f] || f;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: f,
      langName: p
    }).defaultPrevented) return;
    this.activeLanguages.add(f), b = b || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const n of t) {
      const e = n.getAttribute("data-ln-translatable"), r = n.getAttribute("data-ln-translations-prefix") || "", s = n.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!s) continue;
      const c = s.cloneNode(!1);
      r ? c.name = r + "[trans][" + f + "][" + e + "]" : c.name = "trans[" + f + "][" + e + "]", c.value = b[e] !== void 0 ? b[e] : "", c.removeAttribute("id"), c.placeholder = p + " translation", c.setAttribute("data-ln-translatable-lang", f);
      const i = n.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = i.length > 0 ? i[i.length - 1] : s;
      a.parentNode.insertBefore(c, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: f,
      langName: p
    });
  }, m.prototype.removeLanguage = function(f) {
    if (!this.activeLanguages.has(f) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: f
    }).defaultPrevented) return;
    const p = this.dom.querySelectorAll('[data-ln-translatable-lang="' + f + '"]');
    for (const o of p)
      o.parentNode.removeChild(o);
    this.activeLanguages.delete(f), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: f
    });
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(f) {
    return this.activeLanguages.has(f);
  }, m.prototype.destroy = function() {
    if (!this.dom[l]) return;
    const f = this.defaultLang, b = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const p of b)
      p.getAttribute("data-ln-translatable-lang") !== f && p.parentNode.removeChild(p);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[l];
  }, V(u, l, m, "ln-translations");
})();
(function() {
  const u = "data-ln-autosave", l = "lnAutosave", v = "data-ln-autosave-clear", m = "ln-autosave:";
  if (window[l] !== void 0) return;
  function f(o) {
    const t = b(o);
    if (!t) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", o);
      return;
    }
    this.dom = o, this.key = t;
    const n = this;
    return this._onFocusout = function(e) {
      const r = e.target;
      p(r) && r.name && n.save();
    }, this._onChange = function(e) {
      const r = e.target;
      p(r) && r.name && n.save();
    }, this._onSubmit = function() {
      n.clear();
    }, this._onReset = function() {
      n.clear();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + v + "]") && n.clear();
    }, o.addEventListener("focusout", this._onFocusout), o.addEventListener("change", this._onChange), o.addEventListener("submit", this._onSubmit), o.addEventListener("reset", this._onReset), o.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  f.prototype.save = function() {
    const o = St(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(o));
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:saved", { target: this.dom, data: o });
  }, f.prototype.restore = function() {
    let o;
    try {
      o = localStorage.getItem(this.key);
    } catch {
      return;
    }
    if (!o) return;
    let t;
    try {
      t = JSON.parse(o);
    } catch {
      return;
    }
    if (K(this.dom, "ln-autosave:before-restore", { target: this.dom, data: t }).defaultPrevented) return;
    const e = Lt(this.dom, t);
    for (let r = 0; r < e.length; r++)
      e[r].dispatchEvent(new Event("input", { bubbles: !0 })), e[r].dispatchEvent(new Event("change", { bubbles: !0 })), e[r].lnSelect && e[r].lnSelect.setValue && e[r].lnSelect.setValue(t[e[r].name]);
    T(this.dom, "ln-autosave:restored", { target: this.dom, data: t });
  }, f.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, f.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[l]);
  };
  function b(o) {
    const n = o.getAttribute(u) || o.id;
    return n ? m + window.location.pathname + ":" + n : null;
  }
  function p(o) {
    const t = o.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }
  V(u, l, f, "ln-autosave");
})();
(function() {
  const u = "data-ln-autoresize", l = "lnAutoresize";
  if (window[l] !== void 0) return;
  function v(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const f = this;
    return this._onInput = function() {
      f._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  v.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, v.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[l]);
  }, V(u, l, v, "ln-autoresize");
})();
(function() {
  const u = "data-ln-validate", l = "lnValidate", v = "data-ln-validate-errors", m = "data-ln-validate-error", f = "ln-validate-valid", b = "ln-validate-invalid", p = {
    required: "valueMissing",
    typeMismatch: "typeMismatch",
    tooShort: "tooShort",
    tooLong: "tooLong",
    patternMismatch: "patternMismatch",
    rangeUnderflow: "rangeUnderflow",
    rangeOverflow: "rangeOverflow"
  };
  if (window[l] !== void 0) return;
  function o(t) {
    this.dom = t, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, e = t.tagName, r = t.type, s = e === "SELECT" || r === "checkbox" || r === "radio";
    return this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(c) {
      const i = c.detail && c.detail.error;
      if (!i) return;
      n._customErrors.add(i), n._touched = !0;
      const a = t.closest(".form-element");
      if (a) {
        const g = a.querySelector("[" + m + '="' + i + '"]');
        g && g.classList.remove("hidden");
      }
      t.classList.remove(f), t.classList.add(b);
    }, this._onClearCustom = function(c) {
      const i = c.detail && c.detail.error, a = t.closest(".form-element");
      if (i) {
        if (n._customErrors.delete(i), a) {
          const g = a.querySelector("[" + m + '="' + i + '"]');
          g && g.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(g) {
          if (a) {
            const d = a.querySelector("[" + m + '="' + g + '"]');
            d && d.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, s || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  o.prototype.validate = function() {
    const t = this.dom, n = t.validity, r = t.checkValidity() && this._customErrors.size === 0, s = t.closest(".form-element");
    if (s) {
      const i = s.querySelector("[" + v + "]");
      if (i) {
        const a = i.querySelectorAll("[" + m + "]");
        for (let g = 0; g < a.length; g++) {
          const d = a[g].getAttribute(m), _ = p[d];
          _ && (n[_] ? a[g].classList.remove("hidden") : a[g].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(f, r), t.classList.toggle(b, !r), T(t, r ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), r;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(f, b);
    const t = this.dom.closest(".form-element");
    if (t) {
      const n = t.querySelectorAll("[" + m + "]");
      for (let e = 0; e < n.length; e++)
        n[e].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), o.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(f, b), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, o, "ln-validate");
})();
(function() {
  const u = "data-ln-form", l = "lnForm", v = "data-ln-form-auto", m = "data-ln-form-debounce", f = "data-ln-validate", b = "lnValidate";
  if (window[l] !== void 0) return;
  function p(o) {
    this.dom = o, this._invalidFields = /* @__PURE__ */ new Set(), this._debounceTimer = null;
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
    }, o.addEventListener("ln-validate:valid", this._onValid), o.addEventListener("ln-validate:invalid", this._onInvalid), o.addEventListener("submit", this._onSubmit), o.addEventListener("ln-form:fill", this._onFill), o.addEventListener("ln-form:reset", this._onFormReset), o.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, o.hasAttribute(v)) {
      const n = parseInt(o.getAttribute(m)) || 0;
      this._onAutoInput = function() {
        n > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, n)) : t.submit();
      }, o.addEventListener("input", this._onAutoInput), o.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  p.prototype._updateSubmitButton = function() {
    const o = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!o.length) return;
    const t = this.dom.querySelectorAll("[" + f + "]");
    let n = !1;
    if (t.length > 0) {
      let e = !1, r = !1;
      for (let s = 0; s < t.length; s++) {
        const c = t[s][b];
        c && c._touched && (e = !0), t[s].checkValidity() || (r = !0);
      }
      n = r || !e;
    }
    for (let e = 0; e < o.length; e++)
      o[e].disabled = n;
  }, p.prototype.fill = function(o) {
    const t = Lt(this.dom, o);
    for (let n = 0; n < t.length; n++) {
      const e = t[n], r = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(r ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype.submit = function() {
    const o = this.dom.querySelectorAll("[" + f + "]");
    let t = !0;
    for (let e = 0; e < o.length; e++) {
      const r = o[e][b];
      r && (r.validate() || (t = !1));
    }
    if (!t) return;
    const n = St(this.dom);
    T(this.dom, "ln-form:submit", { data: n });
  }, p.prototype.reset = function() {
    this.dom.reset(), this._resetValidation();
  }, p.prototype._resetValidation = function() {
    this._invalidFields.clear();
    const o = this.dom.querySelectorAll("[" + f + "]");
    for (let t = 0; t < o.length; t++) {
      const n = o[t][b];
      n && n.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(p.prototype, "isValid", {
    get: function() {
      const o = this.dom.querySelectorAll("[" + f + "]");
      for (let t = 0; t < o.length; t++)
        if (!o[t].checkValidity()) return !1;
      return !0;
    }
  }), p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[l]);
  }, V(u, l, p, "ln-form");
})();
(function() {
  const u = "data-ln-time", l = "lnTime";
  if (window[l] !== void 0) return;
  const v = {}, m = {};
  function f(A) {
    return A.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function b(A, w) {
    const C = (A || "") + "|" + JSON.stringify(w);
    return v[C] || (v[C] = new Intl.DateTimeFormat(A, w)), v[C];
  }
  function p(A) {
    const w = A || "";
    return m[w] || (m[w] = new Intl.RelativeTimeFormat(A, { numeric: "auto", style: "narrow" })), m[w];
  }
  const o = /* @__PURE__ */ new Set();
  let t = null;
  function n() {
    t || (t = setInterval(r, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function r() {
    for (const A of o) {
      if (!document.body.contains(A.dom)) {
        o.delete(A);
        continue;
      }
      d(A);
    }
    o.size === 0 && e();
  }
  function s(A, w) {
    return b(w, { dateStyle: "long", timeStyle: "short" }).format(A);
  }
  function c(A, w) {
    const C = /* @__PURE__ */ new Date(), k = { month: "short", day: "numeric" };
    return A.getFullYear() !== C.getFullYear() && (k.year = "numeric"), b(w, k).format(A);
  }
  function i(A, w) {
    return b(w, { dateStyle: "medium" }).format(A);
  }
  function a(A, w) {
    return b(w, { timeStyle: "short" }).format(A);
  }
  function g(A, w) {
    const C = Math.floor(Date.now() / 1e3), M = Math.floor(A.getTime() / 1e3) - C, N = Math.abs(M);
    if (N < 10) return p(w).format(0, "second");
    let q, U;
    if (N < 60)
      q = "second", U = M;
    else if (N < 3600)
      q = "minute", U = Math.round(M / 60);
    else if (N < 86400)
      q = "hour", U = Math.round(M / 3600);
    else if (N < 604800)
      q = "day", U = Math.round(M / 86400);
    else if (N < 2592e3)
      q = "week", U = Math.round(M / 604800);
    else
      return c(A, w);
    return p(w).format(U, q);
  }
  function d(A) {
    const w = A.dom.getAttribute("datetime");
    if (!w) return;
    const C = Number(w);
    if (isNaN(C)) return;
    const k = new Date(C * 1e3), M = A.dom.getAttribute(u) || "short", N = f(A.dom);
    let q;
    switch (M) {
      case "relative":
        q = g(k, N);
        break;
      case "full":
        q = s(k, N);
        break;
      case "date":
        q = i(k, N);
        break;
      case "time":
        q = a(k, N);
        break;
      default:
        q = c(k, N);
        break;
    }
    A.dom.textContent = q, M !== "full" && (A.dom.title = s(k, N));
  }
  function _(A) {
    return this.dom = A, d(this), A.getAttribute(u) === "relative" && (o.add(this), n()), this;
  }
  _.prototype.render = function() {
    d(this);
  }, _.prototype.destroy = function() {
    o.delete(this), o.size === 0 && e(), delete this.dom[l];
  };
  function E(A) {
    P(A, u, l, _);
  }
  function y() {
    H(function() {
      new MutationObserver(function(w) {
        for (const C of w)
          if (C.type === "childList")
            for (const k of C.addedNodes)
              k.nodeType === 1 && P(k, u, l, _);
          else if (C.type === "attributes") {
            const k = C.target;
            k[l] ? (k.getAttribute(u) === "relative" ? (o.add(k[l]), n()) : (o.delete(k[l]), o.size === 0 && e()), d(k[l])) : P(k, u, l, _);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u, "datetime"]
      });
    }, "ln-time");
  }
  y(), window[l] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const u = "data-ln-store", l = "lnStore";
  if (window[l] !== void 0) return;
  const v = "ln_app_cache", m = "_meta", f = "1.0";
  let b = null, p = null;
  const o = {};
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
  function n(h) {
    h && h.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: h });
  }
  function e() {
    const h = document.querySelectorAll("[" + u + "]"), L = {};
    for (let S = 0; S < h.length; S++) {
      const O = h[S].getAttribute(u);
      O && (L[O] = {
        indexes: (h[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(I) {
          return I.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function r() {
    return p || (p = new Promise(function(h, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), h(null);
        return;
      }
      const S = e(), O = Object.keys(S), I = indexedDB.open(v);
      I.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), h(null);
      }, I.onsuccess = function(x) {
        const D = x.target.result, F = Array.from(D.objectStoreNames);
        let z = !1;
        F.indexOf(m) === -1 && (z = !0);
        for (let Q = 0; Q < O.length; Q++)
          if (F.indexOf(O[Q]) === -1) {
            z = !0;
            break;
          }
        if (!z) {
          s(D), b = D, h(D);
          return;
        }
        const lt = D.version;
        D.close();
        const ht = indexedDB.open(v, lt + 1);
        ht.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, ht.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), h(null);
        }, ht.onupgradeneeded = function(Q) {
          const J = Q.target.result;
          J.objectStoreNames.contains(m) || J.createObjectStore(m, { keyPath: "key" });
          for (let gt = 0; gt < O.length; gt++) {
            const bt = O[gt];
            if (!J.objectStoreNames.contains(bt)) {
              const Ct = J.createObjectStore(bt, { keyPath: "id" }), _t = S[bt].indexes;
              for (let pt = 0; pt < _t.length; pt++)
                Ct.createIndex(_t[pt], _t[pt], { unique: !1 });
            }
          }
        }, ht.onsuccess = function(Q) {
          const J = Q.target.result;
          s(J), b = J, h(J);
        };
      };
    }), p);
  }
  function s(h) {
    h.onversionchange = function() {
      h.close(), b = null, p = null;
    };
  }
  function c() {
    return b ? Promise.resolve(b) : (p = null, r());
  }
  function i(h, L) {
    return c().then(function(S) {
      return S ? S.transaction(h, L).objectStore(h) : null;
    });
  }
  function a(h) {
    return new Promise(function(L, S) {
      h.onsuccess = function() {
        L(h.result);
      }, h.onerror = function() {
        n(h.error), S(h.error);
      };
    });
  }
  function g(h) {
    return i(h, "readonly").then(function(L) {
      return L ? a(L.getAll()) : [];
    });
  }
  function d(h, L) {
    return i(h, "readonly").then(function(S) {
      return S ? a(S.get(L)) : null;
    });
  }
  function _(h, L) {
    return i(h, "readwrite").then(function(S) {
      if (S)
        return a(S.put(L));
    });
  }
  function E(h, L) {
    return i(h, "readwrite").then(function(S) {
      if (S)
        return a(S.delete(L));
    });
  }
  function y(h) {
    return i(h, "readwrite").then(function(L) {
      if (L)
        return a(L.clear());
    });
  }
  function A(h) {
    return i(h, "readonly").then(function(L) {
      return L ? a(L.count()) : 0;
    });
  }
  function w(h) {
    return i(m, "readonly").then(function(L) {
      return L ? a(L.get(h)) : null;
    });
  }
  function C(h, L) {
    return i(m, "readwrite").then(function(S) {
      if (S)
        return L.key = h, a(S.put(L));
    });
  }
  function k(h) {
    this.dom = h, this._name = h.getAttribute(u), this._endpoint = h.getAttribute("data-ln-store-endpoint") || "";
    const L = h.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (h.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(I) {
      return I.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, o[this._name] = this;
    const O = this;
    return M(O), ut(O), this;
  }
  function M(h) {
    h._handlers = {
      create: function(L) {
        N(h, L.detail);
      },
      update: function(L) {
        q(h, L.detail);
      },
      delete: function(L) {
        U(h, L.detail);
      },
      bulkDelete: function(L) {
        dt(h, L.detail);
      }
    }, h.dom.addEventListener("ln-store:request-create", h._handlers.create), h.dom.addEventListener("ln-store:request-update", h._handlers.update), h.dom.addEventListener("ln-store:request-delete", h._handlers.delete), h.dom.addEventListener("ln-store:request-bulk-delete", h._handlers.bulkDelete);
  }
  function N(h, L) {
    const S = L.data || {}, O = "_temp_" + t(), I = Object.assign({}, S, { id: O });
    _(h._name, I).then(function() {
      return h.totalCount++, T(h.dom, "ln-store:created", {
        store: h._name,
        record: I,
        tempId: O
      }), fetch(h._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(S)
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      return x.json();
    }).then(function(x) {
      return E(h._name, O).then(function() {
        return _(h._name, x);
      }).then(function() {
        T(h.dom, "ln-store:confirmed", {
          store: h._name,
          record: x,
          tempId: O,
          action: "create"
        });
      });
    }).catch(function(x) {
      E(h._name, O).then(function() {
        h.totalCount--, T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: I,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function q(h, L) {
    const S = L.id, O = L.data || {}, I = L.expected_version;
    let x = null;
    d(h._name, S).then(function(D) {
      if (!D) throw new Error("Record not found: " + S);
      x = Object.assign({}, D);
      const F = Object.assign({}, D, O);
      return _(h._name, F).then(function() {
        return T(h.dom, "ln-store:updated", {
          store: h._name,
          record: F,
          previous: x
        }), F;
      });
    }).then(function(D) {
      const F = Object.assign({}, O);
      return I && (F.expected_version = I), fetch(h._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(F)
      });
    }).then(function(D) {
      if (D.status === 409)
        return D.json().then(function(F) {
          return _(h._name, x).then(function() {
            T(h.dom, "ln-store:conflict", {
              store: h._name,
              local: x,
              remote: F.current || F,
              field_diffs: F.field_diffs || null
            });
          });
        });
      if (!D.ok) throw new Error("HTTP " + D.status);
      return D.json().then(function(F) {
        return _(h._name, F).then(function() {
          T(h.dom, "ln-store:confirmed", {
            store: h._name,
            record: F,
            action: "update"
          });
        });
      });
    }).catch(function(D) {
      x && _(h._name, x).then(function() {
        T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: x,
          action: "update",
          error: D.message
        });
      });
    });
  }
  function U(h, L) {
    const S = L.id;
    let O = null;
    d(h._name, S).then(function(I) {
      if (I)
        return O = Object.assign({}, I), E(h._name, S).then(function() {
          return h.totalCount--, T(h.dom, "ln-store:deleted", {
            store: h._name,
            id: S
          }), fetch(h._endpoint + "/" + S, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(I) {
      if (!I || !I.ok) throw new Error("HTTP " + (I ? I.status : "unknown"));
      T(h.dom, "ln-store:confirmed", {
        store: h._name,
        record: O,
        action: "delete"
      });
    }).catch(function(I) {
      O && _(h._name, O).then(function() {
        h.totalCount++, T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: O,
          action: "delete",
          error: I.message
        });
      });
    });
  }
  function dt(h, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let O = [];
    const I = S.map(function(x) {
      return d(h._name, x);
    });
    Promise.all(I).then(function(x) {
      return O = x.filter(Boolean), it(h._name, S).then(function() {
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
      O.length > 0 && nt(h._name, O).then(function() {
        h.totalCount += O.length, T(h.dom, "ln-store:reverted", {
          store: h._name,
          record: null,
          ids: S,
          action: "bulk-delete",
          error: x.message
        });
      });
    });
  }
  function ut(h) {
    r().then(function() {
      return w(h._name);
    }).then(function(L) {
      L && L.schema_version === f ? (h.lastSyncedAt = L.last_synced_at || null, h.totalCount = L.record_count || 0, h.totalCount > 0 ? (h.isLoaded = !0, T(h.dom, "ln-store:ready", {
        store: h._name,
        count: h.totalCount,
        source: "cache"
      }), ot(h) && et(h)) : X(h)) : L && L.schema_version !== f ? y(h._name).then(function() {
        return C(h._name, {
          schema_version: f,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        X(h);
      }) : X(h);
    });
  }
  function ot(h) {
    return h._staleThreshold === -1 ? !1 : h.lastSyncedAt ? Math.floor(Date.now() / 1e3) - h.lastSyncedAt > h._staleThreshold : !0;
  }
  function X(h) {
    return h._endpoint ? (h.isSyncing = !0, h._abortController = new AbortController(), fetch(h._endpoint, { signal: h._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const S = L.data || [], O = L.synced_at || Math.floor(Date.now() / 1e3);
      return nt(h._name, S).then(function() {
        return C(h._name, {
          schema_version: f,
          last_synced_at: O,
          record_count: S.length
        });
      }).then(function() {
        h.isLoaded = !0, h.isSyncing = !1, h.lastSyncedAt = O, h.totalCount = S.length, h._abortController = null, T(h.dom, "ln-store:loaded", {
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
  function et(h) {
    if (!h._endpoint || !h.lastSyncedAt) return X(h);
    h.isSyncing = !0, h._abortController = new AbortController();
    const L = h._endpoint + (h._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + h.lastSyncedAt;
    return fetch(L, { signal: h._abortController.signal }).then(function(S) {
      if (!S.ok) throw new Error("HTTP " + S.status);
      return S.json();
    }).then(function(S) {
      const O = S.data || [], I = S.deleted || [], x = S.synced_at || Math.floor(Date.now() / 1e3), D = O.length > 0 || I.length > 0;
      let F = Promise.resolve();
      return O.length > 0 && (F = F.then(function() {
        return nt(h._name, O);
      })), I.length > 0 && (F = F.then(function() {
        return it(h._name, I);
      })), F.then(function() {
        return A(h._name);
      }).then(function(z) {
        return h.totalCount = z, C(h._name, {
          schema_version: f,
          last_synced_at: x,
          record_count: z
        });
      }).then(function() {
        h.isSyncing = !1, h.lastSyncedAt = x, h._abortController = null, T(h.dom, "ln-store:synced", {
          store: h._name,
          added: O.length,
          deleted: I.length,
          changed: D
        });
      });
    }).catch(function(S) {
      h.isSyncing = !1, h._abortController = null, S.name !== "AbortError" && T(h.dom, "ln-store:offline", { store: h._name });
    });
  }
  function nt(h, L) {
    return c().then(function(S) {
      if (S)
        return new Promise(function(O, I) {
          const x = S.transaction(h, "readwrite"), D = x.objectStore(h);
          for (let F = 0; F < L.length; F++)
            D.put(L[F]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            n(x.error), I(x.error);
          };
        });
    });
  }
  function it(h, L) {
    return c().then(function(S) {
      if (S)
        return new Promise(function(O, I) {
          const x = S.transaction(h, "readwrite"), D = x.objectStore(h);
          for (let F = 0; F < L.length; F++)
            D.delete(L[F]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            I(x.error);
          };
        });
    });
  }
  let R = null;
  R = function() {
    if (document.visibilityState !== "visible") return;
    const h = Object.keys(o);
    for (let L = 0; L < h.length; L++) {
      const S = o[h[L]];
      S.isLoaded && !S.isSyncing && ot(S) && et(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const B = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function j(h, L) {
    if (!L || !L.field) return h;
    const S = L.field, O = L.direction === "desc";
    return h.slice().sort(function(I, x) {
      const D = I[S], F = x[S];
      if (D == null && F == null) return 0;
      if (D == null) return O ? 1 : -1;
      if (F == null) return O ? -1 : 1;
      let z;
      return typeof D == "string" && typeof F == "string" ? z = B.compare(D, F) : z = D < F ? -1 : D > F ? 1 : 0, O ? -z : z;
    });
  }
  function G(h, L) {
    if (!L) return h;
    const S = Object.keys(L);
    return S.length === 0 ? h : h.filter(function(O) {
      for (let I = 0; I < S.length; I++) {
        const x = S[I], D = L[x];
        if (!Array.isArray(D) || D.length === 0) continue;
        const F = O[x];
        let z = !1;
        for (let lt = 0; lt < D.length; lt++)
          if (String(F) === String(D[lt])) {
            z = !0;
            break;
          }
        if (!z) return !1;
      }
      return !0;
    });
  }
  function ft(h, L, S) {
    if (!L || !S || S.length === 0) return h;
    const O = L.toLowerCase();
    return h.filter(function(I) {
      for (let x = 0; x < S.length; x++) {
        const D = I[S[x]];
        if (D != null && String(D).toLowerCase().indexOf(O) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function W(h, L, S) {
    if (h.length === 0) return 0;
    if (S === "count") return h.length;
    let O = 0, I = 0;
    for (let x = 0; x < h.length; x++) {
      const D = parseFloat(h[x][L]);
      isNaN(D) || (O += D, I++);
    }
    return S === "sum" ? O : S === "avg" && I > 0 ? O / I : 0;
  }
  k.prototype.getAll = function(h) {
    const L = this;
    return h = h || {}, g(L._name).then(function(S) {
      const O = S.length;
      h.filters && (S = G(S, h.filters)), h.search && (S = ft(S, h.search, L._searchFields));
      const I = S.length;
      if (h.sort && (S = j(S, h.sort)), h.offset || h.limit) {
        const x = h.offset || 0, D = h.limit || S.length;
        S = S.slice(x, x + D);
      }
      return {
        data: S,
        total: O,
        filtered: I
      };
    });
  }, k.prototype.getById = function(h) {
    return d(this._name, h);
  }, k.prototype.count = function(h) {
    const L = this;
    return h ? g(L._name).then(function(S) {
      return G(S, h).length;
    }) : A(L._name);
  }, k.prototype.aggregate = function(h, L) {
    return g(this._name).then(function(O) {
      return W(O, h, L);
    });
  }, k.prototype.forceSync = function() {
    return et(this);
  }, k.prototype.fullReload = function() {
    const h = this;
    return y(h._name).then(function() {
      return h.isLoaded = !1, h.lastSyncedAt = null, h.totalCount = 0, X(h);
    });
  }, k.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete o[this._name], Object.keys(o).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[l], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function rt() {
    return c().then(function(h) {
      if (!h) return;
      const L = Array.from(h.objectStoreNames);
      return new Promise(function(S, O) {
        const I = h.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          I.objectStore(L[x]).clear();
        I.oncomplete = function() {
          S();
        }, I.onerror = function() {
          O(I.error);
        };
      });
    }).then(function() {
      const h = Object.keys(o);
      for (let L = 0; L < h.length; L++) {
        const S = o[h[L]];
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      }
    });
  }
  function Y(h) {
    P(h, u, l, k);
  }
  function st() {
    H(function() {
      new MutationObserver(function(L) {
        for (let S = 0; S < L.length; S++) {
          const O = L[S];
          if (O.type === "childList")
            for (let I = 0; I < O.addedNodes.length; I++) {
              const x = O.addedNodes[I];
              x.nodeType === 1 && P(x, u, l, k);
            }
          else O.type === "attributes" && P(O.target, u, l, k);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [u]
      });
    }, "ln-store");
  }
  window[l] = { init: Y, clearAll: rt }, st(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    Y(document.body);
  }) : Y(document.body);
})();
(function() {
  const u = "data-ln-data-table", l = "lnDataTable";
  if (window[l] !== void 0) return;
  const f = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function b(o) {
    return f ? f.format(o) : String(o);
  }
  function p(o) {
    this.dom = o, this.name = o.getAttribute(u) || "", this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-data-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = o.querySelector("[data-ln-data-table-total]"), this._filteredSpan = o.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = o.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(n) {
      const e = n.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._renderRows(), t._updateFooter(), T(o, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, o.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(n) {
      const e = n.detail && n.detail.loading;
      o.classList.toggle("ln-data-table--loading", !!e), e && (t.isLoaded = !1);
    }, o.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(o.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(n) {
      const e = n.target.closest("[data-ln-col-sort]");
      if (!e) return;
      const r = e.closest("th");
      if (!r) return;
      const s = r.getAttribute("data-ln-col");
      s && t._handleSort(s, r);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(n) {
      const e = n.target.closest("[data-ln-col-filter]");
      if (!e) return;
      n.stopPropagation();
      const r = e.closest("th");
      if (!r) return;
      const s = r.getAttribute("data-ln-col");
      if (s) {
        if (t._activeDropdown && t._activeDropdown.field === s) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(s, r, e);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(n) {
      n.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), T(o, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, o.addEventListener("click", this._onClearAll), this._selectable = o.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(n) {
        const e = n.target.closest("[data-ln-row-select]");
        if (!e) return;
        const r = e.closest("[data-ln-row]");
        if (!r) return;
        const s = r.getAttribute("data-ln-row-id");
        s != null && (e.checked ? (t.selectedIds.add(s), r.classList.add("ln-row-selected")) : (t.selectedIds.delete(s), r.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), T(o, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = o.querySelector('[data-ln-col-select] input[type="checkbox"]') || o.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const n = document.createElement("input");
        n.type = "checkbox", n.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(n), this._selectAllCheckbox = n;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const n = t._selectAllCheckbox.checked, e = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let r = 0; r < e.length; r++) {
          const s = e[r].getAttribute("data-ln-row-id"), c = e[r].querySelector("[data-ln-row-select]");
          s != null && (n ? (t.selectedIds.add(s), e[r].classList.add("ln-row-selected")) : (t.selectedIds.delete(s), e[r].classList.remove("ln-row-selected")), c && (c.checked = n));
        }
        t.selectedCount = t.selectedIds.size, T(o, "ln-data-table:select-all", {
          table: t.name,
          selected: n
        }), T(o, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }), t._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const n = this.tbody.querySelectorAll("[data-ln-row]");
        for (let e = 0; e < n.length; e++) {
          const r = n[e].querySelector("[data-ln-row-select]"), s = n[e].getAttribute("data-ln-row-id");
          r && r.checked && s != null && (this.selectedIds.add(s), n[e].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(n) {
      if (n.target.closest("[data-ln-row-select]") || n.target.closest("[data-ln-row-action]") || n.target.closest("a") || n.target.closest("button") || n.ctrlKey || n.metaKey || n.button === 1) return;
      const e = n.target.closest("[data-ln-row]");
      if (!e) return;
      const r = e.getAttribute("data-ln-row-id"), s = e._lnRecord || {};
      T(o, "ln-data-table:row-click", {
        table: t.name,
        id: r,
        record: s
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(n) {
      const e = n.target.closest("[data-ln-row-action]");
      if (!e) return;
      n.stopPropagation();
      const r = e.closest("[data-ln-row]");
      if (!r) return;
      const s = e.getAttribute("data-ln-row-action"), c = r.getAttribute("data-ln-row-id"), i = r._lnRecord || {};
      T(o, "ln-data-table:row-action", {
        table: t.name,
        id: c,
        action: s,
        record: i
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = o.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, T(o, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(n) {
      if (!o.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
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
              const r = e[t._focusedRowIndex];
              T(o, "ln-data-table:row-click", {
                table: t.name,
                id: r.getAttribute("data-ln-row-id"),
                record: r._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              n.preventDefault();
              const r = e[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              r && (r.checked = !r.checked, r.dispatchEvent(new Event("change", { bubbles: !0 })));
            }
            break;
          case "Escape":
            t._activeDropdown && t._closeFilterDropdown();
            break;
        }
    }, document.addEventListener("keydown", this._onKeydown), T(o, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    }), this;
  }
  p.prototype._handleSort = function(o, t) {
    let n;
    !this.currentSort || this.currentSort.field !== o ? n = "asc" : this.currentSort.direction === "asc" ? n = "desc" : n = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    n ? (this.currentSort = { field: o, direction: n }, t.classList.add(n === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: o,
      direction: n
    }), this._requestData();
  }, p.prototype._requestData = function() {
    T(this.dom, "ln-data-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    });
  }, p.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-row]");
    let t = o.length > 0;
    for (let n = 0; n < o.length; n++) {
      const e = o[n].getAttribute("data-ln-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, Object.defineProperty(p.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), p.prototype._focusRow = function(o) {
    for (let t = 0; t < o.length; t++)
      o[t].classList.remove("ln-row-focused"), o[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < o.length) {
      const t = o[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, p.prototype._openFilterDropdown = function(o, t, n) {
    this._closeFilterDropdown();
    const e = at(this.dom, this.name + "-column-filter", "ln-data-table") || at(this.dom, "column-filter", "ln-data-table");
    if (!e) return;
    const r = e.firstElementChild;
    if (!r) return;
    const s = this._getUniqueValues(o), c = r.querySelector("[data-ln-filter-options]"), i = r.querySelector("[data-ln-filter-search]"), a = this.currentFilters[o] || [], g = this;
    if (i && s.length <= 8 && i.classList.add("hidden"), c) {
      for (let _ = 0; _ < s.length; _++) {
        const E = s[_], y = document.createElement("li"), A = document.createElement("label"), w = document.createElement("input");
        w.type = "checkbox", w.value = E, w.checked = a.length === 0 || a.indexOf(E) !== -1, A.appendChild(w), A.appendChild(document.createTextNode(" " + E)), y.appendChild(A), c.appendChild(y);
      }
      c.addEventListener("change", function(_) {
        _.target.type === "checkbox" && g._onFilterChange(o, c);
      });
    }
    i && i.addEventListener("input", function() {
      const _ = i.value.toLowerCase(), E = c.querySelectorAll("li");
      for (let y = 0; y < E.length; y++) {
        const A = E[y].textContent.toLowerCase();
        E[y].classList.toggle("hidden", _ && A.indexOf(_) === -1);
      }
    });
    const d = r.querySelector("[data-ln-filter-clear]");
    d && d.addEventListener("click", function() {
      delete g.currentFilters[o], g._closeFilterDropdown(), g._updateFilterIndicators(), T(g.dom, "ln-data-table:filter", {
        table: g.name,
        field: o,
        values: []
      }), g._requestData();
    }), t.appendChild(r), this._activeDropdown = { field: o, th: t, el: r }, r.addEventListener("click", function(_) {
      _.stopPropagation();
    });
  }, p.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, p.prototype._onFilterChange = function(o, t) {
    const n = t.querySelectorAll('input[type="checkbox"]'), e = [];
    let r = !0;
    for (let s = 0; s < n.length; s++)
      n[s].checked ? e.push(n[s].value) : r = !1;
    r || e.length === 0 ? delete this.currentFilters[o] : this.currentFilters[o] = e, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: o,
      values: r ? [] : e
    }), this._requestData();
  }, p.prototype._getUniqueValues = function(o) {
    const t = {}, n = [], e = this._data;
    for (let r = 0; r < e.length; r++) {
      const s = e[r][o];
      s != null && !t[s] && (t[s] = !0, n.push(String(s)));
    }
    return n.sort(), n;
  }, p.prototype._updateFilterIndicators = function() {
    const o = this.ths;
    for (let t = 0; t < o.length; t++) {
      const n = o[t], e = n.getAttribute("data-ln-col");
      if (!e) continue;
      const r = n.querySelector("[data-ln-col-filter]");
      if (!r) continue;
      const s = this.currentFilters[e] && this.currentFilters[e].length > 0;
      r.classList.toggle("ln-filter-active", !!s);
    }
  }, p.prototype._renderRows = function() {
    if (!this.tbody) return;
    const o = this._data, t = this._lastTotal, n = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (o.length === 0 || n === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    o.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, p.prototype._renderAll = function() {
    const o = this._data, t = document.createDocumentFragment();
    for (let n = 0; n < o.length; n++) {
      const e = this._buildRow(o[n]);
      if (!e) break;
      t.appendChild(e);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, p.prototype._buildRow = function(o) {
    const t = at(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const n = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!n) return null;
    if (this._fillRow(n, o), n._lnRecord = o, o.id != null && n.setAttribute("data-ln-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      n.classList.add("ln-row-selected");
      const e = n.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return n;
  }, p.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    if (!this._rowHeight) {
      const t = this._buildRow(this._data[0]);
      t && (this.tbody.textContent = "", this.tbody.appendChild(t), this._rowHeight = t.offsetHeight || 40, this.tbody.textContent = "");
    }
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._renderVirtual();
      }));
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, p.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, p.prototype._renderVirtual = function() {
    const o = this._data, t = o.length, n = this._rowHeight;
    if (!n || !t) return;
    const r = this.table.getBoundingClientRect().top + window.scrollY, s = this.thead ? this.thead.offsetHeight : 0, c = r + s, i = window.scrollY - c, a = Math.max(0, Math.floor(i / n) - 15), g = Math.min(a + Math.ceil(window.innerHeight / n) + 30, t);
    if (a === this._vStart && g === this._vEnd) return;
    this._vStart = a, this._vEnd = g;
    const d = this.ths.length || 1, _ = a * n, E = (t - g) * n, y = document.createDocumentFragment();
    if (_ > 0) {
      const A = document.createElement("tr");
      A.className = "ln-data-table__spacer", A.setAttribute("aria-hidden", "true");
      const w = document.createElement("td");
      w.setAttribute("colspan", d), w.style.height = _ + "px", A.appendChild(w), y.appendChild(A);
    }
    for (let A = a; A < g; A++) {
      const w = this._buildRow(o[A]);
      w && y.appendChild(w);
    }
    if (E > 0) {
      const A = document.createElement("tr");
      A.className = "ln-data-table__spacer", A.setAttribute("aria-hidden", "true");
      const w = document.createElement("td");
      w.setAttribute("colspan", d), w.style.height = E + "px", A.appendChild(w), y.appendChild(A);
    }
    this.tbody.textContent = "", this.tbody.appendChild(y), this._selectable && this._updateSelectAll();
  }, p.prototype._fillRow = function(o, t) {
    const n = o.querySelectorAll("[data-ln-cell]");
    for (let r = 0; r < n.length; r++) {
      const s = n[r], c = s.getAttribute("data-ln-cell");
      t[c] != null && (s.textContent = t[c]);
    }
    const e = o.querySelectorAll("[data-ln-cell-attr]");
    for (let r = 0; r < e.length; r++) {
      const s = e[r], c = s.getAttribute("data-ln-cell-attr").split(",");
      for (let i = 0; i < c.length; i++) {
        const a = c[i].trim().split(":");
        if (a.length !== 2) continue;
        const g = a[0].trim(), d = a[1].trim();
        t[g] != null && s.setAttribute(d, t[g]);
      }
    }
  }, p.prototype._showEmptyState = function(o) {
    const t = at(this.dom, o, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, p.prototype._updateFooter = function() {
    const o = this._lastTotal, t = this._lastFiltered, n = t < o;
    if (this._totalSpan && (this._totalSpan.textContent = b(o)), this._filteredSpan && (this._filteredSpan.textContent = n ? b(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !n), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? b(e) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, p.prototype.destroy = function() {
    this.dom[l] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[l]);
  }, V(u, l, p, "ln-data-table");
})();
(function() {
  const u = "ln-icons-sprite", l = "#ln-", v = "#lnc-", m = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  let b = null;
  const p = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", n = "lni:v", e = "1";
  function r() {
    try {
      if (localStorage.getItem(n) !== e) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const E = localStorage.key(_);
          E && E.indexOf(t) === 0 && localStorage.removeItem(E);
        }
        localStorage.setItem(n, e);
      }
    } catch {
    }
  }
  r();
  function s() {
    return b || (b = document.getElementById(u), b || (b = document.createElementNS("http://www.w3.org/2000/svg", "svg"), b.id = u, b.setAttribute("hidden", ""), b.setAttribute("aria-hidden", "true"), b.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(b, document.body.firstChild))), b;
  }
  function c(_) {
    return _.indexOf(v) === 0 ? o + "/" + _.slice(v.length) + ".svg" : p + "/" + _.slice(l.length) + ".svg";
  }
  function i(_, E) {
    const y = E.match(/viewBox="([^"]+)"/), A = y ? y[1] : "0 0 24 24", w = E.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = w ? w[1].trim() : "", k = E.match(/<svg([^>]*)>/i), M = k ? k[1] : "", N = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    N.id = _, N.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const U = M.match(new RegExp(q + '="([^"]*)"'));
      U && N.setAttribute(q, U[1]);
    }), N.innerHTML = C, s().querySelector("defs").appendChild(N);
  }
  function a(_) {
    if (m.has(_) || f.has(_) || _.indexOf(v) === 0 && !o) return;
    const E = _.slice(1);
    try {
      const y = localStorage.getItem(t + E);
      if (y) {
        i(E, y), m.add(_);
        return;
      }
    } catch {
    }
    f.add(_), fetch(c(_)).then(function(y) {
      if (!y.ok) throw new Error(y.status);
      return y.text();
    }).then(function(y) {
      i(E, y), m.add(_), f.delete(_);
      try {
        localStorage.setItem(t + E, y);
      } catch {
      }
    }).catch(function() {
      f.delete(_);
    });
  }
  function g(_) {
    const E = 'use[href^="' + l + '"], use[href^="' + v + '"]', y = _.querySelectorAll ? _.querySelectorAll(E) : [];
    if (_.matches && _.matches(E)) {
      const A = _.getAttribute("href");
      A && a(A);
    }
    Array.prototype.forEach.call(y, function(A) {
      const w = A.getAttribute("href");
      w && a(w);
    });
  }
  function d() {
    g(document), new MutationObserver(function(_) {
      _.forEach(function(E) {
        if (E.type === "childList")
          E.addedNodes.forEach(function(y) {
            y.nodeType === 1 && g(y);
          });
        else if (E.type === "attributes" && E.attributeName === "href") {
          const y = E.target.getAttribute("href");
          y && (y.indexOf(l) === 0 || y.indexOf(v) === 0) && a(y);
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
