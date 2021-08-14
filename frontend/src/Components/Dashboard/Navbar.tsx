import React, { FC, useState } from 'react';
import { useHistory } from 'react-router';
import { Asker, outIf } from '../../helpers';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';

type Props = {};

const Navbar: FC<Props> = (props) => {
	const state = State.getInstance();
	const [menu, setMenu] = useState(false);
	const history = useHistory();

	return (
		<nav className='topnav navbar navbar-light'>
			<button
				type='button'
				className='navbar-toggler text-muted mt-2 p-0 mr-3'
				onClick={(e) => {
					e.preventDefault();
					const bar = $('.vertical');
					const roleDisplay = $('#account-role-display');
					if (bar.hasClass('collapsed')) {
						roleDisplay.removeClass('d-none');
						bar.removeClass('collapsed');
					} else {
						roleDisplay.addClass('d-none');
						bar.addClass('collapsed');
					}
				}}>
				<i className='fe fe-menu navbar-toggler-icon'></i>
			</button>
			<ul className='nav'>
				<li className={`nav-item dropdown ${outIf(menu, 'show')}`}>
					<a
						className='nav-link dropdown-toggle text-muted pr-0'
						href='/'
						role='button'
						onClick={(e) => {
							e.preventDefault();
							setMenu(!menu);
						}}>
						<span className='avatar avatar-sm mt-2'>
							<img src='/logo.jpg' alt='...' className='avatar-img rounded-circle' />
						</span>
					</a>
					<div className={`dropdown-menu dropdown-menu-right ${outIf(menu, 'show')}`}>
						<a
							className='dropdown-item d-flex align-items-center'
							href='/'
							onClick={async (e) => {
								e.preventDefault();
								if (await Asker.notice('Are you sure you want to logout?')) {
									state.remove('user').remove('token');
									history.push(routes.HOME);
								}
							}}>
							<i className='la la-sign-out-alt mr-1'></i>
							<span>Logout</span>
						</a>
					</div>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
