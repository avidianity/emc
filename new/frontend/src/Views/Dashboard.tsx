import React, { FC } from 'react';
import { Route, RouteProps, Switch, useHistory } from 'react-router';
import Admissions from '../Components/Admissions';
import ChangePassword from '../Components/ChangePassword';
import Courses from '../Components/Courses';
import Analytics from '../Components/Dashboard/Analytics';
import Navbar from '../Components/Dashboard/Navbar';
import Sidebar from '../Components/Dashboard/Sidebar';
import Enrollment from '../Components/Dashboard/Student/Enrollment';
import Grades from '../Components/Dashboard/Student/Grades';
import Profile from '../Components/Dashboard/Student/Profile';
import Mails from '../Components/Mails';
import Registrars from '../Components/Registrars';
import Requirements from '../Components/Requirements';
import Schedules from '../Components/Schedules';
import Students from '../Components/Students';
import Subjects from '../Components/Subjects';
import Teachers from '../Components/Teachers';
import Users from '../Components/Users';
import Years from '../Components/Years';
import { useURL } from '../hooks';
import { State } from '../Libraries/State';
import { routes } from '../routes';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	const history = useHistory();
	const state = State.getInstance();
	const url = useURL();

	const localRoutes: RouteProps[] = [
		{
			path: url(''),
			exact: true,
			component: Analytics,
		},
		{
			path: url(routes.COURSES),
			component: Courses,
		},
		{
			path: url(routes.STUDENTS),
			component: Students,
		},
		{
			path: url(routes.TEACHERS),
			component: Teachers,
		},
		{
			path: url(routes.REGISTRARS),
			component: Registrars,
		},
		{
			path: url(routes.USERS),
			component: Users,
		},
		{
			path: url(routes.MAILS),
			component: Mails,
		},
		{
			path: url(routes.CHANGE_PASSWORD),
			component: ChangePassword,
		},
		{
			path: url(routes.SUBJECTS),
			component: Subjects,
		},
		{
			path: url(routes.SCHEDULES),
			component: Schedules,
		},
		{
			path: url(routes.ADMISSIONS),
			component: Admissions,
		},
		{
			path: url(routes.YEARS),
			component: Years,
		},
		{
			path: url(routes.GRADES),
			component: Grades,
		},
		{
			path: url(routes.ENROLLMENT),
			component: Enrollment,
		},
		{
			path: url(routes.PROFILE),
			component: Profile,
		},
		{
			path: url(routes.ADMISSION_REQUIREMENTS),
			component: Requirements,
		},
	];

	if (!state.has('user')) {
		history.push(routes.HOME);
		return null;
	}

	return (
		<div className='vertical dark'>
			<div className='wrapper'>
				<Navbar />
				<Sidebar />
				<main role='main' className='main-content'>
					<div className='container-fluid'>
						<div className='row justify-content-center'>
							<div className='col-12'>
								<div className='row align-items-center mb-2'>
									<div className='col'>
										<Switch>
											{localRoutes.map((route, index) => (
												<Route {...route} key={index} />
											))}
										</Switch>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
