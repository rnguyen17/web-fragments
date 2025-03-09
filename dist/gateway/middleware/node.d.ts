import http from 'node:http';
import { FragmentGateway, FragmentMiddlewareOptions } from 'web-fragments/gateway';
/**
 * Creates middleware for handling fragment-based server-side rendering.
 * @param {FragmentGateway} gateway - The fragment gateway instance.
 * @param {FragmentMiddlewareOptions} [options={}] - Optional middleware settings.
 * @returns {Function} - Connect/Express-style middleware function.
 */
export declare function getNodeMiddleware(gateway: FragmentGateway, options?: FragmentMiddlewareOptions): (nodeRequest: http.IncomingMessage, nodeResponse: http.ServerResponse, nodeNext: () => void) => Promise<void>;
