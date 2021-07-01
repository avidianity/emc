import dayjs from 'dayjs';
import React, { createRef, FC } from 'react';
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
	const addGradeModalRef = createRef<HTMLDivElement>();
	const [student, setStudent] = useNullable<number>();
	const [subject, setSubject] = useNullable<SubjectContract>();
	const [loading, setLoading] = useState(false);
	const { register, handleSubmit, reset, setValue } = useForm<Inputs>({
		defaultValues: {
			grade: 65,
		},
	});
	const { data: year } = useCurrentYear();
	const user = State.getInstance().get<UserContract>('user');

	const submit = async (data: Inputs) => {
		if (addGradeModalRef.current) {
			$(addGradeModalRef.current).modal('hide');
		}
		try {
			data.student_id = student!;
			data.teacher_id = user!.id!;
			data.subject_id = subject?.id || id;
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
								title: 'Actions',
								accessor: 'actions',
							},
						]}
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
									<input type='hidden' {...register('year_id')} value={year?.id} />
									<div className='modal-body'>
										<div className='form-group'>
											<label htmlFor='grade'>Grade</label>
											<input
												{...register('grade')}
												type='number'
												id='grade'
												min={0}
												max={100}
												className='form-control'
												onChange={(e) => {
													const grade = e.target.value.toNumber();
													if (grade >= 75) {
														setValue('status', 'Passed');
													} else {
														setValue('status', 'Failed');
													}
												}}
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
