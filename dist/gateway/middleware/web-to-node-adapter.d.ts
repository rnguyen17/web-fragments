import http from 'node:http';
/**
 * Converts a web-style middleware to a node-style middleware.
 *
 * This function enables web-style middlewares to be used in Node.js HTTP servers like express, connect, etc.
 *
 * The implementation is lazy and stream-based to avoid unnecessary buffering of request/response bodies.
 *
 * See `./web-to-node-adapter.png` for a visual representation of the data flow.
 * The original drawing is at https://www.tldraw.com/f/-759LrWk9uMRXIQYg9Nth?d=v-539.-420.4188.2805.page
 *
 * @param webMiddleware The middleware to adapt.
 * @returns The resulting node-style middleware.
 */
export declare function webToNodeMiddleware(webMiddleware: (req: Request, next: () => Promise<Response>) => Promise<Response>): (nodeRequest: http.IncomingMessage, nodeResponse: http.ServerResponse, nodeNext: () => void) => Promise<void>;
export declare function nodeRequestToUrl(nodeReq: http.IncomingMessage): URL;
/**
 * Determines if a request is HTTPS.
 * @param {IncomingMessage | Request} req - The request object.
 * @returns {boolean} - Whether the request is HTTPS.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
 */
export declare const isHttps: (req: http.IncomingMessage) => boolean;
