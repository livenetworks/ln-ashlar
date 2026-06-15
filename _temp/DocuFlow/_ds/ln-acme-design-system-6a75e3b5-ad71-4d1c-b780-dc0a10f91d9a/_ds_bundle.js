/* @ds-bundle: {"format":3,"namespace":"LnAcmeDesignSystem_6a75e3","components":[],"sourceHashes":{"prototypes/A/app.jsx":"6f3628863b70","prototypes/A/components.jsx":"2ec9ddf11e60","prototypes/A/data.js":"d1b407275838","prototypes/A/screens.jsx":"76f8e9726b1a","prototypes/B/app.jsx":"f65dace2ed7b","prototypes/B/components.jsx":"6e7b276d34bb","prototypes/B/data.js":"9dc998604399","prototypes/B/screens.jsx":"ce751432bf0a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LnAcmeDesignSystem_6a75e3 = window.LnAcmeDesignSystem_6a75e3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// prototypes/A/app.jsx
try { (() => {
/* global window, React, ReactDOM, Sidebar, Topbar, ImpersonationBanner, Dashboard, DocumentEditor, GeneralChatPage, TenantPicker, SettingsPage, AdminTenants, Placeholder, Tweaks, TENANTS, DOCS */
const {
  useState: useS,
  useEffect: useE
} = React;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "shelves",
  "density": "comfortable",
  "theme": "light"
} /*EDITMODE-END*/;
const App = () => {
  const [route, setRoute] = useS(() => {
    try {
      return localStorage.getItem("dfA.route") || "/";
    } catch (e) {
      return "/";
    }
  });
  const [tenant, setTenant] = useS(TENANTS[0]);
  const [tenantPickerOpen, setTenantPickerOpen] = useS(false);
  const [impersonating, setImpersonating] = useS(null);
  const [lang, setLang] = useS("EN");
  const [profileComplete, setProfileComplete] = useS(true);
  const [tweaks, setTweaks] = useS(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useS(false);
  const go = r => {
    setRoute(r);
    try {
      localStorage.setItem("dfA.route", r);
    } catch (e) {}
  };
  window.__goto = go;

  // Tweaks protocol
  useE(() => {
    const onMsg = e => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({
      type: "__edit_mode_available"
    }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  useE(() => {
    document.documentElement.dataset.density = tweaks.density;
    document.documentElement.dataset.theme = tweaks.theme;
    window.parent.postMessage({
      type: "__edit_mode_set_keys",
      edits: tweaks
    }, "*");
  }, [tweaks]);

  // Doc lookup from route
  const match = route.match(/^\/documents\/(\w+)$/);
  const doc = match ? DOCS.find(d => d.id === match[1]) : null;

  // Crumbs
  const crumbs = (() => {
    if (route === "/") return [{
      label: "Documents"
    }];
    if (route === "/ai") return [{
      label: "AI planner"
    }];
    if (route === "/settings") return [{
      label: "Settings",
      r: "/settings"
    }, {
      label: "Organization profile"
    }];
    if (route === "/admin") return [{
      label: "Root admin"
    }, {
      label: "Tenants"
    }];
    if (route === "/users") return [{
      label: "Users & roles"
    }];
    if (route === "/audit") return [{
      label: "Audit log"
    }];
    if (route.startsWith("/standards/")) {
      const key = route.split("/")[2];
      return [{
        label: "Documents",
        r: "/"
      }, {
        label: key === "ims" ? "IMS · Shared" : key.toUpperCase()
      }];
    }
    if (doc) return [{
      label: "Documents",
      r: "/"
    }, {
      label: doc.num,
      r: "/"
    }, {
      label: doc.title
    }];
    if (route === "/documents") return [{
      label: "All documents"
    }];
    if (route === "/documents/new") return [{
      label: "Documents",
      r: "/"
    }, {
      label: "New document"
    }];
    return [{
      label: "DocuFlow"
    }];
  })();
  const aiLocked = !profileComplete;
  let page;
  if (route === "/") page = /*#__PURE__*/React.createElement(Dashboard, {
    go: go,
    layout: tweaks.layout,
    setLayout: v => setTweaks({
      ...tweaks,
      layout: v
    })
  });else if (route === "/ai") page = /*#__PURE__*/React.createElement(GeneralChatPage, {
    go: go,
    locked: aiLocked
  });else if (route === "/settings") page = /*#__PURE__*/React.createElement(SettingsPage, {
    go: go,
    profileComplete: profileComplete,
    setProfileComplete: setProfileComplete
  });else if (route === "/admin") page = /*#__PURE__*/React.createElement(AdminTenants, {
    go: go,
    onImpersonate: t => {
      setImpersonating(t);
      setTenant(t);
      go("/");
    }
  });else if (doc) page = /*#__PURE__*/React.createElement(DocumentEditor, {
    doc: doc,
    go: go,
    locked: aiLocked
  });else if (route === "/documents/new") page = /*#__PURE__*/React.createElement(Placeholder, {
    title: "New document",
    note: "Start from a blank page, from AI, or from a template."
  });else if (route === "/documents") page = /*#__PURE__*/React.createElement(Placeholder, {
    title: "All documents",
    note: "Flat list \u2014 currently the shelves view on Dashboard covers this."
  });else if (route === "/users") page = /*#__PURE__*/React.createElement(Placeholder, {
    title: "Users & roles",
    note: "Manage who's in this workspace and what they can do."
  });else if (route === "/audit") page = /*#__PURE__*/React.createElement(Placeholder, {
    title: "Audit log",
    note: "Everything anyone does, ever."
  });else if (route.startsWith("/standards/")) {
    const key = route.split("/")[2];
    page = /*#__PURE__*/React.createElement(Placeholder, {
      title: key === "ims" ? "IMS · Shared" : key.toUpperCase(),
      note: "Filter of the dashboard scoped to one standard (or the shared IMS set)."
    });
  } else page = /*#__PURE__*/React.createElement(Placeholder, {
    title: "Not found",
    note: route
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    "data-density": tweaks.density,
    "data-theme": tweaks.theme
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    go: go,
    tenant: tenant,
    setTenantPickerOpen: setTenantPickerOpen
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, impersonating && /*#__PURE__*/React.createElement(ImpersonationBanner, {
    tenant: impersonating,
    onExit: () => {
      setImpersonating(null);
      go("/admin");
    }
  }), /*#__PURE__*/React.createElement(Topbar, {
    crumbs: crumbs,
    lang: lang,
    setLang: setLang,
    profileComplete: profileComplete,
    go: go
  }), page), tenantPickerOpen && /*#__PURE__*/React.createElement(TenantPicker, {
    onPick: t => {
      setTenant(t);
      setTenantPickerOpen(false);
      go("/");
    },
    onClose: () => setTenantPickerOpen(false)
  }), /*#__PURE__*/React.createElement(Tweaks, {
    show: tweaksOpen,
    tweaks: tweaks,
    setTweaks: setTweaks,
    close: () => setTweaksOpen(false)
  }));
};
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/A/app.jsx", error: String((e && e.message) || e) }); }

// prototypes/A/components.jsx
try { (() => {
/* global window, React */
const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

// ------- Avatar -------
const Avatar = ({
  name,
  color,
  size = 26
}) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: `hsl(${color || "220 13% 65%"})`,
      color: "white",
      fontWeight: 700,
      fontSize: size * 0.4,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, initials);
};

// ------- Sidebar -------
const Sidebar = ({
  route,
  go,
  tenant,
  setTenantPickerOpen
}) => {
  const Item = ({
    icon,
    label,
    r,
    count,
    badge
  }) => /*#__PURE__*/React.createElement("div", {
    className: "nav-item" + (route.startsWith(r) ? " active" : ""),
    onClick: () => go(r)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17
  }), /*#__PURE__*/React.createElement("span", null, label), count != null && /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, count), badge && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }));
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mark"
  }, "D"), /*#__PURE__*/React.createElement("span", null, "DocuFlow")), /*#__PURE__*/React.createElement("div", {
    className: "tenant-switch",
    onClick: () => setTenantPickerOpen(true),
    title: "Switch tenant"
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      background: `hsl(${tenant.color})`
    }
  }, tenant.name[0]), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, tenant.name), /*#__PURE__*/React.createElement("div", {
    className: "role"
  }, tenant.role)), /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 14
  })), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("p", {
    className: "nav-label"
  }, "Library"), /*#__PURE__*/React.createElement(Item, {
    icon: "home",
    label: "Dashboard",
    r: "/"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "files",
    label: "All documents",
    r: "/documents",
    count: DOCS.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "nav-label"
  }, "Standards"), STANDARDS.map(s => {
    const n = DOCS.filter(d => d.standards.includes(s.key)).length;
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      className: "nav-item" + (route === `/standards/${s.key}` ? " active" : ""),
      onClick: () => go(`/standards/${s.key}`)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 2,
        background: `hsl(${s.color})`
      }
    }), /*#__PURE__*/React.createElement("span", null, s.name), /*#__PURE__*/React.createElement("span", {
      className: "count"
    }, n));
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav-item ims",
    onClick: () => go("/standards/ims")
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: `hsl(var(--palette-amber))`
    }
  }), /*#__PURE__*/React.createElement("span", null, "IMS \xB7 Shared"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "nav-label"
  }, "AI"), /*#__PURE__*/React.createElement(Item, {
    icon: "sparkles",
    label: "AI planner",
    r: "/ai"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "nav-label"
  }, "Admin"), /*#__PURE__*/React.createElement(Item, {
    icon: "users",
    label: "Users & roles",
    r: "/users"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "settings",
    label: "Settings",
    r: "/settings"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "audit",
    label: "Audit log",
    r: "/audit"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "shield",
    label: "Root admin",
    r: "/admin"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "user-avatar"
  }, "MP"), /*#__PURE__*/React.createElement("div", {
    className: "u-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "u-name"
  }, "Marija P."), /*#__PURE__*/React.createElement("div", {
    className: "u-role"
  }, "marija@acme.mk")), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "Sign out"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 16
  }))));
};

// ------- Topbar -------
const Topbar = ({
  crumbs = [],
  right,
  lang,
  setLang,
  profileComplete = true,
  go
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), i === crumbs.length - 1 ? /*#__PURE__*/React.createElement("strong", null, c.label) : /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      c.r && go(c.r);
    }
  }, c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "spacer"
  }), !profileComplete && /*#__PURE__*/React.createElement("button", {
    className: "badge-profile",
    onClick: () => go("/settings")
  }, "Organization profile incomplete"), /*#__PURE__*/React.createElement("div", {
    className: "lang-switch"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "language",
    size: 13
  }), ["EN", "MK", "SQ"].map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    className: lang === l ? "active" : "",
    onClick: () => setLang(l)
  }, l))), right);
};

// ------- Impersonation banner -------
const ImpersonationBanner = ({
  tenant,
  onExit
}) => /*#__PURE__*/React.createElement("div", {
  className: "impersonation"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "shield",
  size: 15
}), /*#__PURE__*/React.createElement("span", null, "Impersonating ", /*#__PURE__*/React.createElement("strong", null, tenant.name), " as ", /*#__PURE__*/React.createElement("strong", null, "admin@", tenant.slug), ". All actions are audited."), /*#__PURE__*/React.createElement("button", {
  onClick: onExit
}, /*#__PURE__*/React.createElement(Icon, {
  name: "exit",
  size: 13
}), " Exit impersonation"));

// ------- Markdown-lite renderer (for AI bubbles) -------
const renderMD = text => {
  // inline: **bold**, `code`, [link](url)
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let h = esc(text);
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // paragraphs by blank lines
  const paras = h.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("");
  return {
    __html: paras
  };
};

// ------- AI message -------
const AIMsg = ({
  role,
  content,
  usage
}) => /*#__PURE__*/React.createElement("div", {
  className: `ai-msg ${role}`
}, /*#__PURE__*/React.createElement("span", {
  className: "av"
}, role === "assistant" ? /*#__PURE__*/React.createElement(Icon, {
  name: "sparkles",
  size: 14
}) : role === "user" ? "MP" : /*#__PURE__*/React.createElement(Icon, {
  name: "shieldExc",
  size: 13
})), /*#__PURE__*/React.createElement("div", {
  className: "bubble"
}, /*#__PURE__*/React.createElement("div", {
  dangerouslySetInnerHTML: renderMD(content)
}), usage && /*#__PURE__*/React.createElement("span", {
  className: "usage"
}, usage)));
const AITyping = () => /*#__PURE__*/React.createElement("div", {
  className: "ai-msg assistant"
}, /*#__PURE__*/React.createElement("span", {
  className: "av"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "sparkles",
  size: 14
})), /*#__PURE__*/React.createElement("div", {
  className: "bubble"
}, /*#__PURE__*/React.createElement("div", {
  className: "ai-typing"
}, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))));

// ------- Proposal checklist -------
const ProposalChecklist = ({
  items,
  onCreate
}) => {
  const [checked, setChecked] = useState(() => items.map(() => true));
  const [created, setCreated] = useState(null);
  const toggle = i => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };
  const selectedCount = checked.filter(Boolean).length;
  const handleCreate = () => {
    const selected = items.filter((_, i) => checked[i]);
    setCreated(selected);
    onCreate && onCreate(selected);
  };
  if (created) {
    return /*#__PURE__*/React.createElement("div", {
      className: "created-links"
    }, /*#__PURE__*/React.createElement("div", {
      className: "head"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14
    }), " Created ", created.length, " documents as drafts"), created.slice(0, 6).map((it, i) => /*#__PURE__*/React.createElement("a", {
      key: i,
      href: "#/documents/d3",
      onClick: e => {
        e.preventDefault();
        window.__goto && window.__goto("/documents/d3");
      }
    }, it.title, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "hsl(var(--color-text-muted))",
        fontWeight: 400
      }
    }, "\xB7 ", it.clause))), created.length > 6 && /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "\u2026 and ", created.length - 6, " more in Drafts"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "proposal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proposal-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, "Proposed documents"), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, selectedCount, " / ", items.length)), /*#__PURE__*/React.createElement("div", {
    className: "proposal-list"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    className: "prop-item" + (checked[i] ? "" : " unchecked")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked[i],
    onChange: () => toggle(i)
  }), /*#__PURE__*/React.createElement("div", {
    className: "prop-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prop-title"
  }, it.title), /*#__PURE__*/React.createElement("div", {
    className: "prop-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "type"
  }, it.type), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "clause"
  }, it.clause), /*#__PURE__*/React.createElement("span", null, "\u2014"), /*#__PURE__*/React.createElement("span", null, it.clauseTitle), /*#__PURE__*/React.createElement("span", {
    className: `obligation ${it.obligation}`
  }, it.obligation)))))), /*#__PURE__*/React.createElement("div", {
    className: "proposal-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary"
  }, selectedCount, " selected \xB7 will be created as drafts with clause references"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: handleCreate,
    disabled: selectedCount === 0
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " Create ", selectedCount)));
};

