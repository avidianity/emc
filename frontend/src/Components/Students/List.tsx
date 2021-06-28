import axios from 'axios';
import dayjs from 'dayjs';
import React, { createRef, FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useCurrentYear, useNullable, useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { courseService } from '../../Services/course.service';
import { gradeService } from '../../Services/grade.service';
import { subjectService } from '../../Services/subject.service';
import { userService } from '../../Services/user.service';

import Table from '../Shared/Table';

type GradeContract = {
	student_id: number;
	subject_id: number;
	teacher_id: number;
	grade: number;
	status: string;
	year_id: number;
};

type UserInput = {
	payment_status: 'Not Paid' | 'Partially Paid' | 'Fully Paid';
};

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const [course, setCourse] = useNullable<CourseContract>();
	const [major, setMajor] = useNullable<MajorContract>();
	const {
		register: registerGrade,
		handleSubmit,
		reset,
	} = useForm<GradeContract>({
		defaultValues: {
			grade: 65,
		},
	});
	const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser, setValue: setValueUser } = useForm<UserInput>();
	const [student, setStudent] = useNullable<number>();
	const addGradeModalRef = createRef<HTMLDivElement>();
	const updatePaymentModalRef = createRef<HTMLDivElement>();
	const url = useURL();
	const { data: year } = useCurrentYear();
	const user = State.getInstance().get<UserContract>('user');
	const statuses = {
		'Not Paid': 'danger',
		'Fully Paid': 'success',
		'Partially Paid': 'warning',
	};

	if (isError) {
		handleError(error);
	}

	const evaluate = async () => {
		if (await Asker.notice('Are you sure you want to evaluate all students?', 'Notice')) {
			try {
				toastr.info('Processing students. Please wait.', 'Notice');
				const {
					data: { missing, failed, passed },
				} = await axios.post<{ missing: number; failed: number; passed: number }>('/admissions/increment');
				toastr.success(
					`Processing done. 
                    <br />Passed Students: ${passed}
                    <br />Failed Students: ${failed} 
                    <br />Subjects with missing grades: ${missing}`,
					'Success',
					{
						escapeHtml: false,
					}
				);
				refetch();
			} catch (error) {
				toastr.error('Unable to process students.');
				console.log(error);
			}
		}
	};

	const submitGrade = async (data: GradeContract) => {
		try {
			data.student_id = student!;
			data.teacher_id = user!.id!;
			await gradeService.create(data);
			toastr.success('Grade added succesfully.');
			refetch();
		} catch (error) {
			handleError(error);
		} finally {
			if (addGradeModalRef.current) {
				$(addGradeModalRef.current).modal('hide');
			}
			setStudent(null);
			reset();
		}
	};

	const submitUser = async (data: UserInput) => {
		try {
			await userService.update(student, data);
			toastr.success('Student payment updated succesfully.');
			refetch();
		} catch (error) {
			handleError(error);
		} finally {
			if (updatePaymentModalRef.current) {
				$(updatePaymentModalRef.current).modal('hide');
			}
			setStudent(null);
			resetUser();
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
			title: 'Section',
			accessor: 'section',
		},
		{
			title: 'Units Available',
			accessor: 'allowed_units',
		},
		{
			title: 'Payment Status',
			accessor: 'payment_status',
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
						?.filter((user) => user.role === 'Student' && user.active)
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
							year: student.admissions?.find((admission) => admission.year?.current)?.level,
							course: `${student.admissions?.find((admission) => admission.year?.current)?.course?.code}${
								student.admissions?.find((admission) => admission.year?.current)?.major
									? ` - Major in ${student.admissions?.find((admission) => admission.year?.current)?.major?.name}`
									: ''
							}`,
							birthday: dayjs(student.birthday).format('MMMM DD, YYYY'),
							age: new Date().getFullYear() - dayjs(student.birthday).year(),
							status: student.active ? (
								<span className='badge badge-success'>Confirmed</span>
							) : (
								<span className='badge badge-danger'>Unconfirmed</span>
							),
							payment_status: (
								<span className={`badge badge-${statuses[student.payment_status]}`}>{student.payment_status}</span>
							),
							section: <>{student.sections?.find((section) => section.year?.current)?.name}</>,
							actions: (
								<div style={{ minWidth: '150px' }}>
									{user?.role === 'Registrar' ? (
										<>
											<Link
												to={`/dashboard/admissions/${
													student.admissions?.find((admission) => admission?.year?.current)?.id
												}/edit`}
												className='btn btn-warning btn-sm mx-1'
												title='Edit'>
												<i className='fas fa-edit'></i>
											</Link>
											<button
												className='btn btn-info btn-sm mx-1'
												title='Update Payment'
												onClick={(e) => {
													e.preventDefault();
													if (updatePaymentModalRef.current) {
														setStudent(student.id!);
														setValueUser('payment_status', student.payment_status);
														$(updatePaymentModalRef.current).modal('toggle');
													}
												}}>
												<i className='fas fa-money-bill'></i>
											</button>
										</>
									) : null}
									{['Registrar', 'Admin'].includes(user?.role || '') ? (
										<Link
											to={url(`${student.id}/subjects`)}
											className='btn btn-primary btn-sm mx-1'
											title='Add Subjects'>
											<i className='fas fa-book'></i>
										</Link>
									) : null}
									{user?.role === 'Teacher' ? (
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
				buttons={
					<>
						{user?.role === 'Registrar' ? (
							<>
								<button
									className='btn btn-secondary btn-sm mx-1'
									title='Evaluate Students'
									onClick={(e) => {
										e.preventDefault();
										evaluate();
									}}>
									<i className='fas fa-chevron-up'></i>
								</button>
								<a
									href={`${axios.defaults.baseURL}/exports/registrar/classlist/course-and-major`}
									download
									className='btn btn-primary btn-sm mx-1'
									title='Download Classlist per Course and Major'>
									<i className='fas fa-file-excel'></i>
								</a>
								<a
									href={`${axios.defaults.baseURL}/exports/registrar/classlist/subject`}
									download
									className='btn btn-success btn-sm mx-1'
									title='Download Classlist per Subject'>
									<i className='fas fa-file-excel'></i>
								</a>
							</>
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
						<form onSubmit={handleSubmit(submitGrade)}>
							<div className='modal-body'>
								<input type='hidden' {...registerGrade('year_id')} value={year?.id} />
								<div className='form-group'>
									<label htmlFor='subject_id'>Subject</label>
									<select {...registerGrade('subject_id')} id='subject_id' className='form-control'>
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
										{...registerGrade('grade')}
										type='number'
										id='grade'
										min={0}
										max={100}
										className='form-control'
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='status'>Status</label>
									<input {...registerGrade('status')} type='text' id='status' className='form-control' />
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
			<div ref={updatePaymentModalRef} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Update Payment</h5>
							<button type='button' className='close' data-dismiss='modal'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<form onSubmit={handleSubmitUser(submitUser)}>
							<div className='modal-body'>
								<div className='form-group'>
									<label htmlFor='payment_status'>Payment Status</label>
									<select {...registerUser('payment_status')} id='subject_id' className='form-control'>
										<option value='Not Paid'>Not Paid</option>
										<option value='Partially Paid'>Partially Paid</option>
										<option value='Fully Paid'>Fully Paid</option>
									</select>
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
