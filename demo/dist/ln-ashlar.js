function ln() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function ke(t) {
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
      for (let m = 1; m < e.length; m++)
        if (e[m] && e[m].nodeType === 1) {
          a = e[m];
          break;
        }
      if (!ke(a))
        return;
    }
    t.apply(console, e);
  };
}
function yi(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function vi(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function L(t, e, i) {
  const a = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: a
  }));
}
function Z(t, e, i) {
  const a = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, a);
  const m = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: a
  });
  return t.dispatchEvent(m), m;
}
function cn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const a = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  a[i] = t.name, L(t.dom, e, a);
}
function gt(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      gt(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function zt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function dn(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function wi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function un(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Ei(t, e) {
  return !t || !document.contains(t) || un(t) || e && typeof t[e] != "function" ? !1 : zt(t);
}
function fn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function vt(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.tagName === "DATA" && t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
}
function Ai(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function hn(t, e) {
  const i = !!(e && e.typed), a = e && e.exclude, m = {}, h = t.elements, r = {};
  if (i)
    for (let c = 0; c < h.length; c++) {
      const d = h[c];
      d.name && d.type === "checkbox" && !d.disabled && (r[d.name] = (r[d.name] || 0) + 1);
    }
  for (let c = 0; c < h.length; c++) {
    const d = h[c];
    if (!(!d.name || d.disabled || d.type === "file" || d.type === "submit" || d.type === "button") && !(a && d.matches && d.matches(a)))
      if (d.type === "checkbox")
        i && r[d.name] === 1 ? m[d.name] = d.checked : (m[d.name] || (m[d.name] = []), d.checked && m[d.name].push(d.value));
      else if (d.type === "radio")
        d.checked && (m[d.name] = d.value);
      else if (d.type === "select-multiple") {
        m[d.name] = [];
        for (let n = 0; n < d.options.length; n++)
          d.options[n].selected && m[d.name].push(d.options[n].value);
      } else if (i && d.type === "hidden")
        m[d.name] = d.value;
      else if (i && (d.type === "number" || d.type === "range")) {
        const n = Number(d.value);
        m[d.name] = d.value === "" || isNaN(n) ? null : n;
      } else
        m[d.name] = d.value;
  }
  return m;
}
function Si(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function pn(t, e) {
  const i = t.elements, a = [], m = {};
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    r.name && r.type === "checkbox" && (m[r.name] = (m[r.name] || 0) + 1);
  }
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    if (r.type === "file" || r.type === "submit" || r.type === "button") continue;
    const c = r.getAttribute("data-ln-fill-as") || r.name;
    if (!c || !(c in e)) continue;
    const d = e[c];
    if (r.type === "checkbox") {
      if (Array.isArray(d))
        r.checked = d.indexOf(r.value) !== -1;
      else if (m[r.name] > 1) {
        const n = String(d).split(",").map(function(o) {
          return o.trim();
        });
        r.checked = n.indexOf(r.value) !== -1;
      } else
        r.checked = Si(d);
      a.push(r);
    } else if (r.type === "radio")
      r.checked = r.value === String(d), a.push(r);
    else if (r.type === "select-multiple") {
      if (Array.isArray(d))
        for (let n = 0; n < r.options.length; n++)
          r.options[n].selected = d.indexOf(r.options[n].value) !== -1;
      a.push(r);
    } else
      r.value = d, a.push(r);
  }
  return a;
}
function mn(t, e, { get: i, set: a }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(m) {
      a ? a.call(this, m, (h) => e.set.call(this, h)) : e.set.call(this, m);
    },
    configurable: !0
  });
}
function Et(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Ft(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function gn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const _n = {};
function Ci(t, e) {
  _n[t] = e;
}
function Ti(t) {
  return _n[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Ci, window.lnCore.getDataMapper = Ti);
function it(t) {
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return i ? i.trim() : "en-US";
}
function ie() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, gt(function() {
    new MutationObserver(function() {
      L(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const bn = {};
function yn(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  bn[i] = e;
}
function Lt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return bn[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = yn, window.lnCore.getLocaleFallback = Lt, window.lnCore.ensureLocaleObserver = ie);
const de = {};
function Jt(t, e) {
  de[t] || (de[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const i = de[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Ct(t, e, i) {
  if (t) {
    const a = t.querySelector('[data-ln-template="' + e + '"]');
    if (a) return a.content.cloneNode(!0);
  }
  return Jt(e, i);
}
function pt(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < i.length; r++) {
    const c = i[r], d = c.getAttribute("data-ln-field");
    e[d] != null && (c.textContent = e[d]);
  }
  const a = t.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < a.length; r++) {
    const c = a[r], d = c.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < d.length; n++) {
      const o = d[n].trim().split(":");
      if (o.length !== 2) continue;
      const s = o[0].trim(), u = o[1].trim();
      e[u] != null && c.setAttribute(s, e[u]);
    }
  }
  const m = t.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < m.length; r++) {
    const c = m[r], d = c.getAttribute("data-ln-show");
    d in e && c.classList.toggle("hidden", !e[d]);
  }
  const h = t.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < h.length; r++) {
    const c = h[r], d = c.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < d.length; n++) {
      const o = d[n].trim().split(":");
      if (o.length !== 2) continue;
      const s = o[0].trim(), u = o[1].trim();
      u in e && c.classList.toggle(s, !!e[u]);
    }
  }
  return t;
}
function ki(t, e) {
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
function Vt(t, e) {
  if (!t || !e) return t;
  const i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; i.nextNode(); ) {
    const h = i.currentNode;
    h.textContent.indexOf("{{") !== -1 && (h.textContent = h.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(r, c) {
        return e[c] !== void 0 ? e[c] : "";
      }
    ));
  }
  const a = function(h, r) {
    return e[r] !== void 0 ? e[r] : "";
  }, m = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && m.push(t);
  for (let h = 0; h < m.length; h++) {
    const r = m[h], c = r.attributes;
    for (let d = 0; d < c.length; d++) {
      const n = c[d];
      n.value.indexOf("{{") !== -1 && r.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, a));
    }
  }
  return t;
}
function Li(t, e, i, a, m, h) {
  const r = {};
  for (let d = 0; d < t.children.length; d++) {
    const n = t.children[d], o = n.getAttribute("data-ln-render-key");
    o && (r[o] = n);
  }
  const c = document.createDocumentFragment();
  for (let d = 0; d < e.length; d++) {
    const n = e[d], o = String(a(n));
    let s = r[o];
    if (s)
      m(s, n, d);
    else {
      const u = Jt(i, h);
      if (!u || (Vt(u, n), s = u.firstElementChild, !s)) continue;
      s.setAttribute("data-ln-render-key", o), m(s, n, d);
    }
    c.appendChild(s);
  }
  t.textContent = "", t.appendChild(c);
}
function re(t, e) {
  const i = {}, a = t.querySelectorAll("[" + e + "]");
  for (let m = 0; m < a.length; m++)
    i[a[m].getAttribute(e)] = a[m].textContent, a[m].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Vt, window.lnCore.fill = pt, window.lnCore.lnFill = ki, window.lnCore.renderList = Li);
function $(t, e, i) {
  const a = t.getAttribute(e);
  return a === null ? i : a;
}
function xt(t, e, i) {
  const a = parseInt(t.getAttribute(e), 10);
  return isNaN(a) ? i : a;
}
function It(t, e, i = !1) {
  const a = t.getAttribute(e);
  if (a === null) return !!i;
  const m = a.trim().toLowerCase();
  return !(m === "false" || m === "0");
}
function vn(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const ue = /* @__PURE__ */ new Map();
function qi(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (ue.has(i)) return ue.get(i);
  const a = new Set(t || []), m = function(h, r) {
    const c = h.getAttribute(r);
    return c !== null && a.has(c) ? c : e;
  };
  return ue.set(i, m), m;
}
function xi(t, e, i) {
  const a = parseFloat(t.getAttribute(e));
  return isNaN(a) ? i : a;
}
function Ii(t, e, i) {
  const a = t.getAttribute(e);
  if (!a) return i;
  try {
    return JSON.parse(a);
  } catch {
    return i;
  }
}
function wn(t, e, i, a, m) {
  if (!t || e === null) return !0;
  const h = a || "ln-component", r = t.type;
  if (r === "trigger" || r === "marker" || r === "string" || r === "list" || !r || e === "" && t.fallback !== void 0)
    return !0;
  const c = (d) => {
    m ? console.warn(d, m) : console.warn(d);
  };
  if (r === "boolean") {
    const d = e.trim().toLowerCase();
    return d !== "" && d !== "true" && d !== "false" && d !== "1" && d !== "0" ? (c(`[${h}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (r === "enum") {
    const d = t.values || [];
    return d.includes(e) ? !0 : (c(`[${h}] Invalid value "${e}" for attribute "${i}". Allowed: ${d.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (r === "integer") {
    if (!/^-?\d+$/.test(e))
      return c(`[${h}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const d = parseInt(e, 10);
    return t.min !== void 0 && d < t.min ? (c(`[${h}] Value ${d} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && d > t.max ? (c(`[${h}] Value ${d} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (r === "float")
    return isNaN(Number(e)) ? (c(`[${h}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (r === "json")
    try {
      return JSON.parse(e), !0;
    } catch (d) {
      return c(`[${h}] Invalid JSON for attribute "${i}": ${d.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function tt(t, e, i) {
  for (const a in i) {
    const [m, h, r] = i[a];
    Object.defineProperty(t, a, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return m(e, h, r);
      },
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
function et(t) {
  const e = {};
  for (const i in t) {
    const a = t[i];
    if (!a || !a.prop) continue;
    let m = a.read;
    if (!m && a.type)
      switch (a.type) {
        case "enum":
          m = qi(a.values, a.fallback);
          break;
        case "integer":
          m = xt;
          break;
        case "float":
          m = xi;
          break;
        case "boolean":
          m = It;
          break;
        case "list":
          m = vn;
          break;
        case "json":
          m = Ii;
          break;
        case "string":
        default:
          m = $;
          break;
      }
    m || (m = $), e[a.prop] = [m, i, a.fallback];
  }
  return e;
}
function Di(t) {
  const e = {};
  for (const i in t) {
    const a = t[i];
    a && a.effect && (e[i] = a.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Ri(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
function Le(t, e, i, a) {
  if (t.nodeType !== 1) return;
  const h = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", r = Array.from(t.querySelectorAll(h));
  t.matches && t.matches(h) && r.push(t);
  for (const c of r)
    if (!c[i]) {
      window.lnCore._persistSink && c.hasAttribute("data-ln-persist") && window.lnCore._persistSink(c, e);
      try {
        c[i] = new a(c);
      } catch (d) {
        console.error("[" + i + "] init failed", c, d);
      }
    }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Oi() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function fe() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function En() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function mt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function An() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function Sn(t) {
  const e = An(), i = t.observed || [];
  for (let a = 0; a < i.length; a++) {
    const m = i[a];
    e.byAttr.has(m) || e.byAttr.set(m, []), e.byAttr.get(m).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const a in t.attributes) {
      e.byDeclaredAttr.has(a) || e.byDeclaredAttr.set(a, []);
      const m = e.byDeclaredAttr.get(a);
      m.some((h) => h.componentTag === t.componentTag) || m.push({
        spec: t.attributes[a],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const a = Ri(t);
    if (a === null)
      e.reactiveWildcard.push(t);
    else
      for (const m of a)
        e.byReactive.has(m) || e.byReactive.set(m, []), e.byReactive.get(m).push(t);
  }
  t.persist && e.persist.push(t);
}
function Pe(t, e, i, a) {
  for (let m = 0; m < t.length; m++) {
    const h = t[m];
    if (!e[h.attribute]) continue;
    const r = h.effects && h.effects[i];
    r ? r(e, i, a) : h.onAttrChange && (!h.declared || h.declared.has(i)) && h.onAttrChange(e, i, a);
  }
}
function Mi(t) {
  const e = t.target, i = t.attributeName;
  if (t.oldValue === e.getAttribute(i)) return;
  const a = An(), m = a.byAttr.get(i);
  if (ln() && a.byDeclaredAttr && a.byDeclaredAttr.has(i) && ke(e)) {
    const h = a.byDeclaredAttr.get(i), r = e.getAttribute(i);
    for (let c = 0; c < h.length; c++)
      wn(h[c].spec, r, i, h[c].componentTag, e);
  }
  if (window.lnCore._debugSink && (i.indexOf("data-ln-") === 0 || m) && window.lnCore._debugSink("attr", i, e, { oldValue: t.oldValue, newValue: e.getAttribute(i) }), i.indexOf("data-ln-") === 0) {
    const h = a.byReactive.get(i);
    h && Pe(h, e, i, t.oldValue), a.reactiveWildcard.length && Pe(a.reactiveWildcard, e, i, t.oldValue);
  }
  if (m)
    for (let h = 0; h < m.length; h++) {
      const r = m[h];
      if (r.handler) {
        r.handler(e, i, t.oldValue);
        continue;
      }
      r.onAttributeChange && e[r.attribute] ? r.onAttributeChange(e, i) : (Le(e, r.selector, r.attribute, r.ComponentFn), r.onInit && r.onInit(e));
    }
}
function Cn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        try {
          Mi(e[i]);
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
function Tn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Ni(t) {
  const e = Tn();
  if (e.length) {
    if (t.target)
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        if (a.onSubtreeChange) {
          const m = a.query, h = t.target.nodeType === 1 ? t.target.matches(m) ? t.target : t.target.closest(m) : t.target.parentElement ? t.target.parentElement.closest(m) : null;
          h && a.onSubtreeChange(h, t);
        }
      }
    for (let i = 0; i < t.addedNodes.length; i++) {
      const a = t.addedNodes[i];
      if (a.nodeType === 1)
        for (let m = 0; m < e.length; m++) {
          const h = e[m];
          Le(a, h.selector, h.attribute, h.ComponentFn), h.onInit && h.onInit(a);
        }
    }
    for (let i = 0; i < t.removedNodes.length; i++) {
      const a = t.removedNodes[i];
      if (a.nodeType === 1)
        for (let m = 0; m < e.length; m++) {
          const h = e[m], r = h.query, c = Array.from(a.querySelectorAll(r));
          a.matches && a.matches(r) && c.push(a);
          for (let d = 0; d < c.length; d++) {
            const n = c[d];
            if (!document.contains(n)) {
              const o = n[h.attribute];
              if (o && typeof o.destroy == "function")
                try {
                  o.destroy();
                } catch (s) {
                  console.error("[" + h.attribute + "] destroy failed", n, s);
                }
              delete n[h.attribute];
            }
          }
        }
    }
  }
}
function Fi() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, gt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const a = e[i];
        if (a.type === "childList")
          try {
            Ni(a);
          } catch (m) {
            console.error("[ln-core] lifecycle handler failed", a.target, m);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Wt(t, e) {
  Sn({ observed: t, handler: e }), Cn();
}
function j(t, e, i, a, m = {}) {
  const h = m.extraAttributes || [], r = m.onAttributeChange || null, c = m.onSubtreeChange || null, d = m.onInit || null, n = m.onAttrChange || null, o = m.effects || null, s = m.attributes || null, u = s ? Di(s) : o, w = s ? new Set(Object.keys(s)) : null, v = m.persist || null;
  function E(l) {
    const g = l || document.body;
    if (Le(g, t, e, i), s && ln())
      for (const y in s) {
        const T = s[y], _ = Array.from(g.querySelectorAll("[" + y + "]"));
        g.matches && g.matches("[" + y + "]") && _.push(g);
        for (let A = 0; A < _.length; A++) {
          const C = _[A];
          ke(C) && wn(T, C.getAttribute(y), y, a, C);
        }
      }
    d && d(g);
  }
  const S = [];
  if (t.indexOf("[") !== -1) {
    const l = /\[([\w-]+)/g;
    let g;
    for (; (g = l.exec(t)) !== null; )
      S.push(g[1]);
  } else
    S.push(t);
  Sn({
    selector: t,
    attribute: e,
    componentTag: a,
    attributes: s,
    ComponentFn: i,
    onInit: d,
    observed: S.concat(h),
    onAttributeChange: r,
    onAttrChange: n,
    effects: u,
    declared: w,
    persist: v
  }), Cn();
  const b = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  Tn().push({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: d,
    onSubtreeChange: c,
    query: b
  }), Fi(), window[e] = E;
  function f() {
    En() > 0 ? mt(function() {
      E(document.body);
    }) : E(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f(), E;
}
function qe(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const a = t[i];
    if (!(a === "" || a == null) && (e = !0, !Number.isFinite(Number(a))))
      return "string";
  }
  return e ? "number" : "string";
}
function xe(t, e, i, a) {
  if (i === "number") {
    const r = parseFloat(t), c = parseFloat(e);
    return (isNaN(r) ? 0 : r) - (isNaN(c) ? 0 : c);
  }
  const m = t != null ? String(t) : "", h = e != null ? String(e) : "";
  return a ? a.compare(m, h) : m < h ? -1 : m > h ? 1 : 0;
}
function oe(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function kn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, a = t.threshold != null ? t.threshold : 25, m = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const h = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, r = typeof t.onChange == "function" ? t.onChange : function() {
  }, c = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let o = 0, s = 0, u = 0, w = { sort: null, filters: {}, search: "" }, v = null, E = 0, S = 0, p = !1;
  function b(y) {
    d.set(y, ++E);
  }
  function f() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function l() {
    if (c.size <= e) return;
    const y = Array.from(c.keys()).sort(function(_, A) {
      return (d.get(_) || 0) - (d.get(A) || 0);
    });
    let T = 0;
    for (; c.size > e && T < y.length; )
      c.delete(y[T]), d.delete(y[T]), T++;
  }
  function g(y, T) {
    n.add(y), h(w, y, T);
  }
  return {
    get: function(y) {
      return c.get(y);
    },
    has: function(y) {
      return c.has(y);
    },
    peek: function() {
      return c.size ? c.values().next().value : void 0;
    },
    get logicalTotal() {
      return o;
    },
    get grandTotal() {
      return s;
    },
    get queryGen() {
      return u;
    },
    get size() {
      return c.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(y, T) {
      clearTimeout(v), S = y;
      for (let I = y; I < T; I++)
        c.has(I) && b(I);
      if (o <= 0) return;
      const _ = Math.max(0, y - a), A = Math.min(o, T + a), C = Math.floor(_ / i), q = Math.floor(Math.max(0, A - 1) / i);
      let D = -1;
      for (let I = C; I <= q; I++) {
        const R = I * i, O = Math.min(i, o - R);
        let P = !1;
        const B = Math.max(R, _), H = Math.min(R + O, A);
        for (let z = B; z < H; z++)
          if (!c.has(z)) {
            P = !0;
            break;
          }
        if (P && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (v = setTimeout(function() {
        g(D, i);
      }, m));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(y) {
      if (y = y || {}, y.queryGen != null && y.queryGen !== u) return !1;
      const T = y.offset || 0, _ = y.data || [];
      let A = 0;
      for (let C = 0; C < _.length; C++)
        _[C] != null && A++;
      if (A === 0 && (y.provisional || y.filtered > 0))
        return n.delete(T), !1;
      p && (c.clear(), d.clear(), p = !1), y.provisional || (s = y.total != null ? y.total : s, o = y.filtered != null ? y.filtered : y.data ? y.data.length : o);
      for (let C = 0; C < _.length; C++)
        _[C] != null && (c.set(T + C, _[C]), b(T + C));
      return n.delete(T), l(), r(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(y) {
      y && (w = y), g(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(y) {
      u++, n.clear(), clearTimeout(v), y && (w = y), p = !0, g(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, n.clear(), clearTimeout(v), p = !0;
      const y = Math.max(0, Math.floor(S / i) * i);
      g(y, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(y) {
      n.delete(y);
    },
    destroy: function() {
      clearTimeout(v), c.clear(), d.clear(), n.clear();
    },
    configure: function(y) {
      y = y || {};
      let T = !1;
      if (y.windowSize != null && y.windowSize > 0 && y.windowSize !== e) {
        const _ = y.windowSize < e;
        e = y.windowSize, _ && l(), T = !0;
      }
      y.pageSize != null && y.pageSize > 0 && (i = y.pageSize), y.threshold != null && y.threshold >= 0 && (a = y.threshold), y.fetchDebounce != null && y.fetchDebounce >= 0 && (m = y.fetchDebounce), T && r();
    },
    setGrandTotal: function(y) {
      y == null || isNaN(y) || y < 0 || (s = y, f() || (o = y), r());
    }
  };
}
function Ln(t) {
  return (t || "").replace(/^#/, "");
}
function se(t) {
  const e = t === void 0 ? location.hash : t, i = {}, a = Ln(e);
  if (!a) return i;
  const m = a.split("&");
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (!r) continue;
    const c = r.indexOf(":"), d = c > -1 ? r.slice(0, c) : r, n = c > -1 ? r.slice(c + 1) : "";
    if (d)
      try {
        i[d] = decodeURIComponent(n);
      } catch {
        i[d] = n;
      }
  }
  return i;
}
function st(t) {
  if (!t) return null;
  const e = se();
  return t in e ? e[t] : null;
}
function dt(t, e) {
  if (!t) return;
  const i = se();
  e == null ? delete i[t] : i[t] = String(e);
  const m = Object.keys(i).map(function(h) {
    const r = i[h];
    return r === "" ? h : h + ":" + encodeURIComponent(r);
  }).join("&");
  Ln(location.hash) !== m && (location.hash = m);
}
function Ie(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const a = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return a ? e ? a + "-" + e : a : e || null;
}
function qn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function be(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function xn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function ye(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), a = t.slice(e + 1), m = a ? a.split(",").map(function(h) {
    try {
      return decodeURIComponent(h);
    } catch {
      return h;
    }
  }).filter(Boolean) : [];
  return { key: i, values: m };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = se, window.lnCore.hashGet = st, window.lnCore.hashSet = dt, window.lnCore.hashLinkClick = Ie, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = qn, window.lnCore.hashSortDecode = be, window.lnCore.hashFilterEncode = xn, window.lnCore.hashFilterDecode = ye);
function Zt(t, e, i, a) {
  const m = typeof a == "number" ? a : 4, h = window.innerWidth, r = window.innerHeight, c = e.width, d = e.height, n = (i || "bottom").split("-"), o = n[0], s = n[1] === "start" || n[1] === "end" ? n[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = u[o] || u.bottom;
  function v(f) {
    return f === "top" || f === "bottom" ? s === "start" ? t.left : s === "end" ? t.right - c : t.left + (t.width - c) / 2 : s === "start" ? t.top : s === "end" ? t.bottom - d : t.top + (t.height - d) / 2;
  }
  function E(f) {
    let l, g, y = !0;
    return f === "top" ? (l = t.top - m - d, g = v(f), l < 0 && (y = !1)) : f === "bottom" ? (l = t.bottom + m, g = v(f), l + d > r && (y = !1)) : f === "left" ? (l = v(f), g = t.left - m - c, g < 0 && (y = !1)) : (l = v(f), g = t.right + m, g + c > h && (y = !1)), { top: l, left: g, side: f, fits: y };
  }
  let S = null;
  for (let f = 0; f < w.length; f++) {
    const l = E(w[f]);
    if (l.fits) {
      S = l;
      break;
    }
  }
  S || (S = E(w[0]));
  let p = S.top, b = S.left;
  return c >= h ? b = 0 : (b < 0 && (b = 0), b + c > h && (b = h - c)), d >= r ? p = 0 : (p < 0 && (p = 0), p + d > r && (p = r - d)), { top: p, left: b, placement: S.side };
}
function ve(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, a = e.display, m = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const h = t.offsetWidth, r = t.offsetHeight;
  return e.visibility = i, e.display = a, e.position = m, { width: h, height: r };
}
let Kt = null;
const Pi = "ln-ashlar:storage-salt:v1", Be = 32768;
function Ue(t) {
  let e = "";
  const i = t.byteLength;
  for (let a = 0; a < i; a += Be)
    e += String.fromCharCode.apply(
      null,
      t.subarray(a, Math.min(a + Be, i))
    );
  return btoa(e);
}
function He(t) {
  const e = atob(t), i = e.length, a = new Uint8Array(i);
  for (let m = 0; m < i; m++)
    a[m] = e.charCodeAt(m);
  return a;
}
function In(t, e) {
  let i = Kt, a = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (a = t, typeof CryptoKey < "u" && a.key instanceof CryptoKey && (i = a.key)), { key: i, options: a };
}
async function Bi(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", a = new TextEncoder();
  if (i === "sha256") {
    const d = await crypto.subtle.digest("SHA-256", a.encode(t));
    return crypto.subtle.importKey(
      "raw",
      d,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const m = e.salt || Pi, h = typeof m == "string" ? a.encode(m) : m, r = e.iterations || 1e5, c = await crypto.subtle.importKey(
    "raw",
    a.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: h,
      iterations: r,
      hash: "SHA-256"
    },
    c,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function ze(t, e = {}) {
  if (!t) {
    Kt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Kt = await Bi(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Kt = null, i;
  }
}
function At() {
  return Kt;
}
async function Ui(t, e, i) {
  const { key: a } = In(e);
  if (t == null)
    return t;
  if (!a)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const m = new TextEncoder(), h = crypto.getRandomValues(new Uint8Array(12)), r = typeof t == "string" ? t : JSON.stringify(t), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: h },
      a,
      m.encode(r)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Ue(h),
      data: Ue(new Uint8Array(c))
    };
  } catch (m) {
    throw console.error("[ln-core/crypto] Encryption failed:", m), new Error("[ln-crypto] Encryption failed: " + (m && m.message ? m.message : String(m)));
  }
}
async function Hi(t, e, i) {
  const { key: a, options: m } = In(e), h = m.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!a) {
    if (h)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: No active cryptographic key provided");
  }
  if (!t.iv || !t.data) {
    if (h)
      return { ...t, decryptionError: !0 };
    throw new Error("[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)");
  }
  try {
    const r = new TextDecoder(), c = He(t.iv), d = He(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: c },
      a,
      d
    ), o = r.decode(n);
    try {
      return JSON.parse(o);
    } catch {
      return o;
    }
  } catch (r) {
    if (h)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", r), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (r && r.message ? r.message : String(r)));
  }
}
function Dn(t, e = 100, i = 0) {
  const a = parseFloat(String(t)) || 0, m = parseFloat(String(e)) || 100, h = parseFloat(String(i)) || 0, r = Math.max(h, Math.min(a, m)), c = m - h;
  let d = 0;
  return c > 0 && (d = (r - h) / c * 100), d = Math.max(0, Math.min(100, d)), {
    value: a,
    min: h,
    max: m,
    clampedValue: r,
    percentage: d
  };
}
function ot(t) {
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
    const a = new Date(i);
    return isNaN(a.getTime()) ? null : a;
  }
  return null;
}
function Dt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + a;
}
const yt = {};
function te(t) {
  const e = t || "default";
  if (!yt[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), a = i.formatToParts(1234.5);
    let m = "", h = ".";
    for (let r = 0; r < a.length; r++)
      a[r].type === "group" && (m = a[r].value), a[r].type === "decimal" && (h = a[r].value);
    yt[e] = { groupSep: m, decimalSep: h, fmt: i };
  }
  return yt[e];
}
function Rn(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let a = t.trim();
  return a === "" ? "" : (a = a.replace(/[$€£¥]/g, ""), e && (a = a.split(e).join("")), a = a.replace(/\s/g, ""), i && i !== "." && (a = a.replace(i, ".")), a = a.replace(/[^\d.-]/g, ""), a);
}
function zi(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const a = te(e), m = Rn(i, a.groupSep, a.decimalSep);
  if (m === "" || m === "-") return NaN;
  const h = parseFloat(m);
  return isNaN(h) ? NaN : h;
}
function ct(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const a = e || "default", m = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, h = i.userDecimals != null ? i.userDecimals : null;
  if (m !== null) {
    const r = a + "|max:" + m;
    return yt[r] || (yt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: m
    })), yt[r].format(t);
  }
  if (h !== null && h > 0) {
    const r = a + "|exact:" + h;
    return yt[r] || (yt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: h,
      maximumFractionDigits: h
    })), yt[r].format(t);
  }
  return te(e).fmt.format(t);
}
function we(t) {
  return String(t || "").trim().toLowerCase();
}
function On(t) {
  const e = we(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function Ki(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Mn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let a = 0; a < e.length; a++)
    if (i.indexOf(e[a]) === -1) return !1;
  return !0;
}
function ji(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function De(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let a = 0; a < e.length; a++)
    if (String(e[a]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function Vi(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Wi(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Gi(t, e) {
  return (e || "GET") + " " + (t || "");
}
function $i(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function a(r, c) {
    c = c || {};
    const d = Vi(r), n = Wi(r, c), o = Gi(d, n);
    $i(n) && e.has(o) && (e.get(o).abort(), e.delete(o));
    const s = new AbortController(), u = c.signal;
    let w = null;
    u && (u.aborted ? s.abort(u.reason) : (w = function() {
      s.abort(u.reason);
    }, u.addEventListener("abort", w, { once: !0 })));
    const v = Object.assign({}, c, { signal: s.signal });
    return e.set(o, s), t(r, v).finally(function() {
      u && w && u.removeEventListener("abort", w), e.get(o) === s && e.delete(o);
    });
  }
  a.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = a;
  function m(r) {
    if (!r.detail || !r.detail.url) return;
    const c = r.target, d = (r.detail.method || (r.detail.body ? "POST" : "GET")).toUpperCase(), n = r.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const o = new AbortController(), s = r.detail.signal;
    let u = null;
    s && (s.aborted ? o.abort(s.reason) : (u = function() {
      o.abort(s.reason);
    }, s.addEventListener("abort", u, { once: !0 }))), n && i.set(n, o);
    const w = { method: d, signal: o.signal };
    r.detail.body !== void 0 && (w.body = r.detail.body), window.fetch(r.detail.url, w).then(function(v) {
      s && u && s.removeEventListener("abort", u), n && i.get(n) === o && i.delete(n), L(c, "ln-http:response", {
        ok: v.ok,
        status: v.status,
        response: v
      });
    }).catch(function(v) {
      s && u && s.removeEventListener("abort", u), n && i.get(n) === o && i.delete(n), !(v && v.name === "AbortError") && L(c, "ln-http:error", {
        ok: !1,
        status: 0,
        error: v
      });
    });
  }
  function h(r) {
    const c = r.detail || {};
    c.all ? window.lnHttp.cancelAll() : c.key ? window.lnHttp.cancelByKey(c.key) : c.url && window.lnHttp.cancel(c.url);
  }
  document.addEventListener("ln-http:request", m), document.addEventListener("ln-http:cancel", h), window.lnHttp = {
    cancel: function(r) {
      let c = !1;
      return e.forEach(function(d, n) {
        n.endsWith(" " + r) && (d.abort(), e.delete(n), c = !0);
      }), c;
    },
    cancelByKey: function(r) {
      return i.has(r) ? (i.get(r).abort(), i.delete(r), !0) : !1;
    },
    cancelAll: function() {
      e.forEach(function(r) {
        r.abort();
      }), e.clear(), i.forEach(function(r) {
        r.abort();
      }), i.clear();
    },
    get inflight() {
      const r = [];
      return e.forEach(function(c, d) {
        const n = d.indexOf(" ");
        r.push({ method: d.slice(0, n), url: d.slice(n + 1) });
      }), i.forEach(function(c, d) {
        r.push({ key: d });
      }), r;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", m), document.removeEventListener("ln-http:cancel", h), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: $, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, a = et(i), m = /* @__PURE__ */ new Map();
  function h(r) {
    if (this.dom = r, tt(this, r, a), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Oi(), this._held = !0;
    const c = this, d = this.url;
    let n = m.get(d);
    return n || (n = fetch(d).then(function(o) {
      if (!o.ok)
        throw new Error("HTTP error! status: " + o.status);
      return o.text();
    }).catch(function(o) {
      throw m.delete(d), o;
    }), m.set(d, n)), n.then(function(o) {
      if (c._destroyed) return;
      const s = document.createElement("template");
      s.innerHTML = o, c.dom.content.appendChild(s.content), L(c.dom, "ln-include:loaded", { target: c.dom, url: c.url }), c._held && (c._held = !1, fe());
    }).catch(function(o) {
      c._destroyed || (console.error("[ln-include] Failed to fetch template from " + c.url + ":", o), L(c.dom, "ln-include:error", { target: c.dom, url: c.url, error: o }), c._held && (c._held = !1, fe()));
    }), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, fe()), delete this.dom[e]);
  }, j(t, e, h, "ln-include", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-form", e = "lnForm";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-form": { type: "marker", description: "Identifies the form element as an enhanced ln-form" },
    "data-ln-form-action-edit": { prop: "_actionEdit", type: "string", read: $, fallback: "", description: "URL template or endpoint used when editing an existing record" },
    "data-ln-form-action-method": { prop: "_actionMethod", type: "enum", values: ["PUT", "POST", "PATCH"], fallback: "PUT", description: "HTTP method used when submitting edit action" }
  }, a = et(i);
  function m(h) {
    this.dom = h, tt(this, h, a), this._baseAction = h.getAttribute("action") || "";
    const r = this;
    return this._onLnFill = function(c) {
      c.target === r.dom && (c.detail ? (r.fill(c.detail), r._applyActionMode(c.detail)) : r.dom.reset());
    }, this._onReset = function() {
      r._applyActionMode(null);
    }, h.addEventListener("ln-fill", this._onLnFill), h.addEventListener("reset", this._onReset), this;
  }
  m.prototype.fill = function(h) {
    const r = pn(this.dom, h);
    for (let c = 0; c < r.length; c++) {
      const d = r[c], n = d.tagName === "SELECT" || d.type === "checkbox" || d.type === "radio";
      d.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, m.prototype._ensureMethodInput = function() {
    let h = this.dom.querySelector('input[name="_method"]');
    return h || (h = document.createElement("input"), h.type = "hidden", h.name = "_method", h.value = "", this.dom.appendChild(h)), h;
  }, m.prototype._applyActionMode = function(h) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const r = h && h.id != null && h.id !== "" ? h.id : null, c = this._ensureMethodInput();
    if (r !== null) {
      const d = this._actionEdit;
      d ? this.dom.setAttribute("action", d.replace(":id", encodeURIComponent(r))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(r)), c.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), c.value = "";
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, j(t, e, m, "ln-form", {
    attributes: i
  });
})();
const Ke = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function je(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function Qi(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function Xi(t, e) {
  const i = [];
  if (t) {
    const a = Object.keys(Ke);
    for (let m = 0; m < a.length; m++) {
      const h = a[m], r = Ke[h];
      t[r] && i.push(h);
    }
  }
  if (e) {
    const a = Array.from(e);
    for (let m = 0; m < a.length; m++)
      a[m] && i.indexOf(a[m]) === -1 && i.push(a[m]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", a = "data-ln-validate-error", m = "ln-validate-valid", h = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function c(d) {
    this.dom = d, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, o = d.tagName, s = d.type, u = o === "SELECT" || s === "checkbox" || s === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(v) {
      const E = v.detail && v.detail.error;
      if (!E) return;
      n._customErrors.add(E), n._touched = !0;
      const S = d.closest(".form-element");
      if (S) {
        const p = S.querySelector("[" + a + '="' + E + '"]');
        p && p.classList.remove("hidden");
      }
      d.classList.remove(m), d.classList.add(h), d.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(v) {
      const E = v.detail && v.detail.error, S = d.closest(".form-element");
      if (E) {
        if (n._customErrors.delete(E), S) {
          const p = S.querySelector("[" + a + '="' + E + '"]');
          p && p.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(p) {
          if (S) {
            const b = S.querySelector("[" + a + '="' + p + '"]');
            b && b.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, u || d.addEventListener("input", this._onInput), d.addEventListener("change", this._onChange), d.addEventListener("ln-validate:set-custom", this._onSetCustom), d.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = d.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(v) {
      n._touched = !0, !n.validate() && v.detail && v.detail.invalidFields && v.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(v) {
      const E = { invalidFields: [] };
      L(w, "ln-validate:request-validate", E), E.invalidFields.length > 0 && (v.preventDefault(), E.invalidFields.sort((S, p) => S.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), E.invalidFields[0].focus());
    }))), Qi(d) && (this._touched = !0, this.validate()), this;
  }
  c.prototype.validate = function() {
    const d = this.dom, n = d.validity, o = je(n, this._customErrors.size), s = Xi(n, this._customErrors), u = d.closest(".form-element");
    if (u) {
      const v = u.querySelector("[" + i + "]");
      if (v) {
        const E = v.querySelectorAll("[" + a + "]");
        for (let S = 0; S < E.length; S++) {
          const p = E[S].getAttribute(a);
          E[S].classList.toggle("hidden", !s.includes(p));
        }
      }
    }
    return d.classList.toggle(m, o), d.classList.toggle(h, !o), d.setAttribute("aria-invalid", o ? "false" : "true"), L(d, o ? "ln-validate:valid" : "ln-validate:invalid", { target: d, field: d.name, errors: s }), o;
  }, c.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(m, h), this.dom.removeAttribute("aria-invalid");
    const d = this.dom.closest(".form-element");
    if (d) {
      const n = d.querySelectorAll("[" + a + "]");
      for (let o = 0; o < n.length; o++)
        n[o].classList.add("hidden");
    }
  }, Object.defineProperty(c.prototype, "isValid", {
    get: function() {
      return je(this.dom.validity, this._customErrors.size);
    }
  }), c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const d = this.dom.form;
    d && (this._onFormReset && d.removeEventListener("reset", this._onFormReset), this._onValidateRequest && d.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(m, h), this.dom.removeAttribute("aria-invalid"), delete this.dom[e];
  }, j(t, e, c, "ln-validate", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  function a(s) {
    if (!s.hasAttribute(t) || s[e]) return;
    s[e] = !0;
    const u = d(s);
    m(u.links), h(u.forms);
  }
  function m(s) {
    for (const u of s) {
      if (u[e + "Trigger"] || u.hostname && u.hostname !== window.location.hostname) continue;
      const w = u.getAttribute("href");
      if (w && w.includes("#")) continue;
      const v = function(E) {
        if (!fn(E, u)) return;
        E.preventDefault();
        const S = u.getAttribute("href");
        S && c("GET", S, null, u);
      };
      u.addEventListener("click", v), u[e + "Trigger"] = v;
    }
  }
  function h(s) {
    for (const u of s) {
      if (u[e + "Trigger"]) continue;
      if (u.hasAttribute(i)) {
        u[e + "ScopeWarned"] || (u[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(v) {
        if (v.defaultPrevented) return;
        v.preventDefault();
        const E = u.method.toUpperCase(), S = u.action, p = new FormData(u);
        for (const b of u.querySelectorAll('button, input[type="submit"]'))
          b.disabled = !0;
        c(E, S, p, u, function() {
          for (const b of u.querySelectorAll('button, input[type="submit"]'))
            b.disabled = !1;
        });
      };
      u.addEventListener("submit", w), u[e + "Trigger"] = w;
    }
  }
  function r(s) {
    if (!s[e]) return;
    const u = d(s);
    for (const w of u.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of u.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete s[e];
  }
  function c(s, u, w, v, E) {
    if (Z(v, "ln-ajax:before-start", { method: s, url: u }).defaultPrevented) return;
    L(v, "ln-ajax:start", { method: s, url: u }), v.classList.add("ln-ajax--loading");
    const p = document.createElement("span");
    p.className = "ln-ajax-spinner", v.appendChild(p);
    function b() {
      v.classList.remove("ln-ajax--loading");
      const T = v.querySelector(".ln-ajax-spinner");
      T && T.remove(), E && E();
    }
    let f = u;
    const l = document.querySelector('meta[name="csrf-token"]'), g = l ? l.getAttribute("content") : null;
    w instanceof FormData && g && w.append("_token", g);
    const y = {
      method: s,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (g && (y.headers["X-CSRF-TOKEN"] = g), s === "GET" && w) {
      const T = new URLSearchParams(w);
      f = u + (u.includes("?") ? "&" : "?") + T.toString();
    } else s !== "GET" && w && (y.body = w);
    fetch(f, y).then(function(T) {
      const _ = T.ok, A = T.status;
      return T.text().then(function(C) {
        let q = null, D = null;
        if (C && C.trim())
          try {
            q = JSON.parse(C);
          } catch (I) {
            D = I;
          }
        return { ok: _, status: A, data: q, parseError: D };
      });
    }).then(function(T) {
      const _ = T.status, A = T.data, C = T.parseError;
      if (T.ok && !C) {
        if (A && A.title && (document.title = A.title), A && A.content)
          for (const q in A.content) {
            const D = document.getElementById(q);
            D && (D.innerHTML = A.content[q]);
          }
        if (v.tagName === "A") {
          const q = v.getAttribute("href");
          q && window.history.pushState({ ajax: !0 }, "", q);
        } else v.tagName === "FORM" && v.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", f);
        L(v, "ln-ajax:success", { method: s, url: f, data: A });
      } else
        L(v, "ln-ajax:error", {
          method: s,
          url: f,
          status: _,
          data: A,
          error: C || null
        });
      L(v, "ln-ajax:complete", { method: s, url: f }), b();
    }).catch(function(T) {
      L(v, "ln-ajax:error", { method: s, url: f, status: 0, data: null, error: T }), L(v, "ln-ajax:complete", { method: s, url: f }), b();
    });
  }
  function d(s) {
    const u = { links: [], forms: [] };
    return s.tagName === "A" && s.getAttribute(t) !== "false" ? u.links.push(s) : s.tagName === "FORM" && s.getAttribute(t) !== "false" ? u.forms.push(s) : (u.links = Array.from(s.querySelectorAll('a:not([data-ln-ajax="false"])')), u.forms = Array.from(s.querySelectorAll('form:not([data-ln-ajax="false"])'))), u;
  }
  function n() {
    gt(function() {
      new MutationObserver(function(u) {
        for (const w of u)
          if (w.type === "childList") {
            for (const v of w.addedNodes)
              if (v.nodeType === 1 && (a(v), !v.hasAttribute(t))) {
                for (const S of v.querySelectorAll("[" + t + "]"))
                  a(S);
                const E = v.closest && v.closest("[" + t + "]");
                if (E && E.getAttribute(t) !== "false") {
                  const S = d(v);
                  m(S.links), h(S.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Wt([t], function(u) {
        a(u);
      });
    }, "ln-ajax");
  }
  function o() {
    for (const s of document.querySelectorAll("[" + t + "]"))
      a(s);
  }
  window[e] = a, window[e].destroy = r, n(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o) : o();
})();
function Yi(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: a = null } = {}) {
  const m = i ? !a : !t.some((n) => n.match), h = [], r = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const o = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !o && n.targetEl && h.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || r.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  r.sort((n, o) => n.regionKey === "__primary__" ? -1 : o.regionKey === "__primary__" ? 1 : 0);
  const d = r.find((n) => n.regionKey === "__primary__") || r[0] || null;
  return { notFound: m, clears: h, swaps: r, owner: d };
}
const Nn = {
  navigate: function(t) {
    jt(t, { historyAction: "push" });
  },
  replace: function(t) {
    jt(t, { historyAction: "replace" });
  },
  current: function() {
    return ee === null ? null : {
      path: ee,
      params: Bn,
      query: Un,
      route: Hn,
      regions: Pn
    };
  }
}, Re = "data-ln-route", Fn = "lnRoute";
typeof window < "u" && (window.lnRouter = Nn);
function he(t) {
  Wn(t), Vn(t), _t.size > 0 && jn();
}
const Ji = {
  "data-ln-route": { effect: he, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: he, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: he, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, _t = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new WeakMap();
let Pn = /* @__PURE__ */ new Map(), Ve = !1, ee = null, Bn = {}, Un = {}, Hn = null, Ee = !1;
function We(t, e, i) {
  Ee ? queueMicrotask(function() {
    L(t, e, i);
  }) : L(t, e, i);
}
function ne(t) {
  try {
    const h = new URL(t, window.location.origin);
    t = h.pathname + h.search + h.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, a] = e.split("?");
  const m = {};
  if (a) {
    const h = new URLSearchParams(a);
    for (const [r, c] of h.entries())
      m[r] = c;
  }
  return i = i.replace(/\/+$/, ""), i === "" && (i = "/"), { path: i, query: m };
}
function zn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, a = e.segments, m = Math.max(i.length, a.length);
  for (let h = 0; h < m; h++) {
    const r = i[h], c = a[h];
    if (r === void 0) return 1;
    if (c === void 0) return -1;
    if (r === "*") return 1;
    if (c === "*") return -1;
    const d = r.startsWith(":"), n = c.startsWith(":");
    if (d && !n) return 1;
    if (!d && n) return -1;
  }
  return 0;
}
function Kn(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const a of e) {
    if (a.pattern === "*")
      return {
        route: a,
        params: { wildcard: t }
      };
    const m = a.segments, h = {};
    let r = !0;
    if (!(i.length > m.length && m[m.length - 1] !== "*")) {
      for (let c = 0; c < m.length; c++) {
        const d = m[c], n = i[c];
        if (d === "*") {
          h.wildcard = i.slice(c).join("/");
          break;
        }
        if (n === void 0) {
          r = !1;
          break;
        }
        if (d.startsWith(":"))
          h[d.slice(1)] = decodeURIComponent(n);
        else if (d !== n) {
          r = !1;
          break;
        }
      }
      if (r && (m.indexOf("*") !== -1 || i.length <= m.length))
        return { route: a, params: h };
    }
  }
  return null;
}
function Ae(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const m = document.getElementById(t);
    return !m && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), m;
  }
  const a = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !a && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), a;
}
function Ge(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const m of i)
    for (const h of Object.keys(m))
      if (h.startsWith("ln") && m[h] && typeof m[h].destroy == "function")
        try {
          m[h].destroy();
        } catch (r) {
          console.error(`[ln-router] Error destroying component ${h} on element:`, m, r);
        }
  const a = document.querySelectorAll('[data-ln-popover="open"]');
  for (const m of a) {
    const h = m.lnPopover;
    if (h && h.trigger && t.contains(h.trigger))
      try {
        h.destroy();
      } catch (r) {
        console.error("[ln-router] Error destroying open popover:", r);
      }
  }
}
function jt(t, e = {}) {
  const { path: i, query: a } = ne(t), m = /* @__PURE__ */ new Map();
  for (const [u, w] of _t)
    m.set(u, Kn(i, w.sorted));
  const h = m.get("__primary__") || null, r = Ae("__primary__", { warn: !!h }), c = _t.has("__primary__"), d = [];
  for (const [u, w] of m) {
    const v = u === "__primary__" ? r : Ae(u, { warn: !1 }), E = !v && !!(h && h.route && h.route.templateNode && h.route.templateNode.content && h.route.templateNode.content.querySelector("#" + CSS.escape(u)));
    !v && !E && w && console.warn(`[ln-router] Explicit target element #${u} not found in DOM`), d.push({
      regionKey: u,
      match: w,
      targetEl: v,
      isPending: E,
      hasKeep: !!v && v.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!v && v.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!v && v.children.length > 0,
      mountedTemplate: v && pe.get(v) || null
    });
  }
  const n = Yi(d, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: c,
    primaryMatch: h
  });
  if (n.notFound) {
    We(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Z(r || document.body, "ln-router:before-navigate", {
    from: ee,
    to: t,
    params: h ? h.params : {},
    query: a
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", t) : e.historyAction === "replace" && window.history.replaceState(null, "", t);
  const s = function() {
    for (const u of n.clears)
      Ge(u.targetEl), u.targetEl.replaceChildren(), pe.delete(u.targetEl);
    for (const u of n.swaps) {
      if ((u.isPending || !u.targetEl || !document.contains(u.targetEl)) && (u.targetEl = u.regionKey === "__primary__" ? r : document.getElementById(u.regionKey)), !u.targetEl) {
        console.warn(`[ln-router] Target element #${u.regionKey} could not be resolved`);
        continue;
      }
      if (u.skipMount || (Ge(u.targetEl), u.targetEl.replaceChildren(u.match.route.templateNode.content.cloneNode(!0))), pe.set(u.targetEl, u.match.route.templateNode), n.owner && u.regionKey === n.owner.regionKey) {
        if (u.match.route.title) {
          let w = u.match.route.title;
          if (u.match.params)
            for (const [v, E] of Object.entries(u.match.params))
              w = w.replace(new RegExp("\\{\\{\\s*" + v + "\\s*\\}\\}", "g"), E);
          document.title = w;
        }
        if (!e.isHydration) {
          u.targetEl.hasAttribute("tabindex") || u.targetEl.setAttribute("tabindex", "-1");
          const w = u.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          w ? (w.setAttribute("tabindex", "-1"), w.focus()) : u.targetEl.focus(), u.regionKey === "__primary__" && u.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      We(u.targetEl, "ln-router:navigated", {
        path: t,
        params: u.match.params,
        query: a,
        route: u.match.route,
        target: u.targetEl,
        region: u.regionKey
      });
    }
    ee = t, Un = a, Hn = h ? h.route : null, Bn = h ? h.params : {}, Pn = new Map(
      Array.from(m.entries()).map(([u, w]) => [u, w ? { route: w.route, params: w.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(s) : s();
}
function Zi(t) {
  const e = t.target.closest("a");
  if (!e || !fn(t, e)) return;
  const i = e.getAttribute("href"), { path: a } = ne(i);
  for (const m of _t.values())
    if (Kn(a, m.sorted)) {
      t.preventDefault(), jt(i, { historyAction: "push" });
      return;
    }
}
function tr(t, e) {
  const i = Object.keys(t), a = Object.keys(e);
  if (i.length !== a.length) return !1;
  for (let m = 0; m < i.length; m++) {
    const h = i[m];
    if (t[h] !== e[h]) return !1;
  }
  return !0;
}
function er() {
  const t = window.location.pathname + window.location.search, e = Nn.current();
  if (e && e.path != null) {
    const i = ne(t);
    if (ne(e.path).path === i.path && tr(e.query, i.query))
      return;
  }
  jt(t, { historyAction: "skip" });
}
function jn() {
  Ve || (Ve = !0, gt(function() {
    document.addEventListener("click", Zi), window.addEventListener("popstate", er), Ee = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    jt(t, { historyAction: "replace", isHydration: !0 }), Ee = !1;
  }, "ln-router"));
}
function Vn(t) {
  const e = t.getAttribute(Re);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const a = i || "__primary__";
  _t.has(a) || _t.set(a, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const m = _t.get(a);
  if (m.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${a}"`);
    return;
  }
  const h = t.getAttribute("data-ln-route-title"), r = e.split("/").filter(Boolean), c = {
    pattern: e,
    segments: r,
    target: i,
    title: h,
    templateNode: t
  }, d = Ae(a);
  d && d.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), m.routes.set(e, c), m.sorted = Array.from(m.routes.values()).sort(zn);
}
function Wn(t) {
  const e = t.getAttribute(Re);
  if (!e) return;
  const a = t.getAttribute("data-ln-route-target") || null || "__primary__", m = _t.get(a);
  m && (m.routes.delete(e), m.sorted = Array.from(m.routes.values()).sort(zn), m.routes.size === 0 && _t.delete(a));
}
function Gn(t) {
  return this.dom = t, Vn(t), this;
}
Gn.prototype.destroy = function() {
  Wn(this.dom), delete this.dom[Fn];
};
j(Re, Fn, Gn, "ln-router", {
  attributes: Ji,
  onInit: function() {
    _t.size > 0 && jn();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: m,
      description: "Control state of the modal dialog"
    },
    "data-ln-modal-close": {
      type: "trigger",
      description: "Click dismiss trigger inside the modal"
    }
  };
  function a(h) {
    this.dom = h, this.isOpen = h.getAttribute(t) === "open";
    const r = this;
    return this._onRequestOpen = function() {
      r.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      r.dom.setAttribute(t, "close");
    }, this._onCancel = function(c) {
      c.preventDefault(), r.dom.setAttribute(t, "close");
    }, this._onClickClose = function(c) {
      const d = c.target.closest("[data-ln-modal-close]");
      d && r.dom.contains(d) && (c.preventDefault(), r.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open")), this;
  }
  a.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, a.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, a.prototype.toggle = function() {
    const h = this.dom.getAttribute(t);
    this.dom.setAttribute(t, h === "open" ? "close" : "open");
  }, a.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), this.isOpen) {
        const h = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(c) {
            return c !== h;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function m(h) {
    const r = h[e];
    if (!r) return;
    const d = h.getAttribute(t) === "open";
    if (d !== r.isOpen)
      if (d) {
        if (Z(h, "ln-modal:before-open", { modalId: h.id, target: h }).defaultPrevented) {
          h.setAttribute(t, "close");
          return;
        }
        r.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof h.showModal == "function" && h.showModal();
        const o = h.querySelector("[autofocus]");
        if (o && zt(o))
          o.focus();
        else {
          const s = h.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), u = Array.prototype.find.call(s, zt);
          if (u) u.focus();
          else {
            const w = h.querySelectorAll("a[href], button:not([disabled])"), v = Array.prototype.find.call(w, zt);
            v && v.focus();
          }
        }
        L(h, "ln-modal:open", { modalId: h.id, target: h });
      } else {
        if (Z(h, "ln-modal:before-close", { modalId: h.id, target: h }).defaultPrevented) {
          h.setAttribute(t, "open");
          return;
        }
        r.isOpen = !1, L(h, "ln-modal:close", { modalId: h.id, target: h }), typeof h.close == "function" && h.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  j(t, e, a, "ln-modal", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-ui-coordinator", e = "lnUiCoordinator", i = "data-ln-ui-coordinator-dict";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-ui-coordinator": { type: "marker", description: "Mounts UI coordinator mediating global hash-routing, modals, and toasts" },
    "data-ln-ui-coordinator-dict": { type: "string", description: "Dictionary key prefix mapping for translatable UI coordinator messages" }
  };
  function m(p) {
    const b = {};
    let f = p;
    const l = [];
    for (; f; ) {
      const g = f.closest("[" + t + "]");
      if (!g) break;
      g[e] && g[e].dict && l.unshift(g[e].dict), f = g.parentElement;
    }
    for (const g of l)
      Object.assign(b, g);
    return b;
  }
  function h(p, b) {
    if (b) {
      if (p) {
        const l = p.closest("[" + t + "]");
        if (l) {
          if (l.id === b && l.hasAttribute("data-ln-modal")) return l;
          const g = l.querySelector("#" + CSS.escape(b) + '[data-ln-modal], [data-ln-modal="' + b + '"]');
          if (g) return g;
        }
      }
      const f = document.getElementById(b) || document.querySelector('[data-ln-modal="' + b + '"]');
      if (f) return f;
    }
    if (p) {
      const f = p.closest("[" + t + "]");
      if (f) {
        if (f.hasAttribute("data-ln-modal")) return f;
        const g = f.querySelector("[data-ln-modal]");
        if (g) return g;
      }
      const l = p.closest("[data-ln-modal]");
      if (l) return l;
    }
    return document.querySelector("[data-ln-modal]");
  }
  function r(p, b) {
    if (p !== "edit") return "";
    if (b) {
      const f = b.getAttribute("data-ln-fill-id");
      if (f) return f;
    }
    return "edit";
  }
  function c(p) {
    if (!p) return;
    const b = p.querySelectorAll("[data-ln-field]");
    for (let l = 0; l < b.length; l++)
      b[l].textContent = "";
    const f = p.querySelectorAll("form");
    for (let l = 0; l < f.length; l++)
      window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(f[l], null) : f[l].reset();
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const b = p.target.closest("[data-ln-modal-for]");
    if (b) {
      const l = b.getAttribute("data-ln-modal-for"), g = h(b, l);
      if (g && g.lnModal) {
        p.preventDefault();
        const y = { lnModalFor: !0, lnModalClose: !0, lnModalMode: !0 }, T = {}, _ = b.dataset;
        for (const q in _) {
          if (!q.startsWith("lnModal") || y[q]) continue;
          const D = q.slice(7);
          D && (T[D.charAt(0).toLowerCase() + D.slice(1)] = _[q]);
        }
        const A = Object.keys(T).length > 0;
        b.hasAttribute("data-ln-modal-mode") ? g.dataset.lnModalMode = b.getAttribute("data-ln-modal-mode") : g.dataset.lnModalMode = A ? "edit" : "new", A && window.lnCore && typeof window.lnCore.lnFill == "function" ? window.lnCore.lnFill(g, T) : g.dataset.lnModalMode === "new" && c(g), g.getAttribute("data-ln-modal") === "open" ? L(g, "ln-modal:request-close", {}) : (g.id && dt(g.id, r(g.dataset.lnModalMode, b)), L(g, "ln-modal:request-open", {}));
      }
      return;
    }
    const f = p.target.closest('a[href^="#"]');
    if (f) {
      const l = se(f.getAttribute("href"));
      for (const g in l) {
        const y = document.getElementById(g);
        if (y && y.lnModal) {
          if (!Ie(p)) return;
          dt(g, l[g]);
          return;
        }
      }
    }
  }), document.addEventListener("ln-modal:before-open", function(p) {
    const b = p.target;
    if (!b || !b.lnModal) return;
    (b.dataset.lnModalMode || "new") === "new" && c(b);
  }), document.addEventListener("ln-modal:open", function(p) {
    const b = p.target;
    if (!b || !b.lnModal || !b.id) return;
    let f = st(b.id);
    f === null && (f = r(b.dataset.lnModalMode, null), dt(b.id, f)), f ? (b.dataset.lnModalMode = "edit", L(b, "ln-fill:request", { id: f })) : (b.dataset.lnModalMode = "new", c(b));
  });
  let d = !1;
  function n() {
    if (!d) {
      d = !0;
      try {
        const p = document.querySelectorAll("[data-ln-modal][id]");
        for (let b = 0; b < p.length; b++) {
          const f = p[b];
          if (!f.lnModal) continue;
          const l = f.id, g = st(l), y = g !== null, T = f.lnModal.isOpen;
          if (y) {
            const _ = g ? "edit" : "new";
            f.dataset.lnModalMode = _, T ? g ? L(f, "ln-fill:request", { id: g }) : c(f) : L(f, "ln-modal:request-open", {});
          } else T && L(f, "ln-modal:request-close", {});
        }
      } finally {
        d = !1;
      }
    }
  }
  function o() {
    const p = document.querySelectorAll('[data-ln-modal="open"][id]');
    for (let b = 0; b < p.length; b++) {
      const f = p[b];
      f.lnModal && st(f.id) === null && dt(f.id, r(f.dataset.lnModalMode, null));
    }
  }
  window.addEventListener("hashchange", n);
  function s() {
    o(), n();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
    mt(s);
  }) : mt(s);
  function u(p) {
    const f = (p.detail || {}).data;
    if (f && f.message) {
      const g = f.message;
      L(window, "ln-toast:enqueue", {
        type: g.type || "success",
        title: g.title || "",
        message: g.body || ""
      });
    }
    const l = p.target.closest("[data-ln-modal]");
    l && l.lnModal && (l.id && dt(l.id, null), L(l, "ln-modal:request-close", {}), c(l));
  }
  function w(p) {
    const b = p.detail || {}, f = b.data, l = b.status || 0, g = m(p.target);
    if (f && f.message) {
      const y = f.message;
      L(window, "ln-toast:enqueue", {
        type: y.type || "error",
        title: y.title || "",
        message: y.body || ""
      });
    } else l === 0 ? L(window, "ln-toast:enqueue", {
      type: "error",
      title: g["network-error-title"] || "",
      message: g["network-error"] || "Network error"
    }) : L(window, "ln-toast:enqueue", {
      type: "error",
      title: g["server-error-title"] || "",
      message: g["server-error"] || "Server error"
    });
  }
  document.addEventListener("ln-ajax:success", u), document.addEventListener("ln-ajax:error", w);
  function v(p) {
    const b = p.detail || {}, f = m(p.target), l = b.message || (b.reason === "max-size" ? f["upload-max-size"] || "File is too large" : b.reason === "max-files" ? f["upload-max-files"] || "Maximum file count exceeded" : f["upload-invalid-type"] || "This file type is not allowed"), g = f["upload-invalid-title"] || "Invalid File";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: g,
      message: l
    });
  }
  function E(p) {
    const b = p.detail || {}, f = m(p.target), l = b.message || f["upload-failed"] || "Failed to upload file", g = f["upload-error-title"] || "Upload Error";
    L(window, "ln-toast:enqueue", {
      type: "error",
      title: g,
      message: l
    });
  }
  document.addEventListener("ln-upload:invalid", v), document.addEventListener("ln-upload:error", E), document.addEventListener("ln-modal:close", function(p) {
    const b = p.target;
    !b || !b.lnModal || (b.id && st(b.id) !== null && dt(b.id, null), b.dataset.lnModalMode === "new" && c(b));
  });
  function S(p) {
    return this.dom = p, this.dict = re(p, i), this;
  }
  S.prototype.destroy = function() {
    this.dom[e] && (this.dict = {}, delete this.dom[e]);
  }, j(t, e, S, "ln-ui-coordinator", {
    attributes: a
  });
})();
function nr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, a = 0;
  for (let m = 0; m < t.length && i > 0; m++)
    a = m + 1, /[0-9]/.test(t[m]) && i--;
  return i > 0 && (a = t.length), a;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(r) {
    const c = r[e];
    c && (c.isTextElement ? c._initTextElement() : isNaN(c.value) || c._displayFormatted(c.value));
  }
  const a = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(r) {
    if (r[e]) return r[e];
    r[e] = this, this.dom = r;
    const c = this;
    if (this._onLocaleChange = function() {
      c.isTextElement ? c._formatTextContent() : isNaN(c.value) || c._displayFormatted(c.value);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const d = document.createElement("input");
    d.type = "hidden", d.name = r.name, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && d.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.type = "text", r.setAttribute("inputmode", "decimal"), r.insertAdjacentElement("afterend", d), this._hidden = d, Object.defineProperty(d, "value", {
      get: function() {
        return m.get.call(d);
      },
      set: function(o) {
        if (m.set.call(d, o), o !== "" && !isNaN(parseFloat(o))) {
          const s = c.dom.getAttribute("data-ln-number-decimals");
          c._setDisplayRaw(ct(parseFloat(o), it(c.dom), { maxDecimals: s }));
        } else
          c._setDisplayRaw("");
        c.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), mn(r, m, {
      get: function() {
        return m.get.call(r);
      },
      set: function(o) {
        if (o === "") {
          c._setDisplayRaw(""), c._setHiddenRaw(""), r.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const s = typeof o == "number" ? o : parseFloat(String(o));
        if (isNaN(s))
          c._setDisplayRaw(String(o)), c._setHiddenRaw("");
        else {
          c._setHiddenRaw(s);
          const u = r.getAttribute("data-ln-number-decimals");
          c._setDisplayRaw(ct(s, it(r), { maxDecimals: u }));
        }
        r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      c._handleInput();
    }, r.addEventListener("input", this._onInput), this._onKeyDown = function(o) {
      if (o.key !== "Backspace") return;
      const s = r.selectionStart, u = r.selectionEnd;
      if (s !== u || s === 0) return;
      const w = te(it(r)), v = m.get.call(r), E = v[s - 1];
      if (E === w.groupSep || /\s/.test(E)) {
        o.preventDefault();
        const S = s - 2 >= 0 ? s - 2 : 0, p = v.slice(0, S) + v.slice(s);
        m.set.call(r, p), r.setSelectionRange(S, S), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, r.addEventListener("keydown", this._onKeyDown), this._onPaste = function(o) {
      o.preventDefault();
      const s = (o.clipboardData || window.clipboardData).getData("text"), u = zi(s, it(r));
      c.value = isNaN(u) ? NaN : u;
    }, r.addEventListener("paste", this._onPaste);
    const n = r.value;
    if (n !== "") {
      const o = parseFloat(n);
      if (!isNaN(o)) {
        const s = r.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(o), this._setDisplayRaw(ct(o, it(r), { maxDecimals: s })), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  h.prototype._initTextElement = function() {
    const r = this.dom;
    let c = r.getAttribute("data-ln-value"), d = r.getAttribute("data-ln-number"), n = null;
    c !== null && c !== "" ? n = c : d !== null && d !== "" && d !== "true" ? n = d : n = r.textContent.trim();
    const o = parseFloat(n);
    isNaN(o) ? this._rawValue = null : (this._rawValue = o, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", String(o)), this._formatTextContent());
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ct(this._rawValue, it(this.dom), { maxDecimals: r });
    }
  }, h.prototype._handleInput = function() {
    const r = this.dom, c = m.get.call(r);
    if (c === "") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (c === "-") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const d = r.selectionStart;
    let n = 0;
    for (let g = 0; g < d; g++)
      /[0-9]/.test(c[g]) && n++;
    const o = it(r), s = te(o);
    let u = c, w = Rn(c, s.groupSep, s.decimalSep), v = parseFloat(w);
    if (isNaN(v)) {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: c });
      return;
    }
    const E = r.getAttribute("data-ln-number-decimals"), S = w.indexOf(".");
    if (E !== null && S !== -1) {
      const g = parseInt(E, 10), y = w.slice(S + 1);
      if (g === 0)
        w = w.slice(0, S), u = u.split(s.decimalSep)[0], v = parseFloat(w), this._setDisplayRaw(u);
      else if (y.length > g) {
        w = w.slice(0, S + 1 + g);
        const T = u.split(s.decimalSep);
        u = T[0] + s.decimalSep + T[1].slice(0, g), v = parseFloat(w), this._setDisplayRaw(u);
      }
    }
    const p = r.getAttribute("data-ln-number-max");
    if (p !== null && v > parseFloat(p)) {
      const g = parseFloat(p), y = ct(g, o, { maxDecimals: E });
      this._setDisplayRaw(y), this._setHiddenRaw(g), r.setSelectionRange(y.length, y.length), L(r, "ln-number:input", { value: g, formatted: y });
      return;
    }
    if (u.endsWith(s.decimalSep) || s.decimalSep !== "." && u.endsWith(".")) {
      this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: u });
      return;
    }
    const b = w.indexOf(".");
    if (b !== -1 && w.slice(b + 1).endsWith("0")) {
      this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: u });
      return;
    }
    let f;
    if (E !== null)
      f = ct(v, o, { maxDecimals: E });
    else {
      const g = b !== -1 ? w.slice(b + 1).length : 0;
      f = ct(v, o, { userDecimals: g });
    }
    this._setDisplayRaw(f);
    const l = nr(f, n);
    r.setSelectionRange(l, l), this._setHiddenRaw(v), L(r, "ln-number:input", { value: v, formatted: f });
  }, h.prototype._setHiddenRaw = function(r) {
    this._hidden && m.set.call(this._hidden, String(r));
  }, h.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : m.set.call(this.dom, String(r));
  }, h.prototype._displayFormatted = function(r) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const c = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(r, it(this.dom), { maxDecimals: c }));
    }
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const r = m.get.call(this._hidden);
      return r === "" ? NaN : parseFloat(r);
    },
    set: function(r) {
      const c = typeof r == "number" ? r : parseFloat(r);
      if (this.isTextElement) {
        isNaN(c) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = c, this.dom.setAttribute("data-ln-value", String(c)), this._formatTextContent());
        return;
      }
      if (isNaN(c)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(c);
      const d = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ct(c, it(this.dom), { maxDecimals: d })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : m.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, j(t, e, h, "ln-number", {
    attributes: a,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Se = /^(short|medium|long)(\s+datetime)?$/, ir = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function rr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Se) ? ir[t.trim()] : null;
}
function Pt(t) {
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
  const m = [];
  for (let n = 0; n < 3; n++) {
    const o = parseInt(a[n], 10);
    if (isNaN(o)) return null;
    m.push(o);
  }
  let h, r, c;
  i === "." ? (h = m[0], r = m[1], c = m[2]) : i === "/" ? (r = m[0], h = m[1], c = m[2]) : a[0].length === 4 ? (c = m[0], r = m[1], h = m[2]) : (h = m[0], r = m[1], c = m[2]), c < 100 && (c += c < 50 ? 2e3 : 1900);
  const d = new Date(c, r - 1, h);
  return d.getFullYear() !== c || d.getMonth() !== r - 1 || d.getDate() !== h ? null : d;
}
function me(t, e, i, a) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const m = t.getDate(), h = t.getMonth(), r = t.getFullYear(), c = t.getHours(), d = t.getMinutes();
  let n, o;
  const s = (i || "").toLowerCase().split("-")[0];
  let u = !1;
  try {
    const E = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    u = !!(a && E !== s);
  } catch {
    u = !!a;
  }
  if (u && a && a.monthsLong)
    n = a.monthsLong[h];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(h + 1);
    }
  if (u && a && a.monthsShort)
    o = a.monthsShort[h];
  else
    try {
      o = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      o = String(h + 1);
    }
  const w = {
    yyyy: String(r),
    yy: String(r).slice(-2),
    MMMM: n,
    MMM: o,
    MM: String(h + 1).padStart(2, "0"),
    M: String(h + 1),
    dd: String(m).padStart(2, "0"),
    d: String(m),
    HH: String(c).padStart(2, "0"),
    mm: String(d).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(v) {
    return w[v] !== void 0 ? w[v] : v;
  });
}
function Gt(t, e, i, a) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const m = rr(e);
  if (m)
    try {
      const h = new Intl.DateTimeFormat(i, m), r = (i || "").toLowerCase().split("-")[0], c = h.resolvedOptions().locale.toLowerCase().split("-")[0];
      return a && c !== r ? me(t, "dd.MM.yyyy", i, a) : h.format(t);
    } catch {
      return me(t, "dd.MM.yyyy", i, a);
    }
  return me(t, e || "dd.MM.yyyy", i, a);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(n) {
    const o = n[e];
    if (o) {
      if (o.isTextElement)
        o._initTextElement();
      else if (o.value) {
        const s = ot(o.value);
        s && o._displayFormatted(s);
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
  }, m = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(n, o, s) {
    L(n.dom, "ln-date:change", {
      value: o,
      formatted: n.dom.value,
      date: s
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function r(n, o, s, u) {
    n._setHiddenRaw(o), m.set.call(n._picker, o), n._lastISO = o, u !== void 0 ? (n._isFormatting = !0, n.dom.value = u, n._isFormatting = !1) : s && n._displayFormatted(s), h(n, o, s);
  }
  function c(n) {
    n._setHiddenRaw(""), m.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", h(n, "", null);
  }
  function d(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const o = this;
    if (this._onLocaleChange = function() {
      if (o.isTextElement)
        o._formatTextContent();
      else if (o.value) {
        const f = ot(o.value);
        f && o._displayFormatted(f);
      }
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const s = n.value, u = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const f = w.querySelectorAll("[data-ln-date-dict]");
      for (let l = 0; l < f.length; l++) {
        const g = f[l].getAttribute("data-ln-date-dict");
        if (g) {
          const y = re(f[l], "data-ln-date-dict-key");
          y["months-long"] && (y.monthsLong = y["months-long"].split(",").map((T) => T.trim())), y["months-short"] && (y.monthsShort = y["months-short"].split(",").map((T) => T.trim())), yn(g, y);
        }
      }
    }
    const v = document.createElement("span");
    v.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(v, n), v.appendChild(n), this._wrapper = v;
    const E = document.createElement("input");
    E.type = "hidden", E.name = u, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && E.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", E), this._hidden = E;
    const S = document.createElement("input");
    S.type = "date", S.tabIndex = -1, S.setAttribute("tabindex", "-1"), S.setAttribute("aria-hidden", "true"), S.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), S.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", E.insertAdjacentElement("afterend", S), this._picker = S, n.type = "text";
    const p = document.createElement("button");
    p.type = "button", p.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), p.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', S.insertAdjacentElement("afterend", p), this._btn = p, this._lastISO = "", Object.defineProperty(E, "value", {
      get: function() {
        return m.get.call(E);
      },
      set: function(f) {
        if (m.set.call(E, f), f && f !== "") {
          const l = ot(f);
          l && r(o, f, l);
        } else f === "" && c(o);
      }
    }), mn(n, m, {
      get: function() {
        return m.get.call(n);
      },
      set: function(f, l) {
        if (o._isFormatting) {
          l(f);
          return;
        }
        if (!f || f === "") {
          l(""), c(o);
          return;
        }
        const g = ot(f) || Pt(f);
        if (g) {
          const y = Dt(g), T = n.getAttribute(t) || "", _ = it(n), A = Lt(_), C = Gt(g, T, _, A);
          l(C), r(o, y, g, C);
        } else
          l(String(f)), c(o);
      }
    }), this._onPickerChange = function() {
      const f = S.value;
      if (f) {
        const l = ot(f);
        l && r(o, f, l);
      } else
        c(o);
    }, S.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const f = o.dom.value.trim();
      if (f === "") {
        o._lastISO !== "" && c(o);
        return;
      }
      if (o._lastISO) {
        const g = ot(o._lastISO);
        if (g) {
          const y = o.dom.getAttribute(t) || "", T = it(o.dom), _ = Lt(T);
          if (f === Gt(g, y, T, _)) return;
        }
      }
      const l = Pt(f);
      if (l) {
        const g = Dt(l);
        r(o, g, l);
      } else if (o._lastISO) {
        const g = ot(o._lastISO);
        g && o._displayFormatted(g);
      } else
        o.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      o._openPicker();
    }, p.addEventListener("click", this._onBtnClick);
    const b = n.form;
    if (b && (this._form = b, this._onFormReset = function() {
      setTimeout(function() {
        const f = o.dom.value;
        if (f) {
          const l = ot(f) || Pt(f);
          if (l) {
            const g = Dt(l);
            r(o, g, l);
            return;
          }
        }
        c(o);
      }, 0);
    }, b.addEventListener("reset", this._onFormReset)), s && s !== "") {
      const f = ot(s);
      f && r(o, s, f);
    }
    return this;
  }
  d.prototype._initTextElement = function() {
    const n = this.dom, o = n.getAttribute("data-ln-value"), s = n.getAttribute("data-ln-date"), u = n.getAttribute("datetime");
    let w = null;
    n.tagName === "TIME" && u !== null && u !== "" ? w = u : o !== null && o !== "" ? w = o : u !== null && u !== "" ? w = u : s !== null && s !== "" && s !== "true" && !Se.test(s) ? w = s : w = n.textContent.trim();
    const v = ot(w) || Pt(w);
    if (v && !isNaN(v.getTime())) {
      const E = Dt(v);
      this._rawValue = E, n.tagName !== "TIME" && !n.hasAttribute("data-ln-value") && n.setAttribute("data-ln-value", E), this._formatTextContent();
    } else
      this._rawValue = null;
  }, d.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = ot(this._rawValue);
      if (n) {
        let s = this.dom.getAttribute("data-ln-date-format");
        if (!s) {
          const v = this.dom.getAttribute("data-ln-date");
          v && Se.test(v) && (s = v);
        }
        const u = it(this.dom), w = Lt(u);
        this.dom.textContent = Gt(n, s || "medium", u, w);
      }
    }
  }, d.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, d.prototype._setHiddenRaw = function(n) {
    m.set.call(this._hidden, n);
  }, d.prototype._displayFormatted = function(n) {
    const o = this.dom.getAttribute(t) || "", s = it(this.dom), u = Lt(s);
    this._isFormatting = !0, this.dom.value = Gt(n, o, s, u), this._isFormatting = !1;
  }, Object.defineProperty(d.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : m.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const s = ot(n) || Pt(n);
        if (!s) return;
        const u = Dt(s);
        this._rawValue = u, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", u) : this.dom.setAttribute("data-ln-value", u), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        c(this);
        return;
      }
      const o = ot(n);
      o && r(this, n, o);
    }
  }), Object.defineProperty(d.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? ot(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = Dt(n);
    }
  }), Object.defineProperty(d.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), d.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), delete this.dom[e];
  }, j(t, e, d, "ln-date", {
    attributes: a,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: i
  });
})();
(function() {
  const t = "data-ln-nav", e = "lnNav";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-nav": { effect: r, type: "string", fallback: "active", description: "CSS class name applied to active navigation links" },
    "data-ln-nav-exact": { prop: "exact", read: It, effect: r, type: "boolean", fallback: !1, description: "Match exact URL pathname instead of prefix matching" }
  }, a = et(i);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const c = history.pushState;
    history.pushState = function() {
      c.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    };
    const d = history.replaceState;
    history.replaceState = function() {
      d.apply(history, arguments);
      for (const n of history._lnNavCallbacks)
        n();
    }, history._lnNavPatched = !0;
  }
  function m(c) {
    return this.dom = c, tt(this, c, a), this.activeClass = c.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(c, { childList: !0, subtree: !0 }), this.update(), this;
  }
  m.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const d = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, o = h(n), s = [];
    for (const u of d) {
      const w = u.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      if (u.hostname && u.hostname !== window.location.hostname) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      const v = h(w), E = v === o, S = !this.exact && v !== "/" && o.startsWith(v + "/");
      E || S ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), s.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: s });
  }, m.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const c = history._lnNavCallbacks.indexOf(this.updateHandler);
    c !== -1 && history._lnNavCallbacks.splice(c, 1), delete this.dom[e];
  };
  function h(c) {
    try {
      return new URL(c, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return c.replace(/\/$/, "") || "/";
    }
  }
  function r(c, d) {
    const n = c[e];
    if (n) {
      if (d === t) {
        if (!c.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const o = n.activeClass, s = c.getAttribute(t) || "active";
        if (o !== s) {
          const u = c.querySelectorAll("a");
          for (const w of u)
            o && w.classList.remove(o);
          n.activeClass = s;
        }
      }
      n.update();
    }
  }
  j(t, e, m, "ln-nav", {
    attributes: i
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(r, c) {
    const d = r.getAttribute("data-ln-persist"), n = d !== null && d !== "" ? d : r.id;
    return n ? r.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + c : "ln:" + n + ":" + c : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', r), null);
  }
  let i = null;
  function a() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const r = "__ln_persist_test__";
      return localStorage.setItem(r, r), localStorage.removeItem(r), i = !0;
    } catch {
      return i = !1;
    }
  }
  const m = /* @__PURE__ */ new Set();
  function h(r, c) {
    const d = window.lnCore && window.lnCore._attrRegistry, n = d && d.persist || [];
    let o = null;
    for (let v = 0; v < n.length; v++)
      if (n[v].selector === c) {
        o = n[v];
        break;
      }
    if (!o) return;
    const s = o.persist;
    if (m.has(s.attr) || (m.add(s.attr), Wt([s.attr], function(v, E) {
      if (!v.hasAttribute("data-ln-persist") || s.hashActive && s.hashActive(v)) return;
      const S = e(v, E);
      if (!S || !a()) return;
      const p = v.getAttribute(E);
      try {
        p === null ? localStorage.removeItem(S) : localStorage.setItem(S, p);
      } catch {
      }
    })), s.hashActive && s.hashActive(r)) return;
    const u = e(r, s.attr);
    if (!u || !a()) return;
    const w = localStorage.getItem(u);
    w !== null && r.setAttribute(s.attr, w);
  }
  vi(h);
})();
function $e(t, e, i, a) {
  const m = (t || "").toLowerCase().trim();
  if (m) return m;
  if ((e || "").toUpperCase() !== "A") return "";
  const h = i || "";
  if (!h.startsWith("#")) return "";
  const r = h.slice(1);
  if (!r) return "";
  const c = r.split("&"), d = (a || "").toLowerCase().trim();
  if (d)
    for (const s of c) {
      const u = s.indexOf(":");
      if (u > 0 && s.slice(0, u).toLowerCase().trim() === d)
        return s.slice(u + 1).toLowerCase().trim();
    }
  const n = c[c.length - 1] || "", o = n.indexOf(":");
  return (o > 0 ? n.slice(o + 1) : n).toLowerCase().trim();
}
function Qe(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (h) => (h.tagName || "").toUpperCase() === "A" && (h.href || "").startsWith("#")
  ), a = i.length > 0 && i.length === t.length, m = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : a && !m ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: a && !!m,
    warning: null
  };
}
function Xe(t, e, i) {
  const a = (t || "").toLowerCase().trim();
  return a && Array.isArray(e) && e.includes(a) ? a : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(d) {
    const n = d.getAttribute("data-ln-tabs-active");
    d[e] && d[e]._applyActive(n);
  }
  function a(d, n) {
    return (d.getAttribute(n) || d.id || "").toLowerCase().trim();
  }
  const m = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: a, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, h = et(m);
  function r(d) {
    return this.dom = d, tt(this, d, h), this.activeKey = null, c.call(this), this;
  }
  function c() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const d = this.tabs.map((s) => ({
      tagName: s.tagName,
      href: s.getAttribute("href")
    })), n = Qe(d, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const s of this.tabs) {
      const u = $e(s.getAttribute("data-ln-tab"), s.tagName, s.getAttribute("href"), this.nsKey);
      u ? this.mapTabs[u] = s : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', s);
    }
    for (const s of this.panels) {
      const u = (s.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      u && (this.mapPanels[u] = s);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const o = this;
    this._clickHandlers = [];
    for (const s of this.tabs) {
      if (s[e + "Trigger"]) continue;
      const u = function(w) {
        const v = s.tagName === "A";
        if (!v && (w.ctrlKey || w.metaKey || w.button === 1)) return;
        const E = $e(s.getAttribute("data-ln-tab"), s.tagName, s.getAttribute("href"), o.nsKey);
        E && (v && !Ie(w) || (o.hashEnabled ? st(o.nsKey) === E ? o.dom.setAttribute("data-ln-tabs-active", E) : dt(o.nsKey, E) : o.dom.setAttribute("data-ln-tabs-active", E)));
      };
      s.addEventListener("click", u), s[e + "Trigger"] = u, o._clickHandlers.push({ el: s, handler: u });
    }
    if (this._onRequestSelect = function(s) {
      const u = s.detail && (s.detail.key || s.detail.tab);
      u && o.select(u);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const s = st(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", s !== null ? s : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const s = Xe(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", s);
    }
  }
  r.prototype.select = function(d) {
    const n = (d + "").toLowerCase().trim();
    n && (this.hashEnabled ? st(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : dt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, r.prototype._applyActive = function(d) {
    var o;
    if (d = Xe(d, Object.keys(this.mapPanels), this.defaultKey), d === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && Z(this.dom, "ln-tabs:before-change", {
      key: d,
      previousKey: n,
      tab: this.mapTabs[d],
      panel: this.mapPanels[d],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && st(this.nsKey) !== n && dt(this.nsKey, n));
      return;
    }
    this.activeKey = d;
    for (const s in this.mapTabs) {
      const u = this.mapTabs[s];
      s === d ? (u.setAttribute("data-active", ""), u.setAttribute("aria-selected", "true")) : (u.removeAttribute("data-active"), u.setAttribute("aria-selected", "false"));
    }
    for (const s in this.mapPanels) {
      const u = this.mapPanels[s], w = s === d;
      u.classList.toggle("hidden", !w), u.setAttribute("aria-hidden", w ? "false" : "true");
    }
    if (this.autoFocus) {
      const s = (o = this.mapPanels[d]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      s && setTimeout(() => s.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: d,
      previousKey: n,
      tab: this.mapTabs[d],
      panel: this.mapPanels[d],
      target: this.dom
    });
  }, r.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: d, handler: n } of this._clickHandlers)
        d.removeEventListener("click", n), delete d[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, j(t, e, r, "ln-tabs", {
    attributes: m,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(d) {
        const n = Array.from(d.querySelectorAll("[data-ln-tab]")).map(function(s) {
          return { tagName: s.tagName, href: s.getAttribute("href") };
        }), o = (d.getAttribute("data-ln-tabs-key") || d.id || "").toLowerCase().trim();
        return Qe(n, o).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", a = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-toggle": { effect: u, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, h = /* @__PURE__ */ new Set();
  let r = null;
  function c(w, v) {
    return v === "open" ? "open" : v === "close" || w === "open" ? "close" : "open";
  }
  function d() {
    r || (r = function(w) {
      if (dn(w)) return;
      const v = w.target.closest("[" + i + "]");
      if (!v || un(v)) return;
      const E = v.getAttribute(i);
      if (!E) return;
      const S = document.getElementById(E);
      if (!S || !S[e]) return;
      w.preventDefault();
      const p = v.getAttribute(a) || "toggle", b = S.getAttribute(t);
      S.setAttribute(t, c(b, p));
    }, document.addEventListener("click", r));
  }
  function n() {
    h.size > 0 || !r || (document.removeEventListener("click", r), r = null);
  }
  function o(w, v) {
    if (!w || !w.id) return;
    const E = document.querySelectorAll(
      "[" + i + '="' + w.id + '"]'
    );
    for (let S = 0; S < E.length; S++)
      E[S].setAttribute("aria-expanded", v ? "true" : "false");
  }
  function s(w) {
    this.dom = w;
    const v = this;
    return this._onRequestOpen = function() {
      v.open();
    }, this._onRequestClose = function() {
      v.close();
    }, this._onRequestToggle = function() {
      v.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), o(w, this.isOpen), h.add(this), d(), this;
  }
  s.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, s.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, s.prototype.toggle = function() {
    const w = this.dom.getAttribute(t);
    this.dom.setAttribute(t, c(w, "toggle"));
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), h.delete(this), delete this.dom[e], n());
  };
  function u(w) {
    const v = w[e];
    if (!v) return;
    const S = w.getAttribute(t) === "open";
    if (S !== v.isOpen)
      if (S) {
        if (Z(w, "ln-toggle:before-open", { target: w }).defaultPrevented) {
          w.setAttribute(t, "close");
          return;
        }
        v.isOpen = !0, w.classList.add("open"), o(w, !0), L(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        v.isOpen = !1, w.classList.remove("open"), o(w, !1), L(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, s, "ln-toggle", {
    attributes: m,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function a(m) {
    return this.dom = m, this._onToggleOpen = function(h) {
      if (h.detail.target.closest("[data-ln-accordion]") !== m) return;
      const r = m.querySelectorAll("[data-ln-toggle]");
      for (const c of r)
        c !== h.detail.target && c.closest("[data-ln-accordion]") === m && c.getAttribute("data-ln-toggle") === "open" && c.setAttribute("data-ln-toggle", "close");
      L(m, "ln-accordion:change", { target: h.detail.target });
    }, m.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, j(t, e, a, "ln-accordion", {
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
  }, m = et(a);
  function h(r) {
    this.dom = r, tt(this, r, m), this.toggleEl = r.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = r.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const c = this;
    return this._onRequestOpen = function() {
      c.toggleEl && c.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      c.toggleEl && c.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (c.toggleEl) {
        const d = c.toggleEl.getAttribute("data-ln-toggle");
        c.toggleEl.setAttribute("data-ln-toggle", d === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(d) {
      const n = c.toggleEl && c.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (d.key === "Escape") {
        n && (d.preventDefault(), d.stopPropagation(), c.toggleEl.setAttribute("data-ln-toggle", "close"), c.triggerBtn && c.triggerBtn.focus());
        return;
      }
      if (d.key === "Tab") {
        n && (c.triggerBtn && c.triggerBtn.focus(), c.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const o = c._getMenuItems();
      if (o.length === 0) return;
      if (!n && (d.key === "ArrowDown" || d.key === "ArrowUp")) {
        d.preventDefault(), c.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const u = c._getMenuItems();
          u.length > 0 && c._focusItem(u, d.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const s = o.indexOf(document.activeElement);
      if (d.key === "ArrowDown") {
        d.preventDefault();
        const u = s < o.length - 1 ? s + 1 : 0;
        c._focusItem(o, u);
      } else if (d.key === "ArrowUp") {
        d.preventDefault();
        const u = s > 0 ? s - 1 : o.length - 1;
        c._focusItem(o, u);
      } else d.key === "Home" ? (d.preventDefault(), c._focusItem(o, 0)) : d.key === "End" && (d.preventDefault(), c._focusItem(o, o.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(d) {
      !d.detail || d.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "true"), typeof c.toggleEl.showPopover == "function" && c.toggleEl.showPopover(), c._initMenuAria(), c._reposition(), c._addOutsideClickListener(), c._addScrollRepositionListener(), c._addResizeCloseListener(), L(r, "ln-dropdown:open", { target: d.detail.target }));
    }, this._onToggleClose = function(d) {
      !d.detail || d.detail.target !== c.toggleEl || (c.triggerBtn && c.triggerBtn.setAttribute("aria-expanded", "false"), c._removeOutsideClickListener(), c._removeScrollRepositionListener(), c._removeResizeCloseListener(), c.toggleEl.style.top = "", c.toggleEl.style.left = "", c.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof c.toggleEl.hidePopover == "function" && c.toggleEl.matches(":popover-open") && c.toggleEl.hidePopover(), L(r, "ln-dropdown:close", { target: d.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  h.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const r = this.toggleEl.querySelectorAll("li");
    for (const d of r)
      d.setAttribute("role", "none");
    const c = this._getMenuItems();
    for (let d = 0; d < c.length; d++)
      c[d].setAttribute("role", "menuitem"), c[d].setAttribute("tabindex", d === 0 ? "0" : "-1");
  }, h.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, h.prototype._focusItem = function(r, c) {
    for (let d = 0; d < r.length; d++)
      r[d].setAttribute("tabindex", d === c ? "0" : "-1");
    r[c] && r[c].focus();
  }, h.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const r = this.triggerBtn.getBoundingClientRect(), c = ve(this.toggleEl), d = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, o = Zt(r, c, n, d);
    this.toggleEl.style.top = o.top + "px", this.toggleEl.style.left = o.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", o.placement);
  }, h.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const r = this;
    this._boundDocClick = function(c) {
      r.dom.contains(c.target) || r.toggleEl && r.toggleEl.contains(c.target) || r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0);
  }, h.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, h.prototype._addScrollRepositionListener = function() {
    const r = this;
    this._boundScrollReposition = function() {
      r._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, h.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, h.prototype._addResizeCloseListener = function() {
    const r = this;
    this._boundResizeClose = function() {
      r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, h.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), delete this.dom[e]);
  }, j(t, e, h, "ln-dropdown", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", a = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: s, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, h = [];
  let r = null;
  function c() {
    r || (r = function(u) {
      if (u.key !== "Escape" || h.length === 0) return;
      h[h.length - 1].close();
    }, document.addEventListener("keydown", r));
  }
  function d() {
    h.length > 0 || r && (document.removeEventListener("keydown", r), r = null);
  }
  function n(u) {
    this.dom = u, this.isOpen = u.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const w = this;
    return this._onRequestOpen = function(v) {
      const E = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.open(E);
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function(v) {
      const E = v.detail && v.detail.trigger ? v.detail.trigger : null;
      w.toggle(E);
    }, u.addEventListener("ln-popover:request-open", this._onRequestOpen), u.addEventListener("ln-popover:request-close", this._onRequestClose), u.addEventListener("ln-popover:request-toggle", this._onRequestToggle), u.hasAttribute("tabindex") || u.setAttribute("tabindex", "-1"), u.hasAttribute("role") || u.setAttribute("role", "dialog"), u.hasAttribute("popover") || u.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(u) {
    this.isOpen || (this.trigger = u || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(u) {
    this.isOpen ? this.close() : this.open(u);
  }, n.prototype._applyOpen = function(u) {
    this.isOpen = !0, u && (this.trigger = u), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const w = ve(this.dom);
    if (this.trigger) {
      const p = this.trigger.getBoundingClientRect(), b = this.dom.getAttribute(a) || "bottom", f = Zt(p, w, b, 8);
      this.dom.style.top = f.top + "px", this.dom.style.left = f.left + "px", this.dom.setAttribute("data-ln-popover-placement", f.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const v = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), E = Array.prototype.find.call(v, zt);
    E ? E.focus() : this.dom.focus();
    const S = this;
    this._boundDocClick = function(p) {
      S.dom.contains(p.target) || S.trigger && S.trigger.contains(p.target) || S.close();
    }, S._docClickTimeout = setTimeout(function() {
      S._docClickTimeout = null, document.addEventListener("click", S._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!S.trigger) return;
      const p = S.trigger.getBoundingClientRect(), b = ve(S.dom), f = S.dom.getAttribute(a) || "bottom", l = Zt(p, b, f, 8);
      S.dom.style.top = l.top + "px", S.dom.style.left = l.left + "px", S.dom.setAttribute("data-ln-popover-placement", l.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), h.push(this), c(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = h.indexOf(this);
    u !== -1 && h.splice(u, 1), d(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function o(u) {
    this.dom = u;
    const w = u.getAttribute(i);
    return u.setAttribute("aria-haspopup", "dialog"), u.setAttribute("aria-expanded", "false"), u.setAttribute("aria-controls", w), this._onClick = function(v) {
      if (v.ctrlKey || v.metaKey || v.button === 1) return;
      v.preventDefault();
      const E = document.getElementById(w);
      if (!E) return;
      E[e] && (E[e].trigger = u);
      const S = E.getAttribute(t);
      E.setAttribute(t, S === "open" ? "closed" : "open");
    }, u.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function s(u) {
    const w = u[e];
    if (!w) return;
    const E = u.getAttribute(t) === "open";
    if (E !== w.isOpen)
      if (E) {
        if (Z(u, "ln-popover:before-open", {
          popoverId: u.id,
          target: u,
          trigger: w.trigger
        }).defaultPrevented) {
          u.setAttribute(t, "closed");
          return;
        }
        w._applyOpen(w.trigger);
      } else {
        if (Z(u, "ln-popover:before-close", {
          popoverId: u.id,
          target: u,
          trigger: w.trigger
        }).defaultPrevented) {
          u.setAttribute(t, "open");
          return;
        }
        w._applyClose();
      }
  }
  j(t, e, n, "ln-popover", {
    attributes: m
  }), j(i, e + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", a = "lnTooltipEnhance", m = "ln-tooltip-portal";
  if (window[a] !== void 0) return;
  const h = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let r = 0, c = null, d = null, n = null, o = null, s = null, u = null;
  function w() {
    return c && c.parentNode || (c = document.getElementById(m), c || (c = document.createElement("div"), c.id = m, document.body.appendChild(c)), c.hasAttribute("popover") || c.setAttribute("popover", "manual")), c;
  }
  function v() {
    u || (u = function(f) {
      f.key === "Escape" && p();
    }, document.addEventListener("keydown", u));
  }
  function E() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function S(f) {
    if (n === f) return;
    p();
    const l = f.getAttribute(e) || f.getAttribute("title");
    if (!l) return;
    w(), typeof c.showPopover == "function" && c.showPopover(), f.hasAttribute("title") && (o = f.getAttribute("title"), f.removeAttribute("title"));
    const g = f.getAttribute("aria-describedby");
    g ? s = g : s = null;
    const y = document.createElement("div");
    y.className = "ln-tooltip", y.textContent = l, f[a + "Uid"] || (r += 1, f[a + "Uid"] = "ln-tooltip-" + r), y.id = f[a + "Uid"], c.appendChild(y);
    const T = y.offsetWidth, _ = y.offsetHeight, A = f.getBoundingClientRect(), C = f.getAttribute(i) || "top", q = Zt(A, { width: T, height: _ }, C, 6);
    y.style.top = q.top + "px", y.style.left = q.left + "px", y.setAttribute("data-ln-tooltip-placement", q.placement), s ? f.setAttribute("aria-describedby", s + " " + y.id) : f.setAttribute("aria-describedby", y.id), d = y, n = f, v();
  }
  function p() {
    if (!d) {
      E();
      return;
    }
    n && (s !== null ? n.setAttribute("aria-describedby", s) : n.removeAttribute("aria-describedby"), s = null, o !== null && n.setAttribute("title", o)), o = null, d.parentNode && d.parentNode.removeChild(d), d = null, n = null, c && typeof c.hidePopover == "function" && c.matches(":popover-open") && c.hidePopover(), E();
  }
  function b(f) {
    return this.dom = f, f.hasAttribute("data-ln-tooltip-enhanced") || (f.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      S(f);
    }, this._onLeave = function() {
      n === f && !f.contains(document.activeElement) && p();
    }, this._onFocus = function() {
      S(f);
    }, this._onBlur = function() {
      n === f && !f.matches(":hover") && p();
    }, f.addEventListener("mouseenter", this._onEnter), f.addEventListener("mouseleave", this._onLeave), f.addEventListener("focus", this._onFocus, !0), f.addEventListener("blur", this._onBlur, !0), this;
  }
  b.prototype.destroy = function() {
    const f = this.dom;
    f.removeEventListener("mouseenter", this._onEnter), f.removeEventListener("mouseleave", this._onLeave), f.removeEventListener("focus", this._onFocus, !0), f.removeEventListener("blur", this._onBlur, !0), n === f && p(), this._addedEnhancedAttr && f.removeAttribute("data-ln-tooltip-enhanced"), delete f[a], delete f[a + "Uid"];
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    a,
    b,
    "ln-tooltip",
    {
      attributes: h
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: xt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: xt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, m = et(a);
  function h(S) {
    if (!(!S || !(S instanceof HTMLElement)) && (S.hasAttribute("popover") || S.setAttribute("popover", "manual"), typeof S.showPopover == "function")) {
      if (S.matches(":popover-open"))
        try {
          S.hidePopover();
        } catch {
        }
      try {
        S.showPopover();
      } catch {
      }
    }
  }
  function r(S) {
    if (!S || !(S instanceof HTMLElement)) return;
    if (S.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof S.hidePopover == "function" && S.matches(":popover-open"))
      try {
        S.hidePopover();
      } catch {
      }
  }
  function c(S) {
    this.dom = S, tt(this, S, m);
    const p = Array.from(S.querySelectorAll("[data-ln-toast-item]"));
    for (; p.length > this.max; ) S.removeChild(p.shift());
    for (const b of p) w(b, this);
    return p.length > 0 && h(S), this;
  }
  c.prototype.enqueue = function(S) {
    if (!S) return;
    const p = d(S, this.dom);
    if (!p) return;
    const b = Number.isFinite(S.timeout) ? S.timeout : this.timeoutDefault;
    o(this, p), b > 0 && (p._timer = setTimeout(() => s(p), b));
  }, c.prototype.clear = function() {
    for (const S of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      s(S);
  }, c.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const S of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        s(S);
      r(this.dom), delete this.dom[e];
    }
  };
  function d(S, p) {
    const b = ((S.type || "") + "").trim().toLowerCase(), f = Ct(p, i, "ln-toast");
    if (!f)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    pt(f, {
      type: b,
      title: S.title,
      message: typeof S.message == "string" ? S.message : void 0
    });
    const l = f.firstElementChild;
    if (!l) return null;
    l.hasAttribute("data-ln-toast-item") || l.setAttribute("data-ln-toast-item", ""), l.classList.add("ln-enter");
    const g = l.querySelector(".body");
    g && n(g, S);
    const y = l.querySelector("[data-ln-toast-close]");
    return y && y.addEventListener("click", function() {
      s(l);
    }), l;
  }
  function n(S, p) {
    if (Array.isArray(p.message)) {
      const b = document.createElement("ul");
      for (const f of p.message) {
        const l = document.createElement("li");
        l.textContent = f, b.appendChild(l);
      }
      S.appendChild(b);
    }
    if (p.data && p.data.errors) {
      const b = document.createElement("ul");
      for (const f of Object.values(p.data.errors).flat()) {
        const l = document.createElement("li");
        l.textContent = f, b.appendChild(l);
      }
      S.appendChild(b);
    }
  }
  function o(S, p) {
    const b = Array.from(S.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; b.length >= S.max && b.length > 0; ) S.dom.removeChild(b.shift());
    S.dom.appendChild(p), h(S.dom), requestAnimationFrame(() => p.classList.remove("ln-enter"));
  }
  function s(S) {
    if (!S || !S.parentNode) return;
    const p = S.parentNode;
    clearTimeout(S._timer), S.classList.remove("ln-enter"), S.classList.add("ln-out"), setTimeout(() => {
      S.parentNode && (S.parentNode.removeChild(S), r(p));
    }, 200);
  }
  function u(S) {
    let p = S && S.container;
    return typeof p == "string" && (p = document.querySelector(p)), p instanceof HTMLElement || (p = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), p || null;
  }
  function w(S, p) {
    if (S._lnToastHydrated) return;
    S._lnToastHydrated = !0;
    const b = S.querySelector("[data-ln-toast-close]");
    b && b.addEventListener("click", function() {
      s(S);
    });
    const f = +(S.getAttribute("data-ln-toast-timeout") ?? p.timeoutDefault);
    f > 0 && (S._timer = setTimeout(function() {
      s(S);
    }, f));
  }
  function v(S) {
    const p = S.detail || {}, b = u(p);
    if (!b) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (b[e] || (b[e] = new c(b))).enqueue(p);
  }
  function E(S) {
    const p = S && S.detail || {};
    if (p.container) {
      const b = u(p);
      b && (b[e] || (b[e] = new c(b))).clear();
    } else {
      const b = document.querySelectorAll("[" + t + "]");
      for (const f of Array.from(b))
        (f[e] || (f[e] = new c(f))).clear();
    }
  }
  gt(function() {
    window.addEventListener("ln-toast:enqueue", v), window.addEventListener("ln-toast:clear", E), window.addEventListener("ln-modal:open", function() {
      const S = document.querySelectorAll("[" + t + "]");
      for (const p of Array.from(S))
        p.querySelectorAll("[data-ln-toast-item]").length > 0 && h(p);
    });
  }, "ln-toast"), j(t, e, c, "ln-toast", {
    attributes: a
  });
})();
function or(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function $n(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function sr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = $n(t.name), a = String(t.type || "").toLowerCase();
  return e.some((m) => {
    if (m.includes("/")) {
      if (m.endsWith("/*")) {
        const h = m.slice(0, -1);
        return a.startsWith(h);
      }
      return a === m;
    }
    return i === m;
  });
}
function ar(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const a = 1024, m = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], h = Math.floor(Math.log(t) / Math.log(a)), r = Math.min(h, m.length - 1), c = t / Math.pow(a, r);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(c) + " " + m[r];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", a = "file_ids[]";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-upload": { prop: "uploadUrl", read: $, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: $, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: $, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: $, type: "string", fallback: a, description: "Form field name for submitting uploaded file IDs" },
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
  }, h = et(m);
  function r(n, o, s) {
    return ar(n, o, s);
  }
  function c() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function d(n) {
    this.dom = n, tt(this, n, h), this.dict = re(n, "data-ln-upload-dict"), this.locale = it(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const o = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = or(o), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  d.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const o = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < o.length; u++) {
      const w = o[u], v = w.getAttribute("data-ln-upload-id"), E = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", E);
      const S = w.querySelector('[data-ln-field="name"]'), p = w.querySelector('[data-ln-field="sizeText"]'), b = w.getAttribute("data-ln-upload-size"), f = b ? parseInt(b, 10) : null;
      n.uploadedFiles.set(E, {
        serverId: v || null,
        name: S ? S.textContent.trim() : "",
        size: f !== null && !isNaN(f) ? f : p ? p.textContent.trim() : ""
      });
    }
    const s = this.dom.querySelectorAll('input[type="hidden"]');
    for (let u = 0; u < s.length; u++) {
      const w = s[u];
      if (w.name === n.idsFieldName && w.value && !Array.from(n.uploadedFiles.values()).some(function(E) {
        return String(E.serverId) === String(w.value);
      })) {
        const E = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(E, {
          serverId: w.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, d.prototype._syncHiddenInputs = function() {
    const n = this, o = this.dom.querySelectorAll('input[type="hidden"]');
    for (let s = 0; s < o.length; s++)
      o[s].name === n.idsFieldName && o[s].remove();
    for (const [, s] of this.uploadedFiles)
      if (s.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = n.idsFieldName, u.value = s.serverId, n.dom.appendChild(u);
      }
  }, d.prototype._bindEvents = function() {
    const n = this;
    this._onZoneClick = function(o) {
      n.zone === n.dom && o.target.closest("[data-ln-upload-list], [data-ln-upload-action], input, button, a") || n.input && o.target !== n.input && n.input.click();
    }, this._onInputChange = function() {
      n.input && n.input.files && (n.upload(n.input.files), n.input.value = "");
    }, this._onDragEnter = function(o) {
      o.preventDefault(), o.stopPropagation(), n._dragDepth++, n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragOver = function(o) {
      o.preventDefault(), o.stopPropagation(), n.zone.setAttribute("data-ln-upload-state", "dragover");
    }, this._onDragLeave = function(o) {
      o.preventDefault(), o.stopPropagation(), n._dragDepth--, n._dragDepth <= 0 && (n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"));
    }, this._onDrop = function(o) {
      o.preventDefault(), o.stopPropagation(), n._dragDepth = 0, n.zone.removeAttribute("data-ln-upload-state"), o.dataTransfer && o.dataTransfer.files && n.upload(o.dataTransfer.files);
    }, this._onListClick = function(o) {
      const s = o.target.closest('[data-ln-upload-action="remove"]');
      if (!s || !n.list || !n.list.contains(s) || s.disabled) return;
      const u = s.closest("[data-ln-upload-item]");
      if (u) {
        const w = u.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(o) {
      o.detail && o.detail.files && n.upload(o.detail.files);
    }, this._onRequestRemove = function(o) {
      if (o.detail) {
        const s = o.detail.localId !== void 0 ? o.detail.localId : o.detail.serverId;
        s !== void 0 && n.remove(s);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, d.prototype.upload = function(n) {
    const o = this, s = Array.from(n);
    for (let u = 0; u < s.length; u++) {
      const w = s[u];
      if (o.maxFiles > 0 && o.uploadedFiles.size >= o.maxFiles) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!sr(w, o.allowedExts)) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "accept"
        });
        continue;
      }
      if (o.maxSize > 0 && w.size > o.maxSize) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-size"
        });
        continue;
      }
      Z(o.dom, "ln-upload:before-upload", { file: w }).defaultPrevented || o._uploadSingleFile(w);
    }
  }, d.prototype._uploadSingleFile = function(n) {
    const o = this, s = "file-" + ++o.fileIdCounter, u = $n(n.name);
    let w = null;
    if (this.list) {
      const b = Ct(this.dom, "ln-upload-item", "ln-upload");
      if (b && (w = b.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", s), w.setAttribute("data-ln-upload-ext", u), w.setAttribute("data-ln-upload-state", "uploading"), pt(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: o.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const f = w.querySelector('[data-ln-upload-action="remove"]');
        f && (f.disabled = !0);
        const l = w.querySelector("[data-ln-progress]");
        l && l.setAttribute("data-ln-progress", "0"), o.list.appendChild(w);
      }
    }
    const v = new FormData();
    v.append(o.fileFieldName, n);
    const E = this.dom.querySelectorAll("input, select, textarea");
    for (let b = 0; b < E.length; b++) {
      const f = E[b];
      !f.name || f.name === o.idsFieldName || f.type === "file" || (f.type === "checkbox" || f.type === "radio") && !f.checked || v.append(f.name, f.value);
    }
    const S = new XMLHttpRequest();
    o.uploadedFiles.set(s, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: S
    }), S.upload.addEventListener("progress", function(b) {
      if (b.lengthComputable) {
        const f = Math.round(b.loaded / b.total * 100);
        if (w) {
          const l = w.querySelector("[data-ln-progress]");
          l && l.setAttribute("data-ln-progress", String(f)), pt(w, { sizeText: f + "%" });
        }
        L(o.dom, "ln-upload:progress", {
          localId: s,
          file: n,
          percent: f,
          loaded: b.loaded,
          total: b.total
        });
      }
    }), S.addEventListener("load", function() {
      const b = o.uploadedFiles.get(s);
      if (b && delete b.xhr, S.status >= 200 && S.status < 300) {
        let f;
        try {
          f = JSON.parse(S.responseText);
        } catch (g) {
          p(o.dict.error || "Error", S.status, g);
          return;
        }
        const l = f.id || f.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), l && w.setAttribute("data-ln-upload-id", String(l)), pt(w, {
            sizeText: r(f.size || n.size, o.locale, o.dict),
            uploading: !1
          });
          const g = w.querySelector('[data-ln-upload-action="remove"]');
          g && (g.disabled = !1);
        }
        b && (b.serverId = l, b.size = f.size || n.size, b.name = f.name || n.name), o._syncHiddenInputs(), L(o.dom, "ln-upload:uploaded", {
          localId: s,
          serverId: l,
          name: f.name || n.name,
          size: f.size || n.size,
          response: f
        });
      } else {
        let f = "";
        try {
          f = JSON.parse(S.responseText).message || "";
        } catch {
        }
        p(f, S.status, null);
      }
    }), S.addEventListener("error", function() {
      const b = o.uploadedFiles.get(s);
      b && delete b.xhr, p("", 0, null);
    });
    function p(b, f, l) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), pt(w, {
          sizeText: o.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const g = w.querySelector('[data-ln-upload-action="remove"]');
        g && (g.disabled = !1);
      }
      L(o.dom, "ln-upload:error", {
        file: n,
        message: b,
        status: f,
        error: l
      });
    }
    o.uploadUrl ? (S.open("POST", o.uploadUrl), S.setRequestHeader("X-CSRF-TOKEN", c()), S.setRequestHeader("X-Requested-With", "XMLHttpRequest"), S.setRequestHeader("Accept", "application/json"), S.send(v)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, d.prototype.remove = function(n) {
    const o = this;
    let s = null, u = null;
    if (o.uploadedFiles.has(n))
      s = n, u = o.uploadedFiles.get(n);
    else
      for (const [S, p] of o.uploadedFiles)
        if (String(p.serverId) === String(n)) {
          s = S, u = p;
          break;
        }
    if (!s || !u || Z(o.dom, "ln-upload:before-remove", {
      localId: s,
      serverId: u.serverId
    }).defaultPrevented) return;
    const v = o.list ? o.list.querySelector('[data-ln-upload-local-id="' + s + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      v && v.remove(), o.uploadedFiles.delete(s), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: s, serverId: null });
      return;
    }
    let E = null;
    if (o.deleteUrlPattern ? E = o.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : o.uploadUrl && o.uploadUrl.includes("{id}") && (E = o.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !E) {
      v && v.remove(), o.uploadedFiles.delete(s), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: s, serverId: u.serverId });
      return;
    }
    v && (v.setAttribute("data-ln-upload-state", "deleting"), pt(v, { deleting: !0 })), fetch(E, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": c(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(S) {
      S.ok ? (v && v.remove(), o.uploadedFiles.delete(s), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", {
        localId: s,
        serverId: u.serverId
      })) : (v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: S.status
      }));
    }).catch(function(S) {
      v && (v.removeAttribute("data-ln-upload-state"), pt(v, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: 0,
        error: S
      });
    });
  }, d.prototype.clear = function() {
    const n = this;
    if (!Z(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, s] of this.uploadedFiles)
        if (s.xhr && typeof s.xhr.abort == "function" && s.xhr.abort(), s.serverId) {
          let u = null;
          n.deleteUrlPattern ? u = n.deleteUrlPattern.replace("{id}", encodeURIComponent(s.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (u = n.uploadUrl.replace("{id}", encodeURIComponent(s.serverId))), u && fetch(u, {
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
  }, d.prototype.getFileIds = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return n.serverId;
    }).filter(Boolean);
  }, d.prototype.getFiles = function() {
    return Array.from(this.uploadedFiles.values()).map(function(n) {
      return {
        serverId: n.serverId,
        name: n.name,
        size: n.size
      };
    });
  }, d.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const [, n] of this.uploadedFiles)
        n.xhr && typeof n.xhr.abort == "function" && n.xhr.abort();
      this.zone.removeEventListener("click", this._onZoneClick), this.input && this.input.removeEventListener("change", this._onInputChange), this.zone.removeEventListener("dragenter", this._onDragEnter), this.zone.removeEventListener("dragover", this._onDragOver), this.zone.removeEventListener("dragleave", this._onDragLeave), this.zone.removeEventListener("drop", this._onDrop), this.list && this.list.removeEventListener("click", this._onListClick), this.dom.removeEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.removeEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.removeEventListener("ln-upload:request-clear", this._onRequestClear), this.uploadedFiles.clear(), this.dict = {}, delete this.dom[e];
    }
  }, j(t, e, d, "ln-upload", {
    attributes: m
  });
})();
function Qn(t, e) {
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
function Xn(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let a = "";
    const m = i.length;
    for (let h = 0; h < m; h++)
      a += String.fromCharCode(i[h]);
    return btoa(a);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function Yn(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), a = new Uint8Array(i.length);
      for (let m = 0; m < i.length; m++)
        a[m] = i.charCodeAt(m);
      return new TextDecoder().decode(a);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function Jn(t, e) {
  const i = String(e || "ln-ashlar");
  let a;
  typeof TextEncoder < "u" ? a = new TextEncoder().encode(i) : typeof Buffer < "u" ? a = Buffer.from(i, "utf-8") : a = [108, 110];
  const m = a.length || 1, h = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    h[r] = t[r] ^ a[r % m];
  return h;
}
function Zn(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let a;
  if (typeof TextEncoder < "u")
    a = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    a = Buffer.from(i, "utf-8");
  else
    return "";
  const m = Jn(a, e);
  let h = "";
  for (let r = 0; r < m.length; r++)
    h += String.fromCharCode(m[r]);
  return typeof btoa < "u" ? btoa(h) : typeof Buffer < "u" ? Buffer.from(m).toString("base64") : "";
}
function ti(t, e = "ln-ashlar") {
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
    const m = new Uint8Array(a.length);
    for (let r = 0; r < a.length; r++)
      m[r] = a.charCodeAt(r);
    const h = Jn(m, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(h);
    if (typeof Buffer < "u")
      return Buffer.from(h).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function ei(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", a = Number(t.shift) || 13, m = t.key || "ln-ashlar";
    return { codec: i, shift: a, key: m };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function lr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ei(e);
  return i.codec === "base64" ? Xn(t) : i.codec === "xor" ? Zn(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (a) => Qn(a, i.shift));
}
function ge(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ei(e);
  return i.codec === "base64" ? Yn(t) : i.codec === "xor" ? ti(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (a) => Qn(a, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(r) {
    const c = r[e];
    c && c.deobfuscate();
  }
  const a = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function m(r) {
    return r[e] ? r[e] : (r[e] = this, this.dom = r, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  m.prototype.deobfuscate = function() {
    const r = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && r && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((S) => !this.dom.contains(S.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const S = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(p) {
          return p.parentElement && p.parentElement.classList && p.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; S.nextNode(); )
        this._originalTextNodes.push({
          node: S.currentNode,
          raw: S.currentNode.nodeValue
        });
    }
    const d = this.dom.getAttribute(t), n = parseInt(d, 10), o = isNaN(n) ? 13 : n, s = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), u = this.dom.getAttribute("data-ln-obfuscator-key");
    let w = "rot";
    s === "xor" || s === "base64" ? w = s : u && (w = "xor");
    const v = u || "ln-ashlar", E = { codec: w, shift: o, key: v };
    if (r && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const S = this.dom.querySelectorAll(".sr-only");
      for (let b = 0; b < S.length; b++)
        S[b].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const p = (this.dom.rel || "").split(/\s+/).filter(function(b) {
        return b && b !== "noopener" && b !== "noreferrer";
      });
      p.length > 0 ? this.dom.rel = p.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let S = 0; S < this._originalTextNodes.length; S++) {
        const p = this._originalTextNodes[S];
        p.node && p.raw && p.raw.length > 0 && (p.node.nodeValue = ge(p.raw, E));
      }
    if (r && this._originalHref) {
      const S = ge(this._originalHref, E);
      this.dom.setAttribute("href", S);
    }
    L(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: w,
      shift: o,
      key: w === "xor" ? v : null
    });
  }, m.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let r = 0; r < this._originalTextNodes.length; r++) {
          const c = this._originalTextNodes[r];
          c.node && c.raw && (c.node.nodeValue = c.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const h = j(t, e, m, "ln-obfuscator", {
    attributes: a
  });
  h.obfuscate = lr, h.deobfuscate = ge, h.utf8ToBase64 = Xn, h.base64ToUtf8 = Yn, h.xorObfuscate = Zn, h.xorDeobfuscate = ti;
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
    const d = (c.rel || "").split(/\s+/).filter(Boolean);
    d.includes("noopener") || d.push("noopener"), d.includes("noreferrer") || d.push("noreferrer"), c.rel = d.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", c.appendChild(n), c.setAttribute("data-ln-external-link", "processed"), L(c, "ln-external-links:processed", {
      link: c,
      href: c.href
    });
  }
  function a(c) {
    c = c || document.body;
    for (const d of c.querySelectorAll("a, area"))
      i(d);
  }
  function m() {
    gt(function() {
      document.body.addEventListener("click", function(c) {
        const d = c.target.closest("a, area");
        d && d.getAttribute("data-ln-external-link") === "processed" && L(d, "ln-external-links:clicked", {
          link: d,
          href: d.href,
          text: d.textContent || d.title || ""
        });
      });
    }, "ln-external-links");
  }
  function h() {
    gt(function() {
      new MutationObserver(function(d) {
        for (const n of d)
          if (n.type === "childList") {
            for (const o of n.addedNodes)
              if (o.nodeType === 1 && (o.matches && (o.matches("a") || o.matches("area")) && i(o), o.querySelectorAll))
                for (const s of o.querySelectorAll("a, area"))
                  i(s);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Wt(["href"], function(d) {
        d.matches && (d.matches("a") || d.matches("area")) && i(d);
      });
    }, "ln-external-links");
  }
  function r() {
    m(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      a();
    }) : a();
  }
  window[t] = {
    process: a
  }, r();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function a() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function m(p) {
    i && (i.textContent = p, i.classList.add("ln-link-status--visible"));
  }
  function h() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function r(p, b) {
    if (b.target.closest("a, button, input, select, textarea")) return;
    const f = p.querySelector("a");
    if (!f) return;
    const l = f.getAttribute("href");
    if (!l) return;
    if (b.ctrlKey || b.metaKey || b.button === 1) {
      window.open(l, "_blank", "noopener,noreferrer");
      return;
    }
    Z(p, "ln-link:navigate", { target: p, href: l, link: f }).defaultPrevented || f.click();
  }
  function c(p) {
    const b = p.querySelector("a");
    if (!b) return;
    const f = b.getAttribute("href");
    f && m(f);
  }
  function d() {
    h();
  }
  function n(p) {
    p[e + "Row"] || !p.querySelector("a") || (p[e + "Row"] = !0, p._lnLinkClick = function(f) {
      r(p, f);
    }, p._lnLinkEnter = function() {
      c(p);
    }, p.addEventListener("click", p._lnLinkClick), p.addEventListener("mouseenter", p._lnLinkEnter), p.addEventListener("mouseleave", d));
  }
  function o(p) {
    p[e + "Row"] && (p._lnLinkClick && p.removeEventListener("click", p._lnLinkClick), p._lnLinkEnter && p.removeEventListener("mouseenter", p._lnLinkEnter), p.removeEventListener("mouseleave", d), delete p._lnLinkClick, delete p._lnLinkEnter, delete p[e + "Row"]);
  }
  function s(p) {
    if (!p[e + "Init"]) return;
    const b = p.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const f = b === "TABLE" && p.querySelector("tbody") || p;
      for (const l of f.querySelectorAll("tr"))
        o(l);
    } else
      o(p);
    delete p[e + "Init"];
  }
  function u(p) {
    if (p[e + "Init"]) return;
    p[e + "Init"] = !0;
    const b = p.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const f = b === "TABLE" && p.querySelector("tbody") || p;
      for (const l of f.querySelectorAll("tr"))
        n(l);
    } else
      n(p);
  }
  function w(p) {
    p.hasAttribute && p.hasAttribute(t) && u(p);
    const b = p.querySelectorAll ? p.querySelectorAll("[" + t + "]") : [];
    for (const f of b)
      u(f);
  }
  function v() {
    gt(function() {
      new MutationObserver(function(b) {
        for (const f of b)
          if (f.type === "childList") {
            for (const l of f.addedNodes)
              if (l.nodeType === 1) {
                w(l);
                const g = l.closest("[" + t + "]");
                if (g)
                  if (l.tagName === "TR")
                    n(l);
                  else {
                    const y = g.tagName;
                    if (y === "TABLE" || y === "TBODY") {
                      const T = l.querySelectorAll ? l.querySelectorAll("tr") : [];
                      for (const _ of T)
                        n(_);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Wt([t], function(b) {
        b.hasAttribute && b.hasAttribute(t) ? w(b) : s(b);
      });
    }, "ln-link");
  }
  function E(p) {
    w(p);
  }
  window[e] = { init: E, destroy: s };
  function S() {
    a(), v(), E(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", S) : S();
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
  function a(m) {
    if (m[e]) return m[e];
    if (!(!m || m.tagName !== "A" && m.tagName !== "BUTTON"))
      return m[e] = this, this.dom = m, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  a.prototype._handleClick = function(m) {
    if (this.dom.tagName === "A" && (m.ctrlKey || m.metaKey || m.shiftKey || m.altKey || m.button !== 0))
      return;
    let h = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (h || (h = (this.dom.getAttribute("href") || "").trim()), !h || h === "#")
      return;
    !h.startsWith("#") && !h.startsWith(".") && !h.startsWith("[") && (h = "#" + h);
    let r = null;
    try {
      r = document.querySelector(h);
    } catch {
      const v = h.replace(/^#/, "");
      r = document.getElementById(v);
    }
    if (!r) return;
    m.preventDefault();
    const c = this.dom.getAttribute("data-ln-scroll-set");
    if (c) {
      const w = c.indexOf(":");
      if (w !== -1) {
        const v = c.slice(0, w).trim(), E = c.slice(w + 1).trim();
        try {
          const S = document.querySelector(v);
          S && (S.value = E, S.dispatchEvent(new Event("input", { bubbles: !0 })), S.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if (Z(this.dom, "ln-scroll:before-scroll", {
      target: r,
      link: this.dom,
      href: h
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", o = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (r.scrollIntoView({ behavior: n, block: o }), It(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", h);
      } catch {
      }
    const u = this.dom.getAttribute("data-ln-scroll-focus");
    if (u !== "false" && u !== "0") {
      const w = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), v = isNaN(w) ? 450 : w;
      window.setTimeout(function() {
        let E = null;
        if (u && u !== "true" && u !== "1")
          try {
            E = document.querySelector(u);
          } catch {
          }
        E || (E = r.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !E && r.getAttribute("tabindex") !== null && (E = r), E && typeof E.focus == "function" && E.focus({ preventScroll: !0 });
      }, v);
    }
    L(this.dom, "ln-scroll:scrolled", {
      target: r,
      link: this.dom,
      href: h
    });
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, j(t, e, a, "ln-scroll", {
    attributes: i
  });
})();
const Ht = ["Ctrl", "Alt", "Shift", "Meta"], cr = {
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
function ni(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = cr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function ii(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), a = /* @__PURE__ */ new Set();
  let m = "";
  for (let r = 0; r < i.length; r++) {
    const c = ni(i[r]);
    if (!c) return "";
    if (Ht.indexOf(c) !== -1) {
      a.add(c);
      continue;
    }
    if (m) return "";
    m = c;
  }
  if (!m) return "";
  const h = [];
  for (let r = 0; r < Ht.length; r++)
    a.has(Ht[r]) && h.push(Ht[r]);
  return h.push(m), h.join("+");
}
function dr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), a = [];
  for (let m = 0; m < i.length; m++) {
    const h = ii(i[m]);
    h && a.indexOf(h) === -1 && a.push(h);
  }
  return a;
}
function ur(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const a = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(a) ? "" : ii(a ? a + "+" + i : i);
}
function fr(t) {
  if (!t) return "";
  const e = ni(t.key);
  if (!e || Ht.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function hr(t) {
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
function pr(t, e, i, a) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const m = String(e.tagName || "").toLowerCase();
  return m === "button" ? a === "Enter" || a === "Space" : m === "a" && e.hasAttribute && e.hasAttribute("href") && a === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", a = "data-ln-key-allow-input", m = "data-ln-key-modifier", h = "data-ln-key-for", r = "lnKeyFor";
  if (window[e] !== void 0) return;
  function c(b) {
    const f = b[e];
    if (f) {
      if (!b.hasAttribute(t)) {
        f.destroy();
        return;
      }
      f.sync();
    }
  }
  function d(b) {
    const f = b[r];
    f && !b.hasAttribute(h) && f.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: c, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: c, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: c, description: "Permits shortcut execution even when focused inside an editable input" }
  }, o = {
    "data-ln-key-for": { type: "string", effect: d, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, s = /* @__PURE__ */ new Set();
  let u = null;
  function w() {
    u || (u = function(b) {
      if (b.defaultPrevented || b.isComposing || b.repeat) return;
      const f = fr(b);
      if (!f) return;
      const l = wi(b.target), g = document.querySelectorAll("[" + t + "], [" + h + "]");
      let y = null, T = !1, _ = !1;
      for (let q = 0; q < g.length; q++) {
        const D = g[q], I = D[e] || D[r];
        if (!I || !I.matches(f) || l && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = hr(R);
        if (!(!O || !Ei(R, O))) {
          if (pr(b, R, O, f)) {
            _ = !0;
            continue;
          }
          y ? T = !0 : y = { host: D, target: R, action: O };
        }
      }
      if (_ || !y) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + f + '"; first DOM match wins.');
      const A = {
        source: y.host,
        target: y.target,
        action: y.action,
        key: f,
        event: b
      };
      Z(y.host, "ln-key:before-trigger", A).defaultPrevented || (b.preventDefault(), y.target[y.action](), L(y.host, "ln-key:trigger", A));
    }, document.addEventListener("keydown", u));
  }
  function v() {
    s.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function E(b) {
    return this.dom = b, this.shortcuts = [], s.add(this), this.sync(), w(), this;
  }
  E.prototype.sync = function() {
    this.shortcuts = dr(this.dom.getAttribute(t));
  }, E.prototype.matches = function(b) {
    return this.shortcuts.indexOf(b) !== -1;
  }, E.prototype.allowsInput = function() {
    return this.dom.hasAttribute(a);
  }, E.prototype.resolveTarget = function() {
    const b = this.dom.getAttribute(i);
    return b ? p(b, i) : this.dom;
  }, E.prototype.destroy = function() {
    this.dom[e] && (s.delete(this), delete this.dom[e], v());
  };
  function S(b) {
    return this.dom = b, s.add(this), w(), this;
  }
  S.prototype._modifierContext = function() {
    return this.dom.closest("[" + m + "]");
  }, S.prototype.shortcut = function() {
    const b = this._modifierContext(), f = b ? b.getAttribute(m) : "";
    return ur(f, this.dom.textContent);
  }, S.prototype.matches = function(b) {
    return this.shortcut() === b;
  }, S.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(a)) return !0;
    const b = this._modifierContext();
    return !!(b && b.hasAttribute(a));
  }, S.prototype.resolveTarget = function() {
    return p(this.dom.getAttribute(h), h);
  }, S.prototype.destroy = function() {
    this.dom[r] && (s.delete(this), delete this.dom[r], v());
  };
  function p(b, f) {
    if (!b) return null;
    try {
      const l = document.querySelector(b);
      return l || console.warn("[ln-key] Target not found for " + f + ' selector "' + b + '".'), l;
    } catch {
      return console.warn("[ln-key] Invalid " + f + ' selector "' + b + '".'), null;
    }
  }
  j(t, e, E, "ln-key", {
    attributes: n
  }), j(h, r, S, "ln-key-for", {
    attributes: o
  });
})();
function mr(t, e, i = 100) {
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
  function i(c) {
    const d = c[e];
    d && r.call(d);
  }
  const a = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function m(c) {
    return this.dom = c, this._parentObserver = null, r.call(this), h.call(this), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function h() {
    const c = this, d = this.dom.parentElement;
    if (!d) return;
    const n = new MutationObserver(function(o) {
      for (const s of o)
        s.attributeName === "data-ln-progress-max" && r.call(c);
    });
    n.observe(d, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function r() {
    const c = this.dom.getAttribute("data-ln-progress"), d = this.dom.parentElement, n = d ? d.getAttribute("data-ln-progress-max") : null, o = this.dom.getAttribute("data-ln-progress-max"), s = mr(o, n, 100), u = Dn(c, s);
    this.dom.style.width = u.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(u.min)), this.dom.setAttribute("aria-valuemax", String(u.max)), this.dom.setAttribute("aria-valuenow", String(u.clampedValue)), L(this.dom, "ln-progress:change", {
      target: this.dom,
      value: u.value,
      max: u.max,
      percentage: u.percentage
    });
  }
  j(
    t,
    e,
    m,
    "ln-progress",
    {
      attributes: a
    }
  );
})();
function gr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function _r(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const a = Object.keys(e);
  if (a.length === 0) return !0;
  for (let m = 0; m < a.length; m++) {
    const h = e[a[m]];
    let r = "";
    if (h.col !== null && h.col !== void 0 ? r = t[h.col] || "" : h.attr && i && typeof i.getAttribute == "function" && (r = i.getAttribute(h.attr) || ""), !De(r, h.values))
      return !1;
  }
  return !0;
}
function Ye(t, e, i, a) {
  if (a != null && !isNaN(a))
    return parseInt(a, 10);
  if (e && typeof e.getAttribute == "function") {
    const m = e.getAttribute("data-ln-filter-col");
    if (m !== null && !isNaN(parseInt(m, 10)))
      return parseInt(m, 10);
    if (typeof e.closest == "function") {
      const h = e.closest("th");
      if (h && typeof h.cellIndex == "number")
        return h.cellIndex;
      const r = e.closest("[data-ln-popover], [id]");
      if (r && r.id) {
        const c = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (c && typeof c.querySelector == "function") {
          const d = c.querySelector('[data-ln-popover-for="' + r.id + '"]');
          if (d && typeof d.closest == "function") {
            const n = d.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && i && typeof t.querySelectorAll == "function") {
    const m = t.querySelectorAll("thead th, tr:first-child th"), h = String(i).trim().toLowerCase();
    for (let r = 0; r < m.length; r++) {
      const c = m[r], d = c.getAttribute("data-ln-table-filter-col") || c.getAttribute("data-ln-filter-col") || c.getAttribute("data-ln-filter-key") || c.getAttribute("data-ln-table-col") || c.getAttribute("data-ln-col") || c.getAttribute("data-ln-field");
      if (d && d.trim().toLowerCase() === h)
        return typeof c.cellIndex == "number" ? c.cellIndex : r;
    }
    if (e) {
      const r = e.closest ? e.closest("[data-ln-popover], [id]") : null, c = r && r.id || e.id || null;
      if (c)
        for (let d = 0; d < m.length; d++) {
          const n = m[d];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + c + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : d;
        }
    }
    for (let r = 0; r < m.length; r++) {
      const c = m[r], n = Array.from(c.childNodes || []).filter((s) => s.nodeType === 3), o = (n.length > 0 ? n.map((s) => s.textContent.trim()).join(" ") : c.textContent || "").trim().toLowerCase();
      if (o && o === h)
        return typeof c.cellIndex == "number" ? c.cellIndex : r;
    }
  }
  return null;
}
function br(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let a = 0; a < t.length; a++) {
    const m = t[a];
    !e && m.key && (e = m.key), m.checked && !m.isReset && m.value && i.push(m.value);
  }
  return { key: e, values: i };
}
function yr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function Je(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", a = "data-ln-filter-value", m = "data-ln-filter-hide", h = "data-ln-filter-reset", r = "data-ln-filter-col", c = "data-ln-hash", d = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-filter": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: b, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: b, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" }
  }, s = et(o);
  function u(f) {
    return f.hasAttribute(h) || !f.getAttribute(a);
  }
  function w(f) {
    const l = f.dom.querySelectorAll("[" + i + "]"), g = [];
    for (let T = 0; T < l.length; T++) {
      const _ = l[T];
      g.push({
        key: _.getAttribute(i),
        value: _.getAttribute(a) || "",
        checked: _.checked,
        isReset: u(_)
      });
    }
    const y = br(g);
    return { key: y.key, values: y.values, targetId: f.targetId };
  }
  function v(f, l, g) {
    const y = f.querySelectorAll("[" + i + "]"), T = Array.isArray(g) && g.length > 0;
    for (let _ = 0; _ < y.length; _++) {
      const A = y[_];
      u(A) ? A.checked = !T : T && A.getAttribute(i) === l && g.indexOf(A.getAttribute(a)) !== -1 ? A.checked = !0 : A.checked = !1;
    }
  }
  function E(f) {
    this.dom = f, tt(this, f, s);
    const l = f.getAttribute(r);
    this.colIndex = l !== null ? parseInt(l, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(f, "filter"), this.hashEnabled = !!this.nsKey;
    const g = this, y = oe(function() {
      g._render();
    });
    this._queueRender = y, this._attachHandlers(), this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const _ = st(g.nsKey), A = ye(_);
      A && A.key && A.values.length > 0 ? v(g.dom, A.key, A.values) : v(g.dom, null, []), g._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const _ = st(this.nsKey), A = ye(_);
      A && A.key && A.values.length > 0 && (v(f, A.key, A.values), mt(function() {
        g._destroyed || g._render();
      }), T = !0);
    }
    if (!T) {
      const _ = Je(f.getAttribute(d));
      if (_.length > 0) {
        const A = f.querySelector("[" + i + "]"), C = A ? A.getAttribute(i) : null;
        C && (v(f, C, _), mt(function() {
          g._destroyed || g._render();
        }), T = !0);
      }
    }
    if (!T) {
      const _ = f.querySelectorAll("[" + i + "]");
      for (let A = 0; A < _.length; A++)
        if (_[A].checked && !u(_[A])) {
          mt(function() {
            g._destroyed || g._render();
          });
          break;
        }
    }
    return this;
  }
  E.prototype._attachHandlers = function() {
    const f = this;
    this._onDomChange = function(l) {
      const g = l.target;
      if (!g || !g.hasAttribute || !g.hasAttribute(i)) return;
      const y = Array.from(f.dom.querySelectorAll("[" + i + "]"));
      if (u(g)) {
        for (let T = 0; T < y.length; T++)
          u(y[T]) || (y[T].checked = !1);
        g.checked = !0, f._queueRender();
        return;
      }
      if (g.checked) {
        for (let _ = 0; _ < y.length; _++)
          u(y[_]) && (y[_].checked = !1);
        let T = !1;
        for (let _ = 0; _ < y.length; _++)
          if (u(y[_])) {
            T = !0;
            break;
          }
        if (T) {
          let _ = !0;
          for (let A = 0; A < y.length; A++)
            if (!u(y[A]) && !y[A].checked) {
              _ = !1;
              break;
            }
          if (_)
            for (let A = 0; A < y.length; A++)
              u(y[A]) ? y[A].checked = !0 : y[A].checked = !1;
        }
      } else {
        let T = !1;
        for (let _ = 0; _ < y.length; _++)
          if (!u(y[_]) && y[_].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let _ = 0; _ < y.length; _++)
            u(y[_]) && (y[_].checked = !0);
      }
      f._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, E.prototype._render = function() {
    const f = this, l = w(this), g = this._lastSnapshot;
    if (!(!g || g.key !== l.key || gr(g.values, l.values))) return;
    const T = l.key === null || l.values.length === 0, _ = document.getElementById(f.targetId), A = {
      key: l.key,
      values: l.values.slice(),
      targetId: f.targetId
    };
    L(f.dom, "ln-filter:change", A);
    let C = !1;
    _ && _ !== f.dom && Z(_, "ln-filter:change", A).defaultPrevented && (C = !0);
    const q = g && g.values.length > 0, D = l.values.length === 0;
    if (q && D) {
      const O = { targetId: f.targetId };
      L(f.dom, "ln-filter:reset", O), _ && _ !== f.dom && L(_, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: l.key, values: l.values.slice() };
    const I = yr(l.values);
    if (I ? this.dom.setAttribute(d, I) : this.dom.removeAttribute(d), this.hashEnabled) {
      const O = xn(l.key, l.values);
      dt(this.nsKey, O);
    }
    if (C) return;
    const R = _ && (_.tagName === "TABLE" ? _ : _.querySelector ? _.querySelector("table") : null);
    if (R)
      f._filterTableRows(l, R);
    else {
      if (!_) return;
      const O = _.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(m), T) continue;
        const H = B.getAttribute("data-" + l.key);
        H !== null && (De(H, l.values) || B.setAttribute(m, "true"));
      }
    }
  };
  function S(f) {
    if (!f) return "";
    const l = f.querySelector ? f.querySelector("[data-ln-value]") : null;
    return vt(l || f);
  }
  function p(f) {
    return !!(!f || typeof f != "object" || f.tagName === "TEMPLATE" || typeof f.hasAttribute == "function" && (f.hasAttribute("data-ln-sort-exclude") || f.hasAttribute("hidden")) || f.classList && f.classList.contains("hidden") || f.style && f.style.display === "none" || typeof f.matches == "function" && f.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof f.querySelector == "function" && f.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  E.prototype._filterTableRows = function(f, l) {
    if (!l) {
      const C = document.getElementById(this.targetId);
      if (!C || (l = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !l)) return;
    }
    const g = Ye(l, this.dom, f.key, this.colIndex), y = f.key || this.dom.getAttribute("data-ln-filter-key") || (g !== null ? "col" + g : "attr-filter"), T = f.values;
    n.has(l) || n.set(l, {});
    const _ = n.get(l);
    y && T.length > 0 ? _[y] = {
      col: g,
      values: T.slice(),
      attr: "data-" + y
    } : y && delete _[y];
    const A = l.tBodies;
    for (let C = 0; C < A.length; C++) {
      const q = A[C].rows;
      for (let D = 0; D < q.length; D++) {
        const I = q[D];
        if (p(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = S(I.cells[O]);
        _r(R, _, I) ? I.removeAttribute(m) : I.setAttribute(m, "true");
      }
    }
  }, E.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const f = document.getElementById(this.targetId);
    if (f) {
      const l = f.tagName === "TABLE" ? f : f.querySelector ? f.querySelector("table") : null;
      if (l && n.has(l)) {
        const g = n.get(l), y = Ye(l, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (y !== null ? "col" + y : this.colIndex !== null ? "col" + this.colIndex : null);
        T && g[T] && (delete g[T], this._filterTableRows({ key: null, values: [] }, l)), Object.keys(g).length === 0 && n.delete(l);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function b(f, l) {
    const g = f[e];
    if (!(!g || g._destroyed)) {
      if (l === c)
        g.hashEnabled && g._onHashChange && window.removeEventListener("hashchange", g._onHashChange), g.nsKey = wt(f, "filter"), g.hashEnabled = !!g.nsKey, g.hashEnabled && window.addEventListener("hashchange", g._onHashChange);
      else if (l === d) {
        const y = Je(f.getAttribute(d)), T = f.querySelector("[" + i + "]"), _ = T ? T.getAttribute(i) : null;
        _ && (v(f, _, y), g._render());
      }
    }
  }
  j(t, e, E, "ln-filter", {
    attributes: o,
    persist: {
      attr: d,
      hashActive: function(f) {
        return !!wt(f, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", a = "lnSearchControl", m = "data-ln-search-items", h = "data-ln-search-fields", r = "data-ln-search-exclude", c = "data-ln-search-hide", d = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: f, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: f, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, o = et(n);
  function s(l) {
    const g = wt(l, "search");
    if (g) return g;
    if (l.id) {
      const y = document.querySelector("[" + i + '="' + l.id + '"]');
      if (y) {
        const T = wt(y, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function u(l) {
    return l.matches("input, textarea") ? l : l.querySelector("input, textarea");
  }
  function w(l, g) {
    const y = l.childNodes;
    for (let T = 0; T < y.length; T++) {
      const _ = y[T];
      if (_.nodeType === 3) {
        g.push(_.nodeValue);
        continue;
      }
      _.nodeType === 1 && (_.hasAttribute(r) || w(_, g));
    }
  }
  function v(l) {
    if (l._lnSearchText !== void 0) return l._lnSearchText;
    const g = [];
    w(l, g);
    const y = ji(g);
    return l._lnSearchText = y, y;
  }
  function E(l, g) {
    if (!l.id) return;
    const y = document.querySelectorAll("[" + i + '="' + l.id + '"]');
    for (const T of y) {
      const _ = u(T);
      _ && _.value !== g && (_.value = g);
    }
  }
  function S(l) {
    this.dom = l, this.term = l.getAttribute(t) || "", this._destroyed = !1;
    const g = this;
    return this.nsKey = s(l), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (g._destroyed || !g.hashEnabled) return;
      const y = st(g.nsKey), T = g.dom.getAttribute(t) || "";
      y !== null && y !== T ? g.dom.setAttribute(t, y) : y === null && T !== "" && g.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), mt(function() {
      if (!g._destroyed) {
        if (g.hashEnabled) {
          const y = st(g.nsKey);
          if (y !== null && y !== g.term) {
            g.term = y, g.dom.setAttribute(t, y), E(g.dom, y), g._apply();
            return;
          }
        }
        we(g.term) && (E(g.dom, g.term), g._apply());
      }
    }), this;
  }
  S.prototype._apply = function() {
    const l = this.dom, g = we(this.term), y = On(g);
    this.hashEnabled && dt(this.nsKey, this.term ? this.term : null);
    const T = Ki(l.getAttribute(h));
    if (Z(l, "ln-search:change", {
      term: g,
      tokens: y,
      targetId: l.id,
      fields: T
    }).defaultPrevented) return;
    const A = l.getAttribute(m), C = A ? l.querySelectorAll(A) : l.children;
    for (let q = 0; q < C.length; q++) {
      const D = C[q];
      if (D.removeAttribute(c), D.hasAttribute(r) || y.length === 0) continue;
      const I = v(D);
      Mn(I, y) || D.setAttribute(c, "true");
    }
  }, S.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function p(l) {
    if (this.dom = l, tt(this, l, o), this.input = u(l), this._attachHandler(), this.input && this.input.value.trim()) {
      const g = this;
      mt(function() {
        const y = document.getElementById(g.targetId);
        y && ((y.getAttribute(t) || "").trim() || g._write(g.input.value));
      });
    }
    return this;
  }
  p.prototype._write = function(l) {
    const g = document.getElementById(this.targetId);
    g && g.getAttribute(t) !== l && g.setAttribute(t, l);
  }, p.prototype._attachHandler = function() {
    if (!this.input) return;
    const l = this;
    this._onInput = function() {
      l._write(l.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, p.prototype.destroy = function() {
    this.dom[a] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[a]);
  };
  function b(l) {
    const g = l.getAttribute("data-ln-search-clear-for");
    if (g) {
      const C = document.getElementById(g), q = document.querySelector("[" + i + '="' + g + '"]'), D = q ? u(q) : null;
      return { target: C, input: D };
    }
    const y = l.closest("[" + t + "]");
    if (y) {
      const C = y.id ? document.querySelector("[" + i + '="' + y.id + '"]') : null, q = C ? u(C) : null;
      return { target: y, input: q };
    }
    const T = l.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), q = C ? document.getElementById(C) : null;
      if (q && q.hasAttribute(t)) {
        const D = document.querySelector("[" + i + '="' + C + '"]'), I = D ? u(D) : null;
        return { target: q, input: I };
      }
    }
    const _ = l.closest("[" + i + "]");
    if (_) {
      const C = _.getAttribute(i), q = C ? document.getElementById(C) : null, D = u(_);
      return { target: q, input: D };
    }
    const A = l.parentElement;
    if (A) {
      const C = A.querySelector("[" + i + "]");
      if (C) {
        const q = C.getAttribute(i), D = q ? document.getElementById(q) : null, I = u(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(l) {
    const g = l.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!g) return;
    const y = b(g);
    !y.target && !y.input || (l.preventDefault(), y.input && (y.input.value = "", y.input.focus()), y.target && y.target.setAttribute(t, ""));
  });
  function f(l, g) {
    const y = l[e];
    if (!y || y._destroyed) return;
    if (g === d) {
      y._onHashChange && window.removeEventListener("hashchange", y._onHashChange), y.nsKey = s(l), y.hashEnabled = !!y.nsKey, y.hashEnabled && window.addEventListener("hashchange", y._onHashChange);
      return;
    }
    const T = l.getAttribute(t) || "";
    T !== y.term && (y.term = T, E(l, T), y._apply());
  }
  j(t, e, S, "ln-search", {
    attributes: n,
    onSubtreeChange: function(l, g) {
      const y = g.target;
      y && y._lnSearchText !== void 0 && delete y._lnSearchText, y && y.parentElement && y.parentElement._lnSearchText !== void 0 && delete y.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(l) {
        return !!s(l);
      }
    }
  }), j(i, a, p, "ln-search-control");
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function vr(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function wr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Er(t, e, i, a) {
  const m = St(t);
  if (m === "none") return () => 0;
  const h = m === "desc" ? -1 : 1, r = typeof a == "function" ? a : (c) => c;
  return function(c, d) {
    const n = r(c), o = r(d);
    return xe(n, o, e, i) * h;
  };
}
function _e(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Ar(t, e) {
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
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", a = "data-ln-sort-state", m = "data-ln-sort-dir", h = "data-ln-hash";
  if (window[e] !== void 0) return;
  function r(w, v) {
    return w.getAttribute(v) || null;
  }
  const c = {
    "data-ln-sort": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: r, effect: u, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: r, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: u, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: u, description: "URL hash routing key for sort state persistence" }
  }, d = et(c), n = /* @__PURE__ */ new WeakMap();
  function o(w, v, E) {
    if (v) {
      const S = w.querySelector('[data-ln-field="' + v + '"]');
      return S ? vt(S) : "";
    }
    return E != null && w.cells && w.cells[E] ? vt(w.cells[E]) : vt(w);
  }
  function s(w) {
    this.dom = w, tt(this, w, d);
    const v = w.closest("th");
    this.column = !this.field && v ? v.cellIndex : null, this._state = St(w.getAttribute(a)), w.hasAttribute(a) || w.setAttribute(a, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const E = this;
    this._onClick = function(p) {
      const b = p.target.closest("[" + m + "]");
      if (!b) return;
      const f = St(b.getAttribute(m));
      E._apply(f);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(p) {
      if (E._destroyed || !p.detail) return;
      const b = E._resolveTarget();
      if (!(b && (p.target === b || b.contains(p.target)) || p.detail.targetId && p.detail.targetId === E.targetId)) return;
      if (wr(
        { field: E.field, column: E.column },
        { field: p.detail.field, column: p.detail.column }
      )) {
        const g = St(p.detail.direction);
        g && w.getAttribute(a) !== g && (E._state = g, w.setAttribute(a, g), E._updateAriaSort(g));
        return;
      }
      w.getAttribute(a) !== "none" && (E._state = "none", w.setAttribute(a, "none"), E._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (E._destroyed || !E.hashEnabled) return;
      const p = st(E.nsKey), b = be(p);
      if (b)
        E.field !== null && b.fieldOrColumn === E.field || E.column !== null && String(E.column) === b.fieldOrColumn ? E._state !== b.direction && E._apply(b.direction, !0) : E._state !== "none" && (E._state = "none", w.setAttribute(a, "none"), E._updateAriaSort("none"));
      else if (E._state !== "none") {
        E._state = "none", w.setAttribute(a, "none"), E._updateAriaSort("none");
        const f = E._resolveTarget();
        f && (Z(f, "ln-sort:change", {
          field: E.field,
          column: E.column,
          direction: "none",
          targetId: E.targetId
        }).defaultPrevented || E._defaultSort(f, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let S = !1;
    if (this.hashEnabled) {
      const p = st(this.nsKey), b = be(p);
      b && ((E.field !== null && b.fieldOrColumn === E.field || E.column !== null && String(E.column) === b.fieldOrColumn) && mt(function() {
        E._destroyed || E._apply(b.direction, !0);
      }), S = !0);
    }
    if (!S) {
      const p = St(w.getAttribute(a));
      p && p !== "none" && mt(function() {
        E._destroyed || E._apply(p, !0);
      });
    }
    return this;
  }
  s.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, s.prototype._updateAriaSort = function(w) {
    const v = this.dom.closest("th");
    v && v.setAttribute("aria-sort", vr(w));
  }, s.prototype._apply = function(w, v) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const f = this.dom.closest("th");
      f && f.cellIndex !== void 0 && (this.column = f.cellIndex);
    }
    const E = St(w);
    this._state = E, this.dom.getAttribute(a) !== E && this.dom.setAttribute(a, E), this._updateAriaSort(E);
    const S = this._resolveTarget();
    if (!S) return;
    const p = {
      field: this.field,
      column: this.column,
      direction: E,
      targetId: this.targetId
    };
    if (!v && this.hashEnabled) {
      const f = qn(this.field !== null ? this.field : this.column, E);
      dt(this.nsKey, f);
    }
    Z(S, "ln-sort:change", p).defaultPrevented || this._defaultSort(S, E);
  }, s.prototype._defaultSort = function(w, v) {
    const E = Ar(w, this.itemsSelector);
    if (!E.length) return;
    const S = E[0].parentNode, p = E.filter(function(g) {
      return !_e(g);
    });
    if (!p.length) return;
    n.has(w) || n.set(w, p.slice());
    let b;
    if (v === "none") {
      const g = n.get(w) || p;
      n.delete(w), b = g.filter(function(y) {
        return y.parentNode === S && !_e(y);
      });
    } else {
      const g = this.field, y = this.column, T = p.map(function(q) {
        return o(q, g, y);
      }), _ = qe(T), A = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = Er(v, _, A, function(q) {
        return o(q, g, y);
      });
      b = p.slice().sort(C);
    }
    const f = document.createDocumentFragment();
    let l = 0;
    for (let g = 0; g < E.length; g++) {
      const y = E[g];
      _e(y) ? f.appendChild(y) : l < b.length && f.appendChild(b[l++]);
    }
    S.appendChild(f);
  }, s.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(w, v) {
    const E = w[e];
    if (!(!E || E._destroyed))
      if (v === i) {
        const S = w.closest("th");
        E.column = !E.field && S ? S.cellIndex : null;
      } else if (v === a) {
        const S = St(w.getAttribute(a));
        S !== E._state && E._apply(S);
      } else v === h && (E.hashEnabled && E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = wt(w, "sort"), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange));
  }
  j(t, e, s, "ln-sort", {
    attributes: c,
    persist: {
      attr: a,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function Ze(t, e, i, a, m = 15) {
  if (a <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const h = Math.max(0, t || 0), r = Math.max(0, e || 0), c = Math.floor(h / i), d = Math.ceil(r / i), n = Math.max(0, c - m), o = Math.min(a, c + d + m), s = n * i, u = Math.max(0, (a - o) * i);
  return { start: n, end: o, topPadding: s, bottomPadding: u };
}
function Sr(t, e) {
  const i = Array.isArray(t) ? t.length : 0, a = e instanceof Set ? e : new Set(e || []);
  let m = 0;
  if (Array.isArray(t))
    for (let c = 0; c < t.length; c++)
      a.has(t[c]) && m++;
  else
    m = a.size;
  const h = i > 0 && m === i, r = m > 0 && m < i;
  return { totalCount: i, selectedCount: m, isAllSelected: h, isIndeterminate: r };
}
function tn(t, e, i) {
  const a = new Set(t);
  return e == null || ((i !== void 0 ? i : !a.has(e)) ? a.add(e) : a.delete(e)), a;
}
function en(t, e, i) {
  const a = new Set(t);
  if (!Array.isArray(e)) return a;
  if (i)
    for (let m = 0; m < e.length; m++)
      e[m] != null && a.add(e[m]);
  else
    for (let m = 0; m < e.length; m++)
      a.delete(e[m]);
  return a;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function d(p, b) {
    if (!p || !p.isDataDriven) return;
    const f = p.dom.hasAttribute("data-ln-table-window");
    if (f && !p._windowed)
      p._enterWindowedMode(), p._kickWindowInitial();
    else if (!f && p._windowed)
      p._exitWindowedMode();
    else if (f && p._windowed) {
      const l = parseInt(b, 10);
      l > 0 && p._cache.configure({ windowSize: l });
    }
  }
  function n(p, b) {
    if (!p || !p.isDataDriven || !p._windowed || !p._cache) return;
    const f = parseInt(b, 10);
    f > 0 && p._cache.configure({ pageSize: f });
  }
  function o(p, b) {
    if (!p || !p.isDataDriven || !p._windowed || !p._cache) return;
    const f = parseInt(b, 10);
    f >= 0 && p._cache.configure({ threshold: f });
  }
  function s(p, b) {
    if (!p || !p.isDataDriven || !p._windowed || !p._cache) return;
    const f = parseInt(b, 10);
    f >= 0 && p._cache.setGrandTotal(f);
  }
  const u = {
    "data-ln-table": { prop: "name", type: "string", read: $, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: d, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: s, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, w = et(u);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function v(p, b) {
    if (p == null || isNaN(p)) return "";
    try {
      return new Intl.NumberFormat(it(b)).format(p);
    } catch {
      return String(p);
    }
  }
  function E(p) {
    let b = p.parentElement;
    for (; b && b !== document.body && b !== document.documentElement; ) {
      const l = getComputedStyle(b).overflowY;
      if (l === "auto" || l === "scroll") return b;
      b = b.parentElement;
    }
    return null;
  }
  function S(p) {
    this.dom = p, tt(this, p, w), this.table = p.querySelector("table"), this.tbody = p.querySelector("[data-ln-table-body]") || p.querySelector("tbody"), this.thead = p.querySelector("thead");
    const b = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = b ? Array.from(b.querySelectorAll("th")) : [], this._totalSpan = p.querySelector("[data-ln-table-total]"), this._filteredSpan = p.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== p ? this._filteredSpan.parentElement : null), this._selectedSpan = p.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== p ? this._selectedSpan.parentElement : null), this.isDataDriven = p.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const f = this;
    return this._onSetSearch = function(l) {
      const g = (l.detail && l.detail.query != null ? l.detail.query : l.detail && l.detail.term != null ? l.detail.term : "").trim();
      f.isDataDriven ? (f.currentSearch = g, L(p, "ln-table:search", {
        table: f.name,
        query: f.currentSearch
      }), f._requestData()) : (f._searchTerm = g.toLowerCase(), f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), L(p, "ln-table:filter", {
        term: f._searchTerm,
        matched: f._filteredData.length,
        total: f._data.length
      }));
    }, p.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(l) {
      l.preventDefault(), f._onSetSearch(l);
    }, p.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      f.isDataDriven ? (f.currentFilters = {}, f.currentSearch = "", L(p, "ln-table:clear-filters", { table: f.name }), f._requestData()) : (f._searchTerm = "", f._columnFilters = {}, f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), L(p, "ln-table:filter", {
        term: "",
        matched: f._filteredData.length,
        total: f._data.length
      }));
    }, p.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && p.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(l) {
      const g = l.detail || {}, y = g.data || [], T = g.total != null ? g.total : y.length;
      if (!(f._hasInitialSeed && !f.isLoaded && y.length === 0 && T === 0)) {
        if (f._windowed) {
          f._cache.ingest(g) && !g.provisional && p.classList.remove("ln-table--loading");
          return;
        }
        f._data = y, f._lastTotal = T, f._lastFiltered = g.filtered != null ? g.filtered : f._data.length, f.totalCount = f._lastTotal, f.visibleCount = f._lastFiltered, f.isLoaded = !0, f._hasInitialSeed = !1, p.classList.remove("ln-table--loading"), f._vStart = -1, f._vEnd = -1, f._applyFilterAndSort(), f._render(), f._updateFooter(), L(p, "ln-table:rendered", {
          table: f.name,
          total: f.totalCount,
          visible: f.visibleCount
        });
      }
    }, p.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(l) {
      const g = l.detail && l.detail.loading;
      p.classList.toggle("ln-table--loading", !!g), g && (f.isLoaded = !1);
    }, p.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(l) {
      !f._windowed || !f._cache || f._cache.release(l.detail && l.detail.offset);
    }, p.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !f._windowed || !f._cache || f._cache.revalidate();
    }, p.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !f._windowed || !f._cache || f._requestData();
    }, p.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(l) {
      l.preventDefault(), f.currentSort = l.detail.direction === "none" ? null : { field: l.detail.field, direction: l.detail.direction }, f._requestData();
    }, p.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(l) {
      if (l.target.closest("[data-ln-table-row-select]") || l.target.closest("[data-ln-table-row-action]") || l.target.closest("a") || l.target.closest("button") || l.ctrlKey || l.metaKey || l.button === 1) return;
      const g = l.target.closest("[data-ln-table-row]");
      if (!g) return;
      const y = g.getAttribute("data-ln-table-row-id"), T = g._lnRecord || {};
      L(p, "ln-table:row-click", {
        table: f.name,
        id: y,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(l) {
      const g = l.target.closest("[data-ln-table-row-action]");
      if (!g) return;
      const y = g.closest("[data-ln-table-row]");
      if (!y) return;
      const T = g.getAttribute("data-ln-table-row-action"), _ = y.getAttribute("data-ln-table-row-id"), A = y._lnRecord || {};
      L(p, "ln-table:row-action", {
        table: f.name,
        id: _,
        action: T,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(p, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      f.tbody.rows.length > 0 && (f._emptyTbodyObserver.disconnect(), f._emptyTbodyObserver = null, f._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(l) {
      l.preventDefault();
      const g = l.detail.direction === "none" ? null : l.detail.direction;
      f._sortCol = g === null ? -1 : l.detail.column, f._sortDir = g, f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), L(p, "ln-table:sorted", {
        column: l.detail.column,
        direction: l.detail.direction,
        matched: f._filteredData.length,
        total: f._data.length
      });
    }, p.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(l) {
      if (l.preventDefault(), !l.detail) return;
      const g = l.detail.key, y = l.detail.values || [];
      if (g) {
        if (y.length === 0)
          delete f._columnFilters[g];
        else {
          const T = [];
          for (let _ = 0; _ < y.length; _++)
            T.push(y[_].toLowerCase());
          f._columnFilters[g] = T;
        }
        f._applyFilterAndSort(), f._vStart = -1, f._vEnd = -1, f._render(), f._updateFooter(), L(p, "ln-table:filter", {
          term: f._searchTerm,
          matched: f._filteredData.length,
          total: f._data.length
        });
      }
    }, p.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  S.prototype._parseRows = function() {
    const p = this.tbody.rows, b = this.ths;
    this._data = [], p.length > 0 && (this._rowHeight = p[0].offsetHeight || 40), this._lockColumnWidths();
    for (let f = 0; f < p.length; f++) {
      const l = p[f], g = [], y = [], T = [];
      for (let A = 0; A < l.cells.length; A++) {
        const C = l.cells[A], q = C.textContent.trim();
        g[A] = vt(C), y[A] = q.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(q.toLowerCase());
      }
      let _ = null;
      if (this.isDataDriven) {
        _ = {};
        const A = l.getAttribute("data-ln-table-row-id");
        A != null && (_.id = A);
        for (let C = 0; C < b.length; C++) {
          const q = b[C].getAttribute("data-ln-table-col");
          if (q) {
            const D = C;
            if (D < l.cells.length) {
              const I = l.cells[D];
              _[q] = vt(I);
            }
          }
        }
      }
      this._data.push({
        values: g,
        rawTexts: y,
        html: l.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && _ ? _.id : void 0,
        ..._
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, S.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, S.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const p = document.createElement("colgroup");
    this.ths.forEach(function(b) {
      const f = document.createElement("col");
      f.style.width = b.offsetWidth + "px", p.appendChild(f);
    }), this.table.insertBefore(p, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = p;
  }, S.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const p = this._lastTotal, b = this.visibleCount;
        if (p === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || b === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const p = this._filteredData.length;
        p === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : p > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, S.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const p = this._filteredData, b = document.createDocumentFragment();
      for (let f = 0; f < p.length; f++) {
        const l = this._buildRow(p[f]);
        if (!l) break;
        b.appendChild(l);
      }
      this.tbody.replaceChildren(b), this._selectable && this._updateSelectAll();
    } else {
      const p = [], b = this._filteredData;
      for (let f = 0; f < b.length; f++) p.push(b[f].html);
      this.tbody.innerHTML = p.join(""), this._selectable && this._restoreSelection();
    }
  }, S.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const p = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let f = null;
        if (this._windowed) {
          const l = this._cache ? this._cache.peek() : null;
          f = l ? this._buildRow(l) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (f = this._buildRow(this._data[0]));
        f && this.tbody && (this.tbody.appendChild(f), this._rowHeight = f.offsetHeight || 40, f.remove());
      }
    this.isDataDriven ? this._scrollContainer = E(this.dom) : this._scrollContainer = null;
    const b = this._scrollContainer || window;
    this._scrollHandler = function() {
      p._rafId || (p._rafId = requestAnimationFrame(function() {
        p._rafId = null, p._windowed ? p._renderWindowed() : p._renderVirtual();
      }));
    }, b.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, S.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, S.prototype._renderVirtual = function() {
    const p = this._filteredData, b = p.length, f = this._rowHeight;
    if (!f || !b) return;
    const l = this.thead ? this.thead.offsetHeight : 0, g = this._scrollContainer;
    let y, T;
    if (g) {
      const R = this.table.getBoundingClientRect(), O = g.getBoundingClientRect(), P = R.top - O.top + g.scrollTop + l;
      y = g.scrollTop - P, T = g.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + l;
      y = window.scrollY - P, T = window.innerHeight;
    }
    const _ = Ze(y, T, f, b, 15), A = _.start, C = _.end;
    if (A === this._vStart && C === this._vEnd) return;
    this._vStart = A, this._vEnd = C;
    const q = this.ths.length || 1, D = _.topPadding, I = _.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", q), P.style.height = D + "px", O.appendChild(P), R.appendChild(O);
      }
      for (let O = A; O < C; O++) {
        const P = this._buildRow(p[O]);
        P && R.appendChild(P);
      }
      if (I > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", q), P.style.height = I + "px", O.appendChild(P), R.appendChild(O);
      }
      this.tbody.replaceChildren(R), this._selectable && this._updateSelectAll();
    } else {
      let R = "";
      D > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>');
      for (let O = A; O < C; O++) R += p[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, S.prototype._buildPlaceholderRow = function() {
    const p = document.createElement("tr");
    p.className = "ln-table__placeholder", p.setAttribute("aria-hidden", "true");
    const b = document.createElement("td");
    return b.setAttribute("colspan", this.ths.length || 1), b.style.height = this._rowHeight + "px", p.appendChild(b), p;
  }, S.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const p = this._rowHeight;
    if (!p) return;
    const b = this._cache.logicalTotal, f = this.thead ? this.thead.offsetHeight : 0, l = this._scrollContainer;
    let g, y;
    if (l) {
      const R = this.table.getBoundingClientRect(), O = l.getBoundingClientRect(), P = R.top - O.top + l.scrollTop + f;
      g = l.scrollTop - P, y = l.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + f;
      g = window.scrollY - P, y = window.innerHeight;
    }
    const T = Ze(g, y, p, b, 15), _ = T.start, A = T.end, C = this.ths.length || 1, q = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (q > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = q + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = _; R < A; R++)
      if (this._cache.has(R)) {
        const O = this._buildRow(this._cache.get(R));
        O && I.appendChild(O);
      } else
        I.appendChild(this._buildPlaceholderRow());
    if (D > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = D + "px", R.appendChild(O), I.appendChild(R);
    }
    this.tbody.replaceChildren(I), this._vStart = _, this._vEnd = A, this._cache.ensure(_, A);
  }, S.prototype._showEmptyState = function() {
    const p = this.ths.length || 1;
    let b = null, f = null;
    if (this.isDataDriven) {
      const l = this._lastTotal != null ? this._lastTotal : this._data.length, y = this.visibleCount === 0 && l > 0, T = y ? this.name + "-empty-filtered" : this.name + "-empty";
      if (f = Ct(this.dom, T, "ln-table"), !f) {
        const _ = this.dom.querySelector("template[data-ln-table-empty]");
        if (_) {
          const A = y ? "search" : "initial", C = _.content.querySelector('[data-ln-table-empty-when="' + A + '"]') || _.content.firstElementChild;
          C && (f = document.importNode(C, !0));
        }
      }
      if (f)
        if (f.tagName === "TR")
          b = f;
        else {
          const _ = document.createElement("td");
          _.setAttribute("colspan", String(p)), _.appendChild(f);
          const A = document.createElement("tr");
          A.className = "ln-table__empty", A.appendChild(_), b = A;
        }
    } else {
      const l = this.dom.querySelector("template[" + i + "]"), g = document.createElement("td");
      g.setAttribute("colspan", String(p)), l && g.appendChild(document.importNode(l.content, !0));
      const y = document.createElement("tr");
      y.className = "ln-table__empty", y.appendChild(g), b = y;
    }
    b ? this.tbody.replaceChildren(b) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, S.prototype._fillRow = function(p, b) {
    Vt(p, b);
    const f = p.querySelectorAll("[data-ln-table-cell-attr]");
    for (let l = 0; l < f.length; l++) {
      const g = f[l], y = g.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < y.length; T++) {
        const _ = y[T].trim().split(":");
        if (_.length !== 2) continue;
        const A = _[0].trim(), C = _[1].trim();
        b[A] != null && g.setAttribute(C, b[A]);
      }
    }
  }, S.prototype._buildRow = function(p) {
    let b = Ct(this.dom, this.name + "-row", "ln-table");
    if (!b) {
      const l = this.dom.querySelector("template[data-ln-table-row]");
      l && (b = document.importNode(l.content, !0));
    }
    let f = b ? b.querySelector("[data-ln-table-row]") || b.firstElementChild : null;
    if (f)
      this._fillRow(f, p);
    else if (p && p.html) {
      const l = document.createElement("tbody");
      l.innerHTML = p.html, f = l.firstElementChild;
    } else {
      f = document.createElement("tr"), f.setAttribute("data-ln-table-row", "");
      const l = this.ths;
      for (let g = 0; g < l.length; g++) {
        const y = l[g].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (y) {
          const _ = document.createElement("input");
          _.type = "checkbox", _.setAttribute("data-ln-table-row-select", ""), _.setAttribute("aria-label", "Select row"), T.appendChild(_);
        } else {
          const _ = l[g].getAttribute("data-ln-table-col");
          _ && p[_] != null && (T.textContent = String(p[_]));
        }
        f.appendChild(T);
      }
    }
    if (f._lnRecord = p, p.id != null && f.setAttribute("data-ln-table-row-id", p.id), this._selectable && p.id != null && this.selectedIds.has(String(p.id))) {
      f.classList.add("ln-row-selected");
      const l = f.querySelector("[data-ln-table-row-select]");
      l && (l.checked = !0);
    }
    return f;
  }, S.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    cn(this, "ln-table:request-data", "table");
  }, S.prototype._enterWindowedMode = function() {
    const p = this, b = this.dom, f = parseInt(b.getAttribute("data-ln-table-window"), 10), l = parseInt(b.getAttribute("data-ln-table-window-page"), 10), g = parseInt(b.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !p._windowed || !p._cache || (p.totalCount = p._cache.grandTotal, p.visibleCount = p._cache.logicalTotal, p._lastTotal = p._cache.grandTotal, p.isLoaded = !0, p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), L(b, "ln-table:rendered", {
        table: p.name,
        total: p.totalCount,
        visible: p.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = kn({
      windowSize: f > 0 ? f : 1e3,
      pageSize: l > 0 ? l : 200,
      threshold: g >= 0 ? g : 25,
      fetchDebounce: 120,
      requestPage: function(y, T, _) {
        L(b, "ln-table:request-data", {
          table: p.name,
          sort: y.sort,
          filters: y.filters,
          search: y.search,
          offset: T,
          limit: _,
          queryGen: p._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, S.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let p = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(p) && this._totalSpan) {
        const f = this._totalSpan.textContent.replace(/[^\d]/g, "");
        f && (p = parseInt(f, 10));
      }
      const b = p > 0 ? p : this._data.length;
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
  }, S.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, S.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const p = this.tbody.querySelectorAll("[data-ln-table-row]"), b = [];
    for (let l = 0; l < p.length; l++) {
      const g = p[l].getAttribute("data-ln-table-row-id");
      g != null && b.push(g);
    }
    const f = Sr(b, this.selectedIds);
    this._selectAllCheckbox.checked = f.isAllSelected, this._selectAllCheckbox.indeterminate = f.isIndeterminate;
  }, S.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const p = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let b = 0; b < p.length; b++) {
      const f = p[b].getAttribute("data-ln-table-row-id"), l = f != null && this.selectedIds.has(f);
      p[b].classList.toggle("ln-row-selected", l);
      const g = p[b].querySelector("[data-ln-table-row-select]");
      g && (g.checked = l);
    }
    this._updateSelectAll();
  }, Object.defineProperty(S.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), S.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const p = this;
    if (this._onSelectionChange = function(b) {
      const f = b.target.closest("[data-ln-table-row-select]");
      if (!f) return;
      const l = f.closest("[data-ln-table-row]");
      if (!l) return;
      const g = l.getAttribute("data-ln-table-row-id");
      g != null && (p.selectedIds = tn(p.selectedIds, g, f.checked), l.classList.toggle("ln-row-selected", f.checked), p.selectedCount = p.selectedIds.size, p._updateSelectAll(), p._updateFooter(), L(p.dom, "ln-table:select", {
        table: p.name,
        selectedIds: p.selectedIds,
        count: p.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const b = document.createElement("input");
      b.type = "checkbox";
      const f = p.dom.querySelector('[data-ln-table-dict="select-all"]'), l = p.dom.getAttribute("data-ln-table-select-all-label") || (f ? f.textContent.trim() : null) || "Select all";
      b.setAttribute("aria-label", l), this._selectAllCheckbox.appendChild(b), this._selectAllCheckbox = b;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const b = p._selectAllCheckbox.checked, f = p.tbody ? p.tbody.querySelectorAll("[data-ln-table-row]") : [], l = [];
      for (let g = 0; g < f.length; g++) {
        const y = f[g].getAttribute("data-ln-table-row-id"), T = f[g].querySelector("[data-ln-table-row-select]");
        y != null && (l.push(y), f[g].classList.toggle("ln-row-selected", b), T && (T.checked = b));
      }
      p.selectedIds = en(p.selectedIds, l, b), p.selectedCount = p.selectedIds.size, L(p.dom, "ln-table:select-all", {
        table: p.name,
        selected: b
      }), L(p.dom, "ln-table:select", {
        table: p.name,
        selectedIds: p.selectedIds,
        count: p.selectedCount
      }), p._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const b = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let f = 0; f < b.length; f++) {
        const l = b[f].querySelector("[data-ln-table-row-select]"), g = b[f].getAttribute("data-ln-table-row-id");
        l && l.checked && g != null && (p.selectedIds = tn(p.selectedIds, g, !0), b[f].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, S.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const p = this.dom.querySelector("[data-ln-table-col-select]");
    if (p) {
      const b = p.querySelector('input[type="checkbox"]');
      b && b.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = en(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const b = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let f = 0; f < b.length; f++) {
        b[f].classList.remove("ln-row-selected");
        const l = b[f].querySelector("[data-ln-table-row-select]");
        l && (l.checked = !1);
      }
    }
    this._updateFooter();
  }, S.prototype._updateFooter = function() {
    let p = 0, b = 0;
    this.isDataDriven ? (p = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount) : (p = this._data.length, b = this._filteredData.length);
    const f = b < p;
    if (this._totalSpan && (this._totalSpan.textContent = v(p, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = f ? v(b, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !f), this._selectedSpan) {
      const l = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = l > 0 ? v(l, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", l === 0);
    }
  }, S.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, S, "ln-table", {
    attributes: u
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
    const d = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!d) return;
    const n = d.tagName === "INPUT" || d.tagName === "TEXTAREA" ? d : d.querySelector('input[type="search"], input[type="text"], input');
    n && (c.preventDefault(), n.focus());
  });
  function a(c) {
    return this.dom = c, r(this), this;
  }
  function m(c, d) {
    const n = d ? '[data-ln-search-for="' + d + '"]' : "[data-ln-search-for]", o = c.querySelector(n) || document.querySelector(n);
    return o ? o.tagName === "INPUT" || o.tagName === "TEXTAREA" ? o : o.querySelector("input, textarea") : null;
  }
  function h(c, d) {
    if (d) {
      const o = c.querySelectorAll('[data-ln-filter="' + d + '"]');
      if (o.length > 0) return o;
      const s = document.querySelectorAll('[data-ln-filter="' + d + '"]');
      if (s.length > 0) return s;
    }
    const n = c.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function r(c) {
    const d = c.dom;
    function n(o) {
      const s = o.target;
      if (s && s.hasAttribute && (s.hasAttribute("data-ln-table") || s.tagName === "TABLE")) return s;
      const u = o.detail && o.detail.targetId || s && s.id;
      return u ? d.querySelector('[data-ln-table-source="' + u + '"]') || d.querySelector('[data-ln-table="' + u + '"]') || d.querySelector("#" + u) || (d.id === u ? d : null) || document.getElementById(u) : null;
    }
    c._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const s = n(o);
        if (!s) return;
        const u = o.detail.key, w = o.detail.values || [], v = s.querySelectorAll("th");
        for (let E = 0; E < v.length; E++)
          if ((v[E].getAttribute("data-ln-table-filter-col") || v[E].getAttribute("data-ln-filter-col") || v[E].getAttribute("data-ln-filter-key") || v[E].getAttribute("data-ln-field")) === u) {
            const p = v[E].querySelector("[data-ln-table-col-filter], .table-filter");
            p && p.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const s = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!s) return;
        const u = s.closest("[data-ln-table], table") || d.querySelector("[data-ln-table], table");
        if (!u) return;
        const w = u.lnTable && u.lnTable.name || u.id, v = u.querySelectorAll("th");
        for (let b = 0; b < v.length; b++) {
          const f = v[b].querySelector("[data-ln-table-col-filter], .table-filter");
          f && f.classList.remove("ln-filter-active");
        }
        const E = u.getAttribute("data-ln-table-source") || u.id, S = E ? document.getElementById(E) : null;
        if (S && S.hasAttribute("data-ln-search"))
          S.setAttribute("data-ln-search", "");
        else {
          const b = m(d, E);
          b && b.value !== "" && (b.value = "", b.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const p = h(d, E);
        for (let b = 0; b < p.length; b++) {
          const f = p[b].querySelector("[data-ln-filter-reset]");
          if (!f) continue;
          const l = p[b].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!f.checked || l) && (f.checked = !0, f.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        u.lnTable && !u.hasAttribute("data-ln-table-source") && L(u, "ln-table:request-clear-filters", { table: w });
      }
    }, d.addEventListener("ln-filter:change", c._handlers.filter), d.addEventListener("click", c._handlers.clear);
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, a, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function d(l, g) {
    if (!l || !l.isDataDriven) return;
    const y = l.dom.hasAttribute("data-ln-list-window");
    if (y && !l._windowed)
      l._enterWindowedMode(), l._kickWindowInitial();
    else if (!y && l._windowed)
      l._exitWindowedMode();
    else if (y && l._windowed) {
      const T = parseInt(g, 10);
      T > 0 && l._cache.configure({ windowSize: T });
    }
  }
  function n(l, g) {
    if (!l || !l.isDataDriven || !l._windowed || !l._cache) return;
    const y = parseInt(g, 10);
    y > 0 && l._cache.configure({ pageSize: y });
  }
  function o(l, g) {
    if (!l || !l.isDataDriven || !l._windowed || !l._cache) return;
    const y = parseInt(g, 10);
    y >= 0 && l._cache.configure({ threshold: y });
  }
  function s(l, g) {
    if (!l || !l.isDataDriven || !l._windowed || !l._cache) return;
    const y = parseInt(g, 10);
    y >= 0 && l._cache.setGrandTotal(y);
  }
  const u = {
    "data-ln-list": { prop: "name", type: "string", read: $, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: d, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: s, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, w = et(u);
  function v(l, g) {
    if (l == null || isNaN(l)) return "";
    try {
      return new Intl.NumberFormat(it(g)).format(l);
    } catch {
      return String(l);
    }
  }
  function E(l) {
    let g = l;
    for (; g && g !== document.body && g !== document.documentElement; ) {
      const T = getComputedStyle(g).overflowY;
      if (T === "auto" || T === "scroll") return g;
      g = g.parentElement;
    }
    return null;
  }
  function S(l) {
    const g = l._scrollContainer || E(l.dom);
    return {
      container: g,
      top: g ? g.scrollTop : window.scrollY
    };
  }
  function p(l) {
    l.container ? l.container.scrollTop = l.top : window.scrollTo(window.scrollX, l.top);
  }
  function b(l) {
    if (!l) return 0;
    const g = getComputedStyle(l), y = parseFloat(g.marginTop) || 0, T = parseFloat(g.marginBottom) || 0;
    return l.offsetHeight + y + T;
  }
  function f(l) {
    this.dom = l, tt(this, l, w), this.tbody = l.querySelector("[data-ln-list-body]") || l, this.isDataDriven = l.hasAttribute("data-ln-list-source"), this._totalSpan = l.querySelector("[data-ln-list-total]"), this._filteredSpan = l.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== l ? this._filteredSpan.parentElement : null), this._selectedSpan = l.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== l ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const g = this;
    return this._onSetSearch = function(y) {
      const T = (y.detail && y.detail.query != null ? y.detail.query : y.detail && y.detail.term != null ? y.detail.term : "").trim();
      g.isDataDriven ? (g.currentSearch = T, L(l, "ln-list:search", {
        list: g.name,
        query: g.currentSearch
      }), g._requestData()) : (g._searchTerm = T.toLowerCase(), g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(l, "ln-list:filter", {
        term: g._searchTerm,
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, l.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(y) {
      y.preventDefault(), g._onSetSearch(y);
    }, l.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      g.isDataDriven ? (g.currentFilters = {}, g.currentSearch = "", L(l, "ln-list:clear-filters", { list: g.name }), g._requestData()) : (g._searchTerm = "", g._filters = {}, g._sortField = null, g._sortDir = null, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(l, "ln-list:filter", {
        term: "",
        matched: g._filteredData.length,
        total: g._data.length
      }));
    }, l.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, l.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(y) {
      const T = y.detail || {}, _ = T.data || [], A = T.total != null ? T.total : _.length;
      if (!(g._hasInitialSeed && !g.isLoaded && _.length === 0 && A === 0)) {
        if (g._windowed) {
          g._cache.ingest(T) && !T.provisional && l.classList.remove("ln-list--loading");
          return;
        }
        g._data = _, g._lastTotal = A, g._lastFiltered = T.filtered != null ? T.filtered : g._data.length, g.totalCount = g._lastTotal, g.visibleCount = g._lastFiltered, g.isLoaded = !0, g._hasInitialSeed = !1, l.classList.remove("ln-list--loading"), g._vStart = -1, g._vEnd = -1, g._applyFilterAndSort(), g._render(), g._updateFooter(), L(l, "ln-list:rendered", {
          list: g.name,
          total: g.totalCount,
          visible: g.visibleCount
        });
      }
    }, l.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(y) {
      const T = y.detail && y.detail.loading;
      l.classList.toggle("ln-list--loading", !!T), T && (g.isLoaded = !1);
    }, l.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(y) {
      !g._windowed || !g._cache || g._cache.release(y.detail && y.detail.offset);
    }, l.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !g._windowed || !g._cache || g._cache.revalidate();
    }, l.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !g._windowed || !g._cache || g._requestData();
    }, l.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(y) {
      y.detail.field != null && (y.preventDefault(), g.currentSort = y.detail.direction === "none" ? null : { field: y.detail.field, direction: y.detail.direction }, g._requestData());
    }, l.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(y) {
      if (y.target.closest("[data-ln-item-select]") || y.target.closest("[data-ln-item-action]") || y.target.closest("a") || y.target.closest("button") || y.ctrlKey || y.metaKey || y.button === 1) return;
      const T = y.target.closest("[data-ln-item]");
      if (!T) return;
      const _ = T.getAttribute("data-ln-item-id"), A = T._lnRecord || {};
      L(l, "ln-list:item-click", {
        list: g.name,
        id: _,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(y) {
      const T = y.target.closest("[data-ln-item-action]");
      if (!T) return;
      const _ = T.closest("[data-ln-item]");
      if (!_) return;
      const A = T.getAttribute("data-ln-item-action"), C = _.getAttribute("data-ln-item-id"), q = _._lnRecord || {};
      L(l, "ln-list:item-action", {
        list: g.name,
        id: C,
        action: A,
        record: q
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(l, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      g.tbody.children.length > 0 && (g._emptyObserver.disconnect(), g._emptyObserver = null, g._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(y) {
      if (y.preventDefault(), !y.detail) return;
      const T = y.detail.key, _ = y.detail.values || [];
      if (T) {
        if (_.length === 0)
          delete g._filters[T];
        else {
          const A = [];
          for (let C = 0; C < _.length; C++)
            A.push(_[C].toLowerCase());
          g._filters[T] = A;
        }
        g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(l, "ln-list:filter", {
          term: g._searchTerm,
          matched: g._filteredData.length,
          total: g._data.length
        });
      }
    }, l.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(y) {
      if (y.detail && y.detail.field == null) return;
      y.preventDefault();
      const T = y.detail && y.detail.direction === "none" ? null : y.detail && y.detail.direction;
      g._sortField = T === null ? null : y.detail && y.detail.field, g._sortDir = T, g._applyFilterAndSort(), g._vStart = -1, g._vEnd = -1, g._render(), g._updateFooter(), L(l, "ln-list:sorted", {
        field: g._sortField,
        direction: y.detail && y.detail.direction,
        matched: g._filteredData.length,
        total: g._data.length
      });
    }, l.addEventListener("ln-sort:change", this._onSort)), this;
  }
  f.prototype._parseChildren = function() {
    const l = Array.from(this.tbody.children).filter((g) => !g.classList.contains("ln-list__spacer"));
    this._data = [], l.length > 0 && (this._itemHeight = b(l[0]) || 50);
    for (let g = 0; g < l.length; g++) {
      const y = l[g], T = y.getAttribute("data-ln-item-id") || y.getAttribute("id"), _ = y.textContent.trim().toLowerCase();
      let A = null;
      if (this.isDataDriven) {
        A = {}, T != null && (A.id = T);
        const D = y.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], O = R.getAttribute("data-ln-list-field");
          O && (A[O] = vt(R));
        }
      }
      const C = {}, q = y.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < q.length; D++) {
        const I = q[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
        R && (C[R] = vt(I));
      }
      for (let D = 0; D < y.attributes.length; D++) {
        const I = y.attributes[D];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const R = I.name.slice(5);
          R && (C[R] = I.value);
        }
      }
      this._data.push({
        html: y.outerHTML,
        id: T,
        searchText: _,
        fields: C,
        ...A || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, f.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const l = this._searchTerm, g = l ? l.split(/\s+/).filter(Boolean) : [], y = this._filters || {}, T = Object.keys(y).length > 0;
      if (g.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(_) {
        if (g.length > 0 && !g.every(function(C) {
          return _.searchText && _.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const A in y) {
            const C = y[A];
            if (C && C.length > 0) {
              const q = _.fields && _.fields[A] !== void 0 ? _.fields[A] : _[A] !== void 0 ? _[A] : null, D = q != null ? String(q).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const _ = this._sortField, A = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base" }) : null, q = this._filteredData.map(function(I) {
          return I.fields && I.fields[_] !== void 0 ? I.fields[_] : I[_];
        }), D = qe(q);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[_] !== void 0 ? I.fields[_] : I[_], P = R.fields && R.fields[_] !== void 0 ? R.fields[_] : R[_];
          return xe(O, P, D, C) * A;
        });
      }
    }
  }, f.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const l = this._lastTotal, g = this.visibleCount;
        if (l === 0 || this._filteredData.length === 0 || g === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const l = this._filteredData.length;
        l === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : l > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, f.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const l = this._filteredData, g = document.createDocumentFragment();
      for (let T = 0; T < l.length; T++) {
        const _ = this._buildItem(l[T]);
        _ && g.appendChild(_);
      }
      const y = S(this);
      this.tbody.replaceChildren(g), p(y), this._selectable && this._updateSelectAll();
    } else {
      const l = [], g = this._filteredData;
      for (let T = 0; T < g.length; T++) l.push(g[T].html);
      const y = S(this);
      this.tbody.innerHTML = l.join(""), p(y), this._selectable && this._restoreSelection();
    }
  }, f.prototype._readGridLayout = function() {
    const l = getComputedStyle(this.tbody), g = l.gridTemplateColumns;
    let y = 1;
    if (g && g !== "none") {
      const _ = g.trim().split(/\s+/).filter(Boolean);
      _.length > 0 && (y = _.length);
    }
    const T = parseFloat(l.rowGap);
    return { columns: y, rowGap: isNaN(T) ? 0 : T };
  }, f.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const l = this._cache.peek(), g = l ? this._buildItem(l) : this._buildPlaceholderItem();
      g && (this.tbody.textContent = "", this.tbody.appendChild(g), this._itemHeight = b(g) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const l = this._buildItem(this._data[0]);
        l && (this.tbody.textContent = "", this.tbody.appendChild(l), this._itemHeight = b(l) || 50, this.tbody.textContent = "");
      }
    } else {
      const l = this.tbody.children;
      l.length > 0 && (this._itemHeight = b(l[0]) || 50);
    }
  }, f.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const l = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = E(this.dom);
    const g = this._scrollContainer || window;
    this._scrollHandler = function() {
      l._rafId || (l._rafId = requestAnimationFrame(function() {
        l._rafId = null, l._windowed ? l._renderWindowed() : l._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      l._itemHeight = 0, l._measureItemHeight(), l._vStart = -1, l._vEnd = -1, l._windowed ? l._renderWindowed() : l._renderVirtual();
    }, g.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, f.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, f.prototype._renderVirtual = function() {
    const l = this._filteredData, g = l.length, y = this._itemHeight;
    if (!y || !g) return;
    const T = this._scrollContainer;
    let _, A;
    if (T) {
      const X = this.tbody.getBoundingClientRect(), V = T.getBoundingClientRect(), G = T === this.tbody ? 0 : X.top - V.top + T.scrollTop;
      _ = T.scrollTop - G, A = T.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      _ = window.scrollY - V, A = window.innerHeight;
    }
    const C = this._readGridLayout(), q = C.columns, D = C.rowGap, I = y + D, R = Math.ceil(g / q);
    let O = Math.max(0, Math.floor(_ / I) - 15);
    O = Math.min(O, R);
    const P = Math.ceil(A / I) + 30, B = Math.min(O + P, R), H = Math.min(O * q, g), z = Math.min(B * q, g);
    if (H === this._vStart && z === this._vEnd) return;
    this._vStart = H, this._vEnd = z;
    const Q = O * I, Y = (R - B) * I;
    if (this.isDataDriven) {
      const X = document.createDocumentFragment();
      if (Q > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = Q + "px", X.appendChild(G);
      }
      for (let G = H; G < z; G++) {
        const ft = this._buildItem(l[G]);
        ft && X.appendChild(ft);
      }
      if (Y > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = Y + "px", X.appendChild(G);
      }
      const V = S(this);
      this.tbody.replaceChildren(X), p(V), this._selectable && this._updateSelectAll();
    } else {
      let X = "";
      Q > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Q}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = H; G < z; G++)
        X += l[G].html;
      Y > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Y}px"></${this.isUl ? "li" : "div"}>`);
      const V = S(this);
      this.tbody.innerHTML = X, p(V), this._selectable && this._restoreSelection();
    }
  }, f.prototype._buildPlaceholderItem = function() {
    const l = document.createElement(this.isUl ? "li" : "div");
    return l.className = "ln-list__placeholder", l.setAttribute("aria-hidden", "true"), l.style.height = this._itemHeight + "px", l;
  }, f.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const l = this._itemHeight;
    if (!l) return;
    const g = this._scrollContainer;
    let y, T;
    if (g) {
      const V = this.tbody.getBoundingClientRect(), G = g.getBoundingClientRect(), ft = g === this.tbody ? 0 : V.top - G.top + g.scrollTop;
      y = g.scrollTop - ft, T = g.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      y = window.scrollY - G, T = window.innerHeight;
    }
    const _ = this._readGridLayout(), A = _.columns, C = _.rowGap, q = l + C, D = this._cache.logicalTotal, I = Math.ceil(D / A);
    let R = Math.max(0, Math.floor(y / q) - 15);
    R = Math.min(R, I);
    const O = Math.ceil(T / q) + 30, P = Math.min(R + O, I), B = Math.min(R * A, D), H = Math.min(P * A, D), z = R * q, Q = (I - P) * q, Y = document.createDocumentFragment();
    if (z > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = z + "px", Y.appendChild(V);
    }
    for (let V = B; V < H; V++)
      if (this._cache.has(V)) {
        const G = this._buildItem(this._cache.get(V));
        G && Y.appendChild(G);
      } else
        Y.appendChild(this._buildPlaceholderItem());
    if (Q > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = Q + "px", Y.appendChild(V);
    }
    const X = S(this);
    this.tbody.replaceChildren(Y), p(X), this._vStart = B, this._vEnd = H, this._cache.ensure(B, H);
  }, f.prototype._showEmptyState = function() {
    let l = null;
    if (this.isDataDriven) {
      const g = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && g > 0, _ = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (l = Ct(this.dom, _, "ln-list"), !l) {
        const A = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (A) {
          const C = T ? "search" : "initial", q = A.content.querySelector(`[data-ln-empty-when="${C}"]`) || A.content.firstElementChild;
          q && (l = document.importNode(q, !0));
        }
      }
    } else {
      const g = this.dom.querySelector(`template[${i}]`);
      if (g) {
        const y = g.content.firstElementChild;
        y && (l = document.importNode(y, !0));
      }
    }
    if (l)
      if (l.tagName === "LI" || l.tagName === "TR")
        this.tbody.replaceChildren(l);
      else {
        const g = document.createElement(this.isUl ? "li" : "div");
        g.appendChild(l), this.tbody.replaceChildren(g);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, f.prototype._buildItem = function(l) {
    let g = Ct(this.dom, this.name + "-row", "ln-list");
    if (!g) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (g = document.importNode(T.content, !0));
    }
    let y = g ? g.querySelector("[data-ln-item]") || g.firstElementChild : null;
    if (y)
      Vt(y, l), pt(y, l);
    else if (l && l.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = l.html, y = T.firstElementChild;
    } else if (y = document.createElement(this.isUl ? "li" : "div"), y.setAttribute("data-ln-item", ""), l && typeof l == "object") {
      for (const T in l)
        if (T !== "html" && l[T] != null) {
          const _ = document.createElement("span");
          _.setAttribute("data-ln-field", T), _.textContent = String(l[T]), y.appendChild(_);
        }
    }
    if (y._lnRecord = l, l && l.id != null && (y.setAttribute("data-ln-item-id", l.id), this._selectable && this.selectedIds.has(String(l.id)))) {
      y.classList.add("ln-item-selected");
      const T = y.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return y;
  }, f.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const l = this.tbody.querySelectorAll("[data-ln-item]");
    for (let g = 0; g < l.length; g++) {
      const y = l[g].getAttribute("data-ln-item-id"), T = y != null && this.selectedIds.has(String(y));
      l[g].classList.toggle("ln-item-selected", T);
      const _ = l[g].querySelector("[data-ln-item-select]");
      _ && (_.checked = T);
    }
    this._updateSelectAll();
  }, f.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const l = this;
    this._onSelectionChange = function(g) {
      const y = g.target.closest("[data-ln-item-select]");
      if (!y) return;
      const T = y.closest("[data-ln-item]");
      if (!T) return;
      const _ = T.getAttribute("data-ln-item-id");
      _ != null && (y.checked ? (l.selectedIds.add(String(_)), T.classList.add("ln-item-selected")) : (l.selectedIds.delete(String(_)), T.classList.remove("ln-item-selected")), l._updateSelectAll(), l._updateFooter(), L(l.dom, "ln-list:select", {
        list: l.name,
        selectedIds: l.selectedIds,
        count: l.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const g = l._selectAllCheckbox.checked, y = l.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < y.length; T++) {
        const _ = y[T], A = _.getAttribute("data-ln-item-id"), C = _.querySelector("[data-ln-item-select]");
        A != null && (g ? (l.selectedIds.add(String(A)), _.classList.add("ln-item-selected")) : (l.selectedIds.delete(String(A)), _.classList.remove("ln-item-selected")), C && (C.checked = g));
      }
      L(l.dom, "ln-list:select-all", { list: l.name, selected: g }), L(l.dom, "ln-list:select", {
        list: l.name,
        selectedIds: l.selectedIds,
        count: l.selectedIds.size
      }), l._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, f.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const l = this.tbody.querySelectorAll("[data-ln-item]");
    let g = l.length > 0;
    for (let y = 0; y < l.length; y++) {
      const T = l[y].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        g = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = g;
  }, f.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    cn(this, "ln-list:request-data", "list");
  }, f.prototype._enterWindowedMode = function() {
    const l = this, g = this.dom, y = parseInt(g.getAttribute("data-ln-list-window"), 10), T = parseInt(g.getAttribute("data-ln-list-window-page"), 10), _ = parseInt(g.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !l._windowed || !l._cache || (l.totalCount = l._cache.grandTotal, l.visibleCount = l._cache.logicalTotal, l._lastTotal = l._cache.grandTotal, l.isLoaded = !0, l._vStart = -1, l._vEnd = -1, l._render(), l._updateFooter(), L(g, "ln-list:rendered", {
        list: l.name,
        total: l.totalCount,
        visible: l.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = kn({
      windowSize: y > 0 ? y : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: _ >= 0 ? _ : 25,
      fetchDebounce: 120,
      requestPage: function(A, C, q) {
        L(g, "ln-list:request-data", {
          list: l.name,
          sort: A.sort,
          filters: A.filters,
          search: A.search,
          offset: C,
          limit: q,
          queryGen: l._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, f.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const l = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), g = l > 0 ? l : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: g,
        filtered: g
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, f.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, f.prototype._updateFooter = function() {
    let l = 0, g = 0;
    this.isDataDriven ? (l = this._lastTotal != null ? this._lastTotal : this._data.length, g = this.visibleCount) : (l = this._data.length, g = this._filteredData.length);
    const y = g < l;
    if (this._totalSpan && (this._totalSpan.textContent = v(l, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = y ? v(g, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !y), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? v(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, f.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, f, "ln-list", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(u) {
    const w = u[e];
    w && s.call(w);
  }
  const a = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, m = "http://www.w3.org/2000/svg", h = 36, r = 16, c = 2 * Math.PI * r;
  function d(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, o.call(this), s.call(this), this;
  }
  d.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(u, w) {
    const v = document.createElementNS(m, u);
    for (const [E, S] of Object.entries(w))
      v.setAttribute(E, S);
    return v;
  }
  function o() {
    this.svg = n("svg", {
      viewBox: "0 0 " + h + " " + h,
      width: h,
      height: h
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: h / 2,
      cy: h / 2,
      r,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: h / 2,
      cy: h / 2,
      r,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": c,
      "stroke-dashoffset": c,
      transform: "rotate(-90 " + h / 2 + " " + h / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function s() {
    const u = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), v = Dn(u, w || 100), E = c - v.percentage / 100 * c;
    this.progressCircle.setAttribute("stroke-dashoffset", E);
    const S = this.dom.getAttribute("data-ln-circular-progress-label"), p = S !== null ? S : Math.round(v.percentage) + "%";
    this.labelEl.textContent = p, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(v.min)), this.dom.setAttribute("aria-valuemax", String(v.max)), this.dom.setAttribute("aria-valuenow", String(v.clampedValue)), this.dom.setAttribute("aria-valuetext", p), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: v.value,
      max: v.max,
      percentage: v.percentage
    });
  }
  j(t, e, d, "ln-circular-progress", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const a = {
    "data-ln-sortable": { effect: h, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function m(r) {
    this.dom = r, this.isEnabled = r.getAttribute(t) !== "disabled", this._dragging = null, r.setAttribute("aria-roledescription", "sortable list");
    const c = this;
    return this._onPointerDown = function(d) {
      c.isEnabled && c._handlePointerDown(d);
    }, r.addEventListener("pointerdown", this._onPointerDown), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, m.prototype._handlePointerDown = function(r) {
    let c = r.target.closest("[" + i + "]"), d;
    if (c) {
      for (d = c; d && d.parentElement !== this.dom; )
        d = d.parentElement;
      if (!d || d.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
      for (d = r.target; d && d.parentElement !== this.dom; )
        d = d.parentElement;
      if (!d || d.parentElement !== this.dom) return;
      c = d;
    }
    const o = Array.from(this.dom.children).indexOf(d);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: d,
      index: o
    }).defaultPrevented) return;
    r.preventDefault(), c.setPointerCapture(r.pointerId), this._dragging = d, d.classList.add("ln-sortable--dragging"), d.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: d,
      index: o
    });
    const u = this, w = function(E) {
      u._handlePointerMove(E);
    }, v = function(E) {
      u._handlePointerEnd(E), c.removeEventListener("pointermove", w), c.removeEventListener("pointerup", v), c.removeEventListener("pointercancel", v);
    };
    c.addEventListener("pointermove", w), c.addEventListener("pointerup", v), c.addEventListener("pointercancel", v);
  }, m.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const c = Array.from(this.dom.children), d = this._dragging;
    for (const n of c)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of c) {
      if (n === d) continue;
      const o = n.getBoundingClientRect(), s = o.top + o.height / 2;
      if (r.clientY >= o.top && r.clientY < s) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= s && r.clientY <= o.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, m.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const c = this._dragging, d = Array.from(this.dom.children), n = d.indexOf(c);
    let o = null, s = null;
    for (const u of d) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        o = u, s = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        o = u, s = "after";
        break;
      }
    }
    for (const u of d)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (c.classList.remove("ln-sortable--dragging"), c.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== c) {
      s === "before" ? this.dom.insertBefore(c, o) : this.dom.insertBefore(c, o.nextElementSibling);
      const w = Array.from(this.dom.children).indexOf(c);
      L(this.dom, "ln-sortable:reordered", {
        item: c,
        oldIndex: n,
        newIndex: w
      });
    }
    this._dragging = null;
  };
  function h(r) {
    const c = r[e];
    if (!c) return;
    const d = r.getAttribute(t) !== "disabled";
    d !== c.isEnabled && (c.isEnabled = d, L(r, d ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: r }));
  }
  j(t, e, m, "ln-sortable", {
    attributes: a
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", a = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const m = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: c, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: d, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function h(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = r(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const o of [this.available, this.selected])
      for (const s of o.children)
        this._initial.push(s);
    return this.sync(), this._form = n.closest("form"), this._form && (this._onFormReset = this._onFormReset.bind(this), this._form.addEventListener("reset", this._onFormReset)), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._onChange && this.dom.removeEventListener("change", this._onChange), this._form && this._form.removeEventListener("reset", this._onFormReset), delete this.dom[e]);
  }, h.prototype.enable = function() {
    this.dom.setAttribute(t, "");
  }, h.prototype.disable = function() {
    this.dom.setAttribute(t, "disabled");
  }, h.prototype.sync = function() {
    if (!this.available || !this.selected) return;
    const n = Array.from(this.available.children).concat(Array.from(this.selected.children));
    for (let s = 0; s < n.length; s++)
      this._initial.includes(n[s]) || this._initial.push(n[s]);
    let o = 0;
    for (let s = 0; s < this._initial.length; s++) {
      const u = this._initial[s];
      if (!u.isConnected) continue;
      const w = u.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let v;
      w.checked ? this.max === null || o < this.max ? (v = this.selected, o++) : (w.checked = !1, v = this.available) : v = this.available, v.appendChild(u);
    }
  }, h.prototype._onFormReset = function(n) {
    const o = this;
    setTimeout(function() {
      o._destroyed || n.defaultPrevented || o.sync();
    }, 0);
  }, h.prototype._onChange = function(n) {
    const o = n.target.closest('input[type="checkbox"]');
    if (!o) return;
    const s = o.closest("li");
    if (!s) return;
    const u = s.parentElement;
    if (u !== this.available && u !== this.selected) return;
    if (!this.isEnabled) {
      o.checked = !o.checked;
      return;
    }
    const w = o.checked ? this.selected : this.available;
    if (u === w) return;
    if (w === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      o.checked = !o.checked, L(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: s,
        checkbox: o,
        count: this.selected.children.length
      });
      return;
    }
    const v = { item: s, from: u, to: w, checkbox: o };
    if (Z(this.dom, "ln-picklist:before-move", v).defaultPrevented) {
      o.checked = !o.checked;
      return;
    }
    const E = document.activeElement === o;
    w.appendChild(s), E && o.focus(), L(this.dom, "ln-picklist:move", v);
  };
  function r(n) {
    const o = n.getAttribute(a);
    if (o === null || o === "") return null;
    const s = parseInt(o, 10);
    return isNaN(s) || s < 0 ? null : s;
  }
  function c(n) {
    const o = n[e];
    if (!o) return;
    const s = n.getAttribute(t) !== "disabled";
    s !== o.isEnabled && (o.isEnabled = s, L(n, s ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function d(n) {
    const o = n[e];
    o && (o.max = r(n));
  }
  j(t, e, h, "ln-picklist", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", a = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function h(s, u, w) {
    return s.getAttribute(u) || w;
  }
  function r(s, u, w) {
    const v = parseFloat(s.getAttribute(u));
    return isNaN(v) || v <= 0 ? w : v;
  }
  function c(s) {
    const u = document.createElement("span");
    return u.setAttribute(a, ""), u.setAttribute("role", "alert"), u.textContent = s, u;
  }
  const d = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: h, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: r, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (s, u) => s.getAttribute(u) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = et(d);
  function o(s) {
    this.dom = s, tt(this, s, n), this.revertTimer = null, this._submitted = !1, this.idleEl = s.querySelector("[data-ln-confirm-idle]"), this.activeEl = s.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : s.textContent.trim();
    const u = this;
    return this._onClick = function(w) {
      if (!dn(w))
        if (!u.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), u._enterConfirm();
        else {
          if (u._submitted) return;
          u._submitted = !0, w.stopPropagation(), u._reset();
        }
    }, s.addEventListener("click", this._onClick), this;
  }
  o.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const s = this.activeEl ? this.activeEl.textContent.trim() : "";
      s && (this.dom.setAttribute("aria-label", s), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const s = this.dom.querySelector("svg.ln-icon use");
      s && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = s.getAttribute("href"), s.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(c(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, o.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const s = this, u = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      s._reset();
    }, u);
  }, o.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const s = this.dom.querySelector("svg.ln-icon use");
      s && this.originalIconHref && s.setAttribute("href", this.originalIconHref);
      const u = this.dom.querySelector("[" + a + "]");
      u && u.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, j(t, e, o, "ln-confirm", {
    attributes: d
  });
})();
(function() {
  const t = "data-ln-translations", e = "lnTranslations";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-translations": { type: "marker", description: "Mounts multi-language translation manager on form container" },
    "data-ln-translations-default": { prop: "defaultLang", read: $, type: "string", fallback: "", description: "Default primary language code (e.g. en)" },
    "data-ln-translations-placeholder": { prop: "placeholderLabel", read: $, type: "string", fallback: "{lang} translation", description: "Placeholder label pattern for cloned translation inputs" },
    "data-ln-translations-remove-label": { prop: "removeLabel", read: $, type: "string", fallback: "Remove {lang}", description: "Accessible label template for translation removal buttons" },
    "data-ln-translations-locales": { prop: "_localesRaw", read: $, type: "json", fallback: "", description: "JSON dictionary of supported locale codes and display labels" },
    "data-ln-translations-active": { type: "marker", description: "Container holding active language badge tags" },
    "data-ln-translations-add": { type: "string", description: "Trigger button action to add specified language translation fields" },
    "data-ln-translations-lang": { type: "string", description: "Language code associated with active language badge" },
    "data-ln-translations-prefix": { type: "string", description: "Prefix format pattern for cloned translated field names" },
    "data-ln-translatable": { type: "marker", description: "Marks form control as translatable into multiple languages" },
    "data-ln-translatable-lang": { type: "string", description: "Language code assigned to specific translatable input instance" }
  }, a = et(i), m = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function h(r) {
    if (this.dom = r, tt(this, r, a), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = r.querySelector("[data-ln-translations-active]"), this.menuEl = r.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = m, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const c = this;
    return this._onRequestAdd = function(d) {
      d.detail && d.detail.lang && c.addLanguage(d.detail.lang);
    }, this._onRequestRemove = function(d) {
      d.detail && d.detail.lang && c.removeLanguage(d.detail.lang);
    }, r.addEventListener("ln-translations:request-add", this._onRequestAdd), r.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  h.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const r = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const c of r) {
      const d = c.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of d)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, h.prototype._detectExisting = function() {
    const r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const c of r) {
      const d = c.getAttribute("data-ln-translatable-lang");
      d && d !== this.defaultLang && this.activeLanguages.add(d);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, h.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const r = this;
    let c = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      c++;
      const o = Jt("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const s = o.querySelector("[data-ln-translations-lang]");
      s.setAttribute("data-ln-translations-lang", n), s.textContent = this.locales[n], s.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), r.menuEl.getAttribute("data-ln-toggle") === "open" && r.menuEl.setAttribute("data-ln-toggle", "close"), r.addLanguage(n));
      }), this.menuEl.appendChild(o);
    }
    const d = this.dom.querySelector("[data-ln-translations-add]");
    d && (d.hidden = c === 0);
  }, h.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const r = this;
    this.activeLanguages.forEach(function(c) {
      const d = Jt("ln-translations-badge", "ln-translations");
      if (!d) return;
      const n = d.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", c);
      const o = n.querySelector("span");
      o.textContent = r.locales[c] || c.toUpperCase();
      const s = n.querySelector("button"), u = r.locales[c] || c.toUpperCase();
      s.setAttribute("aria-label", r.removeLabel.replace("{lang}", u)), s.addEventListener("click", function(w) {
        w.ctrlKey || w.metaKey || w.button === 1 || (w.preventDefault(), w.stopPropagation(), r.removeLanguage(c));
      }), r.badgesEl.appendChild(d);
    });
  }, h.prototype.addLanguage = function(r, c) {
    if (this.activeLanguages.has(r)) return;
    const d = this.locales[r] || r;
    if (Z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: r,
      langName: d
    }).defaultPrevented) return;
    this.activeLanguages.add(r), c = c || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of o) {
      const u = s.getAttribute("data-ln-translatable"), w = s.getAttribute("data-ln-translations-prefix") || "", v = s.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!v) continue;
      const E = v.cloneNode(v.tagName === "SELECT");
      w ? E.name = w + "[trans][" + r + "][" + u + "]" : E.name = "trans[" + r + "][" + u + "]", E.value = c[u] !== void 0 ? c[u] : "", E.removeAttribute("id"), "placeholder" in E && (E.placeholder = this.placeholderLabel.replace("{lang}", d)), E.setAttribute("data-ln-translatable-lang", r);
      const S = s.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), p = S.length > 0 ? S[S.length - 1] : v;
      p.parentNode.insertBefore(E, p.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: r,
      langName: d
    });
  }, h.prototype.removeLanguage = function(r) {
    if (!this.activeLanguages.has(r) || Z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: r
    }).defaultPrevented) return;
    const d = this.dom.querySelectorAll('[data-ln-translatable-lang="' + r + '"]');
    for (const n of d)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(r), this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: r
    });
  }, h.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, h.prototype.hasLanguage = function(r) {
    return this.activeLanguages.has(r);
  }, h.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const r = this.defaultLang, c = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const d of c)
      d.getAttribute("data-ln-translatable-lang") !== r && d.parentNode.removeChild(d);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, j(t, e, h, "ln-translations", {
    attributes: i
  });
})();
const Cr = "ln-autosave:", Tr = 1e3;
function kr(t, e) {
  return e ? Cr + (t || "") + ":" + e : null;
}
function Lr(t, e = Tr) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", a = "data-ln-autosave-debounce-input", m = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function r(d) {
    const n = d.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function c(d) {
    const o = d.getAttribute(t) || d.id, s = kr(window.location.pathname, o);
    if (!s) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", d);
      return;
    }
    this.dom = d, this.key = s;
    let u = null;
    function w() {
      const p = hn(d, { exclude: m });
      try {
        localStorage.setItem(s, JSON.stringify(p));
      } catch {
        return;
      }
      L(d, "ln-autosave:saved", { target: d, data: p });
    }
    function v() {
      let p;
      try {
        p = localStorage.getItem(s);
      } catch {
        return;
      }
      if (!p) return;
      let b;
      try {
        b = JSON.parse(p);
      } catch {
        return;
      }
      if (Z(d, "ln-autosave:before-restore", { target: d, data: b }).defaultPrevented) return;
      const l = pn(d, b);
      for (let g = 0; g < l.length; g++)
        l[g].dispatchEvent(new Event("input", { bubbles: !0 })), l[g].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(d, "ln-autosave:restored", { target: d, data: b });
    }
    function E() {
      try {
        localStorage.removeItem(s);
      } catch {
        return;
      }
      L(d, "ln-autosave:cleared", { target: d });
    }
    this._onFocusout = function(p) {
      const b = p.target;
      r(b) && b.name && !b.matches(m) && w();
    }, this._onChange = function(p) {
      const b = p.target;
      r(b) && b.name && !b.matches(m) && w();
    }, this._onSubmit = function() {
      E();
    }, this._onReset = function() {
      E();
    }, this._onClearClick = function(p) {
      p.target.closest("[" + i + "]") && E();
    }, d.addEventListener("focusout", this._onFocusout), d.addEventListener("change", this._onChange), d.addEventListener("submit", this._onSubmit), d.addEventListener("reset", this._onReset), d.addEventListener("click", this._onClearClick);
    const S = Lr(d.getAttribute(a));
    return S > 0 && (this._onInput = function(p) {
      const b = p.target;
      !r(b) || !b.name || b.matches(m) || (u !== null && clearTimeout(u), u = setTimeout(w, S));
    }, d.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, v(), this;
  }
  c.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const d = this._getInputTimer();
        d !== null && clearTimeout(d);
      }
      delete this.dom[e];
    }
  }, j(t, e, c, "ln-autosave", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-autoresize": { type: "marker", description: "Automatically adjusts textarea height to match its scrollable content" }
  };
  function a(m) {
    if (m.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", m.tagName), this;
    this.dom = m;
    const h = this;
    return this._onInput = function() {
      h._resize();
    }, m.addEventListener("input", this._onInput), this._resize(), this;
  }
  a.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, a, "ln-autoresize", {
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
  }, m = {
    bold: "bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strikeThrough"
  }, h = {
    "heading-2": "h2",
    "heading-3": "h3",
    "heading-4": "h4",
    blockquote: "blockquote",
    code: "pre",
    paragraph: "p"
  }, r = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let c = 0;
  function d(p) {
    return !!(m[p] || h[p] || r[p] || p === "link");
  }
  function n(p) {
    this.dom = p;
    const b = this;
    if (this._textarea = p.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", p), this;
    const f = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), f && this._surface.setAttribute("data-placeholder", f);
    const l = this._textarea.id;
    if (l) {
      const _ = p.querySelector('label[for="' + l + '"]');
      _ && (_.id || (_.id = l + "-label"), this._surface.setAttribute("aria-labelledby", _.id));
    }
    this._surface.id = l ? l + "-surface" : "ln-editor-surface-" + ++c;
    const g = this._textarea.value.trim();
    g && (this._surface.innerHTML = g);
    const y = p.querySelector('[role="toolbar"]');
    if (y && y.nextSibling ? p.insertBefore(this._surface, y.nextSibling) : p.appendChild(this._surface), y) {
      y.setAttribute("aria-controls", this._surface.id);
      const _ = y.querySelectorAll("[data-ln-editor-action]");
      for (let A = 0; A < _.length; A++) {
        const C = _[A].getAttribute("data-ln-editor-action");
        d(C) && _[A].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      b._syncToTextarea(), L(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      });
    }, this._onMousedownToolbar = function(_) {
      _.target.closest("[data-ln-editor-action]") && _.preventDefault();
    }, this._onClickToolbar = function(_) {
      const A = _.target.closest("[data-ln-editor-action]");
      if (!A) return;
      const C = A.getAttribute("data-ln-editor-action");
      b._execAction(C);
    }, this._onPaste = function(_) {
      u(b, _);
    }, this._onKeydown = function(_) {
      E(b, _);
    }, this._onSelectionChange = function() {
      document.contains(b._surface) && b._updateActiveStates();
    }, this._onFocus = function() {
      L(b.dom, "ln-editor:focus", { target: b.dom });
    }, this._onBlur = function() {
      b._syncToTextarea(), L(b.dom, "ln-editor:blur", { target: b.dom });
    }, this._onTextareaInput = function() {
      b._surface.innerHTML !== b._textarea.value && (b._surface.innerHTML = b._textarea.value, L(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), y && (y.addEventListener("mousedown", this._onMousedownToolbar), y.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(_) {
      const A = _.detail && _.detail.html;
      A !== void 0 && (b._surface.innerHTML = A, b._syncToTextarea(), L(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      }));
    }, p.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        b._surface.innerHTML = b._textarea.value, L(p, "ln-editor:changed", {
          html: b._textarea.value,
          target: p
        });
      }, 0);
    }, T.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(p) {
    if (!(!p || Z(this.dom, "ln-editor:before-change", {
      action: p,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), m[p])
        document.execCommand(m[p], !1, null);
      else if (h[p]) {
        const f = h[p], l = o(this._surface);
        l && l.toLowerCase() === f ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + f + ">");
      } else r[p] ? document.execCommand(r[p], !1, null) : p === "link" ? S(this) : p === "unlink" ? document.execCommand("unlink", !1, null) : p === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const p = this.dom.querySelector('[role="toolbar"]');
    if (!p) return;
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return;
    const f = b.anchorNode;
    if (!f || !this._surface.contains(f)) return;
    const l = p.querySelectorAll("[data-ln-editor-action]");
    for (let g = 0; g < l.length; g++) {
      const y = l[g], T = y.getAttribute("data-ln-editor-action");
      let _ = !1;
      if (m[T])
        try {
          _ = document.queryCommandState(m[T]);
        } catch {
        }
      else if (h[T]) {
        const A = o(this._surface);
        _ = A && A.toLowerCase() === h[T];
      } else if (r[T])
        try {
          _ = document.queryCommandState(r[T]);
        } catch {
        }
      else T === "link" && (_ = !!s(b.anchorNode, "A", this._surface));
      d(T) && y.setAttribute("aria-pressed", String(_)), _ ? y.classList.add("ln-editor-active") : y.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(p) {
    this._surface && (this._surface.innerHTML = p, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const p = this.dom.querySelector('[role="toolbar"]');
    p && (p.removeEventListener("mousedown", this._onMousedownToolbar), p.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const b = this._textarea ? this._textarea.form : null;
    if (b && this._onFormReset && b.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const f = this.dom.querySelector(".ln-editor__link-popover");
      f && f.remove();
    }
    delete this.dom[e];
  };
  function o(p) {
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return null;
    let f = b.anchorNode;
    if (!f) return null;
    for (; f && f !== p; ) {
      if (f.nodeType === 1) {
        const l = f.tagName;
        if (l === "H2" || l === "H3" || l === "H4" || l === "BLOCKQUOTE" || l === "PRE" || l === "P")
          return l;
      }
      f = f.parentNode;
    }
    return null;
  }
  function s(p, b, f) {
    for (; p && p !== f; ) {
      if (p.nodeType === 1 && p.tagName === b)
        return p;
      p = p.parentNode;
    }
    return null;
  }
  function u(p, b) {
    b.preventDefault();
    let f = "";
    if (b.clipboardData && (f = b.clipboardData.getData("text/html"), !f)) {
      const g = b.clipboardData.getData("text/plain");
      g && (f = g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), f = "<p>" + f + "</p>");
    }
    if (!f) return;
    const l = w(f);
    l && document.execCommand("insertHTML", !1, l);
  }
  function w(p) {
    const b = document.createElement("div");
    return b.innerHTML = p, v(b), b.innerHTML;
  }
  function v(p) {
    const b = Array.from(p.childNodes);
    for (let f = 0; f < b.length; f++) {
      const l = b[f];
      if (l.nodeType !== 3) {
        if (l.nodeType !== 1) {
          p.removeChild(l);
          continue;
        }
        if (a[l.tagName]) {
          const g = Array.from(l.attributes);
          for (let y = 0; y < g.length; y++) {
            const T = g[y].name;
            if (l.tagName === "A" && T === "href") {
              const _ = l.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(_) || l.removeAttribute("href");
            } else
              l.removeAttribute(T);
          }
          l.tagName === "A" && l.setAttribute("rel", "noopener noreferrer"), v(l);
        } else {
          for (; l.firstChild; )
            p.insertBefore(l.firstChild, l);
          p.removeChild(l);
        }
      }
    }
  }
  function E(p, b) {
    if (!(b.ctrlKey || b.metaKey)) return;
    let f = null;
    switch (b.key.toLowerCase()) {
      case "b":
        f = "bold";
        break;
      case "i":
        f = "italic";
        break;
      case "u":
        f = "underline";
        break;
      case "k":
        f = "link";
        break;
    }
    f && (b.preventDefault(), p._execAction(f));
  }
  function S(p) {
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return;
    const f = s(b.anchorNode, "A", p._surface), l = b.getRangeAt(0).cloneRange();
    p._closeLinkPopover && p._closeLinkPopover();
    const g = Ct(p.dom, "ln-editor-link-popover", "ln-editor");
    if (!g) return;
    const y = g.firstElementChild;
    if (!y) return;
    const T = y.querySelector('input[type="url"]'), _ = y.querySelector('[data-ln-editor-action="confirm-link"]'), A = y.querySelector('[data-ln-editor-action="cancel-link"]');
    f && (T.value = f.getAttribute("href") || "");
    const C = p.dom.querySelector('[role="toolbar"]');
    C ? C.after(y) : p.dom.insertBefore(y, p._surface), T.focus();
    function q() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(l);
    }
    function D() {
      document.removeEventListener("mousedown", P), p._closeLinkPopover = null, y.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), q(), p._surface.focus(), B)
        if (f)
          f.setAttribute("href", B), f.setAttribute("rel", "noopener noreferrer"), p._syncToTextarea(), L(p.dom, "ln-editor:changed", {
            html: p._textarea.value,
            target: p.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const z = s(H.anchorNode, "A", p._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), p._syncToTextarea());
          }
        }
      else f && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), q(), p._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const H = p.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !y.contains(B.target) && !H && O();
    }
    p._closeLinkPopover = D, _.addEventListener("click", I), A.addEventListener("click", R), T.addEventListener("keydown", function(B) {
      B.key === "Enter" ? (B.preventDefault(), I()) : B.key === "Escape" && (B.preventDefault(), R());
    }), document.addEventListener("mousedown", P);
  }
  j(t, e, n, "ln-editor", {
    attributes: i
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function i(m) {
    const h = {}, r = m.dataset;
    for (const c in r) {
      if (!c.startsWith("lnFill") || e[c]) continue;
      const d = c.slice(6);
      d && (h[d.charAt(0).toLowerCase() + d.slice(1)] = r[c]);
    }
    return h;
  }
  function a(m, h) {
    const r = window.CSS && CSS.escape ? CSS.escape(h) : h, c = document.querySelectorAll('[data-ln-fill-id="' + r + '"]');
    if (c.length === 0) return null;
    for (let d = 0; d < c.length; d++) {
      const n = c[d].getAttribute("data-ln-fill-form");
      if (n) {
        const o = document.getElementById(n);
        if (o && m.contains(o)) return c[d];
      }
    }
    return c[0];
  }
  document.addEventListener("click", function(m) {
    if (m.ctrlKey || m.metaKey || m.button === 1) return;
    const h = m.target.closest("[data-ln-fill-form]");
    if (!h) return;
    const r = h.getAttribute("href");
    if (r && r.indexOf("#") !== -1) return;
    const c = h.getAttribute("data-ln-fill-form"), d = document.getElementById(c);
    if (!d) return;
    const n = i(h), o = Object.keys(n).length > 0;
    window.lnCore.lnFill(d, o ? n : null);
  }), document.addEventListener("ln-fill:request", function(m) {
    const h = m.detail;
    if (!h) return;
    const r = m.target, c = h.id;
    if (c == null) {
      window.lnCore.lnFill(r, null);
      return;
    }
    const d = a(r, c);
    if (!d) return;
    const n = i(d);
    window.lnCore.lnFill(r, n);
  }), window[t] = !0;
})();
function qr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", a = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${a}+`, "g"), i).replace(new RegExp(`^${a}+|${a}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: $, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, a = et(i);
  function m(h) {
    if (h.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", h.tagName), this;
    const r = h.form;
    if (!r)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", h), this;
    tt(this, h, a);
    const c = r.elements[this.sourceName];
    if (!c)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', h), this;
    if (typeof c.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', h), this;
    this.dom = h, this.source = c, this._pristine = h.value === "", this._mirroring = !1;
    const d = this;
    return this._onSource = function() {
      d._pristine && d._mirror();
    }, this._onSlug = function() {
      d._mirroring || (d._pristine = d.dom.value === "");
    }, c.addEventListener("input", this._onSource), h.addEventListener("input", this._onSlug), this._pristine && c.value && c.value.trim() !== "" && this._mirror(), this;
  }
  m.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = qr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, m, "ln-slug", {
    attributes: i
  });
})();
function xr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), a = t.getTime(), m = Math.floor((a - i) / 1e3), h = Math.abs(m);
  return h < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : h < 60 ? { value: m, unit: "second", isOlderThanMonth: !1 } : h < 3600 ? { value: Math.round(m / 60), unit: "minute", isOlderThanMonth: !1 } : h < 86400 ? { value: Math.round(m / 3600), unit: "hour", isOlderThanMonth: !1 } : h < 604800 ? { value: Math.round(m / 86400), unit: "day", isOlderThanMonth: !1 } : h < 2592e3 ? { value: Math.round(m / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(m / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function $t(t, e, i = /* @__PURE__ */ new Date()) {
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
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: l, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: l, description: "BCP 47 language tag override for time formatting" }
  }, a = {}, m = {};
  function h(y) {
    return y.getAttribute("data-ln-time-locale") || it(y);
  }
  function r(y, T) {
    const _ = (y || "") + "|" + JSON.stringify(T);
    return a[_] || (a[_] = new Intl.DateTimeFormat(y, T)), a[_];
  }
  function c(y) {
    const T = y || "";
    return m[T] || (m[T] = new Intl.RelativeTimeFormat(y, { numeric: "auto", style: "narrow" })), m[T];
  }
  const d = /* @__PURE__ */ new Set();
  let n = null;
  function o() {
    n || (n = setInterval(u, 6e4));
  }
  function s() {
    n && (clearInterval(n), n = null);
  }
  function u() {
    for (const y of d) {
      if (!document.body.contains(y.dom)) {
        d.delete(y);
        continue;
      }
      b(y);
    }
    d.size === 0 && s();
  }
  function w(y, T) {
    const _ = Lt(T), A = (T || "").toLowerCase().split("-")[0], C = r(T, $t("full", y)), q = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (_ && q !== A && _.monthsLong) {
      const D = _.monthsLong[y.getMonth()], I = y.getDate(), R = y.getFullYear(), O = String(y.getHours()).padStart(2, "0"), P = String(y.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R}, ${O}:${P}`;
    }
    return C.format(y);
  }
  function v(y, T) {
    const _ = $t("short", y), A = Lt(T), C = (T || "").toLowerCase().split("-")[0], q = r(T, _), D = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (A && D !== C && A.monthsShort) {
      const I = A.monthsShort[y.getMonth()], R = y.getDate(), O = _.year ? " " + y.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return q.format(y);
  }
  function E(y, T) {
    return r(T, $t("date", y)).format(y);
  }
  function S(y, T) {
    return r(T, $t("time", y)).format(y);
  }
  function p(y, T) {
    const _ = xr(y);
    return _.isOlderThanMonth ? v(y, T) : c(T).format(_.value, _.unit);
  }
  function b(y) {
    const T = y.dom.getAttribute("datetime");
    if (!T) return;
    const _ = ot(T);
    if (!_) return;
    const A = y.dom.getAttribute(t) || "short", C = h(y.dom);
    let q;
    switch (A) {
      case "relative":
        q = p(_, C);
        break;
      case "full":
        q = w(_, C);
        break;
      case "date":
        q = E(_, C);
        break;
      case "time":
        q = S(_, C);
        break;
      default:
        q = v(_, C);
        break;
    }
    y.dom.textContent = q, A !== "full" && (y.dom.title = w(_, C));
  }
  function f(y) {
    this.dom = y;
    const T = this;
    return this._onLocaleChange = function() {
      b(T);
    }, ie(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), b(this), y.getAttribute(t) === "relative" && (d.add(this), o()), this;
  }
  f.prototype.render = function() {
    b(this);
  }, f.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), d.delete(this), d.size === 0 && s(), delete this.dom[e];
  };
  function l(y) {
    const T = y[e];
    if (!T) return;
    y.getAttribute(t) === "relative" ? (d.add(T), o()) : (d.delete(T), d.size === 0 && s()), b(T);
  }
  function g(y) {
    y.nodeType === 1 && y.hasAttribute && y.hasAttribute(t) && y[e] && b(y[e]);
  }
  j(t, e, f, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: l,
    onInit: g
  });
})();
function Ir(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, a = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const m = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, h = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let c = 0, d = 0, n = 0, o = !1, s = null;
  function u(E, S) {
    h.delete(E), h.set(E, S);
  }
  function w() {
    if (h.size <= e) return [];
    const E = [];
    for (; h.size > e; ) {
      const p = h.keys().next().value;
      E.push(h.get(p)), h.delete(p);
    }
    const S = new Set(h.values());
    return E.filter((p) => !S.has(p));
  }
  function v(E, S) {
    r.add(E), clearTimeout(s), s = setTimeout(() => m(E, i, S), a);
  }
  return {
    get logicalTotal() {
      return c;
    },
    set logicalTotal(E) {
      c = E;
    },
    get grandTotal() {
      return d;
    },
    set grandTotal(E) {
      d = E;
    },
    get queryGen() {
      return n;
    },
    set queryGen(E) {
      n = E;
    },
    get size() {
      return h.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return o;
    },
    getId: (E) => {
      if (!h.has(E)) return;
      const S = h.get(E);
      return u(E, S), S;
    },
    ensure: (E, S, p) => {
      if (!o && !r.has(0)) return v(0, p);
      if (c <= 0) return;
      const b = Math.max(0, E), f = Math.min(c, S);
      for (let l = b; l < f; l++)
        if (!h.has(l)) {
          const g = Math.floor(l / i) * i;
          if (!r.has(g)) return v(g, p);
        }
    },
    ingest: (E, S, p, b, f) => {
      if (f != null && f !== n) return [];
      o = !0, p != null && (d = p), b != null && (c = b);
      for (let l = 0; l < S.length; l++)
        u(E + l, S[l]);
      return r.delete(E), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      o = !1, h.clear(), r.clear(), clearTimeout(s);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (E = {}) => {
      let S = [];
      return E.windowSize > 0 && E.windowSize !== e && (e = E.windowSize, S = w()), E.pageSize > 0 && (i = E.pageSize), E.fetchDebounce >= 0 && (a = E.fetchDebounce), S;
    }
  };
}
function Dr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: a, direction: m } = e, h = m === "desc", r = t.map((d) => d ? d[a] : void 0), c = qe(r);
  return [...t].sort((d, n) => {
    const o = d ? d[a] : void 0, s = n ? n[a] : void 0, u = xe(o, s, c, i);
    return h ? -u : u;
  });
}
function ri(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((a) => Array.isArray(e[a]) && e[a].length > 0);
  return i.length ? t.filter((a) => a ? i.every((m) => De(a[m], e[m])) : !1) : t;
}
function Rr(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const a = On(e);
  return a.length ? t.filter((m) => m ? a.every(
    (h) => i.some((r) => {
      const c = m[r];
      return c != null && Mn(String(c), [h]);
    })
  ) : !1) : t;
}
function Or(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const a = t.map((h) => h && h[e] != null ? parseFloat(h[e]) : NaN).filter((h) => Number.isFinite(h)), m = a.reduce((h, r) => h + r, 0);
  return i === "sum" ? m : i === "avg" && a.length ? m / a.length : 0;
}
function Mr(t, e = {}, i = [], a) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const m = t.length;
  let h = t;
  e.filters && (h = ri(h, e.filters)), e.search && (h = Rr(h, e.search, i));
  const r = h.length;
  if (e.sort && (h = Dr(h, e.sort, a)), e.offset || e.limit) {
    const c = e.offset || 0, d = e.limit || h.length;
    h = h.slice(c, c + d);
  }
  return { records: h, total: m, filtered: r };
}
function Nr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const a = { ...i };
    for (const [m, h] of Object.entries(e))
      if (typeof h == "function")
        try {
          a[m] = h(i);
        } catch {
          a[m] = void 0;
        }
    return a;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(k, x, M) {
    const N = k.getAttribute(x);
    if (N === "never" || N === "-1") return -1;
    const F = parseInt(N, 10);
    return isNaN(F) ? M : F;
  }
  const a = {
    "data-ln-data-store": { type: "marker", effect: Fe, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: Fe, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: vn, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: _i, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: bi, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, m = et(a), h = "ln_app_cache", r = "_meta", c = "1.0";
  let d = null, n = null;
  const o = {};
  function s(k) {
    k && k.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: k });
  }
  function u() {
    const k = {};
    for (const x of document.querySelectorAll(`[${t}]`)) {
      const M = x.id;
      if (M) {
        const N = x.getAttribute("data-ln-data-store-indexes") || "";
        k[M] = {
          indexes: N.split(",").map((F) => F.trim()).filter(Boolean)
        };
      }
    }
    return k;
  }
  function w() {
    return n || (n = new Promise((k) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), k(null);
      const x = u(), M = Object.keys(x), N = indexedDB.open(h);
      N.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), k(null);
      }, N.onsuccess = (F) => {
        const U = F.target.result, K = Array.from(U.objectStoreNames);
        if (!(!K.includes(r) || M.some((ht) => !K.includes(ht))))
          return v(U), d = U, k(U);
        const J = U.version;
        U.close();
        const nt = indexedDB.open(h, J + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), k(null);
        }, nt.onupgradeneeded = (ht) => {
          const at = ht.target.result;
          at.objectStoreNames.contains(r) || at.createObjectStore(r, { keyPath: "key" });
          for (const Tt of M)
            if (!at.objectStoreNames.contains(Tt)) {
              const Nt = at.createObjectStore(Tt, { keyPath: "id" });
              for (const ce of x[Tt].indexes)
                Nt.createIndex(ce, ce, { unique: !1 });
            }
        }, nt.onsuccess = (ht) => {
          const at = ht.target.result;
          v(at), d = at, k(at);
        };
      };
    }), n);
  }
  function v(k) {
    k.onversionchange = () => {
      k.close(), d = null, n = null;
    };
  }
  function E() {
    return d ? Promise.resolve(d) : (n = null, w());
  }
  async function S(k) {
    if (!At() || !k) return k;
    const x = { ...k }, M = x.id, N = await Ui(x);
    return !N || !N.encrypted ? k : {
      ...N,
      id: M
    };
  }
  async function p(k) {
    return !k || !k.encrypted || !At() ? k : Hi(k, { silent: !0 });
  }
  const b = (k, x) => E().then((M) => M ? M.transaction(k, x).objectStore(k) : null);
  function f(k) {
    return new Promise((x, M) => {
      k.onsuccess = () => x(k.result), k.onerror = () => {
        s(k.error), M(k.error);
      };
    });
  }
  const l = (k) => b(k, "readonly").then((x) => x ? f(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((M) => p(M))) : x), g = (k, x) => b(k, "readonly").then((M) => M ? f(M.get(x)).then((N) => N !== void 0 ? N : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? f(M.get(Number(x))) : typeof x == "number" ? f(M.get(String(x))) : null) : null).then((M) => M ? p(M) : null), y = (k, x) => E().then((M) => {
    if (!M) return [];
    const F = M.transaction(k, "readonly").objectStore(k), U = x.map((K) => f(F.get(K)).then((W) => W !== void 0 ? W : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? f(F.get(Number(K))) : typeof K == "number" ? f(F.get(String(K))) : null));
    return Promise.all(U).then((K) => At() ? Promise.all(K.map((W) => W ? p(W) : null)) : K);
  }), T = (k, x) => (At() ? S(x) : Promise.resolve(x)).then((N) => b(k, "readwrite").then((F) => F ? f(F.put(N)) : null)), _ = (k, x) => b(k, "readwrite").then((M) => M ? f(M.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return f(M.delete(Number(x)));
    if (typeof x == "number")
      return f(M.delete(String(x)));
  }) : null), A = (k) => b(k, "readwrite").then((x) => x ? f(x.clear()) : null), C = (k) => b(k, "readonly").then((x) => x ? f(x.count()) : 0), q = (k) => b(r, "readonly").then((x) => x ? f(x.get(k)) : null), D = (k, x) => b(r, "readwrite").then((M) => {
    if (M)
      return x.key = k, f(M.put(x));
  });
  function I(k) {
    return this.dom = k, this._name = k.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", k), tt(this, k, m), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, k.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Ir({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, M, N) => {
        L(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: M,
          query: N,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), o[this._name] = this, R(this), this.ready = X(this), this;
  }
  function R(k) {
    k._handlers = {
      create: (x) => O(k, "create", x.detail, () => B(k, x.detail)),
      update: (x) => O(k, "update", x.detail, () => H(k, x.detail)),
      delete: (x) => O(k, "delete", x.detail, () => z(k, x.detail)),
      "bulk-delete": (x) => O(k, "bulk-delete", x.detail, () => Q(k, x.detail)),
      "sync-failed": (x) => {
        k.isSyncing = !1, L(k.dom, "ln-data-store:sync-error", {
          store: k._name,
          error: x.detail && x.detail.error,
          status: x.detail && x.detail.status
        });
      }
    };
    for (const [x, M] of Object.entries(k._handlers))
      k.dom.addEventListener(`ln-data-store:request-${x}`, M);
    k._queryHandlers = {
      "ln-search:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.term != null ? x.detail.term : "";
        M !== k.query.search && (k.query.search = M, le(k));
      },
      "ln-filter:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.key;
        if (!M) return;
        const N = (x.detail.values || []).slice(), F = k.query.filters[M];
        (F ? F.length === N.length && F.every((K, W) => K === N[W]) : !N.length) || (N.length ? k.query.filters[M] = N : delete k.query.filters[M], le(k));
      },
      "ln-sort:change": (x) => {
        x.preventDefault();
        const M = x.detail && x.detail.field, N = x.detail && x.detail.direction, F = N && N !== "none" ? { field: M, direction: N } : null, U = k.query.sort;
        !U && !F || U && F && U.field === F.field && U.direction === F.direction || (k.query.sort = F, le(k));
      }
    };
    for (const [x, M] of Object.entries(k._queryHandlers))
      k.dom.addEventListener(x, M);
  }
  function O(k, x, M, N) {
    const F = M && M.requestId;
    return k._mutationChain = k._mutationChain.then(() => k.ready).then(() => {
      if (k.initializationError) throw k.initializationError;
      return N();
    }).catch((U) => Y(k, x, F, U)), k._mutationChain;
  }
  function P(k, x = 0) {
    return C(k._name).then((M) => {
      if (k._windowIndex || k.windowed) {
        const N = k.totalCount != null ? k.totalCount : M;
        k.totalCount = Math.max(0, N + x);
      } else
        k.totalCount = M;
      return k.hasCache = !0, k.isLoaded = !0, k.canServe = !0, D(k._name, {
        schema_version: c,
        last_synced_at: k.lastSyncedAt,
        has_cache: !0,
        record_count: k.totalCount
      });
    });
  }
  function B(k, { tempId: x, data: M = {}, requestId: N } = {}) {
    const F = { ...M, id: x };
    return T(k._name, F).then(() => P(k, 1)).then(() => {
      L(k.dom, "ln-data-store:created", { store: k._name, record: F, tempId: x, requestId: N });
    });
  }
  function H(k, { id: x, data: M = {}, requestId: N } = {}) {
    return g(k._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const U = F.id, K = { ...F, ...M, id: U }, W = M.id, J = W !== void 0 && W !== U;
      return (J ? bt(k._name, U, { ...K, id: W }) : T(k._name, K)).then(() => P(k, 0)).then(() => {
        L(k.dom, "ln-data-store:updated", { store: k._name, record: J ? { ...K, id: W } : K, previous: F, requestId: N });
      });
    });
  }
  function z(k, { id: x, requestId: M } = {}) {
    return g(k._name, x).then((N) => {
      if (!N) {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: x, requestId: M, missing: !0 });
        return;
      }
      const F = N.id;
      return _(k._name, F).then(() => P(k, -1)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: F, requestId: M });
      });
    });
  }
  function Q(k, { ids: x = [], requestId: M } = {}) {
    return x.length ? Promise.all(x.map((N) => g(k._name, N))).then((N) => {
      const F = N.filter(Boolean).map((U) => U.id);
      return ft(k._name, F).then(() => P(k, -F.length)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, ids: F, requestId: M });
      });
    }) : (L(k.dom, "ln-data-store:deleted", { store: k._name, ids: [], requestId: M }), Promise.resolve());
  }
  function Y(k, x, M, N) {
    console.error("[ln-data-store] " + x + " failed:", N), L(k.dom, "ln-data-store:mutation-error", {
      store: k._name,
      action: x,
      requestId: M,
      error: N
    });
  }
  function X(k) {
    return w().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return q(k._name);
    }).then((x) => {
      if (k.initializationError = null, x && x.schema_version === c)
        k.lastSyncedAt = x.last_synced_at || null, k.totalCount = x.record_count || 0, k.hasCache = x.has_cache === !0 || k.totalCount > 0, k.hasCache && (k.isLoaded = !0, k.canServe = !0, L(k.dom, "ln-data-store:ready", { store: k._name, count: k.totalCount, source: "cache" })), k.isInitialized = !0, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: k.hasCache, lastSyncedAt: k.lastSyncedAt, count: k.totalCount });
      else {
        if (x && x.schema_version !== c)
          return A(k._name).then(() => D(k._name, { schema_version: c, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (k.isInitialized = !0, k.isLoaded = !1, k.canServe = !1, k.hasCache = !1, k.isSyncing = !1, k.initializationError = x, L(k.dom, "ln-data-store:initialization-error", { store: k._name, error: x }), { ok: !1, error: x }));
  }
  function V(k) {
    k.isSyncing = !0, L(k.dom, "ln-data-store:request-remote-sync", { since: k.lastSyncedAt });
  }
  function G(k, x) {
    return E().then((M) => M ? (At() ? Promise.all(x.map((F) => S(F))) : Promise.resolve(x)).then((F) => new Promise((U, K) => {
      const W = M.transaction(k, "readwrite"), J = W.objectStore(k);
      F.forEach((nt) => J.put(nt)), W.oncomplete = () => U(), W.onerror = () => {
        s(W.error), K(W.error);
      };
    })) : void 0);
  }
  function ft(k, x) {
    return E().then((M) => {
      if (M)
        return new Promise((N, F) => {
          const U = M.transaction(k, "readwrite"), K = U.objectStore(k);
          x.forEach((W) => {
            K.delete(W), typeof W == "string" && W.trim() !== "" && !isNaN(Number(W)) ? K.delete(Number(W)) : typeof W == "number" && K.delete(String(W));
          }), U.oncomplete = () => N(), U.onerror = () => F(U.error);
        });
    });
  }
  function bt(k, x, M) {
    return (At() ? S(M) : Promise.resolve(M)).then((F) => E().then((U) => {
      if (U)
        return new Promise((K, W) => {
          const J = U.transaction(k, "readwrite"), nt = J.objectStore(k);
          nt.put(F), nt.delete(x), J.oncomplete = () => K(), J.onerror = () => {
            s(J.error), W(J.error);
          };
        });
    }));
  }
  const ae = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function li(k) {
    return k ? Object.keys(k).filter((x) => Array.isArray(k[x]) && k[x].length > 0) : [];
  }
  function ci(k, x, M) {
    return x.every((N) => M[N].map(String).includes(String(k[N])));
  }
  function di(k) {
    return String(k || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function ui(k, x, M) {
    return x.every(
      (N) => M.some((F) => {
        const U = k[F];
        return U != null && String(U).toLowerCase().includes(N);
      })
    );
  }
  function fi(k, x, M) {
    return Or(k, x, M);
  }
  function Mt(k, x) {
    return Nr(x, k.presenters && k.presenters.computed);
  }
  function hi(k) {
    return !k.sort && !At();
  }
  function pi(k, x, M) {
    const N = li(x.filters), F = x.search ? di(x.search) : [], U = k._searchFields, K = F.length > 0 && U && U.length > 0;
    return b(k._name, "readonly").then((W) => W ? new Promise((J, nt) => {
      const ht = [], at = W.openCursor();
      at.onsuccess = () => {
        const Tt = at.result;
        if (!Tt || ht.length >= M) {
          J(ht);
          return;
        }
        const Nt = Tt.value;
        (!N.length || ci(Nt, N, x.filters)) && (!K || ui(Nt, F, U)) && ht.push(Nt), Tt.continue();
      }, at.onerror = () => nt(at.error);
    }) : []);
  }
  function Me(k, x, M) {
    return Mr(x, M, k._searchFields, ae);
  }
  function Ne(k, x, M) {
    const N = [];
    for (let U = x; U < x + M; U++) {
      const K = k._windowIndex.getId(U);
      N.push(K);
    }
    const F = Array.from(new Set(N.filter((U) => U !== void 0)));
    return y(k._name, F).then((U) => {
      const K = /* @__PURE__ */ new Map();
      for (let J = 0; J < U.length; J++) {
        const nt = U[J];
        nt && K.set(String(nt.id), nt);
      }
      const W = [];
      for (let J = 0; J < N.length; J++) {
        const nt = N[J];
        if (nt === void 0)
          W.push(null);
        else {
          const ht = K.get(String(nt));
          W.push(ht || null);
        }
      }
      return {
        data: Mt(k, W),
        total: k._windowIndex.grandTotal,
        filtered: k._windowIndex.logicalTotal,
        offset: x,
        queryGen: k._windowIndex.queryGen
      };
    });
  }
  I.prototype.getAll = function(k = {}) {
    const x = this;
    if (x._windowIndex) {
      const M = k.offset || 0, N = k.limit || 200;
      if (x._windowIndex.ensure(M, M + N, k), !x._windowIndex.hasLoaded && !x.noLocalQuery) {
        const F = M + N, U = (K) => K.length ? {
          data: Mt(x, K),
          offset: M,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Ne(x, M, N);
        return hi(k) ? pi(x, k, F).then((K) => U(K.slice(M, F))) : l(x._name).then((K) => U(Me(x, K, k).records));
      }
      return Ne(x, M, N);
    }
    return l(x._name).then((M) => {
      const N = Me(x, M, k);
      return {
        data: Mt(x, N.records),
        total: N.total,
        filtered: N.filtered
      };
    });
  }, I.prototype.getById = function(k) {
    return g(this._name, k).then((x) => x ? Mt(this, [x])[0] : null);
  }, I.prototype.count = function(k) {
    return k && Object.keys(k).length > 0 ? l(this._name).then((M) => ri(M, k).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(k, x) {
    return l(this._name).then((M) => fi(M, k, x));
  }, I.prototype.setPresenters = function(k) {
    this.presenters = k;
  }, I.prototype.applySync = function(k, x, M, N) {
    N = N || {};
    const F = this;
    if (F._windowIndex && N.queryGen != null && N.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve();
    k.length > 0 || x.length > 0;
    let U = Promise.resolve();
    return k.length > 0 && (U = U.then(() => G(F._name, k))), x.length > 0 && (U = U.then(() => ft(F._name, x))), U.then(() => {
      if (F._windowIndex && (N.offset != null || N.total != null)) {
        const K = N.offset != null ? N.offset : 0, W = k.map((nt) => nt.id), J = F._windowIndex.ingest(K, W, N.total, N.filtered, N.queryGen);
        if (J && J.length) return ft(F._name, J);
      }
    }).then(() => C(F._name)).then((K) => (F.totalCount = N.total !== void 0 ? N.total : K, F.hasCache = !0, D(F._name, {
      schema_version: c,
      last_synced_at: M,
      has_cache: !0,
      record_count: F.totalCount
    }))).then(() => {
      const K = !F.isLoaded;
      F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = M, K ? (L(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: N }), L(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: N })) : L(F.dom, "ln-data-store:synced", {
        store: F._name,
        added: k.length,
        deleted: x.length,
        changed: !0,
        meta: N
      });
    }).catch((K) => {
      F.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, I.prototype.applyQuery = function(k, x) {
    x = x || {};
    const M = this;
    let N = Promise.resolve();
    return k.length > 0 && (N = N.then(() => G(M._name, k))), N.then(() => C(M._name)).then((F) => (M.totalCount = x.total !== void 0 ? x.total : F, k.length > 0 && (M.canServe = !0), Mt(M, k))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, I.prototype.fullReload = function() {
    const k = this;
    return A(k._name).then(() => D(k._name, {
      schema_version: c,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      k.isLoaded = !1, k.hasCache = !1, k.lastSyncedAt = null, k.totalCount = 0, V(k);
    });
  }, I.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [k, x] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${k}`, x);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [k, x] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(k, x);
      this._queryHandlers = null;
    }
    delete o[this._name], delete this.dom[e];
  };
  function mi() {
    return E().then((k) => {
      if (!k) return;
      const x = Array.from(k.objectStoreNames);
      return new Promise((M, N) => {
        const F = k.transaction(x, "readwrite");
        x.forEach((U) => F.objectStore(U).clear()), F.oncomplete = () => M(), F.onerror = () => N(F.error);
      });
    }).then(() => {
      Object.values(o).forEach((k) => {
        k.isLoaded = !1, k.canServe = !1, k.isInitialized = !1, k.initializationError = null, k.hasCache = !1, k.isSyncing = !1, k.lastSyncedAt = null, k.totalCount = 0;
      });
    });
  }
  function le(k) {
    k._windowIndex && k._windowIndex.reset(), L(k.dom, "ln-data-store:query-changed", {
      store: k._name,
      query: {
        filters: Object.assign({}, k.query.filters),
        search: k.query.search,
        sort: k.query.sort ? Object.assign({}, k.query.sort) : null
      }
    });
  }
  const gi = "data-ln-data-store-frozen";
  function Fe(k, x) {
    k.setAttribute(gi, x);
  }
  function _i(k) {
    const x = k[e];
    if (!x._windowIndex) return;
    const M = x._windowIndex.configure({ windowSize: x._windowSize });
    M.length && ft(x._name, M).catch((N) => {
      console.error("[ln-data-store] window shrink eviction failed:", N);
    });
  }
  function bi(k) {
    const x = k[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: a
  }), window[e].clearAll = mi, window[e].init = window[e], window[e].setStorageKey = ze, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = ze);
})();
const Fr = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function kt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const a = String(e);
    return i === 0 ? a.replace(/\/+$/, "") : a.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Pr(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, Fr);
  if (e && typeof e == "object")
    for (const m in e)
      e[m] !== void 0 && e[m] !== null && e[m] !== "" && (i[m] = e[m]);
  const a = new URLSearchParams();
  return t.search && a.append(i.search, t.search), t.offset != null && a.append(i.offset, t.offset), t.limit != null && a.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (a.append(i.sortField, t.sort.field), a.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((m) => {
    const h = t.filters[m];
    Array.isArray(h) && h.length > 0 && a.append(m, h.join(","));
  }), a.toString();
}
function Br(t, e, i) {
  let a = kt(t, e);
  return i && (a += (a.indexOf("?") !== -1 ? "&" : "?") + i), a;
}
function nn(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function a(n) {
    const o = n[e];
    o && o.refreshConfig();
  }
  const m = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: $, type: "string", fallback: "", effect: a, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: $, type: "string", fallback: "", effect: a, description: "Resource path appended to base URL" },
    "data-ln-api-headers": { prop: "rawHeaders", read: $, type: "json", fallback: null, effect: a, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: a, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: a, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: a, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: a, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: a, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: a, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, h = et(m);
  function r(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((o) => {
      const s = new Error("HTTP " + n.status + ": " + n.statusText);
      throw s.status = n.status, s.data = o, s;
    });
  }
  function c(n) {
    return this.dom = n, tt(this, n, h), n[e] = this, n[i] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, d(this), this;
  }
  c.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = gn(this.rawHeaders);
    const o = {}, s = n.getAttribute("data-ln-api-param-offset");
    s && (o.offset = s);
    const u = n.getAttribute("data-ln-api-param-limit");
    u && (o.limit = u);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (o.search = w);
    const v = n.getAttribute("data-ln-api-param-sort-field");
    v && (o.sortField = v);
    const E = n.getAttribute("data-ln-api-param-sort-dir");
    E && (o.sortDir = E), this.paramKeys = o;
    const S = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = S !== null ? +S : 300, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, c.prototype._reqHeaders = function(n) {
    const o = Object.assign({}, this.headers);
    return !o.Accept && !o.accept && (o.Accept = "application/json"), !o["Content-Type"] && !o["content-type"] && (o["Content-Type"] = "application/json"), n && (o["X-Idempotency-Key"] = n), o;
  }, c.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, c.prototype.fetchDelta = function(n, o) {
    const s = this;
    let u = kt(s.baseUrl, s.path);
    n != null && n !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = o || "sync";
    s._inflight.has(w) && s._inflight.get(w).abort();
    const v = new AbortController();
    return s._inflight.set(w, v), window.fetch(u, {
      method: "GET",
      headers: s._reqHeaders(),
      credentials: s.credentials,
      signal: v.signal
    }).then(r).finally(function() {
      s._inflight.get(w) === v && s._inflight.delete(w);
    });
  }, c.prototype.query = function(n, o) {
    const s = this, u = Pr(n, s.paramKeys), w = Br(s.baseUrl, s.path, u), v = o || "query";
    s._inflight.has(v) && s._inflight.get(v).abort();
    const E = new AbortController();
    return s._inflight.set(v, E), window.fetch(w, {
      method: "GET",
      headers: s._reqHeaders(),
      credentials: s.credentials,
      signal: E.signal
    }).then(r).finally(function() {
      s._inflight.get(v) === E && s._inflight.delete(v);
    });
  }, c.prototype.create = function(n, o, s) {
    const u = this;
    return window.fetch(kt(u.baseUrl, o || u.path), {
      method: "POST",
      headers: u._reqHeaders(s),
      credentials: u.credentials,
      body: JSON.stringify(n)
    }).then(r);
  }, c.prototype.update = function(n, o, s, u, w) {
    const v = this;
    s != null && (o = Object.assign({}, o, { expected_version: s }));
    const E = u ? kt(v.baseUrl, u) : kt(v.baseUrl, v.path, n);
    return window.fetch(E, {
      method: "PUT",
      headers: v._reqHeaders(w),
      credentials: v.credentials,
      body: JSON.stringify(o)
    }).then(r);
  }, c.prototype.delete = function(n, o, s) {
    const u = this;
    return window.fetch(kt(u.baseUrl, o || u.path, n), {
      method: "DELETE",
      headers: u._reqHeaders(s),
      credentials: u.credentials
    }).then(r);
  }, c.prototype.bulkDelete = function(n, o, s) {
    const u = this;
    return window.fetch(kt(u.baseUrl, o || u.path, "bulk-delete"), {
      method: "DELETE",
      headers: u._reqHeaders(s),
      credentials: u.credentials,
      body: JSON.stringify({ ids: n })
    }).then(r);
  };
  function d(n) {
    n._handlers = {
      sync: function(o) {
        const s = o.detail || {}, u = s.meta && s.meta.targetEl ? s.meta.targetEl : null;
        n.fetchDelta(s.since, u).then(function(w) {
          L(n.dom, "ln-api-connector:fetched", { data: w, since: s.since, meta: s.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: s.since,
            meta: s.meta || null
          });
        });
      },
      query: function(o) {
        const s = o.detail || {}, u = s.query || s, w = s.meta && s.meta.targetEl ? s.meta.targetEl : null, v = w || "query", E = n.queryDebounce;
        function S(b, f, l) {
          n.query(f, l).then(function(g) {
            const y = g || {};
            L(n.dom, "ln-api-connector:fetched", {
              data: y.data || (Array.isArray(y) ? y : []),
              total: y.total,
              filtered: y.filtered,
              offset: f.offset,
              queryGen: f.queryGen,
              meta: b.meta || null
            });
          }).catch(function(g) {
            g && g.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
              action: "query",
              error: g.message,
              status: g.status || 0,
              data: g.data || null,
              meta: b.meta || null
            });
          });
        }
        if (E === 0) {
          S(s, u, w);
          return;
        }
        n._queryTimers.has(v) && clearTimeout(n._queryTimers.get(v));
        const p = setTimeout(function() {
          n._queryTimers.delete(v), S(s, u, w);
        }, E);
        n._queryTimers.set(v, p);
      },
      cancel: function(o) {
        const s = o.detail || {}, u = s.meta && s.meta.targetEl ? s.meta.targetEl : s.targetEl || s.key;
        u && n.cancel(u);
      },
      create: function(o) {
        const s = o.detail || {};
        n.create(s.data, s.url, s.idempotencyKey).then(function(u) {
          const w = nn(u);
          L(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: s.tempId,
            message: w.message,
            meta: s.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: s.tempId,
            meta: s.meta || null
          });
        });
      },
      update: function(o) {
        const s = o.detail || {};
        n.update(s.id, s.data, s.expected_version, s.url, s.idempotencyKey).then(function(u) {
          const w = nn(u);
          L(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: s.id,
            message: w.message,
            meta: s.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: s.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: s.meta || null
          });
        });
      },
      delete: function(o) {
        const s = o.detail || {};
        n.delete(s.id, s.url, s.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          L(n.dom, "ln-api-connector:deleted", {
            response: u,
            id: s.id,
            message: w,
            meta: s.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: s.id,
            meta: s.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const s = o.detail || {};
        n.bulkDelete(s.ids, s.url, s.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          L(n.dom, "ln-api-connector:bulk-deleted", {
            response: u,
            ids: s.ids,
            message: w,
            meta: s.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            ids: s.ids,
            meta: s.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(o) {
      o.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(o) {
      o && clearTimeout(o);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), delete this.dom[e], delete this.dom[i];
  }, j(t, e, c, "ln-api-connector", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function a(v) {
    const E = v[e];
    E && E.refreshConfig();
  }
  const m = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: $, type: "string", fallback: "", effect: a, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: $, type: "string", fallback: "", effect: a, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: $, type: "string", fallback: "", effect: a, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: a, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, h = et(m);
  function r(v) {
    const E = v && v.content !== void 0 ? v.content : v, S = v && v.message ? v.message : null;
    return { content: E, message: S };
  }
  function c(v) {
    return this.dom = v, tt(this, v, h), v[e] = this, v[i] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  c.prototype.refreshConfig = function() {
    const v = this.dom;
    this.credentials = "same-origin";
    const E = v.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = gn(E, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), E.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(v, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function d(v, E, S) {
    const p = Object.assign({}, Ft(v.headers, v.auth), S || {});
    return E && (p["Idempotency-Key"] = E), p;
  }
  c.prototype.fetchDelta = function(v) {
    const E = this, S = ["include_docs=true", "feed=normal"];
    v && S.push("since=" + encodeURIComponent(v));
    const p = Et(E.url, E.db, "_changes") + "?" + S.join("&");
    return window.fetch(p, { method: "GET", headers: Ft(E.headers, E.auth), credentials: E.credentials }).then((b) => {
      if (!b.ok) throw new Error("HTTP " + b.status + ": " + b.statusText);
      return b.json();
    }).then((b) => {
      const f = b.results || [];
      return {
        data: f.filter((l) => !l.deleted && l.doc).map((l) => Object.assign({}, l.doc, { id: l.doc._id })),
        deleted: f.filter((l) => l.deleted).map((l) => l.id),
        synced_at: b.last_seq || v || ""
      };
    });
  };
  function n(v, E, S) {
    const p = Object.assign({ _id: E.id }, E);
    return p._id || delete p._id, window.fetch(Et(v.url, v.db), {
      method: "POST",
      headers: d(v, S),
      credentials: v.credentials,
      body: JSON.stringify(p)
    }).then((b) => {
      if (!b.ok) throw new Error("HTTP " + b.status + ": " + b.statusText);
      return b.json();
    }).then((b) => {
      const f = r(b), l = f.content;
      return { record: Object.assign({}, p, { id: l.id, _id: l.id, _rev: l.rev }), message: f.message };
    });
  }
  c.prototype.create = function(v, E) {
    return n(this, v, E).then((S) => S.record);
  };
  function o(v, E, S, p) {
    const b = Object.assign({ id: String(E), _id: String(E) }, S), f = b._rev || b.rev;
    return (f ? Promise.resolve(f) : window.fetch(Et(v.url, v.db, null, E), { method: "GET", headers: Ft(v.headers, v.auth), credentials: v.credentials }).then((g) => {
      if (!g.ok) throw new Error("Could not retrieve document for revision mapping");
      return g.json().then((y) => y._rev);
    })).then((g) => {
      const y = Object.assign({}, b, { _rev: g });
      delete y.rev;
      const T = d(v, p, { "If-Match": g });
      return window.fetch(Et(v.url, v.db, null, E), {
        method: "PUT",
        headers: T,
        credentials: v.credentials,
        body: JSON.stringify(y)
      }).then((_) => {
        if (_.ok) return _.json().then((A) => {
          const C = r(A);
          return { record: Object.assign({}, y, { _rev: C.content.rev }), message: C.message };
        });
        if (_.status === 409) return _.json().then((A) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = A, C;
        });
        throw new Error("HTTP " + _.status + ": " + _.statusText);
      });
    });
  }
  c.prototype.update = function(v, E, S) {
    return o(this, v, E, S).then((p) => p.record);
  };
  function s(v, E, S, p) {
    return (S ? Promise.resolve(S) : window.fetch(Et(v.url, v.db, null, E), { method: "GET", headers: Ft(v.headers, v.auth), credentials: v.credentials }).then((f) => {
      if (!f.ok) throw new Error("Could not retrieve document for revision delete");
      return f.json().then((l) => l._rev);
    })).then((f) => {
      const l = Et(v.url, v.db, null, E) + "?rev=" + encodeURIComponent(f);
      return window.fetch(l, { method: "DELETE", headers: d(v, p), credentials: v.credentials }).then((g) => {
        if (!g.ok) throw new Error("HTTP " + g.status + ": " + g.statusText);
        return g.json();
      }).then((g) => {
        const y = r(g);
        return { response: y.content, message: y.message };
      });
    });
  }
  c.prototype.delete = function(v, E, S) {
    return s(this, v, E, S).then((p) => p.response);
  };
  function u(v, E, S) {
    return !E || E.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(v.url, v.db, "_all_docs"), {
      method: "POST",
      headers: Ft(v.headers, v.auth),
      credentials: v.credentials,
      body: JSON.stringify({ keys: E })
    }).then((p) => {
      if (!p.ok) throw new Error("HTTP " + p.status + ": " + p.statusText);
      return p.json();
    }).then((p) => {
      const f = (p.rows || []).filter((l) => !l.error && l.value && l.value.rev).map((l) => ({ _id: l.id, _rev: l.value.rev, _deleted: !0 }));
      return f.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(v.url, v.db, "_bulk_docs"), {
        method: "POST",
        headers: d(v, S),
        credentials: v.credentials,
        body: JSON.stringify({ docs: f })
      }).then((l) => {
        if (!l.ok) throw new Error("HTTP " + l.status + ": " + l.statusText);
        return l.json();
      }).then((l) => {
        const g = r(l);
        return { response: { ok: !0, results: g.content, deletedCount: f.length }, message: g.message };
      });
    });
  }
  c.prototype.bulkDelete = function(v, E) {
    return u(this, v, E).then((S) => S.response);
  };
  function w(v) {
    v._handlers = {
      sync: function(E) {
        const S = E.detail || {};
        v.fetchDelta(S.since).then(function(p) {
          L(v.dom, "ln-couchdb-connector:fetched", { data: p, since: S.since, meta: S.meta || null });
        }).catch(function(p) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: p.message,
            status: p.status || 0,
            since: S.since,
            meta: S.meta || null
          });
        });
      },
      create: function(E) {
        const S = E.detail || {};
        n(v, S.data, S.idempotencyKey).then(function(p) {
          L(v.dom, "ln-couchdb-connector:created", { record: p.record, tempId: S.tempId, message: p.message, meta: S.meta || null });
        }).catch(function(p) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: p.message,
            status: p.status || 0,
            tempId: S.tempId,
            meta: S.meta || null
          });
        });
      },
      update: function(E) {
        const S = E.detail || {}, p = Object.assign({}, S.data);
        S.expected_version !== void 0 && (p._rev = S.expected_version), o(v, S.id, p, S.idempotencyKey).then(function(b) {
          L(v.dom, "ln-couchdb-connector:updated", { record: b.record, id: S.id, message: b.message, meta: S.meta || null });
        }).catch(function(b) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: b.message,
            status: b.status || 0,
            id: S.id,
            data: b.status === 409 ? b.data : null,
            conflictData: b.status === 409 ? b.data : null,
            meta: S.meta || null
          });
        });
      },
      delete: function(E) {
        const S = E.detail || {};
        s(v, S.id, S.rev, S.idempotencyKey).then(function(p) {
          L(v.dom, "ln-couchdb-connector:deleted", { response: p.response, id: S.id, message: p.message, meta: S.meta || null });
        }).catch(function(p) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: p.message,
            status: p.status || 0,
            id: S.id,
            meta: S.meta || null
          });
        });
      },
      bulkDelete: function(E) {
        const S = E.detail || {};
        u(v, S.ids, S.idempotencyKey).then(function(p) {
          L(v.dom, "ln-couchdb-connector:bulk-deleted", { response: p.response, ids: S.ids, message: p.message, meta: S.meta || null });
        }).catch(function(p) {
          L(v.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: p.message,
            status: p.status || 0,
            ids: S.ids,
            meta: S.meta || null
          });
        });
      }
    }, v.dom.addEventListener("ln-couchdb-connector:request-sync", v._handlers.sync), v.dom.addEventListener("ln-couchdb-connector:request-create", v._handlers.create), v.dom.addEventListener("ln-couchdb-connector:request-update", v._handlers.update), v.dom.addEventListener("ln-couchdb-connector:request-delete", v._handlers.delete), v.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", v._handlers.bulkDelete);
  }
  c.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const v = this;
    v._handlers && (v.dom.removeEventListener("ln-couchdb-connector:request-sync", v._handlers.sync), v.dom.removeEventListener("ln-couchdb-connector:request-create", v._handlers.create), v.dom.removeEventListener("ln-couchdb-connector:request-update", v._handlers.update), v.dom.removeEventListener("ln-couchdb-connector:request-delete", v._handlers.delete), v.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", v._handlers.bulkDelete), v._handlers = null), delete this.dom[e], delete this.dom[i];
  }, j(t, e, c, "ln-couchdb-connector", {
    attributes: m
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector";
  if (window[e] !== void 0) return;
  const i = 1e3, a = 3e4;
  function m(s) {
    const u = s[e];
    u && (u.command === "connect" ? u._open() : u._disconnect());
  }
  function h(s) {
    const u = s[e];
    !u || u.command !== "connect" || (u._drop("url-changed"), u._open());
  }
  const r = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: m, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: $, type: "string", fallback: "", effect: h, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, c = et(r), d = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function n(s, u) {
    return s === "sync" ? { since: u.since } : s === "query" ? { query: u.query || {} } : s === "create" ? { data: u.data, idempotencyKey: u.idempotencyKey } : s === "update" ? { id: u.id, data: u.data, expected_version: u.expected_version, idempotencyKey: u.idempotencyKey } : s === "delete" ? { id: u.id, idempotencyKey: u.idempotencyKey } : { ids: u.ids, idempotencyKey: u.idempotencyKey };
  }
  function o(s) {
    this.dom = s, tt(this, s, c), s[e] = this, this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const u = this;
    this._onRequest = function(w) {
      u._request(d[w.type], w.detail || {});
    };
    for (const w in d) s.addEventListener(w, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  o.prototype._open = function() {
    if (this._socket || this._timer) return;
    const s = this, u = this.url;
    this._attempt++, this._status = "connecting", L(this.dom, "ln-websocket-connector:connecting", { url: u, attempt: this._attempt });
    let w;
    try {
      w = new WebSocket(u);
    } catch (v) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, v.message), this._held = [], L(this.dom, "ln-websocket-connector:disconnected", { url: u, code: 0, reason: v.message, willReconnect: !1 });
      return;
    }
    this._socket = w, w.onopen = function() {
      s._status = "connected", s._attempt = 0, L(s.dom, "ln-websocket-connector:connected", { url: u });
      const v = s._held;
      s._held = [];
      for (let E = 0; E < v.length; E++) s._send(v[E]);
    }, w.onmessage = function(v) {
      s._receive(v.data);
    }, w.onclose = function(v) {
      s._socket = null, s._status = "disconnected", s._failPending("connection closed");
      const E = s.command === "connect";
      L(s.dom, "ln-websocket-connector:disconnected", { url: u, code: v.code, reason: v.reason, willReconnect: E }), E && s._scheduleReconnect();
    };
  }, o.prototype._scheduleReconnect = function() {
    const s = this, u = Math.min(i * Math.pow(2, Math.max(0, this._attempt - 1)), a);
    this._timer = setTimeout(function() {
      s._timer = null, s._open();
    }, u);
  }, o.prototype._drop = function(s) {
    const u = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, s), this._socket = null), u && (this._status = "disconnected", this._failPending("connection closed"), L(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: s, willReconnect: !1 }));
  }, o.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, o.prototype._request = function(s, u) {
    const w = { ref: String(++this._seq), type: s, detail: u };
    this._status === "connected" ? this._send(w) : this.command === "connect" ? this._held.push(w) : this._fail(w, 0, "disconnected", null);
  }, o.prototype._send = function(s) {
    this._pending.set(s.ref, s), this._socket.send(JSON.stringify(Object.assign({ ref: s.ref, type: s.type }, n(s.type, s.detail))));
  }, o.prototype._receive = function(s) {
    let u;
    try {
      u = JSON.parse(s);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", s);
      return;
    }
    if (u.ref !== void 0) {
      const w = this._pending.get(String(u.ref));
      if (!w) return;
      this._pending.delete(w.ref), u.ok ? this._resolve(w, u.content, u.message || null) : this._fail(w, u.status || 0, u.error, u.data);
      return;
    }
    u.type === "changes" && L(this.dom, "ln-websocket-connector:fetched", {
      data: { data: u.data || [], deleted: u.deleted || [], synced_at: u.synced_at },
      since: null,
      meta: null
    });
  }, o.prototype._resolve = function(s, u, w) {
    const v = s.detail, E = v.meta || null, S = this.dom;
    if (s.type === "sync")
      L(S, "ln-websocket-connector:fetched", { data: u, since: v.since, meta: E });
    else if (s.type === "query") {
      const p = v.query || {}, b = u || {};
      L(S, "ln-websocket-connector:fetched", {
        data: b.data || [],
        total: b.total,
        filtered: b.filtered,
        offset: p.offset,
        queryGen: p.queryGen,
        meta: E
      });
    } else s.type === "create" ? L(S, "ln-websocket-connector:created", { record: u, tempId: v.tempId, message: w, meta: E }) : s.type === "update" ? L(S, "ln-websocket-connector:updated", { record: u, id: v.id, message: w, meta: E }) : s.type === "delete" ? L(S, "ln-websocket-connector:deleted", { response: u, id: v.id, message: w, meta: E }) : L(S, "ln-websocket-connector:bulk-deleted", { response: u, ids: v.ids, message: w, meta: E });
  }, o.prototype._fail = function(s, u, w, v) {
    const E = s.detail;
    L(this.dom, "ln-websocket-connector:error", {
      action: s.type,
      error: w,
      status: u,
      data: v || null,
      conflictData: u === 409 && v || null,
      since: E.since,
      id: E.id,
      ids: E.ids,
      tempId: E.tempId,
      meta: E.meta || null
    });
  }, o.prototype._failAll = function(s, u) {
    for (let w = 0; w < s.length; w++) this._fail(s[w], 0, u, null);
  }, o.prototype._failPending = function(s) {
    const u = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(u, s);
  }, o.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const s in d) this.dom.removeEventListener(s, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e];
    }
  }, j(t, e, o, "ln-websocket-connector", {
    attributes: r
  });
})();
function Ur(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function Bt(t, e) {
  const i = !t || !!t.initializationError, a = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || a) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Qt(t, e, i) {
  return i === "store" && !!e && !(t && t.windowed);
}
function rn(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class Hr {
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
    const m = this._pending.get(a);
    return m ? (this._pending.delete(a), i ? m.reject(e.error || new Error("Store mutation failed")) : m.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope", a = "data-ln-data-coordinator-search", m = "data-ln-data-coordinator-filters", h = "data-ln-data-coordinator-sort-field", r = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function c(_) {
    const A = _[e];
    A && A.refreshMapper();
  }
  function d(_) {
    const A = _[e];
    A && A._queueQueryRefresh();
  }
  function n(_, A) {
    return _.getAttribute(A) || _.id;
  }
  const o = {
    "data-ln-data-coordinator": { prop: "_name", type: "string", read: n, description: "Coordinator name or identifier for data routing" },
    "data-ln-data-coordinator-scope": { type: "string", description: "Scope name addressing the bound data store and connector" },
    "data-ln-data-coordinator-mapper": { type: "string", effect: c, description: "Name of the registered data mapper transform" },
    "data-ln-data-coordinator-search": { type: "string", effect: d, description: "Active search query term" },
    "data-ln-data-coordinator-filters": { type: "string", effect: d, description: "Active encoded filter parameters" },
    "data-ln-data-coordinator-sort-field": { type: "string", effect: d, description: "Active sort field property name" },
    "data-ln-data-coordinator-sort-direction": { type: "enum", values: ["asc", "desc"], fallback: "asc", effect: d, description: "Sort direction" },
    "data-ln-data-coordinator-stale": { type: "marker", description: "Flag indicating data needs re-synchronization" },
    "data-ln-data-coordinator-no-autosync": { type: "boolean", description: "Disables automatic synchronization upon state changes" },
    "data-ln-data-coordinator-dict": { type: "marker", description: "Marks dictionary container for coordinator translatable messages" }
  }, s = et(o), u = /* @__PURE__ */ new Set();
  let w = !1, v = null, E = null, S = null;
  function p() {
    w || (w = !0, v = function() {
      L(document, "ln-data-coordinator:online", {}), u.forEach(function(_) {
        _._maybeSync();
      });
    }, E = function() {
      L(document, "ln-data-coordinator:offline", {});
    }, S = function() {
      document.visibilityState === "visible" && u.forEach(function(_) {
        const A = _.findChildren(), C = A.store;
        C && A.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !_._noAutosync && (!C.hasCache || _._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", v), window.addEventListener("offline", E), document.addEventListener("visibilitychange", S));
  }
  function b() {
    w && (u.size > 0 || (window.removeEventListener("online", v), window.removeEventListener("offline", E), document.removeEventListener("visibilitychange", S), v = null, E = null, S = null, w = !1));
  }
  function f() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (A) => {
        const C = Math.random() * 16 | 0;
        return (A === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  const l = ["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector"];
  function g(_) {
    return _ ? _.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : _.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function y(_) {
    const A = this;
    return this.dom = _, tt(this, _, s), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", _), _[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Hr(), this._dict = re(_, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      A._destroyed || A._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), u.add(this), p(), this._checkInitialSync(), this;
  }
  Object.defineProperty(y.prototype, "_staleThreshold", {
    get: function() {
      const A = this.findChildren().storeEl, C = this.dom.getAttribute("data-ln-data-coordinator-stale") || (A ? A.getAttribute("data-ln-data-store-stale") : null);
      if (C === "never" || C === "-1") return -1;
      const q = parseInt(C, 10);
      return isNaN(q) ? 300 : q;
    }
  }), Object.defineProperty(y.prototype, "_noAutosync", {
    get: function() {
      const A = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (A ? A.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), y.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, y.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const A = this.findChildren().store;
    return !A || !A.lastSyncedAt ? !0 : Date.now() / 1e3 - A.lastSyncedAt > this._staleThreshold;
  }, y.prototype._maybeSync = function() {
    const _ = this.findChildren(), A = _.store;
    !A || A.initializationError || !_.connector || this._noAutosync || !A.isInitialized || A.isSyncing || (!A.hasCache || this._isStale()) && A.forceSync();
  }, y.prototype._checkInitialSync = function() {
    const _ = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (_._destroyed) return;
      const q = _.findChildren(), D = q.store;
      if (D && D.initializationError) {
        _._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !q.connector || _._noAutosync || D.isSyncing || (!D.hasCache || _._isStale()) && D.forceSync();
    }).catch(function(q) {
      _._destroyed || _._reportReconciliationError("store-initialize", q, null);
    });
  }, y.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const A = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    A && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(A)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(C) {
      return C;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(C) {
      return C;
    });
  }, y.prototype.findChildren = function() {
    const _ = this.dom.querySelector("[data-ln-data-store]"), A = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector]") || this.dom.querySelector("[data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: _,
      connectorEl: A,
      queueEl: C,
      store: _ ? _.lnDataStore : null,
      connector: A ? A.lnApiConnector || A.lnCouchDbConnector || A.lnWebsocketConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, y.prototype._handleSubmitRecord = function(_) {
    const A = this.findChildren();
    if (!A.storeEl && !A.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = _.data || {}, q = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = _.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(A, I, _.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(A, q, I, D, _.action);
  }, y.prototype._fanOutCreate = function(_, A, C) {
    this.refreshMapper();
    const q = "_temp_" + f();
    _.storeEl && L(_.storeEl, "ln-data-store:request-create", { tempId: q, data: A }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: q,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(A),
      expectedVersion: null,
      meta: { tempId: q, action: C }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-create", {
      data: this.mapper.egress(A),
      url: C,
      meta: { entryId: f(), queued: !1, op: "create", tempId: q }
    });
  }, y.prototype._fanOutUpdate = function(_, A, C, q, D) {
    this.refreshMapper(), _.storeEl && L(_.storeEl, "ln-data-store:request-update", { id: A, data: C }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: A,
      op: "update",
      targetId: A,
      payload: this.mapper.egress(C),
      expectedVersion: q,
      meta: { id: A, action: D }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-update", {
      id: A,
      data: this.mapper.egress(C),
      expected_version: q,
      url: D,
      meta: { entryId: f(), queued: !1, op: "update", id: A }
    });
  }, y.prototype._fanOutDelete = function(_, A) {
    this.refreshMapper(), _.storeEl && L(_.storeEl, "ln-data-store:request-delete", { id: A }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: A,
      op: "delete",
      targetId: A,
      payload: null,
      expectedVersion: null,
      meta: { id: A }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-delete", {
      id: A,
      meta: { entryId: f(), queued: !1, op: "delete", id: A }
    });
  }, y.prototype._fanOutBulkDelete = function(_, A) {
    this.refreshMapper();
    const C = A.join(",");
    _.storeEl && L(_.storeEl, "ln-data-store:request-bulk-delete", { ids: A }), _.queue ? L(_.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: A },
      expectedVersion: null,
      meta: { bulkKey: C, ids: A }
    }) : _.connector && L(_.connectorEl, g(_.connectorEl) + ":request-bulk-delete", {
      ids: A,
      meta: { entryId: f(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, y.prototype._toastFromMessage = function(_) {
    _ && L(window, "ln-toast:enqueue", {
      type: _.type || "success",
      title: _.title || "",
      message: _.body || ""
    });
  }, y.prototype._toastFromDict = function(_) {
    const A = this._dict[_];
    A && L(window, "ln-toast:enqueue", { type: "error", title: "", message: A });
  }, y.prototype._requestStoreMutation = function(_, A, C) {
    const q = _.storeEl;
    if (!q) return Promise.reject(new Error("Store element not found"));
    const D = f(), I = this._mutationReceipts.wait(D);
    return L(q, "ln-data-store:request-" + A, Object.assign({}, C, { requestId: D })), I;
  }, y.prototype._reportReconciliationError = function(_, A, C) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", {
      operation: _,
      error: A,
      meta: C || null
    });
  };
  function T(_) {
    _._handlers = {
      sync: function(A) {
        _.refreshMapper();
        const C = _.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(C.connectorEl, g(C.connectorEl) + ":request-sync", { since: A.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(A) {
        const C = _.findChildren();
        if (!C.connectorEl) return;
        const q = A.detail || {};
        L(C.connectorEl, g(C.connectorEl) + ":request-query", {
          query: Object.assign({}, q.query, {
            offset: q.offset,
            limit: q.limit,
            queryGen: q.queryGen
          })
        });
      },
      reqCreate: function(A) {
        const C = _.findChildren();
        _._fanOutCreate(C, A.detail.data || {}, A.detail.action);
      },
      reqUpdate: function(A) {
        const C = _.findChildren();
        _._fanOutUpdate(C, A.detail.id, A.detail.data || {}, A.detail.expected_version, A.detail.action);
      },
      reqDelete: function(A) {
        const C = _.findChildren();
        _._fanOutDelete(C, A.detail.id);
      },
      reqBulkDelete: function(A) {
        const C = _.findChildren();
        _._fanOutBulkDelete(C, A.detail.ids || []);
      },
      queueFailed: function() {
        _._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(A) {
        _.refreshMapper();
        const C = _.findChildren();
        if (!C.store || !C.connector || !C.queue) return;
        const q = A.detail || {}, D = q.entryId, I = q.op, R = q.targetId, O = q.payload, P = q.expectedVersion, B = q.meta || {}, H = B.action || null, z = q.idempotencyKey || D;
        I === "create" ? L(C.connectorEl, g(C.connectorEl) + ":request-create", {
          data: O,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: B.tempId }
        }) : I === "update" ? L(C.connectorEl, g(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: P,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? L(C.connectorEl, g(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? L(C.connectorEl, g(C.connectorEl) + ":request-bulk-delete", {
          ids: O && O.ids ? O.ids : [],
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "bulk-delete", bulkKey: B.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", I);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(A) {
        const C = A.target;
        if (A.defaultPrevented) return;
        const q = C.hasAttribute(i) ? C.getAttribute(i) : null;
        if (q === null) return;
        let D;
        if (q ? D = _._owns(q) : D = C.closest("[data-ln-data-coordinator]") === _.dom, !D) return;
        const I = Ai(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        A.preventDefault();
        const R = hn(C);
        delete R._method, delete R._token, _._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(A) {
        const C = A.detail.meta || {}, q = _.findChildren();
        _.refreshMapper();
        const D = A.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const P = I.map((B) => _.mapper.ingress(B));
        if (q.store && !q.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? q.store.applyQuery(P, { total: A.detail.total }).then(function(B) {
            C.queryGen != null && !_._isCurrentGen(C.targetEl, C.queryGen) || (L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: A.detail.total !== void 0 ? A.detail.total : B.length,
              filtered: A.detail.filtered !== void 0 ? A.detail.filtered : B.length,
              offset: A.detail.offset,
              queryGen: A.detail.queryGen
            }), _._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? q.store.applyQuery(P, { total: A.detail.total }).then(function() {
            return q.store.getAll({});
          }).then(function(B) {
            C.queryGen != null && !_._isCurrentGen(C.targetEl, C.queryGen) || L(C.targetEl, "ln-options:set-data", { data: B.data });
          }) : C.kind === "stat" && q.store.applyQuery(P, { total: A.detail.total }).then(function() {
            if (C.queryGen != null && !_._isCurrentGen(C.targetEl, C.queryGen)) return;
            const B = A.detail.filtered !== void 0 ? A.detail.filtered : A.detail.total !== void 0 ? A.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }) : q.store.applySync(P, R, O || Math.floor(Date.now() / 1e3), {
            total: A.detail.total,
            filtered: A.detail.filtered,
            offset: A.detail.offset,
            queryGen: A.detail.queryGen,
            targetEl: C.targetEl
          });
        else if (C.targetEl && C.kind) {
          if (C.kind === "table" || C.kind === "list" || C.kind === "chart")
            L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: P,
              total: A.detail.total !== void 0 ? A.detail.total : P.length,
              filtered: A.detail.filtered !== void 0 ? A.detail.filtered : P.length,
              offset: A.detail.offset,
              queryGen: A.detail.queryGen
            }), _._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            L(C.targetEl, "ln-options:set-data", { data: P });
          else if (C.kind === "stat") {
            const B = A.detail.filtered !== void 0 ? A.detail.filtered : A.detail.total !== void 0 ? A.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }
        }
      },
      connCreated: function(A) {
        const C = _.findChildren(), q = A.detail.meta || {}, D = _.mapper.ingress(A.detail.record);
        (C.storeEl ? _._requestStoreMutation(C, "update", { id: q.tempId, data: D }) : Promise.resolve()).then(function() {
          _._toastFromMessage(A.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: q.entryId,
            oldKey: q.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          _._reportReconciliationError("create-reconcile", R, q);
        });
      },
      connUpdated: function(A) {
        const C = _.findChildren(), q = A.detail.meta || {}, D = _.mapper.ingress(A.detail.record);
        (C.storeEl ? _._requestStoreMutation(C, "update", { id: q.id, data: D }) : Promise.resolve()).then(function() {
          _._toastFromMessage(A.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
        }).catch(function(R) {
          _._reportReconciliationError("update-reconcile", R, q);
        });
      },
      connDeleted: function(A) {
        const C = _.findChildren(), q = A.detail.meta || {};
        _._toastFromMessage(A.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connBulkDeleted: function(A) {
        const C = _.findChildren(), q = A.detail.meta || {};
        _._toastFromMessage(A.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connError: function(A) {
        const C = A.detail || {}, q = C.meta || {}, D = q.op || C.action, I = C.status || C.error && C.error.status || 0, R = _.findChildren();
        if (D === "sync") {
          R.storeEl && L(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          q.targetEl && q.kind && (L(q.targetEl, "ln-" + q.kind + ":set-loading", { loading: !1 }), (q.kind === "table" || q.kind === "list") && L(q.targetEl, "ln-" + q.kind + ":page-failed", { offset: q.offset })), _._reportReconciliationError("query", C.error || C, q);
          return;
        }
        const O = I === 401 || I === 419, P = I === 0 || I >= 500, B = I === 409 || I === 412;
        if (O) {
          _._toastFromDict("auth"), q.queued && R.queue && L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "auth" });
          return;
        }
        if (P) {
          q.queued && R.queue ? L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "retry" }) : _._toastFromDict("network");
          return;
        }
        let H = Promise.resolve();
        if (B && D === "update") {
          const z = C.data && C.data.remote ? _.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (H = _._requestStoreMutation(R, "update", { id: q.id, data: z })), _._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (H = _._requestStoreMutation(R, "delete", { id: q.tempId })), _._toastFromDict("rejected");
        q.queued && R.queue ? H.then(function() {
          L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "drop" });
        }).catch(function(z) {
          _._reportReconciliationError("deterministic-reconcile", z, q);
        }) : H.catch(function(z) {
          _._reportReconciliationError("deterministic-reconcile", z, q);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(A) {
        const C = _.findChildren(), q = C.store;
        if (!q || q.initializationError || !C.connector || _._noAutosync || q.isSyncing) return;
        (A.detail || {}).hasCache ? _._isStale() && q.forceSync() : q.forceSync();
      },
      // A (re)opened socket may have missed pushes — catch up with a delta
      // sync over whichever connector takes requests.
      socketConnected: function() {
        const A = _.findChildren(), C = A.store;
        !C || C.initializationError || !A.connector || _._noAutosync || !C.isInitialized || C.isSyncing || C.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(A) {
        _._serveData(A, "table");
      },
      reqListData: function(A) {
        _._serveData(A, "list");
      },
      reqChartData: function(A) {
        _._serveData(A, "chart");
      },
      reqOptions: function(A) {
        _._serveOptions(A);
      },
      reqStat: function(A) {
        _._serveStat(A);
      },
      refreshQuery: function() {
        _._refreshAll(null, !0);
      },
      refresh: function(A) {
        _._mutationReceipts.resolve(A.detail), _._refreshAll(null, !1);
      },
      mutationError: function(A) {
        _._mutationReceipts.reject(A.detail);
      },
      refreshSynced: function(A) {
        A.detail && A.detail.changed && _._refreshAll(A.detail.meta, !1);
      },
      searchChange: function(A) {
        A.preventDefault();
        const C = A.detail && A.detail.term != null ? A.detail.term : "";
        C !== (_.dom.getAttribute(a) || "") && _.dom.setAttribute(a, C);
      },
      filterChange: function(A) {
        A.preventDefault();
        const C = A.detail && A.detail.key;
        if (!C) return;
        const q = (A.detail.values || []).slice(), D = _._currentQuery().filters, I = D[C];
        if (I ? I.length === q.length && I.every((B, H) => B === q[H]) : !q.length) return;
        q.length ? D[C] = q : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(B) {
          D[B].forEach(function(H) {
            O.append(B, H);
          });
        });
        const P = O.toString();
        P ? _.dom.setAttribute(m, P) : _.dom.removeAttribute(m);
      },
      sortChange: function(A) {
        A.preventDefault();
        const C = A.detail && A.detail.field, q = A.detail && A.detail.direction, D = C && q && q !== "none" ? { field: C, direction: q } : null, I = _._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (_.dom.setAttribute(h, D.field), _.dom.setAttribute(r, D.direction)) : (_.dom.removeAttribute(h), _.dom.removeAttribute(r)));
      }
    }, _.dom.addEventListener("ln-data-store:request-remote-sync", _._handlers.sync), _.dom.addEventListener("ln-data-store:request-page", _._handlers.requestPage), _.dom.addEventListener("ln-data-coordinator:request-create", _._handlers.reqCreate), _.dom.addEventListener("ln-data-coordinator:request-update", _._handlers.reqUpdate), _.dom.addEventListener("ln-data-coordinator:request-delete", _._handlers.reqDelete), _.dom.addEventListener("ln-data-coordinator:request-bulk-delete", _._handlers.reqBulkDelete), _.dom.addEventListener("ln-api-queue:send", _._handlers.queueSend), _.dom.addEventListener("ln-api-queue:failed", _._handlers.queueFailed), _.dom.addEventListener("ln-data-store:initialized", _._handlers.storeInitialized), _.dom.addEventListener("ln-websocket-connector:connected", _._handlers.socketConnected), document.addEventListener("submit", _._handlers.formSubmit), l.forEach(function(A) {
      _.dom.addEventListener(A + ":fetched", _._handlers.connFetched), _.dom.addEventListener(A + ":created", _._handlers.connCreated), _.dom.addEventListener(A + ":updated", _._handlers.connUpdated), _.dom.addEventListener(A + ":deleted", _._handlers.connDeleted), _.dom.addEventListener(A + ":bulk-deleted", _._handlers.connBulkDeleted), _.dom.addEventListener(A + ":error", _._handlers.connError);
    }), document.addEventListener("ln-table:request-data", _._handlers.reqTableData), document.addEventListener("ln-list:request-data", _._handlers.reqListData), document.addEventListener("ln-chart:request-data", _._handlers.reqChartData), document.addEventListener("ln-options:request-data", _._handlers.reqOptions), document.addEventListener("ln-stat:request-count", _._handlers.reqStat), _.dom.addEventListener("ln-data-store:ready", _._handlers.refresh), _.dom.addEventListener("ln-data-store:created", _._handlers.refresh), _.dom.addEventListener("ln-data-store:updated", _._handlers.refresh), _.dom.addEventListener("ln-data-store:deleted", _._handlers.refresh), _.dom.addEventListener("ln-data-store:mutation-error", _._handlers.mutationError), _.dom.addEventListener("ln-data-store:synced", _._handlers.refreshSynced), _.dom.addEventListener("ln-data-store:query-changed", _._handlers.refreshQuery), _.dom.addEventListener("ln-search:change", _._handlers.searchChange), _.dom.addEventListener("ln-filter:change", _._handlers.filterChange), _.dom.addEventListener("ln-sort:change", _._handlers.sortChange);
  }
  y.prototype._owns = function(_) {
    return !!_ && _ === this._name;
  }, y.prototype._currentQuery = function() {
    const _ = this.dom.getAttribute(h), A = this.dom.getAttribute(r), C = new URLSearchParams(this.dom.getAttribute(m) || ""), q = {};
    for (const D of new Set(C.keys())) q[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(a) || "",
      filters: q,
      sort: _ && A ? { field: _, direction: A } : null
    };
  }, y.prototype._nextQueryGen = function(_) {
    const A = (this._queryGens.get(_) || 0) + 1;
    return this._queryGens.set(_, A), A;
  }, y.prototype._isCurrentGen = function(_, A) {
    return this._queryGens.get(_) === A;
  }, y.prototype._serveData = function(_, A) {
    const C = _.target, q = A === "table" ? "data-ln-table-source" : A === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(q);
    if (!D || !this._owns(D)) return;
    const I = _.detail || {}, R = Ur(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Bt(B, O.connector), Q = rn(R, P._currentQuery());
      if (z === "remote") {
        const V = P._nextQueryGen(C);
        L(C, "ln-" + A + ":set-loading", { loading: !0 }), L(O.connectorEl, g(O.connectorEl) + ":request-query", {
          query: Q,
          meta: { targetEl: C, kind: A, offset: Q.offset, limit: Q.limit, queryGen: V }
        });
        return;
      }
      if (z !== "store") {
        L(C, "ln-" + A + ":set-loading", { loading: !1 });
        return;
      }
      const Y = Qt(B, O.connector, z), X = Y ? P._nextQueryGen(C) : null;
      return Y && L(O.connectorEl, g(O.connectorEl) + ":request-query", {
        query: Q,
        meta: { targetEl: C, kind: A, offset: Q.offset, limit: Q.limit, queryGen: X }
      }), B.getAll(Q).then(function(V) {
        if (P._destroyed || !P._boundDelivered || Y && !P._isCurrentGen(C, X)) return;
        const G = {
          data: V.data,
          total: V.total,
          filtered: V.filtered,
          offset: I.offset !== void 0 ? I.offset : V.offset,
          queryGen: I.queryGen !== void 0 ? I.queryGen : V.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: Y || V.provisional === !0
        };
        L(C, "ln-" + A + ":set-data", G), P._boundDelivered.set(C, !0);
      });
    }).catch(function(z) {
      P._destroyed || (L(C, "ln-" + A + ":set-loading", { loading: !1 }), L(P.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: A,
        store: D,
        target: C,
        error: z
      }));
    });
  }, y.prototype._serveOptions = function(_) {
    const A = _.target, C = A.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const q = this.findChildren(), D = q.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Bt(D, q.connector);
      if (O === "remote") {
        const H = R._nextQueryGen(A);
        L(q.connectorEl, g(q.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: A, kind: "options", queryGen: H }
        });
        return;
      }
      if (O !== "store") return;
      const P = Qt(D, q.connector, O), B = P ? R._nextQueryGen(A) : null;
      return P && L(q.connectorEl, g(q.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: A, kind: "options", queryGen: B }
      }), D.getAll({}).then(function(H) {
        R._destroyed || P && !R._isCurrentGen(A, B) || L(A, "ln-options:set-data", { data: H.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: A, kind: "options" });
    });
  }, y.prototype._serveStat = function(_) {
    const A = _.target, C = A.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const q = _.detail && _.detail.filters ? _.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = q && Object.keys(q).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), H = B ? "remote" : Bt(I, D.connector);
      if (H === "remote") {
        const Y = O._nextQueryGen(A);
        L(D.connectorEl, g(D.connectorEl) + ":request-query", {
          query: { filters: q },
          meta: { targetEl: A, kind: "stat", queryGen: Y }
        });
        return;
      }
      if (H !== "store") return;
      const z = !B && Qt(I, D.connector, H), Q = z ? O._nextQueryGen(A) : null;
      return z && L(D.connectorEl, g(D.connectorEl) + ":request-query", {
        query: { filters: q },
        meta: { targetEl: A, kind: "stat", queryGen: Q }
      }), I.count(q).then(function(Y) {
        O._destroyed || z && !O._isCurrentGen(A, Q) || L(A, "ln-stat:set-count", { count: Y });
      });
    }).catch(function(P) {
      O._destroyed || O._reportReconciliationError("stat-query", P, { targetEl: A, kind: "stat" });
    });
  }, y.prototype._refreshAll = function(_, A) {
    const C = this, q = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let D = 0; D < q.length; D++) {
      const I = q[D];
      let R, O;
      if (I.hasAttribute("data-ln-table-source") ? (R = I.getAttribute("data-ln-table-source"), O = "table") : I.hasAttribute("data-ln-list-source") ? (R = I.getAttribute("data-ln-list-source"), O = "list") : I.hasAttribute("data-ln-chart-source") ? (R = I.getAttribute("data-ln-chart-source"), O = "chart") : I.hasAttribute("data-ln-options") ? (R = I.getAttribute("data-ln-options"), O = "options") : I.hasAttribute("data-ln-stat") && (R = I.getAttribute("data-ln-stat"), O = "stat"), !C._owns(R)) continue;
      const P = C.findChildren(), B = P.store;
      if (O === "table" || O === "list") {
        const H = O === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (I.hasAttribute(H)) {
          L(I, "ln-" + O + (A ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (O === "table" || O === "list" || O === "chart") {
        const H = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = rn(H, C._currentQuery());
        if (Bt(B, P.connector) === "remote") {
          const X = C._nextQueryGen(I);
          L(I, "ln-" + O + ":set-loading", { loading: !0 }), L(P.connectorEl, g(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
          });
          continue;
        }
        const Q = Qt(B, P.connector, Bt(B, P.connector)), Y = Q ? C._nextQueryGen(I) : null;
        Q && L(P.connectorEl, g(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
        }), (function(X, V, G, ft) {
          B.getAll(z).then(function(bt) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(X, ft)) return;
            const ae = {
              data: bt.data,
              total: _ && _.total !== void 0 ? _.total : bt.total,
              filtered: _ && _.filtered !== void 0 ? _.filtered : bt.filtered,
              offset: bt.offset !== void 0 ? bt.offset : _ && _.offset !== void 0 ? _.offset : H.offset,
              queryGen: bt.queryGen !== void 0 ? bt.queryGen : _ && _.queryGen !== void 0 ? _.queryGen : H.queryGen
            };
            L(X, "ln-" + V + ":set-loading", { loading: !1 }), L(X, "ln-" + V + ":set-data", ae), C._boundDelivered.set(X, !0);
          }).catch(function() {
          });
        })(I, O, Q, Y);
      } else if (O === "options")
        (function(H) {
          B.getAll({}).then(function(z) {
            C._destroyed || L(H, "ln-options:set-data", { data: z.data });
          }).catch(function() {
          });
        })(I);
      else if (O === "stat") {
        const H = I.getAttribute("data-ln-stat-filter");
        let z = null;
        if (H) {
          const Q = H.indexOf(":");
          if (Q !== -1) {
            const Y = H.slice(0, Q).trim(), X = H.slice(Q + 1).trim();
            Y && (z = {}, z[Y] = [X]);
          }
        }
        (function(Q, Y) {
          B.count(Y).then(function(X) {
            C._destroyed || L(Q, "ln-stat:set-count", { count: X });
          }).catch(function() {
          });
        })(I, z);
      }
    }
  }, y.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const _ = this;
    _._handlers && (_.dom.removeEventListener("ln-data-store:request-remote-sync", _._handlers.sync), _.dom.removeEventListener("ln-data-store:request-page", _._handlers.requestPage), _.dom.removeEventListener("ln-data-coordinator:request-create", _._handlers.reqCreate), _.dom.removeEventListener("ln-data-coordinator:request-update", _._handlers.reqUpdate), _.dom.removeEventListener("ln-data-coordinator:request-delete", _._handlers.reqDelete), _.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", _._handlers.reqBulkDelete), _.dom.removeEventListener("ln-api-queue:send", _._handlers.queueSend), _.dom.removeEventListener("ln-api-queue:failed", _._handlers.queueFailed), _.dom.removeEventListener("ln-data-store:initialized", _._handlers.storeInitialized), _.dom.removeEventListener("ln-websocket-connector:connected", _._handlers.socketConnected), document.removeEventListener("submit", _._handlers.formSubmit), l.forEach(function(A) {
      _.dom.removeEventListener(A + ":fetched", _._handlers.connFetched), _.dom.removeEventListener(A + ":created", _._handlers.connCreated), _.dom.removeEventListener(A + ":updated", _._handlers.connUpdated), _.dom.removeEventListener(A + ":deleted", _._handlers.connDeleted), _.dom.removeEventListener(A + ":bulk-deleted", _._handlers.connBulkDeleted), _.dom.removeEventListener(A + ":error", _._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", _._handlers.reqTableData), document.removeEventListener("ln-list:request-data", _._handlers.reqListData), document.removeEventListener("ln-chart:request-data", _._handlers.reqChartData), document.removeEventListener("ln-options:request-data", _._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", _._handlers.reqStat), _.dom.removeEventListener("ln-data-store:ready", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:created", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:updated", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:deleted", _._handlers.refresh), _.dom.removeEventListener("ln-data-store:mutation-error", _._handlers.mutationError), _.dom.removeEventListener("ln-data-store:synced", _._handlers.refreshSynced), _.dom.removeEventListener("ln-data-store:query-changed", _._handlers.refreshQuery), _.dom.removeEventListener("ln-search:change", _._handlers.searchChange), _.dom.removeEventListener("ln-filter:change", _._handlers.filterChange), _.dom.removeEventListener("ln-sort:change", _._handlers.sortChange), _._handlers = null), _._boundQueries = null, _._boundDelivered = null, _._queryGens = null, _._queueQueryRefresh = null, _._mutationReceipts.close(new Error("Data coordinator destroyed")), _._mutationReceipts = null, u.delete(this), b(), delete this.dom[e];
  }, j(t, e, y, "ln-data-coordinator", {
    attributes: o
  });
})();
const zr = "ln_api_queue", Kr = 2, rt = "outbox", lt = "_queue_meta";
function ut(t, e) {
  return t.error || new Error(e);
}
function Rt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function on(t) {
  return "seq:" + t;
}
function Xt(t) {
  return "paused:" + t;
}
function sn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function jr(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function Vr(t, e, i, a) {
  const m = /* @__PURE__ */ new Map(), h = [], r = [];
  for (const c of t || [])
    m.has(c.chainKey) || m.set(c.chainKey, []), m.get(c.chainKey).push(c);
  return m.forEach((c, d) => {
    c.sort((o, s) => o.seq - s.seq);
    const n = c[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > a) {
        r.push({ chainKey: d, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > a) {
        r.push({ chainKey: d, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = a + i, n.updatedAt = a, h.push(n);
    }
  }), { entries: h, wakeups: r };
}
function Wr(t, e, i, a, m) {
  const h = [], r = [];
  for (const c of t || []) {
    if (c.entryId === e) {
      r.push(c.entryId);
      continue;
    }
    c.chainKey === i && (c.chainKey = a, c.targetId === i && (c.targetId = a), c.meta && c.meta.id === i && (c.meta.id = a), c.meta && typeof c.meta.action == "string" && (c.meta.action = jr(c.meta.action, i, a)), c.updatedAt = m, h.push(c));
  }
  return { changed: h, deleted: r };
}
class Gr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || zr, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const a = this.indexedDB.open(this.dbName, Kr);
      a.onupgradeneeded = (m) => {
        const h = m.target.result;
        let r;
        h.objectStoreNames.contains(rt) ? r = m.target.transaction.objectStore(rt) : r = h.createObjectStore(rt, { keyPath: "entryId" }), r.indexNames.contains("by_scope_chain") || r.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), r.indexNames.contains("by_scope_seq") || r.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), h.objectStoreNames.contains(lt) || h.createObjectStore(lt, { keyPath: "key" });
      }, a.onerror = () => i(ut(a, "Queue database open failed")), a.onsuccess = (m) => {
        this._db = m.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const a = this.indexedDB.deleteDatabase(this.dbName);
      a.onsuccess = () => e(), a.onerror = () => i(ut(a, "Queue database delete failed")), a.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((a, m) => {
      const r = i.transaction(rt, "readonly").objectStore(rt).index("by_scope_seq").getAll(Rt(this.keyRange, e));
      r.onsuccess = () => a(r.result || []), r.onerror = () => m(ut(r, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((a) => a ? new Promise((m, h) => {
      const r = a.transaction([lt, rt], "readwrite"), c = r.objectStore(lt), d = r.objectStore(rt), n = on(e);
      let o = null;
      const s = (w) => {
        const v = w + 1;
        o = {
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
        }, c.put({ key: n, value: v }), d.put(o);
      }, u = c.get(n);
      u.onerror = () => h(ut(u, "Queue sequence read failed")), u.onsuccess = () => {
        const w = u.result;
        if (w && typeof w.value == "number") {
          s(w.value);
          return;
        }
        const v = d.index("by_scope_seq").getAll(Rt(this.keyRange, e));
        v.onerror = () => h(ut(v, "Queue sequence migration failed")), v.onsuccess = () => {
          const E = (v.result || []).reduce((S, p) => Math.max(S, p.seq || 0), 0);
          s(E);
        };
      }, r.oncomplete = () => m(o), r.onerror = () => h(r.error || new Error("Queue enqueue transaction failed")), r.onabort = () => h(r.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, a) {
    return this.open().then((m) => m ? new Promise((h, r) => {
      const c = m.transaction(rt, "readwrite"), d = c.objectStore(rt), n = d.index("by_scope_seq").getAll(Rt(this.keyRange, e)), o = this.now();
      let s = { entries: [], wakeups: [] };
      n.onerror = () => r(ut(n, "Queue claim read failed")), n.onsuccess = () => {
        s = Vr(n.result || [], i, a, o);
        for (const u of s.entries) d.put(u);
      }, c.oncomplete = () => h(s), c.onerror = () => r(c.error || new Error("Queue claim transaction failed")), c.onabort = () => r(c.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (a, m) => (m.delete(a.entryId), { status: "acked", entry: a }));
  }
  nack(e, i, a, m) {
    m = m || {};
    const h = m.maxAttempts || 8, r = m.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((c) => c ? new Promise((d, n) => {
      const o = c.transaction([rt, lt], "readwrite"), s = o.objectStore(rt), u = o.objectStore(lt), w = s.get(i);
      let v = null;
      w.onerror = () => n(ut(w, "Queue nack read failed")), w.onsuccess = () => {
        const E = w.result;
        if (!(!E || E.scope !== e)) {
          if (a === "drop") {
            s.delete(E.entryId), v = { status: "dropped", entry: E };
            return;
          }
          if (sn(E), E.updatedAt = this.now(), a === "auth") {
            E.status = "pending", s.put(E), u.put({ key: Xt(e), value: "auth" }), v = { status: "auth", entry: E };
            return;
          }
          if (a === "retry") {
            if (E.attempts = (E.attempts || 0) + 1, E.attempts >= h) {
              E.status = "failed", E.nextAttemptAt = 0, s.put(E), v = { status: "failed", entry: E };
              return;
            }
            const S = r[Math.min(E.attempts - 1, r.length - 1)];
            E.status = "pending", E.nextAttemptAt = this.now() + S, s.put(E), v = { status: "retry", entry: E, delay: S };
          }
        }
      }, o.oncomplete = () => d(v), o.onerror = () => n(o.error || new Error("Queue nack transaction failed")), o.onabort = () => n(o.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, a) {
    return this._remapTransaction(e, null, i, a);
  }
  resolveCreate(e, i, a, m) {
    return this._remapTransaction(e, i, a, m);
  }
  _remapTransaction(e, i, a, m) {
    return this.open().then((h) => h ? new Promise((r, c) => {
      const d = h.transaction(rt, "readwrite"), n = d.objectStore(rt), o = n.index("by_scope_seq").getAll(Rt(this.keyRange, e));
      let s = { changed: [], deleted: [] };
      o.onerror = () => c(ut(o, "Queue remap read failed")), o.onsuccess = () => {
        s = Wr(o.result || [], i, a, m, this.now());
        for (const u of s.deleted) n.delete(u);
        for (const u of s.changed) n.put(u);
      }, d.oncomplete = () => r(s.changed), d.onerror = () => c(d.error || new Error("Queue remap transaction failed")), d.onabort = () => c(d.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((a, m) => {
      const h = i.transaction(rt, "readwrite"), r = h.objectStore(rt), c = r.index("by_scope_seq").getAll(Rt(this.keyRange, e));
      let d = 0;
      c.onerror = () => m(ut(c, "Queue failed-entry read failed")), c.onsuccess = () => {
        for (const n of c.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), sn(n), r.put(n), d++);
      }, h.oncomplete = () => a(d), h.onerror = () => m(h.error || new Error("Queue failed-entry reset failed")), h.onabort = () => m(h.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((a, m) => {
      const r = i.transaction(lt, "readonly").objectStore(lt).get(Xt(e));
      r.onsuccess = () => {
        const c = r.result ? r.result.value : !1;
        a(c || !1);
      }, r.onerror = () => m(ut(r, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((a) => {
      if (a)
        return new Promise((m, h) => {
          const r = a.transaction(lt, "readwrite"), c = typeof i == "string" ? i : i ? "manual" : !1;
          r.objectStore(lt).put({ key: Xt(e), value: c }), r.oncomplete = () => m(), r.onerror = () => h(r.error || new Error("Queue pause-state write failed")), r.onabort = () => h(r.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((a, m) => {
          const h = i.transaction([rt, lt], "readwrite"), c = h.objectStore(rt).index("by_scope_seq").openCursor(Rt(this.keyRange, e));
          c.onsuccess = (d) => {
            const n = d.target.result;
            n && (n.delete(), n.continue());
          }, c.onerror = () => m(ut(c, "Queue clear failed")), h.objectStore(lt).delete(on(e)), h.objectStore(lt).delete(Xt(e)), h.oncomplete = () => a(), h.onerror = () => m(h.error || new Error("Queue clear transaction failed")), h.onabort = () => m(h.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, a) {
    return this.open().then((m) => m ? new Promise((h, r) => {
      const c = m.transaction(rt, "readwrite"), d = c.objectStore(rt), n = d.get(i);
      let o = null;
      n.onerror = () => r(ut(n, "Queue entry read failed")), n.onsuccess = () => {
        const s = n.result;
        !s || s.scope !== e || (o = a(s, d));
      }, c.oncomplete = () => h(o), c.onerror = () => r(c.error || new Error("Queue entry transaction failed")), c.onabort = () => r(c.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], a = 8, m = 6e4;
  if (window[e] !== void 0) return;
  function h(o) {
    const s = o[e];
    s && s._drain();
  }
  const r = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: h, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  };
  function c() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
        const u = Math.random() * 16 | 0;
        return (s === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const d = new Gr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: c
  });
  function n(o) {
    this.dom = o, o[e] = this;
    const s = o.closest("[data-ln-data-coordinator]");
    this.scope = o.id || (s ? s.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = c(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return d.open().then((w) => w ? d.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (u._paused = !!w, u._paused) {
        const v = typeof w == "string" ? w : "auth";
        L(u.dom, "ln-api-queue:paused", { reason: v, restored: !0 });
      }
      return u._emitPendingCount();
    }).then(() => u._drain()).catch((w) => {
      console.error("[ln-api-queue] Initialization failed:", w), L(u.dom, "ln-api-queue:error", { operation: "initialize", error: w });
    }), this;
  }
  n.prototype._isOnline = function() {
    const o = this.dom.getAttribute("data-ln-api-queue-online");
    return o === "true" ? !0 : o === "false" ? !1 : navigator.onLine;
  }, n.prototype._emitPendingCount = function() {
    const o = this;
    return d.allForScope(o.scope).then((s) => (L(o.dom, "ln-api-queue:pending-count", { count: s.length, scope: o.scope }), s.length === 0 && L(o.dom, "ln-api-queue:drained", { scope: o.scope }), s));
  }, n.prototype._clearTimer = function(o) {
    const s = this._timers.get(o);
    s && (clearTimeout(s), this._timers.delete(o));
  }, n.prototype._scheduleTimer = function(o, s) {
    const u = Math.max(0, s), w = this._timers.get(o);
    w && clearTimeout(w);
    const v = this, E = setTimeout(() => {
      v._timers.delete(o), v._drain();
    }, u);
    this._timers.set(o, E);
  }, n.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = d.claimReady(o.scope, o._workerId, m).then((s) => {
      for (const u of s.wakeups)
        o._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of s.entries)
        o._clearTimer(u.chainKey), L(o.dom, "ln-api-queue:send", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          op: u.op,
          targetId: u.targetId,
          payload: u.payload,
          expectedVersion: u.expectedVersion,
          idempotencyKey: u.entryId,
          meta: u.meta
        });
    }).catch((s) => {
      console.error("[ln-api-queue] Drain failed:", s), L(o.dom, "ln-api-queue:error", { operation: "drain", error: s });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, n.prototype._onEnqueue = function(o) {
    const s = this;
    return d.enqueue(s.scope, o.detail || {}).then((u) => {
      if (u)
        return s._emitPendingCount().then((w) => (L(s.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: w.length
        }), s._drain()));
    }).catch((u) => {
      L(s.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, n.prototype._onAck = function(o) {
    const s = this, u = o.detail || {};
    return d.ack(s.scope, u.entryId).then(() => s._emitPendingCount()).then(() => s._drain()).catch((w) => {
      L(s.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onNack = function(o) {
    const s = this, u = o.detail || {};
    return d.nack(s.scope, u.entryId, u.reason, {
      maxAttempts: a,
      backoff: i
    }).then((w) => {
      if (w)
        return w.status === "failed" ? L(s.dom, "ln-api-queue:failed", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey,
          attempts: w.entry.attempts
        }) : w.status === "retry" ? s._scheduleTimer(w.entry.chainKey, w.delay) : w.status === "auth" && (s._paused = !0, L(s.dom, "ln-api-queue:paused", { reason: "auth" }), L(s.dom, "ln-api-queue:auth-required", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey
        })), s._emitPendingCount().then(() => {
          if (w.status === "dropped") return s._drain();
        });
    }).catch((w) => {
      L(s.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onRemap = function(o) {
    const s = this, u = o.detail || {};
    return d.remap(s.scope, u.oldKey, u.newId).catch((w) => {
      L(s.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(o) {
    const s = this, u = o.detail || {};
    return d.resolveCreate(s.scope, u.entryId, u.oldKey, u.newId).then(() => s._emitPendingCount()).then(() => s._drain()).catch((w) => {
      L(s.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const o = this;
    return d.setPaused(o.scope, !1).then(() => (o._paused = !1, L(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((s) => {
      L(o.dom, "ln-api-queue:error", { operation: "resume", error: s });
    });
  }, n.prototype._onPause = function() {
    const o = this;
    return d.setPaused(o.scope, "manual").then(() => {
      o._paused = !0, L(o.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((s) => {
      L(o.dom, "ln-api-queue:error", { operation: "pause", error: s });
    });
  }, n.prototype._onDrain = function() {
    const o = this;
    return d.resetFailed(o.scope).then(() => {
      const s = o._drainPromise;
      return s ? s.then(() => o._drain()) : o._drain();
    }).catch((s) => {
      L(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: s });
    });
  }, n.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((s) => clearTimeout(s)), o._timers.clear(), d.clear(o.scope).then(() => {
      o._paused = !1, L(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), L(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((s) => {
      L(o.dom, "ln-api-queue:error", { operation: "clear", error: s });
    });
  }, n.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (s) => o._onEnqueue(s),
      ack: (s) => o._onAck(s),
      nack: (s) => o._onNack(s),
      remap: (s) => o._onRemap(s),
      resolveCreate: (s) => o._onResolveCreate(s),
      resume: () => o._onResume(),
      pause: () => o._onPause(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((s) => clearTimeout(s)), o._timers.clear(), delete o.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: r
  });
})();
function oi(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Ot(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function $r(t, e, i) {
  const a = oi(t);
  return a === null || a < 0 ? 0 : Math.min(a, Math.min(e, i) / 2);
}
function Qr(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function Xr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function Yr(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, a = e.xField || "label", m = e.yField || "value", h = e.includeZero !== !1, r = $r(e.padding, i.width, i.height), c = Array.isArray(t) ? t : [], d = [];
  for (let l = 0; l < c.length; l++) {
    const g = c[l] || {}, y = oi(g[m]);
    y !== null && d.push({
      record: g,
      sourceIndex: l,
      label: g[a] == null ? String(l + 1) : String(g[a]),
      value: y
    });
  }
  if (d.length === 0)
    return {
      points: [],
      linePoints: "",
      areaPoints: "",
      count: 0,
      min: null,
      max: null,
      domainMin: 0,
      domainMax: 1,
      baselineY: i.y + i.height - r
    };
  let n = d[0].value, o = d[0].value;
  for (let l = 1; l < d.length; l++)
    d[l].value < n && (n = d[l].value), d[l].value > o && (o = d[l].value);
  let s = n, u = o;
  h && (s = Math.min(0, s), u = Math.max(0, u)), s === u && (u === 0 ? u = 1 : u > 0 ? s = 0 : u = 0);
  const w = Math.max(1, i.width - r * 2), v = Math.max(1, i.height - r * 2), E = u - s, S = i.y + i.height - r - (0 - s) / E * v, p = [];
  for (let l = 0; l < d.length; l++) {
    const g = d[l], y = d.length === 1 ? 0.5 : l / (d.length - 1), T = i.x + r + y * w, _ = i.y + i.height - r - (g.value - s) / E * v;
    p.push({
      record: g.record,
      sourceIndex: g.sourceIndex,
      label: g.label,
      value: g.value,
      x: T,
      y: _,
      pointString: Ot(T) + "," + Ot(_)
    });
  }
  const b = p.map((l) => l.pointString).join(" ");
  let f = "";
  if (p.length > 0) {
    const l = p[0], g = p[p.length - 1], y = Ot(l.x) + "," + Ot(S), T = Ot(g.x) + "," + Ot(S);
    f = y + " " + b + " " + T;
  }
  return {
    points: p,
    linePoints: b,
    areaPoints: f,
    count: p.length,
    min: n,
    max: o,
    domainMin: s,
    domainMax: u,
    baselineY: S
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function a(n) {
    const o = n[e];
    o && o.requestData();
  }
  function m(n) {
    const o = n[e];
    o && o._render();
  }
  const h = {
    "data-ln-chart": { prop: "name", type: "string", read: $, fallback: "", effect: m, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: a, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: a, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: m, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: m, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: m, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: m, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: m, description: "Forces Y axis scale to start at zero" }
  }, r = et(h);
  function c(n, o) {
    n && (n.textContent = o);
  }
  function d(n) {
    this.dom = n, tt(this, n, r), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const o = this;
    return this._onSetData = function(s) {
      const u = s.detail || {};
      o._data = Array.isArray(u.data) ? u.data : [], o.isLoaded = !0, o._setLoading(!1), o._render();
    }, this._onSetLoading = function(s) {
      o._setLoading(!!(s.detail && s.detail.loading));
    }, this._onRefresh = function() {
      o.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  d.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), o = n === null ? NaN : Number(n), s = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(o) && o >= 0 ? o : 16,
      type: s === "area" || s === "polygon" ? "area" : "line",
      viewBox: this.plot && Qr(this.plot.getAttribute("viewBox")) || i
    };
  }, d.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, d.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const o = this.name + "-label", s = '[data-ln-template="' + o + '"]';
    if (!this.dom.querySelector(s) && !document.querySelector(s)) return;
    const u = Ct(this.dom, o, "ln-chart");
    if (!u) return;
    const w = it(this.dom);
    for (const v of n.points) {
      const E = u.cloneNode(!0);
      Vt(E, {
        label: v.label,
        value: ct(v.value, w)
      }), this.labels.appendChild(E);
    }
  }, d.prototype._render = function() {
    const n = this._readOptions(), o = Yr(this._data, n);
    this.model = o, this.line && (this.line.setAttribute("points", o.linePoints), this.line.toggleAttribute("hidden", o.count === 0)), this.area && (this.area.setAttribute("points", o.areaPoints), this.area.toggleAttribute("hidden", o.count === 0 || n.type !== "area"));
    const s = o.count === 0;
    this.dom.classList.toggle("ln-chart--empty", s), this.empty && this.empty.toggleAttribute("hidden", !s);
    const u = it(this.dom);
    c(this.minimum, ct(o.min, u)), c(this.maximum, ct(o.max, u)), c(this.count, ct(o.count, u)), this._renderLabels(o), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: o.count,
      min: o.min,
      max: o.max
    });
  }, d.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: Xr(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, d.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, j(t, e, d, "ln-chart", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-options": { prop: "_storeName", type: "string", read: $, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: $, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: $, fallback: "name", description: "Field name used for option visible label text" }
  }, a = et(i);
  function m(h) {
    this.dom = h, tt(this, h, a);
    const r = this;
    return this._onSetData = function(c) {
      r._rebuild(c.detail.data || []);
    }, h.addEventListener("ln-options:set-data", this._onSetData), L(h, "ln-options:request-data", { options: this._storeName }), this;
  }
  m.prototype._rebuild = function(h) {
    const r = this.dom, c = this._valueField, d = this._labelField, n = r.value, o = r.querySelectorAll("option");
    for (let u = o.length - 1; u >= 0; u--)
      o[u].value !== "" && r.removeChild(o[u]);
    for (let u = 0; u < h.length; u++) {
      const w = h[u], v = document.createElement("option");
      v.value = String(w[c]), v.textContent = w[d] != null ? w[d] : "", r.appendChild(v);
    }
    const s = r.options;
    for (let u = 0; u < s.length; u++)
      if (s[u].value === n) {
        r.value = n;
        break;
      }
  }, m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, m, "ln-options", {
    attributes: i
  });
})();
function Jr(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), a = t.slice(e + 1).trim();
  if (!i) return null;
  const m = {};
  return m[i] = [a], m;
}
function Zr(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: $, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: $, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, a = et(i);
  function m(h) {
    return this.dom = h, tt(this, h, a), this._onSetCount = function(r) {
      h.textContent = Zr(r.detail && r.detail.count), h.classList.remove("is-loading");
    }, h.addEventListener("ln-stat:set-count", this._onSetCount), L(h, "ln-stat:request-count", {
      stat: this._storeName,
      filters: Jr(this._filterRaw)
    }), this;
  }
  m.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, m, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", a = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  let h = null;
  const r = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), c = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), d = "lni:", n = "lni:v", o = "1";
  function s() {
    try {
      if (localStorage.getItem(n) !== o) {
        for (let b = localStorage.length - 1; b >= 0; b--) {
          const f = localStorage.key(b);
          f && f.indexOf(d) === 0 && localStorage.removeItem(f);
        }
        localStorage.setItem(n, o);
      }
    } catch {
    }
  }
  s();
  function u() {
    return h || (h = document.getElementById(t), h || (h = document.createElementNS("http://www.w3.org/2000/svg", "svg"), h.id = t, h.setAttribute("hidden", ""), h.setAttribute("aria-hidden", "true"), h.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(h, document.body.firstChild))), h;
  }
  function w(b) {
    return b.indexOf(i) === 0 ? c + "/" + b.slice(i.length) + ".svg" : r + "/" + b.slice(e.length) + ".svg";
  }
  function v(b, f) {
    const l = f.match(/viewBox="([^"]+)"/), g = l ? l[1] : "0 0 24 24", y = f.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = y ? y[1].trim() : "", _ = f.match(/<svg([^>]*)>/i), A = _ ? _[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = b, C.setAttribute("viewBox", g), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const D = A.match(new RegExp(q + '="([^"]*)"'));
      D && C.setAttribute(q, D[1]);
    }), C.innerHTML = T, u().querySelector("defs").appendChild(C);
  }
  function E(b) {
    if (a.has(b) || m.has(b)) return;
    if (b.indexOf(i) === 0 && !c) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", b);
      return;
    }
    const f = b.slice(1);
    try {
      const g = localStorage.getItem(d + f);
      if (g) {
        v(f, g), a.add(b);
        return;
      }
    } catch {
    }
    m.add(b);
    const l = w(b);
    fetch(l).then(function(g) {
      if (!g.ok) throw new Error(g.status);
      return g.text();
    }).then(function(g) {
      v(f, g), a.add(b), m.delete(b);
      try {
        localStorage.setItem(d + f, g);
      } catch {
      }
    }).catch(function(g) {
      console.error("[ln-icon] Fetch failed for:", f, g), m.delete(b);
    });
  }
  function S(b) {
    const f = 'use[href^="' + e + '"], use[href^="' + i + '"]', l = b.querySelectorAll ? b.querySelectorAll(f) : [];
    if (b.matches && b.matches(f)) {
      const g = b.getAttribute("href");
      g && E(g);
    }
    Array.prototype.forEach.call(l, function(g) {
      const y = g.getAttribute("href");
      y && E(y);
    });
  }
  function p() {
    S(document), new MutationObserver(function(b) {
      b.forEach(function(f) {
        if (f.type === "childList")
          f.addedNodes.forEach(function(l) {
            l.nodeType === 1 && S(l);
          });
        else if (f.type === "attributes" && f.attributeName === "href") {
          const l = f.target.getAttribute("href");
          l && (l.indexOf(e) === 0 || l.indexOf(i) === 0) && E(l);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p();
})();
const Oe = /* @__PURE__ */ new Set([
  "data-ln-accordion",
  "data-ln-ajax",
  "data-ln-api-base-url",
  "data-ln-api-connector",
  "data-ln-api-connector-query-debounce",
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
  "data-ln-couchdb-auth",
  "data-ln-couchdb-connector",
  "data-ln-couchdb-db",
  "data-ln-couchdb-headers",
  "data-ln-couchdb-url",
  "data-ln-data-coordinator",
  "data-ln-data-coordinator-dict",
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
  "data-ln-filter-value",
  "data-ln-filter-values",
  "data-ln-form",
  "data-ln-form-action-edit",
  "data-ln-form-action-method",
  "data-ln-hash",
  "data-ln-include",
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
  "data-ln-mapper",
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
  "data-ln-ui-coordinator-dict",
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
function to(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let a = 0; a <= e.length; a++) i[a] = [a];
  for (let a = 0; a <= t.length; a++) i[0][a] = a;
  for (let a = 1; a <= e.length; a++)
    for (let m = 1; m <= t.length; m++)
      e.charAt(a - 1) === t.charAt(m - 1) ? i[a][m] = i[a - 1][m - 1] : i[a][m] = Math.min(
        i[a - 1][m - 1] + 1,
        i[a][m - 1] + 1,
        i[a - 1][m] + 1
      );
  return i[e.length][t.length];
}
function eo(t, e = Oe) {
  if (e.has(t)) return null;
  let i = null, a = 1 / 0;
  for (const h of e) {
    const r = to(t, h);
    r < a && (a = r, i = h);
  }
  const m = Math.max(3, Math.floor(t.length * 0.4));
  return a <= m ? i : null;
}
function si(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function no(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], m = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (r.attributes)
      for (let c = 0; c < r.attributes.length; c++) {
        const d = r.attributes[c];
        if (d.name.startsWith("data-ln-") && d.name.endsWith("-for")) {
          const n = (d.value || "").trim();
          if (!n) {
            a.push({
              type: "id-empty",
              element: r,
              attribute: d.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${r.tagName.toLowerCase()} ${d.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + si(n)) || a.push({
            type: "id-unresolved",
            element: r,
            attribute: d.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${r.tagName.toLowerCase()} ${d.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return a;
}
function io(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], m = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (r.attributes)
      for (let c = 0; c < r.attributes.length; c++) {
        const d = r.attributes[c];
        if (d.name.startsWith("data-ln-") && (d.name.endsWith("-source") || d.name.endsWith("-store")) && d.name !== "data-ln-data-store") {
          const o = (d.value || "").trim();
          if (!o) {
            a.push({
              type: "store-empty",
              element: r,
              attribute: d.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${r.tagName.toLowerCase()} ${d.name}="">.`
            });
            continue;
          }
          const s = si(o), u = e.querySelector(`[data-ln-data-store="${s}"], [data-ln-store="${s}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(o);
          !u && !w && a.push({
            type: "store-unresolved",
            element: r,
            attribute: d.name,
            storeName: o,
            message: `[ln-debug] Unresolved store reference: <${r.tagName.toLowerCase()} ${d.name}="${o}"> targets store "${o}", but no [data-ln-data-store="${o}"] exists in the document.`
          });
        }
      }
  }
  return a;
}
function ro(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], a = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && a.unshift(e);
  const m = /* @__PURE__ */ new Map();
  for (let h = 0; h < a.length; h++) {
    const r = a[h], c = (r.getAttribute("data-ln-data-store") || "").trim();
    c && (m.has(c) || m.set(c, []), m.get(c).push(r));
  }
  for (const [h, r] of m.entries())
    r.length > 1 && i.push({
      type: "store-duplicate",
      storeName: h,
      elements: r,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${h}". Store names must be unique across the document.`
    });
  return i;
}
function oo(t = document, e = Oe) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const a = [], m = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < m.length; h++) {
    const r = m[h];
    if (r.attributes)
      for (let c = 0; c < r.attributes.length; c++) {
        const d = r.attributes[c];
        if (d.name.startsWith("data-ln-") && !e.has(d.name)) {
          const n = eo(d.name, e), o = n ? ` Did you mean "${n}"?` : "";
          a.push({
            type: "attribute-unknown",
            element: r,
            attribute: d.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${d.name}" on <${r.tagName.toLowerCase()}>.${o}`
          });
        }
      }
  }
  return a;
}
function Ce(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Oe, a = no(t), m = io(t), h = ro(t), r = oo(t, i), c = [
    ...a,
    ...m,
    ...h,
    ...r
  ];
  if (!e.silent)
    for (let d = 0; d < c.length; d++)
      console.warn(c[d].message);
  return {
    idIssues: a,
    storeIssues: m,
    uniquenessIssues: h,
    spellingIssues: r,
    total: c.length
  };
}
let Ut = null;
function Yt(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Ut && (clearTimeout(Ut), Ut = null);
  function a() {
    Ut = setTimeout(() => {
      Ut = null;
      const m = Ce(t);
      i && i(m);
    }, e);
  }
  En() > 0 ? mt(a) : a();
}
function so(t, e, i, a) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", a), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", a.oldValue, "→", a.newValue), console.groupEnd());
}
let qt = [];
function ao() {
  qt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && qt.push(document.body);
}
function ai(t) {
  if (t === window || t === document)
    return qt.indexOf(document.body) !== -1;
  for (let e = 0; e < qt.length; e++)
    if (qt[e].contains(t)) return !0;
  return !1;
}
function lo(t, e, i, a) {
  ai(i) && so(t, e, i, a);
}
function Te() {
  ao(), yi(qt.length > 0 ? lo : null, qt.length > 0 ? ai : null);
}
function an() {
  Te();
}
function co() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, gt(function() {
    Te(), Wt(["data-ln-debug"], Te);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  co();
  function a(h) {
    return this.dom = h, Yt(h.ownerDocument || document), an(), this;
  }
  a.prototype.verify = function(h, r) {
    return Ce(h || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, a.prototype.destroy = function() {
    delete this.dom[e], an();
  };
  const m = j(t, e, a, "ln-debug", {
    attributes: i,
    onInit: function(h) {
      typeof document < "u" && Yt(h && h.ownerDocument ? h.ownerDocument : document);
    },
    onSubtreeChange: function(h) {
      typeof document < "u" && Yt(h && h.ownerDocument ? h.ownerDocument : document);
    }
  });
  m.verify = function(h, r) {
    return Ce(h || document, r);
  }, m.schedule = function(h, r, c) {
    return Yt(h || document, r, c);
  };
})();
