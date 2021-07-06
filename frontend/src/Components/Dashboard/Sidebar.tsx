import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { NavLink as Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { useCurrentSection, useCurrentYear, useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';
import { admissionService } from '../../Services/admission.service';

type Props = {};

const Sidebar: FC<Props> = (props) => {
	const { data: admissions } = useQuery('admissions', () => admissionService.fetch());
	const url = useURL();
	const { data: year } = useCurrentYear();

	const user = State.getInstance().get<UserContract>('user');
	const section = useCurrentSection();

	const roles: { [key: string]: string[] } = {
		Admin: [routes.COURSES, routes.STUDENTS, routes.TEACHERS, routes.REGISTRARS, routes.USERS, routes.MAILS, routes.LOGS],
		Registrar: [
			routes.COURSES,
			routes.STUDENTS,
			routes.TEACHERS,
			routes.SUBJECTS,
			routes.SCHEDULES,
			routes.ADMISSIONS,
			routes.YEARS,
			routes.ADMISSION_REQUIREMENTS,
			routes.UNITS,
		],
		Teacher: [routes.SUBJECTS],
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
				<div className='w-100 mb-4 d-flex flex-column'>
					<Link className='navbar-brand mx-auto mt-2 flex-fill text-center' to={routes.DASHBOARD}>
						<img src='/logo.jpg' alt='EMC' className='shadow border rounded-circle' style={{ height: '50px', width: '50px' }} />
					</Link>
					{year ? (
						<span className='mx-auto'>
							S.Y {year.start} - {year.end}
						</span>
					) : null}
					{user.role === 'Student' ? <span className='mx-auto'>{section?.name}</span> : null}
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
					{!['Student', 'Teacher'].includes(user.role) ? (
						<li className='nav-item dropdown'>
							<a
								href='/users'
								className='dropdown-toggle nav-link collapsed'
								onClick={(e) => {
									e.preventDefault();
									$('#users').collapse('toggle');
								}}>
								<i className='fe fe-user fe-16'></i>
								<span className='ml-3 item-text'>Users</span>
							</a>
							<ul className='collapse list-unstyled pl-4 w-100' id='users'>
								{roles[user.role].includes(routes.STUDENTS) ? (
									<li className='nav-item dropdown'>
										<a
											href={url(routes.STUDENTS)}
											className='nav-link dropdown-toggle collapsed'
											onClick={(e) => {
												e.preventDefault();
												$('#students').collapse('toggle');
											}}>
											<i className='fe fe-user fe-16'></i>
											<span className='ml-3 item-text'>Students</span>
										</a>
										<ul className='collapse list-unstyled pl-4 w-100' id='students'>
											<li className='nav-item'>
												<Link to={url(`${routes.STUDENTS}/new`)} className='nav-link' activeClassName='active'>
													<i className='fe fe-user fe-16'></i>
													<span className='ml-3 item-text'>New</span>
												</Link>
											</li>
											<li className='nav-item'>
												<Link to={url(`${routes.STUDENTS}/old`)} className='nav-link' activeClassName='active'>
													<i className='fe fe-user fe-16'></i>
													<span className='ml-3 item-text'>Old</span>
												</Link>
											</li>
										</ul>
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
							</ul>
						</li>
					) : null}
					{roles[user.role].includes(routes.MAILS) ? (
						<li className='nav-item d-none'>
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
								<span className='ml-3 item-text'>
									Admissions
									{admissions &&
									admissions.filter((admission) => !admission.done && !admission.student?.active).length > 0 ? (
										<span className='ml-1 badge badge-danger'>
											{admissions.filter((admission) => !admission.done && !admission.student?.active).length}
										</span>
									) : null}
								</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.ADMISSION_REQUIREMENTS) ? (
						<li className='nav-item'>
							<Link to={url(routes.ADMISSION_REQUIREMENTS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-clipboard fe-16'></i>
								<span className='ml-3 item-text'>Admission Requirements</span>
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
					{roles[user.role].includes(routes.LOGS) ? (
						<li className='nav-item'>
							<Link to={url(routes.LOGS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-book fe-16'></i>
								<span className='ml-3 item-text'>Logs</span>
							</Link>
						</li>
					) : null}
					{roles[user.role].includes(routes.UNITS) ? (
						<li className='nav-item'>
							<Link to={url(routes.UNITS)} className='nav-link' activeClassName='active'>
								<i className='fe fe-graduation-cap fe-16'></i>
								<span className='ml-3 item-text'>Student Units</span>
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
