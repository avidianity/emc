import React, { FC } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { useURL } from '../../hooks';
import Form from './Form';
import List from './List';

type Props = {};

const Admissions: FC<Props> = (props) => {
	const url = useURL();

	const routes: RouteProps[] = [
		{
			path: url('/'),
			exact: true,
			component: List,
		},
		{
			path: url('/add'),
			component: Form,
		},
		{
			path: url('/:id/edit'),
			component: Form,
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

export default Admissions;