// ------- AI panel (document chat or general chat variant) -------
const AIPanel = ({
  mode = "document",
  doc,
  locked = false,
  onSeedProposal = false,
  canEdit = true
}) => {
  const [messages, setMessages] = useState(() => {
    if (mode === "document") {
      return [{
        role: "assistant",
        content: `Hi — I can help you draft and edit **${doc?.title || "this document"}**. I can see the current version in your editor when I need to. Ask me anything, or try one of the prompts below.`
      }];
    }
    return [{
      role: "assistant",
      content: "Hi. I help you plan your ISO document set. Tell me about your organization — what's your scope, which standards, any current certifications?"
    }];
  });
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const [proposalShown, setProposalShown] = useState(false);
  const bodyRef = useRef(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, pending]);
  const fakeAssistantReply = async userMsg => {
    // Try real Claude; fall back to canned
    const lower = userMsg.toLowerCase();
    try {
      if (window.claude && window.claude.complete) {
        const sys = mode === "document" ? `You are an ISO document assistant. The user is editing "${doc?.title}" (${doc?.type}, ${doc?.clause || "—"}). Reply briefly (2-3 sentences) in a helpful, plain tone. Use Markdown **bold** sparingly.` : `You are an ISO document planner. Help the user plan a document set. Reply briefly (2-3 sentences). If they ask to generate content, say content generation happens in the document editor. If they mention a standard for the first time, you may propose documents.`;
        const resp = await Promise.race([window.claude.complete({
          messages: [{
            role: "user",
            content: `${sys}\n\nUser: ${userMsg}`
          }]
        }), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000))]);
        return {
          role: "assistant",
          content: resp,
          usage: "~120 tokens"
        };
      }
    } catch (e) {/* fall through */}

    // Canned fallbacks
    if (mode === "general" && (lower.includes("iso 27001") || lower.includes("isms") || lower.includes("set") || lower.includes("propose"))) {
      return {
        role: "assistant",
        content: CANNED_PROPOSAL.intro,
        usage: "tool: propose_document_set",
        tool: "proposal"
      };
    }
    if (mode === "general" && lower.includes("generate")) {
      return {
        role: "assistant",
        content: "To generate content, open the specific document and use the chat there. I can help you plan the structure here, but content generation happens in the document editor."
      };
    }
    if (mode === "document" && (lower.includes("rewrite") || lower.includes("draft") || lower.includes("generate") || lower.includes("improve"))) {
      return {
        role: "assistant",
        content: "I can draft this section for you. I've updated the risk methodology with a qualitative 5×5 matrix and added roles & records sections. **Preview it in the editor — nothing is saved until you accept.**",
        usage: "1,284 tokens"
      };
    }
    return {
      role: "assistant",
      content: "Got it. What would you like next — a summary of the current section, a rewrite in plainer language, or help mapping this to a specific ISO clause?",
      usage: "~90 tokens"
    };
  };
  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    setMessages(m => [...m, {
      role: "user",
      content: trimmed
    }]);
    setInput("");
    setPending(true);
    const reply = await fakeAssistantReply(trimmed);
    setPending(false);
    setMessages(m => [...m, reply]);
    if (reply.tool === "proposal") setProposalShown(true);
  };
  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Seed proposal immediately if asked (for general chat demo)
  useEffect(() => {
    if (onSeedProposal && !proposalShown) {
      setMessages(m => [...m, {
        role: "user",
        content: "I run a mid-size manufacturer. We're starting ISO 27001 certification. Can you propose a starter set of documents?"
      }, {
        role: "assistant",
        content: CANNED_PROPOSAL.intro,
        usage: "tool: propose_document_set",
        tool: "proposal"
      }]);
      setProposalShown(true);
    }
  }, [onSeedProposal]);
  if (locked) {
    return /*#__PURE__*/React.createElement("aside", {
      className: "ai-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ai-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-avatar"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 15
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "title"
    }, "AI assistant"), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, "Locked"))), /*#__PURE__*/React.createElement("div", {
      className: "ai-locked"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lock-icon"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 24
    })), /*#__PURE__*/React.createElement("h3", null, "Tell me about your organization"), /*#__PURE__*/React.createElement("p", null, "I don't know your organization context yet. ", canEdit ? "Please complete your organization profile to enable AI features." : "Ask your administrator to complete the organization profile."), canEdit && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: () => window.__goto("/settings")
    }, "Complete profile")));
  }
  const quickPrompts = mode === "document" ? ["Rewrite section 3 in plainer language", "Summarise this document", "Map to ISO 27001 A.8.24"] : ["Propose docs for ISO 27001", "What's missing from my ISMS?", "Translate to Macedonian"];
  return /*#__PURE__*/React.createElement("aside", {
    className: "ai-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-avatar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, mode === "document" ? "Document chat" : "AI planner"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, mode === "document" ? doc?.title : "General · Acme ISMS")), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "History"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "audit",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "New conversation"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ai-body",
    ref: bodyRef
  }, messages.map((m, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement(AIMsg, m), m.tool === "proposal" && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 36
    }
  }, /*#__PURE__*/React.createElement(ProposalChecklist, {
    items: CANNED_PROPOSAL.items
  })))), pending && /*#__PURE__*/React.createElement(AITyping, null), messages.length <= 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: 8
    }
  }, quickPrompts.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "chip",
    style: {
      alignSelf: "flex-start"
    },
    onClick: () => {
      setInput(p);
      setTimeout(send, 50);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 11
  }), " ", p)))), /*#__PURE__*/React.createElement("div", {
    className: "ai-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-input-wrap"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: onKey,
    placeholder: mode === "document" ? "Ask about this document…" : "Describe your scope, ask for a doc set…"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ai-send",
    onClick: send,
    disabled: !input.trim() || pending
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, /*#__PURE__*/React.createElement("kbd", null, "Enter"), " send \xB7 ", /*#__PURE__*/React.createElement("kbd", null, "Shift + Enter"), " new line", mode === "document" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "draft_content sent with every message")))));
};

// ------- Tweaks panel -------
const Tweaks = ({
  show,
  tweaks,
  setTweaks,
  close
}) => {
  if (!show) return null;
  const Seg = ({
    label,
    k,
    opts
  }) => /*#__PURE__*/React.createElement("div", {
    className: "tweak-row"
  }, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.v,
    className: tweaks[k] === o.v ? "active" : "",
    onClick: () => setTweaks({
      ...tweaks,
      [k]: o.v
    })
  }, o.label))));
  return /*#__PURE__*/React.createElement("div", {
    className: "tweaks-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tweaks-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, "Tweaks"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: close
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tweaks-body"
  }, /*#__PURE__*/React.createElement(Seg, {
    label: "Dashboard layout",
    k: "layout",
    opts: [{
      v: "shelves",
      label: "Shelves"
    }, {
      v: "cards",
      label: "Cards"
    }, {
      v: "kanban",
      label: "Kanban"
    }, {
      v: "table",
      label: "Table"
    }]
  }), /*#__PURE__*/React.createElement(Seg, {
    label: "Density",
    k: "density",
    opts: [{
      v: "compact",
      label: "Compact"
    }, {
      v: "comfortable",
      label: "Cozy"
    }, {
      v: "spacious",
      label: "Roomy"
    }]
  }), /*#__PURE__*/React.createElement(Seg, {
    label: "Theme",
    k: "theme",
    opts: [{
      v: "light",
      label: "Light"
    }, {
      v: "dark",
      label: "Dark"
    }]
  })));
};
Object.assign(window, {
  Avatar,
  Sidebar,
  Topbar,
  ImpersonationBanner,
  AIMsg,
  AITyping,
  ProposalChecklist,
  AIPanel,
  Tweaks,
  renderMD
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/A/components.jsx", error: String((e && e.message) || e) }); }

// prototypes/A/data.js
try { (() => {
/* global window */
// Mock data for DocuFlow Prototype A

const ICONS = {
  home: "M5 12l-2 0l9 -9l9 9l-2 0M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6",
  files: "M14 3v4a1 1 0 0 0 1 1h4M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2zM9 17h6M9 13h6",
  message: "M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4M8 9h8M8 13h6",
  users: "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0 -3 -3.85",
  settings: "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065zM9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",
  audit: "M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2zM9 12l2 2l4 -4",
  shield: "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06M15 19l2 2l4 -4",
  search: "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M21 21l-6 -6",
  plus: "M12 5l0 14M5 12l14 0",
  send: "M10 14l11 -11M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5",
  sparkles: "M16 18a2 2 0 0 1 2 2M20 18a2 2 0 0 0 -2 2M16 14a2 2 0 0 0 2 2M20 14a2 2 0 0 1 -2 2M6 10a4 4 0 0 1 4 4M14 10a4 4 0 0 0 -4 4M6 10a4 4 0 0 0 4 -4M14 10a4 4 0 0 1 -4 -4",
  shelf: "M5 3h14M5 21h14M5 12h14M6 3v18M18 3v18",
  building: "M3 21l18 0M9 8l1 0M9 12l1 0M9 16l1 0M14 8l1 0M14 12l1 0M14 16l1 0M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16",
  book: "M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6l0 13M12 6l0 13M21 6l0 13",
  bold: "M7 5h6a3.5 3.5 0 0 1 0 7h-6zM13 12h1a3.5 3.5 0 0 1 0 7h-7v-7",
  italic: "M11 5l6 0M7 19l6 0M14 5l-4 14",
  list: "M9 6l11 0M9 12l11 0M9 18l11 0M5 6l0 .01M5 12l0 .01M5 18l0 .01",
  heading: "M6 4l0 16M18 4l0 16M6 12l12 0",
  link: "M9 15l6 -6M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463",
  check: "M5 12l5 5l10 -10",
  grid: "M4 4h6v6h-6zM14 4h6v6h-6zM4 14h6v6h-6zM14 14h6v6h-6z",
  rows: "M4 4h16v4h-16zM4 12h16v4h-16z",
  kanban: "M4 4h4v16h-4zM10 4h4v10h-4zM16 4h4v6h-4z",
  table: "M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2zM3 10h18M10 3v18",
  chev: "M6 9l6 6l6 -6",
  user: "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",
  shieldExc: "M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3M12 8v4M12 16v.01",
  lock: "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2zM11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0M8 11v-4a4 4 0 1 1 8 0v4",
  edit: "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97L9 12v3h3zM16 5l3 3",
  trash: "M4 7l16 0M10 11l0 6M14 11l0 6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
  exit: "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2M7 12h14l-3 -3M18 15l3 -3",
  robot: "M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2zM21 10h-1v3h-1M3 10h1v3h1M7 16h10a2 2 0 0 1 2 2v2h-14v-2a2 2 0 0 1 2 -2M10 13a1 1 0 1 0 2 0a1 1 0 0 0 -2 0M14 13a1 1 0 1 0 2 0a1 1 0 0 0 -2 0",
  language: "M4 5h7M9 3v2c0 4.418 -2.239 8 -5 8M5 9c0 2.144 2.952 3.908 6.7 4M12 20l4 -9l4 9M19.1 18h-6.2",
  moreH: "M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  x: "M18 6l-12 12M6 6l12 12",
  logout: "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2M9 12h12l-3 -3M18 15l3 -3",
  cert: "M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M13 17.5v4.5l2 -1.5l2 1.5v-4.5M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v6M14 8h-10M9 11h-5"
};
const Icon = ({
  name,
  size = 16,
  stroke = 1.6
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: stroke,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: ICONS[name] || ICONS.files
}));
const TENANTS = [{
  id: "acme",
  name: "Acme Industries",
  slug: "acme",
  industry: "Manufacturing",
  role: "Administrator",
  users: 24,
  docs: 148,
  color: "var(--palette-coral)"
}, {
  id: "northstar",
  name: "Northstar Health",
  slug: "northstar",
  industry: "Healthcare",
  role: "Editor",
  users: 58,
  docs: 312,
  color: "var(--palette-jade)"
}, {
  id: "lumen",
  name: "Lumen Energy d.o.o.",
  slug: "lumen-energy",
  industry: "Energy",
  role: "Reviewer",
  users: 12,
  docs: 62,
  color: "var(--palette-amber)"
}];
const STANDARDS = [{
  key: "iso27001",
  name: "ISO 27001",
  full: "ISO/IEC 27001:2022",
  color: "var(--palette-violet)",
  cls: "entity-iso27001"
}, {
  key: "iso9001",
  name: "ISO 9001",
  full: "ISO 9001:2015",
  color: "var(--palette-azure)",
  cls: "entity-iso9001"
}, {
  key: "iso20000",
  name: "ISO 20000",
  full: "ISO/IEC 20000-1:2018",
  color: "var(--palette-teal)",
  cls: "entity-iso20000"
}, {
  key: "iso45001",
  name: "ISO 45001",
  full: "ISO 45001:2018",
  color: "var(--palette-rose)",
  cls: "entity-iso45001"
}];
const DOCS = [
// ISO 27001
{
  id: "d1",
  num: "ISMS-POL-001",
  title: "ISMS Scope Statement",
  type: "policy",
  standards: ["iso27001"],
  clause: "4.3",
  clauseTitle: "Determining the scope of the ISMS",
  obligation: "shall",
  status: "approved",
  version: "2.0",
  updated: "2 d ago",
  owner: "MP"
}, {
  id: "d2",
  num: "ISMS-POL-002",
  title: "Information Security Policy",
  type: "policy",
  standards: ["iso27001", "iso9001"],
  clause: "5.2",
  clauseTitle: "Information security policy",
  obligation: "shall",
  status: "approved",
  version: "1.4",
  updated: "1 w ago",
  owner: "MP"
}, {
  id: "d3",
  num: "ISMS-PRO-003",
  title: "Risk Assessment Methodology",
  type: "procedure",
  standards: ["iso27001"],
  clause: "6.1.2",
  clauseTitle: "Information security risk assessment",
  obligation: "shall",
  status: "review",
  version: "1.1-draft",
  updated: "3 h ago",
  owner: "EK"
}, {
  id: "d4",
  num: "ISMS-POL-004",
  title: "Access Control Policy",
  type: "policy",
  standards: ["iso27001"],
  clause: "A.8.3",
  clauseTitle: "Information access restriction",
  obligation: "should",
  status: "approved",
  version: "1.2",
  updated: "2 w ago",
  owner: "DJ"
}, {
  id: "d5",
  num: "ISMS-PRO-005",
  title: "Incident Response Procedure",
  type: "procedure",
  standards: ["iso27001"],
  clause: "A.5.24",
  clauseTitle: "Planning and preparation",
  obligation: "shall",
  status: "draft",
  version: "0.3",
  updated: "yesterday",
  owner: "EK"
}, {
  id: "d6",
  num: "ISMS-WI-006",
  title: "Cryptographic Controls Guide",
  type: "work instruction",
  standards: ["iso27001"],
  clause: "A.8.24",
  clauseTitle: "Use of cryptography",
  obligation: "should",
  status: "approved",
  version: "1.0",
  updated: "1 mo ago",
  owner: "AI"
}, {
  id: "d7",
  num: "ISMS-REC-007",
  title: "Acceptable Use Acknowledgement",
  type: "record",
  standards: ["iso27001"],
  clause: "A.5.10",
  clauseTitle: "Acceptable use of assets",
  obligation: "shall",
  status: "approved",
  version: "1.0",
  updated: "2 mo ago",
  owner: "SP"
},
// ISO 9001
{
  id: "d8",
  num: "QMS-POL-001",
  title: "Quality Policy",
  type: "policy",
  standards: ["iso9001"],
  clause: "5.2",
  clauseTitle: "Policy",
  obligation: "shall",
  status: "approved",
  version: "1.0",
  updated: "2 mo ago",
  owner: "DJ"
}, {
  id: "d9",
  num: "QMS-PRO-002",
  title: "Nonconformity & Corrective Action",
  type: "procedure",
  standards: ["iso9001"],
  clause: "10.2",
  clauseTitle: "Nonconformity and corrective action",
  obligation: "shall",
  status: "review",
  version: "2.1-draft",
  updated: "4 h ago",
  owner: "SP"
}, {
  id: "d10",
  num: "QMS-REC-003",
  title: "Management Review Minutes — Q1 2026",
  type: "record",
  standards: ["iso9001"],
  clause: "9.3",
  clauseTitle: "Management review",
  obligation: "shall",
  status: "draft",
  version: "0.1",
  updated: "today",
  owner: "MP"
},
// ISO 20000
{
  id: "d11",
  num: "ITSM-POL-001",
  title: "Service Management Policy",
  type: "policy",
  standards: ["iso20000"],
  clause: "5.2",
  clauseTitle: "SMS policy",
  obligation: "shall",
  status: "approved",
  version: "1.0",
  updated: "3 w ago",
  owner: "AI"
}, {
  id: "d12",
  num: "ITSM-PRO-002",
  title: "Change Management Procedure",
  type: "procedure",
  standards: ["iso20000", "iso27001"],
  clause: "8.5.1",
  clauseTitle: "Change management",
  obligation: "shall",
  status: "approved",
  version: "1.1",
  updated: "1 w ago",
  owner: "AI"
}];

// Group by standard; IMS shelf = docs with 2+ standards
const shelves = () => {
  const out = STANDARDS.map(s => ({
    key: s.key,
    standard: s,
    docs: DOCS.filter(d => d.standards.includes(s.key))
  }));
  const ims = DOCS.filter(d => d.standards.length >= 2);
  if (ims.length) {
    out.push({
      key: "ims",
      standard: {
        key: "ims",
        name: "IMS · Shared documents",
        full: "Integrated Management System",
        color: "var(--palette-amber)",
        cls: "entity-ims"
      },
      docs: ims,
      isIMS: true
    });
  }
  return out;
};

// Canned AI conversation for document chat
const DOC_CONTENT_STARTER = `<h2>1. Purpose</h2>
<p>This procedure defines how <strong>Acme Industries</strong> performs information security risk assessments across its scope of certification, in order to identify, analyse, and evaluate risks to the confidentiality, integrity, and availability of information assets.</p>

<h2>2. Scope</h2>
<p>Applies to all information assets, processes, and systems within the ISMS boundary, including on-premises infrastructure, SaaS providers processing Acme data, and third-party service providers under contract.</p>

<h2>3. Methodology</h2>
<p>Risk is assessed using a qualitative <strong>likelihood × impact</strong> matrix. The assessment is repeated at least annually and whenever a significant change occurs.</p>

<h3>3.1 Likelihood scale</h3>
<ul>
	<li><strong>Rare (1)</strong> — may occur only in exceptional circumstances</li>
	<li><strong>Unlikely (2)</strong> — could occur at some time</li>
	<li><strong>Possible (3)</strong> — might occur at some time</li>
	<li><strong>Likely (4)</strong> — will probably occur in most circumstances</li>
	<li><strong>Almost certain (5)</strong> — expected to occur in most circumstances</li>
</ul>

<h3>3.2 Impact scale</h3>
<p>Impact is assessed across three dimensions: <strong>financial</strong>, <strong>operational</strong>, and <strong>reputational</strong>. The overall impact is the highest score across the three.</p>

<h2>4. Roles & responsibilities</h2>
<p>The <strong>Risk Owner</strong> is responsible for accepting, treating, or transferring identified risks. The <strong>ISMS Manager</strong> maintains the risk register and reviews it quarterly.</p>

<h2>5. Records</h2>
<p>All risk assessments are retained for a minimum of three years and linked to the associated <a href="#">Statement of Applicability</a>.</p>`;

// Canned chat for the general AI chat, including a proposal
const CANNED_PROPOSAL = {
  intro: "Based on your scope — **ISO 27001:2022** for a mid-size industrial manufacturer — here's a starter set. Each row shows the clause it addresses and whether ISO 27001 treats it as mandatory (`shall`), recommended (`should`), or permitted (`may`). Untick anything you already cover.",
  items: [{
    title: "ISMS Scope Statement",
    type: "policy",
    standard: "ISO 27001",
    clause: "4.3",
    clauseTitle: "Determining the scope of the ISMS",
    obligation: "shall"
  }, {
    title: "Information Security Policy",
    type: "policy",
    standard: "ISO 27001",
    clause: "5.2",
    clauseTitle: "Information security policy",
    obligation: "shall"
  }, {
    title: "Risk Assessment Methodology",
    type: "procedure",
    standard: "ISO 27001",
    clause: "6.1.2",
    clauseTitle: "Information security risk assessment",
    obligation: "shall"
  }, {
    title: "Statement of Applicability",
    type: "record",
    standard: "ISO 27001",
    clause: "6.1.3",
    clauseTitle: "Information security risk treatment",
    obligation: "shall"
  }, {
    title: "Access Control Policy",
    type: "policy",
    standard: "ISO 27001",
    clause: "A.5.15",
    clauseTitle: "Access control",
    obligation: "should"
  }, {
    title: "Asset Inventory",
    type: "record",
    standard: "ISO 27001",
    clause: "A.5.9",
    clauseTitle: "Inventory of information and assets",
    obligation: "shall"
  }, {
    title: "Incident Response Procedure",
    type: "procedure",
    standard: "ISO 27001",
    clause: "A.5.24",
    clauseTitle: "Planning and preparation",
    obligation: "shall"
  }, {
    title: "Business Continuity Plan",
    type: "policy",
    standard: "ISO 27001",
    clause: "A.5.29",
    clauseTitle: "ICT readiness for business continuity",
    obligation: "should"
  }, {
    title: "Cryptographic Controls Guide",
    type: "work instruction",
    standard: "ISO 27001",
    clause: "A.8.24",
    clauseTitle: "Use of cryptography",
    obligation: "should"
  }, {
    title: "Supplier Security Agreement Template",
    type: "form",
    standard: "ISO 27001",
    clause: "A.5.20",
    clauseTitle: "Addressing information security within supplier agreements",
    obligation: "shall"
  }]
};
Object.assign(window, {
  Icon,
  ICONS,
  TENANTS,
  STANDARDS,
  DOCS,
  shelves,
  DOC_CONTENT_STARTER,
  CANNED_PROPOSAL
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/A/data.js", error: String((e && e.message) || e) }); }

// prototypes/A/screens.jsx
try { (() => {
/* global window, React */
const {
  useMemo: useMemo2,
  useState: useState2,
  useRef: useRef2
} = React;

// ------- Dashboard shelves layout -------
const ShelfHead = ({
  shelf
}) => /*#__PURE__*/React.createElement("div", {
  className: "shelf-head" + (shelf.isIMS ? " ims-badge" : "")
}, /*#__PURE__*/React.createElement("span", {
  className: "icon"
}, /*#__PURE__*/React.createElement(Icon, {
  name: shelf.isIMS ? "building" : "cert",
  size: 17
})), /*#__PURE__*/React.createElement("h2", null, shelf.standard.full), /*#__PURE__*/React.createElement("span", {
  className: "stat"
}, "\xB7 ", shelf.docs.length, " documents"), /*#__PURE__*/React.createElement("span", {
  className: "spacer"
}), shelf.isIMS && /*#__PURE__*/React.createElement("span", {
  className: "tag"
}, "Auto \xB7 shared"));
const ShelfView = ({
  shelf,
  go
}) => /*#__PURE__*/React.createElement("section", {
  className: "shelf",
  style: {
    "--entity-color": shelf.standard.color
  }
}, /*#__PURE__*/React.createElement(ShelfHead, {
  shelf: shelf
}), /*#__PURE__*/React.createElement("div", {
  className: "shelf-body grid"
}, shelf.docs.map(d => /*#__PURE__*/React.createElement("div", {
  key: d.id,
  className: "doc-cell",
  onClick: () => go(`/documents/${d.id}`)
}, /*#__PURE__*/React.createElement("div", {
  className: "doc-head"
}, /*#__PURE__*/React.createElement("span", {
  className: "num"
}, d.num), /*#__PURE__*/React.createElement("span", {
  className: "title"
}, d.title)), /*#__PURE__*/React.createElement("div", {
  className: "meta"
}, /*#__PURE__*/React.createElement("span", {
  className: "type"
}, d.type), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
  className: "clause"
}, d.clause), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
  className: "status-chip " + d.status
}, d.status))))));

// ------- Card view -------
const CardView = ({
  shelf,
  go
}) => /*#__PURE__*/React.createElement("section", {
  className: "shelf",
  style: {
    "--entity-color": shelf.standard.color
  }
}, /*#__PURE__*/React.createElement(ShelfHead, {
  shelf: shelf
}), /*#__PURE__*/React.createElement("div", {
  className: "shelf-body cards"
}, shelf.docs.map(d => /*#__PURE__*/React.createElement("article", {
  key: d.id,
  className: "card",
  onClick: () => go(`/documents/${d.id}`)
}, /*#__PURE__*/React.createElement("div", {
  className: "doc-head"
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "num"
}, d.num, " \xB7 v", d.version), /*#__PURE__*/React.createElement("div", {
  className: "title"
}, d.title)), /*#__PURE__*/React.createElement("span", {
  className: "status-chip " + d.status
}, d.status)), /*#__PURE__*/React.createElement("div", {
  className: "meta-row"
}, /*#__PURE__*/React.createElement("span", {
  className: "clause"
}, d.clause, " \xB7 ", d.type), /*#__PURE__*/React.createElement("span", null, d.updated))))));

// ------- Kanban view -------
const KanbanView = ({
  shelf,
  go
}) => {
  const cols = ["draft", "review", "approved", "obsolete"];
  const by = Object.fromEntries(cols.map(c => [c, shelf.docs.filter(d => d.status === c)]));
  return /*#__PURE__*/React.createElement("section", {
    className: "shelf",
    style: {
      "--entity-color": shelf.standard.color
    }
  }, /*#__PURE__*/React.createElement(ShelfHead, {
    shelf: shelf
  }), /*#__PURE__*/React.createElement("div", {
    className: "kanban-cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    className: "kanban-col " + c
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("span", null, c), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, by[c].length)), by[c].map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "kanban-card",
    onClick: () => go(`/documents/${d.id}`)
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, d.title), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("span", null, d.clause), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "v", d.version)))), by[c].length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "hsl(var(--color-text-muted))",
      padding: 8
    }
  }, "\u2014")))));
};

