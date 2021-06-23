import axios from 'axios';
import { trim } from 'lodash';
import React, { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { UserContract } from '../../Contracts/user.contract';
import { handleError } from '../../helpers';
import { useArray } from '../../hooks';
import { State } from '../../Libraries/State';
import { subjectService } from '../../Services/subject.service';
import { userService } from '../../Services/user.service';

type Props = {};

const Subjects: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const [enrolled, setEnrolled] = useArray<number>();
	const {
		data: student,
		error,
		isError,
	} = useQuery(['users', id], () => userService.fetchOne(id), {
		onSuccess(student) {
			setEnrolled(student.subjects?.map(({ id }) => id!)!);
		},
	});
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const admission = student?.admissions?.find((admission) => admission.year?.current);
	const user = State.getInstance().get<UserContract>('user');

	const submit = async () => {
		setProcessing(true);
		try {
			await axios.post(`/users/${student?.id}/subjects`, {
				subjects: enrolled,
			});
			toastr.success('Subjects enrolled successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	if (isError) {
		handleError(error);
		history.goBack();
		return null;
	}

	if (!student || !admission) {
		return (
			<div className='container'>
				<div className='text-center'>
					<i className='fas fa-circle-notch fa-spin'></i>
				</div>
			</div>
		);
	}

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-header'>
					<h4 className='card-title'>Student Subjects</h4>
					<p className='card-text'>
						{student.last_name}, {student.first_name} {student.middle_name || ''}
					</p>
					<p className='card-text'>
						School Year: {admission?.year?.start} - {admission?.year?.end}
					</p>
					<small className='form-text text-muted'>
						Subjects with{' '}
						<sup>
							<i>
								<i className='fas fa-check'></i>
							</i>
						</sup>{' '}
						are enrolled.
					</small>
					{user?.role === 'Admin' ? (
						<small className='form-text text-muted'>
							Subjects are overrideable even if student has lesser allowed units than the subjects provided.
						</small>
					) : null}
				</div>
				<div className='card-body'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}>
						<div className='form-row'>
							{subjects
								?.filter(
									(subject) =>
										subject.level === admission.level &&
										subject.term === admission.term &&
										subject.course_id === admission.course_id
								)
								.map((subject, index) => (
									<div className='form-group col-12 col-md-4 col-lg-3' key={index}>
										<div className='custom-control custom-checkbox'>
											<input
												type='checkbox'
												className='custom-control-input'
												id={trim(`${subject.code}-${subject.id}`)}
												disabled={processing}
												checked={enrolled.includes(subject.id!)}
												onChange={(e) => {
													const id = e.target.value.toNumber();
													if (enrolled.includes(id)) {
														const index = enrolled.findIndex((number) => number === id);
														enrolled.splice(index, 1);
													} else {
														enrolled.push(id);
													}
													setEnrolled([...enrolled]);
												}}
												value={subject.id}
											/>
											<label className='custom-control-label' htmlFor={trim(`${subject.code}-${subject.id}`)}>
												{subject.code} - {subject.description}{' '}
												<sup>
													<i>
														{student.subjects?.find((sub) => sub.id === subject.id) ? (
															<i className='fas fa-check'></i>
														) : null}
													</i>
												</sup>
											</label>
										</div>
									</div>
								))}
						</div>
						<div className='form-group'>
							<button type='submit' className='btn btn-primary btn-sm' disabled={processing}>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Subjects;
