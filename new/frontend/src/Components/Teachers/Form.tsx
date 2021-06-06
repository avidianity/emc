import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { userService } from '../../Services/user.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';

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

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<Inputs>();
	const [birthday, setBirthday] = useNullable<Date>();
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();

	const fetch = async (id: any) => {
		try {
			const data = await userService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setBirthday(dayjs(data.birthday).toDate());
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.role = 'Teacher';
			data.active = true;
			data.birthday = birthday?.toJSON();
			await (mode === 'Add' ? userService.create(data) : userService.update(id, data));
			toastr.success('Teacher has been saved successfully.');
			reset();
			setBirthday(null);
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetch(match.params.id);
		} else {
			userService.fetch().then((users) => {
				setValue(
					'uuid',
					`teacher-${`${users.filter((user) => user.role === 'Teacher').length}`.padStart(5, '0')}-${new Date().getFullYear()}`
				);
			});
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title'>{mode} Teacher</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='first_name'>First Name</label>
								<input
									{...register('first_name')}
									type='text'
									id='first_name'
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='uuid'>Registrar Number</label>
								<input
									{...register('uuid')}
									type='text'
									id='uuid'
									className='form-control'
									disabled={processing || mode === 'Edit'}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='last_name'>Last Name</label>
								<input
									{...register('last_name')}
									type='text'
									id='last_name'
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='email'>Email Address</label>
								<input {...register('email')} type='email' id='email' className='form-control' disabled={processing} />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='gender'>Gender</label>
								<select {...register('gender')} id='gender' className='form-control'>
									<option> -- Select -- </option>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='number'>Phone Number</label>
								<input
									{...register('number')}
									pattern='09[0-9]{2}-[0-9]{3}-[0-9]{4}'
									type='text'
									id='number'
									className='form-control'
									disabled={processing}
								/>
								<small className='text-muted form-text'>Format: 0912-345-6789</small>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='birthday'>Birthday</label>
								<Flatpickr
									value={birthday || undefined}
									id='birthday'
									options={{
										maxDate: dayjs()
											.year(new Date().getFullYear() - 15)
											.toDate(),
									}}
									onChange={(dates) => {
										if (dates.length > 0) {
											setBirthday(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='address'>Address</label>
								<input {...register('address')} type='text' id='address' className='form-control' disabled={processing} />
							</div>
						</div>
						<div className='d-flex'>
							<i className='ml-auto'>Account credentials will be sent via email.</i>
						</div>
						<div className='d-flex'>
							<button type='button' className='btn btn-secondary' onClick={() => history.goBack()} disabled={processing}>
								Return
							</button>
							<button type='submit' className='btn btn-primary ml-auto' disabled={processing}>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
