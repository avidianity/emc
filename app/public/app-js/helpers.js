axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

function groupBy(data, key) {
	const temp = {};

	data.forEach((item) => {
		const property = item[key];
		if (!(property in temp)) {
			temp[property] = [];
		}
		temp[property].push(item);
	});
	return Object.keys(temp).map((key) => temp[key]);
}

function ucfirst(words) {
	const fragments = words.split("");

	if (fragments.length > 0) {
		fragments[0] = fragments[0].toUpperCase();
	}

	return fragments.join("");
}

function isValidDate(date) {
	const instance = dayjs(date).toDate();

	return instance instanceof Date && !isNaN(instance.valueOf());
}

function limit(words, length) {
	return words
		.split("")
		.filter((_, index) => index + 1 <= length)
		.join("");
}

function ucwords(words) {
	return words
		.split(" ")
		.map((word) => ucfirst(word))
		.join(" ");
}

function sentencify(words) {
	return ucfirst(
		_.snakeCase(words)
			.split("_")
			.map((word) => (word.toLowerCase() === "id" ? "ID" : word))
			.join(" ")
	);
}

function user() {
	const payload = localStorage.getItem("user");
	return payload ? JSON.parse(payload) : null;
}

function fromNow(date) {
	return dayjs(date).fromNow();
}

function makeMask(callable, callback) {
	return (data) => {
		return callable(callback(data));
	};
}

function except(data, keys) {
	const copy = {};

	for (const key in data) {
		copy[key] = data[key];
	}

	for (const key of keys) {
		if (key in copy) {
			delete copy[key];
		}
	}
	return copy;
}

function exceptMany(data, keys) {
	return [...data].map((item) => except(item, keys));
}

function has(keys, data) {
	return keys.includes(data);
}

function only(data, keys) {
	const result = {};
	result["id"] = data["id"];
	for (const key of keys) {
		result[key] = data[key];
	}
	return result;
}

function onlyMany(data, keys) {
	return [...data].map((item) => only(item, keys));
}

const formatter = new Intl.NumberFormat("en-PH", {
	style: "currency",
	currency: "PHP",
});

function formatCurrency(value) {
	return formatter.format(value).replace(/\D00(?=\D*$)/, "");
}

function handleError(error) {
	if (error) {
		if (error.response) {
			const response = error.response;
			if (response.data.message) {
				if (_.isArray(response.data.message)) {
					return response.data.message.forEach((message) =>
						toastr.error(sentencify(message), undefined, {
							extendedTimeOut: 2000,
						})
					);
				} else if (_.isString(response.data.message)) {
					return toastr.error(sentencify(response.data.message));
				}
			}
		} else if (error.message) {
			if (error.message.includes("Network Error")) {
				if (handle === null) {
					toastr.error(
						"Unable to connect. Please check your internet connection or the server may be down."
					);
					handle = setTimeout(() => {
						if (handle !== null) {
							clearTimeout(handle);
							handle = null;
						}
					}, 5000);
					return;
				}
			} else {
				return toastr.error(error.message);
			}
		}
	} else {
		return toastr.error(
			"Something went wrong, please try again later.",
			"Oops!"
		);
	}
}

function errorToStrings(error) {
	if (error) {
		if (error.response) {
			const response = error.response;
			if (response.data.message) {
				if (isArray(response.data.message)) {
					return response.data.message.map((message) =>
						sentencify(message)
					);
				} else if (isString(response.data.message)) {
					return [sentencify(response.data.message)];
				}
			}
		} else if (error.message) {
			if (error.message.includes("Network Error")) {
				return [
					"Unable to connect. Please check your internet connection or the server may be down.",
				];
			}
			return [error.message];
		}
	}
	return ["Something went wrong, please try again later."];
}

function outIf(predicate, output, defaultValue = "") {
	return predicate ? output : defaultValue;
}
