var W = Object.defineProperty;
var O = (t) => {
  throw TypeError(t);
};
var $ = (t, r, e) => r in t ? W(t, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[r] = e;
var N = (t, r, e) => $(t, typeof r != "symbol" ? r + "" : r, e), S = (t, r, e) => r.has(t) || O("Cannot " + e);
var D = (t, r, e) => (S(t, r, "read from private field"), e ? e.call(t) : r.get(t)), _ = (t, r, e) => r.has(t) ? O("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(t) : r.set(t, e), F = (t, r, e, n) => (S(t, r, "write to private field"), n ? n.call(t, e) : r.set(t, e), e);
import { getWebMiddleware as X } from "./gateway/web.js";
function B(t) {
  for (var r = [], e = 0; e < t.length; ) {
    var n = t[e];
    if (n === "*" || n === "+" || n === "?") {
      r.push({ type: "MODIFIER", index: e, value: t[e++] });
      continue;
    }
    if (n === "\\") {
      r.push({ type: "ESCAPED_CHAR", index: e++, value: t[e++] });
      continue;
    }
    if (n === "{") {
      r.push({ type: "OPEN", index: e, value: t[e++] });
      continue;
    }
    if (n === "}") {
      r.push({ type: "CLOSE", index: e, value: t[e++] });
      continue;
    }
    if (n === ":") {
      for (var f = "", a = e + 1; a < t.length; ) {
        var c = t.charCodeAt(a);
        if (
          // `0-9`
          c >= 48 && c <= 57 || // `A-Z`
          c >= 65 && c <= 90 || // `a-z`
          c >= 97 && c <= 122 || // `_`
          c === 95
        ) {
          f += t[a++];
          continue;
        }
        break;
      }
      if (!f)
        throw new TypeError("Missing parameter name at ".concat(e));
      r.push({ type: "NAME", index: e, value: f }), e = a;
      continue;
    }
    if (n === "(") {
      var p = 1, d = "", a = e + 1;
      if (t[a] === "?")
        throw new TypeError('Pattern cannot start with "?" at '.concat(a));
      for (; a < t.length; ) {
        if (t[a] === "\\") {
          d += t[a++] + t[a++];
          continue;
        }
        if (t[a] === ")") {
          if (p--, p === 0) {
            a++;
            break;
          }
        } else if (t[a] === "(" && (p++, t[a + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(a));
        d += t[a++];
      }
      if (p)
        throw new TypeError("Unbalanced pattern at ".concat(e));
      if (!d)
        throw new TypeError("Missing pattern at ".concat(e));
      r.push({ type: "PATTERN", index: e, value: d }), e = a;
      continue;
    }
    r.push({ type: "CHAR", index: e, value: t[e++] });
  }
  return r.push({ type: "END", index: e, value: "" }), r;
}
function U(t, r) {
  r === void 0 && (r = {});
  for (var e = B(t), n = r.prefixes, f = n === void 0 ? "./" : n, a = "[^".concat(T(r.delimiter || "/#?"), "]+?"), c = [], p = 0, d = 0, o = "", u = function(s) {
    if (d < e.length && e[d].type === s)
      return e[d++].value;
  }, m = function(s) {
    var w = u(s);
    if (w !== void 0)
      return w;
    var E = e[d], I = E.type, b = E.index;
    throw new TypeError("Unexpected ".concat(I, " at ").concat(b, ", expected ").concat(s));
  }, x = function() {
    for (var s = "", w; w = u("CHAR") || u("ESCAPED_CHAR"); )
      s += w;
    return s;
  }; d < e.length; ) {
    var v = u("CHAR"), y = u("NAME"), R = u("PATTERN");
    if (y || R) {
      var h = v || "";
      f.indexOf(h) === -1 && (o += h, h = ""), o && (c.push(o), o = ""), c.push({
        name: y || p++,
        prefix: h,
        suffix: "",
        pattern: R || a,
        modifier: u("MODIFIER") || ""
      });
      continue;
    }
    var l = v || u("ESCAPED_CHAR");
    if (l) {
      o += l;
      continue;
    }
    o && (c.push(o), o = "");
    var A = u("OPEN");
    if (A) {
      var h = x(), M = u("NAME") || "", i = u("PATTERN") || "", g = x();
      m("CLOSE"), c.push({
        name: M || (i ? p++ : ""),
        pattern: M && !i ? a : i,
        prefix: h,
        suffix: g,
        modifier: u("MODIFIER") || ""
      });
      continue;
    }
    m("END");
  }
  return c;
}
function L(t, r) {
  var e = [], n = H(t, e, r);
  return q(n, e, r);
}
function q(t, r, e) {
  e === void 0 && (e = {});
  var n = e.decode, f = n === void 0 ? function(a) {
    return a;
  } : n;
  return function(a) {
    var c = t.exec(a);
    if (!c)
      return !1;
    for (var p = c[0], d = c.index, o = /* @__PURE__ */ Object.create(null), u = function(x) {
      if (c[x] === void 0)
        return "continue";
      var v = r[x - 1];
      v.modifier === "*" || v.modifier === "+" ? o[v.name] = c[x].split(v.prefix + v.suffix).map(function(y) {
        return f(y, v);
      }) : o[v.name] = f(c[x], v);
    }, m = 1; m < c.length; m++)
      u(m);
    return { path: p, index: d, params: o };
  };
}
function T(t) {
  return t.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function C(t) {
  return t && t.sensitive ? "" : "i";
}
function G(t, r) {
  if (!r)
    return t;
  for (var e = /\((?:\?<(.*?)>)?(?!\?)/g, n = 0, f = e.exec(t.source); f; )
    r.push({
      // Use parenthesized substring match if available, index otherwise
      name: f[1] || n++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    }), f = e.exec(t.source);
  return t;
}
function Y(t, r, e) {
  var n = t.map(function(f) {
    return H(f, r, e).source;
  });
  return new RegExp("(?:".concat(n.join("|"), ")"), C(e));
}
function j(t, r, e) {
  return z(U(t, e), r, e);
}
function z(t, r, e) {
  e === void 0 && (e = {});
  for (var n = e.strict, f = n === void 0 ? !1 : n, a = e.start, c = a === void 0 ? !0 : a, p = e.end, d = p === void 0 ? !0 : p, o = e.encode, u = o === void 0 ? function(b) {
    return b;
  } : o, m = e.delimiter, x = m === void 0 ? "/#?" : m, v = e.endsWith, y = v === void 0 ? "" : v, R = "[".concat(T(y), "]|$"), h = "[".concat(T(x), "]"), l = c ? "^" : "", A = 0, M = t; A < M.length; A++) {
    var i = M[A];
    if (typeof i == "string")
      l += T(u(i));
    else {
      var g = T(u(i.prefix)), s = T(u(i.suffix));
      if (i.pattern)
        if (r && r.push(i), g || s)
          if (i.modifier === "+" || i.modifier === "*") {
            var w = i.modifier === "*" ? "?" : "";
            l += "(?:".concat(g, "((?:").concat(i.pattern, ")(?:").concat(s).concat(g, "(?:").concat(i.pattern, "))*)").concat(s, ")").concat(w);
          } else
            l += "(?:".concat(g, "(").concat(i.pattern, ")").concat(s, ")").concat(i.modifier);
        else
          i.modifier === "+" || i.modifier === "*" ? l += "((?:".concat(i.pattern, ")").concat(i.modifier, ")") : l += "(".concat(i.pattern, ")").concat(i.modifier);
      else
        l += "(?:".concat(g).concat(s, ")").concat(i.modifier);
    }
  }
  if (d)
    f || (l += "".concat(h, "?")), l += e.endsWith ? "(?=".concat(R, ")") : "$";
  else {
    var E = t[t.length - 1], I = typeof E == "string" ? h.indexOf(E[E.length - 1]) > -1 : E === void 0;
    f || (l += "(?:".concat(h, "(?=").concat(R, "))?")), I || (l += "(?=".concat(h, "|").concat(R, ")"));
  }
  return new RegExp(l, C(e));
}
function H(t, r, e) {
  return t instanceof RegExp ? G(t, r) : Array.isArray(t) ? Y(t, r, e) : j(t, r, e);
}
var P;
class K {
  constructor(r) {
    N(this, "fragmentConfigs", /* @__PURE__ */ new Map());
    N(this, "routeMap", /* @__PURE__ */ new Map());
    _(this, P);
    F(this, P, (r == null ? void 0 : r.prePiercingStyles) ?? "");
  }
  get prePiercingStyles() {
    return D(this, P);
  }
  /**
   * Registers a fragment in the gateway worker so that it can be integrated
   * with the gateway worker.
   *
   * @param fragmentConfig Configuration object for the fragment.
   */
  registerFragment(r) {
    if (this.fragmentConfigs.has(r.fragmentId)) {
      console.warn(
        `\x1B[31m Warning: you're trying to register a fragment with id "${r.fragmentId}", but a fragment with the same fragmentId has already been registered, thus this duplicate registration will be ignored. \x1B[0m`
      );
      return;
    }
    if (r.upstream && !r.endpoint)
      throw new Error(
        `\x1B[31m You're using the deprecated \`upstream\` property in the fragment config for fragment with id "${r.fragmentId}". Please use \`endpoint\` config property instead. \x1B[0m`
      );
    r.piercing ?? (r.piercing = !0), this.fragmentConfigs.set(r.fragmentId, r), r.routePatterns.forEach((e) => {
      const n = L(e, {
        decode: globalThis.decodeURIComponent
      });
      this.routeMap.set(n, r);
    });
  }
  matchRequestToFragment(r) {
    const e = [...this.routeMap.keys()].find((n) => n(r));
    return e ? this.routeMap.get(e) ?? null : null;
  }
}
P = new WeakMap();
export {
  K as FragmentGateway,
  X as getWebMiddleware
};
