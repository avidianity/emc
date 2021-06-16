declare global {
	interface Window {
		$: JQueryStatic;
		jQuery: JQueryStatic;
	}

	interface HTMLElement {
		disable(mode?: boolean): void;
	}

	interface String {
		toNumber(): number;
		trim(): string;
	}

	interface Error {
		toJSON(): Object;
	}

	interface Array<T> {
		random(): T;
		first(): T | undefined;
		last(): T | undefined;
	}

	interface HTMLElement {
		disable(mode?: boolean): void;
	}

	interface StringConstructor {
		random(size?: number): string;
	}
}

export {};
