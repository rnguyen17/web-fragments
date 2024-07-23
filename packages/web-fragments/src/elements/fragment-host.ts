import { reframed } from "reframed";

export class FragmentHost extends HTMLElement {
	iframe: HTMLIFrameElement | undefined;
	ready: Promise<[() => void, void]> | undefined;
	isInitialized = false;
	isPortaling = false;

	constructor() {
		super();
		this.handlePiercing = this.handlePiercing.bind(this);
	}

	async connectedCallback() {
		/**
		 * Because we move the entire fragment host to the fragment outlet,
		 * we don't need to run this connectedCallback again. Only run once the first time the element is added to the document.
		 */
		if (!this.isInitialized) {
			this.isInitialized = true;

			const { iframe, ready } = reframed(
				this.shadowRoot ?? document.location.href,
				{
					container: this,
				}
			);

			this.iframe = iframe;
			this.ready = ready;

			/**
			 * <fragment-outlet> will dispatch the fragment-outlet-ready event.
			 * When that happens, move the entire host element + shadowRoot into the fragment-outlet
			 */
			document.addEventListener("fragment-outlet-ready", this.handlePiercing, {
				once: true,
			});
		}
	}

	async disconnectedCallback() {
		if (this.isPortaling) {
			this.isPortaling = false;
			return;
		}

		if (this.iframe && !this.isPortaling) {
			this.iframe.remove();
			this.iframe = undefined;

			// TODO: Figure out a better way to handle restoring side effects from calling reframed()
			// It feels wrong for the fragment-host to handle this in the disconnected callback
			if (this.ready) {
				const [restoreMonkeyPatchSideEffects] = await this.ready;
				restoreMonkeyPatchSideEffects();
			}

			document.removeEventListener(
				"fragment-outlet-ready",
				this.handlePiercing
			);
		}
	}

	async handlePiercing(event: Event) {
		// Call preventDefault() so that dispatchEvent returns false.
		// The fragment outlet will conditionally run reframe() if no subscriber calls preventDefault()
		event.preventDefault();

		// Wait for reframe to finish reframing and resolve with the iframe;
		await this.ready;

		// Any script tags injected into the <fragment-host> via reframe have already been made inert through writeable-dom.
		// We need to do the same when we move <fragment-host> into <fragment-outlet>
		this.neutralizeScriptTags();

		// Preserve the existing stylesheets to avoid a FOUC when reinserting this element into the DOM
		this.preserveStylesheets();

		// Move <fragment-host> into <fragment-outlet> and set a flag to return early in the disconnectedCallback
		this.isPortaling = true;
		const hostElement = event.target as HTMLElement;
		hostElement.replaceChildren(this);

		// Restore the initial type attributes of the script tags
		this.restoreScriptTags();
		this.removeAttribute("data-piercing");
	}

	preserveStylesheets() {
		if (this.shadowRoot) {
			this.shadowRoot.adoptedStyleSheets = Array.from(
				this.shadowRoot.styleSheets,
				(sheet) => {
					const clone = new CSSStyleSheet();
					[...sheet.cssRules].forEach((rule) => clone.insertRule(rule.cssText));
					return clone;
				}
			);
		}
	}

	neutralizeScriptTags() {
		const scripts = [...this.shadowRoot!.querySelectorAll("script")];
		scripts.forEach((script) => {
			const type = script.getAttribute("type");
			type && script.setAttribute("data-script-type", type);
			script.setAttribute("type", "inert");
		});
	}

	restoreScriptTags() {
		const scripts = [...this.shadowRoot!.querySelectorAll("script")];
		scripts.forEach((script) => {
			script.removeAttribute("type");
			const originalType = script.getAttribute("data-script-type");
			originalType && script.setAttribute("type", originalType);
			script.removeAttribute("data-script-type");
		});
	}
}
