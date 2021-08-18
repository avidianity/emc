import React, { FC } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import Form from './Form';
import List from './List';
import SchedulesStudent from '../Dashboard/Student/Schedules';

type Props = {};

const Schedules: FC<Props> = (props) => {
	const url = useURL();
	const user = State.getInstance().get<UserContract>('user');

	const routes: RouteProps[] = [
		{
			path: url('/'),
			exact: true,
			component: user?.role !== 'Student' ? undefined : SchedulesStudent,
			render: user?.role !== 'Student' ? (props) => <List {...props} type='Normal' /> : undefined,
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

export default Schedules;
