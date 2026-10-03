function fn() {
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
      let l = null;
      for (let f = 1; f < e.length; f++)
        if (e[f] && e[f].nodeType === 1) {
          l = e[f];
          break;
        }
      if (!ke(l))
        return;
    }
    t.apply(console, e);
  };
}
function Si(t, e) {
  window.lnCore = window.lnCore || {}, window.lnCore._debugSink = t, window.lnCore._debugIsContained = e || null;
}
function Ci(t) {
  window.lnCore = window.lnCore || {}, window.lnCore._persistSink = t;
}
function L(t, e, i) {
  const l = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l), t.dispatchEvent(new CustomEvent(e, {
    bubbles: !0,
    detail: l
  }));
}
function Z(t, e, i) {
  const l = i || {};
  window.lnCore._debugSink && window.lnCore._debugSink("event", e, t, l);
  const f = new CustomEvent(e, {
    bubbles: !0,
    cancelable: !0,
    detail: l
  });
  return t.dispatchEvent(f), f;
}
function hn(t, e, i) {
  t._applyFilterAndSort(), t._vStart = -1, t._vEnd = -1, t._render(), t._updateFooter();
  const l = {
    sort: t.currentSort,
    filters: t.currentFilters,
    search: t.currentSearch
  };
  l[i] = t.name, L(t.dom, e, l);
}
function pt(t, e) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", function() {
      pt(t, e);
    }), console.warn("[" + e + '] Script loaded before <body> — add "defer" to your <script> tag');
    return;
  }
  t();
}
function zt(t) {
  return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
}
function Le(t) {
  return !!(!t || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || typeof t.button == "number" && t.button !== 0);
}
function Ti(t) {
  if (!t) return !1;
  if (typeof t.closest == "function")
    return !!t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
  const e = String(t.tagName || "").toLowerCase();
  return e === "input" || e === "textarea" || e === "select" || !!t.isContentEditable;
}
function qe(t) {
  return !!(!t || t.disabled || typeof t.getAttribute == "function" && t.getAttribute("aria-disabled") === "true" || typeof t.closest == "function" && t.closest("[inert]"));
}
function ki(t, e) {
  return !t || !document.contains(t) || qe(t) || e && typeof t[e] != "function" ? !1 : zt(t);
}
function pn(t, e) {
  if (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0 || !e) return !1;
  const i = e.getAttribute("href");
  return !(!i || e.getAttribute("target") === "_blank" || e.hasAttribute("download") || i.startsWith("mailto:") || i.startsWith("tel:") || i === "#" || i.startsWith("#") || e.hostname && e.hostname !== window.location.hostname);
}
function yt(t) {
  return t.hasAttribute("data-ln-value") ? t.getAttribute("data-ln-value") : t.tagName === "TIME" && t.hasAttribute("datetime") ? t.getAttribute("datetime") : t.tagName === "DATA" && t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
}
function Li(t) {
  const e = t.querySelector('input[name="_method"]');
  return ((e && e.value !== "" ? e.value : t.method) || "").toUpperCase();
}
function mn(t, e) {
  const i = !!(e && e.typed), l = e && e.exclude, f = {}, h = t.elements, r = {};
  if (i)
    for (let s = 0; s < h.length; s++) {
      const a = h[s];
      a.name && a.type === "checkbox" && !a.disabled && (r[a.name] = (r[a.name] || 0) + 1);
    }
  for (let s = 0; s < h.length; s++) {
    const a = h[s];
    if (!(!a.name || a.disabled || a.type === "file" || a.type === "submit" || a.type === "button") && !(l && a.matches && a.matches(l)))
      if (a.type === "checkbox")
        i && r[a.name] === 1 ? f[a.name] = a.checked : (f[a.name] || (f[a.name] = []), a.checked && f[a.name].push(a.value));
      else if (a.type === "radio")
        a.checked && (f[a.name] = a.value);
      else if (a.type === "select-multiple") {
        f[a.name] = [];
        for (let n = 0; n < a.options.length; n++)
          a.options[n].selected && f[a.name].push(a.options[n].value);
      } else if (i && a.type === "hidden")
        f[a.name] = a.value;
      else if (i && (a.type === "number" || a.type === "range")) {
        const n = Number(a.value);
        f[a.name] = a.value === "" || isNaN(n) ? null : n;
      } else
        f[a.name] = a.value;
  }
  return f;
}
function qi(t) {
  if (typeof t != "string") return !!t;
  const e = t.trim().toLowerCase();
  return e !== "false" && e !== "0" && e !== "" && e !== "off" && e !== "no";
}
function gn(t, e) {
  const i = t.elements, l = [], f = {};
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    r.name && r.type === "checkbox" && (f[r.name] = (f[r.name] || 0) + 1);
  }
  for (let h = 0; h < i.length; h++) {
    const r = i[h];
    if (r.type === "file" || r.type === "submit" || r.type === "button") continue;
    const s = r.getAttribute("data-ln-fill-as") || r.name;
    if (!s || !(s in e)) continue;
    const a = e[s];
    if (r.type === "checkbox") {
      if (Array.isArray(a))
        r.checked = a.indexOf(r.value) !== -1;
      else if (f[r.name] > 1) {
        const n = String(a).split(",").map(function(o) {
          return o.trim();
        });
        r.checked = n.indexOf(r.value) !== -1;
      } else
        r.checked = qi(a);
      l.push(r);
    } else if (r.type === "radio")
      r.checked = r.value === String(a), l.push(r);
    else if (r.type === "select-multiple") {
      if (Array.isArray(a))
        for (let n = 0; n < r.options.length; n++)
          r.options[n].selected = a.indexOf(r.options[n].value) !== -1;
      l.push(r);
    } else
      r.value = a, l.push(r);
  }
  return l;
}
function _n(t, e, { get: i, set: l }) {
  Object.defineProperty(t, "value", {
    get: function() {
      return i ? i.call(this) : e.get.call(this);
    },
    set: function(f) {
      l ? l.call(this, f, (h) => e.set.call(this, h)) : e.set.call(this, f);
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
function bn(t, e = "ln-core") {
  try {
    return t ? JSON.parse(t) : {};
  } catch (i) {
    return console.error(`[${e}] Invalid headers JSON:`, i), {};
  }
}
const yn = {};
function xi(t, e) {
  yn[t] = e;
}
function Ii(t) {
  return yn[t] || { ingress: (e) => e, egress: (e) => e };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerDataMapper = xi, window.lnCore.getDataMapper = Ii);
function it(t) {
  const e = t ? t.closest("[lang]") : null, i = (e ? e.getAttribute("lang") || e.lang : null) || (typeof document < "u" && document.documentElement ? document.documentElement.getAttribute("lang") || document.documentElement.lang : null) || (typeof navigator < "u" ? navigator.language : null);
  return i ? i.trim() : "en-US";
}
function re() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._localeObserverBound && (window.lnCore._localeObserverBound = !0, pt(function() {
    new MutationObserver(function() {
      L(document, "ln-core:locale-change", {});
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"],
      subtree: !0
    });
  }, "ln-core")));
}
const vn = {};
function wn(t, e) {
  if (!t || typeof e != "object") return;
  const i = t.toLowerCase().split("-")[0];
  vn[i] = e;
}
function Lt(t) {
  if (!t) return null;
  const e = t.toLowerCase().split("-")[0];
  return vn[e] || null;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.registerLocaleFallback = wn, window.lnCore.getLocaleFallback = Lt, window.lnCore.ensureLocaleObserver = re);
const ce = {};
function te(t, e) {
  ce[t] || (ce[t] = document.querySelector('[data-ln-template="' + t + '"]'));
  const i = ce[t];
  return i ? i.content.cloneNode(!0) : (console.warn("[" + (e || "ln-core") + '] Template "' + t + '" not found'), null);
}
function Ct(t, e, i) {
  if (t) {
    const l = t.querySelector('[data-ln-template="' + e + '"]');
    if (l) return l.content.cloneNode(!0);
  }
  return te(e, i);
}
function ht(t, e) {
  if (!t || !e) return t;
  const i = t.querySelectorAll("[data-ln-field]");
  for (let r = 0; r < i.length; r++) {
    const s = i[r], a = s.getAttribute("data-ln-field");
    e[a] != null && (s.textContent = e[a]);
  }
  const l = t.querySelectorAll("[data-ln-attr]");
  for (let r = 0; r < l.length; r++) {
    const s = l[r], a = s.getAttribute("data-ln-attr").split(",");
    for (let n = 0; n < a.length; n++) {
      const o = a[n].trim().split(":");
      if (o.length !== 2) continue;
      const c = o[0].trim(), u = o[1].trim();
      e[u] != null && s.setAttribute(c, e[u]);
    }
  }
  const f = t.querySelectorAll("[data-ln-show]");
  for (let r = 0; r < f.length; r++) {
    const s = f[r], a = s.getAttribute("data-ln-show");
    a in e && s.classList.toggle("hidden", !e[a]);
  }
  const h = t.querySelectorAll("[data-ln-class]");
  for (let r = 0; r < h.length; r++) {
    const s = h[r], a = s.getAttribute("data-ln-class").split(",");
    for (let n = 0; n < a.length; n++) {
      const o = a[n].trim().split(":");
      if (o.length !== 2) continue;
      const c = o[0].trim(), u = o[1].trim();
      u in e && s.classList.toggle(c, !!e[u]);
    }
  }
  return t;
}
function Di(t, e) {
  t.matches && t.matches("[data-ln-form], [data-ln-fillable]") && (window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", t, e ?? null), t.dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 })));
  const i = t.querySelectorAll("[data-ln-form], [data-ln-fillable]");
  for (let l = 0; l < i.length; l++)
    window.lnCore._debugSink && window.lnCore._debugSink("event", "ln-fill", i[l], e ?? null), i[l].dispatchEvent(new CustomEvent("ln-fill", { detail: e ?? null, bubbles: !0 }));
  return t;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._fillBound || (window.lnCore._fillBound = !0, document.addEventListener("ln-fill", function(t) {
  if (!(!t.target.matches || !t.target.matches("[data-ln-fillable]")))
    if (t.detail)
      ht(t.target, t.detail);
    else {
      const e = t.target.querySelectorAll("[data-ln-field]");
      for (let i = 0; i < e.length; i++)
        e[i].textContent = "";
    }
})));
function Gt(t, e) {
  if (!t || !e) return t;
  const i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (; i.nextNode(); ) {
    const h = i.currentNode;
    h.textContent.indexOf("{{") !== -1 && (h.textContent = h.textContent.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      function(r, s) {
        return e[s] !== void 0 ? e[s] : "";
      }
    ));
  }
  const l = function(h, r) {
    return e[r] !== void 0 ? e[r] : "";
  }, f = Array.from(t.querySelectorAll("*"));
  t.nodeType === 1 && f.push(t);
  for (let h = 0; h < f.length; h++) {
    const r = f[h], s = r.attributes;
    for (let a = 0; a < s.length; a++) {
      const n = s[a];
      n.value.indexOf("{{") !== -1 && r.setAttribute(n.name, n.value.replace(/\{\{\s*(\w+)\s*\}\}/g, l));
    }
  }
  return t;
}
function Ri(t, e, i, l, f, h) {
  const r = {};
  for (let a = 0; a < t.children.length; a++) {
    const n = t.children[a], o = n.getAttribute("data-ln-render-key");
    o && (r[o] = n);
  }
  const s = document.createDocumentFragment();
  for (let a = 0; a < e.length; a++) {
    const n = e[a], o = String(l(n));
    let c = r[o];
    if (c)
      f(c, n, a);
    else {
      const u = te(i, h);
      if (!u || (Gt(u, n), c = u.firstElementChild, !c)) continue;
      c.setAttribute("data-ln-render-key", o), f(c, n, a);
    }
    s.appendChild(c);
  }
  t.textContent = "", t.appendChild(s);
}
function xe(t, e) {
  const i = {}, l = t.querySelectorAll("[" + e + "]");
  for (let f = 0; f < l.length; f++)
    i[l[f].getAttribute(e)] = l[f].textContent, l[f].remove();
  return i;
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.fillTemplate = Gt, window.lnCore.fill = ht, window.lnCore.lnFill = Di, window.lnCore.renderList = Ri);
function $(t, e, i) {
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
  const f = l.trim().toLowerCase();
  return !(f === "false" || f === "0");
}
function En(t, e) {
  return (t.getAttribute(e) || "").split(",").map((i) => i.trim()).filter(Boolean);
}
const de = /* @__PURE__ */ new Map();
function Oi(t, e) {
  const i = (t ? t.join("|") : "") + "::" + e;
  if (de.has(i)) return de.get(i);
  const l = new Set(t || []), f = function(h, r) {
    const s = h.getAttribute(r);
    return s !== null && l.has(s) ? s : e;
  };
  return de.set(i, f), f;
}
function Ni(t, e, i) {
  const l = parseFloat(t.getAttribute(e));
  return isNaN(l) ? i : l;
}
function Mi(t, e, i) {
  const l = t.getAttribute(e);
  if (!l) return i;
  try {
    return JSON.parse(l);
  } catch {
    return i;
  }
}
function An(t, e, i, l, f) {
  if (!t || e === null) return !0;
  const h = l || "ln-component", r = t.type;
  if (r === "trigger" || r === "marker" || r === "string" || r === "list" || !r || e === "" && t.fallback !== void 0)
    return !0;
  const s = (a) => {
    f ? console.warn(a, f) : console.warn(a);
  };
  if (r === "boolean") {
    const a = e.trim().toLowerCase();
    return a !== "" && a !== "true" && a !== "false" && a !== "1" && a !== "0" ? (s(`[${h}] Invalid value "${e}" for boolean attribute "${i}". Allowed: "true", "false", or presence-only.`), !1) : !0;
  }
  if (r === "enum") {
    const a = t.values || [];
    return a.includes(e) ? !0 : (s(`[${h}] Invalid value "${e}" for attribute "${i}". Allowed: ${a.join(", ")}. Fallback: "${t.fallback}".`), !1);
  }
  if (r === "integer") {
    if (!/^-?\d+$/.test(e))
      return s(`[${h}] Invalid integer "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1;
    const a = parseInt(e, 10);
    return t.min !== void 0 && a < t.min ? (s(`[${h}] Value ${a} for attribute "${i}" is less than min (${t.min}).`), !1) : t.max !== void 0 && a > t.max ? (s(`[${h}] Value ${a} for attribute "${i}" is greater than max (${t.max}).`), !1) : !0;
  }
  if (r === "float")
    return isNaN(Number(e)) ? (s(`[${h}] Invalid float "${e}" for attribute "${i}". Fallback: ${t.fallback}.`), !1) : !0;
  if (r === "json")
    try {
      return JSON.parse(e), !0;
    } catch (a) {
      return s(`[${h}] Invalid JSON for attribute "${i}": ${a.message}. Fallback: ${t.fallback}.`), !1;
    }
  return !0;
}
function tt(t, e, i) {
  for (const l in i) {
    const [f, h, r] = i[l];
    Object.defineProperty(t, l, {
      // Getter only, no setter — assignment throws in strict mode (ES
      // modules are strict). Deliberate: it forbids a drifting copy.
      get: function() {
        return f(e, h, r);
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
    const l = t[i];
    if (!l || !l.prop) continue;
    let f = l.read;
    if (!f && l.type)
      switch (l.type) {
        case "enum":
          f = Oi(l.values, l.fallback);
          break;
        case "integer":
          f = xt;
          break;
        case "float":
          f = Ni;
          break;
        case "boolean":
          f = It;
          break;
        case "list":
          f = En;
          break;
        case "json":
          f = Mi;
          break;
        case "string":
        default:
          f = $;
          break;
      }
    f || (f = $), e[l.prop] = [f, i, l.fallback];
  }
  return e;
}
function Fi(t) {
  const e = {};
  for (const i in t) {
    const l = t[i];
    l && l.effect && (e[i] = l.effect);
  }
  return Object.keys(e).length ? e : null;
}
function Pi(t) {
  if (t.onAttrChange && !t.declared) return null;
  const e = /* @__PURE__ */ new Set();
  if (t.effects) for (const i in t.effects) e.add(i);
  if (t.onAttrChange && t.declared) for (const i of t.declared) e.add(i);
  return e;
}
function Ie(t, e, i, l) {
  if (t.nodeType !== 1) return;
  const h = e.indexOf("[") !== -1 || e.indexOf(".") !== -1 || e.indexOf("#") !== -1 ? e : "[" + e + "]", r = Array.from(t.querySelectorAll(h));
  t.matches && t.matches(h) && r.push(t);
  for (const s of r)
    if (!s[i]) {
      window.lnCore._persistSink && s.hasAttribute("data-ln-persist") && window.lnCore._persistSink(s, e);
      try {
        s[i] = new l(s);
      } catch (a) {
        console.error("[" + i + "] init failed", s, a);
      }
    }
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || []);
function Bi() {
  typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1);
}
function ue() {
  if (typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1), window.lnCore._bootHolds === 0 && window.lnCore._bootQueue)) {
    const t = window.lnCore._bootQueue;
    window.lnCore._bootQueue = [];
    for (let e = 0; e < t.length; e++)
      t[e]();
  }
}
function Sn() {
  return typeof window < "u" && window.lnCore && window.lnCore._bootHolds || 0;
}
function vt(t) {
  typeof window < "u" ? (window.lnCore = window.lnCore || {}, window.lnCore._bootHolds = window.lnCore._bootHolds || 0, window.lnCore._bootQueue = window.lnCore._bootQueue || [], window.lnCore._bootHolds > 0 ? window.lnCore._bootQueue.push(t) : setTimeout(t, 0)) : t();
}
function Cn() {
  window.lnCore = window.lnCore || {};
  const t = window.lnCore._attrRegistry = window.lnCore._attrRegistry || { byAttr: /* @__PURE__ */ new Map(), reactive: [], persist: [] };
  return t.byReactive = t.byReactive || /* @__PURE__ */ new Map(), t.reactiveWildcard = t.reactiveWildcard || [], t;
}
function Tn(t) {
  const e = Cn(), i = t.observed || [];
  for (let l = 0; l < i.length; l++) {
    const f = i[l];
    e.byAttr.has(f) || e.byAttr.set(f, []), e.byAttr.get(f).push(t);
  }
  if (e.byDeclaredAttr = e.byDeclaredAttr || /* @__PURE__ */ new Map(), t.attributes)
    for (const l in t.attributes) {
      e.byDeclaredAttr.has(l) || e.byDeclaredAttr.set(l, []);
      const f = e.byDeclaredAttr.get(l);
      f.some((h) => h.componentTag === t.componentTag) || f.push({
        spec: t.attributes[l],
        componentTag: t.componentTag
      });
    }
  if (t.onAttrChange || t.effects) {
    e.reactive.push(t);
    const l = Pi(t);
    if (l === null)
      e.reactiveWildcard.push(t);
    else
      for (const f of l)
        e.byReactive.has(f) || e.byReactive.set(f, []), e.byReactive.get(f).push(t);
  }
  t.persist && e.persist.push(t);
}
function ze(t, e, i, l) {
  for (let f = 0; f < t.length; f++) {
    const h = t[f];
    if (!e[h.attribute]) continue;
    const r = h.effects && h.effects[i];
    r ? r(e, i, l) : h.onAttrChange && (!h.declared || h.declared.has(i)) && h.onAttrChange(e, i, l);
  }
}
function Ui(t) {
  const e = t.target, i = t.attributeName;
  if (t.oldValue === e.getAttribute(i)) return;
  const l = Cn(), f = l.byAttr.get(i);
  if (fn() && l.byDeclaredAttr && l.byDeclaredAttr.has(i) && ke(e)) {
    const h = l.byDeclaredAttr.get(i), r = e.getAttribute(i);
    for (let s = 0; s < h.length; s++)
      An(h[s].spec, r, i, h[s].componentTag, e);
  }
  if (window.lnCore._debugSink && (i.indexOf("data-ln-") === 0 || f) && window.lnCore._debugSink("attr", i, e, { oldValue: t.oldValue, newValue: e.getAttribute(i) }), i.indexOf("data-ln-") === 0) {
    const h = l.byReactive.get(i);
    h && ze(h, e, i, t.oldValue), l.reactiveWildcard.length && ze(l.reactiveWildcard, e, i, t.oldValue);
  }
  if (f)
    for (let h = 0; h < f.length; h++) {
      const r = f[h];
      if (r.handler) {
        r.handler(e, i, t.oldValue);
        continue;
      }
      r.onAttributeChange && e[r.attribute] ? r.onAttributeChange(e, i) : (Ie(e, r.selector, r.attribute, r.ComponentFn), r.onInit && r.onInit(e));
    }
}
function kn() {
  window.lnCore = window.lnCore || {}, !window.lnCore._attrObserverBound && (window.lnCore._attrObserverBound = !0, pt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++)
        try {
          Ui(e[i]);
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
function Ln() {
  return window.lnCore = window.lnCore || {}, window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
}
function Hi(t) {
  const e = Ln();
  if (e.length) {
    if (t.target)
      for (let i = 0; i < e.length; i++) {
        const l = e[i];
        if (l.onSubtreeChange) {
          const f = l.query, h = t.target.nodeType === 1 ? t.target.matches(f) ? t.target : t.target.closest(f) : t.target.parentElement ? t.target.parentElement.closest(f) : null;
          h && l.onSubtreeChange(h, t);
        }
      }
    for (let i = 0; i < t.addedNodes.length; i++) {
      const l = t.addedNodes[i];
      if (l.nodeType === 1)
        for (let f = 0; f < e.length; f++) {
          const h = e[f];
          Ie(l, h.selector, h.attribute, h.ComponentFn), h.onInit && h.onInit(l);
        }
    }
    for (let i = 0; i < t.removedNodes.length; i++) {
      const l = t.removedNodes[i];
      if (l.nodeType === 1)
        for (let f = 0; f < e.length; f++) {
          const h = e[f], r = h.query, s = Array.from(l.querySelectorAll(r));
          l.matches && l.matches(r) && s.push(l);
          for (let a = 0; a < s.length; a++) {
            const n = s[a];
            if (!document.contains(n)) {
              const o = n[h.attribute];
              if (o && typeof o.destroy == "function")
                try {
                  o.destroy();
                } catch (c) {
                  console.error("[" + h.attribute + "] destroy failed", n, c);
                }
              delete n[h.attribute];
            }
          }
        }
    }
  }
}
function zi() {
  window.lnCore = window.lnCore || {}, !window.lnCore._lifecycleObserverBound && (window.lnCore._lifecycleObserverBound = !0, pt(function() {
    new MutationObserver(function(e) {
      for (let i = 0; i < e.length; i++) {
        const l = e[i];
        if (l.type === "childList")
          try {
            Hi(l);
          } catch (f) {
            console.error("[ln-core] lifecycle handler failed", l.target, f);
          }
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }, "ln-core"));
}
function $t(t, e) {
  Tn({ observed: t, handler: e }), kn();
}
function j(t, e, i, l, f = {}) {
  const h = f.extraAttributes || [], r = f.onAttributeChange || null, s = f.onSubtreeChange || null, a = f.onInit || null, n = f.onAttrChange || null, o = f.effects || null, c = f.attributes || null, u = c ? Fi(c) : o, w = c ? new Set(Object.keys(c)) : null, y = f.persist || null;
  function E(d) {
    const _ = d || document.body;
    if (Ie(_, t, e, i), c && fn())
      for (const b in c) {
        const T = c[b], g = Array.from(_.querySelectorAll("[" + b + "]"));
        _.matches && _.matches("[" + b + "]") && g.push(_);
        for (let S = 0; S < g.length; S++) {
          const C = g[S];
          ke(C) && An(T, C.getAttribute(b), b, l, C);
        }
      }
    a && a(_);
  }
  const A = [];
  if (t.indexOf("[") !== -1) {
    const d = /\[([\w-]+)/g;
    let _;
    for (; (_ = d.exec(t)) !== null; )
      A.push(_[1]);
  } else
    A.push(t);
  Tn({
    selector: t,
    attribute: e,
    componentTag: l,
    attributes: c,
    ComponentFn: i,
    onInit: a,
    observed: A.concat(h),
    onAttributeChange: r,
    onAttrChange: n,
    effects: u,
    declared: w,
    persist: y
  }), kn();
  const v = t.indexOf("[") !== -1 || t.indexOf(".") !== -1 || t.indexOf("#") !== -1 ? t : "[" + t + "]";
  Ln().push({
    selector: t,
    attribute: e,
    ComponentFn: i,
    onInit: a,
    onSubtreeChange: s,
    query: v
  }), zi(), window[e] = E;
  function p() {
    Sn() > 0 ? vt(function() {
      E(document.body);
    }) : E(document.body);
  }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p) : p(), E;
}
function De(t) {
  let e = !1;
  for (let i = 0; i < t.length; i++) {
    const l = t[i];
    if (!(l === "" || l == null) && (e = !0, !Number.isFinite(Number(l))))
      return "string";
  }
  return e ? "number" : "string";
}
function Re(t, e, i, l) {
  if (i === "number") {
    const r = parseFloat(t), s = parseFloat(e);
    return (isNaN(r) ? 0 : r) - (isNaN(s) ? 0 : s);
  }
  const f = t != null ? String(t) : "", h = e != null ? String(e) : "";
  return l ? l.compare(f, h) : f < h ? -1 : f > h ? 1 : 0;
}
function oe(t, e) {
  let i = !1;
  return function() {
    i || (i = !0, queueMicrotask(function() {
      i = !1, t();
    }));
  };
}
function qn(t) {
  t = t || {};
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, l = t.threshold != null ? t.threshold : 25, f = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const h = typeof t.requestPage == "function" ? t.requestPage : function() {
  }, r = typeof t.onChange == "function" ? t.onChange : function() {
  }, s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let o = 0, c = 0, u = 0, w = { sort: null, filters: {}, search: "" }, y = null, E = 0, A = 0, m = !1;
  function v(b) {
    a.set(b, ++E);
  }
  function p() {
    return !!(w && (w.search || w.filters && Object.keys(w.filters).length));
  }
  function d() {
    if (s.size <= e) return;
    const b = Array.from(s.keys()).sort(function(g, S) {
      return (a.get(g) || 0) - (a.get(S) || 0);
    });
    let T = 0;
    for (; s.size > e && T < b.length; )
      s.delete(b[T]), a.delete(b[T]), T++;
  }
  function _(b, T) {
    n.add(b), h(w, b, T);
  }
  return {
    get: function(b) {
      return s.get(b);
    },
    has: function(b) {
      return s.has(b);
    },
    peek: function() {
      return s.size ? s.values().next().value : void 0;
    },
    get logicalTotal() {
      return o;
    },
    get grandTotal() {
      return c;
    },
    get queryGen() {
      return u;
    },
    get size() {
      return s.size;
    },
    // Render client hands its visible logical range; stamps in-range resident
    // rows as freshly used, then checks if any page in range (padded by threshold)
    // is missing from cache and needs to be fetched (page-aligned).
    ensure: function(b, T) {
      clearTimeout(y), A = b;
      for (let I = b; I < T; I++)
        s.has(I) && v(I);
      if (o <= 0) return;
      const g = Math.max(0, b - l), S = Math.min(o, T + l), C = Math.floor(g / i), q = Math.floor(Math.max(0, S - 1) / i);
      let D = -1;
      for (let I = C; I <= q; I++) {
        const R = I * i, O = Math.min(i, o - R);
        let P = !1;
        const B = Math.max(R, g), H = Math.min(R + O, S);
        for (let z = B; z < H; z++)
          if (!s.has(z)) {
            P = !0;
            break;
          }
        if (P && !n.has(R)) {
          D = R;
          break;
        }
      }
      D !== -1 && (y = setTimeout(function() {
        _(D, i);
      }, f));
    },
    // Splice a fetched page. Stale (superseded-query) responses are dropped.
    // Out-of-order pages splice at their own offset, so order is irrelevant.
    // Returns whether the page counted as an answer — the render client keys
    // its loading affordance off that.
    ingest: function(b) {
      if (b = b || {}, b.queryGen != null && b.queryGen !== u) return !1;
      const T = b.offset || 0, g = b.data || [];
      let S = 0;
      for (let C = 0; C < g.length; C++)
        g[C] != null && S++;
      if (S === 0 && (b.provisional || b.filtered > 0))
        return n.delete(T), !1;
      m && (s.clear(), a.clear(), m = !1), b.provisional || (c = b.total != null ? b.total : c, o = b.filtered != null ? b.filtered : b.data ? b.data.length : o);
      for (let C = 0; C < g.length; C++)
        g[C] != null && (s.set(T + C, g[C]), v(T + C));
      return n.delete(T), d(), r(), !0;
    },
    // First load: fetch page 0 at the current generation (no bump).
    requestInitial: function(b) {
      b && (w = b), _(0, i);
    },
    // Query change: new generation, stale rows stay visible until the first
    // response of the new generation lands in ingest() — no blanking, no
    // placeholder flash (ln-table--loading is the refresh affordance).
    invalidate: function(b) {
      u++, n.clear(), clearTimeout(y), b && (w = b), m = !0, _(0, i);
    },
    // Post-mutation refresh of a windowed view: same stale-while-revalidate
    // swap as invalidate(), but re-requests the page at the CURRENT scroll
    // position instead of jumping back to page 0.
    revalidate: function() {
      u++, n.clear(), clearTimeout(y), m = !0;
      const b = Math.max(0, Math.floor(A / i) * i);
      _(b, i);
    },
    // Failed page fetch: release the offset so the next ensure() (scroll,
    // filter, resize) can re-request it. No onChange(), no auto-retry.
    release: function(b) {
      n.delete(b);
    },
    destroy: function() {
      clearTimeout(y), s.clear(), a.clear(), n.clear();
    },
    configure: function(b) {
      b = b || {};
      let T = !1;
      if (b.windowSize != null && b.windowSize > 0 && b.windowSize !== e) {
        const g = b.windowSize < e;
        e = b.windowSize, g && d(), T = !0;
      }
      b.pageSize != null && b.pageSize > 0 && (i = b.pageSize), b.threshold != null && b.threshold >= 0 && (l = b.threshold), b.fetchDebounce != null && b.fetchDebounce >= 0 && (f = b.fetchDebounce), T && r();
    },
    setGrandTotal: function(b) {
      b == null || isNaN(b) || b < 0 || (c = b, p() || (o = b), r());
    }
  };
}
function xn(t) {
  return (t || "").replace(/^#/, "");
}
function Wt(t) {
  const e = t === void 0 ? location.hash : t, i = {}, l = xn(e);
  if (!l) return i;
  const f = l.split("&");
  for (let h = 0; h < f.length; h++) {
    const r = f[h];
    if (!r) continue;
    const s = r.indexOf(":"), a = s > -1 ? r.slice(0, s) : r, n = s > -1 ? r.slice(s + 1) : "";
    if (a)
      try {
        i[a] = decodeURIComponent(n);
      } catch {
        i[a] = n;
      }
  }
  return i;
}
function ct(t) {
  if (!t) return null;
  const e = Wt();
  return t in e ? e[t] : null;
}
function mt(t, e) {
  if (!t) return;
  const i = Wt();
  e == null ? delete i[t] : i[t] = String(e);
  const f = Object.keys(i).map(function(h) {
    const r = i[h];
    return r === "" ? h : h + ":" + encodeURIComponent(r);
  }).join("&");
  xn(location.hash) !== f && (location.hash = f);
}
function Oe(t) {
  return t.button === 1 || t.ctrlKey || t.metaKey || t.shiftKey ? !1 : (t.preventDefault(), !0);
}
function wt(t, e) {
  if (!t || !t.hasAttribute("data-ln-hash")) return null;
  const i = t.getAttribute("data-ln-hash");
  if (i && i.trim() !== "") return i.trim();
  const l = t.getAttribute("data-ln-sort") || t.getAttribute("data-ln-search-for") || t.getAttribute("data-ln-search") || t.getAttribute("data-ln-filter") || t.id;
  return l ? e ? l + "-" + e : l : e || null;
}
function In(t, e) {
  return !e || e === "none" || t === null || t === void 0 ? null : String(t) + "." + e;
}
function _e(t) {
  return !t || typeof t != "string" ? null : t.endsWith(".asc") ? { fieldOrColumn: t.slice(0, -4), direction: "asc" } : t.endsWith(".desc") ? { fieldOrColumn: t.slice(0, -5), direction: "desc" } : null;
}
function Dn(t, e) {
  return !t || !Array.isArray(e) || e.length === 0 ? null : t + ":" + e.map(encodeURIComponent).join(",");
}
function be(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e), l = t.slice(e + 1), f = l ? l.split(",").map(function(h) {
    try {
      return decodeURIComponent(h);
    } catch {
      return h;
    }
  }).filter(Boolean) : [];
  return { key: i, values: f };
}
typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.hashParse = Wt, window.lnCore.hashGet = ct, window.lnCore.hashSet = mt, window.lnCore.hashLinkClick = Oe, window.lnCore.resolveHashNamespace = wt, window.lnCore.hashSortEncode = In, window.lnCore.hashSortDecode = _e, window.lnCore.hashFilterEncode = Dn, window.lnCore.hashFilterDecode = be);
function ee(t, e, i, l) {
  const f = typeof l == "number" ? l : 4, h = window.innerWidth, r = window.innerHeight, s = e.width, a = e.height, n = (i || "bottom").split("-"), o = n[0], c = n[1] === "start" || n[1] === "end" ? n[1] : "center", u = {
    top: ["top", "bottom", "right", "left"],
    bottom: ["bottom", "top", "right", "left"],
    left: ["left", "right", "top", "bottom"],
    right: ["right", "left", "top", "bottom"]
  }, w = u[o] || u.bottom;
  function y(p) {
    return p === "top" || p === "bottom" ? c === "start" ? t.left : c === "end" ? t.right - s : t.left + (t.width - s) / 2 : c === "start" ? t.top : c === "end" ? t.bottom - a : t.top + (t.height - a) / 2;
  }
  function E(p) {
    let d, _, b = !0;
    return p === "top" ? (d = t.top - f - a, _ = y(p), d < 0 && (b = !1)) : p === "bottom" ? (d = t.bottom + f, _ = y(p), d + a > r && (b = !1)) : p === "left" ? (d = y(p), _ = t.left - f - s, _ < 0 && (b = !1)) : (d = y(p), _ = t.right + f, _ + s > h && (b = !1)), { top: d, left: _, side: p, fits: b };
  }
  let A = null;
  for (let p = 0; p < w.length; p++) {
    const d = E(w[p]);
    if (d.fits) {
      A = d;
      break;
    }
  }
  A || (A = E(w[0]));
  let m = A.top, v = A.left;
  return s >= h ? v = 0 : (v < 0 && (v = 0), v + s > h && (v = h - s)), a >= r ? m = 0 : (m < 0 && (m = 0), m + a > r && (m = r - a)), { top: m, left: v, placement: A.side };
}
function ye(t) {
  if (!t) return { width: 0, height: 0 };
  const e = t.style, i = e.visibility, l = e.display, f = e.position;
  e.visibility = "hidden", e.display = "block", e.position = "fixed";
  const h = t.offsetWidth, r = t.offsetHeight;
  return e.visibility = i, e.display = l, e.position = f, { width: h, height: r };
}
let Kt = null;
const Ki = "ln-ashlar:storage-salt:v1", Ke = 32768;
function je(t) {
  let e = "";
  const i = t.byteLength;
  for (let l = 0; l < i; l += Ke)
    e += String.fromCharCode.apply(
      null,
      t.subarray(l, Math.min(l + Ke, i))
    );
  return btoa(e);
}
function We(t) {
  const e = atob(t), i = e.length, l = new Uint8Array(i);
  for (let f = 0; f < i; f++)
    l[f] = e.charCodeAt(f);
  return l;
}
function Rn(t, e) {
  let i = Kt, l = {};
  return typeof CryptoKey < "u" && t instanceof CryptoKey ? i = t : t && typeof t == "object" && (l = t, typeof CryptoKey < "u" && l.key instanceof CryptoKey && (i = l.key)), { key: i, options: l };
}
async function ji(t, e = {}) {
  if (!t)
    throw new Error("[ln-crypto] Key derivation failed: Secret string is required");
  const i = e.method || "pbkdf2", l = new TextEncoder();
  if (i === "sha256") {
    const a = await crypto.subtle.digest("SHA-256", l.encode(t));
    return crypto.subtle.importKey(
      "raw",
      a,
      { name: "AES-GCM" },
      !1,
      ["encrypt", "decrypt"]
    );
  }
  const f = e.salt || Ki, h = typeof f == "string" ? l.encode(f) : f, r = e.iterations || 1e5, s = await crypto.subtle.importKey(
    "raw",
    l.encode(t),
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
    s,
    { name: "AES-GCM", length: 256 },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function Ve(t, e = {}) {
  if (!t) {
    Kt = null;
    return;
  }
  try {
    const i = e.method || "sha256";
    Kt = await ji(t, { ...e, method: i });
  } catch (i) {
    throw console.error("[ln-core/crypto] Key derivation failed:", i), Kt = null, i;
  }
}
function At() {
  return Kt;
}
async function Wi(t, e, i) {
  const { key: l } = Rn(e);
  if (t == null)
    return t;
  if (!l)
    throw new Error("[ln-crypto] Encryption failed: No active cryptographic key provided");
  try {
    const f = new TextEncoder(), h = crypto.getRandomValues(new Uint8Array(12)), r = typeof t == "string" ? t : JSON.stringify(t), s = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: h },
      l,
      f.encode(r)
    );
    return {
      v: 1,
      alg: "AES-GCM",
      encrypted: !0,
      iv: je(h),
      data: je(new Uint8Array(s))
    };
  } catch (f) {
    throw console.error("[ln-core/crypto] Encryption failed:", f), new Error("[ln-crypto] Encryption failed: " + (f && f.message ? f.message : String(f)));
  }
}
async function Vi(t, e, i) {
  const { key: l, options: f } = Rn(e), h = f.silent === !0;
  if (!t || !t.encrypted)
    return t;
  if (!l) {
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
    const r = new TextDecoder(), s = We(t.iv), a = We(t.data), n = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: s },
      l,
      a
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
function On(t, e = 100, i = 0) {
  const l = parseFloat(String(t)) || 0, f = parseFloat(String(e)) || 100, h = parseFloat(String(i)) || 0, r = Math.max(h, Math.min(l, f)), s = f - h;
  let a = 0;
  return s > 0 && (a = (r - h) / s * 100), a = Math.max(0, Math.min(100, a)), {
    value: l,
    min: h,
    max: f,
    clampedValue: r,
    percentage: a
  };
}
function ot(t) {
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
      const h = +l[1], r = +l[2], s = +l[3], a = new Date(h, r - 1, s);
      return a.getFullYear() !== h || a.getMonth() !== r - 1 || a.getDate() !== s ? null : a;
    }
    const f = new Date(i);
    return isNaN(f.getTime()) ? null : f;
  }
  return null;
}
function Dt(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0");
  return e + "-" + i + "-" + l;
}
const bt = {};
function ne(t) {
  const e = t || "default";
  if (!bt[e]) {
    const i = new Intl.NumberFormat(t, { useGrouping: !0 }), l = i.formatToParts(1234.5);
    let f = "", h = ".";
    for (let r = 0; r < l.length; r++)
      l[r].type === "group" && (f = l[r].value), l[r].type === "decimal" && (h = l[r].value);
    bt[e] = { groupSep: f, decimalSep: h, fmt: i };
  }
  return bt[e];
}
function Nn(t, e, i) {
  if (t == null || typeof t != "string") return "";
  let l = t.trim();
  return l === "" ? "" : (l = l.replace(/[$€£¥]/g, ""), e && (l = l.split(e).join("")), l = l.replace(/\s/g, ""), i && i !== "." && (l = l.replace(i, ".")), l = l.replace(/[^\d.-]/g, ""), l);
}
function Gi(t, e) {
  if (typeof t == "number") return isNaN(t) ? NaN : t;
  if (t == null || typeof t != "string") return NaN;
  const i = t.trim();
  if (i === "" || i === "-") return NaN;
  const l = ne(e), f = Nn(i, l.groupSep, l.decimalSep);
  if (f === "" || f === "-") return NaN;
  const h = parseFloat(f);
  return isNaN(h) ? NaN : h;
}
function lt(t, e, i = {}) {
  if (typeof t != "number" || isNaN(t) || !Number.isFinite(t)) return "";
  const l = e || "default", f = i.maxDecimals != null ? parseInt(i.maxDecimals, 10) : null, h = i.userDecimals != null ? i.userDecimals : null;
  if (f !== null) {
    const r = l + "|max:" + f;
    return bt[r] || (bt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: 0,
      maximumFractionDigits: f
    })), bt[r].format(t);
  }
  if (h !== null && h > 0) {
    const r = l + "|exact:" + h;
    return bt[r] || (bt[r] = new Intl.NumberFormat(e, {
      useGrouping: !0,
      minimumFractionDigits: h,
      maximumFractionDigits: h
    })), bt[r].format(t);
  }
  return ne(e).fmt.format(t);
}
function ve(t) {
  return String(t || "").trim().toLowerCase();
}
function Mn(t) {
  const e = ve(t);
  return e ? e.split(/\s+/).filter(Boolean) : [];
}
function $i(t) {
  if (t == null) return null;
  const e = String(t).split(",").map((i) => i.trim()).filter(Boolean);
  return e.length ? e : null;
}
function Fn(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = String(t).toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (i.indexOf(e[l]) === -1) return !1;
  return !0;
}
function Qi(t) {
  return !t || t.length === 0 ? "" : t.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Ne(t, e) {
  if (!e || e.length === 0) return !0;
  if (t == null) return !1;
  const i = String(t).trim().toLowerCase();
  for (let l = 0; l < e.length; l++)
    if (String(e[l]).trim().toLowerCase() === i)
      return !0;
  return !1;
}
function Xi(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    if (typeof t.href == "string") return t.href;
    if (typeof t.url == "string") return t.url;
  }
  return String(t || "");
}
function Yi(t, e) {
  return e && e.method ? String(e.method).toUpperCase() : t && typeof t == "object" && t.method ? String(t.method).toUpperCase() : "GET";
}
function Ji(t, e) {
  return (e || "GET") + " " + (t || "");
}
function Zi(t) {
  const e = (t || "").toUpperCase();
  return e === "GET" || e === "HEAD";
}
(function() {
  if (window.lnHttp) return;
  const t = window.fetch.bind(window), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function l(r, s) {
    s = s || {};
    const a = Xi(r), n = Yi(r, s), o = Ji(a, n);
    Zi(n) && e.has(o) && (e.get(o).abort(), e.delete(o));
    const c = new AbortController(), u = s.signal;
    let w = null;
    u && (u.aborted ? c.abort(u.reason) : (w = function() {
      c.abort(u.reason);
    }, u.addEventListener("abort", w, { once: !0 })));
    const y = Object.assign({}, s, { signal: c.signal });
    return e.set(o, c), t(r, y).finally(function() {
      u && w && u.removeEventListener("abort", w), e.get(o) === c && e.delete(o);
    });
  }
  l.toString = function() {
    return "function fetch() { [ln-http wrapped] }";
  }, window.fetch = l;
  function f(r) {
    if (!r.detail || !r.detail.url) return;
    const s = r.target, a = (r.detail.method || (r.detail.body ? "POST" : "GET")).toUpperCase(), n = r.detail.key;
    n && i.has(n) && (i.get(n).abort(), i.delete(n));
    const o = new AbortController(), c = r.detail.signal;
    let u = null;
    c && (c.aborted ? o.abort(c.reason) : (u = function() {
      o.abort(c.reason);
    }, c.addEventListener("abort", u, { once: !0 }))), n && i.set(n, o);
    const w = { method: a, signal: o.signal };
    r.detail.body !== void 0 && (w.body = r.detail.body), window.fetch(r.detail.url, w).then(function(y) {
      c && u && c.removeEventListener("abort", u), n && i.get(n) === o && i.delete(n), L(s, "ln-http:response", {
        ok: y.ok,
        status: y.status,
        response: y
      });
    }).catch(function(y) {
      c && u && c.removeEventListener("abort", u), n && i.get(n) === o && i.delete(n), !(y && y.name === "AbortError") && L(s, "ln-http:error", {
        ok: !1,
        status: 0,
        error: y
      });
    });
  }
  function h(r) {
    const s = r.detail || {};
    s.all ? window.lnHttp.cancelAll() : s.key ? window.lnHttp.cancelByKey(s.key) : s.url && window.lnHttp.cancel(s.url);
  }
  document.addEventListener("ln-http:request", f), document.addEventListener("ln-http:cancel", h), window.lnHttp = {
    cancel: function(r) {
      let s = !1;
      return e.forEach(function(a, n) {
        n.endsWith(" " + r) && (a.abort(), e.delete(n), s = !0);
      }), s;
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
      return e.forEach(function(s, a) {
        const n = a.indexOf(" ");
        r.push({ method: a.slice(0, n), url: a.slice(n + 1) });
      }), i.forEach(function(s, a) {
        r.push({ key: a });
      }), r;
    },
    destroy: function() {
      window.lnHttp.cancelAll(), document.removeEventListener("ln-http:request", f), document.removeEventListener("ln-http:cancel", h), window.fetch = t, delete window.lnHttp;
    }
  };
})();
(function() {
  const t = "template[data-ln-include]", e = "lnInclude";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-include": { prop: "url", read: $, type: "string", fallback: "", description: "URL of external HTML template to fetch and include" }
  }, l = et(i), f = /* @__PURE__ */ new Map();
  function h(r) {
    if (this.dom = r, tt(this, r, l), this._held = !1, this._destroyed = !1, !this.url)
      return this;
    Bi(), this._held = !0;
    const s = this, a = this.url;
    let n = f.get(a);
    return n || (n = fetch(a).then(function(o) {
      if (!o.ok)
        throw new Error("HTTP error! status: " + o.status);
      return o.text();
    }).catch(function(o) {
      throw f.delete(a), o;
    }), f.set(a, n)), n.then(function(o) {
      if (s._destroyed) return;
      const c = document.createElement("template");
      c.innerHTML = o, s.dom.content.appendChild(c.content), L(s.dom, "ln-include:loaded", { target: s.dom, url: s.url }), s._held && (s._held = !1, ue());
    }).catch(function(o) {
      s._destroyed || (console.error("[ln-include] Failed to fetch template from " + s.url + ":", o), L(s.dom, "ln-include:error", { target: s.dom, url: s.url, error: o }), s._held && (s._held = !1, ue()));
    }), this;
  }
  h.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this._held && (this._held = !1, ue()), delete this.dom[e]);
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
  }, l = et(i);
  function f(h) {
    this.dom = h, tt(this, h, l), this._baseAction = h.getAttribute("action") || "";
    const r = this;
    return this._onLnFill = function(s) {
      s.target === r.dom && (s.detail ? (r.fill(s.detail), r._applyActionMode(s.detail)) : r.dom.reset());
    }, this._onReset = function() {
      r._applyActionMode(null);
    }, h.addEventListener("ln-fill", this._onLnFill), h.addEventListener("reset", this._onReset), this;
  }
  f.prototype.fill = function(h) {
    const r = gn(this.dom, h);
    for (let s = 0; s < r.length; s++) {
      const a = r[s], n = a.tagName === "SELECT" || a.type === "checkbox" || a.type === "radio";
      a.dispatchEvent(new Event(n ? "change" : "input", { bubbles: !0 }));
    }
  }, f.prototype._ensureMethodInput = function() {
    let h = this.dom.querySelector('input[name="_method"]');
    return h || (h = document.createElement("input"), h.type = "hidden", h.name = "_method", h.value = "", this.dom.appendChild(h)), h;
  }, f.prototype._applyActionMode = function(h) {
    if (!this.dom.hasAttribute("data-ln-form-action-edit")) return;
    const r = h && h.id != null && h.id !== "" ? h.id : null, s = this._ensureMethodInput();
    if (r !== null) {
      const a = this._actionEdit;
      a ? this.dom.setAttribute("action", a.replace(":id", encodeURIComponent(r))) : this.dom.setAttribute("action", this._baseAction.replace(/\/$/, "") + "/" + encodeURIComponent(r)), s.value = this._actionMethod || "PUT";
    } else
      this.dom.setAttribute("action", this._baseAction), s.value = "";
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-fill", this._onLnFill), this.dom.removeEventListener("reset", this._onReset), delete this.dom[e]);
  }, j(t, e, f, "ln-form", {
    attributes: i
  });
})();
const Ge = {
  required: "valueMissing",
  typeMismatch: "typeMismatch",
  tooShort: "tooShort",
  tooLong: "tooLong",
  patternMismatch: "patternMismatch",
  rangeUnderflow: "rangeUnderflow",
  rangeOverflow: "rangeOverflow"
};
function $e(t, e = 0) {
  return t ? !!(t.valid && e === 0) : e === 0;
}
function tr(t) {
  return t.type === "checkbox" || t.type === "radio" ? !!t.checked : !!(t.value && t.value.trim() !== "");
}
function er(t, e) {
  const i = [];
  if (t) {
    const l = Object.keys(Ge);
    for (let f = 0; f < l.length; f++) {
      const h = l[f], r = Ge[h];
      t[r] && i.push(h);
    }
  }
  if (e) {
    const l = Array.from(e);
    for (let f = 0; f < l.length; f++)
      l[f] && i.indexOf(l[f]) === -1 && i.push(l[f]);
  }
  return i;
}
(function() {
  const t = "data-ln-validate", e = "lnValidate", i = "data-ln-validate-errors", l = "data-ln-validate-error", f = "ln-validate-valid", h = "ln-validate-invalid";
  if (window[e] !== void 0) return;
  const r = {
    "data-ln-validate": { type: "marker", description: "Activates validation on form input or field" },
    "data-ln-validate-errors": { type: "marker", description: "Container element holding validation error message elements" },
    "data-ln-validate-error": { type: "string", description: "Identifies error message template for a specific validation rule" }
  };
  function s(a) {
    this.dom = a, this._touched = !1, this._customErrors = /* @__PURE__ */ new Set();
    const n = this, o = a.tagName, c = a.type, u = o === "SELECT" || c === "checkbox" || c === "radio";
    this._onInput = function() {
      n._touched = !0, n.validate();
    }, this._onChange = function() {
      n._touched = !0, n.validate();
    }, this._onSetCustom = function(y) {
      const E = y.detail && y.detail.error;
      if (!E) return;
      n._customErrors.add(E), n._touched = !0;
      const A = a.closest(".form-element");
      if (A) {
        const m = A.querySelector("[" + l + '="' + E + '"]');
        m && m.classList.remove("hidden");
      }
      a.classList.remove(f), a.classList.add(h), a.setAttribute("aria-invalid", "true");
    }, this._onClearCustom = function(y) {
      const E = y.detail && y.detail.error, A = a.closest(".form-element");
      if (E) {
        if (n._customErrors.delete(E), A) {
          const m = A.querySelector("[" + l + '="' + E + '"]');
          m && m.classList.add("hidden");
        }
      } else
        n._customErrors.forEach(function(m) {
          if (A) {
            const v = A.querySelector("[" + l + '="' + m + '"]');
            v && v.classList.add("hidden");
          }
        }), n._customErrors.clear();
      n._touched && n.validate();
    }, u || a.addEventListener("input", this._onInput), a.addEventListener("change", this._onChange), a.addEventListener("ln-validate:set-custom", this._onSetCustom), a.addEventListener("ln-validate:clear-custom", this._onClearCustom);
    const w = a.form;
    return w && (w.hasAttribute("novalidate") || w.setAttribute("novalidate", ""), this._onFormReset = function() {
      n.reset();
    }, this._onValidateRequest = function(y) {
      n._touched = !0, !n.validate() && y.detail && y.detail.invalidFields && y.detail.invalidFields.push(n.dom);
    }, w.addEventListener("reset", this._onFormReset), w.addEventListener("ln-validate:request-validate", this._onValidateRequest), w._lnValidateGateBound || (w._lnValidateGateBound = !0, w.addEventListener("submit", function(y) {
      const E = { invalidFields: [] };
      L(w, "ln-validate:request-validate", E), E.invalidFields.length > 0 && (y.preventDefault(), E.invalidFields.sort((A, m) => A.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1), E.invalidFields[0].focus());
    }))), tr(a) && (this._touched = !0, this.validate()), this;
  }
  s.prototype.validate = function() {
    const a = this.dom, n = a.validity, o = $e(n, this._customErrors.size), c = er(n, this._customErrors), u = a.closest(".form-element");
    if (u) {
      const y = u.querySelector("[" + i + "]");
      if (y) {
        const E = y.querySelectorAll("[" + l + "]");
        for (let A = 0; A < E.length; A++) {
          const m = E[A].getAttribute(l);
          E[A].classList.toggle("hidden", !c.includes(m));
        }
      }
    }
    return a.classList.toggle(f, o), a.classList.toggle(h, !o), a.setAttribute("aria-invalid", o ? "false" : "true"), L(a, o ? "ln-validate:valid" : "ln-validate:invalid", { target: a, field: a.name, errors: c }), o;
  }, s.prototype.reset = function() {
    this._touched = !1, this._customErrors.clear(), this.dom.classList.remove(f, h), this.dom.removeAttribute("aria-invalid");
    const a = this.dom.closest(".form-element");
    if (a) {
      const n = a.querySelectorAll("[" + l + "]");
      for (let o = 0; o < n.length; o++)
        n[o].classList.add("hidden");
    }
  }, Object.defineProperty(s.prototype, "isValid", {
    get: function() {
      return $e(this.dom.validity, this._customErrors.size);
    }
  }), s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("ln-validate:set-custom", this._onSetCustom), this.dom.removeEventListener("ln-validate:clear-custom", this._onClearCustom);
    const a = this.dom.form;
    a && (this._onFormReset && a.removeEventListener("reset", this._onFormReset), this._onValidateRequest && a.removeEventListener("ln-validate:request-validate", this._onValidateRequest)), this.dom.classList.remove(f, h), this.dom.removeAttribute("aria-invalid"), delete this.dom[e];
  }, j(t, e, s, "ln-validate", {
    attributes: r
  });
})();
(function() {
  const t = "data-ln-ajax", e = "lnAjax", i = "data-ln-data-coordinator-scope";
  if (window[e] !== void 0) return;
  let l = null;
  function f(u) {
    if (!u.hasAttribute(t) || u[e]) return;
    u[e] = !0;
    const w = n(u);
    h(w.links), r(w.forms);
  }
  function h(u) {
    for (const w of u) {
      if (w[e + "Trigger"] || w.hostname && w.hostname !== window.location.hostname) continue;
      const y = w.getAttribute("href");
      if (y && y.includes("#")) continue;
      const E = function(A) {
        if (!pn(A, w)) return;
        A.preventDefault();
        const m = w.getAttribute("href");
        m && a("GET", m, null, w);
      };
      w.addEventListener("click", E), w[e + "Trigger"] = E;
    }
  }
  function r(u) {
    for (const w of u) {
      if (w[e + "Trigger"]) continue;
      if (w.hasAttribute(i)) {
        w[e + "ScopeWarned"] || (w[e + "ScopeWarned"] = !0, console.warn("[ln-ajax] Form has data-ln-data-coordinator-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form."));
        continue;
      }
      const y = function(E) {
        if (E.defaultPrevented) return;
        E.preventDefault();
        const A = w.method.toUpperCase(), m = w.action, v = new FormData(w);
        for (const p of w.querySelectorAll('button, input[type="submit"]'))
          p.disabled = !0;
        a(A, m, v, w, function() {
          for (const p of w.querySelectorAll('button, input[type="submit"]'))
            p.disabled = !1;
        });
      };
      w.addEventListener("submit", y), w[e + "Trigger"] = y;
    }
  }
  function s(u) {
    if (!u[e]) return;
    const w = n(u);
    for (const y of w.links)
      y[e + "Trigger"] && (y.removeEventListener("click", y[e + "Trigger"]), delete y[e + "Trigger"]);
    for (const y of w.forms)
      y[e + "Trigger"] && (y.removeEventListener("submit", y[e + "Trigger"]), delete y[e + "Trigger"]);
    delete u[e];
  }
  function a(u, w, y, E, A) {
    if (Z(E, "ln-ajax:before-start", { method: u, url: w }).defaultPrevented) return;
    u === "GET" && l && l(), L(E, "ln-ajax:start", { method: u, url: w }), E.classList.add("ln-ajax--loading");
    const v = document.createElement("span");
    v.className = "ln-ajax-spinner", E.appendChild(v);
    function p() {
      E.classList.remove("ln-ajax--loading");
      const S = E.querySelector(".ln-ajax-spinner");
      S && S.remove(), A && A();
    }
    let d = w;
    const _ = document.querySelector('meta[name="csrf-token"]'), b = _ ? _.getAttribute("content") : null;
    y instanceof FormData && b && y.append("_token", b);
    const T = {
      method: u,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    };
    if (b && (T.headers["X-CSRF-TOKEN"] = b), u === "GET" && y) {
      const S = new URLSearchParams(y);
      d = w + (w.includes("?") ? "&" : "?") + S.toString();
    } else u !== "GET" && y && (T.body = y);
    let g = null;
    if (u === "GET") {
      const S = new AbortController();
      T.signal = S.signal, g = function() {
        l = null, S.abort(), p(), L(E, "ln-ajax:aborted", { method: u, url: d });
      }, l = g;
    }
    fetch(d, T).then(function(S) {
      const C = S.ok, q = S.status;
      return S.text().then(function(D) {
        let I = null, R = null;
        if (D && D.trim())
          try {
            I = JSON.parse(D);
          } catch (O) {
            R = O;
          }
        return { ok: C, status: q, data: I, parseError: R };
      });
    }).then(function(S) {
      g && l === g && (l = null);
      const C = S.status, q = S.data, D = S.parseError;
      if (S.ok && !D) {
        if (q && q.title && (document.title = q.title), q && q.content)
          for (const I in q.content) {
            const R = document.getElementById(I);
            R && (R.innerHTML = q.content[I]);
          }
        if (E.tagName === "A") {
          const I = E.getAttribute("href");
          I && window.history.pushState({ ajax: !0 }, "", I);
        } else E.tagName === "FORM" && E.method.toUpperCase() === "GET" && window.history.pushState({ ajax: !0 }, "", d);
        L(E, "ln-ajax:success", { method: u, url: d, data: q });
      } else
        L(E, "ln-ajax:error", {
          method: u,
          url: d,
          status: C,
          data: q,
          error: D || null
        });
      p(), L(E, "ln-ajax:complete", { method: u, url: d });
    }).catch(function(S) {
      S && S.name === "AbortError" || (g && l === g && (l = null), L(E, "ln-ajax:error", { method: u, url: d, status: 0, data: null, error: S }), p(), L(E, "ln-ajax:complete", { method: u, url: d }));
    });
  }
  function n(u) {
    const w = { links: [], forms: [] };
    return u.tagName === "A" && u.getAttribute(t) !== "false" ? w.links.push(u) : u.tagName === "FORM" && u.getAttribute(t) !== "false" ? w.forms.push(u) : (w.links = Array.from(u.querySelectorAll('a:not([data-ln-ajax="false"])')), w.forms = Array.from(u.querySelectorAll('form:not([data-ln-ajax="false"])'))), w;
  }
  function o() {
    pt(function() {
      new MutationObserver(function(w) {
        for (const y of w)
          if (y.type === "childList") {
            for (const E of y.addedNodes)
              if (E.nodeType === 1 && (f(E), !E.hasAttribute(t))) {
                for (const m of E.querySelectorAll("[" + t + "]"))
                  f(m);
                const A = E.closest && E.closest("[" + t + "]");
                if (A && A.getAttribute(t) !== "false") {
                  const m = n(E);
                  h(m.links), r(m.forms);
                }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), $t([t], function(w) {
        f(w);
      });
    }, "ln-ajax");
  }
  function c() {
    for (const u of document.querySelectorAll("[" + t + "]"))
      f(u);
  }
  window[e] = f, window[e].destroy = s, o(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", c) : c();
})();
function nr(t, { isHydration: e = !1, hasPrimaryRegion: i = !1, primaryMatch: l = null } = {}) {
  const f = i ? !l : !t.some((n) => n.match), h = [], r = [];
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
  const a = r.find((n) => n.regionKey === "__primary__") || r[0] || null;
  return { notFound: f, clears: h, swaps: r, owner: a };
}
function jt(t) {
  if (!t || typeof t != "string") return "";
  let e = t.trim().replace(/\/+$/, "");
  return !e || e === "/" ? "" : e.startsWith("/") ? e : "/" + e;
}
function ir(t, e) {
  const i = jt(e);
  if (!i) return t && t.replace(/\/+$/, "") || "/";
  const l = (t || "/").replace(/\/+$/, "") || "/";
  return l === i ? "/" : l.startsWith(i + "/") ? l.slice(i.length).replace(/\/+$/, "") || "/" : l;
}
function Pn(t, e) {
  const i = jt(e);
  if (!i) return t || "/";
  const l = t || "/", f = l.indexOf("#"), h = f !== -1 ? l.slice(0, f) : l, r = f !== -1 ? l.slice(f) : "", s = h.indexOf("?"), a = s !== -1 ? h.slice(0, s) : h, n = s !== -1 ? h.slice(s) : "";
  let o;
  if (a === i)
    o = i + "/";
  else if (a.startsWith(i + "/"))
    o = a;
  else {
    const c = a.startsWith("/") ? a : "/" + a;
    o = c === "/" ? i + "/" : i + c;
  }
  return o + n + r;
}
function we() {
  if (typeof document > "u") return "";
  const t = document.querySelector("[data-ln-outlet]") || document.querySelector("[data-ln-router-base]");
  if (t && t.hasAttribute("data-ln-router-base"))
    return jt(t.getAttribute("data-ln-router-base"));
  const e = document.querySelector("base[href]");
  if (e)
    try {
      const i = new URL(e.getAttribute("href"), window.location.origin);
      return jt(i.pathname);
    } catch {
      return jt(e.getAttribute("href"));
    }
  return "";
}
const Bn = {
  navigate: function(t) {
    Vt(t, { historyAction: "push" });
  },
  replace: function(t) {
    Vt(t, { historyAction: "replace" });
  },
  base: function() {
    return we();
  },
  toUrl: function(t) {
    return Pn(t, we());
  },
  current: function() {
    return ie === null ? null : {
      path: ie,
      fullPath: zn,
      base: Kn,
      params: jn,
      query: Wn,
      route: Vn,
      regions: Hn
    };
  }
}, Me = "data-ln-route", Un = "lnRoute";
typeof window < "u" && (window.lnRouter = Bn);
function fe(t) {
  Yn(t), Xn(t), gt.size > 0 && Qn();
}
const rr = {
  "data-ln-route": { effect: fe, type: "string", description: "URL path pattern matched by this route template" },
  "data-ln-route-target": { effect: fe, type: "string", description: "Target outlet element selector where route content is rendered" },
  "data-ln-route-title": { effect: fe, type: "string", description: "Document title template set when route is activated" },
  "data-ln-route-keep": { type: "boolean", fallback: !1, description: "Preserve mounted DOM nodes in memory instead of rebuilding" },
  "data-ln-router-base": { type: "string", description: 'Base URL prefix for subdirectory routing (e.g. "/spa")' },
  "data-ln-router-hydrate": { type: "boolean", fallback: !1, description: "Hydrate existing DOM content on initial router boot" }
}, gt = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new WeakMap();
let Hn = /* @__PURE__ */ new Map(), Qe = !1, ie = null, zn = null, Kn = "", jn = {}, Wn = {}, Vn = null, Ee = !1;
function Xe(t, e, i) {
  Ee ? queueMicrotask(function() {
    L(t, e, i);
  }) : L(t, e, i);
}
function Fe(t) {
  try {
    const s = new URL(t, window.location.origin);
    t = s.pathname + s.search + s.hash;
  } catch {
  }
  let [e] = t.split("#"), [i, l] = e.split("?");
  const f = {};
  if (l) {
    const s = new URLSearchParams(l);
    for (const [a, n] of s.entries())
      f[a] = n;
  }
  const h = we();
  return { path: ir(i, h), query: f, base: h };
}
function Gn(t, e) {
  if (t.pattern === "*") return 1;
  if (e.pattern === "*") return -1;
  const i = t.segments, l = e.segments, f = Math.max(i.length, l.length);
  for (let h = 0; h < f; h++) {
    const r = i[h], s = l[h];
    if (r === void 0) return 1;
    if (s === void 0) return -1;
    if (r === "*") return 1;
    if (s === "*") return -1;
    const a = r.startsWith(":"), n = s.startsWith(":");
    if (a && !n) return 1;
    if (!a && n) return -1;
  }
  return 0;
}
function $n(t, e) {
  const i = t.split("/").filter(Boolean);
  for (const l of e) {
    if (l.pattern === "*")
      return {
        route: l,
        params: { wildcard: t }
      };
    const f = l.segments, h = {};
    let r = !0;
    if (!(i.length > f.length && f[f.length - 1] !== "*")) {
      for (let s = 0; s < f.length; s++) {
        const a = f[s], n = i[s];
        if (a === "*") {
          h.wildcard = i.slice(s).join("/");
          break;
        }
        if (n === void 0) {
          r = !1;
          break;
        }
        if (a.startsWith(":"))
          h[a.slice(1)] = decodeURIComponent(n);
        else if (a !== n) {
          r = !1;
          break;
        }
      }
      if (r && (f.indexOf("*") !== -1 || i.length <= f.length))
        return { route: l, params: h };
    }
  }
  return null;
}
function Ae(t, e = {}) {
  const i = e.warn !== !1;
  if (t !== "__primary__") {
    const f = document.getElementById(t);
    return !f && i && console.warn(`[ln-router] Explicit target element #${t} not found in DOM`), f;
  }
  const l = document.querySelector("[data-ln-outlet]") || document.querySelector("main");
  return !l && i && console.warn("[ln-router] Default outlet (element with [data-ln-outlet] or <main>) not found in DOM"), l;
}
function Ye(t) {
  if (!t) return;
  const e = Array.from(t.querySelectorAll("*")), i = [t].concat(e);
  for (const f of i)
    for (const h of Object.keys(f))
      if (h.startsWith("ln") && f[h] && typeof f[h].destroy == "function")
        try {
          f[h].destroy();
        } catch (r) {
          console.error(`[ln-router] Error destroying component ${h} on element:`, f, r);
        }
  const l = document.querySelectorAll('[data-ln-popover="open"]');
  for (const f of l) {
    const h = f.lnPopover;
    if (h && h.trigger && t.contains(h.trigger))
      try {
        h.destroy();
      } catch (r) {
        console.error("[ln-router] Error destroying open popover:", r);
      }
  }
}
function Vt(t, e = {}) {
  const { path: i, query: l, base: f } = Fe(t), h = Pn(t, f), r = /* @__PURE__ */ new Map();
  for (const [y, E] of gt)
    r.set(y, $n(i, E.sorted));
  const s = r.get("__primary__") || null, a = Ae("__primary__", { warn: !!s }), n = gt.has("__primary__"), o = [];
  for (const [y, E] of r) {
    const A = y === "__primary__" ? a : Ae(y, { warn: !1 }), m = !A && !!(s && s.route && s.route.templateNode && s.route.templateNode.content && s.route.templateNode.content.querySelector("#" + CSS.escape(y)));
    !A && !m && E && console.warn(`[ln-router] Explicit target element #${y} not found in DOM`), o.push({
      regionKey: y,
      match: E,
      targetEl: A,
      isPending: m,
      hasKeep: !!A && A.hasAttribute("data-ln-route-keep"),
      hasHydrate: !!A && A.hasAttribute("data-ln-router-hydrate"),
      hasChildren: !!A && A.children.length > 0,
      mountedTemplate: A && he.get(A) || null
    });
  }
  const c = nr(o, {
    isHydration: !!e.isHydration,
    hasPrimaryRegion: n,
    primaryMatch: s
  });
  if (c.notFound) {
    Xe(document.body, "ln-router:not-found", { path: i });
    return;
  }
  if (Z(a || document.body, "ln-router:before-navigate", {
    from: ie,
    to: h,
    path: i,
    params: s ? s.params : {},
    query: l
  }).defaultPrevented) return;
  e.historyAction === "push" ? window.history.pushState(null, "", h) : e.historyAction === "replace" && window.history.replaceState(null, "", h);
  const w = function() {
    for (const y of c.clears)
      Ye(y.targetEl), y.targetEl.replaceChildren(), he.delete(y.targetEl);
    for (const y of c.swaps) {
      if ((y.isPending || !y.targetEl || !document.contains(y.targetEl)) && (y.targetEl = y.regionKey === "__primary__" ? a : document.getElementById(y.regionKey)), !y.targetEl) {
        console.warn(`[ln-router] Target element #${y.regionKey} could not be resolved`);
        continue;
      }
      if (y.skipMount || (Ye(y.targetEl), y.targetEl.replaceChildren(y.match.route.templateNode.content.cloneNode(!0))), he.set(y.targetEl, y.match.route.templateNode), c.owner && y.regionKey === c.owner.regionKey) {
        if (y.match.route.title) {
          let E = y.match.route.title;
          if (y.match.params)
            for (const [A, m] of Object.entries(y.match.params))
              E = E.replace(new RegExp("\\{\\{\\s*" + A + "\\s*\\}\\}", "g"), m);
          document.title = E;
        }
        if (!e.isHydration) {
          y.targetEl.hasAttribute("tabindex") || y.targetEl.setAttribute("tabindex", "-1");
          const E = y.targetEl.querySelector("h1, h2, h3, h4, h5, h6");
          E ? (E.setAttribute("tabindex", "-1"), E.focus()) : y.targetEl.focus(), y.regionKey === "__primary__" && y.targetEl.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
      Xe(y.targetEl, "ln-router:navigated", {
        path: i,
        fullPath: h,
        base: f,
        params: y.match.params,
        query: l,
        route: y.match.route,
        target: y.targetEl,
        region: y.regionKey
      });
    }
    ie = i, zn = h, Kn = f, Wn = l, Vn = s ? s.route : null, jn = s ? s.params : {}, Hn = new Map(
      Array.from(r.entries()).map(([y, E]) => [y, E ? { route: E.route, params: E.params } : null])
    );
  };
  document.startViewTransition && !e.isHydration ? document.startViewTransition(w) : w();
}
function or(t) {
  const e = t.target.closest("a");
  if (!e || !pn(t, e)) return;
  const i = e.getAttribute("href"), { path: l } = Fe(i);
  for (const f of gt.values())
    if ($n(l, f.sorted)) {
      t.preventDefault(), Vt(i, { historyAction: "push" });
      return;
    }
}
function sr(t, e) {
  const i = Object.keys(t), l = Object.keys(e);
  if (i.length !== l.length) return !1;
  for (let f = 0; f < i.length; f++) {
    const h = i[f];
    if (t[h] !== e[h]) return !1;
  }
  return !0;
}
function ar() {
  const t = window.location.pathname + window.location.search, e = Bn.current();
  if (e && e.path != null) {
    const i = Fe(t);
    if (e.path === i.path && sr(e.query, i.query))
      return;
  }
  Vt(t, { historyAction: "skip" });
}
function Qn() {
  Qe || (Qe = !0, pt(function() {
    document.addEventListener("click", or), window.addEventListener("popstate", ar), Ee = !0;
    const t = window.location.pathname + window.location.search + window.location.hash;
    Vt(t, { historyAction: "replace", isHydration: !0 }), Ee = !1;
  }, "ln-router"));
}
function Xn(t) {
  const e = t.getAttribute(Me);
  if (!e) return;
  const i = t.getAttribute("data-ln-route-target") || null;
  if (i === "__primary__") {
    console.warn(`[ln-router] "__primary__" is a reserved region key and cannot be used as data-ln-route-target. Route "${e}" rejected.`);
    return;
  }
  const l = i || "__primary__";
  gt.has(l) || gt.set(l, { routes: /* @__PURE__ */ new Map(), sorted: [] });
  const f = gt.get(l);
  if (f.routes.has(e)) {
    console.warn(`[ln-router] Duplicate route pattern registered: "${e}" in region "${l}"`);
    return;
  }
  const h = t.getAttribute("data-ln-route-title"), r = e.split("/").filter(Boolean), s = {
    pattern: e,
    segments: r,
    target: i,
    title: h,
    templateNode: t
  }, a = Ae(l);
  a && a.contains(t) && console.warn(`[ln-router] Route template with pattern "${e}" is declared inside its own outlet element:`, t), f.routes.set(e, s), f.sorted = Array.from(f.routes.values()).sort(Gn);
}
function Yn(t) {
  const e = t.getAttribute(Me);
  if (!e) return;
  const l = t.getAttribute("data-ln-route-target") || null || "__primary__", f = gt.get(l);
  f && (f.routes.delete(e), f.sorted = Array.from(f.routes.values()).sort(Gn), f.routes.size === 0 && gt.delete(l));
}
function Jn(t) {
  return this.dom = t, Xn(t), this;
}
Jn.prototype.destroy = function() {
  Yn(this.dom), delete this.dom[Un];
};
j(Me, Un, Jn, "ln-router", {
  attributes: rr,
  onInit: function() {
    gt.size > 0 && Qn();
  }
});
(function() {
  const t = "data-ln-modal", e = "lnModal", i = "data-ln-modal-for", l = "data-ln-modal-close";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-modal": {
      type: "enum",
      values: ["open", "close"],
      fallback: "close",
      effect: o,
      description: "Control state of the modal dialog"
    },
    "data-ln-modal-for": {
      type: "string",
      description: "Target modal ID to open on trigger click"
    },
    "data-ln-modal-close": {
      type: "trigger",
      description: "Click dismiss trigger inside the modal"
    }
  }, h = /* @__PURE__ */ new Set();
  let r = null;
  function s() {
    r || (r = function(c) {
      if (Le(c)) return;
      const u = c.target.closest("[" + i + "]");
      if (!u || qe(u)) return;
      const w = u.getAttribute(i);
      if (!w) return;
      const y = document.getElementById(w) || document.querySelector("[" + t + '="' + w + '"]');
      !y || !y[e] || (c.preventDefault(), u.hasAttribute("data-ln-modal-mode") && y.setAttribute("data-ln-modal-mode", u.getAttribute("data-ln-modal-mode")), y.setAttribute(t, "open"));
    }, document.addEventListener("click", r));
  }
  function a() {
    h.size > 0 || !r || (document.removeEventListener("click", r), r = null);
  }
  function n(c) {
    this.dom = c, this.isOpen = c.getAttribute(t) === "open";
    const u = this;
    return this._onRequestOpen = function() {
      u.dom.setAttribute(t, "open");
    }, this._onRequestClose = function() {
      u.dom.setAttribute(t, "close");
    }, this._onCancel = function(w) {
      w.preventDefault(), u.dom.setAttribute(t, "close");
    }, this._onClickClose = function(w) {
      const y = w.target.closest("[" + l + "]");
      y && u.dom.contains(y) && (w.preventDefault(), u.dom.setAttribute(t, "close"));
    }, this.dom.addEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.addEventListener("ln-modal:request-close", this._onRequestClose), this.dom.addEventListener("cancel", this._onCancel), this.dom.addEventListener("click", this._onClickClose), h.add(this), s(), this.isOpen && (typeof this.dom.showModal == "function" && this.dom.showModal(), document.body.classList.add("ln-modal-open"), L(this.dom, "ln-modal:open", { modalId: this.dom.id, target: this.dom })), this;
  }
  n.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, n.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, n.prototype.toggle = function() {
    const c = this.dom.getAttribute(t);
    this.dom.setAttribute(t, c === "open" ? "close" : "open");
  }, n.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("ln-modal:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-modal:request-close", this._onRequestClose), this.dom.removeEventListener("cancel", this._onCancel), this.dom.removeEventListener("click", this._onClickClose), h.delete(this), a(), this.isOpen) {
        const c = this.dom;
        Array.prototype.some.call(
          document.querySelectorAll("[" + t + '="open"]'),
          function(w) {
            return w !== c;
          }
        ) || document.body.classList.remove("ln-modal-open");
      }
      delete this.dom[e];
    }
  };
  function o(c) {
    const u = c[e];
    if (!u) return;
    const y = c.getAttribute(t) === "open";
    if (y !== u.isOpen)
      if (y) {
        if (Z(c, "ln-modal:before-open", { modalId: c.id, target: c }).defaultPrevented) {
          c.setAttribute(t, "close");
          return;
        }
        u.isOpen = !0, document.body.classList.add("ln-modal-open"), typeof c.showModal == "function" && c.showModal();
        const A = c.querySelector("[autofocus]");
        if (A && zt(A))
          A.focus();
        else {
          const m = c.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'), v = Array.prototype.find.call(m, zt);
          if (v) v.focus();
          else {
            const p = c.querySelectorAll("a[href], button:not([disabled])"), d = Array.prototype.find.call(p, zt);
            d && d.focus();
          }
        }
        L(c, "ln-modal:open", { modalId: c.id, target: c });
      } else {
        if (Z(c, "ln-modal:before-close", { modalId: c.id, target: c }).defaultPrevented) {
          c.setAttribute(t, "open");
          return;
        }
        u.isOpen = !1, L(c, "ln-modal:close", { modalId: c.id, target: c }), typeof c.close == "function" && c.close(), document.querySelector("[" + t + '="open"]') || document.body.classList.remove("ln-modal-open");
      }
  }
  j(t, e, n, "ln-modal", {
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
  document.addEventListener("click", function(h) {
    if (h.ctrlKey || h.metaKey || h.button === 1) return;
    const r = h.target.closest('a[href^="#"]');
    if (!r) return;
    const s = r.getAttribute("href"), a = Wt(s);
    for (const n in a) {
      const o = document.getElementById(n);
      if (o && o.lnModal) {
        if (!Oe(h)) return;
        mt(n, a[n]), o.lnModal.isOpen || L(o, "ln-modal:request-open", {});
        return;
      }
    }
  });
  function l() {
    const h = location.hash;
    if (!h) return;
    const r = Wt(h);
    for (const s in r) {
      const a = document.getElementById(s);
      a && a.lnModal && !a.lnModal.isOpen && L(a, "ln-modal:request-open", {});
    }
  }
  window.addEventListener("hashchange", l), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", l) : l(), document.addEventListener("ln-modal:close", function(h) {
    const r = h.target;
    r && r.id && ct(r.id) !== null && mt(r.id, null);
  }), document.addEventListener("ln-ajax:success", function(h) {
    const s = (h.detail || {}).data;
    if (s && s.message) {
      const n = s.message;
      L(window, "ln-toast:enqueue", {
        type: n.type || "success",
        title: n.title || "",
        message: typeof n == "string" ? n : n.body || ""
      });
    }
    const a = h.target.closest("[data-ln-modal]");
    a && a.lnModal && (a.id && ct(a.id) !== null && mt(a.id, null), L(a, "ln-modal:request-close", {}));
  }), document.addEventListener("ln-ajax:error", function(h) {
    const s = (h.detail || {}).data;
    if (s && s.message) {
      const a = s.message;
      L(window, "ln-toast:enqueue", {
        type: a.type || "error",
        title: a.title || "",
        message: typeof a == "string" ? a : a.body || ""
      });
    }
  }), document.addEventListener("ln-upload:error", function(h) {
    const r = h.detail || {};
    r.message && L(window, "ln-toast:enqueue", {
      type: "error",
      title: "",
      message: r.message
    });
  });
  function f(h) {
    return this.dom = h, this;
  }
  f.prototype.destroy = function() {
    delete this.dom[e];
  }, j(t, e, f, "ln-ui-coordinator", {
    attributes: i
  });
})();
function lr(t, e) {
  if (!t) return 0;
  if (e <= 0)
    return t.startsWith("-") ? 1 : 0;
  let i = e, l = 0;
  for (let f = 0; f < t.length && i > 0; f++)
    l = f + 1, /[0-9]/.test(t[f]) && i--;
  return i > 0 && (l = t.length), l;
}
(function() {
  const t = "data-ln-number", e = "lnNumber";
  if (window[e] !== void 0) return;
  function i(r) {
    const s = r[e];
    s && (s.isTextElement ? s._initTextElement() : isNaN(s.value) || s._displayFormatted(s.value));
  }
  const l = {
    "data-ln-number": { type: "marker", effect: i, description: "Activates localized number formatting on input or text element" },
    "data-ln-value": { type: "float", effect: i, description: "Raw unformatted numeric value" },
    "data-ln-number-decimals": { type: "integer", fallback: 0, min: 0, max: 20, effect: i, description: "Number of decimal fraction digits" },
    "data-ln-number-min": { type: "float", effect: i, description: "Minimum allowed numeric value" },
    "data-ln-number-max": { type: "float", effect: i, description: "Maximum allowed numeric value" }
  }, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(r) {
    if (r[e]) return r[e];
    r[e] = this, this.dom = r;
    const s = this;
    if (this._onLocaleChange = function() {
      s.isTextElement ? s._formatTextContent() : isNaN(s.value) || s._displayFormatted(s.value);
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), r.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    const a = document.createElement("input");
    a.type = "hidden", a.name = r.name, r.removeAttribute("name"), r.hasAttribute("data-ln-fill-as") && a.setAttribute("data-ln-fill-as", r.getAttribute("data-ln-fill-as")), r.type = "text", r.setAttribute("inputmode", "decimal"), r.insertAdjacentElement("afterend", a), this._hidden = a, Object.defineProperty(a, "value", {
      get: function() {
        return f.get.call(a);
      },
      set: function(o) {
        if (f.set.call(a, o), o !== "" && !isNaN(parseFloat(o))) {
          const c = s.dom.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(lt(parseFloat(o), it(s.dom), { maxDecimals: c }));
        } else
          s._setDisplayRaw("");
        s.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), _n(r, f, {
      get: function() {
        return f.get.call(r);
      },
      set: function(o) {
        if (o === "") {
          s._setDisplayRaw(""), s._setHiddenRaw(""), r.dispatchEvent(new Event("input", { bubbles: !0 }));
          return;
        }
        const c = typeof o == "number" ? o : parseFloat(String(o));
        if (isNaN(c))
          s._setDisplayRaw(String(o)), s._setHiddenRaw("");
        else {
          s._setHiddenRaw(c);
          const u = r.getAttribute("data-ln-number-decimals");
          s._setDisplayRaw(lt(c, it(r), { maxDecimals: u }));
        }
        r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }), this._onInput = function() {
      s._handleInput();
    }, r.addEventListener("input", this._onInput), this._onKeyDown = function(o) {
      if (o.key !== "Backspace") return;
      const c = r.selectionStart, u = r.selectionEnd;
      if (c !== u || c === 0) return;
      const w = ne(it(r)), y = f.get.call(r), E = y[c - 1];
      if (E === w.groupSep || /\s/.test(E)) {
        o.preventDefault();
        const A = c - 2 >= 0 ? c - 2 : 0, m = y.slice(0, A) + y.slice(c);
        f.set.call(r, m), r.setSelectionRange(A, A), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }, r.addEventListener("keydown", this._onKeyDown), this._onPaste = function(o) {
      o.preventDefault();
      const c = (o.clipboardData || window.clipboardData).getData("text"), u = Gi(c, it(r));
      s.value = isNaN(u) ? NaN : u;
    }, r.addEventListener("paste", this._onPaste);
    const n = r.value;
    if (n !== "") {
      const o = parseFloat(n);
      if (!isNaN(o)) {
        const c = r.getAttribute("data-ln-number-decimals");
        this._setHiddenRaw(o), this._setDisplayRaw(lt(o, it(r), { maxDecimals: c })), r.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    }
    return this;
  }
  h.prototype._initTextElement = function() {
    const r = this.dom;
    let s = r.getAttribute("data-ln-value"), a = r.getAttribute("data-ln-number"), n = null;
    s !== null && s !== "" ? n = s : a !== null && a !== "" && a !== "true" ? n = a : n = r.textContent.trim();
    const o = parseFloat(n);
    isNaN(o) ? this._rawValue = null : (this._rawValue = o, r.hasAttribute("data-ln-value") || r.setAttribute("data-ln-value", String(o)), this._formatTextContent());
  }, h.prototype._formatTextContent = function() {
    if (this._rawValue !== null && !isNaN(this._rawValue)) {
      const r = this.dom.getAttribute("data-ln-number-decimals");
      this.dom.textContent = lt(this._rawValue, it(this.dom), { maxDecimals: r });
    }
  }, h.prototype._handleInput = function() {
    const r = this.dom, s = f.get.call(r);
    if (s === "") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "" });
      return;
    }
    if (s === "-") {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: "-" });
      return;
    }
    const a = r.selectionStart;
    let n = 0;
    for (let _ = 0; _ < a; _++)
      /[0-9]/.test(s[_]) && n++;
    const o = it(r), c = ne(o);
    let u = s, w = Nn(s, c.groupSep, c.decimalSep), y = parseFloat(w);
    if (isNaN(y)) {
      this._setHiddenRaw(""), L(r, "ln-number:input", { value: NaN, formatted: s });
      return;
    }
    const E = r.getAttribute("data-ln-number-decimals"), A = w.indexOf(".");
    if (E !== null && A !== -1) {
      const _ = parseInt(E, 10), b = w.slice(A + 1);
      if (_ === 0)
        w = w.slice(0, A), u = u.split(c.decimalSep)[0], y = parseFloat(w), this._setDisplayRaw(u);
      else if (b.length > _) {
        w = w.slice(0, A + 1 + _);
        const T = u.split(c.decimalSep);
        u = T[0] + c.decimalSep + T[1].slice(0, _), y = parseFloat(w), this._setDisplayRaw(u);
      }
    }
    const m = r.getAttribute("data-ln-number-max");
    if (m !== null && y > parseFloat(m)) {
      const _ = parseFloat(m), b = lt(_, o, { maxDecimals: E });
      this._setDisplayRaw(b), this._setHiddenRaw(_), r.setSelectionRange(b.length, b.length), L(r, "ln-number:input", { value: _, formatted: b });
      return;
    }
    if (u.endsWith(c.decimalSep) || c.decimalSep !== "." && u.endsWith(".")) {
      this._setHiddenRaw(y), L(r, "ln-number:input", { value: y, formatted: u });
      return;
    }
    const v = w.indexOf(".");
    if (v !== -1 && w.slice(v + 1).endsWith("0")) {
      this._setHiddenRaw(y), L(r, "ln-number:input", { value: y, formatted: u });
      return;
    }
    let p;
    if (E !== null)
      p = lt(y, o, { maxDecimals: E });
    else {
      const _ = v !== -1 ? w.slice(v + 1).length : 0;
      p = lt(y, o, { userDecimals: _ });
    }
    this._setDisplayRaw(p);
    const d = lr(p, n);
    r.setSelectionRange(d, d), this._setHiddenRaw(y), L(r, "ln-number:input", { value: y, formatted: p });
  }, h.prototype._setHiddenRaw = function(r) {
    this._hidden && f.set.call(this._hidden, String(r));
  }, h.prototype._setDisplayRaw = function(r) {
    this.isTextElement ? this.dom.textContent = String(r) : f.set.call(this.dom, String(r));
  }, h.prototype._displayFormatted = function(r) {
    if (this.isTextElement)
      this._formatTextContent();
    else {
      const s = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(lt(r, it(this.dom), { maxDecimals: s }));
    }
  }, Object.defineProperty(h.prototype, "value", {
    get: function() {
      if (this.isTextElement)
        return this._rawValue;
      const r = f.get.call(this._hidden);
      return r === "" ? NaN : parseFloat(r);
    },
    set: function(r) {
      const s = typeof r == "number" ? r : parseFloat(r);
      if (this.isTextElement) {
        isNaN(s) ? (this._rawValue = null, this.dom.textContent = "") : (this._rawValue = s, this.dom.setAttribute("data-ln-value", String(s)), this._formatTextContent());
        return;
      }
      if (isNaN(s)) {
        this._setDisplayRaw(""), this._setHiddenRaw(""), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
        return;
      }
      this._setHiddenRaw(s);
      const a = this.dom.getAttribute("data-ln-number-decimals");
      this._setDisplayRaw(lt(s, it(this.dom), { maxDecimals: a })), this.dom.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
  }), Object.defineProperty(h.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : f.get.call(this.dom);
    }
  }), h.prototype.destroy = function() {
    this.dom[e] && (this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), this.isTextElement || (this.dom.removeEventListener("input", this._onInput), this.dom.removeEventListener("keydown", this._onKeyDown), this.dom.removeEventListener("paste", this._onPaste), this._hidden && (this.dom.name = this._hidden.name, this._hidden.remove()), this.dom.type = "number", this.dom.removeAttribute("inputmode")), delete this.dom[e]);
  }, j(t, e, h, "ln-number", {
    attributes: l,
    extraAttributes: ["lang"],
    onAttributeChange: i
  });
})();
const Se = /^(short|medium|long)(\s+datetime)?$/, cr = {
  short: { dateStyle: "short" },
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  "short datetime": { dateStyle: "short", timeStyle: "short" },
  "medium datetime": { dateStyle: "medium", timeStyle: "short" },
  "long datetime": { dateStyle: "long", timeStyle: "short" }
};
function dr(t) {
  return !t || t === "" ? { dateStyle: "medium" } : String(t).trim().match(Se) ? cr[t.trim()] : null;
}
function Pt(t) {
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
  const f = [];
  for (let n = 0; n < 3; n++) {
    const o = parseInt(l[n], 10);
    if (isNaN(o)) return null;
    f.push(o);
  }
  let h, r, s;
  i === "." ? (h = f[0], r = f[1], s = f[2]) : i === "/" ? (r = f[0], h = f[1], s = f[2]) : l[0].length === 4 ? (s = f[0], r = f[1], h = f[2]) : (h = f[0], r = f[1], s = f[2]), s < 100 && (s += s < 50 ? 2e3 : 1900);
  const a = new Date(s, r - 1, h);
  return a.getFullYear() !== s || a.getMonth() !== r - 1 || a.getDate() !== h ? null : a;
}
function pe(t, e, i, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime()) || !e || typeof e != "string") return "";
  const f = t.getDate(), h = t.getMonth(), r = t.getFullYear(), s = t.getHours(), a = t.getMinutes();
  let n, o;
  const c = (i || "").toLowerCase().split("-")[0];
  let u = !1;
  try {
    const E = new Intl.DateTimeFormat(i, { month: "long" }).resolvedOptions().locale.toLowerCase().split("-")[0];
    u = !!(l && E !== c);
  } catch {
    u = !!l;
  }
  if (u && l && l.monthsLong)
    n = l.monthsLong[h];
  else
    try {
      n = new Intl.DateTimeFormat(i, { month: "long" }).format(t);
    } catch {
      n = String(h + 1);
    }
  if (u && l && l.monthsShort)
    o = l.monthsShort[h];
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
    dd: String(f).padStart(2, "0"),
    d: String(f),
    HH: String(s).padStart(2, "0"),
    mm: String(a).padStart(2, "0")
  };
  return e.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function(y) {
    return w[y] !== void 0 ? w[y] : y;
  });
}
function Qt(t, e, i, l) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const f = dr(e);
  if (f)
    try {
      const h = new Intl.DateTimeFormat(i, f), r = (i || "").toLowerCase().split("-")[0], s = h.resolvedOptions().locale.toLowerCase().split("-")[0];
      return l && s !== r ? pe(t, "dd.MM.yyyy", i, l) : h.format(t);
    } catch {
      return pe(t, "dd.MM.yyyy", i, l);
    }
  return pe(t, e || "dd.MM.yyyy", i, l);
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
        const c = ot(o.value);
        c && o._displayFormatted(c);
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
  }, f = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  function h(n, o, c) {
    L(n.dom, "ln-date:change", {
      value: o,
      formatted: n.dom.value,
      date: c
    }), n.dom.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function r(n, o, c, u) {
    n._setHiddenRaw(o), f.set.call(n._picker, o), n._lastISO = o, u !== void 0 ? (n._isFormatting = !0, n.dom.value = u, n._isFormatting = !1) : c && n._displayFormatted(c), h(n, o, c);
  }
  function s(n) {
    n._setHiddenRaw(""), f.set.call(n._picker, ""), n._isFormatting = !0, n.dom.value = "", n._isFormatting = !1, n._lastISO = "", h(n, "", null);
  }
  function a(n) {
    if (n[e]) return n[e];
    n[e] = this, this.dom = n;
    const o = this;
    if (this._onLocaleChange = function() {
      if (o.isTextElement)
        o._formatTextContent();
      else if (o.value) {
        const p = ot(o.value);
        p && o._displayFormatted(p);
      }
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), n.tagName !== "INPUT")
      return this.isTextElement = !0, this._initTextElement(), this;
    this.isTextElement = !1;
    const c = n.value, u = n.name, w = n.closest(".form-element, form") || n.parentNode;
    if (w) {
      const p = w.querySelectorAll("[data-ln-date-dict]");
      for (let d = 0; d < p.length; d++) {
        const _ = p[d].getAttribute("data-ln-date-dict");
        if (_) {
          const b = xe(p[d], "data-ln-date-dict-key");
          b["months-long"] && (b.monthsLong = b["months-long"].split(",").map((T) => T.trim())), b["months-short"] && (b.monthsShort = b["months-short"].split(",").map((T) => T.trim())), wn(_, b);
        }
      }
    }
    const y = document.createElement("span");
    y.setAttribute("data-ln-date-field", ""), n.parentNode.insertBefore(y, n), y.appendChild(n), this._wrapper = y;
    const E = document.createElement("input");
    E.type = "hidden", E.name = u, n.removeAttribute("name"), n.hasAttribute("data-ln-fill-as") && E.setAttribute("data-ln-fill-as", n.getAttribute("data-ln-fill-as")), n.insertAdjacentElement("afterend", E), this._hidden = E;
    const A = document.createElement("input");
    A.type = "date", A.tabIndex = -1, A.setAttribute("tabindex", "-1"), A.setAttribute("aria-hidden", "true"), A.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Date picker"), A.style.cssText = "position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none", E.insertAdjacentElement("afterend", A), this._picker = A, n.type = "text";
    const m = document.createElement("button");
    m.type = "button", m.setAttribute("aria-label", n.getAttribute("data-ln-date-label") || "Open date picker"), m.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>', A.insertAdjacentElement("afterend", m), this._btn = m, this._lastISO = "", Object.defineProperty(E, "value", {
      get: function() {
        return f.get.call(E);
      },
      set: function(p) {
        if (f.set.call(E, p), p && p !== "") {
          const d = ot(p);
          d && r(o, p, d);
        } else p === "" && s(o);
      }
    }), _n(n, f, {
      get: function() {
        return f.get.call(n);
      },
      set: function(p, d) {
        if (o._isFormatting) {
          d(p);
          return;
        }
        if (!p || p === "") {
          d(""), s(o);
          return;
        }
        const _ = ot(p) || Pt(p);
        if (_) {
          const b = Dt(_), T = n.getAttribute(t) || "", g = it(n), S = Lt(g), C = Qt(_, T, g, S);
          d(C), r(o, b, _, C);
        } else
          d(String(p)), s(o);
      }
    }), this._onPickerChange = function() {
      const p = A.value;
      if (p) {
        const d = ot(p);
        d && r(o, p, d);
      } else
        s(o);
    }, A.addEventListener("change", this._onPickerChange), this._onBlur = function() {
      const p = o.dom.value.trim();
      if (p === "") {
        o._lastISO !== "" && s(o);
        return;
      }
      if (o._lastISO) {
        const _ = ot(o._lastISO);
        if (_) {
          const b = o.dom.getAttribute(t) || "", T = it(o.dom), g = Lt(T);
          if (p === Qt(_, b, T, g)) return;
        }
      }
      const d = Pt(p);
      if (d) {
        const _ = Dt(d);
        r(o, _, d);
      } else if (o._lastISO) {
        const _ = ot(o._lastISO);
        _ && o._displayFormatted(_);
      } else
        o.dom.value = "";
    }, n.addEventListener("blur", this._onBlur), this._onBtnClick = function() {
      o._openPicker();
    }, m.addEventListener("click", this._onBtnClick);
    const v = n.form;
    if (v && (this._form = v, this._onFormReset = function() {
      setTimeout(function() {
        const p = o.dom.value;
        if (p) {
          const d = ot(p) || Pt(p);
          if (d) {
            const _ = Dt(d);
            r(o, _, d);
            return;
          }
        }
        s(o);
      }, 0);
    }, v.addEventListener("reset", this._onFormReset)), c && c !== "") {
      const p = ot(c);
      p && r(o, c, p);
    }
    return this;
  }
  a.prototype._initTextElement = function() {
    const n = this.dom, o = n.getAttribute("data-ln-value"), c = n.getAttribute("data-ln-date"), u = n.getAttribute("datetime");
    let w = null;
    n.tagName === "TIME" && u !== null && u !== "" ? w = u : o !== null && o !== "" ? w = o : u !== null && u !== "" ? w = u : c !== null && c !== "" && c !== "true" && !Se.test(c) ? w = c : w = n.textContent.trim();
    const y = ot(w) || Pt(w);
    if (y && !isNaN(y.getTime())) {
      const E = Dt(y);
      this._rawValue = E, n.tagName !== "TIME" && !n.hasAttribute("data-ln-value") && n.setAttribute("data-ln-value", E), this._formatTextContent();
    } else
      this._rawValue = null;
  }, a.prototype._formatTextContent = function() {
    if (this._rawValue) {
      const n = ot(this._rawValue);
      if (n) {
        let c = this.dom.getAttribute("data-ln-date-format");
        if (!c) {
          const y = this.dom.getAttribute("data-ln-date");
          y && Se.test(y) && (c = y);
        }
        const u = it(this.dom), w = Lt(u);
        this.dom.textContent = Qt(n, c || "medium", u, w);
      }
    }
  }, a.prototype._openPicker = function() {
    if (typeof this._picker.showPicker == "function")
      try {
        this._picker.showPicker();
      } catch {
        this._picker.click();
      }
    else
      this._picker.click();
  }, a.prototype._setHiddenRaw = function(n) {
    f.set.call(this._hidden, n);
  }, a.prototype._displayFormatted = function(n) {
    const o = this.dom.getAttribute(t) || "", c = it(this.dom), u = Lt(c);
    this._isFormatting = !0, this.dom.value = Qt(n, o, c, u), this._isFormatting = !1;
  }, Object.defineProperty(a.prototype, "value", {
    get: function() {
      return this.isTextElement ? this._rawValue || "" : f.get.call(this._hidden);
    },
    set: function(n) {
      if (this.isTextElement) {
        if (!n || n === "") {
          this._rawValue = null, this.dom.removeAttribute("data-ln-value"), this.dom.tagName === "TIME" && this.dom.removeAttribute("datetime"), this.dom.textContent = "";
          return;
        }
        const c = ot(n) || Pt(n);
        if (!c) return;
        const u = Dt(c);
        this._rawValue = u, this.dom.tagName === "TIME" ? this.dom.setAttribute("datetime", u) : this.dom.setAttribute("data-ln-value", u), this._formatTextContent();
        return;
      }
      if (!n || n === "") {
        s(this);
        return;
      }
      const o = ot(n);
      o && r(this, n, o);
    }
  }), Object.defineProperty(a.prototype, "date", {
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
  }), Object.defineProperty(a.prototype, "formatted", {
    get: function() {
      return this.isTextElement ? this.dom.textContent : this.dom.value;
    }
  }), a.prototype.destroy = function() {
    if (!this.dom[e]) return;
    if (this.isTextElement) {
      delete this.dom[e];
      return;
    }
    this._form && this._onFormReset && this._form.removeEventListener("reset", this._onFormReset), this._picker.removeEventListener("change", this._onPickerChange), this.dom.removeEventListener("blur", this._onBlur), this._btn.removeEventListener("click", this._onBtnClick);
    const n = this.value;
    this._hidden.remove(), this._picker.remove(), this._btn.remove(), this._wrapper && this._wrapper.parentNode && (this._wrapper.parentNode.insertBefore(this.dom, this._wrapper), this._wrapper.remove()), delete this.dom.value, this.dom.name = this._hidden.name, this.dom.type = "date", n && (this.dom.value = n), this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), delete this.dom[e];
  }, j(t, e, a, "ln-date", {
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
  }, l = et(i);
  if (history._lnNavCallbacks = history._lnNavCallbacks || [], !history._lnNavPatched) {
    const s = history.pushState;
    history.pushState = function() {
      s.apply(history, arguments);
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
  function f(s) {
    return this.dom = s, tt(this, s, l), this.activeClass = s.getAttribute(t) || "active", this.updateHandler = () => this.update(), window.addEventListener("popstate", this.updateHandler), history._lnNavCallbacks.push(this.updateHandler), this.observer = new MutationObserver(() => this.update()), this.observer.observe(s, { childList: !0, subtree: !0 }), this.update(), this;
  }
  f.prototype.update = function() {
    if (!this.activeClass || Z(this.dom, "ln-nav:before-update", { target: this.dom }).defaultPrevented) return;
    const a = Array.from(this.dom.querySelectorAll("a")), n = window.location.pathname, o = h(n), c = [];
    for (const u of a) {
      const w = u.getAttribute("href");
      if (!w || w === "#" || w.startsWith("#") || w.startsWith("javascript:") || w.startsWith("mailto:") || w.startsWith("tel:")) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      if (u.hostname && u.hostname !== window.location.hostname) {
        u.classList.remove(this.activeClass), u.removeAttribute("aria-current");
        continue;
      }
      const y = h(w), E = y === o, A = !this.exact && y !== "/" && o.startsWith(y + "/");
      E || A ? (u.classList.add(this.activeClass), u.setAttribute("aria-current", "page"), c.push(u)) : (u.classList.remove(this.activeClass), u.removeAttribute("aria-current"));
    }
    L(this.dom, "ln-nav:update", { target: this.dom, activeLinks: c });
  }, f.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this.observer && this.observer.disconnect(), window.removeEventListener("popstate", this.updateHandler);
    const s = history._lnNavCallbacks.indexOf(this.updateHandler);
    s !== -1 && history._lnNavCallbacks.splice(s, 1), delete this.dom[e];
  };
  function h(s) {
    try {
      return new URL(s, window.location.href).pathname.replace(/\/$/, "") || "/";
    } catch {
      return s.replace(/\/$/, "") || "/";
    }
  }
  function r(s, a) {
    const n = s[e];
    if (n) {
      if (a === t) {
        if (!s.hasAttribute(t)) {
          n.destroy();
          return;
        }
        const o = n.activeClass, c = s.getAttribute(t) || "active";
        if (o !== c) {
          const u = s.querySelectorAll("a");
          for (const w of u)
            o && w.classList.remove(o);
          n.activeClass = c;
        }
      }
      n.update();
    }
  }
  j(t, e, f, "ln-nav", {
    attributes: i
  });
})();
(function() {
  if (window.lnCore && window.lnCore._persistBound) return;
  window.lnCore = window.lnCore || {}, window.lnCore._persistBound = !0;
  function t() {
    return location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  }
  function e(r, s) {
    const a = r.getAttribute("data-ln-persist"), n = a !== null && a !== "" ? a : r.id;
    return n ? r.getAttribute("data-ln-persist-scope") === "page" ? "ln:" + n + ":" + t() + ":" + s : "ln:" + n + ":" + s : (console.warn('[ln-persist] Element requires id or data-ln-persist="key"', r), null);
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
  const f = /* @__PURE__ */ new Set();
  function h(r, s) {
    const a = window.lnCore && window.lnCore._attrRegistry, n = a && a.persist || [];
    let o = null;
    for (let y = 0; y < n.length; y++)
      if (n[y].selector === s) {
        o = n[y];
        break;
      }
    if (!o) return;
    const c = o.persist;
    if (f.has(c.attr) || (f.add(c.attr), $t([c.attr], function(y, E) {
      if (!y.hasAttribute("data-ln-persist") || c.hashActive && c.hashActive(y)) return;
      const A = e(y, E);
      if (!A || !l()) return;
      const m = y.getAttribute(E);
      try {
        m === null ? localStorage.removeItem(A) : localStorage.setItem(A, m);
      } catch {
      }
    })), c.hashActive && c.hashActive(r)) return;
    const u = e(r, c.attr);
    if (!u || !l()) return;
    const w = localStorage.getItem(u);
    w !== null && r.setAttribute(c.attr, w);
  }
  Ci(h);
})();
function Je(t, e, i, l) {
  const f = (t || "").toLowerCase().trim();
  if (f) return f;
  if ((e || "").toUpperCase() !== "A") return "";
  const h = i || "";
  if (!h.startsWith("#")) return "";
  const r = h.slice(1);
  if (!r) return "";
  const s = r.split("&"), a = (l || "").toLowerCase().trim();
  if (a)
    for (const c of s) {
      const u = c.indexOf(":");
      if (u > 0 && c.slice(0, u).toLowerCase().trim() === a)
        return c.slice(u + 1).toLowerCase().trim();
    }
  const n = s[s.length - 1] || "", o = n.indexOf(":");
  return (o > 0 ? n.slice(o + 1) : n).toLowerCase().trim();
}
function Ze(t, e) {
  if (!Array.isArray(t) || t.length === 0)
    return { hashEnabled: !1, warning: null };
  const i = t.filter(
    (h) => (h.tagName || "").toUpperCase() === "A" && (h.href || "").startsWith("#")
  ), l = i.length > 0 && i.length === t.length, f = (e || "").toLowerCase().trim();
  return i.length > 0 && i.length !== t.length ? { hashEnabled: !1, warning: "mixed" } : l && !f ? { hashEnabled: !1, warning: "missing-namespace" } : {
    hashEnabled: l && !!f,
    warning: null
  };
}
function tn(t, e, i) {
  const l = (t || "").toLowerCase().trim();
  return l && Array.isArray(e) && e.includes(l) ? l : (i || "").toLowerCase().trim();
}
(function() {
  const t = "data-ln-tabs", e = "lnTabs";
  if (window[e] !== void 0 && window[e] !== null) return;
  function i(a) {
    const n = a.getAttribute("data-ln-tabs-active");
    a[e] && a[e]._applyActive(n);
  }
  function l(a, n) {
    return (a.getAttribute(n) || a.id || "").toLowerCase().trim();
  }
  const f = {
    "data-ln-tabs": { type: "marker", description: "Mounts lnTabs component instance on tabs container" },
    "data-ln-tabs-active": { effect: i, type: "string", description: "Active tab key identifier" },
    "data-ln-tabs-default": { type: "string", description: "Default fallback tab key when none selected" },
    "data-ln-tabs-focus": { prop: "autoFocus", read: It, type: "boolean", fallback: !0, description: "Whether to shift focus to newly activated tab panel" },
    "data-ln-tabs-key": { prop: "nsKey", read: l, type: "string", description: "Hash namespace key for URL hash synchronization" },
    "data-ln-tab": { type: "string", description: "Tab trigger key identifier" },
    "data-ln-panel": { type: "string", description: "Tab content panel key identifier matching corresponding tab" }
  }, h = et(f);
  function r(a) {
    return this.dom = a, tt(this, a, h), this.activeKey = null, s.call(this), this;
  }
  function s() {
    this.tabs = Array.from(this.dom.querySelectorAll("[data-ln-tab]")), this.panels = Array.from(this.dom.querySelectorAll("[data-ln-panel]"));
    const a = this.tabs.map((c) => ({
      tagName: c.tagName,
      href: c.getAttribute("href")
    })), n = Ze(a, this.nsKey);
    this.hashEnabled = n.hashEnabled, n.warning === "mixed" ? console.warn('[ln-tabs] Mixed <a href="#…"> and <button> triggers in one group — using persist mode. Pick one: anchors for URL hash, buttons for localStorage persist.', this.dom) : n.warning === "missing-namespace" && console.warn("[ln-tabs] Anchor triggers need a hash namespace — add id or data-ln-tabs-key to the wrapper. Falling back to non-hash mode.", this.dom), this.mapTabs = {}, this.mapPanels = {};
    for (const c of this.tabs) {
      const u = Je(c.getAttribute("data-ln-tab"), c.tagName, c.getAttribute("href"), this.nsKey);
      u ? this.mapTabs[u] = c : console.warn('[ln-tabs] Trigger has no resolvable key — needs `data-ln-tab="key"` or `<a href="#…">`.', c);
    }
    for (const c of this.panels) {
      const u = (c.getAttribute("data-ln-panel") || "").toLowerCase().trim();
      u && (this.mapPanels[u] = c);
    }
    this.defaultKey = (this.dom.getAttribute("data-ln-tabs-default") || "").toLowerCase().trim() || Object.keys(this.mapTabs)[0] || "";
    const o = this;
    this._clickHandlers = [];
    for (const c of this.tabs) {
      if (c[e + "Trigger"]) continue;
      const u = function(w) {
        const y = c.tagName === "A";
        if (!y && (w.ctrlKey || w.metaKey || w.button === 1)) return;
        const E = Je(c.getAttribute("data-ln-tab"), c.tagName, c.getAttribute("href"), o.nsKey);
        E && (y && !Oe(w) || (o.hashEnabled ? ct(o.nsKey) === E ? o.dom.setAttribute("data-ln-tabs-active", E) : mt(o.nsKey, E) : o.dom.setAttribute("data-ln-tabs-active", E)));
      };
      c.addEventListener("click", u), c[e + "Trigger"] = u, o._clickHandlers.push({ el: c, handler: u });
    }
    if (this._onRequestSelect = function(c) {
      const u = c.detail && (c.detail.key || c.detail.tab);
      u && o.select(u);
    }, this.dom.addEventListener("ln-tabs:request-select", this._onRequestSelect), this._hashHandler = function() {
      if (!o.hashEnabled) return;
      const c = ct(o.nsKey);
      o.dom.setAttribute("data-ln-tabs-active", c !== null ? c : o.defaultKey);
    }, this.hashEnabled)
      window.addEventListener("hashchange", this._hashHandler), this._hashHandler();
    else {
      const c = tn(this.dom.getAttribute("data-ln-tabs-active"), Object.keys(this.mapPanels), this.defaultKey);
      this.dom.setAttribute("data-ln-tabs-active", c);
    }
  }
  r.prototype.select = function(a) {
    const n = (a + "").toLowerCase().trim();
    n && (this.hashEnabled ? ct(this.nsKey) === n ? this.dom.setAttribute("data-ln-tabs-active", n) : mt(this.nsKey, n) : this.dom.setAttribute("data-ln-tabs-active", n));
  }, r.prototype._applyActive = function(a) {
    var o;
    if (a = tn(a, Object.keys(this.mapPanels), this.defaultKey), a === this.activeKey) return;
    const n = this.activeKey;
    if (n !== null && Z(this.dom, "ln-tabs:before-change", {
      key: a,
      previousKey: n,
      tab: this.mapTabs[a],
      panel: this.mapPanels[a],
      target: this.dom
    }).defaultPrevented) {
      n in this.mapPanels && (this.dom.setAttribute("data-ln-tabs-active", n), this.hashEnabled && ct(this.nsKey) !== n && mt(this.nsKey, n));
      return;
    }
    this.activeKey = a;
    for (const c in this.mapTabs) {
      const u = this.mapTabs[c];
      c === a ? (u.setAttribute("data-active", ""), u.setAttribute("aria-selected", "true")) : (u.removeAttribute("data-active"), u.setAttribute("aria-selected", "false"));
    }
    for (const c in this.mapPanels) {
      const u = this.mapPanels[c], w = c === a;
      u.classList.toggle("hidden", !w), u.setAttribute("aria-hidden", w ? "false" : "true");
    }
    if (this.autoFocus) {
      const c = (o = this.mapPanels[a]) == null ? void 0 : o.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
      c && setTimeout(() => c.focus({ preventScroll: !0 }), 0);
    }
    L(this.dom, "ln-tabs:change", {
      key: a,
      previousKey: n,
      tab: this.mapTabs[a],
      panel: this.mapPanels[a],
      target: this.dom
    });
  }, r.prototype.destroy = function() {
    if (this.dom[e]) {
      this.dom.removeEventListener("ln-tabs:request-select", this._onRequestSelect);
      for (const { el: a, handler: n } of this._clickHandlers)
        a.removeEventListener("click", n), delete a[e + "Trigger"];
      this.hashEnabled && window.removeEventListener("hashchange", this._hashHandler), delete this.dom[e];
    }
  }, j(t, e, r, "ln-tabs", {
    attributes: f,
    persist: {
      attr: "data-ln-tabs-active",
      hashActive: function(a) {
        const n = Array.from(a.querySelectorAll("[data-ln-tab]")).map(function(c) {
          return { tagName: c.tagName, href: c.getAttribute("href") };
        }), o = (a.getAttribute("data-ln-tabs-key") || a.id || "").toLowerCase().trim();
        return Ze(n, o).hashEnabled;
      }
    }
  });
})();
(function() {
  const t = "data-ln-toggle", e = "lnToggle", i = "data-ln-toggle-for", l = "data-ln-toggle-action";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-toggle": { effect: u, type: "enum", values: ["open", "close"], fallback: "close", description: "Visibility state of toggleable element" },
    "data-ln-toggle-for": { type: "string", description: "Target element ID to toggle on trigger click" },
    "data-ln-toggle-action": { type: "enum", values: ["open", "close", "toggle"], fallback: "toggle", description: "Action performed on target element when trigger is clicked" }
  }, h = /* @__PURE__ */ new Set();
  let r = null;
  function s(w, y) {
    return y === "open" ? "open" : y === "close" || w === "open" ? "close" : "open";
  }
  function a() {
    r || (r = function(w) {
      if (Le(w)) return;
      const y = w.target.closest("[" + i + "]");
      if (!y || qe(y)) return;
      const E = y.getAttribute(i);
      if (!E) return;
      const A = document.getElementById(E);
      if (!A || !A[e]) return;
      w.preventDefault();
      const m = y.getAttribute(l) || "toggle", v = A.getAttribute(t);
      A.setAttribute(t, s(v, m));
    }, document.addEventListener("click", r));
  }
  function n() {
    h.size > 0 || !r || (document.removeEventListener("click", r), r = null);
  }
  function o(w, y) {
    if (!w || !w.id) return;
    const E = document.querySelectorAll(
      "[" + i + '="' + w.id + '"]'
    );
    for (let A = 0; A < E.length; A++)
      E[A].setAttribute("aria-expanded", y ? "true" : "false");
  }
  function c(w) {
    this.dom = w;
    const y = this;
    return this._onRequestOpen = function() {
      y.open();
    }, this._onRequestClose = function() {
      y.close();
    }, this._onRequestToggle = function() {
      y.toggle();
    }, this.dom.addEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.addEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.addEventListener("ln-toggle:request-toggle", this._onRequestToggle), this.isOpen = w.getAttribute(t) === "open", this.isOpen && w.classList.add("open"), o(w, this.isOpen), h.add(this), a(), this;
  }
  c.prototype.open = function() {
    this.dom.setAttribute(t, "open");
  }, c.prototype.close = function() {
    this.dom.setAttribute(t, "close");
  }, c.prototype.toggle = function() {
    const w = this.dom.getAttribute(t);
    this.dom.setAttribute(t, s(w, "toggle"));
  }, c.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:request-open", this._onRequestOpen), this.dom.removeEventListener("ln-toggle:request-close", this._onRequestClose), this.dom.removeEventListener("ln-toggle:request-toggle", this._onRequestToggle), h.delete(this), delete this.dom[e], n());
  };
  function u(w) {
    const y = w[e];
    if (!y) return;
    const A = w.getAttribute(t) === "open";
    if (A !== y.isOpen)
      if (A) {
        if (Z(w, "ln-toggle:before-open", { target: w }).defaultPrevented) {
          w.setAttribute(t, "close");
          return;
        }
        y.isOpen = !0, w.classList.add("open"), o(w, !0), L(w, "ln-toggle:open", { target: w });
      } else {
        if (Z(w, "ln-toggle:before-close", { target: w }).defaultPrevented) {
          w.setAttribute(t, "open");
          return;
        }
        y.isOpen = !1, w.classList.remove("open"), o(w, !1), L(w, "ln-toggle:close", { target: w });
      }
  }
  j(t, e, c, "ln-toggle", {
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
  function l(f) {
    return this.dom = f, this._onToggleOpen = function(h) {
      if (h.detail.target.closest("[data-ln-accordion]") !== f) return;
      const r = f.querySelectorAll("[data-ln-toggle]");
      for (const s of r)
        s !== h.detail.target && s.closest("[data-ln-accordion]") === f && s.getAttribute("data-ln-toggle") === "open" && s.setAttribute("data-ln-toggle", "close");
      L(f, "ln-accordion:change", { target: h.detail.target });
    }, f.addEventListener("ln-toggle:open", this._onToggleOpen), this;
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-toggle:open", this._onToggleOpen), delete this.dom[e]);
  }, j(t, e, l, "ln-accordion", {
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
  }, f = et(l);
  function h(r) {
    this.dom = r, tt(this, r, f), this.toggleEl = r.querySelector("[data-ln-toggle]"), this._boundDocClick = null, this._docClickTimeout = null, this._boundScrollReposition = null, this._boundResizeClose = null, this.toggleEl && (this.toggleEl.setAttribute("data-ln-dropdown-menu", ""), this.toggleEl.setAttribute("role", "menu"), this.toggleEl.setAttribute("popover", "manual"), this._initMenuAria()), this.triggerBtn = r.querySelector("[data-ln-toggle-for]"), this.triggerBtn && (this.triggerBtn.setAttribute("aria-haspopup", "menu"), this.triggerBtn.setAttribute("aria-expanded", "false"));
    const s = this;
    return this._onRequestOpen = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "open");
    }, this._onRequestClose = function() {
      s.toggleEl && s.toggleEl.setAttribute("data-ln-toggle", "close");
    }, this._onRequestToggle = function() {
      if (s.toggleEl) {
        const a = s.toggleEl.getAttribute("data-ln-toggle");
        s.toggleEl.setAttribute("data-ln-toggle", a === "open" ? "close" : "open");
      }
    }, this._onKeydown = function(a) {
      const n = s.toggleEl && s.toggleEl.getAttribute("data-ln-toggle") === "open";
      if (a.key === "Escape") {
        n && (a.preventDefault(), a.stopPropagation(), s.toggleEl.setAttribute("data-ln-toggle", "close"), s.triggerBtn && s.triggerBtn.focus());
        return;
      }
      if (a.key === "Tab") {
        n && (s.triggerBtn && s.triggerBtn.focus(), s.toggleEl.setAttribute("data-ln-toggle", "close"));
        return;
      }
      const o = s._getMenuItems();
      if (o.length === 0) return;
      if (!n && (a.key === "ArrowDown" || a.key === "ArrowUp")) {
        a.preventDefault(), s.toggleEl.setAttribute("data-ln-toggle", "open"), setTimeout(function() {
          const u = s._getMenuItems();
          u.length > 0 && s._focusItem(u, a.key === "ArrowDown" ? 0 : u.length - 1);
        }, 0);
        return;
      }
      if (!n) return;
      const c = o.indexOf(document.activeElement);
      if (a.key === "ArrowDown") {
        a.preventDefault();
        const u = c < o.length - 1 ? c + 1 : 0;
        s._focusItem(o, u);
      } else if (a.key === "ArrowUp") {
        a.preventDefault();
        const u = c > 0 ? c - 1 : o.length - 1;
        s._focusItem(o, u);
      } else a.key === "Home" ? (a.preventDefault(), s._focusItem(o, 0)) : a.key === "End" && (a.preventDefault(), s._focusItem(o, o.length - 1));
    }, this.dom.addEventListener("ln-dropdown:request-open", this._onRequestOpen), this.dom.addEventListener("ln-dropdown:request-close", this._onRequestClose), this.dom.addEventListener("ln-dropdown:request-toggle", this._onRequestToggle), this.dom.addEventListener("keydown", this._onKeydown), this._onToggleOpen = function(a) {
      !a.detail || a.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "true"), typeof s.toggleEl.showPopover == "function" && s.toggleEl.showPopover(), s._initMenuAria(), s._reposition(), s._addOutsideClickListener(), s._addScrollRepositionListener(), s._addResizeCloseListener(), L(r, "ln-dropdown:open", { target: a.detail.target }));
    }, this._onToggleClose = function(a) {
      !a.detail || a.detail.target !== s.toggleEl || (s.triggerBtn && s.triggerBtn.setAttribute("aria-expanded", "false"), s._removeOutsideClickListener(), s._removeScrollRepositionListener(), s._removeResizeCloseListener(), s.toggleEl.style.top = "", s.toggleEl.style.left = "", s.toggleEl.removeAttribute("data-ln-dropdown-placement"), typeof s.toggleEl.hidePopover == "function" && s.toggleEl.matches(":popover-open") && s.toggleEl.hidePopover(), L(r, "ln-dropdown:close", { target: a.detail.target }));
    }, this.toggleEl && (this.toggleEl.addEventListener("ln-toggle:open", this._onToggleOpen), this.toggleEl.addEventListener("ln-toggle:close", this._onToggleClose)), this;
  }
  h.prototype._initMenuAria = function() {
    if (!this.toggleEl) return;
    const r = this.toggleEl.querySelectorAll("li");
    for (const a of r)
      a.setAttribute("role", "none");
    const s = this._getMenuItems();
    for (let a = 0; a < s.length; a++)
      s[a].setAttribute("role", "menuitem"), s[a].setAttribute("tabindex", a === 0 ? "0" : "-1");
  }, h.prototype._getMenuItems = function() {
    return this.toggleEl ? Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])')) : [];
  }, h.prototype._focusItem = function(r, s) {
    for (let a = 0; a < r.length; a++)
      r[a].setAttribute("tabindex", a === s ? "0" : "-1");
    r[s] && r[s].focus();
  }, h.prototype._reposition = function() {
    if (!this.triggerBtn || !this.toggleEl) return;
    const r = this.triggerBtn.getBoundingClientRect(), s = ye(this.toggleEl), a = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-xs")) * 16 || 4, n = this.position || i, o = ee(r, s, n, a);
    this.toggleEl.style.top = o.top + "px", this.toggleEl.style.left = o.left + "px", this.toggleEl.setAttribute("data-ln-dropdown-placement", o.placement);
  }, h.prototype._addOutsideClickListener = function() {
    if (this._boundDocClick) return;
    const r = this;
    this._boundDocClick = function(s) {
      r.dom.contains(s.target) || r.toggleEl && r.toggleEl.contains(s.target) || r.toggleEl && r.toggleEl.getAttribute("data-ln-toggle") === "open" && r.toggleEl.setAttribute("data-ln-toggle", "close");
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
    attributes: l
  });
})();
(function() {
  const t = "data-ln-popover", e = "lnPopover", i = "data-ln-popover-for", l = "data-ln-popover-position";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-popover": { type: "enum", values: ["open", "close"], fallback: "close", effect: c, description: "Control state of the popover" },
    "data-ln-popover-for": { type: "string", description: "Target element ID that this trigger controls" },
    "data-ln-popover-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "bottom", description: "Preferred positioning anchor" },
    "data-ln-popover-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  }, h = [];
  let r = null;
  function s() {
    r || (r = function(u) {
      if (u.key !== "Escape" || h.length === 0) return;
      h[h.length - 1].close();
    }, document.addEventListener("keydown", r));
  }
  function a() {
    h.length > 0 || r && (document.removeEventListener("keydown", r), r = null);
  }
  function n(u) {
    this.dom = u, this.isOpen = u.getAttribute(t) === "open", this.trigger = null, this._previousFocus = null, this._boundDocClick = null, this._docClickTimeout = null, this._boundReposition = null;
    const w = this;
    return this._onRequestOpen = function(y) {
      const E = y.detail && y.detail.trigger ? y.detail.trigger : null;
      w.open(E);
    }, this._onRequestClose = function() {
      w.close();
    }, this._onRequestToggle = function(y) {
      const E = y.detail && y.detail.trigger ? y.detail.trigger : null;
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
    const w = ye(this.dom);
    if (this.trigger) {
      const m = this.trigger.getBoundingClientRect(), v = this.dom.getAttribute(l) || "bottom", p = ee(m, w, v, 8);
      this.dom.style.top = p.top + "px", this.dom.style.left = p.left + "px", this.dom.setAttribute("data-ln-popover-placement", p.placement), this.trigger.setAttribute("aria-expanded", "true");
    }
    const y = this.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), E = Array.prototype.find.call(y, zt);
    E ? E.focus() : this.dom.focus();
    const A = this;
    this._boundDocClick = function(m) {
      A.dom.contains(m.target) || A.trigger && A.trigger.contains(m.target) || A.close();
    }, A._docClickTimeout = setTimeout(function() {
      A._docClickTimeout = null, document.addEventListener("click", A._boundDocClick);
    }, 0), this._boundReposition = function() {
      if (!A.trigger) return;
      const m = A.trigger.getBoundingClientRect(), v = ye(A.dom), p = A.dom.getAttribute(l) || "bottom", d = ee(m, v, p, 8);
      A.dom.style.top = d.top + "px", A.dom.style.left = d.left + "px", A.dom.setAttribute("data-ln-popover-placement", d.placement);
    }, window.addEventListener("scroll", this._boundReposition, { passive: !0, capture: !0 }), window.addEventListener("resize", this._boundReposition), h.push(this), s(), L(this.dom, "ln-popover:open", {
      popoverId: this.dom.id,
      target: this.dom,
      trigger: this.trigger
    });
  }, n.prototype._applyClose = function() {
    this.isOpen = !1, this._docClickTimeout && (clearTimeout(this._docClickTimeout), this._docClickTimeout = null), this._boundDocClick && (document.removeEventListener("click", this._boundDocClick), this._boundDocClick = null), this._boundReposition && (window.removeEventListener("scroll", this._boundReposition, { capture: !0 }), window.removeEventListener("resize", this._boundReposition), this._boundReposition = null), this.dom.style.top = "", this.dom.style.left = "", this.dom.removeAttribute("data-ln-popover-placement"), this.trigger && this.trigger.setAttribute("aria-expanded", "false"), typeof this.dom.hidePopover == "function" && this.dom.matches(":popover-open") && this.dom.hidePopover();
    const u = h.indexOf(this);
    u !== -1 && h.splice(u, 1), a(), this._previousFocus && this.trigger && this._previousFocus === this.trigger ? this.trigger.focus() : this.trigger && document.activeElement === document.body && this.trigger.focus(), this._previousFocus = null, L(this.dom, "ln-popover:close", {
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
    return u.setAttribute("aria-haspopup", "dialog"), u.setAttribute("aria-expanded", "false"), u.setAttribute("aria-controls", w), this._onClick = function(y) {
      if (y.ctrlKey || y.metaKey || y.button === 1) return;
      y.preventDefault();
      const E = document.getElementById(w);
      if (!E) return;
      E[e] && (E[e].trigger = u);
      const A = E.getAttribute(t);
      E.setAttribute(t, A === "open" ? "closed" : "open");
    }, u.addEventListener("click", this._onClick), this;
  }
  o.prototype.destroy = function() {
    this.dom.removeEventListener("click", this._onClick), delete this.dom[e + "Trigger"];
  };
  function c(u) {
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
    attributes: f
  }), j(i, e + "Trigger", o, "ln-popover-trigger");
})();
(function() {
  const t = "data-ln-tooltip-enhance", e = "data-ln-tooltip", i = "data-ln-tooltip-position", l = "lnTooltipEnhance", f = "ln-tooltip-portal";
  if (window[l] !== void 0) return;
  const h = {
    "data-ln-tooltip-enhance": { type: "marker", description: "Activates enhanced tooltip behavior on element or container" },
    "data-ln-tooltip-enhanced": { type: "marker", description: "Runtime marker applied to enhanced tooltip trigger" },
    "data-ln-tooltip": { type: "string", description: "Tooltip text content to display" },
    "data-ln-tooltip-position": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], fallback: "top", description: "Preferred positioning anchor" },
    "data-ln-tooltip-placement": { type: "enum", values: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"], description: "Active calculated placement applied at runtime" }
  };
  let r = 0, s = null, a = null, n = null, o = null, c = null, u = null;
  function w() {
    return s && s.parentNode || (s = document.getElementById(f), s || (s = document.createElement("div"), s.id = f, document.body.appendChild(s)), s.hasAttribute("popover") || s.setAttribute("popover", "manual")), s;
  }
  function y() {
    u || (u = function(p) {
      p.key === "Escape" && m();
    }, document.addEventListener("keydown", u));
  }
  function E() {
    u && (document.removeEventListener("keydown", u), u = null);
  }
  function A(p) {
    if (n === p) return;
    m();
    const d = p.getAttribute(e) || p.getAttribute("title");
    if (!d) return;
    w(), typeof s.showPopover == "function" && s.showPopover(), p.hasAttribute("title") && (o = p.getAttribute("title"), p.removeAttribute("title"));
    const _ = p.getAttribute("aria-describedby");
    _ ? c = _ : c = null;
    const b = document.createElement("div");
    b.className = "ln-tooltip", b.textContent = d, p[l + "Uid"] || (r += 1, p[l + "Uid"] = "ln-tooltip-" + r), b.id = p[l + "Uid"], s.appendChild(b);
    const T = b.offsetWidth, g = b.offsetHeight, S = p.getBoundingClientRect(), C = p.getAttribute(i) || "top", q = ee(S, { width: T, height: g }, C, 6);
    b.style.top = q.top + "px", b.style.left = q.left + "px", b.setAttribute("data-ln-tooltip-placement", q.placement), c ? p.setAttribute("aria-describedby", c + " " + b.id) : p.setAttribute("aria-describedby", b.id), a = b, n = p, y();
  }
  function m() {
    if (!a) {
      E();
      return;
    }
    n && (c !== null ? n.setAttribute("aria-describedby", c) : n.removeAttribute("aria-describedby"), c = null, o !== null && n.setAttribute("title", o)), o = null, a.parentNode && a.parentNode.removeChild(a), a = null, n = null, s && typeof s.hidePopover == "function" && s.matches(":popover-open") && s.hidePopover(), E();
  }
  function v(p) {
    return this.dom = p, p.hasAttribute("data-ln-tooltip-enhanced") || (p.setAttribute("data-ln-tooltip-enhanced", ""), this._addedEnhancedAttr = !0), this._onEnter = function() {
      A(p);
    }, this._onLeave = function() {
      n === p && !p.contains(document.activeElement) && m();
    }, this._onFocus = function() {
      A(p);
    }, this._onBlur = function() {
      n === p && !p.matches(":hover") && m();
    }, p.addEventListener("mouseenter", this._onEnter), p.addEventListener("mouseleave", this._onLeave), p.addEventListener("focus", this._onFocus, !0), p.addEventListener("blur", this._onBlur, !0), this;
  }
  v.prototype.destroy = function() {
    const p = this.dom;
    p.removeEventListener("mouseenter", this._onEnter), p.removeEventListener("mouseleave", this._onLeave), p.removeEventListener("focus", this._onFocus, !0), p.removeEventListener("blur", this._onBlur, !0), n === p && m(), this._addedEnhancedAttr && p.removeAttribute("data-ln-tooltip-enhanced"), delete p[l], delete p[l + "Uid"];
  }, j(
    "[" + t + "], [data-ln-tooltip-enhanced], [" + e + "][title]",
    l,
    v,
    "ln-tooltip",
    {
      attributes: h
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
  }, f = et(l);
  function h(A) {
    if (!(!A || !(A instanceof HTMLElement)) && (A.hasAttribute("popover") || A.setAttribute("popover", "manual"), typeof A.showPopover == "function")) {
      if (A.matches(":popover-open"))
        try {
          A.hidePopover();
        } catch {
        }
      try {
        A.showPopover();
      } catch {
      }
    }
  }
  function r(A) {
    if (!A || !(A instanceof HTMLElement)) return;
    if (A.querySelectorAll("[data-ln-toast-item]").length === 0 && typeof A.hidePopover == "function" && A.matches(":popover-open"))
      try {
        A.hidePopover();
      } catch {
      }
  }
  function s(A) {
    this.dom = A, tt(this, A, f);
    const m = Array.from(A.querySelectorAll("[data-ln-toast-item]"));
    for (; m.length > this.max; ) A.removeChild(m.shift());
    for (const v of m) w(v, this);
    return m.length > 0 && h(A), this;
  }
  s.prototype.enqueue = function(A) {
    if (!A) return;
    const m = a(A, this.dom);
    if (!m) return;
    const v = Number.isFinite(A.timeout) ? A.timeout : this.timeoutDefault;
    o(this, m), v > 0 && (m._timer = setTimeout(() => c(m), v));
  }, s.prototype.clear = function() {
    for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
      c(A);
  }, s.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const A of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]")))
        c(A);
      r(this.dom), delete this.dom[e];
    }
  };
  function a(A, m) {
    const v = ((A.type || "") + "").trim().toLowerCase(), p = Ct(m, i, "ln-toast");
    if (!p)
      return console.warn('[ln-toast] Template "' + i + '" not found'), null;
    ht(p, {
      type: v,
      title: A.title,
      message: typeof A.message == "string" ? A.message : void 0
    });
    const d = p.firstElementChild;
    if (!d) return null;
    d.hasAttribute("data-ln-toast-item") || d.setAttribute("data-ln-toast-item", ""), d.classList.add("ln-enter");
    const _ = d.querySelector(".body");
    _ && n(_, A);
    const b = d.querySelector("[data-ln-toast-close]");
    return b && b.addEventListener("click", function() {
      c(d);
    }), d;
  }
  function n(A, m) {
    if (Array.isArray(m.message)) {
      const v = document.createElement("ul");
      for (const p of m.message) {
        const d = document.createElement("li");
        d.textContent = p, v.appendChild(d);
      }
      A.appendChild(v);
    }
    if (m.data && m.data.errors) {
      const v = document.createElement("ul");
      for (const p of Object.values(m.data.errors).flat()) {
        const d = document.createElement("li");
        d.textContent = p, v.appendChild(d);
      }
      A.appendChild(v);
    }
  }
  function o(A, m) {
    const v = Array.from(A.dom.querySelectorAll("[data-ln-toast-item]"));
    for (; v.length >= A.max && v.length > 0; ) A.dom.removeChild(v.shift());
    A.dom.appendChild(m), h(A.dom), requestAnimationFrame(() => m.classList.remove("ln-enter"));
  }
  function c(A) {
    if (!A || !A.parentNode) return;
    const m = A.parentNode;
    clearTimeout(A._timer), A.classList.remove("ln-enter"), A.classList.add("ln-out"), setTimeout(() => {
      A.parentNode && (A.parentNode.removeChild(A), r(m));
    }, 200);
  }
  function u(A) {
    let m = A && A.container;
    return typeof m == "string" && (m = document.querySelector(m)), m instanceof HTMLElement || (m = document.querySelector("[" + t + "]") || document.getElementById("ln-toast-container")), m || null;
  }
  function w(A, m) {
    if (A._lnToastHydrated) return;
    A._lnToastHydrated = !0;
    const v = A.querySelector("[data-ln-toast-close]");
    v && v.addEventListener("click", function() {
      c(A);
    });
    const p = +(A.getAttribute("data-ln-toast-timeout") ?? m.timeoutDefault);
    p > 0 && (A._timer = setTimeout(function() {
      c(A);
    }, p));
  }
  function y(A) {
    const m = A.detail || {}, v = u(m);
    if (!v) {
      console.warn("[ln-toast] No toast container found");
      return;
    }
    (v[e] || (v[e] = new s(v))).enqueue(m);
  }
  function E(A) {
    const m = A && A.detail || {};
    if (m.container) {
      const v = u(m);
      v && (v[e] || (v[e] = new s(v))).clear();
    } else {
      const v = document.querySelectorAll("[" + t + "]");
      for (const p of Array.from(v))
        (p[e] || (p[e] = new s(p))).clear();
    }
  }
  pt(function() {
    window.addEventListener("ln-toast:enqueue", y), window.addEventListener("ln-toast:clear", E), window.addEventListener("ln-modal:open", function() {
      const A = document.querySelectorAll("[" + t + "], #ln-toast-container");
      for (const m of Array.from(A))
        m.querySelectorAll("[data-ln-toast-item]").length > 0 && h(m);
    });
  }, "ln-toast"), j(t, e, s, "ln-toast", {
    attributes: l
  });
})();
function ur(t) {
  if (!t) return null;
  const e = String(t).split(",").map((i) => i.trim().toLowerCase()).filter(Boolean).map((i) => i.startsWith(".") ? i.slice(1) : i);
  return e.length ? e : null;
}
function Zn(t) {
  return !t || typeof t != "string" || !t.includes(".") ? "" : t.split(".").pop().toLowerCase();
}
function fr(t, e) {
  if (!e || e.length === 0) return !0;
  if (!t) return !1;
  const i = Zn(t.name), l = String(t.type || "").toLowerCase();
  return e.some((f) => {
    if (f.includes("/")) {
      if (f.endsWith("/*")) {
        const h = f.slice(0, -1);
        return l.startsWith(h);
      }
      return l === f;
    }
    return i === f;
  });
}
function hr(t, e = "en", i = {}) {
  if (typeof t != "number" || isNaN(t) || t === 0)
    return "0 " + (i["unit-b"] || "B");
  const l = 1024, f = [
    i["unit-b"] || "B",
    i["unit-kb"] || "KB",
    i["unit-mb"] || "MB",
    i["unit-gb"] || "GB"
  ], h = Math.floor(Math.log(t) / Math.log(l)), r = Math.min(h, f.length - 1), s = t / Math.pow(l, r);
  return new Intl.NumberFormat(e, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(s) + " " + f[r];
}
(function() {
  const t = "data-ln-upload", e = "lnUpload", i = "file", l = "file_ids[]";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-upload": { prop: "uploadUrl", read: $, type: "string", fallback: "", description: "Endpoint URL for file uploads" },
    "data-ln-upload-accept": { type: "string", description: "Comma-separated list of allowed file extensions or MIME types" },
    "data-ln-upload-delete": { prop: "deleteUrlPattern", read: $, type: "string", fallback: "", description: "Endpoint URL pattern for deleting uploaded files" },
    "data-ln-upload-max-size": { prop: "maxSize", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum allowed file size in bytes (0 for unlimited)" },
    "data-ln-upload-max-files": { prop: "maxFiles", read: xt, type: "integer", fallback: 0, min: 0, description: "Maximum number of files allowed in upload queue (0 for unlimited)" },
    "data-ln-upload-file-field": { prop: "fileFieldName", read: $, type: "string", fallback: i, description: "Form data field name used for file payloads" },
    "data-ln-upload-ids-field": { prop: "idsFieldName", read: $, type: "string", fallback: l, description: "Form field name for submitting uploaded file IDs" },
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
  }, h = et(f);
  function r(n, o, c) {
    return hr(n, o, c);
  }
  function s() {
    const n = document.querySelector('meta[name="csrf-token"]');
    return n ? n.getAttribute("content") : "";
  }
  function a(n) {
    this.dom = n, tt(this, n, h), this.dict = xe(n, "data-ln-upload-dict"), this.locale = it(n), this.zone = n.querySelector("[data-ln-upload-zone]") || n, this.list = n.querySelector("[data-ln-upload-list]"), this.input = n.querySelector('input[type="file"]'), this.input || console.warn('[ln-upload] Missing <input type="file"> in container:', n);
    const o = n.getAttribute("data-ln-upload-accept") || (this.input ? this.input.getAttribute("accept") : "");
    return this.allowedExts = ur(o), this.uploadedFiles = /* @__PURE__ */ new Map(), this.fileIdCounter = 0, this._dragDepth = 0, this._hydrate(), this._bindEvents(), this;
  }
  a.prototype._hydrate = function() {
    const n = this;
    if (!this.list) return;
    const o = this.list.querySelectorAll("[data-ln-upload-item]");
    for (let u = 0; u < o.length; u++) {
      const w = o[u], y = w.getAttribute("data-ln-upload-id"), E = "file-" + ++n.fileIdCounter;
      w.setAttribute("data-ln-upload-local-id", E);
      const A = w.querySelector('[data-ln-field="name"]'), m = w.querySelector('[data-ln-field="sizeText"]'), v = w.getAttribute("data-ln-upload-size"), p = v ? parseInt(v, 10) : null;
      n.uploadedFiles.set(E, {
        serverId: y || null,
        name: A ? A.textContent.trim() : "",
        size: p !== null && !isNaN(p) ? p : m ? m.textContent.trim() : ""
      });
    }
    const c = this.dom.querySelectorAll('input[type="hidden"]');
    for (let u = 0; u < c.length; u++) {
      const w = c[u];
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
  }, a.prototype._syncHiddenInputs = function() {
    const n = this, o = this.dom.querySelectorAll('input[type="hidden"]');
    for (let c = 0; c < o.length; c++)
      o[c].name === n.idsFieldName && o[c].remove();
    for (const [, c] of this.uploadedFiles)
      if (c.serverId) {
        const u = document.createElement("input");
        u.type = "hidden", u.name = n.idsFieldName, u.value = c.serverId, n.dom.appendChild(u);
      }
  }, a.prototype._bindEvents = function() {
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
      const c = o.target.closest('[data-ln-upload-action="remove"]');
      if (!c || !n.list || !n.list.contains(c) || c.disabled) return;
      const u = c.closest("[data-ln-upload-item]");
      if (u) {
        const w = u.getAttribute("data-ln-upload-local-id");
        w && n.remove(w);
      }
    }, this._onRequestUpload = function(o) {
      o.detail && o.detail.files && n.upload(o.detail.files);
    }, this._onRequestRemove = function(o) {
      if (o.detail) {
        const c = o.detail.localId !== void 0 ? o.detail.localId : o.detail.serverId;
        c !== void 0 && n.remove(c);
      }
    }, this._onRequestClear = function() {
      n.clear();
    }, this.zone.addEventListener("click", this._onZoneClick), this.input && this.input.addEventListener("change", this._onInputChange), this.zone.addEventListener("dragenter", this._onDragEnter), this.zone.addEventListener("dragover", this._onDragOver), this.zone.addEventListener("dragleave", this._onDragLeave), this.zone.addEventListener("drop", this._onDrop), this.list && this.list.addEventListener("click", this._onListClick), this.dom.addEventListener("ln-upload:request-upload", this._onRequestUpload), this.dom.addEventListener("ln-upload:request-remove", this._onRequestRemove), this.dom.addEventListener("ln-upload:request-clear", this._onRequestClear);
  }, a.prototype.upload = function(n) {
    const o = this, c = Array.from(n);
    for (let u = 0; u < c.length; u++) {
      const w = c[u];
      if (o.maxFiles > 0 && o.uploadedFiles.size >= o.maxFiles) {
        L(o.dom, "ln-upload:invalid", {
          file: w,
          reason: "max-files"
        });
        continue;
      }
      if (!fr(w, o.allowedExts)) {
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
  }, a.prototype._uploadSingleFile = function(n) {
    const o = this, c = "file-" + ++o.fileIdCounter, u = Zn(n.name);
    let w = null;
    if (this.list) {
      const v = Ct(this.dom, "ln-upload-item", "ln-upload");
      if (v && (w = v.firstElementChild, w)) {
        w.setAttribute("data-ln-upload-item", ""), w.setAttribute("data-ln-upload-local-id", c), w.setAttribute("data-ln-upload-ext", u), w.setAttribute("data-ln-upload-state", "uploading"), ht(w, {
          name: n.name,
          sizeText: "0%",
          removeLabel: o.dict.remove || "Remove",
          uploading: !0,
          error: !1,
          deleting: !1
        });
        const p = w.querySelector('[data-ln-upload-action="remove"]');
        p && (p.disabled = !0);
        const d = w.querySelector("[data-ln-progress]");
        d && d.setAttribute("data-ln-progress", "0"), o.list.appendChild(w);
      }
    }
    const y = new FormData();
    y.append(o.fileFieldName, n);
    const E = this.dom.querySelectorAll("input, select, textarea");
    for (let v = 0; v < E.length; v++) {
      const p = E[v];
      !p.name || p.name === o.idsFieldName || p.type === "file" || (p.type === "checkbox" || p.type === "radio") && !p.checked || y.append(p.name, p.value);
    }
    const A = new XMLHttpRequest();
    o.uploadedFiles.set(c, {
      serverId: null,
      name: n.name,
      size: n.size,
      xhr: A
    }), A.upload.addEventListener("progress", function(v) {
      if (v.lengthComputable) {
        const p = Math.round(v.loaded / v.total * 100);
        if (w) {
          const d = w.querySelector("[data-ln-progress]");
          d && d.setAttribute("data-ln-progress", String(p)), ht(w, { sizeText: p + "%" });
        }
        L(o.dom, "ln-upload:progress", {
          localId: c,
          file: n,
          percent: p,
          loaded: v.loaded,
          total: v.total
        });
      }
    }), A.addEventListener("load", function() {
      const v = o.uploadedFiles.get(c);
      if (v && delete v.xhr, A.status >= 200 && A.status < 300) {
        let p;
        try {
          p = JSON.parse(A.responseText);
        } catch (_) {
          m(o.dict.error || "Error", A.status, _);
          return;
        }
        const d = p.id || p.serverId;
        if (w) {
          w.removeAttribute("data-ln-upload-state"), d && w.setAttribute("data-ln-upload-id", String(d)), ht(w, {
            sizeText: r(p.size || n.size, o.locale, o.dict),
            uploading: !1
          });
          const _ = w.querySelector('[data-ln-upload-action="remove"]');
          _ && (_.disabled = !1);
        }
        v && (v.serverId = d, v.size = p.size || n.size, v.name = p.name || n.name), o._syncHiddenInputs(), L(o.dom, "ln-upload:uploaded", {
          localId: c,
          serverId: d,
          name: p.name || n.name,
          size: p.size || n.size,
          response: p
        });
      } else {
        let p = "";
        try {
          p = JSON.parse(A.responseText).message || "";
        } catch {
        }
        m(p, A.status, null);
      }
    }), A.addEventListener("error", function() {
      const v = o.uploadedFiles.get(c);
      v && delete v.xhr, m("", 0, null);
    });
    function m(v, p, d) {
      if (w) {
        w.setAttribute("data-ln-upload-state", "error"), ht(w, {
          sizeText: o.dict.error || "Error",
          uploading: !1,
          error: !0
        });
        const _ = w.querySelector('[data-ln-upload-action="remove"]');
        _ && (_.disabled = !1);
      }
      L(o.dom, "ln-upload:error", {
        file: n,
        message: v,
        status: p,
        error: d
      });
    }
    o.uploadUrl ? (A.open("POST", o.uploadUrl), A.setRequestHeader("X-CSRF-TOKEN", s()), A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.setRequestHeader("Accept", "application/json"), A.send(y)) : console.warn("[ln-upload] No upload URL configured (missing data-ln-upload)");
  }, a.prototype.remove = function(n) {
    const o = this;
    let c = null, u = null;
    if (o.uploadedFiles.has(n))
      c = n, u = o.uploadedFiles.get(n);
    else
      for (const [A, m] of o.uploadedFiles)
        if (String(m.serverId) === String(n)) {
          c = A, u = m;
          break;
        }
    if (!c || !u || Z(o.dom, "ln-upload:before-remove", {
      localId: c,
      serverId: u.serverId
    }).defaultPrevented) return;
    const y = o.list ? o.list.querySelector('[data-ln-upload-local-id="' + c + '"]') : null;
    if (u.xhr && typeof u.xhr.abort == "function" && u.xhr.abort(), !u.serverId) {
      y && y.remove(), o.uploadedFiles.delete(c), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: c, serverId: null });
      return;
    }
    let E = null;
    if (o.deleteUrlPattern ? E = o.deleteUrlPattern.replace("{id}", encodeURIComponent(u.serverId)) : o.uploadUrl && o.uploadUrl.includes("{id}") && (E = o.uploadUrl.replace("{id}", encodeURIComponent(u.serverId))), !E) {
      y && y.remove(), o.uploadedFiles.delete(c), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", { localId: c, serverId: u.serverId });
      return;
    }
    y && (y.setAttribute("data-ln-upload-state", "deleting"), ht(y, { deleting: !0 })), fetch(E, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": s(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    }).then(function(A) {
      A.ok ? (y && y.remove(), o.uploadedFiles.delete(c), o._syncHiddenInputs(), L(o.dom, "ln-upload:removed", {
        localId: c,
        serverId: u.serverId
      })) : (y && (y.removeAttribute("data-ln-upload-state"), ht(y, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: A.status
      }));
    }).catch(function(A) {
      y && (y.removeAttribute("data-ln-upload-state"), ht(y, { deleting: !1 })), L(o.dom, "ln-upload:error", {
        file: u,
        message: "",
        status: 0,
        error: A
      });
    });
  }, a.prototype.clear = function() {
    const n = this;
    if (!Z(n.dom, "ln-upload:before-clear", {}).defaultPrevented) {
      for (const [, c] of this.uploadedFiles)
        if (c.xhr && typeof c.xhr.abort == "function" && c.xhr.abort(), c.serverId) {
          let u = null;
          n.deleteUrlPattern ? u = n.deleteUrlPattern.replace("{id}", encodeURIComponent(c.serverId)) : n.uploadUrl && n.uploadUrl.includes("{id}") && (u = n.uploadUrl.replace("{id}", encodeURIComponent(c.serverId))), u && fetch(u, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": s(),
              "X-Requested-With": "XMLHttpRequest",
              Accept: "application/json"
            }
          }).catch(function() {
          });
        }
      n.uploadedFiles.clear(), n.list && (n.list.innerHTML = ""), n._syncHiddenInputs(), L(n.dom, "ln-upload:cleared", {});
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
  }, j(t, e, a, "ln-upload", {
    attributes: f
  });
})();
function ti(t, e) {
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
function ei(t) {
  if (t == null || t === "") return "";
  const e = String(t);
  if (typeof TextEncoder < "u" && typeof btoa < "u") {
    const i = new TextEncoder().encode(e);
    let l = "";
    const f = i.length;
    for (let h = 0; h < f; h++)
      l += String.fromCharCode(i[h]);
    return btoa(l);
  }
  return typeof Buffer < "u" ? Buffer.from(e, "utf-8").toString("base64") : "";
}
function ni(t) {
  if (t == null || t === "") return "";
  try {
    const e = String(t).trim();
    if (typeof atob < "u" && typeof TextDecoder < "u") {
      const i = atob(e), l = new Uint8Array(i.length);
      for (let f = 0; f < i.length; f++)
        l[f] = i.charCodeAt(f);
      return new TextDecoder().decode(l);
    }
    if (typeof Buffer < "u")
      return Buffer.from(e, "base64").toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function ii(t, e) {
  const i = String(e || "ln-ashlar");
  let l;
  typeof TextEncoder < "u" ? l = new TextEncoder().encode(i) : typeof Buffer < "u" ? l = Buffer.from(i, "utf-8") : l = [108, 110];
  const f = l.length || 1, h = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++)
    h[r] = t[r] ^ l[r % f];
  return h;
}
function ri(t, e = "ln-ashlar") {
  if (t == null || t === "") return "";
  const i = String(t);
  let l;
  if (typeof TextEncoder < "u")
    l = new TextEncoder().encode(i);
  else if (typeof Buffer < "u")
    l = Buffer.from(i, "utf-8");
  else
    return "";
  const f = ii(l, e);
  let h = "";
  for (let r = 0; r < f.length; r++)
    h += String.fromCharCode(f[r]);
  return typeof btoa < "u" ? btoa(h) : typeof Buffer < "u" ? Buffer.from(f).toString("base64") : "";
}
function oi(t, e = "ln-ashlar") {
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
    const f = new Uint8Array(l.length);
    for (let r = 0; r < l.length; r++)
      f[r] = l.charCodeAt(r);
    const h = ii(f, e);
    if (typeof TextDecoder < "u")
      return new TextDecoder().decode(h);
    if (typeof Buffer < "u")
      return Buffer.from(h).toString("utf-8");
  } catch {
    return t;
  }
  return t;
}
function si(t) {
  if (typeof t == "number" || typeof t == "string" && /^-?\d+$/.test(String(t).trim()))
    return { codec: "rot", shift: Number(t) || 13, key: "ln-ashlar" };
  if (t && typeof t == "object") {
    const e = (t.codec || (t.key ? "xor" : "rot")).toLowerCase().trim(), i = e === "xor" || e === "base64" ? e : "rot", l = Number(t.shift) || 13, f = t.key || "ln-ashlar";
    return { codec: i, shift: l, key: f };
  }
  return { codec: "rot", shift: 13, key: "ln-ashlar" };
}
function pr(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = si(e);
  return i.codec === "base64" ? ei(t) : i.codec === "xor" ? ri(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (l) => ti(l, i.shift));
}
function me(t, e = 13) {
  if (t == null || (typeof t != "string" && (t = String(t)), t.length === 0)) return "";
  const i = si(e);
  return i.codec === "base64" ? ni(t) : i.codec === "xor" ? oi(t, i.key) : t.replace(/[a-zA-Z0-9]/g, (l) => ti(l, -i.shift));
}
(function() {
  const t = "data-ln-obfuscator", e = "lnObfuscator";
  if (window[e] !== void 0) return;
  function i(r) {
    const s = r[e];
    s && s.deobfuscate();
  }
  const l = {
    "data-ln-obfuscator": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Codec used to deobfuscate text or links" },
    "data-ln-obfuscator-codec": { type: "enum", values: ["rot13", "base64", "xor"], fallback: "rot13", effect: i, description: "Explicit codec override attribute" },
    "data-ln-obfuscator-key": { type: "string", effect: i, description: "Encryption or masking key for XOR codec" }
  };
  function f(r) {
    return r[e] ? r[e] : (r[e] = this, this.dom = r, this._originalTextNodes = null, this._originalHref = null, this.deobfuscate(), this);
  }
  f.prototype.deobfuscate = function() {
    const r = !!(this.dom.matches && (this.dom.matches("a") || this.dom.matches("area")));
    if (this._originalHref === null && r && this.dom.hasAttribute("href") && (this._originalHref = this.dom.getAttribute("href")), (!this._originalTextNodes || this._originalTextNodes.length === 0 || this._originalTextNodes.some((A) => !this.dom.contains(A.node))) && (this._originalTextNodes = [], typeof document < "u" && document.createTreeWalker)) {
      const A = document.createTreeWalker(this.dom, NodeFilter.SHOW_TEXT, {
        acceptNode: function(m) {
          return m.parentElement && m.parentElement.classList && m.parentElement.classList.contains("sr-only") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      for (; A.nextNode(); )
        this._originalTextNodes.push({
          node: A.currentNode,
          raw: A.currentNode.nodeValue
        });
    }
    const a = this.dom.getAttribute(t), n = parseInt(a, 10), o = isNaN(n) ? 13 : n, c = (this.dom.getAttribute("data-ln-obfuscator-codec") || "").toLowerCase().trim(), u = this.dom.getAttribute("data-ln-obfuscator-key");
    let w = "rot";
    c === "xor" || c === "base64" ? w = c : u && (w = "xor");
    const y = u || "ln-ashlar", E = { codec: w, shift: o, key: y };
    if (r && this.dom.getAttribute("data-ln-external-link") === "processed") {
      const A = this.dom.querySelectorAll(".sr-only");
      for (let v = 0; v < A.length; v++)
        A[v].remove();
      this.dom.removeAttribute("data-ln-external-link"), this.dom.removeAttribute("target");
      const m = (this.dom.rel || "").split(/\s+/).filter(function(v) {
        return v && v !== "noopener" && v !== "noreferrer";
      });
      m.length > 0 ? this.dom.rel = m.join(" ") : this.dom.removeAttribute("rel");
    }
    if (this._originalTextNodes)
      for (let A = 0; A < this._originalTextNodes.length; A++) {
        const m = this._originalTextNodes[A];
        m.node && m.raw && m.raw.length > 0 && (m.node.nodeValue = me(m.raw, E));
      }
    if (r && this._originalHref) {
      const A = me(this._originalHref, E);
      this.dom.setAttribute("href", A);
    }
    L(this.dom, "ln-obfuscator:deobfuscated", {
      target: this.dom,
      codec: w,
      shift: o,
      key: w === "xor" ? y : null
    });
  }, f.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this._originalTextNodes)
        for (let r = 0; r < this._originalTextNodes.length; r++) {
          const s = this._originalTextNodes[r];
          s.node && s.raw && (s.node.nodeValue = s.raw);
        }
      this._originalHref !== null && this.dom.setAttribute("href", this._originalHref), delete this.dom[e];
    }
  };
  const h = j(t, e, f, "ln-obfuscator", {
    attributes: l
  });
  h.obfuscate = pr, h.deobfuscate = me, h.utf8ToBase64 = ei, h.base64ToUtf8 = ni, h.xorObfuscate = ri, h.xorDeobfuscate = oi;
})();
(function() {
  const t = "lnExternalLinks";
  if (window[t] !== void 0) return;
  function e(s) {
    return s.hostname && s.hostname !== window.location.hostname;
  }
  function i(s) {
    if (s.getAttribute("data-ln-external-link") === "processed" || !e(s)) return;
    s.target = "_blank";
    const a = (s.rel || "").split(/\s+/).filter(Boolean);
    a.includes("noopener") || a.push("noopener"), a.includes("noreferrer") || a.push("noreferrer"), s.rel = a.join(" ");
    const n = document.createElement("span");
    n.className = "sr-only", n.textContent = "(opens in new tab)", s.appendChild(n), s.setAttribute("data-ln-external-link", "processed"), L(s, "ln-external-links:processed", {
      link: s,
      href: s.href
    });
  }
  function l(s) {
    s = s || document.body;
    for (const a of s.querySelectorAll("a, area"))
      i(a);
  }
  function f() {
    pt(function() {
      document.body.addEventListener("click", function(s) {
        const a = s.target.closest("a, area");
        a && a.getAttribute("data-ln-external-link") === "processed" && L(a, "ln-external-links:clicked", {
          link: a,
          href: a.href,
          text: a.textContent || a.title || ""
        });
      });
    }, "ln-external-links");
  }
  function h() {
    pt(function() {
      new MutationObserver(function(a) {
        for (const n of a)
          if (n.type === "childList") {
            for (const o of n.addedNodes)
              if (o.nodeType === 1 && (o.matches && (o.matches("a") || o.matches("area")) && i(o), o.querySelectorAll))
                for (const c of o.querySelectorAll("a, area"))
                  i(c);
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), $t(["href"], function(a) {
        a.matches && (a.matches("a") || a.matches("area")) && i(a);
      });
    }, "ln-external-links");
  }
  function r() {
    f(), h(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function() {
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
  function f(m) {
    i && (i.textContent = m, i.classList.add("ln-link-status--visible"));
  }
  function h() {
    i && i.classList.remove("ln-link-status--visible");
  }
  function r(m, v) {
    if (v.target.closest("a, button, input, select, textarea")) return;
    const p = m.querySelector("a");
    if (!p) return;
    const d = p.getAttribute("href");
    if (!d) return;
    if (v.ctrlKey || v.metaKey || v.button === 1) {
      window.open(d, "_blank", "noopener,noreferrer");
      return;
    }
    Z(m, "ln-link:navigate", { target: m, href: d, link: p }).defaultPrevented || p.click();
  }
  function s(m) {
    const v = m.querySelector("a");
    if (!v) return;
    const p = v.getAttribute("href");
    p && f(p);
  }
  function a() {
    h();
  }
  function n(m) {
    m[e + "Row"] || !m.querySelector("a") || (m[e + "Row"] = !0, m._lnLinkClick = function(p) {
      r(m, p);
    }, m._lnLinkEnter = function() {
      s(m);
    }, m.addEventListener("click", m._lnLinkClick), m.addEventListener("mouseenter", m._lnLinkEnter), m.addEventListener("mouseleave", a));
  }
  function o(m) {
    m[e + "Row"] && (m._lnLinkClick && m.removeEventListener("click", m._lnLinkClick), m._lnLinkEnter && m.removeEventListener("mouseenter", m._lnLinkEnter), m.removeEventListener("mouseleave", a), delete m._lnLinkClick, delete m._lnLinkEnter, delete m[e + "Row"]);
  }
  function c(m) {
    if (!m[e + "Init"]) return;
    const v = m.tagName;
    if (v === "TABLE" || v === "TBODY") {
      const p = v === "TABLE" && m.querySelector("tbody") || m;
      for (const d of p.querySelectorAll("tr"))
        o(d);
    } else
      o(m);
    delete m[e + "Init"];
  }
  function u(m) {
    if (m[e + "Init"]) return;
    m[e + "Init"] = !0;
    const v = m.tagName;
    if (v === "TABLE" || v === "TBODY") {
      const p = v === "TABLE" && m.querySelector("tbody") || m;
      for (const d of p.querySelectorAll("tr"))
        n(d);
    } else
      n(m);
  }
  function w(m) {
    m.hasAttribute && m.hasAttribute(t) && u(m);
    const v = m.querySelectorAll ? m.querySelectorAll("[" + t + "]") : [];
    for (const p of v)
      u(p);
  }
  function y() {
    pt(function() {
      new MutationObserver(function(v) {
        for (const p of v)
          if (p.type === "childList") {
            for (const d of p.addedNodes)
              if (d.nodeType === 1) {
                w(d);
                const _ = d.closest("[" + t + "]");
                if (_)
                  if (d.tagName === "TR")
                    n(d);
                  else {
                    const b = _.tagName;
                    if (b === "TABLE" || b === "TBODY") {
                      const T = d.querySelectorAll ? d.querySelectorAll("tr") : [];
                      for (const g of T)
                        n(g);
                    }
                  }
              }
          }
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), $t([t], function(v) {
        v.hasAttribute && v.hasAttribute(t) ? w(v) : c(v);
      });
    }, "ln-link");
  }
  function E(m) {
    w(m);
  }
  window[e] = { init: E, destroy: c };
  function A() {
    l(), y(), E(document.body);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A();
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
  function l(f) {
    if (f[e]) return f[e];
    if (!(!f || f.tagName !== "A" && f.tagName !== "BUTTON"))
      return f[e] = this, this.dom = f, this._handleClick = this._handleClick.bind(this), this.dom.addEventListener("click", this._handleClick), this;
  }
  l.prototype._handleClick = function(f) {
    if (this.dom.tagName === "A" && (f.ctrlKey || f.metaKey || f.shiftKey || f.altKey || f.button !== 0))
      return;
    let h = (this.dom.getAttribute("data-ln-scroll") || "").trim();
    if (h || (h = (this.dom.getAttribute("href") || "").trim()), !h || h === "#")
      return;
    !h.startsWith("#") && !h.startsWith(".") && !h.startsWith("[") && (h = "#" + h);
    let r = null;
    try {
      r = document.querySelector(h);
    } catch {
      const y = h.replace(/^#/, "");
      r = document.getElementById(y);
    }
    if (!r) return;
    f.preventDefault();
    const s = this.dom.getAttribute("data-ln-scroll-set");
    if (s) {
      const w = s.indexOf(":");
      if (w !== -1) {
        const y = s.slice(0, w).trim(), E = s.slice(w + 1).trim();
        try {
          const A = document.querySelector(y);
          A && (A.value = E, A.dispatchEvent(new Event("input", { bubbles: !0 })), A.dispatchEvent(new Event("change", { bubbles: !0 })));
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
      const w = parseInt(this.dom.getAttribute("data-ln-scroll-delay"), 10), y = isNaN(w) ? 450 : w;
      window.setTimeout(function() {
        let E = null;
        if (u && u !== "true" && u !== "1")
          try {
            E = document.querySelector(u);
          } catch {
          }
        E || (E = r.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')), !E && r.getAttribute("tabindex") !== null && (E = r), E && typeof E.focus == "function" && E.focus({ preventScroll: !0 });
      }, y);
    }
    L(this.dom, "ln-scroll:scrolled", {
      target: r,
      link: this.dom,
      href: h
    });
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("click", this._handleClick), delete this.dom[e]);
  }, j(t, e, l, "ln-scroll", {
    attributes: i
  });
})();
const Ht = ["Ctrl", "Alt", "Shift", "Meta"], mr = {
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
function ai(t) {
  if (t === " ") return "Space";
  const e = String(t || "").trim();
  if (!e) return "";
  const i = mr[e.toLowerCase()];
  return i || (e.length === 1 || /^f\d{1,2}$/i.test(e) ? e.toUpperCase() : e.charAt(0).toUpperCase() + e.slice(1));
}
function li(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return "";
  const i = e.split("+"), l = /* @__PURE__ */ new Set();
  let f = "";
  for (let r = 0; r < i.length; r++) {
    const s = ai(i[r]);
    if (!s) return "";
    if (Ht.indexOf(s) !== -1) {
      l.add(s);
      continue;
    }
    if (f) return "";
    f = s;
  }
  if (!f) return "";
  const h = [];
  for (let r = 0; r < Ht.length; r++)
    l.has(Ht[r]) && h.push(Ht[r]);
  return h.push(f), h.join("+");
}
function gr(t) {
  const e = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  if (!e) return [];
  const i = e.split(/[\s,]+/), l = [];
  for (let f = 0; f < i.length; f++) {
    const h = li(i[f]);
    h && l.indexOf(h) === -1 && l.push(h);
  }
  return l;
}
function _r(t, e) {
  const i = String(e || "").trim();
  if (!i || /[\s,]/.test(i)) return "";
  const l = String(t || "").replace(/\s*\+\s*/g, "+").trim();
  return /[\s,]/.test(l) ? "" : li(l ? l + "+" + i : i);
}
function br(t) {
  if (!t) return "";
  const e = ai(t.key);
  if (!e || Ht.indexOf(e) !== -1) return "";
  const i = [];
  return t.ctrlKey && i.push("Ctrl"), t.altKey && i.push("Alt"), t.shiftKey && i.push("Shift"), t.metaKey && i.push("Meta"), i.push(e), i.join("+");
}
function yr(t) {
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
function vr(t, e, i, l) {
  if (!t || !e || i !== "click" || t.target !== e || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return !1;
  const f = String(e.tagName || "").toLowerCase();
  return f === "button" ? l === "Enter" || l === "Space" : f === "a" && e.hasAttribute && e.hasAttribute("href") && l === "Enter";
}
(function() {
  const t = "data-ln-key", e = "lnKey", i = "data-ln-key-target", l = "data-ln-key-allow-input", f = "data-ln-key-modifier", h = "data-ln-key-for", r = "lnKeyFor";
  if (window[e] !== void 0) return;
  function s(v) {
    const p = v[e];
    if (p) {
      if (!v.hasAttribute(t)) {
        p.destroy();
        return;
      }
      p.sync();
    }
  }
  function a(v) {
    const p = v[r];
    p && !v.hasAttribute(h) && p.destroy();
  }
  const n = {
    "data-ln-key": { type: "string", effect: s, description: "Keyboard shortcut combination (e.g. meta+k, ctrl+s)" },
    "data-ln-key-target": { type: "string", effect: s, description: "Target element selector or ID to receive synthetic click or focus" },
    "data-ln-key-allow-input": { type: "boolean", effect: s, description: "Permits shortcut execution even when focused inside an editable input" }
  }, o = {
    "data-ln-key-for": { type: "string", effect: a, description: "Target element ID that this shortcut badge is displayed for" },
    "data-ln-key-modifier": { type: "string", description: "Platform modifier text representation override" }
  }, c = /* @__PURE__ */ new Set();
  let u = null;
  function w() {
    u || (u = function(v) {
      if (v.defaultPrevented || v.isComposing || v.repeat) return;
      const p = br(v);
      if (!p) return;
      const d = Ti(v.target), _ = document.querySelectorAll("[" + t + "], [" + h + "]");
      let b = null, T = !1, g = !1;
      for (let q = 0; q < _.length; q++) {
        const D = _[q], I = D[e] || D[r];
        if (!I || !I.matches(p) || d && !I.allowsInput()) continue;
        const R = I.resolveTarget(), O = yr(R);
        if (!(!O || !ki(R, O))) {
          if (vr(v, R, O, p)) {
            g = !0;
            continue;
          }
          b ? T = !0 : b = { host: D, target: R, action: O };
        }
      }
      if (g || !b) return;
      T && console.warn('[ln-key] Duplicate active shortcut "' + p + '"; first DOM match wins.');
      const S = {
        source: b.host,
        target: b.target,
        action: b.action,
        key: p,
        event: v
      };
      Z(b.host, "ln-key:before-trigger", S).defaultPrevented || (v.preventDefault(), b.target[b.action](), L(b.host, "ln-key:trigger", S));
    }, document.addEventListener("keydown", u));
  }
  function y() {
    c.size > 0 || !u || (document.removeEventListener("keydown", u), u = null);
  }
  function E(v) {
    return this.dom = v, this.shortcuts = [], c.add(this), this.sync(), w(), this;
  }
  E.prototype.sync = function() {
    this.shortcuts = gr(this.dom.getAttribute(t));
  }, E.prototype.matches = function(v) {
    return this.shortcuts.indexOf(v) !== -1;
  }, E.prototype.allowsInput = function() {
    return this.dom.hasAttribute(l);
  }, E.prototype.resolveTarget = function() {
    const v = this.dom.getAttribute(i);
    return v ? m(v, i) : this.dom;
  }, E.prototype.destroy = function() {
    this.dom[e] && (c.delete(this), delete this.dom[e], y());
  };
  function A(v) {
    return this.dom = v, c.add(this), w(), this;
  }
  A.prototype._modifierContext = function() {
    return this.dom.closest("[" + f + "]");
  }, A.prototype.shortcut = function() {
    const v = this._modifierContext(), p = v ? v.getAttribute(f) : "";
    return _r(p, this.dom.textContent);
  }, A.prototype.matches = function(v) {
    return this.shortcut() === v;
  }, A.prototype.allowsInput = function() {
    if (this.dom.hasAttribute(l)) return !0;
    const v = this._modifierContext();
    return !!(v && v.hasAttribute(l));
  }, A.prototype.resolveTarget = function() {
    return m(this.dom.getAttribute(h), h);
  }, A.prototype.destroy = function() {
    this.dom[r] && (c.delete(this), delete this.dom[r], y());
  };
  function m(v, p) {
    if (!v) return null;
    try {
      const d = document.querySelector(v);
      return d || console.warn("[ln-key] Target not found for " + p + ' selector "' + v + '".'), d;
    } catch {
      return console.warn("[ln-key] Invalid " + p + ' selector "' + v + '".'), null;
    }
  }
  j(t, e, E, "ln-key", {
    attributes: n
  }), j(h, r, A, "ln-key-for", {
    attributes: o
  });
})();
function wr(t, e, i = 100) {
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
  function i(s) {
    const a = s[e];
    a && r.call(a);
  }
  const l = {
    "data-ln-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current progress value" },
    "data-ln-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum progress scale value" }
  };
  function f(s) {
    return this.dom = s, this._parentObserver = null, r.call(this), h.call(this), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this._parentObserver && this._parentObserver.disconnect(), delete this.dom[e]);
  };
  function h() {
    const s = this, a = this.dom.parentElement;
    if (!a) return;
    const n = new MutationObserver(function(o) {
      for (const c of o)
        c.attributeName === "data-ln-progress-max" && r.call(s);
    });
    n.observe(a, {
      attributes: !0,
      attributeFilter: ["data-ln-progress-max"]
    }), this._parentObserver = n;
  }
  function r() {
    const s = this.dom.getAttribute("data-ln-progress"), a = this.dom.parentElement, n = a ? a.getAttribute("data-ln-progress-max") : null, o = this.dom.getAttribute("data-ln-progress-max"), c = wr(o, n, 100), u = On(s, c);
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
    f,
    "ln-progress",
    {
      attributes: l
    }
  );
})();
function Er(t, e) {
  if (!Array.isArray(t) || !Array.isArray(e)) return t !== e;
  if (t.length !== e.length) return !0;
  for (let i = 0; i < t.length; i++)
    if (t[i] !== e[i]) return !0;
  return !1;
}
function Ar(t, e, i) {
  if (!e || typeof e != "object") return !0;
  const l = Object.keys(e);
  if (l.length === 0) return !0;
  for (let f = 0; f < l.length; f++) {
    const h = e[l[f]];
    let r = "";
    if (h.col !== null && h.col !== void 0 ? r = t[h.col] || "" : h.attr && i && typeof i.getAttribute == "function" && (r = i.getAttribute(h.attr) || ""), !Ne(r, h.values))
      return !1;
  }
  return !0;
}
function en(t, e, i, l) {
  if (l != null && !isNaN(l))
    return parseInt(l, 10);
  if (e && typeof e.getAttribute == "function") {
    const f = e.getAttribute("data-ln-filter-col");
    if (f !== null && !isNaN(parseInt(f, 10)))
      return parseInt(f, 10);
    if (typeof e.closest == "function") {
      const h = e.closest("th");
      if (h && typeof h.cellIndex == "number")
        return h.cellIndex;
      const r = e.closest("[data-ln-popover], [id]");
      if (r && r.id) {
        const s = t && t.ownerDocument ? t.ownerDocument : e.ownerDocument || (typeof document < "u" ? document : null);
        if (s && typeof s.querySelector == "function") {
          const a = s.querySelector('[data-ln-popover-for="' + r.id + '"]');
          if (a && typeof a.closest == "function") {
            const n = a.closest("th");
            if (n && typeof n.cellIndex == "number")
              return n.cellIndex;
          }
        }
      }
    }
  }
  if (t && i && typeof t.querySelectorAll == "function") {
    const f = t.querySelectorAll("thead th, tr:first-child th"), h = String(i).trim().toLowerCase();
    for (let r = 0; r < f.length; r++) {
      const s = f[r], a = s.getAttribute("data-ln-table-filter-col") || s.getAttribute("data-ln-filter-col") || s.getAttribute("data-ln-filter-key") || s.getAttribute("data-ln-table-col") || s.getAttribute("data-ln-col") || s.getAttribute("data-ln-field");
      if (a && a.trim().toLowerCase() === h)
        return typeof s.cellIndex == "number" ? s.cellIndex : r;
    }
    if (e) {
      const r = e.closest ? e.closest("[data-ln-popover], [id]") : null, s = r && r.id || e.id || null;
      if (s)
        for (let a = 0; a < f.length; a++) {
          const n = f[a];
          if (typeof n.querySelector == "function" && n.querySelector('[data-ln-popover-for="' + s + '"]'))
            return typeof n.cellIndex == "number" ? n.cellIndex : a;
        }
    }
    for (let r = 0; r < f.length; r++) {
      const s = f[r], n = Array.from(s.childNodes || []).filter((c) => c.nodeType === 3), o = (n.length > 0 ? n.map((c) => c.textContent.trim()).join(" ") : s.textContent || "").trim().toLowerCase();
      if (o && o === h)
        return typeof s.cellIndex == "number" ? s.cellIndex : r;
    }
  }
  return null;
}
function Sr(t) {
  if (!Array.isArray(t)) return { key: null, values: [] };
  let e = null;
  const i = [];
  for (let l = 0; l < t.length; l++) {
    const f = t[l];
    !e && f.key && (e = f.key), f.checked && !f.isReset && f.value && i.push(f.value);
  }
  return { key: e, values: i };
}
function Cr(t) {
  return !Array.isArray(t) || t.length === 0 ? null : t.map(encodeURIComponent).join(",");
}
function nn(t) {
  return t ? t.split(",").map(function(e) {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }).filter(Boolean) : [];
}
(function() {
  const t = "data-ln-filter", e = "lnFilter", i = "data-ln-filter-key", l = "data-ln-filter-value", f = "data-ln-filter-hide", h = "data-ln-filter-reset", r = "data-ln-filter-col", s = "data-ln-hash", a = "data-ln-filter-values", n = /* @__PURE__ */ new WeakMap();
  if (window[e] !== void 0) return;
  const o = {
    "data-ln-filter": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to filter" },
    "data-ln-hash": { type: "string", effect: v, description: "URL hash routing key for filter state persistence" },
    "data-ln-filter-values": { type: "string", effect: v, description: "Encoded active filter values" },
    "data-ln-filter-col": { type: "string", description: "Column name or index filter specifier" },
    "data-ln-filter-key": { type: "string", description: "Field key for filter matching" },
    "data-ln-filter-reset": { type: "trigger", description: "Filter reset button or option trigger" },
    "data-ln-filter-value": { type: "string", description: "Value to match for this filter input" },
    "data-ln-filter-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" }
  }, c = et(o);
  function u(p) {
    return p.hasAttribute(h) || !p.getAttribute(l);
  }
  function w(p) {
    const d = p.dom.querySelectorAll("[" + i + "]"), _ = [];
    for (let T = 0; T < d.length; T++) {
      const g = d[T];
      _.push({
        key: g.getAttribute(i),
        value: g.getAttribute(l) || "",
        checked: g.checked,
        isReset: u(g)
      });
    }
    const b = Sr(_);
    return { key: b.key, values: b.values, targetId: p.targetId };
  }
  function y(p, d, _) {
    const b = p.querySelectorAll("[" + i + "]"), T = Array.isArray(_) && _.length > 0;
    for (let g = 0; g < b.length; g++) {
      const S = b[g];
      u(S) ? S.checked = !T : T && S.getAttribute(i) === d && _.indexOf(S.getAttribute(l)) !== -1 ? S.checked = !0 : S.checked = !1;
    }
  }
  function E(p) {
    this.dom = p, tt(this, p, c);
    const d = p.getAttribute(r);
    this.colIndex = d !== null ? parseInt(d, 10) : null, this._lastSnapshot = null, this._destroyed = !1, this.nsKey = wt(p, "filter"), this.hashEnabled = !!this.nsKey;
    const _ = this, b = oe(function() {
      _._render();
    });
    this._queueRender = b, this._attachHandlers(), this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const g = ct(_.nsKey), S = be(g);
      S && S.key && S.values.length > 0 ? y(_.dom, S.key, S.values) : y(_.dom, null, []), _._render();
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let T = !1;
    if (this.hashEnabled) {
      const g = ct(this.nsKey), S = be(g);
      S && S.key && S.values.length > 0 && (y(p, S.key, S.values), vt(function() {
        _._destroyed || _._render();
      }), T = !0);
    }
    if (!T) {
      const g = nn(p.getAttribute(a));
      if (g.length > 0) {
        const S = p.querySelector("[" + i + "]"), C = S ? S.getAttribute(i) : null;
        C && (y(p, C, g), vt(function() {
          _._destroyed || _._render();
        }), T = !0);
      }
    }
    if (!T) {
      const g = p.querySelectorAll("[" + i + "]");
      for (let S = 0; S < g.length; S++)
        if (g[S].checked && !u(g[S])) {
          vt(function() {
            _._destroyed || _._render();
          });
          break;
        }
    }
    return this;
  }
  E.prototype._attachHandlers = function() {
    const p = this;
    this._onDomChange = function(d) {
      const _ = d.target;
      if (!_ || !_.hasAttribute || !_.hasAttribute(i)) return;
      const b = Array.from(p.dom.querySelectorAll("[" + i + "]"));
      if (u(_)) {
        for (let T = 0; T < b.length; T++)
          u(b[T]) || (b[T].checked = !1);
        _.checked = !0, p._queueRender();
        return;
      }
      if (_.checked) {
        for (let g = 0; g < b.length; g++)
          u(b[g]) && (b[g].checked = !1);
        let T = !1;
        for (let g = 0; g < b.length; g++)
          if (u(b[g])) {
            T = !0;
            break;
          }
        if (T) {
          let g = !0;
          for (let S = 0; S < b.length; S++)
            if (!u(b[S]) && !b[S].checked) {
              g = !1;
              break;
            }
          if (g)
            for (let S = 0; S < b.length; S++)
              u(b[S]) ? b[S].checked = !0 : b[S].checked = !1;
        }
      } else {
        let T = !1;
        for (let g = 0; g < b.length; g++)
          if (!u(b[g]) && b[g].checked) {
            T = !0;
            break;
          }
        if (!T)
          for (let g = 0; g < b.length; g++)
            u(b[g]) && (b[g].checked = !0);
      }
      p._queueRender();
    }, this.dom.addEventListener("change", this._onDomChange);
  }, E.prototype._render = function() {
    const p = this, d = w(this), _ = this._lastSnapshot;
    if (!(!_ || _.key !== d.key || Er(_.values, d.values))) return;
    const T = d.key === null || d.values.length === 0, g = document.getElementById(p.targetId), S = {
      key: d.key,
      values: d.values.slice(),
      targetId: p.targetId
    };
    L(p.dom, "ln-filter:change", S);
    let C = !1;
    g && g !== p.dom && Z(g, "ln-filter:change", S).defaultPrevented && (C = !0);
    const q = _ && _.values.length > 0, D = d.values.length === 0;
    if (q && D) {
      const O = { targetId: p.targetId };
      L(p.dom, "ln-filter:reset", O), g && g !== p.dom && L(g, "ln-filter:reset", O);
    }
    this._lastSnapshot = { key: d.key, values: d.values.slice() };
    const I = Cr(d.values);
    if (I ? this.dom.setAttribute(a, I) : this.dom.removeAttribute(a), this.hashEnabled) {
      const O = Dn(d.key, d.values);
      mt(this.nsKey, O);
    }
    if (C) return;
    const R = g && (g.tagName === "TABLE" ? g : g.querySelector ? g.querySelector("table") : null);
    if (R)
      p._filterTableRows(d, R);
    else {
      if (!g) return;
      const O = g.children;
      for (let P = 0; P < O.length; P++) {
        const B = O[P];
        if (B.removeAttribute(f), T) continue;
        const H = B.getAttribute("data-" + d.key);
        H !== null && (Ne(H, d.values) || B.setAttribute(f, "true"));
      }
    }
  };
  function A(p) {
    if (!p) return "";
    const d = p.querySelector ? p.querySelector("[data-ln-value]") : null;
    return yt(d || p);
  }
  function m(p) {
    return !!(!p || typeof p != "object" || p.tagName === "TEMPLATE" || typeof p.hasAttribute == "function" && (p.hasAttribute("data-ln-sort-exclude") || p.hasAttribute("hidden")) || p.classList && p.classList.contains("hidden") || p.style && p.style.display === "none" || typeof p.matches == "function" && p.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]") || typeof p.querySelector == "function" && p.querySelector(".empty-state, [data-ln-empty], [data-ln-empty-state]"));
  }
  E.prototype._filterTableRows = function(p, d) {
    if (!d) {
      const C = document.getElementById(this.targetId);
      if (!C || (d = C.tagName === "TABLE" ? C : C.querySelector ? C.querySelector("table") : null, !d)) return;
    }
    const _ = en(d, this.dom, p.key, this.colIndex), b = p.key || this.dom.getAttribute("data-ln-filter-key") || (_ !== null ? "col" + _ : "attr-filter"), T = p.values;
    n.has(d) || n.set(d, {});
    const g = n.get(d);
    b && T.length > 0 ? g[b] = {
      col: _,
      values: T.slice(),
      attr: "data-" + b
    } : b && delete g[b];
    const S = d.tBodies;
    for (let C = 0; C < S.length; C++) {
      const q = S[C].rows;
      for (let D = 0; D < q.length; D++) {
        const I = q[D];
        if (m(I)) continue;
        const R = {};
        for (let O = 0; O < I.cells.length; O++)
          R[O] = A(I.cells[O]);
        Ar(R, g, I) ? I.removeAttribute(f) : I.setAttribute(f, "true");
      }
    }
  }, E.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const p = document.getElementById(this.targetId);
    if (p) {
      const d = p.tagName === "TABLE" ? p : p.querySelector ? p.querySelector("table") : null;
      if (d && n.has(d)) {
        const _ = n.get(d), b = en(d, this.dom, this.dom.getAttribute("data-ln-filter-key"), this.colIndex), T = this.dom.getAttribute("data-ln-filter-key") || (b !== null ? "col" + b : this.colIndex !== null ? "col" + this.colIndex : null);
        T && _[T] && (delete _[T], this._filterTableRows({ key: null, values: [] }, d)), Object.keys(_).length === 0 && n.delete(d);
      }
    }
    this._onDomChange && (this.dom.removeEventListener("change", this._onDomChange), delete this._onDomChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e];
  };
  function v(p, d) {
    const _ = p[e];
    if (!(!_ || _._destroyed)) {
      if (d === s)
        _.hashEnabled && _._onHashChange && window.removeEventListener("hashchange", _._onHashChange), _.nsKey = wt(p, "filter"), _.hashEnabled = !!_.nsKey, _.hashEnabled && window.addEventListener("hashchange", _._onHashChange);
      else if (d === a) {
        const b = nn(p.getAttribute(a)), T = p.querySelector("[" + i + "]"), g = T ? T.getAttribute(i) : null;
        g && (y(p, g, b), _._render());
      }
    }
  }
  j(t, e, E, "ln-filter", {
    attributes: o,
    persist: {
      attr: a,
      hashActive: function(p) {
        return !!wt(p, "filter");
      }
    }
  });
})();
(function() {
  const t = "data-ln-search", e = "lnSearch", i = "data-ln-search-for", l = "lnSearchControl", f = "data-ln-search-items", h = "data-ln-search-fields", r = "data-ln-search-exclude", s = "data-ln-search-hide", a = "data-ln-hash";
  if (window[e] !== void 0) return;
  const n = {
    "data-ln-search": { type: "string", effect: p, description: "Active search query term on target element or container" },
    "data-ln-hash": { type: "string", effect: p, description: "URL hash routing key for search state persistence" },
    "data-ln-search-for": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID that this input controls" },
    "data-ln-search-fields": { type: "list", description: "Comma-separated field names to include in client search" },
    "data-ln-search-items": { type: "string", description: "CSS selector matching searchable child items" },
    "data-ln-search-exclude": { type: "string", description: "CSS selector matching child items to exclude from search" },
    "data-ln-search-hide": { type: "enum", values: ["collapse", "none"], fallback: "collapse", description: "CSS hiding strategy for non-matching rows" },
    "data-ln-search-clear-for": { type: "trigger", description: "Click trigger to clear search input for target" }
  }, o = et(n);
  function c(d) {
    const _ = wt(d, "search");
    if (_) return _;
    if (d.id) {
      const b = document.querySelector("[" + i + '="' + d.id + '"]');
      if (b) {
        const T = wt(b, "search");
        if (T) return T;
      }
    }
    return null;
  }
  function u(d) {
    return d.matches("input, textarea") ? d : d.querySelector("input, textarea");
  }
  function w(d, _) {
    const b = d.childNodes;
    for (let T = 0; T < b.length; T++) {
      const g = b[T];
      if (g.nodeType === 3) {
        _.push(g.nodeValue);
        continue;
      }
      g.nodeType === 1 && (g.hasAttribute(r) || w(g, _));
    }
  }
  function y(d) {
    if (d._lnSearchText !== void 0) return d._lnSearchText;
    const _ = [];
    w(d, _);
    const b = Qi(_);
    return d._lnSearchText = b, b;
  }
  function E(d, _) {
    if (!d.id) return;
    const b = document.querySelectorAll("[" + i + '="' + d.id + '"]');
    for (const T of b) {
      const g = u(T);
      g && g.value !== _ && (g.value = _);
    }
  }
  function A(d) {
    this.dom = d, this.term = d.getAttribute(t) || "", this._destroyed = !1;
    const _ = this;
    return this.nsKey = c(d), this.hashEnabled = !!this.nsKey, this._onHashChange = function() {
      if (_._destroyed || !_.hashEnabled) return;
      const b = ct(_.nsKey), T = _.dom.getAttribute(t) || "";
      b !== null && b !== T ? _.dom.setAttribute(t, b) : b === null && T !== "" && _.dom.setAttribute(t, "");
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange), vt(function() {
      if (!_._destroyed) {
        if (_.hashEnabled) {
          const b = ct(_.nsKey);
          if (b !== null && b !== _.term) {
            _.term = b, _.dom.setAttribute(t, b), E(_.dom, b), _._apply();
            return;
          }
        }
        ve(_.term) && (E(_.dom, _.term), _._apply());
      }
    }), this;
  }
  A.prototype._apply = function() {
    const d = this.dom, _ = ve(this.term), b = Mn(_);
    this.hashEnabled && mt(this.nsKey, this.term ? this.term : null);
    const T = $i(d.getAttribute(h));
    if (Z(d, "ln-search:change", {
      term: _,
      tokens: b,
      targetId: d.id,
      fields: T
    }).defaultPrevented) return;
    const S = d.getAttribute(f), C = S ? d.querySelectorAll(S) : d.children;
    for (let q = 0; q < C.length; q++) {
      const D = C[q];
      if (D.removeAttribute(s), D.hasAttribute(r) || b.length === 0) continue;
      const I = y(D);
      Fn(I, b) || D.setAttribute(s, "true");
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._destroyed = !0, this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function m(d) {
    if (this.dom = d, tt(this, d, o), this.input = u(d), this._attachHandler(), this.input && this.input.value.trim()) {
      const _ = this;
      vt(function() {
        const b = document.getElementById(_.targetId);
        b && ((b.getAttribute(t) || "").trim() || _._write(_.input.value));
      });
    }
    return this;
  }
  m.prototype._write = function(d) {
    const _ = document.getElementById(this.targetId);
    _ && _.getAttribute(t) !== d && _.setAttribute(t, d);
  }, m.prototype._attachHandler = function() {
    if (!this.input) return;
    const d = this;
    this._onInput = function() {
      d._write(d.input.value);
    }, this.input.addEventListener("input", this._onInput);
  }, m.prototype.destroy = function() {
    this.dom[l] && (this.input && this._onInput && this.input.removeEventListener("input", this._onInput), delete this.dom[l]);
  };
  function v(d) {
    const _ = d.getAttribute("data-ln-search-clear-for");
    if (_) {
      const C = document.getElementById(_), q = document.querySelector("[" + i + '="' + _ + '"]'), D = q ? u(q) : null;
      return { target: C, input: D };
    }
    const b = d.closest("[" + t + "]");
    if (b) {
      const C = b.id ? document.querySelector("[" + i + '="' + b.id + '"]') : null, q = C ? u(C) : null;
      return { target: b, input: q };
    }
    const T = d.closest("[data-ln-table-source], [data-ln-list-source]");
    if (T) {
      const C = T.getAttribute("data-ln-table-source") || T.getAttribute("data-ln-list-source"), q = C ? document.getElementById(C) : null;
      if (q && q.hasAttribute(t)) {
        const D = document.querySelector("[" + i + '="' + C + '"]'), I = D ? u(D) : null;
        return { target: q, input: I };
      }
    }
    const g = d.closest("[" + i + "]");
    if (g) {
      const C = g.getAttribute(i), q = C ? document.getElementById(C) : null, D = u(g);
      return { target: q, input: D };
    }
    const S = d.parentElement;
    if (S) {
      const C = S.querySelector("[" + i + "]");
      if (C) {
        const q = C.getAttribute(i), D = q ? document.getElementById(q) : null, I = u(C);
        return { target: D, input: I };
      }
    }
    return { target: null, input: null };
  }
  document.addEventListener("click", function(d) {
    const _ = d.target.closest("[data-ln-search-clear], [data-ln-search-clear-for]");
    if (!_) return;
    const b = v(_);
    !b.target && !b.input || (d.preventDefault(), b.input && (b.input.value = "", b.input.focus()), b.target && b.target.setAttribute(t, ""));
  });
  function p(d, _) {
    const b = d[e];
    if (!b || b._destroyed) return;
    if (_ === a) {
      b._onHashChange && window.removeEventListener("hashchange", b._onHashChange), b.nsKey = c(d), b.hashEnabled = !!b.nsKey, b.hashEnabled && window.addEventListener("hashchange", b._onHashChange);
      return;
    }
    const T = d.getAttribute(t) || "";
    T !== b.term && (b.term = T, E(d, T), b._apply());
  }
  j(t, e, A, "ln-search", {
    attributes: n,
    onSubtreeChange: function(d, _) {
      const b = _.target;
      b && b._lnSearchText !== void 0 && delete b._lnSearchText, b && b.parentElement && b.parentElement._lnSearchText !== void 0 && delete b.parentElement._lnSearchText;
    },
    persist: {
      attr: t,
      hashActive: function(d) {
        return !!c(d);
      }
    }
  }), j(i, l, m, "ln-search-control");
})();
function St(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "asc" || e === "ascending" ? "asc" : e === "desc" || e === "descending" ? "desc" : "none";
}
function Tr(t) {
  const e = St(t);
  return e === "asc" ? "ascending" : e === "desc" ? "descending" : "none";
}
function kr(t, e) {
  return !t || !e ? !1 : t.field !== null && t.field !== void 0 && e.field !== null && e.field !== void 0 ? t.field === e.field : t.column !== null && t.column !== void 0 && e.column !== null && e.column !== void 0 ? String(t.column) === String(e.column) : !1;
}
function Lr(t, e, i, l) {
  const f = St(t);
  if (f === "none") return () => 0;
  const h = f === "desc" ? -1 : 1, r = typeof l == "function" ? l : (s) => s;
  return function(s, a) {
    const n = r(s), o = r(a);
    return Re(n, o, e, i) * h;
  };
}
function ge(t) {
  return !!(!t || typeof t != "object" || t.nodeType !== 1 || t.tagName === "TEMPLATE" || typeof t.hasAttribute == "function" && (t.hasAttribute("data-ln-sort-exclude") || t.hasAttribute("hidden")) || t.classList && t.classList.contains("hidden") || t.style && t.style.display === "none" || typeof t.matches == "function" && t.matches(".empty-state, .ln-table__empty, .ln-table__empty-state, [data-ln-empty], [data-ln-empty-state], [data-ln-table-empty]"));
}
function qr(t, e) {
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
  const t = "data-ln-sort", e = "lnSort", i = "data-ln-sort-field", l = "data-ln-sort-state", f = "data-ln-sort-dir", h = "data-ln-hash";
  if (window[e] !== void 0) return;
  function r(w, y) {
    return w.getAttribute(y) || null;
  }
  const s = {
    "data-ln-sort": { prop: "targetId", type: "string", read: $, fallback: null, description: "Target table or list element ID to sort" },
    "data-ln-sort-field": { prop: "field", type: "string", read: r, effect: u, description: "Field name or column key to sort by" },
    "data-ln-sort-dir": { type: "enum", values: ["asc", "desc"], fallback: "asc", description: "Default or requested sort direction" },
    "data-ln-sort-items": { prop: "itemsSelector", type: "string", read: r, description: "CSS selector matching sortable child items" },
    "data-ln-sort-state": { type: "enum", values: ["asc", "desc", "none"], fallback: "none", effect: u, description: "Active sort state applied to column or control" },
    "data-ln-hash": { type: "string", effect: u, description: "URL hash routing key for sort state persistence" }
  }, a = et(s), n = /* @__PURE__ */ new WeakMap();
  function o(w, y, E) {
    if (y) {
      const A = w.querySelector('[data-ln-field="' + y + '"]');
      return A ? yt(A) : "";
    }
    return E != null && w.cells && w.cells[E] ? yt(w.cells[E]) : yt(w);
  }
  function c(w) {
    this.dom = w, tt(this, w, a);
    const y = w.closest("th");
    this.column = !this.field && y ? y.cellIndex : null, this._state = St(w.getAttribute(l)), w.hasAttribute(l) || w.setAttribute(l, this._state), this._destroyed = !1, this.nsKey = wt(w, "sort"), this.hashEnabled = !!this.nsKey;
    const E = this;
    this._onClick = function(m) {
      const v = m.target.closest("[" + f + "]");
      if (!v) return;
      const p = St(v.getAttribute(f));
      E._apply(p);
    }, w.addEventListener("click", this._onClick), this._onSortChange = function(m) {
      if (E._destroyed || !m.detail) return;
      const v = E._resolveTarget();
      if (!(v && (m.target === v || v.contains(m.target)) || m.detail.targetId && m.detail.targetId === E.targetId)) return;
      if (kr(
        { field: E.field, column: E.column },
        { field: m.detail.field, column: m.detail.column }
      )) {
        const _ = St(m.detail.direction);
        _ && w.getAttribute(l) !== _ && (E._state = _, w.setAttribute(l, _), E._updateAriaSort(_));
        return;
      }
      w.getAttribute(l) !== "none" && (E._state = "none", w.setAttribute(l, "none"), E._updateAriaSort("none"));
    }, document.addEventListener("ln-sort:change", this._onSortChange), this._onHashChange = function() {
      if (E._destroyed || !E.hashEnabled) return;
      const m = ct(E.nsKey), v = _e(m);
      if (v)
        E.field !== null && v.fieldOrColumn === E.field || E.column !== null && String(E.column) === v.fieldOrColumn ? E._state !== v.direction && E._apply(v.direction, !0) : E._state !== "none" && (E._state = "none", w.setAttribute(l, "none"), E._updateAriaSort("none"));
      else if (E._state !== "none") {
        E._state = "none", w.setAttribute(l, "none"), E._updateAriaSort("none");
        const p = E._resolveTarget();
        p && (Z(p, "ln-sort:change", {
          field: E.field,
          column: E.column,
          direction: "none",
          targetId: E.targetId
        }).defaultPrevented || E._defaultSort(p, "none"));
      }
    }, this.hashEnabled && window.addEventListener("hashchange", this._onHashChange);
    let A = !1;
    if (this.hashEnabled) {
      const m = ct(this.nsKey), v = _e(m);
      v && ((E.field !== null && v.fieldOrColumn === E.field || E.column !== null && String(E.column) === v.fieldOrColumn) && vt(function() {
        E._destroyed || E._apply(v.direction, !0);
      }), A = !0);
    }
    if (!A) {
      const m = St(w.getAttribute(l));
      m && m !== "none" && vt(function() {
        E._destroyed || E._apply(m, !0);
      });
    }
    return this;
  }
  c.prototype._resolveTarget = function() {
    return document.getElementById(this.targetId);
  }, c.prototype._updateAriaSort = function(w) {
    const y = this.dom.closest("th");
    y && y.setAttribute("aria-sort", Tr(w));
  }, c.prototype._apply = function(w, y) {
    if (this._destroyed) return;
    if (!this.field && this.column === null) {
      const p = this.dom.closest("th");
      p && p.cellIndex !== void 0 && (this.column = p.cellIndex);
    }
    const E = St(w);
    this._state = E, this.dom.getAttribute(l) !== E && this.dom.setAttribute(l, E), this._updateAriaSort(E);
    const A = this._resolveTarget();
    if (!A) return;
    const m = {
      field: this.field,
      column: this.column,
      direction: E,
      targetId: this.targetId
    };
    if (!y && this.hashEnabled) {
      const p = In(this.field !== null ? this.field : this.column, E);
      mt(this.nsKey, p);
    }
    Z(A, "ln-sort:change", m).defaultPrevented || this._defaultSort(A, E);
  }, c.prototype._defaultSort = function(w, y) {
    const E = qr(w, this.itemsSelector);
    if (!E.length) return;
    const A = E[0].parentNode, m = E.filter(function(_) {
      return !ge(_);
    });
    if (!m.length) return;
    n.has(w) || n.set(w, m.slice());
    let v;
    if (y === "none") {
      const _ = n.get(w) || m;
      n.delete(w), v = _.filter(function(b) {
        return b.parentNode === A && !ge(b);
      });
    } else {
      const _ = this.field, b = this.column, T = m.map(function(q) {
        return o(q, _, b);
      }), g = De(T), S = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base", numeric: !0 }) : null, C = Lr(y, g, S, function(q) {
        return o(q, _, b);
      });
      v = m.slice().sort(C);
    }
    const p = document.createDocumentFragment();
    let d = 0;
    for (let _ = 0; _ < E.length; _++) {
      const b = E[_];
      ge(b) ? p.appendChild(b) : d < v.length && p.appendChild(v[d++]);
    }
    A.appendChild(p);
  }, c.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.dom.removeEventListener("click", this._onClick), document.removeEventListener("ln-sort:change", this._onSortChange), this.hashEnabled && this._onHashChange && window.removeEventListener("hashchange", this._onHashChange), delete this.dom[e]);
  };
  function u(w, y) {
    const E = w[e];
    if (!(!E || E._destroyed))
      if (y === i) {
        const A = w.closest("th");
        E.column = !E.field && A ? A.cellIndex : null;
      } else if (y === l) {
        const A = St(w.getAttribute(l));
        A !== E._state && E._apply(A);
      } else y === h && (E.hashEnabled && E._onHashChange && window.removeEventListener("hashchange", E._onHashChange), E.nsKey = wt(w, "sort"), E.hashEnabled = !!E.nsKey, E.hashEnabled && window.addEventListener("hashchange", E._onHashChange));
  }
  j(t, e, c, "ln-sort", {
    attributes: s,
    persist: {
      attr: l,
      hashActive: function(w) {
        return !!wt(w, "sort");
      }
    }
  });
})();
function rn(t, e, i, l, f = 15) {
  if (l <= 0 || i <= 0)
    return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
  const h = Math.max(0, t || 0), r = Math.max(0, e || 0), s = Math.floor(h / i), a = Math.ceil(r / i), n = Math.max(0, s - f), o = Math.min(l, s + a + f), c = n * i, u = Math.max(0, (l - o) * i);
  return { start: n, end: o, topPadding: c, bottomPadding: u };
}
function xr(t, e) {
  const i = Array.isArray(t) ? t.length : 0, l = e instanceof Set ? e : new Set(e || []);
  let f = 0;
  if (Array.isArray(t))
    for (let s = 0; s < t.length; s++)
      l.has(t[s]) && f++;
  else
    f = l.size;
  const h = i > 0 && f === i, r = f > 0 && f < i;
  return { totalCount: i, selectedCount: f, isAllSelected: h, isIndeterminate: r };
}
function on(t, e, i) {
  const l = new Set(t);
  return e == null || ((i !== void 0 ? i : !l.has(e)) ? l.add(e) : l.delete(e)), l;
}
function sn(t, e, i) {
  const l = new Set(t);
  if (!Array.isArray(e)) return l;
  if (i)
    for (let f = 0; f < e.length; f++)
      e[f] != null && l.add(e[f]);
  else
    for (let f = 0; f < e.length; f++)
      l.delete(e[f]);
  return l;
}
(function() {
  const t = "data-ln-table", e = "lnTable", i = "data-ln-table-empty";
  if (window[e] !== void 0) return;
  function a(m, v) {
    if (!m || !m.isDataDriven) return;
    const p = m.dom.hasAttribute("data-ln-table-window");
    if (p && !m._windowed)
      m._enterWindowedMode(), m._kickWindowInitial();
    else if (!p && m._windowed)
      m._exitWindowedMode();
    else if (p && m._windowed) {
      const d = parseInt(v, 10);
      d > 0 && m._cache.configure({ windowSize: d });
    }
  }
  function n(m, v) {
    if (!m || !m.isDataDriven || !m._windowed || !m._cache) return;
    const p = parseInt(v, 10);
    p > 0 && m._cache.configure({ pageSize: p });
  }
  function o(m, v) {
    if (!m || !m.isDataDriven || !m._windowed || !m._cache) return;
    const p = parseInt(v, 10);
    p >= 0 && m._cache.configure({ threshold: p });
  }
  function c(m, v) {
    if (!m || !m.isDataDriven || !m._windowed || !m._cache) return;
    const p = parseInt(v, 10);
    p >= 0 && m._cache.setGrandTotal(p);
  }
  const u = {
    "data-ln-table": { prop: "name", type: "string", read: $, fallback: "", description: "Table instance name or identifier" },
    "data-ln-table-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-table-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables row selection check controls" },
    "data-ln-table-window": { type: "integer", fallback: 1e3, min: 10, effect: a, description: "Virtual scrolling window size in rows" },
    "data-ln-table-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-table-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-table-count": { type: "integer", min: 0, effect: c, description: "Total record count override for virtual scrollbar calculation" },
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
  function y(m, v) {
    if (m == null || isNaN(m)) return "";
    try {
      return new Intl.NumberFormat(it(v)).format(m);
    } catch {
      return String(m);
    }
  }
  function E(m) {
    let v = m.parentElement;
    for (; v && v !== document.body && v !== document.documentElement; ) {
      const d = getComputedStyle(v).overflowY;
      if (d === "auto" || d === "scroll") return v;
      v = v.parentElement;
    }
    return null;
  }
  function A(m) {
    this.dom = m, tt(this, m, w), this.table = m.querySelector("table"), this.tbody = m.querySelector("[data-ln-table-body]") || m.querySelector("tbody"), this.thead = m.querySelector("thead");
    const v = this.thead ? this.thead.querySelector("tr:last-child") : null;
    this.ths = v ? Array.from(v.querySelectorAll("th")) : [], this._totalSpan = m.querySelector("[data-ln-table-total]"), this._filteredSpan = m.querySelector("[data-ln-table-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== m ? this._filteredSpan.parentElement : null), this._selectedSpan = m.querySelector("[data-ln-table-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== m ? this._selectedSpan.parentElement : null), this.isDataDriven = m.hasAttribute("data-ln-table-source"), this._data = [], this._filteredData = [], this._searchTerm = "", this._sortCol = -1, this._sortDir = null, this._columnFilters = {}, this.selectedIds = /* @__PURE__ */ new Set(), this._virtual = !1, this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._scrollContainer = null, this._colgroup = null;
    const p = this;
    return this._onSetSearch = function(d) {
      const _ = (d.detail && d.detail.query != null ? d.detail.query : d.detail && d.detail.term != null ? d.detail.term : "").trim();
      p.isDataDriven ? (p.currentSearch = _, L(m, "ln-table:search", {
        table: p.name,
        query: p.currentSearch
      }), p._requestData()) : (p._searchTerm = _.toLowerCase(), p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), L(m, "ln-table:filter", {
        term: p._searchTerm,
        matched: p._filteredData.length,
        total: p._data.length
      }));
    }, m.addEventListener("ln-table:set-search", this._onSetSearch), this._onSearchChange = function(d) {
      d.preventDefault(), p._onSetSearch(d);
    }, m.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      p.isDataDriven ? (p.currentFilters = {}, p.currentSearch = "", L(m, "ln-table:clear-filters", { table: p.name }), p._requestData()) : (p._searchTerm = "", p._columnFilters = {}, p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), L(m, "ln-table:filter", {
        term: "",
        matched: p._filteredData.length,
        total: p._data.length
      }));
    }, m.addEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, this.isDataDriven && m.hasAttribute("data-ln-table-window") && this._enterWindowedMode(), this._onSetData = function(d) {
      const _ = d.detail || {}, b = _.data || [], T = _.total != null ? _.total : b.length;
      if (!(p._hasInitialSeed && !p.isLoaded && b.length === 0 && T === 0)) {
        if (p._windowed) {
          p._cache.ingest(_) && !_.provisional && m.classList.remove("ln-table--loading");
          return;
        }
        p._data = b, p._lastTotal = T, p._lastFiltered = _.filtered != null ? _.filtered : p._data.length, p.totalCount = p._lastTotal, p.visibleCount = p._lastFiltered, p.isLoaded = !0, p._hasInitialSeed = !1, m.classList.remove("ln-table--loading"), p._vStart = -1, p._vEnd = -1, p._applyFilterAndSort(), p._render(), p._updateFooter(), L(m, "ln-table:rendered", {
          table: p.name,
          total: p.totalCount,
          visible: p.visibleCount
        });
      }
    }, m.addEventListener("ln-table:set-data", this._onSetData), this._onSetLoading = function(d) {
      const _ = d.detail && d.detail.loading;
      m.classList.toggle("ln-table--loading", !!_), _ && (p.isLoaded = !1);
    }, m.addEventListener("ln-table:set-loading", this._onSetLoading), this._onPageFailed = function(d) {
      !p._windowed || !p._cache || p._cache.release(d.detail && d.detail.offset);
    }, m.addEventListener("ln-table:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !p._windowed || !p._cache || p._cache.revalidate();
    }, m.addEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !p._windowed || !p._cache || p._requestData();
    }, m.addEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this._onSort = function(d) {
      d.preventDefault(), p.currentSort = d.detail.direction === "none" ? null : { field: d.detail.field, direction: d.detail.direction }, p._requestData();
    }, m.addEventListener("ln-sort:change", this._onSort), this._windowed && this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden"), this._onRowClick = function(d) {
      if (d.target.closest("[data-ln-table-row-select]") || d.target.closest("[data-ln-table-row-action]") || d.target.closest("a") || d.target.closest("button") || d.ctrlKey || d.metaKey || d.button === 1) return;
      const _ = d.target.closest("[data-ln-table-row]");
      if (!_) return;
      const b = _.getAttribute("data-ln-table-row-id"), T = _._lnRecord || {};
      L(m, "ln-table:row-click", {
        table: p.name,
        id: b,
        record: T
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowClick), this._onRowAction = function(d) {
      const _ = d.target.closest("[data-ln-table-row-action]");
      if (!_) return;
      const b = _.closest("[data-ln-table-row]");
      if (!b) return;
      const T = _.getAttribute("data-ln-table-row-action"), g = b.getAttribute("data-ln-table-row-id"), S = b._lnRecord || {};
      L(m, "ln-table:row-action", {
        table: p.name,
        id: g,
        action: T,
        record: S
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onRowAction), this.tbody && this.tbody.rows.length > 0 && this._parseRows(), this._windowed ? this._kickWindowInitial() : L(m, "ln-table:request-data", {
      table: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyTbodyObserver = null, this.tbody && this.tbody.rows.length > 0 ? this._parseRows() : this.tbody && (this._emptyTbodyObserver = new MutationObserver(function() {
      p.tbody.rows.length > 0 && (p._emptyTbodyObserver.disconnect(), p._emptyTbodyObserver = null, p._parseRows());
    }), this._emptyTbodyObserver.observe(this.tbody, { childList: !0 })), this._onSort = function(d) {
      d.preventDefault();
      const _ = d.detail.direction === "none" ? null : d.detail.direction;
      p._sortCol = _ === null ? -1 : d.detail.column, p._sortDir = _, p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), L(m, "ln-table:sorted", {
        column: d.detail.column,
        direction: d.detail.direction,
        matched: p._filteredData.length,
        total: p._data.length
      });
    }, m.addEventListener("ln-sort:change", this._onSort), this._onFilterChange = function(d) {
      if (d.preventDefault(), !d.detail) return;
      const _ = d.detail.key, b = d.detail.values || [];
      if (_) {
        if (b.length === 0)
          delete p._columnFilters[_];
        else {
          const T = [];
          for (let g = 0; g < b.length; g++)
            T.push(b[g].toLowerCase());
          p._columnFilters[_] = T;
        }
        p._applyFilterAndSort(), p._vStart = -1, p._vEnd = -1, p._render(), p._updateFooter(), L(m, "ln-table:filter", {
          term: p._searchTerm,
          matched: p._filteredData.length,
          total: p._data.length
        });
      }
    }, m.addEventListener("ln-filter:change", this._onFilterChange)), this;
  }
  A.prototype._parseRows = function() {
    const m = this.tbody.rows, v = this.ths;
    this._data = [], m.length > 0 && (this._rowHeight = m[0].offsetHeight || 40), this._lockColumnWidths();
    for (let p = 0; p < m.length; p++) {
      const d = m[p], _ = [], b = [], T = [];
      for (let S = 0; S < d.cells.length; S++) {
        const C = d.cells[S], q = C.textContent.trim();
        _[S] = yt(C), b[S] = q.toLowerCase(), C.querySelector("[data-ln-table-row-action]") || T.push(q.toLowerCase());
      }
      let g = null;
      if (this.isDataDriven) {
        g = {};
        const S = d.getAttribute("data-ln-table-row-id");
        S != null && (g.id = S);
        for (let C = 0; C < v.length; C++) {
          const q = v[C].getAttribute("data-ln-table-col");
          if (q) {
            const D = C;
            if (D < d.cells.length) {
              const I = d.cells[D];
              g[q] = yt(I);
            }
          }
        }
      }
      this._data.push({
        values: _,
        rawTexts: b,
        html: d.outerHTML,
        searchText: T.join(" "),
        id: this.isDataDriven && g ? g.id : void 0,
        ...g
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-table:ready", {
      total: this._data.length
    });
  }, A.prototype._applyFilterAndSort = function() {
    this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
  }, A.prototype._lockColumnWidths = function() {
    if (!this.table || !this.thead || this._colgroup) return;
    const m = document.createElement("colgroup");
    this.ths.forEach(function(v) {
      const p = document.createElement("col");
      p.style.width = v.offsetWidth + "px", m.appendChild(p);
    }), this.table.insertBefore(m, this.table.firstChild), this.table.style.tableLayout = "fixed", this._colgroup = m;
  }, A.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const m = this._lastTotal, v = this.visibleCount;
        if (m === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        if (this._filteredData.length === 0 || v === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const m = this._filteredData.length;
        m === 0 && (this._searchTerm || Object.keys(this._columnFilters).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : m > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, A.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const m = this._filteredData, v = document.createDocumentFragment();
      for (let p = 0; p < m.length; p++) {
        const d = this._buildRow(m[p]);
        if (!d) break;
        v.appendChild(d);
      }
      this.tbody.replaceChildren(v), this._selectable && this._updateSelectAll();
    } else {
      const m = [], v = this._filteredData;
      for (let p = 0; p < v.length; p++) m.push(v[p].html);
      this.tbody.innerHTML = m.join(""), this._selectable && this._restoreSelection();
    }
  }, A.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const m = this;
    if (!this._rowHeight)
      if (this.tbody && this.tbody.rows.length > 0)
        this._rowHeight = this.tbody.rows[0].offsetHeight || 40;
      else {
        let p = null;
        if (this._windowed) {
          const d = this._cache ? this._cache.peek() : null;
          p = d ? this._buildRow(d) : this._buildPlaceholderRow();
        } else this.isDataDriven && this._data.length > 0 && (p = this._buildRow(this._data[0]));
        p && this.tbody && (this.tbody.appendChild(p), this._rowHeight = p.offsetHeight || 40, p.remove());
      }
    this.isDataDriven ? this._scrollContainer = E(this.dom) : this._scrollContainer = null;
    const v = this._scrollContainer || window;
    this._scrollHandler = function() {
      m._rafId || (m._rafId = requestAnimationFrame(function() {
        m._rafId = null, m._windowed ? m._renderWindowed() : m._renderVirtual();
      }));
    }, v.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._scrollHandler, { passive: !0 });
  }, A.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), window.removeEventListener("resize", this._scrollHandler), this._scrollHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, A.prototype._renderVirtual = function() {
    const m = this._filteredData, v = m.length, p = this._rowHeight;
    if (!p || !v) return;
    const d = this.thead ? this.thead.offsetHeight : 0, _ = this._scrollContainer;
    let b, T;
    if (_) {
      const R = this.table.getBoundingClientRect(), O = _.getBoundingClientRect(), P = R.top - O.top + _.scrollTop + d;
      b = _.scrollTop - P, T = _.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + d;
      b = window.scrollY - P, T = window.innerHeight;
    }
    const g = rn(b, T, p, v, 15), S = g.start, C = g.end;
    if (S === this._vStart && C === this._vEnd) return;
    this._vStart = S, this._vEnd = C;
    const q = this.ths.length || 1, D = g.topPadding, I = g.bottomPadding;
    if (this.isDataDriven) {
      const R = document.createDocumentFragment();
      if (D > 0) {
        const O = document.createElement("tr");
        O.className = "ln-table__spacer", O.setAttribute("aria-hidden", "true");
        const P = document.createElement("td");
        P.setAttribute("colspan", q), P.style.height = D + "px", O.appendChild(P), R.appendChild(O);
      }
      for (let O = S; O < C; O++) {
        const P = this._buildRow(m[O]);
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
      for (let O = S; O < C; O++) R += m[O].html;
      I > 0 && (R += '<tr class="ln-table__spacer" aria-hidden="true"><td colspan="' + q + '" style="height:' + I + 'px;padding:0;border:none"></td></tr>'), this.tbody.innerHTML = R, this._selectable && this._restoreSelection();
    }
  }, A.prototype._buildPlaceholderRow = function() {
    const m = document.createElement("tr");
    m.className = "ln-table__placeholder", m.setAttribute("aria-hidden", "true");
    const v = document.createElement("td");
    return v.setAttribute("colspan", this.ths.length || 1), v.style.height = this._rowHeight + "px", m.appendChild(v), m;
  }, A.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const m = this._rowHeight;
    if (!m) return;
    const v = this._cache.logicalTotal, p = this.thead ? this.thead.offsetHeight : 0, d = this._scrollContainer;
    let _, b;
    if (d) {
      const R = this.table.getBoundingClientRect(), O = d.getBoundingClientRect(), P = R.top - O.top + d.scrollTop + p;
      _ = d.scrollTop - P, b = d.clientHeight;
    } else {
      const P = this.table.getBoundingClientRect().top + window.scrollY + p;
      _ = window.scrollY - P, b = window.innerHeight;
    }
    const T = rn(_, b, m, v, 15), g = T.start, S = T.end, C = this.ths.length || 1, q = T.topPadding, D = T.bottomPadding, I = document.createDocumentFragment();
    if (q > 0) {
      const R = document.createElement("tr");
      R.className = "ln-table__spacer", R.setAttribute("aria-hidden", "true");
      const O = document.createElement("td");
      O.setAttribute("colspan", C), O.style.height = q + "px", R.appendChild(O), I.appendChild(R);
    }
    for (let R = g; R < S; R++)
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
    this.tbody.replaceChildren(I), this._vStart = g, this._vEnd = S, this._cache.ensure(g, S);
  }, A.prototype._showEmptyState = function() {
    const m = this.ths.length || 1;
    let v = null, p = null;
    if (this.isDataDriven) {
      const d = this._lastTotal != null ? this._lastTotal : this._data.length, b = this.visibleCount === 0 && d > 0, T = b ? this.name + "-empty-filtered" : this.name + "-empty";
      if (p = Ct(this.dom, T, "ln-table"), !p) {
        const g = this.dom.querySelector("template[data-ln-table-empty]");
        if (g) {
          const S = b ? "search" : "initial", C = g.content.querySelector('[data-ln-table-empty-when="' + S + '"]') || g.content.firstElementChild;
          C && (p = document.importNode(C, !0));
        }
      }
      if (p)
        if (p.tagName === "TR")
          v = p;
        else {
          const g = document.createElement("td");
          g.setAttribute("colspan", String(m)), g.appendChild(p);
          const S = document.createElement("tr");
          S.className = "ln-table__empty", S.appendChild(g), v = S;
        }
    } else {
      const d = this.dom.querySelector("template[" + i + "]"), _ = document.createElement("td");
      _.setAttribute("colspan", String(m)), d && _.appendChild(document.importNode(d.content, !0));
      const b = document.createElement("tr");
      b.className = "ln-table__empty", b.appendChild(_), v = b;
    }
    v ? this.tbody.replaceChildren(v) : this.tbody.replaceChildren(), L(this.dom, "ln-table:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, A.prototype._fillRow = function(m, v) {
    Gt(m, v);
    const p = m.querySelectorAll("[data-ln-table-cell-attr]");
    for (let d = 0; d < p.length; d++) {
      const _ = p[d], b = _.getAttribute("data-ln-table-cell-attr").split(",");
      for (let T = 0; T < b.length; T++) {
        const g = b[T].trim().split(":");
        if (g.length !== 2) continue;
        const S = g[0].trim(), C = g[1].trim();
        v[S] != null && _.setAttribute(C, v[S]);
      }
    }
  }, A.prototype._buildRow = function(m) {
    let v = Ct(this.dom, this.name + "-row", "ln-table");
    if (!v) {
      const d = this.dom.querySelector("template[data-ln-table-row]");
      d && (v = document.importNode(d.content, !0));
    }
    let p = v ? v.querySelector("[data-ln-table-row]") || v.firstElementChild : null;
    if (p)
      this._fillRow(p, m);
    else if (m && m.html) {
      const d = document.createElement("tbody");
      d.innerHTML = m.html, p = d.firstElementChild;
    } else {
      p = document.createElement("tr"), p.setAttribute("data-ln-table-row", "");
      const d = this.ths;
      for (let _ = 0; _ < d.length; _++) {
        const b = d[_].hasAttribute("data-ln-table-col-select"), T = document.createElement("td");
        if (b) {
          const g = document.createElement("input");
          g.type = "checkbox", g.setAttribute("data-ln-table-row-select", ""), g.setAttribute("aria-label", "Select row"), T.appendChild(g);
        } else {
          const g = d[_].getAttribute("data-ln-table-col");
          g && m[g] != null && (T.textContent = String(m[g]));
        }
        p.appendChild(T);
      }
    }
    if (p._lnRecord = m, m.id != null && p.setAttribute("data-ln-table-row-id", m.id), this._selectable && m.id != null && this.selectedIds.has(String(m.id))) {
      p.classList.add("ln-row-selected");
      const d = p.querySelector("[data-ln-table-row-select]");
      d && (d.checked = !0);
    }
    return p;
  }, A.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-table--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    hn(this, "ln-table:request-data", "table");
  }, A.prototype._enterWindowedMode = function() {
    const m = this, v = this.dom, p = parseInt(v.getAttribute("data-ln-table-window"), 10), d = parseInt(v.getAttribute("data-ln-table-window-page"), 10), _ = parseInt(v.getAttribute("data-ln-table-window-threshold"), 10);
    this._onCacheChange = function() {
      !m._windowed || !m._cache || (m.totalCount = m._cache.grandTotal, m.visibleCount = m._cache.logicalTotal, m._lastTotal = m._cache.grandTotal, m.isLoaded = !0, m._vStart = -1, m._vEnd = -1, m._render(), m._updateFooter(), L(v, "ln-table:rendered", {
        table: m.name,
        total: m.totalCount,
        visible: m.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = qn({
      windowSize: p > 0 ? p : 1e3,
      pageSize: d > 0 ? d : 200,
      threshold: _ >= 0 ? _ : 25,
      fetchDebounce: 120,
      requestPage: function(b, T, g) {
        L(v, "ln-table:request-data", {
          table: m.name,
          sort: b.sort,
          filters: b.filters,
          search: b.search,
          offset: T,
          limit: g,
          queryGen: m._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, A.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      let m = parseInt(this.dom.getAttribute("data-ln-table-count"), 10);
      if (isNaN(m) && this._totalSpan) {
        const p = this._totalSpan.textContent.replace(/[^\d]/g, "");
        p && (m = parseInt(p, 10));
      }
      const v = m > 0 ? m : this._data.length;
      this._cache.ingest({
        data: this._data,
        offset: 0,
        total: v,
        filtered: v
      });
    } else
      this.dom.classList.add("ln-table--loading"), this._cache.requestInitial({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
  }, A.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._rowHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-table--loading"), this._requestData();
  }, A.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox || !this.tbody) return;
    const m = this.tbody.querySelectorAll("[data-ln-table-row]"), v = [];
    for (let d = 0; d < m.length; d++) {
      const _ = m[d].getAttribute("data-ln-table-row-id");
      _ != null && v.push(_);
    }
    const p = xr(v, this.selectedIds);
    this._selectAllCheckbox.checked = p.isAllSelected, this._selectAllCheckbox.indeterminate = p.isIndeterminate;
  }, A.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const m = this.tbody.querySelectorAll("[data-ln-table-row]");
    for (let v = 0; v < m.length; v++) {
      const p = m[v].getAttribute("data-ln-table-row-id"), d = p != null && this.selectedIds.has(p);
      m[v].classList.toggle("ln-row-selected", d);
      const _ = m[v].querySelector("[data-ln-table-row-select]");
      _ && (_.checked = d);
    }
    this._updateSelectAll();
  }, Object.defineProperty(A.prototype, "selectedCount", {
    get: function() {
      return this.selectedIds.size;
    },
    set: function() {
    }
  }), A.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const m = this;
    if (this._onSelectionChange = function(v) {
      const p = v.target.closest("[data-ln-table-row-select]");
      if (!p) return;
      const d = p.closest("[data-ln-table-row]");
      if (!d) return;
      const _ = d.getAttribute("data-ln-table-row-id");
      _ != null && (m.selectedIds = on(m.selectedIds, _, p.checked), d.classList.toggle("ln-row-selected", p.checked), m.selectedCount = m.selectedIds.size, m._updateSelectAll(), m._updateFooter(), L(m.dom, "ln-table:select", {
        table: m.name,
        selectedIds: m.selectedIds,
        count: m.selectedCount
      }));
    }, this.tbody && this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector('[data-ln-table-col-select] input[type="checkbox"]') || this.dom.querySelector("[data-ln-table-col-select]"), this._selectAllCheckbox && this._selectAllCheckbox.tagName === "TH") {
      const v = document.createElement("input");
      v.type = "checkbox";
      const p = m.dom.querySelector('[data-ln-table-dict="select-all"]'), d = m.dom.getAttribute("data-ln-table-select-all-label") || (p ? p.textContent.trim() : null) || "Select all";
      v.setAttribute("aria-label", d), this._selectAllCheckbox.appendChild(v), this._selectAllCheckbox = v;
    }
    if (this._selectAllCheckbox && (this._onSelectAll = function() {
      const v = m._selectAllCheckbox.checked, p = m.tbody ? m.tbody.querySelectorAll("[data-ln-table-row]") : [], d = [];
      for (let _ = 0; _ < p.length; _++) {
        const b = p[_].getAttribute("data-ln-table-row-id"), T = p[_].querySelector("[data-ln-table-row-select]");
        b != null && (d.push(b), p[_].classList.toggle("ln-row-selected", v), T && (T.checked = v));
      }
      m.selectedIds = sn(m.selectedIds, d, v), m.selectedCount = m.selectedIds.size, L(m.dom, "ln-table:select-all", {
        table: m.name,
        selected: v
      }), L(m.dom, "ln-table:select", {
        table: m.name,
        selectedIds: m.selectedIds,
        count: m.selectedCount
      }), m._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll)), this.tbody) {
      const v = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let p = 0; p < v.length; p++) {
        const d = v[p].querySelector("[data-ln-table-row-select]"), _ = v[p].getAttribute("data-ln-table-row-id");
        d && d.checked && _ != null && (m.selectedIds = on(m.selectedIds, _, !0), v[p].classList.add("ln-row-selected"));
      }
      this.selectedCount = this.selectedIds.size, this.selectedCount > 0 && this._updateSelectAll();
    }
  }, A.prototype._disableSelection = function() {
    if (!this._selectableActive) return;
    this._selectableActive = !1, this.tbody && this._onSelectionChange && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll);
    const m = this.dom.querySelector("[data-ln-table-col-select]");
    if (m) {
      const v = m.querySelector('input[type="checkbox"]');
      v && v.remove();
    }
    if (this._selectAllCheckbox = null, this.selectedIds = sn(this.selectedIds, Array.from(this.selectedIds), !1), this.selectedCount = 0, this.tbody) {
      const v = this.tbody.querySelectorAll("[data-ln-table-row]");
      for (let p = 0; p < v.length; p++) {
        v[p].classList.remove("ln-row-selected");
        const d = v[p].querySelector("[data-ln-table-row-select]");
        d && (d.checked = !1);
      }
    }
    this._updateFooter();
  }, A.prototype._updateFooter = function() {
    let m = 0, v = 0;
    this.isDataDriven ? (m = this._lastTotal != null ? this._lastTotal : this._data.length, v = this.visibleCount) : (m = this._data.length, v = this._filteredData.length);
    const p = v < m;
    if (this._totalSpan && (this._totalSpan.textContent = y(m, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = p ? y(v, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !p), this._selectedSpan) {
      const d = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = d > 0 ? y(d, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", d === 0);
    }
  }, A.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-table:set-search", this._onSetSearch), this.dom.removeEventListener("ln-table:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this.dom.removeEventListener("ln-table:set-data", this._onSetData), this.dom.removeEventListener("ln-table:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-table:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-table:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-table:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onRowClick), this.tbody.removeEventListener("click", this._onRowAction)), this._cache && this._cache.destroy()) : (this._emptyTbodyObserver && (this._emptyTbodyObserver.disconnect(), this._emptyTbodyObserver = null), this.dom.removeEventListener("ln-sort:change", this._onSort), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-filter:change", this._onFilterChange)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._colgroup && (this._colgroup.remove(), this._colgroup = null), this.table && (this.table.style.tableLayout = ""), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, A, "ln-table", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-table-coordinator", e = "lnTableCoordinator";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-table-coordinator": { type: "marker", description: "Mounts table coordinator mediating between table, search, filter, and pagination" }
  };
  document.addEventListener("keydown", function(s) {
    if (s.key !== "/" || s.defaultPrevented || document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
    const a = document.querySelector("[" + t + "] [data-ln-search-for]") || document.querySelector("[data-ln-search-for]");
    if (!a) return;
    const n = a.tagName === "INPUT" || a.tagName === "TEXTAREA" ? a : a.querySelector('input[type="search"], input[type="text"], input');
    n && (s.preventDefault(), n.focus());
  });
  function l(s) {
    return this.dom = s, r(this), this;
  }
  function f(s, a) {
    const n = a ? '[data-ln-search-for="' + a + '"]' : "[data-ln-search-for]", o = s.querySelector(n) || document.querySelector(n);
    return o ? o.tagName === "INPUT" || o.tagName === "TEXTAREA" ? o : o.querySelector("input, textarea") : null;
  }
  function h(s, a) {
    if (a) {
      const o = s.querySelectorAll('[data-ln-filter="' + a + '"]');
      if (o.length > 0) return o;
      const c = document.querySelectorAll('[data-ln-filter="' + a + '"]');
      if (c.length > 0) return c;
    }
    const n = s.querySelectorAll("[data-ln-filter]");
    return n.length > 0 ? n : document.querySelectorAll("[data-ln-filter]");
  }
  function r(s) {
    const a = s.dom;
    function n(o) {
      const c = o.target;
      if (c && c.hasAttribute && (c.hasAttribute("data-ln-table") || c.tagName === "TABLE")) return c;
      const u = o.detail && o.detail.targetId || c && c.id;
      return u ? a.querySelector('[data-ln-table-source="' + u + '"]') || a.querySelector('[data-ln-table="' + u + '"]') || a.querySelector("#" + u) || (a.id === u ? a : null) || document.getElementById(u) : null;
    }
    s._handlers = {
      // Query state is not forwarded here. The source owns search/filter/sort
      // (docs/architecture/shared-query.md) and ln-data-coordinator re-serves
      // every view bound to it — a second forwarder would fetch twice for one
      // user change. What is left is the header indicator, which is Layer 2
      // policy: ln-table never sets this class itself.
      filter: function(o) {
        if (!o.detail) return;
        const c = n(o);
        if (!c) return;
        const u = o.detail.key, w = o.detail.values || [], y = c.querySelectorAll("th");
        for (let E = 0; E < y.length; E++)
          if ((y[E].getAttribute("data-ln-table-filter-col") || y[E].getAttribute("data-ln-filter-col") || y[E].getAttribute("data-ln-filter-key") || y[E].getAttribute("data-ln-field")) === u) {
            const m = y[E].querySelector("[data-ln-table-col-filter], .table-filter");
            m && m.classList.toggle("ln-filter-active", w.length > 0);
            break;
          }
      },
      // Clear-all has no ID binding of its own — resolve structurally,
      // scoped to this host only (never document-wide).
      clear: function(o) {
        const c = o.target.closest("[data-ln-table-clear], [data-ln-table-clear-all]");
        if (!c) return;
        const u = c.closest("[data-ln-table], table") || a.querySelector("[data-ln-table], table");
        if (!u) return;
        const w = u.lnTable && u.lnTable.name || u.id, y = u.querySelectorAll("th");
        for (let v = 0; v < y.length; v++) {
          const p = y[v].querySelector("[data-ln-table-col-filter], .table-filter");
          p && p.classList.remove("ln-filter-active");
        }
        const E = u.getAttribute("data-ln-table-source") || u.id, A = E ? document.getElementById(E) : null;
        if (A && A.hasAttribute("data-ln-search"))
          A.setAttribute("data-ln-search", "");
        else {
          const v = f(a, E);
          v && v.value !== "" && (v.value = "", v.dispatchEvent(new Event("input", { bubbles: !0 })));
        }
        const m = h(a, E);
        for (let v = 0; v < m.length; v++) {
          const p = m[v].querySelector("[data-ln-filter-reset]");
          if (!p) continue;
          const d = m[v].querySelectorAll("input:not([data-ln-filter-reset]):checked").length > 0;
          (!p.checked || d) && (p.checked = !0, p.dispatchEvent(new Event("change", { bubbles: !0 })));
        }
        u.lnTable && !u.hasAttribute("data-ln-table-source") && L(u, "ln-table:request-clear-filters", { table: w });
      }
    }, a.addEventListener("ln-filter:change", s._handlers.filter), a.addEventListener("click", s._handlers.clear);
  }
  l.prototype.destroy = function() {
    this.dom[e] && (this._handlers && (this.dom.removeEventListener("ln-filter:change", this._handlers.filter), this.dom.removeEventListener("click", this._handlers.clear), this._handlers = null), delete this.dom[e]);
  }, j(t, e, l, "ln-table-coordinator", {
    attributes: i
  });
})();
(function() {
  const t = "data-ln-list", e = "lnList", i = "data-ln-list-empty";
  if (window[e] !== void 0) return;
  function a(d, _) {
    if (!d || !d.isDataDriven) return;
    const b = d.dom.hasAttribute("data-ln-list-window");
    if (b && !d._windowed)
      d._enterWindowedMode(), d._kickWindowInitial();
    else if (!b && d._windowed)
      d._exitWindowedMode();
    else if (b && d._windowed) {
      const T = parseInt(_, 10);
      T > 0 && d._cache.configure({ windowSize: T });
    }
  }
  function n(d, _) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const b = parseInt(_, 10);
    b > 0 && d._cache.configure({ pageSize: b });
  }
  function o(d, _) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const b = parseInt(_, 10);
    b >= 0 && d._cache.configure({ threshold: b });
  }
  function c(d, _) {
    if (!d || !d.isDataDriven || !d._windowed || !d._cache) return;
    const b = parseInt(_, 10);
    b >= 0 && d._cache.setGrandTotal(b);
  }
  const u = {
    "data-ln-list": { prop: "name", type: "string", read: $, fallback: "", description: "List instance name or identifier" },
    "data-ln-list-source": { prop: "source", type: "string", read: $, fallback: "", description: "Source store or coordinator addressing" },
    "data-ln-list-selectable": { prop: "_selectable", type: "boolean", read: It, description: "Enables item selection controls" },
    "data-ln-list-window": { type: "integer", fallback: 1e3, min: 10, effect: a, description: "Virtual scrolling window size in items" },
    "data-ln-list-window-page": { type: "integer", fallback: 200, min: 5, effect: n, description: "Virtual scrolling slice page size" },
    "data-ln-list-window-threshold": { type: "integer", fallback: 50, min: 0, effect: o, description: "Scroll threshold margin in pixels to trigger page fetch" },
    "data-ln-list-count": { type: "integer", min: 0, effect: c, description: "Total item count override for virtual scrollbar calculation" },
    "data-ln-list-empty": { type: "marker", description: "Container for list empty state" },
    "data-ln-list-field": { type: "string", description: "Field name mapping for list item binding" }
  }, w = et(u);
  function y(d, _) {
    if (d == null || isNaN(d)) return "";
    try {
      return new Intl.NumberFormat(it(_)).format(d);
    } catch {
      return String(d);
    }
  }
  function E(d) {
    let _ = d;
    for (; _ && _ !== document.body && _ !== document.documentElement; ) {
      const T = getComputedStyle(_).overflowY;
      if (T === "auto" || T === "scroll") return _;
      _ = _.parentElement;
    }
    return null;
  }
  function A(d) {
    const _ = d._scrollContainer || E(d.dom);
    return {
      container: _,
      top: _ ? _.scrollTop : window.scrollY
    };
  }
  function m(d) {
    d.container ? d.container.scrollTop = d.top : window.scrollTo(window.scrollX, d.top);
  }
  function v(d) {
    if (!d) return 0;
    const _ = getComputedStyle(d), b = parseFloat(_.marginTop) || 0, T = parseFloat(_.marginBottom) || 0;
    return d.offsetHeight + b + T;
  }
  function p(d) {
    this.dom = d, tt(this, d, w), this.tbody = d.querySelector("[data-ln-list-body]") || d, this.isDataDriven = d.hasAttribute("data-ln-list-source"), this._totalSpan = d.querySelector("[data-ln-list-total]"), this._filteredSpan = d.querySelector("[data-ln-list-filtered]"), this._filteredSpan && (this._filteredWrap = this._filteredSpan.parentElement !== d ? this._filteredSpan.parentElement : null), this._selectedSpan = d.querySelector("[data-ln-list-selected]"), this._selectedSpan && (this._selectedWrap = this._selectedSpan.parentElement !== d ? this._selectedSpan.parentElement : null), this._data = [], this._filteredData = [], this.selectedIds = /* @__PURE__ */ new Set(), this._searchTerm = "", this._filters = {}, this._sortField = null, this._sortDir = null, this._virtual = !1, this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._rafId = null, this._scrollHandler = null, this._resizeHandler = null, this._scrollContainer = null, this.isUl = this.tbody.tagName === "UL" || this.tbody.tagName === "OL";
    const _ = this;
    return this._onSetSearch = function(b) {
      const T = (b.detail && b.detail.query != null ? b.detail.query : b.detail && b.detail.term != null ? b.detail.term : "").trim();
      _.isDataDriven ? (_.currentSearch = T, L(d, "ln-list:search", {
        list: _.name,
        query: _.currentSearch
      }), _._requestData()) : (_._searchTerm = T.toLowerCase(), _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), L(d, "ln-list:filter", {
        term: _._searchTerm,
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, d.addEventListener("ln-list:set-search", this._onSetSearch), this._onSearchChange = function(b) {
      b.preventDefault(), _._onSetSearch(b);
    }, d.addEventListener("ln-search:change", this._onSearchChange), this._onRequestClearFilters = function() {
      _.isDataDriven ? (_.currentFilters = {}, _.currentSearch = "", L(d, "ln-list:clear-filters", { list: _.name }), _._requestData()) : (_._searchTerm = "", _._filters = {}, _._sortField = null, _._sortDir = null, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), L(d, "ln-list:filter", {
        term: "",
        matched: _._filteredData.length,
        total: _._data.length
      }));
    }, d.addEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this._selectableActive = !1, this._selectable && this._enableSelection(), this.isDataDriven ? (this.isLoaded = !1, this.totalCount = 0, this.visibleCount = 0, this.currentSort = null, this.currentFilters = {}, this.currentSearch = "", this._lastTotal = 0, this._lastFiltered = 0, this._hasInitialSeed = !1, this._windowed = !1, this._cache = null, d.hasAttribute("data-ln-list-window") && this._enterWindowedMode(), this._onSetData = function(b) {
      const T = b.detail || {}, g = T.data || [], S = T.total != null ? T.total : g.length;
      if (!(_._hasInitialSeed && !_.isLoaded && g.length === 0 && S === 0)) {
        if (_._windowed) {
          _._cache.ingest(T) && !T.provisional && d.classList.remove("ln-list--loading");
          return;
        }
        _._data = g, _._lastTotal = S, _._lastFiltered = T.filtered != null ? T.filtered : _._data.length, _.totalCount = _._lastTotal, _.visibleCount = _._lastFiltered, _.isLoaded = !0, _._hasInitialSeed = !1, d.classList.remove("ln-list--loading"), _._vStart = -1, _._vEnd = -1, _._applyFilterAndSort(), _._render(), _._updateFooter(), L(d, "ln-list:rendered", {
          list: _.name,
          total: _.totalCount,
          visible: _.visibleCount
        });
      }
    }, d.addEventListener("ln-list:set-data", this._onSetData), this._onSetLoading = function(b) {
      const T = b.detail && b.detail.loading;
      d.classList.toggle("ln-list--loading", !!T), T && (_.isLoaded = !1);
    }, d.addEventListener("ln-list:set-loading", this._onSetLoading), this._onPageFailed = function(b) {
      !_._windowed || !_._cache || _._cache.release(b.detail && b.detail.offset);
    }, d.addEventListener("ln-list:page-failed", this._onPageFailed), this._onRequestRevalidate = function() {
      !_._windowed || !_._cache || _._cache.revalidate();
    }, d.addEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this._onRequestInvalidate = function() {
      !_._windowed || !_._cache || _._requestData();
    }, d.addEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this._onSort = function(b) {
      b.detail.field != null && (b.preventDefault(), _.currentSort = b.detail.direction === "none" ? null : { field: b.detail.field, direction: b.detail.direction }, _._requestData());
    }, d.addEventListener("ln-sort:change", this._onSort), this._onItemClick = function(b) {
      if (b.target.closest("[data-ln-item-select]") || b.target.closest("[data-ln-item-action]") || b.target.closest("a") || b.target.closest("button") || b.ctrlKey || b.metaKey || b.button === 1) return;
      const T = b.target.closest("[data-ln-item]");
      if (!T) return;
      const g = T.getAttribute("data-ln-item-id"), S = T._lnRecord || {};
      L(d, "ln-list:item-click", {
        list: _.name,
        id: g,
        record: S
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemClick), this._onItemAction = function(b) {
      const T = b.target.closest("[data-ln-item-action]");
      if (!T) return;
      const g = T.closest("[data-ln-item]");
      if (!g) return;
      const S = T.getAttribute("data-ln-item-action"), C = g.getAttribute("data-ln-item-id"), q = g._lnRecord || {};
      L(d, "ln-list:item-action", {
        list: _.name,
        id: C,
        action: S,
        record: q
      });
    }, this.tbody && this.tbody.addEventListener("click", this._onItemAction), this.tbody && this.tbody.children.length > 0 && this._parseChildren(), this._windowed ? this._kickWindowInitial() : L(d, "ln-list:request-data", {
      list: this.name,
      sort: this.currentSort,
      filters: this.currentFilters,
      search: this.currentSearch
    })) : (this._emptyObserver = null, this.tbody && this.tbody.children.length > 0 ? this._parseChildren() : this.tbody && (this._emptyObserver = new MutationObserver(function() {
      _.tbody.children.length > 0 && (_._emptyObserver.disconnect(), _._emptyObserver = null, _._parseChildren());
    }), this._emptyObserver.observe(this.tbody, { childList: !0 })), this._onFilterChange = function(b) {
      if (b.preventDefault(), !b.detail) return;
      const T = b.detail.key, g = b.detail.values || [];
      if (T) {
        if (g.length === 0)
          delete _._filters[T];
        else {
          const S = [];
          for (let C = 0; C < g.length; C++)
            S.push(g[C].toLowerCase());
          _._filters[T] = S;
        }
        _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), L(d, "ln-list:filter", {
          term: _._searchTerm,
          matched: _._filteredData.length,
          total: _._data.length
        });
      }
    }, d.addEventListener("ln-filter:change", this._onFilterChange), this._onSort = function(b) {
      if (b.detail && b.detail.field == null) return;
      b.preventDefault();
      const T = b.detail && b.detail.direction === "none" ? null : b.detail && b.detail.direction;
      _._sortField = T === null ? null : b.detail && b.detail.field, _._sortDir = T, _._applyFilterAndSort(), _._vStart = -1, _._vEnd = -1, _._render(), _._updateFooter(), L(d, "ln-list:sorted", {
        field: _._sortField,
        direction: b.detail && b.detail.direction,
        matched: _._filteredData.length,
        total: _._data.length
      });
    }, d.addEventListener("ln-sort:change", this._onSort)), this;
  }
  p.prototype._parseChildren = function() {
    const d = Array.from(this.tbody.children).filter((_) => !_.classList.contains("ln-list__spacer"));
    this._data = [], d.length > 0 && (this._itemHeight = v(d[0]) || 50);
    for (let _ = 0; _ < d.length; _++) {
      const b = d[_], T = b.getAttribute("data-ln-item-id") || b.getAttribute("id"), g = b.textContent.trim().toLowerCase();
      let S = null;
      if (this.isDataDriven) {
        S = {}, T != null && (S.id = T);
        const D = b.querySelectorAll("[data-ln-list-field]");
        for (let I = 0; I < D.length; I++) {
          const R = D[I], O = R.getAttribute("data-ln-list-field");
          O && (S[O] = yt(R));
        }
      }
      const C = {}, q = b.querySelectorAll("[data-ln-list-field], [data-ln-field]");
      for (let D = 0; D < q.length; D++) {
        const I = q[D], R = I.getAttribute("data-ln-list-field") || I.getAttribute("data-ln-field");
        R && (C[R] = yt(I));
      }
      for (let D = 0; D < b.attributes.length; D++) {
        const I = b.attributes[D];
        if (I.name.startsWith("data-") && !I.name.startsWith("data-ln-")) {
          const R = I.name.slice(5);
          R && (C[R] = I.value);
        }
      }
      this._data.push({
        html: b.outerHTML,
        id: T,
        searchText: g,
        fields: C,
        ...S || {}
      });
    }
    this._filteredData = this._data.slice(), this._data.length > 0 && (this._hasInitialSeed = !0), this.isDataDriven && (this._lastTotal = this._data.length, this._lastFiltered = this._data.length, this.totalCount = this._data.length, this.visibleCount = this._data.length, this._updateFooter()), this._render(), L(this.dom, "ln-list:ready", {
      total: this._data.length
    });
  }, p.prototype._applyFilterAndSort = function() {
    if (this.isDataDriven)
      this._filteredData = this._data ? this._data.slice() : [], this.visibleCount = this.isDataDriven && this._lastFiltered != null ? this._lastFiltered : this._filteredData.length;
    else {
      const d = this._searchTerm, _ = d ? d.split(/\s+/).filter(Boolean) : [], b = this._filters || {}, T = Object.keys(b).length > 0;
      if (_.length === 0 && !T ? this._filteredData = this._data.slice() : this._filteredData = this._data.filter(function(g) {
        if (_.length > 0 && !_.every(function(C) {
          return g.searchText && g.searchText.indexOf(C) !== -1;
        }))
          return !1;
        if (T)
          for (const S in b) {
            const C = b[S];
            if (C && C.length > 0) {
              const q = g.fields && g.fields[S] !== void 0 ? g.fields[S] : g[S] !== void 0 ? g[S] : null, D = q != null ? String(q).toLowerCase() : "";
              if (C.indexOf(D) === -1) return !1;
            }
          }
        return !0;
      }), this._sortField && this._sortDir) {
        const g = this._sortField, S = this._sortDir === "desc" ? -1 : 1, C = typeof Intl < "u" ? new Intl.Collator(it(this.dom), { sensitivity: "base" }) : null, q = this._filteredData.map(function(I) {
          return I.fields && I.fields[g] !== void 0 ? I.fields[g] : I[g];
        }), D = De(q);
        this._filteredData.sort(function(I, R) {
          const O = I.fields && I.fields[g] !== void 0 ? I.fields[g] : I[g], P = R.fields && R.fields[g] !== void 0 ? R.fields[g] : R[g];
          return Re(O, P, D, C) * S;
        });
      }
    }
  }, p.prototype._render = function() {
    if (this.tbody)
      if (this.isDataDriven) {
        if (this._windowed) {
          this._renderWindowed();
          return;
        }
        const d = this._lastTotal, _ = this.visibleCount;
        if (d === 0 || this._filteredData.length === 0 || _ === 0) {
          this._disableVirtualScroll(), this._showEmptyState();
          return;
        }
        this._filteredData.length > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      } else {
        const d = this._filteredData.length;
        d === 0 && (this._searchTerm || Object.keys(this._filters || {}).length > 0) ? (this._disableVirtualScroll(), this._showEmptyState()) : d > 200 ? (this._enableVirtualScroll(), this._renderVirtual()) : (this._disableVirtualScroll(), this._renderAll());
      }
  }, p.prototype._renderAll = function() {
    if (this.isDataDriven) {
      const d = this._filteredData, _ = document.createDocumentFragment();
      for (let T = 0; T < d.length; T++) {
        const g = this._buildItem(d[T]);
        g && _.appendChild(g);
      }
      const b = A(this);
      this.tbody.replaceChildren(_), m(b), this._selectable && this._updateSelectAll();
    } else {
      const d = [], _ = this._filteredData;
      for (let T = 0; T < _.length; T++) d.push(_[T].html);
      const b = A(this);
      this.tbody.innerHTML = d.join(""), m(b), this._selectable && this._restoreSelection();
    }
  }, p.prototype._readGridLayout = function() {
    const d = getComputedStyle(this.tbody), _ = d.gridTemplateColumns;
    let b = 1;
    if (_ && _ !== "none") {
      const g = _.trim().split(/\s+/).filter(Boolean);
      g.length > 0 && (b = g.length);
    }
    const T = parseFloat(d.rowGap);
    return { columns: b, rowGap: isNaN(T) ? 0 : T };
  }, p.prototype._measureItemHeight = function() {
    if (this._windowed) {
      const d = this._cache.peek(), _ = d ? this._buildItem(d) : this._buildPlaceholderItem();
      _ && (this.tbody.textContent = "", this.tbody.appendChild(_), this._itemHeight = v(_) || 50, this.tbody.textContent = "");
    } else if (this.isDataDriven) {
      if (this._data.length > 0) {
        const d = this._buildItem(this._data[0]);
        d && (this.tbody.textContent = "", this.tbody.appendChild(d), this._itemHeight = v(d) || 50, this.tbody.textContent = "");
      }
    } else {
      const d = this.tbody.children;
      d.length > 0 && (this._itemHeight = v(d[0]) || 50);
    }
  }, p.prototype._enableVirtualScroll = function() {
    if (this._virtual) return;
    this._virtual = !0, this._vStart = -1, this._vEnd = -1;
    const d = this;
    this._itemHeight || this._measureItemHeight(), this._scrollContainer = E(this.dom);
    const _ = this._scrollContainer || window;
    this._scrollHandler = function() {
      d._rafId || (d._rafId = requestAnimationFrame(function() {
        d._rafId = null, d._windowed ? d._renderWindowed() : d._renderVirtual();
      }));
    }, this._resizeHandler = function() {
      d._itemHeight = 0, d._measureItemHeight(), d._vStart = -1, d._vEnd = -1, d._windowed ? d._renderWindowed() : d._renderVirtual();
    }, _.addEventListener("scroll", this._scrollHandler, { passive: !0 }), window.addEventListener("resize", this._resizeHandler, { passive: !0 });
  }, p.prototype._disableVirtualScroll = function() {
    this._virtual && (this._virtual = !1, this._scrollHandler && ((this._scrollContainer || window).removeEventListener("scroll", this._scrollHandler), this._scrollHandler = null), this._resizeHandler && (window.removeEventListener("resize", this._resizeHandler), this._resizeHandler = null), this._scrollContainer = null, this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = null), this._vStart = -1, this._vEnd = -1);
  }, p.prototype._renderVirtual = function() {
    const d = this._filteredData, _ = d.length, b = this._itemHeight;
    if (!b || !_) return;
    const T = this._scrollContainer;
    let g, S;
    if (T) {
      const X = this.tbody.getBoundingClientRect(), W = T.getBoundingClientRect(), G = T === this.tbody ? 0 : X.top - W.top + T.scrollTop;
      g = T.scrollTop - G, S = T.clientHeight;
    } else {
      const W = this.tbody.getBoundingClientRect().top + window.scrollY;
      g = window.scrollY - W, S = window.innerHeight;
    }
    const C = this._readGridLayout(), q = C.columns, D = C.rowGap, I = b + D, R = Math.ceil(_ / q);
    let O = Math.max(0, Math.floor(g / I) - 15);
    O = Math.min(O, R);
    const P = Math.ceil(S / I) + 30, B = Math.min(O + P, R), H = Math.min(O * q, _), z = Math.min(B * q, _);
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
        const ut = this._buildItem(d[G]);
        ut && X.appendChild(ut);
      }
      if (Y > 0) {
        const G = document.createElement(this.isUl ? "li" : "div");
        G.className = "ln-list__spacer", G.setAttribute("aria-hidden", "true"), G.style.height = Y + "px", X.appendChild(G);
      }
      const W = A(this);
      this.tbody.replaceChildren(X), m(W), this._selectable && this._updateSelectAll();
    } else {
      let X = "";
      Q > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Q}px"></${this.isUl ? "li" : "div"}>`);
      for (let G = H; G < z; G++)
        X += d[G].html;
      Y > 0 && (X += `<${this.isUl ? "li" : "div"} class="ln-list__spacer" aria-hidden="true" style="height:${Y}px"></${this.isUl ? "li" : "div"}>`);
      const W = A(this);
      this.tbody.innerHTML = X, m(W), this._selectable && this._restoreSelection();
    }
  }, p.prototype._buildPlaceholderItem = function() {
    const d = document.createElement(this.isUl ? "li" : "div");
    return d.className = "ln-list__placeholder", d.setAttribute("aria-hidden", "true"), d.style.height = this._itemHeight + "px", d;
  }, p.prototype._renderWindowed = function() {
    if (this.isLoaded && this._cache.logicalTotal === 0) {
      this._disableVirtualScroll(), this._showEmptyState();
      return;
    }
    this._virtual || this._enableVirtualScroll();
    const d = this._itemHeight;
    if (!d) return;
    const _ = this._scrollContainer;
    let b, T;
    if (_) {
      const W = this.tbody.getBoundingClientRect(), G = _.getBoundingClientRect(), ut = _ === this.tbody ? 0 : W.top - G.top + _.scrollTop;
      b = _.scrollTop - ut, T = _.clientHeight;
    } else {
      const G = this.tbody.getBoundingClientRect().top + window.scrollY;
      b = window.scrollY - G, T = window.innerHeight;
    }
    const g = this._readGridLayout(), S = g.columns, C = g.rowGap, q = d + C, D = this._cache.logicalTotal, I = Math.ceil(D / S);
    let R = Math.max(0, Math.floor(b / q) - 15);
    R = Math.min(R, I);
    const O = Math.ceil(T / q) + 30, P = Math.min(R + O, I), B = Math.min(R * S, D), H = Math.min(P * S, D), z = R * q, Q = (I - P) * q, Y = document.createDocumentFragment();
    if (z > 0) {
      const W = document.createElement(this.isUl ? "li" : "div");
      W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = z + "px", Y.appendChild(W);
    }
    for (let W = B; W < H; W++)
      if (this._cache.has(W)) {
        const G = this._buildItem(this._cache.get(W));
        G && Y.appendChild(G);
      } else
        Y.appendChild(this._buildPlaceholderItem());
    if (Q > 0) {
      const W = document.createElement(this.isUl ? "li" : "div");
      W.className = "ln-list__spacer", W.setAttribute("aria-hidden", "true"), W.style.height = Q + "px", Y.appendChild(W);
    }
    const X = A(this);
    this.tbody.replaceChildren(Y), m(X), this._vStart = B, this._vEnd = H, this._cache.ensure(B, H);
  }, p.prototype._showEmptyState = function() {
    let d = null;
    if (this.isDataDriven) {
      const _ = this._lastTotal != null ? this._lastTotal : this._data.length, T = this.visibleCount === 0 && _ > 0, g = T ? this.name + "-empty-filtered" : this.name + "-empty";
      if (d = Ct(this.dom, g, "ln-list"), !d) {
        const S = this.dom.querySelector("template[data-ln-empty], template[data-ln-list-empty]");
        if (S) {
          const C = T ? "search" : "initial", q = S.content.querySelector(`[data-ln-empty-when="${C}"]`) || S.content.firstElementChild;
          q && (d = document.importNode(q, !0));
        }
      }
    } else {
      const _ = this.dom.querySelector(`template[${i}]`);
      if (_) {
        const b = _.content.firstElementChild;
        b && (d = document.importNode(b, !0));
      }
    }
    if (d)
      if (d.tagName === "LI" || d.tagName === "TR")
        this.tbody.replaceChildren(d);
      else {
        const _ = document.createElement(this.isUl ? "li" : "div");
        _.appendChild(d), this.tbody.replaceChildren(_);
      }
    else
      this.tbody.replaceChildren();
    L(this.dom, "ln-list:empty", {
      term: this.isDataDriven ? this.currentSearch || "" : this._searchTerm,
      total: this.isDataDriven ? this._lastTotal != null ? this._lastTotal : this._data.length : this._data.length
    });
  }, p.prototype._buildItem = function(d) {
    let _ = Ct(this.dom, this.name + "-row", "ln-list");
    if (!_) {
      const T = this.dom.querySelector("template[data-ln-item]");
      T && (_ = document.importNode(T.content, !0));
    }
    let b = _ ? _.querySelector("[data-ln-item]") || _.firstElementChild : null;
    if (b)
      Gt(b, d), ht(b, d);
    else if (d && d.html) {
      const T = document.createElement(this.isUl ? "ul" : "div");
      T.innerHTML = d.html, b = T.firstElementChild;
    } else if (b = document.createElement(this.isUl ? "li" : "div"), b.setAttribute("data-ln-item", ""), d && typeof d == "object") {
      for (const T in d)
        if (T !== "html" && d[T] != null) {
          const g = document.createElement("span");
          g.setAttribute("data-ln-field", T), g.textContent = String(d[T]), b.appendChild(g);
        }
    }
    if (b._lnRecord = d, d && d.id != null && (b.setAttribute("data-ln-item-id", d.id), this._selectable && this.selectedIds.has(String(d.id)))) {
      b.classList.add("ln-item-selected");
      const T = b.querySelector("[data-ln-item-select]");
      T && (T.checked = !0);
    }
    return b;
  }, p.prototype._restoreSelection = function() {
    if (!this.tbody) return;
    const d = this.tbody.querySelectorAll("[data-ln-item]");
    for (let _ = 0; _ < d.length; _++) {
      const b = d[_].getAttribute("data-ln-item-id"), T = b != null && this.selectedIds.has(String(b));
      d[_].classList.toggle("ln-item-selected", T);
      const g = d[_].querySelector("[data-ln-item-select]");
      g && (g.checked = T);
    }
    this._updateSelectAll();
  }, p.prototype._enableSelection = function() {
    if (this._selectableActive) return;
    this._selectableActive = !0;
    const d = this;
    this._onSelectionChange = function(_) {
      const b = _.target.closest("[data-ln-item-select]");
      if (!b) return;
      const T = b.closest("[data-ln-item]");
      if (!T) return;
      const g = T.getAttribute("data-ln-item-id");
      g != null && (b.checked ? (d.selectedIds.add(String(g)), T.classList.add("ln-item-selected")) : (d.selectedIds.delete(String(g)), T.classList.remove("ln-item-selected")), d._updateSelectAll(), d._updateFooter(), L(d.dom, "ln-list:select", {
        list: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedIds.size
      }));
    }, this.tbody.addEventListener("change", this._onSelectionChange), this._selectAllCheckbox = this.dom.querySelector("[data-ln-list-select-all]"), this._selectAllCheckbox && (this._onSelectAll = function() {
      const _ = d._selectAllCheckbox.checked, b = d.tbody.querySelectorAll("[data-ln-item]");
      for (let T = 0; T < b.length; T++) {
        const g = b[T], S = g.getAttribute("data-ln-item-id"), C = g.querySelector("[data-ln-item-select]");
        S != null && (_ ? (d.selectedIds.add(String(S)), g.classList.add("ln-item-selected")) : (d.selectedIds.delete(String(S)), g.classList.remove("ln-item-selected")), C && (C.checked = _));
      }
      L(d.dom, "ln-list:select-all", { list: d.name, selected: _ }), L(d.dom, "ln-list:select", {
        list: d.name,
        selectedIds: d.selectedIds,
        count: d.selectedIds.size
      }), d._updateFooter();
    }, this._selectAllCheckbox.addEventListener("change", this._onSelectAll));
  }, p.prototype._updateSelectAll = function() {
    if (!this._selectAllCheckbox) return;
    const d = this.tbody.querySelectorAll("[data-ln-item]");
    let _ = d.length > 0;
    for (let b = 0; b < d.length; b++) {
      const T = d[b].getAttribute("data-ln-item-id");
      if (T != null && !this.selectedIds.has(String(T))) {
        _ = !1;
        break;
      }
    }
    this._selectAllCheckbox.checked = _;
  }, p.prototype._requestData = function() {
    if (this._windowed) {
      this.dom.classList.add("ln-list--loading"), this._cache.invalidate({
        sort: this.currentSort,
        filters: this.currentFilters,
        search: this.currentSearch
      });
      return;
    }
    hn(this, "ln-list:request-data", "list");
  }, p.prototype._enterWindowedMode = function() {
    const d = this, _ = this.dom, b = parseInt(_.getAttribute("data-ln-list-window"), 10), T = parseInt(_.getAttribute("data-ln-list-window-page"), 10), g = parseInt(_.getAttribute("data-ln-list-window-threshold"), 10);
    this._onCacheChange = function() {
      !d._windowed || !d._cache || (d.totalCount = d._cache.grandTotal, d.visibleCount = d._cache.logicalTotal, d._lastTotal = d._cache.grandTotal, d.isLoaded = !0, d._vStart = -1, d._vEnd = -1, d._render(), d._updateFooter(), L(_, "ln-list:rendered", {
        list: d.name,
        total: d.totalCount,
        visible: d.visibleCount
      }));
    }, this._renderBatch = oe(this._onCacheChange), this._cache = qn({
      windowSize: b > 0 ? b : 1e3,
      pageSize: T > 0 ? T : 200,
      threshold: g >= 0 ? g : 25,
      fetchDebounce: 120,
      requestPage: function(S, C, q) {
        L(_, "ln-list:request-data", {
          list: d.name,
          sort: S.sort,
          filters: S.filters,
          search: S.search,
          offset: C,
          limit: q,
          queryGen: d._cache.queryGen
        });
      },
      onChange: this._renderBatch
    }), this._windowed = !0, this._selectable && this._selectAllCheckbox && this._selectAllCheckbox.classList.add("hidden");
  }, p.prototype._kickWindowInitial = function() {
    if (this._data.length > 0) {
      const d = parseInt(this.dom.getAttribute("data-ln-list-count"), 10), _ = d > 0 ? d : this._data.length;
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
  }, p.prototype._exitWindowedMode = function() {
    this._disableVirtualScroll(), this._cache && this._cache.destroy(), this._cache = null, this._windowed = !1, this._renderBatch = null, this._onCacheChange = null, this._selectAllCheckbox && this._selectAllCheckbox.classList.remove("hidden"), this._itemHeight = 0, this._vStart = -1, this._vEnd = -1, this._data = [], this._filteredData = [], this.dom.classList.add("ln-list--loading"), this._requestData();
  }, p.prototype._updateFooter = function() {
    let d = 0, _ = 0;
    this.isDataDriven ? (d = this._lastTotal != null ? this._lastTotal : this._data.length, _ = this.visibleCount) : (d = this._data.length, _ = this._filteredData.length);
    const b = _ < d;
    if (this._totalSpan && (this._totalSpan.textContent = y(d, this.dom)), this._filteredSpan && (this._filteredSpan.textContent = b ? y(_, this.dom) : ""), this._filteredWrap && this._filteredWrap.classList.toggle("hidden", !b), this._selectedSpan) {
      const T = this.selectedIds ? this.selectedIds.size : 0;
      this._selectedSpan.textContent = T > 0 ? y(T, this.dom) : "", this._selectedWrap && this._selectedWrap.classList.toggle("hidden", T === 0);
    }
  }, p.prototype.destroy = function() {
    this.dom[e] && (this._disableVirtualScroll(), this.dom.removeEventListener("ln-list:set-search", this._onSetSearch), this.dom.removeEventListener("ln-search:change", this._onSearchChange), this.dom.removeEventListener("ln-list:request-clear-filters", this._onRequestClearFilters), this.isDataDriven ? (this._cache && this._cache.destroy(), this.dom.removeEventListener("ln-list:set-data", this._onSetData), this.dom.removeEventListener("ln-list:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-list:page-failed", this._onPageFailed), this.dom.removeEventListener("ln-list:request-revalidate", this._onRequestRevalidate), this.dom.removeEventListener("ln-list:request-invalidate", this._onRequestInvalidate), this.dom.removeEventListener("ln-sort:change", this._onSort), this.tbody && (this.tbody.removeEventListener("click", this._onItemClick), this.tbody.removeEventListener("click", this._onItemAction))) : (this._emptyObserver && (this._emptyObserver.disconnect(), this._emptyObserver = null), this._onFilterChange && this.dom.removeEventListener("ln-filter:change", this._onFilterChange), this._onSort && this.dom.removeEventListener("ln-sort:change", this._onSort)), this._onSelectionChange && this.tbody && this.tbody.removeEventListener("change", this._onSelectionChange), this._selectAllCheckbox && this._onSelectAll && this._selectAllCheckbox.removeEventListener("change", this._onSelectAll), this._data = [], this._filteredData = [], delete this.dom[e]);
  }, j(t, e, p, "ln-list", {
    attributes: u
  });
})();
(function() {
  const t = "data-ln-circular-progress", e = "lnCircularProgress";
  if (window[e] !== void 0) return;
  function i(u) {
    const w = u[e];
    w && c.call(w);
  }
  const l = {
    "data-ln-circular-progress": { type: "float", fallback: 0, min: 0, effect: i, description: "Current circular progress value" },
    "data-ln-circular-progress-max": { type: "float", fallback: 100, min: 0, effect: i, description: "Maximum circular progress scale value" },
    "data-ln-circular-progress-label": { type: "string", effect: i, description: "Text label format or template inside circular progress" }
  }, f = "http://www.w3.org/2000/svg", h = 36, r = 16, s = 2 * Math.PI * r;
  function a(u) {
    return this.dom = u, this.svg = null, this.trackCircle = null, this.progressCircle = null, this.labelEl = null, o.call(this), c.call(this), this;
  }
  a.prototype.destroy = function() {
    this.dom[e] && (this.svg && this.svg.remove(), this.labelEl && this.labelEl.remove(), delete this.dom[e]);
  };
  function n(u, w) {
    const y = document.createElementNS(f, u);
    for (const [E, A] of Object.entries(w))
      y.setAttribute(E, A);
    return y;
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
      "stroke-dasharray": s,
      "stroke-dashoffset": s,
      transform: "rotate(-90 " + h / 2 + " " + h / 2 + ")"
    }), this.progressCircle.classList.add("ln-circular-progress__fill"), this.svg.appendChild(this.trackCircle), this.svg.appendChild(this.progressCircle), this.labelEl = document.createElement("strong"), this.labelEl.classList.add("ln-circular-progress__label"), this.dom.appendChild(this.svg), this.dom.appendChild(this.labelEl);
  }
  function c() {
    const u = this.dom.getAttribute("data-ln-circular-progress"), w = this.dom.getAttribute("data-ln-circular-progress-max"), y = On(u, w || 100), E = s - y.percentage / 100 * s;
    this.progressCircle.setAttribute("stroke-dashoffset", E);
    const A = this.dom.getAttribute("data-ln-circular-progress-label"), m = A !== null ? A : Math.round(y.percentage) + "%";
    this.labelEl.textContent = m, this.dom.setAttribute("role", "progressbar"), this.dom.setAttribute("aria-valuemin", String(y.min)), this.dom.setAttribute("aria-valuemax", String(y.max)), this.dom.setAttribute("aria-valuenow", String(y.clampedValue)), this.dom.setAttribute("aria-valuetext", m), L(this.dom, "ln-circular-progress:change", {
      target: this.dom,
      value: y.value,
      max: y.max,
      percentage: y.percentage
    });
  }
  j(t, e, a, "ln-circular-progress", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-sortable", e = "lnSortable", i = "data-ln-sortable-handle";
  if (window[e] !== void 0) return;
  const l = {
    "data-ln-sortable": { effect: h, type: "enum", values: ["enabled", "disabled"], fallback: "enabled", description: "Enables drag-and-drop item reordering or disables when set to disabled" },
    "data-ln-sortable-handle": { type: "marker", description: "Designates an element as the drag handle for its parent sortable item" }
  };
  function f(r) {
    this.dom = r, this.isEnabled = r.getAttribute(t) !== "disabled", this._dragging = null, r.setAttribute("aria-roledescription", "sortable list");
    const s = this;
    return this._onPointerDown = function(a) {
      s.isEnabled && s._handlePointerDown(a);
    }, r.addEventListener("pointerdown", this._onPointerDown), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("pointerdown", this._onPointerDown), delete this.dom[e]);
  }, f.prototype._handlePointerDown = function(r) {
    let s = r.target.closest("[" + i + "]"), a;
    if (s) {
      for (a = s; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
    } else {
      if (this.dom.querySelector("[" + i + "]")) return;
      for (a = r.target; a && a.parentElement !== this.dom; )
        a = a.parentElement;
      if (!a || a.parentElement !== this.dom) return;
      s = a;
    }
    const o = Array.from(this.dom.children).indexOf(a);
    if (Z(this.dom, "ln-sortable:before-drag", {
      item: a,
      index: o
    }).defaultPrevented) return;
    r.preventDefault(), s.setPointerCapture(r.pointerId), this._dragging = a, a.classList.add("ln-sortable--dragging"), a.setAttribute("aria-grabbed", "true"), this.dom.classList.add("ln-sortable--active"), L(this.dom, "ln-sortable:drag-start", {
      item: a,
      index: o
    });
    const u = this, w = function(E) {
      u._handlePointerMove(E);
    }, y = function(E) {
      u._handlePointerEnd(E), s.removeEventListener("pointermove", w), s.removeEventListener("pointerup", y), s.removeEventListener("pointercancel", y);
    };
    s.addEventListener("pointermove", w), s.addEventListener("pointerup", y), s.addEventListener("pointercancel", y);
  }, f.prototype._handlePointerMove = function(r) {
    if (!this._dragging) return;
    const s = Array.from(this.dom.children), a = this._dragging;
    for (const n of s)
      n.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    for (const n of s) {
      if (n === a) continue;
      const o = n.getBoundingClientRect(), c = o.top + o.height / 2;
      if (r.clientY >= o.top && r.clientY < c) {
        n.classList.add("ln-sortable--drop-before");
        break;
      } else if (r.clientY >= c && r.clientY <= o.bottom) {
        n.classList.add("ln-sortable--drop-after");
        break;
      }
    }
  }, f.prototype._handlePointerEnd = function(r) {
    if (!this._dragging) return;
    const s = this._dragging, a = Array.from(this.dom.children), n = a.indexOf(s);
    let o = null, c = null;
    for (const u of a) {
      if (u.classList.contains("ln-sortable--drop-before")) {
        o = u, c = "before";
        break;
      }
      if (u.classList.contains("ln-sortable--drop-after")) {
        o = u, c = "after";
        break;
      }
    }
    for (const u of a)
      u.classList.remove("ln-sortable--drop-before", "ln-sortable--drop-after");
    if (s.classList.remove("ln-sortable--dragging"), s.removeAttribute("aria-grabbed"), this.dom.classList.remove("ln-sortable--active"), o && o !== s) {
      c === "before" ? this.dom.insertBefore(s, o) : this.dom.insertBefore(s, o.nextElementSibling);
      const w = Array.from(this.dom.children).indexOf(s);
      L(this.dom, "ln-sortable:reordered", {
        item: s,
        oldIndex: n,
        newIndex: w
      });
    }
    this._dragging = null;
  };
  function h(r) {
    const s = r[e];
    if (!s) return;
    const a = r.getAttribute(t) !== "disabled";
    a !== s.isEnabled && (s.isEnabled = a, L(r, a ? "ln-sortable:enabled" : "ln-sortable:disabled", { target: r }));
  }
  j(t, e, f, "ln-sortable", {
    attributes: l
  });
})();
(function() {
  const t = "data-ln-picklist", e = "lnPicklist", i = "data-ln-picklist-list", l = "data-ln-picklist-max";
  if (window[e] !== void 0) return;
  const f = {
    "data-ln-picklist": { type: "enum", values: ["enabled", "disabled"], fallback: "enabled", effect: s, description: "Controls enabled/disabled state of the dual-list picklist" },
    "data-ln-picklist-max": { type: "integer", fallback: 1 / 0, min: 1, effect: a, description: "Maximum selectable items in the selected list" },
    "data-ln-picklist-list": { type: "enum", values: ["available", "selected"], description: "Role marker for available or selected picklist columns" }
  };
  function h(n) {
    if (this.dom = n, this.isEnabled = n.getAttribute(t) !== "disabled", this.max = r(n), this.available = n.querySelector("[" + i + '="available"]'), this.selected = n.querySelector("[" + i + '="selected"]'), !this.available || !this.selected)
      return console.warn("[ln-picklist] requires both [" + i + '="available"] and [' + i + '="selected"]', n), this;
    this._onChange = this._onChange.bind(this), n.addEventListener("change", this._onChange), this._initial = [];
    for (const o of [this.available, this.selected])
      for (const c of o.children)
        this._initial.push(c);
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
    for (let c = 0; c < n.length; c++)
      this._initial.includes(n[c]) || this._initial.push(n[c]);
    let o = 0;
    for (let c = 0; c < this._initial.length; c++) {
      const u = this._initial[c];
      if (!u.isConnected) continue;
      const w = u.querySelector('input[type="checkbox"]');
      if (!w) continue;
      let y;
      w.checked ? this.max === null || o < this.max ? (y = this.selected, o++) : (w.checked = !1, y = this.available) : y = this.available, y.appendChild(u);
    }
  }, h.prototype._onFormReset = function(n) {
    const o = this;
    setTimeout(function() {
      o._destroyed || n.defaultPrevented || o.sync();
    }, 0);
  }, h.prototype._onChange = function(n) {
    const o = n.target.closest('input[type="checkbox"]');
    if (!o) return;
    const c = o.closest("li");
    if (!c) return;
    const u = c.parentElement;
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
        item: c,
        checkbox: o,
        count: this.selected.children.length
      });
      return;
    }
    const y = { item: c, from: u, to: w, checkbox: o };
    if (Z(this.dom, "ln-picklist:before-move", y).defaultPrevented) {
      o.checked = !o.checked;
      return;
    }
    const E = document.activeElement === o;
    w.appendChild(c), E && o.focus(), L(this.dom, "ln-picklist:move", y);
  };
  function r(n) {
    const o = n.getAttribute(l);
    if (o === null || o === "") return null;
    const c = parseInt(o, 10);
    return isNaN(c) || c < 0 ? null : c;
  }
  function s(n) {
    const o = n[e];
    if (!o) return;
    const c = n.getAttribute(t) !== "disabled";
    c !== o.isEnabled && (o.isEnabled = c, L(n, c ? "ln-picklist:enabled" : "ln-picklist:disabled", { target: n }));
  }
  function a(n) {
    const o = n[e];
    o && (o.max = r(n));
  }
  j(t, e, h, "ln-picklist", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-confirm", e = "lnConfirm", i = "data-ln-confirm-state", l = "data-ln-confirm-announcer";
  if (window[e] !== void 0) return;
  function h(c, u, w) {
    return c.getAttribute(u) || w;
  }
  function r(c, u, w) {
    const y = parseFloat(c.getAttribute(u));
    return isNaN(y) || y <= 0 ? w : y;
  }
  function s(c) {
    const u = document.createElement("span");
    return u.setAttribute(l, ""), u.setAttribute("role", "alert"), u.textContent = c, u;
  }
  const a = {
    "data-ln-confirm": { prop: "confirmText", type: "string", read: h, fallback: "Confirm?", description: "Prompt text or confirmation action trigger" },
    "data-ln-confirm-timeout": { prop: "timeout", type: "float", read: r, fallback: 3, min: 0.1, description: "Confirmation timeout in seconds before reverting" },
    "data-ln-confirm-state": { prop: "confirming", type: "enum", values: ["confirming"], read: (c, u) => c.getAttribute(u) === "confirming", description: 'Active confirmation state marker on button ("confirming")' }
  }, n = et(a);
  function o(c) {
    this.dom = c, tt(this, c, n), this.revertTimer = null, this._submitted = !1, this.idleEl = c.querySelector("[data-ln-confirm-idle]"), this.activeEl = c.querySelector("[data-ln-confirm-active]"), this.isTwoElementMode = !!(this.idleEl || this.activeEl), this.originalText = this.isTwoElementMode ? "" : c.textContent.trim();
    const u = this;
    return this._onClick = function(w) {
      if (!Le(w))
        if (!u.confirming)
          w.preventDefault(), w.stopImmediatePropagation(), u._enterConfirm();
        else {
          if (u._submitted) return;
          u._submitted = !0, u._reset();
        }
    }, c.addEventListener("click", this._onClick), this;
  }
  o.prototype._enterConfirm = function() {
    if (this.dom.setAttribute(i, "confirming"), this.originalAriaLabel = this.dom.getAttribute("aria-label"), this.originalAriaLive = this.dom.getAttribute("aria-live"), this.isTwoElementMode) {
      this.idleEl && this.idleEl.setAttribute("hidden", "true"), this.activeEl && this.activeEl.removeAttribute("hidden");
      const c = this.activeEl ? this.activeEl.textContent.trim() : "";
      c && (this.dom.setAttribute("aria-label", c), this.dom.setAttribute("aria-live", "polite"));
    } else {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalText === "" ? (this.isIconButton = !0, this.originalIconHref = c.getAttribute("href"), c.setAttribute("href", "#ln-icon-check"), this.dom.setAttribute("aria-label", this.confirmText), this.dom.appendChild(s(this.confirmText))) : this.dom.textContent = this.confirmText;
    }
    this._startTimer(), L(this.dom, "ln-confirm:waiting", { target: this.dom });
  }, o.prototype._startTimer = function() {
    this.revertTimer && clearTimeout(this.revertTimer);
    const c = this, u = this.timeout * 1e3;
    this.revertTimer = setTimeout(function() {
      c._reset();
    }, u);
  }, o.prototype._reset = function() {
    if (this._submitted = !1, this.dom.removeAttribute(i), this.isTwoElementMode)
      this.idleEl && this.idleEl.removeAttribute("hidden"), this.activeEl && this.activeEl.setAttribute("hidden", "true");
    else if (this.isIconButton) {
      const c = this.dom.querySelector("svg.ln-icon use");
      c && this.originalIconHref && c.setAttribute("href", this.originalIconHref);
      const u = this.dom.querySelector("[" + l + "]");
      u && u.remove(), this.isIconButton = !1, this.originalIconHref = null;
    } else
      this.dom.textContent = this.originalText;
    this.originalAriaLabel !== null && this.originalAriaLabel !== void 0 ? this.dom.setAttribute("aria-label", this.originalAriaLabel) : this.dom.removeAttribute("aria-label"), this.originalAriaLabel = null, this.originalAriaLive !== null && this.originalAriaLive !== void 0 ? this.dom.setAttribute("aria-live", this.originalAriaLive) : this.dom.removeAttribute("aria-live"), this.originalAriaLive = null, this.revertTimer && (clearTimeout(this.revertTimer), this.revertTimer = null);
  }, o.prototype.destroy = function() {
    this.dom[e] && (this.confirming && this._reset(), this.dom.removeEventListener("click", this._onClick), delete this.dom[e]);
  }, j(t, e, o, "ln-confirm", {
    attributes: a
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
  }, l = et(i), f = {
    en: "English",
    sq: "Shqip",
    sr: "Srpski"
  };
  function h(r) {
    if (this.dom = r, tt(this, r, l), this.activeLanguages = /* @__PURE__ */ new Set(), this.badgesEl = r.querySelector("[data-ln-translations-active]"), this.menuEl = r.querySelector("[data-ln-dropdown] > [data-ln-toggle]"), this.locales = f, this._localesRaw)
      try {
        this.locales = JSON.parse(this._localesRaw);
      } catch {
        console.warn("[ln-translations] Invalid JSON in data-ln-translations-locales");
      }
    this._applyDefaultLang(), this._updateDropdown();
    const s = this;
    return this._onRequestAdd = function(a) {
      a.detail && a.detail.lang && s.addLanguage(a.detail.lang);
    }, this._onRequestRemove = function(a) {
      a.detail && a.detail.lang && s.removeLanguage(a.detail.lang);
    }, r.addEventListener("ln-translations:request-add", this._onRequestAdd), r.addEventListener("ln-translations:request-remove", this._onRequestRemove), this._detectExisting(), this;
  }
  h.prototype._applyDefaultLang = function() {
    if (!this.defaultLang) return;
    const r = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const s of r) {
      const a = s.querySelectorAll("input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])");
      for (const n of a)
        n.setAttribute("data-ln-translatable-lang", this.defaultLang);
    }
  }, h.prototype._detectExisting = function() {
    const r = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const s of r) {
      const a = s.getAttribute("data-ln-translatable-lang");
      a && a !== this.defaultLang && this.activeLanguages.add(a);
    }
    this.activeLanguages.size > 0 && (this._updateBadges(), this._updateDropdown());
  }, h.prototype._updateDropdown = function() {
    if (!this.menuEl) return;
    this.menuEl.textContent = "";
    const r = this;
    let s = 0;
    for (const n in this.locales) {
      if (!this.locales.hasOwnProperty(n) || this.activeLanguages.has(n)) continue;
      s++;
      const o = te("ln-translations-menu-item", "ln-translations");
      if (!o) return;
      const c = o.querySelector("[data-ln-translations-lang]");
      c.setAttribute("data-ln-translations-lang", n), c.textContent = this.locales[n], c.addEventListener("click", function(u) {
        u.ctrlKey || u.metaKey || u.button === 1 || (u.preventDefault(), u.stopPropagation(), r.menuEl.getAttribute("data-ln-toggle") === "open" && r.menuEl.setAttribute("data-ln-toggle", "close"), r.addLanguage(n));
      }), this.menuEl.appendChild(o);
    }
    const a = this.dom.querySelector("[data-ln-translations-add]");
    a && (a.hidden = s === 0);
  }, h.prototype._updateBadges = function() {
    if (!this.badgesEl) return;
    this.badgesEl.textContent = "";
    const r = this;
    this.activeLanguages.forEach(function(s) {
      const a = te("ln-translations-badge", "ln-translations");
      if (!a) return;
      const n = a.querySelector("[data-ln-translations-lang]");
      n.setAttribute("data-ln-translations-lang", s);
      const o = n.querySelector("span");
      o.textContent = r.locales[s] || s.toUpperCase();
      const c = n.querySelector("button"), u = r.locales[s] || s.toUpperCase();
      c.setAttribute("aria-label", r.removeLabel.replace("{lang}", u)), c.addEventListener("click", function(w) {
        w.ctrlKey || w.metaKey || w.button === 1 || (w.preventDefault(), w.stopPropagation(), r.removeLanguage(s));
      }), r.badgesEl.appendChild(a);
    });
  }, h.prototype.addLanguage = function(r, s) {
    if (this.activeLanguages.has(r)) return;
    const a = this.locales[r] || r;
    if (Z(this.dom, "ln-translations:before-add", {
      target: this.dom,
      lang: r,
      langName: a
    }).defaultPrevented) return;
    this.activeLanguages.add(r), s = s || {};
    const o = this.dom.querySelectorAll("[data-ln-translatable]");
    for (const c of o) {
      const u = c.getAttribute("data-ln-translatable"), w = c.getAttribute("data-ln-translations-prefix") || "", y = c.querySelector(
        this.defaultLang ? '[data-ln-translatable-lang="' + this.defaultLang + '"]' : "input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])"
      );
      if (!y) continue;
      const E = y.cloneNode(y.tagName === "SELECT");
      w ? E.name = w + "[trans][" + r + "][" + u + "]" : E.name = "trans[" + r + "][" + u + "]", E.value = s[u] !== void 0 ? s[u] : "", E.removeAttribute("id"), "placeholder" in E && (E.placeholder = this.placeholderLabel.replace("{lang}", a)), E.setAttribute("data-ln-translatable-lang", r);
      const A = c.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])'), m = A.length > 0 ? A[A.length - 1] : y;
      m.parentNode.insertBefore(E, m.nextSibling);
    }
    this._updateDropdown(), this._updateBadges(), L(this.dom, "ln-translations:added", {
      target: this.dom,
      lang: r,
      langName: a
    });
  }, h.prototype.removeLanguage = function(r) {
    if (!this.activeLanguages.has(r) || Z(this.dom, "ln-translations:before-remove", {
      target: this.dom,
      lang: r
    }).defaultPrevented) return;
    const a = this.dom.querySelectorAll('[data-ln-translatable-lang="' + r + '"]');
    for (const n of a)
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
    const r = this.defaultLang, s = this.dom.querySelectorAll("[data-ln-translatable-lang]");
    for (const a of s)
      a.getAttribute("data-ln-translatable-lang") !== r && a.parentNode.removeChild(a);
    this.dom.removeEventListener("ln-translations:request-add", this._onRequestAdd), this.dom.removeEventListener("ln-translations:request-remove", this._onRequestRemove), delete this.dom[e];
  }, j(t, e, h, "ln-translations", {
    attributes: i
  });
})();
const Ir = "ln-autosave:", Dr = 1e3;
function Rr(t, e) {
  return e ? Ir + (t || "") + ":" + e : null;
}
function Or(t, e = Dr) {
  if (t == null) return 0;
  if (t === "") return e;
  const i = parseInt(String(t), 10);
  return isNaN(i) || i < 0 ? e : i;
}
(function() {
  const t = "data-ln-autosave", e = "lnAutosave", i = "data-ln-autosave-clear", l = "data-ln-autosave-debounce-input", f = '[data-ln-autosave-exclude], input[type="password"]';
  if (window[e] !== void 0) return;
  const h = {
    "data-ln-autosave": { type: "string", description: "Form autosave storage key identifier" },
    "data-ln-autosave-debounce-input": { type: "integer", fallback: 500, min: 0, description: "Debounce delay in milliseconds before saving on input events" },
    "data-ln-autosave-clear": { type: "marker", description: "Designates a button that clears saved form data from localStorage" },
    "data-ln-autosave-exclude": { type: "marker", description: "Excludes form control from autosave serialization" }
  };
  function r(a) {
    const n = a.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
  }
  function s(a) {
    const o = a.getAttribute(t) || a.id, c = Rr(window.location.pathname, o);
    if (!c) {
      console.warn("ln-autosave: form needs an id or data-ln-autosave value", a);
      return;
    }
    this.dom = a, this.key = c;
    let u = null;
    function w() {
      const m = mn(a, { exclude: f });
      try {
        localStorage.setItem(c, JSON.stringify(m));
      } catch {
        return;
      }
      L(a, "ln-autosave:saved", { target: a, data: m });
    }
    function y() {
      let m;
      try {
        m = localStorage.getItem(c);
      } catch {
        return;
      }
      if (!m) return;
      let v;
      try {
        v = JSON.parse(m);
      } catch {
        return;
      }
      if (Z(a, "ln-autosave:before-restore", { target: a, data: v }).defaultPrevented) return;
      const d = gn(a, v);
      for (let _ = 0; _ < d.length; _++)
        d[_].dispatchEvent(new Event("input", { bubbles: !0 })), d[_].dispatchEvent(new Event("change", { bubbles: !0 }));
      L(a, "ln-autosave:restored", { target: a, data: v });
    }
    function E() {
      try {
        localStorage.removeItem(c);
      } catch {
        return;
      }
      L(a, "ln-autosave:cleared", { target: a });
    }
    this._onFocusout = function(m) {
      const v = m.target;
      r(v) && v.name && !v.matches(f) && w();
    }, this._onChange = function(m) {
      const v = m.target;
      r(v) && v.name && !v.matches(f) && w();
    }, this._onSubmit = function() {
      E();
    }, this._onReset = function() {
      E();
    }, this._onClearClick = function(m) {
      m.target.closest("[" + i + "]") && E();
    }, a.addEventListener("focusout", this._onFocusout), a.addEventListener("change", this._onChange), a.addEventListener("submit", this._onSubmit), a.addEventListener("reset", this._onReset), a.addEventListener("click", this._onClearClick);
    const A = Or(a.getAttribute(l));
    return A > 0 && (this._onInput = function(m) {
      const v = m.target;
      !r(v) || !v.name || v.matches(f) || (u !== null && clearTimeout(u), u = setTimeout(w, A));
    }, a.addEventListener("input", this._onInput)), this._getInputTimer = function() {
      return u;
    }, y(), this;
  }
  s.prototype.destroy = function() {
    if (this.dom[e]) {
      if (this.dom.removeEventListener("focusout", this._onFocusout), this.dom.removeEventListener("change", this._onChange), this.dom.removeEventListener("submit", this._onSubmit), this.dom.removeEventListener("reset", this._onReset), this.dom.removeEventListener("click", this._onClearClick), this._onInput) {
        this.dom.removeEventListener("input", this._onInput);
        const a = this._getInputTimer();
        a !== null && clearTimeout(a);
      }
      delete this.dom[e];
    }
  }, j(t, e, s, "ln-autosave", {
    attributes: h
  });
})();
(function() {
  const t = "data-ln-autoresize", e = "lnAutoresize";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-autoresize": { type: "marker", description: "Automatically adjusts textarea height to match its scrollable content" }
  };
  function l(f) {
    if (f.tagName !== "TEXTAREA")
      return console.warn("[ln-autoresize] Can only be applied to <textarea>, got:", f.tagName), this;
    this.dom = f;
    const h = this;
    return this._onInput = function() {
      h._resize();
    }, f.addEventListener("input", this._onInput), this._resize(), this;
  }
  l.prototype._resize = function() {
    this.dom.style.height = "auto", this.dom.style.height = this.dom.scrollHeight + "px";
  }, l.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("input", this._onInput), this.dom.style.height = "", delete this.dom[e]);
  }, j(t, e, l, "ln-autoresize", {
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
  }, f = {
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
  let s = 0;
  function a(m) {
    return !!(f[m] || h[m] || r[m] || m === "link");
  }
  function n(m) {
    this.dom = m;
    const v = this;
    if (this._textarea = m.querySelector("textarea"), !this._textarea)
      return console.warn("[ln-editor] No <textarea> found inside", m), this;
    const p = this._textarea.getAttribute("placeholder") || "";
    this._textarea.setAttribute("data-ln-editor-source", ""), this._surface = document.createElement("div"), this._surface.className = "ln-editor__surface", this._surface.setAttribute("contenteditable", "true"), this._surface.setAttribute("role", "textbox"), this._surface.setAttribute("aria-multiline", "true"), p && this._surface.setAttribute("data-placeholder", p);
    const d = this._textarea.id;
    if (d) {
      const g = m.querySelector('label[for="' + d + '"]');
      g && (g.id || (g.id = d + "-label"), this._surface.setAttribute("aria-labelledby", g.id));
    }
    this._surface.id = d ? d + "-surface" : "ln-editor-surface-" + ++s;
    const _ = this._textarea.value.trim();
    _ && (this._surface.innerHTML = _);
    const b = m.querySelector('[role="toolbar"]');
    if (b && b.nextSibling ? m.insertBefore(this._surface, b.nextSibling) : m.appendChild(this._surface), b) {
      b.setAttribute("aria-controls", this._surface.id);
      const g = b.querySelectorAll("[data-ln-editor-action]");
      for (let S = 0; S < g.length; S++) {
        const C = g[S].getAttribute("data-ln-editor-action");
        a(C) && g[S].setAttribute("aria-pressed", "false");
      }
    }
    this._onInput = function() {
      v._syncToTextarea(), L(v.dom, "ln-editor:changed", {
        html: v._textarea.value,
        target: v.dom
      });
    }, this._onMousedownToolbar = function(g) {
      g.target.closest("[data-ln-editor-action]") && g.preventDefault();
    }, this._onClickToolbar = function(g) {
      const S = g.target.closest("[data-ln-editor-action]");
      if (!S) return;
      const C = S.getAttribute("data-ln-editor-action");
      v._execAction(C);
    }, this._onPaste = function(g) {
      u(v, g);
    }, this._onKeydown = function(g) {
      E(v, g);
    }, this._onSelectionChange = function() {
      document.contains(v._surface) && v._updateActiveStates();
    }, this._onFocus = function() {
      L(v.dom, "ln-editor:focus", { target: v.dom });
    }, this._onBlur = function() {
      v._syncToTextarea(), L(v.dom, "ln-editor:blur", { target: v.dom });
    }, this._onTextareaInput = function() {
      v._surface.innerHTML !== v._textarea.value && (v._surface.innerHTML = v._textarea.value, L(v.dom, "ln-editor:changed", {
        html: v._textarea.value,
        target: v.dom
      }));
    }, this._surface.addEventListener("input", this._onInput), this._surface.addEventListener("paste", this._onPaste), this._surface.addEventListener("keydown", this._onKeydown), this._surface.addEventListener("focus", this._onFocus), this._surface.addEventListener("blur", this._onBlur), this._textarea.addEventListener("input", this._onTextareaInput), b && (b.addEventListener("mousedown", this._onMousedownToolbar), b.addEventListener("click", this._onClickToolbar)), document.addEventListener("selectionchange", this._onSelectionChange), this._onSetContent = function(g) {
      const S = g.detail && g.detail.html;
      S !== void 0 && (v._surface.innerHTML = S, v._syncToTextarea(), L(v.dom, "ln-editor:changed", {
        html: v._textarea.value,
        target: v.dom
      }));
    }, m.addEventListener("ln-editor:set-content", this._onSetContent);
    const T = this._textarea.form;
    return T && (this._onFormReset = function() {
      setTimeout(function() {
        v._surface.innerHTML = v._textarea.value, L(m, "ln-editor:changed", {
          html: v._textarea.value,
          target: m
        });
      }, 0);
    }, T.addEventListener("reset", this._onFormReset)), this;
  }
  n.prototype._syncToTextarea = function() {
    this._textarea && (this._textarea.value = this._surface.innerHTML);
  }, n.prototype._execAction = function(m) {
    if (!(!m || Z(this.dom, "ln-editor:before-change", {
      action: m,
      target: this.dom
    }).defaultPrevented)) {
      if (this._surface.focus(), f[m])
        document.execCommand(f[m], !1, null);
      else if (h[m]) {
        const p = h[m], d = o(this._surface);
        d && d.toLowerCase() === p ? document.execCommand("formatBlock", !1, "<p>") : document.execCommand("formatBlock", !1, "<" + p + ">");
      } else r[m] ? document.execCommand(r[m], !1, null) : m === "link" ? A(this) : m === "unlink" ? document.execCommand("unlink", !1, null) : m === "clear" && (document.execCommand("removeFormat", !1, null), document.execCommand("formatBlock", !1, "<p>"));
      this._syncToTextarea(), this._updateActiveStates();
    }
  }, n.prototype._updateActiveStates = function() {
    const m = this.dom.querySelector('[role="toolbar"]');
    if (!m) return;
    const v = window.getSelection();
    if (!v || v.rangeCount === 0) return;
    const p = v.anchorNode;
    if (!p || !this._surface.contains(p)) return;
    const d = m.querySelectorAll("[data-ln-editor-action]");
    for (let _ = 0; _ < d.length; _++) {
      const b = d[_], T = b.getAttribute("data-ln-editor-action");
      let g = !1;
      if (f[T])
        try {
          g = document.queryCommandState(f[T]);
        } catch {
        }
      else if (h[T]) {
        const S = o(this._surface);
        g = S && S.toLowerCase() === h[T];
      } else if (r[T])
        try {
          g = document.queryCommandState(r[T]);
        } catch {
        }
      else T === "link" && (g = !!c(v.anchorNode, "A", this._surface));
      a(T) && b.setAttribute("aria-pressed", String(g)), g ? b.classList.add("ln-editor-active") : b.classList.remove("ln-editor-active");
    }
  }, n.prototype.getHTML = function() {
    return this._surface ? this._surface.innerHTML : "";
  }, n.prototype.setHTML = function(m) {
    this._surface && (this._surface.innerHTML = m, this._syncToTextarea(), L(this.dom, "ln-editor:changed", {
      html: this._textarea.value,
      target: this.dom
    }));
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._surface && (this._surface.removeEventListener("input", this._onInput), this._surface.removeEventListener("paste", this._onPaste), this._surface.removeEventListener("keydown", this._onKeydown), this._surface.removeEventListener("focus", this._onFocus), this._surface.removeEventListener("blur", this._onBlur), this._surface.remove());
    const m = this.dom.querySelector('[role="toolbar"]');
    m && (m.removeEventListener("mousedown", this._onMousedownToolbar), m.removeEventListener("click", this._onClickToolbar)), document.removeEventListener("selectionchange", this._onSelectionChange), this.dom.removeEventListener("ln-editor:set-content", this._onSetContent);
    const v = this._textarea ? this._textarea.form : null;
    if (v && this._onFormReset && v.removeEventListener("reset", this._onFormReset), this._textarea && (this._onTextareaInput && this._textarea.removeEventListener("input", this._onTextareaInput), this._textarea.removeAttribute("data-ln-editor-source")), this._closeLinkPopover)
      this._closeLinkPopover();
    else {
      const p = this.dom.querySelector(".ln-editor__link-popover");
      p && p.remove();
    }
    delete this.dom[e];
  };
  function o(m) {
    const v = window.getSelection();
    if (!v || v.rangeCount === 0) return null;
    let p = v.anchorNode;
    if (!p) return null;
    for (; p && p !== m; ) {
      if (p.nodeType === 1) {
        const d = p.tagName;
        if (d === "H2" || d === "H3" || d === "H4" || d === "BLOCKQUOTE" || d === "PRE" || d === "P")
          return d;
      }
      p = p.parentNode;
    }
    return null;
  }
  function c(m, v, p) {
    for (; m && m !== p; ) {
      if (m.nodeType === 1 && m.tagName === v)
        return m;
      m = m.parentNode;
    }
    return null;
  }
  function u(m, v) {
    v.preventDefault();
    let p = "";
    if (v.clipboardData && (p = v.clipboardData.getData("text/html"), !p)) {
      const _ = v.clipboardData.getData("text/plain");
      _ && (p = _.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"), p = "<p>" + p + "</p>");
    }
    if (!p) return;
    const d = w(p);
    d && document.execCommand("insertHTML", !1, d);
  }
  function w(m) {
    const v = document.createElement("div");
    return v.innerHTML = m, y(v), v.innerHTML;
  }
  function y(m) {
    const v = Array.from(m.childNodes);
    for (let p = 0; p < v.length; p++) {
      const d = v[p];
      if (d.nodeType !== 3) {
        if (d.nodeType !== 1) {
          m.removeChild(d);
          continue;
        }
        if (l[d.tagName]) {
          const _ = Array.from(d.attributes);
          for (let b = 0; b < _.length; b++) {
            const T = _[b].name;
            if (d.tagName === "A" && T === "href") {
              const g = d.getAttribute("href") || "";
              /^(https?:|mailto:|\/|#)/.test(g) || d.removeAttribute("href");
            } else
              d.removeAttribute(T);
          }
          d.tagName === "A" && d.setAttribute("rel", "noopener noreferrer"), y(d);
        } else {
          for (; d.firstChild; )
            m.insertBefore(d.firstChild, d);
          m.removeChild(d);
        }
      }
    }
  }
  function E(m, v) {
    if (!(v.ctrlKey || v.metaKey)) return;
    let p = null;
    switch (v.key.toLowerCase()) {
      case "b":
        p = "bold";
        break;
      case "i":
        p = "italic";
        break;
      case "u":
        p = "underline";
        break;
      case "k":
        p = "link";
        break;
    }
    p && (v.preventDefault(), m._execAction(p));
  }
  function A(m) {
    const v = window.getSelection();
    if (!v || v.rangeCount === 0) return;
    const p = c(v.anchorNode, "A", m._surface), d = v.getRangeAt(0).cloneRange();
    m._closeLinkPopover && m._closeLinkPopover();
    const _ = Ct(m.dom, "ln-editor-link-popover", "ln-editor");
    if (!_) return;
    const b = _.firstElementChild;
    if (!b) return;
    const T = b.querySelector('input[type="url"]'), g = b.querySelector('[data-ln-editor-action="confirm-link"]'), S = b.querySelector('[data-ln-editor-action="cancel-link"]');
    p && (T.value = p.getAttribute("href") || "");
    const C = m.dom.querySelector('[role="toolbar"]');
    C ? C.after(b) : m.dom.insertBefore(b, m._surface), T.focus();
    function q() {
      const B = window.getSelection();
      B.removeAllRanges(), B.addRange(d);
    }
    function D() {
      document.removeEventListener("mousedown", P), m._closeLinkPopover = null, b.remove();
    }
    function I() {
      const B = T.value.trim();
      if (D(), q(), m._surface.focus(), B)
        if (p)
          p.setAttribute("href", B), p.setAttribute("rel", "noopener noreferrer"), m._syncToTextarea(), L(m.dom, "ln-editor:changed", {
            html: m._textarea.value,
            target: m.dom
          });
        else {
          document.execCommand("createLink", !1, B);
          const H = window.getSelection();
          if (H && H.anchorNode) {
            const z = c(H.anchorNode, "A", m._surface);
            z && (z.setAttribute("rel", "noopener noreferrer"), m._syncToTextarea());
          }
        }
      else p && document.execCommand("unlink", !1, null);
    }
    function R() {
      D(), q(), m._surface.focus();
    }
    function O() {
      D();
    }
    function P(B) {
      const H = m.dom.contains(B.target) && B.target.closest('[data-ln-editor-action="link"]');
      !b.contains(B.target) && !H && O();
    }
    m._closeLinkPopover = D, g.addEventListener("click", I), S.addEventListener("click", R), T.addEventListener("keydown", function(B) {
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
  function i(f) {
    const h = {}, r = f.dataset;
    for (const s in r) {
      if (!s.startsWith("lnFill") || e[s]) continue;
      const a = s.slice(6);
      a && (h[a.charAt(0).toLowerCase() + a.slice(1)] = r[s]);
    }
    return h;
  }
  function l(f, h) {
    const r = window.CSS && CSS.escape ? CSS.escape(h) : h, s = document.querySelectorAll('[data-ln-fill-id="' + r + '"]');
    if (s.length === 0) return null;
    for (let a = 0; a < s.length; a++) {
      const n = s[a].getAttribute("data-ln-fill-form");
      if (n) {
        const o = document.getElementById(n);
        if (o && f.contains(o)) return s[a];
      }
    }
    return s[0];
  }
  document.addEventListener("click", function(f) {
    if (f.ctrlKey || f.metaKey || f.button === 1) return;
    const h = f.target.closest("[data-ln-fill-form]");
    if (!h) return;
    const r = h.getAttribute("href");
    if (r && r.indexOf("#") !== -1) return;
    const s = h.getAttribute("data-ln-fill-form"), a = document.getElementById(s);
    if (!a) return;
    const n = i(h), o = Object.keys(n).length > 0;
    window.lnCore.lnFill(a, o ? n : null);
  }), document.addEventListener("ln-fill:request", function(f) {
    const h = f.detail;
    if (!h) return;
    const r = f.target, s = h.id;
    if (s == null) {
      window.lnCore.lnFill(r, null);
      return;
    }
    const a = l(r, s);
    if (!a) return;
    const n = i(a);
    window.lnCore.lnFill(r, n);
  }), window[t] = !0;
})();
function Nr(t, e = "-") {
  if (t == null) return "";
  const i = e || "-", l = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, i).replace(new RegExp(`${l}+`, "g"), i).replace(new RegExp(`^${l}+|${l}+$`, "g"), "");
}
(function() {
  const t = "data-ln-slug-from", e = "lnSlug";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-slug-from": { prop: "sourceName", type: "string", read: $, fallback: "", description: "Name of the source input field to derive URL slug from" }
  }, l = et(i);
  function f(h) {
    if (h.tagName !== "INPUT")
      return console.warn("[ln-slug] Can only be applied to <input>, got:", h.tagName), this;
    const r = h.form;
    if (!r)
      return console.warn("[ln-slug] Slug input is not inside a <form>:", h), this;
    tt(this, h, l);
    const s = r.elements[this.sourceName];
    if (!s)
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" not found in form:', h), this;
    if (typeof s.addEventListener != "function")
      return console.warn('[ln-slug] Source field "' + this.sourceName + '" is a RadioNodeList (same-name group) — single source field required:', h), this;
    this.dom = h, this.source = s, this._pristine = h.value === "", this._mirroring = !1;
    const a = this;
    return this._onSource = function() {
      a._pristine && a._mirror();
    }, this._onSlug = function() {
      a._mirroring || (a._pristine = a.dom.value === "");
    }, s.addEventListener("input", this._onSource), h.addEventListener("input", this._onSlug), this._pristine && s.value && s.value.trim() !== "" && this._mirror(), this;
  }
  f.prototype._mirror = function() {
    this._mirroring = !0, this.dom.value = Nr(this.source.value), this.dom.dispatchEvent(new Event("input", { bubbles: !0 })), this._mirroring = !1;
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.source.removeEventListener("input", this._onSource), this.dom.removeEventListener("input", this._onSlug), delete this.dom[e]);
  }, j(t, e, f, "ln-slug", {
    attributes: i
  });
})();
function Mr(t, e = Date.now()) {
  if (!t)
    return { value: 0, unit: "second", isOlderThanMonth: !1 };
  const i = typeof e == "number" ? e : e.getTime(), l = t.getTime(), f = Math.floor((l - i) / 1e3), h = Math.abs(f);
  return h < 10 ? { value: 0, unit: "second", isOlderThanMonth: !1 } : h < 60 ? { value: f, unit: "second", isOlderThanMonth: !1 } : h < 3600 ? { value: Math.round(f / 60), unit: "minute", isOlderThanMonth: !1 } : h < 86400 ? { value: Math.round(f / 3600), unit: "hour", isOlderThanMonth: !1 } : h < 604800 ? { value: Math.round(f / 86400), unit: "day", isOlderThanMonth: !1 } : h < 2592e3 ? { value: Math.round(f / 604800), unit: "week", isOlderThanMonth: !1 } : { value: Math.round(f / 2592e3), unit: "month", isOlderThanMonth: !0 };
}
function Xt(t, e, i = /* @__PURE__ */ new Date()) {
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
    "data-ln-time": { type: "enum", values: ["relative", "short", "medium", "long", "iso"], fallback: "relative", effect: d, description: "Time format style preset or activator" },
    "data-ln-time-locale": { type: "string", effect: d, description: "BCP 47 language tag override for time formatting" }
  }, l = {}, f = {};
  function h(b) {
    return b.getAttribute("data-ln-time-locale") || it(b);
  }
  function r(b, T) {
    const g = (b || "") + "|" + JSON.stringify(T);
    return l[g] || (l[g] = new Intl.DateTimeFormat(b, T)), l[g];
  }
  function s(b) {
    const T = b || "";
    return f[T] || (f[T] = new Intl.RelativeTimeFormat(b, { numeric: "auto", style: "narrow" })), f[T];
  }
  const a = /* @__PURE__ */ new Set();
  let n = null;
  function o() {
    n || (n = setInterval(u, 6e4));
  }
  function c() {
    n && (clearInterval(n), n = null);
  }
  function u() {
    for (const b of a) {
      if (!document.body.contains(b.dom)) {
        a.delete(b);
        continue;
      }
      v(b);
    }
    a.size === 0 && c();
  }
  function w(b, T) {
    const g = Lt(T), S = (T || "").toLowerCase().split("-")[0], C = r(T, Xt("full", b)), q = C.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (g && q !== S && g.monthsLong) {
      const D = g.monthsLong[b.getMonth()], I = b.getDate(), R = b.getFullYear(), O = String(b.getHours()).padStart(2, "0"), P = String(b.getMinutes()).padStart(2, "0");
      return `${I} ${D} ${R}, ${O}:${P}`;
    }
    return C.format(b);
  }
  function y(b, T) {
    const g = Xt("short", b), S = Lt(T), C = (T || "").toLowerCase().split("-")[0], q = r(T, g), D = q.resolvedOptions().locale.toLowerCase().split("-")[0];
    if (S && D !== C && S.monthsShort) {
      const I = S.monthsShort[b.getMonth()], R = b.getDate(), O = g.year ? " " + b.getFullYear() : "";
      return `${R} ${I}${O}`;
    }
    return q.format(b);
  }
  function E(b, T) {
    return r(T, Xt("date", b)).format(b);
  }
  function A(b, T) {
    return r(T, Xt("time", b)).format(b);
  }
  function m(b, T) {
    const g = Mr(b);
    return g.isOlderThanMonth ? y(b, T) : s(T).format(g.value, g.unit);
  }
  function v(b) {
    const T = b.dom.getAttribute("datetime");
    if (!T) return;
    const g = ot(T);
    if (!g) return;
    const S = b.dom.getAttribute(t) || "short", C = h(b.dom);
    let q;
    switch (S) {
      case "relative":
        q = m(g, C);
        break;
      case "full":
        q = w(g, C);
        break;
      case "date":
        q = E(g, C);
        break;
      case "time":
        q = A(g, C);
        break;
      default:
        q = y(g, C);
        break;
    }
    b.dom.textContent = q, S !== "full" && (b.dom.title = w(g, C));
  }
  function p(b) {
    this.dom = b;
    const T = this;
    return this._onLocaleChange = function() {
      v(T);
    }, re(), document.addEventListener("ln-core:locale-change", this._onLocaleChange), v(this), b.getAttribute(t) === "relative" && (a.add(this), o()), this;
  }
  p.prototype.render = function() {
    v(this);
  }, p.prototype.destroy = function() {
    this._onLocaleChange && document.removeEventListener("ln-core:locale-change", this._onLocaleChange), a.delete(this), a.size === 0 && c(), delete this.dom[e];
  };
  function d(b) {
    const T = b[e];
    if (!T) return;
    b.getAttribute(t) === "relative" ? (a.add(T), o()) : (a.delete(T), a.size === 0 && c()), v(T);
  }
  function _(b) {
    b.nodeType === 1 && b.hasAttribute && b.hasAttribute(t) && b[e] && v(b[e]);
  }
  j(t, e, p, "ln-time", {
    attributes: i,
    extraAttributes: ["datetime", "lang"],
    onAttributeChange: d,
    onInit: _
  });
})();
function Fr(t = {}) {
  let e = t.windowSize > 0 ? t.windowSize : 1e3, i = t.pageSize > 0 ? t.pageSize : 200, l = t.fetchDebounce != null ? t.fetchDebounce : 120;
  const f = typeof t.requestPage == "function" ? t.requestPage : () => {
  }, h = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let s = 0, a = 0, n = 0, o = !1, c = null;
  function u(E, A) {
    h.delete(E), h.set(E, A);
  }
  function w() {
    if (h.size <= e) return [];
    const E = [];
    for (; h.size > e; ) {
      const m = h.keys().next().value;
      E.push(h.get(m)), h.delete(m);
    }
    const A = new Set(h.values());
    return E.filter((m) => !A.has(m));
  }
  function y(E, A) {
    r.add(E), clearTimeout(c), c = setTimeout(() => f(E, i, A), l);
  }
  return {
    get logicalTotal() {
      return s;
    },
    set logicalTotal(E) {
      s = E;
    },
    get grandTotal() {
      return a;
    },
    set grandTotal(E) {
      a = E;
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
      const A = h.get(E);
      return u(E, A), A;
    },
    ensure: (E, A, m) => {
      if (!o && !r.has(0)) return y(0, m);
      if (s <= 0) return;
      const v = Math.max(0, E), p = Math.min(s, A);
      for (let d = v; d < p; d++)
        if (!h.has(d)) {
          const _ = Math.floor(d / i) * i;
          if (!r.has(_)) return y(_, m);
        }
    },
    ingest: (E, A, m, v, p) => {
      if (p != null && p !== n) return [];
      o = !0, m != null && (a = m), v != null && (s = v);
      for (let d = 0; d < A.length; d++)
        u(E + d, A[d]);
      return r.delete(E), w();
    },
    reset: function() {
      n++, this.clear();
    },
    clear: () => {
      o = !1, h.clear(), r.clear(), clearTimeout(c);
    },
    // Returns the ids evicted by a window shrink, same contract as ingest() —
    // the caller must purge them from storage.
    configure: (E = {}) => {
      let A = [];
      return E.windowSize > 0 && E.windowSize !== e && (e = E.windowSize, A = w()), E.pageSize > 0 && (i = E.pageSize), E.fetchDebounce >= 0 && (l = E.fetchDebounce), A;
    }
  };
}
function Pr(t, e, i) {
  if (!Array.isArray(t) || !e || !e.field) return t;
  const { field: l, direction: f } = e, h = f === "desc", r = t.map((a) => a ? a[l] : void 0), s = De(r);
  return [...t].sort((a, n) => {
    const o = a ? a[l] : void 0, c = n ? n[l] : void 0, u = Re(o, c, s, i);
    return h ? -u : u;
  });
}
function ci(t, e) {
  if (!Array.isArray(t) || !e || typeof e != "object") return t;
  const i = Object.keys(e).filter((l) => Array.isArray(e[l]) && e[l].length > 0);
  return i.length ? t.filter((l) => l ? i.every((f) => Ne(l[f], e[f])) : !1) : t;
}
function Br(t, e, i) {
  if (!Array.isArray(t) || !e || !i || !i.length) return t;
  const l = Mn(e);
  return l.length ? t.filter((f) => f ? l.every(
    (h) => i.some((r) => {
      const s = f[r];
      return s != null && Fn(String(s), [h]);
    })
  ) : !1) : t;
}
function Ur(t, e, i) {
  if (!Array.isArray(t) || !t.length) return 0;
  if (i === "count") return t.length;
  const l = t.map((h) => h && h[e] != null ? parseFloat(h[e]) : NaN).filter((h) => Number.isFinite(h)), f = l.reduce((h, r) => h + r, 0);
  return i === "sum" ? f : i === "avg" && l.length ? f / l.length : 0;
}
function Hr(t, e = {}, i = [], l) {
  if (!Array.isArray(t))
    return { records: [], total: 0, filtered: 0 };
  const f = t.length;
  let h = t;
  e.filters && (h = ci(h, e.filters)), e.search && (h = Br(h, e.search, i));
  const r = h.length;
  if (e.sort && (h = Pr(h, e.sort, l)), e.offset || e.limit) {
    const s = e.offset || 0, a = e.limit || h.length;
    h = h.slice(s, s + a);
  }
  return { records: h, total: f, filtered: r };
}
function zr(t, e) {
  return !Array.isArray(t) || !e || typeof e != "object" ? t : t.map((i) => {
    if (!i) return null;
    const l = { ...i };
    for (const [f, h] of Object.entries(e))
      if (typeof h == "function")
        try {
          l[f] = h(i);
        } catch {
          l[f] = void 0;
        }
    return l;
  });
}
(function() {
  const t = "data-ln-data-store", e = "lnDataStore";
  if (window[e] !== void 0) return;
  function i(k, x, N) {
    const M = k.getAttribute(x);
    if (M === "never" || M === "-1") return -1;
    const F = parseInt(M, 10);
    return isNaN(F) ? N : F;
  }
  const l = {
    "data-ln-data-store": { type: "marker", effect: He, description: "Identifies the element as a data-store definition container" },
    "data-ln-data-store-indexes": { type: "list", effect: He, description: "Comma-separated index field names for the IndexedDB store" },
    "data-ln-data-store-stale": { prop: "_staleThreshold", type: "integer", read: i, fallback: 300, description: "Cache staleness threshold in seconds, or -1/never" },
    "data-ln-data-store-search-fields": { prop: "_searchFields", type: "list", read: En, description: "Record fields to index for client-side search" },
    "data-ln-data-store-no-local-query": { prop: "noLocalQuery", type: "boolean", read: It, description: "Bypasses local IndexedDB query resolution, forcing remote fetching" },
    "data-ln-data-store-window": { prop: "_windowSize", type: "integer", read: xt, fallback: 1e3, min: 10, effect: Ei, description: "Virtual scrolling cache window size in records" },
    "data-ln-data-store-window-page": { prop: "_windowPageSize", type: "integer", read: xt, fallback: 200, min: 5, effect: Ai, description: "Virtual scrolling slice page size" },
    "data-ln-data-store-frozen": { type: "marker", description: "Applied at runtime to indicate store schema is locked in IndexedDB" }
  }, f = et(l), h = "ln_app_cache", r = "_meta", s = "1.0";
  let a = null, n = null;
  const o = {};
  function c(k) {
    k && k.name === "QuotaExceededError" && L(document, "ln-data-store:quota-exceeded", { error: k });
  }
  function u() {
    const k = {};
    for (const x of document.querySelectorAll(`[${t}]`)) {
      const N = x.id;
      if (N) {
        const M = x.getAttribute("data-ln-data-store-indexes") || "";
        k[N] = {
          indexes: M.split(",").map((F) => F.trim()).filter(Boolean)
        };
      }
    }
    return k;
  }
  function w() {
    return n || (n = new Promise((k) => {
      if (typeof indexedDB > "u")
        return console.warn("[ln-data-store] IndexedDB not available — falling back to in-memory store"), k(null);
      const x = u(), N = Object.keys(x), M = indexedDB.open(h);
      M.onerror = () => {
        console.warn("[ln-data-store] IndexedDB open failed — falling back to in-memory store"), k(null);
      }, M.onsuccess = (F) => {
        const U = F.target.result, K = Array.from(U.objectStoreNames);
        if (!(!K.includes(r) || N.some((ft) => !K.includes(ft))))
          return y(U), a = U, k(U);
        const J = U.version;
        U.close();
        const nt = indexedDB.open(h, J + 1);
        nt.onblocked = () => {
          console.warn("[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection");
        }, nt.onerror = () => {
          console.warn("[ln-data-store] Database upgrade failed"), k(null);
        }, nt.onupgradeneeded = (ft) => {
          const st = ft.target.result;
          st.objectStoreNames.contains(r) || st.createObjectStore(r, { keyPath: "key" });
          for (const Tt of N)
            if (!st.objectStoreNames.contains(Tt)) {
              const Mt = st.createObjectStore(Tt, { keyPath: "id" });
              for (const le of x[Tt].indexes)
                Mt.createIndex(le, le, { unique: !1 });
            }
        }, nt.onsuccess = (ft) => {
          const st = ft.target.result;
          y(st), a = st, k(st);
        };
      };
    }), n);
  }
  function y(k) {
    k.onversionchange = () => {
      k.close(), a = null, n = null;
    };
  }
  function E() {
    return a ? Promise.resolve(a) : (n = null, w());
  }
  async function A(k) {
    if (!At() || !k) return k;
    const x = { ...k }, N = x.id, M = await Wi(x);
    return !M || !M.encrypted ? k : {
      ...M,
      id: N
    };
  }
  async function m(k) {
    return !k || !k.encrypted || !At() ? k : Vi(k, { silent: !0 });
  }
  const v = (k, x) => E().then((N) => N ? N.transaction(k, x).objectStore(k) : null);
  function p(k) {
    return new Promise((x, N) => {
      k.onsuccess = () => x(k.result), k.onerror = () => {
        c(k.error), N(k.error);
      };
    });
  }
  const d = (k) => v(k, "readonly").then((x) => x ? p(x.getAll()) : []).then((x) => At() ? Promise.all(x.map((N) => m(N))) : x), _ = (k, x) => v(k, "readonly").then((N) => N ? p(N.get(x)).then((M) => M !== void 0 ? M : typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)) ? p(N.get(Number(x))) : typeof x == "number" ? p(N.get(String(x))) : null) : null).then((N) => N ? m(N) : null), b = (k, x) => E().then((N) => {
    if (!N) return [];
    const F = N.transaction(k, "readonly").objectStore(k), U = x.map((K) => p(F.get(K)).then((V) => V !== void 0 ? V : typeof K == "string" && K.trim() !== "" && !isNaN(Number(K)) ? p(F.get(Number(K))) : typeof K == "number" ? p(F.get(String(K))) : null));
    return Promise.all(U).then((K) => At() ? Promise.all(K.map((V) => V ? m(V) : null)) : K);
  }), T = (k, x) => (At() ? A(x) : Promise.resolve(x)).then((M) => v(k, "readwrite").then((F) => F ? p(F.put(M)) : null)), g = (k, x) => v(k, "readwrite").then((N) => N ? p(N.delete(x)).then(() => {
    if (typeof x == "string" && x.trim() !== "" && !isNaN(Number(x)))
      return p(N.delete(Number(x)));
    if (typeof x == "number")
      return p(N.delete(String(x)));
  }) : null), S = (k) => v(k, "readwrite").then((x) => x ? p(x.clear()) : null), C = (k) => v(k, "readonly").then((x) => x ? p(x.count()) : 0), q = (k) => v(r, "readonly").then((x) => x ? p(x.get(k)) : null), D = (k, x) => v(r, "readwrite").then((N) => {
    if (N)
      return x.key = k, p(N.put(x));
  });
  function I(k) {
    return this.dom = k, this._name = k.id, this._name || console.warn("[ln-data-store] missing id — the store cannot be addressed", k), tt(this, k, f), this._handlers = null, this.isLoaded = !1, this.canServe = !1, this.isInitialized = !1, this.initializationError = null, this.hasCache = !1, this.isSyncing = !1, this.lastSyncedAt = null, this.query = { filters: {}, search: "", sort: null }, k.hasAttribute("data-ln-data-store-window") ? this._windowIndex = Fr({
      windowSize: this._windowSize,
      pageSize: this._windowPageSize,
      requestPage: (x, N, M) => {
        L(this.dom, "ln-data-store:request-page", {
          store: this._name,
          offset: x,
          limit: N,
          query: M,
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
    for (const [x, N] of Object.entries(k._handlers))
      k.dom.addEventListener(`ln-data-store:request-${x}`, N);
    k._queryHandlers = {
      "ln-search:change": (x) => {
        x.preventDefault();
        const N = x.detail && x.detail.term != null ? x.detail.term : "";
        N !== k.query.search && (k.query.search = N, ae(k));
      },
      "ln-filter:change": (x) => {
        x.preventDefault();
        const N = x.detail && x.detail.key;
        if (!N) return;
        const M = (x.detail.values || []).slice(), F = k.query.filters[N];
        (F ? F.length === M.length && F.every((K, V) => K === M[V]) : !M.length) || (M.length ? k.query.filters[N] = M : delete k.query.filters[N], ae(k));
      },
      "ln-sort:change": (x) => {
        x.preventDefault();
        const N = x.detail && x.detail.field, M = x.detail && x.detail.direction, F = M && M !== "none" ? { field: N, direction: M } : null, U = k.query.sort;
        !U && !F || U && F && U.field === F.field && U.direction === F.direction || (k.query.sort = F, ae(k));
      }
    };
    for (const [x, N] of Object.entries(k._queryHandlers))
      k.dom.addEventListener(x, N);
  }
  function O(k, x, N, M) {
    const F = N && N.requestId;
    return k._mutationChain = k._mutationChain.then(() => k.ready).then(() => {
      if (k.initializationError) throw k.initializationError;
      return M();
    }).catch((U) => Y(k, x, F, U)), k._mutationChain;
  }
  function P(k, x = 0) {
    return C(k._name).then((N) => {
      if (k._windowIndex || k.windowed) {
        const M = k.totalCount != null ? k.totalCount : N;
        k.totalCount = Math.max(0, M + x);
      } else
        k.totalCount = N;
      return k.hasCache = !0, k.isLoaded = !0, k.canServe = !0, D(k._name, {
        schema_version: s,
        last_synced_at: k.lastSyncedAt,
        has_cache: !0,
        record_count: k.totalCount
      });
    });
  }
  function B(k, { tempId: x, data: N = {}, requestId: M } = {}) {
    const F = { ...N, id: x };
    return T(k._name, F).then(() => P(k, 1)).then(() => {
      L(k.dom, "ln-data-store:created", { store: k._name, record: F, tempId: x, requestId: M });
    });
  }
  function H(k, { id: x, data: N = {}, requestId: M } = {}) {
    return _(k._name, x).then((F) => {
      if (!F) throw new Error(`Record not found: ${x}`);
      const U = F.id, K = { ...F, ...N, id: U }, V = N.id, J = V !== void 0 && V !== U;
      return (J ? _t(k._name, U, { ...K, id: V }) : T(k._name, K)).then(() => P(k, 0)).then(() => {
        L(k.dom, "ln-data-store:updated", { store: k._name, record: J ? { ...K, id: V } : K, previous: F, requestId: M });
      });
    });
  }
  function z(k, { id: x, requestId: N } = {}) {
    return _(k._name, x).then((M) => {
      if (!M) {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: x, requestId: N, missing: !0 });
        return;
      }
      const F = M.id;
      return g(k._name, F).then(() => P(k, -1)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, id: F, requestId: N });
      });
    });
  }
  function Q(k, { ids: x = [], requestId: N } = {}) {
    return x.length ? Promise.all(x.map((M) => _(k._name, M))).then((M) => {
      const F = M.filter(Boolean).map((U) => U.id);
      return ut(k._name, F).then(() => P(k, -F.length)).then(() => {
        L(k.dom, "ln-data-store:deleted", { store: k._name, ids: F, requestId: N });
      });
    }) : (L(k.dom, "ln-data-store:deleted", { store: k._name, ids: [], requestId: N }), Promise.resolve());
  }
  function Y(k, x, N, M) {
    console.error("[ln-data-store] " + x + " failed:", M), L(k.dom, "ln-data-store:mutation-error", {
      store: k._name,
      action: x,
      requestId: N,
      error: M
    });
  }
  function X(k) {
    return w().then((x) => {
      if (!x) throw new Error("IndexedDB is unavailable");
      return q(k._name);
    }).then((x) => {
      if (k.initializationError = null, x && x.schema_version === s)
        k.lastSyncedAt = x.last_synced_at || null, k.totalCount = x.record_count || 0, k.hasCache = x.has_cache === !0 || k.totalCount > 0, k.hasCache && (k.isLoaded = !0, k.canServe = !0, L(k.dom, "ln-data-store:ready", { store: k._name, count: k.totalCount, source: "cache" })), k.isInitialized = !0, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: k.hasCache, lastSyncedAt: k.lastSyncedAt, count: k.totalCount });
      else {
        if (x && x.schema_version !== s)
          return S(k._name).then(() => D(k._name, { schema_version: s, last_synced_at: null, has_cache: !1, record_count: 0 })).then(() => {
            k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
          });
        k.isInitialized = !0, k.hasCache = !1, L(k.dom, "ln-data-store:initialized", { store: k._name, hasCache: !1, lastSyncedAt: null, count: 0 });
      }
    }).catch((x) => (k.isInitialized = !0, k.isLoaded = !1, k.canServe = !1, k.hasCache = !1, k.isSyncing = !1, k.initializationError = x, L(k.dom, "ln-data-store:initialization-error", { store: k._name, error: x }), { ok: !1, error: x }));
  }
  function W(k) {
    k.isSyncing = !0, L(k.dom, "ln-data-store:request-remote-sync", { since: k.lastSyncedAt });
  }
  function G(k, x) {
    return E().then((N) => N ? (At() ? Promise.all(x.map((F) => A(F))) : Promise.resolve(x)).then((F) => new Promise((U, K) => {
      const V = N.transaction(k, "readwrite"), J = V.objectStore(k);
      F.forEach((nt) => J.put(nt)), V.oncomplete = () => U(), V.onerror = () => {
        c(V.error), K(V.error);
      };
    })) : void 0);
  }
  function ut(k, x) {
    return E().then((N) => {
      if (N)
        return new Promise((M, F) => {
          const U = N.transaction(k, "readwrite"), K = U.objectStore(k);
          x.forEach((V) => {
            K.delete(V), typeof V == "string" && V.trim() !== "" && !isNaN(Number(V)) ? K.delete(Number(V)) : typeof V == "number" && K.delete(String(V));
          }), U.oncomplete = () => M(), U.onerror = () => F(U.error);
        });
    });
  }
  function _t(k, x, N) {
    return (At() ? A(N) : Promise.resolve(N)).then((F) => E().then((U) => {
      if (U)
        return new Promise((K, V) => {
          const J = U.transaction(k, "readwrite"), nt = J.objectStore(k);
          nt.put(F), nt.delete(x), J.oncomplete = () => K(), J.onerror = () => {
            c(J.error), V(J.error);
          };
        });
    }));
  }
  const se = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
  function hi(k) {
    return k ? Object.keys(k).filter((x) => Array.isArray(k[x]) && k[x].length > 0) : [];
  }
  function pi(k, x, N) {
    return x.every((M) => N[M].map(String).includes(String(k[M])));
  }
  function mi(k) {
    return String(k || "").toLowerCase().split(/\s+/).filter(Boolean);
  }
  function gi(k, x, N) {
    return x.every(
      (M) => N.some((F) => {
        const U = k[F];
        return U != null && String(U).toLowerCase().includes(M);
      })
    );
  }
  function _i(k, x, N) {
    return Ur(k, x, N);
  }
  function Nt(k, x) {
    return zr(x, k.presenters && k.presenters.computed);
  }
  function bi(k) {
    return !k.sort && !At();
  }
  function yi(k, x, N) {
    const M = hi(x.filters), F = x.search ? mi(x.search) : [], U = k._searchFields, K = F.length > 0 && U && U.length > 0;
    return v(k._name, "readonly").then((V) => V ? new Promise((J, nt) => {
      const ft = [], st = V.openCursor();
      st.onsuccess = () => {
        const Tt = st.result;
        if (!Tt || ft.length >= N) {
          J(ft);
          return;
        }
        const Mt = Tt.value;
        (!M.length || pi(Mt, M, x.filters)) && (!K || gi(Mt, F, U)) && ft.push(Mt), Tt.continue();
      }, st.onerror = () => nt(st.error);
    }) : []);
  }
  function Be(k, x, N) {
    return Hr(x, N, k._searchFields, se);
  }
  function Ue(k, x, N) {
    const M = [];
    for (let U = x; U < x + N; U++) {
      const K = k._windowIndex.getId(U);
      M.push(K);
    }
    const F = Array.from(new Set(M.filter((U) => U !== void 0)));
    return b(k._name, F).then((U) => {
      const K = /* @__PURE__ */ new Map();
      for (let J = 0; J < U.length; J++) {
        const nt = U[J];
        nt && K.set(String(nt.id), nt);
      }
      const V = [];
      for (let J = 0; J < M.length; J++) {
        const nt = M[J];
        if (nt === void 0)
          V.push(null);
        else {
          const ft = K.get(String(nt));
          V.push(ft || null);
        }
      }
      return {
        data: Nt(k, V),
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
      const N = k.offset || 0, M = k.limit || 200;
      if (x._windowIndex.ensure(N, N + M, k), !x._windowIndex.hasLoaded && !x.noLocalQuery) {
        const F = N + M, U = (K) => K.length ? {
          data: Nt(x, K),
          offset: N,
          queryGen: x._windowIndex.queryGen,
          provisional: !0
        } : Ue(x, N, M);
        return bi(k) ? yi(x, k, F).then((K) => U(K.slice(N, F))) : d(x._name).then((K) => U(Be(x, K, k).records));
      }
      return Ue(x, N, M);
    }
    return d(x._name).then((N) => {
      const M = Be(x, N, k);
      return {
        data: Nt(x, M.records),
        total: M.total,
        filtered: M.filtered
      };
    });
  }, I.prototype.getById = function(k) {
    return _(this._name, k).then((x) => x ? Nt(this, [x])[0] : null);
  }, I.prototype.count = function(k) {
    return k && Object.keys(k).length > 0 ? d(this._name).then((N) => ci(N, k).length) : this.totalCount != null ? Promise.resolve(this.totalCount) : C(this._name);
  }, I.prototype.aggregate = function(k, x) {
    return d(this._name).then((N) => _i(N, k, x));
  }, I.prototype.setPresenters = function(k) {
    this.presenters = k;
  }, I.prototype.applySync = function(k, x, N, M) {
    M = M || {};
    const F = this;
    if (F._windowIndex && M.queryGen != null && M.queryGen !== F._windowIndex.queryGen)
      return Promise.resolve();
    k.length > 0 || x.length > 0;
    let U = Promise.resolve();
    return k.length > 0 && (U = U.then(() => G(F._name, k))), x.length > 0 && (U = U.then(() => ut(F._name, x))), U.then(() => {
      if (F._windowIndex && (M.offset != null || M.total != null)) {
        const K = M.offset != null ? M.offset : 0, V = k.map((nt) => nt.id), J = F._windowIndex.ingest(K, V, M.total, M.filtered, M.queryGen);
        if (J && J.length) return ut(F._name, J);
      }
    }).then(() => C(F._name)).then((K) => (F.totalCount = M.total !== void 0 ? M.total : K, F.hasCache = !0, D(F._name, {
      schema_version: s,
      last_synced_at: N,
      has_cache: !0,
      record_count: F.totalCount
    }))).then(() => {
      const K = !F.isLoaded;
      F.isLoaded = !0, F.canServe = !0, F.isSyncing = !1, F.lastSyncedAt = N, K ? (L(F.dom, "ln-data-store:loaded", { store: F._name, count: F.totalCount, meta: M }), L(F.dom, "ln-data-store:ready", { store: F._name, count: F.totalCount, source: "server", meta: M })) : L(F.dom, "ln-data-store:synced", {
        store: F._name,
        added: k.length,
        deleted: x.length,
        changed: !0,
        meta: M
      });
    }).catch((K) => {
      F.isSyncing = !1, console.error("[ln-data-store] applySync failed:", K);
    });
  }, I.prototype.applyQuery = function(k, x) {
    x = x || {};
    const N = this;
    let M = Promise.resolve();
    return k.length > 0 && (M = M.then(() => G(N._name, k))), M.then(() => C(N._name)).then((F) => (N.totalCount = x.total !== void 0 ? x.total : F, k.length > 0 && (N.canServe = !0), Nt(N, k))).catch((F) => (console.error("[ln-data-store] applyQuery failed:", F), []));
  }, I.prototype.forceSync = function() {
    this.isSyncing || W(this);
  }, I.prototype.fullReload = function() {
    const k = this;
    return S(k._name).then(() => D(k._name, {
      schema_version: s,
      last_synced_at: null,
      has_cache: !1,
      record_count: 0
    })).then(() => {
      k.isLoaded = !1, k.hasCache = !1, k.lastSyncedAt = null, k.totalCount = 0, W(k);
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
  function vi() {
    return E().then((k) => {
      if (!k) return;
      const x = Array.from(k.objectStoreNames);
      return new Promise((N, M) => {
        const F = k.transaction(x, "readwrite");
        x.forEach((U) => F.objectStore(U).clear()), F.oncomplete = () => N(), F.onerror = () => M(F.error);
      });
    }).then(() => {
      Object.values(o).forEach((k) => {
        k.isLoaded = !1, k.canServe = !1, k.isInitialized = !1, k.initializationError = null, k.hasCache = !1, k.isSyncing = !1, k.lastSyncedAt = null, k.totalCount = 0;
      });
    });
  }
  function ae(k) {
    k._windowIndex && k._windowIndex.reset(), L(k.dom, "ln-data-store:query-changed", {
      store: k._name,
      query: {
        filters: Object.assign({}, k.query.filters),
        search: k.query.search,
        sort: k.query.sort ? Object.assign({}, k.query.sort) : null
      }
    });
  }
  const wi = "data-ln-data-store-frozen";
  function He(k, x) {
    k.setAttribute(wi, x);
  }
  function Ei(k) {
    const x = k[e];
    if (!x._windowIndex) return;
    const N = x._windowIndex.configure({ windowSize: x._windowSize });
    N.length && ut(x._name, N).catch((M) => {
      console.error("[ln-data-store] window shrink eviction failed:", M);
    });
  }
  function Ai(k) {
    const x = k[e];
    x._windowIndex && x._windowIndex.configure({ pageSize: x._windowPageSize });
  }
  j(t, e, I, "ln-data-store", {
    attributes: l
  }), window[e].clearAll = vi, window[e].init = window[e], window[e].setStorageKey = Ve, typeof window < "u" && (window.lnCore = window.lnCore || {}, window.lnCore.setStorageKey = Ve);
})();
const Kr = {
  offset: "offset",
  limit: "limit",
  search: "search",
  sortField: "sort_field",
  sortDir: "sort_dir"
};
function kt(...t) {
  return t.filter((e) => e != null && e !== "").map((e, i) => {
    const l = String(e);
    return i === 0 ? l.replace(/\/+$/, "") : l.replace(/^\/+/, "").replace(/\/+$/, "");
  }).filter(Boolean).join("/");
}
function jr(t, e) {
  if (!t || typeof t != "object") return "";
  const i = Object.assign({}, Kr);
  if (e && typeof e == "object")
    for (const f in e)
      e[f] !== void 0 && e[f] !== null && e[f] !== "" && (i[f] = e[f]);
  const l = new URLSearchParams();
  return t.search && l.append(i.search, t.search), t.offset != null && l.append(i.offset, t.offset), t.limit != null && l.append(i.limit, t.limit), t.sort && t.sort.field && t.sort.direction && (l.append(i.sortField, t.sort.field), l.append(i.sortDir, t.sort.direction)), t.filters && typeof t.filters == "object" && Object.keys(t.filters).forEach((f) => {
    const h = t.filters[f];
    Array.isArray(h) && h.length > 0 && l.append(f, h.join(","));
  }), l.toString();
}
function Wr(t, e, i) {
  let l = kt(t, e);
  return i && (l += (l.indexOf("?") !== -1 ? "&" : "?") + i), l;
}
function an(t) {
  const e = t && t.content !== void 0 ? t.content : t, i = t && t.message ? t.message : null;
  return { record: e, message: i };
}
(function() {
  const t = "data-ln-api-connector", e = "lnApiConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function l(n) {
    const o = n[e];
    o && o.refreshConfig();
  }
  const f = {
    "data-ln-api-connector": { type: "marker", description: "Mounts API connector bridging REST backend and ln-ashlar data coordinators" },
    "data-ln-api-base-url": { prop: "baseUrl", read: $, type: "string", fallback: "", effect: l, description: "Base URL endpoint for API requests" },
    "data-ln-api-path": { prop: "path", read: $, type: "string", fallback: "", effect: l, description: "Resource path appended to base URL" },
    "data-ln-api-headers": { prop: "rawHeaders", read: $, type: "json", fallback: null, effect: l, description: "Custom HTTP headers in JSON format or semicolon-separated pairs" },
    "data-ln-api-param-offset": { effect: l, type: "string", fallback: "offset", description: "Query parameter name for pagination offset" },
    "data-ln-api-param-limit": { effect: l, type: "string", fallback: "limit", description: "Query parameter name for pagination page size" },
    "data-ln-api-param-search": { effect: l, type: "string", fallback: "search", description: "Query parameter name for text search filter" },
    "data-ln-api-param-sort-field": { effect: l, type: "string", fallback: "sort_by", description: "Query parameter name for sort field" },
    "data-ln-api-param-sort-dir": { effect: l, type: "string", fallback: "sort_dir", description: "Query parameter name for sort direction" },
    "data-ln-api-connector-query-debounce": { effect: l, type: "integer", fallback: 200, min: 0, description: "Debounce delay in milliseconds before dispatching query requests" }
  }, h = et(f);
  function r(n) {
    return n.ok ? n.status === 204 ? null : n.json() : n.json().catch(() => null).then((o) => {
      const c = new Error("HTTP " + n.status + ": " + n.statusText);
      throw c.status = n.status, c.data = o, c;
    });
  }
  function s(n) {
    return this.dom = n, tt(this, n, h), n[e] = this, n[i] = this, this._inflight = /* @__PURE__ */ new Map(), this._queryTimers = /* @__PURE__ */ new Map(), this.refreshConfig(), this._handlers = null, a(this), this;
  }
  s.prototype.refreshConfig = function() {
    const n = this.dom;
    this.credentials = "same-origin", this.headers = bn(this.rawHeaders);
    const o = {}, c = n.getAttribute("data-ln-api-param-offset");
    c && (o.offset = c);
    const u = n.getAttribute("data-ln-api-param-limit");
    u && (o.limit = u);
    const w = n.getAttribute("data-ln-api-param-search");
    w && (o.search = w);
    const y = n.getAttribute("data-ln-api-param-sort-field");
    y && (o.sortField = y);
    const E = n.getAttribute("data-ln-api-param-sort-dir");
    E && (o.sortDir = E), this.paramKeys = o;
    const A = n.getAttribute("data-ln-api-connector-query-debounce");
    this.queryDebounce = A !== null ? +A : 300, L(this.dom, "ln-api-connector:config-changed", {
      baseUrl: this.baseUrl,
      path: this.path,
      headers: this.headers,
      paramKeys: this.paramKeys
    });
  }, s.prototype._reqHeaders = function(n) {
    const o = Object.assign({}, this.headers);
    return !o.Accept && !o.accept && (o.Accept = "application/json"), !o["Content-Type"] && !o["content-type"] && (o["Content-Type"] = "application/json"), n && (o["X-Idempotency-Key"] = n), o;
  }, s.prototype.cancel = function(n) {
    return n && this._inflight.has(n) ? (this._inflight.get(n).abort(), this._inflight.delete(n), !0) : !1;
  }, s.prototype.fetchDelta = function(n, o) {
    const c = this;
    let u = kt(c.baseUrl, c.path);
    n != null && n !== "" && (u += (u.indexOf("?") !== -1 ? "&" : "?") + "since=" + encodeURIComponent(n));
    const w = o || "sync";
    c._inflight.has(w) && c._inflight.get(w).abort();
    const y = new AbortController();
    return c._inflight.set(w, y), window.fetch(u, {
      method: "GET",
      headers: c._reqHeaders(),
      credentials: c.credentials,
      signal: y.signal
    }).then(r).finally(function() {
      c._inflight.get(w) === y && c._inflight.delete(w);
    });
  }, s.prototype.query = function(n, o) {
    const c = this, u = jr(n, c.paramKeys), w = Wr(c.baseUrl, c.path, u), y = o || "query";
    c._inflight.has(y) && c._inflight.get(y).abort();
    const E = new AbortController();
    return c._inflight.set(y, E), window.fetch(w, {
      method: "GET",
      headers: c._reqHeaders(),
      credentials: c.credentials,
      signal: E.signal
    }).then(r).finally(function() {
      c._inflight.get(y) === E && c._inflight.delete(y);
    });
  }, s.prototype.create = function(n, o, c) {
    const u = this;
    return window.fetch(kt(u.baseUrl, o || u.path), {
      method: "POST",
      headers: u._reqHeaders(c),
      credentials: u.credentials,
      body: JSON.stringify(n)
    }).then(r);
  }, s.prototype.update = function(n, o, c, u, w) {
    const y = this;
    c != null && (o = Object.assign({}, o, { expected_version: c }));
    const E = u ? kt(y.baseUrl, u) : kt(y.baseUrl, y.path, n);
    return window.fetch(E, {
      method: "PUT",
      headers: y._reqHeaders(w),
      credentials: y.credentials,
      body: JSON.stringify(o)
    }).then(r);
  }, s.prototype.delete = function(n, o, c) {
    const u = this;
    return window.fetch(kt(u.baseUrl, o || u.path, n), {
      method: "DELETE",
      headers: u._reqHeaders(c),
      credentials: u.credentials
    }).then(r);
  }, s.prototype.bulkDelete = function(n, o, c) {
    const u = this;
    return window.fetch(kt(u.baseUrl, o || u.path, "bulk-delete"), {
      method: "DELETE",
      headers: u._reqHeaders(c),
      credentials: u.credentials,
      body: JSON.stringify({ ids: n })
    }).then(r);
  };
  function a(n) {
    n._handlers = {
      sync: function(o) {
        const c = o.detail || {}, u = c.meta && c.meta.targetEl ? c.meta.targetEl : null;
        n.fetchDelta(c.since, u).then(function(w) {
          L(n.dom, "ln-api-connector:fetched", { data: w, since: c.since, meta: c.meta || null });
        }).catch(function(w) {
          w && w.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "sync",
            error: w.message,
            status: w.status || 0,
            data: w.data || null,
            since: c.since,
            meta: c.meta || null
          });
        });
      },
      query: function(o) {
        const c = o.detail || {}, u = c.query || c, w = c.meta && c.meta.targetEl ? c.meta.targetEl : null, y = w || "query", E = n.queryDebounce;
        function A(v, p, d) {
          n.query(p, d).then(function(_) {
            const b = _ || {};
            L(n.dom, "ln-api-connector:fetched", {
              data: b.data || (Array.isArray(b) ? b : []),
              total: b.total,
              filtered: b.filtered,
              offset: p.offset,
              queryGen: p.queryGen,
              meta: v.meta || null
            });
          }).catch(function(_) {
            _ && _.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
              action: "query",
              error: _.message,
              status: _.status || 0,
              data: _.data || null,
              meta: v.meta || null
            });
          });
        }
        if (E === 0) {
          A(c, u, w);
          return;
        }
        n._queryTimers.has(y) && clearTimeout(n._queryTimers.get(y));
        const m = setTimeout(function() {
          n._queryTimers.delete(y), A(c, u, w);
        }, E);
        n._queryTimers.set(y, m);
      },
      cancel: function(o) {
        const c = o.detail || {}, u = c.meta && c.meta.targetEl ? c.meta.targetEl : c.targetEl || c.key;
        u && n.cancel(u);
      },
      create: function(o) {
        const c = o.detail || {};
        n.create(c.data, c.url, c.idempotencyKey).then(function(u) {
          const w = an(u);
          L(n.dom, "ln-api-connector:created", {
            record: w.record,
            tempId: c.tempId,
            message: w.message,
            meta: c.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "create",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            tempId: c.tempId,
            meta: c.meta || null
          });
        });
      },
      update: function(o) {
        const c = o.detail || {};
        n.update(c.id, c.data, c.expected_version, c.url, c.idempotencyKey).then(function(u) {
          const w = an(u);
          L(n.dom, "ln-api-connector:updated", {
            record: w.record,
            id: c.id,
            message: w.message,
            meta: c.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "update",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: c.id,
            conflictData: u.status === 409 ? u.data : null,
            meta: c.meta || null
          });
        });
      },
      delete: function(o) {
        const c = o.detail || {};
        n.delete(c.id, c.url, c.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          L(n.dom, "ln-api-connector:deleted", {
            response: u,
            id: c.id,
            message: w,
            meta: c.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            id: c.id,
            meta: c.meta || null
          });
        });
      },
      bulkDelete: function(o) {
        const c = o.detail || {};
        n.bulkDelete(c.ids, c.url, c.idempotencyKey).then(function(u) {
          const w = u && u.message ? u.message : null;
          L(n.dom, "ln-api-connector:bulk-deleted", {
            response: u,
            ids: c.ids,
            message: w,
            meta: c.meta || null
          });
        }).catch(function(u) {
          u && u.name === "AbortError" || L(n.dom, "ln-api-connector:error", {
            action: "bulk-delete",
            error: u.message,
            status: u.status || 0,
            data: u.data || null,
            ids: c.ids,
            meta: c.meta || null
          });
        });
      }
    }, n.dom.addEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.addEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.addEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.addEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.addEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.addEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.addEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete);
  }
  s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const n = this;
    n._inflight && (n._inflight.forEach(function(o) {
      o.abort();
    }), n._inflight.clear()), this._queryTimers && (this._queryTimers.forEach(function(o) {
      o && clearTimeout(o);
    }), this._queryTimers.clear()), this._handlers && (n.dom.removeEventListener("ln-api-connector:request-sync", n._handlers.sync), n.dom.removeEventListener("ln-api-connector:request-query", n._handlers.query), n.dom.removeEventListener("ln-api-connector:request-cancel", n._handlers.cancel), n.dom.removeEventListener("ln-api-connector:request-create", n._handlers.create), n.dom.removeEventListener("ln-api-connector:request-update", n._handlers.update), n.dom.removeEventListener("ln-api-connector:request-delete", n._handlers.delete), n.dom.removeEventListener("ln-api-connector:request-bulk-delete", n._handlers.bulkDelete), n._handlers = null), delete this.dom[e], delete this.dom[i];
  }, j(t, e, s, "ln-api-connector", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-couchdb-connector", e = "lnCouchDbConnector", i = "lnConnector";
  if (window[e] !== void 0) return;
  function l(y) {
    const E = y[e];
    E && E.refreshConfig();
  }
  const f = {
    "data-ln-couchdb-connector": { type: "marker", description: "Mounts CouchDB/PouchDB connector bridging database and ln-ashlar data coordinators" },
    "data-ln-couchdb-url": { prop: "url", read: $, type: "string", fallback: "", effect: l, description: "CouchDB server base endpoint URL" },
    "data-ln-couchdb-db": { prop: "db", read: $, type: "string", fallback: "", effect: l, description: "Target CouchDB database name" },
    "data-ln-couchdb-auth": { prop: "auth", read: $, type: "string", fallback: "", effect: l, description: "Authentication credentials for CouchDB requests" },
    "data-ln-couchdb-headers": { effect: l, type: "json", fallback: null, description: "Custom HTTP headers in JSON or semicolon-separated format" }
  }, h = et(f);
  function r(y) {
    const E = y && y.content !== void 0 ? y.content : y, A = y && y.message ? y.message : null;
    return { content: E, message: A };
  }
  function s(y) {
    return this.dom = y, tt(this, y, h), y[e] = this, y[i] = this, this.refreshConfig(), this._handlers = null, w(this), this;
  }
  s.prototype.refreshConfig = function() {
    const y = this.dom;
    this.credentials = "same-origin";
    const E = y.getAttribute("data-ln-couchdb-headers") || "";
    this.headers = bn(E, "ln-couchdb-connector"), this.auth && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), E.toLowerCase().includes("authorization") && console.warn("[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead."), L(y, "ln-couchdb-connector:config-changed", {
      url: this.url,
      db: this.db,
      auth: this.auth ? "[REDACTED]" : "",
      headers: this.headers
    });
  };
  function a(y, E, A) {
    const m = Object.assign({}, Ft(y.headers, y.auth), A || {});
    return E && (m["Idempotency-Key"] = E), m;
  }
  s.prototype.fetchDelta = function(y) {
    const E = this, A = ["include_docs=true", "feed=normal"];
    y && A.push("since=" + encodeURIComponent(y));
    const m = Et(E.url, E.db, "_changes") + "?" + A.join("&");
    return window.fetch(m, { method: "GET", headers: Ft(E.headers, E.auth), credentials: E.credentials }).then((v) => {
      if (!v.ok) throw new Error("HTTP " + v.status + ": " + v.statusText);
      return v.json();
    }).then((v) => {
      const p = v.results || [];
      return {
        data: p.filter((d) => !d.deleted && d.doc).map((d) => Object.assign({}, d.doc, { id: d.doc._id })),
        deleted: p.filter((d) => d.deleted).map((d) => d.id),
        synced_at: v.last_seq || y || ""
      };
    });
  };
  function n(y, E, A) {
    const m = Object.assign({ _id: E.id }, E);
    return m._id || delete m._id, window.fetch(Et(y.url, y.db), {
      method: "POST",
      headers: a(y, A),
      credentials: y.credentials,
      body: JSON.stringify(m)
    }).then((v) => {
      if (!v.ok) throw new Error("HTTP " + v.status + ": " + v.statusText);
      return v.json();
    }).then((v) => {
      const p = r(v), d = p.content;
      return { record: Object.assign({}, m, { id: d.id, _id: d.id, _rev: d.rev }), message: p.message };
    });
  }
  s.prototype.create = function(y, E) {
    return n(this, y, E).then((A) => A.record);
  };
  function o(y, E, A, m) {
    const v = Object.assign({ id: String(E), _id: String(E) }, A), p = v._rev || v.rev;
    return (p ? Promise.resolve(p) : window.fetch(Et(y.url, y.db, null, E), { method: "GET", headers: Ft(y.headers, y.auth), credentials: y.credentials }).then((_) => {
      if (!_.ok) throw new Error("Could not retrieve document for revision mapping");
      return _.json().then((b) => b._rev);
    })).then((_) => {
      const b = Object.assign({}, v, { _rev: _ });
      delete b.rev;
      const T = a(y, m, { "If-Match": _ });
      return window.fetch(Et(y.url, y.db, null, E), {
        method: "PUT",
        headers: T,
        credentials: y.credentials,
        body: JSON.stringify(b)
      }).then((g) => {
        if (g.ok) return g.json().then((S) => {
          const C = r(S);
          return { record: Object.assign({}, b, { _rev: C.content.rev }), message: C.message };
        });
        if (g.status === 409) return g.json().then((S) => {
          const C = new Error("Conflict");
          throw C.status = 409, C.data = S, C;
        });
        throw new Error("HTTP " + g.status + ": " + g.statusText);
      });
    });
  }
  s.prototype.update = function(y, E, A) {
    return o(this, y, E, A).then((m) => m.record);
  };
  function c(y, E, A, m) {
    return (A ? Promise.resolve(A) : window.fetch(Et(y.url, y.db, null, E), { method: "GET", headers: Ft(y.headers, y.auth), credentials: y.credentials }).then((p) => {
      if (!p.ok) throw new Error("Could not retrieve document for revision delete");
      return p.json().then((d) => d._rev);
    })).then((p) => {
      const d = Et(y.url, y.db, null, E) + "?rev=" + encodeURIComponent(p);
      return window.fetch(d, { method: "DELETE", headers: a(y, m), credentials: y.credentials }).then((_) => {
        if (!_.ok) throw new Error("HTTP " + _.status + ": " + _.statusText);
        return _.json();
      }).then((_) => {
        const b = r(_);
        return { response: b.content, message: b.message };
      });
    });
  }
  s.prototype.delete = function(y, E, A) {
    return c(this, y, E, A).then((m) => m.response);
  };
  function u(y, E, A) {
    return !E || E.length === 0 ? Promise.resolve({ response: { ok: !0, deletedCount: 0 }, message: null }) : window.fetch(Et(y.url, y.db, "_all_docs"), {
      method: "POST",
      headers: Ft(y.headers, y.auth),
      credentials: y.credentials,
      body: JSON.stringify({ keys: E })
    }).then((m) => {
      if (!m.ok) throw new Error("HTTP " + m.status + ": " + m.statusText);
      return m.json();
    }).then((m) => {
      const p = (m.rows || []).filter((d) => !d.error && d.value && d.value.rev).map((d) => ({ _id: d.id, _rev: d.value.rev, _deleted: !0 }));
      return p.length === 0 ? { response: { ok: !0, deletedCount: 0 }, message: null } : window.fetch(Et(y.url, y.db, "_bulk_docs"), {
        method: "POST",
        headers: a(y, A),
        credentials: y.credentials,
        body: JSON.stringify({ docs: p })
      }).then((d) => {
        if (!d.ok) throw new Error("HTTP " + d.status + ": " + d.statusText);
        return d.json();
      }).then((d) => {
        const _ = r(d);
        return { response: { ok: !0, results: _.content, deletedCount: p.length }, message: _.message };
      });
    });
  }
  s.prototype.bulkDelete = function(y, E) {
    return u(this, y, E).then((A) => A.response);
  };
  function w(y) {
    y._handlers = {
      sync: function(E) {
        const A = E.detail || {};
        y.fetchDelta(A.since).then(function(m) {
          L(y.dom, "ln-couchdb-connector:fetched", { data: m, since: A.since, meta: A.meta || null });
        }).catch(function(m) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "sync",
            error: m.message,
            status: m.status || 0,
            since: A.since,
            meta: A.meta || null
          });
        });
      },
      create: function(E) {
        const A = E.detail || {};
        n(y, A.data, A.idempotencyKey).then(function(m) {
          L(y.dom, "ln-couchdb-connector:created", { record: m.record, tempId: A.tempId, message: m.message, meta: A.meta || null });
        }).catch(function(m) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "create",
            error: m.message,
            status: m.status || 0,
            tempId: A.tempId,
            meta: A.meta || null
          });
        });
      },
      update: function(E) {
        const A = E.detail || {}, m = Object.assign({}, A.data);
        A.expected_version !== void 0 && (m._rev = A.expected_version), o(y, A.id, m, A.idempotencyKey).then(function(v) {
          L(y.dom, "ln-couchdb-connector:updated", { record: v.record, id: A.id, message: v.message, meta: A.meta || null });
        }).catch(function(v) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "update",
            error: v.message,
            status: v.status || 0,
            id: A.id,
            data: v.status === 409 ? v.data : null,
            conflictData: v.status === 409 ? v.data : null,
            meta: A.meta || null
          });
        });
      },
      delete: function(E) {
        const A = E.detail || {};
        c(y, A.id, A.rev, A.idempotencyKey).then(function(m) {
          L(y.dom, "ln-couchdb-connector:deleted", { response: m.response, id: A.id, message: m.message, meta: A.meta || null });
        }).catch(function(m) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "delete",
            error: m.message,
            status: m.status || 0,
            id: A.id,
            meta: A.meta || null
          });
        });
      },
      bulkDelete: function(E) {
        const A = E.detail || {};
        u(y, A.ids, A.idempotencyKey).then(function(m) {
          L(y.dom, "ln-couchdb-connector:bulk-deleted", { response: m.response, ids: A.ids, message: m.message, meta: A.meta || null });
        }).catch(function(m) {
          L(y.dom, "ln-couchdb-connector:error", {
            action: "bulk-delete",
            error: m.message,
            status: m.status || 0,
            ids: A.ids,
            meta: A.meta || null
          });
        });
      }
    }, y.dom.addEventListener("ln-couchdb-connector:request-sync", y._handlers.sync), y.dom.addEventListener("ln-couchdb-connector:request-create", y._handlers.create), y.dom.addEventListener("ln-couchdb-connector:request-update", y._handlers.update), y.dom.addEventListener("ln-couchdb-connector:request-delete", y._handlers.delete), y.dom.addEventListener("ln-couchdb-connector:request-bulk-delete", y._handlers.bulkDelete);
  }
  s.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const y = this;
    y._handlers && (y.dom.removeEventListener("ln-couchdb-connector:request-sync", y._handlers.sync), y.dom.removeEventListener("ln-couchdb-connector:request-create", y._handlers.create), y.dom.removeEventListener("ln-couchdb-connector:request-update", y._handlers.update), y.dom.removeEventListener("ln-couchdb-connector:request-delete", y._handlers.delete), y.dom.removeEventListener("ln-couchdb-connector:request-bulk-delete", y._handlers.bulkDelete), y._handlers = null), delete this.dom[e], delete this.dom[i];
  }, j(t, e, s, "ln-couchdb-connector", {
    attributes: f
  });
})();
(function() {
  const t = "data-ln-websocket-connector", e = "lnWebsocketConnector";
  if (window[e] !== void 0) return;
  const i = 1e3, l = 3e4;
  function f(c) {
    const u = c[e];
    u && (u.command === "connect" ? u._open() : u._disconnect());
  }
  function h(c) {
    const u = c[e];
    !u || u.command !== "connect" || (u._drop("url-changed"), u._open());
  }
  const r = {
    "data-ln-websocket-connector": { prop: "command", type: "enum", values: ["connect", "disconnect"], fallback: "connect", effect: f, description: "Connection command set from outside: connect or disconnect" },
    "data-ln-websocket-connector-url": { prop: "url", read: $, type: "string", fallback: "", effect: h, description: "WebSocket endpoint URL (ws:// or wss://)" }
  }, s = et(r), a = {
    "ln-websocket-connector:request-sync": "sync",
    "ln-websocket-connector:request-query": "query",
    "ln-websocket-connector:request-create": "create",
    "ln-websocket-connector:request-update": "update",
    "ln-websocket-connector:request-delete": "delete",
    "ln-websocket-connector:request-bulk-delete": "bulk-delete"
  };
  function n(c, u) {
    return c === "sync" ? { since: u.since } : c === "query" ? { query: u.query || {} } : c === "create" ? { data: u.data, idempotencyKey: u.idempotencyKey } : c === "update" ? { id: u.id, data: u.data, expected_version: u.expected_version, idempotencyKey: u.idempotencyKey } : c === "delete" ? { id: u.id, idempotencyKey: u.idempotencyKey } : { ids: u.ids, idempotencyKey: u.idempotencyKey };
  }
  function o(c) {
    this.dom = c, tt(this, c, s), c[e] = this, this._socket = null, this._status = "disconnected", this._attempt = 0, this._timer = null, this._seq = 0, this._pending = /* @__PURE__ */ new Map(), this._held = [];
    const u = this;
    this._onRequest = function(w) {
      u._request(a[w.type], w.detail || {});
    };
    for (const w in a) c.addEventListener(w, this._onRequest);
    return this.command === "connect" && this._open(), this;
  }
  o.prototype._open = function() {
    if (this._socket || this._timer) return;
    const c = this, u = this.url;
    this._attempt++, this._status = "connecting", L(this.dom, "ln-websocket-connector:connecting", { url: u, attempt: this._attempt });
    let w;
    try {
      w = new WebSocket(u);
    } catch (y) {
      this._status = "disconnected", this._attempt = 0, this._failAll(this._held, y.message), this._held = [], L(this.dom, "ln-websocket-connector:disconnected", { url: u, code: 0, reason: y.message, willReconnect: !1 });
      return;
    }
    this._socket = w, w.onopen = function() {
      c._status = "connected", c._attempt = 0, L(c.dom, "ln-websocket-connector:connected", { url: u });
      const y = c._held;
      c._held = [];
      for (let E = 0; E < y.length; E++) c._send(y[E]);
    }, w.onmessage = function(y) {
      c._receive(y.data);
    }, w.onclose = function(y) {
      c._socket = null, c._status = "disconnected", c._failPending("connection closed");
      const E = c.command === "connect";
      L(c.dom, "ln-websocket-connector:disconnected", { url: u, code: y.code, reason: y.reason, willReconnect: E }), E && c._scheduleReconnect();
    };
  }, o.prototype._scheduleReconnect = function() {
    const c = this, u = Math.min(i * Math.pow(2, Math.max(0, this._attempt - 1)), l);
    this._timer = setTimeout(function() {
      c._timer = null, c._open();
    }, u);
  }, o.prototype._drop = function(c) {
    const u = !!(this._socket || this._timer);
    clearTimeout(this._timer), this._timer = null, this._attempt = 0, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, c), this._socket = null), u && (this._status = "disconnected", this._failPending("connection closed"), L(this.dom, "ln-websocket-connector:disconnected", { url: this.url, code: 1e3, reason: c, willReconnect: !1 }));
  }, o.prototype._disconnect = function() {
    this._drop("disconnect"), this._failAll(this._held, "disconnected"), this._held = [];
  }, o.prototype._request = function(c, u) {
    const w = { ref: String(++this._seq), type: c, detail: u };
    this._status === "connected" ? this._send(w) : this.command === "connect" ? this._held.push(w) : this._fail(w, 0, "disconnected", null);
  }, o.prototype._send = function(c) {
    this._pending.set(c.ref, c), this._socket.send(JSON.stringify(Object.assign({ ref: c.ref, type: c.type }, n(c.type, c.detail))));
  }, o.prototype._receive = function(c) {
    let u;
    try {
      u = JSON.parse(c);
    } catch {
      console.warn("[ln-websocket-connector] Ignored a frame that is not JSON:", c);
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
  }, o.prototype._resolve = function(c, u, w) {
    const y = c.detail, E = y.meta || null, A = this.dom;
    if (c.type === "sync")
      L(A, "ln-websocket-connector:fetched", { data: u, since: y.since, meta: E });
    else if (c.type === "query") {
      const m = y.query || {}, v = u || {};
      L(A, "ln-websocket-connector:fetched", {
        data: v.data || [],
        total: v.total,
        filtered: v.filtered,
        offset: m.offset,
        queryGen: m.queryGen,
        meta: E
      });
    } else c.type === "create" ? L(A, "ln-websocket-connector:created", { record: u, tempId: y.tempId, message: w, meta: E }) : c.type === "update" ? L(A, "ln-websocket-connector:updated", { record: u, id: y.id, message: w, meta: E }) : c.type === "delete" ? L(A, "ln-websocket-connector:deleted", { response: u, id: y.id, message: w, meta: E }) : L(A, "ln-websocket-connector:bulk-deleted", { response: u, ids: y.ids, message: w, meta: E });
  }, o.prototype._fail = function(c, u, w, y) {
    const E = c.detail;
    L(this.dom, "ln-websocket-connector:error", {
      action: c.type,
      error: w,
      status: u,
      data: y || null,
      conflictData: u === 409 && y || null,
      since: E.since,
      id: E.id,
      ids: E.ids,
      tempId: E.tempId,
      meta: E.meta || null
    });
  }, o.prototype._failAll = function(c, u) {
    for (let w = 0; w < c.length; w++) this._fail(c[w], 0, u, null);
  }, o.prototype._failPending = function(c) {
    const u = Array.from(this._pending.values());
    this._pending.clear(), this._failAll(u, c);
  }, o.prototype.destroy = function() {
    if (this.dom[e]) {
      for (const c in a) this.dom.removeEventListener(c, this._onRequest);
      clearTimeout(this._timer), this._timer = null, this._socket && (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(1e3, "destroy"), this._socket = null), this._pending.clear(), this._held = [], delete this.dom[e];
    }
  }, j(t, e, o, "ln-websocket-connector", {
    attributes: r
  });
})();
function Vr(t) {
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
  const i = !t || !!t.initializationError, l = !!(t && t.noLocalQuery && !t.windowed);
  return e && (i || !t.canServe || l) ? "remote" : t && !t.initializationError ? "store" : "none";
}
function Yt(t, e, i) {
  return i === "store" && !!e && !(t && t.windowed);
}
function ln(t, e) {
  const i = Object.assign({}, t);
  return e && (i.filters = e.filters, i.search = e.search, i.sort = e.sort), i;
}
class Gr {
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
    const f = this._pending.get(l);
    return f ? (this._pending.delete(l), i ? f.reject(e.error || new Error("Store mutation failed")) : f.resolve(e), !0) : !1;
  }
}
(function() {
  const t = "data-ln-data-coordinator", e = "lnDataCoordinator", i = "data-ln-data-coordinator-scope", l = "data-ln-data-coordinator-search", f = "data-ln-data-coordinator-filters", h = "data-ln-data-coordinator-sort-field", r = "data-ln-data-coordinator-sort-direction";
  if (window[e] !== void 0) return;
  function s(g) {
    const S = g[e];
    S && S.refreshMapper();
  }
  function a(g) {
    const S = g[e];
    S && S._queueQueryRefresh();
  }
  function n(g, S) {
    return g.getAttribute(S) || g.id;
  }
  const o = {
    "data-ln-data-coordinator": { prop: "_name", type: "string", read: n, description: "Coordinator name or identifier for data routing" },
    "data-ln-data-coordinator-scope": { type: "string", description: "Scope name addressing the bound data store and connector" },
    "data-ln-data-coordinator-mapper": { type: "string", effect: s, description: "Name of the registered data mapper transform" },
    "data-ln-data-coordinator-search": { type: "string", effect: a, description: "Active search query term" },
    "data-ln-data-coordinator-filters": { type: "string", effect: a, description: "Active encoded filter parameters" },
    "data-ln-data-coordinator-sort-field": { type: "string", effect: a, description: "Active sort field property name" },
    "data-ln-data-coordinator-sort-direction": { type: "enum", values: ["asc", "desc"], fallback: "asc", effect: a, description: "Sort direction" },
    "data-ln-data-coordinator-stale": { type: "marker", description: "Flag indicating data needs re-synchronization" },
    "data-ln-data-coordinator-no-autosync": { type: "boolean", description: "Disables automatic synchronization upon state changes" },
    "data-ln-data-coordinator-dict": { type: "marker", description: "Marks dictionary container for coordinator translatable messages" }
  }, c = et(o), u = /* @__PURE__ */ new Set();
  let w = !1, y = null, E = null, A = null;
  function m() {
    w || (w = !0, y = function() {
      L(document, "ln-data-coordinator:online", {}), u.forEach(function(g) {
        g._maybeSync();
      });
    }, E = function() {
      L(document, "ln-data-coordinator:offline", {});
    }, A = function() {
      document.visibilityState === "visible" && u.forEach(function(g) {
        const S = g.findChildren(), C = S.store;
        C && S.connector && C.isInitialized && !C.initializationError && !C.isSyncing && !g._noAutosync && (!C.hasCache || g._isStale()) && C.forceSync();
      });
    }, window.addEventListener("online", y), window.addEventListener("offline", E), document.addEventListener("visibilitychange", A));
  }
  function v() {
    w && (u.size > 0 || (window.removeEventListener("online", y), window.removeEventListener("offline", E), document.removeEventListener("visibilitychange", A), y = null, E = null, A = null, w = !1));
  }
  function p() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (S) => {
        const C = Math.random() * 16 | 0;
        return (S === "x" ? C : C & 3 | 8).toString(16);
      });
    }
  }
  const d = ["ln-api-connector", "ln-couchdb-connector", "ln-websocket-connector"];
  function _(g) {
    return g ? g.hasAttribute("data-ln-couchdb-connector") ? "ln-couchdb-connector" : g.hasAttribute("data-ln-websocket-connector") ? "ln-websocket-connector" : "ln-api-connector" : "ln-api-connector";
  }
  function b(g) {
    const S = this;
    return this.dom = g, tt(this, g, c), this._name || console.warn("[ln-data-coordinator] missing id — the coordinator cannot be addressed", g), g[e] = this, this._destroyed = !1, this.mapper = null, this._handlers = null, this._boundQueries = /* @__PURE__ */ new WeakMap(), this._boundDelivered = /* @__PURE__ */ new WeakMap(), this._queryGens = /* @__PURE__ */ new WeakMap(), this._mutationReceipts = new Gr(), this._dict = xe(g, "data-ln-data-coordinator-dict"), this._queueQueryRefresh = oe(function() {
      S._destroyed || S._refreshAll(null, !0);
    }), this.refreshConfig(), T(this), u.add(this), m(), this._checkInitialSync(), this;
  }
  Object.defineProperty(b.prototype, "_staleThreshold", {
    get: function() {
      const S = this.findChildren().storeEl, C = this.dom.getAttribute("data-ln-data-coordinator-stale") || (S ? S.getAttribute("data-ln-data-store-stale") : null);
      if (C === "never" || C === "-1") return -1;
      const q = parseInt(C, 10);
      return isNaN(q) ? 300 : q;
    }
  }), Object.defineProperty(b.prototype, "_noAutosync", {
    get: function() {
      const S = this.findChildren().storeEl;
      return this.dom.hasAttribute("data-ln-data-coordinator-no-autosync") || (S ? S.hasAttribute("data-ln-data-store-no-autosync") : !1);
    }
  }), b.prototype.refreshConfig = function() {
    this.refreshMapper();
  }, b.prototype._isStale = function() {
    if (this._staleThreshold === -1) return !1;
    const S = this.findChildren().store;
    return !S || !S.lastSyncedAt ? !0 : Date.now() / 1e3 - S.lastSyncedAt > this._staleThreshold;
  }, b.prototype._maybeSync = function() {
    const g = this.findChildren(), S = g.store;
    !S || S.initializationError || !g.connector || this._noAutosync || !S.isInitialized || S.isSyncing || (!S.hasCache || this._isStale()) && S.forceSync();
  }, b.prototype._checkInitialSync = function() {
    const g = this, C = this.findChildren().store;
    C && Promise.resolve(C.ready).then(function() {
      if (g._destroyed) return;
      const q = g.findChildren(), D = q.store;
      if (D && D.initializationError) {
        g._reportReconciliationError("store-initialize", D.initializationError, null);
        return;
      }
      !D || !q.connector || g._noAutosync || D.isSyncing || (!D.hasCache || g._isStale()) && D.forceSync();
    }).catch(function(q) {
      g._destroyed || g._reportReconciliationError("store-initialize", q, null);
    });
  }, b.prototype.refreshMapper = function() {
    this.mapper = null, this.dom.querySelector("script[data-ln-mapper]") && console.error("[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.");
    const S = this.dom.getAttribute("data-ln-data-coordinator-mapper") || this.dom.id;
    S && window.lnCore && typeof window.lnCore.getDataMapper == "function" && (this.mapper = window.lnCore.getDataMapper(S)), this.mapper || (this.mapper = {}), typeof this.mapper.ingress != "function" && (this.mapper.ingress = function(C) {
      return C;
    }), typeof this.mapper.egress != "function" && (this.mapper.egress = function(C) {
      return C;
    });
  }, b.prototype.findChildren = function() {
    const g = this.dom.querySelector("[data-ln-data-store]"), S = this.dom.querySelector("[data-ln-api-connector], [data-ln-couchdb-connector]") || this.dom.querySelector("[data-ln-websocket-connector]"), C = this.dom.querySelector("[data-ln-api-queue]");
    return {
      storeEl: g,
      connectorEl: S,
      queueEl: C,
      store: g ? g.lnDataStore : null,
      connector: S ? S.lnApiConnector || S.lnCouchDbConnector || S.lnWebsocketConnector : null,
      queue: C ? C.lnApiQueue : null
    };
  }, b.prototype._handleSubmitRecord = function(g) {
    const S = this.findChildren();
    if (!S.storeEl && !S.connectorEl) {
      console.warn('[ln-data-coordinator] form submit claimed but neither [data-ln-data-store] nor a connector child found in "' + (this._name || "") + '"');
      return;
    }
    const C = g.data || {}, q = C.id, D = C.expected_version, I = Object.assign({}, C);
    delete I.id, delete I.expected_version;
    const R = g.method.toUpperCase();
    R === "POST" ? this._fanOutCreate(S, I, g.action) : (R === "PUT" || R === "PATCH") && this._fanOutUpdate(S, q, I, D, g.action);
  }, b.prototype._fanOutCreate = function(g, S, C) {
    this.refreshMapper();
    const q = "_temp_" + p();
    g.storeEl && L(g.storeEl, "ln-data-store:request-create", { tempId: q, data: S }), g.queue ? L(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: q,
      op: "create",
      targetId: null,
      payload: this.mapper.egress(S),
      expectedVersion: null,
      meta: { tempId: q, action: C }
    }) : g.connector && L(g.connectorEl, _(g.connectorEl) + ":request-create", {
      data: this.mapper.egress(S),
      url: C,
      meta: { entryId: p(), queued: !1, op: "create", tempId: q }
    });
  }, b.prototype._fanOutUpdate = function(g, S, C, q, D) {
    this.refreshMapper(), g.storeEl && L(g.storeEl, "ln-data-store:request-update", { id: S, data: C }), g.queue ? L(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: S,
      op: "update",
      targetId: S,
      payload: this.mapper.egress(C),
      expectedVersion: q,
      meta: { id: S, action: D }
    }) : g.connector && L(g.connectorEl, _(g.connectorEl) + ":request-update", {
      id: S,
      data: this.mapper.egress(C),
      expected_version: q,
      url: D,
      meta: { entryId: p(), queued: !1, op: "update", id: S }
    });
  }, b.prototype._fanOutDelete = function(g, S) {
    this.refreshMapper(), g.storeEl && L(g.storeEl, "ln-data-store:request-delete", { id: S }), g.queue ? L(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: S,
      op: "delete",
      targetId: S,
      payload: null,
      expectedVersion: null,
      meta: { id: S }
    }) : g.connector && L(g.connectorEl, _(g.connectorEl) + ":request-delete", {
      id: S,
      meta: { entryId: p(), queued: !1, op: "delete", id: S }
    });
  }, b.prototype._fanOutBulkDelete = function(g, S) {
    this.refreshMapper();
    const C = S.join(",");
    g.storeEl && L(g.storeEl, "ln-data-store:request-bulk-delete", { ids: S }), g.queue ? L(g.queueEl, "ln-api-queue:request-enqueue", {
      chainKey: C,
      op: "bulk-delete",
      targetId: null,
      payload: { ids: S },
      expectedVersion: null,
      meta: { bulkKey: C, ids: S }
    }) : g.connector && L(g.connectorEl, _(g.connectorEl) + ":request-bulk-delete", {
      ids: S,
      meta: { entryId: p(), queued: !1, op: "bulk-delete", bulkKey: C }
    });
  }, b.prototype._toastFromMessage = function(g) {
    g && L(window, "ln-toast:enqueue", {
      type: g.type || "success",
      title: g.title || "",
      message: g.body || ""
    });
  }, b.prototype._toastFromDict = function(g) {
    const S = this._dict[g];
    S && L(window, "ln-toast:enqueue", { type: "error", title: "", message: S });
  }, b.prototype._requestStoreMutation = function(g, S, C) {
    const q = g.storeEl;
    if (!q) return Promise.reject(new Error("Store element not found"));
    const D = p(), I = this._mutationReceipts.wait(D);
    return L(q, "ln-data-store:request-" + S, Object.assign({}, C, { requestId: D })), I;
  }, b.prototype._reportReconciliationError = function(g, S, C) {
    this._destroyed || L(this.dom, "ln-data-coordinator:error", {
      operation: g,
      error: S,
      meta: C || null
    });
  };
  function T(g) {
    g._handlers = {
      sync: function(S) {
        g.refreshMapper();
        const C = g.findChildren();
        if (!C.store || !C.connector) {
          console.warn("[ln-data-coordinator] Cannot sync: store or connector not found in subtree");
          return;
        }
        L(C.connectorEl, _(C.connectorEl) + ":request-sync", { since: S.detail.since, meta: { op: "sync" } });
      },
      requestPage: function(S) {
        const C = g.findChildren();
        if (!C.connectorEl) return;
        const q = S.detail || {};
        L(C.connectorEl, _(C.connectorEl) + ":request-query", {
          query: Object.assign({}, q.query, {
            offset: q.offset,
            limit: q.limit,
            queryGen: q.queryGen
          })
        });
      },
      reqCreate: function(S) {
        const C = g.findChildren();
        g._fanOutCreate(C, S.detail.data || {}, S.detail.action);
      },
      reqUpdate: function(S) {
        const C = g.findChildren();
        g._fanOutUpdate(C, S.detail.id, S.detail.data || {}, S.detail.expected_version, S.detail.action);
      },
      reqDelete: function(S) {
        const C = g.findChildren();
        g._fanOutDelete(C, S.detail.id);
      },
      reqBulkDelete: function(S) {
        const C = g.findChildren();
        g._fanOutBulkDelete(C, S.detail.ids || []);
      },
      queueFailed: function() {
        g._toastFromDict("network");
      },
      // ─── Queue Transport Executor ─────────────────────────
      queueSend: function(S) {
        g.refreshMapper();
        const C = g.findChildren();
        if (!C.store || !C.connector || !C.queue) return;
        const q = S.detail || {}, D = q.entryId, I = q.op, R = q.targetId, O = q.payload, P = q.expectedVersion, B = q.meta || {}, H = B.action || null, z = q.idempotencyKey || D;
        I === "create" ? L(C.connectorEl, _(C.connectorEl) + ":request-create", {
          data: O,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "create", tempId: B.tempId }
        }) : I === "update" ? L(C.connectorEl, _(C.connectorEl) + ":request-update", {
          id: R,
          data: O,
          expected_version: P,
          url: H,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "update", id: R }
        }) : I === "delete" ? L(C.connectorEl, _(C.connectorEl) + ":request-delete", {
          id: R,
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "delete", id: R }
        }) : I === "bulk-delete" ? L(C.connectorEl, _(C.connectorEl) + ":request-bulk-delete", {
          ids: O && O.ids ? O.ids : [],
          idempotencyKey: z,
          meta: { entryId: D, queued: !0, op: "bulk-delete", bulkKey: B.bulkKey }
        }) : console.warn("[ln-data-coordinator] Unknown queue op:", I);
      },
      // ─── Form Write Intake — native submit, bubble phase ──────
      formSubmit: function(S) {
        const C = S.target;
        if (S.defaultPrevented) return;
        const q = C.hasAttribute(i) ? C.getAttribute(i) : null;
        if (q === null) return;
        let D;
        if (q ? D = g._owns(q) : D = C.closest("[data-ln-data-coordinator]") === g.dom, !D) return;
        const I = Li(C);
        if (I !== "POST" && I !== "PUT" && I !== "PATCH") return;
        S.preventDefault();
        const R = mn(C);
        delete R._method, delete R._token, g._handleSubmitRecord({ data: R, method: I, action: C.getAttribute("action") || "" });
      },
      // ─── Connector Response Handlers (direct + queued paths) ──
      connFetched: function(S) {
        const C = S.detail.meta || {}, q = g.findChildren();
        g.refreshMapper();
        const D = S.detail.data;
        let I = [], R = [], O = null;
        Array.isArray(D) ? (I = D, O = Math.floor(Date.now() / 1e3)) : D && (I = Array.isArray(D.data) ? D.data : [], R = Array.isArray(D.deleted) ? D.deleted : [], O = D.synced_at !== void 0 ? D.synced_at : D.since !== void 0 ? D.since : null);
        const P = I.map((B) => g.mapper.ingress(B));
        if (q.store && !q.store.initializationError)
          C.kind ? C.kind === "table" || C.kind === "list" || C.kind === "chart" ? q.store.applyQuery(P, { total: S.detail.total }).then(function(B) {
            C.queryGen != null && !g._isCurrentGen(C.targetEl, C.queryGen) || (L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: B,
              total: S.detail.total !== void 0 ? S.detail.total : B.length,
              filtered: S.detail.filtered !== void 0 ? S.detail.filtered : B.length,
              offset: S.detail.offset,
              queryGen: S.detail.queryGen
            }), g._boundDelivered.set(C.targetEl, !0));
          }) : C.kind === "options" ? q.store.applyQuery(P, { total: S.detail.total }).then(function() {
            return q.store.getAll({});
          }).then(function(B) {
            C.queryGen != null && !g._isCurrentGen(C.targetEl, C.queryGen) || L(C.targetEl, "ln-options:set-data", { data: B.data });
          }) : C.kind === "stat" && q.store.applyQuery(P, { total: S.detail.total }).then(function() {
            if (C.queryGen != null && !g._isCurrentGen(C.targetEl, C.queryGen)) return;
            const B = S.detail.filtered !== void 0 ? S.detail.filtered : S.detail.total !== void 0 ? S.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }) : q.store.applySync(P, R, O || Math.floor(Date.now() / 1e3), {
            total: S.detail.total,
            filtered: S.detail.filtered,
            offset: S.detail.offset,
            queryGen: S.detail.queryGen,
            targetEl: C.targetEl
          });
        else if (C.targetEl && C.kind) {
          if (C.kind === "table" || C.kind === "list" || C.kind === "chart")
            L(C.targetEl, "ln-" + C.kind + ":set-loading", { loading: !1 }), L(C.targetEl, "ln-" + C.kind + ":set-data", {
              data: P,
              total: S.detail.total !== void 0 ? S.detail.total : P.length,
              filtered: S.detail.filtered !== void 0 ? S.detail.filtered : P.length,
              offset: S.detail.offset,
              queryGen: S.detail.queryGen
            }), g._boundDelivered.set(C.targetEl, !0);
          else if (C.kind === "options")
            L(C.targetEl, "ln-options:set-data", { data: P });
          else if (C.kind === "stat") {
            const B = S.detail.filtered !== void 0 ? S.detail.filtered : S.detail.total !== void 0 ? S.detail.total : P.length;
            L(C.targetEl, "ln-stat:set-count", { count: B });
          }
        }
      },
      connCreated: function(S) {
        const C = g.findChildren(), q = S.detail.meta || {}, D = g.mapper.ingress(S.detail.record);
        (C.storeEl ? g._requestStoreMutation(C, "update", { id: q.tempId, data: D }) : Promise.resolve()).then(function() {
          g._toastFromMessage(S.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:resolve-create", {
            entryId: q.entryId,
            oldKey: q.tempId,
            newId: D.id
          });
        }).catch(function(R) {
          g._reportReconciliationError("create-reconcile", R, q);
        });
      },
      connUpdated: function(S) {
        const C = g.findChildren(), q = S.detail.meta || {}, D = g.mapper.ingress(S.detail.record);
        (C.storeEl ? g._requestStoreMutation(C, "update", { id: q.id, data: D }) : Promise.resolve()).then(function() {
          g._toastFromMessage(S.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
        }).catch(function(R) {
          g._reportReconciliationError("update-reconcile", R, q);
        });
      },
      connDeleted: function(S) {
        const C = g.findChildren(), q = S.detail.meta || {};
        g._toastFromMessage(S.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connBulkDeleted: function(S) {
        const C = g.findChildren(), q = S.detail.meta || {};
        g._toastFromMessage(S.detail.message), q.queued && C.queue && L(C.queueEl, "ln-api-queue:ack", { entryId: q.entryId });
      },
      connError: function(S) {
        const C = S.detail || {}, q = C.meta || {}, D = q.op || C.action, I = C.status || C.error && C.error.status || 0, R = g.findChildren();
        if (D === "sync") {
          R.storeEl && L(R.storeEl, "ln-data-store:request-sync-failed", {
            error: C.error,
            status: I
          }), console.error("[ln-data-coordinator] Sync failed:", C.error);
          return;
        }
        if (D === "query") {
          q.targetEl && q.kind && (L(q.targetEl, "ln-" + q.kind + ":set-loading", { loading: !1 }), (q.kind === "table" || q.kind === "list") && L(q.targetEl, "ln-" + q.kind + ":page-failed", { offset: q.offset })), g._reportReconciliationError("query", C.error || C, q);
          return;
        }
        const O = I === 401 || I === 419, P = I === 0 || I >= 500, B = I === 409 || I === 412;
        if (O) {
          g._toastFromDict("auth"), q.queued && R.queue && L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "auth" });
          return;
        }
        if (P) {
          q.queued && R.queue ? L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "retry" }) : g._toastFromDict("network");
          return;
        }
        let H = Promise.resolve();
        if (B && D === "update") {
          const z = C.data && C.data.remote ? g.mapper.ingress(C.data.remote) : null;
          z && R.storeEl && (H = g._requestStoreMutation(R, "update", { id: q.id, data: z })), g._toastFromDict("conflict");
        } else D === "create" && R.storeEl && (H = g._requestStoreMutation(R, "delete", { id: q.tempId })), g._toastFromDict("rejected");
        q.queued && R.queue ? H.then(function() {
          L(R.queueEl, "ln-api-queue:nack", { entryId: q.entryId, reason: "drop" });
        }).catch(function(z) {
          g._reportReconciliationError("deterministic-reconcile", z, q);
        }) : H.catch(function(z) {
          g._reportReconciliationError("deterministic-reconcile", z, q);
        });
      },
      // ─── Store Initialized (Sync Ownership) ───────────────
      storeInitialized: function(S) {
        const C = g.findChildren(), q = C.store;
        if (!q || q.initializationError || !C.connector || g._noAutosync || q.isSyncing) return;
        (S.detail || {}).hasCache ? g._isStale() && q.forceSync() : q.forceSync();
      },
      // A (re)opened socket may have missed pushes — catch up with a delta
      // sync over whichever connector takes requests.
      socketConnected: function() {
        const S = g.findChildren(), C = S.store;
        !C || C.initializationError || !S.connector || g._noAutosync || !C.isInitialized || C.isSyncing || C.forceSync();
      },
      // ─── View Binder Handlers ─────────────────────────────
      reqTableData: function(S) {
        g._serveData(S, "table");
      },
      reqListData: function(S) {
        g._serveData(S, "list");
      },
      reqChartData: function(S) {
        g._serveData(S, "chart");
      },
      reqOptions: function(S) {
        g._serveOptions(S);
      },
      reqStat: function(S) {
        g._serveStat(S);
      },
      refreshQuery: function() {
        g._refreshAll(null, !0);
      },
      refresh: function(S) {
        g._mutationReceipts.resolve(S.detail), g._refreshAll(null, !1);
      },
      mutationError: function(S) {
        g._mutationReceipts.reject(S.detail);
      },
      refreshSynced: function(S) {
        S.detail && S.detail.changed && g._refreshAll(S.detail.meta, !1);
      },
      searchChange: function(S) {
        S.preventDefault();
        const C = S.detail && S.detail.term != null ? S.detail.term : "";
        C !== (g.dom.getAttribute(l) || "") && g.dom.setAttribute(l, C);
      },
      filterChange: function(S) {
        S.preventDefault();
        const C = S.detail && S.detail.key;
        if (!C) return;
        const q = (S.detail.values || []).slice(), D = g._currentQuery().filters, I = D[C];
        if (I ? I.length === q.length && I.every((B, H) => B === q[H]) : !q.length) return;
        q.length ? D[C] = q : delete D[C];
        const O = new URLSearchParams();
        Object.keys(D).forEach(function(B) {
          D[B].forEach(function(H) {
            O.append(B, H);
          });
        });
        const P = O.toString();
        P ? g.dom.setAttribute(f, P) : g.dom.removeAttribute(f);
      },
      sortChange: function(S) {
        S.preventDefault();
        const C = S.detail && S.detail.field, q = S.detail && S.detail.direction, D = C && q && q !== "none" ? { field: C, direction: q } : null, I = g._currentQuery().sort;
        !I && !D || I && D && I.field === D.field && I.direction === D.direction || (D ? (g.dom.setAttribute(h, D.field), g.dom.setAttribute(r, D.direction)) : (g.dom.removeAttribute(h), g.dom.removeAttribute(r)));
      }
    }, g.dom.addEventListener("ln-data-store:request-remote-sync", g._handlers.sync), g.dom.addEventListener("ln-data-store:request-page", g._handlers.requestPage), g.dom.addEventListener("ln-data-coordinator:request-create", g._handlers.reqCreate), g.dom.addEventListener("ln-data-coordinator:request-update", g._handlers.reqUpdate), g.dom.addEventListener("ln-data-coordinator:request-delete", g._handlers.reqDelete), g.dom.addEventListener("ln-data-coordinator:request-bulk-delete", g._handlers.reqBulkDelete), g.dom.addEventListener("ln-api-queue:send", g._handlers.queueSend), g.dom.addEventListener("ln-api-queue:failed", g._handlers.queueFailed), g.dom.addEventListener("ln-data-store:initialized", g._handlers.storeInitialized), g.dom.addEventListener("ln-websocket-connector:connected", g._handlers.socketConnected), document.addEventListener("submit", g._handlers.formSubmit), d.forEach(function(S) {
      g.dom.addEventListener(S + ":fetched", g._handlers.connFetched), g.dom.addEventListener(S + ":created", g._handlers.connCreated), g.dom.addEventListener(S + ":updated", g._handlers.connUpdated), g.dom.addEventListener(S + ":deleted", g._handlers.connDeleted), g.dom.addEventListener(S + ":bulk-deleted", g._handlers.connBulkDeleted), g.dom.addEventListener(S + ":error", g._handlers.connError);
    }), document.addEventListener("ln-table:request-data", g._handlers.reqTableData), document.addEventListener("ln-list:request-data", g._handlers.reqListData), document.addEventListener("ln-chart:request-data", g._handlers.reqChartData), document.addEventListener("ln-options:request-data", g._handlers.reqOptions), document.addEventListener("ln-stat:request-count", g._handlers.reqStat), g.dom.addEventListener("ln-data-store:ready", g._handlers.refresh), g.dom.addEventListener("ln-data-store:created", g._handlers.refresh), g.dom.addEventListener("ln-data-store:updated", g._handlers.refresh), g.dom.addEventListener("ln-data-store:deleted", g._handlers.refresh), g.dom.addEventListener("ln-data-store:mutation-error", g._handlers.mutationError), g.dom.addEventListener("ln-data-store:synced", g._handlers.refreshSynced), g.dom.addEventListener("ln-data-store:query-changed", g._handlers.refreshQuery), g.dom.addEventListener("ln-search:change", g._handlers.searchChange), g.dom.addEventListener("ln-filter:change", g._handlers.filterChange), g.dom.addEventListener("ln-sort:change", g._handlers.sortChange);
  }
  b.prototype._owns = function(g) {
    return !!g && g === this._name;
  }, b.prototype._currentQuery = function() {
    const g = this.dom.getAttribute(h), S = this.dom.getAttribute(r), C = new URLSearchParams(this.dom.getAttribute(f) || ""), q = {};
    for (const D of new Set(C.keys())) q[D] = C.getAll(D);
    return {
      search: this.dom.getAttribute(l) || "",
      filters: q,
      sort: g && S ? { field: g, direction: S } : null
    };
  }, b.prototype._nextQueryGen = function(g) {
    const S = (this._queryGens.get(g) || 0) + 1;
    return this._queryGens.set(g, S), S;
  }, b.prototype._isCurrentGen = function(g, S) {
    return this._queryGens.get(g) === S;
  }, b.prototype._serveData = function(g, S) {
    const C = g.target, q = S === "table" ? "data-ln-table-source" : S === "list" ? "data-ln-list-source" : "data-ln-chart-source", D = C.getAttribute(q);
    if (!D || !this._owns(D)) return;
    const I = g.detail || {}, R = Vr(I);
    this._boundQueries.set(C, R);
    const O = this.findChildren(), P = this, B = O.store;
    return (B && B.ready ? B.ready : Promise.resolve()).then(function() {
      if (P._destroyed) return;
      const z = Bt(B, O.connector), Q = ln(R, P._currentQuery());
      if (z === "remote") {
        const W = P._nextQueryGen(C);
        L(C, "ln-" + S + ":set-loading", { loading: !0 }), L(O.connectorEl, _(O.connectorEl) + ":request-query", {
          query: Q,
          meta: { targetEl: C, kind: S, offset: Q.offset, limit: Q.limit, queryGen: W }
        });
        return;
      }
      if (z !== "store") {
        L(C, "ln-" + S + ":set-loading", { loading: !1 });
        return;
      }
      const Y = Yt(B, O.connector, z), X = Y ? P._nextQueryGen(C) : null;
      return Y && L(O.connectorEl, _(O.connectorEl) + ":request-query", {
        query: Q,
        meta: { targetEl: C, kind: S, offset: Q.offset, limit: Q.limit, queryGen: X }
      }), B.getAll(Q).then(function(W) {
        if (P._destroyed || !P._boundDelivered || Y && !P._isCurrentGen(C, X)) return;
        const G = {
          data: W.data,
          total: W.total,
          filtered: W.filtered,
          offset: I.offset !== void 0 ? I.offset : W.offset,
          queryGen: I.queryGen !== void 0 ? I.queryGen : W.queryGen,
          // The store answered from its own records while the server query
          // is still out; the view renders it but keeps the refresh showing.
          provisional: Y || W.provisional === !0
        };
        L(C, "ln-" + S + ":set-data", G), P._boundDelivered.set(C, !0);
      });
    }).catch(function(z) {
      P._destroyed || (L(C, "ln-" + S + ":set-loading", { loading: !1 }), L(P.dom, "ln-data-coordinator:error", {
        operation: "query",
        kind: S,
        store: D,
        target: C,
        error: z
      }));
    });
  }, b.prototype._serveOptions = function(g) {
    const S = g.target, C = S.getAttribute("data-ln-options");
    if (!this._owns(C)) return;
    const q = this.findChildren(), D = q.store, I = D && D.ready ? D.ready : Promise.resolve(), R = this;
    return I.then(function() {
      if (R._destroyed) return;
      const O = Bt(D, q.connector);
      if (O === "remote") {
        const H = R._nextQueryGen(S);
        L(q.connectorEl, _(q.connectorEl) + ":request-query", {
          query: {},
          meta: { targetEl: S, kind: "options", queryGen: H }
        });
        return;
      }
      if (O !== "store") return;
      const P = Yt(D, q.connector, O), B = P ? R._nextQueryGen(S) : null;
      return P && L(q.connectorEl, _(q.connectorEl) + ":request-query", {
        query: {},
        meta: { targetEl: S, kind: "options", queryGen: B }
      }), D.getAll({}).then(function(H) {
        R._destroyed || P && !R._isCurrentGen(S, B) || L(S, "ln-options:set-data", { data: H.data });
      });
    }).catch(function(O) {
      R._destroyed || R._reportReconciliationError("options-query", O, { targetEl: S, kind: "options" });
    });
  }, b.prototype._serveStat = function(g) {
    const S = g.target, C = S.getAttribute("data-ln-stat");
    if (!this._owns(C)) return;
    const q = g.detail && g.detail.filters ? g.detail.filters : null, D = this.findChildren(), I = D.store, R = I && I.ready ? I.ready : Promise.resolve(), O = this;
    return R.then(function() {
      if (O._destroyed) return;
      const P = q && Object.keys(q).length > 0, B = !!(D.connector && I && (I.windowed && P || I.noLocalQuery)), H = B ? "remote" : Bt(I, D.connector);
      if (H === "remote") {
        const Y = O._nextQueryGen(S);
        L(D.connectorEl, _(D.connectorEl) + ":request-query", {
          query: { filters: q },
          meta: { targetEl: S, kind: "stat", queryGen: Y }
        });
        return;
      }
      if (H !== "store") return;
      const z = !B && Yt(I, D.connector, H), Q = z ? O._nextQueryGen(S) : null;
      return z && L(D.connectorEl, _(D.connectorEl) + ":request-query", {
        query: { filters: q },
        meta: { targetEl: S, kind: "stat", queryGen: Q }
      }), I.count(q).then(function(Y) {
        O._destroyed || z && !O._isCurrentGen(S, Q) || L(S, "ln-stat:set-count", { count: Y });
      });
    }).catch(function(P) {
      O._destroyed || O._reportReconciliationError("stat-query", P, { targetEl: S, kind: "stat" });
    });
  }, b.prototype._refreshAll = function(g, S) {
    const C = this, q = document.querySelectorAll("[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]");
    for (let D = 0; D < q.length; D++) {
      const I = q[D];
      let R, O;
      if (I.hasAttribute("data-ln-table-source") ? (R = I.getAttribute("data-ln-table-source"), O = "table") : I.hasAttribute("data-ln-list-source") ? (R = I.getAttribute("data-ln-list-source"), O = "list") : I.hasAttribute("data-ln-chart-source") ? (R = I.getAttribute("data-ln-chart-source"), O = "chart") : I.hasAttribute("data-ln-options") ? (R = I.getAttribute("data-ln-options"), O = "options") : I.hasAttribute("data-ln-stat") && (R = I.getAttribute("data-ln-stat"), O = "stat"), !C._owns(R)) continue;
      const P = C.findChildren(), B = P.store;
      if (O === "table" || O === "list") {
        const H = O === "table" ? "data-ln-table-window" : "data-ln-list-window";
        if (I.hasAttribute(H)) {
          L(I, "ln-" + O + (S ? ":request-invalidate" : ":request-revalidate"), {});
          continue;
        }
      }
      if (O === "table" || O === "list" || O === "chart") {
        const H = C._boundQueries.get(I) || { sort: null, filters: {}, search: "" }, z = ln(H, C._currentQuery());
        if (Bt(B, P.connector) === "remote") {
          const X = C._nextQueryGen(I);
          L(I, "ln-" + O + ":set-loading", { loading: !0 }), L(P.connectorEl, _(P.connectorEl) + ":request-query", {
            query: z,
            meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: X }
          });
          continue;
        }
        const Q = Yt(B, P.connector, Bt(B, P.connector)), Y = Q ? C._nextQueryGen(I) : null;
        Q && L(P.connectorEl, _(P.connectorEl) + ":request-query", {
          query: z,
          meta: { targetEl: I, kind: O, offset: z.offset, limit: z.limit, queryGen: Y }
        }), (function(X, W, G, ut) {
          B.getAll(z).then(function(_t) {
            if (C._destroyed || !C._boundDelivered || G && !C._isCurrentGen(X, ut)) return;
            const se = {
              data: _t.data,
              total: g && g.total !== void 0 ? g.total : _t.total,
              filtered: g && g.filtered !== void 0 ? g.filtered : _t.filtered,
              offset: _t.offset !== void 0 ? _t.offset : g && g.offset !== void 0 ? g.offset : H.offset,
              queryGen: _t.queryGen !== void 0 ? _t.queryGen : g && g.queryGen !== void 0 ? g.queryGen : H.queryGen
            };
            L(X, "ln-" + W + ":set-loading", { loading: !1 }), L(X, "ln-" + W + ":set-data", se), C._boundDelivered.set(X, !0);
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
  }, b.prototype.destroy = function() {
    if (!this.dom[e]) return;
    this._destroyed = !0;
    const g = this;
    g._handlers && (g.dom.removeEventListener("ln-data-store:request-remote-sync", g._handlers.sync), g.dom.removeEventListener("ln-data-store:request-page", g._handlers.requestPage), g.dom.removeEventListener("ln-data-coordinator:request-create", g._handlers.reqCreate), g.dom.removeEventListener("ln-data-coordinator:request-update", g._handlers.reqUpdate), g.dom.removeEventListener("ln-data-coordinator:request-delete", g._handlers.reqDelete), g.dom.removeEventListener("ln-data-coordinator:request-bulk-delete", g._handlers.reqBulkDelete), g.dom.removeEventListener("ln-api-queue:send", g._handlers.queueSend), g.dom.removeEventListener("ln-api-queue:failed", g._handlers.queueFailed), g.dom.removeEventListener("ln-data-store:initialized", g._handlers.storeInitialized), g.dom.removeEventListener("ln-websocket-connector:connected", g._handlers.socketConnected), document.removeEventListener("submit", g._handlers.formSubmit), d.forEach(function(S) {
      g.dom.removeEventListener(S + ":fetched", g._handlers.connFetched), g.dom.removeEventListener(S + ":created", g._handlers.connCreated), g.dom.removeEventListener(S + ":updated", g._handlers.connUpdated), g.dom.removeEventListener(S + ":deleted", g._handlers.connDeleted), g.dom.removeEventListener(S + ":bulk-deleted", g._handlers.connBulkDeleted), g.dom.removeEventListener(S + ":error", g._handlers.connError);
    }), document.removeEventListener("ln-table:request-data", g._handlers.reqTableData), document.removeEventListener("ln-list:request-data", g._handlers.reqListData), document.removeEventListener("ln-chart:request-data", g._handlers.reqChartData), document.removeEventListener("ln-options:request-data", g._handlers.reqOptions), document.removeEventListener("ln-stat:request-count", g._handlers.reqStat), g.dom.removeEventListener("ln-data-store:ready", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:created", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:updated", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:deleted", g._handlers.refresh), g.dom.removeEventListener("ln-data-store:mutation-error", g._handlers.mutationError), g.dom.removeEventListener("ln-data-store:synced", g._handlers.refreshSynced), g.dom.removeEventListener("ln-data-store:query-changed", g._handlers.refreshQuery), g.dom.removeEventListener("ln-search:change", g._handlers.searchChange), g.dom.removeEventListener("ln-filter:change", g._handlers.filterChange), g.dom.removeEventListener("ln-sort:change", g._handlers.sortChange), g._handlers = null), g._boundQueries = null, g._boundDelivered = null, g._queryGens = null, g._queueQueryRefresh = null, g._mutationReceipts.close(new Error("Data coordinator destroyed")), g._mutationReceipts = null, u.delete(this), v(), delete this.dom[e];
  }, j(t, e, b, "ln-data-coordinator", {
    attributes: o
  });
})();
const $r = "ln_api_queue", Qr = 2, rt = "outbox", at = "_queue_meta";
function dt(t, e) {
  return t.error || new Error(e);
}
function Rt(t, e) {
  return t.bound([e, -1 / 0], [e, 1 / 0]);
}
function cn(t) {
  return "seq:" + t;
}
function Jt(t) {
  return "paused:" + t;
}
function dn(t) {
  t.leaseOwner = null, t.leaseUntil = 0;
}
function Xr(t, e, i) {
  return typeof t != "string" || t.indexOf(e) === -1 ? t : t.split(e).join(i);
}
function Yr(t, e, i, l) {
  const f = /* @__PURE__ */ new Map(), h = [], r = [];
  for (const s of t || [])
    f.has(s.chainKey) || f.set(s.chainKey, []), f.get(s.chainKey).push(s);
  return f.forEach((s, a) => {
    s.sort((o, c) => o.seq - c.seq);
    const n = s[0];
    if (!(!n || n.status === "failed")) {
      if (n.status === "inflight" && (n.leaseUntil || 0) > l) {
        r.push({ chainKey: a, at: n.leaseUntil });
        return;
      }
      if ((n.nextAttemptAt || 0) > l) {
        r.push({ chainKey: a, at: n.nextAttemptAt });
        return;
      }
      n.status = "inflight", n.leaseOwner = e, n.leaseUntil = l + i, n.updatedAt = l, h.push(n);
    }
  }), { entries: h, wakeups: r };
}
function Jr(t, e, i, l, f) {
  const h = [], r = [];
  for (const s of t || []) {
    if (s.entryId === e) {
      r.push(s.entryId);
      continue;
    }
    s.chainKey === i && (s.chainKey = l, s.targetId === i && (s.targetId = l), s.meta && s.meta.id === i && (s.meta.id = l), s.meta && typeof s.meta.action == "string" && (s.meta.action = Xr(s.meta.action, i, l)), s.updatedAt = f, h.push(s));
  }
  return { changed: h, deleted: r };
}
class Zr {
  constructor(e) {
    e = e || {}, this.indexedDB = e.indexedDB || globalThis.indexedDB, this.keyRange = e.IDBKeyRange || globalThis.IDBKeyRange, this.dbName = e.dbName || $r, this.now = e.now || (() => Date.now()), this.uuid = e.uuid || (() => crypto.randomUUID()), this._db = null, this._ready = null;
  }
  open() {
    return this._ready ? this._ready : !this.indexedDB || !this.keyRange ? Promise.resolve(null) : (this._ready = new Promise((e, i) => {
      const l = this.indexedDB.open(this.dbName, Qr);
      l.onupgradeneeded = (f) => {
        const h = f.target.result;
        let r;
        h.objectStoreNames.contains(rt) ? r = f.target.transaction.objectStore(rt) : r = h.createObjectStore(rt, { keyPath: "entryId" }), r.indexNames.contains("by_scope_chain") || r.createIndex("by_scope_chain", ["scope", "chainKey"], { unique: !1 }), r.indexNames.contains("by_scope_seq") || r.createIndex("by_scope_seq", ["scope", "seq"], { unique: !1 }), h.objectStoreNames.contains(at) || h.createObjectStore(at, { keyPath: "key" });
      }, l.onerror = () => i(dt(l, "Queue database open failed")), l.onsuccess = (f) => {
        this._db = f.target.result, this._db.onversionchange = () => this.close(), e(this._db);
      };
    }), this._ready);
  }
  close() {
    this._db && this._db.close(), this._db = null, this._ready = null;
  }
  deleteDatabase() {
    return this.close(), this.indexedDB ? new Promise((e, i) => {
      const l = this.indexedDB.deleteDatabase(this.dbName);
      l.onsuccess = () => e(), l.onerror = () => i(dt(l, "Queue database delete failed")), l.onblocked = () => i(new Error("Queue database delete blocked"));
    }) : Promise.resolve();
  }
  allForScope(e) {
    return this.open().then((i) => i ? new Promise((l, f) => {
      const r = i.transaction(rt, "readonly").objectStore(rt).index("by_scope_seq").getAll(Rt(this.keyRange, e));
      r.onsuccess = () => l(r.result || []), r.onerror = () => f(dt(r, "Queue scope read failed"));
    }) : []);
  }
  enqueue(e, i) {
    return i = i || {}, this.open().then((l) => l ? new Promise((f, h) => {
      const r = l.transaction([at, rt], "readwrite"), s = r.objectStore(at), a = r.objectStore(rt), n = cn(e);
      let o = null;
      const c = (w) => {
        const y = w + 1;
        o = {
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
        }, s.put({ key: n, value: y }), a.put(o);
      }, u = s.get(n);
      u.onerror = () => h(dt(u, "Queue sequence read failed")), u.onsuccess = () => {
        const w = u.result;
        if (w && typeof w.value == "number") {
          c(w.value);
          return;
        }
        const y = a.index("by_scope_seq").getAll(Rt(this.keyRange, e));
        y.onerror = () => h(dt(y, "Queue sequence migration failed")), y.onsuccess = () => {
          const E = (y.result || []).reduce((A, m) => Math.max(A, m.seq || 0), 0);
          c(E);
        };
      }, r.oncomplete = () => f(o), r.onerror = () => h(r.error || new Error("Queue enqueue transaction failed")), r.onabort = () => h(r.error || new Error("Queue enqueue transaction aborted"));
    }) : null);
  }
  claimReady(e, i, l) {
    return this.open().then((f) => f ? new Promise((h, r) => {
      const s = f.transaction(rt, "readwrite"), a = s.objectStore(rt), n = a.index("by_scope_seq").getAll(Rt(this.keyRange, e)), o = this.now();
      let c = { entries: [], wakeups: [] };
      n.onerror = () => r(dt(n, "Queue claim read failed")), n.onsuccess = () => {
        c = Yr(n.result || [], i, l, o);
        for (const u of c.entries) a.put(u);
      }, s.oncomplete = () => h(c), s.onerror = () => r(s.error || new Error("Queue claim transaction failed")), s.onabort = () => r(s.error || new Error("Queue claim transaction aborted"));
    }) : { entries: [], wakeups: [] });
  }
  ack(e, i) {
    return this._updateEntry(e, i, (l, f) => (f.delete(l.entryId), { status: "acked", entry: l }));
  }
  nack(e, i, l, f) {
    f = f || {};
    const h = f.maxAttempts || 8, r = f.backoff || [2e3, 5e3, 15e3, 6e4, 3e5];
    return this.open().then((s) => s ? new Promise((a, n) => {
      const o = s.transaction([rt, at], "readwrite"), c = o.objectStore(rt), u = o.objectStore(at), w = c.get(i);
      let y = null;
      w.onerror = () => n(dt(w, "Queue nack read failed")), w.onsuccess = () => {
        const E = w.result;
        if (!(!E || E.scope !== e)) {
          if (l === "drop") {
            c.delete(E.entryId), y = { status: "dropped", entry: E };
            return;
          }
          if (dn(E), E.updatedAt = this.now(), l === "auth") {
            E.status = "pending", c.put(E), u.put({ key: Jt(e), value: "auth" }), y = { status: "auth", entry: E };
            return;
          }
          if (l === "retry") {
            if (E.attempts = (E.attempts || 0) + 1, E.attempts >= h) {
              E.status = "failed", E.nextAttemptAt = 0, c.put(E), y = { status: "failed", entry: E };
              return;
            }
            const A = r[Math.min(E.attempts - 1, r.length - 1)];
            E.status = "pending", E.nextAttemptAt = this.now() + A, c.put(E), y = { status: "retry", entry: E, delay: A };
          }
        }
      }, o.oncomplete = () => a(y), o.onerror = () => n(o.error || new Error("Queue nack transaction failed")), o.onabort = () => n(o.error || new Error("Queue nack transaction aborted"));
    }) : null);
  }
  remap(e, i, l) {
    return this._remapTransaction(e, null, i, l);
  }
  resolveCreate(e, i, l, f) {
    return this._remapTransaction(e, i, l, f);
  }
  _remapTransaction(e, i, l, f) {
    return this.open().then((h) => h ? new Promise((r, s) => {
      const a = h.transaction(rt, "readwrite"), n = a.objectStore(rt), o = n.index("by_scope_seq").getAll(Rt(this.keyRange, e));
      let c = { changed: [], deleted: [] };
      o.onerror = () => s(dt(o, "Queue remap read failed")), o.onsuccess = () => {
        c = Jr(o.result || [], i, l, f, this.now());
        for (const u of c.deleted) n.delete(u);
        for (const u of c.changed) n.put(u);
      }, a.oncomplete = () => r(c.changed), a.onerror = () => s(a.error || new Error("Queue remap transaction failed")), a.onabort = () => s(a.error || new Error("Queue remap transaction aborted"));
    }) : []);
  }
  resetFailed(e) {
    return this.open().then((i) => i ? new Promise((l, f) => {
      const h = i.transaction(rt, "readwrite"), r = h.objectStore(rt), s = r.index("by_scope_seq").getAll(Rt(this.keyRange, e));
      let a = 0;
      s.onerror = () => f(dt(s, "Queue failed-entry read failed")), s.onsuccess = () => {
        for (const n of s.result || [])
          n.status === "failed" && (n.status = "pending", n.attempts = 0, n.nextAttemptAt = 0, n.updatedAt = this.now(), dn(n), r.put(n), a++);
      }, h.oncomplete = () => l(a), h.onerror = () => f(h.error || new Error("Queue failed-entry reset failed")), h.onabort = () => f(h.error || new Error("Queue failed-entry reset aborted"));
    }) : 0);
  }
  getPaused(e) {
    return this.open().then((i) => i ? new Promise((l, f) => {
      const r = i.transaction(at, "readonly").objectStore(at).get(Jt(e));
      r.onsuccess = () => {
        const s = r.result ? r.result.value : !1;
        l(s || !1);
      }, r.onerror = () => f(dt(r, "Queue pause-state read failed"));
    }) : !1);
  }
  setPaused(e, i) {
    return this.open().then((l) => {
      if (l)
        return new Promise((f, h) => {
          const r = l.transaction(at, "readwrite"), s = typeof i == "string" ? i : i ? "manual" : !1;
          r.objectStore(at).put({ key: Jt(e), value: s }), r.oncomplete = () => f(), r.onerror = () => h(r.error || new Error("Queue pause-state write failed")), r.onabort = () => h(r.error || new Error("Queue pause-state write aborted"));
        });
    });
  }
  clear(e) {
    return this.open().then((i) => {
      if (i)
        return new Promise((l, f) => {
          const h = i.transaction([rt, at], "readwrite"), s = h.objectStore(rt).index("by_scope_seq").openCursor(Rt(this.keyRange, e));
          s.onsuccess = (a) => {
            const n = a.target.result;
            n && (n.delete(), n.continue());
          }, s.onerror = () => f(dt(s, "Queue clear failed")), h.objectStore(at).delete(cn(e)), h.objectStore(at).delete(Jt(e)), h.oncomplete = () => l(), h.onerror = () => f(h.error || new Error("Queue clear transaction failed")), h.onabort = () => f(h.error || new Error("Queue clear transaction aborted"));
        });
    });
  }
  _updateEntry(e, i, l) {
    return this.open().then((f) => f ? new Promise((h, r) => {
      const s = f.transaction(rt, "readwrite"), a = s.objectStore(rt), n = a.get(i);
      let o = null;
      n.onerror = () => r(dt(n, "Queue entry read failed")), n.onsuccess = () => {
        const c = n.result;
        !c || c.scope !== e || (o = l(c, a));
      }, s.oncomplete = () => h(o), s.onerror = () => r(s.error || new Error("Queue entry transaction failed")), s.onabort = () => r(s.error || new Error("Queue entry transaction aborted"));
    }) : null);
  }
}
(function() {
  const t = "data-ln-api-queue", e = "lnApiQueue", i = [2e3, 5e3, 15e3, 6e4, 3e5], l = 8, f = 6e4;
  if (window[e] !== void 0) return;
  function h(o) {
    const c = o[e];
    c && c._drain();
  }
  const r = {
    "data-ln-api-queue": { type: "marker", description: "Mounts offline API synchronization queue backed by IndexedDB" },
    "data-ln-api-queue-online": { effect: h, type: "enum", values: ["true", "false"], fallback: "auto", description: "Network connectivity override (true/false, or auto-detect from navigator.onLine)" }
  };
  function s() {
    try {
      return crypto.randomUUID();
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const u = Math.random() * 16 | 0;
        return (c === "x" ? u : u & 3 | 8).toString(16);
      });
    }
  }
  const a = new Zr({
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    uuid: s
  });
  function n(o) {
    this.dom = o, o[e] = this;
    const c = o.closest("[data-ln-data-coordinator]");
    this.scope = o.id || (c ? c.id : null) || "default", this._paused = !1, this._timers = /* @__PURE__ */ new Map(), this._workerId = s(), this._drainPromise = null, this._onlineHandler = () => this._drain(), this._bindEvents(), window.addEventListener("online", this._onlineHandler);
    const u = this;
    return a.open().then((w) => w ? a.getPaused(u.scope) : (console.warn("[ln-api-queue] IndexedDB not available — queue disabled"), !1)).then((w) => {
      if (u._paused = !!w, u._paused) {
        const y = typeof w == "string" ? w : "auth";
        L(u.dom, "ln-api-queue:paused", { reason: y, restored: !0 });
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
    return a.allForScope(o.scope).then((c) => (L(o.dom, "ln-api-queue:pending-count", { count: c.length, scope: o.scope }), c.length === 0 && L(o.dom, "ln-api-queue:drained", { scope: o.scope }), c));
  }, n.prototype._clearTimer = function(o) {
    const c = this._timers.get(o);
    c && (clearTimeout(c), this._timers.delete(o));
  }, n.prototype._scheduleTimer = function(o, c) {
    const u = Math.max(0, c), w = this._timers.get(o);
    w && clearTimeout(w);
    const y = this, E = setTimeout(() => {
      y._timers.delete(o), y._drain();
    }, u);
    this._timers.set(o, E);
  }, n.prototype._drain = function() {
    const o = this;
    return o._paused || !o._isOnline() ? Promise.resolve() : (o._drainPromise || (o._drainPromise = a.claimReady(o.scope, o._workerId, f).then((c) => {
      for (const u of c.wakeups)
        o._scheduleTimer(u.chainKey, u.at - Date.now());
      for (const u of c.entries)
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
    }).catch((c) => {
      console.error("[ln-api-queue] Drain failed:", c), L(o.dom, "ln-api-queue:error", { operation: "drain", error: c });
    }).finally(() => {
      o._drainPromise = null;
    })), o._drainPromise);
  }, n.prototype._onEnqueue = function(o) {
    const c = this;
    return a.enqueue(c.scope, o.detail || {}).then((u) => {
      if (u)
        return c._emitPendingCount().then((w) => (L(c.dom, "ln-api-queue:enqueued", {
          entryId: u.entryId,
          chainKey: u.chainKey,
          count: w.length
        }), c._drain()));
    }).catch((u) => {
      L(c.dom, "ln-api-queue:error", { operation: "enqueue", error: u });
    });
  }, n.prototype._onAck = function(o) {
    const c = this, u = o.detail || {};
    return a.ack(c.scope, u.entryId).then(() => c._emitPendingCount()).then(() => c._drain()).catch((w) => {
      L(c.dom, "ln-api-queue:error", { operation: "ack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onNack = function(o) {
    const c = this, u = o.detail || {};
    return a.nack(c.scope, u.entryId, u.reason, {
      maxAttempts: l,
      backoff: i
    }).then((w) => {
      if (w)
        return w.status === "failed" ? L(c.dom, "ln-api-queue:failed", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey,
          attempts: w.entry.attempts
        }) : w.status === "retry" ? c._scheduleTimer(w.entry.chainKey, w.delay) : w.status === "auth" && (c._paused = !0, L(c.dom, "ln-api-queue:paused", { reason: "auth" }), L(c.dom, "ln-api-queue:auth-required", {
          entryId: w.entry.entryId,
          chainKey: w.entry.chainKey
        })), c._emitPendingCount().then(() => {
          if (w.status === "dropped") return c._drain();
        });
    }).catch((w) => {
      L(c.dom, "ln-api-queue:error", { operation: "nack", entryId: u.entryId, error: w });
    });
  }, n.prototype._onRemap = function(o) {
    const c = this, u = o.detail || {};
    return a.remap(c.scope, u.oldKey, u.newId).catch((w) => {
      L(c.dom, "ln-api-queue:error", { operation: "remap", error: w });
    });
  }, n.prototype._onResolveCreate = function(o) {
    const c = this, u = o.detail || {};
    return a.resolveCreate(c.scope, u.entryId, u.oldKey, u.newId).then(() => c._emitPendingCount()).then(() => c._drain()).catch((w) => {
      L(c.dom, "ln-api-queue:error", {
        operation: "resolve-create",
        entryId: u.entryId,
        error: w
      });
    });
  }, n.prototype._onResume = function() {
    const o = this;
    return a.setPaused(o.scope, !1).then(() => (o._paused = !1, L(o.dom, "ln-api-queue:resumed", {}), o._drain())).catch((c) => {
      L(o.dom, "ln-api-queue:error", { operation: "resume", error: c });
    });
  }, n.prototype._onPause = function() {
    const o = this;
    return a.setPaused(o.scope, "manual").then(() => {
      o._paused = !0, L(o.dom, "ln-api-queue:paused", { reason: "manual" });
    }).catch((c) => {
      L(o.dom, "ln-api-queue:error", { operation: "pause", error: c });
    });
  }, n.prototype._onDrain = function() {
    const o = this;
    return a.resetFailed(o.scope).then(() => {
      const c = o._drainPromise;
      return c ? c.then(() => o._drain()) : o._drain();
    }).catch((c) => {
      L(o.dom, "ln-api-queue:error", { operation: "manual-drain", error: c });
    });
  }, n.prototype._onClear = function() {
    const o = this;
    return o._timers.forEach((c) => clearTimeout(c)), o._timers.clear(), a.clear(o.scope).then(() => {
      o._paused = !1, L(o.dom, "ln-api-queue:pending-count", { count: 0, scope: o.scope }), L(o.dom, "ln-api-queue:drained", { scope: o.scope });
    }).catch((c) => {
      L(o.dom, "ln-api-queue:error", { operation: "clear", error: c });
    });
  }, n.prototype._bindEvents = function() {
    const o = this;
    o._handlers = {
      enqueue: (c) => o._onEnqueue(c),
      ack: (c) => o._onAck(c),
      nack: (c) => o._onNack(c),
      remap: (c) => o._onRemap(c),
      resolveCreate: (c) => o._onResolveCreate(c),
      resume: () => o._onResume(),
      pause: () => o._onPause(),
      drain: () => o._onDrain(),
      clear: () => o._onClear()
    }, o.dom.addEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.addEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.addEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.addEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.addEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.addEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.addEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.addEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.addEventListener("ln-api-queue:request-clear", o._handlers.clear);
  }, n.prototype.destroy = function() {
    if (!this.dom[e]) return;
    const o = this;
    o.dom.removeEventListener("ln-api-queue:request-enqueue", o._handlers.enqueue), o.dom.removeEventListener("ln-api-queue:ack", o._handlers.ack), o.dom.removeEventListener("ln-api-queue:nack", o._handlers.nack), o.dom.removeEventListener("ln-api-queue:request-remap", o._handlers.remap), o.dom.removeEventListener("ln-api-queue:resolve-create", o._handlers.resolveCreate), o.dom.removeEventListener("ln-api-queue:request-resume", o._handlers.resume), o.dom.removeEventListener("ln-api-queue:request-pause", o._handlers.pause), o.dom.removeEventListener("ln-api-queue:request-drain", o._handlers.drain), o.dom.removeEventListener("ln-api-queue:request-clear", o._handlers.clear), window.removeEventListener("online", o._onlineHandler), o._timers.forEach((c) => clearTimeout(c)), o._timers.clear(), delete o.dom[e];
  }, j(t, e, n, "ln-api-queue", {
    attributes: r
  });
})();
function di(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function Ot(t) {
  return String(Math.round(t * 1e3) / 1e3);
}
function to(t, e, i) {
  const l = di(t);
  return l === null || l < 0 ? 0 : Math.min(l, Math.min(e, i) / 2);
}
function eo(t) {
  if (typeof t != "string") return null;
  const e = t.trim().split(/[\s,]+/).map(Number);
  return e.length !== 4 || e.some((i) => !Number.isFinite(i)) || e[2] <= 0 || e[3] <= 0 ? null : { x: e[0], y: e[1], width: e[2], height: e[3] };
}
function no(t) {
  if (!t || typeof t != "string") return null;
  const e = t.split(":"), i = e[0].trim();
  return i ? {
    field: i,
    direction: e[1] && e[1].trim().toLowerCase() === "desc" ? "desc" : "asc"
  } : null;
}
function io(t, e) {
  e = e || {};
  const i = e.viewBox || { x: 0, y: 0, width: 1e3, height: 320 }, l = e.xField || "label", f = e.yField || "value", h = e.includeZero !== !1, r = to(e.padding, i.width, i.height), s = Array.isArray(t) ? t : [], a = [];
  for (let d = 0; d < s.length; d++) {
    const _ = s[d] || {}, b = di(_[f]);
    b !== null && a.push({
      record: _,
      sourceIndex: d,
      label: _[l] == null ? String(d + 1) : String(_[l]),
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
      baselineY: i.y + i.height - r
    };
  let n = a[0].value, o = a[0].value;
  for (let d = 1; d < a.length; d++)
    a[d].value < n && (n = a[d].value), a[d].value > o && (o = a[d].value);
  let c = n, u = o;
  h && (c = Math.min(0, c), u = Math.max(0, u)), c === u && (u === 0 ? u = 1 : u > 0 ? c = 0 : u = 0);
  const w = Math.max(1, i.width - r * 2), y = Math.max(1, i.height - r * 2), E = u - c, A = i.y + i.height - r - (0 - c) / E * y, m = [];
  for (let d = 0; d < a.length; d++) {
    const _ = a[d], b = a.length === 1 ? 0.5 : d / (a.length - 1), T = i.x + r + b * w, g = i.y + i.height - r - (_.value - c) / E * y;
    m.push({
      record: _.record,
      sourceIndex: _.sourceIndex,
      label: _.label,
      value: _.value,
      x: T,
      y: g,
      pointString: Ot(T) + "," + Ot(g)
    });
  }
  const v = m.map((d) => d.pointString).join(" ");
  let p = "";
  if (m.length > 0) {
    const d = m[0], _ = m[m.length - 1], b = Ot(d.x) + "," + Ot(A), T = Ot(_.x) + "," + Ot(A);
    p = b + " " + v + " " + T;
  }
  return {
    points: m,
    linePoints: v,
    areaPoints: p,
    count: m.length,
    min: n,
    max: o,
    domainMin: c,
    domainMax: u,
    baselineY: A
  };
}
(function() {
  const t = "data-ln-chart", e = "lnChart", i = { x: 0, y: 0, width: 1e3, height: 320 };
  if (window[e] !== void 0) return;
  function l(n) {
    const o = n[e];
    o && o.requestData();
  }
  function f(n) {
    const o = n[e];
    o && o._render();
  }
  const h = {
    "data-ln-chart": { prop: "name", type: "string", read: $, fallback: "", effect: f, description: "Chart instance name or identifier" },
    "data-ln-chart-source": { type: "string", effect: l, description: "Source store or coordinator identifier" },
    "data-ln-chart-sort": { type: "string", effect: l, description: "Field name to sort chart series data by" },
    "data-ln-chart-type": { type: "enum", values: ["line", "bar", "area", "scatter"], fallback: "line", effect: f, description: "Visual chart render type" },
    "data-ln-chart-x": { type: "string", effect: f, description: "Field name mapping to X axis" },
    "data-ln-chart-y": { type: "string", effect: f, description: "Field name mapping to Y axis" },
    "data-ln-chart-padding": { type: "integer", fallback: 20, min: 0, effect: f, description: "Internal plot padding in pixels" },
    "data-ln-chart-zero": { type: "boolean", effect: f, description: "Forces Y axis scale to start at zero" }
  }, r = et(h);
  function s(n, o) {
    n && (n.textContent = o);
  }
  function a(n) {
    this.dom = n, tt(this, n, r), this.source = n.getAttribute("data-ln-chart-source") || this.name, this.plot = n.querySelector("[data-ln-chart-plot]"), this.line = n.querySelector("[data-ln-chart-line]"), this.area = n.querySelector("[data-ln-chart-area]"), this.labels = n.querySelector("[data-ln-chart-labels]"), this.empty = n.querySelector("[data-ln-chart-empty]"), this.minimum = n.querySelector("[data-ln-chart-min]"), this.maximum = n.querySelector("[data-ln-chart-max]"), this.count = n.querySelector("[data-ln-chart-count]"), this._data = [], this.model = null, this.isLoaded = !1;
    const o = this;
    return this._onSetData = function(c) {
      const u = c.detail || {};
      o._data = Array.isArray(u.data) ? u.data : [], o.isLoaded = !0, o._setLoading(!1), o._render();
    }, this._onSetLoading = function(c) {
      o._setLoading(!!(c.detail && c.detail.loading));
    }, this._onRefresh = function() {
      o.requestData();
    }, n.addEventListener("ln-chart:set-data", this._onSetData), n.addEventListener("ln-chart:set-loading", this._onSetLoading), n.addEventListener("ln-chart:request-refresh", this._onRefresh), this.requestData(), this;
  }
  a.prototype._readOptions = function() {
    const n = this.dom.getAttribute("data-ln-chart-padding"), o = n === null ? NaN : Number(n), c = (this.dom.getAttribute("data-ln-chart-type") || "line").toLowerCase();
    return {
      xField: this.dom.getAttribute("data-ln-chart-x") || "label",
      yField: this.dom.getAttribute("data-ln-chart-y") || "value",
      includeZero: this.dom.getAttribute("data-ln-chart-zero") !== "false",
      padding: Number.isFinite(o) && o >= 0 ? o : 16,
      type: c === "area" || c === "polygon" ? "area" : "line",
      viewBox: this.plot && eo(this.plot.getAttribute("viewBox")) || i
    };
  }, a.prototype._setLoading = function(n) {
    this.dom.classList.toggle("ln-chart--loading", n), this.dom.setAttribute("aria-busy", n ? "true" : "false");
  }, a.prototype._renderLabels = function(n) {
    if (!this.labels || (this.labels.replaceChildren(), n.count === 0)) return;
    const o = this.name + "-label", c = '[data-ln-template="' + o + '"]';
    if (!this.dom.querySelector(c) && !document.querySelector(c)) return;
    const u = Ct(this.dom, o, "ln-chart");
    if (!u) return;
    const w = it(this.dom);
    for (const y of n.points) {
      const E = u.cloneNode(!0);
      Gt(E, {
        label: y.label,
        value: lt(y.value, w)
      }), this.labels.appendChild(E);
    }
  }, a.prototype._render = function() {
    const n = this._readOptions(), o = io(this._data, n);
    this.model = o, this.line && (this.line.setAttribute("points", o.linePoints), this.line.toggleAttribute("hidden", o.count === 0)), this.area && (this.area.setAttribute("points", o.areaPoints), this.area.toggleAttribute("hidden", o.count === 0 || n.type !== "area"));
    const c = o.count === 0;
    this.dom.classList.toggle("ln-chart--empty", c), this.empty && this.empty.toggleAttribute("hidden", !c);
    const u = it(this.dom);
    s(this.minimum, lt(o.min, u)), s(this.maximum, lt(o.max, u)), s(this.count, lt(o.count, u)), this._renderLabels(o), L(this.dom, "ln-chart:rendered", {
      chart: this.name,
      count: o.count,
      min: o.min,
      max: o.max
    });
  }, a.prototype.requestData = function() {
    this.source = this.dom.getAttribute("data-ln-chart-source") || this.name, L(this.dom, "ln-chart:request-data", {
      chart: this.name,
      source: this.source,
      sort: no(this.dom.getAttribute("data-ln-chart-sort")),
      filters: {},
      search: ""
    });
  }, a.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-chart:set-data", this._onSetData), this.dom.removeEventListener("ln-chart:set-loading", this._onSetLoading), this.dom.removeEventListener("ln-chart:request-refresh", this._onRefresh), this._data = [], this.model = null, delete this.dom[e]);
  }, j(t, e, a, "ln-chart", {
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
  }, l = et(i);
  function f(h) {
    this.dom = h, tt(this, h, l);
    const r = this;
    return this._onSetData = function(s) {
      r._rebuild(s.detail.data || []);
    }, h.addEventListener("ln-options:set-data", this._onSetData), L(h, "ln-options:request-data", { options: this._storeName }), this;
  }
  f.prototype._rebuild = function(h) {
    const r = this.dom, s = this._valueField, a = this._labelField, n = r.value, o = r.querySelectorAll("option");
    for (let u = o.length - 1; u >= 0; u--)
      o[u].value !== "" && r.removeChild(o[u]);
    for (let u = 0; u < h.length; u++) {
      const w = h[u], y = document.createElement("option");
      y.value = String(w[s]), y.textContent = w[a] != null ? w[a] : "", r.appendChild(y);
    }
    const c = r.options;
    for (let u = 0; u < c.length; u++)
      if (c[u].value === n) {
        r.value = n;
        break;
      }
  }, f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-options:set-data", this._onSetData), delete this.dom[e]);
  }, j(t, e, f, "ln-options", {
    attributes: i
  });
})();
function ro(t) {
  if (!t || typeof t != "string") return null;
  const e = t.indexOf(":");
  if (e === -1) return null;
  const i = t.slice(0, e).trim(), l = t.slice(e + 1).trim();
  if (!i) return null;
  const f = {};
  return f[i] = [l], f;
}
function oo(t) {
  return t == null ? "" : String(t);
}
(function() {
  const t = "data-ln-stat", e = "lnStat";
  if (window[e] !== void 0) return;
  const i = {
    "data-ln-stat": { prop: "_storeName", type: "string", read: $, fallback: "", description: "Store or entity name to count" },
    "data-ln-stat-filter": { prop: "_filterRaw", type: "string", read: $, fallback: "", description: "JSON or key:value filter criteria for record counting" }
  }, l = et(i);
  function f(h) {
    return this.dom = h, tt(this, h, l), this._onSetCount = function(r) {
      h.textContent = oo(r.detail && r.detail.count), h.classList.remove("is-loading");
    }, h.addEventListener("ln-stat:set-count", this._onSetCount), L(h, "ln-stat:request-count", {
      stat: this._storeName,
      filters: ro(this._filterRaw)
    }), this;
  }
  f.prototype.destroy = function() {
    this.dom[e] && (this.dom.removeEventListener("ln-stat:set-count", this._onSetCount), delete this.dom[e]);
  }, j(t, e, f, "ln-stat", {
    attributes: i
  });
})();
(function() {
  const t = "ln-icon-sprite", e = "#ln-icon-", i = "#ln-icon-custom-", l = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  let h = null;
  const r = (window.LN_ICON_CDN || "https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline").replace(/\/$/, ""), s = (window.LN_ICON_CUSTOM_CDN || "").replace(/\/$/, ""), a = "lni:", n = "lni:v", o = "1";
  function c() {
    try {
      if (localStorage.getItem(n) !== o) {
        for (let v = localStorage.length - 1; v >= 0; v--) {
          const p = localStorage.key(v);
          p && p.indexOf(a) === 0 && localStorage.removeItem(p);
        }
        localStorage.setItem(n, o);
      }
    } catch {
    }
  }
  c();
  function u() {
    return h || (h = document.getElementById(t), h || (h = document.createElementNS("http://www.w3.org/2000/svg", "svg"), h.id = t, h.setAttribute("hidden", ""), h.setAttribute("aria-hidden", "true"), h.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs")), document.body.insertBefore(h, document.body.firstChild))), h;
  }
  function w(v) {
    return v.indexOf(i) === 0 ? s + "/" + v.slice(i.length) + ".svg" : r + "/" + v.slice(e.length) + ".svg";
  }
  function y(v, p) {
    const d = p.match(/viewBox="([^"]+)"/), _ = d ? d[1] : "0 0 24 24", b = p.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i), T = b ? b[1].trim() : "", g = p.match(/<svg([^>]*)>/i), S = g ? g[1] : "", C = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    C.id = v, C.setAttribute("viewBox", _), ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(q) {
      const D = S.match(new RegExp(q + '="([^"]*)"'));
      D && C.setAttribute(q, D[1]);
    }), C.innerHTML = T, u().querySelector("defs").appendChild(C);
  }
  function E(v) {
    if (l.has(v) || f.has(v)) return;
    if (v.indexOf(i) === 0 && !s) {
      console.warn("[ln-icon] Custom icon requested but no CUSTOM_CDN configured:", v);
      return;
    }
    const p = v.slice(1);
    try {
      const _ = localStorage.getItem(a + p);
      if (_) {
        y(p, _), l.add(v);
        return;
      }
    } catch {
    }
    f.add(v);
    const d = w(v);
    fetch(d).then(function(_) {
      if (!_.ok) throw new Error(_.status);
      return _.text();
    }).then(function(_) {
      y(p, _), l.add(v), f.delete(v);
      try {
        localStorage.setItem(a + p, _);
      } catch {
      }
    }).catch(function(_) {
      console.error("[ln-icon] Fetch failed for:", p, _), f.delete(v);
    });
  }
  function A(v) {
    const p = 'use[href^="' + e + '"], use[href^="' + i + '"]', d = v.querySelectorAll ? v.querySelectorAll(p) : [];
    if (v.matches && v.matches(p)) {
      const _ = v.getAttribute("href");
      _ && E(_);
    }
    Array.prototype.forEach.call(d, function(_) {
      const b = _.getAttribute("href");
      b && E(b);
    });
  }
  function m() {
    A(document), new MutationObserver(function(v) {
      v.forEach(function(p) {
        if (p.type === "childList")
          p.addedNodes.forEach(function(d) {
            d.nodeType === 1 && A(d);
          });
        else if (p.type === "attributes" && p.attributeName === "href") {
          const d = p.target.getAttribute("href");
          d && (d.indexOf(e) === 0 || d.indexOf(i) === 0) && E(d);
        }
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["href"]
    });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", m) : m();
})();
const Pe = /* @__PURE__ */ new Set([
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
function so(t, e) {
  if (t === e) return 0;
  if (!t.length) return e.length;
  if (!e.length) return t.length;
  const i = [];
  for (let l = 0; l <= e.length; l++) i[l] = [l];
  for (let l = 0; l <= t.length; l++) i[0][l] = l;
  for (let l = 1; l <= e.length; l++)
    for (let f = 1; f <= t.length; f++)
      e.charAt(l - 1) === t.charAt(f - 1) ? i[l][f] = i[l - 1][f - 1] : i[l][f] = Math.min(
        i[l - 1][f - 1] + 1,
        i[l][f - 1] + 1,
        i[l - 1][f] + 1
      );
  return i[e.length][t.length];
}
function ao(t, e = Pe) {
  if (e.has(t)) return null;
  let i = null, l = 1 / 0;
  for (const h of e) {
    const r = so(t, h);
    r < l && (l = r, i = h);
  }
  const f = Math.max(3, Math.floor(t.length * 0.4));
  return l <= f ? i : null;
}
function ui(t) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
function lo(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const l = [], f = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < f.length; h++) {
    const r = f[h];
    if (r.attributes)
      for (let s = 0; s < r.attributes.length; s++) {
        const a = r.attributes[s];
        if (a.name.startsWith("data-ln-") && a.name.endsWith("-for")) {
          const n = (a.value || "").trim();
          if (!n) {
            l.push({
              type: "id-empty",
              element: r,
              attribute: a.name,
              targetId: "",
              message: `[ln-debug] Empty ID reference in <${r.tagName.toLowerCase()} ${a.name}="">.`
            });
            continue;
          }
          e.getElementById(n) || e.querySelector("#" + ui(n)) || l.push({
            type: "id-unresolved",
            element: r,
            attribute: a.name,
            targetId: n,
            message: `[ln-debug] Unresolved ID reference: <${r.tagName.toLowerCase()} ${a.name}="${n}"> targets "#${n}", but no element with id="${n}" exists in the document.`
          });
        }
      }
  }
  return l;
}
function co(t = document) {
  const e = t.ownerDocument || t, i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const l = [], f = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < f.length; h++) {
    const r = f[h];
    if (r.attributes)
      for (let s = 0; s < r.attributes.length; s++) {
        const a = r.attributes[s];
        if (a.name.startsWith("data-ln-") && (a.name.endsWith("-source") || a.name.endsWith("-store")) && a.name !== "data-ln-data-store") {
          const o = (a.value || "").trim();
          if (!o) {
            l.push({
              type: "store-empty",
              element: r,
              attribute: a.name,
              storeName: "",
              message: `[ln-debug] Empty store reference in <${r.tagName.toLowerCase()} ${a.name}="">.`
            });
            continue;
          }
          const c = ui(o), u = e.querySelector(`[data-ln-data-store="${c}"], [data-ln-store="${c}"]`), w = typeof window < "u" && window.lnDataStore && typeof window.lnDataStore.getStore == "function" && window.lnDataStore.getStore(o);
          !u && !w && l.push({
            type: "store-unresolved",
            element: r,
            attribute: a.name,
            storeName: o,
            message: `[ln-debug] Unresolved store reference: <${r.tagName.toLowerCase()} ${a.name}="${o}"> targets store "${o}", but no [data-ln-data-store="${o}"] exists in the document.`
          });
        }
      }
  }
  return l;
}
function uo(t = document) {
  t.ownerDocument;
  const e = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!e) return [];
  const i = [], l = Array.from(e.querySelectorAll("[data-ln-data-store]"));
  e.hasAttribute && e.hasAttribute("data-ln-data-store") && l.unshift(e);
  const f = /* @__PURE__ */ new Map();
  for (let h = 0; h < l.length; h++) {
    const r = l[h], s = (r.getAttribute("data-ln-data-store") || "").trim();
    s && (f.has(s) || f.set(s, []), f.get(s).push(r));
  }
  for (const [h, r] of f.entries())
    r.length > 1 && i.push({
      type: "store-duplicate",
      storeName: h,
      elements: r,
      message: `[ln-debug] Duplicate store name: Multiple elements declare data-ln-data-store="${h}". Store names must be unique across the document.`
    });
  return i;
}
function fo(t = document, e = Pe) {
  const i = t.nodeType === 9 ? t.body || t.documentElement : t;
  if (!i) return [];
  const l = [], f = [i, ...i.querySelectorAll("*")];
  for (let h = 0; h < f.length; h++) {
    const r = f[h];
    if (r.attributes)
      for (let s = 0; s < r.attributes.length; s++) {
        const a = r.attributes[s];
        if (a.name.startsWith("data-ln-") && !e.has(a.name)) {
          const n = ao(a.name, e), o = n ? ` Did you mean "${n}"?` : "";
          l.push({
            type: "attribute-unknown",
            element: r,
            attribute: a.name,
            suggestion: n,
            message: `[ln-debug] Unknown attribute "${a.name}" on <${r.tagName.toLowerCase()}>.${o}`
          });
        }
      }
  }
  return l;
}
function Ce(t = typeof document < "u" ? document : null, e = {}) {
  if (!t)
    return { idIssues: [], storeIssues: [], uniquenessIssues: [], spellingIssues: [], total: 0 };
  const i = e.validAttributes || Pe, l = lo(t), f = co(t), h = uo(t), r = fo(t, i), s = [
    ...l,
    ...f,
    ...h,
    ...r
  ];
  if (!e.silent)
    for (let a = 0; a < s.length; a++)
      console.warn(s[a].message);
  return {
    idIssues: l,
    storeIssues: f,
    uniquenessIssues: h,
    spellingIssues: r,
    total: s.length
  };
}
let Ut = null;
function Zt(t = typeof document < "u" ? document : null, e = 50, i = null) {
  if (!t) return;
  Ut && (clearTimeout(Ut), Ut = null);
  function l() {
    Ut = setTimeout(() => {
      Ut = null;
      const f = Ce(t);
      i && i(f);
    }, e);
  }
  Sn() > 0 ? vt(l) : l();
}
function ho(t, e, i, l) {
  t === "event" ? (console.groupCollapsed("[ln-debug] event", e), console.log("target", i), console.log("detail", l), console.groupEnd()) : t === "attr" && (console.groupCollapsed("[ln-debug] attr", e), console.log("target", i), console.log("old → new", l.oldValue, "→", l.newValue), console.groupEnd());
}
let qt = [];
function po() {
  qt = Array.from(document.body.querySelectorAll("[data-ln-debug]")), document.body.hasAttribute("data-ln-debug") && qt.push(document.body);
}
function fi(t) {
  if (t === window || t === document)
    return qt.indexOf(document.body) !== -1;
  for (let e = 0; e < qt.length; e++)
    if (qt[e].contains(t)) return !0;
  return !1;
}
function mo(t, e, i, l) {
  fi(i) && ho(t, e, i, l);
}
function Te() {
  po(), Si(qt.length > 0 ? mo : null, qt.length > 0 ? fi : null);
}
function un() {
  Te();
}
function go() {
  typeof window > "u" || (window.lnCore = window.lnCore || {}, !window.lnCore._debugGateBound && (window.lnCore._debugGateBound = !0, pt(function() {
    Te(), $t(["data-ln-debug"], Te);
  }, "ln-debug")));
}
(function() {
  const t = "data-ln-debug", e = "lnDebug";
  if (typeof window < "u" && window[e] !== void 0) return;
  const i = {
    "data-ln-debug": { type: "marker", description: "Enables developer diagnostics overlay, live validation badges, and inspection logging" }
  };
  go();
  function l(h) {
    return this.dom = h, Zt(h.ownerDocument || document), un(), this;
  }
  l.prototype.verify = function(h, r) {
    return Ce(h || (this.dom ? this.dom.ownerDocument || this.dom : document), r);
  }, l.prototype.destroy = function() {
    delete this.dom[e], un();
  };
  const f = j(t, e, l, "ln-debug", {
    attributes: i,
    onInit: function(h) {
      typeof document < "u" && Zt(h && h.ownerDocument ? h.ownerDocument : document);
    },
    onSubtreeChange: function(h) {
      typeof document < "u" && Zt(h && h.ownerDocument ? h.ownerDocument : document);
    }
  });
  f.verify = function(h, r) {
    return Ce(h || document, r);
  }, f.schedule = function(h, r, s) {
    return Zt(h || document, r, s);
  };
})();
