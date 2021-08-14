import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { Asker, handleError, setValues } from '../../helpers';
import { useCurrentYear, useMode, useNullable } from '../../hooks';
import { admissionService } from '../../Services/admission.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { courseService } from '../../Services/course.service';
import { userService } from '../../Services/user.service';
import { CourseContract } from '../../Contracts/course.contract';
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
		payment_status: 'Not Paid' | 'Fully Paid' | 'Partially Paid';
	};
	force: boolean;
	done: boolean;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<Inputs>({
		defaultValues: {
			force: false,
		},
	});
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const [birthday, setBirthday] = useNullable<Date>();
	const [majorID, setMajorID] = useNullable<number>();
	const [number, setNumber] = useState('');
	const [course, setCourse] = useNullable<CourseContract>();
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const { data: year } = useCurrentYear();

	const fetch = async (id: any) => {
		try {
			const data = await admissionService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setBirthday(dayjs(data.student?.birthday).toDate());
			if (data.student) {
				for (const key in data.student) {
					setValue(`student.${key}` as any, (data.student as any)[key]);
				}
			}
			setCourse(data.course!);
			if (data.major_id) {
				setMajorID(data.major_id);
			}
			setNumber(data.student?.number!);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: Inputs) => {
		if ((course?.majors?.length || 0) > 0 && !majorID) {
			return toastr.error('Please pick a major.');
		}
		setProcessing(true);
		try {
			if (majorID) {
				data.major_id = majorID;
			}
			data.requirements = [];
			data.student.number = number;
			data.student.birthday = birthday?.toJSON();
			data.year_id = year?.id!;
			await (mode === 'Add' ? admissionService.create(data) : admissionService.update(id, data));
			toastr.success('Admission has been saved successfully.');
			setBirthday(null);
			reset();
		} catch (error: any) {
			if (error.response?.status === 409) {
				if (await Asker.save(error.response?.data?.message)) {
					data.force = true;
					await submit(data);
					return;
				}
			} else {
				console.log('haha');
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
					'student.uuid',
					`student-${`${users.filter((user) => user.role === 'Student').length + 1}`.padStart(
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
					<h5 className='card-title'>{mode} Admission</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='first_name' className='required'>
									First Name
								</label>
								<input
									{...register('student.first_name')}
									type='text'
									id='first_name'
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='year_id' className='required'>
									School Year
								</label>
								<select id='year_id' className='form-control' disabled>
									<option value={year?.id}>
										{year?.start} - {year?.end}
									</option>
								</select>
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
								<label htmlFor='uuid' className='required'>
									Student Number
								</label>
								<input {...register('student.uuid')} type='text' id='uuid' className='form-control' readOnly />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='last_name' className='required'>
									Last Name
								</label>
								<input
									{...register('student.last_name')}
									type='text'
									id='last_name'
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='address' className='required'>
									Address
								</label>
								<input
									{...register('student.address')}
									type='text'
									id='address'
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='gender' className='required'>
									Gender
								</label>
								<select {...register('student.gender')} id='gender' className='form-control' disabled={processing}>
									<option value=''> -- Select -- </option>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='email' className='required'>
									Email Address
								</label>
								<input {...register('student.email')} type='email' id='email' className='form-control' />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='birthday' className='required'>
									Birthday
								</label>
								<Flatpickr
									value={birthday || undefined}
									id='birthday'
									options={{
										maxDate: dayjs()
											.year(new Date().getFullYear() - 17)
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
								<label htmlFor='number' className='required'>
									Phone Number
								</label>
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
							<div className='col-12 d-flex'>
								<i className='ml-auto'>Student user account credentials will be sent via email.</i>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='fathers_name' className='required'>
									Name of Father
								</label>
								<input {...register('student.fathers_name')} type='text' id='fathers_name' className='form-control' />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='mothers_name' className='required'>
									Name of Mother
								</label>
								<input {...register('student.mothers_name')} type='text' id='mothers_name' className='form-control' />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='fathers_occupation' className='required'>
									Occupation of Father
								</label>
								<input
									{...register('student.fathers_occupation')}
									type='text'
									id='fathers_occupation'
									className='form-control'
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='mothers_occupation' className='required'>
									Occupation of Mother
								</label>
								<input
									{...register('student.mothers_occupation')}
									type='text'
									id='mothers_occupation'
									className='form-control'
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='course_id' className='required'>
									Course
								</label>
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
									<label htmlFor='major_id' className='required'>
										Major
									</label>
									<select
										id='major_id'
										className='form-control'
										onChange={(e) => {
											setMajorID(e.target.value.toNumber());
										}}
										value={`${majorID}`}>
										<option value=''> -- Select -- </option>
										{course.majors.map((major, index) => (
											<option value={major.id} key={index}>
												{major.name}
											</option>
										))}
									</select>
								</div>
							) : null}
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='term' className='required'>
									Term
								</label>
								<div className='row'>
									<div className='col-12 col-md-4'>
										<div className='custom-control custom-radio'>
											<input
												{...register('term')}
												type='radio'
												id='1st-semester'
												className='custom-control-input'
												value='1st Semester'
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
												value='2nd Semester'
											/>
											<label className='custom-control-label' htmlFor='2nd-semester'>
												2nd Semester
											</label>
										</div>
									</div>
									<div className='col-12 col-md-4'>
										<div className='custom-control custom-radio'>
											<input
												{...register('term')}
												type='radio'
												id='summer'
												className='custom-control-input'
												value='Summer'
											/>
											<label className='custom-control-label' htmlFor='summer'>
												Summer
											</label>
										</div>
									</div>
								</div>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='level' className='required'>
									Year Level
								</label>
								<select {...register('level')} id='level' className='form-control'>
									<option value=''> -- Select -- </option>
									<option value='1st'>1st</option>
									<option value='2nd'>2nd</option>
									<option value='3rd'>3rd</option>
									<option value='4th'>4th</option>
									<option value='5th'>5th</option>
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='status' className='required'>
									Student Status
								</label>
								<select {...register('status')} id='status' className='form-control'>
									<option value=''> -- Select -- </option>
									<option value='Regular'>Regular</option>
									<option value='Irregular'>Irregular</option>
								</select>
							</div>
						</div>
						<div className='form-group d-flex'>
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
