type ReframedOptions = {
    bound: boolean;
    container: HTMLElement;
    headers?: HeadersInit;
    name: string;
};
/**
 *
 * @param reframedSrcOrSourceShadowRoot url of an http endpoint that will generate html stream to be reframed, or a shadowRoot containing the html to reframe
 * @param containerTagName tag name of the HTMLElement that will be created and used as the target container.
 *    The default is [`article`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article).
 * @returns
 */
export declare function reframed(reframedSrcOrSourceShadowRoot: string | ShadowRoot, options: ReframedOptions): {
    iframe: HTMLIFrameElement;
    container: HTMLElement;
    ready: Promise<void>;
};
export {};