// ------- Table view -------
const TableView = ({
  shelf,
  go
}) => /*#__PURE__*/React.createElement("section", {
  className: "shelf",
  style: {
    "--entity-color": shelf.standard.color
  }
}, /*#__PURE__*/React.createElement(ShelfHead, {
  shelf: shelf
}), /*#__PURE__*/React.createElement("div", {
  className: "shelf-body table-wrap"
}, /*#__PURE__*/React.createElement("table", {
  className: "doc-table"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
  style: {
    width: 130
  }
}, "Doc #"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 90
  }
}, "Clause"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 110
  }
}, "Type"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 80
  }
}, "Version"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 110
  }
}, "Status"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 100
  }
}, "Updated"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 50
  }
}, "Owner"))), /*#__PURE__*/React.createElement("tbody", null, shelf.docs.map(d => /*#__PURE__*/React.createElement("tr", {
  key: d.id,
  onClick: () => go(`/documents/${d.id}`)
}, /*#__PURE__*/React.createElement("td", {
  className: "num"
}, d.num), /*#__PURE__*/React.createElement("td", {
  className: "title"
}, d.title), /*#__PURE__*/React.createElement("td", {
  className: "clause"
}, d.clause), /*#__PURE__*/React.createElement("td", {
  className: "type"
}, d.type), /*#__PURE__*/React.createElement("td", {
  className: "num"
}, d.version), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
  className: "status-chip " + d.status
}, d.status)), /*#__PURE__*/React.createElement("td", {
  style: {
    color: "hsl(var(--color-text-muted))"
  }
}, d.updated), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Avatar, {
  name: d.owner,
  color: "var(--palette-violet)",
  size: 24
}))))))));

// ------- Dashboard -------
const Dashboard = ({
  go,
  layout,
  setLayout
}) => {
  const data = useMemo2(() => shelves(), []);
  const totals = useMemo2(() => ({
    total: DOCS.length,
    approved: DOCS.filter(d => d.status === "approved").length,
    review: DOCS.filter(d => d.status === "review").length,
    draft: DOCS.filter(d => d.status === "draft").length
  }), []);
  const LayoutBtn = ({
    v,
    icon,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    className: layout === v ? "active" : "",
    onClick: () => setLayout(v),
    title: label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 13
  }), " ", label);
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Documents"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, totals.total, " documents \xB7 ", totals.approved, " approved \xB7 ", totals.review, " in review \xB7 ", totals.draft, " drafts")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "layout-picker"
  }, /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "shelves",
    icon: "rows",
    label: "Shelves"
  }), /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "cards",
    icon: "grid",
    label: "Cards"
  }), /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "kanban",
    icon: "kanban",
    label: "Kanban"
  }), /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "table",
    icon: "table",
    label: "Table"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => go("/ai")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13
  }), " AI planner"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => go("/documents/new")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " New document"))), /*#__PURE__*/React.createElement("div", {
    className: "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search documents by title, clause, or number\u2026"
  })), /*#__PURE__*/React.createElement("span", {
    className: "chip active"
  }, "All standards ", /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, "Status: any"), /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, "Owner: anyone"), /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, "Updated: this year")), data.map(s => {
    if (layout === "cards") return /*#__PURE__*/React.createElement(CardView, {
      key: s.key,
      shelf: s,
      go: go
    });
    if (layout === "kanban") return /*#__PURE__*/React.createElement(KanbanView, {
      key: s.key,
      shelf: s,
      go: go
    });
    if (layout === "table") return /*#__PURE__*/React.createElement(TableView, {
      key: s.key,
      shelf: s,
      go: go
    });
    return /*#__PURE__*/React.createElement(ShelfView, {
      key: s.key,
      shelf: s,
      go: go
    });
  }));
};

// ------- Document editor (with AI panel) -------
const DocumentEditor = ({
  doc,
  go,
  locked = false,
  aiMode
}) => {
  const [content, setContent] = useState2(DOC_CONTENT_STARTER);
  const editorRef = useRef2(null);
  const ToolBtn = ({
    icon,
    label,
    active,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    className: "t-btn" + (active ? " active" : ""),
    onClick: onClick,
    title: label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "editor-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-toolbar"
  }, /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "heading",
    label: "Heading"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "bold",
    label: "Bold",
    active: true
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "italic",
    label: "Italic"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "list",
    label: "List"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "link",
    label: "Link"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }), /*#__PURE__*/React.createElement("button", {
    className: "t-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 14
  }), " Ask AI"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "status-chip draft plain",
    style: {
      background: "hsl(var(--color-neutral-150))",
      color: "hsl(var(--color-neutral-700))"
    }
  }, doc.status, " \xB7 v", doc.version), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Save draft"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " Submit for review")), /*#__PURE__*/React.createElement("div", {
    className: "doc-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc-meta-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "status-chip draft plain",
    style: {
      background: doc.status === "approved" ? "hsl(var(--color-success-light))" : "hsl(var(--color-warning-light))",
      color: doc.status === "approved" ? "hsl(var(--color-success-hover))" : "hsl(var(--color-warning-hover))"
    }
  }, doc.status), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "clause"
  }, doc.clause, " \u2014 ", doc.clauseTitle), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: `obligation ${doc.obligation}`
  }, doc.obligation), doc.standards.map(s => {
    const std = STANDARDS.find(x => x.key === s);
    return std ? /*#__PURE__*/React.createElement("span", {
      key: s,
      className: "doc-entity-tag " + std.cls
    }, std.name) : null;
  })), /*#__PURE__*/React.createElement("input", {
    className: "doc-title-input",
    defaultValue: doc.title,
    placeholder: "Document title"
  }), /*#__PURE__*/React.createElement("dl", {
    className: "doc-meta-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("dt", null, "Doc number"), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12.5
    }
  }, doc.num)), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("dt", null, "Type"), /*#__PURE__*/React.createElement("dd", {
    style: {
      textTransform: "capitalize"
    }
  }, doc.type)), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("dt", null, "Version"), /*#__PURE__*/React.createElement("dd", null, doc.version)), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("dt", null, "Owner"), /*#__PURE__*/React.createElement("dd", null, doc.owner, " \xB7 Marija P.")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("dt", null, "Language"), /*#__PURE__*/React.createElement("dd", null, "EN \xB7 mk, sq available")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("dt", null, "Classification"), /*#__PURE__*/React.createElement("dd", null, "Internal")))), /*#__PURE__*/React.createElement("div", {
    className: "doc-body",
    contentEditable: true,
    suppressContentEditableWarning: true,
    ref: editorRef,
    onInput: e => setContent(e.currentTarget.innerHTML),
    dangerouslySetInnerHTML: {
      __html: content
    }
  })), /*#__PURE__*/React.createElement(AIPanel, {
    mode: aiMode || "document",
    doc: doc,
    locked: locked
  }));
};

// ------- General AI chat (full page) -------
const GeneralChatPage = ({
  go,
  locked = false
}) => /*#__PURE__*/React.createElement("div", {
  className: "content",
  style: {
    padding: 0,
    display: "flex"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "24px 28px 12px"
  }
}, /*#__PURE__*/React.createElement("h1", {
  style: {
    fontSize: 22,
    margin: 0,
    letterSpacing: "-0.02em"
  }
}, "AI planner"), /*#__PURE__*/React.createElement("p", {
  className: "sub",
  style: {
    margin: "4px 0 14px"
  }
}, "Plan your document set. Ask about standards, clauses, obligations \u2014 I'll propose documents you can create with one click."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap"
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "chip active"
}, "Today \xB7 Acme ISMS set-up"), /*#__PURE__*/React.createElement("span", {
  className: "chip"
}, "Yesterday \xB7 9001 gap analysis"), /*#__PURE__*/React.createElement("span", {
  className: "chip"
}, "Last week \xB7 Multi-standard review"), /*#__PURE__*/React.createElement("span", {
  className: "chip",
  style: {
    marginLeft: "auto"
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "plus",
  size: 11
}), " New conversation"))), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minHeight: 0
  }
}, /*#__PURE__*/React.createElement(AIPanel, {
  mode: "general",
  locked: locked,
  onSeedProposal: true
}))));

