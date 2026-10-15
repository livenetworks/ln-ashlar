function yn() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function qe(t) {
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
      let d = null;
      for (let f = 1; f < e.length; f++)
        if (e[f] && e[f].nodeType === 1) {
          d = e[f];
          break;
        }
      if (!qe(d))
        return;
    }
    t.apply(console, e);
  };
}
function Pi(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function Hi(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function k(t, e, i) {
  const d = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: d
  }));
}
function Q(t, e, i) {
  const d = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, d);
  const f = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: d
  });
  return t.dispatchEvent(f), f;
}
function vn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const d = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  d[i] = t.name, k(t.dom, e, d);
}
function ct(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      ct(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function Gt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function De(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Ui(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Re(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function zi(t, e) {
  return !t || !document.contains(t) || Re(t) || e && typeof t[e] != "function" ? !1 : Gt(t);
}
function wn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function At(t) {
  return t.hasAttribute("value") ? t.getAttribute("value") : t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.textContent.trim();
}
function En(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Oe(t, e) {
  const i = !!(e && e.typed), d = e && e.exclude, f = {}, p = t.elements, l = {};
  if (i)
    for (let c = 0; c < p.length; c++) {
      const s = p[c];
      s.name && s.type === "checkbox" && !s.disabled && (l[s.name] = (l[s.name] || 0) + 1);
    }
  for (let c = 0; c < p.length; c++) {
    const s = p[c];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button") && !(d && s.matches && s.matches(d)))
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
function Ki(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function Ne(t, e) {
  const i = t.elements, d = [], f = {};
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
        const n = String(s).split(",").map(function(u) {
          return u.trim();
        });
        l.checked = n.indexOf(l.value) !== -1;
      } else
        l.checked = Ki(s);
      d.push(l);
    } else if (l.type === "radio")
      l.checked = l.value === String(s), d.push(l);
    else if (l.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < l.options.length; n++)
          l.options[n].selected = s.indexOf(l.options[n].value) !== -1;
      d.push(l);
    } else
      l.value = s, l.tagName === "SELECT" && s != null && l.setAttribute("data-ln-value", s), d.push(l);
  }
  return d;
}
function Me(t, e, { get: i, set: d }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(f) {
      d ? d.call(this, f, (p) => e.set.call(this, p)) : e.set.call(this, f);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = Ne, window.lnCore.serializeForm = Oe, window.lnCore.resolveFormMethod = En);
function Ct(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Kt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function An(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const Sn = {};
function ji(t, e) {
  Sn[t] = e;
}
function Wi(t) {
  return Sn[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = ji, window.lnCore.getDataMapper = Wi);
function J(t) {
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return i ? i.trim() : "en-US";
}
function ue() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, ct(function() {
    new MutationObserver(function() {
      k(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const Cn = {};
function Tn(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  Cn[i] = e;
}
function Rt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return Cn[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = Tn, window.lnCore.getLocaleFallback = Rt, window.lnCore.ensureLocaleObserver = ue);
const he = {};
function ae(t, e) {
  he[t] || (he[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const i = he[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Lt(t, e, i) {
  if (t) {
    const d = t.querySelector('[data-ln-template="' + e + '"]');
    if (d) return d.content.cloneNode(!0);
  }
  return ae(e, i);
}
function ft(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let l = 0; l < i.length; l++) {
    const c = i[l], s = c.getAttribute("data-ln-field");
    e[s] != null && (c.textContent = e[s]);
  }
  const d = t.querySelectorAll("[data-ln-attr]");
  for (let l = 0; l < d.length; l++) {
    const c = d[l], s = c.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < s.length; n++) {
      const u = s[n].trim().split(":");
      if (u.length !== 2) continue;
      const g = u[0].trim(), r = u[1].trim();
      e[r] != null && c.setAttribute(g, e[r]);
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
      const u = s[n].trim().split(":");
      if (u.length !== 2) continue;
      const g = u[0].trim(), r = u[1].trim();
      r in e && c.classList.toggle(g, !!e[r]);
    }
  }
  return t;
}
function Vi(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let d = 0; d < i.length; d++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[d], e ?? null), i[d].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      ft(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let i = 0; i < e.length; i++)
        e[i].textContent = "";
    }
})));
function Zt(t, e) {
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
  const d = function(p, l) {
    return e[l] !== void 0 ? e[l] : "";
  }, f = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && f.push(t);
  for (let p = 0; p < f.length; p++) {
    const l = f[p], c = l.attributes;
    for (let s = 0; s < c.length; s++) {
      const n = c[s];
      n.value.indexOf("{{") !== -1 && l.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, d));
    }
  }
  return t;
}
function Gi(t, e, i, d, f, p) {
  const l = {};
  for (let s = 0; s < t.children.length; s++) {
    const n = t.children[s], u = n.getAttribute("data-ln-render-key");
    u && (l[u] = n);
  }
  const c = document.createDocumentFragment();
  for (let s = 0; s < e.length; s++) {
    const n = e[s], u = String(d(n));
    let g = l[u];
    if (g)
      f(g, n, s);
    else {
      const r = ae(i, p);
      if (!r || (Zt(r, n), g = r.firstElementChild, !g)) continue;
      g.setAttribute("data-ln-render-key", u), f(g, n, s);
    }
    c.appendChild(g);
  }
  t.textContent = "", t.appendChild(c);
}
function kn(t, e) {
  const i = {}, d = t.querySelectorAll("[" + e + "]");
  for (let f = 0; f < d.length; f++)
    i[d[f].getAttribute(e)] = d[f].textContent, d[f].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Zt, window.lnCore.fill = ft, window.lnCore.lnFill = Vi, window.lnCore.renderList = Gi);
function j(t, e, i) {
  const d = t.getAttribute(e);
  return d === null ? i : d;
}
function xt(t, e, i) {
  const d = parseInt(t.getAttribute(e), 10);
  return isNaN(d) ? i : d;
}
function It(t, e, i = !1) {
  const d = t.getAttribute(e);
  if (d === null) return !!i;
  const f = d.trim().toLowerCase();
  return !(f === "false" || f === "0");
}
function Fe(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const pe = /* @__PURE__ */ new Map();
function Ln(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (pe.has(i)) return pe.get(i);
  const d = new Set(t || []), f = function(p, l) {
    const c = p.getAttribute(l);
    return c !== null && d.has(c) ? c : e;
  };
  return pe.set(i, f), f;
}
function xn(t, e, i) {
  const d = parseFloat(t.getAttribute(e));
  return isNaN(d) ? i : d;
}
function In(t, e, i) {
  const d = t.getAttribute(e);
  if (!d) return i;
  try {
    return JSON.parse(d);
  } catch {
    return i;
  }
}
function qn(t, e, i, d, f) {
  if (!t || e === null) return !0;
  const p = d || "ln-component", l = t.type;
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
  for (const d in i) {
    const [f, p, l] = i[d];
    Object.defineProperty(t, d, {
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
    const d = t[i];
    if (!d || !d.prop) continue;
    let f = d.read;
    if (!f && d.type)
      switch (d.type) {
        case "enum":
          f = Ln(d.values, d.fallback);
          break;
        case "integer":
          f = xt;
          break;
        case "float":
          f = xn;
          break;
        case "boolean":
          f = It;
          break;
        case "list":
          f = Fe;
          break;
        case "json":
          f = In;
          break;
        case "string":
        default:
          f = j;
          break;
      }
    f || (f = j), e[d.prop] = [f, i, d.fallback];
  }
  return e;
}
function $i(t) {
  const e = {};
  for (const i in t) {
    const d = t[i];
    d && d.effect && (e[i] = d.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Qi(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = Y, window.lnCore.attrSpec = X, window.lnCore.attrStr = j, window.lnCore.attrInt = xt, window.lnCore.attrBool = It, window.lnCore.attrList = Fe, window.lnCore.attrEnum = Ln, window.lnCore.attrFloat = xn, window.lnCore.attrJson = In);
function $t(t, e) {
  if (!t[e.attribute]) {
    window.lnCore._persistSink && t.hasAttribute && t.hasAttribute("data-ln-persist") && window.lnCore._persistSink(t, e.selector);
    try {
      t[e.attribute] = new e.ComponentFn(t);
    } catch (i) {
      console.error("[" + e.attribute + "] init failed", t, i);
    }
  }
}
function Dn(t, e, i, d) {
  if (t.nodeType !== 1) return;
  const p = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", l = { selector: e, attribute: i, ComponentFn: d };
  if (t.matches && t.matches(p) && $t(t, l), t.querySelectorAll) {
    const c = t.querySelectorAll(p);
    for (let s = 0; s < c.length; s++)
      $t(c[s], l);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Yi() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function me() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function Rn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function On() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function Nn(t) {
  const e = On(), i = t.observed || [];
  for (let d = 0; d < i.length; d++) {
    const f = i[d];
    e.byAttr.has(f) || e.byAttr.set(f, []), e.byAttr.get(f).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const d in t.attributes) {
      e.byDeclaredAttr.has(d) || e.byDeclaredAttr.set(d, []);
      const f = e.byDeclaredAttr.get(d);
      f.some((p) => p.componentTag === t.componentTag) || f.push({
        spec: t.attributes[d],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const d = Qi(t);
    if (d === null)
      e.reactiveWildcard.push(t);
    else
      for (const f of d)
        e.byReactive.has(f) || e.byReactive.set(f, []), e.byReactive.get(f).push(t);
  }
  t.persist && e.persist.push(t);
}
function Qe(t, e, i, d) {
  for (let f = 0; f < t.length; f++) {
    const p = t[f];
    if (!e[p.attribute]) continue;
    const l = p.effects && p.effects[i];
    l ? l(e, i, d) : p.onAttrChange && (!p.declared || p.declared.has(i)) && p.onAttrChange(e, i, d);
  }
}
function Xi(t) {
  const e = t.attributeName, i = e.indexOf("data-ln-") === 0, d = On(), f = d.byAttr.get(e), p = yn() && d.byDeclaredAttr && d.byDeclaredAttr.has(e);
  if (!i && !f && !p)
    return;
  const l = t.target;
  if (t.oldValue !== l.getAttribute(e)) {
    if (p && qe(l)) {
      const c = d.byDeclaredAttr.get(e), s = l.getAttribute(e);
      for (let n = 0; n < c.length; n++)
        qn(c[n].spec, s, e, c[n].componentTag, l);
    }
    if (window.lnCore._debugSink && (i || f) && window.lnCore._debugSink("attr", e, l, { oldValue: t.oldValue, newValue: l.getAttribute(e) }), i) {
      const c = d.byReactive.get(e);
      c && Qe(c, l, e, t.oldValue), d.reactiveWildcard.length && Qe(d.reactiveWildcard, l, e, t.oldValue);
    }
    if (f)
      for (let c = 0; c < f.length; c++) {
        const s = f[c];
        if (s.handler) {
          s.handler(l, e, t.oldValue);
          continue;
        }
        s.onAttributeChange && l[s.attribute] ? s.onAttributeChange(l, e) : (Dn(l, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(l));
      }
  }
}
function Mn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ct(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        try {
          Xi(e[i]);
        } catch (d) {
          console.error("[ln-core] mutation handler failed", e[i].target, d);
        }
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function Be() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Pe() {
  return window.lnCore = window.lnCore || {}, window.lnCore._subtreeRegistry = window.lnCore._subtreeRegistry || [];
}
function ge(t, e) {
  if (!document.contains(t))
    if (e.attribute) {
      const i = t[e.attribute];
      if (i && typeof i.destroy == "function")
        try {
          i.destroy();
        } catch (d) {
          console.error("[" + e.attribute + "] destroy failed", t, d);
        }
      delete t[e.attribute];
    } else e.onDestroy && e.onDestroy(t);
}
function Fn(t) {
  const e = Be();
  if (!e.length) return;
  const i = t.target;
  if (i) {
    const f = i.nodeType === 1 ? i : i.parentElement;
    if (f && (f.isContentEditable || f.closest && f.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const d = Pe();
  if (t.target && d.length)
    for (let f = 0; f < d.length; f++) {
      const p = d[f], l = p.query, c = t.target.nodeType === 1 ? t.target.matches && t.target.matches(l) ? t.target : t.target.closest ? t.target.closest(l) : null : t.target.parentElement && t.target.parentElement.closest ? t.target.parentElement.closest(l) : null;
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
            p.matches && p.matches(s.query) && $t(p, s);
          else if (p.matches && p.matches(s.query) && $t(p, s), p.querySelectorAll) {
            const n = p.querySelectorAll(s.query);
            for (let u = 0; u < n.length; u++)
              $t(n[u], s);
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
            p.matches && p.matches(n) && ge(p, s);
          else if (p.matches && p.matches(n) && ge(p, s), p.querySelectorAll) {
            const u = p.querySelectorAll(n);
            for (let g = 0; g < u.length; g++)
              ge(u[g], s);
          }
        }
      }
    }
  }
}
function Bn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ct(function() {
    const t = new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const d = e[i];
        if (d.type === "childList")
          try {
            Fn(d);
          } catch (f) {
            console.error("[ln-core] lifecycle handler failed", d.target, f);
          }
      }
    });
    window.lnCore._lifecycleObserver = t, t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Pn(t) {
  if (typeof window > "u") return t();
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._lifecycleObserver;
  if (!e) return t();
  const i = e.takeRecords();
  for (let d = 0; d < i.length; d++) {
    const f = i[d];
    if (f.type === "childList")
      try {
        Fn(f);
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
function Nt(t, e) {
  Nn({ observed: t, handler: e }), Mn();
}
function te(t) {
  Be().push(t), t.onSubtreeChange && t.query && Pe().push(t), Bn();
}
function H(t, e, i, d, f = {}) {
  const p = f.extraAttributes || [], l = f.onAttributeChange || null, c = f.onSubtreeChange || null, s = f.onInit || null, n = f.onAttrChange || null, u = f.effects || null, g = f.attributes || null, r = g ? $i(g) : u, _ = g ? new Set(Object.keys(g)) : null, v = f.persist || null;
  function h(w) {
    const E = w || document.body;
    if (Dn(E, t, e, i), g && yn())
      for (const A in g) {
        const S = g[A], C = Array.from(E.querySelectorAll("[" + A + "]"));
        E.matches && E.matches("[" + A + "]") && C.push(E);
        for (let L = 0; L < C.length; L++) {
          const I = C[L];
          qe(I) && qn(S, I.getAttribute(A), A, d, I);
        }
      }
    s && s(E);
  }
  const b = [];
  if (t.indexOf("[") !== -1) {
    const w = /\[([\w-]+)/g;
    let E;
    for (; (E = w.exec(t)) !== null; )
      b.push(E[1]);
  } else
    b.push(t);
  Nn({
    selector: t,
    attribute: e,
    componentTag: d,
    attributes: g,
    ComponentFn: i,
    onInit: s,
    observed: b.concat(p),
    onAttributeChange: l,
    onAttrChange: n,
    effects: r,
    declared: _,
    persist: v
  }), Mn();
  const o = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1, y = f.subtreeQuery || (o ? t : "[" + t + "]"), m = {
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: s,
    onSubtreeChange: c,
    query: y
  };
  Be().push(m), c && y && Pe().push(m), Bn(), window[e] = h, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = H, window.lnCore.observeLifecycle = te, window.lnCore.withoutLifecycle = Pn);
  function a() {
    Rn() > 0 ? mt(function() {
      h(document.body);
    }) : h(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a(), h;
}
function He(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const d = t[i];
    if (!(d === "" || d == null) && (e = !0, !Number.isFinite(Number(d))))
      return "string";
  }
  return e ? "number" : "string";
}
function Ue(t, e, i, d) {
  if (i === "number") {
    const l = parseFloat(t), c = parseFloat(e);
    return (isNaN(l) ? 0 : l) - (isNaN(c) ? 0 : c);
  }
  const f = t != null ? String(t) : "", p = e != null ? String(e) : "";
  return d ? d.compare(f, p) : f < p ? -1 : f > p ? 1 : 0;
}
function Ht(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function Hn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.threshold != null ? t.threshold : 25, f = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, l = typeof t.onChange == "function" ? t.onChange : function() {
  }, c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let u = 0, g = 0, r = 0, _ = { sort: null, filters: {}, search: "" }, v = null, h = 0, b = 0, o = !1;
  function y(E) {
    s.set(E, ++h);
  }
  function m() {
    return !!(_ && (_.search || _.filters && Object.keys(_.filters).length));
  }
  function a() {
    if (c.size <= e) return;
    const E = Array.from(c.keys()).sort(function(S, C) {
      return (s.get(S) || 0) - (s.get(C) || 0);
    });
    let A = 0;
    for (; c.size > e && A < E.length; )
      c.delete(E[A]), s.delete(E[A]), A++;
  }
  function w(E, A) {
    n.add(E), p(_, E, A);
  }
  return {
    get: function(E) {
      return c.get(E);
    },
    has: function(E) {
      return c.has(E);
    },
    peek: function() {
      return c.size ? c.values().next().value : void 0;
    },
    get logicalTotal() {
      return u;
    },
    get grandTotal() {
      return g;
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
    ensure: function(E, A) {
      clearTimeout(v), b = E;
      for (let D = E; D < A; D++)
        c.has(D) && y(D);
      if (u <= 0) return;
      const S = Math.max(0, E - d), C = Math.min(u, A + d), L = Math.floor(S / i), I = Math.floor(Math.max(0, C - 1) / i);
      let q = -1;
      for (let D = L; D <= I; D++) {
        const O = D * i, F = Math.min(i, u - O);
        let U = !1;
        const K = Math.max(O, S), G = Math.min(O + F, C);
        for (let tt = K; tt < G; tt++)
          if (!c.has(tt)) {
            U = !0;
            break;
          }
        if (U && !n.has(O)) {
          q = O;
          break;
        }
      }
      q !== -1 && (v = setTimeout(function() {
        w(q, i);
      }, f));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(E) {
      if (E = E || {}, E.queryGen != null && E.queryGen !== r) return !1;
      const A = E.offset || 0, S = E.data || [];
      let C = 0;
      for (let L = 0; L < S.length; L++)
        S[L] != null && C++;
      if (C === 0 && (E.provisional || E.filtered > 0))
        return n.delete(A), !1;
      o && (c.clear(), s.clear(), o = !1), E.provisional || (g = E.total != null ? E.total : g, u = E.filtered != null ? E.filtered : E.data ? E.data.length : u);
      for (let L = 0; L < S.length; L++)
        S[L] != null && (c.set(A + L, S[L]), y(A + L));
      return n.delete(A), a(), l(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(E) {
      E && (_ = E), w(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(E) {
      r++, n.clear(), clearTimeout(v), E && (_ = E), o = !0, w(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      r++, n.clear(), clearTimeout(v), o = !0;
      const E = Math.max(0, Math.floor(b / i) * i);
      w(E, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(E) {
      n.delete(E);
    },
    destroy: function() {
      clearTimeout(v), c.clear(), s.clear(), n.clear();
    },
    configure: function(E) {
      E = E || {};
      let A = !1;
      if (E.windowSize != null && E.windowSize > 0 && E.windowSize !== e) {
        const S = E.windowSize < e;
        e = E.windowSize, S && a(), A = !0;
      }
      E.pageSize != null && E.pageSize > 0 && (i = E.pageSize), E.threshold != null && E.threshold >= 0 && (d = E.threshold), E.fetchDebounce != null && E.fetchDebounce >= 0 && (f = E.fetchDebounce), A && l();
    },
    setGrandTotal: function(E) {
      E == null || isNaN(E) || E < 0 || (g = E, m() || (u = E), l());
    }
  };
}
function Un(t) {
  return (t || "").replace(/^#/, "");
}
function Xt(t) {
  const e = t === void 0 ? location.hash : t, i = {}, d = Un(e);
  if (!d) return i;
  const f = d.split("&");
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
function st(t) {
  if (!t) return null;
  const e = Xt();
  return t in e ? e[t] : null;
}
function gt(t, e) {
  if (!t) return;
  const i = Xt();
  e == null ? delete i[t] : i[t] = String(e);
  const f = Object.keys(i).map(function(p) {
    const l = i[p];
    return l === "" ? p : p + ":" + encodeURIComponent(l);
  }).join("&");
  Un(location.hash) !== f && (location.hash = f);
}
function ze(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function St(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const d = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return d ? e ? d + "-" + e : d : e || null;
}
function zn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Ee(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Kn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function Ae(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), d = t.slice(e + 1), f = d ? d.split(",").map(function(p) {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).filter(Boolean) : [];
  return { key: i, values: f };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Xt, window.lnCore.hashGet = st, window.lnCore.hashSet = gt, window.lnCore.hashLinkClick = ze, window.lnCore.resolveHashNamespace = St, window.lnCore.hashSortEncode = zn, window.lnCore.hashSortDecode = Ee, window.lnCore.hashFilterEncode = Kn, window.lnCore.hashFilterDecode = Ae);
function le(t, e, i, d) {
  const f = typeof d == "number" ? d : 4, p = window.innerWidth, l = window.innerHeight, c = e.width, s = e.height, n = (i || "bottom").split("-"), u = n[0], g = n[1] === "start" || n[1] === "end" ? n[1] : "center", r = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, _ = r[u] || r.bottom;
  function v(m) {
    return m === "top" || m === "bottom" ? g === "start" ? t.left : g === "end" ? t.right - c : t.left + (t.width - c) / 2 : g === "start" ? t.top : g === "end" ? t.bottom - s : t.top + (t.height - s) / 2;
  }
  function h(m) {
    let a, w, E = !0;
    return m === "top" ? (a = t.top - f - s, w = v(m), a < 0 && (E = !1)) : m === "bottom" ? (a = t.bottom + f, w = v(m), a + s > l && (E = !1)) : m === "left" ? (a = v(m), w = t.left - f - c, w < 0 && (E = !1)) : (a = v(m), w = t.right + f, w + c > p && (E = !1)), { top: a, left: w, side: m, fits: E };
  }
  let b = null;
  for (let m = 0; m < _.length; m++) {
    const a = h(_[m]);
    if (a.fits) {
      b = a;
      break;
    }
  }
  b || (b = h(_[0]));
  let o = b.top, y = b.left;
  return c >= p ? y = 0 : (y < 0 && (y = 0), y + c > p && (y = p - c)), s >= l ? o = 0 : (o < 0 && (o = 0), o + s > l && (o = l - s)), { top: o, left: y, placement: b.side };
}
function Se(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, d = e.display, f = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const p = t.offsetWidth, l = t.offsetHeight;
  return e.visibility = i, e.display = d, e.position = f, { width: p, height: l };
}
let Qt = null;
const Ji = "ln-ashlar:storage-salt:v1", Ye = 32768;
function Xe(t) {
  let e = "";
  const i = t.byteLength;
  for (let d = 0; d < i; d += Ye)
    e += String.fromCharCode.apply(
      null,
      t.subarray(d, Math.min(d + Ye, i))
    );
  return btoa(e);
}
function Je(t) {
  const e = atob(t), i = e.length, d = new Uint8Array(i);
  for (let f = 0; f < i; f++)
    d[f] = e.charCodeAt(f);
  return d;
}
function jn(t, e) {
  let i = Qt, d = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (d = t, typeof CryptoKey < "u" && d.key instanceof CryptoKey && (i = d.key)), { key: i, options: d };
}
async function Zi(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", d = new TextEncoder();
  if (i === "sha256") {
    const s = await crypto.subtle.digest("SHA-256", d.encode(t));
    return crypto.subtle.importKey(
      "raw",
      s,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const f = e.salt || Ji, p = typeof f == "string" ? d.encode(f) : f, l = e.iterations || 1e5, c = await crypto.subtle.importKey(
    "raw",
    d.encode(t),
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
async function Ze(t, e = {}) {
  if (!t) {
    Qt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Qt = await Zi(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Qt = null, i;
  }
}
function Tt() {
  return Qt;
}
async function tr(t, e, i) {
  const { key: d } = jn(e);
  if (t == null)
    return t;
  if (!d)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const f = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), l = typeof t == "string" ? t : JSON.stringify(t), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      d,
      f.encode(l)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Xe(p),
      data: Xe(new Uint8Array(c))
    };
  } catch (f) {
    throw console.error("[ln-core/crypto] Encryption failed:", f), new Error("[ln-crypto] Encryption failed: " + (f && f.message ? f.message : String(f)));
  }
}
async function er(t, e, i) {
  const { key: d, options: f } = jn(e), p = f.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!d) {
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
    const l = new TextDecoder(), c = Je(t.iv), s = Je(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: c },
      d,
      s
    ), u = l.decode(n);
    try {
      return JSON.parse(u);
    } catch {
      return u;
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
function Wn(t, e = 100, i = 0) {
  const d = parseFloat(String(t)) || 0, f = parseFloat(String(e)) || 100, p = parseFloat(String(i)) || 0, l = Math.max(p, Math.min(d, f)), c = f - p;
  let s = 0;
  return c > 0 && (s = (l - p) / c * 100), s = Math.max(0, Math.min(100, s)), {
    value: d,
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
    const i = e < 1e11 ? e * 1e3 : e, d = new Date(i);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i) return null;
    const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(i);
    if (d) {
      const p = +d[1], l = +d[2], c = +d[3], s = new Date(p, l - 1, c);
      return s.getFullYear() !== p || s.getMonth() !== l - 1 || s.getDate() !== c ? null : s;
    }
    const f = new Date(i);
    return isNaN(f.getTime()) ? null : f;
  }
  return null;
}
function Ft(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), d = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + d;
}
const Et = {};
function ce(t) {
  const e = t || "default";
  if (!Et[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), d = i.formatToParts(1234.5);
    let f = "", p = ".";
    for (let l = 0; l < d.length; l++)
      d[l].type === "group" && (f = d[l].value), d[l].type === "decimal" && (p = d[l].value);
    Et[e] = { groupSep: f, decimalSep: p, fmt: i };
  }
  return Et[e];
}
function Vn(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let d = t.trim();
  return d === "" ? "" : (d = d.replace(/[$€£¥]/g, ""), e && (d = d.split(e).join("")), d = d.replace(/\s/g, ""), i && i !== "." && (d = d.replace(i, ".")), d = d.replace(/[^\d.-]/g, ""), d);
}
function nr(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const d = ce(e), f = Vn(i, d.groupSep, d.decimalSep);
  if (f === "" || f === "-") return NaN;
  const p = parseFloat(f);
  return isNaN(p) ? NaN : p;
}
function rt(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const d = e || "default", f = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, p = i.userDecimals != null ? i.userDecimals : null;
  if (f !== null) {
    const l = d + "|max:" + f;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: f
    })), Et[l].format(t);
  }
  if (p !== null && p > 0) {
    const l = d + "|exact:" + p;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: p,
      maximumFractionDigits: p
    })), Et[l].format(t);
  }
  return ce(e).fmt.format(t);
}
function se(t) {
  return String(t || "").trim().toLowerCase();
}
function Gn(t) {
  const e = se(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function ir(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function $n(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (i.indexOf(e[d]) === -1) return !1;
  return !0;
}
function rr(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Ke(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (String(e[d]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function or(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function sr(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function ar(t, e) {
  return (e || "GET") + " " + (t || "");
}
function lr(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function d(l, c) {
    c = c || {};
    const s = or(l), n = sr(l, c), u = ar(s, n);
    lr(n) && e.has(u) && (e.get(u).abort(), e.delete(u));
    const g = new AbortController(), r = c.signal;
    let _ = null;
    r && (r.aborted ? g.abort(r.reason) : (_ = function() {
      g.abort(r.reason);
    }, r.addEventListener("abort", _, { once: !0 })));
    const v = Object.assign({}, c, { signal: g.signal });
    return e.set(u, g), t(l, v).finally(function() {
      r && _ && r.removeEventListener("abort", _), e.get(u) === g && e.delete(u);
    });
  }
  d.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = d;
  function f(l) {
    if (!l.detail || !l.detail.url) return;
    const c = l.target, s = (l.detail.method || (l.detail.body ? "POST" : "GET")).toUpperCase(), n = l.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const u = new AbortController(), g = l.detail.signal;
    let r = null;
    g && (g.aborted ? u.abort(g.reason) : (r = function() {
      u.abort(g.reason);
    }, g.addEventListener("abort", r, { once: !0 }))), n && i.set(n, u);
    const _ = { method: s, signal: u.signal };
    l.detail.body !== void 0 && (_.body = l.detail.body), window.fetch(l.detail.url, _).then(function(v) {
      g && r && g.removeEventListener("abort", r), n && i.get(n) === u && i.delete(n), k(c, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      g && r && g.removeEventListener("abort", r), n && i.get(n) === u && i.delete(n), !(v && v.name === "AbortError") && k(c, "ln-http:error", {
        ok: !1,
        status: 0,
        error: v
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
  }, d = X(i), f = /* @__PURE__ */ new Map();
  function p(l) {
    if (this.dom = l, Y(this, l, d), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Yi(), this._held = !0;
    const c = this, s = this.url;
    let n = f.get(s);
    return n || (n = fetch(s).then(function(u) {
      if (!u.ok)
        throw new Error("HTTP error! status: " + u.status);
      return u.text();
    }).catch(function(u) {
      throw f.delete(s), u;
    }), f.set(s, n)), n.then(function(u) {
      if (c._destroyed) return;
      const g = document.createElement("template");
      g.innerHTML = u, c.dom.content.appendChild(g.content), k(c.dom, "ln-include:loaded", { target: c.dom, url: c.url }), c._held && (c._held = !1, me());
    }).catch(function(u) {
      c._destroyed || (console.error("[ln-include] Failed to fetch template from " + c.url + ":", u), k(c.dom, "ln-include:error", { target: c.dom, url: c.url, error: u }), c._held && (c._held = !1, me()));
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, me()), delete this.dom[e]);
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
  }, d = X(i);
  function f(p) {
    this.dom = p, Y(this, p, d), this._baseAction = p.getAttribute("action") || "";
    const l = this;
    function c() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let u = 0; u < n.length; u++)
        n[u].hasAttribute("data-ln-initial-value") || n[u].setAttribute("data-ln-initial-value", n[u].getAttribute("value") || "");
    }
    function s() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let u = 0; u < n.length; u++)
        n[u].value = n[u].getAttribute("data-ln-initial-value") || "";
    }
    return c(), this._onLnFill = function(n) {
      n.target === l.dom && (n.detail ? (c(), l.fill(n.detail), l._applyActionMode(n.detail)) : (l.dom.reset(), s()));
    }, this._onReset = function() {
      l._applyActionMode(null), s();
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  f.prototype.fill = function(p) {
    const l = Ne(this.dom, p);
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
const tn = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function en(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function cr(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function dr(t, e) {
  const i = [];
  if (t) {
    const d = Object.keys(tn);
    for (let f = 0; f < d.length; f++) {
      const p = d[f], l = tn[p];
      t[l] && i.push(p);
    }
  }
  if (e) {
    const d = Array.from(e);
    for (let f = 0; f < d.length; f++)
      d[f] && i.indexOf(d[f]) === -1 && i.push(d[f]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", d = "data-ln-validate-error", f = "ln-validate-valid", p = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function c(s) {
    this.dom = s, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, u = s.tagName, g = s.type, r = u === "SELECT" || g === "checkbox" || g === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(v) {
      const h = v.detail && v.detail.error;
      if (!h) return;
      n._customErrors.add(h), n._touched = !0;
      const b = s.closest(".form-element");
      if (b) {
        const o = b.querySelector("[" + d + '="' + h + '"]');
        o && o.classList.remove("hidden");
      }
      s.classList.remove(f), s.classList.add(p), s.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(v) {
      const h = v.detail && v.detail.error, b = s.closest(".form-element");
      if (h) {
        if (n._customErrors.delete(h), b) {
          const o = b.querySelector("[" + d + '="' + h + '"]');
          o && o.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(o) {
          if (b) {
            const y = b.querySelector("[" + d + '="' + o + '"]');
            y && y.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, r || s.addEventListener("input", this._onInput), s.addEventListener("change", this._onChange), s.addEventListener("ln-validate:set-custom", this._onSetCustom), s.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const _ = s.form;
    return _ && (_.hasAttribute("novalidate") || _.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(v) {
      n._touched = !0, !n.validate() && v.detail && v.detail.invalidFields && v.detail.invalidFields.push(n.dom);
    }, _.addEventListener("reset", this._onFormReset), _.addEventListener("ln-validate:request-validate", this._onValidateRequest), _._lnValidateGateBound || (_._lnValidateGateBound = !0, _.addEventListener("submit", function(v) {
      const h = { invalidFields: [] };
      k(_, "ln-validate:request-validate", h), h.invalidFields.length > 0 && (v.preventDefault(), h.invalidFields.sort((b, o) => b.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), h.invalidFields[0].focus());
    }))), cr(s) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const s = this.dom, n = s.validity, u = en(n, this._customErrors.size), g = dr(n, this._customErrors), r = s.closest(".form-element");
    if (r) {
      const h = r.querySelector("[" + i + "]");
      if (h) {
        const b = h.querySelectorAll("[" + d + "]");
        for (let o = 0; o < b.length; o++) {
          const y = b[o].getAttribute(d), m = !g.includes(y);
          b[o].classList.contains("hidden") !== m && b[o].classList.toggle("hidden", m);
        }
      }
    }
    s.classList.contains(f) !== u && s.classList.toggle(f, u), s.classList.contains(p) === u && s.classList.toggle(p, !u);
    const _ = u ? "false" : "true";
    return s.getAttribute("aria-invalid") !== _ && s.setAttribute("aria-invalid", _), k(s, u ? "ln-validate:valid" : "ln-validate:invalid", { target: s, field: s.name, errors: g }), u;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.contains(f) && this.dom.classList.remove(f), this.dom.classList.contains(p) && this.dom.classList.remove(p), this.dom.hasAttribute("aria-invalid") && this.dom.removeAttribute("aria-invalid");
    const s = this.dom.closest(".form-element");
    if (s) {
      const n = s.querySelectorAll("[" + d + "]");
      for (let u = 0; u < n.length; u++)
        n[u].classList.contains("hidden") || n[u].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return en(this.dom.validity, this._customErrors.size);
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
  let d = null;
  function f(r) {
    if (!r.hasAttribute(t) || r[e]) return;
    r[e] = !0;
    const _ = n(r);
    p(_.links), l(_.forms);
  }
  function p(r) {
    for (const _ of r) {
      if (_[e + "Trigger"] || _.hostname && _.hostname !== window.location.hostname) continue;
      const v = _.getAttribute("href");
      if (v && v.includes("#")) continue;
      const h = function(b) {
        if (!wn(b, _)) return;
        b.preventDefault();
        const o = _.getAttribute("href");
        o && s("GET", o, null, _);
      };
      _.addEventListener("click", h), _[e + "Trigger"] = h;
    }
  }
  function l(r) {
    for (const _ of r) {
      if (_[e + "Trigger"]) continue;
      if (_.hasAttribute(i)) {
        _[e + "ScopeWarned"] || (_[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const v = function(h) {
        if (h.defaultPrevented) return;
        h.preventDefault();
        const b = _.method.toUpperCase(), o = _.action, y = new FormData(_);
        for (const m of _.querySelectorAll('button, input[type="submit"]'))
          m.disabled = !0;
        s(b, o, y, _, function() {
          for (const m of _.querySelectorAll('button, input[type="submit"]'))
            m.disabled = !1;
        });
      };
      _.addEventListener("submit", v), _[e + "Trigger"] = v;
    }
  }
  function c(r) {
    if (!r[e]) return;
    const _ = n(r);
    for (const v of _.links)
      v[e + "Trigger"] && (v.removeEventListener("click", v[e + "Trigger"]), delete v[e + "Trigger"]);
    for (const v of _.forms)
      v[e + "Trigger"] && (v.removeEventListener("submit", v[e + "Trigger"]), delete v[e + "Trigger"]);
    delete r[e];
  }
  function s(r, _, v, h, b) {
    if (Q(h, "ln-ajax:before-start", { method: r, url: _ }).defaultPrevented) return;
    r === "GET" && d && d(), k(h, "ln-ajax:start", { method: r, url: _ }), h.classList.add("ln-ajax--loading");
    const y = document.createElement("span");
    y.className = "ln-ajax-spinner", h.appendChild(y);
    function m() {
      h.classList.remove("ln-ajax--loading");
      const C = h.querySelector(".ln-ajax-spinner");
      C && C.remove(), b && b();
    }
    let a = _;
    const w = document.querySelector('meta[name="csrf-token"]'), E = w ? w.getAttribute("content") : null;
    v instanceof FormData && E && v.append("_token", E);
    const A = {
      method: r,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (A.headers["X-CSRF-TOKEN"] = E), r === "GET" && v) {
      const C = new URLSearchParams(v);
      a = _ + (_.includes("?") ? "&" : "?") + C.toString();
    } else r !== "GET" && v && (A.body = v);
    let S = null;
    if (r === "GET") {
      const C = new AbortController();
      A.signal = C.signal, S = function() {
        d = null, C.abort(), m(), k(h, "ln-ajax:aborted", { method: r, url: a });
      }, d = S;
    }
    fetch(a, A).then(function(C) {
      const L = C.ok, I = C.status;
      return C.text().then(function(q) {
        let D = null, O = null;
        if (q && q.trim())
          try {
            D = JSON.parse(q);
          } catch (F) {
            O = F;
          }
        return { ok: L, status: I, data: D, parseError: O };
      });
    }).then(function(C) {
      S && d === S && (d = null);
      const L = C.status, I = C.data, q = C.parseError;
      if (C.ok && !q) {
        if (I && I.title && (document.title = I.title), I && I.content)
          for (const D in I.content) {
            const O = document.getElementById(D);
            O && (O.innerHTML = I.content[D]);
          }
        if (h.tagName === "A") {
          const D = h.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else h.tagName === "FORM" && h.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", a);
        k(h, "ln-ajax:success", { method: r, url: a, data: I });
      } else
        k(h, "ln-ajax:error", {
          method: r,
          url: a,
          status: L,
          data: I,
          error: q || null
        });
      m(), k(h, "ln-ajax:complete", { method: r, url: a });
    }).catch(function(C) {
      C && C.name === "AbortError" || (S && d === S && (d = null), k(h, "ln-ajax:error", { method: r, url: a, status: 0, data: null, error: C }), m(), k(h, "ln-ajax:complete", { method: r, url: a }));
    });
  }
  function n(r) {
    const _ = { links: [], forms: [] };
    return r.tagName === "A" && r.getAttribute(t) !== "false" ? _.links.push(r) : r.tagName === "FORM" && r.getAttribute(t) !== "false" ? _.forms.push(r) : (_.links = Array.from(r.querySelectorAll('a:not([data-ln-ajax="false"])')), _.forms = Array.from(r.querySelectorAll('form:not([data-ln-ajax="false"])'))), _;
  }
  function u() {
    ct(function() {
      te({
        onInit: function(r) {
          if (f(r), !r.hasAttribute(t)) {
            for (const v of r.querySelectorAll("[" + t + "]"))
              f(v);
            const _ = r.closest && r.closest("[" + t + "]");
            if (_ && _.getAttribute(t) !== "false") {
              const v = n(r);
              p(v.links), l(v.forms);
            }
          }
        }
      }), Nt([t], function(r) {
        f(r);
      });
    }, "ln-ajax");
  }
  function g() {
    for (const r of document.querySelectorAll("[" + t + "]"))
      f(r);
  }
  window[e] = f, window[e].destroy = c, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", g) : g();
})();
function ur(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: d = null } = {}) {
  const f = i ? !d : !t.some((n) => n.match), p = [], l = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const u = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !u && n.targetEl && p.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || l.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  l.sort((n, u) => n.regionKey === "__primary__" ? -1 : u.regionKey === "__primary__" ? 1 : 0);
  const s = l.find((n) => n.regionKey === "__primary__") || l[0] || null;
  return { notFound: f, clears: p, swaps: l, owner: s };
}
function Yt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function fr(t, e) {
  const i = Yt(e);
  if (!i) return t && t.replace(/\/+$/, "") || "/";
  const d = (t || "/").replace(/\/+$/, "") || "/";
  return d === i ? "/" : d.startsWith(i + "/") ? d.slice(i.length).replace(/\/+$/, "") || "/" : d;
}
function Qn(t, e) {
  const i = Yt(e);
  if (!i) return t || "/";
  const d = t || "/", f = d.indexOf("#"), p = f !== -1 ? d.slice(0, f) : d, l = f !== -1 ? d.slice(f) : "", c = p.indexOf("?"), s = c !== -1 ? p.slice(0, c) : p, n = c !== -1 ? p.slice(c) : "";
  let u;
  if (s === i)
    u = i + "/";
  else if (s.startsWith(i + "/"))
    u = s;
  else {
    const g = s.startsWith("/") ? s : "/" + s;
    u = g === "/" ? i + "/" : i + g;
  }
  return u + n + l;
}
function Ce() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return Yt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const i = new URL(e.getAttribute("href"), window.location.origin);
      return Yt(i.pathname);
    } catch {
      return Yt(e.getAttribute("href"));
    }
  return "";
}
const Yn = {
  navigate: function(t) {
    Jt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Jt(t, { historyAction: "replace" });
  },
  base: function() {
    return Ce();
  },
  toUrl: function(t) {
    return Qn(t, Ce());
  },
  current: function() {
    return de === null ? null : {
      path: de,
      fullPath: Zn,
      base: ti,
      params: ei,
      query: ni,
      route: ii,
      regions: Jn
    };
  }
}, je = "data-ln-route", Xn = "lnRoute";
typeof window < "u" && (window.lnRouter = Yn);
function _e(t) {
  li(t), ai(t), _t.size > 0 && si();
}
const hr = {
  "data-ln-route": { effect: _e, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: _e, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: _e, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, _t = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new WeakMap();
let Jn = /* @__PURE__ */ new Map(), nn = !1, de = null, Zn = null, ti = "", ei = {}, ni = {}, ii = null, Te = !1;
function rn(t, e, i) {
  Te ? queueMicrotask(function() {
    k(t, e, i);
  }) : k(t, e, i);
}
function We(t) {
  try {
    const c = new URL(t, window.location.origin);
    t = c.pathname + c.search + c.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, d] = e.split("?");
  const f = {};
  if (d) {
    const c = new URLSearchParams(d);
    for (const [s, n] of c.entries())
      f[s] = n;
  }
  const p = Ce();
  return { path: fr(i, p), query: f, base: p };
}
function ri(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, d = e.segments, f = Math.max(i.length, d.length);
  for (let p = 0; p < f; p++) {
    const l = i[p], c = d[p];
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
function oi(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const d of e) {
    if (d.pattern === "*")
      return {
        route: d,
        params: { wildcard: t }
      };
    const f = d.segments, p = {};
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
        return { route: d, params: p };
    }
  }
  return null;
}
function ke(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const f = document.getElementById(t);
    return !f && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), f;
  }
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !d && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function on(t) {
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
  const d = document.querySelectorAll('[data-ln-popover="open"]');
  for (const f of d) {
    const p = f.lnPopover;
    if (p && p.trigger && t.contains(p.trigger))
      try {
        p.destroy();
      } catch (l) {
        console.error("[ln-router] Error destroying open popover:", l);
      }
  }
}
function Jt(t, e = {}) {
  const { path: i, query: d, base: f } = We(t), p = Qn(t, f), l = /* @__PURE__ */ new Map();
  for (const [v, h] of _t)
    l.set(v, oi(i, h.sorted));
  const c = l.get("__primary__") || null, s = ke("__primary__", { warn: !!c }), n = _t.has("__primary__"), u = [];
  for (const [v, h] of l) {
    const b = v === "__primary__" ? s : ke(v, { warn: !1 }), o = !b && !!(c && c.route && c.route.templateNode && c.route.templateNode.content && c.route.templateNode.content.querySelector("#" + CSS.escape(v)));
    !b && !o && h && console.warn(`[ln-router] Explicit target element #${v} not found in DOM`), u.push({
      regionKey: v,
      match: h,
      targetEl: b,
      isPending: o,
      hasKeep: !!b && b.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!b && b.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!b && b.children.length > 0,
      mountedTemplate: b && be.get(b) || null
    });
  }
  const g = ur(u, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: c
  });
  if (g.notFound) {
    rn(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Q(s || document.body, "ln-router:before-navigate", {
    from: de,
    to: p,
    path: i,
    params: c ? c.params : {},
    query: d
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", p) : e.historyAction === "replace" && window.history.replaceState(null, "", p);
  const _ = function() {
    for (const v of g.clears)
      on(v.targetEl), v.targetEl.replaceChildren(), be.delete(v.targetEl);
    for (const v of g.swaps) {
      if ((v.isPending || !v.targetEl || !document.contains(v.targetEl)) && (v.targetEl = v.regionKey === "__primary__" ? s : document.getElementById(v.regionKey)), !v.targetEl) {
        console.warn(`[ln-router] Target element #${v.regionKey} could not be resolved`);
        continue;
      }
      if (v.skipMount || (on(v.targetEl), v.targetEl.replaceChildren(v.match.route.templateNode.content.cloneNode(!0))), be.set(v.targetEl, v.match.route.templateNode), g.owner && v.regionKey === g.owner.regionKey) {
        if (v.match.route.title) {
          let h = v.match.route.title;
          if (v.match.params)
            for (const [b, o] of Object.entries(v.match.params))
              h = h.replace(new RegExp("\\{\\{\\s*" + b + "\\s*\\}\\}", "g"), o);
          document.title = h;
        }
        if (!e.isHydration) {
          v.targetEl.hasAttribute("tabindex") || v.targetEl.setAttribute("tabindex", "-1");
          const h = v.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          h ? (h.setAttribute("tabindex", "-1"), h.focus()) : v.targetEl.focus(), v.regionKey === "__primary__" && v.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      rn(v.targetEl, "ln-router:navigated", {
        path: i,
        fullPath: p,
        base: f,
        params: v.match.params,
        query: d,
        route: v.match.route,
        target: v.targetEl,
        region: v.regionKey
      });
    }
    de = i, Zn = p, ti = f, ni = d, ii = c ? c.route : null, ei = c ? c.params : {}, Jn = new Map(
      Array.from(l.entries()).map(([v, h]) => [v, h ? { route: h.route, params: h.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(_) : _();
}
function pr(t) {
  const e = t.target.closest("a");
  if (!e || !wn(t, e)) return;
  const i = e.getAttribute("href"), { path: d } = We(i);
  for (const f of _t.values())
    if (oi(d, f.sorted)) {
      t.preventDefault(), Jt(i, { historyAction: "push" });
      return;
    }
}
function mr(t, e) {
  const i = Object.keys(t), d = Object.keys(e);
  if (i.length !== d.length) return !1;
  for (let f = 0; f < i.length; f++) {
    const p = i[f];
    if (t[p] !== e[p]) return !1;
  }
  return !0;
}
function gr() {
  const t = window.location.pathname + window.location.search, e = Yn.current();
  if (e && e.path != null) {
    const i = We(t);
    if (e.path === i.path && mr(e.query, i.query))
      return;
  }
  Jt(t, { historyAction: "skip" });
}
function si() {
  nn || (nn = !0, ct(function() {
    document.addEventListener("click", pr), window.addEventListener("popstate", gr), Te = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Jt(t, { historyAction: "replace", isHydration: !0 }), Te = !1;
  }, "ln-router"));
}
function ai(t) {
  const e = t.getAttribute(je);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const d = i || "__primary__";
  _t.has(d) || _t.set(d, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const f = _t.get(d);
  if (f.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${d}"`);
    return;
  }
  const p = t.getAttribute("data-ln-route-title"), l = e.split("/").filter(Boolean), c = {
    pattern: e,
    segments: l,
    target: i,
    title: p,
    templateNode: t
  }, s = ke(d);
  s && s.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), f.routes.set(e, c), f.sorted = Array.from(f.routes.values()).sort(ri);
}
function li(t) {
  const e = t.getAttribute(je);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null || "__primary__", f = _t.get(d);
  f && (f.routes.delete(e), f.sorted = Array.from(f.routes.values()).sort(ri), f.routes.size === 0 && _t.delete(d));
}
function ci(t) {
  return this.dom = t, ai(t), this;
}
ci.prototype.destroy = function() {
  li(this.dom), delete this.dom[Xn];
};
H(je, Xn, ci, "ln-router", {
  attributes: hr,
  onInit: function() {
    _t.size > 0 && si();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", i = "data-ln-modal-for", d = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: u,
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
    l || (l = function(g) {
      if (De(g)) return;
      const r = g.target.closest("[" + i + "]");
      if (!r || Re(r)) return;
      const _ = r.getAttribute(i);
      if (!_) return;
      const v = document.getElementById(_);
      !v || !v[e] || (g.preventDefault(), r.hasAttribute("data-ln-modal-mode") ? v.setAttribute("data-ln-modal-mode", r.getAttribute("data-ln-modal-mode")) : v.hasAttribute("data-ln-modal-mode") && v.setAttribute("data-ln-modal-mode", "new"), v.setAttribute(t, "open"));
    }, document.addEventListener("click", l));
  }
  function s() {
    p.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function n(g) {
    this.dom = g, this.isOpen = g.getAttribute(t) === "open";
    const r = this;
    return this._onRequestOpen = function() {
      r.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      r.dom.setAttribute(t, "close");
    }, this._onCancel = function(_) {
      _.preventDefault(), r.dom.setAttribute(t, "close");
    }, this._onClose = function() {
      !r.isOpen || r.dom.getAttribute(t) !== "open" || r.dom.open || (r._isNativeClosing = !0, r.dom.setAttribute(t, "close"));
    }, this._onClickClose = function(_) {
      const v = _.target.closest("[" + d + "]");
      v && r.dom.contains(v) && (_.preventDefault(), r.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), p.add(this), c(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), k(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const g = this.dom.getAttribute(t);
    this.dom.setAttribute(t, g === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), p.delete(this), s(), this.isOpen) {
        const g = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(_) {
            return _ !== g;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function u(g) {
    const r = g[e];
    if (!r) return;
    const _ = !!r._isNativeClosing;
    r._isNativeClosing = !1;
    const h = g.getAttribute(t) === "open";
    if (h === r.isOpen) {
      h && g.isConnected && !g.open && typeof g.showModal == "function" && g.showModal();
      return;
    }
    if (h) {
      if (Q(g, "ln-modal:before-open", { modalId: g.id, target: g }).defaultPrevented) {
        g.setAttribute(t, "close");
        return;
      }
      r.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof g.showModal == "function" && g.showModal();
      const o = g.querySelector("[autofocus]");
      if (o && Gt(o))
        o.focus();
      else {
        const y = g.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), m = Array.prototype.find.call(y, Gt);
        if (m) m.focus();
        else {
          const a = g.querySelectorAll("a[href], button:not([disabled])"), w = Array.prototype.find.call(a, Gt);
          w && w.focus();
        }
      }
      k(g, "ln-modal:open", { modalId: g.id, target: g });
    } else {
      if (!_ && Q(g, "ln-modal:before-close", { modalId: g.id, target: g }).defaultPrevented) {
        g.setAttribute(t, "open");
        return;
      }
      r.isOpen = !1, g.hasAttribute("data-ln-modal-mode") && g.setAttribute("data-ln-modal-mode", "new"), typeof g.close == "function" && g.open && g.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), k(g, "ln-modal:close", { modalId: g.id, target: g });
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
    const c = l.getAttribute("href"), s = Xt(c);
    for (const n in s) {
      const u = document.getElementById(n);
      if (u && u.lnModal) {
        if (!ze(p)) return;
        gt(n, s[n]), u.lnModal.isOpen || k(u, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function d() {
    const p = location.hash;
    if (!p) return;
    const l = Xt(p);
    for (const c in l) {
      const s = document.getElementById(c);
      s && s.lnModal && !s.lnModal.isOpen && k(s, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", d), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d(), document.addEventListener("ln-modal:close", function(p) {
    const l = p.target;
    l && l.id && st(l.id) !== null && gt(l.id, null);
  }), document.addEventListener("ln-ajax:success", function(p) {
    const c = (p.detail || {}).data;
    if (c && c.message) {
      const n = c.message;
      k(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const s = p.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && st(s.id) !== null && gt(s.id, null), k(s, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(p) {
    const c = (p.detail || {}).data;
    if (c && c.message) {
      const s = c.message;
      k(window, "ln-toast:enqueue", {
        type: s.type || "error",
        title: s.title || "",
        message: typeof s == "string" ? s : s.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(p) {
    const l = p.detail || {};
    l.message && k(window, "ln-toast:enqueue", {
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
function _r(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, d = 0;
  for (let f = 0; f < t.length && i > 0; f++)
    d = f + 1, /[0-9]/.test(t[f]) && i--;
  return i > 0 && (d = t.length), d;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(n) {
    const u = n[e];
    u && (u.isTextElement ? u._initTextElement() : isNaN(u.value) || u._displayFormatted(u.value));
  }
  const d = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"), p = /* @__PURE__ */ new Set();
  let l = !1;
  function c() {
    ue(), !l && (l = !0, document.addEventListener("ln-core:locale-change", function() {
      p.forEach(function(n) {
        n.isTextElement ? n._formatTextContent() : isNaN(n.value) || n._displayFormatted(n.value);
      });
    }));
  }
  function s(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const u = this;
    if (p.add(this), c(), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const g = document.createElement("input");
    g.type = "hidden", g.name = n.name, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && g.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", g), this._hidden = g, Object.defineProperty(g, "value", {
      get: function() {
        return f.get.call(g);
      },
      set: function(_) {
        if (f.set.call(g, _), _ !== "" && !isNaN(parseFloat(_))) {
          const v = u.dom.getAttribute("data-ln-number-decimals");
          u._setDisplayRaw(rt(parseFloat(_), J(u.dom), { maxDecimals: v }));
        } else
          u._setDisplayRaw("");
        u.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Me(n, f, {
      get: function() {
        return f.get.call(n);
      },
      set: function(_) {
        if (_ === "") {
          u._setDisplayRaw(""), u._setHiddenRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const v = typeof _ == "number" ? _ : parseFloat(String(_));
        if (isNaN(v))
          u._setDisplayRaw(String(_)), u._setHiddenRaw("");
        else {
          u._setHiddenRaw(v);
          const h = n.getAttribute("data-ln-number-decimals");
          u._setDisplayRaw(rt(v, J(n), { maxDecimals: h }));
        }
        n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      u._handleInput();
    }, n.addEventListener("input", this._onInput), this._onKeyDown = function(_) {
      if (_.key !== "Backspace") return;
      const v = n.selectionStart, h = n.selectionEnd;
      if (v !== h || v === 0) return;
      const b = ce(J(n)), o = f.get.call(n), y = o[v - 1];
      if (y === b.groupSep || /\s/.test(y)) {
        _.preventDefault();
        const m = v - 2 >= 0 ? v - 2 : 0, a = o.slice(0, m) + o.slice(v);
        f.set.call(n, a), n.setSelectionRange(m, m), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, n.addEventListener("keydown", this._onKeyDown), this._onPaste = function(_) {
      _.preventDefault();
      const v = (_.clipboardData || window.clipboardData).getData("text"), h = nr(v, J(n));
      u.value = isNaN(h) ? NaN : h;
    }, n.addEventListener("paste", this._onPaste);
    const r = n.value;
    if (r !== "") {
      const _ = parseFloat(r);
      if (!isNaN(_)) {
        const v = n.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(_), this._setDisplayRaw(rt(_, J(n), { maxDecimals: v })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return n.form && (this._onFormReset = function() {
      setTimeout(function() {
        const _ = n.defaultValue;
        if (_ !== "") {
          const v = parseFloat(_);
          if (!isNaN(v)) {
            const h = n.getAttribute("data-ln-number-decimals");
            u._setHiddenRaw(v), u._setDisplayRaw(rt(v, J(n), { maxDecimals: h })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
            return;
          }
        }
        u._setHiddenRaw(""), u._setDisplayRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }, 0);
    }, n.form.addEventListener("reset", this._onFormReset)), this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom;
    let u = n.getAttribute("data-ln-value"), g = n.getAttribute("data-ln-number"), r = null;
    u !== null && u !== "" ? r = u : g !== null && g !== "" && g !== "true" ? r = g : r = n.textContent.trim();
    const _ = parseFloat(r);
    isNaN(_) ? this._rawValue = null : (this._rawValue = _, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", String(_)), this._formatTextContent());
  }, s.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const n = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = rt(this._rawValue, J(this.dom), { maxDecimals: n });
    }
  }, s.prototype._handleInput = function() {
    const n = this.dom, u = f.get.call(n);
    if (u === "") {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (u === "-") {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const g = n.selectionStart;
    let r = 0;
    for (let S = 0; S < g; S++)
      /[0-9]/.test(u[S]) && r++;
    const _ = J(n), v = ce(_);
    let h = u, b = Vn(u, v.groupSep, v.decimalSep), o = parseFloat(b);
    if (isNaN(o)) {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: u });
      return;
    }
    const y = n.getAttribute("data-ln-number-decimals"), m = b.indexOf(".");
    if (y !== null && m !== -1) {
      const S = parseInt(y, 10), C = b.slice(m + 1);
      if (S === 0)
        b = b.slice(0, m), h = h.split(v.decimalSep)[0], o = parseFloat(b), this._setDisplayRaw(h);
      else if (C.length > S) {
        b = b.slice(0, m + 1 + S);
        const L = h.split(v.decimalSep);
        h = L[0] + v.decimalSep + L[1].slice(0, S), o = parseFloat(b), this._setDisplayRaw(h);
      }
    }
    const a = n.getAttribute("data-ln-number-max");
    if (a !== null && o > parseFloat(a)) {
      const S = parseFloat(a), C = rt(S, _, { maxDecimals: y });
      this._setDisplayRaw(C), this._setHiddenRaw(S), n.setSelectionRange(C.length, C.length), k(n, "ln-number:input", { value: S, formatted: C });
      return;
    }
    if (h.endsWith(v.decimalSep) || v.decimalSep !== "." && h.endsWith(".")) {
      this._setHiddenRaw(o), k(n, "ln-number:input", { value: o, formatted: h });
      return;
    }
    const w = b.indexOf(".");
    if (w !== -1 && b.slice(w + 1).endsWith("0")) {
      this._setHiddenRaw(o), k(n, "ln-number:input", { value: o, formatted: h });
      return;
    }
    let E;
    if (y !== null)
      E = rt(o, _, { maxDecimals: y });
    else {
      const S = w !== -1 ? b.slice(w + 1).length : 0;
      E = rt(o, _, { userDecimals: S });
    }
    this._setDisplayRaw(E);
    const A = _r(E, r);
    n.setSelectionRange(A, A), this._setHiddenRaw(o), k(n, "ln-number:input", { value: o, formatted: E });
  }, s.prototype._setHiddenRaw = function(n) {
    this._hidden && f.set.call(this._hidden, String(n));
  }, s.prototype._setDisplayRaw = function(n) {
    this.isTextElement ? this.dom.textContent = String(n) : f.set.call(this.dom, String(n));
  }, s.prototype._displayFormatted = function(n) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const u = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(n, J(this.dom), { maxDecimals: u }));
    }
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const n = f.get.call(this._hidden);
      return n === "" ? NaN : parseFloat(n);
    },
    set: function(n) {
      const u = typeof n == "number" ? n : parseFloat(n);
      if (this.isTextElement) {
        isNaN(u) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = u, this.dom.setAttribute("data-ln-value", String(u)), this._formatTextContent());
        return;
      }
      if (isNaN(u)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(u);
      const g = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(u, J(this.dom), { maxDecimals: g })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : f.get.call(this.dom);
    }
  }), s.prototype.destroy = function() {
    this.dom[e] && (p.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this._onFormReset && this.dom.form && this.dom.form.removeEventListener("reset", this._onFormReset), this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, H(t, e, s, "ln-number", {
    attributes: d,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Le = /^(short|medium|long)(\s+datetime)?$/, br = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function yr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Le) ? br[t.trim()] : null;
}
function jt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let i, d;
  if (e.indexOf(".") !== -1)
    i = ".", d = e.split(".");
  else if (e.indexOf("/") !== -1)
    i = "/", d = e.split("/");
  else if (e.indexOf("-") !== -1)
    i = "-", d = e.split("-");
  else
    return null;
  if (d.length !== 3) return null;
  const f = [];
  for (let n = 0; n < 3; n++) {
    const u = parseInt(d[n], 10);
    if (isNaN(u)) return null;
    f.push(u);
  }
  let p, l, c;
  i === "." ? (p = f[0], l = f[1], c = f[2]) : i === "/" ? (l = f[0], p = f[1], c = f[2]) : d[0].length === 4 ? (c = f[0], l = f[1], p = f[2]) : (p = f[0], l = f[1], c = f[2]), c < 100 && (c += c < 50 ? 2e3 : 1900);
  const s = new Date(c, l - 1, p);
  return s.getFullYear() !== c || s.getMonth() !== l - 1 || s.getDate() !== p ? null : s;
}
function ye(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const f = t.getDate(), p = t.getMonth(), l = t.getFullYear(), c = t.getHours(), s = t.getMinutes();
  let n, u;
  const g = (i || "").toLowerCase().split("-")[0];
  let r = !1;
  try {
    const h = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    r = !!(d && h !== g);
  } catch {
    r = !!d;
  }
  if (r && d && d.monthsLong)
    n = d.monthsLong[p];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(p + 1);
    }
  if (r && d && d.monthsShort)
    u = d.monthsShort[p];
  else
    try {
      u = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      u = String(p + 1);
    }
  const _ = {
    yyyy: String(l),
    yy: String(l).slice(-2),
    MMMM: n,
    MMM: u,
    MM: String(p + 1).padStart(2, "0"),
    M: String(p + 1),
    dd: String(f).padStart(2, "0"),
    d: String(f),
    HH: String(c).padStart(2, "0"),
    mm: String(s).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return _[v] !== void 0 ? _[v] : v;
  });
}
function ne(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const f = yr(e);
  if (f)
    try {
      const p = new Intl.DateTimeFormat(i, f), l = (i || "").toLowerCase().split("-")[0], c = p.resolvedOptions().locale.toLowerCase().split("-")[0];
      return d && c !== l ? ye(t, "dd.MM.yyyy", i, d) : p.format(t);
    } catch {
      return ye(t, "dd.MM.yyyy", i, d);
    }
  return ye(t, e || "dd.MM.yyyy", i, d);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(r) {
    const _ = r[e];
    if (_) {
      if (_.isTextElement)
        _._initTextElement();
      else if (_.value) {
        const v = it(_.value);
        v && _._displayFormatted(v);
      }
    }
  }
  const d = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: i, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: i, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: i, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: i, description: "Raw ISO date string or timestamp for non-time elements (td, span)" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(r, _, v) {
    k(r.dom, "ln-date:change", {
      value: _,
      formatted: r.dom.value,
      date: v
    }), r.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(r, _, v, h) {
    r._setHiddenRaw(_), f.set.call(r._picker, _), r._lastISO = _, h !== void 0 ? (r._isFormatting = !0, r.dom.value = h, r._isFormatting = !1) : v && r._displayFormatted(v), p(r, _, v);
  }
  function c(r) {
    r._setHiddenRaw(""), f.set.call(r._picker, ""), r._isFormatting = !0, r.dom.value = "", r._isFormatting = !1, r._lastISO = "", p(r, "", null);
  }
  const s = /* @__PURE__ */ new Set();
  let n = !1;
  function u() {
    ue(), !n && (n = !0, document.addEventListener("ln-core:locale-change", function() {
      s.forEach(function(r) {
        if (r.isTextElement)
          r._formatTextContent();
        else if (r.value) {
          const _ = it(r.value);
          _ && r._displayFormatted(_);
        }
      });
    }));
  }
  function g(r) {
    if (r[e]) return r[e];
    r[e] = this, this.dom = r;
    const _ = this;
    if (s.add(this), u(), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const v = r.value, h = r.name, b = r.closest(".form-element, form") || r.parentNode;
    if (b) {
      const E = b.querySelectorAll("[data-ln-date-dict]");
      for (let A = 0; A < E.length; A++) {
        const S = E[A].getAttribute("data-ln-date-dict");
        if (S) {
          const C = kn(E[A], "data-ln-date-dict-key");
          C["months-long"] && (C.monthsLong = C["months-long"].split(",").map((L) => L.trim())), C["months-short"] && (C.monthsShort = C["months-short"].split(",").map((L) => L.trim())), Tn(S, C);
        }
      }
    }
    const o = document.createElement("span");
    o.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(o, r), o.appendChild(r), this._wrapper = o;
    const y = document.createElement("input");
    y.type = "hidden", y.name = h, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && y.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", y), this._hidden = y;
    const m = document.createElement("input");
    m.type = "date", m.tabIndex = -1, m.setAttribute("tabindex", "-1"), m.setAttribute("aria-hidden", "true"), m.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Date picker"), m.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", y.insertAdjacentElement("afterend", m), this._picker = m, r.type = "text";
    const a = document.createElement("button");
    a.type = "button", a.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Open date picker"), a.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', m.insertAdjacentElement("afterend", a), this._btn = a, this._lastISO = "", Object.defineProperty(y, "value", {
      get: function() {
        return f.get.call(y);
      },
      set: function(E) {
        if (f.set.call(y, E), E && E !== "") {
          const A = it(E);
          A && l(_, E, A);
        } else E === "" && c(_);
      }
    }), Me(r, f, {
      get: function() {
        return f.get.call(r);
      },
      set: function(E, A) {
        if (_._isFormatting) {
          A(E);
          return;
        }
        if (!E || E === "") {
          A(""), c(_);
          return;
        }
        const S = it(E) || jt(E);
        if (S) {
          const C = Ft(S), L = r.getAttribute(t) || "", I = J(r), q = Rt(I), D = ne(S, L, I, q);
          A(D), l(_, C, S, D);
        } else
          A(String(E)), c(_);
      }
    }), this._onPickerChange = function() {
      const E = m.value;
      if (E) {
        const A = it(E);
        A && l(_, E, A);
      } else
        c(_);
    }, m.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const E = _.dom.value.trim();
      if (E === "") {
        _._lastISO !== "" && c(_);
        return;
      }
      if (_._lastISO) {
        const S = it(_._lastISO);
        if (S) {
          const C = _.dom.getAttribute(t) || "", L = J(_.dom), I = Rt(L);
          if (E === ne(S, C, L, I)) return;
        }
      }
      const A = jt(E);
      if (A) {
        const S = Ft(A);
        l(_, S, A);
      } else if (_._lastISO) {
        const S = it(_._lastISO);
        S && _._displayFormatted(S);
      } else
        _.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      _._openPicker();
    }, a.addEventListener("click", this._onBtnClick);
    const w = r.form;
    if (w && (this._form = w, this._onFormReset = function() {
      setTimeout(function() {
        const E = _.dom.value;
        if (E) {
          const A = it(E) || jt(E);
          if (A) {
            const S = Ft(A);
            l(_, S, A);
            return;
          }
        }
        c(_);
      }, 0);
    }, w.addEventListener("reset", this._onFormReset)), v && v !== "") {
      const E = it(v);
      E && l(_, v, E);
    }
    return this;
  }
  g.prototype._initTextElement = function() {
    const r = this.dom, _ = r.getAttribute("data-ln-value"), v = r.getAttribute("data-ln-date"), h = r.getAttribute("datetime");
    let b = null;
    r.tagName === "TIME" && h !== null && h !== "" ? b = h : _ !== null && _ !== "" ? b = _ : h !== null && h !== "" ? b = h : v !== null && v !== "" && v !== "true" && !Le.test(v) ? b = v : b = r.textContent.trim();
    const o = it(b) || jt(b);
    if (o && !isNaN(o.getTime())) {
      const y = Ft(o);
      this._rawValue = y, r.tagName !== "TIME" && !r.hasAttribute("data-ln-value") && r.setAttribute("data-ln-value", y), this._formatTextContent();
    } else
      this._rawValue = null;
  }, g.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const r = it(this._rawValue);
      if (r) {
        let v = this.dom.getAttribute("data-ln-date-format");
        if (!v) {
          const o = this.dom.getAttribute("data-ln-date");
          o && Le.test(o) && (v = o);
        }
        const h = J(this.dom), b = Rt(h);
        this.dom.textContent = ne(r, v || "medium", h, b);
      }
    }
  }, g.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, g.prototype._setHiddenRaw = function(r) {
    f.set.call(this._hidden, r);
  }, g.prototype._displayFormatted = function(r) {
    const _ = this.dom.getAttribute(t) || "", v = J(this.dom), h = Rt(v);
    this._isFormatting = !0, this.dom.value = ne(r, _, v, h), this._isFormatting = !1;
  }, Object.defineProperty(g.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : f.get.call(this._hidden);
    },
    set: function(r) {
      if (this.isTextElement) {
        if (!r || r === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const v = it(r) || jt(r);
        if (!v) return;
        const h = Ft(v);
        this._rawValue = h, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", h) : this.dom.setAttribute("data-ln-value", h), this._formatTextContent();
        return;
      }
      if (!r || r === "") {
        c(this);
        return;
      }
      const _ = it(r);
      _ && l(this, r, _);
    }
  }), Object.defineProperty(g.prototype, "date", {
    get: function() {
      const r = this.value;
      return r ? it(r) : null;
    },
    set: function(r) {
      if (!r || !(r instanceof Date) || isNaN(r.getTime())) {
        this.value = "";
        return;
      }
      this.value = Ft(r);
    }
  }), Object.defineProperty(g.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), g.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (s.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", r && (this.dom.value = r), delete this.dom[e];
  }, H(t, e, g, "ln-date", {
    attributes: d,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-nav": { effect: l, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: It, effect: l, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, d = X(i);
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
    return this.dom = c, Y(this, c, d), this.activeClass = c.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = null, this.update(), this;
  }
  f.prototype.update = function() {
    if (!this.activeClass || Q(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, u = p(n), g = [];
    for (const r of s) {
      const _ = r.getAttribute("href");
      if (!_ || _ === "#" || _.startsWith("#") || _.startsWith("javascript:") || _.startsWith("mailto:") || _.startsWith("tel:")) {
        r.classList.remove(this.activeClass), r.removeAttribute("aria-current");
        continue;
      }
      if (r.hostname && r.hostname !== window.location.hostname) {
        r.classList.remove(this.activeClass), r.removeAttribute("aria-current");
        continue;
      }
      const v = p(_), h = v === u, b = !this.exact && v !== "/" && u.startsWith(v + "/");
      h || b ? (r.classList.add(this.activeClass), r.setAttribute("aria-current", "page"), g.push(r)) : (r.classList.remove(this.activeClass), r.removeAttribute("aria-current"));
    }
    k(this.dom, "ln-nav:update", { target: this.dom, activeLinks: g });
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
        const u = n.activeClass, g = c.getAttribute(t) || "active";
        if (u !== g) {
          const r = c.querySelectorAll("a");
          for (const _ of r)
            u && _.classList.remove(u);
          n.activeClass = g;
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
  function d() {
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
    let u = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === c) {
        u = n[v];
        break;
      }
    if (!u) return;
    const g = u.persist;
    if (f.has(g.attr) || (f.add(g.attr), Nt([g.attr], function(v, h) {
      if (!v.hasAttribute("data-ln-persist") || g.hashActive && g.hashActive(v)) return;
      const b = e(v, h);
      if (!b || !d()) return;
      const o = v.getAttribute(h);
      try {
        o === null ? localStorage.removeItem(b) : localStorage.setItem(b, o);
      } catch {
      }
    })), g.hashActive && g.hashActive(l)) return;
    const r = e(l, g.attr);
    if (!r || !d()) return;
    const _ = localStorage.getItem(r);
    _ !== null && l.setAttribute(g.attr, _);
  }
  Hi(p);
})();
function sn(t, e, i, d) {
  const f = (t || "").toLowerCase().trim();
  if (f) return f;
  if ((e || "").toUpperCase() !== "A") return "";
  const p = i || "";
  if (!p.startsWith("#")) return "";
  const l = p.slice(1);
  if (!l) return "";
  const c = l.split("&"), s = (d || "").toLowerCase().trim();
  if (s)
    for (const g of c) {
      const r = g.indexOf(":");
      if (r > 0 && g.slice(0, r).toLowerCase().trim() === s)
        return g.slice(r + 1).toLowerCase().trim();
    }
  const n = c[c.length - 1] || "", u = n.indexOf(":");
  return (u > 0 ? n.slice(u + 1) : n).toLowerCase().trim();
}
function an(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (p) => (p.tagName || "").toUpperCase() === "A" && (p.href || "").startsWith("#")
  ), d = i.length > 0 && i.length === t.length, f = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : d && !f ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: d && !!f,
    warning: null
  };
}
function ln(t, e, i) {
  const d = (t || "").toLowerCase().trim();
  return d && Array.isArray(e) && e.includes(d) ? d : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(s) {
    const n = s.getAttribute("data-ln-tabs-active");
    s[e] && s[e]._applyActive(n);
  }
  function d(s, n) {
    return (s.getAttribute(n) || s.id || "").toLowerCase().trim();
  }
  const f = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: d, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, p = X(f);
  function l(s) {
    return this.dom = s, Y(this, s, p), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const s = this.tabs.map((g) => ({
      tagName: g.tagName,
      href: g.getAttribute("href")
    })), n = an(s, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const g of this.tabs) {
      const r = sn(g.getAttribute("data-ln-tab"), g.tagName, g.getAttribute("href"), this.nsKey);
      r ? this.mapTabs[r] = g : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', g);
    }
    for (const g of this.panels) {
      const r = (g.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      r && (this.mapPanels[r] = g);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const u = this;
    this._clickHandlers = [];
    for (const g of this.tabs) {
      if (g[e + "Trigger"]) continue;
      const r = function(_) {
        const v = g.tagName === "A";
        if (!v && (_.ctrlKey || _.metaKey || _.button === 1)) return;
        const h = sn(g.getAttribute("data-ln-tab"), g.tagName, g.getAttribute("href"), u.nsKey);
        h && (v && !ze(_) || (u.hashEnabled ? st(u.nsKey) === h ? u.dom.setAttribute("data-ln-tabs-active", h) : gt(u.nsKey, h) : u.dom.setAttribute("data-ln-tabs-active", h)));
      };
      g.addEventListener("click", r), g[e + "Trigger"] = r, u._clickHandlers.push({ el: g, handler: r });
    }
    if (this._onRequestSelect = function(g) {
      const r = g.detail && (g.detail.key || g.detail.tab);
      r && u.select(r);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!u.hashEnabled) return;
      const g = st(u.nsKey);
      u.dom.setAttribute("data-ln-tabs-active", g !== null ? g : u.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const g = ln(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", g);
    }
  }
  l.prototype.select = function(s) {
    const n = (s + "").toLowerCase().trim();
    n && (this.hashEnabled ? st(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : gt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, l.prototype._applyActive = function(s) {
    var u;
    if (s = ln(s, Object.keys(this.mapPanels), this.defaultKey), s === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && Q(this.dom, "ln-tabs:before-change", {
      key: s,
      previousKey: n,
      tab: this.mapTabs[s],
      panel: this.mapPanels[s],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && st(this.nsKey) !== n && gt(this.nsKey, n));
      return;
    }
    this.activeKey = s;
    for (const g in this.mapTabs) {
      const r = this.mapTabs[g];
      g === s ? (r.hasAttribute("data-active") || r.setAttribute("data-active", ""), r.getAttribute("aria-selected") !== "true" && r.setAttribute("aria-selected", "true")) : (r.hasAttribute("data-active") && r.removeAttribute("data-active"), r.getAttribute("aria-selected") !== "false" && r.setAttribute("aria-selected", "false"));
    }
    for (const g in this.mapPanels) {
      const r = this.mapPanels[g], _ = g === s;
      r.hidden !== !_ && (r.hidden = !_), r.classList.contains("hidden") !== !_ && r.classList.toggle("hidden", !_);
      const v = _ ? "false" : "true";
      r.getAttribute("aria-hidden") !== v && r.setAttribute("aria-hidden", v);
    }
    if (this.autoFocus) {
      const g = (u = this.mapPanels[s]) == null ? void 0 : u.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      g && setTimeout(() => g.focus({ preventScroll: !0 }), 0);
    }
    k(this.dom, "ln-tabs:change", {
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
        const n = Array.from(s.querySelectorAll("[data-ln-tab]")).map(function(g) {
          return { tagName: g.tagName, href: g.getAttribute("href") };
        }), u = (s.getAttribute("data-ln-tabs-key") || s.id || "").toLowerCase().trim();
        return an(n, u).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", d = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-toggle": { effect: r, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, p = /* @__PURE__ */ new Set();
  let l = null;
  function c(_, v) {
    return v === "open" ? "open" : v === "close" || _ === "open" ? "close" : "open";
  }
  function s() {
    l || (l = function(_) {
      if (De(_)) return;
      const v = _.target.closest("[" + i + "]");
      if (!v || Re(v)) return;
      const h = v.getAttribute(i);
      if (!h) return;
      const b = document.getElementById(h);
      if (!b || !b[e]) return;
      _.preventDefault();
      const o = v.getAttribute(d) || "toggle", y = b.getAttribute(t);
      b.setAttribute(t, c(y, o));
    }, document.addEventListener("click", l));
  }
  function n() {
    p.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function u(_, v) {
    if (!_ || !_.id) return;
    const h = document.querySelectorAll(
      "[" + i + '="' + _.id + '"]'
    );
    for (let b = 0; b < h.length; b++)
      h[b].setAttribute("aria-expanded", v ? "true" : "false");
  }
  function g(_) {
    this.dom = _;
    const v = this;
    return this._onRequestOpen = function() {
      v.open();
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function() {
      v.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = _.getAttribute(t) === "open", this.isOpen && _.classList.add("open"), u(_, this.isOpen), p.add(this), s(), this;
  }
  g.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, g.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, g.prototype.toggle = function() {
    const _ = this.dom.getAttribute(t);
    this.dom.setAttribute(t, c(_, "toggle"));
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), p.delete(this), delete this.dom[e], n());
  };
  function r(_) {
    const v = _[e];
    if (!v) return;
    const b = _.getAttribute(t) === "open";
    if (b !== v.isOpen)
      if (b) {
        if (Q(_, "ln-toggle:before-open", { target: _ }).defaultPrevented) {
          _.setAttribute(t, "close");
          return;
        }
        v.isOpen = !0, _.classList.add("open"), u(_, !0), k(_, "ln-toggle:open", { target: _ });
      } else {
        if (Q(_, "ln-toggle:before-close", { target: _ }).defaultPrevented) {
          _.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, _.classList.remove("open"), u(_, !1), k(_, "ln-toggle:close", { target: _ });
      }
  }
  H(t, e, g, "ln-toggle", {
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
  function d(f) {
    return this.dom = f, this._onToggleOpen = function(p) {
      if (!p.detail || !p.detail.target || p.detail.target.closest("[data-ln-accordion]") !== f) return;
      const l = f.querySelectorAll("[data-ln-toggle]");
      for (const c of l)
        c !== p.detail.target && c.closest("[data-ln-accordion]") === f && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      k(f, "ln-accordion:change", { target: p.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, H(t, e, d, "ln-accordion", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", i = "bottom-end";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: i, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, f = X(d);
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
      const u = c._getMenuItems();
      if (u.length === 0) return;
      if (!n && (s.key === "ArrowDown" || s.key === "ArrowUp")) {
        s.preventDefault(), c.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const r = c._getMenuItems();
          r.length > 0 && c._focusItem(r, s.key === "ArrowDown" ? 0 : r.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const g = u.indexOf(document.activeElement);
      if (s.key === "ArrowDown") {
        s.preventDefault();
        const r = g < u.length - 1 ? g + 1 : 0;
        c._focusItem(u, r);
      } else if (s.key === "ArrowUp") {
        s.preventDefault();
        const r = g > 0 ? g - 1 : u.length - 1;
        c._focusItem(u, r);
      } else s.key === "Home" ? (s.preventDefault(), c._focusItem(u, 0)) : s.key === "End" && (s.preventDefault(), c._focusItem(u, u.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(s) {
      !s.detail || s.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "true"), typeof c.toggleEl.showPopover == "function" && c.toggleEl.showPopover(), c._initMenuAria(), c._reposition(), c._addOutsideClickListener(), c._addScrollRepositionListener(), c._addResizeCloseListener(), k(l, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      !s.detail || s.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "false"), c._removeOutsideClickListener(), c._removeScrollRepositionListener(), c._removeResizeCloseListener(), c.toggleEl.style.top = "", c.toggleEl.style.left = "", c.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof c.toggleEl.hidePopover == "function" && c.toggleEl.matches(":popover-open") && c.toggleEl.hidePopover(), k(l, "ln-dropdown:close", { target: s.detail.target }));
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
    const l = this.triggerBtn.getBoundingClientRect(), c = Se(this.toggleEl), s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, u = le(l, c, n, s), g = u.top + "px", r = u.left + "px";
    this.toggleEl.style.top !== g && (this.toggleEl.style.top = g), this.toggleEl.style.left !== r && (this.toggleEl.style.left = r), this.toggleEl.getAttribute("data-ln-dropdown-placement") !== u.placement && this.toggleEl.setAttribute("data-ln-dropdown-placement", u.placement);
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
    attributes: d
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", d = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: g, description: "Control state of the popover" },
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
    const _ = this;
    return this._onRequestOpen = function(v) {
      const h = v.detail && v.detail.trigger ? v.detail.trigger : null;
      _.open(h);
    }, this._onRequestClose = function() {
      _.close();
    }, this._onRequestToggle = function(v) {
      const h = v.detail && v.detail.trigger ? v.detail.trigger : null;
      _.toggle(h);
    }, this._onNativeToggle = function(v) {
      v.newState === "closed" && _.isOpen && (_._applyClose(), _.dom.setAttribute(t, "closed"));
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
    const _ = Se(this.dom);
    if (this.trigger) {
      const o = this.trigger.getBoundingClientRect(), y = this.dom.getAttribute(d) || "bottom", m = le(o, _, y, 8);
      this.dom.style.top = m.top + "px", this.dom.style.left = m.left + "px", this.dom.setAttribute("data-ln-popover-placement", m.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), h = Array.prototype.find.call(v, Gt);
    h ? h.focus() : this.dom.focus();
    const b = this;
    this._boundDocClick = function(o) {
      b.dom.contains(o.target) || b.trigger && b.trigger.contains(o.target) || b.close();
    }, b._docClickTimeout = setTimeout(function() {
      b._docClickTimeout = null, document.addEventListener("click", b._boundDocClick);
    }, 0), this._repositionRaf = null, this._performReposition = function() {
      if (!b.trigger || !document.contains(b.dom)) return;
      const o = b.trigger.getBoundingClientRect(), y = Se(b.dom), m = b.dom.getAttribute(d) || "bottom", a = le(o, y, m, 8), w = a.top + "px", E = a.left + "px";
      b.dom.style.top !== w && (b.dom.style.top = w), b.dom.style.left !== E && (b.dom.style.left = E), b.dom.getAttribute("data-ln-popover-placement") !== a.placement && b.dom.setAttribute("data-ln-popover-placement", a.placement);
    }, this._boundReposition = function() {
      b._repositionRaf || (b._repositionRaf = requestAnimationFrame(function() {
        b._repositionRaf = null, b._performReposition();
      }));
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), c(), k(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const r = p.indexOf(this);
    r !== -1 && p.splice(r, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, k(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.dom.removeEventListener("toggle", this._onNativeToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function u(r) {
    this.dom = r;
    const _ = r.getAttribute(i);
    return r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", "false"), r.setAttribute("aria-controls", _), this._onClick = function(v) {
      if (v.ctrlKey || v.metaKey || v.button === 1) return;
      v.preventDefault();
      const h = document.getElementById(_);
      if (!h) return;
      h[e] && (h[e].trigger = r);
      const b = h.getAttribute(t);
      h.setAttribute(t, b === "open" ? "closed" : "open");
    }, r.addEventListener("click", this._onClick), this;
  }
  u.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function g(r) {
    const _ = r[e];
    if (!_) return;
    const h = r.getAttribute(t) === "open";
    if (h !== _.isOpen)
      if (h) {
        if (Q(r, "ln-popover:before-open", {
          popoverId: r.id,
          target: r,
          trigger: _.trigger
        }).defaultPrevented) {
          r.setAttribute(t, "closed");
          return;
        }
        _._applyOpen(_.trigger);
      } else {
        if (Q(r, "ln-popover:before-close", {
          popoverId: r.id,
          target: r,
          trigger: _.trigger
        }).defaultPrevented) {
          r.setAttribute(t, "open");
          return;
        }
        _._applyClose();
      }
  }
  H(t, e, n, "ln-popover", {
    attributes: f
  }), H(i, e + "Trigger", u, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", d = "lnTooltipEnhance", f = "ln-tooltip-portal";
  if (window[d] !== void 0) return;
  const p = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let l = 0, c = null, s = null, n = null, u = null, g = null, r = null;
  function _() {
    return c && c.parentNode || (c = document.getElementById(f), c || (c = document.createElement("div"), c.id = f, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function v() {
    r || (r = function(m) {
      m.key === "Escape" && o();
    }, document.addEventListener("keydown", r));
  }
  function h() {
    r && (document.removeEventListener("keydown", r), r = null);
  }
  function b(m) {
    if (n === m) return;
    o();
    const a = m.getAttribute(e) || m.getAttribute("title");
    if (!a) return;
    _(), typeof c.showPopover == "function" && c.showPopover(), m.hasAttribute("title") && (u = m.getAttribute("title"), m.removeAttribute("title"));
    const w = m.getAttribute("aria-describedby");
    w ? g = w : g = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = a, m[d + "Uid"] || (l += 1, m[d + "Uid"] = "ln-tooltip-" + l), E.id = m[d + "Uid"], c.appendChild(E);
    const A = E.offsetWidth, S = E.offsetHeight, C = m.getBoundingClientRect(), L = m.getAttribute(i) || "top", I = le(C, { width: A, height: S }, L, 6);
    E.style.top = I.top + "px", E.style.left = I.left + "px", E.setAttribute("data-ln-tooltip-placement", I.placement), g ? m.setAttribute("aria-describedby", g + " " + E.id) : m.setAttribute("aria-describedby", E.id), s = E, n = m, v();
  }
  function o() {
    if (!s) {
      h();
      return;
    }
    n && (g !== null ? n.setAttribute("aria-describedby", g) : n.removeAttribute("aria-describedby"), g = null, u !== null && n.setAttribute("title", u)), u = null, s.parentNode && s.parentNode.removeChild(s), s = null, n = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), h();
  }
  function y(m) {
    return this.dom = m, m.hasAttribute("data-ln-tooltip-enhanced") || (m.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      b(m);
    }, this._onLeave = function() {
      n === m && !m.contains(document.activeElement) && o();
    }, this._onFocus = function() {
      b(m);
    }, this._onBlur = function() {
      n === m && !m.matches(":hover") && o();
    }, m.addEventListener("mouseenter", this._onEnter), m.addEventListener("mouseleave", this._onLeave), m.addEventListener("focus", this._onFocus, !0), m.addEventListener("blur", this._onBlur, !0), this;
  }
  y.prototype.destroy = function() {
    const m = this.dom;
    m.removeEventListener("mouseenter", this._onEnter), m.removeEventListener("mouseleave", this._onLeave), m.removeEventListener("focus", this._onFocus, !0), m.removeEventListener("blur", this._onBlur, !0), n === m && o(), this._addedEnhancedAttr && m.removeAttribute("data-ln-tooltip-enhanced"), delete m[d], delete m[d + "Uid"];
  }, H(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    d,
    y,
    "ln-tooltip",
    {
      attributes: p
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const d = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: xt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: xt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, f = X(d);
  function p(b) {
    if (!(!b || !(b instanceof HTMLElement)) && (b.hasAttribute("popover") || b.setAttribute("popover", "manual"), typeof b.showPopover == "function")) {
      if (b.matches(":popover-open"))
        try {
          b.hidePopover();
        } catch {
        }
      try {
        b.showPopover();
      } catch {
      }
    }
  }
  function l(b) {
    if (!b || !(b instanceof HTMLElement)) return;
    if (b.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof b.hidePopover == "function" && b.matches(":popover-open"))
      try {
        b.hidePopover();
      } catch {
      }
  }
  function c(b) {
    this.dom = b, Y(this, b, f);
    const o = Array.from(b.querySelectorAll("[data-ln-toast-item]"));
    for (; o.length > this.max; ) b.removeChild(o.shift());
    for (const y of o) _(y, this);
    return o.length > 0 && p(b), this;
  }
  c.prototype.enqueue = function(b) {
    if (!b) return;
    const o = s(b, this.dom);
    if (!o) return;
    const y = Number.isFinite(b.timeout) ? b.timeout : this.timeoutDefault;
    u(this, o), y > 0 && (o._timer = setTimeout(() => g(o), y));
  }, c.prototype.clear = function() {
    for (const b of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      g(b);
  }, c.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const b of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        g(b);
      l(this.dom), delete this.dom[e];
    }
  };
  function s(b, o) {
    const y = ((b.type || "") + "").trim().toLowerCase(), m = Lt(o, i, "ln-toast");
    if (!m)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    ft(m, {
      type: y,
      title: b.title,
      message: typeof b.message == "string" ? b.message : void 0
    });
    const a = m.firstElementChild;
    if (!a) return null;
    a.hasAttribute("data-ln-toast-item") || a.setAttribute("data-ln-toast-item", ""), a.classList.add("ln-enter");
    const w = a.querySelector(".body");
    w && n(w, b);
    const E = a.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      g(a);
    }), a;
  }
  function n(b, o) {
    if (Array.isArray(o.message)) {
      const y = document.createElement("ul");
      for (const m of o.message) {
        const a = document.createElement("li");
        a.textContent = m, y.appendChild(a);
      }
      b.appendChild(y);
    }
    if (o.data && o.data.errors) {
      const y = document.createElement("ul");
      for (const m of Object.values(o.data.errors).flat()) {
        const a = document.createElement("li");
        a.textContent = m, y.appendChild(a);
      }
      b.appendChild(y);
    }
  }
  function u(b, o) {
    const y = Array.from(b.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; y.length >= b.max && y.length > 0; ) b.dom.removeChild(y.shift());
    b.dom.appendChild(o), p(b.dom), requestAnimationFrame(() => o.classList.remove("ln-enter"));
  }
  function g(b) {
    if (!b || !b.parentNode) return;
    const o = b.parentNode;
    clearTimeout(b._timer), b.classList.remove("ln-enter"), b.classList.add("ln-out"), setTimeout(() => {
      b.parentNode && (b.parentNode.removeChild(b), l(o));
    }, 200);
  }
  function r(b) {
    let o = b && b.container;
    return typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), o || null;
  }
  function _(b, o) {
    if (b._lnToastHydrated) return;
    b._lnToastHydrated = !0;
    const y = b.querySelector("[data-ln-toast-close]");
    y && y.addEventListener("click", function() {
      g(b);
    });
    const m = +(b.getAttribute("data-ln-toast-timeout") ?? o.timeoutDefault);
    m > 0 && (b._timer = setTimeout(function() {
      g(b);
    }, m));
  }
  function v(b) {
    const o = b.detail || {}, y = r(o);
    if (!y) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (y[e] || (y[e] = new c(y))).enqueue(o);
  }
  function h(b) {
    const o = b && b.detail || {};
    if (o.container) {
      const y = r(o);
      y && (y[e] || (y[e] = new c(y))).clear();
    } else {
      const y = document.querySelectorAll("[" + t + "]");
      for (const m of Array.from(y))
        (m[e] || (m[e] = new c(m))).clear();
    }
  }
  ct(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", h), window.addEventListener("ln-modal:open", function() {
      const b = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const o of Array.from(b))
        o.querySelectorAll("[data-ln-toast-item]").length > 0 && p(o);
    });
  }, "ln-toast"), H(t, e, c, "ln-toast", {
    attributes: d
  });
})();
function vr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function di(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function wr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = di(t.name), d = String(t.type || "").toLowerCase();
  return e.some((f) => {
    if (f.includes("/")) {
      if (f.endsWith("/*")) {
        const p = f.slice(0, -1);
        return d.startsWith(p);
      }
      return d === f;
    }
    return i === f;
  });
}
function Er(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const d = 1024, f = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], p = Math.floor(Math.log(t) / Math.log(d)), l = Math.min(p, f.length - 1), c = t / Math.pow(d, l);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(c) + " " + f[l];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", d = "file_ids[]";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-upload": { prop: "uploadUrl", read: j, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: j, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: j, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: j, type: "string", fallback: d, description: "Form field name for submitting uploaded file IDs" },
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
  function l(n, u, g) {
    return Er(n, u, g);
  }
  function c() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function s(n) {
    this.dom = n, Y(this, n, p), this.dict = kn(n, "data-ln-upload-dict"), this.locale = J(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const u = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = vr(u), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  s.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const u = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let r = 0; r < u.length; r++) {
      const _ = u[r], v = _.getAttribute("data-ln-upload-id"), h = "file-" + ++n.fileIdCounter;
      _.setAttribute("data-ln-upload-local-id", h);
      const b = _.querySelector('[data-ln-field="name"]'), o = _.querySelector('[data-ln-field="sizeText"]'), y = _.getAttribute("data-ln-upload-size"), m = y ? parseInt(y, 10) : null;
      n.uploadedFiles.set(h, {
        serverId: v || null,
        name: b ? b.textContent.trim() : "",
        size: m !== null && !isNaN(m) ? m : o ? o.textContent.trim() : ""
      });
    }
    const g = this.dom.querySelectorAll('input[type="hidden"]');
    for (let r = 0; r < g.length; r++) {
      const _ = g[r];
      if (_.name === n.idsFieldName && _.value && !Array.from(n.uploadedFiles.values()).some(function(h) {
        return String(h.serverId) === String(_.value);
      })) {
        const h = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(h, {
          serverId: _.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, s.prototype._syncHiddenInputs = function() {
    const n = this, u = this.dom.querySelectorAll('input[type="hidden"]');
    for (let g = 0; g < u.length; g++)
      u[g].name === n.idsFieldName && u[g].remove();
    for (const [, g] of this.uploadedFiles)
      if (g.serverId) {
        const r = document.createElement("input");
        r.type = "hidden", r.name = n.idsFieldName, r.value = g.serverId, n.dom.appendChild(r);
      }
  }, s.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(u) {
      n.zone === n.dom && u.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && u.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(u) {
      u.preventDefault(), u.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(u) {
      u.preventDefault(), u.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(u) {
      u.preventDefault(), u.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(u) {
      u.preventDefault(), u.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), u.dataTransfer && u.dataTransfer.files && n.upload(u.dataTransfer.files);
    }, this._onListClick = function(u) {
      const g = u.target.closest('[data-ln-upload-action="remove"]');
      if (!g || !n.list || !n.list.contains(g) || g.disabled) return;
      const r = g.closest("[data-ln-upload-item]");
      if (r) {
        const _ = r.getAttribute("data-ln-upload-local-id");
        _ && n.remove(_);
      }
    }, this._onRequestUpload = function(u) {
      u.detail && u.detail.files && n.upload(u.detail.files);
    }, this._onRequestRemove = function(u) {
      if (u.detail) {
        const g = u.detail.localId !== void 0 ? u.detail.localId : u.detail.serverId;
        g !== void 0 && n.remove(g);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, s.prototype.upload = function(n) {
    const u = this, g = Array.from(n);
    for (let r = 0; r < g.length; r++) {
      const _ = g[r];
      if (u.maxFiles > 0 && u.uploadedFiles.size >= u.maxFiles) {
        k(u.dom, "ln-upload:invalid", {
          file: _,
          reason: "max-files"
        });
        continue;
      }
      if (!wr(_, u.allowedExts)) {
        k(u.dom, "ln-upload:invalid", {
          file: _,
          reason: "accept"
        });
        continue;
      }
      if (u.maxSize > 0 && _.size > u.maxSize) {
        k(u.dom, "ln-upload:invalid", {
          file: _,
          reason: "max-size"
        });
        continue;
      }
      Q(u.dom, "ln-upload:before-upload", { file: _ }).defaultPrevented || u._uploadSingleFile(_);
    }
  }, s.prototype._uploadSingleFile = function(n) {
    const u = this, g = "file-" + ++u.fileIdCounter, r = di(n.name);
    let _ = null;
    if (this.list) {
      const y = Lt(this.dom, "ln-upload-item", "ln-upload");
      if (y && (_ = y.firstElementChild, _)) {
        _.setAttribute("data-ln-upload-item", ""), _.setAttribute("data-ln-upload-local-id", g), _.setAttribute("data-ln-upload-ext", r), _.setAttribute("data-ln-upload-state", "uploading"), ft(_, {
          name: n.name,
          sizeText: "0%",
          removeLabel: u.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const m = _.querySelector('[data-ln-upload-action="remove"]');
        m && (m.disabled = !0);
        const a = _.querySelector("[data-ln-progress]");
        a && a.setAttribute("data-ln-progress", "0"), u.list.appendChild(_);
      }
    }
    const v = new FormData();
    v.append(u.fileFieldName, n);
    const h = this.dom.querySelectorAll("input, select, textarea");
    for (let y = 0; y < h.length; y++) {
      const m = h[y];
      !m.name || m.name === u.idsFieldName || m.type === "file" || (m.type === "checkbox" || m.type === "radio") && !m.checked || v.append(m.name, m.value);
    }
    const b = new XMLHttpRequest();
    u.uploadedFiles.set(g, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: b
    }), b.upload.addEventListener("progress", function(y) {
      if (y.lengthComputable) {
        const m = Math.round(y.loaded / y.total * 100);
        if (_) {
          const a = _.querySelector("[data-ln-progress]");
          a && a.setAttribute("data-ln-progress", String(m)), ft(_, { sizeText: m + "%" });
        }
        k(u.dom, "ln-upload:progress", {
          localId: g,
          file: n,
          percent: m,
          loaded: y.loaded,
          total: y.total
        });
      }
    }), b.addEventListener("load", function() {
      const y = u.uploadedFiles.get(g);
      if (y && delete y.xhr, b.status >= 200 && b.status < 300) {
        let m;
        try {
          m = JSON.parse(b.responseText);
        } catch (w) {
          o(u.dict.error || "Error", b.status, w);
          return;
        }
        const a = m.id || m.serverId;
        if (_) {
          _.removeAttribute("data-ln-upload-state"), a && _.setAttribute("data-ln-upload-id", String(a)), ft(_, {
            sizeText: l(m.size || n.size, u.locale, u.dict),
            uploading: !1
          });
          const w = _.querySelector('[data-ln-upload-action="remove"]');
          w && (w.disabled = !1);
        }
        y && (y.serverId = a, y.size = m.size || n.size, y.name = m.name || n.name), u._syncHiddenInputs(), k(u.dom, "ln-upload:uploaded", {
          localId: g,
          serverId: a,
          name: m.name || n.name,
          size: m.size || n.size,
          response: m
        });
      } else {
        let m = "";
        try {
          m = JSON.parse(b.responseText).message || "";
        } catch {
        }
        o(m, b.status, null);
      }
    }), b.addEventListener("error", function() {
      const y = u.uploadedFiles.get(g);
      y && delete y.xhr, o("", 0, null);
    });
    function o(y, m, a) {
      if (_) {
        _.setAttribute("data-ln-upload-state", "error"), ft(_, {
          sizeText: u.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const w = _.querySelector('[data-ln-upload-action="remove"]');
        w && (w.disabled = !1);
      }
      k(u.dom, "ln-upload:error", {
        file: n,
        message: y,
        status: m,
        error: a
      });
    }
    u.uploadUrl ? (b.open("POST", u.uploadUrl), b.setRequestHeader("X-CSRF-TOKEN", c()), b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), b.setRequestHeader("Accept", "application/json"), b.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, s.prototype.remove = function(n) {
    const u = this;
    let g = null, r = null;
    if (u.uploadedFiles.has(n))
      g = n, r = u.uploadedFiles.get(n);
    else
      for (const [b, o] of u.uploadedFiles)
        if (String(o.serverId) === String(n)) {
          g = b, r = o;
          break;
        }
    if (!g || !r || Q(u.dom, "ln-upload:before-remove", {
      localId: g,
      serverId: r.serverId
    }).defaultPrevented) return;
    const v = u.list ? u.list.querySelector('[data-ln-upload-local-id="' + g + '"]') : null;
    if (r.xhr && typeof r.xhr.abort == "function" && r.xhr.abort(), !r.serverId) {
      v && v.remove(), u.uploadedFiles.delete(g), u._syncHiddenInputs(), k(u.dom, "ln-upload:removed", { localId: g, serverId: null });
      return;
    }
    let h = null;
    if (u.deleteUrlPattern ? h = u.deleteUrlPattern.replace("{id}", encodeURIComponent(r.serverId)) : u.uploadUrl && u.uploadUrl.includes("{id}") && (h = u.uploadUrl.replace("{id}", encodeURIComponent(r.serverId))), !h) {
      v && v.remove(), u.uploadedFiles.delete(g), u._syncHiddenInputs(), k(u.dom, "ln-upload:removed", { localId: g, serverId: r.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), ft(v, { deleting: !0 })), fetch(h, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": c(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(b) {
      b.ok ? (v && v.remove(), u.uploadedFiles.delete(g), u._syncHiddenInputs(), k(u.dom, "ln-upload:removed", {
        localId: g,
        serverId: r.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), ft(v, { deleting: !1 })), k(u.dom, "ln-upload:error", {
        file: r,
        message: "",
        status: b.status
      }));
    }).catch(function(b) {
      v && (v.removeAttribute("data-ln-upload-state"), ft(v, { deleting: !1 })), k(u.dom, "ln-upload:error", {
        file: r,
        message: "",
        status: 0,
        error: b
      });
    });
  }, s.prototype.clear = function() {
    const n = this;
    if (!Q(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, g] of this.uploadedFiles)
        if (g.xhr && typeof g.xhr.abort == "function" && g.xhr.abort(), g.serverId) {
          let r = null;
          n.deleteUrlPattern ? r = n.deleteUrlPattern.replace("{id}", encodeURIComponent(g.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (r = n.uploadUrl.replace("{id}", encodeURIComponent(g.serverId))), r && fetch(r, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": c(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), k(n.dom, "ln-upload:cleared", {});
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
function ui(t, e) {
  if (t.length !== 1) return t;
  const i = t.charCodeAt(0);
  if (i >= 65 && i <= 90) {
    const d = ((i - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + d);
  }
  if (i >= 97 && i <= 122) {
    const d = ((i - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + d);
  }
  if (i >= 48 && i <= 57) {
    const d = ((i - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + d);
  }
  return t;
}
function fi(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let d = "";
    const f = i.length;
    for (let p = 0; p < f; p++)
      d += String.fromCharCode(i[p]);
    return btoa(d);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function hi(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), d = new Uint8Array(i.length);
      for (let f = 0; f < i.length; f++)
        d[f] = i.charCodeAt(f);
      return new TextDecoder().decode(d);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function pi(t, e) {
  const i = String(e || "ln-ashlar");
  let d;
  typeof TextEncoder < "u" ? d = new TextEncoder().encode(i) : typeof Buffer < "u" ? d = Buffer.from(i, "utf-8") : d = [108, 110];
  const f = d.length || 1, p = new Uint8Array(t.length);
  for (let l = 0; l < t.length; l++)
    p[l] = t[l] ^ d[l % f];
  return p;
}
function mi(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let d;
  if (typeof TextEncoder < "u")
    d = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    d = Buffer.from(i, "utf-8");
  else
    return "";
  const f = pi(d, e);
  let p = "";
  for (let l = 0; l < f.length; l++)
    p += String.fromCharCode(f[l]);
  return typeof btoa < "u" ? btoa(p) : typeof Buffer < "u" ? Buffer.from(f).toString("base64") : "";
}
function gi(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const i = String(t).trim();
    let d = "";
    if (typeof atob < "u")
      d = atob(i);
    else if (typeof Buffer < "u")
      d = Buffer.from(i, "base64").toString("binary");
    else
      return t;
    const f = new Uint8Array(d.length);
    for (let l = 0; l < d.length; l++)
      f[l] = d.charCodeAt(l);
    const p = pi(f, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(p);
    if (typeof Buffer < "u")
      return Buffer.from(p).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function _i(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", d = Number(t.shift) || 13, f = t.key || "ln-ashlar";
    return { codec: i, shift: d, key: f };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function Ar(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = _i(e);
  return i.codec === "base64" ? fi(t) : i.codec === "xor" ? mi(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (d) => ui(d, i.shift));
}
function ve(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = _i(e);
  return i.codec === "base64" ? hi(t) : i.codec === "xor" ? gi(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (d) => ui(d, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(l) {
    const c = l[e];
    c && c.deobfuscate();
  }
  const d = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function f(l) {
    return l[e] ? l[e] : (l[e] = this, this.dom = l, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  f.prototype.deobfuscate = function() {
    const l = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && l && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((b) => !this.dom.contains(b.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const b = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(o) {
          return o.parentElement && o.parentElement.classList && o.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; b.nextNode(); )
        this._originalTextNodes.push({
          node: b.currentNode,
          raw: b.currentNode.nodeValue
        });
    }
    const s = this.dom.getAttribute(t), n = parseInt(s, 10), u = isNaN(n) ? 13 : n, g = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), r = this.dom.getAttribute("data-ln-obfuscator-key");
    let _ = "rot";
    g === "xor" || g === "base64" ? _ = g : r && (_ = "xor");
    const v = r || "ln-ashlar", h = { codec: _, shift: u, key: v };
    if (l && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const b = this.dom.querySelectorAll(".sr-only");
      for (let y = 0; y < b.length; y++)
        b[y].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const o = (this.dom.rel || "").split(/\s+/).filter(function(y) {
        return y && y !== "noopener" && y !== "noreferrer";
      });
      o.length > 0 ? this.dom.rel = o.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let b = 0; b < this._originalTextNodes.length; b++) {
        const o = this._originalTextNodes[b];
        o.node && o.raw && o.raw.length > 0 && (o.node.nodeValue = ve(o.raw, h));
      }
    if (l && this._originalHref) {
      const b = ve(this._originalHref, h);
      this.dom.setAttribute("href", b);
    }
    k(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: _,
      shift: u,
      key: _ === "xor" ? v : null
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
    attributes: d
  });
  p.obfuscate = Ar, p.deobfuscate = ve, p.utf8ToBase64 = fi, p.base64ToUtf8 = hi, p.xorObfuscate = mi, p.xorDeobfuscate = gi;
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
    n.className = "sr-only", n.textContent = "(opens in new tab)", c.appendChild(n), c.setAttribute("data-ln-external-link", "processed"), k(c, "ln-external-links:processed", {
      link: c,
      href: c.href
    });
  }
  function d(c) {
    c = c || document.body;
    for (const s of c.querySelectorAll("a, area"))
      i(s);
  }
  function f() {
    ct(function() {
      document.body.addEventListener("click", function(c) {
        const s = c.target.closest("a, area");
        s && s.getAttribute("data-ln-external-link") === "processed" && k(s, "ln-external-links:clicked", {
          link: s,
          href: s.href,
          text: s.textContent || s.title || ""
        });
      });
    }, "ln-external-links");
  }
  function p() {
    ct(function() {
      te({
        onInit: function(c) {
          if (c.matches && (c.matches("a") || c.matches("area")) && i(c), c.querySelectorAll)
            for (const s of c.querySelectorAll("a, area"))
              i(s);
        }
      }), Nt(["href"], function(c) {
        c.matches && (c.matches("a") || c.matches("area")) && i(c);
      });
    }, "ln-external-links");
  }
  function l() {
    f(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      d();
    }) : d();
  }
  window[t] = {
    process: d
  }, l();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function d() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function f(o) {
    i && (i.textContent = o, i.classList.add("ln-link-status--visible"));
  }
  function p() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function l(o, y) {
    if (y.target.closest("a, button, input, select, textarea")) return;
    const m = o.querySelector("a");
    if (!m) return;
    const a = m.getAttribute("href");
    if (!a) return;
    if (y.ctrlKey || y.metaKey || y.button === 1) {
      window.open(a, "_blank", "noopener,noreferrer");
      return;
    }
    Q(o, "ln-link:navigate", { target: o, href: a, link: m }).defaultPrevented || m.click();
  }
  function c(o) {
    const y = o.querySelector("a");
    if (!y) return;
    const m = y.getAttribute("href");
    m && f(m);
  }
  function s() {
    p();
  }
  function n(o) {
    o[e + "Row"] || !o.querySelector("a") || (o[e + "Row"] = !0, o._lnLinkClick = function(m) {
      l(o, m);
    }, o._lnLinkEnter = function() {
      c(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", s));
  }
  function u(o) {
    o[e + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", s), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[e + "Row"]);
  }
  function g(o) {
    if (!o[e + "Init"]) return;
    const y = o.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const m = y === "TABLE" && o.querySelector("tbody") || o;
      for (const a of m.querySelectorAll("tr"))
        u(a);
    } else
      u(o);
    delete o[e + "Init"];
  }
  function r(o) {
    if (o[e + "Init"]) return;
    o[e + "Init"] = !0;
    const y = o.tagName;
    if (y === "TABLE" || y === "TBODY") {
      const m = y === "TABLE" && o.querySelector("tbody") || o;
      for (const a of m.querySelectorAll("tr"))
        n(a);
    } else
      n(o);
  }
  function _(o) {
    o.hasAttribute && o.hasAttribute(t) && r(o);
    const y = o.querySelectorAll ? o.querySelectorAll("[" + t + "]") : [];
    for (const m of y)
      r(m);
  }
  function v() {
    ct(function() {
      te({
        query: "[" + t + "]",
        onInit: function(o) {
          _(o);
        },
        onSubtreeChange: function(o, y) {
          for (let m = 0; m < y.addedNodes.length; m++) {
            const a = y.addedNodes[m];
            if (a.nodeType === 1) {
              if (a.tagName === "TR")
                n(a);
              else if (a.querySelectorAll) {
                const w = a.querySelectorAll("tr");
                for (let E = 0; E < w.length; E++)
                  n(w[E]);
              }
            }
          }
        }
      }), Nt([t], function(o) {
        o.hasAttribute && o.hasAttribute(t) ? _(o) : g(o);
      });
    }, "ln-link");
  }
  function h(o) {
    _(o);
  }
  window[e] = { init: h, destroy: g };
  function b() {
    d(), v(), h(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", b) : b();
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
  function d(f) {
    if (f[e]) return f[e];
    if (!(!f || f.tagName !== "A" && f.tagName !== "BUTTON"))
      return f[e] = this, this.dom = f, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  d.prototype._handleClick = function(f) {
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
      const v = p.replace(/^#/, "");
      l = document.getElementById(v);
    }
    if (!l) return;
    f.preventDefault();
    const c = this.dom.getAttribute("data-ln-scroll-set");
    if (c) {
      const _ = c.indexOf(":");
      if (_ !== -1) {
        const v = c.slice(0, _).trim(), h = c.slice(_ + 1).trim();
        try {
          const b = document.querySelector(v);
          b && (b.value = h, b.dispatchEvent(new Event("input", { bubbles: !0 })), b.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (Q(this.dom, "ln-scroll:before-scroll", {
      target: l,
      link: this.dom,
      href: p
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", u = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (l.scrollIntoView({ behavior: n, block: u }), It(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", p);
      } catch {
      }
    const r = this.dom.getAttribute("data-ln-scroll-focus");
    if (r !== "false" && r !== "0") {
      const _ = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), v = isNaN(_) ? 450 : _;
      window.setTimeout(function() {
        let h = null;
        if (r && r !== "true" && r !== "1")
          try {
            h = document.querySelector(r);
          } catch {
          }
        h || (h = l.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !h && l.getAttribute("tabindex") !== null && (h = l), h && typeof h.focus == "function" && h.focus({ preventScroll: !0 });
      }, v);
    }
    k(this.dom, "ln-scroll:scrolled", {
      target: l,
      link: this.dom,
      href: p
    });
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, H(t, e, d, "ln-scroll", {
    attributes: i
  });
})();
const Vt = ["Ctrl", "Alt", "Shift", "Meta"], Sr = {
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
function bi(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = Sr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function yi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), d = /* @__PURE__ */ new Set();
  let f = "";
  for (let l = 0; l < i.length; l++) {
    const c = bi(i[l]);
    if (!c) return "";
    if (Vt.indexOf(c) !== -1) {
      d.add(c);
      continue;
    }
    if (f) return "";
    f = c;
  }
  if (!f) return "";
  const p = [];
  for (let l = 0; l < Vt.length; l++)
    d.has(Vt[l]) && p.push(Vt[l]);
  return p.push(f), p.join("+");
}
function Cr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), d = [];
  for (let f = 0; f < i.length; f++) {
    const p = yi(i[f]);
    p && d.indexOf(p) === -1 && d.push(p);
  }
  return d;
}
function Tr(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const d = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(d) ? "" : yi(d ? d + "+" + i : i);
}
function kr(t) {
  if (!t) return "";
  const e = bi(t.key);
  if (!e || Vt.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function Lr(t) {
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
function xr(t, e, i, d) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const f = String(e.tagName || "").toLowerCase();
  return f === "button" ? d === "Enter" || d === "Space" : f === "a" && e.hasAttribute && e.hasAttribute("href") && d === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", d = "data-ln-key-allow-input", f = "data-ln-key-modifier", p = "data-ln-key-for", l = "lnKeyFor";
  if (window[e] !== void 0) return;
  function c(y) {
    const m = y[e];
    if (m) {
      if (!y.hasAttribute(t)) {
        m.destroy();
        return;
      }
      m.sync();
    }
  }
  function s(y) {
    const m = y[l];
    m && !y.hasAttribute(p) && m.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: c, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: c, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: c, description: "Permits shortcut execution even when focused inside an editable input" }
  }, u = {
    "data-ln-key-for": { type: "string", effect: s, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, g = /* @__PURE__ */ new Set();
  let r = null;
  function _() {
    r || (r = function(y) {
      if (y.defaultPrevented || y.isComposing || y.repeat) return;
      const m = kr(y);
      if (!m) return;
      const a = Ui(y.target), w = document.querySelectorAll("[" + t + "], [" + p + "]");
      let E = null, A = !1, S = !1;
      for (let I = 0; I < w.length; I++) {
        const q = w[I], D = q[e] || q[l];
        if (!D || !D.matches(m) || a && !D.allowsInput()) continue;
        const O = D.resolveTarget(), F = Lr(O);
        if (!(!F || !zi(O, F))) {
          if (xr(y, O, F, m)) {
            S = !0;
            continue;
          }
          E ? A = !0 : E = { host: q, target: O, action: F };
        }
      }
      if (S || !E) return;
      A && console.warn('[ln-key] Duplicate active shortcut "' + m + '"; first DOM match wins.');
      const C = {
        source: E.host,
        target: E.target,
        action: E.action,
        key: m,
        event: y
      };
      Q(E.host, "ln-key:before-trigger", C).defaultPrevented || (y.preventDefault(), E.target[E.action](), k(E.host, "ln-key:trigger", C));
    }, document.addEventListener("keydown", r));
  }
  function v() {
    g.size > 0 || !r || (document.removeEventListener("keydown", r), r = null);
  }
  function h(y) {
    return this.dom = y, this.shortcuts = [], g.add(this), this.sync(), _(), this;
  }
  h.prototype.sync = function() {
    this.shortcuts = Cr(this.dom.getAttribute(t));
  }, h.prototype.matches = function(y) {
    return this.shortcuts.indexOf(y) !== -1;
  }, h.prototype.allowsInput = function() {
    return this.dom.hasAttribute(d);
  }, h.prototype.resolveTarget = function() {
    const y = this.dom.getAttribute(i);
    return y ? o(y, i) : this.dom;
  }, h.prototype.destroy = function() {
    this.dom[e] && (g.delete(this), delete this.dom[e], v());
  };
  function b(y) {
    return this.dom = y, g.add(this), _(), this;
  }
  b.prototype._modifierContext = function() {
    return this.dom.closest("[" + f + "]");
  }, b.prototype.shortcut = function() {
    const y = this._modifierContext(), m = y ? y.getAttribute(f) : "";
    return Tr(m, this.dom.textContent);
  }, b.prototype.matches = function(y) {
    return this.shortcut() === y;
  }, b.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(d)) return !0;
    const y = this._modifierContext();
    return !!(y && y.hasAttribute(d));
  }, b.prototype.resolveTarget = function() {
    return o(this.dom.getAttribute(p), p);
  }, b.prototype.destroy = function() {
    this.dom[l] && (g.delete(this), delete this.dom[l], v());
  };
  function o(y, m) {
    if (!y) return null;
    try {
      const a = document.querySelector(y);
      return a || console.warn("[ln-key] Target not found for " + m + ' selector "' + y + '".'), a;
    } catch {
      return console.warn("[ln-key] Invalid " + m + ' selector "' + y + '".'), null;
    }
  }
  H(t, e, h, "ln-key", {
    attributes: n
  }), H(p, l, b, "ln-key-for", {
    attributes: u
  });
})();
function Ir(t, e, i = 100) {
  if (e != null && e !== "") {
    const d = parseFloat(String(e));
    if (!isNaN(d) && d > 0) return d;
  }
  if (t != null && t !== "") {
    const d = parseFloat(String(t));
    if (!isNaN(d) && d > 0) return d;
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
  const d = {
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
    const l = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, s = c ? c.getAttribute("data-ln-progress-max") : null, n = this.dom.getAttribute("data-ln-progress-max"), u = Ir(n, s, 100), g = Wn(l, u);
    this.dom.style.width = g.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(g.min)), this.dom.setAttribute("aria-valuemax", String(g.max)), this.dom.setAttribute("aria-valuenow", String(g.clampedValue)), k(this.dom, "ln-progress:change", {
      target: this.dom,
      value: g.value,
      max: g.max,
      percentage: g.percentage
    });
  }
  H(
    t,
    e,
    f,
    "ln-progress",
    {
      attributes: d
    }
  ), Nt(["data-ln-progress-max"], function(l) {
    const c = l.querySelectorAll ? l.querySelectorAll(t) : [];
    for (let s = 0; s < c.length; s++) {
      const n = c[s][e];
      n && p.call(n);
    }
  });
})();
function qr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function Dr(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const d = Object.keys(e);
  if (d.length === 0) return !0;
  for (let f = 0; f < d.length; f++) {
    const p = e[d[f]];
    let l = "";
    if (p.col !== null && p.col !== void 0 ? l = t[p.col] || "" : p.attr && i && typeof i.getAttribute == "function" && (l = i.getAttribute(p.attr) || ""), !Ke(l, p.values))
      return !1;
  }
  return !0;
}
function cn(t, e, i, d) {
  if (d != null && !isNaN(d))
    return parseInt(d, 10);
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
      const c = f[l], n = Array.from(c.childNodes || []).filter((g) => g.nodeType === 3), u = (n.length > 0 ? n.map((g) => g.textContent.trim()).join(" ") : c.textContent || "").trim().toLowerCase();
      if (u && u === p)
        return typeof c.cellIndex == "number" ? c.cellIndex : l;
    }
  }
  return null;
}
function Rr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let d = 0; d < t.length; d++) {
    const f = t[d];
    !e && f.key && (e = f.key), f.checked && !f.isReset && f.value && i.push(f.value);
  }
  return { key: e, values: i };
}
function Or(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function dn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", d = "data-ln-filter-value", f = "data-ln-filter-hide", p = "data-ln-filter-reset", l = "data-ln-filter-col", c = "data-ln-hash", s = "data-ln-filter-values", n = "data-ln-filter-target", u = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-filter": { prop: "targetId", type: "string", read: j, fallback: null, effect: m, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: m, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: m, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-filter-target": { type: "marker", description: "Marker on target container or table observed by ln-filter" }
  }, r = X(g);
  function _(a) {
    return a.hasAttribute(p) || !a.getAttribute(d);
  }
  function v(a) {
    const w = a.dom.querySelectorAll("[" + i + "]"), E = [];
    for (let S = 0; S < w.length; S++) {
      const C = w[S];
      E.push({
        key: C.getAttribute(i),
        value: C.getAttribute(d) || "",
        checked: C.checked,
        isReset: _(C)
      });
    }
    const A = Rr(E);
    return { key: A.key, values: A.values, targetId: a.targetId };
  }
  function h(a, w, E) {
    const A = a.querySelectorAll("[" + i + "]"), S = Array.isArray(E) && E.length > 0;
    for (let C = 0; C < A.length; C++) {
      const L = A[C];
      _(L) ? L.checked = !S : S && L.getAttribute(i) === w && E.indexOf(L.getAttribute(d)) !== -1 ? L.checked = !0 : L.checked = !1;
    }
  }
  function b(a) {
    this.dom = a, Y(this, a, r);
    const w = a.getAttribute(l);
    this.colIndex = w !== null ? parseInt(w, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = St(a, "filter"), this.hashEnabled = !!this.nsKey;
    const E = this, A = Ht(function() {
      E._render();
    });
    this._queueRender = A;
    const S = Ht(function() {
      E._destroyed || E._applyDomFilter();
    });
    this._queueDomFilter = S;
    function C() {
      if (!E.targetId) return;
      const I = document.getElementById(E.targetId);
      I && !I.hasAttribute(n) && I.setAttribute(n, E.targetId);
    }
    this._ensureTargetMarked = C, C(), mt(function() {
      E._destroyed || C();
    }), this._attachHandlers(), this._onHashChange = function() {
      if (E._destroyed || !E.hashEnabled) return;
      const I = st(E.nsKey), q = Ae(I);
      q && q.key && q.values.length > 0 ? h(E.dom, q.key, q.values) : h(E.dom, null, []), E._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let L = !1;
    if (this.hashEnabled) {
      const I = st(this.nsKey), q = Ae(I);
      q && q.key && q.values.length > 0 && (h(a, q.key, q.values), mt(function() {
        E._destroyed || E._render();
      }), L = !0);
    }
    if (!L) {
      const I = dn(a.getAttribute(s));
      if (I.length > 0) {
        const q = a.querySelector("[" + i + "]"), D = q ? q.getAttribute(i) : null;
        D && (h(a, D, I), mt(function() {
          E._destroyed || E._render();
        }), L = !0);
      }
    }
    if (!L) {
      const I = a.querySelectorAll("[" + i + "]");
      for (let q = 0; q < I.length; q++)
        if (I[q].checked && !_(I[q])) {
          mt(function() {
            E._destroyed || E._render();
          });
          break;
        }
    }
    return this;
  }
  b.prototype._attachHandlers = function() {
    const a = this;
    this._onDomChange = function(w) {
      const E = w.target;
      if (!E || !E.hasAttribute || !E.hasAttribute(i)) return;
      const A = Array.from(a.dom.querySelectorAll("[" + i + "]"));
      if (_(E)) {
        for (let S = 0; S < A.length; S++)
          _(A[S]) || (A[S].checked = !1);
        E.checked = !0, a._queueRender();
        return;
      }
      if (E.checked) {
        for (let C = 0; C < A.length; C++)
          _(A[C]) && (A[C].checked = !1);
        let S = !1;
        for (let C = 0; C < A.length; C++)
          if (_(A[C])) {
            S = !0;
            break;
          }
        if (S) {
          let C = !0;
          for (let L = 0; L < A.length; L++)
            if (!_(A[L]) && !A[L].checked) {
              C = !1;
              break;
            }
          if (C)
            for (let L = 0; L < A.length; L++)
              _(A[L]) ? A[L].checked = !0 : A[L].checked = !1;
        }
      } else {
        let S = !1;
        for (let C = 0; C < A.length; C++)
          if (!_(A[C]) && A[C].checked) {
            S = !0;
            break;
          }
        if (!S)
          for (let C = 0; C < A.length; C++)
            _(A[C]) && (A[C].checked = !0);
      }
      a._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, b.prototype._render = function() {
    const a = this, w = v(this), E = this._lastSnapshot;
    if (!(!E || E.key !== w.key || qr(E.values, w.values))) return;
    w.key === null || w.values.length;
    const S = document.getElementById(a.targetId), C = {
      key: w.key,
      values: w.values.slice(),
      targetId: a.targetId
    };
    k(a.dom, "ln-filter:change", C);
    let L = !1;
    S && S !== a.dom && Q(S, "ln-filter:change", C).defaultPrevented && (L = !0);
    const I = E && E.values.length > 0, q = w.values.length === 0;
    if (I && q) {
      const O = { targetId: a.targetId };
      k(a.dom, "ln-filter:reset", O), S && S !== a.dom && k(S, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: w.key, values: w.values.slice() };
    const D = Or(w.values);
    if (D ? this.dom.setAttribute(s, D) : this.dom.removeAttribute(s), this.hashEnabled) {
      const O = Kn(w.key, w.values);
      gt(this.nsKey, O);
    }
    L || a._applyDomFilter(S);
  }, b.prototype._applyDomFilter = function(a) {
    const w = a || document.getElementById(this.targetId);
    if (!w) return;
    const E = v(this), A = E.key === null || E.values.length === 0, S = w.tagName === "TABLE" ? w : w.querySelector ? w.querySelector("table") : null;
    if (S)
      this._filterTableRows(E, S);
    else {
      const C = w.children;
      for (let L = 0; L < C.length; L++) {
        const I = C[L], q = A ? null : I.getAttribute("data-" + E.key), D = !A && q !== null && !Ke(q, E.values), O = I.hasAttribute(f);
        D && !O ? I.setAttribute(f, "true") : !D && O && I.removeAttribute(f);
      }
    }
  };
  function o(a) {
    if (!a) return "";
    const w = a.querySelector ? a.querySelector("[data-ln-value]") : null;
    return At(w || a);
  }
  function y(a) {
    return !!(!a || typeof a != "object" || a.tagName === "TEMPLATE" || typeof a.hasAttribute == "function" && (a.hasAttribute("data-ln-sort-exclude") || a.hasAttribute("hidden")) || a.classList && a.classList.contains("hidden") || a.style && a.style.display === "none" || typeof a.matches == "function" && a.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof a.querySelector == "function" && a.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  b.prototype._filterTableRows = function(a, w) {
    if (!w) {
      const I = document.getElementById(this.targetId);
      if (!I || (w = I.tagName === "TABLE" ? I : I.querySelector ? I.querySelector("table") : null, !w)) return;
    }
    const E = cn(w, this.dom, a.key, this.colIndex), A = a.key || this.dom.getAttribute("data-ln-filter-key") || (E !== null ? "col" + E : "attr-filter"), S = a.values;
    u.has(w) || u.set(w, {});
    const C = u.get(w);
    A && S.length > 0 ? C[A] = {
      col: E,
      values: S.slice(),
      attr: "data-" + A
    } : A && delete C[A];
    const L = w.tBodies;
    for (let I = 0; I < L.length; I++) {
      const q = L[I].rows;
      for (let D = 0; D < q.length; D++) {
        const O = q[D];
        if (y(O)) continue;
        const F = {};
        for (let G = 0; G < O.cells.length; G++)
          F[G] = o(O.cells[G]);
        const U = !Dr(F, C, O), K = O.hasAttribute(f);
        U && !K ? O.setAttribute(f, "true") : !U && K && O.removeAttribute(f);
      }
    }
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const a = document.getElementById(this.targetId);
    if (a) {
      const w = a.tagName === "TABLE" ? a : a.querySelector ? a.querySelector("table") : null;
      if (w && u.has(w)) {
        const E = u.get(w), A = cn(w, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), S = this.dom.getAttribute("data-ln-filter-key") || (A !== null ? "col" + A : this.colIndex !== null ? "col" + this.colIndex : null);
        S && E[S] && (delete E[S], this._filterTableRows({ key: null, values: [] }, w)), Object.keys(E).length === 0 && u.delete(w);
      }
      this.targetId && document.querySelectorAll("[" + t + '="' + this.targetId + '"]').length <= 1 && a.removeAttribute(n);
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function m(a, w) {
    const E = a[e];
    if (!(!E || E._destroyed))
      if (w === c)
        E.hashEnabled && E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = St(a, "filter"), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      else if (w === s) {
        const A = dn(a.getAttribute(s)), S = a.querySelector("[" + i + "]"), C = S ? S.getAttribute(i) : null;
        C && (h(a, C, A), E._render());
      } else w === t && (E.targetId = a.getAttribute(t) || null, E._ensureTargetMarked(), E._render());
  }
  H(t, e, b, "ln-filter", {
    attributes: g,
    subtreeQuery: "[" + t + "], [" + n + "]",
    onSubtreeChange: function(a, w) {
      if (w.addedNodes.length === 0 && w.removedNodes.length === 0) return;
      let E = null, A = null;
      if (a.hasAttribute(n) ? (A = a, E = a.getAttribute(n) || a.id) : a.hasAttribute(t) && (E = a.getAttribute(t), A = E ? document.getElementById(E) : null), !E || !A) return;
      const S = document.querySelectorAll("[" + t + '="' + E + '"]');
      for (let C = 0; C < S.length; C++) {
        const L = S[C][e];
        L && !L._destroyed && v(L).values.length > 0 && L._queueDomFilter();
      }
    },
    persist: {
      attr: s,
      hashActive: function(a) {
        return !!St(a, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", d = "lnSearchControl", f = "data-ln-search-items", p = "data-ln-search-fields", l = "data-ln-search-exclude", c = "data-ln-search-hide", s = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: m, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: m, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: j, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, u = X(n);
  function g(a) {
    const w = St(a, "search");
    if (w) return w;
    if (a.id) {
      const E = document.querySelector("[" + i + '="' + a.id + '"]');
      if (E) {
        const A = St(E, "search");
        if (A) return A;
      }
    }
    return null;
  }
  function r(a) {
    return a.matches("input, textarea") ? a : a.querySelector("input, textarea");
  }
  function _(a, w) {
    const E = a.childNodes;
    for (let A = 0; A < E.length; A++) {
      const S = E[A];
      if (S.nodeType === 3) {
        w.push(S.nodeValue);
        continue;
      }
      S.nodeType === 1 && (S.hasAttribute(l) || _(S, w));
    }
  }
  function v(a) {
    if (a._lnSearchText !== void 0) return a._lnSearchText;
    const w = [];
    _(a, w);
    const E = rr(w);
    return a._lnSearchText = E, E;
  }
  function h(a, w) {
    if (!a.id) return;
    const E = document.querySelectorAll("[" + i + '="' + a.id + '"]');
    for (const A of E) {
      const S = r(A);
      S && S.value !== w && (S.value = w);
    }
  }
  function b(a) {
    this.dom = a, this.term = a.getAttribute(t) || "", this._destroyed = !1;
    const w = this;
    return this.nsKey = g(a), this.hashEnabled = !!this.nsKey, this._queueApply = Ht(function() {
      w._destroyed || w._apply();
    }), this._onHashChange = function() {
      if (w._destroyed || !w.hashEnabled) return;
      const E = st(w.nsKey), A = w.dom.getAttribute(t) || "";
      E !== null && E !== A ? w.dom.setAttribute(t, E) : E === null && A !== "" && w.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!w._destroyed) {
        if (w.hashEnabled) {
          const E = st(w.nsKey);
          if (E !== null && E !== w.term) {
            w.term = E, w.dom.setAttribute(t, E), h(w.dom, E), w._apply();
            return;
          }
        }
        se(w.term) && (h(w.dom, w.term), w._apply());
      }
    }), this;
  }
  b.prototype._apply = function() {
    const a = this.dom, w = se(this.term), E = Gn(w);
    this.hashEnabled && gt(this.nsKey, this.term ? this.term : null);
    const A = ir(a.getAttribute(p));
    if (Q(a, "ln-search:change", {
      term: w,
      tokens: E,
      targetId: a.id,
      fields: A
    }).defaultPrevented) return;
    const C = a.getAttribute(f), L = C ? a.querySelectorAll(C) : a.children;
    for (let I = 0; I < L.length; I++) {
      const q = L[I];
      if (q.hasAttribute(l)) {
        q.hasAttribute(c) && q.removeAttribute(c);
        continue;
      }
      const D = E.length > 0 && !$n(v(q), E), O = q.hasAttribute(c);
      D && !O ? q.setAttribute(c, "true") : !D && O && q.removeAttribute(c);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function o(a) {
    if (this.dom = a, Y(this, a, u), this.input = r(a), this._attachHandler(), this.input && this.input.value.trim()) {
      const w = this;
      mt(function() {
        const E = document.getElementById(w.targetId);
        E && ((E.getAttribute(t) || "").trim() || w._write(w.input.value));
      });
    }
    return this;
  }
  o.prototype._write = function(a) {
    const w = document.getElementById(this.targetId);
    w && w.getAttribute(t) !== a && w.setAttribute(t, a);
  }, o.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      a._write(a.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, o.prototype.destroy = function() {
    this.dom[d] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[d]);
  };
  function y(a) {
    const w = a.getAttribute("data-ln-search-clear-for");
    if (w) {
      const L = document.getElementById(w), I = document.querySelector("[" + i + '="' + w + '"]'), q = I ? r(I) : null;
      return { target: L, input: q };
    }
    const E = a.closest("[" + t + "]");
    if (E) {
      const L = E.id ? document.querySelector("[" + i + '="' + E.id + '"]') : null, I = L ? r(L) : null;
      return { target: E, input: I };
    }
    const A = a.closest("[data-ln-table-source], [data-ln-list-source]");
    if (A) {
      const L = A.getAttribute("data-ln-table-source") || A.getAttribute("data-ln-list-source"), I = L ? document.getElementById(L) : null;
      if (I && I.hasAttribute(t)) {
        const q = document.querySelector("[" + i + '="' + L + '"]'), D = q ? r(q) : null;
        return { target: I, input: D };
      }
    }
    const S = a.closest("[" + i + "]");
    if (S) {
      const L = S.getAttribute(i), I = L ? document.getElementById(L) : null, q = r(S);
      return { target: I, input: q };
    }
    const C = a.parentElement;
    if (C) {
      const L = C.querySelector("[" + i + "]");
      if (L) {
        const I = L.getAttribute(i), q = I ? document.getElementById(I) : null, D = r(L);
        return { target: q, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(a) {
    const w = a.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!w) return;
    const E = y(w);
    !E.target && !E.input || (a.preventDefault(), E.input && (E.input.value = "", E.input.focus()), E.target && E.target.setAttribute(t, ""));
  });
  function m(a, w) {
    const E = a[e];
    if (!E || E._destroyed) return;
    if (w === s) {
      E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = g(a), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      return;
    }
    const A = a.getAttribute(t) || "";
    A !== E.term && (E.term = A, h(a, A), E._apply());
  }
  H(t, e, b, "ln-search", {
    attributes: n,
    onSubtreeChange: function(a, w) {
      const E = w.target;
      E && E._lnSearchText !== void 0 && delete E._lnSearchText, E && E.parentElement && E.parentElement._lnSearchText !== void 0 && delete E.parentElement._lnSearchText;
      const A = a[e];
      if (A && !A._destroyed && se(A.term) && (w.addedNodes.length > 0 || w.removedNodes.length > 0)) {
        for (let S = 0; S < w.addedNodes.length; S++) {
          const C = w.addedNodes[S];
          C._lnSearchText !== void 0 && delete C._lnSearchText;
        }
        A._queueApply();
      }
    },
    persist: {
      attr: t,
      hashActive: function(a) {
        return !!g(a);
      }
    }
  }), H(i, d, o, "ln-search-control");
})();
function kt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Nr(t) {
  const e = kt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Mr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Fr(t, e, i, d) {
  const f = kt(t);
  if (f === "none") return () => 0;
  const p = f === "desc" ? -1 : 1, l = typeof d == "function" ? d : (c) => c;
  return function(c, s) {
    const n = l(c), u = l(s);
    return Ue(n, u, e, i) * p;
  };
}
function we(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Br(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const i = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (i && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(i));
  if (t.tagName === "TABLE") {
    const d = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (d)
      return Array.from(d.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", d = "data-ln-sort-state", f = "data-ln-sort-dir", p = "data-ln-hash";
  if (window[e] !== void 0) return;
  function l(_, v) {
    return _.getAttribute(v) || null;
  }
  const c = {
    "data-ln-sort": { prop: "targetId", type: "string", read: j, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: l, effect: r, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: l, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: r, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: r, description: "URL hash routing key for sort state persistence" }
  }, s = X(c), n = /* @__PURE__ */ new WeakMap();
  function u(_, v, h) {
    if (v) {
      const b = _.querySelector('[data-ln-field="' + v + '"]');
      return b ? At(b) : "";
    }
    return h != null && _.cells && _.cells[h] ? At(_.cells[h]) : At(_);
  }
  function g(_) {
    this.dom = _, Y(this, _, s);
    const v = _.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = kt(_.getAttribute(d)), _.hasAttribute(d) || _.setAttribute(d, this._state), this._destroyed = !1, this.nsKey = St(_, "sort"), this.hashEnabled = !!this.nsKey;
    const h = this;
    this._onClick = function(o) {
      const y = o.target.closest("[" + f + "]");
      if (!y) return;
      const m = kt(y.getAttribute(f));
      h._apply(m);
    }, _.addEventListener("click", this._onClick), this._onSortChange = function(o) {
      if (h._destroyed || !o.detail) return;
      const y = h._resolveTarget();
      if (!(y && (o.target === y || y.contains(o.target)) || o.detail.targetId && o.detail.targetId === h.targetId)) return;
      if (Mr(
        { field: h.field, column: h.column },
        { field: o.detail.field, column: o.detail.column }
      )) {
        const w = kt(o.detail.direction);
        w && _.getAttribute(d) !== w && (h._state = w, _.setAttribute(d, w), h._updateAriaSort(w));
        return;
      }
      _.getAttribute(d) !== "none" && (h._state = "none", _.setAttribute(d, "none"), h._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const o = st(h.nsKey), y = Ee(o);
      if (y)
        h.field !== null && y.fieldOrColumn === h.field || h.column !== null && String(h.column) === y.fieldOrColumn ? h._state !== y.direction && h._apply(y.direction, !0) : h._state !== "none" && (h._state = "none", _.setAttribute(d, "none"), h._updateAriaSort("none"));
      else if (h._state !== "none") {
        h._state = "none", _.setAttribute(d, "none"), h._updateAriaSort("none");
        const m = h._resolveTarget();
        m && (Q(m, "ln-sort:change", {
          field: h.field,
          column: h.column,
          direction: "none",
          targetId: h.targetId
        }).defaultPrevented || h._defaultSort(m, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let b = !1;
    if (this.hashEnabled) {
      const o = st(this.nsKey), y = Ee(o);
      y && ((h.field !== null && y.fieldOrColumn === h.field || h.column !== null && String(h.column) === y.fieldOrColumn) && mt(function() {
        h._destroyed || h._apply(y.direction, !0);
      }), b = !0);
    }
    if (!b) {
      const o = kt(_.getAttribute(d));
      o && o !== "none" && mt(function() {
        h._destroyed || h._apply(o, !0);
      });
    }
    return this;
  }
  g.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, g.prototype._updateAriaSort = function(_) {
    const v = this.dom.closest("th");
    v && v.setAttribute("aria-sort", Nr(_));
  }, g.prototype._apply = function(_, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const m = this.dom.closest("th");
      m && m.cellIndex !== void 0 && (this.column = m.cellIndex);
    }
    const h = kt(_);
    this._state = h, this.dom.getAttribute(d) !== h && this.dom.setAttribute(d, h), this._updateAriaSort(h);
    const b = this._resolveTarget();
    if (!b) return;
    const o = {
      field: this.field,
      column: this.column,
      direction: h,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const m = zn(this.field !== null ? this.field : this.column, h);
      gt(this.nsKey, m);
    }
    Q(b, "ln-sort:change", o).defaultPrevented || this._defaultSort(b, h);
  }, g.prototype._defaultSort = function(_, v) {
    const h = Br(_, this.itemsSelector);
    if (!h.length) return;
    const b = h[0].parentNode, o = h.filter(function(m) {
      return !we(m);
    });
    if (!o.length) return;
    n.has(_) || n.set(_, o.slice());
    let y;
    if (v === "none") {
      const m = n.get(_) || o;
      n.delete(_), y = m.filter(function(a) {
        return a.parentNode === b && !we(a);
      });
    } else {
      const m = this.field, a = this.column, w = o.map(function(C) {
        return { el: C, val: u(C, m, a) };
      }), E = He(w.map(function(C) {
        return C.val;
      })), A = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base", numeric: !0 }) : null, S = Fr(v, E, A, function(C) {
        return C.val;
      });
      w.sort(S), y = w.map(function(C) {
        return C.el;
      });
    }
    Pn(function() {
      const m = document.createDocumentFragment();
      let a = 0;
      for (let w = 0; w < h.length; w++) {
        const E = h[w];
        we(E) ? m.appendChild(E) : a < y.length && m.appendChild(y[a++]);
      }
      b.appendChild(m);
    });
  }, g.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function r(_, v) {
    const h = _[e];
    if (!(!h || h._destroyed))
      if (v === i) {
        const b = _.closest("th");
        h.column = !h.field && b ? b.cellIndex : null;
      } else if (v === d) {
        const b = kt(_.getAttribute(d));
        b !== h._state && h._apply(b);
      } else v === p && (h.hashEnabled && h._onHashChange && window.removeEventListener("hashchange", h._onHashChange), h.nsKey = St(_, "sort"), h.hashEnabled = !!h.nsKey, h.hashEnabled && window.addEventListener("hashchange", h._onHashChange));
  }
  H(t, e, g, "ln-sort", {
    attributes: c,
    persist: {
      attr: d,
      hashActive: function(_) {
        return !!St(_, "sort");
      }
    }
  });
})();
function un(t, e, i, d, f = 15) {
  if (d <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const p = Math.max(0, t || 0), l = Math.max(0, e || 0), c = Math.floor(p / i), s = Math.ceil(l / i), n = Math.max(0, c - f), u = Math.min(d, c + s + f), g = n * i, r = Math.max(0, (d - u) * i);
  return { start: n, end: u, topPadding: g, bottomPadding: r };
}
function Pr(t, e) {
  const i = Array.isArray(t) ? t.length : 0, d = e instanceof Set ? e : new Set(e || []);
  let f = 0;
  if (Array.isArray(t))
    for (let c = 0; c < t.length; c++)
      d.has(t[c]) && f++;
  else
    f = d.size;
  const p = i > 0 && f === i, l = f > 0 && f < i;
  return { totalCount: i, selectedCount: f, isAllSelected: p, isIndeterminate: l };
}
function fn(t, e, i) {
  const d = new Set(t);
  return e == null || ((i !== void 0 ? i : !d.has(e)) ? d.add(e) : d.delete(e)), d;
}
function hn(t, e, i) {
  const d = new Set(t);
  if (!Array.isArray(e)) return d;
  if (i)
    for (let f = 0; f < e.length; f++)
      e[f] != null && d.add(e[f]);
  else
    for (let f = 0; f < e.length; f++)
      d.delete(e[f]);
  return d;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function s(o, y) {
    if (!o || !o.isDataDriven) return;
    const m = o.dom.hasAttribute("data-ln-table-window");
    if (m && !o._windowed)
      o._enterWindowedMode(), o._kickWindowInitial();
    else if (!m && o._windowed)
      o._exitWindowedMode();
    else if (m && o._windowed) {
      const a = parseInt(y, 10);
      a > 0 && o._cache.configure({ windowSize: a });
    }
  }
  function n(o, y) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const m = parseInt(y, 10);
    m > 0 && o._cache.configure({ pageSize: m });
  }
  function u(o, y) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const m = parseInt(y, 10);
    m >= 0 && o._cache.configure({ threshold: m });
  }
  function g(o, y) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const m = parseInt(y, 10);
    m >= 0 && o._cache.setGrandTotal(m);
  }
  const r = {
    "data-ln-table": { prop: "name", type: "string", read: j, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: j, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: u, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: g, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, _ = X(r);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(o, y) {
    if (o == null || isNaN(o)) return "";
    try {
      return new Intl.NumberFormat(J(y)).format(o);
    } catch {
      return String(o);
    }
  }
  function h(o) {
    let y = o.parentElement;
    for (; y && y !== document.body && y !== document.documentElement; ) {
      const a = getComputedStyle(y).overflowY;
      if (a === "auto" || a === "scroll") return y;
      y = y.parentElement;
    }
    return null;
  }
  function b(o) {
    this.dom = o, Y(this, o, _), this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead");
    const y = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = y ? Array.from(y.querySelectorAll("th")) : [], this._totalSpan = o.querySelector("[data-ln-table-total]"), this._filteredSpan = o.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.parentElement : null), this._selectedSpan = o.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.parentElement : null), this.isDataDriven = o.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const m = this;
    return this._onSetSearch = function(a) {
      const w = (a.detail && a.detail.query != null ? a.detail.query : a.detail && a.detail.term != null ? a.detail.term : "").trim();
      m.isDataDriven ? (m.currentSearch = w, k(o, "ln-table:search", {
        table: m.name,
        query: m.currentSearch
      }), m._requestData()) : (m._searchTerm = w.toLowerCase(), m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(o, "ln-table:filter", {
        term: m._searchTerm,
        matched: m._filteredData.length,
        total: m._data.length
      }));
    }, o.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(a) {
      a.preventDefault(), m._onSetSearch(a);
    }, o.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      m.isDataDriven ? (m.currentFilters = {}, m.currentSearch = "", k(o, "ln-table:clear-filters", { table: m.name }), m._requestData()) : (m._searchTerm = "", m._columnFilters = {}, m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(o, "ln-table:filter", {
        term: "",
        matched: m._filteredData.length,
        total: m._data.length
      }));
    }, o.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && o.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(a) {
      const w = a.detail || {}, E = w.data || [], A = w.total != null ? w.total : E.length;
      if (!(m._hasInitialSeed && !m.isLoaded && E.length === 0 && A === 0)) {
        if (m._windowed) {
          m._cache.ingest(w) && !w.provisional && o.classList.remove("ln-table--loading");
          return;
        }
        m._data = E, m._lastTotal = A, m._lastFiltered = w.filtered != null ? w.filtered : m._data.length, m.totalCount = m._lastTotal, m.visibleCount = m._lastFiltered, m.isLoaded = !0, m._hasInitialSeed = !1, o.classList.remove("ln-table--loading"), m._vStart = -1, m._vEnd = -1, m._applyFilterAndSort(), m._render(), m._updateFooter(), k(o, "ln-table:rendered", {
          table: m.name,
          total: m.totalCount,
          visible: m.visibleCount
        });
      }
    }, o.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(a) {
      const w = a.detail && a.detail.loading;
      o.classList.toggle("ln-table--loading", !!w), w && (m.isLoaded = !1);
    }, o.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(a) {
      !m._windowed || !m._cache || m._cache.release(a.detail && a.detail.offset);
    }, o.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !m._windowed || !m._cache || m._cache.revalidate();
    }, o.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function(a) {
      if (!(!m._windowed || !m._cache)) {
        if (a && a.detail && a.detail.query) {
          const w = a.detail.query;
          w.search !== void 0 && (m.currentSearch = w.search), w.filters !== void 0 && (m.currentFilters = w.filters), w.sort !== void 0 && (m.currentSort = w.sort);
        }
        m._requestData();
      }
    }, o.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(a) {
      !a.detail || a.detail.field == null || (a.preventDefault(), m.currentSort = a.detail.direction === "none" ? null : { field: a.detail.field, direction: a.detail.direction }, m._requestData());
    }, o.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(a) {
      if (a.target.closest("[data-ln-table-row-select]") || a.target.closest("[data-ln-table-row-action]") || a.target.closest("a") || a.target.closest("button") || a.ctrlKey || a.metaKey || a.button === 1) return;
      const w = a.target.closest("[data-ln-table-row]");
      if (!w) return;
      const E = w.getAttribute("data-ln-table-row-id"), A = w._lnRecord || {};
      k(o, "ln-table:row-click", {
        table: m.name,
        id: E,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(a) {
      const w = a.target.closest("[data-ln-table-row-action]");
      if (!w) return;
      const E = w.closest("[data-ln-table-row]");
      if (!E) return;
      const A = w.getAttribute("data-ln-table-row-action"), S = E.getAttribute("data-ln-table-row-id"), C = E._lnRecord || {};
      k(o, "ln-table:row-action", {
        table: m.name,
        id: S,
        action: A,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), setTimeout(function() {
      !m.dom || !document.contains(m.dom) || (m._windowed ? m._kickWindowInitial() : k(o, "ln-table:request-data", {
        table: m.name,
        sort: m.currentSort,
        filters: m.currentFilters,
        search: m.currentSearch
      }));
    }, 0)) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      m.tbody.rows.length > 0 && (m._emptyTbodyObserver.disconnect(), m._emptyTbodyObserver = null, m._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(a) {
      if (!a.detail || a.detail.column == null) return;
      a.preventDefault();
      const w = a.detail.direction === "none" ? null : a.detail.direction;
      m._sortCol = w === null ? -1 : a.detail.column, m._sortDir = w, m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), k(o, "ln-table:sorted", {
        column: a.detail.column,
        direction: a.detail.direction,
        matched: m._filteredData.length,
        total: m._data.length
      });
    }, o.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(a) {
      if (a.preventDefault(), !a.detail) return;
      const w = a.detail.key, E = a.detail.values || [];
      if (w) {
        if (E.length === 0)
          delete m._columnFilters[w];
        else {
          const A = [];
          for (let S = 0; S < E.length; S++)
            A.push(E[S].toLowerCase());
          m._columnFilters[w] = A;
        }
        m._applyFilterAndSort(), m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), k(o, "ln-table:filter", {
          term: m._searchTerm,
          matched: m._filteredData.length,
          total: m._data.length
        });
      }
    }, o.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  b.prototype._parseRows = function() {
    const o = this.tbody.rows, y = this.ths;
    this._data = [], o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let m = 0; m < o.length; m++) {
      const a = o[m], w = [], E = [], A = [];
      for (let C = 0; C < a.cells.length; C++) {
        const L = a.cells[C], I = L.textContent.trim();
        w[C] = At(L), E[C] = I.toLowerCase(), L.querySelector("[data-ln-table-row-action]") || A.push(I.toLowerCase());
      }
      let S = null;
      if (this.isDataDriven) {
        S = {};
        const C = a.getAttribute("data-ln-table-row-id");
        C != null && (S.id = C);
        for (let L = 0; L < y.length; L++) {
          const I = y[L].getAttribute("data-ln-table-col");
          if (I) {
            const q = L;
            if (q < a.cells.length) {
              const D = a.cells[q];
              S[I] = At(D);
            }
          }
        }
      }
      this._data.push({
        values: w,
        rawTexts: E,
        html: a.outerHTML,
        searchText: A.join(" "),
        id: this.isDataDriven && S ? S.id : void 0,
        ...S
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, b.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, b.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const o = document.createElement("colgroup");
    this.ths.forEach(function(y) {
      const m = document.createElement("col");
      m.style.width = y.offsetWidth + "px", o.appendChild(m);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, b.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const o = this._lastTotal, y = this.visibleCount;
        if (o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || y === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const o = this._filteredData.length;
        o === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : o > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, b.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const o = this._filteredData, y = document.createDocumentFragment();
      for (let m = 0; m < o.length; m++) {
        const a = this._buildRow(o[m]);
        if (!a) break;
        y.appendChild(a);
      }
      this.tbody.replaceChildren(y), this._selectable && this._updateSelectAll();
    } else {
      const o = [], y = this._filteredData;
      for (let m = 0; m < y.length; m++) o.push(y[m].html);
      this.tbody.innerHTML = o.join(""), this._selectable && this._restoreSelection();
    }
  }, b.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const o = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let m = null;
        if (this._windowed) {
          const a = this._cache ? this._cache.peek() : null;
          m = a ? this._buildRow(a) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (m = this._buildRow(this._data[0]));
        m && this.tbody && (this.tbody.appendChild(m), this._rowHeight = m.offsetHeight || 40, m.remove());
      }
    this.isDataDriven ? this._scrollContainer = h(this.dom) : this._scrollContainer = null;
    const y = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._windowed ? o._renderWindowed() : o._renderVirtual();
      }));
    }, y.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const o = this._filteredData, y = o.length, m = this._rowHeight;
    if (!m || !y) return;
    const a = this.thead ? this.thead.offsetHeight : 0, w = this._scrollContainer;
    let E, A;
    if (w) {
      const O = this.table.getBoundingClientRect(), F = w.getBoundingClientRect(), U = O.top - F.top + w.scrollTop + a;
      E = w.scrollTop - U, A = w.clientHeight;
    } else {
      const U = this.table.getBoundingClientRect().top + window.scrollY + a;
      E = window.scrollY - U, A = window.innerHeight;
    }
    const S = un(E, A, m, y, 15), C = S.start, L = S.end;
    if (C === this._vStart && L === this._vEnd) return;
    this._vStart = C, this._vEnd = L;
    const I = this.ths.length || 1, q = S.topPadding, D = S.bottomPadding;
    if (this.isDataDriven) {
      const O = document.createDocumentFragment();
      if (q > 0) {
        const F = document.createElement("tr");
        F.className = "ln-table__spacer", F.setAttribute("aria-hidden", "true");
        const U = document.createElement("td");
        U.setAttribute("colspan", I), U.style.height = q + "px", F.appendChild(U), O.appendChild(F);
      }
      for (let F = C; F < L; F++) {
        const U = this._buildRow(o[F]);
        U && O.appendChild(U);
      }
      if (D > 0) {
        const F = document.createElement("tr");
        F.className = "ln-table__spacer", F.setAttribute("aria-hidden", "true");
        const U = document.createElement("td");
        U.setAttribute("colspan", I), U.style.height = D + "px", F.appendChild(U), O.appendChild(F);
      }
      this.tbody.replaceChildren(O), this._selectable && this._updateSelectAll();
    } else {
      let O = "";
      q > 0 && (O += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + I + '" style="height:' + q + 'px;padding:0;border:none"></td></tr>');
      for (let F = C; F < L; F++) O += o[F].html;
      D > 0 && (O += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + I + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = O, this._selectable && this._restoreSelection();
    }
  }, b.prototype._buildPlaceholderRow = function() {
    const o = document.createElement("tr");
    o.className = "ln-table__placeholder", o.setAttribute("aria-hidden", "true");
    const y = document.createElement("td");
    return y.setAttribute("colspan", this.ths.length || 1), y.style.height = this._rowHeight + "px", o.appendChild(y), o;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const o = this._rowHeight;
    if (!o) return;
    const y = this._cache.logicalTotal, m = this.thead ? this.thead.offsetHeight : 0, a = this._scrollContainer;
    let w, E;
    if (a) {
      const O = this.table.getBoundingClientRect(), F = a.getBoundingClientRect(), U = O.top - F.top + a.scrollTop + m;
      w = a.scrollTop - U, E = a.clientHeight;
    } else {
      const U = this.table.getBoundingClientRect().top + window.scrollY + m;
      w = window.scrollY - U, E = window.innerHeight;
    }
    const A = un(w, E, o, y, 15), S = A.start, C = A.end;
    if (S === this._vStart && C === this._vEnd) return;
    const L = this.ths.length || 1, I = A.topPadding, q = A.bottomPadding, D = document.createDocumentFragment();
    if (I > 0) {
      const O = document.createElement("tr");
      O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
      const F = document.createElement("td");
      F.setAttribute("colspan", L), F.style.height = I + "px", O.appendChild(F), D.appendChild(O);
    }
    for (let O = S; O < C; O++)
      if (this._cache.has(O)) {
        const F = this._buildRow(this._cache.get(O));
        F && D.appendChild(F);
      } else
        D.appendChild(this._buildPlaceholderRow());
    if (q > 0) {
      const O = document.createElement("tr");
      O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
      const F = document.createElement("td");
      F.setAttribute("colspan", L), F.style.height = q + "px", O.appendChild(F), D.appendChild(O);
    }
    this.tbody.replaceChildren(D), this._vStart = S, this._vEnd = C, this._cache.ensure(S, C);
  }, b.prototype._showEmptyState = function() {
    const o = this.ths.length || 1;
    let y = null, m = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, E = this.visibleCount === 0 && a > 0, A = E ? this.name + "-empty-filtered" : this.name + "-empty";
      if (m = Lt(this.dom, A, "ln-table"), !m) {
        const S = this.dom.querySelector("template[data-ln-table-empty]");
        if (S) {
          const C = E ? "search" : "initial", L = S.content.querySelector('[data-ln-table-empty-when="' + C + '"]') || S.content.firstElementChild;
          L && (m = document.importNode(L, !0));
        }
      }
      if (m)
        if (m.tagName === "TR")
          y = m;
        else {
          const S = document.createElement("td");
          S.setAttribute("colspan", String(o)), S.appendChild(m);
          const C = document.createElement("tr");
          C.className = "ln-table__empty", C.appendChild(S), y = C;
        }
    } else {
      const a = this.dom.querySelector("template[" + i + "]"), w = document.createElement("td");
      w.setAttribute("colspan", String(o)), a && w.appendChild(document.importNode(a.content, !0));
      const E = document.createElement("tr");
      E.className = "ln-table__empty", E.appendChild(w), y = E;
    }
    y ? this.tbody.replaceChildren(y) : this.tbody.replaceChildren(), k(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._fillRow = function(o, y) {
    Zt(o, y);
    const m = o.querySelectorAll("[data-ln-table-cell-attr]");
    for (let a = 0; a < m.length; a++) {
      const w = m[a], E = w.getAttribute("data-ln-table-cell-attr").split(",");
      for (let A = 0; A < E.length; A++) {
        const S = E[A].trim().split(":");
        if (S.length !== 2) continue;
        const C = S[0].trim(), L = S[1].trim();
        y[C] != null && w.setAttribute(L, y[C]);
      }
    }
  }, b.prototype._buildRow = function(o) {
    let y = Lt(this.dom, this.name + "-row", "ln-table");
    if (!y) {
      const a = this.dom.querySelector("template[data-ln-table-row]");
      a && (y = document.importNode(a.content, !0));
    }
    let m = y ? y.querySelector("[data-ln-table-row]") || y.firstElementChild : null;
    if (m)
      this._fillRow(m, o);
    else if (o && o.html) {
      const a = document.createElement("tbody");
      a.innerHTML = o.html, m = a.firstElementChild;
    } else {
      m = document.createElement("tr"), m.setAttribute("data-ln-table-row", "");
      const a = this.ths;
      for (let w = 0; w < a.length; w++) {
        const E = a[w].hasAttribute("data-ln-table-col-select"), A = document.createElement("td");
        if (E) {
          const S = document.createElement("input");
          S.type = "checkbox", S.setAttribute("data-ln-table-row-select", ""), S.setAttribute("aria-label", "Select row"), A.appendChild(S);
        } else {
          const S = a[w].getAttribute("data-ln-table-col");
          S && o[S] != null && (A.textContent = String(o[S]));
        }
        m.appendChild(A);
      }
    }
    if (m._lnRecord = o, o.id != null && m.setAttribute("data-ln-table-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      m.classList.add("ln-row-selected");
      const a = m.querySelector("[data-ln-table-row-select]");
      a && (a.checked = !0);
    }
    return m;
  }, b.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    vn(this, "ln-table:request-data", "table");
  }, b.prototype._enterWindowedMode = function() {
    const o = this, y = this.dom, m = parseInt(y.getAttribute("data-ln-table-window"), 10), a = parseInt(y.getAttribute("data-ln-table-window-page"), 10), w = parseInt(y.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !o._windowed || !o._cache || (o.totalCount = o._cache.grandTotal, o.visibleCount = o._cache.logicalTotal, o._lastTotal = o._cache.grandTotal, o.isLoaded = !0, o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), k(y, "ln-table:rendered", {
        table: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      }));
    }, this._renderBatch = Ht(this._onCacheChange), this._cache = Hn({
      windowSize: m > 0 ? m : 1e3,
      pageSize: a > 0 ? a : 200,
      threshold: w >= 0 ? w : 25,
      fetchDebounce: 120,
      requestPage: function(E, A, S) {
        k(y, "ln-table:request-data", {
          table: o.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: A,
          limit: S,
          queryGen: o._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, b.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let o = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(o) && this._totalSpan) {
        const m = this._totalSpan.textContent.replace(/[^\d]/g, "");
        m && (o = parseInt(m, 10));
      }
      const y = o > 0 ? o : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: y,
        filtered: y
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, b.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, b.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]"), y = [];
    for (let a = 0; a < o.length; a++) {
      const w = o[a].getAttribute("data-ln-table-row-id");
      w != null && y.push(w);
    }
    const m = Pr(y, this.selectedIds);
    this._selectAllCheckbox.checked = m.isAllSelected, this._selectAllCheckbox.indeterminate = m.isIndeterminate;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let y = 0; y < o.length; y++) {
      const m = o[y].getAttribute("data-ln-table-row-id"), a = m != null && this.selectedIds.has(m);
      o[y].classList.toggle("ln-row-selected", a);
      const w = o[y].querySelector("[data-ln-table-row-select]");
      w && (w.checked = a);
    }
    this._updateSelectAll();
  }, Object.defineProperty(b.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), b.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const o = this;
    if (this._onSelectionChange = function(y) {
      const m = y.target.closest("[data-ln-table-row-select]");
      if (!m) return;
      const a = m.closest("[data-ln-table-row]");
      if (!a) return;
      const w = a.getAttribute("data-ln-table-row-id");
      w != null && (o.selectedIds = fn(o.selectedIds, w, m.checked), a.classList.toggle("ln-row-selected", m.checked), o.selectedCount = o.selectedIds.size, o._updateSelectAll(), o._updateFooter(), k(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const y = document.createElement("input");
      y.type = "checkbox";
      const m = o.dom.querySelector('[data-ln-table-dict="select-all"]'), a = o.dom.getAttribute("data-ln-table-select-all-label") || (m ? m.textContent.trim() : null) || "Select all";
      y.setAttribute("aria-label", a), this._selectAllCheckbox.appendChild(y), this._selectAllCheckbox = y;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const y = o._selectAllCheckbox.checked, m = o.tbody ? o.tbody.querySelectorAll("[data-ln-table-row]") : [], a = [];
      for (let w = 0; w < m.length; w++) {
        const E = m[w].getAttribute("data-ln-table-row-id"), A = m[w].querySelector("[data-ln-table-row-select]");
        E != null && (a.push(E), m[w].classList.toggle("ln-row-selected", y), A && (A.checked = y));
      }
      o.selectedIds = hn(o.selectedIds, a, y), o.selectedCount = o.selectedIds.size, k(o.dom, "ln-table:select-all", {
        table: o.name,
        selected: y
      }), k(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const y = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let m = 0; m < y.length; m++) {
        const a = y[m].querySelector("[data-ln-table-row-select]"), w = y[m].getAttribute("data-ln-table-row-id");
        a && a.checked && w != null && (o.selectedIds = fn(o.selectedIds, w, !0), y[m].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, b.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const o = this.dom.querySelector("[data-ln-table-col-select]");
    if (o) {
      const y = o.querySelector('input[type="checkbox"]');
      y && y.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = hn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const y = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let m = 0; m < y.length; m++) {
        y[m].classList.remove("ln-row-selected");
        const a = y[m].querySelector("[data-ln-table-row-select]");
        a && (a.checked = !1);
      }
    }
    this._updateFooter();
  }, b.prototype._updateFooter = function() {
    let o = 0, y = 0;
    this.isDataDriven ? (o = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount) : (o = this._data.length, y = this._filteredData.length);
    const m = y < o;
    if (this._totalSpan && (this._totalSpan.textContent = v(o, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = m ? v(y, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !m), this._selectedSpan) {
      const a = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = a > 0 ? v(a, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", a === 0);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, b, "ln-table", {
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
  function d(c) {
    return this.dom = c, l(this), this;
  }
  function f(c, s) {
    const n = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", u = c.querySelector(n) || document.querySelector(n);
    return u ? u.tagName === "INPUT" || u.tagName === "TEXTAREA" ? u : u.querySelector("input, textarea") : null;
  }
  function p(c, s) {
    if (s) {
      const u = c.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (u.length > 0) return u;
      const g = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (g.length > 0) return g;
    }
    const n = c.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function l(c) {
    const s = c.dom;
    function n(u) {
      const g = u.target;
      if (g && g.hasAttribute && (g.hasAttribute("data-ln-table") || g.tagName === "TABLE")) return g;
      const r = u.detail && u.detail.targetId || g && g.id;
      if (!r) return null;
      const _ = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(r) : r.replace(/(["\\])/g, "\\$1");
      return s.querySelector('[data-ln-table-source="' + _ + '"]') || s.querySelector('[data-ln-table="' + _ + '"]') || (s.id === r ? s : null) || document.getElementById(r);
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(u) {
        if (!u.detail) return;
        const g = n(u);
        if (!g) return;
        const r = u.detail.key, _ = u.detail.values || [], v = g.querySelectorAll("th");
        for (let h = 0; h < v.length; h++)
          if ((v[h].getAttribute("data-ln-table-filter-col") || v[h].getAttribute("data-ln-filter-col") || v[h].getAttribute("data-ln-filter-key") || v[h].getAttribute("data-ln-field")) === r) {
            const o = v[h].querySelector("[data-ln-table-col-filter], .table-filter");
            o && o.classList.toggle("ln-filter-active", _.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(u) {
        const g = u.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!g) return;
        const r = g.closest("[data-ln-table], table") || s.querySelector("[data-ln-table], table");
        if (!r) return;
        const _ = r.lnTable && r.lnTable.name || r.id, v = r.querySelectorAll("th");
        for (let y = 0; y < v.length; y++) {
          const m = v[y].querySelector("[data-ln-table-col-filter], .table-filter");
          m && m.classList.remove("ln-filter-active");
        }
        const h = r.getAttribute("data-ln-table-source") || r.id, b = h ? document.getElementById(h) : null;
        if (b && b.hasAttribute("data-ln-search"))
          b.setAttribute("data-ln-search", "");
        else {
          const y = f(s, h);
          y && y.value !== "" && (y.value = "", y.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const o = p(s, h);
        for (let y = 0; y < o.length; y++) {
          const m = o[y].querySelector("[data-ln-filter-reset]");
          if (!m) continue;
          const a = o[y].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!m.checked || a) && (m.checked = !0, m.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        r.lnTable && !r.hasAttribute("data-ln-table-source") && k(r, "ln-table:request-clear-filters", { table: _ });
      }
    }, s.addEventListener("ln-filter:change", c._handlers.filter), s.addEventListener("click", c._handlers.clear);
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, H(t, e, d, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function s(a, w) {
    if (!a || !a.isDataDriven) return;
    const E = a.dom.hasAttribute("data-ln-list-window");
    if (E && !a._windowed)
      a._enterWindowedMode(), a._kickWindowInitial();
    else if (!E && a._windowed)
      a._exitWindowedMode();
    else if (E && a._windowed) {
      const A = parseInt(w, 10);
      A > 0 && a._cache.configure({ windowSize: A });
    }
  }
  function n(a, w) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const E = parseInt(w, 10);
    E > 0 && a._cache.configure({ pageSize: E });
  }
  function u(a, w) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const E = parseInt(w, 10);
    E >= 0 && a._cache.configure({ threshold: E });
  }
  function g(a, w) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const E = parseInt(w, 10);
    E >= 0 && a._cache.setGrandTotal(E);
  }
  const r = {
    "data-ln-list": { prop: "name", type: "string", read: j, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: j, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: u, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: g, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, _ = X(r);
  function v(a, w) {
    if (a == null || isNaN(a)) return "";
    try {
      return new Intl.NumberFormat(J(w)).format(a);
    } catch {
      return String(a);
    }
  }
  function h(a) {
    let w = a;
    for (; w && w !== document.body && w !== document.documentElement; ) {
      const A = getComputedStyle(w).overflowY;
      if (A === "auto" || A === "scroll") return w;
      w = w.parentElement;
    }
    return null;
  }
  function b(a) {
    const w = a._scrollContainer || h(a.dom);
    return {
      container: w,
      top: w ? w.scrollTop : window.scrollY
    };
  }
  function o(a) {
    a.container ? a.container.scrollTop = a.top : window.scrollTo(window.scrollX, a.top);
  }
  function y(a) {
    if (!a) return 0;
    const w = getComputedStyle(a), E = parseFloat(w.marginTop) || 0, A = parseFloat(w.marginBottom) || 0;
    return a.offsetHeight + E + A;
  }
  function m(a) {
    this.dom = a, Y(this, a, _), this.tbody = a.querySelector("[data-ln-list-body]") || a, this.isDataDriven = a.hasAttribute("data-ln-list-source"), this._totalSpan = a.querySelector("[data-ln-list-total]"), this._filteredSpan = a.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== a ? this._filteredSpan.parentElement : null), this._selectedSpan = a.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== a ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const w = this;
    return this._onSetSearch = function(E) {
      const A = (E.detail && E.detail.query != null ? E.detail.query : E.detail && E.detail.term != null ? E.detail.term : "").trim();
      w.isDataDriven ? (w.currentSearch = A, k(a, "ln-list:search", {
        list: w.name,
        query: w.currentSearch
      }), w._requestData()) : (w._searchTerm = A.toLowerCase(), w._applyFilterAndSort(), w._vStart = -1, w._vEnd = -1, w._render(), w._updateFooter(), k(a, "ln-list:filter", {
        term: w._searchTerm,
        matched: w._filteredData.length,
        total: w._data.length
      }));
    }, a.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(E) {
      E.preventDefault(), w._onSetSearch(E);
    }, a.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      w.isDataDriven ? (w.currentFilters = {}, w.currentSearch = "", k(a, "ln-list:clear-filters", { list: w.name }), w._requestData()) : (w._searchTerm = "", w._filters = {}, w._sortField = null, w._sortDir = null, w._applyFilterAndSort(), w._vStart = -1, w._vEnd = -1, w._render(), w._updateFooter(), k(a, "ln-list:filter", {
        term: "",
        matched: w._filteredData.length,
        total: w._data.length
      }));
    }, a.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, a.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(E) {
      const A = E.detail || {}, S = A.data || [], C = A.total != null ? A.total : S.length;
      if (!(w._hasInitialSeed && !w.isLoaded && S.length === 0 && C === 0)) {
        if (w._windowed) {
          w._cache.ingest(A) && !A.provisional && a.classList.remove("ln-list--loading");
          return;
        }
        w._data = S, w._lastTotal = C, w._lastFiltered = A.filtered != null ? A.filtered : w._data.length, w.totalCount = w._lastTotal, w.visibleCount = w._lastFiltered, w.isLoaded = !0, w._hasInitialSeed = !1, a.classList.remove("ln-list--loading"), w._vStart = -1, w._vEnd = -1, w._applyFilterAndSort(), w._render(), w._updateFooter(), k(a, "ln-list:rendered", {
          list: w.name,
          total: w.totalCount,
          visible: w.visibleCount
        });
      }
    }, a.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(E) {
      const A = E.detail && E.detail.loading;
      a.classList.toggle("ln-list--loading", !!A), A && (w.isLoaded = !1);
    }, a.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(E) {
      !w._windowed || !w._cache || w._cache.release(E.detail && E.detail.offset);
    }, a.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !w._windowed || !w._cache || w._cache.revalidate();
    }, a.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !w._windowed || !w._cache || w._requestData();
    }, a.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(E) {
      !E.detail || E.detail.field == null || (E.preventDefault(), w.currentSort = E.detail.direction === "none" ? null : { field: E.detail.field, direction: E.detail.direction }, w._requestData());
    }, a.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(E) {
      if (E.target.closest("[data-ln-item-select]") || E.target.closest("[data-ln-item-action]") || E.target.closest("a") || E.target.closest("button") || E.ctrlKey || E.metaKey || E.button === 1) return;
      const A = E.target.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id"), C = A._lnRecord || {};
      k(a, "ln-list:item-click", {
        list: w.name,
        id: S,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(E) {
      const A = E.target.closest("[data-ln-item-action]");
      if (!A) return;
      const S = A.closest("[data-ln-item]");
      if (!S) return;
      const C = A.getAttribute("data-ln-item-action"), L = S.getAttribute("data-ln-item-id"), I = S._lnRecord || {};
      k(a, "ln-list:item-action", {
        list: w.name,
        id: L,
        action: C,
        record: I
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : k(a, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      w.tbody.children.length > 0 && (w._emptyObserver.disconnect(), w._emptyObserver = null, w._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(E) {
      if (E.preventDefault(), !E.detail) return;
      const A = E.detail.key, S = E.detail.values || [];
      if (A) {
        if (S.length === 0)
          delete w._filters[A];
        else {
          const C = [];
          for (let L = 0; L < S.length; L++)
            C.push(S[L].toLowerCase());
          w._filters[A] = C;
        }
        w._applyFilterAndSort(), w._vStart = -1, w._vEnd = -1, w._render(), w._updateFooter(), k(a, "ln-list:filter", {
          term: w._searchTerm,
          matched: w._filteredData.length,
          total: w._data.length
        });
      }
    }, a.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(E) {
      if (!E.detail || E.detail.field == null) return;
      E.preventDefault();
      const A = E.detail.direction === "none" ? null : E.detail.direction;
      w._sortField = A === null ? null : E.detail.field, w._sortDir = A, w._applyFilterAndSort(), w._vStart = -1, w._vEnd = -1, w._render(), w._updateFooter(), k(a, "ln-list:sorted", {
        field: w._sortField,
        direction: E.detail && E.detail.direction,
        matched: w._filteredData.length,
        total: w._data.length
      });
    }, a.addEventListener("ln-sort:change", this._onSort)), this;
  }
  m.prototype._parseChildren = function() {
    const a = Array.from(this.tbody.children).filter((w) => !w.classList.contains("ln-list__spacer"));
    this._data = [], a.length > 0 && (this._itemHeight = y(a[0]) || 50);
    for (let w = 0; w < a.length; w++) {
      const E = a[w], A = E.getAttribute("data-ln-item-id") || E.getAttribute("id"), S = E.textContent.trim().toLowerCase();
      let C = null;
      if (this.isDataDriven) {
        C = {}, A != null && (C.id = A);
        const q = E.querySelectorAll("[data-ln-list-field]");
        for (let D = 0; D < q.length; D++) {
          const O = q[D], F = O.getAttribute("data-ln-list-field");
          F && (C[F] = At(O));
        }
      }
      const L = {}, I = E.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let q = 0; q < I.length; q++) {
        const D = I[q], O = D.getAttribute("data-ln-list-field") || D.getAttribute("data-ln-field");
        O && (L[O] = At(D));
      }
      for (let q = 0; q < E.attributes.length; q++) {
        const D = E.attributes[q];
        if (D.name.startsWith("data-") && !D.name.startsWith("data-ln-")) {
          const O = D.name.slice(5);
          O && (L[O] = D.value);
        }
      }
      this._data.push({
        html: E.outerHTML,
        id: A,
        searchText: S,
        fields: L,
        ...C || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, m.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const a = this._searchTerm, w = a ? a.split(/\s+/).filter(Boolean) : [], E = this._filters || {}, A = Object.keys(E).length > 0;
      if (w.length === 0 && !A ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (w.length > 0 && !w.every(function(L) {
          return S.searchText && S.searchText.indexOf(L) !== -1;
        }))
          return !1;
        if (A)
          for (const C in E) {
            const L = E[C];
            if (L && L.length > 0) {
              const I = S.fields && S.fields[C] !== void 0 ? S.fields[C] : S[C] !== void 0 ? S[C] : null, q = I != null ? String(I).toLowerCase() : "";
              if (L.indexOf(q) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const S = this._sortField, C = this._sortDir === "desc" ? -1 : 1, L = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base" }) : null, I = this._filteredData.map(function(D) {
          return D.fields && D.fields[S] !== void 0 ? D.fields[S] : D[S];
        }), q = He(I);
        this._filteredData.sort(function(D, O) {
          const F = D.fields && D.fields[S] !== void 0 ? D.fields[S] : D[S], U = O.fields && O.fields[S] !== void 0 ? O.fields[S] : O[S];
          return Ue(F, U, q, L) * C;
        });
      }
    }
  }, m.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const a = this._lastTotal, w = this.visibleCount;
        if (a === 0 || this._filteredData.length === 0 || w === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const a = this._filteredData.length;
        a === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : a > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, m.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const a = this._filteredData, w = document.createDocumentFragment();
      for (let A = 0; A < a.length; A++) {
        const S = this._buildItem(a[A]);
        S && w.appendChild(S);
      }
      const E = b(this);
      this.tbody.replaceChildren(w), o(E), this._selectable && this._updateSelectAll();
    } else {
      const a = [], w = this._filteredData;
      for (let A = 0; A < w.length; A++) a.push(w[A].html);
      const E = b(this);
      this.tbody.innerHTML = a.join(""), o(E), this._selectable && this._restoreSelection();
    }
  }, m.prototype._readGridLayout = function() {
    const a = getComputedStyle(this.tbody), w = a.gridTemplateColumns;
    let E = 1;
    if (w && w !== "none") {
      const S = w.trim().split(/\s+/).filter(Boolean);
      S.length > 0 && (E = S.length);
    }
    const A = parseFloat(a.rowGap);
    return { columns: E, rowGap: isNaN(A) ? 0 : A };
  }, m.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const a = this._cache.peek(), w = a ? this._buildItem(a) : this._buildPlaceholderItem();
      w && (this.tbody.textContent = "", this.tbody.appendChild(w), this._itemHeight = y(w) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const a = this._buildItem(this._data[0]);
        a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = y(a) || 50, this.tbody.textContent = "");
      }
    } else {
      const a = this.tbody.children;
      a.length > 0 && (this._itemHeight = y(a[0]) || 50);
    }
  }, m.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const a = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = h(this.dom);
    const w = this._scrollContainer || window;
    this._scrollHandler = function() {
      a._rafId || (a._rafId = requestAnimationFrame(function() {
        a._rafId = null, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, this._resizeRafId = null, this._resizeHandler = function() {
      a._resizeRafId || (a._resizeRafId = requestAnimationFrame(function() {
        a._resizeRafId = null, a._itemHeight = 0, a._measureItemHeight(), a._vStart = -1, a._vEnd = -1, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, w.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, m.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._resizeRafId && (cancelAnimationFrame(this._resizeRafId), this._resizeRafId = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, m.prototype._renderVirtual = function() {
    const a = this._filteredData, w = a.length, E = this._itemHeight;
    if (!E || !w) return;
    const A = this._scrollContainer;
    let S, C;
    if (A) {
      const nt = this.tbody.getBoundingClientRect(), V = A.getBoundingClientRect(), W = A === this.tbody ? 0 : nt.top - V.top + A.scrollTop;
      S = A.scrollTop - W, C = A.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      S = window.scrollY - V, C = window.innerHeight;
    }
    const L = this._readGridLayout(), I = L.columns, q = L.rowGap, D = E + q, O = Math.ceil(w / I);
    let F = Math.max(0, Math.floor(S / D) - 15);
    F = Math.min(F, O);
    const U = Math.ceil(C / D) + 30, K = Math.min(F + U, O), G = Math.min(F * I, w), tt = Math.min(K * I, w);
    if (G === this._vStart && tt === this._vEnd) return;
    this._vStart = G, this._vEnd = tt;
    const bt = F * D, at = (O - K) * D;
    if (this.isDataDriven) {
      const nt = document.createDocumentFragment();
      if (bt > 0) {
        const W = document.createElement(this.isUl ? "li" : "div");
        W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = bt + "px", nt.appendChild(W);
      }
      for (let W = G; W < tt; W++) {
        const yt = this._buildItem(a[W]);
        yt && nt.appendChild(yt);
      }
      if (at > 0) {
        const W = document.createElement(this.isUl ? "li" : "div");
        W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = at + "px", nt.appendChild(W);
      }
      const V = b(this);
      this.tbody.replaceChildren(nt), o(V), this._selectable && this._updateSelectAll();
    } else {
      let nt = "";
      bt > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${bt}px"></${this.isUl ? "li" : "div"}>`);
      for (let W = G; W < tt; W++)
        nt += a[W].html;
      at > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${at}px"></${this.isUl ? "li" : "div"}>`);
      const V = b(this);
      this.tbody.innerHTML = nt, o(V), this._selectable && this._restoreSelection();
    }
  }, m.prototype._buildPlaceholderItem = function() {
    const a = document.createElement(this.isUl ? "li" : "div");
    return a.className = "ln-list__placeholder", a.setAttribute("aria-hidden", "true"), a.style.height = this._itemHeight + "px", a;
  }, m.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const a = this._itemHeight;
    if (!a) return;
    const w = this._scrollContainer;
    let E, A;
    if (w) {
      const V = this.tbody.getBoundingClientRect(), W = w.getBoundingClientRect(), yt = w === this.tbody ? 0 : V.top - W.top + w.scrollTop;
      E = w.scrollTop - yt, A = w.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      E = window.scrollY - W, A = window.innerHeight;
    }
    const S = this._readGridLayout(), C = S.columns, L = S.rowGap, I = a + L, q = this._cache.logicalTotal, D = Math.ceil(q / C);
    let O = Math.max(0, Math.floor(E / I) - 15);
    O = Math.min(O, D);
    const F = Math.ceil(A / I) + 30, U = Math.min(O + F, D), K = Math.min(O * C, q), G = Math.min(U * C, q), tt = O * I, bt = (D - U) * I, at = document.createDocumentFragment();
    if (tt > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = tt + "px", at.appendChild(V);
    }
    for (let V = K; V < G; V++)
      if (this._cache.has(V)) {
        const W = this._buildItem(this._cache.get(V));
        W && at.appendChild(W);
      } else
        at.appendChild(this._buildPlaceholderItem());
    if (bt > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = bt + "px", at.appendChild(V);
    }
    const nt = b(this);
    this.tbody.replaceChildren(at), o(nt), this._vStart = K, this._vEnd = G, this._cache.ensure(K, G);
  }, m.prototype._showEmptyState = function() {
    let a = null;
    if (this.isDataDriven) {
      const w = this._lastTotal != null ? this._lastTotal : this._data.length, A = this.visibleCount === 0 && w > 0, S = A ? this.name + "-empty-filtered" : this.name + "-empty";
      if (a = Lt(this.dom, S, "ln-list"), !a) {
        const C = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (C) {
          const L = A ? "search" : "initial", I = C.content.querySelector(`[data-ln-empty-when="${L}"]`) || C.content.firstElementChild;
          I && (a = document.importNode(I, !0));
        }
      }
    } else {
      const w = this.dom.querySelector(`template[${i}]`);
      if (w) {
        const E = w.content.firstElementChild;
        E && (a = document.importNode(E, !0));
      }
    }
    if (a)
      if (a.tagName === "LI" || a.tagName === "TR")
        this.tbody.replaceChildren(a);
      else {
        const w = document.createElement(this.isUl ? "li" : "div");
        w.appendChild(a), this.tbody.replaceChildren(w);
      }
    else
      this.tbody.replaceChildren();
    k(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, m.prototype._buildItem = function(a) {
    let w = Lt(this.dom, this.name + "-row", "ln-list");
    if (!w) {
      const A = this.dom.querySelector("template[data-ln-item]");
      A && (w = document.importNode(A.content, !0));
    }
    let E = w ? w.querySelector("[data-ln-item]") || w.firstElementChild : null;
    if (E)
      Zt(E, a), ft(E, a);
    else if (a && a.html) {
      const A = document.createElement(this.isUl ? "ul" : "div");
      A.innerHTML = a.html, E = A.firstElementChild;
    } else if (E = document.createElement(this.isUl ? "li" : "div"), E.setAttribute("data-ln-item", ""), a && typeof a == "object") {
      for (const A in a)
        if (A !== "html" && a[A] != null) {
          const S = document.createElement("span");
          S.setAttribute("data-ln-field", A), S.textContent = String(a[A]), E.appendChild(S);
        }
    }
    if (E._lnRecord = a, a && a.id != null && (E.setAttribute("data-ln-item-id", a.id), this._selectable && this.selectedIds.has(String(a.id)))) {
      E.classList.add("ln-item-selected");
      const A = E.querySelector("[data-ln-item-select]");
      A && (A.checked = !0);
    }
    return E;
  }, m.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    for (let w = 0; w < a.length; w++) {
      const E = a[w].getAttribute("data-ln-item-id"), A = E != null && this.selectedIds.has(String(E));
      a[w].classList.toggle("ln-item-selected", A);
      const S = a[w].querySelector("[data-ln-item-select]");
      S && (S.checked = A);
    }
    this._updateSelectAll();
  }, m.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const a = this;
    this._onSelectionChange = function(w) {
      const E = w.target.closest("[data-ln-item-select]");
      if (!E) return;
      const A = E.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id");
      S != null && (E.checked ? (a.selectedIds.add(String(S)), A.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(S)), A.classList.remove("ln-item-selected")), a._updateSelectAll(), a._updateFooter(), k(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const w = a._selectAllCheckbox.checked, E = a.tbody.querySelectorAll("[data-ln-item]");
      for (let A = 0; A < E.length; A++) {
        const S = E[A], C = S.getAttribute("data-ln-item-id"), L = S.querySelector("[data-ln-item-select]");
        C != null && (w ? (a.selectedIds.add(String(C)), S.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(C)), S.classList.remove("ln-item-selected")), L && (L.checked = w));
      }
      k(a.dom, "ln-list:select-all", { list: a.name, selected: w }), k(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }), a._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, m.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    let w = a.length > 0;
    for (let E = 0; E < a.length; E++) {
      const A = a[E].getAttribute("data-ln-item-id");
      if (A != null && !this.selectedIds.has(String(A))) {
        w = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = w;
  }, m.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    vn(this, "ln-list:request-data", "list");
  }, m.prototype._enterWindowedMode = function() {
    const a = this, w = this.dom, E = parseInt(w.getAttribute("data-ln-list-window"), 10), A = parseInt(w.getAttribute("data-ln-list-window-page"), 10), S = parseInt(w.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !a._windowed || !a._cache || (a.totalCount = a._cache.grandTotal, a.visibleCount = a._cache.logicalTotal, a._lastTotal = a._cache.grandTotal, a.isLoaded = !0, a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), k(w, "ln-list:rendered", {
        list: a.name,
        total: a.totalCount,
        visible: a.visibleCount
      }));
    }, this._renderBatch = Ht(this._onCacheChange), this._cache = Hn({
      windowSize: E > 0 ? E : 1e3,
      pageSize: A > 0 ? A : 200,
      threshold: S >= 0 ? S : 25,
      fetchDebounce: 120,
      requestPage: function(C, L, I) {
        k(w, "ln-list:request-data", {
          list: a.name,
          sort: C.sort,
          filters: C.filters,
          search: C.search,
          offset: L,
          limit: I,
          queryGen: a._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, m.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const a = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), w = a > 0 ? a : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: w,
        filtered: w
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, m.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, m.prototype._updateFooter = function() {
    let a = 0, w = 0;
    this.isDataDriven ? (a = this._lastTotal != null ? this._lastTotal : this._data.length, w = this.visibleCount) : (a = this._data.length, w = this._filteredData.length);
    const E = w < a;
    if (this._totalSpan && (this._totalSpan.textContent = v(a, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = E ? v(w, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !E), this._selectedSpan) {
      const A = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = A > 0 ? v(A, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", A === 0);
    }
  }, m.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, m, "ln-list", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(r) {
    const _ = r[e];
    _ && g.call(_);
  }
  const d = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, f = "http://www.w3.org/2000/svg", p = 36, l = 16, c = 2 * Math.PI * l;
  function s(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, u.call(this), g.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(r, _) {
    const v = document.createElementNS(f, r);
    for (const [h, b] of Object.entries(_))
      v.setAttribute(h, b);
    return v;
  }
  function u() {
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
  function g() {
    const r = this.dom.getAttribute("data-ln-circular-progress"), _ = this.dom.getAttribute("data-ln-circular-progress-max"), v = Wn(r, _ || 100), h = c - v.percentage / 100 * c;
    this.progressCircle.setAttribute("stroke-dashoffset", h);
    const b = this.dom.getAttribute("data-ln-circular-progress-label"), o = b !== null ? b : Math.round(v.percentage) + "%";
    this.labelEl.textContent = o, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", o), k(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  H(t, e, s, "ln-circular-progress", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const d = {
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
    const u = Array.from(this.dom.children).indexOf(s);
    if (Q(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: u
    }).defaultPrevented) return;
    l.preventDefault(), c.setPointerCapture(l.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), k(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: u
    });
    const r = this;
    let _ = null, v = null;
    const h = function(o) {
      v = o, !_ && (_ = requestAnimationFrame(function() {
        _ = null, v && r._handlePointerMove(v);
      }));
    }, b = function(o) {
      _ && (cancelAnimationFrame(_), _ = null), r._handlePointerEnd(o), c.removeEventListener("pointermove", h), c.removeEventListener("pointerup", b), c.removeEventListener("pointercancel", b);
    };
    c.addEventListener("pointermove", h), c.addEventListener("pointerup", b), c.addEventListener("pointercancel", b);
  }, f.prototype._handlePointerMove = function(l) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), s = this._dragging;
    let n = null, u = null;
    for (let g = 0; g < c.length; g++) {
      const r = c[g];
      if (r === s) continue;
      const _ = r.getBoundingClientRect(), v = _.top + _.height / 2;
      if (l.clientY >= _.top && l.clientY < v) {
        n = r, u = "before";
        break;
      } else if (l.clientY >= v && l.clientY <= _.bottom) {
        n = r, u = "after";
        break;
      }
    }
    if (!(this._lastDropTarget === n && this._lastDropPos === u)) {
      this._lastDropTarget && this._lastDropTarget !== n && this._lastDropTarget.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after"), this._lastDropTarget = n, this._lastDropPos = u;
      for (let g = 0; g < c.length; g++) {
        const r = c[g];
        r !== n && (r.classList.contains("ln-sortable--drop-before") && r.classList.remove("ln-sortable--drop-before"), r.classList.contains("ln-sortable--drop-after") && r.classList.remove("ln-sortable--drop-after"));
      }
      if (n) {
        const g = u === "before" ? "ln-sortable--drop-before" : "ln-sortable--drop-after", r = u === "before" ? "ln-sortable--drop-after" : "ln-sortable--drop-before";
        n.classList.contains(r) && n.classList.remove(r), n.classList.contains(g) || n.classList.add(g);
      }
    }
  }, f.prototype._handlePointerEnd = function(l) {
    if (!this._dragging) return;
    const c = this._dragging, s = Array.from(this.dom.children), n = s.indexOf(c);
    let u = null, g = null;
    for (const r of s) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        u = r, g = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        u = r, g = "after";
        break;
      }
    }
    this._lastDropTarget = null, this._lastDropPos = null;
    for (const r of s)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), u && u !== c) {
      g === "before" ? this.dom.insertBefore(c, u) : this.dom.insertBefore(c, u.nextElementSibling);
      const _ = Array.from(this.dom.children).indexOf(c);
      k(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: n,
        newIndex: _
      });
    }
    this._dragging = null;
  };
  function p(l) {
    const c = l[e];
    if (!c) return;
    const s = l.getAttribute(t) !== "disabled";
    s !== c.isEnabled && (c.isEnabled = s, k(l, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: l }));
  }
  H(t, e, f, "ln-sortable", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", d = "data-ln-picklist-max";
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
    for (const u of [this.available, this.selected])
      for (const g of u.children)
        this._initial.push(g);
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
    for (let g = 0; g < n.length; g++)
      this._initial.includes(n[g]) || this._initial.push(n[g]);
    let u = 0;
    for (let g = 0; g < this._initial.length; g++) {
      const r = this._initial[g];
      if (!r.isConnected) continue;
      const _ = r.querySelector('input[type="checkbox"]');
      if (!_) continue;
      let v;
      _.checked ? this.max === null || u < this.max ? (v = this.selected, u++) : (_.checked = !1, v = this.available) : v = this.available, v.appendChild(r);
    }
  }, p.prototype._onFormReset = function(n) {
    const u = this;
    setTimeout(function() {
      u._destroyed || n.defaultPrevented || u.sync();
    }, 0);
  }, p.prototype._onChange = function(n) {
    const u = n.target.closest('input[type="checkbox"]');
    if (!u) return;
    const g = u.closest("li");
    if (!g) return;
    const r = g.parentElement;
    if (r !== this.available && r !== this.selected) return;
    if (!this.isEnabled) {
      u.checked = !u.checked;
      return;
    }
    const _ = u.checked ? this.selected : this.available;
    if (r === _) return;
    if (_ === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      u.checked = !u.checked, k(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: g,
        checkbox: u,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: g, from: r, to: _, checkbox: u };
    if (Q(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      u.checked = !u.checked;
      return;
    }
    const h = document.activeElement === u;
    _.appendChild(g), h && u.focus(), k(this.dom, "ln-picklist:move", v);
  };
  function l(n) {
    const u = n.getAttribute(d);
    if (u === null || u === "") return null;
    const g = parseInt(u, 10);
    return isNaN(g) || g < 0 ? null : g;
  }
  function c(n) {
    const u = n[e];
    if (!u) return;
    const g = n.getAttribute(t) !== "disabled";
    g !== u.isEnabled && (u.isEnabled = g, k(n, g ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function s(n) {
    const u = n[e];
    u && (u.max = l(n));
  }
  H(t, e, p, "ln-picklist", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", d = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function p(g, r, _) {
    return g.getAttribute(r) || _;
  }
  function l(g, r, _) {
    const v = parseFloat(g.getAttribute(r));
    return isNaN(v) || v <= 0 ? _ : v;
  }
  function c(g) {
    const r = document.createElement("span");
    return r.setAttribute(d, ""), r.setAttribute("role", "alert"), r.textContent = g, r;
  }
  const s = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: p, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: l, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (g, r) => g.getAttribute(r) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = X(s);
  function u(g) {
    this.dom = g, Y(this, g, n), this.revertTimer = null, this._submitted = !1, this.idleEl = g.querySelector("[data-ln-confirm-idle]"), this.activeEl = g.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : g.textContent.trim();
    const r = this;
    return this._onClick = function(_) {
      if (!De(_))
        if (!r.confirming)
          _.preventDefault(), _.stopImmediatePropagation(), r._enterConfirm();
        else {
          if (r._submitted) return;
          r._submitted = !0, r._reset();
        }
    }, g.addEventListener("click", this._onClick), this;
  }
  u.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const g = this.activeEl ? this.activeEl.textContent.trim() : "";
      g && (this.dom.setAttribute("aria-label", g), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const g = this.dom.querySelector("svg.ln-icon use");
      g && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = g.getAttribute("href"), g.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(c(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), k(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, u.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const g = this, r = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      g._reset();
    }, r);
  }, u.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const g = this.dom.querySelector("svg.ln-icon use");
      g && this.originalIconHref && g.setAttribute("href", this.originalIconHref);
      const r = this.dom.querySelector("[" + d + "]");
      r && r.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, H(t, e, u, "ln-confirm", {
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
  }, d = X(i), f = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(l) {
    if (this.dom = l, Y(this, l, d), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = l.querySelector("[data-ln-translations-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = f, this._localesRaw)
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
      const u = ae("ln-translations-menu-item", "ln-translations");
      if (!u) return;
      const g = u.querySelector("[data-ln-translations-lang]");
      g.setAttribute("data-ln-translations-lang", n), g.textContent = this.locales[n], g.addEventListener("click", function(r) {
        r.ctrlKey || r.metaKey || r.button === 1 || (r.preventDefault(), r.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(n));
      }), this.menuEl.appendChild(u);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = c === 0);
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(c) {
      const s = ae("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", c);
      const u = n.querySelector("span");
      u.textContent = l.locales[c] || c.toUpperCase();
      const g = n.querySelector("button"), r = l.locales[c] || c.toUpperCase();
      g.setAttribute("aria-label", l.removeLabel.replace("{lang}", r)), g.addEventListener("click", function(_) {
        _.ctrlKey || _.metaKey || _.button === 1 || (_.preventDefault(), _.stopPropagation(), l.removeLanguage(c));
      }), l.badgesEl.appendChild(s);
    });
  }, p.prototype.addLanguage = function(l, c) {
    if (this.activeLanguages.has(l)) return;
    const s = this.locales[l] || l;
    if (Q(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(l), c = c || {};
    const u = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const g of u) {
      const r = g.getAttribute("data-ln-translatable"), _ = g.getAttribute("data-ln-translations-prefix") || "", v = g.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const h = v.cloneNode(v.tagName === "SELECT");
      _ ? h.name = _ + "[trans][" + l + "][" + r + "]" : h.name = "trans[" + l + "][" + r + "]", h.value = c[r] !== void 0 ? c[r] : "", h.removeAttribute("id"), "placeholder" in h && (h.placeholder = this.placeholderLabel.replace("{lang}", s)), h.setAttribute("data-ln-translatable-lang", l);
      const b = g.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), o = b.length > 0 ? b[b.length - 1] : v;
      o.parentNode.insertBefore(h, o.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: s
    });
  }, p.prototype.removeLanguage = function(l) {
    if (!this.activeLanguages.has(l) || Q(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: l
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + l + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(l), this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:removed", {
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
const Hr = "ln-autosave:", Ur = 1e3;
function zr(t, e) {
  return e ? Hr + (t || "") + ":" + e : null;
}
function Kr(t, e = Ur) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", d = "data-ln-autosave-debounce-input", f = '[data-ln-autosave-exclude], input[type="password"]';
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
    const u = s.getAttribute(t) || s.id, g = zr(window.location.pathname, u);
    if (!g) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", s);
      return;
    }
    this.dom = s, this.key = g;
    let r = null;
    function _() {
      const o = Oe(s, { exclude: f });
      try {
        localStorage.setItem(g, JSON.stringify(o));
      } catch {
        return;
      }
      k(s, "ln-autosave:saved", { target: s, data: o });
    }
    function v() {
      let o;
      try {
        o = localStorage.getItem(g);
      } catch {
        return;
      }
      if (!o) return;
      let y;
      try {
        y = JSON.parse(o);
      } catch {
        return;
      }
      if (Q(s, "ln-autosave:before-restore", { target: s, data: y }).defaultPrevented) return;
      const a = Ne(s, y);
      for (let w = 0; w < a.length; w++)
        a[w].dispatchEvent(new Event("input", { bubbles: !0 })), a[w].dispatchEvent(new Event("change", { bubbles: !0 }));
      k(s, "ln-autosave:restored", { target: s, data: y });
    }
    function h() {
      try {
        localStorage.removeItem(g);
      } catch {
        return;
      }
      k(s, "ln-autosave:cleared", { target: s });
    }
    this._onFocusout = function(o) {
      const y = o.target;
      l(y) && y.name && !y.matches(f) && _();
    }, this._onChange = function(o) {
      const y = o.target;
      l(y) && y.name && !y.matches(f) && _();
    }, this._onSubmit = function() {
      h();
    }, this._onReset = function() {
      h();
    }, this._onClearClick = function(o) {
      o.target.closest("[" + i + "]") && h();
    }, s.addEventListener("focusout", this._onFocusout), s.addEventListener("change", this._onChange), s.addEventListener("submit", this._onSubmit), s.addEventListener("reset", this._onReset), s.addEventListener("click", this._onClearClick);
    const b = Kr(s.getAttribute(d));
    return b > 0 && (this._onInput = function(o) {
      const y = o.target;
      !l(y) || !y.name || y.matches(f) || (r !== null && clearTimeout(r), r = setTimeout(_, b));
    }, s.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return r;
    }, v(), this;
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
  }, d = {
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
    const y = this;
    if (this._textarea = o.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", o), this;
    const m = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), m && this._surface.setAttribute("data-placeholder", m);
    const a = this._textarea.id;
    if (a) {
      const S = o.querySelector('label[for="' + a + '"]');
      S && (S.id || (S.id = a + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = a ? a + "-surface" : "ln-editor-surface-" + ++c;
    const w = this._textarea.value.trim();
    w && (this._surface.innerHTML = w);
    const E = o.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? o.insertBefore(this._surface, E.nextSibling) : o.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const S = E.querySelectorAll("[data-ln-editor-action]");
      for (let C = 0; C < S.length; C++) {
        const L = S[C].getAttribute("data-ln-editor-action");
        s(L) && S[C].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      y._syncToTextarea(), k(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const C = S.target.closest("[data-ln-editor-action]");
      if (!C) return;
      const L = C.getAttribute("data-ln-editor-action");
      y._execAction(L);
    }, this._onPaste = function(S) {
      r(y, S);
    }, this._onKeydown = function(S) {
      h(y, S);
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
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), this._onSetContent = function(S) {
      const C = S.detail && S.detail.html;
      C !== void 0 && (y._surface.innerHTML = C, y._syncToTextarea(), k(y.dom, "ln-editor:changed", {
        html: y._textarea.value,
        target: y.dom
      }));
    }, o.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        y._surface.innerHTML = y._textarea.value, k(o, "ln-editor:changed", {
          html: y._textarea.value,
          target: o
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(o) {
    if (!(!o || Q(this.dom, "ln-editor:before-change", {
      action: o,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), f[o])
        document.execCommand(f[o], !1, null);
      else if (p[o]) {
        const m = p[o], a = u(this._surface);
        a && a.toLowerCase() === m ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + m + ">");
      } else l[o] ? document.execCommand(l[o], !1, null) : o === "link" ? b(this) : o === "unlink" ? document.execCommand("unlink", !1, null) : o === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const o = this.dom.querySelector('[role="toolbar"]');
    if (!o) return;
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return;
    const m = y.anchorNode;
    if (!m || !this._surface.contains(m)) return;
    const a = o.querySelectorAll("[data-ln-editor-action]");
    for (let w = 0; w < a.length; w++) {
      const E = a[w], A = E.getAttribute("data-ln-editor-action");
      let S = !1;
      if (f[A])
        try {
          S = document.queryCommandState(f[A]);
        } catch {
        }
      else if (p[A]) {
        const C = u(this._surface);
        S = C && C.toLowerCase() === p[A];
      } else if (l[A])
        try {
          S = document.queryCommandState(l[A]);
        } catch {
        }
      else A === "link" && (S = !!g(y.anchorNode, "A", this._surface));
      if (s(A)) {
        const C = String(S);
        E.getAttribute("aria-pressed") !== C && E.setAttribute("aria-pressed", C);
      }
      S ? E.classList.contains("ln-editor-active") || E.classList.add("ln-editor-active") : E.classList.contains("ln-editor-active") && E.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(o) {
    this._surface && (this._surface.innerHTML = o, this._syncToTextarea(), k(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const o = this.dom.querySelector('[role="toolbar"]');
    o && (o.removeEventListener("mousedown", this._onMousedownToolbar), o.removeEventListener("click", this._onClickToolbar)), this._detachSelection ? this._detachSelection() : document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const y = this._textarea ? this._textarea.form : null;
    if (y && this._onFormReset && y.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const m = this.dom.querySelector(".ln-editor__link-popover");
      m && m.remove();
    }
    delete this.dom[e];
  };
  function u(o) {
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return null;
    let m = y.anchorNode;
    if (!m) return null;
    for (; m && m !== o; ) {
      if (m.nodeType === 1) {
        const a = m.tagName;
        if (a === "H2" || a === "H3" || a === "H4" || a === "BLOCKQUOTE" || a === "PRE" || a === "P")
          return a;
      }
      m = m.parentNode;
    }
    return null;
  }
  function g(o, y, m) {
    for (; o && o !== m; ) {
      if (o.nodeType === 1 && o.tagName === y)
        return o;
      o = o.parentNode;
    }
    return null;
  }
  function r(o, y) {
    y.preventDefault();
    let m = "";
    if (y.clipboardData && (m = y.clipboardData.getData("text/html"), !m)) {
      const w = y.clipboardData.getData("text/plain");
      w && (m = w.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), m = "<p>" + m + "</p>");
    }
    if (!m) return;
    const a = _(m);
    a && document.execCommand("insertHTML", !1, a);
  }
  function _(o) {
    const y = document.createElement("div");
    return y.innerHTML = o, v(y), y.innerHTML;
  }
  function v(o) {
    const y = Array.from(o.childNodes);
    for (let m = 0; m < y.length; m++) {
      const a = y[m];
      if (a.nodeType !== 3) {
        if (a.nodeType !== 1) {
          o.removeChild(a);
          continue;
        }
        if (d[a.tagName]) {
          const w = Array.from(a.attributes);
          for (let E = 0; E < w.length; E++) {
            const A = w[E].name;
            if (a.tagName === "A" && A === "href") {
              const S = a.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || a.removeAttribute("href");
            } else
              a.removeAttribute(A);
          }
          a.tagName === "A" && a.setAttribute("rel", "noopener noreferrer"), v(a);
        } else {
          for (; a.firstChild; )
            o.insertBefore(a.firstChild, a);
          o.removeChild(a);
        }
      }
    }
  }
  function h(o, y) {
    if (!(y.ctrlKey || y.metaKey)) return;
    let m = null;
    switch (y.key.toLowerCase()) {
      case "b":
        m = "bold";
        break;
      case "i":
        m = "italic";
        break;
      case "u":
        m = "underline";
        break;
      case "k":
        m = "link";
        break;
    }
    m && (y.preventDefault(), o._execAction(m));
  }
  function b(o) {
    const y = window.getSelection();
    if (!y || y.rangeCount === 0) return;
    const m = g(y.anchorNode, "A", o._surface), a = y.getRangeAt(0).cloneRange();
    o._closeLinkPopover && o._closeLinkPopover();
    const w = Lt(o.dom, "ln-editor-link-popover", "ln-editor");
    if (!w) return;
    const E = w.firstElementChild;
    if (!E) return;
    const A = E.querySelector('input[type="url"]'), S = E.querySelector('[data-ln-editor-action="confirm-link"]'), C = E.querySelector('[data-ln-editor-action="cancel-link"]');
    m && (A.value = m.getAttribute("href") || "");
    const L = o.dom.querySelector('[role="toolbar"]');
    L ? L.after(E) : o.dom.insertBefore(E, o._surface), A.focus();
    function I() {
      const K = window.getSelection();
      K.removeAllRanges(), K.addRange(a);
    }
    function q() {
      document.removeEventListener("mousedown", U), o._closeLinkPopover = null, E.remove();
    }
    function D() {
      const K = A.value.trim();
      if (q(), I(), o._surface.focus(), K)
        if (m)
          m.setAttribute("href", K), m.setAttribute("rel", "noopener noreferrer"), o._syncToTextarea(), k(o.dom, "ln-editor:changed", {
            html: o._textarea.value,
            target: o.dom
          });
        else {
          document.execCommand("createLink", !1, K);
          const G = window.getSelection();
          if (G && G.anchorNode) {
            const tt = g(G.anchorNode, "A", o._surface);
            tt && (tt.setAttribute("rel", "noopener noreferrer"), o._syncToTextarea());
          }
        }
      else m && document.execCommand("unlink", !1, null);
    }
    function O() {
      q(), I(), o._surface.focus();
    }
    function F() {
      q();
    }
    function U(K) {
      const G = o.dom.contains(K.target) && K.target.closest('[data-ln-editor-action="link"]');
      !E.contains(K.target) && !G && F();
    }
    o._closeLinkPopover = q, S.addEventListener("click", D), C.addEventListener("click", O), A.addEventListener("keydown", function(K) {
      K.key === "Enter" ? (K.preventDefault(), D()) : K.key === "Escape" && (K.preventDefault(), O());
    }), document.addEventListener("mousedown", U);
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
  function d(f, p) {
    const l = window.CSS && CSS.escape ? CSS.escape(p) : p, c = document.querySelectorAll('[data-ln-fill-id="' + l + '"]');
    if (c.length === 0) return null;
    for (let s = 0; s < c.length; s++) {
      const n = c[s].getAttribute("data-ln-fill-form");
      if (n) {
        const u = document.getElementById(n);
        if (u && f.contains(u)) return c[s];
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
    const s = d(l, c);
    if (!s) return;
    const n = i(s);
    window.lnCore.lnFill(l, n);
  }), window[t] = !0;
})();
function jr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", d = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${d}+`, "g"), i).replace(new RegExp(`^${d}+|${d}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: j, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, d = X(i), f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(l) {
    if (l.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", l.tagName), this;
    const c = l.form;
    if (!c)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", l), this;
    Y(this, l, d);
    const s = c.elements[this.sourceName];
    if (!s)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', l), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', l), this;
    this.dom = l, this.form = c, this.source = s, this._pristine = l.value === "", this._mirroring = !1;
    const n = this;
    return Me(l, f, {
      get: function() {
        return f.get.call(l);
      },
      set: function(u) {
        f.set.call(l, u), n._mirroring || (n._pristine = u === "" || u === null || u === void 0);
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
    this._mirroring = !0, this.dom.value = jr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), this._onFormReset && this.form && this.form.removeEventListener("reset", this._onFormReset), Object.defineProperty(this.dom, "value", f), delete this.dom[e]);
  }, H(t, e, p, "ln-slug", {
    attributes: i
  });
})();
function Wr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), d = t.getTime(), f = Math.floor((d - i) / 1e3), p = Math.abs(f);
  return p < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : p < 60 ? { value: f, unit: "second", isOlderThanMonth: !1 } : p < 3600 ? { value: Math.round(f / 60), unit: "minute", isOlderThanMonth: !1 } : p < 86400 ? { value: Math.round(f / 3600), unit: "hour", isOlderThanMonth: !1 } : p < 604800 ? { value: Math.round(f / 86400), unit: "day", isOlderThanMonth: !1 } : p < 2592e3 ? { value: Math.round(f / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(f / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function ie(t, e, i = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const d = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== i.getFullYear() && (d.year = "numeric"), d;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: A, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: A, description: "BCP 47 language tag override for time formatting" }
  }, d = {}, f = {};
  function p(C) {
    return C.getAttribute("data-ln-time-locale") || J(C);
  }
  function l(C, L) {
    const I = (C || "") + "|" + JSON.stringify(L);
    return d[I] || (d[I] = new Intl.DateTimeFormat(C, L)), d[I];
  }
  function c(C) {
    const L = C || "";
    return f[L] || (f[L] = new Intl.RelativeTimeFormat(C, { numeric: "auto", style: "narrow" })), f[L];
  }
  const s = /* @__PURE__ */ new Set();
  let n = null;
  function u() {
    n || (n = setInterval(r, 6e4));
  }
  function g() {
    n && (clearInterval(n), n = null);
  }
  function r() {
    for (const C of s) {
      if (!document.body.contains(C.dom)) {
        s.delete(C);
        continue;
      }
      y(C);
    }
    s.size === 0 && g();
  }
  function _(C, L) {
    const I = Rt(L), q = (L || "").toLowerCase().split("-")[0], D = l(L, ie("full", C)), O = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (I && O !== q && I.monthsLong) {
      const F = I.monthsLong[C.getMonth()], U = C.getDate(), K = C.getFullYear(), G = String(C.getHours()).padStart(2, "0"), tt = String(C.getMinutes()).padStart(2, "0");
      return `${U} ${F} ${K}, ${G}:${tt}`;
    }
    return D.format(C);
  }
  function v(C, L) {
    const I = ie("short", C), q = Rt(L), D = (L || "").toLowerCase().split("-")[0], O = l(L, I), F = O.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (q && F !== D && q.monthsShort) {
      const U = q.monthsShort[C.getMonth()], K = C.getDate(), G = I.year ? " " + C.getFullYear() : "";
      return `${K} ${U}${G}`;
    }
    return O.format(C);
  }
  function h(C, L) {
    return l(L, ie("date", C)).format(C);
  }
  function b(C, L) {
    return l(L, ie("time", C)).format(C);
  }
  function o(C, L) {
    const I = Wr(C);
    return I.isOlderThanMonth ? v(C, L) : c(L).format(I.value, I.unit);
  }
  function y(C) {
    const L = C.dom.getAttribute("datetime");
    if (!L) return;
    const I = it(L);
    if (!I) return;
    const q = C.dom.getAttribute(t) || "short", D = p(C.dom);
    let O;
    switch (q) {
      case "relative":
        O = o(I, D);
        break;
      case "full":
        O = _(I, D);
        break;
      case "date":
        O = h(I, D);
        break;
      case "time":
        O = b(I, D);
        break;
      default:
        O = v(I, D);
        break;
    }
    C.dom.textContent = O, q !== "full" && (C.dom.title = _(I, D));
  }
  const m = /* @__PURE__ */ new Set();
  let a = !1;
  function w() {
    ue(), !a && (a = !0, document.addEventListener("ln-core:locale-change", function() {
      m.forEach(function(C) {
        y(C);
      });
    }));
  }
  function E(C) {
    return this.dom = C, m.add(this), w(), y(this), C.getAttribute(t) === "relative" && (s.add(this), u()), this;
  }
  E.prototype.render = function() {
    y(this);
  }, E.prototype.destroy = function() {
    m.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && g(), delete this.dom[e];
  };
  function A(C) {
    const L = C[e];
    if (!L) return;
    C.getAttribute(t) === "relative" ? (s.add(L), u()) : (s.delete(L), s.size === 0 && g()), y(L);
  }
  function S(C) {
    C.nodeType === 1 && C.hasAttribute && C.hasAttribute(t) && C[e] && y(C[e]);
  }
  H(t, e, E, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: A,
    onInit: S
  });
})();
function Vr(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const f = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, p = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  let c = 0, s = 0, n = 0, u = !1, g = null;
  function r(h, b) {
    p.delete(h), p.set(h, b);
  }
  function _() {
    if (p.size <= e) return [];
    const h = [];
    for (; p.size > e; ) {
      const o = p.keys().next().value;
      h.push(p.get(o)), p.delete(o);
    }
    const b = new Set(p.values());
    return h.filter((o) => !b.has(o));
  }
  function v(h, b) {
    l.add(h), clearTimeout(g), g = setTimeout(() => f(h, i, b), d);
  }
  return {
    get logicalTotal() {
      return c;
    },
    set logicalTotal(h) {
      c = h;
    },
    get grandTotal() {
      return s;
    },
    set grandTotal(h) {
      s = h;
    },
    get queryGen() {
      return n;
    },
    set queryGen(h) {
      n = h;
    },
    get size() {
      return p.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return u;
    },
    getId: (h) => {
      if (!p.has(h)) return;
      const b = p.get(h);
      return r(h, b), b;
    },
    ensure: (h, b, o) => {
      if (!u && !l.has(0)) return v(0, o);
      if (c <= 0) return;
      const y = Math.max(0, h), m = Math.min(c, b);
      for (let a = y; a < m; a++)
        if (!p.has(a)) {
          const w = Math.floor(a / i) * i;
          if (!l.has(w)) return v(w, o);
        }
    },
    ingest: (h, b, o, y, m) => {
      if (m != null && m !== n) return [];
      u = !0, o != null && (s = o), y != null && (c = y);
      for (let a = 0; a < b.length; a++)
        r(h + a, b[a]);
      return l.delete(h), _();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      u = !1, p.clear(), l.clear(), clearTimeout(g);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (h = {}) => {
      let b = [];
      return h.windowSize > 0 && h.windowSize !== e && (e = h.windowSize, b = _()), h.pageSize > 0 && (i = h.pageSize), h.fetchDebounce >= 0 && (d = h.fetchDebounce), b;
    }
  };
}
function Gr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: d, direction: f } = e, p = f === "desc", l = t.map((s) => s ? s[d] : void 0), c = He(l);
  return [...t].sort((s, n) => {
    const u = s ? s[d] : void 0, g = n ? n[d] : void 0, r = Ue(u, g, c, i);
    return p ? -r : r;
  });
}
function vi(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((d) => Array.isArray(e[d]) && e[d].length > 0);
  return i.length ? t.filter((d) => d ? i.every((f) => Ke(d[f], e[f])) : !1) : t;
}
function $r(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const d = Gn(e);
  return d.length ? t.filter((f) => f ? d.every(
    (p) => i.some((l) => {
      const c = f[l];
      return c != null && $n(String(c), [p]);
    })
  ) : !1) : t;
}
function Qr(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const d = t.map((p) => p && p[e] != null ? parseFloat(p[e]) : NaN).filter((p) => Number.isFinite(p)), f = d.reduce((p, l) => p + l, 0);
  return i === "sum" ? f : i === "avg" && d.length ? f / d.length : 0;
}
function Yr(t, e = {}, i = [], d) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const f = t.length;
  let p = t;
  e.filters && (p = vi(p, e.filters)), e.search && (p = $r(p, e.search, i));
  const l = p.length;
  if (e.sort && (p = Gr(p, e.sort, d)), e.offset || e.limit) {
    const c = e.offset || 0, s = e.limit || p.length;
    p = p.slice(c, c + s);
  }
  return { records: p, total: f, filtered: l };
}
function Xr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const d = { ...i };
    for (const [f, p] of Object.entries(e))
      if (typeof p == "function")
        try {
          d[f] = p(i);
        } catch {
          d[f] = void 0;
        }
    return d;
  });
}
function Jr(t, e, i, d = "_meta") {
  if (!Array.isArray(t) || !t.includes(d)) return !0;
  for (const f of Object.keys(e || {})) {
    if (!t.includes(f)) return !0;
    const p = e[f] && e[f].indexes || [], l = i && i[f] || [];
    if (p.some((c) => !l.includes(c))) return !0;
  }
  return !1;
}
function Zr(t) {
  return { ok: !1, error: t && t.message ? t.message : String(t) };
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(T, x, R) {
    const N = T.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const M = parseInt(N, 10);
    return isNaN(M) ? R : M;
  }
  const d = {
    "data-ln-data-store": { type: "marker", effect: $e, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: $e, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: Fe, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: Mi, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: Fi, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, f = X(d), p = "ln_app_cache", l = "_meta", c = "1.0";
  let s = null, n = null;
  const u = {};
  function g(T) {
    T && T.name === "QuotaExceededError" && k(document, "ln-data-store:quota-exceeded", { error: T });
  }
  function r() {
    const T = {};
    for (const x of document.querySelectorAll(`[${t}]`)) {
      const R = x.id;
      if (R) {
        const N = x.getAttribute("data-ln-data-store-indexes") || "";
        T[R] = {
          indexes: N.split(",").map((M) => M.trim()).filter(Boolean)
        };
      }
    }
    return T;
  }
  function _() {
    return n || (n = new Promise((T) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB is not available in this environment"), T(null);
      const x = r(), R = Object.keys(x), N = indexedDB.open(p);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed"), T(null);
      }, N.onsuccess = (M) => {
        const B = M.target.result, P = Array.from(B.objectStoreNames), z = R.filter((dt) => P.includes(dt));
        let $ = {};
        if (z.length > 0) {
          const dt = B.transaction(z, "readonly");
          for (const ut of z)
            $[ut] = Array.from(dt.objectStore(ut).indexNames);
        }
        if (!Jr(P, x, $, l))
          return v(B), s = B, T(B);
        const qt = B.version;
        B.close();
        const vt = indexedDB.open(p, qt + 1);
        let ht = !1, pt = null;
        vt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection"), k(document, "ln-data-store:blocked", { db: p }), pt || (pt = setTimeout(() => {
            ht || (console.warn("[ln-data-store] Database upgrade timed out while blocked"), ht = !0, n = null, T(null));
          }, 5e3));
        }, vt.onerror = () => {
          ht || (pt && clearTimeout(pt), ht = !0, n = null, console.warn("[ln-data-store] Database upgrade failed"), T(null));
        }, vt.onupgradeneeded = (dt) => {
          const ut = dt.target.result, Bi = dt.target.transaction;
          ut.objectStoreNames.contains(l) || ut.createObjectStore(l, { keyPath: "key" });
          for (const zt of R)
            if (ut.objectStoreNames.contains(zt)) {
              const ee = Bi.objectStore(zt);
              for (const Mt of x[zt].indexes)
                ee.indexNames.contains(Mt) || ee.createIndex(Mt, Mt, { unique: !1 });
            } else {
              const ee = ut.createObjectStore(zt, { keyPath: "id" });
              for (const Mt of x[zt].indexes)
                ee.createIndex(Mt, Mt, { unique: !1 });
            }
        }, vt.onsuccess = (dt) => {
          if (ht) {
            dt.target.result && dt.target.result.close();
            return;
          }
          pt && clearTimeout(pt), ht = !0;
          const ut = dt.target.result;
          v(ut), s = ut, T(ut);
        };
      };
    }), n);
  }
  function v(T) {
    T.onversionchange = () => {
      T.close(), s = null, n = null;
    };
  }
  function h() {
    return s ? Promise.resolve(s) : (n = null, _());
  }
  async function b(T) {
    if (!Tt() || !T) return T;
    const x = { ...T }, R = x.id, N = await tr(x);
    return !N || !N.encrypted ? T : {
      ...N,
      id: R
    };
  }
  async function o(T) {
    return !T || !T.encrypted || !Tt() ? T : er(T, { silent: !0 });
  }
  const y = (T, x) => h().then((R) => R ? R.transaction(T, x).objectStore(T) : null);
  function m(T) {
    return new Promise((x, R) => {
      T.onsuccess = () => x(T.result), T.onerror = () => {
        g(T.error), R(T.error);
      };
    });
  }
  const a = (T) => y(T, "readonly").then((x) => x ? m(x.getAll()) : []).then((x) => Tt() ? Promise.all(x.map((R) => o(R))) : x), w = (T, x) => y(T, "readonly").then((R) => R ? m(R.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? m(R.get(Number(x))) : typeof x == "number" ? m(R.get(String(x))) : null) : null).then((R) => R ? o(R) : null), E = (T, x) => h().then((R) => {
    if (!R) return [];
    const M = R.transaction(T, "readonly").objectStore(T), B = x.map((P) => m(M.get(P)).then((z) => z !== void 0 ? z : typeof P == "string" && P.trim() !== "" && !isNaN(Number(P)) ? m(M.get(Number(P))) : typeof P == "number" ? m(M.get(String(P))) : null));
    return Promise.all(B).then((P) => Tt() ? Promise.all(P.map((z) => z ? o(z) : null)) : P);
  }), A = (T, x) => (Tt() ? b(x) : Promise.resolve(x)).then((N) => y(T, "readwrite").then((M) => M ? m(M.put(N)) : null)), S = (T, x) => y(T, "readwrite").then((R) => R ? m(R.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return m(R.delete(Number(x)));
    if (typeof x == "number")
      return m(R.delete(String(x)));
  }) : null), C = (T) => y(T, "readwrite").then((x) => x ? m(x.clear()) : null), L = (T) => y(T, "readonly").then((x) => x ? m(x.count()) : 0), I = (T) => y(l, "readonly").then((x) => x ? m(x.get(T)) : null), q = (T, x) => y(l, "readwrite").then((R) => {
    if (R)
      return x.key = T, m(R.put(x));
  });
  function D(T) {
    return this.dom = T, this._name = T.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", T), Y(this, T, f), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, T.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Vr({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, R, N) => {
        k(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: R,
          query: N,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), u[this._name] = this, O(this), this.ready = nt(this), this;
  }
  function O(T) {
    T._handlers = {
      create: (x) => F(T, "create", x.detail, () => K(T, x.detail)),
      update: (x) => F(T, "update", x.detail, () => G(T, x.detail)),
      delete: (x) => F(T, "delete", x.detail, () => tt(T, x.detail)),
      "bulk-delete": (x) => F(T, "bulk-delete", x.detail, () => bt(T, x.detail)),
      "sync-failed": (x) => {
        T.isSyncing = !1, k(T.dom, "ln-data-store:sync-error", {
          store: T._name,
          error: x.detail && x.detail.error,
          status: x.detail && x.detail.status
        });
      }
    };
    for (const [x, R] of Object.entries(T._handlers))
      T.dom.addEventListener(`ln-data-store:request-${x}`, R);
    T._queryHandlers = {
      "ln-search:change": (x) => {
        x.preventDefault();
        const R = x.detail && x.detail.term != null ? x.detail.term : "";
        R !== T.query.search && (T.query.search = R, fe(T));
      },
      "ln-filter:change": (x) => {
        x.preventDefault();
        const R = x.detail && x.detail.key;
        if (!R) return;
        const N = (x.detail.values || []).slice(), M = T.query.filters[R];
        (M ? M.length === N.length && M.every((P, z) => P === N[z]) : !N.length) || (N.length ? T.query.filters[R] = N : delete T.query.filters[R], fe(T));
      },
      "ln-sort:change": (x) => {
        x.preventDefault();
        const R = x.detail && x.detail.field, N = x.detail && x.detail.direction, M = N && N !== "none" ? { field: R, direction: N } : null, B = T.query.sort;
        !B && !M || B && M && B.field === M.field && B.direction === M.direction || (T.query.sort = M, fe(T));
      }
    };
    for (const [x, R] of Object.entries(T._queryHandlers))
      T.dom.addEventListener(x, R);
  }
  function F(T, x, R, N) {
    const M = R && R.requestId;
    return T._mutationChain = T._mutationChain.then(() => T.ready).then(() => {
      if (T.initializationError) throw T.initializationError;
      return N();
    }).catch((B) => at(T, x, M, B)), T._mutationChain;
  }
  function U(T, x = 0) {
    return L(T._name).then((R) => {
      if (T._windowIndex || T.windowed) {
        const N = T.totalCount != null ? T.totalCount : R;
        T.totalCount = Math.max(0, N + x);
      } else
        T.totalCount = R;
      return T.hasCache = !0, T.isLoaded = !0, T.canServe = !0, q(T._name, {
        schema_version: c,
        last_synced_at: T.lastSyncedAt,
        has_cache: !0,
        record_count: T.totalCount
      });
    });
  }
  function K(T, { tempId: x, data: R = {}, requestId: N } = {}) {
    const M = { ...R, id: x };
    return A(T._name, M).then(() => U(T, 1)).then(() => {
      k(T.dom, "ln-data-store:created", { store: T._name, record: M, tempId: x, requestId: N });
    });
  }
  function G(T, { id: x, data: R = {}, requestId: N } = {}) {
    return w(T._name, x).then((M) => {
      if (!M) throw new Error(`Record not found: ${x}`);
      const B = M.id, P = { ...M, ...R, id: B }, z = R.id, $ = z !== void 0 && z !== B;
      return ($ ? Si(T._name, B, { ...P, id: z }) : A(T._name, P)).then(() => U(T, 0)).then(() => {
        k(T.dom, "ln-data-store:updated", { store: T._name, record: $ ? { ...P, id: z } : P, previous: M, requestId: N });
      });
    });
  }
  function tt(T, { id: x, requestId: R } = {}) {
    return w(T._name, x).then((N) => {
      if (!N) {
        k(T.dom, "ln-data-store:deleted", { store: T._name, id: x, requestId: R, missing: !0 });
        return;
      }
      const M = N.id;
      return S(T._name, M).then(() => U(T, -1)).then(() => {
        k(T.dom, "ln-data-store:deleted", { store: T._name, id: M, requestId: R });
      });
    });
  }
  function bt(T, { ids: x = [], requestId: R } = {}) {
    return x.length ? Promise.all(x.map((N) => w(T._name, N))).then((N) => {
      const M = N.filter(Boolean).map((B) => B.id);
      return yt(T._name, M).then(() => U(T, -M.length)).then(() => {
        k(T.dom, "ln-data-store:deleted", { store: T._name, ids: M, requestId: R });
      });
    }) : (k(T.dom, "ln-data-store:deleted", { store: T._name, ids: [], requestId: R }), Promise.resolve());
  }
  function at(T, x, R, N) {
    console.error("[ln-data-store] " + x + " failed:", N), k(T.dom, "ln-data-store:mutation-error", {
      store: T._name,
      action: x,
      requestId: R,
      error: N
    });
  }
  function nt(T) {
    return _().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return I(T._name);
    }).then((x) => {
      if (T.initializationError = null, x && x.schema_version === c)
        T.lastSyncedAt = x.last_synced_at || null, T.totalCount = x.record_count || 0, T.hasCache = x.has_cache === !0 || T.totalCount > 0, T.hasCache && (T.isLoaded = !0, T.canServe = !0, k(T.dom, "ln-data-store:ready", { store: T._name, count: T.totalCount, source: "cache" })), T.isInitialized = !0, k(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: T.hasCache, lastSyncedAt: T.lastSyncedAt, count: T.totalCount });
      else {
        if (x && x.schema_version !== c)
          return C(T._name).then(() => q(T._name, { schema_version: c, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            T.isInitialized = !0, T.hasCache = !1, k(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        T.isInitialized = !0, T.hasCache = !1, k(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (T.isInitialized = !0, T.isLoaded = !1, T.canServe = !1, T.hasCache = !1, T.isSyncing = !1, T.initializationError = x, k(T.dom, "ln-data-store:initialization-error", { store: T._name, error: x }), { ok: !1, error: x }));
  }
  function V(T) {
    T.isSyncing = !0, k(T.dom, "ln-data-store:request-remote-sync", { since: T.lastSyncedAt });
  }
  function W(T, x) {
    return h().then((R) => R ? (Tt() ? Promise.all(x.map((M) => b(M))) : Promise.resolve(x)).then((M) => new Promise((B, P) => {
      const z = R.transaction(T, "readwrite"), $ = z.objectStore(T);
      M.forEach((et) => $.put(et)), z.oncomplete = () => B(), z.onerror = () => {
        g(z.error), P(z.error);
      };
    })) : void 0);
  }
  function yt(T, x) {
    return h().then((R) => {
      if (R)
        return new Promise((N, M) => {
          const B = R.transaction(T, "readwrite"), P = B.objectStore(T);
          x.forEach((z) => {
            P.delete(z), typeof z == "string" && z.trim() !== "" && !isNaN(Number(z)) ? P.delete(Number(z)) : typeof z == "number" && P.delete(String(z));
          }), B.oncomplete = () => N(), B.onerror = () => M(B.error);
        });
    });
  }
  function Si(T, x, R) {
    return (Tt() ? b(R) : Promise.resolve(R)).then((M) => h().then((B) => {
      if (B)
        return new Promise((P, z) => {
          const $ = B.transaction(T, "readwrite"), et = $.objectStore(T);
          et.put(M), et.delete(x), $.oncomplete = () => P(), $.onerror = () => {
            g($.error), z($.error);
          };
        });
    }));
  }
  const Ci = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Ti(T) {
    return T ? Object.keys(T).filter((x) => Array.isArray(T[x]) && T[x].length > 0) : [];
  }
  function ki(T, x, R) {
    return x.every((N) => R[N].map(String).includes(String(T[N])));
  }
  function Li(T) {
    return String(T || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function xi(T, x, R) {
    return x.every(
      (N) => R.some((M) => {
        const B = T[M];
        return B != null && String(B).toLowerCase().includes(N);
      })
    );
  }
  function Ii(T, x, R) {
    return Qr(T, x, R);
  }
  function Ut(T, x) {
    return Xr(x, T.presenters && T.presenters.computed);
  }
  function qi(T) {
    return !T.sort && !Tt();
  }
  function Di(T, x, R) {
    const N = Ti(x.filters), M = x.search ? Li(x.search) : [], B = T._searchFields, P = M.length > 0 && B && B.length > 0;
    return y(T._name, "readonly").then((z) => z ? new Promise(($, et) => {
      const qt = [], vt = z.openCursor();
      vt.onsuccess = () => {
        const ht = vt.result;
        if (!ht || qt.length >= R) {
          $(qt);
          return;
        }
        const pt = ht.value;
        (!N.length || ki(pt, N, x.filters)) && (!P || xi(pt, M, B)) && qt.push(pt), ht.continue();
      }, vt.onerror = () => et(vt.error);
    }) : []);
  }
  function Ge(T, x, R) {
    return Yr(x, R, T._searchFields, Ci);
  }
  function Ri(T, x, R) {
    const N = [];
    for (let B = x; B < x + R; B++) {
      const P = T._windowIndex.getId(B);
      N.push(P);
    }
    const M = Array.from(new Set(N.filter((B) => B !== void 0)));
    return E(T._name, M).then((B) => {
      const P = /* @__PURE__ */ new Map();
      for (let $ = 0; $ < B.length; $++) {
        const et = B[$];
        et && P.set(String(et.id), et);
      }
      const z = [];
      for (let $ = 0; $ < N.length; $++) {
        const et = N[$];
        if (et === void 0)
          z.push(null);
        else {
          const qt = P.get(String(et));
          z.push(qt || null);
        }
      }
      return {
        data: Ut(T, z),
        total: T._windowIndex.grandTotal,
        filtered: T._windowIndex.logicalTotal,
        offset: x,
        queryGen: T._windowIndex.queryGen
      };
    });
  }
  D.prototype.getAll = function(T = {}) {
    const x = this;
    if (x._windowIndex) {
      const R = T.offset || 0, N = T.limit || 200;
      if (x._windowIndex.ensure(R, R + N, T), !x._windowIndex.hasLoaded && !x.noLocalQuery) {
        const M = R + N, B = (P) => ({
          data: Ut(x, P),
          offset: R,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        });
        return qi(T) ? Di(x, T, M).then((P) => B(P.slice(R, M))) : a(x._name).then((P) => B(Ge(x, P, T).records));
      }
      return Ri(x, R, N);
    }
    return a(x._name).then((R) => {
      const N = Ge(x, R, T);
      return {
        data: Ut(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, D.prototype.getById = function(T) {
    return w(this._name, T).then((x) => x ? Ut(this, [x])[0] : null);
  }, D.prototype.count = function(T) {
    return T && Object.keys(T).length > 0 ? a(this._name).then((R) => vi(R, T).length) : this.windowed && this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, D.prototype.aggregate = function(T, x) {
    return a(this._name).then((R) => Ii(R, T, x));
  }, D.prototype.setPresenters = function(T) {
    this.presenters = T;
  }, D.prototype.applySync = function(T, x, R, N) {
    N = N || {};
    const M = this;
    if (M._windowIndex && N.queryGen != null && N.queryGen !== M._windowIndex.queryGen)
      return Promise.resolve({ ok: !0, stale: !0 });
    let B = h().then((P) => {
      if (!P) throw new Error("IndexedDB unavailable");
    });
    return T.length > 0 && (B = B.then(() => W(M._name, T))), x.length > 0 && (B = B.then(() => yt(M._name, x))), B.then(() => {
      if (M._windowIndex && (N.offset != null || N.total != null)) {
        const P = N.offset != null ? N.offset : 0, z = T.map((et) => et.id), $ = M._windowIndex.ingest(P, z, N.total, N.filtered, N.queryGen);
        if ($ && $.length) return yt(M._name, $);
      }
    }).then(() => L(M._name)).then((P) => (M.totalCount = N.total !== void 0 ? N.total : P, M.hasCache = !0, q(M._name, {
      schema_version: c,
      last_synced_at: R,
      has_cache: !0,
      record_count: M.totalCount
    }))).then(() => {
      const P = !M.isLoaded;
      return M.isLoaded = !0, M.canServe = !0, M.isSyncing = !1, M.lastSyncedAt = R, P ? (k(M.dom, "ln-data-store:loaded", { store: M._name, count: M.totalCount, meta: N }), k(M.dom, "ln-data-store:ready", { store: M._name, count: M.totalCount, source: "server", meta: N })) : k(M.dom, "ln-data-store:synced", {
        store: M._name,
        added: T.length,
        deleted: x.length,
        changed: !0,
        meta: N
      }), { ok: !0 };
    }).catch((P) => {
      M.isSyncing = !1;
      const z = P && P.message ? P.message : String(P);
      return console.error("[ln-data-store] applySync failed:", P), k(M.dom, "ln-data-store:sync-error", {
        store: M._name,
        error: z
      }), Zr(P);
    });
  }, D.prototype.applyQuery = function(T, x) {
    x = x || {};
    const R = this;
    let N = Promise.resolve();
    return T.length > 0 && (N = N.then(() => W(R._name, T))), N.then(() => L(R._name)).then((M) => (R.totalCount = x.total !== void 0 ? x.total : M, T.length > 0 && (R.canServe = !0), Ut(R, T))).catch((M) => (console.error("[ln-data-store] applyQuery failed:", M), []));
  }, D.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, D.prototype.fullReload = function() {
    const T = this;
    return C(T._name).then(() => q(T._name, {
      schema_version: c,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      T.isLoaded = !1, T.hasCache = !1, T.lastSyncedAt = null, T.totalCount = 0, V(T);
    });
  }, D.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [T, x] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${T}`, x);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [T, x] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(T, x);
      this._queryHandlers = null;
    }
    delete u[this._name], delete this.dom[e];
  };
  function Oi() {
    return h().then((T) => {
      if (!T) return;
      const x = Array.from(T.objectStoreNames);
      return new Promise((R, N) => {
        const M = T.transaction(x, "readwrite");
        x.forEach((B) => M.objectStore(B).clear()), M.oncomplete = () => R(), M.onerror = () => N(M.error);
      });
    }).then(() => {
      Object.values(u).forEach((T) => {
        T.isLoaded = !1, T.canServe = !1, T.isInitialized = !1, T.initializationError = null, T.hasCache = !1, T.isSyncing = !1, T.lastSyncedAt = null, T.totalCount = 0;
      });
    });
  }
  function fe(T) {
    T._windowIndex && T._windowIndex.reset(), k(T.dom, "ln-data-store:query-changed", {
      store: T._name,
      query: {
        filters: Object.assign({}, T.query.filters),
        search: T.query.search,
        sort: T.query.sort ? Object.assign({}, T.query.sort) : null
      }
    });
  }
  const Ni = "data-ln-data-store-frozen";
  function $e(T, x) {
    T.setAttribute(Ni, x);
  }
  function Mi(T) {
    const x = T[e];
    if (!x._windowIndex) return;
    const R = x._windowIndex.configure({ windowSize: x._windowSize });
    R.length && yt(x._name, R).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function Fi(T) {
    const x = T[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  H(t, e, D, "ln-data-store", {
    attributes: d
  }), window[e].clearAll = Oi, window[e].init = window[e], window[e].setStorageKey = Ze, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Ze);
})();
const to = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Dt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const d = String(e);
    return i === 0 ? d.replace(/\/+$/, "") : d.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function eo(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, to);
  if (e && typeof e == "object")
    for (const f in e)
      e[f] !== void 0 && e[f] !== null && e[f] !== "" && (i[f] = e[f]);
  const d = new URLSearchParams();
  return t.search && d.append(i.search, t.search), t.offset != null && d.append(i.offset, t.offset), t.limit != null && d.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (d.append(i.sortField, t.sort.field), d.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((f) => {
    const p = t.filters[f];
    Array.isArray(p) && p.length > 0 && d.append(f, p.join(","));
  }), d.toString();
}
function no(t, e, i) {
  let d = Dt(t, e);
  return i && (d += (d.indexOf("?") !== -1 ? "&" : "?") + i), d;
}
function pn(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function d(u) {
    const g = u[e];
    g && g.refreshConfig();
  }
  function f(u) {
    return u.getAttribute("data-ln-api-path") || u.getAttribute("data-ln-api-endpoint") || "";
  }
  const p = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: j, type: "string", fallback: "", effect: d, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: f, type: "string", fallback: "", effect: d, description: "Resource path appended to base URL" },
    "data-ln-api-endpoint": { read: f, type: "string", fallback: "", effect: d, description: "Alias for data-ln-api-path" },
    "data-ln-api-headers": { prop: "rawHeaders", read: j, type: "json", fallback: null, effect: d, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: d, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: d, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: d, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: d, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: d, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: d, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, l = X(p);
  function c(u) {
    return u.ok ? u.status === 204 ? null : u.json() : u.json().catch(() => null).then((g) => {
      const r = new Error("HTTP " + u.status + ": " + u.statusText);
      throw r.status = u.status, r.data = g, r;
    });
  }
  function s(u) {
    return this.dom = u, Y(this, u, l), u[e] = this, u[i] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, n(this), this;
  }
  s.prototype.refreshConfig = function() {
    const u = this.dom;
    this.credentials = "same-origin", this.headers = An(this.rawHeaders);
    const g = {}, r = u.getAttribute("data-ln-api-param-offset");
    r && (g.offset = r);
    const _ = u.getAttribute("data-ln-api-param-limit");
    _ && (g.limit = _);
    const v = u.getAttribute("data-ln-api-param-search");
    v && (g.search = v);
    const h = u.getAttribute("data-ln-api-param-sort-field");
    h && (g.sortField = h);
    const b = u.getAttribute("data-ln-api-param-sort-dir");
    b && (g.sortDir = b), this.paramKeys = g;
    const o = u.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = o !== null ? +o : 300, k(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, s.prototype._reqHeaders = function(u) {
    const g = Object.assign({}, this.headers);
    return !g.Accept && !g.accept && (g.Accept = "application/json"), !g["Content-Type"] && !g["content-type"] && (g["Content-Type"] = "application/json"), u && (g["X-Idempotency-Key"] = u), g;
  }, s.prototype.cancel = function(u) {
    return u && this._inflight.has(u) ? (this._inflight.get(u).abort(), this._inflight.delete(u), !0) : !1;
  }, s.prototype.fetchDelta = function(u, g) {
    const r = this;
    let _ = Dt(r.baseUrl, r.path);
    u != null && u !== "" && (_ += (_.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(u));
    const v = g || "sync";
    r._inflight.has(v) && r._inflight.get(v).abort();
    const h = new AbortController();
    return r._inflight.set(v, h), window.fetch(_, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: h.signal
    }).then(c).finally(function() {
      r._inflight.get(v) === h && r._inflight.delete(v);
    });
  }, s.prototype.query = function(u, g) {
    const r = this, _ = eo(u, r.paramKeys), v = no(r.baseUrl, r.path, _), h = g || "query";
    r._inflight.has(h) && r._inflight.get(h).abort();
    const b = new AbortController();
    return r._inflight.set(h, b), window.fetch(v, {
      method: "GET",
      headers: r._reqHeaders(),
      credentials: r.credentials,
      signal: b.signal
    }).then(c).finally(function() {
      r._inflight.get(h) === b && r._inflight.delete(h);
    });
  }, s.prototype.create = function(u, g, r) {
    const _ = this;
    return window.fetch(Dt(_.baseUrl, g || _.path), {
      method: "POST",
      headers: _._reqHeaders(r),
      credentials: _.credentials,
      body: JSON.stringify(u)
    }).then(c);
  }, s.prototype.update = function(u, g, r, _, v) {
    const h = this;
    r != null && (g = Object.assign({}, g, { expected_version: r }));
    const b = _ ? Dt(h.baseUrl, _) : Dt(h.baseUrl, h.path, u);
    return window.fetch(b, {
      method: "PUT",
      headers: h._reqHeaders(v),
      credentials: h.credentials,
      body: JSON.stringify(g)
    }).then(c);
  }, s.prototype.delete = function(u, g, r) {
    const _ = this;
    return window.fetch(Dt(_.baseUrl, g || _.path, u), {
      method: "DELETE",
      headers: _._reqHeaders(r),
      credentials: _.credentials
    }).then(c);
  }, s.prototype.bulkDelete = function(u, g, r) {
    const _ = this;
    return window.fetch(Dt(_.baseUrl, g || _.path, "bulk-delete"), {
      method: "DELETE",
      headers: _._reqHeaders(r),
      credentials: _.credentials,
      body: JSON.stringify({ ids: u })
    }).then(c);
  };
  function n(u) {
    u._handlers = {
      sync: function(g) {
        const r = g.detail || {}, _ = r.meta && r.meta.targetEl ? r.meta.targetEl : null;
        u.fetchDelta(r.since, _).then(function(v) {
          k(u.dom, "ln-api-connector:fetched", { data: v, since: r.since, meta: r.meta || null });
        }).catch(function(v) {
          v && v.name === "AbortError" || k(u.dom, "ln-api-connector:error", {
            action: "sync",
            error: v.message,
            status: v.status || 0,
            data: v.data || null,
            since: r.since,
            meta: r.meta || null
          });
        });
      },
      query: function(g) {
        const r = g.detail || {}, _ = r.query || r, v = r.meta && r.meta.targetEl ? r.meta.targetEl : null, h = v || "query", b = u.queryDebounce;
        function o(m, a, w) {
          u.query(a, w).then(function(E) {
            const A = E || {};
            k(u.dom, "ln-api-connector:fetched", {
              data: A.data || (Array.isArray(A) ? A : []),
              total: A.total,
              filtered: A.filtered,
              offset: a.offset,
              queryGen: a.queryGen,
              meta: m.meta || null
            });
          }).catch(function(E) {
            E && E.name === "AbortError" || k(u.dom, "ln-api-connector:error", {
              action: "query",
              error: E.message,
              status: E.status || 0,
              data: E.data || null,
              meta: m.meta || null
            });
          });
        }
        if (b === 0) {
          o(r, _, v);
          return;
        }
        u._queryTimers.has(h) && clearTimeout(u._queryTimers.get(h));
        const y = setTimeout(function() {
          u._queryTimers.delete(h), o(r, _, v);
        }, b);
        u._queryTimers.set(h, y);
      },
      cancel: function(g) {
        const r = g.detail || {}, _ = r.meta && r.meta.targetEl ? r.meta.targetEl : r.targetEl || r.key;
        _ && u.cancel(_);
      },
      create: function(g) {
        const r = g.detail || {};
        u.create(r.data, r.url, r.idempotencyKey).then(function(_) {
          const v = pn(_);
          k(u.dom, "ln-api-connector:created", {
            record: v.record,
            tempId: r.tempId,
            message: v.message,
            meta: r.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || k(u.dom, "ln-api-connector:error", {
            action: "create",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            tempId: r.tempId,
            meta: r.meta || null
          });
        });
      },
      update: function(g) {
        const r = g.detail || {};
        u.update(r.id, r.data, r.expected_version, r.url, r.idempotencyKey).then(function(_) {
          const v = pn(_);
          k(u.dom, "ln-api-connector:updated", {
            record: v.record,
            id: r.id,
            message: v.message,
            meta: r.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || k(u.dom, "ln-api-connector:error", {
            action: "update",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            id: r.id,
            conflictData: _.status === 409 ? _.data : null,
            meta: r.meta || null
          });
        });
      },
      delete: function(g) {
        const r = g.detail || {};
        u.delete(r.id, r.url, r.idempotencyKey).then(function(_) {
          const v = _ && _.message ? _.message : null;
          k(u.dom, "ln-api-connector:deleted", {
            response: _,
            id: r.id,
            message: v,
            meta: r.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || k(u.dom, "ln-api-connector:error", {
            action: "delete",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            id: r.id,
            meta: r.meta || null
          });
        });
      },
      bulkDelete: function(g) {
        const r = g.detail || {};
        u.bulkDelete(r.ids, r.url, r.idempotencyKey).then(function(_) {
          const v = _ && _.message ? _.message : null;
          k(u.dom, "ln-api-connector:bulk-deleted", {
            response: _,
            ids: r.ids,
            message: v,
            meta: r.meta || null
          });
        }).catch(function(_) {
          _ && _.name === "AbortError" || k(u.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: _.message,
            status: _.status || 0,
            data: _.data || null,
            ids: r.ids,
            meta: r.meta || null
          });
        });
      }
    }, u.dom.addEventListener("ln-api-connector:request-sync", u._handlers.sync), u.dom.addEventListener("ln-api-connector:request-query", u._handlers.query), u.dom.addEventListener("ln-api-connector:request-cancel", u._handlers.cancel), u.dom.addEventListener("ln-api-connector:request-create", u._handlers.create), u.dom.addEventListener("ln-api-connector:request-update", u._handlers.update), u.dom.addEventListener("ln-api-connector:request-delete", u._handlers.delete), u.dom.addEventListener("ln-api-connector:request-bulk-delete", u._handlers.bulkDelete);
  }
  s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const u = this;
    u._inflight && (u._inflight.forEach(function(g) {
      g.abort();
    }), u._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(g) {
      g && clearTimeout(g);
    }), this._queryTimers.clear()), this._handlers && (u.dom.removeEventListener("ln-api-connector:request-sync", u._handlers.sync), u.dom.removeEventListener("ln-api-connector:request-query", u._handlers.query), u.dom.removeEventListener("ln-api-connector:request-cancel", u._handlers.cancel), u.dom.removeEventListener("ln-api-connector:request-create", u._handlers.create), u.dom.removeEventListener("ln-api-connector:request-update", u._handlers.update), u.dom.removeEventListener("ln-api-connector:request-delete", u._handlers.delete), u.dom.removeEventListener("ln-api-connector:request-bulk-delete", u._handlers.bulkDelete), u._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, s, "ln-api-connector", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function d(v) {
    const h = v[e];
    h && h.refreshConfig();
  }
  const f = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: j, type: "string", fallback: "", effect: d, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: j, type: "string", fallback: "", effect: d, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: j, type: "string", fallback: "", effect: d, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: d, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, p = X(f);
  function l(v) {
    const h = v && v.content !== void 0 ? v.content : v, b = v && v.message ? v.message : null;
    return { content: h, message: b };
  }
  function c(v) {
    return this.dom = v, Y(this, v, p), v[e] = this, v[i] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, _(this), this;
  }
  c.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const h = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = An(h, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), h.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), k(v, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function s(v, h, b) {
    const o = Object.assign({}, Kt(v.headers, v.auth), b || {});
    return h && (o["Idempotency-Key"] = h), o;
  }
  c.prototype.fetchDelta = function(v) {
    const h = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const b = this._deltaController.signal, o = ["include_docs=true", "feed=normal"];
    v && o.push("since=" + encodeURIComponent(v));
    const y = Ct(h.url, h.db, "_changes") + "?" + o.join("&");
    return window.fetch(y, { method: "GET", headers: Kt(h.headers, h.auth), credentials: h.credentials, signal: b }).then((m) => {
      if (!m.ok) throw new Error("HTTP " + m.status + ": " + m.statusText);
      return m.json();
    }).then((m) => {
      const a = m.results || [];
      return {
        data: a.filter((w) => !w.deleted && w.doc).map((w) => Object.assign({}, w.doc, { id: w.doc._id })),
        deleted: a.filter((w) => w.deleted).map((w) => w.id),
        synced_at: m.last_seq || v || ""
      };
    }).finally(() => {
      h._deltaController && h._deltaController.signal === b && (h._deltaController = null);
    });
  };
  function n(v, h, b) {
    const o = Object.assign({ _id: h.id }, h);
    return o._id || delete o._id, window.fetch(Ct(v.url, v.db), {
      method: "POST",
      headers: s(v, b),
      credentials: v.credentials,
      body: JSON.stringify(o)
    }).then((y) => {
      if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
      return y.json();
    }).then((y) => {
      const m = l(y), a = m.content;
      return { record: Object.assign({}, o, { id: a.id, _id: a.id, _rev: a.rev }), message: m.message };
    });
  }
  c.prototype.create = function(v, h) {
    return n(this, v, h).then((b) => b.record);
  };
  function u(v, h, b, o) {
    const y = Object.assign({ id: String(h), _id: String(h) }, b), m = y._rev || y.rev;
    return (m ? Promise.resolve(m) : window.fetch(Ct(v.url, v.db, null, h), { method: "GET", headers: Kt(v.headers, v.auth), credentials: v.credentials }).then((w) => {
      if (!w.ok) throw new Error("Could not retrieve document for revision mapping");
      return w.json().then((E) => E._rev);
    })).then((w) => {
      const E = Object.assign({}, y, { _rev: w });
      delete E.rev;
      const A = s(v, o, { "If-Match": w });
      return window.fetch(Ct(v.url, v.db, null, h), {
        method: "PUT",
        headers: A,
        credentials: v.credentials,
        body: JSON.stringify(E)
      }).then((S) => {
        if (S.ok) return S.json().then((C) => {
          const L = l(C);
          return { record: Object.assign({}, E, { _rev: L.content.rev }), message: L.message };
        });
        if (S.status === 409) return S.json().then((C) => {
          const L = new Error("Conflict");
          throw L.status = 409, L.data = C, L;
        });
        throw new Error("HTTP " + S.status + ": " + S.statusText);
      });
    });
  }
  c.prototype.update = function(v, h, b) {
    return u(this, v, h, b).then((o) => o.record);
  };
  function g(v, h, b, o) {
    return (b ? Promise.resolve(b) : window.fetch(Ct(v.url, v.db, null, h), { method: "GET", headers: Kt(v.headers, v.auth), credentials: v.credentials }).then((m) => {
      if (!m.ok) throw new Error("Could not retrieve document for revision delete");
      return m.json().then((a) => a._rev);
    })).then((m) => {
      const a = Ct(v.url, v.db, null, h) + "?rev=" + encodeURIComponent(m);
      return window.fetch(a, { method: "DELETE", headers: s(v, o), credentials: v.credentials }).then((w) => {
        if (!w.ok) throw new Error("HTTP " + w.status + ": " + w.statusText);
        return w.json();
      }).then((w) => {
        const E = l(w);
        return { response: E.content, message: E.message };
      });
    });
  }
  c.prototype.delete = function(v, h, b) {
    return g(this, v, h, b).then((o) => o.response);
  };
  function r(v, h, b) {
    return !h || h.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Ct(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Kt(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: h })
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => {
      const m = (o.rows || []).filter((a) => !a.error && a.value && a.value.rev).map((a) => ({ _id: a.id, _rev: a.value.rev, _deleted: !0 }));
      return m.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Ct(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: s(v, b),
        credentials: v.credentials,
        body: JSON.stringify({ docs: m })
      }).then((a) => {
        if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
        return a.json();
      }).then((a) => {
        const w = l(a);
        return { response: { ok: !0, results: w.content, deletedCount: m.length }, message: w.message };
      });
    });
  }
  c.prototype.bulkDelete = function(v, h) {
    return r(this, v, h).then((b) => b.response);
  };
  function _(v) {
    v._handlers = {
      sync: function(h) {
        const b = h.detail || {};
        v.fetchDelta(b.since).then(function(o) {
          k(v.dom, "ln-couchdb-connector:fetched", { data: o, since: b.since, meta: b.meta || null });
        }).catch(function(o) {
          o && o.name === "AbortError" || k(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: o.message,
            status: o.status || 0,
            since: b.since,
            meta: b.meta || null
          });
        });
      },
      create: function(h) {
        const b = h.detail || {};
        n(v, b.data, b.idempotencyKey).then(function(o) {
          k(v.dom, "ln-couchdb-connector:created", { record: o.record, tempId: b.tempId, message: o.message, meta: b.meta || null });
        }).catch(function(o) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: o.message,
            status: o.status || 0,
            tempId: b.tempId,
            meta: b.meta || null
          });
        });
      },
      update: function(h) {
        const b = h.detail || {}, o = Object.assign({}, b.data);
        b.expected_version !== void 0 && (o._rev = b.expected_version), u(v, b.id, o, b.idempotencyKey).then(function(y) {
          k(v.dom, "ln-couchdb-connector:updated", { record: y.record, id: b.id, message: y.message, meta: b.meta || null });
        }).catch(function(y) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: y.message,
            status: y.status || 0,
            id: b.id,
            data: y.status === 409 ? y.data : null,
            conflictData: y.status === 409 ? y.data : null,
            meta: b.meta || null
          });
        });
      },
      delete: function(h) {
        const b = h.detail || {};
        g(v, b.id, b.rev, b.idempotencyKey).then(function(o) {
          k(v.dom, "ln-couchdb-connector:deleted", { response: o.response, id: b.id, message: o.message, meta: b.meta || null });
        }).catch(function(o) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: o.message,
            status: o.status || 0,
            id: b.id,
            meta: b.meta || null
          });
        });
      },
      bulkDelete: function(h) {
        const b = h.detail || {};
        r(v, b.ids, b.idempotencyKey).then(function(o) {
          k(v.dom, "ln-couchdb-connector:bulk-deleted", { response: o.response, ids: b.ids, message: o.message, meta: b.meta || null });
        }).catch(function(o) {
          k(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            ids: b.ids,
            meta: b.meta || null
          });
        });
      }
    }, v.dom.addEventListener("ln-couchdb-connector:request-sync", v._handlers.sync), v.dom.addEventListener("ln-couchdb-connector:request-create", v._handlers.create), v.dom.addEventListener("ln-couchdb-connector:request-update", v._handlers.update), v.dom.addEventListener("ln-couchdb-connector:request-delete", v._handlers.delete), v.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", v._handlers.bulkDelete);
  }
  c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const v = this;
    v._deltaController && (v._deltaController.abort(), v._deltaController = null), v._handlers && (v.dom.removeEventListener("ln-couchdb-connector:request-sync", v._handlers.sync), v.dom.removeEventListener("ln-couchdb-connector:request-create", v._handlers.create), v.dom.removeEventListener("ln-couchdb-connector:request-update", v._handlers.update), v.dom.removeEventListener("ln-couchdb-connector:request-delete", v._handlers.delete), v.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", v._handlers.bulkDelete), v._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, c, "ln-couchdb-connector", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  const d = 1e3, f = 3e4;
  function p(r) {
    const _ = r[e];
    _ && (_.command === "connect" ? _._open() : _._disconnect());
  }
  function l(r) {
    const _ = r[e];
    !_ || _.command !== "connect" || (_._drop("url-changed"), _._open());
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
  function u(r, _) {
    return r === "sync" ? { since: _.since } : r === "query" ? { query: _.query || {} } : r === "create" ? { data: _.data, idempotencyKey: _.idempotencyKey } : r === "update" ? { id: _.id, data: _.data, expected_version: _.expected_version, idempotencyKey: _.idempotencyKey } : r === "delete" ? { id: _.id, idempotencyKey: _.idempotencyKey } : { ids: _.ids, idempotencyKey: _.idempotencyKey };
  }
  function g(r) {
    this.dom = r, Y(this, r, s), r[e] = this, r[i] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const _ = this;
    this._onRequest = function(v) {
      _._request(n[v.type], v.detail || {});
    };
    for (const v in n) r.addEventListener(v, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  g.prototype._open = function() {
    if (this._socket || this._timer) return;
    const r = this, _ = this.url;
    this._attempt++, this._status = "connecting", k(this.dom, "ln-websocket-connector:connecting", { url: _, attempt: this._attempt });
    let v;
    try {
      v = new WebSocket(_);
    } catch (h) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, h.message), this._held = [], k(this.dom, "ln-websocket-connector:disconnected", { url: _, code: 0, reason: h.message, willReconnect: !1 });
      return;
    }
    this._socket = v, v.onopen = function() {
      r._status = "connected", r._attempt = 0, k(r.dom, "ln-websocket-connector:connected", { url: _ });
      const h = r._held;
      r._held = [];
      for (let b = 0; b < h.length; b++) r._send(h[b]);
    }, v.onmessage = function(h) {
      r._receive(h.data);
    }, v.onclose = function(h) {
      r._socket = null, r._status = "disconnected", r._failPending("connection closed");
      const b = r.command === "connect";
      k(r.dom, "ln-websocket-connector:disconnected", { url: _, code: h.code, reason: h.reason, willReconnect: b }), b && r._scheduleReconnect();
    };
  }, g.prototype._scheduleReconnect = function() {
    const r = this, _ = Math.min(d * Math.pow(2, Math.max(0, this._attempt - 1)), f);
    this._timer = setTimeout(function() {
      r._timer = null, r._open();
    }, _);
  }, g.prototype._drop = function(r) {
    const _ = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, r), this._socket = null), _ && (this._status = "disconnected", this._failPending("connection closed"), k(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: r, willReconnect: !1 }));
  }, g.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, g.prototype._request = function(r, _) {
    const v = { ref: String(++this._seq), type: r, detail: _ };
    this._status === "connected" ? this._send(v) : this.command === "connect" ? this._held.push(v) : this._fail(v, 0, "disconnected", null);
  }, g.prototype._send = function(r) {
    this._pending.set(r.ref, r), this._socket.send(JSON.stringify(Object.assign({ ref: r.ref, type: r.type }, u(r.type, r.detail))));
  }, g.prototype._receive = function(r) {
    let _;
    try {
      _ = JSON.parse(r);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", r);
      return;
    }
    if (_.ref !== void 0) {
      const v = this._pending.get(String(_.ref));
      if (!v) return;
      this._pending.delete(v.ref), _.ok ? this._resolve(v, _.content, _.message || null) : this._fail(v, _.status || 0, _.error, _.data);
      return;
    }
    _.type === "changes" && k(this.dom, "ln-websocket-connector:fetched", {
      data: { data: _.data || [], deleted: _.deleted || [], synced_at: _.synced_at },
      since: null,
      meta: null
    });
  }, g.prototype._resolve = function(r, _, v) {
    const h = r.detail, b = h.meta || null, o = this.dom;
    if (r.type === "sync")
      k(o, "ln-websocket-connector:fetched", { data: _, since: h.since, meta: b });
    else if (r.type === "query") {
      const y = h.query || {}, m = _ || {};
      k(o, "ln-websocket-connector:fetched", {
        data: m.data || [],
        total: m.total,
        filtered: m.filtered,
        offset: y.offset,
        queryGen: y.queryGen,
        meta: b
      });
    } else r.type === "create" ? k(o, "ln-websocket-connector:created", { record: _, tempId: h.tempId, message: v, meta: b }) : r.type === "update" ? k(o, "ln-websocket-connector:updated", { record: _, id: h.id, message: v, meta: b }) : r.type === "delete" ? k(o, "ln-websocket-connector:deleted", { response: _, id: h.id, message: v, meta: b }) : k(o, "ln-websocket-connector:bulk-deleted", { response: _, ids: h.ids, message: v, meta: b });
  }, g.prototype._fail = function(r, _, v, h) {
    const b = r.detail;
    k(this.dom, "ln-websocket-connector:error", {
      action: r.type,
      error: v,
      status: _,
      data: h || null,
      conflictData: _ === 409 && h || null,
      since: b.since,
      id: b.id,
      ids: b.ids,
      tempId: b.tempId,
      meta: b.meta || null
    });
  }, g.prototype._failAll = function(r, _) {
    for (let v = 0; v < r.length; v++) this._fail(r[v], 0, _, null);
  }, g.prototype._failPending = function(r) {
    const _ = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(_, r);
  }, g.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const r in n) this.dom.removeEventListener(r, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[i];
    }
  }, H(t, e, g, "ln-websocket-connector", {
    attributes: c
  });
})();
function io(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function ro(t, e) {
  const i = !t || !!t.initializationError, d = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || d) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function mn(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class oo {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((i, d) => {
      this._pending.set(e, { resolve: i, reject: d });
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
    for (const d of this._pending.values()) d.reject(i);
    this._pending.clear();
  }
  _settle(e, i) {
    const d = e && e.requestId;
    if (!d) return !1;
    const f = this._pending.get(d);
    return f ? (this._pending.delete(d), i ? f.reject(e.error || new Error("Store mutation failed")) : f.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  const d = "data-ln-data-coordinator-search", f = "data-ln-data-coordinator-filters", p = "data-ln-data-coordinator-sort-field", l = "data-ln-data-coordinator-sort-direction", s = X({
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
  function u(h) {
    const b = h.getAttribute("data-ln-data-coordinator-connector");
    if (b) return h.querySelector(b) || document.querySelector(b) || document.getElementById(b);
    const o = h.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (o) return o;
    for (const y of h.querySelectorAll("*")) {
      if (y.lnConnector) return y;
      for (const m of y.attributes) if (m.name.startsWith("data-ln-") && m.name.endsWith("-connector")) return y;
    }
    return null;
  }
  function g(h) {
    var o;
    if (!h) return "ln-connector";
    if ((o = h.lnConnector) != null && o.namespace) return h.lnConnector.namespace;
    const b = h.getAttribute("data-ln-connector");
    if (b && b !== "true") return b.startsWith("ln-") ? b : "ln-" + b + (b.endsWith("-connector") ? "" : "-connector");
    for (const y of h.attributes) if (y.name.startsWith("data-ln-") && y.name.endsWith("-connector")) return y.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function r(h) {
    const b = this;
    return this.dom = h, Y(this, h, s), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", h), h[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new oo(), this._queueQueryRefresh = Ht(() => {
      b._destroyed || b._refreshAll(null, !0);
    }), this.refreshMapper(), _(this), this._checkInitialSync(), this;
  }
  r.prototype._noAutosync = function(h) {
    var b;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((b = h.storeEl) != null && b.hasAttribute("data-ln-data-store-no-autosync"));
  }, r.prototype._isStale = function(h) {
    var o, y;
    const b = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((o = h.storeEl) == null ? void 0 : o.getAttribute("data-ln-data-store-stale"));
    return b === "never" || b === "-1" ? !1 : !((y = h.store) != null && y.lastSyncedAt) || Date.now() / 1e3 - h.store.lastSyncedAt > (parseInt(b, 10) || 300);
  }, r.prototype._checkInitialSync = function() {
    const h = this, b = this.findChildren();
    b.store && Promise.resolve(b.store.ready).then(() => {
      if (h._destroyed) return;
      const o = h.findChildren();
      o.store && o.connector && !h._noAutosync(o) && !o.store.isSyncing && (!o.store.hasCache || h._isStale(o)) && o.store.forceSync();
    }).catch((o) => h._reportError("store-initialize", o, null));
  }, r.prototype.refreshMapper = function() {
    var o, y;
    const h = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, b = h && ((y = (o = window.lnCore) == null ? void 0 : o.getDataMapper) == null ? void 0 : y.call(o, h)) || null;
    this.mapper = { ingress: (b == null ? void 0 : b.ingress) || ((m) => m), egress: (b == null ? void 0 : b.egress) || ((m) => m) };
  }, r.prototype.findChildren = function() {
    const h = this.dom.querySelector("[data-ln-data-store]"), b = u(this.dom), o = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: h, connectorEl: b, queueEl: o, store: (h == null ? void 0 : h.lnDataStore) || null, connector: (b == null ? void 0 : b.lnConnector) || (b == null ? void 0 : b.lnApiConnector) || (b == null ? void 0 : b.lnCouchDbConnector) || (b == null ? void 0 : b.lnWebsocketConnector) || null, queue: (o == null ? void 0 : o.lnApiQueue) || null };
  }, r.prototype._fanOutRemote = function(h, b, o, y) {
    this.refreshMapper(), h.queue ? k(h.queueEl, "ln-api-queue:request-enqueue", o) : h.connector && k(h.connectorEl, g(h.connectorEl) + ":request-" + b, y);
  }, r.prototype._fanOutCreate = function(h, b, o) {
    const y = "_temp_" + wt(), m = this.mapper.egress(b);
    h.storeEl && k(h.storeEl, "ln-data-store:request-create", { tempId: y, data: m }), this._fanOutRemote(h, "create", { chainKey: y, op: "create", targetId: null, payload: m, expectedVersion: null, meta: { tempId: y, action: o } }, { data: m, url: o, meta: { entryId: wt(), queued: !1, op: "create", tempId: y } });
  }, r.prototype._fanOutUpdate = function(h, b, o, y, m) {
    const a = this.mapper.egress(o);
    h.storeEl && k(h.storeEl, "ln-data-store:request-update", { id: b, data: a }), this._fanOutRemote(h, "update", { chainKey: b, op: "update", targetId: b, payload: a, expectedVersion: y, meta: { id: b, action: m } }, { id: b, data: a, expected_version: y, url: m, meta: { entryId: wt(), queued: !1, op: "update", id: b } });
  }, r.prototype._fanOutDelete = function(h, b) {
    h.storeEl && k(h.storeEl, "ln-data-store:request-delete", { id: b }), this._fanOutRemote(h, "delete", { chainKey: b, op: "delete", targetId: b, payload: null, expectedVersion: null, meta: { id: b } }, { id: b, meta: { entryId: wt(), queued: !1, op: "delete", id: b } });
  }, r.prototype._fanOutBulkDelete = function(h, b) {
    const o = b.join(",");
    h.storeEl && k(h.storeEl, "ln-data-store:request-bulk-delete", { ids: b }), this._fanOutRemote(h, "bulk-delete", { chainKey: o, op: "bulk-delete", targetId: null, payload: { ids: b }, expectedVersion: null, meta: { bulkKey: o, ids: b } }, { ids: b, meta: { entryId: wt(), queued: !1, op: "bulk-delete", bulkKey: o } });
  }, r.prototype._requestStoreMutation = function(h, b, o) {
    if (!h.storeEl) return Promise.reject(new Error("Store element not found"));
    const y = wt(), m = this._mutationReceipts.wait(y);
    return k(h.storeEl, "ln-data-store:request-" + b, Object.assign({}, o, { requestId: y })), m;
  }, r.prototype._reportError = function(h, b, o) {
    this._destroyed || k(this.dom, "ln-data-coordinator:error", { operation: h, error: b, meta: o || null });
  }, r.prototype._owns = function(h) {
    var o;
    const b = this._name || ((o = this.findChildren().storeEl) == null ? void 0 : o.id);
    return !!h && h === b;
  }, r.prototype._currentQuery = function() {
    const h = this.dom.getAttribute(p), b = this.dom.getAttribute(l), o = new URLSearchParams(this.dom.getAttribute(f) || ""), y = {};
    for (const m of new Set(o.keys())) y[m] = o.getAll(m);
    return { search: this.dom.getAttribute(d) || "", filters: y, sort: h && b ? { field: h, direction: b } : null };
  }, r.prototype._refreshAll = function(h, b) {
    for (const [o, y, m] of n)
      for (const a of this.dom.ownerDocument.querySelectorAll(o))
        if (this._owns(a.getAttribute(y))) {
          if ((m === "table" || m === "list") && a.hasAttribute(m === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            k(a, "ln-" + m + (b ? ":request-invalidate" : ":request-revalidate"), { query: this._currentQuery() });
            continue;
          }
          this._serveElement(a, m, null, h);
        }
  }, r.prototype._serveElement = function(h, b, o, y) {
    const m = this.findChildren(), a = m.store;
    if (!a) return;
    o && this._boundQueries.set(h, o);
    const w = this._boundQueries.get(h) || { sort: null, filters: {}, search: "" }, E = mn(w, this._currentQuery()), A = this;
    return Promise.resolve(a.ready).then(() => {
      if (A._destroyed) return;
      const S = ro(a, m.connector);
      if (b === "table" || b === "list" || b === "chart")
        return S === "remote" ? (k(h, "ln-" + b + ":set-loading", { loading: !0 }), k(m.connectorEl, g(m.connectorEl) + ":request-query", { query: E, meta: { targetEl: h, kind: b, offset: E.offset, limit: E.limit, queryGen: w.queryGen } })) : S !== "store" ? k(h, "ln-" + b + ":set-loading", { loading: !1 }) : a.getAll(E).then((C) => {
          A._destroyed || !A._boundDelivered || (k(h, "ln-" + b + ":set-loading", { loading: !1 }), k(h, "ln-" + b + ":set-data", { data: C.data, total: (y == null ? void 0 : y.total) ?? C.total, filtered: (y == null ? void 0 : y.filtered) ?? C.filtered, offset: C.offset ?? (y == null ? void 0 : y.offset) ?? w.offset, queryGen: w.queryGen !== void 0 ? w.queryGen : (y == null ? void 0 : y.queryGen) ?? C.queryGen, provisional: C.provisional === !0 }), A._boundDelivered.set(h, !0));
        });
      if (b === "options") {
        if (S === "remote") return k(m.connectorEl, g(m.connectorEl) + ":request-query", { query: {}, meta: { targetEl: h, kind: b } });
        if (S === "store") return a.getAll({}).then((C) => !A._destroyed && k(h, "ln-options:set-data", { data: C.data }));
      }
      if (b === "stat") {
        let C = o == null ? void 0 : o.filters;
        if (!C) {
          const I = h.getAttribute("data-ln-stat-filter");
          if (I != null && I.includes(":")) {
            const q = I.split(":");
            C = { [q[0].trim()]: [q.slice(1).join(":").trim()] };
          }
        }
        const L = m.connector && a && (a.windowed && C && Object.keys(C).length || a.noLocalQuery) ? "remote" : S;
        if (L === "remote") return k(m.connectorEl, g(m.connectorEl) + ":request-query", { query: { filters: C }, meta: { targetEl: h, kind: b } });
        if (L === "store") return a.count(C).then((I) => !A._destroyed && k(h, "ln-stat:set-count", { count: I }));
      }
    }).catch((S) => {
      A._destroyed || ((b === "table" || b === "list" || b === "chart") && k(h, "ln-" + b + ":set-loading", { loading: !1 }), A._reportError(b + "-query", S, { targetEl: h, kind: b }));
    });
  };
  function _(h) {
    const b = h._unsubs = [], o = (A, S, C) => {
      A.addEventListener(S, C), b.push(() => A.removeEventListener(S, C));
    };
    o(h.dom, "ln-data-store:request-remote-sync", (A) => {
      h.refreshMapper();
      const S = h.findChildren();
      S.store && S.connector && k(S.connectorEl, g(S.connectorEl) + ":request-sync", { since: A.detail.since, meta: { op: "sync" } });
    }), o(h.dom, "ln-data-store:request-page", (A) => {
      const S = h.findChildren(), C = A.detail || {};
      if (!S.connectorEl) return;
      const L = mn(C.query || {}, h._currentQuery());
      k(S.connectorEl, g(S.connectorEl) + ":request-query", {
        query: Object.assign({}, L, { offset: C.offset, limit: C.limit, queryGen: C.queryGen })
      });
    }), o(h.dom, "ln-data-coordinator:request-create", (A) => h._fanOutCreate(h.findChildren(), A.detail.data || {}, A.detail.action)), o(h.dom, "ln-data-coordinator:request-update", (A) => h._fanOutUpdate(h.findChildren(), A.detail.id, A.detail.data || {}, A.detail.expected_version, A.detail.action)), o(h.dom, "ln-data-coordinator:request-delete", (A) => h._fanOutDelete(h.findChildren(), A.detail.id)), o(h.dom, "ln-data-coordinator:request-bulk-delete", (A) => h._fanOutBulkDelete(h.findChildren(), A.detail.ids || [])), o(h.dom, "ln-api-queue:send", (A) => h._onQueueSend(A.detail || {})), o(h.dom, "ln-api-queue:failed", (A) => {
      var S;
      return h._reportError("queue-failed", ((S = A == null ? void 0 : A.detail) == null ? void 0 : S.error) || new Error("Queue failed"), (A == null ? void 0 : A.detail) || null);
    }), o(h.dom, "ln-data-store:initialized", (A) => {
      var C;
      const S = h.findChildren();
      S.store && !S.store.initializationError && S.connector && !h._noAutosync(S) && !S.store.isSyncing && (!((C = A.detail) != null && C.hasCache) || h._isStale(S)) && S.store.forceSync();
    });
    const y = () => {
      const A = h.findChildren();
      A.store && !A.store.initializationError && A.connector && !h._noAutosync(A) && A.store.isInitialized && !A.store.isSyncing && A.store.forceSync();
    };
    o(h.dom, "ln-websocket-connector:connected", y), o(document, "submit", (A) => h._onFormSubmit(A));
    const m = (A, S, C) => {
      var L;
      h._owns(A.target.getAttribute(C)) && h._serveElement(A.target, S, S === "stat" ? { filters: ((L = A.detail) == null ? void 0 : L.filters) || null } : S === "options" ? null : io(A.detail || {}), null);
    };
    o(document, "ln-table:request-data", (A) => m(A, "table", "data-ln-table-source")), o(document, "ln-list:request-data", (A) => m(A, "list", "data-ln-list-source")), o(document, "ln-chart:request-data", (A) => m(A, "chart", "data-ln-chart-source")), o(document, "ln-options:request-data", (A) => m(A, "options", "data-ln-options")), o(document, "ln-stat:request-count", (A) => m(A, "stat", "data-ln-stat"));
    const a = (A) => {
      h._mutationReceipts.resolve(A.detail), h._refreshAll(null, !1);
    };
    o(h.dom, "ln-data-store:ready", a), o(h.dom, "ln-data-store:created", a), o(h.dom, "ln-data-store:updated", a), o(h.dom, "ln-data-store:deleted", a), o(h.dom, "ln-data-store:mutation-error", (A) => h._mutationReceipts.reject(A.detail)), o(h.dom, "ln-data-store:synced", (A) => {
      var S;
      (S = A.detail) != null && S.changed && h._refreshAll(A.detail.meta, !1);
    }), o(h.dom, "ln-data-store:query-changed", () => h._refreshAll(null, !0)), o(h.dom, "ln-search:change", (A) => {
      var C;
      A.preventDefault();
      const S = ((C = A.detail) == null ? void 0 : C.term) != null ? A.detail.term : "";
      S !== (h.dom.getAttribute(d) || "") && h.dom.setAttribute(d, S);
    }), o(h.dom, "ln-filter:change", (A) => {
      var O;
      A.preventDefault();
      const S = (O = A.detail) == null ? void 0 : O.key;
      if (!S) return;
      const C = (A.detail.values || []).slice(), L = h._currentQuery().filters, I = L[S];
      if (I ? I.length === C.length && I.every((F, U) => F === C[U]) : !C.length) return;
      C.length ? L[S] = C : delete L[S];
      const q = new URLSearchParams();
      Object.keys(L).forEach((F) => L[F].forEach((U) => q.append(F, U)));
      const D = q.toString();
      D ? h.dom.setAttribute(f, D) : h.dom.removeAttribute(f);
    }), o(h.dom, "ln-sort:change", (A) => {
      var q, D;
      A.preventDefault();
      const S = (q = A.detail) == null ? void 0 : q.field, C = (D = A.detail) == null ? void 0 : D.direction, L = S && C && C !== "none" ? { field: S, direction: C } : null, I = h._currentQuery().sort;
      !I && !L || I && L && I.field === L.field && I.direction === L.direction || (L ? (h.dom.setAttribute(p, L.field), h.dom.setAttribute(l, L.direction)) : (h.dom.removeAttribute(p), h.dom.removeAttribute(l)));
    });
    const w = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), E = h.findChildren().connectorEl;
    if (E) {
      const A = g(E);
      w.add(A), o(h.dom, A + ":connected", y);
    }
    w.forEach((A) => {
      o(h.dom, A + ":fetched", (S) => h._reconcileServerFetch(S.detail)), o(h.dom, A + ":created", (S) => h._reconcileServerMutation("create", S.detail)), o(h.dom, A + ":updated", (S) => h._reconcileServerMutation("update", S.detail)), o(h.dom, A + ":deleted", (S) => h._reconcileServerMutation("ack", S.detail)), o(h.dom, A + ":bulk-deleted", (S) => h._reconcileServerMutation("ack", S.detail)), o(h.dom, A + ":error", (S) => h._reconcileServerMutation("error", S.detail));
    });
  }
  r.prototype._onQueueSend = function(h) {
    this.refreshMapper();
    const b = this.findChildren();
    if (!b.store || !b.connector || !b.queue) return;
    const o = h.meta || {}, y = g(b.connectorEl), m = h.idempotencyKey || h.entryId, a = {
      create: () => k(b.connectorEl, y + ":request-create", { data: h.payload, url: o.action || null, idempotencyKey: m, meta: { entryId: h.entryId, queued: !0, op: "create", tempId: o.tempId } }),
      update: () => k(b.connectorEl, y + ":request-update", { id: h.targetId, data: h.payload, expected_version: h.expectedVersion, url: o.action || null, idempotencyKey: m, meta: { entryId: h.entryId, queued: !0, op: "update", id: h.targetId } }),
      delete: () => k(b.connectorEl, y + ":request-delete", { id: h.targetId, idempotencyKey: m, meta: { entryId: h.entryId, queued: !0, op: "delete", id: h.targetId } }),
      "bulk-delete": () => {
        var w;
        return k(b.connectorEl, y + ":request-bulk-delete", { ids: ((w = h.payload) == null ? void 0 : w.ids) || [], idempotencyKey: m, meta: { entryId: h.entryId, queued: !0, op: "bulk-delete", bulkKey: o.bulkKey } });
      }
    };
    a[h.op] && a[h.op]();
  }, r.prototype._onFormSubmit = function(h) {
    const b = h.target;
    if (h.defaultPrevented) return;
    const o = b.hasAttribute(i) ? b.getAttribute(i) : null;
    if (o === null || (o ? !this._owns(o) : b.closest("[" + t + "]") !== this.dom)) return;
    const y = En(b);
    if (y !== "POST" && y !== "PUT" && y !== "PATCH") return;
    h.preventDefault();
    const m = Oe(b);
    delete m._method, delete m._token;
    const a = m.id, w = m.expected_version, E = b.getAttribute("action") || "", A = this.findChildren();
    delete m.id, delete m.expected_version, y === "POST" ? this._fanOutCreate(A, m, E) : this._fanOutUpdate(A, a, m, w, E);
  }, r.prototype._reconcileServerFetch = function(h) {
    if (!h) return;
    const b = h.meta || {}, o = this.findChildren(), y = h.data;
    this.refreshMapper();
    const m = Array.isArray(y) ? y : (y == null ? void 0 : y.data) || [], a = Array.isArray(y == null ? void 0 : y.deleted) ? y.deleted : [], w = Array.isArray(y) ? Math.floor(Date.now() / 1e3) : (y == null ? void 0 : y.synced_at) ?? (y == null ? void 0 : y.since) ?? Math.floor(Date.now() / 1e3), E = m.map((A) => this.mapper.ingress(A));
    if (!(!o.store || o.store.initializationError)) {
      if (!b.kind) return o.store.applySync(E, a, w, { total: h.total, filtered: h.filtered, offset: h.offset, queryGen: h.queryGen, targetEl: b.targetEl });
      o.store.applyQuery(E, { total: h.total }).then((A) => {
        const S = b.kind;
        S === "table" || S === "list" || S === "chart" ? (k(b.targetEl, "ln-" + S + ":set-loading", { loading: !1 }), k(b.targetEl, "ln-" + S + ":set-data", { data: A, total: h.total ?? A.length, filtered: h.filtered ?? A.length, offset: h.offset, queryGen: b.queryGen }), this._boundDelivered.set(b.targetEl, !0)) : S === "options" ? o.store.getAll({}).then((C) => k(b.targetEl, "ln-options:set-data", { data: C.data })) : S === "stat" && k(b.targetEl, "ln-stat:set-count", { count: h.filtered ?? h.total ?? E.length });
      });
    }
  }, r.prototype._reconcileServerMutation = function(h, b) {
    var m;
    if (!b) return;
    const o = this.findChildren(), y = b.meta || {};
    if (h === "create") {
      if (!b.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), y);
      const a = this.mapper.ingress(b.record);
      (o.storeEl ? this._requestStoreMutation(o, "update", { id: y.tempId, data: a }) : Promise.resolve()).then(() => {
        y.queued && o.queue && k(o.queueEl, "ln-api-queue:resolve-create", { entryId: y.entryId, oldKey: y.tempId, newId: a.id });
      }).catch((w) => this._reportError("create-reconcile", w, y));
    } else if (h === "update") {
      const a = b.record ? this.mapper.ingress(b.record) : null;
      (o.storeEl && a ? this._requestStoreMutation(o, "update", { id: y.id, data: a }) : Promise.resolve()).then(() => {
        y.queued && o.queue && k(o.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
      }).catch((w) => this._reportError("update-reconcile", w, y));
    } else if (h === "ack")
      y.queued && o.queue && k(o.queueEl, "ln-api-queue:ack", { entryId: y.entryId });
    else if (h === "error") {
      const a = b.status || ((m = b.error) == null ? void 0 : m.status) || 0;
      y.queued && o.queue && k(o.queueEl, "ln-api-queue:nack", { entryId: y.entryId, reason: a === 401 || a === 419 ? "auth" : a === 0 || a >= 500 ? "retry" : "drop" }), o.storeEl && k(o.storeEl, "ln-data-store:request-sync-failed", { error: b.error || b, status: a }), this._reportError("connector-error", b.error || b, y);
    }
  }, r.prototype.destroy = function() {
    var h;
    if (this.dom[e]) {
      for (this._destroyed = !0; (h = this._unsubs) != null && h.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function v(h, b) {
    const o = h[e];
    o && (b === "data-ln-data-coordinator-mapper" ? o.refreshMapper() : (b === d || b === f || b === p || b === l) && o._queueQueryRefresh());
  }
  H(t, e, r, "ln-data-coordinator", {
    extraAttributes: ["data-ln-data-coordinator-mapper", d, f, p, l],
    onAttributeChange: v
  }), window[e].init = window[e];
})();
const so = "ln_api_queue", ao = 2, Z = "outbox", ot = "_queue_meta";
function lt(t, e) {
  return t.error || new Error(e);
}
function Bt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function gn(t) {
  return "seq:" + t;
}
function re(t) {
  return "paused:" + t;
}
function _n(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function lo(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function co(t, e, i, d) {
  const f = /* @__PURE__ */ new Map(), p = [], l = [];
  for (const c of t || [])
    f.has(c.chainKey) || f.set(c.chainKey, []), f.get(c.chainKey).push(c);
  return f.forEach((c, s) => {
    c.sort((u, g) => u.seq - g.seq);
    const n = c[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > d) {
        l.push({ chainKey: s, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > d) {
        l.push({ chainKey: s, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = d + i, n.updatedAt = d, p.push(n);
    }
  }), { entries: p, wakeups: l };
}
function uo(t, e, i, d, f) {
  const p = [], l = [];
  for (const c of t || []) {
    if (c.entryId === e) {
      l.push(c.entryId);
      continue;
    }
    c.chainKey === i && (c.chainKey = d, c.targetId === i && (c.targetId = d), c.meta && c.meta.id === i && (c.meta.id = d), c.meta && typeof c.meta.action == "string" && (c.meta.action = lo(c.meta.action, i, d)), c.updatedAt = f, p.push(c));
  }
  return { changed: p, deleted: l };
}
class fo {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || so, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const d = this.indexedDB.open(this.dbName, ao);
      d.onupgradeneeded = (f) => {
        const p = f.target.result;
        let l;
        p.objectStoreNames.contains(Z) ? l = f.target.transaction.objectStore(Z) : l = p.createObjectStore(Z, { keyPath: "entryId" }), l.indexNames.contains("by_scope_chain") || l.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), l.indexNames.contains("by_scope_seq") || l.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(ot) || p.createObjectStore(ot, { keyPath: "key" });
      }, d.onerror = () => i(lt(d, "Queue database open failed")), d.onsuccess = (f) => {
        this._db = f.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const d = this.indexedDB.deleteDatabase(this.dbName);
      d.onsuccess = () => e(), d.onerror = () => i(lt(d, "Queue database delete failed")), d.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((d, f) => {
      const l = i.transaction(Z, "readonly").objectStore(Z).index("by_scope_seq").getAll(Bt(this.keyRange, e));
      l.onsuccess = () => d(l.result || []), l.onerror = () => f(lt(l, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((d) => d ? new Promise((f, p) => {
      const l = d.transaction([ot, Z], "readwrite"), c = l.objectStore(ot), s = l.objectStore(Z), n = gn(e);
      let u = null;
      const g = (_) => {
        const v = _ + 1;
        u = {
          entryId: this.uuid(),
          scope: e,
          chainKey: i.chainKey,
          seq: v,
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
        }, c.put({ key: n, value: v }), s.put(u);
      }, r = c.get(n);
      r.onerror = () => p(lt(r, "Queue sequence read failed")), r.onsuccess = () => {
        const _ = r.result;
        if (_ && typeof _.value == "number") {
          g(_.value);
          return;
        }
        const v = s.index("by_scope_seq").getAll(Bt(this.keyRange, e));
        v.onerror = () => p(lt(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const h = (v.result || []).reduce((b, o) => Math.max(b, o.seq || 0), 0);
          g(h);
        };
      }, l.oncomplete = () => f(u), l.onerror = () => p(l.error || new Error("Queue enqueue transaction failed")), l.onabort = () => p(l.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, d) {
    return this.open().then((f) => f ? new Promise((p, l) => {
      const c = f.transaction(Z, "readwrite"), s = c.objectStore(Z), n = s.index("by_scope_seq").getAll(Bt(this.keyRange, e)), u = this.now();
      let g = { entries: [], wakeups: [] };
      n.onerror = () => l(lt(n, "Queue claim read failed")), n.onsuccess = () => {
        g = co(n.result || [], i, d, u);
        for (const r of g.entries) s.put(r);
      }, c.oncomplete = () => p(g), c.onerror = () => l(c.error || new Error("Queue claim transaction failed")), c.onabort = () => l(c.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (d, f) => (f.delete(d.entryId), { status: "acked", entry: d }));
  }
  nack(e, i, d, f) {
    f = f || {};
    const p = f.maxAttempts || 8, l = f.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((c) => c ? new Promise((s, n) => {
      const u = c.transaction([Z, ot], "readwrite"), g = u.objectStore(Z), r = u.objectStore(ot), _ = g.get(i);
      let v = null;
      _.onerror = () => n(lt(_, "Queue nack read failed")), _.onsuccess = () => {
        const h = _.result;
        if (!(!h || h.scope !== e)) {
          if (d === "drop") {
            g.delete(h.entryId), v = { status: "dropped", entry: h };
            return;
          }
          if (_n(h), h.updatedAt = this.now(), d === "auth") {
            h.status = "pending", g.put(h), r.put({ key: re(e), value: "auth" }), v = { status: "auth", entry: h };
            return;
          }
          if (d === "retry") {
            if (h.attempts = (h.attempts || 0) + 1, h.attempts >= p) {
              h.status = "failed", h.nextAttemptAt = 0, g.put(h), v = { status: "failed", entry: h };
              return;
            }
            const b = l[Math.min(h.attempts - 1, l.length - 1)];
            h.status = "pending", h.nextAttemptAt = this.now() + b, g.put(h), v = { status: "retry", entry: h, delay: b };
          }
        }
      }, u.oncomplete = () => s(v), u.onerror = () => n(u.error || new Error("Queue nack transaction failed")), u.onabort = () => n(u.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, d) {
    return this._remapTransaction(e, null, i, d);
  }
  resolveCreate(e, i, d, f) {
    return this._remapTransaction(e, i, d, f);
  }
  _remapTransaction(e, i, d, f) {
    return this.open().then((p) => p ? new Promise((l, c) => {
      const s = p.transaction(Z, "readwrite"), n = s.objectStore(Z), u = n.index("by_scope_seq").getAll(Bt(this.keyRange, e));
      let g = { changed: [], deleted: [] };
      u.onerror = () => c(lt(u, "Queue remap read failed")), u.onsuccess = () => {
        g = uo(u.result || [], i, d, f, this.now());
        for (const r of g.deleted) n.delete(r);
        for (const r of g.changed) n.put(r);
      }, s.oncomplete = () => l(g.changed), s.onerror = () => c(s.error || new Error("Queue remap transaction failed")), s.onabort = () => c(s.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((d, f) => {
      const p = i.transaction(Z, "readwrite"), l = p.objectStore(Z), c = l.index("by_scope_seq").getAll(Bt(this.keyRange, e));
      let s = 0;
      c.onerror = () => f(lt(c, "Queue failed-entry read failed")), c.onsuccess = () => {
        for (const n of c.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), _n(n), l.put(n), s++);
      }, p.oncomplete = () => d(s), p.onerror = () => f(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => f(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((d, f) => {
      const l = i.transaction(ot, "readonly").objectStore(ot).get(re(e));
      l.onsuccess = () => {
        const c = l.result ? l.result.value : !1;
        d(c || !1);
      }, l.onerror = () => f(lt(l, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((d) => {
      if (d)
        return new Promise((f, p) => {
          const l = d.transaction(ot, "readwrite"), c = typeof i == "string" ? i : i ? "manual" : !1;
          l.objectStore(ot).put({ key: re(e), value: c }), l.oncomplete = () => f(), l.onerror = () => p(l.error || new Error("Queue pause-state write failed")), l.onabort = () => p(l.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((d, f) => {
          const p = i.transaction([Z, ot], "readwrite"), c = p.objectStore(Z).index("by_scope_seq").openCursor(Bt(this.keyRange, e));
          c.onsuccess = (s) => {
            const n = s.target.result;
            n && (n.delete(), n.continue());
          }, c.onerror = () => f(lt(c, "Queue clear failed")), p.objectStore(ot).delete(gn(e)), p.objectStore(ot).delete(re(e)), p.oncomplete = () => d(), p.onerror = () => f(p.error || new Error("Queue clear transaction failed")), p.onabort = () => f(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, d) {
    return this.open().then((f) => f ? new Promise((p, l) => {
      const c = f.transaction(Z, "readwrite"), s = c.objectStore(Z), n = s.get(i);
      let u = null;
      n.onerror = () => l(lt(n, "Queue entry read failed")), n.onsuccess = () => {
        const g = n.result;
        !g || g.scope !== e || (u = d(g, s));
      }, c.oncomplete = () => p(u), c.onerror = () => l(c.error || new Error("Queue entry transaction failed")), c.onabort = () => l(c.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], d = 8, f = 6e4;
  if (window[e] !== void 0) return;
  function p(n) {
    const u = n[e];
    u && u._drain();
  }
  const l = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: p, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, c = new fo({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: wt
  });
  function s(n) {
    this.dom = n, n[e] = this;
    const u = n.closest("[data-ln-data-coordinator]");
    this.scope = n.id || (u ? u.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = wt(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const g = this;
    return c.open().then((r) => r ? c.getPaused(g.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((r) => {
      if (g._paused = !!r, g._paused) {
        const _ = typeof r == "string" ? r : "auth";
        k(g.dom, "ln-api-queue:paused", { reason: _, restored: !0 });
      }
      return g._emitPendingCount();
    }).then(() => g._drain()).catch((r) => {
      console.error("[ln-api-queue] Initialization failed:", r), k(g.dom, "ln-api-queue:error", { operation: "initialize", error: r });
    }), this;
  }
  s.prototype._isOnline = function() {
    const n = this.dom.getAttribute("data-ln-api-queue-online");
    return n === "true" ? !0 : n === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const n = this;
    return c.allForScope(n.scope).then((u) => (k(n.dom, "ln-api-queue:pending-count", { count: u.length, scope: n.scope }), u.length === 0 && k(n.dom, "ln-api-queue:drained", { scope: n.scope }), u));
  }, s.prototype._clearTimer = function(n) {
    const u = this._timers.get(n);
    u && (clearTimeout(u), this._timers.delete(n));
  }, s.prototype._scheduleTimer = function(n, u) {
    const g = Math.max(0, u), r = this._timers.get(n);
    r && clearTimeout(r);
    const _ = this, v = setTimeout(() => {
      _._timers.delete(n), _._drain();
    }, g);
    this._timers.set(n, v);
  }, s.prototype._drain = function() {
    const n = this;
    return n._paused || !n._isOnline() ? Promise.resolve() : (n._drainPromise || (n._drainPromise = c.claimReady(n.scope, n._workerId, f).then((u) => {
      for (const g of u.wakeups)
        n._scheduleTimer(g.chainKey, g.at - Date.now());
      for (const g of u.entries)
        n._clearTimer(g.chainKey), k(n.dom, "ln-api-queue:send", {
          entryId: g.entryId,
          chainKey: g.chainKey,
          op: g.op,
          targetId: g.targetId,
          payload: g.payload,
          expectedVersion: g.expectedVersion,
          idempotencyKey: g.entryId,
          meta: g.meta
        });
    }).catch((u) => {
      console.error("[ln-api-queue] Drain failed:", u), k(n.dom, "ln-api-queue:error", { operation: "drain", error: u });
    }).finally(() => {
      n._drainPromise = null;
    })), n._drainPromise);
  }, s.prototype._onEnqueue = function(n) {
    const u = this;
    return c.enqueue(u.scope, n.detail || {}).then((g) => {
      if (g)
        return u._emitPendingCount().then((r) => (k(u.dom, "ln-api-queue:enqueued", {
          entryId: g.entryId,
          chainKey: g.chainKey,
          count: r.length
        }), u._drain()));
    }).catch((g) => {
      k(u.dom, "ln-api-queue:error", { operation: "enqueue", error: g });
    });
  }, s.prototype._onAck = function(n) {
    const u = this, g = n.detail || {};
    return c.ack(u.scope, g.entryId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((r) => {
      k(u.dom, "ln-api-queue:error", { operation: "ack", entryId: g.entryId, error: r });
    });
  }, s.prototype._onNack = function(n) {
    const u = this, g = n.detail || {};
    return c.nack(u.scope, g.entryId, g.reason, {
      maxAttempts: d,
      backoff: i
    }).then((r) => {
      if (r)
        return r.status === "failed" ? k(u.dom, "ln-api-queue:failed", {
          entryId: r.entry.entryId,
          chainKey: r.entry.chainKey,
          attempts: r.entry.attempts
        }) : r.status === "retry" ? u._scheduleTimer(r.entry.chainKey, r.delay) : r.status === "auth" && (u._paused = !0, k(u.dom, "ln-api-queue:paused", { reason: "auth" }), k(u.dom, "ln-api-queue:auth-required", {
          entryId: r.entry.entryId,
          chainKey: r.entry.chainKey
        })), u._emitPendingCount().then(() => {
          if (r.status === "dropped") return u._drain();
        });
    }).catch((r) => {
      k(u.dom, "ln-api-queue:error", { operation: "nack", entryId: g.entryId, error: r });
    });
  }, s.prototype._onRemap = function(n) {
    const u = this, g = n.detail || {};
    return c.remap(u.scope, g.oldKey, g.newId).catch((r) => {
      k(u.dom, "ln-api-queue:error", { operation: "remap", error: r });
    });
  }, s.prototype._onResolveCreate = function(n) {
    const u = this, g = n.detail || {};
    return c.resolveCreate(u.scope, g.entryId, g.oldKey, g.newId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((r) => {
      k(u.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: g.entryId,
        error: r
      });
    });
  }, s.prototype._onResume = function() {
    const n = this;
    return c.setPaused(n.scope, !1).then(() => (n._paused = !1, k(n.dom, "ln-api-queue:resumed", {}), n._drain())).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "resume", error: u });
    });
  }, s.prototype._onPause = function() {
    const n = this;
    return c.setPaused(n.scope, "manual").then(() => {
      n._paused = !0, k(n.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "pause", error: u });
    });
  }, s.prototype._onDrain = function() {
    const n = this;
    return c.resetFailed(n.scope).then(() => {
      const u = n._drainPromise;
      return u ? u.then(() => n._drain()) : n._drain();
    }).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "manual-drain", error: u });
    });
  }, s.prototype._onClear = function() {
    const n = this;
    return n._timers.forEach((u) => clearTimeout(u)), n._timers.clear(), c.clear(n.scope).then(() => {
      n._paused = !1, k(n.dom, "ln-api-queue:pending-count", { count: 0, scope: n.scope }), k(n.dom, "ln-api-queue:drained", { scope: n.scope });
    }).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "clear", error: u });
    });
  }, s.prototype._bindEvents = function() {
    const n = this;
    n._handlers = {
      enqueue: (u) => n._onEnqueue(u),
      ack: (u) => n._onAck(u),
      nack: (u) => n._onNack(u),
      remap: (u) => n._onRemap(u),
      resolveCreate: (u) => n._onResolveCreate(u),
      resume: () => n._onResume(),
      pause: () => n._onPause(),
      drain: () => n._onDrain(),
      clear: () => n._onClear()
    }, n.dom.addEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.addEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.addEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.addEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.addEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.addEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.addEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.addEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.addEventListener("ln-api-queue:request-clear", n._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n.dom.removeEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.removeEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.removeEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.removeEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.removeEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.removeEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.removeEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.removeEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.removeEventListener("ln-api-queue:request-clear", n._handlers.clear), window.removeEventListener("online", n._onlineHandler), n._timers.forEach((u) => clearTimeout(u)), n._timers.clear(), delete n.dom[e];
  }, H(t, e, s, "ln-api-queue", {
    attributes: l
  });
})();
function wi(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Pt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function ho(t, e, i) {
  const d = wi(t);
  return d === null || d < 0 ? 0 : Math.min(d, Math.min(e, i) / 2);
}
function po(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function mo(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function go(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, d = e.xField || "label", f = e.yField || "value", p = e.includeZero !== !1, l = ho(e.padding, i.width, i.height), c = Array.isArray(t) ? t : [], s = [];
  for (let a = 0; a < c.length; a++) {
    const w = c[a] || {}, E = wi(w[f]);
    E !== null && s.push({
      record: w,
      sourceIndex: a,
      label: w[d] == null ? String(a + 1) : String(w[d]),
      value: E
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
  let n = s[0].value, u = s[0].value;
  for (let a = 1; a < s.length; a++)
    s[a].value < n && (n = s[a].value), s[a].value > u && (u = s[a].value);
  let g = n, r = u;
  p && (g = Math.min(0, g), r = Math.max(0, r)), g === r && (r === 0 ? r = 1 : r > 0 ? g = 0 : r = 0);
  const _ = Math.max(1, i.width - l * 2), v = Math.max(1, i.height - l * 2), h = r - g, b = i.y + i.height - l - (0 - g) / h * v, o = [];
  for (let a = 0; a < s.length; a++) {
    const w = s[a], E = s.length === 1 ? 0.5 : a / (s.length - 1), A = i.x + l + E * _, S = i.y + i.height - l - (w.value - g) / h * v;
    o.push({
      record: w.record,
      sourceIndex: w.sourceIndex,
      label: w.label,
      value: w.value,
      x: A,
      y: S,
      pointString: Pt(A) + "," + Pt(S)
    });
  }
  const y = o.map((a) => a.pointString).join(" ");
  let m = "";
  if (o.length > 0) {
    const a = o[0], w = o[o.length - 1], E = Pt(a.x) + "," + Pt(b), A = Pt(w.x) + "," + Pt(b);
    m = E + " " + y + " " + A;
  }
  return {
    points: o,
    linePoints: y,
    areaPoints: m,
    count: o.length,
    min: n,
    max: u,
    domainMin: g,
    domainMax: r,
    baselineY: b
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function d(n) {
    const u = n[e];
    u && u.requestData();
  }
  function f(n) {
    const u = n[e];
    u && u._render();
  }
  const p = {
    "data-ln-chart": { prop: "name", type: "string", read: j, fallback: "", effect: f, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: d, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: d, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: f, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: f, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: f, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: f, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: f, description: "Forces Y axis scale to start at zero" }
  }, l = X(p);
  function c(n, u) {
    n && (n.textContent = u);
  }
  function s(n) {
    this.dom = n, Y(this, n, l), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const u = this;
    return this._onSetData = function(g) {
      const r = g.detail || {};
      u._data = Array.isArray(r.data) ? r.data : [], u.isLoaded = !0, u._setLoading(!1), u._render();
    }, this._onSetLoading = function(g) {
      u._setLoading(!!(g.detail && g.detail.loading));
    }, this._onRefresh = function() {
      u.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  s.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), u = n === null ? NaN : Number(n), g = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(u) && u >= 0 ? u : 16,
      type: g === "area" || g === "polygon" ? "area" : "line",
      viewBox: this.plot && po(this.plot.getAttribute("viewBox")) || i
    };
  }, s.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, s.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const u = this.name + "-label", g = '[data-ln-template="' + u + '"]';
    if (!this.dom.querySelector(g) && !document.querySelector(g)) return;
    const r = Lt(this.dom, u, "ln-chart");
    if (!r) return;
    const _ = J(this.dom);
    for (const v of n.points) {
      const h = r.cloneNode(!0);
      Zt(h, {
        label: v.label,
        value: rt(v.value, _)
      }), this.labels.appendChild(h);
    }
  }, s.prototype._render = function() {
    const n = this._readOptions(), u = go(this._data, n);
    this.model = u, this.line && (this.line.setAttribute("points", u.linePoints), this.line.toggleAttribute("hidden", u.count === 0)), this.area && (this.area.setAttribute("points", u.areaPoints), this.area.toggleAttribute("hidden", u.count === 0 || n.type !== "area"));
    const g = u.count === 0;
    this.dom.classList.toggle("ln-chart--empty", g), this.empty && this.empty.toggleAttribute("hidden", !g);
    const r = J(this.dom);
    c(this.minimum, rt(u.min, r)), c(this.maximum, rt(u.max, r)), c(this.count, rt(u.count, r)), this._renderLabels(u), k(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: u.count,
      min: u.min,
      max: u.max
    });
  }, s.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, k(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: mo(this.dom.getAttribute("data-ln-chart-sort")),
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
  }, d = X(i);
  function f(p) {
    this.dom = p, Y(this, p, d);
    const l = this;
    return this._onSetData = function(c) {
      c.detail && l._rebuild(c.detail.data || []);
    }, p.addEventListener("ln-options:set-data", this._onSetData), k(p, "ln-options:request-data", { options: this._storeName }), this;
  }
  f.prototype._rebuild = function(p) {
    const l = this.dom, c = this._valueField, s = this._labelField, n = l.getAttribute("data-ln-value") || l.value, u = l.querySelectorAll("option");
    for (let r = u.length - 1; r >= 0; r--)
      u[r].value !== "" && l.removeChild(u[r]);
    for (let r = 0; r < p.length; r++) {
      const _ = p[r], v = document.createElement("option");
      v.value = String(_[c]), v.textContent = _[s] != null ? _[s] : "", l.appendChild(v);
    }
    const g = l.options;
    for (let r = 0; r < g.length; r++)
      if (g[r].value === String(n)) {
        l.value = String(n);
        break;
      }
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, H(t, e, f, "ln-options", {
    attributes: i
  });
})();
function _o(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
  if (!i) return null;
  const f = {};
  return f[i] = [d], f;
}
function bo(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: j, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: j, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, d = X(i);
  function f(p) {
    return this.dom = p, Y(this, p, d), this._onSetCount = function(l) {
      p.textContent = bo(l.detail && l.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), k(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: _o(this._filterRaw)
    }), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, H(t, e, f, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  let p = null;
  const l = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), c = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), s = "lni:", n = "lni:v", u = "1";
  function g() {
    try {
      if (localStorage.getItem(n) !== u) {
        for (let y = localStorage.length - 1; y >= 0; y--) {
          const m = localStorage.key(y);
          m && m.indexOf(s) === 0 && localStorage.removeItem(m);
        }
        localStorage.setItem(n, u);
      }
    } catch {
    }
  }
  g();
  function r() {
    return p || (p = document.getElementById(t), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = t, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function _(y) {
    return y.indexOf(i) === 0 ? c + "/" + y.slice(i.length) + ".svg" : l + "/" + y.slice(e.length) + ".svg";
  }
  function v(y, m) {
    const a = m.match(/viewBox="([^"]+)"/), w = a ? a[1] : "0 0 24 24", E = m.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = E ? E[1].trim() : "", S = m.match(/<svg([^>]*)>/i), C = S ? S[1] : "", L = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    L.id = y, L.setAttribute("viewBox", w), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const q = C.match(new RegExp(I + '="([^"]*)"'));
      q && L.setAttribute(I, q[1]);
    }), L.innerHTML = A, r().querySelector("defs").appendChild(L);
  }
  function h(y) {
    if (d.has(y) || f.has(y)) return;
    if (y.indexOf(i) === 0 && !c) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", y);
      return;
    }
    const m = y.slice(1);
    try {
      const w = localStorage.getItem(s + m);
      if (w) {
        v(m, w), d.add(y);
        return;
      }
    } catch {
    }
    f.add(y);
    const a = _(y);
    fetch(a).then(function(w) {
      if (!w.ok) throw new Error(w.status);
      return w.text();
    }).then(function(w) {
      v(m, w), d.add(y), f.delete(y);
      try {
        localStorage.setItem(s + m, w);
      } catch {
      }
    }).catch(function(w) {
      console.error("[ln-icon] Fetch failed for:", m, w), f.delete(y);
    });
  }
  function b(y) {
    const m = 'use[href^="' + e + '"], use[href^="' + i + '"]', a = y.querySelectorAll ? y.querySelectorAll(m) : [];
    if (y.matches && y.matches(m)) {
      const w = y.getAttribute("href");
      w && h(w);
    }
    Array.prototype.forEach.call(a, function(w) {
      const E = w.getAttribute("href");
      E && h(E);
    });
  }
  function o() {
    b(document), ct(function() {
      te({
        onInit: function(y) {
          b(y);
        }
      }), Nt(["href"], function(y) {
        if ((y.tagName ? y.tagName.toLowerCase() : "") === "use") {
          const a = y.getAttribute("href");
          a && (a.indexOf(e) === 0 || a.indexOf(i) === 0) && h(a);
        }
      });
    }, "ln-icon");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
const Ve = /* @__PURE__ */ new Set([
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
function yo(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let d = 0; d <= e.length; d++) i[d] = [d];
  for (let d = 0; d <= t.length; d++) i[0][d] = d;
  for (let d = 1; d <= e.length; d++)
    for (let f = 1; f <= t.length; f++)
      e.charAt(d - 1) === t.charAt(f - 1) ? i[d][f] = i[d - 1][f - 1] : i[d][f] = Math.min(
        i[d - 1][f - 1] + 1,
        i[d][f - 1] + 1,
        i[d - 1][f] + 1
      );
  return i[e.length][t.length];
}
function vo(t, e = Ve) {
  if (e.has(t)) return null;
  let i = null, d = 1 / 0;
  for (const p of e) {
    const l = yo(t, p);
    l < d && (d = l, i = p);
  }
  const f = Math.max(3, Math.floor(t.length * 0.4));
  return d <= f ? i : null;
}
function Ei(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function wo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], f = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && s.name.endsWith("-for")) {
          const n = (s.value || "").trim();
          if (!n) {
            d.push({
              type: "id-empty",
              element: l,
              attribute: s.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${l.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + Ei(n)) || d.push({
            type: "id-unresolved",
            element: l,
            attribute: s.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${l.tagName.toLowerCase()} ${s.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return d;
}
function Eo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], f = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && (s.name.endsWith("-source") || s.name.endsWith("-store")) && s.name !== "data-ln-data-store") {
          const u = (s.value || "").trim();
          if (!u) {
            d.push({
              type: "store-empty",
              element: l,
              attribute: s.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          const g = Ei(u), r = e.querySelector(`[data-ln-data-store="${g}"], [data-ln-store="${g}"]`), _ = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(u);
          !r && !_ && d.push({
            type: "store-unresolved",
            element: l,
            attribute: s.name,
            storeName: u,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${s.name}="${u}"> targets store "${u}", but no [data-ln-data-store="${u}"] exists in the document.`
          });
        }
      }
  }
  return d;
}
function Ao(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], d = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && d.unshift(e);
  const f = /* @__PURE__ */ new Map();
  for (let p = 0; p < d.length; p++) {
    const l = d[p], c = (l.getAttribute("data-ln-data-store") || "").trim();
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
function So(t = document, e = Ve) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], f = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < f.length; p++) {
    const l = f[p];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && !e.has(s.name)) {
          const n = vo(s.name, e), u = n ? ` Did you mean "${n}"?` : "";
          d.push({
            type: "attribute-unknown",
            element: l,
            attribute: s.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${s.name}" on <${l.tagName.toLowerCase()}>.${u}`
          });
        }
      }
  }
  return d;
}
function xe(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Ve, d = wo(t), f = Eo(t), p = Ao(t), l = So(t, i), c = [
    ...d,
    ...f,
    ...p,
    ...l
  ];
  if (!e.silent)
    for (let s = 0; s < c.length; s++)
      console.warn(c[s].message);
  return {
    idIssues: d,
    storeIssues: f,
    uniquenessIssues: p,
    spellingIssues: l,
    total: c.length
  };
}
let Wt = null;
function oe(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Wt && (clearTimeout(Wt), Wt = null);
  function d() {
    Wt = setTimeout(() => {
      Wt = null;
      const f = xe(t);
      i && i(f);
    }, e);
  }
  Rn() > 0 ? mt(d) : d();
}
function Co(t, e, i, d) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", d), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", d.oldValue, "→", d.newValue), console.groupEnd());
}
let Ot = [];
function To() {
  Ot = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Ot.push(document.body);
}
function Ai(t) {
  if (t === window || t === document)
    return Ot.indexOf(document.body) !== -1;
  for (let e = 0; e < Ot.length; e++)
    if (Ot[e].contains(t)) return !0;
  return !1;
}
function ko(t, e, i, d) {
  Ai(i) && Co(t, e, i, d);
}
function Ie() {
  To(), Pi(Ot.length > 0 ? ko : null, Ot.length > 0 ? Ai : null);
}
function bn() {
  Ie();
}
function Lo() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, ct(function() {
    Ie(), Nt(["data-ln-debug"], Ie);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Lo();
  function d(p) {
    return this.dom = p, oe(p.ownerDocument || document), bn(), this;
  }
  d.prototype.verify = function(p, l) {
    return xe(p || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, d.prototype.destroy = function() {
    delete this.dom[e], bn();
  };
  const f = H(t, e, d, "ln-debug", {
    attributes: i,
    onInit: function(p) {
      typeof document < "u" && oe(p && p.ownerDocument ? p.ownerDocument : document);
    },
    onSubtreeChange: function(p) {
      typeof document < "u" && oe(p && p.ownerDocument ? p.ownerDocument : document);
    }
  });
  f.verify = function(p, l) {
    return xe(p || document, l);
  }, f.schedule = function(p, l, c) {
    return oe(p || document, l, c);
  };
})();
