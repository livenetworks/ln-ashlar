function Be() {
  if (typeof window > "u") return !1;
  if (window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink) return !0;
  if (typeof document < "u") {
    if (document.documentElement && document.documentElement.hasAttribute("data-ln-debug")) return !0;
    if (document.body)
      return document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null;
  }
  return !1;
}
function Ue(t) {
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
      let c = null;
      for (let h = 1; h < e.length; h++)
        if (e[h] && e[h].nodeType === 1) {
          c = e[h];
          break;
        }
      if (!Ue(c))
        return;
    }
    t.apply(console, e);
  };
}
function Wi(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function $i(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function k(t, e, o) {
  const c = o || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, c), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: c
  }));
}
function G(t, e, o) {
  const c = o || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, c);
  const h = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: c
  });
  return t.dispatchEvent(h), h;
}
function kn(t, e, o) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const c = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  c[o] = t.name, k(t.dom, e, c);
}
function ft(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ft(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function $t(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function He(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Gi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function ze(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Qi(t, e) {
  return !t || !document.contains(t) || ze(t) || e && typeof t[e] != "function" ? !1 : $t(t);
}
function Ln(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const o = e.getAttribute("href");
  return !(!o || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || o.startsWith("mailto:") || o.startsWith("tel:") || o === "#" || o.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function At(t) {
  return t.hasAttribute("value") ? t.getAttribute("value") : t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.textContent.trim();
}
function qn(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Ke(t, e) {
  const o = !!(e && e.typed), c = e && e.exclude, h = {}, g = t.elements, l = {};
  if (o)
    for (let u = 0; u < g.length; u++) {
      const a = g[u];
      a.name && a.type === "checkbox" && !a.disabled && (l[a.name] = (l[a.name] || 0) + 1);
    }
  for (let u = 0; u < g.length; u++) {
    const a = g[u];
    if (!(!a.name || a.disabled || a.type === "file" || a.type === "submit" || a.type === "button") && !(c && a.matches && a.matches(c)))
      if (a.type === "checkbox")
        o && l[a.name] === 1 ? h[a.name] = a.checked : (h[a.name] || (h[a.name] = []), a.checked && h[a.name].push(a.value));
      else if (a.type === "radio")
        a.checked && (h[a.name] = a.value);
      else if (a.type === "select-multiple") {
        h[a.name] = [];
        for (let n = 0; n < a.options.length; n++)
          a.options[n].selected && h[a.name].push(a.options[n].value);
      } else if (o && a.type === "hidden")
        h[a.name] = a.value;
      else if (o && (a.type === "number" || a.type === "range")) {
        const n = Number(a.value);
        h[a.name] = a.value === "" || isNaN(n) ? null : n;
      } else
        h[a.name] = a.value;
  }
  return h;
}
function Xi(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function je(t, e) {
  const o = t.elements, c = [], h = {};
  for (let g = 0; g < o.length; g++) {
    const l = o[g];
    l.name && l.type === "checkbox" && (h[l.name] = (h[l.name] || 0) + 1);
  }
  for (let g = 0; g < o.length; g++) {
    const l = o[g];
    if (l.type === "file" || l.type === "submit" || l.type === "button") continue;
    const u = l.getAttribute("data-ln-fill-as") || l.name;
    if (!u || !(u in e)) continue;
    const a = e[u];
    if (l.type === "checkbox") {
      if (Array.isArray(a))
        l.checked = a.indexOf(l.value) !== -1;
      else if (h[l.name] > 1) {
        const n = String(a).split(",").map(function(s) {
          return s.trim();
        });
        l.checked = n.indexOf(l.value) !== -1;
      } else
        l.checked = Xi(a);
      c.push(l);
    } else if (l.type === "radio")
      l.checked = l.value === String(a), c.push(l);
    else if (l.type === "select-multiple") {
      if (Array.isArray(a))
        for (let n = 0; n < l.options.length; n++)
          l.options[n].selected = a.indexOf(l.options[n].value) !== -1;
      c.push(l);
    } else
      l.value = a, l.tagName === "SELECT" && a != null && l.setAttribute("data-ln-value", a), c.push(l);
  }
  return c;
}
function Ve(t, e, { get: o, set: c }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return o ? o.call(this) : e.get.call(this);
    },
    set: function(h) {
      c ? c.call(this, h, (g) => e.set.call(this, g)) : e.set.call(this, h);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = je, window.lnCore.serializeForm = Ke, window.lnCore.resolveFormMethod = qn);
function Tt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, o) => o === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function jt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function xn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (o) {
    return console.error(`[${e}] Invalid headers JSON:`, o), {};
  }
}
const In = {};
function Yi(t, e) {
  In[t] = e;
}
function Ji(t) {
  return In[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Yi, window.lnCore.getDataMapper = Ji);
function Z(t) {
  const e = t ? t.closest("[lang]") : null, o = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return o ? o.trim() : "en-US";
}
function he() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, ft(function() {
    new MutationObserver(function() {
      k(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const Rn = {};
function Dn(t, e) {
  if (!t || typeof e != "object") return;
  const o = t.toLowerCase().split("-")[0];
  Rn[o] = e;
}
function Dt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return Rn[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = Dn, window.lnCore.getLocaleFallback = Dt, window.lnCore.ensureLocaleObserver = he);
const _e = {};
function le(t, e) {
  _e[t] || (_e[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const o = _e[t];
  return o ? o.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function st(t, e, o) {
  if (t) {
    const c = t.querySelector('[data-ln-template="' + e + '"]');
    if (c) return c.content.cloneNode(!0);
  }
  return le(e, o);
}
function mt(t, e) {
  if (!t || !e) return t;
  const o = t.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < o.length; l++) {
    const u = o[l], a = u.getAttribute("data-ln-field");
    e[a] != null && (u.textContent = e[a]);
  }
  const c = t.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < c.length; l++) {
    const u = c[l], a = u.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < a.length; n++) {
      const s = a[n].trim().split(":");
      if (s.length !== 2) continue;
      const r = s[0].trim(), i = s[1].trim();
      e[i] != null && u.setAttribute(r, e[i]);
    }
  }
  const h = t.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < h.length; l++) {
    const u = h[l], a = u.getAttribute("data-ln-show");
    a in e && u.classList.toggle("hidden", !e[a]);
  }
  const g = t.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < g.length; l++) {
    const u = g[l], a = u.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < a.length; n++) {
      const s = a[n].trim().split(":");
      if (s.length !== 2) continue;
      const r = s[0].trim(), i = s[1].trim();
      i in e && u.classList.toggle(r, !!e[i]);
    }
  }
  return t;
}
function Zi(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const o = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let c = 0; c < o.length; c++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", o[c], e ?? null), o[c].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      mt(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let o = 0; o < e.length; o++)
        e[o].textContent = "";
    }
})));
function Zt(t, e) {
  if (!t || !e) return t;
  const o = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; o.nextNode(); ) {
    const g = o.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, u) {
        return e[u] !== void 0 ? e[u] : "";
      }
    ));
  }
  const c = function(g, l) {
    return e[l] !== void 0 ? e[l] : "";
  }, h = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && h.push(t);
  for (let g = 0; g < h.length; g++) {
    const l = h[g], u = l.attributes;
    for (let a = 0; a < u.length; a++) {
      const n = u[a];
      n.value.indexOf("{{") !== -1 && l.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, c));
    }
  }
  return t;
}
function tr(t, e, o, c, h, g) {
  const l = {};
  for (let a = 0; a < t.children.length; a++) {
    const n = t.children[a], s = n.getAttribute("data-ln-render-key");
    s && (l[s] = n);
  }
  const u = document.createDocumentFragment();
  for (let a = 0; a < e.length; a++) {
    const n = e[a], s = String(c(n));
    let r = l[s];
    if (r)
      h(r, n, a);
    else {
      const i = le(o, g);
      if (!i || (Zt(i, n), r = i.firstElementChild, !r)) continue;
      r.setAttribute("data-ln-render-key", s), h(r, n, a);
    }
    u.appendChild(r);
  }
  t.textContent = "", t.appendChild(u);
}
function On(t, e) {
  const o = {}, c = t.querySelectorAll("[" + e + "]");
  for (let h = 0; h < c.length; h++)
    o[c[h].getAttribute(e)] = c[h].textContent, c[h].remove();
  return o;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Zt, window.lnCore.fill = mt, window.lnCore.lnFill = Zi, window.lnCore.renderList = tr);
function j(t, e, o) {
  const c = t.getAttribute(e);
  return c === null ? o : c;
}
function qt(t, e, o) {
  const c = parseInt(t.getAttribute(e), 10);
  return isNaN(c) ? o : c;
}
function xt(t, e, o = !1) {
  const c = t.getAttribute(e);
  if (c === null) return !!o;
  const h = c.trim().toLowerCase();
  return !(h === "false" || h === "0");
}
function We(t, e) {
  return (t.getAttribute(e) || "").split(",").map((o) => o.trim()).filter(Boolean);
}
const be = /* @__PURE__ */ new Map();
function Nn(t, e) {
  const o = (t ? t.join("|") : "") + "::" + e;
  if (be.has(o)) return be.get(o);
  const c = new Set(t || []), h = function(g, l) {
    const u = g.getAttribute(l);
    return u !== null && c.has(u) ? u : e;
  };
  return be.set(o, h), h;
}
function Mn(t, e, o) {
  const c = parseFloat(t.getAttribute(e));
  return isNaN(c) ? o : c;
}
function Pn(t, e, o) {
  const c = t.getAttribute(e);
  if (!c) return o;
  try {
    return JSON.parse(c);
  } catch {
    return o;
  }
}
function Fn(t, e, o, c, h) {
  if (!t || e === null) return !0;
  const g = c || "ln-component", l = t.type;
  if (l === "trigger" || l === "marker" || l === "string" || l === "list" || !l || e === "" && t.fallback !== void 0)
    return !0;
  const u = (a) => {
    h ? console.warn(a, h) : console.warn(a);
  };
  if (l === "boolean") {
    const a = e.trim().toLowerCase();
    return a !== "" && a !== "true" && a !== "false" && a !== "1" && a !== "0" ? (u(`[${g}] Invalid value "${e}" for boolean attribute "${o}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (l === "enum") {
    const a = t.values || [];
    return a.includes(e) ? !0 : (u(`[${g}] Invalid value "${e}" for attribute "${o}". Allowed: ${a.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (l === "integer") {
    if (!/^-?\d+$/.test(e))
      return u(`[${g}] Invalid integer "${e}" for attribute "${o}". Fallback: ${t.fallback}.`), !1;
    const a = parseInt(e, 10);
    return t.min !== void 0 && a < t.min ? (u(`[${g}] Value ${a} for attribute "${o}" is less than min (${t.min}).`), !1) : t.max !== void 0 && a > t.max ? (u(`[${g}] Value ${a} for attribute "${o}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (l === "float")
    return isNaN(Number(e)) ? (u(`[${g}] Invalid float "${e}" for attribute "${o}". Fallback: ${t.fallback}.`), !1) : !0;
  if (l === "json")
    try {
      return JSON.parse(e), !0;
    } catch (a) {
      return u(`[${g}] Invalid JSON for attribute "${o}": ${a.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function X(t, e, o) {
  for (const c in o) {
    const [h, g, l] = o[c];
    Object.defineProperty(t, c, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return h(e, g, l);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function Y(t) {
  const e = {};
  for (const o in t) {
    const c = t[o];
    if (!c || !c.prop) continue;
    let h = c.read;
    if (!h && c.type)
      switch (c.type) {
        case "enum":
          h = Nn(c.values, c.fallback);
          break;
        case "integer":
          h = qt;
          break;
        case "float":
          h = Mn;
          break;
        case "boolean":
          h = xt;
          break;
        case "list":
          h = We;
          break;
        case "json":
          h = Pn;
          break;
        case "string":
        default:
          h = j;
          break;
      }
    h || (h = j), e[c.prop] = [h, o, c.fallback];
  }
  return e;
}
function er(t) {
  const e = {};
  for (const o in t) {
    const c = t[o];
    c && c.effect && (e[o] = c.effect);
  }
  return Object.keys(e).length ? e : null;
}
function nr(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const o in t.effects) e.add(o);
  if (t.onAttrChange && t.declared) for (const o of t.declared) e.add(o);
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = X, window.lnCore.attrSpec = Y, window.lnCore.attrStr = j, window.lnCore.attrInt = qt, window.lnCore.attrBool = xt, window.lnCore.attrList = We, window.lnCore.attrEnum = Nn, window.lnCore.attrFloat = Mn, window.lnCore.attrJson = Pn);
function ce(t, e) {
  if (!t[e.attribute]) {
    window.lnCore._persistSink && t.hasAttribute && t.hasAttribute("data-ln-persist") && window.lnCore._persistSink(t, e.selector);
    try {
      t[e.attribute] = new e.ComponentFn(t);
    } catch (o) {
      console.error("[" + e.attribute + "] init failed", t, o);
    }
  }
}
function Bn(t, e, o, c) {
  if (t.nodeType !== 1) return;
  const g = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", l = { selector: e, attribute: o, ComponentFn: c };
  if (t.matches && t.matches(g) && ce(t, l), t.querySelectorAll) {
    const u = t.querySelectorAll(g);
    for (let a = 0; a < u.length; a++)
      ce(u[a], l);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function ir() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function ye() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function Un() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function ut(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function Hn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function zn(t) {
  const e = Hn(), o = t.observed || [];
  for (let c = 0; c < o.length; c++) {
    const h = o[c];
    e.byAttr.has(h) || e.byAttr.set(h, []), e.byAttr.get(h).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const c in t.attributes) {
      e.byDeclaredAttr.has(c) || e.byDeclaredAttr.set(c, []);
      const h = e.byDeclaredAttr.get(c);
      h.some((g) => g.componentTag === t.componentTag) || h.push({
        spec: t.attributes[c],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const c = nr(t);
    if (c === null)
      e.reactiveWildcard.push(t);
    else
      for (const h of c)
        e.byReactive.has(h) || e.byReactive.set(h, []), e.byReactive.get(h).push(t);
  }
  t.persist && e.persist.push(t);
}
function rn(t, e, o, c) {
  for (let h = 0; h < t.length; h++) {
    const g = t[h];
    if (!e[g.attribute]) continue;
    const l = g.effects && g.effects[o];
    l ? l(e, o, c) : g.onAttrChange && (!g.declared || g.declared.has(o)) && g.onAttrChange(e, o, c);
  }
}
function rr(t) {
  const e = t.attributeName, o = e.indexOf("data-ln-") === 0, c = Hn(), h = c.byAttr.get(e), g = Be() && c.byDeclaredAttr && c.byDeclaredAttr.has(e);
  if (!o && !h && !g)
    return;
  const l = t.target;
  if (t.oldValue !== l.getAttribute(e)) {
    if (g && Ue(l)) {
      const u = c.byDeclaredAttr.get(e), a = l.getAttribute(e);
      for (let n = 0; n < u.length; n++)
        Fn(u[n].spec, a, e, u[n].componentTag, l);
    }
    if (window.lnCore._debugSink && (o || h) && window.lnCore._debugSink("attr", e, l, { oldValue: t.oldValue, newValue: l.getAttribute(e) }), o) {
      const u = c.byReactive.get(e);
      u && rn(u, l, e, t.oldValue), c.reactiveWildcard.length && rn(c.reactiveWildcard, l, e, t.oldValue);
    }
    if (h)
      for (let u = 0; u < h.length; u++) {
        const a = h[u];
        if (a.handler) {
          a.handler(l, e, t.oldValue);
          continue;
        }
        a.onAttributeChange && l[a.attribute] ? a.onAttributeChange(l, e) : (Bn(l, a.selector, a.attribute, a.ComponentFn), a.onInit && a.onInit(l));
      }
  }
}
function Kn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ft(function() {
    new MutationObserver(function(e) {
      for (let o = 0; o < e.length; o++)
        try {
          rr(e[o]);
        } catch (c) {
          console.error("[ln-core] mutation handler failed", e[o].target, c);
        }
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function $e() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Ge() {
  return window.lnCore = window.lnCore || {}, window.lnCore._subtreeRegistry = window.lnCore._subtreeRegistry || [];
}
function on(t, e) {
  if (!document.contains(t))
    if (e.attribute) {
      const o = t[e.attribute];
      if (o && typeof o.destroy == "function")
        try {
          o.destroy();
        } catch (c) {
          console.error("[" + e.attribute + "] destroy failed", t, c);
        }
      delete t[e.attribute];
    } else e.onDestroy && e.onDestroy(t);
}
function jn(t) {
  const e = $e();
  if (!e.length) return;
  const o = t.target;
  if (o) {
    const h = o.nodeType === 1 ? o : o.parentElement;
    if (h && (h.isContentEditable || h.closest && h.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const c = Ge();
  if (t.target && c.length)
    for (let h = 0; h < c.length; h++) {
      const g = c[h], l = g.query, u = t.target.nodeType === 1 ? t.target.matches && t.target.matches(l) ? t.target : t.target.closest ? t.target.closest(l) : null : t.target.parentElement && t.target.parentElement.closest ? t.target.parentElement.closest(l) : null;
      u && g.onSubtreeChange(u, t);
    }
  for (let h = 0; h < t.addedNodes.length; h++) {
    const g = t.addedNodes[h];
    if (g.nodeType !== 1) continue;
    const l = !!(g.firstElementChild || g.children && g.children.length);
    for (let u = 0; u < e.length; u++) {
      const a = e[u], n = a.query;
      if (n && (g.matches && g.matches(n) && (a.ComponentFn && ce(g, a), a.onInit && a.onInit(g)), l && g.querySelectorAll)) {
        const s = g.querySelectorAll(n);
        for (let r = 0; r < s.length; r++)
          a.ComponentFn && ce(s[r], a), a.onInit && a.onInit(s[r]);
      }
    }
  }
  for (let h = 0; h < t.removedNodes.length; h++) {
    const g = t.removedNodes[h];
    if (g.nodeType !== 1 || document.contains(g)) continue;
    const l = !!(g.firstElementChild || g.children && g.children.length);
    for (let u = 0; u < e.length; u++) {
      const a = e[u], n = a.query;
      if (n && (g.matches && g.matches(n) && on(g, a), l && g.querySelectorAll)) {
        const s = g.querySelectorAll(n);
        for (let r = 0; r < s.length; r++) on(s[r], a);
      }
    }
  }
}
function Vn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ft(function() {
    const t = new MutationObserver(function(e) {
      for (let o = 0; o < e.length; o++) {
        const c = e[o];
        if (c.type === "childList")
          try {
            jn(c);
          } catch (h) {
            console.error("[ln-core] lifecycle handler failed", c.target, h);
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
  const o = e.takeRecords();
  for (let c = 0; c < o.length; c++) {
    const h = o[c];
    if (h.type === "childList")
      try {
        jn(h);
      } catch (g) {
        console.error("[ln-core] lifecycle handler failed", h.target, g);
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
function Pt(t, e) {
  zn({ observed: t, handler: e }), Kn();
}
function te(t) {
  $e().push(t), t.onSubtreeChange && t.query && Ge().push(t), Vn();
}
function H(t, e, o, c, h = {}) {
  const g = h.extraAttributes || [], l = h.onAttributeChange || null, u = h.onSubtreeChange || null, a = h.onInit || null, n = h.onAttrChange || null, s = h.effects || null, r = h.attributes || null, i = r ? er(r) : s, m = r ? new Set(Object.keys(r)) : null, p = h.persist || null;
  function f(S) {
    const b = S || document.body;
    if (Bn(b, t, e, o), r && Be())
      for (const w in r) {
        const A = r[w], T = Array.from(b.querySelectorAll("[" + w + "]"));
        b.matches && b.matches("[" + w + "]") && T.push(b);
        for (let L = 0; L < T.length; L++) {
          const x = T[L];
          Ue(x) && Fn(A, x.getAttribute(w), w, c, x);
        }
      }
    a && a(b);
  }
  const d = [];
  if (t.indexOf("[") !== -1) {
    const S = /\[([\w-]+)/g;
    let b;
    for (; (b = S.exec(t)) !== null; )
      d.push(b[1]);
  } else
    d.push(t);
  zn({
    selector: t,
    attribute: e,
    componentTag: c,
    attributes: r,
    ComponentFn: o,
    onInit: a,
    observed: d.concat(g),
    onAttributeChange: l,
    onAttrChange: n,
    effects: i,
    declared: m,
    persist: p
  }), Kn();
  const _ = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1, y = h.subtreeQuery || (_ ? t : "[" + t + "]"), E = {
    selector: t,
    attribute: e,
    ComponentFn: o,
    onInit: a,
    onSubtreeChange: u,
    query: y
  };
  $e().push(E), u && y && Ge().push(E), Vn(), window[e] = f, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = H, window.lnCore.observeLifecycle = te, window.lnCore.withoutLifecycle = Wn);
  function v() {
    Un() > 0 ? ut(function() {
      f(document.body);
    }) : f(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", v) : v(), f;
}
function Qe(t) {
  let e = !1;
  for (let o = 0; o < t.length; o++) {
    const c = t[o];
    if (!(c === "" || c == null) && (e = !0, !Number.isFinite(Number(c))))
      return "string";
  }
  return e ? "number" : "string";
}
function Xe(t, e, o, c) {
  if (o === "number") {
    const l = parseFloat(t), u = parseFloat(e);
    return (isNaN(l) ? 0 : l) - (isNaN(u) ? 0 : u);
  }
  const h = t != null ? String(t) : "", g = e != null ? String(e) : "";
  return c ? c.compare(h, g) : h < g ? -1 : h > g ? 1 : 0;
}
function Xt(t, e) {
  let o = !1;
  return function() {
    o || (o = !0, queueMicrotask(function() {
      o = !1, t();
    }));
  };
}
function or(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, o = t.pageSize > 0 ? t.pageSize : 200, c = t.threshold != null ? t.threshold : 25, h = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const g = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, l = typeof t.onChange == "function" ? t.onChange : function() {
  }, u = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let s = 0, r = 0, i = 0, m = { sort: null, filters: {}, search: "" }, p = null, f = 0, d = 0, _ = !1;
  function y(b) {
    a.set(b, ++f);
  }
  function E() {
    return !!(m && (m.search || m.filters && Object.keys(m.filters).length));
  }
  function v() {
    if (u.size <= e) return;
    const b = Array.from(u.keys()).sort(function(A, T) {
      return (a.get(A) || 0) - (a.get(T) || 0);
    });
    let w = 0;
    for (; u.size > e && w < b.length; )
      u.delete(b[w]), a.delete(b[w]), w++;
  }
  function S(b, w) {
    n.add(b), g(m, b, w);
  }
  return {
    get: function(b) {
      return u.get(b);
    },
    has: function(b) {
      return u.has(b);
    },
    peek: function() {
      return u.size ? u.values().next().value : void 0;
    },
    get logicalTotal() {
      return s;
    },
    get grandTotal() {
      return r;
    },
    get queryGen() {
      return i;
    },
    get size() {
      return u.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(b, w) {
      clearTimeout(p), d = b;
      for (let I = b; I < w; I++)
        u.has(I) && y(I);
      if (s <= 0) return;
      const A = Math.max(0, b - c), T = Math.min(s, w + c), L = Math.floor(A / o), x = Math.floor(Math.max(0, T - 1) / o);
      let D = -1;
      for (let I = L; I <= x; I++) {
        const O = I * o, P = Math.min(o, s - O);
        let U = !1;
        const K = Math.max(O, A), Q = Math.min(O + P, T);
        for (let J = K; J < Q; J++)
          if (!u.has(J)) {
            U = !0;
            break;
          }
        if (U && !n.has(O)) {
          D = O;
          break;
        }
      }
      D !== -1 && (p = setTimeout(function() {
        S(D, o);
      }, h));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(b) {
      if (b = b || {}, b.queryGen != null && b.queryGen !== i) return !1;
      const w = b.offset || 0, A = b.data || [];
      let T = 0;
      for (let L = 0; L < A.length; L++)
        A[L] != null && T++;
      if (T === 0 && (b.provisional || b.filtered > 0))
        return n.delete(w), !1;
      _ && (u.clear(), a.clear(), _ = !1), b.provisional || (r = b.total != null ? b.total : r, s = b.filtered != null ? b.filtered : b.data ? b.data.length : s);
      for (let L = 0; L < A.length; L++)
        A[L] != null && (u.set(w + L, A[L]), y(w + L));
      return n.delete(w), v(), l(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(b) {
      b && (m = b), S(0, o);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(b) {
      i++, n.clear(), clearTimeout(p), b && (m = b), _ = !0, S(0, o);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      i++, n.clear(), clearTimeout(p), _ = !0;
      const b = Math.max(0, Math.floor(d / o) * o);
      S(b, o);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(b) {
      n.delete(b);
    },
    destroy: function() {
      clearTimeout(p), u.clear(), a.clear(), n.clear();
    },
    configure: function(b) {
      b = b || {};
      let w = !1;
      if (b.windowSize != null && b.windowSize > 0 && b.windowSize !== e) {
        const A = b.windowSize < e;
        e = b.windowSize, A && v(), w = !0;
      }
      b.pageSize != null && b.pageSize > 0 && (o = b.pageSize), b.threshold != null && b.threshold >= 0 && (c = b.threshold), b.fetchDebounce != null && b.fetchDebounce >= 0 && (h = b.fetchDebounce), w && l();
    },
    setGrandTotal: function(b) {
      b == null || isNaN(b) || b < 0 || (r = b, E() || (s = b), l());
    }
  };
}
function $n(t) {
  return (t || "").replace(/^#/, "");
}
function Yt(t) {
  const e = t === void 0 ? location.hash : t, o = {}, c = $n(e);
  if (!c) return o;
  const h = c.split("&");
  for (let g = 0; g < h.length; g++) {
    const l = h[g];
    if (!l) continue;
    const u = l.indexOf(":"), a = u > -1 ? l.slice(0, u) : l, n = u > -1 ? l.slice(u + 1) : "";
    if (a)
      try {
        o[a] = decodeURIComponent(n);
      } catch {
        o[a] = n;
      }
  }
  return o;
}
function lt(t) {
  if (!t) return null;
  const e = Yt();
  return t in e ? e[t] : null;
}
function bt(t, e) {
  if (!t) return;
  const o = Yt();
  e == null ? delete o[t] : o[t] = String(e);
  const h = Object.keys(o).map(function(g) {
    const l = o[g];
    return l === "" ? g : g + ":" + encodeURIComponent(l);
  }).join("&");
  $n(location.hash) !== h && (location.hash = h);
}
function Ye(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function St(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const o = t.getAttribute("data-ln-hash");
  if (o && o.trim() !== "") return o.trim();
  const c = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return c ? e ? c + "-" + e : c : e || null;
}
function Gn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Te(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Qn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function ke(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const o = t.slice(0, e), c = t.slice(e + 1), h = c ? c.split(",").map(function(g) {
    try {
      return decodeURIComponent(g);
    } catch {
      return g;
    }
  }).filter(Boolean) : [];
  return { key: o, values: h };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Yt, window.lnCore.hashGet = lt, window.lnCore.hashSet = bt, window.lnCore.hashLinkClick = Ye, window.lnCore.resolveHashNamespace = St, window.lnCore.hashSortEncode = Gn, window.lnCore.hashSortDecode = Te, window.lnCore.hashFilterEncode = Qn, window.lnCore.hashFilterDecode = ke);
function sr(t) {
  return (t || "").replace(/^\?/, "");
}
function Le(t) {
  const e = t === void 0 ? typeof window < "u" ? window.location.search : "" : t, o = {}, c = sr(e);
  if (!c) return o;
  const h = new URLSearchParams(c);
  for (const [g, l] of h.entries())
    o[g] = l;
  return o;
}
function Mt(t) {
  if (!t || typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search);
  return e.has(t) ? e.get(t) : null;
}
function pe(t, e) {
  if (!t || typeof window > "u") return;
  const o = new URL(window.location.href);
  if (e == null || e === "" ? o.searchParams.delete(t) : o.searchParams.set(t, String(e)), o.search === window.location.search) return;
  const c = o.pathname + o.search + o.hash;
  window.history.replaceState(window.history.state, "", c);
}
function Ot(t, e) {
  if (!t || !t.hasAttribute("data-ln-query")) return null;
  const o = t.getAttribute("data-ln-query");
  if (o && o.trim() !== "") return o.trim();
  const c = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return c ? e ? c + "_" + e : c : e || null;
}
function Xn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function qe(t, e) {
  if (t && typeof t == "string") {
    if (t.endsWith(".asc"))
      return { fieldOrColumn: t.slice(0, -4), direction: "asc" };
    if (t.endsWith(".desc"))
      return { fieldOrColumn: t.slice(0, -5), direction: "desc" };
  }
  if (e && typeof e == "object") {
    const o = e.sort_field || e.sort_by;
    if (o) {
      const c = e.sort_dir && String(e.sort_dir).toLowerCase() === "desc" ? "desc" : "asc";
      return { fieldOrColumn: o, direction: c };
    }
  }
  return null;
}
function Yn(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function xe(t) {
  return !t || typeof t != "string" ? [] : t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e.trim());
    } catch {
      return e.trim();
    }
  }).filter(Boolean);
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.queryParse = Le, window.lnCore.queryGet = Mt, window.lnCore.querySet = pe, window.lnCore.resolveQueryParam = Ot, window.lnCore.querySortEncode = Xn, window.lnCore.querySortDecode = qe, window.lnCore.queryFilterEncode = Yn, window.lnCore.queryFilterDecode = xe);
function de(t, e, o, c) {
  const h = typeof c == "number" ? c : 4, g = window.innerWidth, l = window.innerHeight, u = e.width, a = e.height, n = (o || "bottom").split("-"), s = n[0], r = n[1] === "start" || n[1] === "end" ? n[1] : "center", i = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, m = i[s] || i.bottom;
  function p(E) {
    return E === "top" || E === "bottom" ? r === "start" ? t.left : r === "end" ? t.right - u : t.left + (t.width - u) / 2 : r === "start" ? t.top : r === "end" ? t.bottom - a : t.top + (t.height - a) / 2;
  }
  function f(E) {
    let v, S, b = !0;
    return E === "top" ? (v = t.top - h - a, S = p(E), v < 0 && (b = !1)) : E === "bottom" ? (v = t.bottom + h, S = p(E), v + a > l && (b = !1)) : E === "left" ? (v = p(E), S = t.left - h - u, S < 0 && (b = !1)) : (v = p(E), S = t.right + h, S + u > g && (b = !1)), { top: v, left: S, side: E, fits: b };
  }
  let d = null;
  for (let E = 0; E < m.length; E++) {
    const v = f(m[E]);
    if (v.fits) {
      d = v;
      break;
    }
  }
  d || (d = f(m[0]));
  let _ = d.top, y = d.left;
  return u >= g ? y = 0 : (y < 0 && (y = 0), y + u > g && (y = g - u)), a >= l ? _ = 0 : (_ < 0 && (_ = 0), _ + a > l && (_ = l - a)), { top: _, left: y, placement: d.side };
}
function Ie(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, o = e.visibility, c = e.display, h = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const g = t.offsetWidth, l = t.offsetHeight;
  return e.visibility = o, e.display = c, e.position = h, { width: g, height: l };
}
let Gt = null;
const ar = "ln-ashlar:storage-salt:v1", sn = 32768;
function an(t) {
  let e = "";
  const o = t.byteLength;
  for (let c = 0; c < o; c += sn)
    e += String.fromCharCode.apply(
      null,
      t.subarray(c, Math.min(c + sn, o))
    );
  return btoa(e);
}
function ln(t) {
  const e = atob(t), o = e.length, c = new Uint8Array(o);
  for (let h = 0; h < o; h++)
    c[h] = e.charCodeAt(h);
  return c;
}
function Jn(t, e) {
  let o = Gt, c = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? o = t : t && typeof t == "object" && (c = t, typeof CryptoKey < "u" && c.key instanceof CryptoKey && (o = c.key)), { key: o, options: c };
}
async function lr(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const o = e.method || "pbkdf2", c = new TextEncoder();
  if (o === "sha256") {
    const a = await crypto.subtle.digest("SHA-256", c.encode(t));
    return crypto.subtle.importKey(
      "raw",
      a,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const h = e.salt || ar, g = typeof h == "string" ? c.encode(h) : h, l = e.iterations || 1e5, u = await crypto.subtle.importKey(
    "raw",
    c.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: g,
      iterations: l,
      hash: "SHA-256"
    },
    u,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function cn(t, e = {}) {
  if (!t) {
    Gt = null;
    return;
  }
  try {
    const o = e.method || "sha256";
    Gt = await lr(t, { ...e, method: o });
  } catch (o) {
    throw console.error("[ln-core/crypto] Key derivation failed:", o), Gt = null, o;
  }
}
function kt() {
  return Gt;
}
async function cr(t, e, o) {
  const { key: c } = Jn(e);
  if (t == null)
    return t;
  if (!c)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const h = new TextEncoder(), g = crypto.getRandomValues(new Uint8Array(12)), l = typeof t == "string" ? t : JSON.stringify(t), u = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: g },
      c,
      h.encode(l)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: an(g),
      data: an(new Uint8Array(u))
    };
  } catch (h) {
    throw console.error("[ln-core/crypto] Encryption failed:", h), new Error("[ln-crypto] Encryption failed: " + (h && h.message ? h.message : String(h)));
  }
}
async function dr(t, e, o) {
  const { key: c, options: h } = Jn(e), g = h.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!c) {
    if (g)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (g)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const l = new TextDecoder(), u = ln(t.iv), a = ln(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: u },
      c,
      a
    ), s = l.decode(n);
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  } catch (l) {
    if (g)
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
function Zn(t, e = 100, o = 0) {
  const c = parseFloat(String(t)) || 0, h = parseFloat(String(e)) || 100, g = parseFloat(String(o)) || 0, l = Math.max(g, Math.min(c, h)), u = h - g;
  let a = 0;
  return u > 0 && (a = (l - g) / u * 100), a = Math.max(0, Math.min(100, a)), {
    value: c,
    min: g,
    max: h,
    clampedValue: l,
    percentage: a
  };
}
function it(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const o = e < 1e11 ? e * 1e3 : e, c = new Date(o);
    return isNaN(c.getTime()) ? null : c;
  }
  if (typeof t == "string") {
    const o = t.trim();
    if (!o) return null;
    const c = /^(\d{4})-(\d{2})-(\d{2})$/.exec(o);
    if (c) {
      const g = +c[1], l = +c[2], u = +c[3], a = new Date(g, l - 1, u);
      return a.getFullYear() !== g || a.getMonth() !== l - 1 || a.getDate() !== u ? null : a;
    }
    const h = new Date(o);
    return isNaN(h.getTime()) ? null : h;
  }
  return null;
}
function Ut(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), o = String(t.getMonth() + 1).padStart(2, "0"), c = String(t.getDate()).padStart(2, "0");
  return e + "-" + o + "-" + c;
}
const Et = {};
function ue(t) {
  const e = t || "default";
  if (!Et[e]) {
    const o = new Intl.NumberFormat(t, { useGrouping: !0 }), c = o.formatToParts(1234.5);
    let h = "", g = ".";
    for (let l = 0; l < c.length; l++)
      c[l].type === "group" && (h = c[l].value), c[l].type === "decimal" && (g = c[l].value);
    Et[e] = { groupSep: h, decimalSep: g, fmt: o };
  }
  return Et[e];
}
function ti(t, e, o) {
  if (t == null || typeof t != "string") return "";
  let c = t.trim();
  return c === "" ? "" : (c = c.replace(/[$€£¥]/g, ""), e && (c = c.split(e).join("")), c = c.replace(/\s/g, ""), o && o !== "." && (c = c.replace(o, ".")), c = c.replace(/[^\d.-]/g, ""), c);
}
function ur(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const o = t.trim();
  if (o === "" || o === "-") return NaN;
  const c = ue(e), h = ti(o, c.groupSep, c.decimalSep);
  if (h === "" || h === "-") return NaN;
  const g = parseFloat(h);
  return isNaN(g) ? NaN : g;
}
function ot(t, e, o = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const c = e || "default", h = o.maxDecimals != null ? parseInt(o.maxDecimals, 10) : null, g = o.userDecimals != null ? o.userDecimals : null;
  if (h !== null) {
    const l = c + "|max:" + h;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: h
    })), Et[l].format(t);
  }
  if (g !== null && g > 0) {
    const l = c + "|exact:" + g;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: g,
      maximumFractionDigits: g
    })), Et[l].format(t);
  }
  return ue(e).fmt.format(t);
}
function ae(t) {
  return String(t || "").trim().toLowerCase();
}
function ei(t) {
  const e = ae(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function fr(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((o) => o.trim()).filter(Boolean);
  return e.length ? e : null;
}
function ni(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const o = String(t).toLowerCase();
  for (let c = 0; c < e.length; c++)
    if (o.indexOf(e[c]) === -1) return !1;
  return !0;
}
function hr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Je(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const o = String(t).trim().toLowerCase();
  for (let c = 0; c < e.length; c++)
    if (String(e[c]).trim().toLowerCase() === o)
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
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  function c(l, u) {
    u = u || {};
    const a = pr(l), n = mr(l, u), s = gr(a, n);
    _r(n) && e.has(s) && (e.get(s).abort(), e.delete(s));
    const r = new AbortController(), i = u.signal;
    let m = null;
    i && (i.aborted ? r.abort(i.reason) : (m = function() {
      r.abort(i.reason);
    }, i.addEventListener("abort", m, { once: !0 })));
    const p = Object.assign({}, u, { signal: r.signal });
    return e.set(s, r), t(l, p).finally(function() {
      i && m && i.removeEventListener("abort", m), e.get(s) === r && e.delete(s);
    });
  }
  c.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = c;
  function h(l) {
    if (!l.detail || !l.detail.url) return;
    const u = l.target, a = (l.detail.method || (l.detail.body ? "POST" : "GET")).toUpperCase(), n = l.detail.key;
    n && o.has(n) && (o.get(n).abort(), o.delete(n));
    const s = new AbortController(), r = l.detail.signal;
    let i = null;
    r && (r.aborted ? s.abort(r.reason) : (i = function() {
      s.abort(r.reason);
    }, r.addEventListener("abort", i, { once: !0 }))), n && o.set(n, s);
    const m = { method: a, signal: s.signal };
    l.detail.body !== void 0 && (m.body = l.detail.body), window.fetch(l.detail.url, m).then(function(p) {
      r && i && r.removeEventListener("abort", i), n && o.get(n) === s && o.delete(n), k(u, "ln-http:response", {
        ok: p.ok,
        status: p.status,
        response: p
      });
    }).catch(function(p) {
      r && i && r.removeEventListener("abort", i), n && o.get(n) === s && o.delete(n), !(p && p.name === "AbortError") && k(u, "ln-http:error", {
        ok: !1,
        status: 0,
        error: p
      });
    });
  }
  function g(l) {
    const u = l.detail || {};
    u.all ? window.lnHttp.cancelAll() : u.key ? window.lnHttp.cancelByKey(u.key) : u.url && window.lnHttp.cancel(u.url);
  }
  document.addEventListener("ln-http:request", h), document.addEventListener("ln-http:cancel", g), window.lnHttp = {
    cancel: function(l) {
      let u = !1;
      return e.forEach(function(a, n) {
        n.endsWith(" " + l) && (a.abort(), e.delete(n), u = !0);
      }), u;
    },
    cancelByKey: function(l) {
      return o.has(l) ? (o.get(l).abort(), o.delete(l), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(l) {
        l.abort();
      }), e.clear(), o.forEach(function(l) {
        l.abort();
      }), o.clear();
    },
    get inflight() {
      const l = [];
      return e.forEach(function(u, a) {
        const n = a.indexOf(" ");
        l.push({ method: a.slice(0, n), url: a.slice(n + 1) });
      }), o.forEach(function(u, a) {
        l.push({ key: a });
      }), l;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", h), document.removeEventListener("ln-http:cancel", g), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-include": { prop: "url", read: j, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, c = Y(o), h = /* @__PURE__ */ new Map();
  function g(l) {
    if (this.dom = l, X(this, l, c), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    ir(), this._held = !0;
    const u = this, a = this.url;
    let n = h.get(a);
    return n || (n = fetch(a).then(function(s) {
      if (!s.ok)
        throw new Error("HTTP error! status: " + s.status);
      return s.text();
    }).catch(function(s) {
      throw h.delete(a), s;
    }), h.set(a, n)), n.then(function(s) {
      if (u._destroyed) return;
      const r = document.createElement("template");
      r.innerHTML = s, u.dom.content.appendChild(r.content), k(u.dom, "ln-include:loaded", { target: u.dom, url: u.url }), u._held && (u._held = !1, ye());
    }).catch(function(s) {
      u._destroyed || (console.error("[ln-include] Failed to fetch template from " + u.url + ":", s), k(u.dom, "ln-include:error", { target: u.dom, url: u.url, error: s }), u._held && (u._held = !1, ye()));
    }), this;
  }
  g.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ye()), delete this.dom[e]);
  }, H(t, e, g, "ln-include", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-form": { type: "marker", description: "Identifies the form element as an enhanced ln-form" },
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: j, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, c = Y(o);
  function h(g) {
    this.dom = g, X(this, g, c), this._baseAction = g.getAttribute("action") || "";
    const l = this;
    function u() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let s = 0; s < n.length; s++)
        n[s].hasAttribute("data-ln-initial-value") || n[s].setAttribute("data-ln-initial-value", n[s].getAttribute("value") || "");
    }
    function a() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let s = 0; s < n.length; s++)
        n[s].value = n[s].getAttribute("data-ln-initial-value") || "";
    }
    return u(), this._onLnFill = function(n) {
      n.target === l.dom && (n.detail ? (u(), l.fill(n.detail), l._applyActionMode(n.detail)) : (l.dom.reset(), a()));
    }, this._onReset = function() {
      l._applyActionMode(null), a();
    }, g.addEventListener("ln-fill", this._onLnFill), g.addEventListener("reset", this._onReset), this;
  }
  h.prototype.fill = function(g) {
    const l = je(this.dom, g);
    for (let u = 0; u < l.length; u++) {
      const a = l[u], n = a.tagName === "SELECT" || a.type === "checkbox" || a.type === "radio";
      a.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, h.prototype.reset = function() {
    this.dom.reset(), this._applyActionMode(null);
    const g = this.dom.elements;
    for (let l = 0; l < g.length; l++) {
      const u = g[l], a = u.tagName === "SELECT" || u.type === "checkbox" || u.type === "radio";
      u.dispatchEvent(new Event(a ? "change" : "input", { bubbles: !0 }));
    }
  }, h.prototype._ensureMethodInput = function() {
    let g = this.dom.querySelector('input[name="_method"]');
    return g || (g = document.createElement("input"), g.type = "hidden", g.name = "_method", g.value = "", this.dom.appendChild(g)), g;
  }, h.prototype._applyActionMode = function(g) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const l = g && g.id != null && g.id !== "" ? g.id : null, u = this._ensureMethodInput();
    if (l !== null) {
      const a = this._actionEdit;
      a ? this.dom.setAttribute("action", a.replace(":id", encodeURIComponent(l))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(l)), u.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), u.value = "";
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, H(t, e, h, "ln-form", {
    attributes: o
  });
})();
const dn = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function un(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function br(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function yr(t, e) {
  const o = [];
  if (t) {
    const c = Object.keys(dn);
    for (let h = 0; h < c.length; h++) {
      const g = c[h], l = dn[g];
      t[l] && o.push(g);
    }
  }
  if (e) {
    const c = Array.from(e);
    for (let h = 0; h < c.length; h++)
      c[h] && o.indexOf(c[h]) === -1 && o.push(c[h]);
  }
  return o;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", o = "data-ln-validate-errors", c = "data-ln-validate-error", h = "ln-validate-valid", g = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function u(a) {
    this.dom = a, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, s = a.tagName, r = a.type, i = s === "SELECT" || r === "checkbox" || r === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(p) {
      const f = p.detail && p.detail.error;
      if (!f) return;
      n._customErrors.add(f), n._touched = !0;
      const d = n._getErrorItems();
      if (d)
        for (let _ = 0; _ < d.length; _++)
          d[_].key === f && d[_].el.classList.remove("hidden");
      a.classList.remove(h), a.classList.add(g), a.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(p) {
      const f = p.detail && p.detail.error, d = n._getErrorItems();
      if (f) {
        if (n._customErrors.delete(f), d)
          for (let _ = 0; _ < d.length; _++)
            d[_].key === f && d[_].el.classList.add("hidden");
      } else {
        if (d)
          for (let _ = 0; _ < d.length; _++)
            n._customErrors.has(d[_].key) && d[_].el.classList.add("hidden");
        n._customErrors.clear();
      }
      n._touched && n.validate();
    }, i || a.addEventListener("input", this._onInput), a.addEventListener("change", this._onChange), a.addEventListener("ln-validate:set-custom", this._onSetCustom), a.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const m = a.form;
    return m && (m.hasAttribute("novalidate") || m.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(p) {
      n._touched = !0, !n.validate() && p.detail && p.detail.invalidFields && p.detail.invalidFields.push(n.dom);
    }, m.addEventListener("reset", this._onFormReset), m.addEventListener("ln-validate:request-validate", this._onValidateRequest), m._lnValidateGateBound || (m._lnValidateGateBound = !0, m.addEventListener("submit", function(p) {
      const f = { invalidFields: [] };
      k(m, "ln-validate:request-validate", f), f.invalidFields.length > 0 && (p.preventDefault(), f.invalidFields.sort((d, _) => d.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), f.invalidFields[0].focus());
    }))), br(a) && (this._touched = !0, this.validate()), this;
  }
  u.prototype._getErrorItems = function() {
    if (this._errorItems !== void 0) return this._errorItems;
    const a = this.dom.closest(":has(> [" + o + "])");
    if (a) {
      const n = a.querySelector("[" + o + "]");
      if (n) {
        const s = n.querySelectorAll("[" + c + "]");
        this._errorItems = [];
        for (let r = 0; r < s.length; r++)
          this._errorItems.push({
            el: s[r],
            key: s[r].getAttribute(c)
          });
        return this._errorItems;
      }
    }
    return this._errorItems = null, null;
  }, u.prototype.validate = function() {
    const a = this.dom, n = a.validity, s = un(n, this._customErrors.size), r = yr(n, this._customErrors), i = this._getErrorItems();
    if (i)
      for (let f = 0; f < i.length; f++) {
        const d = !r.includes(i[f].key);
        i[f].el.classList.contains("hidden") !== d && i[f].el.classList.toggle("hidden", d);
      }
    a.classList.contains(h) !== s && a.classList.toggle(h, s), a.classList.contains(g) === s && a.classList.toggle(g, !s);
    const m = s ? "false" : "true";
    return a.getAttribute("aria-invalid") !== m && a.setAttribute("aria-invalid", m), k(a, s ? "ln-validate:valid" : "ln-validate:invalid", { target: a, field: a.name, errors: r }), s;
  }, u.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.contains(h) && this.dom.classList.remove(h), this.dom.classList.contains(g) && this.dom.classList.remove(g), this.dom.hasAttribute("aria-invalid") && this.dom.removeAttribute("aria-invalid");
    const a = this._getErrorItems();
    if (a)
      for (let n = 0; n < a.length; n++)
        a[n].el.classList.contains("hidden") || a[n].el.classList.add("hidden");
  }, Object.defineProperty(u.prototype, "isValid", {
    get: function() {
      return un(this.dom.validity, this._customErrors.size);
    }
  }), u.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const a = this.dom.form;
    a && (this._onFormReset && a.removeEventListener("reset", this._onFormReset), this._onValidateRequest && a.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(h, g), this.dom.removeAttribute("aria-invalid"), this._errorItems = null, delete this.dom[e];
  }, H(t, e, u, "ln-validate", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", o = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let c = null;
  function h(i) {
    if (!i.hasAttribute(t) || i[e]) return;
    i[e] = !0;
    const m = n(i);
    g(m.links), l(m.forms);
  }
  function g(i) {
    for (const m of i) {
      if (m[e + "Trigger"] || m.hostname && m.hostname !== window.location.hostname) continue;
      const p = m.getAttribute("href");
      if (p && p.includes("#")) continue;
      const f = function(d) {
        if (!Ln(d, m)) return;
        d.preventDefault();
        const _ = m.getAttribute("href");
        _ && a("GET", _, null, m);
      };
      m.addEventListener("click", f), m[e + "Trigger"] = f;
    }
  }
  function l(i) {
    for (const m of i) {
      if (m[e + "Trigger"]) continue;
      if (m.hasAttribute(o)) {
        m[e + "ScopeWarned"] || (m[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const p = function(f) {
        if (f.defaultPrevented) return;
        f.preventDefault();
        const d = m.method.toUpperCase(), _ = m.action, y = new FormData(m);
        for (const E of m.querySelectorAll('button, input[type="submit"]'))
          E.disabled = !0;
        a(d, _, y, m, function() {
          for (const E of m.querySelectorAll('button, input[type="submit"]'))
            E.disabled = !1;
        });
      };
      m.addEventListener("submit", p), m[e + "Trigger"] = p;
    }
  }
  function u(i) {
    if (!i[e]) return;
    const m = n(i);
    for (const p of m.links)
      p[e + "Trigger"] && (p.removeEventListener("click", p[e + "Trigger"]), delete p[e + "Trigger"]);
    for (const p of m.forms)
      p[e + "Trigger"] && (p.removeEventListener("submit", p[e + "Trigger"]), delete p[e + "Trigger"]);
    delete i[e];
  }
  function a(i, m, p, f, d) {
    if (G(f, "ln-ajax:before-start", { method: i, url: m }).defaultPrevented) return;
    i === "GET" && c && c(), k(f, "ln-ajax:start", { method: i, url: m }), f.classList.add("ln-ajax--loading");
    const y = document.createElement("span");
    y.className = "ln-ajax-spinner", f.appendChild(y);
    function E() {
      f.classList.remove("ln-ajax--loading");
      const T = f.querySelector(".ln-ajax-spinner");
      T && T.remove(), d && d();
    }
    let v = m;
    const S = document.querySelector('meta[name="csrf-token"]'), b = S ? S.getAttribute("content") : null;
    p instanceof FormData && b && p.append("_token", b);
    const w = {
      method: i,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (b && (w.headers["X-CSRF-TOKEN"] = b), i === "GET" && p) {
      const T = new URLSearchParams(p);
      v = m + (m.includes("?") ? "&" : "?") + T.toString();
    } else i !== "GET" && p && (w.body = p);
    let A = null;
    if (i === "GET") {
      const T = new AbortController();
      w.signal = T.signal, A = function() {
        c = null, T.abort(), E(), k(f, "ln-ajax:aborted", { method: i, url: v });
      }, c = A;
    }
    fetch(v, w).then(function(T) {
      const L = T.ok, x = T.status;
      return T.text().then(function(D) {
        let I = null, O = null;
        if (D && D.trim())
          try {
            I = JSON.parse(D);
          } catch (P) {
            O = P;
          }
        return { ok: L, status: x, data: I, parseError: O };
      });
    }).then(function(T) {
      A && c === A && (c = null);
      const L = T.status, x = T.data, D = T.parseError;
      if (T.ok && !D) {
        if (x && x.title && (document.title = x.title), x && x.content)
          for (const I in x.content) {
            const O = document.getElementById(I);
            O && (O.innerHTML = x.content[I]);
          }
        if (f.tagName === "A") {
          const I = f.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else f.tagName === "FORM" && f.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", v);
        k(f, "ln-ajax:success", { method: i, url: v, data: x });
      } else
        k(f, "ln-ajax:error", {
          method: i,
          url: v,
          status: L,
          data: x,
          error: D || null
        });
      E(), k(f, "ln-ajax:complete", { method: i, url: v });
    }).catch(function(T) {
      T && T.name === "AbortError" || (A && c === A && (c = null), k(f, "ln-ajax:error", { method: i, url: v, status: 0, data: null, error: T }), E(), k(f, "ln-ajax:complete", { method: i, url: v }));
    });
  }
  function n(i) {
    const m = { links: [], forms: [] };
    return i.tagName === "A" && i.getAttribute(t) !== "false" ? m.links.push(i) : i.tagName === "FORM" && i.getAttribute(t) !== "false" ? m.forms.push(i) : (m.links = Array.from(i.querySelectorAll('a:not([data-ln-ajax="false"])')), m.forms = Array.from(i.querySelectorAll('form:not([data-ln-ajax="false"])'))), m;
  }
  function s() {
    ft(function() {
      te({
        onInit: function(i) {
          if (h(i), !i.hasAttribute(t)) {
            for (const p of i.querySelectorAll("[" + t + "]"))
              h(p);
            const m = i.closest && i.closest("[" + t + "]");
            if (m && m.getAttribute(t) !== "false") {
              const p = n(i);
              g(p.links), l(p.forms);
            }
          }
        }
      }), Pt([t], function(i) {
        h(i);
      });
    }, "ln-ajax");
  }
  function r() {
    for (const i of document.querySelectorAll("[" + t + "]"))
      h(i);
  }
  window[e] = h, window[e].destroy = u, s(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
})();
function vr(t, { isHydration: e = !1, hasPrimaryRegion: o = !1, primaryMatch: c = null } = {}) {
  const h = o ? !c : !t.some((n) => n.match), g = [], l = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const s = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !s && n.targetEl && g.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || l.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  l.sort((n, s) => n.regionKey === "__primary__" ? -1 : s.regionKey === "__primary__" ? 1 : 0);
  const a = l.find((n) => n.regionKey === "__primary__") || l[0] || null;
  return { notFound: h, clears: g, swaps: l, owner: a };
}
function Qt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function wr(t, e) {
  const o = Qt(e);
  if (!o) return t && t.replace(/\/+$/, "") || "/";
  const c = (t || "/").replace(/\/+$/, "") || "/";
  return c === o ? "/" : c.startsWith(o + "/") ? c.slice(o.length).replace(/\/+$/, "") || "/" : c;
}
function ii(t, e) {
  const o = Qt(e);
  if (!o) return t || "/";
  const c = t || "/", h = c.indexOf("#"), g = h !== -1 ? c.slice(0, h) : c, l = h !== -1 ? c.slice(h) : "", u = g.indexOf("?"), a = u !== -1 ? g.slice(0, u) : g, n = u !== -1 ? g.slice(u) : "";
  let s;
  if (a === o)
    s = o + "/";
  else if (a.startsWith(o + "/"))
    s = a;
  else {
    const r = a.startsWith("/") ? a : "/" + a;
    s = r === "/" ? o + "/" : o + r;
  }
  return s + n + l;
}
function Re() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return Qt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const o = new URL(e.getAttribute("href"), window.location.origin);
      return Qt(o.pathname);
    } catch {
      return Qt(e.getAttribute("href"));
    }
  return "";
}
const ri = {
  navigate: function(t) {
    Jt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Jt(t, { historyAction: "replace" });
  },
  base: function() {
    return Re();
  },
  toUrl: function(t) {
    return ii(t, Re());
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
}, Ze = "data-ln-route", oi = "lnRoute";
typeof window < "u" && (window.lnRouter = ri);
function ve(t) {
  gi(t), mi(t), yt.size > 0 && pi();
}
const Er = {
  "data-ln-route": { effect: ve, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: ve, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: ve, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, yt = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new WeakMap();
let si = /* @__PURE__ */ new Map(), fn = !1, fe = null, ai = null, li = "", ci = {}, di = {}, ui = null, De = !1;
function hn(t, e, o) {
  De ? queueMicrotask(function() {
    k(t, e, o);
  }) : k(t, e, o);
}
function tn(t) {
  try {
    const u = new URL(t, window.location.origin);
    t = u.pathname + u.search + u.hash;
  } catch {
  }
  let [e] = t.split("#"), [o, c] = e.split("?");
  const h = {};
  if (c) {
    const u = new URLSearchParams(c);
    for (const [a, n] of u.entries())
      h[a] = n;
  }
  const g = Re();
  return { path: wr(o, g), query: h, base: g };
}
function fi(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const o = t.segments, c = e.segments, h = Math.max(o.length, c.length);
  for (let g = 0; g < h; g++) {
    const l = o[g], u = c[g];
    if (l === void 0) return 1;
    if (u === void 0) return -1;
    if (l === "*") return 1;
    if (u === "*") return -1;
    const a = l.startsWith(":"), n = u.startsWith(":");
    if (a && !n) return 1;
    if (!a && n) return -1;
  }
  return 0;
}
function hi(t, e) {
  const o = t.split("/").filter(Boolean);
  for (const c of e) {
    if (c.pattern === "*")
      return {
        route: c,
        params: { wildcard: t }
      };
    const h = c.segments, g = {};
    let l = !0;
    if (!(o.length > h.length && h[h.length - 1] !== "*")) {
      for (let u = 0; u < h.length; u++) {
        const a = h[u], n = o[u];
        if (a === "*") {
          g.wildcard = o.slice(u).join("/");
          break;
        }
        if (n === void 0) {
          l = !1;
          break;
        }
        if (a.startsWith(":"))
          g[a.slice(1)] = decodeURIComponent(n);
        else if (a !== n) {
          l = !1;
          break;
        }
      }
      if (l && (h.indexOf("*") !== -1 || o.length <= h.length))
        return { route: c, params: g };
    }
  }
  return null;
}
function Oe(t, e = {}) {
  const o = e.warn !== !1;
  if (t !== "__primary__") {
    const h = document.getElementById(t);
    return !h && o && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), h;
  }
  const c = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !c && o && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), c;
}
function pn(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), o = [t].concat(e);
  for (const h of o)
    for (const g of Object.keys(h))
      if (g.startsWith("ln") && h[g] && typeof h[g].destroy == "function")
        try {
          h[g].destroy();
        } catch (l) {
          console.error(`[ln-router] Error destroying component ${g} on element:`, h, l);
        }
  const c = document.querySelectorAll('[data-ln-popover="open"]');
  for (const h of c) {
    const g = h.lnPopover;
    if (g && g.trigger && t.contains(g.trigger))
      try {
        g.destroy();
      } catch (l) {
        console.error("[ln-router] Error destroying open popover:", l);
      }
  }
}
function Jt(t, e = {}) {
  const { path: o, query: c, base: h } = tn(t), g = ii(t, h), l = /* @__PURE__ */ new Map();
  for (const [p, f] of yt)
    l.set(p, hi(o, f.sorted));
  const u = l.get("__primary__") || null, a = Oe("__primary__", { warn: !!u }), n = yt.has("__primary__"), s = [];
  for (const [p, f] of l) {
    const d = p === "__primary__" ? a : Oe(p, { warn: !1 }), _ = !d && !!(u && u.route && u.route.templateNode && u.route.templateNode.content && u.route.templateNode.content.querySelector("#" + CSS.escape(p)));
    !d && !_ && f && console.warn(`[ln-router] Explicit target element #${p} not found in DOM`), s.push({
      regionKey: p,
      match: f,
      targetEl: d,
      isPending: _,
      hasKeep: !!d && d.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!d && d.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!d && d.children.length > 0,
      mountedTemplate: d && we.get(d) || null
    });
  }
  const r = vr(s, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: u
  });
  if (r.notFound) {
    hn(document.body, "ln-router:not-found", { path: o });
    return;
  }
  if (G(a || document.body, "ln-router:before-navigate", {
    from: fe,
    to: g,
    path: o,
    params: u ? u.params : {},
    query: c
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", g) : e.historyAction === "replace" && window.history.replaceState(null, "", g);
  const m = function() {
    for (const p of r.clears)
      pn(p.targetEl), p.targetEl.replaceChildren(), we.delete(p.targetEl);
    for (const p of r.swaps) {
      if ((p.isPending || !p.targetEl || !document.contains(p.targetEl)) && (p.targetEl = p.regionKey === "__primary__" ? a : document.getElementById(p.regionKey)), !p.targetEl) {
        console.warn(`[ln-router] Target element #${p.regionKey} could not be resolved`);
        continue;
      }
      if (p.skipMount || (pn(p.targetEl), p.targetEl.replaceChildren(p.match.route.templateNode.content.cloneNode(!0))), we.set(p.targetEl, p.match.route.templateNode), r.owner && p.regionKey === r.owner.regionKey) {
        if (p.match.route.title) {
          let f = p.match.route.title;
          if (p.match.params)
            for (const [d, _] of Object.entries(p.match.params))
              f = f.replace(new RegExp("\\{\\{\\s*" + d + "\\s*\\}\\}", "g"), _);
          document.title = f;
        }
        if (!e.isHydration) {
          p.targetEl.hasAttribute("tabindex") || p.targetEl.setAttribute("tabindex", "-1");
          const f = p.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          f ? (f.setAttribute("tabindex", "-1"), f.focus()) : p.targetEl.focus(), p.regionKey === "__primary__" && p.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      hn(p.targetEl, "ln-router:navigated", {
        path: o,
        fullPath: g,
        base: h,
        params: p.match.params,
        query: c,
        route: p.match.route,
        target: p.targetEl,
        region: p.regionKey
      });
    }
    fe = o, ai = g, li = h, di = c, ui = u ? u.route : null, ci = u ? u.params : {}, si = new Map(
      Array.from(l.entries()).map(([p, f]) => [p, f ? { route: f.route, params: f.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(m) : m();
}
function Ar(t) {
  const e = t.target.closest("a");
  if (!e || !Ln(t, e)) return;
  const o = e.getAttribute("href"), { path: c } = tn(o);
  for (const h of yt.values())
    if (hi(c, h.sorted)) {
      t.preventDefault(), Jt(o, { historyAction: "push" });
      return;
    }
}
function Sr(t, e) {
  const o = Object.keys(t), c = Object.keys(e);
  if (o.length !== c.length) return !1;
  for (let h = 0; h < o.length; h++) {
    const g = o[h];
    if (t[g] !== e[g]) return !1;
  }
  return !0;
}
function Cr() {
  const t = window.location.pathname + window.location.search, e = ri.current();
  if (e && e.path != null) {
    const o = tn(t);
    if (e.path === o.path && Sr(e.query, o.query))
      return;
  }
  Jt(t, { historyAction: "skip" });
}
function pi() {
  fn || (fn = !0, ft(function() {
    document.addEventListener("click", Ar), window.addEventListener("popstate", Cr), De = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Jt(t, { historyAction: "replace", isHydration: !0 }), De = !1;
  }, "ln-router"));
}
function mi(t) {
  const e = t.getAttribute(Ze);
  if (!e) return;
  const o = t.getAttribute("data-ln-route-target") || null;
  if (o === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const c = o || "__primary__";
  yt.has(c) || yt.set(c, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const h = yt.get(c);
  if (h.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${c}"`);
    return;
  }
  const g = t.getAttribute("data-ln-route-title"), l = e.split("/").filter(Boolean), u = {
    pattern: e,
    segments: l,
    target: o,
    title: g,
    templateNode: t
  }, a = Oe(c);
  a && a.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), h.routes.set(e, u), h.sorted = Array.from(h.routes.values()).sort(fi);
}
function gi(t) {
  const e = t.getAttribute(Ze);
  if (!e) return;
  const c = t.getAttribute("data-ln-route-target") || null || "__primary__", h = yt.get(c);
  h && (h.routes.delete(e), h.sorted = Array.from(h.routes.values()).sort(fi), h.routes.size === 0 && yt.delete(c));
}
function _i(t) {
  return this.dom = t, mi(t), this;
}
_i.prototype.destroy = function() {
  gi(this.dom), delete this.dom[oi];
};
H(Ze, oi, _i, "ln-router", {
  attributes: Er,
  onInit: function() {
    yt.size > 0 && pi();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", o = "data-ln-modal-for", c = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: s,
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
  }, g = /* @__PURE__ */ new Set();
  let l = null;
  function u() {
    l || (l = function(r) {
      if (He(r)) return;
      const i = r.target.closest("[" + o + "]");
      if (!i || ze(i)) return;
      const m = i.getAttribute(o);
      if (!m) return;
      const p = document.getElementById(m);
      !p || !p[e] || (r.preventDefault(), i.hasAttribute("data-ln-modal-mode") ? p.setAttribute("data-ln-modal-mode", i.getAttribute("data-ln-modal-mode")) : p.hasAttribute("data-ln-modal-mode") && p.setAttribute("data-ln-modal-mode", "new"), p.setAttribute(t, "open"));
    }, document.addEventListener("click", l));
  }
  function a() {
    g.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function n(r) {
    this.dom = r, this.isOpen = r.getAttribute(t) === "open";
    const i = this;
    return this._onRequestOpen = function() {
      i.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      i.dom.setAttribute(t, "close");
    }, this._onCancel = function(m) {
      m.preventDefault(), i.dom.setAttribute(t, "close");
    }, this._onClose = function() {
      !i.isOpen || i.dom.getAttribute(t) !== "open" || i.dom.open || (i._isNativeClosing = !0, i.dom.setAttribute(t, "close"));
    }, this._onClickClose = function(m) {
      const p = m.target.closest("[" + c + "]");
      p && i.dom.contains(p) && (m.preventDefault(), i.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), g.add(this), u(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), k(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const r = this.dom.getAttribute(t);
    this.dom.setAttribute(t, r === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), g.delete(this), a(), this.isOpen) {
        const r = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(m) {
            return m !== r;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function s(r) {
    const i = r[e];
    if (!i) return;
    const m = !!i._isNativeClosing;
    i._isNativeClosing = !1;
    const f = r.getAttribute(t) === "open";
    if (f === i.isOpen) {
      f && r.isConnected && !r.open && typeof r.showModal == "function" && r.showModal();
      return;
    }
    if (f) {
      if (G(r, "ln-modal:before-open", { modalId: r.id, target: r }).defaultPrevented) {
        r.setAttribute(t, "close");
        return;
      }
      i.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof r.showModal == "function" && r.showModal();
      const _ = r.querySelector("[autofocus]");
      if (_ && $t(_))
        _.focus();
      else {
        const y = r.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), E = Array.prototype.find.call(y, $t);
        if (E) E.focus();
        else {
          const v = r.querySelectorAll("a[href], button:not([disabled])"), S = Array.prototype.find.call(v, $t);
          S && S.focus();
        }
      }
      k(r, "ln-modal:open", { modalId: r.id, target: r });
    } else {
      if (!m && G(r, "ln-modal:before-close", { modalId: r.id, target: r }).defaultPrevented) {
        r.setAttribute(t, "open");
        return;
      }
      i.isOpen = !1, r.hasAttribute("data-ln-modal-mode") && r.setAttribute("data-ln-modal-mode", "new"), typeof r.close == "function" && r.open && r.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), k(r, "ln-modal:close", { modalId: r.id, target: r });
    }
  }
  H(t, e, n, "ln-modal", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-ui-coordinator": {
      type: "marker",
      description: "Mounts UI coordinator mediating global hash-routing, modals, and toasts"
    }
  };
  document.addEventListener("click", function(g) {
    if (g.ctrlKey || g.metaKey || g.button === 1) return;
    const l = g.target.closest('a[href^="#"]');
    if (!l) return;
    const u = l.getAttribute("href"), a = Yt(u);
    for (const n in a) {
      const s = document.getElementById(n);
      if (s && s.lnModal) {
        if (!Ye(g)) return;
        bt(n, a[n]), s.lnModal.isOpen || k(s, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function c() {
    const g = location.hash;
    if (!g) return;
    const l = Yt(g);
    for (const u in l) {
      const a = document.getElementById(u);
      a && a.lnModal && !a.lnModal.isOpen && k(a, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", c), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c(), document.addEventListener("ln-modal:close", function(g) {
    const l = g.target;
    l && l.id && lt(l.id) !== null && bt(l.id, null);
  }), document.addEventListener("ln-ajax:success", function(g) {
    const u = (g.detail || {}).data;
    if (u && u.message) {
      const n = u.message;
      k(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const a = g.target.closest("[data-ln-modal]");
    a && a.lnModal && (a.id && lt(a.id) !== null && bt(a.id, null), k(a, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(g) {
    const u = (g.detail || {}).data;
    if (u && u.message) {
      const a = u.message;
      k(window, "ln-toast:enqueue", {
        type: a.type || "error",
        title: a.title || "",
        message: typeof a == "string" ? a : a.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(g) {
    const l = g.detail || {};
    l.message && k(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: l.message
    });
  });
  function h(g) {
    return this.dom = g, this;
  }
  h.prototype.destroy = function() {
    delete this.dom[e];
  }, H(t, e, h, "ln-ui-coordinator", {
    attributes: o
  });
})();
function Tr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let o = e, c = 0;
  for (let h = 0; h < t.length && o > 0; h++)
    c = h + 1, /[0-9]/.test(t[h]) && o--;
  return o > 0 && (c = t.length), c;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function o(n) {
    const s = n[e];
    s && (s.isTextElement ? s._initTextElement() : isNaN(s.value) || s._displayFormatted(s.value));
  }
  const c = {
    "data-ln-number": { type: "marker", effect: o, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: o, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: o, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: o, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: o, description: "Maximum allowed numeric value" }
  }, h = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"), g = /* @__PURE__ */ new Set();
  let l = !1;
  function u() {
    he(), !l && (l = !0, document.addEventListener("ln-core:locale-change", function() {
      g.forEach(function(n) {
        n.isTextElement ? n._formatTextContent() : isNaN(n.value) || n._displayFormatted(n.value);
      });
    }));
  }
  function a(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const s = this;
    if (g.add(this), u(), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const r = document.createElement("input");
    r.type = "hidden", r.name = n.name, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && r.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", r), this._hidden = r, Object.defineProperty(r, "value", {
      get: function() {
        return h.get.call(r);
      },
      set: function(m) {
        if (h.set.call(r, m), m !== "" && !isNaN(parseFloat(m))) {
          const p = s.dom.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(ot(parseFloat(m), Z(s.dom), { maxDecimals: p }));
        } else
          s._setDisplayRaw("");
        s.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Ve(n, h, {
      get: function() {
        return h.get.call(n);
      },
      set: function(m) {
        if (m === "") {
          s._setDisplayRaw(""), s._setHiddenRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const p = typeof m == "number" ? m : parseFloat(String(m));
        if (isNaN(p))
          s._setDisplayRaw(String(m)), s._setHiddenRaw("");
        else {
          s._setHiddenRaw(p);
          const f = n.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(ot(p, Z(n), { maxDecimals: f }));
        }
        n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      s._handleInput();
    }, n.addEventListener("input", this._onInput), this._onKeyDown = function(m) {
      if (m.key !== "Backspace") return;
      const p = n.selectionStart, f = n.selectionEnd;
      if (p !== f || p === 0) return;
      const d = ue(Z(n)), _ = h.get.call(n), y = _[p - 1];
      if (y === d.groupSep || /\s/.test(y)) {
        m.preventDefault();
        const E = p - 2 >= 0 ? p - 2 : 0, v = _.slice(0, E) + _.slice(p);
        h.set.call(n, v), n.setSelectionRange(E, E), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, n.addEventListener("keydown", this._onKeyDown), this._onPaste = function(m) {
      m.preventDefault();
      const p = (m.clipboardData || window.clipboardData).getData("text"), f = ur(p, Z(n));
      s.value = isNaN(f) ? NaN : f;
    }, n.addEventListener("paste", this._onPaste);
    const i = n.value;
    if (i !== "") {
      const m = parseFloat(i);
      if (!isNaN(m)) {
        const p = n.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(m), this._setDisplayRaw(ot(m, Z(n), { maxDecimals: p })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return n.form && (this._onFormReset = function() {
      setTimeout(function() {
        const m = n.defaultValue;
        if (m !== "") {
          const p = parseFloat(m);
          if (!isNaN(p)) {
            const f = n.getAttribute("data-ln-number-decimals");
            s._setHiddenRaw(p), s._setDisplayRaw(ot(p, Z(n), { maxDecimals: f })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
            return;
          }
        }
        s._setHiddenRaw(""), s._setDisplayRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }, 0);
    }, n.form.addEventListener("reset", this._onFormReset)), this;
  }
  a.prototype._initTextElement = function() {
    const n = this.dom;
    let s = n.getAttribute("data-ln-value"), r = n.getAttribute("data-ln-number"), i = null;
    s !== null && s !== "" ? i = s : r !== null && r !== "" && r !== "true" ? i = r : i = n.textContent.trim();
    const m = parseFloat(i);
    isNaN(m) ? this._rawValue = null : (this._rawValue = m, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", String(m)), this._formatTextContent());
  }, a.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const n = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ot(this._rawValue, Z(this.dom), { maxDecimals: n });
    }
  }, a.prototype._handleInput = function() {
    const n = this.dom, s = h.get.call(n);
    if (s === "") {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (s === "-") {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const r = n.selectionStart;
    let i = 0;
    for (let A = 0; A < r; A++)
      /[0-9]/.test(s[A]) && i++;
    const m = Z(n), p = ue(m);
    let f = s, d = ti(s, p.groupSep, p.decimalSep), _ = parseFloat(d);
    if (isNaN(_)) {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: s });
      return;
    }
    const y = n.getAttribute("data-ln-number-decimals"), E = d.indexOf(".");
    if (y !== null && E !== -1) {
      const A = parseInt(y, 10), T = d.slice(E + 1);
      if (A === 0)
        d = d.slice(0, E), f = f.split(p.decimalSep)[0], _ = parseFloat(d), this._setDisplayRaw(f);
      else if (T.length > A) {
        d = d.slice(0, E + 1 + A);
        const L = f.split(p.decimalSep);
        f = L[0] + p.decimalSep + L[1].slice(0, A), _ = parseFloat(d), this._setDisplayRaw(f);
      }
    }
    const v = n.getAttribute("data-ln-number-max");
    if (v !== null && _ > parseFloat(v)) {
      const A = parseFloat(v), T = ot(A, m, { maxDecimals: y });
      this._setDisplayRaw(T), this._setHiddenRaw(A), n.setSelectionRange(T.length, T.length), k(n, "ln-number:input", { value: A, formatted: T });
      return;
    }
    if (f.endsWith(p.decimalSep) || p.decimalSep !== "." && f.endsWith(".")) {
      this._setHiddenRaw(_), k(n, "ln-number:input", { value: _, formatted: f });
      return;
    }
    const S = d.indexOf(".");
    if (S !== -1 && d.slice(S + 1).endsWith("0")) {
      this._setHiddenRaw(_), k(n, "ln-number:input", { value: _, formatted: f });
      return;
    }
    let b;
    if (y !== null)
      b = ot(_, m, { maxDecimals: y });
    else {
      const A = S !== -1 ? d.slice(S + 1).length : 0;
      b = ot(_, m, { userDecimals: A });
    }
    this._setDisplayRaw(b);
    const w = Tr(b, i);
    n.setSelectionRange(w, w), this._setHiddenRaw(_), k(n, "ln-number:input", { value: _, formatted: b });
  }, a.prototype._setHiddenRaw = function(n) {
    this._hidden && h.set.call(this._hidden, String(n));
  }, a.prototype._setDisplayRaw = function(n) {
    this.isTextElement ? this.dom.textContent = String(n) : h.set.call(this.dom, String(n));
  }, a.prototype._displayFormatted = function(n) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(n, Z(this.dom), { maxDecimals: s }));
    }
  }, Object.defineProperty(a.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const n = h.get.call(this._hidden);
      return n === "" ? NaN : parseFloat(n);
    },
    set: function(n) {
      const s = typeof n == "number" ? n : parseFloat(n);
      if (this.isTextElement) {
        isNaN(s) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = s, this.dom.setAttribute("data-ln-value", String(s)), this._formatTextContent());
        return;
      }
      if (isNaN(s)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(s);
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(s, Z(this.dom), { maxDecimals: r })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(a.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : h.get.call(this.dom);
    }
  }), a.prototype.destroy = function() {
    this.dom[e] && (g.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this._onFormReset && this.dom.form && this.dom.form.removeEventListener("reset", this._onFormReset), this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, H(t, e, a, "ln-number", {
    attributes: c,
    extraAttributes: ["lang"],
    onAttributeChange: o
  });
})();
const Ne = /^(short|medium|long)(\s+datetime)?$/, kr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function Lr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Ne) ? kr[t.trim()] : null;
}
function Vt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let o, c;
  if (e.indexOf(".") !== -1)
    o = ".", c = e.split(".");
  else if (e.indexOf("/") !== -1)
    o = "/", c = e.split("/");
  else if (e.indexOf("-") !== -1)
    o = "-", c = e.split("-");
  else
    return null;
  if (c.length !== 3) return null;
  const h = [];
  for (let n = 0; n < 3; n++) {
    const s = parseInt(c[n], 10);
    if (isNaN(s)) return null;
    h.push(s);
  }
  let g, l, u;
  o === "." ? (g = h[0], l = h[1], u = h[2]) : o === "/" ? (l = h[0], g = h[1], u = h[2]) : c[0].length === 4 ? (u = h[0], l = h[1], g = h[2]) : (g = h[0], l = h[1], u = h[2]), u < 100 && (u += u < 50 ? 2e3 : 1900);
  const a = new Date(u, l - 1, g);
  return a.getFullYear() !== u || a.getMonth() !== l - 1 || a.getDate() !== g ? null : a;
}
function Ee(t, e, o, c) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const h = t.getDate(), g = t.getMonth(), l = t.getFullYear(), u = t.getHours(), a = t.getMinutes();
  let n, s;
  const r = (o || "").toLowerCase().split("-")[0];
  let i = !1;
  try {
    const f = new Intl.DateTimeFormat(o, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    i = !!(c && f !== r);
  } catch {
    i = !!c;
  }
  if (i && c && c.monthsLong)
    n = c.monthsLong[g];
  else
    try {
      n = new Intl.DateTimeFormat(o, { month: "long" }).format(t);
    } catch {
      n = String(g + 1);
    }
  if (i && c && c.monthsShort)
    s = c.monthsShort[g];
  else
    try {
      s = new Intl.DateTimeFormat(o, { month: "short" }).format(t);
    } catch {
      s = String(g + 1);
    }
  const m = {
    yyyy: String(l),
    yy: String(l).slice(-2),
    MMMM: n,
    MMM: s,
    MM: String(g + 1).padStart(2, "0"),
    M: String(g + 1),
    dd: String(h).padStart(2, "0"),
    d: String(h),
    HH: String(u).padStart(2, "0"),
    mm: String(a).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(p) {
    return m[p] !== void 0 ? m[p] : p;
  });
}
function ie(t, e, o, c) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const h = Lr(e);
  if (h)
    try {
      const g = new Intl.DateTimeFormat(o, h), l = (o || "").toLowerCase().split("-")[0], u = g.resolvedOptions().locale.toLowerCase().split("-")[0];
      return c && u !== l ? Ee(t, "dd.MM.yyyy", o, c) : g.format(t);
    } catch {
      return Ee(t, "dd.MM.yyyy", o, c);
    }
  return Ee(t, e || "dd.MM.yyyy", o, c);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function o(i) {
    const m = i[e];
    if (m) {
      if (m.isTextElement)
        m._initTextElement();
      else if (m.value) {
        const p = it(m.value);
        p && m._displayFormatted(p);
      }
    }
  }
  const c = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: o, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: o, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: o, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: o, description: "Raw ISO date string or timestamp for non-time elements (td, span)" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, h = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(i, m, p) {
    k(i.dom, "ln-date:change", {
      value: m,
      formatted: i.dom.value,
      date: p
    }), i.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(i, m, p, f) {
    i._setHiddenRaw(m), h.set.call(i._picker, m), i._lastISO = m, f !== void 0 ? (i._isFormatting = !0, i.dom.value = f, i._isFormatting = !1) : p && i._displayFormatted(p), g(i, m, p);
  }
  function u(i) {
    i._setHiddenRaw(""), h.set.call(i._picker, ""), i._isFormatting = !0, i.dom.value = "", i._isFormatting = !1, i._lastISO = "", g(i, "", null);
  }
  const a = /* @__PURE__ */ new Set();
  let n = !1;
  function s() {
    he(), !n && (n = !0, document.addEventListener("ln-core:locale-change", function() {
      a.forEach(function(i) {
        if (i.isTextElement)
          i._formatTextContent();
        else if (i.value) {
          const m = it(i.value);
          m && i._displayFormatted(m);
        }
      });
    }));
  }
  function r(i) {
    if (i[e]) return i[e];
    i[e] = this, this.dom = i;
    const m = this;
    if (a.add(this), s(), i.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const p = i.value, f = i.name, d = i.parentNode;
    if (d) {
      const b = d.querySelectorAll("[data-ln-date-dict]");
      for (let w = 0; w < b.length; w++) {
        const A = b[w].getAttribute("data-ln-date-dict");
        if (A) {
          const T = On(b[w], "data-ln-date-dict-key");
          T["months-long"] && (T.monthsLong = T["months-long"].split(",").map((L) => L.trim())), T["months-short"] && (T.monthsShort = T["months-short"].split(",").map((L) => L.trim())), Dn(A, T);
        }
      }
    }
    const _ = document.createElement("span");
    _.setAttribute("data-ln-date-field", ""), i.parentNode.insertBefore(_, i), _.appendChild(i), this._wrapper = _;
    const y = document.createElement("input");
    y.type = "hidden", y.name = f, i.removeAttribute("name"), i.hasAttribute("data-ln-fill-as") && y.setAttribute("data-ln-fill-as", i.getAttribute("data-ln-fill-as")), i.insertAdjacentElement("afterend", y), this._hidden = y;
    const E = document.createElement("input");
    E.type = "date", E.tabIndex = -1, E.setAttribute("tabindex", "-1"), E.setAttribute("aria-hidden", "true"), E.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Date picker"), E.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", E), this._picker = E, i.type = "text";
    const v = document.createElement("button");
    v.type = "button", v.setAttribute("aria-label", i.getAttribute("data-ln-date-label") || "Open date picker"), v.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', E.insertAdjacentElement("afterend", v), this._btn = v, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return h.get.call(y);
      },
      set: function(b) {
        if (h.set.call(y, b), b && b !== "") {
          const w = it(b);
          w && l(m, b, w);
        } else b === "" && u(m);
      }
    }), Ve(i, h, {
      get: function() {
        return h.get.call(i);
      },
      set: function(b, w) {
        if (m._isFormatting) {
          w(b);
          return;
        }
        if (!b || b === "") {
          w(""), u(m);
          return;
        }
        const A = it(b) || Vt(b);
        if (A) {
          const T = Ut(A), L = i.getAttribute(t) || "", x = Z(i), D = Dt(x), I = ie(A, L, x, D);
          w(I), l(m, T, A, I);
        } else
          w(String(b)), u(m);
      }
    }), this._onPickerChange = function() {
      const b = E.value;
      if (b) {
        const w = it(b);
        w && l(m, b, w);
      } else
        u(m);
    }, E.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const b = m.dom.value.trim();
      if (b === "") {
        m._lastISO !== "" && u(m);
        return;
      }
      if (m._lastISO) {
        const A = it(m._lastISO);
        if (A) {
          const T = m.dom.getAttribute(t) || "", L = Z(m.dom), x = Dt(L);
          if (b === ie(A, T, L, x)) return;
        }
      }
      const w = Vt(b);
      if (w) {
        const A = Ut(w);
        l(m, A, w);
      } else if (m._lastISO) {
        const A = it(m._lastISO);
        A && m._displayFormatted(A);
      } else
        m.dom.value = "";
    }, i.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      m._openPicker();
    }, v.addEventListener("click", this._onBtnClick);
    const S = i.form;
    if (S && (this._form = S, this._onFormReset = function() {
      setTimeout(function() {
        const b = m.dom.value;
        if (b) {
          const w = it(b) || Vt(b);
          if (w) {
            const A = Ut(w);
            l(m, A, w);
            return;
          }
        }
        u(m);
      }, 0);
    }, S.addEventListener("reset", this._onFormReset)), p && p !== "") {
      const b = it(p);
      b && l(m, p, b);
    }
    return this;
  }
  r.prototype._initTextElement = function() {
    const i = this.dom, m = i.getAttribute("data-ln-value"), p = i.getAttribute("data-ln-date"), f = i.getAttribute("datetime");
    let d = null;
    i.tagName === "TIME" && f !== null && f !== "" ? d = f : m !== null && m !== "" ? d = m : f !== null && f !== "" ? d = f : p !== null && p !== "" && p !== "true" && !Ne.test(p) ? d = p : d = i.textContent.trim();
    const _ = it(d) || Vt(d);
    if (_ && !isNaN(_.getTime())) {
      const y = Ut(_);
      this._rawValue = y, i.tagName !== "TIME" && !i.hasAttribute("data-ln-value") && i.setAttribute("data-ln-value", y), this._formatTextContent();
    } else
      this._rawValue = null;
  }, r.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const i = it(this._rawValue);
      if (i) {
        let p = this.dom.getAttribute("data-ln-date-format");
        if (!p) {
          const _ = this.dom.getAttribute("data-ln-date");
          _ && Ne.test(_) && (p = _);
        }
        const f = Z(this.dom), d = Dt(f);
        this.dom.textContent = ie(i, p || "medium", f, d);
      }
    }
  }, r.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, r.prototype._setHiddenRaw = function(i) {
    h.set.call(this._hidden, i);
  }, r.prototype._displayFormatted = function(i) {
    const m = this.dom.getAttribute(t) || "", p = Z(this.dom), f = Dt(p);
    this._isFormatting = !0, this.dom.value = ie(i, m, p, f), this._isFormatting = !1;
  }, Object.defineProperty(r.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : h.get.call(this._hidden);
    },
    set: function(i) {
      if (this.isTextElement) {
        if (!i || i === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const p = it(i) || Vt(i);
        if (!p) return;
        const f = Ut(p);
        this._rawValue = f, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", f) : this.dom.setAttribute("data-ln-value", f), this._formatTextContent();
        return;
      }
      if (!i || i === "") {
        u(this);
        return;
      }
      const m = it(i);
      m && l(this, i, m);
    }
  }), Object.defineProperty(r.prototype, "date", {
    get: function() {
      const i = this.value;
      return i ? it(i) : null;
    },
    set: function(i) {
      if (!i || !(i instanceof Date) || isNaN(i.getTime())) {
        this.value = "";
        return;
      }
      this.value = Ut(i);
    }
  }), Object.defineProperty(r.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), r.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (a.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const i = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", i && (this.dom.value = i), delete this.dom[e];
  }, H(t, e, r, "ln-date", {
    attributes: c,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: o
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-nav": { effect: l, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: xt, effect: l, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, c = Y(o);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const u = history.pushState;
    history.pushState = function() {
      u.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    };
    const a = history.replaceState;
    history.replaceState = function() {
      a.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    }, history._lnNavPatched = !0;
  }
  function h(u) {
    return this.dom = u, X(this, u, c), this.activeClass = u.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = null, this.update(), this;
  }
  h.prototype.update = function() {
    if (!this.activeClass || G(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const a = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, s = g(n), r = [];
    for (const i of a) {
      const m = i.getAttribute("href");
      if (!m || m === "#" || m.startsWith("#") || m.startsWith("javascript:") || m.startsWith("mailto:") || m.startsWith("tel:")) {
        i.classList.remove(this.activeClass), i.removeAttribute("aria-current");
        continue;
      }
      if (i.hostname && i.hostname !== window.location.hostname) {
        i.classList.remove(this.activeClass), i.removeAttribute("aria-current");
        continue;
      }
      const p = g(m), f = p === s, d = !this.exact && p !== "/" && s.startsWith(p + "/");
      f || d ? (i.classList.add(this.activeClass), i.setAttribute("aria-current", "page"), r.push(i)) : (i.classList.remove(this.activeClass), i.removeAttribute("aria-current"));
    }
    k(this.dom, "ln-nav:update", { target: this.dom, activeLinks: r });
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const u = history._lnNavCallbacks.indexOf(this.updateHandler);
    u !== -1 && history._lnNavCallbacks.splice(u, 1), delete this.dom[e];
  };
  function g(u) {
    try {
      return new URL(u, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return u.replace(/\/$/, "") || "/";
    }
  }
  function l(u, a) {
    const n = u[e];
    if (n) {
      if (a === t) {
        if (!u.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const s = n.activeClass, r = u.getAttribute(t) || "active";
        if (s !== r) {
          const i = u.querySelectorAll("a");
          for (const m of i)
            s && m.classList.remove(s);
          n.activeClass = r;
        }
      }
      n.update();
    }
  }
  H(t, e, h, "ln-nav", {
    attributes: o,
    onSubtreeChange: function(u) {
      u[e] && u[e].update();
    }
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(l, u) {
    const a = l.getAttribute("data-ln-persist"), n = a !== null && a !== "" ? a : l.id;
    return n ? l.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + u : "ln:" + n + ":" + u : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', l), null);
  }
  let o = null;
  function c() {
    if (o !== null) return o;
    try {
      if (typeof localStorage > "u") return o = !1;
      const l = "__ln_persist_test__";
      return localStorage.setItem(l, l), localStorage.removeItem(l), o = !0;
    } catch {
      return o = !1;
    }
  }
  const h = /* @__PURE__ */ new Set();
  function g(l, u) {
    const a = window.lnCore && window.lnCore._attrRegistry, n = a && a.persist || [];
    let s = null;
    for (let p = 0; p < n.length; p++)
      if (n[p].selector === u) {
        s = n[p];
        break;
      }
    if (!s) return;
    const r = s.persist;
    if (h.has(r.attr) || (h.add(r.attr), Pt([r.attr], function(p, f) {
      if (!p.hasAttribute("data-ln-persist") || r.hashActive && r.hashActive(p)) return;
      const d = e(p, f);
      if (!d || !c()) return;
      const _ = p.getAttribute(f);
      try {
        _ === null ? localStorage.removeItem(d) : localStorage.setItem(d, _);
      } catch {
      }
    })), r.hashActive && r.hashActive(l)) return;
    const i = e(l, r.attr);
    if (!i || !c()) return;
    const m = localStorage.getItem(i);
    m !== null && l.setAttribute(r.attr, m);
  }
  $i(g);
})();
function mn(t, e, o, c) {
  const h = (t || "").toLowerCase().trim();
  if (h) return h;
  if ((e || "").toUpperCase() !== "A") return "";
  const g = o || "";
  if (!g.startsWith("#")) return "";
  const l = g.slice(1);
  if (!l) return "";
  const u = l.split("&"), a = (c || "").toLowerCase().trim();
  if (a)
    for (const r of u) {
      const i = r.indexOf(":");
      if (i > 0 && r.slice(0, i).toLowerCase().trim() === a)
        return r.slice(i + 1).toLowerCase().trim();
    }
  const n = u[u.length - 1] || "", s = n.indexOf(":");
  return (s > 0 ? n.slice(s + 1) : n).toLowerCase().trim();
}
function gn(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const o = t.filter(
    (g) => (g.tagName || "").toUpperCase() === "A" && (g.href || "").startsWith("#")
  ), c = o.length > 0 && o.length === t.length, h = (e || "").toLowerCase().trim();
  return o.length > 0 && o.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : c && !h ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: c && !!h,
    warning: null
  };
}
function _n(t, e, o) {
  const c = (t || "").toLowerCase().trim();
  return c && Array.isArray(e) && e.includes(c) ? c : (o || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function o(a) {
    const n = a.getAttribute("data-ln-tabs-active");
    a[e] && a[e]._applyActive(n);
  }
  function c(a, n) {
    return (a.getAttribute(n) || a.id || "").toLowerCase().trim();
  }
  const h = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: o, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: xt, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: c, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, g = Y(h);
  function l(a) {
    return this.dom = a, X(this, a, g), this.activeKey = null, u.call(this), this;
  }
  function u() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const a = this.tabs.map((r) => ({
      tagName: r.tagName,
      href: r.getAttribute("href")
    })), n = gn(a, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const r of this.tabs) {
      const i = mn(r.getAttribute("data-ln-tab"), r.tagName, r.getAttribute("href"), this.nsKey);
      i ? this.mapTabs[i] = r : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', r);
    }
    for (const r of this.panels) {
      const i = (r.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      i && (this.mapPanels[i] = r);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const s = this;
    this._clickHandlers = [];
    for (const r of this.tabs) {
      if (r[e + "Trigger"]) continue;
      const i = function(m) {
        const p = r.tagName === "A";
        if (!p && (m.ctrlKey || m.metaKey || m.button === 1)) return;
        const f = mn(r.getAttribute("data-ln-tab"), r.tagName, r.getAttribute("href"), s.nsKey);
        f && (p && !Ye(m) || (s.hashEnabled ? lt(s.nsKey) === f ? s.dom.setAttribute("data-ln-tabs-active", f) : bt(s.nsKey, f) : s.dom.setAttribute("data-ln-tabs-active", f)));
      };
      r.addEventListener("click", i), r[e + "Trigger"] = i, s._clickHandlers.push({ el: r, handler: i });
    }
    if (this._onRequestSelect = function(r) {
      const i = r.detail && (r.detail.key || r.detail.tab);
      i && s.select(i);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!s.hashEnabled) return;
      const r = lt(s.nsKey);
      s.dom.setAttribute("data-ln-tabs-active", r !== null ? r : s.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const r = _n(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", r);
    }
  }
  l.prototype.select = function(a) {
    const n = (a + "").toLowerCase().trim();
    n && (this.hashEnabled ? lt(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : bt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, l.prototype._applyActive = function(a) {
    var s;
    if (a = _n(a, Object.keys(this.mapPanels), this.defaultKey), a === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && G(this.dom, "ln-tabs:before-change", {
      key: a,
      previousKey: n,
      tab: this.mapTabs[a],
      panel: this.mapPanels[a],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && lt(this.nsKey) !== n && bt(this.nsKey, n));
      return;
    }
    this.activeKey = a;
    for (const r in this.mapTabs) {
      const i = this.mapTabs[r];
      r === a ? (i.hasAttribute("data-active") || i.setAttribute("data-active", ""), i.getAttribute("aria-selected") !== "true" && i.setAttribute("aria-selected", "true")) : (i.hasAttribute("data-active") && i.removeAttribute("data-active"), i.getAttribute("aria-selected") !== "false" && i.setAttribute("aria-selected", "false"));
    }
    for (const r in this.mapPanels) {
      const i = this.mapPanels[r], m = r === a;
      i.hidden !== !m && (i.hidden = !m), i.classList.contains("hidden") !== !m && i.classList.toggle("hidden", !m);
      const p = m ? "false" : "true";
      i.getAttribute("aria-hidden") !== p && i.setAttribute("aria-hidden", p);
    }
    if (this.autoFocus) {
      const r = (s = this.mapPanels[a]) == null ? void 0 : s.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      r && setTimeout(() => r.focus({ preventScroll: !0 }), 0);
    }
    k(this.dom, "ln-tabs:change", {
      key: a,
      previousKey: n,
      tab: this.mapTabs[a],
      panel: this.mapPanels[a],
      target: this.dom
    });
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: a, handler: n } of this._clickHandlers)
        a.removeEventListener("click", n), delete a[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, H(t, e, l, "ln-tabs", {
    attributes: h,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(a) {
        const n = Array.from(a.querySelectorAll("[data-ln-tab]")).map(function(r) {
          return { tagName: r.tagName, href: r.getAttribute("href") };
        }), s = (a.getAttribute("data-ln-tabs-key") || a.id || "").toLowerCase().trim();
        return gn(n, s).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", o = "data-ln-toggle-for", c = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-toggle": { effect: i, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, g = /* @__PURE__ */ new Set();
  let l = null;
  function u(m, p) {
    return p === "open" ? "open" : p === "close" || m === "open" ? "close" : "open";
  }
  function a() {
    l || (l = function(m) {
      if (He(m)) return;
      const p = m.target.closest("[" + o + "]");
      if (!p || ze(p)) return;
      const f = p.getAttribute(o);
      if (!f) return;
      const d = document.getElementById(f);
      if (!d || !d[e]) return;
      m.preventDefault();
      const _ = p.getAttribute(c) || "toggle", y = d.getAttribute(t);
      d.setAttribute(t, u(y, _));
    }, document.addEventListener("click", l));
  }
  function n() {
    g.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function s(m, p) {
    if (!m || !m.id) return;
    const f = document.querySelectorAll(
      "[" + o + '="' + m.id + '"]'
    );
    for (let d = 0; d < f.length; d++)
      f[d].setAttribute("aria-expanded", p ? "true" : "false");
  }
  function r(m) {
    this.dom = m;
    const p = this;
    return this._onRequestOpen = function() {
      p.open();
    }, this._onRequestClose = function() {
      p.close();
    }, this._onRequestToggle = function() {
      p.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = m.getAttribute(t) === "open", this.isOpen && m.classList.add("open"), s(m, this.isOpen), g.add(this), a(), this;
  }
  r.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, r.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, r.prototype.toggle = function() {
    const m = this.dom.getAttribute(t);
    this.dom.setAttribute(t, u(m, "toggle"));
  }, r.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), g.delete(this), delete this.dom[e], n());
  };
  function i(m) {
    const p = m[e];
    if (!p) return;
    const d = m.getAttribute(t) === "open";
    if (d !== p.isOpen)
      if (d) {
        if (G(m, "ln-toggle:before-open", { target: m }).defaultPrevented) {
          m.setAttribute(t, "close");
          return;
        }
        p.isOpen = !0, m.classList.add("open"), s(m, !0), k(m, "ln-toggle:open", { target: m });
      } else {
        if (G(m, "ln-toggle:before-close", { target: m }).defaultPrevented) {
          m.setAttribute(t, "open");
          return;
        }
        p.isOpen = !1, m.classList.remove("open"), s(m, !1), k(m, "ln-toggle:close", { target: m });
      }
  }
  H(t, e, r, "ln-toggle", {
    attributes: h,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function c(h) {
    return this.dom = h, this._onToggleOpen = function(g) {
      if (!g.detail || !g.detail.target || g.detail.target.closest("[data-ln-accordion]") !== h) return;
      const l = h.querySelectorAll("[data-ln-toggle]");
      for (const u of l)
        u !== g.detail.target && u.closest("[data-ln-accordion]") === h && u.getAttribute("data-ln-toggle") === "open" && u.setAttribute("data-ln-toggle", "close");
      k(h, "ln-accordion:change", { target: g.detail.target });
    }, h.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, H(t, e, c, "ln-accordion", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", o = "bottom-end";
  if (window[e] !== void 0) return;
  const c = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: o, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, h = Y(c);
  function g(l) {
    this.dom = l, X(this, l, h), this.toggleEl = l.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = l.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const u = this;
    return this._onRequestOpen = function() {
      u.toggleEl && u.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      u.toggleEl && u.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (u.toggleEl) {
        const a = u.toggleEl.getAttribute("data-ln-toggle");
        u.toggleEl.setAttribute("data-ln-toggle", a === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(a) {
      const n = u.toggleEl && u.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (a.key === "Escape") {
        n && (a.preventDefault(), a.stopPropagation(), u.toggleEl.setAttribute("data-ln-toggle", "close"), u.triggerBtn && u.triggerBtn.focus());
        return;
      }
      if (a.key === "Tab") {
        n && (u.triggerBtn && u.triggerBtn.focus(), u.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const s = u._getMenuItems();
      if (s.length === 0) return;
      if (!n && (a.key === "ArrowDown" || a.key === "ArrowUp")) {
        a.preventDefault(), u.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const i = u._getMenuItems();
          i.length > 0 && u._focusItem(i, a.key === "ArrowDown" ? 0 : i.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const r = s.indexOf(document.activeElement);
      if (a.key === "ArrowDown") {
        a.preventDefault();
        const i = r < s.length - 1 ? r + 1 : 0;
        u._focusItem(s, i);
      } else if (a.key === "ArrowUp") {
        a.preventDefault();
        const i = r > 0 ? r - 1 : s.length - 1;
        u._focusItem(s, i);
      } else a.key === "Home" ? (a.preventDefault(), u._focusItem(s, 0)) : a.key === "End" && (a.preventDefault(), u._focusItem(s, s.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(a) {
      !a.detail || a.detail.target !== u.toggleEl || (u.triggerBtn && u.triggerBtn.setAttribute("aria-expanded", "true"), typeof u.toggleEl.showPopover == "function" && u.toggleEl.showPopover(), u._initMenuAria(), u._reposition(), u._addOutsideClickListener(), u._addScrollRepositionListener(), u._addResizeCloseListener(), k(l, "ln-dropdown:open", { target: a.detail.target }));
    }, this._onToggleClose = function(a) {
      !a.detail || a.detail.target !== u.toggleEl || (u.triggerBtn && u.triggerBtn.setAttribute("aria-expanded", "false"), u._removeOutsideClickListener(), u._removeScrollRepositionListener(), u._removeResizeCloseListener(), u.toggleEl.style.top = "", u.toggleEl.style.left = "", u.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof u.toggleEl.hidePopover == "function" && u.toggleEl.matches(":popover-open") && u.toggleEl.hidePopover(), k(l, "ln-dropdown:close", { target: a.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  g.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const l = this.toggleEl.querySelectorAll("li");
    for (const a of l)
      a.setAttribute("role", "none");
    const u = this._getMenuItems();
    for (let a = 0; a < u.length; a++)
      u[a].setAttribute("role", "menuitem"), u[a].setAttribute("tabindex", a === 0 ? "0" : "-1");
  }, g.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, g.prototype._focusItem = function(l, u) {
    for (let a = 0; a < l.length; a++)
      l[a].setAttribute("tabindex", a === u ? "0" : "-1");
    l[u] && l[u].focus();
  }, g.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl || !document.contains(this.toggleEl)) return;
    const l = this.triggerBtn.getBoundingClientRect(), u = Ie(this.toggleEl), a = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || o, s = de(l, u, n, a), r = s.top + "px", i = s.left + "px";
    this.toggleEl.style.top !== r && (this.toggleEl.style.top = r), this.toggleEl.style.left !== i && (this.toggleEl.style.left = i), this.toggleEl.getAttribute("data-ln-dropdown-placement") !== s.placement && this.toggleEl.setAttribute("data-ln-dropdown-placement", s.placement);
  }, g.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const l = this;
    this._boundDocClick = function(u) {
      l.dom.contains(u.target) || l.toggleEl && l.toggleEl.contains(u.target) || l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open" && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, l._docClickTimeout = setTimeout(function() {
      l._docClickTimeout = null, document.addEventListener("click", l._boundDocClick);
    }, 0);
  }, g.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, g.prototype._addScrollRepositionListener = function() {
    const l = this;
    this._scrollRepositionRaf = null, this._boundScrollReposition = function() {
      l._scrollRepositionRaf || (l._scrollRepositionRaf = requestAnimationFrame(function() {
        l._scrollRepositionRaf = null, l._reposition();
      }));
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, g.prototype._removeScrollRepositionListener = function() {
    this._scrollRepositionRaf && (cancelAnimationFrame(this._scrollRepositionRaf), this._scrollRepositionRaf = null), this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, g.prototype._addResizeCloseListener = function() {
    const l = this;
    this._boundResizeClose = function() {
      l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open" && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, g.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), delete this.dom[e]);
  }, H(t, e, g, "ln-dropdown", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", o = "data-ln-popover-for", c = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: r, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, g = [];
  let l = null;
  function u() {
    l || (l = function(i) {
      if (i.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", l));
  }
  function a() {
    g.length > 0 || l && (document.removeEventListener("keydown", l), l = null);
  }
  function n(i) {
    this.dom = i, this.isOpen = i.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const m = this;
    return this._onRequestOpen = function(p) {
      const f = p.detail && p.detail.trigger ? p.detail.trigger : null;
      m.open(f);
    }, this._onRequestClose = function() {
      m.close();
    }, this._onRequestToggle = function(p) {
      const f = p.detail && p.detail.trigger ? p.detail.trigger : null;
      m.toggle(f);
    }, this._onNativeToggle = function(p) {
      p.newState === "closed" && m.isOpen && (m._applyClose(), m.dom.setAttribute(t, "closed"));
    }, i.addEventListener("ln-popover:request-open", this._onRequestOpen), i.addEventListener("ln-popover:request-close", this._onRequestClose), i.addEventListener("ln-popover:request-toggle", this._onRequestToggle), i.addEventListener("toggle", this._onNativeToggle), i.hasAttribute("tabindex") || i.setAttribute("tabindex", "-1"), i.hasAttribute("role") || i.setAttribute("role", "dialog"), i.hasAttribute("popover") || i.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(i) {
    this.isOpen || (this.trigger = i || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(i) {
    this.isOpen ? this.close() : this.open(i);
  }, n.prototype._applyOpen = function(i) {
    this.isOpen = !0, i && (this.trigger = i), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const m = Ie(this.dom);
    if (this.trigger) {
      const _ = this.trigger.getBoundingClientRect(), y = this.dom.getAttribute(c) || "bottom", E = de(_, m, y, 8);
      this.dom.style.top = E.top + "px", this.dom.style.left = E.left + "px", this.dom.setAttribute("data-ln-popover-placement", E.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const p = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), f = Array.prototype.find.call(p, $t);
    f ? f.focus() : this.dom.focus();
    const d = this;
    this._boundDocClick = function(_) {
      d.dom.contains(_.target) || d.trigger && d.trigger.contains(_.target) || d.close();
    }, d._docClickTimeout = setTimeout(function() {
      d._docClickTimeout = null, document.addEventListener("click", d._boundDocClick);
    }, 0), this._repositionRaf = null, this._performReposition = function() {
      if (!d.trigger || !document.contains(d.dom)) return;
      const _ = d.trigger.getBoundingClientRect(), y = Ie(d.dom), E = d.dom.getAttribute(c) || "bottom", v = de(_, y, E, 8), S = v.top + "px", b = v.left + "px";
      d.dom.style.top !== S && (d.dom.style.top = S), d.dom.style.left !== b && (d.dom.style.left = b), d.dom.getAttribute("data-ln-popover-placement") !== v.placement && d.dom.setAttribute("data-ln-popover-placement", v.placement);
    }, this._boundReposition = function() {
      d._repositionRaf || (d._repositionRaf = requestAnimationFrame(function() {
        d._repositionRaf = null, d._performReposition();
      }));
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), u(), k(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const i = g.indexOf(this);
    i !== -1 && g.splice(i, 1), a(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, k(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.dom.removeEventListener("toggle", this._onNativeToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function s(i) {
    this.dom = i;
    const m = i.getAttribute(o);
    return i.setAttribute("aria-haspopup", "dialog"), i.setAttribute("aria-expanded", "false"), i.setAttribute("aria-controls", m), this._onClick = function(p) {
      if (p.ctrlKey || p.metaKey || p.button === 1) return;
      p.preventDefault();
      const f = document.getElementById(m);
      if (!f) return;
      f[e] && (f[e].trigger = i);
      const d = f.getAttribute(t);
      f.setAttribute(t, d === "open" ? "closed" : "open");
    }, i.addEventListener("click", this._onClick), this;
  }
  s.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function r(i) {
    const m = i[e];
    if (!m) return;
    const f = i.getAttribute(t) === "open";
    if (f !== m.isOpen)
      if (f) {
        if (G(i, "ln-popover:before-open", {
          popoverId: i.id,
          target: i,
          trigger: m.trigger
        }).defaultPrevented) {
          i.setAttribute(t, "closed");
          return;
        }
        m._applyOpen(m.trigger);
      } else {
        if (G(i, "ln-popover:before-close", {
          popoverId: i.id,
          target: i,
          trigger: m.trigger
        }).defaultPrevented) {
          i.setAttribute(t, "open");
          return;
        }
        m._applyClose();
      }
  }
  H(t, e, n, "ln-popover", {
    attributes: h
  }), H(o, e + "Trigger", s, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", o = "data-ln-tooltip-position", c = "lnTooltipEnhance", h = "ln-tooltip-portal";
  if (window[c] !== void 0) return;
  const g = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let l = 0, u = null, a = null, n = null, s = null, r = null, i = null;
  function m() {
    return u && u.parentNode || (u = document.getElementById(h), u || (u = document.createElement("div"), u.id = h, document.body.appendChild(u)), u.hasAttribute("popover") || u.setAttribute("popover", "manual")), u;
  }
  function p() {
    i || (i = function(E) {
      E.key === "Escape" && _();
    }, document.addEventListener("keydown", i));
  }
  function f() {
    i && (document.removeEventListener("keydown", i), i = null);
  }
  function d(E) {
    if (n === E) return;
    _();
    const v = E.getAttribute(e) || E.getAttribute("title");
    if (!v) return;
    m(), typeof u.showPopover == "function" && u.showPopover(), E.hasAttribute("title") && (s = E.getAttribute("title"), E.removeAttribute("title"));
    const S = E.getAttribute("aria-describedby");
    S ? r = S : r = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = v, E[c + "Uid"] || (l += 1, E[c + "Uid"] = "ln-tooltip-" + l), b.id = E[c + "Uid"], u.appendChild(b);
    const w = b.offsetWidth, A = b.offsetHeight, T = E.getBoundingClientRect(), L = E.getAttribute(o) || "top", x = de(T, { width: w, height: A }, L, 6);
    b.style.top = x.top + "px", b.style.left = x.left + "px", b.setAttribute("data-ln-tooltip-placement", x.placement), r ? E.setAttribute("aria-describedby", r + " " + b.id) : E.setAttribute("aria-describedby", b.id), a = b, n = E, p();
  }
  function _() {
    if (!a) {
      f();
      return;
    }
    n && (r !== null ? n.setAttribute("aria-describedby", r) : n.removeAttribute("aria-describedby"), r = null, s !== null && n.setAttribute("title", s)), s = null, a.parentNode && a.parentNode.removeChild(a), a = null, n = null, u && typeof u.hidePopover == "function" && u.matches(":popover-open") && u.hidePopover(), f();
  }
  function y(E) {
    return this.dom = E, E.hasAttribute("data-ln-tooltip-enhanced") || (E.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      d(E);
    }, this._onLeave = function() {
      n === E && !E.contains(document.activeElement) && _();
    }, this._onFocus = function() {
      d(E);
    }, this._onBlur = function() {
      n === E && !E.matches(":hover") && _();
    }, E.addEventListener("mouseenter", this._onEnter), E.addEventListener("mouseleave", this._onLeave), E.addEventListener("focus", this._onFocus, !0), E.addEventListener("blur", this._onBlur, !0), this;
  }
  y.prototype.destroy = function() {
    const E = this.dom;
    E.removeEventListener("mouseenter", this._onEnter), E.removeEventListener("mouseleave", this._onLeave), E.removeEventListener("focus", this._onFocus, !0), E.removeEventListener("blur", this._onBlur, !0), n === E && _(), this._addedEnhancedAttr && E.removeAttribute("data-ln-tooltip-enhanced"), delete E[c], delete E[c + "Uid"];
  }, H(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    c,
    y,
    "ln-tooltip",
    {
      attributes: g
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", o = "ln-toast-item";
  if (window[e] !== void 0) return;
  const c = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: qt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: qt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, h = Y(c);
  function g(d) {
    if (!(!d || !(d instanceof HTMLElement)) && (d.hasAttribute("popover") || d.setAttribute("popover", "manual"), typeof d.showPopover == "function")) {
      if (d.matches(":popover-open"))
        try {
          d.hidePopover();
        } catch {
        }
      try {
        d.showPopover();
      } catch {
      }
    }
  }
  function l(d) {
    if (!d || !(d instanceof HTMLElement)) return;
    if (d.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof d.hidePopover == "function" && d.matches(":popover-open"))
      try {
        d.hidePopover();
      } catch {
      }
  }
  function u(d) {
    this.dom = d, X(this, d, h);
    const _ = Array.from(d.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length > this.max; ) d.removeChild(_.shift());
    for (const y of _) m(y, this);
    return _.length > 0 && g(d), this;
  }
  u.prototype.enqueue = function(d) {
    if (!d) return;
    const _ = a(d, this.dom);
    if (!_) return;
    const y = Number.isFinite(d.timeout) ? d.timeout : this.timeoutDefault;
    s(this, _), y > 0 && (_._timer = setTimeout(() => r(_), y));
  }, u.prototype.clear = function() {
    for (const d of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      r(d);
  }, u.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const d of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        r(d);
      l(this.dom), delete this.dom[e];
    }
  };
  function a(d, _) {
    const y = ((d.type || "") + "").trim().toLowerCase(), E = st(_, o, "ln-toast");
    if (!E)
      return console.warn('[ln-toast] Template "' + o + '" not found'), null;
    mt(E, {
      type: y,
      title: d.title,
      message: typeof d.message == "string" ? d.message : void 0
    });
    const v = E.firstElementChild;
    if (!v) return null;
    v.hasAttribute("data-ln-toast-item") || v.setAttribute("data-ln-toast-item", ""), v.classList.add("ln-enter");
    const S = v.querySelector('[data-ln-field="message"]');
    S && n(S, d);
    const b = v.querySelector("[data-ln-toast-close]");
    return b && b.addEventListener("click", function() {
      r(v);
    }), v;
  }
  function n(d, _) {
    if (Array.isArray(_.message)) {
      const y = document.createElement("ul");
      for (const E of _.message) {
        const v = document.createElement("li");
        v.textContent = E, y.appendChild(v);
      }
      d.appendChild(y);
    }
    if (_.data && _.data.errors) {
      const y = document.createElement("ul");
      for (const E of Object.values(_.data.errors).flat()) {
        const v = document.createElement("li");
        v.textContent = E, y.appendChild(v);
      }
      d.appendChild(y);
    }
  }
  function s(d, _) {
    const y = Array.from(d.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; y.length >= d.max && y.length > 0; ) d.dom.removeChild(y.shift());
    d.dom.appendChild(_), g(d.dom), requestAnimationFrame(() => _.classList.remove("ln-enter"));
  }
  function r(d) {
    if (!d || !d.parentNode) return;
    const _ = d.parentNode;
    clearTimeout(d._timer), d.classList.remove("ln-enter"), d.classList.add("ln-out"), setTimeout(() => {
      d.parentNode && (d.parentNode.removeChild(d), l(_));
    }, 200);
  }
  function i(d) {
    let _ = d && d.container;
    return typeof _ == "string" && (_ = document.querySelector(_)), _ instanceof HTMLElement || (_ = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), _ || null;
  }
  function m(d, _) {
    if (d._lnToastHydrated) return;
    d._lnToastHydrated = !0;
    const y = d.querySelector("[data-ln-toast-close]");
    y && y.addEventListener("click", function() {
      r(d);
    });
    const E = +(d.getAttribute("data-ln-toast-timeout") ?? _.timeoutDefault);
    E > 0 && (d._timer = setTimeout(function() {
      r(d);
    }, E));
  }
  function p(d) {
    const _ = d.detail || {}, y = i(_);
    if (!y) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (y[e] || (y[e] = new u(y))).enqueue(_);
  }
  function f(d) {
    const _ = d && d.detail || {};
    if (_.container) {
      const y = i(_);
      y && (y[e] || (y[e] = new u(y))).clear();
    } else {
      const y = document.querySelectorAll("[" + t + "]");
      for (const E of Array.from(y))
        (E[e] || (E[e] = new u(E))).clear();
    }
  }
  ft(function() {
    window.addEventListener("ln-toast:enqueue", p), window.addEventListener("ln-toast:clear", f), window.addEventListener("ln-modal:open", function() {
      const d = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const _ of Array.from(d))
        _.querySelectorAll("[data-ln-toast-item]").length > 0 && g(_);
    });
  }, "ln-toast"), H(t, e, u, "ln-toast", {
    attributes: c
  });
})();
function qr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((o) => o.trim().toLowerCase()).filter(Boolean).map((o) => o.startsWith(".") ? o.slice(1) : o);
  return e.length ? e : null;
}
function bi(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function xr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const o = bi(t.name), c = String(t.type || "").toLowerCase();
  return e.some((h) => {
    if (h.includes("/")) {
      if (h.endsWith("/*")) {
        const g = h.slice(0, -1);
        return c.startsWith(g);
      }
      return c === h;
    }
    return o === h;
  });
}
function Ir(t, e = "en", o = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (o["unit-b"] || "B");
  const c = 1024, h = [
    o["unit-b"] || "B",
    o["unit-kb"] || "KB",
    o["unit-mb"] || "MB",
    o["unit-gb"] || "GB"
  ], g = Math.floor(Math.log(t) / Math.log(c)), l = Math.min(g, h.length - 1), u = t / Math.pow(c, l);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(u) + " " + h[l];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", o = "file", c = "file_ids[]";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-upload": { prop: "uploadUrl", read: j, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: j, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: qt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: qt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: j, type: "string", fallback: o, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: j, type: "string", fallback: c, description: "Form field name for submitting uploaded file IDs" },
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
  }, g = Y(h);
  function l(n, s, r) {
    return Ir(n, s, r);
  }
  function u() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function a(n) {
    this.dom = n, X(this, n, g), this.dict = On(n, "data-ln-upload-dict"), this.locale = Z(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const s = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = qr(s), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  a.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const s = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let i = 0; i < s.length; i++) {
      const m = s[i], p = m.getAttribute("data-ln-upload-id"), f = "file-" + ++n.fileIdCounter;
      m.setAttribute("data-ln-upload-local-id", f);
      const d = m.querySelector('[data-ln-field="name"]'), _ = m.querySelector('[data-ln-field="sizeText"]'), y = m.getAttribute("data-ln-upload-size"), E = y ? parseInt(y, 10) : null;
      n.uploadedFiles.set(f, {
        serverId: p || null,
        name: d ? d.textContent.trim() : "",
        size: E !== null && !isNaN(E) ? E : _ ? _.textContent.trim() : ""
      });
    }
    const r = this.dom.querySelectorAll('input[type="hidden"]');
    for (let i = 0; i < r.length; i++) {
      const m = r[i];
      if (m.name === n.idsFieldName && m.value && !Array.from(n.uploadedFiles.values()).some(function(f) {
        return String(f.serverId) === String(m.value);
      })) {
        const f = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(f, {
          serverId: m.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, a.prototype._syncHiddenInputs = function() {
    const n = this, s = this.dom.querySelectorAll('input[type="hidden"]');
    for (let r = 0; r < s.length; r++)
      s[r].name === n.idsFieldName && s[r].remove();
    for (const [, r] of this.uploadedFiles)
      if (r.serverId) {
        const i = document.createElement("input");
        i.type = "hidden", i.name = n.idsFieldName, i.value = r.serverId, n.dom.appendChild(i);
      }
  }, a.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(s) {
      n.zone === n.dom && s.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && s.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(s) {
      s.preventDefault(), s.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(s) {
      s.preventDefault(), s.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(s) {
      s.preventDefault(), s.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(s) {
      s.preventDefault(), s.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), s.dataTransfer && s.dataTransfer.files && n.upload(s.dataTransfer.files);
    }, this._onListClick = function(s) {
      const r = s.target.closest('[data-ln-upload-action="remove"]');
      if (!r || !n.list || !n.list.contains(r) || r.disabled) return;
      const i = r.closest("[data-ln-upload-item]");
      if (i) {
        const m = i.getAttribute("data-ln-upload-local-id");
        m && n.remove(m);
      }
    }, this._onRequestUpload = function(s) {
      s.detail && s.detail.files && n.upload(s.detail.files);
    }, this._onRequestRemove = function(s) {
      if (s.detail) {
        const r = s.detail.localId !== void 0 ? s.detail.localId : s.detail.serverId;
        r !== void 0 && n.remove(r);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, a.prototype.upload = function(n) {
    const s = this, r = Array.from(n);
    for (let i = 0; i < r.length; i++) {
      const m = r[i];
      if (s.maxFiles > 0 && s.uploadedFiles.size >= s.maxFiles) {
        k(s.dom, "ln-upload:invalid", {
          file: m,
          reason: "max-files"
        });
        continue;
      }
      if (!xr(m, s.allowedExts)) {
        k(s.dom, "ln-upload:invalid", {
          file: m,
          reason: "accept"
        });
        continue;
      }
      if (s.maxSize > 0 && m.size > s.maxSize) {
        k(s.dom, "ln-upload:invalid", {
          file: m,
          reason: "max-size"
        });
        continue;
      }
      G(s.dom, "ln-upload:before-upload", { file: m }).defaultPrevented || s._uploadSingleFile(m);
    }
  }, a.prototype._uploadSingleFile = function(n) {
    const s = this, r = "file-" + ++s.fileIdCounter, i = bi(n.name);
    let m = null;
    if (this.list) {
      const y = st(this.dom, "ln-upload-item", "ln-upload");
      if (y && (m = y.firstElementChild, m)) {
        m.setAttribute("data-ln-upload-item", ""), m.setAttribute("data-ln-upload-local-id", r), m.setAttribute("data-ln-upload-ext", i), m.setAttribute("data-ln-upload-state", "uploading"), mt(m, {
          name: n.name,
          sizeText: "0%",
          removeLabel: s.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const E = m.querySelector('[data-ln-upload-action="remove"]');
        E && (E.disabled = !0);
        const v = m.querySelector("[data-ln-progress]");
        v && v.setAttribute("data-ln-progress", "0"), s.list.appendChild(m);
      }
    }
    const p = new FormData();
    p.append(s.fileFieldName, n);
    const f = this.dom.querySelectorAll("input, select, textarea");
    for (let y = 0; y < f.length; y++) {
      const E = f[y];
      !E.name || E.name === s.idsFieldName || E.type === "file" || (E.type === "checkbox" || E.type === "radio") && !E.checked || p.append(E.name, E.value);
    }
    const d = new XMLHttpRequest();
    s.uploadedFiles.set(r, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: d
    }), d.upload.addEventListener("progress", function(y) {
      if (y.lengthComputable) {
        const E = Math.round(y.loaded / y.total * 100);
        if (m) {
          const v = m.querySelector("[data-ln-progress]");
          v && v.setAttribute("data-ln-progress", String(E)), mt(m, { sizeText: E + "%" });
        }
        k(s.dom, "ln-upload:progress", {
          localId: r,
          file: n,
          percent: E,
          loaded: y.loaded,
          total: y.total
        });
      }
    }), d.addEventListener("load", function() {
      const y = s.uploadedFiles.get(r);
      if (y && delete y.xhr, d.status >= 200 && d.status < 300) {
        let E;
        try {
          E = JSON.parse(d.responseText);
        } catch (S) {
          _(s.dict.error || "Error", d.status, S);
          return;
        }
        const v = E.id || E.serverId;
        if (m) {
          m.removeAttribute("data-ln-upload-state"), v && m.setAttribute("data-ln-upload-id", String(v)), mt(m, {
            sizeText: l(E.size || n.size, s.locale, s.dict),
            uploading: !1
          });
          const S = m.querySelector('[data-ln-upload-action="remove"]');
          S && (S.disabled = !1);
        }
        y && (y.serverId = v, y.size = E.size || n.size, y.name = E.name || n.name), s._syncHiddenInputs(), k(s.dom, "ln-upload:uploaded", {
          localId: r,
          serverId: v,
          name: E.name || n.name,
          size: E.size || n.size,
          response: E
        });
      } else {
        let E = "";
        try {
          E = JSON.parse(d.responseText).message || "";
        } catch {
        }
        _(E, d.status, null);
      }
    }), d.addEventListener("error", function() {
      const y = s.uploadedFiles.get(r);
      y && delete y.xhr, _("", 0, null);
    });
    function _(y, E, v) {
      if (m) {
        m.setAttribute("data-ln-upload-state", "error"), mt(m, {
          sizeText: s.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const S = m.querySelector('[data-ln-upload-action="remove"]');
        S && (S.disabled = !1);
      }
      k(s.dom, "ln-upload:error", {
        file: n,
        message: y,
        status: E,
        error: v
      });
    }
    s.uploadUrl ? (d.open("POST", s.uploadUrl), d.setRequestHeader("X-CSRF-TOKEN", u()), d.setRequestHeader("X-Requested-With", "XMLHttpRequest"), d.setRequestHeader("Accept", "application/json"), d.send(p)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, a.prototype.remove = function(n) {
    const s = this;
    let r = null, i = null;
    if (s.uploadedFiles.has(n))
      r = n, i = s.uploadedFiles.get(n);
    else
      for (const [d, _] of s.uploadedFiles)
        if (String(_.serverId) === String(n)) {
          r = d, i = _;
          break;
        }
    if (!r || !i || G(s.dom, "ln-upload:before-remove", {
      localId: r,
      serverId: i.serverId
    }).defaultPrevented) return;
    const p = s.list ? s.list.querySelector('[data-ln-upload-local-id="' + r + '"]') : null;
    if (i.xhr && typeof i.xhr.abort == "function" && i.xhr.abort(), !i.serverId) {
      p && p.remove(), s.uploadedFiles.delete(r), s._syncHiddenInputs(), k(s.dom, "ln-upload:removed", { localId: r, serverId: null });
      return;
    }
    let f = null;
    if (s.deleteUrlPattern ? f = s.deleteUrlPattern.replace("{id}", encodeURIComponent(i.serverId)) : s.uploadUrl && s.uploadUrl.includes("{id}") && (f = s.uploadUrl.replace("{id}", encodeURIComponent(i.serverId))), !f) {
      p && p.remove(), s.uploadedFiles.delete(r), s._syncHiddenInputs(), k(s.dom, "ln-upload:removed", { localId: r, serverId: i.serverId });
      return;
    }
    p && (p.setAttribute("data-ln-upload-state", "deleting"), mt(p, { deleting: !0 })), fetch(f, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": u(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(d) {
      d.ok ? (p && p.remove(), s.uploadedFiles.delete(r), s._syncHiddenInputs(), k(s.dom, "ln-upload:removed", {
        localId: r,
        serverId: i.serverId
      })) : (p && (p.removeAttribute("data-ln-upload-state"), mt(p, { deleting: !1 })), k(s.dom, "ln-upload:error", {
        file: i,
        message: "",
        status: d.status
      }));
    }).catch(function(d) {
      p && (p.removeAttribute("data-ln-upload-state"), mt(p, { deleting: !1 })), k(s.dom, "ln-upload:error", {
        file: i,
        message: "",
        status: 0,
        error: d
      });
    });
  }, a.prototype.clear = function() {
    const n = this;
    if (!G(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, r] of this.uploadedFiles)
        if (r.xhr && typeof r.xhr.abort == "function" && r.xhr.abort(), r.serverId) {
          let i = null;
          n.deleteUrlPattern ? i = n.deleteUrlPattern.replace("{id}", encodeURIComponent(r.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (i = n.uploadUrl.replace("{id}", encodeURIComponent(r.serverId))), i && fetch(i, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": u(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), k(n.dom, "ln-upload:cleared", {});
    }
  }, a.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return n.serverId;
    }).filter(Boolean);
  }, a.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return {
        serverId: n.serverId,
        name: n.name,
        size: n.size
      };
    });
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, n] of this.uploadedFiles)
        n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, delete this.dom[e];
    }
  }, H(t, e, a, "ln-upload", {
    attributes: h
  });
})();
function yi(t, e) {
  if (t.length !== 1) return t;
  const o = t.charCodeAt(0);
  if (o >= 65 && o <= 90) {
    const c = ((o - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + c);
  }
  if (o >= 97 && o <= 122) {
    const c = ((o - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + c);
  }
  if (o >= 48 && o <= 57) {
    const c = ((o - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + c);
  }
  return t;
}
function vi(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const o = new TextEncoder().encode(e);
    let c = "";
    const h = o.length;
    for (let g = 0; g < h; g++)
      c += String.fromCharCode(o[g]);
    return btoa(c);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function wi(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const o = atob(e), c = new Uint8Array(o.length);
      for (let h = 0; h < o.length; h++)
        c[h] = o.charCodeAt(h);
      return new TextDecoder().decode(c);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Ei(t, e) {
  const o = String(e || "ln-ashlar");
  let c;
  typeof TextEncoder < "u" ? c = new TextEncoder().encode(o) : typeof Buffer < "u" ? c = Buffer.from(o, "utf-8") : c = [108, 110];
  const h = c.length || 1, g = new Uint8Array(t.length);
  for (let l = 0; l < t.length; l++)
    g[l] = t[l] ^ c[l % h];
  return g;
}
function Ai(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const o = String(t);
  let c;
  if (typeof TextEncoder < "u")
    c = new TextEncoder().encode(o);
  else if (typeof Buffer < "u")
    c = Buffer.from(o, "utf-8");
  else
    return "";
  const h = Ei(c, e);
  let g = "";
  for (let l = 0; l < h.length; l++)
    g += String.fromCharCode(h[l]);
  return typeof btoa < "u" ? btoa(g) : typeof Buffer < "u" ? Buffer.from(h).toString("base64") : "";
}
function Si(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const o = String(t).trim();
    let c = "";
    if (typeof atob < "u")
      c = atob(o);
    else if (typeof Buffer < "u")
      c = Buffer.from(o, "base64").toString("binary");
    else
      return t;
    const h = new Uint8Array(c.length);
    for (let l = 0; l < c.length; l++)
      h[l] = c.charCodeAt(l);
    const g = Ei(h, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(g);
    if (typeof Buffer < "u")
      return Buffer.from(g).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Ci(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), o = e === "xor" || e === "base64" ? e : "rot", c = Number(t.shift) || 13, h = t.key || "ln-ashlar";
    return { codec: o, shift: c, key: h };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function Rr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const o = Ci(e);
  return o.codec === "base64" ? vi(t) : o.codec === "xor" ? Ai(t, o.key) : t.replace(/[a-zA-Z0-9]/g, (c) => yi(c, o.shift));
}
function Ae(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const o = Ci(e);
  return o.codec === "base64" ? wi(t) : o.codec === "xor" ? Si(t, o.key) : t.replace(/[a-zA-Z0-9]/g, (c) => yi(c, -o.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function o(l) {
    const u = l[e];
    u && u.deobfuscate();
  }
  const c = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: o, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: o, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: o, description: "Encryption or masking key for XOR codec" }
  };
  function h(l) {
    return l[e] ? l[e] : (l[e] = this, this.dom = l, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  h.prototype.deobfuscate = function() {
    const l = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && l && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((d) => !this.dom.contains(d.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const d = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(_) {
          return _.parentElement && _.parentElement.hasAttribute("data-ln-external-links-hint") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; d.nextNode(); )
        this._originalTextNodes.push({
          node: d.currentNode,
          raw: d.currentNode.nodeValue
        });
    }
    const a = this.dom.getAttribute(t), n = parseInt(a, 10), s = isNaN(n) ? 13 : n, r = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), i = this.dom.getAttribute("data-ln-obfuscator-key");
    let m = "rot";
    r === "xor" || r === "base64" ? m = r : i && (m = "xor");
    const p = i || "ln-ashlar", f = { codec: m, shift: s, key: p };
    if (l && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const d = this.dom.querySelectorAll("[data-ln-external-links-hint]");
      for (let y = 0; y < d.length; y++)
        d[y].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const _ = (this.dom.rel || "").split(/\s+/).filter(function(y) {
        return y && y !== "noopener" && y !== "noreferrer";
      });
      _.length > 0 ? this.dom.rel = _.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let d = 0; d < this._originalTextNodes.length; d++) {
        const _ = this._originalTextNodes[d];
        _.node && _.raw && _.raw.length > 0 && (_.node.nodeValue = Ae(_.raw, f));
      }
    if (l && this._originalHref) {
      const d = Ae(this._originalHref, f);
      this.dom.setAttribute("href", d);
    }
    k(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: m,
      shift: s,
      key: m === "xor" ? p : null
    });
  }, h.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let l = 0; l < this._originalTextNodes.length; l++) {
          const u = this._originalTextNodes[l];
          u.node && u.raw && (u.node.nodeValue = u.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const g = H(t, e, h, "ln-obfuscator", {
    attributes: c
  });
  g.obfuscate = Rr, g.deobfuscate = Ae, g.utf8ToBase64 = vi, g.base64ToUtf8 = wi, g.xorObfuscate = Ai, g.xorDeobfuscate = Si;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(u) {
    return u.hostname && u.hostname !== window.location.hostname;
  }
  function o(u) {
    if (u.getAttribute("data-ln-external-link") === "processed" || !e(u)) return;
    u.target = "_blank";
    const a = (u.rel || "").split(/\s+/).filter(Boolean);
    a.includes("noopener") || a.push("noopener"), a.includes("noreferrer") || a.push("noreferrer"), u.rel = a.join(" ");
    const n = document.createElement("span");
    n.setAttribute("data-ln-external-links-hint", ""), n.textContent = "(opens in new tab)", u.appendChild(n), u.setAttribute("data-ln-external-link", "processed"), k(u, "ln-external-links:processed", {
      link: u,
      href: u.href
    });
  }
  function c(u) {
    u = u || document.body;
    for (const a of u.querySelectorAll("a, area"))
      o(a);
  }
  function h() {
    ft(function() {
      document.body.addEventListener("click", function(u) {
        const a = u.target.closest("a, area");
        a && a.getAttribute("data-ln-external-link") === "processed" && k(a, "ln-external-links:clicked", {
          link: a,
          href: a.href,
          text: a.textContent || a.title || ""
        });
      });
    }, "ln-external-links");
  }
  function g() {
    ft(function() {
      te({
        onInit: function(u) {
          if (u.matches && (u.matches("a") || u.matches("area")) && o(u), u.querySelectorAll)
            for (const a of u.querySelectorAll("a, area"))
              o(a);
        }
      }), Pt(["href"], function(u) {
        u.matches && (u.matches("a") || u.matches("area")) && o(u);
      });
    }, "ln-external-links");
  }
  function l() {
    h(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      c();
    }) : c();
  }
  window[t] = {
    process: c
  }, l();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let o = null;
  function c() {
    o = document.createElement("div"), o.className = "ln-link-status", document.body.appendChild(o);
  }
  function h(_) {
    o && (o.textContent = _, o.classList.add("ln-link-status--visible"));
  }
  function g() {
    o && o.classList.remove("ln-link-status--visible");
  }
  function l(_, y) {
    if (y.target.closest("a, button, input, select, textarea")) return;
    const E = _.querySelector("a");
    if (!E) return;
    const v = E.getAttribute("href");
    if (!v) return;
    if (y.ctrlKey || y.metaKey || y.button === 1) {
      window.open(v, "_blank", "noopener,noreferrer");
      return;
    }
    G(_, "ln-link:navigate", { target: _, href: v, link: E }).defaultPrevented || E.click();
  }
  function u(_) {
    const y = _.querySelector("a");
    if (!y) return;
    const E = y.getAttribute("href");
    E && h(E);
  }
  function a() {
    g();
  }
  function n(_) {
    _[e + "Row"] || !_.querySelector("a") || (_[e + "Row"] = !0, _._lnLinkClick = function(E) {
      l(_, E);
    }, _._lnLinkEnter = function() {
      u(_);
    }, _.addEventListener("click", _._lnLinkClick), _.addEventListener("mouseenter", _._lnLinkEnter), _.addEventListener("mouseleave", a));
  }
  function s(_) {
    _[e + "Row"] && (_._lnLinkClick && _.removeEventListener("click", _._lnLinkClick), _._lnLinkEnter && _.removeEventListener("mouseenter", _._lnLinkEnter), _.removeEventListener("mouseleave", a), delete _._lnLinkClick, delete _._lnLinkEnter, delete _[e + "Row"]);
  }
  function r(_) {
    if (!_[e + "Init"]) return;
    const y = _.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const E = y === "TABLE" && _.querySelector("tbody") || _;
      for (const v of E.querySelectorAll("tr"))
        s(v);
    } else
      s(_);
    delete _[e + "Init"];
  }
  function i(_) {
    if (_[e + "Init"]) return;
    _[e + "Init"] = !0;
    const y = _.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const E = y === "TABLE" && _.querySelector("tbody") || _;
      for (const v of E.querySelectorAll("tr"))
        n(v);
    } else
      n(_);
  }
  function m(_) {
    _.hasAttribute && _.hasAttribute(t) && i(_);
    const y = _.querySelectorAll ? _.querySelectorAll("[" + t + "]") : [];
    for (const E of y)
      i(E);
  }
  function p() {
    ft(function() {
      te({
        query: "[" + t + "]",
        onInit: function(_) {
          m(_);
        },
        onSubtreeChange: function(_, y) {
          for (let E = 0; E < y.addedNodes.length; E++) {
            const v = y.addedNodes[E];
            if (v.nodeType === 1) {
              if (v.tagName === "TR")
                n(v);
              else if (v.querySelectorAll) {
                const S = v.querySelectorAll("tr");
                for (let b = 0; b < S.length; b++)
                  n(S[b]);
              }
            }
          }
        }
      }), Pt([t], function(_) {
        _.hasAttribute && _.hasAttribute(t) ? m(_) : r(_);
      });
    }, "ln-link");
  }
  function f(_) {
    m(_);
  }
  window[e] = { init: f, destroy: r };
  function d() {
    c(), p(), f(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d();
})();
(function() {
  const t = "data-ln-scroll", e = "lnScroll";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-scroll": { effect: null, type: "string", description: "Target element ID or CSS selector to scroll into view" },
    "data-ln-scroll-behavior": { effect: null, type: "enum", values: ["smooth", "auto"], fallback: "smooth", description: "Scroll animation behavior transition" },
    "data-ln-scroll-block": { effect: null, type: "enum", values: ["start", "center", "end", "nearest"], fallback: "start", description: "Vertical alignment positioning of scrolled target" },
    "data-ln-scroll-set": { effect: null, type: "string", description: "Optional state attribute assignment on target after scroll (e.g. data-ln-toggle=open)" },
    "data-ln-scroll-focus": { effect: null, type: "string", description: 'CSS selector of element to focus after scroll, or "false" to disable' },
    "data-ln-scroll-delay": { effect: null, type: "integer", fallback: 450, min: 0, description: "Delay in milliseconds before shifting keyboard focus" },
    "data-ln-scroll-update-hash": { effect: null, type: "boolean", fallback: !1, description: "Whether to update URL hash with target ID" }
  };
  function c(h) {
    if (h[e]) return h[e];
    if (!(!h || h.tagName !== "A" && h.tagName !== "BUTTON"))
      return h[e] = this, this.dom = h, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  c.prototype._handleClick = function(h) {
    if (this.dom.tagName === "A" && (h.ctrlKey || h.metaKey || h.shiftKey || h.altKey || h.button !== 0))
      return;
    let g = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (g || (g = (this.dom.getAttribute("href") || "").trim()), !g || g === "#")
      return;
    !g.startsWith("#") && !g.startsWith(".") && !g.startsWith("[") && (g = "#" + g);
    let l = null;
    try {
      l = document.querySelector(g);
    } catch {
      const p = g.replace(/^#/, "");
      l = document.getElementById(p);
    }
    if (!l) return;
    h.preventDefault();
    const u = this.dom.getAttribute("data-ln-scroll-set");
    if (u) {
      const m = u.indexOf(":");
      if (m !== -1) {
        const p = u.slice(0, m).trim(), f = u.slice(m + 1).trim();
        try {
          const d = document.querySelector(p);
          d && (d.value = f, d.dispatchEvent(new Event("input", { bubbles: !0 })), d.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (G(this.dom, "ln-scroll:before-scroll", {
      target: l,
      link: this.dom,
      href: g
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", s = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (l.scrollIntoView({ behavior: n, block: s }), xt(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", g);
      } catch {
      }
    const i = this.dom.getAttribute("data-ln-scroll-focus");
    if (i !== "false" && i !== "0") {
      const m = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), p = isNaN(m) ? 450 : m;
      window.setTimeout(function() {
        let f = null;
        if (i && i !== "true" && i !== "1")
          try {
            f = document.querySelector(i);
          } catch {
          }
        f || (f = l.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !f && l.getAttribute("tabindex") !== null && (f = l), f && typeof f.focus == "function" && f.focus({ preventScroll: !0 });
      }, p);
    }
    k(this.dom, "ln-scroll:scrolled", {
      target: l,
      link: this.dom,
      href: g
    });
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, H(t, e, c, "ln-scroll", {
    attributes: o
  });
})();
const Wt = ["Ctrl", "Alt", "Shift", "Meta"], Dr = {
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
  const o = Dr[e.toLowerCase()];
  return o || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function ki(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const o = e.split("+"), c = /* @__PURE__ */ new Set();
  let h = "";
  for (let l = 0; l < o.length; l++) {
    const u = Ti(o[l]);
    if (!u) return "";
    if (Wt.indexOf(u) !== -1) {
      c.add(u);
      continue;
    }
    if (h) return "";
    h = u;
  }
  if (!h) return "";
  const g = [];
  for (let l = 0; l < Wt.length; l++)
    c.has(Wt[l]) && g.push(Wt[l]);
  return g.push(h), g.join("+");
}
function Or(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const o = e.split(/[\s,]+/), c = [];
  for (let h = 0; h < o.length; h++) {
    const g = ki(o[h]);
    g && c.indexOf(g) === -1 && c.push(g);
  }
  return c;
}
function Nr(t, e) {
  const o = String(e || "").trim();
  if (!o || /[\s,]/.test(o)) return "";
  const c = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(c) ? "" : ki(c ? c + "+" + o : o);
}
function Mr(t) {
  if (!t) return "";
  const e = Ti(t.key);
  if (!e || Wt.indexOf(e) !== -1) return "";
  const o = [];
  return t.ctrlKey && o.push("Ctrl"), t.altKey && o.push("Alt"), t.shiftKey && o.push("Shift"), t.metaKey && o.push("Meta"), o.push(e), o.join("+");
}
function Pr(t) {
  if (!t || !t.tagName) return null;
  const e = String(t.tagName).toLowerCase();
  if (e === "button" || e === "a" && t.hasAttribute && t.hasAttribute("href")) return "click";
  if (e === "input" || e === "textarea" || e === "select" || t.isContentEditable) return "focus";
  if (t.hasAttribute && t.hasAttribute("contenteditable")) {
    const o = t.getAttribute("contenteditable");
    if (o === "" || String(o).toLowerCase() !== "false") return "focus";
  }
  return null;
}
function Fr(t, e, o, c) {
  if (!t || !e || o !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const h = String(e.tagName || "").toLowerCase();
  return h === "button" ? c === "Enter" || c === "Space" : h === "a" && e.hasAttribute && e.hasAttribute("href") && c === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", o = "data-ln-key-target", c = "data-ln-key-allow-input", h = "data-ln-key-modifier", g = "data-ln-key-for", l = "lnKeyFor";
  if (window[e] !== void 0) return;
  function u(y) {
    const E = y[e];
    if (E) {
      if (!y.hasAttribute(t)) {
        E.destroy();
        return;
      }
      E.sync();
    }
  }
  function a(y) {
    const E = y[l];
    E && !y.hasAttribute(g) && E.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: u, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: u, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: u, description: "Permits shortcut execution even when focused inside an editable input" }
  }, s = {
    "data-ln-key-for": { type: "string", effect: a, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" },
    "data-ln-key-map": { type: "string", description: "Container modifier context alias for external shortcut badges" }
  }, r = /* @__PURE__ */ new Set();
  let i = null;
  function m() {
    i || (i = function(y) {
      if (y.defaultPrevented || y.isComposing || y.repeat) return;
      const E = Mr(y);
      if (!E) return;
      const v = Gi(y.target), S = document.querySelectorAll("[" + t + "], [" + g + "]");
      let b = null, w = !1, A = !1;
      for (let x = 0; x < S.length; x++) {
        const D = S[x], I = D[e] || D[l];
        if (!I || !I.matches(E) || v && !I.allowsInput()) continue;
        const O = I.resolveTarget(), P = Pr(O);
        if (!(!P || !Qi(O, P))) {
          if (Fr(y, O, P, E)) {
            A = !0;
            continue;
          }
          b ? w = !0 : b = { host: D, target: O, action: P };
        }
      }
      if (A || !b) return;
      w && console.warn('[ln-key] Duplicate active shortcut "' + E + '"; first DOM match wins.');
      const T = {
        source: b.host,
        target: b.target,
        action: b.action,
        key: E,
        event: y
      };
      G(b.host, "ln-key:before-trigger", T).defaultPrevented || (y.preventDefault(), b.target[b.action](), k(b.host, "ln-key:trigger", T));
    }, document.addEventListener("keydown", i));
  }
  function p() {
    r.size > 0 || !i || (document.removeEventListener("keydown", i), i = null);
  }
  function f(y) {
    return this.dom = y, this.shortcuts = [], r.add(this), this.sync(), m(), this;
  }
  f.prototype.sync = function() {
    this.shortcuts = Or(this.dom.getAttribute(t));
  }, f.prototype.matches = function(y) {
    return this.shortcuts.indexOf(y) !== -1;
  }, f.prototype.allowsInput = function() {
    return this.dom.hasAttribute(c);
  }, f.prototype.resolveTarget = function() {
    const y = this.dom.getAttribute(o);
    return y ? _(y, o) : this.dom;
  }, f.prototype.destroy = function() {
    this.dom[e] && (r.delete(this), delete this.dom[e], p());
  };
  function d(y) {
    return this.dom = y, r.add(this), m(), this;
  }
  d.prototype._modifierContext = function() {
    return this.dom.closest("[" + h + "], [data-ln-key-map]");
  }, d.prototype.shortcut = function() {
    const y = this._modifierContext(), E = y && (y.getAttribute(h) || y.getAttribute("data-ln-key-map")) || "";
    return Nr(E, this.dom.textContent);
  }, d.prototype.matches = function(y) {
    return this.shortcut() === y;
  }, d.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(c)) return !0;
    const y = this._modifierContext();
    return !!(y && y.hasAttribute(c));
  }, d.prototype.resolveTarget = function() {
    return _(this.dom.getAttribute(g), g);
  }, d.prototype.destroy = function() {
    this.dom[l] && (r.delete(this), delete this.dom[l], p());
  };
  function _(y, E) {
    if (!y) return null;
    try {
      const v = document.querySelector(y) || document.getElementById(y);
      return v || console.warn("[ln-key] Target not found for " + E + ' selector or ID "' + y + '".'), v;
    } catch {
      const S = document.getElementById(y);
      return S || (console.warn("[ln-key] Invalid " + E + ' selector "' + y + '".'), null);
    }
  }
  H(t, e, f, "ln-key", {
    attributes: n
  }), H(g, l, d, "ln-key-for", {
    attributes: s
  });
})();
function Br(t, e, o = 100) {
  if (e != null && e !== "") {
    const c = parseFloat(String(e));
    if (!isNaN(c) && c > 0) return c;
  }
  if (t != null && t !== "") {
    const c = parseFloat(String(t));
    if (!isNaN(c) && c > 0) return c;
  }
  return o;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function o(l) {
    const u = l[e];
    u && g.call(u);
  }
  const c = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: o, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: o, description: "Maximum progress scale value" }
  };
  function h(l) {
    return this.dom = l, this._parentObserver = null, g.call(this), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function g() {
    const l = this.dom.getAttribute("data-ln-progress"), u = this.dom.parentElement, a = u ? u.getAttribute("data-ln-progress-max") : null, n = this.dom.getAttribute("data-ln-progress-max"), s = Br(n, a, 100), r = Zn(l, s);
    this.dom.style.width = r.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(r.min)), this.dom.setAttribute("aria-valuemax", String(r.max)), this.dom.setAttribute("aria-valuenow", String(r.clampedValue)), k(this.dom, "ln-progress:change", {
      target: this.dom,
      value: r.value,
      max: r.max,
      percentage: r.percentage
    });
  }
  H(
    t,
    e,
    h,
    "ln-progress",
    {
      attributes: c
    }
  ), Pt(["data-ln-progress-max"], function(l) {
    const u = l.querySelectorAll ? l.querySelectorAll(t) : [];
    for (let a = 0; a < u.length; a++) {
      const n = u[a][e];
      n && g.call(n);
    }
  });
})();
function Ur(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let o = 0; o < t.length; o++)
    if (t[o] !== e[o]) return !0;
  return !1;
}
function Hr(t, e, o) {
  if (!e || typeof e != "object") return !0;
  const c = Object.keys(e);
  if (c.length === 0) return !0;
  for (let h = 0; h < c.length; h++) {
    const g = e[c[h]];
    let l = "";
    if (g.col !== null && g.col !== void 0 ? l = t[g.col] || "" : g.attr && o && typeof o.getAttribute == "function" && (l = o.getAttribute(g.attr) || ""), !Je(l, g.values))
      return !1;
  }
  return !0;
}
function bn(t, e, o, c) {
  if (c != null && !isNaN(c))
    return parseInt(c, 10);
  if (e && typeof e.getAttribute == "function") {
    const h = e.getAttribute("data-ln-filter-col");
    if (h !== null && !isNaN(parseInt(h, 10)))
      return parseInt(h, 10);
    if (typeof e.closest == "function") {
      const g = e.closest("th");
      if (g && typeof g.cellIndex == "number")
        return g.cellIndex;
      const l = e.closest("[data-ln-popover], [id]");
      if (l && l.id) {
        const u = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (u && typeof u.querySelector == "function") {
          const a = u.querySelector('[data-ln-popover-for="' + l.id + '"]');
          if (a && typeof a.closest == "function") {
            const n = a.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && o && typeof t.querySelectorAll == "function") {
    const h = t.querySelectorAll("thead th, tr:first-child th"), g = String(o).trim().toLowerCase();
    for (let l = 0; l < h.length; l++) {
      const u = h[l], a = u.getAttribute("data-ln-table-filter-col") || u.getAttribute("data-ln-filter-col") || u.getAttribute("data-ln-filter-key") || u.getAttribute("data-ln-table-col") || u.getAttribute("data-ln-col") || u.getAttribute("data-ln-field");
      if (a && a.trim().toLowerCase() === g)
        return typeof u.cellIndex == "number" ? u.cellIndex : l;
    }
    if (e) {
      const l = e.closest ? e.closest("[data-ln-popover], [id]") : null, u = l && l.id || e.id || null;
      if (u)
        for (let a = 0; a < h.length; a++) {
          const n = h[a];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + u + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : a;
        }
    }
    for (let l = 0; l < h.length; l++) {
      const u = h[l], n = Array.from(u.childNodes || []).filter((r) => r.nodeType === 3), s = (n.length > 0 ? n.map((r) => r.textContent.trim()).join(" ") : u.textContent || "").trim().toLowerCase();
      if (s && s === g)
        return typeof u.cellIndex == "number" ? u.cellIndex : l;
    }
  }
  return null;
}
function zr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const o = [];
  for (let c = 0; c < t.length; c++) {
    const h = t[c];
    !e && h.key && (e = h.key), h.checked && !h.isReset && h.value && o.push(h.value);
  }
  return { key: e, values: o };
}
function Kr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function yn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", o = "data-ln-filter-key", c = "data-ln-filter-value", h = "data-ln-filter-hide", g = "data-ln-filter-reset", l = "data-ln-filter-col", u = "data-ln-hash", a = "data-ln-query", n = "data-ln-filter-values", s = "data-ln-filter-target", r = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-filter": { prop: "targetId", type: "string", read: j, fallback: null, effect: S, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: S, description: "URL hash routing key for filter state persistence" },
    "data-ln-query": { type: "string", effect: S, description: "URL query parameter name for filter state synchronization" },
    "data-ln-filter-values": { type: "string", effect: S, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-filter-target": { type: "marker", description: "Marker on target container or table observed by ln-filter" }
  }, m = Y(i);
  function p(b) {
    if (!b.hasAttribute(a)) return null;
    const w = b.getAttribute(a);
    if (w && w.trim() !== "") return w.trim();
    const A = b.getAttribute(l);
    if (A && isNaN(parseInt(A, 10))) return A.trim();
    const T = b.querySelector("[" + o + "]");
    if (T) {
      const L = T.getAttribute(o);
      if (L && L.trim() !== "") return L.trim();
    }
    return Ot(b, "filter");
  }
  function f(b) {
    return b.hasAttribute(g) || !b.getAttribute(c);
  }
  function d(b) {
    const w = b.dom.querySelectorAll("[" + o + "]"), A = [];
    for (let L = 0; L < w.length; L++) {
      const x = w[L];
      A.push({
        key: x.getAttribute(o),
        value: x.getAttribute(c) || "",
        checked: x.checked,
        isReset: f(x)
      });
    }
    const T = zr(A);
    return { key: T.key, values: T.values, targetId: b.targetId };
  }
  function _(b, w, A) {
    const T = b.querySelectorAll("[" + o + "]"), L = Array.isArray(A) && A.length > 0;
    for (let x = 0; x < T.length; x++) {
      const D = T[x];
      f(D) ? D.checked = !L : L && D.getAttribute(o) === w && A.indexOf(D.getAttribute(c)) !== -1 ? D.checked = !0 : D.checked = !1;
    }
  }
  function y(b) {
    this.dom = b, X(this, b, m);
    const w = b.getAttribute(l);
    this.colIndex = w !== null ? parseInt(w, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = St(b, "filter"), this.hashEnabled = !!this.nsKey, this.queryParam = p(b), this.queryEnabled = !!this.queryParam;
    const A = this, T = Xt(function() {
      A._destroyed || A._render();
    });
    this._queueRender = T;
    const L = Xt(function() {
      A._destroyed || A._applyDomFilter();
    });
    this._queueDomFilter = L;
    function x() {
      if (!A.targetId) return;
      const I = document.getElementById(A.targetId);
      I && !I.hasAttribute(s) && I.setAttribute(s, A.targetId);
    }
    this._ensureTargetMarked = x, x(), ut(function() {
      A._destroyed || x();
    }), this._attachHandlers(), this._onHashChange = function() {
      if (A._destroyed || !A.hashEnabled) return;
      const I = lt(A.nsKey), O = ke(I);
      O && O.key && O.values.length > 0 ? _(A.dom, O.key, O.values) : _(A.dom, null, []), A._render();
    }, this._onPopState = function() {
      if (A._destroyed || !A.queryEnabled) return;
      const I = Mt(A.queryParam), O = xe(I), P = A.dom.querySelector("[" + o + "]"), U = P ? P.getAttribute(o) : A.queryParam;
      _(A.dom, U, O), A._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState);
    let D = !1;
    if (this.hashEnabled) {
      const I = lt(this.nsKey), O = ke(I);
      O && O.key && O.values.length > 0 && (_(b, O.key, O.values), ut(function() {
        A._destroyed || A._render();
      }), D = !0);
    } else if (this.queryEnabled) {
      const I = Mt(this.queryParam), O = xe(I);
      if (O.length > 0) {
        const P = b.querySelector("[" + o + "]"), U = P ? P.getAttribute(o) : A.queryParam;
        _(b, U, O), ut(function() {
          A._destroyed || A._render();
        }), D = !0;
      }
    }
    if (!D) {
      const I = yn(b.getAttribute(n));
      if (I.length > 0) {
        const O = b.querySelector("[" + o + "]"), P = O ? O.getAttribute(o) : null;
        P && (_(b, P, I), ut(function() {
          A._destroyed || A._render();
        }), D = !0);
      }
    }
    if (!D) {
      const I = b.querySelectorAll("[" + o + "]");
      for (let O = 0; O < I.length; O++)
        if (I[O].checked && !f(I[O])) {
          ut(function() {
            A._destroyed || A._render();
          });
          break;
        }
    }
    return this;
  }
  y.prototype._attachHandlers = function() {
    const b = this;
    this._onDomChange = function(w) {
      const A = w.target;
      if (!A || !A.hasAttribute || !A.hasAttribute(o)) return;
      const T = Array.from(b.dom.querySelectorAll("[" + o + "]"));
      if (f(A)) {
        for (let L = 0; L < T.length; L++)
          f(T[L]) || (T[L].checked = !1);
        A.checked = !0, b._queueRender();
        return;
      }
      if (A.checked) {
        for (let x = 0; x < T.length; x++)
          f(T[x]) && (T[x].checked = !1);
        let L = !1;
        for (let x = 0; x < T.length; x++)
          if (f(T[x])) {
            L = !0;
            break;
          }
        if (L) {
          let x = !0;
          for (let D = 0; D < T.length; D++)
            if (!f(T[D]) && !T[D].checked) {
              x = !1;
              break;
            }
          if (x)
            for (let D = 0; D < T.length; D++)
              f(T[D]) ? T[D].checked = !0 : T[D].checked = !1;
        }
      } else {
        let L = !1;
        for (let x = 0; x < T.length; x++)
          if (!f(T[x]) && T[x].checked) {
            L = !0;
            break;
          }
        if (!L)
          for (let x = 0; x < T.length; x++)
            f(T[x]) && (T[x].checked = !0);
      }
      b._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, y.prototype._render = function() {
    const b = this, w = d(this), A = this._lastSnapshot;
    if (!(!A || A.key !== w.key || Ur(A.values, w.values))) return;
    w.key === null || w.values.length;
    const L = document.getElementById(b.targetId), x = {
      key: w.key,
      values: w.values.slice(),
      targetId: b.targetId
    };
    k(b.dom, "ln-filter:change", x);
    let D = !1;
    L && L !== b.dom && G(L, "ln-filter:change", x).defaultPrevented && (D = !0);
    const I = A && A.values.length > 0, O = w.values.length === 0;
    if (I && O) {
      const U = { targetId: b.targetId };
      k(b.dom, "ln-filter:reset", U), L && L !== b.dom && k(L, "ln-filter:reset", U);
    }
    this._lastSnapshot = { key: w.key, values: w.values.slice() };
    const P = Kr(w.values);
    if (P ? this.dom.setAttribute(n, P) : this.dom.removeAttribute(n), this.hashEnabled) {
      const U = Qn(w.key, w.values);
      bt(this.nsKey, U);
    } else if (this.queryEnabled) {
      const U = Yn(w.values), K = this.queryParam || w.key;
      K && pe(K, U);
    }
    D || b._applyDomFilter(L);
  }, y.prototype._applyDomFilter = function(b) {
    const w = b || document.getElementById(this.targetId);
    if (!w) return;
    const A = d(this), T = A.key === null || A.values.length === 0, L = w.tagName === "TABLE" ? w : w.querySelector ? w.querySelector("table") : null;
    if (L)
      this._filterTableRows(A, L);
    else {
      const x = w.children;
      for (let D = 0; D < x.length; D++) {
        const I = x[D], O = T ? null : I.getAttribute("data-" + A.key), P = !T && O !== null && !Je(O, A.values), U = I.hasAttribute(h);
        P && !U ? I.setAttribute(h, "true") : !P && U && I.removeAttribute(h);
      }
    }
  };
  function E(b) {
    if (!b) return "";
    const w = b.querySelector ? b.querySelector("[data-ln-value]") : null;
    return At(w || b);
  }
  function v(b) {
    return !!(!b || typeof b != "object" || b.tagName === "TEMPLATE" || typeof b.hasAttribute == "function" && (b.hasAttribute("data-ln-sort-exclude") || b.hasAttribute("data-ln-table-empty") || b.hasAttribute("hidden")) || b.classList && b.classList.contains("hidden") || b.style && b.style.display === "none");
  }
  y.prototype._filterTableRows = function(b, w) {
    if (!w) {
      const I = document.getElementById(this.targetId);
      if (!I || (w = I.tagName === "TABLE" ? I : I.querySelector ? I.querySelector("table") : null, !w)) return;
    }
    const A = bn(w, this.dom, b.key, this.colIndex), T = b.key || this.dom.getAttribute("data-ln-filter-key") || (A !== null ? "col" + A : "attr-filter"), L = b.values;
    r.has(w) || r.set(w, {});
    const x = r.get(w);
    T && L.length > 0 ? x[T] = {
      col: A,
      values: L.slice(),
      attr: "data-" + T
    } : T && delete x[T];
    const D = w.tBodies;
    for (let I = 0; I < D.length; I++) {
      const O = D[I].rows;
      for (let P = 0; P < O.length; P++) {
        const U = O[P];
        if (v(U)) continue;
        const K = {};
        for (let rt = 0; rt < U.cells.length; rt++)
          K[rt] = E(U.cells[rt]);
        const Q = !Hr(K, x, U), J = U.hasAttribute(h);
        Q && !J ? U.setAttribute(h, "true") : !Q && J && U.removeAttribute(h);
      }
    }
  }, y.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const b = document.getElementById(this.targetId);
    if (b) {
      const w = b.tagName === "TABLE" ? b : b.querySelector ? b.querySelector("table") : null;
      if (w && r.has(w)) {
        const A = r.get(w), T = bn(w, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), L = this.dom.getAttribute("data-ln-filter-key") || (T !== null ? "col" + T : this.colIndex !== null ? "col" + this.colIndex : null);
        L && A[L] && (delete A[L], this._filterTableRows({ key: null, values: [] }, w)), Object.keys(A).length === 0 && r.delete(w);
      }
      this.targetId && document.querySelectorAll("[" + t + '="' + this.targetId + '"]').length <= 1 && b.removeAttribute(s);
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e];
  };
  function S(b, w) {
    const A = b[e];
    if (!(!A || A._destroyed))
      if (w === u)
        A.hashEnabled && A._onHashChange && window.removeEventListener("hashchange", A._onHashChange), A.nsKey = St(b, "filter"), A.hashEnabled = !!A.nsKey, A.hashEnabled && window.addEventListener("hashchange", A._onHashChange);
      else if (w === a)
        A.queryEnabled && A._onPopState && window.removeEventListener("popstate", A._onPopState), A.queryParam = p(b), A.queryEnabled = !!A.queryParam, A.queryEnabled && window.addEventListener("popstate", A._onPopState);
      else if (w === n) {
        const T = yn(b.getAttribute(n)), L = b.querySelector("[" + o + "]"), x = L ? L.getAttribute(o) : null;
        x && (_(b, x, T), A._render());
      } else w === t && (A.targetId = b.getAttribute(t) || null, A._ensureTargetMarked(), A._render());
  }
  H(t, e, y, "ln-filter", {
    attributes: i,
    subtreeQuery: "[" + t + "], [" + s + "]",
    onSubtreeChange: function(b, w) {
      if (w.addedNodes.length === 0 && w.removedNodes.length === 0) return;
      let A = null, T = null;
      if (b.hasAttribute(s) ? (T = b, A = b.getAttribute(s) || b.id) : b.hasAttribute(t) && (A = b.getAttribute(t), T = A ? document.getElementById(A) : null), !A || !T) return;
      const L = document.querySelectorAll("[" + t + '="' + A + '"]');
      for (let x = 0; x < L.length; x++) {
        const D = L[x][e];
        D && !D._destroyed && d(D).values.length > 0 && D._queueDomFilter();
      }
    },
    persist: {
      attr: n,
      hashActive: function(b) {
        return !!St(b, "filter") || !!p(b);
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", o = "data-ln-search-for", c = "lnSearchControl", h = "data-ln-search-items", g = "data-ln-search-fields", l = "data-ln-search-exclude", u = "data-ln-search-hide", a = "data-ln-hash", n = "data-ln-query";
  if (window[e] !== void 0) return;
  const s = {
    "data-ln-search": { type: "string", effect: S, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: S, description: "URL hash routing key for search state persistence" },
    "data-ln-query": { type: "string", effect: S, description: "URL query parameter name for search query state synchronization" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: j, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, r = Y(s);
  function i(b) {
    const w = St(b, "search");
    if (w) return w;
    if (b.id) {
      const A = document.querySelector("[" + o + '="' + b.id + '"]');
      if (A) {
        const T = St(A, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function m(b) {
    const w = Ot(b, "search");
    if (w) return w;
    if (b.id) {
      const A = document.querySelector("[" + o + '="' + b.id + '"]');
      if (A) {
        const T = Ot(A, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function p(b) {
    return b.matches("input, textarea") ? b : b.querySelector("input, textarea");
  }
  function f(b, w) {
    const A = b.childNodes;
    for (let T = 0; T < A.length; T++) {
      const L = A[T];
      if (L.nodeType === 3) {
        w.push(L.nodeValue);
        continue;
      }
      L.nodeType === 1 && (L.hasAttribute(l) || f(L, w));
    }
  }
  function d(b) {
    if (b._lnSearchText !== void 0) return b._lnSearchText;
    const w = [];
    f(b, w);
    const A = hr(w);
    return b._lnSearchText = A, A;
  }
  function _(b, w) {
    if (!b.id) return;
    const A = document.querySelectorAll("[" + o + '="' + b.id + '"]');
    for (const T of A) {
      const L = p(T);
      L && L.value !== w && (L.value = w);
    }
  }
  function y(b) {
    this.dom = b, this.term = b.getAttribute(t) || "", this._destroyed = !1;
    const w = this;
    return this.nsKey = i(b), this.hashEnabled = !!this.nsKey, this.queryParam = m(b), this.queryEnabled = !!this.queryParam, this._queueApply = Xt(function() {
      w._destroyed || w._apply();
    }), this._onHashChange = function() {
      if (w._destroyed || !w.hashEnabled) return;
      const A = lt(w.nsKey), T = w.dom.getAttribute(t) || "";
      A !== null && A !== T ? w.dom.setAttribute(t, A) : A === null && T !== "" && w.dom.setAttribute(t, "");
    }, this._onPopState = function() {
      if (w._destroyed || !w.queryEnabled) return;
      const A = Mt(w.queryParam) || "", T = w.dom.getAttribute(t) || "";
      A !== T && w.dom.setAttribute(t, A);
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState), ut(function() {
      if (!w._destroyed) {
        if (w.hashEnabled) {
          const A = lt(w.nsKey);
          if (A !== null && A !== w.term) {
            w.term = A, w.dom.setAttribute(t, A), _(w.dom, A), w._apply();
            return;
          }
        } else if (w.queryEnabled) {
          const A = Mt(w.queryParam);
          if (A !== null && A !== w.term) {
            w.term = A, w.dom.setAttribute(t, A), _(w.dom, A), w._apply();
            return;
          }
        }
        ae(w.term) && (_(w.dom, w.term), w._apply());
      }
    }), this;
  }
  y.prototype._apply = function() {
    const b = this.dom, w = ae(this.term), A = ei(w);
    this.hashEnabled ? bt(this.nsKey, this.term ? this.term : null) : this.queryEnabled && pe(this.queryParam, this.term ? this.term : null);
    const T = fr(b.getAttribute(g));
    if (G(b, "ln-search:change", {
      term: w,
      tokens: A,
      targetId: b.id,
      fields: T
    }).defaultPrevented) return;
    const x = b.getAttribute(h), D = x ? b.querySelectorAll(x) : b.children;
    for (let I = 0; I < D.length; I++) {
      const O = D[I];
      if (O.hasAttribute(l)) {
        O.hasAttribute(u) && O.removeAttribute(u);
        continue;
      }
      const P = A.length > 0 && !ni(d(O), A), U = O.hasAttribute(u);
      P && !U ? O.setAttribute(u, "true") : !P && U && O.removeAttribute(u);
    }
  }, y.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e]);
  };
  function E(b) {
    if (this.dom = b, X(this, b, r), this.input = p(b), this._attachHandler(), this.input && this.input.value.trim()) {
      const w = this;
      ut(function() {
        const A = document.getElementById(w.targetId);
        A && ((A.getAttribute(t) || "").trim() || w._write(w.input.value));
      });
    }
    return this;
  }
  E.prototype._write = function(b) {
    const w = document.getElementById(this.targetId);
    w && w.getAttribute(t) !== b && w.setAttribute(t, b);
  }, E.prototype._attachHandler = function() {
    if (!this.input) return;
    const b = this;
    this._onInput = function() {
      b._write(b.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, E.prototype.destroy = function() {
    this.dom[c] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[c]);
  };
  function v(b) {
    const w = b.getAttribute("data-ln-search-clear-for");
    if (w) {
      const D = document.getElementById(w), I = document.querySelector("[" + o + '="' + w + '"]'), O = I ? p(I) : null;
      return { target: D, input: O };
    }
    const A = b.closest("[" + t + "]");
    if (A) {
      const D = A.id ? document.querySelector("[" + o + '="' + A.id + '"]') : null, I = D ? p(D) : null;
      return { target: A, input: I };
    }
    const T = b.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const D = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), I = D ? document.getElementById(D) : null;
      if (I && I.hasAttribute(t)) {
        const O = document.querySelector("[" + o + '="' + D + '"]'), P = O ? p(O) : null;
        return { target: I, input: P };
      }
    }
    const L = b.closest("[" + o + "]");
    if (L) {
      const D = L.getAttribute(o), I = D ? document.getElementById(D) : null, O = p(L);
      return { target: I, input: O };
    }
    const x = b.parentElement;
    if (x) {
      const D = x.querySelector("[" + o + "]");
      if (D) {
        const I = D.getAttribute(o), O = I ? document.getElementById(I) : null, P = p(D);
        return { target: O, input: P };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(b) {
    const w = b.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!w) return;
    const A = v(w);
    !A.target && !A.input || (b.preventDefault(), A.input && (A.input.value = "", A.input.focus()), A.target && A.target.setAttribute(t, ""));
  });
  function S(b, w) {
    const A = b[e];
    if (!A || A._destroyed) return;
    if (w === a) {
      A._onHashChange && window.removeEventListener("hashchange", A._onHashChange), A.nsKey = i(b), A.hashEnabled = !!A.nsKey, A.hashEnabled && window.addEventListener("hashchange", A._onHashChange);
      return;
    }
    if (w === n) {
      A._onPopState && window.removeEventListener("popstate", A._onPopState), A.queryParam = m(b), A.queryEnabled = !!A.queryParam, A.queryEnabled && window.addEventListener("popstate", A._onPopState);
      return;
    }
    const T = b.getAttribute(t) || "";
    T !== A.term && (A.term = T, _(b, T), A._apply());
  }
  H(t, e, y, "ln-search", {
    attributes: s,
    onSubtreeChange: function(b, w) {
      const A = w.target;
      A && A._lnSearchText !== void 0 && delete A._lnSearchText, A && A.parentElement && A.parentElement._lnSearchText !== void 0 && delete A.parentElement._lnSearchText;
      const T = b[e];
      if (T && !T._destroyed && ae(T.term) && (w.addedNodes.length > 0 || w.removedNodes.length > 0)) {
        for (let L = 0; L < w.addedNodes.length; L++) {
          const x = w.addedNodes[L];
          x._lnSearchText !== void 0 && delete x._lnSearchText;
        }
        T._queueApply();
      }
    },
    persist: {
      attr: t,
      hashActive: function(b) {
        return !!i(b) || !!m(b);
      }
    }
  }), H(o, c, E, "ln-search-control");
})();
function Lt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function jr(t) {
  const e = Lt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Vr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Wr(t, e, o, c) {
  const h = Lt(t);
  if (h === "none") return () => 0;
  const g = h === "desc" ? -1 : 1, l = typeof c == "function" ? c : (u) => u;
  return function(u, a) {
    const n = l(u), s = l(a);
    return Xe(n, s, e, o) * g;
  };
}
function Se(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("data-ln-table-empty") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none");
}
function $r(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const o = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (o && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(o));
  if (t.tagName === "TABLE") {
    const c = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (c)
      return Array.from(c.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", o = "data-ln-sort-field", c = "data-ln-sort-state", h = "data-ln-sort-dir", g = "data-ln-hash", l = "data-ln-query";
  if (window[e] !== void 0) return;
  function u(p, f) {
    return p.getAttribute(f) || null;
  }
  const a = {
    "data-ln-sort": { prop: "targetId", type: "string", read: j, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: u, effect: m, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: u, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: m, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: m, description: "URL hash routing key for sort state persistence" },
    "data-ln-query": { type: "string", effect: m, description: "URL query parameter name for sort state persistence" }
  }, n = Y(a), s = /* @__PURE__ */ new WeakMap();
  function r(p, f, d) {
    if (f) {
      const _ = p.querySelector('[data-ln-field="' + f + '"]');
      return _ ? At(_) : "";
    }
    return d != null && p.cells && p.cells[d] ? At(p.cells[d]) : At(p);
  }
  function i(p) {
    this.dom = p, X(this, p, n);
    const f = p.closest("th");
    this.column = !this.field && f ? f.cellIndex : null, this._state = Lt(p.getAttribute(c)), p.hasAttribute(c) || p.setAttribute(c, this._state), this._destroyed = !1, this.nsKey = St(p, "sort"), this.hashEnabled = !!this.nsKey, this.queryParam = Ot(p, "sort"), this.queryEnabled = !!this.queryParam;
    const d = this;
    this._onClick = function(y) {
      const E = y.target.closest("[" + h + "]");
      if (!E) return;
      const v = Lt(E.getAttribute(h));
      d._apply(v);
    }, p.addEventListener("click", this._onClick), this._onSortChange = function(y) {
      if (d._destroyed || !y.detail) return;
      const E = d._resolveTarget();
      if (!(E && (y.target === E || E.contains(y.target)) || y.detail.targetId && y.detail.targetId === d.targetId)) return;
      if (Vr(
        { field: d.field, column: d.column },
        { field: y.detail.field, column: y.detail.column }
      )) {
        const b = Lt(y.detail.direction);
        b && p.getAttribute(c) !== b && (d._state = b, p.setAttribute(c, b), d._updateAriaSort(b));
        return;
      }
      p.getAttribute(c) !== "none" && (d._state = "none", p.setAttribute(c, "none"), d._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (d._destroyed || !d.hashEnabled) return;
      const y = lt(d.nsKey), E = Te(y);
      if (E)
        d.field !== null && E.fieldOrColumn === d.field || d.column !== null && String(d.column) === E.fieldOrColumn ? d._state !== E.direction && d._apply(E.direction, !0) : d._state !== "none" && (d._state = "none", p.setAttribute(c, "none"), d._updateAriaSort("none"));
      else if (d._state !== "none") {
        d._state = "none", p.setAttribute(c, "none"), d._updateAriaSort("none");
        const v = d._resolveTarget();
        v && (G(v, "ln-sort:change", {
          field: d.field,
          column: d.column,
          direction: "none",
          targetId: d.targetId
        }).defaultPrevented || d._defaultSort(v, "none"));
      }
    }, this._onPopState = function() {
      if (d._destroyed || !d.queryEnabled) return;
      const y = Mt(d.queryParam), E = Le(), v = qe(y, E);
      if (v)
        d.field !== null && v.fieldOrColumn === d.field || d.column !== null && String(d.column) === v.fieldOrColumn ? d._state !== v.direction && d._apply(v.direction, !0) : d._state !== "none" && (d._state = "none", p.setAttribute(c, "none"), d._updateAriaSort("none"));
      else if (d._state !== "none") {
        d._state = "none", p.setAttribute(c, "none"), d._updateAriaSort("none");
        const S = d._resolveTarget();
        S && (G(S, "ln-sort:change", {
          field: d.field,
          column: d.column,
          direction: "none",
          targetId: d.targetId
        }).defaultPrevented || d._defaultSort(S, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), this.queryEnabled && window.addEventListener("popstate", this._onPopState);
    let _ = !1;
    if (this.hashEnabled) {
      const y = lt(this.nsKey), E = Te(y);
      E && ((d.field !== null && E.fieldOrColumn === d.field || d.column !== null && String(d.column) === E.fieldOrColumn) && ut(function() {
        d._destroyed || d._apply(E.direction, !0);
      }), _ = !0);
    } else if (this.queryEnabled) {
      const y = Mt(this.queryParam), E = Le(), v = qe(y, E);
      v && ((d.field !== null && v.fieldOrColumn === d.field || d.column !== null && String(d.column) === v.fieldOrColumn) && ut(function() {
        d._destroyed || d._apply(v.direction, !0);
      }), _ = !0);
    }
    if (!_) {
      const y = Lt(p.getAttribute(c));
      y && y !== "none" && ut(function() {
        d._destroyed || d._apply(y, !0);
      });
    }
    return this;
  }
  i.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, i.prototype._updateAriaSort = function(p) {
    const f = this.dom.closest("th");
    f && f.setAttribute("aria-sort", jr(p));
  }, i.prototype._apply = function(p, f) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const v = this.dom.closest("th");
      v && v.cellIndex !== void 0 && (this.column = v.cellIndex);
    }
    const d = Lt(p);
    this._state = d, this.dom.getAttribute(c) !== d && this.dom.setAttribute(c, d), this._updateAriaSort(d);
    const _ = this._resolveTarget();
    if (!_) return;
    const y = {
      field: this.field,
      column: this.column,
      direction: d,
      targetId: this.targetId
    };
    if (!f) {
      if (this.hashEnabled) {
        const v = Gn(this.field !== null ? this.field : this.column, d);
        bt(this.nsKey, v);
      } else if (this.queryEnabled) {
        const v = Xn(this.field !== null ? this.field : this.column, d);
        pe(this.queryParam, v);
      }
    }
    G(_, "ln-sort:change", y).defaultPrevented || this._defaultSort(_, d);
  }, i.prototype._defaultSort = function(p, f) {
    const d = $r(p, this.itemsSelector);
    if (!d.length) return;
    const _ = d[0].parentNode, y = d.filter(function(v) {
      return !Se(v);
    });
    if (!y.length) return;
    s.has(p) || s.set(p, y.slice());
    let E;
    if (f === "none") {
      const v = s.get(p) || y;
      s.delete(p), E = v.filter(function(S) {
        return S.parentNode === _ && !Se(S);
      });
    } else {
      const v = this.field, S = this.column, b = y.map(function(L) {
        return { el: L, val: r(L, v, S) };
      }), w = Qe(b.map(function(L) {
        return L.val;
      })), A = typeof Intl < "u" ? new Intl.Collator(Z(this.dom), { sensitivity: "base", numeric: !0 }) : null, T = Wr(f, w, A, function(L) {
        return L.val;
      });
      b.sort(T), E = b.map(function(L) {
        return L.el;
      });
    }
    Wn(function() {
      const v = document.createDocumentFragment();
      let S = 0;
      for (let b = 0; b < d.length; b++) {
        const w = d[b];
        Se(w) ? v.appendChild(w) : S < E.length && v.appendChild(E[S++]);
      }
      _.appendChild(v);
    });
  }, i.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), this.queryEnabled && this._onPopState && window.removeEventListener("popstate", this._onPopState), delete this.dom[e]);
  };
  function m(p, f) {
    const d = p[e];
    if (!(!d || d._destroyed))
      if (f === o) {
        const _ = p.closest("th");
        d.column = !d.field && _ ? _.cellIndex : null;
      } else if (f === c) {
        const _ = Lt(p.getAttribute(c));
        _ !== d._state && d._apply(_);
      } else f === g ? (d.hashEnabled && d._onHashChange && window.removeEventListener("hashchange", d._onHashChange), d.nsKey = St(p, "sort"), d.hashEnabled = !!d.nsKey, d.hashEnabled && window.addEventListener("hashchange", d._onHashChange)) : f === l && (d.queryEnabled && d._onPopState && window.removeEventListener("popstate", d._onPopState), d.queryParam = Ot(p, "sort"), d.queryEnabled = !!d.queryParam, d.queryEnabled && window.addEventListener("popstate", d._onPopState));
  }
  H(t, e, i, "ln-sort", {
    attributes: a,
    persist: {
      attr: c,
      hashActive: function(p) {
        return !!St(p, "sort") || !!Ot(p, "sort");
      }
    }
  });
})();
function Gr(t, e, o, c, h = 15) {
  if (c <= 0 || o <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const g = Math.max(0, t || 0), l = Math.max(0, e || 0), u = Math.floor(g / o), a = Math.ceil(l / o), n = Math.max(0, u - h), s = Math.min(c, u + a + h), r = n * o, i = Math.max(0, (c - s) * o);
  return { start: n, end: s, topPadding: r, bottomPadding: i };
}
function Qr(t, e) {
  const o = Array.isArray(t) ? t.length : 0, c = e instanceof Set ? e : new Set(e || []);
  let h = 0;
  if (Array.isArray(t))
    for (let u = 0; u < t.length; u++)
      c.has(t[u]) && h++;
  else
    h = c.size;
  const g = o > 0 && h === o, l = h > 0 && h < o;
  return { totalCount: o, selectedCount: h, isAllSelected: g, isIndeterminate: l };
}
function vn(t, e, o) {
  const c = new Set(t);
  return e == null || ((o !== void 0 ? o : !c.has(e)) ? c.add(e) : c.delete(e)), c;
}
function wn(t, e, o) {
  const c = new Set(t);
  if (!Array.isArray(e)) return c;
  if (o)
    for (let h = 0; h < e.length; h++)
      e[h] != null && c.add(e[h]);
  else
    for (let h = 0; h < e.length; h++)
      c.delete(e[h]);
  return c;
}
(function() {
  const t = "data-ln-table", e = "lnTable";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-table": { prop: "name", type: "string", read: j, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: j, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: xt, description: "Enables row selection check controls" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, g = Y(h);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function l(n, s) {
    if (!n) return;
    if (s == null || isNaN(s)) {
      n.removeAttribute("data-ln-value"), "value" in n && n.tagName === "DATA" && (n.value = ""), n.lnNumber ? n.lnNumber.value = NaN : n.textContent = "";
      return;
    }
    const r = String(s);
    n.setAttribute("data-ln-value", r), "value" in n && n.tagName === "DATA" && (n.value = r), n.lnNumber ? n.lnNumber.value = s : n.textContent = r;
  }
  function u(n, s) {
    let r = s ? s.parentElement : n;
    for (; r && r !== document.body && r !== document.documentElement; ) {
      const m = getComputedStyle(r).overflowY;
      if (m === "auto" || m === "scroll") return r;
      r = r.parentElement;
    }
    return null;
  }
  function a(n) {
    this.dom = n, X(this, n, g), this.table = n.querySelector("table"), this.tbody = n.querySelector("[data-ln-table-body]") || n.querySelector("tbody"), this.thead = n.querySelector("thead");
    const s = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = s ? Array.from(s.querySelectorAll("th")) : [], this._totalSpan = n.querySelector("[data-ln-table-total]"), this._filteredSpan = n.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== n ? this._filteredSpan.parentElement : null), this._selectedSpan = n.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== n ? this._selectedSpan.parentElement : null), this._loadingIndicator = n.querySelector("[data-ln-table-loading]"), this._loadingIndicator && this._loadingIndicator.classList.add("hidden"), this.isDataDriven = n.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._vResized = !1, this._vTop = 0, this._scrollContainer = null, this._colgroup = null, this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const r = this;
    return this._onSetSearch = function(i) {
      const m = (i.detail && i.detail.query != null ? i.detail.query : i.detail && i.detail.term != null ? i.detail.term : "").trim();
      r.isDataDriven ? (r.currentSearch = m, k(n, "ln-table:search", {
        table: r.name,
        query: r.currentSearch
      }), r._requestData()) : (r._searchTerm = m.toLowerCase(), r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), k(n, "ln-table:filter", {
        term: r._searchTerm,
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, n.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(i) {
      i.preventDefault(), r._onSetSearch(i);
    }, n.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      r.isDataDriven ? (r.currentFilters = {}, r.currentSearch = "", k(n, "ln-table:clear-filters", { table: r.name }), r._requestData()) : (r._searchTerm = "", r._columnFilters = {}, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), k(n, "ln-table:filter", {
        term: "",
        matched: r._filteredData.length,
        total: r._data.length
      }));
    }, n.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this._initialLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._onSetData = function(i) {
      const m = i.detail || {}, p = m.data || [], f = m.total != null ? m.total : p.length;
      r._hasInitialSeed && !r.isLoaded && p.length === 0 && f === 0 || (r._data = p, r._lastTotal = f, r._lastFiltered = m.filtered != null ? m.filtered : r._data.length, r.totalCount = r._lastTotal, r.visibleCount = r._lastFiltered, r.isLoaded = !0, r._initialLoaded = !0, r._hasInitialSeed = !1, n.classList.remove("ln-table--loading"), n.setAttribute("aria-busy", "false"), r._loadingIndicator && r._loadingIndicator.classList.add("hidden"), r._vStart = -1, r._vEnd = -1, r._applyFilterAndSort(), r._render(), r._updateFooter(), k(n, "ln-table:rendered", {
        table: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, n.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(i) {
      const m = !!(i.detail && i.detail.loading);
      n.classList.toggle("ln-table--loading", m), n.setAttribute("aria-busy", m ? "true" : "false"), m && !r._initialLoaded && (r.isLoaded = !1, r._showLoadingState()), r._loadingIndicator && r._loadingIndicator.classList.toggle("hidden", !(m && r._initialLoaded));
    }, n.addEventListener("ln-table:set-loading", this._onSetLoading), this._onSort = function(i) {
      !i.detail || i.detail.field == null || (i.preventDefault(), r.currentSort = i.detail.direction === "none" ? null : { field: i.detail.field, direction: i.detail.direction }, r._requestData());
    }, n.addEventListener("ln-sort:change", this._onSort), this._onRowClick = function(i) {
      if (i.target.closest("[data-ln-table-row-select]") || i.target.closest("[data-ln-table-row-action]") || i.target.closest("a") || i.target.closest("button") || i.ctrlKey || i.metaKey || i.button === 1) return;
      const m = i.target.closest("[data-ln-table-row]");
      if (!m) return;
      const p = m.getAttribute("data-ln-table-row-id"), f = m._lnRecord || {};
      k(n, "ln-table:row-click", {
        table: r.name,
        id: p,
        record: f
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(i) {
      const m = i.target.closest("[data-ln-table-row-action]");
      if (!m) return;
      const p = m.closest("[data-ln-table-row]");
      if (!p) return;
      const f = m.getAttribute("data-ln-table-row-action"), d = p.getAttribute("data-ln-table-row-id"), _ = p._lnRecord || {};
      k(n, "ln-table:row-action", {
        table: r.name,
        id: d,
        action: f,
        record: _
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : (this._showLoadingState(), n.setAttribute("aria-busy", "true")), setTimeout(function() {
      !r.dom || !document.contains(r.dom) || k(n, "ln-table:request-data", {
        table: r.name,
        sort: r.currentSort,
        filters: r.currentFilters,
        search: r.currentSearch
      });
    }, 0)) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      r.tbody.rows.length > 0 && (r._emptyTbodyObserver.disconnect(), r._emptyTbodyObserver = null, r._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(i) {
      if (!i.detail || i.detail.column == null) return;
      i.preventDefault();
      const m = i.detail.direction === "none" ? null : i.detail.direction;
      r._sortCol = m === null ? -1 : i.detail.column, r._sortDir = m, r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), k(n, "ln-table:sorted", {
        column: i.detail.column,
        direction: i.detail.direction,
        matched: r._filteredData.length,
        total: r._data.length
      });
    }, n.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(i) {
      if (i.preventDefault(), !i.detail) return;
      const m = i.detail.key, p = i.detail.values || [];
      if (m) {
        if (p.length === 0)
          delete r._columnFilters[m];
        else {
          const f = [];
          for (let d = 0; d < p.length; d++)
            f.push(p[d].toLowerCase());
          r._columnFilters[m] = f;
        }
        r._applyFilterAndSort(), r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), k(n, "ln-table:filter", {
          term: r._searchTerm,
          matched: r._filteredData.length,
          total: r._data.length
        });
      }
    }, n.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  a.prototype._parseRows = function() {
    const n = this.tbody.rows, s = this.ths;
    this._data = [], n.length > 0 && (this._rowHeight = n[0].offsetHeight || 40), this._lockColumnWidths();
    for (let r = 0; r < n.length; r++) {
      const i = n[r], m = [], p = [], f = [];
      for (let _ = 0; _ < i.cells.length; _++) {
        const y = i.cells[_], E = y.textContent.trim();
        m[_] = At(y), p[_] = E.toLowerCase(), y.querySelector("[data-ln-table-row-action]") || f.push(E.toLowerCase());
      }
      let d = null;
      if (this.isDataDriven) {
        d = {};
        const _ = i.getAttribute("data-ln-table-row-id");
        _ != null && (d.id = _);
        for (let y = 0; y < s.length; y++) {
          const E = s[y].getAttribute("data-ln-table-col");
          if (E) {
            const v = y;
            if (v < i.cells.length) {
              const S = i.cells[v];
              d[E] = At(S);
            }
          }
        }
      }
      this._data.push({
        values: m,
        rawTexts: p,
        html: i.outerHTML,
        searchText: f.join(" "),
        id: this.isDataDriven && d ? d.id : void 0,
        ...d
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, a.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, a.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup || this.ths.length && !this.ths[0].offsetWidth) return;
    const n = document.createElement("colgroup");
    this.ths.forEach(function(s) {
      const r = document.createElement("col");
      r.style.width = s.offsetWidth + "px", n.appendChild(r);
    }), this.table.insertBefore(n, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = n;
  }, a.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        const n = this._lastTotal, s = this.visibleCount;
        if (n === 0) {
          if (this._disableVirtualScroll(), !this.isLoaded) {
            this._showLoadingState();
            return;
          }
          this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || s === 0) {
          if (this._disableVirtualScroll(), !this.isLoaded) {
            this._showLoadingState();
            return;
          }
          this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const n = this._filteredData.length;
        n === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : n > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, a.prototype._renderAll = function() {
    this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const n = this._filteredData;
    if (this.isDataDriven || n.length > 0 && !n[0].html) {
      const s = document.createDocumentFragment();
      for (let r = 0; r < n.length; r++) {
        const i = this._buildRow(n[r]);
        if (!i) break;
        s.appendChild(i);
      }
      this.tbody.replaceChildren(s), this._selectable && this._updateSelectAll();
    } else {
      const s = [];
      for (let r = 0; r < n.length; r++) s.push(n[r].html);
      this.tbody.innerHTML = s.join(""), this._selectable && this._restoreSelection();
    }
  }, a.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const n = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let r = null;
        this.isDataDriven && this._data.length > 0 && (r = this._buildRow(this._data[0])), r && this.tbody && (this.tbody.appendChild(r), this._rowHeight = r.offsetHeight || 40, r.remove());
      }
    this._scrollContainer = u(this.dom, this.table);
    const s = this._scrollContainer || window;
    this.dom && (this.dom.style.overflowAnchor = "none"), this.table && (this.table.style.overflowAnchor = "none"), this.tbody && (this.tbody.style.overflowAnchor = "none"), this._scrollContainer && (this._scrollContainer.style.overflowAnchor = "none"), this._scrollHandler = function() {
      n._rafId || (n._rafId = requestAnimationFrame(function() {
        n._rafId = null, n._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      n._lockColumnWidths(), n._vResized = !0, n._scrollHandler();
    }, s.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, a.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._resizeHandler), this._scrollHandler = null, this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1, this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null);
  }, a.prototype._compileRowBindings = function(n) {
    const s = {
      textNodes: [],
      attrs: [],
      cellAttrs: []
    }, r = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
    for (; r.nextNode(); ) {
      const m = r.currentNode;
      if (m.textContent.indexOf("{{") !== -1) {
        const p = m.parentElement;
        s.textNodes.push({
          node: m,
          raw: m.textContent,
          el: p,
          isLeaf: !!(p && p.children.length === 0)
        });
      }
    }
    const i = Array.from(n.querySelectorAll("*"));
    n.nodeType === 1 && i.push(n);
    for (let m = 0; m < i.length; m++) {
      const p = i[m];
      if (p.hasAttribute("data-ln-table-cell-attr")) {
        const d = p.getAttribute("data-ln-table-cell-attr").split(",");
        for (let _ = 0; _ < d.length; _++) {
          const y = d[_].trim().split(":");
          y.length === 2 && s.cellAttrs.push({
            el: p,
            field: y[0].trim(),
            attr: y[1].trim()
          });
        }
      }
      const f = p.attributes;
      for (let d = 0; d < f.length; d++) {
        const _ = f[d];
        _.value.indexOf("{{") !== -1 && s.attrs.push({
          el: p,
          name: _.name,
          raw: _.value
        });
      }
    }
    return n._lnBindings = s, s;
  }, a.prototype._createTemplateRow = function() {
    let n = st(this.dom, this.name + "-row", "ln-table");
    if (!n) {
      const r = this.dom.querySelector("template[data-ln-table-row]");
      r && (n = document.importNode(r.content, !0));
    }
    let s = n ? n.querySelector("[data-ln-table-row]") || n.firstElementChild : null;
    return s ? (this._compileRowBindings(s), s) : ((window.lnDebug || typeof document < "u" && document.body && document.body.hasAttribute("data-ln-debug")) && console.warn(`[ln-table] Missing row template: <template data-ln-template="${this.name}-row">`), null);
  }, a.prototype._updateRow = function(n, s) {
    if (!s) return;
    n._lnRecord = s, s.id != null && n.setAttribute("data-ln-table-row-id", s.id);
    const r = n._lnBindings || this._compileRowBindings(n), i = r.textNodes;
    for (let f = 0; f < i.length; f++) {
      const d = i[f], _ = d.raw.replace(
        /\{\{\s*(\w+)\s*\}\}/g,
        function(y, E) {
          return s[E] !== void 0 && s[E] !== null ? s[E] : "";
        }
      );
      d.isLeaf && d.el ? d.el.textContent = _ : d.node && d.node.parentNode ? d.node.textContent = _ : d.el && (d.el.textContent = _);
    }
    const m = r.attrs;
    for (let f = 0; f < m.length; f++) {
      const d = m[f];
      d.el.setAttribute(
        d.name,
        d.raw.replace(
          /\{\{\s*(\w+)\s*\}\}/g,
          function(_, y) {
            return s[y] !== void 0 && s[y] !== null ? s[y] : "";
          }
        )
      );
    }
    const p = r.cellAttrs;
    for (let f = 0; f < p.length; f++) {
      const d = p[f], _ = s[d.field];
      _ != null && d.el.setAttribute(d.attr, _);
    }
    if (r.textNodes.length === 0 && r.attrs.length === 0 && this.ths.length > 0)
      for (let f = 0; f < this.ths.length; f++) {
        const d = this.ths[f].getAttribute("data-ln-table-col");
        d && f < n.cells.length && s[d] != null && (n.cells[f].textContent = String(s[d]));
      }
    if (this._selectable) {
      const f = s.id != null ? String(s.id) : null, d = f != null && this.selectedIds.has(f);
      n.classList.toggle("ln-row-selected", d);
      const _ = n.querySelector("[data-ln-table-row-select]");
      _ && (_.checked = d);
    }
  }, a.prototype._ensureRowPool = function(n, s) {
    for (this._rowPool ? this._topTd && this._topTd.getAttribute("colspan") !== String(s) && (this._topTd.setAttribute("colspan", s), this._bottomTd.setAttribute("colspan", s)) : (this._rowPool = [], this._topSpacer = document.createElement("tr"), this._topSpacer.className = "ln-table__spacer", this._topSpacer.setAttribute("aria-hidden", "true"), this._topSpacer.style.overflowAnchor = "none", this._topTd = document.createElement("td"), this._topTd.setAttribute("colspan", s), this._topTd.style.padding = "0", this._topTd.style.border = "none", this._topTd.style.overflowAnchor = "none", this._topSpacer.appendChild(this._topTd), this._bottomSpacer = document.createElement("tr"), this._bottomSpacer.className = "ln-table__spacer", this._bottomSpacer.setAttribute("aria-hidden", "true"), this._bottomSpacer.style.overflowAnchor = "none", this._bottomTd = document.createElement("td"), this._bottomTd.setAttribute("colspan", s), this._bottomTd.style.padding = "0", this._bottomTd.style.border = "none", this._bottomTd.style.overflowAnchor = "none", this._bottomSpacer.appendChild(this._bottomTd), this.tbody.replaceChildren(this._topSpacer, this._bottomSpacer)); this._rowPool.length < n; ) {
      const r = this._createTemplateRow();
      if (!r) break;
      this._rowPool.push(r), this.tbody.insertBefore(r, this._bottomSpacer);
    }
  }, a.prototype._renderVirtual = function() {
    const n = this._filteredData, s = n.length;
    if (!this._rowHeight || !s) return;
    const r = this.thead ? this.thead.offsetHeight : 0, i = this._scrollContainer;
    let m, p;
    if (i) {
      const b = this.table.getBoundingClientRect(), w = i.getBoundingClientRect(), A = b.top - w.top + i.scrollTop + r;
      m = i.scrollTop - A, p = i.clientHeight;
    } else {
      const A = this.table.getBoundingClientRect().top + window.scrollY + r;
      m = window.scrollY - A, p = window.innerHeight;
    }
    let f = m;
    if (this._vResized) {
      this._vResized = !1;
      const b = this._vEnd - this._vStart, w = this._rowPool && this._rowPool[b - 1], A = w ? (w.getBoundingClientRect().bottom - this._rowPool[0].getBoundingClientRect().top) / b : 0;
      A && A !== this._rowHeight && (this._rowHeight = A, this._vStart = -1, this._vTop > 0 && (f = this._vTop * A));
    }
    const d = this._rowHeight;
    this._vTop = f / d;
    const _ = Gr(f, p, d, s, 15), y = _.start, E = _.end;
    if (y === this._vStart && E === this._vEnd) return;
    this._vStart = y, this._vEnd = E;
    const v = this.ths.length || 1, S = E - y;
    this._ensureRowPool(S, v), _.topPadding > 0 ? (this._topTd.style.height = _.topPadding + "px", this._topSpacer.style.display = "") : (this._topTd.style.height = "0px", this._topSpacer.style.display = "none"), _.bottomPadding > 0 ? (this._bottomTd.style.height = _.bottomPadding + "px", this._bottomSpacer.style.display = "") : (this._bottomTd.style.height = "0px", this._bottomSpacer.style.display = "none");
    for (let b = 0; b < this._rowPool.length; b++) {
      const w = this._rowPool[b], A = y + b;
      if (b < S && A < s) {
        w.style.display = "";
        const T = n[A];
        if (T && T.html) {
          const L = document.createElement("tbody");
          L.innerHTML = T.html;
          const x = L.firstElementChild;
          x && (w.innerHTML = x.innerHTML, w.className = x.className, w._lnRecord = T, T.id != null && w.setAttribute("data-ln-table-row-id", T.id));
        } else
          this._updateRow(w, T);
      } else
        w.style.display = "none";
    }
    this._selectable && this._updateSelectAll(), f !== m && (i ? i.scrollTop += f - m : window.scrollTo(window.scrollX, window.scrollY + f - m));
  }, a.prototype._showLoadingState = function() {
    this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const n = this.ths.length || 1;
    let s = null, r = st(this.dom, this.name + "-loading", "ln-table") || st(this.dom, "table-loading", "ln-table");
    if (!r) {
      const i = this.dom.querySelector("template[data-ln-table-loading]");
      i && (r = document.importNode(i.content, !0));
    }
    if (r)
      if (r.tagName === "TR")
        s = r;
      else {
        const i = document.createElement("td");
        i.setAttribute("colspan", String(n)), i.appendChild(r);
        const m = document.createElement("tr");
        m.appendChild(i), s = m;
      }
    s ? (s.setAttribute("data-ln-table-empty", ""), this.tbody.replaceChildren(s)) : this.tbody.replaceChildren();
  }, a.prototype._showEmptyState = function() {
    this._rowPool = null, this._topSpacer = null, this._topTd = null, this._bottomSpacer = null, this._bottomTd = null;
    const n = this.ths.length || 1;
    let s = null, r = null;
    if (this.isDataDriven) {
      const i = this._lastTotal != null ? this._lastTotal : this._data.length, p = this.visibleCount === 0 && i > 0, f = p ? this.name + "-empty-filtered" : this.name + "-empty";
      if (r = st(this.dom, f, "ln-table") || st(this.dom, p ? "table-empty-filtered" : "table-empty", "ln-table"), !r) {
        const d = this.dom.querySelector("template[data-ln-table-empty]");
        if (d) {
          const _ = p ? "search" : "initial", y = d.content.querySelector('[data-ln-table-empty-when="' + _ + '"]') || d.content.firstElementChild;
          y && (r = document.importNode(y, !0));
        }
      }
    } else if (r = st(this.dom, this.name + "-empty", "ln-table") || st(this.dom, "table-empty", "ln-table"), !r) {
      const i = this.dom.querySelector("template[data-ln-table-empty]");
      i && (r = document.importNode(i.content, !0));
    }
    if (r)
      if (r.tagName === "TR")
        s = r;
      else {
        const i = document.createElement("td");
        i.setAttribute("colspan", String(n)), i.appendChild(r);
        const m = document.createElement("tr");
        m.appendChild(i), s = m;
      }
    s ? (s.setAttribute("data-ln-table-empty", ""), this.tbody.replaceChildren(s)) : this.tbody.replaceChildren(), k(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, a.prototype._fillRow = function(n, s) {
    Zt(n, s);
    const r = n.querySelectorAll("[data-ln-table-cell-attr]");
    for (let i = 0; i < r.length; i++) {
      const m = r[i], p = m.getAttribute("data-ln-table-cell-attr").split(",");
      for (let f = 0; f < p.length; f++) {
        const d = p[f].trim().split(":");
        if (d.length !== 2) continue;
        const _ = d[0].trim(), y = d[1].trim();
        s[_] != null && m.setAttribute(y, s[_]);
      }
    }
  }, a.prototype._buildRow = function(n) {
    let s = st(this.dom, this.name + "-row", "ln-table");
    if (!s) {
      const i = this.dom.querySelector("template[data-ln-table-row]");
      i && (s = document.importNode(i.content, !0));
    }
    let r = s ? s.querySelector("[data-ln-table-row]") || s.firstElementChild : null;
    if (r)
      this._fillRow(r, n);
    else if (n && n.html) {
      const i = document.createElement("tbody");
      i.innerHTML = n.html, r = i.firstElementChild;
    } else
      return (window.lnDebug || typeof document < "u" && document.body && document.body.hasAttribute("data-ln-debug")) && console.warn(`[ln-table] Missing row template: <template data-ln-template="${this.name}-row">`), null;
    if (r._lnRecord = n, n.id != null && r.setAttribute("data-ln-table-row-id", n.id), this._selectable && n.id != null && this.selectedIds.has(String(n.id))) {
      r.classList.add("ln-row-selected");
      const i = r.querySelector("[data-ln-table-row-select]");
      i && (i.checked = !0);
    }
    return r;
  }, a.prototype._requestData = function() {
    kn(this, "ln-table:request-data", "table");
  }, a.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-table-row]"), s = [];
    for (let i = 0; i < n.length; i++) {
      const m = n[i].getAttribute("data-ln-table-row-id");
      m != null && s.push(m);
    }
    const r = Qr(s, this.selectedIds);
    this._selectAllCheckbox.checked = r.isAllSelected, this._selectAllCheckbox.indeterminate = r.isIndeterminate;
  }, a.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const n = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let s = 0; s < n.length; s++) {
      const r = n[s].getAttribute("data-ln-table-row-id"), i = r != null && this.selectedIds.has(r);
      n[s].classList.toggle("ln-row-selected", i);
      const m = n[s].querySelector("[data-ln-table-row-select]");
      m && (m.checked = i);
    }
    this._updateSelectAll();
  }, Object.defineProperty(a.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), a.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const n = this;
    if (this._onSelectionChange = function(s) {
      const r = s.target.closest("[data-ln-table-row-select]");
      if (!r) return;
      const i = r.closest("[data-ln-table-row]");
      if (!i) return;
      const m = i.getAttribute("data-ln-table-row-id");
      m != null && (n.selectedIds = vn(n.selectedIds, m, r.checked), i.classList.toggle("ln-row-selected", r.checked), n.selectedCount = n.selectedIds.size, n._updateSelectAll(), n._updateFooter(), k(n.dom, "ln-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const s = document.createElement("input");
      s.type = "checkbox";
      const r = n.dom.querySelector('[data-ln-table-dict="select-all"]'), i = n.dom.getAttribute("data-ln-table-select-all-label") || (r ? r.textContent.trim() : null) || "Select all";
      s.setAttribute("aria-label", i), this._selectAllCheckbox.appendChild(s), this._selectAllCheckbox = s;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const s = n._selectAllCheckbox.checked, r = n.tbody ? n.tbody.querySelectorAll("[data-ln-table-row]") : [], i = [];
      for (let m = 0; m < r.length; m++) {
        const p = r[m].getAttribute("data-ln-table-row-id"), f = r[m].querySelector("[data-ln-table-row-select]");
        p != null && (i.push(p), r[m].classList.toggle("ln-row-selected", s), f && (f.checked = s));
      }
      n.selectedIds = wn(n.selectedIds, i, s), n.selectedCount = n.selectedIds.size, k(n.dom, "ln-table:select-all", {
        table: n.name,
        selected: s
      }), k(n.dom, "ln-table:select", {
        table: n.name,
        selectedIds: n.selectedIds,
        count: n.selectedCount
      }), n._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const s = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let r = 0; r < s.length; r++) {
        const i = s[r].querySelector("[data-ln-table-row-select]"), m = s[r].getAttribute("data-ln-table-row-id");
        i && i.checked && m != null && (n.selectedIds = vn(n.selectedIds, m, !0), s[r].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, a.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const n = this.dom.querySelector("[data-ln-table-col-select]");
    if (n) {
      const s = n.querySelector('input[type="checkbox"]');
      s && s.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = wn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const s = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let r = 0; r < s.length; r++) {
        s[r].classList.remove("ln-row-selected");
        const i = s[r].querySelector("[data-ln-table-row-select]");
        i && (i.checked = !1);
      }
    }
    this._updateFooter();
  }, a.prototype._updateFooter = function() {
    let n = 0, s = 0;
    this.isDataDriven ? (n = this._lastTotal != null ? this._lastTotal : this._data.length, s = this.visibleCount) : (n = this._data.length, s = this._filteredData.length);
    const r = s < n;
    if (this._totalSpan && l(this._totalSpan, n), this._filteredSpan && l(this._filteredSpan, r ? s : null), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !r), this._selectedSpan) {
      const i = this.selectedIds ? this.selectedIds.size : 0;
      l(this._selectedSpan, i > 0 ? i : null), this._selectedWrap && this._selectedWrap.classList.toggle("hidden", i === 0);
    }
  }, a.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction))) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._loadingIndicator = null, this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, a, "ln-table", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-table-coordinator": { type: "marker", description: "Mounts table coordinator mediating between table, search, filter, and pagination" }
  };
  document.addEventListener("keydown", function(r) {
    if (r.key !== "/" || r.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const i = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!i) return;
    const m = i.tagName === "INPUT" || i.tagName === "TEXTAREA" ? i : i.querySelector('input[type="search"], input[type="text"], input');
    m && (r.preventDefault(), m.focus());
  });
  function c(r) {
    return !(r.hasAttribute("data-ln-search-hide") || r.hasAttribute("data-ln-filter-hide") || r.hidden || r.classList && r.classList.contains("hidden") || r.style && r.style.display === "none");
  }
  function h(r) {
    if (r._emptyEl) return r._emptyEl;
    const i = r.dom.querySelector("template[data-ln-table-empty]");
    if (!i) return null;
    const m = i.content.firstElementChild;
    if (!m) return null;
    const p = document.importNode(m, !0);
    p.setAttribute("data-ln-table-empty", ""), p.classList.add("hidden"), p.hidden = !0;
    const f = r.dom.querySelector("table");
    return f ? ((f.closest(".table-container") || f).insertAdjacentElement("afterend", p), r._emptyEl = p, p) : null;
  }
  function g(r) {
    const i = r.dom.querySelector("table");
    if (!i || i.hasAttribute("data-ln-table") || i.parentElement && i.parentElement.hasAttribute("data-ln-table") || !r.dom.querySelector("template[data-ln-table-empty]")) return;
    const p = h(r);
    if (!p) return;
    const f = i.querySelectorAll("tbody tr");
    let d = !1;
    for (let y = 0; y < f.length; y++) {
      const E = f[y];
      if (!E.hasAttribute("data-ln-table-empty") && c(E)) {
        d = !0;
        break;
      }
    }
    f.length > 0 && !d ? (p.classList.remove("hidden"), p.hidden = !1) : (p.classList.add("hidden"), p.hidden = !0);
  }
  function l(r) {
    const i = r.dom.querySelector("table");
    if (!i || i.hasAttribute("data-ln-table") || i.parentElement && i.parentElement.hasAttribute("data-ln-table") || !r.dom.querySelector("template[data-ln-table-empty]")) return;
    const p = i.querySelector("tbody") || i, f = new MutationObserver(function() {
      g(r);
    });
    f.observe(p, {
      attributes: !0,
      attributeFilter: ["data-ln-search-hide", "data-ln-filter-hide", "hidden", "class", "style"],
      subtree: !0,
      childList: !0
    }), r._emptyObserver = f, g(r);
  }
  function u(r) {
    return this.dom = r, this._emptyEl = null, this._emptyObserver = null, s(this), l(this), this;
  }
  function a(r, i) {
    const m = i ? '[data-ln-search-for="' + i + '"]' : "[data-ln-search-for]", p = r.querySelector(m) || document.querySelector(m);
    return p ? p.tagName === "INPUT" || p.tagName === "TEXTAREA" ? p : p.querySelector("input, textarea") : null;
  }
  function n(r, i) {
    if (i) {
      const p = r.querySelectorAll('[data-ln-filter="' + i + '"]');
      if (p.length > 0) return p;
      const f = document.querySelectorAll('[data-ln-filter="' + i + '"]');
      if (f.length > 0) return f;
    }
    const m = r.querySelectorAll("[data-ln-filter]");
    return m.length > 0 ? m : document.querySelectorAll("[data-ln-filter]");
  }
  function s(r) {
    const i = r.dom;
    function m(p) {
      const f = p.target;
      if (f && f.hasAttribute && (f.hasAttribute("data-ln-table") || f.tagName === "TABLE")) return f;
      const d = p.detail && p.detail.targetId || f && f.id;
      if (!d) return null;
      const _ = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(d) : d.replace(/(["\\])/g, "\\$1");
      return i.querySelector('[data-ln-table-source="' + _ + '"]') || i.querySelector('[data-ln-table="' + _ + '"]') || (i.id === d ? i : null) || document.getElementById(d);
    }
    r._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(p) {
        if (!p.detail) return;
        const f = m(p);
        if (!f) return;
        const d = p.detail.key, _ = p.detail.values || [], y = f.querySelectorAll("th");
        for (let E = 0; E < y.length; E++)
          if ((y[E].getAttribute("data-ln-table-filter-col") || y[E].getAttribute("data-ln-filter-col") || y[E].getAttribute("data-ln-filter-key") || y[E].getAttribute("data-ln-field")) === d) {
            const S = y[E].querySelector("[data-ln-table-col-filter]");
            S && S.classList.toggle("ln-filter-active", _.length > 0);
            break;
          }
        g(r);
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(p) {
        const f = p.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!f) return;
        const d = f.closest("[data-ln-table], table") || i.querySelector("[data-ln-table], table");
        if (!d) return;
        const _ = d.lnTable && d.lnTable.name || d.id, y = d.querySelectorAll("th");
        for (let b = 0; b < y.length; b++) {
          const w = y[b].querySelector("[data-ln-table-col-filter]");
          w && w.classList.remove("ln-filter-active");
        }
        const E = d.getAttribute("data-ln-table-source") || d.id, v = E ? document.getElementById(E) : null;
        if (v && v.hasAttribute("data-ln-search"))
          v.setAttribute("data-ln-search", "");
        else {
          const b = a(i, E);
          b && b.value !== "" && (b.value = "", b.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const S = n(i, E);
        for (let b = 0; b < S.length; b++) {
          const w = S[b].querySelector("[data-ln-filter-reset]");
          if (!w) continue;
          const A = S[b].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!w.checked || A) && (w.checked = !0, w.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        d.lnTable && !d.hasAttribute("data-ln-table-source") && k(d, "ln-table:request-clear-filters", { table: _ }), g(r);
      }
    }, i.addEventListener("ln-filter:change", r._handlers.filter), i.addEventListener("click", r._handlers.clear);
  }
  u.prototype.destroy = function() {
    this.dom[e] && (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._emptyEl && (this._emptyEl.parentNode && this._emptyEl.remove(), this._emptyEl = null), this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, H(t, e, u, "ln-table-coordinator", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", o = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function a(v, S) {
    if (!v || !v.isDataDriven) return;
    const b = v.dom.hasAttribute("data-ln-list-window");
    if (b && !v._windowed)
      v._enterWindowedMode(), v._kickWindowInitial();
    else if (!b && v._windowed)
      v._exitWindowedMode();
    else if (b && v._windowed) {
      const w = parseInt(S, 10);
      w > 0 && v._cache.configure({ windowSize: w });
    }
  }
  function n(v, S) {
    if (!v || !v.isDataDriven || !v._windowed || !v._cache) return;
    const b = parseInt(S, 10);
    b > 0 && v._cache.configure({ pageSize: b });
  }
  function s(v, S) {
    if (!v || !v.isDataDriven || !v._windowed || !v._cache) return;
    const b = parseInt(S, 10);
    b >= 0 && v._cache.configure({ threshold: b });
  }
  function r(v, S) {
    if (!v || !v.isDataDriven || !v._windowed || !v._cache) return;
    const b = parseInt(S, 10);
    b >= 0 && v._cache.setGrandTotal(b);
  }
  const i = {
    "data-ln-list": { prop: "name", type: "string", read: j, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: j, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: xt, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: a, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: s, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: r, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, m = Y(i);
  function p(v, S) {
    if (v == null || isNaN(v)) return "";
    try {
      return new Intl.NumberFormat(Z(S)).format(v);
    } catch {
      return String(v);
    }
  }
  function f(v) {
    let S = v;
    for (; S && S !== document.body && S !== document.documentElement; ) {
      const w = getComputedStyle(S).overflowY;
      if (w === "auto" || w === "scroll") return S;
      S = S.parentElement;
    }
    return null;
  }
  function d(v) {
    const S = v._scrollContainer || f(v.dom);
    return {
      container: S,
      top: S ? S.scrollTop : window.scrollY
    };
  }
  function _(v) {
    v.container ? v.container.scrollTop = v.top : window.scrollTo(window.scrollX, v.top);
  }
  function y(v) {
    if (!v) return 0;
    const S = getComputedStyle(v), b = parseFloat(S.marginTop) || 0, w = parseFloat(S.marginBottom) || 0;
    return v.offsetHeight + b + w;
  }
  function E(v) {
    this.dom = v, X(this, v, m), this.tbody = v.querySelector("[data-ln-list-body]") || v, this.isDataDriven = v.hasAttribute("data-ln-list-source"), this._totalSpan = v.querySelector("[data-ln-list-total]"), this._filteredSpan = v.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== v ? this._filteredSpan.parentElement : null), this._selectedSpan = v.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== v ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const S = this;
    return this._onSetSearch = function(b) {
      const w = (b.detail && b.detail.query != null ? b.detail.query : b.detail && b.detail.term != null ? b.detail.term : "").trim();
      S.isDataDriven ? (S.currentSearch = w, k(v, "ln-list:search", {
        list: S.name,
        query: S.currentSearch
      }), S._requestData()) : (S._searchTerm = w.toLowerCase(), S._applyFilterAndSort(), S._vStart = -1, S._vEnd = -1, S._render(), S._updateFooter(), k(v, "ln-list:filter", {
        term: S._searchTerm,
        matched: S._filteredData.length,
        total: S._data.length
      }));
    }, v.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(b) {
      b.preventDefault(), S._onSetSearch(b);
    }, v.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      S.isDataDriven ? (S.currentFilters = {}, S.currentSearch = "", k(v, "ln-list:clear-filters", { list: S.name }), S._requestData()) : (S._searchTerm = "", S._filters = {}, S._sortField = null, S._sortDir = null, S._applyFilterAndSort(), S._vStart = -1, S._vEnd = -1, S._render(), S._updateFooter(), k(v, "ln-list:filter", {
        term: "",
        matched: S._filteredData.length,
        total: S._data.length
      }));
    }, v.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, v.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(b) {
      const w = b.detail || {}, A = w.data || [], T = w.total != null ? w.total : A.length;
      if (!(S._hasInitialSeed && !S.isLoaded && A.length === 0 && T === 0)) {
        if (S._windowed) {
          S._cache.ingest(w) && !w.provisional && v.classList.remove("ln-list--loading");
          return;
        }
        S._data = A, S._lastTotal = T, S._lastFiltered = w.filtered != null ? w.filtered : S._data.length, S.totalCount = S._lastTotal, S.visibleCount = S._lastFiltered, S.isLoaded = !0, S._hasInitialSeed = !1, v.classList.remove("ln-list--loading"), S._vStart = -1, S._vEnd = -1, S._applyFilterAndSort(), S._render(), S._updateFooter(), k(v, "ln-list:rendered", {
          list: S.name,
          total: S.totalCount,
          visible: S.visibleCount
        });
      }
    }, v.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(b) {
      const w = b.detail && b.detail.loading;
      v.classList.toggle("ln-list--loading", !!w), w && (S.isLoaded = !1);
    }, v.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(b) {
      !S._windowed || !S._cache || S._cache.release(b.detail && b.detail.offset);
    }, v.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !S._windowed || !S._cache || S._cache.revalidate();
    }, v.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !S._windowed || !S._cache || S._requestData();
    }, v.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(b) {
      !b.detail || b.detail.field == null || (b.preventDefault(), S.currentSort = b.detail.direction === "none" ? null : { field: b.detail.field, direction: b.detail.direction }, S._requestData());
    }, v.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(b) {
      if (b.target.closest("[data-ln-item-select]") || b.target.closest("[data-ln-item-action]") || b.target.closest("a") || b.target.closest("button") || b.ctrlKey || b.metaKey || b.button === 1) return;
      const w = b.target.closest("[data-ln-item]");
      if (!w) return;
      const A = w.getAttribute("data-ln-item-id"), T = w._lnRecord || {};
      k(v, "ln-list:item-click", {
        list: S.name,
        id: A,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(b) {
      const w = b.target.closest("[data-ln-item-action]");
      if (!w) return;
      const A = w.closest("[data-ln-item]");
      if (!A) return;
      const T = w.getAttribute("data-ln-item-action"), L = A.getAttribute("data-ln-item-id"), x = A._lnRecord || {};
      k(v, "ln-list:item-action", {
        list: S.name,
        id: L,
        action: T,
        record: x
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : k(v, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      S.tbody.children.length > 0 && (S._emptyObserver.disconnect(), S._emptyObserver = null, S._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(b) {
      if (b.preventDefault(), !b.detail) return;
      const w = b.detail.key, A = b.detail.values || [];
      if (w) {
        if (A.length === 0)
          delete S._filters[w];
        else {
          const T = [];
          for (let L = 0; L < A.length; L++)
            T.push(A[L].toLowerCase());
          S._filters[w] = T;
        }
        S._applyFilterAndSort(), S._vStart = -1, S._vEnd = -1, S._render(), S._updateFooter(), k(v, "ln-list:filter", {
          term: S._searchTerm,
          matched: S._filteredData.length,
          total: S._data.length
        });
      }
    }, v.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(b) {
      if (!b.detail || b.detail.field == null) return;
      b.preventDefault();
      const w = b.detail.direction === "none" ? null : b.detail.direction;
      S._sortField = w === null ? null : b.detail.field, S._sortDir = w, S._applyFilterAndSort(), S._vStart = -1, S._vEnd = -1, S._render(), S._updateFooter(), k(v, "ln-list:sorted", {
        field: S._sortField,
        direction: b.detail && b.detail.direction,
        matched: S._filteredData.length,
        total: S._data.length
      });
    }, v.addEventListener("ln-sort:change", this._onSort)), this;
  }
  E.prototype._parseChildren = function() {
    const v = Array.from(this.tbody.children).filter((S) => !S.classList.contains("ln-list__spacer"));
    this._data = [], v.length > 0 && (this._itemHeight = y(v[0]) || 50);
    for (let S = 0; S < v.length; S++) {
      const b = v[S], w = b.getAttribute("data-ln-item-id") || b.getAttribute("id"), A = b.textContent.trim().toLowerCase();
      let T = null;
      if (this.isDataDriven) {
        T = {}, w != null && (T.id = w);
        const D = b.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const O = D[I], P = O.getAttribute("data-ln-list-field");
          P && (T[P] = At(O));
        }
      }
      const L = {}, x = b.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < x.length; D++) {
        const I = x[D], O = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
        O && (L[O] = At(I));
      }
      for (let D = 0; D < b.attributes.length; D++) {
        const I = b.attributes[D];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const O = I.name.slice(5);
          O && (L[O] = I.value);
        }
      }
      this._data.push({
        html: b.outerHTML,
        id: w,
        searchText: A,
        fields: L,
        ...T || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, E.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const v = this._searchTerm, S = v ? v.split(/\s+/).filter(Boolean) : [], b = this._filters || {}, w = Object.keys(b).length > 0;
      if (S.length === 0 && !w ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(A) {
        if (S.length > 0 && !S.every(function(L) {
          return A.searchText && A.searchText.indexOf(L) !== -1;
        }))
          return !1;
        if (w)
          for (const T in b) {
            const L = b[T];
            if (L && L.length > 0) {
              const x = A.fields && A.fields[T] !== void 0 ? A.fields[T] : A[T] !== void 0 ? A[T] : null, D = x != null ? String(x).toLowerCase() : "";
              if (L.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const A = this._sortField, T = this._sortDir === "desc" ? -1 : 1, L = typeof Intl < "u" ? new Intl.Collator(Z(this.dom), { sensitivity: "base" }) : null, x = this._filteredData.map(function(I) {
          return I.fields && I.fields[A] !== void 0 ? I.fields[A] : I[A];
        }), D = Qe(x);
        this._filteredData.sort(function(I, O) {
          const P = I.fields && I.fields[A] !== void 0 ? I.fields[A] : I[A], U = O.fields && O.fields[A] !== void 0 ? O.fields[A] : O[A];
          return Xe(P, U, D, L) * T;
        });
      }
    }
  }, E.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const v = this._lastTotal, S = this.visibleCount;
        if (v === 0 || this._filteredData.length === 0 || S === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const v = this._filteredData.length;
        v === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : v > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, E.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const v = this._filteredData, S = document.createDocumentFragment();
      for (let w = 0; w < v.length; w++) {
        const A = this._buildItem(v[w]);
        A && S.appendChild(A);
      }
      const b = d(this);
      this.tbody.replaceChildren(S), _(b), this._selectable && this._updateSelectAll();
    } else {
      const v = [], S = this._filteredData;
      for (let w = 0; w < S.length; w++) v.push(S[w].html);
      const b = d(this);
      this.tbody.innerHTML = v.join(""), _(b), this._selectable && this._restoreSelection();
    }
  }, E.prototype._readGridLayout = function() {
    const v = getComputedStyle(this.tbody), S = v.gridTemplateColumns;
    let b = 1;
    if (S && S !== "none") {
      const A = S.trim().split(/\s+/).filter(Boolean);
      A.length > 0 && (b = A.length);
    }
    const w = parseFloat(v.rowGap);
    return { columns: b, rowGap: isNaN(w) ? 0 : w };
  }, E.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const v = this._cache.peek(), S = v ? this._buildItem(v) : this._buildPlaceholderItem();
      S && (this.tbody.textContent = "", this.tbody.appendChild(S), this._itemHeight = y(S) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const v = this._buildItem(this._data[0]);
        v && (this.tbody.textContent = "", this.tbody.appendChild(v), this._itemHeight = y(v) || 50, this.tbody.textContent = "");
      }
    } else {
      const v = this.tbody.children;
      v.length > 0 && (this._itemHeight = y(v[0]) || 50);
    }
  }, E.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const v = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = f(this.dom);
    const S = this._scrollContainer || window;
    this._scrollHandler = function() {
      v._rafId || (v._rafId = requestAnimationFrame(function() {
        v._rafId = null, v._windowed ? v._renderWindowed() : v._renderVirtual();
      }));
    }, this._resizeRafId = null, this._resizeHandler = function() {
      v._resizeRafId || (v._resizeRafId = requestAnimationFrame(function() {
        v._resizeRafId = null, v._itemHeight = 0, v._measureItemHeight(), v._vStart = -1, v._vEnd = -1, v._windowed ? v._renderWindowed() : v._renderVirtual();
      }));
    }, S.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, E.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._resizeRafId && (cancelAnimationFrame(this._resizeRafId), this._resizeRafId = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, E.prototype._renderVirtual = function() {
    const v = this._filteredData, S = v.length, b = this._itemHeight;
    if (!b || !S) return;
    const w = this._scrollContainer;
    let A, T;
    if (w) {
      const nt = this.tbody.getBoundingClientRect(), W = w.getBoundingClientRect(), V = w === this.tbody ? 0 : nt.top - W.top + w.scrollTop;
      A = w.scrollTop - V, T = w.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      A = window.scrollY - W, T = window.innerHeight;
    }
    const L = this._readGridLayout(), x = L.columns, D = L.rowGap, I = b + D, O = Math.ceil(S / x);
    let P = Math.max(0, Math.floor(A / I) - 15);
    P = Math.min(P, O);
    const U = Math.ceil(T / I) + 30, K = Math.min(P + U, O), Q = Math.min(P * x, S), J = Math.min(K * x, S);
    if (Q === this._vStart && J === this._vEnd) return;
    this._vStart = Q, this._vEnd = J;
    const rt = P * I, ct = (O - K) * I;
    if (this.isDataDriven) {
      const nt = document.createDocumentFragment();
      if (rt > 0) {
        const V = document.createElement(this.isUl ? "li" : "div");
        V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = rt + "px", nt.appendChild(V);
      }
      for (let V = Q; V < J; V++) {
        const Ct = this._buildItem(v[V]);
        Ct && nt.appendChild(Ct);
      }
      if (ct > 0) {
        const V = document.createElement(this.isUl ? "li" : "div");
        V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = ct + "px", nt.appendChild(V);
      }
      const W = d(this);
      this.tbody.replaceChildren(nt), _(W), this._selectable && this._updateSelectAll();
    } else {
      let nt = "";
      rt > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${rt}px"></${this.isUl ? "li" : "div"}>`);
      for (let V = Q; V < J; V++)
        nt += v[V].html;
      ct > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${ct}px"></${this.isUl ? "li" : "div"}>`);
      const W = d(this);
      this.tbody.innerHTML = nt, _(W), this._selectable && this._restoreSelection();
    }
  }, E.prototype._buildPlaceholderItem = function() {
    const v = document.createElement(this.isUl ? "li" : "div");
    return v.className = "ln-list__placeholder", v.setAttribute("aria-hidden", "true"), v.style.height = this._itemHeight + "px", v;
  }, E.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const v = this._itemHeight;
    if (!v) return;
    const S = this._scrollContainer;
    let b, w;
    if (S) {
      const W = this.tbody.getBoundingClientRect(), V = S.getBoundingClientRect(), Ct = S === this.tbody ? 0 : W.top - V.top + S.scrollTop;
      b = S.scrollTop - Ct, w = S.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - V, w = window.innerHeight;
    }
    const A = this._readGridLayout(), T = A.columns, L = A.rowGap, x = v + L, D = this._cache.logicalTotal, I = Math.ceil(D / T);
    let O = Math.max(0, Math.floor(b / x) - 15);
    O = Math.min(O, I);
    const P = Math.ceil(w / x) + 30, U = Math.min(O + P, I), K = Math.min(O * T, D), Q = Math.min(U * T, D), J = O * x, rt = (I - U) * x, ct = document.createDocumentFragment();
    if (J > 0) {
      const W = document.createElement(this.isUl ? "li" : "div");
      W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = J + "px", ct.appendChild(W);
    }
    for (let W = K; W < Q; W++)
      if (this._cache.has(W)) {
        const V = this._buildItem(this._cache.get(W));
        V && ct.appendChild(V);
      } else
        ct.appendChild(this._buildPlaceholderItem());
    if (rt > 0) {
      const W = document.createElement(this.isUl ? "li" : "div");
      W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = rt + "px", ct.appendChild(W);
    }
    const nt = d(this);
    this.tbody.replaceChildren(ct), _(nt), this._vStart = K, this._vEnd = Q, this._cache.ensure(K, Q);
  }, E.prototype._showEmptyState = function() {
    let v = null;
    if (this.isDataDriven) {
      const S = this._lastTotal != null ? this._lastTotal : this._data.length, w = this.visibleCount === 0 && S > 0, A = w ? this.name + "-empty-filtered" : this.name + "-empty";
      if (v = st(this.dom, A, "ln-list"), !v) {
        const T = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (T) {
          const L = w ? "search" : "initial", x = T.content.querySelector(`[data-ln-empty-when="${L}"]`) || T.content.firstElementChild;
          x && (v = document.importNode(x, !0));
        }
      }
    } else {
      const S = this.dom.querySelector(`template[${o}]`);
      if (S) {
        const b = S.content.firstElementChild;
        b && (v = document.importNode(b, !0));
      }
    }
    if (v)
      if (v.tagName === "LI" || v.tagName === "TR")
        this.tbody.replaceChildren(v);
      else {
        const S = document.createElement(this.isUl ? "li" : "div");
        S.appendChild(v), this.tbody.replaceChildren(S);
      }
    else
      this.tbody.replaceChildren();
    k(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, E.prototype._buildItem = function(v) {
    let S = st(this.dom, this.name + "-row", "ln-list");
    if (!S) {
      const w = this.dom.querySelector("template[data-ln-item]");
      w && (S = document.importNode(w.content, !0));
    }
    let b = S ? S.querySelector("[data-ln-item]") || S.firstElementChild : null;
    if (b)
      Zt(b, v), mt(b, v);
    else if (v && v.html) {
      const w = document.createElement(this.isUl ? "ul" : "div");
      w.innerHTML = v.html, b = w.firstElementChild;
    } else if (b = document.createElement(this.isUl ? "li" : "div"), b.setAttribute("data-ln-item", ""), v && typeof v == "object") {
      for (const w in v)
        if (w !== "html" && v[w] != null) {
          const A = document.createElement("span");
          A.setAttribute("data-ln-field", w), A.textContent = String(v[w]), b.appendChild(A);
        }
    }
    if (b._lnRecord = v, v && v.id != null && (b.setAttribute("data-ln-item-id", v.id), this._selectable && this.selectedIds.has(String(v.id)))) {
      b.classList.add("ln-item-selected");
      const w = b.querySelector("[data-ln-item-select]");
      w && (w.checked = !0);
    }
    return b;
  }, E.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const v = this.tbody.querySelectorAll("[data-ln-item]");
    for (let S = 0; S < v.length; S++) {
      const b = v[S].getAttribute("data-ln-item-id"), w = b != null && this.selectedIds.has(String(b));
      v[S].classList.toggle("ln-item-selected", w);
      const A = v[S].querySelector("[data-ln-item-select]");
      A && (A.checked = w);
    }
    this._updateSelectAll();
  }, E.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const v = this;
    this._onSelectionChange = function(S) {
      const b = S.target.closest("[data-ln-item-select]");
      if (!b) return;
      const w = b.closest("[data-ln-item]");
      if (!w) return;
      const A = w.getAttribute("data-ln-item-id");
      A != null && (b.checked ? (v.selectedIds.add(String(A)), w.classList.add("ln-item-selected")) : (v.selectedIds.delete(String(A)), w.classList.remove("ln-item-selected")), v._updateSelectAll(), v._updateFooter(), k(v.dom, "ln-list:select", {
        list: v.name,
        selectedIds: v.selectedIds,
        count: v.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const S = v._selectAllCheckbox.checked, b = v.tbody.querySelectorAll("[data-ln-item]");
      for (let w = 0; w < b.length; w++) {
        const A = b[w], T = A.getAttribute("data-ln-item-id"), L = A.querySelector("[data-ln-item-select]");
        T != null && (S ? (v.selectedIds.add(String(T)), A.classList.add("ln-item-selected")) : (v.selectedIds.delete(String(T)), A.classList.remove("ln-item-selected")), L && (L.checked = S));
      }
      k(v.dom, "ln-list:select-all", { list: v.name, selected: S }), k(v.dom, "ln-list:select", {
        list: v.name,
        selectedIds: v.selectedIds,
        count: v.selectedIds.size
      }), v._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, E.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const v = this.tbody.querySelectorAll("[data-ln-item]");
    let S = v.length > 0;
    for (let b = 0; b < v.length; b++) {
      const w = v[b].getAttribute("data-ln-item-id");
      if (w != null && !this.selectedIds.has(String(w))) {
        S = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = S;
  }, E.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    kn(this, "ln-list:request-data", "list");
  }, E.prototype._enterWindowedMode = function() {
    const v = this, S = this.dom, b = parseInt(S.getAttribute("data-ln-list-window"), 10), w = parseInt(S.getAttribute("data-ln-list-window-page"), 10), A = parseInt(S.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !v._windowed || !v._cache || (v.totalCount = v._cache.grandTotal, v.visibleCount = v._cache.logicalTotal, v._lastTotal = v._cache.grandTotal, v.isLoaded = !0, v._vStart = -1, v._vEnd = -1, v._render(), v._updateFooter(), k(S, "ln-list:rendered", {
        list: v.name,
        total: v.totalCount,
        visible: v.visibleCount
      }));
    }, this._renderBatch = Xt(this._onCacheChange), this._cache = or({
      windowSize: b > 0 ? b : 1e3,
      pageSize: w > 0 ? w : 200,
      threshold: A >= 0 ? A : 25,
      fetchDebounce: 120,
      requestPage: function(T, L, x) {
        k(S, "ln-list:request-data", {
          list: v.name,
          sort: T.sort,
          filters: T.filters,
          search: T.search,
          offset: L,
          limit: x,
          queryGen: v._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, E.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const v = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), S = v > 0 ? v : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: S,
        filtered: S
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, E.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, E.prototype._updateFooter = function() {
    let v = 0, S = 0;
    this.isDataDriven ? (v = this._lastTotal != null ? this._lastTotal : this._data.length, S = this.visibleCount) : (v = this._data.length, S = this._filteredData.length);
    const b = S < v;
    if (this._totalSpan && (this._totalSpan.textContent = p(v, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = b ? p(S, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !b), this._selectedSpan) {
      const w = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = w > 0 ? p(w, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", w === 0);
    }
  }, E.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, E, "ln-list", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function o(i) {
    const m = i[e];
    m && r.call(m);
  }
  const c = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: o, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: o, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: o, description: "Text label format or template inside circular progress" }
  }, h = "http://www.w3.org/2000/svg", g = 36, l = 16, u = 2 * Math.PI * l;
  function a(i) {
    return this.dom = i, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, s.call(this), r.call(this), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(i, m) {
    const p = document.createElementNS(h, i);
    for (const [f, d] of Object.entries(m))
      p.setAttribute(f, d);
    return p;
  }
  function s() {
    this.svg = n("svg", {
      viewBox: "0 0 " + g + " " + g,
      width: g,
      height: g
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: g / 2,
      cy: g / 2,
      r: l,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: g / 2,
      cy: g / 2,
      r: l,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": u,
      "stroke-dashoffset": u,
      transform: "rotate(-90 " + g / 2 + " " + g / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function r() {
    const i = this.dom.getAttribute("data-ln-circular-progress"), m = this.dom.getAttribute("data-ln-circular-progress-max"), p = Zn(i, m || 100), f = u - p.percentage / 100 * u;
    this.progressCircle.setAttribute("stroke-dashoffset", f);
    const d = this.dom.getAttribute("data-ln-circular-progress-label"), _ = d !== null ? d : Math.round(p.percentage) + "%";
    this.labelEl.textContent = _, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(p.min)), this.dom.setAttribute("aria-valuemax", String(p.max)), this.dom.setAttribute("aria-valuenow", String(p.clampedValue)), this.dom.setAttribute("aria-valuetext", _), k(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: p.value,
      max: p.max,
      percentage: p.percentage
    });
  }
  H(t, e, a, "ln-circular-progress", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", o = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const c = {
    "data-ln-sortable": { effect: g, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function h(l) {
    this.dom = l, this.isEnabled = l.getAttribute(t) !== "disabled", this._dragging = null, l.setAttribute("aria-roledescription", "sortable list");
    const u = this;
    return this._onPointerDown = function(a) {
      u.isEnabled && u._handlePointerDown(a);
    }, l.addEventListener("pointerdown", this._onPointerDown), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, h.prototype._handlePointerDown = function(l) {
    let u = l.target.closest("[" + o + "]"), a;
    if (u) {
      for (a = u; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + o + "]")) return;
      for (a = l.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      u = a;
    }
    const s = Array.from(this.dom.children).indexOf(a);
    if (G(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: s
    }).defaultPrevented) return;
    l.preventDefault(), u.setPointerCapture(l.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), k(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: s
    });
    const i = this;
    let m = null, p = null;
    const f = function(_) {
      p = _, !m && (m = requestAnimationFrame(function() {
        m = null, p && i._handlePointerMove(p);
      }));
    }, d = function(_) {
      m && (cancelAnimationFrame(m), m = null), i._handlePointerEnd(_), u.removeEventListener("pointermove", f), u.removeEventListener("pointerup", d), u.removeEventListener("pointercancel", d);
    };
    u.addEventListener("pointermove", f), u.addEventListener("pointerup", d), u.addEventListener("pointercancel", d);
  }, h.prototype._handlePointerMove = function(l) {
    if (!this._dragging) return;
    const u = Array.from(this.dom.children), a = this._dragging;
    let n = null, s = null;
    for (let r = 0; r < u.length; r++) {
      const i = u[r];
      if (i === a) continue;
      const m = i.getBoundingClientRect(), p = m.top + m.height / 2;
      if (l.clientY >= m.top && l.clientY < p) {
        n = i, s = "before";
        break;
      } else if (l.clientY >= p && l.clientY <= m.bottom) {
        n = i, s = "after";
        break;
      }
    }
    if (!(this._lastDropTarget === n && this._lastDropPos === s)) {
      this._lastDropTarget && this._lastDropTarget !== n && this._lastDropTarget.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after"), this._lastDropTarget = n, this._lastDropPos = s;
      for (let r = 0; r < u.length; r++) {
        const i = u[r];
        i !== n && (i.classList.contains("ln-sortable--drop-before") && i.classList.remove("ln-sortable--drop-before"), i.classList.contains("ln-sortable--drop-after") && i.classList.remove("ln-sortable--drop-after"));
      }
      if (n) {
        const r = s === "before" ? "ln-sortable--drop-before" : "ln-sortable--drop-after", i = s === "before" ? "ln-sortable--drop-after" : "ln-sortable--drop-before";
        n.classList.contains(i) && n.classList.remove(i), n.classList.contains(r) || n.classList.add(r);
      }
    }
  }, h.prototype._handlePointerEnd = function(l) {
    if (!this._dragging) return;
    const u = this._dragging, a = Array.from(this.dom.children), n = a.indexOf(u);
    let s = null, r = null;
    for (const i of a) {
      if (i.classList.contains("ln-sortable--drop-before")) {
        s = i, r = "before";
        break;
      }
      if (i.classList.contains("ln-sortable--drop-after")) {
        s = i, r = "after";
        break;
      }
    }
    this._lastDropTarget = null, this._lastDropPos = null;
    for (const i of a)
      i.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (u.classList.remove("ln-sortable--dragging"), u.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), s && s !== u) {
      r === "before" ? this.dom.insertBefore(u, s) : this.dom.insertBefore(u, s.nextElementSibling);
      const m = Array.from(this.dom.children).indexOf(u);
      k(this.dom, "ln-sortable:reordered", {
        item: u,
        oldIndex: n,
        newIndex: m
      });
    }
    this._dragging = null;
  };
  function g(l) {
    const u = l[e];
    if (!u) return;
    const a = l.getAttribute(t) !== "disabled";
    a !== u.isEnabled && (u.isEnabled = a, k(l, a ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: l }));
  }
  H(t, e, h, "ln-sortable", {
    attributes: c
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", o = "data-ln-picklist-list", c = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: u, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: a, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function g(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = l(n), this.available = n.querySelector("[" + o + '="available"]'), this.selected = n.querySelector("[" + o + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + o + '="available"] and [' + o + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const s of [this.available, this.selected])
      for (const r of s.children)
        this._initial.push(r);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  g.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), delete this.dom[e]);
  }, g.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, g.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, g.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let r = 0; r < n.length; r++)
      this._initial.includes(n[r]) || this._initial.push(n[r]);
    let s = 0;
    for (let r = 0; r < this._initial.length; r++) {
      const i = this._initial[r];
      if (!i.isConnected) continue;
      const m = i.querySelector('input[type="checkbox"]');
      if (!m) continue;
      let p;
      m.checked ? this.max === null || s < this.max ? (p = this.selected, s++) : (m.checked = !1, p = this.available) : p = this.available, p.appendChild(i);
    }
  }, g.prototype._onFormReset = function(n) {
    const s = this;
    setTimeout(function() {
      s._destroyed || n.defaultPrevented || s.sync();
    }, 0);
  }, g.prototype._onChange = function(n) {
    const s = n.target.closest('input[type="checkbox"]');
    if (!s) return;
    const r = s.closest("li");
    if (!r) return;
    const i = r.parentElement;
    if (i !== this.available && i !== this.selected) return;
    if (!this.isEnabled) {
      s.checked = !s.checked;
      return;
    }
    const m = s.checked ? this.selected : this.available;
    if (i === m) return;
    if (m === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      s.checked = !s.checked, k(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: r,
        checkbox: s,
        count: this.selected.children.length
      });
      return;
    }
    const p = { item: r, from: i, to: m, checkbox: s };
    if (G(this.dom, "ln-picklist:before-move", p).defaultPrevented) {
      s.checked = !s.checked;
      return;
    }
    const f = document.activeElement === s;
    m.appendChild(r), f && s.focus(), k(this.dom, "ln-picklist:move", p);
  };
  function l(n) {
    const s = n.getAttribute(c);
    if (s === null || s === "") return null;
    const r = parseInt(s, 10);
    return isNaN(r) || r < 0 ? null : r;
  }
  function u(n) {
    const s = n[e];
    if (!s) return;
    const r = n.getAttribute(t) !== "disabled";
    r !== s.isEnabled && (s.isEnabled = r, k(n, r ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function a(n) {
    const s = n[e];
    s && (s.max = l(n));
  }
  H(t, e, g, "ln-picklist", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", o = "data-ln-confirm-state", c = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function g(r, i, m) {
    return r.getAttribute(i) || m;
  }
  function l(r, i, m) {
    const p = parseFloat(r.getAttribute(i));
    return isNaN(p) || p <= 0 ? m : p;
  }
  function u(r) {
    const i = document.createElement("span");
    return i.setAttribute(c, ""), i.setAttribute("role", "alert"), i.textContent = r, i;
  }
  const a = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: g, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: l, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (r, i) => r.getAttribute(i) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = Y(a);
  function s(r) {
    this.dom = r, X(this, r, n), this.revertTimer = null, this._submitted = !1, this.idleEl = r.querySelector("[data-ln-confirm-idle]"), this.activeEl = r.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : r.textContent.trim();
    const i = this;
    return this._onClick = function(m) {
      if (!He(m))
        if (!i.confirming)
          m.preventDefault(), m.stopImmediatePropagation(), i._enterConfirm();
        else {
          if (i._submitted) return;
          i._submitted = !0, i._reset();
        }
    }, r.addEventListener("click", this._onClick), this;
  }
  s.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(o, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const r = this.activeEl ? this.activeEl.textContent.trim() : "";
      r && (this.dom.setAttribute("aria-label", r), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const r = this.dom.querySelector("svg.ln-icon use");
      r && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = r.getAttribute("href"), r.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(u(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), k(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, s.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const r = this, i = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      r._reset();
    }, i);
  }, s.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(o), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const r = this.dom.querySelector("svg.ln-icon use");
      r && this.originalIconHref && r.setAttribute("href", this.originalIconHref);
      const i = this.dom.querySelector("[" + c + "]");
      i && i.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, H(t, e, s, "ln-confirm", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const o = {
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
  }, c = Y(o), h = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function g(l) {
    if (this.dom = l, X(this, l, c), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = l.querySelector("[data-ln-translations-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = h, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const u = this;
    return this._onRequestAdd = function(a) {
      a.detail && a.detail.lang && u.addLanguage(a.detail.lang);
    }, this._onRequestRemove = function(a) {
      a.detail && a.detail.lang && u.removeLanguage(a.detail.lang);
    }, l.addEventListener("ln-translations:request-add", this._onRequestAdd), l.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  g.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const u of l) {
      const a = u.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of a)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, g.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const u of l) {
      const a = u.getAttribute("data-ln-translatable-lang");
      a && a !== this.defaultLang && this.activeLanguages.add(a);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, g.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let u = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      u++;
      const s = le("ln-translations-menu-item", "ln-translations");
      if (!s) return;
      const r = s.querySelector("[data-ln-translations-lang]");
      r.setAttribute("data-ln-translations-lang", n), r.textContent = this.locales[n], r.addEventListener("click", function(i) {
        i.ctrlKey || i.metaKey || i.button === 1 || (i.preventDefault(), i.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(n));
      }), this.menuEl.appendChild(s);
    }
    const a = this.dom.querySelector("[data-ln-translations-add]");
    a && (a.hidden = u === 0);
  }, g.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(u) {
      const a = le("ln-translations-badge", "ln-translations");
      if (!a) return;
      const n = a.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", u);
      const s = n.querySelector("span");
      s.textContent = l.locales[u] || u.toUpperCase();
      const r = n.querySelector("button"), i = l.locales[u] || u.toUpperCase();
      r.setAttribute("aria-label", l.removeLabel.replace("{lang}", i)), r.addEventListener("click", function(m) {
        m.ctrlKey || m.metaKey || m.button === 1 || (m.preventDefault(), m.stopPropagation(), l.removeLanguage(u));
      }), l.badgesEl.appendChild(a);
    });
  }, g.prototype.addLanguage = function(l, u) {
    if (this.activeLanguages.has(l)) return;
    const a = this.locales[l] || l;
    if (G(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: a
    }).defaultPrevented) return;
    this.activeLanguages.add(l), u = u || {};
    const s = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const r of s) {
      const i = r.getAttribute("data-ln-translatable"), m = r.getAttribute("data-ln-translations-prefix") || "", p = r.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!p) continue;
      const f = p.cloneNode(p.tagName === "SELECT");
      m ? f.name = m + "[trans][" + l + "][" + i + "]" : f.name = "trans[" + l + "][" + i + "]", f.value = u[i] !== void 0 ? u[i] : "", f.removeAttribute("id"), "placeholder" in f && (f.placeholder = this.placeholderLabel.replace("{lang}", a)), f.setAttribute("data-ln-translatable-lang", l);
      const d = r.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), _ = d.length > 0 ? d[d.length - 1] : p;
      _.parentNode.insertBefore(f, _.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: a
    });
  }, g.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || G(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const a = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const n of a)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: l
    });
  }, g.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, g.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, g.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const l = this.defaultLang, u = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of u)
      a.getAttribute("data-ln-translatable-lang") !== l && a.parentNode.removeChild(a);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, H(t, e, g, "ln-translations", {
    attributes: o
  });
})();
const Xr = "ln-autosave:", Yr = 1e3;
function Jr(t, e) {
  return e ? Xr + (t || "") + ":" + e : null;
}
function Zr(t, e = Yr) {
  if (t == null) return 0;
  if (t === "") return e;
  const o = parseInt(String(t), 10);
  return isNaN(o) || o < 0 ? e : o;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", o = "data-ln-autosave-clear", c = "data-ln-autosave-debounce-input", h = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function l(a) {
    const n = a.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function u(a) {
    const s = a.getAttribute(t) || a.id, r = Jr(window.location.pathname, s);
    if (!r) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", a);
      return;
    }
    this.dom = a, this.key = r;
    let i = null;
    function m() {
      const _ = Ke(a, { exclude: h });
      try {
        localStorage.setItem(r, JSON.stringify(_));
      } catch {
        return;
      }
      k(a, "ln-autosave:saved", { target: a, data: _ });
    }
    function p() {
      let _;
      try {
        _ = localStorage.getItem(r);
      } catch {
        return;
      }
      if (!_) return;
      let y;
      try {
        y = JSON.parse(_);
      } catch {
        return;
      }
      if (G(a, "ln-autosave:before-restore", { target: a, data: y }).defaultPrevented) return;
      const v = je(a, y);
      for (let S = 0; S < v.length; S++)
        v[S].dispatchEvent(new Event("input", { bubbles: !0 })), v[S].dispatchEvent(new Event("change", { bubbles: !0 }));
      k(a, "ln-autosave:restored", { target: a, data: y });
    }
    function f() {
      try {
        localStorage.removeItem(r);
      } catch {
        return;
      }
      k(a, "ln-autosave:cleared", { target: a });
    }
    this._onFocusout = function(_) {
      const y = _.target;
      l(y) && y.name && !y.matches(h) && m();
    }, this._onChange = function(_) {
      const y = _.target;
      l(y) && y.name && !y.matches(h) && m();
    }, this._onSubmit = function() {
      f();
    }, this._onReset = function() {
      f();
    }, this._onClearClick = function(_) {
      _.target.closest("[" + o + "]") && f();
    }, a.addEventListener("focusout", this._onFocusout), a.addEventListener("change", this._onChange), a.addEventListener("submit", this._onSubmit), a.addEventListener("reset", this._onReset), a.addEventListener("click", this._onClearClick);
    const d = Zr(a.getAttribute(c));
    return d > 0 && (this._onInput = function(_) {
      const y = _.target;
      !l(y) || !y.name || y.matches(h) || (i !== null && clearTimeout(i), i = setTimeout(m, d));
    }, a.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return i;
    }, p(), this;
  }
  u.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const a = this._getInputTimer();
        a !== null && clearTimeout(a);
      }
      delete this.dom[e];
    }
  }, H(t, e, u, "ln-autosave", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-editor", e = "lnEditor";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-editor": { type: "marker", description: "Mounts rich text editor instance on container" },
    "data-ln-editor-action": { type: "enum", values: ["bold", "italic", "underline", "strikethrough", "heading-2", "heading-3", "heading-4", "blockquote", "code", "paragraph", "ordered-list", "unordered-list", "link", "unlink", "clear", "confirm-link", "cancel-link"], description: "Rich text toolbar formatting action" },
    "data-ln-editor-source": { type: "string", description: "Selector or ID of backing textarea synchronized with editor content" }
  }, c = {
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
  }, h = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, g = {
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
  let u = 0;
  function a(_) {
    return !!(h[_] || g[_] || l[_] || _ === "link");
  }
  function n(_) {
    this.dom = _;
    const y = this;
    if (this._textarea = _.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", _), this;
    const E = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), E && this._surface.setAttribute("data-placeholder", E);
    const v = this._textarea.id;
    if (v) {
      const A = _.querySelector('label[for="' + v + '"]');
      A && (A.id || (A.id = v + "-label"), this._surface.setAttribute("aria-labelledby", A.id));
    }
    this._surface.id = v ? v + "-surface" : "ln-editor-surface-" + ++u;
    const S = this._textarea.value.trim();
    S && (this._surface.innerHTML = S);
    const b = _.querySelector('[role="toolbar"]');
    if (b && b.nextSibling ? _.insertBefore(this._surface, b.nextSibling) : _.appendChild(this._surface), b) {
      b.setAttribute("aria-controls", this._surface.id);
      const A = b.querySelectorAll("[data-ln-editor-action]");
      for (let T = 0; T < A.length; T++) {
        const L = A[T].getAttribute("data-ln-editor-action");
        a(L) && A[T].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      y._syncToTextarea(), k(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      });
    }, this._onMousedownToolbar = function(A) {
      A.target.closest("[data-ln-editor-action]") && A.preventDefault();
    }, this._onClickToolbar = function(A) {
      const T = A.target.closest("[data-ln-editor-action]");
      if (!T) return;
      const L = T.getAttribute("data-ln-editor-action");
      y._execAction(L);
    }, this._onPaste = function(A) {
      i(y, A);
    }, this._onKeydown = function(A) {
      f(y, A);
    }, this._listeningSelection = !1, this._rafSelection = null, this._onSelectionChange = function() {
      y._rafSelection || (y._rafSelection = requestAnimationFrame(function() {
        y._rafSelection = null, document.contains(y._surface) && y._updateActiveStates();
      }));
    }, this._attachSelection = function() {
      y._listeningSelection || (y._listeningSelection = !0, document.addEventListener("selectionchange", y._onSelectionChange));
    }, this._detachSelection = function() {
      y._listeningSelection && (y._listeningSelection = !1, document.removeEventListener("selectionchange", y._onSelectionChange)), y._rafSelection && (cancelAnimationFrame(y._rafSelection), y._rafSelection = null);
    }, this._onFocus = function() {
      y._attachSelection(), y._updateActiveStates(), k(y.dom, "ln-editor:focus", { target: y.dom });
    }, this._onBlur = function() {
      y._detachSelection(), y._syncToTextarea(), k(y.dom, "ln-editor:blur", { target: y.dom });
    }, this._onTextareaInput = function() {
      y._surface.innerHTML !== y._textarea.value && (y._surface.innerHTML = y._textarea.value, k(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), b && (b.addEventListener("mousedown", this._onMousedownToolbar), b.addEventListener("click", this._onClickToolbar)), this._onSetContent = function(A) {
      const T = A.detail && A.detail.html;
      T !== void 0 && (y._surface.innerHTML = T, y._syncToTextarea(), k(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      }));
    }, _.addEventListener("ln-editor:set-content", this._onSetContent);
    const w = this._textarea.form;
    return w && (this._onFormReset = function() {
      setTimeout(function() {
        y._surface.innerHTML = y._textarea.value, k(_, "ln-editor:changed", {
          html: y._textarea.value,
          target: _
        });
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(_) {
    if (!(!_ || G(this.dom, "ln-editor:before-change", {
      action: _,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), h[_])
        document.execCommand(h[_], !1, null);
      else if (g[_]) {
        const E = g[_], v = s(this._surface);
        v && v.toLowerCase() === E ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + E + ">");
      } else l[_] ? document.execCommand(l[_], !1, null) : _ === "link" ? d(this) : _ === "unlink" ? document.execCommand("unlink", !1, null) : _ === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const _ = this.dom.querySelector('[role="toolbar"]');
    if (!_) return;
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return;
    const E = y.anchorNode;
    if (!E || !this._surface.contains(E)) return;
    const v = _.querySelectorAll("[data-ln-editor-action]");
    for (let S = 0; S < v.length; S++) {
      const b = v[S], w = b.getAttribute("data-ln-editor-action");
      let A = !1;
      if (h[w])
        try {
          A = document.queryCommandState(h[w]);
        } catch {
        }
      else if (g[w]) {
        const T = s(this._surface);
        A = T && T.toLowerCase() === g[w];
      } else if (l[w])
        try {
          A = document.queryCommandState(l[w]);
        } catch {
        }
      else w === "link" && (A = !!r(y.anchorNode, "A", this._surface));
      if (a(w)) {
        const T = String(A);
        b.getAttribute("aria-pressed") !== T && b.setAttribute("aria-pressed", T);
      }
      A ? b.classList.contains("ln-editor-active") || b.classList.add("ln-editor-active") : b.classList.contains("ln-editor-active") && b.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(_) {
    this._surface && (this._surface.innerHTML = _, this._syncToTextarea(), k(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const _ = this.dom.querySelector('[role="toolbar"]');
    _ && (_.removeEventListener("mousedown", this._onMousedownToolbar), _.removeEventListener("click", this._onClickToolbar)), this._detachSelection ? this._detachSelection() : document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const y = this._textarea ? this._textarea.form : null;
    if (y && this._onFormReset && y.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const E = this.dom.querySelector(".ln-editor__link-popover");
      E && E.remove();
    }
    delete this.dom[e];
  };
  function s(_) {
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return null;
    let E = y.anchorNode;
    if (!E) return null;
    for (; E && E !== _; ) {
      if (E.nodeType === 1) {
        const v = E.tagName;
        if (v === "H2" || v === "H3" || v === "H4" || v === "BLOCKQUOTE" || v === "PRE" || v === "P")
          return v;
      }
      E = E.parentNode;
    }
    return null;
  }
  function r(_, y, E) {
    for (; _ && _ !== E; ) {
      if (_.nodeType === 1 && _.tagName === y)
        return _;
      _ = _.parentNode;
    }
    return null;
  }
  function i(_, y) {
    y.preventDefault();
    let E = "";
    if (y.clipboardData && (E = y.clipboardData.getData("text/html"), !E)) {
      const S = y.clipboardData.getData("text/plain");
      S && (E = S.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), E = "<p>" + E + "</p>");
    }
    if (!E) return;
    const v = m(E);
    v && document.execCommand("insertHTML", !1, v);
  }
  function m(_) {
    const y = document.createElement("div");
    return y.innerHTML = _, p(y), y.innerHTML;
  }
  function p(_) {
    const y = Array.from(_.childNodes);
    for (let E = 0; E < y.length; E++) {
      const v = y[E];
      if (v.nodeType !== 3) {
        if (v.nodeType !== 1) {
          _.removeChild(v);
          continue;
        }
        if (c[v.tagName]) {
          const S = Array.from(v.attributes);
          for (let b = 0; b < S.length; b++) {
            const w = S[b].name;
            if (v.tagName === "A" && w === "href") {
              const A = v.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(A) || v.removeAttribute("href");
            } else
              v.removeAttribute(w);
          }
          v.tagName === "A" && v.setAttribute("rel", "noopener noreferrer"), p(v);
        } else {
          for (; v.firstChild; )
            _.insertBefore(v.firstChild, v);
          _.removeChild(v);
        }
      }
    }
  }
  function f(_, y) {
    if (!(y.ctrlKey || y.metaKey)) return;
    let E = null;
    switch (y.key.toLowerCase()) {
      case "b":
        E = "bold";
        break;
      case "i":
        E = "italic";
        break;
      case "u":
        E = "underline";
        break;
      case "k":
        E = "link";
        break;
    }
    E && (y.preventDefault(), _._execAction(E));
  }
  function d(_) {
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return;
    const E = r(y.anchorNode, "A", _._surface), v = y.getRangeAt(0).cloneRange();
    _._closeLinkPopover && _._closeLinkPopover();
    const S = st(_.dom, "ln-editor-link-popover", "ln-editor");
    if (!S) return;
    const b = S.firstElementChild;
    if (!b) return;
    const w = b.querySelector('input[type="url"]'), A = b.querySelector('[data-ln-editor-action="confirm-link"]'), T = b.querySelector('[data-ln-editor-action="cancel-link"]');
    E && (w.value = E.getAttribute("href") || "");
    const L = _.dom.querySelector('[role="toolbar"]');
    L ? L.after(b) : _.dom.insertBefore(b, _._surface), w.focus();
    function x() {
      const K = window.getSelection();
      K.removeAllRanges(), K.addRange(v);
    }
    function D() {
      document.removeEventListener("mousedown", U), _._closeLinkPopover = null, b.remove();
    }
    function I() {
      const K = w.value.trim();
      if (D(), x(), _._surface.focus(), K)
        if (E)
          E.setAttribute("href", K), E.setAttribute("rel", "noopener noreferrer"), _._syncToTextarea(), k(_.dom, "ln-editor:changed", {
            html: _._textarea.value,
            target: _.dom
          });
        else {
          document.execCommand("createLink", !1, K);
          const Q = window.getSelection();
          if (Q && Q.anchorNode) {
            const J = r(Q.anchorNode, "A", _._surface);
            J && (J.setAttribute("rel", "noopener noreferrer"), _._syncToTextarea());
          }
        }
      else E && document.execCommand("unlink", !1, null);
    }
    function O() {
      D(), x(), _._surface.focus();
    }
    function P() {
      D();
    }
    function U(K) {
      const Q = _.dom.contains(K.target) && K.target.closest('[data-ln-editor-action="link"]');
      !b.contains(K.target) && !Q && P();
    }
    _._closeLinkPopover = D, A.addEventListener("click", I), T.addEventListener("click", O), w.addEventListener("keydown", function(K) {
      K.key === "Enter" ? (K.preventDefault(), I()) : K.key === "Escape" && (K.preventDefault(), O());
    }), document.addEventListener("mousedown", U);
  }
  H(t, e, n, "ln-editor", {
    attributes: o
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function o(h) {
    const g = {}, l = h.dataset;
    for (const u in l) {
      if (!u.startsWith("lnFill") || e[u]) continue;
      const a = u.slice(6);
      a && (g[a.charAt(0).toLowerCase() + a.slice(1)] = l[u]);
    }
    return g;
  }
  function c(h, g) {
    const l = window.CSS && CSS.escape ? CSS.escape(g) : g, u = document.querySelectorAll('[data-ln-fill-id="' + l + '"]');
    if (u.length === 0) return null;
    for (let a = 0; a < u.length; a++) {
      const n = u[a].getAttribute("data-ln-fill-form");
      if (n) {
        const s = document.getElementById(n);
        if (s && h.contains(s)) return u[a];
      }
    }
    return u[0];
  }
  document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const g = h.target.closest("[data-ln-fill-form]");
    if (!g) return;
    const l = g.getAttribute("data-ln-fill-form"), u = document.getElementById(l);
    if (!u) return;
    const a = o(g), n = Object.keys(a).length > 0;
    window.lnCore.lnFill(u, n ? a : null);
  }), document.addEventListener("ln-fill:request", function(h) {
    const g = h.detail;
    if (!g) return;
    const l = h.target, u = g.id;
    if (u == null) {
      window.lnCore.lnFill(l, null);
      return;
    }
    const a = c(l, u);
    if (!a) return;
    const n = o(a);
    window.lnCore.lnFill(l, n);
  }), window[t] = !0;
})();
function to(t, e = "-") {
  if (t == null) return "";
  const o = e || "-", c = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, o).replace(new RegExp(`${c}+`, "g"), o).replace(new RegExp(`^${c}+|${c}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: j, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, c = Y(o), h = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(l) {
    if (l.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", l.tagName), this;
    const u = l.form;
    if (!u)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", l), this;
    X(this, l, c);
    const a = u.elements[this.sourceName];
    if (!a)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', l), this;
    if (typeof a.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', l), this;
    this.dom = l, this.form = u, this.source = a, this._pristine = l.value === "", this._mirroring = !1;
    const n = this;
    return Ve(l, h, {
      get: function() {
        return h.get.call(l);
      },
      set: function(s) {
        h.set.call(l, s), n._mirroring || (n._pristine = s === "" || s === null || s === void 0);
      }
    }), this._onSource = function() {
      n._pristine && n._mirror();
    }, this._onSlug = function() {
      n._mirroring || (n._pristine = n.dom.value === "");
    }, this._onFormReset = function() {
      setTimeout(function() {
        n._pristine = n.dom.value === "";
      }, 0);
    }, a.addEventListener("input", this._onSource), l.addEventListener("input", this._onSlug), u.addEventListener("reset", this._onFormReset), this._pristine && a.value && a.value.trim() !== "" && this._mirror(), this;
  }
  g.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = to(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), this._onFormReset && this.form && this.form.removeEventListener("reset", this._onFormReset), Object.defineProperty(this.dom, "value", h), delete this.dom[e]);
  }, H(t, e, g, "ln-slug", {
    attributes: o
  });
})();
function eo(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const o = typeof e == "number" ? e : e.getTime(), c = t.getTime(), h = Math.floor((c - o) / 1e3), g = Math.abs(h);
  return g < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : g < 60 ? { value: h, unit: "second", isOlderThanMonth: !1 } : g < 3600 ? { value: Math.round(h / 60), unit: "minute", isOlderThanMonth: !1 } : g < 86400 ? { value: Math.round(h / 3600), unit: "hour", isOlderThanMonth: !1 } : g < 604800 ? { value: Math.round(h / 86400), unit: "day", isOlderThanMonth: !1 } : g < 2592e3 ? { value: Math.round(h / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(h / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function re(t, e, o = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const c = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== o.getFullYear() && (c.year = "numeric"), c;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: w, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: w, description: "BCP 47 language tag override for time formatting" }
  }, c = {}, h = {};
  function g(T) {
    return T.getAttribute("data-ln-time-locale") || Z(T);
  }
  function l(T, L) {
    const x = (T || "") + "|" + JSON.stringify(L);
    return c[x] || (c[x] = new Intl.DateTimeFormat(T, L)), c[x];
  }
  function u(T) {
    const L = T || "";
    return h[L] || (h[L] = new Intl.RelativeTimeFormat(T, { numeric: "auto", style: "narrow" })), h[L];
  }
  const a = /* @__PURE__ */ new Set();
  let n = null;
  function s() {
    n || (n = setInterval(i, 6e4));
  }
  function r() {
    n && (clearInterval(n), n = null);
  }
  function i() {
    for (const T of a) {
      if (!document.body.contains(T.dom)) {
        a.delete(T);
        continue;
      }
      y(T);
    }
    a.size === 0 && r();
  }
  function m(T, L) {
    const x = Dt(L), D = (L || "").toLowerCase().split("-")[0], I = l(L, re("full", T)), O = I.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (x && O !== D && x.monthsLong) {
      const P = x.monthsLong[T.getMonth()], U = T.getDate(), K = T.getFullYear(), Q = String(T.getHours()).padStart(2, "0"), J = String(T.getMinutes()).padStart(2, "0");
      return `${U} ${P} ${K}, ${Q}:${J}`;
    }
    return I.format(T);
  }
  function p(T, L) {
    const x = re("short", T), D = Dt(L), I = (L || "").toLowerCase().split("-")[0], O = l(L, x), P = O.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (D && P !== I && D.monthsShort) {
      const U = D.monthsShort[T.getMonth()], K = T.getDate(), Q = x.year ? " " + T.getFullYear() : "";
      return `${K} ${U}${Q}`;
    }
    return O.format(T);
  }
  function f(T, L) {
    return l(L, re("date", T)).format(T);
  }
  function d(T, L) {
    return l(L, re("time", T)).format(T);
  }
  function _(T, L) {
    const x = eo(T);
    return x.isOlderThanMonth ? p(T, L) : u(L).format(x.value, x.unit);
  }
  function y(T) {
    const L = T.dom.getAttribute("datetime");
    if (!L) return;
    const x = it(L);
    if (!x) return;
    const D = T.dom.getAttribute(t) || "short", I = g(T.dom);
    let O;
    switch (D) {
      case "relative":
        O = _(x, I);
        break;
      case "full":
        O = m(x, I);
        break;
      case "date":
        O = f(x, I);
        break;
      case "time":
        O = d(x, I);
        break;
      default:
        O = p(x, I);
        break;
    }
    T.dom.textContent = O, D !== "full" && (T.dom.title = m(x, I));
  }
  const E = /* @__PURE__ */ new Set();
  let v = !1;
  function S() {
    he(), !v && (v = !0, document.addEventListener("ln-core:locale-change", function() {
      E.forEach(function(T) {
        y(T);
      });
    }));
  }
  function b(T) {
    return this.dom = T, E.add(this), S(), y(this), T.getAttribute(t) === "relative" && (a.add(this), s()), this;
  }
  b.prototype.render = function() {
    y(this);
  }, b.prototype.destroy = function() {
    E.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), a.delete(this), a.size === 0 && r(), delete this.dom[e];
  };
  function w(T) {
    const L = T[e];
    if (!L) return;
    T.getAttribute(t) === "relative" ? (a.add(L), s()) : (a.delete(L), a.size === 0 && r()), y(L);
  }
  function A(T) {
    T.nodeType === 1 && T.hasAttribute && T.hasAttribute(t) && T[e] && y(T[e]);
  }
  H(t, e, b, "ln-time", {
    attributes: o,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: w,
    onInit: A
  });
})();
function no(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, o = t.pageSize > 0 ? t.pageSize : 200, c = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const h = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, g = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  let u = 0, a = 0, n = 0, s = !1, r = null;
  function i(f, d) {
    g.delete(f), g.set(f, d);
  }
  function m() {
    if (g.size <= e) return [];
    const f = [];
    for (; g.size > e; ) {
      const _ = g.keys().next().value;
      f.push(g.get(_)), g.delete(_);
    }
    const d = new Set(g.values());
    return f.filter((_) => !d.has(_));
  }
  function p(f, d) {
    l.add(f), clearTimeout(r), r = setTimeout(() => h(f, o, d), c);
  }
  return {
    get logicalTotal() {
      return u;
    },
    set logicalTotal(f) {
      u = f;
    },
    get grandTotal() {
      return a;
    },
    set grandTotal(f) {
      a = f;
    },
    get queryGen() {
      return n;
    },
    set queryGen(f) {
      n = f;
    },
    get size() {
      return g.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return s;
    },
    getId: (f) => {
      if (!g.has(f)) return;
      const d = g.get(f);
      return i(f, d), d;
    },
    ensure: (f, d, _) => {
      if (!s && !l.has(0)) return p(0, _);
      if (u <= 0) return;
      const y = Math.max(0, f), E = Math.min(u, d);
      for (let v = y; v < E; v++)
        if (!g.has(v)) {
          const S = Math.floor(v / o) * o;
          if (!l.has(S)) return p(S, _);
        }
    },
    ingest: (f, d, _, y, E) => {
      if (E != null && E !== n) return [];
      s = !0, _ != null && (a = _), y != null && (u = y);
      for (let v = 0; v < d.length; v++)
        i(f + v, d[v]);
      return l.delete(f), m();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      s = !1, g.clear(), l.clear(), clearTimeout(r);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (f = {}) => {
      let d = [];
      return f.windowSize > 0 && f.windowSize !== e && (e = f.windowSize, d = m()), f.pageSize > 0 && (o = f.pageSize), f.fetchDebounce >= 0 && (c = f.fetchDebounce), d;
    }
  };
}
function io(t, e, o) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: c, direction: h } = e, g = h === "desc", l = t.map((a) => a ? a[c] : void 0), u = Qe(l);
  return [...t].sort((a, n) => {
    const s = a ? a[c] : void 0, r = n ? n[c] : void 0, i = Xe(s, r, u, o);
    return g ? -i : i;
  });
}
function Me(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const o = Object.keys(e).filter((c) => Array.isArray(e[c]) && e[c].length > 0);
  return o.length ? t.filter((c) => c ? o.every((h) => Je(c[h], e[h])) : !1) : t;
}
function ro(t, e, o) {
  if (!Array.isArray(t) || !e || !o || !o.length) return t;
  const c = ei(e);
  return c.length ? t.filter((h) => h ? c.every(
    (g) => o.some((l) => {
      const u = h[l];
      return u != null && ni(String(u), [g]);
    })
  ) : !1) : t;
}
function oo(t, e, o) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (o === "count") return t.length;
  const c = t.map((g) => g && g[e] != null ? parseFloat(g[e]) : NaN).filter((g) => Number.isFinite(g)), h = c.reduce((g, l) => g + l, 0);
  return o === "sum" ? h : o === "avg" && c.length ? h / c.length : 0;
}
function so(t, e = {}, o = [], c) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const h = t.length;
  let g = t;
  e.filters && (g = Me(g, e.filters)), e.search && (g = ro(g, e.search, o));
  const l = g.length;
  if (e.sort && (g = io(g, e.sort, c)), e.offset || e.limit) {
    const u = e.offset || 0, a = e.limit || g.length;
    g = g.slice(u, u + a);
  }
  return { records: g, total: h, filtered: l };
}
function ao(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((o) => {
    if (!o) return null;
    const c = { ...o };
    for (const [h, g] of Object.entries(e))
      if (typeof g == "function")
        try {
          c[h] = g(o);
        } catch {
          c[h] = void 0;
        }
    return c;
  });
}
function lo(t, e, o, c = "_meta") {
  if (!Array.isArray(t) || !t.includes(c)) return !0;
  for (const h of Object.keys(e || {})) {
    if (!t.includes(h)) return !0;
    const g = e[h] && e[h].indexes || [], l = o && o[h] || [];
    if (g.some((u) => !l.includes(u))) return !0;
  }
  return !1;
}
function co(t) {
  return { ok: !1, error: t && t.message ? t.message : String(t) };
}
function uo(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  try {
    const o = JSON.parse(e);
    return Array.isArray(o) ? o : null;
  } catch {
    return null;
  }
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function o(C, q, R) {
    const N = C.getAttribute(q);
    if (N === "never" || N === "-1") return -1;
    const M = parseInt(N, 10);
    return isNaN(M) ? R : M;
  }
  const c = {
    "data-ln-data-store": { type: "marker", effect: nn, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: nn, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-seed": { type: "string", description: "Selector or element ID of an external seed script block" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: o, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: We, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: xt, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: qt, fallback: 1e3, min: 10, effect: Ki, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: qt, fallback: 200, min: 5, effect: ji, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, h = Y(c), g = "ln_app_cache", l = "_meta", u = "1.0";
  let a = null, n = null;
  const s = {};
  function r(C) {
    C && C.name === "QuotaExceededError" && k(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function i() {
    const C = {};
    for (const q of document.querySelectorAll(`[${t}]`)) {
      const R = q.id;
      if (R) {
        const N = q.getAttribute("data-ln-data-store-indexes") || "";
        C[R] = {
          indexes: N.split(",").map((M) => M.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function m() {
    return n || (n = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB is not available in this environment"), C(null);
      const q = i(), R = Object.keys(q), N = indexedDB.open(g);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed"), C(null);
      }, N.onsuccess = (M) => {
        const F = M.target.result, B = Array.from(F.objectStoreNames), z = R.filter((ht) => B.includes(ht));
        let $ = {};
        if (z.length > 0) {
          const ht = F.transaction(z, "readonly");
          for (const pt of z)
            $[pt] = Array.from(ht.objectStore(pt).indexNames);
        }
        if (!lo(B, q, $, l))
          return p(F), a = F, C(F);
        const It = F.version;
        F.close();
        const vt = indexedDB.open(g, It + 1);
        let gt = !1, _t = null;
        vt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection"), k(document, "ln-data-store:blocked", { db: g }), _t || (_t = setTimeout(() => {
            gt || (console.warn("[ln-data-store] Database upgrade timed out while blocked"), gt = !0, n = null, C(null));
          }, 5e3));
        }, vt.onerror = () => {
          gt || (_t && clearTimeout(_t), gt = !0, n = null, console.warn("[ln-data-store] Database upgrade failed"), C(null));
        }, vt.onupgradeneeded = (ht) => {
          const pt = ht.target.result, Vi = ht.target.transaction;
          pt.objectStoreNames.contains(l) || pt.createObjectStore(l, { keyPath: "key" });
          for (const Kt of R)
            if (pt.objectStoreNames.contains(Kt)) {
              const ne = Vi.objectStore(Kt);
              for (const Bt of q[Kt].indexes)
                ne.indexNames.contains(Bt) || ne.createIndex(Bt, Bt, { unique: !1 });
            } else {
              const ne = pt.createObjectStore(Kt, { keyPath: "id" });
              for (const Bt of q[Kt].indexes)
                ne.createIndex(Bt, Bt, { unique: !1 });
            }
        }, vt.onsuccess = (ht) => {
          if (gt) {
            ht.target.result && ht.target.result.close();
            return;
          }
          _t && clearTimeout(_t), gt = !0;
          const pt = ht.target.result;
          p(pt), a = pt, C(pt);
        };
      };
    }), n);
  }
  function p(C) {
    C.onversionchange = () => {
      C.close(), a = null, n = null;
    };
  }
  function f() {
    return a ? Promise.resolve(a) : (n = null, m());
  }
  async function d(C) {
    if (!kt() || !C) return C;
    const q = { ...C }, R = q.id, N = await cr(q);
    return !N || !N.encrypted ? C : {
      ...N,
      id: R
    };
  }
  async function _(C) {
    return !C || !C.encrypted || !kt() ? C : dr(C, { silent: !0 });
  }
  const y = (C, q) => f().then((R) => R ? R.transaction(C, q).objectStore(C) : null);
  function E(C) {
    return new Promise((q, R) => {
      C.onsuccess = () => q(C.result), C.onerror = () => {
        r(C.error), R(C.error);
      };
    });
  }
  const v = (C) => y(C, "readonly").then((q) => q ? E(q.getAll()) : []).then((q) => kt() ? Promise.all(q.map((R) => _(R))) : q), S = (C, q) => y(C, "readonly").then((R) => R ? E(R.get(q)).then((N) => N !== void 0 ? N : typeof q == "string" && q.trim() !== "" && !isNaN(Number(q)) ? E(R.get(Number(q))) : typeof q == "number" ? E(R.get(String(q))) : null) : null).then((R) => R ? _(R) : null), b = (C, q) => f().then((R) => {
    if (!R) return [];
    const M = R.transaction(C, "readonly").objectStore(C), F = q.map((B) => E(M.get(B)).then((z) => z !== void 0 ? z : typeof B == "string" && B.trim() !== "" && !isNaN(Number(B)) ? E(M.get(Number(B))) : typeof B == "number" ? E(M.get(String(B))) : null));
    return Promise.all(F).then((B) => kt() ? Promise.all(B.map((z) => z ? _(z) : null)) : B);
  }), w = (C, q) => (kt() ? d(q) : Promise.resolve(q)).then((N) => y(C, "readwrite").then((M) => M ? E(M.put(N)) : null)), A = (C, q) => y(C, "readwrite").then((R) => R ? E(R.delete(q)).then(() => {
    if (typeof q == "string" && q.trim() !== "" && !isNaN(Number(q)))
      return E(R.delete(Number(q)));
    if (typeof q == "number")
      return E(R.delete(String(q)));
  }) : null), T = (C) => y(C, "readwrite").then((q) => q ? E(q.clear()) : null), L = (C) => y(C, "readonly").then((q) => q ? E(q.count()) : 0), x = (C) => y(l, "readonly").then((q) => q ? E(q.get(C)) : null), D = (C, q) => y(l, "readwrite").then((R) => {
    if (R)
      return q.key = C, E(R.put(q));
  });
  function I(C) {
    return this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C), X(this, C, h), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, C.hasAttribute("data-ln-data-store-window") ? this._windowIndex = no({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (q, R, N) => {
        k(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: q,
          limit: R,
          query: N,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), s[this._name] = this, O(this), this.ready = W(this), this;
  }
  function O(C) {
    C._handlers = {
      create: (q) => P(C, "create", q.detail, () => K(C, q.detail)),
      update: (q) => P(C, "update", q.detail, () => Q(C, q.detail)),
      delete: (q) => P(C, "delete", q.detail, () => J(C, q.detail)),
      "bulk-delete": (q) => P(C, "bulk-delete", q.detail, () => rt(C, q.detail)),
      "sync-failed": (q) => {
        C.isSyncing = !1, k(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: q.detail && q.detail.error,
          status: q.detail && q.detail.status
        });
      }
    };
    for (const [q, R] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${q}`, R);
    C._queryHandlers = {
      "ln-search:change": (q) => {
        q.preventDefault();
        const R = q.detail && q.detail.term != null ? q.detail.term : "";
        R !== C.query.search && (C.query.search = R, ge(C));
      },
      "ln-filter:change": (q) => {
        q.preventDefault();
        const R = q.detail && q.detail.key;
        if (!R) return;
        const N = (q.detail.values || []).slice(), M = C.query.filters[R];
        (M ? M.length === N.length && M.every((B, z) => B === N[z]) : !N.length) || (N.length ? C.query.filters[R] = N : delete C.query.filters[R], ge(C));
      },
      "ln-sort:change": (q) => {
        q.preventDefault();
        const R = q.detail && q.detail.field, N = q.detail && q.detail.direction, M = N && N !== "none" ? { field: R, direction: N } : null, F = C.query.sort;
        !F && !M || F && M && F.field === M.field && F.direction === M.direction || (C.query.sort = M, ge(C));
      }
    };
    for (const [q, R] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(q, R);
  }
  function P(C, q, R, N) {
    const M = R && R.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return N();
    }).catch((F) => ct(C, q, M, F)), C._mutationChain;
  }
  function U(C, q = 0) {
    return L(C._name).then((R) => {
      if (C._windowIndex || C.windowed) {
        const N = C.totalCount != null ? C.totalCount : R;
        C.totalCount = Math.max(0, N + q);
      } else
        C.totalCount = R;
      return C.hasCache = !0, C.isLoaded = !0, C.canServe = !0, D(C._name, {
        schema_version: u,
        last_synced_at: C.lastSyncedAt,
        has_cache: !0,
        record_count: C.totalCount
      });
    });
  }
  function K(C, { tempId: q, data: R = {}, requestId: N } = {}) {
    const M = { ...R, id: q };
    return w(C._name, M).then(() => U(C, 1)).then(() => {
      k(C.dom, "ln-data-store:created", { store: C._name, record: M, tempId: q, requestId: N });
    });
  }
  function Q(C, { id: q, data: R = {}, requestId: N } = {}) {
    return S(C._name, q).then((M) => {
      if (!M) throw new Error(`Record not found: ${q}`);
      const F = M.id, B = { ...M, ...R, id: F }, z = R.id, $ = z !== void 0 && z !== F;
      return ($ ? Ii(C._name, F, { ...B, id: z }) : w(C._name, B)).then(() => U(C, 0)).then(() => {
        k(C.dom, "ln-data-store:updated", { store: C._name, record: $ ? { ...B, id: z } : B, previous: M, requestId: N });
      });
    });
  }
  function J(C, { id: q, requestId: R } = {}) {
    return S(C._name, q).then((N) => {
      if (!N) {
        k(C.dom, "ln-data-store:deleted", { store: C._name, id: q, requestId: R, missing: !0 });
        return;
      }
      const M = N.id;
      return A(C._name, M).then(() => U(C, -1)).then(() => {
        k(C.dom, "ln-data-store:deleted", { store: C._name, id: M, requestId: R });
      });
    });
  }
  function rt(C, { ids: q = [], requestId: R } = {}) {
    return q.length ? Promise.all(q.map((N) => S(C._name, N))).then((N) => {
      const M = N.filter(Boolean).map((F) => F.id);
      return ee(C._name, M).then(() => U(C, -M.length)).then(() => {
        k(C.dom, "ln-data-store:deleted", { store: C._name, ids: M, requestId: R });
      });
    }) : (k(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: R }), Promise.resolve());
  }
  function ct(C, q, R, N) {
    console.error("[ln-data-store] " + q + " failed:", N), k(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: q,
      requestId: R,
      error: N
    });
  }
  function nt(C) {
    let q = null;
    const R = C.dom.getAttribute("data-ln-data-store-seed");
    if (R && (q = document.getElementById(R), !q))
      try {
        q = document.querySelector(R);
      } catch {
      }
    return q || (q = C.dom.querySelector('script[type="application/json"]') || C.dom.querySelector("script")), q && q.textContent ? uo(q.textContent) : null;
  }
  function W(C) {
    const q = nt(C);
    return C._seedRecords = q, q ? (C.lastSyncedAt = Math.floor(Date.now() / 1e3), C.totalCount = q.length, C.hasCache = !0, C.isLoaded = !0, C.canServe = !0, C.isInitialized = !0, setTimeout(() => {
      k(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "seed" }), k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !0, lastSyncedAt: C.lastSyncedAt, count: C.totalCount, source: "seed" });
    }, 0), m().then((R) => {
      if (R)
        return T(C._name).then(() => Ct(C._name, q)).then(() => D(C._name, {
          schema_version: u,
          last_synced_at: C.lastSyncedAt,
          has_cache: !0,
          record_count: C.totalCount
        }));
    }).catch(() => {
    }), Promise.resolve({ ok: !0, source: "seed" })) : m().then((R) => {
      if (!R) throw new Error("IndexedDB is unavailable");
      return x(C._name);
    }).then((R) => {
      if (!q)
        if (C.initializationError = null, R && R.schema_version === u)
          C.lastSyncedAt = R.last_synced_at || null, C.totalCount = R.record_count || 0, C.hasCache = R.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, C.canServe = !0, k(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
        else {
          if (R && R.schema_version !== u)
            return T(C._name).then(() => D(C._name, { schema_version: u, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
              C.isInitialized = !0, C.hasCache = !1, k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
            });
          C.isInitialized = !0, C.hasCache = !1, k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
        }
    }).catch((R) => q ? (C.lastSyncedAt = Math.floor(Date.now() / 1e3), C.totalCount = q.length, C.hasCache = !0, C.isLoaded = !0, C.canServe = !0, C.isInitialized = !0, k(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "seed" }), k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !0, lastSyncedAt: C.lastSyncedAt, count: C.totalCount, source: "seed" }), { ok: !0, source: "seed" }) : (C.isInitialized = !0, C.isLoaded = !1, C.canServe = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = R, k(C.dom, "ln-data-store:initialization-error", { store: C._name, error: R }), { ok: !1, error: R }));
  }
  function V(C) {
    C.isSyncing = !0, k(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function Ct(C, q) {
    return f().then((R) => R ? (kt() ? Promise.all(q.map((M) => d(M))) : Promise.resolve(q)).then((M) => new Promise((F, B) => {
      const z = R.transaction(C, "readwrite"), $ = z.objectStore(C);
      M.forEach((et) => $.put(et)), z.oncomplete = () => F(), z.onerror = () => {
        r(z.error), B(z.error);
      };
    })) : void 0);
  }
  function ee(C, q) {
    return f().then((R) => {
      if (R)
        return new Promise((N, M) => {
          const F = R.transaction(C, "readwrite"), B = F.objectStore(C);
          q.forEach((z) => {
            B.delete(z), typeof z == "string" && z.trim() !== "" && !isNaN(Number(z)) ? B.delete(Number(z)) : typeof z == "number" && B.delete(String(z));
          }), F.oncomplete = () => N(), F.onerror = () => M(F.error);
        });
    });
  }
  function Ii(C, q, R) {
    return (kt() ? d(R) : Promise.resolve(R)).then((M) => f().then((F) => {
      if (F)
        return new Promise((B, z) => {
          const $ = F.transaction(C, "readwrite"), et = $.objectStore(C);
          et.put(M), et.delete(q), $.oncomplete = () => B(), $.onerror = () => {
            r($.error), z($.error);
          };
        });
    }));
  }
  const Ri = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Di(C) {
    return C ? Object.keys(C).filter((q) => Array.isArray(C[q]) && C[q].length > 0) : [];
  }
  function Oi(C, q, R) {
    return q.every((N) => R[N].map(String).includes(String(C[N])));
  }
  function Ni(C) {
    return String(C || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Mi(C, q, R) {
    return q.every(
      (N) => R.some((M) => {
        const F = C[M];
        return F != null && String(F).toLowerCase().includes(N);
      })
    );
  }
  function Pi(C, q, R) {
    return oo(C, q, R);
  }
  function Ft(C, q) {
    return ao(q, C.presenters && C.presenters.computed);
  }
  function Fi(C) {
    return !C.sort && !kt();
  }
  function Bi(C, q, R) {
    const N = Di(q.filters), M = q.search ? Ni(q.search) : [], F = C._searchFields, B = M.length > 0 && F && F.length > 0;
    return y(C._name, "readonly").then((z) => z ? new Promise(($, et) => {
      const It = [], vt = z.openCursor();
      vt.onsuccess = () => {
        const gt = vt.result;
        if (!gt || It.length >= R) {
          $(It);
          return;
        }
        const _t = gt.value;
        (!N.length || Oi(_t, N, q.filters)) && (!B || Mi(_t, M, F)) && It.push(_t), gt.continue();
      }, vt.onerror = () => et(vt.error);
    }) : []);
  }
  function me(C, q, R) {
    return so(q, R, C._searchFields, Ri);
  }
  function Ui(C, q, R) {
    const N = [];
    for (let F = q; F < q + R; F++) {
      const B = C._windowIndex.getId(F);
      N.push(B);
    }
    const M = Array.from(new Set(N.filter((F) => F !== void 0)));
    return b(C._name, M).then((F) => {
      const B = /* @__PURE__ */ new Map();
      for (let $ = 0; $ < F.length; $++) {
        const et = F[$];
        et && B.set(String(et.id), et);
      }
      const z = [];
      for (let $ = 0; $ < N.length; $++) {
        const et = N[$];
        if (et === void 0)
          z.push(null);
        else {
          const It = B.get(String(et));
          z.push(It || null);
        }
      }
      return {
        data: Ft(C, z),
        total: C._windowIndex.grandTotal,
        filtered: C._windowIndex.logicalTotal,
        offset: q,
        queryGen: C._windowIndex.queryGen
      };
    });
  }
  I.prototype.getAll = function(C = {}) {
    const q = this;
    if (q._seedRecords) {
      const R = me(q, q._seedRecords, C);
      return Promise.resolve({
        data: Ft(q, R.records),
        total: R.total,
        filtered: R.filtered
      });
    }
    if (q._windowIndex) {
      const R = C.offset || 0, N = C.limit || 200;
      if (q._windowIndex.ensure(R, R + N, C), !q._windowIndex.hasLoaded && !q.noLocalQuery) {
        const M = R + N, F = (B) => ({
          data: Ft(q, B),
          offset: R,
          queryGen: q._windowIndex.queryGen,
          provisional: !0
        });
        return Fi(C) ? Bi(q, C, M).then((B) => F(B.slice(R, M))) : v(q._name).then((B) => F(me(q, B, C).records));
      }
      return Ui(q, R, N);
    }
    return v(q._name).then((R) => {
      const N = me(q, R, C);
      return {
        data: Ft(q, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(C) {
    return S(this._name, C).then((q) => q ? Ft(this, [q])[0] : null);
  }, I.prototype.count = function(C) {
    if (this._seedRecords) {
      const R = C && Object.keys(C).length > 0;
      return Promise.resolve(R ? Me(this._seedRecords, C).length : this._seedRecords.length);
    }
    return C && Object.keys(C).length > 0 ? v(this._name).then((R) => Me(R, C).length) : this.windowed && this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, I.prototype.aggregate = function(C, q) {
    return v(this._name).then((R) => Pi(R, C, q));
  }, I.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, I.prototype.applySync = function(C, q, R, N) {
    N = N || {};
    const M = this;
    if (M._windowIndex && N.queryGen != null && N.queryGen !== M._windowIndex.queryGen)
      return Promise.resolve({ ok: !0, stale: !0 });
    let F = f().then((B) => {
      if (!B) throw new Error("IndexedDB unavailable");
    });
    return C.length > 0 && (F = F.then(() => Ct(M._name, C))), q.length > 0 && (F = F.then(() => ee(M._name, q))), F.then(() => {
      if (M._windowIndex && (N.offset != null || N.total != null)) {
        const B = N.offset != null ? N.offset : 0, z = C.map((et) => et.id), $ = M._windowIndex.ingest(B, z, N.total, N.filtered, N.queryGen);
        if ($ && $.length) return ee(M._name, $);
      }
    }).then(() => L(M._name)).then((B) => (M.totalCount = N.total !== void 0 ? N.total : B, M.hasCache = !0, D(M._name, {
      schema_version: u,
      last_synced_at: R,
      has_cache: !0,
      record_count: M.totalCount
    }))).then(() => {
      const B = !M.isLoaded;
      return M.isLoaded = !0, M.canServe = !0, M.isSyncing = !1, M.lastSyncedAt = R, B ? (k(M.dom, "ln-data-store:loaded", { store: M._name, count: M.totalCount, meta: N }), k(M.dom, "ln-data-store:ready", { store: M._name, count: M.totalCount, source: "server", meta: N })) : k(M.dom, "ln-data-store:synced", {
        store: M._name,
        added: C.length,
        deleted: q.length,
        changed: !0,
        meta: N
      }), { ok: !0 };
    }).catch((B) => {
      M.isSyncing = !1;
      const z = B && B.message ? B.message : String(B);
      return console.error("[ln-data-store] applySync failed:", B), k(M.dom, "ln-data-store:sync-error", {
        store: M._name,
        error: z
      }), co(B);
    });
  }, I.prototype.applyQuery = function(C, q) {
    q = q || {};
    const R = this;
    let N = Promise.resolve();
    return C.length > 0 && (N = N.then(() => Ct(R._name, C))), N.then(() => L(R._name)).then((M) => (R.totalCount = q.total !== void 0 ? q.total : M, C.length > 0 && (R.canServe = !0), Ft(R, C))).catch((M) => (console.error("[ln-data-store] applyQuery failed:", M), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const C = this;
    return T(C._name).then(() => D(C._name, {
      schema_version: u,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, V(C);
    });
  }, I.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [C, q] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, q);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, q] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, q);
      this._queryHandlers = null;
    }
    delete s[this._name], delete this.dom[e];
  };
  function Hi() {
    return f().then((C) => {
      if (!C) return;
      const q = Array.from(C.objectStoreNames);
      return new Promise((R, N) => {
        const M = C.transaction(q, "readwrite");
        q.forEach((F) => M.objectStore(F).clear()), M.oncomplete = () => R(), M.onerror = () => N(M.error);
      });
    }).then(() => {
      Object.values(s).forEach((C) => {
        C.isLoaded = !1, C.canServe = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  function ge(C) {
    C._windowIndex && C._windowIndex.reset(), k(C.dom, "ln-data-store:query-changed", {
      store: C._name,
      query: {
        filters: Object.assign({}, C.query.filters),
        search: C.query.search,
        sort: C.query.sort ? Object.assign({}, C.query.sort) : null
      }
    });
  }
  const zi = "data-ln-data-store-frozen";
  function nn(C, q) {
    C.setAttribute(zi, q);
  }
  function Ki(C) {
    const q = C[e];
    if (!q._windowIndex) return;
    const R = q._windowIndex.configure({ windowSize: q._windowSize });
    R.length && ee(q._name, R).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function ji(C) {
    const q = C[e];
    q._windowIndex && q._windowIndex.configure({ pageSize: q._windowPageSize });
  }
  H(t, e, I, "ln-data-store", {
    attributes: c
  }), window[e].clearAll = Hi, window[e].init = window[e], window[e].setStorageKey = cn, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = cn);
})();
const fo = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Rt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, o) => {
    const c = String(e);
    return o === 0 ? c.replace(/\/+$/, "") : c.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function ho(t, e) {
  if (!t || typeof t != "object") return "";
  const o = Object.assign({}, fo);
  if (e && typeof e == "object")
    for (const h in e)
      e[h] !== void 0 && e[h] !== null && e[h] !== "" && (o[h] = e[h]);
  const c = new URLSearchParams();
  return t.search && c.append(o.search, t.search), t.offset != null && c.append(o.offset, t.offset), t.limit != null && c.append(o.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (c.append(o.sortField, t.sort.field), c.append(o.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((h) => {
    const g = t.filters[h];
    Array.isArray(g) && g.length > 0 && c.append(h, g.join(","));
  }), c.toString();
}
function po(t, e, o) {
  let c = Rt(t, e);
  return o && (c += (c.indexOf("?") !== -1 ? "&" : "?") + o), c;
}
function En(t) {
  const e = t && t.content !== void 0 ? t.content : t, o = t && t.message ? t.message : null;
  return { record: e, message: o };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", o = "lnConnector";
  if (window[e] !== void 0) return;
  function c(s) {
    const r = s[e];
    r && r.refreshConfig();
  }
  function h(s) {
    return s.getAttribute("data-ln-api-path") || s.getAttribute("data-ln-api-endpoint") || "";
  }
  const g = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: j, type: "string", fallback: "", effect: c, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: h, type: "string", fallback: "", effect: c, description: "Resource path appended to base URL" },
    "data-ln-api-endpoint": { read: h, type: "string", fallback: "", effect: c, description: "Alias for data-ln-api-path" },
    "data-ln-api-headers": { prop: "rawHeaders", read: j, type: "json", fallback: null, effect: c, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: c, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: c, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: c, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: c, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: c, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: c, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, l = Y(g);
  function u(s) {
    return s.ok ? s.status === 204 ? null : s.json() : s.json().catch(() => null).then((r) => {
      const i = new Error("HTTP " + s.status + ": " + s.statusText);
      throw i.status = s.status, i.data = r, i;
    });
  }
  function a(s) {
    return this.dom = s, X(this, s, l), s[e] = this, s[o] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, n(this), this;
  }
  a.prototype.refreshConfig = function() {
    const s = this.dom;
    this.credentials = "same-origin", this.headers = xn(this.rawHeaders);
    const r = {}, i = s.getAttribute("data-ln-api-param-offset");
    i && (r.offset = i);
    const m = s.getAttribute("data-ln-api-param-limit");
    m && (r.limit = m);
    const p = s.getAttribute("data-ln-api-param-search");
    p && (r.search = p);
    const f = s.getAttribute("data-ln-api-param-sort-field");
    f && (r.sortField = f);
    const d = s.getAttribute("data-ln-api-param-sort-dir");
    d && (r.sortDir = d), this.paramKeys = r;
    const _ = s.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = _ !== null ? +_ : 300, k(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, a.prototype._reqHeaders = function(s) {
    const r = Object.assign({}, this.headers);
    return !r.Accept && !r.accept && (r.Accept = "application/json"), !r["Content-Type"] && !r["content-type"] && (r["Content-Type"] = "application/json"), s && (r["X-Idempotency-Key"] = s), r;
  }, a.prototype.cancel = function(s) {
    return s && this._inflight.has(s) ? (this._inflight.get(s).abort(), this._inflight.delete(s), !0) : !1;
  }, a.prototype.fetchDelta = function(s, r) {
    const i = this;
    let m = Rt(i.baseUrl, i.path);
    s != null && s !== "" && (m += (m.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(s));
    const p = r || "sync";
    i._inflight.has(p) && i._inflight.get(p).abort();
    const f = new AbortController();
    return i._inflight.set(p, f), window.fetch(m, {
      method: "GET",
      headers: i._reqHeaders(),
      credentials: i.credentials,
      signal: f.signal
    }).then(u).finally(function() {
      i._inflight.get(p) === f && i._inflight.delete(p);
    });
  }, a.prototype.query = function(s, r) {
    const i = this, m = ho(s, i.paramKeys), p = po(i.baseUrl, i.path, m), f = r || "query";
    i._inflight.has(f) && i._inflight.get(f).abort();
    const d = new AbortController();
    return i._inflight.set(f, d), window.fetch(p, {
      method: "GET",
      headers: i._reqHeaders(),
      credentials: i.credentials,
      signal: d.signal
    }).then(u).finally(function() {
      i._inflight.get(f) === d && i._inflight.delete(f);
    });
  }, a.prototype.create = function(s, r, i) {
    const m = this;
    return window.fetch(Rt(m.baseUrl, r || m.path), {
      method: "POST",
      headers: m._reqHeaders(i),
      credentials: m.credentials,
      body: JSON.stringify(s)
    }).then(u);
  }, a.prototype.update = function(s, r, i, m, p) {
    const f = this;
    i != null && (r = Object.assign({}, r, { expected_version: i }));
    const d = m ? Rt(f.baseUrl, m) : Rt(f.baseUrl, f.path, s);
    return window.fetch(d, {
      method: "PUT",
      headers: f._reqHeaders(p),
      credentials: f.credentials,
      body: JSON.stringify(r)
    }).then(u);
  }, a.prototype.delete = function(s, r, i) {
    const m = this;
    return window.fetch(Rt(m.baseUrl, r || m.path, s), {
      method: "DELETE",
      headers: m._reqHeaders(i),
      credentials: m.credentials
    }).then(u);
  }, a.prototype.bulkDelete = function(s, r, i) {
    const m = this;
    return window.fetch(Rt(m.baseUrl, r || m.path, "bulk-delete"), {
      method: "DELETE",
      headers: m._reqHeaders(i),
      credentials: m.credentials,
      body: JSON.stringify({ ids: s })
    }).then(u);
  };
  function n(s) {
    s._handlers = {
      sync: function(r) {
        const i = r.detail || {}, m = i.meta && i.meta.targetEl ? i.meta.targetEl : null;
        s.fetchDelta(i.since, m).then(function(p) {
          k(s.dom, "ln-api-connector:fetched", { data: p, since: i.since, meta: i.meta || null });
        }).catch(function(p) {
          p && p.name === "AbortError" || k(s.dom, "ln-api-connector:error", {
            action: "sync",
            error: p.message,
            status: p.status || 0,
            data: p.data || null,
            since: i.since,
            meta: i.meta || null
          });
        });
      },
      query: function(r) {
        const i = r.detail || {}, m = i.query || i, p = i.meta && i.meta.targetEl ? i.meta.targetEl : null, f = p || "query", d = s.queryDebounce;
        function _(E, v, S) {
          s.query(v, S).then(function(b) {
            const w = b || {};
            k(s.dom, "ln-api-connector:fetched", {
              data: w.data || (Array.isArray(w) ? w : []),
              total: w.total,
              filtered: w.filtered,
              offset: v.offset,
              queryGen: v.queryGen,
              meta: E.meta || null
            });
          }).catch(function(b) {
            b && b.name === "AbortError" || k(s.dom, "ln-api-connector:error", {
              action: "query",
              error: b.message,
              status: b.status || 0,
              data: b.data || null,
              meta: E.meta || null
            });
          });
        }
        if (d === 0) {
          _(i, m, p);
          return;
        }
        s._queryTimers.has(f) && clearTimeout(s._queryTimers.get(f));
        const y = setTimeout(function() {
          s._queryTimers.delete(f), _(i, m, p);
        }, d);
        s._queryTimers.set(f, y);
      },
      cancel: function(r) {
        const i = r.detail || {}, m = i.meta && i.meta.targetEl ? i.meta.targetEl : i.targetEl || i.key;
        m && s.cancel(m);
      },
      create: function(r) {
        const i = r.detail || {};
        s.create(i.data, i.url, i.idempotencyKey).then(function(m) {
          const p = En(m);
          k(s.dom, "ln-api-connector:created", {
            record: p.record,
            tempId: i.tempId,
            message: p.message,
            meta: i.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || k(s.dom, "ln-api-connector:error", {
            action: "create",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            tempId: i.tempId,
            meta: i.meta || null
          });
        });
      },
      update: function(r) {
        const i = r.detail || {};
        s.update(i.id, i.data, i.expected_version, i.url, i.idempotencyKey).then(function(m) {
          const p = En(m);
          k(s.dom, "ln-api-connector:updated", {
            record: p.record,
            id: i.id,
            message: p.message,
            meta: i.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || k(s.dom, "ln-api-connector:error", {
            action: "update",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            id: i.id,
            conflictData: m.status === 409 ? m.data : null,
            meta: i.meta || null
          });
        });
      },
      delete: function(r) {
        const i = r.detail || {};
        s.delete(i.id, i.url, i.idempotencyKey).then(function(m) {
          const p = m && m.message ? m.message : null;
          k(s.dom, "ln-api-connector:deleted", {
            response: m,
            id: i.id,
            message: p,
            meta: i.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || k(s.dom, "ln-api-connector:error", {
            action: "delete",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            id: i.id,
            meta: i.meta || null
          });
        });
      },
      bulkDelete: function(r) {
        const i = r.detail || {};
        s.bulkDelete(i.ids, i.url, i.idempotencyKey).then(function(m) {
          const p = m && m.message ? m.message : null;
          k(s.dom, "ln-api-connector:bulk-deleted", {
            response: m,
            ids: i.ids,
            message: p,
            meta: i.meta || null
          });
        }).catch(function(m) {
          m && m.name === "AbortError" || k(s.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: m.message,
            status: m.status || 0,
            data: m.data || null,
            ids: i.ids,
            meta: i.meta || null
          });
        });
      }
    }, s.dom.addEventListener("ln-api-connector:request-sync", s._handlers.sync), s.dom.addEventListener("ln-api-connector:request-query", s._handlers.query), s.dom.addEventListener("ln-api-connector:request-cancel", s._handlers.cancel), s.dom.addEventListener("ln-api-connector:request-create", s._handlers.create), s.dom.addEventListener("ln-api-connector:request-update", s._handlers.update), s.dom.addEventListener("ln-api-connector:request-delete", s._handlers.delete), s.dom.addEventListener("ln-api-connector:request-bulk-delete", s._handlers.bulkDelete);
  }
  a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const s = this;
    s._inflight && (s._inflight.forEach(function(r) {
      r.abort();
    }), s._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(r) {
      r && clearTimeout(r);
    }), this._queryTimers.clear()), this._handlers && (s.dom.removeEventListener("ln-api-connector:request-sync", s._handlers.sync), s.dom.removeEventListener("ln-api-connector:request-query", s._handlers.query), s.dom.removeEventListener("ln-api-connector:request-cancel", s._handlers.cancel), s.dom.removeEventListener("ln-api-connector:request-create", s._handlers.create), s.dom.removeEventListener("ln-api-connector:request-update", s._handlers.update), s.dom.removeEventListener("ln-api-connector:request-delete", s._handlers.delete), s.dom.removeEventListener("ln-api-connector:request-bulk-delete", s._handlers.bulkDelete), s._handlers = null), delete this.dom[e], delete this.dom[o];
  }, H(t, e, a, "ln-api-connector", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", o = "lnConnector";
  if (window[e] !== void 0) return;
  function c(p) {
    const f = p[e];
    f && f.refreshConfig();
  }
  const h = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: j, type: "string", fallback: "", effect: c, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: j, type: "string", fallback: "", effect: c, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: j, type: "string", fallback: "", effect: c, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: c, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, g = Y(h);
  function l(p) {
    const f = p && p.content !== void 0 ? p.content : p, d = p && p.message ? p.message : null;
    return { content: f, message: d };
  }
  function u(p) {
    return this.dom = p, X(this, p, g), p[e] = this, p[o] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, m(this), this;
  }
  u.prototype.refreshConfig = function() {
    const p = this.dom;
    this.credentials = "same-origin";
    const f = p.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = xn(f, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), f.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), k(p, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function a(p, f, d) {
    const _ = Object.assign({}, jt(p.headers, p.auth), d || {});
    return f && (_["Idempotency-Key"] = f), _;
  }
  u.prototype.fetchDelta = function(p) {
    const f = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const d = this._deltaController.signal, _ = ["include_docs=true", "feed=normal"];
    p && _.push("since=" + encodeURIComponent(p));
    const y = Tt(f.url, f.db, "_changes") + "?" + _.join("&");
    return window.fetch(y, { method: "GET", headers: jt(f.headers, f.auth), credentials: f.credentials, signal: d }).then((E) => {
      if (!E.ok) throw new Error("HTTP " + E.status + ": " + E.statusText);
      return E.json();
    }).then((E) => {
      const v = E.results || [];
      return {
        data: v.filter((S) => !S.deleted && S.doc).map((S) => Object.assign({}, S.doc, { id: S.doc._id })),
        deleted: v.filter((S) => S.deleted).map((S) => S.id),
        synced_at: E.last_seq || p || ""
      };
    }).finally(() => {
      f._deltaController && f._deltaController.signal === d && (f._deltaController = null);
    });
  };
  function n(p, f, d) {
    const _ = Object.assign({ _id: f.id }, f);
    return _._id || delete _._id, window.fetch(Tt(p.url, p.db), {
      method: "POST",
      headers: a(p, d),
      credentials: p.credentials,
      body: JSON.stringify(_)
    }).then((y) => {
      if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
      return y.json();
    }).then((y) => {
      const E = l(y), v = E.content;
      return { record: Object.assign({}, _, { id: v.id, _id: v.id, _rev: v.rev }), message: E.message };
    });
  }
  u.prototype.create = function(p, f) {
    return n(this, p, f).then((d) => d.record);
  };
  function s(p, f, d, _) {
    const y = Object.assign({ id: String(f), _id: String(f) }, d), E = y._rev || y.rev;
    return (E ? Promise.resolve(E) : window.fetch(Tt(p.url, p.db, null, f), { method: "GET", headers: jt(p.headers, p.auth), credentials: p.credentials }).then((S) => {
      if (!S.ok) throw new Error("Could not retrieve document for revision mapping");
      return S.json().then((b) => b._rev);
    })).then((S) => {
      const b = Object.assign({}, y, { _rev: S });
      delete b.rev;
      const w = a(p, _, { "If-Match": S });
      return window.fetch(Tt(p.url, p.db, null, f), {
        method: "PUT",
        headers: w,
        credentials: p.credentials,
        body: JSON.stringify(b)
      }).then((A) => {
        if (A.ok) return A.json().then((T) => {
          const L = l(T);
          return { record: Object.assign({}, b, { _rev: L.content.rev }), message: L.message };
        });
        if (A.status === 409) return A.json().then((T) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = T, L;
        });
        throw new Error("HTTP " + A.status + ": " + A.statusText);
      });
    });
  }
  u.prototype.update = function(p, f, d) {
    return s(this, p, f, d).then((_) => _.record);
  };
  function r(p, f, d, _) {
    return (d ? Promise.resolve(d) : window.fetch(Tt(p.url, p.db, null, f), { method: "GET", headers: jt(p.headers, p.auth), credentials: p.credentials }).then((E) => {
      if (!E.ok) throw new Error("Could not retrieve document for revision delete");
      return E.json().then((v) => v._rev);
    })).then((E) => {
      const v = Tt(p.url, p.db, null, f) + "?rev=" + encodeURIComponent(E);
      return window.fetch(v, { method: "DELETE", headers: a(p, _), credentials: p.credentials }).then((S) => {
        if (!S.ok) throw new Error("HTTP " + S.status + ": " + S.statusText);
        return S.json();
      }).then((S) => {
        const b = l(S);
        return { response: b.content, message: b.message };
      });
    });
  }
  u.prototype.delete = function(p, f, d) {
    return r(this, p, f, d).then((_) => _.response);
  };
  function i(p, f, d) {
    return !f || f.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Tt(p.url, p.db, "_all_docs"), {
      method: "POST",
      headers: jt(p.headers, p.auth),
      credentials: p.credentials,
      body: JSON.stringify({ keys: f })
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const E = (_.rows || []).filter((v) => !v.error && v.value && v.value.rev).map((v) => ({ _id: v.id, _rev: v.value.rev, _deleted: !0 }));
      return E.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Tt(p.url, p.db, "_bulk_docs"), {
        method: "POST",
        headers: a(p, d),
        credentials: p.credentials,
        body: JSON.stringify({ docs: E })
      }).then((v) => {
        if (!v.ok) throw new Error("HTTP " + v.status + ": " + v.statusText);
        return v.json();
      }).then((v) => {
        const S = l(v);
        return { response: { ok: !0, results: S.content, deletedCount: E.length }, message: S.message };
      });
    });
  }
  u.prototype.bulkDelete = function(p, f) {
    return i(this, p, f).then((d) => d.response);
  };
  function m(p) {
    p._handlers = {
      sync: function(f) {
        const d = f.detail || {};
        p.fetchDelta(d.since).then(function(_) {
          k(p.dom, "ln-couchdb-connector:fetched", { data: _, since: d.since, meta: d.meta || null });
        }).catch(function(_) {
          _ && _.name === "AbortError" || k(p.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: _.message,
            status: _.status || 0,
            since: d.since,
            meta: d.meta || null
          });
        });
      },
      create: function(f) {
        const d = f.detail || {};
        n(p, d.data, d.idempotencyKey).then(function(_) {
          k(p.dom, "ln-couchdb-connector:created", { record: _.record, tempId: d.tempId, message: _.message, meta: d.meta || null });
        }).catch(function(_) {
          k(p.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            tempId: d.tempId,
            meta: d.meta || null
          });
        });
      },
      update: function(f) {
        const d = f.detail || {}, _ = Object.assign({}, d.data);
        d.expected_version !== void 0 && (_._rev = d.expected_version), s(p, d.id, _, d.idempotencyKey).then(function(y) {
          k(p.dom, "ln-couchdb-connector:updated", { record: y.record, id: d.id, message: y.message, meta: d.meta || null });
        }).catch(function(y) {
          k(p.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: y.message,
            status: y.status || 0,
            id: d.id,
            data: y.status === 409 ? y.data : null,
            conflictData: y.status === 409 ? y.data : null,
            meta: d.meta || null
          });
        });
      },
      delete: function(f) {
        const d = f.detail || {};
        r(p, d.id, d.rev, d.idempotencyKey).then(function(_) {
          k(p.dom, "ln-couchdb-connector:deleted", { response: _.response, id: d.id, message: _.message, meta: d.meta || null });
        }).catch(function(_) {
          k(p.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            id: d.id,
            meta: d.meta || null
          });
        });
      },
      bulkDelete: function(f) {
        const d = f.detail || {};
        i(p, d.ids, d.idempotencyKey).then(function(_) {
          k(p.dom, "ln-couchdb-connector:bulk-deleted", { response: _.response, ids: d.ids, message: _.message, meta: d.meta || null });
        }).catch(function(_) {
          k(p.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
            ids: d.ids,
            meta: d.meta || null
          });
        });
      }
    }, p.dom.addEventListener("ln-couchdb-connector:request-sync", p._handlers.sync), p.dom.addEventListener("ln-couchdb-connector:request-create", p._handlers.create), p.dom.addEventListener("ln-couchdb-connector:request-update", p._handlers.update), p.dom.addEventListener("ln-couchdb-connector:request-delete", p._handlers.delete), p.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", p._handlers.bulkDelete);
  }
  u.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const p = this;
    p._deltaController && (p._deltaController.abort(), p._deltaController = null), p._handlers && (p.dom.removeEventListener("ln-couchdb-connector:request-sync", p._handlers.sync), p.dom.removeEventListener("ln-couchdb-connector:request-create", p._handlers.create), p.dom.removeEventListener("ln-couchdb-connector:request-update", p._handlers.update), p.dom.removeEventListener("ln-couchdb-connector:request-delete", p._handlers.delete), p.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", p._handlers.bulkDelete), p._handlers = null), delete this.dom[e], delete this.dom[o];
  }, H(t, e, u, "ln-couchdb-connector", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", o = "lnConnector";
  if (window[e] !== void 0) return;
  const c = 1e3, h = 3e4;
  function g(i) {
    const m = i[e];
    m && (m.command === "connect" ? m._open() : m._disconnect());
  }
  function l(i) {
    const m = i[e];
    !m || m.command !== "connect" || (m._drop("url-changed"), m._open());
  }
  const u = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: g, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: j, type: "string", fallback: "", effect: l, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, a = Y(u), n = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function s(i, m) {
    return i === "sync" ? { since: m.since } : i === "query" ? { query: m.query || {} } : i === "create" ? { data: m.data, idempotencyKey: m.idempotencyKey } : i === "update" ? { id: m.id, data: m.data, expected_version: m.expected_version, idempotencyKey: m.idempotencyKey } : i === "delete" ? { id: m.id, idempotencyKey: m.idempotencyKey } : { ids: m.ids, idempotencyKey: m.idempotencyKey };
  }
  function r(i) {
    this.dom = i, X(this, i, a), i[e] = this, i[o] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const m = this;
    this._onRequest = function(p) {
      m._request(n[p.type], p.detail || {});
    };
    for (const p in n) i.addEventListener(p, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  r.prototype._open = function() {
    if (this._socket || this._timer) return;
    const i = this, m = this.url;
    this._attempt++, this._status = "connecting", k(this.dom, "ln-websocket-connector:connecting", { url: m, attempt: this._attempt });
    let p;
    try {
      p = new WebSocket(m);
    } catch (f) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, f.message), this._held = [], k(this.dom, "ln-websocket-connector:disconnected", { url: m, code: 0, reason: f.message, willReconnect: !1 });
      return;
    }
    this._socket = p, p.onopen = function() {
      i._status = "connected", i._attempt = 0, k(i.dom, "ln-websocket-connector:connected", { url: m });
      const f = i._held;
      i._held = [];
      for (let d = 0; d < f.length; d++) i._send(f[d]);
    }, p.onmessage = function(f) {
      i._receive(f.data);
    }, p.onclose = function(f) {
      i._socket = null, i._status = "disconnected", i._failPending("connection closed");
      const d = i.command === "connect";
      k(i.dom, "ln-websocket-connector:disconnected", { url: m, code: f.code, reason: f.reason, willReconnect: d }), d && i._scheduleReconnect();
    };
  }, r.prototype._scheduleReconnect = function() {
    const i = this, m = Math.min(c * Math.pow(2, Math.max(0, this._attempt - 1)), h);
    this._timer = setTimeout(function() {
      i._timer = null, i._open();
    }, m);
  }, r.prototype._drop = function(i) {
    const m = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, i), this._socket = null), m && (this._status = "disconnected", this._failPending("connection closed"), k(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: i, willReconnect: !1 }));
  }, r.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, r.prototype._request = function(i, m) {
    const p = { ref: String(++this._seq), type: i, detail: m };
    this._status === "connected" ? this._send(p) : this.command === "connect" ? this._held.push(p) : this._fail(p, 0, "disconnected", null);
  }, r.prototype._send = function(i) {
    this._pending.set(i.ref, i), this._socket.send(JSON.stringify(Object.assign({ ref: i.ref, type: i.type }, s(i.type, i.detail))));
  }, r.prototype._receive = function(i) {
    let m;
    try {
      m = JSON.parse(i);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", i);
      return;
    }
    if (m.ref !== void 0) {
      const p = this._pending.get(String(m.ref));
      if (!p) return;
      this._pending.delete(p.ref), m.ok ? this._resolve(p, m.content, m.message || null) : this._fail(p, m.status || 0, m.error, m.data);
      return;
    }
    m.type === "changes" && k(this.dom, "ln-websocket-connector:fetched", {
      data: { data: m.data || [], deleted: m.deleted || [], synced_at: m.synced_at },
      since: null,
      meta: null
    });
  }, r.prototype._resolve = function(i, m, p) {
    const f = i.detail, d = f.meta || null, _ = this.dom;
    if (i.type === "sync")
      k(_, "ln-websocket-connector:fetched", { data: m, since: f.since, meta: d });
    else if (i.type === "query") {
      const y = f.query || {}, E = m || {};
      k(_, "ln-websocket-connector:fetched", {
        data: E.data || [],
        total: E.total,
        filtered: E.filtered,
        offset: y.offset,
        queryGen: y.queryGen,
        meta: d
      });
    } else i.type === "create" ? k(_, "ln-websocket-connector:created", { record: m, tempId: f.tempId, message: p, meta: d }) : i.type === "update" ? k(_, "ln-websocket-connector:updated", { record: m, id: f.id, message: p, meta: d }) : i.type === "delete" ? k(_, "ln-websocket-connector:deleted", { response: m, id: f.id, message: p, meta: d }) : k(_, "ln-websocket-connector:bulk-deleted", { response: m, ids: f.ids, message: p, meta: d });
  }, r.prototype._fail = function(i, m, p, f) {
    const d = i.detail;
    k(this.dom, "ln-websocket-connector:error", {
      action: i.type,
      error: p,
      status: m,
      data: f || null,
      conflictData: m === 409 && f || null,
      since: d.since,
      id: d.id,
      ids: d.ids,
      tempId: d.tempId,
      meta: d.meta || null
    });
  }, r.prototype._failAll = function(i, m) {
    for (let p = 0; p < i.length; p++) this._fail(i[p], 0, m, null);
  }, r.prototype._failPending = function(i) {
    const m = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(m, i);
  }, r.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const i in n) this.dom.removeEventListener(i, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[o];
    }
  }, H(t, e, r, "ln-websocket-connector", {
    attributes: u
  });
})();
function mo(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function go(t, e) {
  const o = !t || !!t.initializationError, c = !!(t && t.noLocalQuery && !t.windowed);
  return e && (o || !t.canServe || c) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function An(t, e) {
  const o = Object.assign({}, t);
  return e && (o.filters = e.filters, o.search = e.search, o.sort = e.sort), o;
}
class _o {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((o, c) => {
      this._pending.set(e, { resolve: o, reject: c });
    });
  }
  resolve(e) {
    return this._settle(e, !1);
  }
  reject(e) {
    return this._settle(e, !0);
  }
  close(e) {
    const o = e || new Error("Mutation receipt registry closed");
    for (const c of this._pending.values()) c.reject(o);
    this._pending.clear();
  }
  _settle(e, o) {
    const c = e && e.requestId;
    if (!c) return !1;
    const h = this._pending.get(c);
    return h ? (this._pending.delete(c), o ? h.reject(e.error || new Error("Store mutation failed")) : h.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", o = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  const c = "data-ln-data-coordinator-search", h = "data-ln-data-coordinator-filters", g = "data-ln-data-coordinator-sort-field", l = "data-ln-data-coordinator-sort-direction", a = Y({
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
  function s(f) {
    const d = f.getAttribute("data-ln-data-coordinator-connector");
    if (d) return f.querySelector(d) || document.querySelector(d) || document.getElementById(d);
    const _ = f.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (_) return _;
    for (const y of f.querySelectorAll("*")) {
      if (y.lnConnector) return y;
      for (const E of y.attributes) if (E.name.startsWith("data-ln-") && E.name.endsWith("-connector")) return y;
    }
    return null;
  }
  function r(f) {
    var _;
    if (!f) return "ln-connector";
    if ((_ = f.lnConnector) != null && _.namespace) return f.lnConnector.namespace;
    const d = f.getAttribute("data-ln-connector");
    if (d && d !== "true") return d.startsWith("ln-") ? d : "ln-" + d + (d.endsWith("-connector") ? "" : "-connector");
    for (const y of f.attributes) if (y.name.startsWith("data-ln-") && y.name.endsWith("-connector")) return y.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function i(f) {
    const d = this;
    return this.dom = f, X(this, f, a), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", f), f[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new _o(), this._queueQueryRefresh = Xt(() => {
      d._destroyed || d._refreshAll(null, !0);
    }), this.refreshMapper(), m(this), this._checkInitialSync(), this;
  }
  i.prototype._noAutosync = function(f) {
    var d;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((d = f.storeEl) != null && d.hasAttribute("data-ln-data-store-no-autosync"));
  }, i.prototype._isStale = function(f) {
    var _, y;
    const d = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((_ = f.storeEl) == null ? void 0 : _.getAttribute("data-ln-data-store-stale"));
    return d === "never" || d === "-1" ? !1 : !((y = f.store) != null && y.lastSyncedAt) || Date.now() / 1e3 - f.store.lastSyncedAt > (parseInt(d, 10) || 300);
  }, i.prototype._checkInitialSync = function() {
    const f = this, d = this.findChildren();
    d.store && Promise.resolve(d.store.ready).then(() => {
      if (f._destroyed) return;
      const _ = f.findChildren();
      _.store && _.connector && !f._noAutosync(_) && !_.store.isSyncing && (!_.store.hasCache || f._isStale(_)) && _.store.forceSync();
    }).catch((_) => f._reportError("store-initialize", _, null));
  }, i.prototype.refreshMapper = function() {
    var _, y;
    const f = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, d = f && ((y = (_ = window.lnCore) == null ? void 0 : _.getDataMapper) == null ? void 0 : y.call(_, f)) || null;
    this.mapper = { ingress: (d == null ? void 0 : d.ingress) || ((E) => E), egress: (d == null ? void 0 : d.egress) || ((E) => E) };
  }, i.prototype.findChildren = function() {
    const f = this.dom.querySelector("[data-ln-data-store]"), d = s(this.dom), _ = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: f, connectorEl: d, queueEl: _, store: (f == null ? void 0 : f.lnDataStore) || null, connector: (d == null ? void 0 : d.lnConnector) || (d == null ? void 0 : d.lnApiConnector) || (d == null ? void 0 : d.lnCouchDbConnector) || (d == null ? void 0 : d.lnWebsocketConnector) || null, queue: (_ == null ? void 0 : _.lnApiQueue) || null };
  }, i.prototype._fanOutRemote = function(f, d, _, y) {
    this.refreshMapper(), f.queue ? k(f.queueEl, "ln-api-queue:request-enqueue", _) : f.connector && k(f.connectorEl, r(f.connectorEl) + ":request-" + d, y);
  }, i.prototype._fanOutCreate = function(f, d, _) {
    const y = "_temp_" + wt(), E = this.mapper.egress(d);
    f.storeEl && k(f.storeEl, "ln-data-store:request-create", { tempId: y, data: E }), this._fanOutRemote(f, "create", { chainKey: y, op: "create", targetId: null, payload: E, expectedVersion: null, meta: { tempId: y, action: _ } }, { data: E, url: _, meta: { entryId: wt(), queued: !1, op: "create", tempId: y } });
  }, i.prototype._fanOutUpdate = function(f, d, _, y, E) {
    const v = this, S = (b) => {
      const w = v.mapper.egress(_);
      f.storeEl && k(f.storeEl, "ln-data-store:request-update", { id: d, data: w }), v._fanOutRemote(f, "update", { chainKey: d, op: "update", targetId: d, payload: w, expectedVersion: y, meta: { id: d, action: E, snapshot: b } }, { id: d, data: w, expected_version: y, url: E, meta: { entryId: wt(), queued: !1, op: "update", id: d, snapshot: b } });
    };
    f.store && typeof f.store.getById == "function" ? f.store.getById(d).then((b) => S(b ? Object.assign({}, b) : null)).catch(() => S(null)) : S(null);
  }, i.prototype._fanOutDelete = function(f, d) {
    const _ = this, y = (E) => {
      f.storeEl && k(f.storeEl, "ln-data-store:request-delete", { id: d }), _._fanOutRemote(f, "delete", { chainKey: d, op: "delete", targetId: d, payload: null, expectedVersion: null, meta: { id: d, snapshot: E } }, { id: d, meta: { entryId: wt(), queued: !1, op: "delete", id: d, snapshot: E } });
    };
    f.store && typeof f.store.getById == "function" ? f.store.getById(d).then((E) => y(E ? Object.assign({}, E) : null)).catch(() => y(null)) : y(null);
  }, i.prototype._fanOutBulkDelete = function(f, d) {
    const _ = d.join(",");
    f.storeEl && k(f.storeEl, "ln-data-store:request-bulk-delete", { ids: d }), this._fanOutRemote(f, "bulk-delete", { chainKey: _, op: "bulk-delete", targetId: null, payload: { ids: d }, expectedVersion: null, meta: { bulkKey: _, ids: d } }, { ids: d, meta: { entryId: wt(), queued: !1, op: "bulk-delete", bulkKey: _ } });
  }, i.prototype._requestStoreMutation = function(f, d, _) {
    if (!f.storeEl) return Promise.reject(new Error("Store element not found"));
    const y = wt(), E = this._mutationReceipts.wait(y);
    return k(f.storeEl, "ln-data-store:request-" + d, Object.assign({}, _, { requestId: y })), E;
  }, i.prototype._reportError = function(f, d, _) {
    this._destroyed || k(this.dom, "ln-data-coordinator:error", { operation: f, error: d, meta: _ || null });
  }, i.prototype._owns = function(f) {
    var _;
    const d = this._name || ((_ = this.findChildren().storeEl) == null ? void 0 : _.id);
    return !!f && f === d;
  }, i.prototype._currentQuery = function() {
    const f = this.dom.getAttribute(g), d = this.dom.getAttribute(l), _ = new URLSearchParams(this.dom.getAttribute(h) || ""), y = {};
    for (const E of new Set(_.keys())) y[E] = _.getAll(E);
    return { search: this.dom.getAttribute(c) || "", filters: y, sort: f && d ? { field: f, direction: d } : null };
  }, i.prototype._refreshAll = function(f, d) {
    for (const [_, y, E] of n)
      for (const v of this.dom.ownerDocument.querySelectorAll(_))
        if (this._owns(v.getAttribute(y))) {
          if ((E === "table" || E === "list") && v.hasAttribute(E === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            k(v, "ln-" + E + (d ? ":request-invalidate" : ":request-revalidate"), { query: this._currentQuery() });
            continue;
          }
          this._serveElement(v, E, null, f);
        }
  }, i.prototype._serveElement = function(f, d, _, y) {
    const E = this.findChildren(), v = E.store;
    if (!v) return;
    _ && this._boundQueries.set(f, _);
    const S = this._boundQueries.get(f) || { sort: null, filters: {}, search: "" }, b = An(S, this._currentQuery()), w = this;
    return Promise.resolve(v.ready).then(() => {
      if (w._destroyed) return;
      const A = go(v, E.connector);
      if (d === "table" || d === "list" || d === "chart")
        return A === "remote" ? (k(f, "ln-" + d + ":set-loading", { loading: !0 }), k(E.connectorEl, r(E.connectorEl) + ":request-query", { query: b, meta: { targetEl: f, kind: d, offset: b.offset, limit: b.limit, queryGen: S.queryGen } })) : A !== "store" ? k(f, "ln-" + d + ":set-loading", { loading: !1 }) : v.getAll(b).then((T) => {
          w._destroyed || !w._boundDelivered || (k(f, "ln-" + d + ":set-loading", { loading: !1 }), k(f, "ln-" + d + ":set-data", { data: T.data, total: (y == null ? void 0 : y.total) ?? T.total, filtered: (y == null ? void 0 : y.filtered) ?? T.filtered, offset: T.offset ?? (y == null ? void 0 : y.offset) ?? S.offset, queryGen: S.queryGen !== void 0 ? S.queryGen : (y == null ? void 0 : y.queryGen) ?? T.queryGen, provisional: T.provisional === !0 }), w._boundDelivered.set(f, !0));
        });
      if (d === "options") {
        if (A === "remote") return k(E.connectorEl, r(E.connectorEl) + ":request-query", { query: {}, meta: { targetEl: f, kind: d } });
        if (A === "store") return v.getAll({}).then((T) => !w._destroyed && k(f, "ln-options:set-data", { data: T.data }));
      }
      if (d === "stat") {
        let T = _ == null ? void 0 : _.filters;
        if (!T) {
          const x = f.getAttribute("data-ln-stat-filter");
          if (x != null && x.includes(":")) {
            const D = x.split(":");
            T = { [D[0].trim()]: [D.slice(1).join(":").trim()] };
          }
        }
        const L = E.connector && v && (v.windowed && T && Object.keys(T).length || v.noLocalQuery) ? "remote" : A;
        if (L === "remote") return k(E.connectorEl, r(E.connectorEl) + ":request-query", { query: { filters: T }, meta: { targetEl: f, kind: d } });
        if (L === "store") return v.count(T).then((x) => !w._destroyed && k(f, "ln-stat:set-count", { count: x }));
      }
    }).catch((A) => {
      w._destroyed || ((d === "table" || d === "list" || d === "chart") && k(f, "ln-" + d + ":set-loading", { loading: !1 }), w._reportError(d + "-query", A, { targetEl: f, kind: d }));
    });
  };
  function m(f) {
    const d = f._unsubs = [], _ = (w, A, T) => {
      w.addEventListener(A, T), d.push(() => w.removeEventListener(A, T));
    };
    _(f.dom, "ln-data-store:request-remote-sync", (w) => {
      f.refreshMapper();
      const A = f.findChildren();
      A.store && A.connector && k(A.connectorEl, r(A.connectorEl) + ":request-sync", { since: w.detail.since, meta: { op: "sync" } });
    }), _(f.dom, "ln-data-store:request-page", (w) => {
      const A = f.findChildren(), T = w.detail || {};
      if (!A.connectorEl) return;
      const L = An(T.query || {}, f._currentQuery());
      k(A.connectorEl, r(A.connectorEl) + ":request-query", {
        query: Object.assign({}, L, { offset: T.offset, limit: T.limit, queryGen: T.queryGen })
      });
    }), _(f.dom, "ln-data-coordinator:request-create", (w) => f._fanOutCreate(f.findChildren(), w.detail.data || {}, w.detail.action)), _(f.dom, "ln-data-coordinator:request-update", (w) => f._fanOutUpdate(f.findChildren(), w.detail.id, w.detail.data || {}, w.detail.expected_version, w.detail.action)), _(f.dom, "ln-data-coordinator:request-delete", (w) => f._fanOutDelete(f.findChildren(), w.detail.id)), _(f.dom, "ln-data-coordinator:request-bulk-delete", (w) => f._fanOutBulkDelete(f.findChildren(), w.detail.ids || [])), _(f.dom, "ln-api-queue:send", (w) => f._onQueueSend(w.detail || {})), _(f.dom, "ln-api-queue:failed", (w) => {
      var A;
      return f._reportError("queue-failed", ((A = w == null ? void 0 : w.detail) == null ? void 0 : A.error) || new Error("Queue failed"), (w == null ? void 0 : w.detail) || null);
    }), _(f.dom, "ln-data-store:initialized", (w) => {
      var T;
      const A = f.findChildren();
      A.store && !A.store.initializationError && A.connector && !f._noAutosync(A) && !A.store.isSyncing && (!((T = w.detail) != null && T.hasCache) || f._isStale(A)) && A.store.forceSync();
    });
    const y = () => {
      const w = f.findChildren();
      w.store && !w.store.initializationError && w.connector && !f._noAutosync(w) && w.store.isInitialized && !w.store.isSyncing && w.store.forceSync();
    };
    _(f.dom, "ln-websocket-connector:connected", y), _(document, "submit", (w) => f._onFormSubmit(w));
    const E = (w, A, T) => {
      var L;
      f._owns(w.target.getAttribute(T)) && f._serveElement(w.target, A, A === "stat" ? { filters: ((L = w.detail) == null ? void 0 : L.filters) || null } : A === "options" ? null : mo(w.detail || {}), null);
    };
    _(document, "ln-table:request-data", (w) => E(w, "table", "data-ln-table-source")), _(document, "ln-list:request-data", (w) => E(w, "list", "data-ln-list-source")), _(document, "ln-chart:request-data", (w) => E(w, "chart", "data-ln-chart-source")), _(document, "ln-options:request-data", (w) => E(w, "options", "data-ln-options")), _(document, "ln-stat:request-count", (w) => E(w, "stat", "data-ln-stat"));
    const v = (w) => {
      f._mutationReceipts.resolve(w.detail), f._refreshAll(null, !1);
    };
    _(f.dom, "ln-data-store:ready", v), _(f.dom, "ln-data-store:created", v), _(f.dom, "ln-data-store:updated", v), _(f.dom, "ln-data-store:deleted", v), _(f.dom, "ln-data-store:mutation-error", (w) => f._mutationReceipts.reject(w.detail)), _(f.dom, "ln-data-store:synced", (w) => {
      var A;
      (A = w.detail) != null && A.changed && f._refreshAll(w.detail.meta, !1);
    }), _(f.dom, "ln-data-store:query-changed", () => f._refreshAll(null, !0)), _(f.dom, "ln-search:change", (w) => {
      var T;
      w.preventDefault();
      const A = ((T = w.detail) == null ? void 0 : T.term) != null ? w.detail.term : "";
      A !== (f.dom.getAttribute(c) || "") && f.dom.setAttribute(c, A);
    }), _(f.dom, "ln-filter:change", (w) => {
      var O;
      w.preventDefault();
      const A = (O = w.detail) == null ? void 0 : O.key;
      if (!A) return;
      const T = (w.detail.values || []).slice(), L = f._currentQuery().filters, x = L[A];
      if (x ? x.length === T.length && x.every((P, U) => P === T[U]) : !T.length) return;
      T.length ? L[A] = T : delete L[A];
      const D = new URLSearchParams();
      Object.keys(L).forEach((P) => L[P].forEach((U) => D.append(P, U)));
      const I = D.toString();
      I ? f.dom.setAttribute(h, I) : f.dom.removeAttribute(h);
    }), _(f.dom, "ln-sort:change", (w) => {
      var D, I;
      w.preventDefault();
      const A = (D = w.detail) == null ? void 0 : D.field, T = (I = w.detail) == null ? void 0 : I.direction, L = A && T && T !== "none" ? { field: A, direction: T } : null, x = f._currentQuery().sort;
      !x && !L || x && L && x.field === L.field && x.direction === L.direction || (L ? (f.dom.setAttribute(g, L.field), f.dom.setAttribute(l, L.direction)) : (f.dom.removeAttribute(g), f.dom.removeAttribute(l)));
    });
    const S = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), b = f.findChildren().connectorEl;
    if (b) {
      const w = r(b);
      S.add(w), _(f.dom, w + ":connected", y);
    }
    S.forEach((w) => {
      _(f.dom, w + ":fetched", (A) => f._reconcileServerFetch(A.detail)), _(f.dom, w + ":created", (A) => f._reconcileServerMutation("create", A.detail)), _(f.dom, w + ":updated", (A) => f._reconcileServerMutation("update", A.detail)), _(f.dom, w + ":deleted", (A) => f._reconcileServerMutation("ack", A.detail)), _(f.dom, w + ":bulk-deleted", (A) => f._reconcileServerMutation("ack", A.detail)), _(f.dom, w + ":error", (A) => f._reconcileServerMutation("error", A.detail));
    });
  }
  i.prototype._onQueueSend = function(f) {
    this.refreshMapper();
    const d = this.findChildren();
    if (!d.store || !d.connector || !d.queue) return;
    const _ = f.meta || {}, y = r(d.connectorEl), E = f.idempotencyKey || f.entryId, v = {
      create: () => k(d.connectorEl, y + ":request-create", { data: f.payload, url: _.action || null, idempotencyKey: E, meta: { entryId: f.entryId, queued: !0, op: "create", tempId: _.tempId } }),
      update: () => k(d.connectorEl, y + ":request-update", { id: f.targetId, data: f.payload, expected_version: f.expectedVersion, url: _.action || null, idempotencyKey: E, meta: { entryId: f.entryId, queued: !0, op: "update", id: f.targetId } }),
      delete: () => k(d.connectorEl, y + ":request-delete", { id: f.targetId, idempotencyKey: E, meta: { entryId: f.entryId, queued: !0, op: "delete", id: f.targetId } }),
      "bulk-delete": () => {
        var S;
        return k(d.connectorEl, y + ":request-bulk-delete", { ids: ((S = f.payload) == null ? void 0 : S.ids) || [], idempotencyKey: E, meta: { entryId: f.entryId, queued: !0, op: "bulk-delete", bulkKey: _.bulkKey } });
      }
    };
    v[f.op] && v[f.op]();
  }, i.prototype._onFormSubmit = function(f) {
    const d = f.target;
    if (f.defaultPrevented) return;
    const _ = d.hasAttribute(o) ? d.getAttribute(o) : null;
    if (_ === null || (_ ? !this._owns(_) : d.closest("[" + t + "]") !== this.dom)) return;
    const y = qn(d);
    if (y !== "POST" && y !== "PUT" && y !== "PATCH") return;
    f.preventDefault();
    const E = Ke(d);
    delete E._method, delete E._token;
    const v = E.id, S = E.expected_version, b = d.getAttribute("action") || "", w = this.findChildren();
    delete E.id, delete E.expected_version, y === "POST" ? this._fanOutCreate(w, E, b) : this._fanOutUpdate(w, v, E, S, b);
  }, i.prototype._reconcileServerFetch = function(f) {
    if (!f) return;
    const d = f.meta || {}, _ = this.findChildren(), y = f.data;
    this.refreshMapper();
    const E = Array.isArray(y) ? y : (y == null ? void 0 : y.data) || [], v = Array.isArray(y == null ? void 0 : y.deleted) ? y.deleted : [], S = Array.isArray(y) ? Math.floor(Date.now() / 1e3) : (y == null ? void 0 : y.synced_at) ?? (y == null ? void 0 : y.since) ?? Math.floor(Date.now() / 1e3), b = E.map((w) => this.mapper.ingress(w));
    if (!(!_.store || _.store.initializationError)) {
      if (!d.kind) return _.store.applySync(b, v, S, { total: f.total, filtered: f.filtered, offset: f.offset, queryGen: f.queryGen, targetEl: d.targetEl });
      _.store.applyQuery(b, { total: f.total }).then((w) => {
        const A = d.kind;
        A === "table" || A === "list" || A === "chart" ? (k(d.targetEl, "ln-" + A + ":set-loading", { loading: !1 }), k(d.targetEl, "ln-" + A + ":set-data", { data: w, total: f.total ?? w.length, filtered: f.filtered ?? w.length, offset: f.offset, queryGen: d.queryGen }), this._boundDelivered.set(d.targetEl, !0)) : A === "options" ? _.store.getAll({}).then((T) => k(d.targetEl, "ln-options:set-data", { data: T.data })) : A === "stat" && k(d.targetEl, "ln-stat:set-count", { count: f.filtered ?? f.total ?? b.length });
      });
    }
  }, i.prototype._reconcileServerMutation = function(f, d) {
    var E;
    if (!d) return;
    const _ = this.findChildren(), y = d.meta || {};
    if (f === "create") {
      if (!d.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), y);
      const v = this.mapper.ingress(d.record);
      (_.storeEl ? this._requestStoreMutation(_, "update", { id: y.tempId, data: v }) : Promise.resolve()).then(() => {
        y.queued && _.queue && k(_.queueEl, "ln-api-queue:resolve-create", { entryId: y.entryId, oldKey: y.tempId, newId: v.id });
      }).catch((S) => this._reportError("create-reconcile", S, y));
    } else if (f === "update") {
      const v = d.record ? this.mapper.ingress(d.record) : null;
      (_.storeEl && v ? this._requestStoreMutation(_, "update", { id: y.id, data: v }) : Promise.resolve()).then(() => {
        y.queued && _.queue && k(_.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
      }).catch((S) => this._reportError("update-reconcile", S, y));
    } else if (f === "ack")
      y.queued && _.queue && k(_.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
    else if (f === "error") {
      const v = d.status || ((E = d.error) == null ? void 0 : E.status) || 0;
      y.queued && _.queue && k(_.queueEl, "ln-api-queue:nack", { entryId: y.entryId, reason: v === 401 || v === 419 ? "auth" : v === 0 || v >= 500 ? "retry" : "drop" }), _.storeEl && (k(_.storeEl, "ln-data-store:request-sync-failed", { error: d.error || d, status: v }), y.queued || (y.op === "update" && y.snapshot ? k(_.storeEl, "ln-data-store:request-update", { id: y.id, data: y.snapshot }) : y.op === "create" && y.tempId ? k(_.storeEl, "ln-data-store:request-delete", { id: y.tempId }) : y.op === "delete" && y.snapshot && k(_.storeEl, "ln-data-store:request-create", { tempId: y.id, data: y.snapshot }))), this._reportError("connector-error", d.error || d, y);
    }
  }, i.prototype.destroy = function() {
    var f;
    if (this.dom[e]) {
      for (this._destroyed = !0; (f = this._unsubs) != null && f.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function p(f, d) {
    const _ = f[e];
    _ && (d === "data-ln-data-coordinator-mapper" ? _.refreshMapper() : (d === c || d === h || d === g || d === l) && _._queueQueryRefresh());
  }
  H(t, e, i, "ln-data-coordinator", {
    extraAttributes: ["data-ln-data-coordinator-mapper", c, h, g, l],
    onAttributeChange: p
  }), window[e].init = window[e];
})();
const bo = "ln_api_queue", yo = 2, tt = "outbox", at = "_queue_meta";
function dt(t, e) {
  return t.error || new Error(e);
}
function Ht(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function Sn(t) {
  return "seq:" + t;
}
function oe(t) {
  return "paused:" + t;
}
function Cn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function vo(t, e, o) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(o);
}
function wo(t, e, o, c) {
  const h = /* @__PURE__ */ new Map(), g = [], l = [];
  for (const u of t || [])
    h.has(u.chainKey) || h.set(u.chainKey, []), h.get(u.chainKey).push(u);
  return h.forEach((u, a) => {
    u.sort((s, r) => s.seq - r.seq);
    const n = u[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > c) {
        l.push({ chainKey: a, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > c) {
        l.push({ chainKey: a, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = c + o, n.updatedAt = c, g.push(n);
    }
  }), { entries: g, wakeups: l };
}
function Eo(t, e, o, c, h) {
  const g = [], l = [];
  for (const u of t || []) {
    if (u.entryId === e) {
      l.push(u.entryId);
      continue;
    }
    u.chainKey === o && (u.chainKey = c, u.targetId === o && (u.targetId = c), u.meta && u.meta.id === o && (u.meta.id = c), u.meta && typeof u.meta.action == "string" && (u.meta.action = vo(u.meta.action, o, c)), u.updatedAt = h, g.push(u));
  }
  return { changed: g, deleted: l };
}
class Ao {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || bo, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, o) => {
      const c = this.indexedDB.open(this.dbName, yo);
      c.onupgradeneeded = (h) => {
        const g = h.target.result;
        let l;
        g.objectStoreNames.contains(tt) ? l = h.target.transaction.objectStore(tt) : l = g.createObjectStore(tt, { keyPath: "entryId" }), l.indexNames.contains("by_scope_chain") || l.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), l.indexNames.contains("by_scope_seq") || l.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), g.objectStoreNames.contains(at) || g.createObjectStore(at, { keyPath: "key" });
      }, c.onerror = () => o(dt(c, "Queue database open failed")), c.onsuccess = (h) => {
        this._db = h.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, o) => {
      const c = this.indexedDB.deleteDatabase(this.dbName);
      c.onsuccess = () => e(), c.onerror = () => o(dt(c, "Queue database delete failed")), c.onblocked = () => o(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((o) => o ? new Promise((c, h) => {
      const l = o.transaction(tt, "readonly").objectStore(tt).index("by_scope_seq").getAll(Ht(this.keyRange, e));
      l.onsuccess = () => c(l.result || []), l.onerror = () => h(dt(l, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, o) {
    return o = o || {}, this.open().then((c) => c ? new Promise((h, g) => {
      const l = c.transaction([at, tt], "readwrite"), u = l.objectStore(at), a = l.objectStore(tt), n = Sn(e);
      let s = null;
      const r = (m) => {
        const p = m + 1;
        s = {
          entryId: this.uuid(),
          scope: e,
          chainKey: o.chainKey,
          seq: p,
          op: o.op,
          targetId: o.targetId !== void 0 ? o.targetId : null,
          payload: o.payload,
          expectedVersion: o.expectedVersion !== void 0 ? o.expectedVersion : null,
          meta: o.meta || {},
          attempts: 0,
          nextAttemptAt: 0,
          status: "pending",
          leaseOwner: null,
          leaseUntil: 0,
          createdAt: this.now(),
          updatedAt: this.now()
        }, u.put({ key: n, value: p }), a.put(s);
      }, i = u.get(n);
      i.onerror = () => g(dt(i, "Queue sequence read failed")), i.onsuccess = () => {
        const m = i.result;
        if (m && typeof m.value == "number") {
          r(m.value);
          return;
        }
        const p = a.index("by_scope_seq").getAll(Ht(this.keyRange, e));
        p.onerror = () => g(dt(p, "Queue sequence migration failed")), p.onsuccess = () => {
          const f = (p.result || []).reduce((d, _) => Math.max(d, _.seq || 0), 0);
          r(f);
        };
      }, l.oncomplete = () => h(s), l.onerror = () => g(l.error || new Error("Queue enqueue transaction failed")), l.onabort = () => g(l.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, o, c) {
    return this.open().then((h) => h ? new Promise((g, l) => {
      const u = h.transaction(tt, "readwrite"), a = u.objectStore(tt), n = a.index("by_scope_seq").getAll(Ht(this.keyRange, e)), s = this.now();
      let r = { entries: [], wakeups: [] };
      n.onerror = () => l(dt(n, "Queue claim read failed")), n.onsuccess = () => {
        r = wo(n.result || [], o, c, s);
        for (const i of r.entries) a.put(i);
      }, u.oncomplete = () => g(r), u.onerror = () => l(u.error || new Error("Queue claim transaction failed")), u.onabort = () => l(u.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, o) {
    return this._updateEntry(e, o, (c, h) => (h.delete(c.entryId), { status: "acked", entry: c }));
  }
  nack(e, o, c, h) {
    h = h || {};
    const g = h.maxAttempts || 8, l = h.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((u) => u ? new Promise((a, n) => {
      const s = u.transaction([tt, at], "readwrite"), r = s.objectStore(tt), i = s.objectStore(at), m = r.get(o);
      let p = null;
      m.onerror = () => n(dt(m, "Queue nack read failed")), m.onsuccess = () => {
        const f = m.result;
        if (!(!f || f.scope !== e)) {
          if (c === "drop") {
            r.delete(f.entryId), p = { status: "dropped", entry: f };
            return;
          }
          if (Cn(f), f.updatedAt = this.now(), c === "auth") {
            f.status = "pending", r.put(f), i.put({ key: oe(e), value: "auth" }), p = { status: "auth", entry: f };
            return;
          }
          if (c === "retry") {
            if (f.attempts = (f.attempts || 0) + 1, f.attempts >= g) {
              f.status = "failed", f.nextAttemptAt = 0, r.put(f), p = { status: "failed", entry: f };
              return;
            }
            const d = l[Math.min(f.attempts - 1, l.length - 1)];
            f.status = "pending", f.nextAttemptAt = this.now() + d, r.put(f), p = { status: "retry", entry: f, delay: d };
          }
        }
      }, s.oncomplete = () => a(p), s.onerror = () => n(s.error || new Error("Queue nack transaction failed")), s.onabort = () => n(s.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, o, c) {
    return this._remapTransaction(e, null, o, c);
  }
  resolveCreate(e, o, c, h) {
    return this._remapTransaction(e, o, c, h);
  }
  _remapTransaction(e, o, c, h) {
    return this.open().then((g) => g ? new Promise((l, u) => {
      const a = g.transaction(tt, "readwrite"), n = a.objectStore(tt), s = n.index("by_scope_seq").getAll(Ht(this.keyRange, e));
      let r = { changed: [], deleted: [] };
      s.onerror = () => u(dt(s, "Queue remap read failed")), s.onsuccess = () => {
        r = Eo(s.result || [], o, c, h, this.now());
        for (const i of r.deleted) n.delete(i);
        for (const i of r.changed) n.put(i);
      }, a.oncomplete = () => l(r.changed), a.onerror = () => u(a.error || new Error("Queue remap transaction failed")), a.onabort = () => u(a.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((o) => o ? new Promise((c, h) => {
      const g = o.transaction(tt, "readwrite"), l = g.objectStore(tt), u = l.index("by_scope_seq").getAll(Ht(this.keyRange, e));
      let a = 0;
      u.onerror = () => h(dt(u, "Queue failed-entry read failed")), u.onsuccess = () => {
        for (const n of u.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), Cn(n), l.put(n), a++);
      }, g.oncomplete = () => c(a), g.onerror = () => h(g.error || new Error("Queue failed-entry reset failed")), g.onabort = () => h(g.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((o) => o ? new Promise((c, h) => {
      const l = o.transaction(at, "readonly").objectStore(at).get(oe(e));
      l.onsuccess = () => {
        const u = l.result ? l.result.value : !1;
        c(u || !1);
      }, l.onerror = () => h(dt(l, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, o) {
    return this.open().then((c) => {
      if (c)
        return new Promise((h, g) => {
          const l = c.transaction(at, "readwrite"), u = typeof o == "string" ? o : o ? "manual" : !1;
          l.objectStore(at).put({ key: oe(e), value: u }), l.oncomplete = () => h(), l.onerror = () => g(l.error || new Error("Queue pause-state write failed")), l.onabort = () => g(l.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((o) => {
      if (o)
        return new Promise((c, h) => {
          const g = o.transaction([tt, at], "readwrite"), u = g.objectStore(tt).index("by_scope_seq").openCursor(Ht(this.keyRange, e));
          u.onsuccess = (a) => {
            const n = a.target.result;
            n && (n.delete(), n.continue());
          }, u.onerror = () => h(dt(u, "Queue clear failed")), g.objectStore(at).delete(Sn(e)), g.objectStore(at).delete(oe(e)), g.oncomplete = () => c(), g.onerror = () => h(g.error || new Error("Queue clear transaction failed")), g.onabort = () => h(g.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, o, c) {
    return this.open().then((h) => h ? new Promise((g, l) => {
      const u = h.transaction(tt, "readwrite"), a = u.objectStore(tt), n = a.get(o);
      let s = null;
      n.onerror = () => l(dt(n, "Queue entry read failed")), n.onsuccess = () => {
        const r = n.result;
        !r || r.scope !== e || (s = c(r, a));
      }, u.oncomplete = () => g(s), u.onerror = () => l(u.error || new Error("Queue entry transaction failed")), u.onabort = () => l(u.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", o = [2e3, 5e3, 15e3, 6e4, 3e5], c = 8, h = 6e4;
  if (window[e] !== void 0) return;
  function g(n) {
    const s = n[e];
    s && s._drain();
  }
  const l = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: g, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, u = new Ao({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: wt
  });
  function a(n) {
    this.dom = n, n[e] = this;
    const s = n.closest("[data-ln-data-coordinator]");
    this.scope = n.id || (s ? s.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = wt(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const r = this;
    return u.open().then((i) => i ? u.getPaused(r.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((i) => {
      if (r._paused = !!i, r._paused) {
        const m = typeof i == "string" ? i : "auth";
        k(r.dom, "ln-api-queue:paused", { reason: m, restored: !0 });
      }
      return r._emitPendingCount();
    }).then(() => r._drain()).catch((i) => {
      console.error("[ln-api-queue] Initialization failed:", i), k(r.dom, "ln-api-queue:error", { operation: "initialize", error: i });
    }), this;
  }
  a.prototype._isOnline = function() {
    const n = this.dom.getAttribute("data-ln-api-queue-online");
    return n === "true" ? !0 : n === "false" ? !1 : navigator.onLine;
  }, a.prototype._emitPendingCount = function() {
    const n = this;
    return u.allForScope(n.scope).then((s) => (k(n.dom, "ln-api-queue:pending-count", { count: s.length, scope: n.scope }), s.length === 0 && k(n.dom, "ln-api-queue:drained", { scope: n.scope }), s));
  }, a.prototype._clearTimer = function(n) {
    const s = this._timers.get(n);
    s && (clearTimeout(s), this._timers.delete(n));
  }, a.prototype._scheduleTimer = function(n, s) {
    const r = Math.max(0, s), i = this._timers.get(n);
    i && clearTimeout(i);
    const m = this, p = setTimeout(() => {
      m._timers.delete(n), m._drain();
    }, r);
    this._timers.set(n, p);
  }, a.prototype._drain = function() {
    const n = this;
    return n._paused || !n._isOnline() ? Promise.resolve() : (n._drainPromise || (n._drainPromise = u.claimReady(n.scope, n._workerId, h).then((s) => {
      for (const r of s.wakeups)
        n._scheduleTimer(r.chainKey, r.at - Date.now());
      for (const r of s.entries)
        n._clearTimer(r.chainKey), k(n.dom, "ln-api-queue:send", {
          entryId: r.entryId,
          chainKey: r.chainKey,
          op: r.op,
          targetId: r.targetId,
          payload: r.payload,
          expectedVersion: r.expectedVersion,
          idempotencyKey: r.entryId,
          meta: r.meta
        });
    }).catch((s) => {
      console.error("[ln-api-queue] Drain failed:", s), k(n.dom, "ln-api-queue:error", { operation: "drain", error: s });
    }).finally(() => {
      n._drainPromise = null;
    })), n._drainPromise);
  }, a.prototype._onEnqueue = function(n) {
    const s = this;
    return u.enqueue(s.scope, n.detail || {}).then((r) => {
      if (r)
        return s._emitPendingCount().then((i) => (k(s.dom, "ln-api-queue:enqueued", {
          entryId: r.entryId,
          chainKey: r.chainKey,
          count: i.length
        }), s._drain()));
    }).catch((r) => {
      k(s.dom, "ln-api-queue:error", { operation: "enqueue", error: r });
    });
  }, a.prototype._onAck = function(n) {
    const s = this, r = n.detail || {};
    return u.ack(s.scope, r.entryId).then(() => s._emitPendingCount()).then(() => s._drain()).catch((i) => {
      k(s.dom, "ln-api-queue:error", { operation: "ack", entryId: r.entryId, error: i });
    });
  }, a.prototype._onNack = function(n) {
    const s = this, r = n.detail || {};
    return u.nack(s.scope, r.entryId, r.reason, {
      maxAttempts: c,
      backoff: o
    }).then((i) => {
      if (i)
        return i.status === "failed" ? k(s.dom, "ln-api-queue:failed", {
          entryId: i.entry.entryId,
          chainKey: i.entry.chainKey,
          attempts: i.entry.attempts
        }) : i.status === "retry" ? s._scheduleTimer(i.entry.chainKey, i.delay) : i.status === "auth" && (s._paused = !0, k(s.dom, "ln-api-queue:paused", { reason: "auth" }), k(s.dom, "ln-api-queue:auth-required", {
          entryId: i.entry.entryId,
          chainKey: i.entry.chainKey
        })), s._emitPendingCount().then(() => {
          if (i.status === "dropped") return s._drain();
        });
    }).catch((i) => {
      k(s.dom, "ln-api-queue:error", { operation: "nack", entryId: r.entryId, error: i });
    });
  }, a.prototype._onRemap = function(n) {
    const s = this, r = n.detail || {};
    return u.remap(s.scope, r.oldKey, r.newId).catch((i) => {
      k(s.dom, "ln-api-queue:error", { operation: "remap", error: i });
    });
  }, a.prototype._onResolveCreate = function(n) {
    const s = this, r = n.detail || {};
    return u.resolveCreate(s.scope, r.entryId, r.oldKey, r.newId).then(() => s._emitPendingCount()).then(() => s._drain()).catch((i) => {
      k(s.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: r.entryId,
        error: i
      });
    });
  }, a.prototype._onResume = function() {
    const n = this;
    return u.setPaused(n.scope, !1).then(() => (n._paused = !1, k(n.dom, "ln-api-queue:resumed", {}), n._drain())).catch((s) => {
      k(n.dom, "ln-api-queue:error", { operation: "resume", error: s });
    });
  }, a.prototype._onPause = function() {
    const n = this;
    return u.setPaused(n.scope, "manual").then(() => {
      n._paused = !0, k(n.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((s) => {
      k(n.dom, "ln-api-queue:error", { operation: "pause", error: s });
    });
  }, a.prototype._onDrain = function() {
    const n = this;
    return u.resetFailed(n.scope).then(() => {
      const s = n._drainPromise;
      return s ? s.then(() => n._drain()) : n._drain();
    }).catch((s) => {
      k(n.dom, "ln-api-queue:error", { operation: "manual-drain", error: s });
    });
  }, a.prototype._onClear = function() {
    const n = this;
    return n._timers.forEach((s) => clearTimeout(s)), n._timers.clear(), u.clear(n.scope).then(() => {
      n._paused = !1, k(n.dom, "ln-api-queue:pending-count", { count: 0, scope: n.scope }), k(n.dom, "ln-api-queue:drained", { scope: n.scope });
    }).catch((s) => {
      k(n.dom, "ln-api-queue:error", { operation: "clear", error: s });
    });
  }, a.prototype._bindEvents = function() {
    const n = this;
    n._handlers = {
      enqueue: (s) => n._onEnqueue(s),
      ack: (s) => n._onAck(s),
      nack: (s) => n._onNack(s),
      remap: (s) => n._onRemap(s),
      resolveCreate: (s) => n._onResolveCreate(s),
      resume: () => n._onResume(),
      pause: () => n._onPause(),
      drain: () => n._onDrain(),
      clear: () => n._onClear()
    }, n.dom.addEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.addEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.addEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.addEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.addEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.addEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.addEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.addEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.addEventListener("ln-api-queue:request-clear", n._handlers.clear);
  }, a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n.dom.removeEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.removeEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.removeEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.removeEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.removeEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.removeEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.removeEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.removeEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.removeEventListener("ln-api-queue:request-clear", n._handlers.clear), window.removeEventListener("online", n._onlineHandler), n._timers.forEach((s) => clearTimeout(s)), n._timers.clear(), delete n.dom[e];
  }, H(t, e, a, "ln-api-queue", {
    attributes: l
  });
})();
function Li(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function zt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function So(t, e, o) {
  const c = Li(t);
  return c === null || c < 0 ? 0 : Math.min(c, Math.min(e, o) / 2);
}
function Co(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((o) => !Number.isFinite(o)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function To(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), o = e[0].trim();
  return o ? {
    field: o,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function ko(t, e) {
  e = e || {};
  const o = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, c = e.xField || "label", h = e.yField || "value", g = e.includeZero !== !1, l = So(e.padding, o.width, o.height), u = Array.isArray(t) ? t : [], a = [];
  for (let v = 0; v < u.length; v++) {
    const S = u[v] || {}, b = Li(S[h]);
    b !== null && a.push({
      record: S,
      sourceIndex: v,
      label: S[c] == null ? String(v + 1) : String(S[c]),
      value: b
    });
  }
  if (a.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: o.y + o.height - l
    };
  let n = a[0].value, s = a[0].value;
  for (let v = 1; v < a.length; v++)
    a[v].value < n && (n = a[v].value), a[v].value > s && (s = a[v].value);
  let r = n, i = s;
  g && (r = Math.min(0, r), i = Math.max(0, i)), r === i && (i === 0 ? i = 1 : i > 0 ? r = 0 : i = 0);
  const m = Math.max(1, o.width - l * 2), p = Math.max(1, o.height - l * 2), f = i - r, d = o.y + o.height - l - (0 - r) / f * p, _ = [];
  for (let v = 0; v < a.length; v++) {
    const S = a[v], b = a.length === 1 ? 0.5 : v / (a.length - 1), w = o.x + l + b * m, A = o.y + o.height - l - (S.value - r) / f * p;
    _.push({
      record: S.record,
      sourceIndex: S.sourceIndex,
      label: S.label,
      value: S.value,
      x: w,
      y: A,
      pointString: zt(w) + "," + zt(A)
    });
  }
  const y = _.map((v) => v.pointString).join(" ");
  let E = "";
  if (_.length > 0) {
    const v = _[0], S = _[_.length - 1], b = zt(v.x) + "," + zt(d), w = zt(S.x) + "," + zt(d);
    E = b + " " + y + " " + w;
  }
  return {
    points: _,
    linePoints: y,
    areaPoints: E,
    count: _.length,
    min: n,
    max: s,
    domainMin: r,
    domainMax: i,
    baselineY: d
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", o = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function c(n) {
    const s = n[e];
    s && s.requestData();
  }
  function h(n) {
    const s = n[e];
    s && s._render();
  }
  const g = {
    "data-ln-chart": { prop: "name", type: "string", read: j, fallback: "", effect: h, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: c, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: c, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: h, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: h, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: h, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: h, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: h, description: "Forces Y axis scale to start at zero" }
  }, l = Y(g);
  function u(n, s) {
    n && (n.textContent = s);
  }
  function a(n) {
    this.dom = n, X(this, n, l), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const s = this;
    return this._onSetData = function(r) {
      const i = r.detail || {};
      s._data = Array.isArray(i.data) ? i.data : [], s.isLoaded = !0, s._setLoading(!1), s._render();
    }, this._onSetLoading = function(r) {
      s._setLoading(!!(r.detail && r.detail.loading));
    }, this._onRefresh = function() {
      s.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  a.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), s = n === null ? NaN : Number(n), r = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(s) && s >= 0 ? s : 16,
      type: r === "area" || r === "polygon" ? "area" : "line",
      viewBox: this.plot && Co(this.plot.getAttribute("viewBox")) || o
    };
  }, a.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, a.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const s = this.name + "-label", r = '[data-ln-template="' + s + '"]';
    if (!this.dom.querySelector(r) && !document.querySelector(r)) return;
    const i = st(this.dom, s, "ln-chart");
    if (!i) return;
    const m = Z(this.dom);
    for (const p of n.points) {
      const f = i.cloneNode(!0);
      Zt(f, {
        label: p.label,
        value: ot(p.value, m)
      }), this.labels.appendChild(f);
    }
  }, a.prototype._render = function() {
    const n = this._readOptions(), s = ko(this._data, n);
    this.model = s, this.line && (this.line.setAttribute("points", s.linePoints), this.line.toggleAttribute("hidden", s.count === 0)), this.area && (this.area.setAttribute("points", s.areaPoints), this.area.toggleAttribute("hidden", s.count === 0 || n.type !== "area"));
    const r = s.count === 0;
    this.dom.classList.toggle("ln-chart--empty", r), this.empty && this.empty.toggleAttribute("hidden", !r);
    const i = Z(this.dom);
    u(this.minimum, ot(s.min, i)), u(this.maximum, ot(s.max, i)), u(this.count, ot(s.count, i)), this._renderLabels(s), k(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: s.count,
      min: s.min,
      max: s.max
    });
  }, a.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, k(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: To(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, H(t, e, a, "ln-chart", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-options": { prop: "_storeName", type: "string", read: j, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: j, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: j, fallback: "name", description: "Field name used for option visible label text" }
  }, c = Y(o);
  function h(g) {
    this.dom = g, X(this, g, c);
    const l = this;
    return this._onSetData = function(u) {
      u.detail && l._rebuild(u.detail.data || []);
    }, g.addEventListener("ln-options:set-data", this._onSetData), k(g, "ln-options:request-data", { options: this._storeName }), this;
  }
  h.prototype._rebuild = function(g) {
    const l = this.dom, u = this._valueField, a = this._labelField, n = l.getAttribute("data-ln-value") || l.value, s = l.querySelectorAll("option");
    for (let i = s.length - 1; i >= 0; i--)
      s[i].value !== "" && l.removeChild(s[i]);
    for (let i = 0; i < g.length; i++) {
      const m = g[i], p = document.createElement("option");
      p.value = String(m[u]), p.textContent = m[a] != null ? m[a] : "", l.appendChild(p);
    }
    const r = l.options;
    for (let i = 0; i < r.length; i++)
      if (r[i].value === String(n)) {
        l.value = String(n);
        break;
      }
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, H(t, e, h, "ln-options", {
    attributes: o
  });
})();
function Lo(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const o = t.slice(0, e).trim(), c = t.slice(e + 1).trim();
  if (!o) return null;
  const h = {};
  return h[o] = [c], h;
}
function qo(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: j, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: j, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, c = Y(o);
  function h(g) {
    return this.dom = g, X(this, g, c), this._onSetCount = function(l) {
      g.textContent = qo(l.detail && l.detail.count), g.classList.remove("is-loading");
    }, g.addEventListener("ln-stat:set-count", this._onSetCount), k(g, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Lo(this._filterRaw)
    }), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, H(t, e, h, "ln-stat", {
    attributes: o
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", o = "#ln-icon-custom-", c = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set();
  let g = null;
  const l = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), u = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), a = "lni:", n = "lni:v", s = "1";
  function r() {
    try {
      if (localStorage.getItem(n) !== s) {
        for (let y = localStorage.length - 1; y >= 0; y--) {
          const E = localStorage.key(y);
          E && E.indexOf(a) === 0 && localStorage.removeItem(E);
        }
        localStorage.setItem(n, s);
      }
    } catch {
    }
  }
  r();
  function i() {
    return g || (g = document.getElementById(t), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = t, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function m(y) {
    return y.indexOf(o) === 0 ? u + "/" + y.slice(o.length) + ".svg" : l + "/" + y.slice(e.length) + ".svg";
  }
  function p(y, E) {
    const v = E.match(/viewBox="([^"]+)"/), S = v ? v[1] : "0 0 24 24", b = E.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), w = b ? b[1].trim() : "", A = E.match(/<svg([^>]*)>/i), T = A ? A[1] : "", L = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    L.id = y, L.setAttribute("viewBox", S), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(x) {
      const D = T.match(new RegExp(x + '="([^"]*)"'));
      D && L.setAttribute(x, D[1]);
    }), L.innerHTML = w, i().querySelector("defs").appendChild(L);
  }
  function f(y) {
    if (c.has(y) || h.has(y)) return;
    if (y.indexOf(o) === 0 && !u) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", y);
      return;
    }
    const E = y.slice(1);
    try {
      const S = localStorage.getItem(a + E);
      if (S) {
        p(E, S), c.add(y);
        return;
      }
    } catch {
    }
    h.add(y);
    const v = m(y);
    fetch(v).then(function(S) {
      if (!S.ok) throw new Error(S.status);
      return S.text();
    }).then(function(S) {
      p(E, S), c.add(y), h.delete(y);
      try {
        localStorage.setItem(a + E, S);
      } catch {
      }
    }).catch(function(S) {
      console.error("[ln-icon] Fetch failed for:", E, S), h.delete(y);
    });
  }
  function d(y) {
    const E = 'use[href^="' + e + '"], use[href^="' + o + '"]', v = y.querySelectorAll ? y.querySelectorAll(E) : [];
    if (y.matches && y.matches(E)) {
      const S = y.getAttribute("href");
      S && f(S);
    }
    Array.prototype.forEach.call(v, function(S) {
      const b = S.getAttribute("href");
      b && f(b);
    });
  }
  function _() {
    d(document), ft(function() {
      te({
        onInit: function(y) {
          d(y);
        }
      }), Pt(["href"], function(y) {
        if ((y.tagName ? y.tagName.toLowerCase() : "") === "use") {
          const v = y.getAttribute("href");
          v && (v.indexOf(e) === 0 || v.indexOf(o) === 0) && f(v);
        }
      });
    }, "ln-icon");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", _) : _();
})();
const en = /* @__PURE__ */ new Set([
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
  "data-ln-data-store-seed",
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
  "data-ln-external-links-hint",
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
  "data-ln-key-map",
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
  "data-ln-table-dict",
  "data-ln-table-empty",
  "data-ln-table-empty-when",
  "data-ln-table-filter-col",
  "data-ln-table-filtered",
  "data-ln-table-loading",
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
function xo(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const o = [];
  for (let c = 0; c <= e.length; c++) o[c] = [c];
  for (let c = 0; c <= t.length; c++) o[0][c] = c;
  for (let c = 1; c <= e.length; c++)
    for (let h = 1; h <= t.length; h++)
      e.charAt(c - 1) === t.charAt(h - 1) ? o[c][h] = o[c - 1][h - 1] : o[c][h] = Math.min(
        o[c - 1][h - 1] + 1,
        o[c][h - 1] + 1,
        o[c - 1][h] + 1
      );
  return o[e.length][t.length];
}
function Io(t, e = en) {
  if (e.has(t)) return null;
  let o = null, c = 1 / 0;
  const h = Math.max(3, Math.floor(t.length * 0.4));
  for (const g of e) {
    if (Math.abs(t.length - g.length) > 3 || Math.abs(t.length - g.length) >= c) continue;
    const l = xo(t, g);
    l < c && (c = l, o = g);
  }
  return c <= h ? o : null;
}
function qi(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function Ro(t = document) {
  const e = t.ownerDocument || t, o = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!o) return [];
  const c = [], h = [o, ...o.querySelectorAll("*")];
  for (let g = 0; g < h.length; g++) {
    const l = h[g];
    if (l.attributes)
      for (let u = 0; u < l.attributes.length; u++) {
        const a = l.attributes[u];
        if (a.name.startsWith("data-ln-") && a.name.endsWith("-for")) {
          const n = (a.value || "").trim();
          if (!n) {
            c.push({
              type: "id-empty",
              element: l,
              attribute: a.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${l.tagName.toLowerCase()} ${a.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + qi(n)) || c.push({
            type: "id-unresolved",
            element: l,
            attribute: a.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${l.tagName.toLowerCase()} ${a.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return c;
}
function Do(t = document) {
  const e = t.ownerDocument || t, o = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!o) return [];
  const c = [], h = [o, ...o.querySelectorAll("*")];
  for (let g = 0; g < h.length; g++) {
    const l = h[g];
    if (l.attributes)
      for (let u = 0; u < l.attributes.length; u++) {
        const a = l.attributes[u];
        if (a.name.startsWith("data-ln-") && (a.name.endsWith("-source") || a.name.endsWith("-store")) && a.name !== "data-ln-data-store") {
          const s = (a.value || "").trim();
          if (!s) {
            c.push({
              type: "store-empty",
              element: l,
              attribute: a.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${a.name}="">.`
            });
            continue;
          }
          const r = qi(s), i = e.querySelector(`[data-ln-data-store="${r}"], [data-ln-store="${r}"]`), m = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(s);
          !i && !m && c.push({
            type: "store-unresolved",
            element: l,
            attribute: a.name,
            storeName: s,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${a.name}="${s}"> targets store "${s}", but no [data-ln-data-store="${s}"] exists in the document.`
          });
        }
      }
  }
  return c;
}
function Oo(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const o = [], c = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && c.unshift(e);
  const h = /* @__PURE__ */ new Map();
  for (let g = 0; g < c.length; g++) {
    const l = c[g], u = (l.getAttribute("data-ln-data-store") || "").trim();
    u && (h.has(u) || h.set(u, []), h.get(u).push(l));
  }
  for (const [g, l] of h.entries())
    l.length > 1 && o.push({
      type: "store-duplicate",
      storeName: g,
      elements: l,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${g}". Store names must be unique across the document.`
    });
  return o;
}
function No(t = typeof document < "u" ? document : null, e = en) {
  const o = t && (t.nodeType === 9 ? t.body || t.documentElement : t);
  if (!o) return [];
  const c = [], h = [o, ...o.querySelectorAll("*")];
  for (let g = 0; g < h.length; g++) {
    const l = h[g];
    if (l.attributes)
      for (let u = 0; u < l.attributes.length; u++) {
        const a = l.attributes[u];
        if (!a.name.startsWith("data-ln-") || e.has(a.name)) continue;
        const n = Io(a.name, e);
        c.push({
          type: "attribute-unknown",
          element: l,
          attribute: a.name,
          suggestion: n,
          message: `[ln-debug] Unknown attribute "${a.name}" on <${l.tagName.toLowerCase()}>.${n ? ` Did you mean "${n}"?` : ""}`
        });
      }
  }
  return c;
}
function Pe(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const o = e.validAttributes || en, c = Ro(t), h = Do(t), g = Oo(t), l = No(t, o), u = [
    ...c,
    ...h,
    ...g,
    ...l
  ];
  if (!e.silent)
    for (let a = 0; a < u.length; a++)
      console.warn(u[a].message);
  return {
    idIssues: c,
    storeIssues: h,
    uniquenessIssues: g,
    spellingIssues: l,
    total: u.length
  };
}
let Ce = null;
function se(t = typeof document < "u" ? document : null, e = 50, o = null) {
  if (!t || !Be()) return;
  clearTimeout(Ce);
  const c = () => {
    Ce = setTimeout(() => {
      Ce = null;
      const h = Pe(t);
      o && o(h);
    }, e);
  };
  if (Un() > 0) return ut(c);
  c();
}
function Mo(t, e, o, c) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", o), console.log("detail", c), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", o), console.log("old → new", c.oldValue, "→", c.newValue), console.groupEnd());
}
let Nt = [];
function Po() {
  Nt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Nt.push(document.body);
}
function xi(t) {
  if (t === window || t === document)
    return Nt.indexOf(document.body) !== -1;
  for (let e = 0; e < Nt.length; e++)
    if (Nt[e].contains(t)) return !0;
  return !1;
}
function Fo(t, e, o, c) {
  xi(o) && Mo(t, e, o, c);
}
function Fe() {
  Po(), Wi(Nt.length > 0 ? Fo : null, Nt.length > 0 ? xi : null);
}
function Tn() {
  Fe();
}
function Bo() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, ft(function() {
    Fe(), Pt(["data-ln-debug"], Fe);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const o = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Bo();
  function c(g) {
    return this.dom = g, se(g), Tn(), this;
  }
  c.prototype.verify = function(g, l) {
    return Pe(g || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, c.prototype.destroy = function() {
    delete this.dom[e], Tn();
  };
  const h = H(t, e, c, "ln-debug", {
    attributes: o,
    onInit: (g) => se(g),
    onSubtreeChange: (g) => se(g)
  });
  h.verify = function(g, l) {
    return Pe(g || document, l);
  }, h.schedule = function(g, l, u) {
    return se(g || document, l, u);
  };
})();
