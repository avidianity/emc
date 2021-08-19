import React, { useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import { routes } from '../routes';
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import { State } from '../Libraries/State';
import PreRegistration from '../Components/PreRegistration';

const urls = ['/js/simplebar.min.js'];

export default function App() {
	const state = State.getInstance();

	const links: RouteProps[] = useMemo(
		() => [
			{
				path: routes.HOME,
				exact: true,
				component: Home,
			},
			{
				path: routes.LOGIN,
				component: Login,
			},
			{
				path: routes.DASHBOARD,
				component: Dashboard,
			},
			{
				path: routes.PREREGISTRATION,
				component: PreRegistration,
			},
		],
		[]
	);

	const check = async () => {
		try {
			const { data } = await axios.get('/auth/check');
			state.set('user', data);
		} catch (error: any) {
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
