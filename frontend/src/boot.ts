import toastr from 'toastr';
import axios from 'axios';
import './shims';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-bs4';
import { State } from './Libraries/State';
import 'flatpickr/dist/themes/material_blue.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

toastr.options.escapeHtml = true;
toastr.options.extendedTimeOut = 2000;

window.toastr = toastr;
window.$ = $;
window.jQuery = $;

const url = process.env.REACT_APP_SERVER_URL || '';

axios.defaults.baseURL = `${url}/api`;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

axios.get(`${url}/sanctum/csrf-cookie`).catch(console.error);

const state = State.getInstance();

if (state.has('token')) {
	const token = state.get('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});

axios.interceptors.request.use((config) => {
	if (state.has('token')) {
		config.headers['Authorization'] = `Bearer ${state.get<string>('token')}`;
	}

	return config;
});