// ------- Tenant picker -------
const TenantPicker = ({
  onPick,
  onClose
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    background: "hsl(220 40% 15% / 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  onClick: onClose
}, /*#__PURE__*/React.createElement("div", {
  className: "picker-card",
  onClick: e => e.stopPropagation()
}, /*#__PURE__*/React.createElement("div", {
  className: "brand-big"
}, /*#__PURE__*/React.createElement("span", {
  className: "mark"
}, "D"), "DocuFlow"), /*#__PURE__*/React.createElement("h1", null, "Choose a workspace"), /*#__PURE__*/React.createElement("p", {
  className: "sub"
}, "You're a member of ", TENANTS.length, " organizations. Pick one to continue."), TENANTS.map(t => /*#__PURE__*/React.createElement("div", {
  key: t.id,
  className: "tenant-option",
  onClick: () => onPick(t)
}, /*#__PURE__*/React.createElement("span", {
  className: "avatar",
  style: {
    background: `hsl(${t.color})`
  }
}, t.name[0]), /*#__PURE__*/React.createElement("div", {
  className: "meta"
}, /*#__PURE__*/React.createElement("div", {
  className: "name"
}, t.name), /*#__PURE__*/React.createElement("div", {
  className: "info"
}, t.industry, " \xB7 ", t.users, " users \xB7 ", t.docs, " documents")), /*#__PURE__*/React.createElement("span", {
  className: "role"
}, t.role))), /*#__PURE__*/React.createElement("div", {
  className: "picker-foot"
}, /*#__PURE__*/React.createElement("span", null, "Signed in as marija@acme.mk"), /*#__PURE__*/React.createElement("a", {
  href: "#"
}, "Sign out"))));

// ------- Settings (org profile) -------
const SettingsPage = ({
  go,
  profileComplete,
  setProfileComplete
}) => {
  const [industry, setIndustry] = useState2(profileComplete ? "manufacturing" : "");
  const [desc, setDesc] = useState2(profileComplete ? "Mid-size industrial manufacturer producing precision components for the automotive and aerospace sectors. 320 employees across 2 sites in Skopje and Bitola." : "");
  const [scope, setScope] = useState2(profileComplete ? "Design, manufacture, and service of precision mechanical components within the ISMS boundary at both production sites, excluding legacy R&D infrastructure." : "");
  const filled = [industry, desc, scope].filter(Boolean).length;
  const pct = Math.round(filled / 3 * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "settings-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Organization profile"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "The AI uses this context to generate documents that reflect your organization."))), pct < 100 && /*#__PURE__*/React.createElement("div", {
    className: "completeness-banner"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shieldExc",
    size: 18
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Profile ", pct, "% complete."), " AI chat is locked until all three fields are filled."), /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "settings-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Branding"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Shown in document PDFs and in the sidebar."), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, "Logo", /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "PNG, SVG, or WebP \xB7 max 2 MB")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "logo-upload"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-preview has"
  }, "A"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Replace"), /*#__PURE__*/React.createElement("button", {
    className: "btn-subtle btn-sm",
    style: {
      padding: "4px 8px"
    }
  }, "Remove"))))), /*#__PURE__*/React.createElement("div", {
    className: "settings-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Context for AI"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Required. Controls the system prompt."), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, "Industry", /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "Single-select from a fixed list.")), /*#__PURE__*/React.createElement("select", {
    value: industry,
    onChange: e => setIndustry(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select an industry \u2014"), /*#__PURE__*/React.createElement("option", {
    value: "manufacturing"
  }, "Manufacturing"), /*#__PURE__*/React.createElement("option", {
    value: "healthcare"
  }, "Healthcare"), /*#__PURE__*/React.createElement("option", {
    value: "it_technology"
  }, "IT & Technology"), /*#__PURE__*/React.createElement("option", {
    value: "finance_banking"
  }, "Finance & Banking"), /*#__PURE__*/React.createElement("option", {
    value: "education"
  }, "Education"), /*#__PURE__*/React.createElement("option", {
    value: "energy"
  }, "Energy"), /*#__PURE__*/React.createElement("option", {
    value: "other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, "Company description", /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "Max 1000 characters.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: "Who you are, what you do, how big you are\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    className: "char-count"
  }, desc.length, " / 1000"))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, "Scope of work", /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "Max 2000 characters. Used verbatim as ISMS scope.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    value: scope,
    onChange: e => setScope(e.target.value),
    placeholder: "What's in scope? What's excluded?"
  }), /*#__PURE__*/React.createElement("div", {
    className: "char-count"
  }, scope.length, " / 2000"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => {
      setProfileComplete(!!(industry && desc && scope));
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " Save profile")))));
};

// ------- Admin tenants -------
const AdminTenants = ({
  go,
  onImpersonate
}) => /*#__PURE__*/React.createElement("div", {
  className: "content"
}, /*#__PURE__*/React.createElement("div", {
  className: "page-head"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Tenants"), /*#__PURE__*/React.createElement("p", {
  className: "sub"
}, "Root admin \xB7 3 tenants \xB7 522 users \xB7 2.4 GB storage")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("button", {
  className: "btn btn-ghost"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "settings",
  size: 13
}), " Packages"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-primary"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "plus",
  size: 13
}), " Create tenant"))), /*#__PURE__*/React.createElement("div", {
  className: "filters"
}, /*#__PURE__*/React.createElement("div", {
  className: "search"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "search",
  size: 15
}), /*#__PURE__*/React.createElement("input", {
  placeholder: "Search tenants\u2026"
})), /*#__PURE__*/React.createElement("span", {
  className: "chip active"
}, "All"), /*#__PURE__*/React.createElement("span", {
  className: "chip"
}, "Active"), /*#__PURE__*/React.createElement("span", {
  className: "chip"
}, "Suspended")), /*#__PURE__*/React.createElement("table", {
  className: "admin-table"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Tenant"), /*#__PURE__*/React.createElement("th", null, "Slug"), /*#__PURE__*/React.createElement("th", null, "Package"), /*#__PURE__*/React.createElement("th", {
  className: "num"
}, "Users"), /*#__PURE__*/React.createElement("th", {
  className: "num"
}, "Docs"), /*#__PURE__*/React.createElement("th", null, "Admin"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 200,
    textAlign: "right"
  }
}, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, TENANTS.map(t => /*#__PURE__*/React.createElement("tr", {
  key: t.id
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
  className: "t-name"
}, /*#__PURE__*/React.createElement("span", {
  className: "avatar",
  style: {
    background: `hsl(${t.color})`
  }
}, t.name[0]), /*#__PURE__*/React.createElement("span", null, t.name))), /*#__PURE__*/React.createElement("td", {
  className: "slug"
}, t.slug, ".docuflow.com"), /*#__PURE__*/React.createElement("td", null, t.users > 40 ? "Enterprise" : t.users > 15 ? "Business" : "Starter"), /*#__PURE__*/React.createElement("td", {
  className: "num"
}, t.users), /*#__PURE__*/React.createElement("td", {
  className: "num"
}, t.docs), /*#__PURE__*/React.createElement("td", {
  style: {
    fontSize: 12,
    color: "hsl(var(--color-text-secondary))"
  }
}, "admin@", t.slug), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
  className: "actions"
}, /*#__PURE__*/React.createElement("button", {
  className: "btn-icon",
  title: "Edit"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "edit",
  size: 14
})), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-ghost btn-sm",
  onClick: () => onImpersonate(t)
}, /*#__PURE__*/React.createElement(Icon, {
  name: "user",
  size: 12
}), " Impersonate"), /*#__PURE__*/React.createElement("button", {
  className: "btn-icon",
  title: "More"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "moreH",
  size: 14
})))))))));

// ------- Generic "not built yet" placeholder -------
const Placeholder = ({
  title,
  note
}) => /*#__PURE__*/React.createElement("div", {
  className: "content"
}, /*#__PURE__*/React.createElement("div", {
  className: "page-head"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", {
  className: "sub"
}, note))), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: 60,
    textAlign: "center",
    background: "hsl(var(--color-bg-primary))",
    border: "1px dashed hsl(var(--color-border))",
    borderRadius: "var(--radius-lg)"
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    color: "hsl(var(--color-text-muted))"
  }
}, "This screen is out of scope for the prototype. The navigation is wired so you can return.")));
Object.assign(window, {
  Dashboard,
  DocumentEditor,
  GeneralChatPage,
  TenantPicker,
  SettingsPage,
  AdminTenants,
  Placeholder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/A/screens.jsx", error: String((e && e.message) || e) }); }

// prototypes/B/app.jsx
try { (() => {
/* global window, React, ReactDOM */
const {
  useState: uS,
  useEffect: uE
} = React;
const TWEAK_DEFAULTS_B = /*EDITMODE-BEGIN*/{
  "layout": "shelves",
  "density": "comfortable"
} /*EDITMODE-END*/;
const App = () => {
  const [route, setRoute] = uS(() => {
    try {
      return localStorage.getItem("dfB.route") || "/";
    } catch (e) {
      return "/";
    }
  });
  const [tenant, setTenant] = uS(TENANTS[0]);
  const [pickerOpen, setPickerOpen] = uS(false);
  const [impersonating, setImpersonating] = uS(null);
  const [lang, setLang] = uS("EN");
  const [profileComplete, setProfileComplete] = uS(true);
  const [tweaks, setTweaks] = uS(TWEAK_DEFAULTS_B);
  const [tweaksOpen, setTweaksOpen] = uS(false);
  const go = r => {
    setRoute(r);
    try {
      localStorage.setItem("dfB.route", r);
    } catch (e) {}
  };
  window.__gotoB = go;
  uE(() => {
    const onMsg = e => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({
      type: "__edit_mode_available"
    }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  uE(() => {
    document.documentElement.dataset.density = tweaks.density;
    window.parent.postMessage({
      type: "__edit_mode_set_keys",
      edits: tweaks
    }, "*");
  }, [tweaks]);
  const match = route.match(/^\/documents\/(\w+)$/);
  const doc = match ? DOCS.find(d => d.id === match[1]) : null;
  const crumbs = (() => {
    if (route === "/") return [{
      label: "Front page"
    }];
    if (route === "/ai") return [{
      label: "Editorial AI"
    }];
    if (route === "/settings") return [{
      label: "Administration"
    }, {
      label: "Organization profile"
    }];
    if (route === "/admin") return [{
      label: "Root admin"
    }, {
      label: "Tenants"
    }];
    if (route === "/users") return [{
      label: "Administration"
    }, {
      label: "Users & roles"
    }];
    if (route === "/audit") return [{
      label: "Administration"
    }, {
      label: "Audit log"
    }];
    if (route === "/documents") return [{
      label: "All documents"
    }];
    if (route === "/documents/new") return [{
      label: "Front page",
      r: "/"
    }, {
      label: "New document"
    }];
    if (route.startsWith("/standards/")) {
      const k = route.split("/")[2];
      return [{
        label: "Front page",
        r: "/"
      }, {
        label: k === "ims" ? "IMS · Shared" : k.toUpperCase()
      }];
    }
    if (doc) return [{
      label: "Front page",
      r: "/"
    }, {
      label: doc.num
    }, {
      label: doc.title
    }];
    return [{
      label: "DocuFlow"
    }];
  })();
  const aiLocked = !profileComplete;
  let page;
  if (route === "/") page = /*#__PURE__*/React.createElement(Dashboard, {
    go: go,
    layout: tweaks.layout,
    setLayout: v => setTweaks({
      ...tweaks,
      layout: v
    })
  });else if (route === "/ai") page = /*#__PURE__*/React.createElement(GeneralChat, {
    locked: aiLocked
  });else if (route === "/settings") page = /*#__PURE__*/React.createElement(SettingsPage, {
    profileComplete: profileComplete,
    setProfileComplete: setProfileComplete
  });else if (route === "/admin") page = /*#__PURE__*/React.createElement(AdminTenants, {
    onImpersonate: t => {
      setImpersonating(t);
      setTenant(t);
      go("/");
    }
  });else if (route === "/users") page = /*#__PURE__*/React.createElement(UsersPage, {
    go: go
  });else if (route === "/audit") page = /*#__PURE__*/React.createElement(AuditPage, null);else if (doc) page = /*#__PURE__*/React.createElement(DocumentEditor, {
    doc: doc,
    go: go,
    locked: aiLocked
  });else page = /*#__PURE__*/React.createElement(Placeholder, {
    title: route.slice(1).replace(/\//g, " · ") || "Page",
    note: "This section sits outside the prototype's scope."
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    "data-density": tweaks.density
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    go: go,
    tenant: tenant,
    setTenantPickerOpen: setPickerOpen
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, impersonating && /*#__PURE__*/React.createElement(ImpersonationBanner, {
    tenant: impersonating,
    onExit: () => {
      setImpersonating(null);
      go("/admin");
    }
  }), /*#__PURE__*/React.createElement(Topbar, {
    crumbs: crumbs,
    lang: lang,
    setLang: setLang,
    profileComplete: profileComplete,
    go: go
  }), page), pickerOpen && /*#__PURE__*/React.createElement(TenantPicker, {
    onPick: t => {
      setTenant(t);
      setPickerOpen(false);
      go("/");
    },
    onClose: () => setPickerOpen(false)
  }), /*#__PURE__*/React.createElement(Tweaks, {
    show: tweaksOpen,
    tweaks: tweaks,
    setTweaks: setTweaks,
    close: () => setTweaksOpen(false)
  }));
};
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/B/app.jsx", error: String((e && e.message) || e) }); }

// prototypes/B/components.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global window, React */
const {
  useState,
  useEffect,
  useRef
} = React;

// Avatar
const Avatar = ({
  name,
  size = 28,
  dark
}) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      background: dark ? "hsl(var(--ink))" : "hsl(var(--paper-3))",
      color: dark ? "hsl(var(--paper))" : "hsl(var(--ink))",
      fontFamily: "var(--serif)",
      fontWeight: 600,
      fontSize: size * 0.42,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, initials);
};

// Sidebar
const Sidebar = ({
  route,
  go,
  tenant,
  setTenantPickerOpen
}) => {
  const Item = ({
    icon,
    label,
    r,
    count
  }) => /*#__PURE__*/React.createElement("div", {
    className: "nav-item" + (route === r ? " active" : ""),
    onClick: () => go(r)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, label), count != null && /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, count));
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wordmark"
  }, "Docu", /*#__PURE__*/React.createElement("em", null, "Flow")), /*#__PURE__*/React.createElement("span", {
    className: "issue"
  }, "Vol. II")), /*#__PURE__*/React.createElement("div", {
    className: "masthead",
    onClick: () => setTenantPickerOpen(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "kicker"
  }, "Workspace"), /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, tenant.name), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, tenant.role, " \xB7 ", tenant.industry), /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 13,
    className: "chev"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-label"
  }, "Library"), /*#__PURE__*/React.createElement(Item, {
    icon: "home",
    label: "Front page",
    r: "/"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "files",
    label: "All documents",
    r: "/documents",
    count: DOCS.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav-label"
  }, "Standards"), STANDARDS.map(s => {
    const n = DOCS.filter(d => d.standards.includes(s.key)).length;
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      className: "nav-item" + (route === `/standards/${s.key}` ? " active" : ""),
      onClick: () => go(`/standards/${s.key}`)
    }, /*#__PURE__*/React.createElement("span", {
      className: "nav-swatch",
      style: {
        background: `hsl(${s.key === "iso27001" ? "var(--plum)" : s.key === "iso9001" ? "var(--sea)" : s.key === "iso20000" ? "var(--moss)" : "var(--accent)"})`
      }
    }), /*#__PURE__*/React.createElement("span", null, s.name), /*#__PURE__*/React.createElement("span", {
      className: "count"
    }, n));
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav-item ims-line" + (route === "/standards/ims" ? " active" : ""),
    onClick: () => go("/standards/ims")
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-swatch",
    style: {
      background: "hsl(var(--gold))"
    }
  }), /*#__PURE__*/React.createElement("span", null, "IMS \xB7 Shared"), /*#__PURE__*/React.createElement("span", {
    className: "swatch"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav-label"
  }, "AI"), /*#__PURE__*/React.createElement(Item, {
    icon: "sparkles",
    label: "Editorial AI",
    r: "/ai"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav-label"
  }, "Administration"), /*#__PURE__*/React.createElement(Item, {
    icon: "users",
    label: "Users & roles",
    r: "/users"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "settings",
    label: "Settings",
    r: "/settings"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "audit",
    label: "Audit log",
    r: "/audit"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "shield",
    label: "Root admin",
    r: "/admin"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "av"
  }, "MP"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, "Marija P."), /*#__PURE__*/React.createElement("div", {
    className: "email"
  }, "marija@acme.mk")), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "Sign out"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 14
  }))));
};

