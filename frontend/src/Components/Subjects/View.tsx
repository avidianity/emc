import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { Asker, findSection, handleError, isBehind } from '../../helpers';
import { useCurrentYear, useNullable } from '../../hooks';
import { State } from '../../Libraries/State';
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
	const [processing, setProcessing] = useState(false);
	const params = useParams<{ id: string }>();
	const id = params.id.toNumber();
	const history = useHistory();
	const [studentID, setStudentID] = useNullable<number>();
	const { data: subject, isLoading: loading, isError, error, refetch } = useQuery(['subjects', id], () => subjectService.fetchOne(id));
	const [setGrade, setSetGrade] = useState(false);
	const [gradeAmount, setGradeAmount] = useState(0);
	const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
	const { data: year } = useCurrentYear();
	const user = State.getInstance().get<UserContract>('user');

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.student_id = studentID!;
			data.teacher_id = user?.id!;
			data.subject_id = subject?.id || id;
			data.grade = gradeAmount;
			data.status = gradeAmount >= 75 ? 'Passed' : 'Failed';
			await gradeService.create(data);
			await refetch();
			toastr.success('Grade saved succesfully.');
			setGradeAmount(0);
		} catch (error) {
			handleError(error);
		} finally {
			setStudentID(null);
			reset();
			setProcessing(false);
		}
	};

	if (isError && (error as AxiosError)?.response?.status === 404) {
		toastr.error('Subject does not exist.');
		history.goBack();
	}

	const findGrade = (student: UserContract, current = true) => {
		return student.grades?.find(
			(grade) => grade.teacher_id === user?.id && grade.year?.current === current && grade.subject_id === subject?.id
		);
	};

	useEffect(() => {
		refetch();
		// eslint-disable-next-line
	}, []);

	if (!subject || !year) {
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
					<p className='card-text mb-0'>
						Course: {`${subject.course?.code}${subject.major ? ` - Major in ${subject.major.name}` : ''}`}
					</p>
					<p className='card-text'>
						Grade Encoding Deadline: {dayjs(year?.grade_start).format('MMMM DD, YYYY hh:mm A')} -{' '}
						{dayjs(year?.grade_end).format('MMMM DD, YYYY hh:mm A')}
					</p>
				</div>
				<div className='card-body'>
					<h4 className='mb-0 mt-3'>Schedule</h4>
					<table className='table table-bordered table-sm mb-5'>
						<thead>
							<tr>
								<th className='text-center'>Day</th>
								<th className='text-center'>Start Time</th>
								<th className='text-center'>End Time</th>
							</tr>
						</thead>
						<tbody>
							{subject.schedules
								?.find((schedule) => schedule.teacher_id === user?.id)
								?.payload.map((row, index) => (
									<tr key={index}>
										<td className='text-center'>{row.day}</td>
										<td className='text-center'>{dayjs(row.start_time!).format('hh:mm A')}</td>
										<td className='text-center'>{dayjs(row.end_time!).format('hh:mm A')}</td>
									</tr>
								))}
						</tbody>
					</table>
					<Table
						onRefresh={() => refetch()}
						title='Student List'
						loading={loading}
						items={
							subject.students?.map((student) => ({
								...student,
								name: (
									<>
										{student.last_name}, {student.first_name} {student.middle_name || ''}
									</>
								),
								year: !isBehind(student)
									? student.admissions?.find((admission) => admission.year?.current)?.level
									: student.admissions?.last()?.level,
								semester: !isBehind(student)
									? student.admissions?.find((admission) => admission.year?.current)?.term
									: student.admissions?.last()?.term,
								section: findSection(student)?.name,
								actions: (
									<>
										{findGrade(student, !isBehind(student)) && !setGrade ? (
											<span
												onClick={async () => {
													if (!isBehind(student)) {
														const now = dayjs();
														const start = dayjs(year.grade_start);
														const end = dayjs(year.grade_end);
														if (now.isBefore(start)) {
															await Asker.okay(
																`Encoding of grades will start at ${start.format(
																	'MMMM DD, YYYY hh:mm A'
																)}. Please wait until the given date.`,
																'Notice'
															);
															return history.goBack();
														}
														if (now.isAfter(end)) {
															await Asker.okay(`Encoding of grades has already ended.`, 'Notice');
															return history.goBack();
														}
													}
													const grade = findGrade(student, !isBehind(student));
													if (grade) {
														if (grade.grade >= 75) {
															setValue('status', 'Passed');
														} else {
															setValue('status', 'Failed');
														}
														setGradeAmount(grade.grade);
													}
													setSetGrade(true);
													setStudentID(student.id!);
												}}
												className='clickable'>
												{findGrade(student, !isBehind(student))?.grade}%
											</span>
										) : (
											<>
												{setGrade && student.id === studentID ? (
													<form
														className='form-inline row'
														style={{ minWidth: '100px' }}
														onSubmit={handleSubmit(submit)}>
														<input
															type='hidden'
															{...register('year_id')}
															value={!isBehind(student) ? year?.id : student.admissions?.last()?.year_id}
														/>
														<input {...register('status')} type='hidden' />
														<div className='col-4'>
															<input
																type='number'
																id='grade'
																min={0}
																max={100}
																step='.01'
																className='form-control form-control-sm'
																onChange={(e) => {
																	const grade = Math.round(e.target.value.toNumber());
																	if (grade >= 0 && grade <= 100) {
																		if (grade >= 75) {
																			setValue('status', 'Passed');
																		} else {
																			setValue('status', 'Failed');
																		}
																		setGradeAmount(grade);
																	}
																}}
																value={gradeAmount}
																disabled={processing}
															/>
														</div>
														<div className='col-4'>
															<button type='submit' className='btn btn-primary btn-sm' disabled={processing}>
																Submit
															</button>
														</div>
														<div className='col-4'>
															<button
																type='button'
																className='btn btn-secondary btn-sm'
																onClick={(e) => {
																	e.preventDefault();
																	setSetGrade(false);
																	setStudentID(null);
																}}
																disabled={processing}>
																Cancel
															</button>
														</div>
													</form>
												) : (
													<>
														{findGrade(student, !isBehind(student)) ? (
															<span
																onClick={async () => {
																	if (!isBehind(student)) {
																		const now = dayjs();
																		const start = dayjs(year.grade_start);
																		const end = dayjs(year.grade_end);
																		if (now.isBefore(start)) {
																			await Asker.okay(
																				`Encoding of grades will start at ${start.format(
																					'MMMM DD, YYYY hh:mm A'
																				)}. Please wait until the given date.`,
																				'Notice'
																			);
																			return history.goBack();
																		}
																		if (now.isAfter(end)) {
																			await Asker.okay(
																				`Encoding of grades has already ended.`,
																				'Notice'
																			);
																			return history.goBack();
																		}
																	}
																	const grade = findGrade(student, !isBehind(student));
																	if (grade) {
																		if (grade.grade >= 75) {
																			setValue('status', 'Passed');
																		} else {
																			setValue('status', 'Failed');
																		}
																		setGradeAmount(grade.grade);
																	}
																	setSetGrade(true);
																	setStudentID(student.id!);
																}}
																className='clickable'>
																{findGrade(student, !isBehind(student))?.grade}%
															</span>
														) : (
															<span
																onClick={async () => {
																	if (!isBehind(student)) {
																		const now = dayjs();
																		const start = dayjs(year.grade_start);
																		const end = dayjs(year.grade_end);
																		if (now.isBefore(start)) {
																			await Asker.okay(
																				`Encoding of grades will start at ${start.format(
																					'MMMM DD, YYYY hh:mm A'
																				)}. Please wait until the given date.`,
																				'Notice'
																			);
																			return history.goBack();
																		}
																		if (now.isAfter(end)) {
																			await Asker.okay(
																				`Encoding of grades has already ended.`,
																				'Notice'
																			);
																			return history.goBack();
																		}
																	}
																	setSetGrade(true);
																	setStudentID(student.id!);
																}}
																className='clickable d-block'>
																-
															</span>
														)}
													</>
												)}
											</>
										)}
									</>
								),
							})) || []
						}
						columns={[
							{
								title: 'ID Number',
								accessor: 'uuid',
								minWidth: '200px',
							},
							{
								title: 'Name',
								accessor: 'name',
								minWidth: '150px',
							},
							{
								title: 'Year',
								accessor: 'year',
								minWidth: '150px',
							},
							{
								title: 'Semester',
								accessor: 'semester',
								minWidth: '150px',
							},
							{
								title: 'Section',
								accessor: 'section',
								minWidth: '150px',
							},
							{
								title: 'Actions',
								accessor: 'actions',
								minWidth: '300px',
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
};

export default View;
