import { HTMLRewriter as g } from 'htmlrewriter';
const T = g.toString().endsWith('{ [native code] }');
function A(e, t = {}) {
  const { additionalHeaders: s = {}, mode: o = 'development' } = t;
  return async (r, h) => {
    var b;
    const c = e.matchRequestToFragment(new URL(r.url).pathname);
    if (!c) return await h();
    const p = r.headers.get('sec-fetch-dest');
    if (p === 'iframe')
      return new Response('<!doctype html><title>', {
        headers: { 'Content-Type': 'text/html', vary: 'sec-fetch-dest' },
      });
    const w =
      // but only if we are about to pierce, or are proxying the request to the fragment endpoint
      c.piercing || p !== 'document' ? l(r, c, s, o) : void 0;
    if (p === 'document') {
      const d = await h(),
        u = (b = d.headers.get('content-type')) == null ? void 0 : b.startsWith('text/html');
      return !d.ok || !u || !c.piercing
        ? (d.headers.append('vary', 'sec-fetch-dest'), d)
        : w
            .then(function (y) {
              if (y.ok) return y;
              throw y;
            })
            .catch(f)
            .then(R)
            .then(F)
            .then((m) =>
              i({
                appShellResponse: d,
                fragmentResponse: m,
                fragmentConfig: c,
                gateway: e,
              })
            )
            .then((m) => (m.headers.append('vary', 'sec-fetch-dest'), $(Promise.resolve(m), c)(m)))
            .catch(E);
    }
    const n = await w;
    if (p === 'empty')
      return R(
        new Response(n.body, {
          status: n.status,
          statusText: n.statusText,
          headers: {
            'content-type': n.headers.get('content-type') ?? 'text/plain',
            vary: 'sec-fetch-dest',
          },
        })
      );
    return new Response(n.body, {
      status: n.status,
      statusText: n.statusText,
      headers: { 'content-type': n.headers.get('content-type') ?? 'text/plain' },
    });
    async function f(d) {
      const { endpoint: u, onSsrFetchError: m = a } = c;
      let y;
      try {
        y = await m(r, d);
      } catch (S) {
        console.error('onSsrFetchError failed! Using defaultOnSssrFetchError handler instead', { cause: S }), (y = await a(r, d));
      }
      const { response: x, overrideResponse: v } = y;
      if (v) throw x;
      return x;
    }
    async function a(d, u) {
      return {
        response: new Response(
          o === 'development'
            ? `<p>Failed to fetch fragment!<br>
										Endpoint: ${c.endpoint}<br>
										Request: ${d.method} ${d.url}<br>
										Response: HTTP ${u instanceof Response ? `${u.status} ${u.statusText}<br>${await u.text()}` : u}
								</p>`
            : '<p>There was a problem fulfilling your request.</p>',
          { status: 500, headers: [['content-type', 'text/html']] }
        ),
        overrideResponse: !1,
      };
    }
  };
  async function l(r, h, c = {}, p = 'development') {
    const { endpoint: w } = h,
      n = new URL(r.url),
      f = new URL(`${n.pathname}${n.search}`, w),
      a = new Request(f, r);
    return (
      a.headers.set('x-forwarded-proto', r.headers.get('x-forwarded-proto') || n.protocol.slice(0, -1)),
      a.headers.set('x-forwarded-host', r.headers.get('x-forwarded-host') || n.host),
      Object.entries(c).forEach(([b, d]) => {
        a.headers.set(b, d);
      }),
      a.headers.set('sec-fetch-dest', 'empty'),
      a.headers.set('x-fragment-mode', 'embedded'),
      p === 'development' && a.headers.set('Accept-Encoding', 'gzip'),
      fetch(a)
    );
  }
  async function i({ appShellResponse: r, fragmentResponse: h, fragmentConfig: c, gateway: p }) {
    const { fragmentId: w, prePiercingClassNames: n } = c;
    if (T)
      return new g()
        .on('head', {
          element(f) {
            f.append(p.prePiercingStyles ?? '', { html: !0 });
          },
        })
        .on('body', {
          async element(f) {
            f.append(
              H`
								<web-fragment-host class="${n.join(' ')}" fragment-id="${w}" data-piercing="true">
									<template shadowrootmode="open">${h.body ?? ''}</template>
								</web-fragment-host>`,
              { html: !0 }
            );
          },
        })
        .transform(r);
    {
      const f = await h.text();
      return new g()
        .on('head', {
          element(a) {
            a.append(p.prePiercingStyles ?? '', { html: !0 });
          },
        })
        .on('body', {
          element(a) {
            a.append(
              `<web-fragment-host class="${n.join(
                ' '
              )}" fragment-id="${w}" data-piercing="true"><template shadowrootmode="open">${f}</template></web-fragment-host>`,
              { html: !0 }
            );
          },
        })
        .transform(r);
    }
  }
}
function R(e) {
  return new g()
    .on('html', {
      element(t) {
        t.tagName = 'wf-html';
      },
    })
    .on('head', {
      element(t) {
        t.tagName = 'wf-head';
      },
    })
    .on('body', {
      element(t) {
        t.tagName = 'wf-body';
      },
    })
    .transform(new Response(e.body, e));
}
function F(e) {
  return new g()
    .on('script', {
      element(t) {
        const s = t.getAttribute('type');
        s && t.setAttribute('data-script-type', s), t.setAttribute('type', 'inert');
      },
    })
    .transform(new Response(e.body, e));
}
function $(e, t) {
  return async (s) => {
    const o = (await e).headers,
      { forwardFragmentHeaders: l = [] } = t;
    for (const i of l) s.headers.append(i, o.get(i) || '');
    return s;
  };
}
function E(e) {
  return e instanceof Response
    ? e
    : (console.error(
        `WF Gateway Internal Server Error
`,
        e
      ),
      new Response('WF Gateway Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }));
}
function H(e, ...t) {
  return new ReadableStream({
    async start(s) {
      try {
        for (let o = 0; o < e.length; o++)
          if ((e[o] && s.enqueue(new TextEncoder().encode(e[o])), o < t.length)) {
            const l = t[o];
            if (l instanceof ReadableStream) {
              const i = l.getReader();
              for (;;) {
                const { done: r, value: h } = await i.read();
                if (r) break;
                s.enqueue(h);
              }
            } else {
              const i = String(l);
              i && s.enqueue(new TextEncoder().encode(i));
            }
          }
      } catch (o) {
        s.error(o);
      }
      if (s.desiredSize === null) {
        return null;
      }
      s.close();
    },
  });
}
export { H as asReadableStream, A as getWebMiddleware, F as neutralizeScriptTags, R as prefixHtmlHeadBody };