// Topbar
const Topbar = ({
  crumbs = [],
  lang,
  setLang,
  profileComplete,
  go
}) => /*#__PURE__*/React.createElement("div", {
  className: "topbar"
}, /*#__PURE__*/React.createElement("div", {
  className: "crumb"
}, crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
  key: i
}, i > 0 && /*#__PURE__*/React.createElement("span", {
  className: "sep"
}, "\u2014"), i === crumbs.length - 1 ? /*#__PURE__*/React.createElement("strong", null, c.label) : /*#__PURE__*/React.createElement("a", {
  href: "#",
  onClick: e => {
    e.preventDefault();
    c.r && go(c.r);
  }
}, c.label)))), /*#__PURE__*/React.createElement("span", {
  className: "spacer"
}), !profileComplete && /*#__PURE__*/React.createElement("button", {
  className: "notice-chip",
  onClick: () => go("/settings")
}, "Profile incomplete"), /*#__PURE__*/React.createElement("div", {
  className: "lang-switch"
}, ["EN", "MK", "SQ"].map(l => /*#__PURE__*/React.createElement("button", {
  key: l,
  className: lang === l ? "active" : "",
  onClick: () => setLang(l)
}, l))));

// Impersonation
const ImpersonationBanner = ({
  tenant,
  onExit
}) => /*#__PURE__*/React.createElement("div", {
  className: "impersonation"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "shield",
  size: 14
}), /*#__PURE__*/React.createElement("span", null, "Impersonating ", /*#__PURE__*/React.createElement("strong", null, tenant.name), ". All actions are audited."), /*#__PURE__*/React.createElement("button", {
  onClick: onExit
}, "Exit"));

// Markdown-lite
const renderMD = text => {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let h = esc(text);
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const paras = h.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("");
  return {
    __html: paras
  };
};
const AIMsg = ({
  role,
  content,
  usage
}) => /*#__PURE__*/React.createElement("div", {
  className: `ai-msg ${role}`
}, /*#__PURE__*/React.createElement("span", {
  className: "av"
}, role === "assistant" ? "AI" : role === "user" ? "MP" : "·"), /*#__PURE__*/React.createElement("div", {
  className: "bubble"
}, /*#__PURE__*/React.createElement("div", {
  dangerouslySetInnerHTML: renderMD(content)
}), usage && /*#__PURE__*/React.createElement("span", {
  className: "usage"
}, usage)));
const AITyping = () => /*#__PURE__*/React.createElement("div", {
  className: "ai-msg assistant"
}, /*#__PURE__*/React.createElement("span", {
  className: "av"
}, "AI"), /*#__PURE__*/React.createElement("div", {
  className: "bubble"
}, /*#__PURE__*/React.createElement("div", {
  className: "ai-typing"
}, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))));

// Proposal checklist
const ProposalChecklist = ({
  items
}) => {
  const [checked, setChecked] = useState(() => items.map(() => true));
  const [created, setCreated] = useState(null);
  const toggle = i => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };
  const selectedCount = checked.filter(Boolean).length;
  const handleCreate = () => setCreated(items.filter((_, i) => checked[i]));
  if (created) {
    return /*#__PURE__*/React.createElement("div", {
      className: "created-links"
    }, /*#__PURE__*/React.createElement("div", {
      className: "head"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    }), " ", created.length, " drafts created"), created.slice(0, 6).map((it, i) => /*#__PURE__*/React.createElement("a", {
      key: i,
      href: "#",
      onClick: e => {
        e.preventDefault();
        window.__gotoB && window.__gotoB("/documents/d3");
      }
    }, it.title, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        opacity: 0.7
      }
    }, "\xB7 ", it.clause))), created.length > 6 && /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "\u2026 and ", created.length - 6, " more"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "proposal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proposal-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kicker"
  }, "Tool \xB7 propose_document_set"), /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, "Proposed ", /*#__PURE__*/React.createElement("em", null, "document set"))), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, selectedCount, " / ", items.length, " selected")), /*#__PURE__*/React.createElement("div", {
    className: "proposal-list"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    className: "prop-item" + (checked[i] ? "" : " unchecked")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked[i],
    onChange: () => toggle(i)
  }), /*#__PURE__*/React.createElement("div", {
    className: "prop-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prop-title"
  }, it.title), /*#__PURE__*/React.createElement("div", {
    className: "prop-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "type"
  }, it.type), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "clause"
  }, it.clause), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, it.clauseTitle), /*#__PURE__*/React.createElement("span", {
    className: `obligation ${it.obligation}`
  }, it.obligation)))))), /*#__PURE__*/React.createElement("div", {
    className: "proposal-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "summary"
  }, selectedCount, " will be created as drafts"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-accent btn-sm",
    onClick: handleCreate,
    disabled: selectedCount === 0
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 11
  }), " Create ", selectedCount)));
};

// AI Drawer (document mode)
const AIDrawer = ({
  doc,
  locked,
  expanded,
  setExpanded
}) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Good day. I'm the editorial AI for **${doc?.title || "this document"}**. I can rewrite sections, map clauses, or draft new content. Nothing is saved until you accept.`
  }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bodyRef = useRef(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, pending]);
  const send = async () => {
    const t = input.trim();
    if (!t || pending) return;
    setMessages(m => [...m, {
      role: "user",
      content: t
    }]);
    setInput("");
    setPending(true);
    let reply = {
      role: "assistant",
      content: "Section rewritten with plainer prose and clearer role language. **Preview it above — nothing is saved until you accept.**",
      usage: "~1,200 tokens"
    };
    try {
      if (window.claude?.complete) {
        const sys = `You are an editorial ISO document AI. Document: "${doc?.title}" (${doc?.clause}). Reply in 2 sentences, plain tone.`;
        const resp = await Promise.race([window.claude.complete({
          messages: [{
            role: "user",
            content: `${sys}\n\nUser: ${t}`
          }]
        }), new Promise((_, rej) => setTimeout(() => rej(), 6000))]);
        reply = {
          role: "assistant",
          content: resp,
          usage: "~120 tokens"
        };
      }
    } catch (e) {}
    setPending(false);
    setMessages(m => [...m, reply]);
  };
  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  if (!expanded) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ai-drawer collapsed",
      onClick: () => setExpanded(true)
    }, /*#__PURE__*/React.createElement("span", {
      className: "rail-dot"
    }), /*#__PURE__*/React.createElement("span", {
      className: "rail-label"
    }, "Editorial ", /*#__PURE__*/React.createElement("em", null, "AI"), " \xB7 Open"));
  }
  if (locked) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ai-drawer expanded"
    }, /*#__PURE__*/React.createElement("div", {
      className: "handle",
      onClick: () => setExpanded(false)
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "title"
    }, "Editorial ", /*#__PURE__*/React.createElement("em", null, "AI")), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, "Locked \xB7 complete profile")), /*#__PURE__*/React.createElement("button", {
      className: "ctrl"
    }, "Close")), /*#__PURE__*/React.createElement("div", {
      className: "ai-locked"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lk"
    }, "Context required"), /*#__PURE__*/React.createElement("h3", null, "Tell me about your organization first"), /*#__PURE__*/React.createElement("p", null, "The AI needs industry, description, and scope to sound like you."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-accent btn-sm",
      onClick: () => window.__gotoB("/settings")
    }, "Complete profile")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ai-drawer expanded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "handle",
    onClick: () => setExpanded(false)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, "Editorial ", /*#__PURE__*/React.createElement("em", null, "AI")), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "This document")), /*#__PURE__*/React.createElement("button", {
    className: "ctrl",
    onClick: e => {
      e.stopPropagation();
    }
  }, "History"), /*#__PURE__*/React.createElement("button", {
    className: "ctrl"
  }, "Close")), /*#__PURE__*/React.createElement("div", {
    className: "ai-body",
    ref: bodyRef
  }, messages.map((m, i) => /*#__PURE__*/React.createElement(AIMsg, _extends({
    key: i
  }, m))), pending && /*#__PURE__*/React.createElement(AITyping, null), messages.length <= 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: 4
    }
  }, ["Rewrite section 3 in plainer language", "Map to ISO 27001 A.8.24", "Summarise this document", "Translate to MK"].map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "ai-suggest",
    onClick: () => {
      setInput(p);
      setTimeout(send, 50);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192"), " ", p)))), /*#__PURE__*/React.createElement("div", {
    className: "ai-composer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-input-wrap"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: onKey,
    placeholder: "Ask the editor\u2026"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ai-send",
    onClick: send,
    disabled: !input.trim() || pending
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ai-hint"
  }, /*#__PURE__*/React.createElement("kbd", null, "\u21B5"), " send \xB7 ", /*#__PURE__*/React.createElement("kbd", null, "\u21E7\u21B5"), " newline")));
};

// Full-page general chat
const GeneralChat = ({
  locked,
  seedProposal = true
}) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Good day. I'm your editorial AI for document planning. Tell me your scope — standards, industry, size — and I'll propose a set."
  }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bodyRef = useRef(null);
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (seedProposal && !seeded) {
      setTimeout(() => {
        setMessages(m => [...m, {
          role: "user",
          content: "Mid-size industrial manufacturer, ~320 employees, starting ISO 27001 certification. What documents do I need?"
        }, {
          role: "assistant",
          content: CANNED_PROPOSAL.intro,
          usage: "tool: propose_document_set",
          tool: "proposal"
        }]);
        setSeeded(true);
      }, 400);
    }
  }, []);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, pending]);
  const send = async () => {
    const t = input.trim();
    if (!t || pending) return;
    setMessages(m => [...m, {
      role: "user",
      content: t
    }]);
    setInput("");
    setPending(true);
    await new Promise(r => setTimeout(r, 900));
    setPending(false);
    setMessages(m => [...m, {
      role: "assistant",
      content: "Noted. If you'd like me to add more documents, describe the gap — I'll propose a smaller amendment set.",
      usage: "~90 tokens"
    }]);
  };
  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  if (locked) {
    return /*#__PURE__*/React.createElement("div", {
      className: "chat-page"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderBottom: "2px solid hsl(var(--ink))",
        paddingBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "hsl(var(--ink-3))",
        marginBottom: 6
      }
    }, "Editorial AI"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--serif)",
        fontSize: 36,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        margin: 0
      }
    }, "General planning")), /*#__PURE__*/React.createElement("div", {
      className: "ai-locked",
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "lk"
    }, "Context required"), /*#__PURE__*/React.createElement("h3", null, "Tell me about your organization first"), /*#__PURE__*/React.createElement("p", null, "I can plan a full document set for you \u2014 but I need the organization profile completed to write anything that sounds like you wrote it."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-accent btn-sm",
      style: {
        alignSelf: "center"
      },
      onClick: () => window.__gotoB("/settings")
    }, "Go to settings")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "chat-page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "2px solid hsl(var(--ink))",
      paddingBottom: 18,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "hsl(var(--ink-3))",
      marginBottom: 6
    }
  }, "Editorial AI \xB7 general planning"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 40,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      margin: 0
    }
  }, "Plan your ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: "hsl(var(--accent))",
      fontStyle: "italic"
    }
  }, "document set")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      color: "hsl(var(--ink-2))",
      margin: "6px 0 0",
      maxWidth: 620,
      fontStyle: "italic"
    }
  }, "Describe your scope. I'll propose documents with clauses, obligations, and a one-click create.")), /*#__PURE__*/React.createElement("div", {
    className: "chat-history-rail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "item active"
  }, "Today \xB7 Acme ISMS"), /*#__PURE__*/React.createElement("span", {
    className: "item"
  }, "Yesterday \xB7 9001 gap"), /*#__PURE__*/React.createElement("span", {
    className: "item"
  }, "Last week \xB7 Supplier DD"), /*#__PURE__*/React.createElement("span", {
    className: "item new"
  }, "+ New conversation")), /*#__PURE__*/React.createElement("div", {
    className: "chat-thread",
    ref: bodyRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, messages.map((m, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement(AIMsg, m), m.tool === "proposal" && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680
    }
  }, /*#__PURE__*/React.createElement(ProposalChecklist, {
    items: CANNED_PROPOSAL.items
  })))), pending && /*#__PURE__*/React.createElement(AITyping, null))), /*#__PURE__*/React.createElement("div", {
    className: "chat-composer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-input-wrap"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: onKey,
    placeholder: "Describe your scope, ask for a set, or request translations\u2026"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ai-send",
    onClick: send,
    disabled: !input.trim() || pending
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ai-hint",
    style: {
      color: "hsl(var(--ink-4))"
    }
  }, /*#__PURE__*/React.createElement("kbd", null, "Enter"), " send \xB7 ", /*#__PURE__*/React.createElement("kbd", null, "Shift+Enter"), " newline \xB7 proposals appear inline")));
};

