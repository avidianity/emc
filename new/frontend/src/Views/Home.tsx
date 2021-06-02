import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import background from '../Assets/landing.jpg';
import { routes } from '../routes';
import '../Styles/landing.css';

type Props = {};

const Home: FC<Props> = (props) => {
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
						<Link
							to={routes.LOGIN}
							className='btn btn-lg btn-danger smoothScroll wow fadeInUp animated'
							data-wow-delay='2.3s'
							style={{ visibility: 'visible', animationDelay: '2.3s', animationName: 'fadeInUp' }}>
							Log In
						</Link>
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
		</section>
	);
};

export default Home;
