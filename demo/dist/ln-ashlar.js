const vt = {};
function yt(f, c) {
  vt[f] || (vt[f] = document.querySelector('[data-ln-template="' + f + '"]'));
  const y = vt[f];
  return y ? y.content.cloneNode(!0) : (console.warn("[" + (c || "ln-core") + '] Template "' + f + '" not found'), null);
}
function T(f, c, y) {
  f.dispatchEvent(new CustomEvent(c, {
    bubbles: !0,
    detail: y || {}
  }));
}
function K(f, c, y) {
  const p = new CustomEvent(c, {
    bubbles: !0,
    cancelable: !0,
    detail: y || {}
  });
  return f.dispatchEvent(p), p;
}
function Z(f, c) {
  if (!f || !c) return f;
  const y = f.querySelectorAll("[data-ln-field]");
  for (let s = 0; s < y.length; s++) {
    const n = y[s], t = n.getAttribute("data-ln-field");
    c[t] != null && (n.textContent = c[t]);
  }
  const p = f.querySelectorAll("[data-ln-attr]");
  for (let s = 0; s < p.length; s++) {
    const n = p[s], t = n.getAttribute("data-ln-attr").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), r = e[1].trim();
      c[r] != null && n.setAttribute(i, c[r]);
    }
  }
  const m = f.querySelectorAll("[data-ln-show]");
  for (let s = 0; s < m.length; s++) {
    const n = m[s], t = n.getAttribute("data-ln-show");
    t in c && n.classList.toggle("hidden", !c[t]);
  }
  const g = f.querySelectorAll("[data-ln-class]");
  for (let s = 0; s < g.length; s++) {
    const n = g[s], t = n.getAttribute("data-ln-class").split(",");
    for (let o = 0; o < t.length; o++) {
      const e = t[o].trim().split(":");
      if (e.length !== 2) continue;
      const i = e[0].trim(), r = e[1].trim();
      r in c && n.classList.toggle(i, !!c[r]);
    }
  }
  return f;
}
function kt(f, c) {
  if (!f || !c) return f;
  const y = document.createTreeWalker(f, NodeFilter.SHOW_TEXT);
  for (; y.nextNode(); ) {
    const p = y.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(m, g) {
        return c[g] !== void 0 ? c[g] : "";
      }
    ));
  }
  return f;
}
function H(f, c) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      H(f, c);
    }), console.warn("[" + c + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  f();
}
function at(f, c, y) {
  if (f) {
    const p = f.querySelector('[data-ln-template="' + c + '"]');
    if (p) return p.content.cloneNode(!0);
  }
  return yt(c, y);
}
function Ot(f, c) {
  const y = {}, p = f.querySelectorAll("[" + c + "]");
  for (let m = 0; m < p.length; m++)
    y[p[m].getAttribute(c)] = p[m].textContent, p[m].remove();
  return y;
}
function z(f, c, y, p) {
  if (f.nodeType !== 1) return;
  const m = Array.from(f.querySelectorAll("[" + c + "]"));
  f.hasAttribute && f.hasAttribute(c) && m.push(f);
  for (const g of m)
    g[y] || (g[y] = new p(g));
}
function ct(f) {
  return !!(f.offsetWidth || f.offsetHeight || f.getClientRects().length);
}
function St(f) {
  const c = {}, y = f.elements;
  for (let p = 0; p < y.length; p++) {
    const m = y[p];
    if (!(!m.name || m.disabled || m.type === "file" || m.type === "submit" || m.type === "button"))
      if (m.type === "checkbox")
        c[m.name] || (c[m.name] = []), m.checked && c[m.name].push(m.value);
      else if (m.type === "radio")
        m.checked && (c[m.name] = m.value);
      else if (m.type === "select-multiple") {
        c[m.name] = [];
        for (let g = 0; g < m.options.length; g++)
          m.options[g].selected && c[m.name].push(m.options[g].value);
      } else
        c[m.name] = m.value;
  }
  return c;
}
function Lt(f, c) {
  const y = f.elements, p = [];
  for (let m = 0; m < y.length; m++) {
    const g = y[m];
    if (!g.name || !(g.name in c) || g.type === "file" || g.type === "submit" || g.type === "button") continue;
    const s = c[g.name];
    if (g.type === "checkbox")
      g.checked = Array.isArray(s) ? s.indexOf(g.value) !== -1 : !!s, p.push(g);
    else if (g.type === "radio")
      g.checked = g.value === String(s), p.push(g);
    else if (g.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < g.options.length; n++)
          g.options[n].selected = s.indexOf(g.options[n].value) !== -1;
      p.push(g);
    } else
      g.value = s, p.push(g);
  }
  return p;
}
function $(f) {
  const c = f.closest("[lang]");
  return (c ? c.lang : null) || navigator.language;
}
function j(f, c, y, p, m = {}) {
  const g = m.extraAttributes || [], s = m.onAttributeChange || null, n = m.onInit || null;
  function t(o) {
    const e = o || document.body;
    z(e, f, c, y), n && n(e);
  }
  return H(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const r = e[i];
        if (r.type === "childList")
          for (let h = 0; h < r.addedNodes.length; h++) {
            const l = r.addedNodes[h];
            l.nodeType === 1 && (z(l, f, c, y), n && n(l));
          }
        else r.type === "attributes" && (s && r.target[c] && r.attributeName === f ? s(r.target, r.attributeName) : (z(r.target, f, c, y), n && n(r.target)));
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [f].concat(g)
    });
  }, p || f.replace("data-", "")), window[c] = t, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body), t;
}
const At = Symbol("deepReactive");
function xt(f, c) {
  function y(p) {
    if (p === null || typeof p != "object" || p[At]) return p;
    const m = Object.keys(p);
    for (let g = 0; g < m.length; g++) {
      const s = p[m[g]];
      s !== null && typeof s == "object" && (p[m[g]] = y(s));
    }
    return new Proxy(p, {
      get(g, s) {
        return s === At ? !0 : g[s];
      },
      set(g, s, n) {
        const t = g[s];
        return n !== null && typeof n == "object" && (n = y(n)), g[s] = n, t !== n && c(), !0;
      },
      deleteProperty(g, s) {
        return s in g && (delete g[s], c()), !0;
      }
    });
  }
  return y(f);
}
function It(f, c) {
  let y = !1;
  return function() {
    y || (y = !0, queueMicrotask(function() {
      y = !1, f(), c && c();
    }));
  };
}
const Rt = "ln:";
function Dt() {
  return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
}
function Tt(f, c) {
  const y = c.getAttribute("data-ln-persist"), p = y !== null && y !== "" ? y : c.id;
  return p ? Rt + f + ":" + Dt() + ":" + p : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', c), null);
}
function mt(f, c) {
  const y = Tt(f, c);
  if (!y) return null;
  try {
    const p = localStorage.getItem(y);
    return p !== null ? JSON.parse(p) : null;
  } catch {
    return null;
  }
}
function tt(f, c, y) {
  const p = Tt(f, c);
  if (p)
    try {
      localStorage.setItem(p, JSON.stringify(y));
    } catch {
    }
}
function Et(f, c, y, p) {
  const m = typeof p == "number" ? p : 4, g = window.innerWidth, s = window.innerHeight, n = c.width, t = c.height, o = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, e = o[y] || o.bottom;
  function i(a) {
    let _, d, b = !0;
    return a === "top" ? (_ = f.top - m - t, d = f.left + (f.width - n) / 2, _ < 0 && (b = !1)) : a === "bottom" ? (_ = f.bottom + m, d = f.left + (f.width - n) / 2, _ + t > s && (b = !1)) : a === "left" ? (_ = f.top + (f.height - t) / 2, d = f.left - m - n, d < 0 && (b = !1)) : (_ = f.top + (f.height - t) / 2, d = f.right + m, d + n > g && (b = !1)), { top: _, left: d, side: a, fits: b };
  }
  let r = null;
  for (let a = 0; a < e.length; a++) {
    const _ = i(e[a]);
    if (_.fits) {
      r = _;
      break;
    }
  }
  r || (r = i(e[0]));
  let h = r.top, l = r.left;
  return n >= g ? l = 0 : (l < 0 && (l = 0), l + n > g && (l = g - n)), t >= s ? h = 0 : (h < 0 && (h = 0), h + t > s && (h = s - t)), { top: h, left: l, placement: r.side };
}
function qt(f) {
  if (!f || f.parentNode === document.body)
    return function() {
    };
  const c = f.parentNode, y = document.createComment("ln-teleport");
  return c.insertBefore(y, f), document.body.appendChild(f), function() {
    y.parentNode && (y.parentNode.insertBefore(f, y), y.parentNode.removeChild(y));
  };
}
function wt(f) {
  if (!f) return { width: 0, height: 0 };
  const c = f.style, y = c.visibility, p = c.display, m = c.position;
  c.visibility = "hidden", c.display = "block", c.position = "fixed";
  const g = f.offsetWidth, s = f.offsetHeight;
  return c.visibility = y, c.display = p, c.position = m, { width: g, height: s };
}
(function() {
  const f = "lnHttp";
  if (window[f] !== void 0) return;
  const c = {};
  document.addEventListener("ln-http:request", function(y) {
    const p = y.detail || {};
    if (!p.url) return;
    const m = y.target, g = (p.method || (p.body ? "POST" : "GET")).toUpperCase(), s = p.abort, n = p.tag;
    let t = p.url;
    s && (c[s] && c[s].abort(), c[s] = new AbortController());
    const o = { Accept: "application/json" };
    p.ajax && (o["X-Requested-With"] = "XMLHttpRequest");
    const e = {
      method: g,
      credentials: "same-origin",
      headers: o
    };
    if (s && (e.signal = c[s].signal), p.body && g === "GET") {
      const i = new URLSearchParams();
      for (const h in p.body)
        p.body[h] != null && i.set(h, p.body[h]);
      const r = i.toString();
      r && (t += (t.includes("?") ? "&" : "?") + r);
    } else p.body && (o["Content-Type"] = "application/json", e.body = JSON.stringify(p.body));
    fetch(t, e).then(function(i) {
      s && delete c[s];
      const r = i.ok, h = i.status;
      return i.json().then(function(l) {
        return { ok: r, status: h, data: l };
      }).catch(function() {
        return { ok: !1, status: h, data: { error: !0, message: "Invalid response" } };
      });
    }).then(function(i) {
      i.tag = n;
      const r = i.ok ? "ln-http:success" : "ln-http:error";
      T(m, r, i);
    }).catch(function(i) {
      s && i.name !== "AbortError" && delete c[s], i.name !== "AbortError" && T(m, "ln-http:error", { tag: n, ok: !1, status: 0, data: { error: !0, message: "Network error" } });
    });
  }), window[f] = !0;
})();
(function() {
  const f = "data-ln-ajax", c = "lnAjax";
  if (window[c] !== void 0) return;
  function y(e) {
    if (!e.hasAttribute(f) || e[c]) return;
    e[c] = !0;
    const i = n(e);
    p(i.links), m(i.forms);
  }
  function p(e) {
    for (const i of e) {
      if (i[c + "Trigger"] || i.hostname && i.hostname !== window.location.hostname) continue;
      const r = i.getAttribute("href");
      if (r && r.includes("#")) continue;
      const h = function(l) {
        if (l.ctrlKey || l.metaKey || l.button === 1) return;
        l.preventDefault();
        const a = i.getAttribute("href");
        a && s("GET", a, null, i);
      };
      i.addEventListener("click", h), i[c + "Trigger"] = h;
    }
  }
  function m(e) {
    for (const i of e) {
      if (i[c + "Trigger"]) continue;
      const r = function(h) {
        h.preventDefault();
        const l = i.method.toUpperCase(), a = i.action, _ = new FormData(i);
        for (const d of i.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        s(l, a, _, i, function() {
          for (const d of i.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      i.addEventListener("submit", r), i[c + "Trigger"] = r;
    }
  }
  function g(e) {
    if (!e[c]) return;
    const i = n(e);
    for (const r of i.links)
      r[c + "Trigger"] && (r.removeEventListener("click", r[c + "Trigger"]), delete r[c + "Trigger"]);
    for (const r of i.forms)
      r[c + "Trigger"] && (r.removeEventListener("submit", r[c + "Trigger"]), delete r[c + "Trigger"]);
    delete e[c];
  }
  function s(e, i, r, h, l) {
    if (K(h, "ln-ajax:before-start", { method: e, url: i }).defaultPrevented) return;
    T(h, "ln-ajax:start", { method: e, url: i }), h.classList.add("ln-ajax--loading");
    const _ = document.createElement("span");
    _.className = "ln-ajax-spinner", h.appendChild(_);
    function d() {
      h.classList.remove("ln-ajax--loading");
      const A = h.querySelector(".ln-ajax-spinner");
      A && A.remove(), l && l();
    }
    let b = i;
    const E = document.querySelector('meta[name="csrf-token"]'), v = E ? E.getAttribute("content") : null;
    r instanceof FormData && v && r.append("_token", v);
    const w = {
      method: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (v && (w.headers["X-CSRF-TOKEN"] = v), e === "GET" && r) {
      const A = new URLSearchParams(r);
      b = i + (i.includes("?") ? "&" : "?") + A.toString();
    } else e !== "GET" && r && (w.body = r);
    fetch(b, w).then(function(A) {
      const C = A.ok;
      return A.json().then(function(k) {
        return { ok: C, status: A.status, data: k };
      });
    }).then(function(A) {
      const C = A.data;
      if (A.ok) {
        if (C.title && (document.title = C.title), C.content)
          for (const k in C.content) {
            const D = document.getElementById(k);
            D && (D.innerHTML = C.content[k]);
          }
        if (h.tagName === "A") {
          const k = h.getAttribute("href");
          k && window.history.pushState({ ajax: !0 }, "", k);
        } else h.tagName === "FORM" && h.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", b);
        T(h, "ln-ajax:success", { method: e, url: b, data: C });
      } else
        T(h, "ln-ajax:error", { method: e, url: b, status: A.status, data: C });
      if (C.message && window.lnToast) {
        const k = C.message;
        window.lnToast.enqueue({
          type: k.type || (A.ok ? "success" : "error"),
          title: k.title || "",
          message: k.body || ""
        });
      }
      T(h, "ln-ajax:complete", { method: e, url: b }), d();
    }).catch(function(A) {
      T(h, "ln-ajax:error", { method: e, url: b, error: A }), T(h, "ln-ajax:complete", { method: e, url: b }), d();
    });
  }
  function n(e) {
    const i = { links: [], forms: [] };
    return e.tagName === "A" && e.getAttribute(f) !== "false" ? i.links.push(e) : e.tagName === "FORM" && e.getAttribute(f) !== "false" ? i.forms.push(e) : (i.links = Array.from(e.querySelectorAll('a:not([data-ln-ajax="false"])')), i.forms = Array.from(e.querySelectorAll('form:not([data-ln-ajax="false"])'))), i;
  }
  function t() {
    H(function() {
      new MutationObserver(function(i) {
        for (const r of i)
          if (r.type === "childList") {
            for (const h of r.addedNodes)
              if (h.nodeType === 1 && (y(h), !h.hasAttribute(f))) {
                for (const a of h.querySelectorAll("[" + f + "]"))
                  y(a);
                const l = h.closest && h.closest("[" + f + "]");
                if (l && l.getAttribute(f) !== "false") {
                  const a = n(h);
                  p(a.links), m(a.forms);
                }
              }
          } else r.type === "attributes" && y(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-ajax");
  }
  function o() {
    for (const e of document.querySelectorAll("[" + f + "]"))
      y(e);
  }
  window[c] = y, window[c].destroy = g, t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const f = "data-ln-modal", c = "lnModal";
  if (window[c] !== void 0) return;
  function y(s) {
    const n = Array.from(s.querySelectorAll("[data-ln-modal-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-modal-for") && n.push(s);
    for (const t of n) {
      if (t[c + "Trigger"]) continue;
      const o = function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        const i = t.getAttribute("data-ln-modal-for"), r = document.getElementById(i);
        !r || !r[c] || r[c].toggle();
      };
      t.addEventListener("click", o), t[c + "Trigger"] = o;
    }
  }
  function p(s) {
    this.dom = s, this.isOpen = s.getAttribute(f) === "open";
    const n = this;
    return this._onEscape = function(t) {
      t.key === "Escape" && n.close();
    }, this._onFocusTrap = function(t) {
      if (t.key !== "Tab") return;
      const o = Array.prototype.filter.call(
        n.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        ct
      );
      if (o.length === 0) return;
      const e = o[0], i = o[o.length - 1];
      t.shiftKey ? document.activeElement === e && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), e.focus());
    }, this._onClose = function(t) {
      t.preventDefault(), n.close();
    }, g(this), this.isOpen && (this.dom.setAttribute("aria-modal", "true"), this.dom.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", this._onEscape), document.addEventListener("keydown", this._onFocusTrap)), this;
  }
  p.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(f, "open");
  }, p.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "close");
  }, p.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.isOpen && (this.dom.removeAttribute("aria-modal"), document.removeEventListener("keydown", this._onEscape), document.removeEventListener("keydown", this._onFocusTrap), document.querySelector("[" + f + '="open"]') || document.body.classList.remove("ln-modal-open"));
    const s = this.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of s)
      t[c + "Close"] && (t.removeEventListener("click", t[c + "Close"]), delete t[c + "Close"]);
    const n = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
    for (const t of n)
      t[c + "Trigger"] && (t.removeEventListener("click", t[c + "Trigger"]), delete t[c + "Trigger"]);
    T(this.dom, "ln-modal:destroyed", { modalId: this.dom.id, target: this.dom }), delete this.dom[c];
  };
  function m(s) {
    const n = s[c];
    if (!n) return;
    const o = s.getAttribute(f) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (K(s, "ln-modal:before-open", { modalId: s.id, target: s }).defaultPrevented) {
          s.setAttribute(f, "close");
          return;
        }
        n.isOpen = !0, s.setAttribute("aria-modal", "true"), s.setAttribute("role", "dialog"), document.body.classList.add("ln-modal-open"), document.addEventListener("keydown", n._onEscape), document.addEventListener("keydown", n._onFocusTrap);
        const i = s.querySelector("[autofocus]");
        if (i && ct(i))
          i.focus();
        else {
          const r = s.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), h = Array.prototype.find.call(r, ct);
          if (h) h.focus();
          else {
            const l = s.querySelectorAll("a[href], button:not([disabled])"), a = Array.prototype.find.call(l, ct);
            a && a.focus();
          }
        }
        T(s, "ln-modal:open", { modalId: s.id, target: s });
      } else {
        if (K(s, "ln-modal:before-close", { modalId: s.id, target: s }).defaultPrevented) {
          s.setAttribute(f, "open");
          return;
        }
        n.isOpen = !1, s.removeAttribute("aria-modal"), document.removeEventListener("keydown", n._onEscape), document.removeEventListener("keydown", n._onFocusTrap), T(s, "ln-modal:close", { modalId: s.id, target: s }), document.querySelector("[" + f + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  function g(s) {
    const n = s.dom.querySelectorAll("[data-ln-modal-close]");
    for (const t of n)
      t[c + "Close"] || (t.addEventListener("click", s._onClose), t[c + "Close"] = s._onClose);
  }
  j(f, c, p, "ln-modal", {
    extraAttributes: ["data-ln-modal-for"],
    onAttributeChange: m,
    onInit: y
  });
})();
(function() {
  const f = "data-ln-number", c = "lnNumber";
  if (window[c] !== void 0) return;
  const y = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(t) {
    if (!y[t]) {
      const o = new Intl.NumberFormat(t, { useGrouping: !0 }), e = o.formatToParts(1234.5);
      let i = "", r = ".";
      for (let h = 0; h < e.length; h++)
        e[h].type === "group" && (i = e[h].value), e[h].type === "decimal" && (r = e[h].value);
      y[t] = { fmt: o, groupSep: i, decimalSep: r };
    }
    return y[t];
  }
  function g(t, o, e) {
    if (e !== null) {
      const i = parseInt(e, 10), r = t + "|d" + i;
      return y[r] || (y[r] = new Intl.NumberFormat(t, { useGrouping: !0, minimumFractionDigits: 0, maximumFractionDigits: i })), y[r].format(o);
    }
    return m(t).fmt.format(o);
  }
  function s(t) {
    if (t.tagName !== "INPUT")
      return console.warn("[ln-number] Can only be applied to <input>, got:", t.tagName), this;
    this.dom = t;
    const o = document.createElement("input");
    o.type = "hidden", o.name = t.name, t.removeAttribute("name"), t.type = "text", t.setAttribute("inputmode", "decimal"), t.insertAdjacentElement("afterend", o), this._hidden = o;
    const e = this;
    Object.defineProperty(o, "value", {
      get: function() {
        return p.get.call(o);
      },
      set: function(r) {
        p.set.call(o, r), r !== "" && !isNaN(parseFloat(r)) ? e._displayFormatted(parseFloat(r)) : r === "" && (e.dom.value = "");
      }
    }), this._onInput = function() {
      e._handleInput();
    }, t.addEventListener("input", this._onInput), this._onPaste = function(r) {
      r.preventDefault();
      const h = (r.clipboardData || window.clipboardData).getData("text"), l = m($(t)), a = l.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let _ = h.replace(new RegExp("[^0-9\\-" + a + ".]", "g"), "");
      l.groupSep && (_ = _.split(l.groupSep).join("")), l.decimalSep !== "." && (_ = _.replace(l.decimalSep, "."));
      const d = parseFloat(_);
      isNaN(d) ? (t.value = "", e._hidden.value = "") : e.value = d;
    }, t.addEventListener("paste", this._onPaste);
    const i = t.value;
    if (i !== "") {
      const r = parseFloat(i);
      isNaN(r) || (this._displayFormatted(r), p.set.call(o, String(r)));
    }
    return this;
  }
  s.prototype._handleInput = function() {
    const t = this.dom, o = m($(t)), e = t.value;
    if (e === "") {
      this._hidden.value = "", T(t, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (e === "-") {
      this._hidden.value = "";
      return;
    }
    const i = t.selectionStart;
    let r = 0;
    for (let A = 0; A < i; A++)
      /[0-9]/.test(e[A]) && r++;
    let h = e;
    if (o.groupSep && (h = h.split(o.groupSep).join("")), h = h.replace(o.decimalSep, "."), e.endsWith(o.decimalSep) || e.endsWith(".")) {
      const A = h.replace(/\.$/, ""), C = parseFloat(A);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const l = h.indexOf(".");
    if (l !== -1 && h.slice(l + 1).endsWith("0")) {
      const C = parseFloat(h);
      isNaN(C) || this._setHiddenRaw(C);
      return;
    }
    const a = t.getAttribute("data-ln-number-decimals");
    if (a !== null && l !== -1) {
      const A = parseInt(a, 10);
      h.slice(l + 1).length > A && (h = h.slice(0, l + 1 + A));
    }
    const _ = parseFloat(h);
    if (isNaN(_)) return;
    const d = t.getAttribute("data-ln-number-min"), b = t.getAttribute("data-ln-number-max");
    if (d !== null && _ < parseFloat(d) || b !== null && _ > parseFloat(b)) return;
    let E;
    if (a !== null)
      E = g($(t), _, a);
    else {
      const A = l !== -1 ? h.slice(l + 1).length : 0;
      if (A > 0) {
        const C = $(t) + "|u" + A;
        y[C] || (y[C] = new Intl.NumberFormat($(t), { useGrouping: !0, minimumFractionDigits: A, maximumFractionDigits: A })), E = y[C].format(_);
      } else
        E = o.fmt.format(_);
    }
    t.value = E;
    let v = r, w = 0;
    for (let A = 0; A < E.length && v > 0; A++)
      w = A + 1, /[0-9]/.test(E[A]) && v--;
    v > 0 && (w = E.length), t.setSelectionRange(w, w), this._setHiddenRaw(_), T(t, "ln-number:input", { value: _, formatted: E });
  }, s.prototype._setHiddenRaw = function(t) {
    p.set.call(this._hidden, String(t));
  }, s.prototype._displayFormatted = function(t) {
    this.dom.value = g($(this.dom), t, this.dom.getAttribute("data-ln-number-decimals"));
  }, Object.defineProperty(s.prototype, "value", {
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
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), s.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("paste", this._onPaste), this.dom.name = this._hidden.name, this.dom.type = "number", this.dom.removeAttribute("inputmode"), this._hidden.remove(), T(this.dom, "ln-number:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function n() {
    new MutationObserver(function() {
      const t = document.querySelectorAll("[" + f + "]");
      for (let o = 0; o < t.length; o++) {
        const e = t[o][c];
        e && !isNaN(e.value) && e._displayFormatted(e.value);
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  j(f, c, s, "ln-number"), n();
})();
(function() {
  const f = "data-ln-date", c = "lnDate";
  if (window[c] !== void 0) return;
  const y = {}, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(l, a) {
    const _ = l + "|" + JSON.stringify(a);
    return y[_] || (y[_] = new Intl.DateTimeFormat(l, a)), y[_];
  }
  const g = /^(short|medium|long)(\s+datetime)?$/, s = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    "short datetime": { dateStyle: "short", timeStyle: "short" },
    "medium datetime": { dateStyle: "medium", timeStyle: "short" },
    "long datetime": { dateStyle: "long", timeStyle: "short" }
  };
  function n(l) {
    return !l || l === "" ? { dateStyle: "medium" } : l.match(g) ? s[l] : null;
  }
  function t(l, a, _) {
    const d = l.getDate(), b = l.getMonth(), E = l.getFullYear(), v = l.getHours(), w = l.getMinutes(), A = {
      yyyy: String(E),
      yy: String(E).slice(-2),
      MMMM: m(_, { month: "long" }).format(l),
      MMM: m(_, { month: "short" }).format(l),
      MM: String(b + 1).padStart(2, "0"),
      M: String(b + 1),
      dd: String(d).padStart(2, "0"),
      d: String(d),
      HH: String(v).padStart(2, "0"),
      mm: String(w).padStart(2, "0")
    };
    return a.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(C) {
      return A[C];
    });
  }
  function o(l, a, _) {
    const d = n(a);
    return d ? m(_, d).format(l) : t(l, a, _);
  }
  function e(l) {
    if (l.tagName !== "INPUT")
      return console.warn("[ln-date] Can only be applied to <input>, got:", l.tagName), this;
    this.dom = l;
    const a = this, _ = l.value, d = l.name, b = document.createElement("input");
    b.type = "hidden", b.name = d, l.removeAttribute("name"), l.insertAdjacentElement("afterend", b), this._hidden = b;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", b.insertAdjacentElement("afterend", E), this._picker = E, l.type = "text";
    const v = document.createElement("button");
    if (v.type = "button", v.setAttribute("aria-label", "Open date picker"), v.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>', E.insertAdjacentElement("afterend", v), this._btn = v, this._lastISO = "", Object.defineProperty(b, "value", {
      get: function() {
        return p.get.call(b);
      },
      set: function(w) {
        if (p.set.call(b, w), w && w !== "") {
          const A = i(w);
          A && (a._displayFormatted(A), p.set.call(E, w));
        } else w === "" && (a.dom.value = "", p.set.call(E, ""));
      }
    }), this._onPickerChange = function() {
      const w = E.value;
      if (w) {
        const A = i(w);
        A && (a._setHiddenRaw(w), a._displayFormatted(A), a._lastISO = w, T(a.dom, "ln-date:change", {
          value: w,
          formatted: a.dom.value,
          date: A
        }));
      } else
        a._setHiddenRaw(""), a.dom.value = "", a._lastISO = "", T(a.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        });
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const w = a.dom.value.trim();
      if (w === "") {
        a._lastISO !== "" && (a._setHiddenRaw(""), p.set.call(a._picker, ""), a.dom.value = "", a._lastISO = "", T(a.dom, "ln-date:change", {
          value: "",
          formatted: "",
          date: null
        }));
        return;
      }
      if (a._lastISO) {
        const C = i(a._lastISO);
        if (C) {
          const k = a.dom.getAttribute(f) || "", D = $(a.dom), N = o(C, k, D);
          if (w === N) return;
        }
      }
      const A = r(w);
      if (A) {
        const C = A.getFullYear(), k = String(A.getMonth() + 1).padStart(2, "0"), D = String(A.getDate()).padStart(2, "0"), N = C + "-" + k + "-" + D;
        a._setHiddenRaw(N), p.set.call(a._picker, N), a._displayFormatted(A), a._lastISO = N, T(a.dom, "ln-date:change", {
          value: N,
          formatted: a.dom.value,
          date: A
        });
      } else if (a._lastISO) {
        const C = i(a._lastISO);
        C && a._displayFormatted(C);
      } else
        a.dom.value = "";
    }, l.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      a._openPicker();
    }, v.addEventListener("click", this._onBtnClick), _ && _ !== "") {
      const w = i(_);
      w && (this._setHiddenRaw(_), p.set.call(E, _), this._displayFormatted(w), this._lastISO = _);
    }
    return this;
  }
  function i(l) {
    if (!l || typeof l != "string") return null;
    const a = l.split("T"), _ = a[0].split("-");
    if (_.length < 3) return null;
    const d = parseInt(_[0], 10), b = parseInt(_[1], 10) - 1, E = parseInt(_[2], 10);
    if (isNaN(d) || isNaN(b) || isNaN(E)) return null;
    let v = 0, w = 0;
    if (a[1]) {
      const C = a[1].split(":");
      v = parseInt(C[0], 10) || 0, w = parseInt(C[1], 10) || 0;
    }
    const A = new Date(d, b, E, v, w);
    return A.getFullYear() !== d || A.getMonth() !== b || A.getDate() !== E ? null : A;
  }
  function r(l) {
    if (!l || typeof l != "string" || (l = l.trim(), l.length < 6)) return null;
    let a, _;
    if (l.indexOf(".") !== -1)
      a = ".", _ = l.split(".");
    else if (l.indexOf("/") !== -1)
      a = "/", _ = l.split("/");
    else if (l.indexOf("-") !== -1)
      a = "-", _ = l.split("-");
    else
      return null;
    if (_.length !== 3) return null;
    const d = [];
    for (let A = 0; A < 3; A++) {
      const C = parseInt(_[A], 10);
      if (isNaN(C)) return null;
      d.push(C);
    }
    let b, E, v;
    a === "." ? (b = d[0], E = d[1], v = d[2]) : a === "/" ? (E = d[0], b = d[1], v = d[2]) : _[0].length === 4 ? (v = d[0], E = d[1], b = d[2]) : (b = d[0], E = d[1], v = d[2]), v < 100 && (v += v < 50 ? 2e3 : 1900);
    const w = new Date(v, E - 1, b);
    return w.getFullYear() !== v || w.getMonth() !== E - 1 || w.getDate() !== b ? null : w;
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
  }, e.prototype._setHiddenRaw = function(l) {
    p.set.call(this._hidden, l);
  }, e.prototype._displayFormatted = function(l) {
    const a = this.dom.getAttribute(f) || "", _ = $(this.dom);
    this.dom.value = o(l, a, _);
  }, Object.defineProperty(e.prototype, "value", {
    get: function() {
      return p.get.call(this._hidden);
    },
    set: function(l) {
      if (!l || l === "") {
        this._setHiddenRaw(""), p.set.call(this._picker, ""), this.dom.value = "", this._lastISO = "";
        return;
      }
      const a = i(l);
      a && (this._setHiddenRaw(l), p.set.call(this._picker, l), this._displayFormatted(a), this._lastISO = l, T(this.dom, "ln-date:change", {
        value: l,
        formatted: this.dom.value,
        date: a
      }));
    }
  }), Object.defineProperty(e.prototype, "date", {
    get: function() {
      const l = this.value;
      return l ? i(l) : null;
    },
    set: function(l) {
      if (!l || !(l instanceof Date) || isNaN(l.getTime())) {
        this.value = "";
        return;
      }
      const a = l.getFullYear(), _ = String(l.getMonth() + 1).padStart(2, "0"), d = String(l.getDate()).padStart(2, "0");
      this.value = a + "-" + _ + "-" + d;
    }
  }), Object.defineProperty(e.prototype, "formatted", {
    get: function() {
      return this.dom.value;
    }
  }), e.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick), this.dom.name = this._hidden.name, this.dom.type = "date";
    const l = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), l && (this.dom.value = l), T(this.dom, "ln-date:destroyed", { target: this.dom }), delete this.dom[c];
  };
  function h() {
    new MutationObserver(function() {
      const l = document.querySelectorAll("[" + f + "]");
      for (let a = 0; a < l.length; a++) {
        const _ = l[a][c];
        if (_ && _.value) {
          const d = i(_.value);
          d && _._displayFormatted(d);
        }
      }
    }).observe(document.documentElement, { attributes: !0, attributeFilter: ["lang"] });
  }
  j(f, c, e, "ln-date"), h();
})();
(function() {
  const f = "data-ln-nav", c = "lnNav";
  if (window[c] !== void 0) return;
  const y = /* @__PURE__ */ new WeakMap(), p = [];
  if (!history._lnNavPatched) {
    const e = history.pushState;
    history.pushState = function() {
      e.apply(history, arguments);
      for (const i of p)
        i();
    }, history._lnNavPatched = !0;
  }
  function m(e) {
    if (!e.hasAttribute(f) || y.has(e)) return;
    const i = e.getAttribute(f);
    if (!i) return;
    const r = g(e, i);
    y.set(e, r), e[c] = r;
  }
  function g(e, i) {
    let r = Array.from(e.querySelectorAll("a"));
    n(r, i, window.location.pathname);
    const h = function() {
      r = Array.from(e.querySelectorAll("a")), n(r, i, window.location.pathname);
    };
    window.addEventListener("popstate", h), p.push(h);
    const l = new MutationObserver(function(a) {
      for (const _ of a)
        if (_.type === "childList") {
          for (const d of _.addedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                r.push(d), n([d], i, window.location.pathname);
              else if (d.querySelectorAll) {
                const b = Array.from(d.querySelectorAll("a"));
                r = r.concat(b), n(b, i, window.location.pathname);
              }
            }
          for (const d of _.removedNodes)
            if (d.nodeType === 1) {
              if (d.tagName === "A")
                r = r.filter(function(b) {
                  return b !== d;
                });
              else if (d.querySelectorAll) {
                const b = Array.from(d.querySelectorAll("a"));
                r = r.filter(function(E) {
                  return !b.includes(E);
                });
              }
            }
        }
    });
    return l.observe(e, { childList: !0, subtree: !0 }), {
      navElement: e,
      activeClass: i,
      observer: l,
      updateHandler: h,
      destroy: function() {
        l.disconnect(), window.removeEventListener("popstate", h);
        const a = p.indexOf(h);
        a !== -1 && p.splice(a, 1), y.delete(e), delete e[c];
      }
    };
  }
  function s(e) {
    try {
      return new URL(e, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return e.replace(/\/$/, "") || "/";
    }
  }
  function n(e, i, r) {
    const h = s(r);
    for (const l of e) {
      const a = l.getAttribute("href");
      if (!a) continue;
      const _ = s(a);
      l.classList.remove(i);
      const d = _ === h, b = _ !== "/" && h.startsWith(_ + "/");
      (d || b) && l.classList.add(i);
    }
  }
  function t() {
    H(function() {
      new MutationObserver(function(i) {
        for (const r of i)
          if (r.type === "childList") {
            for (const h of r.addedNodes)
              if (h.nodeType === 1 && (h.hasAttribute && h.hasAttribute(f) && m(h), h.querySelectorAll))
                for (const l of h.querySelectorAll("[" + f + "]"))
                  m(l);
          } else r.type === "attributes" && r.target.hasAttribute && r.target.hasAttribute(f) && m(r.target);
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] });
    }, "ln-nav");
  }
  window[c] = m;
  function o() {
    for (const e of document.querySelectorAll("[" + f + "]"))
      m(e);
  }
  t(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
(function() {
  const f = window.TomSelect;
  if (!f) {
    console.warn("[ln-select] TomSelect not found. Load TomSelect before ln-ashlar."), window.lnSelect = { initialize: function() {
    }, destroy: function() {
    }, getInstance: function() {
      return null;
    } };
    return;
  }
  const c = /* @__PURE__ */ new WeakMap();
  function y(s) {
    if (c.has(s)) return;
    const n = s.getAttribute("data-ln-select");
    let t = {};
    if (n && n.trim() !== "")
      try {
        t = JSON.parse(n);
      } catch (i) {
        console.warn("[ln-select] Invalid JSON in data-ln-select attribute:", i);
      }
    const e = { ...{
      allowEmptyOption: !0,
      controlInput: null,
      create: !1,
      highlight: !0,
      closeAfterSelect: !0,
      placeholder: s.getAttribute("placeholder") || "Select...",
      loadThrottle: 300
    }, ...t };
    try {
      const i = new f(s, e);
      c.set(s, i);
      const r = s.closest("form");
      if (r) {
        const h = () => {
          setTimeout(() => {
            i.clear(), i.clearOptions(), i.sync();
          }, 0);
        };
        r.addEventListener("reset", h), i._lnResetHandler = h, i._lnResetForm = r;
      }
    } catch (i) {
      console.warn("[ln-select] Failed to initialize Tom Select:", i);
    }
  }
  function p(s) {
    const n = c.get(s);
    n && (n._lnResetForm && n._lnResetHandler && n._lnResetForm.removeEventListener("reset", n._lnResetHandler), n.destroy(), c.delete(s));
  }
  function m() {
    for (const s of document.querySelectorAll("select[data-ln-select]"))
      y(s);
  }
  function g() {
    H(function() {
      new MutationObserver(function(n) {
        for (const t of n) {
          if (t.type === "attributes") {
            t.target.matches && t.target.matches("select[data-ln-select]") && y(t.target);
            continue;
          }
          for (const o of t.addedNodes)
            if (o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && y(o), o.querySelectorAll))
              for (const e of o.querySelectorAll("select[data-ln-select]"))
                y(e);
          for (const o of t.removedNodes)
            if (o.nodeType === 1 && (o.matches && o.matches("select[data-ln-select]") && p(o), o.querySelectorAll))
              for (const e of o.querySelectorAll("select[data-ln-select]"))
                p(e);
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
    m(), g();
  }) : (m(), g()), window.lnSelect = {
    initialize: y,
    destroy: p,
    getInstance: function(s) {
      return c.get(s);
    }
  };
})();
(function() {
  const f = "data-ln-tabs", c = "lnTabs";
  if (window[c] !== void 0 && window[c] !== null) return;
  function y() {
    const g = (location.hash || "").replace("#", ""), s = {};
    if (!g) return s;
    for (const n of g.split("&")) {
      const t = n.indexOf(":");
      t > 0 && (s[n.slice(0, t)] = n.slice(t + 1));
    }
    return s;
  }
  function p(g) {
    return this.dom = g, m.call(this), this;
  }
  function m() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]")), this.mapTabs = {}, this.mapPanels = {};
    for (const s of this.tabs) {
      const n = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
      n && (this.mapTabs[n] = s);
    }
    for (const s of this.panels) {
      const n = (s.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      n && (this.mapPanels[n] = s);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "", this.autoFocus = (this.dom.getAttribute("data-ln-tabs-focus") || "true").toLowerCase() !== "false", this.nsKey = (this.dom.getAttribute("data-ln-tabs-key") || this.dom.id || "").toLowerCase().trim(), this.hashEnabled = !!this.nsKey;
    const g = this;
    this._clickHandlers = [];
    for (const s of this.tabs) {
      if (s[c + "Trigger"]) continue;
      const n = function(t) {
        if (t.ctrlKey || t.metaKey || t.button === 1) return;
        const o = (s.getAttribute("data-ln-tab") || "").toLowerCase().trim();
        if (o)
          if (g.hashEnabled) {
            const e = y();
            e[g.nsKey] = o;
            const i = Object.keys(e).map(function(r) {
              return r + ":" + e[r];
            }).join("&");
            location.hash === "#" + i ? g.dom.setAttribute("data-ln-tabs-active", o) : location.hash = i;
          } else
            g.dom.setAttribute("data-ln-tabs-active", o);
      };
      s.addEventListener("click", n), s[c + "Trigger"] = n, g._clickHandlers.push({ el: s, handler: n });
    }
    if (this._hashHandler = function() {
      if (!g.hashEnabled) return;
      const s = y();
      g.activate(g.nsKey in s ? s[g.nsKey] : g.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      let s = this.defaultKey;
      if (this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled) {
        const n = mt("tabs", this.dom);
        n !== null && n in this.mapPanels && (s = n);
      }
      this.activate(s);
    }
  }
  p.prototype.activate = function(g) {
    (!g || !(g in this.mapPanels)) && (g = this.defaultKey), this.dom.setAttribute("data-ln-tabs-active", g);
  }, p.prototype._applyActive = function(g) {
    var s;
    (!g || !(g in this.mapPanels)) && (g = this.defaultKey);
    for (const n in this.mapTabs) {
      const t = this.mapTabs[n];
      n === g ? (t.setAttribute("data-active", ""), t.setAttribute("aria-selected", "true")) : (t.removeAttribute("data-active"), t.setAttribute("aria-selected", "false"));
    }
    for (const n in this.mapPanels) {
      const t = this.mapPanels[n], o = n === g;
      t.classList.toggle("hidden", !o), t.setAttribute("aria-hidden", o ? "false" : "true");
    }
    if (this.autoFocus) {
      const n = (s = this.mapPanels[g]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      n && setTimeout(() => n.focus({ preventScroll: !0 }), 0);
    }
    T(this.dom, "ln-tabs:change", { key: g, tab: this.mapTabs[g], panel: this.mapPanels[g] }), this.dom.hasAttribute("data-ln-persist") && !this.hashEnabled && tt("tabs", this.dom, g);
  }, p.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const { el: g, handler: s } of this._clickHandlers)
        g.removeEventListener("click", s), delete g[c + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), T(this.dom, "ln-tabs:destroyed", { target: this.dom }), delete this.dom[c];
    }
  }, j(f, c, p, "ln-tabs", {
    extraAttributes: ["data-ln-tabs-active"],
    onAttributeChange: function(g) {
      const s = g.getAttribute("data-ln-tabs-active");
      g[c]._applyActive(s);
    }
  });
})();
(function() {
  const f = "data-ln-toggle", c = "lnToggle";
  if (window[c] !== void 0) return;
  function y(s) {
    const n = Array.from(s.querySelectorAll("[data-ln-toggle-for]"));
    s.hasAttribute && s.hasAttribute("data-ln-toggle-for") && n.push(s);
    for (const t of n) {
      if (t[c + "Trigger"]) continue;
      const o = function(r) {
        if (r.ctrlKey || r.metaKey || r.button === 1) return;
        r.preventDefault();
        const h = t.getAttribute("data-ln-toggle-for"), l = document.getElementById(h);
        if (!l || !l[c]) return;
        const a = t.getAttribute("data-ln-toggle-action") || "toggle";
        l[c][a]();
      };
      t.addEventListener("click", o), t[c + "Trigger"] = o;
      const e = t.getAttribute("data-ln-toggle-for"), i = document.getElementById(e);
      i && i[c] && t.setAttribute("aria-expanded", i[c].isOpen ? "true" : "false");
    }
  }
  function p(s, n) {
    const t = document.querySelectorAll(
      '[data-ln-toggle-for="' + s.id + '"]'
    );
    for (const o of t)
      o.setAttribute("aria-expanded", n ? "true" : "false");
  }
  function m(s) {
    if (this.dom = s, s.hasAttribute("data-ln-persist")) {
      const n = mt("toggle", s);
      n !== null && s.setAttribute(f, n);
    }
    return this.isOpen = s.getAttribute(f) === "open", this.isOpen && s.classList.add("open"), p(s, this.isOpen), this;
  }
  m.prototype.open = function() {
    this.isOpen || this.dom.setAttribute(f, "open");
  }, m.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "close");
  }, m.prototype.toggle = function() {
    this.isOpen ? this.close() : this.open();
  }, m.prototype.destroy = function() {
    if (!this.dom[c]) return;
    T(this.dom, "ln-toggle:destroyed", { target: this.dom });
    const s = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
    for (const n of s)
      n[c + "Trigger"] && (n.removeEventListener("click", n[c + "Trigger"]), delete n[c + "Trigger"]);
    delete this.dom[c];
  };
  function g(s) {
    const n = s[c];
    if (!n) return;
    const o = s.getAttribute(f) === "open";
    if (o !== n.isOpen)
      if (o) {
        if (K(s, "ln-toggle:before-open", { target: s }).defaultPrevented) {
          s.setAttribute(f, "close");
          return;
        }
        n.isOpen = !0, s.classList.add("open"), p(s, !0), T(s, "ln-toggle:open", { target: s }), s.hasAttribute("data-ln-persist") && tt("toggle", s, "open");
      } else {
        if (K(s, "ln-toggle:before-close", { target: s }).defaultPrevented) {
          s.setAttribute(f, "open");
          return;
        }
        n.isOpen = !1, s.classList.remove("open"), p(s, !1), T(s, "ln-toggle:close", { target: s }), s.hasAttribute("data-ln-persist") && tt("toggle", s, "close");
      }
  }
  j(f, c, m, "ln-toggle", {
    extraAttributes: ["data-ln-toggle-for"],
    onAttributeChange: g,
    onInit: y
  });
})();
(function() {
  const f = "data-ln-accordion", c = "lnAccordion";
  if (window[c] !== void 0) return;
  function y(p) {
    return this.dom = p, this._onToggleOpen = function(m) {
      const g = p.querySelectorAll("[data-ln-toggle]");
      for (const s of g)
        s !== m.detail.target && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      T(p, "ln-accordion:change", { target: m.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), T(this.dom, "ln-accordion:destroyed", { target: this.dom }), delete this.dom[c]);
  }, j(f, c, y, "ln-accordion");
})();
(function() {
  const f = "data-ln-dropdown", c = "lnDropdown";
  if (window[c] !== void 0) return;
  function y(p) {
    if (this.dom = p, this.toggleEl = p.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this._menuParent = null, this._placeholder = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu")), this.triggerBtn = p.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false")), this.toggleEl)
      for (const g of this.toggleEl.children)
        g.setAttribute("role", "menuitem");
    const m = this;
    return this._onToggleOpen = function(g) {
      g.detail.target === m.toggleEl && (m.triggerBtn && m.triggerBtn.setAttribute("aria-expanded", "true"), m._teleportToBody(), m._addOutsideClickListener(), m._addScrollRepositionListener(), m._addResizeCloseListener(), T(p, "ln-dropdown:open", { target: g.detail.target }));
    }, this._onToggleClose = function(g) {
      g.detail.target === m.toggleEl && (m.triggerBtn && m.triggerBtn.setAttribute("aria-expanded", "false"), m._removeOutsideClickListener(), m._removeScrollRepositionListener(), m._removeResizeCloseListener(), m._teleportBack(), T(p, "ln-dropdown:close", { target: g.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  y.prototype._positionMenu = function() {
    const p = this.dom.querySelector("[data-ln-toggle-for]");
    if (!p || !this.toggleEl) return;
    const m = p.getBoundingClientRect(), g = this.toggleEl.style.display === "none" || this.toggleEl.style.display === "";
    g && (this.toggleEl.style.visibility = "hidden", this.toggleEl.style.display = "block");
    const s = this.toggleEl.offsetWidth, n = this.toggleEl.offsetHeight;
    g && (this.toggleEl.style.visibility = "", this.toggleEl.style.display = "");
    const t = window.innerWidth, o = window.innerHeight, e = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4;
    let i;
    m.bottom + e + n <= o ? i = m.bottom + e : m.top - e - n >= 0 ? i = m.top - e - n : i = Math.max(0, o - n);
    let r;
    m.right - s >= 0 ? r = m.right - s : m.left + s <= t ? r = m.left : r = Math.max(0, t - s), this.toggleEl.style.top = i + "px", this.toggleEl.style.left = r + "px", this.toggleEl.style.right = "auto", this.toggleEl.style.transform = "none", this.toggleEl.style.margin = "0";
  }, y.prototype._teleportToBody = function() {
    !this.toggleEl || this.toggleEl.parentNode === document.body || (this._menuParent = this.toggleEl.parentNode, this._placeholder = document.createComment("ln-dropdown"), this._menuParent.insertBefore(this._placeholder, this.toggleEl), document.body.appendChild(this.toggleEl), this.toggleEl.style.position = "fixed", this._positionMenu());
  }, y.prototype._teleportBack = function() {
    !this._placeholder || !this._menuParent || (this.toggleEl.style.position = "", this.toggleEl.style.top = "", this.toggleEl.style.left = "", this.toggleEl.style.right = "", this.toggleEl.style.transform = "", this.toggleEl.style.margin = "", this._menuParent.insertBefore(this.toggleEl, this._placeholder), this._menuParent.removeChild(this._placeholder), this._menuParent = null, this._placeholder = null);
  }, y.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const p = this;
    this._boundDocClick = function(m) {
      p.dom.contains(m.target) || p.toggleEl && p.toggleEl.contains(m.target) || p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, p._docClickTimeout = setTimeout(function() {
      p._docClickTimeout = null, document.addEventListener("click", p._boundDocClick);
    }, 0);
  }, y.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, y.prototype._addScrollRepositionListener = function() {
    const p = this;
    this._boundScrollReposition = function() {
      p._positionMenu();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, y.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, y.prototype._addResizeCloseListener = function() {
    const p = this;
    this._boundResizeClose = function() {
      p.toggleEl && p.toggleEl.getAttribute("data-ln-toggle") === "open" && p.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, y.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, y.prototype.destroy = function() {
    this.dom[c] && (this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this._teleportBack(), this.toggleEl && (this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), T(this.dom, "ln-dropdown:destroyed", { target: this.dom }), delete this.dom[c]);
  }, j(f, c, y, "ln-dropdown");
})();
(function() {
  const f = "data-ln-popover", c = "lnPopover", y = "data-ln-popover-for", p = "data-ln-popover-position";
  if (window[c] !== void 0) return;
  const m = [];
  let g = null;
  function s() {
    g || (g = function(l) {
      if (l.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", g));
  }
  function n() {
    m.length > 0 || g && (document.removeEventListener("keydown", g), g = null);
  }
  function t(l) {
    o(l), e(l);
  }
  function o(l) {
    if (!l || l.nodeType !== 1) return;
    const a = Array.from(l.querySelectorAll("[" + f + "]"));
    l.hasAttribute && l.hasAttribute(f) && a.push(l);
    for (const _ of a)
      _[c] || (_[c] = new i(_));
  }
  function e(l) {
    if (!l || l.nodeType !== 1) return;
    const a = Array.from(l.querySelectorAll("[" + y + "]"));
    l.hasAttribute && l.hasAttribute(y) && a.push(l);
    for (const _ of a) {
      if (_[c + "Trigger"]) continue;
      const d = _.getAttribute(y);
      _.setAttribute("aria-haspopup", "dialog"), _.setAttribute("aria-expanded", "false"), _.setAttribute("aria-controls", d);
      const b = function(E) {
        if (E.ctrlKey || E.metaKey || E.button === 1) return;
        E.preventDefault();
        const v = document.getElementById(d);
        !v || !v[c] || v[c].toggle(_);
      };
      _.addEventListener("click", b), _[c + "Trigger"] = b;
    }
  }
  function i(l) {
    return this.dom = l, this.isOpen = l.getAttribute(f) === "open", this.trigger = null, this._teleportRestore = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null, l.hasAttribute("tabindex") || l.setAttribute("tabindex", "-1"), l.hasAttribute("role") || l.setAttribute("role", "dialog"), this.isOpen && this._applyOpen(null), this;
  }
  i.prototype.open = function(l) {
    this.isOpen || (this.trigger = l || null, this.dom.setAttribute(f, "open"));
  }, i.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(f, "closed");
  }, i.prototype.toggle = function(l) {
    this.isOpen ? this.close() : this.open(l);
  }, i.prototype._applyOpen = function(l) {
    this.isOpen = !0, l && (this.trigger = l), this._previousFocus = document.activeElement, this._teleportRestore = qt(this.dom);
    const a = wt(this.dom);
    if (this.trigger) {
      const E = this.trigger.getBoundingClientRect(), v = this.dom.getAttribute(p) || "bottom", w = Et(E, a, v, 8);
      this.dom.style.top = w.top + "px", this.dom.style.left = w.left + "px", this.dom.setAttribute("data-ln-popover-placement", w.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const _ = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), d = Array.prototype.find.call(_, ct);
    d ? d.focus() : this.dom.focus();
    const b = this;
    this._boundDocClick = function(E) {
      b.dom.contains(E.target) || b.trigger && b.trigger.contains(E.target) || b.close();
    }, b._docClickTimeout = setTimeout(function() {
      b._docClickTimeout = null, document.addEventListener("click", b._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!b.trigger) return;
      const E = b.trigger.getBoundingClientRect(), v = wt(b.dom), w = b.dom.getAttribute(p) || "bottom", A = Et(E, v, w, 8);
      b.dom.style.top = A.top + "px", b.dom.style.left = A.left + "px", b.dom.setAttribute("data-ln-popover-placement", A.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), s(), T(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, i.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), this._teleportRestore && (this._teleportRestore(), this._teleportRestore = null);
    const l = m.indexOf(this);
    l !== -1 && m.splice(l, 1), n(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, T(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, i.prototype.destroy = function() {
    if (!this.dom[c]) return;
    this.isOpen && this._applyClose();
    const l = document.querySelectorAll("[" + y + '="' + this.dom.id + '"]');
    for (const a of l)
      a[c + "Trigger"] && (a.removeEventListener("click", a[c + "Trigger"]), delete a[c + "Trigger"]);
    T(this.dom, "ln-popover:destroyed", {
      popoverId: this.dom.id,
      target: this.dom
    }), delete this.dom[c];
  };
  function r(l) {
    const a = l[c];
    if (!a) return;
    const d = l.getAttribute(f) === "open";
    if (d !== a.isOpen)
      if (d) {
        if (K(l, "ln-popover:before-open", {
          popoverId: l.id,
          target: l,
          trigger: a.trigger
        }).defaultPrevented) {
          l.setAttribute(f, "closed");
          return;
        }
        a._applyOpen(a.trigger);
      } else {
        if (K(l, "ln-popover:before-close", {
          popoverId: l.id,
          target: l,
          trigger: a.trigger
        }).defaultPrevented) {
          l.setAttribute(f, "open");
          return;
        }
        a._applyClose();
      }
  }
  function h() {
    H(function() {
      new MutationObserver(function(a) {
        for (let _ = 0; _ < a.length; _++) {
          const d = a[_];
          if (d.type === "childList")
            for (let b = 0; b < d.addedNodes.length; b++) {
              const E = d.addedNodes[b];
              E.nodeType === 1 && (o(E), e(E));
            }
          else d.type === "attributes" && (d.attributeName === f && d.target[c] ? r(d.target) : (o(d.target), e(d.target)));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f, y]
      });
    }, "ln-popover");
  }
  window[c] = t, h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    t(document.body);
  }) : t(document.body);
})();
(function() {
  const f = "data-ln-tooltip-enhance", c = "data-ln-tooltip", y = "data-ln-tooltip-position", p = "lnTooltipEnhance", m = "ln-tooltip-portal";
  if (window[p] !== void 0) return;
  let g = 0, s = null, n = null, t = null, o = null, e = null;
  function i() {
    return s && s.parentNode || (s = document.getElementById(m), s || (s = document.createElement("div"), s.id = m, document.body.appendChild(s))), s;
  }
  function r() {
    e || (e = function(v) {
      v.key === "Escape" && a();
    }, document.addEventListener("keydown", e));
  }
  function h() {
    e && (document.removeEventListener("keydown", e), e = null);
  }
  function l(v) {
    if (t === v) return;
    a();
    const w = v.getAttribute(c) || v.getAttribute("title");
    if (!w) return;
    i(), v.hasAttribute("title") && (o = v.getAttribute("title"), v.removeAttribute("title"));
    const A = document.createElement("div");
    A.className = "ln-tooltip", A.textContent = w, v[p + "Uid"] || (g += 1, v[p + "Uid"] = "ln-tooltip-" + g), A.id = v[p + "Uid"], s.appendChild(A);
    const C = A.offsetWidth, k = A.offsetHeight, D = v.getBoundingClientRect(), N = v.getAttribute(y) || "top", M = Et(D, { width: C, height: k }, N, 6);
    A.style.top = M.top + "px", A.style.left = M.left + "px", A.setAttribute("data-ln-tooltip-placement", M.placement), v.setAttribute("aria-describedby", A.id), n = A, t = v, r();
  }
  function a() {
    if (!n) {
      h();
      return;
    }
    t && (t.removeAttribute("aria-describedby"), o !== null && t.setAttribute("title", o)), o = null, n.parentNode && n.parentNode.removeChild(n), n = null, t = null, h();
  }
  function _(v) {
    if (v[p]) return;
    v[p] = !0;
    const w = function() {
      l(v);
    }, A = function() {
      t === v && a();
    }, C = function() {
      l(v);
    }, k = function() {
      t === v && a();
    };
    v.addEventListener("mouseenter", w), v.addEventListener("mouseleave", A), v.addEventListener("focus", C, !0), v.addEventListener("blur", k, !0), v[p + "Cleanup"] = function() {
      v.removeEventListener("mouseenter", w), v.removeEventListener("mouseleave", A), v.removeEventListener("focus", C, !0), v.removeEventListener("blur", k, !0), t === v && a(), delete v[p], delete v[p + "Cleanup"], delete v[p + "Uid"], T(v, "ln-tooltip:destroyed", { trigger: v });
    };
  }
  function d(v) {
    if (!v || v.nodeType !== 1) return;
    const w = Array.from(v.querySelectorAll(
      "[" + f + "], [" + c + "][title]"
    ));
    v.hasAttribute && (v.hasAttribute(f) || v.hasAttribute(c) && v.hasAttribute("title")) && w.push(v);
    for (const A of w)
      _(A);
  }
  function b(v) {
    d(v);
  }
  function E() {
    H(function() {
      new MutationObserver(function(w) {
        for (let A = 0; A < w.length; A++) {
          const C = w[A];
          if (C.type === "childList")
            for (let k = 0; k < C.addedNodes.length; k++) {
              const D = C.addedNodes[k];
              D.nodeType === 1 && d(D);
            }
          else C.type === "attributes" && d(C.target);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f, c]
      });
    }, "ln-tooltip");
  }
  window[p] = b, E(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    b(document.body);
  }) : b(document.body);
})();
(function() {
  const f = "data-ln-toast", c = "lnToast", y = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  if (window[c] !== void 0 && window[c] !== null) return;
  function p(a = document.body) {
    return m(a), l;
  }
  function m(a) {
    if (!a || a.nodeType !== 1) return;
    const _ = Array.from(a.querySelectorAll("[" + f + "]"));
    a.hasAttribute && a.hasAttribute(f) && _.push(a);
    for (const d of _)
      d[c] || new g(d);
  }
  function g(a) {
    this.dom = a, a[c] = this, this.timeoutDefault = parseInt(a.getAttribute("data-ln-toast-timeout") || "6000", 10), this.max = parseInt(a.getAttribute("data-ln-toast-max") || "5", 10);
    for (const _ of Array.from(a.querySelectorAll("[data-ln-toast-item]")))
      o(_);
    return this;
  }
  g.prototype.destroy = function() {
    if (this.dom[c]) {
      for (const a of Array.from(this.dom.children))
        i(a);
      delete this.dom[c];
    }
  };
  function s(a) {
    return a === "success" ? "Success" : a === "error" ? "Error" : a === "warn" ? "Warning" : "Information";
  }
  function n(a) {
    return a === "warn" ? "warning" : a;
  }
  function t(a, _, d) {
    const b = document.createElement("div");
    b.className = "ln-toast__card " + n(a), b.setAttribute("role", a === "error" ? "alert" : "status"), b.setAttribute("aria-live", a === "error" ? "assertive" : "polite");
    const E = document.createElement("div");
    E.className = "ln-toast__side", E.innerHTML = y[a] || y.info;
    const v = document.createElement("div");
    v.className = "ln-toast__content";
    const w = document.createElement("div");
    w.className = "ln-toast__head";
    const A = document.createElement("strong");
    A.className = "ln-toast__title", A.textContent = _ || s(a);
    const C = document.createElement("button");
    return C.type = "button", C.className = "ln-toast__close", C.setAttribute("aria-label", "Close"), C.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>', C.addEventListener("click", function() {
      i(d);
    }), w.appendChild(A), v.appendChild(w), v.appendChild(C), b.appendChild(E), b.appendChild(v), { card: b, content: v };
  }
  function o(a) {
    const _ = ((a.getAttribute("data-type") || "info") + "").toLowerCase(), d = a.getAttribute("data-title"), b = (a.innerText || a.textContent || "").trim();
    a.className = "ln-toast__item", a.removeAttribute("data-ln-toast-item");
    const E = t(_, d, a);
    if (b) {
      const v = document.createElement("div");
      v.className = "ln-toast__body";
      const w = document.createElement("p");
      w.textContent = b, v.appendChild(w), E.content.appendChild(v);
    }
    a.innerHTML = "", a.appendChild(E.card), requestAnimationFrame(() => a.classList.add("ln-toast__item--in"));
  }
  function e(a, _) {
    for (; a.dom.children.length >= a.max; ) a.dom.removeChild(a.dom.firstElementChild);
    a.dom.appendChild(_), requestAnimationFrame(() => _.classList.add("ln-toast__item--in"));
  }
  function i(a) {
    !a || !a.parentNode || (clearTimeout(a._timer), a.classList.remove("ln-toast__item--in"), a.classList.add("ln-toast__item--out"), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 200));
  }
  function r(a = {}) {
    let _ = a.container;
    if (typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), !_)
      return console.warn("[ln-toast] No toast container found"), null;
    const d = _[c] || new g(_), b = Number.isFinite(a.timeout) ? a.timeout : d.timeoutDefault, E = (a.type || "info").toLowerCase(), v = document.createElement("li");
    v.className = "ln-toast__item";
    const w = t(E, a.title, v);
    if (a.message || a.data && a.data.errors) {
      const A = document.createElement("div");
      if (A.className = "ln-toast__body", a.message)
        if (Array.isArray(a.message)) {
          const C = document.createElement("ul");
          for (const k of a.message) {
            const D = document.createElement("li");
            D.textContent = k, C.appendChild(D);
          }
          A.appendChild(C);
        } else {
          const C = document.createElement("p");
          C.textContent = a.message, A.appendChild(C);
        }
      if (a.data && a.data.errors) {
        const C = document.createElement("ul");
        for (const k of Object.values(a.data.errors).flat()) {
          const D = document.createElement("li");
          D.textContent = k, C.appendChild(D);
        }
        A.appendChild(C);
      }
      w.content.appendChild(A);
    }
    return v.appendChild(w.card), e(d, v), b > 0 && (v._timer = setTimeout(() => i(v), b)), v;
  }
  function h(a) {
    let _ = a;
    if (typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + f + "]") || document.getElementById("ln-toast-container")), !!_)
      for (const d of Array.from(_.children))
        i(d);
  }
  const l = function(a) {
    return p(a);
  };
  l.enqueue = r, l.clear = h, H(function() {
    new MutationObserver(function(_) {
      for (const d of _) {
        if (d.type === "attributes") {
          m(d.target);
          continue;
        }
        for (const b of d.addedNodes)
          m(b);
      }
    }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [f] });
  }, "ln-toast"), window[c] = l, window.addEventListener("ln-toast:enqueue", function(a) {
    a.detail && l.enqueue(a.detail);
  }), p(document.body);
})();
(function() {
  const f = "data-ln-upload", c = "lnUpload", y = "data-ln-upload-dict", p = "data-ln-upload-accept", m = "data-ln-upload-context", g = '<template data-ln-template="ln-upload-item"><li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting"><svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg><span class="ln-upload__name" data-ln-field="name"></span><span class="ln-upload__size" data-ln-field="sizeText"></span><button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button><div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div></li></template>';
  function s() {
    if (document.querySelector('[data-ln-template="ln-upload-item"]') || !document.body) return;
    const l = document.createElement("div");
    l.innerHTML = g;
    const a = l.firstElementChild;
    a && document.body.appendChild(a);
  }
  if (window[c] !== void 0) return;
  function n(l) {
    if (l === 0) return "0 B";
    const a = 1024, _ = ["B", "KB", "MB", "GB"], d = Math.floor(Math.log(l) / Math.log(a));
    return parseFloat((l / Math.pow(a, d)).toFixed(1)) + " " + _[d];
  }
  function t(l) {
    return l.split(".").pop().toLowerCase();
  }
  function o(l) {
    return l === "docx" && (l = "doc"), ["pdf", "doc", "epub"].includes(l) ? "lnc-file-" + l : "ln-file";
  }
  function e(l, a) {
    if (!a) return !0;
    const _ = "." + t(l.name);
    return a.split(",").map(function(b) {
      return b.trim().toLowerCase();
    }).includes(_.toLowerCase());
  }
  function i(l) {
    if (l.hasAttribute("data-ln-upload-initialized")) return;
    l.setAttribute("data-ln-upload-initialized", "true"), s();
    const a = Ot(l, y), _ = l.querySelector(".ln-upload__zone"), d = l.querySelector(".ln-upload__list"), b = l.getAttribute(p) || "";
    if (!_ || !d) {
      console.warn("[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:", l);
      return;
    }
    let E = l.querySelector('input[type="file"]');
    E || (E = document.createElement("input"), E.type = "file", E.multiple = !0, E.classList.add("hidden"), b && (E.accept = b.split(",").map(function(R) {
      return R = R.trim(), R.startsWith(".") ? R : "." + R;
    }).join(",")), l.appendChild(E));
    const v = l.getAttribute(f) || "/files/upload", w = l.getAttribute(m) || "", A = /* @__PURE__ */ new Map();
    let C = 0;
    function k() {
      const R = document.querySelector('meta[name="csrf-token"]');
      return R ? R.getAttribute("content") : "";
    }
    function D(R) {
      if (!e(R, b)) {
        const S = a["invalid-type"];
        T(l, "ln-upload:invalid", {
          file: R,
          message: S
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["invalid-title"] || "Invalid File",
          message: S || a["invalid-type"] || "This file type is not allowed"
        });
        return;
      }
      const B = "file-" + ++C, P = t(R.name), G = o(P), ft = at(l, "ln-upload-item", "ln-upload");
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
      st.append("file", R), st.append("context", w);
      const u = new XMLHttpRequest();
      u.upload.addEventListener("progress", function(S) {
        if (S.lengthComputable) {
          const O = Math.round(S.loaded / S.total * 100);
          rt.style.width = O + "%", Z(W, { sizeText: O + "%" });
        }
      }), u.addEventListener("load", function() {
        if (u.status >= 200 && u.status < 300) {
          let S;
          try {
            S = JSON.parse(u.responseText);
          } catch {
            L("Invalid response");
            return;
          }
          Z(W, { sizeText: n(S.size || R.size), uploading: !1 }), Y && (Y.disabled = !1), A.set(B, {
            serverId: S.id,
            name: S.name,
            size: S.size
          }), N(), T(l, "ln-upload:uploaded", {
            localId: B,
            serverId: S.id,
            name: S.name
          });
        } else {
          let S = a["upload-failed"] || "Upload failed";
          try {
            S = JSON.parse(u.responseText).message || S;
          } catch {
          }
          L(S);
        }
      }), u.addEventListener("error", function() {
        L(a["network-error"] || "Network error");
      });
      function L(S) {
        rt && (rt.style.width = "100%"), Z(W, { sizeText: a.error || "Error", uploading: !1, error: !0 }), Y && (Y.disabled = !1), T(l, "ln-upload:error", {
          file: R,
          message: S
        }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["error-title"] || "Upload Error",
          message: S || a["upload-failed"] || "Failed to upload file"
        });
      }
      u.open("POST", v), u.setRequestHeader("X-CSRF-TOKEN", k()), u.setRequestHeader("Accept", "application/json"), u.send(st);
    }
    function N() {
      for (const R of l.querySelectorAll('input[name="file_ids[]"]'))
        R.remove();
      for (const [, R] of A) {
        const B = document.createElement("input");
        B.type = "hidden", B.name = "file_ids[]", B.value = R.serverId, l.appendChild(B);
      }
    }
    function M(R) {
      const B = A.get(R), P = d.querySelector('[data-file-id="' + R + '"]');
      if (!B || !B.serverId) {
        P && P.remove(), A.delete(R), N();
        return;
      }
      P && Z(P, { deleting: !0 }), fetch("/files/" + B.serverId, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": k(),
          Accept: "application/json"
        }
      }).then(function(G) {
        G.status === 200 ? (P && P.remove(), A.delete(R), N(), T(l, "ln-upload:removed", {
          localId: R,
          serverId: B.serverId
        })) : (P && Z(P, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["delete-title"] || "Error",
          message: a["delete-error"] || "Failed to delete file"
        }));
      }).catch(function(G) {
        console.warn("[ln-upload] Delete error:", G), P && Z(P, { deleting: !1 }), T(window, "ln-toast:enqueue", {
          type: "error",
          title: a["network-error"] || "Network error",
          message: a["connection-error"] || "Could not connect to server"
        });
      });
    }
    function U(R) {
      for (const B of R)
        D(B);
      E.value = "";
    }
    const dt = function() {
      E.click();
    }, ut = function() {
      U(this.files);
    }, it = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.add("ln-upload__zone--dragover");
    }, X = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.add("ln-upload__zone--dragover");
    }, et = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.remove("ln-upload__zone--dragover");
    }, nt = function(R) {
      R.preventDefault(), R.stopPropagation(), _.classList.remove("ln-upload__zone--dragover"), U(R.dataTransfer.files);
    }, ot = function(R) {
      const B = R.target.closest('[data-ln-upload-action="remove"]');
      if (!B || !d.contains(B) || B.disabled) return;
      const P = B.closest(".ln-upload__item");
      P && M(P.getAttribute("data-file-id"));
    };
    _.addEventListener("click", dt), E.addEventListener("change", ut), _.addEventListener("dragenter", it), _.addEventListener("dragover", X), _.addEventListener("dragleave", et), _.addEventListener("drop", nt), d.addEventListener("click", ot), l.lnUploadAPI = {
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
              "X-CSRF-TOKEN": k(),
              Accept: "application/json"
            }
          });
        A.clear(), d.innerHTML = "", N(), T(l, "ln-upload:cleared", {});
      },
      destroy: function() {
        _.removeEventListener("click", dt), E.removeEventListener("change", ut), _.removeEventListener("dragenter", it), _.removeEventListener("dragover", X), _.removeEventListener("dragleave", et), _.removeEventListener("drop", nt), d.removeEventListener("click", ot), A.clear(), d.innerHTML = "", N(), l.removeAttribute("data-ln-upload-initialized"), delete l.lnUploadAPI;
      }
    };
  }
  function r() {
    for (const l of document.querySelectorAll("[" + f + "]"))
      i(l);
  }
  function h() {
    H(function() {
      new MutationObserver(function(a) {
        for (const _ of a)
          if (_.type === "childList") {
            for (const d of _.addedNodes)
              if (d.nodeType === 1) {
                d.hasAttribute(f) && i(d);
                for (const b of d.querySelectorAll("[" + f + "]"))
                  i(b);
              }
          } else _.type === "attributes" && _.target.hasAttribute(f) && i(_.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-upload");
  }
  window[c] = {
    init: i,
    initAll: r
  }, h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
(function() {
  const f = "lnExternalLinks";
  if (window[f] !== void 0) return;
  function c(n) {
    return n.hostname && n.hostname !== window.location.hostname;
  }
  function y(n) {
    if (n.getAttribute("data-ln-external-link") === "processed" || !c(n)) return;
    n.target = "_blank", n.rel = "noopener noreferrer";
    const t = document.createElement("span");
    t.className = "sr-only", t.textContent = "(opens in new tab)", n.appendChild(t), n.setAttribute("data-ln-external-link", "processed"), T(n, "ln-external-links:processed", {
      link: n,
      href: n.href
    });
  }
  function p(n) {
    n = n || document.body;
    for (const t of n.querySelectorAll("a, area"))
      y(t);
  }
  function m() {
    document.body.addEventListener("click", function(n) {
      const t = n.target.closest("a, area");
      t && t.getAttribute("data-ln-external-link") === "processed" && T(t, "ln-external-links:clicked", {
        link: t,
        href: t.href,
        text: t.textContent || t.title || ""
      });
    });
  }
  function g() {
    H(function() {
      new MutationObserver(function(t) {
        for (const o of t)
          if (o.type === "childList") {
            for (const e of o.addedNodes)
              if (e.nodeType === 1 && (e.matches && (e.matches("a") || e.matches("area")) && y(e), e.querySelectorAll))
                for (const i of e.querySelectorAll("a, area"))
                  y(i);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }, "ln-external-links");
  }
  function s() {
    m(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      p();
    }) : p();
  }
  window[f] = {
    process: p
  }, s();
})();
(function() {
  const f = "data-ln-link", c = "lnLink";
  if (window[c] !== void 0) return;
  let y = null;
  function p() {
    y = document.createElement("div"), y.className = "ln-link-status", document.body.appendChild(y);
  }
  function m(d) {
    y && (y.textContent = d, y.classList.add("ln-link-status--visible"));
  }
  function g() {
    y && y.classList.remove("ln-link-status--visible");
  }
  function s(d, b) {
    if (b.target.closest("a, button, input, select, textarea")) return;
    const E = d.querySelector("a");
    if (!E) return;
    const v = E.getAttribute("href");
    if (!v) return;
    if (b.ctrlKey || b.metaKey || b.button === 1) {
      window.open(v, "_blank");
      return;
    }
    K(d, "ln-link:navigate", { target: d, href: v, link: E }).defaultPrevented || E.click();
  }
  function n(d) {
    const b = d.querySelector("a");
    if (!b) return;
    const E = b.getAttribute("href");
    E && m(E);
  }
  function t() {
    g();
  }
  function o(d) {
    d[c + "Row"] || (d[c + "Row"] = !0, d.querySelector("a") && (d._lnLinkClick = function(b) {
      s(d, b);
    }, d._lnLinkEnter = function() {
      n(d);
    }, d.addEventListener("click", d._lnLinkClick), d.addEventListener("mouseenter", d._lnLinkEnter), d.addEventListener("mouseleave", t)));
  }
  function e(d) {
    d[c + "Row"] && (d._lnLinkClick && d.removeEventListener("click", d._lnLinkClick), d._lnLinkEnter && d.removeEventListener("mouseenter", d._lnLinkEnter), d.removeEventListener("mouseleave", t), delete d._lnLinkClick, delete d._lnLinkEnter, delete d[c + "Row"]);
  }
  function i(d) {
    if (!d[c + "Init"]) return;
    const b = d.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const E = b === "TABLE" && d.querySelector("tbody") || d;
      for (const v of E.querySelectorAll("tr"))
        e(v);
    } else
      e(d);
    delete d[c + "Init"];
  }
  function r(d) {
    if (d[c + "Init"]) return;
    d[c + "Init"] = !0;
    const b = d.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const E = b === "TABLE" && d.querySelector("tbody") || d;
      for (const v of E.querySelectorAll("tr"))
        o(v);
    } else
      o(d);
  }
  function h(d) {
    d.hasAttribute && d.hasAttribute(f) && r(d);
    const b = d.querySelectorAll ? d.querySelectorAll("[" + f + "]") : [];
    for (const E of b)
      r(E);
  }
  function l() {
    H(function() {
      new MutationObserver(function(b) {
        for (const E of b)
          if (E.type === "childList")
            for (const v of E.addedNodes)
              v.nodeType === 1 && (h(v), v.tagName === "TR" && v.closest("[" + f + "]") && o(v));
          else E.type === "attributes" && h(E.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-link");
  }
  function a(d) {
    h(d);
  }
  window[c] = { init: a, destroy: i };
  function _() {
    p(), l(), a(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _();
})();
(function() {
  const f = "[data-ln-progress]", c = "lnProgress";
  if (window[c] !== void 0) return;
  function y(e) {
    const i = e.getAttribute("data-ln-progress");
    return i !== null && i !== "";
  }
  function p(e) {
    m(e);
  }
  function m(e) {
    const i = Array.from(e.querySelectorAll(f));
    for (const r of i)
      y(r) && !r[c] && (r[c] = new g(r));
    e.hasAttribute && e.hasAttribute("data-ln-progress") && y(e) && !e[c] && (e[c] = new g(e));
  }
  function g(e) {
    return this.dom = e, this._attrObserver = null, this._parentObserver = null, o.call(this), n.call(this), t.call(this), this;
  }
  g.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this._parentObserver && this._parentObserver.disconnect(), delete this.dom[c]);
  };
  function s() {
    H(function() {
      new MutationObserver(function(i) {
        for (const r of i)
          if (r.type === "childList")
            for (const h of r.addedNodes)
              h.nodeType === 1 && m(h);
          else r.type === "attributes" && m(r.target);
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["data-ln-progress"]
      });
    }, "ln-progress");
  }
  s();
  function n() {
    const e = this, i = new MutationObserver(function(r) {
      for (const h of r)
        (h.attributeName === "data-ln-progress" || h.attributeName === "data-ln-progress-max") && o.call(e);
    });
    i.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-progress", "data-ln-progress-max"]
    }), this._attrObserver = i;
  }
  function t() {
    const e = this, i = this.dom.parentElement;
    if (!i || !i.hasAttribute("data-ln-progress-max")) return;
    const r = new MutationObserver(function(h) {
      for (const l of h)
        l.attributeName === "data-ln-progress-max" && o.call(e);
    });
    r.observe(i, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = r;
  }
  function o() {
    const e = parseFloat(this.dom.getAttribute("data-ln-progress")) || 0, i = this.dom.parentElement, h = (i && i.hasAttribute("data-ln-progress-max") ? parseFloat(i.getAttribute("data-ln-progress-max")) : null) || parseFloat(this.dom.getAttribute("data-ln-progress-max")) || 100;
    let l = h > 0 ? e / h * 100 : 0;
    l < 0 && (l = 0), l > 100 && (l = 100), this.dom.style.width = l + "%", T(this.dom, "ln-progress:change", { target: this.dom, value: e, max: h, percentage: l });
  }
  window[c] = p, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const f = "data-ln-filter", c = "lnFilter", y = "data-ln-filter-initialized", p = "data-ln-filter-key", m = "data-ln-filter-value", g = "data-ln-filter-hide", s = "data-ln-filter-reset", n = "data-ln-filter-col", t = /* @__PURE__ */ new WeakMap();
  if (window[c] !== void 0) return;
  function o(r) {
    return r.hasAttribute(s) || r.getAttribute(m) === "";
  }
  function e(r) {
    const h = r.dom, l = r.colIndex, a = h.querySelector("template");
    if (!a || l === null) return;
    const _ = document.getElementById(r.targetId);
    if (!_) return;
    const d = _.tagName === "TABLE" ? _ : _.querySelector("table");
    if (!d || _.hasAttribute("data-ln-table")) return;
    const b = {}, E = [], v = d.tBodies;
    for (let C = 0; C < v.length; C++) {
      const k = v[C].rows;
      for (let D = 0; D < k.length; D++) {
        const N = k[D].cells[l], M = N ? N.textContent.trim() : "";
        M && !b[M] && (b[M] = !0, E.push(M));
      }
    }
    E.sort(function(C, k) {
      return C.localeCompare(k);
    });
    const w = h.querySelector("[" + p + "]"), A = w ? w.getAttribute(p) : h.getAttribute("data-ln-filter-key") || "col" + l;
    for (let C = 0; C < E.length; C++) {
      const k = a.content.cloneNode(!0), D = k.querySelector("input");
      D && (D.setAttribute(p, A), D.setAttribute(m, E[C]), kt(k, { text: E[C] }), h.appendChild(k));
    }
  }
  function i(r) {
    if (r.hasAttribute(y)) return this;
    this.dom = r, this.targetId = r.getAttribute(f), this._pendingEvents = [];
    const h = r.getAttribute(n);
    this.colIndex = h !== null ? parseInt(h, 10) : null, e(this), this.inputs = Array.from(r.querySelectorAll("[" + p + "]")), this._filterKey = this.inputs.length > 0 ? this.inputs[0].getAttribute(p) : null;
    const l = this, a = It(
      function() {
        l._render();
      },
      function() {
        l._afterRender();
      }
    );
    this.state = xt({
      key: null,
      values: []
    }, a), this._attachHandlers();
    let _ = !1;
    if (r.hasAttribute("data-ln-persist")) {
      const d = mt("filter", r);
      d && d.key && Array.isArray(d.values) && d.values.length > 0 && (this.state.key = d.key, this.state.values = d.values, _ = !0);
    }
    if (!_) {
      let d = null;
      const b = [];
      for (let E = 0; E < this.inputs.length; E++) {
        const v = this.inputs[E];
        if (v.checked && !o(v)) {
          d || (d = v.getAttribute(p));
          const w = v.getAttribute(m);
          w && b.push(w);
        }
      }
      b.length > 0 && (this.state.key = d, this.state.values = b, this._pendingEvents.push({
        name: "ln-filter:changed",
        detail: { key: d, values: b }
      }));
    }
    return r.setAttribute(y, ""), this;
  }
  i.prototype._attachHandlers = function() {
    const r = this;
    this.inputs.forEach(function(h) {
      h[c + "Bound"] || (h[c + "Bound"] = !0, h._lnFilterChange = function() {
        const l = h.getAttribute(p), a = h.getAttribute(m) || "";
        if (o(h)) {
          r._pendingEvents.push({
            name: "ln-filter:changed",
            detail: { key: l, values: [] }
          }), r.reset();
          return;
        }
        if (h.checked)
          r.state.values.indexOf(a) === -1 && (r.state.key = l, r.state.values.push(a));
        else {
          const _ = r.state.values.indexOf(a);
          if (_ !== -1 && r.state.values.splice(_, 1), r.state.values.length === 0) {
            r._pendingEvents.push({
              name: "ln-filter:changed",
              detail: { key: l, values: [] }
            }), r.reset();
            return;
          }
        }
        r._pendingEvents.push({
          name: "ln-filter:changed",
          detail: { key: r.state.key, values: r.state.values.slice() }
        });
      }, h.addEventListener("change", h._lnFilterChange));
    });
  }, i.prototype._render = function() {
    const r = this, h = this.state.key, l = this.state.values, a = h === null || l.length === 0, _ = [];
    for (let d = 0; d < l.length; d++)
      _.push(l[d].toLowerCase());
    if (this.inputs.forEach(function(d) {
      if (a)
        d.checked = o(d);
      else if (o(d))
        d.checked = !1;
      else {
        const b = d.getAttribute(m) || "";
        d.checked = l.indexOf(b) !== -1;
      }
    }), r.colIndex !== null)
      r._filterTableRows();
    else {
      const d = document.getElementById(r.targetId);
      if (!d) return;
      const b = d.children;
      for (let E = 0; E < b.length; E++) {
        const v = b[E];
        if (a) {
          v.removeAttribute(g);
          continue;
        }
        const w = v.getAttribute("data-" + h);
        v.removeAttribute(g), w !== null && _.indexOf(w.toLowerCase()) === -1 && v.setAttribute(g, "true");
      }
    }
  }, i.prototype._afterRender = function() {
    const r = this._pendingEvents;
    this._pendingEvents = [];
    for (let h = 0; h < r.length; h++)
      this._dispatchOnBoth(r[h].name, r[h].detail);
    this.dom.hasAttribute("data-ln-persist") && (this.state.key && this.state.values.length > 0 ? tt("filter", this.dom, { key: this.state.key, values: this.state.values.slice() }) : tt("filter", this.dom, null));
  }, i.prototype._dispatchOnBoth = function(r, h) {
    T(this.dom, r, h);
    const l = document.getElementById(this.targetId);
    l && l !== this.dom && T(l, r, h);
  }, i.prototype._filterTableRows = function() {
    const r = document.getElementById(this.targetId);
    if (!r) return;
    const h = r.tagName === "TABLE" ? r : r.querySelector("table");
    if (!h || r.hasAttribute("data-ln-table")) return;
    const l = this.state.key || this._filterKey, a = this.state.values;
    t.has(h) || t.set(h, {});
    const _ = t.get(h);
    if (l && a.length > 0) {
      const v = [];
      for (let w = 0; w < a.length; w++)
        v.push(a[w].toLowerCase());
      _[l] = { col: this.colIndex, values: v };
    } else l && delete _[l];
    const d = Object.keys(_), b = d.length > 0, E = h.tBodies;
    for (let v = 0; v < E.length; v++) {
      const w = E[v].rows;
      for (let A = 0; A < w.length; A++) {
        const C = w[A];
        if (!b) {
          C.removeAttribute(g);
          continue;
        }
        let k = !0;
        for (let D = 0; D < d.length; D++) {
          const N = _[d[D]], M = C.cells[N.col], U = M ? M.textContent.trim().toLowerCase() : "";
          if (N.values.indexOf(U) === -1) {
            k = !1;
            break;
          }
        }
        k ? C.removeAttribute(g) : C.setAttribute(g, "true");
      }
    }
  }, i.prototype.filter = function(r, h) {
    if (Array.isArray(h)) {
      if (h.length === 0) {
        this.reset();
        return;
      }
      this.state.key = r, this.state.values = h.slice();
    } else if (h)
      this.state.key = r, this.state.values = [h];
    else {
      this.reset();
      return;
    }
    this._pendingEvents.push({
      name: "ln-filter:changed",
      detail: { key: this.state.key, values: this.state.values.slice() }
    });
  }, i.prototype.reset = function() {
    this._pendingEvents.push({ name: "ln-filter:reset", detail: {} }), this.state.key = null, this.state.values = [];
  }, i.prototype.getActive = function() {
    return this.state.key === null || this.state.values.length === 0 ? null : { key: this.state.key, values: this.state.values.slice() };
  }, i.prototype.destroy = function() {
    if (this.dom[c]) {
      if (this.colIndex !== null) {
        const r = document.getElementById(this.targetId);
        if (r) {
          const h = r.tagName === "TABLE" ? r : r.querySelector("table");
          if (h && t.has(h)) {
            const l = t.get(h), a = this.state.key || this._filterKey;
            a && l[a] && delete l[a], Object.keys(l).length === 0 && t.delete(h);
          }
        }
      }
      this.inputs.forEach(function(r) {
        r._lnFilterChange && (r.removeEventListener("change", r._lnFilterChange), delete r._lnFilterChange), delete r[c + "Bound"];
      }), this.dom.removeAttribute(y), delete this.dom[c];
    }
  }, j(f, c, i, "ln-filter");
})();
(function() {
  const f = "data-ln-search", c = "lnSearch", y = "data-ln-search-initialized", p = "data-ln-search-hide";
  if (window[c] !== void 0) return;
  function g(s) {
    if (s.hasAttribute(y)) return this;
    this.dom = s, this.targetId = s.getAttribute(f);
    const n = s.tagName;
    if (this.input = n === "INPUT" || n === "TEXTAREA" ? s : s.querySelector('[name="search"]') || s.querySelector('input[type="search"]') || s.querySelector('input[type="text"]'), this.itemsSelector = s.getAttribute("data-ln-search-items") || null, this._debounceTimer = null, this._attachHandler(), this.input && this.input.value.trim()) {
      const t = this;
      queueMicrotask(function() {
        t._search(t.input.value.trim().toLowerCase());
      });
    }
    return s.setAttribute(y, ""), this;
  }
  g.prototype._attachHandler = function() {
    if (!this.input) return;
    const s = this;
    this._clearBtn = this.dom.querySelector("[data-ln-search-clear]"), this._clearBtn && (this._onClear = function() {
      s.input.value = "", s._search(""), s.input.focus();
    }, this._clearBtn.addEventListener("click", this._onClear)), this._onInput = function() {
      clearTimeout(s._debounceTimer), s._debounceTimer = setTimeout(function() {
        s._search(s.input.value.trim().toLowerCase());
      }, 150);
    }, this.input.addEventListener("input", this._onInput);
  }, g.prototype._search = function(s) {
    const n = document.getElementById(this.targetId);
    if (!n || K(n, "ln-search:change", { term: s, targetId: this.targetId }).defaultPrevented) return;
    const o = this.itemsSelector ? n.querySelectorAll(this.itemsSelector) : n.children;
    for (let e = 0; e < o.length; e++) {
      const i = o[e];
      i.removeAttribute(p), s && !i.textContent.replace(/\s+/g, " ").toLowerCase().includes(s) && i.setAttribute(p, "true");
    }
  }, g.prototype.destroy = function() {
    this.dom[c] && (clearTimeout(this._debounceTimer), this.input && this._onInput && this.input.removeEventListener("input", this._onInput), this._clearBtn && this._onClear && this._clearBtn.removeEventListener("click", this._onClear), this.dom.removeAttribute(y), delete this.dom[c]);
  }, j(f, c, g, "ln-search");
})();
(function() {
  const f = "lnTableSort", c = "data-ln-sort", y = "data-ln-sort-active";
  if (window[f] !== void 0) return;
  function p(t) {
    m(t);
  }
  function m(t) {
    const o = Array.from(t.querySelectorAll("table"));
    t.tagName === "TABLE" && o.push(t), o.forEach(function(e) {
      if (e[f]) return;
      const i = Array.from(e.querySelectorAll("th[" + c + "]"));
      i.length && (e[f] = new s(e, i));
    });
  }
  function g(t, o) {
    t.querySelectorAll("[data-ln-sort-icon]").forEach(function(i) {
      const r = i.getAttribute("data-ln-sort-icon");
      o == null ? i.classList.toggle("hidden", r !== null && r !== "") : i.classList.toggle("hidden", r !== o);
    });
  }
  function s(t, o) {
    this.table = t, this.ths = o, this._col = -1, this._dir = null;
    const e = this;
    o.forEach(function(r, h) {
      r[f + "Bound"] || (r[f + "Bound"] = !0, r._lnSortClick = function(l) {
        const a = l.target.closest("button, a, input, select, textarea, [data-ln-dropdown]");
        a && a !== r || e._handleClick(h, r);
      }, r.addEventListener("click", r._lnSortClick));
    });
    const i = t.closest("[data-ln-table][data-ln-persist]");
    if (i) {
      const r = mt("table-sort", i);
      r && r.dir && r.col >= 0 && r.col < o.length && (this._handleClick(r.col, o[r.col]), r.dir === "desc" && this._handleClick(r.col, o[r.col]));
    }
    return this;
  }
  s.prototype._handleClick = function(t, o) {
    let e;
    this._col !== t ? e = "asc" : this._dir === "asc" ? e = "desc" : this._dir === "desc" ? e = null : e = "asc", this.ths.forEach(function(r) {
      r.removeAttribute(y), g(r, null);
    }), e === null ? (this._col = -1, this._dir = null) : (this._col = t, this._dir = e, o.setAttribute(y, e), g(o, e)), T(this.table, "ln-table:sort", {
      column: t,
      sortType: o.getAttribute(c),
      direction: e
    });
    const i = this.table.closest("[data-ln-table][data-ln-persist]");
    i && (e === null ? tt("table-sort", i, null) : tt("table-sort", i, { col: t, dir: e }));
  }, s.prototype.destroy = function() {
    this.table[f] && (this.ths.forEach(function(t) {
      t._lnSortClick && (t.removeEventListener("click", t._lnSortClick), delete t._lnSortClick), delete t[f + "Bound"];
    }), delete this.table[f]);
  };
  function n() {
    H(function() {
      new MutationObserver(function(o) {
        o.forEach(function(e) {
          e.type === "childList" ? e.addedNodes.forEach(function(i) {
            i.nodeType === 1 && m(i);
          }) : e.type === "attributes" && m(e.target);
        });
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: [c] });
    }, "ln-table-sort");
  }
  window[f] = p, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const f = "data-ln-table", c = "lnTable", y = "data-ln-sort", p = "data-ln-table-empty";
  if (window[c] !== void 0) return;
  const s = typeof Intl < "u" ? new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" }) : null;
  function n(t) {
    this.dom = t, this.table = t.querySelector("table"), this.tbody = t.querySelector("tbody"), this.thead = t.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._sortType = null, this._columnFilters = {}, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._colgroup = null;
    const o = t.querySelector(".ln-table__toolbar");
    o && t.style.setProperty("--ln-table-toolbar-h", o.offsetHeight + "px");
    const e = this;
    if (this.tbody && this.tbody.rows.length > 0)
      this._parseRows();
    else if (this.tbody) {
      const i = new MutationObserver(function() {
        e.tbody.rows.length > 0 && (i.disconnect(), e._parseRows());
      });
      i.observe(this.tbody, { childList: !0 });
    }
    return this._onSearch = function(i) {
      i.preventDefault(), e._searchTerm = i.detail.term, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-search:change", this._onSearch), this._onSort = function(i) {
      e._sortCol = i.detail.direction === null ? -1 : i.detail.column, e._sortDir = i.detail.direction, e._sortType = i.detail.sortType, e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-table:sort", this._onSort), this._onColumnFilter = function(i) {
      const r = i.detail.key;
      let h = !1;
      for (let _ = 0; _ < e.ths.length; _++)
        if (e.ths[_].getAttribute("data-ln-filter-col") === r) {
          h = !0;
          break;
        }
      if (!h) return;
      const l = i.detail.values;
      if (!l || l.length === 0)
        delete e._columnFilters[r];
      else {
        const _ = [];
        for (let d = 0; d < l.length; d++)
          _.push(l[d].toLowerCase());
        e._columnFilters[r] = _;
      }
      const a = e.dom.querySelector('th[data-ln-filter-col="' + r + '"]');
      a && (l && l.length > 0 ? a.setAttribute("data-ln-filter-active", "") : a.removeAttribute("data-ln-filter-active")), e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: e._searchTerm,
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("ln-filter:changed", this._onColumnFilter), this._onClear = function(i) {
      if (!i.target.closest("[data-ln-table-clear]")) return;
      e._searchTerm = "";
      const h = document.querySelector('[data-ln-search="' + t.id + '"]');
      if (h) {
        const a = h.tagName === "INPUT" ? h : h.querySelector("input");
        a && (a.value = "");
      }
      e._columnFilters = {};
      for (let a = 0; a < e.ths.length; a++)
        e.ths[a].removeAttribute("data-ln-filter-active");
      const l = document.querySelectorAll('[data-ln-filter="' + t.id + '"]');
      for (let a = 0; a < l.length; a++)
        l[a].lnFilter && l[a].lnFilter.reset();
      e._applyFilterAndSort(), e._vStart = -1, e._vEnd = -1, e._render(), T(t, "ln-table:filter", {
        term: "",
        matched: e._filteredData.length,
        total: e._data.length
      });
    }, t.addEventListener("click", this._onClear), this;
  }
  n.prototype._parseRows = function() {
    const t = this.tbody.rows, o = this.ths;
    this._data = [];
    const e = [];
    for (let i = 0; i < o.length; i++)
      e[i] = o[i].getAttribute(y);
    t.length > 0 && (this._rowHeight = t[0].offsetHeight || 40), this._lockColumnWidths();
    for (let i = 0; i < t.length; i++) {
      const r = t[i], h = [], l = [], a = [];
      for (let _ = 0; _ < r.cells.length; _++) {
        const d = r.cells[_], b = d.textContent.trim(), E = d.hasAttribute("data-ln-value") ? d.getAttribute("data-ln-value") : b, v = e[_];
        l[_] = b.toLowerCase(), v === "number" || v === "date" ? h[_] = parseFloat(E) || 0 : v === "string" ? h[_] = String(E) : h[_] = null, _ < r.cells.length - 1 && a.push(b.toLowerCase());
      }
      this._data.push({
        sortKeys: h,
        rawTexts: l,
        html: r.outerHTML,
        searchText: a.join(" ")
      });
    }
    this._filteredData = this._data.slice(), this._render(), T(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, n.prototype._applyFilterAndSort = function() {
    const t = this._searchTerm, o = this._columnFilters, e = Object.keys(o).length > 0, i = this.ths, r = {};
    if (e)
      for (let d = 0; d < i.length; d++) {
        const b = i[d].getAttribute("data-ln-filter-col");
        b && (r[b] = d);
      }
    if (!t && !e ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(d) {
      if (t && d.searchText.indexOf(t) === -1) return !1;
      if (e)
        for (const b in o) {
          const E = r[b];
          if (E !== void 0 && o[b].indexOf(d.rawTexts[E]) === -1)
            return !1;
        }
      return !0;
    }), this._sortCol < 0 || !this._sortDir) return;
    const h = this._sortCol, l = this._sortDir === "desc" ? -1 : 1, a = this._sortType === "number" || this._sortType === "date", _ = s ? s.compare : function(d, b) {
      return d < b ? -1 : d > b ? 1 : 0;
    };
    this._filteredData.sort(function(d, b) {
      const E = d.sortKeys[h], v = b.sortKeys[h];
      return a ? (E - v) * l : _(E, v) * l;
    });
  }, n.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const t = document.createElement("colgroup");
    this.ths.forEach(function(o) {
      const e = document.createElement("col");
      e.style.width = o.offsetWidth + "px", t.appendChild(e);
    }), this.table.insertBefore(t, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = t;
  }, n.prototype._render = function() {
    if (!this.tbody) return;
    const t = this._filteredData.length;
    t === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : t > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, n.prototype._renderAll = function() {
    const t = [], o = this._filteredData;
    for (let e = 0; e < o.length; e++) t.push(o[e].html);
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
    const t = this._filteredData, o = t.length, e = this._rowHeight;
    if (!e || !o) return;
    const r = this.table.getBoundingClientRect().top + window.scrollY, h = this.thead ? this.thead.offsetHeight : 0, l = r + h, a = window.scrollY - l, _ = Math.max(0, Math.floor(a / e) - 15), d = Math.min(_ + Math.ceil(window.innerHeight / e) + 30, o);
    if (_ === this._vStart && d === this._vEnd) return;
    this._vStart = _, this._vEnd = d;
    const b = this.ths.length || 1, E = _ * e, v = (o - d) * e;
    let w = "";
    E > 0 && (w += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + b + '" style="height:' + E + 'px;padding:0;border:none"></td></tr>');
    for (let A = _; A < d; A++) w += t[A].html;
    v > 0 && (w += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + b + '" style="height:' + v + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = w;
  }, n.prototype._showEmptyState = function() {
    const t = this.ths.length || 1, o = this.dom.querySelector("template[" + p + "]"), e = document.createElement("td");
    e.setAttribute("colspan", String(t)), o && e.appendChild(document.importNode(o.content, !0));
    const i = document.createElement("tr");
    i.className = "ln-table__empty", i.appendChild(e), this.tbody.innerHTML = "", this.tbody.appendChild(i), T(this.dom, "ln-table:empty", {
      term: this._searchTerm,
      total: this._data.length
    });
  }, n.prototype.destroy = function() {
    this.dom[c] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-search:change", this._onSearch), this.dom.removeEventListener("ln-table:sort", this._onSort), this.dom.removeEventListener("ln-filter:changed", this._onColumnFilter), this.dom.removeEventListener("click", this._onClear), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[c]);
  }, j(f, c, n, "ln-table");
})();
(function() {
  const f = "data-ln-circular-progress", c = "lnCircularProgress";
  if (window[c] !== void 0) return;
  const y = "http://www.w3.org/2000/svg", p = 36, m = 16, g = 2 * Math.PI * m;
  function s(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, this._attrObserver = null, t.call(this), e.call(this), o.call(this), i.setAttribute("data-ln-circular-progress-initialized", ""), this;
  }
  s.prototype.destroy = function() {
    this.dom[c] && (this._attrObserver && this._attrObserver.disconnect(), this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), this.dom.removeAttribute("data-ln-circular-progress-initialized"), delete this.dom[c]);
  };
  function n(i, r) {
    const h = document.createElementNS(y, i);
    for (const l in r)
      h.setAttribute(l, r[l]);
    return h;
  }
  function t() {
    this.svg = n("svg", {
      viewBox: "0 0 " + p + " " + p,
      "aria-hidden": "true"
    }), this.trackCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: m,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: m,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": g,
      "stroke-dashoffset": g,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function o() {
    const i = this, r = new MutationObserver(function(h) {
      for (const l of h)
        (l.attributeName === "data-ln-circular-progress" || l.attributeName === "data-ln-circular-progress-max") && e.call(i);
    });
    r.observe(this.dom, {
      attributes: !0,
      attributeFilter: ["data-ln-circular-progress", "data-ln-circular-progress-max"]
    }), this._attrObserver = r;
  }
  function e() {
    const i = parseFloat(this.dom.getAttribute("data-ln-circular-progress")) || 0, r = parseFloat(this.dom.getAttribute("data-ln-circular-progress-max")) || 100;
    let h = r > 0 ? i / r * 100 : 0;
    h < 0 && (h = 0), h > 100 && (h = 100);
    const l = g - h / 100 * g;
    this.progressCircle.setAttribute("stroke-dashoffset", l);
    const a = this.dom.getAttribute("data-ln-circular-progress-label");
    this.labelEl.textContent = a !== null ? a : Math.round(h) + "%", T(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: i,
      max: r,
      percentage: h
    });
  }
  j(f, c, s, "ln-circular-progress");
})();
(function() {
  const f = "data-ln-sortable", c = "lnSortable", y = "data-ln-sortable-handle";
  if (window[c] !== void 0) return;
  function p(s) {
    z(s, f, c, m);
  }
  function m(s) {
    this.dom = s, this.isEnabled = s.getAttribute(f) !== "disabled", this._dragging = null, s.setAttribute("aria-roledescription", "sortable list");
    const n = this;
    return this._onPointerDown = function(t) {
      n.isEnabled && n._handlePointerDown(t);
    }, s.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.enable = function() {
    this.isEnabled || this.dom.setAttribute(f, "");
  }, m.prototype.disable = function() {
    this.isEnabled && this.dom.setAttribute(f, "disabled");
  }, m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), T(this.dom, "ln-sortable:destroyed", { target: this.dom }), delete this.dom[c]);
  }, m.prototype._handlePointerDown = function(s) {
    let n = s.target.closest("[" + y + "]"), t;
    if (n) {
      for (t = n; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + y + "]")) return;
      for (t = s.target; t && t.parentElement !== this.dom; )
        t = t.parentElement;
      if (!t || t.parentElement !== this.dom) return;
      n = t;
    }
    const e = Array.from(this.dom.children).indexOf(t);
    if (K(this.dom, "ln-sortable:before-drag", {
      item: t,
      index: e
    }).defaultPrevented) return;
    s.preventDefault(), n.setPointerCapture(s.pointerId), this._dragging = t, t.classList.add("ln-sortable--dragging"), t.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), T(this.dom, "ln-sortable:drag-start", {
      item: t,
      index: e
    });
    const r = this, h = function(a) {
      r._handlePointerMove(a);
    }, l = function(a) {
      r._handlePointerEnd(a), n.removeEventListener("pointermove", h), n.removeEventListener("pointerup", l), n.removeEventListener("pointercancel", l);
    };
    n.addEventListener("pointermove", h), n.addEventListener("pointerup", l), n.addEventListener("pointercancel", l);
  }, m.prototype._handlePointerMove = function(s) {
    if (!this._dragging) return;
    const n = Array.from(this.dom.children), t = this._dragging;
    for (const o of n)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const o of n) {
      if (o === t) continue;
      const e = o.getBoundingClientRect(), i = e.top + e.height / 2;
      if (s.clientY >= e.top && s.clientY < i) {
        o.classList.add("ln-sortable--drop-before");
        break;
      } else if (s.clientY >= i && s.clientY <= e.bottom) {
        o.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(s) {
    if (!this._dragging) return;
    const n = this._dragging, t = Array.from(this.dom.children), o = t.indexOf(n);
    let e = null, i = null;
    for (const r of t) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        e = r, i = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        e = r, i = "after";
        break;
      }
    }
    for (const r of t)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (n.classList.remove("ln-sortable--dragging"), n.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), e && e !== n) {
      i === "before" ? this.dom.insertBefore(n, e) : this.dom.insertBefore(n, e.nextElementSibling);
      const h = Array.from(this.dom.children).indexOf(n);
      T(this.dom, "ln-sortable:reordered", {
        item: n,
        oldIndex: o,
        newIndex: h
      });
    }
    this._dragging = null;
  };
  function g() {
    H(function() {
      new MutationObserver(function(n) {
        for (let t = 0; t < n.length; t++) {
          const o = n[t];
          if (o.type === "childList")
            for (let e = 0; e < o.addedNodes.length; e++) {
              const i = o.addedNodes[e];
              i.nodeType === 1 && z(i, f, c, m);
            }
          else if (o.type === "attributes") {
            const e = o.target, i = e[c];
            if (i) {
              const r = e.getAttribute(f) !== "disabled";
              r !== i.isEnabled && (i.isEnabled = r, T(e, r ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: e }));
            } else
              z(e, f, c, m);
          }
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-sortable");
  }
  window[c] = p, g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    p(document.body);
  }) : p(document.body);
})();
(function() {
  const f = "data-ln-confirm", c = "lnConfirm", y = "data-ln-confirm-timeout";
  if (window[c] !== void 0) return;
  function m(t) {
    z(t, f, c, g);
  }
  function g(t) {
    this.dom = t, this.confirming = !1, this.originalText = t.textContent.trim(), this.confirmText = t.getAttribute(f) || "Confirm?", this.revertTimer = null, this._submitted = !1;
    const o = this;
    return this._onClick = function(e) {
      if (!o.confirming)
        e.preventDefault(), e.stopImmediatePropagation(), o._enterConfirm();
      else {
        if (o._submitted) return;
        o._submitted = !0, o._reset();
      }
    }, t.addEventListener("click", this._onClick), this;
  }
  g.prototype._getTimeout = function() {
    const t = parseFloat(this.dom.getAttribute(y));
    return isNaN(t) || t <= 0 ? 3 : t;
  }, g.prototype._enterConfirm = function() {
    this.confirming = !0, this.dom.setAttribute("data-confirming", "true");
    var t = this.dom.querySelector("svg.ln-icon use");
    t && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = t.getAttribute("href"), t.setAttribute("href", "#ln-check"), this.dom.classList.add("ln-confirm-tooltip"), this.dom.setAttribute("data-tooltip-text", this.confirmText)) : this.dom.textContent = this.confirmText, this._startTimer(), T(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, g.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const t = this, o = this._getTimeout() * 1e3;
    this.revertTimer = setTimeout(function() {
      t._reset();
    }, o);
  }, g.prototype._reset = function() {
    if (this._submitted = !1, this.confirming = !1, this.dom.removeAttribute("data-confirming"), this.isIconButton) {
      var t = this.dom.querySelector("svg.ln-icon use");
      t && this.originalIconHref && t.setAttribute("href", this.originalIconHref), this.dom.classList.remove("ln-confirm-tooltip"), this.dom.removeAttribute("data-tooltip-text"), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, g.prototype.destroy = function() {
    this.dom[c] && (this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[c]);
  };
  function s(t) {
    const o = t[c];
    !o || !o.confirming || o._startTimer();
  }
  function n() {
    H(function() {
      new MutationObserver(function(o) {
        for (let e = 0; e < o.length; e++) {
          const i = o[e];
          if (i.type === "childList")
            for (let r = 0; r < i.addedNodes.length; r++) {
              const h = i.addedNodes[r];
              h.nodeType === 1 && z(h, f, c, g);
            }
          else i.type === "attributes" && (i.attributeName === y && i.target[c] ? s(i.target) : z(i.target, f, c, g));
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f, y]
      });
    }, "ln-confirm");
  }
  window[c] = m, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    m(document.body);
  }) : m(document.body);
})();
(function() {
  const f = "data-ln-translations", c = "lnTranslations";
  if (window[c] !== void 0) return;
  const y = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(m) {
    this.dom = m, this.activeLanguages = /* @__PURE__ */ new Set(), this.defaultLang = m.getAttribute(f + "-default") || "", this.badgesEl = m.querySelector("[" + f + "-active]"), this.menuEl = m.querySelector("[data-ln-dropdown] > [data-ln-toggle]");
    const g = m.getAttribute(f + "-locales");
    if (this.locales = y, g)
      try {
        this.locales = JSON.parse(g);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const s = this;
    return this._onRequestAdd = function(n) {
      n.detail && n.detail.lang && s.addLanguage(n.detail.lang);
    }, this._onRequestRemove = function(n) {
      n.detail && n.detail.lang && s.removeLanguage(n.detail.lang);
    }, m.addEventListener("ln-translations:request-add", this._onRequestAdd), m.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const m = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const g of m) {
      const s = g.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const m = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const g of m) {
      const s = g.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const m = this;
    let g = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      g++;
      const t = yt("ln-translations-menu-item", "ln-translations");
      if (!t) return;
      const o = t.querySelector("[data-ln-translations-lang]");
      o.setAttribute("data-ln-translations-lang", n), o.textContent = this.locales[n], o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), m.menuEl.getAttribute("data-ln-toggle") === "open" && m.menuEl.setAttribute("data-ln-toggle", "close"), m.addLanguage(n));
      }), this.menuEl.appendChild(t);
    }
    const s = this.dom.querySelector("[" + f + "-add]");
    s && (s.style.display = g === 0 ? "none" : "");
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const m = this;
    this.activeLanguages.forEach(function(g) {
      const s = yt("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", g);
      const t = n.querySelector("span");
      t.textContent = m.locales[g] || g.toUpperCase();
      const o = n.querySelector("button");
      o.setAttribute("aria-label", "Remove " + (m.locales[g] || g.toUpperCase())), o.addEventListener("click", function(e) {
        e.ctrlKey || e.metaKey || e.button === 1 || (e.preventDefault(), e.stopPropagation(), m.removeLanguage(g));
      }), m.badgesEl.appendChild(s);
    });
  }, p.prototype.addLanguage = function(m, g) {
    if (this.activeLanguages.has(m)) return;
    const s = this.locales[m] || m;
    if (K(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: m,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(m), g = g || {};
    const t = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of t) {
      const e = o.getAttribute("data-ln-translatable"), i = o.getAttribute("data-ln-translations-prefix") || "", r = o.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!r) continue;
      const h = r.cloneNode(!1);
      i ? h.name = i + "[trans][" + m + "][" + e + "]" : h.name = "trans[" + m + "][" + e + "]", h.value = g[e] !== void 0 ? g[e] : "", h.removeAttribute("id"), h.placeholder = s + " translation", h.setAttribute("data-ln-translatable-lang", m);
      const l = o.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = l.length > 0 ? l[l.length - 1] : r;
      a.parentNode.insertBefore(h, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: m,
      langName: s
    });
  }, p.prototype.removeLanguage = function(m) {
    if (!this.activeLanguages.has(m) || K(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: m
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + m + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(m), this._updateDropdown(), this._updateBadges(), T(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: m
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(m) {
    return this.activeLanguages.has(m);
  }, p.prototype.destroy = function() {
    if (!this.dom[c]) return;
    const m = this.defaultLang, g = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of g)
      s.getAttribute("data-ln-translatable-lang") !== m && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[c];
  }, j(f, c, p, "ln-translations");
})();
(function() {
  const f = "data-ln-autosave", c = "lnAutosave", y = "data-ln-autosave-clear", p = "ln-autosave:";
  if (window[c] !== void 0) return;
  function m(n) {
    const t = g(n);
    if (!t) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", n);
      return;
    }
    this.dom = n, this.key = t;
    const o = this;
    return this._onFocusout = function(e) {
      const i = e.target;
      s(i) && i.name && o.save();
    }, this._onChange = function(e) {
      const i = e.target;
      s(i) && i.name && o.save();
    }, this._onSubmit = function() {
      o.clear();
    }, this._onReset = function() {
      o.clear();
    }, this._onClearClick = function(e) {
      e.target.closest("[" + y + "]") && o.clear();
    }, n.addEventListener("focusout", this._onFocusout), n.addEventListener("change", this._onChange), n.addEventListener("submit", this._onSubmit), n.addEventListener("reset", this._onReset), n.addEventListener("click", this._onClearClick), this.restore(), this;
  }
  m.prototype.save = function() {
    const n = St(this.dom);
    try {
      localStorage.setItem(this.key, JSON.stringify(n));
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:saved", { target: this.dom, data: n });
  }, m.prototype.restore = function() {
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
    if (K(this.dom, "ln-autosave:before-restore", { target: this.dom, data: t }).defaultPrevented) return;
    const e = Lt(this.dom, t);
    for (let i = 0; i < e.length; i++)
      e[i].dispatchEvent(new Event("input", { bubbles: !0 })), e[i].dispatchEvent(new Event("change", { bubbles: !0 })), e[i].lnSelect && e[i].lnSelect.setValue && e[i].lnSelect.setValue(t[e[i].name]);
    T(this.dom, "ln-autosave:restored", { target: this.dom, data: t });
  }, m.prototype.clear = function() {
    try {
      localStorage.removeItem(this.key);
    } catch {
      return;
    }
    T(this.dom, "ln-autosave:cleared", { target: this.dom });
  }, m.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), T(this.dom, "ln-autosave:destroyed", { target: this.dom }), delete this.dom[c]);
  };
  function g(n) {
    const o = n.getAttribute(f) || n.id;
    return o ? p + window.location.pathname + ":" + o : null;
  }
  function s(n) {
    const t = n.tagName;
    return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
  }
  j(f, c, m, "ln-autosave");
})();
(function() {
  const f = "data-ln-autoresize", c = "lnAutoresize";
  if (window[c] !== void 0) return;
  function y(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const m = this;
    return this._onInput = function() {
      m._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  y.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, y.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[c]);
  }, j(f, c, y, "ln-autoresize");
})();
(function() {
  const f = "data-ln-validate", c = "lnValidate", y = "data-ln-validate-errors", p = "data-ln-validate-error", m = "ln-validate-valid", g = "ln-validate-invalid", s = {
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
    const o = this, e = t.tagName, i = t.type, r = e === "SELECT" || i === "checkbox" || i === "radio";
    return this._onInput = function() {
      o._touched = !0, o.validate();
    }, this._onChange = function() {
      o._touched = !0, o.validate();
    }, this._onSetCustom = function(h) {
      const l = h.detail && h.detail.error;
      if (!l) return;
      o._customErrors.add(l), o._touched = !0;
      const a = t.closest(".form-element");
      if (a) {
        const _ = a.querySelector("[" + p + '="' + l + '"]');
        _ && _.classList.remove("hidden");
      }
      t.classList.remove(m), t.classList.add(g);
    }, this._onClearCustom = function(h) {
      const l = h.detail && h.detail.error, a = t.closest(".form-element");
      if (l) {
        if (o._customErrors.delete(l), a) {
          const _ = a.querySelector("[" + p + '="' + l + '"]');
          _ && _.classList.add("hidden");
        }
      } else
        o._customErrors.forEach(function(_) {
          if (a) {
            const d = a.querySelector("[" + p + '="' + _ + '"]');
            d && d.classList.add("hidden");
          }
        }), o._customErrors.clear();
      o._touched && o.validate();
    }, r || t.addEventListener("input", this._onInput), t.addEventListener("change", this._onChange), t.addEventListener("ln-validate:set-custom", this._onSetCustom), t.addEventListener("ln-validate:clear-custom", this._onClearCustom), this;
  }
  n.prototype.validate = function() {
    const t = this.dom, o = t.validity, i = t.checkValidity() && this._customErrors.size === 0, r = t.closest(".form-element");
    if (r) {
      const l = r.querySelector("[" + y + "]");
      if (l) {
        const a = l.querySelectorAll("[" + p + "]");
        for (let _ = 0; _ < a.length; _++) {
          const d = a[_].getAttribute(p), b = s[d];
          b && (o[b] ? a[_].classList.remove("hidden") : a[_].classList.add("hidden"));
        }
      }
    }
    return t.classList.toggle(m, i), t.classList.toggle(g, !i), T(t, i ? "ln-validate:valid" : "ln-validate:invalid", { target: t, field: t.name }), i;
  }, n.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(m, g);
    const t = this.dom.closest(".form-element");
    if (t) {
      const o = t.querySelectorAll("[" + p + "]");
      for (let e = 0; e < o.length; e++)
        o[e].classList.add("hidden");
    }
  }, Object.defineProperty(n.prototype, "isValid", {
    get: function() {
      return this.dom.checkValidity() && this._customErrors.size === 0;
    }
  }), n.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom), this.dom.classList.remove(m, g), T(this.dom, "ln-validate:destroyed", { target: this.dom }), delete this.dom[c]);
  }, j(f, c, n, "ln-validate");
})();
(function() {
  const f = "data-ln-form", c = "lnForm", y = "data-ln-form-auto", p = "data-ln-form-debounce", m = "data-ln-validate", g = "lnValidate";
  if (window[c] !== void 0) return;
  function s(n) {
    this.dom = n, this._invalidFields = /* @__PURE__ */ new Set(), this._debounceTimer = null;
    const t = this;
    if (this._onValid = function(o) {
      t._invalidFields.delete(o.detail.field), t._updateSubmitButton();
    }, this._onInvalid = function(o) {
      t._invalidFields.add(o.detail.field), t._updateSubmitButton();
    }, this._onSubmit = function(o) {
      o.preventDefault(), t.submit();
    }, this._onFill = function(o) {
      o.detail && t.fill(o.detail);
    }, this._onFormReset = function() {
      t.reset();
    }, this._onNativeReset = function() {
      setTimeout(function() {
        t._resetValidation();
      }, 0);
    }, n.addEventListener("ln-validate:valid", this._onValid), n.addEventListener("ln-validate:invalid", this._onInvalid), n.addEventListener("submit", this._onSubmit), n.addEventListener("ln-form:fill", this._onFill), n.addEventListener("ln-form:reset", this._onFormReset), n.addEventListener("reset", this._onNativeReset), this._onAutoInput = null, n.hasAttribute(y)) {
      const o = parseInt(n.getAttribute(p)) || 0;
      this._onAutoInput = function() {
        o > 0 ? (clearTimeout(t._debounceTimer), t._debounceTimer = setTimeout(function() {
          t.submit();
        }, o)) : t.submit();
      }, n.addEventListener("input", this._onAutoInput), n.addEventListener("change", this._onAutoInput);
    }
    return this._updateSubmitButton(), this;
  }
  s.prototype._updateSubmitButton = function() {
    const n = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (!n.length) return;
    const t = this.dom.querySelectorAll("[" + m + "]");
    let o = !1;
    if (t.length > 0) {
      let e = !1, i = !1;
      for (let r = 0; r < t.length; r++) {
        const h = t[r][g];
        h && h._touched && (e = !0), t[r].checkValidity() || (i = !0);
      }
      o = i || !e;
    }
    for (let e = 0; e < n.length; e++)
      n[e].disabled = o;
  }, s.prototype.fill = function(n) {
    const t = Lt(this.dom, n);
    for (let o = 0; o < t.length; o++) {
      const e = t[o], i = e.tagName === "SELECT" || e.type === "checkbox" || e.type === "radio";
      e.dispatchEvent(new Event(i ? "change" : "input", { bubbles: !0 }));
    }
  }, s.prototype.submit = function() {
    const n = this.dom.querySelectorAll("[" + m + "]");
    let t = !0;
    for (let e = 0; e < n.length; e++) {
      const i = n[e][g];
      i && (i.validate() || (t = !1));
    }
    if (!t) return;
    const o = St(this.dom);
    T(this.dom, "ln-form:submit", { data: o });
  }, s.prototype.reset = function() {
    this.dom.reset(), this._resetValidation();
  }, s.prototype._resetValidation = function() {
    this._invalidFields.clear();
    const n = this.dom.querySelectorAll("[" + m + "]");
    for (let t = 0; t < n.length; t++) {
      const o = n[t][g];
      o && o.reset();
    }
    this._updateSubmitButton();
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      const n = this.dom.querySelectorAll("[" + m + "]");
      for (let t = 0; t < n.length; t++)
        if (!n[t].checkValidity()) return !1;
      return !0;
    }
  }), s.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-validate:valid", this._onValid), this.dom.removeEventListener("ln-validate:invalid", this._onInvalid), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("ln-form:fill", this._onFill), this.dom.removeEventListener("ln-form:reset", this._onFormReset), this.dom.removeEventListener("reset", this._onNativeReset), this._onAutoInput && (this.dom.removeEventListener("input", this._onAutoInput), this.dom.removeEventListener("change", this._onAutoInput)), clearTimeout(this._debounceTimer), T(this.dom, "ln-form:destroyed", { target: this.dom }), delete this.dom[c]);
  }, j(f, c, s, "ln-form");
})();
(function() {
  const f = "data-ln-time", c = "lnTime";
  if (window[c] !== void 0) return;
  const y = {}, p = {};
  function m(w) {
    return w.getAttribute("data-ln-time-locale") || document.documentElement.lang || void 0;
  }
  function g(w, A) {
    const C = (w || "") + "|" + JSON.stringify(A);
    return y[C] || (y[C] = new Intl.DateTimeFormat(w, A)), y[C];
  }
  function s(w) {
    const A = w || "";
    return p[A] || (p[A] = new Intl.RelativeTimeFormat(w, { numeric: "auto", style: "narrow" })), p[A];
  }
  const n = /* @__PURE__ */ new Set();
  let t = null;
  function o() {
    t || (t = setInterval(i, 6e4));
  }
  function e() {
    t && (clearInterval(t), t = null);
  }
  function i() {
    for (const w of n) {
      if (!document.body.contains(w.dom)) {
        n.delete(w);
        continue;
      }
      d(w);
    }
    n.size === 0 && e();
  }
  function r(w, A) {
    return g(A, { dateStyle: "long", timeStyle: "short" }).format(w);
  }
  function h(w, A) {
    const C = /* @__PURE__ */ new Date(), k = { month: "short", day: "numeric" };
    return w.getFullYear() !== C.getFullYear() && (k.year = "numeric"), g(A, k).format(w);
  }
  function l(w, A) {
    return g(A, { dateStyle: "medium" }).format(w);
  }
  function a(w, A) {
    return g(A, { timeStyle: "short" }).format(w);
  }
  function _(w, A) {
    const C = Math.floor(Date.now() / 1e3), D = Math.floor(w.getTime() / 1e3) - C, N = Math.abs(D);
    if (N < 10) return s(A).format(0, "second");
    let M, U;
    if (N < 60)
      M = "second", U = D;
    else if (N < 3600)
      M = "minute", U = Math.round(D / 60);
    else if (N < 86400)
      M = "hour", U = Math.round(D / 3600);
    else if (N < 604800)
      M = "day", U = Math.round(D / 86400);
    else if (N < 2592e3)
      M = "week", U = Math.round(D / 604800);
    else
      return h(w, A);
    return s(A).format(U, M);
  }
  function d(w) {
    const A = w.dom.getAttribute("datetime");
    if (!A) return;
    const C = Number(A);
    if (isNaN(C)) return;
    const k = new Date(C * 1e3), D = w.dom.getAttribute(f) || "short", N = m(w.dom);
    let M;
    switch (D) {
      case "relative":
        M = _(k, N);
        break;
      case "full":
        M = r(k, N);
        break;
      case "date":
        M = l(k, N);
        break;
      case "time":
        M = a(k, N);
        break;
      default:
        M = h(k, N);
        break;
    }
    w.dom.textContent = M, D !== "full" && (w.dom.title = r(k, N));
  }
  function b(w) {
    return this.dom = w, d(this), w.getAttribute(f) === "relative" && (n.add(this), o()), this;
  }
  b.prototype.render = function() {
    d(this);
  }, b.prototype.destroy = function() {
    n.delete(this), n.size === 0 && e(), delete this.dom[c];
  };
  function E(w) {
    z(w, f, c, b);
  }
  function v() {
    H(function() {
      new MutationObserver(function(A) {
        for (const C of A)
          if (C.type === "childList")
            for (const k of C.addedNodes)
              k.nodeType === 1 && z(k, f, c, b);
          else if (C.type === "attributes") {
            const k = C.target;
            k[c] ? (k.getAttribute(f) === "relative" ? (n.add(k[c]), o()) : (n.delete(k[c]), n.size === 0 && e()), d(k[c])) : z(k, f, c, b);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f, "datetime"]
      });
    }, "ln-time");
  }
  v(), window[c] = E, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    E(document.body);
  }) : E(document.body);
})();
(function() {
  const f = "data-ln-store", c = "lnStore";
  if (window[c] !== void 0) return;
  const y = "ln_app_cache", p = "_meta", m = "1.0";
  let g = null, s = null;
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
  function o(u) {
    u && u.name === "QuotaExceededError" && T(document, "ln-store:quota-exceeded", { error: u });
  }
  function e() {
    const u = document.querySelectorAll("[" + f + "]"), L = {};
    for (let S = 0; S < u.length; S++) {
      const O = u[S].getAttribute(f);
      O && (L[O] = {
        indexes: (u[S].getAttribute("data-ln-store-indexes") || "").split(",").map(function(I) {
          return I.trim();
        }).filter(Boolean)
      });
    }
    return L;
  }
  function i() {
    return s || (s = new Promise(function(u, L) {
      if (typeof indexedDB > "u") {
        console.warn("[ln-store] IndexedDB not available — falling back to in-memory store"), u(null);
        return;
      }
      const S = e(), O = Object.keys(S), I = indexedDB.open(y);
      I.onerror = function() {
        console.warn("[ln-store] IndexedDB open failed — falling back to in-memory store"), u(null);
      }, I.onsuccess = function(x) {
        const q = x.target.result, F = Array.from(q.objectStoreNames);
        let V = !1;
        F.indexOf(p) === -1 && (V = !0);
        for (let Q = 0; Q < O.length; Q++)
          if (F.indexOf(O[Q]) === -1) {
            V = !0;
            break;
          }
        if (!V) {
          r(q), g = q, u(q);
          return;
        }
        const lt = q.version;
        q.close();
        const ht = indexedDB.open(y, lt + 1);
        ht.onblocked = function() {
          console.warn("[ln-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, ht.onerror = function() {
          console.warn("[ln-store] Database upgrade failed"), u(null);
        }, ht.onupgradeneeded = function(Q) {
          const J = Q.target.result;
          J.objectStoreNames.contains(p) || J.createObjectStore(p, { keyPath: "key" });
          for (let gt = 0; gt < O.length; gt++) {
            const _t = O[gt];
            if (!J.objectStoreNames.contains(_t)) {
              const Ct = J.createObjectStore(_t, { keyPath: "id" }), bt = S[_t].indexes;
              for (let pt = 0; pt < bt.length; pt++)
                Ct.createIndex(bt[pt], bt[pt], { unique: !1 });
            }
          }
        }, ht.onsuccess = function(Q) {
          const J = Q.target.result;
          r(J), g = J, u(J);
        };
      };
    }), s);
  }
  function r(u) {
    u.onversionchange = function() {
      u.close(), g = null, s = null;
    };
  }
  function h() {
    return g ? Promise.resolve(g) : (s = null, i());
  }
  function l(u, L) {
    return h().then(function(S) {
      return S ? S.transaction(u, L).objectStore(u) : null;
    });
  }
  function a(u) {
    return new Promise(function(L, S) {
      u.onsuccess = function() {
        L(u.result);
      }, u.onerror = function() {
        o(u.error), S(u.error);
      };
    });
  }
  function _(u) {
    return l(u, "readonly").then(function(L) {
      return L ? a(L.getAll()) : [];
    });
  }
  function d(u, L) {
    return l(u, "readonly").then(function(S) {
      return S ? a(S.get(L)) : null;
    });
  }
  function b(u, L) {
    return l(u, "readwrite").then(function(S) {
      if (S)
        return a(S.put(L));
    });
  }
  function E(u, L) {
    return l(u, "readwrite").then(function(S) {
      if (S)
        return a(S.delete(L));
    });
  }
  function v(u) {
    return l(u, "readwrite").then(function(L) {
      if (L)
        return a(L.clear());
    });
  }
  function w(u) {
    return l(u, "readonly").then(function(L) {
      return L ? a(L.count()) : 0;
    });
  }
  function A(u) {
    return l(p, "readonly").then(function(L) {
      return L ? a(L.get(u)) : null;
    });
  }
  function C(u, L) {
    return l(p, "readwrite").then(function(S) {
      if (S)
        return L.key = u, a(S.put(L));
    });
  }
  function k(u) {
    this.dom = u, this._name = u.getAttribute(f), this._endpoint = u.getAttribute("data-ln-store-endpoint") || "";
    const L = u.getAttribute("data-ln-store-stale"), S = parseInt(L, 10);
    this._staleThreshold = L === "never" || L === "-1" ? -1 : isNaN(S) ? 300 : S, this._searchFields = (u.getAttribute("data-ln-store-search-fields") || "").split(",").map(function(I) {
      return I.trim();
    }).filter(Boolean), this._abortController = null, this._handlers = null, this.isLoaded = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.totalCount = 0, n[this._name] = this;
    const O = this;
    return D(O), ut(O), this;
  }
  function D(u) {
    u._handlers = {
      create: function(L) {
        N(u, L.detail);
      },
      update: function(L) {
        M(u, L.detail);
      },
      delete: function(L) {
        U(u, L.detail);
      },
      bulkDelete: function(L) {
        dt(u, L.detail);
      }
    }, u.dom.addEventListener("ln-store:request-create", u._handlers.create), u.dom.addEventListener("ln-store:request-update", u._handlers.update), u.dom.addEventListener("ln-store:request-delete", u._handlers.delete), u.dom.addEventListener("ln-store:request-bulk-delete", u._handlers.bulkDelete);
  }
  function N(u, L) {
    const S = L.data || {}, O = "_temp_" + t(), I = Object.assign({}, S, { id: O });
    b(u._name, I).then(function() {
      return u.totalCount++, T(u.dom, "ln-store:created", {
        store: u._name,
        record: I,
        tempId: O
      }), fetch(u._endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(S)
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      return x.json();
    }).then(function(x) {
      return E(u._name, O).then(function() {
        return b(u._name, x);
      }).then(function() {
        T(u.dom, "ln-store:confirmed", {
          store: u._name,
          record: x,
          tempId: O,
          action: "create"
        });
      });
    }).catch(function(x) {
      E(u._name, O).then(function() {
        u.totalCount--, T(u.dom, "ln-store:reverted", {
          store: u._name,
          record: I,
          action: "create",
          error: x.message
        });
      });
    });
  }
  function M(u, L) {
    const S = L.id, O = L.data || {}, I = L.expected_version;
    let x = null;
    d(u._name, S).then(function(q) {
      if (!q) throw new Error("Record not found: " + S);
      x = Object.assign({}, q);
      const F = Object.assign({}, q, O);
      return b(u._name, F).then(function() {
        return T(u.dom, "ln-store:updated", {
          store: u._name,
          record: F,
          previous: x
        }), F;
      });
    }).then(function(q) {
      const F = Object.assign({}, O);
      return I && (F.expected_version = I), fetch(u._endpoint + "/" + S, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(F)
      });
    }).then(function(q) {
      if (q.status === 409)
        return q.json().then(function(F) {
          return b(u._name, x).then(function() {
            T(u.dom, "ln-store:conflict", {
              store: u._name,
              local: x,
              remote: F.current || F,
              field_diffs: F.field_diffs || null
            });
          });
        });
      if (!q.ok) throw new Error("HTTP " + q.status);
      return q.json().then(function(F) {
        return b(u._name, F).then(function() {
          T(u.dom, "ln-store:confirmed", {
            store: u._name,
            record: F,
            action: "update"
          });
        });
      });
    }).catch(function(q) {
      x && b(u._name, x).then(function() {
        T(u.dom, "ln-store:reverted", {
          store: u._name,
          record: x,
          action: "update",
          error: q.message
        });
      });
    });
  }
  function U(u, L) {
    const S = L.id;
    let O = null;
    d(u._name, S).then(function(I) {
      if (I)
        return O = Object.assign({}, I), E(u._name, S).then(function() {
          return u.totalCount--, T(u.dom, "ln-store:deleted", {
            store: u._name,
            id: S
          }), fetch(u._endpoint + "/" + S, {
            method: "DELETE",
            headers: { Accept: "application/json" }
          });
        });
    }).then(function(I) {
      if (!I || !I.ok) throw new Error("HTTP " + (I ? I.status : "unknown"));
      T(u.dom, "ln-store:confirmed", {
        store: u._name,
        record: O,
        action: "delete"
      });
    }).catch(function(I) {
      O && b(u._name, O).then(function() {
        u.totalCount++, T(u.dom, "ln-store:reverted", {
          store: u._name,
          record: O,
          action: "delete",
          error: I.message
        });
      });
    });
  }
  function dt(u, L) {
    const S = L.ids || [];
    if (S.length === 0) return;
    let O = [];
    const I = S.map(function(x) {
      return d(u._name, x);
    });
    Promise.all(I).then(function(x) {
      return O = x.filter(Boolean), ot(u._name, S).then(function() {
        return u.totalCount -= S.length, T(u.dom, "ln-store:deleted", {
          store: u._name,
          ids: S
        }), fetch(u._endpoint + "/bulk-delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ids: S })
        });
      });
    }).then(function(x) {
      if (!x.ok) throw new Error("HTTP " + x.status);
      T(u.dom, "ln-store:confirmed", {
        store: u._name,
        record: null,
        ids: S,
        action: "bulk-delete"
      });
    }).catch(function(x) {
      O.length > 0 && nt(u._name, O).then(function() {
        u.totalCount += O.length, T(u.dom, "ln-store:reverted", {
          store: u._name,
          record: null,
          ids: S,
          action: "bulk-delete",
          error: x.message
        });
      });
    });
  }
  function ut(u) {
    i().then(function() {
      return A(u._name);
    }).then(function(L) {
      L && L.schema_version === m ? (u.lastSyncedAt = L.last_synced_at || null, u.totalCount = L.record_count || 0, u.totalCount > 0 ? (u.isLoaded = !0, T(u.dom, "ln-store:ready", {
        store: u._name,
        count: u.totalCount,
        source: "cache"
      }), it(u) && et(u)) : X(u)) : L && L.schema_version !== m ? v(u._name).then(function() {
        return C(u._name, {
          schema_version: m,
          last_synced_at: null,
          record_count: 0
        });
      }).then(function() {
        X(u);
      }) : X(u);
    });
  }
  function it(u) {
    return u._staleThreshold === -1 ? !1 : u.lastSyncedAt ? Math.floor(Date.now() / 1e3) - u.lastSyncedAt > u._staleThreshold : !0;
  }
  function X(u) {
    return u._endpoint ? (u.isSyncing = !0, u._abortController = new AbortController(), fetch(u._endpoint, { signal: u._abortController.signal }).then(function(L) {
      if (!L.ok) throw new Error("HTTP " + L.status);
      return L.json();
    }).then(function(L) {
      const S = L.data || [], O = L.synced_at || Math.floor(Date.now() / 1e3);
      return nt(u._name, S).then(function() {
        return C(u._name, {
          schema_version: m,
          last_synced_at: O,
          record_count: S.length
        });
      }).then(function() {
        u.isLoaded = !0, u.isSyncing = !1, u.lastSyncedAt = O, u.totalCount = S.length, u._abortController = null, T(u.dom, "ln-store:loaded", {
          store: u._name,
          count: S.length
        }), T(u.dom, "ln-store:ready", {
          store: u._name,
          count: S.length,
          source: "server"
        });
      });
    }).catch(function(L) {
      u.isSyncing = !1, u._abortController = null, L.name !== "AbortError" && (u.isLoaded ? T(u.dom, "ln-store:offline", { store: u._name }) : T(u.dom, "ln-store:error", {
        store: u._name,
        action: "full-load",
        error: L.message,
        status: null
      }));
    })) : Promise.resolve();
  }
  function et(u) {
    if (!u._endpoint || !u.lastSyncedAt) return X(u);
    u.isSyncing = !0, u._abortController = new AbortController();
    const L = u._endpoint + (u._endpoint.indexOf("?") === -1 ? "?" : "&") + "since=" + u.lastSyncedAt;
    return fetch(L, { signal: u._abortController.signal }).then(function(S) {
      if (!S.ok) throw new Error("HTTP " + S.status);
      return S.json();
    }).then(function(S) {
      const O = S.data || [], I = S.deleted || [], x = S.synced_at || Math.floor(Date.now() / 1e3), q = O.length > 0 || I.length > 0;
      let F = Promise.resolve();
      return O.length > 0 && (F = F.then(function() {
        return nt(u._name, O);
      })), I.length > 0 && (F = F.then(function() {
        return ot(u._name, I);
      })), F.then(function() {
        return w(u._name);
      }).then(function(V) {
        return u.totalCount = V, C(u._name, {
          schema_version: m,
          last_synced_at: x,
          record_count: V
        });
      }).then(function() {
        u.isSyncing = !1, u.lastSyncedAt = x, u._abortController = null, T(u.dom, "ln-store:synced", {
          store: u._name,
          added: O.length,
          deleted: I.length,
          changed: q
        });
      });
    }).catch(function(S) {
      u.isSyncing = !1, u._abortController = null, S.name !== "AbortError" && T(u.dom, "ln-store:offline", { store: u._name });
    });
  }
  function nt(u, L) {
    return h().then(function(S) {
      if (S)
        return new Promise(function(O, I) {
          const x = S.transaction(u, "readwrite"), q = x.objectStore(u);
          for (let F = 0; F < L.length; F++)
            q.put(L[F]);
          x.oncomplete = function() {
            O();
          }, x.onerror = function() {
            o(x.error), I(x.error);
          };
        });
    });
  }
  function ot(u, L) {
    return h().then(function(S) {
      if (S)
        return new Promise(function(O, I) {
          const x = S.transaction(u, "readwrite"), q = x.objectStore(u);
          for (let F = 0; F < L.length; F++)
            q.delete(L[F]);
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
    const u = Object.keys(n);
    for (let L = 0; L < u.length; L++) {
      const S = n[u[L]];
      S.isLoaded && !S.isSyncing && it(S) && et(S);
    }
  }, document.addEventListener("visibilitychange", R);
  const B = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function P(u, L) {
    if (!L || !L.field) return u;
    const S = L.field, O = L.direction === "desc";
    return u.slice().sort(function(I, x) {
      const q = I[S], F = x[S];
      if (q == null && F == null) return 0;
      if (q == null) return O ? 1 : -1;
      if (F == null) return O ? -1 : 1;
      let V;
      return typeof q == "string" && typeof F == "string" ? V = B.compare(q, F) : V = q < F ? -1 : q > F ? 1 : 0, O ? -V : V;
    });
  }
  function G(u, L) {
    if (!L) return u;
    const S = Object.keys(L);
    return S.length === 0 ? u : u.filter(function(O) {
      for (let I = 0; I < S.length; I++) {
        const x = S[I], q = L[x];
        if (!Array.isArray(q) || q.length === 0) continue;
        const F = O[x];
        let V = !1;
        for (let lt = 0; lt < q.length; lt++)
          if (String(F) === String(q[lt])) {
            V = !0;
            break;
          }
        if (!V) return !1;
      }
      return !0;
    });
  }
  function ft(u, L, S) {
    if (!L || !S || S.length === 0) return u;
    const O = L.toLowerCase();
    return u.filter(function(I) {
      for (let x = 0; x < S.length; x++) {
        const q = I[S[x]];
        if (q != null && String(q).toLowerCase().indexOf(O) !== -1)
          return !0;
      }
      return !1;
    });
  }
  function W(u, L, S) {
    if (u.length === 0) return 0;
    if (S === "count") return u.length;
    let O = 0, I = 0;
    for (let x = 0; x < u.length; x++) {
      const q = parseFloat(u[x][L]);
      isNaN(q) || (O += q, I++);
    }
    return S === "sum" ? O : S === "avg" && I > 0 ? O / I : 0;
  }
  k.prototype.getAll = function(u) {
    const L = this;
    return u = u || {}, _(L._name).then(function(S) {
      const O = S.length;
      u.filters && (S = G(S, u.filters)), u.search && (S = ft(S, u.search, L._searchFields));
      const I = S.length;
      if (u.sort && (S = P(S, u.sort)), u.offset || u.limit) {
        const x = u.offset || 0, q = u.limit || S.length;
        S = S.slice(x, x + q);
      }
      return {
        data: S,
        total: O,
        filtered: I
      };
    });
  }, k.prototype.getById = function(u) {
    return d(this._name, u);
  }, k.prototype.count = function(u) {
    const L = this;
    return u ? _(L._name).then(function(S) {
      return G(S, u).length;
    }) : w(L._name);
  }, k.prototype.aggregate = function(u, L) {
    return _(this._name).then(function(O) {
      return W(O, u, L);
    });
  }, k.prototype.forceSync = function() {
    return et(this);
  }, k.prototype.fullReload = function() {
    const u = this;
    return v(u._name).then(function() {
      return u.isLoaded = !1, u.lastSyncedAt = null, u.totalCount = 0, X(u);
    });
  }, k.prototype.destroy = function() {
    this._abortController && (this._abortController.abort(), this._abortController = null), this._handlers && (this.dom.removeEventListener("ln-store:request-create", this._handlers.create), this.dom.removeEventListener("ln-store:request-update", this._handlers.update), this.dom.removeEventListener("ln-store:request-delete", this._handlers.delete), this.dom.removeEventListener("ln-store:request-bulk-delete", this._handlers.bulkDelete), this._handlers = null), delete n[this._name], Object.keys(n).length === 0 && R && (document.removeEventListener("visibilitychange", R), R = null), delete this.dom[c], T(this.dom, "ln-store:destroyed", { store: this._name });
  };
  function rt() {
    return h().then(function(u) {
      if (!u) return;
      const L = Array.from(u.objectStoreNames);
      return new Promise(function(S, O) {
        const I = u.transaction(L, "readwrite");
        for (let x = 0; x < L.length; x++)
          I.objectStore(L[x]).clear();
        I.oncomplete = function() {
          S();
        }, I.onerror = function() {
          O(I.error);
        };
      });
    }).then(function() {
      const u = Object.keys(n);
      for (let L = 0; L < u.length; L++) {
        const S = n[u[L]];
        S.isLoaded = !1, S.isSyncing = !1, S.lastSyncedAt = null, S.totalCount = 0;
      }
    });
  }
  function Y(u) {
    z(u, f, c, k);
  }
  function st() {
    H(function() {
      new MutationObserver(function(L) {
        for (let S = 0; S < L.length; S++) {
          const O = L[S];
          if (O.type === "childList")
            for (let I = 0; I < O.addedNodes.length; I++) {
              const x = O.addedNodes[I];
              x.nodeType === 1 && z(x, f, c, k);
            }
          else O.type === "attributes" && z(O.target, f, c, k);
        }
      }).observe(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [f]
      });
    }, "ln-store");
  }
  window[c] = { init: Y, clearAll: rt }, st(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    Y(document.body);
  }) : Y(document.body);
})();
(function() {
  const f = "data-ln-data-table", c = "lnDataTable";
  if (window[c] !== void 0) return;
  const m = typeof Intl < "u" ? new Intl.NumberFormat(document.documentElement.lang || void 0) : null;
  function g(n) {
    return m ? m.format(n) : String(n);
  }
  function s(n) {
    this.dom = n, this.name = n.getAttribute(f) || "", this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-data-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead"), this.ths = this.thead ? Array.from(this.thead.querySelectorAll("th")) : [], this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this.selectedIds = /* @__PURE__ */ new Set(), this._data = [], this._lastTotal = 0, this._lastFiltered = 0, this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._totalSpan = n.querySelector("[data-ln-data-table-total]"), this._filteredSpan = n.querySelector("[data-ln-data-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.closest("[data-ln-data-table-filtered-wrap]") || this._filteredSpan.parentNode : null), this._selectedSpan = n.querySelector("[data-ln-data-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.closest("[data-ln-data-table-selected-wrap]") || this._selectedSpan.parentNode : null);
    const t = this;
    if (this._onSetData = function(o) {
      const e = o.detail || {};
      t._data = e.data || [], t._lastTotal = e.total != null ? e.total : t._data.length, t._lastFiltered = e.filtered != null ? e.filtered : t._data.length, t.totalCount = t._lastTotal, t.visibleCount = t._lastFiltered, t.isLoaded = !0, t._vStart = -1, t._vEnd = -1, t._renderRows(), t._updateFooter(), T(n, "ln-data-table:rendered", {
        table: t.name,
        total: t.totalCount,
        visible: t.visibleCount
      });
    }, n.addEventListener("ln-data-table:set-data", this._onSetData), this._onSetLoading = function(o) {
      const e = o.detail && o.detail.loading;
      n.classList.toggle("ln-data-table--loading", !!e), e && (t.isLoaded = !1);
    }, n.addEventListener("ln-data-table:set-loading", this._onSetLoading), this._sortButtons = Array.from(n.querySelectorAll("[data-ln-col-sort]")), this._onSortClick = function(o) {
      const e = o.target.closest("[data-ln-col-sort]");
      if (!e) return;
      const i = e.closest("th");
      if (!i) return;
      const r = i.getAttribute("data-ln-col");
      r && t._handleSort(r, i);
    }, this.thead && this.thead.addEventListener("click", this._onSortClick), this._activeDropdown = null, this._onFilterClick = function(o) {
      const e = o.target.closest("[data-ln-col-filter]");
      if (!e) return;
      o.stopPropagation();
      const i = e.closest("th");
      if (!i) return;
      const r = i.getAttribute("data-ln-col");
      if (r) {
        if (t._activeDropdown && t._activeDropdown.field === r) {
          t._closeFilterDropdown();
          return;
        }
        t._openFilterDropdown(r, i, e);
      }
    }, this.thead && this.thead.addEventListener("click", this._onFilterClick), this._onDocClick = function() {
      t._activeDropdown && t._closeFilterDropdown();
    }, document.addEventListener("click", this._onDocClick), this._onClearAll = function(o) {
      o.target.closest("[data-ln-data-table-clear-all]") && (t.currentFilters = {}, t._updateFilterIndicators(), T(n, "ln-data-table:clear-filters", { table: t.name }), t._requestData());
    }, n.addEventListener("click", this._onClearAll), this._selectable = n.hasAttribute("data-ln-data-table-selectable"), this._selectable) {
      if (this._onSelectionChange = function(o) {
        const e = o.target.closest("[data-ln-row-select]");
        if (!e) return;
        const i = e.closest("[data-ln-row]");
        if (!i) return;
        const r = i.getAttribute("data-ln-row-id");
        r != null && (e.checked ? (t.selectedIds.add(r), i.classList.add("ln-row-selected")) : (t.selectedIds.delete(r), i.classList.remove("ln-row-selected")), t.selectedCount = t.selectedIds.size, t._updateSelectAll(), t._updateFooter(), T(n, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }));
      }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = n.querySelector('[data-ln-col-select] input[type="checkbox"]') || n.querySelector("[data-ln-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
        const o = document.createElement("input");
        o.type = "checkbox", o.setAttribute("aria-label", "Select all"), this._selectAllCheckbox.appendChild(o), this._selectAllCheckbox = o;
      }
      if (this._selectAllCheckbox && (this._onSelectAll = function() {
        const o = t._selectAllCheckbox.checked, e = t.tbody ? t.tbody.querySelectorAll("[data-ln-row]") : [];
        for (let i = 0; i < e.length; i++) {
          const r = e[i].getAttribute("data-ln-row-id"), h = e[i].querySelector("[data-ln-row-select]");
          r != null && (o ? (t.selectedIds.add(r), e[i].classList.add("ln-row-selected")) : (t.selectedIds.delete(r), e[i].classList.remove("ln-row-selected")), h && (h.checked = o));
        }
        t.selectedCount = t.selectedIds.size, T(n, "ln-data-table:select-all", {
          table: t.name,
          selected: o
        }), T(n, "ln-data-table:select", {
          table: t.name,
          selectedIds: t.selectedIds,
          count: t.selectedCount
        }), t._updateFooter();
      }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
        const o = this.tbody.querySelectorAll("[data-ln-row]");
        for (let e = 0; e < o.length; e++) {
          const i = o[e].querySelector("[data-ln-row-select]"), r = o[e].getAttribute("data-ln-row-id");
          i && i.checked && r != null && (this.selectedIds.add(r), o[e].classList.add("ln-row-selected"));
        }
        this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
      }
    }
    return this._onRowClick = function(o) {
      if (o.target.closest("[data-ln-row-select]") || o.target.closest("[data-ln-row-action]") || o.target.closest("a") || o.target.closest("button") || o.ctrlKey || o.metaKey || o.button === 1) return;
      const e = o.target.closest("[data-ln-row]");
      if (!e) return;
      const i = e.getAttribute("data-ln-row-id"), r = e._lnRecord || {};
      T(n, "ln-data-table:row-click", {
        table: t.name,
        id: i,
        record: r
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(o) {
      const e = o.target.closest("[data-ln-row-action]");
      if (!e) return;
      o.stopPropagation();
      const i = e.closest("[data-ln-row]");
      if (!i) return;
      const r = e.getAttribute("data-ln-row-action"), h = i.getAttribute("data-ln-row-id"), l = i._lnRecord || {};
      T(n, "ln-data-table:row-action", {
        table: t.name,
        id: h,
        action: r,
        record: l
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this._searchInput = n.querySelector("[data-ln-data-table-search]"), this._searchInput && (this._onSearchInput = function() {
      t.currentSearch = t._searchInput.value, T(n, "ln-data-table:search", {
        table: t.name,
        query: t.currentSearch
      }), t._requestData();
    }, this._searchInput.addEventListener("input", this._onSearchInput)), this._focusedRowIndex = -1, this._onKeydown = function(o) {
      if (!n.contains(document.activeElement) && document.activeElement !== document.body || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      if (o.key === "/") {
        t._searchInput && (o.preventDefault(), t._searchInput.focus());
        return;
      }
      const e = t.tbody ? Array.from(t.tbody.querySelectorAll("[data-ln-row]")) : [];
      if (e.length)
        switch (o.key) {
          case "ArrowDown":
            o.preventDefault(), t._focusedRowIndex = Math.min(t._focusedRowIndex + 1, e.length - 1), t._focusRow(e);
            break;
          case "ArrowUp":
            o.preventDefault(), t._focusedRowIndex = Math.max(t._focusedRowIndex - 1, 0), t._focusRow(e);
            break;
          case "Home":
            o.preventDefault(), t._focusedRowIndex = 0, t._focusRow(e);
            break;
          case "End":
            o.preventDefault(), t._focusedRowIndex = e.length - 1, t._focusRow(e);
            break;
          case "Enter":
            if (t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              o.preventDefault();
              const i = e[t._focusedRowIndex];
              T(n, "ln-data-table:row-click", {
                table: t.name,
                id: i.getAttribute("data-ln-row-id"),
                record: i._lnRecord || {}
              });
            }
            break;
          case " ":
            if (t._selectable && t._focusedRowIndex >= 0 && t._focusedRowIndex < e.length) {
              o.preventDefault();
              const i = e[t._focusedRowIndex].querySelector("[data-ln-row-select]");
              i && (i.checked = !i.checked, i.dispatchEvent(new Event("change", { bubbles: !0 })));
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
  s.prototype._handleSort = function(n, t) {
    let o;
    !this.currentSort || this.currentSort.field !== n ? o = "asc" : this.currentSort.direction === "asc" ? o = "desc" : o = null;
    for (let e = 0; e < this.ths.length; e++)
      this.ths[e].classList.remove("ln-sort-asc", "ln-sort-desc");
    o ? (this.currentSort = { field: n, direction: o }, t.classList.add(o === "asc" ? "ln-sort-asc" : "ln-sort-desc")) : this.currentSort = null, T(this.dom, "ln-data-table:sort", {
      table: this.name,
      field: n,
      direction: o
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
    let t = n.length > 0;
    for (let o = 0; o < n.length; o++) {
      const e = n[o].getAttribute("data-ln-row-id");
      if (e != null && !this.selectedIds.has(e)) {
        t = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = t;
  }, Object.defineProperty(s.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), s.prototype._focusRow = function(n) {
    for (let t = 0; t < n.length; t++)
      n[t].classList.remove("ln-row-focused"), n[t].removeAttribute("tabindex");
    if (this._focusedRowIndex >= 0 && this._focusedRowIndex < n.length) {
      const t = n[this._focusedRowIndex];
      t.classList.add("ln-row-focused"), t.setAttribute("tabindex", "0"), t.focus(), t.scrollIntoView({ block: "nearest" });
    }
  }, s.prototype._openFilterDropdown = function(n, t, o) {
    this._closeFilterDropdown();
    const e = at(this.dom, this.name + "-column-filter", "ln-data-table") || at(this.dom, "column-filter", "ln-data-table");
    if (!e) return;
    const i = e.firstElementChild;
    if (!i) return;
    const r = this._getUniqueValues(n), h = i.querySelector("[data-ln-filter-options]"), l = i.querySelector("[data-ln-filter-search]"), a = this.currentFilters[n] || [], _ = this;
    if (l && r.length <= 8 && l.classList.add("hidden"), h) {
      for (let b = 0; b < r.length; b++) {
        const E = r[b], v = document.createElement("li"), w = document.createElement("label"), A = document.createElement("input");
        A.type = "checkbox", A.value = E, A.checked = a.length === 0 || a.indexOf(E) !== -1, w.appendChild(A), w.appendChild(document.createTextNode(" " + E)), v.appendChild(w), h.appendChild(v);
      }
      h.addEventListener("change", function(b) {
        b.target.type === "checkbox" && _._onFilterChange(n, h);
      });
    }
    l && l.addEventListener("input", function() {
      const b = l.value.toLowerCase(), E = h.querySelectorAll("li");
      for (let v = 0; v < E.length; v++) {
        const w = E[v].textContent.toLowerCase();
        E[v].classList.toggle("hidden", b && w.indexOf(b) === -1);
      }
    });
    const d = i.querySelector("[data-ln-filter-clear]");
    d && d.addEventListener("click", function() {
      delete _.currentFilters[n], _._closeFilterDropdown(), _._updateFilterIndicators(), T(_.dom, "ln-data-table:filter", {
        table: _.name,
        field: n,
        values: []
      }), _._requestData();
    }), t.appendChild(i), this._activeDropdown = { field: n, th: t, el: i }, i.addEventListener("click", function(b) {
      b.stopPropagation();
    });
  }, s.prototype._closeFilterDropdown = function() {
    this._activeDropdown && (this._activeDropdown.el && this._activeDropdown.el.parentNode && this._activeDropdown.el.parentNode.removeChild(this._activeDropdown.el), this._activeDropdown = null);
  }, s.prototype._onFilterChange = function(n, t) {
    const o = t.querySelectorAll('input[type="checkbox"]'), e = [];
    let i = !0;
    for (let r = 0; r < o.length; r++)
      o[r].checked ? e.push(o[r].value) : i = !1;
    i || e.length === 0 ? delete this.currentFilters[n] : this.currentFilters[n] = e, this._updateFilterIndicators(), T(this.dom, "ln-data-table:filter", {
      table: this.name,
      field: n,
      values: i ? [] : e
    }), this._requestData();
  }, s.prototype._getUniqueValues = function(n) {
    const t = {}, o = [], e = this._data;
    for (let i = 0; i < e.length; i++) {
      const r = e[i][n];
      r != null && !t[r] && (t[r] = !0, o.push(String(r)));
    }
    return o.sort(), o;
  }, s.prototype._updateFilterIndicators = function() {
    const n = this.ths;
    for (let t = 0; t < n.length; t++) {
      const o = n[t], e = o.getAttribute("data-ln-col");
      if (!e) continue;
      const i = o.querySelector("[data-ln-col-filter]");
      if (!i) continue;
      const r = this.currentFilters[e] && this.currentFilters[e].length > 0;
      i.classList.toggle("ln-filter-active", !!r);
    }
  }, s.prototype._renderRows = function() {
    if (!this.tbody) return;
    const n = this._data, t = this._lastTotal, o = this._lastFiltered;
    if (t === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty");
      return;
    }
    if (n.length === 0 || o === 0) {
      this._disableVirtualScroll(), this._showEmptyState(this.name + "-empty-filtered");
      return;
    }
    n.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
  }, s.prototype._renderAll = function() {
    const n = this._data, t = document.createDocumentFragment();
    for (let o = 0; o < n.length; o++) {
      const e = this._buildRow(n[o]);
      if (!e) break;
      t.appendChild(e);
    }
    this.tbody.textContent = "", this.tbody.appendChild(t), this._selectable && this._updateSelectAll();
  }, s.prototype._buildRow = function(n) {
    const t = at(this.dom, this.name + "-row", "ln-data-table");
    if (!t) return null;
    const o = t.querySelector("[data-ln-row]") || t.firstElementChild;
    if (!o) return null;
    if (this._fillRow(o, n), o._lnRecord = n, n.id != null && o.setAttribute("data-ln-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      o.classList.add("ln-row-selected");
      const e = o.querySelector("[data-ln-row-select]");
      e && (e.checked = !0);
    }
    return o;
  }, s.prototype._enableVirtualScroll = function() {
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
  }, s.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, s.prototype._renderVirtual = function() {
    const n = this._data, t = n.length, o = this._rowHeight;
    if (!o || !t) return;
    const i = this.table.getBoundingClientRect().top + window.scrollY, r = this.thead ? this.thead.offsetHeight : 0, h = i + r, l = window.scrollY - h, a = Math.max(0, Math.floor(l / o) - 15), _ = Math.min(a + Math.ceil(window.innerHeight / o) + 30, t);
    if (a === this._vStart && _ === this._vEnd) return;
    this._vStart = a, this._vEnd = _;
    const d = this.ths.length || 1, b = a * o, E = (t - _) * o, v = document.createDocumentFragment();
    if (b > 0) {
      const w = document.createElement("tr");
      w.className = "ln-data-table__spacer", w.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", d), A.style.height = b + "px", w.appendChild(A), v.appendChild(w);
    }
    for (let w = a; w < _; w++) {
      const A = this._buildRow(n[w]);
      A && v.appendChild(A);
    }
    if (E > 0) {
      const w = document.createElement("tr");
      w.className = "ln-data-table__spacer", w.setAttribute("aria-hidden", "true");
      const A = document.createElement("td");
      A.setAttribute("colspan", d), A.style.height = E + "px", w.appendChild(A), v.appendChild(w);
    }
    this.tbody.textContent = "", this.tbody.appendChild(v), this._selectable && this._updateSelectAll();
  }, s.prototype._fillRow = function(n, t) {
    const o = n.querySelectorAll("[data-ln-cell]");
    for (let i = 0; i < o.length; i++) {
      const r = o[i], h = r.getAttribute("data-ln-cell");
      t[h] != null && (r.textContent = t[h]);
    }
    const e = n.querySelectorAll("[data-ln-cell-attr]");
    for (let i = 0; i < e.length; i++) {
      const r = e[i], h = r.getAttribute("data-ln-cell-attr").split(",");
      for (let l = 0; l < h.length; l++) {
        const a = h[l].trim().split(":");
        if (a.length !== 2) continue;
        const _ = a[0].trim(), d = a[1].trim();
        t[_] != null && r.setAttribute(d, t[_]);
      }
    }
  }, s.prototype._showEmptyState = function(n) {
    const t = at(this.dom, n, "ln-data-table");
    this.tbody.textContent = "", t && this.tbody.appendChild(t);
  }, s.prototype._updateFooter = function() {
    const n = this._lastTotal, t = this._lastFiltered, o = t < n;
    if (this._totalSpan && (this._totalSpan.textContent = g(n)), this._filteredSpan && (this._filteredSpan.textContent = o ? g(t) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !o), this._selectedSpan) {
      const e = this.selectedIds.size;
      this._selectedSpan.textContent = e > 0 ? g(e) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", e === 0);
    }
  }, s.prototype.destroy = function() {
    this.dom[c] && (this.dom.removeEventListener("ln-data-table:set-data", this._onSetData), this.dom.removeEventListener("ln-data-table:set-loading", this._onSetLoading), this.thead && (this.thead.removeEventListener("click", this._onSortClick), this.thead.removeEventListener("click", this._onFilterClick)), document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown), this._searchInput && this._searchInput.removeEventListener("input", this._onSearchInput), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._selectable && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this.dom.removeEventListener("click", this._onClearAll), this._closeFilterDropdown(), this._disableVirtualScroll(), this._data = [], delete this.dom[c]);
  }, j(f, c, s, "ln-data-table");
})();
(function() {
  const f = "ln-icons-sprite", c = "#ln-", y = "#lnc-", p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  let g = null;
  const s = (window.LN_ICONS_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), n = (window.LN_ICONS_CUSTOM_CDN || "").replace(/\/$/, ""), t = "lni:", o = "lni:v", e = "1";
  function i() {
    try {
      if (localStorage.getItem(o) !== e) {
        for (let b = localStorage.length - 1; b >= 0; b--) {
          const E = localStorage.key(b);
          E && E.indexOf(t) === 0 && localStorage.removeItem(E);
        }
        localStorage.setItem(o, e);
      }
    } catch {
    }
  }
  i();
  function r() {
    return g || (g = document.getElementById(f), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = f, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function h(b) {
    return b.indexOf(y) === 0 ? n + "/" + b.slice(y.length) + ".svg" : s + "/" + b.slice(c.length) + ".svg";
  }
  function l(b, E) {
    const v = E.match(/viewBox="([^"]+)"/), w = v ? v[1] : "0 0 24 24", A = E.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), C = A ? A[1].trim() : "", k = E.match(/<svg([^>]*)>/i), D = k ? k[1] : "", N = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    N.id = b, N.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(M) {
      const U = D.match(new RegExp(M + '="([^"]*)"'));
      U && N.setAttribute(M, U[1]);
    }), N.innerHTML = C, r().querySelector("defs").appendChild(N);
  }
  function a(b) {
    if (p.has(b) || m.has(b) || b.indexOf(y) === 0 && !n) return;
    const E = b.slice(1);
    try {
      const v = localStorage.getItem(t + E);
      if (v) {
        l(E, v), p.add(b);
        return;
      }
    } catch {
    }
    m.add(b), fetch(h(b)).then(function(v) {
      if (!v.ok) throw new Error(v.status);
      return v.text();
    }).then(function(v) {
      l(E, v), p.add(b), m.delete(b);
      try {
        localStorage.setItem(t + E, v);
      } catch {
      }
    }).catch(function() {
      m.delete(b);
    });
  }
  function _(b) {
    const E = 'use[href^="' + c + '"], use[href^="' + y + '"]', v = b.querySelectorAll ? b.querySelectorAll(E) : [];
    if (b.matches && b.matches(E)) {
      const w = b.getAttribute("href");
      w && a(w);
    }
    Array.prototype.forEach.call(v, function(w) {
      const A = w.getAttribute("href");
      A && a(A);
    });
  }
  function d() {
    _(document), new MutationObserver(function(b) {
      b.forEach(function(E) {
        if (E.type === "childList")
          E.addedNodes.forEach(function(v) {
            v.nodeType === 1 && _(v);
          });
        else if (E.type === "attributes" && E.attributeName === "href") {
          const v = E.target.getAttribute("href");
          v && (v.indexOf(c) === 0 || v.indexOf(y) === 0) && a(v);
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