// Tweaks
const Tweaks = ({
  show,
  tweaks,
  setTweaks,
  close
}) => {
  if (!show) return null;
  const Seg = ({
    label,
    k,
    opts
  }) => /*#__PURE__*/React.createElement("div", {
    className: "tweak-row"
  }, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.v,
    className: tweaks[k] === o.v ? "active" : "",
    onClick: () => setTweaks({
      ...tweaks,
      [k]: o.v
    })
  }, o.label))));
  return /*#__PURE__*/React.createElement("div", {
    className: "tweaks-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tweaks-head"
  }, /*#__PURE__*/React.createElement("span", null, "Tweaks"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: close
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tweaks-body"
  }, /*#__PURE__*/React.createElement(Seg, {
    label: "Dashboard layout",
    k: "layout",
    opts: [{
      v: "shelves",
      label: "Shelves"
    }, {
      v: "cards",
      label: "Cards"
    }, {
      v: "kanban",
      label: "Kanban"
    }, {
      v: "table",
      label: "Table"
    }]
  }), /*#__PURE__*/React.createElement(Seg, {
    label: "Density",
    k: "density",
    opts: [{
      v: "compact",
      label: "Tight"
    }, {
      v: "comfortable",
      label: "Cozy"
    }, {
      v: "spacious",
      label: "Roomy"
    }]
  })));
};
Object.assign(window, {
  Avatar,
  Sidebar,
  Topbar,
  ImpersonationBanner,
  AIMsg,
  AITyping,
  ProposalChecklist,
  AIDrawer,
  GeneralChat,
  Tweaks
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/B/components.jsx", error: String((e && e.message) || e) }); }

// prototypes/B/data.js
try { (() => {
/* global window */
// Mock data for DocuFlow Prototype A

const ICONS = {
  home: "M5 12l-2 0l9 -9l9 9l-2 0M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6",
  files: "M14 3v4a1 1 0 0 0 1 1h4M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2zM9 17h6M9 13h6",
  message: "M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4M8 9h8M8 13h6",
  users: "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0 -3 -3.85",
  settings: "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065zM9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",
  audit: "M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2zM9 12l2 2l4 -4",
  shield: "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06M15 19l2 2l4 -4",
  search: "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M21 21l-6 -6",
  plus: "M12 5l0 14M5 12l14 0",
  send: "M10 14l11 -11M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5",
  sparkles: "M16 18a2 2 0 0 1 2 2M20 18a2 2 0 0 0 -2 2M16 14a2 2 0 0 0 2 2M20 14a2 2 0 0 1 -2 2M6 10a4 4 0 0 1 4 4M14 10a4 4 0 0 0 -4 4M6 10a4 4 0 0 0 4 -4M14 10a4 4 0 0 1 -4 -4",
  shelf: "M5 3h14M5 21h14M5 12h14M6 3v18M18 3v18",
  building: "M3 21l18 0M9 8l1 0M9 12l1 0M9 16l1 0M14 8l1 0M14 12l1 0M14 16l1 0M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16",
  book: "M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6l0 13M12 6l0 13M21 6l0 13",
  bold: "M7 5h6a3.5 3.5 0 0 1 0 7h-6zM13 12h1a3.5 3.5 0 0 1 0 7h-7v-7",
  italic: "M11 5l6 0M7 19l6 0M14 5l-4 14",
  list: "M9 6l11 0M9 12l11 0M9 18l11 0M5 6l0 .01M5 12l0 .01M5 18l0 .01",
  heading: "M6 4l0 16M18 4l0 16M6 12l12 0",
  link: "M9 15l6 -6M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463",
  check: "M5 12l5 5l10 -10",
  grid: "M4 4h6v6h-6zM14 4h6v6h-6zM4 14h6v6h-6zM14 14h6v6h-6z",
  rows: "M4 4h16v4h-16zM4 12h16v4h-16z",
  kanban: "M4 4h4v16h-4zM10 4h4v10h-4zM16 4h4v6h-4z",
  table: "M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2zM3 10h18M10 3v18",
  chev: "M6 9l6 6l6 -6",
  chevLeft: "M15 6l-6 6l6 6",
  chevRight: "M9 6l6 6l-6 6",
  user: "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",
  shieldExc: "M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3M12 8v4M12 16v.01",
  lock: "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2zM11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0M8 11v-4a4 4 0 1 1 8 0v4",
  edit: "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97L9 12v3h3zM16 5l3 3",
  trash: "M4 7l16 0M10 11l0 6M14 11l0 6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
  exit: "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2M7 12h14l-3 -3M18 15l3 -3",
  robot: "M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2zM21 10h-1v3h-1M3 10h1v3h1M7 16h10a2 2 0 0 1 2 2v2h-14v-2a2 2 0 0 1 2 -2M10 13a1 1 0 1 0 2 0a1 1 0 0 0 -2 0M14 13a1 1 0 1 0 2 0a1 1 0 0 0 -2 0",
  language: "M4 5h7M9 3v2c0 4.418 -2.239 8 -5 8M5 9c0 2.144 2.952 3.908 6.7 4M12 20l4 -9l4 9M19.1 18h-6.2",
  moreH: "M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  x: "M18 6l-12 12M6 6l12 12",
  logout: "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2M9 12h12l-3 -3M18 15l3 -3",
  cert: "M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M13 17.5v4.5l2 -1.5l2 1.5v-4.5M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v6M14 8h-10M9 11h-5"
};
const Icon = ({
  name,
  size = 16,
  stroke = 1.6
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: stroke,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: ICONS[name] || ICONS.files
}));
const TENANTS = [{
  id: "acme",
  name: "Acme Industries",
  slug: "acme",
  industry: "Manufacturing",
  role: "Administrator",
  users: 24,
  docs: 148,
  color: "var(--palette-coral)"
}, {
  id: "northstar",
  name: "Northstar Health",
  slug: "northstar",
  industry: "Healthcare",
  role: "Editor",
  users: 58,
  docs: 312,
  color: "var(--palette-jade)"
}, {
  id: "lumen",
  name: "Lumen Energy d.o.o.",
  slug: "lumen-energy",
  industry: "Energy",
  role: "Reviewer",
  users: 12,
  docs: 62,
  color: "var(--palette-amber)"
}];
const STANDARDS = [{
  key: "iso27001",
  name: "ISO 27001",
  full: "ISO/IEC 27001:2022",
  color: "var(--palette-violet)",
  cls: "entity-iso27001"
}, {
  key: "iso9001",
  name: "ISO 9001",
  full: "ISO 9001:2015",
  color: "var(--palette-azure)",
  cls: "entity-iso9001"
}, {
  key: "iso20000",
  name: "ISO 20000",
  full: "ISO/IEC 20000-1:2018",
  color: "var(--palette-teal)",
  cls: "entity-iso20000"
}, {
  key: "iso45001",
  name: "ISO 45001",
  full: "ISO 45001:2018",
  color: "var(--palette-rose)",
  cls: "entity-iso45001"
}];
const DOCS = [
// ISO 27001
{
  id: "d1",
  num: "ISMS-POL-001",
  title: "ISMS Scope Statement",
  type: "policy",
  standards: ["iso27001"],
  clause: "4.3",
  clauseTitle: "Determining the scope of the ISMS",
  obligation: "shall",
  status: "approved",
  version: "2.0",
  updated: "2 d ago",
  owner: "MP"
}, {
  id: "d2",
  num: "ISMS-POL-002",
  title: "Information Security Policy",
  type: "policy",
  standards: ["iso27001", "iso9001"],
  clause: "5.2",
  clauseTitle: "Information security policy",
  obligation: "shall",
  status: "approved",
  version: "1.4",
  updated: "1 w ago",
  owner: "MP"
}, {
  id: "d3",
  num: "ISMS-PRO-003",
  title: "Risk Assessment Methodology",
  type: "procedure",
  standards: ["iso27001"],
  clause: "6.1.2",
  clauseTitle: "Information security risk assessment",
  obligation: "shall",
  status: "review",
  version: "1.1-draft",
  updated: "3 h ago",
  owner: "EK"
}, {
  id: "d4",
  num: "ISMS-POL-004",
  title: "Access Control Policy",
  type: "policy",
  standards: ["iso27001"],
  clause: "A.8.3",
  clauseTitle: "Information access restriction",
  obligation: "should",
  status: "approved",
  version: "1.2",
  updated: "2 w ago",
  owner: "DJ"
}, {
  id: "d5",
  num: "ISMS-PRO-005",
  title: "Incident Response Procedure",
  type: "procedure",
  standards: ["iso27001"],
  clause: "A.5.24",
  clauseTitle: "Planning and preparation",
  obligation: "shall",
  status: "draft",
  version: "0.3",
  updated: "yesterday",
  owner: "EK"
}, {
  id: "d6",
  num: "ISMS-WI-006",
  title: "Cryptographic Controls Guide",
  type: "work instruction",
  standards: ["iso27001"],
  clause: "A.8.24",
  clauseTitle: "Use of cryptography",
  obligation: "should",
  status: "approved",
  version: "1.0",
  updated: "1 mo ago",
  owner: "AI"
}, {
  id: "d7",
  num: "ISMS-REC-007",
  title: "Acceptable Use Acknowledgement",
  type: "record",
  standards: ["iso27001"],
  clause: "A.5.10",
  clauseTitle: "Acceptable use of assets",
  obligation: "shall",
  status: "approved",
  version: "1.0",
  updated: "2 mo ago",
  owner: "SP"
},
// ISO 9001
{
  id: "d8",
  num: "QMS-POL-001",
  title: "Quality Policy",
  type: "policy",
  standards: ["iso9001"],
  clause: "5.2",
  clauseTitle: "Policy",
  obligation: "shall",
  status: "approved",
  version: "1.0",
  updated: "2 mo ago",
  owner: "DJ"
}, {
  id: "d9",
  num: "QMS-PRO-002",
  title: "Nonconformity & Corrective Action",
  type: "procedure",
  standards: ["iso9001"],
  clause: "10.2",
  clauseTitle: "Nonconformity and corrective action",
  obligation: "shall",
  status: "review",
  version: "2.1-draft",
  updated: "4 h ago",
  owner: "SP"
}, {
  id: "d10",
  num: "QMS-REC-003",
  title: "Management Review Minutes — Q1 2026",
  type: "record",
  standards: ["iso9001"],
  clause: "9.3",
  clauseTitle: "Management review",
  obligation: "shall",
  status: "draft",
  version: "0.1",
  updated: "today",
  owner: "MP"
},
// ISO 20000
{
  id: "d11",
  num: "ITSM-POL-001",
  title: "Service Management Policy",
  type: "policy",
  standards: ["iso20000"],
  clause: "5.2",
  clauseTitle: "SMS policy",
  obligation: "shall",
  status: "approved",
  version: "1.0",
  updated: "3 w ago",
  owner: "AI"
}, {
  id: "d12",
  num: "ITSM-PRO-002",
  title: "Change Management Procedure",
  type: "procedure",
  standards: ["iso20000", "iso27001"],
  clause: "8.5.1",
  clauseTitle: "Change management",
  obligation: "shall",
  status: "approved",
  version: "1.1",
  updated: "1 w ago",
  owner: "AI"
}];

// Group by standard; IMS shelf = docs with 2+ standards
const shelves = () => {
  const out = STANDARDS.map(s => ({
    key: s.key,
    standard: s,
    docs: DOCS.filter(d => d.standards.includes(s.key))
  }));
  const ims = DOCS.filter(d => d.standards.length >= 2);
  if (ims.length) {
    out.push({
      key: "ims",
      standard: {
        key: "ims",
        name: "IMS · Shared documents",
        full: "Integrated Management System",
        color: "var(--palette-amber)",
        cls: "entity-ims"
      },
      docs: ims,
      isIMS: true
    });
  }
  return out;
};

// Canned AI conversation for document chat
const DOC_CONTENT_STARTER = `<h2>1. Purpose</h2>
<p>This procedure defines how <strong>Acme Industries</strong> performs information security risk assessments across its scope of certification, in order to identify, analyse, and evaluate risks to the confidentiality, integrity, and availability of information assets.</p>

<h2>2. Scope</h2>
<p>Applies to all information assets, processes, and systems within the ISMS boundary, including on-premises infrastructure, SaaS providers processing Acme data, and third-party service providers under contract.</p>

<h2>3. Methodology</h2>
<p>Risk is assessed using a qualitative <strong>likelihood × impact</strong> matrix. The assessment is repeated at least annually and whenever a significant change occurs.</p>

<h3>3.1 Likelihood scale</h3>
<ul>
	<li><strong>Rare (1)</strong> — may occur only in exceptional circumstances</li>
	<li><strong>Unlikely (2)</strong> — could occur at some time</li>
	<li><strong>Possible (3)</strong> — might occur at some time</li>
	<li><strong>Likely (4)</strong> — will probably occur in most circumstances</li>
	<li><strong>Almost certain (5)</strong> — expected to occur in most circumstances</li>
</ul>

<h3>3.2 Impact scale</h3>
<p>Impact is assessed across three dimensions: <strong>financial</strong>, <strong>operational</strong>, and <strong>reputational</strong>. The overall impact is the highest score across the three.</p>

<h2>4. Roles & responsibilities</h2>
<p>The <strong>Risk Owner</strong> is responsible for accepting, treating, or transferring identified risks. The <strong>ISMS Manager</strong> maintains the risk register and reviews it quarterly.</p>

<h2>5. Records</h2>
<p>All risk assessments are retained for a minimum of three years and linked to the associated <a href="#">Statement of Applicability</a>.</p>`;

// Canned chat for the general AI chat, including a proposal
const CANNED_PROPOSAL = {
  intro: "Based on your scope — **ISO 27001:2022** for a mid-size industrial manufacturer — here's a starter set. Each row shows the clause it addresses and whether ISO 27001 treats it as mandatory (`shall`), recommended (`should`), or permitted (`may`). Untick anything you already cover.",
  items: [{
    title: "ISMS Scope Statement",
    type: "policy",
    standard: "ISO 27001",
    clause: "4.3",
    clauseTitle: "Determining the scope of the ISMS",
    obligation: "shall"
  }, {
    title: "Information Security Policy",
    type: "policy",
    standard: "ISO 27001",
    clause: "5.2",
    clauseTitle: "Information security policy",
    obligation: "shall"
  }, {
    title: "Risk Assessment Methodology",
    type: "procedure",
    standard: "ISO 27001",
    clause: "6.1.2",
    clauseTitle: "Information security risk assessment",
    obligation: "shall"
  }, {
    title: "Statement of Applicability",
    type: "record",
    standard: "ISO 27001",
    clause: "6.1.3",
    clauseTitle: "Information security risk treatment",
    obligation: "shall"
  }, {
    title: "Access Control Policy",
    type: "policy",
    standard: "ISO 27001",
    clause: "A.5.15",
    clauseTitle: "Access control",
    obligation: "should"
  }, {
    title: "Asset Inventory",
    type: "record",
    standard: "ISO 27001",
    clause: "A.5.9",
    clauseTitle: "Inventory of information and assets",
    obligation: "shall"
  }, {
    title: "Incident Response Procedure",
    type: "procedure",
    standard: "ISO 27001",
    clause: "A.5.24",
    clauseTitle: "Planning and preparation",
    obligation: "shall"
  }, {
    title: "Business Continuity Plan",
    type: "policy",
    standard: "ISO 27001",
    clause: "A.5.29",
    clauseTitle: "ICT readiness for business continuity",
    obligation: "should"
  }, {
    title: "Cryptographic Controls Guide",
    type: "work instruction",
    standard: "ISO 27001",
    clause: "A.8.24",
    clauseTitle: "Use of cryptography",
    obligation: "should"
  }, {
    title: "Supplier Security Agreement Template",
    type: "form",
    standard: "ISO 27001",
    clause: "A.5.20",
    clauseTitle: "Addressing information security within supplier agreements",
    obligation: "shall"
  }]
};
const ACTIVITY_FEED = [{
  t: "2h",
  who: "Ana D.",
  verb: "submitted for review",
  what: "Risk Assessment Methodology",
  doc: "d3",
  note: "v1.1 draft — awaiting Stefan K."
}, {
  t: "5h",
  who: "Editorial AI",
  verb: "drafted",
  what: "Incident Response Procedure §3",
  doc: "d5",
  note: "±1,240 words · ~6k tokens"
}, {
  t: "yest.",
  who: "Marko I.",
  verb: "approved",
  what: "ISMS Scope Statement",
  doc: "d1"
}, {
  t: "yest.",
  who: "Stefan K.",
  verb: "commented on",
  what: "Information Security Policy §5.2",
  doc: "d2",
  note: "\"Reference the 2024 DPA, not 2022.\""
}, {
  t: "Mon",
  who: "Marija P.",
  verb: "renewed certificate for",
  what: "ISO 9001:2015 audit",
  note: "Surveillance passed · next cycle Mar 2027"
}, {
  t: "Mon",
  who: "Sara B.",
  verb: "uploaded",
  what: "Quality Manual v4.1",
  doc: "d7"
}];
const USERS = [{
  id: "u1",
  name: "Marija Petkovska",
  email: "marija@acme.mk",
  role: "Administrator",
  dept: "Quality & ISMS",
  standards: ["iso27001", "iso9001", "iso20000"],
  last: "Now",
  status: "online",
  invited: "Feb 2024"
}, {
  id: "u2",
  name: "Ana Dimitrova",
  email: "ana.d@acme.mk",
  role: "ISMS Owner",
  dept: "Security",
  standards: ["iso27001"],
  last: "2h ago",
  status: "online",
  invited: "Mar 2024"
}, {
  id: "u3",
  name: "Stefan Kostov",
  email: "stefan.k@acme.mk",
  role: "Legal Reviewer",
  dept: "Legal",
  standards: ["iso27001", "iso9001"],
  last: "Yesterday",
  status: "away",
  invited: "Apr 2024"
}, {
  id: "u4",
  name: "Marko Ilievski",
  email: "marko@acme.mk",
  role: "Editor",
  dept: "Operations",
  standards: ["iso9001"],
  last: "3d ago",
  status: "offline",
  invited: "May 2024"
}, {
  id: "u5",
  name: "Sara Bogdanovska",
  email: "sara.b@acme.mk",
  role: "Editor",
  dept: "Service Delivery",
  standards: ["iso20000"],
  last: "3d ago",
  status: "offline",
  invited: "Jul 2024"
}, {
  id: "u6",
  name: "Elena Krstevska",
  email: "elena.k@acme.mk",
  role: "Viewer",
  dept: "HR",
  standards: [],
  last: "2w ago",
  status: "offline",
  invited: "Oct 2024"
}, {
  id: "u7",
  name: "auditor@bsi.co.uk",
  email: "auditor@bsi.co.uk",
  role: "External auditor",
  dept: "— BSI —",
  standards: ["iso27001"],
  last: "Pending invite",
  status: "pending",
  invited: "Today"
}];
const ROLES = [{
  key: "admin",
  name: "Administrator",
  count: 1,
  desc: "Full access to every document, every setting, every tenant user. Can transfer ownership and delete records.",
  perms: {
    read: "all",
    write: "all",
    approve: true,
    delete: true,
    invite: true,
    settings: true
  }
}, {
  key: "ismsowner",
  name: "ISMS Owner",
  count: 1,
  desc: "Owns the ISO 27001 document set. Can draft, submit, and approve. Cannot touch other standards.",
  perms: {
    read: "scoped",
    write: "scoped",
    approve: true,
    delete: false,
    invite: false,
    settings: false
  }
}, {
  key: "legal",
  name: "Legal Reviewer",
  count: 1,
  desc: "Read-only access to every document, can comment, must sign off before approval on legal-flagged clauses.",
  perms: {
    read: "all",
    write: "comment",
    approve: "legal",
    delete: false,
    invite: false,
    settings: false
  }
}, {
  key: "editor",
  name: "Editor",
  count: 2,
  desc: "Drafts and revises within their assigned standards. Submits for review — cannot self-approve.",
  perms: {
    read: "scoped",
    write: "scoped",
    approve: false,
    delete: false,
    invite: false,
    settings: false
  }
}, {
  key: "viewer",
  name: "Viewer",
  count: 1,
  desc: "Read-only across whatever they're scoped to. The role you give new hires during onboarding.",
  perms: {
    read: "scoped",
    write: false,
    approve: false,
    delete: false,
    invite: false,
    settings: false
  }
}, {
  key: "external",
  name: "External auditor",
  count: 1,
  desc: "Time-boxed, read-only, watermarked access for external auditors. Expires automatically after audit window.",
  perms: {
    read: "time-boxed",
    write: false,
    approve: false,
    delete: false,
    invite: false,
    settings: false
  }
}];
const AUDIT_EVENTS = [{
  t: "09:42",
  date: "Today",
  actor: "Marija P.",
  action: "approved",
  target: "ISMS Scope Statement v1.2",
  kind: "approve",
  ip: "10.42.1.18",
  loc: "Skopje"
}, {
  t: "09:31",
  date: "Today",
  actor: "Ana D.",
  action: "submitted for review",
  target: "Risk Assessment Methodology v1.1-draft",
  kind: "submit",
  ip: "10.42.1.22",
  loc: "Skopje"
}, {
  t: "08:14",
  date: "Today",
  actor: "Editorial AI",
  action: "drafted section 3 of",
  target: "Incident Response Procedure",
  kind: "ai",
  ip: "—",
  loc: "System · tokens: 6,244"
}, {
  t: "17:52",
  date: "Yesterday",
  actor: "Stefan K.",
  action: "added comment to",
  target: "Information Security Policy §5.2",
  kind: "comment",
  ip: "10.42.3.9",
  loc: "Bitola"
}, {
  t: "14:08",
  date: "Yesterday",
  actor: "Marko I.",
  action: "opened",
  target: "Quality Manual v4.0",
  kind: "view",
  ip: "10.42.2.44",
  loc: "Skopje"
}, {
  t: "09:03",
  date: "Yesterday",
  actor: "Marija P.",
  action: "invited user",
  target: "auditor@bsi.co.uk (External auditor)",
  kind: "invite",
  ip: "10.42.1.18",
  loc: "Skopje"
}, {
  t: "22:40",
  date: "2 days ago",
  actor: "System",
  action: "auto-expired session for",
  target: "Elena K.",
  kind: "system",
  ip: "—",
  loc: "Session timeout"
}, {
  t: "16:21",
  date: "2 days ago",
  actor: "Marija P.",
  action: "changed role of",
  target: "Marko I. (Editor → Editor · scoped to 9001)",
  kind: "role",
  ip: "10.42.1.18",
  loc: "Skopje"
}, {
  t: "11:09",
  date: "2 days ago",
  actor: "Sara B.",
  action: "exported PDF of",
  target: "Quality Manual v4.0",
  kind: "export",
  ip: "10.42.5.7",
  loc: "Skopje"
}, {
  t: "09:55",
  date: "3 days ago",
  actor: "Ana D.",
  action: "created draft",
  target: "Acceptable Use Acknowledgement v0.1",
  kind: "create",
  ip: "10.42.1.22",
  loc: "Skopje"
}];
Object.assign(window, {
  Icon,
  ICONS,
  TENANTS,
  STANDARDS,
  DOCS,
  shelves,
  DOC_CONTENT_STARTER,
  CANNED_PROPOSAL,
  ACTIVITY_FEED,
  USERS,
  ROLES,
  AUDIT_EVENTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/B/data.js", error: String((e && e.message) || e) }); }

// prototypes/B/screens.jsx
try { (() => {
/* global window, React */
const {
  useMemo,
  useState: useS2,
  useRef: useR2
} = React;

// ---------- Dashboard ----------
const SectionHead = ({
  standard,
  isIMS,
  count
}) => /*#__PURE__*/React.createElement("div", {
  className: "section-head"
}, /*#__PURE__*/React.createElement("span", {
  className: "kicker"
}, /*#__PURE__*/React.createElement("span", {
  className: "dot"
}), isIMS ? "Integrated Management System" : standard.full), /*#__PURE__*/React.createElement("h2", null, isIMS ? "Shared documents" : standard.name), /*#__PURE__*/React.createElement("span", {
  className: "count"
}, count, " in library"), /*#__PURE__*/React.createElement("span", {
  className: "spacer"
}), isIMS && /*#__PURE__*/React.createElement("span", {
  className: "tag"
}, "Auto-detected"));
const DocCell = ({
  d,
  go
}) => /*#__PURE__*/React.createElement("div", {
  className: "doc-cell",
  onClick: () => go(`/documents/${d.id}`)
}, /*#__PURE__*/React.createElement("div", {
  className: "num"
}, /*#__PURE__*/React.createElement("span", null, d.num), /*#__PURE__*/React.createElement("span", {
  className: "version"
}, "v", d.version)), /*#__PURE__*/React.createElement("div", {
  className: "title"
}, d.title), /*#__PURE__*/React.createElement("div", {
  className: "meta"
}, /*#__PURE__*/React.createElement("span", {
  className: "type"
}, d.type), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
  className: "clause"
}, d.clause), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
  className: "chip " + d.status
}, d.status)));
const ShelfSection = ({
  shelf,
  go
}) => {
  const entity = shelf.isIMS ? "var(--gold)" : shelf.standard.key === "iso27001" ? "var(--plum)" : shelf.standard.key === "iso9001" ? "var(--sea)" : shelf.standard.key === "iso20000" ? "var(--moss)" : "var(--accent)";
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      "--entity-color": entity
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    standard: shelf.standard,
    isIMS: shelf.isIMS,
    count: shelf.docs.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "shelf-items"
  }, shelf.docs.map(d => /*#__PURE__*/React.createElement(DocCell, {
    key: d.id,
    d: d,
    go: go
  }))));
};
const CardSection = ({
  shelf,
  go
}) => {
  const entity = shelf.isIMS ? "var(--gold)" : shelf.standard.key === "iso27001" ? "var(--plum)" : shelf.standard.key === "iso9001" ? "var(--sea)" : shelf.standard.key === "iso20000" ? "var(--moss)" : "var(--accent)";
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      "--entity-color": entity
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    standard: shelf.standard,
    isIMS: shelf.isIMS,
    count: shelf.docs.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "cards-grid"
  }, shelf.docs.map(d => /*#__PURE__*/React.createElement("article", {
    key: d.id,
    className: "card",
    onClick: () => go(`/documents/${d.id}`)
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, d.num, " \xB7 v", d.version), /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, d.title), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "clause"
  }, d.clause), /*#__PURE__*/React.createElement("span", {
    className: "chip " + d.status
  }, d.status))))));
};
const KanbanSection = ({
  shelf,
  go
}) => {
  const cols = ["draft", "review", "approved", "obsolete"];
  const by = Object.fromEntries(cols.map(c => [c, shelf.docs.filter(d => d.status === c)]));
  const entity = shelf.isIMS ? "var(--gold)" : shelf.standard.key === "iso27001" ? "var(--plum)" : shelf.standard.key === "iso9001" ? "var(--sea)" : shelf.standard.key === "iso20000" ? "var(--moss)" : "var(--accent)";
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      "--entity-color": entity
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    standard: shelf.standard,
    isIMS: shelf.isIMS,
    count: shelf.docs.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "kanban-cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    className: "kanban-col " + c
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("span", null, c), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, by[c].length)), by[c].map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "kanban-card",
    onClick: () => go(`/documents/${d.id}`)
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, d.title), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, d.clause, " \xB7 v", d.version)))))));
};
const TableSection = ({
  shelf,
  go
}) => {
  const entity = shelf.isIMS ? "var(--gold)" : shelf.standard.key === "iso27001" ? "var(--plum)" : shelf.standard.key === "iso9001" ? "var(--sea)" : shelf.standard.key === "iso20000" ? "var(--moss)" : "var(--accent)";
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      "--entity-color": entity
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    standard: shelf.standard,
    isIMS: shelf.isIMS,
    count: shelf.docs.length
  }), /*#__PURE__*/React.createElement("table", {
    className: "doc-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Doc"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Clause"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Ver"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Updated"))), /*#__PURE__*/React.createElement("tbody", null, shelf.docs.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id,
    onClick: () => go(`/documents/${d.id}`)
  }, /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, d.num), /*#__PURE__*/React.createElement("td", {
    className: "title"
  }, d.title), /*#__PURE__*/React.createElement("td", {
    className: "clause"
  }, d.clause), /*#__PURE__*/React.createElement("td", {
    className: "type"
  }, d.type), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, d.version), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "chip " + d.status
  }, d.status)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, d.updated))))));
};
const Dashboard = ({
  go,
  layout,
  setLayout
}) => {
  const data = useMemo(() => shelves(), []);
  const totals = useMemo(() => ({
    total: DOCS.length,
    approved: DOCS.filter(d => d.status === "approved").length,
    review: DOCS.filter(d => d.status === "review").length,
    draft: DOCS.filter(d => d.status === "draft").length
  }), []);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const LayoutBtn = ({
    v,
    icon,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    className: layout === v ? "active" : "",
    onClick: () => setLayout(v),
    title: label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 11
  }), " ", label);
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "masthead-block"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dateline"
  }, today, " \xB7 Acme Industries"), /*#__PURE__*/React.createElement("h1", null, "The ", /*#__PURE__*/React.createElement("em", null, "Document"), " Front Page"), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, totals.total, " documents across your certifications \u2014 ", totals.approved, " approved, ", totals.review, " in review, ", totals.draft, " drafts in the works.")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => go("/ai")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13
  }), " AI planner"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => go("/documents/new")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " New document"))), /*#__PURE__*/React.createElement("div", {
    className: "stats-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, totals.total), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Total")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, totals.approved, /*#__PURE__*/React.createElement("em", null, "/", totals.total)), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Approved")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, totals.review), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "In review")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, totals.draft), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Drafts"))), /*#__PURE__*/React.createElement("div", {
    className: "front-lead"
  }, /*#__PURE__*/React.createElement("article", {
    className: "lead-story",
    onClick: () => go("/documents/d3")
  }, /*#__PURE__*/React.createElement("div", {
    className: "kicker"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "Lead story \xB7 In review \xB7 due in 4 days"), /*#__PURE__*/React.createElement("h2", null, "Risk Assessment ", /*#__PURE__*/React.createElement("em", null, "Methodology"), " \u2014 v1.1 draft ready for sign-off"), /*#__PURE__*/React.createElement("p", {
    className: "pull"
  }, "Ana rewrote \xA74.2 on Tuesday to align with the new ISO 27001:2022 Annex A numbering; the methodology now maps cleanly to A.8.24 and the 2023 DPIA template."), /*#__PURE__*/React.createElement("div", {
    className: "byline"
  }, /*#__PURE__*/React.createElement("span", null, "By ", /*#__PURE__*/React.createElement("strong", null, "Ana Dimitrova"), " \xB7 ISMS owner"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "2 open comments"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "ISO 27001 \xB7 6.1.2"))), /*#__PURE__*/React.createElement("aside", {
    className: "activity-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-head"
  }, "Off the press"), ACTIVITY_FEED.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "activity-row",
    onClick: () => a.doc && go(`/documents/${a.doc}`)
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, a.t), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("strong", null, a.who), " ", a.verb, " ", /*#__PURE__*/React.createElement("em", null, a.what), a.note && /*#__PURE__*/React.createElement("div", {
    className: "note"
  }, a.note)))), /*#__PURE__*/React.createElement("div", {
    className: "col-foot"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go("/audit");
    }
  }, "See full audit log \u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search by title, clause, or number\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "layout-picker"
  }, /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "shelves",
    icon: "rows",
    label: "Shelves"
  }), /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "cards",
    icon: "grid",
    label: "Cards"
  }), /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "kanban",
    icon: "kanban",
    label: "Kanban"
  }), /*#__PURE__*/React.createElement(LayoutBtn, {
    v: "table",
    icon: "table",
    label: "Table"
  })), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip active"
  }, "All standards"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Status \xB7 Any"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Year \xB7 2026")), data.map(s => {
    if (layout === "cards") return /*#__PURE__*/React.createElement(CardSection, {
      key: s.key,
      shelf: s,
      go: go
    });
    if (layout === "kanban") return /*#__PURE__*/React.createElement(KanbanSection, {
      key: s.key,
      shelf: s,
      go: go
    });
    if (layout === "table") return /*#__PURE__*/React.createElement(TableSection, {
      key: s.key,
      shelf: s,
      go: go
    });
    return /*#__PURE__*/React.createElement(ShelfSection, {
      key: s.key,
      shelf: s,
      go: go
    });
  }));
};

