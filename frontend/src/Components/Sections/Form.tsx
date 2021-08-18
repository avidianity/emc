import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { RouteComponentProps, useHistory, useRouteMatch } from 'react-router';
import { CourseContract } from '../../Contracts/course.contract';
import { Asker, handleError, outIf, setValues, toBool } from '../../helpers';
import { useCurrentYear, useMode, useNullable } from '../../hooks';
import { courseService } from '../../Services/course.service';
import { sectionService } from '../../Services/section.service';

interface Props extends RouteComponentProps {
	type: 'Normal' | 'Advance';
}

type SectionContract = {
	name: string;
	level: string;
	term: string;
	course_id: number;
	major_id?: number;
	year_id?: number;
	limit: number;
	force: boolean;
};

const Form: FC<Props> = ({ type }) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<SectionContract>({
		defaultValues: {
			limit: 25,
			force: false,
		},
	});
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const [course, setCourse] = useNullable<CourseContract>();
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const { data: year } = useCurrentYear();

	const fetch = async (id: any) => {
		try {
			const data = await sectionService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);

			if (data.course) {
				setCourse(data.course);
			}

			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: SectionContract) => {
		if ((course?.majors?.length || 0) > 0 && !data.major_id) {
			return toastr.error('Please pick a major.');
		}
		setProcessing(true);
		try {
			if (type === 'Normal') {
				data.year_id = year?.id;
				await (mode === 'Add' ? sectionService.create(data) : sectionService.update(id, data));
			} else {
				await axios.post('/sections/advance', data);
			}

			toastr.success('Section has been saved successfully.');
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
					<h5 className='card-title'>
						{mode}
						{type === 'Advance' ? ' Advance' : ''} School Section
					</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-row'>
							<div className='form-group col-12 col-md-6 col-lg-4'>
								<label htmlFor='name' className='required'>
									Name
								</label>
								<input {...register('name')} type='text' id='name' className='form-control' disabled={processing} />
							</div>
							<div className='form-group col-12 col-md-6 col-lg-4'>
								<label htmlFor='level' className='required'>
									Year Level
								</label>
								<select {...register('level')} id='level' className='form-control' disabled={processing}>
									<option value=''> -- Select -- </option>
									<option value='1st'>1st</option>
									<option value='2nd'>2nd</option>
									<option value='3rd'>3rd</option>
									<option value='4th'>4th</option>
									<option value='5th'>5th</option>
								</select>
							</div>
							<div className='form-group col-12 col-md-6 col-lg-4'>
								<label htmlFor='term' className='required'>
									Semester
								</label>
								<select {...register('term')} id='term' className='form-control' disabled={processing}>
									<option value=''> -- Select -- </option>
									<option value='1st Semester'>1st Semester</option>
									<option value='2nd Semester'>2nd Semester</option>
									<option value='Summer'>Summer</option>
								</select>
							</div>
							<div className='form-group col-12 col-md-6'>
								<label htmlFor='course_id' className='required'>
									Course
								</label>
								<select
									{...register('course_id')}
									id='course_id'
									className='form-control'
									disabled={processing}
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
									<select {...register('major_id')} id='major_id' className='form-control' disabled={processing}>
										<option value=''> -- Select -- </option>
										{course.majors?.map((major, index) => (
											<option value={major.id} key={index}>
												{major.name}
											</option>
										))}
									</select>
								</div>
							) : null}
							<div
								className={`form-group col-12 ${outIf(
									toBool(!course || (course && course.majors && course.majors.length === 0)),
									'col-md-6'
								)}`}>
								<label htmlFor='limit' className='required'>
									Limit
								</label>
								<input {...register('limit')} type='text' id='limit' className='form-control' disabled={processing} />
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
