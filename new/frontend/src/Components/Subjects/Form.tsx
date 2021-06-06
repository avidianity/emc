import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { handleError, setValues } from '../../helpers';
import { useMode } from '../../hooks';
import { courseService } from '../../Services/course.service';
import { subjectService } from '../../Services/subject.service';

type Props = {};

type Inputs = {
	code: string;
	description: string;
	course_id: number;
	level: string;
	term: string;
	units: string;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<Inputs>();
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const { data: courses } = useQuery('courses', () => courseService.fetch());

	const fetch = async (id: any) => {
		try {
			const data = await subjectService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			await (mode === 'Add' ? subjectService.create(data) : subjectService.update(id, data));
			toastr.success('Subject has been saved successfully.');
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
					<h5 className='card-title'>{mode} Subject</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='code'>Subject Code</label>
								<input {...register('code')} type='text' id='code' className='form-control' disabled={processing} />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='description'>Description</label>
								<input
									{...register('description')}
									type='text'
									id='description'
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
							<div className='form-group col-12 col-md-4'>
								<label htmlFor='units'>Number of Units</label>
								<select {...register('units')} id='units' className='form-control'>
									<option> -- Select -- </option>
									{[1, 2, 3, 4, 5].map((unit, index) => (
										<option value={unit} key={index}>
											{unit}
										</option>
									))}
								</select>
							</div>
							<div className='form-group col-12 col-md-4'>
								<label htmlFor='term'>Term</label>
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
								<div className='custom-control custom-radio'>
									<input {...register('term')} type='radio' id='summer' className='custom-control-input' value='Summer' />
									<label className='custom-control-label' htmlFor='summer'>
										Summer
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
