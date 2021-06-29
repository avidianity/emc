import React, { FC } from 'react';
import { createRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import background from '../Assets/landing.jpg';
import { State } from '../Libraries/State';
import { routes } from '../routes';
import '../Styles/landing.css';

type Props = {};

const Home: FC<Props> = (props) => {
	const state = State.getInstance();
	const ref = createRef<HTMLDivElement>();
	const history = useHistory();

	return (
		<section id='intro' className='parallax-section' style={{ background: `url(${background}) 50% 0 repeat-y fixed` }}>
			<div className='container'>
				<div className='row'>
					<div className='col-md-12 col-sm-12'>
						<h3
							className='wow bounceIn animated text-shadow-dark'
							data-wow-delay='0.9s'
							style={{ visibility: 'visible', animationDelay: '0.9s', animationName: 'bounceIn' }}>
							Welcome to
						</h3>
						<h1
							className='wow fadeInUp animated text-shadow-dark'
							data-wow-delay='1.6s'
							style={{ visibility: 'visible', animationDelay: '1.6s', animationName: 'fadeInUp' }}>
							EMC Registration System
						</h1>
						<button
							className='btn btn-lg btn-danger smoothScroll wow fadeInUp animated'
							data-wow-delay='2.3s'
							style={{ visibility: 'visible', animationDelay: '2.3s', animationName: 'fadeInUp' }}
							onClick={(e) => {
								e.preventDefault();
								if (state.has('user')) {
									history.push(routes.DASHBOARD);
								} else if (ref.current) {
									$(ref.current).modal('show');
								}
							}}>
							Log In
						</button>
						<Link
							to={routes.PREREGISTRATION}
							className='btn btn-lg btn-danger smoothScroll wow fadeInUp animated'
							data-wow-delay='2.3s'
							style={{ visibility: 'visible', animationDelay: '2.3s', animationName: 'fadeInUp' }}>
							Pre Registration
						</Link>
					</div>
				</div>
			</div>
			<div ref={ref} className='modal fade bg-dark' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content bg-dark'>
						<div className='modal-header'>
							<h5 className='modal-title text-white'>Login</h5>
							<button
								type='button'
								className='close'
								onClick={(e) => {
									e.preventDefault();
									if (ref.current) {
										$(ref.current).modal('hide');
									}
								}}>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								className='m-2 d-block btn btn-danger btn-lg w-100'
								onClick={(e) => {
									e.preventDefault();
									if (ref.current) {
										$(ref.current).modal('hide');
									}
									history.push(`/login/admin`);
								}}>
								Admin
							</button>
							<button
								className='m-2 d-block btn btn-danger btn-lg w-100'
								onClick={(e) => {
									e.preventDefault();
									if (ref.current) {
										$(ref.current).modal('hide');
									}
									history.push(`/login/registrar`);
								}}>
								Registrar
							</button>
							<button
								className='m-2 d-block btn btn-danger btn-lg w-100'
								onClick={(e) => {
									e.preventDefault();
									if (ref.current) {
										$(ref.current).modal('hide');
									}
									history.push(`/login/teacher`);
								}}>
								Teacher
							</button>
							<button
								className='m-2 d-block btn btn-danger btn-lg w-100'
								onClick={(e) => {
									e.preventDefault();
									if (ref.current) {
										$(ref.current).modal('hide');
									}
									history.push(`/login/student`);
								}}>
								Student
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-danger btn-sm'
								onClick={(e) => {
									e.preventDefault();
									if (ref.current) {
										$(ref.current).modal('hide');
									}
								}}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Home;
