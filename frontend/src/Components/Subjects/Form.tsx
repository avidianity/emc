import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { CourseContract } from '../../Contracts/course.contract';
import { Asker, handleError, setValues } from '../../helpers';
import { useMode, useNullable } from '../../hooks';
import { courseService } from '../../Services/course.service';
import { subjectService } from '../../Services/subject.service';

type Props = {};

type Inputs = {
	code: string;
	description: string;
	course_id: number;
	level: string;
	term: string;
	units: number;
	force: boolean;
	major_id?: number;
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
	const [course, setCourse] = useNullable<CourseContract>();
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const { data: courses } = useQuery('courses', () => courseService.fetch());

	const fetch = async (id: any) => {
		try {
			const data = await subjectService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setMode('Edit');
			setCourse(data.course!);
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
		} catch (error: any) {
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
					<h5 className='card-title'>{mode} Subject</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='code' className='required'>
									Subject Code
								</label>
								<input {...register('code')} type='text' id='code' className='form-control' disabled={processing} />
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='description' className='required'>
									Description
								</label>
								<input
									{...register('description')}
									type='text'
									id='description'
									className='form-control'
									disabled={processing}
								/>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='course_id' className='required'>
									Course Code
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
									{courses?.map((course, index) => (
										<option value={course.id} key={index}>
											{course.code}
										</option>
									))}
								</select>
							</div>
							{course && course.majors && course.majors.length > 0 ? (
								<div className='form-group col-12 col-md-6'>
									<label htmlFor='major_id' className='required'>
										Major
									</label>
									<select {...register('major_id')} id='major_id' className='form-control'>
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
								<label htmlFor='units' className='required'>
									Number of Units
								</label>
								<select {...register('units')} id='units' className='form-control'>
									<option value=''> -- Select -- </option>
									{[1, 2, 3, 4, 5, 6].map((unit, index) => (
										<option value={unit} key={index}>
											{unit}
										</option>
									))}
								</select>
							</div>
							<div className='form-group col-12 col-md-4'>
								<label htmlFor='term' className='required'>
									Term
								</label>
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
