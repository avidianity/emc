import React, { FC } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';

type Props = {};

const Sidebar: FC<Props> = (props) => {
	const url = useURL();

	const user = State.getInstance().get<UserContract>('user');

	const roles: { [key: string]: string[] } = {
		Admin: [routes.COURSES, routes.STUDENTS, routes.TEACHERS, routes.REGISTRARS, routes.USERS, routes.MAILS],
		Registrar: [routes.COURSES, routes.STUDENTS, routes.TEACHERS, routes.SUBJECTS, routes.SCHEDULES, routes.ADMISSIONS, routes.YEARS],
		Teacher: [routes.COURSES, routes.STUDENTS, routes.SUBJECTS, routes.SCHEDULES],
		Student: [routes.GRADES, routes.SCHEDULES, routes.PROFILE, routes.ENROLLMENT],
	};

	if (!user) {
		return null;
	}

	return (
		<aside className='sidebar-left border-right bg-white shadow' id='leftSidebar' data-simplebar>
			<a href='/' className='btn collapseSidebar toggle-btn d-lg-none text-muted ml-2 mt-3' data-toggle='toggle'>
				<i className='fe fe-x'>
					<span className='sr-only'></span>
				</i>
			</a>
			<nav className='vertnav navbar navbar-light'>
				<div className='w-100 mb-4 d-flex'>
					<a className='navbar-brand mx-auto mt-2 flex-fill text-center' href='./index.html'>
						<img src='/logo.jpg' alt='EMC' className='shadow border rounded-circle' style={{ height: '50px', width: '50px' }} />
					</a>
				</div>
				<ul className='navbar-nav flex-fill w-100 mb-2'>
					<li className='nav-item'>
						<Link to={url('')} className='nav-link' activeClassName='active' exact>
							<i className='fe fe-home fe-16'></i>
							<span className='ml-3 item-text'>Dashboard</span>
						</Link>
					</li>
					{roles[user.role].includes(routes.COURSES) ? (
						<li className='nav-item'>
							<Link to={url(routes.COURSES)} className='nav-link' activeClassName='active'>
								<i className='fe fe-navigation fe-16'></i>
								<span className='ml-3 item-text'>Courses</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.STUDENTS) ? (
						<li className='nav-item'>
							<Link to={url(routes.STUDENTS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-user fe-16'></i>
								<span className='ml-3 item-text'>Students</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.TEACHERS) ? (
						<li className='nav-item'>
							<Link to={url(routes.TEACHERS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-user fe-16'></i>
								<span className='ml-3 item-text'>Teachers</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.REGISTRARS) ? (
						<li className='nav-item'>
							<Link to={url(routes.REGISTRARS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-user fe-16'></i>
								<span className='ml-3 item-text'>Registrars</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.USERS) ? (
						<li className='nav-item'>
							<Link to={url(routes.USERS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-user fe-16'></i>
								<span className='ml-3 item-text'>System Users</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.MAILS) ? (
						<li className='nav-item'>
							<Link to={url(routes.MAILS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-mail fe-16'></i>
								<span className='ml-3 item-text'>Email Outbox</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.SUBJECTS) ? (
						<li className='nav-item'>
							<Link to={url(routes.SUBJECTS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-book fe-16'></i>
								<span className='ml-3 item-text'>Subjects</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.SCHEDULES) ? (
						<li className='nav-item'>
							<Link to={url(routes.SCHEDULES)} className='nav-link' activeClassName='active'>
								<i className='fe fe-calendar fe-16'></i>
								<span className='ml-3 item-text'>Schedules</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.ADMISSIONS) ? (
						<li className='nav-item'>
							<Link to={url(routes.ADMISSIONS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-pen-tool fe-16'></i>
								<span className='ml-3 item-text'>Admissions</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.YEARS) ? (
						<li className='nav-item'>
							<Link to={url(routes.YEARS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-calendar fe-16'></i>
								<span className='ml-3 item-text'>School Years</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.GRADES) ? (
						<li className='nav-item'>
							<Link to={url(routes.GRADES)} className='nav-link' activeClassName='active'>
								<i className='fe fe-bookmark fe-16'></i>
								<span className='ml-3 item-text'>Grades</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.ENROLLMENT) ? (
						<li className='nav-item'>
							<Link to={url(routes.ENROLLMENT)} className='nav-link' activeClassName='active'>
								<i className='fe fe-book-open fe-16'></i>
								<span className='ml-3 item-text'>Enrollment</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.PROFILE) ? (
						<li className='nav-item'>
							<Link to={url(routes.PROFILE)} className='nav-link' activeClassName='active'>
								<i className='fe fe-user fe-16'></i>
								<span className='ml-3 item-text'>Profile</span>
							</Link>
						</li>
					) : null}
					<li className='nav-item'>
						<Link to={url(routes.CHANGE_PASSWORD)} className='nav-link' activeClassName='active'>
							<i className='fe fe-key fe-16'></i>
							<span className='ml-3 item-text'>Change Password</span>
						</Link>
					</li>
				</ul>
				<p id='account-role-display'>
					Signed in as: <b>{user?.role}</b>
				</p>
			</nav>
		</aside>
	);
};

export default Sidebar;
