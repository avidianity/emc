declare global {
	interface Window {
		$: JQueryStatic;
	}

	interface String {
		toNumber(): number;
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
