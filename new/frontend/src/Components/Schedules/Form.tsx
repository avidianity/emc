import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { ScheduleRow } from '../../Contracts/schedule.contract';
import { Asker, handleError, setValues } from '../../helpers';
import { useArray, useMode, useNullable } from '../../hooks';
import { courseService } from '../../Services/course.service';
import { scheduleService } from '../../Services/schedule.service';
import { subjectService } from '../../Services/subject.service';
import { userService } from '../../Services/user.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { yearService } from '../../Services/year.service';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { UserContract } from '../../Contracts/user.contract';

type Props = {};

type Inputs = {
	course_id: number;
	subject_id: number;
	teacher_id: number;
	year: string;
	year_id: number;
	major_id?: number;
	payload: ScheduleRow[];
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
	const [course, setCourse] = useNullable<CourseContract>();
	const [major, setMajor] = useNullable<MajorContract>();
	const [teacher, setTeacher] = useNullable<UserContract>();
	const [rows, setRows] = useArray<ScheduleRow>([
		{
			day: '',
			start_time: null,
			end_time: null,
		},
	]);
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const { data: users } = useQuery('users', () => userService.fetch());
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const { data: years } = useQuery('years', () => yearService.fetch());

	const fetch = async (id: any) => {
		try {
			const data = await scheduleService.fetchOne(id);
			setID(data.id!);
			setMode('Edit');
			setValues(setValue, data);
			setRows([...data.payload]);
			setCourse(data.course!);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			const year = years?.find((year) => year.current);
			if (year) {
				data.year_id = year.id!;
			} else {
				return toastr.error('A School Year is not set, please create/make one as current.');
			}
			data.payload = rows;
			await (mode === 'Add' ? scheduleService.create(data) : scheduleService.update(id, data));
			toastr.success('Schedule has been saved successfully.');
			reset();
			setRows([]);
			setCourse(null);
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
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title'>{mode} Schedule</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
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
											setMajor(null);
										}
									}}>
									<option> -- Select -- </option>
									{courses?.map((course, index) => (
										<option value={course.id} key={index}>
											{course.code}
										</option>
									))}
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='teacher_id'>Teacher</label>
								<select
									{...register('teacher_id')}
									id='teacher_id'
									className='form-control'
									onChange={(e) => {
										const id = e.target.value.toNumber();
										const teacher = users?.find((user) => user.role === 'Teacher' && user.id === id);
										if (teacher) {
											setTeacher(teacher);
										} else {
											setTeacher(null);
										}
									}}>
									<option> -- Select -- </option>
									{users
										?.filter((user) => user.role === 'Teacher')
										.map((teacher, index) => (
											<option value={teacher.id} key={index}>
												{teacher.last_name}, {teacher.first_name} {teacher.middle_name || ''}
											</option>
										))}
								</select>
							</div>
							{course && course.majors && course.majors.length > 0 ? (
								<div className='form-group col-12 col-md-6'>
									<label htmlFor='major_id'>Major</label>
									<select
										{...register('major_id')}
										id='major_id'
										className='form-control'
										onChange={(e) => {
											const id = e.target.value.toNumber();
											const major = course?.majors?.find((major) => major.id === id);
											if (major) {
												setMajor(major);
											} else {
												setMajor(null);
											}
										}}>
										<option> -- Select -- </option>
										{course.majors.map((major, index) => (
											<option value={major.id} key={index}>
												{major.name}
											</option>
										))}
									</select>
								</div>
							) : null}
							<div className={`form-group col-12 col-md-6 ${course && course.majors && course.majors.length > 0 ? '' : ''}`}>
								<label htmlFor='subject_id'>Subject</label>
								<select {...register('subject_id')} id='subject_id' className='form-control'>
									<option> -- Select -- </option>
									{subjects
										?.filter((subject) => {
											const valid =
												subject.schedules?.find((schedule) => {
													if (course && major && teacher) {
														return (
															schedule.teacher_id === teacher.id &&
															schedule.course_id === course.id &&
															schedule.major_id === major.id
														);
													}
													return true;
												}) === undefined;
											if (mode === 'Add') {
												return valid;
											}
											return valid || subject.id === id;
										})
										.filter((subject) => {
											if (course && major) {
												return subject.course_id === course.id && subject.major_id === major.id;
											} else if (course) {
												return subject.course_id === course.id;
											} else if (major) {
												return subject.major_id === major.id;
											}
											return true;
										})
										.map((subject, index) => (
											<option value={subject.id} key={index}>
												{subject.description}
											</option>
										))}
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='year'>Year Level</label>
								<select {...register('year')} id='year' className='form-control'>
									<option> -- Select -- </option>
									<option value='1st'>1st</option>
									<option value='2nd'>2nd</option>
									<option value='3rd'>3rd</option>
									<option value='4th'>4th</option>
									<option value='5th'>5th</option>
								</select>
							</div>
							<div className='form-group col-12'>
								<button
									className='btn btn-info btn-sm mt-2 mb-4'
									onClick={(e) => {
										e.preventDefault();
										rows.push({ day: '', start_time: null, end_time: null });
										setRows([...rows]);
									}}>
									Add Row
								</button>
								<table className='table'>
									<thead>
										<tr>
											<th>Day</th>
											<th>Start Time</th>
											<th>End Time</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{rows.map(({ day, start_time, end_time }, index) => (
											<tr key={index}>
												<td>
													<input
														type='text'
														className='form-control'
														value={day}
														onChange={(e) => {
															rows.splice(index, 1, { day: e.target.value, start_time, end_time });
															setRows([...rows]);
														}}
													/>
												</td>
												<td>
													<Flatpickr
														value={start_time ? dayjs(start_time).toDate() : undefined}
														options={{
															enableTime: true,
															mode: 'time',
															altFormat: 'G:i K',
															altInput: true,
														}}
														onChange={(dates) => {
															if (dates.length > 0) {
																rows.splice(index, 1, { day, start_time: dates[0].toJSON(), end_time });
																setRows([...rows]);
															}
														}}
														className='form-control'
														disabled={processing}
													/>
												</td>
												<td>
													<Flatpickr
														value={end_time ? dayjs(end_time).toDate() : undefined}
														options={{
															enableTime: true,
															mode: 'time',
															altFormat: 'G:i K',
															altInput: true,
														}}
														onChange={(dates) => {
															if (dates.length > 0) {
																rows.splice(index, 1, { day, end_time: dates[0].toJSON(), start_time });
																setRows([...rows]);
															}
														}}
														className='form-control'
														disabled={processing}
													/>
												</td>
												<td>
													<button
														className='btn btn-danger btn-sm'
														onClick={(e) => {
															e.preventDefault();
															rows.splice(index, 1);
															setRows([...rows]);
														}}>
														Remove
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
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
