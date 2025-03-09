var q = Object.defineProperty;
var k = (r) => {
  throw TypeError(r);
};
var B = (r, e, n) => e in r ? q(r, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[e] = n;
var R = (r, e, n) => B(r, typeof e != "symbol" ? e + "" : e, n), j = (r, e, n) => e.has(r) || k("Cannot " + n);
var M = (r, e, n) => (j(r, e, "read from private field"), n ? n.call(r) : e.get(r)), W = (r, e, n) => e.has(r) ? k("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, n), _ = (r, e, n, t) => (j(r, e, "write to private field"), t ? t.call(r, n) : e.set(r, n), n);
var $ = (r, e) => function() {
  return e || (0, r[Object.keys(r)[0]])((e = { exports: {} }).exports, e), e.exports;
}, G = $({
  "src/index.ts"(r, e) {
    const n = () => document.implementation.createHTMLDocument("");
    let t = (u, m) => {
      const w = n();
      return w.write("<script>"), t = w.scripts.length ? n : (y, C) => {
        const b = document.createElement("iframe");
        b.src = "", b.style.display = "none", y.insertBefore(b, C);
        const E = b.contentDocument, { close: a } = E;
        return E.close = () => {
          y.removeChild(b), a.call(E);
        }, E;
      }, t(u, m);
    };
    function c(u) {
      return u.nodeType === Node.ELEMENT_NODE && (u.tagName === "SCRIPT" && u.src && !(u.noModule || u.type === "module" || u.hasAttribute("async") || u.hasAttribute("defer")) || u.tagName === "LINK" && u.rel === "stylesheet" && (!u.media || matchMedia(u.media).matches));
    }
    function p(u) {
      let m;
      if (u.nodeType === Node.ELEMENT_NODE) {
        switch (u.tagName) {
          case "SCRIPT":
            u.src && !u.noModule && (m = document.createElement("link"), m.href = u.src, u.getAttribute("type") === "module" ? m.rel = "modulepreload" : (m.rel = "preload", m.as = "script"));
            break;
          case "LINK":
            u.rel === "stylesheet" && (!u.media || matchMedia(u.media).matches) && (m = document.createElement("link"), m.href = u.href, m.rel = "preload", m.as = "style");
            break;
          case "IMG":
            m = document.createElement("link"), m.rel = "preload", m.as = "image", u.srcset ? (m.imageSrcset = u.srcset, m.imageSizes = u.sizes) : m.href = u.src;
            break;
        }
        m && (u.integrity && (m.integrity = u.integrity), u.crossOrigin && (m.crossOrigin = u.crossOrigin));
      }
      return m;
    }
    function f(u, m) {
      u && m && m.appendChild(u);
    }
    function S(u) {
      const { tagName: m } = u;
      return m === "SCRIPT" && !u.src || m === "STYLE";
    }
    e.exports = function u(m, w) {
      if (this instanceof u)
        return new WritableStream(u(m, w));
      const y = w ? w.nextSibling : null, C = t(m, y);
      C.write("<!DOCTYPE html><body><template>");
      const b = C.body.firstChild.content, E = C.createTreeWalker(b), a = new WeakMap([[b, m]]);
      let s = null, l = null, i, d = !1, o = null;
      return {
        write(g) {
          C.write(g), s && !o && (a.get(s).data = s.data), h();
        },
        abort() {
          d && a.get(E.currentNode).remove();
        },
        close() {
          return f(s, o), d ? new Promise((g) => i = g) : Promise.resolve();
        }
      };
      function h() {
        let g;
        if (d) {
          const v = E.currentNode;
          for (l && (E.currentNode = l); g = E.nextNode(); ) {
            const N = p(l = g);
            N && (N.onload = N.onerror = () => m.removeChild(N), m.insertBefore(N, y));
          }
          E.currentNode = v;
        } else {
          for (; g = E.nextNode(); ) {
            const v = document.importNode(g, !1), N = s;
            g.nodeType === Node.TEXT_NODE ? s = g : (s = null, c(v) && (d = !0, v.onload = v.onerror = () => {
              d = !1, v.parentNode && h();
            }));
            const x = a.get(g.parentNode);
            if (a.set(g, v), S(x) ? o = x : (f(N, o), o = null, x === m ? m.insertBefore(v, y) : x.appendChild(v)), d)
              return h();
          }
          i && i();
        }
      }
    };
  }
});
const V = G(), O = (r) => r.replace(
  new RegExp("(?<=^|[\\s>+~,(])\\b(body|head|html)\\b(?=[\\s>+~),:.#[\\]]|$)", "gi"),
  (e) => `wf-${e.toLowerCase()}`
);
function Y(r, e) {
  var y;
  Z();
  const n = document.createElement("iframe");
  n.hidden = !0;
  const t = {
    iframeDocumentReadyState: "loading",
    iframe: n
  }, c = e.container, p = Object.assign(
    c.shadowRoot ?? c.attachShadow({ mode: "open" }),
    {
      [T]: t
    }
  ), f = new CSSStyleSheet();
  f.insertRule(":host { display: block; position: relative; }"), (y = c.shadowRoot) == null || y.adoptedStyleSheets.push(f);
  let { promise: S, resolve: u } = Promise.withResolvers();
  n.addEventListener("load", () => {
    Q(n, p, e.bound), u();
  });
  let m;
  if (typeof r == "string") {
    const C = r;
    c.setAttribute("reframed-src", C), m = K(
      r,
      c.shadowRoot,
      n,
      e
    );
  } else
    m = J(r, n);
  const w = Promise.all([S, m]).then(() => {
    c.shadowRoot[T].iframeDocumentReadyState = "interactive", c.shadowRoot.dispatchEvent(new Event("readystatechange")), setTimeout(() => {
      c.shadowRoot[T].iframeDocumentReadyState = "complete", c.shadowRoot.dispatchEvent(new Event("readystatechange"));
    }, 2e3);
  });
  return {
    iframe: n,
    container: c,
    ready: w
  };
}
async function K(r, e, n, t) {
  console.debug("reframing (with fetch)!", {
    source: r,
    targetContainer: e
  });
  const c = await fetch(r, {
    headers: t.headers
  }), p = c.status === 200 ? c.body : ee(
    `error fetching ${r} (HTTP Status = ${c.status})<hr>${await c.text()}`
  ), { promise: f, resolve: S } = Promise.withResolvers();
  n.src = r, n.name = t.name;
  let u = !1;
  return n.addEventListener("load", () => {
    var m;
    if (u) {
      t.bound ? n.ownerDocument.defaultView.location.href = (m = n == null ? void 0 : n.contentWindow) == null ? void 0 : m.location.href : (console.warn("unbound fragment reload detected, clearing fragment content!"), e.innerHTML = "");
      return;
    }
    p.pipeThrough(new TextDecoderStream()).pipeTo(new V(e)).finally(() => {
      u = !0, S();
    });
  }), document.body.appendChild(n), f;
}
async function J(r, e) {
  console.debug("reframing! (reframeFromTarget)", { source: r }), e.src = document.location.href;
  const n = [...r.querySelectorAll("script")], { promise: t, resolve: c } = Promise.withResolvers();
  return e.addEventListener("load", () => {
    n.forEach((p) => {
      const f = p.getAttribute("data-script-type");
      p.removeAttribute("data-script-type"), p.removeAttribute("type"), f && p.setAttribute("type", f), I(e.contentDocument !== null, "iframe.contentDocument is not defined"), A(e.contentDocument, "body").appendChild(e.contentDocument.importNode(p, !0));
    }), c();
  }), document.body.appendChild(e), t;
}
function Q(r, e, n) {
  I(
    r.contentWindow !== null && r.contentDocument !== null,
    "attempted to patch iframe before it was ready"
  );
  const t = r.contentWindow, c = r.contentDocument;
  if ((t == null ? void 0 : t.location.origin) === "null" && (t == null ? void 0 : t.location.protocol) === "about:")
    return;
  const p = e.host.ownerDocument, f = p.defaultView, S = Object.entries(Object.getOwnPropertyDescriptors(t)).flatMap(
    ([a, s]) => /^[A-Z]/.test(a) && typeof s.value == "function" ? s.value : []
  );
  function u(a) {
    const s = f[this.name];
    return Function.prototype[Symbol.hasInstance].call(this, a) || typeof s == "function" && a instanceof s;
  }
  S.forEach((a) => {
    Object.defineProperty(a, Symbol.hasInstance, {
      value: u
    });
  });
  let m;
  H(c, "body"), Object.defineProperties(c, {
    title: {
      get: function() {
        var a, s;
        return m ?? // https://html.spec.whatwg.org/multipage/dom.html#document.title
        ((s = (a = e.querySelector("title")) == null ? void 0 : a.textContent) == null ? void 0 : s.trim()) ?? "[reframed document]";
      },
      set: function(a) {
        m = a;
      }
    },
    readyState: {
      get() {
        return e[T].iframeDocumentReadyState === "complete" && console.warn(
          "reframed warning: `document.readyState` possibly returned `'complete'` prematurely. If your app is not working correctly, please see https://github.com/web-fragments/web-fragments/issues/36  and comment on this issue so that we can prioritize fixing it."
        ), e[T].iframeDocumentReadyState;
      }
    },
    // redirect getElementById to be a scoped reframedContainer.querySelector query
    getElementById: {
      value(a) {
        return e.querySelector(`[id="${a}"]`);
      }
    },
    getElementsByClassName: {
      value(a) {
        var s;
        return (s = e.firstElementChild) == null ? void 0 : s.getElementsByClassName(a);
      }
    },
    getElementsByName: {
      value(a) {
        return e.querySelector(`[name="${a}"]`);
      }
    },
    getElementsByTagNameNS: {
      value(a, s) {
        var l;
        return (l = e.firstElementChild) == null ? void 0 : l.getElementsByTagNameNS(a, s);
      }
    },
    // redirect to mainDocument
    activeElement: {
      get: () => e.activeElement
    },
    styleSheets: {
      get: () => e.styleSheets
    },
    dispatchEvent: {
      value(a) {
        return e.dispatchEvent(a);
      }
    },
    childElementCount: {
      get() {
        return e.childElementCount;
      }
    },
    hasChildNodes: {
      value(a) {
        return e.hasChildNodes();
      }
    },
    children: {
      get() {
        return e.children;
      }
    },
    firstElementChild: {
      get() {
        return e.firstElementChild;
      }
    },
    firstChild: {
      get() {
        return e.firstChild;
      }
    },
    lastElementChild: {
      get() {
        return e.lastElementChild;
      }
    },
    lastChild: {
      get() {
        return e.lastChild;
      }
    },
    rootElement: {
      get() {
        return e.firstChild;
      }
    }
  }), Object.defineProperties(c, {
    querySelector: {
      value(a) {
        return e.querySelector(O(a));
      }
    },
    querySelectorAll: {
      value(a) {
        return e.querySelectorAll(O(a));
      }
    },
    getElementsByTagName: {
      value(a) {
        return e.querySelectorAll(O(a));
      }
    },
    documentElement: {
      get() {
        return e.querySelector("wf-html");
      }
    },
    head: {
      get() {
        return e.querySelector("wf-head");
      }
    },
    body: {
      get() {
        return e.querySelector("wf-body");
      }
    }
  }), H(t, "history");
  class w extends PopStateEvent {
  }
  if (n) {
    H(t, "history");
    const a = new Proxy(f.history, {
      get(s, l, i) {
        var d;
        return typeof ((d = Object.getOwnPropertyDescriptor(History.prototype, l)) == null ? void 0 : d.value) == "function" ? function(...o) {
          const h = Reflect.apply(
            History.prototype[l],
            this === i ? s : this,
            o
          );
          return f.dispatchEvent(new w("popstate")), h;
        } : Reflect.get(s, l, s);
      },
      set(s, l, i) {
        return Reflect.set(s, l, i);
      }
    });
    Object.defineProperties(t, {
      history: {
        get() {
          return a;
        }
      }
    });
  } else {
    const a = [
      { state: t.history.state, title: c.title, url: t.location.href }
    ];
    let s = 0;
    Object.defineProperties(t.history, {
      pushState: {
        value: function(i, d, o) {
          s !== a.length - 1 && a.splice(s + 1), a.push({ state: i, title: d, url: o ?? null }), s++, t.history.replaceState(i, d, o);
        }
      },
      back: {
        value: function() {
          if (s === 0) return;
          s--;
          let { state: i, title: d, url: o } = a[s];
          t.history.replaceState(i, d, o);
        }
      },
      forward: {
        value: function() {
          if (s === a.length - 1) return;
          s++;
          let { state: i, title: d, url: o } = a[s];
          t.history.replaceState(i, d, o);
        }
      },
      length: {
        get() {
          return a.length;
        }
      }
    });
  }
  t.IntersectionObserver = f.IntersectionObserver, t.MutationObserver = f.MutationObserver, t.ResizeObserver = f.ResizeObserver;
  const y = ["innerHeight", "innerWidth", "outerHeight", "outerWidth", "visualViewport"];
  for (const a of y)
    Object.defineProperty(t, a, {
      get: function() {
        return f[a];
      }
    });
  const C = [
    "createAttributeNS",
    "createCDATASection",
    "createComment",
    "createDocumentFragment",
    "createEvent",
    "createExpression",
    "createNSResolver",
    "createNodeIterator",
    "createProcessingInstruction",
    "createRange",
    "createTextNode",
    "createTreeWalker"
  ];
  for (const a of C)
    Object.defineProperty(c, a, {
      value: function() {
        return p[a].apply(p, arguments);
      }
    });
  Object.defineProperties(c, {
    createElement: {
      value: function(...[s]) {
        return Document.prototype.createElement.apply(
          s.includes("-") ? c : p,
          arguments
        );
      }
    },
    createElementNS: {
      value: function(...[s, l]) {
        return Document.prototype.createElementNS.apply(
          s === "http://www.w3.org/1999/xhtml" && l.includes("-") ? c : p,
          arguments
        );
      }
    }
  });
  const b = new AbortController(), E = ["DOMContentLoaded", "popstate", "unload"];
  if (t.EventTarget.prototype.addEventListener = new Proxy(t.EventTarget.prototype.addEventListener, {
    apply(a, s, l) {
      const [i, d, o] = l, h = typeof o == "boolean" ? { capture: o } : typeof o == "object" ? o : {}, g = AbortSignal.any([b.signal, h.signal].filter((N) => N != null)), v = [i, d, { ...h, signal: g }];
      return E.includes(i) || (s === t ? s = f : s === c && (s = e)), Reflect.apply(a, s, v);
    }
  }), t.EventTarget.prototype.removeEventListener = new Proxy(
    t.EventTarget.prototype.removeEventListener,
    {
      apply(a, s, l) {
        const [i] = l;
        return E.includes(i) || (s === t ? s = f : s === c && (s = e)), Reflect.apply(a, s, l);
      }
    }
  ), n) {
    const a = (s) => {
      A(t, "history").replaceState(window.history.state, "", window.location.href), !(s instanceof w) && t.dispatchEvent(new PopStateEvent("popstate", s instanceof PopStateEvent ? s : void 0));
    };
    window.addEventListener("reframed:navigate", a, {
      signal: b.signal
    }), window.addEventListener("popstate", a, {
      signal: b.signal
    });
  }
  t.addEventListener("unload", () => b.abort());
}
function U() {
  ["pushState", "replaceState", "back", "forward", "go"].forEach((e) => {
    const n = window.history[e];
    Object.defineProperty(window.history, e, {
      // TODO: come up with a better workaround that a no-op setter that doesn't break Qwik.
      // QwikCity tries to monkey-patch `pushState` and `replaceState` which results in a runtime error:
      //   TypeError: Cannot set property pushState of #<History> which only has a getter
      // https://github.com/QwikDev/qwik/blob/3c5e5a7614c3f64cbf89f1304dd59609053eddf0/packages/qwik-city/runtime/src/spa-init.ts#L127-L135
      set: () => {
      },
      get: () => function() {
        Reflect.apply(n, window.history, arguments), window.dispatchEvent(new CustomEvent("reframed:navigate"));
      },
      configurable: !0
    });
  });
}
function X() {
  const r = Element.prototype.replaceWith;
  function e(l, i) {
    if (!["module", "text/javascript", "importmap", "speculationrules", "", null].includes(l.getAttribute("type")))
      return l;
    const o = i.iframe;
    if (I(o.contentDocument !== null, "iframe.contentDocument is not defined"), !l.src && !l.textContent) {
      const v = document.importNode(l, !0);
      return A(o.contentDocument, "body").appendChild(l), v;
    }
    const h = o.contentDocument.importNode(l, !0);
    A(o.contentDocument, "body").appendChild(h);
    const g = document.importNode(h, !0);
    return r.call(l, g), g;
  }
  function n(l, i) {
    var o;
    (((o = l.querySelectorAll) == null ? void 0 : o.call(l, "script")) ?? []).forEach((h) => e(h, i));
  }
  function t(l) {
    const i = y.call(l);
    return L(i);
  }
  function c(l) {
    const i = y.call(l);
    if (!L(i))
      throw new Error("Missing reframed metadata!");
    return i[T];
  }
  const p = /* @__PURE__ */ new Set(["WF-HTML", "WF-HEAD", "WF-BODY"]);
  function f(l) {
    const i = l.tagName;
    p.has(i) && Object.defineProperty(l, "tagName", {
      get() {
        return i.replace(/^WF-/i, "");
      }
    });
  }
  const S = Node.prototype.appendChild;
  Node.prototype.appendChild = function(i) {
    if (t(this)) {
      const d = c(this);
      n(i, d), i instanceof HTMLScriptElement && (i = arguments[0] = e(i, d)), i instanceof HTMLElement && f(i);
    }
    return S.apply(this, arguments);
  };
  const u = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(i, d) {
    if (t(this)) {
      const o = c(this);
      n(i, o), i instanceof HTMLScriptElement && (i = arguments[0] = e(i, o)), i instanceof HTMLElement && f(i);
    }
    return u.apply(this, arguments);
  };
  const m = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function(i, d) {
    if (t(this)) {
      const o = c(this);
      n(i, o), i instanceof HTMLScriptElement && t(i) && (i = arguments[0] = e(i, o));
    }
    return m.apply(this, arguments);
  };
  const w = Object.getOwnPropertyDescriptor(Node.prototype, "ownerDocument").get;
  Object.defineProperty(Node.prototype, "ownerDocument", {
    configurable: !0,
    enumerable: !0,
    get() {
      return t(this) ? y.call(this)[T].iframe.contentDocument : w.call(this);
    }
  });
  const y = Node.prototype.getRootNode;
  Node.prototype.getRootNode = function(i) {
    const d = y.call(this);
    return L(d) ? d[T].iframe.contentDocument : i ? y.call(this, i) : d;
  };
  const C = Element.prototype.after;
  Element.prototype.after = function(...i) {
    if (t(this)) {
      const d = c(this);
      i.forEach((o, h) => {
        typeof o != "string" && (n(o, d), o instanceof HTMLScriptElement && (o = arguments[h] = e(o, d)));
      });
    }
    return C.apply(this, arguments);
  };
  const b = Element.prototype.append;
  Element.prototype.append = function(...i) {
    if (t(this)) {
      const d = c(this);
      i.forEach((o, h) => {
        typeof o != "string" && (n(o, d), o instanceof HTMLScriptElement && (o = arguments[h] = e(o, d)));
      });
    }
    return b.apply(this, arguments);
  };
  const E = Element.prototype.insertAdjacentElement;
  Element.prototype.insertAdjacentElement = function(i, d) {
    if (t(this)) {
      const o = c(this);
      n(d, o), d instanceof HTMLScriptElement && (d = arguments[1] = e(d, o));
    }
    return E.apply(this, arguments);
  };
  const a = Element.prototype.prepend;
  Element.prototype.prepend = function(...i) {
    if (t(this)) {
      const d = c(this);
      i.forEach((o, h) => {
        typeof o != "string" && (n(o, d), o instanceof HTMLScriptElement && (o = arguments[h] = e(o, d)));
      });
    }
    return a.apply(this, arguments);
  };
  const s = Element.prototype.replaceChildren;
  Element.prototype.replaceChildren = function(...i) {
    if (t(this)) {
      const d = c(this);
      i.forEach((o, h) => {
        typeof o != "string" && (n(o, d), o instanceof HTMLScriptElement && (o = arguments[h] = e(o, d)));
      });
    }
    return s.apply(this, arguments);
  }, Element.prototype.replaceWith = function(...i) {
    if (t(this)) {
      const d = c(this);
      i.forEach((o, h) => {
        typeof o != "string" && (n(o, d), o instanceof HTMLScriptElement && (o = arguments[h] = e(o, d)));
      });
    }
    return r.apply(this, arguments);
  };
}
function Z(r) {
  z in window || (Object.assign(window, { [z]: !0 }), X()), F in window || (Object.assign(window, { [F]: !0 }), U());
}
const ee = (r) => new ReadableStream({
  start(e) {
    e.enqueue(new TextEncoder().encode(r)), e.close();
  }
});
function I(r, e) {
  console.assert(r, e);
}
const z = Symbol("reframed:initialized"), F = Symbol("reframed:initializedHistoryPatch"), T = Symbol("reframed:metadata"), D = Symbol("reframed:references");
function L(r) {
  return r instanceof ShadowRoot && r[T] !== void 0;
}
function H(r, e) {
  r[D] ?? (r[D] = {}), r[D][e] = Reflect.get(r, e);
}
function A(r, e) {
  const n = r[D];
  if (!n || n[e] === void 0)
    throw new Error(`Attempted to access internal reference "${String(e)}" before it was set.`);
  return n[e];
}
var P;
class te extends HTMLElement {
  constructor() {
    super();
    W(this, P);
    R(this, "ready");
    R(this, "isInitialized", !1);
    R(this, "isPortaling", !1);
    this.handlePiercing = this.handlePiercing.bind(this);
  }
  async connectedCallback() {
    if (!this.isInitialized) {
      this.isInitialized = !0;
      const n = this.getAttribute("fragment-id"), t = this.getAttribute("src") ? this.getAttribute("src") : null, c = location.pathname + location.search;
      if (!n)
        throw new Error("The <web-fragment-host> is missing fragment-id attribute!");
      const { iframe: p, ready: f } = Y(this.shadowRoot ?? t ?? c, {
        container: this,
        headers: { "x-fragment-mode": "embedded" },
        bound: !t,
        name: n
      });
      _(this, P, p), this.ready = f, document.addEventListener("fragment-outlet-ready", this.handlePiercing);
    }
  }
  async disconnectedCallback() {
    if (this.isPortaling) {
      this.isPortaling = !1;
      return;
    }
    M(this, P) && !this.isPortaling && (M(this, P).remove(), _(this, P, void 0), document.removeEventListener("fragment-outlet-ready", this.handlePiercing));
  }
  async handlePiercing(n) {
    var f;
    if (n.defaultPrevented || n.target.getAttribute("fragment-id") !== this.getAttribute("fragment-id"))
      return;
    n.preventDefault(), await this.ready, this.neutralizeScriptTags(), this.preserveStylesheets();
    const t = (f = this.shadowRoot) == null ? void 0 : f.activeElement, c = this.getSelectionRange();
    this.isPortaling = !0, n.target.shadowRoot.replaceChildren(this), t && t.focus(), c && this.setSelectionRange(c), this.restoreScriptTags(), this.removeAttribute("data-piercing");
  }
  // A best-effort attempt at avoiding a FOUC.
  //
  // Teleporting the web-fragment-host into the web-fragment requires removing then re-inserting the node from the document,
  // which causes the browser to perform all of the steps for node removal and insertion respectively,
  // namely unloading styles and (potentially asynchronously) reloading them. We can mostly mitigate the FOUC
  // by copying all of the loaded style rules into Constructed Stylesheets and attaching them to the shadow root
  // so they're synchronously available.
  //
  // There are major caveats with with this approach, however. Constructed Stylesheets don't allow `@import` rules,
  // and cross-origin imported stylesheets don't allow introspection of their CSS rules, so these aren't copyable.
  // Secondly, `adoptedStylesheets` take precedence over normal stylesheets so we have the potential to overshadow
  // style rules that get added after we've preserved the existing styles.
  //
  // Until we have the ability to perform atomic move operations in the DOM (https://github.com/whatwg/dom/issues/1255)
  // this is probably the best way we can deal with the FOUC.
  preserveStylesheets() {
    this.shadowRoot && (this.shadowRoot.adoptedStyleSheets = Array.from(this.shadowRoot.styleSheets, (n) => {
      const t = new CSSStyleSheet();
      return [...n.cssRules].forEach((c) => {
        c instanceof CSSImportRule || t.insertRule(c.cssText, t.cssRules.length);
      }), t;
    }));
  }
  neutralizeScriptTags() {
    [...this.shadowRoot.querySelectorAll("script")].forEach((t) => {
      const c = t.getAttribute("type");
      c && t.setAttribute("data-script-type", c), t.setAttribute("type", "inert");
    });
  }
  restoreScriptTags() {
    [...this.shadowRoot.querySelectorAll("script")].forEach((t) => {
      t.removeAttribute("type");
      const c = t.getAttribute("data-script-type");
      c && t.setAttribute("type", c), t.removeAttribute("data-script-type");
    });
  }
  // Make a best-effort attempt at capturing selection state.
  // Note that ShadowRoot.getSelection() is only supported in Chromium browsers.
  // Also, Selection.getRangeAt() has unspecified behavior for selections that
  // span across shadow root boundaries. We can utilize
  // https://developer.mozilla.org/en-US/docs/Web/API/Selection/getComposedRanges
  // to help with this once it gets more browser support.
  getSelectionRange() {
    var n;
    try {
      return (n = this.shadowRoot.getSelection()) == null ? void 0 : n.getRangeAt(0);
    } catch {
      return null;
    }
  }
  setSelectionRange(n) {
    try {
      const t = this.shadowRoot.getSelection();
      t == null || t.removeAllRanges(), t == null || t.addRange(n);
    } catch {
    }
  }
}
P = new WeakMap();
class ne extends HTMLElement {
  async connectedCallback() {
    var p, f;
    const e = this.getAttribute("fragment-id"), n = this.getAttribute("src");
    if (!e)
      throw new Error("The <web-fragment> is missing fragment-id attribute!");
    this.attachShadow({ mode: "open" });
    const t = new CSSStyleSheet();
    if (t.insertRule(":host { display: block; position: relative; }"), (p = this.shadowRoot) == null || p.adoptedStyleSheets.push(t), this.dispatchEvent(
      new Event("fragment-outlet-ready", { bubbles: !0, cancelable: !0 })
    )) {
      const S = document.createElement("web-fragment-host");
      S.setAttribute("fragment-id", e), n && S.setAttribute("src", n), (f = this.shadowRoot) == null || f.appendChild(S);
    }
  }
}
function oe() {
  window.customElements.define("web-fragment", ne), window.customElements.define("web-fragment-host", te);
}
export {
  ne as WebFragment,
  te as WebFragmentHost,
  oe as initializeWebFragments
};
