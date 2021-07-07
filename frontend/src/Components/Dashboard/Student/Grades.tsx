import axios from 'axios';
import React, { FC, Fragment, useEffect } from 'react';
import { AdmissionContract } from '../../../Contracts/admission.contract';
import { UserContract } from '../../../Contracts/user.contract';
import { handleError } from '../../../helpers';
import { useArray } from '../../../hooks';
import { State } from '../../../Libraries/State';

type Props = {};

const Grades: FC<Props> = (props) => {
	const state = State.getInstance();
	const user = state.get<UserContract>('user');
	const [admissions, setAdmissions] = useArray<AdmissionContract>();

	const fetch = async () => {
		try {
			const { data: admissions } = await axios.get<AdmissionContract[]>('/auth/admissions');
			setAdmissions(admissions);
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetch();
		// eslint-disable-next-line
	}, []);

	if (!user) {
		return null;
	}

	return (
		<div className='container'>
			<div className='row'>
				<div className='col-12 col-md-6 offset-md-3 text-center'>
					<h4>EASTERN MINDORO COLLEGE</h4>
					<p>Bongabong, Oriental Mindoro</p>
				</div>
			</div>
			{admissions.reverse().map((admission, index) => (
				<Fragment key={index}>
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
					<table className='table table-bordered mt-3'>
						<thead>
							<tr>
								<th className='text-center'>Subject Code</th>
								<th className='text-center'>Description</th>
								<th className='text-center'>Units</th>
								<th className='text-center'>Grades</th>
								<th className='text-center'>Grade Status</th>
							</tr>
						</thead>
						<tbody>
							{admission.student?.grades
								?.filter((grade) => grade.year_id === admission.year_id)
								.map((grade, index) => (
									<tr key={index}>
										<td className='text-center'>{grade.subject?.code}</td>
										<td className='text-center' style={{ minWidth: '100px' }}>
											{grade.subject?.description}
										</td>
										<td className='text-center'>{grade.subject?.units}</td>
										<td className='text-center'>{grade.grade}%</td>
										<td className='text-center'>{grade.status}</td>
									</tr>
								))}
							{admission.student?.subjects
								?.filter((subject) => {
									const grade = admission.student?.grades?.find(
										(grade) => grade?.subject?.id === subject.id && grade.year_id === admission.year_id
									);
									if (grade) {
										return false;
									}
									return true;
								})
								.map((subject) => (
									<tr key={index}>
										<td className='text-center'>{subject?.code}</td>
										<td className='text-center' style={{ minWidth: '100px' }}>
											{subject?.description}
										</td>
										<td className='text-center'>{subject?.units}</td>
										<td className='text-center'>-</td>
										<td className='text-center'>{admission.year?.current ? '-' : 'INC'}</td>
									</tr>
								))}
							<tr>
								<td className='text-center'>
									<b>Total Units</b>
								</td>
								<td></td>
								<td className='text-center'>
									{(admission.student?.grades
										?.filter((grade) => grade.year_id === admission.year_id)
										.reduce((previous, next) => previous + next.subject!.units, 0) || 0) +
										(admission.student?.subjects
											?.filter((subject) => {
												const grade = admission.student?.grades?.find(
													(grade) => grade?.subject?.id === subject.id && grade.year_id === admission.year_id
												);
												if (grade) {
													return false;
												}
												return true;
											})
											.reduce((previous, next) => previous + next!.units, 0) || 0)}
								</td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</Fragment>
			))}
		</div>
	);
};

export default Grades;
