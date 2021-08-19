import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory, useParams } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError } from '../../helpers';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';

type Props = {};

type Inputs = {
	email: string;
	password: string;
};

const Form: FC<Props> = (props) => {
	const [tries, setTries] = useState(0);
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit } = useForm<Inputs>();
	const history = useHistory();
	const state = State.getInstance();
	const params = useParams<{ role: string }>();
	const role = params.role;

	const submit = async (payload: Inputs) => {
		if (state.has('block')) {
			const block = dayjs(state.get<string>('block') || undefined);
			if (block.isValid()) {
				if (dayjs(new Date()).isAfter(block)) {
					state.remove('block');
					setTries(0);
				} else {
					setTries(3);
				}
			}
		}
		if (tries >= 3) {
			return toastr.info('Login currently blocked. Please try again after 5 minutes.');
		}
		setProcessing(true);
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: UserContract; token: string }>('/auth/login', { ...payload, role });
			state.set('user', user);
			state.set('token', token);
			toastr.success(`Welcome back, ${user?.first_name}.`);
			history.push(routes.DASHBOARD);
		} catch (error) {
			if (tries >= 3) {
				state.set('block', dayjs().add(5, 'minutes').toJSON());
			} else {
				setTries(tries + 1);
			}
			handleError(error, false);
		} finally {
			setProcessing(false);
		}
	};

	if (state.has('user')) {
		history.push(routes.DASHBOARD);
		return null;
	}

	return (
		<div className='wrapper vh-100 overflow-hidden'>
			<div className='row align-items-center h-100'>
				<form className='col-lg-3 col-md-4 col-10 mx-auto text-center' onSubmit={handleSubmit(submit)}>
					<div className='card'>
						<div className='card-body'>
							<div className='text-left'>
								<a
									href='/'
									onClick={(e) => {
										e.preventDefault();
										history.goBack();
									}}>
									Back
								</a>
							</div>
							<Link className='navbar-brand mx-auto mt-2 flex-fill text-center' to={routes.HOME}>
								<img
									src='/logo.jpg'
									alt='EMC'
									style={{ width: '80px', height: '80px' }}
									className='rounded-circle border'
								/>
							</Link>
							<h1 className='h6 mb-3'>Login</h1>
							<div className='form-group'>
								<label htmlFor='email' className='sr-only'>
									Email Address
								</label>
								<input
									{...register('email')}
									type='text'
									id='email'
									className='form-control form-control-lg'
									placeholder='Email Address'
									disabled={processing}
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									{...register('password')}
									type='password'
									id='password'
									className='form-control form-control-lg'
									placeholder='Password'
									disabled={processing}
								/>
							</div>
							<Link to={routes.FORGOT_PASSWORD} className='d-block'>
								Forgot password?
							</Link>
							<Link to={routes.HOME} className='d-block'>
								Return to Home Page
							</Link>
							<button className='btn btn-primary btn-block mt-5 btn-lg' type='submit' disabled={processing}>
								{processing ? <i className='fa fa-circle-notch fa-spin'></i> : 'Login'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Form;
