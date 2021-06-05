import React, { FC } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { useURL } from '../../hooks';
import List from './List';
import Subjects from './Subjects';

type Props = {};

const Students: FC<Props> = (props) => {
	const url = useURL();

	const routes: RouteProps[] = [
		{
			path: url('/'),
			exact: true,
			component: List,
		},
		{
			path: url('/:id/subjects'),
			component: Subjects,
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

export default Students;
