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
			component: user?.role !== 'Student' ? List : SchedulesStudent,
		},
	];

	if (user?.role !== 'Student') {
		routes.push({
			path: url('/add'),
			component: Form,
		});
		routes.push({
			path: url('/:id/edit'),
			component: Form,
		});
	}

	return (
		<Switch>
			{routes.map((route, index) => (
				<Route {...route} key={index} />
			))}
		</Switch>
	);
};

export default Schedules;
