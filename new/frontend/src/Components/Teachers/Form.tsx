import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { Asker, handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { userService } from '../../Services/user.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import InputMask from 'react-input-mask';

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
	force: boolean;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<Inputs>({
		defaultValues: {
			force: false,
		},
	});
	const [birthday, setBirthday] = useNullable<Date>();
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const [number, setNumber] = useState('');

	const fetch = async (id: any) => {
		try {
			const data = await userService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setBirthday(dayjs(data.birthday).toDate());
			setNumber(data.number);
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
			data.number = number;
			await (mode === 'Add' ? userService.create(data) : userService.update(id, data));
			toastr.success('Teacher has been saved successfully.');
			reset();
			setBirthday(null);
		} catch (error) {
			if (error.response?.status === 409) {
				if (await Asker.save(error.response?.data?.message)) {
					data.force = true;
					await submit(data);
					return;
				}
			} else {
				handleError(error);
			}
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
					`teacher-${`${users.filter((user) => user.role === 'Teacher').length + 1}`.padStart(
						5,
						'0'
					)}-${new Date().getFullYear()}`
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
								<label htmlFor='uuid'>Teacher Number</label>
								<input {...register('uuid')} type='text' id='uuid' className='form-control' disabled />
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
								<InputMask
									mask='0\999-999-9999'
									type='text'
									id='number'
									className='form-control'
									disabled={processing}
									value={number}
									onChange={(e) => setNumber(e.target.value)}
								/>
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
