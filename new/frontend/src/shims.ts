HTMLElement.prototype.disable = function (mode?: boolean) {
	if (mode === false) {
		this.removeAttribute('disabled');
	} else {
		this.setAttribute('disabled', 'disabled');
	}
};

export {};
