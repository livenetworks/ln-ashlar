function vn() {
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
      for (let u = 1; u < e.length; u++)
        if (e[u] && e[u].nodeType === 1) {
          d = e[u];
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
  const u = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: d
  });
  return t.dispatchEvent(u), u;
}
function wn(t, e, i) {
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
function En(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function At(t) {
  return t.hasAttribute("value") ? t.getAttribute("value") : t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.textContent.trim();
}
function An(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Oe(t, e) {
  const i = !!(e && e.typed), d = e && e.exclude, u = {}, m = t.elements, l = {};
  if (i)
    for (let c = 0; c < m.length; c++) {
      const s = m[c];
      s.name && s.type === "checkbox" && !s.disabled && (l[s.name] = (l[s.name] || 0) + 1);
    }
  for (let c = 0; c < m.length; c++) {
    const s = m[c];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button") && !(d && s.matches && s.matches(d)))
      if (s.type === "checkbox")
        i && l[s.name] === 1 ? u[s.name] = s.checked : (u[s.name] || (u[s.name] = []), s.checked && u[s.name].push(s.value));
      else if (s.type === "radio")
        s.checked && (u[s.name] = s.value);
      else if (s.type === "select-multiple") {
        u[s.name] = [];
        for (let n = 0; n < s.options.length; n++)
          s.options[n].selected && u[s.name].push(s.options[n].value);
      } else if (i && s.type === "hidden")
        u[s.name] = s.value;
      else if (i && (s.type === "number" || s.type === "range")) {
        const n = Number(s.value);
        u[s.name] = s.value === "" || isNaN(n) ? null : n;
      } else
        u[s.name] = s.value;
  }
  return u;
}
function Ki(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function Ne(t, e) {
  const i = t.elements, d = [], u = {};
  for (let m = 0; m < i.length; m++) {
    const l = i[m];
    l.name && l.type === "checkbox" && (u[l.name] = (u[l.name] || 0) + 1);
  }
  for (let m = 0; m < i.length; m++) {
    const l = i[m];
    if (l.type === "file" || l.type === "submit" || l.type === "button") continue;
    const c = l.getAttribute("data-ln-fill-as") || l.name;
    if (!c || !(c in e)) continue;
    const s = e[c];
    if (l.type === "checkbox") {
      if (Array.isArray(s))
        l.checked = s.indexOf(l.value) !== -1;
      else if (u[l.name] > 1) {
        const n = String(s).split(",").map(function(f) {
          return f.trim();
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
    set: function(u) {
      d ? d.call(this, u, (m) => e.set.call(this, m)) : e.set.call(this, u);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = Ne, window.lnCore.serializeForm = Oe, window.lnCore.resolveFormMethod = An);
function Ct(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Kt(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function Sn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const Cn = {};
function ji(t, e) {
  Cn[t] = e;
}
function Wi(t) {
  return Cn[t] || { ingress: (e) => e, egress: (e) => e };
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
const Tn = {};
function kn(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  Tn[i] = e;
}
function Rt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return Tn[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = kn, window.lnCore.getLocaleFallback = Rt, window.lnCore.ensureLocaleObserver = ue);
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
      const f = s[n].trim().split(":");
      if (f.length !== 2) continue;
      const p = f[0].trim(), o = f[1].trim();
      e[o] != null && c.setAttribute(p, e[o]);
    }
  }
  const u = t.querySelectorAll("[data-ln-show]");
  for (let l = 0; l < u.length; l++) {
    const c = u[l], s = c.getAttribute("data-ln-show");
    s in e && c.classList.toggle("hidden", !e[s]);
  }
  const m = t.querySelectorAll("[data-ln-class]");
  for (let l = 0; l < m.length; l++) {
    const c = m[l], s = c.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < s.length; n++) {
      const f = s[n].trim().split(":");
      if (f.length !== 2) continue;
      const p = f[0].trim(), o = f[1].trim();
      o in e && c.classList.toggle(p, !!e[o]);
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
    const m = i.currentNode;
    m.textContent.indexOf("{{") !== -1 && (m.textContent = m.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(l, c) {
        return e[c] !== void 0 ? e[c] : "";
      }
    ));
  }
  const d = function(m, l) {
    return e[l] !== void 0 ? e[l] : "";
  }, u = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && u.push(t);
  for (let m = 0; m < u.length; m++) {
    const l = u[m], c = l.attributes;
    for (let s = 0; s < c.length; s++) {
      const n = c[s];
      n.value.indexOf("{{") !== -1 && l.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, d));
    }
  }
  return t;
}
function Gi(t, e, i, d, u, m) {
  const l = {};
  for (let s = 0; s < t.children.length; s++) {
    const n = t.children[s], f = n.getAttribute("data-ln-render-key");
    f && (l[f] = n);
  }
  const c = document.createDocumentFragment();
  for (let s = 0; s < e.length; s++) {
    const n = e[s], f = String(d(n));
    let p = l[f];
    if (p)
      u(p, n, s);
    else {
      const o = ae(i, m);
      if (!o || (Zt(o, n), p = o.firstElementChild, !p)) continue;
      p.setAttribute("data-ln-render-key", f), u(p, n, s);
    }
    c.appendChild(p);
  }
  t.textContent = "", t.appendChild(c);
}
function Ln(t, e) {
  const i = {}, d = t.querySelectorAll("[" + e + "]");
  for (let u = 0; u < d.length; u++)
    i[d[u].getAttribute(e)] = d[u].textContent, d[u].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Zt, window.lnCore.fill = ft, window.lnCore.lnFill = Vi, window.lnCore.renderList = Gi);
function K(t, e, i) {
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
  const u = d.trim().toLowerCase();
  return !(u === "false" || u === "0");
}
function Fe(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const pe = /* @__PURE__ */ new Map();
function xn(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (pe.has(i)) return pe.get(i);
  const d = new Set(t || []), u = function(m, l) {
    const c = m.getAttribute(l);
    return c !== null && d.has(c) ? c : e;
  };
  return pe.set(i, u), u;
}
function In(t, e, i) {
  const d = parseFloat(t.getAttribute(e));
  return isNaN(d) ? i : d;
}
function qn(t, e, i) {
  const d = t.getAttribute(e);
  if (!d) return i;
  try {
    return JSON.parse(d);
  } catch {
    return i;
  }
}
function Dn(t, e, i, d, u) {
  if (!t || e === null) return !0;
  const m = d || "ln-component", l = t.type;
  if (l === "trigger" || l === "marker" || l === "string" || l === "list" || !l || e === "" && t.fallback !== void 0)
    return !0;
  const c = (s) => {
    u ? console.warn(s, u) : console.warn(s);
  };
  if (l === "boolean") {
    const s = e.trim().toLowerCase();
    return s !== "" && s !== "true" && s !== "false" && s !== "1" && s !== "0" ? (c(`[${m}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (l === "enum") {
    const s = t.values || [];
    return s.includes(e) ? !0 : (c(`[${m}] Invalid value "${e}" for attribute "${i}". Allowed: ${s.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (l === "integer") {
    if (!/^-?\d+$/.test(e))
      return c(`[${m}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const s = parseInt(e, 10);
    return t.min !== void 0 && s < t.min ? (c(`[${m}] Value ${s} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && s > t.max ? (c(`[${m}] Value ${s} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (l === "float")
    return isNaN(Number(e)) ? (c(`[${m}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (l === "json")
    try {
      return JSON.parse(e), !0;
    } catch (s) {
      return c(`[${m}] Invalid JSON for attribute "${i}": ${s.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function Y(t, e, i) {
  for (const d in i) {
    const [u, m, l] = i[d];
    Object.defineProperty(t, d, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return u(e, m, l);
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
    let u = d.read;
    if (!u && d.type)
      switch (d.type) {
        case "enum":
          u = xn(d.values, d.fallback);
          break;
        case "integer":
          u = xt;
          break;
        case "float":
          u = In;
          break;
        case "boolean":
          u = It;
          break;
        case "list":
          u = Fe;
          break;
        case "json":
          u = qn;
          break;
        case "string":
        default:
          u = K;
          break;
      }
    u || (u = K), e[d.prop] = [u, i, d.fallback];
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
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = Y, window.lnCore.attrSpec = X, window.lnCore.attrStr = K, window.lnCore.attrInt = xt, window.lnCore.attrBool = It, window.lnCore.attrList = Fe, window.lnCore.attrEnum = xn, window.lnCore.attrFloat = In, window.lnCore.attrJson = qn);
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
function Rn(t, e, i, d) {
  if (t.nodeType !== 1) return;
  const m = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", l = { selector: e, attribute: i, ComponentFn: d };
  if (t.matches && t.matches(m) && $t(t, l), t.querySelectorAll) {
    const c = t.querySelectorAll(m);
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
function On() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function Nn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function Mn(t) {
  const e = Nn(), i = t.observed || [];
  for (let d = 0; d < i.length; d++) {
    const u = i[d];
    e.byAttr.has(u) || e.byAttr.set(u, []), e.byAttr.get(u).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const d in t.attributes) {
      e.byDeclaredAttr.has(d) || e.byDeclaredAttr.set(d, []);
      const u = e.byDeclaredAttr.get(d);
      u.some((m) => m.componentTag === t.componentTag) || u.push({
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
      for (const u of d)
        e.byReactive.has(u) || e.byReactive.set(u, []), e.byReactive.get(u).push(t);
  }
  t.persist && e.persist.push(t);
}
function Ye(t, e, i, d) {
  for (let u = 0; u < t.length; u++) {
    const m = t[u];
    if (!e[m.attribute]) continue;
    const l = m.effects && m.effects[i];
    l ? l(e, i, d) : m.onAttrChange && (!m.declared || m.declared.has(i)) && m.onAttrChange(e, i, d);
  }
}
function Xi(t) {
  const e = t.attributeName, i = e.indexOf("data-ln-") === 0, d = Nn(), u = d.byAttr.get(e), m = vn() && d.byDeclaredAttr && d.byDeclaredAttr.has(e);
  if (!i && !u && !m)
    return;
  const l = t.target;
  if (t.oldValue !== l.getAttribute(e)) {
    if (m && qe(l)) {
      const c = d.byDeclaredAttr.get(e), s = l.getAttribute(e);
      for (let n = 0; n < c.length; n++)
        Dn(c[n].spec, s, e, c[n].componentTag, l);
    }
    if (window.lnCore._debugSink && (i || u) && window.lnCore._debugSink("attr", e, l, { oldValue: t.oldValue, newValue: l.getAttribute(e) }), i) {
      const c = d.byReactive.get(e);
      c && Ye(c, l, e, t.oldValue), d.reactiveWildcard.length && Ye(d.reactiveWildcard, l, e, t.oldValue);
    }
    if (u)
      for (let c = 0; c < u.length; c++) {
        const s = u[c];
        if (s.handler) {
          s.handler(l, e, t.oldValue);
          continue;
        }
        s.onAttributeChange && l[s.attribute] ? s.onAttributeChange(l, e) : (Rn(l, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(l));
      }
  }
}
function Fn() {
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
function Bn(t) {
  const e = Be();
  if (!e.length) return;
  const i = t.target;
  if (i) {
    const u = i.nodeType === 1 ? i : i.parentElement;
    if (u && (u.isContentEditable || u.closest && u.closest('[contenteditable]:not([contenteditable="false"])')))
      return;
  }
  const d = Pe();
  if (t.target && d.length)
    for (let u = 0; u < d.length; u++) {
      const m = d[u], l = m.query, c = t.target.nodeType === 1 ? t.target.matches && t.target.matches(l) ? t.target : t.target.closest ? t.target.closest(l) : null : t.target.parentElement && t.target.parentElement.closest ? t.target.parentElement.closest(l) : null;
      c && m.onSubtreeChange(c, t);
    }
  for (let u = 0; u < t.addedNodes.length; u++) {
    const m = t.addedNodes[u];
    if (m.nodeType === 1) {
      const l = !!(m.firstElementChild || m.children && m.children.length);
      for (let c = 0; c < e.length; c++) {
        const s = e[c];
        if (s.selector && s.attribute && s.ComponentFn) {
          if (!l)
            m.matches && m.matches(s.query) && $t(m, s);
          else if (m.matches && m.matches(s.query) && $t(m, s), m.querySelectorAll) {
            const n = m.querySelectorAll(s.query);
            for (let f = 0; f < n.length; f++)
              $t(n[f], s);
          }
        }
        s.onInit && s.onInit(m);
      }
    }
  }
  for (let u = 0; u < t.removedNodes.length; u++) {
    const m = t.removedNodes[u];
    if (m.nodeType === 1) {
      if (document.contains(m)) continue;
      const l = !!(m.firstElementChild || m.children && m.children.length);
      for (let c = 0; c < e.length; c++) {
        const s = e[c], n = s.query;
        if (n) {
          if (!l)
            m.matches && m.matches(n) && ge(m, s);
          else if (m.matches && m.matches(n) && ge(m, s), m.querySelectorAll) {
            const f = m.querySelectorAll(n);
            for (let p = 0; p < f.length; p++)
              ge(f[p], s);
          }
        }
      }
    }
  }
}
function Pn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ct(function() {
    const t = new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const d = e[i];
        if (d.type === "childList")
          try {
            Bn(d);
          } catch (u) {
            console.error("[ln-core] lifecycle handler failed", d.target, u);
          }
      }
    });
    window.lnCore._lifecycleObserver = t, t.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Hn(t) {
  if (typeof window > "u") return t();
  window.lnCore = window.lnCore || {};
  const e = window.lnCore._lifecycleObserver;
  if (!e) return t();
  const i = e.takeRecords();
  for (let d = 0; d < i.length; d++) {
    const u = i[d];
    if (u.type === "childList")
      try {
        Bn(u);
      } catch (m) {
        console.error("[ln-core] lifecycle handler failed", u.target, m);
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
  Mn({ observed: t, handler: e }), Fn();
}
function te(t) {
  Be().push(t), t.onSubtreeChange && t.query && Pe().push(t), Pn();
}
function H(t, e, i, d, u = {}) {
  const m = u.extraAttributes || [], l = u.onAttributeChange || null, c = u.onSubtreeChange || null, s = u.onInit || null, n = u.onAttrChange || null, f = u.effects || null, p = u.attributes || null, o = p ? $i(p) : f, y = p ? new Set(Object.keys(p)) : null, w = u.persist || null;
  function h(v) {
    const E = v || document.body;
    if (Rn(E, t, e, i), p && vn())
      for (const A in p) {
        const S = p[A], C = Array.from(E.querySelectorAll("[" + A + "]"));
        E.matches && E.matches("[" + A + "]") && C.push(E);
        for (let L = 0; L < C.length; L++) {
          const I = C[L];
          qe(I) && Dn(S, I.getAttribute(A), A, d, I);
        }
      }
    s && s(E);
  }
  const b = [];
  if (t.indexOf("[") !== -1) {
    const v = /\[([\w-]+)/g;
    let E;
    for (; (E = v.exec(t)) !== null; )
      b.push(E[1]);
  } else
    b.push(t);
  Mn({
    selector: t,
    attribute: e,
    componentTag: d,
    attributes: p,
    ComponentFn: i,
    onInit: s,
    observed: b.concat(m),
    onAttributeChange: l,
    onAttrChange: n,
    effects: o,
    declared: y,
    persist: w
  }), Fn();
  const r = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1, _ = u.subtreeQuery || (r ? t : "[" + t + "]"), g = {
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: s,
    onSubtreeChange: c,
    query: _
  };
  Be().push(g), c && _ && Pe().push(g), Pn(), window[e] = h, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = H, window.lnCore.observeLifecycle = te, window.lnCore.withoutLifecycle = Hn);
  function a() {
    On() > 0 ? mt(function() {
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
  const u = t != null ? String(t) : "", m = e != null ? String(e) : "";
  return d ? d.compare(u, m) : u < m ? -1 : u > m ? 1 : 0;
}
function Ht(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function Un(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.threshold != null ? t.threshold : 25, u = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, l = typeof t.onChange == "function" ? t.onChange : function() {
  }, c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let f = 0, p = 0, o = 0, y = { sort: null, filters: {}, search: "" }, w = null, h = 0, b = 0, r = !1;
  function _(E) {
    s.set(E, ++h);
  }
  function g() {
    return !!(y && (y.search || y.filters && Object.keys(y.filters).length));
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
  function v(E, A) {
    n.add(E), m(y, E, A);
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
      return f;
    },
    get grandTotal() {
      return p;
    },
    get queryGen() {
      return o;
    },
    get size() {
      return c.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(E, A) {
      clearTimeout(w), b = E;
      for (let D = E; D < A; D++)
        c.has(D) && _(D);
      if (f <= 0) return;
      const S = Math.max(0, E - d), C = Math.min(f, A + d), L = Math.floor(S / i), I = Math.floor(Math.max(0, C - 1) / i);
      let q = -1;
      for (let D = L; D <= I; D++) {
        const O = D * i, F = Math.min(i, f - O);
        let U = !1;
        const j = Math.max(O, S), G = Math.min(O + F, C);
        for (let tt = j; tt < G; tt++)
          if (!c.has(tt)) {
            U = !0;
            break;
          }
        if (U && !n.has(O)) {
          q = O;
          break;
        }
      }
      q !== -1 && (w = setTimeout(function() {
        v(q, i);
      }, u));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(E) {
      if (E = E || {}, E.queryGen != null && E.queryGen !== o) return !1;
      const A = E.offset || 0, S = E.data || [];
      let C = 0;
      for (let L = 0; L < S.length; L++)
        S[L] != null && C++;
      if (C === 0 && (E.provisional || E.filtered > 0))
        return n.delete(A), !1;
      r && (c.clear(), s.clear(), r = !1), E.provisional || (p = E.total != null ? E.total : p, f = E.filtered != null ? E.filtered : E.data ? E.data.length : f);
      for (let L = 0; L < S.length; L++)
        S[L] != null && (c.set(A + L, S[L]), _(A + L));
      return n.delete(A), a(), l(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(E) {
      E && (y = E), v(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(E) {
      o++, n.clear(), clearTimeout(w), E && (y = E), r = !0, v(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      o++, n.clear(), clearTimeout(w), r = !0;
      const E = Math.max(0, Math.floor(b / i) * i);
      v(E, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(E) {
      n.delete(E);
    },
    destroy: function() {
      clearTimeout(w), c.clear(), s.clear(), n.clear();
    },
    configure: function(E) {
      E = E || {};
      let A = !1;
      if (E.windowSize != null && E.windowSize > 0 && E.windowSize !== e) {
        const S = E.windowSize < e;
        e = E.windowSize, S && a(), A = !0;
      }
      E.pageSize != null && E.pageSize > 0 && (i = E.pageSize), E.threshold != null && E.threshold >= 0 && (d = E.threshold), E.fetchDebounce != null && E.fetchDebounce >= 0 && (u = E.fetchDebounce), A && l();
    },
    setGrandTotal: function(E) {
      E == null || isNaN(E) || E < 0 || (p = E, g() || (f = E), l());
    }
  };
}
function zn(t) {
  return (t || "").replace(/^#/, "");
}
function Xt(t) {
  const e = t === void 0 ? location.hash : t, i = {}, d = zn(e);
  if (!d) return i;
  const u = d.split("&");
  for (let m = 0; m < u.length; m++) {
    const l = u[m];
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
  const u = Object.keys(i).map(function(m) {
    const l = i[m];
    return l === "" ? m : m + ":" + encodeURIComponent(l);
  }).join("&");
  zn(location.hash) !== u && (location.hash = u);
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
function Kn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Ee(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function jn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function Ae(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), d = t.slice(e + 1), u = d ? d.split(",").map(function(m) {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  }).filter(Boolean) : [];
  return { key: i, values: u };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Xt, window.lnCore.hashGet = st, window.lnCore.hashSet = gt, window.lnCore.hashLinkClick = ze, window.lnCore.resolveHashNamespace = St, window.lnCore.hashSortEncode = Kn, window.lnCore.hashSortDecode = Ee, window.lnCore.hashFilterEncode = jn, window.lnCore.hashFilterDecode = Ae);
function le(t, e, i, d) {
  const u = typeof d == "number" ? d : 4, m = window.innerWidth, l = window.innerHeight, c = e.width, s = e.height, n = (i || "bottom").split("-"), f = n[0], p = n[1] === "start" || n[1] === "end" ? n[1] : "center", o = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, y = o[f] || o.bottom;
  function w(g) {
    return g === "top" || g === "bottom" ? p === "start" ? t.left : p === "end" ? t.right - c : t.left + (t.width - c) / 2 : p === "start" ? t.top : p === "end" ? t.bottom - s : t.top + (t.height - s) / 2;
  }
  function h(g) {
    let a, v, E = !0;
    return g === "top" ? (a = t.top - u - s, v = w(g), a < 0 && (E = !1)) : g === "bottom" ? (a = t.bottom + u, v = w(g), a + s > l && (E = !1)) : g === "left" ? (a = w(g), v = t.left - u - c, v < 0 && (E = !1)) : (a = w(g), v = t.right + u, v + c > m && (E = !1)), { top: a, left: v, side: g, fits: E };
  }
  let b = null;
  for (let g = 0; g < y.length; g++) {
    const a = h(y[g]);
    if (a.fits) {
      b = a;
      break;
    }
  }
  b || (b = h(y[0]));
  let r = b.top, _ = b.left;
  return c >= m ? _ = 0 : (_ < 0 && (_ = 0), _ + c > m && (_ = m - c)), s >= l ? r = 0 : (r < 0 && (r = 0), r + s > l && (r = l - s)), { top: r, left: _, placement: b.side };
}
function Se(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, d = e.display, u = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const m = t.offsetWidth, l = t.offsetHeight;
  return e.visibility = i, e.display = d, e.position = u, { width: m, height: l };
}
let Qt = null;
const Ji = "ln-ashlar:storage-salt:v1", Xe = 32768;
function Je(t) {
  let e = "";
  const i = t.byteLength;
  for (let d = 0; d < i; d += Xe)
    e += String.fromCharCode.apply(
      null,
      t.subarray(d, Math.min(d + Xe, i))
    );
  return btoa(e);
}
function Ze(t) {
  const e = atob(t), i = e.length, d = new Uint8Array(i);
  for (let u = 0; u < i; u++)
    d[u] = e.charCodeAt(u);
  return d;
}
function Wn(t, e) {
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
  const u = e.salt || Ji, m = typeof u == "string" ? d.encode(u) : u, l = e.iterations || 1e5, c = await crypto.subtle.importKey(
    "raw",
    d.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: m,
      iterations: l,
      hash: "SHA-256"
    },
    c,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function tn(t, e = {}) {
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
  const { key: d } = Wn(e);
  if (t == null)
    return t;
  if (!d)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const u = new TextEncoder(), m = crypto.getRandomValues(new Uint8Array(12)), l = typeof t == "string" ? t : JSON.stringify(t), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: m },
      d,
      u.encode(l)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Je(m),
      data: Je(new Uint8Array(c))
    };
  } catch (u) {
    throw console.error("[ln-core/crypto] Encryption failed:", u), new Error("[ln-crypto] Encryption failed: " + (u && u.message ? u.message : String(u)));
  }
}
async function er(t, e, i) {
  const { key: d, options: u } = Wn(e), m = u.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!d) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (m)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const l = new TextDecoder(), c = Ze(t.iv), s = Ze(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: c },
      d,
      s
    ), f = l.decode(n);
    try {
      return JSON.parse(f);
    } catch {
      return f;
    }
  } catch (l) {
    if (m)
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
function Vn(t, e = 100, i = 0) {
  const d = parseFloat(String(t)) || 0, u = parseFloat(String(e)) || 100, m = parseFloat(String(i)) || 0, l = Math.max(m, Math.min(d, u)), c = u - m;
  let s = 0;
  return c > 0 && (s = (l - m) / c * 100), s = Math.max(0, Math.min(100, s)), {
    value: d,
    min: m,
    max: u,
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
      const m = +d[1], l = +d[2], c = +d[3], s = new Date(m, l - 1, c);
      return s.getFullYear() !== m || s.getMonth() !== l - 1 || s.getDate() !== c ? null : s;
    }
    const u = new Date(i);
    return isNaN(u.getTime()) ? null : u;
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
    let u = "", m = ".";
    for (let l = 0; l < d.length; l++)
      d[l].type === "group" && (u = d[l].value), d[l].type === "decimal" && (m = d[l].value);
    Et[e] = { groupSep: u, decimalSep: m, fmt: i };
  }
  return Et[e];
}
function Gn(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let d = t.trim();
  return d === "" ? "" : (d = d.replace(/[$€£¥]/g, ""), e && (d = d.split(e).join("")), d = d.replace(/\s/g, ""), i && i !== "." && (d = d.replace(i, ".")), d = d.replace(/[^\d.-]/g, ""), d);
}
function nr(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const d = ce(e), u = Gn(i, d.groupSep, d.decimalSep);
  if (u === "" || u === "-") return NaN;
  const m = parseFloat(u);
  return isNaN(m) ? NaN : m;
}
function rt(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const d = e || "default", u = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, m = i.userDecimals != null ? i.userDecimals : null;
  if (u !== null) {
    const l = d + "|max:" + u;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: u
    })), Et[l].format(t);
  }
  if (m !== null && m > 0) {
    const l = d + "|exact:" + m;
    return Et[l] || (Et[l] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: m,
      maximumFractionDigits: m
    })), Et[l].format(t);
  }
  return ce(e).fmt.format(t);
}
function se(t) {
  return String(t || "").trim().toLowerCase();
}
function $n(t) {
  const e = se(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function ir(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Qn(t, e) {
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
    const s = or(l), n = sr(l, c), f = ar(s, n);
    lr(n) && e.has(f) && (e.get(f).abort(), e.delete(f));
    const p = new AbortController(), o = c.signal;
    let y = null;
    o && (o.aborted ? p.abort(o.reason) : (y = function() {
      p.abort(o.reason);
    }, o.addEventListener("abort", y, { once: !0 })));
    const w = Object.assign({}, c, { signal: p.signal });
    return e.set(f, p), t(l, w).finally(function() {
      o && y && o.removeEventListener("abort", y), e.get(f) === p && e.delete(f);
    });
  }
  d.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = d;
  function u(l) {
    if (!l.detail || !l.detail.url) return;
    const c = l.target, s = (l.detail.method || (l.detail.body ? "POST" : "GET")).toUpperCase(), n = l.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const f = new AbortController(), p = l.detail.signal;
    let o = null;
    p && (p.aborted ? f.abort(p.reason) : (o = function() {
      f.abort(p.reason);
    }, p.addEventListener("abort", o, { once: !0 }))), n && i.set(n, f);
    const y = { method: s, signal: f.signal };
    l.detail.body !== void 0 && (y.body = l.detail.body), window.fetch(l.detail.url, y).then(function(w) {
      p && o && p.removeEventListener("abort", o), n && i.get(n) === f && i.delete(n), k(c, "ln-http:response", {
        ok: w.ok,
        status: w.status,
        response: w
      });
    }).catch(function(w) {
      p && o && p.removeEventListener("abort", o), n && i.get(n) === f && i.delete(n), !(w && w.name === "AbortError") && k(c, "ln-http:error", {
        ok: !1,
        status: 0,
        error: w
      });
    });
  }
  function m(l) {
    const c = l.detail || {};
    c.all ? window.lnHttp.cancelAll() : c.key ? window.lnHttp.cancelByKey(c.key) : c.url && window.lnHttp.cancel(c.url);
  }
  document.addEventListener("ln-http:request", u), document.addEventListener("ln-http:cancel", m), window.lnHttp = {
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
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", u), document.removeEventListener("ln-http:cancel", m), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: K, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, d = X(i), u = /* @__PURE__ */ new Map();
  function m(l) {
    if (this.dom = l, Y(this, l, d), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Yi(), this._held = !0;
    const c = this, s = this.url;
    let n = u.get(s);
    return n || (n = fetch(s).then(function(f) {
      if (!f.ok)
        throw new Error("HTTP error! status: " + f.status);
      return f.text();
    }).catch(function(f) {
      throw u.delete(s), f;
    }), u.set(s, n)), n.then(function(f) {
      if (c._destroyed) return;
      const p = document.createElement("template");
      p.innerHTML = f, c.dom.content.appendChild(p.content), k(c.dom, "ln-include:loaded", { target: c.dom, url: c.url }), c._held && (c._held = !1, me());
    }).catch(function(f) {
      c._destroyed || (console.error("[ln-include] Failed to fetch template from " + c.url + ":", f), k(c.dom, "ln-include:error", { target: c.dom, url: c.url, error: f }), c._held && (c._held = !1, me()));
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, me()), delete this.dom[e]);
  }, H(t, e, m, "ln-include", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-form": { type: "marker", description: "Identifies the form element as an enhanced ln-form" },
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: K, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, d = X(i);
  function u(m) {
    this.dom = m, Y(this, m, d), this._baseAction = m.getAttribute("action") || "";
    const l = this;
    function c() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let f = 0; f < n.length; f++)
        n[f].hasAttribute("data-ln-initial-value") || n[f].setAttribute("data-ln-initial-value", n[f].getAttribute("value") || "");
    }
    function s() {
      const n = l.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let f = 0; f < n.length; f++)
        n[f].value = n[f].getAttribute("data-ln-initial-value") || "";
    }
    return c(), this._onLnFill = function(n) {
      n.target === l.dom && (n.detail ? (c(), l.fill(n.detail), l._applyActionMode(n.detail)) : (l.dom.reset(), s()));
    }, this._onReset = function() {
      l._applyActionMode(null), s();
    }, m.addEventListener("ln-fill", this._onLnFill), m.addEventListener("reset", this._onReset), this;
  }
  u.prototype.fill = function(m) {
    const l = Ne(this.dom, m);
    for (let c = 0; c < l.length; c++) {
      const s = l[c], n = s.tagName === "SELECT" || s.type === "checkbox" || s.type === "radio";
      s.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, u.prototype.reset = function() {
    this.dom.reset(), this._applyActionMode(null);
    const m = this.dom.elements;
    for (let l = 0; l < m.length; l++) {
      const c = m[l], s = c.tagName === "SELECT" || c.type === "checkbox" || c.type === "radio";
      c.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, u.prototype._ensureMethodInput = function() {
    let m = this.dom.querySelector('input[name="_method"]');
    return m || (m = document.createElement("input"), m.type = "hidden", m.name = "_method", m.value = "", this.dom.appendChild(m)), m;
  }, u.prototype._applyActionMode = function(m) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const l = m && m.id != null && m.id !== "" ? m.id : null, c = this._ensureMethodInput();
    if (l !== null) {
      const s = this._actionEdit;
      s ? this.dom.setAttribute("action", s.replace(":id", encodeURIComponent(l))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(l)), c.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), c.value = "";
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, H(t, e, u, "ln-form", {
    attributes: i
  });
})();
const en = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function nn(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function cr(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function dr(t, e) {
  const i = [];
  if (t) {
    const d = Object.keys(en);
    for (let u = 0; u < d.length; u++) {
      const m = d[u], l = en[m];
      t[l] && i.push(m);
    }
  }
  if (e) {
    const d = Array.from(e);
    for (let u = 0; u < d.length; u++)
      d[u] && i.indexOf(d[u]) === -1 && i.push(d[u]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", d = "data-ln-validate-error", u = "ln-validate-valid", m = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function c(s) {
    this.dom = s, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, f = s.tagName, p = s.type, o = f === "SELECT" || p === "checkbox" || p === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(w) {
      const h = w.detail && w.detail.error;
      if (!h) return;
      n._customErrors.add(h), n._touched = !0;
      const b = s.closest(".form-element");
      if (b) {
        const r = b.querySelector("[" + d + '="' + h + '"]');
        r && r.classList.remove("hidden");
      }
      s.classList.remove(u), s.classList.add(m), s.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(w) {
      const h = w.detail && w.detail.error, b = s.closest(".form-element");
      if (h) {
        if (n._customErrors.delete(h), b) {
          const r = b.querySelector("[" + d + '="' + h + '"]');
          r && r.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(r) {
          if (b) {
            const _ = b.querySelector("[" + d + '="' + r + '"]');
            _ && _.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, o || s.addEventListener("input", this._onInput), s.addEventListener("change", this._onChange), s.addEventListener("ln-validate:set-custom", this._onSetCustom), s.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const y = s.form;
    return y && (y.hasAttribute("novalidate") || y.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(w) {
      n._touched = !0, !n.validate() && w.detail && w.detail.invalidFields && w.detail.invalidFields.push(n.dom);
    }, y.addEventListener("reset", this._onFormReset), y.addEventListener("ln-validate:request-validate", this._onValidateRequest), y._lnValidateGateBound || (y._lnValidateGateBound = !0, y.addEventListener("submit", function(w) {
      const h = { invalidFields: [] };
      k(y, "ln-validate:request-validate", h), h.invalidFields.length > 0 && (w.preventDefault(), h.invalidFields.sort((b, r) => b.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), h.invalidFields[0].focus());
    }))), cr(s) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const s = this.dom, n = s.validity, f = nn(n, this._customErrors.size), p = dr(n, this._customErrors), o = s.closest(".form-element");
    if (o) {
      const h = o.querySelector("[" + i + "]");
      if (h) {
        const b = h.querySelectorAll("[" + d + "]");
        for (let r = 0; r < b.length; r++) {
          const _ = b[r].getAttribute(d), g = !p.includes(_);
          b[r].classList.contains("hidden") !== g && b[r].classList.toggle("hidden", g);
        }
      }
    }
    s.classList.contains(u) !== f && s.classList.toggle(u, f), s.classList.contains(m) === f && s.classList.toggle(m, !f);
    const y = f ? "false" : "true";
    return s.getAttribute("aria-invalid") !== y && s.setAttribute("aria-invalid", y), k(s, f ? "ln-validate:valid" : "ln-validate:invalid", { target: s, field: s.name, errors: p }), f;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.contains(u) && this.dom.classList.remove(u), this.dom.classList.contains(m) && this.dom.classList.remove(m), this.dom.hasAttribute("aria-invalid") && this.dom.removeAttribute("aria-invalid");
    const s = this.dom.closest(".form-element");
    if (s) {
      const n = s.querySelectorAll("[" + d + "]");
      for (let f = 0; f < n.length; f++)
        n[f].classList.contains("hidden") || n[f].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return nn(this.dom.validity, this._customErrors.size);
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const s = this.dom.form;
    s && (this._onFormReset && s.removeEventListener("reset", this._onFormReset), this._onValidateRequest && s.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(u, m), this.dom.removeAttribute("aria-invalid"), delete this.dom[e];
  }, H(t, e, c, "ln-validate", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let d = null;
  function u(o) {
    if (!o.hasAttribute(t) || o[e]) return;
    o[e] = !0;
    const y = n(o);
    m(y.links), l(y.forms);
  }
  function m(o) {
    for (const y of o) {
      if (y[e + "Trigger"] || y.hostname && y.hostname !== window.location.hostname) continue;
      const w = y.getAttribute("href");
      if (w && w.includes("#")) continue;
      const h = function(b) {
        if (!En(b, y)) return;
        b.preventDefault();
        const r = y.getAttribute("href");
        r && s("GET", r, null, y);
      };
      y.addEventListener("click", h), y[e + "Trigger"] = h;
    }
  }
  function l(o) {
    for (const y of o) {
      if (y[e + "Trigger"]) continue;
      if (y.hasAttribute(i)) {
        y[e + "ScopeWarned"] || (y[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(h) {
        if (h.defaultPrevented) return;
        h.preventDefault();
        const b = y.method.toUpperCase(), r = y.action, _ = new FormData(y);
        for (const g of y.querySelectorAll('button, input[type="submit"]'))
          g.disabled = !0;
        s(b, r, _, y, function() {
          for (const g of y.querySelectorAll('button, input[type="submit"]'))
            g.disabled = !1;
        });
      };
      y.addEventListener("submit", w), y[e + "Trigger"] = w;
    }
  }
  function c(o) {
    if (!o[e]) return;
    const y = n(o);
    for (const w of y.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of y.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete o[e];
  }
  function s(o, y, w, h, b) {
    if (Q(h, "ln-ajax:before-start", { method: o, url: y }).defaultPrevented) return;
    o === "GET" && d && d(), k(h, "ln-ajax:start", { method: o, url: y }), h.classList.add("ln-ajax--loading");
    const _ = document.createElement("span");
    _.className = "ln-ajax-spinner", h.appendChild(_);
    function g() {
      h.classList.remove("ln-ajax--loading");
      const C = h.querySelector(".ln-ajax-spinner");
      C && C.remove(), b && b();
    }
    let a = y;
    const v = document.querySelector('meta[name="csrf-token"]'), E = v ? v.getAttribute("content") : null;
    w instanceof FormData && E && w.append("_token", E);
    const A = {
      method: o,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (A.headers["X-CSRF-TOKEN"] = E), o === "GET" && w) {
      const C = new URLSearchParams(w);
      a = y + (y.includes("?") ? "&" : "?") + C.toString();
    } else o !== "GET" && w && (A.body = w);
    let S = null;
    if (o === "GET") {
      const C = new AbortController();
      A.signal = C.signal, S = function() {
        d = null, C.abort(), g(), k(h, "ln-ajax:aborted", { method: o, url: a });
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
        k(h, "ln-ajax:success", { method: o, url: a, data: I });
      } else
        k(h, "ln-ajax:error", {
          method: o,
          url: a,
          status: L,
          data: I,
          error: q || null
        });
      g(), k(h, "ln-ajax:complete", { method: o, url: a });
    }).catch(function(C) {
      C && C.name === "AbortError" || (S && d === S && (d = null), k(h, "ln-ajax:error", { method: o, url: a, status: 0, data: null, error: C }), g(), k(h, "ln-ajax:complete", { method: o, url: a }));
    });
  }
  function n(o) {
    const y = { links: [], forms: [] };
    return o.tagName === "A" && o.getAttribute(t) !== "false" ? y.links.push(o) : o.tagName === "FORM" && o.getAttribute(t) !== "false" ? y.forms.push(o) : (y.links = Array.from(o.querySelectorAll('a:not([data-ln-ajax="false"])')), y.forms = Array.from(o.querySelectorAll('form:not([data-ln-ajax="false"])'))), y;
  }
  function f() {
    ct(function() {
      te({
        onInit: function(o) {
          if (u(o), !o.hasAttribute(t)) {
            for (const w of o.querySelectorAll("[" + t + "]"))
              u(w);
            const y = o.closest && o.closest("[" + t + "]");
            if (y && y.getAttribute(t) !== "false") {
              const w = n(o);
              m(w.links), l(w.forms);
            }
          }
        }
      }), Nt([t], function(o) {
        u(o);
      });
    }, "ln-ajax");
  }
  function p() {
    for (const o of document.querySelectorAll("[" + t + "]"))
      u(o);
  }
  window[e] = u, window[e].destroy = c, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
function ur(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: d = null } = {}) {
  const u = i ? !d : !t.some((n) => n.match), m = [], l = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const f = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !f && n.targetEl && m.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || l.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  l.sort((n, f) => n.regionKey === "__primary__" ? -1 : f.regionKey === "__primary__" ? 1 : 0);
  const s = l.find((n) => n.regionKey === "__primary__") || l[0] || null;
  return { notFound: u, clears: m, swaps: l, owner: s };
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
function Yn(t, e) {
  const i = Yt(e);
  if (!i) return t || "/";
  const d = t || "/", u = d.indexOf("#"), m = u !== -1 ? d.slice(0, u) : d, l = u !== -1 ? d.slice(u) : "", c = m.indexOf("?"), s = c !== -1 ? m.slice(0, c) : m, n = c !== -1 ? m.slice(c) : "";
  let f;
  if (s === i)
    f = i + "/";
  else if (s.startsWith(i + "/"))
    f = s;
  else {
    const p = s.startsWith("/") ? s : "/" + s;
    f = p === "/" ? i + "/" : i + p;
  }
  return f + n + l;
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
const Xn = {
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
    return Yn(t, Ce());
  },
  current: function() {
    return de === null ? null : {
      path: de,
      fullPath: ti,
      base: ei,
      params: ni,
      query: ii,
      route: ri,
      regions: Zn
    };
  }
}, je = "data-ln-route", Jn = "lnRoute";
typeof window < "u" && (window.lnRouter = Xn);
function _e(t) {
  ci(t), li(t), _t.size > 0 && ai();
}
const hr = {
  "data-ln-route": { effect: _e, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: _e, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: _e, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, _t = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new WeakMap();
let Zn = /* @__PURE__ */ new Map(), rn = !1, de = null, ti = null, ei = "", ni = {}, ii = {}, ri = null, Te = !1;
function on(t, e, i) {
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
  const u = {};
  if (d) {
    const c = new URLSearchParams(d);
    for (const [s, n] of c.entries())
      u[s] = n;
  }
  const m = Ce();
  return { path: fr(i, m), query: u, base: m };
}
function oi(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, d = e.segments, u = Math.max(i.length, d.length);
  for (let m = 0; m < u; m++) {
    const l = i[m], c = d[m];
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
function si(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const d of e) {
    if (d.pattern === "*")
      return {
        route: d,
        params: { wildcard: t }
      };
    const u = d.segments, m = {};
    let l = !0;
    if (!(i.length > u.length && u[u.length - 1] !== "*")) {
      for (let c = 0; c < u.length; c++) {
        const s = u[c], n = i[c];
        if (s === "*") {
          m.wildcard = i.slice(c).join("/");
          break;
        }
        if (n === void 0) {
          l = !1;
          break;
        }
        if (s.startsWith(":"))
          m[s.slice(1)] = decodeURIComponent(n);
        else if (s !== n) {
          l = !1;
          break;
        }
      }
      if (l && (u.indexOf("*") !== -1 || i.length <= u.length))
        return { route: d, params: m };
    }
  }
  return null;
}
function ke(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const u = document.getElementById(t);
    return !u && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), u;
  }
  const d = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !d && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), d;
}
function sn(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const u of i)
    for (const m of Object.keys(u))
      if (m.startsWith("ln") && u[m] && typeof u[m].destroy == "function")
        try {
          u[m].destroy();
        } catch (l) {
          console.error(`[ln-router] Error destroying component ${m} on element:`, u, l);
        }
  const d = document.querySelectorAll('[data-ln-popover="open"]');
  for (const u of d) {
    const m = u.lnPopover;
    if (m && m.trigger && t.contains(m.trigger))
      try {
        m.destroy();
      } catch (l) {
        console.error("[ln-router] Error destroying open popover:", l);
      }
  }
}
function Jt(t, e = {}) {
  const { path: i, query: d, base: u } = We(t), m = Yn(t, u), l = /* @__PURE__ */ new Map();
  for (const [w, h] of _t)
    l.set(w, si(i, h.sorted));
  const c = l.get("__primary__") || null, s = ke("__primary__", { warn: !!c }), n = _t.has("__primary__"), f = [];
  for (const [w, h] of l) {
    const b = w === "__primary__" ? s : ke(w, { warn: !1 }), r = !b && !!(c && c.route && c.route.templateNode && c.route.templateNode.content && c.route.templateNode.content.querySelector("#" + CSS.escape(w)));
    !b && !r && h && console.warn(`[ln-router] Explicit target element #${w} not found in DOM`), f.push({
      regionKey: w,
      match: h,
      targetEl: b,
      isPending: r,
      hasKeep: !!b && b.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!b && b.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!b && b.children.length > 0,
      mountedTemplate: b && be.get(b) || null
    });
  }
  const p = ur(f, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: c
  });
  if (p.notFound) {
    on(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Q(s || document.body, "ln-router:before-navigate", {
    from: de,
    to: m,
    path: i,
    params: c ? c.params : {},
    query: d
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", m) : e.historyAction === "replace" && window.history.replaceState(null, "", m);
  const y = function() {
    for (const w of p.clears)
      sn(w.targetEl), w.targetEl.replaceChildren(), be.delete(w.targetEl);
    for (const w of p.swaps) {
      if ((w.isPending || !w.targetEl || !document.contains(w.targetEl)) && (w.targetEl = w.regionKey === "__primary__" ? s : document.getElementById(w.regionKey)), !w.targetEl) {
        console.warn(`[ln-router] Target element #${w.regionKey} could not be resolved`);
        continue;
      }
      if (w.skipMount || (sn(w.targetEl), w.targetEl.replaceChildren(w.match.route.templateNode.content.cloneNode(!0))), be.set(w.targetEl, w.match.route.templateNode), p.owner && w.regionKey === p.owner.regionKey) {
        if (w.match.route.title) {
          let h = w.match.route.title;
          if (w.match.params)
            for (const [b, r] of Object.entries(w.match.params))
              h = h.replace(new RegExp("\\{\\{\\s*" + b + "\\s*\\}\\}", "g"), r);
          document.title = h;
        }
        if (!e.isHydration) {
          w.targetEl.hasAttribute("tabindex") || w.targetEl.setAttribute("tabindex", "-1");
          const h = w.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          h ? (h.setAttribute("tabindex", "-1"), h.focus()) : w.targetEl.focus(), w.regionKey === "__primary__" && w.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      on(w.targetEl, "ln-router:navigated", {
        path: i,
        fullPath: m,
        base: u,
        params: w.match.params,
        query: d,
        route: w.match.route,
        target: w.targetEl,
        region: w.regionKey
      });
    }
    de = i, ti = m, ei = u, ii = d, ri = c ? c.route : null, ni = c ? c.params : {}, Zn = new Map(
      Array.from(l.entries()).map(([w, h]) => [w, h ? { route: h.route, params: h.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(y) : y();
}
function pr(t) {
  const e = t.target.closest("a");
  if (!e || !En(t, e)) return;
  const i = e.getAttribute("href"), { path: d } = We(i);
  for (const u of _t.values())
    if (si(d, u.sorted)) {
      t.preventDefault(), Jt(i, { historyAction: "push" });
      return;
    }
}
function mr(t, e) {
  const i = Object.keys(t), d = Object.keys(e);
  if (i.length !== d.length) return !1;
  for (let u = 0; u < i.length; u++) {
    const m = i[u];
    if (t[m] !== e[m]) return !1;
  }
  return !0;
}
function gr() {
  const t = window.location.pathname + window.location.search, e = Xn.current();
  if (e && e.path != null) {
    const i = We(t);
    if (e.path === i.path && mr(e.query, i.query))
      return;
  }
  Jt(t, { historyAction: "skip" });
}
function ai() {
  rn || (rn = !0, ct(function() {
    document.addEventListener("click", pr), window.addEventListener("popstate", gr), Te = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Jt(t, { historyAction: "replace", isHydration: !0 }), Te = !1;
  }, "ln-router"));
}
function li(t) {
  const e = t.getAttribute(je);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const d = i || "__primary__";
  _t.has(d) || _t.set(d, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const u = _t.get(d);
  if (u.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${d}"`);
    return;
  }
  const m = t.getAttribute("data-ln-route-title"), l = e.split("/").filter(Boolean), c = {
    pattern: e,
    segments: l,
    target: i,
    title: m,
    templateNode: t
  }, s = ke(d);
  s && s.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), u.routes.set(e, c), u.sorted = Array.from(u.routes.values()).sort(oi);
}
function ci(t) {
  const e = t.getAttribute(je);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null || "__primary__", u = _t.get(d);
  u && (u.routes.delete(e), u.sorted = Array.from(u.routes.values()).sort(oi), u.routes.size === 0 && _t.delete(d));
}
function di(t) {
  return this.dom = t, li(t), this;
}
di.prototype.destroy = function() {
  ci(this.dom), delete this.dom[Jn];
};
H(je, Jn, di, "ln-router", {
  attributes: hr,
  onInit: function() {
    _t.size > 0 && ai();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", i = "data-ln-modal-for", d = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: f,
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
  }, m = /* @__PURE__ */ new Set();
  let l = null;
  function c() {
    l || (l = function(p) {
      if (De(p)) return;
      const o = p.target.closest("[" + i + "]");
      if (!o || Re(o)) return;
      const y = o.getAttribute(i);
      if (!y) return;
      const w = document.getElementById(y);
      !w || !w[e] || (p.preventDefault(), o.hasAttribute("data-ln-modal-mode") ? w.setAttribute("data-ln-modal-mode", o.getAttribute("data-ln-modal-mode")) : w.hasAttribute("data-ln-modal-mode") && w.setAttribute("data-ln-modal-mode", "new"), w.setAttribute(t, "open"));
    }, document.addEventListener("click", l));
  }
  function s() {
    m.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function n(p) {
    this.dom = p, this.isOpen = p.getAttribute(t) === "open";
    const o = this;
    return this._onRequestOpen = function() {
      o.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      o.dom.setAttribute(t, "close");
    }, this._onCancel = function(y) {
      y.preventDefault(), o.dom.setAttribute(t, "close");
    }, this._onClose = function() {
      !o.isOpen || o.dom.getAttribute(t) !== "open" || o.dom.open || (o._isNativeClosing = !0, o.dom.setAttribute(t, "close"));
    }, this._onClickClose = function(y) {
      const w = y.target.closest("[" + d + "]");
      w && o.dom.contains(w) && (y.preventDefault(), o.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), m.add(this), c(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), k(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const p = this.dom.getAttribute(t);
    this.dom.setAttribute(t, p === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), m.delete(this), s(), this.isOpen) {
        const p = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(y) {
            return y !== p;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function f(p) {
    const o = p[e];
    if (!o) return;
    const y = !!o._isNativeClosing;
    o._isNativeClosing = !1;
    const h = p.getAttribute(t) === "open";
    if (h === o.isOpen) {
      h && p.isConnected && !p.open && typeof p.showModal == "function" && p.showModal();
      return;
    }
    if (h) {
      if (Q(p, "ln-modal:before-open", { modalId: p.id, target: p }).defaultPrevented) {
        p.setAttribute(t, "close");
        return;
      }
      o.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof p.showModal == "function" && p.showModal();
      const r = p.querySelector("[autofocus]");
      if (r && Gt(r))
        r.focus();
      else {
        const _ = p.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), g = Array.prototype.find.call(_, Gt);
        if (g) g.focus();
        else {
          const a = p.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(a, Gt);
          v && v.focus();
        }
      }
      k(p, "ln-modal:open", { modalId: p.id, target: p });
    } else {
      if (!y && Q(p, "ln-modal:before-close", { modalId: p.id, target: p }).defaultPrevented) {
        p.setAttribute(t, "open");
        return;
      }
      o.isOpen = !1, p.hasAttribute("data-ln-modal-mode") && p.setAttribute("data-ln-modal-mode", "new"), typeof p.close == "function" && p.open && p.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), k(p, "ln-modal:close", { modalId: p.id, target: p });
    }
  }
  H(t, e, n, "ln-modal", {
    attributes: u
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
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const l = m.target.closest('a[href^="#"]');
    if (!l) return;
    const c = l.getAttribute("href"), s = Xt(c);
    for (const n in s) {
      const f = document.getElementById(n);
      if (f && f.lnModal) {
        if (!ze(m)) return;
        gt(n, s[n]), f.lnModal.isOpen || k(f, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function d() {
    const m = location.hash;
    if (!m) return;
    const l = Xt(m);
    for (const c in l) {
      const s = document.getElementById(c);
      s && s.lnModal && !s.lnModal.isOpen && k(s, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", d), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d(), document.addEventListener("ln-modal:close", function(m) {
    const l = m.target;
    l && l.id && st(l.id) !== null && gt(l.id, null);
  }), document.addEventListener("ln-ajax:success", function(m) {
    const c = (m.detail || {}).data;
    if (c && c.message) {
      const n = c.message;
      k(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const s = m.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && st(s.id) !== null && gt(s.id, null), k(s, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(m) {
    const c = (m.detail || {}).data;
    if (c && c.message) {
      const s = c.message;
      k(window, "ln-toast:enqueue", {
        type: s.type || "error",
        title: s.title || "",
        message: typeof s == "string" ? s : s.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(m) {
    const l = m.detail || {};
    l.message && k(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: l.message
    });
  });
  function u(m) {
    return this.dom = m, this;
  }
  u.prototype.destroy = function() {
    delete this.dom[e];
  }, H(t, e, u, "ln-ui-coordinator", {
    attributes: i
  });
})();
function _r(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, d = 0;
  for (let u = 0; u < t.length && i > 0; u++)
    d = u + 1, /[0-9]/.test(t[u]) && i--;
  return i > 0 && (d = t.length), d;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(n) {
    const f = n[e];
    f && (f.isTextElement ? f._initTextElement() : isNaN(f.value) || f._displayFormatted(f.value));
  }
  const d = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"), m = /* @__PURE__ */ new Set();
  let l = !1;
  function c() {
    ue(), !l && (l = !0, document.addEventListener("ln-core:locale-change", function() {
      m.forEach(function(n) {
        n.isTextElement ? n._formatTextContent() : isNaN(n.value) || n._displayFormatted(n.value);
      });
    }));
  }
  function s(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const f = this;
    if (m.add(this), c(), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const p = document.createElement("input");
    p.type = "hidden", p.name = n.name, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && p.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", p), this._hidden = p, Object.defineProperty(p, "value", {
      get: function() {
        return u.get.call(p);
      },
      set: function(y) {
        if (u.set.call(p, y), y !== "" && !isNaN(parseFloat(y))) {
          const w = f.dom.getAttribute("data-ln-number-decimals");
          f._setDisplayRaw(rt(parseFloat(y), J(f.dom), { maxDecimals: w }));
        } else
          f._setDisplayRaw("");
        f.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Me(n, u, {
      get: function() {
        return u.get.call(n);
      },
      set: function(y) {
        if (y === "") {
          f._setDisplayRaw(""), f._setHiddenRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const w = typeof y == "number" ? y : parseFloat(String(y));
        if (isNaN(w))
          f._setDisplayRaw(String(y)), f._setHiddenRaw("");
        else {
          f._setHiddenRaw(w);
          const h = n.getAttribute("data-ln-number-decimals");
          f._setDisplayRaw(rt(w, J(n), { maxDecimals: h }));
        }
        n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      f._handleInput();
    }, n.addEventListener("input", this._onInput), this._onKeyDown = function(y) {
      if (y.key !== "Backspace") return;
      const w = n.selectionStart, h = n.selectionEnd;
      if (w !== h || w === 0) return;
      const b = ce(J(n)), r = u.get.call(n), _ = r[w - 1];
      if (_ === b.groupSep || /\s/.test(_)) {
        y.preventDefault();
        const g = w - 2 >= 0 ? w - 2 : 0, a = r.slice(0, g) + r.slice(w);
        u.set.call(n, a), n.setSelectionRange(g, g), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, n.addEventListener("keydown", this._onKeyDown), this._onPaste = function(y) {
      y.preventDefault();
      const w = (y.clipboardData || window.clipboardData).getData("text"), h = nr(w, J(n));
      f.value = isNaN(h) ? NaN : h;
    }, n.addEventListener("paste", this._onPaste);
    const o = n.value;
    if (o !== "") {
      const y = parseFloat(o);
      if (!isNaN(y)) {
        const w = n.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(y), this._setDisplayRaw(rt(y, J(n), { maxDecimals: w })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return n.form && (this._onFormReset = function() {
      setTimeout(function() {
        const y = n.defaultValue;
        if (y !== "") {
          const w = parseFloat(y);
          if (!isNaN(w)) {
            const h = n.getAttribute("data-ln-number-decimals");
            f._setHiddenRaw(w), f._setDisplayRaw(rt(w, J(n), { maxDecimals: h })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
            return;
          }
        }
        f._setHiddenRaw(""), f._setDisplayRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }, 0);
    }, n.form.addEventListener("reset", this._onFormReset)), this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom;
    let f = n.getAttribute("data-ln-value"), p = n.getAttribute("data-ln-number"), o = null;
    f !== null && f !== "" ? o = f : p !== null && p !== "" && p !== "true" ? o = p : o = n.textContent.trim();
    const y = parseFloat(o);
    isNaN(y) ? this._rawValue = null : (this._rawValue = y, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", String(y)), this._formatTextContent());
  }, s.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const n = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = rt(this._rawValue, J(this.dom), { maxDecimals: n });
    }
  }, s.prototype._handleInput = function() {
    const n = this.dom, f = u.get.call(n);
    if (f === "") {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (f === "-") {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const p = n.selectionStart;
    let o = 0;
    for (let S = 0; S < p; S++)
      /[0-9]/.test(f[S]) && o++;
    const y = J(n), w = ce(y);
    let h = f, b = Gn(f, w.groupSep, w.decimalSep), r = parseFloat(b);
    if (isNaN(r)) {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: f });
      return;
    }
    const _ = n.getAttribute("data-ln-number-decimals"), g = b.indexOf(".");
    if (_ !== null && g !== -1) {
      const S = parseInt(_, 10), C = b.slice(g + 1);
      if (S === 0)
        b = b.slice(0, g), h = h.split(w.decimalSep)[0], r = parseFloat(b), this._setDisplayRaw(h);
      else if (C.length > S) {
        b = b.slice(0, g + 1 + S);
        const L = h.split(w.decimalSep);
        h = L[0] + w.decimalSep + L[1].slice(0, S), r = parseFloat(b), this._setDisplayRaw(h);
      }
    }
    const a = n.getAttribute("data-ln-number-max");
    if (a !== null && r > parseFloat(a)) {
      const S = parseFloat(a), C = rt(S, y, { maxDecimals: _ });
      this._setDisplayRaw(C), this._setHiddenRaw(S), n.setSelectionRange(C.length, C.length), k(n, "ln-number:input", { value: S, formatted: C });
      return;
    }
    if (h.endsWith(w.decimalSep) || w.decimalSep !== "." && h.endsWith(".")) {
      this._setHiddenRaw(r), k(n, "ln-number:input", { value: r, formatted: h });
      return;
    }
    const v = b.indexOf(".");
    if (v !== -1 && b.slice(v + 1).endsWith("0")) {
      this._setHiddenRaw(r), k(n, "ln-number:input", { value: r, formatted: h });
      return;
    }
    let E;
    if (_ !== null)
      E = rt(r, y, { maxDecimals: _ });
    else {
      const S = v !== -1 ? b.slice(v + 1).length : 0;
      E = rt(r, y, { userDecimals: S });
    }
    this._setDisplayRaw(E);
    const A = _r(E, o);
    n.setSelectionRange(A, A), this._setHiddenRaw(r), k(n, "ln-number:input", { value: r, formatted: E });
  }, s.prototype._setHiddenRaw = function(n) {
    this._hidden && u.set.call(this._hidden, String(n));
  }, s.prototype._setDisplayRaw = function(n) {
    this.isTextElement ? this.dom.textContent = String(n) : u.set.call(this.dom, String(n));
  }, s.prototype._displayFormatted = function(n) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const f = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(n, J(this.dom), { maxDecimals: f }));
    }
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const n = u.get.call(this._hidden);
      return n === "" ? NaN : parseFloat(n);
    },
    set: function(n) {
      const f = typeof n == "number" ? n : parseFloat(n);
      if (this.isTextElement) {
        isNaN(f) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = f, this.dom.setAttribute("data-ln-value", String(f)), this._formatTextContent());
        return;
      }
      if (isNaN(f)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(f);
      const p = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(f, J(this.dom), { maxDecimals: p })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : u.get.call(this.dom);
    }
  }), s.prototype.destroy = function() {
    this.dom[e] && (m.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this._onFormReset && this.dom.form && this.dom.form.removeEventListener("reset", this._onFormReset), this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
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
  const u = [];
  for (let n = 0; n < 3; n++) {
    const f = parseInt(d[n], 10);
    if (isNaN(f)) return null;
    u.push(f);
  }
  let m, l, c;
  i === "." ? (m = u[0], l = u[1], c = u[2]) : i === "/" ? (l = u[0], m = u[1], c = u[2]) : d[0].length === 4 ? (c = u[0], l = u[1], m = u[2]) : (m = u[0], l = u[1], c = u[2]), c < 100 && (c += c < 50 ? 2e3 : 1900);
  const s = new Date(c, l - 1, m);
  return s.getFullYear() !== c || s.getMonth() !== l - 1 || s.getDate() !== m ? null : s;
}
function ye(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const u = t.getDate(), m = t.getMonth(), l = t.getFullYear(), c = t.getHours(), s = t.getMinutes();
  let n, f;
  const p = (i || "").toLowerCase().split("-")[0];
  let o = !1;
  try {
    const h = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    o = !!(d && h !== p);
  } catch {
    o = !!d;
  }
  if (o && d && d.monthsLong)
    n = d.monthsLong[m];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(m + 1);
    }
  if (o && d && d.monthsShort)
    f = d.monthsShort[m];
  else
    try {
      f = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      f = String(m + 1);
    }
  const y = {
    yyyy: String(l),
    yy: String(l).slice(-2),
    MMMM: n,
    MMM: f,
    MM: String(m + 1).padStart(2, "0"),
    M: String(m + 1),
    dd: String(u).padStart(2, "0"),
    d: String(u),
    HH: String(c).padStart(2, "0"),
    mm: String(s).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(w) {
    return y[w] !== void 0 ? y[w] : w;
  });
}
function ne(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const u = yr(e);
  if (u)
    try {
      const m = new Intl.DateTimeFormat(i, u), l = (i || "").toLowerCase().split("-")[0], c = m.resolvedOptions().locale.toLowerCase().split("-")[0];
      return d && c !== l ? ye(t, "dd.MM.yyyy", i, d) : m.format(t);
    } catch {
      return ye(t, "dd.MM.yyyy", i, d);
    }
  return ye(t, e || "dd.MM.yyyy", i, d);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(o) {
    const y = o[e];
    if (y) {
      if (y.isTextElement)
        y._initTextElement();
      else if (y.value) {
        const w = it(y.value);
        w && y._displayFormatted(w);
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
  }, u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(o, y, w) {
    k(o.dom, "ln-date:change", {
      value: y,
      formatted: o.dom.value,
      date: w
    }), o.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function l(o, y, w, h) {
    o._setHiddenRaw(y), u.set.call(o._picker, y), o._lastISO = y, h !== void 0 ? (o._isFormatting = !0, o.dom.value = h, o._isFormatting = !1) : w && o._displayFormatted(w), m(o, y, w);
  }
  function c(o) {
    o._setHiddenRaw(""), u.set.call(o._picker, ""), o._isFormatting = !0, o.dom.value = "", o._isFormatting = !1, o._lastISO = "", m(o, "", null);
  }
  const s = /* @__PURE__ */ new Set();
  let n = !1;
  function f() {
    ue(), !n && (n = !0, document.addEventListener("ln-core:locale-change", function() {
      s.forEach(function(o) {
        if (o.isTextElement)
          o._formatTextContent();
        else if (o.value) {
          const y = it(o.value);
          y && o._displayFormatted(y);
        }
      });
    }));
  }
  function p(o) {
    if (o[e]) return o[e];
    o[e] = this, this.dom = o;
    const y = this;
    if (s.add(this), f(), o.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const w = o.value, h = o.name, b = o.closest(".form-element, form") || o.parentNode;
    if (b) {
      const E = b.querySelectorAll("[data-ln-date-dict]");
      for (let A = 0; A < E.length; A++) {
        const S = E[A].getAttribute("data-ln-date-dict");
        if (S) {
          const C = Ln(E[A], "data-ln-date-dict-key");
          C["months-long"] && (C.monthsLong = C["months-long"].split(",").map((L) => L.trim())), C["months-short"] && (C.monthsShort = C["months-short"].split(",").map((L) => L.trim())), kn(S, C);
        }
      }
    }
    const r = document.createElement("span");
    r.setAttribute("data-ln-date-field", ""), o.parentNode.insertBefore(r, o), r.appendChild(o), this._wrapper = r;
    const _ = document.createElement("input");
    _.type = "hidden", _.name = h, o.removeAttribute("name"), o.hasAttribute("data-ln-fill-as") && _.setAttribute("data-ln-fill-as", o.getAttribute("data-ln-fill-as")), o.insertAdjacentElement("afterend", _), this._hidden = _;
    const g = document.createElement("input");
    g.type = "date", g.tabIndex = -1, g.setAttribute("tabindex", "-1"), g.setAttribute("aria-hidden", "true"), g.setAttribute("aria-label", o.getAttribute("data-ln-date-label") || "Date picker"), g.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", _.insertAdjacentElement("afterend", g), this._picker = g, o.type = "text";
    const a = document.createElement("button");
    a.type = "button", a.setAttribute("aria-label", o.getAttribute("data-ln-date-label") || "Open date picker"), a.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', g.insertAdjacentElement("afterend", a), this._btn = a, this._lastISO = "", Object.defineProperty(_, "value", {
      get: function() {
        return u.get.call(_);
      },
      set: function(E) {
        if (u.set.call(_, E), E && E !== "") {
          const A = it(E);
          A && l(y, E, A);
        } else E === "" && c(y);
      }
    }), Me(o, u, {
      get: function() {
        return u.get.call(o);
      },
      set: function(E, A) {
        if (y._isFormatting) {
          A(E);
          return;
        }
        if (!E || E === "") {
          A(""), c(y);
          return;
        }
        const S = it(E) || jt(E);
        if (S) {
          const C = Ft(S), L = o.getAttribute(t) || "", I = J(o), q = Rt(I), D = ne(S, L, I, q);
          A(D), l(y, C, S, D);
        } else
          A(String(E)), c(y);
      }
    }), this._onPickerChange = function() {
      const E = g.value;
      if (E) {
        const A = it(E);
        A && l(y, E, A);
      } else
        c(y);
    }, g.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const E = y.dom.value.trim();
      if (E === "") {
        y._lastISO !== "" && c(y);
        return;
      }
      if (y._lastISO) {
        const S = it(y._lastISO);
        if (S) {
          const C = y.dom.getAttribute(t) || "", L = J(y.dom), I = Rt(L);
          if (E === ne(S, C, L, I)) return;
        }
      }
      const A = jt(E);
      if (A) {
        const S = Ft(A);
        l(y, S, A);
      } else if (y._lastISO) {
        const S = it(y._lastISO);
        S && y._displayFormatted(S);
      } else
        y.dom.value = "";
    }, o.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      y._openPicker();
    }, a.addEventListener("click", this._onBtnClick);
    const v = o.form;
    if (v && (this._form = v, this._onFormReset = function() {
      setTimeout(function() {
        const E = y.dom.value;
        if (E) {
          const A = it(E) || jt(E);
          if (A) {
            const S = Ft(A);
            l(y, S, A);
            return;
          }
        }
        c(y);
      }, 0);
    }, v.addEventListener("reset", this._onFormReset)), w && w !== "") {
      const E = it(w);
      E && l(y, w, E);
    }
    return this;
  }
  p.prototype._initTextElement = function() {
    const o = this.dom, y = o.getAttribute("data-ln-value"), w = o.getAttribute("data-ln-date"), h = o.getAttribute("datetime");
    let b = null;
    o.tagName === "TIME" && h !== null && h !== "" ? b = h : y !== null && y !== "" ? b = y : h !== null && h !== "" ? b = h : w !== null && w !== "" && w !== "true" && !Le.test(w) ? b = w : b = o.textContent.trim();
    const r = it(b) || jt(b);
    if (r && !isNaN(r.getTime())) {
      const _ = Ft(r);
      this._rawValue = _, o.tagName !== "TIME" && !o.hasAttribute("data-ln-value") && o.setAttribute("data-ln-value", _), this._formatTextContent();
    } else
      this._rawValue = null;
  }, p.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const o = it(this._rawValue);
      if (o) {
        let w = this.dom.getAttribute("data-ln-date-format");
        if (!w) {
          const r = this.dom.getAttribute("data-ln-date");
          r && Le.test(r) && (w = r);
        }
        const h = J(this.dom), b = Rt(h);
        this.dom.textContent = ne(o, w || "medium", h, b);
      }
    }
  }, p.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, p.prototype._setHiddenRaw = function(o) {
    u.set.call(this._hidden, o);
  }, p.prototype._displayFormatted = function(o) {
    const y = this.dom.getAttribute(t) || "", w = J(this.dom), h = Rt(w);
    this._isFormatting = !0, this.dom.value = ne(o, y, w, h), this._isFormatting = !1;
  }, Object.defineProperty(p.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : u.get.call(this._hidden);
    },
    set: function(o) {
      if (this.isTextElement) {
        if (!o || o === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const w = it(o) || jt(o);
        if (!w) return;
        const h = Ft(w);
        this._rawValue = h, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", h) : this.dom.setAttribute("data-ln-value", h), this._formatTextContent();
        return;
      }
      if (!o || o === "") {
        c(this);
        return;
      }
      const y = it(o);
      y && l(this, o, y);
    }
  }), Object.defineProperty(p.prototype, "date", {
    get: function() {
      const o = this.value;
      return o ? it(o) : null;
    },
    set: function(o) {
      if (!o || !(o instanceof Date) || isNaN(o.getTime())) {
        this.value = "";
        return;
      }
      this.value = Ft(o);
    }
  }), Object.defineProperty(p.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (s.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const o = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", o && (this.dom.value = o), delete this.dom[e];
  }, H(t, e, p, "ln-date", {
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
  function u(c) {
    return this.dom = c, Y(this, c, d), this.activeClass = c.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = null, this.update(), this;
  }
  u.prototype.update = function() {
    if (!this.activeClass || Q(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, f = m(n), p = [];
    for (const o of s) {
      const y = o.getAttribute("href");
      if (!y || y === "#" || y.startsWith("#") || y.startsWith("javascript:") || y.startsWith("mailto:") || y.startsWith("tel:")) {
        o.classList.remove(this.activeClass), o.removeAttribute("aria-current");
        continue;
      }
      if (o.hostname && o.hostname !== window.location.hostname) {
        o.classList.remove(this.activeClass), o.removeAttribute("aria-current");
        continue;
      }
      const w = m(y), h = w === f, b = !this.exact && w !== "/" && f.startsWith(w + "/");
      h || b ? (o.classList.add(this.activeClass), o.setAttribute("aria-current", "page"), p.push(o)) : (o.classList.remove(this.activeClass), o.removeAttribute("aria-current"));
    }
    k(this.dom, "ln-nav:update", { target: this.dom, activeLinks: p });
  }, u.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const c = history._lnNavCallbacks.indexOf(this.updateHandler);
    c !== -1 && history._lnNavCallbacks.splice(c, 1), delete this.dom[e];
  };
  function m(c) {
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
        const f = n.activeClass, p = c.getAttribute(t) || "active";
        if (f !== p) {
          const o = c.querySelectorAll("a");
          for (const y of o)
            f && y.classList.remove(f);
          n.activeClass = p;
        }
      }
      n.update();
    }
  }
  H(t, e, u, "ln-nav", {
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
  const u = /* @__PURE__ */ new Set();
  function m(l, c) {
    const s = window.lnCore && window.lnCore._attrRegistry, n = s && s.persist || [];
    let f = null;
    for (let w = 0; w < n.length; w++)
      if (n[w].selector === c) {
        f = n[w];
        break;
      }
    if (!f) return;
    const p = f.persist;
    if (u.has(p.attr) || (u.add(p.attr), Nt([p.attr], function(w, h) {
      if (!w.hasAttribute("data-ln-persist") || p.hashActive && p.hashActive(w)) return;
      const b = e(w, h);
      if (!b || !d()) return;
      const r = w.getAttribute(h);
      try {
        r === null ? localStorage.removeItem(b) : localStorage.setItem(b, r);
      } catch {
      }
    })), p.hashActive && p.hashActive(l)) return;
    const o = e(l, p.attr);
    if (!o || !d()) return;
    const y = localStorage.getItem(o);
    y !== null && l.setAttribute(p.attr, y);
  }
  Hi(m);
})();
function an(t, e, i, d) {
  const u = (t || "").toLowerCase().trim();
  if (u) return u;
  if ((e || "").toUpperCase() !== "A") return "";
  const m = i || "";
  if (!m.startsWith("#")) return "";
  const l = m.slice(1);
  if (!l) return "";
  const c = l.split("&"), s = (d || "").toLowerCase().trim();
  if (s)
    for (const p of c) {
      const o = p.indexOf(":");
      if (o > 0 && p.slice(0, o).toLowerCase().trim() === s)
        return p.slice(o + 1).toLowerCase().trim();
    }
  const n = c[c.length - 1] || "", f = n.indexOf(":");
  return (f > 0 ? n.slice(f + 1) : n).toLowerCase().trim();
}
function ln(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (m) => (m.tagName || "").toUpperCase() === "A" && (m.href || "").startsWith("#")
  ), d = i.length > 0 && i.length === t.length, u = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : d && !u ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: d && !!u,
    warning: null
  };
}
function cn(t, e, i) {
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
  const u = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: d, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, m = X(u);
  function l(s) {
    return this.dom = s, Y(this, s, m), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const s = this.tabs.map((p) => ({
      tagName: p.tagName,
      href: p.getAttribute("href")
    })), n = ln(s, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const p of this.tabs) {
      const o = an(p.getAttribute("data-ln-tab"), p.tagName, p.getAttribute("href"), this.nsKey);
      o ? this.mapTabs[o] = p : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', p);
    }
    for (const p of this.panels) {
      const o = (p.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      o && (this.mapPanels[o] = p);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const f = this;
    this._clickHandlers = [];
    for (const p of this.tabs) {
      if (p[e + "Trigger"]) continue;
      const o = function(y) {
        const w = p.tagName === "A";
        if (!w && (y.ctrlKey || y.metaKey || y.button === 1)) return;
        const h = an(p.getAttribute("data-ln-tab"), p.tagName, p.getAttribute("href"), f.nsKey);
        h && (w && !ze(y) || (f.hashEnabled ? st(f.nsKey) === h ? f.dom.setAttribute("data-ln-tabs-active", h) : gt(f.nsKey, h) : f.dom.setAttribute("data-ln-tabs-active", h)));
      };
      p.addEventListener("click", o), p[e + "Trigger"] = o, f._clickHandlers.push({ el: p, handler: o });
    }
    if (this._onRequestSelect = function(p) {
      const o = p.detail && (p.detail.key || p.detail.tab);
      o && f.select(o);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!f.hashEnabled) return;
      const p = st(f.nsKey);
      f.dom.setAttribute("data-ln-tabs-active", p !== null ? p : f.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const p = cn(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", p);
    }
  }
  l.prototype.select = function(s) {
    const n = (s + "").toLowerCase().trim();
    n && (this.hashEnabled ? st(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : gt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, l.prototype._applyActive = function(s) {
    var f;
    if (s = cn(s, Object.keys(this.mapPanels), this.defaultKey), s === this.activeKey) return;
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
    for (const p in this.mapTabs) {
      const o = this.mapTabs[p];
      p === s ? (o.hasAttribute("data-active") || o.setAttribute("data-active", ""), o.getAttribute("aria-selected") !== "true" && o.setAttribute("aria-selected", "true")) : (o.hasAttribute("data-active") && o.removeAttribute("data-active"), o.getAttribute("aria-selected") !== "false" && o.setAttribute("aria-selected", "false"));
    }
    for (const p in this.mapPanels) {
      const o = this.mapPanels[p], y = p === s;
      o.hidden !== !y && (o.hidden = !y), o.classList.contains("hidden") !== !y && o.classList.toggle("hidden", !y);
      const w = y ? "false" : "true";
      o.getAttribute("aria-hidden") !== w && o.setAttribute("aria-hidden", w);
    }
    if (this.autoFocus) {
      const p = (f = this.mapPanels[s]) == null ? void 0 : f.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      p && setTimeout(() => p.focus({ preventScroll: !0 }), 0);
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
    attributes: u,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(s) {
        const n = Array.from(s.querySelectorAll("[data-ln-tab]")).map(function(p) {
          return { tagName: p.tagName, href: p.getAttribute("href") };
        }), f = (s.getAttribute("data-ln-tabs-key") || s.id || "").toLowerCase().trim();
        return ln(n, f).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", d = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-toggle": { effect: o, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, m = /* @__PURE__ */ new Set();
  let l = null;
  function c(y, w) {
    return w === "open" ? "open" : w === "close" || y === "open" ? "close" : "open";
  }
  function s() {
    l || (l = function(y) {
      if (De(y)) return;
      const w = y.target.closest("[" + i + "]");
      if (!w || Re(w)) return;
      const h = w.getAttribute(i);
      if (!h) return;
      const b = document.getElementById(h);
      if (!b || !b[e]) return;
      y.preventDefault();
      const r = w.getAttribute(d) || "toggle", _ = b.getAttribute(t);
      b.setAttribute(t, c(_, r));
    }, document.addEventListener("click", l));
  }
  function n() {
    m.size > 0 || !l || (document.removeEventListener("click", l), l = null);
  }
  function f(y, w) {
    if (!y || !y.id) return;
    const h = document.querySelectorAll(
      "[" + i + '="' + y.id + '"]'
    );
    for (let b = 0; b < h.length; b++)
      h[b].setAttribute("aria-expanded", w ? "true" : "false");
  }
  function p(y) {
    this.dom = y;
    const w = this;
    return this._onRequestOpen = function() {
      w.open();
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function() {
      w.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = y.getAttribute(t) === "open", this.isOpen && y.classList.add("open"), f(y, this.isOpen), m.add(this), s(), this;
  }
  p.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, p.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, p.prototype.toggle = function() {
    const y = this.dom.getAttribute(t);
    this.dom.setAttribute(t, c(y, "toggle"));
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), m.delete(this), delete this.dom[e], n());
  };
  function o(y) {
    const w = y[e];
    if (!w) return;
    const b = y.getAttribute(t) === "open";
    if (b !== w.isOpen)
      if (b) {
        if (Q(y, "ln-toggle:before-open", { target: y }).defaultPrevented) {
          y.setAttribute(t, "close");
          return;
        }
        w.isOpen = !0, y.classList.add("open"), f(y, !0), k(y, "ln-toggle:open", { target: y });
      } else {
        if (Q(y, "ln-toggle:before-close", { target: y }).defaultPrevented) {
          y.setAttribute(t, "open");
          return;
        }
        w.isOpen = !1, y.classList.remove("open"), f(y, !1), k(y, "ln-toggle:close", { target: y });
      }
  }
  H(t, e, p, "ln-toggle", {
    attributes: u,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function d(u) {
    return this.dom = u, this._onToggleOpen = function(m) {
      if (!m.detail || !m.detail.target || m.detail.target.closest("[data-ln-accordion]") !== u) return;
      const l = u.querySelectorAll("[data-ln-toggle]");
      for (const c of l)
        c !== m.detail.target && c.closest("[data-ln-accordion]") === u && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      k(u, "ln-accordion:change", { target: m.detail.target });
    }, u.addEventListener("ln-toggle:open", this._onToggleOpen), this;
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
  }, u = X(d);
  function m(l) {
    this.dom = l, Y(this, l, u), this.toggleEl = l.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = l.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
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
      const f = c._getMenuItems();
      if (f.length === 0) return;
      if (!n && (s.key === "ArrowDown" || s.key === "ArrowUp")) {
        s.preventDefault(), c.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const o = c._getMenuItems();
          o.length > 0 && c._focusItem(o, s.key === "ArrowDown" ? 0 : o.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const p = f.indexOf(document.activeElement);
      if (s.key === "ArrowDown") {
        s.preventDefault();
        const o = p < f.length - 1 ? p + 1 : 0;
        c._focusItem(f, o);
      } else if (s.key === "ArrowUp") {
        s.preventDefault();
        const o = p > 0 ? p - 1 : f.length - 1;
        c._focusItem(f, o);
      } else s.key === "Home" ? (s.preventDefault(), c._focusItem(f, 0)) : s.key === "End" && (s.preventDefault(), c._focusItem(f, f.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(s) {
      !s.detail || s.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "true"), typeof c.toggleEl.showPopover == "function" && c.toggleEl.showPopover(), c._initMenuAria(), c._reposition(), c._addOutsideClickListener(), c._addScrollRepositionListener(), c._addResizeCloseListener(), k(l, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      !s.detail || s.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "false"), c._removeOutsideClickListener(), c._removeScrollRepositionListener(), c._removeResizeCloseListener(), c.toggleEl.style.top = "", c.toggleEl.style.left = "", c.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof c.toggleEl.hidePopover == "function" && c.toggleEl.matches(":popover-open") && c.toggleEl.hidePopover(), k(l, "ln-dropdown:close", { target: s.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  m.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const l = this.toggleEl.querySelectorAll("li");
    for (const s of l)
      s.setAttribute("role", "none");
    const c = this._getMenuItems();
    for (let s = 0; s < c.length; s++)
      c[s].setAttribute("role", "menuitem"), c[s].setAttribute("tabindex", s === 0 ? "0" : "-1");
  }, m.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, m.prototype._focusItem = function(l, c) {
    for (let s = 0; s < l.length; s++)
      l[s].setAttribute("tabindex", s === c ? "0" : "-1");
    l[c] && l[c].focus();
  }, m.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl || !document.contains(this.toggleEl)) return;
    const l = this.triggerBtn.getBoundingClientRect(), c = Se(this.toggleEl), s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, f = le(l, c, n, s), p = f.top + "px", o = f.left + "px";
    this.toggleEl.style.top !== p && (this.toggleEl.style.top = p), this.toggleEl.style.left !== o && (this.toggleEl.style.left = o), this.toggleEl.getAttribute("data-ln-dropdown-placement") !== f.placement && this.toggleEl.setAttribute("data-ln-dropdown-placement", f.placement);
  }, m.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const l = this;
    this._boundDocClick = function(c) {
      l.dom.contains(c.target) || l.toggleEl && l.toggleEl.contains(c.target) || l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open" && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, l._docClickTimeout = setTimeout(function() {
      l._docClickTimeout = null, document.addEventListener("click", l._boundDocClick);
    }, 0);
  }, m.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, m.prototype._addScrollRepositionListener = function() {
    const l = this;
    this._scrollRepositionRaf = null, this._boundScrollReposition = function() {
      l._scrollRepositionRaf || (l._scrollRepositionRaf = requestAnimationFrame(function() {
        l._scrollRepositionRaf = null, l._reposition();
      }));
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, m.prototype._removeScrollRepositionListener = function() {
    this._scrollRepositionRaf && (cancelAnimationFrame(this._scrollRepositionRaf), this._scrollRepositionRaf = null), this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, m.prototype._addResizeCloseListener = function() {
    const l = this;
    this._boundResizeClose = function() {
      l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open" && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, m.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), delete this.dom[e]);
  }, H(t, e, m, "ln-dropdown", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", d = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: p, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, m = [];
  let l = null;
  function c() {
    l || (l = function(o) {
      if (o.key !== "Escape" || m.length === 0) return;
      m[m.length - 1].close();
    }, document.addEventListener("keydown", l));
  }
  function s() {
    m.length > 0 || l && (document.removeEventListener("keydown", l), l = null);
  }
  function n(o) {
    this.dom = o, this.isOpen = o.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const y = this;
    return this._onRequestOpen = function(w) {
      const h = w.detail && w.detail.trigger ? w.detail.trigger : null;
      y.open(h);
    }, this._onRequestClose = function() {
      y.close();
    }, this._onRequestToggle = function(w) {
      const h = w.detail && w.detail.trigger ? w.detail.trigger : null;
      y.toggle(h);
    }, this._onNativeToggle = function(w) {
      w.newState === "closed" && y.isOpen && (y._applyClose(), y.dom.setAttribute(t, "closed"));
    }, o.addEventListener("ln-popover:request-open", this._onRequestOpen), o.addEventListener("ln-popover:request-close", this._onRequestClose), o.addEventListener("ln-popover:request-toggle", this._onRequestToggle), o.addEventListener("toggle", this._onNativeToggle), o.hasAttribute("tabindex") || o.setAttribute("tabindex", "-1"), o.hasAttribute("role") || o.setAttribute("role", "dialog"), o.hasAttribute("popover") || o.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(o) {
    this.isOpen || (this.trigger = o || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(o) {
    this.isOpen ? this.close() : this.open(o);
  }, n.prototype._applyOpen = function(o) {
    this.isOpen = !0, o && (this.trigger = o), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const y = Se(this.dom);
    if (this.trigger) {
      const r = this.trigger.getBoundingClientRect(), _ = this.dom.getAttribute(d) || "bottom", g = le(r, y, _, 8);
      this.dom.style.top = g.top + "px", this.dom.style.left = g.left + "px", this.dom.setAttribute("data-ln-popover-placement", g.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const w = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), h = Array.prototype.find.call(w, Gt);
    h ? h.focus() : this.dom.focus();
    const b = this;
    this._boundDocClick = function(r) {
      b.dom.contains(r.target) || b.trigger && b.trigger.contains(r.target) || b.close();
    }, b._docClickTimeout = setTimeout(function() {
      b._docClickTimeout = null, document.addEventListener("click", b._boundDocClick);
    }, 0), this._repositionRaf = null, this._performReposition = function() {
      if (!b.trigger || !document.contains(b.dom)) return;
      const r = b.trigger.getBoundingClientRect(), _ = Se(b.dom), g = b.dom.getAttribute(d) || "bottom", a = le(r, _, g, 8), v = a.top + "px", E = a.left + "px";
      b.dom.style.top !== v && (b.dom.style.top = v), b.dom.style.left !== E && (b.dom.style.left = E), b.dom.getAttribute("data-ln-popover-placement") !== a.placement && b.dom.setAttribute("data-ln-popover-placement", a.placement);
    }, this._boundReposition = function() {
      b._repositionRaf || (b._repositionRaf = requestAnimationFrame(function() {
        b._repositionRaf = null, b._performReposition();
      }));
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), m.push(this), c(), k(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const o = m.indexOf(this);
    o !== -1 && m.splice(o, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, k(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.dom.removeEventListener("toggle", this._onNativeToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function f(o) {
    this.dom = o;
    const y = o.getAttribute(i);
    return o.setAttribute("aria-haspopup", "dialog"), o.setAttribute("aria-expanded", "false"), o.setAttribute("aria-controls", y), this._onClick = function(w) {
      if (w.ctrlKey || w.metaKey || w.button === 1) return;
      w.preventDefault();
      const h = document.getElementById(y);
      if (!h) return;
      h[e] && (h[e].trigger = o);
      const b = h.getAttribute(t);
      h.setAttribute(t, b === "open" ? "closed" : "open");
    }, o.addEventListener("click", this._onClick), this;
  }
  f.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function p(o) {
    const y = o[e];
    if (!y) return;
    const h = o.getAttribute(t) === "open";
    if (h !== y.isOpen)
      if (h) {
        if (Q(o, "ln-popover:before-open", {
          popoverId: o.id,
          target: o,
          trigger: y.trigger
        }).defaultPrevented) {
          o.setAttribute(t, "closed");
          return;
        }
        y._applyOpen(y.trigger);
      } else {
        if (Q(o, "ln-popover:before-close", {
          popoverId: o.id,
          target: o,
          trigger: y.trigger
        }).defaultPrevented) {
          o.setAttribute(t, "open");
          return;
        }
        y._applyClose();
      }
  }
  H(t, e, n, "ln-popover", {
    attributes: u
  }), H(i, e + "Trigger", f, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", d = "lnTooltipEnhance", u = "ln-tooltip-portal";
  if (window[d] !== void 0) return;
  const m = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let l = 0, c = null, s = null, n = null, f = null, p = null, o = null;
  function y() {
    return c && c.parentNode || (c = document.getElementById(u), c || (c = document.createElement("div"), c.id = u, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function w() {
    o || (o = function(g) {
      g.key === "Escape" && r();
    }, document.addEventListener("keydown", o));
  }
  function h() {
    o && (document.removeEventListener("keydown", o), o = null);
  }
  function b(g) {
    if (n === g) return;
    r();
    const a = g.getAttribute(e) || g.getAttribute("title");
    if (!a) return;
    y(), typeof c.showPopover == "function" && c.showPopover(), g.hasAttribute("title") && (f = g.getAttribute("title"), g.removeAttribute("title"));
    const v = g.getAttribute("aria-describedby");
    v ? p = v : p = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = a, g[d + "Uid"] || (l += 1, g[d + "Uid"] = "ln-tooltip-" + l), E.id = g[d + "Uid"], c.appendChild(E);
    const A = E.offsetWidth, S = E.offsetHeight, C = g.getBoundingClientRect(), L = g.getAttribute(i) || "top", I = le(C, { width: A, height: S }, L, 6);
    E.style.top = I.top + "px", E.style.left = I.left + "px", E.setAttribute("data-ln-tooltip-placement", I.placement), p ? g.setAttribute("aria-describedby", p + " " + E.id) : g.setAttribute("aria-describedby", E.id), s = E, n = g, w();
  }
  function r() {
    if (!s) {
      h();
      return;
    }
    n && (p !== null ? n.setAttribute("aria-describedby", p) : n.removeAttribute("aria-describedby"), p = null, f !== null && n.setAttribute("title", f)), f = null, s.parentNode && s.parentNode.removeChild(s), s = null, n = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), h();
  }
  function _(g) {
    return this.dom = g, g.hasAttribute("data-ln-tooltip-enhanced") || (g.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      b(g);
    }, this._onLeave = function() {
      n === g && !g.contains(document.activeElement) && r();
    }, this._onFocus = function() {
      b(g);
    }, this._onBlur = function() {
      n === g && !g.matches(":hover") && r();
    }, g.addEventListener("mouseenter", this._onEnter), g.addEventListener("mouseleave", this._onLeave), g.addEventListener("focus", this._onFocus, !0), g.addEventListener("blur", this._onBlur, !0), this;
  }
  _.prototype.destroy = function() {
    const g = this.dom;
    g.removeEventListener("mouseenter", this._onEnter), g.removeEventListener("mouseleave", this._onLeave), g.removeEventListener("focus", this._onFocus, !0), g.removeEventListener("blur", this._onBlur, !0), n === g && r(), this._addedEnhancedAttr && g.removeAttribute("data-ln-tooltip-enhanced"), delete g[d], delete g[d + "Uid"];
  }, H(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    d,
    _,
    "ln-tooltip",
    {
      attributes: m
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
  }, u = X(d);
  function m(b) {
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
    this.dom = b, Y(this, b, u);
    const r = Array.from(b.querySelectorAll("[data-ln-toast-item]"));
    for (; r.length > this.max; ) b.removeChild(r.shift());
    for (const _ of r) y(_, this);
    return r.length > 0 && m(b), this;
  }
  c.prototype.enqueue = function(b) {
    if (!b) return;
    const r = s(b, this.dom);
    if (!r) return;
    const _ = Number.isFinite(b.timeout) ? b.timeout : this.timeoutDefault;
    f(this, r), _ > 0 && (r._timer = setTimeout(() => p(r), _));
  }, c.prototype.clear = function() {
    for (const b of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      p(b);
  }, c.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const b of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        p(b);
      l(this.dom), delete this.dom[e];
    }
  };
  function s(b, r) {
    const _ = ((b.type || "") + "").trim().toLowerCase(), g = Lt(r, i, "ln-toast");
    if (!g)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    ft(g, {
      type: _,
      title: b.title,
      message: typeof b.message == "string" ? b.message : void 0
    });
    const a = g.firstElementChild;
    if (!a) return null;
    a.hasAttribute("data-ln-toast-item") || a.setAttribute("data-ln-toast-item", ""), a.classList.add("ln-enter");
    const v = a.querySelector(".body");
    v && n(v, b);
    const E = a.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      p(a);
    }), a;
  }
  function n(b, r) {
    if (Array.isArray(r.message)) {
      const _ = document.createElement("ul");
      for (const g of r.message) {
        const a = document.createElement("li");
        a.textContent = g, _.appendChild(a);
      }
      b.appendChild(_);
    }
    if (r.data && r.data.errors) {
      const _ = document.createElement("ul");
      for (const g of Object.values(r.data.errors).flat()) {
        const a = document.createElement("li");
        a.textContent = g, _.appendChild(a);
      }
      b.appendChild(_);
    }
  }
  function f(b, r) {
    const _ = Array.from(b.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; _.length >= b.max && _.length > 0; ) b.dom.removeChild(_.shift());
    b.dom.appendChild(r), m(b.dom), requestAnimationFrame(() => r.classList.remove("ln-enter"));
  }
  function p(b) {
    if (!b || !b.parentNode) return;
    const r = b.parentNode;
    clearTimeout(b._timer), b.classList.remove("ln-enter"), b.classList.add("ln-out"), setTimeout(() => {
      b.parentNode && (b.parentNode.removeChild(b), l(r));
    }, 200);
  }
  function o(b) {
    let r = b && b.container;
    return typeof r == "string" && (r = document.querySelector(r)), r instanceof HTMLElement || (r = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), r || null;
  }
  function y(b, r) {
    if (b._lnToastHydrated) return;
    b._lnToastHydrated = !0;
    const _ = b.querySelector("[data-ln-toast-close]");
    _ && _.addEventListener("click", function() {
      p(b);
    });
    const g = +(b.getAttribute("data-ln-toast-timeout") ?? r.timeoutDefault);
    g > 0 && (b._timer = setTimeout(function() {
      p(b);
    }, g));
  }
  function w(b) {
    const r = b.detail || {}, _ = o(r);
    if (!_) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (_[e] || (_[e] = new c(_))).enqueue(r);
  }
  function h(b) {
    const r = b && b.detail || {};
    if (r.container) {
      const _ = o(r);
      _ && (_[e] || (_[e] = new c(_))).clear();
    } else {
      const _ = document.querySelectorAll("[" + t + "]");
      for (const g of Array.from(_))
        (g[e] || (g[e] = new c(g))).clear();
    }
  }
  ct(function() {
    window.addEventListener("ln-toast:enqueue", w), window.addEventListener("ln-toast:clear", h), window.addEventListener("ln-modal:open", function() {
      const b = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const r of Array.from(b))
        r.querySelectorAll("[data-ln-toast-item]").length > 0 && m(r);
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
function ui(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function wr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = ui(t.name), d = String(t.type || "").toLowerCase();
  return e.some((u) => {
    if (u.includes("/")) {
      if (u.endsWith("/*")) {
        const m = u.slice(0, -1);
        return d.startsWith(m);
      }
      return d === u;
    }
    return i === u;
  });
}
function Er(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const d = 1024, u = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], m = Math.floor(Math.log(t) / Math.log(d)), l = Math.min(m, u.length - 1), c = t / Math.pow(d, l);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(c) + " " + u[l];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", d = "file_ids[]";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-upload": { prop: "uploadUrl", read: K, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: K, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: K, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: K, type: "string", fallback: d, description: "Form field name for submitting uploaded file IDs" },
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
  }, m = X(u);
  function l(n, f, p) {
    return Er(n, f, p);
  }
  function c() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function s(n) {
    this.dom = n, Y(this, n, m), this.dict = Ln(n, "data-ln-upload-dict"), this.locale = J(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const f = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = vr(f), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  s.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const f = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let o = 0; o < f.length; o++) {
      const y = f[o], w = y.getAttribute("data-ln-upload-id"), h = "file-" + ++n.fileIdCounter;
      y.setAttribute("data-ln-upload-local-id", h);
      const b = y.querySelector('[data-ln-field="name"]'), r = y.querySelector('[data-ln-field="sizeText"]'), _ = y.getAttribute("data-ln-upload-size"), g = _ ? parseInt(_, 10) : null;
      n.uploadedFiles.set(h, {
        serverId: w || null,
        name: b ? b.textContent.trim() : "",
        size: g !== null && !isNaN(g) ? g : r ? r.textContent.trim() : ""
      });
    }
    const p = this.dom.querySelectorAll('input[type="hidden"]');
    for (let o = 0; o < p.length; o++) {
      const y = p[o];
      if (y.name === n.idsFieldName && y.value && !Array.from(n.uploadedFiles.values()).some(function(h) {
        return String(h.serverId) === String(y.value);
      })) {
        const h = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(h, {
          serverId: y.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, s.prototype._syncHiddenInputs = function() {
    const n = this, f = this.dom.querySelectorAll('input[type="hidden"]');
    for (let p = 0; p < f.length; p++)
      f[p].name === n.idsFieldName && f[p].remove();
    for (const [, p] of this.uploadedFiles)
      if (p.serverId) {
        const o = document.createElement("input");
        o.type = "hidden", o.name = n.idsFieldName, o.value = p.serverId, n.dom.appendChild(o);
      }
  }, s.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(f) {
      n.zone === n.dom && f.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && f.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(f) {
      f.preventDefault(), f.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(f) {
      f.preventDefault(), f.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(f) {
      f.preventDefault(), f.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(f) {
      f.preventDefault(), f.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), f.dataTransfer && f.dataTransfer.files && n.upload(f.dataTransfer.files);
    }, this._onListClick = function(f) {
      const p = f.target.closest('[data-ln-upload-action="remove"]');
      if (!p || !n.list || !n.list.contains(p) || p.disabled) return;
      const o = p.closest("[data-ln-upload-item]");
      if (o) {
        const y = o.getAttribute("data-ln-upload-local-id");
        y && n.remove(y);
      }
    }, this._onRequestUpload = function(f) {
      f.detail && f.detail.files && n.upload(f.detail.files);
    }, this._onRequestRemove = function(f) {
      if (f.detail) {
        const p = f.detail.localId !== void 0 ? f.detail.localId : f.detail.serverId;
        p !== void 0 && n.remove(p);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, s.prototype.upload = function(n) {
    const f = this, p = Array.from(n);
    for (let o = 0; o < p.length; o++) {
      const y = p[o];
      if (f.maxFiles > 0 && f.uploadedFiles.size >= f.maxFiles) {
        k(f.dom, "ln-upload:invalid", {
          file: y,
          reason: "max-files"
        });
        continue;
      }
      if (!wr(y, f.allowedExts)) {
        k(f.dom, "ln-upload:invalid", {
          file: y,
          reason: "accept"
        });
        continue;
      }
      if (f.maxSize > 0 && y.size > f.maxSize) {
        k(f.dom, "ln-upload:invalid", {
          file: y,
          reason: "max-size"
        });
        continue;
      }
      Q(f.dom, "ln-upload:before-upload", { file: y }).defaultPrevented || f._uploadSingleFile(y);
    }
  }, s.prototype._uploadSingleFile = function(n) {
    const f = this, p = "file-" + ++f.fileIdCounter, o = ui(n.name);
    let y = null;
    if (this.list) {
      const _ = Lt(this.dom, "ln-upload-item", "ln-upload");
      if (_ && (y = _.firstElementChild, y)) {
        y.setAttribute("data-ln-upload-item", ""), y.setAttribute("data-ln-upload-local-id", p), y.setAttribute("data-ln-upload-ext", o), y.setAttribute("data-ln-upload-state", "uploading"), ft(y, {
          name: n.name,
          sizeText: "0%",
          removeLabel: f.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const g = y.querySelector('[data-ln-upload-action="remove"]');
        g && (g.disabled = !0);
        const a = y.querySelector("[data-ln-progress]");
        a && a.setAttribute("data-ln-progress", "0"), f.list.appendChild(y);
      }
    }
    const w = new FormData();
    w.append(f.fileFieldName, n);
    const h = this.dom.querySelectorAll("input, select, textarea");
    for (let _ = 0; _ < h.length; _++) {
      const g = h[_];
      !g.name || g.name === f.idsFieldName || g.type === "file" || (g.type === "checkbox" || g.type === "radio") && !g.checked || w.append(g.name, g.value);
    }
    const b = new XMLHttpRequest();
    f.uploadedFiles.set(p, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: b
    }), b.upload.addEventListener("progress", function(_) {
      if (_.lengthComputable) {
        const g = Math.round(_.loaded / _.total * 100);
        if (y) {
          const a = y.querySelector("[data-ln-progress]");
          a && a.setAttribute("data-ln-progress", String(g)), ft(y, { sizeText: g + "%" });
        }
        k(f.dom, "ln-upload:progress", {
          localId: p,
          file: n,
          percent: g,
          loaded: _.loaded,
          total: _.total
        });
      }
    }), b.addEventListener("load", function() {
      const _ = f.uploadedFiles.get(p);
      if (_ && delete _.xhr, b.status >= 200 && b.status < 300) {
        let g;
        try {
          g = JSON.parse(b.responseText);
        } catch (v) {
          r(f.dict.error || "Error", b.status, v);
          return;
        }
        const a = g.id || g.serverId;
        if (y) {
          y.removeAttribute("data-ln-upload-state"), a && y.setAttribute("data-ln-upload-id", String(a)), ft(y, {
            sizeText: l(g.size || n.size, f.locale, f.dict),
            uploading: !1
          });
          const v = y.querySelector('[data-ln-upload-action="remove"]');
          v && (v.disabled = !1);
        }
        _ && (_.serverId = a, _.size = g.size || n.size, _.name = g.name || n.name), f._syncHiddenInputs(), k(f.dom, "ln-upload:uploaded", {
          localId: p,
          serverId: a,
          name: g.name || n.name,
          size: g.size || n.size,
          response: g
        });
      } else {
        let g = "";
        try {
          g = JSON.parse(b.responseText).message || "";
        } catch {
        }
        r(g, b.status, null);
      }
    }), b.addEventListener("error", function() {
      const _ = f.uploadedFiles.get(p);
      _ && delete _.xhr, r("", 0, null);
    });
    function r(_, g, a) {
      if (y) {
        y.setAttribute("data-ln-upload-state", "error"), ft(y, {
          sizeText: f.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const v = y.querySelector('[data-ln-upload-action="remove"]');
        v && (v.disabled = !1);
      }
      k(f.dom, "ln-upload:error", {
        file: n,
        message: _,
        status: g,
        error: a
      });
    }
    f.uploadUrl ? (b.open("POST", f.uploadUrl), b.setRequestHeader("X-CSRF-TOKEN", c()), b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), b.setRequestHeader("Accept", "application/json"), b.send(w)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, s.prototype.remove = function(n) {
    const f = this;
    let p = null, o = null;
    if (f.uploadedFiles.has(n))
      p = n, o = f.uploadedFiles.get(n);
    else
      for (const [b, r] of f.uploadedFiles)
        if (String(r.serverId) === String(n)) {
          p = b, o = r;
          break;
        }
    if (!p || !o || Q(f.dom, "ln-upload:before-remove", {
      localId: p,
      serverId: o.serverId
    }).defaultPrevented) return;
    const w = f.list ? f.list.querySelector('[data-ln-upload-local-id="' + p + '"]') : null;
    if (o.xhr && typeof o.xhr.abort == "function" && o.xhr.abort(), !o.serverId) {
      w && w.remove(), f.uploadedFiles.delete(p), f._syncHiddenInputs(), k(f.dom, "ln-upload:removed", { localId: p, serverId: null });
      return;
    }
    let h = null;
    if (f.deleteUrlPattern ? h = f.deleteUrlPattern.replace("{id}", encodeURIComponent(o.serverId)) : f.uploadUrl && f.uploadUrl.includes("{id}") && (h = f.uploadUrl.replace("{id}", encodeURIComponent(o.serverId))), !h) {
      w && w.remove(), f.uploadedFiles.delete(p), f._syncHiddenInputs(), k(f.dom, "ln-upload:removed", { localId: p, serverId: o.serverId });
      return;
    }
    w && (w.setAttribute("data-ln-upload-state", "deleting"), ft(w, { deleting: !0 })), fetch(h, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": c(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(b) {
      b.ok ? (w && w.remove(), f.uploadedFiles.delete(p), f._syncHiddenInputs(), k(f.dom, "ln-upload:removed", {
        localId: p,
        serverId: o.serverId
      })) : (w && (w.removeAttribute("data-ln-upload-state"), ft(w, { deleting: !1 })), k(f.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: b.status
      }));
    }).catch(function(b) {
      w && (w.removeAttribute("data-ln-upload-state"), ft(w, { deleting: !1 })), k(f.dom, "ln-upload:error", {
        file: o,
        message: "",
        status: 0,
        error: b
      });
    });
  }, s.prototype.clear = function() {
    const n = this;
    if (!Q(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, p] of this.uploadedFiles)
        if (p.xhr && typeof p.xhr.abort == "function" && p.xhr.abort(), p.serverId) {
          let o = null;
          n.deleteUrlPattern ? o = n.deleteUrlPattern.replace("{id}", encodeURIComponent(p.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (o = n.uploadUrl.replace("{id}", encodeURIComponent(p.serverId))), o && fetch(o, {
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
    attributes: u
  });
})();
function fi(t, e) {
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
function hi(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let d = "";
    const u = i.length;
    for (let m = 0; m < u; m++)
      d += String.fromCharCode(i[m]);
    return btoa(d);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function pi(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), d = new Uint8Array(i.length);
      for (let u = 0; u < i.length; u++)
        d[u] = i.charCodeAt(u);
      return new TextDecoder().decode(d);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function mi(t, e) {
  const i = String(e || "ln-ashlar");
  let d;
  typeof TextEncoder < "u" ? d = new TextEncoder().encode(i) : typeof Buffer < "u" ? d = Buffer.from(i, "utf-8") : d = [108, 110];
  const u = d.length || 1, m = new Uint8Array(t.length);
  for (let l = 0; l < t.length; l++)
    m[l] = t[l] ^ d[l % u];
  return m;
}
function gi(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let d;
  if (typeof TextEncoder < "u")
    d = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    d = Buffer.from(i, "utf-8");
  else
    return "";
  const u = mi(d, e);
  let m = "";
  for (let l = 0; l < u.length; l++)
    m += String.fromCharCode(u[l]);
  return typeof btoa < "u" ? btoa(m) : typeof Buffer < "u" ? Buffer.from(u).toString("base64") : "";
}
function _i(t, e = "ln-ashlar") {
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
    const u = new Uint8Array(d.length);
    for (let l = 0; l < d.length; l++)
      u[l] = d.charCodeAt(l);
    const m = mi(u, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(m);
    if (typeof Buffer < "u")
      return Buffer.from(m).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function bi(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", d = Number(t.shift) || 13, u = t.key || "ln-ashlar";
    return { codec: i, shift: d, key: u };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function Ar(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = bi(e);
  return i.codec === "base64" ? hi(t) : i.codec === "xor" ? gi(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (d) => fi(d, i.shift));
}
function ve(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = bi(e);
  return i.codec === "base64" ? pi(t) : i.codec === "xor" ? _i(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (d) => fi(d, -i.shift));
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
  function u(l) {
    return l[e] ? l[e] : (l[e] = this, this.dom = l, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  u.prototype.deobfuscate = function() {
    const l = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && l && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((b) => !this.dom.contains(b.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const b = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(r) {
          return r.parentElement && r.parentElement.classList && r.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; b.nextNode(); )
        this._originalTextNodes.push({
          node: b.currentNode,
          raw: b.currentNode.nodeValue
        });
    }
    const s = this.dom.getAttribute(t), n = parseInt(s, 10), f = isNaN(n) ? 13 : n, p = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), o = this.dom.getAttribute("data-ln-obfuscator-key");
    let y = "rot";
    p === "xor" || p === "base64" ? y = p : o && (y = "xor");
    const w = o || "ln-ashlar", h = { codec: y, shift: f, key: w };
    if (l && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const b = this.dom.querySelectorAll(".sr-only");
      for (let _ = 0; _ < b.length; _++)
        b[_].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const r = (this.dom.rel || "").split(/\s+/).filter(function(_) {
        return _ && _ !== "noopener" && _ !== "noreferrer";
      });
      r.length > 0 ? this.dom.rel = r.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let b = 0; b < this._originalTextNodes.length; b++) {
        const r = this._originalTextNodes[b];
        r.node && r.raw && r.raw.length > 0 && (r.node.nodeValue = ve(r.raw, h));
      }
    if (l && this._originalHref) {
      const b = ve(this._originalHref, h);
      this.dom.setAttribute("href", b);
    }
    k(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: y,
      shift: f,
      key: y === "xor" ? w : null
    });
  }, u.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let l = 0; l < this._originalTextNodes.length; l++) {
          const c = this._originalTextNodes[l];
          c.node && c.raw && (c.node.nodeValue = c.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const m = H(t, e, u, "ln-obfuscator", {
    attributes: d
  });
  m.obfuscate = Ar, m.deobfuscate = ve, m.utf8ToBase64 = hi, m.base64ToUtf8 = pi, m.xorObfuscate = gi, m.xorDeobfuscate = _i;
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
  function u() {
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
  function m() {
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
    u(), m(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
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
  function u(r) {
    i && (i.textContent = r, i.classList.add("ln-link-status--visible"));
  }
  function m() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function l(r, _) {
    if (_.target.closest("a, button, input, select, textarea")) return;
    const g = r.querySelector("a");
    if (!g) return;
    const a = g.getAttribute("href");
    if (!a) return;
    if (_.ctrlKey || _.metaKey || _.button === 1) {
      window.open(a, "_blank", "noopener,noreferrer");
      return;
    }
    Q(r, "ln-link:navigate", { target: r, href: a, link: g }).defaultPrevented || g.click();
  }
  function c(r) {
    const _ = r.querySelector("a");
    if (!_) return;
    const g = _.getAttribute("href");
    g && u(g);
  }
  function s() {
    m();
  }
  function n(r) {
    r[e + "Row"] || !r.querySelector("a") || (r[e + "Row"] = !0, r._lnLinkClick = function(g) {
      l(r, g);
    }, r._lnLinkEnter = function() {
      c(r);
    }, r.addEventListener("click", r._lnLinkClick), r.addEventListener("mouseenter", r._lnLinkEnter), r.addEventListener("mouseleave", s));
  }
  function f(r) {
    r[e + "Row"] && (r._lnLinkClick && r.removeEventListener("click", r._lnLinkClick), r._lnLinkEnter && r.removeEventListener("mouseenter", r._lnLinkEnter), r.removeEventListener("mouseleave", s), delete r._lnLinkClick, delete r._lnLinkEnter, delete r[e + "Row"]);
  }
  function p(r) {
    if (!r[e + "Init"]) return;
    const _ = r.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const g = _ === "TABLE" && r.querySelector("tbody") || r;
      for (const a of g.querySelectorAll("tr"))
        f(a);
    } else
      f(r);
    delete r[e + "Init"];
  }
  function o(r) {
    if (r[e + "Init"]) return;
    r[e + "Init"] = !0;
    const _ = r.tagName;
    if (_ === "TABLE" || _ === "TBODY") {
      const g = _ === "TABLE" && r.querySelector("tbody") || r;
      for (const a of g.querySelectorAll("tr"))
        n(a);
    } else
      n(r);
  }
  function y(r) {
    r.hasAttribute && r.hasAttribute(t) && o(r);
    const _ = r.querySelectorAll ? r.querySelectorAll("[" + t + "]") : [];
    for (const g of _)
      o(g);
  }
  function w() {
    ct(function() {
      te({
        query: "[" + t + "]",
        onInit: function(r) {
          y(r);
        },
        onSubtreeChange: function(r, _) {
          for (let g = 0; g < _.addedNodes.length; g++) {
            const a = _.addedNodes[g];
            if (a.nodeType === 1) {
              if (a.tagName === "TR")
                n(a);
              else if (a.querySelectorAll) {
                const v = a.querySelectorAll("tr");
                for (let E = 0; E < v.length; E++)
                  n(v[E]);
              }
            }
          }
        }
      }), Nt([t], function(r) {
        r.hasAttribute && r.hasAttribute(t) ? y(r) : p(r);
      });
    }, "ln-link");
  }
  function h(r) {
    y(r);
  }
  window[e] = { init: h, destroy: p };
  function b() {
    d(), w(), h(document.body);
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
  function d(u) {
    if (u[e]) return u[e];
    if (!(!u || u.tagName !== "A" && u.tagName !== "BUTTON"))
      return u[e] = this, this.dom = u, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  d.prototype._handleClick = function(u) {
    if (this.dom.tagName === "A" && (u.ctrlKey || u.metaKey || u.shiftKey || u.altKey || u.button !== 0))
      return;
    let m = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (m || (m = (this.dom.getAttribute("href") || "").trim()), !m || m === "#")
      return;
    !m.startsWith("#") && !m.startsWith(".") && !m.startsWith("[") && (m = "#" + m);
    let l = null;
    try {
      l = document.querySelector(m);
    } catch {
      const w = m.replace(/^#/, "");
      l = document.getElementById(w);
    }
    if (!l) return;
    u.preventDefault();
    const c = this.dom.getAttribute("data-ln-scroll-set");
    if (c) {
      const y = c.indexOf(":");
      if (y !== -1) {
        const w = c.slice(0, y).trim(), h = c.slice(y + 1).trim();
        try {
          const b = document.querySelector(w);
          b && (b.value = h, b.dispatchEvent(new Event("input", { bubbles: !0 })), b.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (Q(this.dom, "ln-scroll:before-scroll", {
      target: l,
      link: this.dom,
      href: m
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", f = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (l.scrollIntoView({ behavior: n, block: f }), It(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", m);
      } catch {
      }
    const o = this.dom.getAttribute("data-ln-scroll-focus");
    if (o !== "false" && o !== "0") {
      const y = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), w = isNaN(y) ? 450 : y;
      window.setTimeout(function() {
        let h = null;
        if (o && o !== "true" && o !== "1")
          try {
            h = document.querySelector(o);
          } catch {
          }
        h || (h = l.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !h && l.getAttribute("tabindex") !== null && (h = l), h && typeof h.focus == "function" && h.focus({ preventScroll: !0 });
      }, w);
    }
    k(this.dom, "ln-scroll:scrolled", {
      target: l,
      link: this.dom,
      href: m
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
function yi(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = Sr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function vi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), d = /* @__PURE__ */ new Set();
  let u = "";
  for (let l = 0; l < i.length; l++) {
    const c = yi(i[l]);
    if (!c) return "";
    if (Vt.indexOf(c) !== -1) {
      d.add(c);
      continue;
    }
    if (u) return "";
    u = c;
  }
  if (!u) return "";
  const m = [];
  for (let l = 0; l < Vt.length; l++)
    d.has(Vt[l]) && m.push(Vt[l]);
  return m.push(u), m.join("+");
}
function Cr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), d = [];
  for (let u = 0; u < i.length; u++) {
    const m = vi(i[u]);
    m && d.indexOf(m) === -1 && d.push(m);
  }
  return d;
}
function Tr(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const d = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(d) ? "" : vi(d ? d + "+" + i : i);
}
function kr(t) {
  if (!t) return "";
  const e = yi(t.key);
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
  const u = String(e.tagName || "").toLowerCase();
  return u === "button" ? d === "Enter" || d === "Space" : u === "a" && e.hasAttribute && e.hasAttribute("href") && d === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", d = "data-ln-key-allow-input", u = "data-ln-key-modifier", m = "data-ln-key-for", l = "lnKeyFor";
  if (window[e] !== void 0) return;
  function c(_) {
    const g = _[e];
    if (g) {
      if (!_.hasAttribute(t)) {
        g.destroy();
        return;
      }
      g.sync();
    }
  }
  function s(_) {
    const g = _[l];
    g && !_.hasAttribute(m) && g.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: c, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: c, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: c, description: "Permits shortcut execution even when focused inside an editable input" }
  }, f = {
    "data-ln-key-for": { type: "string", effect: s, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, p = /* @__PURE__ */ new Set();
  let o = null;
  function y() {
    o || (o = function(_) {
      if (_.defaultPrevented || _.isComposing || _.repeat) return;
      const g = kr(_);
      if (!g) return;
      const a = Ui(_.target), v = document.querySelectorAll("[" + t + "], [" + m + "]");
      let E = null, A = !1, S = !1;
      for (let I = 0; I < v.length; I++) {
        const q = v[I], D = q[e] || q[l];
        if (!D || !D.matches(g) || a && !D.allowsInput()) continue;
        const O = D.resolveTarget(), F = Lr(O);
        if (!(!F || !zi(O, F))) {
          if (xr(_, O, F, g)) {
            S = !0;
            continue;
          }
          E ? A = !0 : E = { host: q, target: O, action: F };
        }
      }
      if (S || !E) return;
      A && console.warn('[ln-key] Duplicate active shortcut "' + g + '"; first DOM match wins.');
      const C = {
        source: E.host,
        target: E.target,
        action: E.action,
        key: g,
        event: _
      };
      Q(E.host, "ln-key:before-trigger", C).defaultPrevented || (_.preventDefault(), E.target[E.action](), k(E.host, "ln-key:trigger", C));
    }, document.addEventListener("keydown", o));
  }
  function w() {
    p.size > 0 || !o || (document.removeEventListener("keydown", o), o = null);
  }
  function h(_) {
    return this.dom = _, this.shortcuts = [], p.add(this), this.sync(), y(), this;
  }
  h.prototype.sync = function() {
    this.shortcuts = Cr(this.dom.getAttribute(t));
  }, h.prototype.matches = function(_) {
    return this.shortcuts.indexOf(_) !== -1;
  }, h.prototype.allowsInput = function() {
    return this.dom.hasAttribute(d);
  }, h.prototype.resolveTarget = function() {
    const _ = this.dom.getAttribute(i);
    return _ ? r(_, i) : this.dom;
  }, h.prototype.destroy = function() {
    this.dom[e] && (p.delete(this), delete this.dom[e], w());
  };
  function b(_) {
    return this.dom = _, p.add(this), y(), this;
  }
  b.prototype._modifierContext = function() {
    return this.dom.closest("[" + u + "]");
  }, b.prototype.shortcut = function() {
    const _ = this._modifierContext(), g = _ ? _.getAttribute(u) : "";
    return Tr(g, this.dom.textContent);
  }, b.prototype.matches = function(_) {
    return this.shortcut() === _;
  }, b.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(d)) return !0;
    const _ = this._modifierContext();
    return !!(_ && _.hasAttribute(d));
  }, b.prototype.resolveTarget = function() {
    return r(this.dom.getAttribute(m), m);
  }, b.prototype.destroy = function() {
    this.dom[l] && (p.delete(this), delete this.dom[l], w());
  };
  function r(_, g) {
    if (!_) return null;
    try {
      const a = document.querySelector(_);
      return a || console.warn("[ln-key] Target not found for " + g + ' selector "' + _ + '".'), a;
    } catch {
      return console.warn("[ln-key] Invalid " + g + ' selector "' + _ + '".'), null;
    }
  }
  H(t, e, h, "ln-key", {
    attributes: n
  }), H(m, l, b, "ln-key-for", {
    attributes: f
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
    c && m.call(c);
  }
  const d = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function u(l) {
    return this.dom = l, this._parentObserver = null, m.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function m() {
    const l = this.dom.getAttribute("data-ln-progress"), c = this.dom.parentElement, s = c ? c.getAttribute("data-ln-progress-max") : null, n = this.dom.getAttribute("data-ln-progress-max"), f = Ir(n, s, 100), p = Vn(l, f);
    this.dom.style.width = p.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(p.min)), this.dom.setAttribute("aria-valuemax", String(p.max)), this.dom.setAttribute("aria-valuenow", String(p.clampedValue)), k(this.dom, "ln-progress:change", {
      target: this.dom,
      value: p.value,
      max: p.max,
      percentage: p.percentage
    });
  }
  H(
    t,
    e,
    u,
    "ln-progress",
    {
      attributes: d
    }
  ), Nt(["data-ln-progress-max"], function(l) {
    const c = l.querySelectorAll ? l.querySelectorAll(t) : [];
    for (let s = 0; s < c.length; s++) {
      const n = c[s][e];
      n && m.call(n);
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
  for (let u = 0; u < d.length; u++) {
    const m = e[d[u]];
    let l = "";
    if (m.col !== null && m.col !== void 0 ? l = t[m.col] || "" : m.attr && i && typeof i.getAttribute == "function" && (l = i.getAttribute(m.attr) || ""), !Ke(l, m.values))
      return !1;
  }
  return !0;
}
function dn(t, e, i, d) {
  if (d != null && !isNaN(d))
    return parseInt(d, 10);
  if (e && typeof e.getAttribute == "function") {
    const u = e.getAttribute("data-ln-filter-col");
    if (u !== null && !isNaN(parseInt(u, 10)))
      return parseInt(u, 10);
    if (typeof e.closest == "function") {
      const m = e.closest("th");
      if (m && typeof m.cellIndex == "number")
        return m.cellIndex;
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
    const u = t.querySelectorAll("thead th, tr:first-child th"), m = String(i).trim().toLowerCase();
    for (let l = 0; l < u.length; l++) {
      const c = u[l], s = c.getAttribute("data-ln-table-filter-col") || c.getAttribute("data-ln-filter-col") || c.getAttribute("data-ln-filter-key") || c.getAttribute("data-ln-table-col") || c.getAttribute("data-ln-col") || c.getAttribute("data-ln-field");
      if (s && s.trim().toLowerCase() === m)
        return typeof c.cellIndex == "number" ? c.cellIndex : l;
    }
    if (e) {
      const l = e.closest ? e.closest("[data-ln-popover], [id]") : null, c = l && l.id || e.id || null;
      if (c)
        for (let s = 0; s < u.length; s++) {
          const n = u[s];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + c + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : s;
        }
    }
    for (let l = 0; l < u.length; l++) {
      const c = u[l], n = Array.from(c.childNodes || []).filter((p) => p.nodeType === 3), f = (n.length > 0 ? n.map((p) => p.textContent.trim()).join(" ") : c.textContent || "").trim().toLowerCase();
      if (f && f === m)
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
    const u = t[d];
    !e && u.key && (e = u.key), u.checked && !u.isReset && u.value && i.push(u.value);
  }
  return { key: e, values: i };
}
function Or(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function un(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", d = "data-ln-filter-value", u = "data-ln-filter-hide", m = "data-ln-filter-reset", l = "data-ln-filter-col", c = "data-ln-hash", s = "data-ln-filter-values", n = "data-ln-filter-target", f = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-filter": { prop: "targetId", type: "string", read: K, fallback: null, effect: g, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: g, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: g, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-filter-target": { type: "marker", description: "Marker on target container or table observed by ln-filter" }
  }, o = X(p);
  function y(a) {
    return a.hasAttribute(m) || !a.getAttribute(d);
  }
  function w(a) {
    const v = a.dom.querySelectorAll("[" + i + "]"), E = [];
    for (let S = 0; S < v.length; S++) {
      const C = v[S];
      E.push({
        key: C.getAttribute(i),
        value: C.getAttribute(d) || "",
        checked: C.checked,
        isReset: y(C)
      });
    }
    const A = Rr(E);
    return { key: A.key, values: A.values, targetId: a.targetId };
  }
  function h(a, v, E) {
    const A = a.querySelectorAll("[" + i + "]"), S = Array.isArray(E) && E.length > 0;
    for (let C = 0; C < A.length; C++) {
      const L = A[C];
      y(L) ? L.checked = !S : S && L.getAttribute(i) === v && E.indexOf(L.getAttribute(d)) !== -1 ? L.checked = !0 : L.checked = !1;
    }
  }
  function b(a) {
    this.dom = a, Y(this, a, o);
    const v = a.getAttribute(l);
    this.colIndex = v !== null ? parseInt(v, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = St(a, "filter"), this.hashEnabled = !!this.nsKey;
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
      const I = un(a.getAttribute(s));
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
        if (I[q].checked && !y(I[q])) {
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
    this._onDomChange = function(v) {
      const E = v.target;
      if (!E || !E.hasAttribute || !E.hasAttribute(i)) return;
      const A = Array.from(a.dom.querySelectorAll("[" + i + "]"));
      if (y(E)) {
        for (let S = 0; S < A.length; S++)
          y(A[S]) || (A[S].checked = !1);
        E.checked = !0, a._queueRender();
        return;
      }
      if (E.checked) {
        for (let C = 0; C < A.length; C++)
          y(A[C]) && (A[C].checked = !1);
        let S = !1;
        for (let C = 0; C < A.length; C++)
          if (y(A[C])) {
            S = !0;
            break;
          }
        if (S) {
          let C = !0;
          for (let L = 0; L < A.length; L++)
            if (!y(A[L]) && !A[L].checked) {
              C = !1;
              break;
            }
          if (C)
            for (let L = 0; L < A.length; L++)
              y(A[L]) ? A[L].checked = !0 : A[L].checked = !1;
        }
      } else {
        let S = !1;
        for (let C = 0; C < A.length; C++)
          if (!y(A[C]) && A[C].checked) {
            S = !0;
            break;
          }
        if (!S)
          for (let C = 0; C < A.length; C++)
            y(A[C]) && (A[C].checked = !0);
      }
      a._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, b.prototype._render = function() {
    const a = this, v = w(this), E = this._lastSnapshot;
    if (!(!E || E.key !== v.key || qr(E.values, v.values))) return;
    v.key === null || v.values.length;
    const S = document.getElementById(a.targetId), C = {
      key: v.key,
      values: v.values.slice(),
      targetId: a.targetId
    };
    k(a.dom, "ln-filter:change", C);
    let L = !1;
    S && S !== a.dom && Q(S, "ln-filter:change", C).defaultPrevented && (L = !0);
    const I = E && E.values.length > 0, q = v.values.length === 0;
    if (I && q) {
      const O = { targetId: a.targetId };
      k(a.dom, "ln-filter:reset", O), S && S !== a.dom && k(S, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: v.key, values: v.values.slice() };
    const D = Or(v.values);
    if (D ? this.dom.setAttribute(s, D) : this.dom.removeAttribute(s), this.hashEnabled) {
      const O = jn(v.key, v.values);
      gt(this.nsKey, O);
    }
    L || a._applyDomFilter(S);
  }, b.prototype._applyDomFilter = function(a) {
    const v = a || document.getElementById(this.targetId);
    if (!v) return;
    const E = w(this), A = E.key === null || E.values.length === 0, S = v.tagName === "TABLE" ? v : v.querySelector ? v.querySelector("table") : null;
    if (S)
      this._filterTableRows(E, S);
    else {
      const C = v.children;
      for (let L = 0; L < C.length; L++) {
        const I = C[L], q = A ? null : I.getAttribute("data-" + E.key), D = !A && q !== null && !Ke(q, E.values), O = I.hasAttribute(u);
        D && !O ? I.setAttribute(u, "true") : !D && O && I.removeAttribute(u);
      }
    }
  };
  function r(a) {
    if (!a) return "";
    const v = a.querySelector ? a.querySelector("[data-ln-value]") : null;
    return At(v || a);
  }
  function _(a) {
    return !!(!a || typeof a != "object" || a.tagName === "TEMPLATE" || typeof a.hasAttribute == "function" && (a.hasAttribute("data-ln-sort-exclude") || a.hasAttribute("hidden")) || a.classList && a.classList.contains("hidden") || a.style && a.style.display === "none" || typeof a.matches == "function" && a.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof a.querySelector == "function" && a.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  b.prototype._filterTableRows = function(a, v) {
    if (!v) {
      const I = document.getElementById(this.targetId);
      if (!I || (v = I.tagName === "TABLE" ? I : I.querySelector ? I.querySelector("table") : null, !v)) return;
    }
    const E = dn(v, this.dom, a.key, this.colIndex), A = a.key || this.dom.getAttribute("data-ln-filter-key") || (E !== null ? "col" + E : "attr-filter"), S = a.values;
    f.has(v) || f.set(v, {});
    const C = f.get(v);
    A && S.length > 0 ? C[A] = {
      col: E,
      values: S.slice(),
      attr: "data-" + A
    } : A && delete C[A];
    const L = v.tBodies;
    for (let I = 0; I < L.length; I++) {
      const q = L[I].rows;
      for (let D = 0; D < q.length; D++) {
        const O = q[D];
        if (_(O)) continue;
        const F = {};
        for (let G = 0; G < O.cells.length; G++)
          F[G] = r(O.cells[G]);
        const U = !Dr(F, C, O), j = O.hasAttribute(u);
        U && !j ? O.setAttribute(u, "true") : !U && j && O.removeAttribute(u);
      }
    }
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const a = document.getElementById(this.targetId);
    if (a) {
      const v = a.tagName === "TABLE" ? a : a.querySelector ? a.querySelector("table") : null;
      if (v && f.has(v)) {
        const E = f.get(v), A = dn(v, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), S = this.dom.getAttribute("data-ln-filter-key") || (A !== null ? "col" + A : this.colIndex !== null ? "col" + this.colIndex : null);
        S && E[S] && (delete E[S], this._filterTableRows({ key: null, values: [] }, v)), Object.keys(E).length === 0 && f.delete(v);
      }
      this.targetId && document.querySelectorAll("[" + t + '="' + this.targetId + '"]').length <= 1 && a.removeAttribute(n);
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function g(a, v) {
    const E = a[e];
    if (!(!E || E._destroyed))
      if (v === c)
        E.hashEnabled && E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = St(a, "filter"), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      else if (v === s) {
        const A = un(a.getAttribute(s)), S = a.querySelector("[" + i + "]"), C = S ? S.getAttribute(i) : null;
        C && (h(a, C, A), E._render());
      } else v === t && (E.targetId = a.getAttribute(t) || null, E._ensureTargetMarked(), E._render());
  }
  H(t, e, b, "ln-filter", {
    attributes: p,
    subtreeQuery: "[" + t + "], [" + n + "]",
    onSubtreeChange: function(a, v) {
      if (v.addedNodes.length === 0 && v.removedNodes.length === 0) return;
      let E = null, A = null;
      if (a.hasAttribute(n) ? (A = a, E = a.getAttribute(n) || a.id) : a.hasAttribute(t) && (E = a.getAttribute(t), A = E ? document.getElementById(E) : null), !E || !A) return;
      const S = document.querySelectorAll("[" + t + '="' + E + '"]');
      for (let C = 0; C < S.length; C++) {
        const L = S[C][e];
        L && !L._destroyed && w(L).values.length > 0 && L._queueDomFilter();
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
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", d = "lnSearchControl", u = "data-ln-search-items", m = "data-ln-search-fields", l = "data-ln-search-exclude", c = "data-ln-search-hide", s = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: g, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: g, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, f = X(n);
  function p(a) {
    const v = St(a, "search");
    if (v) return v;
    if (a.id) {
      const E = document.querySelector("[" + i + '="' + a.id + '"]');
      if (E) {
        const A = St(E, "search");
        if (A) return A;
      }
    }
    return null;
  }
  function o(a) {
    return a.matches("input, textarea") ? a : a.querySelector("input, textarea");
  }
  function y(a, v) {
    const E = a.childNodes;
    for (let A = 0; A < E.length; A++) {
      const S = E[A];
      if (S.nodeType === 3) {
        v.push(S.nodeValue);
        continue;
      }
      S.nodeType === 1 && (S.hasAttribute(l) || y(S, v));
    }
  }
  function w(a) {
    if (a._lnSearchText !== void 0) return a._lnSearchText;
    const v = [];
    y(a, v);
    const E = rr(v);
    return a._lnSearchText = E, E;
  }
  function h(a, v) {
    if (!a.id) return;
    const E = document.querySelectorAll("[" + i + '="' + a.id + '"]');
    for (const A of E) {
      const S = o(A);
      S && S.value !== v && (S.value = v);
    }
  }
  function b(a) {
    this.dom = a, this.term = a.getAttribute(t) || "", this._destroyed = !1;
    const v = this;
    return this.nsKey = p(a), this.hashEnabled = !!this.nsKey, this._queueApply = Ht(function() {
      v._destroyed || v._apply();
    }), this._onHashChange = function() {
      if (v._destroyed || !v.hashEnabled) return;
      const E = st(v.nsKey), A = v.dom.getAttribute(t) || "";
      E !== null && E !== A ? v.dom.setAttribute(t, E) : E === null && A !== "" && v.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!v._destroyed) {
        if (v.hashEnabled) {
          const E = st(v.nsKey);
          if (E !== null && E !== v.term) {
            v.term = E, v.dom.setAttribute(t, E), h(v.dom, E), v._apply();
            return;
          }
        }
        se(v.term) && (h(v.dom, v.term), v._apply());
      }
    }), this;
  }
  b.prototype._apply = function() {
    const a = this.dom, v = se(this.term), E = $n(v);
    this.hashEnabled && gt(this.nsKey, this.term ? this.term : null);
    const A = ir(a.getAttribute(m));
    if (Q(a, "ln-search:change", {
      term: v,
      tokens: E,
      targetId: a.id,
      fields: A
    }).defaultPrevented) return;
    const C = a.getAttribute(u), L = C ? a.querySelectorAll(C) : a.children;
    for (let I = 0; I < L.length; I++) {
      const q = L[I];
      if (q.hasAttribute(l)) {
        q.hasAttribute(c) && q.removeAttribute(c);
        continue;
      }
      const D = E.length > 0 && !Qn(w(q), E), O = q.hasAttribute(c);
      D && !O ? q.setAttribute(c, "true") : !D && O && q.removeAttribute(c);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function r(a) {
    if (this.dom = a, Y(this, a, f), this.input = o(a), this._attachHandler(), this.input && this.input.value.trim()) {
      const v = this;
      mt(function() {
        const E = document.getElementById(v.targetId);
        E && ((E.getAttribute(t) || "").trim() || v._write(v.input.value));
      });
    }
    return this;
  }
  r.prototype._write = function(a) {
    const v = document.getElementById(this.targetId);
    v && v.getAttribute(t) !== a && v.setAttribute(t, a);
  }, r.prototype._attachHandler = function() {
    if (!this.input) return;
    const a = this;
    this._onInput = function() {
      a._write(a.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, r.prototype.destroy = function() {
    this.dom[d] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[d]);
  };
  function _(a) {
    const v = a.getAttribute("data-ln-search-clear-for");
    if (v) {
      const L = document.getElementById(v), I = document.querySelector("[" + i + '="' + v + '"]'), q = I ? o(I) : null;
      return { target: L, input: q };
    }
    const E = a.closest("[" + t + "]");
    if (E) {
      const L = E.id ? document.querySelector("[" + i + '="' + E.id + '"]') : null, I = L ? o(L) : null;
      return { target: E, input: I };
    }
    const A = a.closest("[data-ln-table-source], [data-ln-list-source]");
    if (A) {
      const L = A.getAttribute("data-ln-table-source") || A.getAttribute("data-ln-list-source"), I = L ? document.getElementById(L) : null;
      if (I && I.hasAttribute(t)) {
        const q = document.querySelector("[" + i + '="' + L + '"]'), D = q ? o(q) : null;
        return { target: I, input: D };
      }
    }
    const S = a.closest("[" + i + "]");
    if (S) {
      const L = S.getAttribute(i), I = L ? document.getElementById(L) : null, q = o(S);
      return { target: I, input: q };
    }
    const C = a.parentElement;
    if (C) {
      const L = C.querySelector("[" + i + "]");
      if (L) {
        const I = L.getAttribute(i), q = I ? document.getElementById(I) : null, D = o(L);
        return { target: q, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(a) {
    const v = a.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!v) return;
    const E = _(v);
    !E.target && !E.input || (a.preventDefault(), E.input && (E.input.value = "", E.input.focus()), E.target && E.target.setAttribute(t, ""));
  });
  function g(a, v) {
    const E = a[e];
    if (!E || E._destroyed) return;
    if (v === s) {
      E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = p(a), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      return;
    }
    const A = a.getAttribute(t) || "";
    A !== E.term && (E.term = A, h(a, A), E._apply());
  }
  H(t, e, b, "ln-search", {
    attributes: n,
    onSubtreeChange: function(a, v) {
      const E = v.target;
      E && E._lnSearchText !== void 0 && delete E._lnSearchText, E && E.parentElement && E.parentElement._lnSearchText !== void 0 && delete E.parentElement._lnSearchText;
      const A = a[e];
      if (A && !A._destroyed && se(A.term) && (v.addedNodes.length > 0 || v.removedNodes.length > 0)) {
        for (let S = 0; S < v.addedNodes.length; S++) {
          const C = v.addedNodes[S];
          C._lnSearchText !== void 0 && delete C._lnSearchText;
        }
        A._queueApply();
      }
    },
    persist: {
      attr: t,
      hashActive: function(a) {
        return !!p(a);
      }
    }
  }), H(i, d, r, "ln-search-control");
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
  const u = kt(t);
  if (u === "none") return () => 0;
  const m = u === "desc" ? -1 : 1, l = typeof d == "function" ? d : (c) => c;
  return function(c, s) {
    const n = l(c), f = l(s);
    return Ue(n, f, e, i) * m;
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
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", d = "data-ln-sort-state", u = "data-ln-sort-dir", m = "data-ln-hash";
  if (window[e] !== void 0) return;
  function l(y, w) {
    return y.getAttribute(w) || null;
  }
  const c = {
    "data-ln-sort": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: l, effect: o, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: l, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: o, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: o, description: "URL hash routing key for sort state persistence" }
  }, s = X(c), n = /* @__PURE__ */ new WeakMap();
  function f(y, w, h) {
    if (w) {
      const b = y.querySelector('[data-ln-field="' + w + '"]');
      return b ? At(b) : "";
    }
    return h != null && y.cells && y.cells[h] ? At(y.cells[h]) : At(y);
  }
  function p(y) {
    this.dom = y, Y(this, y, s);
    const w = y.closest("th");
    this.column = !this.field && w ? w.cellIndex : null, this._state = kt(y.getAttribute(d)), y.hasAttribute(d) || y.setAttribute(d, this._state), this._destroyed = !1, this.nsKey = St(y, "sort"), this.hashEnabled = !!this.nsKey;
    const h = this;
    this._onClick = function(r) {
      const _ = r.target.closest("[" + u + "]");
      if (!_) return;
      const g = kt(_.getAttribute(u));
      h._apply(g);
    }, y.addEventListener("click", this._onClick), this._onSortChange = function(r) {
      if (h._destroyed || !r.detail) return;
      const _ = h._resolveTarget();
      if (!(_ && (r.target === _ || _.contains(r.target)) || r.detail.targetId && r.detail.targetId === h.targetId)) return;
      if (Mr(
        { field: h.field, column: h.column },
        { field: r.detail.field, column: r.detail.column }
      )) {
        const v = kt(r.detail.direction);
        v && y.getAttribute(d) !== v && (h._state = v, y.setAttribute(d, v), h._updateAriaSort(v));
        return;
      }
      y.getAttribute(d) !== "none" && (h._state = "none", y.setAttribute(d, "none"), h._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const r = st(h.nsKey), _ = Ee(r);
      if (_)
        h.field !== null && _.fieldOrColumn === h.field || h.column !== null && String(h.column) === _.fieldOrColumn ? h._state !== _.direction && h._apply(_.direction, !0) : h._state !== "none" && (h._state = "none", y.setAttribute(d, "none"), h._updateAriaSort("none"));
      else if (h._state !== "none") {
        h._state = "none", y.setAttribute(d, "none"), h._updateAriaSort("none");
        const g = h._resolveTarget();
        g && (Q(g, "ln-sort:change", {
          field: h.field,
          column: h.column,
          direction: "none",
          targetId: h.targetId
        }).defaultPrevented || h._defaultSort(g, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let b = !1;
    if (this.hashEnabled) {
      const r = st(this.nsKey), _ = Ee(r);
      _ && ((h.field !== null && _.fieldOrColumn === h.field || h.column !== null && String(h.column) === _.fieldOrColumn) && mt(function() {
        h._destroyed || h._apply(_.direction, !0);
      }), b = !0);
    }
    if (!b) {
      const r = kt(y.getAttribute(d));
      r && r !== "none" && mt(function() {
        h._destroyed || h._apply(r, !0);
      });
    }
    return this;
  }
  p.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, p.prototype._updateAriaSort = function(y) {
    const w = this.dom.closest("th");
    w && w.setAttribute("aria-sort", Nr(y));
  }, p.prototype._apply = function(y, w) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const g = this.dom.closest("th");
      g && g.cellIndex !== void 0 && (this.column = g.cellIndex);
    }
    const h = kt(y);
    this._state = h, this.dom.getAttribute(d) !== h && this.dom.setAttribute(d, h), this._updateAriaSort(h);
    const b = this._resolveTarget();
    if (!b) return;
    const r = {
      field: this.field,
      column: this.column,
      direction: h,
      targetId: this.targetId
    };
    if (!w && this.hashEnabled) {
      const g = Kn(this.field !== null ? this.field : this.column, h);
      gt(this.nsKey, g);
    }
    Q(b, "ln-sort:change", r).defaultPrevented || this._defaultSort(b, h);
  }, p.prototype._defaultSort = function(y, w) {
    const h = Br(y, this.itemsSelector);
    if (!h.length) return;
    const b = h[0].parentNode, r = h.filter(function(g) {
      return !we(g);
    });
    if (!r.length) return;
    n.has(y) || n.set(y, r.slice());
    let _;
    if (w === "none") {
      const g = n.get(y) || r;
      n.delete(y), _ = g.filter(function(a) {
        return a.parentNode === b && !we(a);
      });
    } else {
      const g = this.field, a = this.column, v = r.map(function(C) {
        return { el: C, val: f(C, g, a) };
      }), E = He(v.map(function(C) {
        return C.val;
      })), A = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base", numeric: !0 }) : null, S = Fr(w, E, A, function(C) {
        return C.val;
      });
      v.sort(S), _ = v.map(function(C) {
        return C.el;
      });
    }
    Hn(function() {
      const g = document.createDocumentFragment();
      let a = 0;
      for (let v = 0; v < h.length; v++) {
        const E = h[v];
        we(E) ? g.appendChild(E) : a < _.length && g.appendChild(_[a++]);
      }
      b.appendChild(g);
    });
  }, p.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function o(y, w) {
    const h = y[e];
    if (!(!h || h._destroyed))
      if (w === i) {
        const b = y.closest("th");
        h.column = !h.field && b ? b.cellIndex : null;
      } else if (w === d) {
        const b = kt(y.getAttribute(d));
        b !== h._state && h._apply(b);
      } else w === m && (h.hashEnabled && h._onHashChange && window.removeEventListener("hashchange", h._onHashChange), h.nsKey = St(y, "sort"), h.hashEnabled = !!h.nsKey, h.hashEnabled && window.addEventListener("hashchange", h._onHashChange));
  }
  H(t, e, p, "ln-sort", {
    attributes: c,
    persist: {
      attr: d,
      hashActive: function(y) {
        return !!St(y, "sort");
      }
    }
  });
})();
function fn(t, e, i, d, u = 15) {
  if (d <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const m = Math.max(0, t || 0), l = Math.max(0, e || 0), c = Math.floor(m / i), s = Math.ceil(l / i), n = Math.max(0, c - u), f = Math.min(d, c + s + u), p = n * i, o = Math.max(0, (d - f) * i);
  return { start: n, end: f, topPadding: p, bottomPadding: o };
}
function Pr(t, e) {
  const i = Array.isArray(t) ? t.length : 0, d = e instanceof Set ? e : new Set(e || []);
  let u = 0;
  if (Array.isArray(t))
    for (let c = 0; c < t.length; c++)
      d.has(t[c]) && u++;
  else
    u = d.size;
  const m = i > 0 && u === i, l = u > 0 && u < i;
  return { totalCount: i, selectedCount: u, isAllSelected: m, isIndeterminate: l };
}
function hn(t, e, i) {
  const d = new Set(t);
  return e == null || ((i !== void 0 ? i : !d.has(e)) ? d.add(e) : d.delete(e)), d;
}
function pn(t, e, i) {
  const d = new Set(t);
  if (!Array.isArray(e)) return d;
  if (i)
    for (let u = 0; u < e.length; u++)
      e[u] != null && d.add(e[u]);
  else
    for (let u = 0; u < e.length; u++)
      d.delete(e[u]);
  return d;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function s(r, _) {
    if (!r || !r.isDataDriven) return;
    const g = r.dom.hasAttribute("data-ln-table-window");
    if (g && !r._windowed)
      r._enterWindowedMode(), r._kickWindowInitial();
    else if (!g && r._windowed)
      r._exitWindowedMode();
    else if (g && r._windowed) {
      const a = parseInt(_, 10);
      a > 0 && r._cache.configure({ windowSize: a });
    }
  }
  function n(r, _) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const g = parseInt(_, 10);
    g > 0 && r._cache.configure({ pageSize: g });
  }
  function f(r, _) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const g = parseInt(_, 10);
    g >= 0 && r._cache.configure({ threshold: g });
  }
  function p(r, _) {
    if (!r || !r.isDataDriven || !r._windowed || !r._cache) return;
    const g = parseInt(_, 10);
    g >= 0 && r._cache.setGrandTotal(g);
  }
  const o = {
    "data-ln-table": { prop: "name", type: "string", read: K, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: f, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: p, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, y = X(o);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function w(r, _) {
    if (r == null || isNaN(r)) return "";
    try {
      return new Intl.NumberFormat(J(_)).format(r);
    } catch {
      return String(r);
    }
  }
  function h(r) {
    let _ = r.parentElement;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const a = getComputedStyle(_).overflowY;
      if (a === "auto" || a === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function b(r) {
    this.dom = r, Y(this, r, y), this.table = r.querySelector("table"), this.tbody = r.querySelector("[data-ln-table-body]") || r.querySelector("tbody"), this.thead = r.querySelector("thead");
    const _ = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = _ ? Array.from(_.querySelectorAll("th")) : [], this._totalSpan = r.querySelector("[data-ln-table-total]"), this._filteredSpan = r.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== r ? this._filteredSpan.parentElement : null), this._selectedSpan = r.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== r ? this._selectedSpan.parentElement : null), this.isDataDriven = r.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const g = this;
    return this._onSetSearch = function(a) {
      const v = (a.detail && a.detail.query != null ? a.detail.query : a.detail && a.detail.term != null ? a.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = v, k(r, "ln-table:search", {
        table: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = v.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), k(r, "ln-table:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, r.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(a) {
      a.preventDefault(), g._onSetSearch(a);
    }, r.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", k(r, "ln-table:clear-filters", { table: g.name }), g._requestData()) : (g._searchTerm = "", g._columnFilters = {}, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), k(r, "ln-table:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, r.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && r.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(a) {
      const v = a.detail || {}, E = v.data || [], A = v.total != null ? v.total : E.length;
      if (!(g._hasInitialSeed && !g.isLoaded && E.length === 0 && A === 0)) {
        if (g._windowed) {
          g._cache.ingest(v) && !v.provisional && r.classList.remove("ln-table--loading");
          return;
        }
        g._data = E, g._lastTotal = A, g._lastFiltered = v.filtered != null ? v.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, r.classList.remove("ln-table--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), k(r, "ln-table:rendered", {
          table: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, r.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(a) {
      const v = a.detail && a.detail.loading;
      r.classList.toggle("ln-table--loading", !!v), v && (g.isLoaded = !1);
    }, r.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(a) {
      !g._windowed || !g._cache || g._cache.release(a.detail && a.detail.offset);
    }, r.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, r.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !g._windowed || !g._cache || g._requestData();
    }, r.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(a) {
      !a.detail || a.detail.field == null || (a.preventDefault(), g.currentSort = a.detail.direction === "none" ? null : { field: a.detail.field, direction: a.detail.direction }, g._requestData());
    }, r.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(a) {
      if (a.target.closest("[data-ln-table-row-select]") || a.target.closest("[data-ln-table-row-action]") || a.target.closest("a") || a.target.closest("button") || a.ctrlKey || a.metaKey || a.button === 1) return;
      const v = a.target.closest("[data-ln-table-row]");
      if (!v) return;
      const E = v.getAttribute("data-ln-table-row-id"), A = v._lnRecord || {};
      k(r, "ln-table:row-click", {
        table: g.name,
        id: E,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(a) {
      const v = a.target.closest("[data-ln-table-row-action]");
      if (!v) return;
      const E = v.closest("[data-ln-table-row]");
      if (!E) return;
      const A = v.getAttribute("data-ln-table-row-action"), S = E.getAttribute("data-ln-table-row-id"), C = E._lnRecord || {};
      k(r, "ln-table:row-action", {
        table: g.name,
        id: S,
        action: A,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : k(r, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      g.tbody.rows.length > 0 && (g._emptyTbodyObserver.disconnect(), g._emptyTbodyObserver = null, g._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(a) {
      if (!a.detail || a.detail.column == null) return;
      a.preventDefault();
      const v = a.detail.direction === "none" ? null : a.detail.direction;
      g._sortCol = v === null ? -1 : a.detail.column, g._sortDir = v, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), k(r, "ln-table:sorted", {
        column: a.detail.column,
        direction: a.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, r.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(a) {
      if (a.preventDefault(), !a.detail) return;
      const v = a.detail.key, E = a.detail.values || [];
      if (v) {
        if (E.length === 0)
          delete g._columnFilters[v];
        else {
          const A = [];
          for (let S = 0; S < E.length; S++)
            A.push(E[S].toLowerCase());
          g._columnFilters[v] = A;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), k(r, "ln-table:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, r.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  b.prototype._parseRows = function() {
    const r = this.tbody.rows, _ = this.ths;
    this._data = [], r.length > 0 && (this._rowHeight = r[0].offsetHeight || 40), this._lockColumnWidths();
    for (let g = 0; g < r.length; g++) {
      const a = r[g], v = [], E = [], A = [];
      for (let C = 0; C < a.cells.length; C++) {
        const L = a.cells[C], I = L.textContent.trim();
        v[C] = At(L), E[C] = I.toLowerCase(), L.querySelector("[data-ln-table-row-action]") || A.push(I.toLowerCase());
      }
      let S = null;
      if (this.isDataDriven) {
        S = {};
        const C = a.getAttribute("data-ln-table-row-id");
        C != null && (S.id = C);
        for (let L = 0; L < _.length; L++) {
          const I = _[L].getAttribute("data-ln-table-col");
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
        values: v,
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
    const r = document.createElement("colgroup");
    this.ths.forEach(function(_) {
      const g = document.createElement("col");
      g.style.width = _.offsetWidth + "px", r.appendChild(g);
    }), this.table.insertBefore(r, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = r;
  }, b.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const r = this._lastTotal, _ = this.visibleCount;
        if (r === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const r = this._filteredData.length;
        r === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : r > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, b.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const r = this._filteredData, _ = document.createDocumentFragment();
      for (let g = 0; g < r.length; g++) {
        const a = this._buildRow(r[g]);
        if (!a) break;
        _.appendChild(a);
      }
      this.tbody.replaceChildren(_), this._selectable && this._updateSelectAll();
    } else {
      const r = [], _ = this._filteredData;
      for (let g = 0; g < _.length; g++) r.push(_[g].html);
      this.tbody.innerHTML = r.join(""), this._selectable && this._restoreSelection();
    }
  }, b.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const r = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let g = null;
        if (this._windowed) {
          const a = this._cache ? this._cache.peek() : null;
          g = a ? this._buildRow(a) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (g = this._buildRow(this._data[0]));
        g && this.tbody && (this.tbody.appendChild(g), this._rowHeight = g.offsetHeight || 40, g.remove());
      }
    this.isDataDriven ? this._scrollContainer = h(this.dom) : this._scrollContainer = null;
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      r._rafId || (r._rafId = requestAnimationFrame(function() {
        r._rafId = null, r._windowed ? r._renderWindowed() : r._renderVirtual();
      }));
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const r = this._filteredData, _ = r.length, g = this._rowHeight;
    if (!g || !_) return;
    const a = this.thead ? this.thead.offsetHeight : 0, v = this._scrollContainer;
    let E, A;
    if (v) {
      const O = this.table.getBoundingClientRect(), F = v.getBoundingClientRect(), U = O.top - F.top + v.scrollTop + a;
      E = v.scrollTop - U, A = v.clientHeight;
    } else {
      const U = this.table.getBoundingClientRect().top + window.scrollY + a;
      E = window.scrollY - U, A = window.innerHeight;
    }
    const S = fn(E, A, g, _, 15), C = S.start, L = S.end;
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
        const U = this._buildRow(r[F]);
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
      for (let F = C; F < L; F++) O += r[F].html;
      D > 0 && (O += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + I + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = O, this._selectable && this._restoreSelection();
    }
  }, b.prototype._buildPlaceholderRow = function() {
    const r = document.createElement("tr");
    r.className = "ln-table__placeholder", r.setAttribute("aria-hidden", "true");
    const _ = document.createElement("td");
    return _.setAttribute("colspan", this.ths.length || 1), _.style.height = this._rowHeight + "px", r.appendChild(_), r;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const r = this._rowHeight;
    if (!r) return;
    const _ = this._cache.logicalTotal, g = this.thead ? this.thead.offsetHeight : 0, a = this._scrollContainer;
    let v, E;
    if (a) {
      const O = this.table.getBoundingClientRect(), F = a.getBoundingClientRect(), U = O.top - F.top + a.scrollTop + g;
      v = a.scrollTop - U, E = a.clientHeight;
    } else {
      const U = this.table.getBoundingClientRect().top + window.scrollY + g;
      v = window.scrollY - U, E = window.innerHeight;
    }
    const A = fn(v, E, r, _, 15), S = A.start, C = A.end, L = this.ths.length || 1, I = A.topPadding, q = A.bottomPadding, D = document.createDocumentFragment();
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
    const r = this.ths.length || 1;
    let _ = null, g = null;
    if (this.isDataDriven) {
      const a = this._lastTotal != null ? this._lastTotal : this._data.length, E = this.visibleCount === 0 && a > 0, A = E ? this.name + "-empty-filtered" : this.name + "-empty";
      if (g = Lt(this.dom, A, "ln-table"), !g) {
        const S = this.dom.querySelector("template[data-ln-table-empty]");
        if (S) {
          const C = E ? "search" : "initial", L = S.content.querySelector('[data-ln-table-empty-when="' + C + '"]') || S.content.firstElementChild;
          L && (g = document.importNode(L, !0));
        }
      }
      if (g)
        if (g.tagName === "TR")
          _ = g;
        else {
          const S = document.createElement("td");
          S.setAttribute("colspan", String(r)), S.appendChild(g);
          const C = document.createElement("tr");
          C.className = "ln-table__empty", C.appendChild(S), _ = C;
        }
    } else {
      const a = this.dom.querySelector("template[" + i + "]"), v = document.createElement("td");
      v.setAttribute("colspan", String(r)), a && v.appendChild(document.importNode(a.content, !0));
      const E = document.createElement("tr");
      E.className = "ln-table__empty", E.appendChild(v), _ = E;
    }
    _ ? this.tbody.replaceChildren(_) : this.tbody.replaceChildren(), k(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._fillRow = function(r, _) {
    Zt(r, _);
    const g = r.querySelectorAll("[data-ln-table-cell-attr]");
    for (let a = 0; a < g.length; a++) {
      const v = g[a], E = v.getAttribute("data-ln-table-cell-attr").split(",");
      for (let A = 0; A < E.length; A++) {
        const S = E[A].trim().split(":");
        if (S.length !== 2) continue;
        const C = S[0].trim(), L = S[1].trim();
        _[C] != null && v.setAttribute(L, _[C]);
      }
    }
  }, b.prototype._buildRow = function(r) {
    let _ = Lt(this.dom, this.name + "-row", "ln-table");
    if (!_) {
      const a = this.dom.querySelector("template[data-ln-table-row]");
      a && (_ = document.importNode(a.content, !0));
    }
    let g = _ ? _.querySelector("[data-ln-table-row]") || _.firstElementChild : null;
    if (g)
      this._fillRow(g, r);
    else if (r && r.html) {
      const a = document.createElement("tbody");
      a.innerHTML = r.html, g = a.firstElementChild;
    } else {
      g = document.createElement("tr"), g.setAttribute("data-ln-table-row", "");
      const a = this.ths;
      for (let v = 0; v < a.length; v++) {
        const E = a[v].hasAttribute("data-ln-table-col-select"), A = document.createElement("td");
        if (E) {
          const S = document.createElement("input");
          S.type = "checkbox", S.setAttribute("data-ln-table-row-select", ""), S.setAttribute("aria-label", "Select row"), A.appendChild(S);
        } else {
          const S = a[v].getAttribute("data-ln-table-col");
          S && r[S] != null && (A.textContent = String(r[S]));
        }
        g.appendChild(A);
      }
    }
    if (g._lnRecord = r, r.id != null && g.setAttribute("data-ln-table-row-id", r.id), this._selectable && r.id != null && this.selectedIds.has(String(r.id))) {
      g.classList.add("ln-row-selected");
      const a = g.querySelector("[data-ln-table-row-select]");
      a && (a.checked = !0);
    }
    return g;
  }, b.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    wn(this, "ln-table:request-data", "table");
  }, b.prototype._enterWindowedMode = function() {
    const r = this, _ = this.dom, g = parseInt(_.getAttribute("data-ln-table-window"), 10), a = parseInt(_.getAttribute("data-ln-table-window-page"), 10), v = parseInt(_.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !r._windowed || !r._cache || (r.totalCount = r._cache.grandTotal, r.visibleCount = r._cache.logicalTotal, r._lastTotal = r._cache.grandTotal, r.isLoaded = !0, r._vStart = -1, r._vEnd = -1, r._render(), r._updateFooter(), k(_, "ln-table:rendered", {
        table: r.name,
        total: r.totalCount,
        visible: r.visibleCount
      }));
    }, this._renderBatch = Ht(this._onCacheChange), this._cache = Un({
      windowSize: g > 0 ? g : 1e3,
      pageSize: a > 0 ? a : 200,
      threshold: v >= 0 ? v : 25,
      fetchDebounce: 120,
      requestPage: function(E, A, S) {
        k(_, "ln-table:request-data", {
          table: r.name,
          sort: E.sort,
          filters: E.filters,
          search: E.search,
          offset: A,
          limit: S,
          queryGen: r._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, b.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let r = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(r) && this._totalSpan) {
        const g = this._totalSpan.textContent.replace(/[^\d]/g, "");
        g && (r = parseInt(g, 10));
      }
      const _ = r > 0 ? r : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: _,
        filtered: _
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
    const r = this.tbody.querySelectorAll("[data-ln-table-row]"), _ = [];
    for (let a = 0; a < r.length; a++) {
      const v = r[a].getAttribute("data-ln-table-row-id");
      v != null && _.push(v);
    }
    const g = Pr(_, this.selectedIds);
    this._selectAllCheckbox.checked = g.isAllSelected, this._selectAllCheckbox.indeterminate = g.isIndeterminate;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const r = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let _ = 0; _ < r.length; _++) {
      const g = r[_].getAttribute("data-ln-table-row-id"), a = g != null && this.selectedIds.has(g);
      r[_].classList.toggle("ln-row-selected", a);
      const v = r[_].querySelector("[data-ln-table-row-select]");
      v && (v.checked = a);
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
    const r = this;
    if (this._onSelectionChange = function(_) {
      const g = _.target.closest("[data-ln-table-row-select]");
      if (!g) return;
      const a = g.closest("[data-ln-table-row]");
      if (!a) return;
      const v = a.getAttribute("data-ln-table-row-id");
      v != null && (r.selectedIds = hn(r.selectedIds, v, g.checked), a.classList.toggle("ln-row-selected", g.checked), r.selectedCount = r.selectedIds.size, r._updateSelectAll(), r._updateFooter(), k(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const _ = document.createElement("input");
      _.type = "checkbox";
      const g = r.dom.querySelector('[data-ln-table-dict="select-all"]'), a = r.dom.getAttribute("data-ln-table-select-all-label") || (g ? g.textContent.trim() : null) || "Select all";
      _.setAttribute("aria-label", a), this._selectAllCheckbox.appendChild(_), this._selectAllCheckbox = _;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = r._selectAllCheckbox.checked, g = r.tbody ? r.tbody.querySelectorAll("[data-ln-table-row]") : [], a = [];
      for (let v = 0; v < g.length; v++) {
        const E = g[v].getAttribute("data-ln-table-row-id"), A = g[v].querySelector("[data-ln-table-row-select]");
        E != null && (a.push(E), g[v].classList.toggle("ln-row-selected", _), A && (A.checked = _));
      }
      r.selectedIds = pn(r.selectedIds, a, _), r.selectedCount = r.selectedIds.size, k(r.dom, "ln-table:select-all", {
        table: r.name,
        selected: _
      }), k(r.dom, "ln-table:select", {
        table: r.name,
        selectedIds: r.selectedIds,
        count: r.selectedCount
      }), r._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < _.length; g++) {
        const a = _[g].querySelector("[data-ln-table-row-select]"), v = _[g].getAttribute("data-ln-table-row-id");
        a && a.checked && v != null && (r.selectedIds = hn(r.selectedIds, v, !0), _[g].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, b.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const r = this.dom.querySelector("[data-ln-table-col-select]");
    if (r) {
      const _ = r.querySelector('input[type="checkbox"]');
      _ && _.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = pn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const _ = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let g = 0; g < _.length; g++) {
        _[g].classList.remove("ln-row-selected");
        const a = _[g].querySelector("[data-ln-table-row-select]");
        a && (a.checked = !1);
      }
    }
    this._updateFooter();
  }, b.prototype._updateFooter = function() {
    let r = 0, _ = 0;
    this.isDataDriven ? (r = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (r = this._data.length, _ = this._filteredData.length);
    const g = _ < r;
    if (this._totalSpan && (this._totalSpan.textContent = w(r, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = g ? w(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !g), this._selectedSpan) {
      const a = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = a > 0 ? w(a, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", a === 0);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, b, "ln-table", {
    attributes: o
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
  function u(c, s) {
    const n = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", f = c.querySelector(n) || document.querySelector(n);
    return f ? f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector("input, textarea") : null;
  }
  function m(c, s) {
    if (s) {
      const f = c.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (f.length > 0) return f;
      const p = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (p.length > 0) return p;
    }
    const n = c.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function l(c) {
    const s = c.dom;
    function n(f) {
      const p = f.target;
      if (p && p.hasAttribute && (p.hasAttribute("data-ln-table") || p.tagName === "TABLE")) return p;
      const o = f.detail && f.detail.targetId || p && p.id;
      if (!o) return null;
      const y = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(o) : o.replace(/(["\\])/g, "\\$1");
      return s.querySelector('[data-ln-table-source="' + y + '"]') || s.querySelector('[data-ln-table="' + y + '"]') || (s.id === o ? s : null) || document.getElementById(o);
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(f) {
        if (!f.detail) return;
        const p = n(f);
        if (!p) return;
        const o = f.detail.key, y = f.detail.values || [], w = p.querySelectorAll("th");
        for (let h = 0; h < w.length; h++)
          if ((w[h].getAttribute("data-ln-table-filter-col") || w[h].getAttribute("data-ln-filter-col") || w[h].getAttribute("data-ln-filter-key") || w[h].getAttribute("data-ln-field")) === o) {
            const r = w[h].querySelector("[data-ln-table-col-filter], .table-filter");
            r && r.classList.toggle("ln-filter-active", y.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(f) {
        const p = f.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!p) return;
        const o = p.closest("[data-ln-table], table") || s.querySelector("[data-ln-table], table");
        if (!o) return;
        const y = o.lnTable && o.lnTable.name || o.id, w = o.querySelectorAll("th");
        for (let _ = 0; _ < w.length; _++) {
          const g = w[_].querySelector("[data-ln-table-col-filter], .table-filter");
          g && g.classList.remove("ln-filter-active");
        }
        const h = o.getAttribute("data-ln-table-source") || o.id, b = h ? document.getElementById(h) : null;
        if (b && b.hasAttribute("data-ln-search"))
          b.setAttribute("data-ln-search", "");
        else {
          const _ = u(s, h);
          _ && _.value !== "" && (_.value = "", _.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const r = m(s, h);
        for (let _ = 0; _ < r.length; _++) {
          const g = r[_].querySelector("[data-ln-filter-reset]");
          if (!g) continue;
          const a = r[_].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!g.checked || a) && (g.checked = !0, g.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        o.lnTable && !o.hasAttribute("data-ln-table-source") && k(o, "ln-table:request-clear-filters", { table: y });
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
  function s(a, v) {
    if (!a || !a.isDataDriven) return;
    const E = a.dom.hasAttribute("data-ln-list-window");
    if (E && !a._windowed)
      a._enterWindowedMode(), a._kickWindowInitial();
    else if (!E && a._windowed)
      a._exitWindowedMode();
    else if (E && a._windowed) {
      const A = parseInt(v, 10);
      A > 0 && a._cache.configure({ windowSize: A });
    }
  }
  function n(a, v) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const E = parseInt(v, 10);
    E > 0 && a._cache.configure({ pageSize: E });
  }
  function f(a, v) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const E = parseInt(v, 10);
    E >= 0 && a._cache.configure({ threshold: E });
  }
  function p(a, v) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const E = parseInt(v, 10);
    E >= 0 && a._cache.setGrandTotal(E);
  }
  const o = {
    "data-ln-list": { prop: "name", type: "string", read: K, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: f, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: p, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, y = X(o);
  function w(a, v) {
    if (a == null || isNaN(a)) return "";
    try {
      return new Intl.NumberFormat(J(v)).format(a);
    } catch {
      return String(a);
    }
  }
  function h(a) {
    let v = a;
    for (; v && v !== document.body && v !== document.documentElement; ) {
      const A = getComputedStyle(v).overflowY;
      if (A === "auto" || A === "scroll") return v;
      v = v.parentElement;
    }
    return null;
  }
  function b(a) {
    const v = a._scrollContainer || h(a.dom);
    return {
      container: v,
      top: v ? v.scrollTop : window.scrollY
    };
  }
  function r(a) {
    a.container ? a.container.scrollTop = a.top : window.scrollTo(window.scrollX, a.top);
  }
  function _(a) {
    if (!a) return 0;
    const v = getComputedStyle(a), E = parseFloat(v.marginTop) || 0, A = parseFloat(v.marginBottom) || 0;
    return a.offsetHeight + E + A;
  }
  function g(a) {
    this.dom = a, Y(this, a, y), this.tbody = a.querySelector("[data-ln-list-body]") || a, this.isDataDriven = a.hasAttribute("data-ln-list-source"), this._totalSpan = a.querySelector("[data-ln-list-total]"), this._filteredSpan = a.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== a ? this._filteredSpan.parentElement : null), this._selectedSpan = a.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== a ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const v = this;
    return this._onSetSearch = function(E) {
      const A = (E.detail && E.detail.query != null ? E.detail.query : E.detail && E.detail.term != null ? E.detail.term : "").trim();
      v.isDataDriven ? (v.currentSearch = A, k(a, "ln-list:search", {
        list: v.name,
        query: v.currentSearch
      }), v._requestData()) : (v._searchTerm = A.toLowerCase(), v._applyFilterAndSort(), v._vStart = -1, v._vEnd = -1, v._render(), v._updateFooter(), k(a, "ln-list:filter", {
        term: v._searchTerm,
        matched: v._filteredData.length,
        total: v._data.length
      }));
    }, a.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(E) {
      E.preventDefault(), v._onSetSearch(E);
    }, a.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      v.isDataDriven ? (v.currentFilters = {}, v.currentSearch = "", k(a, "ln-list:clear-filters", { list: v.name }), v._requestData()) : (v._searchTerm = "", v._filters = {}, v._sortField = null, v._sortDir = null, v._applyFilterAndSort(), v._vStart = -1, v._vEnd = -1, v._render(), v._updateFooter(), k(a, "ln-list:filter", {
        term: "",
        matched: v._filteredData.length,
        total: v._data.length
      }));
    }, a.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, a.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(E) {
      const A = E.detail || {}, S = A.data || [], C = A.total != null ? A.total : S.length;
      if (!(v._hasInitialSeed && !v.isLoaded && S.length === 0 && C === 0)) {
        if (v._windowed) {
          v._cache.ingest(A) && !A.provisional && a.classList.remove("ln-list--loading");
          return;
        }
        v._data = S, v._lastTotal = C, v._lastFiltered = A.filtered != null ? A.filtered : v._data.length, v.totalCount = v._lastTotal, v.visibleCount = v._lastFiltered, v.isLoaded = !0, v._hasInitialSeed = !1, a.classList.remove("ln-list--loading"), v._vStart = -1, v._vEnd = -1, v._applyFilterAndSort(), v._render(), v._updateFooter(), k(a, "ln-list:rendered", {
          list: v.name,
          total: v.totalCount,
          visible: v.visibleCount
        });
      }
    }, a.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(E) {
      const A = E.detail && E.detail.loading;
      a.classList.toggle("ln-list--loading", !!A), A && (v.isLoaded = !1);
    }, a.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(E) {
      !v._windowed || !v._cache || v._cache.release(E.detail && E.detail.offset);
    }, a.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !v._windowed || !v._cache || v._cache.revalidate();
    }, a.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !v._windowed || !v._cache || v._requestData();
    }, a.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(E) {
      !E.detail || E.detail.field == null || (E.preventDefault(), v.currentSort = E.detail.direction === "none" ? null : { field: E.detail.field, direction: E.detail.direction }, v._requestData());
    }, a.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(E) {
      if (E.target.closest("[data-ln-item-select]") || E.target.closest("[data-ln-item-action]") || E.target.closest("a") || E.target.closest("button") || E.ctrlKey || E.metaKey || E.button === 1) return;
      const A = E.target.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id"), C = A._lnRecord || {};
      k(a, "ln-list:item-click", {
        list: v.name,
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
        list: v.name,
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
      v.tbody.children.length > 0 && (v._emptyObserver.disconnect(), v._emptyObserver = null, v._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(E) {
      if (E.preventDefault(), !E.detail) return;
      const A = E.detail.key, S = E.detail.values || [];
      if (A) {
        if (S.length === 0)
          delete v._filters[A];
        else {
          const C = [];
          for (let L = 0; L < S.length; L++)
            C.push(S[L].toLowerCase());
          v._filters[A] = C;
        }
        v._applyFilterAndSort(), v._vStart = -1, v._vEnd = -1, v._render(), v._updateFooter(), k(a, "ln-list:filter", {
          term: v._searchTerm,
          matched: v._filteredData.length,
          total: v._data.length
        });
      }
    }, a.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(E) {
      if (!E.detail || E.detail.field == null) return;
      E.preventDefault();
      const A = E.detail.direction === "none" ? null : E.detail.direction;
      v._sortField = A === null ? null : E.detail.field, v._sortDir = A, v._applyFilterAndSort(), v._vStart = -1, v._vEnd = -1, v._render(), v._updateFooter(), k(a, "ln-list:sorted", {
        field: v._sortField,
        direction: E.detail && E.detail.direction,
        matched: v._filteredData.length,
        total: v._data.length
      });
    }, a.addEventListener("ln-sort:change", this._onSort)), this;
  }
  g.prototype._parseChildren = function() {
    const a = Array.from(this.tbody.children).filter((v) => !v.classList.contains("ln-list__spacer"));
    this._data = [], a.length > 0 && (this._itemHeight = _(a[0]) || 50);
    for (let v = 0; v < a.length; v++) {
      const E = a[v], A = E.getAttribute("data-ln-item-id") || E.getAttribute("id"), S = E.textContent.trim().toLowerCase();
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
  }, g.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const a = this._searchTerm, v = a ? a.split(/\s+/).filter(Boolean) : [], E = this._filters || {}, A = Object.keys(E).length > 0;
      if (v.length === 0 && !A ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (v.length > 0 && !v.every(function(L) {
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
  }, g.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const a = this._lastTotal, v = this.visibleCount;
        if (a === 0 || this._filteredData.length === 0 || v === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const a = this._filteredData.length;
        a === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : a > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, g.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const a = this._filteredData, v = document.createDocumentFragment();
      for (let A = 0; A < a.length; A++) {
        const S = this._buildItem(a[A]);
        S && v.appendChild(S);
      }
      const E = b(this);
      this.tbody.replaceChildren(v), r(E), this._selectable && this._updateSelectAll();
    } else {
      const a = [], v = this._filteredData;
      for (let A = 0; A < v.length; A++) a.push(v[A].html);
      const E = b(this);
      this.tbody.innerHTML = a.join(""), r(E), this._selectable && this._restoreSelection();
    }
  }, g.prototype._readGridLayout = function() {
    const a = getComputedStyle(this.tbody), v = a.gridTemplateColumns;
    let E = 1;
    if (v && v !== "none") {
      const S = v.trim().split(/\s+/).filter(Boolean);
      S.length > 0 && (E = S.length);
    }
    const A = parseFloat(a.rowGap);
    return { columns: E, rowGap: isNaN(A) ? 0 : A };
  }, g.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const a = this._cache.peek(), v = a ? this._buildItem(a) : this._buildPlaceholderItem();
      v && (this.tbody.textContent = "", this.tbody.appendChild(v), this._itemHeight = _(v) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const a = this._buildItem(this._data[0]);
        a && (this.tbody.textContent = "", this.tbody.appendChild(a), this._itemHeight = _(a) || 50, this.tbody.textContent = "");
      }
    } else {
      const a = this.tbody.children;
      a.length > 0 && (this._itemHeight = _(a[0]) || 50);
    }
  }, g.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const a = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = h(this.dom);
    const v = this._scrollContainer || window;
    this._scrollHandler = function() {
      a._rafId || (a._rafId = requestAnimationFrame(function() {
        a._rafId = null, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, this._resizeRafId = null, this._resizeHandler = function() {
      a._resizeRafId || (a._resizeRafId = requestAnimationFrame(function() {
        a._resizeRafId = null, a._itemHeight = 0, a._measureItemHeight(), a._vStart = -1, a._vEnd = -1, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, v.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, g.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._resizeRafId && (cancelAnimationFrame(this._resizeRafId), this._resizeRafId = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, g.prototype._renderVirtual = function() {
    const a = this._filteredData, v = a.length, E = this._itemHeight;
    if (!E || !v) return;
    const A = this._scrollContainer;
    let S, C;
    if (A) {
      const nt = this.tbody.getBoundingClientRect(), V = A.getBoundingClientRect(), W = A === this.tbody ? 0 : nt.top - V.top + A.scrollTop;
      S = A.scrollTop - W, C = A.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      S = window.scrollY - V, C = window.innerHeight;
    }
    const L = this._readGridLayout(), I = L.columns, q = L.rowGap, D = E + q, O = Math.ceil(v / I);
    let F = Math.max(0, Math.floor(S / D) - 15);
    F = Math.min(F, O);
    const U = Math.ceil(C / D) + 30, j = Math.min(F + U, O), G = Math.min(F * I, v), tt = Math.min(j * I, v);
    if (G === this._vStart && tt === this._vEnd) return;
    this._vStart = G, this._vEnd = tt;
    const bt = F * D, at = (O - j) * D;
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
      this.tbody.replaceChildren(nt), r(V), this._selectable && this._updateSelectAll();
    } else {
      let nt = "";
      bt > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${bt}px"></${this.isUl ? "li" : "div"}>`);
      for (let W = G; W < tt; W++)
        nt += a[W].html;
      at > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${at}px"></${this.isUl ? "li" : "div"}>`);
      const V = b(this);
      this.tbody.innerHTML = nt, r(V), this._selectable && this._restoreSelection();
    }
  }, g.prototype._buildPlaceholderItem = function() {
    const a = document.createElement(this.isUl ? "li" : "div");
    return a.className = "ln-list__placeholder", a.setAttribute("aria-hidden", "true"), a.style.height = this._itemHeight + "px", a;
  }, g.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const a = this._itemHeight;
    if (!a) return;
    const v = this._scrollContainer;
    let E, A;
    if (v) {
      const V = this.tbody.getBoundingClientRect(), W = v.getBoundingClientRect(), yt = v === this.tbody ? 0 : V.top - W.top + v.scrollTop;
      E = v.scrollTop - yt, A = v.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      E = window.scrollY - W, A = window.innerHeight;
    }
    const S = this._readGridLayout(), C = S.columns, L = S.rowGap, I = a + L, q = this._cache.logicalTotal, D = Math.ceil(q / C);
    let O = Math.max(0, Math.floor(E / I) - 15);
    O = Math.min(O, D);
    const F = Math.ceil(A / I) + 30, U = Math.min(O + F, D), j = Math.min(O * C, q), G = Math.min(U * C, q), tt = O * I, bt = (D - U) * I, at = document.createDocumentFragment();
    if (tt > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = tt + "px", at.appendChild(V);
    }
    for (let V = j; V < G; V++)
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
    this.tbody.replaceChildren(at), r(nt), this._vStart = j, this._vEnd = G, this._cache.ensure(j, G);
  }, g.prototype._showEmptyState = function() {
    let a = null;
    if (this.isDataDriven) {
      const v = this._lastTotal != null ? this._lastTotal : this._data.length, A = this.visibleCount === 0 && v > 0, S = A ? this.name + "-empty-filtered" : this.name + "-empty";
      if (a = Lt(this.dom, S, "ln-list"), !a) {
        const C = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (C) {
          const L = A ? "search" : "initial", I = C.content.querySelector(`[data-ln-empty-when="${L}"]`) || C.content.firstElementChild;
          I && (a = document.importNode(I, !0));
        }
      }
    } else {
      const v = this.dom.querySelector(`template[${i}]`);
      if (v) {
        const E = v.content.firstElementChild;
        E && (a = document.importNode(E, !0));
      }
    }
    if (a)
      if (a.tagName === "LI" || a.tagName === "TR")
        this.tbody.replaceChildren(a);
      else {
        const v = document.createElement(this.isUl ? "li" : "div");
        v.appendChild(a), this.tbody.replaceChildren(v);
      }
    else
      this.tbody.replaceChildren();
    k(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, g.prototype._buildItem = function(a) {
    let v = Lt(this.dom, this.name + "-row", "ln-list");
    if (!v) {
      const A = this.dom.querySelector("template[data-ln-item]");
      A && (v = document.importNode(A.content, !0));
    }
    let E = v ? v.querySelector("[data-ln-item]") || v.firstElementChild : null;
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
  }, g.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    for (let v = 0; v < a.length; v++) {
      const E = a[v].getAttribute("data-ln-item-id"), A = E != null && this.selectedIds.has(String(E));
      a[v].classList.toggle("ln-item-selected", A);
      const S = a[v].querySelector("[data-ln-item-select]");
      S && (S.checked = A);
    }
    this._updateSelectAll();
  }, g.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const a = this;
    this._onSelectionChange = function(v) {
      const E = v.target.closest("[data-ln-item-select]");
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
      const v = a._selectAllCheckbox.checked, E = a.tbody.querySelectorAll("[data-ln-item]");
      for (let A = 0; A < E.length; A++) {
        const S = E[A], C = S.getAttribute("data-ln-item-id"), L = S.querySelector("[data-ln-item-select]");
        C != null && (v ? (a.selectedIds.add(String(C)), S.classList.add("ln-item-selected")) : (a.selectedIds.delete(String(C)), S.classList.remove("ln-item-selected")), L && (L.checked = v));
      }
      k(a.dom, "ln-list:select-all", { list: a.name, selected: v }), k(a.dom, "ln-list:select", {
        list: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedIds.size
      }), a._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, g.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const a = this.tbody.querySelectorAll("[data-ln-item]");
    let v = a.length > 0;
    for (let E = 0; E < a.length; E++) {
      const A = a[E].getAttribute("data-ln-item-id");
      if (A != null && !this.selectedIds.has(String(A))) {
        v = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = v;
  }, g.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    wn(this, "ln-list:request-data", "list");
  }, g.prototype._enterWindowedMode = function() {
    const a = this, v = this.dom, E = parseInt(v.getAttribute("data-ln-list-window"), 10), A = parseInt(v.getAttribute("data-ln-list-window-page"), 10), S = parseInt(v.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !a._windowed || !a._cache || (a.totalCount = a._cache.grandTotal, a.visibleCount = a._cache.logicalTotal, a._lastTotal = a._cache.grandTotal, a.isLoaded = !0, a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), k(v, "ln-list:rendered", {
        list: a.name,
        total: a.totalCount,
        visible: a.visibleCount
      }));
    }, this._renderBatch = Ht(this._onCacheChange), this._cache = Un({
      windowSize: E > 0 ? E : 1e3,
      pageSize: A > 0 ? A : 200,
      threshold: S >= 0 ? S : 25,
      fetchDebounce: 120,
      requestPage: function(C, L, I) {
        k(v, "ln-list:request-data", {
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
  }, g.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const a = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), v = a > 0 ? a : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: v,
        filtered: v
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
    let a = 0, v = 0;
    this.isDataDriven ? (a = this._lastTotal != null ? this._lastTotal : this._data.length, v = this.visibleCount) : (a = this._data.length, v = this._filteredData.length);
    const E = v < a;
    if (this._totalSpan && (this._totalSpan.textContent = w(a, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = E ? w(v, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !E), this._selectedSpan) {
      const A = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = A > 0 ? w(A, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", A === 0);
    }
  }, g.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, g, "ln-list", {
    attributes: o
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(o) {
    const y = o[e];
    y && p.call(y);
  }
  const d = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, u = "http://www.w3.org/2000/svg", m = 36, l = 16, c = 2 * Math.PI * l;
  function s(o) {
    return this.dom = o, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, f.call(this), p.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(o, y) {
    const w = document.createElementNS(u, o);
    for (const [h, b] of Object.entries(y))
      w.setAttribute(h, b);
    return w;
  }
  function f() {
    this.svg = n("svg", {
      viewBox: "0 0 " + m + " " + m,
      width: m,
      height: m
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: l,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: m / 2,
      cy: m / 2,
      r: l,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": c,
      "stroke-dashoffset": c,
      transform: "rotate(-90 " + m / 2 + " " + m / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function p() {
    const o = this.dom.getAttribute("data-ln-circular-progress"), y = this.dom.getAttribute("data-ln-circular-progress-max"), w = Vn(o, y || 100), h = c - w.percentage / 100 * c;
    this.progressCircle.setAttribute("stroke-dashoffset", h);
    const b = this.dom.getAttribute("data-ln-circular-progress-label"), r = b !== null ? b : Math.round(w.percentage) + "%";
    this.labelEl.textContent = r, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(w.min)), this.dom.setAttribute("aria-valuemax", String(w.max)), this.dom.setAttribute("aria-valuenow", String(w.clampedValue)), this.dom.setAttribute("aria-valuetext", r), k(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: w.value,
      max: w.max,
      percentage: w.percentage
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
    "data-ln-sortable": { effect: m, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function u(l) {
    this.dom = l, this.isEnabled = l.getAttribute(t) !== "disabled", this._dragging = null, l.setAttribute("aria-roledescription", "sortable list");
    const c = this;
    return this._onPointerDown = function(s) {
      c.isEnabled && c._handlePointerDown(s);
    }, l.addEventListener("pointerdown", this._onPointerDown), this;
  }
  u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, u.prototype._handlePointerDown = function(l) {
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
    const f = Array.from(this.dom.children).indexOf(s);
    if (Q(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: f
    }).defaultPrevented) return;
    l.preventDefault(), c.setPointerCapture(l.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), k(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: f
    });
    const o = this;
    let y = null, w = null;
    const h = function(r) {
      w = r, !y && (y = requestAnimationFrame(function() {
        y = null, w && o._handlePointerMove(w);
      }));
    }, b = function(r) {
      y && (cancelAnimationFrame(y), y = null), o._handlePointerEnd(r), c.removeEventListener("pointermove", h), c.removeEventListener("pointerup", b), c.removeEventListener("pointercancel", b);
    };
    c.addEventListener("pointermove", h), c.addEventListener("pointerup", b), c.addEventListener("pointercancel", b);
  }, u.prototype._handlePointerMove = function(l) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), s = this._dragging;
    let n = null, f = null;
    for (let p = 0; p < c.length; p++) {
      const o = c[p];
      if (o === s) continue;
      const y = o.getBoundingClientRect(), w = y.top + y.height / 2;
      if (l.clientY >= y.top && l.clientY < w) {
        n = o, f = "before";
        break;
      } else if (l.clientY >= w && l.clientY <= y.bottom) {
        n = o, f = "after";
        break;
      }
    }
    if (!(this._lastDropTarget === n && this._lastDropPos === f)) {
      this._lastDropTarget && this._lastDropTarget !== n && this._lastDropTarget.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after"), this._lastDropTarget = n, this._lastDropPos = f;
      for (let p = 0; p < c.length; p++) {
        const o = c[p];
        o !== n && (o.classList.contains("ln-sortable--drop-before") && o.classList.remove("ln-sortable--drop-before"), o.classList.contains("ln-sortable--drop-after") && o.classList.remove("ln-sortable--drop-after"));
      }
      if (n) {
        const p = f === "before" ? "ln-sortable--drop-before" : "ln-sortable--drop-after", o = f === "before" ? "ln-sortable--drop-after" : "ln-sortable--drop-before";
        n.classList.contains(o) && n.classList.remove(o), n.classList.contains(p) || n.classList.add(p);
      }
    }
  }, u.prototype._handlePointerEnd = function(l) {
    if (!this._dragging) return;
    const c = this._dragging, s = Array.from(this.dom.children), n = s.indexOf(c);
    let f = null, p = null;
    for (const o of s) {
      if (o.classList.contains("ln-sortable--drop-before")) {
        f = o, p = "before";
        break;
      }
      if (o.classList.contains("ln-sortable--drop-after")) {
        f = o, p = "after";
        break;
      }
    }
    this._lastDropTarget = null, this._lastDropPos = null;
    for (const o of s)
      o.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), f && f !== c) {
      p === "before" ? this.dom.insertBefore(c, f) : this.dom.insertBefore(c, f.nextElementSibling);
      const y = Array.from(this.dom.children).indexOf(c);
      k(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: n,
        newIndex: y
      });
    }
    this._dragging = null;
  };
  function m(l) {
    const c = l[e];
    if (!c) return;
    const s = l.getAttribute(t) !== "disabled";
    s !== c.isEnabled && (c.isEnabled = s, k(l, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: l }));
  }
  H(t, e, u, "ln-sortable", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", d = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: c, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: s, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function m(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = l(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const f of [this.available, this.selected])
      for (const p of f.children)
        this._initial.push(p);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), delete this.dom[e]);
  }, m.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, m.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, m.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let p = 0; p < n.length; p++)
      this._initial.includes(n[p]) || this._initial.push(n[p]);
    let f = 0;
    for (let p = 0; p < this._initial.length; p++) {
      const o = this._initial[p];
      if (!o.isConnected) continue;
      const y = o.querySelector('input[type="checkbox"]');
      if (!y) continue;
      let w;
      y.checked ? this.max === null || f < this.max ? (w = this.selected, f++) : (y.checked = !1, w = this.available) : w = this.available, w.appendChild(o);
    }
  }, m.prototype._onFormReset = function(n) {
    const f = this;
    setTimeout(function() {
      f._destroyed || n.defaultPrevented || f.sync();
    }, 0);
  }, m.prototype._onChange = function(n) {
    const f = n.target.closest('input[type="checkbox"]');
    if (!f) return;
    const p = f.closest("li");
    if (!p) return;
    const o = p.parentElement;
    if (o !== this.available && o !== this.selected) return;
    if (!this.isEnabled) {
      f.checked = !f.checked;
      return;
    }
    const y = f.checked ? this.selected : this.available;
    if (o === y) return;
    if (y === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      f.checked = !f.checked, k(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: p,
        checkbox: f,
        count: this.selected.children.length
      });
      return;
    }
    const w = { item: p, from: o, to: y, checkbox: f };
    if (Q(this.dom, "ln-picklist:before-move", w).defaultPrevented) {
      f.checked = !f.checked;
      return;
    }
    const h = document.activeElement === f;
    y.appendChild(p), h && f.focus(), k(this.dom, "ln-picklist:move", w);
  };
  function l(n) {
    const f = n.getAttribute(d);
    if (f === null || f === "") return null;
    const p = parseInt(f, 10);
    return isNaN(p) || p < 0 ? null : p;
  }
  function c(n) {
    const f = n[e];
    if (!f) return;
    const p = n.getAttribute(t) !== "disabled";
    p !== f.isEnabled && (f.isEnabled = p, k(n, p ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function s(n) {
    const f = n[e];
    f && (f.max = l(n));
  }
  H(t, e, m, "ln-picklist", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", d = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function m(p, o, y) {
    return p.getAttribute(o) || y;
  }
  function l(p, o, y) {
    const w = parseFloat(p.getAttribute(o));
    return isNaN(w) || w <= 0 ? y : w;
  }
  function c(p) {
    const o = document.createElement("span");
    return o.setAttribute(d, ""), o.setAttribute("role", "alert"), o.textContent = p, o;
  }
  const s = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: m, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: l, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (p, o) => p.getAttribute(o) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = X(s);
  function f(p) {
    this.dom = p, Y(this, p, n), this.revertTimer = null, this._submitted = !1, this.idleEl = p.querySelector("[data-ln-confirm-idle]"), this.activeEl = p.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : p.textContent.trim();
    const o = this;
    return this._onClick = function(y) {
      if (!De(y))
        if (!o.confirming)
          y.preventDefault(), y.stopImmediatePropagation(), o._enterConfirm();
        else {
          if (o._submitted) return;
          o._submitted = !0, o._reset();
        }
    }, p.addEventListener("click", this._onClick), this;
  }
  f.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const p = this.activeEl ? this.activeEl.textContent.trim() : "";
      p && (this.dom.setAttribute("aria-label", p), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = p.getAttribute("href"), p.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(c(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), k(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const p = this, o = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      p._reset();
    }, o);
  }, f.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const p = this.dom.querySelector("svg.ln-icon use");
      p && this.originalIconHref && p.setAttribute("href", this.originalIconHref);
      const o = this.dom.querySelector("[" + d + "]");
      o && o.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, H(t, e, f, "ln-confirm", {
    attributes: s
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-translations": { type: "marker", description: "Mounts multi-language translation manager on form container" },
    "data-ln-translations-default": { prop: "defaultLang", read: K, type: "string", fallback: "", description: "Default primary language code (e.g. en)" },
    "data-ln-translations-placeholder": { prop: "placeholderLabel", read: K, type: "string", fallback: "{lang} translation", description: "Placeholder label pattern for cloned translation inputs" },
    "data-ln-translations-remove-label": { prop: "removeLabel", read: K, type: "string", fallback: "Remove {lang}", description: "Accessible label template for translation removal buttons" },
    "data-ln-translations-locales": { prop: "_localesRaw", read: K, type: "json", fallback: "", description: "JSON dictionary of supported locale codes and display labels" },
    "data-ln-translations-active": { type: "marker", description: "Container holding active language badge tags" },
    "data-ln-translations-add": { type: "string", description: "Trigger button action to add specified language translation fields" },
    "data-ln-translations-lang": { type: "string", description: "Language code associated with active language badge" },
    "data-ln-translations-prefix": { type: "string", description: "Prefix format pattern for cloned translated field names" },
    "data-ln-translatable": { type: "marker", description: "Marks form control as translatable into multiple languages" },
    "data-ln-translatable-lang": { type: "string", description: "Language code assigned to specific translatable input instance" }
  }, d = X(i), u = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function m(l) {
    if (this.dom = l, Y(this, l, d), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = l.querySelector("[data-ln-translations-active]"), this.menuEl = l.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = u, this._localesRaw)
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
  m.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const l = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const c of l) {
      const s = c.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, m.prototype._detectExisting = function() {
    const l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of l) {
      const s = c.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, m.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const l = this;
    let c = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      c++;
      const f = ae("ln-translations-menu-item", "ln-translations");
      if (!f) return;
      const p = f.querySelector("[data-ln-translations-lang]");
      p.setAttribute("data-ln-translations-lang", n), p.textContent = this.locales[n], p.addEventListener("click", function(o) {
        o.ctrlKey || o.metaKey || o.button === 1 || (o.preventDefault(), o.stopPropagation(), l.menuEl.getAttribute("data-ln-toggle") === "open" && l.menuEl.setAttribute("data-ln-toggle", "close"), l.addLanguage(n));
      }), this.menuEl.appendChild(f);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = c === 0);
  }, m.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const l = this;
    this.activeLanguages.forEach(function(c) {
      const s = ae("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", c);
      const f = n.querySelector("span");
      f.textContent = l.locales[c] || c.toUpperCase();
      const p = n.querySelector("button"), o = l.locales[c] || c.toUpperCase();
      p.setAttribute("aria-label", l.removeLabel.replace("{lang}", o)), p.addEventListener("click", function(y) {
        y.ctrlKey || y.metaKey || y.button === 1 || (y.preventDefault(), y.stopPropagation(), l.removeLanguage(c));
      }), l.badgesEl.appendChild(s);
    });
  }, m.prototype.addLanguage = function(l, c) {
    if (this.activeLanguages.has(l)) return;
    const s = this.locales[l] || l;
    if (Q(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: l,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(l), c = c || {};
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const p of f) {
      const o = p.getAttribute("data-ln-translatable"), y = p.getAttribute("data-ln-translations-prefix") || "", w = p.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!w) continue;
      const h = w.cloneNode(w.tagName === "SELECT");
      y ? h.name = y + "[trans][" + l + "][" + o + "]" : h.name = "trans[" + l + "][" + o + "]", h.value = c[o] !== void 0 ? c[o] : "", h.removeAttribute("id"), "placeholder" in h && (h.placeholder = this.placeholderLabel.replace("{lang}", s)), h.setAttribute("data-ln-translatable-lang", l);
      const b = p.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), r = b.length > 0 ? b[b.length - 1] : w;
      r.parentNode.insertBefore(h, r.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: l,
      langName: s
    });
  }, m.prototype.removeLanguage = function(l) {
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
  }, m.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, m.prototype.hasLanguage = function(l) {
    return this.activeLanguages.has(l);
  }, m.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const l = this.defaultLang, c = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of c)
      s.getAttribute("data-ln-translatable-lang") !== l && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, H(t, e, m, "ln-translations", {
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
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", d = "data-ln-autosave-debounce-input", u = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const m = {
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
    const f = s.getAttribute(t) || s.id, p = zr(window.location.pathname, f);
    if (!p) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", s);
      return;
    }
    this.dom = s, this.key = p;
    let o = null;
    function y() {
      const r = Oe(s, { exclude: u });
      try {
        localStorage.setItem(p, JSON.stringify(r));
      } catch {
        return;
      }
      k(s, "ln-autosave:saved", { target: s, data: r });
    }
    function w() {
      let r;
      try {
        r = localStorage.getItem(p);
      } catch {
        return;
      }
      if (!r) return;
      let _;
      try {
        _ = JSON.parse(r);
      } catch {
        return;
      }
      if (Q(s, "ln-autosave:before-restore", { target: s, data: _ }).defaultPrevented) return;
      const a = Ne(s, _);
      for (let v = 0; v < a.length; v++)
        a[v].dispatchEvent(new Event("input", { bubbles: !0 })), a[v].dispatchEvent(new Event("change", { bubbles: !0 }));
      k(s, "ln-autosave:restored", { target: s, data: _ });
    }
    function h() {
      try {
        localStorage.removeItem(p);
      } catch {
        return;
      }
      k(s, "ln-autosave:cleared", { target: s });
    }
    this._onFocusout = function(r) {
      const _ = r.target;
      l(_) && _.name && !_.matches(u) && y();
    }, this._onChange = function(r) {
      const _ = r.target;
      l(_) && _.name && !_.matches(u) && y();
    }, this._onSubmit = function() {
      h();
    }, this._onReset = function() {
      h();
    }, this._onClearClick = function(r) {
      r.target.closest("[" + i + "]") && h();
    }, s.addEventListener("focusout", this._onFocusout), s.addEventListener("change", this._onChange), s.addEventListener("submit", this._onSubmit), s.addEventListener("reset", this._onReset), s.addEventListener("click", this._onClearClick);
    const b = Kr(s.getAttribute(d));
    return b > 0 && (this._onInput = function(r) {
      const _ = r.target;
      !l(_) || !_.name || _.matches(u) || (o !== null && clearTimeout(o), o = setTimeout(y, b));
    }, s.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return o;
    }, w(), this;
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
    attributes: m
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
  }, u = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, m = {
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
  function s(r) {
    return !!(u[r] || m[r] || l[r] || r === "link");
  }
  function n(r) {
    this.dom = r;
    const _ = this;
    if (this._textarea = r.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", r), this;
    const g = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), g && this._surface.setAttribute("data-placeholder", g);
    const a = this._textarea.id;
    if (a) {
      const S = r.querySelector('label[for="' + a + '"]');
      S && (S.id || (S.id = a + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = a ? a + "-surface" : "ln-editor-surface-" + ++c;
    const v = this._textarea.value.trim();
    v && (this._surface.innerHTML = v);
    const E = r.querySelector('[role="toolbar"]');
    if (E && E.nextSibling ? r.insertBefore(this._surface, E.nextSibling) : r.appendChild(this._surface), E) {
      E.setAttribute("aria-controls", this._surface.id);
      const S = E.querySelectorAll("[data-ln-editor-action]");
      for (let C = 0; C < S.length; C++) {
        const L = S[C].getAttribute("data-ln-editor-action");
        s(L) && S[C].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      _._syncToTextarea(), k(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const C = S.target.closest("[data-ln-editor-action]");
      if (!C) return;
      const L = C.getAttribute("data-ln-editor-action");
      _._execAction(L);
    }, this._onPaste = function(S) {
      o(_, S);
    }, this._onKeydown = function(S) {
      h(_, S);
    }, this._listeningSelection = !1, this._rafSelection = null, this._onSelectionChange = function() {
      _._rafSelection || (_._rafSelection = requestAnimationFrame(function() {
        _._rafSelection = null, document.contains(_._surface) && _._updateActiveStates();
      }));
    }, this._attachSelection = function() {
      _._listeningSelection || (_._listeningSelection = !0, document.addEventListener("selectionchange", _._onSelectionChange));
    }, this._detachSelection = function() {
      _._listeningSelection && (_._listeningSelection = !1, document.removeEventListener("selectionchange", _._onSelectionChange)), _._rafSelection && (cancelAnimationFrame(_._rafSelection), _._rafSelection = null);
    }, this._onFocus = function() {
      _._attachSelection(), _._updateActiveStates(), k(_.dom, "ln-editor:focus", { target: _.dom });
    }, this._onBlur = function() {
      _._detachSelection(), _._syncToTextarea(), k(_.dom, "ln-editor:blur", { target: _.dom });
    }, this._onTextareaInput = function() {
      _._surface.innerHTML !== _._textarea.value && (_._surface.innerHTML = _._textarea.value, k(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), this._onSetContent = function(S) {
      const C = S.detail && S.detail.html;
      C !== void 0 && (_._surface.innerHTML = C, _._syncToTextarea(), k(_.dom, "ln-editor:changed", {
        html: _._textarea.value,
        target: _.dom
      }));
    }, r.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        _._surface.innerHTML = _._textarea.value, k(r, "ln-editor:changed", {
          html: _._textarea.value,
          target: r
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(r) {
    if (!(!r || Q(this.dom, "ln-editor:before-change", {
      action: r,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), u[r])
        document.execCommand(u[r], !1, null);
      else if (m[r]) {
        const g = m[r], a = f(this._surface);
        a && a.toLowerCase() === g ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + g + ">");
      } else l[r] ? document.execCommand(l[r], !1, null) : r === "link" ? b(this) : r === "unlink" ? document.execCommand("unlink", !1, null) : r === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const r = this.dom.querySelector('[role="toolbar"]');
    if (!r) return;
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const g = _.anchorNode;
    if (!g || !this._surface.contains(g)) return;
    const a = r.querySelectorAll("[data-ln-editor-action]");
    for (let v = 0; v < a.length; v++) {
      const E = a[v], A = E.getAttribute("data-ln-editor-action");
      let S = !1;
      if (u[A])
        try {
          S = document.queryCommandState(u[A]);
        } catch {
        }
      else if (m[A]) {
        const C = f(this._surface);
        S = C && C.toLowerCase() === m[A];
      } else if (l[A])
        try {
          S = document.queryCommandState(l[A]);
        } catch {
        }
      else A === "link" && (S = !!p(_.anchorNode, "A", this._surface));
      if (s(A)) {
        const C = String(S);
        E.getAttribute("aria-pressed") !== C && E.setAttribute("aria-pressed", C);
      }
      S ? E.classList.contains("ln-editor-active") || E.classList.add("ln-editor-active") : E.classList.contains("ln-editor-active") && E.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(r) {
    this._surface && (this._surface.innerHTML = r, this._syncToTextarea(), k(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const r = this.dom.querySelector('[role="toolbar"]');
    r && (r.removeEventListener("mousedown", this._onMousedownToolbar), r.removeEventListener("click", this._onClickToolbar)), this._detachSelection ? this._detachSelection() : document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const _ = this._textarea ? this._textarea.form : null;
    if (_ && this._onFormReset && _.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const g = this.dom.querySelector(".ln-editor__link-popover");
      g && g.remove();
    }
    delete this.dom[e];
  };
  function f(r) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return null;
    let g = _.anchorNode;
    if (!g) return null;
    for (; g && g !== r; ) {
      if (g.nodeType === 1) {
        const a = g.tagName;
        if (a === "H2" || a === "H3" || a === "H4" || a === "BLOCKQUOTE" || a === "PRE" || a === "P")
          return a;
      }
      g = g.parentNode;
    }
    return null;
  }
  function p(r, _, g) {
    for (; r && r !== g; ) {
      if (r.nodeType === 1 && r.tagName === _)
        return r;
      r = r.parentNode;
    }
    return null;
  }
  function o(r, _) {
    _.preventDefault();
    let g = "";
    if (_.clipboardData && (g = _.clipboardData.getData("text/html"), !g)) {
      const v = _.clipboardData.getData("text/plain");
      v && (g = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), g = "<p>" + g + "</p>");
    }
    if (!g) return;
    const a = y(g);
    a && document.execCommand("insertHTML", !1, a);
  }
  function y(r) {
    const _ = document.createElement("div");
    return _.innerHTML = r, w(_), _.innerHTML;
  }
  function w(r) {
    const _ = Array.from(r.childNodes);
    for (let g = 0; g < _.length; g++) {
      const a = _[g];
      if (a.nodeType !== 3) {
        if (a.nodeType !== 1) {
          r.removeChild(a);
          continue;
        }
        if (d[a.tagName]) {
          const v = Array.from(a.attributes);
          for (let E = 0; E < v.length; E++) {
            const A = v[E].name;
            if (a.tagName === "A" && A === "href") {
              const S = a.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || a.removeAttribute("href");
            } else
              a.removeAttribute(A);
          }
          a.tagName === "A" && a.setAttribute("rel", "noopener noreferrer"), w(a);
        } else {
          for (; a.firstChild; )
            r.insertBefore(a.firstChild, a);
          r.removeChild(a);
        }
      }
    }
  }
  function h(r, _) {
    if (!(_.ctrlKey || _.metaKey)) return;
    let g = null;
    switch (_.key.toLowerCase()) {
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
    g && (_.preventDefault(), r._execAction(g));
  }
  function b(r) {
    const _ = window.getSelection();
    if (!_ || _.rangeCount === 0) return;
    const g = p(_.anchorNode, "A", r._surface), a = _.getRangeAt(0).cloneRange();
    r._closeLinkPopover && r._closeLinkPopover();
    const v = Lt(r.dom, "ln-editor-link-popover", "ln-editor");
    if (!v) return;
    const E = v.firstElementChild;
    if (!E) return;
    const A = E.querySelector('input[type="url"]'), S = E.querySelector('[data-ln-editor-action="confirm-link"]'), C = E.querySelector('[data-ln-editor-action="cancel-link"]');
    g && (A.value = g.getAttribute("href") || "");
    const L = r.dom.querySelector('[role="toolbar"]');
    L ? L.after(E) : r.dom.insertBefore(E, r._surface), A.focus();
    function I() {
      const j = window.getSelection();
      j.removeAllRanges(), j.addRange(a);
    }
    function q() {
      document.removeEventListener("mousedown", U), r._closeLinkPopover = null, E.remove();
    }
    function D() {
      const j = A.value.trim();
      if (q(), I(), r._surface.focus(), j)
        if (g)
          g.setAttribute("href", j), g.setAttribute("rel", "noopener noreferrer"), r._syncToTextarea(), k(r.dom, "ln-editor:changed", {
            html: r._textarea.value,
            target: r.dom
          });
        else {
          document.execCommand("createLink", !1, j);
          const G = window.getSelection();
          if (G && G.anchorNode) {
            const tt = p(G.anchorNode, "A", r._surface);
            tt && (tt.setAttribute("rel", "noopener noreferrer"), r._syncToTextarea());
          }
        }
      else g && document.execCommand("unlink", !1, null);
    }
    function O() {
      q(), I(), r._surface.focus();
    }
    function F() {
      q();
    }
    function U(j) {
      const G = r.dom.contains(j.target) && j.target.closest('[data-ln-editor-action="link"]');
      !E.contains(j.target) && !G && F();
    }
    r._closeLinkPopover = q, S.addEventListener("click", D), C.addEventListener("click", O), A.addEventListener("keydown", function(j) {
      j.key === "Enter" ? (j.preventDefault(), D()) : j.key === "Escape" && (j.preventDefault(), O());
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
  function i(u) {
    const m = {}, l = u.dataset;
    for (const c in l) {
      if (!c.startsWith("lnFill") || e[c]) continue;
      const s = c.slice(6);
      s && (m[s.charAt(0).toLowerCase() + s.slice(1)] = l[c]);
    }
    return m;
  }
  function d(u, m) {
    const l = window.CSS && CSS.escape ? CSS.escape(m) : m, c = document.querySelectorAll('[data-ln-fill-id="' + l + '"]');
    if (c.length === 0) return null;
    for (let s = 0; s < c.length; s++) {
      const n = c[s].getAttribute("data-ln-fill-form");
      if (n) {
        const f = document.getElementById(n);
        if (f && u.contains(f)) return c[s];
      }
    }
    return c[0];
  }
  document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const m = u.target.closest("[data-ln-fill-form]");
    if (!m) return;
    const l = m.getAttribute("data-ln-fill-form"), c = document.getElementById(l);
    if (!c) return;
    const s = i(m), n = Object.keys(s).length > 0;
    window.lnCore.lnFill(c, n ? s : null);
  }), document.addEventListener("ln-fill:request", function(u) {
    const m = u.detail;
    if (!m) return;
    const l = u.target, c = m.id;
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
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: K, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, d = X(i), u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function m(l) {
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
    return Me(l, u, {
      get: function() {
        return u.get.call(l);
      },
      set: function(f) {
        u.set.call(l, f), n._mirroring || (n._pristine = f === "" || f === null || f === void 0);
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
  m.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = jr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), this._onFormReset && this.form && this.form.removeEventListener("reset", this._onFormReset), Object.defineProperty(this.dom, "value", u), delete this.dom[e]);
  }, H(t, e, m, "ln-slug", {
    attributes: i
  });
})();
function Wr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), d = t.getTime(), u = Math.floor((d - i) / 1e3), m = Math.abs(u);
  return m < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : m < 60 ? { value: u, unit: "second", isOlderThanMonth: !1 } : m < 3600 ? { value: Math.round(u / 60), unit: "minute", isOlderThanMonth: !1 } : m < 86400 ? { value: Math.round(u / 3600), unit: "hour", isOlderThanMonth: !1 } : m < 604800 ? { value: Math.round(u / 86400), unit: "day", isOlderThanMonth: !1 } : m < 2592e3 ? { value: Math.round(u / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(u / 2592e3), unit: "month", isOlderThanMonth: !0 };
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
  }, d = {}, u = {};
  function m(C) {
    return C.getAttribute("data-ln-time-locale") || J(C);
  }
  function l(C, L) {
    const I = (C || "") + "|" + JSON.stringify(L);
    return d[I] || (d[I] = new Intl.DateTimeFormat(C, L)), d[I];
  }
  function c(C) {
    const L = C || "";
    return u[L] || (u[L] = new Intl.RelativeTimeFormat(C, { numeric: "auto", style: "narrow" })), u[L];
  }
  const s = /* @__PURE__ */ new Set();
  let n = null;
  function f() {
    n || (n = setInterval(o, 6e4));
  }
  function p() {
    n && (clearInterval(n), n = null);
  }
  function o() {
    for (const C of s) {
      if (!document.body.contains(C.dom)) {
        s.delete(C);
        continue;
      }
      _(C);
    }
    s.size === 0 && p();
  }
  function y(C, L) {
    const I = Rt(L), q = (L || "").toLowerCase().split("-")[0], D = l(L, ie("full", C)), O = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (I && O !== q && I.monthsLong) {
      const F = I.monthsLong[C.getMonth()], U = C.getDate(), j = C.getFullYear(), G = String(C.getHours()).padStart(2, "0"), tt = String(C.getMinutes()).padStart(2, "0");
      return `${U} ${F} ${j}, ${G}:${tt}`;
    }
    return D.format(C);
  }
  function w(C, L) {
    const I = ie("short", C), q = Rt(L), D = (L || "").toLowerCase().split("-")[0], O = l(L, I), F = O.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (q && F !== D && q.monthsShort) {
      const U = q.monthsShort[C.getMonth()], j = C.getDate(), G = I.year ? " " + C.getFullYear() : "";
      return `${j} ${U}${G}`;
    }
    return O.format(C);
  }
  function h(C, L) {
    return l(L, ie("date", C)).format(C);
  }
  function b(C, L) {
    return l(L, ie("time", C)).format(C);
  }
  function r(C, L) {
    const I = Wr(C);
    return I.isOlderThanMonth ? w(C, L) : c(L).format(I.value, I.unit);
  }
  function _(C) {
    const L = C.dom.getAttribute("datetime");
    if (!L) return;
    const I = it(L);
    if (!I) return;
    const q = C.dom.getAttribute(t) || "short", D = m(C.dom);
    let O;
    switch (q) {
      case "relative":
        O = r(I, D);
        break;
      case "full":
        O = y(I, D);
        break;
      case "date":
        O = h(I, D);
        break;
      case "time":
        O = b(I, D);
        break;
      default:
        O = w(I, D);
        break;
    }
    C.dom.textContent = O, q !== "full" && (C.dom.title = y(I, D));
  }
  const g = /* @__PURE__ */ new Set();
  let a = !1;
  function v() {
    ue(), !a && (a = !0, document.addEventListener("ln-core:locale-change", function() {
      g.forEach(function(C) {
        _(C);
      });
    }));
  }
  function E(C) {
    return this.dom = C, g.add(this), v(), _(this), C.getAttribute(t) === "relative" && (s.add(this), f()), this;
  }
  E.prototype.render = function() {
    _(this);
  }, E.prototype.destroy = function() {
    g.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && p(), delete this.dom[e];
  };
  function A(C) {
    const L = C[e];
    if (!L) return;
    C.getAttribute(t) === "relative" ? (s.add(L), f()) : (s.delete(L), s.size === 0 && p()), _(L);
  }
  function S(C) {
    C.nodeType === 1 && C.hasAttribute && C.hasAttribute(t) && C[e] && _(C[e]);
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
  const u = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, m = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  let c = 0, s = 0, n = 0, f = !1, p = null;
  function o(h, b) {
    m.delete(h), m.set(h, b);
  }
  function y() {
    if (m.size <= e) return [];
    const h = [];
    for (; m.size > e; ) {
      const r = m.keys().next().value;
      h.push(m.get(r)), m.delete(r);
    }
    const b = new Set(m.values());
    return h.filter((r) => !b.has(r));
  }
  function w(h, b) {
    l.add(h), clearTimeout(p), p = setTimeout(() => u(h, i, b), d);
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
      return m.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return f;
    },
    getId: (h) => {
      if (!m.has(h)) return;
      const b = m.get(h);
      return o(h, b), b;
    },
    ensure: (h, b, r) => {
      if (!f && !l.has(0)) return w(0, r);
      if (c <= 0) return;
      const _ = Math.max(0, h), g = Math.min(c, b);
      for (let a = _; a < g; a++)
        if (!m.has(a)) {
          const v = Math.floor(a / i) * i;
          if (!l.has(v)) return w(v, r);
        }
    },
    ingest: (h, b, r, _, g) => {
      if (g != null && g !== n) return [];
      f = !0, r != null && (s = r), _ != null && (c = _);
      for (let a = 0; a < b.length; a++)
        o(h + a, b[a]);
      return l.delete(h), y();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      f = !1, m.clear(), l.clear(), clearTimeout(p);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (h = {}) => {
      let b = [];
      return h.windowSize > 0 && h.windowSize !== e && (e = h.windowSize, b = y()), h.pageSize > 0 && (i = h.pageSize), h.fetchDebounce >= 0 && (d = h.fetchDebounce), b;
    }
  };
}
function Gr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: d, direction: u } = e, m = u === "desc", l = t.map((s) => s ? s[d] : void 0), c = He(l);
  return [...t].sort((s, n) => {
    const f = s ? s[d] : void 0, p = n ? n[d] : void 0, o = Ue(f, p, c, i);
    return m ? -o : o;
  });
}
function wi(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((d) => Array.isArray(e[d]) && e[d].length > 0);
  return i.length ? t.filter((d) => d ? i.every((u) => Ke(d[u], e[u])) : !1) : t;
}
function $r(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const d = $n(e);
  return d.length ? t.filter((u) => u ? d.every(
    (m) => i.some((l) => {
      const c = u[l];
      return c != null && Qn(String(c), [m]);
    })
  ) : !1) : t;
}
function Qr(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const d = t.map((m) => m && m[e] != null ? parseFloat(m[e]) : NaN).filter((m) => Number.isFinite(m)), u = d.reduce((m, l) => m + l, 0);
  return i === "sum" ? u : i === "avg" && d.length ? u / d.length : 0;
}
function Yr(t, e = {}, i = [], d) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const u = t.length;
  let m = t;
  e.filters && (m = wi(m, e.filters)), e.search && (m = $r(m, e.search, i));
  const l = m.length;
  if (e.sort && (m = Gr(m, e.sort, d)), e.offset || e.limit) {
    const c = e.offset || 0, s = e.limit || m.length;
    m = m.slice(c, c + s);
  }
  return { records: m, total: u, filtered: l };
}
function Xr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const d = { ...i };
    for (const [u, m] of Object.entries(e))
      if (typeof m == "function")
        try {
          d[u] = m(i);
        } catch {
          d[u] = void 0;
        }
    return d;
  });
}
function Jr(t, e, i, d = "_meta") {
  if (!Array.isArray(t) || !t.includes(d)) return !0;
  for (const u of Object.keys(e || {})) {
    if (!t.includes(u)) return !0;
    const m = e[u] && e[u].indexes || [], l = i && i[u] || [];
    if (m.some((c) => !l.includes(c))) return !0;
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
    "data-ln-data-store": { type: "marker", effect: Qe, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: Qe, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: Fe, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: Mi, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: Fi, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, u = X(d), m = "ln_app_cache", l = "_meta", c = "1.0";
  let s = null, n = null;
  const f = {};
  function p(T) {
    T && T.name === "QuotaExceededError" && k(document, "ln-data-store:quota-exceeded", { error: T });
  }
  function o() {
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
  function y() {
    return n || (n = new Promise((T) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB is not available in this environment"), T(null);
      const x = o(), R = Object.keys(x), N = indexedDB.open(m);
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
          return w(B), s = B, T(B);
        const qt = B.version;
        B.close();
        const vt = indexedDB.open(m, qt + 1);
        let ht = !1, pt = null;
        vt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection"), k(document, "ln-data-store:blocked", { db: m }), pt || (pt = setTimeout(() => {
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
          w(ut), s = ut, T(ut);
        };
      };
    }), n);
  }
  function w(T) {
    T.onversionchange = () => {
      T.close(), s = null, n = null;
    };
  }
  function h() {
    return s ? Promise.resolve(s) : (n = null, y());
  }
  async function b(T) {
    if (!Tt() || !T) return T;
    const x = { ...T }, R = x.id, N = await tr(x);
    return !N || !N.encrypted ? T : {
      ...N,
      id: R
    };
  }
  async function r(T) {
    return !T || !T.encrypted || !Tt() ? T : er(T, { silent: !0 });
  }
  const _ = (T, x) => h().then((R) => R ? R.transaction(T, x).objectStore(T) : null);
  function g(T) {
    return new Promise((x, R) => {
      T.onsuccess = () => x(T.result), T.onerror = () => {
        p(T.error), R(T.error);
      };
    });
  }
  const a = (T) => _(T, "readonly").then((x) => x ? g(x.getAll()) : []).then((x) => Tt() ? Promise.all(x.map((R) => r(R))) : x), v = (T, x) => _(T, "readonly").then((R) => R ? g(R.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? g(R.get(Number(x))) : typeof x == "number" ? g(R.get(String(x))) : null) : null).then((R) => R ? r(R) : null), E = (T, x) => h().then((R) => {
    if (!R) return [];
    const M = R.transaction(T, "readonly").objectStore(T), B = x.map((P) => g(M.get(P)).then((z) => z !== void 0 ? z : typeof P == "string" && P.trim() !== "" && !isNaN(Number(P)) ? g(M.get(Number(P))) : typeof P == "number" ? g(M.get(String(P))) : null));
    return Promise.all(B).then((P) => Tt() ? Promise.all(P.map((z) => z ? r(z) : null)) : P);
  }), A = (T, x) => (Tt() ? b(x) : Promise.resolve(x)).then((N) => _(T, "readwrite").then((M) => M ? g(M.put(N)) : null)), S = (T, x) => _(T, "readwrite").then((R) => R ? g(R.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return g(R.delete(Number(x)));
    if (typeof x == "number")
      return g(R.delete(String(x)));
  }) : null), C = (T) => _(T, "readwrite").then((x) => x ? g(x.clear()) : null), L = (T) => _(T, "readonly").then((x) => x ? g(x.count()) : 0), I = (T) => _(l, "readonly").then((x) => x ? g(x.get(T)) : null), q = (T, x) => _(l, "readwrite").then((R) => {
    if (R)
      return x.key = T, g(R.put(x));
  });
  function D(T) {
    return this.dom = T, this._name = T.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", T), Y(this, T, u), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, T.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Vr({
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
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), f[this._name] = this, O(this), this.ready = nt(this), this;
  }
  function O(T) {
    T._handlers = {
      create: (x) => F(T, "create", x.detail, () => j(T, x.detail)),
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
  function j(T, { tempId: x, data: R = {}, requestId: N } = {}) {
    const M = { ...R, id: x };
    return A(T._name, M).then(() => U(T, 1)).then(() => {
      k(T.dom, "ln-data-store:created", { store: T._name, record: M, tempId: x, requestId: N });
    });
  }
  function G(T, { id: x, data: R = {}, requestId: N } = {}) {
    return v(T._name, x).then((M) => {
      if (!M) throw new Error(`Record not found: ${x}`);
      const B = M.id, P = { ...M, ...R, id: B }, z = R.id, $ = z !== void 0 && z !== B;
      return ($ ? Ci(T._name, B, { ...P, id: z }) : A(T._name, P)).then(() => U(T, 0)).then(() => {
        k(T.dom, "ln-data-store:updated", { store: T._name, record: $ ? { ...P, id: z } : P, previous: M, requestId: N });
      });
    });
  }
  function tt(T, { id: x, requestId: R } = {}) {
    return v(T._name, x).then((N) => {
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
    return x.length ? Promise.all(x.map((N) => v(T._name, N))).then((N) => {
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
    return y().then((x) => {
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
        p(z.error), P(z.error);
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
  function Ci(T, x, R) {
    return (Tt() ? b(R) : Promise.resolve(R)).then((M) => h().then((B) => {
      if (B)
        return new Promise((P, z) => {
          const $ = B.transaction(T, "readwrite"), et = $.objectStore(T);
          et.put(M), et.delete(x), $.oncomplete = () => P(), $.onerror = () => {
            p($.error), z($.error);
          };
        });
    }));
  }
  const Ti = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function ki(T) {
    return T ? Object.keys(T).filter((x) => Array.isArray(T[x]) && T[x].length > 0) : [];
  }
  function Li(T, x, R) {
    return x.every((N) => R[N].map(String).includes(String(T[N])));
  }
  function xi(T) {
    return String(T || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Ii(T, x, R) {
    return x.every(
      (N) => R.some((M) => {
        const B = T[M];
        return B != null && String(B).toLowerCase().includes(N);
      })
    );
  }
  function qi(T, x, R) {
    return Qr(T, x, R);
  }
  function Ut(T, x) {
    return Xr(x, T.presenters && T.presenters.computed);
  }
  function Di(T) {
    return !T.sort && !Tt();
  }
  function Ri(T, x, R) {
    const N = ki(x.filters), M = x.search ? xi(x.search) : [], B = T._searchFields, P = M.length > 0 && B && B.length > 0;
    return _(T._name, "readonly").then((z) => z ? new Promise(($, et) => {
      const qt = [], vt = z.openCursor();
      vt.onsuccess = () => {
        const ht = vt.result;
        if (!ht || qt.length >= R) {
          $(qt);
          return;
        }
        const pt = ht.value;
        (!N.length || Li(pt, N, x.filters)) && (!P || Ii(pt, M, B)) && qt.push(pt), ht.continue();
      }, vt.onerror = () => et(vt.error);
    }) : []);
  }
  function Ge(T, x, R) {
    return Yr(x, R, T._searchFields, Ti);
  }
  function $e(T, x, R) {
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
        const M = R + N, B = (P) => P.length ? {
          data: Ut(x, P),
          offset: R,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : $e(x, R, N);
        return Di(T) ? Ri(x, T, M).then((P) => B(P.slice(R, M))) : a(x._name).then((P) => B(Ge(x, P, T).records));
      }
      return $e(x, R, N);
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
    return v(this._name, T).then((x) => x ? Ut(this, [x])[0] : null);
  }, D.prototype.count = function(T) {
    return T && Object.keys(T).length > 0 ? a(this._name).then((R) => wi(R, T).length) : this.windowed && this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, D.prototype.aggregate = function(T, x) {
    return a(this._name).then((R) => qi(R, T, x));
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
    delete f[this._name], delete this.dom[e];
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
      Object.values(f).forEach((T) => {
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
  function Qe(T, x) {
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
  }), window[e].clearAll = Oi, window[e].init = window[e], window[e].setStorageKey = tn, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = tn);
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
    for (const u in e)
      e[u] !== void 0 && e[u] !== null && e[u] !== "" && (i[u] = e[u]);
  const d = new URLSearchParams();
  return t.search && d.append(i.search, t.search), t.offset != null && d.append(i.offset, t.offset), t.limit != null && d.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (d.append(i.sortField, t.sort.field), d.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((u) => {
    const m = t.filters[u];
    Array.isArray(m) && m.length > 0 && d.append(u, m.join(","));
  }), d.toString();
}
function no(t, e, i) {
  let d = Dt(t, e);
  return i && (d += (d.indexOf("?") !== -1 ? "&" : "?") + i), d;
}
function mn(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function d(n) {
    const f = n[e];
    f && f.refreshConfig();
  }
  const u = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: K, type: "string", fallback: "", effect: d, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: K, type: "string", fallback: "", effect: d, description: "Resource path appended to base URL" },
    "data-ln-api-endpoint": { prop: "path", read: K, type: "string", fallback: "", effect: d, description: "Alias for data-ln-api-path" },
    "data-ln-api-headers": { prop: "rawHeaders", read: K, type: "json", fallback: null, effect: d, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: d, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: d, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: d, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: d, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: d, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: d, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, m = X(u);
  function l(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((f) => {
      const p = new Error("HTTP " + n.status + ": " + n.statusText);
      throw p.status = n.status, p.data = f, p;
    });
  }
  function c(n) {
    return this.dom = n, Y(this, n, m), n[e] = this, n[i] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, s(this), this;
  }
  c.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = Sn(this.rawHeaders);
    const f = {}, p = n.getAttribute("data-ln-api-param-offset");
    p && (f.offset = p);
    const o = n.getAttribute("data-ln-api-param-limit");
    o && (f.limit = o);
    const y = n.getAttribute("data-ln-api-param-search");
    y && (f.search = y);
    const w = n.getAttribute("data-ln-api-param-sort-field");
    w && (f.sortField = w);
    const h = n.getAttribute("data-ln-api-param-sort-dir");
    h && (f.sortDir = h), this.paramKeys = f;
    const b = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = b !== null ? +b : 300, k(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, c.prototype._reqHeaders = function(n) {
    const f = Object.assign({}, this.headers);
    return !f.Accept && !f.accept && (f.Accept = "application/json"), !f["Content-Type"] && !f["content-type"] && (f["Content-Type"] = "application/json"), n && (f["X-Idempotency-Key"] = n), f;
  }, c.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, c.prototype.fetchDelta = function(n, f) {
    const p = this;
    let o = Dt(p.baseUrl, p.path);
    n != null && n !== "" && (o += (o.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const y = f || "sync";
    p._inflight.has(y) && p._inflight.get(y).abort();
    const w = new AbortController();
    return p._inflight.set(y, w), window.fetch(o, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: w.signal
    }).then(l).finally(function() {
      p._inflight.get(y) === w && p._inflight.delete(y);
    });
  }, c.prototype.query = function(n, f) {
    const p = this, o = eo(n, p.paramKeys), y = no(p.baseUrl, p.path, o), w = f || "query";
    p._inflight.has(w) && p._inflight.get(w).abort();
    const h = new AbortController();
    return p._inflight.set(w, h), window.fetch(y, {
      method: "GET",
      headers: p._reqHeaders(),
      credentials: p.credentials,
      signal: h.signal
    }).then(l).finally(function() {
      p._inflight.get(w) === h && p._inflight.delete(w);
    });
  }, c.prototype.create = function(n, f, p) {
    const o = this;
    return window.fetch(Dt(o.baseUrl, f || o.path), {
      method: "POST",
      headers: o._reqHeaders(p),
      credentials: o.credentials,
      body: JSON.stringify(n)
    }).then(l);
  }, c.prototype.update = function(n, f, p, o, y) {
    const w = this;
    p != null && (f = Object.assign({}, f, { expected_version: p }));
    const h = o ? Dt(w.baseUrl, o) : Dt(w.baseUrl, w.path, n);
    return window.fetch(h, {
      method: "PUT",
      headers: w._reqHeaders(y),
      credentials: w.credentials,
      body: JSON.stringify(f)
    }).then(l);
  }, c.prototype.delete = function(n, f, p) {
    const o = this;
    return window.fetch(Dt(o.baseUrl, f || o.path, n), {
      method: "DELETE",
      headers: o._reqHeaders(p),
      credentials: o.credentials
    }).then(l);
  }, c.prototype.bulkDelete = function(n, f, p) {
    const o = this;
    return window.fetch(Dt(o.baseUrl, f || o.path, "bulk-delete"), {
      method: "DELETE",
      headers: o._reqHeaders(p),
      credentials: o.credentials,
      body: JSON.stringify({ ids: n })
    }).then(l);
  };
  function s(n) {
    n._handlers = {
      sync: function(f) {
        const p = f.detail || {}, o = p.meta && p.meta.targetEl ? p.meta.targetEl : null;
        n.fetchDelta(p.since, o).then(function(y) {
          k(n.dom, "ln-api-connector:fetched", { data: y, since: p.since, meta: p.meta || null });
        }).catch(function(y) {
          y && y.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: y.message,
            status: y.status || 0,
            data: y.data || null,
            since: p.since,
            meta: p.meta || null
          });
        });
      },
      query: function(f) {
        const p = f.detail || {}, o = p.query || p, y = p.meta && p.meta.targetEl ? p.meta.targetEl : null, w = y || "query", h = n.queryDebounce;
        function b(_, g, a) {
          n.query(g, a).then(function(v) {
            const E = v || {};
            k(n.dom, "ln-api-connector:fetched", {
              data: E.data || (Array.isArray(E) ? E : []),
              total: E.total,
              filtered: E.filtered,
              offset: g.offset,
              queryGen: g.queryGen,
              meta: _.meta || null
            });
          }).catch(function(v) {
            v && v.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
              action: "query",
              error: v.message,
              status: v.status || 0,
              data: v.data || null,
              meta: _.meta || null
            });
          });
        }
        if (h === 0) {
          b(p, o, y);
          return;
        }
        n._queryTimers.has(w) && clearTimeout(n._queryTimers.get(w));
        const r = setTimeout(function() {
          n._queryTimers.delete(w), b(p, o, y);
        }, h);
        n._queryTimers.set(w, r);
      },
      cancel: function(f) {
        const p = f.detail || {}, o = p.meta && p.meta.targetEl ? p.meta.targetEl : p.targetEl || p.key;
        o && n.cancel(o);
      },
      create: function(f) {
        const p = f.detail || {};
        n.create(p.data, p.url, p.idempotencyKey).then(function(o) {
          const y = mn(o);
          k(n.dom, "ln-api-connector:created", {
            record: y.record,
            tempId: p.tempId,
            message: y.message,
            meta: p.meta || null
          });
        }).catch(function(o) {
          o && o.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "create",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            tempId: p.tempId,
            meta: p.meta || null
          });
        });
      },
      update: function(f) {
        const p = f.detail || {};
        n.update(p.id, p.data, p.expected_version, p.url, p.idempotencyKey).then(function(o) {
          const y = mn(o);
          k(n.dom, "ln-api-connector:updated", {
            record: y.record,
            id: p.id,
            message: y.message,
            meta: p.meta || null
          });
        }).catch(function(o) {
          o && o.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "update",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            id: p.id,
            conflictData: o.status === 409 ? o.data : null,
            meta: p.meta || null
          });
        });
      },
      delete: function(f) {
        const p = f.detail || {};
        n.delete(p.id, p.url, p.idempotencyKey).then(function(o) {
          const y = o && o.message ? o.message : null;
          k(n.dom, "ln-api-connector:deleted", {
            response: o,
            id: p.id,
            message: y,
            meta: p.meta || null
          });
        }).catch(function(o) {
          o && o.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            id: p.id,
            meta: p.meta || null
          });
        });
      },
      bulkDelete: function(f) {
        const p = f.detail || {};
        n.bulkDelete(p.ids, p.url, p.idempotencyKey).then(function(o) {
          const y = o && o.message ? o.message : null;
          k(n.dom, "ln-api-connector:bulk-deleted", {
            response: o,
            ids: p.ids,
            message: y,
            meta: p.meta || null
          });
        }).catch(function(o) {
          o && o.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            data: o.data || null,
            ids: p.ids,
            meta: p.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(f) {
      f.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(f) {
      f && clearTimeout(f);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, c, "ln-api-connector", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function d(w) {
    const h = w[e];
    h && h.refreshConfig();
  }
  const u = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: K, type: "string", fallback: "", effect: d, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: K, type: "string", fallback: "", effect: d, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: K, type: "string", fallback: "", effect: d, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: d, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, m = X(u);
  function l(w) {
    const h = w && w.content !== void 0 ? w.content : w, b = w && w.message ? w.message : null;
    return { content: h, message: b };
  }
  function c(w) {
    return this.dom = w, Y(this, w, m), w[e] = this, w[i] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, y(this), this;
  }
  c.prototype.refreshConfig = function() {
    const w = this.dom;
    this.credentials = "same-origin";
    const h = w.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = Sn(h, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), h.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), k(w, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function s(w, h, b) {
    const r = Object.assign({}, Kt(w.headers, w.auth), b || {});
    return h && (r["Idempotency-Key"] = h), r;
  }
  c.prototype.fetchDelta = function(w) {
    const h = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const b = this._deltaController.signal, r = ["include_docs=true", "feed=normal"];
    w && r.push("since=" + encodeURIComponent(w));
    const _ = Ct(h.url, h.db, "_changes") + "?" + r.join("&");
    return window.fetch(_, { method: "GET", headers: Kt(h.headers, h.auth), credentials: h.credentials, signal: b }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const a = g.results || [];
      return {
        data: a.filter((v) => !v.deleted && v.doc).map((v) => Object.assign({}, v.doc, { id: v.doc._id })),
        deleted: a.filter((v) => v.deleted).map((v) => v.id),
        synced_at: g.last_seq || w || ""
      };
    }).finally(() => {
      h._deltaController && h._deltaController.signal === b && (h._deltaController = null);
    });
  };
  function n(w, h, b) {
    const r = Object.assign({ _id: h.id }, h);
    return r._id || delete r._id, window.fetch(Ct(w.url, w.db), {
      method: "POST",
      headers: s(w, b),
      credentials: w.credentials,
      body: JSON.stringify(r)
    }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const g = l(_), a = g.content;
      return { record: Object.assign({}, r, { id: a.id, _id: a.id, _rev: a.rev }), message: g.message };
    });
  }
  c.prototype.create = function(w, h) {
    return n(this, w, h).then((b) => b.record);
  };
  function f(w, h, b, r) {
    const _ = Object.assign({ id: String(h), _id: String(h) }, b), g = _._rev || _.rev;
    return (g ? Promise.resolve(g) : window.fetch(Ct(w.url, w.db, null, h), { method: "GET", headers: Kt(w.headers, w.auth), credentials: w.credentials }).then((v) => {
      if (!v.ok) throw new Error("Could not retrieve document for revision mapping");
      return v.json().then((E) => E._rev);
    })).then((v) => {
      const E = Object.assign({}, _, { _rev: v });
      delete E.rev;
      const A = s(w, r, { "If-Match": v });
      return window.fetch(Ct(w.url, w.db, null, h), {
        method: "PUT",
        headers: A,
        credentials: w.credentials,
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
  c.prototype.update = function(w, h, b) {
    return f(this, w, h, b).then((r) => r.record);
  };
  function p(w, h, b, r) {
    return (b ? Promise.resolve(b) : window.fetch(Ct(w.url, w.db, null, h), { method: "GET", headers: Kt(w.headers, w.auth), credentials: w.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision delete");
      return g.json().then((a) => a._rev);
    })).then((g) => {
      const a = Ct(w.url, w.db, null, h) + "?rev=" + encodeURIComponent(g);
      return window.fetch(a, { method: "DELETE", headers: s(w, r), credentials: w.credentials }).then((v) => {
        if (!v.ok) throw new Error("HTTP " + v.status + ": " + v.statusText);
        return v.json();
      }).then((v) => {
        const E = l(v);
        return { response: E.content, message: E.message };
      });
    });
  }
  c.prototype.delete = function(w, h, b) {
    return p(this, w, h, b).then((r) => r.response);
  };
  function o(w, h, b) {
    return !h || h.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Ct(w.url, w.db, "_all_docs"), {
      method: "POST",
      headers: Kt(w.headers, w.auth),
      credentials: w.credentials,
      body: JSON.stringify({ keys: h })
    }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
      return r.json();
    }).then((r) => {
      const g = (r.rows || []).filter((a) => !a.error && a.value && a.value.rev).map((a) => ({ _id: a.id, _rev: a.value.rev, _deleted: !0 }));
      return g.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Ct(w.url, w.db, "_bulk_docs"), {
        method: "POST",
        headers: s(w, b),
        credentials: w.credentials,
        body: JSON.stringify({ docs: g })
      }).then((a) => {
        if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
        return a.json();
      }).then((a) => {
        const v = l(a);
        return { response: { ok: !0, results: v.content, deletedCount: g.length }, message: v.message };
      });
    });
  }
  c.prototype.bulkDelete = function(w, h) {
    return o(this, w, h).then((b) => b.response);
  };
  function y(w) {
    w._handlers = {
      sync: function(h) {
        const b = h.detail || {};
        w.fetchDelta(b.since).then(function(r) {
          k(w.dom, "ln-couchdb-connector:fetched", { data: r, since: b.since, meta: b.meta || null });
        }).catch(function(r) {
          r && r.name === "AbortError" || k(w.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: r.message,
            status: r.status || 0,
            since: b.since,
            meta: b.meta || null
          });
        });
      },
      create: function(h) {
        const b = h.detail || {};
        n(w, b.data, b.idempotencyKey).then(function(r) {
          k(w.dom, "ln-couchdb-connector:created", { record: r.record, tempId: b.tempId, message: r.message, meta: b.meta || null });
        }).catch(function(r) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: r.message,
            status: r.status || 0,
            tempId: b.tempId,
            meta: b.meta || null
          });
        });
      },
      update: function(h) {
        const b = h.detail || {}, r = Object.assign({}, b.data);
        b.expected_version !== void 0 && (r._rev = b.expected_version), f(w, b.id, r, b.idempotencyKey).then(function(_) {
          k(w.dom, "ln-couchdb-connector:updated", { record: _.record, id: b.id, message: _.message, meta: b.meta || null });
        }).catch(function(_) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: _.message,
            status: _.status || 0,
            id: b.id,
            data: _.status === 409 ? _.data : null,
            conflictData: _.status === 409 ? _.data : null,
            meta: b.meta || null
          });
        });
      },
      delete: function(h) {
        const b = h.detail || {};
        p(w, b.id, b.rev, b.idempotencyKey).then(function(r) {
          k(w.dom, "ln-couchdb-connector:deleted", { response: r.response, id: b.id, message: r.message, meta: b.meta || null });
        }).catch(function(r) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: r.message,
            status: r.status || 0,
            id: b.id,
            meta: b.meta || null
          });
        });
      },
      bulkDelete: function(h) {
        const b = h.detail || {};
        o(w, b.ids, b.idempotencyKey).then(function(r) {
          k(w.dom, "ln-couchdb-connector:bulk-deleted", { response: r.response, ids: b.ids, message: r.message, meta: b.meta || null });
        }).catch(function(r) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: r.message,
            status: r.status || 0,
            ids: b.ids,
            meta: b.meta || null
          });
        });
      }
    }, w.dom.addEventListener("ln-couchdb-connector:request-sync", w._handlers.sync), w.dom.addEventListener("ln-couchdb-connector:request-create", w._handlers.create), w.dom.addEventListener("ln-couchdb-connector:request-update", w._handlers.update), w.dom.addEventListener("ln-couchdb-connector:request-delete", w._handlers.delete), w.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", w._handlers.bulkDelete);
  }
  c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const w = this;
    w._deltaController && (w._deltaController.abort(), w._deltaController = null), w._handlers && (w.dom.removeEventListener("ln-couchdb-connector:request-sync", w._handlers.sync), w.dom.removeEventListener("ln-couchdb-connector:request-create", w._handlers.create), w.dom.removeEventListener("ln-couchdb-connector:request-update", w._handlers.update), w.dom.removeEventListener("ln-couchdb-connector:request-delete", w._handlers.delete), w.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", w._handlers.bulkDelete), w._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, c, "ln-couchdb-connector", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  const d = 1e3, u = 3e4;
  function m(o) {
    const y = o[e];
    y && (y.command === "connect" ? y._open() : y._disconnect());
  }
  function l(o) {
    const y = o[e];
    !y || y.command !== "connect" || (y._drop("url-changed"), y._open());
  }
  const c = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: m, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: K, type: "string", fallback: "", effect: l, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, s = X(c), n = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function f(o, y) {
    return o === "sync" ? { since: y.since } : o === "query" ? { query: y.query || {} } : o === "create" ? { data: y.data, idempotencyKey: y.idempotencyKey } : o === "update" ? { id: y.id, data: y.data, expected_version: y.expected_version, idempotencyKey: y.idempotencyKey } : o === "delete" ? { id: y.id, idempotencyKey: y.idempotencyKey } : { ids: y.ids, idempotencyKey: y.idempotencyKey };
  }
  function p(o) {
    this.dom = o, Y(this, o, s), o[e] = this, o[i] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const y = this;
    this._onRequest = function(w) {
      y._request(n[w.type], w.detail || {});
    };
    for (const w in n) o.addEventListener(w, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  p.prototype._open = function() {
    if (this._socket || this._timer) return;
    const o = this, y = this.url;
    this._attempt++, this._status = "connecting", k(this.dom, "ln-websocket-connector:connecting", { url: y, attempt: this._attempt });
    let w;
    try {
      w = new WebSocket(y);
    } catch (h) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, h.message), this._held = [], k(this.dom, "ln-websocket-connector:disconnected", { url: y, code: 0, reason: h.message, willReconnect: !1 });
      return;
    }
    this._socket = w, w.onopen = function() {
      o._status = "connected", o._attempt = 0, k(o.dom, "ln-websocket-connector:connected", { url: y });
      const h = o._held;
      o._held = [];
      for (let b = 0; b < h.length; b++) o._send(h[b]);
    }, w.onmessage = function(h) {
      o._receive(h.data);
    }, w.onclose = function(h) {
      o._socket = null, o._status = "disconnected", o._failPending("connection closed");
      const b = o.command === "connect";
      k(o.dom, "ln-websocket-connector:disconnected", { url: y, code: h.code, reason: h.reason, willReconnect: b }), b && o._scheduleReconnect();
    };
  }, p.prototype._scheduleReconnect = function() {
    const o = this, y = Math.min(d * Math.pow(2, Math.max(0, this._attempt - 1)), u);
    this._timer = setTimeout(function() {
      o._timer = null, o._open();
    }, y);
  }, p.prototype._drop = function(o) {
    const y = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, o), this._socket = null), y && (this._status = "disconnected", this._failPending("connection closed"), k(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: o, willReconnect: !1 }));
  }, p.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, p.prototype._request = function(o, y) {
    const w = { ref: String(++this._seq), type: o, detail: y };
    this._status === "connected" ? this._send(w) : this.command === "connect" ? this._held.push(w) : this._fail(w, 0, "disconnected", null);
  }, p.prototype._send = function(o) {
    this._pending.set(o.ref, o), this._socket.send(JSON.stringify(Object.assign({ ref: o.ref, type: o.type }, f(o.type, o.detail))));
  }, p.prototype._receive = function(o) {
    let y;
    try {
      y = JSON.parse(o);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", o);
      return;
    }
    if (y.ref !== void 0) {
      const w = this._pending.get(String(y.ref));
      if (!w) return;
      this._pending.delete(w.ref), y.ok ? this._resolve(w, y.content, y.message || null) : this._fail(w, y.status || 0, y.error, y.data);
      return;
    }
    y.type === "changes" && k(this.dom, "ln-websocket-connector:fetched", {
      data: { data: y.data || [], deleted: y.deleted || [], synced_at: y.synced_at },
      since: null,
      meta: null
    });
  }, p.prototype._resolve = function(o, y, w) {
    const h = o.detail, b = h.meta || null, r = this.dom;
    if (o.type === "sync")
      k(r, "ln-websocket-connector:fetched", { data: y, since: h.since, meta: b });
    else if (o.type === "query") {
      const _ = h.query || {}, g = y || {};
      k(r, "ln-websocket-connector:fetched", {
        data: g.data || [],
        total: g.total,
        filtered: g.filtered,
        offset: _.offset,
        queryGen: _.queryGen,
        meta: b
      });
    } else o.type === "create" ? k(r, "ln-websocket-connector:created", { record: y, tempId: h.tempId, message: w, meta: b }) : o.type === "update" ? k(r, "ln-websocket-connector:updated", { record: y, id: h.id, message: w, meta: b }) : o.type === "delete" ? k(r, "ln-websocket-connector:deleted", { response: y, id: h.id, message: w, meta: b }) : k(r, "ln-websocket-connector:bulk-deleted", { response: y, ids: h.ids, message: w, meta: b });
  }, p.prototype._fail = function(o, y, w, h) {
    const b = o.detail;
    k(this.dom, "ln-websocket-connector:error", {
      action: o.type,
      error: w,
      status: y,
      data: h || null,
      conflictData: y === 409 && h || null,
      since: b.since,
      id: b.id,
      ids: b.ids,
      tempId: b.tempId,
      meta: b.meta || null
    });
  }, p.prototype._failAll = function(o, y) {
    for (let w = 0; w < o.length; w++) this._fail(o[w], 0, y, null);
  }, p.prototype._failPending = function(o) {
    const y = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(y, o);
  }, p.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const o in n) this.dom.removeEventListener(o, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[i];
    }
  }, H(t, e, p, "ln-websocket-connector", {
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
function gn(t, e) {
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
    const u = this._pending.get(d);
    return u ? (this._pending.delete(d), i ? u.reject(e.error || new Error("Store mutation failed")) : u.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  const d = "data-ln-data-coordinator-search", u = "data-ln-data-coordinator-filters", m = "data-ln-data-coordinator-sort-field", l = "data-ln-data-coordinator-sort-direction", s = X({
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
  function f(h) {
    const b = h.getAttribute("data-ln-data-coordinator-connector");
    if (b) return h.querySelector(b) || document.querySelector(b) || document.getElementById(b);
    const r = h.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (r) return r;
    for (const _ of h.querySelectorAll("*")) {
      if (_.lnConnector) return _;
      for (const g of _.attributes) if (g.name.startsWith("data-ln-") && g.name.endsWith("-connector")) return _;
    }
    return null;
  }
  function p(h) {
    var r;
    if (!h) return "ln-connector";
    if ((r = h.lnConnector) != null && r.namespace) return h.lnConnector.namespace;
    const b = h.getAttribute("data-ln-connector");
    if (b && b !== "true") return b.startsWith("ln-") ? b : "ln-" + b + (b.endsWith("-connector") ? "" : "-connector");
    for (const _ of h.attributes) if (_.name.startsWith("data-ln-") && _.name.endsWith("-connector")) return _.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function o(h) {
    const b = this;
    return this.dom = h, Y(this, h, s), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", h), h[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new oo(), this._queueQueryRefresh = Ht(() => {
      b._destroyed || b._refreshAll(null, !0);
    }), this.refreshMapper(), y(this), this._checkInitialSync(), this;
  }
  o.prototype._noAutosync = function(h) {
    var b;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((b = h.storeEl) != null && b.hasAttribute("data-ln-data-store-no-autosync"));
  }, o.prototype._isStale = function(h) {
    var r, _;
    const b = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((r = h.storeEl) == null ? void 0 : r.getAttribute("data-ln-data-store-stale"));
    return b === "never" || b === "-1" ? !1 : !((_ = h.store) != null && _.lastSyncedAt) || Date.now() / 1e3 - h.store.lastSyncedAt > (parseInt(b, 10) || 300);
  }, o.prototype._checkInitialSync = function() {
    const h = this, b = this.findChildren();
    b.store && Promise.resolve(b.store.ready).then(() => {
      if (h._destroyed) return;
      const r = h.findChildren();
      r.store && r.connector && !h._noAutosync(r) && !r.store.isSyncing && (!r.store.hasCache || h._isStale(r)) && r.store.forceSync();
    }).catch((r) => h._reportError("store-initialize", r, null));
  }, o.prototype.refreshMapper = function() {
    var r, _;
    const h = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, b = h && ((_ = (r = window.lnCore) == null ? void 0 : r.getDataMapper) == null ? void 0 : _.call(r, h)) || null;
    this.mapper = { ingress: (b == null ? void 0 : b.ingress) || ((g) => g), egress: (b == null ? void 0 : b.egress) || ((g) => g) };
  }, o.prototype.findChildren = function() {
    const h = this.dom.querySelector("[data-ln-data-store]"), b = f(this.dom), r = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: h, connectorEl: b, queueEl: r, store: (h == null ? void 0 : h.lnDataStore) || null, connector: (b == null ? void 0 : b.lnConnector) || (b == null ? void 0 : b.lnApiConnector) || (b == null ? void 0 : b.lnCouchDbConnector) || (b == null ? void 0 : b.lnWebsocketConnector) || null, queue: (r == null ? void 0 : r.lnApiQueue) || null };
  }, o.prototype._fanOutRemote = function(h, b, r, _) {
    this.refreshMapper(), h.queue ? k(h.queueEl, "ln-api-queue:request-enqueue", r) : h.connector && k(h.connectorEl, p(h.connectorEl) + ":request-" + b, _);
  }, o.prototype._fanOutCreate = function(h, b, r) {
    const _ = "_temp_" + wt(), g = this.mapper.egress(b);
    h.storeEl && k(h.storeEl, "ln-data-store:request-create", { tempId: _, data: g }), this._fanOutRemote(h, "create", { chainKey: _, op: "create", targetId: null, payload: g, expectedVersion: null, meta: { tempId: _, action: r } }, { data: g, url: r, meta: { entryId: wt(), queued: !1, op: "create", tempId: _ } });
  }, o.prototype._fanOutUpdate = function(h, b, r, _, g) {
    const a = this.mapper.egress(r);
    h.storeEl && k(h.storeEl, "ln-data-store:request-update", { id: b, data: a }), this._fanOutRemote(h, "update", { chainKey: b, op: "update", targetId: b, payload: a, expectedVersion: _, meta: { id: b, action: g } }, { id: b, data: a, expected_version: _, url: g, meta: { entryId: wt(), queued: !1, op: "update", id: b } });
  }, o.prototype._fanOutDelete = function(h, b) {
    h.storeEl && k(h.storeEl, "ln-data-store:request-delete", { id: b }), this._fanOutRemote(h, "delete", { chainKey: b, op: "delete", targetId: b, payload: null, expectedVersion: null, meta: { id: b } }, { id: b, meta: { entryId: wt(), queued: !1, op: "delete", id: b } });
  }, o.prototype._fanOutBulkDelete = function(h, b) {
    const r = b.join(",");
    h.storeEl && k(h.storeEl, "ln-data-store:request-bulk-delete", { ids: b }), this._fanOutRemote(h, "bulk-delete", { chainKey: r, op: "bulk-delete", targetId: null, payload: { ids: b }, expectedVersion: null, meta: { bulkKey: r, ids: b } }, { ids: b, meta: { entryId: wt(), queued: !1, op: "bulk-delete", bulkKey: r } });
  }, o.prototype._requestStoreMutation = function(h, b, r) {
    if (!h.storeEl) return Promise.reject(new Error("Store element not found"));
    const _ = wt(), g = this._mutationReceipts.wait(_);
    return k(h.storeEl, "ln-data-store:request-" + b, Object.assign({}, r, { requestId: _ })), g;
  }, o.prototype._reportError = function(h, b, r) {
    this._destroyed || k(this.dom, "ln-data-coordinator:error", { operation: h, error: b, meta: r || null });
  }, o.prototype._owns = function(h) {
    var r;
    const b = this._name || ((r = this.findChildren().storeEl) == null ? void 0 : r.id);
    return !!h && h === b;
  }, o.prototype._currentQuery = function() {
    const h = this.dom.getAttribute(m), b = this.dom.getAttribute(l), r = new URLSearchParams(this.dom.getAttribute(u) || ""), _ = {};
    for (const g of new Set(r.keys())) _[g] = r.getAll(g);
    return { search: this.dom.getAttribute(d) || "", filters: _, sort: h && b ? { field: h, direction: b } : null };
  }, o.prototype._refreshAll = function(h, b) {
    for (const [r, _, g] of n)
      for (const a of this.dom.ownerDocument.querySelectorAll(r))
        if (this._owns(a.getAttribute(_))) {
          if ((g === "table" || g === "list") && a.hasAttribute(g === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            k(a, "ln-" + g + (b ? ":request-invalidate" : ":request-revalidate"), {});
            continue;
          }
          this._serveElement(a, g, null, h);
        }
  }, o.prototype._serveElement = function(h, b, r, _) {
    const g = this.findChildren(), a = g.store;
    if (!a) return;
    r && this._boundQueries.set(h, r);
    const v = this._boundQueries.get(h) || { sort: null, filters: {}, search: "" }, E = gn(v, this._currentQuery()), A = this;
    return Promise.resolve(a.ready).then(() => {
      if (A._destroyed) return;
      const S = ro(a, g.connector);
      if (b === "table" || b === "list" || b === "chart")
        return S === "remote" ? (k(h, "ln-" + b + ":set-loading", { loading: !0 }), k(g.connectorEl, p(g.connectorEl) + ":request-query", { query: E, meta: { targetEl: h, kind: b, offset: E.offset, limit: E.limit, queryGen: v.queryGen } })) : S !== "store" ? k(h, "ln-" + b + ":set-loading", { loading: !1 }) : a.getAll(E).then((C) => {
          A._destroyed || !A._boundDelivered || (k(h, "ln-" + b + ":set-loading", { loading: !1 }), k(h, "ln-" + b + ":set-data", { data: C.data, total: (_ == null ? void 0 : _.total) ?? C.total, filtered: (_ == null ? void 0 : _.filtered) ?? C.filtered, offset: C.offset ?? (_ == null ? void 0 : _.offset) ?? v.offset, queryGen: v.queryGen !== void 0 ? v.queryGen : (_ == null ? void 0 : _.queryGen) ?? C.queryGen, provisional: C.provisional === !0 }), A._boundDelivered.set(h, !0));
        });
      if (b === "options") {
        if (S === "remote") return k(g.connectorEl, p(g.connectorEl) + ":request-query", { query: {}, meta: { targetEl: h, kind: b } });
        if (S === "store") return a.getAll({}).then((C) => !A._destroyed && k(h, "ln-options:set-data", { data: C.data }));
      }
      if (b === "stat") {
        let C = r == null ? void 0 : r.filters;
        if (!C) {
          const I = h.getAttribute("data-ln-stat-filter");
          if (I != null && I.includes(":")) {
            const q = I.split(":");
            C = { [q[0].trim()]: [q.slice(1).join(":").trim()] };
          }
        }
        const L = g.connector && a && (a.windowed && C && Object.keys(C).length || a.noLocalQuery) ? "remote" : S;
        if (L === "remote") return k(g.connectorEl, p(g.connectorEl) + ":request-query", { query: { filters: C }, meta: { targetEl: h, kind: b } });
        if (L === "store") return a.count(C).then((I) => !A._destroyed && k(h, "ln-stat:set-count", { count: I }));
      }
    }).catch((S) => {
      A._destroyed || ((b === "table" || b === "list" || b === "chart") && k(h, "ln-" + b + ":set-loading", { loading: !1 }), A._reportError(b + "-query", S, { targetEl: h, kind: b }));
    });
  };
  function y(h) {
    const b = h._unsubs = [], r = (A, S, C) => {
      A.addEventListener(S, C), b.push(() => A.removeEventListener(S, C));
    };
    r(h.dom, "ln-data-store:request-remote-sync", (A) => {
      h.refreshMapper();
      const S = h.findChildren();
      S.store && S.connector && k(S.connectorEl, p(S.connectorEl) + ":request-sync", { since: A.detail.since, meta: { op: "sync" } });
    }), r(h.dom, "ln-data-store:request-page", (A) => {
      const S = h.findChildren(), C = A.detail || {};
      if (!S.connectorEl) return;
      const L = gn(C.query || {}, h._currentQuery());
      k(S.connectorEl, p(S.connectorEl) + ":request-query", {
        query: Object.assign({}, L, { offset: C.offset, limit: C.limit, queryGen: C.queryGen })
      });
    }), r(h.dom, "ln-data-coordinator:request-create", (A) => h._fanOutCreate(h.findChildren(), A.detail.data || {}, A.detail.action)), r(h.dom, "ln-data-coordinator:request-update", (A) => h._fanOutUpdate(h.findChildren(), A.detail.id, A.detail.data || {}, A.detail.expected_version, A.detail.action)), r(h.dom, "ln-data-coordinator:request-delete", (A) => h._fanOutDelete(h.findChildren(), A.detail.id)), r(h.dom, "ln-data-coordinator:request-bulk-delete", (A) => h._fanOutBulkDelete(h.findChildren(), A.detail.ids || [])), r(h.dom, "ln-api-queue:send", (A) => h._onQueueSend(A.detail || {})), r(h.dom, "ln-api-queue:failed", (A) => {
      var S;
      return h._reportError("queue-failed", ((S = A == null ? void 0 : A.detail) == null ? void 0 : S.error) || new Error("Queue failed"), (A == null ? void 0 : A.detail) || null);
    }), r(h.dom, "ln-data-store:initialized", (A) => {
      var C;
      const S = h.findChildren();
      S.store && !S.store.initializationError && S.connector && !h._noAutosync(S) && !S.store.isSyncing && (!((C = A.detail) != null && C.hasCache) || h._isStale(S)) && S.store.forceSync();
    });
    const _ = () => {
      const A = h.findChildren();
      A.store && !A.store.initializationError && A.connector && !h._noAutosync(A) && A.store.isInitialized && !A.store.isSyncing && A.store.forceSync();
    };
    r(h.dom, "ln-websocket-connector:connected", _), r(document, "submit", (A) => h._onFormSubmit(A));
    const g = (A, S, C) => {
      var L;
      h._owns(A.target.getAttribute(C)) && h._serveElement(A.target, S, S === "stat" ? { filters: ((L = A.detail) == null ? void 0 : L.filters) || null } : S === "options" ? null : io(A.detail || {}), null);
    };
    r(document, "ln-table:request-data", (A) => g(A, "table", "data-ln-table-source")), r(document, "ln-list:request-data", (A) => g(A, "list", "data-ln-list-source")), r(document, "ln-chart:request-data", (A) => g(A, "chart", "data-ln-chart-source")), r(document, "ln-options:request-data", (A) => g(A, "options", "data-ln-options")), r(document, "ln-stat:request-count", (A) => g(A, "stat", "data-ln-stat"));
    const a = (A) => {
      h._mutationReceipts.resolve(A.detail), h._refreshAll(null, !1);
    };
    r(h.dom, "ln-data-store:ready", a), r(h.dom, "ln-data-store:created", a), r(h.dom, "ln-data-store:updated", a), r(h.dom, "ln-data-store:deleted", a), r(h.dom, "ln-data-store:mutation-error", (A) => h._mutationReceipts.reject(A.detail)), r(h.dom, "ln-data-store:synced", (A) => {
      var S;
      (S = A.detail) != null && S.changed && h._refreshAll(A.detail.meta, !1);
    }), r(h.dom, "ln-data-store:query-changed", () => h._refreshAll(null, !0)), r(h.dom, "ln-search:change", (A) => {
      var C;
      A.preventDefault();
      const S = ((C = A.detail) == null ? void 0 : C.term) != null ? A.detail.term : "";
      S !== (h.dom.getAttribute(d) || "") && h.dom.setAttribute(d, S);
    }), r(h.dom, "ln-filter:change", (A) => {
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
      D ? h.dom.setAttribute(u, D) : h.dom.removeAttribute(u);
    }), r(h.dom, "ln-sort:change", (A) => {
      var q, D;
      A.preventDefault();
      const S = (q = A.detail) == null ? void 0 : q.field, C = (D = A.detail) == null ? void 0 : D.direction, L = S && C && C !== "none" ? { field: S, direction: C } : null, I = h._currentQuery().sort;
      !I && !L || I && L && I.field === L.field && I.direction === L.direction || (L ? (h.dom.setAttribute(m, L.field), h.dom.setAttribute(l, L.direction)) : (h.dom.removeAttribute(m), h.dom.removeAttribute(l)));
    });
    const v = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), E = h.findChildren().connectorEl;
    if (E) {
      const A = p(E);
      v.add(A), r(h.dom, A + ":connected", _);
    }
    v.forEach((A) => {
      r(h.dom, A + ":fetched", (S) => h._reconcileServerFetch(S.detail)), r(h.dom, A + ":created", (S) => h._reconcileServerMutation("create", S.detail)), r(h.dom, A + ":updated", (S) => h._reconcileServerMutation("update", S.detail)), r(h.dom, A + ":deleted", (S) => h._reconcileServerMutation("ack", S.detail)), r(h.dom, A + ":bulk-deleted", (S) => h._reconcileServerMutation("ack", S.detail)), r(h.dom, A + ":error", (S) => h._reconcileServerMutation("error", S.detail));
    });
  }
  o.prototype._onQueueSend = function(h) {
    this.refreshMapper();
    const b = this.findChildren();
    if (!b.store || !b.connector || !b.queue) return;
    const r = h.meta || {}, _ = p(b.connectorEl), g = h.idempotencyKey || h.entryId, a = {
      create: () => k(b.connectorEl, _ + ":request-create", { data: h.payload, url: r.action || null, idempotencyKey: g, meta: { entryId: h.entryId, queued: !0, op: "create", tempId: r.tempId } }),
      update: () => k(b.connectorEl, _ + ":request-update", { id: h.targetId, data: h.payload, expected_version: h.expectedVersion, url: r.action || null, idempotencyKey: g, meta: { entryId: h.entryId, queued: !0, op: "update", id: h.targetId } }),
      delete: () => k(b.connectorEl, _ + ":request-delete", { id: h.targetId, idempotencyKey: g, meta: { entryId: h.entryId, queued: !0, op: "delete", id: h.targetId } }),
      "bulk-delete": () => {
        var v;
        return k(b.connectorEl, _ + ":request-bulk-delete", { ids: ((v = h.payload) == null ? void 0 : v.ids) || [], idempotencyKey: g, meta: { entryId: h.entryId, queued: !0, op: "bulk-delete", bulkKey: r.bulkKey } });
      }
    };
    a[h.op] && a[h.op]();
  }, o.prototype._onFormSubmit = function(h) {
    const b = h.target;
    if (h.defaultPrevented) return;
    const r = b.hasAttribute(i) ? b.getAttribute(i) : null;
    if (r === null || (r ? !this._owns(r) : b.closest("[" + t + "]") !== this.dom)) return;
    const _ = An(b);
    if (_ !== "POST" && _ !== "PUT" && _ !== "PATCH") return;
    h.preventDefault();
    const g = Oe(b);
    delete g._method, delete g._token;
    const a = g.id, v = g.expected_version, E = b.getAttribute("action") || "", A = this.findChildren();
    delete g.id, delete g.expected_version, _ === "POST" ? this._fanOutCreate(A, g, E) : this._fanOutUpdate(A, a, g, v, E);
  }, o.prototype._reconcileServerFetch = function(h) {
    if (!h) return;
    const b = h.meta || {}, r = this.findChildren(), _ = h.data;
    this.refreshMapper();
    const g = Array.isArray(_) ? _ : (_ == null ? void 0 : _.data) || [], a = Array.isArray(_ == null ? void 0 : _.deleted) ? _.deleted : [], v = Array.isArray(_) ? Math.floor(Date.now() / 1e3) : (_ == null ? void 0 : _.synced_at) ?? (_ == null ? void 0 : _.since) ?? Math.floor(Date.now() / 1e3), E = g.map((A) => this.mapper.ingress(A));
    if (!(!r.store || r.store.initializationError)) {
      if (!b.kind) return r.store.applySync(E, a, v, { total: h.total, filtered: h.filtered, offset: h.offset, queryGen: h.queryGen, targetEl: b.targetEl });
      r.store.applyQuery(E, { total: h.total }).then((A) => {
        const S = b.kind;
        S === "table" || S === "list" || S === "chart" ? (k(b.targetEl, "ln-" + S + ":set-loading", { loading: !1 }), k(b.targetEl, "ln-" + S + ":set-data", { data: A, total: h.total ?? A.length, filtered: h.filtered ?? A.length, offset: h.offset, queryGen: b.queryGen }), this._boundDelivered.set(b.targetEl, !0)) : S === "options" ? r.store.getAll({}).then((C) => k(b.targetEl, "ln-options:set-data", { data: C.data })) : S === "stat" && k(b.targetEl, "ln-stat:set-count", { count: h.filtered ?? h.total ?? E.length });
      });
    }
  }, o.prototype._reconcileServerMutation = function(h, b) {
    var g;
    if (!b) return;
    const r = this.findChildren(), _ = b.meta || {};
    if (h === "create") {
      if (!b.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), _);
      const a = this.mapper.ingress(b.record);
      (r.storeEl ? this._requestStoreMutation(r, "update", { id: _.tempId, data: a }) : Promise.resolve()).then(() => {
        _.queued && r.queue && k(r.queueEl, "ln-api-queue:resolve-create", { entryId: _.entryId, oldKey: _.tempId, newId: a.id });
      }).catch((v) => this._reportError("create-reconcile", v, _));
    } else if (h === "update") {
      const a = b.record ? this.mapper.ingress(b.record) : null;
      (r.storeEl && a ? this._requestStoreMutation(r, "update", { id: _.id, data: a }) : Promise.resolve()).then(() => {
        _.queued && r.queue && k(r.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
      }).catch((v) => this._reportError("update-reconcile", v, _));
    } else if (h === "ack")
      _.queued && r.queue && k(r.queueEl, "ln-api-queue:ack", { entryId: _.entryId });
    else if (h === "error") {
      const a = b.status || ((g = b.error) == null ? void 0 : g.status) || 0;
      _.queued && r.queue && k(r.queueEl, "ln-api-queue:nack", { entryId: _.entryId, reason: a === 401 || a === 419 ? "auth" : a === 0 || a >= 500 ? "retry" : "drop" }), r.storeEl && k(r.storeEl, "ln-data-store:request-sync-failed", { error: b.error || b, status: a }), this._reportError("connector-error", b.error || b, _);
    }
  }, o.prototype.destroy = function() {
    var h;
    if (this.dom[e]) {
      for (this._destroyed = !0; (h = this._unsubs) != null && h.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function w(h, b) {
    const r = h[e];
    r && (b === "data-ln-data-coordinator-mapper" ? r.refreshMapper() : (b === d || b === u || b === m || b === l) && r._queueQueryRefresh());
  }
  H(t, e, o, "ln-data-coordinator", {
    extraAttributes: ["data-ln-data-coordinator-mapper", d, u, m, l],
    onAttributeChange: w
  }), window[e].init = window[e];
})();
const so = "ln_api_queue", ao = 2, Z = "outbox", ot = "_queue_meta";
function lt(t, e) {
  return t.error || new Error(e);
}
function Bt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function _n(t) {
  return "seq:" + t;
}
function re(t) {
  return "paused:" + t;
}
function bn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function lo(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function co(t, e, i, d) {
  const u = /* @__PURE__ */ new Map(), m = [], l = [];
  for (const c of t || [])
    u.has(c.chainKey) || u.set(c.chainKey, []), u.get(c.chainKey).push(c);
  return u.forEach((c, s) => {
    c.sort((f, p) => f.seq - p.seq);
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
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = d + i, n.updatedAt = d, m.push(n);
    }
  }), { entries: m, wakeups: l };
}
function uo(t, e, i, d, u) {
  const m = [], l = [];
  for (const c of t || []) {
    if (c.entryId === e) {
      l.push(c.entryId);
      continue;
    }
    c.chainKey === i && (c.chainKey = d, c.targetId === i && (c.targetId = d), c.meta && c.meta.id === i && (c.meta.id = d), c.meta && typeof c.meta.action == "string" && (c.meta.action = lo(c.meta.action, i, d)), c.updatedAt = u, m.push(c));
  }
  return { changed: m, deleted: l };
}
class fo {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || so, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const d = this.indexedDB.open(this.dbName, ao);
      d.onupgradeneeded = (u) => {
        const m = u.target.result;
        let l;
        m.objectStoreNames.contains(Z) ? l = u.target.transaction.objectStore(Z) : l = m.createObjectStore(Z, { keyPath: "entryId" }), l.indexNames.contains("by_scope_chain") || l.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), l.indexNames.contains("by_scope_seq") || l.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), m.objectStoreNames.contains(ot) || m.createObjectStore(ot, { keyPath: "key" });
      }, d.onerror = () => i(lt(d, "Queue database open failed")), d.onsuccess = (u) => {
        this._db = u.target.result, this._db.onversionchange = () => this.close(), e(this._db);
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
    return this.open().then((i) => i ? new Promise((d, u) => {
      const l = i.transaction(Z, "readonly").objectStore(Z).index("by_scope_seq").getAll(Bt(this.keyRange, e));
      l.onsuccess = () => d(l.result || []), l.onerror = () => u(lt(l, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((d) => d ? new Promise((u, m) => {
      const l = d.transaction([ot, Z], "readwrite"), c = l.objectStore(ot), s = l.objectStore(Z), n = _n(e);
      let f = null;
      const p = (y) => {
        const w = y + 1;
        f = {
          entryId: this.uuid(),
          scope: e,
          chainKey: i.chainKey,
          seq: w,
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
        }, c.put({ key: n, value: w }), s.put(f);
      }, o = c.get(n);
      o.onerror = () => m(lt(o, "Queue sequence read failed")), o.onsuccess = () => {
        const y = o.result;
        if (y && typeof y.value == "number") {
          p(y.value);
          return;
        }
        const w = s.index("by_scope_seq").getAll(Bt(this.keyRange, e));
        w.onerror = () => m(lt(w, "Queue sequence migration failed")), w.onsuccess = () => {
          const h = (w.result || []).reduce((b, r) => Math.max(b, r.seq || 0), 0);
          p(h);
        };
      }, l.oncomplete = () => u(f), l.onerror = () => m(l.error || new Error("Queue enqueue transaction failed")), l.onabort = () => m(l.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, d) {
    return this.open().then((u) => u ? new Promise((m, l) => {
      const c = u.transaction(Z, "readwrite"), s = c.objectStore(Z), n = s.index("by_scope_seq").getAll(Bt(this.keyRange, e)), f = this.now();
      let p = { entries: [], wakeups: [] };
      n.onerror = () => l(lt(n, "Queue claim read failed")), n.onsuccess = () => {
        p = co(n.result || [], i, d, f);
        for (const o of p.entries) s.put(o);
      }, c.oncomplete = () => m(p), c.onerror = () => l(c.error || new Error("Queue claim transaction failed")), c.onabort = () => l(c.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (d, u) => (u.delete(d.entryId), { status: "acked", entry: d }));
  }
  nack(e, i, d, u) {
    u = u || {};
    const m = u.maxAttempts || 8, l = u.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((c) => c ? new Promise((s, n) => {
      const f = c.transaction([Z, ot], "readwrite"), p = f.objectStore(Z), o = f.objectStore(ot), y = p.get(i);
      let w = null;
      y.onerror = () => n(lt(y, "Queue nack read failed")), y.onsuccess = () => {
        const h = y.result;
        if (!(!h || h.scope !== e)) {
          if (d === "drop") {
            p.delete(h.entryId), w = { status: "dropped", entry: h };
            return;
          }
          if (bn(h), h.updatedAt = this.now(), d === "auth") {
            h.status = "pending", p.put(h), o.put({ key: re(e), value: "auth" }), w = { status: "auth", entry: h };
            return;
          }
          if (d === "retry") {
            if (h.attempts = (h.attempts || 0) + 1, h.attempts >= m) {
              h.status = "failed", h.nextAttemptAt = 0, p.put(h), w = { status: "failed", entry: h };
              return;
            }
            const b = l[Math.min(h.attempts - 1, l.length - 1)];
            h.status = "pending", h.nextAttemptAt = this.now() + b, p.put(h), w = { status: "retry", entry: h, delay: b };
          }
        }
      }, f.oncomplete = () => s(w), f.onerror = () => n(f.error || new Error("Queue nack transaction failed")), f.onabort = () => n(f.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, d) {
    return this._remapTransaction(e, null, i, d);
  }
  resolveCreate(e, i, d, u) {
    return this._remapTransaction(e, i, d, u);
  }
  _remapTransaction(e, i, d, u) {
    return this.open().then((m) => m ? new Promise((l, c) => {
      const s = m.transaction(Z, "readwrite"), n = s.objectStore(Z), f = n.index("by_scope_seq").getAll(Bt(this.keyRange, e));
      let p = { changed: [], deleted: [] };
      f.onerror = () => c(lt(f, "Queue remap read failed")), f.onsuccess = () => {
        p = uo(f.result || [], i, d, u, this.now());
        for (const o of p.deleted) n.delete(o);
        for (const o of p.changed) n.put(o);
      }, s.oncomplete = () => l(p.changed), s.onerror = () => c(s.error || new Error("Queue remap transaction failed")), s.onabort = () => c(s.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((d, u) => {
      const m = i.transaction(Z, "readwrite"), l = m.objectStore(Z), c = l.index("by_scope_seq").getAll(Bt(this.keyRange, e));
      let s = 0;
      c.onerror = () => u(lt(c, "Queue failed-entry read failed")), c.onsuccess = () => {
        for (const n of c.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), bn(n), l.put(n), s++);
      }, m.oncomplete = () => d(s), m.onerror = () => u(m.error || new Error("Queue failed-entry reset failed")), m.onabort = () => u(m.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((d, u) => {
      const l = i.transaction(ot, "readonly").objectStore(ot).get(re(e));
      l.onsuccess = () => {
        const c = l.result ? l.result.value : !1;
        d(c || !1);
      }, l.onerror = () => u(lt(l, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((d) => {
      if (d)
        return new Promise((u, m) => {
          const l = d.transaction(ot, "readwrite"), c = typeof i == "string" ? i : i ? "manual" : !1;
          l.objectStore(ot).put({ key: re(e), value: c }), l.oncomplete = () => u(), l.onerror = () => m(l.error || new Error("Queue pause-state write failed")), l.onabort = () => m(l.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((d, u) => {
          const m = i.transaction([Z, ot], "readwrite"), c = m.objectStore(Z).index("by_scope_seq").openCursor(Bt(this.keyRange, e));
          c.onsuccess = (s) => {
            const n = s.target.result;
            n && (n.delete(), n.continue());
          }, c.onerror = () => u(lt(c, "Queue clear failed")), m.objectStore(ot).delete(_n(e)), m.objectStore(ot).delete(re(e)), m.oncomplete = () => d(), m.onerror = () => u(m.error || new Error("Queue clear transaction failed")), m.onabort = () => u(m.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, d) {
    return this.open().then((u) => u ? new Promise((m, l) => {
      const c = u.transaction(Z, "readwrite"), s = c.objectStore(Z), n = s.get(i);
      let f = null;
      n.onerror = () => l(lt(n, "Queue entry read failed")), n.onsuccess = () => {
        const p = n.result;
        !p || p.scope !== e || (f = d(p, s));
      }, c.oncomplete = () => m(f), c.onerror = () => l(c.error || new Error("Queue entry transaction failed")), c.onabort = () => l(c.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], d = 8, u = 6e4;
  if (window[e] !== void 0) return;
  function m(n) {
    const f = n[e];
    f && f._drain();
  }
  const l = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: m, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, c = new fo({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: wt
  });
  function s(n) {
    this.dom = n, n[e] = this;
    const f = n.closest("[data-ln-data-coordinator]");
    this.scope = n.id || (f ? f.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = wt(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const p = this;
    return c.open().then((o) => o ? c.getPaused(p.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((o) => {
      if (p._paused = !!o, p._paused) {
        const y = typeof o == "string" ? o : "auth";
        k(p.dom, "ln-api-queue:paused", { reason: y, restored: !0 });
      }
      return p._emitPendingCount();
    }).then(() => p._drain()).catch((o) => {
      console.error("[ln-api-queue] Initialization failed:", o), k(p.dom, "ln-api-queue:error", { operation: "initialize", error: o });
    }), this;
  }
  s.prototype._isOnline = function() {
    const n = this.dom.getAttribute("data-ln-api-queue-online");
    return n === "true" ? !0 : n === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const n = this;
    return c.allForScope(n.scope).then((f) => (k(n.dom, "ln-api-queue:pending-count", { count: f.length, scope: n.scope }), f.length === 0 && k(n.dom, "ln-api-queue:drained", { scope: n.scope }), f));
  }, s.prototype._clearTimer = function(n) {
    const f = this._timers.get(n);
    f && (clearTimeout(f), this._timers.delete(n));
  }, s.prototype._scheduleTimer = function(n, f) {
    const p = Math.max(0, f), o = this._timers.get(n);
    o && clearTimeout(o);
    const y = this, w = setTimeout(() => {
      y._timers.delete(n), y._drain();
    }, p);
    this._timers.set(n, w);
  }, s.prototype._drain = function() {
    const n = this;
    return n._paused || !n._isOnline() ? Promise.resolve() : (n._drainPromise || (n._drainPromise = c.claimReady(n.scope, n._workerId, u).then((f) => {
      for (const p of f.wakeups)
        n._scheduleTimer(p.chainKey, p.at - Date.now());
      for (const p of f.entries)
        n._clearTimer(p.chainKey), k(n.dom, "ln-api-queue:send", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          op: p.op,
          targetId: p.targetId,
          payload: p.payload,
          expectedVersion: p.expectedVersion,
          idempotencyKey: p.entryId,
          meta: p.meta
        });
    }).catch((f) => {
      console.error("[ln-api-queue] Drain failed:", f), k(n.dom, "ln-api-queue:error", { operation: "drain", error: f });
    }).finally(() => {
      n._drainPromise = null;
    })), n._drainPromise);
  }, s.prototype._onEnqueue = function(n) {
    const f = this;
    return c.enqueue(f.scope, n.detail || {}).then((p) => {
      if (p)
        return f._emitPendingCount().then((o) => (k(f.dom, "ln-api-queue:enqueued", {
          entryId: p.entryId,
          chainKey: p.chainKey,
          count: o.length
        }), f._drain()));
    }).catch((p) => {
      k(f.dom, "ln-api-queue:error", { operation: "enqueue", error: p });
    });
  }, s.prototype._onAck = function(n) {
    const f = this, p = n.detail || {};
    return c.ack(f.scope, p.entryId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((o) => {
      k(f.dom, "ln-api-queue:error", { operation: "ack", entryId: p.entryId, error: o });
    });
  }, s.prototype._onNack = function(n) {
    const f = this, p = n.detail || {};
    return c.nack(f.scope, p.entryId, p.reason, {
      maxAttempts: d,
      backoff: i
    }).then((o) => {
      if (o)
        return o.status === "failed" ? k(f.dom, "ln-api-queue:failed", {
          entryId: o.entry.entryId,
          chainKey: o.entry.chainKey,
          attempts: o.entry.attempts
        }) : o.status === "retry" ? f._scheduleTimer(o.entry.chainKey, o.delay) : o.status === "auth" && (f._paused = !0, k(f.dom, "ln-api-queue:paused", { reason: "auth" }), k(f.dom, "ln-api-queue:auth-required", {
          entryId: o.entry.entryId,
          chainKey: o.entry.chainKey
        })), f._emitPendingCount().then(() => {
          if (o.status === "dropped") return f._drain();
        });
    }).catch((o) => {
      k(f.dom, "ln-api-queue:error", { operation: "nack", entryId: p.entryId, error: o });
    });
  }, s.prototype._onRemap = function(n) {
    const f = this, p = n.detail || {};
    return c.remap(f.scope, p.oldKey, p.newId).catch((o) => {
      k(f.dom, "ln-api-queue:error", { operation: "remap", error: o });
    });
  }, s.prototype._onResolveCreate = function(n) {
    const f = this, p = n.detail || {};
    return c.resolveCreate(f.scope, p.entryId, p.oldKey, p.newId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((o) => {
      k(f.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: p.entryId,
        error: o
      });
    });
  }, s.prototype._onResume = function() {
    const n = this;
    return c.setPaused(n.scope, !1).then(() => (n._paused = !1, k(n.dom, "ln-api-queue:resumed", {}), n._drain())).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "resume", error: f });
    });
  }, s.prototype._onPause = function() {
    const n = this;
    return c.setPaused(n.scope, "manual").then(() => {
      n._paused = !0, k(n.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "pause", error: f });
    });
  }, s.prototype._onDrain = function() {
    const n = this;
    return c.resetFailed(n.scope).then(() => {
      const f = n._drainPromise;
      return f ? f.then(() => n._drain()) : n._drain();
    }).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "manual-drain", error: f });
    });
  }, s.prototype._onClear = function() {
    const n = this;
    return n._timers.forEach((f) => clearTimeout(f)), n._timers.clear(), c.clear(n.scope).then(() => {
      n._paused = !1, k(n.dom, "ln-api-queue:pending-count", { count: 0, scope: n.scope }), k(n.dom, "ln-api-queue:drained", { scope: n.scope });
    }).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "clear", error: f });
    });
  }, s.prototype._bindEvents = function() {
    const n = this;
    n._handlers = {
      enqueue: (f) => n._onEnqueue(f),
      ack: (f) => n._onAck(f),
      nack: (f) => n._onNack(f),
      remap: (f) => n._onRemap(f),
      resolveCreate: (f) => n._onResolveCreate(f),
      resume: () => n._onResume(),
      pause: () => n._onPause(),
      drain: () => n._onDrain(),
      clear: () => n._onClear()
    }, n.dom.addEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.addEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.addEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.addEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.addEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.addEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.addEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.addEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.addEventListener("ln-api-queue:request-clear", n._handlers.clear);
  }, s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n.dom.removeEventListener("ln-api-queue:request-enqueue", n._handlers.enqueue), n.dom.removeEventListener("ln-api-queue:ack", n._handlers.ack), n.dom.removeEventListener("ln-api-queue:nack", n._handlers.nack), n.dom.removeEventListener("ln-api-queue:request-remap", n._handlers.remap), n.dom.removeEventListener("ln-api-queue:resolve-create", n._handlers.resolveCreate), n.dom.removeEventListener("ln-api-queue:request-resume", n._handlers.resume), n.dom.removeEventListener("ln-api-queue:request-pause", n._handlers.pause), n.dom.removeEventListener("ln-api-queue:request-drain", n._handlers.drain), n.dom.removeEventListener("ln-api-queue:request-clear", n._handlers.clear), window.removeEventListener("online", n._onlineHandler), n._timers.forEach((f) => clearTimeout(f)), n._timers.clear(), delete n.dom[e];
  }, H(t, e, s, "ln-api-queue", {
    attributes: l
  });
})();
function Ei(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Pt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function ho(t, e, i) {
  const d = Ei(t);
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
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, d = e.xField || "label", u = e.yField || "value", m = e.includeZero !== !1, l = ho(e.padding, i.width, i.height), c = Array.isArray(t) ? t : [], s = [];
  for (let a = 0; a < c.length; a++) {
    const v = c[a] || {}, E = Ei(v[u]);
    E !== null && s.push({
      record: v,
      sourceIndex: a,
      label: v[d] == null ? String(a + 1) : String(v[d]),
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
  let n = s[0].value, f = s[0].value;
  for (let a = 1; a < s.length; a++)
    s[a].value < n && (n = s[a].value), s[a].value > f && (f = s[a].value);
  let p = n, o = f;
  m && (p = Math.min(0, p), o = Math.max(0, o)), p === o && (o === 0 ? o = 1 : o > 0 ? p = 0 : o = 0);
  const y = Math.max(1, i.width - l * 2), w = Math.max(1, i.height - l * 2), h = o - p, b = i.y + i.height - l - (0 - p) / h * w, r = [];
  for (let a = 0; a < s.length; a++) {
    const v = s[a], E = s.length === 1 ? 0.5 : a / (s.length - 1), A = i.x + l + E * y, S = i.y + i.height - l - (v.value - p) / h * w;
    r.push({
      record: v.record,
      sourceIndex: v.sourceIndex,
      label: v.label,
      value: v.value,
      x: A,
      y: S,
      pointString: Pt(A) + "," + Pt(S)
    });
  }
  const _ = r.map((a) => a.pointString).join(" ");
  let g = "";
  if (r.length > 0) {
    const a = r[0], v = r[r.length - 1], E = Pt(a.x) + "," + Pt(b), A = Pt(v.x) + "," + Pt(b);
    g = E + " " + _ + " " + A;
  }
  return {
    points: r,
    linePoints: _,
    areaPoints: g,
    count: r.length,
    min: n,
    max: f,
    domainMin: p,
    domainMax: o,
    baselineY: b
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function d(n) {
    const f = n[e];
    f && f.requestData();
  }
  function u(n) {
    const f = n[e];
    f && f._render();
  }
  const m = {
    "data-ln-chart": { prop: "name", type: "string", read: K, fallback: "", effect: u, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: d, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: d, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: u, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: u, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: u, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: u, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: u, description: "Forces Y axis scale to start at zero" }
  }, l = X(m);
  function c(n, f) {
    n && (n.textContent = f);
  }
  function s(n) {
    this.dom = n, Y(this, n, l), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const f = this;
    return this._onSetData = function(p) {
      const o = p.detail || {};
      f._data = Array.isArray(o.data) ? o.data : [], f.isLoaded = !0, f._setLoading(!1), f._render();
    }, this._onSetLoading = function(p) {
      f._setLoading(!!(p.detail && p.detail.loading));
    }, this._onRefresh = function() {
      f.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  s.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), f = n === null ? NaN : Number(n), p = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(f) && f >= 0 ? f : 16,
      type: p === "area" || p === "polygon" ? "area" : "line",
      viewBox: this.plot && po(this.plot.getAttribute("viewBox")) || i
    };
  }, s.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, s.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const f = this.name + "-label", p = '[data-ln-template="' + f + '"]';
    if (!this.dom.querySelector(p) && !document.querySelector(p)) return;
    const o = Lt(this.dom, f, "ln-chart");
    if (!o) return;
    const y = J(this.dom);
    for (const w of n.points) {
      const h = o.cloneNode(!0);
      Zt(h, {
        label: w.label,
        value: rt(w.value, y)
      }), this.labels.appendChild(h);
    }
  }, s.prototype._render = function() {
    const n = this._readOptions(), f = go(this._data, n);
    this.model = f, this.line && (this.line.setAttribute("points", f.linePoints), this.line.toggleAttribute("hidden", f.count === 0)), this.area && (this.area.setAttribute("points", f.areaPoints), this.area.toggleAttribute("hidden", f.count === 0 || n.type !== "area"));
    const p = f.count === 0;
    this.dom.classList.toggle("ln-chart--empty", p), this.empty && this.empty.toggleAttribute("hidden", !p);
    const o = J(this.dom);
    c(this.minimum, rt(f.min, o)), c(this.maximum, rt(f.max, o)), c(this.count, rt(f.count, o)), this._renderLabels(f), k(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: f.count,
      min: f.min,
      max: f.max
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
    attributes: m
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-options": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: K, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: K, fallback: "name", description: "Field name used for option visible label text" }
  }, d = X(i);
  function u(m) {
    this.dom = m, Y(this, m, d);
    const l = this;
    return this._onSetData = function(c) {
      c.detail && l._rebuild(c.detail.data || []);
    }, m.addEventListener("ln-options:set-data", this._onSetData), k(m, "ln-options:request-data", { options: this._storeName }), this;
  }
  u.prototype._rebuild = function(m) {
    const l = this.dom, c = this._valueField, s = this._labelField, n = l.getAttribute("data-ln-value") || l.value, f = l.querySelectorAll("option");
    for (let o = f.length - 1; o >= 0; o--)
      f[o].value !== "" && l.removeChild(f[o]);
    for (let o = 0; o < m.length; o++) {
      const y = m[o], w = document.createElement("option");
      w.value = String(y[c]), w.textContent = y[s] != null ? y[s] : "", l.appendChild(w);
    }
    const p = l.options;
    for (let o = 0; o < p.length; o++)
      if (p[o].value === String(n)) {
        l.value = String(n);
        break;
      }
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, H(t, e, u, "ln-options", {
    attributes: i
  });
})();
function _o(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
  if (!i) return null;
  const u = {};
  return u[i] = [d], u;
}
function bo(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: K, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, d = X(i);
  function u(m) {
    return this.dom = m, Y(this, m, d), this._onSetCount = function(l) {
      m.textContent = bo(l.detail && l.detail.count), m.classList.remove("is-loading");
    }, m.addEventListener("ln-stat:set-count", this._onSetCount), k(m, "ln-stat:request-count", {
      stat: this._storeName,
      filters: _o(this._filterRaw)
    }), this;
  }
  u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, H(t, e, u, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", d = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  let m = null;
  const l = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), c = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), s = "lni:", n = "lni:v", f = "1";
  function p() {
    try {
      if (localStorage.getItem(n) !== f) {
        for (let _ = localStorage.length - 1; _ >= 0; _--) {
          const g = localStorage.key(_);
          g && g.indexOf(s) === 0 && localStorage.removeItem(g);
        }
        localStorage.setItem(n, f);
      }
    } catch {
    }
  }
  p();
  function o() {
    return m || (m = document.getElementById(t), m || (m = document.createElementNS("http://www.w3.org/2000/svg", "svg"), m.id = t, m.setAttribute("hidden", ""), m.setAttribute("aria-hidden", "true"), m.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(m, document.body.firstChild))), m;
  }
  function y(_) {
    return _.indexOf(i) === 0 ? c + "/" + _.slice(i.length) + ".svg" : l + "/" + _.slice(e.length) + ".svg";
  }
  function w(_, g) {
    const a = g.match(/viewBox="([^"]+)"/), v = a ? a[1] : "0 0 24 24", E = g.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = E ? E[1].trim() : "", S = g.match(/<svg([^>]*)>/i), C = S ? S[1] : "", L = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    L.id = _, L.setAttribute("viewBox", v), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const q = C.match(new RegExp(I + '="([^"]*)"'));
      q && L.setAttribute(I, q[1]);
    }), L.innerHTML = A, o().querySelector("defs").appendChild(L);
  }
  function h(_) {
    if (d.has(_) || u.has(_)) return;
    if (_.indexOf(i) === 0 && !c) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", _);
      return;
    }
    const g = _.slice(1);
    try {
      const v = localStorage.getItem(s + g);
      if (v) {
        w(g, v), d.add(_);
        return;
      }
    } catch {
    }
    u.add(_);
    const a = y(_);
    fetch(a).then(function(v) {
      if (!v.ok) throw new Error(v.status);
      return v.text();
    }).then(function(v) {
      w(g, v), d.add(_), u.delete(_);
      try {
        localStorage.setItem(s + g, v);
      } catch {
      }
    }).catch(function(v) {
      console.error("[ln-icon] Fetch failed for:", g, v), u.delete(_);
    });
  }
  function b(_) {
    const g = 'use[href^="' + e + '"], use[href^="' + i + '"]', a = _.querySelectorAll ? _.querySelectorAll(g) : [];
    if (_.matches && _.matches(g)) {
      const v = _.getAttribute("href");
      v && h(v);
    }
    Array.prototype.forEach.call(a, function(v) {
      const E = v.getAttribute("href");
      E && h(E);
    });
  }
  function r() {
    b(document), ct(function() {
      te({
        onInit: function(_) {
          b(_);
        }
      }), Nt(["href"], function(_) {
        if ((_.tagName ? _.tagName.toLowerCase() : "") === "use") {
          const a = _.getAttribute("href");
          a && (a.indexOf(e) === 0 || a.indexOf(i) === 0) && h(a);
        }
      });
    }, "ln-icon");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
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
    for (let u = 1; u <= t.length; u++)
      e.charAt(d - 1) === t.charAt(u - 1) ? i[d][u] = i[d - 1][u - 1] : i[d][u] = Math.min(
        i[d - 1][u - 1] + 1,
        i[d][u - 1] + 1,
        i[d - 1][u] + 1
      );
  return i[e.length][t.length];
}
function vo(t, e = Ve) {
  if (e.has(t)) return null;
  let i = null, d = 1 / 0;
  for (const m of e) {
    const l = yo(t, m);
    l < d && (d = l, i = m);
  }
  const u = Math.max(3, Math.floor(t.length * 0.4));
  return d <= u ? i : null;
}
function Ai(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function wo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], u = [i, ...i.querySelectorAll("*")];
  for (let m = 0; m < u.length; m++) {
    const l = u[m];
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
          e.getElementById(n) || e.querySelector("#" + Ai(n)) || d.push({
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
  const d = [], u = [i, ...i.querySelectorAll("*")];
  for (let m = 0; m < u.length; m++) {
    const l = u[m];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && (s.name.endsWith("-source") || s.name.endsWith("-store")) && s.name !== "data-ln-data-store") {
          const f = (s.value || "").trim();
          if (!f) {
            d.push({
              type: "store-empty",
              element: l,
              attribute: s.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${l.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          const p = Ai(f), o = e.querySelector(`[data-ln-data-store="${p}"], [data-ln-store="${p}"]`), y = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(f);
          !o && !y && d.push({
            type: "store-unresolved",
            element: l,
            attribute: s.name,
            storeName: f,
            message: `[ln-debug] Unresolved store reference: <${l.tagName.toLowerCase()} ${s.name}="${f}"> targets store "${f}", but no [data-ln-data-store="${f}"] exists in the document.`
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
  const u = /* @__PURE__ */ new Map();
  for (let m = 0; m < d.length; m++) {
    const l = d[m], c = (l.getAttribute("data-ln-data-store") || "").trim();
    c && (u.has(c) || u.set(c, []), u.get(c).push(l));
  }
  for (const [m, l] of u.entries())
    l.length > 1 && i.push({
      type: "store-duplicate",
      storeName: m,
      elements: l,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${m}". Store names must be unique across the document.`
    });
  return i;
}
function So(t = document, e = Ve) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], u = [i, ...i.querySelectorAll("*")];
  for (let m = 0; m < u.length; m++) {
    const l = u[m];
    if (l.attributes)
      for (let c = 0; c < l.attributes.length; c++) {
        const s = l.attributes[c];
        if (s.name.startsWith("data-ln-") && !e.has(s.name)) {
          const n = vo(s.name, e), f = n ? ` Did you mean "${n}"?` : "";
          d.push({
            type: "attribute-unknown",
            element: l,
            attribute: s.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${s.name}" on <${l.tagName.toLowerCase()}>.${f}`
          });
        }
      }
  }
  return d;
}
function xe(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Ve, d = wo(t), u = Eo(t), m = Ao(t), l = So(t, i), c = [
    ...d,
    ...u,
    ...m,
    ...l
  ];
  if (!e.silent)
    for (let s = 0; s < c.length; s++)
      console.warn(c[s].message);
  return {
    idIssues: d,
    storeIssues: u,
    uniquenessIssues: m,
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
      const u = xe(t);
      i && i(u);
    }, e);
  }
  On() > 0 ? mt(d) : d();
}
function Co(t, e, i, d) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", d), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", d.oldValue, "→", d.newValue), console.groupEnd());
}
let Ot = [];
function To() {
  Ot = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Ot.push(document.body);
}
function Si(t) {
  if (t === window || t === document)
    return Ot.indexOf(document.body) !== -1;
  for (let e = 0; e < Ot.length; e++)
    if (Ot[e].contains(t)) return !0;
  return !1;
}
function ko(t, e, i, d) {
  Si(i) && Co(t, e, i, d);
}
function Ie() {
  To(), Pi(Ot.length > 0 ? ko : null, Ot.length > 0 ? Si : null);
}
function yn() {
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
  function d(m) {
    return this.dom = m, oe(m.ownerDocument || document), yn(), this;
  }
  d.prototype.verify = function(m, l) {
    return xe(m || (this.dom ? this.dom.ownerDocument || this.dom : document), l);
  }, d.prototype.destroy = function() {
    delete this.dom[e], yn();
  };
  const u = H(t, e, d, "ln-debug", {
    attributes: i,
    onInit: function(m) {
      typeof document < "u" && oe(m && m.ownerDocument ? m.ownerDocument : document);
    },
    onSubtreeChange: function(m) {
      typeof document < "u" && oe(m && m.ownerDocument ? m.ownerDocument : document);
    }
  });
  u.verify = function(m, l) {
    return xe(m || document, l);
  }, u.schedule = function(m, l, c) {
    return oe(m || document, l, c);
  };
})();
