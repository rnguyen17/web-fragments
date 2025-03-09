export declare class WebFragmentHost extends HTMLElement {
    #private;
    ready: Promise<void> | undefined;
    isInitialized: boolean;
    isPortaling: boolean;
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): Promise<void>;
    handlePiercing(event: Event): Promise<void>;
    preserveStylesheets(): void;
    neutralizeScriptTags(): void;
    restoreScriptTags(): void;
    getSelectionRange(): Range | null | undefined;
    setSelectionRange(range: Range): void;
}
