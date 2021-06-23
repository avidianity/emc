import React, { FC } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { useURL } from '../../hooks';
import Form from './Form';
import List from './List';
import View from './View';

type Props = {};

const Subjects: FC<Props> = (props) => {
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
		{
			path: url('/:id/view'),
			component: View,
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

export default Subjects;
