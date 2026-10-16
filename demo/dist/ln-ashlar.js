function Cn() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function Fe(t) {
  if (typeof window > "u") return !1;
  if (window.lnDebug === !0) return !0;
  if (window.lnCore && window.lnCore._debugIsContained)
    return t ? window.lnCore._debugIsContained(t) : window.lnCore._debugSink !== null;
  if (t && t.closest) {
    const e = t.closest("[data-ln-debug]");
    return !(!e || typeof document < "u" && e === document.documentElement);
  }
  return typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") : !1;
}
if (typeof window < "u" && (window.lnCore = window.lnCore || {}, !window.lnCore._warnBound)) {
  window.lnCore._warnBound = !0;
  const t = console.warn;
  console.warn = function(...e) {
    if (typeof e[0] == "string" && (e[0].startsWith("[ln-") || e[0].startsWith("[lnCore"))) {
      let a = null;
      for (let f = 1; f < e.length; f++)
        if (e[f] && e[f].nodeType === 1) {
          a = e[f];
          break;
        }
      if (!Fe(a))
        return;
    }
    t.apply(console, e);
  };
}
function Gi(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function $i(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function L(t, e, i) {
  const a = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: a
  }));
}
function $(t, e, i) {
  const a = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a);
  const f = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: a
  });
  return t.dispatchEvent(f), f;
}
function Tn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const a = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  a[i] = t.name, L(t.dom, e, a);
}
function ut(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ut(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function Qt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function Pe(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Qi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Be(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Yi(t, e) {
  return !t || !document.contains(t) || Be(t) || e && typeof t[e] != "function" ? !1 : Qt(t);
}
function kn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function At(t) {
  return t.hasAttribute("value") ? t.getAttribute("value") : t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.textContent.trim();
}
function Ln(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Ue(t, e) {
  const i = !!(e && e.typed), a = e && e.exclude, f = {}, p = t.elements, l = {};
  if (i)
    for (let c = 0; c < p.length; c++) {
      const s = p[c];
      s.name && s.type === "checkbox" && !s.disabled && (l[s.name] = (l[s.name] || 0) + 1);
    }
  for (let c = 0; c < p.length; c++) {
    const s = p[c];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button") && !(a && s.matches && s.matches(a)))
      if (s.type === "checkbox")
        i && l[s.name] === 1 ? f[s.name] = s.checked : (f[s.name] || (f[s.name] = []), s.checked && f[s.name].push(s.value));
      else if (s.type === "radio")
        s.checked && (f[s.name] = s.value);
      else if (s.type === "select-multiple") {
        f[s.name] = [];
        for (let n = 0; n < s.options.length; n++)
          s.options[n].selected && f[s.name].push(s.options[n].value);
      } else if (i && s.type === "hidden")
        f[s.name] = s.value;
      else if (i && (s.type === "number" || s.type === "range")) {
        const n = Number(s.value);
        f[s.name] = s.value === "" || isNaN(n) ? null : n;
      } else
        f[s.name] = s.value;
  }
  return f;
}
function Xi(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function He(t, e) {
  const i = t.elements, a = [], f = {};
  for (let p = 0; p < i.length; p++) {
    const l = i[p];
    l.name && l.type === "checkbox" && (f[l.name] = (f[l.name] || 0) + 1);
  }
  for (let p = 0; p < i.length; p++) {
    const l = i[p];
    if (l.type === "file" || l.type === "submit" || l.type === "button") continue;
    const c = l.getAttribute("data-ln-fill-as") || l.name;
    if (!c || !(c in e)) continue;
    const s = e[c];
    if (l.type === "checkbox") {
      if (Array.isArray(s))
        l.checked = s.indexOf(l.value) !== -1;
      else if (f[l.name] > 1) {
        const n = String(s).split(",").map(function(d) {
          return d.trim();
        });
        l.checked = n.indexOf(l.value) !== -1;
      } else
        l.checked = Xi(s);
      a.push(l);
    } else if (l.type === "radio")
      l.checked = l.value === String(s), a.push(l);
    else if (l.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < l.options.length; n++)
          l.options[n].selected = s.indexOf(l.options[n].value) !== -1;
      a.push(l);
    } else
      l.value = s, l.tagName === "SELECT" && s != null && l.setAttribute("data-ln-value", s), a.push(l);
  }
  return a;
}
function ze(t, e, { get: i, set: a }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(f) {
      a ? a.call(this, f, (p) => e.set.call(this, p)) : e.set.call(this, f);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = He, window.lnCore.serializeForm = Ue, window.lnCore.resolveFormMethod = Ln);
function Ct(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Wt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function qn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const xn = {};
function Ji(t, e) {
  xn[t] = e;
}
function Zi(t) {
  return xn[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Ji, window.lnCore.getDataMapper = Zi);
function J(t) {
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return i ? i.trim() : "en-US";
}
function he() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, ut(function() {
    new MutationObserver(function() {
      L(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const In = {};
function Rn(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  In[i] = e;
}
function Dt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return In[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = Rn, window.lnCore.getLocaleFallback = Dt, window.lnCore.ensureLocaleObserver = he);
const ge = {};
function ce(t, e) {
  ge[t] || (ge[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const i = ge[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Lt(t, e, i) {
  if (t) {
    const a = t.querySelector('[data-ln-template="' + e + '"]');
    if (a) return a.content.cloneNode(!0);
  }
  return ce(e, i);
}
function pt(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < i.length; l++) {
    const c = i[l], s = c.getAttribute("data-ln-field");
    e[s] != null && (c.textContent = e[s]);
  }
  const a = t.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < a.length; l++) {
    const c = a[l], s = c.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < s.length; n++) {
      const d = s[n].trim().split(":");
      if (d.length !== 2) continue;
      const _ = d[0].trim(), r = d[1].trim();
      e[r] != null && c.setAttribute(_, e[r]);
    }
  }
  const f = t.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < f.length; l++) {
    const c = f[l], s = c.getAttribute("data-ln-show");
    s in e && c.classList.toggle("hidden", !e[s]);
  }
  const p = t.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < p.length; l++) {
    const c = p[l], s = c.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < s.length; n++) {
      const d = s[n].trim().split(":");
      if (d.length !== 2) continue;
      const _ = d[0].trim(), r = d[1].trim();
      r in e && c.classList.toggle(_, !!e[r]);
    }
  }
  return t;
}
function tr(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let a = 0; a < i.length; a++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[a], e ?? null), i[a].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      pt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let i = 0; i < e.length; i++)
        e[i].textContent = "";
    }
})));
function ee(t, e) {
  if (!t || !e) return t;
  const i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; i.nextNode(); ) {
    const p = i.currentNode;
    p.textContent.indexOf("{{") !== -1 && (p.textContent = p.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, c) {
        return e[c] !== void 0 ? e[c] : "";
      }
    ));
  }
  const a = function(p, l) {
    return e[l] !== void 0 ? e[l] : "";
  }, f = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && f.push(t);
  for (let p = 0; p < f.length; p++) {
    const l = f[p], c = l.attributes;
    for (let s = 0; s < c.length; s++) {
      const n = c[s];
      n.value.indexOf("{{") !== -1 && l.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return t;
}
function er(t, e, i, a, f, p) {
  const l = {};
  for (let s = 0; s < t.children.length; s++) {
    const n = t.children[s], d = n.getAttribute("data-ln-render-key");
    d && (l[d] = n);
  }
  const c = document.createDocumentFragment();
  for (let s = 0; s < e.length; s++) {
    const n = e[s], d = String(a(n));
    let _ = l[d];
    if (_)
      f(_, n, s);
    else {
      const r = ce(i, p);
      if (!r || (ee(r, n), _ = r.firstElementChild, !_)) continue;
      _.setAttribute("data-ln-render-key", d), f(_, n, s);
    }
    c.appendChild(_);
  }
  t.textContent = "", t.appendChild(c);
}
function Dn(t, e) {
  const i = {}, a = t.querySelectorAll("[" + e + "]");
  for (let f = 0; f < a.length; f++)
    i[a[f].getAttribute(e)] = a[f].textContent, a[f].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = ee, window.lnCore.fill = pt, window.lnCore.lnFill = tr, window.lnCore.renderList = er);
function j(t, e, i) {
  const a = t.getAttribute(e);
  return a === null ? i : a;
}
function qt(t, e, i) {
  const a = parseInt(t.getAttribute(e), 10);
  return isNaN(a) ? i : a;
}
function xt(t, e, i = !1) {
  const a = t.getAttribute(e);
  if (a === null) return !!i;
  const f = a.trim().toLowerCase();
  return !(f === "false" || f === "0");
}
function Ke(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const _e = /* @__PURE__ */ new Map();
function On(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (_e.has(i)) return _e.get(i);
  const a = new Set(t || []), f = function(p, l) {
    const c = p.getAttribute(l);
    return c !== null && a.has(c) ? c : e;
  };
  return _e.set(i, f), f;
}
function Nn(t, e, i) {
  const a = parseFloat(t.getAttribute(e));
  return isNaN(a) ? i : a;
}
function Mn(t, e, i) {
  const a = t.getAttribute(e);
  if (!a) return i;
  try {
    return JSON.parse(a);
  } catch {
    return i;
  }
}
function Fn(t, e, i, a, f) {
  if (!t || e === null) return !0;
  const p = a || "ln-component", l = t.type;
  if (l === "trigger" || l === "marker" || l === "string" || l === "list" || !l || e === "" && t.fallback !== void 0)
    return !0;
  const c = (s) => {
    f ? console.warn(s, f) : console.warn(s);
  };
  if (l === "boolean") {
    const s = e.trim().toLowerCase();
    return s !== "" && s !== "true" && s !== "false" && s !== "1" && s !== "0" ? (c(`[${p}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (l === "enum") {
    const s = t.values || [];
    return s.includes(e) ? !0 : (c(`[${p}] Invalid value "${e}" for attribute "${i}". Allowed: ${s.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (l === "integer") {
    if (!/^-?\d+$/.test(e))
      return c(`[${p}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const s = parseInt(e, 10);
    return t.min !== void 0 && s < t.min ? (c(`[${p}] Value ${s} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && s > t.max ? (c(`[${p}] Value ${s} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (l === "float")
    return isNaN(Number(e)) ? (c(`[${p}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (l === "json")
    try {
      return JSON.parse(e), !0;
    } catch (s) {
      return c(`[${p}] Invalid JSON for attribute "${i}": ${s.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function Y(t, e, i) {
  for (const a in i) {
    const [f, p, l] = i[a];
    Object.defineProperty(t, a, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return f(e, p, l);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function X(t) {
  const e = {};
  for (const i in t) {
    const a = t[i];
    if (!a || !a.prop) continue;
    let f = a.read;
    if (!f && a.type)
      switch (a.type) {
        case "enum":
          f = On(a.values, a.fallback);
          break;
        case "integer":
          f = qt;
          break;
        case "float":
          f = Nn;
          break;
        case "boolean":
          f = xt;
          break;
        case "list":
          f = Ke;
          break;
        case "json":
          f = Mn;
          break;
        case "string":
        default:
          f = j;
          break;
      }
    f || (f = j), e[a.prop] = [f, i, a.fallback];
  }
  return e;
}
function nr(t) {
  const e = {};
  for (const i in t) {
    const a = t[i];
    a && a.effect && (e[i] = a.effect);
  }
  return Object.keys(e).length ? e : null;
}
function ir(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = Y, window.lnCore.attrSpec = X, window.lnCore.attrStr = j, window.lnCore.attrInt = qt, window.lnCore.attrBool = xt, window.lnCore.attrList = Ke, window.lnCore.attrEnum = On, window.lnCore.attrFloat = Nn, window.lnCore.attrJson = Mn);
function Yt(t, e) {
  if (!t[e.attribute]) {
    window.lnCore._persistSink && t.hasAttribute && t.hasAttribute("data-ln-persist") && window.lnCore._persistSink(t, e.selector);
    try {
      t[e.attribute] = new e.ComponentFn(t);
    } catch (i) {
      console.error("[" + e.attribute + "] init failed", t, i);
    }
  }
}
function Pn(t, e, i, a) {
  if (t.nodeType !== 1) return;
  const p = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", l = { selector: e, attribute: i, ComponentFn: a };
  if (t.matches && t.matches(p) && Yt(t, l), t.querySelectorAll) {
    const c = t.querySelectorAll(p);
    for (let s = 0; s < c.length; s++)
      Yt(c[s], l);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function rr() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function be() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function Bn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function dt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function Un() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function Hn(t) {
  const e = Un(), i = t.observed || [];
  for (let a = 0; a < i.length; a++) {
    const f = i[a];
    e.byAttr.has(f) || e.byAttr.set(f, []), e.byAttr.get(f).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const a in t.attributes) {
      e.byDeclaredAttr.has(a) || e.byDeclaredAttr.set(a, []);
      const f = e.byDeclaredAttr.get(a);
      f.some((p) => p.componentTag === t.componentTag) || f.push({
        spec: t.attributes[a],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const a = ir(t);
    if (a === null)
      e.reactiveWildcard.push(t);
    else
      for (const f of a)
        e.byReactive.has(f) || e.byReactive.set(f, []), e.byReactive.get(f).push(t);
  }
  t.persist && e.persist.push(t);
}
function en(t, e, i, a) {
  for (let f = 0; f < t.length; f++) {
    const p = t[f];
    if (!e[p.attribute]) continue;
    const l = p.effects && p.effects[i];
    l ? l(e, i, a) : p.onAttrChange && (!p.declared || p.declared.has(i)) && p.onAttrChange(e, i, a);
  }
}
function or(t) {
  const e = t.attributeName, i = e.indexOf("data-ln-") === 0, a = Un(), f = a.byAttr.get(e), p = Cn() && a.byDeclaredAttr && a.byDeclaredAttr.has(e);
  if (!i && !f && !p)
    return;
  const l = t.target;
  if (t.oldValue !== l.getAttribute(e)) {
    if (p && Fe(l)) {
      const c = a.byDeclaredAttr.get(e), s = l.getAttribute(e);
      for (let n = 0; n < c.length; n++)
        Fn(c[n].spec, s, e, c[n].componentTag, l);
    }
    if (window.lnCore._debugSink && (i || f) && window.lnCore._debugSink("attr", e, l, { oldValue: t.oldValue, newValue: l.getAttribute(e) }), i) {
      const c = a.byReactive.get(e);
      c && en(c, l, e, t.oldValue), a.reactiveWildcard.length && en(a.reactiveWildcard, l, e, t.oldValue);
    }
    if (f)
      for (let c = 0; c < f.length; c++) {
        const s = f[c];
        if (s.handler) {
          s.handler(l, e, t.oldValue);
          continue;
        }
        s.onAttributeChange && l[s.attribute] ? s.onAttributeChange(l, e) : (Pn(l, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(l));
      }
  }
}
function zn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ut(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        try {
          or(e[i]);
        } catch (a) {
          console.error("[ln-core] mutation handler failed", e[i].target, a);
        }
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function je() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function We() {
  return window.lnCore = window.lnCore || {}, window.lnCore._subtreeRegistry = window.lnCore._subtreeRegistry || [];
}
function ye(t, e) {
  if (!document.contains(t))
    if (e.attribute) {
      const i = t[e.attribute];
      if (i && typeof i.destroy == "function")
        try {
          i.destroy();
        } catch (a) {
          console.error("[" + e.attribute + "] destroy failed", t, a);
        }
      delete t[e.attribute];
    } else e.onDestroy && e.onDestroy(t);
}
function Kn(t) {
  const e = je();
  if (!e.length) return;
  const i = t.target;
  if (i) {
    const f = i.nodeType === 1 ? i : i.parentElement;
    if (f && (f.isContentEditable || f.closest && f.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const a = We();
  if (t.target && a.length)
    for (let f = 0; f < a.length; f++) {
      const p = a[f], l = p.query, c = t.target.nodeType === 1 ? t.target.matches && t.target.matches(l) ? t.target : t.target.closest ? t.target.closest(l) : null : t.target.parentElement && t.target.parentElement.closest ? t.target.parentElement.closest(l) : null;
      c && p.onSubtreeChange(c, t);
    }
  for (let f = 0; f < t.addedNodes.length; f++) {
    const p = t.addedNodes[f];
    if (p.nodeType === 1) {
      const l = !!(p.firstElementChild || p.children && p.children.length);
      for (let c = 0; c < e.length; c++) {
        const s = e[c];
        if (s.selector && s.attribute && s.ComponentFn) {
          if (!l)
            p.matches && p.matches(s.query) && Yt(p, s);
          else if (p.matches && p.matches(s.query) && Yt(p, s), p.querySelectorAll) {
            const n = p.querySelectorAll(s.query);
            for (let d = 0; d < n.length; d++)
              Yt(n[d], s);
          }
        }
        s.onInit && s.onInit(p);
      }
    }
  }
  for (let f = 0; f < t.removedNodes.length; f++) {
    const p = t.removedNodes[f];
    if (p.nodeType === 1) {
      if (document.contains(p)) continue;
      const l = !!(p.firstElementChild || p.children && p.children.length);
      for (let c = 0; c < e.length; c++) {
        const s = e[c], n = s.query;
        if (n) {
          if (!l)
            p.matches && p.matches(n) && ye(p, s);
          else if (p.matches && p.matches(n) && ye(p, s), p.querySelectorAll) {
            const d = p.querySelectorAll(n);
            for (let _ = 0; _ < d.length; _++)
              ye(d[_], s);
          }
        }
      }
    }
  }
}
function jn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ut(function() {
    const t = new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        if (a.type === "childList")
          try {
            Kn(a);
          } catch (f) {
            console.error("[ln-core] lifecycle handler failed", a.target, f);
          }
      }
    });
    window.lnCore._lifecycleObserver = t, t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Wn(t) {
  if (typeof window > "u") return t();
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._lifecycleObserver;
  if (!e) return t();
  const i = e.takeRecords();
  for (let a = 0; a < i.length; a++) {
    const f = i[a];
    if (f.type === "childList")
      try {
        Kn(f);
      } catch (p) {
        console.error("[ln-core] lifecycle handler failed", f.target, p);
      }
  }
  e.disconnect();
  try {
    return t();
  } finally {
    e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}
function Ft(t, e) {
  Hn({ observed: t, handler: e }), zn();
}
function ne(t) {
  je().push(t), t.onSubtreeChange && t.query && We().push(t), jn();
}
function H(t, e, i, a, f = {}) {
  const p = f.extraAttributes || [], l = f.onAttributeChange || null, c = f.onSubtreeChange || null, s = f.onInit || null, n = f.onAttrChange || null, d = f.effects || null, _ = f.attributes || null, r = _ ? nr(_) : d, v = _ ? new Set(Object.keys(_)) : null, y = f.persist || null;
  function m(A) {
    const w = A || document.body;
    if (Pn(w, t, e, i), _ && Cn())
      for (const E in _) {
        const S = _[E], C = Array.from(w.querySelectorAll("[" + E + "]"));
        w.matches && w.matches("[" + E + "]") && C.push(w);
        for (let k = 0; k < C.length; k++) {
          const x = C[k];
          Fe(x) && Fn(S, x.getAttribute(E), E, a, x);
        }
      }
    s && s(w);
  }
  const u = [];
  if (t.indexOf("[") !== -1) {
    const A = /\[([\w-]+)/g;
    let w;
    for (; (w = A.exec(t)) !== null; )
      u.push(w[1]);
  } else
    u.push(t);
  Hn({
    selector: t,
    attribute: e,
    componentTag: a,
    attributes: _,
    ComponentFn: i,
    onInit: s,
    observed: u.concat(p),
    onAttributeChange: l,
    onAttrChange: n,
    effects: r,
    declared: v,
    persist: y
  }), zn();
  const o = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1, b = f.subtreeQuery || (o ? t : "[" + t + "]"), g = {
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: s,
    onSubtreeChange: c,
    query: b
  };
  je().push(g), c && b && We().push(g), jn(), window[e] = m, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = H, window.lnCore.observeLifecycle = ne, window.lnCore.withoutLifecycle = Wn);
  function h() {
    Bn() > 0 ? dt(function() {
      m(document.body);
    }) : m(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h(), m;
}
function Ve(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const a = t[i];
    if (!(a === "" || a == null) && (e = !0, !Number.isFinite(Number(a))))
      return "string";
  }
  return e ? "number" : "string";
}
function Ge(t, e, i, a) {
  if (i === "number") {
    const l = parseFloat(t), c = parseFloat(e);
    return (isNaN(l) ? 0 : l) - (isNaN(c) ? 0 : c);
  }
  const f = t != null ? String(t) : "", p = e != null ? String(e) : "";
  return a ? a.compare(f, p) : f < p ? -1 : f > p ? 1 : 0;
}
function zt(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function Vn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, a = t.threshold != null ? t.threshold : 25, f = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, l = typeof t.onChange == "function" ? t.onChange : function() {
  }, c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let d = 0, _ = 0, r = 0, v = { sort: null, filters: {}, search: "" }, y = null, m = 0, u = 0, o = !1;
  function b(w) {
    s.set(w, ++m);
  }
  function g() {
    return !!(v && (v.search || v.filters && Object.keys(v.filters).length));
  }
  function h() {
    if (c.size <= e) return;
    const w = Array.from(c.keys()).sort(function(S, C) {
      return (s.get(S) || 0) - (s.get(C) || 0);
    });
    let E = 0;
    for (; c.size > e && E < w.length; )
      c.delete(w[E]), s.delete(w[E]), E++;
  }
  function A(w, E) {
    n.add(w), p(v, w, E);
  }
  return {
    get: function(w) {
      return c.get(w);
    },
    has: function(w) {
      return c.has(w);
    },
    peek: function() {
      return c.size ? c.values().next().value : void 0;
    },
    get logicalTotal() {
      return d;
    },
    get grandTotal() {
      return _;
    },
    get queryGen() {
      return r;
    },
    get size() {
      return c.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(w, E) {
      clearTimeout(y), u = w;
      for (let I = w; I < E; I++)
        c.has(I) && b(I);
      if (d <= 0) return;
      const S = Math.max(0, w - a), C = Math.min(d, E + a), k = Math.floor(S / i), x = Math.floor(Math.max(0, C - 1) / i);
      let D = -1;
      for (let I = k; I <= x; I++) {
        const R = I * i, N = Math.min(i, d - R);
        let P = !1;
        const K = Math.max(R, S), Q = Math.min(R + N, C);
        for (let Z = K; Z < Q; Z++)
          if (!c.has(Z)) {
            P = !0;
            break;
          }
        if (P && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (y = setTimeout(function() {
        A(D, i);
      }, f));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(w) {
      if (w = w || {}, w.queryGen != null && w.queryGen !== r) return !1;
      const E = w.offset || 0, S = w.data || [];
      let C = 0;
      for (let k = 0; k < S.length; k++)
        S[k] != null && C++;
      if (C === 0 && (w.provisional || w.filtered > 0))
        return n.delete(E), !1;
      o && (c.clear(), s.clear(), o = !1), w.provisional || (_ = w.total != null ? w.total : _, d = w.filtered != null ? w.filtered : w.data ? w.data.length : d);
      for (let k = 0; k < S.length; k++)
        S[k] != null && (c.set(E + k, S[k]), b(E + k));
      return n.delete(E), h(), l(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(w) {
      w && (v = w), A(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(w) {
      r++, n.clear(), clearTimeout(y), w && (v = w), o = !0, A(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      r++, n.clear(), clearTimeout(y), o = !0;
      const w = Math.max(0, Math.floor(u / i) * i);
      A(w, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(w) {
      n.delete(w);
    },
    destroy: function() {
      clearTimeout(y), c.clear(), s.clear(), n.clear();
    },
    configure: function(w) {
      w = w || {};
      let E = !1;
      if (w.windowSize != null && w.windowSize > 0 && w.windowSize !== e) {
        const S = w.windowSize < e;
        e = w.windowSize, S && h(), E = !0;
      }
      w.pageSize != null && w.pageSize > 0 && (i = w.pageSize), w.threshold != null && w.threshold >= 0 && (a = w.threshold), w.fetchDebounce != null && w.fetchDebounce >= 0 && (f = w.fetchDebounce), E && l();
    },
    setGrandTotal: function(w) {
      w == null || isNaN(w) || w < 0 || (_ = w, g() || (d = w), l());
    }
  };
}
function Gn(t) {
  return (t || "").replace(/^#/, "");
}
function Zt(t) {
  const e = t === void 0 ? location.hash : t, i = {}, a = Gn(e);
  if (!a) return i;
  const f = a.split("&");
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (!l) continue;
    const c = l.indexOf(":"), s = c > -1 ? l.slice(0, c) : l, n = c > -1 ? l.slice(c + 1) : "";
    if (s)
      try {
        i[s] = decodeURIComponent(n);
      } catch {
        i[s] = n;
      }
  }
  return i;
}
function at(t) {
  if (!t) return null;
  const e = Zt();
  return t in e ? e[t] : null;
}
function _t(t, e) {
  if (!t) return;
  const i = Zt();
  e == null ? delete i[t] : i[t] = String(e);
  const f = Object.keys(i).map(function(p) {
    const l = i[p];
    return l === "" ? p : p + ":" + encodeURIComponent(l);
  }).join("&");
  Gn(location.hash) !== f && (location.hash = f);
}
function $e(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function St(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const a = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return a ? e ? a + "-" + e : a : e || null;
}
function $n(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Ce(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Qn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function Te(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), a = t.slice(e + 1), f = a ? a.split(",").map(function(p) {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).filter(Boolean) : [];
  return { key: i, values: f };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Zt, window.lnCore.hashGet = at, window.lnCore.hashSet = _t, window.lnCore.hashLinkClick = $e, window.lnCore.resolveHashNamespace = St, window.lnCore.hashSortEncode = $n, window.lnCore.hashSortDecode = Ce, window.lnCore.hashFilterEncode = Qn, window.lnCore.hashFilterDecode = Te);
function sr(t) {
  return (t || "").replace(/^\?/, "");
}
function ke(t) {
  const e = t === void 0 ? typeof window < "u" ? window.location.search : "" : t, i = {}, a = sr(e);
  if (!a) return i;
  const f = new URLSearchParams(a);
  for (const [p, l] of f.entries())
    i[p] = l;
  return i;
}
function Mt(t) {
  if (!t || typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search);
  return e.has(t) ? e.get(t) : null;
}
function pe(t, e) {
  if (!t || typeof window > "u") return;
  const i = new URL(window.location.href);
  if (e == null || e === "" ? i.searchParams.delete(t) : i.searchParams.set(t, String(e)), i.search === window.location.search) return;
  const a = i.pathname + i.search + i.hash;
  window.history.replaceState(window.history.state, "", a);
}
function Ot(t, e) {
  if (!t || !t.hasAttribute("data-ln-query")) return null;
  const i = t.getAttribute("data-ln-query");
  if (i && i.trim() !== "") return i.trim();
  const a = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return a ? e ? a + "_" + e : a : e || null;
}
function Yn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Le(t, e) {
  if (t && typeof t == "string") {
    if (t.endsWith(".asc"))
      return { fieldOrColumn: t.slice(0, -4), direction: "asc" };
    if (t.endsWith(".desc"))
      return { fieldOrColumn: t.slice(0, -5), direction: "desc" };
  }
  if (e && typeof e == "object") {
    const i = e.sort_field || e.sort_by;
    if (i) {
      const a = e.sort_dir && String(e.sort_dir).toLowerCase() === "desc" ? "desc" : "asc";
      return { fieldOrColumn: i, direction: a };
    }
  }
  return null;
}
function Xn(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function qe(t) {
  return !t || typeof t != "string" ? [] : t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e.trim());
    } catch {
      return e.trim();
    }
  }).filter(Boolean);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.queryParse = ke, window.lnCore.queryGet = Mt, window.lnCore.querySet = pe, window.lnCore.resolveQueryParam = Ot, window.lnCore.querySortEncode = Yn, window.lnCore.querySortDecode = Le, window.lnCore.queryFilterEncode = Xn, window.lnCore.queryFilterDecode = qe);
function de(t, e, i, a) {
  const f = typeof a == "number" ? a : 4, p = window.innerWidth, l = window.innerHeight, c = e.width, s = e.height, n = (i || "bottom").split("-"), d = n[0], _ = n[1] === "start" || n[1] === "end" ? n[1] : "center", r = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, v = r[d] || r.bottom;
  function y(g) {
    return g === "top" || g === "bottom" ? _ === "start" ? t.left : _ === "end" ? t.right - c : t.left + (t.width - c) / 2 : _ === "start" ? t.top : _ === "end" ? t.bottom - s : t.top + (t.height - s) / 2;
  }
  function m(g) {
    let h, A, w = !0;
    return g === "top" ? (h = t.top - f - s, A = y(g), h < 0 && (w = !1)) : g === "bottom" ? (h = t.bottom + f, A = y(g), h + s > l && (w = !1)) : g === "left" ? (h = y(g), A = t.left - f - c, A < 0 && (w = !1)) : (h = y(g), A = t.right + f, A + c > p && (w = !1)), { top: h, left: A, side: g, fits: w };
  }
  let u = null;
  for (let g = 0; g < v.length; g++) {
    const h = m(v[g]);
    if (h.fits) {
      u = h;
      break;
    }
  }
  u || (u = m(v[0]));
  let o = u.top, b = u.left;
  return c >= p ? b = 0 : (b < 0 && (b = 0), b + c > p && (b = p - c)), s >= l ? o = 0 : (o < 0 && (o = 0), o + s > l && (o = l - s)), { top: o, left: b, placement: u.side };
}
function xe(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, a = e.display, f = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const p = t.offsetWidth, l = t.offsetHeight;
  return e.visibility = i, e.display = a, e.position = f, { width: p, height: l };
}
let Xt = null;
const ar = "ln-ashlar:storage-salt:v1", nn = 32768;
function rn(t) {
  let e = "";
  const i = t.byteLength;
  for (let a = 0; a < i; a += nn)
    e += String.fromCharCode.apply(
      null,
      t.subarray(a, Math.min(a + nn, i))
    );
  return btoa(e);
}
function on(t) {
  const e = atob(t), i = e.length, a = new Uint8Array(i);
  for (let f = 0; f < i; f++)
    a[f] = e.charCodeAt(f);
  return a;
}
function Jn(t, e) {
  let i = Xt, a = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (a = t, typeof CryptoKey < "u" && a.key instanceof CryptoKey && (i = a.key)), { key: i, options: a };
}
async function lr(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", a = new TextEncoder();
  if (i === "sha256") {
    const s = await crypto.subtle.digest("SHA-256", a.encode(t));
    return crypto.subtle.importKey(
      "raw",
      s,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const f = e.salt || ar, p = typeof f == "string" ? a.encode(f) : f, l = e.iterations || 1e5, c = await crypto.subtle.importKey(
    "raw",
    a.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: p,
      iterations: l,
      hash: "SHA-256"
    },
    c,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function sn(t, e = {}) {
  if (!t) {
    Xt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Xt = await lr(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Xt = null, i;
  }
}
function Tt() {
  return Xt;
}
async function cr(t, e, i) {
  const { key: a } = Jn(e);
  if (t == null)
    return t;
  if (!a)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const f = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), l = typeof t == "string" ? t : JSON.stringify(t), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      a,
      f.encode(l)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: rn(p),
      data: rn(new Uint8Array(c))
    };
  } catch (f) {
    throw console.error("[ln-core/crypto] Encryption failed:", f), new Error("[ln-crypto] Encryption failed: " + (f && f.message ? f.message : String(f)));
  }
}
async function dr(t, e, i) {
  const { key: a, options: f } = Jn(e), p = f.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!a) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const l = new TextDecoder(), c = on(t.iv), s = on(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: c },
      a,
      s
    ), d = l.decode(n);
    try {
      return JSON.parse(d);
    } catch {
      return d;
    }
  } catch (l) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", l), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (l && l.message ? l.message : String(l)));
  }
}
function wt() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const e = Math.random() * 16 | 0;
    return (t === "x" ? e : e & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = wt);
function Zn(t, e = 100, i = 0) {
  const a = parseFloat(String(t)) || 0, f = parseFloat(String(e)) || 100, p = parseFloat(String(i)) || 0, l = Math.max(p, Math.min(a, f)), c = f - p;
  let s = 0;
  return c > 0 && (s = (l - p) / c * 100), s = Math.max(0, Math.min(100, s)), {
    value: a,
    min: p,
    max: f,
    clampedValue: l,
    percentage: s
  };
}
function it(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const i = e < 1e11 ? e * 1e3 : e, a = new Date(i);
    return isNaN(a.getTime()) ? null : a;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i) return null;
    const a = /^(\d{4})-(\d{2})-(\d{2})$/.exec(i);
    if (a) {
      const p = +a[1], l = +a[2], c = +a[3], s = new Date(p, l - 1, c);
      return s.getFullYear() !== p || s.getMonth() !== l - 1 || s.getDate() !== c ? null : s;
    }
    const f = new Date(i);
    return isNaN(f.getTime()) ? null : f;
  }
  return null;
}
function Bt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + a;
}
const Et = {};
function ue(t) {
  const e = t || "default";
  if (!Et[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), a = i.formatToParts(1234.5);
    let f = "", p = ".";
    for (let l = 0; l < a.length; l++)
      a[l].type === "group" && (f = a[l].value), a[l].type === "decimal" && (p = a[l].value);
    Et[e] = { groupSep: f, decimalSep: p, fmt: i };
  }
  return Et[e];
}
function ti(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let a = t.trim();
  return a === "" ? "" : (a = a.replace(/[$€£¥]/g, ""), e && (a = a.split(e).join("")), a = a.replace(/\s/g, ""), i && i !== "." && (a = a.replace(i, ".")), a = a.replace(/[^\d.-]/g, ""), a);
}
function ur(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const a = ue(e), f = ti(i, a.groupSep, a.decimalSep);
  if (f === "" || f === "-") return NaN;
  const p = parseFloat(f);
  return isNaN(p) ? NaN : p;
}
function ot(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const a = e || "default", f = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, p = i.userDecimals != null ? i.userDecimals : null;
  if (f !== null) {
    const l = a + "|max:" + f;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: f
    })), Et[l].format(t);
  }
  if (p !== null && p > 0) {
    const l = a + "|exact:" + p;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: p,
      maximumFractionDigits: p
    })), Et[l].format(t);
  }
  return ue(e).fmt.format(t);
}
function le(t) {
  return String(t || "").trim().toLowerCase();
}
function ei(t) {
  const e = le(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function fr(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function ni(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let a = 0; a < e.length; a++)
    if (i.indexOf(e[a]) === -1) return !1;
  return !0;
}
function hr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Qe(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let a = 0; a < e.length; a++)
    if (String(e[a]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function pr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function mr(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function gr(t, e) {
  return (e || "GET") + " " + (t || "");
}
function _r(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function a(l, c) {
    c = c || {};
    const s = pr(l), n = mr(l, c), d = gr(s, n);
    _r(n) && e.has(d) && (e.get(d).abort(), e.delete(d));
    const _ = new AbortController(), r = c.signal;
    let v = null;
    r && (r.aborted ? _.abort(r.reason) : (v = function() {
      _.abort(r.reason);
    }, r.addEventListener("abort", v, { once: !0 })));
    const y = Object.assign({}, c, { signal: _.signal });
    return e.set(d, _), t(l, y).finally(function() {
      r && v && r.removeEventListener("abort", v), e.get(d) === _ && e.delete(d);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function f(l) {
    if (!l.detail || !l.detail.url) return;
    const c = l.target, s = (l.detail.method || (l.detail.body ? "POST" : "GET")).toUpperCase(), n = l.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const d = new AbortController(), _ = l.detail.signal;
    let r = null;
    _ && (_.aborted ? d.abort(_.reason) : (r = function() {
      d.abort(_.reason);
    }, _.addEventListener("abort", r, { once: !0 }))), n && i.set(n, d);
    const v = { method: s, signal: d.signal };
    l.detail.body !== void 0 && (v.body = l.detail.body), window.fetch(l.detail.url, v).then(function(y) {
      _ && r && _.removeEventListener("abort", r), n && i.get(n) === d && i.delete(n), L(c, "ln-http:response", {
        ok: y.ok,
        status: y.status,
        response: y
      });
    }).catch(function(y) {
      _ && r && _.removeEventListener("abort", r), n && i.get(n) === d && i.delete(n), !(y && y.name === "AbortError") && L(c, "ln-http:error", {
        ok: !1,
        status: 0,
        error: y
      });
    });
  }
  function p(l) {
    const c = l.detail || {};
    c.all ? window.lnHttp.cancelAll() : c.key ? window.lnHttp.cancelByKey(c.key) : c.url && window.lnHttp.cancel(c.url);
  }
  document.addEventListener("ln-http:request", f), document.addEventListener("ln-http:cancel", p), window.lnHttp = {
    cancel: function(l) {
      let c = !1;
      return e.forEach(function(s, n) {
        n.endsWith(" " + l) && (s.abort(), e.delete(n), c = !0);
      }), c;
    },
    cancelByKey: function(l) {
      return i.has(l) ? (i.get(l).abort(), i.delete(l), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(l) {
        l.abort();
      }), e.clear(), i.forEach(function(l) {
        l.abort();
      }), i.clear();
    },
    get inflight() {
      const l = [];
      return e.forEach(function(c, s) {
        const n = s.indexOf(" ");
        l.push({ method: s.slice(0, n), url: s.slice(n + 1) });
      }), i.forEach(function(c, s) {
        l.push({ key: s });
      }), l;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", f), document.removeEventListener("ln-http:cancel", p), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: j, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, a = X(i), f = /* @__PURE__ */ new Map();
  function p(l) {
    if (this.dom = l, Y(this, l, a), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    rr(), this._held = !0;
    const c = this, s = this.url;
    let n = f.get(s);
    return n || (n = fetch(s).then(function(d) {
      if (!d.ok)
        throw new Error("HTTP error! status: " + d.status);
      return d.text();
    }).catch(function(d) {
      throw f.delete(s), d;
    }), f.set(s, n)), n.then(function(d) {
      if (c._destroyed) return;
      const _ = document.createElement("template");
      _.innerHTML = d, c.dom.content.appendChild(_.content), L(c.dom, "ln-include:loaded", { target: c.dom, url: c.url }), c._held && (c._held = !1, be());
    }).catch(function(d) {
      c._destroyed || (console.error("[ln-include] Failed to fetch template from " + c.url + ":", d), L(c.dom, "ln-include:error", { target: c.dom, url: c.url, error: d }), c._held && (c._held = !1, be()));
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, be()), delete this.dom[e]);
  }, H(t, e, p, "ln-include", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-form": { type: "marker", description: "Identifies the form element as an enhanced ln-form" },
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: j, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, a = X(i);
  function f(p) {
    this.dom = p, Y(this, p, a), this._baseAction = p.getAttribute("action") || "";
    const l = this;
    function c() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let d = 0; d < n.length; d++)
        n[d].hasAttribute("data-ln-initial-value") || n[d].setAttribute("data-ln-initial-value", n[d].getAttribute("value") || "");
    }
    function s() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let d = 0; d < n.length; d++)
        n[d].value = n[d].getAttribute("data-ln-initial-value") || "";
    }
    return c(), this._onLnFill = function(n) {
      n.target === l.dom && (n.detail ? (c(), l.fill(n.detail), l._applyActionMode(n.detail)) : (l.dom.reset(), s()));
    }, this._onReset = function() {
      l._applyActionMode(null), s();
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  f.prototype.fill = function(p) {
    const l = He(this.dom, p);
    for (let c = 0; c < l.length; c++) {
      const s = l[c], n = s.tagName === "SELECT" || s.type === "checkbox" || s.type === "radio";
      s.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, f.prototype.reset = function() {
    this.dom.reset(), this._applyActionMode(null);
    const p = this.dom.elements;
    for (let l = 0; l < p.length; l++) {
      const c = p[l], s = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, f.prototype._ensureMethodInput = function() {
    let p = this.dom.querySelector('input[name="_method"]');
    return p || (p = document.createElement("input"), p.type = "hidden", p.name = "_method", p.value = "", this.dom.appendChild(p)), p;
  }, f.prototype._applyActionMode = function(p) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const l = p && p.id != null && p.id !== "" ? p.id : null, c = this._ensureMethodInput();
    if (l !== null) {
      const s = this._actionEdit;
      s ? this.dom.setAttribute("action", s.replace(":id", encodeURIComponent(l))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(l)), c.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), c.value = "";
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, H(t, e, f, "ln-form", {
    attributes: i
  });
})();
const an = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function ln(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function br(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function yr(t, e) {
  const i = [];
  if (t) {
    const a = Object.keys(an);
    for (let f = 0; f < a.length; f++) {
      const p = a[f], l = an[p];
      t[l] && i.push(p);
    }
  }
  if (e) {
    const a = Array.from(e);
    for (let f = 0; f < a.length; f++)
      a[f] && i.indexOf(a[f]) === -1 && i.push(a[f]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", a = "data-ln-validate-error", f = "ln-validate-valid", p = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function c(s) {
    this.dom = s, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, d = s.tagName, _ = s.type, r = d === "SELECT" || _ === "checkbox" || _ === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(y) {
      const m = y.detail && y.detail.error;
      if (!m) return;
      n._customErrors.add(m), n._touched = !0;
      const u = s.closest(".form-element");
      if (u) {
        const o = u.querySelector("[" + a + '="' + m + '"]');
        o && o.classList.remove("hidden");
      }
      s.classList.remove(f), s.classList.add(p), s.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(y) {
      const m = y.detail && y.detail.error, u = s.closest(".form-element");
      if (m) {
        if (n._customErrors.delete(m), u) {
          const o = u.querySelector("[" + a + '="' + m + '"]');
          o && o.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(o) {
          if (u) {
            const b = u.querySelector("[" + a + '="' + o + '"]');
            b && b.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, r || s.addEventListener("input", this._onInput), s.addEventListener("change", this._onChange), s.addEventListener("ln-validate:set-custom", this._onSetCustom), s.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const v = s.form;
    return v && (v.hasAttribute("novalidate") || v.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(y) {
      n._touched = !0, !n.validate() && y.detail && y.detail.invalidFields && y.detail.invalidFields.push(n.dom);
    }, v.addEventListener("reset", this._onFormReset), v.addEventListener("ln-validate:request-validate", this._onValidateRequest), v._lnValidateGateBound || (v._lnValidateGateBound = !0, v.addEventListener("submit", function(y) {
      const m = { invalidFields: [] };
      L(v, "ln-validate:request-validate", m), m.invalidFields.length > 0 && (y.preventDefault(), m.invalidFields.sort((u, o) => u.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), m.invalidFields[0].focus());
    }))), br(s) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const s = this.dom, n = s.validity, d = ln(n, this._customErrors.size), _ = yr(n, this._customErrors), r = s.closest(".form-element");
    if (r) {
      const m = r.querySelector("[" + i + "]");
      if (m) {
        const u = m.querySelectorAll("[" + a + "]");
        for (let o = 0; o < u.length; o++) {
          const b = u[o].getAttribute(a), g = !_.includes(b);
          u[o].classList.contains("hidden") !== g && u[o].classList.toggle("hidden", g);
        }
      }
    }
    s.classList.contains(f) !== d && s.classList.toggle(f, d), s.classList.contains(p) === d && s.classList.toggle(p, !d);
    const v = d ? "false" : "true";
    return s.getAttribute("aria-invalid") !== v && s.setAttribute("aria-invalid", v), L(s, d ? "ln-validate:valid" : "ln-validate:invalid", { target: s, field: s.name, errors: _ }), d;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.contains(f) && this.dom.classList.remove(f), this.dom.classList.contains(p) && this.dom.classList.remove(p), this.dom.hasAttribute("aria-invalid") && this.dom.removeAttribute("aria-invalid");
    const s = this.dom.closest(".form-element");
    if (s) {
      const n = s.querySelectorAll("[" + a + "]");
      for (let d = 0; d < n.length; d++)
        n[d].classList.contains("hidden") || n[d].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return ln(this.dom.validity, this._customErrors.size);
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const s = this.dom.form;
    s && (this._onFormReset && s.removeEventListener("reset", this._onFormReset), this._onValidateRequest && s.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(f, p), this.dom.removeAttribute("aria-invalid"), delete this.dom[e];
  }, H(t, e, c, "ln-validate", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let a = null;
  function f(r) {
    if (!r.hasAttribute(t) || r[e]) return;
    r[e] = !0;
    const v = n(r);
    p(v.links), l(v.forms);
  }
  function p(r) {
    for (const v of r) {
      if (v[e + "Trigger"] || v.hostname && v.hostname !== window.location.hostname) continue;
      const y = v.getAttribute("href");
      if (y && y.includes("#")) continue;
      const m = function(u) {
        if (!kn(u, v)) return;
        u.preventDefault();
        const o = v.getAttribute("href");
        o && s("GET", o, null, v);
      };
      v.addEventListener("click", m), v[e + "Trigger"] = m;
    }
  }
  function l(r) {
    for (const v of r) {
      if (v[e + "Trigger"]) continue;
      if (v.hasAttribute(i)) {
        v[e + "ScopeWarned"] || (v[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const y = function(m) {
        if (m.defaultPrevented) return;
        m.preventDefault();
        const u = v.method.toUpperCase(), o = v.action, b = new FormData(v);
        for (const g of v.querySelectorAll('button, input[type="submit"]'))
          g.disabled = !0;
        s(u, o, b, v, function() {
          for (const g of v.querySelectorAll('button, input[type="submit"]'))
            g.disabled = !1;
        });
      };
      v.addEventListener("submit", y), v[e + "Trigger"] = y;
    }
  }
  function c(r) {
    if (!r[e]) return;
    const v = n(r);
    for (const y of v.links)
      y[e + "Trigger"] && (y.removeEventListener("click", y[e + "Trigger"]), delete y[e + "Trigger"]);
    for (const y of v.forms)
      y[e + "Trigger"] && (y.removeEventListener("submit", y[e + "Trigger"]), delete y[e + "Trigger"]);
    delete r[e];
  }
  function s(r, v, y, m, u) {
    if ($(m, "ln-ajax:before-start", { method: r, url: v }).defaultPrevented) return;
    r === "GET" && a && a(), L(m, "ln-ajax:start", { method: r, url: v }), m.classList.add("ln-ajax--loading");
    const b = document.createElement("span");
    b.className = "ln-ajax-spinner", m.appendChild(b);
    function g() {
      m.classList.remove("ln-ajax--loading");
      const C = m.querySelector(".ln-ajax-spinner");
      C && C.remove(), u && u();
    }
    let h = v;
    const A = document.querySelector('meta[name="csrf-token"]'), w = A ? A.getAttribute("content") : null;
    y instanceof FormData && w && y.append("_token", w);
    const E = {
      method: r,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (w && (E.headers["X-CSRF-TOKEN"] = w), r === "GET" && y) {
      const C = new URLSearchParams(y);
      h = v + (v.includes("?") ? "&" : "?") + C.toString();
    } else r !== "GET" && y && (E.body = y);
    let S = null;
    if (r === "GET") {
      const C = new AbortController();
      E.signal = C.signal, S = function() {
        a = null, C.abort(), g(), L(m, "ln-ajax:aborted", { method: r, url: h });
      }, a = S;
    }
    fetch(h, E).then(function(C) {
      const k = C.ok, x = C.status;
      return C.text().then(function(D) {
        let I = null, R = null;
        if (D && D.trim())
          try {
            I = JSON.parse(D);
          } catch (N) {
            R = N;
          }
        return { ok: k, status: x, data: I, parseError: R };
      });
    }).then(function(C) {
      S && a === S && (a = null);
      const k = C.status, x = C.data, D = C.parseError;
      if (C.ok && !D) {
        if (x && x.title && (document.title = x.title), x && x.content)
          for (const I in x.content) {
            const R = document.getElementById(I);
            R && (R.innerHTML = x.content[I]);
          }
        if (m.tagName === "A") {
          const I = m.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else m.tagName === "FORM" && m.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", h);
        L(m, "ln-ajax:success", { method: r, url: h, data: x });
      } else
        L(m, "ln-ajax:error", {
          method: r,
          url: h,
          status: k,
          data: x,
          error: D || null
        });
      g(), L(m, "ln-ajax:complete", { method: r, url: h });
    }).catch(function(C) {
      C && C.name === "AbortError" || (S && a === S && (a = null), L(m, "ln-ajax:error", { method: r, url: h, status: 0, data: null, error: C }), g(), L(m, "ln-ajax:complete", { method: r, url: h }));
    });
  }
  function n(r) {
    const v = { links: [], forms: [] };
    return r.tagName === "A" && r.getAttribute(t) !== "false" ? v.links.push(r) : r.tagName === "FORM" && r.getAttribute(t) !== "false" ? v.forms.push(r) : (v.links = Array.from(r.querySelectorAll('a:not([data-ln-ajax="false"])')), v.forms = Array.from(r.querySelectorAll('form:not([data-ln-ajax="false"])'))), v;
  }
  function d() {
    ut(function() {
      ne({
        onInit: function(r) {
          if (f(r), !r.hasAttribute(t)) {
            for (const y of r.querySelectorAll("[" + t + "]"))
              f(y);
            const v = r.closest && r.closest("[" + t + "]");
            if (v && v.getAttribute(t) !== "false") {
              const y = n(r);
              p(y.links), l(y.forms);
            }
          }
        }
      }), Ft([t], function(r) {
        f(r);
      });
    }, "ln-ajax");
  }
  function _() {
    for (const r of document.querySelectorAll("[" + t + "]"))
      f(r);
  }
  window[e] = f, window[e].destroy = c, d(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _();
})();
function vr(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: a = null } = {}) {
  const f = i ? !a : !t.some((n) => n.match), p = [], l = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const d = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !d && n.targetEl && p.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || l.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  l.sort((n, d) => n.regionKey === "__primary__" ? -1 : d.regionKey === "__primary__" ? 1 : 0);
  const s = l.find((n) => n.regionKey === "__primary__") || l[0] || null;
  return { notFound: f, clears: p, swaps: l, owner: s };
}
function Jt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function wr(t, e) {
  const i = Jt(e);
  if (!i) return t && t.replace(/\/+$/, "") || "/";
  const a = (t || "/").replace(/\/+$/, "") || "/";
  return a === i ? "/" : a.startsWith(i + "/") ? a.slice(i.length).replace(/\/+$/, "") || "/" : a;
}
function ii(t, e) {
  const i = Jt(e);
  if (!i) return t || "/";
  const a = t || "/", f = a.indexOf("#"), p = f !== -1 ? a.slice(0, f) : a, l = f !== -1 ? a.slice(f) : "", c = p.indexOf("?"), s = c !== -1 ? p.slice(0, c) : p, n = c !== -1 ? p.slice(c) : "";
  let d;
  if (s === i)
    d = i + "/";
  else if (s.startsWith(i + "/"))
    d = s;
  else {
    const _ = s.startsWith("/") ? s : "/" + s;
    d = _ === "/" ? i + "/" : i + _;
  }
  return d + n + l;
}
function Ie() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return Jt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const i = new URL(e.getAttribute("href"), window.location.origin);
      return Jt(i.pathname);
    } catch {
      return Jt(e.getAttribute("href"));
    }
  return "";
}
const ri = {
  navigate: function(t) {
    te(t, { historyAction: "push" });
  },
  replace: function(t) {
    te(t, { historyAction: "replace" });
  },
  base: function() {
    return Ie();
  },
  toUrl: function(t) {
    return ii(t, Ie());
  },
  current: function() {
    return fe === null ? null : {
      path: fe,
      fullPath: ai,
      base: li,
      params: ci,
      query: di,
      route: ui,
      regions: si
    };
  }
}, Ye = "data-ln-route", oi = "lnRoute";
typeof window < "u" && (window.lnRouter = ri);
function ve(t) {
  gi(t), mi(t), bt.size > 0 && pi();
}
const Er = {
  "data-ln-route": { effect: ve, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: ve, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: ve, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, bt = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new WeakMap();
let si = /* @__PURE__ */ new Map(), cn = !1, fe = null, ai = null, li = "", ci = {}, di = {}, ui = null, Re = !1;
function dn(t, e, i) {
  Re ? queueMicrotask(function() {
    L(t, e, i);
  }) : L(t, e, i);
}
function Xe(t) {
  try {
    const c = new URL(t, window.location.origin);
    t = c.pathname + c.search + c.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, a] = e.split("?");
  const f = {};
  if (a) {
    const c = new URLSearchParams(a);
    for (const [s, n] of c.entries())
      f[s] = n;
  }
  const p = Ie();
  return { path: wr(i, p), query: f, base: p };
}
function fi(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, a = e.segments, f = Math.max(i.length, a.length);
  for (let p = 0; p < f; p++) {
    const l = i[p], c = a[p];
    if (l === void 0) return 1;
    if (c === void 0) return -1;
    if (l === "*") return 1;
    if (c === "*") return -1;
    const s = l.startsWith(":"), n = c.startsWith(":");
    if (s && !n) return 1;
    if (!s && n) return -1;
  }
  return 0;
}
function hi(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const a of e) {
    if (a.pattern === "*")
      return {
        route: a,
        params: { wildcard: t }
      };
    const f = a.segments, p = {};
    let l = !0;
    if (!(i.length > f.length && f[f.length - 1] !== "*")) {
      for (let c = 0; c < f.length; c++) {
        const s = f[c], n = i[c];
        if (s === "*") {
          p.wildcard = i.slice(c).join("/");
          break;
        }
        if (n === void 0) {
          l = !1;
          break;
        }
        if (s.startsWith(":"))
          p[s.slice(1)] = decodeURIComponent(n);
        else if (s !== n) {
          l = !1;
          break;
        }
      }
      if (l && (f.indexOf("*") !== -1 || i.length <= f.length))
        return { route: a, params: p };
    }
  }
  return null;
}
function De(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const f = document.getElementById(t);
    return !f && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), f;
  }
  const a = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !a && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), a;
}
function un(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const f of i)
    for (const p of Object.keys(f))
      if (p.startsWith("ln") && f[p] && typeof f[p].destroy == "function")
        try {
          f[p].destroy();
        } catch (l) {
          console.error(`[ln-router] Error destroying component ${p} on element:`, f, l);
        }
  const a = document.querySelectorAll('[data-ln-popover="open"]');
  for (const f of a) {
    const p = f.lnPopover;
    if (p && p.trigger && t.contains(p.trigger))
      try {
        p.destroy();
      } catch (l) {
        console.error("[ln-router] Error destroying open popover:", l);
      }
  }
}
function te(t, e = {}) {
  const { path: i, query: a, base: f } = Xe(t), p = ii(t, f), l = /* @__PURE__ */ new Map();
  for (const [y, m] of bt)
    l.set(y, hi(i, m.sorted));
  const c = l.get("__primary__") || null, s = De("__primary__", { warn: !!c }), n = bt.has("__primary__"), d = [];
  for (const [y, m] of l) {
    const u = y === "__primary__" ? s : De(y, { warn: !1 }), o = !u && !!(c && c.route && c.route.templateNode && c.route.templateNode.content && c.route.templateNode.content.querySelector("#" + CSS.escape(y)));
    !u && !o && m && console.warn(`[ln-router] Explicit target element #${y} not found in DOM`), d.push({
      regionKey: y,
      match: m,
      targetEl: u,
      isPending: o,
      hasKeep: !!u && u.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!u && u.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!u && u.children.length > 0,
      mountedTemplate: u && we.get(u) || null
    });
  }
  const _ = vr(d, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: c
  });
  if (_.notFound) {
    dn(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if ($(s || document.body, "ln-router:before-navigate", {
    from: fe,
    to: p,
    path: i,
    params: c ? c.params : {},
    query: a
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", p) : e.historyAction === "replace" && window.history.replaceState(null, "", p);
  const v = function() {
    for (const y of _.clears)
      un(y.targetEl), y.targetEl.replaceChildren(), we.delete(y.targetEl);
    for (const y of _.swaps) {
      if ((y.isPending || !y.targetEl || !document.contains(y.targetEl)) && (y.targetEl = y.regionKey === "__primary__" ? s : document.getElementById(y.regionKey)), !y.targetEl) {
        console.warn(`[ln-router] Target element #${y.regionKey} could not be resolved`);
        continue;
      }
      if (y.skipMount || (un(y.targetEl), y.targetEl.replaceChildren(y.match.route.templateNode.content.cloneNode(!0))), we.set(y.targetEl, y.match.route.templateNode), _.owner && y.regionKey === _.owner.regionKey) {
        if (y.match.route.title) {
          let m = y.match.route.title;
          if (y.match.params)
            for (const [u, o] of Object.entries(y.match.params))
              m = m.replace(new RegExp("\\{\\{\\s*" + u + "\\s*\\}\\}", "g"), o);
          document.title = m;
        }
        if (!e.isHydration) {
          y.targetEl.hasAttribute("tabindex") || y.targetEl.setAttribute("tabindex", "-1");
          const m = y.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          m ? (m.setAttribute("tabindex", "-1"), m.focus()) : y.targetEl.focus(), y.regionKey === "__primary__" && y.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      dn(y.targetEl, "ln-router:navigated", {
        path: i,
        fullPath: p,
        base: f,
        params: y.match.params,
        query: a,
        route: y.match.route,
        target: y.targetEl,
        region: y.regionKey
      });
    }
    fe = i, ai = p, li = f, di = a, ui = c ? c.route : null, ci = c ? c.params : {}, si = new Map(
      Array.from(l.entries()).map(([y, m]) => [y, m ? { route: m.route, params: m.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(v) : v();
}
function Ar(t) {
  const e = t.target.closest("a");
  if (!e || !kn(t, e)) return;
  const i = e.getAttribute("href"), { path: a } = Xe(i);
  for (const f of bt.values())
    if (hi(a, f.sorted)) {
      t.preventDefault(), te(i, { historyAction: "push" });
      return;
    }
}
function Sr(t, e) {
  const i = Object.keys(t), a = Object.keys(e);
  if (i.length !== a.length) return !1;
  for (let f = 0; f < i.length; f++) {
    const p = i[f];
    if (t[p] !== e[p]) return !1;
  }
  return !0;
}
function Cr() {
  const t = window.location.pathname + window.location.search, e = ri.current();
  if (e && e.path != null) {
    const i = Xe(t);
    if (e.path === i.path && Sr(e.query, i.query))
      return;
  }
  te(t, { historyAction: "skip" });
}
function pi() {
  cn || (cn = !0, ut(function() {
    document.addEventListener("click", Ar), window.addEventListener("popstate", Cr), Re = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    te(t, { historyAction: "replace", isHydration: !0 }), Re = !1;
  }, "ln-router"));
}
function mi(t) {
  const e = t.getAttribute(Ye);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const a = i || "__primary__";
  bt.has(a) || bt.set(a, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const f = bt.get(a);
  if (f.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${a}"`);
    return;
  }
  const p = t.getAttribute("data-ln-route-title"), l = e.split("/").filter(Boolean), c = {
    pattern: e,
    segments: l,
    target: i,
    title: p,
    templateNode: t
  }, s = De(a);
  s && s.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), f.routes.set(e, c), f.sorted = Array.from(f.routes.values()).sort(fi);
}
function gi(t) {
  const e = t.getAttribute(Ye);
  if (!e) return;
  const a = t.getAttribute("data-ln-route-target") || null || "__primary__", f = bt.get(a);
  f && (f.routes.delete(e), f.sorted = Array.from(f.routes.values()).sort(fi), f.routes.size === 0 && bt.delete(a));
}
function _i(t) {
  return this.dom = t, mi(t), this;
}
_i.prototype.destroy = function() {
  gi(this.dom), delete this.dom[oi];
};
H(Ye, oi, _i, "ln-router", {
  attributes: Er,
  onInit: function() {
    bt.size > 0 && pi();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", i = "data-ln-modal-for", a = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: d,
      description: "Control state of the modal dialog"
    },
    "data-ln-modal-for": {
      type: "string",
      description: "Target modal ID to open on trigger click"
    },
    "data-ln-modal-mode": {
      type: "enum",
      values: ["new", "edit"],
      fallback: "new",
      description: "Operational mode of the modal (new vs edit)"
    },
    "data-ln-modal-close": {
      type: "trigger",
      description: "Click dismiss trigger inside the modal"
    }
  }, p = /* @__PURE__ */ new Set();
  let l = null;
  function c() {
    l || (l = function(_) {
      if (Pe(_)) return;
      const r = _.target.closest("[" + i + "]");
      if (!r || Be(r)) return;
      const v = r.getAttribute(i);
      if (!v) return;
      const y = document.getElementById(v);
      !y || !y[e] || (_.preventDefault(), r.hasAttribute("data-ln-modal-mode") ? y.setAttribute("data-ln-modal-mode", r.getAttribute("data-ln-modal-mode")) : y.hasAttribute("data-ln-modal-mode") && y.setAttribute("data-ln-modal-mode", "new"), y.setAttribute(t, "open"));
    }, document.addEventListener("click", l));
  }
  function s() {
    p.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function n(_) {
    this.dom = _, this.isOpen = _.getAttribute(t) === "open";
    const r = this;
    return this._onRequestOpen = function() {
      r.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      r.dom.setAttribute(t, "close");
    }, this._onCancel = function(v) {
      v.preventDefault(), r.dom.setAttribute(t, "close");
    }, this._onClose = function() {
      !r.isOpen || r.dom.getAttribute(t) !== "open" || r.dom.open || (r._isNativeClosing = !0, r.dom.setAttribute(t, "close"));
    }, this._onClickClose = function(v) {
      const y = v.target.closest("[" + a + "]");
      y && r.dom.contains(y) && (v.preventDefault(), r.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), p.add(this), c(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), L(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const _ = this.dom.getAttribute(t);
    this.dom.setAttribute(t, _ === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), p.delete(this), s(), this.isOpen) {
        const _ = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(v) {
            return v !== _;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function d(_) {
    const r = _[e];
    if (!r) return;
    const v = !!r._isNativeClosing;
    r._isNativeClosing = !1;
    const m = _.getAttribute(t) === "open";
    if (m === r.isOpen) {
      m && _.isConnected && !_.open && typeof _.showModal == "function" && _.showModal();
      return;
    }
    if (m) {
      if ($(_, "ln-modal:before-open", { modalId: _.id, target: _ }).defaultPrevented) {
        _.setAttribute(t, "close");
        return;
      }
      r.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof _.showModal == "function" && _.showModal();
      const o = _.querySelector("[autofocus]");
      if (o && Qt(o))
        o.focus();
      else {
        const b = _.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), g = Array.prototype.find.call(b, Qt);
        if (g) g.focus();
        else {
          const h = _.querySelectorAll("a[href], button:not([disabled])"), A = Array.prototype.find.call(h, Qt);
          A && A.focus();
        }
      }
      L(_, "ln-modal:open", { modalId: _.id, target: _ });
    } else {
      if (!v && $(_, "ln-modal:before-close", { modalId: _.id, target: _ }).defaultPrevented) {
        _.setAttribute(t, "open");
        return;
      }
      r.isOpen = !1, _.hasAttribute("data-ln-modal-mode") && _.setAttribute("data-ln-modal-mode", "new"), typeof _.close == "function" && _.open && _.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), L(_, "ln-modal:close", { modalId: _.id, target: _ });
    }
  }
  H(t, e, n, "ln-modal", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-ui-coordinator": {
      type: "marker",
      description: "Mounts UI coordinator mediating global hash-routing, modals, and toasts"
    }
  };
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const l = p.target.closest('a[href^="#"]');
    if (!l) return;
    const c = l.getAttribute("href"), s = Zt(c);
    for (const n in s) {
      const d = document.getElementById(n);
      if (d && d.lnModal) {
        if (!$e(p)) return;
        _t(n, s[n]), d.lnModal.isOpen || L(d, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function a() {
    const p = location.hash;
    if (!p) return;
    const l = Zt(p);
    for (const c in l) {
      const s = document.getElementById(c);
      s && s.lnModal && !s.lnModal.isOpen && L(s, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", a), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a(), document.addEventListener("ln-modal:close", function(p) {
    const l = p.target;
    l && l.id && at(l.id) !== null && _t(l.id, null);
  }), document.addEventListener("ln-ajax:success", function(p) {
    const c = (p.detail || {}).data;
    if (c && c.message) {
      const n = c.message;
      L(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const s = p.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && at(s.id) !== null && _t(s.id, null), L(s, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(p) {
    const c = (p.detail || {}).data;
    if (c && c.message) {
      const s = c.message;
      L(window, "ln-toast:enqueue", {
        type: s.type || "error",
        title: s.title || "",
        message: typeof s == "string" ? s : s.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(p) {
    const l = p.detail || {};
    l.message && L(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: l.message
    });
  });
  function f(p) {
    return this.dom = p, this;
  }
  f.prototype.destroy = function() {
    delete this.dom[e];
  }, H(t, e, f, "ln-ui-coordinator", {
    attributes: i
  });
})();
function Tr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, a = 0;
  for (let f = 0; f < t.length && i > 0; f++)
    a = f + 1, /[0-9]/.test(t[f]) && i--;
  return i > 0 && (a = t.length), a;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(n) {
    const d = n[e];
    d && (d.isTextElement ? d._initTextElement() : isNaN(d.value) || d._displayFormatted(d.value));
  }
  const a = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"), p = /* @__PURE__ */ new Set();
  let l = !1;
  function c() {
    he(), !l && (l = !0, document.addEventListener("ln-core:locale-change", function() {
      p.forEach(function(n) {
        n.isTextElement ? n._formatTextContent() : isNaN(n.value) || n._displayFormatted(n.value);
      });
    }));
  }
  function s(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const d = this;
    if (p.add(this), c(), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const _ = document.createElement("input");
    _.type = "hidden", _.name = n.name, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && _.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", _), this._hidden = _, Object.defineProperty(_, "value", {
      get: function() {
        return f.get.call(_);
      },
      set: function(v) {
        if (f.set.call(_, v), v !== "" && !isNaN(parseFloat(v))) {
          const y = d.dom.getAttribute("data-ln-number-decimals");
          d._setDisplayRaw(ot(parseFloat(v), J(d.dom), { maxDecimals: y }));
        } else
          d._setDisplayRaw("");
        d.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), ze(n, f, {
      get: function() {
        return f.get.call(n);
      },
      set: function(v) {
        if (v === "") {
          d._setDisplayRaw(""), d._setHiddenRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const y = typeof v == "number" ? v : parseFloat(String(v));
        if (isNaN(y))
          d._setDisplayRaw(String(v)), d._setHiddenRaw("");
        else {
          d._setHiddenRaw(y);
          const m = n.getAttribute("data-ln-number-decimals");
          d._setDisplayRaw(ot(y, J(n), { maxDecimals: m }));
        }
        n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      d._handleInput();
    }, n.addEventListener("input", this._onInput), this._onKeyDown = function(v) {
      if (v.key !== "Backspace") return;
      const y = n.selectionStart, m = n.selectionEnd;
      if (y !== m || y === 0) return;
      const u = ue(J(n)), o = f.get.call(n), b = o[y - 1];
      if (b === u.groupSep || /\s/.test(b)) {
        v.preventDefault();
        const g = y - 2 >= 0 ? y - 2 : 0, h = o.slice(0, g) + o.slice(y);
        f.set.call(n, h), n.setSelectionRange(g, g), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, n.addEventListener("keydown", this._onKeyDown), this._onPaste = function(v) {
      v.preventDefault();
      const y = (v.clipboardData || window.clipboardData).getData("text"), m = ur(y, J(n));
      d.value = isNaN(m) ? NaN : m;
    }, n.addEventListener("paste", this._onPaste);
    const r = n.value;
    if (r !== "") {
      const v = parseFloat(r);
      if (!isNaN(v)) {
        const y = n.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(v), this._setDisplayRaw(ot(v, J(n), { maxDecimals: y })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return n.form && (this._onFormReset = function() {
      setTimeout(function() {
        const v = n.defaultValue;
        if (v !== "") {
          const y = parseFloat(v);
          if (!isNaN(y)) {
            const m = n.getAttribute("data-ln-number-decimals");
            d._setHiddenRaw(y), d._setDisplayRaw(ot(y, J(n), { maxDecimals: m })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
            return;
          }
        }
        d._setHiddenRaw(""), d._setDisplayRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }, 0);
    }, n.form.addEventListener("reset", this._onFormReset)), this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom;
    let d = n.getAttribute("data-ln-value"), _ = n.getAttribute("data-ln-number"), r = null;
    d !== null && d !== "" ? r = d : _ !== null && _ !== "" && _ !== "true" ? r = _ : r = n.textContent.trim();
    const v = parseFloat(r);
    isNaN(v) ? this._rawValue = null : (this._rawValue = v, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", String(v)), this._formatTextContent());
  }, s.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const n = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ot(this._rawValue, J(this.dom), { maxDecimals: n });
    }
  }, s.prototype._handleInput = function() {
    const n = this.dom, d = f.get.call(n);
    if (d === "") {
      this._setHiddenRaw(""), L(n, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (d === "-") {
      this._setHiddenRaw(""), L(n, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const _ = n.selectionStart;
    let r = 0;
    for (let S = 0; S < _; S++)
      /[0-9]/.test(d[S]) && r++;
    const v = J(n), y = ue(v);
    let m = d, u = ti(d, y.groupSep, y.decimalSep), o = parseFloat(u);
    if (isNaN(o)) {
      this._setHiddenRaw(""), L(n, "ln-number:input", { value: NaN, formatted: d });
      return;
    }
    const b = n.getAttribute("data-ln-number-decimals"), g = u.indexOf(".");
    if (b !== null && g !== -1) {
      const S = parseInt(b, 10), C = u.slice(g + 1);
      if (S === 0)
        u = u.slice(0, g), m = m.split(y.decimalSep)[0], o = parseFloat(u), this._setDisplayRaw(m);
      else if (C.length > S) {
        u = u.slice(0, g + 1 + S);
        const k = m.split(y.decimalSep);
        m = k[0] + y.decimalSep + k[1].slice(0, S), o = parseFloat(u), this._setDisplayRaw(m);
      }
    }
    const h = n.getAttribute("data-ln-number-max");
    if (h !== null && o > parseFloat(h)) {
      const S = parseFloat(h), C = ot(S, v, { maxDecimals: b });
      this._setDisplayRaw(C), this._setHiddenRaw(S), n.setSelectionRange(C.length, C.length), L(n, "ln-number:input", { value: S, formatted: C });
      return;
    }
    if (m.endsWith(y.decimalSep) || y.decimalSep !== "." && m.endsWith(".")) {
      this._setHiddenRaw(o), L(n, "ln-number:input", { value: o, formatted: m });
      return;
    }
    const A = u.indexOf(".");
    if (A !== -1 && u.slice(A + 1).endsWith("0")) {
      this._setHiddenRaw(o), L(n, "ln-number:input", { value: o, formatted: m });
      return;
    }
    let w;
    if (b !== null)
      w = ot(o, v, { maxDecimals: b });
    else {
      const S = A !== -1 ? u.slice(A + 1).length : 0;
      w = ot(o, v, { userDecimals: S });
    }
    this._setDisplayRaw(w);
    const E = Tr(w, r);
    n.setSelectionRange(E, E), this._setHiddenRaw(o), L(n, "ln-number:input", { value: o, formatted: w });
  }, s.prototype._setHiddenRaw = function(n) {
    this._hidden && f.set.call(this._hidden, String(n));
  }, s.prototype._setDisplayRaw = function(n) {
    this.isTextElement ? this.dom.textContent = String(n) : f.set.call(this.dom, String(n));
  }, s.prototype._displayFormatted = function(n) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const d = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(n, J(this.dom), { maxDecimals: d }));
    }
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const n = f.get.call(this._hidden);
      return n === "" ? NaN : parseFloat(n);
    },
    set: function(n) {
      const d = typeof n == "number" ? n : parseFloat(n);
      if (this.isTextElement) {
        isNaN(d) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = d, this.dom.setAttribute("data-ln-value", String(d)), this._formatTextContent());
        return;
      }
      if (isNaN(d)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(d);
      const _ = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(d, J(this.dom), { maxDecimals: _ })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : f.get.call(this.dom);
    }
  }), s.prototype.destroy = function() {
    this.dom[e] && (p.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this._onFormReset && this.dom.form && this.dom.form.removeEventListener("reset", this._onFormReset), this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, H(t, e, s, "ln-number", {
    attributes: a,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Oe = /^(short|medium|long)(\s+datetime)?$/, kr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Lr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Oe) ? kr[t.trim()] : null;
}
function Vt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let i, a;
  if (e.indexOf(".") !== -1)
    i = ".", a = e.split(".");
  else if (e.indexOf("/") !== -1)
    i = "/", a = e.split("/");
  else if (e.indexOf("-") !== -1)
    i = "-", a = e.split("-");
  else
    return null;
  if (a.length !== 3) return null;
  const f = [];
  for (let n = 0; n < 3; n++) {
    const d = parseInt(a[n], 10);
    if (isNaN(d)) return null;
    f.push(d);
  }
  let p, l, c;
  i === "." ? (p = f[0], l = f[1], c = f[2]) : i === "/" ? (l = f[0], p = f[1], c = f[2]) : a[0].length === 4 ? (c = f[0], l = f[1], p = f[2]) : (p = f[0], l = f[1], c = f[2]), c < 100 && (c += c < 50 ? 2e3 : 1900);
  const s = new Date(c, l - 1, p);
  return s.getFullYear() !== c || s.getMonth() !== l - 1 || s.getDate() !== p ? null : s;
}
function Ee(t, e, i, a) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const f = t.getDate(), p = t.getMonth(), l = t.getFullYear(), c = t.getHours(), s = t.getMinutes();
  let n, d;
  const _ = (i || "").toLowerCase().split("-")[0];
  let r = !1;
  try {
    const m = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    r = !!(a && m !== _);
  } catch {
    r = !!a;
  }
  if (r && a && a.monthsLong)
    n = a.monthsLong[p];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(p + 1);
    }
  if (r && a && a.monthsShort)
    d = a.monthsShort[p];
  else
    try {
      d = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      d = String(p + 1);
    }
  const v = {
    yyyy: String(l),
    yy: String(l).slice(-2),
    MMMM: n,
    MMM: d,
    MM: String(p + 1).padStart(2, "0"),
    M: String(p + 1),
    dd: String(f).padStart(2, "0"),
    d: String(f),
    HH: String(c).padStart(2, "0"),
    mm: String(s).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(y) {
    return v[y] !== void 0 ? v[y] : y;
  });
}
function re(t, e, i, a) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const f = Lr(e);
  if (f)
    try {
      const p = new Intl.DateTimeFormat(i, f), l = (i || "").toLowerCase().split("-")[0], c = p.resolvedOptions().locale.toLowerCase().split("-")[0];
      return a && c !== l ? Ee(t, "dd.MM.yyyy", i, a) : p.format(t);
    } catch {
      return Ee(t, "dd.MM.yyyy", i, a);
    }
  return Ee(t, e || "dd.MM.yyyy", i, a);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(r) {
    const v = r[e];
    if (v) {
      if (v.isTextElement)
        v._initTextElement();
      else if (v.value) {
        const y = it(v.value);
        y && v._displayFormatted(y);
      }
    }
  }
  const a = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: i, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: i, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: i, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: i, description: "Raw ISO date string or timestamp for non-time elements (td, span)" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(r, v, y) {
    L(r.dom, "ln-date:change", {
      value: v,
      formatted: r.dom.value,
      date: y
    }), r.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(r, v, y, m) {
    r._setHiddenRaw(v), f.set.call(r._picker, v), r._lastISO = v, m !== void 0 ? (r._isFormatting = !0, r.dom.value = m, r._isFormatting = !1) : y && r._displayFormatted(y), p(r, v, y);
  }
  function c(r) {
    r._setHiddenRaw(""), f.set.call(r._picker, ""), r._isFormatting = !0, r.dom.value = "", r._isFormatting = !1, r._lastISO = "", p(r, "", null);
  }
  const s = /* @__PURE__ */ new Set();
  let n = !1;
  function d() {
    he(), !n && (n = !0, document.addEventListener("ln-core:locale-change", function() {
      s.forEach(function(r) {
        if (r.isTextElement)
          r._formatTextContent();
        else if (r.value) {
          const v = it(r.value);
          v && r._displayFormatted(v);
        }
      });
    }));
  }
  function _(r) {
    if (r[e]) return r[e];
    r[e] = this, this.dom = r;
    const v = this;
    if (s.add(this), d(), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const y = r.value, m = r.name, u = r.closest(".form-element, form") || r.parentNode;
    if (u) {
      const w = u.querySelectorAll("[data-ln-date-dict]");
      for (let E = 0; E < w.length; E++) {
        const S = w[E].getAttribute("data-ln-date-dict");
        if (S) {
          const C = Dn(w[E], "data-ln-date-dict-key");
          C["months-long"] && (C.monthsLong = C["months-long"].split(",").map((k) => k.trim())), C["months-short"] && (C.monthsShort = C["months-short"].split(",").map((k) => k.trim())), Rn(S, C);
        }
      }
    }
    const o = document.createElement("span");
    o.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(o, r), o.appendChild(r), this._wrapper = o;
    const b = document.createElement("input");
    b.type = "hidden", b.name = m, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && b.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", b), this._hidden = b;
    const g = document.createElement("input");
    g.type = "date", g.tabIndex = -1, g.setAttribute("tabindex", "-1"), g.setAttribute("aria-hidden", "true"), g.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Date picker"), g.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", b.insertAdjacentElement("afterend", g), this._picker = g, r.type = "text";
    const h = document.createElement("button");
    h.type = "button", h.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Open date picker"), h.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', g.insertAdjacentElement("afterend", h), this._btn = h, this._lastISO = "", Object.defineProperty(b, "value", {
      get: function() {
        return f.get.call(b);
      },
      set: function(w) {
        if (f.set.call(b, w), w && w !== "") {
          const E = it(w);
          E && l(v, w, E);
        } else w === "" && c(v);
      }
    }), ze(r, f, {
      get: function() {
        return f.get.call(r);
      },
      set: function(w, E) {
        if (v._isFormatting) {
          E(w);
          return;
        }
        if (!w || w === "") {
          E(""), c(v);
          return;
        }
        const S = it(w) || Vt(w);
        if (S) {
          const C = Bt(S), k = r.getAttribute(t) || "", x = J(r), D = Dt(x), I = re(S, k, x, D);
          E(I), l(v, C, S, I);
        } else
          E(String(w)), c(v);
      }
    }), this._onPickerChange = function() {
      const w = g.value;
      if (w) {
        const E = it(w);
        E && l(v, w, E);
      } else
        c(v);
    }, g.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const w = v.dom.value.trim();
      if (w === "") {
        v._lastISO !== "" && c(v);
        return;
      }
      if (v._lastISO) {
        const S = it(v._lastISO);
        if (S) {
          const C = v.dom.getAttribute(t) || "", k = J(v.dom), x = Dt(k);
          if (w === re(S, C, k, x)) return;
        }
      }
      const E = Vt(w);
      if (E) {
        const S = Bt(E);
        l(v, S, E);
      } else if (v._lastISO) {
        const S = it(v._lastISO);
        S && v._displayFormatted(S);
      } else
        v.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      v._openPicker();
    }, h.addEventListener("click", this._onBtnClick);
    const A = r.form;
    if (A && (this._form = A, this._onFormReset = function() {
      setTimeout(function() {
        const w = v.dom.value;
        if (w) {
          const E = it(w) || Vt(w);
          if (E) {
            const S = Bt(E);
            l(v, S, E);
            return;
          }
        }
        c(v);
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), y && y !== "") {
      const w = it(y);
      w && l(v, y, w);
    }
    return this;
  }
  _.prototype._initTextElement = function() {
    const r = this.dom, v = r.getAttribute("data-ln-value"), y = r.getAttribute("data-ln-date"), m = r.getAttribute("datetime");
    let u = null;
    r.tagName === "TIME" && m !== null && m !== "" ? u = m : v !== null && v !== "" ? u = v : m !== null && m !== "" ? u = m : y !== null && y !== "" && y !== "true" && !Oe.test(y) ? u = y : u = r.textContent.trim();
    const o = it(u) || Vt(u);
    if (o && !isNaN(o.getTime())) {
      const b = Bt(o);
      this._rawValue = b, r.tagName !== "TIME" && !r.hasAttribute("data-ln-value") && r.setAttribute("data-ln-value", b), this._formatTextContent();
    } else
      this._rawValue = null;
  }, _.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const r = it(this._rawValue);
      if (r) {
        let y = this.dom.getAttribute("data-ln-date-format");
        if (!y) {
          const o = this.dom.getAttribute("data-ln-date");
          o && Oe.test(o) && (y = o);
        }
        const m = J(this.dom), u = Dt(m);
        this.dom.textContent = re(r, y || "medium", m, u);
      }
    }
  }, _.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, _.prototype._setHiddenRaw = function(r) {
    f.set.call(this._hidden, r);
  }, _.prototype._displayFormatted = function(r) {
    const v = this.dom.getAttribute(t) || "", y = J(this.dom), m = Dt(y);
    this._isFormatting = !0, this.dom.value = re(r, v, y, m), this._isFormatting = !1;
  }, Object.defineProperty(_.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : f.get.call(this._hidden);
    },
    set: function(r) {
      if (this.isTextElement) {
        if (!r || r === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const y = it(r) || Vt(r);
        if (!y) return;
        const m = Bt(y);
        this._rawValue = m, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", m) : this.dom.setAttribute("data-ln-value", m), this._formatTextContent();
        return;
      }
      if (!r || r === "") {
        c(this);
        return;
      }
      const v = it(r);
      v && l(this, r, v);
    }
  }), Object.defineProperty(_.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? it(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      this.value = Bt(r);
    }
  }), Object.defineProperty(_.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), _.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (s.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", r && (this.dom.value = r), delete this.dom[e];
  }, H(t, e, _, "ln-date", {
    attributes: a,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-nav": { effect: l, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: xt, effect: l, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, a = X(i);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const c = history.pushState;
    history.pushState = function() {
      c.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    };
    const s = history.replaceState;
    history.replaceState = function() {
      s.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    }, history._lnNavPatched = !0;
  }
  function f(c) {
    return this.dom = c, Y(this, c, a), this.activeClass = c.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = null, this.update(), this;
  }
  f.prototype.update = function() {
    if (!this.activeClass || $(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, d = p(n), _ = [];
    for (const r of s) {
      const v = r.getAttribute("href");
      if (!v || v === "#" || v.startsWith("#") || v.startsWith("javascript:") || v.startsWith("mailto:") || v.startsWith("tel:")) {
        r.classList.remove(this.activeClass), r.removeAttribute("aria-current");
        continue;
      }
      if (r.hostname && r.hostname !== window.location.hostname) {
        r.classList.remove(this.activeClass), r.removeAttribute("aria-current");
        continue;
      }
      const y = p(v), m = y === d, u = !this.exact && y !== "/" && d.startsWith(y + "/");
      m || u ? (r.classList.add(this.activeClass), r.setAttribute("aria-current", "page"), _.push(r)) : (r.classList.remove(this.activeClass), r.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: _ });
  }, f.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const c = history._lnNavCallbacks.indexOf(this.updateHandler);
    c !== -1 && history._lnNavCallbacks.splice(c, 1), delete this.dom[e];
  };
  function p(c) {
    try {
      return new URL(c, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return c.replace(/\/$/, "") || "/";
    }
  }
  function l(c, s) {
    const n = c[e];
    if (n) {
      if (s === t) {
        if (!c.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const d = n.activeClass, _ = c.getAttribute(t) || "active";
        if (d !== _) {
          const r = c.querySelectorAll("a");
          for (const v of r)
            d && v.classList.remove(d);
          n.activeClass = _;
        }
      }
      n.update();
    }
  }
  H(t, e, f, "ln-nav", {
    attributes: i,
    onSubtreeChange: function(c) {
      c[e] && c[e].update();
    }
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(l, c) {
    const s = l.getAttribute("data-ln-persist"), n = s !== null && s !== "" ? s : l.id;
    return n ? l.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + c : "ln:" + n + ":" + c : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
  }
  let i = null;
  function a() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const l = "__ln_persist_test__";
      return localStorage.setItem(l, l), localStorage.removeItem(l), i = !0;
    } catch {
      return i = !1;
    }
  }
  const f = /* @__PURE__ */ new Set();
  function p(l, c) {
    const s = window.lnCore && window.lnCore._attrRegistry, n = s && s.persist || [];
    let d = null;
    for (let y = 0; y < n.length; y++)
      if (n[y].selector === c) {
        d = n[y];
        break;
      }
    if (!d) return;
    const _ = d.persist;
    if (f.has(_.attr) || (f.add(_.attr), Ft([_.attr], function(y, m) {
      if (!y.hasAttribute("data-ln-persist") || _.hashActive && _.hashActive(y)) return;
      const u = e(y, m);
      if (!u || !a()) return;
      const o = y.getAttribute(m);
      try {
        o === null ? localStorage.removeItem(u) : localStorage.setItem(u, o);
      } catch {
      }
    })), _.hashActive && _.hashActive(l)) return;
    const r = e(l, _.attr);
    if (!r || !a()) return;
    const v = localStorage.getItem(r);
    v !== null && l.setAttribute(_.attr, v);
  }
  $i(p);
})();
function fn(t, e, i, a) {
  const f = (t || "").toLowerCase().trim();
  if (f) return f;
  if ((e || "").toUpperCase() !== "A") return "";
  const p = i || "";
  if (!p.startsWith("#")) return "";
  const l = p.slice(1);
  if (!l) return "";
  const c = l.split("&"), s = (a || "").toLowerCase().trim();
  if (s)
    for (const _ of c) {
      const r = _.indexOf(":");
      if (r > 0 && _.slice(0, r).toLowerCase().trim() === s)
        return _.slice(r + 1).toLowerCase().trim();
    }
  const n = c[c.length - 1] || "", d = n.indexOf(":");
  return (d > 0 ? n.slice(d + 1) : n).toLowerCase().trim();
}
function hn(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (p) => (p.tagName || "").toUpperCase() === "A" && (p.href || "").startsWith("#")
  ), a = i.length > 0 && i.length === t.length, f = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : a && !f ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: a && !!f,
    warning: null
  };
}
function pn(t, e, i) {
  const a = (t || "").toLowerCase().trim();
  return a && Array.isArray(e) && e.includes(a) ? a : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(s) {
    const n = s.getAttribute("data-ln-tabs-active");
    s[e] && s[e]._applyActive(n);
  }
  function a(s, n) {
    return (s.getAttribute(n) || s.id || "").toLowerCase().trim();
  }
  const f = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: xt, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: a, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, p = X(f);
  function l(s) {
    return this.dom = s, Y(this, s, p), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const s = this.tabs.map((_) => ({
      tagName: _.tagName,
      href: _.getAttribute("href")
    })), n = hn(s, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const _ of this.tabs) {
      const r = fn(_.getAttribute("data-ln-tab"), _.tagName, _.getAttribute("href"), this.nsKey);
      r ? this.mapTabs[r] = _ : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', _);
    }
    for (const _ of this.panels) {
      const r = (_.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      r && (this.mapPanels[r] = _);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const d = this;
    this._clickHandlers = [];
    for (const _ of this.tabs) {
      if (_[e + "Trigger"]) continue;
      const r = function(v) {
        const y = _.tagName === "A";
        if (!y && (v.ctrlKey || v.metaKey || v.button === 1)) return;
        const m = fn(_.getAttribute("data-ln-tab"), _.tagName, _.getAttribute("href"), d.nsKey);
        m && (y && !$e(v) || (d.hashEnabled ? at(d.nsKey) === m ? d.dom.setAttribute("data-ln-tabs-active", m) : _t(d.nsKey, m) : d.dom.setAttribute("data-ln-tabs-active", m)));
      };
      _.addEventListener("click", r), _[e + "Trigger"] = r, d._clickHandlers.push({ el: _, handler: r });
    }
    if (this._onRequestSelect = function(_) {
      const r = _.detail && (_.detail.key || _.detail.tab);
      r && d.select(r);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!d.hashEnabled) return;
      const _ = at(d.nsKey);
      d.dom.setAttribute("data-ln-tabs-active", _ !== null ? _ : d.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const _ = pn(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", _);
    }
  }
  l.prototype.select = function(s) {
    const n = (s + "").toLowerCase().trim();
    n && (this.hashEnabled ? at(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : _t(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, l.prototype._applyActive = function(s) {
    var d;
    if (s = pn(s, Object.keys(this.mapPanels), this.defaultKey), s === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && $(this.dom, "ln-tabs:before-change", {
      key: s,
      previousKey: n,
      tab: this.mapTabs[s],
      panel: this.mapPanels[s],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && at(this.nsKey) !== n && _t(this.nsKey, n));
      return;
    }
    this.activeKey = s;
    for (const _ in this.mapTabs) {
      const r = this.mapTabs[_];
      _ === s ? (r.hasAttribute("data-active") || r.setAttribute("data-active", ""), r.getAttribute("aria-selected") !== "true" && r.setAttribute("aria-selected", "true")) : (r.hasAttribute("data-active") && r.removeAttribute("data-active"), r.getAttribute("aria-selected") !== "false" && r.setAttribute("aria-selected", "false"));
    }
    for (const _ in this.mapPanels) {
      const r = this.mapPanels[_], v = _ === s;
      r.hidden !== !v && (r.hidden = !v), r.classList.contains("hidden") !== !v && r.classList.toggle("hidden", !v);
      const y = v ? "false" : "true";
      r.getAttribute("aria-hidden") !== y && r.setAttribute("aria-hidden", y);
    }
    if (this.autoFocus) {
      const _ = (d = this.mapPanels[s]) == null ? void 0 : d.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      _ && setTimeout(() => _.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: s,
      previousKey: n,
      tab: this.mapTabs[s],
      panel: this.mapPanels[s],
      target: this.dom
    });
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: s, handler: n } of this._clickHandlers)
        s.removeEventListener("click", n), delete s[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, H(t, e, l, "ln-tabs", {
    attributes: f,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(s) {
        const n = Array.from(s.querySelectorAll("[data-ln-tab]")).map(function(_) {
          return { tagName: _.tagName, href: _.getAttribute("href") };
        }), d = (s.getAttribute("data-ln-tabs-key") || s.id || "").toLowerCase().trim();
        return hn(n, d).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", a = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-toggle": { effect: r, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, p = /* @__PURE__ */ new Set();
  let l = null;
  function c(v, y) {
    return y === "open" ? "open" : y === "close" || v === "open" ? "close" : "open";
  }
  function s() {
    l || (l = function(v) {
      if (Pe(v)) return;
      const y = v.target.closest("[" + i + "]");
      if (!y || Be(y)) return;
      const m = y.getAttribute(i);
      if (!m) return;
      const u = document.getElementById(m);
      if (!u || !u[e]) return;
      v.preventDefault();
      const o = y.getAttribute(a) || "toggle", b = u.getAttribute(t);
      u.setAttribute(t, c(b, o));
    }, document.addEventListener("click", l));
  }
  function n() {
    p.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function d(v, y) {
    if (!v || !v.id) return;
    const m = document.querySelectorAll(
      "[" + i + '="' + v.id + '"]'
    );
    for (let u = 0; u < m.length; u++)
      m[u].setAttribute("aria-expanded", y ? "true" : "false");
  }
  function _(v) {
    this.dom = v;
    const y = this;
    return this._onRequestOpen = function() {
      y.open();
    }, this._onRequestClose = function() {
      y.close();
    }, this._onRequestToggle = function() {
      y.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = v.getAttribute(t) === "open", this.isOpen && v.classList.add("open"), d(v, this.isOpen), p.add(this), s(), this;
  }
  _.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, _.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, _.prototype.toggle = function() {
    const v = this.dom.getAttribute(t);
    this.dom.setAttribute(t, c(v, "toggle"));
  }, _.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), p.delete(this), delete this.dom[e], n());
  };
  function r(v) {
    const y = v[e];
    if (!y) return;
    const u = v.getAttribute(t) === "open";
    if (u !== y.isOpen)
      if (u) {
        if ($(v, "ln-toggle:before-open", { target: v }).defaultPrevented) {
          v.setAttribute(t, "close");
          return;
        }
        y.isOpen = !0, v.classList.add("open"), d(v, !0), L(v, "ln-toggle:open", { target: v });
      } else {
        if ($(v, "ln-toggle:before-close", { target: v }).defaultPrevented) {
          v.setAttribute(t, "open");
          return;
        }
        y.isOpen = !1, v.classList.remove("open"), d(v, !1), L(v, "ln-toggle:close", { target: v });
      }
  }
  H(t, e, _, "ln-toggle", {
    attributes: f,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function a(f) {
    return this.dom = f, this._onToggleOpen = function(p) {
      if (!p.detail || !p.detail.target || p.detail.target.closest("[data-ln-accordion]") !== f) return;
      const l = f.querySelectorAll("[data-ln-toggle]");
      for (const c of l)
        c !== p.detail.target && c.closest("[data-ln-accordion]") === f && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      L(f, "ln-accordion:change", { target: p.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, H(t, e, a, "ln-accordion", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", i = "bottom-end";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: i, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, f = X(a);
  function p(l) {
    this.dom = l, Y(this, l, f), this.toggleEl = l.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = l.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const c = this;
    return this._onRequestOpen = function() {
      c.toggleEl && c.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      c.toggleEl && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (c.toggleEl) {
        const s = c.toggleEl.getAttribute("data-ln-toggle");
        c.toggleEl.setAttribute("data-ln-toggle", s === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(s) {
      const n = c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (s.key === "Escape") {
        n && (s.preventDefault(), s.stopPropagation(), c.toggleEl.setAttribute("data-ln-toggle", "close"), c.triggerBtn && c.triggerBtn.focus());
        return;
      }
      if (s.key === "Tab") {
        n && (c.triggerBtn && c.triggerBtn.focus(), c.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const d = c._getMenuItems();
      if (d.length === 0) return;
      if (!n && (s.key === "ArrowDown" || s.key === "ArrowUp")) {
        s.preventDefault(), c.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const r = c._getMenuItems();
          r.length > 0 && c._focusItem(r, s.key === "ArrowDown" ? 0 : r.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const _ = d.indexOf(document.activeElement);
      if (s.key === "ArrowDown") {
        s.preventDefault();
        const r = _ < d.length - 1 ? _ + 1 : 0;
        c._focusItem(d, r);
      } else if (s.key === "ArrowUp") {
        s.preventDefault();
        const r = _ > 0 ? _ - 1 : d.length - 1;
        c._focusItem(d, r);
      } else s.key === "Home" ? (s.preventDefault(), c._focusItem(d, 0)) : s.key === "End" && (s.preventDefault(), c._focusItem(d, d.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(s) {
      !s.detail || s.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "true"), typeof c.toggleEl.showPopover == "function" && c.toggleEl.showPopover(), c._initMenuAria(), c._reposition(), c._addOutsideClickListener(), c._addScrollRepositionListener(), c._addResizeCloseListener(), L(l, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      !s.detail || s.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "false"), c._removeOutsideClickListener(), c._removeScrollRepositionListener(), c._removeResizeCloseListener(), c.toggleEl.style.top = "", c.toggleEl.style.left = "", c.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof c.toggleEl.hidePopover == "function" && c.toggleEl.matches(":popover-open") && c.toggleEl.hidePopover(), L(l, "ln-dropdown:close", { target: s.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  p.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const l = this.toggleEl.querySelectorAll("li");
    for (const s of l)
      s.setAttribute("role", "none");
    const c = this._getMenuItems();
    for (let s = 0; s < c.length; s++)
      c[s].setAttribute("role", "menuitem"), c[s].setAttribute("tabindex", s === 0 ? "0" : "-1");
  }, p.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, p.prototype._focusItem = function(l, c) {
    for (let s = 0; s < l.length; s++)
      l[s].setAttribute("tabindex", s === c ? "0" : "-1");
    l[c] && l[c].focus();
  }, p.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl || !document.contains(this.toggleEl)) return;
    const l = this.triggerBtn.getBoundingClientRect(), c = xe(this.toggleEl), s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, d = de(l, c, n, s), _ = d.top + "px", r = d.left + "px";
    this.toggleEl.style.top !== _ && (this.toggleEl.style.top = _), this.toggleEl.style.left !== r && (this.toggleEl.style.left = r), this.toggleEl.getAttribute("data-ln-dropdown-placement") !== d.placement && this.toggleEl.setAttribute("data-ln-dropdown-placement", d.placement);
  }, p.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const l = this;
    this._boundDocClick = function(c) {
      l.dom.contains(c.target) || l.toggleEl && l.toggleEl.contains(c.target) || l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open" && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, l._docClickTimeout = setTimeout(function() {
      l._docClickTimeout = null, document.addEventListener("click", l._boundDocClick);
    }, 0);
  }, p.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, p.prototype._addScrollRepositionListener = function() {
    const l = this;
    this._scrollRepositionRaf = null, this._boundScrollReposition = function() {
      l._scrollRepositionRaf || (l._scrollRepositionRaf = requestAnimationFrame(function() {
        l._scrollRepositionRaf = null, l._reposition();
      }));
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, p.prototype._removeScrollRepositionListener = function() {
    this._scrollRepositionRaf && (cancelAnimationFrame(this._scrollRepositionRaf), this._scrollRepositionRaf = null), this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, p.prototype._addResizeCloseListener = function() {
    const l = this;
    this._boundResizeClose = function() {
      l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open" && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, p.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), delete this.dom[e]);
  }, H(t, e, p, "ln-dropdown", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", a = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: _, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, p = [];
  let l = null;
  function c() {
    l || (l = function(r) {
      if (r.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", l));
  }
  function s() {
    p.length > 0 || l && (document.removeEventListener("keydown", l), l = null);
  }
  function n(r) {
    this.dom = r, this.isOpen = r.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const v = this;
    return this._onRequestOpen = function(y) {
      const m = y.detail && y.detail.trigger ? y.detail.trigger : null;
      v.open(m);
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function(y) {
      const m = y.detail && y.detail.trigger ? y.detail.trigger : null;
      v.toggle(m);
    }, this._onNativeToggle = function(y) {
      y.newState === "closed" && v.isOpen && (v._applyClose(), v.dom.setAttribute(t, "closed"));
    }, r.addEventListener("ln-popover:request-open", this._onRequestOpen), r.addEventListener("ln-popover:request-close", this._onRequestClose), r.addEventListener("ln-popover:request-toggle", this._onRequestToggle), r.addEventListener("toggle", this._onNativeToggle), r.hasAttribute("tabindex") || r.setAttribute("tabindex", "-1"), r.hasAttribute("role") || r.setAttribute("role", "dialog"), r.hasAttribute("popover") || r.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(r) {
    this.isOpen || (this.trigger = r || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(r) {
    this.isOpen ? this.close() : this.open(r);
  }, n.prototype._applyOpen = function(r) {
    this.isOpen = !0, r && (this.trigger = r), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const v = xe(this.dom);
    if (this.trigger) {
      const o = this.trigger.getBoundingClientRect(), b = this.dom.getAttribute(a) || "bottom", g = de(o, v, b, 8);
      this.dom.style.top = g.top + "px", this.dom.style.left = g.left + "px", this.dom.setAttribute("data-ln-popover-placement", g.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const y = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), m = Array.prototype.find.call(y, Qt);
    m ? m.focus() : this.dom.focus();
    const u = this;
    this._boundDocClick = function(o) {
      u.dom.contains(o.target) || u.trigger && u.trigger.contains(o.target) || u.close();
    }, u._docClickTimeout = setTimeout(function() {
      u._docClickTimeout = null, document.addEventListener("click", u._boundDocClick);
    }, 0), this._repositionRaf = null, this._performReposition = function() {
      if (!u.trigger || !document.contains(u.dom)) return;
      const o = u.trigger.getBoundingClientRect(), b = xe(u.dom), g = u.dom.getAttribute(a) || "bottom", h = de(o, b, g, 8), A = h.top + "px", w = h.left + "px";
      u.dom.style.top !== A && (u.dom.style.top = A), u.dom.style.left !== w && (u.dom.style.left = w), u.dom.getAttribute("data-ln-popover-placement") !== h.placement && u.dom.setAttribute("data-ln-popover-placement", h.placement);
    }, this._boundReposition = function() {
      u._repositionRaf || (u._repositionRaf = requestAnimationFrame(function() {
        u._repositionRaf = null, u._performReposition();
      }));
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), c(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const r = p.indexOf(this);
    r !== -1 && p.splice(r, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.dom.removeEventListener("toggle", this._onNativeToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function d(r) {
    this.dom = r;
    const v = r.getAttribute(i);
    return r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", "false"), r.setAttribute("aria-controls", v), this._onClick = function(y) {
      if (y.ctrlKey || y.metaKey || y.button === 1) return;
      y.preventDefault();
      const m = document.getElementById(v);
      if (!m) return;
      m[e] && (m[e].trigger = r);
      const u = m.getAttribute(t);
      m.setAttribute(t, u === "open" ? "closed" : "open");
    }, r.addEventListener("click", this._onClick), this;
  }
  d.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function _(r) {
    const v = r[e];
    if (!v) return;
    const m = r.getAttribute(t) === "open";
    if (m !== v.isOpen)
      if (m) {
        if ($(r, "ln-popover:before-open", {
          popoverId: r.id,
          target: r,
          trigger: v.trigger
        }).defaultPrevented) {
          r.setAttribute(t, "closed");
          return;
        }
        v._applyOpen(v.trigger);
      } else {
        if ($(r, "ln-popover:before-close", {
          popoverId: r.id,
          target: r,
          trigger: v.trigger
        }).defaultPrevented) {
          r.setAttribute(t, "open");
          return;
        }
        v._applyClose();
      }
  }
  H(t, e, n, "ln-popover", {
    attributes: f
  }), H(i, e + "Trigger", d, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", a = "lnTooltipEnhance", f = "ln-tooltip-portal";
  if (window[a] !== void 0) return;
  const p = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let l = 0, c = null, s = null, n = null, d = null, _ = null, r = null;
  function v() {
    return c && c.parentNode || (c = document.getElementById(f), c || (c = document.createElement("div"), c.id = f, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function y() {
    r || (r = function(g) {
      g.key === "Escape" && o();
    }, document.addEventListener("keydown", r));
  }
  function m() {
    r && (document.removeEventListener("keydown", r), r = null);
  }
  function u(g) {
    if (n === g) return;
    o();
    const h = g.getAttribute(e) || g.getAttribute("title");
    if (!h) return;
    v(), typeof c.showPopover == "function" && c.showPopover(), g.hasAttribute("title") && (d = g.getAttribute("title"), g.removeAttribute("title"));
    const A = g.getAttribute("aria-describedby");
    A ? _ = A : _ = null;
    const w = document.createElement("div");
    w.className = "ln-tooltip", w.textContent = h, g[a + "Uid"] || (l += 1, g[a + "Uid"] = "ln-tooltip-" + l), w.id = g[a + "Uid"], c.appendChild(w);
    const E = w.offsetWidth, S = w.offsetHeight, C = g.getBoundingClientRect(), k = g.getAttribute(i) || "top", x = de(C, { width: E, height: S }, k, 6);
    w.style.top = x.top + "px", w.style.left = x.left + "px", w.setAttribute("data-ln-tooltip-placement", x.placement), _ ? g.setAttribute("aria-describedby", _ + " " + w.id) : g.setAttribute("aria-describedby", w.id), s = w, n = g, y();
  }
  function o() {
    if (!s) {
      m();
      return;
    }
    n && (_ !== null ? n.setAttribute("aria-describedby", _) : n.removeAttribute("aria-describedby"), _ = null, d !== null && n.setAttribute("title", d)), d = null, s.parentNode && s.parentNode.removeChild(s), s = null, n = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), m();
  }
  function b(g) {
    return this.dom = g, g.hasAttribute("data-ln-tooltip-enhanced") || (g.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      u(g);
    }, this._onLeave = function() {
      n === g && !g.contains(document.activeElement) && o();
    }, this._onFocus = function() {
      u(g);
    }, this._onBlur = function() {
      n === g && !g.matches(":hover") && o();
    }, g.addEventListener("mouseenter", this._onEnter), g.addEventListener("mouseleave", this._onLeave), g.addEventListener("focus", this._onFocus, !0), g.addEventListener("blur", this._onBlur, !0), this;
  }
  b.prototype.destroy = function() {
    const g = this.dom;
    g.removeEventListener("mouseenter", this._onEnter), g.removeEventListener("mouseleave", this._onLeave), g.removeEventListener("focus", this._onFocus, !0), g.removeEventListener("blur", this._onBlur, !0), n === g && o(), this._addedEnhancedAttr && g.removeAttribute("data-ln-tooltip-enhanced"), delete g[a], delete g[a + "Uid"];
  }, H(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    a,
    b,
    "ln-tooltip",
    {
      attributes: p
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: qt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: qt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, f = X(a);
  function p(u) {
    if (!(!u || !(u instanceof HTMLElement)) && (u.hasAttribute("popover") || u.setAttribute("popover", "manual"), typeof u.showPopover == "function")) {
      if (u.matches(":popover-open"))
        try {
          u.hidePopover();
        } catch {
        }
      try {
        u.showPopover();
      } catch {
      }
    }
  }
  function l(u) {
    if (!u || !(u instanceof HTMLElement)) return;
    if (u.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof u.hidePopover == "function" && u.matches(":popover-open"))
      try {
        u.hidePopover();
      } catch {
      }
  }
  function c(u) {
    this.dom = u, Y(this, u, f);
    const o = Array.from(u.querySelectorAll("[data-ln-toast-item]"));
    for (; o.length > this.max; ) u.removeChild(o.shift());
    for (const b of o) v(b, this);
    return o.length > 0 && p(u), this;
  }
  c.prototype.enqueue = function(u) {
    if (!u) return;
    const o = s(u, this.dom);
    if (!o) return;
    const b = Number.isFinite(u.timeout) ? u.timeout : this.timeoutDefault;
    d(this, o), b > 0 && (o._timer = setTimeout(() => _(o), b));
  }, c.prototype.clear = function() {
    for (const u of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      _(u);
  }, c.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const u of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        _(u);
      l(this.dom), delete this.dom[e];
    }
  };
  function s(u, o) {
    const b = ((u.type || "") + "").trim().toLowerCase(), g = Lt(o, i, "ln-toast");
    if (!g)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    pt(g, {
      type: b,
      title: u.title,
      message: typeof u.message == "string" ? u.message : void 0
    });
    const h = g.firstElementChild;
    if (!h) return null;
    h.hasAttribute("data-ln-toast-item") || h.setAttribute("data-ln-toast-item", ""), h.classList.add("ln-enter");
    const A = h.querySelector(".body");
    A && n(A, u);
    const w = h.querySelector("[data-ln-toast-close]");
    return w && w.addEventListener("click", function() {
      _(h);
    }), h;
  }
  function n(u, o) {
    if (Array.isArray(o.message)) {
      const b = document.createElement("ul");
      for (const g of o.message) {
        const h = document.createElement("li");
        h.textContent = g, b.appendChild(h);
      }
      u.appendChild(b);
    }
    if (o.data && o.data.errors) {
      const b = document.createElement("ul");
      for (const g of Object.values(o.data.errors).flat()) {
        const h = document.createElement("li");
        h.textContent = g, b.appendChild(h);
      }
      u.appendChild(b);
    }
  }
  function d(u, o) {
    const b = Array.from(u.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; b.length >= u.max && b.length > 0; ) u.dom.removeChild(b.shift());
    u.dom.appendChild(o), p(u.dom), requestAnimationFrame(() => o.classList.remove("ln-enter"));
  }
  function _(u) {
    if (!u || !u.parentNode) return;
    const o = u.parentNode;
    clearTimeout(u._timer), u.classList.remove("ln-enter"), u.classList.add("ln-out"), setTimeout(() => {
      u.parentNode && (u.parentNode.removeChild(u), l(o));
    }, 200);
  }
  function r(u) {
    let o = u && u.container;
    return typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), o || null;
  }
  function v(u, o) {
    if (u._lnToastHydrated) return;
    u._lnToastHydrated = !0;
    const b = u.querySelector("[data-ln-toast-close]");
    b && b.addEventListener("click", function() {
      _(u);
    });
    const g = +(u.getAttribute("data-ln-toast-timeout") ?? o.timeoutDefault);
    g > 0 && (u._timer = setTimeout(function() {
      _(u);
    }, g));
  }
  function y(u) {
    const o = u.detail || {}, b = r(o);
    if (!b) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (b[e] || (b[e] = new c(b))).enqueue(o);
  }
  function m(u) {
    const o = u && u.detail || {};
    if (o.container) {
      const b = r(o);
      b && (b[e] || (b[e] = new c(b))).clear();
    } else {
      const b = document.querySelectorAll("[" + t + "]");
      for (const g of Array.from(b))
        (g[e] || (g[e] = new c(g))).clear();
    }
  }
  ut(function() {
    window.addEventListener("ln-toast:enqueue", y), window.addEventListener("ln-toast:clear", m), window.addEventListener("ln-modal:open", function() {
      const u = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const o of Array.from(u))
        o.querySelectorAll("[data-ln-toast-item]").length > 0 && p(o);
    });
  }, "ln-toast"), H(t, e, c, "ln-toast", {
    attributes: a
  });
})();
function qr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function bi(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function xr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = bi(t.name), a = String(t.type || "").toLowerCase();
  return e.some((f) => {
    if (f.includes("/")) {
      if (f.endsWith("/*")) {
        const p = f.slice(0, -1);
        return a.startsWith(p);
      }
      return a === f;
    }
    return i === f;
  });
}
function Ir(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const a = 1024, f = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], p = Math.floor(Math.log(t) / Math.log(a)), l = Math.min(p, f.length - 1), c = t / Math.pow(a, l);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(c) + " " + f[l];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", a = "file_ids[]";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-upload": { prop: "uploadUrl", read: j, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: j, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: qt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: qt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: j, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: j, type: "string", fallback: a, description: "Form field name for submitting uploaded file IDs" },
    "data-ln-upload-dict": { type: "string", description: "Dictionary key prefix mapping for translatable upload messages" },
    "data-ln-upload-zone": { type: "marker", description: "Designates container as dropzone for drag-and-drop file uploads" },
    "data-ln-upload-list": { type: "marker", description: "Container element holding rendered upload items" },
    "data-ln-upload-item": { type: "marker", description: "Container element for an individual file upload item" },
    "data-ln-upload-action": { type: "enum", values: ["remove", "retry"], description: "Action button within upload item" },
    "data-ln-upload-state": { type: "enum", values: ["ready", "dragover", "pending", "uploading", "success", "error"], description: "Runtime status of dropzone or individual upload item" },
    "data-ln-upload-id": { type: "string", description: "Server-assigned file identifier for completed upload" },
    "data-ln-upload-local-id": { type: "string", description: "Client-generated unique ID for tracking file item in DOM" },
    "data-ln-upload-size": { type: "integer", min: 0, description: "File size in bytes" },
    "data-ln-upload-ext": { type: "string", description: "Normalized file extension" }
  }, p = X(f);
  function l(n, d, _) {
    return Ir(n, d, _);
  }
  function c() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function s(n) {
    this.dom = n, Y(this, n, p), this.dict = Dn(n, "data-ln-upload-dict"), this.locale = J(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const d = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = qr(d), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  s.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const d = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let r = 0; r < d.length; r++) {
      const v = d[r], y = v.getAttribute("data-ln-upload-id"), m = "file-" + ++n.fileIdCounter;
      v.setAttribute("data-ln-upload-local-id", m);
      const u = v.querySelector('[data-ln-field="name"]'), o = v.querySelector('[data-ln-field="sizeText"]'), b = v.getAttribute("data-ln-upload-size"), g = b ? parseInt(b, 10) : null;
      n.uploadedFiles.set(m, {
        serverId: y || null,
        name: u ? u.textContent.trim() : "",
        size: g !== null && !isNaN(g) ? g : o ? o.textContent.trim() : ""
      });
    }
    const _ = this.dom.querySelectorAll('input[type="hidden"]');
    for (let r = 0; r < _.length; r++) {
      const v = _[r];
      if (v.name === n.idsFieldName && v.value && !Array.from(n.uploadedFiles.values()).some(function(m) {
        return String(m.serverId) === String(v.value);
      })) {
        const m = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(m, {
          serverId: v.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, s.prototype._syncHiddenInputs = function() {
    const n = this, d = this.dom.querySelectorAll('input[type="hidden"]');
    for (let _ = 0; _ < d.length; _++)
      d[_].name === n.idsFieldName && d[_].remove();
    for (const [, _] of this.uploadedFiles)
      if (_.serverId) {
        const r = document.createElement("input");
        r.type = "hidden", r.name = n.idsFieldName, r.value = _.serverId, n.dom.appendChild(r);
      }
  }, s.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(d) {
      n.zone === n.dom && d.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && d.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(d) {
      d.preventDefault(), d.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(d) {
      d.preventDefault(), d.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(d) {
      d.preventDefault(), d.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(d) {
      d.preventDefault(), d.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), d.dataTransfer && d.dataTransfer.files && n.upload(d.dataTransfer.files);
    }, this._onListClick = function(d) {
      const _ = d.target.closest('[data-ln-upload-action="remove"]');
      if (!_ || !n.list || !n.list.contains(_) || _.disabled) return;
      const r = _.closest("[data-ln-upload-item]");
      if (r) {
        const v = r.getAttribute("data-ln-upload-local-id");
        v && n.remove(v);
      }
    }, this._onRequestUpload = function(d) {
      d.detail && d.detail.files && n.upload(d.detail.files);
    }, this._onRequestRemove = function(d) {
      if (d.detail) {
        const _ = d.detail.localId !== void 0 ? d.detail.localId : d.detail.serverId;
        _ !== void 0 && n.remove(_);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, s.prototype.upload = function(n) {
    const d = this, _ = Array.from(n);
    for (let r = 0; r < _.length; r++) {
      const v = _[r];
      if (d.maxFiles > 0 && d.uploadedFiles.size >= d.maxFiles) {
        L(d.dom, "ln-upload:invalid", {
          file: v,
          reason: "max-files"
        });
        continue;
      }
      if (!xr(v, d.allowedExts)) {
        L(d.dom, "ln-upload:invalid", {
          file: v,
          reason: "accept"
        });
        continue;
      }
      if (d.maxSize > 0 && v.size > d.maxSize) {
        L(d.dom, "ln-upload:invalid", {
          file: v,
          reason: "max-size"
        });
        continue;
      }
      $(d.dom, "ln-upload:before-upload", { file: v }).defaultPrevented || d._uploadSingleFile(v);
    }
  }, s.prototype._uploadSingleFile = function(n) {
    const d = this, _ = "file-" + ++d.fileIdCounter, r = bi(n.name);
    let v = null;
    if (this.list) {
      const b = Lt(this.dom, "ln-upload-item", "ln-upload");
      if (b && (v = b.firstElementChild, v)) {
        v.setAttribute("data-ln-upload-item", ""), v.setAttribute("data-ln-upload-local-id", _), v.setAttribute("data-ln-upload-ext", r), v.setAttribute("data-ln-upload-state", "uploading"), pt(v, {
          name: n.name,
          sizeText: "0%",
          removeLabel: d.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const g = v.querySelector('[data-ln-upload-action="remove"]');
        g && (g.disabled = !0);
        const h = v.querySelector("[data-ln-progress]");
        h && h.setAttribute("data-ln-progress", "0"), d.list.appendChild(v);
      }
    }
    const y = new FormData();
    y.append(d.fileFieldName, n);
    const m = this.dom.querySelectorAll("input, select, textarea");
    for (let b = 0; b < m.length; b++) {
      const g = m[b];
      !g.name || g.name === d.idsFieldName || g.type === "file" || (g.type === "checkbox" || g.type === "radio") && !g.checked || y.append(g.name, g.value);
    }
    const u = new XMLHttpRequest();
    d.uploadedFiles.set(_, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: u
    }), u.upload.addEventListener("progress", function(b) {
      if (b.lengthComputable) {
        const g = Math.round(b.loaded / b.total * 100);
        if (v) {
          const h = v.querySelector("[data-ln-progress]");
          h && h.setAttribute("data-ln-progress", String(g)), pt(v, { sizeText: g + "%" });
        }
        L(d.dom, "ln-upload:progress", {
          localId: _,
          file: n,
          percent: g,
          loaded: b.loaded,
          total: b.total
        });
      }
    }), u.addEventListener("load", function() {
      const b = d.uploadedFiles.get(_);
      if (b && delete b.xhr, u.status >= 200 && u.status < 300) {
        let g;
        try {
          g = JSON.parse(u.responseText);
        } catch (A) {
          o(d.dict.error || "Error", u.status, A);
          return;
        }
        const h = g.id || g.serverId;
        if (v) {
          v.removeAttribute("data-ln-upload-state"), h && v.setAttribute("data-ln-upload-id", String(h)), pt(v, {
            sizeText: l(g.size || n.size, d.locale, d.dict),
            uploading: !1
          });
          const A = v.querySelector('[data-ln-upload-action="remove"]');
          A && (A.disabled = !1);
        }
        b && (b.serverId = h, b.size = g.size || n.size, b.name = g.name || n.name), d._syncHiddenInputs(), L(d.dom, "ln-upload:uploaded", {
          localId: _,
          serverId: h,
          name: g.name || n.name,
          size: g.size || n.size,
          response: g
        });
      } else {
        let g = "";
        try {
          g = JSON.parse(u.responseText).message || "";
        } catch {
        }
        o(g, u.status, null);
      }
    }), u.addEventListener("error", function() {
      const b = d.uploadedFiles.get(_);
      b && delete b.xhr, o("", 0, null);
    });
    function o(b, g, h) {
      if (v) {
        v.setAttribute("data-ln-upload-state", "error"), pt(v, {
          sizeText: d.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const A = v.querySelector('[data-ln-upload-action="remove"]');
        A && (A.disabled = !1);
      }
      L(d.dom, "ln-upload:error", {
        file: n,
        message: b,
        status: g,
        error: h
      });
    }
    d.uploadUrl ? (u.open("POST", d.uploadUrl), u.setRequestHeader("X-CSRF-TOKEN", c()), u.setRequestHeader("X-Requested-With", "XMLHttpRequest"), u.setRequestHeader("Accept", "application/json"), u.send(y)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, s.prototype.remove = function(n) {
    const d = this;
    let _ = null, r = null;
    if (d.uploadedFiles.has(n))
      _ = n, r = d.uploadedFiles.get(n);
    else
      for (const [u, o] of d.uploadedFiles)
        if (String(o.serverId) === String(n)) {
          _ = u, r = o;
          break;
        }
    if (!_ || !r || $(d.dom, "ln-upload:before-remove", {
      localId: _,
      serverId: r.serverId
    }).defaultPrevented) return;
    const y = d.list ? d.list.querySelector('[data-ln-upload-local-id="' + _ + '"]') : null;
    if (r.xhr && typeof r.xhr.abort == "function" && r.xhr.abort(), !r.serverId) {
      y && y.remove(), d.uploadedFiles.delete(_), d._syncHiddenInputs(), L(d.dom, "ln-upload:removed", { localId: _, serverId: null });
      return;
    }
    let m = null;
    if (d.deleteUrlPattern ? m = d.deleteUrlPattern.replace("{id}", encodeURIComponent(r.serverId)) : d.uploadUrl && d.uploadUrl.includes("{id}") && (m = d.uploadUrl.replace("{id}", encodeURIComponent(r.serverId))), !m) {
      y && y.remove(), d.uploadedFiles.delete(_), d._syncHiddenInputs(), L(d.dom, "ln-upload:removed", { localId: _, serverId: r.serverId });
      return;
    }
    y && (y.setAttribute("data-ln-upload-state", "deleting"), pt(y, { deleting: !0 })), fetch(m, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": c(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(u) {
      u.ok ? (y && y.remove(), d.uploadedFiles.delete(_), d._syncHiddenInputs(), L(d.dom, "ln-upload:removed", {
        localId: _,
        serverId: r.serverId
      })) : (y && (y.removeAttribute("data-ln-upload-state"), pt(y, { deleting: !1 })), L(d.dom, "ln-upload:error", {
        file: r,
        message: "",
        status: u.status
      }));
    }).catch(function(u) {
      y && (y.removeAttribute("data-ln-upload-state"), pt(y, { deleting: !1 })), L(d.dom, "ln-upload:error", {
        file: r,
        message: "",
        status: 0,
        error: u
      });
    });
  }, s.prototype.clear = function() {
    const n = this;
    if (!$(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, _] of this.uploadedFiles)
        if (_.xhr && typeof _.xhr.abort == "function" && _.xhr.abort(), _.serverId) {
          let r = null;
          n.deleteUrlPattern ? r = n.deleteUrlPattern.replace("{id}", encodeURIComponent(_.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (r = n.uploadUrl.replace("{id}", encodeURIComponent(_.serverId))), r && fetch(r, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": c(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), L(n.dom, "ln-upload:cleared", {});
    }
  }, s.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return n.serverId;
    }).filter(Boolean);
  }, s.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return {
        serverId: n.serverId,
        name: n.name,
        size: n.size
      };
    });
  }, s.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, n] of this.uploadedFiles)
        n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, delete this.dom[e];
    }
  }, H(t, e, s, "ln-upload", {
    attributes: f
  });
})();
function yi(t, e) {
  if (t.length !== 1) return t;
  const i = t.charCodeAt(0);
  if (i >= 65 && i <= 90) {
    const a = ((i - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + a);
  }
  if (i >= 97 && i <= 122) {
    const a = ((i - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + a);
  }
  if (i >= 48 && i <= 57) {
    const a = ((i - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + a);
  }
  return t;
}
function vi(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let a = "";
    const f = i.length;
    for (let p = 0; p < f; p++)
      a += String.fromCharCode(i[p]);
    return btoa(a);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function wi(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), a = new Uint8Array(i.length);
      for (let f = 0; f < i.length; f++)
        a[f] = i.charCodeAt(f);
      return new TextDecoder().decode(a);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Ei(t, e) {
  const i = String(e || "ln-ashlar");
  let a;
  typeof TextEncoder < "u" ? a = new TextEncoder().encode(i) : typeof Buffer < "u" ? a = Buffer.from(i, "utf-8") : a = [108, 110];
  const f = a.length || 1, p = new Uint8Array(t.length);
  for (let l = 0; l < t.length; l++)
    p[l] = t[l] ^ a[l % f];
  return p;
}
function Ai(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let a;
  if (typeof TextEncoder < "u")
    a = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    a = Buffer.from(i, "utf-8");
  else
    return "";
  const f = Ei(a, e);
  let p = "";
  for (let l = 0; l < f.length; l++)
    p += String.fromCharCode(f[l]);
  return typeof btoa < "u" ? btoa(p) : typeof Buffer < "u" ? Buffer.from(f).toString("base64") : "";
}
function Si(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const i = String(t).trim();
    let a = "";
    if (typeof atob < "u")
      a = atob(i);
    else if (typeof Buffer < "u")
      a = Buffer.from(i, "base64").toString("binary");
    else
      return t;
    const f = new Uint8Array(a.length);
    for (let l = 0; l < a.length; l++)
      f[l] = a.charCodeAt(l);
    const p = Ei(f, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(p);
    if (typeof Buffer < "u")
      return Buffer.from(p).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Ci(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", a = Number(t.shift) || 13, f = t.key || "ln-ashlar";
    return { codec: i, shift: a, key: f };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function Rr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = Ci(e);
  return i.codec === "base64" ? vi(t) : i.codec === "xor" ? Ai(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (a) => yi(a, i.shift));
}
function Ae(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = Ci(e);
  return i.codec === "base64" ? wi(t) : i.codec === "xor" ? Si(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (a) => yi(a, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(l) {
    const c = l[e];
    c && c.deobfuscate();
  }
  const a = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function f(l) {
    return l[e] ? l[e] : (l[e] = this, this.dom = l, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  f.prototype.deobfuscate = function() {
    const l = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && l && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((u) => !this.dom.contains(u.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const u = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(o) {
          return o.parentElement && o.parentElement.classList && o.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; u.nextNode(); )
        this._originalTextNodes.push({
          node: u.currentNode,
          raw: u.currentNode.nodeValue
        });
    }
    const s = this.dom.getAttribute(t), n = parseInt(s, 10), d = isNaN(n) ? 13 : n, _ = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), r = this.dom.getAttribute("data-ln-obfuscator-key");
    let v = "rot";
    _ === "xor" || _ === "base64" ? v = _ : r && (v = "xor");
    const y = r || "ln-ashlar", m = { codec: v, shift: d, key: y };
    if (l && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const u = this.dom.querySelectorAll(".sr-only");
      for (let b = 0; b < u.length; b++)
        u[b].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const o = (this.dom.rel || "").split(/\s+/).filter(function(b) {
        return b && b !== "noopener" && b !== "noreferrer";
      });
      o.length > 0 ? this.dom.rel = o.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let u = 0; u < this._originalTextNodes.length; u++) {
        const o = this._originalTextNodes[u];
        o.node && o.raw && o.raw.length > 0 && (o.node.nodeValue = Ae(o.raw, m));
      }
    if (l && this._originalHref) {
      const u = Ae(this._originalHref, m);
      this.dom.setAttribute("href", u);
    }
    L(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: v,
      shift: d,
      key: v === "xor" ? y : null
    });
  }, f.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let l = 0; l < this._originalTextNodes.length; l++) {
          const c = this._originalTextNodes[l];
          c.node && c.raw && (c.node.nodeValue = c.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const p = H(t, e, f, "ln-obfuscator", {
    attributes: a
  });
  p.obfuscate = Rr, p.deobfuscate = Ae, p.utf8ToBase64 = vi, p.base64ToUtf8 = wi, p.xorObfuscate = Ai, p.xorDeobfuscate = Si;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(c) {
    return c.hostname && c.hostname !== window.location.hostname;
  }
  function i(c) {
    if (c.getAttribute("data-ln-external-link") === "processed" || !e(c)) return;
    c.target = "_blank";
    const s = (c.rel || "").split(/\s+/).filter(Boolean);
    s.includes("noopener") || s.push("noopener"), s.includes("noreferrer") || s.push("noreferrer"), c.rel = s.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", c.appendChild(n), c.setAttribute("data-ln-external-link", "processed"), L(c, "ln-external-links:processed", {
      link: c,
      href: c.href
    });
  }
  function a(c) {
    c = c || document.body;
    for (const s of c.querySelectorAll("a, area"))
      i(s);
  }
  function f() {
    ut(function() {
      document.body.addEventListener("click", function(c) {
        const s = c.target.closest("a, area");
        s && s.getAttribute("data-ln-external-link") === "processed" && L(s, "ln-external-links:clicked", {
          link: s,
          href: s.href,
          text: s.textContent || s.title || ""
        });
      });
    }, "ln-external-links");
  }
  function p() {
    ut(function() {
      ne({
        onInit: function(c) {
          if (c.matches && (c.matches("a") || c.matches("area")) && i(c), c.querySelectorAll)
            for (const s of c.querySelectorAll("a, area"))
              i(s);
        }
      }), Ft(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && i(c);
      });
    }, "ln-external-links");
  }
  function l() {
    f(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      a();
    }) : a();
  }
  window[t] = {
    process: a
  }, l();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function a() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function f(o) {
    i && (i.textContent = o, i.classList.add("ln-link-status--visible"));
  }
  function p() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function l(o, b) {
    if (b.target.closest("a, button, input, select, textarea")) return;
    const g = o.querySelector("a");
    if (!g) return;
    const h = g.getAttribute("href");
    if (!h) return;
    if (b.ctrlKey || b.metaKey || b.button === 1) {
      window.open(h, "_blank", "noopener,noreferrer");
      return;
    }
    $(o, "ln-link:navigate", { target: o, href: h, link: g }).defaultPrevented || g.click();
  }
  function c(o) {
    const b = o.querySelector("a");
    if (!b) return;
    const g = b.getAttribute("href");
    g && f(g);
  }
  function s() {
    p();
  }
  function n(o) {
    o[e + "Row"] || !o.querySelector("a") || (o[e + "Row"] = !0, o._lnLinkClick = function(g) {
      l(o, g);
    }, o._lnLinkEnter = function() {
      c(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", s));
  }
  function d(o) {
    o[e + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", s), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[e + "Row"]);
  }
  function _(o) {
    if (!o[e + "Init"]) return;
    const b = o.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const g = b === "TABLE" && o.querySelector("tbody") || o;
      for (const h of g.querySelectorAll("tr"))
        d(h);
    } else
      d(o);
    delete o[e + "Init"];
  }
  function r(o) {
    if (o[e + "Init"]) return;
    o[e + "Init"] = !0;
    const b = o.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const g = b === "TABLE" && o.querySelector("tbody") || o;
      for (const h of g.querySelectorAll("tr"))
        n(h);
    } else
      n(o);
  }
  function v(o) {
    o.hasAttribute && o.hasAttribute(t) && r(o);
    const b = o.querySelectorAll ? o.querySelectorAll("[" + t + "]") : [];
    for (const g of b)
      r(g);
  }
  function y() {
    ut(function() {
      ne({
        query: "[" + t + "]",
        onInit: function(o) {
          v(o);
        },
        onSubtreeChange: function(o, b) {
          for (let g = 0; g < b.addedNodes.length; g++) {
            const h = b.addedNodes[g];
            if (h.nodeType === 1) {
              if (h.tagName === "TR")
                n(h);
              else if (h.querySelectorAll) {
                const A = h.querySelectorAll("tr");
                for (let w = 0; w < A.length; w++)
                  n(A[w]);
              }
            }
          }
        }
      }), Ft([t], function(o) {
        o.hasAttribute && o.hasAttribute(t) ? v(o) : _(o);
      });
    }, "ln-link");
  }
  function m(o) {
    v(o);
  }
  window[e] = { init: m, destroy: _ };
  function u() {
    a(), y(), m(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", u) : u();
})();
(function() {
  const t = "data-ln-scroll", e = "lnScroll";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-scroll": { effect: null, type: "string", description: "Target element ID or CSS selector to scroll into view" },
    "data-ln-scroll-behavior": { effect: null, type: "enum", values: ["smooth", "auto"], fallback: "smooth", description: "Scroll animation behavior transition" },
    "data-ln-scroll-block": { effect: null, type: "enum", values: ["start", "center", "end", "nearest"], fallback: "start", description: "Vertical alignment positioning of scrolled target" },
    "data-ln-scroll-set": { effect: null, type: "string", description: "Optional state attribute assignment on target after scroll (e.g. data-ln-toggle=open)" },
    "data-ln-scroll-focus": { effect: null, type: "string", description: 'CSS selector of element to focus after scroll, or "false" to disable' },
    "data-ln-scroll-delay": { effect: null, type: "integer", fallback: 450, min: 0, description: "Delay in milliseconds before shifting keyboard focus" },
    "data-ln-scroll-update-hash": { effect: null, type: "boolean", fallback: !1, description: "Whether to update URL hash with target ID" }
  };
  function a(f) {
    if (f[e]) return f[e];
    if (!(!f || f.tagName !== "A" && f.tagName !== "BUTTON"))
      return f[e] = this, this.dom = f, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  a.prototype._handleClick = function(f) {
    if (this.dom.tagName === "A" && (f.ctrlKey || f.metaKey || f.shiftKey || f.altKey || f.button !== 0))
      return;
    let p = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (p || (p = (this.dom.getAttribute("href") || "").trim()), !p || p === "#")
      return;
    !p.startsWith("#") && !p.startsWith(".") && !p.startsWith("[") && (p = "#" + p);
    let l = null;
    try {
      l = document.querySelector(p);
    } catch {
      const y = p.replace(/^#/, "");
      l = document.getElementById(y);
    }
    if (!l) return;
    f.preventDefault();
    const c = this.dom.getAttribute("data-ln-scroll-set");
    if (c) {
      const v = c.indexOf(":");
      if (v !== -1) {
        const y = c.slice(0, v).trim(), m = c.slice(v + 1).trim();
        try {
          const u = document.querySelector(y);
          u && (u.value = m, u.dispatchEvent(new Event("input", { bubbles: !0 })), u.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if ($(this.dom, "ln-scroll:before-scroll", {
      target: l,
      link: this.dom,
      href: p
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", d = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (l.scrollIntoView({ behavior: n, block: d }), xt(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", p);
      } catch {
      }
    const r = this.dom.getAttribute("data-ln-scroll-focus");
    if (r !== "false" && r !== "0") {
      const v = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), y = isNaN(v) ? 450 : v;
      window.setTimeout(function() {
        let m = null;
        if (r && r !== "true" && r !== "1")
          try {
            m = document.querySelector(r);
          } catch {
          }
        m || (m = l.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !m && l.getAttribute("tabindex") !== null && (m = l), m && typeof m.focus == "function" && m.focus({ preventScroll: !0 });
      }, y);
    }
    L(this.dom, "ln-scroll:scrolled", {
      target: l,
      link: this.dom,
      href: p
    });
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, H(t, e, a, "ln-scroll", {
    attributes: i
  });
})();
const $t = ["Ctrl", "Alt", "Shift", "Meta"], Dr = {
  alt: "Alt",
  control: "Ctrl",
  ctrl: "Ctrl",
  meta: "Meta",
  command: "Meta",
  cmd: "Meta",
  option: "Alt",
  shift: "Shift",
  esc: "Escape",
  escape: "Escape",
  space: "Space",
  spacebar: "Space",
  enter: "Enter",
  return: "Enter",
  tab: "Tab",
  backspace: "Backspace",
  delete: "Delete",
  del: "Delete",
  insert: "Insert",
  home: "Home",
  end: "End",
  pageup: "PageUp",
  pagedown: "PageDown",
  arrowup: "ArrowUp",
  up: "ArrowUp",
  arrowdown: "ArrowDown",
  down: "ArrowDown",
  arrowleft: "ArrowLeft",
  left: "ArrowLeft",
  arrowright: "ArrowRight",
  right: "ArrowRight"
};
function Ti(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = Dr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function ki(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), a = /* @__PURE__ */ new Set();
  let f = "";
  for (let l = 0; l < i.length; l++) {
    const c = Ti(i[l]);
    if (!c) return "";
    if ($t.indexOf(c) !== -1) {
      a.add(c);
      continue;
    }
    if (f) return "";
    f = c;
  }
  if (!f) return "";
  const p = [];
  for (let l = 0; l < $t.length; l++)
    a.has($t[l]) && p.push($t[l]);
  return p.push(f), p.join("+");
}
function Or(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), a = [];
  for (let f = 0; f < i.length; f++) {
    const p = ki(i[f]);
    p && a.indexOf(p) === -1 && a.push(p);
  }
  return a;
}
function Nr(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const a = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(a) ? "" : ki(a ? a + "+" + i : i);
}
function Mr(t) {
  if (!t) return "";
  const e = Ti(t.key);
  if (!e || $t.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function Fr(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const i = t.getAttribute("contenteditable");
    if (i === "" || String(i).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Pr(t, e, i, a) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const f = String(e.tagName || "").toLowerCase();
  return f === "button" ? a === "Enter" || a === "Space" : f === "a" && e.hasAttribute && e.hasAttribute("href") && a === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", a = "data-ln-key-allow-input", f = "data-ln-key-modifier", p = "data-ln-key-for", l = "lnKeyFor";
  if (window[e] !== void 0) return;
  function c(b) {
    const g = b[e];
    if (g) {
      if (!b.hasAttribute(t)) {
        g.destroy();
        return;
      }
      g.sync();
    }
  }
  function s(b) {
    const g = b[l];
    g && !b.hasAttribute(p) && g.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: c, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: c, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: c, description: "Permits shortcut execution even when focused inside an editable input" }
  }, d = {
    "data-ln-key-for": { type: "string", effect: s, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, _ = /* @__PURE__ */ new Set();
  let r = null;
  function v() {
    r || (r = function(b) {
      if (b.defaultPrevented || b.isComposing || b.repeat) return;
      const g = Mr(b);
      if (!g) return;
      const h = Qi(b.target), A = document.querySelectorAll("[" + t + "], [" + p + "]");
      let w = null, E = !1, S = !1;
      for (let x = 0; x < A.length; x++) {
        const D = A[x], I = D[e] || D[l];
        if (!I || !I.matches(g) || h && !I.allowsInput()) continue;
        const R = I.resolveTarget(), N = Fr(R);
        if (!(!N || !Yi(R, N))) {
          if (Pr(b, R, N, g)) {
            S = !0;
            continue;
          }
          w ? E = !0 : w = { host: D, target: R, action: N };
        }
      }
      if (S || !w) return;
      E && console.warn('[ln-key] Duplicate active shortcut "' + g + '"; first DOM match wins.');
      const C = {
        source: w.host,
        target: w.target,
        action: w.action,
        key: g,
        event: b
      };
      $(w.host, "ln-key:before-trigger", C).defaultPrevented || (b.preventDefault(), w.target[w.action](), L(w.host, "ln-key:trigger", C));
    }, document.addEventListener("keydown", r));
  }
  function y() {
    _.size > 0 || !r || (document.removeEventListener("keydown", r), r = null);
  }
  function m(b) {
    return this.dom = b, this.shortcuts = [], _.add(this), this.sync(), v(), this;
  }
  m.prototype.sync = function() {
    this.shortcuts = Or(this.dom.getAttribute(t));
  }, m.prototype.matches = function(b) {
    return this.shortcuts.indexOf(b) !== -1;
  }, m.prototype.allowsInput = function() {
    return this.dom.hasAttribute(a);
  }, m.prototype.resolveTarget = function() {
    const b = this.dom.getAttribute(i);
    return b ? o(b, i) : this.dom;
  }, m.prototype.destroy = function() {
    this.dom[e] && (_.delete(this), delete this.dom[e], y());
  };
  function u(b) {
    return this.dom = b, _.add(this), v(), this;
  }
  u.prototype._modifierContext = function() {
    return this.dom.closest("[" + f + "]");
  }, u.prototype.shortcut = function() {
    const b = this._modifierContext(), g = b ? b.getAttribute(f) : "";
    return Nr(g, this.dom.textContent);
  }, u.prototype.matches = function(b) {
    return this.shortcut() === b;
  }, u.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(a)) return !0;
    const b = this._modifierContext();
    return !!(b && b.hasAttribute(a));
  }, u.prototype.resolveTarget = function() {
    return o(this.dom.getAttribute(p), p);
  }, u.prototype.destroy = function() {
    this.dom[l] && (_.delete(this), delete this.dom[l], y());
  };
  function o(b, g) {
    if (!b) return null;
    try {
      const h = document.querySelector(b);
      return h || console.warn("[ln-key] Target not found for " + g + ' selector "' + b + '".'), h;
    } catch {
      return console.warn("[ln-key] Invalid " + g + ' selector "' + b + '".'), null;
    }
  }
  H(t, e, m, "ln-key", {
    attributes: n
  }), H(p, l, u, "ln-key-for", {
    attributes: d
  });
})();
function Br(t, e, i = 100) {
  if (e != null && e !== "") {
    const a = parseFloat(String(e));
    if (!isNaN(a) && a > 0) return a;
  }
  if (t != null && t !== "") {
    const a = parseFloat(String(t));
    if (!isNaN(a) && a > 0) return a;
  }
  return i;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function i(l) {
    const c = l[e];
    c && p.call(c);
  }
  const a = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function f(l) {
    return this.dom = l, this._parentObserver = null, p.call(this), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function p() {
    const l = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, s = c ? c.getAttribute("data-ln-progress-max") : null, n = this.dom.getAttribute("data-ln-progress-max"), d = Br(n, s, 100), _ = Zn(l, d);
    this.dom.style.width = _.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(_.min)), this.dom.setAttribute("aria-valuemax", String(_.max)), this.dom.setAttribute("aria-valuenow", String(_.clampedValue)), L(this.dom, "ln-progress:change", {
      target: this.dom,
      value: _.value,
      max: _.max,
      percentage: _.percentage
    });
  }
  H(
    t,
    e,
    f,
    "ln-progress",
    {
      attributes: a
    }
  ), Ft(["data-ln-progress-max"], function(l) {
    const c = l.querySelectorAll ? l.querySelectorAll(t) : [];
    for (let s = 0; s < c.length; s++) {
      const n = c[s][e];
      n && p.call(n);
    }
  });
})();
function Ur(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function Hr(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const a = Object.keys(e);
  if (a.length === 0) return !0;
  for (let f = 0; f < a.length; f++) {
    const p = e[a[f]];
    let l = "";
    if (p.col !== null && p.col !== void 0 ? l = t[p.col] || "" : p.attr && i && typeof i.getAttribute == "function" && (l = i.getAttribute(p.attr) || ""), !Qe(l, p.values))
      return !1;
  }
  return !0;
}
function mn(t, e, i, a) {
  if (a != null && !isNaN(a))
    return parseInt(a, 10);
  if (e && typeof e.getAttribute == "function") {
    const f = e.getAttribute("data-ln-filter-col");
    if (f !== null && !isNaN(parseInt(f, 10)))
      return parseInt(f, 10);
    if (typeof e.closest == "function") {
      const p = e.closest("th");
      if (p && typeof p.cellIndex == "number")
        return p.cellIndex;
      const l = e.closest("[data-ln-popover], [id]");
      if (l && l.id) {
        const c = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (c && typeof c.querySelector == "function") {
          const s = c.querySelector('[data-ln-popover-for="' + l.id + '"]');
          if (s && typeof s.closest == "function") {
            const n = s.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && i && typeof t.querySelectorAll == "function") {
    const f = t.querySelectorAll("thead th, tr:first-child th"), p = String(i).trim().toLowerCase();
    for (let l = 0; l < f.length; l++) {
      const c = f[l], s = c.getAttribute("data-ln-table-filter-col") || c.getAttribute("data-ln-filter-col") || c.getAttribute("data-ln-filter-key") || c.getAttribute("data-ln-table-col") || c.getAttribute("data-ln-col") || c.getAttribute("data-ln-field");
      if (s && s.trim().toLowerCase() === p)
        return typeof c.cellIndex == "number" ? c.cellIndex : l;
    }
    if (e) {
      const l = e.closest ? e.closest("[data-ln-popover], [id]") : null, c = l && l.id || e.id || null;
      if (c)
        for (let s = 0; s < f.length; s++) {
          const n = f[s];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + c + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : s;
        }
    }
    for (let l = 0; l < f.length; l++) {
      const c = f[l], n = Array.from(c.childNodes || []).filter((_) => _.nodeType === 3), d = (n.length > 0 ? n.map((_) => _.textContent.trim()).join(" ") : c.textContent || "").trim().toLowerCase();
      if (d && d === p)
        return typeof c.cellIndex == "number" ? c.cellIndex : l;
    }
  }
  return null;
}
function zr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let a = 0; a < t.length; a++) {
    const f = t[a];
    !e && f.key && (e = f.key), f.checked && !f.isReset && f.value && i.push(f.value);
  }
  return { key: e, values: i };
}
function Kr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function gn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", a = "data-ln-filter-value", f = "data-ln-filter-hide", p = "data-ln-filter-reset", l = "data-ln-filter-col", c = "data-ln-hash", s = "data-ln-query", n = "data-ln-filter-values", d = "data-ln-filter-target", _ = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-filter": { prop: "targetId", type: "string", read: j, fallback: null, effect: A, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: A, description: "URL hash routing key for filter state persistence" },
    "data-ln-query": { type: "string", effect: A, description: "URL query parameter name for filter state synchronization" },
    "data-ln-filter-values": { type: "string", effect: A, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-filter-target": { type: "marker", description: "Marker on target container or table observed by ln-filter" }
  }, v = X(r);
  function y(w) {
    if (!w.hasAttribute(s)) return null;
    const E = w.getAttribute(s);
    if (E && E.trim() !== "") return E.trim();
    const S = w.getAttribute(l);
    if (S && isNaN(parseInt(S, 10))) return S.trim();
    const C = w.querySelector("[" + i + "]");
    if (C) {
      const k = C.getAttribute(i);
      if (k && k.trim() !== "") return k.trim();
    }
    return Ot(w, "filter");
  }
  function m(w) {
    return w.hasAttribute(p) || !w.getAttribute(a);
  }
  function u(w) {
    const E = w.dom.querySelectorAll("[" + i + "]"), S = [];
    for (let k = 0; k < E.length; k++) {
      const x = E[k];
      S.push({
        key: x.getAttribute(i),
        value: x.getAttribute(a) || "",
        checked: x.checked,
        isReset: m(x)
      });
    }
    const C = zr(S);
    return { key: C.key, values: C.values, targetId: w.targetId };
  }
  function o(w, E, S) {
    const C = w.querySelectorAll("[" + i + "]"), k = Array.isArray(S) && S.length > 0;
    for (let x = 0; x < C.length; x++) {
      const D = C[x];
      m(D) ? D.checked = !k : k && D.getAttribute(i) === E && S.indexOf(D.getAttribute(a)) !== -1 ? D.checked = !0 : D.checked = !1;
    }
  }
  function b(w) {
    this.dom = w, Y(this, w, v);
    const E = w.getAttribute(l);
    this.colIndex = E !== null ? parseInt(E, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = St(w, "filter"), this.hashEnabled = !!this.nsKey, this.queryParam = y(w), this.queryEnabled = !!this.queryParam;
    const S = this, C = zt(function() {
      S._render();
    });
    this._queueRender = C;
    const k = zt(function() {
      S._destroyed || S._applyDomFilter();
    });
    this._queueDomFilter = k;
    function x() {
      if (!S.targetId) return;
      const I = document.getElementById(S.targetId);
      I && !I.hasAttribute(d) && I.setAttribute(d, S.targetId);
    }
    this._ensureTargetMarked = x, x(), dt(function() {
      S._destroyed || x();
    }), this._attachHandlers(), this._onHashChange = function() {
      if (S._destroyed || !S.hashEnabled) return;
      const I = at(S.nsKey), R = Te(I);
      R && R.key && R.values.length > 0 ? o(S.dom, R.key, R.values) : o(S.dom, null, []), S._render();
    }, this._onPopState = function() {
      if (S._destroyed || !S.queryEnabled) return;
      const I = Mt(S.queryParam), R = qe(I), N = S.dom.querySelector("[" + i + "]"), P = N ? N.getAttribute(i) : S.queryParam;
      o(S.dom, P, R), S._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState);
    let D = !1;
    if (this.hashEnabled) {
      const I = at(this.nsKey), R = Te(I);
      R && R.key && R.values.length > 0 && (o(w, R.key, R.values), dt(function() {
        S._destroyed || S._render();
      }), D = !0);
    } else if (this.queryEnabled) {
      const I = Mt(this.queryParam), R = qe(I);
      if (R.length > 0) {
        const N = w.querySelector("[" + i + "]"), P = N ? N.getAttribute(i) : S.queryParam;
        o(w, P, R), dt(function() {
          S._destroyed || S._render();
        }), D = !0;
      }
    }
    if (!D) {
      const I = gn(w.getAttribute(n));
      if (I.length > 0) {
        const R = w.querySelector("[" + i + "]"), N = R ? R.getAttribute(i) : null;
        N && (o(w, N, I), dt(function() {
          S._destroyed || S._render();
        }), D = !0);
      }
    }
    if (!D) {
      const I = w.querySelectorAll("[" + i + "]");
      for (let R = 0; R < I.length; R++)
        if (I[R].checked && !m(I[R])) {
          dt(function() {
            S._destroyed || S._render();
          });
          break;
        }
    }
    return this;
  }
  b.prototype._attachHandlers = function() {
    const w = this;
    this._onDomChange = function(E) {
      const S = E.target;
      if (!S || !S.hasAttribute || !S.hasAttribute(i)) return;
      const C = Array.from(w.dom.querySelectorAll("[" + i + "]"));
      if (m(S)) {
        for (let k = 0; k < C.length; k++)
          m(C[k]) || (C[k].checked = !1);
        S.checked = !0, w._queueRender();
        return;
      }
      if (S.checked) {
        for (let x = 0; x < C.length; x++)
          m(C[x]) && (C[x].checked = !1);
        let k = !1;
        for (let x = 0; x < C.length; x++)
          if (m(C[x])) {
            k = !0;
            break;
          }
        if (k) {
          let x = !0;
          for (let D = 0; D < C.length; D++)
            if (!m(C[D]) && !C[D].checked) {
              x = !1;
              break;
            }
          if (x)
            for (let D = 0; D < C.length; D++)
              m(C[D]) ? C[D].checked = !0 : C[D].checked = !1;
        }
      } else {
        let k = !1;
        for (let x = 0; x < C.length; x++)
          if (!m(C[x]) && C[x].checked) {
            k = !0;
            break;
          }
        if (!k)
          for (let x = 0; x < C.length; x++)
            m(C[x]) && (C[x].checked = !0);
      }
      w._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, b.prototype._render = function() {
    const w = this, E = u(this), S = this._lastSnapshot;
    if (!(!S || S.key !== E.key || Ur(S.values, E.values))) return;
    E.key === null || E.values.length;
    const k = document.getElementById(w.targetId), x = {
      key: E.key,
      values: E.values.slice(),
      targetId: w.targetId
    };
    L(w.dom, "ln-filter:change", x);
    let D = !1;
    k && k !== w.dom && $(k, "ln-filter:change", x).defaultPrevented && (D = !0);
    const I = S && S.values.length > 0, R = E.values.length === 0;
    if (I && R) {
      const P = { targetId: w.targetId };
      L(w.dom, "ln-filter:reset", P), k && k !== w.dom && L(k, "ln-filter:reset", P);
    }
    this._lastSnapshot = { key: E.key, values: E.values.slice() };
    const N = Kr(E.values);
    if (N ? this.dom.setAttribute(n, N) : this.dom.removeAttribute(n), this.hashEnabled) {
      const P = Qn(E.key, E.values);
      _t(this.nsKey, P);
    } else if (this.queryEnabled) {
      const P = Xn(E.values), K = this.queryParam || E.key;
      K && pe(K, P);
    }
    D || w._applyDomFilter(k);
  }, b.prototype._applyDomFilter = function(w) {
    const E = w || document.getElementById(this.targetId);
    if (!E) return;
    const S = u(this), C = S.key === null || S.values.length === 0, k = E.tagName === "TABLE" ? E : E.querySelector ? E.querySelector("table") : null;
    if (k)
      this._filterTableRows(S, k);
    else {
      const x = E.children;
      for (let D = 0; D < x.length; D++) {
        const I = x[D], R = C ? null : I.getAttribute("data-" + S.key), N = !C && R !== null && !Qe(R, S.values), P = I.hasAttribute(f);
        N && !P ? I.setAttribute(f, "true") : !N && P && I.removeAttribute(f);
      }
    }
  };
  function g(w) {
    if (!w) return "";
    const E = w.querySelector ? w.querySelector("[data-ln-value]") : null;
    return At(E || w);
  }
  function h(w) {
    return !!(!w || typeof w != "object" || w.tagName === "TEMPLATE" || typeof w.hasAttribute == "function" && (w.hasAttribute("data-ln-sort-exclude") || w.hasAttribute("hidden")) || w.classList && w.classList.contains("hidden") || w.style && w.style.display === "none" || typeof w.matches == "function" && w.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof w.querySelector == "function" && w.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  b.prototype._filterTableRows = function(w, E) {
    if (!E) {
      const I = document.getElementById(this.targetId);
      if (!I || (E = I.tagName === "TABLE" ? I : I.querySelector ? I.querySelector("table") : null, !E)) return;
    }
    const S = mn(E, this.dom, w.key, this.colIndex), C = w.key || this.dom.getAttribute("data-ln-filter-key") || (S !== null ? "col" + S : "attr-filter"), k = w.values;
    _.has(E) || _.set(E, {});
    const x = _.get(E);
    C && k.length > 0 ? x[C] = {
      col: S,
      values: k.slice(),
      attr: "data-" + C
    } : C && delete x[C];
    const D = E.tBodies;
    for (let I = 0; I < D.length; I++) {
      const R = D[I].rows;
      for (let N = 0; N < R.length; N++) {
        const P = R[N];
        if (h(P)) continue;
        const K = {};
        for (let rt = 0; rt < P.cells.length; rt++)
          K[rt] = g(P.cells[rt]);
        const Q = !Hr(K, x, P), Z = P.hasAttribute(f);
        Q && !Z ? P.setAttribute(f, "true") : !Q && Z && P.removeAttribute(f);
      }
    }
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const w = document.getElementById(this.targetId);
    if (w) {
      const E = w.tagName === "TABLE" ? w : w.querySelector ? w.querySelector("table") : null;
      if (E && _.has(E)) {
        const S = _.get(E), C = mn(E, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), k = this.dom.getAttribute("data-ln-filter-key") || (C !== null ? "col" + C : this.colIndex !== null ? "col" + this.colIndex : null);
        k && S[k] && (delete S[k], this._filterTableRows({ key: null, values: [] }, E)), Object.keys(S).length === 0 && _.delete(E);
      }
      this.targetId && document.querySelectorAll("[" + t + '="' + this.targetId + '"]').length <= 1 && w.removeAttribute(d);
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e];
  };
  function A(w, E) {
    const S = w[e];
    if (!(!S || S._destroyed))
      if (E === c)
        S.hashEnabled && S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = St(w, "filter"), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      else if (E === s)
        S.queryEnabled && S._onPopState && window.removeEventListener("popstate", S._onPopState), S.queryParam = y(w), S.queryEnabled = !!S.queryParam, S.queryEnabled && window.addEventListener("popstate", S._onPopState);
      else if (E === n) {
        const C = gn(w.getAttribute(n)), k = w.querySelector("[" + i + "]"), x = k ? k.getAttribute(i) : null;
        x && (o(w, x, C), S._render());
      } else E === t && (S.targetId = w.getAttribute(t) || null, S._ensureTargetMarked(), S._render());
  }
  H(t, e, b, "ln-filter", {
    attributes: r,
    subtreeQuery: "[" + t + "], [" + d + "]",
    onSubtreeChange: function(w, E) {
      if (E.addedNodes.length === 0 && E.removedNodes.length === 0) return;
      let S = null, C = null;
      if (w.hasAttribute(d) ? (C = w, S = w.getAttribute(d) || w.id) : w.hasAttribute(t) && (S = w.getAttribute(t), C = S ? document.getElementById(S) : null), !S || !C) return;
      const k = document.querySelectorAll("[" + t + '="' + S + '"]');
      for (let x = 0; x < k.length; x++) {
        const D = k[x][e];
        D && !D._destroyed && u(D).values.length > 0 && D._queueDomFilter();
      }
    },
    persist: {
      attr: n,
      hashActive: function(w) {
        return !!St(w, "filter") || !!y(w);
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", a = "lnSearchControl", f = "data-ln-search-items", p = "data-ln-search-fields", l = "data-ln-search-exclude", c = "data-ln-search-hide", s = "data-ln-hash", n = "data-ln-query";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-search": { type: "string", effect: A, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: A, description: "URL hash routing key for search state persistence" },
    "data-ln-query": { type: "string", effect: A, description: "URL query parameter name for search query state synchronization" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: j, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, _ = X(d);
  function r(w) {
    const E = St(w, "search");
    if (E) return E;
    if (w.id) {
      const S = document.querySelector("[" + i + '="' + w.id + '"]');
      if (S) {
        const C = St(S, "search");
        if (C) return C;
      }
    }
    return null;
  }
  function v(w) {
    const E = Ot(w, "search");
    if (E) return E;
    if (w.id) {
      const S = document.querySelector("[" + i + '="' + w.id + '"]');
      if (S) {
        const C = Ot(S, "search");
        if (C) return C;
      }
    }
    return null;
  }
  function y(w) {
    return w.matches("input, textarea") ? w : w.querySelector("input, textarea");
  }
  function m(w, E) {
    const S = w.childNodes;
    for (let C = 0; C < S.length; C++) {
      const k = S[C];
      if (k.nodeType === 3) {
        E.push(k.nodeValue);
        continue;
      }
      k.nodeType === 1 && (k.hasAttribute(l) || m(k, E));
    }
  }
  function u(w) {
    if (w._lnSearchText !== void 0) return w._lnSearchText;
    const E = [];
    m(w, E);
    const S = hr(E);
    return w._lnSearchText = S, S;
  }
  function o(w, E) {
    if (!w.id) return;
    const S = document.querySelectorAll("[" + i + '="' + w.id + '"]');
    for (const C of S) {
      const k = y(C);
      k && k.value !== E && (k.value = E);
    }
  }
  function b(w) {
    this.dom = w, this.term = w.getAttribute(t) || "", this._destroyed = !1;
    const E = this;
    return this.nsKey = r(w), this.hashEnabled = !!this.nsKey, this.queryParam = v(w), this.queryEnabled = !!this.queryParam, this._queueApply = zt(function() {
      E._destroyed || E._apply();
    }), this._onHashChange = function() {
      if (E._destroyed || !E.hashEnabled) return;
      const S = at(E.nsKey), C = E.dom.getAttribute(t) || "";
      S !== null && S !== C ? E.dom.setAttribute(t, S) : S === null && C !== "" && E.dom.setAttribute(t, "");
    }, this._onPopState = function() {
      if (E._destroyed || !E.queryEnabled) return;
      const S = Mt(E.queryParam) || "", C = E.dom.getAttribute(t) || "";
      S !== C && E.dom.setAttribute(t, S);
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState), dt(function() {
      if (!E._destroyed) {
        if (E.hashEnabled) {
          const S = at(E.nsKey);
          if (S !== null && S !== E.term) {
            E.term = S, E.dom.setAttribute(t, S), o(E.dom, S), E._apply();
            return;
          }
        } else if (E.queryEnabled) {
          const S = Mt(E.queryParam);
          if (S !== null && S !== E.term) {
            E.term = S, E.dom.setAttribute(t, S), o(E.dom, S), E._apply();
            return;
          }
        }
        le(E.term) && (o(E.dom, E.term), E._apply());
      }
    }), this;
  }
  b.prototype._apply = function() {
    const w = this.dom, E = le(this.term), S = ei(E);
    this.hashEnabled ? _t(this.nsKey, this.term ? this.term : null) : this.queryEnabled && pe(this.queryParam, this.term ? this.term : null);
    const C = fr(w.getAttribute(p));
    if ($(w, "ln-search:change", {
      term: E,
      tokens: S,
      targetId: w.id,
      fields: C
    }).defaultPrevented) return;
    const x = w.getAttribute(f), D = x ? w.querySelectorAll(x) : w.children;
    for (let I = 0; I < D.length; I++) {
      const R = D[I];
      if (R.hasAttribute(l)) {
        R.hasAttribute(c) && R.removeAttribute(c);
        continue;
      }
      const N = S.length > 0 && !ni(u(R), S), P = R.hasAttribute(c);
      N && !P ? R.setAttribute(c, "true") : !N && P && R.removeAttribute(c);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e]);
  };
  function g(w) {
    if (this.dom = w, Y(this, w, _), this.input = y(w), this._attachHandler(), this.input && this.input.value.trim()) {
      const E = this;
      dt(function() {
        const S = document.getElementById(E.targetId);
        S && ((S.getAttribute(t) || "").trim() || E._write(E.input.value));
      });
    }
    return this;
  }
  g.prototype._write = function(w) {
    const E = document.getElementById(this.targetId);
    E && E.getAttribute(t) !== w && E.setAttribute(t, w);
  }, g.prototype._attachHandler = function() {
    if (!this.input) return;
    const w = this;
    this._onInput = function() {
      w._write(w.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, g.prototype.destroy = function() {
    this.dom[a] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[a]);
  };
  function h(w) {
    const E = w.getAttribute("data-ln-search-clear-for");
    if (E) {
      const D = document.getElementById(E), I = document.querySelector("[" + i + '="' + E + '"]'), R = I ? y(I) : null;
      return { target: D, input: R };
    }
    const S = w.closest("[" + t + "]");
    if (S) {
      const D = S.id ? document.querySelector("[" + i + '="' + S.id + '"]') : null, I = D ? y(D) : null;
      return { target: S, input: I };
    }
    const C = w.closest("[data-ln-table-source], [data-ln-list-source]");
    if (C) {
      const D = C.getAttribute("data-ln-table-source") || C.getAttribute("data-ln-list-source"), I = D ? document.getElementById(D) : null;
      if (I && I.hasAttribute(t)) {
        const R = document.querySelector("[" + i + '="' + D + '"]'), N = R ? y(R) : null;
        return { target: I, input: N };
      }
    }
    const k = w.closest("[" + i + "]");
    if (k) {
      const D = k.getAttribute(i), I = D ? document.getElementById(D) : null, R = y(k);
      return { target: I, input: R };
    }
    const x = w.parentElement;
    if (x) {
      const D = x.querySelector("[" + i + "]");
      if (D) {
        const I = D.getAttribute(i), R = I ? document.getElementById(I) : null, N = y(D);
        return { target: R, input: N };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(w) {
    const E = w.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!E) return;
    const S = h(E);
    !S.target && !S.input || (w.preventDefault(), S.input && (S.input.value = "", S.input.focus()), S.target && S.target.setAttribute(t, ""));
  });
  function A(w, E) {
    const S = w[e];
    if (!S || S._destroyed) return;
    if (E === s) {
      S._onHashChange && window.removeEventListener("hashchange", S._onHashChange), S.nsKey = r(w), S.hashEnabled = !!S.nsKey, S.hashEnabled && window.addEventListener("hashchange", S._onHashChange);
      return;
    }
    if (E === n) {
      S._onPopState && window.removeEventListener("popstate", S._onPopState), S.queryParam = v(w), S.queryEnabled = !!S.queryParam, S.queryEnabled && window.addEventListener("popstate", S._onPopState);
      return;
    }
    const C = w.getAttribute(t) || "";
    C !== S.term && (S.term = C, o(w, C), S._apply());
  }
  H(t, e, b, "ln-search", {
    attributes: d,
    onSubtreeChange: function(w, E) {
      const S = E.target;
      S && S._lnSearchText !== void 0 && delete S._lnSearchText, S && S.parentElement && S.parentElement._lnSearchText !== void 0 && delete S.parentElement._lnSearchText;
      const C = w[e];
      if (C && !C._destroyed && le(C.term) && (E.addedNodes.length > 0 || E.removedNodes.length > 0)) {
        for (let k = 0; k < E.addedNodes.length; k++) {
          const x = E.addedNodes[k];
          x._lnSearchText !== void 0 && delete x._lnSearchText;
        }
        C._queueApply();
      }
    },
    persist: {
      attr: t,
      hashActive: function(w) {
        return !!r(w) || !!v(w);
      }
    }
  }), H(i, a, g, "ln-search-control");
})();
function kt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function jr(t) {
  const e = kt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Wr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Vr(t, e, i, a) {
  const f = kt(t);
  if (f === "none") return () => 0;
  const p = f === "desc" ? -1 : 1, l = typeof a == "function" ? a : (c) => c;
  return function(c, s) {
    const n = l(c), d = l(s);
    return Ge(n, d, e, i) * p;
  };
}
function Se(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Gr(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const i = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (i && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(i));
  if (t.tagName === "TABLE") {
    const a = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (a)
      return Array.from(a.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", a = "data-ln-sort-state", f = "data-ln-sort-dir", p = "data-ln-hash", l = "data-ln-query";
  if (window[e] !== void 0) return;
  function c(y, m) {
    return y.getAttribute(m) || null;
  }
  const s = {
    "data-ln-sort": { prop: "targetId", type: "string", read: j, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: c, effect: v, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: c, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: v, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: v, description: "URL hash routing key for sort state persistence" },
    "data-ln-query": { type: "string", effect: v, description: "URL query parameter name for sort state persistence" }
  }, n = X(s), d = /* @__PURE__ */ new WeakMap();
  function _(y, m, u) {
    if (m) {
      const o = y.querySelector('[data-ln-field="' + m + '"]');
      return o ? At(o) : "";
    }
    return u != null && y.cells && y.cells[u] ? At(y.cells[u]) : At(y);
  }
  function r(y) {
    this.dom = y, Y(this, y, n);
    const m = y.closest("th");
    this.column = !this.field && m ? m.cellIndex : null, this._state = kt(y.getAttribute(a)), y.hasAttribute(a) || y.setAttribute(a, this._state), this._destroyed = !1, this.nsKey = St(y, "sort"), this.hashEnabled = !!this.nsKey, this.queryParam = Ot(y, "sort"), this.queryEnabled = !!this.queryParam;
    const u = this;
    this._onClick = function(b) {
      const g = b.target.closest("[" + f + "]");
      if (!g) return;
      const h = kt(g.getAttribute(f));
      u._apply(h);
    }, y.addEventListener("click", this._onClick), this._onSortChange = function(b) {
      if (u._destroyed || !b.detail) return;
      const g = u._resolveTarget();
      if (!(g && (b.target === g || g.contains(b.target)) || b.detail.targetId && b.detail.targetId === u.targetId)) return;
      if (Wr(
        { field: u.field, column: u.column },
        { field: b.detail.field, column: b.detail.column }
      )) {
        const w = kt(b.detail.direction);
        w && y.getAttribute(a) !== w && (u._state = w, y.setAttribute(a, w), u._updateAriaSort(w));
        return;
      }
      y.getAttribute(a) !== "none" && (u._state = "none", y.setAttribute(a, "none"), u._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (u._destroyed || !u.hashEnabled) return;
      const b = at(u.nsKey), g = Ce(b);
      if (g)
        u.field !== null && g.fieldOrColumn === u.field || u.column !== null && String(u.column) === g.fieldOrColumn ? u._state !== g.direction && u._apply(g.direction, !0) : u._state !== "none" && (u._state = "none", y.setAttribute(a, "none"), u._updateAriaSort("none"));
      else if (u._state !== "none") {
        u._state = "none", y.setAttribute(a, "none"), u._updateAriaSort("none");
        const h = u._resolveTarget();
        h && ($(h, "ln-sort:change", {
          field: u.field,
          column: u.column,
          direction: "none",
          targetId: u.targetId
        }).defaultPrevented || u._defaultSort(h, "none"));
      }
    }, this._onPopState = function() {
      if (u._destroyed || !u.queryEnabled) return;
      const b = Mt(u.queryParam), g = ke(), h = Le(b, g);
      if (h)
        u.field !== null && h.fieldOrColumn === u.field || u.column !== null && String(u.column) === h.fieldOrColumn ? u._state !== h.direction && u._apply(h.direction, !0) : u._state !== "none" && (u._state = "none", y.setAttribute(a, "none"), u._updateAriaSort("none"));
      else if (u._state !== "none") {
        u._state = "none", y.setAttribute(a, "none"), u._updateAriaSort("none");
        const A = u._resolveTarget();
        A && ($(A, "ln-sort:change", {
          field: u.field,
          column: u.column,
          direction: "none",
          targetId: u.targetId
        }).defaultPrevented || u._defaultSort(A, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState);
    let o = !1;
    if (this.hashEnabled) {
      const b = at(this.nsKey), g = Ce(b);
      g && ((u.field !== null && g.fieldOrColumn === u.field || u.column !== null && String(u.column) === g.fieldOrColumn) && dt(function() {
        u._destroyed || u._apply(g.direction, !0);
      }), o = !0);
    } else if (this.queryEnabled) {
      const b = Mt(this.queryParam), g = ke(), h = Le(b, g);
      h && ((u.field !== null && h.fieldOrColumn === u.field || u.column !== null && String(u.column) === h.fieldOrColumn) && dt(function() {
        u._destroyed || u._apply(h.direction, !0);
      }), o = !0);
    }
    if (!o) {
      const b = kt(y.getAttribute(a));
      b && b !== "none" && dt(function() {
        u._destroyed || u._apply(b, !0);
      });
    }
    return this;
  }
  r.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, r.prototype._updateAriaSort = function(y) {
    const m = this.dom.closest("th");
    m && m.setAttribute("aria-sort", jr(y));
  }, r.prototype._apply = function(y, m) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const h = this.dom.closest("th");
      h && h.cellIndex !== void 0 && (this.column = h.cellIndex);
    }
    const u = kt(y);
    this._state = u, this.dom.getAttribute(a) !== u && this.dom.setAttribute(a, u), this._updateAriaSort(u);
    const o = this._resolveTarget();
    if (!o) return;
    const b = {
      field: this.field,
      column: this.column,
      direction: u,
      targetId: this.targetId
    };
    if (!m) {
      if (this.hashEnabled) {
        const h = $n(this.field !== null ? this.field : this.column, u);
        _t(this.nsKey, h);
      } else if (this.queryEnabled) {
        const h = Yn(this.field !== null ? this.field : this.column, u);
        pe(this.queryParam, h);
      }
    }
    $(o, "ln-sort:change", b).defaultPrevented || this._defaultSort(o, u);
  }, r.prototype._defaultSort = function(y, m) {
    const u = Gr(y, this.itemsSelector);
    if (!u.length) return;
    const o = u[0].parentNode, b = u.filter(function(h) {
      return !Se(h);
    });
    if (!b.length) return;
    d.has(y) || d.set(y, b.slice());
    let g;
    if (m === "none") {
      const h = d.get(y) || b;
      d.delete(y), g = h.filter(function(A) {
        return A.parentNode === o && !Se(A);
      });
    } else {
      const h = this.field, A = this.column, w = b.map(function(k) {
        return { el: k, val: _(k, h, A) };
      }), E = Ve(w.map(function(k) {
        return k.val;
      })), S = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = Vr(m, E, S, function(k) {
        return k.val;
      });
      w.sort(C), g = w.map(function(k) {
        return k.el;
      });
    }
    Wn(function() {
      const h = document.createDocumentFragment();
      let A = 0;
      for (let w = 0; w < u.length; w++) {
        const E = u[w];
        Se(E) ? h.appendChild(E) : A < g.length && h.appendChild(g[A++]);
      }
      o.appendChild(h);
    });
  }, r.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e]);
  };
  function v(y, m) {
    const u = y[e];
    if (!(!u || u._destroyed))
      if (m === i) {
        const o = y.closest("th");
        u.column = !u.field && o ? o.cellIndex : null;
      } else if (m === a) {
        const o = kt(y.getAttribute(a));
        o !== u._state && u._apply(o);
      } else m === p ? (u.hashEnabled && u._onHashChange && window.removeEventListener("hashchange", u._onHashChange), u.nsKey = St(y, "sort"), u.hashEnabled = !!u.nsKey, u.hashEnabled && window.addEventListener("hashchange", u._onHashChange)) : m === l && (u.queryEnabled && u._onPopState && window.removeEventListener("popstate", u._onPopState), u.queryParam = Ot(y, "sort"), u.queryEnabled = !!u.queryParam, u.queryEnabled && window.addEventListener("popstate", u._onPopState));
  }
  H(t, e, r, "ln-sort", {
    attributes: s,
    persist: {
      attr: a,
      hashActive: function(y) {
        return !!St(y, "sort") || !!Ot(y, "sort");
      }
    }
  });
})();
function _n(t, e, i, a, f = 15) {
  if (a <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const p = Math.max(0, t || 0), l = Math.max(0, e || 0), c = Math.floor(p / i), s = Math.ceil(l / i), n = Math.max(0, c - f), d = Math.min(a, c + s + f), _ = n * i, r = Math.max(0, (a - d) * i);
  return { start: n, end: d, topPadding: _, bottomPadding: r };
}
function $r(t, e) {
  const i = Array.isArray(t) ? t.length : 0, a = e instanceof Set ? e : new Set(e || []);
  let f = 0;
  if (Array.isArray(t))
    for (let c = 0; c < t.length; c++)
      a.has(t[c]) && f++;
  else
    f = a.size;
  const p = i > 0 && f === i, l = f > 0 && f < i;
  return { totalCount: i, selectedCount: f, isAllSelected: p, isIndeterminate: l };
}
function bn(t, e, i) {
  const a = new Set(t);
  return e == null || ((i !== void 0 ? i : !a.has(e)) ? a.add(e) : a.delete(e)), a;
}
function yn(t, e, i) {
  const a = new Set(t);
  if (!Array.isArray(e)) return a;
  if (i)
    for (let f = 0; f < e.length; f++)
      e[f] != null && a.add(e[f]);
  else
    for (let f = 0; f < e.length; f++)
      a.delete(e[f]);
  return a;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function s(o, b) {
    if (!o || !o.isDataDriven) return;
    const g = o.dom.hasAttribute("data-ln-table-window");
    if (g && !o._windowed)
      o._enterWindowedMode(), o._kickWindowInitial();
    else if (!g && o._windowed)
      o._exitWindowedMode();
    else if (g && o._windowed) {
      const h = parseInt(b, 10);
      h > 0 && o._cache.configure({ windowSize: h });
    }
  }
  function n(o, b) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const g = parseInt(b, 10);
    g > 0 && o._cache.configure({ pageSize: g });
  }
  function d(o, b) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const g = parseInt(b, 10);
    g >= 0 && o._cache.configure({ threshold: g });
  }
  function _(o, b) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const g = parseInt(b, 10);
    g >= 0 && o._cache.setGrandTotal(g);
  }
  const r = {
    "data-ln-table": { prop: "name", type: "string", read: j, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: j, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: xt, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: d, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: _, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, v = X(r);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function y(o, b) {
    if (o == null || isNaN(o)) return "";
    try {
      return new Intl.NumberFormat(J(b)).format(o);
    } catch {
      return String(o);
    }
  }
  function m(o) {
    let b = o.parentElement;
    for (; b && b !== document.body && b !== document.documentElement; ) {
      const h = getComputedStyle(b).overflowY;
      if (h === "auto" || h === "scroll") return b;
      b = b.parentElement;
    }
    return null;
  }
  function u(o) {
    this.dom = o, Y(this, o, v), this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead");
    const b = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = b ? Array.from(b.querySelectorAll("th")) : [], this._totalSpan = o.querySelector("[data-ln-table-total]"), this._filteredSpan = o.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.parentElement : null), this._selectedSpan = o.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.parentElement : null), this.isDataDriven = o.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const g = this;
    return this._onSetSearch = function(h) {
      const A = (h.detail && h.detail.query != null ? h.detail.query : h.detail && h.detail.term != null ? h.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = A, L(o, "ln-table:search", {
        table: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = A.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(o, "ln-table:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, o.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(h) {
      h.preventDefault(), g._onSetSearch(h);
    }, o.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", L(o, "ln-table:clear-filters", { table: g.name }), g._requestData()) : (g._searchTerm = "", g._columnFilters = {}, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(o, "ln-table:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, o.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && o.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(h) {
      const A = h.detail || {}, w = A.data || [], E = A.total != null ? A.total : w.length;
      if (!(g._hasInitialSeed && !g.isLoaded && w.length === 0 && E === 0)) {
        if (g._windowed) {
          g._cache.ingest(A) && !A.provisional && o.classList.remove("ln-table--loading");
          return;
        }
        g._data = w, g._lastTotal = E, g._lastFiltered = A.filtered != null ? A.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, o.classList.remove("ln-table--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), L(o, "ln-table:rendered", {
          table: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, o.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(h) {
      const A = h.detail && h.detail.loading;
      o.classList.toggle("ln-table--loading", !!A), A && (g.isLoaded = !1);
    }, o.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(h) {
      !g._windowed || !g._cache || g._cache.release(h.detail && h.detail.offset);
    }, o.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, o.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function(h) {
      if (!(!g._windowed || !g._cache)) {
        if (h && h.detail && h.detail.query) {
          const A = h.detail.query;
          A.search !== void 0 && (g.currentSearch = A.search), A.filters !== void 0 && (g.currentFilters = A.filters), A.sort !== void 0 && (g.currentSort = A.sort);
        }
        g._requestData();
      }
    }, o.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(h) {
      !h.detail || h.detail.field == null || (h.preventDefault(), g.currentSort = h.detail.direction === "none" ? null : { field: h.detail.field, direction: h.detail.direction }, g._requestData());
    }, o.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(h) {
      if (h.target.closest("[data-ln-table-row-select]") || h.target.closest("[data-ln-table-row-action]") || h.target.closest("a") || h.target.closest("button") || h.ctrlKey || h.metaKey || h.button === 1) return;
      const A = h.target.closest("[data-ln-table-row]");
      if (!A) return;
      const w = A.getAttribute("data-ln-table-row-id"), E = A._lnRecord || {};
      L(o, "ln-table:row-click", {
        table: g.name,
        id: w,
        record: E
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(h) {
      const A = h.target.closest("[data-ln-table-row-action]");
      if (!A) return;
      const w = A.closest("[data-ln-table-row]");
      if (!w) return;
      const E = A.getAttribute("data-ln-table-row-action"), S = w.getAttribute("data-ln-table-row-id"), C = w._lnRecord || {};
      L(o, "ln-table:row-action", {
        table: g.name,
        id: S,
        action: E,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), setTimeout(function() {
      !g.dom || !document.contains(g.dom) || (g._windowed ? g._kickWindowInitial() : L(o, "ln-table:request-data", {
        table: g.name,
        sort: g.currentSort,
        filters: g.currentFilters,
        search: g.currentSearch
      }));
    }, 0)) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      g.tbody.rows.length > 0 && (g._emptyTbodyObserver.disconnect(), g._emptyTbodyObserver = null, g._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(h) {
      if (!h.detail || h.detail.column == null) return;
      h.preventDefault();
      const A = h.detail.direction === "none" ? null : h.detail.direction;
      g._sortCol = A === null ? -1 : h.detail.column, g._sortDir = A, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), L(o, "ln-table:sorted", {
        column: h.detail.column,
        direction: h.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, o.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(h) {
      if (h.preventDefault(), !h.detail) return;
      const A = h.detail.key, w = h.detail.values || [];
      if (A) {
        if (w.length === 0)
          delete g._columnFilters[A];
        else {
          const E = [];
          for (let S = 0; S < w.length; S++)
            E.push(w[S].toLowerCase());
          g._columnFilters[A] = E;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(o, "ln-table:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, o.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  u.prototype._parseRows = function() {
    const o = this.tbody.rows, b = this.ths;
    this._data = [], o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let g = 0; g < o.length; g++) {
      const h = o[g], A = [], w = [], E = [];
      for (let C = 0; C < h.cells.length; C++) {
        const k = h.cells[C], x = k.textContent.trim();
        A[C] = At(k), w[C] = x.toLowerCase(), k.querySelector("[data-ln-table-row-action]") || E.push(x.toLowerCase());
      }
      let S = null;
      if (this.isDataDriven) {
        S = {};
        const C = h.getAttribute("data-ln-table-row-id");
        C != null && (S.id = C);
        for (let k = 0; k < b.length; k++) {
          const x = b[k].getAttribute("data-ln-table-col");
          if (x) {
            const D = k;
            if (D < h.cells.length) {
              const I = h.cells[D];
              S[x] = At(I);
            }
          }
        }
      }
      this._data.push({
        values: A,
        rawTexts: w,
        html: h.outerHTML,
        searchText: E.join(" "),
        id: this.isDataDriven && S ? S.id : void 0,
        ...S
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, u.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, u.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const o = document.createElement("colgroup");
    this.ths.forEach(function(b) {
      const g = document.createElement("col");
      g.style.width = b.offsetWidth + "px", o.appendChild(g);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, u.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const o = this._lastTotal, b = this.visibleCount;
        if (o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || b === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, u.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, b = document.createDocumentFragment();
      for (let g = 0; g < o.length; g++) {
        const h = this._buildRow(o[g]);
        if (!h) break;
        b.appendChild(h);
      }
      this.tbody.replaceChildren(b), this._selectable && this._updateSelectAll();
    } else {
      const o = [], b = this._filteredData;
      for (let g = 0; g < b.length; g++) o.push(b[g].html);
      this.tbody.innerHTML = o.join(""), this._selectable && this._restoreSelection();
    }
  }, u.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let g = null;
        if (this._windowed) {
          const h = this._cache ? this._cache.peek() : null;
          g = h ? this._buildRow(h) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (g = this._buildRow(this._data[0]));
        g && this.tbody && (this.tbody.appendChild(g), this._rowHeight = g.offsetHeight || 40, g.remove());
      }
    this.isDataDriven ? this._scrollContainer = m(this.dom) : this._scrollContainer = null;
    const b = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._windowed ? o._renderWindowed() : o._renderVirtual();
      }));
    }, b.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, u.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, u.prototype._renderVirtual = function() {
    const o = this._filteredData, b = o.length, g = this._rowHeight;
    if (!g || !b) return;
    const h = this.thead ? this.thead.offsetHeight : 0, A = this._scrollContainer;
    let w, E;
    if (A) {
      const R = this.table.getBoundingClientRect(), N = A.getBoundingClientRect(), P = R.top - N.top + A.scrollTop + h;
      w = A.scrollTop - P, E = A.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + h;
      w = window.scrollY - P, E = window.innerHeight;
    }
    const S = _n(w, E, g, b, 15), C = S.start, k = S.end;
    if (C === this._vStart && k === this._vEnd) return;
    this._vStart = C, this._vEnd = k;
    const x = this.ths.length || 1, D = S.topPadding, I = S.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const N = document.createElement("tr");
        N.className = "ln-table__spacer", N.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", x), P.style.height = D + "px", N.appendChild(P), R.appendChild(N);
      }
      for (let N = C; N < k; N++) {
        const P = this._buildRow(o[N]);
        P && R.appendChild(P);
      }
      if (I > 0) {
        const N = document.createElement("tr");
        N.className = "ln-table__spacer", N.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", x), P.style.height = I + "px", N.appendChild(P), R.appendChild(N);
      }
      this.tbody.replaceChildren(R), this._selectable && this._updateSelectAll();
    } else {
      let R = "";
      D > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + x + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>');
      for (let N = C; N < k; N++) R += o[N].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + x + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, u.prototype._buildPlaceholderRow = function() {
    const o = document.createElement("tr");
    o.className = "ln-table__placeholder", o.setAttribute("aria-hidden", "true");
    const b = document.createElement("td");
    return b.setAttribute("colspan", this.ths.length || 1), b.style.height = this._rowHeight + "px", o.appendChild(b), o;
  }, u.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const o = this._rowHeight;
    if (!o) return;
    const b = this._cache.logicalTotal, g = this.thead ? this.thead.offsetHeight : 0, h = this._scrollContainer;
    let A, w;
    if (h) {
      const R = this.table.getBoundingClientRect(), N = h.getBoundingClientRect(), P = R.top - N.top + h.scrollTop + g;
      A = h.scrollTop - P, w = h.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + g;
      A = window.scrollY - P, w = window.innerHeight;
    }
    const E = _n(A, w, o, b, 15), S = E.start, C = E.end;
    if (S === this._vStart && C === this._vEnd) return;
    const k = this.ths.length || 1, x = E.topPadding, D = E.bottomPadding, I = document.createDocumentFragment();
    if (x > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const N = document.createElement("td");
      N.setAttribute("colspan", k), N.style.height = x + "px", R.appendChild(N), I.appendChild(R);
    }
    for (let R = S; R < C; R++)
      if (this._cache.has(R)) {
        const N = this._buildRow(this._cache.get(R));
        N && I.appendChild(N);
      } else
        I.appendChild(this._buildPlaceholderRow());
    if (D > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const N = document.createElement("td");
      N.setAttribute("colspan", k), N.style.height = D + "px", R.appendChild(N), I.appendChild(R);
    }
    this.tbody.replaceChildren(I), this._vStart = S, this._vEnd = C, this._cache.ensure(S, C);
  }, u.prototype._showEmptyState = function() {
    const o = this.ths.length || 1;
    let b = null, g = null;
    if (this.isDataDriven) {
      const h = this._lastTotal != null ? this._lastTotal : this._data.length, w = this.visibleCount === 0 && h > 0, E = w ? this.name + "-empty-filtered" : this.name + "-empty";
      if (g = Lt(this.dom, E, "ln-table"), !g) {
        const S = this.dom.querySelector("template[data-ln-table-empty]");
        if (S) {
          const C = w ? "search" : "initial", k = S.content.querySelector('[data-ln-table-empty-when="' + C + '"]') || S.content.firstElementChild;
          k && (g = document.importNode(k, !0));
        }
      }
      if (g)
        if (g.tagName === "TR")
          b = g;
        else {
          const S = document.createElement("td");
          S.setAttribute("colspan", String(o)), S.appendChild(g);
          const C = document.createElement("tr");
          C.className = "ln-table__empty", C.appendChild(S), b = C;
        }
    } else {
      const h = this.dom.querySelector("template[" + i + "]"), A = document.createElement("td");
      A.setAttribute("colspan", String(o)), h && A.appendChild(document.importNode(h.content, !0));
      const w = document.createElement("tr");
      w.className = "ln-table__empty", w.appendChild(A), b = w;
    }
    b ? this.tbody.replaceChildren(b) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, u.prototype._fillRow = function(o, b) {
    ee(o, b);
    const g = o.querySelectorAll("[data-ln-table-cell-attr]");
    for (let h = 0; h < g.length; h++) {
      const A = g[h], w = A.getAttribute("data-ln-table-cell-attr").split(",");
      for (let E = 0; E < w.length; E++) {
        const S = w[E].trim().split(":");
        if (S.length !== 2) continue;
        const C = S[0].trim(), k = S[1].trim();
        b[C] != null && A.setAttribute(k, b[C]);
      }
    }
  }, u.prototype._buildRow = function(o) {
    let b = Lt(this.dom, this.name + "-row", "ln-table");
    if (!b) {
      const h = this.dom.querySelector("template[data-ln-table-row]");
      h && (b = document.importNode(h.content, !0));
    }
    let g = b ? b.querySelector("[data-ln-table-row]") || b.firstElementChild : null;
    if (g)
      this._fillRow(g, o);
    else if (o && o.html) {
      const h = document.createElement("tbody");
      h.innerHTML = o.html, g = h.firstElementChild;
    } else {
      g = document.createElement("tr"), g.setAttribute("data-ln-table-row", "");
      const h = this.ths;
      for (let A = 0; A < h.length; A++) {
        const w = h[A].hasAttribute("data-ln-table-col-select"), E = document.createElement("td");
        if (w) {
          const S = document.createElement("input");
          S.type = "checkbox", S.setAttribute("data-ln-table-row-select", ""), S.setAttribute("aria-label", "Select row"), E.appendChild(S);
        } else {
          const S = h[A].getAttribute("data-ln-table-col");
          S && o[S] != null && (E.textContent = String(o[S]));
        }
        g.appendChild(E);
      }
    }
    if (g._lnRecord = o, o.id != null && g.setAttribute("data-ln-table-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      g.classList.add("ln-row-selected");
      const h = g.querySelector("[data-ln-table-row-select]");
      h && (h.checked = !0);
    }
    return g;
  }, u.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Tn(this, "ln-table:request-data", "table");
  }, u.prototype._enterWindowedMode = function() {
    const o = this, b = this.dom, g = parseInt(b.getAttribute("data-ln-table-window"), 10), h = parseInt(b.getAttribute("data-ln-table-window-page"), 10), A = parseInt(b.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !o._windowed || !o._cache || (o.totalCount = o._cache.grandTotal, o.visibleCount = o._cache.logicalTotal, o._lastTotal = o._cache.grandTotal, o.isLoaded = !0, o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), L(b, "ln-table:rendered", {
        table: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      }));
    }, this._renderBatch = zt(this._onCacheChange), this._cache = Vn({
      windowSize: g > 0 ? g : 1e3,
      pageSize: h > 0 ? h : 200,
      threshold: A >= 0 ? A : 25,
      fetchDebounce: 120,
      requestPage: function(w, E, S) {
        L(b, "ln-table:request-data", {
          table: o.name,
          sort: w.sort,
          filters: w.filters,
          search: w.search,
          offset: E,
          limit: S,
          queryGen: o._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, u.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let o = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(o) && this._totalSpan) {
        const g = this._totalSpan.textContent.replace(/[^\d]/g, "");
        g && (o = parseInt(g, 10));
      }
      const b = o > 0 ? o : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: b,
        filtered: b
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, u.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, u.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]"), b = [];
    for (let h = 0; h < o.length; h++) {
      const A = o[h].getAttribute("data-ln-table-row-id");
      A != null && b.push(A);
    }
    const g = $r(b, this.selectedIds);
    this._selectAllCheckbox.checked = g.isAllSelected, this._selectAllCheckbox.indeterminate = g.isIndeterminate;
  }, u.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let b = 0; b < o.length; b++) {
      const g = o[b].getAttribute("data-ln-table-row-id"), h = g != null && this.selectedIds.has(g);
      o[b].classList.toggle("ln-row-selected", h);
      const A = o[b].querySelector("[data-ln-table-row-select]");
      A && (A.checked = h);
    }
    this._updateSelectAll();
  }, Object.defineProperty(u.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), u.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const o = this;
    if (this._onSelectionChange = function(b) {
      const g = b.target.closest("[data-ln-table-row-select]");
      if (!g) return;
      const h = g.closest("[data-ln-table-row]");
      if (!h) return;
      const A = h.getAttribute("data-ln-table-row-id");
      A != null && (o.selectedIds = bn(o.selectedIds, A, g.checked), h.classList.toggle("ln-row-selected", g.checked), o.selectedCount = o.selectedIds.size, o._updateSelectAll(), o._updateFooter(), L(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const b = document.createElement("input");
      b.type = "checkbox";
      const g = o.dom.querySelector('[data-ln-table-dict="select-all"]'), h = o.dom.getAttribute("data-ln-table-select-all-label") || (g ? g.textContent.trim() : null) || "Select all";
      b.setAttribute("aria-label", h), this._selectAllCheckbox.appendChild(b), this._selectAllCheckbox = b;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const b = o._selectAllCheckbox.checked, g = o.tbody ? o.tbody.querySelectorAll("[data-ln-table-row]") : [], h = [];
      for (let A = 0; A < g.length; A++) {
        const w = g[A].getAttribute("data-ln-table-row-id"), E = g[A].querySelector("[data-ln-table-row-select]");
        w != null && (h.push(w), g[A].classList.toggle("ln-row-selected", b), E && (E.checked = b));
      }
      o.selectedIds = yn(o.selectedIds, h, b), o.selectedCount = o.selectedIds.size, L(o.dom, "ln-table:select-all", {
        table: o.name,
        selected: b
      }), L(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const b = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < b.length; g++) {
        const h = b[g].querySelector("[data-ln-table-row-select]"), A = b[g].getAttribute("data-ln-table-row-id");
        h && h.checked && A != null && (o.selectedIds = bn(o.selectedIds, A, !0), b[g].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, u.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const o = this.dom.querySelector("[data-ln-table-col-select]");
    if (o) {
      const b = o.querySelector('input[type="checkbox"]');
      b && b.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = yn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const b = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < b.length; g++) {
        b[g].classList.remove("ln-row-selected");
        const h = b[g].querySelector("[data-ln-table-row-select]");
        h && (h.checked = !1);
      }
    }
    this._updateFooter();
  }, u.prototype._updateFooter = function() {
    let o = 0, b = 0;
    this.isDataDriven ? (o = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount) : (o = this._data.length, b = this._filteredData.length);
    const g = b < o;
    if (this._totalSpan && (this._totalSpan.textContent = y(o, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = g ? y(b, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !g), this._selectedSpan) {
      const h = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = h > 0 ? y(h, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", h === 0);
    }
  }, u.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, u, "ln-table", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-table-coordinator": { type: "marker", description: "Mounts table coordinator mediating between table, search, filter, and pagination" }
  };
  document.addEventListener("keydown", function(c) {
    if (c.key !== "/" || c.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const s = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!s) return;
    const n = s.tagName === "INPUT" || s.tagName === "TEXTAREA" ? s : s.querySelector('input[type="search"], input[type="text"], input');
    n && (c.preventDefault(), n.focus());
  });
  function a(c) {
    return this.dom = c, l(this), this;
  }
  function f(c, s) {
    const n = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", d = c.querySelector(n) || document.querySelector(n);
    return d ? d.tagName === "INPUT" || d.tagName === "TEXTAREA" ? d : d.querySelector("input, textarea") : null;
  }
  function p(c, s) {
    if (s) {
      const d = c.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (d.length > 0) return d;
      const _ = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (_.length > 0) return _;
    }
    const n = c.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function l(c) {
    const s = c.dom;
    function n(d) {
      const _ = d.target;
      if (_ && _.hasAttribute && (_.hasAttribute("data-ln-table") || _.tagName === "TABLE")) return _;
      const r = d.detail && d.detail.targetId || _ && _.id;
      if (!r) return null;
      const v = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(r) : r.replace(/(["\\])/g, "\\$1");
      return s.querySelector('[data-ln-table-source="' + v + '"]') || s.querySelector('[data-ln-table="' + v + '"]') || (s.id === r ? s : null) || document.getElementById(r);
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(d) {
        if (!d.detail) return;
        const _ = n(d);
        if (!_) return;
        const r = d.detail.key, v = d.detail.values || [], y = _.querySelectorAll("th");
        for (let m = 0; m < y.length; m++)
          if ((y[m].getAttribute("data-ln-table-filter-col") || y[m].getAttribute("data-ln-filter-col") || y[m].getAttribute("data-ln-filter-key") || y[m].getAttribute("data-ln-field")) === r) {
            const o = y[m].querySelector("[data-ln-table-col-filter], .table-filter");
            o && o.classList.toggle("ln-filter-active", v.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(d) {
        const _ = d.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!_) return;
        const r = _.closest("[data-ln-table], table") || s.querySelector("[data-ln-table], table");
        if (!r) return;
        const v = r.lnTable && r.lnTable.name || r.id, y = r.querySelectorAll("th");
        for (let b = 0; b < y.length; b++) {
          const g = y[b].querySelector("[data-ln-table-col-filter], .table-filter");
          g && g.classList.remove("ln-filter-active");
        }
        const m = r.getAttribute("data-ln-table-source") || r.id, u = m ? document.getElementById(m) : null;
        if (u && u.hasAttribute("data-ln-search"))
          u.setAttribute("data-ln-search", "");
        else {
          const b = f(s, m);
          b && b.value !== "" && (b.value = "", b.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const o = p(s, m);
        for (let b = 0; b < o.length; b++) {
          const g = o[b].querySelector("[data-ln-filter-reset]");
          if (!g) continue;
          const h = o[b].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!g.checked || h) && (g.checked = !0, g.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        r.lnTable && !r.hasAttribute("data-ln-table-source") && L(r, "ln-table:request-clear-filters", { table: v });
      }
    }, s.addEventListener("ln-filter:change", c._handlers.filter), s.addEventListener("click", c._handlers.clear);
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, H(t, e, a, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function s(h, A) {
    if (!h || !h.isDataDriven) return;
    const w = h.dom.hasAttribute("data-ln-list-window");
    if (w && !h._windowed)
      h._enterWindowedMode(), h._kickWindowInitial();
    else if (!w && h._windowed)
      h._exitWindowedMode();
    else if (w && h._windowed) {
      const E = parseInt(A, 10);
      E > 0 && h._cache.configure({ windowSize: E });
    }
  }
  function n(h, A) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const w = parseInt(A, 10);
    w > 0 && h._cache.configure({ pageSize: w });
  }
  function d(h, A) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const w = parseInt(A, 10);
    w >= 0 && h._cache.configure({ threshold: w });
  }
  function _(h, A) {
    if (!h || !h.isDataDriven || !h._windowed || !h._cache) return;
    const w = parseInt(A, 10);
    w >= 0 && h._cache.setGrandTotal(w);
  }
  const r = {
    "data-ln-list": { prop: "name", type: "string", read: j, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: j, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: xt, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: d, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: _, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, v = X(r);
  function y(h, A) {
    if (h == null || isNaN(h)) return "";
    try {
      return new Intl.NumberFormat(J(A)).format(h);
    } catch {
      return String(h);
    }
  }
  function m(h) {
    let A = h;
    for (; A && A !== document.body && A !== document.documentElement; ) {
      const E = getComputedStyle(A).overflowY;
      if (E === "auto" || E === "scroll") return A;
      A = A.parentElement;
    }
    return null;
  }
  function u(h) {
    const A = h._scrollContainer || m(h.dom);
    return {
      container: A,
      top: A ? A.scrollTop : window.scrollY
    };
  }
  function o(h) {
    h.container ? h.container.scrollTop = h.top : window.scrollTo(window.scrollX, h.top);
  }
  function b(h) {
    if (!h) return 0;
    const A = getComputedStyle(h), w = parseFloat(A.marginTop) || 0, E = parseFloat(A.marginBottom) || 0;
    return h.offsetHeight + w + E;
  }
  function g(h) {
    this.dom = h, Y(this, h, v), this.tbody = h.querySelector("[data-ln-list-body]") || h, this.isDataDriven = h.hasAttribute("data-ln-list-source"), this._totalSpan = h.querySelector("[data-ln-list-total]"), this._filteredSpan = h.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== h ? this._filteredSpan.parentElement : null), this._selectedSpan = h.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== h ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const A = this;
    return this._onSetSearch = function(w) {
      const E = (w.detail && w.detail.query != null ? w.detail.query : w.detail && w.detail.term != null ? w.detail.term : "").trim();
      A.isDataDriven ? (A.currentSearch = E, L(h, "ln-list:search", {
        list: A.name,
        query: A.currentSearch
      }), A._requestData()) : (A._searchTerm = E.toLowerCase(), A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(h, "ln-list:filter", {
        term: A._searchTerm,
        matched: A._filteredData.length,
        total: A._data.length
      }));
    }, h.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(w) {
      w.preventDefault(), A._onSetSearch(w);
    }, h.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      A.isDataDriven ? (A.currentFilters = {}, A.currentSearch = "", L(h, "ln-list:clear-filters", { list: A.name }), A._requestData()) : (A._searchTerm = "", A._filters = {}, A._sortField = null, A._sortDir = null, A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(h, "ln-list:filter", {
        term: "",
        matched: A._filteredData.length,
        total: A._data.length
      }));
    }, h.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, h.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(w) {
      const E = w.detail || {}, S = E.data || [], C = E.total != null ? E.total : S.length;
      if (!(A._hasInitialSeed && !A.isLoaded && S.length === 0 && C === 0)) {
        if (A._windowed) {
          A._cache.ingest(E) && !E.provisional && h.classList.remove("ln-list--loading");
          return;
        }
        A._data = S, A._lastTotal = C, A._lastFiltered = E.filtered != null ? E.filtered : A._data.length, A.totalCount = A._lastTotal, A.visibleCount = A._lastFiltered, A.isLoaded = !0, A._hasInitialSeed = !1, h.classList.remove("ln-list--loading"), A._vStart = -1, A._vEnd = -1, A._applyFilterAndSort(), A._render(), A._updateFooter(), L(h, "ln-list:rendered", {
          list: A.name,
          total: A.totalCount,
          visible: A.visibleCount
        });
      }
    }, h.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(w) {
      const E = w.detail && w.detail.loading;
      h.classList.toggle("ln-list--loading", !!E), E && (A.isLoaded = !1);
    }, h.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(w) {
      !A._windowed || !A._cache || A._cache.release(w.detail && w.detail.offset);
    }, h.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !A._windowed || !A._cache || A._cache.revalidate();
    }, h.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !A._windowed || !A._cache || A._requestData();
    }, h.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(w) {
      !w.detail || w.detail.field == null || (w.preventDefault(), A.currentSort = w.detail.direction === "none" ? null : { field: w.detail.field, direction: w.detail.direction }, A._requestData());
    }, h.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(w) {
      if (w.target.closest("[data-ln-item-select]") || w.target.closest("[data-ln-item-action]") || w.target.closest("a") || w.target.closest("button") || w.ctrlKey || w.metaKey || w.button === 1) return;
      const E = w.target.closest("[data-ln-item]");
      if (!E) return;
      const S = E.getAttribute("data-ln-item-id"), C = E._lnRecord || {};
      L(h, "ln-list:item-click", {
        list: A.name,
        id: S,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(w) {
      const E = w.target.closest("[data-ln-item-action]");
      if (!E) return;
      const S = E.closest("[data-ln-item]");
      if (!S) return;
      const C = E.getAttribute("data-ln-item-action"), k = S.getAttribute("data-ln-item-id"), x = S._lnRecord || {};
      L(h, "ln-list:item-action", {
        list: A.name,
        id: k,
        action: C,
        record: x
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(h, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      A.tbody.children.length > 0 && (A._emptyObserver.disconnect(), A._emptyObserver = null, A._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(w) {
      if (w.preventDefault(), !w.detail) return;
      const E = w.detail.key, S = w.detail.values || [];
      if (E) {
        if (S.length === 0)
          delete A._filters[E];
        else {
          const C = [];
          for (let k = 0; k < S.length; k++)
            C.push(S[k].toLowerCase());
          A._filters[E] = C;
        }
        A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(h, "ln-list:filter", {
          term: A._searchTerm,
          matched: A._filteredData.length,
          total: A._data.length
        });
      }
    }, h.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(w) {
      if (!w.detail || w.detail.field == null) return;
      w.preventDefault();
      const E = w.detail.direction === "none" ? null : w.detail.direction;
      A._sortField = E === null ? null : w.detail.field, A._sortDir = E, A._applyFilterAndSort(), A._vStart = -1, A._vEnd = -1, A._render(), A._updateFooter(), L(h, "ln-list:sorted", {
        field: A._sortField,
        direction: w.detail && w.detail.direction,
        matched: A._filteredData.length,
        total: A._data.length
      });
    }, h.addEventListener("ln-sort:change", this._onSort)), this;
  }
  g.prototype._parseChildren = function() {
    const h = Array.from(this.tbody.children).filter((A) => !A.classList.contains("ln-list__spacer"));
    this._data = [], h.length > 0 && (this._itemHeight = b(h[0]) || 50);
    for (let A = 0; A < h.length; A++) {
      const w = h[A], E = w.getAttribute("data-ln-item-id") || w.getAttribute("id"), S = w.textContent.trim().toLowerCase();
      let C = null;
      if (this.isDataDriven) {
        C = {}, E != null && (C.id = E);
        const D = w.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], N = R.getAttribute("data-ln-list-field");
          N && (C[N] = At(R));
        }
      }
      const k = {}, x = w.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < x.length; D++) {
        const I = x[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
        R && (k[R] = At(I));
      }
      for (let D = 0; D < w.attributes.length; D++) {
        const I = w.attributes[D];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const R = I.name.slice(5);
          R && (k[R] = I.value);
        }
      }
      this._data.push({
        html: w.outerHTML,
        id: E,
        searchText: S,
        fields: k,
        ...C || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const h = this._searchTerm, A = h ? h.split(/\s+/).filter(Boolean) : [], w = this._filters || {}, E = Object.keys(w).length > 0;
      if (A.length === 0 && !E ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (A.length > 0 && !A.every(function(k) {
          return S.searchText && S.searchText.indexOf(k) !== -1;
        }))
          return !1;
        if (E)
          for (const C in w) {
            const k = w[C];
            if (k && k.length > 0) {
              const x = S.fields && S.fields[C] !== void 0 ? S.fields[C] : S[C] !== void 0 ? S[C] : null, D = x != null ? String(x).toLowerCase() : "";
              if (k.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const S = this._sortField, C = this._sortDir === "desc" ? -1 : 1, k = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base" }) : null, x = this._filteredData.map(function(I) {
          return I.fields && I.fields[S] !== void 0 ? I.fields[S] : I[S];
        }), D = Ve(x);
        this._filteredData.sort(function(I, R) {
          const N = I.fields && I.fields[S] !== void 0 ? I.fields[S] : I[S], P = R.fields && R.fields[S] !== void 0 ? R.fields[S] : R[S];
          return Ge(N, P, D, k) * C;
        });
      }
    }
  }, g.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const h = this._lastTotal, A = this.visibleCount;
        if (h === 0 || this._filteredData.length === 0 || A === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const h = this._filteredData.length;
        h === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : h > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, g.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const h = this._filteredData, A = document.createDocumentFragment();
      for (let E = 0; E < h.length; E++) {
        const S = this._buildItem(h[E]);
        S && A.appendChild(S);
      }
      const w = u(this);
      this.tbody.replaceChildren(A), o(w), this._selectable && this._updateSelectAll();
    } else {
      const h = [], A = this._filteredData;
      for (let E = 0; E < A.length; E++) h.push(A[E].html);
      const w = u(this);
      this.tbody.innerHTML = h.join(""), o(w), this._selectable && this._restoreSelection();
    }
  }, g.prototype._readGridLayout = function() {
    const h = getComputedStyle(this.tbody), A = h.gridTemplateColumns;
    let w = 1;
    if (A && A !== "none") {
      const S = A.trim().split(/\s+/).filter(Boolean);
      S.length > 0 && (w = S.length);
    }
    const E = parseFloat(h.rowGap);
    return { columns: w, rowGap: isNaN(E) ? 0 : E };
  }, g.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const h = this._cache.peek(), A = h ? this._buildItem(h) : this._buildPlaceholderItem();
      A && (this.tbody.textContent = "", this.tbody.appendChild(A), this._itemHeight = b(A) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const h = this._buildItem(this._data[0]);
        h && (this.tbody.textContent = "", this.tbody.appendChild(h), this._itemHeight = b(h) || 50, this.tbody.textContent = "");
      }
    } else {
      const h = this.tbody.children;
      h.length > 0 && (this._itemHeight = b(h[0]) || 50);
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const h = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = m(this.dom);
    const A = this._scrollContainer || window;
    this._scrollHandler = function() {
      h._rafId || (h._rafId = requestAnimationFrame(function() {
        h._rafId = null, h._windowed ? h._renderWindowed() : h._renderVirtual();
      }));
    }, this._resizeRafId = null, this._resizeHandler = function() {
      h._resizeRafId || (h._resizeRafId = requestAnimationFrame(function() {
        h._resizeRafId = null, h._itemHeight = 0, h._measureItemHeight(), h._vStart = -1, h._vEnd = -1, h._windowed ? h._renderWindowed() : h._renderVirtual();
      }));
    }, A.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, g.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._resizeRafId && (cancelAnimationFrame(this._resizeRafId), this._resizeRafId = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, g.prototype._renderVirtual = function() {
    const h = this._filteredData, A = h.length, w = this._itemHeight;
    if (!w || !A) return;
    const E = this._scrollContainer;
    let S, C;
    if (E) {
      const nt = this.tbody.getBoundingClientRect(), V = E.getBoundingClientRect(), W = E === this.tbody ? 0 : nt.top - V.top + E.scrollTop;
      S = E.scrollTop - W, C = E.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      S = window.scrollY - V, C = window.innerHeight;
    }
    const k = this._readGridLayout(), x = k.columns, D = k.rowGap, I = w + D, R = Math.ceil(A / x);
    let N = Math.max(0, Math.floor(S / I) - 15);
    N = Math.min(N, R);
    const P = Math.ceil(C / I) + 30, K = Math.min(N + P, R), Q = Math.min(N * x, A), Z = Math.min(K * x, A);
    if (Q === this._vStart && Z === this._vEnd) return;
    this._vStart = Q, this._vEnd = Z;
    const rt = N * I, lt = (R - K) * I;
    if (this.isDataDriven) {
      const nt = document.createDocumentFragment();
      if (rt > 0) {
        const W = document.createElement(this.isUl ? "li" : "div");
        W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = rt + "px", nt.appendChild(W);
      }
      for (let W = Q; W < Z; W++) {
        const yt = this._buildItem(h[W]);
        yt && nt.appendChild(yt);
      }
      if (lt > 0) {
        const W = document.createElement(this.isUl ? "li" : "div");
        W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = lt + "px", nt.appendChild(W);
      }
      const V = u(this);
      this.tbody.replaceChildren(nt), o(V), this._selectable && this._updateSelectAll();
    } else {
      let nt = "";
      rt > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${rt}px"></${this.isUl ? "li" : "div"}>`);
      for (let W = Q; W < Z; W++)
        nt += h[W].html;
      lt > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${lt}px"></${this.isUl ? "li" : "div"}>`);
      const V = u(this);
      this.tbody.innerHTML = nt, o(V), this._selectable && this._restoreSelection();
    }
  }, g.prototype._buildPlaceholderItem = function() {
    const h = document.createElement(this.isUl ? "li" : "div");
    return h.className = "ln-list__placeholder", h.setAttribute("aria-hidden", "true"), h.style.height = this._itemHeight + "px", h;
  }, g.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const h = this._itemHeight;
    if (!h) return;
    const A = this._scrollContainer;
    let w, E;
    if (A) {
      const V = this.tbody.getBoundingClientRect(), W = A.getBoundingClientRect(), yt = A === this.tbody ? 0 : V.top - W.top + A.scrollTop;
      w = A.scrollTop - yt, E = A.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      w = window.scrollY - W, E = window.innerHeight;
    }
    const S = this._readGridLayout(), C = S.columns, k = S.rowGap, x = h + k, D = this._cache.logicalTotal, I = Math.ceil(D / C);
    let R = Math.max(0, Math.floor(w / x) - 15);
    R = Math.min(R, I);
    const N = Math.ceil(E / x) + 30, P = Math.min(R + N, I), K = Math.min(R * C, D), Q = Math.min(P * C, D), Z = R * x, rt = (I - P) * x, lt = document.createDocumentFragment();
    if (Z > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = Z + "px", lt.appendChild(V);
    }
    for (let V = K; V < Q; V++)
      if (this._cache.has(V)) {
        const W = this._buildItem(this._cache.get(V));
        W && lt.appendChild(W);
      } else
        lt.appendChild(this._buildPlaceholderItem());
    if (rt > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = rt + "px", lt.appendChild(V);
    }
    const nt = u(this);
    this.tbody.replaceChildren(lt), o(nt), this._vStart = K, this._vEnd = Q, this._cache.ensure(K, Q);
  }, g.prototype._showEmptyState = function() {
    let h = null;
    if (this.isDataDriven) {
      const A = this._lastTotal != null ? this._lastTotal : this._data.length, E = this.visibleCount === 0 && A > 0, S = E ? this.name + "-empty-filtered" : this.name + "-empty";
      if (h = Lt(this.dom, S, "ln-list"), !h) {
        const C = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (C) {
          const k = E ? "search" : "initial", x = C.content.querySelector(`[data-ln-empty-when="${k}"]`) || C.content.firstElementChild;
          x && (h = document.importNode(x, !0));
        }
      }
    } else {
      const A = this.dom.querySelector(`template[${i}]`);
      if (A) {
        const w = A.content.firstElementChild;
        w && (h = document.importNode(w, !0));
      }
    }
    if (h)
      if (h.tagName === "LI" || h.tagName === "TR")
        this.tbody.replaceChildren(h);
      else {
        const A = document.createElement(this.isUl ? "li" : "div");
        A.appendChild(h), this.tbody.replaceChildren(A);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, g.prototype._buildItem = function(h) {
    let A = Lt(this.dom, this.name + "-row", "ln-list");
    if (!A) {
      const E = this.dom.querySelector("template[data-ln-item]");
      E && (A = document.importNode(E.content, !0));
    }
    let w = A ? A.querySelector("[data-ln-item]") || A.firstElementChild : null;
    if (w)
      ee(w, h), pt(w, h);
    else if (h && h.html) {
      const E = document.createElement(this.isUl ? "ul" : "div");
      E.innerHTML = h.html, w = E.firstElementChild;
    } else if (w = document.createElement(this.isUl ? "li" : "div"), w.setAttribute("data-ln-item", ""), h && typeof h == "object") {
      for (const E in h)
        if (E !== "html" && h[E] != null) {
          const S = document.createElement("span");
          S.setAttribute("data-ln-field", E), S.textContent = String(h[E]), w.appendChild(S);
        }
    }
    if (w._lnRecord = h, h && h.id != null && (w.setAttribute("data-ln-item-id", h.id), this._selectable && this.selectedIds.has(String(h.id)))) {
      w.classList.add("ln-item-selected");
      const E = w.querySelector("[data-ln-item-select]");
      E && (E.checked = !0);
    }
    return w;
  }, g.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const h = this.tbody.querySelectorAll("[data-ln-item]");
    for (let A = 0; A < h.length; A++) {
      const w = h[A].getAttribute("data-ln-item-id"), E = w != null && this.selectedIds.has(String(w));
      h[A].classList.toggle("ln-item-selected", E);
      const S = h[A].querySelector("[data-ln-item-select]");
      S && (S.checked = E);
    }
    this._updateSelectAll();
  }, g.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const h = this;
    this._onSelectionChange = function(A) {
      const w = A.target.closest("[data-ln-item-select]");
      if (!w) return;
      const E = w.closest("[data-ln-item]");
      if (!E) return;
      const S = E.getAttribute("data-ln-item-id");
      S != null && (w.checked ? (h.selectedIds.add(String(S)), E.classList.add("ln-item-selected")) : (h.selectedIds.delete(String(S)), E.classList.remove("ln-item-selected")), h._updateSelectAll(), h._updateFooter(), L(h.dom, "ln-list:select", {
        list: h.name,
        selectedIds: h.selectedIds,
        count: h.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const A = h._selectAllCheckbox.checked, w = h.tbody.querySelectorAll("[data-ln-item]");
      for (let E = 0; E < w.length; E++) {
        const S = w[E], C = S.getAttribute("data-ln-item-id"), k = S.querySelector("[data-ln-item-select]");
        C != null && (A ? (h.selectedIds.add(String(C)), S.classList.add("ln-item-selected")) : (h.selectedIds.delete(String(C)), S.classList.remove("ln-item-selected")), k && (k.checked = A));
      }
      L(h.dom, "ln-list:select-all", { list: h.name, selected: A }), L(h.dom, "ln-list:select", {
        list: h.name,
        selectedIds: h.selectedIds,
        count: h.selectedIds.size
      }), h._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, g.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const h = this.tbody.querySelectorAll("[data-ln-item]");
    let A = h.length > 0;
    for (let w = 0; w < h.length; w++) {
      const E = h[w].getAttribute("data-ln-item-id");
      if (E != null && !this.selectedIds.has(String(E))) {
        A = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = A;
  }, g.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    Tn(this, "ln-list:request-data", "list");
  }, g.prototype._enterWindowedMode = function() {
    const h = this, A = this.dom, w = parseInt(A.getAttribute("data-ln-list-window"), 10), E = parseInt(A.getAttribute("data-ln-list-window-page"), 10), S = parseInt(A.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !h._windowed || !h._cache || (h.totalCount = h._cache.grandTotal, h.visibleCount = h._cache.logicalTotal, h._lastTotal = h._cache.grandTotal, h.isLoaded = !0, h._vStart = -1, h._vEnd = -1, h._render(), h._updateFooter(), L(A, "ln-list:rendered", {
        list: h.name,
        total: h.totalCount,
        visible: h.visibleCount
      }));
    }, this._renderBatch = zt(this._onCacheChange), this._cache = Vn({
      windowSize: w > 0 ? w : 1e3,
      pageSize: E > 0 ? E : 200,
      threshold: S >= 0 ? S : 25,
      fetchDebounce: 120,
      requestPage: function(C, k, x) {
        L(A, "ln-list:request-data", {
          list: h.name,
          sort: C.sort,
          filters: C.filters,
          search: C.search,
          offset: k,
          limit: x,
          queryGen: h._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, g.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const h = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), A = h > 0 ? h : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: A,
        filtered: A
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, g.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, g.prototype._updateFooter = function() {
    let h = 0, A = 0;
    this.isDataDriven ? (h = this._lastTotal != null ? this._lastTotal : this._data.length, A = this.visibleCount) : (h = this._data.length, A = this._filteredData.length);
    const w = A < h;
    if (this._totalSpan && (this._totalSpan.textContent = y(h, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = w ? y(A, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !w), this._selectedSpan) {
      const E = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = E > 0 ? y(E, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", E === 0);
    }
  }, g.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, g, "ln-list", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(r) {
    const v = r[e];
    v && _.call(v);
  }
  const a = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, f = "http://www.w3.org/2000/svg", p = 36, l = 16, c = 2 * Math.PI * l;
  function s(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, d.call(this), _.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(r, v) {
    const y = document.createElementNS(f, r);
    for (const [m, u] of Object.entries(v))
      y.setAttribute(m, u);
    return y;
  }
  function d() {
    this.svg = n("svg", {
      viewBox: "0 0 " + p + " " + p,
      width: p,
      height: p
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: l,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: l,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": c,
      "stroke-dashoffset": c,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function _() {
    const r = this.dom.getAttribute("data-ln-circular-progress"), v = this.dom.getAttribute("data-ln-circular-progress-max"), y = Zn(r, v || 100), m = c - y.percentage / 100 * c;
    this.progressCircle.setAttribute("stroke-dashoffset", m);
    const u = this.dom.getAttribute("data-ln-circular-progress-label"), o = u !== null ? u : Math.round(y.percentage) + "%";
    this.labelEl.textContent = o, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(y.min)), this.dom.setAttribute("aria-valuemax", String(y.max)), this.dom.setAttribute("aria-valuenow", String(y.clampedValue)), this.dom.setAttribute("aria-valuetext", o), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: y.value,
      max: y.max,
      percentage: y.percentage
    });
  }
  H(t, e, s, "ln-circular-progress", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-sortable": { effect: p, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function f(l) {
    this.dom = l, this.isEnabled = l.getAttribute(t) !== "disabled", this._dragging = null, l.setAttribute("aria-roledescription", "sortable list");
    const c = this;
    return this._onPointerDown = function(s) {
      c.isEnabled && c._handlePointerDown(s);
    }, l.addEventListener("pointerdown", this._onPointerDown), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, f.prototype._handlePointerDown = function(l) {
    let c = l.target.closest("[" + i + "]"), s;
    if (c) {
      for (s = c; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
      for (s = l.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      c = s;
    }
    const d = Array.from(this.dom.children).indexOf(s);
    if ($(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: d
    }).defaultPrevented) return;
    l.preventDefault(), c.setPointerCapture(l.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: d
    });
    const r = this;
    let v = null, y = null;
    const m = function(o) {
      y = o, !v && (v = requestAnimationFrame(function() {
        v = null, y && r._handlePointerMove(y);
      }));
    }, u = function(o) {
      v && (cancelAnimationFrame(v), v = null), r._handlePointerEnd(o), c.removeEventListener("pointermove", m), c.removeEventListener("pointerup", u), c.removeEventListener("pointercancel", u);
    };
    c.addEventListener("pointermove", m), c.addEventListener("pointerup", u), c.addEventListener("pointercancel", u);
  }, f.prototype._handlePointerMove = function(l) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), s = this._dragging;
    let n = null, d = null;
    for (let _ = 0; _ < c.length; _++) {
      const r = c[_];
      if (r === s) continue;
      const v = r.getBoundingClientRect(), y = v.top + v.height / 2;
      if (l.clientY >= v.top && l.clientY < y) {
        n = r, d = "before";
        break;
      } else if (l.clientY >= y && l.clientY <= v.bottom) {
        n = r, d = "after";
        break;
      }
    }
    if (!(this._lastDropTarget === n && this._lastDropPos === d)) {
      this._lastDropTarget && this._lastDropTarget !== n && this._lastDropTarget.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after"), this._lastDropTarget = n, this._lastDropPos = d;
      for (let _ = 0; _ < c.length; _++) {
        const r = c[_];
        r !== n && (r.classList.contains("ln-sortable--drop-before") && r.classList.remove("ln-sortable--drop-before"), r.classList.contains("ln-sortable--drop-after") && r.classList.remove("ln-sortable--drop-after"));
      }
      if (n) {
        const _ = d === "before" ? "ln-sortable--drop-before" : "ln-sortable--drop-after", r = d === "before" ? "ln-sortable--drop-after" : "ln-sortable--drop-before";
        n.classList.contains(r) && n.classList.remove(r), n.classList.contains(_) || n.classList.add(_);
      }
    }
  }, f.prototype._handlePointerEnd = function(l) {
    if (!this._dragging) return;
    const c = this._dragging, s = Array.from(this.dom.children), n = s.indexOf(c);
    let d = null, _ = null;
    for (const r of s) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        d = r, _ = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        d = r, _ = "after";
        break;
      }
    }
    this._lastDropTarget = null, this._lastDropPos = null;
    for (const r of s)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), d && d !== c) {
      _ === "before" ? this.dom.insertBefore(c, d) : this.dom.insertBefore(c, d.nextElementSibling);
      const v = Array.from(this.dom.children).indexOf(c);
      L(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: n,
        newIndex: v
      });
    }
    this._dragging = null;
  };
  function p(l) {
    const c = l[e];
    if (!c) return;
    const s = l.getAttribute(t) !== "disabled";
    s !== c.isEnabled && (c.isEnabled = s, L(l, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: l }));
  }
  H(t, e, f, "ln-sortable", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", a = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: c, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: s, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function p(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = l(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const d of [this.available, this.selected])
      for (const _ of d.children)
        this._initial.push(_);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), delete this.dom[e]);
  }, p.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, p.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, p.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let _ = 0; _ < n.length; _++)
      this._initial.includes(n[_]) || this._initial.push(n[_]);
    let d = 0;
    for (let _ = 0; _ < this._initial.length; _++) {
      const r = this._initial[_];
      if (!r.isConnected) continue;
      const v = r.querySelector('input[type="checkbox"]');
      if (!v) continue;
      let y;
      v.checked ? this.max === null || d < this.max ? (y = this.selected, d++) : (v.checked = !1, y = this.available) : y = this.available, y.appendChild(r);
    }
  }, p.prototype._onFormReset = function(n) {
    const d = this;
    setTimeout(function() {
      d._destroyed || n.defaultPrevented || d.sync();
    }, 0);
  }, p.prototype._onChange = function(n) {
    const d = n.target.closest('input[type="checkbox"]');
    if (!d) return;
    const _ = d.closest("li");
    if (!_) return;
    const r = _.parentElement;
    if (r !== this.available && r !== this.selected) return;
    if (!this.isEnabled) {
      d.checked = !d.checked;
      return;
    }
    const v = d.checked ? this.selected : this.available;
    if (r === v) return;
    if (v === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      d.checked = !d.checked, L(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: _,
        checkbox: d,
        count: this.selected.children.length
      });
      return;
    }
    const y = { item: _, from: r, to: v, checkbox: d };
    if ($(this.dom, "ln-picklist:before-move", y).defaultPrevented) {
      d.checked = !d.checked;
      return;
    }
    const m = document.activeElement === d;
    v.appendChild(_), m && d.focus(), L(this.dom, "ln-picklist:move", y);
  };
  function l(n) {
    const d = n.getAttribute(a);
    if (d === null || d === "") return null;
    const _ = parseInt(d, 10);
    return isNaN(_) || _ < 0 ? null : _;
  }
  function c(n) {
    const d = n[e];
    if (!d) return;
    const _ = n.getAttribute(t) !== "disabled";
    _ !== d.isEnabled && (d.isEnabled = _, L(n, _ ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function s(n) {
    const d = n[e];
    d && (d.max = l(n));
  }
  H(t, e, p, "ln-picklist", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", a = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function p(_, r, v) {
    return _.getAttribute(r) || v;
  }
  function l(_, r, v) {
    const y = parseFloat(_.getAttribute(r));
    return isNaN(y) || y <= 0 ? v : y;
  }
  function c(_) {
    const r = document.createElement("span");
    return r.setAttribute(a, ""), r.setAttribute("role", "alert"), r.textContent = _, r;
  }
  const s = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: p, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: l, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (_, r) => _.getAttribute(r) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = X(s);
  function d(_) {
    this.dom = _, Y(this, _, n), this.revertTimer = null, this._submitted = !1, this.idleEl = _.querySelector("[data-ln-confirm-idle]"), this.activeEl = _.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : _.textContent.trim();
    const r = this;
    return this._onClick = function(v) {
      if (!Pe(v))
        if (!r.confirming)
          v.preventDefault(), v.stopImmediatePropagation(), r._enterConfirm();
        else {
          if (r._submitted) return;
          r._submitted = !0, r._reset();
        }
    }, _.addEventListener("click", this._onClick), this;
  }
  d.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const _ = this.activeEl ? this.activeEl.textContent.trim() : "";
      _ && (this.dom.setAttribute("aria-label", _), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = _.getAttribute("href"), _.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(c(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, d.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const _ = this, r = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      _._reset();
    }, r);
  }, d.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const _ = this.dom.querySelector("svg.ln-icon use");
      _ && this.originalIconHref && _.setAttribute("href", this.originalIconHref);
      const r = this.dom.querySelector("[" + a + "]");
      r && r.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, H(t, e, d, "ln-confirm", {
    attributes: s
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-translations": { type: "marker", description: "Mounts multi-language translation manager on form container" },
    "data-ln-translations-default": { prop: "defaultLang", read: j, type: "string", fallback: "", description: "Default primary language code (e.g. en)" },
    "data-ln-translations-placeholder": { prop: "placeholderLabel", read: j, type: "string", fallback: "{lang} translation", description: "Placeholder label pattern for cloned translation inputs" },
    "data-ln-translations-remove-label": { prop: "removeLabel", read: j, type: "string", fallback: "Remove {lang}", description: "Accessible label template for translation removal buttons" },
    "data-ln-translations-locales": { prop: "_localesRaw", read: j, type: "json", fallback: "", description: "JSON dictionary of supported locale codes and display labels" },
    "data-ln-translations-active": { type: "marker", description: "Container holding active language badge tags" },
    "data-ln-translations-add": { type: "string", description: "Trigger button action to add specified language translation fields" },
    "data-ln-translations-lang": { type: "string", description: "Language code associated with active language badge" },
    "data-ln-translations-prefix": { type: "string", description: "Prefix format pattern for cloned translated field names" },
    "data-ln-translatable": { type: "marker", description: "Marks form control as translatable into multiple languages" },
    "data-ln-translatable-lang": { type: "string", description: "Language code assigned to specific translatable input instance" }
  }, a = X(i), f = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(l) {
    if (this.dom = l, Y(this, l, a), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = l.querySelector("[data-ln-translations-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = f, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const c = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && c.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && c.removeLanguage(s.detail.lang);
    }, l.addEventListener("ln-translations:request-add", this._onRequestAdd), l.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const c of l) {
      const s = c.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of l) {
      const s = c.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let c = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      c++;
      const d = ce("ln-translations-menu-item", "ln-translations");
      if (!d) return;
      const _ = d.querySelector("[data-ln-translations-lang]");
      _.setAttribute("data-ln-translations-lang", n), _.textContent = this.locales[n], _.addEventListener("click", function(r) {
        r.ctrlKey || r.metaKey || r.button === 1 || (r.preventDefault(), r.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(n));
      }), this.menuEl.appendChild(d);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = c === 0);
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(c) {
      const s = ce("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", c);
      const d = n.querySelector("span");
      d.textContent = l.locales[c] || c.toUpperCase();
      const _ = n.querySelector("button"), r = l.locales[c] || c.toUpperCase();
      _.setAttribute("aria-label", l.removeLabel.replace("{lang}", r)), _.addEventListener("click", function(v) {
        v.ctrlKey || v.metaKey || v.button === 1 || (v.preventDefault(), v.stopPropagation(), l.removeLanguage(c));
      }), l.badgesEl.appendChild(s);
    });
  }, p.prototype.addLanguage = function(l, c) {
    if (this.activeLanguages.has(l)) return;
    const s = this.locales[l] || l;
    if ($(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(l), c = c || {};
    const d = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const _ of d) {
      const r = _.getAttribute("data-ln-translatable"), v = _.getAttribute("data-ln-translations-prefix") || "", y = _.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!y) continue;
      const m = y.cloneNode(y.tagName === "SELECT");
      v ? m.name = v + "[trans][" + l + "][" + r + "]" : m.name = "trans[" + l + "][" + r + "]", m.value = c[r] !== void 0 ? c[r] : "", m.removeAttribute("id"), "placeholder" in m && (m.placeholder = this.placeholderLabel.replace("{lang}", s)), m.setAttribute("data-ln-translatable-lang", l);
      const u = _.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), o = u.length > 0 ? u[u.length - 1] : y;
      o.parentNode.insertBefore(m, o.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: s
    });
  }, p.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || $(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: l
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const l = this.defaultLang, c = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of c)
      s.getAttribute("data-ln-translatable-lang") !== l && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, H(t, e, p, "ln-translations", {
    attributes: i
  });
})();
const Qr = "ln-autosave:", Yr = 1e3;
function Xr(t, e) {
  return e ? Qr + (t || "") + ":" + e : null;
}
function Jr(t, e = Yr) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", a = "data-ln-autosave-debounce-input", f = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function l(s) {
    const n = s.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function c(s) {
    const d = s.getAttribute(t) || s.id, _ = Xr(window.location.pathname, d);
    if (!_) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", s);
      return;
    }
    this.dom = s, this.key = _;
    let r = null;
    function v() {
      const o = Ue(s, { exclude: f });
      try {
        localStorage.setItem(_, JSON.stringify(o));
      } catch {
        return;
      }
      L(s, "ln-autosave:saved", { target: s, data: o });
    }
    function y() {
      let o;
      try {
        o = localStorage.getItem(_);
      } catch {
        return;
      }
      if (!o) return;
      let b;
      try {
        b = JSON.parse(o);
      } catch {
        return;
      }
      if ($(s, "ln-autosave:before-restore", { target: s, data: b }).defaultPrevented) return;
      const h = He(s, b);
      for (let A = 0; A < h.length; A++)
        h[A].dispatchEvent(new Event("input", { bubbles: !0 })), h[A].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(s, "ln-autosave:restored", { target: s, data: b });
    }
    function m() {
      try {
        localStorage.removeItem(_);
      } catch {
        return;
      }
      L(s, "ln-autosave:cleared", { target: s });
    }
    this._onFocusout = function(o) {
      const b = o.target;
      l(b) && b.name && !b.matches(f) && v();
    }, this._onChange = function(o) {
      const b = o.target;
      l(b) && b.name && !b.matches(f) && v();
    }, this._onSubmit = function() {
      m();
    }, this._onReset = function() {
      m();
    }, this._onClearClick = function(o) {
      o.target.closest("[" + i + "]") && m();
    }, s.addEventListener("focusout", this._onFocusout), s.addEventListener("change", this._onChange), s.addEventListener("submit", this._onSubmit), s.addEventListener("reset", this._onReset), s.addEventListener("click", this._onClearClick);
    const u = Jr(s.getAttribute(a));
    return u > 0 && (this._onInput = function(o) {
      const b = o.target;
      !l(b) || !b.name || b.matches(f) || (r !== null && clearTimeout(r), r = setTimeout(v, u));
    }, s.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return r;
    }, y(), this;
  }
  c.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const s = this._getInputTimer();
        s !== null && clearTimeout(s);
      }
      delete this.dom[e];
    }
  }, H(t, e, c, "ln-autosave", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-editor": { type: "marker", description: "Mounts rich text editor instance on container" },
    "data-ln-editor-action": { type: "enum", values: ["bold", "italic", "underline", "strikethrough", "heading-2", "heading-3", "heading-4", "blockquote", "code", "paragraph", "ordered-list", "unordered-list", "link", "unlink", "clear", "confirm-link", "cancel-link"], description: "Rich text toolbar formatting action" },
    "data-ln-editor-source": { type: "string", description: "Selector or ID of backing textarea synchronized with editor content" }
  }, a = {
    P: !0,
    BR: !0,
    STRONG: !0,
    B: !0,
    EM: !0,
    I: !0,
    U: !0,
    S: !0,
    A: !0,
    UL: !0,
    OL: !0,
    LI: !0,
    H2: !0,
    H3: !0,
    H4: !0,
    BLOCKQUOTE: !0,
    PRE: !0,
    CODE: !0,
    DIV: !0
  }, f = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, p = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, l = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let c = 0;
  function s(o) {
    return !!(f[o] || p[o] || l[o] || o === "link");
  }
  function n(o) {
    this.dom = o;
    const b = this;
    if (this._textarea = o.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", o), this;
    const g = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), g && this._surface.setAttribute("data-placeholder", g);
    const h = this._textarea.id;
    if (h) {
      const S = o.querySelector('label[for="' + h + '"]');
      S && (S.id || (S.id = h + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = h ? h + "-surface" : "ln-editor-surface-" + ++c;
    const A = this._textarea.value.trim();
    A && (this._surface.innerHTML = A);
    const w = o.querySelector('[role="toolbar"]');
    if (w && w.nextSibling ? o.insertBefore(this._surface, w.nextSibling) : o.appendChild(this._surface), w) {
      w.setAttribute("aria-controls", this._surface.id);
      const S = w.querySelectorAll("[data-ln-editor-action]");
      for (let C = 0; C < S.length; C++) {
        const k = S[C].getAttribute("data-ln-editor-action");
        s(k) && S[C].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      b._syncToTextarea(), L(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const C = S.target.closest("[data-ln-editor-action]");
      if (!C) return;
      const k = C.getAttribute("data-ln-editor-action");
      b._execAction(k);
    }, this._onPaste = function(S) {
      r(b, S);
    }, this._onKeydown = function(S) {
      m(b, S);
    }, this._listeningSelection = !1, this._rafSelection = null, this._onSelectionChange = function() {
      b._rafSelection || (b._rafSelection = requestAnimationFrame(function() {
        b._rafSelection = null, document.contains(b._surface) && b._updateActiveStates();
      }));
    }, this._attachSelection = function() {
      b._listeningSelection || (b._listeningSelection = !0, document.addEventListener("selectionchange", b._onSelectionChange));
    }, this._detachSelection = function() {
      b._listeningSelection && (b._listeningSelection = !1, document.removeEventListener("selectionchange", b._onSelectionChange)), b._rafSelection && (cancelAnimationFrame(b._rafSelection), b._rafSelection = null);
    }, this._onFocus = function() {
      b._attachSelection(), b._updateActiveStates(), L(b.dom, "ln-editor:focus", { target: b.dom });
    }, this._onBlur = function() {
      b._detachSelection(), b._syncToTextarea(), L(b.dom, "ln-editor:blur", { target: b.dom });
    }, this._onTextareaInput = function() {
      b._surface.innerHTML !== b._textarea.value && (b._surface.innerHTML = b._textarea.value, L(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), w && (w.addEventListener("mousedown", this._onMousedownToolbar), w.addEventListener("click", this._onClickToolbar)), this._onSetContent = function(S) {
      const C = S.detail && S.detail.html;
      C !== void 0 && (b._surface.innerHTML = C, b._syncToTextarea(), L(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      }));
    }, o.addEventListener("ln-editor:set-content", this._onSetContent);
    const E = this._textarea.form;
    return E && (this._onFormReset = function() {
      setTimeout(function() {
        b._surface.innerHTML = b._textarea.value, L(o, "ln-editor:changed", {
          html: b._textarea.value,
          target: o
        });
      }, 0);
    }, E.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(o) {
    if (!(!o || $(this.dom, "ln-editor:before-change", {
      action: o,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), f[o])
        document.execCommand(f[o], !1, null);
      else if (p[o]) {
        const g = p[o], h = d(this._surface);
        h && h.toLowerCase() === g ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + g + ">");
      } else l[o] ? document.execCommand(l[o], !1, null) : o === "link" ? u(this) : o === "unlink" ? document.execCommand("unlink", !1, null) : o === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const o = this.dom.querySelector('[role="toolbar"]');
    if (!o) return;
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return;
    const g = b.anchorNode;
    if (!g || !this._surface.contains(g)) return;
    const h = o.querySelectorAll("[data-ln-editor-action]");
    for (let A = 0; A < h.length; A++) {
      const w = h[A], E = w.getAttribute("data-ln-editor-action");
      let S = !1;
      if (f[E])
        try {
          S = document.queryCommandState(f[E]);
        } catch {
        }
      else if (p[E]) {
        const C = d(this._surface);
        S = C && C.toLowerCase() === p[E];
      } else if (l[E])
        try {
          S = document.queryCommandState(l[E]);
        } catch {
        }
      else E === "link" && (S = !!_(b.anchorNode, "A", this._surface));
      if (s(E)) {
        const C = String(S);
        w.getAttribute("aria-pressed") !== C && w.setAttribute("aria-pressed", C);
      }
      S ? w.classList.contains("ln-editor-active") || w.classList.add("ln-editor-active") : w.classList.contains("ln-editor-active") && w.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(o) {
    this._surface && (this._surface.innerHTML = o, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const o = this.dom.querySelector('[role="toolbar"]');
    o && (o.removeEventListener("mousedown", this._onMousedownToolbar), o.removeEventListener("click", this._onClickToolbar)), this._detachSelection ? this._detachSelection() : document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const b = this._textarea ? this._textarea.form : null;
    if (b && this._onFormReset && b.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const g = this.dom.querySelector(".ln-editor__link-popover");
      g && g.remove();
    }
    delete this.dom[e];
  };
  function d(o) {
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return null;
    let g = b.anchorNode;
    if (!g) return null;
    for (; g && g !== o; ) {
      if (g.nodeType === 1) {
        const h = g.tagName;
        if (h === "H2" || h === "H3" || h === "H4" || h === "BLOCKQUOTE" || h === "PRE" || h === "P")
          return h;
      }
      g = g.parentNode;
    }
    return null;
  }
  function _(o, b, g) {
    for (; o && o !== g; ) {
      if (o.nodeType === 1 && o.tagName === b)
        return o;
      o = o.parentNode;
    }
    return null;
  }
  function r(o, b) {
    b.preventDefault();
    let g = "";
    if (b.clipboardData && (g = b.clipboardData.getData("text/html"), !g)) {
      const A = b.clipboardData.getData("text/plain");
      A && (g = A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), g = "<p>" + g + "</p>");
    }
    if (!g) return;
    const h = v(g);
    h && document.execCommand("insertHTML", !1, h);
  }
  function v(o) {
    const b = document.createElement("div");
    return b.innerHTML = o, y(b), b.innerHTML;
  }
  function y(o) {
    const b = Array.from(o.childNodes);
    for (let g = 0; g < b.length; g++) {
      const h = b[g];
      if (h.nodeType !== 3) {
        if (h.nodeType !== 1) {
          o.removeChild(h);
          continue;
        }
        if (a[h.tagName]) {
          const A = Array.from(h.attributes);
          for (let w = 0; w < A.length; w++) {
            const E = A[w].name;
            if (h.tagName === "A" && E === "href") {
              const S = h.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || h.removeAttribute("href");
            } else
              h.removeAttribute(E);
          }
          h.tagName === "A" && h.setAttribute("rel", "noopener noreferrer"), y(h);
        } else {
          for (; h.firstChild; )
            o.insertBefore(h.firstChild, h);
          o.removeChild(h);
        }
      }
    }
  }
  function m(o, b) {
    if (!(b.ctrlKey || b.metaKey)) return;
    let g = null;
    switch (b.key.toLowerCase()) {
      case "b":
        g = "bold";
        break;
      case "i":
        g = "italic";
        break;
      case "u":
        g = "underline";
        break;
      case "k":
        g = "link";
        break;
    }
    g && (b.preventDefault(), o._execAction(g));
  }
  function u(o) {
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return;
    const g = _(b.anchorNode, "A", o._surface), h = b.getRangeAt(0).cloneRange();
    o._closeLinkPopover && o._closeLinkPopover();
    const A = Lt(o.dom, "ln-editor-link-popover", "ln-editor");
    if (!A) return;
    const w = A.firstElementChild;
    if (!w) return;
    const E = w.querySelector('input[type="url"]'), S = w.querySelector('[data-ln-editor-action="confirm-link"]'), C = w.querySelector('[data-ln-editor-action="cancel-link"]');
    g && (E.value = g.getAttribute("href") || "");
    const k = o.dom.querySelector('[role="toolbar"]');
    k ? k.after(w) : o.dom.insertBefore(w, o._surface), E.focus();
    function x() {
      const K = window.getSelection();
      K.removeAllRanges(), K.addRange(h);
    }
    function D() {
      document.removeEventListener("mousedown", P), o._closeLinkPopover = null, w.remove();
    }
    function I() {
      const K = E.value.trim();
      if (D(), x(), o._surface.focus(), K)
        if (g)
          g.setAttribute("href", K), g.setAttribute("rel", "noopener noreferrer"), o._syncToTextarea(), L(o.dom, "ln-editor:changed", {
            html: o._textarea.value,
            target: o.dom
          });
        else {
          document.execCommand("createLink", !1, K);
          const Q = window.getSelection();
          if (Q && Q.anchorNode) {
            const Z = _(Q.anchorNode, "A", o._surface);
            Z && (Z.setAttribute("rel", "noopener noreferrer"), o._syncToTextarea());
          }
        }
      else g && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), x(), o._surface.focus();
    }
    function N() {
      D();
    }
    function P(K) {
      const Q = o.dom.contains(K.target) && K.target.closest('[data-ln-editor-action="link"]');
      !w.contains(K.target) && !Q && N();
    }
    o._closeLinkPopover = D, S.addEventListener("click", I), C.addEventListener("click", R), E.addEventListener("keydown", function(K) {
      K.key === "Enter" ? (K.preventDefault(), I()) : K.key === "Escape" && (K.preventDefault(), R());
    }), document.addEventListener("mousedown", P);
  }
  H(t, e, n, "ln-editor", {
    attributes: i
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function i(f) {
    const p = {}, l = f.dataset;
    for (const c in l) {
      if (!c.startsWith("lnFill") || e[c]) continue;
      const s = c.slice(6);
      s && (p[s.charAt(0).toLowerCase() + s.slice(1)] = l[c]);
    }
    return p;
  }
  function a(f, p) {
    const l = window.CSS && CSS.escape ? CSS.escape(p) : p, c = document.querySelectorAll('[data-ln-fill-id="' + l + '"]');
    if (c.length === 0) return null;
    for (let s = 0; s < c.length; s++) {
      const n = c[s].getAttribute("data-ln-fill-form");
      if (n) {
        const d = document.getElementById(n);
        if (d && f.contains(d)) return c[s];
      }
    }
    return c[0];
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const p = f.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const l = p.getAttribute("data-ln-fill-form"), c = document.getElementById(l);
    if (!c) return;
    const s = i(p), n = Object.keys(s).length > 0;
    window.lnCore.lnFill(c, n ? s : null);
  }), document.addEventListener("ln-fill:request", function(f) {
    const p = f.detail;
    if (!p) return;
    const l = f.target, c = p.id;
    if (c == null) {
      window.lnCore.lnFill(l, null);
      return;
    }
    const s = a(l, c);
    if (!s) return;
    const n = i(s);
    window.lnCore.lnFill(l, n);
  }), window[t] = !0;
})();
function Zr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", a = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${a}+`, "g"), i).replace(new RegExp(`^${a}+|${a}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: j, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, a = X(i), f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(l) {
    if (l.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", l.tagName), this;
    const c = l.form;
    if (!c)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", l), this;
    Y(this, l, a);
    const s = c.elements[this.sourceName];
    if (!s)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', l), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', l), this;
    this.dom = l, this.form = c, this.source = s, this._pristine = l.value === "", this._mirroring = !1;
    const n = this;
    return ze(l, f, {
      get: function() {
        return f.get.call(l);
      },
      set: function(d) {
        f.set.call(l, d), n._mirroring || (n._pristine = d === "" || d === null || d === void 0);
      }
    }), this._onSource = function() {
      n._pristine && n._mirror();
    }, this._onSlug = function() {
      n._mirroring || (n._pristine = n.dom.value === "");
    }, this._onFormReset = function() {
      setTimeout(function() {
        n._pristine = n.dom.value === "";
      }, 0);
    }, s.addEventListener("input", this._onSource), l.addEventListener("input", this._onSlug), c.addEventListener("reset", this._onFormReset), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  p.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Zr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), this._onFormReset && this.form && this.form.removeEventListener("reset", this._onFormReset), Object.defineProperty(this.dom, "value", f), delete this.dom[e]);
  }, H(t, e, p, "ln-slug", {
    attributes: i
  });
})();
function to(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), a = t.getTime(), f = Math.floor((a - i) / 1e3), p = Math.abs(f);
  return p < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : p < 60 ? { value: f, unit: "second", isOlderThanMonth: !1 } : p < 3600 ? { value: Math.round(f / 60), unit: "minute", isOlderThanMonth: !1 } : p < 86400 ? { value: Math.round(f / 3600), unit: "hour", isOlderThanMonth: !1 } : p < 604800 ? { value: Math.round(f / 86400), unit: "day", isOlderThanMonth: !1 } : p < 2592e3 ? { value: Math.round(f / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(f / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function oe(t, e, i = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const a = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== i.getFullYear() && (a.year = "numeric"), a;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: E, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: E, description: "BCP 47 language tag override for time formatting" }
  }, a = {}, f = {};
  function p(C) {
    return C.getAttribute("data-ln-time-locale") || J(C);
  }
  function l(C, k) {
    const x = (C || "") + "|" + JSON.stringify(k);
    return a[x] || (a[x] = new Intl.DateTimeFormat(C, k)), a[x];
  }
  function c(C) {
    const k = C || "";
    return f[k] || (f[k] = new Intl.RelativeTimeFormat(C, { numeric: "auto", style: "narrow" })), f[k];
  }
  const s = /* @__PURE__ */ new Set();
  let n = null;
  function d() {
    n || (n = setInterval(r, 6e4));
  }
  function _() {
    n && (clearInterval(n), n = null);
  }
  function r() {
    for (const C of s) {
      if (!document.body.contains(C.dom)) {
        s.delete(C);
        continue;
      }
      b(C);
    }
    s.size === 0 && _();
  }
  function v(C, k) {
    const x = Dt(k), D = (k || "").toLowerCase().split("-")[0], I = l(k, oe("full", C)), R = I.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && R !== D && x.monthsLong) {
      const N = x.monthsLong[C.getMonth()], P = C.getDate(), K = C.getFullYear(), Q = String(C.getHours()).padStart(2, "0"), Z = String(C.getMinutes()).padStart(2, "0");
      return `${P} ${N} ${K}, ${Q}:${Z}`;
    }
    return I.format(C);
  }
  function y(C, k) {
    const x = oe("short", C), D = Dt(k), I = (k || "").toLowerCase().split("-")[0], R = l(k, x), N = R.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (D && N !== I && D.monthsShort) {
      const P = D.monthsShort[C.getMonth()], K = C.getDate(), Q = x.year ? " " + C.getFullYear() : "";
      return `${K} ${P}${Q}`;
    }
    return R.format(C);
  }
  function m(C, k) {
    return l(k, oe("date", C)).format(C);
  }
  function u(C, k) {
    return l(k, oe("time", C)).format(C);
  }
  function o(C, k) {
    const x = to(C);
    return x.isOlderThanMonth ? y(C, k) : c(k).format(x.value, x.unit);
  }
  function b(C) {
    const k = C.dom.getAttribute("datetime");
    if (!k) return;
    const x = it(k);
    if (!x) return;
    const D = C.dom.getAttribute(t) || "short", I = p(C.dom);
    let R;
    switch (D) {
      case "relative":
        R = o(x, I);
        break;
      case "full":
        R = v(x, I);
        break;
      case "date":
        R = m(x, I);
        break;
      case "time":
        R = u(x, I);
        break;
      default:
        R = y(x, I);
        break;
    }
    C.dom.textContent = R, D !== "full" && (C.dom.title = v(x, I));
  }
  const g = /* @__PURE__ */ new Set();
  let h = !1;
  function A() {
    he(), !h && (h = !0, document.addEventListener("ln-core:locale-change", function() {
      g.forEach(function(C) {
        b(C);
      });
    }));
  }
  function w(C) {
    return this.dom = C, g.add(this), A(), b(this), C.getAttribute(t) === "relative" && (s.add(this), d()), this;
  }
  w.prototype.render = function() {
    b(this);
  }, w.prototype.destroy = function() {
    g.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && _(), delete this.dom[e];
  };
  function E(C) {
    const k = C[e];
    if (!k) return;
    C.getAttribute(t) === "relative" ? (s.add(k), d()) : (s.delete(k), s.size === 0 && _()), b(k);
  }
  function S(C) {
    C.nodeType === 1 && C.hasAttribute && C.hasAttribute(t) && C[e] && b(C[e]);
  }
  H(t, e, w, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: E,
    onInit: S
  });
})();
function eo(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, a = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const f = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, p = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  let c = 0, s = 0, n = 0, d = !1, _ = null;
  function r(m, u) {
    p.delete(m), p.set(m, u);
  }
  function v() {
    if (p.size <= e) return [];
    const m = [];
    for (; p.size > e; ) {
      const o = p.keys().next().value;
      m.push(p.get(o)), p.delete(o);
    }
    const u = new Set(p.values());
    return m.filter((o) => !u.has(o));
  }
  function y(m, u) {
    l.add(m), clearTimeout(_), _ = setTimeout(() => f(m, i, u), a);
  }
  return {
    get logicalTotal() {
      return c;
    },
    set logicalTotal(m) {
      c = m;
    },
    get grandTotal() {
      return s;
    },
    set grandTotal(m) {
      s = m;
    },
    get queryGen() {
      return n;
    },
    set queryGen(m) {
      n = m;
    },
    get size() {
      return p.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return d;
    },
    getId: (m) => {
      if (!p.has(m)) return;
      const u = p.get(m);
      return r(m, u), u;
    },
    ensure: (m, u, o) => {
      if (!d && !l.has(0)) return y(0, o);
      if (c <= 0) return;
      const b = Math.max(0, m), g = Math.min(c, u);
      for (let h = b; h < g; h++)
        if (!p.has(h)) {
          const A = Math.floor(h / i) * i;
          if (!l.has(A)) return y(A, o);
        }
    },
    ingest: (m, u, o, b, g) => {
      if (g != null && g !== n) return [];
      d = !0, o != null && (s = o), b != null && (c = b);
      for (let h = 0; h < u.length; h++)
        r(m + h, u[h]);
      return l.delete(m), v();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      d = !1, p.clear(), l.clear(), clearTimeout(_);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (m = {}) => {
      let u = [];
      return m.windowSize > 0 && m.windowSize !== e && (e = m.windowSize, u = v()), m.pageSize > 0 && (i = m.pageSize), m.fetchDebounce >= 0 && (a = m.fetchDebounce), u;
    }
  };
}
function no(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: a, direction: f } = e, p = f === "desc", l = t.map((s) => s ? s[a] : void 0), c = Ve(l);
  return [...t].sort((s, n) => {
    const d = s ? s[a] : void 0, _ = n ? n[a] : void 0, r = Ge(d, _, c, i);
    return p ? -r : r;
  });
}
function Li(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((a) => Array.isArray(e[a]) && e[a].length > 0);
  return i.length ? t.filter((a) => a ? i.every((f) => Qe(a[f], e[f])) : !1) : t;
}
function io(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const a = ei(e);
  return a.length ? t.filter((f) => f ? a.every(
    (p) => i.some((l) => {
      const c = f[l];
      return c != null && ni(String(c), [p]);
    })
  ) : !1) : t;
}
function ro(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const a = t.map((p) => p && p[e] != null ? parseFloat(p[e]) : NaN).filter((p) => Number.isFinite(p)), f = a.reduce((p, l) => p + l, 0);
  return i === "sum" ? f : i === "avg" && a.length ? f / a.length : 0;
}
function oo(t, e = {}, i = [], a) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const f = t.length;
  let p = t;
  e.filters && (p = Li(p, e.filters)), e.search && (p = io(p, e.search, i));
  const l = p.length;
  if (e.sort && (p = no(p, e.sort, a)), e.offset || e.limit) {
    const c = e.offset || 0, s = e.limit || p.length;
    p = p.slice(c, c + s);
  }
  return { records: p, total: f, filtered: l };
}
function so(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const a = { ...i };
    for (const [f, p] of Object.entries(e))
      if (typeof p == "function")
        try {
          a[f] = p(i);
        } catch {
          a[f] = void 0;
        }
    return a;
  });
}
function ao(t, e, i, a = "_meta") {
  if (!Array.isArray(t) || !t.includes(a)) return !0;
  for (const f of Object.keys(e || {})) {
    if (!t.includes(f)) return !0;
    const p = e[f] && e[f].indexes || [], l = i && i[f] || [];
    if (p.some((c) => !l.includes(c))) return !0;
  }
  return !1;
}
function lo(t) {
  return { ok: !1, error: t && t.message ? t.message : String(t) };
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(T, q, O) {
    const M = T.getAttribute(q);
    if (M === "never" || M === "-1") return -1;
    const F = parseInt(M, 10);
    return isNaN(F) ? O : F;
  }
  const a = {
    "data-ln-data-store": { type: "marker", effect: tn, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: tn, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: Ke, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: xt, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: qt, fallback: 1e3, min: 10, effect: ji, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: qt, fallback: 200, min: 5, effect: Wi, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, f = X(a), p = "ln_app_cache", l = "_meta", c = "1.0";
  let s = null, n = null;
  const d = {};
  function _(T) {
    T && T.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: T });
  }
  function r() {
    const T = {};
    for (const q of document.querySelectorAll(`[${t}]`)) {
      const O = q.id;
      if (O) {
        const M = q.getAttribute("data-ln-data-store-indexes") || "";
        T[O] = {
          indexes: M.split(",").map((F) => F.trim()).filter(Boolean)
        };
      }
    }
    return T;
  }
  function v() {
    return n || (n = new Promise((T) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB is not available in this environment"), T(null);
      const q = r(), O = Object.keys(q), M = indexedDB.open(p);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed"), T(null);
      }, M.onsuccess = (F) => {
        const B = F.target.result, U = Array.from(B.objectStoreNames), z = O.filter((ft) => U.includes(ft));
        let G = {};
        if (z.length > 0) {
          const ft = B.transaction(z, "readonly");
          for (const ht of z)
            G[ht] = Array.from(ft.objectStore(ht).indexNames);
        }
        if (!ao(U, q, G, l))
          return y(B), s = B, T(B);
        const It = B.version;
        B.close();
        const vt = indexedDB.open(p, It + 1);
        let mt = !1, gt = null;
        vt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection"), L(document, "ln-data-store:blocked", { db: p }), gt || (gt = setTimeout(() => {
            mt || (console.warn("[ln-data-store] Database upgrade timed out while blocked"), mt = !0, n = null, T(null));
          }, 5e3));
        }, vt.onerror = () => {
          mt || (gt && clearTimeout(gt), mt = !0, n = null, console.warn("[ln-data-store] Database upgrade failed"), T(null));
        }, vt.onupgradeneeded = (ft) => {
          const ht = ft.target.result, Vi = ft.target.transaction;
          ht.objectStoreNames.contains(l) || ht.createObjectStore(l, { keyPath: "key" });
          for (const jt of O)
            if (ht.objectStoreNames.contains(jt)) {
              const ie = Vi.objectStore(jt);
              for (const Pt of q[jt].indexes)
                ie.indexNames.contains(Pt) || ie.createIndex(Pt, Pt, { unique: !1 });
            } else {
              const ie = ht.createObjectStore(jt, { keyPath: "id" });
              for (const Pt of q[jt].indexes)
                ie.createIndex(Pt, Pt, { unique: !1 });
            }
        }, vt.onsuccess = (ft) => {
          if (mt) {
            ft.target.result && ft.target.result.close();
            return;
          }
          gt && clearTimeout(gt), mt = !0;
          const ht = ft.target.result;
          y(ht), s = ht, T(ht);
        };
      };
    }), n);
  }
  function y(T) {
    T.onversionchange = () => {
      T.close(), s = null, n = null;
    };
  }
  function m() {
    return s ? Promise.resolve(s) : (n = null, v());
  }
  async function u(T) {
    if (!Tt() || !T) return T;
    const q = { ...T }, O = q.id, M = await cr(q);
    return !M || !M.encrypted ? T : {
      ...M,
      id: O
    };
  }
  async function o(T) {
    return !T || !T.encrypted || !Tt() ? T : dr(T, { silent: !0 });
  }
  const b = (T, q) => m().then((O) => O ? O.transaction(T, q).objectStore(T) : null);
  function g(T) {
    return new Promise((q, O) => {
      T.onsuccess = () => q(T.result), T.onerror = () => {
        _(T.error), O(T.error);
      };
    });
  }
  const h = (T) => b(T, "readonly").then((q) => q ? g(q.getAll()) : []).then((q) => Tt() ? Promise.all(q.map((O) => o(O))) : q), A = (T, q) => b(T, "readonly").then((O) => O ? g(O.get(q)).then((M) => M !== void 0 ? M : typeof q == "string" && q.trim() !== "" && !isNaN(Number(q)) ? g(O.get(Number(q))) : typeof q == "number" ? g(O.get(String(q))) : null) : null).then((O) => O ? o(O) : null), w = (T, q) => m().then((O) => {
    if (!O) return [];
    const F = O.transaction(T, "readonly").objectStore(T), B = q.map((U) => g(F.get(U)).then((z) => z !== void 0 ? z : typeof U == "string" && U.trim() !== "" && !isNaN(Number(U)) ? g(F.get(Number(U))) : typeof U == "number" ? g(F.get(String(U))) : null));
    return Promise.all(B).then((U) => Tt() ? Promise.all(U.map((z) => z ? o(z) : null)) : U);
  }), E = (T, q) => (Tt() ? u(q) : Promise.resolve(q)).then((M) => b(T, "readwrite").then((F) => F ? g(F.put(M)) : null)), S = (T, q) => b(T, "readwrite").then((O) => O ? g(O.delete(q)).then(() => {
    if (typeof q == "string" && q.trim() !== "" && !isNaN(Number(q)))
      return g(O.delete(Number(q)));
    if (typeof q == "number")
      return g(O.delete(String(q)));
  }) : null), C = (T) => b(T, "readwrite").then((q) => q ? g(q.clear()) : null), k = (T) => b(T, "readonly").then((q) => q ? g(q.count()) : 0), x = (T) => b(l, "readonly").then((q) => q ? g(q.get(T)) : null), D = (T, q) => b(l, "readwrite").then((O) => {
    if (O)
      return q.key = T, g(O.put(q));
  });
  function I(T) {
    return this.dom = T, this._name = T.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", T), Y(this, T, f), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, T.hasAttribute("data-ln-data-store-window") ? this._windowIndex = eo({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (q, O, M) => {
        L(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: q,
          limit: O,
          query: M,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), d[this._name] = this, R(this), this.ready = nt(this), this;
  }
  function R(T) {
    T._handlers = {
      create: (q) => N(T, "create", q.detail, () => K(T, q.detail)),
      update: (q) => N(T, "update", q.detail, () => Q(T, q.detail)),
      delete: (q) => N(T, "delete", q.detail, () => Z(T, q.detail)),
      "bulk-delete": (q) => N(T, "bulk-delete", q.detail, () => rt(T, q.detail)),
      "sync-failed": (q) => {
        T.isSyncing = !1, L(T.dom, "ln-data-store:sync-error", {
          store: T._name,
          error: q.detail && q.detail.error,
          status: q.detail && q.detail.status
        });
      }
    };
    for (const [q, O] of Object.entries(T._handlers))
      T.dom.addEventListener(`ln-data-store:request-${q}`, O);
    T._queryHandlers = {
      "ln-search:change": (q) => {
        q.preventDefault();
        const O = q.detail && q.detail.term != null ? q.detail.term : "";
        O !== T.query.search && (T.query.search = O, me(T));
      },
      "ln-filter:change": (q) => {
        q.preventDefault();
        const O = q.detail && q.detail.key;
        if (!O) return;
        const M = (q.detail.values || []).slice(), F = T.query.filters[O];
        (F ? F.length === M.length && F.every((U, z) => U === M[z]) : !M.length) || (M.length ? T.query.filters[O] = M : delete T.query.filters[O], me(T));
      },
      "ln-sort:change": (q) => {
        q.preventDefault();
        const O = q.detail && q.detail.field, M = q.detail && q.detail.direction, F = M && M !== "none" ? { field: O, direction: M } : null, B = T.query.sort;
        !B && !F || B && F && B.field === F.field && B.direction === F.direction || (T.query.sort = F, me(T));
      }
    };
    for (const [q, O] of Object.entries(T._queryHandlers))
      T.dom.addEventListener(q, O);
  }
  function N(T, q, O, M) {
    const F = O && O.requestId;
    return T._mutationChain = T._mutationChain.then(() => T.ready).then(() => {
      if (T.initializationError) throw T.initializationError;
      return M();
    }).catch((B) => lt(T, q, F, B)), T._mutationChain;
  }
  function P(T, q = 0) {
    return k(T._name).then((O) => {
      if (T._windowIndex || T.windowed) {
        const M = T.totalCount != null ? T.totalCount : O;
        T.totalCount = Math.max(0, M + q);
      } else
        T.totalCount = O;
      return T.hasCache = !0, T.isLoaded = !0, T.canServe = !0, D(T._name, {
        schema_version: c,
        last_synced_at: T.lastSyncedAt,
        has_cache: !0,
        record_count: T.totalCount
      });
    });
  }
  function K(T, { tempId: q, data: O = {}, requestId: M } = {}) {
    const F = { ...O, id: q };
    return E(T._name, F).then(() => P(T, 1)).then(() => {
      L(T.dom, "ln-data-store:created", { store: T._name, record: F, tempId: q, requestId: M });
    });
  }
  function Q(T, { id: q, data: O = {}, requestId: M } = {}) {
    return A(T._name, q).then((F) => {
      if (!F) throw new Error(`Record not found: ${q}`);
      const B = F.id, U = { ...F, ...O, id: B }, z = O.id, G = z !== void 0 && z !== B;
      return (G ? Ri(T._name, B, { ...U, id: z }) : E(T._name, U)).then(() => P(T, 0)).then(() => {
        L(T.dom, "ln-data-store:updated", { store: T._name, record: G ? { ...U, id: z } : U, previous: F, requestId: M });
      });
    });
  }
  function Z(T, { id: q, requestId: O } = {}) {
    return A(T._name, q).then((M) => {
      if (!M) {
        L(T.dom, "ln-data-store:deleted", { store: T._name, id: q, requestId: O, missing: !0 });
        return;
      }
      const F = M.id;
      return S(T._name, F).then(() => P(T, -1)).then(() => {
        L(T.dom, "ln-data-store:deleted", { store: T._name, id: F, requestId: O });
      });
    });
  }
  function rt(T, { ids: q = [], requestId: O } = {}) {
    return q.length ? Promise.all(q.map((M) => A(T._name, M))).then((M) => {
      const F = M.filter(Boolean).map((B) => B.id);
      return yt(T._name, F).then(() => P(T, -F.length)).then(() => {
        L(T.dom, "ln-data-store:deleted", { store: T._name, ids: F, requestId: O });
      });
    }) : (L(T.dom, "ln-data-store:deleted", { store: T._name, ids: [], requestId: O }), Promise.resolve());
  }
  function lt(T, q, O, M) {
    console.error("[ln-data-store] " + q + " failed:", M), L(T.dom, "ln-data-store:mutation-error", {
      store: T._name,
      action: q,
      requestId: O,
      error: M
    });
  }
  function nt(T) {
    return v().then((q) => {
      if (!q) throw new Error("IndexedDB is unavailable");
      return x(T._name);
    }).then((q) => {
      if (T.initializationError = null, q && q.schema_version === c)
        T.lastSyncedAt = q.last_synced_at || null, T.totalCount = q.record_count || 0, T.hasCache = q.has_cache === !0 || T.totalCount > 0, T.hasCache && (T.isLoaded = !0, T.canServe = !0, L(T.dom, "ln-data-store:ready", { store: T._name, count: T.totalCount, source: "cache" })), T.isInitialized = !0, L(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: T.hasCache, lastSyncedAt: T.lastSyncedAt, count: T.totalCount });
      else {
        if (q && q.schema_version !== c)
          return C(T._name).then(() => D(T._name, { schema_version: c, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            T.isInitialized = !0, T.hasCache = !1, L(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        T.isInitialized = !0, T.hasCache = !1, L(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((q) => (T.isInitialized = !0, T.isLoaded = !1, T.canServe = !1, T.hasCache = !1, T.isSyncing = !1, T.initializationError = q, L(T.dom, "ln-data-store:initialization-error", { store: T._name, error: q }), { ok: !1, error: q }));
  }
  function V(T) {
    T.isSyncing = !0, L(T.dom, "ln-data-store:request-remote-sync", { since: T.lastSyncedAt });
  }
  function W(T, q) {
    return m().then((O) => O ? (Tt() ? Promise.all(q.map((F) => u(F))) : Promise.resolve(q)).then((F) => new Promise((B, U) => {
      const z = O.transaction(T, "readwrite"), G = z.objectStore(T);
      F.forEach((et) => G.put(et)), z.oncomplete = () => B(), z.onerror = () => {
        _(z.error), U(z.error);
      };
    })) : void 0);
  }
  function yt(T, q) {
    return m().then((O) => {
      if (O)
        return new Promise((M, F) => {
          const B = O.transaction(T, "readwrite"), U = B.objectStore(T);
          q.forEach((z) => {
            U.delete(z), typeof z == "string" && z.trim() !== "" && !isNaN(Number(z)) ? U.delete(Number(z)) : typeof z == "number" && U.delete(String(z));
          }), B.oncomplete = () => M(), B.onerror = () => F(B.error);
        });
    });
  }
  function Ri(T, q, O) {
    return (Tt() ? u(O) : Promise.resolve(O)).then((F) => m().then((B) => {
      if (B)
        return new Promise((U, z) => {
          const G = B.transaction(T, "readwrite"), et = G.objectStore(T);
          et.put(F), et.delete(q), G.oncomplete = () => U(), G.onerror = () => {
            _(G.error), z(G.error);
          };
        });
    }));
  }
  const Di = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Oi(T) {
    return T ? Object.keys(T).filter((q) => Array.isArray(T[q]) && T[q].length > 0) : [];
  }
  function Ni(T, q, O) {
    return q.every((M) => O[M].map(String).includes(String(T[M])));
  }
  function Mi(T) {
    return String(T || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Fi(T, q, O) {
    return q.every(
      (M) => O.some((F) => {
        const B = T[F];
        return B != null && String(B).toLowerCase().includes(M);
      })
    );
  }
  function Pi(T, q, O) {
    return ro(T, q, O);
  }
  function Kt(T, q) {
    return so(q, T.presenters && T.presenters.computed);
  }
  function Bi(T) {
    return !T.sort && !Tt();
  }
  function Ui(T, q, O) {
    const M = Oi(q.filters), F = q.search ? Mi(q.search) : [], B = T._searchFields, U = F.length > 0 && B && B.length > 0;
    return b(T._name, "readonly").then((z) => z ? new Promise((G, et) => {
      const It = [], vt = z.openCursor();
      vt.onsuccess = () => {
        const mt = vt.result;
        if (!mt || It.length >= O) {
          G(It);
          return;
        }
        const gt = mt.value;
        (!M.length || Ni(gt, M, q.filters)) && (!U || Fi(gt, F, B)) && It.push(gt), mt.continue();
      }, vt.onerror = () => et(vt.error);
    }) : []);
  }
  function Ze(T, q, O) {
    return oo(q, O, T._searchFields, Di);
  }
  function Hi(T, q, O) {
    const M = [];
    for (let B = q; B < q + O; B++) {
      const U = T._windowIndex.getId(B);
      M.push(U);
    }
    const F = Array.from(new Set(M.filter((B) => B !== void 0)));
    return w(T._name, F).then((B) => {
      const U = /* @__PURE__ */ new Map();
      for (let G = 0; G < B.length; G++) {
        const et = B[G];
        et && U.set(String(et.id), et);
      }
      const z = [];
      for (let G = 0; G < M.length; G++) {
        const et = M[G];
        if (et === void 0)
          z.push(null);
        else {
          const It = U.get(String(et));
          z.push(It || null);
        }
      }
      return {
        data: Kt(T, z),
        total: T._windowIndex.grandTotal,
        filtered: T._windowIndex.logicalTotal,
        offset: q,
        queryGen: T._windowIndex.queryGen
      };
    });
  }
  I.prototype.getAll = function(T = {}) {
    const q = this;
    if (q._windowIndex) {
      const O = T.offset || 0, M = T.limit || 200;
      if (q._windowIndex.ensure(O, O + M, T), !q._windowIndex.hasLoaded && !q.noLocalQuery) {
        const F = O + M, B = (U) => ({
          data: Kt(q, U),
          offset: O,
          queryGen: q._windowIndex.queryGen,
          provisional: !0
        });
        return Bi(T) ? Ui(q, T, F).then((U) => B(U.slice(O, F))) : h(q._name).then((U) => B(Ze(q, U, T).records));
      }
      return Hi(q, O, M);
    }
    return h(q._name).then((O) => {
      const M = Ze(q, O, T);
      return {
        data: Kt(q, M.records),
        total: M.total,
        filtered: M.filtered
      };
    });
  }, I.prototype.getById = function(T) {
    return A(this._name, T).then((q) => q ? Kt(this, [q])[0] : null);
  }, I.prototype.count = function(T) {
    return T && Object.keys(T).length > 0 ? h(this._name).then((O) => Li(O, T).length) : this.windowed && this.totalCount != null ? Promise.resolve(this.totalCount) : k(this._name);
  }, I.prototype.aggregate = function(T, q) {
    return h(this._name).then((O) => Pi(O, T, q));
  }, I.prototype.setPresenters = function(T) {
    this.presenters = T;
  }, I.prototype.applySync = function(T, q, O, M) {
    M = M || {};
    const F = this;
    if (F._windowIndex && M.queryGen != null && M.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve({ ok: !0, stale: !0 });
    let B = m().then((U) => {
      if (!U) throw new Error("IndexedDB unavailable");
    });
    return T.length > 0 && (B = B.then(() => W(F._name, T))), q.length > 0 && (B = B.then(() => yt(F._name, q))), B.then(() => {
      if (F._windowIndex && (M.offset != null || M.total != null)) {
        const U = M.offset != null ? M.offset : 0, z = T.map((et) => et.id), G = F._windowIndex.ingest(U, z, M.total, M.filtered, M.queryGen);
        if (G && G.length) return yt(F._name, G);
      }
    }).then(() => k(F._name)).then((U) => (F.totalCount = M.total !== void 0 ? M.total : U, F.hasCache = !0, D(F._name, {
      schema_version: c,
      last_synced_at: O,
      has_cache: !0,
      record_count: F.totalCount
    }))).then(() => {
      const U = !F.isLoaded;
      return F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = O, U ? (L(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: M }), L(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: M })) : L(F.dom, "ln-data-store:synced", {
        store: F._name,
        added: T.length,
        deleted: q.length,
        changed: !0,
        meta: M
      }), { ok: !0 };
    }).catch((U) => {
      F.isSyncing = !1;
      const z = U && U.message ? U.message : String(U);
      return console.error("[ln-data-store] applySync failed:", U), L(F.dom, "ln-data-store:sync-error", {
        store: F._name,
        error: z
      }), lo(U);
    });
  }, I.prototype.applyQuery = function(T, q) {
    q = q || {};
    const O = this;
    let M = Promise.resolve();
    return T.length > 0 && (M = M.then(() => W(O._name, T))), M.then(() => k(O._name)).then((F) => (O.totalCount = q.total !== void 0 ? q.total : F, T.length > 0 && (O.canServe = !0), Kt(O, T))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const T = this;
    return C(T._name).then(() => D(T._name, {
      schema_version: c,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      T.isLoaded = !1, T.hasCache = !1, T.lastSyncedAt = null, T.totalCount = 0, V(T);
    });
  }, I.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [T, q] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${T}`, q);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [T, q] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(T, q);
      this._queryHandlers = null;
    }
    delete d[this._name], delete this.dom[e];
  };
  function zi() {
    return m().then((T) => {
      if (!T) return;
      const q = Array.from(T.objectStoreNames);
      return new Promise((O, M) => {
        const F = T.transaction(q, "readwrite");
        q.forEach((B) => F.objectStore(B).clear()), F.oncomplete = () => O(), F.onerror = () => M(F.error);
      });
    }).then(() => {
      Object.values(d).forEach((T) => {
        T.isLoaded = !1, T.canServe = !1, T.isInitialized = !1, T.initializationError = null, T.hasCache = !1, T.isSyncing = !1, T.lastSyncedAt = null, T.totalCount = 0;
      });
    });
  }
  function me(T) {
    T._windowIndex && T._windowIndex.reset(), L(T.dom, "ln-data-store:query-changed", {
      store: T._name,
      query: {
        filters: Object.assign({}, T.query.filters),
        search: T.query.search,
        sort: T.query.sort ? Object.assign({}, T.query.sort) : null
      }
    });
  }
  const Ki = "data-ln-data-store-frozen";
  function tn(T, q) {
    T.setAttribute(Ki, q);
  }
  function ji(T) {
    const q = T[e];
    if (!q._windowIndex) return;
    const O = q._windowIndex.configure({ windowSize: q._windowSize });
    O.length && yt(q._name, O).catch((M) => {
      console.error("[ln-data-store] window shrink eviction failed:", M);
    });
  }
  function Wi(T) {
    const q = T[e];
    q._windowIndex && q._windowIndex.configure({ pageSize: q._windowPageSize });
  }
  H(t, e, I, "ln-data-store", {
    attributes: a
  }), window[e].clearAll = zi, window[e].init = window[e], window[e].setStorageKey = sn, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = sn);
})();
const co = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Rt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const a = String(e);
    return i === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function uo(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, co);
  if (e && typeof e == "object")
    for (const f in e)
      e[f] !== void 0 && e[f] !== null && e[f] !== "" && (i[f] = e[f]);
  const a = new URLSearchParams();
  return t.search && a.append(i.search, t.search), t.offset != null && a.append(i.offset, t.offset), t.limit != null && a.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (a.append(i.sortField, t.sort.field), a.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((f) => {
    const p = t.filters[f];
    Array.isArray(p) && p.length > 0 && a.append(f, p.join(","));
  }), a.toString();
}
function fo(t, e, i) {
  let a = Rt(t, e);
  return i && (a += (a.indexOf("?") !== -1 ? "&" : "?") + i), a;
}
function vn(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function a(d) {
    const _ = d[e];
    _ && _.refreshConfig();
  }
  function f(d) {
    return d.getAttribute("data-ln-api-path") || d.getAttribute("data-ln-api-endpoint") || "";
  }
  const p = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: j, type: "string", fallback: "", effect: a, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: f, type: "string", fallback: "", effect: a, description: "Resource path appended to base URL" },
    "data-ln-api-endpoint": { read: f, type: "string", fallback: "", effect: a, description: "Alias for data-ln-api-path" },
    "data-ln-api-headers": { prop: "rawHeaders", read: j, type: "json", fallback: null, effect: a, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: a, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: a, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: a, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: a, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: a, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: a, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, l = X(p);
  function c(d) {
    return d.ok ? d.status === 204 ? null : d.json() : d.json().catch(() => null).then((_) => {
      const r = new Error("HTTP " + d.status + ": " + d.statusText);
      throw r.status = d.status, r.data = _, r;
    });
  }
  function s(d) {
    return this.dom = d, Y(this, d, l), d[e] = this, d[i] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, n(this), this;
  }
  s.prototype.refreshConfig = function() {
    const d = this.dom;
    this.credentials = "same-origin", this.headers = qn(this.rawHeaders);
    const _ = {}, r = d.getAttribute("data-ln-api-param-offset");
    r && (_.offset = r);
    const v = d.getAttribute("data-ln-api-param-limit");
    v && (_.limit = v);
    const y = d.getAttribute("data-ln-api-param-search");
    y && (_.search = y);
    const m = d.getAttribute("data-ln-api-param-sort-field");
    m && (_.sortField = m);
    const u = d.getAttribute("data-ln-api-param-sort-dir");
    u && (_.sortDir = u), this.paramKeys = _;
    const o = d.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = o !== null ? +o : 300, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, s.prototype._reqHeaders = function(d) {
    const _ = Object.assign({}, this.headers);
    return !_.Accept && !_.accept && (_.Accept = "application/json"), !_["Content-Type"] && !_["content-type"] && (_["Content-Type"] = "application/json"), d && (_["X-Idempotency-Key"] = d), _;
  }, s.prototype.cancel = function(d) {
    return d && this._inflight.has(d) ? (this._inflight.get(d).abort(), this._inflight.delete(d), !0) : !1;
  }, s.prototype.fetchDelta = function(d, _) {
    const r = this;
    let v = Rt(r.baseUrl, r.path);
    d != null && d !== "" && (v += (v.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(d));
    const y = _ || "sync";
    r._inflight.has(y) && r._inflight.get(y).abort();
    const m = new AbortController();
    return r._inflight.set(y, m), window.fetch(v, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: m.signal
    }).then(c).finally(function() {
      r._inflight.get(y) === m && r._inflight.delete(y);
    });
  }, s.prototype.query = function(d, _) {
    const r = this, v = uo(d, r.paramKeys), y = fo(r.baseUrl, r.path, v), m = _ || "query";
    r._inflight.has(m) && r._inflight.get(m).abort();
    const u = new AbortController();
    return r._inflight.set(m, u), window.fetch(y, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: u.signal
    }).then(c).finally(function() {
      r._inflight.get(m) === u && r._inflight.delete(m);
    });
  }, s.prototype.create = function(d, _, r) {
    const v = this;
    return window.fetch(Rt(v.baseUrl, _ || v.path), {
      method: "POST",
      headers: v._reqHeaders(r),
      credentials: v.credentials,
      body: JSON.stringify(d)
    }).then(c);
  }, s.prototype.update = function(d, _, r, v, y) {
    const m = this;
    r != null && (_ = Object.assign({}, _, { expected_version: r }));
    const u = v ? Rt(m.baseUrl, v) : Rt(m.baseUrl, m.path, d);
    return window.fetch(u, {
      method: "PUT",
      headers: m._reqHeaders(y),
      credentials: m.credentials,
      body: JSON.stringify(_)
    }).then(c);
  }, s.prototype.delete = function(d, _, r) {
    const v = this;
    return window.fetch(Rt(v.baseUrl, _ || v.path, d), {
      method: "DELETE",
      headers: v._reqHeaders(r),
      credentials: v.credentials
    }).then(c);
  }, s.prototype.bulkDelete = function(d, _, r) {
    const v = this;
    return window.fetch(Rt(v.baseUrl, _ || v.path, "bulk-delete"), {
      method: "DELETE",
      headers: v._reqHeaders(r),
      credentials: v.credentials,
      body: JSON.stringify({ ids: d })
    }).then(c);
  };
  function n(d) {
    d._handlers = {
      sync: function(_) {
        const r = _.detail || {}, v = r.meta && r.meta.targetEl ? r.meta.targetEl : null;
        d.fetchDelta(r.since, v).then(function(y) {
          L(d.dom, "ln-api-connector:fetched", { data: y, since: r.since, meta: r.meta || null });
        }).catch(function(y) {
          y && y.name === "AbortError" || L(d.dom, "ln-api-connector:error", {
            action: "sync",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      query: function(_) {
        const r = _.detail || {}, v = r.query || r, y = r.meta && r.meta.targetEl ? r.meta.targetEl : null, m = y || "query", u = d.queryDebounce;
        function o(g, h, A) {
          d.query(h, A).then(function(w) {
            const E = w || {};
            L(d.dom, "ln-api-connector:fetched", {
              data: E.data || (Array.isArray(E) ? E : []),
              total: E.total,
              filtered: E.filtered,
              offset: h.offset,
              queryGen: h.queryGen,
              meta: g.meta || null
            });
          }).catch(function(w) {
            w && w.name === "AbortError" || L(d.dom, "ln-api-connector:error", {
              action: "query",
              error: w.message,
              status: w.status || 0,
              data: w.data || null,
              meta: g.meta || null
            });
          });
        }
        if (u === 0) {
          o(r, v, y);
          return;
        }
        d._queryTimers.has(m) && clearTimeout(d._queryTimers.get(m));
        const b = setTimeout(function() {
          d._queryTimers.delete(m), o(r, v, y);
        }, u);
        d._queryTimers.set(m, b);
      },
      cancel: function(_) {
        const r = _.detail || {}, v = r.meta && r.meta.targetEl ? r.meta.targetEl : r.targetEl || r.key;
        v && d.cancel(v);
      },
      create: function(_) {
        const r = _.detail || {};
        d.create(r.data, r.url, r.idempotencyKey).then(function(v) {
          const y = vn(v);
          L(d.dom, "ln-api-connector:created", {
            record: y.record,
            tempId: r.tempId,
            message: y.message,
            meta: r.meta || null
          });
        }).catch(function(v) {
          v && v.name === "AbortError" || L(d.dom, "ln-api-connector:error", {
            action: "create",
            error: v.message,
            status: v.status || 0,
            data: v.data || null,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(_) {
        const r = _.detail || {};
        d.update(r.id, r.data, r.expected_version, r.url, r.idempotencyKey).then(function(v) {
          const y = vn(v);
          L(d.dom, "ln-api-connector:updated", {
            record: y.record,
            id: r.id,
            message: y.message,
            meta: r.meta || null
          });
        }).catch(function(v) {
          v && v.name === "AbortError" || L(d.dom, "ln-api-connector:error", {
            action: "update",
            error: v.message,
            status: v.status || 0,
            data: v.data || null,
            id: r.id,
            conflictData: v.status === 409 ? v.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(_) {
        const r = _.detail || {};
        d.delete(r.id, r.url, r.idempotencyKey).then(function(v) {
          const y = v && v.message ? v.message : null;
          L(d.dom, "ln-api-connector:deleted", {
            response: v,
            id: r.id,
            message: y,
            meta: r.meta || null
          });
        }).catch(function(v) {
          v && v.name === "AbortError" || L(d.dom, "ln-api-connector:error", {
            action: "delete",
            error: v.message,
            status: v.status || 0,
            data: v.data || null,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(_) {
        const r = _.detail || {};
        d.bulkDelete(r.ids, r.url, r.idempotencyKey).then(function(v) {
          const y = v && v.message ? v.message : null;
          L(d.dom, "ln-api-connector:bulk-deleted", {
            response: v,
            ids: r.ids,
            message: y,
            meta: r.meta || null
          });
        }).catch(function(v) {
          v && v.name === "AbortError" || L(d.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: v.message,
            status: v.status || 0,
            data: v.data || null,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, d.dom.addEventListener("ln-api-connector:request-sync", d._handlers.sync), d.dom.addEventListener("ln-api-connector:request-query", d._handlers.query), d.dom.addEventListener("ln-api-connector:request-cancel", d._handlers.cancel), d.dom.addEventListener("ln-api-connector:request-create", d._handlers.create), d.dom.addEventListener("ln-api-connector:request-update", d._handlers.update), d.dom.addEventListener("ln-api-connector:request-delete", d._handlers.delete), d.dom.addEventListener("ln-api-connector:request-bulk-delete", d._handlers.bulkDelete);
  }
  s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const d = this;
    d._inflight && (d._inflight.forEach(function(_) {
      _.abort();
    }), d._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(_) {
      _ && clearTimeout(_);
    }), this._queryTimers.clear()), this._handlers && (d.dom.removeEventListener("ln-api-connector:request-sync", d._handlers.sync), d.dom.removeEventListener("ln-api-connector:request-query", d._handlers.query), d.dom.removeEventListener("ln-api-connector:request-cancel", d._handlers.cancel), d.dom.removeEventListener("ln-api-connector:request-create", d._handlers.create), d.dom.removeEventListener("ln-api-connector:request-update", d._handlers.update), d.dom.removeEventListener("ln-api-connector:request-delete", d._handlers.delete), d.dom.removeEventListener("ln-api-connector:request-bulk-delete", d._handlers.bulkDelete), d._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, s, "ln-api-connector", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function a(y) {
    const m = y[e];
    m && m.refreshConfig();
  }
  const f = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: j, type: "string", fallback: "", effect: a, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: j, type: "string", fallback: "", effect: a, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: j, type: "string", fallback: "", effect: a, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: a, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, p = X(f);
  function l(y) {
    const m = y && y.content !== void 0 ? y.content : y, u = y && y.message ? y.message : null;
    return { content: m, message: u };
  }
  function c(y) {
    return this.dom = y, Y(this, y, p), y[e] = this, y[i] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, v(this), this;
  }
  c.prototype.refreshConfig = function() {
    const y = this.dom;
    this.credentials = "same-origin";
    const m = y.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = qn(m, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), m.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(y, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function s(y, m, u) {
    const o = Object.assign({}, Wt(y.headers, y.auth), u || {});
    return m && (o["Idempotency-Key"] = m), o;
  }
  c.prototype.fetchDelta = function(y) {
    const m = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const u = this._deltaController.signal, o = ["include_docs=true", "feed=normal"];
    y && o.push("since=" + encodeURIComponent(y));
    const b = Ct(m.url, m.db, "_changes") + "?" + o.join("&");
    return window.fetch(b, { method: "GET", headers: Wt(m.headers, m.auth), credentials: m.credentials, signal: u }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const h = g.results || [];
      return {
        data: h.filter((A) => !A.deleted && A.doc).map((A) => Object.assign({}, A.doc, { id: A.doc._id })),
        deleted: h.filter((A) => A.deleted).map((A) => A.id),
        synced_at: g.last_seq || y || ""
      };
    }).finally(() => {
      m._deltaController && m._deltaController.signal === u && (m._deltaController = null);
    });
  };
  function n(y, m, u) {
    const o = Object.assign({ _id: m.id }, m);
    return o._id || delete o._id, window.fetch(Ct(y.url, y.db), {
      method: "POST",
      headers: s(y, u),
      credentials: y.credentials,
      body: JSON.stringify(o)
    }).then((b) => {
      if (!b.ok) throw new Error("HTTP " + b.status + ": " + b.statusText);
      return b.json();
    }).then((b) => {
      const g = l(b), h = g.content;
      return { record: Object.assign({}, o, { id: h.id, _id: h.id, _rev: h.rev }), message: g.message };
    });
  }
  c.prototype.create = function(y, m) {
    return n(this, y, m).then((u) => u.record);
  };
  function d(y, m, u, o) {
    const b = Object.assign({ id: String(m), _id: String(m) }, u), g = b._rev || b.rev;
    return (g ? Promise.resolve(g) : window.fetch(Ct(y.url, y.db, null, m), { method: "GET", headers: Wt(y.headers, y.auth), credentials: y.credentials }).then((A) => {
      if (!A.ok) throw new Error("Could not retrieve document for revision mapping");
      return A.json().then((w) => w._rev);
    })).then((A) => {
      const w = Object.assign({}, b, { _rev: A });
      delete w.rev;
      const E = s(y, o, { "If-Match": A });
      return window.fetch(Ct(y.url, y.db, null, m), {
        method: "PUT",
        headers: E,
        credentials: y.credentials,
        body: JSON.stringify(w)
      }).then((S) => {
        if (S.ok) return S.json().then((C) => {
          const k = l(C);
          return { record: Object.assign({}, w, { _rev: k.content.rev }), message: k.message };
        });
        if (S.status === 409) return S.json().then((C) => {
          const k = new Error("Conflict");
          throw k.status = 409, k.data = C, k;
        });
        throw new Error("HTTP " + S.status + ": " + S.statusText);
      });
    });
  }
  c.prototype.update = function(y, m, u) {
    return d(this, y, m, u).then((o) => o.record);
  };
  function _(y, m, u, o) {
    return (u ? Promise.resolve(u) : window.fetch(Ct(y.url, y.db, null, m), { method: "GET", headers: Wt(y.headers, y.auth), credentials: y.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision delete");
      return g.json().then((h) => h._rev);
    })).then((g) => {
      const h = Ct(y.url, y.db, null, m) + "?rev=" + encodeURIComponent(g);
      return window.fetch(h, { method: "DELETE", headers: s(y, o), credentials: y.credentials }).then((A) => {
        if (!A.ok) throw new Error("HTTP " + A.status + ": " + A.statusText);
        return A.json();
      }).then((A) => {
        const w = l(A);
        return { response: w.content, message: w.message };
      });
    });
  }
  c.prototype.delete = function(y, m, u) {
    return _(this, y, m, u).then((o) => o.response);
  };
  function r(y, m, u) {
    return !m || m.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Ct(y.url, y.db, "_all_docs"), {
      method: "POST",
      headers: Wt(y.headers, y.auth),
      credentials: y.credentials,
      body: JSON.stringify({ keys: m })
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => {
      const g = (o.rows || []).filter((h) => !h.error && h.value && h.value.rev).map((h) => ({ _id: h.id, _rev: h.value.rev, _deleted: !0 }));
      return g.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Ct(y.url, y.db, "_bulk_docs"), {
        method: "POST",
        headers: s(y, u),
        credentials: y.credentials,
        body: JSON.stringify({ docs: g })
      }).then((h) => {
        if (!h.ok) throw new Error("HTTP " + h.status + ": " + h.statusText);
        return h.json();
      }).then((h) => {
        const A = l(h);
        return { response: { ok: !0, results: A.content, deletedCount: g.length }, message: A.message };
      });
    });
  }
  c.prototype.bulkDelete = function(y, m) {
    return r(this, y, m).then((u) => u.response);
  };
  function v(y) {
    y._handlers = {
      sync: function(m) {
        const u = m.detail || {};
        y.fetchDelta(u.since).then(function(o) {
          L(y.dom, "ln-couchdb-connector:fetched", { data: o, since: u.since, meta: u.meta || null });
        }).catch(function(o) {
          o && o.name === "AbortError" || L(y.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: o.message,
            status: o.status || 0,
            since: u.since,
            meta: u.meta || null
          });
        });
      },
      create: function(m) {
        const u = m.detail || {};
        n(y, u.data, u.idempotencyKey).then(function(o) {
          L(y.dom, "ln-couchdb-connector:created", { record: o.record, tempId: u.tempId, message: o.message, meta: u.meta || null });
        }).catch(function(o) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: o.message,
            status: o.status || 0,
            tempId: u.tempId,
            meta: u.meta || null
          });
        });
      },
      update: function(m) {
        const u = m.detail || {}, o = Object.assign({}, u.data);
        u.expected_version !== void 0 && (o._rev = u.expected_version), d(y, u.id, o, u.idempotencyKey).then(function(b) {
          L(y.dom, "ln-couchdb-connector:updated", { record: b.record, id: u.id, message: b.message, meta: u.meta || null });
        }).catch(function(b) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: b.message,
            status: b.status || 0,
            id: u.id,
            data: b.status === 409 ? b.data : null,
            conflictData: b.status === 409 ? b.data : null,
            meta: u.meta || null
          });
        });
      },
      delete: function(m) {
        const u = m.detail || {};
        _(y, u.id, u.rev, u.idempotencyKey).then(function(o) {
          L(y.dom, "ln-couchdb-connector:deleted", { response: o.response, id: u.id, message: o.message, meta: u.meta || null });
        }).catch(function(o) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: o.message,
            status: o.status || 0,
            id: u.id,
            meta: u.meta || null
          });
        });
      },
      bulkDelete: function(m) {
        const u = m.detail || {};
        r(y, u.ids, u.idempotencyKey).then(function(o) {
          L(y.dom, "ln-couchdb-connector:bulk-deleted", { response: o.response, ids: u.ids, message: o.message, meta: u.meta || null });
        }).catch(function(o) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            ids: u.ids,
            meta: u.meta || null
          });
        });
      }
    }, y.dom.addEventListener("ln-couchdb-connector:request-sync", y._handlers.sync), y.dom.addEventListener("ln-couchdb-connector:request-create", y._handlers.create), y.dom.addEventListener("ln-couchdb-connector:request-update", y._handlers.update), y.dom.addEventListener("ln-couchdb-connector:request-delete", y._handlers.delete), y.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", y._handlers.bulkDelete);
  }
  c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const y = this;
    y._deltaController && (y._deltaController.abort(), y._deltaController = null), y._handlers && (y.dom.removeEventListener("ln-couchdb-connector:request-sync", y._handlers.sync), y.dom.removeEventListener("ln-couchdb-connector:request-create", y._handlers.create), y.dom.removeEventListener("ln-couchdb-connector:request-update", y._handlers.update), y.dom.removeEventListener("ln-couchdb-connector:request-delete", y._handlers.delete), y.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", y._handlers.bulkDelete), y._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, c, "ln-couchdb-connector", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  const a = 1e3, f = 3e4;
  function p(r) {
    const v = r[e];
    v && (v.command === "connect" ? v._open() : v._disconnect());
  }
  function l(r) {
    const v = r[e];
    !v || v.command !== "connect" || (v._drop("url-changed"), v._open());
  }
  const c = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: p, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: j, type: "string", fallback: "", effect: l, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, s = X(c), n = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function d(r, v) {
    return r === "sync" ? { since: v.since } : r === "query" ? { query: v.query || {} } : r === "create" ? { data: v.data, idempotencyKey: v.idempotencyKey } : r === "update" ? { id: v.id, data: v.data, expected_version: v.expected_version, idempotencyKey: v.idempotencyKey } : r === "delete" ? { id: v.id, idempotencyKey: v.idempotencyKey } : { ids: v.ids, idempotencyKey: v.idempotencyKey };
  }
  function _(r) {
    this.dom = r, Y(this, r, s), r[e] = this, r[i] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const v = this;
    this._onRequest = function(y) {
      v._request(n[y.type], y.detail || {});
    };
    for (const y in n) r.addEventListener(y, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  _.prototype._open = function() {
    if (this._socket || this._timer) return;
    const r = this, v = this.url;
    this._attempt++, this._status = "connecting", L(this.dom, "ln-websocket-connector:connecting", { url: v, attempt: this._attempt });
    let y;
    try {
      y = new WebSocket(v);
    } catch (m) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, m.message), this._held = [], L(this.dom, "ln-websocket-connector:disconnected", { url: v, code: 0, reason: m.message, willReconnect: !1 });
      return;
    }
    this._socket = y, y.onopen = function() {
      r._status = "connected", r._attempt = 0, L(r.dom, "ln-websocket-connector:connected", { url: v });
      const m = r._held;
      r._held = [];
      for (let u = 0; u < m.length; u++) r._send(m[u]);
    }, y.onmessage = function(m) {
      r._receive(m.data);
    }, y.onclose = function(m) {
      r._socket = null, r._status = "disconnected", r._failPending("connection closed");
      const u = r.command === "connect";
      L(r.dom, "ln-websocket-connector:disconnected", { url: v, code: m.code, reason: m.reason, willReconnect: u }), u && r._scheduleReconnect();
    };
  }, _.prototype._scheduleReconnect = function() {
    const r = this, v = Math.min(a * Math.pow(2, Math.max(0, this._attempt - 1)), f);
    this._timer = setTimeout(function() {
      r._timer = null, r._open();
    }, v);
  }, _.prototype._drop = function(r) {
    const v = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, r), this._socket = null), v && (this._status = "disconnected", this._failPending("connection closed"), L(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: r, willReconnect: !1 }));
  }, _.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, _.prototype._request = function(r, v) {
    const y = { ref: String(++this._seq), type: r, detail: v };
    this._status === "connected" ? this._send(y) : this.command === "connect" ? this._held.push(y) : this._fail(y, 0, "disconnected", null);
  }, _.prototype._send = function(r) {
    this._pending.set(r.ref, r), this._socket.send(JSON.stringify(Object.assign({ ref: r.ref, type: r.type }, d(r.type, r.detail))));
  }, _.prototype._receive = function(r) {
    let v;
    try {
      v = JSON.parse(r);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", r);
      return;
    }
    if (v.ref !== void 0) {
      const y = this._pending.get(String(v.ref));
      if (!y) return;
      this._pending.delete(y.ref), v.ok ? this._resolve(y, v.content, v.message || null) : this._fail(y, v.status || 0, v.error, v.data);
      return;
    }
    v.type === "changes" && L(this.dom, "ln-websocket-connector:fetched", {
      data: { data: v.data || [], deleted: v.deleted || [], synced_at: v.synced_at },
      since: null,
      meta: null
    });
  }, _.prototype._resolve = function(r, v, y) {
    const m = r.detail, u = m.meta || null, o = this.dom;
    if (r.type === "sync")
      L(o, "ln-websocket-connector:fetched", { data: v, since: m.since, meta: u });
    else if (r.type === "query") {
      const b = m.query || {}, g = v || {};
      L(o, "ln-websocket-connector:fetched", {
        data: g.data || [],
        total: g.total,
        filtered: g.filtered,
        offset: b.offset,
        queryGen: b.queryGen,
        meta: u
      });
    } else r.type === "create" ? L(o, "ln-websocket-connector:created", { record: v, tempId: m.tempId, message: y, meta: u }) : r.type === "update" ? L(o, "ln-websocket-connector:updated", { record: v, id: m.id, message: y, meta: u }) : r.type === "delete" ? L(o, "ln-websocket-connector:deleted", { response: v, id: m.id, message: y, meta: u }) : L(o, "ln-websocket-connector:bulk-deleted", { response: v, ids: m.ids, message: y, meta: u });
  }, _.prototype._fail = function(r, v, y, m) {
    const u = r.detail;
    L(this.dom, "ln-websocket-connector:error", {
      action: r.type,
      error: y,
      status: v,
      data: m || null,
      conflictData: v === 409 && m || null,
      since: u.since,
      id: u.id,
      ids: u.ids,
      tempId: u.tempId,
      meta: u.meta || null
    });
  }, _.prototype._failAll = function(r, v) {
    for (let y = 0; y < r.length; y++) this._fail(r[y], 0, v, null);
  }, _.prototype._failPending = function(r) {
    const v = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(v, r);
  }, _.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const r in n) this.dom.removeEventListener(r, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[i];
    }
  }, H(t, e, _, "ln-websocket-connector", {
    attributes: c
  });
})();
function ho(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function po(t, e) {
  const i = !t || !!t.initializationError, a = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || a) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function wn(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class mo {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((i, a) => {
      this._pending.set(e, { resolve: i, reject: a });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const i = e || new Error("Mutation receipt registry closed");
    for (const a of this._pending.values()) a.reject(i);
    this._pending.clear();
  }
  _settle(e, i) {
    const a = e && e.requestId;
    if (!a) return !1;
    const f = this._pending.get(a);
    return f ? (this._pending.delete(a), i ? f.reject(e.error || new Error("Store mutation failed")) : f.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  const a = "data-ln-data-coordinator-search", f = "data-ln-data-coordinator-filters", p = "data-ln-data-coordinator-sort-field", l = "data-ln-data-coordinator-sort-direction", s = X({
    "data-ln-data-coordinator": { prop: "_name", type: "string", description: "Coordinator name or identifier for data routing" },
    "data-ln-data-coordinator-scope": { type: "string", description: "Scope name addressing the bound data store and connector" },
    "data-ln-data-coordinator-connector": { type: "string", description: "Selector, identifier, or namespace of the bound connector" },
    "data-ln-data-coordinator-mapper": { type: "string", description: "Name of the registered data mapper transform" },
    "data-ln-data-coordinator-search": { prop: "_searchAttr", type: "string", description: "Active search query term" },
    "data-ln-data-coordinator-filters": { prop: "_filtersAttr", type: "string", description: "Active encoded filter parameters" },
    "data-ln-data-coordinator-sort-field": { prop: "_sortFieldAttr", type: "string", description: "Sort field name" },
    "data-ln-data-coordinator-sort-direction": { prop: "_sortDirAttr", type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Sort direction" },
    "data-ln-data-coordinator-stale": { type: "marker", description: "Flag indicating data needs re-synchronization" },
    "data-ln-data-coordinator-no-autosync": { type: "boolean", description: "Disables automatic synchronization upon state changes" }
  }), n = [
    ["[data-ln-table-source]", "data-ln-table-source", "table"],
    ["[data-ln-list-source]", "data-ln-list-source", "list"],
    ["[data-ln-chart-source]", "data-ln-chart-source", "chart"],
    ["[data-ln-options]", "data-ln-options", "options"],
    ["[data-ln-stat]", "data-ln-stat", "stat"]
  ];
  function d(m) {
    const u = m.getAttribute("data-ln-data-coordinator-connector");
    if (u) return m.querySelector(u) || document.querySelector(u) || document.getElementById(u);
    const o = m.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (o) return o;
    for (const b of m.querySelectorAll("*")) {
      if (b.lnConnector) return b;
      for (const g of b.attributes) if (g.name.startsWith("data-ln-") && g.name.endsWith("-connector")) return b;
    }
    return null;
  }
  function _(m) {
    var o;
    if (!m) return "ln-connector";
    if ((o = m.lnConnector) != null && o.namespace) return m.lnConnector.namespace;
    const u = m.getAttribute("data-ln-connector");
    if (u && u !== "true") return u.startsWith("ln-") ? u : "ln-" + u + (u.endsWith("-connector") ? "" : "-connector");
    for (const b of m.attributes) if (b.name.startsWith("data-ln-") && b.name.endsWith("-connector")) return b.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function r(m) {
    const u = this;
    return this.dom = m, Y(this, m, s), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", m), m[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new mo(), this._queueQueryRefresh = zt(() => {
      u._destroyed || u._refreshAll(null, !0);
    }), this.refreshMapper(), v(this), this._checkInitialSync(), this;
  }
  r.prototype._noAutosync = function(m) {
    var u;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((u = m.storeEl) != null && u.hasAttribute("data-ln-data-store-no-autosync"));
  }, r.prototype._isStale = function(m) {
    var o, b;
    const u = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((o = m.storeEl) == null ? void 0 : o.getAttribute("data-ln-data-store-stale"));
    return u === "never" || u === "-1" ? !1 : !((b = m.store) != null && b.lastSyncedAt) || Date.now() / 1e3 - m.store.lastSyncedAt > (parseInt(u, 10) || 300);
  }, r.prototype._checkInitialSync = function() {
    const m = this, u = this.findChildren();
    u.store && Promise.resolve(u.store.ready).then(() => {
      if (m._destroyed) return;
      const o = m.findChildren();
      o.store && o.connector && !m._noAutosync(o) && !o.store.isSyncing && (!o.store.hasCache || m._isStale(o)) && o.store.forceSync();
    }).catch((o) => m._reportError("store-initialize", o, null));
  }, r.prototype.refreshMapper = function() {
    var o, b;
    const m = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, u = m && ((b = (o = window.lnCore) == null ? void 0 : o.getDataMapper) == null ? void 0 : b.call(o, m)) || null;
    this.mapper = { ingress: (u == null ? void 0 : u.ingress) || ((g) => g), egress: (u == null ? void 0 : u.egress) || ((g) => g) };
  }, r.prototype.findChildren = function() {
    const m = this.dom.querySelector("[data-ln-data-store]"), u = d(this.dom), o = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: m, connectorEl: u, queueEl: o, store: (m == null ? void 0 : m.lnDataStore) || null, connector: (u == null ? void 0 : u.lnConnector) || (u == null ? void 0 : u.lnApiConnector) || (u == null ? void 0 : u.lnCouchDbConnector) || (u == null ? void 0 : u.lnWebsocketConnector) || null, queue: (o == null ? void 0 : o.lnApiQueue) || null };
  }, r.prototype._fanOutRemote = function(m, u, o, b) {
    this.refreshMapper(), m.queue ? L(m.queueEl, "ln-api-queue:request-enqueue", o) : m.connector && L(m.connectorEl, _(m.connectorEl) + ":request-" + u, b);
  }, r.prototype._fanOutCreate = function(m, u, o) {
    const b = "_temp_" + wt(), g = this.mapper.egress(u);
    m.storeEl && L(m.storeEl, "ln-data-store:request-create", { tempId: b, data: g }), this._fanOutRemote(m, "create", { chainKey: b, op: "create", targetId: null, payload: g, expectedVersion: null, meta: { tempId: b, action: o } }, { data: g, url: o, meta: { entryId: wt(), queued: !1, op: "create", tempId: b } });
  }, r.prototype._fanOutUpdate = function(m, u, o, b, g) {
    const h = this.mapper.egress(o);
    m.storeEl && L(m.storeEl, "ln-data-store:request-update", { id: u, data: h }), this._fanOutRemote(m, "update", { chainKey: u, op: "update", targetId: u, payload: h, expectedVersion: b, meta: { id: u, action: g } }, { id: u, data: h, expected_version: b, url: g, meta: { entryId: wt(), queued: !1, op: "update", id: u } });
  }, r.prototype._fanOutDelete = function(m, u) {
    m.storeEl && L(m.storeEl, "ln-data-store:request-delete", { id: u }), this._fanOutRemote(m, "delete", { chainKey: u, op: "delete", targetId: u, payload: null, expectedVersion: null, meta: { id: u } }, { id: u, meta: { entryId: wt(), queued: !1, op: "delete", id: u } });
  }, r.prototype._fanOutBulkDelete = function(m, u) {
    const o = u.join(",");
    m.storeEl && L(m.storeEl, "ln-data-store:request-bulk-delete", { ids: u }), this._fanOutRemote(m, "bulk-delete", { chainKey: o, op: "bulk-delete", targetId: null, payload: { ids: u }, expectedVersion: null, meta: { bulkKey: o, ids: u } }, { ids: u, meta: { entryId: wt(), queued: !1, op: "bulk-delete", bulkKey: o } });
  }, r.prototype._requestStoreMutation = function(m, u, o) {
    if (!m.storeEl) return Promise.reject(new Error("Store element not found"));
    const b = wt(), g = this._mutationReceipts.wait(b);
    return L(m.storeEl, "ln-data-store:request-" + u, Object.assign({}, o, { requestId: b })), g;
  }, r.prototype._reportError = function(m, u, o) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", { operation: m, error: u, meta: o || null });
  }, r.prototype._owns = function(m) {
    var o;
    const u = this._name || ((o = this.findChildren().storeEl) == null ? void 0 : o.id);
    return !!m && m === u;
  }, r.prototype._currentQuery = function() {
    const m = this.dom.getAttribute(p), u = this.dom.getAttribute(l), o = new URLSearchParams(this.dom.getAttribute(f) || ""), b = {};
    for (const g of new Set(o.keys())) b[g] = o.getAll(g);
    return { search: this.dom.getAttribute(a) || "", filters: b, sort: m && u ? { field: m, direction: u } : null };
  }, r.prototype._refreshAll = function(m, u) {
    for (const [o, b, g] of n)
      for (const h of this.dom.ownerDocument.querySelectorAll(o))
        if (this._owns(h.getAttribute(b))) {
          if ((g === "table" || g === "list") && h.hasAttribute(g === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            L(h, "ln-" + g + (u ? ":request-invalidate" : ":request-revalidate"), { query: this._currentQuery() });
            continue;
          }
          this._serveElement(h, g, null, m);
        }
  }, r.prototype._serveElement = function(m, u, o, b) {
    const g = this.findChildren(), h = g.store;
    if (!h) return;
    o && this._boundQueries.set(m, o);
    const A = this._boundQueries.get(m) || { sort: null, filters: {}, search: "" }, w = wn(A, this._currentQuery()), E = this;
    return Promise.resolve(h.ready).then(() => {
      if (E._destroyed) return;
      const S = po(h, g.connector);
      if (u === "table" || u === "list" || u === "chart")
        return S === "remote" ? (L(m, "ln-" + u + ":set-loading", { loading: !0 }), L(g.connectorEl, _(g.connectorEl) + ":request-query", { query: w, meta: { targetEl: m, kind: u, offset: w.offset, limit: w.limit, queryGen: A.queryGen } })) : S !== "store" ? L(m, "ln-" + u + ":set-loading", { loading: !1 }) : h.getAll(w).then((C) => {
          E._destroyed || !E._boundDelivered || (L(m, "ln-" + u + ":set-loading", { loading: !1 }), L(m, "ln-" + u + ":set-data", { data: C.data, total: (b == null ? void 0 : b.total) ?? C.total, filtered: (b == null ? void 0 : b.filtered) ?? C.filtered, offset: C.offset ?? (b == null ? void 0 : b.offset) ?? A.offset, queryGen: A.queryGen !== void 0 ? A.queryGen : (b == null ? void 0 : b.queryGen) ?? C.queryGen, provisional: C.provisional === !0 }), E._boundDelivered.set(m, !0));
        });
      if (u === "options") {
        if (S === "remote") return L(g.connectorEl, _(g.connectorEl) + ":request-query", { query: {}, meta: { targetEl: m, kind: u } });
        if (S === "store") return h.getAll({}).then((C) => !E._destroyed && L(m, "ln-options:set-data", { data: C.data }));
      }
      if (u === "stat") {
        let C = o == null ? void 0 : o.filters;
        if (!C) {
          const x = m.getAttribute("data-ln-stat-filter");
          if (x != null && x.includes(":")) {
            const D = x.split(":");
            C = { [D[0].trim()]: [D.slice(1).join(":").trim()] };
          }
        }
        const k = g.connector && h && (h.windowed && C && Object.keys(C).length || h.noLocalQuery) ? "remote" : S;
        if (k === "remote") return L(g.connectorEl, _(g.connectorEl) + ":request-query", { query: { filters: C }, meta: { targetEl: m, kind: u } });
        if (k === "store") return h.count(C).then((x) => !E._destroyed && L(m, "ln-stat:set-count", { count: x }));
      }
    }).catch((S) => {
      E._destroyed || ((u === "table" || u === "list" || u === "chart") && L(m, "ln-" + u + ":set-loading", { loading: !1 }), E._reportError(u + "-query", S, { targetEl: m, kind: u }));
    });
  };
  function v(m) {
    const u = m._unsubs = [], o = (E, S, C) => {
      E.addEventListener(S, C), u.push(() => E.removeEventListener(S, C));
    };
    o(m.dom, "ln-data-store:request-remote-sync", (E) => {
      m.refreshMapper();
      const S = m.findChildren();
      S.store && S.connector && L(S.connectorEl, _(S.connectorEl) + ":request-sync", { since: E.detail.since, meta: { op: "sync" } });
    }), o(m.dom, "ln-data-store:request-page", (E) => {
      const S = m.findChildren(), C = E.detail || {};
      if (!S.connectorEl) return;
      const k = wn(C.query || {}, m._currentQuery());
      L(S.connectorEl, _(S.connectorEl) + ":request-query", {
        query: Object.assign({}, k, { offset: C.offset, limit: C.limit, queryGen: C.queryGen })
      });
    }), o(m.dom, "ln-data-coordinator:request-create", (E) => m._fanOutCreate(m.findChildren(), E.detail.data || {}, E.detail.action)), o(m.dom, "ln-data-coordinator:request-update", (E) => m._fanOutUpdate(m.findChildren(), E.detail.id, E.detail.data || {}, E.detail.expected_version, E.detail.action)), o(m.dom, "ln-data-coordinator:request-delete", (E) => m._fanOutDelete(m.findChildren(), E.detail.id)), o(m.dom, "ln-data-coordinator:request-bulk-delete", (E) => m._fanOutBulkDelete(m.findChildren(), E.detail.ids || [])), o(m.dom, "ln-api-queue:send", (E) => m._onQueueSend(E.detail || {})), o(m.dom, "ln-api-queue:failed", (E) => {
      var S;
      return m._reportError("queue-failed", ((S = E == null ? void 0 : E.detail) == null ? void 0 : S.error) || new Error("Queue failed"), (E == null ? void 0 : E.detail) || null);
    }), o(m.dom, "ln-data-store:initialized", (E) => {
      var C;
      const S = m.findChildren();
      S.store && !S.store.initializationError && S.connector && !m._noAutosync(S) && !S.store.isSyncing && (!((C = E.detail) != null && C.hasCache) || m._isStale(S)) && S.store.forceSync();
    });
    const b = () => {
      const E = m.findChildren();
      E.store && !E.store.initializationError && E.connector && !m._noAutosync(E) && E.store.isInitialized && !E.store.isSyncing && E.store.forceSync();
    };
    o(m.dom, "ln-websocket-connector:connected", b), o(document, "submit", (E) => m._onFormSubmit(E));
    const g = (E, S, C) => {
      var k;
      m._owns(E.target.getAttribute(C)) && m._serveElement(E.target, S, S === "stat" ? { filters: ((k = E.detail) == null ? void 0 : k.filters) || null } : S === "options" ? null : ho(E.detail || {}), null);
    };
    o(document, "ln-table:request-data", (E) => g(E, "table", "data-ln-table-source")), o(document, "ln-list:request-data", (E) => g(E, "list", "data-ln-list-source")), o(document, "ln-chart:request-data", (E) => g(E, "chart", "data-ln-chart-source")), o(document, "ln-options:request-data", (E) => g(E, "options", "data-ln-options")), o(document, "ln-stat:request-count", (E) => g(E, "stat", "data-ln-stat"));
    const h = (E) => {
      m._mutationReceipts.resolve(E.detail), m._refreshAll(null, !1);
    };
    o(m.dom, "ln-data-store:ready", h), o(m.dom, "ln-data-store:created", h), o(m.dom, "ln-data-store:updated", h), o(m.dom, "ln-data-store:deleted", h), o(m.dom, "ln-data-store:mutation-error", (E) => m._mutationReceipts.reject(E.detail)), o(m.dom, "ln-data-store:synced", (E) => {
      var S;
      (S = E.detail) != null && S.changed && m._refreshAll(E.detail.meta, !1);
    }), o(m.dom, "ln-data-store:query-changed", () => m._refreshAll(null, !0)), o(m.dom, "ln-search:change", (E) => {
      var C;
      E.preventDefault();
      const S = ((C = E.detail) == null ? void 0 : C.term) != null ? E.detail.term : "";
      S !== (m.dom.getAttribute(a) || "") && m.dom.setAttribute(a, S);
    }), o(m.dom, "ln-filter:change", (E) => {
      var R;
      E.preventDefault();
      const S = (R = E.detail) == null ? void 0 : R.key;
      if (!S) return;
      const C = (E.detail.values || []).slice(), k = m._currentQuery().filters, x = k[S];
      if (x ? x.length === C.length && x.every((N, P) => N === C[P]) : !C.length) return;
      C.length ? k[S] = C : delete k[S];
      const D = new URLSearchParams();
      Object.keys(k).forEach((N) => k[N].forEach((P) => D.append(N, P)));
      const I = D.toString();
      I ? m.dom.setAttribute(f, I) : m.dom.removeAttribute(f);
    }), o(m.dom, "ln-sort:change", (E) => {
      var D, I;
      E.preventDefault();
      const S = (D = E.detail) == null ? void 0 : D.field, C = (I = E.detail) == null ? void 0 : I.direction, k = S && C && C !== "none" ? { field: S, direction: C } : null, x = m._currentQuery().sort;
      !x && !k || x && k && x.field === k.field && x.direction === k.direction || (k ? (m.dom.setAttribute(p, k.field), m.dom.setAttribute(l, k.direction)) : (m.dom.removeAttribute(p), m.dom.removeAttribute(l)));
    });
    const A = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), w = m.findChildren().connectorEl;
    if (w) {
      const E = _(w);
      A.add(E), o(m.dom, E + ":connected", b);
    }
    A.forEach((E) => {
      o(m.dom, E + ":fetched", (S) => m._reconcileServerFetch(S.detail)), o(m.dom, E + ":created", (S) => m._reconcileServerMutation("create", S.detail)), o(m.dom, E + ":updated", (S) => m._reconcileServerMutation("update", S.detail)), o(m.dom, E + ":deleted", (S) => m._reconcileServerMutation("ack", S.detail)), o(m.dom, E + ":bulk-deleted", (S) => m._reconcileServerMutation("ack", S.detail)), o(m.dom, E + ":error", (S) => m._reconcileServerMutation("error", S.detail));
    });
  }
  r.prototype._onQueueSend = function(m) {
    this.refreshMapper();
    const u = this.findChildren();
    if (!u.store || !u.connector || !u.queue) return;
    const o = m.meta || {}, b = _(u.connectorEl), g = m.idempotencyKey || m.entryId, h = {
      create: () => L(u.connectorEl, b + ":request-create", { data: m.payload, url: o.action || null, idempotencyKey: g, meta: { entryId: m.entryId, queued: !0, op: "create", tempId: o.tempId } }),
      update: () => L(u.connectorEl, b + ":request-update", { id: m.targetId, data: m.payload, expected_version: m.expectedVersion, url: o.action || null, idempotencyKey: g, meta: { entryId: m.entryId, queued: !0, op: "update", id: m.targetId } }),
      delete: () => L(u.connectorEl, b + ":request-delete", { id: m.targetId, idempotencyKey: g, meta: { entryId: m.entryId, queued: !0, op: "delete", id: m.targetId } }),
      "bulk-delete": () => {
        var A;
        return L(u.connectorEl, b + ":request-bulk-delete", { ids: ((A = m.payload) == null ? void 0 : A.ids) || [], idempotencyKey: g, meta: { entryId: m.entryId, queued: !0, op: "bulk-delete", bulkKey: o.bulkKey } });
      }
    };
    h[m.op] && h[m.op]();
  }, r.prototype._onFormSubmit = function(m) {
    const u = m.target;
    if (m.defaultPrevented) return;
    const o = u.hasAttribute(i) ? u.getAttribute(i) : null;
    if (o === null || (o ? !this._owns(o) : u.closest("[" + t + "]") !== this.dom)) return;
    const b = Ln(u);
    if (b !== "POST" && b !== "PUT" && b !== "PATCH") return;
    m.preventDefault();
    const g = Ue(u);
    delete g._method, delete g._token;
    const h = g.id, A = g.expected_version, w = u.getAttribute("action") || "", E = this.findChildren();
    delete g.id, delete g.expected_version, b === "POST" ? this._fanOutCreate(E, g, w) : this._fanOutUpdate(E, h, g, A, w);
  }, r.prototype._reconcileServerFetch = function(m) {
    if (!m) return;
    const u = m.meta || {}, o = this.findChildren(), b = m.data;
    this.refreshMapper();
    const g = Array.isArray(b) ? b : (b == null ? void 0 : b.data) || [], h = Array.isArray(b == null ? void 0 : b.deleted) ? b.deleted : [], A = Array.isArray(b) ? Math.floor(Date.now() / 1e3) : (b == null ? void 0 : b.synced_at) ?? (b == null ? void 0 : b.since) ?? Math.floor(Date.now() / 1e3), w = g.map((E) => this.mapper.ingress(E));
    if (!(!o.store || o.store.initializationError)) {
      if (!u.kind) return o.store.applySync(w, h, A, { total: m.total, filtered: m.filtered, offset: m.offset, queryGen: m.queryGen, targetEl: u.targetEl });
      o.store.applyQuery(w, { total: m.total }).then((E) => {
        const S = u.kind;
        S === "table" || S === "list" || S === "chart" ? (L(u.targetEl, "ln-" + S + ":set-loading", { loading: !1 }), L(u.targetEl, "ln-" + S + ":set-data", { data: E, total: m.total ?? E.length, filtered: m.filtered ?? E.length, offset: m.offset, queryGen: u.queryGen }), this._boundDelivered.set(u.targetEl, !0)) : S === "options" ? o.store.getAll({}).then((C) => L(u.targetEl, "ln-options:set-data", { data: C.data })) : S === "stat" && L(u.targetEl, "ln-stat:set-count", { count: m.filtered ?? m.total ?? w.length });
      });
    }
  }, r.prototype._reconcileServerMutation = function(m, u) {
    var g;
    if (!u) return;
    const o = this.findChildren(), b = u.meta || {};
    if (m === "create") {
      if (!u.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), b);
      const h = this.mapper.ingress(u.record);
      (o.storeEl ? this._requestStoreMutation(o, "update", { id: b.tempId, data: h }) : Promise.resolve()).then(() => {
        b.queued && o.queue && L(o.queueEl, "ln-api-queue:resolve-create", { entryId: b.entryId, oldKey: b.tempId, newId: h.id });
      }).catch((A) => this._reportError("create-reconcile", A, b));
    } else if (m === "update") {
      const h = u.record ? this.mapper.ingress(u.record) : null;
      (o.storeEl && h ? this._requestStoreMutation(o, "update", { id: b.id, data: h }) : Promise.resolve()).then(() => {
        b.queued && o.queue && L(o.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
      }).catch((A) => this._reportError("update-reconcile", A, b));
    } else if (m === "ack")
      b.queued && o.queue && L(o.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
    else if (m === "error") {
      const h = u.status || ((g = u.error) == null ? void 0 : g.status) || 0;
      b.queued && o.queue && L(o.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: h === 401 || h === 419 ? "auth" : h === 0 || h >= 500 ? "retry" : "drop" }), o.storeEl && L(o.storeEl, "ln-data-store:request-sync-failed", { error: u.error || u, status: h }), this._reportError("connector-error", u.error || u, b);
    }
  }, r.prototype.destroy = function() {
    var m;
    if (this.dom[e]) {
      for (this._destroyed = !0; (m = this._unsubs) != null && m.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function y(m, u) {
    const o = m[e];
    o && (u === "data-ln-data-coordinator-mapper" ? o.refreshMapper() : (u === a || u === f || u === p || u === l) && o._queueQueryRefresh());
  }
  H(t, e, r, "ln-data-coordinator", {
    extraAttributes: ["data-ln-data-coordinator-mapper", a, f, p, l],
    onAttributeChange: y
  }), window[e].init = window[e];
})();
const go = "ln_api_queue", _o = 2, tt = "outbox", st = "_queue_meta";
function ct(t, e) {
  return t.error || new Error(e);
}
function Ut(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function En(t) {
  return "seq:" + t;
}
function se(t) {
  return "paused:" + t;
}
function An(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function bo(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function yo(t, e, i, a) {
  const f = /* @__PURE__ */ new Map(), p = [], l = [];
  for (const c of t || [])
    f.has(c.chainKey) || f.set(c.chainKey, []), f.get(c.chainKey).push(c);
  return f.forEach((c, s) => {
    c.sort((d, _) => d.seq - _.seq);
    const n = c[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > a) {
        l.push({ chainKey: s, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > a) {
        l.push({ chainKey: s, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = a + i, n.updatedAt = a, p.push(n);
    }
  }), { entries: p, wakeups: l };
}
function vo(t, e, i, a, f) {
  const p = [], l = [];
  for (const c of t || []) {
    if (c.entryId === e) {
      l.push(c.entryId);
      continue;
    }
    c.chainKey === i && (c.chainKey = a, c.targetId === i && (c.targetId = a), c.meta && c.meta.id === i && (c.meta.id = a), c.meta && typeof c.meta.action == "string" && (c.meta.action = bo(c.meta.action, i, a)), c.updatedAt = f, p.push(c));
  }
  return { changed: p, deleted: l };
}
class wo {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || go, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const a = this.indexedDB.open(this.dbName, _o);
      a.onupgradeneeded = (f) => {
        const p = f.target.result;
        let l;
        p.objectStoreNames.contains(tt) ? l = f.target.transaction.objectStore(tt) : l = p.createObjectStore(tt, { keyPath: "entryId" }), l.indexNames.contains("by_scope_chain") || l.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), l.indexNames.contains("by_scope_seq") || l.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(st) || p.createObjectStore(st, { keyPath: "key" });
      }, a.onerror = () => i(ct(a, "Queue database open failed")), a.onsuccess = (f) => {
        this._db = f.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const a = this.indexedDB.deleteDatabase(this.dbName);
      a.onsuccess = () => e(), a.onerror = () => i(ct(a, "Queue database delete failed")), a.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((a, f) => {
      const l = i.transaction(tt, "readonly").objectStore(tt).index("by_scope_seq").getAll(Ut(this.keyRange, e));
      l.onsuccess = () => a(l.result || []), l.onerror = () => f(ct(l, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((a) => a ? new Promise((f, p) => {
      const l = a.transaction([st, tt], "readwrite"), c = l.objectStore(st), s = l.objectStore(tt), n = En(e);
      let d = null;
      const _ = (v) => {
        const y = v + 1;
        d = {
          entryId: this.uuid(),
          scope: e,
          chainKey: i.chainKey,
          seq: y,
          op: i.op,
          targetId: i.targetId !== void 0 ? i.targetId : null,
          payload: i.payload,
          expectedVersion: i.expectedVersion !== void 0 ? i.expectedVersion : null,
          meta: i.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, c.put({ key: n, value: y }), s.put(d);
      }, r = c.get(n);
      r.onerror = () => p(ct(r, "Queue sequence read failed")), r.onsuccess = () => {
        const v = r.result;
        if (v && typeof v.value == "number") {
          _(v.value);
          return;
        }
        const y = s.index("by_scope_seq").getAll(Ut(this.keyRange, e));
        y.onerror = () => p(ct(y, "Queue sequence migration failed")), y.onsuccess = () => {
          const m = (y.result || []).reduce((u, o) => Math.max(u, o.seq || 0), 0);
          _(m);
        };
      }, l.oncomplete = () => f(d), l.onerror = () => p(l.error || new Error("Queue enqueue transaction failed")), l.onabort = () => p(l.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, a) {
    return this.open().then((f) => f ? new Promise((p, l) => {
      const c = f.transaction(tt, "readwrite"), s = c.objectStore(tt), n = s.index("by_scope_seq").getAll(Ut(this.keyRange, e)), d = this.now();
      let _ = { entries: [], wakeups: [] };
      n.onerror = () => l(ct(n, "Queue claim read failed")), n.onsuccess = () => {
        _ = yo(n.result || [], i, a, d);
        for (const r of _.entries) s.put(r);
      }, c.oncomplete = () => p(_), c.onerror = () => l(c.error || new Error("Queue claim transaction failed")), c.onabort = () => l(c.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (a, f) => (f.delete(a.entryId), { status: "acked", entry: a }));
  }
  nack(e, i, a, f) {
    f = f || {};
    const p = f.maxAttempts || 8, l = f.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((c) => c ? new Promise((s, n) => {
      const d = c.transaction([tt, st], "readwrite"), _ = d.objectStore(tt), r = d.objectStore(st), v = _.get(i);
      let y = null;
      v.onerror = () => n(ct(v, "Queue nack read failed")), v.onsuccess = () => {
        const m = v.result;
        if (!(!m || m.scope !== e)) {
          if (a === "drop") {
            _.delete(m.entryId), y = { status: "dropped", entry: m };
            return;
          }
          if (An(m), m.updatedAt = this.now(), a === "auth") {
            m.status = "pending", _.put(m), r.put({ key: se(e), value: "auth" }), y = { status: "auth", entry: m };
            return;
          }
          if (a === "retry") {
            if (m.attempts = (m.attempts || 0) + 1, m.attempts >= p) {
              m.status = "failed", m.nextAttemptAt = 0, _.put(m), y = { status: "failed", entry: m };
              return;
            }
            const u = l[Math.min(m.attempts - 1, l.length - 1)];
            m.status = "pending", m.nextAttemptAt = this.now() + u, _.put(m), y = { status: "retry", entry: m, delay: u };
          }
        }
      }, d.oncomplete = () => s(y), d.onerror = () => n(d.error || new Error("Queue nack transaction failed")), d.onabort = () => n(d.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, a) {
    return this._remapTransaction(e, null, i, a);
  }
  resolveCreate(e, i, a, f) {
    return this._remapTransaction(e, i, a, f);
  }
  _remapTransaction(e, i, a, f) {
    return this.open().then((p) => p ? new Promise((l, c) => {
      const s = p.transaction(tt, "readwrite"), n = s.objectStore(tt), d = n.index("by_scope_seq").getAll(Ut(this.keyRange, e));
      let _ = { changed: [], deleted: [] };
      d.onerror = () => c(ct(d, "Queue remap read failed")), d.onsuccess = () => {
        _ = vo(d.result || [], i, a, f, this.now());
        for (const r of _.deleted) n.delete(r);
        for (const r of _.changed) n.put(r);
      }, s.oncomplete = () => l(_.changed), s.onerror = () => c(s.error || new Error("Queue remap transaction failed")), s.onabort = () => c(s.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((a, f) => {
      const p = i.transaction(tt, "readwrite"), l = p.objectStore(tt), c = l.index("by_scope_seq").getAll(Ut(this.keyRange, e));
      let s = 0;
      c.onerror = () => f(ct(c, "Queue failed-entry read failed")), c.onsuccess = () => {
        for (const n of c.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), An(n), l.put(n), s++);
      }, p.oncomplete = () => a(s), p.onerror = () => f(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => f(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((a, f) => {
      const l = i.transaction(st, "readonly").objectStore(st).get(se(e));
      l.onsuccess = () => {
        const c = l.result ? l.result.value : !1;
        a(c || !1);
      }, l.onerror = () => f(ct(l, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((a) => {
      if (a)
        return new Promise((f, p) => {
          const l = a.transaction(st, "readwrite"), c = typeof i == "string" ? i : i ? "manual" : !1;
          l.objectStore(st).put({ key: se(e), value: c }), l.oncomplete = () => f(), l.onerror = () => p(l.error || new Error("Queue pause-state write failed")), l.onabort = () => p(l.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((a, f) => {
          const p = i.transaction([tt, st], "readwrite"), c = p.objectStore(tt).index("by_scope_seq").openCursor(Ut(this.keyRange, e));
          c.onsuccess = (s) => {
            const n = s.target.result;
            n && (n.delete(), n.continue());
          }, c.onerror = () => f(ct(c, "Queue clear failed")), p.objectStore(st).delete(En(e)), p.objectStore(st).delete(se(e)), p.oncomplete = () => a(), p.onerror = () => f(p.error || new Error("Queue clear transaction failed")), p.onabort = () => f(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, a) {
    return this.open().then((f) => f ? new Promise((p, l) => {
      const c = f.transaction(tt, "readwrite"), s = c.objectStore(tt), n = s.get(i);
      let d = null;
      n.onerror = () => l(ct(n, "Queue entry read failed")), n.onsuccess = () => {
        const _ = n.result;
        !_ || _.scope !== e || (d = a(_, s));
      }, c.oncomplete = () => p(d), c.onerror = () => l(c.error || new Error("Queue entry transaction failed")), c.onabort = () => l(c.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], a = 8, f = 6e4;
  if (window[e] !== void 0) return;
  function p(n) {
    const d = n[e];
    d && d._drain();
  }
  const l = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: p, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, c = new wo({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: wt
  });
  function s(n) {
    this.dom = n, n[e] = this;
    const d = n.closest("[data-ln-data-coordinator]");
    this.scope = n.id || (d ? d.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = wt(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const _ = this;
    return c.open().then((r) => r ? c.getPaused(_.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((r) => {
      if (_._paused = !!r, _._paused) {
        const v = typeof r == "string" ? r : "auth";
        L(_.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return _._emitPendingCount();
    }).then(() => _._drain()).catch((r) => {
      console.error("[ln-api-queue] Initialization failed:", r), L(_.dom, "ln-api-queue:error", { operation: "initialize", error: r });
    }), this;
  }
  s.prototype._isOnline = function() {
    const n = this.dom.getAttribute("data-ln-api-queue-online");
    return n === "true" ? !0 : n === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const n = this;
    return c.allForScope(n.scope).then((d) => (L(n.dom, "ln-api-queue:pending-count", { count: d.length, scope: n.scope }), d.length === 0 && L(n.dom, "ln-api-queue:drained", { scope: n.scope }), d));
  }, s.prototype._clearTimer = function(n) {
    const d = this._timers.get(n);
    d && (clearTimeout(d), this._timers.delete(n));
  }, s.prototype._scheduleTimer = function(n, d) {
    const _ = Math.max(0, d), r = this._timers.get(n);
    r && clearTimeout(r);
    const v = this, y = setTimeout(() => {
      v._timers.delete(n), v._drain();
    }, _);
    this._timers.set(n, y);
  }, s.prototype._drain = function() {
    const n = this;
    return n._paused || !n._isOnline() ? Promise.resolve() : (n._drainPromise || (n._drainPromise = c.claimReady(n.scope, n._workerId, f).then((d) => {
      for (const _ of d.wakeups)
        n._scheduleTimer(_.chainKey, _.at - Date.now());
      for (const _ of d.entries)
        n._clearTimer(_.chainKey), L(n.dom, "ln-api-queue:send", {
          entryId: _.entryId,
          chainKey: _.chainKey,
          op: _.op,
          targetId: _.targetId,
          payload: _.payload,
          expectedVersion: _.expectedVersion,
          idempotencyKey: _.entryId,
          meta: _.meta
        });
    }).catch((d) => {
      console.error("[ln-api-queue] Drain failed:", d), L(n.dom, "ln-api-queue:error", { operation: "drain", error: d });
    }).finally(() => {
      n._drainPromise = null;
    })), n._drainPromise);
  }, s.prototype._onEnqueue = function(n) {
    const d = this;
    return c.enqueue(d.scope, n.detail || {}).then((_) => {
      if (_)
        return d._emitPendingCount().then((r) => (L(d.dom, "ln-api-queue:enqueued", {
          entryId: _.entryId,
          chainKey: _.chainKey,
          count: r.length
        }), d._drain()));
    }).catch((_) => {
      L(d.dom, "ln-api-queue:error", { operation: "enqueue", error: _ });
    });
  }, s.prototype._onAck = function(n) {
    const d = this, _ = n.detail || {};
    return c.ack(d.scope, _.entryId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((r) => {
      L(d.dom, "ln-api-queue:error", { operation: "ack", entryId: _.entryId, error: r });
    });
  }, s.prototype._onNack = function(n) {
    const d = this, _ = n.detail || {};
    return c.nack(d.scope, _.entryId, _.reason, {
      maxAttempts: a,
      backoff: i
    }).then((r) => {
      if (r)
        return r.status === "failed" ? L(d.dom, "ln-api-queue:failed", {
          entryId: r.entry.entryId,
          chainKey: r.entry.chainKey,
          attempts: r.entry.attempts
        }) : r.status === "retry" ? d._scheduleTimer(r.entry.chainKey, r.delay) : r.status === "auth" && (d._paused = !0, L(d.dom, "ln-api-queue:paused", { reason: "auth" }), L(d.dom, "ln-api-queue:auth-required", {
          entryId: r.entry.entryId,
          chainKey: r.entry.chainKey
        })), d._emitPendingCount().then(() => {
          if (r.status === "dropped") return d._drain();
        });
    }).catch((r) => {
      L(d.dom, "ln-api-queue:error", { operation: "nack", entryId: _.entryId, error: r });
    });
  }, s.prototype._onRemap = function(n) {
    const d = this, _ = n.detail || {};
    return c.remap(d.scope, _.oldKey, _.newId).catch((r) => {
      L(d.dom, "ln-api-queue:error", { operation: "remap", error: r });
    });
  }, s.prototype._onResolveCreate = function(n) {
    const d = this, _ = n.detail || {};
    return c.resolveCreate(d.scope, _.entryId, _.oldKey, _.newId).then(() => d._emitPendingCount()).then(() => d._drain()).catch((r) => {
      L(d.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: _.entryId,
        error: r
      });
    });
  }, s.prototype._onResume = function() {
    const n = this;
    return c.setPaused(n.scope, !1).then(() => (n._paused = !1, L(n.dom, "ln-api-queue:resumed", {}), n._drain())).catch((d) => {
      L(n.dom, "ln-api-queue:error", { operation: "resume", error: d });
    });
  }, s.prototype._onPause = function() {
    const n = this;
    return c.setPaused(n.scope, "manual").then(() => {
      n._paused = !0, L(n.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((d) => {
      L(n.dom, "ln-api-queue:error", { operation: "pause", error: d });
    });
  }, s.prototype._onDrain = function() {
    const n = this;
    return c.resetFailed(n.scope).then(() => {
      const d = n._drainPromise;
      return d ? d.then(() => n._drain()) : n._drain();
    }).catch((d) => {
      L(n.dom, "ln-api-queue:error", { operation: "manual-drain", error: d });
    });
  }, s.prototype._onClear = function() {
    const n = this;
    return n._timers.forEach((d) => clearTimeout(d)), n._timers.clear(), c.clear(n.scope).then(() => {
      n._paused = !1, L(n.dom, "ln-api-queue:pending-count", { count: 0, scope: n.scope }), L(n.dom, "ln-api-queue:drained", { scope: n.scope });
    }).catch((d) => {
      L(n.dom, "ln-api-queue:error", { operation: "clear", error: d });
    });
  }, s.prototype._bindEvents = function() {
    const n = this;
    n._handlers = {
      enqueue: (d) => n._onEnqueue(d),
      ack: (d) => n._onAck(d),
      nack: (d) => n._onNack(d),
      remap: (d) => n._onRemap(d),
      resolveCreate: (d) => n._onResolveCreate(d),
      resume: () => n._onResume(),
      pause: () => n._onPause(),
      drain: () => n._onDrain(),
      clear: () => n._onClear()
    }, n.dom.addEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.addEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.addEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.addEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.addEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.addEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.addEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.addEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.addEventListener("ln-api-queue:request-clear", n._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n.dom.removeEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.removeEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.removeEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.removeEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.removeEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.removeEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.removeEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.removeEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.removeEventListener("ln-api-queue:request-clear", n._handlers.clear), window.removeEventListener("online", n._onlineHandler), n._timers.forEach((d) => clearTimeout(d)), n._timers.clear(), delete n.dom[e];
  }, H(t, e, s, "ln-api-queue", {
    attributes: l
  });
})();
function qi(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Ht(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function Eo(t, e, i) {
  const a = qi(t);
  return a === null || a < 0 ? 0 : Math.min(a, Math.min(e, i) / 2);
}
function Ao(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function So(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function Co(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, a = e.xField || "label", f = e.yField || "value", p = e.includeZero !== !1, l = Eo(e.padding, i.width, i.height), c = Array.isArray(t) ? t : [], s = [];
  for (let h = 0; h < c.length; h++) {
    const A = c[h] || {}, w = qi(A[f]);
    w !== null && s.push({
      record: A,
      sourceIndex: h,
      label: A[a] == null ? String(h + 1) : String(A[a]),
      value: w
    });
  }
  if (s.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: i.y + i.height - l
    };
  let n = s[0].value, d = s[0].value;
  for (let h = 1; h < s.length; h++)
    s[h].value < n && (n = s[h].value), s[h].value > d && (d = s[h].value);
  let _ = n, r = d;
  p && (_ = Math.min(0, _), r = Math.max(0, r)), _ === r && (r === 0 ? r = 1 : r > 0 ? _ = 0 : r = 0);
  const v = Math.max(1, i.width - l * 2), y = Math.max(1, i.height - l * 2), m = r - _, u = i.y + i.height - l - (0 - _) / m * y, o = [];
  for (let h = 0; h < s.length; h++) {
    const A = s[h], w = s.length === 1 ? 0.5 : h / (s.length - 1), E = i.x + l + w * v, S = i.y + i.height - l - (A.value - _) / m * y;
    o.push({
      record: A.record,
      sourceIndex: A.sourceIndex,
      label: A.label,
      value: A.value,
      x: E,
      y: S,
      pointString: Ht(E) + "," + Ht(S)
    });
  }
  const b = o.map((h) => h.pointString).join(" ");
  let g = "";
  if (o.length > 0) {
    const h = o[0], A = o[o.length - 1], w = Ht(h.x) + "," + Ht(u), E = Ht(A.x) + "," + Ht(u);
    g = w + " " + b + " " + E;
  }
  return {
    points: o,
    linePoints: b,
    areaPoints: g,
    count: o.length,
    min: n,
    max: d,
    domainMin: _,
    domainMax: r,
    baselineY: u
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function a(n) {
    const d = n[e];
    d && d.requestData();
  }
  function f(n) {
    const d = n[e];
    d && d._render();
  }
  const p = {
    "data-ln-chart": { prop: "name", type: "string", read: j, fallback: "", effect: f, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: a, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: a, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: f, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: f, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: f, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: f, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: f, description: "Forces Y axis scale to start at zero" }
  }, l = X(p);
  function c(n, d) {
    n && (n.textContent = d);
  }
  function s(n) {
    this.dom = n, Y(this, n, l), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const d = this;
    return this._onSetData = function(_) {
      const r = _.detail || {};
      d._data = Array.isArray(r.data) ? r.data : [], d.isLoaded = !0, d._setLoading(!1), d._render();
    }, this._onSetLoading = function(_) {
      d._setLoading(!!(_.detail && _.detail.loading));
    }, this._onRefresh = function() {
      d.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  s.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), d = n === null ? NaN : Number(n), _ = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(d) && d >= 0 ? d : 16,
      type: _ === "area" || _ === "polygon" ? "area" : "line",
      viewBox: this.plot && Ao(this.plot.getAttribute("viewBox")) || i
    };
  }, s.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, s.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const d = this.name + "-label", _ = '[data-ln-template="' + d + '"]';
    if (!this.dom.querySelector(_) && !document.querySelector(_)) return;
    const r = Lt(this.dom, d, "ln-chart");
    if (!r) return;
    const v = J(this.dom);
    for (const y of n.points) {
      const m = r.cloneNode(!0);
      ee(m, {
        label: y.label,
        value: ot(y.value, v)
      }), this.labels.appendChild(m);
    }
  }, s.prototype._render = function() {
    const n = this._readOptions(), d = Co(this._data, n);
    this.model = d, this.line && (this.line.setAttribute("points", d.linePoints), this.line.toggleAttribute("hidden", d.count === 0)), this.area && (this.area.setAttribute("points", d.areaPoints), this.area.toggleAttribute("hidden", d.count === 0 || n.type !== "area"));
    const _ = d.count === 0;
    this.dom.classList.toggle("ln-chart--empty", _), this.empty && this.empty.toggleAttribute("hidden", !_);
    const r = J(this.dom);
    c(this.minimum, ot(d.min, r)), c(this.maximum, ot(d.max, r)), c(this.count, ot(d.count, r)), this._renderLabels(d), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: d.count,
      min: d.min,
      max: d.max
    });
  }, s.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: So(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, H(t, e, s, "ln-chart", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-options": { prop: "_storeName", type: "string", read: j, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: j, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: j, fallback: "name", description: "Field name used for option visible label text" }
  }, a = X(i);
  function f(p) {
    this.dom = p, Y(this, p, a);
    const l = this;
    return this._onSetData = function(c) {
      c.detail && l._rebuild(c.detail.data || []);
    }, p.addEventListener("ln-options:set-data", this._onSetData), L(p, "ln-options:request-data", { options: this._storeName }), this;
  }
  f.prototype._rebuild = function(p) {
    const l = this.dom, c = this._valueField, s = this._labelField, n = l.getAttribute("data-ln-value") || l.value, d = l.querySelectorAll("option");
    for (let r = d.length - 1; r >= 0; r--)
      d[r].value !== "" && l.removeChild(d[r]);
    for (let r = 0; r < p.length; r++) {
      const v = p[r], y = document.createElement("option");
      y.value = String(v[c]), y.textContent = v[s] != null ? v[s] : "", l.appendChild(y);
    }
    const _ = l.options;
    for (let r = 0; r < _.length; r++)
      if (_[r].value === String(n)) {
        l.value = String(n);
        break;
      }
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, H(t, e, f, "ln-options", {
    attributes: i
  });
})();
function To(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), a = t.slice(e + 1).trim();
  if (!i) return null;
  const f = {};
  return f[i] = [a], f;
}
function ko(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: j, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: j, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, a = X(i);
  function f(p) {
    return this.dom = p, Y(this, p, a), this._onSetCount = function(l) {
      p.textContent = ko(l.detail && l.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), L(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: To(this._filterRaw)
    }), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, H(t, e, f, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", a = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  let p = null;
  const l = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), c = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), s = "lni:", n = "lni:v", d = "1";
  function _() {
    try {
      if (localStorage.getItem(n) !== d) {
        for (let b = localStorage.length - 1; b >= 0; b--) {
          const g = localStorage.key(b);
          g && g.indexOf(s) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(n, d);
      }
    } catch {
    }
  }
  _();
  function r() {
    return p || (p = document.getElementById(t), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = t, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function v(b) {
    return b.indexOf(i) === 0 ? c + "/" + b.slice(i.length) + ".svg" : l + "/" + b.slice(e.length) + ".svg";
  }
  function y(b, g) {
    const h = g.match(/viewBox="([^"]+)"/), A = h ? h[1] : "0 0 24 24", w = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), E = w ? w[1].trim() : "", S = g.match(/<svg([^>]*)>/i), C = S ? S[1] : "", k = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    k.id = b, k.setAttribute("viewBox", A), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const D = C.match(new RegExp(x + '="([^"]*)"'));
      D && k.setAttribute(x, D[1]);
    }), k.innerHTML = E, r().querySelector("defs").appendChild(k);
  }
  function m(b) {
    if (a.has(b) || f.has(b)) return;
    if (b.indexOf(i) === 0 && !c) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", b);
      return;
    }
    const g = b.slice(1);
    try {
      const A = localStorage.getItem(s + g);
      if (A) {
        y(g, A), a.add(b);
        return;
      }
    } catch {
    }
    f.add(b);
    const h = v(b);
    fetch(h).then(function(A) {
      if (!A.ok) throw new Error(A.status);
      return A.text();
    }).then(function(A) {
      y(g, A), a.add(b), f.delete(b);
      try {
        localStorage.setItem(s + g, A);
      } catch {
      }
    }).catch(function(A) {
      console.error("[ln-icon] Fetch failed for:", g, A), f.delete(b);
    });
  }
  function u(b) {
    const g = 'use[href^="' + e + '"], use[href^="' + i + '"]', h = b.querySelectorAll ? b.querySelectorAll(g) : [];
    if (b.matches && b.matches(g)) {
      const A = b.getAttribute("href");
      A && m(A);
    }
    Array.prototype.forEach.call(h, function(A) {
      const w = A.getAttribute("href");
      w && m(w);
    });
  }
  function o() {
    u(document), ut(function() {
      ne({
        onInit: function(b) {
          u(b);
        }
      }), Ft(["href"], function(b) {
        if ((b.tagName ? b.tagName.toLowerCase() : "") === "use") {
          const h = b.getAttribute("href");
          h && (h.indexOf(e) === 0 || h.indexOf(i) === 0) && m(h);
        }
      });
    }, "ln-icon");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
const Je = /* @__PURE__ */ new Set([
  "data-ln-accordion",
  "data-ln-ajax",
  "data-ln-api-base-url",
  "data-ln-api-connector",
  "data-ln-api-connector-query-debounce",
  "data-ln-api-endpoint",
  "data-ln-api-headers",
  "data-ln-api-param-limit",
  "data-ln-api-param-offset",
  "data-ln-api-param-search",
  "data-ln-api-param-sort-dir",
  "data-ln-api-param-sort-field",
  "data-ln-api-path",
  "data-ln-api-queue",
  "data-ln-api-queue-online",
  "data-ln-attr",
  "data-ln-autoresize",
  "data-ln-autosave",
  "data-ln-autosave-clear",
  "data-ln-autosave-debounce-input",
  "data-ln-autosave-exclude",
  "data-ln-chart",
  "data-ln-chart-area",
  "data-ln-chart-count",
  "data-ln-chart-empty",
  "data-ln-chart-labels",
  "data-ln-chart-line",
  "data-ln-chart-max",
  "data-ln-chart-min",
  "data-ln-chart-padding",
  "data-ln-chart-plot",
  "data-ln-chart-sort",
  "data-ln-chart-source",
  "data-ln-chart-type",
  "data-ln-chart-x",
  "data-ln-chart-y",
  "data-ln-chart-zero",
  "data-ln-circular-progress",
  "data-ln-circular-progress-label",
  "data-ln-circular-progress-max",
  "data-ln-class",
  "data-ln-col",
  "data-ln-confirm",
  "data-ln-confirm-active",
  "data-ln-confirm-announcer",
  "data-ln-confirm-idle",
  "data-ln-confirm-state",
  "data-ln-confirm-timeout",
  "data-ln-connector",
  "data-ln-couchdb-auth",
  "data-ln-couchdb-connector",
  "data-ln-couchdb-db",
  "data-ln-couchdb-headers",
  "data-ln-couchdb-url",
  "data-ln-data-coordinator",
  "data-ln-data-coordinator-connector",
  "data-ln-data-coordinator-filters",
  "data-ln-data-coordinator-mapper",
  "data-ln-data-coordinator-no-autosync",
  "data-ln-data-coordinator-scope",
  "data-ln-data-coordinator-search",
  "data-ln-data-coordinator-sort-direction",
  "data-ln-data-coordinator-sort-field",
  "data-ln-data-coordinator-stale",
  "data-ln-data-store",
  "data-ln-data-store-frozen",
  "data-ln-data-store-indexes",
  "data-ln-data-store-no-autosync",
  "data-ln-data-store-no-local-query",
  "data-ln-data-store-search-fields",
  "data-ln-data-store-stale",
  "data-ln-data-store-window",
  "data-ln-data-store-window-page",
  "data-ln-date",
  "data-ln-date-dict",
  "data-ln-date-dict-key",
  "data-ln-date-field",
  "data-ln-date-format",
  "data-ln-date-label",
  "data-ln-date-locale",
  "data-ln-debug",
  "data-ln-dropdown",
  "data-ln-dropdown-menu",
  "data-ln-dropdown-placement",
  "data-ln-dropdown-position",
  "data-ln-editor",
  "data-ln-editor-action",
  "data-ln-editor-source",
  "data-ln-empty",
  "data-ln-empty-state",
  "data-ln-empty-when",
  "data-ln-error",
  "data-ln-external-link",
  "data-ln-field",
  "data-ln-fill-as",
  "data-ln-fill-form",
  "data-ln-fill-id",
  "data-ln-fillable",
  "data-ln-filter",
  "data-ln-filter-col",
  "data-ln-filter-hide",
  "data-ln-filter-key",
  "data-ln-filter-options",
  "data-ln-filter-reset",
  "data-ln-filter-search",
  "data-ln-filter-target",
  "data-ln-filter-value",
  "data-ln-filter-values",
  "data-ln-form",
  "data-ln-form-action-edit",
  "data-ln-form-action-method",
  "data-ln-hash",
  "data-ln-include",
  "data-ln-initial-value",
  "data-ln-item",
  "data-ln-item-action",
  "data-ln-item-id",
  "data-ln-item-select",
  "data-ln-key",
  "data-ln-key-allow-input",
  "data-ln-key-for",
  "data-ln-key-modifier",
  "data-ln-key-target",
  "data-ln-link",
  "data-ln-list",
  "data-ln-list-body",
  "data-ln-list-count",
  "data-ln-list-empty",
  "data-ln-list-field",
  "data-ln-list-filtered",
  "data-ln-list-select-all",
  "data-ln-list-selectable",
  "data-ln-list-selected",
  "data-ln-list-source",
  "data-ln-list-total",
  "data-ln-list-window",
  "data-ln-list-window-page",
  "data-ln-list-window-threshold",
  "data-ln-modal",
  "data-ln-modal-close",
  "data-ln-modal-for",
  "data-ln-modal-mode",
  "data-ln-modal-when",
  "data-ln-nav",
  "data-ln-nav-exact",
  "data-ln-number",
  "data-ln-number-decimals",
  "data-ln-number-max",
  "data-ln-number-min",
  "data-ln-obfuscator",
  "data-ln-obfuscator-codec",
  "data-ln-obfuscator-key",
  "data-ln-options",
  "data-ln-options-label",
  "data-ln-options-value",
  "data-ln-outlet",
  "data-ln-panel",
  "data-ln-persist",
  "data-ln-persist-scope",
  "data-ln-picklist",
  "data-ln-picklist-list",
  "data-ln-picklist-max",
  "data-ln-popover",
  "data-ln-popover-for",
  "data-ln-popover-placement",
  "data-ln-popover-position",
  "data-ln-progress",
  "data-ln-progress-max",
  "data-ln-query",
  "data-ln-render-key",
  "data-ln-route",
  "data-ln-route-keep",
  "data-ln-route-target",
  "data-ln-route-title",
  "data-ln-router-base",
  "data-ln-router-hydrate",
  "data-ln-scroll",
  "data-ln-scroll-behavior",
  "data-ln-scroll-block",
  "data-ln-scroll-delay",
  "data-ln-scroll-focus",
  "data-ln-scroll-set",
  "data-ln-scroll-update-hash",
  "data-ln-search",
  "data-ln-search-clear",
  "data-ln-search-clear-for",
  "data-ln-search-exclude",
  "data-ln-search-fields",
  "data-ln-search-for",
  "data-ln-search-hide",
  "data-ln-search-items",
  "data-ln-show",
  "data-ln-slug-from",
  "data-ln-sort",
  "data-ln-sort-dir",
  "data-ln-sort-exclude",
  "data-ln-sort-field",
  "data-ln-sort-icon",
  "data-ln-sort-items",
  "data-ln-sort-state",
  "data-ln-sortable",
  "data-ln-sortable-handle",
  "data-ln-stat",
  "data-ln-stat-card",
  "data-ln-stat-filter",
  "data-ln-stat-label",
  "data-ln-stat-trend",
  "data-ln-stat-value",
  "data-ln-step",
  "data-ln-step-label",
  "data-ln-stepper",
  "data-ln-store",
  "data-ln-tab",
  "data-ln-table",
  "data-ln-table-body",
  "data-ln-table-cell-attr",
  "data-ln-table-clear",
  "data-ln-table-clear-all",
  "data-ln-table-col",
  "data-ln-table-col-filter",
  "data-ln-table-col-select",
  "data-ln-table-col-sort",
  "data-ln-table-coordinator",
  "data-ln-table-count",
  "data-ln-table-dict",
  "data-ln-table-empty",
  "data-ln-table-empty-when",
  "data-ln-table-filter-col",
  "data-ln-table-filtered",
  "data-ln-table-row",
  "data-ln-table-row-action",
  "data-ln-table-row-id",
  "data-ln-table-row-select",
  "data-ln-table-select-all-label",
  "data-ln-table-selectable",
  "data-ln-table-selected",
  "data-ln-table-sort",
  "data-ln-table-source",
  "data-ln-table-total",
  "data-ln-table-window",
  "data-ln-table-window-page",
  "data-ln-table-window-threshold",
  "data-ln-tabs",
  "data-ln-tabs-active",
  "data-ln-tabs-default",
  "data-ln-tabs-focus",
  "data-ln-tabs-key",
  "data-ln-template",
  "data-ln-time",
  "data-ln-time-locale",
  "data-ln-toast",
  "data-ln-toast-close",
  "data-ln-toast-item",
  "data-ln-toast-max",
  "data-ln-toast-timeout",
  "data-ln-toast-when",
  "data-ln-toggle",
  "data-ln-toggle-action",
  "data-ln-toggle-for",
  "data-ln-tooltip",
  "data-ln-tooltip-enhance",
  "data-ln-tooltip-enhanced",
  "data-ln-tooltip-placement",
  "data-ln-tooltip-position",
  "data-ln-translatable",
  "data-ln-translatable-lang",
  "data-ln-translations",
  "data-ln-translations-active",
  "data-ln-translations-add",
  "data-ln-translations-default",
  "data-ln-translations-lang",
  "data-ln-translations-locales",
  "data-ln-translations-placeholder",
  "data-ln-translations-prefix",
  "data-ln-translations-remove-label",
  "data-ln-ui-coordinator",
  "data-ln-upload",
  "data-ln-upload-accept",
  "data-ln-upload-action",
  "data-ln-upload-delete",
  "data-ln-upload-dict",
  "data-ln-upload-ext",
  "data-ln-upload-file-field",
  "data-ln-upload-id",
  "data-ln-upload-ids-field",
  "data-ln-upload-item",
  "data-ln-upload-list",
  "data-ln-upload-local-id",
  "data-ln-upload-max-files",
  "data-ln-upload-max-size",
  "data-ln-upload-progress",
  "data-ln-upload-size",
  "data-ln-upload-state",
  "data-ln-upload-zone",
  "data-ln-validate",
  "data-ln-validate-error",
  "data-ln-validate-errors",
  "data-ln-value",
  "data-ln-websocket-connector",
  "data-ln-websocket-connector-url"
]);
function Lo(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let a = 0; a <= e.length; a++) i[a] = [a];
  for (let a = 0; a <= t.length; a++) i[0][a] = a;
  for (let a = 1; a <= e.length; a++)
    for (let f = 1; f <= t.length; f++)
      e.charAt(a - 1) === t.charAt(f - 1) ? i[a][f] = i[a - 1][f - 1] : i[a][f] = Math.min(
        i[a - 1][f - 1] + 1,
        i[a][f - 1] + 1,
        i[a - 1][f] + 1
      );
  return i[e.length][t.length];
}
function qo(t, e = Je) {
  if (e.has(t)) return null;
  let i = null, a = 1 / 0;
  for (const p of e) {
    const l = Lo(t, p);
    l < a && (a = l, i = p);
  }
  const f = Math.max(3, Math.floor(t.length * 0.4));
  return a <= f ? i : null;
}
function xi(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function xo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], f = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && s.name.endsWith("-for")) {
          const n = (s.value || "").trim();
          if (!n) {
            a.push({
              type: "id-empty",
              element: l,
              attribute: s.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${l.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + xi(n)) || a.push({
            type: "id-unresolved",
            element: l,
            attribute: s.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${l.tagName.toLowerCase()} ${s.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function Io(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], f = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && (s.name.endsWith("-source") || s.name.endsWith("-store")) && s.name !== "data-ln-data-store") {
          const d = (s.value || "").trim();
          if (!d) {
            a.push({
              type: "store-empty",
              element: l,
              attribute: s.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          const _ = xi(d), r = e.querySelector(`[data-ln-data-store="${_}"], [data-ln-store="${_}"]`), v = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(d);
          !r && !v && a.push({
            type: "store-unresolved",
            element: l,
            attribute: s.name,
            storeName: d,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${s.name}="${d}"> targets store "${d}", but no [data-ln-data-store="${d}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function Ro(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], a = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && a.unshift(e);
  const f = /* @__PURE__ */ new Map();
  for (let p = 0; p < a.length; p++) {
    const l = a[p], c = (l.getAttribute("data-ln-data-store") || "").trim();
    c && (f.has(c) || f.set(c, []), f.get(c).push(l));
  }
  for (const [p, l] of f.entries())
    l.length > 1 && i.push({
      type: "store-duplicate",
      storeName: p,
      elements: l,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${p}". Store names must be unique across the document.`
    });
  return i;
}
function Do(t = document, e = Je) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], f = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && !e.has(s.name)) {
          const n = qo(s.name, e), d = n ? ` Did you mean "${n}"?` : "";
          a.push({
            type: "attribute-unknown",
            element: l,
            attribute: s.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${s.name}" on <${l.tagName.toLowerCase()}>.${d}`
          });
        }
      }
  }
  return a;
}
function Ne(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Je, a = xo(t), f = Io(t), p = Ro(t), l = Do(t, i), c = [
    ...a,
    ...f,
    ...p,
    ...l
  ];
  if (!e.silent)
    for (let s = 0; s < c.length; s++)
      console.warn(c[s].message);
  return {
    idIssues: a,
    storeIssues: f,
    uniquenessIssues: p,
    spellingIssues: l,
    total: c.length
  };
}
let Gt = null;
function ae(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Gt && (clearTimeout(Gt), Gt = null);
  function a() {
    Gt = setTimeout(() => {
      Gt = null;
      const f = Ne(t);
      i && i(f);
    }, e);
  }
  Bn() > 0 ? dt(a) : a();
}
function Oo(t, e, i, a) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", a), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let Nt = [];
function No() {
  Nt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Nt.push(document.body);
}
function Ii(t) {
  if (t === window || t === document)
    return Nt.indexOf(document.body) !== -1;
  for (let e = 0; e < Nt.length; e++)
    if (Nt[e].contains(t)) return !0;
  return !1;
}
function Mo(t, e, i, a) {
  Ii(i) && Oo(t, e, i, a);
}
function Me() {
  No(), Gi(Nt.length > 0 ? Mo : null, Nt.length > 0 ? Ii : null);
}
function Sn() {
  Me();
}
function Fo() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, ut(function() {
    Me(), Ft(["data-ln-debug"], Me);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Fo();
  function a(p) {
    return this.dom = p, ae(p.ownerDocument || document), Sn(), this;
  }
  a.prototype.verify = function(p, l) {
    return Ne(p || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, a.prototype.destroy = function() {
    delete this.dom[e], Sn();
  };
  const f = H(t, e, a, "ln-debug", {
    attributes: i,
    onInit: function(p) {
      typeof document < "u" && ae(p && p.ownerDocument ? p.ownerDocument : document);
    },
    onSubtreeChange: function(p) {
      typeof document < "u" && ae(p && p.ownerDocument ? p.ownerDocument : document);
    }
  });
  f.verify = function(p, l) {
    return Ne(p || document, l);
  }, f.schedule = function(p, l, c) {
    return ae(p || document, l, c);
  };
})();