// ---------- Document editor ----------
const DOC_OUTLINE = [{
  n: "1",
  t: "Purpose",
  h: 2
}, {
  n: "2",
  t: "Scope",
  h: 2
}, {
  n: "3",
  t: "Terms and definitions",
  h: 2
}, {
  n: "4",
  t: "Risk assessment process",
  h: 2
}, {
  n: "4.1",
  t: "Context establishment",
  h: 3
}, {
  n: "4.2",
  t: "Risk identification",
  h: 3
}, {
  n: "4.3",
  t: "Risk analysis",
  h: 3
}, {
  n: "5",
  t: "Acceptance criteria",
  h: 2
}, {
  n: "6",
  t: "Roles and responsibilities",
  h: 2
}, {
  n: "7",
  t: "Records",
  h: 2
}];
const DOC_COMMENTS = [{
  who: "Ana D.",
  role: "Reviewer",
  t: "2h",
  body: "Can we clarify \"residual risk\" here? Our auditors flagged this phrasing last cycle."
}, {
  who: "Stefan K.",
  role: "Legal",
  t: "yesterday",
  body: "§4.2 — align with the new GDPR DPIA template, para 3."
}];
const DocumentEditor = ({
  doc,
  go,
  locked
}) => {
  const [aiOpen, setAiOpen] = useS2(true);
  const [outlineOpen, setOutlineOpen] = useS2(true);
  const [activeSection, setActiveSection] = useS2("4");
  const ToolBtn = ({
    icon,
    label,
    title
  }) => /*#__PURE__*/React.createElement("button", {
    className: "t-btn",
    title: title || label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 13
  }), " ", label && /*#__PURE__*/React.createElement("span", null, label));
  return /*#__PURE__*/React.createElement("div", {
    className: "editor-shell",
    "data-ai": aiOpen ? "open" : "closed",
    "data-outline": outlineOpen ? "open" : "closed"
  }, outlineOpen ? /*#__PURE__*/React.createElement("aside", {
    className: "editor-outline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", null, "Document outline"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOutlineOpen(false),
    title: "Collapse"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevLeft",
    size: 13
  }))), DOC_OUTLINE.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.n,
    className: `outline-item h${o.h}` + (activeSection === o.n ? " active" : ""),
    onClick: () => setActiveSection(o.n)
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, o.n), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, o.t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      paddingTop: 14,
      borderTop: "1px solid hsl(var(--rule))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 9.5,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "hsl(var(--ink-3))",
      marginBottom: 10
    }
  }, "Mapped clauses"), [{
    std: "ISO 27001",
    cls: "entity-iso27001",
    n: "6.1.2"
  }, {
    std: "ISO 27001",
    cls: "entity-iso27001",
    n: "8.2"
  }, {
    std: "ISO 9001",
    cls: "entity-iso9001",
    n: "6.1"
  }].map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "4px 0",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "doc-entity-tag " + c.cls
  }, c.std), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      color: "hsl(var(--ink-2))"
    }
  }, c.n))))) : /*#__PURE__*/React.createElement("aside", {
    className: "editor-outline outline-collapsed"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOutlineOpen(true)
  }, "Outline")), /*#__PURE__*/React.createElement("div", {
    className: "editor-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-toolbar"
  }, /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "heading",
    label: "H2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "bold",
    title: "Bold"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "italic",
    title: "Italic"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "list",
    title: "List"
  }), /*#__PURE__*/React.createElement(ToolBtn, {
    icon: "link",
    title: "Link"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }), /*#__PURE__*/React.createElement("button", {
    className: "t-btn",
    style: {
      color: "hsl(var(--accent))"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13
  }), " Ask editor"), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "right-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip " + doc.status
  }, doc.status), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10.5,
      color: "hsl(var(--ink-3))",
      textTransform: "uppercase",
      letterSpacing: "0.1em"
    }
  }, "v", doc.version), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11
  }), " Submit"))), /*#__PURE__*/React.createElement("div", {
    className: "doc-surface",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc-meta-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip " + doc.status
  }, doc.status), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "clause"
  }, doc.clause, " \xB7 ", doc.clauseTitle), /*#__PURE__*/React.createElement("span", {
    className: `obligation ${doc.obligation}`
  }, doc.obligation), doc.standards.map(s => {
    const std = STANDARDS.find(x => x.key === s);
    return std ? /*#__PURE__*/React.createElement("span", {
      key: s,
      className: "doc-entity-tag " + std.cls
    }, std.name) : null;
  })), /*#__PURE__*/React.createElement("input", {
    className: "doc-title-input",
    defaultValue: doc.title,
    placeholder: "Document title"
  }), /*#__PURE__*/React.createElement("dl", {
    className: "doc-meta-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Document no."), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 12
    }
  }, doc.num)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Type"), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic"
    }
  }, doc.type)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Version"), /*#__PURE__*/React.createElement("dd", null, doc.version)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Owner"), /*#__PURE__*/React.createElement("dd", null, doc.owner || "EK", " \xB7 Marija P.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Language"), /*#__PURE__*/React.createElement("dd", null, "EN \xB7 mk, sq")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Classification"), /*#__PURE__*/React.createElement("dd", null, "Internal")))), /*#__PURE__*/React.createElement("div", {
    className: "doc-body",
    contentEditable: true,
    suppressContentEditableWarning: true,
    dangerouslySetInnerHTML: {
      __html: DOC_CONTENT_STARTER
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "doc-comments-rail"
  }, DOC_COMMENTS.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "comment-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, /*#__PURE__*/React.createElement("strong", null, c.who), /*#__PURE__*/React.createElement("span", null, c.role), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, c.t)), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, c.body)))))), /*#__PURE__*/React.createElement(AIDrawer, {
    doc: doc,
    locked: locked,
    expanded: aiOpen,
    setExpanded: setAiOpen
  }));
};

