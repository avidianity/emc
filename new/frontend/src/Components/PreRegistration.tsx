import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useArray, useNullable } from '../hooks';
import { courseService } from '../Services/course.service';
import { yearService } from '../Services/year.service';
import Flatpickr from 'react-flatpickr';
import { useHistory } from 'react-router';
import { requirementService } from '../Services/requirement.service';
import { handleError } from '../helpers';
import { userService } from '../Services/user.service';
import axios from 'axios';

type Props = {};

type Inputs = {
	course_id: number;
	level: string;
	status: string;
	term: string;
	student_id: number;
	year_id: number;
	pre_registration: boolean;
	requirements: string[];
	student: {
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
};

const PreRegistration: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [all, setAll] = useState(false);
	const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
	const [birthday, setBirthday] = useNullable<Date>();
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const { data: years } = useQuery('years', () => yearService.fetch(), {
		onSuccess(years) {
			if (years.length === 0) {
				toastr.info(
					'Registrar has not set a school year. Pre Registration will not be available until a registrar creates one.',
					'Notice'
				);
			}
		},
	});
	const { data: requirements } = useQuery('requirements', () => requirementService.fetch());
	const [selected, setSelected] = useArray<string>();
	const history = useHistory();

	const submit = async (data: Inputs) => {
		setProcessing(false);
		try {
			data.status = 'Regular';
			data.year_id = years?.find((year) => year.current)?.id || 0;
			data.pre_registration = true;
			data.requirements = selected;
			await axios.post('/admission/pre-registration', data);
			toastr.success('Pre Registration saved successfully.');
			reset();
			history.goBack();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		userService.fetch().then((users) => {
			setValue(
				'student.uuid',
				`student-${`${users.filter((user) => user.role === 'Student').length}`.padStart(5, '0')}-${new Date().getFullYear()}`
			);
		});

		// eslint-disable-next-line
	}, []);

	return (
		<div className='container py-5'>
			<h3>Pre Registration Form</h3>
			<form className='form-row' onSubmit={handleSubmit(submit)}>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='first_name'>First Name</label>
					<input {...register('student.first_name')} type='text' id='first_name' className='form-control' disabled={processing} />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='address'>Address</label>
					<input {...register('student.address')} type='text' id='address' className='form-control' disabled={processing} />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='middle_name'>Middle Name</label>
					<input
						{...register('student.middle_name')}
						type='text'
						id='middle_name'
						className='form-control'
						disabled={processing}
					/>
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='number'>Phone Number</label>
					<input
						{...register('student.number')}
						pattern='09[0-9]{2}-[0-9]{3}-[0-9]{4}'
						type='text'
						id='number'
						className='form-control'
						disabled={processing}
					/>
					<small className='text-muted form-text'>Format: 0912-345-6789</small>
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='last_name'>Last Name</label>
					<input {...register('student.last_name')} type='text' id='last_name' className='form-control' disabled={processing} />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='email'>Email Address</label>
					<input {...register('student.email')} type='email' id='email' className='form-control' />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='gender'>Gender</label>
					<select {...register('student.gender')} id='gender' className='form-control' disabled={processing}>
						<option> -- Select -- </option>
						<option value='Male'>Male</option>
						<option value='Female'>Female</option>
					</select>
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
				<div className='form-group col-12 col-md-4'>
					<label htmlFor='course_id'>Course Code</label>
					<select {...register('course_id')} id='course_id' className='form-control'>
						<option> -- Select -- </option>
						{courses?.map((course, index) => (
							<option value={course.id} key={index}>
								{course.code}
							</option>
						))}
					</select>
				</div>
				<div className='form-group col-12 col-md-4'>
					<label htmlFor='term'>Term</label>
					<div className='row'>
						<div className='col-12 col-md-4'>
							<div className='custom-control custom-radio'>
								<input
									{...register('term')}
									type='radio'
									id='1st-semester'
									className='custom-control-input'
									value='First Semester'
								/>
								<label className='custom-control-label' htmlFor='1st-semester'>
									1st Semester
								</label>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='custom-control custom-radio'>
								<input
									{...register('term')}
									type='radio'
									id='2nd-semester'
									className='custom-control-input'
									value='Second Semester'
								/>
								<label className='custom-control-label' htmlFor='2nd-semester'>
									2nd Semester
								</label>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='custom-control custom-radio'>
								<input {...register('term')} type='radio' id='summer' className='custom-control-input' value='Summer' />
								<label className='custom-control-label' htmlFor='summer'>
									Summer
								</label>
							</div>
						</div>
					</div>
				</div>
				<div className='form-group col-12 col-md-4'>
					<label htmlFor='level'>Year Level</label>
					<select {...register('level')} id='level' className='form-control'>
						<option> -- Select -- </option>
						<option value='1st'>1st</option>
						<option value='2nd'>2nd</option>
						<option value='3rd'>3rd</option>
						<option value='4th'>4th</option>
						<option value='5th'>5th</option>
					</select>
				</div>
				<div className='form-group col-12 p-2'>
					<div className='text-center'>
						<h3>Requirements</h3>
					</div>
					<div className='p-2 border rounded row'>
						{requirements?.length === 0 ? 'No Requirements' : ''}
						{requirements?.map((requirement, index) => (
							<div className='col-12 col-md-6 col-lg-4 col-xl-3' key={index}>
								<div className='form-group'>
									<div className='custom-control custom-checkbox'>
										<input
											type='checkbox'
											className='custom-control-input'
											id={JSON.stringify(requirement)}
											disabled={processing}
											onChange={(e) => {
												const name = e.target.value;
												if (selected.includes(name)) {
													const index = selected.findIndex((m) => m === name);
													selected.splice(index, 1);
												} else {
													selected.push(name);
												}
												setSelected([...selected]);
											}}
											checked={selected.includes(requirement.name)}
											value={requirement.name}
										/>
										<label className='custom-control-label' htmlFor={JSON.stringify(requirement)}>
											{requirement.name}
										</label>
									</div>
								</div>
							</div>
						))}
						<div className='col-12 d-flex'>
							<button
								className={`btn btn-${!all ? 'secondary' : 'danger'} btn-sm ml-auto`}
								onClick={(e) => {
									e.preventDefault();
									if (requirements) {
										if (!all) {
											setSelected(requirements.map((requirement) => requirement.name));
										} else {
											setSelected([]);
										}
										setAll(!all);
									}
								}}>
								{!all ? 'Select All' : 'Unselect All'}
							</button>
						</div>
					</div>
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='fathers_name'>Name of Father</label>
					<input {...register('student.fathers_name')} type='text' id='fathers_name' className='form-control' />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='mothers_name'>Name of Mother</label>
					<input {...register('student.mothers_name')} type='text' id='mothers_name' className='form-control' />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='fathers_occupation'>Occupation of Father</label>
					<input {...register('student.fathers_occupation')} type='text' id='fathers_occupation' className='form-control' />
				</div>
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='mothers_occupation'>Occupation of Mother</label>
					<input {...register('student.mothers_occupation')} type='text' id='mothers_occupation' className='form-control' />
				</div>
				<div className='form-group col-12 col-md-6 d-none'>
					<label htmlFor='uuid'>Student Number</label>
					<input {...register('student.uuid')} type='text' id='uuid' className='form-control' disabled={processing} />
				</div>
				<div className='form-group col-12 d-flex'>
					<span className='mr-auto'>
						<button
							className='btn btn-secondary btn-sm'
							onClick={(e) => {
								e.preventDefault();
								history.goBack();
							}}
							disabled={processing}>
							Return
						</button>
					</span>
					<span className='ml-auto'>
						<button type='submit' className='btn btn-primary btn-sm' disabled={processing}>
							Submit
						</button>
					</span>
				</div>
			</form>
		</div>
	);
};

export default PreRegistration;
