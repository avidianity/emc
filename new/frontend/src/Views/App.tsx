import React, { useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { routes } from '../routes';
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import { State } from '../Libraries/State';

const urls = [
	// '/js/jquery.min.js',
	'/js/popper.min.js',
	'/js/moment.min.js',
	'/js/bootstrap.min.js',
	'/js/simplebar.min.js',
	'/js/daterangepicker.js',
	'/js/jquery.stickOnScroll.js',
	'/js/tinycolor-min.js',
	'/js/config.js',
	'/js/d3.min.js',
	'/js/topojson.min.js',
	'/js/datamaps.all.min.js',
	'/js/datamaps-zoomto.js',
	'/js/datamaps.custom.js',
	'/js/Chart.min.js',
	'/js/chart-setup.js',
	'/js/gauge.min.js',
	'/js/jquery.sparkline.min.js',
	'/js/apexcharts.min.js',
	'/js/apexcharts.custom.js',
	'/js/jquery.mask.min.js',
	'/js/select2.min.js',
	'/js/jquery.steps.min.js',
	'/js/jquery.validate.min.js',
	'/js/jquery.timepicker.js',
	'/js/dropzone.min.js',
	'/js/uppy.min.js',
	'/js/quill.min.js',
	'/js/setup-1.js',
	'/js/uppy.js',
	'/js/apps.js',
];

export default function App() {
	const state = State.getInstance();
	const links = useMemo(
		() => [
			{
				path: routes.HOME,
				exact: true,
				component: Home,
			},
			{
				path: routes.LOGIN,
				exact: false,
				component: Login,
			},
			{
				path: routes.DASHBOARD,
				exact: false,
				component: Dashboard,
			},
		],
		[]
	);

	const check = async () => {
		try {
			const { data } = await axios.get('/auth/check');
			state.set('user', data);
		} catch (error) {
			if (error.response?.status === 401) {
				state.remove('user').remove('token');
			}
		}
	};

	useEffect(() => {
		check();
		const id = v4();

		const scripts = urls.map((url) => {
			const script = document.createElement('script');

			script.src = url;
			script.classList.add(id);
			script.defer = true;

			return script;
		});

		document.body.append(...scripts);

		return () => {
			$(`.${id}`).remove();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<QueryClientProvider client={new QueryClient()}>
			<Router>
				<Switch>
					{links.map((link, index) => (
						<Route {...link} key={index} />
					))}
				</Switch>
			</Router>
		</QueryClientProvider>
	);
}