// ---------- Tenant picker ----------
const TenantPicker = ({
  onPick,
  onClose
}) => /*#__PURE__*/React.createElement("div", {
  className: "picker-veil",
  onClick: onClose
}, /*#__PURE__*/React.createElement("div", {
  className: "picker-card",
  onClick: e => e.stopPropagation()
}, /*#__PURE__*/React.createElement("div", {
  className: "wordmark"
}, "Docu", /*#__PURE__*/React.createElement("em", null, "Flow")), /*#__PURE__*/React.createElement("div", {
  className: "dateline"
}, "Edition of workspaces \xB7 Vol. II, No. ", TENANTS.length), /*#__PURE__*/React.createElement("h1", null, "Choose a workspace"), /*#__PURE__*/React.createElement("p", {
  className: "sub"
}, "You're a member of ", TENANTS.length, " organizations."), TENANTS.map(t => /*#__PURE__*/React.createElement("div", {
  key: t.id,
  className: "tenant-option",
  onClick: () => onPick(t)
}, /*#__PURE__*/React.createElement("span", {
  className: "mono"
}, t.name[0]), /*#__PURE__*/React.createElement("div", {
  className: "meta"
}, /*#__PURE__*/React.createElement("div", {
  className: "name"
}, t.name), /*#__PURE__*/React.createElement("div", {
  className: "info"
}, t.industry, " \xB7 ", t.users, " users \xB7 ", t.docs, " documents")), /*#__PURE__*/React.createElement("span", {
  className: "role"
}, t.role))), /*#__PURE__*/React.createElement("div", {
  className: "picker-foot"
}, /*#__PURE__*/React.createElement("span", null, "marija@acme.mk"), /*#__PURE__*/React.createElement("a", {
  href: "#",
  style: {
    border: "none"
  }
}, "Sign out"))));

// ---------- Settings ----------
const SettingsPage = ({
  profileComplete,
  setProfileComplete
}) => {
  const [industry, setIndustry] = useS2(profileComplete ? "manufacturing" : "");
  const [desc, setDesc] = useS2(profileComplete ? "Mid-size industrial manufacturer producing precision components for automotive and aerospace. ~320 employees across 2 sites in Skopje and Bitola." : "");
  const [scope, setScope] = useS2(profileComplete ? "Design, manufacture, and service of precision mechanical components within the ISMS boundary at both production sites, excluding legacy R&D infrastructure." : "");
  const filled = [industry, desc, scope].filter(Boolean).length;
  const pct = Math.round(filled / 3 * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "settings-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "masthead-block"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dateline"
  }, "Administration"), /*#__PURE__*/React.createElement("h1", null, "Organization ", /*#__PURE__*/React.createElement("em", null, "Profile")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "The editorial AI uses this context verbatim in its system prompt when it writes for you."))), pct < 100 && /*#__PURE__*/React.createElement("div", {
    className: "profile-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "txt"
  }, /*#__PURE__*/React.createElement("em", null, pct, "% complete."), " Editorial AI is locked until all three fields are present."), /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "settings-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Branding"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Used in PDF exports and the workspace picker."), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Logo"), "PNG \xB7 SVG \xB7 WebP"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "logo-upload"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-preview has"
  }, "A"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Replace"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      borderColor: "transparent"
    }
  }, "Remove"))))), /*#__PURE__*/React.createElement("div", {
    className: "settings-section"
  }, /*#__PURE__*/React.createElement("h2", null, "AI context"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Required \u2014 controls the system prompt when the AI drafts on your behalf."), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Industry"), "Required \xB7 single select"), /*#__PURE__*/React.createElement("select", {
    value: industry,
    onChange: e => setIndustry(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select industry \u2014"), /*#__PURE__*/React.createElement("option", {
    value: "manufacturing"
  }, "Manufacturing"), /*#__PURE__*/React.createElement("option", {
    value: "healthcare"
  }, "Healthcare"), /*#__PURE__*/React.createElement("option", {
    value: "it_technology"
  }, "IT & Technology"), /*#__PURE__*/React.createElement("option", {
    value: "finance_banking"
  }, "Finance & Banking"), /*#__PURE__*/React.createElement("option", {
    value: "education"
  }, "Education"), /*#__PURE__*/React.createElement("option", {
    value: "energy"
  }, "Energy"), /*#__PURE__*/React.createElement("option", {
    value: "other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Company description"), "Max 1,000 characters"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: "Who you are, what you do, how large\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    className: "char-count"
  }, desc.length, " / 1,000"))), /*#__PURE__*/React.createElement("div", {
    className: "field-row"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Scope of work"), "Max 2,000 \xB7 used as ISMS scope verbatim"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    value: scope,
    onChange: e => setScope(e.target.value),
    placeholder: "What's in scope? What's excluded?"
  }), /*#__PURE__*/React.createElement("div", {
    className: "char-count"
  }, scope.length, " / 2,000"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setProfileComplete(!!(industry && desc && scope))
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11
  }), " Save profile")))));
};

// ---------- Admin ----------
const AdminTenants = ({
  onImpersonate
}) => /*#__PURE__*/React.createElement("div", {
  className: "content"
}, /*#__PURE__*/React.createElement("div", {
  className: "masthead-block"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "dateline"
}, "Root administration \xB7 DocuFlow"), /*#__PURE__*/React.createElement("h1", null, "Tenants ", /*#__PURE__*/React.createElement("em", null, "&"), " Packages"), /*#__PURE__*/React.createElement("p", {
  className: "lede"
}, TENANTS.length, " tenants \xB7 ", TENANTS.reduce((s, t) => s + t.users, 0), " users \xB7 ", TENANTS.reduce((s, t) => s + t.docs, 0), " documents")), /*#__PURE__*/React.createElement("div", {
  className: "actions"
}, /*#__PURE__*/React.createElement("button", {
  className: "btn btn-ghost"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "settings",
  size: 13
}), " Packages"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-primary"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "plus",
  size: 13
}), " Create tenant"))), /*#__PURE__*/React.createElement("div", {
  className: "toolbar"
}, /*#__PURE__*/React.createElement("div", {
  className: "search"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "search",
  size: 14
}), /*#__PURE__*/React.createElement("input", {
  placeholder: "Search tenants\u2026"
})), /*#__PURE__*/React.createElement("span", {
  className: "filter-chip active"
}, "All"), /*#__PURE__*/React.createElement("span", {
  className: "filter-chip"
}, "Active"), /*#__PURE__*/React.createElement("span", {
  className: "filter-chip"
}, "Suspended")), /*#__PURE__*/React.createElement("table", {
  className: "admin-table"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Tenant"), /*#__PURE__*/React.createElement("th", null, "Slug"), /*#__PURE__*/React.createElement("th", null, "Package"), /*#__PURE__*/React.createElement("th", {
  className: "num-cell"
}, "Users"), /*#__PURE__*/React.createElement("th", {
  className: "num-cell"
}, "Docs"), /*#__PURE__*/React.createElement("th", null, "Administrator"), /*#__PURE__*/React.createElement("th", {
  style: {
    textAlign: "right"
  }
}, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, TENANTS.map(t => /*#__PURE__*/React.createElement("tr", {
  key: t.id
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
  className: "t-name"
}, /*#__PURE__*/React.createElement("span", {
  className: "mono"
}, t.name[0]), /*#__PURE__*/React.createElement("strong", null, t.name))), /*#__PURE__*/React.createElement("td", {
  className: "slug"
}, t.slug, ".docuflow.com"), /*#__PURE__*/React.createElement("td", {
  style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14
  }
}, t.users > 40 ? "Enterprise" : t.users > 15 ? "Business" : "Starter"), /*#__PURE__*/React.createElement("td", {
  className: "num-cell"
}, t.users), /*#__PURE__*/React.createElement("td", {
  className: "num-cell"
}, t.docs), /*#__PURE__*/React.createElement("td", {
  style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "hsl(var(--ink-3))"
  }
}, "admin@", t.slug), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
  className: "actions"
}, /*#__PURE__*/React.createElement("button", {
  className: "btn-icon",
  title: "Edit"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "edit",
  size: 13
})), /*#__PURE__*/React.createElement("button", {
  className: "btn btn-ghost btn-sm",
  onClick: () => onImpersonate(t)
}, /*#__PURE__*/React.createElement(Icon, {
  name: "user",
  size: 11
}), " Impersonate"), /*#__PURE__*/React.createElement("button", {
  className: "btn-icon"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "moreH",
  size: 13
})))))))));

// ---------- Users & roles ----------
const UsersPage = ({
  go
}) => {
  const [sel, setSel] = useS2("admin");
  const stdColor = {
    iso27001: "var(--plum)",
    iso9001: "var(--sea)",
    iso20000: "var(--moss)",
    iso45001: "var(--accent)"
  };
  const permView = r => {
    const labels = [{
      k: "read",
      render: v => v === "all" ? {
        c: "y",
        t: "read · all"
      } : v === "scoped" ? {
        c: "q",
        t: "read · scoped"
      } : v === "time-boxed" ? {
        c: "q",
        t: "read · time-boxed"
      } : {
        c: "n",
        t: "read"
      }
    }, {
      k: "write",
      render: v => v === "all" || v === "scoped" ? {
        c: "y",
        t: v === "all" ? "edit · all" : "edit · scoped"
      } : v === "comment" ? {
        c: "q",
        t: "comment only"
      } : {
        c: "n",
        t: "edit"
      }
    }, {
      k: "approve",
      render: v => v === true ? {
        c: "y",
        t: "approve"
      } : v === "legal" ? {
        c: "q",
        t: "legal sign-off"
      } : {
        c: "n",
        t: "approve"
      }
    }, {
      k: "delete",
      render: v => v ? {
        c: "y",
        t: "delete"
      } : {
        c: "n",
        t: "delete"
      }
    }, {
      k: "invite",
      render: v => v ? {
        c: "y",
        t: "invite"
      } : {
        c: "n",
        t: "invite"
      }
    }, {
      k: "settings",
      render: v => v ? {
        c: "y",
        t: "settings"
      } : {
        c: "n",
        t: "settings"
      }
    }];
    return labels.map(l => l.render(r.perms[l.k]));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "masthead-block"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dateline"
  }, "Administration \xB7 ", USERS.length, " seats across ", ROLES.length, " roles"), /*#__PURE__*/React.createElement("h1", null, "Users & ", /*#__PURE__*/React.createElement("em", null, "Roles")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Who can read, write, approve, and export. Roles scope to standards \u2014 the ", /*#__PURE__*/React.createElement("em", null, "Editor"), " on ISO 9001 cannot see the ISMS.")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 13
  }), " Role editor"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Invite user"))), /*#__PURE__*/React.createElement("div", {
    className: "users-layout"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search users\u2026"
  })), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip active"
  }, "All ", USERS.length), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Online \xB7 2"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Pending \xB7 1")), /*#__PURE__*/React.createElement("table", {
    className: "users-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Member"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Department"), /*#__PURE__*/React.createElement("th", null, "Scope"), /*#__PURE__*/React.createElement("th", null, "Last seen"), /*#__PURE__*/React.createElement("th", {
    className: "act"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, USERS.map(u => {
    const initials = u.name.split(" ").map(w => w[0]).slice(0, 2).join("");
    const roleClass = u.role.replace(/\s/g, "");
    return /*#__PURE__*/React.createElement("tr", {
      key: u.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "u-name"
    }, /*#__PURE__*/React.createElement("span", {
      className: "av " + u.status
    }, initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, u.name), /*#__PURE__*/React.createElement("span", {
      className: "email"
    }, u.email)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "role-chip " + roleClass
    }, u.role)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        color: "hsl(var(--ink-2))"
      }
    }, u.dept), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "std-stack"
    }, u.standards.length === 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 10.5,
        color: "hsl(var(--ink-4))"
      }
    }, "\u2014") : u.standards.map(s => /*#__PURE__*/React.createElement("span", {
      key: s,
      className: "s",
      style: {
        background: `hsl(${stdColor[s]})`
      },
      title: s
    })))), /*#__PURE__*/React.createElement("td", {
      className: "last"
    }, u.last), /*#__PURE__*/React.createElement("td", {
      className: "act"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      title: "Edit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 13
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      title: "More"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "moreH",
      size: 13
    }))));
  })))), /*#__PURE__*/React.createElement("aside", {
    className: "role-inspector"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-head"
  }, "Role catalogue"), ROLES.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.key,
    className: "role-card",
    onClick: () => setSel(r.key),
    style: {
      cursor: "pointer",
      background: sel === r.key ? "hsl(var(--paper-2))" : "transparent",
      margin: "0 -14px",
      padding: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("h4", null, r.name), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, r.count, " ", r.count === 1 ? "member" : "members")), /*#__PURE__*/React.createElement("p", null, r.desc), /*#__PURE__*/React.createElement("div", {
    className: "role-perms"
  }, permView(r).map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "perm-chip " + p.c
  }, p.t))))))));
};

// ---------- Audit log ----------
const AuditPage = () => {
  const grouped = AUDIT_EVENTS.reduce((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "masthead-block"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dateline"
  }, "Administration \xB7 immutable \xB7 retained 7 years"), /*#__PURE__*/React.createElement("h1", null, "Audit ", /*#__PURE__*/React.createElement("em", null, "Log")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Every meaningful action \u2014 approvals, edits, invites, exports, AI drafts \u2014 recorded and ", /*#__PURE__*/React.createElement("em", null, "unforgeable"), ". Export to CSV for your external auditors.")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 13
  }), " Export CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 13
  }), " Retention"))), /*#__PURE__*/React.createElement("div", {
    className: "audit-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Filter by actor, target, or action\u2026"
  })), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip active"
  }, "All events"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Approvals"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "AI drafts"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Logins"), /*#__PURE__*/React.createElement("span", {
    className: "filter-chip"
  }, "Last 7 days")), Object.entries(grouped).map(([date, evs]) => /*#__PURE__*/React.createElement("div", {
    key: date,
    className: "audit-day-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "audit-day-head"
  }, /*#__PURE__*/React.createElement("strong", null, date), /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, evs.length, " events")), evs.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "audit-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, e.t), /*#__PURE__*/React.createElement("span", {
    className: "icon " + e.kind
  }, e.kind === "approve" ? "✓" : e.kind === "submit" ? "↑" : e.kind === "ai" ? "✦" : e.kind === "comment" ? "¶" : e.kind === "view" ? "◎" : e.kind === "invite" ? "+" : e.kind === "system" ? "·" : e.kind === "role" ? "⇄" : e.kind === "export" ? "↓" : "◇"), /*#__PURE__*/React.createElement("span", {
    className: "txt"
  }, /*#__PURE__*/React.createElement("strong", null, e.actor), " ", e.action, " ", /*#__PURE__*/React.createElement("em", null, e.target)), /*#__PURE__*/React.createElement("span", {
    className: "ip"
  }, e.ip, /*#__PURE__*/React.createElement("span", {
    className: "loc"
  }, e.loc)))))));
};

// ---------- Placeholder ----------
const Placeholder = ({
  title,
  note
}) => /*#__PURE__*/React.createElement("div", {
  className: "content"
}, /*#__PURE__*/React.createElement("div", {
  className: "masthead-block"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "dateline"
}, "Out of scope \xB7 prototype"), /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", {
  className: "lede"
}, note))), /*#__PURE__*/React.createElement("div", {
  className: "empty-state"
}, /*#__PURE__*/React.createElement("div", {
  className: "kicker"
}, "In production \xB7 not in this prototype"), /*#__PURE__*/React.createElement("h2", null, "Nothing to show \u2014 yet."), /*#__PURE__*/React.createElement("p", null, "The navigation is wired so you can return to the Front Page.")));
Object.assign(window, {
  Dashboard,
  DocumentEditor,
  TenantPicker,
  SettingsPage,
  AdminTenants,
  UsersPage,
  AuditPage,
  Placeholder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/B/screens.jsx", error: String((e && e.message) || e) }); }

})();
