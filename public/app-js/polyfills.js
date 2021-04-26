Error.prototype.toJSON = function () {
	const alt = {};

	const _this = this;
	Object.getOwnPropertyNames(_this).forEach(function (key) {
		alt[key] = _this[key];
	}, _this);

	if ("stack" in alt) {
		alt.stack = alt.stack
			.split(/\r?\n/)
			.map((string) => string.trim())
			.filter((_, i) => i !== 0);
	}

	return alt;
};

String.prototype.toNumber = function () {
	const parts = this.split(".");
	if (parts.length > 1) {
		const whole = (parts[0].match(/\d/g) || []).join("");
		const decimals = (parts[1].match(/\d/g) || []).join("");
		return Number(`${whole}.${decimals}`) || 0;
	}
	const match = this.match(/\d/g);
	if (!match) {
		return 0;
	}
	return Number(match.join("")) || 0;
};

const letters =
	"1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";

String.random = (length = 20) => {
	let results = "";

	for (let x = 0; x < length; x++) {
		results += letters.charAt(Math.floor(Math.random() * letters.length));
	}

	return results;
};

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.last = function () {
	if (this.length > 0) {
		return this[this.length - 1];
	}

	return null;
};

Array.prototype.first = function () {
	if (this.length > 0) {
		return this[0];
	}

	return null;
};

Date.prototype.addHours = function (hours) {
	this.setTime(this.getTime() + hours * 60 * 60 * 1000);
	return this;
};

Date.prototype.toDayJS = function () {
	return dayjs(this);
};
