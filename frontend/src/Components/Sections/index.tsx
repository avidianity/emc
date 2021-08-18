import React, { FC } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { useURL } from '../../hooks';
import Form from './Form';
import List from './List';

type Props = {};

const Sections: FC<Props> = (props) => {
	const url = useURL();

	const routes: RouteProps[] = [
		{
			path: url('/'),
			exact: true,
			render: (props) => <List {...props} type='Normal' />,
		},
		{
			path: url('/add'),
			render: (props) => <Form {...props} type='Normal' />,
		},
		{
			path: url('/:id/edit'),
			render: (props) => <Form {...props} type='Normal' />,
		},
		{
			path: url('/advance'),
			exact: true,
			render: (props) => <List {...props} type='Advance' />,
		},
		{
			path: url('/advance/add'),
			render: (props) => <Form {...props} type='Advance' />,
		},
		{
			path: url('/advance/:id/edit'),
			render: (props) => <Form {...props} type='Advance' />,
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

export default Sections;
