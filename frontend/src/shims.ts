import { trim } from 'lodash';

Error.prototype.toJSON = function () {
	const alt = {} as any;

	const _this = this as any;
	Object.getOwnPropertyNames(_this).forEach(function (key) {
		alt[key] = _this[key];
	}, _this);

	if ('stack' in alt) {
		alt.stack = alt.stack
			.split(/\r?\n/)
			.map((string: string) => string.trim())
			.filter((_: any, i: number) => i !== 0);
	}

	return alt;
};

String.prototype.toNumber = function () {
	const parts = this.split('.');
	if (parts.length > 1) {
		const whole = (parts[0].match(/\d/g) || []).join('');
		const decimals = (parts[1].match(/\d/g) || []).join('');
		return parseFloat(`${whole}.${decimals}` || '0');
	}
	const match = this.match(/\d/g);
	if (!match) {
		return 0;
	}
	return parseFloat(match.join('') || '0');
};

String.prototype.trim = function () {
	return trim(this.toString());
};

const characters = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

String.random = (size = 40) => {
	let results = '';

	for (let x = 0; x < size; x++) {
		results += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return results;
};

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.first = function () {
	if (this.length > 0) {
		return this[0];
	}
	return undefined;
};

Array.prototype.last = function () {
	if (this.length > 0) {
		return this[this.length - 1];
	}
	return undefined;
};

HTMLElement.prototype.disable = function (mode?: boolean) {
	if (mode === false) {
		this.removeAttribute('disabled');
	} else {
		this.setAttribute('disabled', 'disabled');
	}
};

export {};
