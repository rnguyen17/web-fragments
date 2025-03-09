import { getWebMiddleware as H } from "./web.js";
import h from "node:stream";
function y(e) {
  return async function(d, t, r) {
    const a = R(d);
    let c;
    const s = new Promise((n) => {
      c = n;
    }), { originResponsePromise: m, sendResponse: f } = v(t, r, s), o = await e(a, function() {
      return c(), m;
    });
    f(o);
  };
}
function R(e) {
  const i = new Headers();
  for (const [t, r] of Object.entries(e.headers))
    Array.isArray(r) ? r.forEach((a) => i.append(t, a)) : r && i.append(t, r);
  let d;
  return e.method !== "GET" && e.method !== "HEAD" && (d = h.Readable.toWeb(e)), new Request(w(e), {
    method: e.method,
    headers: i,
    body: d
  });
}
function w(e) {
  return new URL(`${N(e) ? "https" : "http"}://${e.headers.host || "localhost"}${e.url}`);
}
function p(e, i, d) {
  let t;
  const r = new ReadableStream({
    start(o) {
      t = o;
    }
  }), a = {
    flushHeaders: e.flushHeaders.bind(e),
    write: e.write.bind(e),
    writeHead: e.writeHead.bind(e),
    writeHeadUnbound: e.writeHead,
    end: e.end.bind(e),
    destroy: e.destroy.bind(e)
  };
  let c, s;
  const m = new Promise((o) => {
    s = o;
  });
  function f(o, n, g) {
    c || (c = {
      status: o ?? e.statusCode,
      statusText: n ?? e.statusMessage,
      headers: { ...e.getHeaders(), ...g }
    }, Object.keys(c.headers).forEach((u) => {
      e.removeHeader(u);
    }), s(c));
  }
  e.flushHeaders = function() {
    f();
  }, e.writeHead = function(n) {
    const g = arguments[1] instanceof String ? arguments[1] : "", u = arguments[1] instanceof Object ? arguments[1] : arguments[2];
    return f(n, g, u), e;
  }, e.write = function(n) {
    f();
    const g = n instanceof String ? arguments[1] instanceof String ? arguments[1] : "utf8" : void 0, u = arguments[1] instanceof Function ? arguments[1] : arguments[2], b = Buffer.from(n, g);
    return t.enqueue(b), u && u(null), !0;
  }, e.end = function() {
    f();
    const n = arguments[0] instanceof Function ? null : arguments[0], g = n instanceof String ? arguments[1] instanceof String ? arguments[1] : "utf8" : void 0, u = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : arguments[2];
    if (n) {
      const b = Buffer.from(n, g);
      t.enqueue(b);
    }
    return t.close(), u && u(null), e;
  }, e.destroy = function(n) {
    return t.error(n), e;
  }, d.then(() => {
    i();
  });
  const l = Object.create(e);
  return l.flushHeaders = a.flushHeaders, l.writeHead = a.writeHead, l.write = a.write, l.end = a.end, l.destroy = a.destroy, {
    originResponse: { head: m, body: r },
    serverResponse: l
  };
}
function v(e, i, d) {
  const { originResponse: t, serverResponse: r } = p(
    e,
    i,
    d
  );
  return { originResponsePromise: t.head.then((s) => new Response(t.body, s)), sendResponse: async (s) => {
    s.headers.forEach((m, f) => {
      e.appendHeader(f, m);
    }), r.writeHead(s.status, s.statusText), s.body ? h.Readable.fromWeb(s.body).pipe(r) : r.end();
  } };
}
const N = (e) => {
  var i;
  return e.headers["x-forwarded-proto"] === "https" || ((i = e.socket) == null ? void 0 : i.encrypted) === !0;
};
function T(e, i = {}) {
  const d = H(e, i);
  return async (t, r, a) => t.url && e.matchRequestToFragment(w(t).pathname) ? y(d)(t, r, a) : a();
}
export {
  T as getNodeMiddleware
};
