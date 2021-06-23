import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContract } from '../../../Contracts/user.contract';
import { handleError } from '../../../helpers';
import { State } from '../../../Libraries/State';

type Props = {};

type Inputs = {
	uuid: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	gender?: string;
	address?: string;
	place_of_birth?: string;
	birthday?: string;
	role: string;
	email: string;
	number: string;
	active: boolean;
	password: string;
	fathers_name?: string;
	mothers_name?: string;
	fathers_occupation?: string;
	mothers_occupation?: string;
};

const Profile: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const state = State.getInstance();
	const user = state.get<UserContract>('user');
	const { register, handleSubmit } = useForm<Inputs>({
		defaultValues: {
			...user,
		},
	});

	const submit = async (data: Inputs) => {
		if (!user?.active) {
			return;
		}
		setProcessing(true);
		try {
			await axios.post('/auth/profile', data);
			toastr.success('Profile updated successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	if (!user) {
		return null;
	}

	if (!user.active) {
		toastr.info('Your account is currently inactive. Profile changes will not be saved.');
	}

	return (
		<div className='container'>
			<form className='row' onSubmit={handleSubmit(submit)}>
				<div className='col-12 col-md-6'>
					<div className='row'>
						<div className='col-3 my-2'>Student Number</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<b>{user.uuid}</b>
						</div>
						<div className='col-3 my-2 d-flex align-items-center'>Name</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<b>
								{user.last_name}, {user.first_name} {user.middle_name || ''}
							</b>
						</div>
						<div className='col-3 my-2 d-flex align-items-center'>Gender</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<b>{user.gender}</b>
						</div>
						<div className='col-3 my-2 d-flex align-items-center'>Date of Birth</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<b>{dayjs(user.birthday).format('MMMM DD, YYYY')}</b>
						</div>
						<div className='col-3 my-2 d-flex align-items-center'>Place of Birth</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<input {...register('place_of_birth')} type='text' className='form-control' disabled={processing} />
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6'>
					<div className='row'>
						<div className='col-3 my-2 d-flex align-items-center'>Address</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<input {...register('address')} type='text' className='form-control' disabled={processing} />
						</div>
						<div className='col-3 my-2 d-flex align-items-center'>Mobile Number</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<input
								{...register('number')}
								type='text'
								className='form-control'
								pattern='09[0-9]{2}-[0-9]{3}-[0-9]{4}'
								placeholder='0912-345-6789'
								disabled={processing}
							/>
						</div>
						<div className='col-3 my-2 d-flex align-items-center'>Email Address</div>
						<div className='col-9 my-2 d-flex align-items-center'>
							<input {...register('email')} type='email' className='form-control' disabled={processing} />
						</div>
					</div>
				</div>
				<div className='col-12 text-center pt-5'>
					<button type='submit' className='btn btn-info btn-sm' disabled={processing}>
						Save
					</button>
					<p className='my-3'>
						<i>I hereby certify that all of the information provided are true and correct to the best of my knowledge.</i>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Profile;
