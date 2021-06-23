import dayjs from 'dayjs';
import React, { createRef, FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { SubjectContract } from '../../Contracts/subject.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError } from '../../helpers';
import { useNullable } from '../../hooks';
import { State } from '../../Libraries/State';
import { courseService } from '../../Services/course.service';
import { gradeService } from '../../Services/grade.service';
import { subjectService } from '../../Services/subject.service';
import Table from '../Shared/Table';

type Props = {};

type Inputs = {
	student_id: number;
	subject_id: number;
	teacher_id: number;
	grade: number;
	status: string;
	year_id: number;
};

const View: FC<Props> = (props) => {
	const params = useParams<{ id: string }>();
	const id = params.id.toNumber();
	const history = useHistory();
	const [course, setCourse] = useNullable<CourseContract>();
	const [major, setMajor] = useNullable<MajorContract>();
	const addGradeModalRef = createRef<HTMLDivElement>();
	const [student, setStudent] = useNullable<number>();
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const [subject, setSubject] = useNullable<SubjectContract>();
	const [loading, setLoading] = useState(false);
	const { register, handleSubmit, reset } = useForm<Inputs>({
		defaultValues: {
			grade: 65,
		},
	});

	const user = State.getInstance().get<UserContract>('user');

	const submit = async (data: Inputs) => {
		if (addGradeModalRef.current) {
			$(addGradeModalRef.current).modal('hide');
		}
		try {
			data.student_id = student!;
			data.teacher_id = user!.id!;
			await gradeService.create(data);
			toastr.success('Grade added succesfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setStudent(null);
			reset();
		}
	};

	const refetch = async () => {
		setLoading(true);
		try {
			const subject = await subjectService.fetchOne(id);
			setSubject(subject);
			setLoading(false);
		} catch (error) {
			if (error?.response?.status === 404) {
				toastr.error('Subject does not exist.');
				setTimeout(() => history.goBack(), 1000);
			} else {
				handleError(error);
			}
		}
	};

	useEffect(() => {
		refetch();
		// eslint-disable-next-line
	}, []);

	if (!subject) {
		return null;
	}

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header'>
					<div className='d-flex'>
						<h2 className='card-title'>View Subject</h2>
						<button
							className='btn btn-secondary btn-sm'
							style={{ position: 'absolute', right: '10px' }}
							onClick={(e) => {
								e.preventDefault();
								history.goBack();
							}}>
							Go Back
						</button>
					</div>
					<p className='card-text mb-0'>Code: {subject.code}</p>
					<p className='card-text mb-0'>Description: {subject.description}</p>
					<p className='card-text'>
						Course: {`${subject.course?.code}${subject.major ? ` - Major in ${subject.major.name}` : ''}`}
					</p>
				</div>
				<div className='card-body'>
					<Table
						onRefresh={() => refetch()}
						title='Student List'
						loading={loading}
						items={
							subject.students
								?.filter((student) => {
									const admission = student.admissions?.find((admission) => admission.year?.current);

									if (!admission) {
										return false;
									}

									if (course && major) {
										return admission.course_id === course.id && admission.major_id === major.id;
									} else if (course) {
										return admission.course_id === course.id;
									} else if (major) {
										return admission.major_id === major.id;
									}

									return true;
								})
								.map((student) => ({
									...student,
									name: (
										<>
											{student.last_name}, {student.first_name} {student.middle_name || ''}
										</>
									),
									year: student.admissions?.filter((admission) => admission.year?.current)[0]?.level,
									course: `${student.admissions?.filter((admission) => admission.year?.current)[0]?.course?.code}${
										student.admissions?.filter((admission) => admission.year?.current)[0]?.major
											? ` - Major in ${
													student.admissions?.filter((admission) => admission.year?.current)[0]?.major?.name
											  }`
											: ''
									}`,
									birthday: dayjs(student.birthday).format('MMMM DD, YYYY'),
									age: new Date().getFullYear() - dayjs(student.birthday).year(),
									status: student.active ? (
										<span className='badge badge-success'>Confirmed</span>
									) : (
										<span className='badge badge-danger'>Unconfirmed</span>
									),
									actions: (
										<>
											<button
												className='btn btn-primary btn-sm mx-1'
												title='Add Grade'
												onClick={(e) => {
													e.preventDefault();
													if (addGradeModalRef.current) {
														setStudent(student.id!);
														$(addGradeModalRef.current).modal('toggle');
													}
												}}>
												<i className='fas fa-chart-bar'></i>
											</button>
										</>
									),
								})) || []
						}
						columns={[
							{
								title: 'ID Number',
								accessor: 'uuid',
							},
							{
								title: 'Name',
								accessor: 'name',
							},
							{
								title: 'Year',
								accessor: 'year',
							},
							{
								title: 'Course',
								accessor: 'course',
							},
							{
								title: 'Units Available',
								accessor: 'allowed_units',
							},
							{
								title: 'Status',
								accessor: 'status',
							},
							{
								title: 'Actions',
								accessor: 'actions',
							},
						]}
						misc={
							<>
								<label className='mb-0 mt-2 mx-1'>
									Course:
									<select
										className='custom-select custom-select-sm form-control form-control-sm'
										onChange={(e) => {
											const id = e.target.value.toNumber();
											if (id === 0) {
												setCourse(null);
												setMajor(null);
											} else {
												const course = courses?.find((course) => course.id === id);
												if (course) {
													setCourse(course);
												}
											}
										}}>
										<option value='0'>All</option>
										{courses?.map((course, index) => (
											<option value={course.id} key={index}>
												{course.code}
											</option>
										))}
									</select>
								</label>
								{course ? (
									<label className='mb-0 mt-2 mx-1'>
										Major:
										<select
											className='custom-select custom-select-sm form-control form-control-sm'
											onChange={(e) => {
												const id = e.target.value.toNumber();
												if (id === 0) {
													setMajor(null);
												} else {
													const major = course?.majors?.find((major) => major.id === id);
													if (major) {
														setMajor(major);
													}
												}
											}}>
											<option value='0'>All</option>
											{course.majors?.map((major, index) => (
												<option value={major.id} key={index}>
													{major.name}
												</option>
											))}
										</select>
									</label>
								) : null}
							</>
						}
					/>
					<div ref={addGradeModalRef} className='modal fade' tabIndex={-1}>
						<div className='modal-dialog modal-dialog-centered modal-lg'>
							<div className='modal-content'>
								<div className='modal-header'>
									<h5 className='modal-title'>Add Grade</h5>
									<button type='button' className='close' data-dismiss='modal'>
										<span aria-hidden='true'>&times;</span>
									</button>
								</div>
								<form onSubmit={handleSubmit(submit)}>
									<div className='modal-body'>
										<div className='form-group'>
											<label htmlFor='subject_id'>Subject</label>
											<select {...register('subject_id')} id='subject_id' className='form-control'>
												<option> -- Select -- </option>
												{subjects?.map((subject, index) => (
													<option value={subject.id} key={index}>
														{subject.code}
													</option>
												))}
											</select>
										</div>
										<div className='form-group'>
											<label htmlFor='grade'>Grade</label>
											<input
												{...register('grade')}
												type='number'
												id='grade'
												min={0}
												max={100}
												className='form-control'
											/>
										</div>
										<div className='form-group'>
											<label htmlFor='status'>Status</label>
											<input {...register('status')} type='text' id='status' className='form-control' />
										</div>
									</div>
									<div className='modal-footer'>
										<button type='submit' className='btn btn-primary btn-sm'>
											Submit
										</button>
										<button type='button' className='btn btn-secondary btn-sm' data-dismiss='modal'>
											Close
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default View;
