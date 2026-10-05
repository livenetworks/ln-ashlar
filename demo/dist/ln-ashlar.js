function mn() {
  return typeof window > "u" ? !1 : window.lnDebug === !0 || window.lnCore && window.lnCore._debugSink ? !0 : typeof document < "u" && document.body ? document.body.hasAttribute("data-ln-debug") || document.body.querySelector("[data-ln-debug]") !== null : !1;
}
function Le(t) {
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
      let l = null;
      for (let p = 1; p < e.length; p++)
        if (e[p] && e[p].nodeType === 1) {
          l = e[p];
          break;
        }
      if (!Le(l))
        return;
    }
    t.apply(console, e);
  };
}
function Di(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function Ri(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function k(t, e, i) {
  const l = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: l
  }));
}
function $(t, e, i) {
  const l = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l);
  const p = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: l
  });
  return t.dispatchEvent(p), p;
}
function gn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const l = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  l[i] = t.name, k(t.dom, e, l);
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
function Wt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function xe(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Oi(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function Ie(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function Ni(t, e) {
  return !t || !document.contains(t) || Ie(t) || e && typeof t[e] != "function" ? !1 : Wt(t);
}
function _n(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function Et(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.tagName === "DATA" && t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
}
function bn(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function qe(t, e) {
  const i = !!(e && e.typed), l = e && e.exclude, p = {}, g = t.elements, r = {};
  if (i)
    for (let o = 0; o < g.length; o++) {
      const s = g[o];
      s.name && s.type === "checkbox" && !s.disabled && (r[s.name] = (r[s.name] || 0) + 1);
    }
  for (let o = 0; o < g.length; o++) {
    const s = g[o];
    if (!(!s.name || s.disabled || s.type === "file" || s.type === "submit" || s.type === "button") && !(l && s.matches && s.matches(l)))
      if (s.type === "checkbox")
        i && r[s.name] === 1 ? p[s.name] = s.checked : (p[s.name] || (p[s.name] = []), s.checked && p[s.name].push(s.value));
      else if (s.type === "radio")
        s.checked && (p[s.name] = s.value);
      else if (s.type === "select-multiple") {
        p[s.name] = [];
        for (let n = 0; n < s.options.length; n++)
          s.options[n].selected && p[s.name].push(s.options[n].value);
      } else if (i && s.type === "hidden")
        p[s.name] = s.value;
      else if (i && (s.type === "number" || s.type === "range")) {
        const n = Number(s.value);
        p[s.name] = s.value === "" || isNaN(n) ? null : n;
      } else
        p[s.name] = s.value;
  }
  return p;
}
function Mi(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function De(t, e) {
  const i = t.elements, l = [], p = {};
  for (let g = 0; g < i.length; g++) {
    const r = i[g];
    r.name && r.type === "checkbox" && (p[r.name] = (p[r.name] || 0) + 1);
  }
  for (let g = 0; g < i.length; g++) {
    const r = i[g];
    if (r.type === "file" || r.type === "submit" || r.type === "button") continue;
    const o = r.getAttribute("data-ln-fill-as") || r.name;
    if (!o || !(o in e)) continue;
    const s = e[o];
    if (r.type === "checkbox") {
      if (Array.isArray(s))
        r.checked = s.indexOf(r.value) !== -1;
      else if (p[r.name] > 1) {
        const n = String(s).split(",").map(function(u) {
          return u.trim();
        });
        r.checked = n.indexOf(r.value) !== -1;
      } else
        r.checked = Mi(s);
      l.push(r);
    } else if (r.type === "radio")
      r.checked = r.value === String(s), l.push(r);
    else if (r.type === "select-multiple") {
      if (Array.isArray(s))
        for (let n = 0; n < r.options.length; n++)
          r.options[n].selected = s.indexOf(r.options[n].value) !== -1;
      l.push(r);
    } else
      r.value = s, r.tagName === "SELECT" && s != null && r.setAttribute("data-ln-value", s), l.push(r);
  }
  return l;
}
function yn(t, e, { get: i, set: l }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(p) {
      l ? l.call(this, p, (g) => e.set.call(this, g)) : e.set.call(this, p);
    },
    configurable: !0
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.populateForm = De, window.lnCore.serializeForm = qe, window.lnCore.resolveFormMethod = bn);
function Ct(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => i === 0 ? e.replace(/\/+$/, "") : e.replace(/^\/+/, "").replace(/\/+$/, "")).filter(Boolean).join("/");
}
function Ht(t, e) {
  return Object.assign({
    "Content-Type": "application/json",
    Accept: "application/json"
  }, t, e ? { Authorization: e } : null);
}
function vn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const wn = {};
function Fi(t, e) {
  wn[t] = e;
}
function Bi(t) {
  return wn[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = Fi, window.lnCore.getDataMapper = Bi);
function J(t) {
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return i ? i.trim() : "en-US";
}
function ae() {
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
const En = {};
function An(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  En[i] = e;
}
function Rt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return En[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = An, window.lnCore.getLocaleFallback = Rt, window.lnCore.ensureLocaleObserver = ae);
const de = {};
function ie(t, e) {
  de[t] || (de[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const i = de[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Lt(t, e, i) {
  if (t) {
    const l = t.querySelector('[data-ln-template="' + e + '"]');
    if (l) return l.content.cloneNode(!0);
  }
  return ie(e, i);
}
function ut(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < i.length; r++) {
    const o = i[r], s = o.getAttribute("data-ln-field");
    e[s] != null && (o.textContent = e[s]);
  }
  const l = t.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < l.length; r++) {
    const o = l[r], s = o.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < s.length; n++) {
      const u = s[n].trim().split(":");
      if (u.length !== 2) continue;
      const h = u[0].trim(), f = u[1].trim();
      e[f] != null && o.setAttribute(h, e[f]);
    }
  }
  const p = t.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < p.length; r++) {
    const o = p[r], s = o.getAttribute("data-ln-show");
    s in e && o.classList.toggle("hidden", !e[s]);
  }
  const g = t.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < g.length; r++) {
    const o = g[r], s = o.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < s.length; n++) {
      const u = s[n].trim().split(":");
      if (u.length !== 2) continue;
      const h = u[0].trim(), f = u[1].trim();
      f in e && o.classList.toggle(h, !!e[f]);
    }
  }
  return t;
}
function Pi(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let l = 0; l < i.length; l++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[l], e ?? null), i[l].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      ut(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let i = 0; i < e.length; i++)
        e[i].textContent = "";
    }
})));
function Yt(t, e) {
  if (!t || !e) return t;
  const i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; i.nextNode(); ) {
    const g = i.currentNode;
    g.textContent.indexOf("{{") !== -1 && (g.textContent = g.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(r, o) {
        return e[o] !== void 0 ? e[o] : "";
      }
    ));
  }
  const l = function(g, r) {
    return e[r] !== void 0 ? e[r] : "";
  }, p = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && p.push(t);
  for (let g = 0; g < p.length; g++) {
    const r = p[g], o = r.attributes;
    for (let s = 0; s < o.length; s++) {
      const n = o[s];
      n.value.indexOf("{{") !== -1 && r.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, l));
    }
  }
  return t;
}
function Ui(t, e, i, l, p, g) {
  const r = {};
  for (let s = 0; s < t.children.length; s++) {
    const n = t.children[s], u = n.getAttribute("data-ln-render-key");
    u && (r[u] = n);
  }
  const o = document.createDocumentFragment();
  for (let s = 0; s < e.length; s++) {
    const n = e[s], u = String(l(n));
    let h = r[u];
    if (h)
      p(h, n, s);
    else {
      const f = ie(i, g);
      if (!f || (Yt(f, n), h = f.firstElementChild, !h)) continue;
      h.setAttribute("data-ln-render-key", u), p(h, n, s);
    }
    o.appendChild(h);
  }
  t.textContent = "", t.appendChild(o);
}
function Sn(t, e) {
  const i = {}, l = t.querySelectorAll("[" + e + "]");
  for (let p = 0; p < l.length; p++)
    i[l[p].getAttribute(e)] = l[p].textContent, l[p].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Yt, window.lnCore.fill = ut, window.lnCore.lnFill = Pi, window.lnCore.renderList = Ui);
function K(t, e, i) {
  const l = t.getAttribute(e);
  return l === null ? i : l;
}
function xt(t, e, i) {
  const l = parseInt(t.getAttribute(e), 10);
  return isNaN(l) ? i : l;
}
function It(t, e, i = !1) {
  const l = t.getAttribute(e);
  if (l === null) return !!i;
  const p = l.trim().toLowerCase();
  return !(p === "false" || p === "0");
}
function Re(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const ue = /* @__PURE__ */ new Map();
function Cn(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (ue.has(i)) return ue.get(i);
  const l = new Set(t || []), p = function(g, r) {
    const o = g.getAttribute(r);
    return o !== null && l.has(o) ? o : e;
  };
  return ue.set(i, p), p;
}
function Tn(t, e, i) {
  const l = parseFloat(t.getAttribute(e));
  return isNaN(l) ? i : l;
}
function kn(t, e, i) {
  const l = t.getAttribute(e);
  if (!l) return i;
  try {
    return JSON.parse(l);
  } catch {
    return i;
  }
}
function Ln(t, e, i, l, p) {
  if (!t || e === null) return !0;
  const g = l || "ln-component", r = t.type;
  if (r === "trigger" || r === "marker" || r === "string" || r === "list" || !r || e === "" && t.fallback !== void 0)
    return !0;
  const o = (s) => {
    p ? console.warn(s, p) : console.warn(s);
  };
  if (r === "boolean") {
    const s = e.trim().toLowerCase();
    return s !== "" && s !== "true" && s !== "false" && s !== "1" && s !== "0" ? (o(`[${g}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (r === "enum") {
    const s = t.values || [];
    return s.includes(e) ? !0 : (o(`[${g}] Invalid value "${e}" for attribute "${i}". Allowed: ${s.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (r === "integer") {
    if (!/^-?\d+$/.test(e))
      return o(`[${g}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const s = parseInt(e, 10);
    return t.min !== void 0 && s < t.min ? (o(`[${g}] Value ${s} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && s > t.max ? (o(`[${g}] Value ${s} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (r === "float")
    return isNaN(Number(e)) ? (o(`[${g}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (r === "json")
    try {
      return JSON.parse(e), !0;
    } catch (s) {
      return o(`[${g}] Invalid JSON for attribute "${i}": ${s.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function Q(t, e, i) {
  for (const l in i) {
    const [p, g, r] = i[l];
    Object.defineProperty(t, l, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return p(e, g, r);
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
    const l = t[i];
    if (!l || !l.prop) continue;
    let p = l.read;
    if (!p && l.type)
      switch (l.type) {
        case "enum":
          p = Cn(l.values, l.fallback);
          break;
        case "integer":
          p = xt;
          break;
        case "float":
          p = Tn;
          break;
        case "boolean":
          p = It;
          break;
        case "list":
          p = Re;
          break;
        case "json":
          p = kn;
          break;
        case "string":
        default:
          p = K;
          break;
      }
    p || (p = K), e[l.prop] = [p, i, l.fallback];
  }
  return e;
}
function Hi(t) {
  const e = {};
  for (const i in t) {
    const l = t[i];
    l && l.effect && (e[i] = l.effect);
  }
  return Object.keys(e).length ? e : null;
}
function zi(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.defineAttrs = Q, window.lnCore.attrSpec = Y, window.lnCore.attrStr = K, window.lnCore.attrInt = xt, window.lnCore.attrBool = It, window.lnCore.attrList = Re, window.lnCore.attrEnum = Cn, window.lnCore.attrFloat = Tn, window.lnCore.attrJson = kn);
function Oe(t, e, i, l) {
  if (t.nodeType !== 1) return;
  const g = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", r = Array.from(t.querySelectorAll(g));
  t.matches && t.matches(g) && r.push(t);
  for (const o of r)
    if (!o[i]) {
      window.lnCore._persistSink && o.hasAttribute("data-ln-persist") && window.lnCore._persistSink(o, e);
      try {
        o[i] = new l(o);
      } catch (s) {
        console.error("[" + i + "] init failed", o, s);
      }
    }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Ki() {
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
function xn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function At(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function In() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function qn(t) {
  const e = In(), i = t.observed || [];
  for (let l = 0; l < i.length; l++) {
    const p = i[l];
    e.byAttr.has(p) || e.byAttr.set(p, []), e.byAttr.get(p).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const l in t.attributes) {
      e.byDeclaredAttr.has(l) || e.byDeclaredAttr.set(l, []);
      const p = e.byDeclaredAttr.get(l);
      p.some((g) => g.componentTag === t.componentTag) || p.push({
        spec: t.attributes[l],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const l = zi(t);
    if (l === null)
      e.reactiveWildcard.push(t);
    else
      for (const p of l)
        e.byReactive.has(p) || e.byReactive.set(p, []), e.byReactive.get(p).push(t);
  }
  t.persist && e.persist.push(t);
}
function We(t, e, i, l) {
  for (let p = 0; p < t.length; p++) {
    const g = t[p];
    if (!e[g.attribute]) continue;
    const r = g.effects && g.effects[i];
    r ? r(e, i, l) : g.onAttrChange && (!g.declared || g.declared.has(i)) && g.onAttrChange(e, i, l);
  }
}
function ji(t) {
  const e = t.target, i = t.attributeName;
  if (t.oldValue === e.getAttribute(i)) return;
  const l = In(), p = l.byAttr.get(i);
  if (mn() && l.byDeclaredAttr && l.byDeclaredAttr.has(i) && Le(e)) {
    const g = l.byDeclaredAttr.get(i), r = e.getAttribute(i);
    for (let o = 0; o < g.length; o++)
      Ln(g[o].spec, r, i, g[o].componentTag, e);
  }
  if (window.lnCore._debugSink && (i.indexOf("data-ln-") === 0 || p) && window.lnCore._debugSink("attr", i, e, { oldValue: t.oldValue, newValue: e.getAttribute(i) }), i.indexOf("data-ln-") === 0) {
    const g = l.byReactive.get(i);
    g && We(g, e, i, t.oldValue), l.reactiveWildcard.length && We(l.reactiveWildcard, e, i, t.oldValue);
  }
  if (p)
    for (let g = 0; g < p.length; g++) {
      const r = p[g];
      if (r.handler) {
        r.handler(e, i, t.oldValue);
        continue;
      }
      r.onAttributeChange && e[r.attribute] ? r.onAttributeChange(e, i) : (Oe(e, r.selector, r.attribute, r.ComponentFn), r.onInit && r.onInit(e));
    }
}
function Dn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, ft(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        try {
          ji(e[i]);
        } catch (l) {
          console.error("[ln-core] mutation handler failed", e[i].target, l);
        }
    }).observe(document.body, {
      attributes: !0,
      subtree: !0,
      attributeOldValue: !0
    });
  }, "ln-core"));
}
function Rn() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Wi(t) {
  const e = Rn();
  if (e.length) {
    if (t.target)
      for (let i = 0; i < e.length; i++) {
        const l = e[i];
        if (l.onSubtreeChange) {
          const p = l.query, g = t.target.nodeType === 1 ? t.target.matches(p) ? t.target : t.target.closest(p) : t.target.parentElement ? t.target.parentElement.closest(p) : null;
          g && l.onSubtreeChange(g, t);
        }
      }
    for (let i = 0; i < t.addedNodes.length; i++) {
      const l = t.addedNodes[i];
      if (l.nodeType === 1)
        for (let p = 0; p < e.length; p++) {
          const g = e[p];
          Oe(l, g.selector, g.attribute, g.ComponentFn), g.onInit && g.onInit(l);
        }
    }
    for (let i = 0; i < t.removedNodes.length; i++) {
      const l = t.removedNodes[i];
      if (l.nodeType === 1)
        for (let p = 0; p < e.length; p++) {
          const g = e[p], r = g.query, o = Array.from(l.querySelectorAll(r));
          l.matches && l.matches(r) && o.push(l);
          for (let s = 0; s < o.length; s++) {
            const n = o[s];
            if (!document.contains(n)) {
              const u = n[g.attribute];
              if (u && typeof u.destroy == "function")
                try {
                  u.destroy();
                } catch (h) {
                  console.error("[" + g.attribute + "] destroy failed", n, h);
                }
              delete n[g.attribute];
            }
          }
        }
    }
  }
}
function Vi() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, ft(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const l = e[i];
        if (l.type === "childList")
          try {
            Wi(l);
          } catch (p) {
            console.error("[ln-core] lifecycle handler failed", l.target, p);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function Xt(t, e) {
  qn({ observed: t, handler: e }), Dn();
}
function U(t, e, i, l, p = {}) {
  const g = p.extraAttributes || [], r = p.onAttributeChange || null, o = p.onSubtreeChange || null, s = p.onInit || null, n = p.onAttrChange || null, u = p.effects || null, h = p.attributes || null, f = h ? Hi(h) : u, E = h ? new Set(Object.keys(h)) : null, w = p.persist || null;
  function m(c) {
    const _ = c || document.body;
    if (Oe(_, t, e, i), h && mn())
      for (const v in h) {
        const A = h[v], S = Array.from(_.querySelectorAll("[" + v + "]"));
        _.matches && _.matches("[" + v + "]") && S.push(_);
        for (let T = 0; T < S.length; T++) {
          const x = S[T];
          Le(x) && Ln(A, x.getAttribute(v), v, l, x);
        }
      }
    s && s(_);
  }
  const y = [];
  if (t.indexOf("[") !== -1) {
    const c = /\[([\w-]+)/g;
    let _;
    for (; (_ = c.exec(t)) !== null; )
      y.push(_[1]);
  } else
    y.push(t);
  qn({
    selector: t,
    attribute: e,
    componentTag: l,
    attributes: h,
    ComponentFn: i,
    onInit: s,
    observed: y.concat(g),
    onAttributeChange: r,
    onAttrChange: n,
    effects: f,
    declared: E,
    persist: w
  }), Dn();
  const b = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  Rn().push({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: s,
    onSubtreeChange: o,
    query: b
  }), Vi(), window[e] = m, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerComponent = U);
  function d() {
    xn() > 0 ? At(function() {
      m(document.body);
    }) : m(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", d) : d(), m;
}
function Ne(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const l = t[i];
    if (!(l === "" || l == null) && (e = !0, !Number.isFinite(Number(l))))
      return "string";
  }
  return e ? "number" : "string";
}
function Me(t, e, i, l) {
  if (i === "number") {
    const r = parseFloat(t), o = parseFloat(e);
    return (isNaN(r) ? 0 : r) - (isNaN(o) ? 0 : o);
  }
  const p = t != null ? String(t) : "", g = e != null ? String(e) : "";
  return l ? l.compare(p, g) : p < g ? -1 : p > g ? 1 : 0;
}
function le(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function On(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, l = t.threshold != null ? t.threshold : 25, p = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const g = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, r = typeof t.onChange == "function" ? t.onChange : function() {
  }, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let u = 0, h = 0, f = 0, E = { sort: null, filters: {}, search: "" }, w = null, m = 0, y = 0, a = !1;
  function b(v) {
    s.set(v, ++m);
  }
  function d() {
    return !!(E && (E.search || E.filters && Object.keys(E.filters).length));
  }
  function c() {
    if (o.size <= e) return;
    const v = Array.from(o.keys()).sort(function(S, T) {
      return (s.get(S) || 0) - (s.get(T) || 0);
    });
    let A = 0;
    for (; o.size > e && A < v.length; )
      o.delete(v[A]), s.delete(v[A]), A++;
  }
  function _(v, A) {
    n.add(v), g(E, v, A);
  }
  return {
    get: function(v) {
      return o.get(v);
    },
    has: function(v) {
      return o.has(v);
    },
    peek: function() {
      return o.size ? o.values().next().value : void 0;
    },
    get logicalTotal() {
      return u;
    },
    get grandTotal() {
      return h;
    },
    get queryGen() {
      return f;
    },
    get size() {
      return o.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(v, A) {
      clearTimeout(w), y = v;
      for (let D = v; D < A; D++)
        o.has(D) && b(D);
      if (u <= 0) return;
      const S = Math.max(0, v - l), T = Math.min(u, A + l), x = Math.floor(S / i), I = Math.floor(Math.max(0, T - 1) / i);
      let N = -1;
      for (let D = x; D <= I; D++) {
        const M = D * i, F = Math.min(i, u - M);
        let H = !1;
        const j = Math.max(M, S), X = Math.min(M + F, T);
        for (let et = j; et < X; et++)
          if (!o.has(et)) {
            H = !0;
            break;
          }
        if (H && !n.has(M)) {
          N = M;
          break;
        }
      }
      N !== -1 && (w = setTimeout(function() {
        _(N, i);
      }, p));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(v) {
      if (v = v || {}, v.queryGen != null && v.queryGen !== f) return !1;
      const A = v.offset || 0, S = v.data || [];
      let T = 0;
      for (let x = 0; x < S.length; x++)
        S[x] != null && T++;
      if (T === 0 && (v.provisional || v.filtered > 0))
        return n.delete(A), !1;
      a && (o.clear(), s.clear(), a = !1), v.provisional || (h = v.total != null ? v.total : h, u = v.filtered != null ? v.filtered : v.data ? v.data.length : u);
      for (let x = 0; x < S.length; x++)
        S[x] != null && (o.set(A + x, S[x]), b(A + x));
      return n.delete(A), c(), r(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(v) {
      v && (E = v), _(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(v) {
      f++, n.clear(), clearTimeout(w), v && (E = v), a = !0, _(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      f++, n.clear(), clearTimeout(w), a = !0;
      const v = Math.max(0, Math.floor(y / i) * i);
      _(v, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(v) {
      n.delete(v);
    },
    destroy: function() {
      clearTimeout(w), o.clear(), s.clear(), n.clear();
    },
    configure: function(v) {
      v = v || {};
      let A = !1;
      if (v.windowSize != null && v.windowSize > 0 && v.windowSize !== e) {
        const S = v.windowSize < e;
        e = v.windowSize, S && c(), A = !0;
      }
      v.pageSize != null && v.pageSize > 0 && (i = v.pageSize), v.threshold != null && v.threshold >= 0 && (l = v.threshold), v.fetchDebounce != null && v.fetchDebounce >= 0 && (p = v.fetchDebounce), A && r();
    },
    setGrandTotal: function(v) {
      v == null || isNaN(v) || v < 0 || (h = v, d() || (u = v), r());
    }
  };
}
function Nn(t) {
  return (t || "").replace(/^#/, "");
}
function $t(t) {
  const e = t === void 0 ? location.hash : t, i = {}, l = Nn(e);
  if (!l) return i;
  const p = l.split("&");
  for (let g = 0; g < p.length; g++) {
    const r = p[g];
    if (!r) continue;
    const o = r.indexOf(":"), s = o > -1 ? r.slice(0, o) : r, n = o > -1 ? r.slice(o + 1) : "";
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
  const e = $t();
  return t in e ? e[t] : null;
}
function mt(t, e) {
  if (!t) return;
  const i = $t();
  e == null ? delete i[t] : i[t] = String(e);
  const p = Object.keys(i).map(function(g) {
    const r = i[g];
    return r === "" ? g : g + ":" + encodeURIComponent(r);
  }).join("&");
  Nn(location.hash) !== p && (location.hash = p);
}
function Fe(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function St(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const l = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return l ? e ? l + "-" + e : l : e || null;
}
function Mn(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function be(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Fn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function ye(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), l = t.slice(e + 1), p = l ? l.split(",").map(function(g) {
    try {
      return decodeURIComponent(g);
    } catch {
      return g;
    }
  }).filter(Boolean) : [];
  return { key: i, values: p };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = $t, window.lnCore.hashGet = st, window.lnCore.hashSet = mt, window.lnCore.hashLinkClick = Fe, window.lnCore.resolveHashNamespace = St, window.lnCore.hashSortEncode = Mn, window.lnCore.hashSortDecode = be, window.lnCore.hashFilterEncode = Fn, window.lnCore.hashFilterDecode = ye);
function re(t, e, i, l) {
  const p = typeof l == "number" ? l : 4, g = window.innerWidth, r = window.innerHeight, o = e.width, s = e.height, n = (i || "bottom").split("-"), u = n[0], h = n[1] === "start" || n[1] === "end" ? n[1] : "center", f = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, E = f[u] || f.bottom;
  function w(d) {
    return d === "top" || d === "bottom" ? h === "start" ? t.left : h === "end" ? t.right - o : t.left + (t.width - o) / 2 : h === "start" ? t.top : h === "end" ? t.bottom - s : t.top + (t.height - s) / 2;
  }
  function m(d) {
    let c, _, v = !0;
    return d === "top" ? (c = t.top - p - s, _ = w(d), c < 0 && (v = !1)) : d === "bottom" ? (c = t.bottom + p, _ = w(d), c + s > r && (v = !1)) : d === "left" ? (c = w(d), _ = t.left - p - o, _ < 0 && (v = !1)) : (c = w(d), _ = t.right + p, _ + o > g && (v = !1)), { top: c, left: _, side: d, fits: v };
  }
  let y = null;
  for (let d = 0; d < E.length; d++) {
    const c = m(E[d]);
    if (c.fits) {
      y = c;
      break;
    }
  }
  y || (y = m(E[0]));
  let a = y.top, b = y.left;
  return o >= g ? b = 0 : (b < 0 && (b = 0), b + o > g && (b = g - o)), s >= r ? a = 0 : (a < 0 && (a = 0), a + s > r && (a = r - s)), { top: a, left: b, placement: y.side };
}
function ve(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, l = e.display, p = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const g = t.offsetWidth, r = t.offsetHeight;
  return e.visibility = i, e.display = l, e.position = p, { width: g, height: r };
}
let Vt = null;
const Gi = "ln-ashlar:storage-salt:v1", Ve = 32768;
function Ge(t) {
  let e = "";
  const i = t.byteLength;
  for (let l = 0; l < i; l += Ve)
    e += String.fromCharCode.apply(
      null,
      t.subarray(l, Math.min(l + Ve, i))
    );
  return btoa(e);
}
function $e(t) {
  const e = atob(t), i = e.length, l = new Uint8Array(i);
  for (let p = 0; p < i; p++)
    l[p] = e.charCodeAt(p);
  return l;
}
function Bn(t, e) {
  let i = Vt, l = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (l = t, typeof CryptoKey < "u" && l.key instanceof CryptoKey && (i = l.key)), { key: i, options: l };
}
async function $i(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", l = new TextEncoder();
  if (i === "sha256") {
    const s = await crypto.subtle.digest("SHA-256", l.encode(t));
    return crypto.subtle.importKey(
      "raw",
      s,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const p = e.salt || Gi, g = typeof p == "string" ? l.encode(p) : p, r = e.iterations || 1e5, o = await crypto.subtle.importKey(
    "raw",
    l.encode(t),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: g,
      iterations: r,
      hash: "SHA-256"
    },
    o,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function Qe(t, e = {}) {
  if (!t) {
    Vt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Vt = await $i(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Vt = null, i;
  }
}
function Tt() {
  return Vt;
}
async function Qi(t, e, i) {
  const { key: l } = Bn(e);
  if (t == null)
    return t;
  if (!l)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const p = new TextEncoder(), g = crypto.getRandomValues(new Uint8Array(12)), r = typeof t == "string" ? t : JSON.stringify(t), o = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: g },
      l,
      p.encode(r)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: Ge(g),
      data: Ge(new Uint8Array(o))
    };
  } catch (p) {
    throw console.error("[ln-core/crypto] Encryption failed:", p), new Error("[ln-crypto] Encryption failed: " + (p && p.message ? p.message : String(p)));
  }
}
async function Yi(t, e, i) {
  const { key: l, options: p } = Bn(e), g = p.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!l) {
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
    const r = new TextDecoder(), o = $e(t.iv), s = $e(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: o },
      l,
      s
    ), u = r.decode(n);
    try {
      return JSON.parse(u);
    } catch {
      return u;
    }
  } catch (r) {
    if (g)
      return { ...t, decryptionError: !0 };
    throw console.error("[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:", r), new Error("[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: " + (r && r.message ? r.message : String(r)));
  }
}
function vt() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const e = Math.random() * 16 | 0;
    return (t === "x" ? e : e & 3 | 8).toString(16);
  });
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.uuid = vt);
function Pn(t, e = 100, i = 0) {
  const l = parseFloat(String(t)) || 0, p = parseFloat(String(e)) || 100, g = parseFloat(String(i)) || 0, r = Math.max(g, Math.min(l, p)), o = p - g;
  let s = 0;
  return o > 0 && (s = (r - g) / o * 100), s = Math.max(0, Math.min(100, s)), {
    value: l,
    min: g,
    max: p,
    clampedValue: r,
    percentage: s
  };
}
function it(t) {
  if (t == null || t === "") return null;
  if (t instanceof Date)
    return isNaN(t.getTime()) ? null : t;
  const e = Number(t);
  if (!isNaN(e) && e > 0) {
    const i = e < 1e11 ? e * 1e3 : e, l = new Date(i);
    return isNaN(l.getTime()) ? null : l;
  }
  if (typeof t == "string") {
    const i = t.trim();
    if (!i) return null;
    const l = /^(\d{4})-(\d{2})-(\d{2})$/.exec(i);
    if (l) {
      const g = +l[1], r = +l[2], o = +l[3], s = new Date(g, r - 1, o);
      return s.getFullYear() !== g || s.getMonth() !== r - 1 || s.getDate() !== o ? null : s;
    }
    const p = new Date(i);
    return isNaN(p.getTime()) ? null : p;
  }
  return null;
}
function Mt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + l;
}
const wt = {};
function oe(t) {
  const e = t || "default";
  if (!wt[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), l = i.formatToParts(1234.5);
    let p = "", g = ".";
    for (let r = 0; r < l.length; r++)
      l[r].type === "group" && (p = l[r].value), l[r].type === "decimal" && (g = l[r].value);
    wt[e] = { groupSep: p, decimalSep: g, fmt: i };
  }
  return wt[e];
}
function Un(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let l = t.trim();
  return l === "" ? "" : (l = l.replace(/[$€£¥]/g, ""), e && (l = l.split(e).join("")), l = l.replace(/\s/g, ""), i && i !== "." && (l = l.replace(i, ".")), l = l.replace(/[^\d.-]/g, ""), l);
}
function Xi(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const l = oe(e), p = Un(i, l.groupSep, l.decimalSep);
  if (p === "" || p === "-") return NaN;
  const g = parseFloat(p);
  return isNaN(g) ? NaN : g;
}
function ot(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const l = e || "default", p = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, g = i.userDecimals != null ? i.userDecimals : null;
  if (p !== null) {
    const r = l + "|max:" + p;
    return wt[r] || (wt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: p
    })), wt[r].format(t);
  }
  if (g !== null && g > 0) {
    const r = l + "|exact:" + g;
    return wt[r] || (wt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: g,
      maximumFractionDigits: g
    })), wt[r].format(t);
  }
  return oe(e).fmt.format(t);
}
function we(t) {
  return String(t || "").trim().toLowerCase();
}
function Hn(t) {
  const e = we(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function Ji(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function zn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (i.indexOf(e[l]) === -1) return !1;
  return !0;
}
function Zi(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Be(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (String(e[l]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function tr(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function er(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function nr(t, e) {
  return (e || "GET") + " " + (t || "");
}
function ir(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function l(r, o) {
    o = o || {};
    const s = tr(r), n = er(r, o), u = nr(s, n);
    ir(n) && e.has(u) && (e.get(u).abort(), e.delete(u));
    const h = new AbortController(), f = o.signal;
    let E = null;
    f && (f.aborted ? h.abort(f.reason) : (E = function() {
      h.abort(f.reason);
    }, f.addEventListener("abort", E, { once: !0 })));
    const w = Object.assign({}, o, { signal: h.signal });
    return e.set(u, h), t(r, w).finally(function() {
      f && E && f.removeEventListener("abort", E), e.get(u) === h && e.delete(u);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function p(r) {
    if (!r.detail || !r.detail.url) return;
    const o = r.target, s = (r.detail.method || (r.detail.body ? "POST" : "GET")).toUpperCase(), n = r.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const u = new AbortController(), h = r.detail.signal;
    let f = null;
    h && (h.aborted ? u.abort(h.reason) : (f = function() {
      u.abort(h.reason);
    }, h.addEventListener("abort", f, { once: !0 }))), n && i.set(n, u);
    const E = { method: s, signal: u.signal };
    r.detail.body !== void 0 && (E.body = r.detail.body), window.fetch(r.detail.url, E).then(function(w) {
      h && f && h.removeEventListener("abort", f), n && i.get(n) === u && i.delete(n), k(o, "ln-http:response", {
        ok: w.ok,
        status: w.status,
        response: w
      });
    }).catch(function(w) {
      h && f && h.removeEventListener("abort", f), n && i.get(n) === u && i.delete(n), !(w && w.name === "AbortError") && k(o, "ln-http:error", {
        ok: !1,
        status: 0,
        error: w
      });
    });
  }
  function g(r) {
    const o = r.detail || {};
    o.all ? window.lnHttp.cancelAll() : o.key ? window.lnHttp.cancelByKey(o.key) : o.url && window.lnHttp.cancel(o.url);
  }
  document.addEventListener("ln-http:request", p), document.addEventListener("ln-http:cancel", g), window.lnHttp = {
    cancel: function(r) {
      let o = !1;
      return e.forEach(function(s, n) {
        n.endsWith(" " + r) && (s.abort(), e.delete(n), o = !0);
      }), o;
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
      return e.forEach(function(o, s) {
        const n = s.indexOf(" ");
        r.push({ method: s.slice(0, n), url: s.slice(n + 1) });
      }), i.forEach(function(o, s) {
        r.push({ key: s });
      }), r;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", p), document.removeEventListener("ln-http:cancel", g), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: K, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, l = Y(i), p = /* @__PURE__ */ new Map();
  function g(r) {
    if (this.dom = r, Q(this, r, l), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Ki(), this._held = !0;
    const o = this, s = this.url;
    let n = p.get(s);
    return n || (n = fetch(s).then(function(u) {
      if (!u.ok)
        throw new Error("HTTP error! status: " + u.status);
      return u.text();
    }).catch(function(u) {
      throw p.delete(s), u;
    }), p.set(s, n)), n.then(function(u) {
      if (o._destroyed) return;
      const h = document.createElement("template");
      h.innerHTML = u, o.dom.content.appendChild(h.content), k(o.dom, "ln-include:loaded", { target: o.dom, url: o.url }), o._held && (o._held = !1, fe());
    }).catch(function(u) {
      o._destroyed || (console.error("[ln-include] Failed to fetch template from " + o.url + ":", u), k(o.dom, "ln-include:error", { target: o.dom, url: o.url, error: u }), o._held && (o._held = !1, fe()));
    }), this;
  }
  g.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, fe()), delete this.dom[e]);
  }, U(t, e, g, "ln-include", {
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
  }, l = Y(i);
  function p(g) {
    this.dom = g, Q(this, g, l), this._baseAction = g.getAttribute("action") || "";
    const r = this;
    return this._onLnFill = function(o) {
      o.target === r.dom && (o.detail ? (r.fill(o.detail), r._applyActionMode(o.detail)) : r.dom.reset());
    }, this._onReset = function() {
      r._applyActionMode(null);
    }, g.addEventListener("ln-fill", this._onLnFill), g.addEventListener("reset", this._onReset), this;
  }
  p.prototype.fill = function(g) {
    const r = De(this.dom, g);
    for (let o = 0; o < r.length; o++) {
      const s = r[o], n = s.tagName === "SELECT" || s.type === "checkbox" || s.type === "radio";
      s.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, p.prototype._ensureMethodInput = function() {
    let g = this.dom.querySelector('input[name="_method"]');
    return g || (g = document.createElement("input"), g.type = "hidden", g.name = "_method", g.value = "", this.dom.appendChild(g)), g;
  }, p.prototype._applyActionMode = function(g) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const r = g && g.id != null && g.id !== "" ? g.id : null, o = this._ensureMethodInput();
    if (r !== null) {
      const s = this._actionEdit;
      s ? this.dom.setAttribute("action", s.replace(":id", encodeURIComponent(r))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(r)), o.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), o.value = "";
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, U(t, e, p, "ln-form", {
    attributes: i
  });
})();
const Ye = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function Xe(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function rr(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function or(t, e) {
  const i = [];
  if (t) {
    const l = Object.keys(Ye);
    for (let p = 0; p < l.length; p++) {
      const g = l[p], r = Ye[g];
      t[r] && i.push(g);
    }
  }
  if (e) {
    const l = Array.from(e);
    for (let p = 0; p < l.length; p++)
      l[p] && i.indexOf(l[p]) === -1 && i.push(l[p]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", l = "data-ln-validate-error", p = "ln-validate-valid", g = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function o(s) {
    this.dom = s, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, u = s.tagName, h = s.type, f = u === "SELECT" || h === "checkbox" || h === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(w) {
      const m = w.detail && w.detail.error;
      if (!m) return;
      n._customErrors.add(m), n._touched = !0;
      const y = s.closest(".form-element");
      if (y) {
        const a = y.querySelector("[" + l + '="' + m + '"]');
        a && a.classList.remove("hidden");
      }
      s.classList.remove(p), s.classList.add(g), s.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(w) {
      const m = w.detail && w.detail.error, y = s.closest(".form-element");
      if (m) {
        if (n._customErrors.delete(m), y) {
          const a = y.querySelector("[" + l + '="' + m + '"]');
          a && a.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(a) {
          if (y) {
            const b = y.querySelector("[" + l + '="' + a + '"]');
            b && b.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, f || s.addEventListener("input", this._onInput), s.addEventListener("change", this._onChange), s.addEventListener("ln-validate:set-custom", this._onSetCustom), s.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const E = s.form;
    return E && (E.hasAttribute("novalidate") || E.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(w) {
      n._touched = !0, !n.validate() && w.detail && w.detail.invalidFields && w.detail.invalidFields.push(n.dom);
    }, E.addEventListener("reset", this._onFormReset), E.addEventListener("ln-validate:request-validate", this._onValidateRequest), E._lnValidateGateBound || (E._lnValidateGateBound = !0, E.addEventListener("submit", function(w) {
      const m = { invalidFields: [] };
      k(E, "ln-validate:request-validate", m), m.invalidFields.length > 0 && (w.preventDefault(), m.invalidFields.sort((y, a) => y.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), m.invalidFields[0].focus());
    }))), rr(s) && (this._touched = !0, this.validate()), this;
  }
  o.prototype.validate = function() {
    const s = this.dom, n = s.validity, u = Xe(n, this._customErrors.size), h = or(n, this._customErrors), f = s.closest(".form-element");
    if (f) {
      const w = f.querySelector("[" + i + "]");
      if (w) {
        const m = w.querySelectorAll("[" + l + "]");
        for (let y = 0; y < m.length; y++) {
          const a = m[y].getAttribute(l);
          m[y].classList.toggle("hidden", !h.includes(a));
        }
      }
    }
    return s.classList.toggle(p, u), s.classList.toggle(g, !u), s.setAttribute("aria-invalid", u ? "false" : "true"), k(s, u ? "ln-validate:valid" : "ln-validate:invalid", { target: s, field: s.name, errors: h }), u;
  }, o.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(p, g), this.dom.removeAttribute("aria-invalid");
    const s = this.dom.closest(".form-element");
    if (s) {
      const n = s.querySelectorAll("[" + l + "]");
      for (let u = 0; u < n.length; u++)
        n[u].classList.add("hidden");
    }
  }, Object.defineProperty(o.prototype, "isValid", {
    get: function() {
      return Xe(this.dom.validity, this._customErrors.size);
    }
  }), o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const s = this.dom.form;
    s && (this._onFormReset && s.removeEventListener("reset", this._onFormReset), this._onValidateRequest && s.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(p, g), this.dom.removeAttribute("aria-invalid"), delete this.dom[e];
  }, U(t, e, o, "ln-validate", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let l = null;
  function p(f) {
    if (!f.hasAttribute(t) || f[e]) return;
    f[e] = !0;
    const E = n(f);
    g(E.links), r(E.forms);
  }
  function g(f) {
    for (const E of f) {
      if (E[e + "Trigger"] || E.hostname && E.hostname !== window.location.hostname) continue;
      const w = E.getAttribute("href");
      if (w && w.includes("#")) continue;
      const m = function(y) {
        if (!_n(y, E)) return;
        y.preventDefault();
        const a = E.getAttribute("href");
        a && s("GET", a, null, E);
      };
      E.addEventListener("click", m), E[e + "Trigger"] = m;
    }
  }
  function r(f) {
    for (const E of f) {
      if (E[e + "Trigger"]) continue;
      if (E.hasAttribute(i)) {
        E[e + "ScopeWarned"] || (E[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const w = function(m) {
        if (m.defaultPrevented) return;
        m.preventDefault();
        const y = E.method.toUpperCase(), a = E.action, b = new FormData(E);
        for (const d of E.querySelectorAll('button, input[type="submit"]'))
          d.disabled = !0;
        s(y, a, b, E, function() {
          for (const d of E.querySelectorAll('button, input[type="submit"]'))
            d.disabled = !1;
        });
      };
      E.addEventListener("submit", w), E[e + "Trigger"] = w;
    }
  }
  function o(f) {
    if (!f[e]) return;
    const E = n(f);
    for (const w of E.links)
      w[e + "Trigger"] && (w.removeEventListener("click", w[e + "Trigger"]), delete w[e + "Trigger"]);
    for (const w of E.forms)
      w[e + "Trigger"] && (w.removeEventListener("submit", w[e + "Trigger"]), delete w[e + "Trigger"]);
    delete f[e];
  }
  function s(f, E, w, m, y) {
    if ($(m, "ln-ajax:before-start", { method: f, url: E }).defaultPrevented) return;
    f === "GET" && l && l(), k(m, "ln-ajax:start", { method: f, url: E }), m.classList.add("ln-ajax--loading");
    const b = document.createElement("span");
    b.className = "ln-ajax-spinner", m.appendChild(b);
    function d() {
      m.classList.remove("ln-ajax--loading");
      const T = m.querySelector(".ln-ajax-spinner");
      T && T.remove(), y && y();
    }
    let c = E;
    const _ = document.querySelector('meta[name="csrf-token"]'), v = _ ? _.getAttribute("content") : null;
    w instanceof FormData && v && w.append("_token", v);
    const A = {
      method: f,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (v && (A.headers["X-CSRF-TOKEN"] = v), f === "GET" && w) {
      const T = new URLSearchParams(w);
      c = E + (E.includes("?") ? "&" : "?") + T.toString();
    } else f !== "GET" && w && (A.body = w);
    let S = null;
    if (f === "GET") {
      const T = new AbortController();
      A.signal = T.signal, S = function() {
        l = null, T.abort(), d(), k(m, "ln-ajax:aborted", { method: f, url: c });
      }, l = S;
    }
    fetch(c, A).then(function(T) {
      const x = T.ok, I = T.status;
      return T.text().then(function(N) {
        let D = null, M = null;
        if (N && N.trim())
          try {
            D = JSON.parse(N);
          } catch (F) {
            M = F;
          }
        return { ok: x, status: I, data: D, parseError: M };
      });
    }).then(function(T) {
      S && l === S && (l = null);
      const x = T.status, I = T.data, N = T.parseError;
      if (T.ok && !N) {
        if (I && I.title && (document.title = I.title), I && I.content)
          for (const D in I.content) {
            const M = document.getElementById(D);
            M && (M.innerHTML = I.content[D]);
          }
        if (m.tagName === "A") {
          const D = m.getAttribute("href");
          D && window.history.pushState({ ajax: !0 }, "", D);
        } else m.tagName === "FORM" && m.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", c);
        k(m, "ln-ajax:success", { method: f, url: c, data: I });
      } else
        k(m, "ln-ajax:error", {
          method: f,
          url: c,
          status: x,
          data: I,
          error: N || null
        });
      d(), k(m, "ln-ajax:complete", { method: f, url: c });
    }).catch(function(T) {
      T && T.name === "AbortError" || (S && l === S && (l = null), k(m, "ln-ajax:error", { method: f, url: c, status: 0, data: null, error: T }), d(), k(m, "ln-ajax:complete", { method: f, url: c }));
    });
  }
  function n(f) {
    const E = { links: [], forms: [] };
    return f.tagName === "A" && f.getAttribute(t) !== "false" ? E.links.push(f) : f.tagName === "FORM" && f.getAttribute(t) !== "false" ? E.forms.push(f) : (E.links = Array.from(f.querySelectorAll('a:not([data-ln-ajax="false"])')), E.forms = Array.from(f.querySelectorAll('form:not([data-ln-ajax="false"])'))), E;
  }
  function u() {
    ft(function() {
      new MutationObserver(function(E) {
        for (const w of E)
          if (w.type === "childList") {
            for (const m of w.addedNodes)
              if (m.nodeType === 1 && (p(m), !m.hasAttribute(t))) {
                for (const a of m.querySelectorAll("[" + t + "]"))
                  p(a);
                const y = m.closest && m.closest("[" + t + "]");
                if (y && y.getAttribute(t) !== "false") {
                  const a = n(m);
                  g(a.links), r(a.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Xt([t], function(E) {
        p(E);
      });
    }, "ln-ajax");
  }
  function h() {
    for (const f of document.querySelectorAll("[" + t + "]"))
      p(f);
  }
  window[e] = p, window[e].destroy = o, u(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
})();
function sr(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: l = null } = {}) {
  const p = i ? !l : !t.some((n) => n.match), g = [], r = [];
  for (const n of t)
    if (!(!n.targetEl && !n.isPending)) {
      if (!n.match) {
        const u = e && n.hasHydrate && n.hasChildren;
        !n.hasKeep && n.hasChildren && !u && n.targetEl && g.push(n);
        continue;
      }
      n.hasKeep && n.mountedTemplate === n.match.route.templateNode || r.push(Object.assign({}, n, {
        skipMount: e && n.hasHydrate && n.hasChildren
      }));
    }
  r.sort((n, u) => n.regionKey === "__primary__" ? -1 : u.regionKey === "__primary__" ? 1 : 0);
  const s = r.find((n) => n.regionKey === "__primary__") || r[0] || null;
  return { notFound: p, clears: g, swaps: r, owner: s };
}
function Gt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function ar(t, e) {
  const i = Gt(e);
  if (!i) return t && t.replace(/\/+$/, "") || "/";
  const l = (t || "/").replace(/\/+$/, "") || "/";
  return l === i ? "/" : l.startsWith(i + "/") ? l.slice(i.length).replace(/\/+$/, "") || "/" : l;
}
function Kn(t, e) {
  const i = Gt(e);
  if (!i) return t || "/";
  const l = t || "/", p = l.indexOf("#"), g = p !== -1 ? l.slice(0, p) : l, r = p !== -1 ? l.slice(p) : "", o = g.indexOf("?"), s = o !== -1 ? g.slice(0, o) : g, n = o !== -1 ? g.slice(o) : "";
  let u;
  if (s === i)
    u = i + "/";
  else if (s.startsWith(i + "/"))
    u = s;
  else {
    const h = s.startsWith("/") ? s : "/" + s;
    u = h === "/" ? i + "/" : i + h;
  }
  return u + n + r;
}
function Ee() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return Gt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const i = new URL(e.getAttribute("href"), window.location.origin);
      return Gt(i.pathname);
    } catch {
      return Gt(e.getAttribute("href"));
    }
  return "";
}
const jn = {
  navigate: function(t) {
    Qt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Qt(t, { historyAction: "replace" });
  },
  base: function() {
    return Ee();
  },
  toUrl: function(t) {
    return Kn(t, Ee());
  },
  current: function() {
    return se === null ? null : {
      path: se,
      fullPath: Gn,
      base: $n,
      params: Qn,
      query: Yn,
      route: Xn,
      regions: Vn
    };
  }
}, Pe = "data-ln-route", Wn = "lnRoute";
typeof window < "u" && (window.lnRouter = jn);
function he(t) {
  ni(t), ei(t), gt.size > 0 && ti();
}
const lr = {
  "data-ln-route": { effect: he, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: he, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: he, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, gt = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new WeakMap();
let Vn = /* @__PURE__ */ new Map(), Je = !1, se = null, Gn = null, $n = "", Qn = {}, Yn = {}, Xn = null, Ae = !1;
function Ze(t, e, i) {
  Ae ? queueMicrotask(function() {
    k(t, e, i);
  }) : k(t, e, i);
}
function Ue(t) {
  try {
    const o = new URL(t, window.location.origin);
    t = o.pathname + o.search + o.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, l] = e.split("?");
  const p = {};
  if (l) {
    const o = new URLSearchParams(l);
    for (const [s, n] of o.entries())
      p[s] = n;
  }
  const g = Ee();
  return { path: ar(i, g), query: p, base: g };
}
function Jn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, l = e.segments, p = Math.max(i.length, l.length);
  for (let g = 0; g < p; g++) {
    const r = i[g], o = l[g];
    if (r === void 0) return 1;
    if (o === void 0) return -1;
    if (r === "*") return 1;
    if (o === "*") return -1;
    const s = r.startsWith(":"), n = o.startsWith(":");
    if (s && !n) return 1;
    if (!s && n) return -1;
  }
  return 0;
}
function Zn(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const l of e) {
    if (l.pattern === "*")
      return {
        route: l,
        params: { wildcard: t }
      };
    const p = l.segments, g = {};
    let r = !0;
    if (!(i.length > p.length && p[p.length - 1] !== "*")) {
      for (let o = 0; o < p.length; o++) {
        const s = p[o], n = i[o];
        if (s === "*") {
          g.wildcard = i.slice(o).join("/");
          break;
        }
        if (n === void 0) {
          r = !1;
          break;
        }
        if (s.startsWith(":"))
          g[s.slice(1)] = decodeURIComponent(n);
        else if (s !== n) {
          r = !1;
          break;
        }
      }
      if (r && (p.indexOf("*") !== -1 || i.length <= p.length))
        return { route: l, params: g };
    }
  }
  return null;
}
function Se(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const p = document.getElementById(t);
    return !p && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), p;
  }
  const l = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !l && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), l;
}
function tn(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const p of i)
    for (const g of Object.keys(p))
      if (g.startsWith("ln") && p[g] && typeof p[g].destroy == "function")
        try {
          p[g].destroy();
        } catch (r) {
          console.error(`[ln-router] Error destroying component ${g} on element:`, p, r);
        }
  const l = document.querySelectorAll('[data-ln-popover="open"]');
  for (const p of l) {
    const g = p.lnPopover;
    if (g && g.trigger && t.contains(g.trigger))
      try {
        g.destroy();
      } catch (r) {
        console.error("[ln-router] Error destroying open popover:", r);
      }
  }
}
function Qt(t, e = {}) {
  const { path: i, query: l, base: p } = Ue(t), g = Kn(t, p), r = /* @__PURE__ */ new Map();
  for (const [w, m] of gt)
    r.set(w, Zn(i, m.sorted));
  const o = r.get("__primary__") || null, s = Se("__primary__", { warn: !!o }), n = gt.has("__primary__"), u = [];
  for (const [w, m] of r) {
    const y = w === "__primary__" ? s : Se(w, { warn: !1 }), a = !y && !!(o && o.route && o.route.templateNode && o.route.templateNode.content && o.route.templateNode.content.querySelector("#" + CSS.escape(w)));
    !y && !a && m && console.warn(`[ln-router] Explicit target element #${w} not found in DOM`), u.push({
      regionKey: w,
      match: m,
      targetEl: y,
      isPending: a,
      hasKeep: !!y && y.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!y && y.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!y && y.children.length > 0,
      mountedTemplate: y && pe.get(y) || null
    });
  }
  const h = sr(u, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: o
  });
  if (h.notFound) {
    Ze(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if ($(s || document.body, "ln-router:before-navigate", {
    from: se,
    to: g,
    path: i,
    params: o ? o.params : {},
    query: l
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", g) : e.historyAction === "replace" && window.history.replaceState(null, "", g);
  const E = function() {
    for (const w of h.clears)
      tn(w.targetEl), w.targetEl.replaceChildren(), pe.delete(w.targetEl);
    for (const w of h.swaps) {
      if ((w.isPending || !w.targetEl || !document.contains(w.targetEl)) && (w.targetEl = w.regionKey === "__primary__" ? s : document.getElementById(w.regionKey)), !w.targetEl) {
        console.warn(`[ln-router] Target element #${w.regionKey} could not be resolved`);
        continue;
      }
      if (w.skipMount || (tn(w.targetEl), w.targetEl.replaceChildren(w.match.route.templateNode.content.cloneNode(!0))), pe.set(w.targetEl, w.match.route.templateNode), h.owner && w.regionKey === h.owner.regionKey) {
        if (w.match.route.title) {
          let m = w.match.route.title;
          if (w.match.params)
            for (const [y, a] of Object.entries(w.match.params))
              m = m.replace(new RegExp("\\{\\{\\s*" + y + "\\s*\\}\\}", "g"), a);
          document.title = m;
        }
        if (!e.isHydration) {
          w.targetEl.hasAttribute("tabindex") || w.targetEl.setAttribute("tabindex", "-1");
          const m = w.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          m ? (m.setAttribute("tabindex", "-1"), m.focus()) : w.targetEl.focus(), w.regionKey === "__primary__" && w.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      Ze(w.targetEl, "ln-router:navigated", {
        path: i,
        fullPath: g,
        base: p,
        params: w.match.params,
        query: l,
        route: w.match.route,
        target: w.targetEl,
        region: w.regionKey
      });
    }
    se = i, Gn = g, $n = p, Yn = l, Xn = o ? o.route : null, Qn = o ? o.params : {}, Vn = new Map(
      Array.from(r.entries()).map(([w, m]) => [w, m ? { route: m.route, params: m.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(E) : E();
}
function cr(t) {
  const e = t.target.closest("a");
  if (!e || !_n(t, e)) return;
  const i = e.getAttribute("href"), { path: l } = Ue(i);
  for (const p of gt.values())
    if (Zn(l, p.sorted)) {
      t.preventDefault(), Qt(i, { historyAction: "push" });
      return;
    }
}
function dr(t, e) {
  const i = Object.keys(t), l = Object.keys(e);
  if (i.length !== l.length) return !1;
  for (let p = 0; p < i.length; p++) {
    const g = i[p];
    if (t[g] !== e[g]) return !1;
  }
  return !0;
}
function ur() {
  const t = window.location.pathname + window.location.search, e = jn.current();
  if (e && e.path != null) {
    const i = Ue(t);
    if (e.path === i.path && dr(e.query, i.query))
      return;
  }
  Qt(t, { historyAction: "skip" });
}
function ti() {
  Je || (Je = !0, ft(function() {
    document.addEventListener("click", cr), window.addEventListener("popstate", ur), Ae = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Qt(t, { historyAction: "replace", isHydration: !0 }), Ae = !1;
  }, "ln-router"));
}
function ei(t) {
  const e = t.getAttribute(Pe);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const l = i || "__primary__";
  gt.has(l) || gt.set(l, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const p = gt.get(l);
  if (p.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${l}"`);
    return;
  }
  const g = t.getAttribute("data-ln-route-title"), r = e.split("/").filter(Boolean), o = {
    pattern: e,
    segments: r,
    target: i,
    title: g,
    templateNode: t
  }, s = Se(l);
  s && s.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), p.routes.set(e, o), p.sorted = Array.from(p.routes.values()).sort(Jn);
}
function ni(t) {
  const e = t.getAttribute(Pe);
  if (!e) return;
  const l = t.getAttribute("data-ln-route-target") || null || "__primary__", p = gt.get(l);
  p && (p.routes.delete(e), p.sorted = Array.from(p.routes.values()).sort(Jn), p.routes.size === 0 && gt.delete(l));
}
function ii(t) {
  return this.dom = t, ei(t), this;
}
ii.prototype.destroy = function() {
  ni(this.dom), delete this.dom[Wn];
};
U(Pe, Wn, ii, "ln-router", {
  attributes: lr,
  onInit: function() {
    gt.size > 0 && ti();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", i = "data-ln-modal-for", l = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const p = {
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
  }, g = /* @__PURE__ */ new Set();
  let r = null;
  function o() {
    r || (r = function(h) {
      if (xe(h)) return;
      const f = h.target.closest("[" + i + "]");
      if (!f || Ie(f)) return;
      const E = f.getAttribute(i);
      if (!E) return;
      const w = document.getElementById(E);
      !w || !w[e] || (h.preventDefault(), f.hasAttribute("data-ln-modal-mode") ? w.setAttribute("data-ln-modal-mode", f.getAttribute("data-ln-modal-mode")) : w.hasAttribute("data-ln-modal-mode") && w.setAttribute("data-ln-modal-mode", "new"), w.setAttribute(t, "open"));
    }, document.addEventListener("click", r));
  }
  function s() {
    g.size > 0 || !r || (document.removeEventListener("click", r), r = null);
  }
  function n(h) {
    this.dom = h, this.isOpen = h.getAttribute(t) === "open";
    const f = this;
    return this._onRequestOpen = function() {
      f.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      f.dom.setAttribute(t, "close");
    }, this._onCancel = function(E) {
      E.preventDefault(), f.dom.setAttribute(t, "close");
    }, this._onClose = function() {
      !f.isOpen || f.dom.getAttribute(t) !== "open" || f.dom.open || (f._isNativeClosing = !0, f.dom.setAttribute(t, "close"));
    }, this._onClickClose = function(E) {
      const w = E.target.closest("[" + l + "]");
      w && f.dom.contains(w) && (E.preventDefault(), f.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("close", this._onClose), this.dom.addEventListener("click", this._onClickClose), g.add(this), o(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), k(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const h = this.dom.getAttribute(t);
    this.dom.setAttribute(t, h === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("close", this._onClose), this.dom.removeEventListener("click", this._onClickClose), g.delete(this), s(), this.isOpen) {
        const h = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(E) {
            return E !== h;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function u(h) {
    const f = h[e];
    if (!f) return;
    const E = !!f._isNativeClosing;
    f._isNativeClosing = !1;
    const m = h.getAttribute(t) === "open";
    if (m === f.isOpen) {
      m && h.isConnected && !h.open && typeof h.showModal == "function" && h.showModal();
      return;
    }
    if (m) {
      if ($(h, "ln-modal:before-open", { modalId: h.id, target: h }).defaultPrevented) {
        h.setAttribute(t, "close");
        return;
      }
      f.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof h.showModal == "function" && h.showModal();
      const a = h.querySelector("[autofocus]");
      if (a && Wt(a))
        a.focus();
      else {
        const b = h.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), d = Array.prototype.find.call(b, Wt);
        if (d) d.focus();
        else {
          const c = h.querySelectorAll("a[href], button:not([disabled])"), _ = Array.prototype.find.call(c, Wt);
          _ && _.focus();
        }
      }
      k(h, "ln-modal:open", { modalId: h.id, target: h });
    } else {
      if (!E && $(h, "ln-modal:before-close", { modalId: h.id, target: h }).defaultPrevented) {
        h.setAttribute(t, "open");
        return;
      }
      f.isOpen = !1, h.hasAttribute("data-ln-modal-mode") && h.setAttribute("data-ln-modal-mode", "new"), typeof h.close == "function" && h.open && h.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open"), k(h, "ln-modal:close", { modalId: h.id, target: h });
    }
  }
  U(t, e, n, "ln-modal", {
    attributes: p
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
  document.addEventListener("click", function(g) {
    if (g.ctrlKey || g.metaKey || g.button === 1) return;
    const r = g.target.closest('a[href^="#"]');
    if (!r) return;
    const o = r.getAttribute("href"), s = $t(o);
    for (const n in s) {
      const u = document.getElementById(n);
      if (u && u.lnModal) {
        if (!Fe(g)) return;
        mt(n, s[n]), u.lnModal.isOpen || k(u, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function l() {
    const g = location.hash;
    if (!g) return;
    const r = $t(g);
    for (const o in r) {
      const s = document.getElementById(o);
      s && s.lnModal && !s.lnModal.isOpen && k(s, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", l), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l(), document.addEventListener("ln-modal:close", function(g) {
    const r = g.target;
    r && r.id && st(r.id) !== null && mt(r.id, null);
  }), document.addEventListener("ln-ajax:success", function(g) {
    const o = (g.detail || {}).data;
    if (o && o.message) {
      const n = o.message;
      k(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const s = g.target.closest("[data-ln-modal]");
    s && s.lnModal && (s.id && st(s.id) !== null && mt(s.id, null), k(s, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(g) {
    const o = (g.detail || {}).data;
    if (o && o.message) {
      const s = o.message;
      k(window, "ln-toast:enqueue", {
        type: s.type || "error",
        title: s.title || "",
        message: typeof s == "string" ? s : s.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(g) {
    const r = g.detail || {};
    r.message && k(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: r.message
    });
  });
  function p(g) {
    return this.dom = g, this;
  }
  p.prototype.destroy = function() {
    delete this.dom[e];
  }, U(t, e, p, "ln-ui-coordinator", {
    attributes: i
  });
})();
function fr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, l = 0;
  for (let p = 0; p < t.length && i > 0; p++)
    l = p + 1, /[0-9]/.test(t[p]) && i--;
  return i > 0 && (l = t.length), l;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(r) {
    const o = r[e];
    o && (o.isTextElement ? o._initTextElement() : isNaN(o.value) || o._displayFormatted(o.value));
  }
  const l = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(r) {
    if (r[e]) return r[e];
    r[e] = this, this.dom = r;
    const o = this;
    if (this._onLocaleChange = function() {
      o.isTextElement ? o._formatTextContent() : isNaN(o.value) || o._displayFormatted(o.value);
    }, ae(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const s = document.createElement("input");
    s.type = "hidden", s.name = r.name, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && s.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.type = "text", r.setAttribute("inputmode", "decimal"), r.insertAdjacentElement("afterend", s), this._hidden = s, Object.defineProperty(s, "value", {
      get: function() {
        return p.get.call(s);
      },
      set: function(u) {
        if (p.set.call(s, u), u !== "" && !isNaN(parseFloat(u))) {
          const h = o.dom.getAttribute("data-ln-number-decimals");
          o._setDisplayRaw(ot(parseFloat(u), J(o.dom), { maxDecimals: h }));
        } else
          o._setDisplayRaw("");
        o.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), yn(r, p, {
      get: function() {
        return p.get.call(r);
      },
      set: function(u) {
        if (u === "") {
          o._setDisplayRaw(""), o._setHiddenRaw(""), r.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const h = typeof u == "number" ? u : parseFloat(String(u));
        if (isNaN(h))
          o._setDisplayRaw(String(u)), o._setHiddenRaw("");
        else {
          o._setHiddenRaw(h);
          const f = r.getAttribute("data-ln-number-decimals");
          o._setDisplayRaw(ot(h, J(r), { maxDecimals: f }));
        }
        r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      o._handleInput();
    }, r.addEventListener("input", this._onInput), this._onKeyDown = function(u) {
      if (u.key !== "Backspace") return;
      const h = r.selectionStart, f = r.selectionEnd;
      if (h !== f || h === 0) return;
      const E = oe(J(r)), w = p.get.call(r), m = w[h - 1];
      if (m === E.groupSep || /\s/.test(m)) {
        u.preventDefault();
        const y = h - 2 >= 0 ? h - 2 : 0, a = w.slice(0, y) + w.slice(h);
        p.set.call(r, a), r.setSelectionRange(y, y), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, r.addEventListener("keydown", this._onKeyDown), this._onPaste = function(u) {
      u.preventDefault();
      const h = (u.clipboardData || window.clipboardData).getData("text"), f = Xi(h, J(r));
      o.value = isNaN(f) ? NaN : f;
    }, r.addEventListener("paste", this._onPaste);
    const n = r.value;
    if (n !== "") {
      const u = parseFloat(n);
      if (!isNaN(u)) {
        const h = r.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(u), this._setDisplayRaw(ot(u, J(r), { maxDecimals: h })), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  g.prototype._initTextElement = function() {
    const r = this.dom;
    let o = r.getAttribute("data-ln-value"), s = r.getAttribute("data-ln-number"), n = null;
    o !== null && o !== "" ? n = o : s !== null && s !== "" && s !== "true" ? n = s : n = r.textContent.trim();
    const u = parseFloat(n);
    isNaN(u) ? this._rawValue = null : (this._rawValue = u, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", String(u)), this._formatTextContent());
  }, g.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = ot(this._rawValue, J(this.dom), { maxDecimals: r });
    }
  }, g.prototype._handleInput = function() {
    const r = this.dom, o = p.get.call(r);
    if (o === "") {
      this._setHiddenRaw(""), k(r, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (o === "-") {
      this._setHiddenRaw(""), k(r, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const s = r.selectionStart;
    let n = 0;
    for (let _ = 0; _ < s; _++)
      /[0-9]/.test(o[_]) && n++;
    const u = J(r), h = oe(u);
    let f = o, E = Un(o, h.groupSep, h.decimalSep), w = parseFloat(E);
    if (isNaN(w)) {
      this._setHiddenRaw(""), k(r, "ln-number:input", { value: NaN, formatted: o });
      return;
    }
    const m = r.getAttribute("data-ln-number-decimals"), y = E.indexOf(".");
    if (m !== null && y !== -1) {
      const _ = parseInt(m, 10), v = E.slice(y + 1);
      if (_ === 0)
        E = E.slice(0, y), f = f.split(h.decimalSep)[0], w = parseFloat(E), this._setDisplayRaw(f);
      else if (v.length > _) {
        E = E.slice(0, y + 1 + _);
        const A = f.split(h.decimalSep);
        f = A[0] + h.decimalSep + A[1].slice(0, _), w = parseFloat(E), this._setDisplayRaw(f);
      }
    }
    const a = r.getAttribute("data-ln-number-max");
    if (a !== null && w > parseFloat(a)) {
      const _ = parseFloat(a), v = ot(_, u, { maxDecimals: m });
      this._setDisplayRaw(v), this._setHiddenRaw(_), r.setSelectionRange(v.length, v.length), k(r, "ln-number:input", { value: _, formatted: v });
      return;
    }
    if (f.endsWith(h.decimalSep) || h.decimalSep !== "." && f.endsWith(".")) {
      this._setHiddenRaw(w), k(r, "ln-number:input", { value: w, formatted: f });
      return;
    }
    const b = E.indexOf(".");
    if (b !== -1 && E.slice(b + 1).endsWith("0")) {
      this._setHiddenRaw(w), k(r, "ln-number:input", { value: w, formatted: f });
      return;
    }
    let d;
    if (m !== null)
      d = ot(w, u, { maxDecimals: m });
    else {
      const _ = b !== -1 ? E.slice(b + 1).length : 0;
      d = ot(w, u, { userDecimals: _ });
    }
    this._setDisplayRaw(d);
    const c = fr(d, n);
    r.setSelectionRange(c, c), this._setHiddenRaw(w), k(r, "ln-number:input", { value: w, formatted: d });
  }, g.prototype._setHiddenRaw = function(r) {
    this._hidden && p.set.call(this._hidden, String(r));
  }, g.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : p.set.call(this.dom, String(r));
  }, g.prototype._displayFormatted = function(r) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const o = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(r, J(this.dom), { maxDecimals: o }));
    }
  }, Object.defineProperty(g.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const r = p.get.call(this._hidden);
      return r === "" ? NaN : parseFloat(r);
    },
    set: function(r) {
      const o = typeof r == "number" ? r : parseFloat(r);
      if (this.isTextElement) {
        isNaN(o) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = o, this.dom.setAttribute("data-ln-value", String(o)), this._formatTextContent());
        return;
      }
      if (isNaN(o)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(o);
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(ot(o, J(this.dom), { maxDecimals: s })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(g.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : p.get.call(this.dom);
    }
  }), g.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, U(t, e, g, "ln-number", {
    attributes: l,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Ce = /^(short|medium|long)(\s+datetime)?$/, hr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function pr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Ce) ? hr[t.trim()] : null;
}
function zt(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim();
  if (e.length < 6) return null;
  let i, l;
  if (e.indexOf(".") !== -1)
    i = ".", l = e.split(".");
  else if (e.indexOf("/") !== -1)
    i = "/", l = e.split("/");
  else if (e.indexOf("-") !== -1)
    i = "-", l = e.split("-");
  else
    return null;
  if (l.length !== 3) return null;
  const p = [];
  for (let n = 0; n < 3; n++) {
    const u = parseInt(l[n], 10);
    if (isNaN(u)) return null;
    p.push(u);
  }
  let g, r, o;
  i === "." ? (g = p[0], r = p[1], o = p[2]) : i === "/" ? (r = p[0], g = p[1], o = p[2]) : l[0].length === 4 ? (o = p[0], r = p[1], g = p[2]) : (g = p[0], r = p[1], o = p[2]), o < 100 && (o += o < 50 ? 2e3 : 1900);
  const s = new Date(o, r - 1, g);
  return s.getFullYear() !== o || s.getMonth() !== r - 1 || s.getDate() !== g ? null : s;
}
function me(t, e, i, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const p = t.getDate(), g = t.getMonth(), r = t.getFullYear(), o = t.getHours(), s = t.getMinutes();
  let n, u;
  const h = (i || "").toLowerCase().split("-")[0];
  let f = !1;
  try {
    const m = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    f = !!(l && m !== h);
  } catch {
    f = !!l;
  }
  if (f && l && l.monthsLong)
    n = l.monthsLong[g];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(g + 1);
    }
  if (f && l && l.monthsShort)
    u = l.monthsShort[g];
  else
    try {
      u = new Intl.DateTimeFormat(i, { month: "short" }).format(t);
    } catch {
      u = String(g + 1);
    }
  const E = {
    yyyy: String(r),
    yy: String(r).slice(-2),
    MMMM: n,
    MMM: u,
    MM: String(g + 1).padStart(2, "0"),
    M: String(g + 1),
    dd: String(p).padStart(2, "0"),
    d: String(p),
    HH: String(o).padStart(2, "0"),
    mm: String(s).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(w) {
    return E[w] !== void 0 ? E[w] : w;
  });
}
function Zt(t, e, i, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const p = pr(e);
  if (p)
    try {
      const g = new Intl.DateTimeFormat(i, p), r = (i || "").toLowerCase().split("-")[0], o = g.resolvedOptions().locale.toLowerCase().split("-")[0];
      return l && o !== r ? me(t, "dd.MM.yyyy", i, l) : g.format(t);
    } catch {
      return me(t, "dd.MM.yyyy", i, l);
    }
  return me(t, e || "dd.MM.yyyy", i, l);
}
(function() {
  const t = "data-ln-date", e = "lnDate";
  if (window[e] !== void 0) return;
  function i(n) {
    const u = n[e];
    if (u) {
      if (u.isTextElement)
        u._initTextElement();
      else if (u.value) {
        const h = it(u.value);
        h && u._displayFormatted(h);
      }
    }
  }
  const l = {
    "data-ln-date": { type: "enum", values: ["short", "medium", "long", "full", "iso"], fallback: "medium", effect: i, description: "Date display style preset or activator" },
    "data-ln-date-format": { type: "string", effect: i, description: "Custom Intl.DateTimeFormat pattern or options" },
    "data-ln-date-locale": { type: "string", effect: i, description: "BCP 47 language tag override for date formatting" },
    "data-ln-value": { type: "string", effect: i, description: "Raw ISO date string or timestamp for non-time elements (td, span)" },
    "data-ln-date-dict": { type: "marker", description: "Container for date translation dictionary" },
    "data-ln-date-dict-key": { type: "string", description: "Dictionary key for relative time or custom date formatting" },
    "data-ln-date-field": { type: "string", description: "Field name mapping for date record binding" },
    "data-ln-date-label": { type: "string", description: "Accessible label text for the date input" }
  }, p = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function g(n, u, h) {
    k(n.dom, "ln-date:change", {
      value: u,
      formatted: n.dom.value,
      date: h
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function r(n, u, h, f) {
    n._setHiddenRaw(u), p.set.call(n._picker, u), n._lastISO = u, f !== void 0 ? (n._isFormatting = !0, n.dom.value = f, n._isFormatting = !1) : h && n._displayFormatted(h), g(n, u, h);
  }
  function o(n) {
    n._setHiddenRaw(""), p.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", g(n, "", null);
  }
  function s(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const u = this;
    if (this._onLocaleChange = function() {
      if (u.isTextElement)
        u._formatTextContent();
      else if (u.value) {
        const d = it(u.value);
        d && u._displayFormatted(d);
      }
    }, ae(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const h = n.value, f = n.name, E = n.closest(".form-element, form") || n.parentNode;
    if (E) {
      const d = E.querySelectorAll("[data-ln-date-dict]");
      for (let c = 0; c < d.length; c++) {
        const _ = d[c].getAttribute("data-ln-date-dict");
        if (_) {
          const v = Sn(d[c], "data-ln-date-dict-key");
          v["months-long"] && (v.monthsLong = v["months-long"].split(",").map((A) => A.trim())), v["months-short"] && (v.monthsShort = v["months-short"].split(",").map((A) => A.trim())), An(_, v);
        }
      }
    }
    const w = document.createElement("span");
    w.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(w, n), w.appendChild(n), this._wrapper = w;
    const m = document.createElement("input");
    m.type = "hidden", m.name = f, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && m.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", m), this._hidden = m;
    const y = document.createElement("input");
    y.type = "date", y.tabIndex = -1, y.setAttribute("tabindex", "-1"), y.setAttribute("aria-hidden", "true"), y.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), y.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", m.insertAdjacentElement("afterend", y), this._picker = y, n.type = "text";
    const a = document.createElement("button");
    a.type = "button", a.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), a.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', y.insertAdjacentElement("afterend", a), this._btn = a, this._lastISO = "", Object.defineProperty(m, "value", {
      get: function() {
        return p.get.call(m);
      },
      set: function(d) {
        if (p.set.call(m, d), d && d !== "") {
          const c = it(d);
          c && r(u, d, c);
        } else d === "" && o(u);
      }
    }), yn(n, p, {
      get: function() {
        return p.get.call(n);
      },
      set: function(d, c) {
        if (u._isFormatting) {
          c(d);
          return;
        }
        if (!d || d === "") {
          c(""), o(u);
          return;
        }
        const _ = it(d) || zt(d);
        if (_) {
          const v = Mt(_), A = n.getAttribute(t) || "", S = J(n), T = Rt(S), x = Zt(_, A, S, T);
          c(x), r(u, v, _, x);
        } else
          c(String(d)), o(u);
      }
    }), this._onPickerChange = function() {
      const d = y.value;
      if (d) {
        const c = it(d);
        c && r(u, d, c);
      } else
        o(u);
    }, y.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const d = u.dom.value.trim();
      if (d === "") {
        u._lastISO !== "" && o(u);
        return;
      }
      if (u._lastISO) {
        const _ = it(u._lastISO);
        if (_) {
          const v = u.dom.getAttribute(t) || "", A = J(u.dom), S = Rt(A);
          if (d === Zt(_, v, A, S)) return;
        }
      }
      const c = zt(d);
      if (c) {
        const _ = Mt(c);
        r(u, _, c);
      } else if (u._lastISO) {
        const _ = it(u._lastISO);
        _ && u._displayFormatted(_);
      } else
        u.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      u._openPicker();
    }, a.addEventListener("click", this._onBtnClick);
    const b = n.form;
    if (b && (this._form = b, this._onFormReset = function() {
      setTimeout(function() {
        const d = u.dom.value;
        if (d) {
          const c = it(d) || zt(d);
          if (c) {
            const _ = Mt(c);
            r(u, _, c);
            return;
          }
        }
        o(u);
      }, 0);
    }, b.addEventListener("reset", this._onFormReset)), h && h !== "") {
      const d = it(h);
      d && r(u, h, d);
    }
    return this;
  }
  s.prototype._initTextElement = function() {
    const n = this.dom, u = n.getAttribute("data-ln-value"), h = n.getAttribute("data-ln-date"), f = n.getAttribute("datetime");
    let E = null;
    n.tagName === "TIME" && f !== null && f !== "" ? E = f : u !== null && u !== "" ? E = u : f !== null && f !== "" ? E = f : h !== null && h !== "" && h !== "true" && !Ce.test(h) ? E = h : E = n.textContent.trim();
    const w = it(E) || zt(E);
    if (w && !isNaN(w.getTime())) {
      const m = Mt(w);
      this._rawValue = m, n.tagName !== "TIME" && !n.hasAttribute("data-ln-value") && n.setAttribute("data-ln-value", m), this._formatTextContent();
    } else
      this._rawValue = null;
  }, s.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = it(this._rawValue);
      if (n) {
        let h = this.dom.getAttribute("data-ln-date-format");
        if (!h) {
          const w = this.dom.getAttribute("data-ln-date");
          w && Ce.test(w) && (h = w);
        }
        const f = J(this.dom), E = Rt(f);
        this.dom.textContent = Zt(n, h || "medium", f, E);
      }
    }
  }, s.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, s.prototype._setHiddenRaw = function(n) {
    p.set.call(this._hidden, n);
  }, s.prototype._displayFormatted = function(n) {
    const u = this.dom.getAttribute(t) || "", h = J(this.dom), f = Rt(h);
    this._isFormatting = !0, this.dom.value = Zt(n, u, h, f), this._isFormatting = !1;
  }, Object.defineProperty(s.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : p.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const h = it(n) || zt(n);
        if (!h) return;
        const f = Mt(h);
        this._rawValue = f, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", f) : this.dom.setAttribute("data-ln-value", f), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        o(this);
        return;
      }
      const u = it(n);
      u && r(this, n, u);
    }
  }), Object.defineProperty(s.prototype, "date", {
    get: function() {
      const n = this.value;
      return n ? it(n) : null;
    },
    set: function(n) {
      if (!n || !(n instanceof Date) || isNaN(n.getTime())) {
        this.value = "";
        return;
      }
      this.value = Mt(n);
    }
  }), Object.defineProperty(s.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), delete this.dom[e];
  }, U(t, e, s, "ln-date", {
    attributes: l,
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
  }, l = Y(i);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const o = history.pushState;
    history.pushState = function() {
      o.apply(history, arguments);
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
  function p(o) {
    return this.dom = o, Q(this, o, l), this.activeClass = o.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(o, { childList: !0, subtree: !0 }), this.update(), this;
  }
  p.prototype.update = function() {
    if (!this.activeClass || $(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const s = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, u = g(n), h = [];
    for (const f of s) {
      const E = f.getAttribute("href");
      if (!E || E === "#" || E.startsWith("#") || E.startsWith("javascript:") || E.startsWith("mailto:") || E.startsWith("tel:")) {
        f.classList.remove(this.activeClass), f.removeAttribute("aria-current");
        continue;
      }
      if (f.hostname && f.hostname !== window.location.hostname) {
        f.classList.remove(this.activeClass), f.removeAttribute("aria-current");
        continue;
      }
      const w = g(E), m = w === u, y = !this.exact && w !== "/" && u.startsWith(w + "/");
      m || y ? (f.classList.add(this.activeClass), f.setAttribute("aria-current", "page"), h.push(f)) : (f.classList.remove(this.activeClass), f.removeAttribute("aria-current"));
    }
    k(this.dom, "ln-nav:update", { target: this.dom, activeLinks: h });
  }, p.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const o = history._lnNavCallbacks.indexOf(this.updateHandler);
    o !== -1 && history._lnNavCallbacks.splice(o, 1), delete this.dom[e];
  };
  function g(o) {
    try {
      return new URL(o, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return o.replace(/\/$/, "") || "/";
    }
  }
  function r(o, s) {
    const n = o[e];
    if (n) {
      if (s === t) {
        if (!o.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const u = n.activeClass, h = o.getAttribute(t) || "active";
        if (u !== h) {
          const f = o.querySelectorAll("a");
          for (const E of f)
            u && E.classList.remove(u);
          n.activeClass = h;
        }
      }
      n.update();
    }
  }
  U(t, e, p, "ln-nav", {
    attributes: i
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(r, o) {
    const s = r.getAttribute("data-ln-persist"), n = s !== null && s !== "" ? s : r.id;
    return n ? r.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + o : "ln:" + n + ":" + o : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', r), null);
  }
  let i = null;
  function l() {
    if (i !== null) return i;
    try {
      if (typeof localStorage > "u") return i = !1;
      const r = "__ln_persist_test__";
      return localStorage.setItem(r, r), localStorage.removeItem(r), i = !0;
    } catch {
      return i = !1;
    }
  }
  const p = /* @__PURE__ */ new Set();
  function g(r, o) {
    const s = window.lnCore && window.lnCore._attrRegistry, n = s && s.persist || [];
    let u = null;
    for (let w = 0; w < n.length; w++)
      if (n[w].selector === o) {
        u = n[w];
        break;
      }
    if (!u) return;
    const h = u.persist;
    if (p.has(h.attr) || (p.add(h.attr), Xt([h.attr], function(w, m) {
      if (!w.hasAttribute("data-ln-persist") || h.hashActive && h.hashActive(w)) return;
      const y = e(w, m);
      if (!y || !l()) return;
      const a = w.getAttribute(m);
      try {
        a === null ? localStorage.removeItem(y) : localStorage.setItem(y, a);
      } catch {
      }
    })), h.hashActive && h.hashActive(r)) return;
    const f = e(r, h.attr);
    if (!f || !l()) return;
    const E = localStorage.getItem(f);
    E !== null && r.setAttribute(h.attr, E);
  }
  Ri(g);
})();
function en(t, e, i, l) {
  const p = (t || "").toLowerCase().trim();
  if (p) return p;
  if ((e || "").toUpperCase() !== "A") return "";
  const g = i || "";
  if (!g.startsWith("#")) return "";
  const r = g.slice(1);
  if (!r) return "";
  const o = r.split("&"), s = (l || "").toLowerCase().trim();
  if (s)
    for (const h of o) {
      const f = h.indexOf(":");
      if (f > 0 && h.slice(0, f).toLowerCase().trim() === s)
        return h.slice(f + 1).toLowerCase().trim();
    }
  const n = o[o.length - 1] || "", u = n.indexOf(":");
  return (u > 0 ? n.slice(u + 1) : n).toLowerCase().trim();
}
function nn(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (g) => (g.tagName || "").toUpperCase() === "A" && (g.href || "").startsWith("#")
  ), l = i.length > 0 && i.length === t.length, p = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : l && !p ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: l && !!p,
    warning: null
  };
}
function rn(t, e, i) {
  const l = (t || "").toLowerCase().trim();
  return l && Array.isArray(e) && e.includes(l) ? l : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(s) {
    const n = s.getAttribute("data-ln-tabs-active");
    s[e] && s[e]._applyActive(n);
  }
  function l(s, n) {
    return (s.getAttribute(n) || s.id || "").toLowerCase().trim();
  }
  const p = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: l, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, g = Y(p);
  function r(s) {
    return this.dom = s, Q(this, s, g), this.activeKey = null, o.call(this), this;
  }
  function o() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const s = this.tabs.map((h) => ({
      tagName: h.tagName,
      href: h.getAttribute("href")
    })), n = nn(s, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const h of this.tabs) {
      const f = en(h.getAttribute("data-ln-tab"), h.tagName, h.getAttribute("href"), this.nsKey);
      f ? this.mapTabs[f] = h : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', h);
    }
    for (const h of this.panels) {
      const f = (h.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      f && (this.mapPanels[f] = h);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const u = this;
    this._clickHandlers = [];
    for (const h of this.tabs) {
      if (h[e + "Trigger"]) continue;
      const f = function(E) {
        const w = h.tagName === "A";
        if (!w && (E.ctrlKey || E.metaKey || E.button === 1)) return;
        const m = en(h.getAttribute("data-ln-tab"), h.tagName, h.getAttribute("href"), u.nsKey);
        m && (w && !Fe(E) || (u.hashEnabled ? st(u.nsKey) === m ? u.dom.setAttribute("data-ln-tabs-active", m) : mt(u.nsKey, m) : u.dom.setAttribute("data-ln-tabs-active", m)));
      };
      h.addEventListener("click", f), h[e + "Trigger"] = f, u._clickHandlers.push({ el: h, handler: f });
    }
    if (this._onRequestSelect = function(h) {
      const f = h.detail && (h.detail.key || h.detail.tab);
      f && u.select(f);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!u.hashEnabled) return;
      const h = st(u.nsKey);
      u.dom.setAttribute("data-ln-tabs-active", h !== null ? h : u.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const h = rn(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", h);
    }
  }
  r.prototype.select = function(s) {
    const n = (s + "").toLowerCase().trim();
    n && (this.hashEnabled ? st(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : mt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, r.prototype._applyActive = function(s) {
    var u;
    if (s = rn(s, Object.keys(this.mapPanels), this.defaultKey), s === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && $(this.dom, "ln-tabs:before-change", {
      key: s,
      previousKey: n,
      tab: this.mapTabs[s],
      panel: this.mapPanels[s],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && st(this.nsKey) !== n && mt(this.nsKey, n));
      return;
    }
    this.activeKey = s;
    for (const h in this.mapTabs) {
      const f = this.mapTabs[h];
      h === s ? (f.setAttribute("data-active", ""), f.setAttribute("aria-selected", "true")) : (f.removeAttribute("data-active"), f.setAttribute("aria-selected", "false"));
    }
    for (const h in this.mapPanels) {
      const f = this.mapPanels[h], E = h === s;
      f.hidden = !E, f.classList.toggle("hidden", !E), f.setAttribute("aria-hidden", E ? "false" : "true");
    }
    if (this.autoFocus) {
      const h = (u = this.mapPanels[s]) == null ? void 0 : u.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      h && setTimeout(() => h.focus({ preventScroll: !0 }), 0);
    }
    k(this.dom, "ln-tabs:change", {
      key: s,
      previousKey: n,
      tab: this.mapTabs[s],
      panel: this.mapPanels[s],
      target: this.dom
    });
  }, r.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: s, handler: n } of this._clickHandlers)
        s.removeEventListener("click", n), delete s[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, U(t, e, r, "ln-tabs", {
    attributes: p,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(s) {
        const n = Array.from(s.querySelectorAll("[data-ln-tab]")).map(function(h) {
          return { tagName: h.tagName, href: h.getAttribute("href") };
        }), u = (s.getAttribute("data-ln-tabs-key") || s.id || "").toLowerCase().trim();
        return nn(n, u).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", l = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-toggle": { effect: f, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, g = /* @__PURE__ */ new Set();
  let r = null;
  function o(E, w) {
    return w === "open" ? "open" : w === "close" || E === "open" ? "close" : "open";
  }
  function s() {
    r || (r = function(E) {
      if (xe(E)) return;
      const w = E.target.closest("[" + i + "]");
      if (!w || Ie(w)) return;
      const m = w.getAttribute(i);
      if (!m) return;
      const y = document.getElementById(m);
      if (!y || !y[e]) return;
      E.preventDefault();
      const a = w.getAttribute(l) || "toggle", b = y.getAttribute(t);
      y.setAttribute(t, o(b, a));
    }, document.addEventListener("click", r));
  }
  function n() {
    g.size > 0 || !r || (document.removeEventListener("click", r), r = null);
  }
  function u(E, w) {
    if (!E || !E.id) return;
    const m = document.querySelectorAll(
      "[" + i + '="' + E.id + '"]'
    );
    for (let y = 0; y < m.length; y++)
      m[y].setAttribute("aria-expanded", w ? "true" : "false");
  }
  function h(E) {
    this.dom = E;
    const w = this;
    return this._onRequestOpen = function() {
      w.open();
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function() {
      w.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = E.getAttribute(t) === "open", this.isOpen && E.classList.add("open"), u(E, this.isOpen), g.add(this), s(), this;
  }
  h.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, h.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, h.prototype.toggle = function() {
    const E = this.dom.getAttribute(t);
    this.dom.setAttribute(t, o(E, "toggle"));
  }, h.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), g.delete(this), delete this.dom[e], n());
  };
  function f(E) {
    const w = E[e];
    if (!w) return;
    const y = E.getAttribute(t) === "open";
    if (y !== w.isOpen)
      if (y) {
        if ($(E, "ln-toggle:before-open", { target: E }).defaultPrevented) {
          E.setAttribute(t, "close");
          return;
        }
        w.isOpen = !0, E.classList.add("open"), u(E, !0), k(E, "ln-toggle:open", { target: E });
      } else {
        if ($(E, "ln-toggle:before-close", { target: E }).defaultPrevented) {
          E.setAttribute(t, "open");
          return;
        }
        w.isOpen = !1, E.classList.remove("open"), u(E, !1), k(E, "ln-toggle:close", { target: E });
      }
  }
  U(t, e, h, "ln-toggle", {
    attributes: p,
    persist: { attr: t, hashActive: null }
  });
})();
(function() {
  const t = "data-ln-accordion", e = "lnAccordion";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-accordion": { type: "marker", description: "Identifies container as an accordion that coordinates single-panel expansion" }
  };
  function l(p) {
    return this.dom = p, this._onToggleOpen = function(g) {
      if (!g.detail || !g.detail.target || g.detail.target.closest("[data-ln-accordion]") !== p) return;
      const r = p.querySelectorAll("[data-ln-toggle]");
      for (const o of r)
        o !== g.detail.target && o.closest("[data-ln-accordion]") === p && o.getAttribute("data-ln-toggle") === "open" && o.setAttribute("data-ln-toggle", "close");
      k(p, "ln-accordion:change", { target: g.detail.target });
    }, p.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, U(t, e, l, "ln-accordion", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-dropdown", e = "lnDropdown", i = "bottom-end";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-dropdown": { type: "marker", description: "Initializes the dropdown container" },
    "data-ln-dropdown-position": { prop: "position", type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: i, description: "Preferred positioning anchor" },
    "data-ln-dropdown-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" },
    "data-ln-dropdown-menu": { type: "marker", description: "Dropdown menu element containing items" }
  }, p = Y(l);
  function g(r) {
    this.dom = r, Q(this, r, p), this.toggleEl = r.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = r.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const o = this;
    return this._onRequestOpen = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      o.toggleEl && o.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (o.toggleEl) {
        const s = o.toggleEl.getAttribute("data-ln-toggle");
        o.toggleEl.setAttribute("data-ln-toggle", s === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(s) {
      const n = o.toggleEl && o.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (s.key === "Escape") {
        n && (s.preventDefault(), s.stopPropagation(), o.toggleEl.setAttribute("data-ln-toggle", "close"), o.triggerBtn && o.triggerBtn.focus());
        return;
      }
      if (s.key === "Tab") {
        n && (o.triggerBtn && o.triggerBtn.focus(), o.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const u = o._getMenuItems();
      if (u.length === 0) return;
      if (!n && (s.key === "ArrowDown" || s.key === "ArrowUp")) {
        s.preventDefault(), o.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const f = o._getMenuItems();
          f.length > 0 && o._focusItem(f, s.key === "ArrowDown" ? 0 : f.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const h = u.indexOf(document.activeElement);
      if (s.key === "ArrowDown") {
        s.preventDefault();
        const f = h < u.length - 1 ? h + 1 : 0;
        o._focusItem(u, f);
      } else if (s.key === "ArrowUp") {
        s.preventDefault();
        const f = h > 0 ? h - 1 : u.length - 1;
        o._focusItem(u, f);
      } else s.key === "Home" ? (s.preventDefault(), o._focusItem(u, 0)) : s.key === "End" && (s.preventDefault(), o._focusItem(u, u.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(s) {
      !s.detail || s.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "true"), typeof o.toggleEl.showPopover == "function" && o.toggleEl.showPopover(), o._initMenuAria(), o._reposition(), o._addOutsideClickListener(), o._addScrollRepositionListener(), o._addResizeCloseListener(), k(r, "ln-dropdown:open", { target: s.detail.target }));
    }, this._onToggleClose = function(s) {
      !s.detail || s.detail.target !== o.toggleEl || (o.triggerBtn && o.triggerBtn.setAttribute("aria-expanded", "false"), o._removeOutsideClickListener(), o._removeScrollRepositionListener(), o._removeResizeCloseListener(), o.toggleEl.style.top = "", o.toggleEl.style.left = "", o.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof o.toggleEl.hidePopover == "function" && o.toggleEl.matches(":popover-open") && o.toggleEl.hidePopover(), k(r, "ln-dropdown:close", { target: s.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  g.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const r = this.toggleEl.querySelectorAll("li");
    for (const s of r)
      s.setAttribute("role", "none");
    const o = this._getMenuItems();
    for (let s = 0; s < o.length; s++)
      o[s].setAttribute("role", "menuitem"), o[s].setAttribute("tabindex", s === 0 ? "0" : "-1");
  }, g.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, g.prototype._focusItem = function(r, o) {
    for (let s = 0; s < r.length; s++)
      r[s].setAttribute("tabindex", s === o ? "0" : "-1");
    r[o] && r[o].focus();
  }, g.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const r = this.triggerBtn.getBoundingClientRect(), o = ve(this.toggleEl), s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, u = re(r, o, n, s);
    this.toggleEl.style.top = u.top + "px", this.toggleEl.style.left = u.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", u.placement);
  }, g.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const r = this;
    this._boundDocClick = function(o) {
      r.dom.contains(o.target) || r.toggleEl && r.toggleEl.contains(o.target) || r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, r._docClickTimeout = setTimeout(function() {
      r._docClickTimeout = null, document.addEventListener("click", r._boundDocClick);
    }, 0);
  }, g.prototype._removeOutsideClickListener = function() {
    this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null);
  }, g.prototype._addScrollRepositionListener = function() {
    const r = this;
    this._boundScrollReposition = function() {
      r._reposition();
    }, window.addEventListener("scroll", this._boundScrollReposition, { passive: !0, capture: !0 });
  }, g.prototype._removeScrollRepositionListener = function() {
    this._boundScrollReposition && (window.removeEventListener("scroll", this._boundScrollReposition, { capture: !0 }), this._boundScrollReposition = null);
  }, g.prototype._addResizeCloseListener = function() {
    const r = this;
    this._boundResizeClose = function() {
      r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
    }, window.addEventListener("resize", this._boundResizeClose);
  }, g.prototype._removeResizeCloseListener = function() {
    this._boundResizeClose && (window.removeEventListener("resize", this._boundResizeClose), this._boundResizeClose = null);
  }, g.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.removeEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.removeEventListener("keydown", this._onKeydown), this._removeOutsideClickListener(), this._removeScrollRepositionListener(), this._removeResizeCloseListener(), this.toggleEl && typeof this.toggleEl.hidePopover == "function" && this.toggleEl.matches(":popover-open") && this.toggleEl.hidePopover(), this.toggleEl && (this.toggleEl.removeAttribute("data-ln-dropdown-placement"), this.toggleEl.removeEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.removeEventListener("ln-toggle:close", this._onToggleClose)), delete this.dom[e]);
  }, U(t, e, g, "ln-dropdown", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", l = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: h, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, g = [];
  let r = null;
  function o() {
    r || (r = function(f) {
      if (f.key !== "Escape" || g.length === 0) return;
      g[g.length - 1].close();
    }, document.addEventListener("keydown", r));
  }
  function s() {
    g.length > 0 || r && (document.removeEventListener("keydown", r), r = null);
  }
  function n(f) {
    this.dom = f, this.isOpen = f.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const E = this;
    return this._onRequestOpen = function(w) {
      const m = w.detail && w.detail.trigger ? w.detail.trigger : null;
      E.open(m);
    }, this._onRequestClose = function() {
      E.close();
    }, this._onRequestToggle = function(w) {
      const m = w.detail && w.detail.trigger ? w.detail.trigger : null;
      E.toggle(m);
    }, this._onNativeToggle = function(w) {
      w.newState === "closed" && E.isOpen && (E._applyClose(), E.dom.setAttribute(t, "closed"));
    }, f.addEventListener("ln-popover:request-open", this._onRequestOpen), f.addEventListener("ln-popover:request-close", this._onRequestClose), f.addEventListener("ln-popover:request-toggle", this._onRequestToggle), f.addEventListener("toggle", this._onNativeToggle), f.hasAttribute("tabindex") || f.setAttribute("tabindex", "-1"), f.hasAttribute("role") || f.setAttribute("role", "dialog"), f.hasAttribute("popover") || f.setAttribute("popover", "manual"), this.isOpen && this._applyOpen(null), this;
  }
  n.prototype.open = function(f) {
    this.isOpen || (this.trigger = f || null, this.dom.setAttribute(t, "open"));
  }, n.prototype.close = function() {
    this.isOpen && this.dom.setAttribute(t, "closed");
  }, n.prototype.toggle = function(f) {
    this.isOpen ? this.close() : this.open(f);
  }, n.prototype._applyOpen = function(f) {
    this.isOpen = !0, f && (this.trigger = f), this._previousFocus = document.activeElement, typeof this.dom.showPopover == "function" && this.dom.showPopover();
    const E = ve(this.dom);
    if (this.trigger) {
      const a = this.trigger.getBoundingClientRect(), b = this.dom.getAttribute(l) || "bottom", d = re(a, E, b, 8);
      this.dom.style.top = d.top + "px", this.dom.style.left = d.left + "px", this.dom.setAttribute("data-ln-popover-placement", d.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const w = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), m = Array.prototype.find.call(w, Wt);
    m ? m.focus() : this.dom.focus();
    const y = this;
    this._boundDocClick = function(a) {
      y.dom.contains(a.target) || y.trigger && y.trigger.contains(a.target) || y.close();
    }, y._docClickTimeout = setTimeout(function() {
      y._docClickTimeout = null, document.addEventListener("click", y._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!y.trigger) return;
      const a = y.trigger.getBoundingClientRect(), b = ve(y.dom), d = y.dom.getAttribute(l) || "bottom", c = re(a, b, d, 8);
      y.dom.style.top = c.top + "px", y.dom.style.left = c.left + "px", y.dom.setAttribute("data-ln-popover-placement", c.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), g.push(this), o(), k(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const f = g.indexOf(this);
    f !== -1 && g.splice(f, 1), s(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, k(this.dom, "ln-popover:close", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    }), this.trigger = null;
  }, n.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-popover:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-popover:request-close", this._onRequestClose), this.dom.removeEventListener("ln-popover:request-toggle", this._onRequestToggle), this.dom.removeEventListener("toggle", this._onNativeToggle), this.isOpen && this._applyClose(), delete this.dom[e]);
  };
  function u(f) {
    this.dom = f;
    const E = f.getAttribute(i);
    return f.setAttribute("aria-haspopup", "dialog"), f.setAttribute("aria-expanded", "false"), f.setAttribute("aria-controls", E), this._onClick = function(w) {
      if (w.ctrlKey || w.metaKey || w.button === 1) return;
      w.preventDefault();
      const m = document.getElementById(E);
      if (!m) return;
      m[e] && (m[e].trigger = f);
      const y = m.getAttribute(t);
      m.setAttribute(t, y === "open" ? "closed" : "open");
    }, f.addEventListener("click", this._onClick), this;
  }
  u.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function h(f) {
    const E = f[e];
    if (!E) return;
    const m = f.getAttribute(t) === "open";
    if (m !== E.isOpen)
      if (m) {
        if ($(f, "ln-popover:before-open", {
          popoverId: f.id,
          target: f,
          trigger: E.trigger
        }).defaultPrevented) {
          f.setAttribute(t, "closed");
          return;
        }
        E._applyOpen(E.trigger);
      } else {
        if ($(f, "ln-popover:before-close", {
          popoverId: f.id,
          target: f,
          trigger: E.trigger
        }).defaultPrevented) {
          f.setAttribute(t, "open");
          return;
        }
        E._applyClose();
      }
  }
  U(t, e, n, "ln-popover", {
    attributes: p
  }), U(i, e + "Trigger", u, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", l = "lnTooltipEnhance", p = "ln-tooltip-portal";
  if (window[l] !== void 0) return;
  const g = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let r = 0, o = null, s = null, n = null, u = null, h = null, f = null;
  function E() {
    return o && o.parentNode || (o = document.getElementById(p), o || (o = document.createElement("div"), o.id = p, document.body.appendChild(o)), o.hasAttribute("popover") || o.setAttribute("popover", "manual")), o;
  }
  function w() {
    f || (f = function(d) {
      d.key === "Escape" && a();
    }, document.addEventListener("keydown", f));
  }
  function m() {
    f && (document.removeEventListener("keydown", f), f = null);
  }
  function y(d) {
    if (n === d) return;
    a();
    const c = d.getAttribute(e) || d.getAttribute("title");
    if (!c) return;
    E(), typeof o.showPopover == "function" && o.showPopover(), d.hasAttribute("title") && (u = d.getAttribute("title"), d.removeAttribute("title"));
    const _ = d.getAttribute("aria-describedby");
    _ ? h = _ : h = null;
    const v = document.createElement("div");
    v.className = "ln-tooltip", v.textContent = c, d[l + "Uid"] || (r += 1, d[l + "Uid"] = "ln-tooltip-" + r), v.id = d[l + "Uid"], o.appendChild(v);
    const A = v.offsetWidth, S = v.offsetHeight, T = d.getBoundingClientRect(), x = d.getAttribute(i) || "top", I = re(T, { width: A, height: S }, x, 6);
    v.style.top = I.top + "px", v.style.left = I.left + "px", v.setAttribute("data-ln-tooltip-placement", I.placement), h ? d.setAttribute("aria-describedby", h + " " + v.id) : d.setAttribute("aria-describedby", v.id), s = v, n = d, w();
  }
  function a() {
    if (!s) {
      m();
      return;
    }
    n && (h !== null ? n.setAttribute("aria-describedby", h) : n.removeAttribute("aria-describedby"), h = null, u !== null && n.setAttribute("title", u)), u = null, s.parentNode && s.parentNode.removeChild(s), s = null, n = null, o && typeof o.hidePopover == "function" && o.matches(":popover-open") && o.hidePopover(), m();
  }
  function b(d) {
    return this.dom = d, d.hasAttribute("data-ln-tooltip-enhanced") || (d.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      y(d);
    }, this._onLeave = function() {
      n === d && !d.contains(document.activeElement) && a();
    }, this._onFocus = function() {
      y(d);
    }, this._onBlur = function() {
      n === d && !d.matches(":hover") && a();
    }, d.addEventListener("mouseenter", this._onEnter), d.addEventListener("mouseleave", this._onLeave), d.addEventListener("focus", this._onFocus, !0), d.addEventListener("blur", this._onBlur, !0), this;
  }
  b.prototype.destroy = function() {
    const d = this.dom;
    d.removeEventListener("mouseenter", this._onEnter), d.removeEventListener("mouseleave", this._onLeave), d.removeEventListener("focus", this._onFocus, !0), d.removeEventListener("blur", this._onBlur, !0), n === d && a(), this._addedEnhancedAttr && d.removeAttribute("data-ln-tooltip-enhanced"), delete d[l], delete d[l + "Uid"];
  }, U(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    l,
    b,
    "ln-tooltip",
    {
      attributes: g
    }
  );
})();
(function() {
  const t = "data-ln-toast", e = "lnToast", i = "ln-toast-item";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-toast": { type: "marker", description: "Initializes the toast notifications container" },
    "data-ln-toast-timeout": { prop: "timeoutDefault", type: "integer", read: xt, fallback: 6e3, min: 500, description: "Default auto-dismiss timeout in ms" },
    "data-ln-toast-max": { prop: "max", type: "integer", read: xt, fallback: 5, min: 1, description: "Maximum visible concurrent toast notifications" },
    "data-ln-toast-close": { type: "trigger", description: "Click dismiss trigger inside a toast item" },
    "data-ln-toast-item": { type: "marker", description: "Individual toast notification element" }
  }, p = Y(l);
  function g(y) {
    if (!(!y || !(y instanceof HTMLElement)) && (y.hasAttribute("popover") || y.setAttribute("popover", "manual"), typeof y.showPopover == "function")) {
      if (y.matches(":popover-open"))
        try {
          y.hidePopover();
        } catch {
        }
      try {
        y.showPopover();
      } catch {
      }
    }
  }
  function r(y) {
    if (!y || !(y instanceof HTMLElement)) return;
    if (y.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof y.hidePopover == "function" && y.matches(":popover-open"))
      try {
        y.hidePopover();
      } catch {
      }
  }
  function o(y) {
    this.dom = y, Q(this, y, p);
    const a = Array.from(y.querySelectorAll("[data-ln-toast-item]"));
    for (; a.length > this.max; ) y.removeChild(a.shift());
    for (const b of a) E(b, this);
    return a.length > 0 && g(y), this;
  }
  o.prototype.enqueue = function(y) {
    if (!y) return;
    const a = s(y, this.dom);
    if (!a) return;
    const b = Number.isFinite(y.timeout) ? y.timeout : this.timeoutDefault;
    u(this, a), b > 0 && (a._timer = setTimeout(() => h(a), b));
  }, o.prototype.clear = function() {
    for (const y of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      h(y);
  }, o.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const y of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        h(y);
      r(this.dom), delete this.dom[e];
    }
  };
  function s(y, a) {
    const b = ((y.type || "") + "").trim().toLowerCase(), d = Lt(a, i, "ln-toast");
    if (!d)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    ut(d, {
      type: b,
      title: y.title,
      message: typeof y.message == "string" ? y.message : void 0
    });
    const c = d.firstElementChild;
    if (!c) return null;
    c.hasAttribute("data-ln-toast-item") || c.setAttribute("data-ln-toast-item", ""), c.classList.add("ln-enter");
    const _ = c.querySelector(".body");
    _ && n(_, y);
    const v = c.querySelector("[data-ln-toast-close]");
    return v && v.addEventListener("click", function() {
      h(c);
    }), c;
  }
  function n(y, a) {
    if (Array.isArray(a.message)) {
      const b = document.createElement("ul");
      for (const d of a.message) {
        const c = document.createElement("li");
        c.textContent = d, b.appendChild(c);
      }
      y.appendChild(b);
    }
    if (a.data && a.data.errors) {
      const b = document.createElement("ul");
      for (const d of Object.values(a.data.errors).flat()) {
        const c = document.createElement("li");
        c.textContent = d, b.appendChild(c);
      }
      y.appendChild(b);
    }
  }
  function u(y, a) {
    const b = Array.from(y.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; b.length >= y.max && b.length > 0; ) y.dom.removeChild(b.shift());
    y.dom.appendChild(a), g(y.dom), requestAnimationFrame(() => a.classList.remove("ln-enter"));
  }
  function h(y) {
    if (!y || !y.parentNode) return;
    const a = y.parentNode;
    clearTimeout(y._timer), y.classList.remove("ln-enter"), y.classList.add("ln-out"), setTimeout(() => {
      y.parentNode && (y.parentNode.removeChild(y), r(a));
    }, 200);
  }
  function f(y) {
    let a = y && y.container;
    return typeof a == "string" && (a = document.querySelector(a)), a instanceof HTMLElement || (a = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), a || null;
  }
  function E(y, a) {
    if (y._lnToastHydrated) return;
    y._lnToastHydrated = !0;
    const b = y.querySelector("[data-ln-toast-close]");
    b && b.addEventListener("click", function() {
      h(y);
    });
    const d = +(y.getAttribute("data-ln-toast-timeout") ?? a.timeoutDefault);
    d > 0 && (y._timer = setTimeout(function() {
      h(y);
    }, d));
  }
  function w(y) {
    const a = y.detail || {}, b = f(a);
    if (!b) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (b[e] || (b[e] = new o(b))).enqueue(a);
  }
  function m(y) {
    const a = y && y.detail || {};
    if (a.container) {
      const b = f(a);
      b && (b[e] || (b[e] = new o(b))).clear();
    } else {
      const b = document.querySelectorAll("[" + t + "]");
      for (const d of Array.from(b))
        (d[e] || (d[e] = new o(d))).clear();
    }
  }
  ft(function() {
    window.addEventListener("ln-toast:enqueue", w), window.addEventListener("ln-toast:clear", m), window.addEventListener("ln-modal:open", function() {
      const y = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const a of Array.from(y))
        a.querySelectorAll("[data-ln-toast-item]").length > 0 && g(a);
    });
  }, "ln-toast"), U(t, e, o, "ln-toast", {
    attributes: l
  });
})();
function mr(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function ri(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function gr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = ri(t.name), l = String(t.type || "").toLowerCase();
  return e.some((p) => {
    if (p.includes("/")) {
      if (p.endsWith("/*")) {
        const g = p.slice(0, -1);
        return l.startsWith(g);
      }
      return l === p;
    }
    return i === p;
  });
}
function _r(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const l = 1024, p = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], g = Math.floor(Math.log(t) / Math.log(l)), r = Math.min(g, p.length - 1), o = t / Math.pow(l, r);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(o) + " " + p[r];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", l = "file_ids[]";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-upload": { prop: "uploadUrl", read: K, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: K, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: K, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: K, type: "string", fallback: l, description: "Form field name for submitting uploaded file IDs" },
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
  }, g = Y(p);
  function r(n, u, h) {
    return _r(n, u, h);
  }
  function o() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function s(n) {
    this.dom = n, Q(this, n, g), this.dict = Sn(n, "data-ln-upload-dict"), this.locale = J(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const u = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = mr(u), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  s.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const u = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let f = 0; f < u.length; f++) {
      const E = u[f], w = E.getAttribute("data-ln-upload-id"), m = "file-" + ++n.fileIdCounter;
      E.setAttribute("data-ln-upload-local-id", m);
      const y = E.querySelector('[data-ln-field="name"]'), a = E.querySelector('[data-ln-field="sizeText"]'), b = E.getAttribute("data-ln-upload-size"), d = b ? parseInt(b, 10) : null;
      n.uploadedFiles.set(m, {
        serverId: w || null,
        name: y ? y.textContent.trim() : "",
        size: d !== null && !isNaN(d) ? d : a ? a.textContent.trim() : ""
      });
    }
    const h = this.dom.querySelectorAll('input[type="hidden"]');
    for (let f = 0; f < h.length; f++) {
      const E = h[f];
      if (E.name === n.idsFieldName && E.value && !Array.from(n.uploadedFiles.values()).some(function(m) {
        return String(m.serverId) === String(E.value);
      })) {
        const m = "file-" + ++n.fileIdCounter;
        n.uploadedFiles.set(m, {
          serverId: E.value,
          name: "",
          size: ""
        });
      }
    }
    this._syncHiddenInputs();
  }, s.prototype._syncHiddenInputs = function() {
    const n = this, u = this.dom.querySelectorAll('input[type="hidden"]');
    for (let h = 0; h < u.length; h++)
      u[h].name === n.idsFieldName && u[h].remove();
    for (const [, h] of this.uploadedFiles)
      if (h.serverId) {
        const f = document.createElement("input");
        f.type = "hidden", f.name = n.idsFieldName, f.value = h.serverId, n.dom.appendChild(f);
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
      const h = u.target.closest('[data-ln-upload-action="remove"]');
      if (!h || !n.list || !n.list.contains(h) || h.disabled) return;
      const f = h.closest("[data-ln-upload-item]");
      if (f) {
        const E = f.getAttribute("data-ln-upload-local-id");
        E && n.remove(E);
      }
    }, this._onRequestUpload = function(u) {
      u.detail && u.detail.files && n.upload(u.detail.files);
    }, this._onRequestRemove = function(u) {
      if (u.detail) {
        const h = u.detail.localId !== void 0 ? u.detail.localId : u.detail.serverId;
        h !== void 0 && n.remove(h);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, s.prototype.upload = function(n) {
    const u = this, h = Array.from(n);
    for (let f = 0; f < h.length; f++) {
      const E = h[f];
      if (u.maxFiles > 0 && u.uploadedFiles.size >= u.maxFiles) {
        k(u.dom, "ln-upload:invalid", {
          file: E,
          reason: "max-files"
        });
        continue;
      }
      if (!gr(E, u.allowedExts)) {
        k(u.dom, "ln-upload:invalid", {
          file: E,
          reason: "accept"
        });
        continue;
      }
      if (u.maxSize > 0 && E.size > u.maxSize) {
        k(u.dom, "ln-upload:invalid", {
          file: E,
          reason: "max-size"
        });
        continue;
      }
      $(u.dom, "ln-upload:before-upload", { file: E }).defaultPrevented || u._uploadSingleFile(E);
    }
  }, s.prototype._uploadSingleFile = function(n) {
    const u = this, h = "file-" + ++u.fileIdCounter, f = ri(n.name);
    let E = null;
    if (this.list) {
      const b = Lt(this.dom, "ln-upload-item", "ln-upload");
      if (b && (E = b.firstElementChild, E)) {
        E.setAttribute("data-ln-upload-item", ""), E.setAttribute("data-ln-upload-local-id", h), E.setAttribute("data-ln-upload-ext", f), E.setAttribute("data-ln-upload-state", "uploading"), ut(E, {
          name: n.name,
          sizeText: "0%",
          removeLabel: u.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const d = E.querySelector('[data-ln-upload-action="remove"]');
        d && (d.disabled = !0);
        const c = E.querySelector("[data-ln-progress]");
        c && c.setAttribute("data-ln-progress", "0"), u.list.appendChild(E);
      }
    }
    const w = new FormData();
    w.append(u.fileFieldName, n);
    const m = this.dom.querySelectorAll("input, select, textarea");
    for (let b = 0; b < m.length; b++) {
      const d = m[b];
      !d.name || d.name === u.idsFieldName || d.type === "file" || (d.type === "checkbox" || d.type === "radio") && !d.checked || w.append(d.name, d.value);
    }
    const y = new XMLHttpRequest();
    u.uploadedFiles.set(h, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: y
    }), y.upload.addEventListener("progress", function(b) {
      if (b.lengthComputable) {
        const d = Math.round(b.loaded / b.total * 100);
        if (E) {
          const c = E.querySelector("[data-ln-progress]");
          c && c.setAttribute("data-ln-progress", String(d)), ut(E, { sizeText: d + "%" });
        }
        k(u.dom, "ln-upload:progress", {
          localId: h,
          file: n,
          percent: d,
          loaded: b.loaded,
          total: b.total
        });
      }
    }), y.addEventListener("load", function() {
      const b = u.uploadedFiles.get(h);
      if (b && delete b.xhr, y.status >= 200 && y.status < 300) {
        let d;
        try {
          d = JSON.parse(y.responseText);
        } catch (_) {
          a(u.dict.error || "Error", y.status, _);
          return;
        }
        const c = d.id || d.serverId;
        if (E) {
          E.removeAttribute("data-ln-upload-state"), c && E.setAttribute("data-ln-upload-id", String(c)), ut(E, {
            sizeText: r(d.size || n.size, u.locale, u.dict),
            uploading: !1
          });
          const _ = E.querySelector('[data-ln-upload-action="remove"]');
          _ && (_.disabled = !1);
        }
        b && (b.serverId = c, b.size = d.size || n.size, b.name = d.name || n.name), u._syncHiddenInputs(), k(u.dom, "ln-upload:uploaded", {
          localId: h,
          serverId: c,
          name: d.name || n.name,
          size: d.size || n.size,
          response: d
        });
      } else {
        let d = "";
        try {
          d = JSON.parse(y.responseText).message || "";
        } catch {
        }
        a(d, y.status, null);
      }
    }), y.addEventListener("error", function() {
      const b = u.uploadedFiles.get(h);
      b && delete b.xhr, a("", 0, null);
    });
    function a(b, d, c) {
      if (E) {
        E.setAttribute("data-ln-upload-state", "error"), ut(E, {
          sizeText: u.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const _ = E.querySelector('[data-ln-upload-action="remove"]');
        _ && (_.disabled = !1);
      }
      k(u.dom, "ln-upload:error", {
        file: n,
        message: b,
        status: d,
        error: c
      });
    }
    u.uploadUrl ? (y.open("POST", u.uploadUrl), y.setRequestHeader("X-CSRF-TOKEN", o()), y.setRequestHeader("X-Requested-With", "XMLHttpRequest"), y.setRequestHeader("Accept", "application/json"), y.send(w)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, s.prototype.remove = function(n) {
    const u = this;
    let h = null, f = null;
    if (u.uploadedFiles.has(n))
      h = n, f = u.uploadedFiles.get(n);
    else
      for (const [y, a] of u.uploadedFiles)
        if (String(a.serverId) === String(n)) {
          h = y, f = a;
          break;
        }
    if (!h || !f || $(u.dom, "ln-upload:before-remove", {
      localId: h,
      serverId: f.serverId
    }).defaultPrevented) return;
    const w = u.list ? u.list.querySelector('[data-ln-upload-local-id="' + h + '"]') : null;
    if (f.xhr && typeof f.xhr.abort == "function" && f.xhr.abort(), !f.serverId) {
      w && w.remove(), u.uploadedFiles.delete(h), u._syncHiddenInputs(), k(u.dom, "ln-upload:removed", { localId: h, serverId: null });
      return;
    }
    let m = null;
    if (u.deleteUrlPattern ? m = u.deleteUrlPattern.replace("{id}", encodeURIComponent(f.serverId)) : u.uploadUrl && u.uploadUrl.includes("{id}") && (m = u.uploadUrl.replace("{id}", encodeURIComponent(f.serverId))), !m) {
      w && w.remove(), u.uploadedFiles.delete(h), u._syncHiddenInputs(), k(u.dom, "ln-upload:removed", { localId: h, serverId: f.serverId });
      return;
    }
    w && (w.setAttribute("data-ln-upload-state", "deleting"), ut(w, { deleting: !0 })), fetch(m, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": o(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(y) {
      y.ok ? (w && w.remove(), u.uploadedFiles.delete(h), u._syncHiddenInputs(), k(u.dom, "ln-upload:removed", {
        localId: h,
        serverId: f.serverId
      })) : (w && (w.removeAttribute("data-ln-upload-state"), ut(w, { deleting: !1 })), k(u.dom, "ln-upload:error", {
        file: f,
        message: "",
        status: y.status
      }));
    }).catch(function(y) {
      w && (w.removeAttribute("data-ln-upload-state"), ut(w, { deleting: !1 })), k(u.dom, "ln-upload:error", {
        file: f,
        message: "",
        status: 0,
        error: y
      });
    });
  }, s.prototype.clear = function() {
    const n = this;
    if (!$(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, h] of this.uploadedFiles)
        if (h.xhr && typeof h.xhr.abort == "function" && h.xhr.abort(), h.serverId) {
          let f = null;
          n.deleteUrlPattern ? f = n.deleteUrlPattern.replace("{id}", encodeURIComponent(h.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (f = n.uploadUrl.replace("{id}", encodeURIComponent(h.serverId))), f && fetch(f, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": o(),
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
  }, U(t, e, s, "ln-upload", {
    attributes: p
  });
})();
function oi(t, e) {
  if (t.length !== 1) return t;
  const i = t.charCodeAt(0);
  if (i >= 65 && i <= 90) {
    const l = ((i - 65 + e) % 26 + 26) % 26;
    return String.fromCharCode(65 + l);
  }
  if (i >= 97 && i <= 122) {
    const l = ((i - 97 + e) % 26 + 26) % 26;
    return String.fromCharCode(97 + l);
  }
  if (i >= 48 && i <= 57) {
    const l = ((i - 48 + e) % 10 + 10) % 10;
    return String.fromCharCode(48 + l);
  }
  return t;
}
function si(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let l = "";
    const p = i.length;
    for (let g = 0; g < p; g++)
      l += String.fromCharCode(i[g]);
    return btoa(l);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function ai(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), l = new Uint8Array(i.length);
      for (let p = 0; p < i.length; p++)
        l[p] = i.charCodeAt(p);
      return new TextDecoder().decode(l);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function li(t, e) {
  const i = String(e || "ln-ashlar");
  let l;
  typeof TextEncoder < "u" ? l = new TextEncoder().encode(i) : typeof Buffer < "u" ? l = Buffer.from(i, "utf-8") : l = [108, 110];
  const p = l.length || 1, g = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    g[r] = t[r] ^ l[r % p];
  return g;
}
function ci(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let l;
  if (typeof TextEncoder < "u")
    l = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    l = Buffer.from(i, "utf-8");
  else
    return "";
  const p = li(l, e);
  let g = "";
  for (let r = 0; r < p.length; r++)
    g += String.fromCharCode(p[r]);
  return typeof btoa < "u" ? btoa(g) : typeof Buffer < "u" ? Buffer.from(p).toString("base64") : "";
}
function di(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  try {
    const i = String(t).trim();
    let l = "";
    if (typeof atob < "u")
      l = atob(i);
    else if (typeof Buffer < "u")
      l = Buffer.from(i, "base64").toString("binary");
    else
      return t;
    const p = new Uint8Array(l.length);
    for (let r = 0; r < l.length; r++)
      p[r] = l.charCodeAt(r);
    const g = li(p, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(g);
    if (typeof Buffer < "u")
      return Buffer.from(g).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function ui(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", l = Number(t.shift) || 13, p = t.key || "ln-ashlar";
    return { codec: i, shift: l, key: p };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function br(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ui(e);
  return i.codec === "base64" ? si(t) : i.codec === "xor" ? ci(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (l) => oi(l, i.shift));
}
function ge(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = ui(e);
  return i.codec === "base64" ? ai(t) : i.codec === "xor" ? di(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (l) => oi(l, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(r) {
    const o = r[e];
    o && o.deobfuscate();
  }
  const l = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function p(r) {
    return r[e] ? r[e] : (r[e] = this, this.dom = r, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  p.prototype.deobfuscate = function() {
    const r = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && r && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((y) => !this.dom.contains(y.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const y = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(a) {
          return a.parentElement && a.parentElement.classList && a.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; y.nextNode(); )
        this._originalTextNodes.push({
          node: y.currentNode,
          raw: y.currentNode.nodeValue
        });
    }
    const s = this.dom.getAttribute(t), n = parseInt(s, 10), u = isNaN(n) ? 13 : n, h = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), f = this.dom.getAttribute("data-ln-obfuscator-key");
    let E = "rot";
    h === "xor" || h === "base64" ? E = h : f && (E = "xor");
    const w = f || "ln-ashlar", m = { codec: E, shift: u, key: w };
    if (r && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const y = this.dom.querySelectorAll(".sr-only");
      for (let b = 0; b < y.length; b++)
        y[b].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const a = (this.dom.rel || "").split(/\s+/).filter(function(b) {
        return b && b !== "noopener" && b !== "noreferrer";
      });
      a.length > 0 ? this.dom.rel = a.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let y = 0; y < this._originalTextNodes.length; y++) {
        const a = this._originalTextNodes[y];
        a.node && a.raw && a.raw.length > 0 && (a.node.nodeValue = ge(a.raw, m));
      }
    if (r && this._originalHref) {
      const y = ge(this._originalHref, m);
      this.dom.setAttribute("href", y);
    }
    k(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: E,
      shift: u,
      key: E === "xor" ? w : null
    });
  }, p.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let r = 0; r < this._originalTextNodes.length; r++) {
          const o = this._originalTextNodes[r];
          o.node && o.raw && (o.node.nodeValue = o.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const g = U(t, e, p, "ln-obfuscator", {
    attributes: l
  });
  g.obfuscate = br, g.deobfuscate = ge, g.utf8ToBase64 = si, g.base64ToUtf8 = ai, g.xorObfuscate = ci, g.xorDeobfuscate = di;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(o) {
    return o.hostname && o.hostname !== window.location.hostname;
  }
  function i(o) {
    if (o.getAttribute("data-ln-external-link") === "processed" || !e(o)) return;
    o.target = "_blank";
    const s = (o.rel || "").split(/\s+/).filter(Boolean);
    s.includes("noopener") || s.push("noopener"), s.includes("noreferrer") || s.push("noreferrer"), o.rel = s.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", o.appendChild(n), o.setAttribute("data-ln-external-link", "processed"), k(o, "ln-external-links:processed", {
      link: o,
      href: o.href
    });
  }
  function l(o) {
    o = o || document.body;
    for (const s of o.querySelectorAll("a, area"))
      i(s);
  }
  function p() {
    ft(function() {
      document.body.addEventListener("click", function(o) {
        const s = o.target.closest("a, area");
        s && s.getAttribute("data-ln-external-link") === "processed" && k(s, "ln-external-links:clicked", {
          link: s,
          href: s.href,
          text: s.textContent || s.title || ""
        });
      });
    }, "ln-external-links");
  }
  function g() {
    ft(function() {
      new MutationObserver(function(s) {
        for (const n of s)
          if (n.type === "childList") {
            for (const u of n.addedNodes)
              if (u.nodeType === 1 && (u.matches && (u.matches("a") || u.matches("area")) && i(u), u.querySelectorAll))
                for (const h of u.querySelectorAll("a, area"))
                  i(h);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Xt(["href"], function(s) {
        s.matches && (s.matches("a") || s.matches("area")) && i(s);
      });
    }, "ln-external-links");
  }
  function r() {
    p(), g(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
      l();
    }) : l();
  }
  window[t] = {
    process: l
  }, r();
})();
(function() {
  const t = "data-ln-link", e = "lnLink";
  if (window[e] !== void 0) return;
  let i = null;
  function l() {
    i = document.createElement("div"), i.className = "ln-link-status", document.body.appendChild(i);
  }
  function p(a) {
    i && (i.textContent = a, i.classList.add("ln-link-status--visible"));
  }
  function g() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function r(a, b) {
    if (b.target.closest("a, button, input, select, textarea")) return;
    const d = a.querySelector("a");
    if (!d) return;
    const c = d.getAttribute("href");
    if (!c) return;
    if (b.ctrlKey || b.metaKey || b.button === 1) {
      window.open(c, "_blank", "noopener,noreferrer");
      return;
    }
    $(a, "ln-link:navigate", { target: a, href: c, link: d }).defaultPrevented || d.click();
  }
  function o(a) {
    const b = a.querySelector("a");
    if (!b) return;
    const d = b.getAttribute("href");
    d && p(d);
  }
  function s() {
    g();
  }
  function n(a) {
    a[e + "Row"] || !a.querySelector("a") || (a[e + "Row"] = !0, a._lnLinkClick = function(d) {
      r(a, d);
    }, a._lnLinkEnter = function() {
      o(a);
    }, a.addEventListener("click", a._lnLinkClick), a.addEventListener("mouseenter", a._lnLinkEnter), a.addEventListener("mouseleave", s));
  }
  function u(a) {
    a[e + "Row"] && (a._lnLinkClick && a.removeEventListener("click", a._lnLinkClick), a._lnLinkEnter && a.removeEventListener("mouseenter", a._lnLinkEnter), a.removeEventListener("mouseleave", s), delete a._lnLinkClick, delete a._lnLinkEnter, delete a[e + "Row"]);
  }
  function h(a) {
    if (!a[e + "Init"]) return;
    const b = a.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const d = b === "TABLE" && a.querySelector("tbody") || a;
      for (const c of d.querySelectorAll("tr"))
        u(c);
    } else
      u(a);
    delete a[e + "Init"];
  }
  function f(a) {
    if (a[e + "Init"]) return;
    a[e + "Init"] = !0;
    const b = a.tagName;
    if (b === "TABLE" || b === "TBODY") {
      const d = b === "TABLE" && a.querySelector("tbody") || a;
      for (const c of d.querySelectorAll("tr"))
        n(c);
    } else
      n(a);
  }
  function E(a) {
    a.hasAttribute && a.hasAttribute(t) && f(a);
    const b = a.querySelectorAll ? a.querySelectorAll("[" + t + "]") : [];
    for (const d of b)
      f(d);
  }
  function w() {
    ft(function() {
      new MutationObserver(function(b) {
        for (const d of b)
          if (d.type === "childList") {
            for (const c of d.addedNodes)
              if (c.nodeType === 1) {
                E(c);
                const _ = c.closest("[" + t + "]");
                if (_)
                  if (c.tagName === "TR")
                    n(c);
                  else {
                    const v = _.tagName;
                    if (v === "TABLE" || v === "TBODY") {
                      const A = c.querySelectorAll ? c.querySelectorAll("tr") : [];
                      for (const S of A)
                        n(S);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), Xt([t], function(b) {
        b.hasAttribute && b.hasAttribute(t) ? E(b) : h(b);
      });
    }, "ln-link");
  }
  function m(a) {
    E(a);
  }
  window[e] = { init: m, destroy: h };
  function y() {
    l(), w(), m(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", y) : y();
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
  function l(p) {
    if (p[e]) return p[e];
    if (!(!p || p.tagName !== "A" && p.tagName !== "BUTTON"))
      return p[e] = this, this.dom = p, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  l.prototype._handleClick = function(p) {
    if (this.dom.tagName === "A" && (p.ctrlKey || p.metaKey || p.shiftKey || p.altKey || p.button !== 0))
      return;
    let g = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (g || (g = (this.dom.getAttribute("href") || "").trim()), !g || g === "#")
      return;
    !g.startsWith("#") && !g.startsWith(".") && !g.startsWith("[") && (g = "#" + g);
    let r = null;
    try {
      r = document.querySelector(g);
    } catch {
      const w = g.replace(/^#/, "");
      r = document.getElementById(w);
    }
    if (!r) return;
    p.preventDefault();
    const o = this.dom.getAttribute("data-ln-scroll-set");
    if (o) {
      const E = o.indexOf(":");
      if (E !== -1) {
        const w = o.slice(0, E).trim(), m = o.slice(E + 1).trim();
        try {
          const y = document.querySelector(w);
          y && (y.value = m, y.dispatchEvent(new Event("input", { bubbles: !0 })), y.dispatchEvent(new Event("change", { bubbles: !0 })));
        } catch {
        }
      }
    }
    if ($(this.dom, "ln-scroll:before-scroll", {
      target: r,
      link: this.dom,
      href: g
    }).defaultPrevented) return;
    const n = this.dom.getAttribute("data-ln-scroll-behavior") || "smooth", u = this.dom.getAttribute("data-ln-scroll-block") || "start";
    if (r.scrollIntoView({ behavior: n, block: u }), It(this.dom, "data-ln-scroll-update-hash", !1))
      try {
        window.history && window.history.pushState && window.history.pushState(null, "", g);
      } catch {
      }
    const f = this.dom.getAttribute("data-ln-scroll-focus");
    if (f !== "false" && f !== "0") {
      const E = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), w = isNaN(E) ? 450 : E;
      window.setTimeout(function() {
        let m = null;
        if (f && f !== "true" && f !== "1")
          try {
            m = document.querySelector(f);
          } catch {
          }
        m || (m = r.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !m && r.getAttribute("tabindex") !== null && (m = r), m && typeof m.focus == "function" && m.focus({ preventScroll: !0 });
      }, w);
    }
    k(this.dom, "ln-scroll:scrolled", {
      target: r,
      link: this.dom,
      href: g
    });
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, U(t, e, l, "ln-scroll", {
    attributes: i
  });
})();
const jt = ["Ctrl", "Alt", "Shift", "Meta"], yr = {
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
function fi(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = yr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function hi(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), l = /* @__PURE__ */ new Set();
  let p = "";
  for (let r = 0; r < i.length; r++) {
    const o = fi(i[r]);
    if (!o) return "";
    if (jt.indexOf(o) !== -1) {
      l.add(o);
      continue;
    }
    if (p) return "";
    p = o;
  }
  if (!p) return "";
  const g = [];
  for (let r = 0; r < jt.length; r++)
    l.has(jt[r]) && g.push(jt[r]);
  return g.push(p), g.join("+");
}
function vr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), l = [];
  for (let p = 0; p < i.length; p++) {
    const g = hi(i[p]);
    g && l.indexOf(g) === -1 && l.push(g);
  }
  return l;
}
function wr(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const l = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(l) ? "" : hi(l ? l + "+" + i : i);
}
function Er(t) {
  if (!t) return "";
  const e = fi(t.key);
  if (!e || jt.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function Ar(t) {
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
function Sr(t, e, i, l) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const p = String(e.tagName || "").toLowerCase();
  return p === "button" ? l === "Enter" || l === "Space" : p === "a" && e.hasAttribute && e.hasAttribute("href") && l === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", l = "data-ln-key-allow-input", p = "data-ln-key-modifier", g = "data-ln-key-for", r = "lnKeyFor";
  if (window[e] !== void 0) return;
  function o(b) {
    const d = b[e];
    if (d) {
      if (!b.hasAttribute(t)) {
        d.destroy();
        return;
      }
      d.sync();
    }
  }
  function s(b) {
    const d = b[r];
    d && !b.hasAttribute(g) && d.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: o, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: o, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: o, description: "Permits shortcut execution even when focused inside an editable input" }
  }, u = {
    "data-ln-key-for": { type: "string", effect: s, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, h = /* @__PURE__ */ new Set();
  let f = null;
  function E() {
    f || (f = function(b) {
      if (b.defaultPrevented || b.isComposing || b.repeat) return;
      const d = Er(b);
      if (!d) return;
      const c = Oi(b.target), _ = document.querySelectorAll("[" + t + "], [" + g + "]");
      let v = null, A = !1, S = !1;
      for (let I = 0; I < _.length; I++) {
        const N = _[I], D = N[e] || N[r];
        if (!D || !D.matches(d) || c && !D.allowsInput()) continue;
        const M = D.resolveTarget(), F = Ar(M);
        if (!(!F || !Ni(M, F))) {
          if (Sr(b, M, F, d)) {
            S = !0;
            continue;
          }
          v ? A = !0 : v = { host: N, target: M, action: F };
        }
      }
      if (S || !v) return;
      A && console.warn('[ln-key] Duplicate active shortcut "' + d + '"; first DOM match wins.');
      const T = {
        source: v.host,
        target: v.target,
        action: v.action,
        key: d,
        event: b
      };
      $(v.host, "ln-key:before-trigger", T).defaultPrevented || (b.preventDefault(), v.target[v.action](), k(v.host, "ln-key:trigger", T));
    }, document.addEventListener("keydown", f));
  }
  function w() {
    h.size > 0 || !f || (document.removeEventListener("keydown", f), f = null);
  }
  function m(b) {
    return this.dom = b, this.shortcuts = [], h.add(this), this.sync(), E(), this;
  }
  m.prototype.sync = function() {
    this.shortcuts = vr(this.dom.getAttribute(t));
  }, m.prototype.matches = function(b) {
    return this.shortcuts.indexOf(b) !== -1;
  }, m.prototype.allowsInput = function() {
    return this.dom.hasAttribute(l);
  }, m.prototype.resolveTarget = function() {
    const b = this.dom.getAttribute(i);
    return b ? a(b, i) : this.dom;
  }, m.prototype.destroy = function() {
    this.dom[e] && (h.delete(this), delete this.dom[e], w());
  };
  function y(b) {
    return this.dom = b, h.add(this), E(), this;
  }
  y.prototype._modifierContext = function() {
    return this.dom.closest("[" + p + "]");
  }, y.prototype.shortcut = function() {
    const b = this._modifierContext(), d = b ? b.getAttribute(p) : "";
    return wr(d, this.dom.textContent);
  }, y.prototype.matches = function(b) {
    return this.shortcut() === b;
  }, y.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(l)) return !0;
    const b = this._modifierContext();
    return !!(b && b.hasAttribute(l));
  }, y.prototype.resolveTarget = function() {
    return a(this.dom.getAttribute(g), g);
  }, y.prototype.destroy = function() {
    this.dom[r] && (h.delete(this), delete this.dom[r], w());
  };
  function a(b, d) {
    if (!b) return null;
    try {
      const c = document.querySelector(b);
      return c || console.warn("[ln-key] Target not found for " + d + ' selector "' + b + '".'), c;
    } catch {
      return console.warn("[ln-key] Invalid " + d + ' selector "' + b + '".'), null;
    }
  }
  U(t, e, m, "ln-key", {
    attributes: n
  }), U(g, r, y, "ln-key-for", {
    attributes: u
  });
})();
function Cr(t, e, i = 100) {
  if (e != null && e !== "") {
    const l = parseFloat(String(e));
    if (!isNaN(l) && l > 0) return l;
  }
  if (t != null && t !== "") {
    const l = parseFloat(String(t));
    if (!isNaN(l) && l > 0) return l;
  }
  return i;
}
(function() {
  const t = "[data-ln-progress]", e = "lnProgress";
  if (window[e] !== void 0) return;
  function i(o) {
    const s = o[e];
    s && r.call(s);
  }
  const l = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function p(o) {
    return this.dom = o, this._parentObserver = null, r.call(this), g.call(this), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function g() {
    const o = this, s = this.dom.parentElement;
    if (!s) return;
    const n = new MutationObserver(function(u) {
      for (const h of u)
        h.attributeName === "data-ln-progress-max" && r.call(o);
    });
    n.observe(s, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function r() {
    const o = this.dom.getAttribute("data-ln-progress"), s = this.dom.parentElement, n = s ? s.getAttribute("data-ln-progress-max") : null, u = this.dom.getAttribute("data-ln-progress-max"), h = Cr(u, n, 100), f = Pn(o, h);
    this.dom.style.width = f.percentage + "%", this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(f.min)), this.dom.setAttribute("aria-valuemax", String(f.max)), this.dom.setAttribute("aria-valuenow", String(f.clampedValue)), k(this.dom, "ln-progress:change", {
      target: this.dom,
      value: f.value,
      max: f.max,
      percentage: f.percentage
    });
  }
  U(
    t,
    e,
    p,
    "ln-progress",
    {
      attributes: l
    }
  );
})();
function Tr(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function kr(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const l = Object.keys(e);
  if (l.length === 0) return !0;
  for (let p = 0; p < l.length; p++) {
    const g = e[l[p]];
    let r = "";
    if (g.col !== null && g.col !== void 0 ? r = t[g.col] || "" : g.attr && i && typeof i.getAttribute == "function" && (r = i.getAttribute(g.attr) || ""), !Be(r, g.values))
      return !1;
  }
  return !0;
}
function on(t, e, i, l) {
  if (l != null && !isNaN(l))
    return parseInt(l, 10);
  if (e && typeof e.getAttribute == "function") {
    const p = e.getAttribute("data-ln-filter-col");
    if (p !== null && !isNaN(parseInt(p, 10)))
      return parseInt(p, 10);
    if (typeof e.closest == "function") {
      const g = e.closest("th");
      if (g && typeof g.cellIndex == "number")
        return g.cellIndex;
      const r = e.closest("[data-ln-popover], [id]");
      if (r && r.id) {
        const o = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (o && typeof o.querySelector == "function") {
          const s = o.querySelector('[data-ln-popover-for="' + r.id + '"]');
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
    const p = t.querySelectorAll("thead th, tr:first-child th"), g = String(i).trim().toLowerCase();
    for (let r = 0; r < p.length; r++) {
      const o = p[r], s = o.getAttribute("data-ln-table-filter-col") || o.getAttribute("data-ln-filter-col") || o.getAttribute("data-ln-filter-key") || o.getAttribute("data-ln-table-col") || o.getAttribute("data-ln-col") || o.getAttribute("data-ln-field");
      if (s && s.trim().toLowerCase() === g)
        return typeof o.cellIndex == "number" ? o.cellIndex : r;
    }
    if (e) {
      const r = e.closest ? e.closest("[data-ln-popover], [id]") : null, o = r && r.id || e.id || null;
      if (o)
        for (let s = 0; s < p.length; s++) {
          const n = p[s];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + o + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : s;
        }
    }
    for (let r = 0; r < p.length; r++) {
      const o = p[r], n = Array.from(o.childNodes || []).filter((h) => h.nodeType === 3), u = (n.length > 0 ? n.map((h) => h.textContent.trim()).join(" ") : o.textContent || "").trim().toLowerCase();
      if (u && u === g)
        return typeof o.cellIndex == "number" ? o.cellIndex : r;
    }
  }
  return null;
}
function Lr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let l = 0; l < t.length; l++) {
    const p = t[l];
    !e && p.key && (e = p.key), p.checked && !p.isReset && p.value && i.push(p.value);
  }
  return { key: e, values: i };
}
function xr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function sn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", l = "data-ln-filter-value", p = "data-ln-filter-hide", g = "data-ln-filter-reset", r = "data-ln-filter-col", o = "data-ln-hash", s = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const u = {
    "data-ln-filter": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: b, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: b, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" }
  }, h = Y(u);
  function f(d) {
    return d.hasAttribute(g) || !d.getAttribute(l);
  }
  function E(d) {
    const c = d.dom.querySelectorAll("[" + i + "]"), _ = [];
    for (let A = 0; A < c.length; A++) {
      const S = c[A];
      _.push({
        key: S.getAttribute(i),
        value: S.getAttribute(l) || "",
        checked: S.checked,
        isReset: f(S)
      });
    }
    const v = Lr(_);
    return { key: v.key, values: v.values, targetId: d.targetId };
  }
  function w(d, c, _) {
    const v = d.querySelectorAll("[" + i + "]"), A = Array.isArray(_) && _.length > 0;
    for (let S = 0; S < v.length; S++) {
      const T = v[S];
      f(T) ? T.checked = !A : A && T.getAttribute(i) === c && _.indexOf(T.getAttribute(l)) !== -1 ? T.checked = !0 : T.checked = !1;
    }
  }
  function m(d) {
    this.dom = d, Q(this, d, h);
    const c = d.getAttribute(r);
    this.colIndex = c !== null ? parseInt(c, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = St(d, "filter"), this.hashEnabled = !!this.nsKey;
    const _ = this, v = le(function() {
      _._render();
    });
    this._queueRender = v, this._attachHandlers(), this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const S = st(_.nsKey), T = ye(S);
      T && T.key && T.values.length > 0 ? w(_.dom, T.key, T.values) : w(_.dom, null, []), _._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const S = st(this.nsKey), T = ye(S);
      T && T.key && T.values.length > 0 && (w(d, T.key, T.values), At(function() {
        _._destroyed || _._render();
      }), A = !0);
    }
    if (!A) {
      const S = sn(d.getAttribute(s));
      if (S.length > 0) {
        const T = d.querySelector("[" + i + "]"), x = T ? T.getAttribute(i) : null;
        x && (w(d, x, S), At(function() {
          _._destroyed || _._render();
        }), A = !0);
      }
    }
    if (!A) {
      const S = d.querySelectorAll("[" + i + "]");
      for (let T = 0; T < S.length; T++)
        if (S[T].checked && !f(S[T])) {
          At(function() {
            _._destroyed || _._render();
          });
          break;
        }
    }
    return this;
  }
  m.prototype._attachHandlers = function() {
    const d = this;
    this._onDomChange = function(c) {
      const _ = c.target;
      if (!_ || !_.hasAttribute || !_.hasAttribute(i)) return;
      const v = Array.from(d.dom.querySelectorAll("[" + i + "]"));
      if (f(_)) {
        for (let A = 0; A < v.length; A++)
          f(v[A]) || (v[A].checked = !1);
        _.checked = !0, d._queueRender();
        return;
      }
      if (_.checked) {
        for (let S = 0; S < v.length; S++)
          f(v[S]) && (v[S].checked = !1);
        let A = !1;
        for (let S = 0; S < v.length; S++)
          if (f(v[S])) {
            A = !0;
            break;
          }
        if (A) {
          let S = !0;
          for (let T = 0; T < v.length; T++)
            if (!f(v[T]) && !v[T].checked) {
              S = !1;
              break;
            }
          if (S)
            for (let T = 0; T < v.length; T++)
              f(v[T]) ? v[T].checked = !0 : v[T].checked = !1;
        }
      } else {
        let A = !1;
        for (let S = 0; S < v.length; S++)
          if (!f(v[S]) && v[S].checked) {
            A = !0;
            break;
          }
        if (!A)
          for (let S = 0; S < v.length; S++)
            f(v[S]) && (v[S].checked = !0);
      }
      d._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, m.prototype._render = function() {
    const d = this, c = E(this), _ = this._lastSnapshot;
    if (!(!_ || _.key !== c.key || Tr(_.values, c.values))) return;
    const A = c.key === null || c.values.length === 0, S = document.getElementById(d.targetId), T = {
      key: c.key,
      values: c.values.slice(),
      targetId: d.targetId
    };
    k(d.dom, "ln-filter:change", T);
    let x = !1;
    S && S !== d.dom && $(S, "ln-filter:change", T).defaultPrevented && (x = !0);
    const I = _ && _.values.length > 0, N = c.values.length === 0;
    if (I && N) {
      const F = { targetId: d.targetId };
      k(d.dom, "ln-filter:reset", F), S && S !== d.dom && k(S, "ln-filter:reset", F);
    }
    this._lastSnapshot = { key: c.key, values: c.values.slice() };
    const D = xr(c.values);
    if (D ? this.dom.setAttribute(s, D) : this.dom.removeAttribute(s), this.hashEnabled) {
      const F = Fn(c.key, c.values);
      mt(this.nsKey, F);
    }
    if (x) return;
    const M = S && (S.tagName === "TABLE" ? S : S.querySelector ? S.querySelector("table") : null);
    if (M)
      d._filterTableRows(c, M);
    else {
      if (!S) return;
      const F = S.children;
      for (let H = 0; H < F.length; H++) {
        const j = F[H];
        if (j.removeAttribute(p), A) continue;
        const X = j.getAttribute("data-" + c.key);
        X !== null && (Be(X, c.values) || j.setAttribute(p, "true"));
      }
    }
  };
  function y(d) {
    if (!d) return "";
    const c = d.querySelector ? d.querySelector("[data-ln-value]") : null;
    return Et(c || d);
  }
  function a(d) {
    return !!(!d || typeof d != "object" || d.tagName === "TEMPLATE" || typeof d.hasAttribute == "function" && (d.hasAttribute("data-ln-sort-exclude") || d.hasAttribute("hidden")) || d.classList && d.classList.contains("hidden") || d.style && d.style.display === "none" || typeof d.matches == "function" && d.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof d.querySelector == "function" && d.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  m.prototype._filterTableRows = function(d, c) {
    if (!c) {
      const x = document.getElementById(this.targetId);
      if (!x || (c = x.tagName === "TABLE" ? x : x.querySelector ? x.querySelector("table") : null, !c)) return;
    }
    const _ = on(c, this.dom, d.key, this.colIndex), v = d.key || this.dom.getAttribute("data-ln-filter-key") || (_ !== null ? "col" + _ : "attr-filter"), A = d.values;
    n.has(c) || n.set(c, {});
    const S = n.get(c);
    v && A.length > 0 ? S[v] = {
      col: _,
      values: A.slice(),
      attr: "data-" + v
    } : v && delete S[v];
    const T = c.tBodies;
    for (let x = 0; x < T.length; x++) {
      const I = T[x].rows;
      for (let N = 0; N < I.length; N++) {
        const D = I[N];
        if (a(D)) continue;
        const M = {};
        for (let F = 0; F < D.cells.length; F++)
          M[F] = y(D.cells[F]);
        kr(M, S, D) ? D.removeAttribute(p) : D.setAttribute(p, "true");
      }
    }
  }, m.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const d = document.getElementById(this.targetId);
    if (d) {
      const c = d.tagName === "TABLE" ? d : d.querySelector ? d.querySelector("table") : null;
      if (c && n.has(c)) {
        const _ = n.get(c), v = on(c, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), A = this.dom.getAttribute("data-ln-filter-key") || (v !== null ? "col" + v : this.colIndex !== null ? "col" + this.colIndex : null);
        A && _[A] && (delete _[A], this._filterTableRows({ key: null, values: [] }, c)), Object.keys(_).length === 0 && n.delete(c);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function b(d, c) {
    const _ = d[e];
    if (!(!_ || _._destroyed)) {
      if (c === o)
        _.hashEnabled && _._onHashChange && window.removeEventListener("hashchange", _._onHashChange), _.nsKey = St(d, "filter"), _.hashEnabled = !!_.nsKey, _.hashEnabled && window.addEventListener("hashchange", _._onHashChange);
      else if (c === s) {
        const v = sn(d.getAttribute(s)), A = d.querySelector("[" + i + "]"), S = A ? A.getAttribute(i) : null;
        S && (w(d, S, v), _._render());
      }
    }
  }
  U(t, e, m, "ln-filter", {
    attributes: u,
    persist: {
      attr: s,
      hashActive: function(d) {
        return !!St(d, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", l = "lnSearchControl", p = "data-ln-search-items", g = "data-ln-search-fields", r = "data-ln-search-exclude", o = "data-ln-search-hide", s = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: d, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: d, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, u = Y(n);
  function h(c) {
    const _ = St(c, "search");
    if (_) return _;
    if (c.id) {
      const v = document.querySelector("[" + i + '="' + c.id + '"]');
      if (v) {
        const A = St(v, "search");
        if (A) return A;
      }
    }
    return null;
  }
  function f(c) {
    return c.matches("input, textarea") ? c : c.querySelector("input, textarea");
  }
  function E(c, _) {
    const v = c.childNodes;
    for (let A = 0; A < v.length; A++) {
      const S = v[A];
      if (S.nodeType === 3) {
        _.push(S.nodeValue);
        continue;
      }
      S.nodeType === 1 && (S.hasAttribute(r) || E(S, _));
    }
  }
  function w(c) {
    if (c._lnSearchText !== void 0) return c._lnSearchText;
    const _ = [];
    E(c, _);
    const v = Zi(_);
    return c._lnSearchText = v, v;
  }
  function m(c, _) {
    if (!c.id) return;
    const v = document.querySelectorAll("[" + i + '="' + c.id + '"]');
    for (const A of v) {
      const S = f(A);
      S && S.value !== _ && (S.value = _);
    }
  }
  function y(c) {
    this.dom = c, this.term = c.getAttribute(t) || "", this._destroyed = !1;
    const _ = this;
    return this.nsKey = h(c), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const v = st(_.nsKey), A = _.dom.getAttribute(t) || "";
      v !== null && v !== A ? _.dom.setAttribute(t, v) : v === null && A !== "" && _.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), At(function() {
      if (!_._destroyed) {
        if (_.hashEnabled) {
          const v = st(_.nsKey);
          if (v !== null && v !== _.term) {
            _.term = v, _.dom.setAttribute(t, v), m(_.dom, v), _._apply();
            return;
          }
        }
        we(_.term) && (m(_.dom, _.term), _._apply());
      }
    }), this;
  }
  y.prototype._apply = function() {
    const c = this.dom, _ = we(this.term), v = Hn(_);
    this.hashEnabled && mt(this.nsKey, this.term ? this.term : null);
    const A = Ji(c.getAttribute(g));
    if ($(c, "ln-search:change", {
      term: _,
      tokens: v,
      targetId: c.id,
      fields: A
    }).defaultPrevented) return;
    const T = c.getAttribute(p), x = T ? c.querySelectorAll(T) : c.children;
    for (let I = 0; I < x.length; I++) {
      const N = x[I];
      if (N.removeAttribute(o), N.hasAttribute(r) || v.length === 0) continue;
      const D = w(N);
      zn(D, v) || N.setAttribute(o, "true");
    }
  }, y.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function a(c) {
    if (this.dom = c, Q(this, c, u), this.input = f(c), this._attachHandler(), this.input && this.input.value.trim()) {
      const _ = this;
      At(function() {
        const v = document.getElementById(_.targetId);
        v && ((v.getAttribute(t) || "").trim() || _._write(_.input.value));
      });
    }
    return this;
  }
  a.prototype._write = function(c) {
    const _ = document.getElementById(this.targetId);
    _ && _.getAttribute(t) !== c && _.setAttribute(t, c);
  }, a.prototype._attachHandler = function() {
    if (!this.input) return;
    const c = this;
    this._onInput = function() {
      c._write(c.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, a.prototype.destroy = function() {
    this.dom[l] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[l]);
  };
  function b(c) {
    const _ = c.getAttribute("data-ln-search-clear-for");
    if (_) {
      const x = document.getElementById(_), I = document.querySelector("[" + i + '="' + _ + '"]'), N = I ? f(I) : null;
      return { target: x, input: N };
    }
    const v = c.closest("[" + t + "]");
    if (v) {
      const x = v.id ? document.querySelector("[" + i + '="' + v.id + '"]') : null, I = x ? f(x) : null;
      return { target: v, input: I };
    }
    const A = c.closest("[data-ln-table-source], [data-ln-list-source]");
    if (A) {
      const x = A.getAttribute("data-ln-table-source") || A.getAttribute("data-ln-list-source"), I = x ? document.getElementById(x) : null;
      if (I && I.hasAttribute(t)) {
        const N = document.querySelector("[" + i + '="' + x + '"]'), D = N ? f(N) : null;
        return { target: I, input: D };
      }
    }
    const S = c.closest("[" + i + "]");
    if (S) {
      const x = S.getAttribute(i), I = x ? document.getElementById(x) : null, N = f(S);
      return { target: I, input: N };
    }
    const T = c.parentElement;
    if (T) {
      const x = T.querySelector("[" + i + "]");
      if (x) {
        const I = x.getAttribute(i), N = I ? document.getElementById(I) : null, D = f(x);
        return { target: N, input: D };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(c) {
    const _ = c.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!_) return;
    const v = b(_);
    !v.target && !v.input || (c.preventDefault(), v.input && (v.input.value = "", v.input.focus()), v.target && v.target.setAttribute(t, ""));
  });
  function d(c, _) {
    const v = c[e];
    if (!v || v._destroyed) return;
    if (_ === s) {
      v._onHashChange && window.removeEventListener("hashchange", v._onHashChange), v.nsKey = h(c), v.hashEnabled = !!v.nsKey, v.hashEnabled && window.addEventListener("hashchange", v._onHashChange);
      return;
    }
    const A = c.getAttribute(t) || "";
    A !== v.term && (v.term = A, m(c, A), v._apply());
  }
  U(t, e, y, "ln-search", {
    attributes: n,
    onSubtreeChange: function(c, _) {
      const v = _.target;
      v && v._lnSearchText !== void 0 && delete v._lnSearchText, v && v.parentElement && v.parentElement._lnSearchText !== void 0 && delete v.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(c) {
        return !!h(c);
      }
    }
  }), U(i, l, a, "ln-search-control");
})();
function kt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Ir(t) {
  const e = kt(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function qr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Dr(t, e, i, l) {
  const p = kt(t);
  if (p === "none") return () => 0;
  const g = p === "desc" ? -1 : 1, r = typeof l == "function" ? l : (o) => o;
  return function(o, s) {
    const n = r(o), u = r(s);
    return Me(n, u, e, i) * g;
  };
}
function _e(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function Rr(t, e) {
  if (!t || typeof t != "object" || t.nodeType !== 1) return [];
  const i = e || (typeof t.getAttribute == "function" ? t.getAttribute("data-ln-sort-items") : null) || null;
  if (i && typeof t.querySelectorAll == "function")
    return Array.from(t.querySelectorAll(i));
  if (t.tagName === "TABLE") {
    const l = t.tBodies && t.tBodies.length ? t.tBodies[0] : typeof t.querySelector == "function" ? t.querySelector("tbody") : null;
    if (l)
      return Array.from(l.children || []);
    if (typeof t.querySelectorAll == "function")
      return Array.from(t.querySelectorAll("tbody tr, tr"));
  }
  return Array.from(t.children || []);
}
(function() {
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", l = "data-ln-sort-state", p = "data-ln-sort-dir", g = "data-ln-hash";
  if (window[e] !== void 0) return;
  function r(E, w) {
    return E.getAttribute(w) || null;
  }
  const o = {
    "data-ln-sort": { prop: "targetId", type: "string", read: K, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: r, effect: f, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: r, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: f, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: f, description: "URL hash routing key for sort state persistence" }
  }, s = Y(o), n = /* @__PURE__ */ new WeakMap();
  function u(E, w, m) {
    if (w) {
      const y = E.querySelector('[data-ln-field="' + w + '"]');
      return y ? Et(y) : "";
    }
    return m != null && E.cells && E.cells[m] ? Et(E.cells[m]) : Et(E);
  }
  function h(E) {
    this.dom = E, Q(this, E, s);
    const w = E.closest("th");
    this.column = !this.field && w ? w.cellIndex : null, this._state = kt(E.getAttribute(l)), E.hasAttribute(l) || E.setAttribute(l, this._state), this._destroyed = !1, this.nsKey = St(E, "sort"), this.hashEnabled = !!this.nsKey;
    const m = this;
    this._onClick = function(a) {
      const b = a.target.closest("[" + p + "]");
      if (!b) return;
      const d = kt(b.getAttribute(p));
      m._apply(d);
    }, E.addEventListener("click", this._onClick), this._onSortChange = function(a) {
      if (m._destroyed || !a.detail) return;
      const b = m._resolveTarget();
      if (!(b && (a.target === b || b.contains(a.target)) || a.detail.targetId && a.detail.targetId === m.targetId)) return;
      if (qr(
        { field: m.field, column: m.column },
        { field: a.detail.field, column: a.detail.column }
      )) {
        const _ = kt(a.detail.direction);
        _ && E.getAttribute(l) !== _ && (m._state = _, E.setAttribute(l, _), m._updateAriaSort(_));
        return;
      }
      E.getAttribute(l) !== "none" && (m._state = "none", E.setAttribute(l, "none"), m._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (m._destroyed || !m.hashEnabled) return;
      const a = st(m.nsKey), b = be(a);
      if (b)
        m.field !== null && b.fieldOrColumn === m.field || m.column !== null && String(m.column) === b.fieldOrColumn ? m._state !== b.direction && m._apply(b.direction, !0) : m._state !== "none" && (m._state = "none", E.setAttribute(l, "none"), m._updateAriaSort("none"));
      else if (m._state !== "none") {
        m._state = "none", E.setAttribute(l, "none"), m._updateAriaSort("none");
        const d = m._resolveTarget();
        d && ($(d, "ln-sort:change", {
          field: m.field,
          column: m.column,
          direction: "none",
          targetId: m.targetId
        }).defaultPrevented || m._defaultSort(d, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let y = !1;
    if (this.hashEnabled) {
      const a = st(this.nsKey), b = be(a);
      b && ((m.field !== null && b.fieldOrColumn === m.field || m.column !== null && String(m.column) === b.fieldOrColumn) && At(function() {
        m._destroyed || m._apply(b.direction, !0);
      }), y = !0);
    }
    if (!y) {
      const a = kt(E.getAttribute(l));
      a && a !== "none" && At(function() {
        m._destroyed || m._apply(a, !0);
      });
    }
    return this;
  }
  h.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, h.prototype._updateAriaSort = function(E) {
    const w = this.dom.closest("th");
    w && w.setAttribute("aria-sort", Ir(E));
  }, h.prototype._apply = function(E, w) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const d = this.dom.closest("th");
      d && d.cellIndex !== void 0 && (this.column = d.cellIndex);
    }
    const m = kt(E);
    this._state = m, this.dom.getAttribute(l) !== m && this.dom.setAttribute(l, m), this._updateAriaSort(m);
    const y = this._resolveTarget();
    if (!y) return;
    const a = {
      field: this.field,
      column: this.column,
      direction: m,
      targetId: this.targetId
    };
    if (!w && this.hashEnabled) {
      const d = Mn(this.field !== null ? this.field : this.column, m);
      mt(this.nsKey, d);
    }
    $(y, "ln-sort:change", a).defaultPrevented || this._defaultSort(y, m);
  }, h.prototype._defaultSort = function(E, w) {
    const m = Rr(E, this.itemsSelector);
    if (!m.length) return;
    const y = m[0].parentNode, a = m.filter(function(_) {
      return !_e(_);
    });
    if (!a.length) return;
    n.has(E) || n.set(E, a.slice());
    let b;
    if (w === "none") {
      const _ = n.get(E) || a;
      n.delete(E), b = _.filter(function(v) {
        return v.parentNode === y && !_e(v);
      });
    } else {
      const _ = this.field, v = this.column, A = a.map(function(I) {
        return u(I, _, v);
      }), S = Ne(A), T = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base", numeric: !0 }) : null, x = Dr(w, S, T, function(I) {
        return u(I, _, v);
      });
      b = a.slice().sort(x);
    }
    const d = document.createDocumentFragment();
    let c = 0;
    for (let _ = 0; _ < m.length; _++) {
      const v = m[_];
      _e(v) ? d.appendChild(v) : c < b.length && d.appendChild(b[c++]);
    }
    y.appendChild(d);
  }, h.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function f(E, w) {
    const m = E[e];
    if (!(!m || m._destroyed))
      if (w === i) {
        const y = E.closest("th");
        m.column = !m.field && y ? y.cellIndex : null;
      } else if (w === l) {
        const y = kt(E.getAttribute(l));
        y !== m._state && m._apply(y);
      } else w === g && (m.hashEnabled && m._onHashChange && window.removeEventListener("hashchange", m._onHashChange), m.nsKey = St(E, "sort"), m.hashEnabled = !!m.nsKey, m.hashEnabled && window.addEventListener("hashchange", m._onHashChange));
  }
  U(t, e, h, "ln-sort", {
    attributes: o,
    persist: {
      attr: l,
      hashActive: function(E) {
        return !!St(E, "sort");
      }
    }
  });
})();
function an(t, e, i, l, p = 15) {
  if (l <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const g = Math.max(0, t || 0), r = Math.max(0, e || 0), o = Math.floor(g / i), s = Math.ceil(r / i), n = Math.max(0, o - p), u = Math.min(l, o + s + p), h = n * i, f = Math.max(0, (l - u) * i);
  return { start: n, end: u, topPadding: h, bottomPadding: f };
}
function Or(t, e) {
  const i = Array.isArray(t) ? t.length : 0, l = e instanceof Set ? e : new Set(e || []);
  let p = 0;
  if (Array.isArray(t))
    for (let o = 0; o < t.length; o++)
      l.has(t[o]) && p++;
  else
    p = l.size;
  const g = i > 0 && p === i, r = p > 0 && p < i;
  return { totalCount: i, selectedCount: p, isAllSelected: g, isIndeterminate: r };
}
function ln(t, e, i) {
  const l = new Set(t);
  return e == null || ((i !== void 0 ? i : !l.has(e)) ? l.add(e) : l.delete(e)), l;
}
function cn(t, e, i) {
  const l = new Set(t);
  if (!Array.isArray(e)) return l;
  if (i)
    for (let p = 0; p < e.length; p++)
      e[p] != null && l.add(e[p]);
  else
    for (let p = 0; p < e.length; p++)
      l.delete(e[p]);
  return l;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function s(a, b) {
    if (!a || !a.isDataDriven) return;
    const d = a.dom.hasAttribute("data-ln-table-window");
    if (d && !a._windowed)
      a._enterWindowedMode(), a._kickWindowInitial();
    else if (!d && a._windowed)
      a._exitWindowedMode();
    else if (d && a._windowed) {
      const c = parseInt(b, 10);
      c > 0 && a._cache.configure({ windowSize: c });
    }
  }
  function n(a, b) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const d = parseInt(b, 10);
    d > 0 && a._cache.configure({ pageSize: d });
  }
  function u(a, b) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const d = parseInt(b, 10);
    d >= 0 && a._cache.configure({ threshold: d });
  }
  function h(a, b) {
    if (!a || !a.isDataDriven || !a._windowed || !a._cache) return;
    const d = parseInt(b, 10);
    d >= 0 && a._cache.setGrandTotal(d);
  }
  const f = {
    "data-ln-table": { prop: "name", type: "string", read: K, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: u, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: h, description: "Total record count override for virtual scrollbar calculation" },
    "data-ln-table-row": { type: "marker", description: "Table row template element" },
    "data-ln-table-row-id": { type: "string", description: "Record identifier on row element" },
    "data-ln-table-row-action": { type: "trigger", description: "Action trigger inside a table row" },
    "data-ln-table-row-select": { type: "trigger", description: "Row selection checkbox trigger" },
    "data-ln-table-col": { type: "string", description: "Column header identifier or field mapping" },
    "data-ln-table-col-select": { type: "trigger", description: "Header select-all checkbox trigger" },
    "data-ln-table-cell-attr": { type: "string", description: "Cell attribute template mapping" },
    "data-ln-table-empty": { type: "marker", description: "Container for table empty state" },
    "data-ln-table-select-all-label": { type: "string", description: "Accessibility label for select-all header trigger" }
  }, E = Y(f);
  typeof Intl < "u" && new Intl.Collator(document.documentElement.lang || void 0, { sensitivity: "base" });
  function w(a, b) {
    if (a == null || isNaN(a)) return "";
    try {
      return new Intl.NumberFormat(J(b)).format(a);
    } catch {
      return String(a);
    }
  }
  function m(a) {
    let b = a.parentElement;
    for (; b && b !== document.body && b !== document.documentElement; ) {
      const c = getComputedStyle(b).overflowY;
      if (c === "auto" || c === "scroll") return b;
      b = b.parentElement;
    }
    return null;
  }
  function y(a) {
    this.dom = a, Q(this, a, E), this.table = a.querySelector("table"), this.tbody = a.querySelector("[data-ln-table-body]") || a.querySelector("tbody"), this.thead = a.querySelector("thead");
    const b = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = b ? Array.from(b.querySelectorAll("th")) : [], this._totalSpan = a.querySelector("[data-ln-table-total]"), this._filteredSpan = a.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== a ? this._filteredSpan.parentElement : null), this._selectedSpan = a.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== a ? this._selectedSpan.parentElement : null), this.isDataDriven = a.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const d = this;
    return this._onSetSearch = function(c) {
      const _ = (c.detail && c.detail.query != null ? c.detail.query : c.detail && c.detail.term != null ? c.detail.term : "").trim();
      d.isDataDriven ? (d.currentSearch = _, k(a, "ln-table:search", {
        table: d.name,
        query: d.currentSearch
      }), d._requestData()) : (d._searchTerm = _.toLowerCase(), d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), k(a, "ln-table:filter", {
        term: d._searchTerm,
        matched: d._filteredData.length,
        total: d._data.length
      }));
    }, a.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(c) {
      c.preventDefault(), d._onSetSearch(c);
    }, a.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      d.isDataDriven ? (d.currentFilters = {}, d.currentSearch = "", k(a, "ln-table:clear-filters", { table: d.name }), d._requestData()) : (d._searchTerm = "", d._columnFilters = {}, d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), k(a, "ln-table:filter", {
        term: "",
        matched: d._filteredData.length,
        total: d._data.length
      }));
    }, a.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && a.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(c) {
      const _ = c.detail || {}, v = _.data || [], A = _.total != null ? _.total : v.length;
      if (!(d._hasInitialSeed && !d.isLoaded && v.length === 0 && A === 0)) {
        if (d._windowed) {
          d._cache.ingest(_) && !_.provisional && a.classList.remove("ln-table--loading");
          return;
        }
        d._data = v, d._lastTotal = A, d._lastFiltered = _.filtered != null ? _.filtered : d._data.length, d.totalCount = d._lastTotal, d.visibleCount = d._lastFiltered, d.isLoaded = !0, d._hasInitialSeed = !1, a.classList.remove("ln-table--loading"), d._vStart = -1, d._vEnd = -1, d._applyFilterAndSort(), d._render(), d._updateFooter(), k(a, "ln-table:rendered", {
          table: d.name,
          total: d.totalCount,
          visible: d.visibleCount
        });
      }
    }, a.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(c) {
      const _ = c.detail && c.detail.loading;
      a.classList.toggle("ln-table--loading", !!_), _ && (d.isLoaded = !1);
    }, a.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(c) {
      !d._windowed || !d._cache || d._cache.release(c.detail && c.detail.offset);
    }, a.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !d._windowed || !d._cache || d._cache.revalidate();
    }, a.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !d._windowed || !d._cache || d._requestData();
    }, a.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(c) {
      !c.detail || c.detail.field == null || (c.preventDefault(), d.currentSort = c.detail.direction === "none" ? null : { field: c.detail.field, direction: c.detail.direction }, d._requestData());
    }, a.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(c) {
      if (c.target.closest("[data-ln-table-row-select]") || c.target.closest("[data-ln-table-row-action]") || c.target.closest("a") || c.target.closest("button") || c.ctrlKey || c.metaKey || c.button === 1) return;
      const _ = c.target.closest("[data-ln-table-row]");
      if (!_) return;
      const v = _.getAttribute("data-ln-table-row-id"), A = _._lnRecord || {};
      k(a, "ln-table:row-click", {
        table: d.name,
        id: v,
        record: A
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(c) {
      const _ = c.target.closest("[data-ln-table-row-action]");
      if (!_) return;
      const v = _.closest("[data-ln-table-row]");
      if (!v) return;
      const A = _.getAttribute("data-ln-table-row-action"), S = v.getAttribute("data-ln-table-row-id"), T = v._lnRecord || {};
      k(a, "ln-table:row-action", {
        table: d.name,
        id: S,
        action: A,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : k(a, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      d.tbody.rows.length > 0 && (d._emptyTbodyObserver.disconnect(), d._emptyTbodyObserver = null, d._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(c) {
      if (!c.detail || c.detail.column == null) return;
      c.preventDefault();
      const _ = c.detail.direction === "none" ? null : c.detail.direction;
      d._sortCol = _ === null ? -1 : c.detail.column, d._sortDir = _, d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), k(a, "ln-table:sorted", {
        column: c.detail.column,
        direction: c.detail.direction,
        matched: d._filteredData.length,
        total: d._data.length
      });
    }, a.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(c) {
      if (c.preventDefault(), !c.detail) return;
      const _ = c.detail.key, v = c.detail.values || [];
      if (_) {
        if (v.length === 0)
          delete d._columnFilters[_];
        else {
          const A = [];
          for (let S = 0; S < v.length; S++)
            A.push(v[S].toLowerCase());
          d._columnFilters[_] = A;
        }
        d._applyFilterAndSort(), d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), k(a, "ln-table:filter", {
          term: d._searchTerm,
          matched: d._filteredData.length,
          total: d._data.length
        });
      }
    }, a.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  y.prototype._parseRows = function() {
    const a = this.tbody.rows, b = this.ths;
    this._data = [], a.length > 0 && (this._rowHeight = a[0].offsetHeight || 40), this._lockColumnWidths();
    for (let d = 0; d < a.length; d++) {
      const c = a[d], _ = [], v = [], A = [];
      for (let T = 0; T < c.cells.length; T++) {
        const x = c.cells[T], I = x.textContent.trim();
        _[T] = Et(x), v[T] = I.toLowerCase(), x.querySelector("[data-ln-table-row-action]") || A.push(I.toLowerCase());
      }
      let S = null;
      if (this.isDataDriven) {
        S = {};
        const T = c.getAttribute("data-ln-table-row-id");
        T != null && (S.id = T);
        for (let x = 0; x < b.length; x++) {
          const I = b[x].getAttribute("data-ln-table-col");
          if (I) {
            const N = x;
            if (N < c.cells.length) {
              const D = c.cells[N];
              S[I] = Et(D);
            }
          }
        }
      }
      this._data.push({
        values: _,
        rawTexts: v,
        html: c.outerHTML,
        searchText: A.join(" "),
        id: this.isDataDriven && S ? S.id : void 0,
        ...S
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, y.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, y.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const a = document.createElement("colgroup");
    this.ths.forEach(function(b) {
      const d = document.createElement("col");
      d.style.width = b.offsetWidth + "px", a.appendChild(d);
    }), this.table.insertBefore(a, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = a;
  }, y.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const a = this._lastTotal, b = this.visibleCount;
        if (a === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || b === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const a = this._filteredData.length;
        a === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : a > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, y.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const a = this._filteredData, b = document.createDocumentFragment();
      for (let d = 0; d < a.length; d++) {
        const c = this._buildRow(a[d]);
        if (!c) break;
        b.appendChild(c);
      }
      this.tbody.replaceChildren(b), this._selectable && this._updateSelectAll();
    } else {
      const a = [], b = this._filteredData;
      for (let d = 0; d < b.length; d++) a.push(b[d].html);
      this.tbody.innerHTML = a.join(""), this._selectable && this._restoreSelection();
    }
  }, y.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const a = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let d = null;
        if (this._windowed) {
          const c = this._cache ? this._cache.peek() : null;
          d = c ? this._buildRow(c) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (d = this._buildRow(this._data[0]));
        d && this.tbody && (this.tbody.appendChild(d), this._rowHeight = d.offsetHeight || 40, d.remove());
      }
    this.isDataDriven ? this._scrollContainer = m(this.dom) : this._scrollContainer = null;
    const b = this._scrollContainer || window;
    this._scrollHandler = function() {
      a._rafId || (a._rafId = requestAnimationFrame(function() {
        a._rafId = null, a._windowed ? a._renderWindowed() : a._renderVirtual();
      }));
    }, b.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, y.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, y.prototype._renderVirtual = function() {
    const a = this._filteredData, b = a.length, d = this._rowHeight;
    if (!d || !b) return;
    const c = this.thead ? this.thead.offsetHeight : 0, _ = this._scrollContainer;
    let v, A;
    if (_) {
      const M = this.table.getBoundingClientRect(), F = _.getBoundingClientRect(), H = M.top - F.top + _.scrollTop + c;
      v = _.scrollTop - H, A = _.clientHeight;
    } else {
      const H = this.table.getBoundingClientRect().top + window.scrollY + c;
      v = window.scrollY - H, A = window.innerHeight;
    }
    const S = an(v, A, d, b, 15), T = S.start, x = S.end;
    if (T === this._vStart && x === this._vEnd) return;
    this._vStart = T, this._vEnd = x;
    const I = this.ths.length || 1, N = S.topPadding, D = S.bottomPadding;
    if (this.isDataDriven) {
      const M = document.createDocumentFragment();
      if (N > 0) {
        const F = document.createElement("tr");
        F.className = "ln-table__spacer", F.setAttribute("aria-hidden", "true");
        const H = document.createElement("td");
        H.setAttribute("colspan", I), H.style.height = N + "px", F.appendChild(H), M.appendChild(F);
      }
      for (let F = T; F < x; F++) {
        const H = this._buildRow(a[F]);
        H && M.appendChild(H);
      }
      if (D > 0) {
        const F = document.createElement("tr");
        F.className = "ln-table__spacer", F.setAttribute("aria-hidden", "true");
        const H = document.createElement("td");
        H.setAttribute("colspan", I), H.style.height = D + "px", F.appendChild(H), M.appendChild(F);
      }
      this.tbody.replaceChildren(M), this._selectable && this._updateSelectAll();
    } else {
      let M = "";
      N > 0 && (M += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + I + '" style="height:' + N + 'px;padding:0;border:none"></td></tr>');
      for (let F = T; F < x; F++) M += a[F].html;
      D > 0 && (M += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + I + '" style="height:' + D + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = M, this._selectable && this._restoreSelection();
    }
  }, y.prototype._buildPlaceholderRow = function() {
    const a = document.createElement("tr");
    a.className = "ln-table__placeholder", a.setAttribute("aria-hidden", "true");
    const b = document.createElement("td");
    return b.setAttribute("colspan", this.ths.length || 1), b.style.height = this._rowHeight + "px", a.appendChild(b), a;
  }, y.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const a = this._rowHeight;
    if (!a) return;
    const b = this._cache.logicalTotal, d = this.thead ? this.thead.offsetHeight : 0, c = this._scrollContainer;
    let _, v;
    if (c) {
      const M = this.table.getBoundingClientRect(), F = c.getBoundingClientRect(), H = M.top - F.top + c.scrollTop + d;
      _ = c.scrollTop - H, v = c.clientHeight;
    } else {
      const H = this.table.getBoundingClientRect().top + window.scrollY + d;
      _ = window.scrollY - H, v = window.innerHeight;
    }
    const A = an(_, v, a, b, 15), S = A.start, T = A.end, x = this.ths.length || 1, I = A.topPadding, N = A.bottomPadding, D = document.createDocumentFragment();
    if (I > 0) {
      const M = document.createElement("tr");
      M.className = "ln-table__spacer", M.setAttribute("aria-hidden", "true");
      const F = document.createElement("td");
      F.setAttribute("colspan", x), F.style.height = I + "px", M.appendChild(F), D.appendChild(M);
    }
    for (let M = S; M < T; M++)
      if (this._cache.has(M)) {
        const F = this._buildRow(this._cache.get(M));
        F && D.appendChild(F);
      } else
        D.appendChild(this._buildPlaceholderRow());
    if (N > 0) {
      const M = document.createElement("tr");
      M.className = "ln-table__spacer", M.setAttribute("aria-hidden", "true");
      const F = document.createElement("td");
      F.setAttribute("colspan", x), F.style.height = N + "px", M.appendChild(F), D.appendChild(M);
    }
    this.tbody.replaceChildren(D), this._vStart = S, this._vEnd = T, this._cache.ensure(S, T);
  }, y.prototype._showEmptyState = function() {
    const a = this.ths.length || 1;
    let b = null, d = null;
    if (this.isDataDriven) {
      const c = this._lastTotal != null ? this._lastTotal : this._data.length, v = this.visibleCount === 0 && c > 0, A = v ? this.name + "-empty-filtered" : this.name + "-empty";
      if (d = Lt(this.dom, A, "ln-table"), !d) {
        const S = this.dom.querySelector("template[data-ln-table-empty]");
        if (S) {
          const T = v ? "search" : "initial", x = S.content.querySelector('[data-ln-table-empty-when="' + T + '"]') || S.content.firstElementChild;
          x && (d = document.importNode(x, !0));
        }
      }
      if (d)
        if (d.tagName === "TR")
          b = d;
        else {
          const S = document.createElement("td");
          S.setAttribute("colspan", String(a)), S.appendChild(d);
          const T = document.createElement("tr");
          T.className = "ln-table__empty", T.appendChild(S), b = T;
        }
    } else {
      const c = this.dom.querySelector("template[" + i + "]"), _ = document.createElement("td");
      _.setAttribute("colspan", String(a)), c && _.appendChild(document.importNode(c.content, !0));
      const v = document.createElement("tr");
      v.className = "ln-table__empty", v.appendChild(_), b = v;
    }
    b ? this.tbody.replaceChildren(b) : this.tbody.replaceChildren(), k(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, y.prototype._fillRow = function(a, b) {
    Yt(a, b);
    const d = a.querySelectorAll("[data-ln-table-cell-attr]");
    for (let c = 0; c < d.length; c++) {
      const _ = d[c], v = _.getAttribute("data-ln-table-cell-attr").split(",");
      for (let A = 0; A < v.length; A++) {
        const S = v[A].trim().split(":");
        if (S.length !== 2) continue;
        const T = S[0].trim(), x = S[1].trim();
        b[T] != null && _.setAttribute(x, b[T]);
      }
    }
  }, y.prototype._buildRow = function(a) {
    let b = Lt(this.dom, this.name + "-row", "ln-table");
    if (!b) {
      const c = this.dom.querySelector("template[data-ln-table-row]");
      c && (b = document.importNode(c.content, !0));
    }
    let d = b ? b.querySelector("[data-ln-table-row]") || b.firstElementChild : null;
    if (d)
      this._fillRow(d, a);
    else if (a && a.html) {
      const c = document.createElement("tbody");
      c.innerHTML = a.html, d = c.firstElementChild;
    } else {
      d = document.createElement("tr"), d.setAttribute("data-ln-table-row", "");
      const c = this.ths;
      for (let _ = 0; _ < c.length; _++) {
        const v = c[_].hasAttribute("data-ln-table-col-select"), A = document.createElement("td");
        if (v) {
          const S = document.createElement("input");
          S.type = "checkbox", S.setAttribute("data-ln-table-row-select", ""), S.setAttribute("aria-label", "Select row"), A.appendChild(S);
        } else {
          const S = c[_].getAttribute("data-ln-table-col");
          S && a[S] != null && (A.textContent = String(a[S]));
        }
        d.appendChild(A);
      }
    }
    if (d._lnRecord = a, a.id != null && d.setAttribute("data-ln-table-row-id", a.id), this._selectable && a.id != null && this.selectedIds.has(String(a.id))) {
      d.classList.add("ln-row-selected");
      const c = d.querySelector("[data-ln-table-row-select]");
      c && (c.checked = !0);
    }
    return d;
  }, y.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    gn(this, "ln-table:request-data", "table");
  }, y.prototype._enterWindowedMode = function() {
    const a = this, b = this.dom, d = parseInt(b.getAttribute("data-ln-table-window"), 10), c = parseInt(b.getAttribute("data-ln-table-window-page"), 10), _ = parseInt(b.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !a._windowed || !a._cache || (a.totalCount = a._cache.grandTotal, a.visibleCount = a._cache.logicalTotal, a._lastTotal = a._cache.grandTotal, a.isLoaded = !0, a._vStart = -1, a._vEnd = -1, a._render(), a._updateFooter(), k(b, "ln-table:rendered", {
        table: a.name,
        total: a.totalCount,
        visible: a.visibleCount
      }));
    }, this._renderBatch = le(this._onCacheChange), this._cache = On({
      windowSize: d > 0 ? d : 1e3,
      pageSize: c > 0 ? c : 200,
      threshold: _ >= 0 ? _ : 25,
      fetchDebounce: 120,
      requestPage: function(v, A, S) {
        k(b, "ln-table:request-data", {
          table: a.name,
          sort: v.sort,
          filters: v.filters,
          search: v.search,
          offset: A,
          limit: S,
          queryGen: a._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, y.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let a = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(a) && this._totalSpan) {
        const d = this._totalSpan.textContent.replace(/[^\d]/g, "");
        d && (a = parseInt(d, 10));
      }
      const b = a > 0 ? a : this._data.length;
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
  }, y.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, y.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const a = this.tbody.querySelectorAll("[data-ln-table-row]"), b = [];
    for (let c = 0; c < a.length; c++) {
      const _ = a[c].getAttribute("data-ln-table-row-id");
      _ != null && b.push(_);
    }
    const d = Or(b, this.selectedIds);
    this._selectAllCheckbox.checked = d.isAllSelected, this._selectAllCheckbox.indeterminate = d.isIndeterminate;
  }, y.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const a = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let b = 0; b < a.length; b++) {
      const d = a[b].getAttribute("data-ln-table-row-id"), c = d != null && this.selectedIds.has(d);
      a[b].classList.toggle("ln-row-selected", c);
      const _ = a[b].querySelector("[data-ln-table-row-select]");
      _ && (_.checked = c);
    }
    this._updateSelectAll();
  }, Object.defineProperty(y.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), y.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const a = this;
    if (this._onSelectionChange = function(b) {
      const d = b.target.closest("[data-ln-table-row-select]");
      if (!d) return;
      const c = d.closest("[data-ln-table-row]");
      if (!c) return;
      const _ = c.getAttribute("data-ln-table-row-id");
      _ != null && (a.selectedIds = ln(a.selectedIds, _, d.checked), c.classList.toggle("ln-row-selected", d.checked), a.selectedCount = a.selectedIds.size, a._updateSelectAll(), a._updateFooter(), k(a.dom, "ln-table:select", {
        table: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const b = document.createElement("input");
      b.type = "checkbox";
      const d = a.dom.querySelector('[data-ln-table-dict="select-all"]'), c = a.dom.getAttribute("data-ln-table-select-all-label") || (d ? d.textContent.trim() : null) || "Select all";
      b.setAttribute("aria-label", c), this._selectAllCheckbox.appendChild(b), this._selectAllCheckbox = b;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const b = a._selectAllCheckbox.checked, d = a.tbody ? a.tbody.querySelectorAll("[data-ln-table-row]") : [], c = [];
      for (let _ = 0; _ < d.length; _++) {
        const v = d[_].getAttribute("data-ln-table-row-id"), A = d[_].querySelector("[data-ln-table-row-select]");
        v != null && (c.push(v), d[_].classList.toggle("ln-row-selected", b), A && (A.checked = b));
      }
      a.selectedIds = cn(a.selectedIds, c, b), a.selectedCount = a.selectedIds.size, k(a.dom, "ln-table:select-all", {
        table: a.name,
        selected: b
      }), k(a.dom, "ln-table:select", {
        table: a.name,
        selectedIds: a.selectedIds,
        count: a.selectedCount
      }), a._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const b = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let d = 0; d < b.length; d++) {
        const c = b[d].querySelector("[data-ln-table-row-select]"), _ = b[d].getAttribute("data-ln-table-row-id");
        c && c.checked && _ != null && (a.selectedIds = ln(a.selectedIds, _, !0), b[d].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, y.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const a = this.dom.querySelector("[data-ln-table-col-select]");
    if (a) {
      const b = a.querySelector('input[type="checkbox"]');
      b && b.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = cn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const b = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let d = 0; d < b.length; d++) {
        b[d].classList.remove("ln-row-selected");
        const c = b[d].querySelector("[data-ln-table-row-select]");
        c && (c.checked = !1);
      }
    }
    this._updateFooter();
  }, y.prototype._updateFooter = function() {
    let a = 0, b = 0;
    this.isDataDriven ? (a = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount) : (a = this._data.length, b = this._filteredData.length);
    const d = b < a;
    if (this._totalSpan && (this._totalSpan.textContent = w(a, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = d ? w(b, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !d), this._selectedSpan) {
      const c = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = c > 0 ? w(c, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", c === 0);
    }
  }, y.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, y, "ln-table", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-table-coordinator": { type: "marker", description: "Mounts table coordinator mediating between table, search, filter, and pagination" }
  };
  document.addEventListener("keydown", function(o) {
    if (o.key !== "/" || o.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const s = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!s) return;
    const n = s.tagName === "INPUT" || s.tagName === "TEXTAREA" ? s : s.querySelector('input[type="search"], input[type="text"], input');
    n && (o.preventDefault(), n.focus());
  });
  function l(o) {
    return this.dom = o, r(this), this;
  }
  function p(o, s) {
    const n = s ? '[data-ln-search-for="' + s + '"]' : "[data-ln-search-for]", u = o.querySelector(n) || document.querySelector(n);
    return u ? u.tagName === "INPUT" || u.tagName === "TEXTAREA" ? u : u.querySelector("input, textarea") : null;
  }
  function g(o, s) {
    if (s) {
      const u = o.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (u.length > 0) return u;
      const h = document.querySelectorAll('[data-ln-filter="' + s + '"]');
      if (h.length > 0) return h;
    }
    const n = o.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function r(o) {
    const s = o.dom;
    function n(u) {
      const h = u.target;
      if (h && h.hasAttribute && (h.hasAttribute("data-ln-table") || h.tagName === "TABLE")) return h;
      const f = u.detail && u.detail.targetId || h && h.id;
      if (!f) return null;
      const E = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(f) : f.replace(/(["\\])/g, "\\$1");
      return s.querySelector('[data-ln-table-source="' + E + '"]') || s.querySelector('[data-ln-table="' + E + '"]') || (s.id === f ? s : null) || document.getElementById(f);
    }
    o._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(u) {
        if (!u.detail) return;
        const h = n(u);
        if (!h) return;
        const f = u.detail.key, E = u.detail.values || [], w = h.querySelectorAll("th");
        for (let m = 0; m < w.length; m++)
          if ((w[m].getAttribute("data-ln-table-filter-col") || w[m].getAttribute("data-ln-filter-col") || w[m].getAttribute("data-ln-filter-key") || w[m].getAttribute("data-ln-field")) === f) {
            const a = w[m].querySelector("[data-ln-table-col-filter], .table-filter");
            a && a.classList.toggle("ln-filter-active", E.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(u) {
        const h = u.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!h) return;
        const f = h.closest("[data-ln-table], table") || s.querySelector("[data-ln-table], table");
        if (!f) return;
        const E = f.lnTable && f.lnTable.name || f.id, w = f.querySelectorAll("th");
        for (let b = 0; b < w.length; b++) {
          const d = w[b].querySelector("[data-ln-table-col-filter], .table-filter");
          d && d.classList.remove("ln-filter-active");
        }
        const m = f.getAttribute("data-ln-table-source") || f.id, y = m ? document.getElementById(m) : null;
        if (y && y.hasAttribute("data-ln-search"))
          y.setAttribute("data-ln-search", "");
        else {
          const b = p(s, m);
          b && b.value !== "" && (b.value = "", b.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const a = g(s, m);
        for (let b = 0; b < a.length; b++) {
          const d = a[b].querySelector("[data-ln-filter-reset]");
          if (!d) continue;
          const c = a[b].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!d.checked || c) && (d.checked = !0, d.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        f.lnTable && !f.hasAttribute("data-ln-table-source") && k(f, "ln-table:request-clear-filters", { table: E });
      }
    }, s.addEventListener("ln-filter:change", o._handlers.filter), s.addEventListener("click", o._handlers.clear);
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, U(t, e, l, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function s(c, _) {
    if (!c || !c.isDataDriven) return;
    const v = c.dom.hasAttribute("data-ln-list-window");
    if (v && !c._windowed)
      c._enterWindowedMode(), c._kickWindowInitial();
    else if (!v && c._windowed)
      c._exitWindowedMode();
    else if (v && c._windowed) {
      const A = parseInt(_, 10);
      A > 0 && c._cache.configure({ windowSize: A });
    }
  }
  function n(c, _) {
    if (!c || !c.isDataDriven || !c._windowed || !c._cache) return;
    const v = parseInt(_, 10);
    v > 0 && c._cache.configure({ pageSize: v });
  }
  function u(c, _) {
    if (!c || !c.isDataDriven || !c._windowed || !c._cache) return;
    const v = parseInt(_, 10);
    v >= 0 && c._cache.configure({ threshold: v });
  }
  function h(c, _) {
    if (!c || !c.isDataDriven || !c._windowed || !c._cache) return;
    const v = parseInt(_, 10);
    v >= 0 && c._cache.setGrandTotal(v);
  }
  const f = {
    "data-ln-list": { prop: "name", type: "string", read: K, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: K, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: s, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: u, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: h, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, E = Y(f);
  function w(c, _) {
    if (c == null || isNaN(c)) return "";
    try {
      return new Intl.NumberFormat(J(_)).format(c);
    } catch {
      return String(c);
    }
  }
  function m(c) {
    let _ = c;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const A = getComputedStyle(_).overflowY;
      if (A === "auto" || A === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function y(c) {
    const _ = c._scrollContainer || m(c.dom);
    return {
      container: _,
      top: _ ? _.scrollTop : window.scrollY
    };
  }
  function a(c) {
    c.container ? c.container.scrollTop = c.top : window.scrollTo(window.scrollX, c.top);
  }
  function b(c) {
    if (!c) return 0;
    const _ = getComputedStyle(c), v = parseFloat(_.marginTop) || 0, A = parseFloat(_.marginBottom) || 0;
    return c.offsetHeight + v + A;
  }
  function d(c) {
    this.dom = c, Q(this, c, E), this.tbody = c.querySelector("[data-ln-list-body]") || c, this.isDataDriven = c.hasAttribute("data-ln-list-source"), this._totalSpan = c.querySelector("[data-ln-list-total]"), this._filteredSpan = c.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== c ? this._filteredSpan.parentElement : null), this._selectedSpan = c.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== c ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const _ = this;
    return this._onSetSearch = function(v) {
      const A = (v.detail && v.detail.query != null ? v.detail.query : v.detail && v.detail.term != null ? v.detail.term : "").trim();
      _.isDataDriven ? (_.currentSearch = A, k(c, "ln-list:search", {
        list: _.name,
        query: _.currentSearch
      }), _._requestData()) : (_._searchTerm = A.toLowerCase(), _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(c, "ln-list:filter", {
        term: _._searchTerm,
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, c.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(v) {
      v.preventDefault(), _._onSetSearch(v);
    }, c.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      _.isDataDriven ? (_.currentFilters = {}, _.currentSearch = "", k(c, "ln-list:clear-filters", { list: _.name }), _._requestData()) : (_._searchTerm = "", _._filters = {}, _._sortField = null, _._sortDir = null, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(c, "ln-list:filter", {
        term: "",
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, c.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, c.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(v) {
      const A = v.detail || {}, S = A.data || [], T = A.total != null ? A.total : S.length;
      if (!(_._hasInitialSeed && !_.isLoaded && S.length === 0 && T === 0)) {
        if (_._windowed) {
          _._cache.ingest(A) && !A.provisional && c.classList.remove("ln-list--loading");
          return;
        }
        _._data = S, _._lastTotal = T, _._lastFiltered = A.filtered != null ? A.filtered : _._data.length, _.totalCount = _._lastTotal, _.visibleCount = _._lastFiltered, _.isLoaded = !0, _._hasInitialSeed = !1, c.classList.remove("ln-list--loading"), _._vStart = -1, _._vEnd = -1, _._applyFilterAndSort(), _._render(), _._updateFooter(), k(c, "ln-list:rendered", {
          list: _.name,
          total: _.totalCount,
          visible: _.visibleCount
        });
      }
    }, c.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(v) {
      const A = v.detail && v.detail.loading;
      c.classList.toggle("ln-list--loading", !!A), A && (_.isLoaded = !1);
    }, c.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(v) {
      !_._windowed || !_._cache || _._cache.release(v.detail && v.detail.offset);
    }, c.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !_._windowed || !_._cache || _._cache.revalidate();
    }, c.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !_._windowed || !_._cache || _._requestData();
    }, c.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(v) {
      !v.detail || v.detail.field == null || (v.preventDefault(), _.currentSort = v.detail.direction === "none" ? null : { field: v.detail.field, direction: v.detail.direction }, _._requestData());
    }, c.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(v) {
      if (v.target.closest("[data-ln-item-select]") || v.target.closest("[data-ln-item-action]") || v.target.closest("a") || v.target.closest("button") || v.ctrlKey || v.metaKey || v.button === 1) return;
      const A = v.target.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id"), T = A._lnRecord || {};
      k(c, "ln-list:item-click", {
        list: _.name,
        id: S,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(v) {
      const A = v.target.closest("[data-ln-item-action]");
      if (!A) return;
      const S = A.closest("[data-ln-item]");
      if (!S) return;
      const T = A.getAttribute("data-ln-item-action"), x = S.getAttribute("data-ln-item-id"), I = S._lnRecord || {};
      k(c, "ln-list:item-action", {
        list: _.name,
        id: x,
        action: T,
        record: I
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : k(c, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      _.tbody.children.length > 0 && (_._emptyObserver.disconnect(), _._emptyObserver = null, _._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(v) {
      if (v.preventDefault(), !v.detail) return;
      const A = v.detail.key, S = v.detail.values || [];
      if (A) {
        if (S.length === 0)
          delete _._filters[A];
        else {
          const T = [];
          for (let x = 0; x < S.length; x++)
            T.push(S[x].toLowerCase());
          _._filters[A] = T;
        }
        _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(c, "ln-list:filter", {
          term: _._searchTerm,
          matched: _._filteredData.length,
          total: _._data.length
        });
      }
    }, c.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(v) {
      if (!v.detail || v.detail.field == null) return;
      v.preventDefault();
      const A = v.detail.direction === "none" ? null : v.detail.direction;
      _._sortField = A === null ? null : v.detail.field, _._sortDir = A, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), k(c, "ln-list:sorted", {
        field: _._sortField,
        direction: v.detail && v.detail.direction,
        matched: _._filteredData.length,
        total: _._data.length
      });
    }, c.addEventListener("ln-sort:change", this._onSort)), this;
  }
  d.prototype._parseChildren = function() {
    const c = Array.from(this.tbody.children).filter((_) => !_.classList.contains("ln-list__spacer"));
    this._data = [], c.length > 0 && (this._itemHeight = b(c[0]) || 50);
    for (let _ = 0; _ < c.length; _++) {
      const v = c[_], A = v.getAttribute("data-ln-item-id") || v.getAttribute("id"), S = v.textContent.trim().toLowerCase();
      let T = null;
      if (this.isDataDriven) {
        T = {}, A != null && (T.id = A);
        const N = v.querySelectorAll("[data-ln-list-field]");
        for (let D = 0; D < N.length; D++) {
          const M = N[D], F = M.getAttribute("data-ln-list-field");
          F && (T[F] = Et(M));
        }
      }
      const x = {}, I = v.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let N = 0; N < I.length; N++) {
        const D = I[N], M = D.getAttribute("data-ln-list-field") || D.getAttribute("data-ln-field");
        M && (x[M] = Et(D));
      }
      for (let N = 0; N < v.attributes.length; N++) {
        const D = v.attributes[N];
        if (D.name.startsWith("data-") && !D.name.startsWith("data-ln-")) {
          const M = D.name.slice(5);
          M && (x[M] = D.value);
        }
      }
      this._data.push({
        html: v.outerHTML,
        id: A,
        searchText: S,
        fields: x,
        ...T || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), k(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, d.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const c = this._searchTerm, _ = c ? c.split(/\s+/).filter(Boolean) : [], v = this._filters || {}, A = Object.keys(v).length > 0;
      if (_.length === 0 && !A ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(S) {
        if (_.length > 0 && !_.every(function(x) {
          return S.searchText && S.searchText.indexOf(x) !== -1;
        }))
          return !1;
        if (A)
          for (const T in v) {
            const x = v[T];
            if (x && x.length > 0) {
              const I = S.fields && S.fields[T] !== void 0 ? S.fields[T] : S[T] !== void 0 ? S[T] : null, N = I != null ? String(I).toLowerCase() : "";
              if (x.indexOf(N) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const S = this._sortField, T = this._sortDir === "desc" ? -1 : 1, x = typeof Intl < "u" ? new Intl.Collator(J(this.dom), { sensitivity: "base" }) : null, I = this._filteredData.map(function(D) {
          return D.fields && D.fields[S] !== void 0 ? D.fields[S] : D[S];
        }), N = Ne(I);
        this._filteredData.sort(function(D, M) {
          const F = D.fields && D.fields[S] !== void 0 ? D.fields[S] : D[S], H = M.fields && M.fields[S] !== void 0 ? M.fields[S] : M[S];
          return Me(F, H, N, x) * T;
        });
      }
    }
  }, d.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const c = this._lastTotal, _ = this.visibleCount;
        if (c === 0 || this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const c = this._filteredData.length;
        c === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : c > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, d.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const c = this._filteredData, _ = document.createDocumentFragment();
      for (let A = 0; A < c.length; A++) {
        const S = this._buildItem(c[A]);
        S && _.appendChild(S);
      }
      const v = y(this);
      this.tbody.replaceChildren(_), a(v), this._selectable && this._updateSelectAll();
    } else {
      const c = [], _ = this._filteredData;
      for (let A = 0; A < _.length; A++) c.push(_[A].html);
      const v = y(this);
      this.tbody.innerHTML = c.join(""), a(v), this._selectable && this._restoreSelection();
    }
  }, d.prototype._readGridLayout = function() {
    const c = getComputedStyle(this.tbody), _ = c.gridTemplateColumns;
    let v = 1;
    if (_ && _ !== "none") {
      const S = _.trim().split(/\s+/).filter(Boolean);
      S.length > 0 && (v = S.length);
    }
    const A = parseFloat(c.rowGap);
    return { columns: v, rowGap: isNaN(A) ? 0 : A };
  }, d.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const c = this._cache.peek(), _ = c ? this._buildItem(c) : this._buildPlaceholderItem();
      _ && (this.tbody.textContent = "", this.tbody.appendChild(_), this._itemHeight = b(_) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const c = this._buildItem(this._data[0]);
        c && (this.tbody.textContent = "", this.tbody.appendChild(c), this._itemHeight = b(c) || 50, this.tbody.textContent = "");
      }
    } else {
      const c = this.tbody.children;
      c.length > 0 && (this._itemHeight = b(c[0]) || 50);
    }
  }, d.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const c = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = m(this.dom);
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      c._rafId || (c._rafId = requestAnimationFrame(function() {
        c._rafId = null, c._windowed ? c._renderWindowed() : c._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      c._itemHeight = 0, c._measureItemHeight(), c._vStart = -1, c._vEnd = -1, c._windowed ? c._renderWindowed() : c._renderVirtual();
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, d.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, d.prototype._renderVirtual = function() {
    const c = this._filteredData, _ = c.length, v = this._itemHeight;
    if (!v || !_) return;
    const A = this._scrollContainer;
    let S, T;
    if (A) {
      const nt = this.tbody.getBoundingClientRect(), V = A.getBoundingClientRect(), W = A === this.tbody ? 0 : nt.top - V.top + A.scrollTop;
      S = A.scrollTop - W, T = A.clientHeight;
    } else {
      const V = this.tbody.getBoundingClientRect().top + window.scrollY;
      S = window.scrollY - V, T = window.innerHeight;
    }
    const x = this._readGridLayout(), I = x.columns, N = x.rowGap, D = v + N, M = Math.ceil(_ / I);
    let F = Math.max(0, Math.floor(S / D) - 15);
    F = Math.min(F, M);
    const H = Math.ceil(T / D) + 30, j = Math.min(F + H, M), X = Math.min(F * I, _), et = Math.min(j * I, _);
    if (X === this._vStart && et === this._vEnd) return;
    this._vStart = X, this._vEnd = et;
    const _t = F * D, at = (M - j) * D;
    if (this.isDataDriven) {
      const nt = document.createDocumentFragment();
      if (_t > 0) {
        const W = document.createElement(this.isUl ? "li" : "div");
        W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = _t + "px", nt.appendChild(W);
      }
      for (let W = X; W < et; W++) {
        const bt = this._buildItem(c[W]);
        bt && nt.appendChild(bt);
      }
      if (at > 0) {
        const W = document.createElement(this.isUl ? "li" : "div");
        W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = at + "px", nt.appendChild(W);
      }
      const V = y(this);
      this.tbody.replaceChildren(nt), a(V), this._selectable && this._updateSelectAll();
    } else {
      let nt = "";
      _t > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${_t}px"></${this.isUl ? "li" : "div"}>`);
      for (let W = X; W < et; W++)
        nt += c[W].html;
      at > 0 && (nt += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${at}px"></${this.isUl ? "li" : "div"}>`);
      const V = y(this);
      this.tbody.innerHTML = nt, a(V), this._selectable && this._restoreSelection();
    }
  }, d.prototype._buildPlaceholderItem = function() {
    const c = document.createElement(this.isUl ? "li" : "div");
    return c.className = "ln-list__placeholder", c.setAttribute("aria-hidden", "true"), c.style.height = this._itemHeight + "px", c;
  }, d.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const c = this._itemHeight;
    if (!c) return;
    const _ = this._scrollContainer;
    let v, A;
    if (_) {
      const V = this.tbody.getBoundingClientRect(), W = _.getBoundingClientRect(), bt = _ === this.tbody ? 0 : V.top - W.top + _.scrollTop;
      v = _.scrollTop - bt, A = _.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      v = window.scrollY - W, A = window.innerHeight;
    }
    const S = this._readGridLayout(), T = S.columns, x = S.rowGap, I = c + x, N = this._cache.logicalTotal, D = Math.ceil(N / T);
    let M = Math.max(0, Math.floor(v / I) - 15);
    M = Math.min(M, D);
    const F = Math.ceil(A / I) + 30, H = Math.min(M + F, D), j = Math.min(M * T, N), X = Math.min(H * T, N), et = M * I, _t = (D - H) * I, at = document.createDocumentFragment();
    if (et > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = et + "px", at.appendChild(V);
    }
    for (let V = j; V < X; V++)
      if (this._cache.has(V)) {
        const W = this._buildItem(this._cache.get(V));
        W && at.appendChild(W);
      } else
        at.appendChild(this._buildPlaceholderItem());
    if (_t > 0) {
      const V = document.createElement(this.isUl ? "li" : "div");
      V.className = "ln-list__spacer", V.setAttribute("aria-hidden", "true"), V.style.height = _t + "px", at.appendChild(V);
    }
    const nt = y(this);
    this.tbody.replaceChildren(at), a(nt), this._vStart = j, this._vEnd = X, this._cache.ensure(j, X);
  }, d.prototype._showEmptyState = function() {
    let c = null;
    if (this.isDataDriven) {
      const _ = this._lastTotal != null ? this._lastTotal : this._data.length, A = this.visibleCount === 0 && _ > 0, S = A ? this.name + "-empty-filtered" : this.name + "-empty";
      if (c = Lt(this.dom, S, "ln-list"), !c) {
        const T = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (T) {
          const x = A ? "search" : "initial", I = T.content.querySelector(`[data-ln-empty-when="${x}"]`) || T.content.firstElementChild;
          I && (c = document.importNode(I, !0));
        }
      }
    } else {
      const _ = this.dom.querySelector(`template[${i}]`);
      if (_) {
        const v = _.content.firstElementChild;
        v && (c = document.importNode(v, !0));
      }
    }
    if (c)
      if (c.tagName === "LI" || c.tagName === "TR")
        this.tbody.replaceChildren(c);
      else {
        const _ = document.createElement(this.isUl ? "li" : "div");
        _.appendChild(c), this.tbody.replaceChildren(_);
      }
    else
      this.tbody.replaceChildren();
    k(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, d.prototype._buildItem = function(c) {
    let _ = Lt(this.dom, this.name + "-row", "ln-list");
    if (!_) {
      const A = this.dom.querySelector("template[data-ln-item]");
      A && (_ = document.importNode(A.content, !0));
    }
    let v = _ ? _.querySelector("[data-ln-item]") || _.firstElementChild : null;
    if (v)
      Yt(v, c), ut(v, c);
    else if (c && c.html) {
      const A = document.createElement(this.isUl ? "ul" : "div");
      A.innerHTML = c.html, v = A.firstElementChild;
    } else if (v = document.createElement(this.isUl ? "li" : "div"), v.setAttribute("data-ln-item", ""), c && typeof c == "object") {
      for (const A in c)
        if (A !== "html" && c[A] != null) {
          const S = document.createElement("span");
          S.setAttribute("data-ln-field", A), S.textContent = String(c[A]), v.appendChild(S);
        }
    }
    if (v._lnRecord = c, c && c.id != null && (v.setAttribute("data-ln-item-id", c.id), this._selectable && this.selectedIds.has(String(c.id)))) {
      v.classList.add("ln-item-selected");
      const A = v.querySelector("[data-ln-item-select]");
      A && (A.checked = !0);
    }
    return v;
  }, d.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const c = this.tbody.querySelectorAll("[data-ln-item]");
    for (let _ = 0; _ < c.length; _++) {
      const v = c[_].getAttribute("data-ln-item-id"), A = v != null && this.selectedIds.has(String(v));
      c[_].classList.toggle("ln-item-selected", A);
      const S = c[_].querySelector("[data-ln-item-select]");
      S && (S.checked = A);
    }
    this._updateSelectAll();
  }, d.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const c = this;
    this._onSelectionChange = function(_) {
      const v = _.target.closest("[data-ln-item-select]");
      if (!v) return;
      const A = v.closest("[data-ln-item]");
      if (!A) return;
      const S = A.getAttribute("data-ln-item-id");
      S != null && (v.checked ? (c.selectedIds.add(String(S)), A.classList.add("ln-item-selected")) : (c.selectedIds.delete(String(S)), A.classList.remove("ln-item-selected")), c._updateSelectAll(), c._updateFooter(), k(c.dom, "ln-list:select", {
        list: c.name,
        selectedIds: c.selectedIds,
        count: c.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = c._selectAllCheckbox.checked, v = c.tbody.querySelectorAll("[data-ln-item]");
      for (let A = 0; A < v.length; A++) {
        const S = v[A], T = S.getAttribute("data-ln-item-id"), x = S.querySelector("[data-ln-item-select]");
        T != null && (_ ? (c.selectedIds.add(String(T)), S.classList.add("ln-item-selected")) : (c.selectedIds.delete(String(T)), S.classList.remove("ln-item-selected")), x && (x.checked = _));
      }
      k(c.dom, "ln-list:select-all", { list: c.name, selected: _ }), k(c.dom, "ln-list:select", {
        list: c.name,
        selectedIds: c.selectedIds,
        count: c.selectedIds.size
      }), c._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, d.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const c = this.tbody.querySelectorAll("[data-ln-item]");
    let _ = c.length > 0;
    for (let v = 0; v < c.length; v++) {
      const A = c[v].getAttribute("data-ln-item-id");
      if (A != null && !this.selectedIds.has(String(A))) {
        _ = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = _;
  }, d.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    gn(this, "ln-list:request-data", "list");
  }, d.prototype._enterWindowedMode = function() {
    const c = this, _ = this.dom, v = parseInt(_.getAttribute("data-ln-list-window"), 10), A = parseInt(_.getAttribute("data-ln-list-window-page"), 10), S = parseInt(_.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !c._windowed || !c._cache || (c.totalCount = c._cache.grandTotal, c.visibleCount = c._cache.logicalTotal, c._lastTotal = c._cache.grandTotal, c.isLoaded = !0, c._vStart = -1, c._vEnd = -1, c._render(), c._updateFooter(), k(_, "ln-list:rendered", {
        list: c.name,
        total: c.totalCount,
        visible: c.visibleCount
      }));
    }, this._renderBatch = le(this._onCacheChange), this._cache = On({
      windowSize: v > 0 ? v : 1e3,
      pageSize: A > 0 ? A : 200,
      threshold: S >= 0 ? S : 25,
      fetchDebounce: 120,
      requestPage: function(T, x, I) {
        k(_, "ln-list:request-data", {
          list: c.name,
          sort: T.sort,
          filters: T.filters,
          search: T.search,
          offset: x,
          limit: I,
          queryGen: c._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, d.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const c = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), _ = c > 0 ? c : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: _,
        filtered: _
      });
    } else
      this.dom.classList.add("ln-list--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, d.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, d.prototype._updateFooter = function() {
    let c = 0, _ = 0;
    this.isDataDriven ? (c = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (c = this._data.length, _ = this._filteredData.length);
    const v = _ < c;
    if (this._totalSpan && (this._totalSpan.textContent = w(c, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = v ? w(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !v), this._selectedSpan) {
      const A = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = A > 0 ? w(A, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", A === 0);
    }
  }, d.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, U(t, e, d, "ln-list", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(f) {
    const E = f[e];
    E && h.call(E);
  }
  const l = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, p = "http://www.w3.org/2000/svg", g = 36, r = 16, o = 2 * Math.PI * r;
  function s(f) {
    return this.dom = f, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, u.call(this), h.call(this), this;
  }
  s.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(f, E) {
    const w = document.createElementNS(p, f);
    for (const [m, y] of Object.entries(E))
      w.setAttribute(m, y);
    return w;
  }
  function u() {
    this.svg = n("svg", {
      viewBox: "0 0 " + g + " " + g,
      width: g,
      height: g
    }), this.svg.classList.add("ln-circular-progress__svg"), this.trackCircle = n("circle", {
      cx: g / 2,
      cy: g / 2,
      r,
      fill: "none",
      "stroke-width": "3"
    }), this.trackCircle.classList.add("ln-circular-progress__track"), this.progressCircle = n("circle", {
      cx: g / 2,
      cy: g / 2,
      r,
      fill: "none",
      "stroke-width": "3",
      "stroke-linecap": "round",
      "stroke-dasharray": o,
      "stroke-dashoffset": o,
      transform: "rotate(-90 " + g / 2 + " " + g / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function h() {
    const f = this.dom.getAttribute("data-ln-circular-progress"), E = this.dom.getAttribute("data-ln-circular-progress-max"), w = Pn(f, E || 100), m = o - w.percentage / 100 * o;
    this.progressCircle.setAttribute("stroke-dashoffset", m);
    const y = this.dom.getAttribute("data-ln-circular-progress-label"), a = y !== null ? y : Math.round(w.percentage) + "%";
    this.labelEl.textContent = a, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(w.min)), this.dom.setAttribute("aria-valuemax", String(w.max)), this.dom.setAttribute("aria-valuenow", String(w.clampedValue)), this.dom.setAttribute("aria-valuetext", a), k(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: w.value,
      max: w.max,
      percentage: w.percentage
    });
  }
  U(t, e, s, "ln-circular-progress", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-sortable": { effect: g, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function p(r) {
    this.dom = r, this.isEnabled = r.getAttribute(t) !== "disabled", this._dragging = null, r.setAttribute("aria-roledescription", "sortable list");
    const o = this;
    return this._onPointerDown = function(s) {
      o.isEnabled && o._handlePointerDown(s);
    }, r.addEventListener("pointerdown", this._onPointerDown), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, p.prototype._handlePointerDown = function(r) {
    let o = r.target.closest("[" + i + "]"), s;
    if (o) {
      for (s = o; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
      for (s = r.target; s && s.parentElement !== this.dom; )
        s = s.parentElement;
      if (!s || s.parentElement !== this.dom) return;
      o = s;
    }
    const u = Array.from(this.dom.children).indexOf(s);
    if ($(this.dom, "ln-sortable:before-drag", {
      item: s,
      index: u
    }).defaultPrevented) return;
    r.preventDefault(), o.setPointerCapture(r.pointerId), this._dragging = s, s.classList.add("ln-sortable--dragging"), s.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), k(this.dom, "ln-sortable:drag-start", {
      item: s,
      index: u
    });
    const f = this, E = function(m) {
      f._handlePointerMove(m);
    }, w = function(m) {
      f._handlePointerEnd(m), o.removeEventListener("pointermove", E), o.removeEventListener("pointerup", w), o.removeEventListener("pointercancel", w);
    };
    o.addEventListener("pointermove", E), o.addEventListener("pointerup", w), o.addEventListener("pointercancel", w);
  }, p.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const o = Array.from(this.dom.children), s = this._dragging;
    for (const n of o)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of o) {
      if (n === s) continue;
      const u = n.getBoundingClientRect(), h = u.top + u.height / 2;
      if (r.clientY >= u.top && r.clientY < h) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= h && r.clientY <= u.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, p.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const o = this._dragging, s = Array.from(this.dom.children), n = s.indexOf(o);
    let u = null, h = null;
    for (const f of s) {
      if (f.classList.contains("ln-sortable--drop-before")) {
        u = f, h = "before";
        break;
      }
      if (f.classList.contains("ln-sortable--drop-after")) {
        u = f, h = "after";
        break;
      }
    }
    for (const f of s)
      f.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (o.classList.remove("ln-sortable--dragging"), o.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), u && u !== o) {
      h === "before" ? this.dom.insertBefore(o, u) : this.dom.insertBefore(o, u.nextElementSibling);
      const E = Array.from(this.dom.children).indexOf(o);
      k(this.dom, "ln-sortable:reordered", {
        item: o,
        oldIndex: n,
        newIndex: E
      });
    }
    this._dragging = null;
  };
  function g(r) {
    const o = r[e];
    if (!o) return;
    const s = r.getAttribute(t) !== "disabled";
    s !== o.isEnabled && (o.isEnabled = s, k(r, s ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: r }));
  }
  U(t, e, p, "ln-sortable", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", l = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const p = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: o, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: s, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function g(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = r(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const u of [this.available, this.selected])
      for (const h of u.children)
        this._initial.push(h);
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
    for (let h = 0; h < n.length; h++)
      this._initial.includes(n[h]) || this._initial.push(n[h]);
    let u = 0;
    for (let h = 0; h < this._initial.length; h++) {
      const f = this._initial[h];
      if (!f.isConnected) continue;
      const E = f.querySelector('input[type="checkbox"]');
      if (!E) continue;
      let w;
      E.checked ? this.max === null || u < this.max ? (w = this.selected, u++) : (E.checked = !1, w = this.available) : w = this.available, w.appendChild(f);
    }
  }, g.prototype._onFormReset = function(n) {
    const u = this;
    setTimeout(function() {
      u._destroyed || n.defaultPrevented || u.sync();
    }, 0);
  }, g.prototype._onChange = function(n) {
    const u = n.target.closest('input[type="checkbox"]');
    if (!u) return;
    const h = u.closest("li");
    if (!h) return;
    const f = h.parentElement;
    if (f !== this.available && f !== this.selected) return;
    if (!this.isEnabled) {
      u.checked = !u.checked;
      return;
    }
    const E = u.checked ? this.selected : this.available;
    if (f === E) return;
    if (E === this.selected && this.max !== null && this.selected.children.length >= this.max) {
      u.checked = !u.checked, k(this.dom, "ln-picklist:max-reached", {
        max: this.max,
        item: h,
        checkbox: u,
        count: this.selected.children.length
      });
      return;
    }
    const w = { item: h, from: f, to: E, checkbox: u };
    if ($(this.dom, "ln-picklist:before-move", w).defaultPrevented) {
      u.checked = !u.checked;
      return;
    }
    const m = document.activeElement === u;
    E.appendChild(h), m && u.focus(), k(this.dom, "ln-picklist:move", w);
  };
  function r(n) {
    const u = n.getAttribute(l);
    if (u === null || u === "") return null;
    const h = parseInt(u, 10);
    return isNaN(h) || h < 0 ? null : h;
  }
  function o(n) {
    const u = n[e];
    if (!u) return;
    const h = n.getAttribute(t) !== "disabled";
    h !== u.isEnabled && (u.isEnabled = h, k(n, h ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function s(n) {
    const u = n[e];
    u && (u.max = r(n));
  }
  U(t, e, g, "ln-picklist", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", l = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function g(h, f, E) {
    return h.getAttribute(f) || E;
  }
  function r(h, f, E) {
    const w = parseFloat(h.getAttribute(f));
    return isNaN(w) || w <= 0 ? E : w;
  }
  function o(h) {
    const f = document.createElement("span");
    return f.setAttribute(l, ""), f.setAttribute("role", "alert"), f.textContent = h, f;
  }
  const s = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: g, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: r, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (h, f) => h.getAttribute(f) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = Y(s);
  function u(h) {
    this.dom = h, Q(this, h, n), this.revertTimer = null, this._submitted = !1, this.idleEl = h.querySelector("[data-ln-confirm-idle]"), this.activeEl = h.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : h.textContent.trim();
    const f = this;
    return this._onClick = function(E) {
      if (!xe(E))
        if (!f.confirming)
          E.preventDefault(), E.stopImmediatePropagation(), f._enterConfirm();
        else {
          if (f._submitted) return;
          f._submitted = !0, f._reset();
        }
    }, h.addEventListener("click", this._onClick), this;
  }
  u.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const h = this.activeEl ? this.activeEl.textContent.trim() : "";
      h && (this.dom.setAttribute("aria-label", h), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = h.getAttribute("href"), h.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(o(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), k(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, u.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const h = this, f = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      h._reset();
    }, f);
  }, u.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const h = this.dom.querySelector("svg.ln-icon use");
      h && this.originalIconHref && h.setAttribute("href", this.originalIconHref);
      const f = this.dom.querySelector("[" + l + "]");
      f && f.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, u.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, U(t, e, u, "ln-confirm", {
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
  }, l = Y(i), p = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function g(r) {
    if (this.dom = r, Q(this, r, l), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = r.querySelector("[data-ln-translations-active]"), this.menuEl = r.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = p, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const o = this;
    return this._onRequestAdd = function(s) {
      s.detail && s.detail.lang && o.addLanguage(s.detail.lang);
    }, this._onRequestRemove = function(s) {
      s.detail && s.detail.lang && o.removeLanguage(s.detail.lang);
    }, r.addEventListener("ln-translations:request-add", this._onRequestAdd), r.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  g.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const r = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const o of r) {
      const s = o.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of s)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, g.prototype._detectExisting = function() {
    const r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const o of r) {
      const s = o.getAttribute("data-ln-translatable-lang");
      s && s !== this.defaultLang && this.activeLanguages.add(s);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, g.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const r = this;
    let o = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      o++;
      const u = ie("ln-translations-menu-item", "ln-translations");
      if (!u) return;
      const h = u.querySelector("[data-ln-translations-lang]");
      h.setAttribute("data-ln-translations-lang", n), h.textContent = this.locales[n], h.addEventListener("click", function(f) {
        f.ctrlKey || f.metaKey || f.button === 1 || (f.preventDefault(), f.stopPropagation(), r.menuEl.getAttribute("data-ln-toggle") === "open" && r.menuEl.setAttribute("data-ln-toggle", "close"), r.addLanguage(n));
      }), this.menuEl.appendChild(u);
    }
    const s = this.dom.querySelector("[data-ln-translations-add]");
    s && (s.hidden = o === 0);
  }, g.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const r = this;
    this.activeLanguages.forEach(function(o) {
      const s = ie("ln-translations-badge", "ln-translations");
      if (!s) return;
      const n = s.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", o);
      const u = n.querySelector("span");
      u.textContent = r.locales[o] || o.toUpperCase();
      const h = n.querySelector("button"), f = r.locales[o] || o.toUpperCase();
      h.setAttribute("aria-label", r.removeLabel.replace("{lang}", f)), h.addEventListener("click", function(E) {
        E.ctrlKey || E.metaKey || E.button === 1 || (E.preventDefault(), E.stopPropagation(), r.removeLanguage(o));
      }), r.badgesEl.appendChild(s);
    });
  }, g.prototype.addLanguage = function(r, o) {
    if (this.activeLanguages.has(r)) return;
    const s = this.locales[r] || r;
    if ($(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: r,
      langName: s
    }).defaultPrevented) return;
    this.activeLanguages.add(r), o = o || {};
    const u = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const h of u) {
      const f = h.getAttribute("data-ln-translatable"), E = h.getAttribute("data-ln-translations-prefix") || "", w = h.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!w) continue;
      const m = w.cloneNode(w.tagName === "SELECT");
      E ? m.name = E + "[trans][" + r + "][" + f + "]" : m.name = "trans[" + r + "][" + f + "]", m.value = o[f] !== void 0 ? o[f] : "", m.removeAttribute("id"), "placeholder" in m && (m.placeholder = this.placeholderLabel.replace("{lang}", s)), m.setAttribute("data-ln-translatable-lang", r);
      const y = h.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), a = y.length > 0 ? y[y.length - 1] : w;
      a.parentNode.insertBefore(m, a.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: r,
      langName: s
    });
  }, g.prototype.removeLanguage = function(r) {
    if (!this.activeLanguages.has(r) || $(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: r
    }).defaultPrevented) return;
    const s = this.dom.querySelectorAll('[data-ln-translatable-lang="' + r + '"]');
    for (const n of s)
      n.parentNode.removeChild(n);
    this.activeLanguages.delete(r), this._updateDropdown(), this._updateBadges(), k(this.dom, "ln-translations:removed", {
      target: this.dom,
      lang: r
    });
  }, g.prototype.getActiveLanguages = function() {
    return new Set(this.activeLanguages);
  }, g.prototype.hasLanguage = function(r) {
    return this.activeLanguages.has(r);
  }, g.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const r = this.defaultLang, o = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of o)
      s.getAttribute("data-ln-translatable-lang") !== r && s.parentNode.removeChild(s);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, U(t, e, g, "ln-translations", {
    attributes: i
  });
})();
const Nr = "ln-autosave:", Mr = 1e3;
function Fr(t, e) {
  return e ? Nr + (t || "") + ":" + e : null;
}
function Br(t, e = Mr) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", l = "data-ln-autosave-debounce-input", p = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const g = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function r(s) {
    const n = s.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function o(s) {
    const u = s.getAttribute(t) || s.id, h = Fr(window.location.pathname, u);
    if (!h) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", s);
      return;
    }
    this.dom = s, this.key = h;
    let f = null;
    function E() {
      const a = qe(s, { exclude: p });
      try {
        localStorage.setItem(h, JSON.stringify(a));
      } catch {
        return;
      }
      k(s, "ln-autosave:saved", { target: s, data: a });
    }
    function w() {
      let a;
      try {
        a = localStorage.getItem(h);
      } catch {
        return;
      }
      if (!a) return;
      let b;
      try {
        b = JSON.parse(a);
      } catch {
        return;
      }
      if ($(s, "ln-autosave:before-restore", { target: s, data: b }).defaultPrevented) return;
      const c = De(s, b);
      for (let _ = 0; _ < c.length; _++)
        c[_].dispatchEvent(new Event("input", { bubbles: !0 })), c[_].dispatchEvent(new Event("change", { bubbles: !0 }));
      k(s, "ln-autosave:restored", { target: s, data: b });
    }
    function m() {
      try {
        localStorage.removeItem(h);
      } catch {
        return;
      }
      k(s, "ln-autosave:cleared", { target: s });
    }
    this._onFocusout = function(a) {
      const b = a.target;
      r(b) && b.name && !b.matches(p) && E();
    }, this._onChange = function(a) {
      const b = a.target;
      r(b) && b.name && !b.matches(p) && E();
    }, this._onSubmit = function() {
      m();
    }, this._onReset = function() {
      m();
    }, this._onClearClick = function(a) {
      a.target.closest("[" + i + "]") && m();
    }, s.addEventListener("focusout", this._onFocusout), s.addEventListener("change", this._onChange), s.addEventListener("submit", this._onSubmit), s.addEventListener("reset", this._onReset), s.addEventListener("click", this._onClearClick);
    const y = Br(s.getAttribute(l));
    return y > 0 && (this._onInput = function(a) {
      const b = a.target;
      !r(b) || !b.name || b.matches(p) || (f !== null && clearTimeout(f), f = setTimeout(E, y));
    }, s.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return f;
    }, w(), this;
  }
  o.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const s = this._getInputTimer();
        s !== null && clearTimeout(s);
      }
      delete this.dom[e];
    }
  }, U(t, e, o, "ln-autosave", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-autoresize": { type: "marker", description: "Automatically adjusts textarea height to match its scrollable content" }
  };
  function l(p) {
    if (p.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", p.tagName), this;
    this.dom = p;
    const g = this;
    return this._onInput = function() {
      g._resize();
    }, p.addEventListener("input", this._onInput), this._resize(), this;
  }
  l.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, U(t, e, l, "ln-autoresize", {
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
  }, l = {
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
  }, p = {
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
  }, r = {
    "ordered-list": "insertOrderedList",
    "unordered-list": "insertUnorderedList"
  };
  let o = 0;
  function s(a) {
    return !!(p[a] || g[a] || r[a] || a === "link");
  }
  function n(a) {
    this.dom = a;
    const b = this;
    if (this._textarea = a.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", a), this;
    const d = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), d && this._surface.setAttribute("data-placeholder", d);
    const c = this._textarea.id;
    if (c) {
      const S = a.querySelector('label[for="' + c + '"]');
      S && (S.id || (S.id = c + "-label"), this._surface.setAttribute("aria-labelledby", S.id));
    }
    this._surface.id = c ? c + "-surface" : "ln-editor-surface-" + ++o;
    const _ = this._textarea.value.trim();
    _ && (this._surface.innerHTML = _);
    const v = a.querySelector('[role="toolbar"]');
    if (v && v.nextSibling ? a.insertBefore(this._surface, v.nextSibling) : a.appendChild(this._surface), v) {
      v.setAttribute("aria-controls", this._surface.id);
      const S = v.querySelectorAll("[data-ln-editor-action]");
      for (let T = 0; T < S.length; T++) {
        const x = S[T].getAttribute("data-ln-editor-action");
        s(x) && S[T].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      b._syncToTextarea(), k(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      });
    }, this._onMousedownToolbar = function(S) {
      S.target.closest("[data-ln-editor-action]") && S.preventDefault();
    }, this._onClickToolbar = function(S) {
      const T = S.target.closest("[data-ln-editor-action]");
      if (!T) return;
      const x = T.getAttribute("data-ln-editor-action");
      b._execAction(x);
    }, this._onPaste = function(S) {
      f(b, S);
    }, this._onKeydown = function(S) {
      m(b, S);
    }, this._onSelectionChange = function() {
      document.contains(b._surface) && b._updateActiveStates();
    }, this._onFocus = function() {
      k(b.dom, "ln-editor:focus", { target: b.dom });
    }, this._onBlur = function() {
      b._syncToTextarea(), k(b.dom, "ln-editor:blur", { target: b.dom });
    }, this._onTextareaInput = function() {
      b._surface.innerHTML !== b._textarea.value && (b._surface.innerHTML = b._textarea.value, k(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), v && (v.addEventListener("mousedown", this._onMousedownToolbar), v.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(S) {
      const T = S.detail && S.detail.html;
      T !== void 0 && (b._surface.innerHTML = T, b._syncToTextarea(), k(b.dom, "ln-editor:changed", {
        html: b._textarea.value,
        target: b.dom
      }));
    }, a.addEventListener("ln-editor:set-content", this._onSetContent);
    const A = this._textarea.form;
    return A && (this._onFormReset = function() {
      setTimeout(function() {
        b._surface.innerHTML = b._textarea.value, k(a, "ln-editor:changed", {
          html: b._textarea.value,
          target: a
        });
      }, 0);
    }, A.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(a) {
    if (!(!a || $(this.dom, "ln-editor:before-change", {
      action: a,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), p[a])
        document.execCommand(p[a], !1, null);
      else if (g[a]) {
        const d = g[a], c = u(this._surface);
        c && c.toLowerCase() === d ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + d + ">");
      } else r[a] ? document.execCommand(r[a], !1, null) : a === "link" ? y(this) : a === "unlink" ? document.execCommand("unlink", !1, null) : a === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const a = this.dom.querySelector('[role="toolbar"]');
    if (!a) return;
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return;
    const d = b.anchorNode;
    if (!d || !this._surface.contains(d)) return;
    const c = a.querySelectorAll("[data-ln-editor-action]");
    for (let _ = 0; _ < c.length; _++) {
      const v = c[_], A = v.getAttribute("data-ln-editor-action");
      let S = !1;
      if (p[A])
        try {
          S = document.queryCommandState(p[A]);
        } catch {
        }
      else if (g[A]) {
        const T = u(this._surface);
        S = T && T.toLowerCase() === g[A];
      } else if (r[A])
        try {
          S = document.queryCommandState(r[A]);
        } catch {
        }
      else A === "link" && (S = !!h(b.anchorNode, "A", this._surface));
      s(A) && v.setAttribute("aria-pressed", String(S)), S ? v.classList.add("ln-editor-active") : v.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(a) {
    this._surface && (this._surface.innerHTML = a, this._syncToTextarea(), k(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const a = this.dom.querySelector('[role="toolbar"]');
    a && (a.removeEventListener("mousedown", this._onMousedownToolbar), a.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const b = this._textarea ? this._textarea.form : null;
    if (b && this._onFormReset && b.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const d = this.dom.querySelector(".ln-editor__link-popover");
      d && d.remove();
    }
    delete this.dom[e];
  };
  function u(a) {
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return null;
    let d = b.anchorNode;
    if (!d) return null;
    for (; d && d !== a; ) {
      if (d.nodeType === 1) {
        const c = d.tagName;
        if (c === "H2" || c === "H3" || c === "H4" || c === "BLOCKQUOTE" || c === "PRE" || c === "P")
          return c;
      }
      d = d.parentNode;
    }
    return null;
  }
  function h(a, b, d) {
    for (; a && a !== d; ) {
      if (a.nodeType === 1 && a.tagName === b)
        return a;
      a = a.parentNode;
    }
    return null;
  }
  function f(a, b) {
    b.preventDefault();
    let d = "";
    if (b.clipboardData && (d = b.clipboardData.getData("text/html"), !d)) {
      const _ = b.clipboardData.getData("text/plain");
      _ && (d = _.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), d = "<p>" + d + "</p>");
    }
    if (!d) return;
    const c = E(d);
    c && document.execCommand("insertHTML", !1, c);
  }
  function E(a) {
    const b = document.createElement("div");
    return b.innerHTML = a, w(b), b.innerHTML;
  }
  function w(a) {
    const b = Array.from(a.childNodes);
    for (let d = 0; d < b.length; d++) {
      const c = b[d];
      if (c.nodeType !== 3) {
        if (c.nodeType !== 1) {
          a.removeChild(c);
          continue;
        }
        if (l[c.tagName]) {
          const _ = Array.from(c.attributes);
          for (let v = 0; v < _.length; v++) {
            const A = _[v].name;
            if (c.tagName === "A" && A === "href") {
              const S = c.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(S) || c.removeAttribute("href");
            } else
              c.removeAttribute(A);
          }
          c.tagName === "A" && c.setAttribute("rel", "noopener noreferrer"), w(c);
        } else {
          for (; c.firstChild; )
            a.insertBefore(c.firstChild, c);
          a.removeChild(c);
        }
      }
    }
  }
  function m(a, b) {
    if (!(b.ctrlKey || b.metaKey)) return;
    let d = null;
    switch (b.key.toLowerCase()) {
      case "b":
        d = "bold";
        break;
      case "i":
        d = "italic";
        break;
      case "u":
        d = "underline";
        break;
      case "k":
        d = "link";
        break;
    }
    d && (b.preventDefault(), a._execAction(d));
  }
  function y(a) {
    const b = window.getSelection();
    if (!b || b.rangeCount === 0) return;
    const d = h(b.anchorNode, "A", a._surface), c = b.getRangeAt(0).cloneRange();
    a._closeLinkPopover && a._closeLinkPopover();
    const _ = Lt(a.dom, "ln-editor-link-popover", "ln-editor");
    if (!_) return;
    const v = _.firstElementChild;
    if (!v) return;
    const A = v.querySelector('input[type="url"]'), S = v.querySelector('[data-ln-editor-action="confirm-link"]'), T = v.querySelector('[data-ln-editor-action="cancel-link"]');
    d && (A.value = d.getAttribute("href") || "");
    const x = a.dom.querySelector('[role="toolbar"]');
    x ? x.after(v) : a.dom.insertBefore(v, a._surface), A.focus();
    function I() {
      const j = window.getSelection();
      j.removeAllRanges(), j.addRange(c);
    }
    function N() {
      document.removeEventListener("mousedown", H), a._closeLinkPopover = null, v.remove();
    }
    function D() {
      const j = A.value.trim();
      if (N(), I(), a._surface.focus(), j)
        if (d)
          d.setAttribute("href", j), d.setAttribute("rel", "noopener noreferrer"), a._syncToTextarea(), k(a.dom, "ln-editor:changed", {
            html: a._textarea.value,
            target: a.dom
          });
        else {
          document.execCommand("createLink", !1, j);
          const X = window.getSelection();
          if (X && X.anchorNode) {
            const et = h(X.anchorNode, "A", a._surface);
            et && (et.setAttribute("rel", "noopener noreferrer"), a._syncToTextarea());
          }
        }
      else d && document.execCommand("unlink", !1, null);
    }
    function M() {
      N(), I(), a._surface.focus();
    }
    function F() {
      N();
    }
    function H(j) {
      const X = a.dom.contains(j.target) && j.target.closest('[data-ln-editor-action="link"]');
      !v.contains(j.target) && !X && F();
    }
    a._closeLinkPopover = N, S.addEventListener("click", D), T.addEventListener("click", M), A.addEventListener("keydown", function(j) {
      j.key === "Enter" ? (j.preventDefault(), D()) : j.key === "Escape" && (j.preventDefault(), M());
    }), document.addEventListener("mousedown", H);
  }
  U(t, e, n, "ln-editor", {
    attributes: i
  });
})();
(function() {
  const t = "lnFill";
  if (window[t] !== void 0) return;
  const e = { lnFillForm: !0, lnFillStore: !0 };
  function i(p) {
    const g = {}, r = p.dataset;
    for (const o in r) {
      if (!o.startsWith("lnFill") || e[o]) continue;
      const s = o.slice(6);
      s && (g[s.charAt(0).toLowerCase() + s.slice(1)] = r[o]);
    }
    return g;
  }
  function l(p, g) {
    const r = window.CSS && CSS.escape ? CSS.escape(g) : g, o = document.querySelectorAll('[data-ln-fill-id="' + r + '"]');
    if (o.length === 0) return null;
    for (let s = 0; s < o.length; s++) {
      const n = o[s].getAttribute("data-ln-fill-form");
      if (n) {
        const u = document.getElementById(n);
        if (u && p.contains(u)) return o[s];
      }
    }
    return o[0];
  }
  document.addEventListener("click", function(p) {
    if (p.ctrlKey || p.metaKey || p.button === 1) return;
    const g = p.target.closest("[data-ln-fill-form]");
    if (!g) return;
    const r = g.getAttribute("data-ln-fill-form"), o = document.getElementById(r);
    if (!o) return;
    const s = i(g), n = Object.keys(s).length > 0;
    window.lnCore.lnFill(o, n ? s : null);
  }), document.addEventListener("ln-fill:request", function(p) {
    const g = p.detail;
    if (!g) return;
    const r = p.target, o = g.id;
    if (o == null) {
      window.lnCore.lnFill(r, null);
      return;
    }
    const s = l(r, o);
    if (!s) return;
    const n = i(s);
    window.lnCore.lnFill(r, n);
  }), window[t] = !0;
})();
function Pr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", l = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${l}+`, "g"), i).replace(new RegExp(`^${l}+|${l}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: K, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, l = Y(i);
  function p(g) {
    if (g.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", g.tagName), this;
    const r = g.form;
    if (!r)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", g), this;
    Q(this, g, l);
    const o = r.elements[this.sourceName];
    if (!o)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', g), this;
    if (typeof o.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', g), this;
    this.dom = g, this.source = o, this._pristine = g.value === "", this._mirroring = !1;
    const s = this;
    return this._onSource = function() {
      s._pristine && s._mirror();
    }, this._onSlug = function() {
      s._mirroring || (s._pristine = s.dom.value === "");
    }, o.addEventListener("input", this._onSource), g.addEventListener("input", this._onSlug), this._pristine && o.value && o.value.trim() !== "" && this._mirror(), this;
  }
  p.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Pr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, U(t, e, p, "ln-slug", {
    attributes: i
  });
})();
function Ur(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), l = t.getTime(), p = Math.floor((l - i) / 1e3), g = Math.abs(p);
  return g < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : g < 60 ? { value: p, unit: "second", isOlderThanMonth: !1 } : g < 3600 ? { value: Math.round(p / 60), unit: "minute", isOlderThanMonth: !1 } : g < 86400 ? { value: Math.round(p / 3600), unit: "hour", isOlderThanMonth: !1 } : g < 604800 ? { value: Math.round(p / 86400), unit: "day", isOlderThanMonth: !1 } : g < 2592e3 ? { value: Math.round(p / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(p / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function te(t, e, i = /* @__PURE__ */ new Date()) {
  switch (t) {
    case "full":
      return { dateStyle: "long", timeStyle: "short" };
    case "date":
      return { dateStyle: "medium" };
    case "time":
      return { timeStyle: "short" };
    case "short":
    default: {
      const l = { month: "short", day: "numeric" };
      return e && e.getFullYear() !== i.getFullYear() && (l.year = "numeric"), l;
    }
  }
}
(function() {
  const t = "data-ln-time", e = "lnTime";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: c, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: c, description: "BCP 47 language tag override for time formatting" }
  }, l = {}, p = {};
  function g(v) {
    return v.getAttribute("data-ln-time-locale") || J(v);
  }
  function r(v, A) {
    const S = (v || "") + "|" + JSON.stringify(A);
    return l[S] || (l[S] = new Intl.DateTimeFormat(v, A)), l[S];
  }
  function o(v) {
    const A = v || "";
    return p[A] || (p[A] = new Intl.RelativeTimeFormat(v, { numeric: "auto", style: "narrow" })), p[A];
  }
  const s = /* @__PURE__ */ new Set();
  let n = null;
  function u() {
    n || (n = setInterval(f, 6e4));
  }
  function h() {
    n && (clearInterval(n), n = null);
  }
  function f() {
    for (const v of s) {
      if (!document.body.contains(v.dom)) {
        s.delete(v);
        continue;
      }
      b(v);
    }
    s.size === 0 && h();
  }
  function E(v, A) {
    const S = Rt(A), T = (A || "").toLowerCase().split("-")[0], x = r(A, te("full", v)), I = x.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && I !== T && S.monthsLong) {
      const N = S.monthsLong[v.getMonth()], D = v.getDate(), M = v.getFullYear(), F = String(v.getHours()).padStart(2, "0"), H = String(v.getMinutes()).padStart(2, "0");
      return `${D} ${N} ${M}, ${F}:${H}`;
    }
    return x.format(v);
  }
  function w(v, A) {
    const S = te("short", v), T = Rt(A), x = (A || "").toLowerCase().split("-")[0], I = r(A, S), N = I.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (T && N !== x && T.monthsShort) {
      const D = T.monthsShort[v.getMonth()], M = v.getDate(), F = S.year ? " " + v.getFullYear() : "";
      return `${M} ${D}${F}`;
    }
    return I.format(v);
  }
  function m(v, A) {
    return r(A, te("date", v)).format(v);
  }
  function y(v, A) {
    return r(A, te("time", v)).format(v);
  }
  function a(v, A) {
    const S = Ur(v);
    return S.isOlderThanMonth ? w(v, A) : o(A).format(S.value, S.unit);
  }
  function b(v) {
    const A = v.dom.getAttribute("datetime");
    if (!A) return;
    const S = it(A);
    if (!S) return;
    const T = v.dom.getAttribute(t) || "short", x = g(v.dom);
    let I;
    switch (T) {
      case "relative":
        I = a(S, x);
        break;
      case "full":
        I = E(S, x);
        break;
      case "date":
        I = m(S, x);
        break;
      case "time":
        I = y(S, x);
        break;
      default:
        I = w(S, x);
        break;
    }
    v.dom.textContent = I, T !== "full" && (v.dom.title = E(S, x));
  }
  function d(v) {
    this.dom = v;
    const A = this;
    return this._onLocaleChange = function() {
      b(A);
    }, ae(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), b(this), v.getAttribute(t) === "relative" && (s.add(this), u()), this;
  }
  d.prototype.render = function() {
    b(this);
  }, d.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), s.delete(this), s.size === 0 && h(), delete this.dom[e];
  };
  function c(v) {
    const A = v[e];
    if (!A) return;
    v.getAttribute(t) === "relative" ? (s.add(A), u()) : (s.delete(A), s.size === 0 && h()), b(A);
  }
  function _(v) {
    v.nodeType === 1 && v.hasAttribute && v.hasAttribute(t) && v[e] && b(v[e]);
  }
  U(t, e, d, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: c,
    onInit: _
  });
})();
function Hr(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, l = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const p = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, g = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let o = 0, s = 0, n = 0, u = !1, h = null;
  function f(m, y) {
    g.delete(m), g.set(m, y);
  }
  function E() {
    if (g.size <= e) return [];
    const m = [];
    for (; g.size > e; ) {
      const a = g.keys().next().value;
      m.push(g.get(a)), g.delete(a);
    }
    const y = new Set(g.values());
    return m.filter((a) => !y.has(a));
  }
  function w(m, y) {
    r.add(m), clearTimeout(h), h = setTimeout(() => p(m, i, y), l);
  }
  return {
    get logicalTotal() {
      return o;
    },
    set logicalTotal(m) {
      o = m;
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
      return g.size;
    },
    // Whether a server ordering exists for the current query at all — false
    // from reset() until the first ingest(). Distinct from a missing page.
    get hasLoaded() {
      return u;
    },
    getId: (m) => {
      if (!g.has(m)) return;
      const y = g.get(m);
      return f(m, y), y;
    },
    ensure: (m, y, a) => {
      if (!u && !r.has(0)) return w(0, a);
      if (o <= 0) return;
      const b = Math.max(0, m), d = Math.min(o, y);
      for (let c = b; c < d; c++)
        if (!g.has(c)) {
          const _ = Math.floor(c / i) * i;
          if (!r.has(_)) return w(_, a);
        }
    },
    ingest: (m, y, a, b, d) => {
      if (d != null && d !== n) return [];
      u = !0, a != null && (s = a), b != null && (o = b);
      for (let c = 0; c < y.length; c++)
        f(m + c, y[c]);
      return r.delete(m), E();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      u = !1, g.clear(), r.clear(), clearTimeout(h);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (m = {}) => {
      let y = [];
      return m.windowSize > 0 && m.windowSize !== e && (e = m.windowSize, y = E()), m.pageSize > 0 && (i = m.pageSize), m.fetchDebounce >= 0 && (l = m.fetchDebounce), y;
    }
  };
}
function zr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: l, direction: p } = e, g = p === "desc", r = t.map((s) => s ? s[l] : void 0), o = Ne(r);
  return [...t].sort((s, n) => {
    const u = s ? s[l] : void 0, h = n ? n[l] : void 0, f = Me(u, h, o, i);
    return g ? -f : f;
  });
}
function pi(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((l) => Array.isArray(e[l]) && e[l].length > 0);
  return i.length ? t.filter((l) => l ? i.every((p) => Be(l[p], e[p])) : !1) : t;
}
function Kr(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const l = Hn(e);
  return l.length ? t.filter((p) => p ? l.every(
    (g) => i.some((r) => {
      const o = p[r];
      return o != null && zn(String(o), [g]);
    })
  ) : !1) : t;
}
function jr(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const l = t.map((g) => g && g[e] != null ? parseFloat(g[e]) : NaN).filter((g) => Number.isFinite(g)), p = l.reduce((g, r) => g + r, 0);
  return i === "sum" ? p : i === "avg" && l.length ? p / l.length : 0;
}
function Wr(t, e = {}, i = [], l) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const p = t.length;
  let g = t;
  e.filters && (g = pi(g, e.filters)), e.search && (g = Kr(g, e.search, i));
  const r = g.length;
  if (e.sort && (g = zr(g, e.sort, l)), e.offset || e.limit) {
    const o = e.offset || 0, s = e.limit || g.length;
    g = g.slice(o, o + s);
  }
  return { records: g, total: p, filtered: r };
}
function Vr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const l = { ...i };
    for (const [p, g] of Object.entries(e))
      if (typeof g == "function")
        try {
          l[p] = g(i);
        } catch {
          l[p] = void 0;
        }
    return l;
  });
}
function Gr(t, e, i, l = "_meta") {
  if (!Array.isArray(t) || !t.includes(l)) return !0;
  for (const p of Object.keys(e || {})) {
    if (!t.includes(p)) return !0;
    const g = e[p] && e[p].indexes || [], r = i && i[p] || [];
    if (g.some((o) => !r.includes(o))) return !0;
  }
  return !1;
}
function $r(t) {
  return { ok: !1, error: t && t.message ? t.message : String(t) };
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(C, L, q) {
    const R = C.getAttribute(L);
    if (R === "never" || R === "-1") return -1;
    const O = parseInt(R, 10);
    return isNaN(O) ? q : O;
  }
  const l = {
    "data-ln-data-store": { type: "marker", effect: je, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: je, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: Re, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: xi, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: Ii, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, p = Y(l), g = "ln_app_cache", r = "_meta", o = "1.0";
  let s = null, n = null;
  const u = {};
  function h(C) {
    C && C.name === "QuotaExceededError" && k(document, "ln-data-store:quota-exceeded", { error: C });
  }
  function f() {
    const C = {};
    for (const L of document.querySelectorAll(`[${t}]`)) {
      const q = L.id;
      if (q) {
        const R = L.getAttribute("data-ln-data-store-indexes") || "";
        C[q] = {
          indexes: R.split(",").map((O) => O.trim()).filter(Boolean)
        };
      }
    }
    return C;
  }
  function E() {
    return n || (n = new Promise((C) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB is not available in this environment"), C(null);
      const L = f(), q = Object.keys(L), R = indexedDB.open(g);
      R.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed"), C(null);
      }, R.onsuccess = (O) => {
        const B = O.target.result, P = Array.from(B.objectStoreNames), z = q.filter((ct) => P.includes(ct));
        let G = {};
        if (z.length > 0) {
          const ct = B.transaction(z, "readonly");
          for (const dt of z)
            G[dt] = Array.from(ct.objectStore(dt).indexNames);
        }
        if (!Gr(P, L, G, r))
          return w(B), s = B, C(B);
        const qt = B.version;
        B.close();
        const yt = indexedDB.open(g, qt + 1);
        let ht = !1, pt = null;
        yt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection"), k(document, "ln-data-store:blocked", { db: g }), pt || (pt = setTimeout(() => {
            ht || (console.warn("[ln-data-store] Database upgrade timed out while blocked"), ht = !0, n = null, C(null));
          }, 5e3));
        }, yt.onerror = () => {
          ht || (pt && clearTimeout(pt), ht = !0, n = null, console.warn("[ln-data-store] Database upgrade failed"), C(null));
        }, yt.onupgradeneeded = (ct) => {
          const dt = ct.target.result, qi = ct.target.transaction;
          dt.objectStoreNames.contains(r) || dt.createObjectStore(r, { keyPath: "key" });
          for (const Ut of q)
            if (dt.objectStoreNames.contains(Ut)) {
              const Jt = qi.objectStore(Ut);
              for (const Nt of L[Ut].indexes)
                Jt.indexNames.contains(Nt) || Jt.createIndex(Nt, Nt, { unique: !1 });
            } else {
              const Jt = dt.createObjectStore(Ut, { keyPath: "id" });
              for (const Nt of L[Ut].indexes)
                Jt.createIndex(Nt, Nt, { unique: !1 });
            }
        }, yt.onsuccess = (ct) => {
          if (ht) {
            ct.target.result && ct.target.result.close();
            return;
          }
          pt && clearTimeout(pt), ht = !0;
          const dt = ct.target.result;
          w(dt), s = dt, C(dt);
        };
      };
    }), n);
  }
  function w(C) {
    C.onversionchange = () => {
      C.close(), s = null, n = null;
    };
  }
  function m() {
    return s ? Promise.resolve(s) : (n = null, E());
  }
  async function y(C) {
    if (!Tt() || !C) return C;
    const L = { ...C }, q = L.id, R = await Qi(L);
    return !R || !R.encrypted ? C : {
      ...R,
      id: q
    };
  }
  async function a(C) {
    return !C || !C.encrypted || !Tt() ? C : Yi(C, { silent: !0 });
  }
  const b = (C, L) => m().then((q) => q ? q.transaction(C, L).objectStore(C) : null);
  function d(C) {
    return new Promise((L, q) => {
      C.onsuccess = () => L(C.result), C.onerror = () => {
        h(C.error), q(C.error);
      };
    });
  }
  const c = (C) => b(C, "readonly").then((L) => L ? d(L.getAll()) : []).then((L) => Tt() ? Promise.all(L.map((q) => a(q))) : L), _ = (C, L) => b(C, "readonly").then((q) => q ? d(q.get(L)).then((R) => R !== void 0 ? R : typeof L == "string" && L.trim() !== "" && !isNaN(Number(L)) ? d(q.get(Number(L))) : typeof L == "number" ? d(q.get(String(L))) : null) : null).then((q) => q ? a(q) : null), v = (C, L) => m().then((q) => {
    if (!q) return [];
    const O = q.transaction(C, "readonly").objectStore(C), B = L.map((P) => d(O.get(P)).then((z) => z !== void 0 ? z : typeof P == "string" && P.trim() !== "" && !isNaN(Number(P)) ? d(O.get(Number(P))) : typeof P == "number" ? d(O.get(String(P))) : null));
    return Promise.all(B).then((P) => Tt() ? Promise.all(P.map((z) => z ? a(z) : null)) : P);
  }), A = (C, L) => (Tt() ? y(L) : Promise.resolve(L)).then((R) => b(C, "readwrite").then((O) => O ? d(O.put(R)) : null)), S = (C, L) => b(C, "readwrite").then((q) => q ? d(q.delete(L)).then(() => {
    if (typeof L == "string" && L.trim() !== "" && !isNaN(Number(L)))
      return d(q.delete(Number(L)));
    if (typeof L == "number")
      return d(q.delete(String(L)));
  }) : null), T = (C) => b(C, "readwrite").then((L) => L ? d(L.clear()) : null), x = (C) => b(C, "readonly").then((L) => L ? d(L.count()) : 0), I = (C) => b(r, "readonly").then((L) => L ? d(L.get(C)) : null), N = (C, L) => b(r, "readwrite").then((q) => {
    if (q)
      return L.key = C, d(q.put(L));
  });
  function D(C) {
    return this.dom = C, this._name = C.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", C), Q(this, C, p), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, C.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Hr({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (L, q, R) => {
        k(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: L,
          limit: q,
          query: R,
          queryGen: this._windowIndex.queryGen
        });
      }
    }) : this._windowIndex = null, this.windowed = this._windowIndex !== null, this.totalCount = 0, this.presenters = null, this._mutationChain = Promise.resolve(), u[this._name] = this, M(this), this.ready = nt(this), this;
  }
  function M(C) {
    C._handlers = {
      create: (L) => F(C, "create", L.detail, () => j(C, L.detail)),
      update: (L) => F(C, "update", L.detail, () => X(C, L.detail)),
      delete: (L) => F(C, "delete", L.detail, () => et(C, L.detail)),
      "bulk-delete": (L) => F(C, "bulk-delete", L.detail, () => _t(C, L.detail)),
      "sync-failed": (L) => {
        C.isSyncing = !1, k(C.dom, "ln-data-store:sync-error", {
          store: C._name,
          error: L.detail && L.detail.error,
          status: L.detail && L.detail.status
        });
      }
    };
    for (const [L, q] of Object.entries(C._handlers))
      C.dom.addEventListener(`ln-data-store:request-${L}`, q);
    C._queryHandlers = {
      "ln-search:change": (L) => {
        L.preventDefault();
        const q = L.detail && L.detail.term != null ? L.detail.term : "";
        q !== C.query.search && (C.query.search = q, ce(C));
      },
      "ln-filter:change": (L) => {
        L.preventDefault();
        const q = L.detail && L.detail.key;
        if (!q) return;
        const R = (L.detail.values || []).slice(), O = C.query.filters[q];
        (O ? O.length === R.length && O.every((P, z) => P === R[z]) : !R.length) || (R.length ? C.query.filters[q] = R : delete C.query.filters[q], ce(C));
      },
      "ln-sort:change": (L) => {
        L.preventDefault();
        const q = L.detail && L.detail.field, R = L.detail && L.detail.direction, O = R && R !== "none" ? { field: q, direction: R } : null, B = C.query.sort;
        !B && !O || B && O && B.field === O.field && B.direction === O.direction || (C.query.sort = O, ce(C));
      }
    };
    for (const [L, q] of Object.entries(C._queryHandlers))
      C.dom.addEventListener(L, q);
  }
  function F(C, L, q, R) {
    const O = q && q.requestId;
    return C._mutationChain = C._mutationChain.then(() => C.ready).then(() => {
      if (C.initializationError) throw C.initializationError;
      return R();
    }).catch((B) => at(C, L, O, B)), C._mutationChain;
  }
  function H(C, L = 0) {
    return x(C._name).then((q) => {
      if (C._windowIndex || C.windowed) {
        const R = C.totalCount != null ? C.totalCount : q;
        C.totalCount = Math.max(0, R + L);
      } else
        C.totalCount = q;
      return C.hasCache = !0, C.isLoaded = !0, C.canServe = !0, N(C._name, {
        schema_version: o,
        last_synced_at: C.lastSyncedAt,
        has_cache: !0,
        record_count: C.totalCount
      });
    });
  }
  function j(C, { tempId: L, data: q = {}, requestId: R } = {}) {
    const O = { ...q, id: L };
    return A(C._name, O).then(() => H(C, 1)).then(() => {
      k(C.dom, "ln-data-store:created", { store: C._name, record: O, tempId: L, requestId: R });
    });
  }
  function X(C, { id: L, data: q = {}, requestId: R } = {}) {
    return _(C._name, L).then((O) => {
      if (!O) throw new Error(`Record not found: ${L}`);
      const B = O.id, P = { ...O, ...q, id: B }, z = q.id, G = z !== void 0 && z !== B;
      return (G ? bi(C._name, B, { ...P, id: z }) : A(C._name, P)).then(() => H(C, 0)).then(() => {
        k(C.dom, "ln-data-store:updated", { store: C._name, record: G ? { ...P, id: z } : P, previous: O, requestId: R });
      });
    });
  }
  function et(C, { id: L, requestId: q } = {}) {
    return _(C._name, L).then((R) => {
      if (!R) {
        k(C.dom, "ln-data-store:deleted", { store: C._name, id: L, requestId: q, missing: !0 });
        return;
      }
      const O = R.id;
      return S(C._name, O).then(() => H(C, -1)).then(() => {
        k(C.dom, "ln-data-store:deleted", { store: C._name, id: O, requestId: q });
      });
    });
  }
  function _t(C, { ids: L = [], requestId: q } = {}) {
    return L.length ? Promise.all(L.map((R) => _(C._name, R))).then((R) => {
      const O = R.filter(Boolean).map((B) => B.id);
      return bt(C._name, O).then(() => H(C, -O.length)).then(() => {
        k(C.dom, "ln-data-store:deleted", { store: C._name, ids: O, requestId: q });
      });
    }) : (k(C.dom, "ln-data-store:deleted", { store: C._name, ids: [], requestId: q }), Promise.resolve());
  }
  function at(C, L, q, R) {
    console.error("[ln-data-store] " + L + " failed:", R), k(C.dom, "ln-data-store:mutation-error", {
      store: C._name,
      action: L,
      requestId: q,
      error: R
    });
  }
  function nt(C) {
    return E().then((L) => {
      if (!L) throw new Error("IndexedDB is unavailable");
      return I(C._name);
    }).then((L) => {
      if (C.initializationError = null, L && L.schema_version === o)
        C.lastSyncedAt = L.last_synced_at || null, C.totalCount = L.record_count || 0, C.hasCache = L.has_cache === !0 || C.totalCount > 0, C.hasCache && (C.isLoaded = !0, C.canServe = !0, k(C.dom, "ln-data-store:ready", { store: C._name, count: C.totalCount, source: "cache" })), C.isInitialized = !0, k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: C.hasCache, lastSyncedAt: C.lastSyncedAt, count: C.totalCount });
      else {
        if (L && L.schema_version !== o)
          return T(C._name).then(() => N(C._name, { schema_version: o, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            C.isInitialized = !0, C.hasCache = !1, k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        C.isInitialized = !0, C.hasCache = !1, k(C.dom, "ln-data-store:initialized", { store: C._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((L) => (C.isInitialized = !0, C.isLoaded = !1, C.canServe = !1, C.hasCache = !1, C.isSyncing = !1, C.initializationError = L, k(C.dom, "ln-data-store:initialization-error", { store: C._name, error: L }), { ok: !1, error: L }));
  }
  function V(C) {
    C.isSyncing = !0, k(C.dom, "ln-data-store:request-remote-sync", { since: C.lastSyncedAt });
  }
  function W(C, L) {
    return m().then((q) => q ? (Tt() ? Promise.all(L.map((O) => y(O))) : Promise.resolve(L)).then((O) => new Promise((B, P) => {
      const z = q.transaction(C, "readwrite"), G = z.objectStore(C);
      O.forEach((tt) => G.put(tt)), z.oncomplete = () => B(), z.onerror = () => {
        h(z.error), P(z.error);
      };
    })) : void 0);
  }
  function bt(C, L) {
    return m().then((q) => {
      if (q)
        return new Promise((R, O) => {
          const B = q.transaction(C, "readwrite"), P = B.objectStore(C);
          L.forEach((z) => {
            P.delete(z), typeof z == "string" && z.trim() !== "" && !isNaN(Number(z)) ? P.delete(Number(z)) : typeof z == "number" && P.delete(String(z));
          }), B.oncomplete = () => R(), B.onerror = () => O(B.error);
        });
    });
  }
  function bi(C, L, q) {
    return (Tt() ? y(q) : Promise.resolve(q)).then((O) => m().then((B) => {
      if (B)
        return new Promise((P, z) => {
          const G = B.transaction(C, "readwrite"), tt = G.objectStore(C);
          tt.put(O), tt.delete(L), G.oncomplete = () => P(), G.onerror = () => {
            h(G.error), z(G.error);
          };
        });
    }));
  }
  const yi = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function vi(C) {
    return C ? Object.keys(C).filter((L) => Array.isArray(C[L]) && C[L].length > 0) : [];
  }
  function wi(C, L, q) {
    return L.every((R) => q[R].map(String).includes(String(C[R])));
  }
  function Ei(C) {
    return String(C || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function Ai(C, L, q) {
    return L.every(
      (R) => q.some((O) => {
        const B = C[O];
        return B != null && String(B).toLowerCase().includes(R);
      })
    );
  }
  function Si(C, L, q) {
    return jr(C, L, q);
  }
  function Pt(C, L) {
    return Vr(L, C.presenters && C.presenters.computed);
  }
  function Ci(C) {
    return !C.sort && !Tt();
  }
  function Ti(C, L, q) {
    const R = vi(L.filters), O = L.search ? Ei(L.search) : [], B = C._searchFields, P = O.length > 0 && B && B.length > 0;
    return b(C._name, "readonly").then((z) => z ? new Promise((G, tt) => {
      const qt = [], yt = z.openCursor();
      yt.onsuccess = () => {
        const ht = yt.result;
        if (!ht || qt.length >= q) {
          G(qt);
          return;
        }
        const pt = ht.value;
        (!R.length || wi(pt, R, L.filters)) && (!P || Ai(pt, O, B)) && qt.push(pt), ht.continue();
      }, yt.onerror = () => tt(yt.error);
    }) : []);
  }
  function ze(C, L, q) {
    return Wr(L, q, C._searchFields, yi);
  }
  function Ke(C, L, q) {
    const R = [];
    for (let B = L; B < L + q; B++) {
      const P = C._windowIndex.getId(B);
      R.push(P);
    }
    const O = Array.from(new Set(R.filter((B) => B !== void 0)));
    return v(C._name, O).then((B) => {
      const P = /* @__PURE__ */ new Map();
      for (let G = 0; G < B.length; G++) {
        const tt = B[G];
        tt && P.set(String(tt.id), tt);
      }
      const z = [];
      for (let G = 0; G < R.length; G++) {
        const tt = R[G];
        if (tt === void 0)
          z.push(null);
        else {
          const qt = P.get(String(tt));
          z.push(qt || null);
        }
      }
      return {
        data: Pt(C, z),
        total: C._windowIndex.grandTotal,
        filtered: C._windowIndex.logicalTotal,
        offset: L,
        queryGen: C._windowIndex.queryGen
      };
    });
  }
  D.prototype.getAll = function(C = {}) {
    const L = this;
    if (L._windowIndex) {
      const q = C.offset || 0, R = C.limit || 200;
      if (L._windowIndex.ensure(q, q + R, C), !L._windowIndex.hasLoaded && !L.noLocalQuery) {
        const O = q + R, B = (P) => P.length ? {
          data: Pt(L, P),
          offset: q,
          queryGen: L._windowIndex.queryGen,
          provisional: !0
        } : Ke(L, q, R);
        return Ci(C) ? Ti(L, C, O).then((P) => B(P.slice(q, O))) : c(L._name).then((P) => B(ze(L, P, C).records));
      }
      return Ke(L, q, R);
    }
    return c(L._name).then((q) => {
      const R = ze(L, q, C);
      return {
        data: Pt(L, R.records),
        total: R.total,
        filtered: R.filtered
      };
    });
  }, D.prototype.getById = function(C) {
    return _(this._name, C).then((L) => L ? Pt(this, [L])[0] : null);
  }, D.prototype.count = function(C) {
    return C && Object.keys(C).length > 0 ? c(this._name).then((q) => pi(q, C).length) : this.windowed && this.totalCount != null ? Promise.resolve(this.totalCount) : x(this._name);
  }, D.prototype.aggregate = function(C, L) {
    return c(this._name).then((q) => Si(q, C, L));
  }, D.prototype.setPresenters = function(C) {
    this.presenters = C;
  }, D.prototype.applySync = function(C, L, q, R) {
    R = R || {};
    const O = this;
    if (O._windowIndex && R.queryGen != null && R.queryGen !== O._windowIndex.queryGen)
      return Promise.resolve({ ok: !0, stale: !0 });
    let B = m().then((P) => {
      if (!P) throw new Error("IndexedDB unavailable");
    });
    return C.length > 0 && (B = B.then(() => W(O._name, C))), L.length > 0 && (B = B.then(() => bt(O._name, L))), B.then(() => {
      if (O._windowIndex && (R.offset != null || R.total != null)) {
        const P = R.offset != null ? R.offset : 0, z = C.map((tt) => tt.id), G = O._windowIndex.ingest(P, z, R.total, R.filtered, R.queryGen);
        if (G && G.length) return bt(O._name, G);
      }
    }).then(() => x(O._name)).then((P) => (O.totalCount = R.total !== void 0 ? R.total : P, O.hasCache = !0, N(O._name, {
      schema_version: o,
      last_synced_at: q,
      has_cache: !0,
      record_count: O.totalCount
    }))).then(() => {
      const P = !O.isLoaded;
      return O.isLoaded = !0, O.canServe = !0, O.isSyncing = !1, O.lastSyncedAt = q, P ? (k(O.dom, "ln-data-store:loaded", { store: O._name, count: O.totalCount, meta: R }), k(O.dom, "ln-data-store:ready", { store: O._name, count: O.totalCount, source: "server", meta: R })) : k(O.dom, "ln-data-store:synced", {
        store: O._name,
        added: C.length,
        deleted: L.length,
        changed: !0,
        meta: R
      }), { ok: !0 };
    }).catch((P) => {
      O.isSyncing = !1;
      const z = P && P.message ? P.message : String(P);
      return console.error("[ln-data-store] applySync failed:", P), k(O.dom, "ln-data-store:sync-error", {
        store: O._name,
        error: z
      }), $r(P);
    });
  }, D.prototype.applyQuery = function(C, L) {
    L = L || {};
    const q = this;
    let R = Promise.resolve();
    return C.length > 0 && (R = R.then(() => W(q._name, C))), R.then(() => x(q._name)).then((O) => (q.totalCount = L.total !== void 0 ? L.total : O, C.length > 0 && (q.canServe = !0), Pt(q, C))).catch((O) => (console.error("[ln-data-store] applyQuery failed:", O), []));
  }, D.prototype.forceSync = function() {
    this.isSyncing || V(this);
  }, D.prototype.fullReload = function() {
    const C = this;
    return T(C._name).then(() => N(C._name, {
      schema_version: o,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      C.isLoaded = !1, C.hasCache = !1, C.lastSyncedAt = null, C.totalCount = 0, V(C);
    });
  }, D.prototype.destroy = function() {
    if (this._windowIndex && (this._windowIndex.clear(), this._windowIndex = null, this.windowed = !1), this._handlers) {
      for (const [C, L] of Object.entries(this._handlers))
        this.dom.removeEventListener(`ln-data-store:request-${C}`, L);
      this._handlers = null;
    }
    if (this._queryHandlers) {
      for (const [C, L] of Object.entries(this._queryHandlers))
        this.dom.removeEventListener(C, L);
      this._queryHandlers = null;
    }
    delete u[this._name], delete this.dom[e];
  };
  function ki() {
    return m().then((C) => {
      if (!C) return;
      const L = Array.from(C.objectStoreNames);
      return new Promise((q, R) => {
        const O = C.transaction(L, "readwrite");
        L.forEach((B) => O.objectStore(B).clear()), O.oncomplete = () => q(), O.onerror = () => R(O.error);
      });
    }).then(() => {
      Object.values(u).forEach((C) => {
        C.isLoaded = !1, C.canServe = !1, C.isInitialized = !1, C.initializationError = null, C.hasCache = !1, C.isSyncing = !1, C.lastSyncedAt = null, C.totalCount = 0;
      });
    });
  }
  function ce(C) {
    C._windowIndex && C._windowIndex.reset(), k(C.dom, "ln-data-store:query-changed", {
      store: C._name,
      query: {
        filters: Object.assign({}, C.query.filters),
        search: C.query.search,
        sort: C.query.sort ? Object.assign({}, C.query.sort) : null
      }
    });
  }
  const Li = "data-ln-data-store-frozen";
  function je(C, L) {
    C.setAttribute(Li, L);
  }
  function xi(C) {
    const L = C[e];
    if (!L._windowIndex) return;
    const q = L._windowIndex.configure({ windowSize: L._windowSize });
    q.length && bt(L._name, q).catch((R) => {
      console.error("[ln-data-store] window shrink eviction failed:", R);
    });
  }
  function Ii(C) {
    const L = C[e];
    L._windowIndex && L._windowIndex.configure({ pageSize: L._windowPageSize });
  }
  U(t, e, D, "ln-data-store", {
    attributes: l
  }), window[e].clearAll = ki, window[e].init = window[e], window[e].setStorageKey = Qe, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Qe);
})();
const Qr = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function Dt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const l = String(e);
    return i === 0 ? l.replace(/\/+$/, "") : l.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function Yr(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, Qr);
  if (e && typeof e == "object")
    for (const p in e)
      e[p] !== void 0 && e[p] !== null && e[p] !== "" && (i[p] = e[p]);
  const l = new URLSearchParams();
  return t.search && l.append(i.search, t.search), t.offset != null && l.append(i.offset, t.offset), t.limit != null && l.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (l.append(i.sortField, t.sort.field), l.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((p) => {
    const g = t.filters[p];
    Array.isArray(g) && g.length > 0 && l.append(p, g.join(","));
  }), l.toString();
}
function Xr(t, e, i) {
  let l = Dt(t, e);
  return i && (l += (l.indexOf("?") !== -1 ? "&" : "?") + i), l;
}
function dn(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function l(n) {
    const u = n[e];
    u && u.refreshConfig();
  }
  const p = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: K, type: "string", fallback: "", effect: l, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: K, type: "string", fallback: "", effect: l, description: "Resource path appended to base URL" },
    "data-ln-api-headers": { prop: "rawHeaders", read: K, type: "json", fallback: null, effect: l, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: l, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: l, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: l, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: l, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: l, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: l, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, g = Y(p);
  function r(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((u) => {
      const h = new Error("HTTP " + n.status + ": " + n.statusText);
      throw h.status = n.status, h.data = u, h;
    });
  }
  function o(n) {
    return this.dom = n, Q(this, n, g), n[e] = this, n[i] = this, this.namespace = "ln-api-connector", this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, s(this), this;
  }
  o.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = vn(this.rawHeaders);
    const u = {}, h = n.getAttribute("data-ln-api-param-offset");
    h && (u.offset = h);
    const f = n.getAttribute("data-ln-api-param-limit");
    f && (u.limit = f);
    const E = n.getAttribute("data-ln-api-param-search");
    E && (u.search = E);
    const w = n.getAttribute("data-ln-api-param-sort-field");
    w && (u.sortField = w);
    const m = n.getAttribute("data-ln-api-param-sort-dir");
    m && (u.sortDir = m), this.paramKeys = u;
    const y = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = y !== null ? +y : 300, k(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, o.prototype._reqHeaders = function(n) {
    const u = Object.assign({}, this.headers);
    return !u.Accept && !u.accept && (u.Accept = "application/json"), !u["Content-Type"] && !u["content-type"] && (u["Content-Type"] = "application/json"), n && (u["X-Idempotency-Key"] = n), u;
  }, o.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, o.prototype.fetchDelta = function(n, u) {
    const h = this;
    let f = Dt(h.baseUrl, h.path);
    n != null && n !== "" && (f += (f.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const E = u || "sync";
    h._inflight.has(E) && h._inflight.get(E).abort();
    const w = new AbortController();
    return h._inflight.set(E, w), window.fetch(f, {
      method: "GET",
      headers: h._reqHeaders(),
      credentials: h.credentials,
      signal: w.signal
    }).then(r).finally(function() {
      h._inflight.get(E) === w && h._inflight.delete(E);
    });
  }, o.prototype.query = function(n, u) {
    const h = this, f = Yr(n, h.paramKeys), E = Xr(h.baseUrl, h.path, f), w = u || "query";
    h._inflight.has(w) && h._inflight.get(w).abort();
    const m = new AbortController();
    return h._inflight.set(w, m), window.fetch(E, {
      method: "GET",
      headers: h._reqHeaders(),
      credentials: h.credentials,
      signal: m.signal
    }).then(r).finally(function() {
      h._inflight.get(w) === m && h._inflight.delete(w);
    });
  }, o.prototype.create = function(n, u, h) {
    const f = this;
    return window.fetch(Dt(f.baseUrl, u || f.path), {
      method: "POST",
      headers: f._reqHeaders(h),
      credentials: f.credentials,
      body: JSON.stringify(n)
    }).then(r);
  }, o.prototype.update = function(n, u, h, f, E) {
    const w = this;
    h != null && (u = Object.assign({}, u, { expected_version: h }));
    const m = f ? Dt(w.baseUrl, f) : Dt(w.baseUrl, w.path, n);
    return window.fetch(m, {
      method: "PUT",
      headers: w._reqHeaders(E),
      credentials: w.credentials,
      body: JSON.stringify(u)
    }).then(r);
  }, o.prototype.delete = function(n, u, h) {
    const f = this;
    return window.fetch(Dt(f.baseUrl, u || f.path, n), {
      method: "DELETE",
      headers: f._reqHeaders(h),
      credentials: f.credentials
    }).then(r);
  }, o.prototype.bulkDelete = function(n, u, h) {
    const f = this;
    return window.fetch(Dt(f.baseUrl, u || f.path, "bulk-delete"), {
      method: "DELETE",
      headers: f._reqHeaders(h),
      credentials: f.credentials,
      body: JSON.stringify({ ids: n })
    }).then(r);
  };
  function s(n) {
    n._handlers = {
      sync: function(u) {
        const h = u.detail || {}, f = h.meta && h.meta.targetEl ? h.meta.targetEl : null;
        n.fetchDelta(h.since, f).then(function(E) {
          k(n.dom, "ln-api-connector:fetched", { data: E, since: h.since, meta: h.meta || null });
        }).catch(function(E) {
          E && E.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: E.message,
            status: E.status || 0,
            data: E.data || null,
            since: h.since,
            meta: h.meta || null
          });
        });
      },
      query: function(u) {
        const h = u.detail || {}, f = h.query || h, E = h.meta && h.meta.targetEl ? h.meta.targetEl : null, w = E || "query", m = n.queryDebounce;
        function y(b, d, c) {
          n.query(d, c).then(function(_) {
            const v = _ || {};
            k(n.dom, "ln-api-connector:fetched", {
              data: v.data || (Array.isArray(v) ? v : []),
              total: v.total,
              filtered: v.filtered,
              offset: d.offset,
              queryGen: d.queryGen,
              meta: b.meta || null
            });
          }).catch(function(_) {
            _ && _.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
              action: "query",
              error: _.message,
              status: _.status || 0,
              data: _.data || null,
              meta: b.meta || null
            });
          });
        }
        if (m === 0) {
          y(h, f, E);
          return;
        }
        n._queryTimers.has(w) && clearTimeout(n._queryTimers.get(w));
        const a = setTimeout(function() {
          n._queryTimers.delete(w), y(h, f, E);
        }, m);
        n._queryTimers.set(w, a);
      },
      cancel: function(u) {
        const h = u.detail || {}, f = h.meta && h.meta.targetEl ? h.meta.targetEl : h.targetEl || h.key;
        f && n.cancel(f);
      },
      create: function(u) {
        const h = u.detail || {};
        n.create(h.data, h.url, h.idempotencyKey).then(function(f) {
          const E = dn(f);
          k(n.dom, "ln-api-connector:created", {
            record: E.record,
            tempId: h.tempId,
            message: E.message,
            meta: h.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "create",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            tempId: h.tempId,
            meta: h.meta || null
          });
        });
      },
      update: function(u) {
        const h = u.detail || {};
        n.update(h.id, h.data, h.expected_version, h.url, h.idempotencyKey).then(function(f) {
          const E = dn(f);
          k(n.dom, "ln-api-connector:updated", {
            record: E.record,
            id: h.id,
            message: E.message,
            meta: h.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "update",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: h.id,
            conflictData: f.status === 409 ? f.data : null,
            meta: h.meta || null
          });
        });
      },
      delete: function(u) {
        const h = u.detail || {};
        n.delete(h.id, h.url, h.idempotencyKey).then(function(f) {
          const E = f && f.message ? f.message : null;
          k(n.dom, "ln-api-connector:deleted", {
            response: f,
            id: h.id,
            message: E,
            meta: h.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            id: h.id,
            meta: h.meta || null
          });
        });
      },
      bulkDelete: function(u) {
        const h = u.detail || {};
        n.bulkDelete(h.ids, h.url, h.idempotencyKey).then(function(f) {
          const E = f && f.message ? f.message : null;
          k(n.dom, "ln-api-connector:bulk-deleted", {
            response: f,
            ids: h.ids,
            message: E,
            meta: h.meta || null
          });
        }).catch(function(f) {
          f && f.name === "AbortError" || k(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: f.message,
            status: f.status || 0,
            data: f.data || null,
            ids: h.ids,
            meta: h.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(u) {
      u.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(u) {
      u && clearTimeout(u);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), delete this.dom[e], delete this.dom[i];
  }, U(t, e, o, "ln-api-connector", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function l(w) {
    const m = w[e];
    m && m.refreshConfig();
  }
  const p = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: K, type: "string", fallback: "", effect: l, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: K, type: "string", fallback: "", effect: l, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: K, type: "string", fallback: "", effect: l, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: l, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, g = Y(p);
  function r(w) {
    const m = w && w.content !== void 0 ? w.content : w, y = w && w.message ? w.message : null;
    return { content: m, message: y };
  }
  function o(w) {
    return this.dom = w, Q(this, w, g), w[e] = this, w[i] = this, this.namespace = "ln-couchdb-connector", this.refreshConfig(), this._deltaController = null, this._handlers = null, E(this), this;
  }
  o.prototype.refreshConfig = function() {
    const w = this.dom;
    this.credentials = "same-origin";
    const m = w.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = vn(m, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), m.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), k(w, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function s(w, m, y) {
    const a = Object.assign({}, Ht(w.headers, w.auth), y || {});
    return m && (a["Idempotency-Key"] = m), a;
  }
  o.prototype.fetchDelta = function(w) {
    const m = this;
    this._deltaController && this._deltaController.abort(), this._deltaController = new AbortController();
    const y = this._deltaController.signal, a = ["include_docs=true", "feed=normal"];
    w && a.push("since=" + encodeURIComponent(w));
    const b = Ct(m.url, m.db, "_changes") + "?" + a.join("&");
    return window.fetch(b, { method: "GET", headers: Ht(m.headers, m.auth), credentials: m.credentials, signal: y }).then((d) => {
      if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
      return d.json();
    }).then((d) => {
      const c = d.results || [];
      return {
        data: c.filter((_) => !_.deleted && _.doc).map((_) => Object.assign({}, _.doc, { id: _.doc._id })),
        deleted: c.filter((_) => _.deleted).map((_) => _.id),
        synced_at: d.last_seq || w || ""
      };
    }).finally(() => {
      m._deltaController && m._deltaController.signal === y && (m._deltaController = null);
    });
  };
  function n(w, m, y) {
    const a = Object.assign({ _id: m.id }, m);
    return a._id || delete a._id, window.fetch(Ct(w.url, w.db), {
      method: "POST",
      headers: s(w, y),
      credentials: w.credentials,
      body: JSON.stringify(a)
    }).then((b) => {
      if (!b.ok) throw new Error("HTTP " + b.status + ": " + b.statusText);
      return b.json();
    }).then((b) => {
      const d = r(b), c = d.content;
      return { record: Object.assign({}, a, { id: c.id, _id: c.id, _rev: c.rev }), message: d.message };
    });
  }
  o.prototype.create = function(w, m) {
    return n(this, w, m).then((y) => y.record);
  };
  function u(w, m, y, a) {
    const b = Object.assign({ id: String(m), _id: String(m) }, y), d = b._rev || b.rev;
    return (d ? Promise.resolve(d) : window.fetch(Ct(w.url, w.db, null, m), { method: "GET", headers: Ht(w.headers, w.auth), credentials: w.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision mapping");
      return _.json().then((v) => v._rev);
    })).then((_) => {
      const v = Object.assign({}, b, { _rev: _ });
      delete v.rev;
      const A = s(w, a, { "If-Match": _ });
      return window.fetch(Ct(w.url, w.db, null, m), {
        method: "PUT",
        headers: A,
        credentials: w.credentials,
        body: JSON.stringify(v)
      }).then((S) => {
        if (S.ok) return S.json().then((T) => {
          const x = r(T);
          return { record: Object.assign({}, v, { _rev: x.content.rev }), message: x.message };
        });
        if (S.status === 409) return S.json().then((T) => {
          const x = new Error("Conflict");
          throw x.status = 409, x.data = T, x;
        });
        throw new Error("HTTP " + S.status + ": " + S.statusText);
      });
    });
  }
  o.prototype.update = function(w, m, y) {
    return u(this, w, m, y).then((a) => a.record);
  };
  function h(w, m, y, a) {
    return (y ? Promise.resolve(y) : window.fetch(Ct(w.url, w.db, null, m), { method: "GET", headers: Ht(w.headers, w.auth), credentials: w.credentials }).then((d) => {
      if (!d.ok) throw new Error("Could not retrieve document for revision delete");
      return d.json().then((c) => c._rev);
    })).then((d) => {
      const c = Ct(w.url, w.db, null, m) + "?rev=" + encodeURIComponent(d);
      return window.fetch(c, { method: "DELETE", headers: s(w, a), credentials: w.credentials }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const v = r(_);
        return { response: v.content, message: v.message };
      });
    });
  }
  o.prototype.delete = function(w, m, y) {
    return h(this, w, m, y).then((a) => a.response);
  };
  function f(w, m, y) {
    return !m || m.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Ct(w.url, w.db, "_all_docs"), {
      method: "POST",
      headers: Ht(w.headers, w.auth),
      credentials: w.credentials,
      body: JSON.stringify({ keys: m })
    }).then((a) => {
      if (!a.ok) throw new Error("HTTP " + a.status + ": " + a.statusText);
      return a.json();
    }).then((a) => {
      const d = (a.rows || []).filter((c) => !c.error && c.value && c.value.rev).map((c) => ({ _id: c.id, _rev: c.value.rev, _deleted: !0 }));
      return d.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Ct(w.url, w.db, "_bulk_docs"), {
        method: "POST",
        headers: s(w, y),
        credentials: w.credentials,
        body: JSON.stringify({ docs: d })
      }).then((c) => {
        if (!c.ok) throw new Error("HTTP " + c.status + ": " + c.statusText);
        return c.json();
      }).then((c) => {
        const _ = r(c);
        return { response: { ok: !0, results: _.content, deletedCount: d.length }, message: _.message };
      });
    });
  }
  o.prototype.bulkDelete = function(w, m) {
    return f(this, w, m).then((y) => y.response);
  };
  function E(w) {
    w._handlers = {
      sync: function(m) {
        const y = m.detail || {};
        w.fetchDelta(y.since).then(function(a) {
          k(w.dom, "ln-couchdb-connector:fetched", { data: a, since: y.since, meta: y.meta || null });
        }).catch(function(a) {
          a && a.name === "AbortError" || k(w.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: a.message,
            status: a.status || 0,
            since: y.since,
            meta: y.meta || null
          });
        });
      },
      create: function(m) {
        const y = m.detail || {};
        n(w, y.data, y.idempotencyKey).then(function(a) {
          k(w.dom, "ln-couchdb-connector:created", { record: a.record, tempId: y.tempId, message: a.message, meta: y.meta || null });
        }).catch(function(a) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: a.message,
            status: a.status || 0,
            tempId: y.tempId,
            meta: y.meta || null
          });
        });
      },
      update: function(m) {
        const y = m.detail || {}, a = Object.assign({}, y.data);
        y.expected_version !== void 0 && (a._rev = y.expected_version), u(w, y.id, a, y.idempotencyKey).then(function(b) {
          k(w.dom, "ln-couchdb-connector:updated", { record: b.record, id: y.id, message: b.message, meta: y.meta || null });
        }).catch(function(b) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: b.message,
            status: b.status || 0,
            id: y.id,
            data: b.status === 409 ? b.data : null,
            conflictData: b.status === 409 ? b.data : null,
            meta: y.meta || null
          });
        });
      },
      delete: function(m) {
        const y = m.detail || {};
        h(w, y.id, y.rev, y.idempotencyKey).then(function(a) {
          k(w.dom, "ln-couchdb-connector:deleted", { response: a.response, id: y.id, message: a.message, meta: y.meta || null });
        }).catch(function(a) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: a.message,
            status: a.status || 0,
            id: y.id,
            meta: y.meta || null
          });
        });
      },
      bulkDelete: function(m) {
        const y = m.detail || {};
        f(w, y.ids, y.idempotencyKey).then(function(a) {
          k(w.dom, "ln-couchdb-connector:bulk-deleted", { response: a.response, ids: y.ids, message: a.message, meta: y.meta || null });
        }).catch(function(a) {
          k(w.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: a.message,
            status: a.status || 0,
            ids: y.ids,
            meta: y.meta || null
          });
        });
      }
    }, w.dom.addEventListener("ln-couchdb-connector:request-sync", w._handlers.sync), w.dom.addEventListener("ln-couchdb-connector:request-create", w._handlers.create), w.dom.addEventListener("ln-couchdb-connector:request-update", w._handlers.update), w.dom.addEventListener("ln-couchdb-connector:request-delete", w._handlers.delete), w.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", w._handlers.bulkDelete);
  }
  o.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const w = this;
    w._deltaController && (w._deltaController.abort(), w._deltaController = null), w._handlers && (w.dom.removeEventListener("ln-couchdb-connector:request-sync", w._handlers.sync), w.dom.removeEventListener("ln-couchdb-connector:request-create", w._handlers.create), w.dom.removeEventListener("ln-couchdb-connector:request-update", w._handlers.update), w.dom.removeEventListener("ln-couchdb-connector:request-delete", w._handlers.delete), w.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", w._handlers.bulkDelete), w._handlers = null), delete this.dom[e], delete this.dom[i];
  }, U(t, e, o, "ln-couchdb-connector", {
    attributes: p
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  const l = 1e3, p = 3e4;
  function g(f) {
    const E = f[e];
    E && (E.command === "connect" ? E._open() : E._disconnect());
  }
  function r(f) {
    const E = f[e];
    !E || E.command !== "connect" || (E._drop("url-changed"), E._open());
  }
  const o = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: g, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: K, type: "string", fallback: "", effect: r, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, s = Y(o), n = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function u(f, E) {
    return f === "sync" ? { since: E.since } : f === "query" ? { query: E.query || {} } : f === "create" ? { data: E.data, idempotencyKey: E.idempotencyKey } : f === "update" ? { id: E.id, data: E.data, expected_version: E.expected_version, idempotencyKey: E.idempotencyKey } : f === "delete" ? { id: E.id, idempotencyKey: E.idempotencyKey } : { ids: E.ids, idempotencyKey: E.idempotencyKey };
  }
  function h(f) {
    this.dom = f, Q(this, f, s), f[e] = this, f[i] = this, this.namespace = "ln-websocket-connector", this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const E = this;
    this._onRequest = function(w) {
      E._request(n[w.type], w.detail || {});
    };
    for (const w in n) f.addEventListener(w, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  h.prototype._open = function() {
    if (this._socket || this._timer) return;
    const f = this, E = this.url;
    this._attempt++, this._status = "connecting", k(this.dom, "ln-websocket-connector:connecting", { url: E, attempt: this._attempt });
    let w;
    try {
      w = new WebSocket(E);
    } catch (m) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, m.message), this._held = [], k(this.dom, "ln-websocket-connector:disconnected", { url: E, code: 0, reason: m.message, willReconnect: !1 });
      return;
    }
    this._socket = w, w.onopen = function() {
      f._status = "connected", f._attempt = 0, k(f.dom, "ln-websocket-connector:connected", { url: E });
      const m = f._held;
      f._held = [];
      for (let y = 0; y < m.length; y++) f._send(m[y]);
    }, w.onmessage = function(m) {
      f._receive(m.data);
    }, w.onclose = function(m) {
      f._socket = null, f._status = "disconnected", f._failPending("connection closed");
      const y = f.command === "connect";
      k(f.dom, "ln-websocket-connector:disconnected", { url: E, code: m.code, reason: m.reason, willReconnect: y }), y && f._scheduleReconnect();
    };
  }, h.prototype._scheduleReconnect = function() {
    const f = this, E = Math.min(l * Math.pow(2, Math.max(0, this._attempt - 1)), p);
    this._timer = setTimeout(function() {
      f._timer = null, f._open();
    }, E);
  }, h.prototype._drop = function(f) {
    const E = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, f), this._socket = null), E && (this._status = "disconnected", this._failPending("connection closed"), k(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: f, willReconnect: !1 }));
  }, h.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, h.prototype._request = function(f, E) {
    const w = { ref: String(++this._seq), type: f, detail: E };
    this._status === "connected" ? this._send(w) : this.command === "connect" ? this._held.push(w) : this._fail(w, 0, "disconnected", null);
  }, h.prototype._send = function(f) {
    this._pending.set(f.ref, f), this._socket.send(JSON.stringify(Object.assign({ ref: f.ref, type: f.type }, u(f.type, f.detail))));
  }, h.prototype._receive = function(f) {
    let E;
    try {
      E = JSON.parse(f);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", f);
      return;
    }
    if (E.ref !== void 0) {
      const w = this._pending.get(String(E.ref));
      if (!w) return;
      this._pending.delete(w.ref), E.ok ? this._resolve(w, E.content, E.message || null) : this._fail(w, E.status || 0, E.error, E.data);
      return;
    }
    E.type === "changes" && k(this.dom, "ln-websocket-connector:fetched", {
      data: { data: E.data || [], deleted: E.deleted || [], synced_at: E.synced_at },
      since: null,
      meta: null
    });
  }, h.prototype._resolve = function(f, E, w) {
    const m = f.detail, y = m.meta || null, a = this.dom;
    if (f.type === "sync")
      k(a, "ln-websocket-connector:fetched", { data: E, since: m.since, meta: y });
    else if (f.type === "query") {
      const b = m.query || {}, d = E || {};
      k(a, "ln-websocket-connector:fetched", {
        data: d.data || [],
        total: d.total,
        filtered: d.filtered,
        offset: b.offset,
        queryGen: b.queryGen,
        meta: y
      });
    } else f.type === "create" ? k(a, "ln-websocket-connector:created", { record: E, tempId: m.tempId, message: w, meta: y }) : f.type === "update" ? k(a, "ln-websocket-connector:updated", { record: E, id: m.id, message: w, meta: y }) : f.type === "delete" ? k(a, "ln-websocket-connector:deleted", { response: E, id: m.id, message: w, meta: y }) : k(a, "ln-websocket-connector:bulk-deleted", { response: E, ids: m.ids, message: w, meta: y });
  }, h.prototype._fail = function(f, E, w, m) {
    const y = f.detail;
    k(this.dom, "ln-websocket-connector:error", {
      action: f.type,
      error: w,
      status: E,
      data: m || null,
      conflictData: E === 409 && m || null,
      since: y.since,
      id: y.id,
      ids: y.ids,
      tempId: y.tempId,
      meta: y.meta || null
    });
  }, h.prototype._failAll = function(f, E) {
    for (let w = 0; w < f.length; w++) this._fail(f[w], 0, E, null);
  }, h.prototype._failPending = function(f) {
    const E = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(E, f);
  }, h.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const f in n) this.dom.removeEventListener(f, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e], delete this.dom[i];
    }
  }, U(t, e, h, "ln-websocket-connector", {
    attributes: o
  });
})();
function Jr(t) {
  return t = t || {}, {
    sort: t.sort,
    filters: t.filters,
    search: t.search,
    offset: t.offset,
    limit: t.limit,
    queryGen: t.queryGen
  };
}
function Zr(t, e) {
  const i = !t || !!t.initializationError, l = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || l) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function un(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class to {
  constructor() {
    this._pending = /* @__PURE__ */ new Map();
  }
  wait(e) {
    return new Promise((i, l) => {
      this._pending.set(e, { resolve: i, reject: l });
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
    for (const l of this._pending.values()) l.reject(i);
    this._pending.clear();
  }
  _settle(e, i) {
    const l = e && e.requestId;
    if (!l) return !1;
    const p = this._pending.get(l);
    return p ? (this._pending.delete(l), i ? p.reject(e.error || new Error("Store mutation failed")) : p.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  const l = "data-ln-data-coordinator-search", p = "data-ln-data-coordinator-filters", g = "data-ln-data-coordinator-sort-field", r = "data-ln-data-coordinator-sort-direction", s = Y({
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
  function u(m) {
    const y = m.getAttribute("data-ln-data-coordinator-connector");
    if (y) return m.querySelector(y) || document.querySelector(y) || document.getElementById(y);
    const a = m.querySelector("[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]");
    if (a) return a;
    for (const b of m.querySelectorAll("*")) {
      if (b.lnConnector) return b;
      for (const d of b.attributes) if (d.name.startsWith("data-ln-") && d.name.endsWith("-connector")) return b;
    }
    return null;
  }
  function h(m) {
    var a;
    if (!m) return "ln-connector";
    if ((a = m.lnConnector) != null && a.namespace) return m.lnConnector.namespace;
    const y = m.getAttribute("data-ln-connector");
    if (y && y !== "true") return y.startsWith("ln-") ? y : "ln-" + y + (y.endsWith("-connector") ? "" : "-connector");
    for (const b of m.attributes) if (b.name.startsWith("data-ln-") && b.name.endsWith("-connector")) return b.name.replace(/^data-/, "");
    return "ln-connector";
  }
  function f(m) {
    const y = this;
    return this.dom = m, Q(this, m, s), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", m), m[e] = this, this._destroyed = !1, this.mapper = null, this._unsubs = [], this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new to(), this._queueQueryRefresh = le(() => {
      y._destroyed || y._refreshAll(null, !0);
    }), this.refreshMapper(), E(this), this._checkInitialSync(), this;
  }
  f.prototype._noAutosync = function(m) {
    var y;
    return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || !!((y = m.storeEl) != null && y.hasAttribute("data-ln-data-store-no-autosync"));
  }, f.prototype._isStale = function(m) {
    var a, b;
    const y = this.dom.getAttribute("data-ln-data-coordinator-stale") || ((a = m.storeEl) == null ? void 0 : a.getAttribute("data-ln-data-store-stale"));
    return y === "never" || y === "-1" ? !1 : !((b = m.store) != null && b.lastSyncedAt) || Date.now() / 1e3 - m.store.lastSyncedAt > (parseInt(y, 10) || 300);
  }, f.prototype._checkInitialSync = function() {
    const m = this, y = this.findChildren();
    y.store && Promise.resolve(y.store.ready).then(() => {
      if (m._destroyed) return;
      const a = m.findChildren();
      a.store && a.connector && !m._noAutosync(a) && !a.store.isSyncing && (!a.store.hasCache || m._isStale(a)) && a.store.forceSync();
    }).catch((a) => m._reportError("store-initialize", a, null));
  }, f.prototype.refreshMapper = function() {
    var a, b;
    const m = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id, y = m && ((b = (a = window.lnCore) == null ? void 0 : a.getDataMapper) == null ? void 0 : b.call(a, m)) || null;
    this.mapper = { ingress: (y == null ? void 0 : y.ingress) || ((d) => d), egress: (y == null ? void 0 : y.egress) || ((d) => d) };
  }, f.prototype.findChildren = function() {
    const m = this.dom.querySelector("[data-ln-data-store]"), y = u(this.dom), a = this.dom.querySelector("[data-ln-api-queue]");
    return { storeEl: m, connectorEl: y, queueEl: a, store: (m == null ? void 0 : m.lnDataStore) || null, connector: (y == null ? void 0 : y.lnConnector) || (y == null ? void 0 : y.lnApiConnector) || (y == null ? void 0 : y.lnCouchDbConnector) || (y == null ? void 0 : y.lnWebsocketConnector) || null, queue: (a == null ? void 0 : a.lnApiQueue) || null };
  }, f.prototype._fanOutRemote = function(m, y, a, b) {
    this.refreshMapper(), m.queue ? k(m.queueEl, "ln-api-queue:request-enqueue", a) : m.connector && k(m.connectorEl, h(m.connectorEl) + ":request-" + y, b);
  }, f.prototype._fanOutCreate = function(m, y, a) {
    const b = "_temp_" + vt(), d = this.mapper.egress(y);
    m.storeEl && k(m.storeEl, "ln-data-store:request-create", { tempId: b, data: d }), this._fanOutRemote(m, "create", { chainKey: b, op: "create", targetId: null, payload: d, expectedVersion: null, meta: { tempId: b, action: a } }, { data: d, url: a, meta: { entryId: vt(), queued: !1, op: "create", tempId: b } });
  }, f.prototype._fanOutUpdate = function(m, y, a, b, d) {
    const c = this.mapper.egress(a);
    m.storeEl && k(m.storeEl, "ln-data-store:request-update", { id: y, data: c }), this._fanOutRemote(m, "update", { chainKey: y, op: "update", targetId: y, payload: c, expectedVersion: b, meta: { id: y, action: d } }, { id: y, data: c, expected_version: b, url: d, meta: { entryId: vt(), queued: !1, op: "update", id: y } });
  }, f.prototype._fanOutDelete = function(m, y) {
    m.storeEl && k(m.storeEl, "ln-data-store:request-delete", { id: y }), this._fanOutRemote(m, "delete", { chainKey: y, op: "delete", targetId: y, payload: null, expectedVersion: null, meta: { id: y } }, { id: y, meta: { entryId: vt(), queued: !1, op: "delete", id: y } });
  }, f.prototype._fanOutBulkDelete = function(m, y) {
    const a = y.join(",");
    m.storeEl && k(m.storeEl, "ln-data-store:request-bulk-delete", { ids: y }), this._fanOutRemote(m, "bulk-delete", { chainKey: a, op: "bulk-delete", targetId: null, payload: { ids: y }, expectedVersion: null, meta: { bulkKey: a, ids: y } }, { ids: y, meta: { entryId: vt(), queued: !1, op: "bulk-delete", bulkKey: a } });
  }, f.prototype._requestStoreMutation = function(m, y, a) {
    if (!m.storeEl) return Promise.reject(new Error("Store element not found"));
    const b = vt(), d = this._mutationReceipts.wait(b);
    return k(m.storeEl, "ln-data-store:request-" + y, Object.assign({}, a, { requestId: b })), d;
  }, f.prototype._reportError = function(m, y, a) {
    this._destroyed || k(this.dom, "ln-data-coordinator:error", { operation: m, error: y, meta: a || null });
  }, f.prototype._owns = function(m) {
    return !!m && m === this._name;
  }, f.prototype._currentQuery = function() {
    const m = this.dom.getAttribute(g), y = this.dom.getAttribute(r), a = new URLSearchParams(this.dom.getAttribute(p) || ""), b = {};
    for (const d of new Set(a.keys())) b[d] = a.getAll(d);
    return { search: this.dom.getAttribute(l) || "", filters: b, sort: m && y ? { field: m, direction: y } : null };
  }, f.prototype._refreshAll = function(m, y) {
    for (const [a, b, d] of n)
      for (const c of this.dom.ownerDocument.querySelectorAll(a))
        if (this._owns(c.getAttribute(b))) {
          if ((d === "table" || d === "list") && c.hasAttribute(d === "table" ? "data-ln-table-window" : "data-ln-list-window")) {
            k(c, "ln-" + d + (y ? ":request-invalidate" : ":request-revalidate"), {});
            continue;
          }
          this._serveElement(c, d, null, m);
        }
  }, f.prototype._serveElement = function(m, y, a, b) {
    const d = this.findChildren(), c = d.store;
    if (!c) return;
    a && this._boundQueries.set(m, a);
    const _ = this._boundQueries.get(m) || { sort: null, filters: {}, search: "" }, v = un(_, this._currentQuery()), A = this;
    return Promise.resolve(c.ready).then(() => {
      if (A._destroyed) return;
      const S = Zr(c, d.connector);
      if (y === "table" || y === "list" || y === "chart")
        return S === "remote" ? (k(m, "ln-" + y + ":set-loading", { loading: !0 }), k(d.connectorEl, h(d.connectorEl) + ":request-query", { query: v, meta: { targetEl: m, kind: y, offset: v.offset, limit: v.limit, queryGen: _.queryGen } })) : S !== "store" ? k(m, "ln-" + y + ":set-loading", { loading: !1 }) : c.getAll(v).then((T) => {
          A._destroyed || !A._boundDelivered || (k(m, "ln-" + y + ":set-loading", { loading: !1 }), k(m, "ln-" + y + ":set-data", { data: T.data, total: (b == null ? void 0 : b.total) ?? T.total, filtered: (b == null ? void 0 : b.filtered) ?? T.filtered, offset: T.offset ?? (b == null ? void 0 : b.offset) ?? _.offset, queryGen: _.queryGen !== void 0 ? _.queryGen : (b == null ? void 0 : b.queryGen) ?? T.queryGen, provisional: T.provisional === !0 }), A._boundDelivered.set(m, !0));
        });
      if (y === "options") {
        if (S === "remote") return k(d.connectorEl, h(d.connectorEl) + ":request-query", { query: {}, meta: { targetEl: m, kind: y } });
        if (S === "store") return c.getAll({}).then((T) => !A._destroyed && k(m, "ln-options:set-data", { data: T.data }));
      }
      if (y === "stat") {
        let T = a == null ? void 0 : a.filters;
        if (!T) {
          const I = m.getAttribute("data-ln-stat-filter");
          if (I != null && I.includes(":")) {
            const N = I.split(":");
            T = { [N[0].trim()]: [N.slice(1).join(":").trim()] };
          }
        }
        const x = d.connector && c && (c.windowed && T && Object.keys(T).length || c.noLocalQuery) ? "remote" : S;
        if (x === "remote") return k(d.connectorEl, h(d.connectorEl) + ":request-query", { query: { filters: T }, meta: { targetEl: m, kind: y } });
        if (x === "store") return c.count(T).then((I) => !A._destroyed && k(m, "ln-stat:set-count", { count: I }));
      }
    }).catch((S) => {
      A._destroyed || ((y === "table" || y === "list" || y === "chart") && k(m, "ln-" + y + ":set-loading", { loading: !1 }), A._reportError(y + "-query", S, { targetEl: m, kind: y }));
    });
  };
  function E(m) {
    const y = m._unsubs = [], a = (A, S, T) => {
      A.addEventListener(S, T), y.push(() => A.removeEventListener(S, T));
    };
    a(m.dom, "ln-data-store:request-remote-sync", (A) => {
      m.refreshMapper();
      const S = m.findChildren();
      S.store && S.connector && k(S.connectorEl, h(S.connectorEl) + ":request-sync", { since: A.detail.since, meta: { op: "sync" } });
    }), a(m.dom, "ln-data-store:request-page", (A) => {
      const S = m.findChildren(), T = A.detail || {};
      if (!S.connectorEl) return;
      const x = un(T.query || {}, m._currentQuery());
      k(S.connectorEl, h(S.connectorEl) + ":request-query", {
        query: Object.assign({}, x, { offset: T.offset, limit: T.limit, queryGen: T.queryGen })
      });
    }), a(m.dom, "ln-data-coordinator:request-create", (A) => m._fanOutCreate(m.findChildren(), A.detail.data || {}, A.detail.action)), a(m.dom, "ln-data-coordinator:request-update", (A) => m._fanOutUpdate(m.findChildren(), A.detail.id, A.detail.data || {}, A.detail.expected_version, A.detail.action)), a(m.dom, "ln-data-coordinator:request-delete", (A) => m._fanOutDelete(m.findChildren(), A.detail.id)), a(m.dom, "ln-data-coordinator:request-bulk-delete", (A) => m._fanOutBulkDelete(m.findChildren(), A.detail.ids || [])), a(m.dom, "ln-api-queue:send", (A) => m._onQueueSend(A.detail || {})), a(m.dom, "ln-api-queue:failed", (A) => {
      var S;
      return m._reportError("queue-failed", ((S = A == null ? void 0 : A.detail) == null ? void 0 : S.error) || new Error("Queue failed"), (A == null ? void 0 : A.detail) || null);
    }), a(m.dom, "ln-data-store:initialized", (A) => {
      var T;
      const S = m.findChildren();
      S.store && !S.store.initializationError && S.connector && !m._noAutosync(S) && !S.store.isSyncing && (!((T = A.detail) != null && T.hasCache) || m._isStale(S)) && S.store.forceSync();
    });
    const b = () => {
      const A = m.findChildren();
      A.store && !A.store.initializationError && A.connector && !m._noAutosync(A) && A.store.isInitialized && !A.store.isSyncing && A.store.forceSync();
    };
    a(m.dom, "ln-websocket-connector:connected", b), a(document, "submit", (A) => m._onFormSubmit(A));
    const d = (A, S, T) => {
      var x;
      m._owns(A.target.getAttribute(T)) && m._serveElement(A.target, S, S === "stat" ? { filters: ((x = A.detail) == null ? void 0 : x.filters) || null } : S === "options" ? null : Jr(A.detail || {}), null);
    };
    a(document, "ln-table:request-data", (A) => d(A, "table", "data-ln-table-source")), a(document, "ln-list:request-data", (A) => d(A, "list", "data-ln-list-source")), a(document, "ln-chart:request-data", (A) => d(A, "chart", "data-ln-chart-source")), a(document, "ln-options:request-data", (A) => d(A, "options", "data-ln-options")), a(document, "ln-stat:request-count", (A) => d(A, "stat", "data-ln-stat"));
    const c = (A) => {
      m._mutationReceipts.resolve(A.detail), m._refreshAll(null, !1);
    };
    a(m.dom, "ln-data-store:ready", c), a(m.dom, "ln-data-store:created", c), a(m.dom, "ln-data-store:updated", c), a(m.dom, "ln-data-store:deleted", c), a(m.dom, "ln-data-store:mutation-error", (A) => m._mutationReceipts.reject(A.detail)), a(m.dom, "ln-data-store:synced", (A) => {
      var S;
      (S = A.detail) != null && S.changed && m._refreshAll(A.detail.meta, !1);
    }), a(m.dom, "ln-data-store:query-changed", () => m._refreshAll(null, !0)), a(m.dom, "ln-search:change", (A) => {
      var T;
      A.preventDefault();
      const S = ((T = A.detail) == null ? void 0 : T.term) != null ? A.detail.term : "";
      S !== (m.dom.getAttribute(l) || "") && m.dom.setAttribute(l, S);
    }), a(m.dom, "ln-filter:change", (A) => {
      var M;
      A.preventDefault();
      const S = (M = A.detail) == null ? void 0 : M.key;
      if (!S) return;
      const T = (A.detail.values || []).slice(), x = m._currentQuery().filters, I = x[S];
      if (I ? I.length === T.length && I.every((F, H) => F === T[H]) : !T.length) return;
      T.length ? x[S] = T : delete x[S];
      const N = new URLSearchParams();
      Object.keys(x).forEach((F) => x[F].forEach((H) => N.append(F, H)));
      const D = N.toString();
      D ? m.dom.setAttribute(p, D) : m.dom.removeAttribute(p);
    }), a(m.dom, "ln-sort:change", (A) => {
      var N, D;
      A.preventDefault();
      const S = (N = A.detail) == null ? void 0 : N.field, T = (D = A.detail) == null ? void 0 : D.direction, x = S && T && T !== "none" ? { field: S, direction: T } : null, I = m._currentQuery().sort;
      !I && !x || I && x && I.field === x.field && I.direction === x.direction || (x ? (m.dom.setAttribute(g, x.field), m.dom.setAttribute(r, x.direction)) : (m.dom.removeAttribute(g), m.dom.removeAttribute(r)));
    });
    const _ = /* @__PURE__ */ new Set(["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector", "ln-connector"]), v = m.findChildren().connectorEl;
    if (v) {
      const A = h(v);
      _.add(A), a(m.dom, A + ":connected", b);
    }
    _.forEach((A) => {
      a(m.dom, A + ":fetched", (S) => m._reconcileServerFetch(S.detail)), a(m.dom, A + ":created", (S) => m._reconcileServerMutation("create", S.detail)), a(m.dom, A + ":updated", (S) => m._reconcileServerMutation("update", S.detail)), a(m.dom, A + ":deleted", (S) => m._reconcileServerMutation("ack", S.detail)), a(m.dom, A + ":bulk-deleted", (S) => m._reconcileServerMutation("ack", S.detail)), a(m.dom, A + ":error", (S) => m._reconcileServerMutation("error", S.detail));
    });
  }
  f.prototype._onQueueSend = function(m) {
    this.refreshMapper();
    const y = this.findChildren();
    if (!y.store || !y.connector || !y.queue) return;
    const a = m.meta || {}, b = h(y.connectorEl), d = m.idempotencyKey || m.entryId, c = {
      create: () => k(y.connectorEl, b + ":request-create", { data: m.payload, url: a.action || null, idempotencyKey: d, meta: { entryId: m.entryId, queued: !0, op: "create", tempId: a.tempId } }),
      update: () => k(y.connectorEl, b + ":request-update", { id: m.targetId, data: m.payload, expected_version: m.expectedVersion, url: a.action || null, idempotencyKey: d, meta: { entryId: m.entryId, queued: !0, op: "update", id: m.targetId } }),
      delete: () => k(y.connectorEl, b + ":request-delete", { id: m.targetId, idempotencyKey: d, meta: { entryId: m.entryId, queued: !0, op: "delete", id: m.targetId } }),
      "bulk-delete": () => {
        var _;
        return k(y.connectorEl, b + ":request-bulk-delete", { ids: ((_ = m.payload) == null ? void 0 : _.ids) || [], idempotencyKey: d, meta: { entryId: m.entryId, queued: !0, op: "bulk-delete", bulkKey: a.bulkKey } });
      }
    };
    c[m.op] && c[m.op]();
  }, f.prototype._onFormSubmit = function(m) {
    const y = m.target;
    if (m.defaultPrevented) return;
    const a = y.hasAttribute(i) ? y.getAttribute(i) : null;
    if (a === null || (a ? !this._owns(a) : y.closest("[" + t + "]") !== this.dom)) return;
    const b = bn(y);
    if (b !== "POST" && b !== "PUT" && b !== "PATCH") return;
    m.preventDefault();
    const d = qe(y);
    delete d._method, delete d._token;
    const c = d.id, _ = d.expected_version, v = y.getAttribute("action") || "", A = this.findChildren();
    delete d.id, delete d.expected_version, b === "POST" ? this._fanOutCreate(A, d, v) : this._fanOutUpdate(A, c, d, _, v);
  }, f.prototype._reconcileServerFetch = function(m) {
    if (!m) return;
    const y = m.meta || {}, a = this.findChildren(), b = m.data;
    this.refreshMapper();
    const d = Array.isArray(b) ? b : (b == null ? void 0 : b.data) || [], c = Array.isArray(b == null ? void 0 : b.deleted) ? b.deleted : [], _ = Array.isArray(b) ? Math.floor(Date.now() / 1e3) : (b == null ? void 0 : b.synced_at) ?? (b == null ? void 0 : b.since) ?? Math.floor(Date.now() / 1e3), v = d.map((A) => this.mapper.ingress(A));
    if (!(!a.store || a.store.initializationError)) {
      if (!y.kind) return a.store.applySync(v, c, _, { total: m.total, filtered: m.filtered, offset: m.offset, queryGen: m.queryGen, targetEl: y.targetEl });
      a.store.applyQuery(v, { total: m.total }).then((A) => {
        const S = y.kind;
        S === "table" || S === "list" || S === "chart" ? (k(y.targetEl, "ln-" + S + ":set-loading", { loading: !1 }), k(y.targetEl, "ln-" + S + ":set-data", { data: A, total: m.total ?? A.length, filtered: m.filtered ?? A.length, offset: m.offset, queryGen: y.queryGen }), this._boundDelivered.set(y.targetEl, !0)) : S === "options" ? a.store.getAll({}).then((T) => k(y.targetEl, "ln-options:set-data", { data: T.data })) : S === "stat" && k(y.targetEl, "ln-stat:set-count", { count: m.filtered ?? m.total ?? v.length });
      });
    }
  }, f.prototype._reconcileServerMutation = function(m, y) {
    var d;
    if (!y) return;
    const a = this.findChildren(), b = y.meta || {};
    if (m === "create") {
      if (!y.record) return this._reportError("create-empty-response", new Error("Create response missing record payload"), b);
      const c = this.mapper.ingress(y.record);
      (a.storeEl ? this._requestStoreMutation(a, "update", { id: b.tempId, data: c }) : Promise.resolve()).then(() => {
        b.queued && a.queue && k(a.queueEl, "ln-api-queue:resolve-create", { entryId: b.entryId, oldKey: b.tempId, newId: c.id });
      }).catch((_) => this._reportError("create-reconcile", _, b));
    } else if (m === "update") {
      const c = y.record ? this.mapper.ingress(y.record) : null;
      (a.storeEl && c ? this._requestStoreMutation(a, "update", { id: b.id, data: c }) : Promise.resolve()).then(() => {
        b.queued && a.queue && k(a.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
      }).catch((_) => this._reportError("update-reconcile", _, b));
    } else if (m === "ack")
      b.queued && a.queue && k(a.queueEl, "ln-api-queue:ack", { entryId: b.entryId });
    else if (m === "error") {
      const c = y.status || ((d = y.error) == null ? void 0 : d.status) || 0;
      b.queued && a.queue && k(a.queueEl, "ln-api-queue:nack", { entryId: b.entryId, reason: c === 401 || c === 419 ? "auth" : c === 0 || c >= 500 ? "retry" : "drop" }), this._reportError("connector-error", y.error || y, b);
    }
  }, f.prototype.destroy = function() {
    var m;
    if (this.dom[e]) {
      for (this._destroyed = !0; (m = this._unsubs) != null && m.length; ) this._unsubs.pop()();
      this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null, this._mutationReceipts.close(new Error("Data coordinator destroyed")), this._mutationReceipts = null, delete this.dom[e];
    }
  };
  function w(m, y) {
    const a = m[e];
    a && (y === "data-ln-data-coordinator-mapper" ? a.refreshMapper() : (y === l || y === p || y === g || y === r) && a._queueQueryRefresh());
  }
  U(t, e, f, "ln-data-coordinator", {
    extraAttributes: ["data-ln-data-coordinator-mapper", l, p, g, r],
    onAttributeChange: w
  }), window[e].init = window[e];
})();
const eo = "ln_api_queue", no = 2, Z = "outbox", rt = "_queue_meta";
function lt(t, e) {
  return t.error || new Error(e);
}
function Ft(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function fn(t) {
  return "seq:" + t;
}
function ee(t) {
  return "paused:" + t;
}
function hn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function io(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function ro(t, e, i, l) {
  const p = /* @__PURE__ */ new Map(), g = [], r = [];
  for (const o of t || [])
    p.has(o.chainKey) || p.set(o.chainKey, []), p.get(o.chainKey).push(o);
  return p.forEach((o, s) => {
    o.sort((u, h) => u.seq - h.seq);
    const n = o[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > l) {
        r.push({ chainKey: s, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > l) {
        r.push({ chainKey: s, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = l + i, n.updatedAt = l, g.push(n);
    }
  }), { entries: g, wakeups: r };
}
function oo(t, e, i, l, p) {
  const g = [], r = [];
  for (const o of t || []) {
    if (o.entryId === e) {
      r.push(o.entryId);
      continue;
    }
    o.chainKey === i && (o.chainKey = l, o.targetId === i && (o.targetId = l), o.meta && o.meta.id === i && (o.meta.id = l), o.meta && typeof o.meta.action == "string" && (o.meta.action = io(o.meta.action, i, l)), o.updatedAt = p, g.push(o));
  }
  return { changed: g, deleted: r };
}
class so {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || eo, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const l = this.indexedDB.open(this.dbName, no);
      l.onupgradeneeded = (p) => {
        const g = p.target.result;
        let r;
        g.objectStoreNames.contains(Z) ? r = p.target.transaction.objectStore(Z) : r = g.createObjectStore(Z, { keyPath: "entryId" }), r.indexNames.contains("by_scope_chain") || r.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), r.indexNames.contains("by_scope_seq") || r.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), g.objectStoreNames.contains(rt) || g.createObjectStore(rt, { keyPath: "key" });
      }, l.onerror = () => i(lt(l, "Queue database open failed")), l.onsuccess = (p) => {
        this._db = p.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const l = this.indexedDB.deleteDatabase(this.dbName);
      l.onsuccess = () => e(), l.onerror = () => i(lt(l, "Queue database delete failed")), l.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((l, p) => {
      const r = i.transaction(Z, "readonly").objectStore(Z).index("by_scope_seq").getAll(Ft(this.keyRange, e));
      r.onsuccess = () => l(r.result || []), r.onerror = () => p(lt(r, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((l) => l ? new Promise((p, g) => {
      const r = l.transaction([rt, Z], "readwrite"), o = r.objectStore(rt), s = r.objectStore(Z), n = fn(e);
      let u = null;
      const h = (E) => {
        const w = E + 1;
        u = {
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
        }, o.put({ key: n, value: w }), s.put(u);
      }, f = o.get(n);
      f.onerror = () => g(lt(f, "Queue sequence read failed")), f.onsuccess = () => {
        const E = f.result;
        if (E && typeof E.value == "number") {
          h(E.value);
          return;
        }
        const w = s.index("by_scope_seq").getAll(Ft(this.keyRange, e));
        w.onerror = () => g(lt(w, "Queue sequence migration failed")), w.onsuccess = () => {
          const m = (w.result || []).reduce((y, a) => Math.max(y, a.seq || 0), 0);
          h(m);
        };
      }, r.oncomplete = () => p(u), r.onerror = () => g(r.error || new Error("Queue enqueue transaction failed")), r.onabort = () => g(r.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, l) {
    return this.open().then((p) => p ? new Promise((g, r) => {
      const o = p.transaction(Z, "readwrite"), s = o.objectStore(Z), n = s.index("by_scope_seq").getAll(Ft(this.keyRange, e)), u = this.now();
      let h = { entries: [], wakeups: [] };
      n.onerror = () => r(lt(n, "Queue claim read failed")), n.onsuccess = () => {
        h = ro(n.result || [], i, l, u);
        for (const f of h.entries) s.put(f);
      }, o.oncomplete = () => g(h), o.onerror = () => r(o.error || new Error("Queue claim transaction failed")), o.onabort = () => r(o.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (l, p) => (p.delete(l.entryId), { status: "acked", entry: l }));
  }
  nack(e, i, l, p) {
    p = p || {};
    const g = p.maxAttempts || 8, r = p.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((o) => o ? new Promise((s, n) => {
      const u = o.transaction([Z, rt], "readwrite"), h = u.objectStore(Z), f = u.objectStore(rt), E = h.get(i);
      let w = null;
      E.onerror = () => n(lt(E, "Queue nack read failed")), E.onsuccess = () => {
        const m = E.result;
        if (!(!m || m.scope !== e)) {
          if (l === "drop") {
            h.delete(m.entryId), w = { status: "dropped", entry: m };
            return;
          }
          if (hn(m), m.updatedAt = this.now(), l === "auth") {
            m.status = "pending", h.put(m), f.put({ key: ee(e), value: "auth" }), w = { status: "auth", entry: m };
            return;
          }
          if (l === "retry") {
            if (m.attempts = (m.attempts || 0) + 1, m.attempts >= g) {
              m.status = "failed", m.nextAttemptAt = 0, h.put(m), w = { status: "failed", entry: m };
              return;
            }
            const y = r[Math.min(m.attempts - 1, r.length - 1)];
            m.status = "pending", m.nextAttemptAt = this.now() + y, h.put(m), w = { status: "retry", entry: m, delay: y };
          }
        }
      }, u.oncomplete = () => s(w), u.onerror = () => n(u.error || new Error("Queue nack transaction failed")), u.onabort = () => n(u.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, l) {
    return this._remapTransaction(e, null, i, l);
  }
  resolveCreate(e, i, l, p) {
    return this._remapTransaction(e, i, l, p);
  }
  _remapTransaction(e, i, l, p) {
    return this.open().then((g) => g ? new Promise((r, o) => {
      const s = g.transaction(Z, "readwrite"), n = s.objectStore(Z), u = n.index("by_scope_seq").getAll(Ft(this.keyRange, e));
      let h = { changed: [], deleted: [] };
      u.onerror = () => o(lt(u, "Queue remap read failed")), u.onsuccess = () => {
        h = oo(u.result || [], i, l, p, this.now());
        for (const f of h.deleted) n.delete(f);
        for (const f of h.changed) n.put(f);
      }, s.oncomplete = () => r(h.changed), s.onerror = () => o(s.error || new Error("Queue remap transaction failed")), s.onabort = () => o(s.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((l, p) => {
      const g = i.transaction(Z, "readwrite"), r = g.objectStore(Z), o = r.index("by_scope_seq").getAll(Ft(this.keyRange, e));
      let s = 0;
      o.onerror = () => p(lt(o, "Queue failed-entry read failed")), o.onsuccess = () => {
        for (const n of o.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), hn(n), r.put(n), s++);
      }, g.oncomplete = () => l(s), g.onerror = () => p(g.error || new Error("Queue failed-entry reset failed")), g.onabort = () => p(g.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((l, p) => {
      const r = i.transaction(rt, "readonly").objectStore(rt).get(ee(e));
      r.onsuccess = () => {
        const o = r.result ? r.result.value : !1;
        l(o || !1);
      }, r.onerror = () => p(lt(r, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((l) => {
      if (l)
        return new Promise((p, g) => {
          const r = l.transaction(rt, "readwrite"), o = typeof i == "string" ? i : i ? "manual" : !1;
          r.objectStore(rt).put({ key: ee(e), value: o }), r.oncomplete = () => p(), r.onerror = () => g(r.error || new Error("Queue pause-state write failed")), r.onabort = () => g(r.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((l, p) => {
          const g = i.transaction([Z, rt], "readwrite"), o = g.objectStore(Z).index("by_scope_seq").openCursor(Ft(this.keyRange, e));
          o.onsuccess = (s) => {
            const n = s.target.result;
            n && (n.delete(), n.continue());
          }, o.onerror = () => p(lt(o, "Queue clear failed")), g.objectStore(rt).delete(fn(e)), g.objectStore(rt).delete(ee(e)), g.oncomplete = () => l(), g.onerror = () => p(g.error || new Error("Queue clear transaction failed")), g.onabort = () => p(g.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, l) {
    return this.open().then((p) => p ? new Promise((g, r) => {
      const o = p.transaction(Z, "readwrite"), s = o.objectStore(Z), n = s.get(i);
      let u = null;
      n.onerror = () => r(lt(n, "Queue entry read failed")), n.onsuccess = () => {
        const h = n.result;
        !h || h.scope !== e || (u = l(h, s));
      }, o.oncomplete = () => g(u), o.onerror = () => r(o.error || new Error("Queue entry transaction failed")), o.onabort = () => r(o.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], l = 8, p = 6e4;
  if (window[e] !== void 0) return;
  function g(n) {
    const u = n[e];
    u && u._drain();
  }
  const r = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: g, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  }, o = new so({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: vt
  });
  function s(n) {
    this.dom = n, n[e] = this;
    const u = n.closest("[data-ln-data-coordinator]");
    this.scope = n.id || (u ? u.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = vt(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const h = this;
    return o.open().then((f) => f ? o.getPaused(h.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((f) => {
      if (h._paused = !!f, h._paused) {
        const E = typeof f == "string" ? f : "auth";
        k(h.dom, "ln-api-queue:paused", { reason: E, restored: !0 });
      }
      return h._emitPendingCount();
    }).then(() => h._drain()).catch((f) => {
      console.error("[ln-api-queue] Initialization failed:", f), k(h.dom, "ln-api-queue:error", { operation: "initialize", error: f });
    }), this;
  }
  s.prototype._isOnline = function() {
    const n = this.dom.getAttribute("data-ln-api-queue-online");
    return n === "true" ? !0 : n === "false" ? !1 : navigator.onLine;
  }, s.prototype._emitPendingCount = function() {
    const n = this;
    return o.allForScope(n.scope).then((u) => (k(n.dom, "ln-api-queue:pending-count", { count: u.length, scope: n.scope }), u.length === 0 && k(n.dom, "ln-api-queue:drained", { scope: n.scope }), u));
  }, s.prototype._clearTimer = function(n) {
    const u = this._timers.get(n);
    u && (clearTimeout(u), this._timers.delete(n));
  }, s.prototype._scheduleTimer = function(n, u) {
    const h = Math.max(0, u), f = this._timers.get(n);
    f && clearTimeout(f);
    const E = this, w = setTimeout(() => {
      E._timers.delete(n), E._drain();
    }, h);
    this._timers.set(n, w);
  }, s.prototype._drain = function() {
    const n = this;
    return n._paused || !n._isOnline() ? Promise.resolve() : (n._drainPromise || (n._drainPromise = o.claimReady(n.scope, n._workerId, p).then((u) => {
      for (const h of u.wakeups)
        n._scheduleTimer(h.chainKey, h.at - Date.now());
      for (const h of u.entries)
        n._clearTimer(h.chainKey), k(n.dom, "ln-api-queue:send", {
          entryId: h.entryId,
          chainKey: h.chainKey,
          op: h.op,
          targetId: h.targetId,
          payload: h.payload,
          expectedVersion: h.expectedVersion,
          idempotencyKey: h.entryId,
          meta: h.meta
        });
    }).catch((u) => {
      console.error("[ln-api-queue] Drain failed:", u), k(n.dom, "ln-api-queue:error", { operation: "drain", error: u });
    }).finally(() => {
      n._drainPromise = null;
    })), n._drainPromise);
  }, s.prototype._onEnqueue = function(n) {
    const u = this;
    return o.enqueue(u.scope, n.detail || {}).then((h) => {
      if (h)
        return u._emitPendingCount().then((f) => (k(u.dom, "ln-api-queue:enqueued", {
          entryId: h.entryId,
          chainKey: h.chainKey,
          count: f.length
        }), u._drain()));
    }).catch((h) => {
      k(u.dom, "ln-api-queue:error", { operation: "enqueue", error: h });
    });
  }, s.prototype._onAck = function(n) {
    const u = this, h = n.detail || {};
    return o.ack(u.scope, h.entryId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((f) => {
      k(u.dom, "ln-api-queue:error", { operation: "ack", entryId: h.entryId, error: f });
    });
  }, s.prototype._onNack = function(n) {
    const u = this, h = n.detail || {};
    return o.nack(u.scope, h.entryId, h.reason, {
      maxAttempts: l,
      backoff: i
    }).then((f) => {
      if (f)
        return f.status === "failed" ? k(u.dom, "ln-api-queue:failed", {
          entryId: f.entry.entryId,
          chainKey: f.entry.chainKey,
          attempts: f.entry.attempts
        }) : f.status === "retry" ? u._scheduleTimer(f.entry.chainKey, f.delay) : f.status === "auth" && (u._paused = !0, k(u.dom, "ln-api-queue:paused", { reason: "auth" }), k(u.dom, "ln-api-queue:auth-required", {
          entryId: f.entry.entryId,
          chainKey: f.entry.chainKey
        })), u._emitPendingCount().then(() => {
          if (f.status === "dropped") return u._drain();
        });
    }).catch((f) => {
      k(u.dom, "ln-api-queue:error", { operation: "nack", entryId: h.entryId, error: f });
    });
  }, s.prototype._onRemap = function(n) {
    const u = this, h = n.detail || {};
    return o.remap(u.scope, h.oldKey, h.newId).catch((f) => {
      k(u.dom, "ln-api-queue:error", { operation: "remap", error: f });
    });
  }, s.prototype._onResolveCreate = function(n) {
    const u = this, h = n.detail || {};
    return o.resolveCreate(u.scope, h.entryId, h.oldKey, h.newId).then(() => u._emitPendingCount()).then(() => u._drain()).catch((f) => {
      k(u.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: h.entryId,
        error: f
      });
    });
  }, s.prototype._onResume = function() {
    const n = this;
    return o.setPaused(n.scope, !1).then(() => (n._paused = !1, k(n.dom, "ln-api-queue:resumed", {}), n._drain())).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "resume", error: u });
    });
  }, s.prototype._onPause = function() {
    const n = this;
    return o.setPaused(n.scope, "manual").then(() => {
      n._paused = !0, k(n.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "pause", error: u });
    });
  }, s.prototype._onDrain = function() {
    const n = this;
    return o.resetFailed(n.scope).then(() => {
      const u = n._drainPromise;
      return u ? u.then(() => n._drain()) : n._drain();
    }).catch((u) => {
      k(n.dom, "ln-api-queue:error", { operation: "manual-drain", error: u });
    });
  }, s.prototype._onClear = function() {
    const n = this;
    return n._timers.forEach((u) => clearTimeout(u)), n._timers.clear(), o.clear(n.scope).then(() => {
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
  }, U(t, e, s, "ln-api-queue", {
    attributes: r
  });
})();
function mi(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Bt(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function ao(t, e, i) {
  const l = mi(t);
  return l === null || l < 0 ? 0 : Math.min(l, Math.min(e, i) / 2);
}
function lo(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function co(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function uo(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, l = e.xField || "label", p = e.yField || "value", g = e.includeZero !== !1, r = ao(e.padding, i.width, i.height), o = Array.isArray(t) ? t : [], s = [];
  for (let c = 0; c < o.length; c++) {
    const _ = o[c] || {}, v = mi(_[p]);
    v !== null && s.push({
      record: _,
      sourceIndex: c,
      label: _[l] == null ? String(c + 1) : String(_[l]),
      value: v
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
      baselineY: i.y + i.height - r
    };
  let n = s[0].value, u = s[0].value;
  for (let c = 1; c < s.length; c++)
    s[c].value < n && (n = s[c].value), s[c].value > u && (u = s[c].value);
  let h = n, f = u;
  g && (h = Math.min(0, h), f = Math.max(0, f)), h === f && (f === 0 ? f = 1 : f > 0 ? h = 0 : f = 0);
  const E = Math.max(1, i.width - r * 2), w = Math.max(1, i.height - r * 2), m = f - h, y = i.y + i.height - r - (0 - h) / m * w, a = [];
  for (let c = 0; c < s.length; c++) {
    const _ = s[c], v = s.length === 1 ? 0.5 : c / (s.length - 1), A = i.x + r + v * E, S = i.y + i.height - r - (_.value - h) / m * w;
    a.push({
      record: _.record,
      sourceIndex: _.sourceIndex,
      label: _.label,
      value: _.value,
      x: A,
      y: S,
      pointString: Bt(A) + "," + Bt(S)
    });
  }
  const b = a.map((c) => c.pointString).join(" ");
  let d = "";
  if (a.length > 0) {
    const c = a[0], _ = a[a.length - 1], v = Bt(c.x) + "," + Bt(y), A = Bt(_.x) + "," + Bt(y);
    d = v + " " + b + " " + A;
  }
  return {
    points: a,
    linePoints: b,
    areaPoints: d,
    count: a.length,
    min: n,
    max: u,
    domainMin: h,
    domainMax: f,
    baselineY: y
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function l(n) {
    const u = n[e];
    u && u.requestData();
  }
  function p(n) {
    const u = n[e];
    u && u._render();
  }
  const g = {
    "data-ln-chart": { prop: "name", type: "string", read: K, fallback: "", effect: p, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: l, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: l, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: p, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: p, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: p, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: p, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: p, description: "Forces Y axis scale to start at zero" }
  }, r = Y(g);
  function o(n, u) {
    n && (n.textContent = u);
  }
  function s(n) {
    this.dom = n, Q(this, n, r), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const u = this;
    return this._onSetData = function(h) {
      const f = h.detail || {};
      u._data = Array.isArray(f.data) ? f.data : [], u.isLoaded = !0, u._setLoading(!1), u._render();
    }, this._onSetLoading = function(h) {
      u._setLoading(!!(h.detail && h.detail.loading));
    }, this._onRefresh = function() {
      u.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  s.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), u = n === null ? NaN : Number(n), h = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(u) && u >= 0 ? u : 16,
      type: h === "area" || h === "polygon" ? "area" : "line",
      viewBox: this.plot && lo(this.plot.getAttribute("viewBox")) || i
    };
  }, s.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, s.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const u = this.name + "-label", h = '[data-ln-template="' + u + '"]';
    if (!this.dom.querySelector(h) && !document.querySelector(h)) return;
    const f = Lt(this.dom, u, "ln-chart");
    if (!f) return;
    const E = J(this.dom);
    for (const w of n.points) {
      const m = f.cloneNode(!0);
      Yt(m, {
        label: w.label,
        value: ot(w.value, E)
      }), this.labels.appendChild(m);
    }
  }, s.prototype._render = function() {
    const n = this._readOptions(), u = uo(this._data, n);
    this.model = u, this.line && (this.line.setAttribute("points", u.linePoints), this.line.toggleAttribute("hidden", u.count === 0)), this.area && (this.area.setAttribute("points", u.areaPoints), this.area.toggleAttribute("hidden", u.count === 0 || n.type !== "area"));
    const h = u.count === 0;
    this.dom.classList.toggle("ln-chart--empty", h), this.empty && this.empty.toggleAttribute("hidden", !h);
    const f = J(this.dom);
    o(this.minimum, ot(u.min, f)), o(this.maximum, ot(u.max, f)), o(this.count, ot(u.count, f)), this._renderLabels(u), k(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: u.count,
      min: u.min,
      max: u.max
    });
  }, s.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, k(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: co(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, s.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, U(t, e, s, "ln-chart", {
    attributes: g
  });
})();
(function() {
  const t = "data-ln-options", e = "lnOptions";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-options": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or coordinator addressing to populate options from" },
    "data-ln-options-value": { prop: "_valueField", type: "string", read: K, fallback: "id", description: "Field name used for option value attribute" },
    "data-ln-options-label": { prop: "_labelField", type: "string", read: K, fallback: "name", description: "Field name used for option visible label text" }
  }, l = Y(i);
  function p(g) {
    this.dom = g, Q(this, g, l);
    const r = this;
    return this._onSetData = function(o) {
      o.detail && r._rebuild(o.detail.data || []);
    }, g.addEventListener("ln-options:set-data", this._onSetData), k(g, "ln-options:request-data", { options: this._storeName }), this;
  }
  p.prototype._rebuild = function(g) {
    const r = this.dom, o = this._valueField, s = this._labelField, n = r.getAttribute("data-ln-value") || r.value, u = r.querySelectorAll("option");
    for (let f = u.length - 1; f >= 0; f--)
      u[f].value !== "" && r.removeChild(u[f]);
    for (let f = 0; f < g.length; f++) {
      const E = g[f], w = document.createElement("option");
      w.value = String(E[o]), w.textContent = E[s] != null ? E[s] : "", r.appendChild(w);
    }
    const h = r.options;
    for (let f = 0; f < h.length; f++)
      if (h[f].value === String(n)) {
        r.value = String(n);
        break;
      }
  }, p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, U(t, e, p, "ln-options", {
    attributes: i
  });
})();
function fo(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), l = t.slice(e + 1).trim();
  if (!i) return null;
  const p = {};
  return p[i] = [l], p;
}
function ho(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: K, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: K, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, l = Y(i);
  function p(g) {
    return this.dom = g, Q(this, g, l), this._onSetCount = function(r) {
      g.textContent = ho(r.detail && r.detail.count), g.classList.remove("is-loading");
    }, g.addEventListener("ln-stat:set-count", this._onSetCount), k(g, "ln-stat:request-count", {
      stat: this._storeName,
      filters: fo(this._filterRaw)
    }), this;
  }
  p.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, U(t, e, p, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", l = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  let g = null;
  const r = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), o = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), s = "lni:", n = "lni:v", u = "1";
  function h() {
    try {
      if (localStorage.getItem(n) !== u) {
        for (let b = localStorage.length - 1; b >= 0; b--) {
          const d = localStorage.key(b);
          d && d.indexOf(s) === 0 && localStorage.removeItem(d);
        }
        localStorage.setItem(n, u);
      }
    } catch {
    }
  }
  h();
  function f() {
    return g || (g = document.getElementById(t), g || (g = document.createElementNS("http://www.w3.org/2000/svg", "svg"), g.id = t, g.setAttribute("hidden", ""), g.setAttribute("aria-hidden", "true"), g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(g, document.body.firstChild))), g;
  }
  function E(b) {
    return b.indexOf(i) === 0 ? o + "/" + b.slice(i.length) + ".svg" : r + "/" + b.slice(e.length) + ".svg";
  }
  function w(b, d) {
    const c = d.match(/viewBox="([^"]+)"/), _ = c ? c[1] : "0 0 24 24", v = d.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), A = v ? v[1].trim() : "", S = d.match(/<svg([^>]*)>/i), T = S ? S[1] : "", x = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    x.id = b, x.setAttribute("viewBox", _), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(I) {
      const N = T.match(new RegExp(I + '="([^"]*)"'));
      N && x.setAttribute(I, N[1]);
    }), x.innerHTML = A, f().querySelector("defs").appendChild(x);
  }
  function m(b) {
    if (l.has(b) || p.has(b)) return;
    if (b.indexOf(i) === 0 && !o) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", b);
      return;
    }
    const d = b.slice(1);
    try {
      const _ = localStorage.getItem(s + d);
      if (_) {
        w(d, _), l.add(b);
        return;
      }
    } catch {
    }
    p.add(b);
    const c = E(b);
    fetch(c).then(function(_) {
      if (!_.ok) throw new Error(_.status);
      return _.text();
    }).then(function(_) {
      w(d, _), l.add(b), p.delete(b);
      try {
        localStorage.setItem(s + d, _);
      } catch {
      }
    }).catch(function(_) {
      console.error("[ln-icon] Fetch failed for:", d, _), p.delete(b);
    });
  }
  function y(b) {
    const d = 'use[href^="' + e + '"], use[href^="' + i + '"]', c = b.querySelectorAll ? b.querySelectorAll(d) : [];
    if (b.matches && b.matches(d)) {
      const _ = b.getAttribute("href");
      _ && m(_);
    }
    Array.prototype.forEach.call(c, function(_) {
      const v = _.getAttribute("href");
      v && m(v);
    });
  }
  function a() {
    y(document), new MutationObserver(function(b) {
      b.forEach(function(d) {
        if (d.type === "childList")
          d.addedNodes.forEach(function(c) {
            c.nodeType === 1 && y(c);
          });
        else if (d.type === "attributes" && d.attributeName === "href") {
          const c = d.target.getAttribute("href");
          c && (c.indexOf(e) === 0 || c.indexOf(i) === 0) && m(c);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : a();
})();
const He = /* @__PURE__ */ new Set([
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
function po(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let l = 0; l <= e.length; l++) i[l] = [l];
  for (let l = 0; l <= t.length; l++) i[0][l] = l;
  for (let l = 1; l <= e.length; l++)
    for (let p = 1; p <= t.length; p++)
      e.charAt(l - 1) === t.charAt(p - 1) ? i[l][p] = i[l - 1][p - 1] : i[l][p] = Math.min(
        i[l - 1][p - 1] + 1,
        i[l][p - 1] + 1,
        i[l - 1][p] + 1
      );
  return i[e.length][t.length];
}
function mo(t, e = He) {
  if (e.has(t)) return null;
  let i = null, l = 1 / 0;
  for (const g of e) {
    const r = po(t, g);
    r < l && (l = r, i = g);
  }
  const p = Math.max(3, Math.floor(t.length * 0.4));
  return l <= p ? i : null;
}
function gi(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function go(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const l = [], p = [i, ...i.querySelectorAll("*")];
  for (let g = 0; g < p.length; g++) {
    const r = p[g];
    if (r.attributes)
      for (let o = 0; o < r.attributes.length; o++) {
        const s = r.attributes[o];
        if (s.name.startsWith("data-ln-") && s.name.endsWith("-for")) {
          const n = (s.value || "").trim();
          if (!n) {
            l.push({
              type: "id-empty",
              element: r,
              attribute: s.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${r.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + gi(n)) || l.push({
            type: "id-unresolved",
            element: r,
            attribute: s.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${r.tagName.toLowerCase()} ${s.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return l;
}
function _o(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const l = [], p = [i, ...i.querySelectorAll("*")];
  for (let g = 0; g < p.length; g++) {
    const r = p[g];
    if (r.attributes)
      for (let o = 0; o < r.attributes.length; o++) {
        const s = r.attributes[o];
        if (s.name.startsWith("data-ln-") && (s.name.endsWith("-source") || s.name.endsWith("-store")) && s.name !== "data-ln-data-store") {
          const u = (s.value || "").trim();
          if (!u) {
            l.push({
              type: "store-empty",
              element: r,
              attribute: s.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${r.tagName.toLowerCase()} ${s.name}="">.`
            });
            continue;
          }
          const h = gi(u), f = e.querySelector(`[data-ln-data-store="${h}"], [data-ln-store="${h}"]`), E = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(u);
          !f && !E && l.push({
            type: "store-unresolved",
            element: r,
            attribute: s.name,
            storeName: u,
            message: `[ln-debug] Unresolved store reference: <${r.tagName.toLowerCase()} ${s.name}="${u}"> targets store "${u}", but no [data-ln-data-store="${u}"] exists in the document.`
          });
        }
      }
  }
  return l;
}
function bo(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], l = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && l.unshift(e);
  const p = /* @__PURE__ */ new Map();
  for (let g = 0; g < l.length; g++) {
    const r = l[g], o = (r.getAttribute("data-ln-data-store") || "").trim();
    o && (p.has(o) || p.set(o, []), p.get(o).push(r));
  }
  for (const [g, r] of p.entries())
    r.length > 1 && i.push({
      type: "store-duplicate",
      storeName: g,
      elements: r,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${g}". Store names must be unique across the document.`
    });
  return i;
}
function yo(t = document, e = He) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const l = [], p = [i, ...i.querySelectorAll("*")];
  for (let g = 0; g < p.length; g++) {
    const r = p[g];
    if (r.attributes)
      for (let o = 0; o < r.attributes.length; o++) {
        const s = r.attributes[o];
        if (s.name.startsWith("data-ln-") && !e.has(s.name)) {
          const n = mo(s.name, e), u = n ? ` Did you mean "${n}"?` : "";
          l.push({
            type: "attribute-unknown",
            element: r,
            attribute: s.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${s.name}" on <${r.tagName.toLowerCase()}>.${u}`
          });
        }
      }
  }
  return l;
}
function Te(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || He, l = go(t), p = _o(t), g = bo(t), r = yo(t, i), o = [
    ...l,
    ...p,
    ...g,
    ...r
  ];
  if (!e.silent)
    for (let s = 0; s < o.length; s++)
      console.warn(o[s].message);
  return {
    idIssues: l,
    storeIssues: p,
    uniquenessIssues: g,
    spellingIssues: r,
    total: o.length
  };
}
let Kt = null;
function ne(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Kt && (clearTimeout(Kt), Kt = null);
  function l() {
    Kt = setTimeout(() => {
      Kt = null;
      const p = Te(t);
      i && i(p);
    }, e);
  }
  xn() > 0 ? At(l) : l();
}
function vo(t, e, i, l) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", l), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", l.oldValue, "→", l.newValue), console.groupEnd());
}
let Ot = [];
function wo() {
  Ot = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && Ot.push(document.body);
}
function _i(t) {
  if (t === window || t === document)
    return Ot.indexOf(document.body) !== -1;
  for (let e = 0; e < Ot.length; e++)
    if (Ot[e].contains(t)) return !0;
  return !1;
}
function Eo(t, e, i, l) {
  _i(i) && vo(t, e, i, l);
}
function ke() {
  wo(), Di(Ot.length > 0 ? Eo : null, Ot.length > 0 ? _i : null);
}
function pn() {
  ke();
}
function Ao() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, ft(function() {
    ke(), Xt(["data-ln-debug"], ke);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  Ao();
  function l(g) {
    return this.dom = g, ne(g.ownerDocument || document), pn(), this;
  }
  l.prototype.verify = function(g, r) {
    return Te(g || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, l.prototype.destroy = function() {
    delete this.dom[e], pn();
  };
  const p = U(t, e, l, "ln-debug", {
    attributes: i,
    onInit: function(g) {
      typeof document < "u" && ne(g && g.ownerDocument ? g.ownerDocument : document);
    },
    onSubtreeChange: function(g) {
      typeof document < "u" && ne(g && g.ownerDocument ? g.ownerDocument : document);
    }
  });
  p.verify = function(g, r) {
    return Te(g || document, r);
  }, p.schedule = function(g, r, o) {
    return ne(g || document, r, o);
  };
})();
