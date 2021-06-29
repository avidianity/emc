import axios from 'axios';
import React, { createRef, FC, useState } from 'react';
import { useQuery } from 'react-query';
import { UserContract } from '../../../Contracts/user.contract';
import { Asker, handleError } from '../../../helpers';
import { useArray, useCurrentYear } from '../../../hooks';
import { State } from '../../../Libraries/State';
import { subjectService } from '../../../Services/subject.service';
import { userService } from '../../../Services/user.service';

type Props = {};

const Enrollment: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [print, setPrint] = useState(false);
	const state = State.getInstance();
	const temp = state.get<UserContract>('user');
	const [selected, setSelected] = useArray<number>();
	const [enrolled, setEnrolled] = useArray<number>();
	const { data: user, refetch: refetchUser } = useQuery(['user', temp?.id], () => userService.fetchOne(temp?.id), {
		onSuccess(user) {
			if (!user.active) {
				toastr.info('Your account is currently inactive. Please settle your payment to be reactivated by the registrar.');
			}
			setEnrolled(user.subjects?.map((subject) => subject.id!)!);
		},
	});
	const ref = createRef<HTMLDivElement>();
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const [selectAll, setSelectAll] = useState(false);
	const { data: year } = useCurrentYear();

	const add = (value: number) => {
		selected.push(value);
		setSelected([...selected]);
	};

	const remove = (value: number) => {
		const index = selected.findIndex((number) => number === value);
		selected.splice(index, 1);
		setSelected([...selected]);
	};

	const admission = user?.admissions?.find((admission) => admission.year?.current);

	const submit = async () => {
		if (!user?.active) {
			return;
		}
		setProcessing(true);
		try {
			if (await Asker.notice("If you continue you can't edit the selected subjects.")) {
				await axios.post(`/users/${user?.id}/subjects`, {
					subjects: selected,
				});
				toastr.success('Subjects enrolled successfully.');
				await refetchUser();
				state.set('user', user);
			}
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	if (!user || !admission) {
		return null;
	}

	if (!user.active) {
		return null;
	}

	if (user.enrolled && !print) {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-12'>
						<div className='card'>
							<div className='card-header'>
								<p className='card-title'>
									{user.last_name}, {user.first_name} {user.middle_name || ''} ({user.uuid})
								</p>
								<p className='card-text'>
									Registration (S.Y {year?.start} - {year?.end} - {year?.semester})
								</p>
							</div>
							<div className='card-body'>
								<div className='container'>
									<div className='row'>
										<div className='col-12 col-md-6 p-2'>
											<div className='border rounded shadow p-2'>
												<b>Status: </b> {admission.status} ({user.allowed_units} Units Allowed)
											</div>
										</div>
										<div className='col-12 col-md-6 p-2'>
											<div className='border rounded shadow p-2'>
												<b>Section: </b> {user.sections?.find((section) => section.year?.current)?.name}
											</div>
										</div>
										<div className='col-12 mt-4 text-center'>
											<h2>
												<i className='fas fa-check-circle'></i> You are officially enrolled
											</h2>
											<button
												className='btn btn-danger'
												onClick={(e) => {
													e.preventDefault();
													$('#leftSidebar').addClass('d-none');
													$('.topnav').addClass('d-none');
													$('input').addClass('d-none');
													$('button').addClass('d-none');
													setPrint(true);
													setTimeout(() => {
														window.print();
														$('#leftSidebar').removeClass('d-none');
														$('.topnav').removeClass('d-none');
														$('input').removeClass('d-none');
														$('button').removeClass('d-none');
														setPrint(false);
													}, 100);
												}}
												disabled={processing || !user.enrolled}>
												<i className='fas fa-scroll'></i>
												Certificate of Registration
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div ref={ref} className='container'>
			<div className='row'>
				<div className='col-12 col-md-8 offset-md-2 text-center'>
					<h4>EASTERN MINDORO COLLEGE</h4>
					<p>Bongabong, Oriental Mindoro</p>
					<h6>College Enrollment Slip</h6>
					<p className='mb-0' style={{ fontSize: '1.5rem' }}>
						{admission?.course?.description}
					</p>
					{admission?.major ? <p style={{ fontSize: '1.15rem' }}>Major in {admission.major.name}</p> : null}
				</div>
			</div>
			<div className='d-flex mt-5'>
				<span className='mr-auto'>
					<b>Name:</b> {user.last_name}, {user.first_name} {user.middle_name || ''}
				</span>
				<span className='ml-auto'>
					<b>Semester:</b> {admission.term}
				</span>
			</div>
			<div className='d-flex'>
				<span className='mr-auto'>
					<b>Year Level:</b> {admission.level}
				</span>
				<span className='ml-auto'>
					<b>Status: </b> {admission.status}
				</span>
			</div>
			<div className='d-flex mt-3'>
				<span className='mr-auto'>
					<b>Student Number:</b> {user.uuid}
				</span>
				<span className='ml-auto'>
					<b>Year:</b> {admission.year?.start} - {admission.year?.end}
				</span>
			</div>
			{!print ? (
				<div className='d-flex mt-2'>
					<button
						className={`btn btn-${!selectAll ? 'secondary' : 'danger'} btn-sm`}
						disabled={user.enrolled}
						onClick={(e) => {
							e.preventDefault();
							if (subjects) {
								if (!selectAll) {
									const non = subjects
										.filter((subject) => {
											if (!print) {
												const valid =
													subject.level === admission.level &&
													subject.term === admission.term &&
													subject.course_id === admission.course_id;
												if (admission.major_id) {
													return valid && admission.major_id === subject.major_id;
												}
												return valid;
											}
											const valid =
												enrolled.includes(subject.id!) &&
												subject.level === admission.level &&
												subject.term === admission.term &&
												subject.course_id === admission.course_id;
											if (admission.major_id) {
												return valid && admission.major_id === subject.major_id;
											}
											return valid;
										})
										.filter((subject) => !enrolled.includes(subject.id!));
									setSelected([...selected, ...non.map((subject) => subject.id!)]);
								} else {
									setSelected([]);
								}
								setSelectAll(!selectAll);
							}
						}}>
						{!selectAll ? 'Select All' : 'Unselect All'}
					</button>
				</div>
			) : null}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					submit();
				}}
				className='table-responsive'>
				<table className='table table-bordered mt-3 w-100' style={{ display: 'table' }}>
					<thead>
						<tr>
							<th></th>
							<th>Subject Code</th>
							<th>Description</th>
							<th>Units</th>
						</tr>
					</thead>
					<tbody>
						{subjects
							?.filter((subject) => {
								if (!print) {
									const valid =
										subject.level === admission.level &&
										subject.term === admission.term &&
										subject.course_id === admission.course_id;
									if (admission.major_id) {
										return valid && admission.major_id === subject.major_id;
									}
									return valid;
								}
								const valid =
									enrolled.includes(subject.id!) &&
									subject.level === admission.level &&
									subject.term === admission.term &&
									subject.course_id === admission.course_id;
								if (admission.major_id) {
									return valid && admission.major_id === subject.major_id;
								}
								return valid;
							})
							.map((subject, index) => (
								<tr key={index}>
									<td>
										{!print ? (
											<>
												<input
													type='checkbox'
													checked={selected.find((id) => subject.id === id) !== undefined}
													disabled={processing || enrolled.includes(subject.id!) || user.enrolled}
													value={subject.id}
													onChange={(e) => {
														const id = e.target.value.toNumber();
														if (selected.includes(id)) {
															remove(id);
														} else {
															add(id);
														}
													}}
												/>
												<sup className='ml-1'>
													<i>{enrolled.includes(subject.id!) ? 'Enrolled' : ''}</i>
												</sup>
											</>
										) : null}
									</td>
									<td>{subject.code}</td>
									<td>{subject.description}</td>
									<td>{subject.units}</td>
								</tr>
							))}
						<tr>
							<td style={{ maxWidth: '30px' }}>Total Units</td>
							<td></td>
							<td></td>
							<td>
								{subjects
									?.filter((subject) => {
										if (!print) {
											return selected.includes(subject.id!) || enrolled.includes(subject.id!);
										}
										return enrolled.includes(subject.id!);
									})
									.reduce((previous, next) => next.units.toNumber() + previous, 0)}
							</td>
						</tr>
					</tbody>
				</table>
				{!print ? (
					<div className='form-group mt-2 d-flex'>
						<span className='mr-auto'>
							<button type='submit' className='btn btn-primary btn-sm' disabled={processing || user.enrolled}>
								Save
							</button>
						</span>
						<span className='ml-auto'>
							<button
								className='btn btn-info btn-sm'
								onClick={(e) => {
									e.preventDefault();
									$('#leftSidebar').addClass('d-none');
									$('.topnav').addClass('d-none');
									$('input').addClass('d-none');
									$('button').addClass('d-none');
									setPrint(true);
									setTimeout(() => {
										window.print();
										$('#leftSidebar').removeClass('d-none');
										$('.topnav').removeClass('d-none');
										$('input').removeClass('d-none');
										$('button').removeClass('d-none');
										setPrint(false);
									}, 100);
								}}
								disabled={processing || !user.enrolled}>
								Download
							</button>
						</span>
					</div>
				) : null}
			</form>
		</div>
	);
};

export default Enrollment;
