import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useArray, useCurrentYear, useNullable } from '../hooks';
import { courseService } from '../Services/course.service';
import { yearService } from '../Services/year.service';
import Flatpickr from 'react-flatpickr';
import { useHistory } from 'react-router';
import { requirementService } from '../Services/requirement.service';
import { Asker, handleError } from '../helpers';
import { userService } from '../Services/user.service';
import axios from 'axios';
import { CourseContract } from '../Contracts/course.contract';
import InputMask from 'react-input-mask';

type Props = {};

type Inputs = {
	course_id: number;
	level: string;
	status: string;
	term: string;
	student_id: number;
	year_id: number;
	major_id?: number;
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
		type: string;
		enrolled: boolean;
	};
	force: boolean;
};

const PreRegistration: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [all, setAll] = useState(false);
	const { register, handleSubmit, reset, setValue } = useForm<Inputs>({
		defaultValues: {
			force: false,
			level: '1st',
		},
	});
	const [birthday, setBirthday] = useNullable<Date>();
	const [course, setCourse] = useNullable<CourseContract>();
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
	const [number, setNumber] = useState('');
	const history = useHistory();
	const { data: year } = useCurrentYear({ onSuccess: () => check() });

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.status = 'Regular';
			data.term = '1st Semester';
			data.year_id = years?.find((year) => year.current)?.id || 0;
			data.pre_registration = true;
			data.requirements = selected;
			data.student.number = number;
			data.student.birthday = birthday?.toJSON() || '';
			await axios.post('/admission/pre-registration', data);
			toastr.success('Pre Registration saved successfully.');
			reset();
			history.goBack();
		} catch (error) {
			if (error.response?.status === 409) {
				if (await Asker.notice(error.response?.data?.message)) {
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

	const check = async () => {
		if (year) {
			const now = dayjs();
			const start = dayjs(year.registration_start);
			const end = dayjs(year.registration_end);
			if (now.isBefore(start)) {
				await Asker.okay(
					`Registration will start at ${start.format('MMMM DD, YYYY')}. Please wait until the given date.`,
					'Notice'
				);
				return history.goBack();
			}
			if (now.isAfter(end)) {
				await Asker.okay(`Registration has already ended. Please register at the next registration phase.`, 'Notice');
				return history.goBack();
			}
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
						<option value=''> -- Select -- </option>
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
				<div className='form-group col-12 col-md-6'>
					<label htmlFor='course_id'>Course</label>
					<select
						{...register('course_id')}
						id='course_id'
						className='form-control'
						onChange={(e) => {
							const id = e.target.value.toNumber();
							const course = courses?.find((course) => course.id === id);
							if (course) {
								setCourse(course);
							} else {
								setCourse(null);
							}
						}}>
						<option value=''> -- Select -- </option>
						{courses
							?.filter((course) => course.open)
							.map((course, index) => (
								<option value={course.id} key={index}>
									{course.description}
								</option>
							))}
					</select>
				</div>
				{course && course.majors && course.majors.length > 0 ? (
					<div className='form-group col-12 col-md-6'>
						<label htmlFor='major_id'>Major</label>
						<select {...register('major_id')} id='major_id' className='form-control'>
							<option value=''> -- Select -- </option>
							{course?.majors?.map((major, index) => (
								<option value={major.id} key={index}>
									{major.name}
								</option>
							))}
						</select>
					</div>
				) : null}
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
					<input {...register('student.uuid')} type='text' id='uuid' className='form-control' readOnly />
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
