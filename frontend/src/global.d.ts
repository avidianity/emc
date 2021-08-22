declare global {
	interface Window {
		$: JQueryStatic;
		jQuery: JQueryStatic;
	}

	interface HTMLElement {
		disable(mode?: boolean): void;
	}
}

export {};
