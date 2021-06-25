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
			{admissions.map((admission, index) => (
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
								<th>Subject Code</th>
								<th>Description</th>
								<th>Units</th>
								<th>Grades</th>
								<th>Grade Status</th>
							</tr>
						</thead>
						<tbody>
							{admission.student?.grades?.map((grade, index) => (
								<tr key={index}>
									<td>{grade.subject?.code}</td>
									<td style={{ minWidth: '100px' }}>{grade.subject?.description}</td>
									<td>{grade.subject?.units}</td>
									<td>{grade.grade}%</td>
									<td>{grade.status}</td>
								</tr>
							))}
							<tr>
								<td>
									<b>Total Units</b>
								</td>
								<td></td>
								<td>
									{admission.student?.grades?.reduce((previous, next) => previous + next.subject!.units.toNumber(), 0)}
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
