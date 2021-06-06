import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { ScheduleRow } from '../../Contracts/schedule.contract';
import { handleError, setValues } from '../../helpers';
import { useArray, useMode } from '../../hooks';
import { courseService } from '../../Services/course.service';
import { scheduleService } from '../../Services/schedule.service';
import { subjectService } from '../../Services/subject.service';
import { userService } from '../../Services/user.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { yearService } from '../../Services/year.service';

type Props = {};

type Inputs = {
	course_id: number;
	subject_id: number;
	teacher_id: number;
	year: string;
	year_id: number;
	payload: ScheduleRow[];
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<Inputs>();
	const [rows, setRows] = useArray<ScheduleRow>([
		{
			day: 'Monday',
			start_time: null,
			end_time: null,
		},
		{
			day: 'Tuesday',
			start_time: null,
			end_time: null,
		},
		{
			day: 'Wednesday',
			start_time: null,
			end_time: null,
		},
		{
			day: 'Thursday',
			start_time: null,
			end_time: null,
		},
		{
			day: 'Friday',
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
			setValues(setValue, data);
			setMode('Edit');
			setRows([...data.payload]);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.payload = rows;
			await (mode === 'Add' ? scheduleService.create(data) : scheduleService.update(id, data));
			toastr.success('Schedule has been saved successfully.');
			reset();
		} catch (error) {
			handleError(error);
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
							<div className='form-group col-12'>
								<label htmlFor='year_id'>School Year</label>
								<select {...register('year_id')} id='year_id' className='form-control'>
									<option> -- Select -- </option>
									{years?.map((year, index) => (
										<option value={year.id} key={index}>
											{year.start} - {year.end}
										</option>
									))}
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='course_id'>Course</label>
								<select {...register('course_id')} id='course_id' className='form-control'>
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
								<select {...register('teacher_id')} id='teacher_id' className='form-control'>
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
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='subject_id'>Subject</label>
								<select {...register('subject_id')} id='subject_id' className='form-control'>
									<option> -- Select -- </option>
									{subjects
										?.filter((subject) => subject.schedules?.length === 0)
										.map((subject, index) => (
											<option value={subject.id} key={index}>
												{subject.code}
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
								<table className='table'>
									<thead>
										<tr>
											<th>Day</th>
											<th>Start Time</th>
											<th>End Tiome</th>
										</tr>
									</thead>
									<tbody>
										{rows.map(({ day, start_time, end_time }, index) => (
											<tr key={index}>
												<td>
													<input type='text' className='form-control' value={day} disabled />
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
