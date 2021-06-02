import toastr from 'toastr';
import 'toastr/build/toastr.css';
import axios from 'axios';
import './shims';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-bs4';
import { State } from './Libraries/State';
import 'flatpickr/dist/themes/material_blue.css';

window.toastr = toastr;
window.$ = $;

const url = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';

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
