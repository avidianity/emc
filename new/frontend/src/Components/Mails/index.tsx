import React, { FC } from 'react';
import { RouteProps, Switch, Route } from 'react-router-dom';
import { useURL } from '../../hooks';
import List from './List';

type Props = {};

const Mails: FC<Props> = (props) => {
	const url = useURL();

	const routes: RouteProps[] = [
		{
			path: url('/'),
			exact: true,
			component: List,
		},
	];

	return (
		<Switch>
			{routes.map((route, index) => (
				<Route {...route} key={index} />
			))}
		</Switch>
	);
};

export default Mails;
