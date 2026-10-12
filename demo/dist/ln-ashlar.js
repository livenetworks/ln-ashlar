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
function Fi(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function Bi(t) {
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
function Pi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Re(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Hi(t, e) {
  return !t || !document.contains(t) || Re(t) || e && typeof t[e] != "function" ? !1 : Gt(t);
}
function En(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function At(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.tagName === "DATA" && t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
}
function An(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function Oe(t, e) {
  const i = !!(e && e.typed), d = e && e.exclude, u = {}, p = t.elements, a = {};
  if (i)
    for (let l = 0; l < p.length; l++) {
      const s = p[l];
      s.name && s.type === "checkbox" && !s.disabled && (a[s.name] = (a[s.name] || 0) + 1);
    }
  for (let l = 0; l < p.length; l++) {
    const s = p[l];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button") && !(d && s.matches && s.matches(d)))
      if (s.type === "checkbox")
        i && a[s.name] === 1 ? u[s.name] = s.checked : (u[s.name] || (u[s.name] = []), s.checked && u[s.name].push(s.value));
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
function Ui(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function Ne(t, e) {
  const i = t.elements, d = [], u = {};
  for (let p = 0; p < i.length; p++) {
    const a = i[p];
    a.name && a.type === "checkbox" && (u[a.name] = (u[a.name] || 0) + 1);
  }
  for (let p = 0; p < i.length; p++) {
    const a = i[p];
    if (a.type === "file" || a.type === "submit" || a.type === "button") continue;
    const l = a.getAttribute("data-ln-fill-as") || a.name;
    if (!l || !(l in e)) continue;
    const s = e[l];
    if (a.type === "checkbox") {
      if (Array.isArray(s))
        a.checked = s.indexOf(a.value) !== -1;
      else if (u[a.name] > 1) {
        const n = String(s).split(",").map(function(f) {
          return f.trim();
        });
        a.checked = n.indexOf(a.value) !== -1;
      } else
        a.checked = Ui(s);
      d.push(a);
    } else if (a.type === "radio")
      a.checked = a.value === String(s), d.push(a);
    else if (a.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < a.options.length; n++)
          a.options[n].selected = s.indexOf(a.options[n].value) !== -1;
      d.push(a);
    } else
      a.value = s, a.tagName === "SELECT" && s != null && a.setAttribute("data-ln-value", s), d.push(a);
  }
  return d;
}
function Me(t, e, { get: i, set: d }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(u) {
      d ? d.call(this, u, (p) => e.set.call(this, p)) : e.set.call(this, u);
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
function zi(t, e) {
  Cn[t] = e;
}
function Ki(t) {
  return Cn[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = zi, window.lnCore.getDataMapper = Ki);
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
  for (let a = 0; a < i.length; a++) {
    const l = i[a], s = l.getAttribute("data-ln-field");
    e[s] != null && (l.textContent = e[s]);
  }
  const d = t.querySelectorAll("[data-ln-attr]");
  for (let a = 0; a < d.length; a++) {
    const l = d[a], s = l.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < s.length; n++) {
      const f = s[n].trim().split(":");
      if (f.length !== 2) continue;
      const m = f[0].trim(), r = f[1].trim();
      e[r] != null && l.setAttribute(m, e[r]);
    }
  }
  const u = t.querySelectorAll("[data-ln-show]");
  for (let a = 0; a < u.length; a++) {
    const l = u[a], s = l.getAttribute("data-ln-show");
    s in e && l.classList.toggle("hidden", !e[s]);
  }
  const p = t.querySelectorAll("[data-ln-class]");
  for (let a = 0; a < p.length; a++) {
    const l = p[a], s = l.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < s.length; n++) {
      const f = s[n].trim().split(":");
      if (f.length !== 2) continue;
      const m = f[0].trim(), r = f[1].trim();
      r in e && l.classList.toggle(m, !!e[r]);
    }
  }
  return t;
}
function ji(t, e) {
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
      function(a, l) {
        return e[l] !== void 0 ? e[l] : "";
      }
    ));
  }
  const d = function(p, a) {
    return e[a] !== void 0 ? e[a] : "";
  }, u = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && u.push(t);
  for (let p = 0; p < u.length; p++) {
    const a = u[p], l = a.attributes;
    for (let s = 0; s < l.length; s++) {
      const n = l[s];
      n.value.indexOf("{{") !== -1 && a.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, d));
    }
  }
  return t;
}
function Wi(t, e, i, d, u, p) {
  const a = {};
  for (let s = 0; s < t.children.length; s++) {
    const n = t.children[s], f = n.getAttribute("data-ln-render-key");
    f && (a[f] = n);
  }
  const l = document.createDocumentFragment();
  for (let s = 0; s < e.length; s++) {
    const n = e[s], f = String(d(n));
    let m = a[f];
    if (m)
      u(m, n, s);
    else {
      const r = ae(i, p);
      if (!r || (Zt(r, n), m = r.firstElementChild, !m)) continue;
      m.setAttribute("data-ln-render-key", f), u(m, n, s);
    }
    l.appendChild(m);
  }
  t.textContent = "", t.appendChild(l);
}
function Ln(t, e) {
  const i = {}, d = t.querySelectorAll("[" + e + "]");
  for (let u = 0; u < d.length; u++)
    i[d[u].getAttribute(e)] = d[u].textContent, d[u].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Zt, window.lnCore.fill = ft, window.lnCore.lnFill = ji, window.lnCore.renderList = Wi);
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
  const d = new Set(t || []), u = function(p, a) {
    const l = p.getAttribute(a);
    return l !== null && d.has(l) ? l : e;
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
  const p = d || "ln-component", a = t.type;
  if (a === "trigger" || a === "marker" || a === "string" || a === "list" || !a || e === "" && t.fallback !== void 0)
    return !0;
  const l = (s) => {
    u ? console.warn(s, u) : console.warn(s);
  };
  if (a === "boolean") {
    const s = e.trim().toLowerCase();
    return s !== "" && s !== "true" && s !== "false" && s !== "1" && s !== "0" ? (l(`[${p}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (a === "enum") {
    const s = t.values || [];
    return s.includes(e) ? !0 : (l(`[${p}] Invalid value "${e}" for attribute "${i}". Allowed: ${s.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (a === "integer") {
    if (!/^-?\d+$/.test(e))
      return l(`[${p}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const s = parseInt(e, 10);
    return t.min !== void 0 && s < t.min ? (l(`[${p}] Value ${s} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && s > t.max ? (l(`[${p}] Value ${s} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (a === "float")
    return isNaN(Number(e)) ? (l(`[${p}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (a === "json")
    try {
      return JSON.parse(e), !0;
    } catch (s) {
      return l(`[${p}] Invalid JSON for attribute "${i}": ${s.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function X(t, e, i) {
  for (const d in i) {
    const [u, p, a] = i[d];
    Object.defineProperty(t, d, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return u(e, p, a);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function Y(t) {
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
function Vi(t) {
  const e = {};
  for (const i in t) {
    const d = t[i];
    d && d.effect && (e[i] = d.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Gi(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = X, window.lnCore.attrSpec = Y, window.lnCore.attrStr = K, window.lnCore.attrInt = xt, window.lnCore.attrBool = It, window.lnCore.attrList = Fe, window.lnCore.attrEnum = xn, window.lnCore.attrFloat = In, window.lnCore.attrJson = qn);
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
  const p = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", a = { selector: e, attribute: i, ComponentFn: d };
  if (t.matches && t.matches(p) && $t(t, a), t.querySelectorAll) {
    const l = t.querySelectorAll(p);
    for (let s = 0; s < l.length; s++)
      $t(l[s], a);
  }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function $i() {
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
      u.some((p) => p.componentTag === t.componentTag) || u.push({
        spec: t.attributes[d],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const d = Gi(t);
    if (d === null)
      e.reactiveWildcard.push(t);
    else
      for (const u of d)
        e.byReactive.has(u) || e.byReactive.set(u, []), e.byReactive.get(u).push(t);
  }
  t.persist && e.persist.push(t);
}
function Xe(t, e, i, d) {
  for (let u = 0; u < t.length; u++) {
    const p = t[u];
    if (!e[p.attribute]) continue;
    const a = p.effects && p.effects[i];
    a ? a(e, i, d) : p.onAttrChange && (!p.declared || p.declared.has(i)) && p.onAttrChange(e, i, d);
  }
}
function Qi(t) {
  const e = t.attributeName, i = e.indexOf("data-ln-") === 0, d = Nn(), u = d.byAttr.get(e), p = vn() && d.byDeclaredAttr && d.byDeclaredAttr.has(e);
  if (!i && !u && !p)
    return;
  const a = t.target;
  if (t.oldValue !== a.getAttribute(e)) {
    if (p && qe(a)) {
      const l = d.byDeclaredAttr.get(e), s = a.getAttribute(e);
      for (let n = 0; n < l.length; n++)
        Dn(l[n].spec, s, e, l[n].componentTag, a);
    }
    if (window.lnCore._debugSink && (i || u) && window.lnCore._debugSink("attr", e, a, { oldValue: t.oldValue, newValue: a.getAttribute(e) }), i) {
      const l = d.byReactive.get(e);
      l && Xe(l, a, e, t.oldValue), d.reactiveWildcard.length && Xe(d.reactiveWildcard, a, e, t.oldValue);
    }
    if (u)
      for (let l = 0; l < u.length; l++) {
        const s = u[l];
        if (s.handler) {
          s.handler(a, e, t.oldValue);
          continue;
        }
        s.onAttributeChange && a[s.attribute] ? s.onAttributeChange(a, e) : (Rn(a, s.selector, s.attribute, s.ComponentFn), s.onInit && s.onInit(a));
      }
  }
}
function Fn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ct(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        try {
          Qi(e[i]);
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
function Xi(t) {
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
      const p = d[u], a = p.query, l = t.target.nodeType === 1 ? t.target.matches && t.target.matches(a) ? t.target : t.target.closest ? t.target.closest(a) : null : t.target.parentElement && t.target.parentElement.closest ? t.target.parentElement.closest(a) : null;
      l && p.onSubtreeChange(l, t);
    }
  for (let u = 0; u < t.addedNodes.length; u++) {
    const p = t.addedNodes[u];
    if (p.nodeType === 1) {
      const a = !!(p.firstElementChild || p.children && p.children.length);
      for (let l = 0; l < e.length; l++) {
        const s = e[l];
        if (s.selector && s.attribute && s.ComponentFn) {
          if (!a)
            p.matches && p.matches(s.query) && $t(p, s);
          else if (p.matches && p.matches(s.query) && $t(p, s), p.querySelectorAll) {
            const n = p.querySelectorAll(s.query);
            for (let f = 0; f < n.length; f++)
              $t(n[f], s);
          }
        }
        s.onInit && s.onInit(p);
      }
    }
  }
  for (let u = 0; u < t.removedNodes.length; u++) {
    const p = t.removedNodes[u];
    if (p.nodeType === 1) {
      const a = !!(p.firstElementChild || p.children && p.children.length);
      for (let l = 0; l < e.length; l++) {
        const s = e[l], n = s.query;
        if (n) {
          if (!a)
            p.matches && p.matches(n) && ge(p, s);
          else if (p.matches && p.matches(n) && ge(p, s), p.querySelectorAll) {
            const f = p.querySelectorAll(n);
            for (let m = 0; m < f.length; m++)
              ge(f[m], s);
          }
        }
      }
    }
  }
}
function Bn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ct(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const d = e[i];
        if (d.type === "childList")
          try {
            Xi(d);
          } catch (u) {
            console.error("[ln-core] lifecycle handler failed", d.target, u);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Nt(t, e) {
  Mn({ observed: t, handler: e }), Fn();
}
function te(t) {
  Be().push(t), t.onSubtreeChange && t.query && Pe().push(t), Bn();
}
function H(t, e, i, d, u = {}) {
  const p = u.extraAttributes || [], a = u.onAttributeChange || null, l = u.onSubtreeChange || null, s = u.onInit || null, n = u.onAttrChange || null, f = u.effects || null, m = u.attributes || null, r = m ? Vi(m) : f, v = m ? new Set(Object.keys(m)) : null, w = u.persist || null;
  function h(y) {
    const E = y || document.body;
    if (Rn(E, t, e, i), m && vn())
      for (const A in m) {
        const S = m[A], C = Array.from(E.querySelectorAll("[" + A + "]"));
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
    const y = /\[([\w-]+)/g;
    let E;
    for (; (E = y.exec(t)) !== null; )
      b.push(E[1]);
  } else
    b.push(t);
  Mn({
    selector: t,
    attribute: e,
    componentTag: d,
    attributes: m,
    ComponentFn: i,
    onInit: s,
    observed: b.concat(p),
    onAttributeChange: a,
    onAttrChange: n,
    effects: r,
    declared: v,
    persist: w
  }), Fn();
  const o = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1, g = u.subtreeQuery || (o ? t : "[" + t + "]"), _ = {
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: s,
    onSubtreeChange: l,
    query: g
  };
  Be().push(_), l && g && Pe().push(_), Bn(), window[e] = h, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = H, window.lnCore.observeLifecycle = te);
  function c() {
    On() > 0 ? mt(function() {
      h(document.body);
    }) : h(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c(), h;
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
    const a = parseFloat(t), l = parseFloat(e);
    return (isNaN(a) ? 0 : a) - (isNaN(l) ? 0 : l);
  }
  const u = t != null ? String(t) : "", p = e != null ? String(e) : "";
  return d ? d.compare(u, p) : u < p ? -1 : u > p ? 1 : 0;
}
function Ht(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function Pn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.threshold != null ? t.threshold : 25, u = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, a = typeof t.onChange == "function" ? t.onChange : function() {
  }, l = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let f = 0, m = 0, r = 0, v = { sort: null, filters: {}, search: "" }, w = null, h = 0, b = 0, o = !1;
  function g(E) {
    s.set(E, ++h);
  }
  function _() {
    return !!(v && (v.search || v.filters && Object.keys(v.filters).length));
  }
  function c() {
    if (l.size <= e) return;
    const E = Array.from(l.keys()).sort(function(S, C) {
      return (s.get(S) || 0) - (s.get(C) || 0);
    });
    let A = 0;
    for (; l.size > e && A < E.length; )
      l.delete(E[A]), s.delete(E[A]), A++;
  }
  function y(E, A) {
    n.add(E), p(v, E, A);
  }
  return {
    get: function(E) {
      return l.get(E);
    },
    has: function(E) {
      return l.has(E);
    },
    peek: function() {
      return l.size ? l.values().next().value : void 0;
    },
    get logicalTotal() {
      return f;
    },
    get grandTotal() {
      return m;
    },
    get queryGen() {
      return r;
    },
    get size() {
      return l.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(E, A) {
      clearTimeout(w), b = E;
      for (let D = E; D < A; D++)
        l.has(D) && g(D);
      if (f <= 0) return;
      const S = Math.max(0, E - d), C = Math.min(f, A + d), L = Math.floor(S / i), I = Math.floor(Math.max(0, C - 1) / i);
      let q = -1;
      for (let D = L; D <= I; D++) {
        const O = D * i, F = Math.min(i, f - O);
        let U = !1;
        const j = Math.max(O, S), G = Math.min(O + F, C);
        for (let tt = j; tt < G; tt++)
          if (!l.has(tt)) {
            U = !0;
            break;
          }
        if (U && !n.has(O)) {
          q = O;
          break;
        }
      }
      q !== -1 && (w = setTimeout(function() {
        y(q, i);
      }, u));
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
      o && (l.clear(), s.clear(), o = !1), E.provisional || (m = E.total != null ? E.total : m, f = E.filtered != null ? E.filtered : E.data ? E.data.length : f);
      for (let L = 0; L < S.length; L++)
        S[L] != null && (l.set(A + L, S[L]), g(A + L));
      return n.delete(A), c(), a(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(E) {
      E && (v = E), y(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(E) {
      r++, n.clear(), clearTimeout(w), E && (v = E), o = !0, y(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      r++, n.clear(), clearTimeout(w), o = !0;
      const E = Math.max(0, Math.floor(b / i) * i);
      y(E, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(E) {
      n.delete(E);
    },
    destroy: function() {
      clearTimeout(w), l.clear(), s.clear(), n.clear();
    },
    configure: function(E) {
      E = E || {};
      let A = !1;
      if (E.windowSize != null && E.windowSize > 0 && E.windowSize !== e) {
        const S = E.windowSize < e;
        e = E.windowSize, S && c(), A = !0;
      }
      E.pageSize != null && E.pageSize > 0 && (i = E.pageSize), E.threshold != null && E.threshold >= 0 && (d = E.threshold), E.fetchDebounce != null && E.fetchDebounce >= 0 && (u = E.fetchDebounce), A && a();
    },
    setGrandTotal: function(E) {
      E == null || isNaN(E) || E < 0 || (m = E, _() || (f = E), a());
    }
  };
}
function Hn(t) {
  return (t || "").replace(/^#/, "");
}
function Yt(t) {
  const e = t === void 0 ? location.hash : t, i = {}, d = Hn(e);
  if (!d) return i;
  const u = d.split("&");
  for (let p = 0; p < u.length; p++) {
    const a = u[p];
    if (!a) continue;
    const l = a.indexOf(":"), s = l > -1 ? a.slice(0, l) : a, n = l > -1 ? a.slice(l + 1) : "";
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
  const e = Yt();
  return t in e ? e[t] : null;
}
function gt(t, e) {
  if (!t) return;
  const i = Yt();
  e == null ? delete i[t] : i[t] = String(e);
  const u = Object.keys(i).map(function(p) {
    const a = i[p];
    return a === "" ? p : p + ":" + encodeURIComponent(a);
  }).join("&");
  Hn(location.hash) !== u && (location.hash = u);
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
function Un(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function Ee(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function zn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function Ae(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), d = t.slice(e + 1), u = d ? d.split(",").map(function(p) {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).filter(Boolean) : [];
  return { key: i, values: u };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Yt, window.lnCore.hashGet = st, window.lnCore.hashSet = gt, window.lnCore.hashLinkClick = ze, window.lnCore.resolveHashNamespace = St, window.lnCore.hashSortEncode = Un, window.lnCore.hashSortDecode = Ee, window.lnCore.hashFilterEncode = zn, window.lnCore.hashFilterDecode = Ae);
function le(t, e, i, d) {
  const u = typeof d == "number" ? d : 4, p = window.innerWidth, a = window.innerHeight, l = e.width, s = e.height, n = (i || "bottom").split("-"), f = n[0], m = n[1] === "start" || n[1] === "end" ? n[1] : "center", r = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, v = r[f] || r.bottom;
  function w(_) {
    return _ === "top" || _ === "bottom" ? m === "start" ? t.left : m === "end" ? t.right - l : t.left + (t.width - l) / 2 : m === "start" ? t.top : m === "end" ? t.bottom - s : t.top + (t.height - s) / 2;
  }
  function h(_) {
    let c, y, E = !0;
    return _ === "top" ? (c = t.top - u - s, y = w(_), c < 0 && (E = !1)) : _ === "bottom" ? (c = t.bottom + u, y = w(_), c + s > a && (E = !1)) : _ === "left" ? (c = w(_), y = t.left - u - l, y < 0 && (E = !1)) : (c = w(_), y = t.right + u, y + l > p && (E = !1)), { top: c, left: y, side: _, fits: E };
  }
  let b = null;
  for (let _ = 0; _ < v.length; _++) {
    const c = h(v[_]);
    if (c.fits) {
      b = c;
      break;
    }
  }
  b || (b = h(v[0]));
  let o = b.top, g = b.left;
  return l >= p ? g = 0 : (g < 0 && (g = 0), g + l > p && (g = p - l)), s >= a ? o = 0 : (o < 0 && (o = 0), o + s > a && (o = a - s)), { top: o, left: g, placement: b.side };
}
function Se(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, d = e.display, u = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const p = t.offsetWidth, a = t.offsetHeight;
  return e.visibility = i, e.display = d, e.position = u, { width: p, height: a };
}
let Qt = null;
const Yi = "ln-ashlar:storage-salt:v1", Ye = 32768;
function Je(t) {
  let e = "";
  const i = t.byteLength;
  for (let d = 0; d < i; d += Ye)
    e += String.fromCharCode.apply(
      null,
      t.subarray(d, Math.min(d + Ye, i))
    );
  return btoa(e);
}
function Ze(t) {
  const e = atob(t), i = e.length, d = new Uint8Array(i);
  for (let u = 0; u < i; u++)
    d[u] = e.charCodeAt(u);
  return d;
}
function Kn(t, e) {
  let i = Qt, d = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (d = t, typeof CryptoKey < "u" && d.key instanceof CryptoKey && (i = d.key)), { key: i, options: d };
}
async function Ji(t, e = {}) {
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
  const u = e.salt || Yi, p = typeof u == "string" ? d.encode(u) : u, a = e.iterations || 1e5, l = await crypto.subtle.importKey(
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
      iterations: a,
      hash: "SHA-256"
    },
    l,
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
    Qt = await Ji(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Qt = null, i;
  }
}
function Tt() {
  return Qt;
}
async function Zi(t, e, i) {
  const { key: d } = Kn(e);
  if (t == null)
    return t;
  if (!d)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const u = new TextEncoder(), p = crypto.getRandomValues(new Uint8Array(12)), a = typeof t == "string" ? t : JSON.stringify(t), l = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      d,
      u.encode(a)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Je(p),
      data: Je(new Uint8Array(l))
    };
  } catch (u) {
    throw console.error("[ln-core/crypto] Encryption failed:", u), new Error("[ln-crypto] Encryption failed: " + (u && u.message ? u.message : String(u)));
  }
}
async function tr(t, e, i) {
  const { key: d, options: u } = Kn(e), p = u.silent === !0;
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
    const a = new TextDecoder(), l = Ze(t.iv), s = Ze(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: l },
      d,
      s
    ), f = a.decode(n);
    try {
      return JSON.parse(f);
    } catch {
      return f;
    }
  } catch (a) {
    if (p)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", a), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (a && a.message ? a.message : String(a)));
  }
}
function wt() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const e = Math.random() * 16 | 0;
    return (t === "x" ? e : e & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = wt);
function jn(t, e = 100, i = 0) {
  const d = parseFloat(String(t)) || 0, u = parseFloat(String(e)) || 100, p = parseFloat(String(i)) || 0, a = Math.max(p, Math.min(d, u)), l = u - p;
  let s = 0;
  return l > 0 && (s = (a - p) / l * 100), s = Math.max(0, Math.min(100, s)), {
    value: d,
    min: p,
    max: u,
    clampedValue: a,
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
      const p = +d[1], a = +d[2], l = +d[3], s = new Date(p, a - 1, l);
      return s.getFullYear() !== p || s.getMonth() !== a - 1 || s.getDate() !== l ? null : s;
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
    let u = "", p = ".";
    for (let a = 0; a < d.length; a++)
      d[a].type === "group" && (u = d[a].value), d[a].type === "decimal" && (p = d[a].value);
    Et[e] = { groupSep: u, decimalSep: p, fmt: i };
  }
  return Et[e];
}
function Wn(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let d = t.trim();
  return d === "" ? "" : (d = d.replace(/[$€£¥]/g, ""), e && (d = d.split(e).join("")), d = d.replace(/\s/g, ""), i && i !== "." && (d = d.replace(i, ".")), d = d.replace(/[^\d.-]/g, ""), d);
}
function er(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const d = ce(e), u = Wn(i, d.groupSep, d.decimalSep);
  if (u === "" || u === "-") return NaN;
  const p = parseFloat(u);
  return isNaN(p) ? NaN : p;
}
function rt(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const d = e || "default", u = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, p = i.userDecimals != null ? i.userDecimals : null;
  if (u !== null) {
    const a = d + "|max:" + u;
    return Et[a] || (Et[a] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: u
    })), Et[a].format(t);
  }
  if (p !== null && p > 0) {
    const a = d + "|exact:" + p;
    return Et[a] || (Et[a] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: p,
      maximumFractionDigits: p
    })), Et[a].format(t);
  }
  return ce(e).fmt.format(t);
}
function se(t) {
  return String(t || "").trim().toLowerCase();
}
function Vn(t) {
  const e = se(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function nr(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Gn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let d = 0; d < e.length; d++)
    if (i.indexOf(e[d]) === -1) return !1;
  return !0;
}
function ir(t) {
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
function rr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function or(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function sr(t, e) {
  return (e || "GET") + " " + (t || "");
}
function ar(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function d(a, l) {
    l = l || {};
    const s = rr(a), n = or(a, l), f = sr(s, n);
    ar(n) && e.has(f) && (e.get(f).abort(), e.delete(f));
    const m = new AbortController(), r = l.signal;
    let v = null;
    r && (r.aborted ? m.abort(r.reason) : (v = function() {
      m.abort(r.reason);
    }, r.addEventListener("abort", v, { once: !0 })));
    const w = Object.assign({}, l, { signal: m.signal });
    return e.set(f, m), t(a, w).finally(function() {
      r && v && r.removeEventListener("abort", v), e.get(f) === m && e.delete(f);
    });
  }
  d.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = d;
  function u(a) {
    if (!a.detail || !a.detail.url) return;
    const l = a.target, s = (a.detail.method || (a.detail.body ? "POST" : "GET")).toUpperCase(), n = a.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const f = new AbortController(), m = a.detail.signal;
    let r = null;
    m && (m.aborted ? f.abort(m.reason) : (r = function() {
      f.abort(m.reason);
    }, m.addEventListener("abort", r, { once: !0 }))), n && i.set(n, f);
    const v = { method: s, signal: f.signal };
    a.detail.body !== void 0 && (v.body = a.detail.body), window.fetch(a.detail.url, v).then(function(w) {
      m && r && m.removeEventListener("abort", r), n && i.get(n) === f && i.delete(n), k(l, "ln-http:response", {
        ok: w.ok,
        status: w.status,
        response: w
      });
    }).catch(function(w) {
      m && r && m.removeEventListener("abort", r), n && i.get(n) === f && i.delete(n), !(w && w.name === "AbortError") && k(l, "ln-http:error", {
        ok: !1,
        status: 0,
        error: w
      });
    });
  }
  function p(a) {
    const l = a.detail || {};
    l.all ? window.lnHttp.cancelAll() : l.key ? window.lnHttp.cancelByKey(l.key) : l.url && window.lnHttp.cancel(l.url);
  }
  document.addEventListener("ln-http:request", u), document.addEventListener("ln-http:cancel", p), window.lnHttp = {
    cancel: function(a) {
      let l = !1;
      return e.forEach(function(s, n) {
        n.endsWith(" " + a) && (s.abort(), e.delete(n), l = !0);
      }), l;
    },
    cancelByKey: function(a) {
      return i.has(a) ? (i.get(a).abort(), i.delete(a), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(a) {
        a.abort();
      }), e.clear(), i.forEach(function(a) {
        a.abort();
      }), i.clear();
    },
    get inflight() {
      const a = [];
      return e.forEach(function(l, s) {
        const n = s.indexOf(" ");
        a.push({ method: s.slice(0, n), url: s.slice(n + 1) });
      }), i.forEach(function(l, s) {
        a.push({ key: s });
      }), a;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", u), document.removeEventListener("ln-http:cancel", p), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: K, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, d = Y(i), u = /* @__PURE__ */ new Map();
  function p(a) {
    if (this.dom = a, X(this, a, d), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    $i(), this._held = !0;
    const l = this, s = this.url;
    let n = u.get(s);
    return n || (n = fetch(s).then(function(f) {
      if (!f.ok)
        throw new Error("HTTP error! status: " + f.status);
      return f.text();
    }).catch(function(f) {
      throw u.delete(s), f;
    }), u.set(s, n)), n.then(function(f) {
      if (l._destroyed) return;
      const m = document.createElement("template");
      m.innerHTML = f, l.dom.content.appendChild(m.content), k(l.dom, "ln-include:loaded", { target: l.dom, url: l.url }), l._held && (l._held = !1, me());
    }).catch(function(f) {
      l._destroyed || (console.error("[ln-include] Failed to fetch template from " + l.url + ":", f), k(l.dom, "ln-include:error", { target: l.dom, url: l.url, error: f }), l._held && (l._held = !1, me()));
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
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: K, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, d = Y(i);
  function u(p) {
    this.dom = p, X(this, p, d), this._baseAction = p.getAttribute("action") || "";
    const a = this;
    function l() {
      const n = a.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let f = 0; f < n.length; f++)
        n[f].hasAttribute("data-ln-initial-value") || n[f].setAttribute("data-ln-initial-value", n[f].getAttribute("value") || "");
    }
    function s() {
      const n = a.dom.querySelectorAll('input[type="hidden"]:not([name="_method"])');
      for (let f = 0; f < n.length; f++)
        n[f].value = n[f].getAttribute("data-ln-initial-value") || "";
    }
    return l(), this._onLnFill = function(n) {
      n.target === a.dom && (n.detail ? (l(), a.fill(n.detail), a._applyActionMode(n.detail)) : (a.dom.reset(), s()));
    }, this._onReset = function() {
      a._applyActionMode(null), s();
    }, p.addEventListener("ln-fill", this._onLnFill), p.addEventListener("reset", this._onReset), this;
  }
  u.prototype.fill = function(p) {
    const a = Ne(this.dom, p);
    for (let l = 0; l < a.length; l++) {
      const s = a[l], n = s.tagName === "SELECT" || s.type === "checkbox" || s.type === "radio";
      s.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, u.prototype.reset = function() {
    this.dom.reset(), this._applyActionMode(null);
    const p = this.dom.elements;
    for (let a = 0; a < p.length; a++) {
      const l = p[a], s = l.tagName === "SELECT" || l.type === "checkbox" || l.type === "radio";
      l.dispatchEvent(new Event(s ? "change" : "input", { bubbles: !0 }));
    }
  }, u.prototype._ensureMethodInput = function() {
    let p = this.dom.querySelector('input[name="_method"]');
    return p || (p = document.createElement("input"), p.type = "hidden", p.name = "_method", p.value = "", this.dom.appendChild(p)), p;
  }, u.prototype._applyActionMode = function(p) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const a = p && p.id != null && p.id !== "" ? p.id : null, l = this._ensureMethodInput();
    if (a !== null) {
      const s = this._actionEdit;
      s ? this.dom.setAttribute("action", s.replace(":id", encodeURIComponent(a))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(a)), l.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), l.value = "";
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
function lr(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function cr(t, e) {
  const i = [];
  if (t) {
    const d = Object.keys(en);
    for (let u = 0; u < d.length; u++) {
      const p = d[u], a = en[p];
      t[a] && i.push(p);
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
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", d = "data-ln-validate-error", u = "ln-validate-valid", p = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function l(s) {
    this.dom = s, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, f = s.tagName, m = s.type, r = f === "SELECT" || m === "checkbox" || m === "radio";
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
        const o = b.querySelector("[" + d + '="' + h + '"]');
        o && o.classList.remove("hidden");
      }
      s.classList.remove(u), s.classList.add(p), s.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(w) {
      const h = w.detail && w.detail.error, b = s.closest(".form-element");
      if (h) {
        if (n._customErrors.delete(h), b) {
          const o = b.querySelector("[" + d + '="' + h + '"]');
          o && o.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(o) {
          if (b) {
            const g = b.querySelector("[" + d + '="' + o + '"]');
            g && g.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, r || s.addEventListener("input", this._onInput), s.addEventListener("change", this._onChange), s.addEventListener("ln-validate:set-custom", this._onSetCustom), s.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const v = s.form;
    return v && (v.hasAttribute("novalidate") || v.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(w) {
      n._touched = !0, !n.validate() && w.detail && w.detail.invalidFields && w.detail.invalidFields.push(n.dom);
    }, v.addEventListener("reset", this._onFormReset), v.addEventListener("ln-validate:request-validate", this._onValidateRequest), v._lnValidateGateBound || (v._lnValidateGateBound = !0, v.addEventListener("submit", function(w) {
      const h = { invalidFields: [] };
      k(v, "ln-validate:request-validate", h), h.invalidFields.length > 0 && (w.preventDefault(), h.invalidFields.sort((b, o) => b.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), h.invalidFields[0].focus());
    }))), lr(s) && (this._touched = !0, this.validate()), this;
  }
  l.prototype.validate = function() {
    const s = this.dom, n = s.validity, f = nn(n, this._customErrors.size), m = cr(n, this._customErrors), r = s.closest(".form-element");
    if (r) {
      const h = r.querySelector("[" + i + "]");
      if (h) {
        const b = h.querySelectorAll("[" + d + "]");
        for (let o = 0; o < b.length; o++) {
          const g = b[o].getAttribute(d), _ = !m.includes(g);
          b[o].classList.contains("hidden") !== _ && b[o].classList.toggle("hidden", _);
        }
      }
    }
    s.classList.contains(u) !== f && s.classList.toggle(u, f), s.classList.contains(p) === f && s.classList.toggle(p, !f);
    const v = f ? "false" : "true";
    return s.getAttribute("aria-invalid") !== v && s.setAttribute("aria-invalid", v), k(s, f ? "ln-validate:valid" : "ln-validate:invalid", { target: s, field: s.name, errors: m }), f;
  }, l.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.contains(u) && this.dom.classList.remove(u), this.dom.classList.contains(p) && this.dom.classList.remove(p), this.dom.hasAttribute("aria-invalid") && this.dom.removeAttribute("aria-invalid");
    const s = this.dom.closest(".form-element");
    if (s) {
      const n = s.querySelectorAll("[" + d + "]");
      for (let f = 0; f < n.length; f++)
        n[f].classList.contains("hidden") || n[f].classList.add("hidden");
    }
  }, Object.defineProperty(l.prototype, "isValid", {
    get: function() {
      return nn(this.dom.validity, this._customErrors.size);
    }
  }), l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const s = this.dom.form;
    s && (this._onFormReset && s.removeEventListener("reset", this._onFormReset), this._onValidateRequest && s.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(u, p), this.dom.removeAttribute("aria-invalid"), delete this.dom[e];
  }, H(t, e, l, "ln-validate", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let d = null;
  function u(r) {
    if (!r.hasAttribute(t) || r[e]) return;
    r[e] = !0;
    const v = n(r);
    p(v.links), a(v.forms);
  }
  function p(r) {
    for (const v of r) {
      if (v[e + "Trigger"] || v.hostname && v.hostname !== window.location.hostname) continue;
      const w = v.getAttribute("href");
      if (w && w.includes("#")) continue;
      const h = function(b) {
        if (!En(b, v)) return;
        b.preventDefault();
        const o = v.getAttribute("href");
        o && s("GET", o, null, v);
      };
      v.addEventListener("click", h), v[e + "Trigger"] = h;
    }
  }
  function a(r) {
    for (const v of r) {
      if (v[e + "Trigger"]) continue;
      if (v.hasAttribute(i)) {
        v[e + "ScopeWarned"] || (v[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(h) {
        if (h.defaultPrevented) return;
        h.preventDefault();
        const b = v.method.toUpperCase(), o = v.action, g = new FormData(v);
        for (const _ of v.querySelectorAll('button, input[type="submit"]'))
          _.disabled = !0;
        s(b, o, g, v, function() {
          for (const _ of v.querySelectorAll('button, input[type="submit"]'))
            _.disabled = !1;
        });
      };
      v.addEventListener("submit", w), v[e + "Trigger"] = w;
    }
  }
  function l(r) {
    if (!r[e]) return;
    const v = n(r);
    for (const w of v.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of v.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete r[e];
  }
  function s(r, v, w, h, b) {
    if (Q(h, "ln-ajax:before-start", { method: r, url: v }).defaultPrevented) return;
    r === "GET" && d && d(), k(h, "ln-ajax:start", { method: r, url: v }), h.classList.add("ln-ajax--loading");
    const g = document.createElement("span");
    g.className = "ln-ajax-spinner", h.appendChild(g);
    function _() {
      h.classList.remove("ln-ajax--loading");
      const C = h.querySelector(".ln-ajax-spinner");
      C && C.remove(), b && b();
    }
    let c = v;
    const y = document.querySelector('meta[name="csrf-token"]'), E = y ? y.getAttribute("content") : null;
    w instanceof FormData && E && w.append("_token", E);
    const A = {
      method: r,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (E && (A.headers["X-CSRF-TOKEN"] = E), r === "GET" && w) {
      const C = new URLSearchParams(w);
      c = v + (v.includes("?") ? "&" : "?") + C.toString();
    } else r !== "GET" && w && (A.body = w);
    let S = null;
    if (r === "GET") {
      const C = new AbortController();
      A.signal = C.signal, S = function() {
        d = null, C.abort(), _(), k(h, "ln-ajax:aborted", { method: r, url: c });
      }, d = S;
    }
    fetch(c, A).then(function(C) {
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
        } else h.tagName === "FORM" && h.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", c);
        k(h, "ln-ajax:success", { method: r, url: c, data: I });
      } else
        k(h, "ln-ajax:error", {
          method: r,
          url: c,
          status: L,
          data: I,
          error: q || null
        });
      _(), k(h, "ln-ajax:complete", { method: r, url: c });
    }).catch(function(C) {
      C && C.name === "AbortError" || (S && d === S && (d = null), k(h, "ln-ajax:error", { method: r, url: c, status: 0, data: null, error: C }), _(), k(h, "ln-ajax:complete", { method: r, url: c }));
    });
  }
  function n(r) {
    const v = { links: [], forms: [] };
    return r.tagName === "A" && r.getAttribute(t) !== "false" ? v.links.push(r) : r.tagName === "FORM" && r.getAttribute(t) !== "false" ? v.forms.push(r) : (v.links = Array.from(r.querySelectorAll('a:not([data-ln-ajax="false"])')), v.forms = Array.from(r.querySelectorAll('form:not([data-ln-ajax="false"])'))), v;
  }
  function f() {
    ct(function() {
      te({
        onInit: function(r) {
          if (u(r), !r.hasAttribute(t)) {
            for (const w of r.querySelectorAll("[" + t + "]"))
              u(w);
            const v = r.closest && r.closest("[" + t + "]");
            if (v && v.getAttribute(t) !== "false") {
              const w = n(r);
              p(w.links), a(w.forms);
            }
          }
        }
      }), Nt([t], function(r) {
        u(r);
      });
    }, "ln-ajax");
  }
  function m() {
    for (const r of document.querySelectorAll("[" + t + "]"))
      u(r);
  }
  window[e] = u, window[e].destroy = l, f(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", m) : m();
})();
function dr(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: d = null } = {}) {
  const u = i ? !d : !t.some((n) => n.match), p = [], a = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const f = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !f && n.targetEl && p.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || a.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  a.sort((n, f) => n.regionKey === "__primary__" ? -1 : f.regionKey === "__primary__" ? 1 : 0);
  const s = a.find((n) => n.regionKey === "__primary__") || a[0] || null;
  return { notFound: u, clears: p, swaps: a, owner: s };
}
function Xt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function ur(t, e) {
  const i = Xt(e);
  if (!i) return t && t.replace(/\/+$/, "") || "/";
  const d = (t || "/").replace(/\/+$/, "") || "/";
  return d === i ? "/" : d.startsWith(i + "/") ? d.slice(i.length).replace(/\/+$/, "") || "/" : d;
}
function $n(t, e) {
  const i = Xt(e);
  if (!i) return t || "/";
  const d = t || "/", u = d.indexOf("#"), p = u !== -1 ? d.slice(0, u) : d, a = u !== -1 ? d.slice(u) : "", l = p.indexOf("?"), s = l !== -1 ? p.slice(0, l) : p, n = l !== -1 ? p.slice(l) : "";
  let f;
  if (s === i)
    f = i + "/";
  else if (s.startsWith(i + "/"))
    f = s;
  else {
    const m = s.startsWith("/") ? s : "/" + s;
    f = m === "/" ? i + "/" : i + m;
  }
  return f + n + a;
}
function Ce() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return Xt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const i = new URL(e.getAttribute("href"), window.location.origin);
      return Xt(i.pathname);
    } catch {
      return Xt(e.getAttribute("href"));
    }
  return "";
}
const Qn = {
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
    return $n(t, Ce());
  },
  current: function() {
    return de === null ? null : {
      path: de,
      fullPath: Jn,
      base: Zn,
      params: ti,
      query: ei,
      route: ni,
      regions: Yn
    };
  }
}, je = "data-ln-route", Xn = "lnRoute";
typeof window < "u" && (window.lnRouter = Qn);
function _e(t) {
  ai(t), si(t), _t.size > 0 && oi();
}
const fr = {
  "data-ln-route": { effect: _e, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: _e, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: _e, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, _t = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new WeakMap();
let Yn = /* @__PURE__ */ new Map(), rn = !1, de = null, Jn = null, Zn = "", ti = {}, ei = {}, ni = null, Te = !1;
function on(t, e, i) {
  Te ? queueMicrotask(function() {
    k(t, e, i);
  }) : k(t, e, i);
}
function We(t) {
  try {
    const l = new URL(t, window.location.origin);
    t = l.pathname + l.search + l.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, d] = e.split("?");
  const u = {};
  if (d) {
    const l = new URLSearchParams(d);
    for (const [s, n] of l.entries())
      u[s] = n;
  }
  const p = Ce();
  return { path: ur(i, p), query: u, base: p };
}
function ii(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, d = e.segments, u = Math.max(i.length, d.length);
  for (let p = 0; p < u; p++) {
    const a = i[p], l = d[p];
    if (a === void 0) return 1;
    if (l === void 0) return -1;
    if (a === "*") return 1;
    if (l === "*") return -1;
    const s = a.startsWith(":"), n = l.startsWith(":");
    if (s && !n) return 1;
    if (!s && n) return -1;
  }
  return 0;
}
function ri(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const d of e) {
    if (d.pattern === "*")
      return {
        route: d,
        params: { wildcard: t }
      };
    const u = d.segments, p = {};
    let a = !0;
    if (!(i.length > u.length && u[u.length - 1] !== "*")) {
      for (let l = 0; l < u.length; l++) {
        const s = u[l], n = i[l];
        if (s === "*") {
          p.wildcard = i.slice(l).join("/");
          break;
        }
        if (n === void 0) {
          a = !1;
          break;
        }
        if (s.startsWith(":"))
          p[s.slice(1)] = decodeURIComponent(n);
        else if (s !== n) {
          a = !1;
          break;
        }
      }
      if (a && (u.indexOf("*") !== -1 || i.length <= u.length))
        return { route: d, params: p };
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
    for (const p of Object.keys(u))
      if (p.startsWith("ln") && u[p] && typeof u[p].destroy == "function")
        try {
          u[p].destroy();
        } catch (a) {
          console.error(`[ln-router] Error destroying component ${p} on element:`, u, a);
        }
  const d = document.querySelectorAll('[data-ln-popover="open"]');
  for (const u of d) {
    const p = u.lnPopover;
    if (p && p.trigger && t.contains(p.trigger))
      try {
        p.destroy();
      } catch (a) {
        console.error("[ln-router] Error destroying open popover:", a);
      }
  }
}
function Jt(t, e = {}) {
  const { path: i, query: d, base: u } = We(t), p = $n(t, u), a = /* @__PURE__ */ new Map();
  for (const [w, h] of _t)
    a.set(w, ri(i, h.sorted));
  const l = a.get("__primary__") || null, s = ke("__primary__", { warn: !!l }), n = _t.has("__primary__"), f = [];
  for (const [w, h] of a) {
    const b = w === "__primary__" ? s : ke(w, { warn: !1 }), o = !b && !!(l && l.route && l.route.templateNode && l.route.templateNode.content && l.route.templateNode.content.querySelector("#" + CSS.escape(w)));
    !b && !o && h && console.warn(`[ln-router] Explicit target element #${w} not found in DOM`), f.push({
      regionKey: w,
      match: h,
      targetEl: b,
      isPending: o,
      hasKeep: !!b && b.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!b && b.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!b && b.children.length > 0,
      mountedTemplate: b && be.get(b) || null
    });
  }
  const m = dr(f, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: l
  });
  if (m.notFound) {
    on(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Q(s || document.body, "ln-router:before-navigate", {
    from: de,
    to: p,
    path: i,
    params: l ? l.params : {},
    query: d
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", p) : e.historyAction === "replace" && window.history.replaceState(null, "", p);
  const v = function() {
    for (const w of m.clears)
      sn(w.targetEl), w.targetEl.replaceChildren(), be.delete(w.targetEl);
    for (const w of m.swaps) {
      if ((w.isPending || !w.targetEl || !document.contains(w.targetEl)) && (w.targetEl = w.regionKey === "__primary__" ? s : document.getElementById(w.regionKey)), !w.targetEl) {
        console.warn(`[ln-router] Target element #${w.regionKey} could not be resolved`);
        continue;
      }
      if (w.skipMount || (sn(w.targetEl), w.targetEl.replaceChildren(w.match.route.templateNode.content.cloneNode(!0))), be.set(w.targetEl, w.match.route.templateNode), m.owner && w.regionKey === m.owner.regionKey) {
        if (w.match.route.title) {
          let h = w.match.route.title;
          if (w.match.params)
            for (const [b, o] of Object.entries(w.match.params))
              h = h.replace(new RegExp("\\{\\{\\s*" + b + "\\s*\\}\\}", "g"), o);
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
        fullPath: p,
        base: u,
        params: w.match.params,
        query: d,
        route: w.match.route,
        target: w.targetEl,
        region: w.regionKey
      });
    }
    de = i, Jn = p, Zn = u, ei = d, ni = l ? l.route : null, ti = l ? l.params : {}, Yn = new Map(
      Array.from(a.entries()).map(([w, h]) => [w, h ? { route: h.route, params: h.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(v) : v();
}
function hr(t) {
  const e = t.target.closest("a");
  if (!e || !En(t, e)) return;
  const i = e.getAttribute("href"), { path: d } = We(i);
  for (const u of _t.values())
    if (ri(d, u.sorted)) {
      t.preventDefault(), Jt(i, { historyAction: "push" });
      return;
    }
}
function pr(t, e) {
  const i = Object.keys(t), d = Object.keys(e);
  if (i.length !== d.length) return !1;
  for (let u = 0; u < i.length; u++) {
    const p = i[u];
    if (t[p] !== e[p]) return !1;
  }
  return !0;
}
function mr() {
  const t = window.location.pathname + window.location.search, e = Qn.current();
  if (e && e.path != null) {
    const i = We(t);
    if (e.path === i.path && pr(e.query, i.query))
      return;
  }
  Jt(t, { historyAction: "skip" });
}
function oi() {
  rn || (rn = !0, ct(function() {
    document.addEventListener("click", hr), window.addEventListener("popstate", mr), Te = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Jt(t, { historyAction: "replace", isHydration: !0 }), Te = !1;
  }, "ln-router"));
}
function si(t) {
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
  const p = t.getAttribute("data-ln-route-title"), a = e.split("/").filter(Boolean), l = {
    pattern: e,
    segments: a,
    target: i,
    title: p,
    templateNode: t
  }, s = ke(d);
  s && s.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), u.routes.set(e, l), u.sorted = Array.from(u.routes.values()).sort(ii);
}
function ai(t) {
  const e = t.getAttribute(je);
  if (!e) return;
  const d = t.getAttribute("data-ln-route-target") || null || "__primary__", u = _t.get(d);
  u && (u.routes.delete(e), u.sorted = Array.from(u.routes.values()).sort(ii), u.routes.size === 0 && _t.delete(d));
}
function li(t) {
  return this.dom = t, si(t), this;
}
li.prototype.destroy = function() {
  ai(this.dom), delete this.dom[Xn];
};
H(je, Xn, li, "ln-router", {
  attributes: fr,
  onInit: function() {
    _t.size > 0 && oi();
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
  }, p = /* @__PURE__ */ new Set();
  let a = null;
  function l() {
    a || (a = function(m) {
      if (De(m)) return;
      const r = m.target.closest("[" + i + "]");
      if (!r || Re(r)) return;
      const v = r.getAttribute(i);
      if (!v) return;
      const w = document.getElementById(v);
      !w || !w[e] || (m.preventDefault(), r.hasAttribute("data-ln-modal-mode") ? w.setAttribute("data-ln-modal-mode", r.getAttribute("data-ln-modal-mode")) : w.hasAttribute("data-ln-modal-mode") && w.setAttribute("data-ln-modal-mode", "new"), w.setAttribute(t, "open"));
    }, document.addEventListener("click", a));
  }
  function s() {
    p.size > 0 || !a || (document.removeEventListener("click", a), a = null);
  }
  function n(m) {
    this.dom = m, this.isOpen = m.getAttribute(t) === "open";
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
      const w = v.target.closest("[" + d + "]");
      w && r.dom.contains(w) && (v.preventDefault(), r.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), p.add(this), l(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), k(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const m = this.dom.getAttribute(t);
    this.dom.setAttribute(t, m === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), p.delete(this), s(), this.isOpen) {
        const m = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(v) {
            return v !== m;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function f(m) {
    const r = m[e];
    if (!r) return;
    const v = !!r._isNativeClosing;
    r._isNativeClosing = !1;
    const h = m.getAttribute(t) === "open";
    if (h === r.isOpen) {
      h && m.isConnected && !m.open && typeof m.showModal == "function" && m.showModal();
      return;
    }
    if (h) {
      if (Q(m, "ln-modal:before-open", { modalId: m.id, target: m }).defaultPrevented) {
        m.setAttribute(t, "close");
        return;
      }
      r.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof m.showModal == "function" && m.showModal();
      const o = m.querySelector("[autofocus]");
      if (o && Gt(o))
        o.focus();
      else {
        const g = m.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), _ = Array.prototype.find.call(g, Gt);
        if (_) _.focus();
        else {
          const c = m.querySelectorAll("a[href], button:not([disabled])"), y = Array.prototype.find.call(c, Gt);
          y && y.focus();
        }
      }
      k(m, "ln-modal:open", { modalId: m.id, target: m });
    } else {
      if (!v && Q(m, "ln-modal:before-close", { modalId: m.id, target: m }).defaultPrevented) {
        m.setAttribute(t, "open");
        return;
      }
      r.isOpen = !1, m.hasAttribute("data-ln-modal-mode") && m.setAttribute("data-ln-modal-mode", "new"), typeof m.close == "function" && m.open && m.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), k(m, "ln-modal:close", { modalId: m.id, target: m });
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
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const a = p.target.closest('a[href^="#"]');
    if (!a) return;
    const l = a.getAttribute("href"), s = Yt(l);
    for (const n in s) {
      const f = document.getElementById(n);
      if (f && f.lnModal) {
        if (!ze(p)) return;
        gt(n, s[n]), f.lnModal.isOpen || k(f, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function d() {
    const p = location.hash;
    if (!p) return;
    const a = Yt(p);
    for (const l in a) {
      const s = document.getElementById(l);
      s && s.lnModal && !s.lnModal.isOpen && k(s, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", d), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d(), document.addEventListener("ln-modal:close", function(p) {
    const a = p.target;
    a && a.id && st(a.id) !== null && gt(a.id, null);
  }), document.addEventListener("ln-ajax:success", function(p) {
    const l = (p.detail || {}).data;
    if (l && l.message) {
      const n = l.message;
      k(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const s = p.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && st(s.id) !== null && gt(s.id, null), k(s, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(p) {
    const l = (p.detail || {}).data;
    if (l && l.message) {
      const s = l.message;
      k(window, "ln-toast:enqueue", {
        type: s.type || "error",
        title: s.title || "",
        message: typeof s == "string" ? s : s.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(p) {
    const a = p.detail || {};
    a.message && k(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: a.message
    });
  });
  function u(p) {
    return this.dom = p, this;
  }
  u.prototype.destroy = function() {
    delete this.dom[e];
  }, H(t, e, u, "ln-ui-coordinator", {
    attributes: i
  });
})();
function gr(t, e) {
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
  }, u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"), p = /* @__PURE__ */ new Set();
  let a = !1;
  function l() {
    ue(), !a && (a = !0, document.addEventListener("ln-core:locale-change", function() {
      p.forEach(function(n) {
        n.isTextElement ? n._formatTextContent() : isNaN(n.value) || n._displayFormatted(n.value);
      });
    }));
  }
  function s(n) {
    if (n[e]) return n[e];
    if (n[e] = this, this.dom = n, p.add(this), l(), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const f = document.createElement("input");
    f.type = "hidden", f.name = n.name, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && f.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.type = "text", n.setAttribute("inputmode", "decimal"), n.insertAdjacentElement("afterend", f), this._hidden = f, Object.defineProperty(f, "value", {
      get: function() {
        return u.get.call(f);
      },
      set: function(r) {
        if (u.set.call(f, r), r !== "" && !isNaN(parseFloat(r))) {
          const v = self.dom.getAttribute("data-ln-number-decimals");
          self._setDisplayRaw(rt(parseFloat(r), J(self.dom), { maxDecimals: v }));
        } else
          self._setDisplayRaw("");
        self.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), Me(n, u, {
      get: function() {
        return u.get.call(n);
      },
      set: function(r) {
        if (r === "") {
          self._setDisplayRaw(""), self._setHiddenRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const v = typeof r == "number" ? r : parseFloat(String(r));
        if (isNaN(v))
          self._setDisplayRaw(String(r)), self._setHiddenRaw("");
        else {
          self._setHiddenRaw(v);
          const w = n.getAttribute("data-ln-number-decimals");
          self._setDisplayRaw(rt(v, J(n), { maxDecimals: w }));
        }
        n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      self._handleInput();
    }, n.addEventListener("input", this._onInput), this._onKeyDown = function(r) {
      if (r.key !== "Backspace") return;
      const v = n.selectionStart, w = n.selectionEnd;
      if (v !== w || v === 0) return;
      const h = ce(J(n)), b = u.get.call(n), o = b[v - 1];
      if (o === h.groupSep || /\s/.test(o)) {
        r.preventDefault();
        const g = v - 2 >= 0 ? v - 2 : 0, _ = b.slice(0, g) + b.slice(v);
        u.set.call(n, _), n.setSelectionRange(g, g), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, n.addEventListener("keydown", this._onKeyDown), this._onPaste = function(r) {
      r.preventDefault();
      const v = (r.clipboardData || window.clipboardData).getData("text"), w = er(v, J(n));
      self.value = isNaN(w) ? NaN : w;
    }, n.addEventListener("paste", this._onPaste);
    const m = n.value;
    if (m !== "") {
      const r = parseFloat(m);
      if (!isNaN(r)) {
        const v = n.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(r), this._setDisplayRaw(rt(r, J(n), { maxDecimals: v })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return n.form && (this._onFormReset = function() {
      setTimeout(function() {
        const r = n.defaultValue;
        if (r !== "") {
          const v = parseFloat(r);
          if (!isNaN(v)) {
            const w = n.getAttribute("data-ln-number-decimals");
            self._setHiddenRaw(v), self._setDisplayRaw(rt(v, J(n), { maxDecimals: w })), n.dispatchEvent(new Event("input", { bubbles: !0 }));
            return;
          }
        }
        self._setHiddenRaw(""), self._setDisplayRaw(""), n.dispatchEvent(new Event("input", { bubbles: !0 }));
      }, 0);
    }, n.form.addEventListener("reset", this._onFormReset)), this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom;
    let f = n.getAttribute("data-ln-value"), m = n.getAttribute("data-ln-number"), r = null;
    f !== null && f !== "" ? r = f : m !== null && m !== "" && m !== "true" ? r = m : r = n.textContent.trim();
    const v = parseFloat(r);
    isNaN(v) ? this._rawValue = null : (this._rawValue = v, n.hasAttribute("data-ln-value") || n.setAttribute("data-ln-value", String(v)), this._formatTextContent());
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
    const m = n.selectionStart;
    let r = 0;
    for (let S = 0; S < m; S++)
      /[0-9]/.test(f[S]) && r++;
    const v = J(n), w = ce(v);
    let h = f, b = Wn(f, w.groupSep, w.decimalSep), o = parseFloat(b);
    if (isNaN(o)) {
      this._setHiddenRaw(""), k(n, "ln-number:input", { value: NaN, formatted: f });
      return;
    }
    const g = n.getAttribute("data-ln-number-decimals"), _ = b.indexOf(".");
    if (g !== null && _ !== -1) {
      const S = parseInt(g, 10), C = b.slice(_ + 1);
      if (S === 0)
        b = b.slice(0, _), h = h.split(w.decimalSep)[0], o = parseFloat(b), this._setDisplayRaw(h);
      else if (C.length > S) {
        b = b.slice(0, _ + 1 + S);
        const L = h.split(w.decimalSep);
        h = L[0] + w.decimalSep + L[1].slice(0, S), o = parseFloat(b), this._setDisplayRaw(h);
      }
    }
    const c = n.getAttribute("data-ln-number-max");
    if (c !== null && o > parseFloat(c)) {
      const S = parseFloat(c), C = rt(S, v, { maxDecimals: g });
      this._setDisplayRaw(C), this._setHiddenRaw(S), n.setSelectionRange(C.length, C.length), k(n, "ln-number:input", { value: S, formatted: C });
      return;
    }
    if (h.endsWith(w.decimalSep) || w.decimalSep !== "." && h.endsWith(".")) {
      this._setHiddenRaw(o), k(n, "ln-number:input", { value: o, formatted: h });
      return;
    }
    const y = b.indexOf(".");
    if (y !== -1 && b.slice(y + 1).endsWith("0")) {
      this._setHiddenRaw(o), k(n, "ln-number:input", { value: o, formatted: h });
      return;
    }
    let E;
    if (g !== null)
      E = rt(o, v, { maxDecimals: g });
    else {
      const S = y !== -1 ? b.slice(y + 1).length : 0;
      E = rt(o, v, { userDecimals: S });
    }
    this._setDisplayRaw(E);
    const A = gr(E, r);
    n.setSelectionRange(A, A), this._setHiddenRaw(o), k(n, "ln-number:input", { value: o, formatted: E });
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
      const m = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(rt(f, J(this.dom), { maxDecimals: m })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : u.get.call(this.dom);
    }
  }), s.prototype.destroy = function() {
    this.dom[e] && (p.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this._onFormReset && this.dom.form && this.dom.form.removeEventListener("reset", this._onFormReset), this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, H(t, e, s, "ln-number", {
    attributes: d,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Le = /^(short|medium|long)(\s+datetime)?$/, _r = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function br(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Le) ? _r[t.trim()] : null;
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
  let p, a, l;
  i === "." ? (p = u[0], a = u[1], l = u[2]) : i === "/" ? (a = u[0], p = u[1], l = u[2]) : d[0].length === 4 ? (l = u[0], a = u[1], p = u[2]) : (p = u[0], a = u[1], l = u[2]), l < 100 && (l += l < 50 ? 2e3 : 1900);
  const s = new Date(l, a - 1, p);
  return s.getFullYear() !== l || s.getMonth() !== a - 1 || s.getDate() !== p ? null : s;
}
function ye(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const u = t.getDate(), p = t.getMonth(), a = t.getFullYear(), l = t.getHours(), s = t.getMinutes();
  let n, f;
  const m = (i || "").toLowerCase().split("-")[0];
  let r = !1;
  try {
    const h = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    r = !!(d && h !== m);
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
    f = d.monthsShort[p];
  else
    try {
      f = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      f = String(p + 1);
    }
  const v = {
    yyyy: String(a),
    yy: String(a).slice(-2),
    MMMM: n,
    MMM: f,
    MM: String(p + 1).padStart(2, "0"),
    M: String(p + 1),
    dd: String(u).padStart(2, "0"),
    d: String(u),
    HH: String(l).padStart(2, "0"),
    mm: String(s).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(w) {
    return v[w] !== void 0 ? v[w] : w;
  });
}
function ne(t, e, i, d) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const u = br(e);
  if (u)
    try {
      const p = new Intl.DateTimeFormat(i, u), a = (i || "").toLowerCase().split("-")[0], l = p.resolvedOptions().locale.toLowerCase().split("-")[0];
      return d && l !== a ? ye(t, "dd.MM.yyyy", i, d) : p.format(t);
    } catch {
      return ye(t, "dd.MM.yyyy", i, d);
    }
  return ye(t, e || "dd.MM.yyyy", i, d);
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
        const w = it(v.value);
        w && v._displayFormatted(w);
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
  function p(r, v, w) {
    k(r.dom, "ln-date:change", {
      value: v,
      formatted: r.dom.value,
      date: w
    }), r.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function a(r, v, w, h) {
    r._setHiddenRaw(v), u.set.call(r._picker, v), r._lastISO = v, h !== void 0 ? (r._isFormatting = !0, r.dom.value = h, r._isFormatting = !1) : w && r._displayFormatted(w), p(r, v, w);
  }
  function l(r) {
    r._setHiddenRaw(""), u.set.call(r._picker, ""), r._isFormatting = !0, r.dom.value = "", r._isFormatting = !1, r._lastISO = "", p(r, "", null);
  }
  const s = /* @__PURE__ */ new Set();
  let n = !1;
  function f() {
    ue(), !n && (n = !0, document.addEventListener("ln-core:locale-change", function() {
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
  function m(r) {
    if (r[e]) return r[e];
    if (r[e] = this, this.dom = r, s.add(this), f(), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const v = r.value, w = r.name, h = r.closest(".form-element, form") || r.parentNode;
    if (h) {
      const y = h.querySelectorAll("[data-ln-date-dict]");
      for (let E = 0; E < y.length; E++) {
        const A = y[E].getAttribute("data-ln-date-dict");
        if (A) {
          const S = Ln(y[E], "data-ln-date-dict-key");
          S["months-long"] && (S.monthsLong = S["months-long"].split(",").map((C) => C.trim())), S["months-short"] && (S.monthsShort = S["months-short"].split(",").map((C) => C.trim())), kn(A, S);
        }
      }
    }
    const b = document.createElement("span");
    b.setAttribute("data-ln-date-field", ""), r.parentNode.insertBefore(b, r), b.appendChild(r), this._wrapper = b;
    const o = document.createElement("input");
    o.type = "hidden", o.name = w, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && o.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.insertAdjacentElement("afterend", o), this._hidden = o;
    const g = document.createElement("input");
    g.type = "date", g.tabIndex = -1, g.setAttribute("tabindex", "-1"), g.setAttribute("aria-hidden", "true"), g.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Date picker"), g.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", o.insertAdjacentElement("afterend", g), this._picker = g, r.type = "text";
    const _ = document.createElement("button");
    _.type = "button", _.setAttribute("aria-label", r.getAttribute("data-ln-date-label") || "Open date picker"), _.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', g.insertAdjacentElement("afterend", _), this._btn = _, this._lastISO = "", Object.defineProperty(o, "value", {
      get: function() {
        return u.get.call(o);
      },
      set: function(y) {
        if (u.set.call(o, y), y && y !== "") {
          const E = it(y);
          E && a(self, y, E);
        } else y === "" && l(self);
      }
    }), Me(r, u, {
      get: function() {
        return u.get.call(r);
      },
      set: function(y, E) {
        if (self._isFormatting) {
          E(y);
          return;
        }
        if (!y || y === "") {
          E(""), l(self);
          return;
        }
        const A = it(y) || jt(y);
        if (A) {
          const S = Ft(A), C = r.getAttribute(t) || "", L = J(r), I = Rt(L), q = ne(A, C, L, I);
          E(q), a(self, S, A, q);
        } else
          E(String(y)), l(self);
      }
    }), this._onPickerChange = function() {
      const y = g.value;
      if (y) {
        const E = it(y);
        E && a(self, y, E);
      } else
        l(self);
    }, g.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const y = self.dom.value.trim();
      if (y === "") {
        self._lastISO !== "" && l(self);
        return;
      }
      if (self._lastISO) {
        const A = it(self._lastISO);
        if (A) {
          const S = self.dom.getAttribute(t) || "", C = J(self.dom), L = Rt(C);
          if (y === ne(A, S, C, L)) return;
        }
      }
      const E = jt(y);
      if (E) {
        const A = Ft(E);
        a(self, A, E);
      } else if (self._lastISO) {
        const A = it(self._lastISO);
        A && self._displayFormatted(A);
      } else
        self.dom.value = "";
    }, r.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      self._openPicker();
    }, _.addEventListener("click", this._onBtnClick);
    const c = r.form;
    if (c && (this._form = c, this._onFormReset = function() {
      setTimeout(function() {
        const y = self.dom.value;
        if (y) {
          const E = it(y) || jt(y);
          if (E) {
            const A = Ft(E);
            a(self, A, E);
            return;
          }
        }
        l(self);
      }, 0);
    }, c.addEventListener("reset", this._onFormReset)), v && v !== "") {
      const y = it(v);
      y && a(self, v, y);
    }
    return this;
  }
  m.prototype._initTextElement = function() {
    const r = this.dom, v = r.getAttribute("data-ln-value"), w = r.getAttribute("data-ln-date"), h = r.getAttribute("datetime");
    let b = null;
    r.tagName === "TIME" && h !== null && h !== "" ? b = h : v !== null && v !== "" ? b = v : h !== null && h !== "" ? b = h : w !== null && w !== "" && w !== "true" && !Le.test(w) ? b = w : b = r.textContent.trim();
    const o = it(b) || jt(b);
    if (o && !isNaN(o.getTime())) {
      const g = Ft(o);
      this._rawValue = g, r.tagName !== "TIME" && !r.hasAttribute("data-ln-value") && r.setAttribute("data-ln-value", g), this._formatTextContent();
    } else
      this._rawValue = null;
  }, m.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const r = it(this._rawValue);
      if (r) {
        let w = this.dom.getAttribute("data-ln-date-format");
        if (!w) {
          const o = this.dom.getAttribute("data-ln-date");
          o && Le.test(o) && (w = o);
        }
        const h = J(this.dom), b = Rt(h);
        this.dom.textContent = ne(r, w || "medium", h, b);
      }
    }
  }, m.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, m.prototype._setHiddenRaw = function(r) {
    u.set.call(this._hidden, r);
  }, m.prototype._displayFormatted = function(r) {
    const v = this.dom.getAttribute(t) || "", w = J(this.dom), h = Rt(w);
    this._isFormatting = !0, this.dom.value = ne(r, v, w, h), this._isFormatting = !1;
  }, Object.defineProperty(m.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : u.get.call(this._hidden);
    },
    set: function(r) {
      if (this.isTextElement) {
        if (!r || r === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const w = it(r) || jt(r);
        if (!w) return;
        const h = Ft(w);
        this._rawValue = h, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", h) : this.dom.setAttribute("data-ln-value", h), this._formatTextContent();
        return;
      }
      if (!r || r === "") {
        l(this);
        return;
      }
      const v = it(r);
      v && a(this, r, v);
    }
  }), Object.defineProperty(m.prototype, "date", {
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
  }), Object.defineProperty(m.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), m.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (s.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const r = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", r && (this.dom.value = r), delete this.dom[e];
  }, H(t, e, m, "ln-date", {
    attributes: d,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-nav": { effect: a, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: It, effect: a, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, d = Y(i);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const l = history.pushState;
    history.pushState = function() {
      l.apply(history, arguments);
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
  function u(l) {
    return this.dom = l, X(this, l, d), this.activeClass = l.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = null, this.update(), this;
  }
  u.prototype.update = function() {
    if (!this.activeClass || Q(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, f = p(n), m = [];
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
      const w = p(v), h = w === f, b = !this.exact && w !== "/" && f.startsWith(w + "/");
      h || b ? (r.classList.add(this.activeClass), r.setAttribute("aria-current", "page"), m.push(r)) : (r.classList.remove(this.activeClass), r.removeAttribute("aria-current"));
    }
    k(this.dom, "ln-nav:update", { target: this.dom, activeLinks: m });
  }, u.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const l = history._lnNavCallbacks.indexOf(this.updateHandler);
    l !== -1 && history._lnNavCallbacks.splice(l, 1), delete this.dom[e];
  };
  function p(l) {
    try {
      return new URL(l, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return l.replace(/\/$/, "") || "/";
    }
  }
  function a(l, s) {
    const n = l[e];
    if (n) {
      if (s === t) {
        if (!l.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const f = n.activeClass, m = l.getAttribute(t) || "active";
        if (f !== m) {
          const r = l.querySelectorAll("a");
          for (const v of r)
            f && v.classList.remove(f);
          n.activeClass = m;
        }
      }
      n.update();
    }
  }
  H(t, e, u, "ln-nav", {
    attributes: i,
    onSubtreeChange: function(l) {
      l[e] && l[e].update();
    }
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(a, l) {
    const s = a.getAttribute("data-ln-persist"), n = s !== null && s !== "" ? s : a.id;
    return n ? a.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + l : "ln:" + n + ":" + l : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', a), null);
  }
  let i = null;
  function d() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const a = "__ln_persist_test__";
      return localStorage.setItem(a, a), localStorage.removeItem(a), i = !0;
    } catch {
      return i = !1;
    }
  }
  const u = /* @__PURE__ */ new Set();
  function p(a, l) {
    const s = window.lnCore && window.lnCore._attrRegistry, n = s && s.persist || [];
    let f = null;
    for (let w = 0; w < n.length; w++)
      if (n[w].selector === l) {
        f = n[w];
        break;
      }
    if (!f) return;
    const m = f.persist;
    if (u.has(m.attr) || (u.add(m.attr), Nt([m.attr], function(w, h) {
      if (!w.hasAttribute("data-ln-persist") || m.hashActive && m.hashActive(w)) return;
      const b = e(w, h);
      if (!b || !d()) return;
      const o = w.getAttribute(h);
      try {
        o === null ? localStorage.removeItem(b) : localStorage.setItem(b, o);
      } catch {
      }
    })), m.hashActive && m.hashActive(a)) return;
    const r = e(a, m.attr);
    if (!r || !d()) return;
    const v = localStorage.getItem(r);
    v !== null && a.setAttribute(m.attr, v);
  }
  Bi(p);
})();
function an(t, e, i, d) {
  const u = (t || "").toLowerCase().trim();
  if (u) return u;
  if ((e || "").toUpperCase() !== "A") return "";
  const p = i || "";
  if (!p.startsWith("#")) return "";
  const a = p.slice(1);
  if (!a) return "";
  const l = a.split("&"), s = (d || "").toLowerCase().trim();
  if (s)
    for (const m of l) {
      const r = m.indexOf(":");
      if (r > 0 && m.slice(0, r).toLowerCase().trim() === s)
        return m.slice(r + 1).toLowerCase().trim();
    }
  const n = l[l.length - 1] || "", f = n.indexOf(":");
  return (f > 0 ? n.slice(f + 1) : n).toLowerCase().trim();
}
function ln(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (p) => (p.tagName || "").toUpperCase() === "A" && (p.href || "").startsWith("#")
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
  }, p = Y(u);
  function a(s) {
    return this.dom = s, X(this, s, p), this.activeKey = null, l.call(this), this;
  }
  function l() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const s = this.tabs.map((m) => ({
      tagName: m.tagName,
      href: m.getAttribute("href")
    })), n = ln(s, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const m of this.tabs) {
      const r = an(m.getAttribute("data-ln-tab"), m.tagName, m.getAttribute("href"), this.nsKey);
      r ? this.mapTabs[r] = m : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', m);
    }
    for (const m of this.panels) {
      const r = (m.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      r && (this.mapPanels[r] = m);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const f = this;
    this._clickHandlers = [];
    for (const m of this.tabs) {
      if (m[e + "Trigger"]) continue;
      const r = function(v) {
        const w = m.tagName === "A";
        if (!w && (v.ctrlKey || v.metaKey || v.button === 1)) return;
        const h = an(m.getAttribute("data-ln-tab"), m.tagName, m.getAttribute("href"), f.nsKey);
        h && (w && !ze(v) || (f.hashEnabled ? st(f.nsKey) === h ? f.dom.setAttribute("data-ln-tabs-active", h) : gt(f.nsKey, h) : f.dom.setAttribute("data-ln-tabs-active", h)));
      };
      m.addEventListener("click", r), m[e + "Trigger"] = r, f._clickHandlers.push({ el: m, handler: r });
    }
    if (this._onRequestSelect = function(m) {
      const r = m.detail && (m.detail.key || m.detail.tab);
      r && f.select(r);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!f.hashEnabled) return;
      const m = st(f.nsKey);
      f.dom.setAttribute("data-ln-tabs-active", m !== null ? m : f.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const m = cn(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", m);
    }
  }
  a.prototype.select = function(s) {
    const n = (s + "").toLowerCase().trim();
    n && (this.hashEnabled ? st(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : gt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, a.prototype._applyActive = function(s) {
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
    for (const m in this.mapTabs) {
      const r = this.mapTabs[m];
      m === s ? (r.hasAttribute("data-active") || r.setAttribute("data-active", ""), r.getAttribute("aria-selected") !== "true" && r.setAttribute("aria-selected", "true")) : (r.hasAttribute("data-active") && r.removeAttribute("data-active"), r.getAttribute("aria-selected") !== "false" && r.setAttribute("aria-selected", "false"));
    }
    for (const m in this.mapPanels) {
      const r = this.mapPanels[m], v = m === s;
      r.hidden !== !v && (r.hidden = !v), r.classList.contains("hidden") !== !v && r.classList.toggle("hidden", !v);
      const w = v ? "false" : "true";
      r.getAttribute("aria-hidden") !== w && r.setAttribute("aria-hidden", w);
    }
    if (this.autoFocus) {
      const m = (f = this.mapPanels[s]) == null ? void 0 : f.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      m && setTimeout(() => m.focus({ preventScroll: !0 }), 0);
    }
    k(this.dom, "ln-tabs:change", {
      key: s,
      previousKey: n,
      tab: this.mapTabs[s],
      panel: this.mapPanels[s],
      target: this.dom
    });
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: s, handler: n } of this._clickHandlers)
        s.removeEventListener("click", n), delete s[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, H(t, e, a, "ln-tabs", {
    attributes: u,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(s) {
        const n = Array.from(s.querySelectorAll("[data-ln-tab]")).map(function(m) {
          return { tagName: m.tagName, href: m.getAttribute("href") };
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
    "data-ln-toggle": { effect: r, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, p = /* @__PURE__ */ new Set();
  let a = null;
  function l(v, w) {
    return w === "open" ? "open" : w === "close" || v === "open" ? "close" : "open";
  }
  function s() {
    a || (a = function(v) {
      if (De(v)) return;
      const w = v.target.closest("[" + i + "]");
      if (!w || Re(w)) return;
      const h = w.getAttribute(i);
      if (!h) return;
      const b = document.getElementById(h);
      if (!b || !b[e]) return;
      v.preventDefault();
      const o = w.getAttribute(d) || "toggle", g = b.getAttribute(t);
      b.setAttribute(t, l(g, o));
    }, document.addEventListener("click", a));
  }
  function n() {
    p.size > 0 || !a || (document.removeEventListener("click", a), a = null);
  }
  function f(v, w) {
    if (!v || !v.id) return;
    const h = document.querySelectorAll(
      "[" + i + '="' + v.id + '"]'
    );
    for (let b = 0; b < h.length; b++)
      h[b].setAttribute("aria-expanded", w ? "true" : "false");
  }
  function m(v) {
    this.dom = v;
    const w = this;
    return this._onRequestOpen = function() {
      w.open();
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function() {
      w.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = v.getAttribute(t) === "open", this.isOpen && v.classList.add("open"), f(v, this.isOpen), p.add(this), s(), this;
  }
  m.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, m.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, m.prototype.toggle = function() {
    const v = this.dom.getAttribute(t);
    this.dom.setAttribute(t, l(v, "toggle"));
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), p.delete(this), delete this.dom[e], n());
  };
  function r(v) {
    const w = v[e];
    if (!w) return;
    const b = v.getAttribute(t) === "open";
    if (b !== w.isOpen)
      if (b) {
        if (Q(v, "ln-toggle:before-open", { target: v }).defaultPrevented) {
          v.setAttribute(t, "close");
          return;
        }
        w.isOpen = !0, v.classList.add("open"), f(v, !0), k(v, "ln-toggle:open", { target: v });
      } else {
        if (Q(v, "ln-toggle:before-close", { target: v }).defaultPrevented) {
          v.setAttribute(t, "open");
          return;
        }
        w.isOpen = !1, v.classList.remove("open"), f(v, !1), k(v, "ln-toggle:close", { target: v });
      }
  }
  H(t, e, m, "ln-toggle", {
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
    return this.dom = u, this._onToggleOpen = function(p) {
      if (!p.detail || !p.detail.target || p.detail.target.closest("[data-ln-accordion]") !== u) return;
      const a = u.querySelectorAll("[data-ln-toggle]");
      for (const l of a)
        l !== p.detail.target && l.closest("[data-ln-accordion]") === u && l.getAttribute("data-ln-toggle") === "open" && l.setAttribute("data-ln-toggle", "close");
      k(u, "ln-accordion:change", { target: p.detail.target });
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
  }, u = Y(d);
  function p(a) {
    this.dom = a, X(this, a, u), this.toggleEl = a.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = a.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const l = this;
    return this._onRequestOpen = function() {
      l.toggleEl && l.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      l.toggleEl && l.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (l.toggleEl) {
        const s = l.toggleEl.getAttribute("data-ln-toggle");
        l.toggleEl.setAttribute("data-ln-toggle", s === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(s) {
      const n = l.toggleEl && l.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (s.key === "Escape") {
        n && (s.preventDefault(), s.stopPropagation(), l.toggleEl.setAttribute("data-ln-toggle", "close"), l.triggerBtn && l.triggerBtn.focus());
        return;
      }
      if (s.key === "Tab") {
        n && (l.triggerBtn && l.triggerBtn.focus(), l.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const f = l._getMenuItems();
      if (f.length === 0) return;
      if (!n && (s.key === "ArrowDown" || s.key === "ArrowUp")) {
        s.preventDefault(), l.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const r = l._getMenuItems();
          r.length > 0 && l._focusItem(r, s.key === "ArrowDown" ? 0 : r.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const m = f.indexOf(document.activeElement);
      if (s.key === "ArrowDown") {
        s.preventDefault();
        const r = m < f.length - 1 ? m + 1 : 0;
        l._focusItem(f, r);
      } else if (s.key === "ArrowUp") {
        s.preventDefault();
        const r = m > 0 ? m - 1 : f.length - 1;
        l._focusItem(f, r);
      } else s.key === "Home" ? (s.preventDefault(), l._focusItem(f, 0)) : s.key === "End" && (s.preventDefault(), l._focusItem(f, f.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(s) {
      !s.detail || s.detail.target !== l.toggleEl || (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "true"), typeof l.toggleEl.showPopover == "function" && l.toggleEl.showPopover(), l._initMenuAria(), l._reposition(), l._addOutsideClickListener(), l._addScrollRepositionListener(), l._addResizeCloseListener(), k(a, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      !s.detail || s.detail.target !== l.toggleEl || (l.triggerBtn && l.triggerBtn.setAttribute("aria-expanded", "false"), l._removeOutsideClickListener(), l._removeScrollRepositionListener(), l._removeResizeCloseListener(), l.toggleEl.style.top = "", l.toggleEl.style.left = "", l.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof l.toggleEl.hidePopover == "function" && l.toggleEl.matches(":popover-open") && l.toggleEl.hidePopover(), k(a, "ln-dropdown:close", { target: s.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  p.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const a = this.toggleEl.querySelectorAll("li");
    for (const s of a)
      s.setAttribute("role", "none");
    const l = this._getMenuItems();
    for (let s = 0; s < l.length; s++)
      l[s].setAttribute("role", "menuitem"), l[s].setAttribute("tabindex", s === 0 ? "0" : "-1");
  }, p.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, p.prototype._focusItem = function(a, l) {
    for (let s = 0; s < a.length; s++)
      a[s].setAttribute("tabindex", s === l ? "0" : "-1");
    a[l] && a[l].focus();
  }, p.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl || !document.contains(this.toggleEl)) return;
    const a = this.triggerBtn.getBoundingClientRect(), l = Se(this.toggleEl), s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, f = le(a, l, n, s), m = f.top + "px", r = f.left + "px";
    this.toggleEl.style.top !== m && (this.toggleEl.style.top = m), this.toggleEl.style.left !== r && (this.toggleEl.style.left = r), this.toggleEl.getAttribute("data-ln-dropdown-placement") !== f.placement && this.toggleEl.setAttribute("data-ln-dropdown-placement", f.placement);
  }, p.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const a = this;
    this._boundDocClick = function(l) {
      a.dom.contains(l.target) || a.toggleEl && a.toggleEl.contains(l.target) || a.toggleEl && a.toggleEl.getAttribute("data-ln-toggle") === "open" && a.toggleEl.setAttribute("data-ln-toggle", "close");
    }, a._docClickTimeout = setTimeout(function() {
      a._docClickTimeout = null, document.addEventListener("click", a._boundDocClick);
    }, 0);
  }, p.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, p.prototype._addScrollRepositionListener = function() {
    const a = this;
    this._scrollRepositionRaf = null, this._boundScrollReposition = function() {
      a._scrollRepositionRaf || (a._scrollRepositionRaf = requestAnimationFrame(function() {
        a._scrollRepositionRaf = null, a._reposition();
      }));
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, p.prototype._removeScrollRepositionListener = function() {
    this._scrollRepositionRaf && (cancelAnimationFrame(this._scrollRepositionRaf), this._scrollRepositionRaf = null), this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, p.prototype._addResizeCloseListener = function() {
    const a = this;
    this._boundResizeClose = function() {
      a.toggleEl && a.toggleEl.getAttribute("data-ln-toggle") === "open" && a.toggleEl.setAttribute("data-ln-toggle", "close");
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
  const u = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: m, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, p = [];
  let a = null;
  function l() {
    a || (a = function(r) {
      if (r.key !== "Escape" || p.length === 0) return;
      p[p.length - 1].close();
    }, document.addEventListener("keydown", a));
  }
  function s() {
    p.length > 0 || a && (document.removeEventListener("keydown", a), a = null);
  }
  function n(r) {
    this.dom = r, this.isOpen = r.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const v = this;
    return this._onRequestOpen = function(w) {
      const h = w.detail && w.detail.trigger ? w.detail.trigger : null;
      v.open(h);
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function(w) {
      const h = w.detail && w.detail.trigger ? w.detail.trigger : null;
      v.toggle(h);
    }, this._onNativeToggle = function(w) {
      w.newState === "closed" && v.isOpen && (v._applyClose(), v.dom.setAttribute(t, "closed"));
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
    const v = Se(this.dom);
    if (this.trigger) {
      const o = this.trigger.getBoundingClientRect(), g = this.dom.getAttribute(d) || "bottom", _ = le(o, v, g, 8);
      this.dom.style.top = _.top + "px", this.dom.style.left = _.left + "px", this.dom.setAttribute("data-ln-popover-placement", _.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const w = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), h = Array.prototype.find.call(w, Gt);
    h ? h.focus() : this.dom.focus();
    const b = this;
    this._boundDocClick = function(o) {
      b.dom.contains(o.target) || b.trigger && b.trigger.contains(o.target) || b.close();
    }, b._docClickTimeout = setTimeout(function() {
      b._docClickTimeout = null, document.addEventListener("click", b._boundDocClick);
    }, 0), this._repositionRaf = null, this._performReposition = function() {
      if (!b.trigger || !document.contains(b.dom)) return;
      const o = b.trigger.getBoundingClientRect(), g = Se(b.dom), _ = b.dom.getAttribute(d) || "bottom", c = le(o, g, _, 8), y = c.top + "px", E = c.left + "px";
      b.dom.style.top !== y && (b.dom.style.top = y), b.dom.style.left !== E && (b.dom.style.left = E), b.dom.getAttribute("data-ln-popover-placement") !== c.placement && b.dom.setAttribute("data-ln-popover-placement", c.placement);
    }, this._boundReposition = function() {
      b._repositionRaf || (b._repositionRaf = requestAnimationFrame(function() {
        b._repositionRaf = null, b._performReposition();
      }));
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), p.push(this), l(), k(this.dom, "ln-popover:open", {
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
  function f(r) {
    this.dom = r;
    const v = r.getAttribute(i);
    return r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", "false"), r.setAttribute("aria-controls", v), this._onClick = function(w) {
      if (w.ctrlKey || w.metaKey || w.button === 1) return;
      w.preventDefault();
      const h = document.getElementById(v);
      if (!h) return;
      h[e] && (h[e].trigger = r);
      const b = h.getAttribute(t);
      h.setAttribute(t, b === "open" ? "closed" : "open");
    }, r.addEventListener("click", this._onClick), this;
  }
  f.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function m(r) {
    const v = r[e];
    if (!v) return;
    const h = r.getAttribute(t) === "open";
    if (h !== v.isOpen)
      if (h) {
        if (Q(r, "ln-popover:before-open", {
          popoverId: r.id,
          target: r,
          trigger: v.trigger
        }).defaultPrevented) {
          r.setAttribute(t, "closed");
          return;
        }
        v._applyOpen(v.trigger);
      } else {
        if (Q(r, "ln-popover:before-close", {
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
    attributes: u
  }), H(i, e + "Trigger", f, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", d = "lnTooltipEnhance", u = "ln-tooltip-portal";
  if (window[d] !== void 0) return;
  const p = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let a = 0, l = null, s = null, n = null, f = null, m = null, r = null;
  function v() {
    return l && l.parentNode || (l = document.getElementById(u), l || (l = document.createElement("div"), l.id = u, document.body.appendChild(l)), l.hasAttribute("popover") || l.setAttribute("popover", "manual")), l;
  }
  function w() {
    r || (r = function(_) {
      _.key === "Escape" && o();
    }, document.addEventListener("keydown", r));
  }
  function h() {
    r && (document.removeEventListener("keydown", r), r = null);
  }
  function b(_) {
    if (n === _) return;
    o();
    const c = _.getAttribute(e) || _.getAttribute("title");
    if (!c) return;
    v(), typeof l.showPopover == "function" && l.showPopover(), _.hasAttribute("title") && (f = _.getAttribute("title"), _.removeAttribute("title"));
    const y = _.getAttribute("aria-describedby");
    y ? m = y : m = null;
    const E = document.createElement("div");
    E.className = "ln-tooltip", E.textContent = c, _[d + "Uid"] || (a += 1, _[d + "Uid"] = "ln-tooltip-" + a), E.id = _[d + "Uid"], l.appendChild(E);
    const A = E.offsetWidth, S = E.offsetHeight, C = _.getBoundingClientRect(), L = _.getAttribute(i) || "top", I = le(C, { width: A, height: S }, L, 6);
    E.style.top = I.top + "px", E.style.left = I.left + "px", E.setAttribute("data-ln-tooltip-placement", I.placement), m ? _.setAttribute("aria-describedby", m + " " + E.id) : _.setAttribute("aria-describedby", E.id), s = E, n = _, w();
  }
  function o() {
    if (!s) {
      h();
      return;
    }
    n && (m !== null ? n.setAttribute("aria-describedby", m) : n.removeAttribute("aria-describedby"), m = null, f !== null && n.setAttribute("title", f)), f = null, s.parentNode && s.parentNode.removeChild(s), s = null, n = null, l && typeof l.hidePopover == "function" && l.matches(":popover-open") && l.hidePopover(), h();
  }
  function g(_) {
    return this.dom = _, _.hasAttribute("data-ln-tooltip-enhanced") || (_.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      b(_);
    }, this._onLeave = function() {
      n === _ && !_.contains(document.activeElement) && o();
    }, this._onFocus = function() {
      b(_);
    }, this._onBlur = function() {
      n === _ && !_.matches(":hover") && o();
    }, _.addEventListener("mouseenter", this._onEnter), _.addEventListener("mouseleave", this._onLeave), _.addEventListener("focus", this._onFocus, !0), _.addEventListener("blur", this._onBlur, !0), this;
  }
  g.prototype.destroy = function() {
    const _ = this.dom;
    _.removeEventListener("mouseenter", this._onEnter), _.removeEventListener("mouseleave", this._onLeave), _.removeEventListener("focus", this._onFocus, !0), _.removeEventListener("blur", this._onBlur, !0), n === _ && o(), this._addedEnhancedAttr && _.removeAttribute("data-ln-tooltip-enhanced"), delete _[d], delete _[d + "Uid"];
  }, H(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    d,
    g,
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
  }, u = Y(d);
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
  function a(b) {
    if (!b || !(b instanceof HTMLElement)) return;
    if (b.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof b.hidePopover == "function" && b.matches(":popover-open"))
      try {
        b.hidePopover();
      } catch {
      }
  }
  function l(b) {
    this.dom = b, X(this, b, u);
    const o = Array.from(b.querySelectorAll("[data-ln-toast-item]"));
    for (; o.length > this.max; ) b.removeChild(o.shift());
    for (const g of o) v(g, this);
    return o.length > 0 && p(b), this;
  }
  l.prototype.enqueue = function(b) {
    if (!b) return;
    const o = s(b, this.dom);
    if (!o) return;
    const g = Number.isFinite(b.timeout) ? b.timeout : this.timeoutDefault;
    f(this, o), g > 0 && (o._timer = setTimeout(() => m(o), g));
  }, l.prototype.clear = function() {
    for (const b of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      m(b);
  }, l.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const b of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        m(b);
      a(this.dom), delete this.dom[e];
    }
  };
  function s(b, o) {
    const g = ((b.type || "") + "").trim().toLowerCase(), _ = Lt(o, i, "ln-toast");
    if (!_)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    ft(_, {
      type: g,
      title: b.title,
      message: typeof b.message == "string" ? b.message : void 0
    });
    const c = _.firstElementChild;
    if (!c) return null;
    c.hasAttribute("data-ln-toast-item") || c.setAttribute("data-ln-toast-item", ""), c.classList.add("ln-enter");
    const y = c.querySelector(".body");
    y && n(y, b);
    const E = c.querySelector("[data-ln-toast-close]");
    return E && E.addEventListener("click", function() {
      m(c);
    }), c;
  }
  function n(b, o) {
    if (Array.isArray(o.message)) {
      const g = document.createElement("ul");
      for (const _ of o.message) {
        const c = document.createElement("li");
        c.textContent = _, g.appendChild(c);
      }
      b.appendChild(g);
    }
    if (o.data && o.data.errors) {
      const g = document.createElement("ul");
      for (const _ of Object.values(o.data.errors).flat()) {
        const c = document.createElement("li");
        c.textContent = _, g.appendChild(c);
      }
      b.appendChild(g);
    }
  }
  function f(b, o) {
    const g = Array.from(b.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; g.length >= b.max && g.length > 0; ) b.dom.removeChild(g.shift());
    b.dom.appendChild(o), p(b.dom), requestAnimationFrame(() => o.classList.remove("ln-enter"));
  }
  function m(b) {
    if (!b || !b.parentNode) return;
    const o = b.parentNode;
    clearTimeout(b._timer), b.classList.remove("ln-enter"), b.classList.add("ln-out"), setTimeout(() => {
      b.parentNode && (b.parentNode.removeChild(b), a(o));
    }, 200);
  }
  function r(b) {
    let o = b && b.container;
    return typeof o == "string" && (o = document.querySelector(o)), o instanceof HTMLElement || (o = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), o || null;
  }
  function v(b, o) {
    if (b._lnToastHydrated) return;
    b._lnToastHydrated = !0;
    const g = b.querySelector("[data-ln-toast-close]");
    g && g.addEventListener("click", function() {
      m(b);
    });
    const _ = +(b.getAttribute("data-ln-toast-timeout") ?? o.timeoutDefault);
    _ > 0 && (b._timer = setTimeout(function() {
      m(b);
    }, _));
  }
  function w(b) {
    const o = b.detail || {}, g = r(o);
    if (!g) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (g[e] || (g[e] = new l(g))).enqueue(o);
  }
  function h(b) {
    const o = b && b.detail || {};
    if (o.container) {
      const g = r(o);
      g && (g[e] || (g[e] = new l(g))).clear();
    } else {
      const g = document.querySelectorAll("[" + t + "]");
      for (const _ of Array.from(g))
        (_[e] || (_[e] = new l(_))).clear();
    }
  }
  ct(function() {
    window.addEventListener("ln-toast:enqueue", w), window.addEventListener("ln-toast:clear", h), window.addEventListener("ln-modal:open", function() {
      const b = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const o of Array.from(b))
        o.querySelectorAll("[data-ln-toast-item]").length > 0 && p(o);
    });
  }, "ln-toast"), H(t, e, l, "ln-toast", {
    attributes: d
  });
})();
function yr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function ci(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function vr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = ci(t.name), d = String(t.type || "").toLowerCase();
  return e.some((u) => {
    if (u.includes("/")) {
      if (u.endsWith("/*")) {
        const p = u.slice(0, -1);
        return d.startsWith(p);
      }
      return d === u;
    }
    return i === u;
  });
}
function wr(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const d = 1024, u = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], p = Math.floor(Math.log(t) / Math.log(d)), a = Math.min(p, u.length - 1), l = t / Math.pow(d, a);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(l) + " " + u[a];
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
  }, p = Y(u);
  function a(n, f, m) {
    return wr(n, f, m);
  }
  function l() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function s(n) {
    this.dom = n, X(this, n, p), this.dict = Ln(n, "data-ln-upload-dict"), this.locale = J(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const f = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = yr(f), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  s.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const f = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let r = 0; r < f.length; r++) {
      const v = f[r], w = v.getAttribute("data-ln-upload-id"), h = "file-" + ++n.fileIdCounter;
      v.setAttribute("data-ln-upload-local-id", h);
      const b = v.querySelector('[data-ln-field="name"]'), o = v.querySelector('[data-ln-field="sizeText"]'), g = v.getAttribute("data-ln-upload-size"), _ = g ? parseInt(g, 10) : null;
      n.uploadedFiles.set(h, {
        serverId: w || null,
        name: b ? b.textContent.trim() : "",
        size: _ !== null && !isNaN(_) ? _ : o ? o.textContent.trim() : ""
      });
    }
    const m = this.dom.querySelectorAll('input[type="hidden"]');
    for (let r = 0; r < m.length; r++) {
      const v = m[r];
      if (v.name === n.idsFieldName && v.value && !Array.from(n.uploadedFiles.values()).some(function(h) {
        return String(h.serverId) === String(v.value);
      })) {
        const h = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(h, {
          serverId: v.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, s.prototype._syncHiddenInputs = function() {
    const n = this, f = this.dom.querySelectorAll('input[type="hidden"]');
    for (let m = 0; m < f.length; m++)
      f[m].name === n.idsFieldName && f[m].remove();
    for (const [, m] of this.uploadedFiles)
      if (m.serverId) {
        const r = document.createElement("input");
        r.type = "hidden", r.name = n.idsFieldName, r.value = m.serverId, n.dom.appendChild(r);
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
      const m = f.target.closest('[data-ln-upload-action="remove"]');
      if (!m || !n.list || !n.list.contains(m) || m.disabled) return;
      const r = m.closest("[data-ln-upload-item]");
      if (r) {
        const v = r.getAttribute("data-ln-upload-local-id");
        v && n.remove(v);
      }
    }, this._onRequestUpload = function(f) {
      f.detail && f.detail.files && n.upload(f.detail.files);
    }, this._onRequestRemove = function(f) {
      if (f.detail) {
        const m = f.detail.localId !== void 0 ? f.detail.localId : f.detail.serverId;
        m !== void 0 && n.remove(m);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, s.prototype.upload = function(n) {
    const f = this, m = Array.from(n);
    for (let r = 0; r < m.length; r++) {
      const v = m[r];
      if (f.maxFiles > 0 && f.uploadedFiles.size >= f.maxFiles) {
        k(f.dom, "ln-upload:invalid", {
          file: v,
          reason: "max-files"
        });
        continue;
      }
      if (!vr(v, f.allowedExts)) {
        k(f.dom, "ln-upload:invalid", {
          file: v,
          reason: "accept"
        });
        continue;
      }
      if (f.maxSize > 0 && v.size > f.maxSize) {
        k(f.dom, "ln-upload:invalid", {
          file: v,
          reason: "max-size"
        });
        continue;
      }
      Q(f.dom, "ln-upload:before-upload", { file: v }).defaultPrevented || f._uploadSingleFile(v);
    }
  }, s.prototype._uploadSingleFile = function(n) {
    const f = this, m = "file-" + ++f.fileIdCounter, r = ci(n.name);
    let v = null;
    if (this.list) {
      const g = Lt(this.dom, "ln-upload-item", "ln-upload");
      if (g && (v = g.firstElementChild, v)) {
        v.setAttribute("data-ln-upload-item", ""), v.setAttribute("data-ln-upload-local-id", m), v.setAttribute("data-ln-upload-ext", r), v.setAttribute("data-ln-upload-state", "uploading"), ft(v, {
          name: n.name,
          sizeText: "0%",
          removeLabel: f.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const _ = v.querySelector('[data-ln-upload-action="remove"]');
        _ && (_.disabled = !0);
        const c = v.querySelector("[data-ln-progress]");
        c && c.setAttribute("data-ln-progress", "0"), f.list.appendChild(v);
      }
    }
    const w = new FormData();
    w.append(f.fileFieldName, n);
    const h = this.dom.querySelectorAll("input, select, textarea");
    for (let g = 0; g < h.length; g++) {
      const _ = h[g];
      !_.name || _.name === f.idsFieldName || _.type === "file" || (_.type === "checkbox" || _.type === "radio") && !_.checked || w.append(_.name, _.value);
    }
    const b = new XMLHttpRequest();
    f.uploadedFiles.set(m, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: b
    }), b.upload.addEventListener("progress", function(g) {
      if (g.lengthComputable) {
        const _ = Math.round(g.loaded / g.total * 100);
        if (v) {
          const c = v.querySelector("[data-ln-progress]");
          c && c.setAttribute("data-ln-progress", String(_)), ft(v, { sizeText: _ + "%" });
        }
        k(f.dom, "ln-upload:progress", {
          localId: m,
          file: n,
          percent: _,
          loaded: g.loaded,
          total: g.total
        });
      }
    }), b.addEventListener("load", function() {
      const g = f.uploadedFiles.get(m);
      if (g && delete g.xhr, b.status >= 200 && b.status < 300) {
        let _;
        try {
          _ = JSON.parse(b.responseText);
        } catch (y) {
          o(f.dict.error || "Error", b.status, y);
          return;
        }
        const c = _.id || _.serverId;
        if (v) {
          v.removeAttribute("data-ln-upload-state"), c && v.setAttribute("data-ln-upload-id", String(c)), ft(v, {
            sizeText: a(_.size || n.size, f.locale, f.dict),
            uploading: !1
          });
          const y = v.querySelector('[data-ln-upload-action="remove"]');
          y && (y.disabled = !1);
        }
        g && (g.serverId = c, g.size = _.size || n.size, g.name = _.name || n.name), f._syncHiddenInputs(), k(f.dom, "ln-upload:uploaded", {
          localId: m,
          serverId: c,
          name: _.name || n.name,
          size: _.size || n.size,
          response: _
        });
      } else {
        let _ = "";
        try {
          _ = JSON.parse(b.responseText).message || "";
        } catch {
        }
        o(_, b.status, null);
      }
    }), b.addEventListener("error", function() {
      const g = f.uploadedFiles.get(m);
      g && delete g.xhr, o("", 0, null);
    });
    function o(g, _, c) {
      if (v) {
        v.setAttribute("data-ln-upload-state", "error"), ft(v, {
          sizeText: f.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const y = v.querySelector('[data-ln-upload-action="remove"]');
        y && (y.disabled = !1);
      }
      k(f.dom, "ln-upload:error", {
        file: n,
        message: g,
        status: _,
        error: c
      });
    }
    f.uploadUrl ? (b.open("POST", f.uploadUrl), b.setRequestHeader("X-CSRF-TOKEN", l()), b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), b.setRequestHeader("Accept", "application/json"), b.send(w)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, s.prototype.remove = function(n) {
    const f = this;
    let m = null, r = null;
    if (f.uploadedFiles.has(n))
      m = n, r = f.uploadedFiles.get(n);
    else
      for (const [b, o] of f.uploadedFiles)
        if (String(o.serverId) === String(n)) {
          m = b, r = o;
          break;
        }
    if (!m || !r || Q(f.dom, "ln-upload:before-remove", {
      localId: m,
      serverId: r.serverId
    }).defaultPrevented) return;
    const w = f.list ? f.list.querySelector('[data-ln-upload-local-id="' + m + '"]') : null;
    if (r.xhr && typeof r.xhr.abort == "function" && r.xhr.abort(), !r.serverId) {
      w && w.remove(), f.uploadedFiles.delete(m), f._syncHiddenInputs(), k(f.dom, "ln-upload:removed", { localId: m, serverId: null });
      return;
    }
    let h = null;
    if (f.deleteUrlPattern ? h = f.deleteUrlPattern.replace("{id}", encodeURIComponent(r.serverId)) : f.uploadUrl && f.uploadUrl.includes("{id}") && (h = f.uploadUrl.replace("{id}", encodeURIComponent(r.serverId))), !h) {
      w && w.remove(), f.uploadedFiles.delete(m), f._syncHiddenInputs(), k(f.dom, "ln-upload:removed", { localId: m, serverId: r.serverId });
      return;
    }
    w && (w.setAttribute("data-ln-upload-state", "deleting"), ft(w, { deleting: !0 })), fetch(h, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": l(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(b) {
      b.ok ? (w && w.remove(), f.uploadedFiles.delete(m), f._syncHiddenInputs(), k(f.dom, "ln-upload:removed", {
        localId: m,
        serverId: r.serverId
      })) : (w && (w.removeAttribute("data-ln-upload-state"), ft(w, { deleting: !1 })), k(f.dom, "ln-upload:error", {
        file: r,
        message: "",
        status: b.status
      }));
    }).catch(function(b) {
      w && (w.removeAttribute("data-ln-upload-state"), ft(w, { deleting: !1 })), k(f.dom, "ln-upload:error", {
        file: r,
        message: "",
        status: 0,
        error: b
      });
    });
  }, s.prototype.clear = function() {
    const n = this;
    if (!Q(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, m] of this.uploadedFiles)
        if (m.xhr && typeof m.xhr.abort == "function" && m.xhr.abort(), m.serverId) {
          let r = null;
          n.deleteUrlPattern ? r = n.deleteUrlPattern.replace("{id}", encodeURIComponent(m.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (r = n.uploadUrl.replace("{id}", encodeURIComponent(m.serverId))), r && fetch(r, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": l(),
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
function di(t, e) {
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
function ui(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let d = "";
    const u = i.length;
    for (let p = 0; p < u; p++)
      d += String.fromCharCode(i[p]);
    return btoa(d);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function fi(t) {
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
function hi(t, e) {
  const i = String(e || "ln-ashlar");
  let d;
  typeof TextEncoder < "u" ? d = new TextEncoder().encode(i) : typeof Buffer < "u" ? d = Buffer.from(i, "utf-8") : d = [108, 110];
  const u = d.length || 1, p = new Uint8Array(t.length);
  for (let a = 0; a < t.length; a++)
    p[a] = t[a] ^ d[a % u];
  return p;
}
function pi(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let d;
  if (typeof TextEncoder < "u")
    d = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    d = Buffer.from(i, "utf-8");
  else
    return "";
  const u = hi(d, e);
  let p = "";
  for (let a = 0; a < u.length; a++)
    p += String.fromCharCode(u[a]);
  return typeof btoa < "u" ? btoa(p) : typeof Buffer < "u" ? Buffer.from(u).toString("base64") : "";
}
function mi(t, e = "ln-ashlar") {
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
    for (let a = 0; a < d.length; a++)
      u[a] = d.charCodeAt(a);
    const p = hi(u, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(p);
    if (typeof Buffer < "u")
      return Buffer.from(p).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function gi(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", d = Number(t.shift) || 13, u = t.key || "ln-ashlar";
    return { codec: i, shift: d, key: u };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function Er(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = gi(e);
  return i.codec === "base64" ? ui(t) : i.codec === "xor" ? pi(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (d) => di(d, i.shift));
}
function ve(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = gi(e);
  return i.codec === "base64" ? fi(t) : i.codec === "xor" ? mi(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (d) => di(d, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(a) {
    const l = a[e];
    l && l.deobfuscate();
  }
  const d = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function u(a) {
    return a[e] ? a[e] : (a[e] = this, this.dom = a, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  u.prototype.deobfuscate = function() {
    const a = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && a && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((b) => !this.dom.contains(b.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
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
    const s = this.dom.getAttribute(t), n = parseInt(s, 10), f = isNaN(n) ? 13 : n, m = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), r = this.dom.getAttribute("data-ln-obfuscator-key");
    let v = "rot";
    m === "xor" || m === "base64" ? v = m : r && (v = "xor");
    const w = r || "ln-ashlar", h = { codec: v, shift: f, key: w };
    if (a && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const b = this.dom.querySelectorAll(".sr-only");
      for (let g = 0; g < b.length; g++)
        b[g].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const o = (this.dom.rel || "").split(/\s+/).filter(function(g) {
        return g && g !== "noopener" && g !== "noreferrer";
      });
      o.length > 0 ? this.dom.rel = o.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let b = 0; b < this._originalTextNodes.length; b++) {
        const o = this._originalTextNodes[b];
        o.node && o.raw && o.raw.length > 0 && (o.node.nodeValue = ve(o.raw, h));
      }
    if (a && this._originalHref) {
      const b = ve(this._originalHref, h);
      this.dom.setAttribute("href", b);
    }
    k(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: v,
      shift: f,
      key: v === "xor" ? w : null
    });
  }, u.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let a = 0; a < this._originalTextNodes.length; a++) {
          const l = this._originalTextNodes[a];
          l.node && l.raw && (l.node.nodeValue = l.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const p = H(t, e, u, "ln-obfuscator", {
    attributes: d
  });
  p.obfuscate = Er, p.deobfuscate = ve, p.utf8ToBase64 = ui, p.base64ToUtf8 = fi, p.xorObfuscate = pi, p.xorDeobfuscate = mi;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(l) {
    return l.hostname && l.hostname !== window.location.hostname;
  }
  function i(l) {
    if (l.getAttribute("data-ln-external-link") === "processed" || !e(l)) return;
    l.target = "_blank";
    const s = (l.rel || "").split(/\s+/).filter(Boolean);
    s.includes("noopener") || s.push("noopener"), s.includes("noreferrer") || s.push("noreferrer"), l.rel = s.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", l.appendChild(n), l.setAttribute("data-ln-external-link", "processed"), k(l, "ln-external-links:processed", {
      link: l,
      href: l.href
    });
  }
  function d(l) {
    l = l || document.body;
    for (const s of l.querySelectorAll("a, area"))
      i(s);
  }
  function u() {
    ct(function() {
      document.body.addEventListener("click", function(l) {
        const s = l.target.closest("a, area");
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
        onInit: function(l) {
          if (l.matches && (l.matches("a") || l.matches("area")) && i(l), l.querySelectorAll)
            for (const s of l.querySelectorAll("a, area"))
              i(s);
        }
      }), Nt(["href"], function(l) {
        l.matches && (l.matches("a") || l.matches("area")) && i(l);
      });
    }, "ln-external-links");
  }
  function a() {
    u(), p(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      d();
    }) : d();
  }
  window[t] = {
    process: d
  }, a();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function d() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function u(o) {
    i && (i.textContent = o, i.classList.add("ln-link-status--visible"));
  }
  function p() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function a(o, g) {
    if (g.target.closest("a, button, input, select, textarea")) return;
    const _ = o.querySelector("a");
    if (!_) return;
    const c = _.getAttribute("href");
    if (!c) return;
    if (g.ctrlKey || g.metaKey || g.button === 1) {
      window.open(c, "_blank", "noopener,noreferrer");
      return;
    }
    Q(o, "ln-link:navigate", { target: o, href: c, link: _ }).defaultPrevented || _.click();
  }
  function l(o) {
    const g = o.querySelector("a");
    if (!g) return;
    const _ = g.getAttribute("href");
    _ && u(_);
  }
  function s() {
    p();
  }
  function n(o) {
    o[e + "Row"] || !o.querySelector("a") || (o[e + "Row"] = !0, o._lnLinkClick = function(_) {
      a(o, _);
    }, o._lnLinkEnter = function() {
      l(o);
    }, o.addEventListener("click", o._lnLinkClick), o.addEventListener("mouseenter", o._lnLinkEnter), o.addEventListener("mouseleave", s));
  }
  function f(o) {
    o[e + "Row"] && (o._lnLinkClick && o.removeEventListener("click", o._lnLinkClick), o._lnLinkEnter && o.removeEventListener("mouseenter", o._lnLinkEnter), o.removeEventListener("mouseleave", s), delete o._lnLinkClick, delete o._lnLinkEnter, delete o[e + "Row"]);
  }
  function m(o) {
    if (!o[e + "Init"]) return;
    const g = o.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const _ = g === "TABLE" && o.querySelector("tbody") || o;
      for (const c of _.querySelectorAll("tr"))
        f(c);
    } else
      f(o);
    delete o[e + "Init"];
  }
  function r(o) {
    if (o[e + "Init"]) return;
    o[e + "Init"] = !0;
    const g = o.tagName;
    if (g === "TABLE" || g === "TBODY") {
      const _ = g === "TABLE" && o.querySelector("tbody") || o;
      for (const c of _.querySelectorAll("tr"))
        n(c);
    } else
      n(o);
  }
  function v(o) {
    o.hasAttribute && o.hasAttribute(t) && r(o);
    const g = o.querySelectorAll ? o.querySelectorAll("[" + t + "]") : [];
    for (const _ of g)
      r(_);
  }
  function w() {
    ct(function() {
      te({
        query: "[" + t + "]",
        onInit: function(o) {
          v(o);
        },
        onSubtreeChange: function(o, g) {
          for (let _ = 0; _ < g.addedNodes.length; _++) {
            const c = g.addedNodes[_];
            if (c.nodeType === 1) {
              if (c.tagName === "TR")
                n(c);
              else if (c.querySelectorAll) {
                const y = c.querySelectorAll("tr");
                for (let E = 0; E < y.length; E++)
                  n(y[E]);
              }
            }
          }
        }
      }), Nt([t], function(o) {
        o.hasAttribute && o.hasAttribute(t) ? v(o) : m(o);
      });
    }, "ln-link");
  }
  function h(o) {
    v(o);
  }
  window[e] = { init: h, destroy: m };
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
    let p = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (p || (p = (this.dom.getAttribute("href") || "").trim()), !p || p === "#")
      return;
    !p.startsWith("#") && !p.startsWith(".") && !p.startsWith("[") && (p = "#" + p);
    let a = null;
    try {
      a = document.querySelector(p);
    } catch {
      const w = p.replace(/^#/, "");
      a = document.getElementById(w);
    }
    if (!a) return;
    u.preventDefault();
    const l = this.dom.getAttribute("data-ln-scroll-set");
    if (l) {
      const v = l.indexOf(":");
      if (v !== -1) {
        const w = l.slice(0, v).trim(), h = l.slice(v + 1).trim();
        try {
          const b = document.querySelector(w);
          b && (b.value = h, b.dispatchEvent(new Event("input", { bubbles: !0 })), b.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (Q(this.dom, "ln-scroll:before-scroll", {
      target: a,
      link: this.dom,
      href: p
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", f = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (a.scrollIntoView({ behavior: n, block: f }), It(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", p);
      } catch {
      }
    const r = this.dom.getAttribute("data-ln-scroll-focus");
    if (r !== "false" && r !== "0") {
      const v = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), w = isNaN(v) ? 450 : v;
      window.setTimeout(function() {
        let h = null;
        if (r && r !== "true" && r !== "1")
          try {
            h = document.querySelector(r);
          } catch {
          }
        h || (h = a.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !h && a.getAttribute("tabindex") !== null && (h = a), h && typeof h.focus == "function" && h.focus({ preventScroll: !0 });
      }, w);
    }
    k(this.dom, "ln-scroll:scrolled", {
      target: a,
      link: this.dom,
      href: p
    });
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, H(t, e, d, "ln-scroll", {
    attributes: i
  });
})();
const Vt = ["Ctrl", "Alt", "Shift", "Meta"], Ar = {
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
function _i(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = Ar[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function bi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), d = /* @__PURE__ */ new Set();
  let u = "";
  for (let a = 0; a < i.length; a++) {
    const l = _i(i[a]);
    if (!l) return "";
    if (Vt.indexOf(l) !== -1) {
      d.add(l);
      continue;
    }
    if (u) return "";
    u = l;
  }
  if (!u) return "";
  const p = [];
  for (let a = 0; a < Vt.length; a++)
    d.has(Vt[a]) && p.push(Vt[a]);
  return p.push(u), p.join("+");
}
function Sr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), d = [];
  for (let u = 0; u < i.length; u++) {
    const p = bi(i[u]);
    p && d.indexOf(p) === -1 && d.push(p);
  }
  return d;
}
function Cr(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const d = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(d) ? "" : bi(d ? d + "+" + i : i);
}
function Tr(t) {
  if (!t) return "";
  const e = _i(t.key);
  if (!e || Vt.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function kr(t) {
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
function Lr(t, e, i, d) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const u = String(e.tagName || "").toLowerCase();
  return u === "button" ? d === "Enter" || d === "Space" : u === "a" && e.hasAttribute && e.hasAttribute("href") && d === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", d = "data-ln-key-allow-input", u = "data-ln-key-modifier", p = "data-ln-key-for", a = "lnKeyFor";
  if (window[e] !== void 0) return;
  function l(g) {
    const _ = g[e];
    if (_) {
      if (!g.hasAttribute(t)) {
        _.destroy();
        return;
      }
      _.sync();
    }
  }
  function s(g) {
    const _ = g[a];
    _ && !g.hasAttribute(p) && _.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: l, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: l, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: l, description: "Permits shortcut execution even when focused inside an editable input" }
  }, f = {
    "data-ln-key-for": { type: "string", effect: s, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, m = /* @__PURE__ */ new Set();
  let r = null;
  function v() {
    r || (r = function(g) {
      if (g.defaultPrevented || g.isComposing || g.repeat) return;
      const _ = Tr(g);
      if (!_) return;
      const c = Pi(g.target), y = document.querySelectorAll("[" + t + "], [" + p + "]");
      let E = null, A = !1, S = !1;
      for (let I = 0; I < y.length; I++) {
        const q = y[I], D = q[e] || q[a];
        if (!D || !D.matches(_) || c && !D.allowsInput()) continue;
        const O = D.resolveTarget(), F = kr(O);
        if (!(!F || !Hi(O, F))) {
          if (Lr(g, O, F, _)) {
            S = !0;
            continue;
          }
          E ? A = !0 : E = { host: q, target: O, action: F };
        }
      }
      if (S || !E) return;
      A && console.warn('[ln-key] Duplicate active shortcut "' + _ + '"; first DOM match wins.');
      const C = {
        source: E.host,
        target: E.target,
        action: E.action,
        key: _,
        event: g
      };
      Q(E.host, "ln-key:before-trigger", C).defaultPrevented || (g.preventDefault(), E.target[E.action](), k(E.host, "ln-key:trigger", C));
    }, document.addEventListener("keydown", r));
  }
  function w() {
    m.size > 0 || !r || (document.removeEventListener("keydown", r), r = null);
  }
  function h(g) {
    return this.dom = g, this.shortcuts = [], m.add(this), this.sync(), v(), this;
  }
  h.prototype.sync = function() {
    this.shortcuts = Sr(this.dom.getAttribute(t));
  }, h.prototype.matches = function(g) {
    return this.shortcuts.indexOf(g) !== -1;
  }, h.prototype.allowsInput = function() {
    return this.dom.hasAttribute(d);
  }, h.prototype.resolveTarget = function() {
    const g = this.dom.getAttribute(i);
    return g ? o(g, i) : this.dom;
  }, h.prototype.destroy = function() {
    this.dom[e] && (m.delete(this), delete this.dom[e], w());
  };
  function b(g) {
    return this.dom = g, m.add(this), v(), this;
  }
  b.prototype._modifierContext = function() {
    return this.dom.closest("[" + u + "]");
  }, b.prototype.shortcut = function() {
    const g = this._modifierContext(), _ = g ? g.getAttribute(u) : "";
    return Cr(_, this.dom.textContent);
  }, b.prototype.matches = function(g) {
    return this.shortcut() === g;
  }, b.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(d)) return !0;
    const g = this._modifierContext();
    return !!(g && g.hasAttribute(d));
  }, b.prototype.resolveTarget = function() {
    return o(this.dom.getAttribute(p), p);
  }, b.prototype.destroy = function() {
    this.dom[a] && (m.delete(this), delete this.dom[a], w());
  };
  function o(g, _) {
    if (!g) return null;
    try {
      const c = document.querySelector(g);
      return c || console.warn("[ln-key] Target not found for " + _ + ' selector "' + g + '".'), c;
    } catch {
      return console.warn("[ln-key] Invalid " + _ + ' selector "' + g + '".'), null;
    }
  }
  H(t, e, h, "ln-key", {
    attributes: n
  }), H(p, a, b, "ln-key-for", {
    attributes: f
  });
})();
function xr(t, e, i = 100) {
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
  function i(a) {
    const l = a[e];
    l && p.call(l);
  }
  const d = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function u(a) {
    return this.dom = a, this._parentObserver = null, p.call(this), this;
  }
  u.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function p() {
    const a = this.dom.getAttribute("data-ln-progress"), l = this.dom.parentElement, s = l ? l.getAttribute("data-ln-progress-max") : null, n = this.dom.getAttribute("data-ln-progress-max"), f = xr(n, s, 100), m = jn(a, f);
    this.dom.style.width = m.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(m.min)), this.dom.setAttribute("aria-valuemax", String(m.max)), this.dom.setAttribute("aria-valuenow", String(m.clampedValue)), k(this.dom, "ln-progress:change", {
      target: this.dom,
      value: m.value,
      max: m.max,
      percentage: m.percentage
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
  ), Nt(["data-ln-progress-max"], function(a) {
    const l = a.querySelectorAll ? a.querySelectorAll(t) : [];
    for (let s = 0; s < l.length; s++) {
      const n = l[s][e];
      n && p.call(n);
    }
  });
})();
function Ir(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function qr(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const d = Object.keys(e);
  if (d.length === 0) return !0;
  for (let u = 0; u < d.length; u++) {
    const p = e[d[u]];
    let a = "";
    if (p.col !== null && p.col !== void 0 ? a = t[p.col] || "" : p.attr && i && typeof i.getAttribute == "function" && (a = i.getAttribute(p.attr) || ""), !Ke(a, p.values))
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
      const p = e.closest("th");
      if (p && typeof p.cellIndex == "number")
        return p.cellIndex;
      const a = e.closest("[data-ln-popover], [id]");
      if (a && a.id) {
        const l = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (l && typeof l.querySelector == "function") {
          const s = l.querySelector('[data-ln-popover-for="' + a.id + '"]');
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
    const u = t.querySelectorAll("thead th, tr:first-child th"), p = String(i).trim().toLowerCase();
    for (let a = 0; a < u.length; a++) {
      const l = u[a], s = l.getAttribute("data-ln-table-filter-col") || l.getAttribute("data-ln-filter-col") || l.getAttribute("data-ln-filter-key") || l.getAttribute("data-ln-table-col") || l.getAttribute("data-ln-col") || l.getAttribute("data-ln-field");
      if (s && s.trim().toLowerCase() === p)
        return typeof l.cellIndex == "number" ? l.cellIndex : a;
    }
    if (e) {
      const a = e.closest ? e.closest("[data-ln-popover], [id]") : null, l = a && a.id || e.id || null;
      if (l)
        for (let s = 0; s < u.length; s++) {
          const n = u[s];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + l + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : s;
        }
    }
    for (let a = 0; a < u.length; a++) {
      const l = u[a], n = Array.from(l.childNodes || []).filter((m) => m.nodeType === 3), f = (n.length > 0 ? n.map((m) => m.textContent.trim()).join(" ") : l.textContent || "").trim().toLowerCase();
      if (f && f === p)
        return typeof l.cellIndex == "number" ? l.cellIndex : a;
    }
  }
  return null;
}
function Dr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let d = 0; d < t.length; d++) {
    const u = t[d];
    !e && u.key && (e = u.key), u.checked && !u.isReset && u.value && i.push(u.value);
  }
  return { key: e, values: i };
}
function Rr(t) {
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
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", d = "data-ln-filter-value", u = "data-ln-filter-hide", p = "data-ln-filter-reset", a = "data-ln-filter-col", l = "data-ln-hash", s = "data-ln-filter-values", n = "data-ln-filter-target", f = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-filter": { prop: "targetId", type: "string", read: K, fallback: null, effect: _, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: _, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: _, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-filter-target": { type: "marker", description: "Marker on target container or table observed by ln-filter" }
  }, r = Y(m);
  function v(c) {
    return c.hasAttribute(p) || !c.getAttribute(d);
  }
  function w(c) {
    const y = c.dom.querySelectorAll("[" + i + "]"), E = [];
    for (let S = 0; S < y.length; S++) {
      const C = y[S];
      E.push({
        key: C.getAttribute(i),
        value: C.getAttribute(d) || "",
        checked: C.checked,
        isReset: v(C)
      });
    }
    const A = Dr(E);
    return { key: A.key, values: A.values, targetId: c.targetId };
  }
  function h(c, y, E) {
    const A = c.querySelectorAll("[" + i + "]"), S = Array.isArray(E) && E.length > 0;
    for (let C = 0; C < A.length; C++) {
      const L = A[C];
      v(L) ? L.checked = !S : S && L.getAttribute(i) === y && E.indexOf(L.getAttribute(d)) !== -1 ? L.checked = !0 : L.checked = !1;
    }
  }
  function b(c) {
    this.dom = c, X(this, c, r);
    const y = c.getAttribute(a);
    this.colIndex = y !== null ? parseInt(y, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = St(c, "filter"), this.hashEnabled = !!this.nsKey;
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
      q && q.key && q.values.length > 0 && (h(c, q.key, q.values), mt(function() {
        E._destroyed || E._render();
      }), L = !0);
    }
    if (!L) {
      const I = un(c.getAttribute(s));
      if (I.length > 0) {
        const q = c.querySelector("[" + i + "]"), D = q ? q.getAttribute(i) : null;
        D && (h(c, D, I), mt(function() {
          E._destroyed || E._render();
        }), L = !0);
      }
    }
    if (!L) {
      const I = c.querySelectorAll("[" + i + "]");
      for (let q = 0; q < I.length; q++)
        if (I[q].checked && !v(I[q])) {
          mt(function() {
            E._destroyed || E._render();
          });
          break;
        }
    }
    return this;
  }
  b.prototype._attachHandlers = function() {
    const c = this;
    this._onDomChange = function(y) {
      const E = y.target;
      if (!E || !E.hasAttribute || !E.hasAttribute(i)) return;
      const A = Array.from(c.dom.querySelectorAll("[" + i + "]"));
      if (v(E)) {
        for (let S = 0; S < A.length; S++)
          v(A[S]) || (A[S].checked = !1);
        E.checked = !0, c._queueRender();
        return;
      }
      if (E.checked) {
        for (let C = 0; C < A.length; C++)
          v(A[C]) && (A[C].checked = !1);
        let S = !1;
        for (let C = 0; C < A.length; C++)
          if (v(A[C])) {
            S = !0;
            break;
          }
        if (S) {
          let C = !0;
          for (let L = 0; L < A.length; L++)
            if (!v(A[L]) && !A[L].checked) {
              C = !1;
              break;
            }
          if (C)
            for (let L = 0; L < A.length; L++)
              v(A[L]) ? A[L].checked = !0 : A[L].checked = !1;
        }
      } else {
        let S = !1;
        for (let C = 0; C < A.length; C++)
          if (!v(A[C]) && A[C].checked) {
            S = !0;
            break;
          }
        if (!S)
          for (let C = 0; C < A.length; C++)
            v(A[C]) && (A[C].checked = !0);
      }
      c._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, b.prototype._render = function() {
    const c = this, y = w(this), E = this._lastSnapshot;
    if (!(!E || E.key !== y.key || Ir(E.values, y.values))) return;
    y.key === null || y.values.length;
    const S = document.getElementById(c.targetId), C = {
      key: y.key,
      values: y.values.slice(),
      targetId: c.targetId
    };
    k(c.dom, "ln-filter:change", C);
    let L = !1;
    S && S !== c.dom && Q(S, "ln-filter:change", C).defaultPrevented && (L = !0);
    const I = E && E.values.length > 0, q = y.values.length === 0;
    if (I && q) {
      const O = { targetId: c.targetId };
      k(c.dom, "ln-filter:reset", O), S && S !== c.dom && k(S, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: y.key, values: y.values.slice() };
    const D = Rr(y.values);
    if (D ? this.dom.setAttribute(s, D) : this.dom.removeAttribute(s), this.hashEnabled) {
      const O = zn(y.key, y.values);
      gt(this.nsKey, O);
    }
    L || c._applyDomFilter(S);
  }, b.prototype._applyDomFilter = function(c) {
    const y = c || document.getElementById(this.targetId);
    if (!y) return;
    const E = w(this), A = E.key === null || E.values.length === 0, S = y.tagName === "TABLE" ? y : y.querySelector ? y.querySelector("table") : null;
    if (S)
      this._filterTableRows(E, S);
    else {
      const C = y.children;
      for (let L = 0; L < C.length; L++) {
        const I = C[L], q = A ? null : I.getAttribute("data-" + E.key), D = !A && q !== null && !Ke(q, E.values), O = I.hasAttribute(u);
        D && !O ? I.setAttribute(u, "true") : !D && O && I.removeAttribute(u);
      }
    }
  };
  function o(c) {
    if (!c) return "";
    const y = c.querySelector ? c.querySelector("[data-ln-value]") : null;
    return At(y || c);
  }
  function g(c) {
    return !!(!c || typeof c != "object" || c.tagName === "TEMPLATE" || typeof c.hasAttribute == "function" && (c.hasAttribute("data-ln-sort-exclude") || c.hasAttribute("hidden")) || c.classList && c.classList.contains("hidden") || c.style && c.style.display === "none" || typeof c.matches == "function" && c.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof c.querySelector == "function" && c.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  b.prototype._filterTableRows = function(c, y) {
    if (!y) {
      const I = document.getElementById(this.targetId);
      if (!I || (y = I.tagName === "TABLE" ? I : I.querySelector ? I.querySelector("table") : null, !y)) return;
    }
    const E = dn(y, this.dom, c.key, this.colIndex), A = c.key || this.dom.getAttribute("data-ln-filter-key") || (E !== null ? "col" + E : "attr-filter"), S = c.values;
    f.has(y) || f.set(y, {});
    const C = f.get(y);
    A && S.length > 0 ? C[A] = {
      col: E,
      values: S.slice(),
      attr: "data-" + A
    } : A && delete C[A];
    const L = y.tBodies;
    for (let I = 0; I < L.length; I++) {
      const q = L[I].rows;
      for (let D = 0; D < q.length; D++) {
        const O = q[D];
        if (g(O)) continue;
        const F = {};
        for (let G = 0; G < O.cells.length; G++)
          F[G] = o(O.cells[G]);
        const U = !qr(F, C, O), j = O.hasAttribute(u);
        U && !j ? O.setAttribute(u, "true") : !U && j && O.removeAttribute(u);
      }
    }
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const c = document.getElementById(this.targetId);
    if (c) {
      const y = c.tagName === "TABLE" ? c : c.querySelector ? c.querySelector("table") : null;
      if (y && f.has(y)) {
        const E = f.get(y), A = dn(y, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), S = this.dom.getAttribute("data-ln-filter-key") || (A !== null ? "col" + A : this.colIndex !== null ? "col" + this.colIndex : null);
        S && E[S] && (delete E[S], this._filterTableRows({ key: null, values: [] }, y)), Object.keys(E).length === 0 && f.delete(y);
      }
      this.targetId && document.querySelectorAll("[" + t + '="' + this.targetId + '"]').length <= 1 && c.removeAttribute(n);
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function _(c, y) {
    const E = c[e];
    if (!(!E || E._destroyed))
      if (y === l)
        E.hashEnabled && E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = St(c, "filter"), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      else if (y === s) {
        const A = un(c.getAttribute(s)), S = c.querySelector("[" + i + "]"), C = S ? S.getAttribute(i) : null;
        C && (h(c, C, A), E._render());
      } else y === t && (E.targetId = c.getAttribute(t) || null, E._ensureTargetMarked(), E._render());
  }
  H(t, e, b, "ln-filter", {
    attributes: m,
    subtreeQuery: "[" + t + "], [" + n + "]",
    onSubtreeChange: function(c, y) {
      if (y.addedNodes.length === 0 && y.removedNodes.length === 0) return;
      let E = null, A = null;
      if (c.hasAttribute(n) ? (A = c, E = c.getAttribute(n) || c.id) : c.hasAttribute(t) && (E = c.getAttribute(t), A = E ? document.getElementById(E) : null), !E || !A) return;
      const S = document.querySelectorAll("[" + t + '="' + E + '"]');
      for (let C = 0; C < S.length; C++) {
        const L = S[C][e];
        L && !L._destroyed && w(L).values.length > 0 && L._queueDomFilter();
      }
    },
    persist: {
      attr: s,
      hashActive: function(c) {
        return !!St(c, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", d = "lnSearchControl", u = "data-ln-search-items", p = "data-ln-search-fields", a = "data-ln-search-exclude", l = "data-ln-search-hide", s = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: _, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: _, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, f = Y(n);
  function m(c) {
    const y = St(c, "search");
    if (y) return y;
    if (c.id) {
      const E = document.querySelector("[" + i + '="' + c.id + '"]');
      if (E) {
        const A = St(E, "search");
        if (A) return A;
      }
    }
    return null;
  }
  function r(c) {
    return c.matches("input, textarea") ? c : c.querySelector("input, textarea");
  }
  function v(c, y) {
    const E = c.childNodes;
    for (let A = 0; A < E.length; A++) {
      const S = E[A];
      if (S.nodeType === 3) {
        y.push(S.nodeValue);
        continue;
      }
      S.nodeType === 1 && (S.hasAttribute(a) || v(S, y));
    }
  }
  function w(c) {
    if (c._lnSearchText !== void 0) return c._lnSearchText;
    const y = [];
    v(c, y);
    const E = ir(y);
    return c._lnSearchText = E, E;
  }
  function h(c, y) {
    if (!c.id) return;
    const E = document.querySelectorAll("[" + i + '="' + c.id + '"]');
    for (const A of E) {
      const S = r(A);
      S && S.value !== y && (S.value = y);
    }
  }
  function b(c) {
    this.dom = c, this.term = c.getAttribute(t) || "", this._destroyed = !1;
    const y = this;
    return this.nsKey = m(c), this.hashEnabled = !!this.nsKey, this._queueApply = Ht(function() {
      y._destroyed || y._apply();
    }), this._onHashChange = function() {
      if (y._destroyed || !y.hashEnabled) return;
      const E = st(y.nsKey), A = y.dom.getAttribute(t) || "";
      E !== null && E !== A ? y.dom.setAttribute(t, E) : E === null && A !== "" && y.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!y._destroyed) {
        if (y.hashEnabled) {
          const E = st(y.nsKey);
          if (E !== null && E !== y.term) {
            y.term = E, y.dom.setAttribute(t, E), h(y.dom, E), y._apply();
            return;
          }
        }
        se(y.term) && (h(y.dom, y.term), y._apply());
      }
    }), this;
  }
  b.prototype._apply = function() {
    const c = this.dom, y = se(this.term), E = Vn(y);
    this.hashEnabled && gt(this.nsKey, this.term ? this.term : null);
    const A = nr(c.getAttribute(p));
    if (Q(c, "ln-search:change", {
      term: y,
      tokens: E,
      targetId: c.id,
      fields: A
    }).defaultPrevented) return;
    const C = c.getAttribute(u), L = C ? c.querySelectorAll(C) : c.children;
    for (let I = 0; I < L.length; I++) {
      const q = L[I];
      if (q.hasAttribute(a)) {
        q.hasAttribute(l) && q.removeAttribute(l);
        continue;
      }
      const D = E.length > 0 && !Gn(w(q), E), O = q.hasAttribute(l);
      D && !O ? q.setAttribute(l, "true") : !D && O && q.removeAttribute(l);
    }
  }, b.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function o(c) {
    if (this.dom = c, X(this, c, f), this.input = r(c), this._attachHandler(), this.input && this.input.value.trim()) {
      const y = this;
      mt(function() {
        const E = document.getElementById(y.targetId);
        E && ((E.getAttribute(t) || "").trim() || y._write(y.input.value));
      });
    }
    return this;
  }
  o.prototype._write = function(c) {
    const y = document.getElementById(this.targetId);
    y && y.getAttribute(t) !== c && y.setAttribute(t, c);
  }, o.prototype._attachHandler = function() {
    if (!this.input) return;
    const c = this;
    this._onInput = function() {
      c._write(c.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, o.prototype.destroy = function() {
    this.dom[d] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[d]);
  };
  function g(c) {
    const y = c.getAttribute("data-ln-search-clear-for");
    if (y) {
      const L = document.getElementById(y), I = document.querySelector("[" + i + '="' + y + '"]'), q = I ? r(I) : null;
      return { target: L, input: q };
    }
    const E = c.closest("[" + t + "]");
    if (E) {
      const L = E.id ? document.querySelector("[" + i + '="' + E.id + '"]') : null, I = L ? r(L) : null;
      return { target: E, input: I };
    }
    const A = c.closest("[data-ln-table-source], [data-ln-list-source]");
    if (A) {
      const L = A.getAttribute("data-ln-table-source") || A.getAttribute("data-ln-list-source"), I = L ? document.getElementById(L) : null;
      if (I && I.hasAttribute(t)) {
        const q = document.querySelector("[" + i + '="' + L + '"]'), D = q ? r(q) : null;
        return { target: I, input: D };
      }
    }
    const S = c.closest("[" + i + "]");
    if (S) {
      const L = S.getAttribute(i), I = L ? document.getElementById(L) : null, q = r(S);
      return { target: I, input: q };
    }
    const C = c.parentElement;
    if (C) {
      const L = C.querySelector("[" + i + "]");
      if (L) {
        const I = L.getAttribute(i), q = I ? document.getElementById(I) : null, D = r(L);
        return { target: q, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(c) {
    const y = c.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!y) return;
    const E = g(y);
    !E.target && !E.input || (c.preventDefault(), E.input && (E.input.value = "", E.input.focus()), E.target && E.target.setAttribute(t, ""));
  });
  function _(c, y) {
    const E = c[e];
    if (!E || E._destroyed) return;
    if (y === s) {
      E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = m(c), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange);
      return;
    }
    const A = c.getAttribute(t) || "";
    A !== E.term && (E.term = A, h(c, A), E._apply());
  }
  H(t, e, b, "ln-search", {
    attributes: n,
    onSubtreeChange: function(c, y) {
      const E = y.target;
      E && E._lnSearchText !== void 0 && delete E._lnSearchText, E && E.parentElement && E.parentElement._lnSearchText !== void 0 && delete E.parentElement._lnSearchText;
      const A = c[e];
      if (A && !A._destroyed && se(A.term) && (y.addedNodes.length > 0 || y.removedNodes.length > 0)) {
        for (let S = 0; S < y.addedNodes.length; S++) {
          const C = y.addedNodes[S];
          C._lnSearchText !== void 0 && delete C._lnSearchText;
        }
        A._queueApply();
      }
    },
    persist: {
      attr: t,
      hashActive: function(c) {
        return !!m(c);
      }
    }
  }), H(i, d, o, "ln-search-control");
})();
function kt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Or(t) {
  const e = kt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function Nr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Mr(t, e, i, d) {
  const u = kt(t);
  if (u === "none") return () => 0;
  const p = u === "desc" ? -1 : 1, a = typeof d == "function" ? d : (l) => l;
  return function(l, s) {
    const n = a(l), f = a(s);
    return Ue(n, f, e, i) * p;
  };
}
function we(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Fr(t, e) {
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
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", d = "data-ln-sort-state", u = "data-ln-sort-dir", p = "data-ln-hash";
  if (window[e] !== void 0) return;
  function a(v, w) {
    return v.getAttribute(w) || null;
  }
  const l = {
    "data-ln-sort": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: a, effect: r, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: a, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: r, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: r, description: "URL hash routing key for sort state persistence" }
  }, s = Y(l), n = /* @__PURE__ */ new WeakMap();
  function f(v, w, h) {
    if (w) {
      const b = v.querySelector('[data-ln-field="' + w + '"]');
      return b ? At(b) : "";
    }
    return h != null && v.cells && v.cells[h] ? At(v.cells[h]) : At(v);
  }
  function m(v) {
    this.dom = v, X(this, v, s);
    const w = v.closest("th");
    this.column = !this.field && w ? w.cellIndex : null, this._state = kt(v.getAttribute(d)), v.hasAttribute(d) || v.setAttribute(d, this._state), this._destroyed = !1, this.nsKey = St(v, "sort"), this.hashEnabled = !!this.nsKey;
    const h = this;
    this._onClick = function(o) {
      const g = o.target.closest("[" + u + "]");
      if (!g) return;
      const _ = kt(g.getAttribute(u));
      h._apply(_);
    }, v.addEventListener("click", this._onClick), this._onSortChange = function(o) {
      if (h._destroyed || !o.detail) return;
      const g = h._resolveTarget();
      if (!(g && (o.target === g || g.contains(o.target)) || o.detail.targetId && o.detail.targetId === h.targetId)) return;
      if (Nr(
        { field: h.field, column: h.column },
        { field: o.detail.field, column: o.detail.column }
      )) {
        const y = kt(o.detail.direction);
        y && v.getAttribute(d) !== y && (h._state = y, v.setAttribute(d, y), h._updateAriaSort(y));
        return;
      }
      v.getAttribute(d) !== "none" && (h._state = "none", v.setAttribute(d, "none"), h._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (h._destroyed || !h.hashEnabled) return;
      const o = st(h.nsKey), g = Ee(o);
      if (g)
        h.field !== null && g.fieldOrColumn === h.field || h.column !== null && String(h.column) === g.fieldOrColumn ? h._state !== g.direction && h._apply(g.direction, !0) : h._state !== "none" && (h._state = "none", v.setAttribute(d, "none"), h._updateAriaSort("none"));
      else if (h._state !== "none") {
        h._state = "none", v.setAttribute(d, "none"), h._updateAriaSort("none");
        const _ = h._resolveTarget();
        _ && (Q(_, "ln-sort:change", {
          field: h.field,
          column: h.column,
          direction: "none",
          targetId: h.targetId
        }).defaultPrevented || h._defaultSort(_, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let b = !1;
    if (this.hashEnabled) {
      const o = st(this.nsKey), g = Ee(o);
      g && ((h.field !== null && g.fieldOrColumn === h.field || h.column !== null && String(h.column) === g.fieldOrColumn) && mt(function() {
        h._destroyed || h._apply(g.direction, !0);
      }), b = !0);
    }
    if (!b) {
      const o = kt(v.getAttribute(d));
      o && o !== "none" && mt(function() {
        h._destroyed || h._apply(o, !0);
      });
    }
    return this;
  }
  m.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, m.prototype._updateAriaSort = function(v) {
    const w = this.dom.closest("th");
    w && w.setAttribute("aria-sort", Or(v));
  }, m.prototype._apply = function(v, w) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const _ = this.dom.closest("th");
      _ && _.cellIndex !== void 0 && (this.column = _.cellIndex);
    }
    const h = kt(v);
    this._state = h, this.dom.getAttribute(d) !== h && this.dom.setAttribute(d, h), this._updateAriaSort(h);
    const b = this._resolveTarget();
    if (!b) return;
    const o = {
      field: this.field,
      column: this.column,
      direction: h,
      targetId: this.targetId
    };
    if (!w && this.hashEnabled) {
      const _ = Un(this.field !== null ? this.field : this.column, h);
      gt(this.nsKey, _);
    }
    Q(b, "ln-sort:change", o).defaultPrevented || this._defaultSort(b, h);
  }, m.prototype._defaultSort = function(v, w) {
    const h = Fr(v, this.itemsSelector);
    if (!h.length) return;
    const b = h[0].parentNode, o = h.filter(function(y) {
      return !we(y);
    });
    if (!o.length) return;
    n.has(v) || n.set(v, o.slice());
    let g;
    if (w === "none") {
      const y = n.get(v) || o;
      n.delete(v), g = y.filter(function(E) {
        return E.parentNode === b && !we(E);
      });
    } else {
      const y = this.field, E = this.column, A = o.map(function(I) {
        return f(I, y, E);
      }), S = He(A), C = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base", numeric: !0 }) : null, L = Mr(w, S, C, function(I) {
        return f(I, y, E);
      });
      g = o.slice().sort(L);
    }
    const _ = document.createDocumentFragment();
    let c = 0;
    for (let y = 0; y < h.length; y++) {
      const E = h[y];
      we(E) ? _.appendChild(E) : c < g.length && _.appendChild(g[c++]);
    }
    b.appendChild(_);
  }, m.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function r(v, w) {
    const h = v[e];
    if (!(!h || h._destroyed))
      if (w === i) {
        const b = v.closest("th");
        h.column = !h.field && b ? b.cellIndex : null;
      } else if (w === d) {
        const b = kt(v.getAttribute(d));
        b !== h._state && h._apply(b);
      } else w === p && (h.hashEnabled && h._onHashChange && window.removeEventListener("hashchange", h._onHashChange), h.nsKey = St(v, "sort"), h.hashEnabled = !!h.nsKey, h.hashEnabled && window.addEventListener("hashchange", h._onHashChange));
  }
  H(t, e, m, "ln-sort", {
    attributes: l,
    persist: {
      attr: d,
      hashActive: function(v) {
        return !!St(v, "sort");
      }
    }
  });
})();
function fn(t, e, i, d, u = 15) {
  if (d <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const p = Math.max(0, t || 0), a = Math.max(0, e || 0), l = Math.floor(p / i), s = Math.ceil(a / i), n = Math.max(0, l - u), f = Math.min(d, l + s + u), m = n * i, r = Math.max(0, (d - f) * i);
  return { start: n, end: f, topPadding: m, bottomPadding: r };
}
function Br(t, e) {
  const i = Array.isArray(t) ? t.length : 0, d = e instanceof Set ? e : new Set(e || []);
  let u = 0;
  if (Array.isArray(t))
    for (let l = 0; l < t.length; l++)
      d.has(t[l]) && u++;
  else
    u = d.size;
  const p = i > 0 && u === i, a = u > 0 && u < i;
  return { totalCount: i, selectedCount: u, isAllSelected: p, isIndeterminate: a };
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
  function s(o, g) {
    if (!o || !o.isDataDriven) return;
    const _ = o.dom.hasAttribute("data-ln-table-window");
    if (_ && !o._windowed)
      o._enterWindowedMode(), o._kickWindowInitial();
    else if (!_ && o._windowed)
      o._exitWindowedMode();
    else if (_ && o._windowed) {
      const c = parseInt(g, 10);
      c > 0 && o._cache.configure({ windowSize: c });
    }
  }
  function n(o, g) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const _ = parseInt(g, 10);
    _ > 0 && o._cache.configure({ pageSize: _ });
  }
  function f(o, g) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const _ = parseInt(g, 10);
    _ >= 0 && o._cache.configure({ threshold: _ });
  }
  function m(o, g) {
    if (!o || !o.isDataDriven || !o._windowed || !o._cache) return;
    const _ = parseInt(g, 10);
    _ >= 0 && o._cache.setGrandTotal(_);
  }
  const r = {
    "data-ln-table": { prop: "name", type: "string", read: K, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: f, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: m, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, v = Y(r);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function w(o, g) {
    if (o == null || isNaN(o)) return "";
    try {
      return new Intl.NumberFormat(J(g)).format(o);
    } catch {
      return String(o);
    }
  }
  function h(o) {
    let g = o.parentElement;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const c = getComputedStyle(g).overflowY;
      if (c === "auto" || c === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function b(o) {
    this.dom = o, X(this, o, v), this.table = o.querySelector("table"), this.tbody = o.querySelector("[data-ln-table-body]") || o.querySelector("tbody"), this.thead = o.querySelector("thead");
    const g = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = g ? Array.from(g.querySelectorAll("th")) : [], this._totalSpan = o.querySelector("[data-ln-table-total]"), this._filteredSpan = o.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== o ? this._filteredSpan.parentElement : null), this._selectedSpan = o.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== o ? this._selectedSpan.parentElement : null), this.isDataDriven = o.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const _ = this;
    return this._onSetSearch = function(c) {
      const y = (c.detail && c.detail.query != null ? c.detail.query : c.detail && c.detail.term != null ? c.detail.term : "").trim();
      _.isDataDriven ? (_.currentSearch = y, k(o, "ln-table:search", {
        table: _.name,
        query: _.currentSearch
      }), _._requestData()) : (_._searchTerm = y.toLowerCase(), _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(o, "ln-table:filter", {
        term: _._searchTerm,
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, o.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(c) {
      c.preventDefault(), _._onSetSearch(c);
    }, o.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      _.isDataDriven ? (_.currentFilters = {}, _.currentSearch = "", k(o, "ln-table:clear-filters", { table: _.name }), _._requestData()) : (_._searchTerm = "", _._columnFilters = {}, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(o, "ln-table:filter", {
        term: "",
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, o.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && o.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(c) {
      const y = c.detail || {}, E = y.data || [], A = y.total != null ? y.total : E.length;
      if (!(_._hasInitialSeed && !_.isLoaded && E.length === 0 && A === 0)) {
        if (_._windowed) {
          _._cache.ingest(y) && !y.provisional && o.classList.remove("ln-table--loading");
          return;
        }
        _._data = E, _._lastTotal = A, _._lastFiltered = y.filtered != null ? y.filtered : _._data.length, _.totalCount = _._lastTotal, _.visibleCount = _._lastFiltered, _.isLoaded = !0, _._hasInitialSeed = !1, o.classList.remove("ln-table--loading"), _._vStart = -1, _._vEnd = -1, _._applyFilterAndSort(), _._render(), _._updateFooter(), k(o, "ln-table:rendered", {
          table: _.name,
          total: _.totalCount,
          visible: _.visibleCount
        });
      }
    }, o.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
      const y = c.detail && c.detail.loading;
      o.classList.toggle("ln-table--loading", !!y), y && (_.isLoaded = !1);
    }, o.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(c) {
      !_._windowed || !_._cache || _._cache.release(c.detail && c.detail.offset);
    }, o.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !_._windowed || !_._cache || _._cache.revalidate();
    }, o.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !_._windowed || !_._cache || _._requestData();
    }, o.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(c) {
      !c.detail || c.detail.field == null || (c.preventDefault(), _.currentSort = c.detail.direction === "none" ? null : { field: c.detail.field, direction: c.detail.direction }, _._requestData());
    }, o.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(c) {
      if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
      const y = c.target.closest("[data-ln-table-row]");
      if (!y) return;
      const E = y.getAttribute("data-ln-table-row-id"), A = y._lnRecord || {};
      k(o, "ln-table:row-click", {
        table: _.name,
        id: E,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
      const y = c.target.closest("[data-ln-table-row-action]");
      if (!y) return;
      const E = y.closest("[data-ln-table-row]");
      if (!E) return;
      const A = y.getAttribute("data-ln-table-row-action"), S = E.getAttribute("data-ln-table-row-id"), C = E._lnRecord || {};
      k(o, "ln-table:row-action", {
        table: _.name,
        id: S,
        action: A,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : k(o, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      _.tbody.rows.length > 0 && (_._emptyTbodyObserver.disconnect(), _._emptyTbodyObserver = null, _._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(c) {
      if (!c.detail || c.detail.column == null) return;
      c.preventDefault();
      const y = c.detail.direction === "none" ? null : c.detail.direction;
      _._sortCol = y === null ? -1 : c.detail.column, _._sortDir = y, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), k(o, "ln-table:sorted", {
        column: c.detail.column,
        direction: c.detail.direction,
        matched: _._filteredData.length,
        total: _._data.length
      });
    }, o.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(c) {
      if (c.preventDefault(), !c.detail) return;
      const y = c.detail.key, E = c.detail.values || [];
      if (y) {
        if (E.length === 0)
          delete _._columnFilters[y];
        else {
          const A = [];
          for (let S = 0; S < E.length; S++)
            A.push(E[S].toLowerCase());
          _._columnFilters[y] = A;
        }
        _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(o, "ln-table:filter", {
          term: _._searchTerm,
          matched: _._filteredData.length,
          total: _._data.length
        });
      }
    }, o.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  b.prototype._parseRows = function() {
    const o = this.tbody.rows, g = this.ths;
    this._data = [], o.length > 0 && (this._rowHeight = o[0].offsetHeight || 40), this._lockColumnWidths();
    for (let _ = 0; _ < o.length; _++) {
      const c = o[_], y = [], E = [], A = [];
      for (let C = 0; C < c.cells.length; C++) {
        const L = c.cells[C], I = L.textContent.trim();
        y[C] = At(L), E[C] = I.toLowerCase(), L.querySelector("[data-ln-table-row-action]") || A.push(I.toLowerCase());
      }
      let S = null;
      if (this.isDataDriven) {
        S = {};
        const C = c.getAttribute("data-ln-table-row-id");
        C != null && (S.id = C);
        for (let L = 0; L < g.length; L++) {
          const I = g[L].getAttribute("data-ln-table-col");
          if (I) {
            const q = L;
            if (q < c.cells.length) {
              const D = c.cells[q];
              S[I] = At(D);
            }
          }
        }
      }
      this._data.push({
        values: y,
        rawTexts: E,
        html: c.outerHTML,
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
    this.ths.forEach(function(g) {
      const _ = document.createElement("col");
      _.style.width = g.offsetWidth + "px", o.appendChild(_);
    }), this.table.insertBefore(o, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = o;
  }, b.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const o = this._lastTotal, g = this.visibleCount;
        if (o === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || g === 0) {
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
      const o = this._filteredData, g = document.createDocumentFragment();
      for (let _ = 0; _ < o.length; _++) {
        const c = this._buildRow(o[_]);
        if (!c) break;
        g.appendChild(c);
      }
      this.tbody.replaceChildren(g), this._selectable && this._updateSelectAll();
    } else {
      const o = [], g = this._filteredData;
      for (let _ = 0; _ < g.length; _++) o.push(g[_].html);
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
        let _ = null;
        if (this._windowed) {
          const c = this._cache ? this._cache.peek() : null;
          _ = c ? this._buildRow(c) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (_ = this._buildRow(this._data[0]));
        _ && this.tbody && (this.tbody.appendChild(_), this._rowHeight = _.offsetHeight || 40, _.remove());
      }
    this.isDataDriven ? this._scrollContainer = h(this.dom) : this._scrollContainer = null;
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      o._rafId || (o._rafId = requestAnimationFrame(function() {
        o._rafId = null, o._windowed ? o._renderWindowed() : o._renderVirtual();
      }));
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, b.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, b.prototype._renderVirtual = function() {
    const o = this._filteredData, g = o.length, _ = this._rowHeight;
    if (!_ || !g) return;
    const c = this.thead ? this.thead.offsetHeight : 0, y = this._scrollContainer;
    let E, A;
    if (y) {
      const O = this.table.getBoundingClientRect(), F = y.getBoundingClientRect(), U = O.top - F.top + y.scrollTop + c;
      E = y.scrollTop - U, A = y.clientHeight;
    } else {
      const U = this.table.getBoundingClientRect().top + window.scrollY + c;
      E = window.scrollY - U, A = window.innerHeight;
    }
    const S = fn(E, A, _, g, 15), C = S.start, L = S.end;
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
    const g = document.createElement("td");
    return g.setAttribute("colspan", this.ths.length || 1), g.style.height = this._rowHeight + "px", o.appendChild(g), o;
  }, b.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const o = this._rowHeight;
    if (!o) return;
    const g = this._cache.logicalTotal, _ = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let y, E;
    if (c) {
      const O = this.table.getBoundingClientRect(), F = c.getBoundingClientRect(), U = O.top - F.top + c.scrollTop + _;
      y = c.scrollTop - U, E = c.clientHeight;
    } else {
      const U = this.table.getBoundingClientRect().top + window.scrollY + _;
      y = window.scrollY - U, E = window.innerHeight;
    }
    const A = fn(y, E, o, g, 15), S = A.start, C = A.end, L = this.ths.length || 1, I = A.topPadding, q = A.bottomPadding, D = document.createDocumentFragment();
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
    let g = null, _ = null;
    if (this.isDataDriven) {
      const c = this._lastTotal != null ? this._lastTotal : this._data.length, E = this.visibleCount === 0 && c > 0, A = E ? this.name + "-empty-filtered" : this.name + "-empty";
      if (_ = Lt(this.dom, A, "ln-table"), !_) {
        const S = this.dom.querySelector("template[data-ln-table-empty]");
        if (S) {
          const C = E ? "search" : "initial", L = S.content.querySelector('[data-ln-table-empty-when="' + C + '"]') || S.content.firstElementChild;
          L && (_ = document.importNode(L, !0));
        }
      }
      if (_)
        if (_.tagName === "TR")
          g = _;
        else {
          const S = document.createElement("td");
          S.setAttribute("colspan", String(o)), S.appendChild(_);
          const C = document.createElement("tr");
          C.className = "ln-table__empty", C.appendChild(S), g = C;
        }
    } else {
      const c = this.dom.querySelector("template[" + i + "]"), y = document.createElement("td");
      y.setAttribute("colspan", String(o)), c && y.appendChild(document.importNode(c.content, !0));
      const E = document.createElement("tr");
      E.className = "ln-table__empty", E.appendChild(y), g = E;
    }
    g ? this.tbody.replaceChildren(g) : this.tbody.replaceChildren(), k(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, b.prototype._fillRow = function(o, g) {
    Zt(o, g);
    const _ = o.querySelectorAll("[data-ln-table-cell-attr]");
    for (let c = 0; c < _.length; c++) {
      const y = _[c], E = y.getAttribute("data-ln-table-cell-attr").split(",");
      for (let A = 0; A < E.length; A++) {
        const S = E[A].trim().split(":");
        if (S.length !== 2) continue;
        const C = S[0].trim(), L = S[1].trim();
        g[C] != null && y.setAttribute(L, g[C]);
      }
    }
  }, b.prototype._buildRow = function(o) {
    let g = Lt(this.dom, this.name + "-row", "ln-table");
    if (!g) {
      const c = this.dom.querySelector("template[data-ln-table-row]");
      c && (g = document.importNode(c.content, !0));
    }
    let _ = g ? g.querySelector("[data-ln-table-row]") || g.firstElementChild : null;
    if (_)
      this._fillRow(_, o);
    else if (o && o.html) {
      const c = document.createElement("tbody");
      c.innerHTML = o.html, _ = c.firstElementChild;
    } else {
      _ = document.createElement("tr"), _.setAttribute("data-ln-table-row", "");
      const c = this.ths;
      for (let y = 0; y < c.length; y++) {
        const E = c[y].hasAttribute("data-ln-table-col-select"), A = document.createElement("td");
        if (E) {
          const S = document.createElement("input");
          S.type = "checkbox", S.setAttribute("data-ln-table-row-select", ""), S.setAttribute("aria-label", "Select row"), A.appendChild(S);
        } else {
          const S = c[y].getAttribute("data-ln-table-col");
          S && o[S] != null && (A.textContent = String(o[S]));
        }
        _.appendChild(A);
      }
    }
    if (_._lnRecord = o, o.id != null && _.setAttribute("data-ln-table-row-id", o.id), this._selectable && o.id != null && this.selectedIds.has(String(o.id))) {
      _.classList.add("ln-row-selected");
      const c = _.querySelector("[data-ln-table-row-select]");
      c && (c.checked = !0);
    }
    return _;
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
    const o = this, g = this.dom, _ = parseInt(g.getAttribute("data-ln-table-window"), 10), c = parseInt(g.getAttribute("data-ln-table-window-page"), 10), y = parseInt(g.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !o._windowed || !o._cache || (o.totalCount = o._cache.grandTotal, o.visibleCount = o._cache.logicalTotal, o._lastTotal = o._cache.grandTotal, o.isLoaded = !0, o._vStart = -1, o._vEnd = -1, o._render(), o._updateFooter(), k(g, "ln-table:rendered", {
        table: o.name,
        total: o.totalCount,
        visible: o.visibleCount
      }));
    }, this._renderBatch = Ht(this._onCacheChange), this._cache = Pn({
      windowSize: _ > 0 ? _ : 1e3,
      pageSize: c > 0 ? c : 200,
      threshold: y >= 0 ? y : 25,
      fetchDebounce: 120,
      requestPage: function(E, A, S) {
        k(g, "ln-table:request-data", {
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
        const _ = this._totalSpan.textContent.replace(/[^\d]/g, "");
        _ && (o = parseInt(_, 10));
      }
      const g = o > 0 ? o : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: g,
        filtered: g
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
    const o = this.tbody.querySelectorAll("[data-ln-table-row]"), g = [];
    for (let c = 0; c < o.length; c++) {
      const y = o[c].getAttribute("data-ln-table-row-id");
      y != null && g.push(y);
    }
    const _ = Br(g, this.selectedIds);
    this._selectAllCheckbox.checked = _.isAllSelected, this._selectAllCheckbox.indeterminate = _.isIndeterminate;
  }, b.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const o = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let g = 0; g < o.length; g++) {
      const _ = o[g].getAttribute("data-ln-table-row-id"), c = _ != null && this.selectedIds.has(_);
      o[g].classList.toggle("ln-row-selected", c);
      const y = o[g].querySelector("[data-ln-table-row-select]");
      y && (y.checked = c);
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
    if (this._onSelectionChange = function(g) {
      const _ = g.target.closest("[data-ln-table-row-select]");
      if (!_) return;
      const c = _.closest("[data-ln-table-row]");
      if (!c) return;
      const y = c.getAttribute("data-ln-table-row-id");
      y != null && (o.selectedIds = hn(o.selectedIds, y, _.checked), c.classList.toggle("ln-row-selected", _.checked), o.selectedCount = o.selectedIds.size, o._updateSelectAll(), o._updateFooter(), k(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const g = document.createElement("input");
      g.type = "checkbox";
      const _ = o.dom.querySelector('[data-ln-table-dict="select-all"]'), c = o.dom.getAttribute("data-ln-table-select-all-label") || (_ ? _.textContent.trim() : null) || "Select all";
      g.setAttribute("aria-label", c), this._selectAllCheckbox.appendChild(g), this._selectAllCheckbox = g;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = o._selectAllCheckbox.checked, _ = o.tbody ? o.tbody.querySelectorAll("[data-ln-table-row]") : [], c = [];
      for (let y = 0; y < _.length; y++) {
        const E = _[y].getAttribute("data-ln-table-row-id"), A = _[y].querySelector("[data-ln-table-row-select]");
        E != null && (c.push(E), _[y].classList.toggle("ln-row-selected", g), A && (A.checked = g));
      }
      o.selectedIds = pn(o.selectedIds, c, g), o.selectedCount = o.selectedIds.size, k(o.dom, "ln-table:select-all", {
        table: o.name,
        selected: g
      }), k(o.dom, "ln-table:select", {
        table: o.name,
        selectedIds: o.selectedIds,
        count: o.selectedCount
      }), o._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let _ = 0; _ < g.length; _++) {
        const c = g[_].querySelector("[data-ln-table-row-select]"), y = g[_].getAttribute("data-ln-table-row-id");
        c && c.checked && y != null && (o.selectedIds = hn(o.selectedIds, y, !0), g[_].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, b.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const o = this.dom.querySelector("[data-ln-table-col-select]");
    if (o) {
      const g = o.querySelector('input[type="checkbox"]');
      g && g.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = pn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const g = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let _ = 0; _ < g.length; _++) {
        g[_].classList.remove("ln-row-selected");
        const c = g[_].querySelector("[data-ln-table-row-select]");
        c && (c.checked = !1);
      }
    }
    this._updateFooter();
  }, b.prototype._updateFooter = function() {
    let o = 0, g = 0;
    this.isDataDriven ? (o = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (o = this._data.length, g = this._filteredData.length);
    const _ = g < o;
    if (this._totalSpan && (this._totalSpan.textContent = w(o, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = _ ? w(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !_), this._selectedSpan) {
      const c = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = c > 0 ? w(c, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", c === 0);
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
  document.addEventListener("keydown", function(l) {
    if (l.key !== "/" || l.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const s = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!s) return;
    const n = s.tagName === "INPUT" || s.tagName === "TEXTAREA" ? s : s.querySelector('input[type="search"], input[type="text"], input');
    n && (l.preventDefault(), n.focus());
  });
  function d(l) {
    return this.dom = l, a(this), this;
  }
  function u(l, s) {
    const n = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", f = l.querySelector(n) || document.querySelector(n);
    return f ? f.tagName === "INPUT" || f.tagName === "TEXTAREA" ? f : f.querySelector("input, textarea") : null;
  }
  function p(l, s) {
    if (s) {
      const f = l.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (f.length > 0) return f;
      const m = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (m.length > 0) return m;
    }
    const n = l.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function a(l) {
    const s = l.dom;
    function n(f) {
      const m = f.target;
      if (m && m.hasAttribute && (m.hasAttribute("data-ln-table") || m.tagName === "TABLE")) return m;
      const r = f.detail && f.detail.targetId || m && m.id;
      if (!r) return null;
      const v = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(r) : r.replace(/(["\\])/g, "\\$1");
      return s.querySelector('[data-ln-table-source="' + v + '"]') || s.querySelector('[data-ln-table="' + v + '"]') || (s.id === r ? s : null) || document.getElementById(r);
    }
    l._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(f) {
        if (!f.detail) return;
        const m = n(f);
        if (!m) return;
        const r = f.detail.key, v = f.detail.values || [], w = m.querySelectorAll("th");
        for (let h = 0; h < w.length; h++)
          if ((w[h].getAttribute("data-ln-table-filter-col") || w[h].getAttribute("data-ln-filter-col") || w[h].getAttribute("data-ln-filter-key") || w[h].getAttribute("data-ln-field")) === r) {
            const o = w[h].querySelector("[data-ln-table-col-filter], .table-filter");
            o && o.classList.toggle("ln-filter-active", v.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(f) {
        const m = f.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!m) return;
        const r = m.closest("[data-ln-table], table") || s.querySelector("[data-ln-table], table");
        if (!r) return;
        const v = r.lnTable && r.lnTable.name || r.id, w = r.querySelectorAll("th");
        for (let g = 0; g < w.length; g++) {
          const _ = w[g].querySelector("[data-ln-table-col-filter], .table-filter");
          _ && _.classList.remove("ln-filter-active");
        }
        const h = r.getAttribute("data-ln-table-source") || r.id, b = h ? document.getElementById(h) : null;
        if (b && b.hasAttribute("data-ln-search"))
          b.setAttribute("data-ln-search", "");
        else {
          const g = u(s, h);
          g && g.value !== "" && (g.value = "", g.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const o = p(s, h);
        for (let g = 0; g < o.length; g++) {
          const _ = o[g].querySelector("[data-ln-filter-reset]");
          if (!_) continue;
          const c = o[g].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!_.checked || c) && (_.checked = !0, _.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        r.lnTable && !r.hasAttribute("data-ln-table-source") && k(r, "ln-table:request-clear-filters", { table: v });
      }
    }, s.addEventListener("ln-filter:change", l._handlers.filter), s.addEventListener("click", l._handlers.clear);
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
  function s(c, y) {
    if (!c || !c.isDataDriven) return;
    const E = c.dom.hasAttribute("data-ln-list-window");
    if (E && !c._windowed)
      c._enterWindowedMode(), c._kickWindowInitial();
    else if (!E && c._windowed)
      c._exitWindowedMode();
    else if (E && c._windowed) {
      const A = parseInt(y, 10);
      A > 0 && c._cache.configure({ windowSize: A });
    }
  }
  function n(c, y) {
    if (!c || !c.isDataDriven || !c._windowed || !c._cache) return;
    const E = parseInt(y, 10);
    E > 0 && c._cache.configure({ pageSize: E });
  }
  function f(c, y) {
    if (!c || !c.isDataDriven || !c._windowed || !c._cache) return;
    const E = parseInt(y, 10);
    E >= 0 && c._cache.configure({ threshold: E });
  }
  function m(c, y) {
    if (!c || !c.isDataDriven || !c._windowed || !c._cache) return;
    const E = parseInt(y, 10);
    E >= 0 && c._cache.setGrandTotal(E);
  }
  const r = {
    "data-ln-list": { prop: "name", type: "string", read: K, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: f, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: m, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, v = Y(r);
  function w(c, y) {
    if (c == null || isNaN(c)) return "";
    try {
      return new Intl.NumberFormat(J(y)).format(c);
    } catch {
      return String(c);
    }
  }
  function h(c) {
    let y = c;
    for (; y && y !== document.body && y !== document.documentElement; ) {
      const A = getComputedStyle(y).overflowY;
      if (A === "auto" || A === "scroll") return y;
      y = y.parentElement;
    }
    return null;
  }
  function b(c) {
    const y = c._scrollContainer || h(c.dom);
    return {
      container: y,
      top: y ? y.scrollTop : window.scrollY
    };
  }
  function o(c) {
    c.container ? c.container.scrollTop = c.top : window.scrollTo(window.scrollX, c.top);
  }
  function g(c) {
    if (!c) return 0;
    const y = getComputedStyle(c), E = parseFloat(y.marginTop) || 0, A = parseFloat(y.marginBottom) || 0;
    return c.offsetHeight + E + A;
  }
  function _(c) {
    this.dom = c, X(this, c, v), this.tbody = c.querySelector("[data-ln-list-body]") || c, this.isDataDriven = c.hasAttribute("data-ln-list-source"), this._totalSpan = c.querySelector("[data-ln-list-total]"), this._filteredSpan = c.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== c ? this._filteredSpan.parentElement : null), this._selectedSpan = c.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== c ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const y = this;
    return this._onSetSearch = function(E) {
      const A = (E.detail && E.detail.query != null ? E.detail.query : E.detail && E.detail.term != null ? E.detail.term : "").trim();
      y.isDataDriven ? (y.currentSearch = A, k(c, "ln-list:search", {
        list: y.name,
        query: y.currentSearch
      }), y._requestData()) : (y._searchTerm = A.toLowerCase(), y._applyFilterAndSort(), y._vStart = -1, y._vEnd = -1, y._render(), y._updateFooter(), k(c, "ln-list:filter", {
        term: y._searchTerm,
        matched: y._filteredData.length,
        total: y._data.length
      }));
    }, c.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(E) {
      E.preventDefault(), y._onSetSearch(E);
    }, c.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      y.isDataDriven ? (y.currentFilters = {}, y.currentSearch = "", k(c, "ln-list:clear-filters", { list: y.name }), y._requestData()) : (y._searchTerm = "", y._filters = {}, y._sortField = null, y._sortDir = null, y._applyFilterAndSort(), y._vStart = -1, y._vEnd = -1, y._render(), y._updateFooter(), k(c, "ln-list:filter", {
        term: "",
        matched: y._filteredData.length,
        total: y._data.length
      }));
    }, c.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, c.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(E) {
      const A = E.detail || {}, S = A.data || [], C = A.total != null ? A.total : S.length;
      if (!(y._hasInitialSeed && !y.isLoaded && S.length === 0 && C === 0)) {
        if (y._windowed) {
          y._cache.ingest(A) && !A.provisional && c.classList.remove("ln-list--loading");
          return;
        }
        y._data = S, y._lastTotal = C, y._lastFiltered = A.filtered != null ? A.filtered : y._data.length, y.totalCount = y._lastTotal, y.visibleCount = y._lastFiltered, y.isLoaded = !0, y._hasInitialSeed = !1, c.classList.remove("ln-list--loading"), y._vStart = -1, y._vEnd = -1, y._applyFilterAndSort(), y._render(), y._updateFooter(), k(c, "ln-list:rendered", {
          list: y.name,
          total: y.totalCount,
          visible: y.visibleCount
        });
      }
    }, c.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(E) {
      const A = E.detail && E.detail.loading;
      c.classList.toggle("ln-list--loading", !!A), A && (y.isLoaded = !1);
    }, c.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(E) {
      !y._windowed || !y._cache || y._cache.release(E.detail && E.detail.offset);
    }, c.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !y._windowed || !y._cache || y._cache.revalidate();
    }, c.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !y._windowed || !y._cache || y._requestData();
    }, c.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(E) {
      !E.detail || E.detail.field == null || (E.preventDefault(), y.currentSort = E.detail.direction === "none" ? null : { field: E.detail.field, direction: E.detail.direction }, y._requestData());
    }, c.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(E) {
      if (E.target.closest("[data-ln-item-select]") || E.target.closest("[data-ln-item-action]") || E.target.closest("a") || E.target.closest("button") || E.ctrlKey || E.metaKey || E.button === 1) return;
      const A = E.target.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id"), C = A._lnRecord || {};
      k(c, "ln-list:item-click", {
        list: y.name,
        id: S,
        record: C
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(E) {
      const A = E.target.closest("[data-ln-item-action]");
      if (!A) return;
      const S = A.closest("[data-ln-item]");
      if (!S) return;
      const C = A.getAttribute("data-ln-item-action"), L = S.getAttribute("data-ln-item-id"), I = S._lnRecord || {};
      k(c, "ln-list:item-action", {
        list: y.name,
        id: L,
        action: C,
        record: I
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : k(c, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      y.tbody.children.length > 0 && (y._emptyObserver.disconnect(), y._emptyObserver = null, y._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(E) {
      if (E.preventDefault(), !E.detail) return;
      const A = E.detail.key, S = E.detail.values || [];
      if (A) {
        if (S.length === 0)
          delete y._filters[A];
        else {
          const C = [];
          for (let L = 0; L < S.length; L++)
            C.push(S[L].toLowerCase());
          y._filters[A] = C;
        }
        y._applyFilterAndSort(), y._vStart = -1, y._vEnd = -1, y._render(), y._updateFooter(), k(c, "ln-list:filter", {
          term: y._searchTerm,
          matched: y._filteredData.length,
          total: y._data.length
        });
      }
    }, c.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(E) {
      if (!E.detail || E.detail.field == null) return;
      E.preventDefault();
      const A = E.detail.direction === "none" ? null : E.detail.direction;
      y._sortField = A === null ? null : E.detail.field, y._sortDir = A, y._applyFilterAndSort(), y._vStart = -1, y._vEnd = -1, y._render(), y._updateFooter(), k(c, "ln-list:sorted", {
        field: y._sortField,
        direction: E.detail && E.detail.direction,
        matched: y._filteredData.length,
        total: y._data.length
      });
    }, c.addEventListener("ln-sort:change", this._onSort)), this;
  }
  _.prototype._parseChildren = function() {
    const c = Array.from(this.tbody.children).filter((y) => !y.classList.contains("ln-list__spacer"));
    this._data = [], c.length > 0 && (this._itemHeight = g(c[0]) || 50);
    for (let y = 0; y < c.length; y++) {
      const E = c[y], A = E.getAttribute("data-ln-item-id") || E.getAttribute("id"), S = E.textContent.trim().toLowerCase();
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
  }, _.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const c = this._searchTerm, y = c ? c.split(/\s+/).filter(Boolean) : [], E = this._filters || {}, A = Object.keys(E).length > 0;
      if (y.length === 0 && !A ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (y.length > 0 && !y.every(function(L) {
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
  }, _.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const c = this._lastTotal, y = this.visibleCount;
        if (c === 0 || this._filteredData.length === 0 || y === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const c = this._filteredData.length;
        c === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : c > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, _.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const c = this._filteredData, y = document.createDocumentFragment();
      for (let A = 0; A < c.length; A++) {
        const S = this._buildItem(c[A]);
        S && y.appendChild(S);
      }
      const E = b(this);
      this.tbody.replaceChildren(y), o(E), this._selectable && this._updateSelectAll();
    } else {
      const c = [], y = this._filteredData;
      for (let A = 0; A < y.length; A++) c.push(y[A].html);
      const E = b(this);
      this.tbody.innerHTML = c.join(""), o(E), this._selectable && this._restoreSelection();
    }
  }, _.prototype._readGridLayout = function() {
    const c = getComputedStyle(this.tbody), y = c.gridTemplateColumns;
    let E = 1;
    if (y && y !== "none") {
      const S = y.trim().split(/\s+/).filter(Boolean);
      S.length > 0 && (E = S.length);
    }
    const A = parseFloat(c.rowGap);
    return { columns: E, rowGap: isNaN(A) ? 0 : A };
  }, _.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const c = this._cache.peek(), y = c ? this._buildItem(c) : this._buildPlaceholderItem();
      y && (this.tbody.textContent = "", this.tbody.appendChild(y), this._itemHeight = g(y) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const c = this._buildItem(this._data[0]);
        c && (this.tbody.textContent = "", this.tbody.appendChild(c), this._itemHeight = g(c) || 50, this.tbody.textContent = "");
      }
    } else {
      const c = this.tbody.children;
      c.length > 0 && (this._itemHeight = g(c[0]) || 50);
    }
  }, _.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const c = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = h(this.dom);
    const y = this._scrollContainer || window;
    this._scrollHandler = function() {
      c._rafId || (c._rafId = requestAnimationFrame(function() {
        c._rafId = null, c._windowed ? c._renderWindowed() : c._renderVirtual();
      }));
    }, this._resizeRafId = null, this._resizeHandler = function() {
      c._resizeRafId || (c._resizeRafId = requestAnimationFrame(function() {
        c._resizeRafId = null, c._itemHeight = 0, c._measureItemHeight(), c._vStart = -1, c._vEnd = -1, c._windowed ? c._renderWindowed() : c._renderVirtual();
      }));
    }, y.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, _.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._resizeRafId && (cancelAnimationFrame(this._resizeRafId), this._resizeRafId = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, _.prototype._renderVirtual = function() {
    const c = this._filteredData, y = c.length, E = this._itemHeight;
    if (!E || !y) return;
    const A = this._scrollContainer;
    let S, C;
    if (A) {
      const nt = this.tbody.getBoundingClientRect(), V = A.getBoundingClientRect(), W = A === this.tbody ? 0 : nt.top - V.top + A.scrollTop;
      S = A.scrollTop - W, C = A.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      S = window.scrollY - V, C = window.innerHeight;
    }
    const L = this._readGridLayout(), I = L.columns, q = L.rowGap, D = E + q, O = Math.ceil(y / I);
    let F = Math.max(0, Math.floor(S / D) - 15);
    F = Math.min(F, O);
    const U = Math.ceil(C / D) + 30, j = Math.min(F + U, O), G = Math.min(F * I, y), tt = Math.min(j * I, y);
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
        const yt = this._buildItem(c[W]);
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
        nt += c[W].html;
      at > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${at}px"></${this.isUl ? "li" : "div"}>`);
      const V = b(this);
      this.tbody.innerHTML = nt, o(V), this._selectable && this._restoreSelection();
    }
  }, _.prototype._buildPlaceholderItem = function() {
    const c = document.createElement(this.isUl ? "li" : "div");
    return c.className = "ln-list__placeholder", c.setAttribute("aria-hidden", "true"), c.style.height = this._itemHeight + "px", c;
  }, _.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const c = this._itemHeight;
    if (!c) return;
    const y = this._scrollContainer;
    let E, A;
    if (y) {
      const V = this.tbody.getBoundingClientRect(), W = y.getBoundingClientRect(), yt = y === this.tbody ? 0 : V.top - W.top + y.scrollTop;
      E = y.scrollTop - yt, A = y.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      E = window.scrollY - W, A = window.innerHeight;
    }
    const S = this._readGridLayout(), C = S.columns, L = S.rowGap, I = c + L, q = this._cache.logicalTotal, D = Math.ceil(q / C);
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
    this.tbody.replaceChildren(at), o(nt), this._vStart = j, this._vEnd = G, this._cache.ensure(j, G);
  }, _.prototype._showEmptyState = function() {
    let c = null;
    if (this.isDataDriven) {
      const y = this._lastTotal != null ? this._lastTotal : this._data.length, A = this.visibleCount === 0 && y > 0, S = A ? this.name + "-empty-filtered" : this.name + "-empty";
      if (c = Lt(this.dom, S, "ln-list"), !c) {
        const C = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (C) {
          const L = A ? "search" : "initial", I = C.content.querySelector(`[data-ln-empty-when="${L}"]`) || C.content.firstElementChild;
          I && (c = document.importNode(I, !0));
        }
      }
    } else {
      const y = this.dom.querySelector(`template[${i}]`);
      if (y) {
        const E = y.content.firstElementChild;
        E && (c = document.importNode(E, !0));
      }
    }
    if (c)
      if (c.tagName === "LI" || c.tagName === "TR")
        this.tbody.replaceChildren(c);
      else {
        const y = document.createElement(this.isUl ? "li" : "div");
        y.appendChild(c), this.tbody.replaceChildren(y);
      }
    else
      this.tbody.replaceChildren();
    k(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, _.prototype._buildItem = function(c) {
    let y = Lt(this.dom, this.name + "-row", "ln-list");
    if (!y) {
      const A = this.dom.querySelector("template[data-ln-item]");
      A && (y = document.importNode(A.content, !0));
    }
    let E = y ? y.querySelector("[data-ln-item]") || y.firstElementChild : null;
    if (E)
      Zt(E, c), ft(E, c);
    else if (c && c.html) {
      const A = document.createElement(this.isUl ? "ul" : "div");
      A.innerHTML = c.html, E = A.firstElementChild;
    } else if (E = document.createElement(this.isUl ? "li" : "div"), E.setAttribute("data-ln-item", ""), c && typeof c == "object") {
      for (const A in c)
        if (A !== "html" && c[A] != null) {
          const S = document.createElement("span");
          S.setAttribute("data-ln-field", A), S.textContent = String(c[A]), E.appendChild(S);
        }
    }
    if (E._lnRecord = c, c && c.id != null && (E.setAttribute("data-ln-item-id", c.id), this._selectable && this.selectedIds.has(String(c.id)))) {
      E.classList.add("ln-item-selected");
      const A = E.querySelector("[data-ln-item-select]");
      A && (A.checked = !0);
    }
    return E;
  }, _.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const c = this.tbody.querySelectorAll("[data-ln-item]");
    for (let y = 0; y < c.length; y++) {
      const E = c[y].getAttribute("data-ln-item-id"), A = E != null && this.selectedIds.has(String(E));
      c[y].classList.toggle("ln-item-selected", A);
      const S = c[y].querySelector("[data-ln-item-select]");
      S && (S.checked = A);
    }
    this._updateSelectAll();
  }, _.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const c = this;
    this._onSelectionChange = function(y) {
      const E = y.target.closest("[data-ln-item-select]");
      if (!E) return;
      const A = E.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id");
      S != null && (E.checked ? (c.selectedIds.add(String(S)), A.classList.add("ln-item-selected")) : (c.selectedIds.delete(String(S)), A.classList.remove("ln-item-selected")), c._updateSelectAll(), c._updateFooter(), k(c.dom, "ln-list:select", {
        list: c.name,
        selectedIds: c.selectedIds,
        count: c.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const y = c._selectAllCheckbox.checked, E = c.tbody.querySelectorAll("[data-ln-item]");
      for (let A = 0; A < E.length; A++) {
        const S = E[A], C = S.getAttribute("data-ln-item-id"), L = S.querySelector("[data-ln-item-select]");
        C != null && (y ? (c.selectedIds.add(String(C)), S.classList.add("ln-item-selected")) : (c.selectedIds.delete(String(C)), S.classList.remove("ln-item-selected")), L && (L.checked = y));
      }
      k(c.dom, "ln-list:select-all", { list: c.name, selected: y }), k(c.dom, "ln-list:select", {
        list: c.name,
        selectedIds: c.selectedIds,
        count: c.selectedIds.size
      }), c._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, _.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const c = this.tbody.querySelectorAll("[data-ln-item]");
    let y = c.length > 0;
    for (let E = 0; E < c.length; E++) {
      const A = c[E].getAttribute("data-ln-item-id");
      if (A != null && !this.selectedIds.has(String(A))) {
        y = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = y;
  }, _.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    wn(this, "ln-list:request-data", "list");
  }, _.prototype._enterWindowedMode = function() {
    const c = this, y = this.dom, E = parseInt(y.getAttribute("data-ln-list-window"), 10), A = parseInt(y.getAttribute("data-ln-list-window-page"), 10), S = parseInt(y.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !c._windowed || !c._cache || (c.totalCount = c._cache.grandTotal, c.visibleCount = c._cache.logicalTotal, c._lastTotal = c._cache.grandTotal, c.isLoaded = !0, c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter(), k(y, "ln-list:rendered", {
        list: c.name,
        total: c.totalCount,
        visible: c.visibleCount
      }));
    }, this._renderBatch = Ht(this._onCacheChange), this._cache = Pn({
      windowSize: E > 0 ? E : 1e3,
      pageSize: A > 0 ? A : 200,
      threshold: S >= 0 ? S : 25,
      fetchDebounce: 120,
      requestPage: function(C, L, I) {
        k(y, "ln-list:request-data", {
          list: c.name,
          sort: C.sort,
          filters: C.filters,
          search: C.search,
          offset: L,
          limit: I,
          queryGen: c._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, _.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const c = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), y = c > 0 ? c : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: y,
        filtered: y
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, _.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, _.prototype._updateFooter = function() {
    let c = 0, y = 0;
    this.isDataDriven ? (c = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount) : (c = this._data.length, y = this._filteredData.length);
    const E = y < c;
    if (this._totalSpan && (this._totalSpan.textContent = w(c, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = E ? w(y, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !E), this._selectedSpan) {
      const A = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = A > 0 ? w(A, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", A === 0);
    }
  }, _.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, H(t, e, _, "ln-list", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(r) {
    const v = r[e];
    v && m.call(v);
  }
  const d = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, u = "http://www.w3.org/2000/svg", p = 36, a = 16, l = 2 * Math.PI * a;
  function s(r) {
    return this.dom = r, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, f.call(this), m.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(r, v) {
    const w = document.createElementNS(u, r);
    for (const [h, b] of Object.entries(v))
      w.setAttribute(h, b);
    return w;
  }
  function f() {
    this.svg = n("svg", {
      viewBox: "0 0 " + p + " " + p,
      width: p,
      height: p
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: a,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: p / 2,
      cy: p / 2,
      r: a,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": l,
      "stroke-dashoffset": l,
      transform: "rotate(-90 " + p / 2 + " " + p / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function m() {
    const r = this.dom.getAttribute("data-ln-circular-progress"), v = this.dom.getAttribute("data-ln-circular-progress-max"), w = jn(r, v || 100), h = l - w.percentage / 100 * l;
    this.progressCircle.setAttribute("stroke-dashoffset", h);
    const b = this.dom.getAttribute("data-ln-circular-progress-label"), o = b !== null ? b : Math.round(w.percentage) + "%";
    this.labelEl.textContent = o, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(w.min)), this.dom.setAttribute("aria-valuemax", String(w.max)), this.dom.setAttribute("aria-valuenow", String(w.clampedValue)), this.dom.setAttribute("aria-valuetext", o), k(this.dom, "ln-circular-progress:change", {
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
    "data-ln-sortable": { effect: p, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function u(a) {
    this.dom = a, this.isEnabled = a.getAttribute(t) !== "disabled", this._dragging = null, a.setAttribute("aria-roledescription", "sortable list");
    const l = this;
    return this._onPointerDown = function(s) {
      l.isEnabled && l._handlePointerDown(s);
    }, a.addEventListener("pointerdown", this._onPointerDown), this;
  }
  u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, u.prototype._handlePointerDown = function(a) {
    let l = a.target.closest("[" + i + "]"), s;
    if (l) {
      for (s = l; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
      for (s = a.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      l = s;
    }
    const f = Array.from(this.dom.children).indexOf(s);
    if (Q(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: f
    }).defaultPrevented) return;
    a.preventDefault(), l.setPointerCapture(a.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), k(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: f
    });
    const r = this;
    let v = null, w = null;
    const h = function(o) {
      w = o, !v && (v = requestAnimationFrame(function() {
        v = null, w && r._handlePointerMove(w);
      }));
    }, b = function(o) {
      v && (cancelAnimationFrame(v), v = null), r._handlePointerEnd(o), l.removeEventListener("pointermove", h), l.removeEventListener("pointerup", b), l.removeEventListener("pointercancel", b);
    };
    l.addEventListener("pointermove", h), l.addEventListener("pointerup", b), l.addEventListener("pointercancel", b);
  }, u.prototype._handlePointerMove = function(a) {
    if (!this._dragging) return;
    const l = Array.from(this.dom.children), s = this._dragging;
    let n = null, f = null;
    for (let m = 0; m < l.length; m++) {
      const r = l[m];
      if (r === s) continue;
      const v = r.getBoundingClientRect(), w = v.top + v.height / 2;
      if (a.clientY >= v.top && a.clientY < w) {
        n = r, f = "before";
        break;
      } else if (a.clientY >= w && a.clientY <= v.bottom) {
        n = r, f = "after";
        break;
      }
    }
    if (!(this._lastDropTarget === n && this._lastDropPos === f)) {
      this._lastDropTarget && this._lastDropTarget !== n && this._lastDropTarget.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after"), this._lastDropTarget = n, this._lastDropPos = f;
      for (let m = 0; m < l.length; m++) {
        const r = l[m];
        r !== n && (r.classList.contains("ln-sortable--drop-before") && r.classList.remove("ln-sortable--drop-before"), r.classList.contains("ln-sortable--drop-after") && r.classList.remove("ln-sortable--drop-after"));
      }
      if (n) {
        const m = f === "before" ? "ln-sortable--drop-before" : "ln-sortable--drop-after", r = f === "before" ? "ln-sortable--drop-after" : "ln-sortable--drop-before";
        n.classList.contains(r) && n.classList.remove(r), n.classList.contains(m) || n.classList.add(m);
      }
    }
  }, u.prototype._handlePointerEnd = function(a) {
    if (!this._dragging) return;
    const l = this._dragging, s = Array.from(this.dom.children), n = s.indexOf(l);
    let f = null, m = null;
    for (const r of s) {
      if (r.classList.contains("ln-sortable--drop-before")) {
        f = r, m = "before";
        break;
      }
      if (r.classList.contains("ln-sortable--drop-after")) {
        f = r, m = "after";
        break;
      }
    }
    this._lastDropTarget = null, this._lastDropPos = null;
    for (const r of s)
      r.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (l.classList.remove("ln-sortable--dragging"), l.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), f && f !== l) {
      m === "before" ? this.dom.insertBefore(l, f) : this.dom.insertBefore(l, f.nextElementSibling);
      const v = Array.from(this.dom.children).indexOf(l);
      k(this.dom, "ln-sortable:reordered", {
        item: l,
        oldIndex: n,
        newIndex: v
      });
    }
    this._dragging = null;
  };
  function p(a) {
    const l = a[e];
    if (!l) return;
    const s = a.getAttribute(t) !== "disabled";
    s !== l.isEnabled && (l.isEnabled = s, k(a, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: a }));
  }
  H(t, e, u, "ln-sortable", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", d = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: l, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: s, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function p(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = a(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const f of [this.available, this.selected])
      for (const m of f.children)
        this._initial.push(m);
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
    for (let m = 0; m < n.length; m++)
      this._initial.includes(n[m]) || this._initial.push(n[m]);
    let f = 0;
    for (let m = 0; m < this._initial.length; m++) {
      const r = this._initial[m];
      if (!r.isConnected) continue;
      const v = r.querySelector('input[type="checkbox"]');
      if (!v) continue;
      let w;
      v.checked ? this.max === null || f < this.max ? (w = this.selected, f++) : (v.checked = !1, w = this.available) : w = this.available, w.appendChild(r);
    }
  }, p.prototype._onFormReset = function(n) {
    const f = this;
    setTimeout(function() {
      f._destroyed || n.defaultPrevented || f.sync();
    }, 0);
  }, p.prototype._onChange = function(n) {
    const f = n.target.closest('input[type="checkbox"]');
    if (!f) return;
    const m = f.closest("li");
    if (!m) return;
    const r = m.parentElement;
    if (r !== this.available && r !== this.selected) return;
    if (!this.isEnabled) {
      f.checked = !f.checked;
      return;
    }
    const v = f.checked ? this.selected : this.available;
    if (r === v) return;
    if (v === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      f.checked = !f.checked, k(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: m,
        checkbox: f,
        count: this.selected.children.length
      });
      return;
    }
    const w = { item: m, from: r, to: v, checkbox: f };
    if (Q(this.dom, "ln-picklist:before-move", w).defaultPrevented) {
      f.checked = !f.checked;
      return;
    }
    const h = document.activeElement === f;
    v.appendChild(m), h && f.focus(), k(this.dom, "ln-picklist:move", w);
  };
  function a(n) {
    const f = n.getAttribute(d);
    if (f === null || f === "") return null;
    const m = parseInt(f, 10);
    return isNaN(m) || m < 0 ? null : m;
  }
  function l(n) {
    const f = n[e];
    if (!f) return;
    const m = n.getAttribute(t) !== "disabled";
    m !== f.isEnabled && (f.isEnabled = m, k(n, m ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function s(n) {
    const f = n[e];
    f && (f.max = a(n));
  }
  H(t, e, p, "ln-picklist", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", d = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function p(m, r, v) {
    return m.getAttribute(r) || v;
  }
  function a(m, r, v) {
    const w = parseFloat(m.getAttribute(r));
    return isNaN(w) || w <= 0 ? v : w;
  }
  function l(m) {
    const r = document.createElement("span");
    return r.setAttribute(d, ""), r.setAttribute("role", "alert"), r.textContent = m, r;
  }
  const s = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: p, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: a, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (m, r) => m.getAttribute(r) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = Y(s);
  function f(m) {
    this.dom = m, X(this, m, n), this.revertTimer = null, this._submitted = !1, this.idleEl = m.querySelector("[data-ln-confirm-idle]"), this.activeEl = m.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : m.textContent.trim();
    const r = this;
    return this._onClick = function(v) {
      if (!De(v))
        if (!r.confirming)
          v.preventDefault(), v.stopImmediatePropagation(), r._enterConfirm();
        else {
          if (r._submitted) return;
          r._submitted = !0, r._reset();
        }
    }, m.addEventListener("click", this._onClick), this;
  }
  f.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const m = this.activeEl ? this.activeEl.textContent.trim() : "";
      m && (this.dom.setAttribute("aria-label", m), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const m = this.dom.querySelector("svg.ln-icon use");
      m && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = m.getAttribute("href"), m.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(l(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), k(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, f.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const m = this, r = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      m._reset();
    }, r);
  }, f.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const m = this.dom.querySelector("svg.ln-icon use");
      m && this.originalIconHref && m.setAttribute("href", this.originalIconHref);
      const r = this.dom.querySelector("[" + d + "]");
      r && r.remove(), this.isIconButton = !1, this.originalIconHref = null;
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
  }, d = Y(i), u = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function p(a) {
    if (this.dom = a, X(this, a, d), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = a.querySelector("[data-ln-translations-active]"), this.menuEl = a.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = u, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const l = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && l.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && l.removeLanguage(s.detail.lang);
    }, a.addEventListener("ln-translations:request-add", this._onRequestAdd), a.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  p.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const a = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const l of a) {
      const s = l.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, p.prototype._detectExisting = function() {
    const a = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const l of a) {
      const s = l.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, p.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const a = this;
    let l = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      l++;
      const f = ae("ln-translations-menu-item", "ln-translations");
      if (!f) return;
      const m = f.querySelector("[data-ln-translations-lang]");
      m.setAttribute("data-ln-translations-lang", n), m.textContent = this.locales[n], m.addEventListener("click", function(r) {
        r.ctrlKey || r.metaKey || r.button === 1 || (r.preventDefault(), r.stopPropagation(), a.menuEl.getAttribute("data-ln-toggle") === "open" && a.menuEl.setAttribute("data-ln-toggle", "close"), a.addLanguage(n));
      }), this.menuEl.appendChild(f);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = l === 0);
  }, p.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const a = this;
    this.activeLanguages.forEach(function(l) {
      const s = ae("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", l);
      const f = n.querySelector("span");
      f.textContent = a.locales[l] || l.toUpperCase();
      const m = n.querySelector("button"), r = a.locales[l] || l.toUpperCase();
      m.setAttribute("aria-label", a.removeLabel.replace("{lang}", r)), m.addEventListener("click", function(v) {
        v.ctrlKey || v.metaKey || v.button === 1 || (v.preventDefault(), v.stopPropagation(), a.removeLanguage(l));
      }), a.badgesEl.appendChild(s);
    });
  }, p.prototype.addLanguage = function(a, l) {
    if (this.activeLanguages.has(a)) return;
    const s = this.locales[a] || a;
    if (Q(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: a,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(a), l = l || {};
    const f = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const m of f) {
      const r = m.getAttribute("data-ln-translatable"), v = m.getAttribute("data-ln-translations-prefix") || "", w = m.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!w) continue;
      const h = w.cloneNode(w.tagName === "SELECT");
      v ? h.name = v + "[trans][" + a + "][" + r + "]" : h.name = "trans[" + a + "][" + r + "]", h.value = l[r] !== void 0 ? l[r] : "", h.removeAttribute("id"), "placeholder" in h && (h.placeholder = this.placeholderLabel.replace("{lang}", s)), h.setAttribute("data-ln-translatable-lang", a);
      const b = m.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), o = b.length > 0 ? b[b.length - 1] : w;
      o.parentNode.insertBefore(h, o.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: a,
      langName: s
    });
  }, p.prototype.removeLanguage = function(a) {
    if (!this.activeLanguages.has(a) || Q(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: a
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + a + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(a), this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: a
    });
  }, p.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, p.prototype.hasLanguage = function(a) {
    return this.activeLanguages.has(a);
  }, p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const a = this.defaultLang, l = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of l)
      s.getAttribute("data-ln-translatable-lang") !== a && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, H(t, e, p, "ln-translations", {
    attributes: i
  });
})();
const Pr = "ln-autosave:", Hr = 1e3;
function Ur(t, e) {
  return e ? Pr + (t || "") + ":" + e : null;
}
function zr(t, e = Hr) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", d = "data-ln-autosave-debounce-input", u = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function a(s) {
    const n = s.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function l(s) {
    const f = s.getAttribute(t) || s.id, m = Ur(window.location.pathname, f);
    if (!m) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", s);
      return;
    }
    this.dom = s, this.key = m;
    let r = null;
    function v() {
      const o = Oe(s, { exclude: u });
      try {
        localStorage.setItem(m, JSON.stringify(o));
      } catch {
        return;
      }
      k(s, "ln-autosave:saved", { target: s, data: o });
    }
    function w() {
      let o;
      try {
        o = localStorage.getItem(m);
      } catch {
        return;
      }
      if (!o) return;
      let g;
      try {
        g = JSON.parse(o);
      } catch {
        return;
      }
      if (Q(s, "ln-autosave:before-restore", { target: s, data: g }).defaultPrevented) return;
      const c = Ne(s, g);
      for (let y = 0; y < c.length; y++)
        c[y].dispatchEvent(new Event("input", { bubbles: !0 })), c[y].dispatchEvent(new Event("change", { bubbles: !0 }));
      k(s, "ln-autosave:restored", { target: s, data: g });
    }
    function h() {
      try {
        localStorage.removeItem(m);
      } catch {
        return;
      }
      k(s, "ln-autosave:cleared", { target: s });
    }
    this._onFocusout = function(o) {
      const g = o.target;
      a(g) && g.name && !g.matches(u) && v();
    }, this._onChange = function(o) {
      const g = o.target;
      a(g) && g.name && !g.matches(u) && v();
    }, this._onSubmit = function() {
      h();
    }, this._onReset = function() {
      h();
    }, this._onClearClick = function(o) {
      o.target.closest("[" + i + "]") && h();
    }, s.addEventListener("focusout", this._onFocusout), s.addEventListener("change", this._onChange), s.addEventListener("submit", this._onSubmit), s.addEventListener("reset", this._onReset), s.addEventListener("click", this._onClearClick);
    const b = zr(s.getAttribute(d));
    return b > 0 && (this._onInput = function(o) {
      const g = o.target;
      !a(g) || !g.name || g.matches(u) || (r !== null && clearTimeout(r), r = setTimeout(v, b));
    }, s.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return r;
    }, w(), this;
  }
  l.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const s = this._getInputTimer();
        s !== null && clearTimeout(s);
      }
      delete this.dom[e];
    }
  }, H(t, e, l, "ln-autosave", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-autoresize": { type: "marker", description: "Automatically adjusts textarea height to match its scrollable content" }
  };
  function d(u) {
    if (u.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", u.tagName), this;
    this.dom = u;
    const p = this;
    return this._onInput = function() {
      p._resize();
    }, u.addEventListener("input", this._onInput), this._resize(), this;
  }
  d.prototype._resize = function() {
    const u = this.dom.style.height;
    this.dom.style.height = "auto";
    const p = this.dom.scrollHeight + "px";
    this.dom.style.height = u === p ? u : p;
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, H(t, e, d, "ln-autoresize", {
    attributes: i
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
  }, p = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, a = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let l = 0;
  function s(o) {
    return !!(u[o] || p[o] || a[o] || o === "link");
  }
  function n(o) {
    this.dom = o;
    const g = this;
    if (this._textarea = o.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", o), this;
    const _ = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), _ && this._surface.setAttribute("data-placeholder", _);
    const c = this._textarea.id;
    if (c) {
      const S = o.querySelector('label[for="' + c + '"]');
      S && (S.id || (S.id = c + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = c ? c + "-surface" : "ln-editor-surface-" + ++l;
    const y = this._textarea.value.trim();
    y && (this._surface.innerHTML = y);
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
      g._syncToTextarea(), k(g.dom, "ln-editor:changed", {
        html: g._textarea.value,
        target: g.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const C = S.target.closest("[data-ln-editor-action]");
      if (!C) return;
      const L = C.getAttribute("data-ln-editor-action");
      g._execAction(L);
    }, this._onPaste = function(S) {
      r(g, S);
    }, this._onKeydown = function(S) {
      h(g, S);
    }, this._listeningSelection = !1, this._rafSelection = null, this._onSelectionChange = function() {
      g._rafSelection || (g._rafSelection = requestAnimationFrame(function() {
        g._rafSelection = null, document.contains(g._surface) && g._updateActiveStates();
      }));
    }, this._attachSelection = function() {
      g._listeningSelection || (g._listeningSelection = !0, document.addEventListener("selectionchange", g._onSelectionChange));
    }, this._detachSelection = function() {
      g._listeningSelection && (g._listeningSelection = !1, document.removeEventListener("selectionchange", g._onSelectionChange)), g._rafSelection && (cancelAnimationFrame(g._rafSelection), g._rafSelection = null);
    }, this._onFocus = function() {
      g._attachSelection(), g._updateActiveStates(), k(g.dom, "ln-editor:focus", { target: g.dom });
    }, this._onBlur = function() {
      g._detachSelection(), g._syncToTextarea(), k(g.dom, "ln-editor:blur", { target: g.dom });
    }, this._onTextareaInput = function() {
      g._surface.innerHTML !== g._textarea.value && (g._surface.innerHTML = g._textarea.value, k(g.dom, "ln-editor:changed", {
        html: g._textarea.value,
        target: g.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), E && (E.addEventListener("mousedown", this._onMousedownToolbar), E.addEventListener("click", this._onClickToolbar)), this._onSetContent = function(S) {
      const C = S.detail && S.detail.html;
      C !== void 0 && (g._surface.innerHTML = C, g._syncToTextarea(), k(g.dom, "ln-editor:changed", {
        html: g._textarea.value,
        target: g.dom
      }));
    }, o.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        g._surface.innerHTML = g._textarea.value, k(o, "ln-editor:changed", {
          html: g._textarea.value,
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
      if (this._surface.focus(), u[o])
        document.execCommand(u[o], !1, null);
      else if (p[o]) {
        const _ = p[o], c = f(this._surface);
        c && c.toLowerCase() === _ ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + _ + ">");
      } else a[o] ? document.execCommand(a[o], !1, null) : o === "link" ? b(this) : o === "unlink" ? document.execCommand("unlink", !1, null) : o === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const o = this.dom.querySelector('[role="toolbar"]');
    if (!o) return;
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return;
    const _ = g.anchorNode;
    if (!_ || !this._surface.contains(_)) return;
    const c = o.querySelectorAll("[data-ln-editor-action]");
    for (let y = 0; y < c.length; y++) {
      const E = c[y], A = E.getAttribute("data-ln-editor-action");
      let S = !1;
      if (u[A])
        try {
          S = document.queryCommandState(u[A]);
        } catch {
        }
      else if (p[A]) {
        const C = f(this._surface);
        S = C && C.toLowerCase() === p[A];
      } else if (a[A])
        try {
          S = document.queryCommandState(a[A]);
        } catch {
        }
      else A === "link" && (S = !!m(g.anchorNode, "A", this._surface));
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
    const g = this._textarea ? this._textarea.form : null;
    if (g && this._onFormReset && g.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const _ = this.dom.querySelector(".ln-editor__link-popover");
      _ && _.remove();
    }
    delete this.dom[e];
  };
  function f(o) {
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return null;
    let _ = g.anchorNode;
    if (!_) return null;
    for (; _ && _ !== o; ) {
      if (_.nodeType === 1) {
        const c = _.tagName;
        if (c === "H2" || c === "H3" || c === "H4" || c === "BLOCKQUOTE" || c === "PRE" || c === "P")
          return c;
      }
      _ = _.parentNode;
    }
    return null;
  }
  function m(o, g, _) {
    for (; o && o !== _; ) {
      if (o.nodeType === 1 && o.tagName === g)
        return o;
      o = o.parentNode;
    }
    return null;
  }
  function r(o, g) {
    g.preventDefault();
    let _ = "";
    if (g.clipboardData && (_ = g.clipboardData.getData("text/html"), !_)) {
      const y = g.clipboardData.getData("text/plain");
      y && (_ = y.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), _ = "<p>" + _ + "</p>");
    }
    if (!_) return;
    const c = v(_);
    c && document.execCommand("insertHTML", !1, c);
  }
  function v(o) {
    const g = document.createElement("div");
    return g.innerHTML = o, w(g), g.innerHTML;
  }
  function w(o) {
    const g = Array.from(o.childNodes);
    for (let _ = 0; _ < g.length; _++) {
      const c = g[_];
      if (c.nodeType !== 3) {
        if (c.nodeType !== 1) {
          o.removeChild(c);
          continue;
        }
        if (d[c.tagName]) {
          const y = Array.from(c.attributes);
          for (let E = 0; E < y.length; E++) {
            const A = y[E].name;
            if (c.tagName === "A" && A === "href") {
              const S = c.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || c.removeAttribute("href");
            } else
              c.removeAttribute(A);
          }
          c.tagName === "A" && c.setAttribute("rel", "noopener noreferrer"), w(c);
        } else {
          for (; c.firstChild; )
            o.insertBefore(c.firstChild, c);
          o.removeChild(c);
        }
      }
    }
  }
  function h(o, g) {
    if (!(g.ctrlKey || g.metaKey)) return;
    let _ = null;
    switch (g.key.toLowerCase()) {
      case "b":
        _ = "bold";
        break;
      case "i":
        _ = "italic";
        break;
      case "u":
        _ = "underline";
        break;
      case "k":
        _ = "link";
        break;
    }
    _ && (g.preventDefault(), o._execAction(_));
  }
  function b(o) {
    const g = window.getSelection();
    if (!g || g.rangeCount === 0) return;
    const _ = m(g.anchorNode, "A", o._surface), c = g.getRangeAt(0).cloneRange();
    o._closeLinkPopover && o._closeLinkPopover();
    const y = Lt(o.dom, "ln-editor-link-popover", "ln-editor");
    if (!y) return;
    const E = y.firstElementChild;
    if (!E) return;
    const A = E.querySelector('input[type="url"]'), S = E.querySelector('[data-ln-editor-action="confirm-link"]'), C = E.querySelector('[data-ln-editor-action="cancel-link"]');
    _ && (A.value = _.getAttribute("href") || "");
    const L = o.dom.querySelector('[role="toolbar"]');
    L ? L.after(E) : o.dom.insertBefore(E, o._surface), A.focus();
    function I() {
      const j = window.getSelection();
      j.removeAllRanges(), j.addRange(c);
    }
    function q() {
      document.removeEventListener("mousedown", U), o._closeLinkPopover = null, E.remove();
    }
    function D() {
      const j = A.value.trim();
      if (q(), I(), o._surface.focus(), j)
        if (_)
          _.setAttribute("href", j), _.setAttribute("rel", "noopener noreferrer"), o._syncToTextarea(), k(o.dom, "ln-editor:changed", {
            html: o._textarea.value,
            target: o.dom
          });
        else {
          document.execCommand("createLink", !1, j);
          const G = window.getSelection();
          if (G && G.anchorNode) {
            const tt = m(G.anchorNode, "A", o._surface);
            tt && (tt.setAttribute("rel", "noopener noreferrer"), o._syncToTextarea());
          }
        }
      else _ && document.execCommand("unlink", !1, null);
    }
    function O() {
      q(), I(), o._surface.focus();
    }
    function F() {
      q();
    }
    function U(j) {
      const G = o.dom.contains(j.target) && j.target.closest('[data-ln-editor-action="link"]');
      !E.contains(j.target) && !G && F();
    }
    o._closeLinkPopover = q, S.addEventListener("click", D), C.addEventListener("click", O), A.addEventListener("keydown", function(j) {
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
    const p = {}, a = u.dataset;
    for (const l in a) {
      if (!l.startsWith("lnFill") || e[l]) continue;
      const s = l.slice(6);
      s && (p[s.charAt(0).toLowerCase() + s.slice(1)] = a[l]);
    }
    return p;
  }
  function d(u, p) {
    const a = window.CSS && CSS.escape ? CSS.escape(p) : p, l = document.querySelectorAll('[data-ln-fill-id="' + a + '"]');
    if (l.length === 0) return null;
    for (let s = 0; s < l.length; s++) {
      const n = l[s].getAttribute("data-ln-fill-form");
      if (n) {
        const f = document.getElementById(n);
        if (f && u.contains(f)) return l[s];
      }
    }
    return l[0];
  }
  document.addEventListener("click", function(u) {
    if (u.ctrlKey || u.metaKey || u.button === 1) return;
    const p = u.target.closest("[data-ln-fill-form]");
    if (!p) return;
    const a = p.getAttribute("data-ln-fill-form"), l = document.getElementById(a);
    if (!l) return;
    const s = i(p), n = Object.keys(s).length > 0;
    window.lnCore.lnFill(l, n ? s : null);
  }), document.addEventListener("ln-fill:request", function(u) {
    const p = u.detail;
    if (!p) return;
    const a = u.target, l = p.id;
    if (l == null) {
      window.lnCore.lnFill(a, null);
      return;
    }
    const s = d(a, l);
    if (!s) return;
    const n = i(s);
    window.lnCore.lnFill(a, n);
  }), window[t] = !0;
})();
function Kr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", d = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${d}+`, "g"), i).replace(new RegExp(`^${d}+|${d}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: K, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, d = Y(i), u = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function p(a) {
    if (a.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", a.tagName), this;
    const l = a.form;
    if (!l)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", a), this;
    X(this, a, d);
    const s = l.elements[this.sourceName];
    if (!s)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', a), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', a), this;
    this.dom = a, this.form = l, this.source = s, this._pristine = a.value === "", this._mirroring = !1;
    const n = this;
    return Me(a, u, {
      get: function() {
        return u.get.call(a);
      },
      set: function(f) {
        u.set.call(a, f), n._mirroring || (n._pristine = f === "" || f === null || f === void 0);
      }
    }), this._onSource = function() {
      n._pristine && n._mirror();
    }, this._onSlug = function() {
      n._mirroring || (n._pristine = n.dom.value === "");
    }, this._onFormReset = function() {
      setTimeout(function() {
        n._pristine = n.dom.value === "";
      }, 0);
    }, s.addEventListener("input", this._onSource), a.addEventListener("input", this._onSlug), l.addEventListener("reset", this._onFormReset), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  p.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Kr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), this._onFormReset && this.form && this.form.removeEventListener("reset", this._onFormReset), Object.defineProperty(this.dom, "value", u), delete this.dom[e]);
  }, H(t, e, p, "ln-slug", {
    attributes: i
  });
})();
function jr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), d = t.getTime(), u = Math.floor((d - i) / 1e3), p = Math.abs(u);
  return p < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : p < 60 ? { value: u, unit: "second", isOlderThanMonth: !1 } : p < 3600 ? { value: Math.round(u / 60), unit: "minute", isOlderThanMonth: !1 } : p < 86400 ? { value: Math.round(u / 3600), unit: "hour", isOlderThanMonth: !1 } : p < 604800 ? { value: Math.round(u / 86400), unit: "day", isOlderThanMonth: !1 } : p < 2592e3 ? { value: Math.round(u / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(u / 2592e3), unit: "month", isOlderThanMonth: !0 };
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
  function p(C) {
    return C.getAttribute("data-ln-time-locale") || J(C);
  }
  function a(C, L) {
    const I = (C || "") + "|" + JSON.stringify(L);
    return d[I] || (d[I] = new Intl.DateTimeFormat(C, L)), d[I];
  }
  function l(C) {
    const L = C || "";
    return u[L] || (u[L] = new Intl.RelativeTimeFormat(C, { numeric: "auto", style: "narrow" })), u[L];
  }
  const s = /* @__PURE__ */ new Set();
  let n = null;
  function f() {
    n || (n = setInterval(r, 6e4));
  }
  function m() {
    n && (clearInterval(n), n = null);
  }
  function r() {
    for (const C of s) {
      if (!document.body.contains(C.dom)) {
        s.delete(C);
        continue;
      }
      g(C);
    }
    s.size === 0 && m();
  }
  function v(C, L) {
    const I = Rt(L), q = (L || "").toLowerCase().split("-")[0], D = a(L, ie("full", C)), O = D.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (I && O !== q && I.monthsLong) {
      const F = I.monthsLong[C.getMonth()], U = C.getDate(), j = C.getFullYear(), G = String(C.getHours()).padStart(2, "0"), tt = String(C.getMinutes()).padStart(2, "0");
      return `${U} ${F} ${j}, ${G}:${tt}`;
    }
    return D.format(C);
  }
  function w(C, L) {
    const I = ie("short", C), q = Rt(L), D = (L || "").toLowerCase().split("-")[0], O = a(L, I), F = O.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (q && F !== D && q.monthsShort) {
      const U = q.monthsShort[C.getMonth()], j = C.getDate(), G = I.year ? " " + C.getFullYear() : "";
      return `${j} ${U}${G}`;
    }
    return O.format(C);
  }
  function h(C, L) {
    return a(L, ie("date", C)).format(C);
  }
  function b(C, L) {
    return a(L, ie("time", C)).format(C);
  }
  function o(C, L) {
    const I = jr(C);
    return I.isOlderThanMonth ? w(C, L) : l(L).format(I.value, I.unit);
  }
  function g(C) {
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
        O = v(I, D);
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
    C.dom.textContent = O, q !== "full" && (C.dom.title = v(I, D));
  }
  const _ = /* @__PURE__ */ new Set();
  let c = !1;
  function y() {
    ue(), !c && (c = !0, document.addEventListener("ln-core:locale-change", function() {
      _.forEach(function(C) {
        g(C);
      });
    }));
  }
  function E(C) {
    return this.dom = C, _.add(this), y(), g(this), C.getAttribute(t) === "relative" && (s.add(this), f()), this;
  }
  E.prototype.render = function() {
    g(this);
  }, E.prototype.destroy = function() {
    _.delete(this), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && m(), delete this.dom[e];
  };
  function A(C) {
    const L = C[e];
    if (!L) return;
    C.getAttribute(t) === "relative" ? (s.add(L), f()) : (s.delete(L), s.size === 0 && m()), g(L);
  }
  function S(C) {
    C.nodeType === 1 && C.hasAttribute && C.hasAttribute(t) && C[e] && g(C[e]);
  }
  H(t, e, E, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: A,
    onInit: S
  });
})();
function Wr(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, d = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const u = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, p = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  let l = 0, s = 0, n = 0, f = !1, m = null;
  function r(h, b) {
    p.delete(h), p.set(h, b);
  }
  function v() {
    if (p.size <= e) return [];
    const h = [];
    for (; p.size > e; ) {
      const o = p.keys().next().value;
      h.push(p.get(o)), p.delete(o);
    }
    const b = new Set(p.values());
    return h.filter((o) => !b.has(o));
  }
  function w(h, b) {
    a.add(h), clearTimeout(m), m = setTimeout(() => u(h, i, b), d);
  }
  return {
    get logicalTotal() {
      return l;
    },
    set logicalTotal(h) {
      l = h;
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
      return f;
    },
    getId: (h) => {
      if (!p.has(h)) return;
      const b = p.get(h);
      return r(h, b), b;
    },
    ensure: (h, b, o) => {
      if (!f && !a.has(0)) return w(0, o);
      if (l <= 0) return;
      const g = Math.max(0, h), _ = Math.min(l, b);
      for (let c = g; c < _; c++)
        if (!p.has(c)) {
          const y = Math.floor(c / i) * i;
          if (!a.has(y)) return w(y, o);
        }
    },
    ingest: (h, b, o, g, _) => {
      if (_ != null && _ !== n) return [];
      f = !0, o != null && (s = o), g != null && (l = g);
      for (let c = 0; c < b.length; c++)
        r(h + c, b[c]);
      return a.delete(h), v();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      f = !1, p.clear(), a.clear(), clearTimeout(m);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (h = {}) => {
      let b = [];
      return h.windowSize > 0 && h.windowSize !== e && (e = h.windowSize, b = v()), h.pageSize > 0 && (i = h.pageSize), h.fetchDebounce >= 0 && (d = h.fetchDebounce), b;
    }
  };
}
function Vr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: d, direction: u } = e, p = u === "desc", a = t.map((s) => s ? s[d] : void 0), l = He(a);
  return [...t].sort((s, n) => {
    const f = s ? s[d] : void 0, m = n ? n[d] : void 0, r = Ue(f, m, l, i);
    return p ? -r : r;
  });
}
function yi(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((d) => Array.isArray(e[d]) && e[d].length > 0);
  return i.length ? t.filter((d) => d ? i.every((u) => Ke(d[u], e[u])) : !1) : t;
}
function Gr(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const d = Vn(e);
  return d.length ? t.filter((u) => u ? d.every(
    (p) => i.some((a) => {
      const l = u[a];
      return l != null && Gn(String(l), [p]);
    })
  ) : !1) : t;
}
function $r(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const d = t.map((p) => p && p[e] != null ? parseFloat(p[e]) : NaN).filter((p) => Number.isFinite(p)), u = d.reduce((p, a) => p + a, 0);
  return i === "sum" ? u : i === "avg" && d.length ? u / d.length : 0;
}
function Qr(t, e = {}, i = [], d) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const u = t.length;
  let p = t;
  e.filters && (p = yi(p, e.filters)), e.search && (p = Gr(p, e.search, i));
  const a = p.length;
  if (e.sort && (p = Vr(p, e.sort, d)), e.offset || e.limit) {
    const l = e.offset || 0, s = e.limit || p.length;
    p = p.slice(l, l + s);
  }
  return { records: p, total: u, filtered: a };
}
function Xr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const d = { ...i };
    for (const [u, p] of Object.entries(e))
      if (typeof p == "function")
        try {
          d[u] = p(i);
        } catch {
          d[u] = void 0;
        }
    return d;
  });
}
function Yr(t, e, i, d = "_meta") {
  if (!Array.isArray(t) || !t.includes(d)) return !0;
  for (const u of Object.keys(e || {})) {
    if (!t.includes(u)) return !0;
    const p = e[u] && e[u].indexes || [], a = i && i[u] || [];
    if (p.some((l) => !a.includes(l))) return !0;
  }
  return !1;
}
function Jr(t) {
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
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: Oi, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: Ni, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, u = Y(d), p = "ln_app_cache", a = "_meta", l = "1.0";
  let s = null, n = null;
  const f = {};
  function m(T) {
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
  function v() {
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
        if (!Yr(P, x, $, a))
          return w(B), s = B, T(B);
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
          const ut = dt.target.result, Mi = dt.target.transaction;
          ut.objectStoreNames.contains(a) || ut.createObjectStore(a, { keyPath: "key" });
          for (const zt of R)
            if (ut.objectStoreNames.contains(zt)) {
              const ee = Mi.objectStore(zt);
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
    return s ? Promise.resolve(s) : (n = null, v());
  }
  async function b(T) {
    if (!Tt() || !T) return T;
    const x = { ...T }, R = x.id, N = await Zi(x);
    return !N || !N.encrypted ? T : {
      ...N,
      id: R
    };
  }
  async function o(T) {
    return !T || !T.encrypted || !Tt() ? T : tr(T, { silent: !0 });
  }
  const g = (T, x) => h().then((R) => R ? R.transaction(T, x).objectStore(T) : null);
  function _(T) {
    return new Promise((x, R) => {
      T.onsuccess = () => x(T.result), T.onerror = () => {
        m(T.error), R(T.error);
      };
    });
  }
  const c = (T) => g(T, "readonly").then((x) => x ? _(x.getAll()) : []).then((x) => Tt() ? Promise.all(x.map((R) => o(R))) : x), y = (T, x) => g(T, "readonly").then((R) => R ? _(R.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? _(R.get(Number(x))) : typeof x == "number" ? _(R.get(String(x))) : null) : null).then((R) => R ? o(R) : null), E = (T, x) => h().then((R) => {
    if (!R) return [];
    const M = R.transaction(T, "readonly").objectStore(T), B = x.map((P) => _(M.get(P)).then((z) => z !== void 0 ? z : typeof P == "string" && P.trim() !== "" && !isNaN(Number(P)) ? _(M.get(Number(P))) : typeof P == "number" ? _(M.get(String(P))) : null));
    return Promise.all(B).then((P) => Tt() ? Promise.all(P.map((z) => z ? o(z) : null)) : P);
  }), A = (T, x) => (Tt() ? b(x) : Promise.resolve(x)).then((N) => g(T, "readwrite").then((M) => M ? _(M.put(N)) : null)), S = (T, x) => g(T, "readwrite").then((R) => R ? _(R.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return _(R.delete(Number(x)));
    if (typeof x == "number")
      return _(R.delete(String(x)));
  }) : null), C = (T) => g(T, "readwrite").then((x) => x ? _(x.clear()) : null), L = (T) => g(T, "readonly").then((x) => x ? _(x.count()) : 0), I = (T) => g(a, "readonly").then((x) => x ? _(x.get(T)) : null), q = (T, x) => g(a, "readwrite").then((R) => {
    if (R)
      return x.key = T, _(R.put(x));
  });
  function D(T) {
    return this.dom = T, this._name = T.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", T), X(this, T, u), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, T.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Wr({
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
        schema_version: l,
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
    return y(T._name, x).then((M) => {
      if (!M) throw new Error(`Record not found: ${x}`);
      const B = M.id, P = { ...M, ...R, id: B }, z = R.id, $ = z !== void 0 && z !== B;
      return ($ ? Ai(T._name, B, { ...P, id: z }) : A(T._name, P)).then(() => U(T, 0)).then(() => {
        k(T.dom, "ln-data-store:updated", { store: T._name, record: $ ? { ...P, id: z } : P, previous: M, requestId: N });
      });
    });
  }
  function tt(T, { id: x, requestId: R } = {}) {
    return y(T._name, x).then((N) => {
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
    return x.length ? Promise.all(x.map((N) => y(T._name, N))).then((N) => {
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
    return v().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return I(T._name);
    }).then((x) => {
      if (T.initializationError = null, x && x.schema_version === l)
        T.lastSyncedAt = x.last_synced_at || null, T.totalCount = x.record_count || 0, T.hasCache = x.has_cache === !0 || T.totalCount > 0, T.hasCache && (T.isLoaded = !0, T.canServe = !0, k(T.dom, "ln-data-store:ready", { store: T._name, count: T.totalCount, source: "cache" })), T.isInitialized = !0, k(T.dom, "ln-data-store:initialized", { store: T._name, hasCache: T.hasCache, lastSyncedAt: T.lastSyncedAt, count: T.totalCount });
      else {
        if (x && x.schema_version !== l)
          return C(T._name).then(() => q(T._name, { schema_version: l, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
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
        m(z.error), P(z.error);
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
  function Ai(T, x, R) {
    return (Tt() ? b(R) : Promise.resolve(R)).then((M) => h().then((B) => {
      if (B)
        return new Promise((P, z) => {
          const $ = B.transaction(T, "readwrite"), et = $.objectStore(T);
          et.put(M), et.delete(x), $.oncomplete = () => P(), $.onerror = () => {
            m($.error), z($.error);
          };
        });
    }));
  }
  const Si = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function Ci(T) {
    return T ? Object.keys(T).filter((x) => Array.isArray(T[x]) && T[x].length > 0) : [];
  }
  function Ti(T, x, R) {
    return x.every((N) => R[N].map(String).includes(String(T[N])));
  }
  function ki(T) {
    return String(T || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Li(T, x, R) {
    return x.every(
      (N) => R.some((M) => {
        const B = T[M];
        return B != null && String(B).toLowerCase().includes(N);
      })
    );
  }
  function xi(T, x, R) {
    return $r(T, x, R);
  }
  function Ut(T, x) {
    return Xr(x, T.presenters && T.presenters.computed);
  }
  function Ii(T) {
    return !T.sort && !Tt();
  }
  function qi(T, x, R) {
    const N = Ci(x.filters), M = x.search ? ki(x.search) : [], B = T._searchFields, P = M.length > 0 && B && B.length > 0;
    return g(T._name, "readonly").then((z) => z ? new Promise(($, et) => {
      const qt = [], vt = z.openCursor();
      vt.onsuccess = () => {
        const ht = vt.result;
        if (!ht || qt.length >= R) {
          $(qt);
          return;
        }
        const pt = ht.value;
        (!N.length || Ti(pt, N, x.filters)) && (!P || Li(pt, M, B)) && qt.push(pt), ht.continue();
      }, vt.onerror = () => et(vt.error);
    }) : []);
  }
  function Ge(T, x, R) {
    return Qr(x, R, T._searchFields, Si);
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
        return Ii(T) ? qi(x, T, M).then((P) => B(P.slice(R, M))) : c(x._name).then((P) => B(Ge(x, P, T).records));
      }
      return $e(x, R, N);
    }
    return c(x._name).then((R) => {
      const N = Ge(x, R, T);
      return {
        data: Ut(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, D.prototype.getById = function(T) {
    return y(this._name, T).then((x) => x ? Ut(this, [x])[0] : null);
  }, D.prototype.count = function(T) {
    return T && Object.keys(T).length > 0 ? c(this._name).then((R) => yi(R, T).length) : this.windowed && this.totalCount != null ? Promise.resolve(this.totalCount) : L(this._name);
  }, D.prototype.aggregate = function(T, x) {
    return c(this._name).then((R) => xi(R, T, x));
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
      schema_version: l,
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
      }), Jr(P);
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
      schema_version: l,
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
  function Di() {
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
  const Ri = "data-ln-data-store-frozen";
  function Qe(T, x) {
    T.setAttribute(Ri, x);
  }
  function Oi(T) {
    const x = T[e];
    if (!x._windowIndex) return;
    const R = x._windowIndex.configure({ windowSize: x._windowSize });
    R.length && yt(x._name, R).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function Ni(T) {
    const x = T[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  H(t, e, D, "ln-data-store", {
    attributes: d
  }), window[e].clearAll = Di, window[e].init = window[e], window[e].setStorageKey = tn, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = tn);
})();
const Zr = {
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
function to(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, Zr);
  if (e && typeof e == "object")
    for (const u in e)
      e[u] !== void 0 && e[u] !== null && e[u] !== "" && (i[u] = e[u]);
  const d = new URLSearchParams();
  return t.search && d.append(i.search, t.search), t.offset != null && d.append(i.offset, t.offset), t.limit != null && d.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (d.append(i.sortField, t.sort.field), d.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((u) => {
    const p = t.filters[u];
    Array.isArray(p) && p.length > 0 && d.append(u, p.join(","));
  }), d.toString();
}
function eo(t, e, i) {
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
  }, p = Y(u);
  function a(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((f) => {
      const m = new Error("HTTP " + n.status + ": " + n.statusText);
      throw m.status = n.status, m.data = f, m;
    });
  }
  function l(n) {
    return this.dom = n, X(this, n, p), n[e] = this, n[i] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, s(this), this;
  }
  l.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = Sn(this.rawHeaders);
    const f = {}, m = n.getAttribute("data-ln-api-param-offset");
    m && (f.offset = m);
    const r = n.getAttribute("data-ln-api-param-limit");
    r && (f.limit = r);
    const v = n.getAttribute("data-ln-api-param-search");
    v && (f.search = v);
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
  }, l.prototype._reqHeaders = function(n) {
    const f = Object.assign({}, this.headers);
    return !f.Accept && !f.accept && (f.Accept = "application/json"), !f["Content-Type"] && !f["content-type"] && (f["Content-Type"] = "application/json"), n && (f["X-Idempotency-Key"] = n), f;
  }, l.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, l.prototype.fetchDelta = function(n, f) {
    const m = this;
    let r = Dt(m.baseUrl, m.path);
    n != null && n !== "" && (r += (r.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const v = f || "sync";
    m._inflight.has(v) && m._inflight.get(v).abort();
    const w = new AbortController();
    return m._inflight.set(v, w), window.fetch(r, {
      method: "GET",
      headers: m._reqHeaders(),
      credentials: m.credentials,
      signal: w.signal
    }).then(a).finally(function() {
      m._inflight.get(v) === w && m._inflight.delete(v);
    });
  }, l.prototype.query = function(n, f) {
    const m = this, r = to(n, m.paramKeys), v = eo(m.baseUrl, m.path, r), w = f || "query";
    m._inflight.has(w) && m._inflight.get(w).abort();
    const h = new AbortController();
    return m._inflight.set(w, h), window.fetch(v, {
      method: "GET",
      headers: m._reqHeaders(),
      credentials: m.credentials,
      signal: h.signal
    }).then(a).finally(function() {
      m._inflight.get(w) === h && m._inflight.delete(w);
    });
  }, l.prototype.create = function(n, f, m) {
    const r = this;
    return window.fetch(Dt(r.baseUrl, f || r.path), {
      method: "POST",
      headers: r._reqHeaders(m),
      credentials: r.credentials,
      body: JSON.stringify(n)
    }).then(a);
  }, l.prototype.update = function(n, f, m, r, v) {
    const w = this;
    m != null && (f = Object.assign({}, f, { expected_version: m }));
    const h = r ? Dt(w.baseUrl, r) : Dt(w.baseUrl, w.path, n);
    return window.fetch(h, {
      method: "PUT",
      headers: w._reqHeaders(v),
      credentials: w.credentials,
      body: JSON.stringify(f)
    }).then(a);
  }, l.prototype.delete = function(n, f, m) {
    const r = this;
    return window.fetch(Dt(r.baseUrl, f || r.path, n), {
      method: "DELETE",
      headers: r._reqHeaders(m),
      credentials: r.credentials
    }).then(a);
  }, l.prototype.bulkDelete = function(n, f, m) {
    const r = this;
    return window.fetch(Dt(r.baseUrl, f || r.path, "bulk-delete"), {
      method: "DELETE",
      headers: r._reqHeaders(m),
      credentials: r.credentials,
      body: JSON.stringify({ ids: n })
    }).then(a);
  };
  function s(n) {
    n._handlers = {
      sync: function(f) {
        const m = f.detail || {}, r = m.meta && m.meta.targetEl ? m.meta.targetEl : null;
        n.fetchDelta(m.since, r).then(function(v) {
          k(n.dom, "ln-api-connector:fetched", { data: v, since: m.since, meta: m.meta || null });
        }).catch(function(v) {
          v && v.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: v.message,
            status: v.status || 0,
            data: v.data || null,
            since: m.since,
            meta: m.meta || null
          });
        });
      },
      query: function(f) {
        const m = f.detail || {}, r = m.query || m, v = m.meta && m.meta.targetEl ? m.meta.targetEl : null, w = v || "query", h = n.queryDebounce;
        function b(g, _, c) {
          n.query(_, c).then(function(y) {
            const E = y || {};
            k(n.dom, "ln-api-connector:fetched", {
              data: E.data || (Array.isArray(E) ? E : []),
              total: E.total,
              filtered: E.filtered,
              offset: _.offset,
              queryGen: _.queryGen,
              meta: g.meta || null
            });
          }).catch(function(y) {
            y && y.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
              action: "query",
              error: y.message,
              status: y.status || 0,
              data: y.data || null,
              meta: g.meta || null
            });
          });
        }
        if (h === 0) {
          b(m, r, v);
          return;
        }
        n._queryTimers.has(w) && clearTimeout(n._queryTimers.get(w));
        const o = setTimeout(function() {
          n._queryTimers.delete(w), b(m, r, v);
        }, h);
        n._queryTimers.set(w, o);
      },
      cancel: function(f) {
        const m = f.detail || {}, r = m.meta && m.meta.targetEl ? m.meta.targetEl : m.targetEl || m.key;
        r && n.cancel(r);
      },
      create: function(f) {
        const m = f.detail || {};
        n.create(m.data, m.url, m.idempotencyKey).then(function(r) {
          const v = mn(r);
          k(n.dom, "ln-api-connector:created", {
            record: v.record,
            tempId: m.tempId,
            message: v.message,
            meta: m.meta || null
          });
        }).catch(function(r) {
          r && r.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "create",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            tempId: m.tempId,
            meta: m.meta || null
          });
        });
      },
      update: function(f) {
        const m = f.detail || {};
        n.update(m.id, m.data, m.expected_version, m.url, m.idempotencyKey).then(function(r) {
          const v = mn(r);
          k(n.dom, "ln-api-connector:updated", {
            record: v.record,
            id: m.id,
            message: v.message,
            meta: m.meta || null
          });
        }).catch(function(r) {
          r && r.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "update",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            id: m.id,
            conflictData: r.status === 409 ? r.data : null,
            meta: m.meta || null
          });
        });
      },
      delete: function(f) {
        const m = f.detail || {};
        n.delete(m.id, m.url, m.idempotencyKey).then(function(r) {
          const v = r && r.message ? r.message : null;
          k(n.dom, "ln-api-connector:deleted", {
            response: r,
            id: m.id,
            message: v,
            meta: m.meta || null
          });
        }).catch(function(r) {
          r && r.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            id: m.id,
            meta: m.meta || null
          });
        });
      },
      bulkDelete: function(f) {
        const m = f.detail || {};
        n.bulkDelete(m.ids, m.url, m.idempotencyKey).then(function(r) {
          const v = r && r.message ? r.message : null;
          k(n.dom, "ln-api-connector:bulk-deleted", {
            response: r,
            ids: m.ids,
            message: v,
            meta: m.meta || null
          });
        }).catch(function(r) {
          r && r.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: r.message,
            status: r.status || 0,
            data: r.data || null,
            ids: m.ids,
            meta: m.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(f) {
      f.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(f) {
      f && clearTimeout(f);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, l, "ln-api-connector", {
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
  }, p = Y(u);
  function a(w) {
    const h = w && w.content !== void 0 ? w.content : w, b = w && w.message ? w.message : null;
    return { content: h, message: b };
  }
  function l(w) {
    return this.dom = w, X(this, w, p), w[e] = this, w[i] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, v(this), this;
  }
  l.prototype.refreshConfig = function() {
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
    const o = Object.assign({}, Kt(w.headers, w.auth), b || {});
    return h && (o["Idempotency-Key"] = h), o;
  }
  l.prototype.fetchDelta = function(w) {
    const h = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const b = this._deltaController.signal, o = ["include_docs=true", "feed=normal"];
    w && o.push("since=" + encodeURIComponent(w));
    const g = Ct(h.url, h.db, "_changes") + "?" + o.join("&");
    return window.fetch(g, { method: "GET", headers: Kt(h.headers, h.auth), credentials: h.credentials, signal: b }).then((_) => {
      if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
      return _.json();
    }).then((_) => {
      const c = _.results || [];
      return {
        data: c.filter((y) => !y.deleted && y.doc).map((y) => Object.assign({}, y.doc, { id: y.doc._id })),
        deleted: c.filter((y) => y.deleted).map((y) => y.id),
        synced_at: _.last_seq || w || ""
      };
    }).finally(() => {
      h._deltaController && h._deltaController.signal === b && (h._deltaController = null);
    });
  };
  function n(w, h, b) {
    const o = Object.assign({ _id: h.id }, h);
    return o._id || delete o._id, window.fetch(Ct(w.url, w.db), {
      method: "POST",
      headers: s(w, b),
      credentials: w.credentials,
      body: JSON.stringify(o)
    }).then((g) => {
      if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
      return g.json();
    }).then((g) => {
      const _ = a(g), c = _.content;
      return { record: Object.assign({}, o, { id: c.id, _id: c.id, _rev: c.rev }), message: _.message };
    });
  }
  l.prototype.create = function(w, h) {
    return n(this, w, h).then((b) => b.record);
  };
  function f(w, h, b, o) {
    const g = Object.assign({ id: String(h), _id: String(h) }, b), _ = g._rev || g.rev;
    return (_ ? Promise.resolve(_) : window.fetch(Ct(w.url, w.db, null, h), { method: "GET", headers: Kt(w.headers, w.auth), credentials: w.credentials }).then((y) => {
      if (!y.ok) throw new Error("Could not retrieve document for revision mapping");
      return y.json().then((E) => E._rev);
    })).then((y) => {
      const E = Object.assign({}, g, { _rev: y });
      delete E.rev;
      const A = s(w, o, { "If-Match": y });
      return window.fetch(Ct(w.url, w.db, null, h), {
        method: "PUT",
        headers: A,
        credentials: w.credentials,
        body: JSON.stringify(E)
      }).then((S) => {
        if (S.ok) return S.json().then((C) => {
          const L = a(C);
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
  l.prototype.update = function(w, h, b) {
    return f(this, w, h, b).then((o) => o.record);
  };
  function m(w, h, b, o) {
    return (b ? Promise.resolve(b) : window.fetch(Ct(w.url, w.db, null, h), { method: "GET", headers: Kt(w.headers, w.auth), credentials: w.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision delete");
      return _.json().then((c) => c._rev);
    })).then((_) => {
      const c = Ct(w.url, w.db, null, h) + "?rev=" + encodeURIComponent(_);
      return window.fetch(c, { method: "DELETE", headers: s(w, o), credentials: w.credentials }).then((y) => {
        if (!y.ok) throw new Error("HTTP " + y.status + ": " + y.statusText);
        return y.json();
      }).then((y) => {
        const E = a(y);
        return { response: E.content, message: E.message };
      });
    });
  }
  l.prototype.delete = function(w, h, b) {
    return m(this, w, h, b).then((o) => o.response);
  };
  function r(w, h, b) {
    return !h || h.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Ct(w.url, w.db, "_all_docs"), {
      method: "POST",
      headers: Kt(w.headers, w.auth),
      credentials: w.credentials,
      body: JSON.stringify({ keys: h })
    }).then((o) => {
      if (!o.ok) throw new Error("HTTP " + o.status + ": " + o.statusText);
      return o.json();
    }).then((o) => {
      const _ = (o.rows || []).filter((c) => !c.error && c.value && c.value.rev).map((c) => ({ _id: c.id, _rev: c.value.rev, _deleted: !0 }));
      return _.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Ct(w.url, w.db, "_bulk_docs"), {
        method: "POST",
        headers: s(w, b),
        credentials: w.credentials,
        body: JSON.stringify({ docs: _ })
      }).then((c) => {
        if (!c.ok) throw new Error("HTTP " + c.status + ": " + c.statusText);
        return c.json();
      }).then((c) => {
        const y = a(c);
        return { response: { ok: !0, results: y.content, deletedCount: _.length }, message: y.message };
      });
    });
  }
  l.prototype.bulkDelete = function(w, h) {
    return r(this, w, h).then((b) => b.response);
  };
  function v(w) {
    w._handlers = {
      sync: function(h) {
        const b = h.detail || {};
        w.fetchDelta(b.since).then(function(o) {
          k(w.dom, "ln-couchdb-connector:fetched", { data: o, since: b.since, meta: b.meta || null });
        }).catch(function(o) {
          o && o.name === "AbortError" || k(w.dom, "ln-couchdb-connector:error", {
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
        n(w, b.data, b.idempotencyKey).then(function(o) {
          k(w.dom, "ln-couchdb-connector:created", { record: o.record, tempId: b.tempId, message: o.message, meta: b.meta || null });
        }).catch(function(o) {
          k(w.dom, "ln-couchdb-connector:error", {
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
        b.expected_version !== void 0 && (o._rev = b.expected_version), f(w, b.id, o, b.idempotencyKey).then(function(g) {
          k(w.dom, "ln-couchdb-connector:updated", { record: g.record, id: b.id, message: g.message, meta: b.meta || null });
        }).catch(function(g) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: g.message,
            status: g.status || 0,
            id: b.id,
            data: g.status === 409 ? g.data : null,
            conflictData: g.status === 409 ? g.data : null,
            meta: b.meta || null
          });
        });
      },
      delete: function(h) {
        const b = h.detail || {};
        m(w, b.id, b.rev, b.idempotencyKey).then(function(o) {
          k(w.dom, "ln-couchdb-connector:deleted", { response: o.response, id: b.id, message: o.message, meta: b.meta || null });
        }).catch(function(o) {
          k(w.dom, "ln-couchdb-connector:error", {
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
        r(w, b.ids, b.idempotencyKey).then(function(o) {
          k(w.dom, "ln-couchdb-connector:bulk-deleted", { response: o.response, ids: b.ids, message: o.message, meta: b.meta || null });
        }).catch(function(o) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: o.message,
            status: o.status || 0,
            ids: b.ids,
            meta: b.meta || null
          });
        });
      }
    }, w.dom.addEventListener("ln-couchdb-connector:request-sync", w._handlers.sync), w.dom.addEventListener("ln-couchdb-connector:request-create", w._handlers.create), w.dom.addEventListener("ln-couchdb-connector:request-update", w._handlers.update), w.dom.addEventListener("ln-couchdb-connector:request-delete", w._handlers.delete), w.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", w._handlers.bulkDelete);
  }
  l.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const w = this;
    w._deltaController && (w._deltaController.abort(), w._deltaController = null), w._handlers && (w.dom.removeEventListener("ln-couchdb-connector:request-sync", w._handlers.sync), w.dom.removeEventListener("ln-couchdb-connector:request-create", w._handlers.create), w.dom.removeEventListener("ln-couchdb-connector:request-update", w._handlers.update), w.dom.removeEventListener("ln-couchdb-connector:request-delete", w._handlers.delete), w.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", w._handlers.bulkDelete), w._handlers = null), delete this.dom[e], delete this.dom[i];
  }, H(t, e, l, "ln-couchdb-connector", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  const d = 1e3, u = 3e4;
  function p(r) {
    const v = r[e];
    v && (v.command === "connect" ? v._open() : v._disconnect());
  }
  function a(r) {
    const v = r[e];
    !v || v.command !== "connect" || (v._drop("url-changed"), v._open());
  }
  const l = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: p, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: K, type: "string", fallback: "", effect: a, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, s = Y(l), n = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function f(r, v) {
    return r === "sync" ? { since: v.since } : r === "query" ? { query: v.query || {} } : r === "create" ? { data: v.data, idempotencyKey: v.idempotencyKey } : r === "update" ? { id: v.id, data: v.data, expected_version: v.expected_version, idempotencyKey: v.idempotencyKey } : r === "delete" ? { id: v.id, idempotencyKey: v.idempotencyKey } : { ids: v.ids, idempotencyKey: v.idempotencyKey };
  }
  function m(r) {
    this.dom = r, X(this, r, s), r[e] = this, r[i] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const v = this;
    this._onRequest = function(w) {
      v._request(n[w.type], w.detail || {});
    };
    for (const w in n) r.addEventListener(w, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  m.prototype._open = function() {
    if (this._socket || this._timer) return;
    const r = this, v = this.url;
    this._attempt++, this._status = "connecting", k(this.dom, "ln-websocket-connector:connecting", { url: v, attempt: this._attempt });
    let w;
    try {
      w = new WebSocket(v);
    } catch (h) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, h.message), this._held = [], k(this.dom, "ln-websocket-connector:disconnected", { url: v, code: 0, reason: h.message, willReconnect: !1 });
      return;
    }
    this._socket = w, w.onopen = function() {
      r._status = "connected", r._attempt = 0, k(r.dom, "ln-websocket-connector:connected", { url: v });
      const h = r._held;
      r._held = [];
      for (let b = 0; b < h.length; b++) r._send(h[b]);
    }, w.onmessage = function(h) {
      r._receive(h.data);
    }, w.onclose = function(h) {
      r._socket = null, r._status = "disconnected", r._failPending("connection closed");
      const b = r.command === "connect";
      k(r.dom, "ln-websocket-connector:disconnected", { url: v, code: h.code, reason: h.reason, willReconnect: b }), b && r._scheduleReconnect();
    };
  }, m.prototype._scheduleReconnect = function() {
    const r = this, v = Math.min(d * Math.pow(2, Math.max(0, this._attempt - 1)), u);
    this._timer = setTimeout(function() {
      r._timer = null, r._open();
    }, v);
  }, m.prototype._drop = function(r) {
    const v = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, r), this._socket = null), v && (this._status = "disconnected", this._failPending("connection closed"), k(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: r, willReconnect: !1 }));
  }, m.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, m.prototype._request = function(r, v) {
    const w = { ref: String(++this._seq), type: r, detail: v };
    this._status === "connected" ? this._send(w) : this.command === "connect" ? this._held.push(w) : this._fail(w, 0, "disconnected", null);
  }, m.prototype._send = function(r) {
    this._pending.set(r.ref, r), this._socket.send(JSON.stringify(Object.assign({ ref: r.ref, type: r.type }, f(r.type, r.detail))));
  }, m.prototype._receive = function(r) {
    let v;
    try {
      v = JSON.parse(r);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", r);
      return;
    }
    if (v.ref !== void 0) {
      const w = this._pending.get(String(v.ref));
      if (!w) return;
      this._pending.delete(w.ref), v.ok ? this._resolve(w, v.content, v.message || null) : this._fail(w, v.status || 0, v.error, v.data);
      return;
    }
    v.type === "changes" && k(this.dom, "ln-websocket-connector:fetched", {
      data: { data: v.data || [], deleted: v.deleted || [], synced_at: v.synced_at },
      since: null,
      meta: null
    });
  }, m.prototype._resolve = function(r, v, w) {
    const h = r.detail, b = h.meta || null, o = this.dom;
    if (r.type === "sync")
      k(o, "ln-websocket-connector:fetched", { data: v, since: h.since, meta: b });
    else if (r.type === "query") {
      const g = h.query || {}, _ = v || {};
      k(o, "ln-websocket-connector:fetched", {
        data: _.data || [],
        total: _.total,
        filtered: _.filtered,
        offset: g.offset,
        queryGen: g.queryGen,
        meta: b
      });
    } else r.type === "create" ? k(o, "ln-websocket-connector:created", { record: v, tempId: h.tempId, message: w, meta: b }) : r.type === "update" ? k(o, "ln-websocket-connector:updated", { record: v, id: h.id, message: w, meta: b }) : r.type === "delete" ? k(o, "ln-websocket-connector:deleted", { response: v, id: h.id, message: w, meta: b }) : k(o, "ln-websocket-connector:bulk-deleted", { response: v, ids: h.ids, message: w, meta: b });
  }, m.prototype._fail = function(r, v, w, h) {
    const b = r.detail;
    k(this.dom, "ln-websocket-connector:error", {
      action: r.type,
      error: w,
      status: v,
      data: h || null,
      conflictData: v === 409 && h || null,
      since: b.since,
      id: b.id,
      ids: b.ids,
      tempId: b.tempId,
      meta: b.meta || null
    });
  }, m.prototype._failAll = function(r, v) {
    for (let w = 0; w < r.length; w++) this._fail(r[w], 0, v, null);
  }, m.prototype._failPending = function(r) {
    const v = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(v, r);
  }, m.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const r in n) this.dom.removeEventListener(r, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[i];
    }
  }, H(t, e, m, "ln-websocket-connector", {
    attributes: l
  });
})();
function no(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function io(t, e) {
  const i = !t || !!t.initializationError, d = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || d) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function gn(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class ro {
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
  const d = "data-ln-data-coordinator-search", u = "data-ln-data-coordinator-filters", p = "data-ln-data-coordinator-sort-field", a = "data-ln-data-coordinator-sort-direction", s = Y({
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
    const o = h.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (o) return o;
    for (const g of h.querySelectorAll("*")) {
      if (g.lnConnector) return g;
      for (const _ of g.attributes) if (_.name.startsWith("data-ln-") && _.name.endsWith("-connector")) return g;
    }
    return null;
  }
  function m(h) {
    var o;
    if (!h) return "ln-connector";
    if ((o = h.lnConnector) != null && o.namespace) return h.lnConnector.namespace;
    const b = h.getAttribute("data-ln-connector");
    if (b && b !== "true") return b.startsWith("ln-") ? b : "ln-" + b + (b.endsWith("-connector") ? "" : "-connector");
    for (const g of h.attributes) if (g.name.startsWith("data-ln-") && g.name.endsWith("-connector")) return g.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function r(h) {
    const b = this;
    return this.dom = h, X(this, h, s), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", h), h[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new ro(), this._queueQueryRefresh = Ht(() => {
      b._destroyed || b._refreshAll(null, !0);
    }), this.refreshMapper(), v(this), this._checkInitialSync(), this;
  }
  r.prototype._noAutosync = function(h) {
    var b;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((b = h.storeEl) != null && b.hasAttribute("data-ln-data-store-no-autosync"));
  }, r.prototype._isStale = function(h) {
    var o, g;
    const b = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((o = h.storeEl) == null ? void 0 : o.getAttribute("data-ln-data-store-stale"));
    return b === "never" || b === "-1" ? !1 : !((g = h.store) != null && g.lastSyncedAt) || Date.now() / 1e3 - h.store.lastSyncedAt > (parseInt(b, 10) || 300);
  }, r.prototype._checkInitialSync = function() {
    const h = this, b = this.findChildren();
    b.store && Promise.resolve(b.store.ready).then(() => {
      if (h._destroyed) return;
      const o = h.findChildren();
      o.store && o.connector && !h._noAutosync(o) && !o.store.isSyncing && (!o.store.hasCache || h._isStale(o)) && o.store.forceSync();
    }).catch((o) => h._reportError("store-initialize", o, null));
  }, r.prototype.refreshMapper = function() {
    var o, g;
    const h = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, b = h && ((g = (o = window.lnCore) == null ? void 0 : o.getDataMapper) == null ? void 0 : g.call(o, h)) || null;
    this.mapper = { ingress: (b == null ? void 0 : b.ingress) || ((_) => _), egress: (b == null ? void 0 : b.egress) || ((_) => _) };
  }, r.prototype.findChildren = function() {
    const h = this.dom.querySelector("[data-ln-data-store]"), b = f(this.dom), o = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: h, connectorEl: b, queueEl: o, store: (h == null ? void 0 : h.lnDataStore) || null, connector: (b == null ? void 0 : b.lnConnector) || (b == null ? void 0 : b.lnApiConnector) || (b == null ? void 0 : b.lnCouchDbConnector) || (b == null ? void 0 : b.lnWebsocketConnector) || null, queue: (o == null ? void 0 : o.lnApiQueue) || null };
  }, r.prototype._fanOutRemote = function(h, b, o, g) {
    this.refreshMapper(), h.queue ? k(h.queueEl, "ln-api-queue:request-enqueue", o) : h.connector && k(h.connectorEl, m(h.connectorEl) + ":request-" + b, g);
  }, r.prototype._fanOutCreate = function(h, b, o) {
    const g = "_temp_" + wt(), _ = this.mapper.egress(b);
    h.storeEl && k(h.storeEl, "ln-data-store:request-create", { tempId: g, data: _ }), this._fanOutRemote(h, "create", { chainKey: g, op: "create", targetId: null, payload: _, expectedVersion: null, meta: { tempId: g, action: o } }, { data: _, url: o, meta: { entryId: wt(), queued: !1, op: "create", tempId: g } });
  }, r.prototype._fanOutUpdate = function(h, b, o, g, _) {
    const c = this.mapper.egress(o);
    h.storeEl && k(h.storeEl, "ln-data-store:request-update", { id: b, data: c }), this._fanOutRemote(h, "update", { chainKey: b, op: "update", targetId: b, payload: c, expectedVersion: g, meta: { id: b, action: _ } }, { id: b, data: c, expected_version: g, url: _, meta: { entryId: wt(), queued: !1, op: "update", id: b } });
  }, r.prototype._fanOutDelete = function(h, b) {
    h.storeEl && k(h.storeEl, "ln-data-store:request-delete", { id: b }), this._fanOutRemote(h, "delete", { chainKey: b, op: "delete", targetId: b, payload: null, expectedVersion: null, meta: { id: b } }, { id: b, meta: { entryId: wt(), queued: !1, op: "delete", id: b } });
  }, r.prototype._fanOutBulkDelete = function(h, b) {
    const o = b.join(",");
    h.storeEl && k(h.storeEl, "ln-data-store:request-bulk-delete", { ids: b }), this._fanOutRemote(h, "bulk-delete", { chainKey: o, op: "bulk-delete", targetId: null, payload: { ids: b }, expectedVersion: null, meta: { bulkKey: o, ids: b } }, { ids: b, meta: { entryId: wt(), queued: !1, op: "bulk-delete", bulkKey: o } });
  }, r.prototype._requestStoreMutation = function(h, b, o) {
    if (!h.storeEl) return Promise.reject(new Error("Store element not found"));
    const g = wt(), _ = this._mutationReceipts.wait(g);
    return k(h.storeEl, "ln-data-store:request-" + b, Object.assign({}, o, { requestId: g })), _;
  }, r.prototype._reportError = function(h, b, o) {
    this._destroyed || k(this.dom, "ln-data-coordinator:error", { operation: h, error: b, meta: o || null });
  }, r.prototype._owns = function(h) {
    var o;
    const b = this._name || ((o = this.findChildren().storeEl) == null ? void 0 : o.id);
    return !!h && h === b;
  }, r.prototype._currentQuery = function() {
    const h = this.dom.getAttribute(p), b = this.dom.getAttribute(a), o = new URLSearchParams(this.dom.getAttribute(u) || ""), g = {};
    for (const _ of new Set(o.keys())) g[_] = o.getAll(_);
    return { search: this.dom.getAttribute(d) || "", filters: g, sort: h && b ? { field: h, direction: b } : null };
  }, r.prototype._refreshAll = function(h, b) {
    for (const [o, g, _] of n)
      for (const c of this.dom.ownerDocument.querySelectorAll(o))
        if (this._owns(c.getAttribute(g))) {
          if ((_ === "table" || _ === "list") && c.hasAttribute(_ === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            k(c, "ln-" + _ + (b ? ":request-invalidate" : ":request-revalidate"), {});
            continue;
          }
          this._serveElement(c, _, null, h);
        }
  }, r.prototype._serveElement = function(h, b, o, g) {
    const _ = this.findChildren(), c = _.store;
    if (!c) return;
    o && this._boundQueries.set(h, o);
    const y = this._boundQueries.get(h) || { sort: null, filters: {}, search: "" }, E = gn(y, this._currentQuery()), A = this;
    return Promise.resolve(c.ready).then(() => {
      if (A._destroyed) return;
      const S = io(c, _.connector);
      if (b === "table" || b === "list" || b === "chart")
        return S === "remote" ? (k(h, "ln-" + b + ":set-loading", { loading: !0 }), k(_.connectorEl, m(_.connectorEl) + ":request-query", { query: E, meta: { targetEl: h, kind: b, offset: E.offset, limit: E.limit, queryGen: y.queryGen } })) : S !== "store" ? k(h, "ln-" + b + ":set-loading", { loading: !1 }) : c.getAll(E).then((C) => {
          A._destroyed || !A._boundDelivered || (k(h, "ln-" + b + ":set-loading", { loading: !1 }), k(h, "ln-" + b + ":set-data", { data: C.data, total: (g == null ? void 0 : g.total) ?? C.total, filtered: (g == null ? void 0 : g.filtered) ?? C.filtered, offset: C.offset ?? (g == null ? void 0 : g.offset) ?? y.offset, queryGen: y.queryGen !== void 0 ? y.queryGen : (g == null ? void 0 : g.queryGen) ?? C.queryGen, provisional: C.provisional === !0 }), A._boundDelivered.set(h, !0));
        });
      if (b === "options") {
        if (S === "remote") return k(_.connectorEl, m(_.connectorEl) + ":request-query", { query: {}, meta: { targetEl: h, kind: b } });
        if (S === "store") return c.getAll({}).then((C) => !A._destroyed && k(h, "ln-options:set-data", { data: C.data }));
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
        const L = _.connector && c && (c.windowed && C && Object.keys(C).length || c.noLocalQuery) ? "remote" : S;
        if (L === "remote") return k(_.connectorEl, m(_.connectorEl) + ":request-query", { query: { filters: C }, meta: { targetEl: h, kind: b } });
        if (L === "store") return c.count(C).then((I) => !A._destroyed && k(h, "ln-stat:set-count", { count: I }));
      }
    }).catch((S) => {
      A._destroyed || ((b === "table" || b === "list" || b === "chart") && k(h, "ln-" + b + ":set-loading", { loading: !1 }), A._reportError(b + "-query", S, { targetEl: h, kind: b }));
    });
  };
  function v(h) {
    const b = h._unsubs = [], o = (A, S, C) => {
      A.addEventListener(S, C), b.push(() => A.removeEventListener(S, C));
    };
    o(h.dom, "ln-data-store:request-remote-sync", (A) => {
      h.refreshMapper();
      const S = h.findChildren();
      S.store && S.connector && k(S.connectorEl, m(S.connectorEl) + ":request-sync", { since: A.detail.since, meta: { op: "sync" } });
    }), o(h.dom, "ln-data-store:request-page", (A) => {
      const S = h.findChildren(), C = A.detail || {};
      if (!S.connectorEl) return;
      const L = gn(C.query || {}, h._currentQuery());
      k(S.connectorEl, m(S.connectorEl) + ":request-query", {
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
    const g = () => {
      const A = h.findChildren();
      A.store && !A.store.initializationError && A.connector && !h._noAutosync(A) && A.store.isInitialized && !A.store.isSyncing && A.store.forceSync();
    };
    o(h.dom, "ln-websocket-connector:connected", g), o(document, "submit", (A) => h._onFormSubmit(A));
    const _ = (A, S, C) => {
      var L;
      h._owns(A.target.getAttribute(C)) && h._serveElement(A.target, S, S === "stat" ? { filters: ((L = A.detail) == null ? void 0 : L.filters) || null } : S === "options" ? null : no(A.detail || {}), null);
    };
    o(document, "ln-table:request-data", (A) => _(A, "table", "data-ln-table-source")), o(document, "ln-list:request-data", (A) => _(A, "list", "data-ln-list-source")), o(document, "ln-chart:request-data", (A) => _(A, "chart", "data-ln-chart-source")), o(document, "ln-options:request-data", (A) => _(A, "options", "data-ln-options")), o(document, "ln-stat:request-count", (A) => _(A, "stat", "data-ln-stat"));
    const c = (A) => {
      h._mutationReceipts.resolve(A.detail), h._refreshAll(null, !1);
    };
    o(h.dom, "ln-data-store:ready", c), o(h.dom, "ln-data-store:created", c), o(h.dom, "ln-data-store:updated", c), o(h.dom, "ln-data-store:deleted", c), o(h.dom, "ln-data-store:mutation-error", (A) => h._mutationReceipts.reject(A.detail)), o(h.dom, "ln-data-store:synced", (A) => {
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
      D ? h.dom.setAttribute(u, D) : h.dom.removeAttribute(u);
    }), o(h.dom, "ln-sort:change", (A) => {
      var q, D;
      A.preventDefault();
      const S = (q = A.detail) == null ? void 0 : q.field, C = (D = A.detail) == null ? void 0 : D.direction, L = S && C && C !== "none" ? { field: S, direction: C } : null, I = h._currentQuery().sort;
      !I && !L || I && L && I.field === L.field && I.direction === L.direction || (L ? (h.dom.setAttribute(p, L.field), h.dom.setAttribute(a, L.direction)) : (h.dom.removeAttribute(p), h.dom.removeAttribute(a)));
    });
    const y = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), E = h.findChildren().connectorEl;
    if (E) {
      const A = m(E);
      y.add(A), o(h.dom, A + ":connected", g);
    }
    y.forEach((A) => {
      o(h.dom, A + ":fetched", (S) => h._reconcileServerFetch(S.detail)), o(h.dom, A + ":created", (S) => h._reconcileServerMutation("create", S.detail)), o(h.dom, A + ":updated", (S) => h._reconcileServerMutation("update", S.detail)), o(h.dom, A + ":deleted", (S) => h._reconcileServerMutation("ack", S.detail)), o(h.dom, A + ":bulk-deleted", (S) => h._reconcileServerMutation("ack", S.detail)), o(h.dom, A + ":error", (S) => h._reconcileServerMutation("error", S.detail));
    });
  }
  r.prototype._onQueueSend = function(h) {
    this.refreshMapper();
    const b = this.findChildren();
    if (!b.store || !b.connector || !b.queue) return;
    const o = h.meta || {}, g = m(b.connectorEl), _ = h.idempotencyKey || h.entryId, c = {
      create: () => k(b.connectorEl, g + ":request-create", { data: h.payload, url: o.action || null, idempotencyKey: _, meta: { entryId: h.entryId, queued: !0, op: "create", tempId: o.tempId } }),
      update: () => k(b.connectorEl, g + ":request-update", { id: h.targetId, data: h.payload, expected_version: h.expectedVersion, url: o.action || null, idempotencyKey: _, meta: { entryId: h.entryId, queued: !0, op: "update", id: h.targetId } }),
      delete: () => k(b.connectorEl, g + ":request-delete", { id: h.targetId, idempotencyKey: _, meta: { entryId: h.entryId, queued: !0, op: "delete", id: h.targetId } }),
      "bulk-delete": () => {
        var y;
        return k(b.connectorEl, g + ":request-bulk-delete", { ids: ((y = h.payload) == null ? void 0 : y.ids) || [], idempotencyKey: _, meta: { entryId: h.entryId, queued: !0, op: "bulk-delete", bulkKey: o.bulkKey } });
      }
    };
    c[h.op] && c[h.op]();
  }, r.prototype._onFormSubmit = function(h) {
    const b = h.target;
    if (h.defaultPrevented) return;
    const o = b.hasAttribute(i) ? b.getAttribute(i) : null;
    if (o === null || (o ? !this._owns(o) : b.closest("[" + t + "]") !== this.dom)) return;
    const g = An(b);
    if (g !== "POST" && g !== "PUT" && g !== "PATCH") return;
    h.preventDefault();
    const _ = Oe(b);
    delete _._method, delete _._token;
    const c = _.id, y = _.expected_version, E = b.getAttribute("action") || "", A = this.findChildren();
    delete _.id, delete _.expected_version, g === "POST" ? this._fanOutCreate(A, _, E) : this._fanOutUpdate(A, c, _, y, E);
  }, r.prototype._reconcileServerFetch = function(h) {
    if (!h) return;
    const b = h.meta || {}, o = this.findChildren(), g = h.data;
    this.refreshMapper();
    const _ = Array.isArray(g) ? g : (g == null ? void 0 : g.data) || [], c = Array.isArray(g == null ? void 0 : g.deleted) ? g.deleted : [], y = Array.isArray(g) ? Math.floor(Date.now() / 1e3) : (g == null ? void 0 : g.synced_at) ?? (g == null ? void 0 : g.since) ?? Math.floor(Date.now() / 1e3), E = _.map((A) => this.mapper.ingress(A));
    if (!(!o.store || o.store.initializationError)) {
      if (!b.kind) return o.store.applySync(E, c, y, { total: h.total, filtered: h.filtered, offset: h.offset, queryGen: h.queryGen, targetEl: b.targetEl });
      o.store.applyQuery(E, { total: h.total }).then((A) => {
        const S = b.kind;
        S === "table" || S === "list" || S === "chart" ? (k(b.targetEl, "ln-" + S + ":set-loading", { loading: !1 }), k(b.targetEl, "ln-" + S + ":set-data", { data: A, total: h.total ?? A.length, filtered: h.filtered ?? A.length, offset: h.offset, queryGen: b.queryGen }), this._boundDelivered.set(b.targetEl, !0)) : S === "options" ? o.store.getAll({}).then((C) => k(b.targetEl, "ln-options:set-data", { data: C.data })) : S === "stat" && k(b.targetEl, "ln-stat:set-count", { count: h.filtered ?? h.total ?? E.length });
      });
    }
  }, r.prototype._reconcileServerMutation = function(h, b) {
    var _;
    if (!b) return;
    const o = this.findChildren(), g = b.meta || {};
    if (h === "create") {
      if (!b.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), g);
      const c = this.mapper.ingress(b.record);
      (o.storeEl ? this._requestStoreMutation(o, "update", { id: g.tempId, data: c }) : Promise.resolve()).then(() => {
        g.queued && o.queue && k(o.queueEl, "ln-api-queue:resolve-create", { entryId: g.entryId, oldKey: g.tempId, newId: c.id });
      }).catch((y) => this._reportError("create-reconcile", y, g));
    } else if (h === "update") {
      const c = b.record ? this.mapper.ingress(b.record) : null;
      (o.storeEl && c ? this._requestStoreMutation(o, "update", { id: g.id, data: c }) : Promise.resolve()).then(() => {
        g.queued && o.queue && k(o.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
      }).catch((y) => this._reportError("update-reconcile", y, g));
    } else if (h === "ack")
      g.queued && o.queue && k(o.queueEl, "ln-api-queue:ack", { entryId: g.entryId });
    else if (h === "error") {
      const c = b.status || ((_ = b.error) == null ? void 0 : _.status) || 0;
      g.queued && o.queue && k(o.queueEl, "ln-api-queue:nack", { entryId: g.entryId, reason: c === 401 || c === 419 ? "auth" : c === 0 || c >= 500 ? "retry" : "drop" }), o.storeEl && k(o.storeEl, "ln-data-store:request-sync-failed", { error: b.error || b, status: c }), this._reportError("connector-error", b.error || b, g);
    }
  }, r.prototype.destroy = function() {
    var h;
    if (this.dom[e]) {
      for (this._destroyed = !0; (h = this._unsubs) != null && h.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function w(h, b) {
    const o = h[e];
    o && (b === "data-ln-data-coordinator-mapper" ? o.refreshMapper() : (b === d || b === u || b === p || b === a) && o._queueQueryRefresh());
  }
  H(t, e, r, "ln-data-coordinator", {
    extraAttributes: ["data-ln-data-coordinator-mapper", d, u, p, a],
    onAttributeChange: w
  }), window[e].init = window[e];
})();
const oo = "ln_api_queue", so = 2, Z = "outbox", ot = "_queue_meta";
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
function ao(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function lo(t, e, i, d) {
  const u = /* @__PURE__ */ new Map(), p = [], a = [];
  for (const l of t || [])
    u.has(l.chainKey) || u.set(l.chainKey, []), u.get(l.chainKey).push(l);
  return u.forEach((l, s) => {
    l.sort((f, m) => f.seq - m.seq);
    const n = l[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > d) {
        a.push({ chainKey: s, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > d) {
        a.push({ chainKey: s, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = d + i, n.updatedAt = d, p.push(n);
    }
  }), { entries: p, wakeups: a };
}
function co(t, e, i, d, u) {
  const p = [], a = [];
  for (const l of t || []) {
    if (l.entryId === e) {
      a.push(l.entryId);
      continue;
    }
    l.chainKey === i && (l.chainKey = d, l.targetId === i && (l.targetId = d), l.meta && l.meta.id === i && (l.meta.id = d), l.meta && typeof l.meta.action == "string" && (l.meta.action = ao(l.meta.action, i, d)), l.updatedAt = u, p.push(l));
  }
  return { changed: p, deleted: a };
}
class uo {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || oo, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const d = this.indexedDB.open(this.dbName, so);
      d.onupgradeneeded = (u) => {
        const p = u.target.result;
        let a;
        p.objectStoreNames.contains(Z) ? a = u.target.transaction.objectStore(Z) : a = p.createObjectStore(Z, { keyPath: "entryId" }), a.indexNames.contains("by_scope_chain") || a.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), a.indexNames.contains("by_scope_seq") || a.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), p.objectStoreNames.contains(ot) || p.createObjectStore(ot, { keyPath: "key" });
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
      const a = i.transaction(Z, "readonly").objectStore(Z).index("by_scope_seq").getAll(Bt(this.keyRange, e));
      a.onsuccess = () => d(a.result || []), a.onerror = () => u(lt(a, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((d) => d ? new Promise((u, p) => {
      const a = d.transaction([ot, Z], "readwrite"), l = a.objectStore(ot), s = a.objectStore(Z), n = _n(e);
      let f = null;
      const m = (v) => {
        const w = v + 1;
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
        }, l.put({ key: n, value: w }), s.put(f);
      }, r = l.get(n);
      r.onerror = () => p(lt(r, "Queue sequence read failed")), r.onsuccess = () => {
        const v = r.result;
        if (v && typeof v.value == "number") {
          m(v.value);
          return;
        }
        const w = s.index("by_scope_seq").getAll(Bt(this.keyRange, e));
        w.onerror = () => p(lt(w, "Queue sequence migration failed")), w.onsuccess = () => {
          const h = (w.result || []).reduce((b, o) => Math.max(b, o.seq || 0), 0);
          m(h);
        };
      }, a.oncomplete = () => u(f), a.onerror = () => p(a.error || new Error("Queue enqueue transaction failed")), a.onabort = () => p(a.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, d) {
    return this.open().then((u) => u ? new Promise((p, a) => {
      const l = u.transaction(Z, "readwrite"), s = l.objectStore(Z), n = s.index("by_scope_seq").getAll(Bt(this.keyRange, e)), f = this.now();
      let m = { entries: [], wakeups: [] };
      n.onerror = () => a(lt(n, "Queue claim read failed")), n.onsuccess = () => {
        m = lo(n.result || [], i, d, f);
        for (const r of m.entries) s.put(r);
      }, l.oncomplete = () => p(m), l.onerror = () => a(l.error || new Error("Queue claim transaction failed")), l.onabort = () => a(l.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (d, u) => (u.delete(d.entryId), { status: "acked", entry: d }));
  }
  nack(e, i, d, u) {
    u = u || {};
    const p = u.maxAttempts || 8, a = u.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((l) => l ? new Promise((s, n) => {
      const f = l.transaction([Z, ot], "readwrite"), m = f.objectStore(Z), r = f.objectStore(ot), v = m.get(i);
      let w = null;
      v.onerror = () => n(lt(v, "Queue nack read failed")), v.onsuccess = () => {
        const h = v.result;
        if (!(!h || h.scope !== e)) {
          if (d === "drop") {
            m.delete(h.entryId), w = { status: "dropped", entry: h };
            return;
          }
          if (bn(h), h.updatedAt = this.now(), d === "auth") {
            h.status = "pending", m.put(h), r.put({ key: re(e), value: "auth" }), w = { status: "auth", entry: h };
            return;
          }
          if (d === "retry") {
            if (h.attempts = (h.attempts || 0) + 1, h.attempts >= p) {
              h.status = "failed", h.nextAttemptAt = 0, m.put(h), w = { status: "failed", entry: h };
              return;
            }
            const b = a[Math.min(h.attempts - 1, a.length - 1)];
            h.status = "pending", h.nextAttemptAt = this.now() + b, m.put(h), w = { status: "retry", entry: h, delay: b };
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
    return this.open().then((p) => p ? new Promise((a, l) => {
      const s = p.transaction(Z, "readwrite"), n = s.objectStore(Z), f = n.index("by_scope_seq").getAll(Bt(this.keyRange, e));
      let m = { changed: [], deleted: [] };
      f.onerror = () => l(lt(f, "Queue remap read failed")), f.onsuccess = () => {
        m = co(f.result || [], i, d, u, this.now());
        for (const r of m.deleted) n.delete(r);
        for (const r of m.changed) n.put(r);
      }, s.oncomplete = () => a(m.changed), s.onerror = () => l(s.error || new Error("Queue remap transaction failed")), s.onabort = () => l(s.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((d, u) => {
      const p = i.transaction(Z, "readwrite"), a = p.objectStore(Z), l = a.index("by_scope_seq").getAll(Bt(this.keyRange, e));
      let s = 0;
      l.onerror = () => u(lt(l, "Queue failed-entry read failed")), l.onsuccess = () => {
        for (const n of l.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), bn(n), a.put(n), s++);
      }, p.oncomplete = () => d(s), p.onerror = () => u(p.error || new Error("Queue failed-entry reset failed")), p.onabort = () => u(p.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((d, u) => {
      const a = i.transaction(ot, "readonly").objectStore(ot).get(re(e));
      a.onsuccess = () => {
        const l = a.result ? a.result.value : !1;
        d(l || !1);
      }, a.onerror = () => u(lt(a, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((d) => {
      if (d)
        return new Promise((u, p) => {
          const a = d.transaction(ot, "readwrite"), l = typeof i == "string" ? i : i ? "manual" : !1;
          a.objectStore(ot).put({ key: re(e), value: l }), a.oncomplete = () => u(), a.onerror = () => p(a.error || new Error("Queue pause-state write failed")), a.onabort = () => p(a.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((d, u) => {
          const p = i.transaction([Z, ot], "readwrite"), l = p.objectStore(Z).index("by_scope_seq").openCursor(Bt(this.keyRange, e));
          l.onsuccess = (s) => {
            const n = s.target.result;
            n && (n.delete(), n.continue());
          }, l.onerror = () => u(lt(l, "Queue clear failed")), p.objectStore(ot).delete(_n(e)), p.objectStore(ot).delete(re(e)), p.oncomplete = () => d(), p.onerror = () => u(p.error || new Error("Queue clear transaction failed")), p.onabort = () => u(p.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, d) {
    return this.open().then((u) => u ? new Promise((p, a) => {
      const l = u.transaction(Z, "readwrite"), s = l.objectStore(Z), n = s.get(i);
      let f = null;
      n.onerror = () => a(lt(n, "Queue entry read failed")), n.onsuccess = () => {
        const m = n.result;
        !m || m.scope !== e || (f = d(m, s));
      }, l.oncomplete = () => p(f), l.onerror = () => a(l.error || new Error("Queue entry transaction failed")), l.onabort = () => a(l.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], d = 8, u = 6e4;
  if (window[e] !== void 0) return;
  function p(n) {
    const f = n[e];
    f && f._drain();
  }
  const a = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: p, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, l = new uo({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: wt
  });
  function s(n) {
    this.dom = n, n[e] = this;
    const f = n.closest("[data-ln-data-coordinator]");
    this.scope = n.id || (f ? f.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = wt(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const m = this;
    return l.open().then((r) => r ? l.getPaused(m.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((r) => {
      if (m._paused = !!r, m._paused) {
        const v = typeof r == "string" ? r : "auth";
        k(m.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return m._emitPendingCount();
    }).then(() => m._drain()).catch((r) => {
      console.error("[ln-api-queue] Initialization failed:", r), k(m.dom, "ln-api-queue:error", { operation: "initialize", error: r });
    }), this;
  }
  s.prototype._isOnline = function() {
    const n = this.dom.getAttribute("data-ln-api-queue-online");
    return n === "true" ? !0 : n === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const n = this;
    return l.allForScope(n.scope).then((f) => (k(n.dom, "ln-api-queue:pending-count", { count: f.length, scope: n.scope }), f.length === 0 && k(n.dom, "ln-api-queue:drained", { scope: n.scope }), f));
  }, s.prototype._clearTimer = function(n) {
    const f = this._timers.get(n);
    f && (clearTimeout(f), this._timers.delete(n));
  }, s.prototype._scheduleTimer = function(n, f) {
    const m = Math.max(0, f), r = this._timers.get(n);
    r && clearTimeout(r);
    const v = this, w = setTimeout(() => {
      v._timers.delete(n), v._drain();
    }, m);
    this._timers.set(n, w);
  }, s.prototype._drain = function() {
    const n = this;
    return n._paused || !n._isOnline() ? Promise.resolve() : (n._drainPromise || (n._drainPromise = l.claimReady(n.scope, n._workerId, u).then((f) => {
      for (const m of f.wakeups)
        n._scheduleTimer(m.chainKey, m.at - Date.now());
      for (const m of f.entries)
        n._clearTimer(m.chainKey), k(n.dom, "ln-api-queue:send", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          op: m.op,
          targetId: m.targetId,
          payload: m.payload,
          expectedVersion: m.expectedVersion,
          idempotencyKey: m.entryId,
          meta: m.meta
        });
    }).catch((f) => {
      console.error("[ln-api-queue] Drain failed:", f), k(n.dom, "ln-api-queue:error", { operation: "drain", error: f });
    }).finally(() => {
      n._drainPromise = null;
    })), n._drainPromise);
  }, s.prototype._onEnqueue = function(n) {
    const f = this;
    return l.enqueue(f.scope, n.detail || {}).then((m) => {
      if (m)
        return f._emitPendingCount().then((r) => (k(f.dom, "ln-api-queue:enqueued", {
          entryId: m.entryId,
          chainKey: m.chainKey,
          count: r.length
        }), f._drain()));
    }).catch((m) => {
      k(f.dom, "ln-api-queue:error", { operation: "enqueue", error: m });
    });
  }, s.prototype._onAck = function(n) {
    const f = this, m = n.detail || {};
    return l.ack(f.scope, m.entryId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((r) => {
      k(f.dom, "ln-api-queue:error", { operation: "ack", entryId: m.entryId, error: r });
    });
  }, s.prototype._onNack = function(n) {
    const f = this, m = n.detail || {};
    return l.nack(f.scope, m.entryId, m.reason, {
      maxAttempts: d,
      backoff: i
    }).then((r) => {
      if (r)
        return r.status === "failed" ? k(f.dom, "ln-api-queue:failed", {
          entryId: r.entry.entryId,
          chainKey: r.entry.chainKey,
          attempts: r.entry.attempts
        }) : r.status === "retry" ? f._scheduleTimer(r.entry.chainKey, r.delay) : r.status === "auth" && (f._paused = !0, k(f.dom, "ln-api-queue:paused", { reason: "auth" }), k(f.dom, "ln-api-queue:auth-required", {
          entryId: r.entry.entryId,
          chainKey: r.entry.chainKey
        })), f._emitPendingCount().then(() => {
          if (r.status === "dropped") return f._drain();
        });
    }).catch((r) => {
      k(f.dom, "ln-api-queue:error", { operation: "nack", entryId: m.entryId, error: r });
    });
  }, s.prototype._onRemap = function(n) {
    const f = this, m = n.detail || {};
    return l.remap(f.scope, m.oldKey, m.newId).catch((r) => {
      k(f.dom, "ln-api-queue:error", { operation: "remap", error: r });
    });
  }, s.prototype._onResolveCreate = function(n) {
    const f = this, m = n.detail || {};
    return l.resolveCreate(f.scope, m.entryId, m.oldKey, m.newId).then(() => f._emitPendingCount()).then(() => f._drain()).catch((r) => {
      k(f.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: m.entryId,
        error: r
      });
    });
  }, s.prototype._onResume = function() {
    const n = this;
    return l.setPaused(n.scope, !1).then(() => (n._paused = !1, k(n.dom, "ln-api-queue:resumed", {}), n._drain())).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "resume", error: f });
    });
  }, s.prototype._onPause = function() {
    const n = this;
    return l.setPaused(n.scope, "manual").then(() => {
      n._paused = !0, k(n.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "pause", error: f });
    });
  }, s.prototype._onDrain = function() {
    const n = this;
    return l.resetFailed(n.scope).then(() => {
      const f = n._drainPromise;
      return f ? f.then(() => n._drain()) : n._drain();
    }).catch((f) => {
      k(n.dom, "ln-api-queue:error", { operation: "manual-drain", error: f });
    });
  }, s.prototype._onClear = function() {
    const n = this;
    return n._timers.forEach((f) => clearTimeout(f)), n._timers.clear(), l.clear(n.scope).then(() => {
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
    attributes: a
  });
})();
function vi(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Pt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function fo(t, e, i) {
  const d = vi(t);
  return d === null || d < 0 ? 0 : Math.min(d, Math.min(e, i) / 2);
}
function ho(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function po(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function mo(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, d = e.xField || "label", u = e.yField || "value", p = e.includeZero !== !1, a = fo(e.padding, i.width, i.height), l = Array.isArray(t) ? t : [], s = [];
  for (let c = 0; c < l.length; c++) {
    const y = l[c] || {}, E = vi(y[u]);
    E !== null && s.push({
      record: y,
      sourceIndex: c,
      label: y[d] == null ? String(c + 1) : String(y[d]),
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
      baselineY: i.y + i.height - a
    };
  let n = s[0].value, f = s[0].value;
  for (let c = 1; c < s.length; c++)
    s[c].value < n && (n = s[c].value), s[c].value > f && (f = s[c].value);
  let m = n, r = f;
  p && (m = Math.min(0, m), r = Math.max(0, r)), m === r && (r === 0 ? r = 1 : r > 0 ? m = 0 : r = 0);
  const v = Math.max(1, i.width - a * 2), w = Math.max(1, i.height - a * 2), h = r - m, b = i.y + i.height - a - (0 - m) / h * w, o = [];
  for (let c = 0; c < s.length; c++) {
    const y = s[c], E = s.length === 1 ? 0.5 : c / (s.length - 1), A = i.x + a + E * v, S = i.y + i.height - a - (y.value - m) / h * w;
    o.push({
      record: y.record,
      sourceIndex: y.sourceIndex,
      label: y.label,
      value: y.value,
      x: A,
      y: S,
      pointString: Pt(A) + "," + Pt(S)
    });
  }
  const g = o.map((c) => c.pointString).join(" ");
  let _ = "";
  if (o.length > 0) {
    const c = o[0], y = o[o.length - 1], E = Pt(c.x) + "," + Pt(b), A = Pt(y.x) + "," + Pt(b);
    _ = E + " " + g + " " + A;
  }
  return {
    points: o,
    linePoints: g,
    areaPoints: _,
    count: o.length,
    min: n,
    max: f,
    domainMin: m,
    domainMax: r,
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
  const p = {
    "data-ln-chart": { prop: "name", type: "string", read: K, fallback: "", effect: u, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: d, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: d, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: u, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: u, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: u, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: u, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: u, description: "Forces Y axis scale to start at zero" }
  }, a = Y(p);
  function l(n, f) {
    n && (n.textContent = f);
  }
  function s(n) {
    this.dom = n, X(this, n, a), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const f = this;
    return this._onSetData = function(m) {
      const r = m.detail || {};
      f._data = Array.isArray(r.data) ? r.data : [], f.isLoaded = !0, f._setLoading(!1), f._render();
    }, this._onSetLoading = function(m) {
      f._setLoading(!!(m.detail && m.detail.loading));
    }, this._onRefresh = function() {
      f.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  s.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), f = n === null ? NaN : Number(n), m = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(f) && f >= 0 ? f : 16,
      type: m === "area" || m === "polygon" ? "area" : "line",
      viewBox: this.plot && ho(this.plot.getAttribute("viewBox")) || i
    };
  }, s.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, s.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const f = this.name + "-label", m = '[data-ln-template="' + f + '"]';
    if (!this.dom.querySelector(m) && !document.querySelector(m)) return;
    const r = Lt(this.dom, f, "ln-chart");
    if (!r) return;
    const v = J(this.dom);
    for (const w of n.points) {
      const h = r.cloneNode(!0);
      Zt(h, {
        label: w.label,
        value: rt(w.value, v)
      }), this.labels.appendChild(h);
    }
  }, s.prototype._render = function() {
    const n = this._readOptions(), f = mo(this._data, n);
    this.model = f, this.line && (this.line.setAttribute("points", f.linePoints), this.line.toggleAttribute("hidden", f.count === 0)), this.area && (this.area.setAttribute("points", f.areaPoints), this.area.toggleAttribute("hidden", f.count === 0 || n.type !== "area"));
    const m = f.count === 0;
    this.dom.classList.toggle("ln-chart--empty", m), this.empty && this.empty.toggleAttribute("hidden", !m);
    const r = J(this.dom);
    l(this.minimum, rt(f.min, r)), l(this.maximum, rt(f.max, r)), l(this.count, rt(f.count, r)), this._renderLabels(f), k(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: f.count,
      min: f.min,
      max: f.max
    });
  }, s.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, k(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: po(this.dom.getAttribute("data-ln-chart-sort")),
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
    "data-ln-options": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: K, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: K, fallback: "name", description: "Field name used for option visible label text" }
  }, d = Y(i);
  function u(p) {
    this.dom = p, X(this, p, d);
    const a = this;
    return this._onSetData = function(l) {
      l.detail && a._rebuild(l.detail.data || []);
    }, p.addEventListener("ln-options:set-data", this._onSetData), k(p, "ln-options:request-data", { options: this._storeName }), this;
  }
  u.prototype._rebuild = function(p) {
    const a = this.dom, l = this._valueField, s = this._labelField, n = a.getAttribute("data-ln-value") || a.value, f = a.querySelectorAll("option");
    for (let r = f.length - 1; r >= 0; r--)
      f[r].value !== "" && a.removeChild(f[r]);
    for (let r = 0; r < p.length; r++) {
      const v = p[r], w = document.createElement("option");
      w.value = String(v[l]), w.textContent = v[s] != null ? v[s] : "", a.appendChild(w);
    }
    const m = a.options;
    for (let r = 0; r < m.length; r++)
      if (m[r].value === String(n)) {
        a.value = String(n);
        break;
      }
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, H(t, e, u, "ln-options", {
    attributes: i
  });
})();
function go(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
  if (!i) return null;
  const u = {};
  return u[i] = [d], u;
}
function _o(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: K, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, d = Y(i);
  function u(p) {
    return this.dom = p, X(this, p, d), this._onSetCount = function(a) {
      p.textContent = _o(a.detail && a.detail.count), p.classList.remove("is-loading");
    }, p.addEventListener("ln-stat:set-count", this._onSetCount), k(p, "ln-stat:request-count", {
      stat: this._storeName,
      filters: go(this._filterRaw)
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
  let p = null;
  const a = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), l = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), s = "lni:", n = "lni:v", f = "1";
  function m() {
    try {
      if (localStorage.getItem(n) !== f) {
        for (let g = localStorage.length - 1; g >= 0; g--) {
          const _ = localStorage.key(g);
          _ && _.indexOf(s) === 0 && localStorage.removeItem(_);
        }
        localStorage.setItem(n, f);
      }
    } catch {
    }
  }
  m();
  function r() {
    return p || (p = document.getElementById(t), p || (p = document.createElementNS("http://www.w3.org/2000/svg", "svg"), p.id = t, p.setAttribute("hidden", ""), p.setAttribute("aria-hidden", "true"), p.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(p, document.body.firstChild))), p;
  }
  function v(g) {
    return g.indexOf(i) === 0 ? l + "/" + g.slice(i.length) + ".svg" : a + "/" + g.slice(e.length) + ".svg";
  }
  function w(g, _) {
    const c = _.match(/viewBox="([^"]+)"/), y = c ? c[1] : "0 0 24 24", E = _.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = E ? E[1].trim() : "", S = _.match(/<svg([^>]*)>/i), C = S ? S[1] : "", L = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    L.id = g, L.setAttribute("viewBox", y), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const q = C.match(new RegExp(I + '="([^"]*)"'));
      q && L.setAttribute(I, q[1]);
    }), L.innerHTML = A, r().querySelector("defs").appendChild(L);
  }
  function h(g) {
    if (d.has(g) || u.has(g)) return;
    if (g.indexOf(i) === 0 && !l) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", g);
      return;
    }
    const _ = g.slice(1);
    try {
      const y = localStorage.getItem(s + _);
      if (y) {
        w(_, y), d.add(g);
        return;
      }
    } catch {
    }
    u.add(g);
    const c = v(g);
    fetch(c).then(function(y) {
      if (!y.ok) throw new Error(y.status);
      return y.text();
    }).then(function(y) {
      w(_, y), d.add(g), u.delete(g);
      try {
        localStorage.setItem(s + _, y);
      } catch {
      }
    }).catch(function(y) {
      console.error("[ln-icon] Fetch failed for:", _, y), u.delete(g);
    });
  }
  function b(g) {
    const _ = 'use[href^="' + e + '"], use[href^="' + i + '"]', c = g.querySelectorAll ? g.querySelectorAll(_) : [];
    if (g.matches && g.matches(_)) {
      const y = g.getAttribute("href");
      y && h(y);
    }
    Array.prototype.forEach.call(c, function(y) {
      const E = y.getAttribute("href");
      E && h(E);
    });
  }
  function o() {
    b(document), ct(function() {
      te({
        onInit: function(g) {
          b(g);
        }
      }), Nt(["href"], function(g) {
        if ((g.tagName ? g.tagName.toLowerCase() : "") === "use") {
          const c = g.getAttribute("href");
          c && (c.indexOf(e) === 0 || c.indexOf(i) === 0) && h(c);
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
function bo(t, e) {
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
function yo(t, e = Ve) {
  if (e.has(t)) return null;
  let i = null, d = 1 / 0;
  for (const p of e) {
    const a = bo(t, p);
    a < d && (d = a, i = p);
  }
  const u = Math.max(3, Math.floor(t.length * 0.4));
  return d <= u ? i : null;
}
function wi(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function vo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], u = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < u.length; p++) {
    const a = u[p];
    if (a.attributes)
      for (let l = 0; l < a.attributes.length; l++) {
        const s = a.attributes[l];
        if (s.name.startsWith("data-ln-") && s.name.endsWith("-for")) {
          const n = (s.value || "").trim();
          if (!n) {
            d.push({
              type: "id-empty",
              element: a,
              attribute: s.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${a.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + wi(n)) || d.push({
            type: "id-unresolved",
            element: a,
            attribute: s.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${a.tagName.toLowerCase()} ${s.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return d;
}
function wo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], u = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < u.length; p++) {
    const a = u[p];
    if (a.attributes)
      for (let l = 0; l < a.attributes.length; l++) {
        const s = a.attributes[l];
        if (s.name.startsWith("data-ln-") && (s.name.endsWith("-source") || s.name.endsWith("-store")) && s.name !== "data-ln-data-store") {
          const f = (s.value || "").trim();
          if (!f) {
            d.push({
              type: "store-empty",
              element: a,
              attribute: s.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${a.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          const m = wi(f), r = e.querySelector(`[data-ln-data-store="${m}"], [data-ln-store="${m}"]`), v = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(f);
          !r && !v && d.push({
            type: "store-unresolved",
            element: a,
            attribute: s.name,
            storeName: f,
            message: `[ln-debug] Unresolved store reference: <${a.tagName.toLowerCase()} ${s.name}="${f}"> targets store "${f}", but no [data-ln-data-store="${f}"] exists in the document.`
          });
        }
      }
  }
  return d;
}
function Eo(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], d = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && d.unshift(e);
  const u = /* @__PURE__ */ new Map();
  for (let p = 0; p < d.length; p++) {
    const a = d[p], l = (a.getAttribute("data-ln-data-store") || "").trim();
    l && (u.has(l) || u.set(l, []), u.get(l).push(a));
  }
  for (const [p, a] of u.entries())
    a.length > 1 && i.push({
      type: "store-duplicate",
      storeName: p,
      elements: a,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${p}". Store names must be unique across the document.`
    });
  return i;
}
function Ao(t = document, e = Ve) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const d = [], u = [i, ...i.querySelectorAll("*")];
  for (let p = 0; p < u.length; p++) {
    const a = u[p];
    if (a.attributes)
      for (let l = 0; l < a.attributes.length; l++) {
        const s = a.attributes[l];
        if (s.name.startsWith("data-ln-") && !e.has(s.name)) {
          const n = yo(s.name, e), f = n ? ` Did you mean "${n}"?` : "";
          d.push({
            type: "attribute-unknown",
            element: a,
            attribute: s.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${s.name}" on <${a.tagName.toLowerCase()}>.${f}`
          });
        }
      }
  }
  return d;
}
function xe(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Ve, d = vo(t), u = wo(t), p = Eo(t), a = Ao(t, i), l = [
    ...d,
    ...u,
    ...p,
    ...a
  ];
  if (!e.silent)
    for (let s = 0; s < l.length; s++)
      console.warn(l[s].message);
  return {
    idIssues: d,
    storeIssues: u,
    uniquenessIssues: p,
    spellingIssues: a,
    total: l.length
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
function So(t, e, i, d) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", d), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", d.oldValue, "→", d.newValue), console.groupEnd());
}
let Ot = [];
function Co() {
  Ot = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Ot.push(document.body);
}
function Ei(t) {
  if (t === window || t === document)
    return Ot.indexOf(document.body) !== -1;
  for (let e = 0; e < Ot.length; e++)
    if (Ot[e].contains(t)) return !0;
  return !1;
}
function To(t, e, i, d) {
  Ei(i) && So(t, e, i, d);
}
function Ie() {
  Co(), Fi(Ot.length > 0 ? To : null, Ot.length > 0 ? Ei : null);
}
function yn() {
  Ie();
}
function ko() {
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
  ko();
  function d(p) {
    return this.dom = p, oe(p.ownerDocument || document), yn(), this;
  }
  d.prototype.verify = function(p, a) {
    return xe(p || (this.dom ? this.dom.ownerDocument || this.dom : document), a);
  }, d.prototype.destroy = function() {
    delete this.dom[e], yn();
  };
  const u = H(t, e, d, "ln-debug", {
    attributes: i,
    onInit: function(p) {
      typeof document < "u" && oe(p && p.ownerDocument ? p.ownerDocument : document);
    },
    onSubtreeChange: function(p) {
      typeof document < "u" && oe(p && p.ownerDocument ? p.ownerDocument : document);
    }
  });
  u.verify = function(p, a) {
    return xe(p || document, a);
  }, u.schedule = function(p, a, l) {
    return oe(p || document, a, l);
  };
})();
