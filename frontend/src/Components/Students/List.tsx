import axios from 'axios';
import dayjs from 'dayjs';
import React, { createRef, FC, useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import { v4 } from 'uuid';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { UserContract } from '../../Contracts/user.contract';
import { YearContract } from '../../Contracts/year.contract';
import { handleError, Asker, isBehind, findSection } from '../../helpers';
import { useCurrentYear, useNullable } from '../../hooks';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';
import { courseService } from '../../Services/course.service';
import { gradeService } from '../../Services/grade.service';
import { subjectService } from '../../Services/subject.service';
import { userService } from '../../Services/user.service';
import { yearService } from '../../Services/year.service';
import Flatpickr from 'react-flatpickr';
import Table, { TableColumn } from '../Shared/Table';
import { statuses } from '../../constants';
import Tooltip from '../Shared/Tooltip';
import Loader from '../Shared/Loader';
import swal from 'sweetalert';

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

interface Props extends RouteComponentProps {
	type: 'Old' | 'New' | 'Behind';
}

const incrementModalRef = v4();
const updatePaymentModalRef = v4();

const List: FC<Props> = ({ type }) => {
	const [loader, setLoader] = useNullable<JQuery<HTMLDivElement>>();
	const [processing, setProcessing] = useState(false);
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
	const { data: year } = useCurrentYear();
	const [semesterStart, setSemesterStart] = useNullable<Date>();
	const [semesterEnd, setSemesterEnd] = useNullable<Date>();
	const [registrationStart, setRegistrationStart] = useNullable<Date>();
	const [registrationEnd, setRegistrationEnd] = useNullable<Date>();
	const [gradeStart, setGradeStart] = useNullable<Date>();
	const [gradeEnd, setGradeEnd] = useNullable<Date>();
	const {
		register,
		handleSubmit: handleSubmitYear,
		reset: yearReset,
	} = useForm<YearContract>({
		defaultValues: {
			start: new Date().getFullYear(),
			end: new Date().getFullYear() + 1,
			current: true,
		},
	});
	const loaderRef = createRef<HTMLDivElement>();

	const user = State.getInstance().get<UserContract>('user');

	if (isError) {
		handleError(error);
	}

	const submitYear = async (data: YearContract) => {
		if (await Asker.notice('Are you sure you want to evaluate all students into a new school year?', 'Notice')) {
			setProcessing(true);
			try {
				data.semester_start = semesterStart?.toJSON() || '';
				data.semester_end = semesterEnd?.toJSON() || '';
				data.registration_start = registrationStart?.toJSON() || '';
				data.registration_end = registrationEnd?.toJSON() || '';
				data.grade_start = gradeStart?.toJSON() || '';
				data.grade_end = gradeEnd?.toJSON() || '';
				data.current = true;
				$(`#${incrementModalRef}`).modal('hide');
				await yearService.create(data);
				await evaluate();
				reset();
			} catch (error) {
				handleError(error);
			} finally {
				setProcessing(false);
			}
		}
	};

	const evaluate = async () => {
		try {
			loader?.modal('show');
			const {
				data: { missing, failed, passed },
			} = await axios.post<{ missing: number; failed: number; passed: number }>('/admissions/increment');

			loader?.modal('hide');
			await swal({
				icon: 'success',
				title: 'Success!',
				content: {
					element: ((passedCount, failedCount, missingCount) => {
						const div = document.createElement('div');

						const passed = document.createElement('p');

						passed.innerText = `Passed Students: ${passedCount}`;

						const failed = document.createElement('p');

						failed.innerText = `Failed Students: ${failedCount}`;

						const missing = document.createElement('p');

						missing.innerText = `Subjects with missing grades: ${missingCount}`;

						div.append(passed, failed, missing);

						return div;
					})(passed, failed, missing),
				},
			});
			refetch();
		} catch (error) {
			Asker.error('Unable to process students.', 'Oops!');
			console.log(error);
		} finally {
			loader?.modal('hide');
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
			$(`#${updatePaymentModalRef}`).modal('hide');
			setStudent(null);
			resetUser();
		}
	};

	const findAdmission = (student: UserContract) => {
		const admission = student.admissions?.find((admission) => admission.year?.current);
		if (admission) {
			return admission;
		}

		return student.admissions?.last();
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

	const reincrement = async (student: UserContract) => {
		try {
			await axios.post(`/users/${student.id}/reincrement`);
			toastr.success('Student reincremented successfully.');
			await refetch();
		} catch (error) {
			handleError(error);
		}
	};

	const columns: TableColumn[] = [
		{
			title: 'ID Number',
			accessor: 'uuid',
			minWidth: '160px',
		},
		{
			title: 'Name',
			accessor: 'name',
			minWidth: '200px',
		},
		{
			title: 'Year',
			accessor: 'year',
		},
		{
			title: 'Semester',
			accessor: 'semester',
			minWidth: '150px',
		},
		{
			title: 'Course',
			accessor: 'course_name',
			minWidth: '375px',
		},
		{
			title: 'Section',
			accessor: 'section',
			minWidth: '200px',
		},
		{
			title: 'Units Available',
			accessor: 'allowed_units',
			minWidth: '150px',
		},
		{
			title: 'Payment Status',
			accessor: 'payment_status',
			minWidth: '150px',
		},
		{
			title: 'Status',
			accessor: 'status',
		},
	];

	if (['Registrar', 'Teacher', 'Admin'].includes(user?.role || '')) {
		columns.push({
			title: 'Actions',
			minWidth: '180px',
			cell: (student: UserContract) => (
				<>
					{user?.role === 'Registrar' ? (
						<>
							<Link
								to={`/dashboard/admissions/${student.admissions?.find((admission) => admission?.year?.current)?.id}/edit`}
								className='btn btn-warning btn-sm mx-1'
								data-tip='Edit'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-info btn-sm mx-1'
								data-tip='Update Payment'
								onClick={(e) => {
									e.preventDefault();
									const modal = $(`#${updatePaymentModalRef}`);
									if (modal.length > 0) {
										setStudent(student.id!);
										setValueUser('payment_status', student.payment_status);
										modal.modal('toggle');
									}
								}}>
								<i className='fas fa-money-bill'></i>
							</button>
							{isBehind(student) ? (
								<button
									className='btn btn-primary btn-sm'
									data-tip='Re-Increment Student'
									onClick={async (e) => {
										e.preventDefault();
										if (await Asker.notice('Are you sure to reincrement this student?')) {
											await reincrement(student);
										}
									}}>
									<i className='fas fa-university'></i>
								</button>
							) : null}
						</>
					) : null}
					{['Registrar', 'Admin'].includes(user?.role || '') && !isBehind(student) ? (
						<Link
							to={`${routes.DASHBOARD}${routes.STUDENTS}/${student.id}/subjects`}
							className='btn btn-primary btn-sm mx-1'
							data-tip='Add Subjects'>
							<i className='fas fa-book'></i>
						</Link>
					) : null}
					{user?.role === 'Teacher' ? (
						<>
							<button
								className='btn btn-primary btn-sm mx-1'
								data-tip='Add Grade'
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
						}}
						data-tip='Delete'>
						<i className='fas fa-trash'></i>
					</button>
				</>
			),
		});
	}

	useEffect(() => {
		if (loaderRef.current && !loader) {
			setLoader($(loaderRef.current));
		}
	}, [loaderRef, loader, setLoader]);

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title={`${type} Students`}
				loading={loading}
				items={
					items
						?.filter((user) => user.role === 'Student' && user.active)
						.filter((student) => {
							if (type !== 'Behind') {
								return student.type === type && !isBehind(student);
							} else {
								return isBehind(student);
							}
						})
						.filter((student) => {
							const admission = student.admissions?.find((admission) => admission.year?.current);

							if (admission) {
								if (course && major) {
									return admission.course_id === course.id && admission.major_id === major.id;
								} else if (course) {
									return admission.course_id === course.id;
								} else if (major) {
									return admission.major_id === major.id;
								}
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
							year: findAdmission(student)?.level,
							course_name: `${findAdmission(student)?.course?.code || ''}${
								findAdmission(student)?.major ? ` - Major in ${findAdmission(student)?.major?.name || 'N/A'}` : ''
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
							section: <>{findSection(student)?.name}</>,
							semester: findAdmission(student)?.year?.semester,
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
								{type !== 'Behind' ? (
									<button
										className='btn btn-secondary btn-sm mx-1'
										data-tip='Evaluate Students'
										onClick={(e) => {
											e.preventDefault();
											$(`#${incrementModalRef}`).modal('show');
										}}>
										<i className='fas fa-chevron-up'></i>
									</button>
								) : null}
								<a
									href={`${axios.defaults.baseURL}/exports/registrar/classlist/regular-and-irregular`}
									download
									className='btn btn-warning btn-sm mx-1'
									data-tip='Download Classlist per Regular and Irregular Student'>
									<i className='fas fa-file-excel'></i>
								</a>
								<a
									href={`${axios.defaults.baseURL}/exports/registrar/classlist/course-and-major`}
									download
									className='btn btn-primary btn-sm mx-1'
									data-tip='Download Classlist per Course and Major'>
									<i className='fas fa-file-excel'></i>
								</a>
								<a
									href={`${axios.defaults.baseURL}/exports/registrar/classlist/subject`}
									download
									className='btn btn-success btn-sm mx-1'
									data-tip='Download Classlist per Subject'>
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
			<div id={updatePaymentModalRef} className='modal fade' tabIndex={-1}>
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
			<div id={incrementModalRef} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content'>
						<form onSubmit={handleSubmitYear(submitYear)}>
							<div className='modal-header'>
								<h5 className='modal-title'>Increment to new School Year</h5>
								<button
									type='button'
									className='close'
									onClick={(e) => {
										e.preventDefault();
										$(`#${incrementModalRef}`).modal('hide');
										yearReset();
									}}>
									<span>&times;</span>
								</button>
							</div>
							<div className='modal-body'>
								<div className='mb-3'>
									<p>
										Current Year: {year?.start} - {year?.end}
									</p>
									<p>Current Semester: {year?.semester}</p>
								</div>
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
											options={{
												altInput: true,
												minDate: dayjs().add(1, 'week').toDate(),
											}}
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
											options={{
												altInput: true,
												minDate: dayjs().add(1, 'week').toDate(),
											}}
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
											options={{
												minDate: dayjs(new Date()).add(1, 'week').toDate(),
												altInput: true,
											}}
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
											options={{
												minDate: dayjs(registrationStart || new Date())
													.add(1, 'week')
													.toDate(),
												altInput: true,
											}}
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
												minDate: dayjs().add(1, 'week').toDate(),
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
												minDate: dayjs().add(1, 'week').toDate(),
											}}
										/>
									</div>
								</div>
							</div>
							<div className='modal-footer d-flex'>
								<button
									type='button'
									className='btn btn-secondary'
									onClick={(e) => {
										e.preventDefault();
										$(`#${incrementModalRef}`).modal('hide');
										yearReset();
									}}
									disabled={processing}>
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
			<Loader ref={loaderRef} />
			<Tooltip />
		</>
	);
};

export default List;
