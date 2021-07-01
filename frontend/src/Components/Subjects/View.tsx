import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { SubjectContract } from '../../Contracts/subject.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError } from '../../helpers';
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
	const params = useParams<{ id: string }>();
	const id = params.id.toNumber();
	const history = useHistory();
	const [studentID, setStudentID] = useNullable<number>();
	const [subject, setSubject] = useNullable<SubjectContract>();
	const [loading, setLoading] = useState(false);
	const [setGrade, setSetGrade] = useState(false);
	const [gradeAmount, setGradeAmount] = useState(0);
	const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
	const { data: year } = useCurrentYear();
	const user = State.getInstance().get<UserContract>('user');

	const submit = async (data: Inputs) => {
		try {
			data.student_id = studentID!;
			data.teacher_id = user!.id!;
			data.subject_id = subject?.id || id;
			data.grade = gradeAmount;
			await gradeService.create(data);
			toastr.success('Grade added succesfully.');
			refetch();
			setGradeAmount(0);
		} catch (error) {
			handleError(error);
		} finally {
			setStudentID(null);
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

	const findGrade = (student: UserContract) => student.grades?.find((grade) => grade.teacher_id === user?.id)?.grade;

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
							subject.students
								?.filter((student) => {
									const admission = student.admissions?.find((admission) => admission.year?.current);

									if (!admission) {
										return false;
									}

									return true;
								})
								.filter((student) => student.enrolled)
								.map((student) => ({
									...student,
									name: (
										<>
											{student.last_name}, {student.first_name} {student.middle_name || ''}
										</>
									),
									year: student.admissions?.filter((admission) => admission.year?.current)[0]?.level,
									actions: (
										<>
											{findGrade(student) || (
												<>
													{setGrade && student.id === studentID ? (
														<form
															className='form-inline'
															style={{ minWidth: '100px' }}
															onSubmit={handleSubmit(submit)}>
															<input type='hidden' {...register('year_id')} value={year?.id} />
															<input
																type='number'
																id='grade'
																min={0}
																max={100}
																className='form-control form-control-sm mx-1'
																onChange={(e) => {
																	const grade = e.target.value.toNumber();
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
															/>
															<input {...register('status')} type='hidden' />
															<button type='submit' className='btn btn-primary btn-sm mx-1'>
																Submit
															</button>
															<button
																type='button'
																className='btn btn-secondary btn-sm mx-1'
																onClick={(e) => {
																	e.preventDefault();
																	setSetGrade(false);
																	setStudentID(null);
																}}>
																Cancel
															</button>
														</form>
													) : (
														<span
															onClick={() => {
																setSetGrade(!setGrade);
																setStudentID(student.id!);
															}}
															className='clickable d-block'>
															-
														</span>
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
								title: 'Actions',
								accessor: 'actions',
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
};

export default View;
