import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Asker, outIf } from '../../helpers';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';

type Props = {};

const Navbar: FC<Props> = (props) => {
	const state = State.getInstance();
	const [mode, setMode] = useState(state.get<string>('mode') || 'dark');
	const [menu, setMenu] = useState(false);
	const history = useHistory();

	const light = document.getElementById('lightTheme')!;
	const dark = document.getElementById('darkTheme')!;

	useEffect(() => {
		if (mode === 'dark') {
			light.disable(true);
			dark.disable(false);
		} else {
			dark.disable(true);
			light.disable(false);
		}
	});

	return (
		<nav className='topnav navbar navbar-light'>
			<button type='button' className='navbar-toggler text-muted mt-2 p-0 mr-3 collapseSidebar'>
				<i className='fe fe-menu navbar-toggler-icon'></i>
			</button>
			<form className='form-inline mr-auto searchform text-muted'>
				<input
					className='form-control mr-sm-2 bg-transparent border-0 pl-4 text-muted'
					type='search'
					placeholder='Type something...'
					aria-label='Search'
				/>
			</form>
			<ul className='nav'>
				<li className='nav-item'>
					<a
						className='nav-link text-muted my-2'
						href='/'
						onClick={(e) => {
							e.preventDefault();
							if (mode === 'dark') {
								dark.disable(true);
								light.disable(false);
								state.set('mode', 'light');
								setMode('light');
							} else {
								light.disable(true);
								dark.disable(false);
								state.set('mode', 'dark');
								setMode('dark');
							}
						}}>
						<i className='fe fe-sun fe-16'></i>
					</a>
				</li>
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
							<img src='https://via.placeholder.com/200' alt='...' className='avatar-img rounded-circle' />
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
