import dayjs from 'dayjs';
import React, { createRef, FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useNullable, useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { courseService } from '../../Services/course.service';
import { gradeService } from '../../Services/grade.service';
import { subjectService } from '../../Services/subject.service';
import { userService } from '../../Services/user.service';
import { yearService } from '../../Services/year.service';

import Table from '../Shared/Table';

type GradeContract = {
	student_id: number;
	subject_id: number;
	teacher_id: number;
	grade: number;
	status: string;
	year_id: number;
};

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());
	const { data: years } = useQuery('years', () => yearService.fetch());
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const [course, setCourse] = useNullable<CourseContract>();
	const [major, setMajor] = useNullable<MajorContract>();
	const { register, handleSubmit, reset } = useForm<GradeContract>({
		defaultValues: {
			grade: 65,
		},
	});
	const [student, setStudent] = useNullable<number>();
	const addGradeModalRef = createRef<HTMLDivElement>();
	const url = useURL();
	const user = State.getInstance().get<UserContract>('user');

	if (isError) {
		handleError(error);
	}

	const submit = async (data: GradeContract) => {
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

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Student?')) {
				await userService.delete(id);
				toastr.info('Student has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const columns = [
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
			title: 'Status',
			accessor: 'status',
		},
	];

	if (['Registrar', 'Teacher'].includes(user?.role || '')) {
		columns.push({ title: 'Actions', accessor: 'actions' });
	}

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Students'
				loading={loading}
				items={
					items
						?.filter((user) => user.role === 'Student')
						.filter((student) => {
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
									? ` - Major in ${student.admissions?.filter((admission) => admission.year?.current)[0]?.major?.name}`
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
								<div style={{ minWidth: '100px' }}>
									{user?.role === 'Registrar' ? (
										<>
											<Link
												to={`/dashboard/admissions/${student.admissions?.last()?.id}/edit`}
												className='btn btn-warning btn-sm mx-1'
												title='Edit'>
												<i className='fas fa-edit'></i>
											</Link>
											<Link
												to={url(`${student.id}/subjects`)}
												className='btn btn-primary btn-sm mx-1'
												title='Add Subjects'>
												<i className='fas fa-book'></i>
											</Link>
										</>
									) : null}
									{user?.role === 'Teacher' ? (
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
									) : null}
									<button
										className='btn btn-danger btn-sm mx-1 d-none'
										onClick={(e) => {
											e.preventDefault();
											deleteItem(student.id);
										}}>
										<i className='fas fa-trash'></i>
									</button>
								</div>
							),
						})) || []
				}
				columns={columns}
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
								<input type='hidden' {...register('year_id')} value={years?.filter((year) => year.current)[0]?.id} />
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
									<input {...register('grade')} type='number' id='grade' min={0} max={100} className='form-control' />
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
		</>
	);
};

export default List;
