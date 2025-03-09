/**
 * The middleware provides support for Web request-response handling using fetch-like behavior, and for Node.js native http request and responses object, including using Connect framework, via the imported adaptor.
 */
import { FragmentGateway, FragmentMiddlewareOptions } from '../fragment-gateway';
/**
 * Creates middleware for handling web-based fragment rendering.
 * @param {FragmentGateway} gateway - The fragment gateway instance.
 * @param {FragmentMiddlewareOptions} [options={}] - Optional middleware settings.
 * @returns {Function} - A middleware function for processing web requests.
 */
export declare function getWebMiddleware(gateway: FragmentGateway, options?: FragmentMiddlewareOptions): (request: Request, next: () => Promise<Response>) => Promise<Response>;
/**
 * Rewrites html so that any <html>, <head>, and <body> tags are replaced with <wf-html>, <wf-head>, and <wf-body> tags.
 *
 * DOM doesn't allow duplicates of these three elements in the document, and the main document already contains them.
 *
 * We need to replace these tags, to prevent the DOM from silently dropping them when the content is added to the main document.
 *
 * @param {Response} fragmentResponse response to rewrite
 * @returns {Response} rewritten response
 */
export declare function prefixHtmlHeadBody(fragmentResponse: Response): Response;
/**
 * Rewrites html so that any script tags remain inert and don't execute.
 *
 * @param {Response} fragmentResponse response to rewrite
 * @returns {Response} rewritten response
 */
export declare function neutralizeScriptTags(fragmentResponse: Response): Response;
/**
 * A tagged template that produces a ReadableStream of its content.
 * It supports interpolating other ReadableStreams, which allows you
 * to easily wrap streams with text or combine multiple streams, etc.
 *
 * @example
 * const wrappedBody = asReadableStream`<template>${response.body}</template>`;
 * const combinedStream = asReadableStream`${stream1}${stream2}`;
 */
export declare function asReadableStream(strings: TemplateStringsArray, ...values: Array<string | number | ReadableStream>): ReadableStream<any>;
