import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { YearContract } from '../../Contracts/year.contract';
import { handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { yearService } from '../../Services/year.service';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<YearContract>({
		defaultValues: {
			start: new Date().getFullYear(),
			end: new Date().getFullYear() + 1,
			current: true,
		},
	});
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const [semesterStart, setSemesterStart] = useNullable<Date>();
	const [semesterEnd, setSemesterEnd] = useNullable<Date>();
	const [registrationStart, setRegistrationStart] = useNullable<Date>();
	const [registrationEnd, setRegistrationEnd] = useNullable<Date>();
	const [gradeStart, setGradeStart] = useNullable<Date>();
	const [gradeEnd, setGradeEnd] = useNullable<Date>();

	const fetch = async (id: any) => {
		try {
			const data = await yearService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setSemesterStart(dayjs(data.semester_start).toDate());
			setSemesterEnd(dayjs(data.semester_end).toDate());
			setRegistrationStart(dayjs(data.registration_start).toDate());
			setRegistrationEnd(dayjs(data.registration_end).toDate());
			setGradeStart(dayjs(data.grade_start).toDate());
			setGradeEnd(dayjs(data.grade_end).toDate());
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: YearContract) => {
		setProcessing(true);
		try {
			data.semester_start = semesterStart?.toJSON() || '';
			data.semester_end = semesterEnd?.toJSON() || '';
			data.registration_start = registrationStart?.toJSON() || '';
			data.registration_end = registrationEnd?.toJSON() || '';
			data.grade_start = gradeStart?.toJSON() || '';
			data.grade_end = gradeEnd?.toJSON() || '';
			await (mode === 'Add' ? yearService.create(data) : yearService.update(id, data));
			toastr.success('School Year has been saved successfully.');
			reset();
			setGradeStart(null);
			setGradeEnd(null);
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
					<h5 className='card-title'>{mode} School Year</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='start'>Start</label>
								<input
									{...register('start')}
									type='number'
									id='start'
									min={new Date().getFullYear()}
									max={new Date().getFullYear() + 10}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='end'>End</label>
								<input
									{...register('end')}
									type='number'
									id='end'
									min={new Date().getFullYear()}
									max={new Date().getFullYear() + 10}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12'>
								<label htmlFor='semester'>Semester</label>
								<select {...register('semester')} id='semester' className='form-control'>
									<option value=''> -- Select -- </option>
									<option value='1st Semester'>1st Semester</option>
									<option value='2nd Semester'>2nd Semester</option>
									<option value='Summer'>Summer</option>
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='semester_start'>Semester Start</label>
								<Flatpickr
									value={semesterStart || undefined}
									id='semester_start'
									onChange={(dates) => {
										if (dates.length > 0) {
											setSemesterStart(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='semester_end'>Semester End</label>
								<Flatpickr
									value={semesterEnd || undefined}
									id='semester_end'
									onChange={(dates) => {
										if (dates.length > 0) {
											setSemesterEnd(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='registration_start'>Registration Start</label>
								<Flatpickr
									value={registrationStart || undefined}
									id='registration_start'
									onChange={(dates) => {
										if (dates.length > 0) {
											setRegistrationStart(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='registration_end'>Registration End</label>
								<Flatpickr
									value={registrationEnd || undefined}
									id='registration_end'
									onChange={(dates) => {
										if (dates.length > 0) {
											setRegistrationEnd(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='grade_start'>Grade Encoding Start</label>
								<Flatpickr
									value={gradeStart || undefined}
									id='grade_start'
									onChange={(dates) => {
										if (dates.length > 0) {
											setGradeStart(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
									options={{
										altInput: true,
										altFormat: 'F j, Y G:i K',
										enableTime: true,
										dateFormat: 'F j, Y G:i K',
									}}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='grade_end'>Grade Encoding End</label>
								<Flatpickr
									value={gradeEnd || undefined}
									id='grade_end'
									onChange={(dates) => {
										if (dates.length > 0) {
											setGradeEnd(dates[0]);
										}
									}}
									className='form-control'
									disabled={processing}
									options={{
										altInput: true,
										altFormat: 'F j, Y G:i K',
										enableTime: true,
										dateFormat: 'F j, Y G:i K',
									}}
								/>
							</div>
							<div className='form-group col-12'>
								<div className='custom-control custom-checkbox'>
									<input
										{...register('current')}
										type='checkbox'
										className='custom-control-input'
										id='current'
										disabled={processing}
									/>
									<label className='custom-control-label' htmlFor='current'>
										Set as Current
									</label>
								</div>
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
