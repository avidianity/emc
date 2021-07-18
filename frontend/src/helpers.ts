import toastr from 'toastr';
import _, { isArray as _isArray, isString, trim } from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import swal from 'sweetalert';
import { UserContract } from './Contracts/user.contract';

dayjs.extend(relativeTime);

export class Asker {
	static async notice(message: string, title?: string) {
		return toBool(await swal({ title, text: message, buttons: ['Cancel', 'Confirm'], icon: 'warning' }));
	}

	static async danger(message: string, title?: string) {
		return toBool(await swal({ title, text: message, buttons: ['Cancel', 'Confirm'], dangerMode: true, icon: 'warning' }));
	}

	static async save(message: string, title?: string) {
		return toBool(await swal({ title, text: message, buttons: ['Cancel', 'Save'], icon: 'info' }));
	}

	static async okay(message: string, title?: string) {
		return toBool(await swal({ title, text: message, icon: 'info' }));
	}
}

export function isBehind(student: UserContract) {
	return student.admissions?.find((admission) => admission.year?.current) === undefined;
}

export function findSection(student: UserContract) {
	const section = student.sections?.find((section) => section.year?.current);
	if (section) {
		return section;
	}
	return student.sections?.last();
}

export function outIf<T>(condition: boolean, output: T, defaultValue: any = ''): T {
	return condition ? output : (defaultValue as T);
}

export function toBool(data: any) {
	return data ? true : false;
}

export function isArray<T>(value: any): value is T[] {
	return _isArray<T>(value);
}

export function toJSON(data: any) {
	return trim(JSON.stringify(data));
}

export function validURL(url: string) {
	let valid = false;
	var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?/;
	try {
		new URL(url);
		valid = true;
	} catch (_) {
		valid = false;
	}
	return !!pattern.test(url) && valid;
}

export function ucfirst(string: string) {
	const array = string.split('');
	array[0] = array[0].toUpperCase();
	return array.join('');
}

export function ucwords(string: string) {
	return string
		.split(' ')
		.map((word) => (word === 'Id' ? 'ID' : ucfirst(word)))
		.join(' ');
}

export function setValues(setter: Function, data: any) {
	for (const key in data) {
		setter(key, data[key]);
	}
}

let networkHandle: NodeJS.Timeout | null = null;
let authHandle: NodeJS.Timeout | null = null;

export function handleError(error: any, useHandle = true) {
	if (error) {
		if (error.response) {
			const response = error.response;
			if (response.data.errors && response.status === 422) {
				return Object.values<string[]>(response.data.errors).map((errors) => errors.map((error) => toastr.error(error)));
			}
			if (response.data.message) {
				if ([500, 400, 403, 404].includes(response.status)) {
					return toastr.error(response.data.message);
				}

				if (response.status === 401) {
					if (authHandle === null) {
						toastr.error('Authentication has expired. Please try logging in and try again.');
						authHandle = setTimeout(() => {
							if (authHandle !== null) {
								clearTimeout(authHandle);
								authHandle = null;
							}
						}, 5000);
					}
					return;
				}

				if (isArray(response.data.message)) {
					return response.data.message.forEach((message: string) =>
						toastr.error(sentencify(message), undefined, { extendedTimeOut: 2000 })
					);
				} else if (isString(response.data.message)) {
					return toastr.error(sentencify(response.data.message));
				}
			}
		} else if (error.message) {
			if (error.message.includes('Network Error')) {
				if (networkHandle === null && useHandle) {
					toastr.error('Unable to connect. Please check your internet connection or the server may be down.');
					networkHandle = setTimeout(() => {
						if (networkHandle !== null) {
							clearTimeout(networkHandle);
							networkHandle = null;
						}
					}, 5000);
					return;
				}
			} else {
				return toastr.error(error.message);
			}
		}
	} else {
		return toastr.error('Something went wrong, please try again later.', 'Oops!');
	}
}

export function errorToStrings(error: any) {
	if (error) {
		if (error.response) {
			const response = error.response;
			if (response.data.message) {
				if (isArray(response.data.message)) {
					return (response.data.message as string[]).map((message) => sentencify(message));
				} else if (isString(response.data.message)) {
					return [sentencify(response.data.message)];
				}
			}
		} else if (error.message) {
			if (isString(error.message)) {
				if (error.message.includes('Network Error')) {
					return ['Unable to connect. Please check your internet connection or the server may be down.'];
				}
				return [error.message as string];
			} else if (isArray(error.message)) {
				return (error.message as string[]).map((message) => sentencify(message));
			}
		}
	}
	return ['Something went wrong, please try again later.'];
}

export function groupBy<T, K extends keyof T>(data: Array<T>, key: K) {
	const temp: { [key: string]: Array<T> } = {};

	data.forEach((item) => {
		const property: any = item[key];
		if (!(property in temp)) {
			temp[property] = [];
		}
		temp[property].push(item);
	});
	return Object.keys(temp).map((key) => temp[key]);
}

export function sentencify(words: string) {
	return ucfirst(
		_.snakeCase(words)
			.split('_')
			.map((word) => (word.toLowerCase() === 'id' ? 'ID' : word))
			.join(' ')
	);
}

export function fromNow(date: any) {
	return dayjs(date).fromNow();
}

export function makeMask<T extends Function>(callable: T, callback: Function) {
	return ((data: any) => {
		return callable(callback(data));
	}) as unknown as T;
}

export function except<T, K extends keyof T>(data: T, keys: Array<K>) {
	const copy = {} as T;

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

export function exceptMany<T, K extends keyof T>(data: Array<T>, keys: Array<K>) {
	return [...data].map((item) => except(item, keys));
}

export function has<T>(keys: Array<T>, data: T) {
	return keys.includes(data);
}

export function only<T, K extends keyof T>(data: T, keys: Array<K>) {
	const result = {} as T;
	(result as any)['id'] = (data as any)['id'];
	for (const key of keys) {
		result[key] = data[key];
	}
	return result;
}

export function onlyMany<T, K extends keyof T>(data: Array<T>, keys: Array<K>) {
	return [...data].map((item) => only(item, keys));
}

const formatter = new Intl.NumberFormat('en-PH', {
	style: 'currency',
	currency: 'PHP',
});

export function formatCurrency(value: number) {
	return formatter.format(value).replace(/\D00(?=\D*$)/, '');
}
