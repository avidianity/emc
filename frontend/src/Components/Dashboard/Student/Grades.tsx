import axios from 'axios';
import React, { FC, Fragment, useEffect } from 'react';
import { useQuery } from 'react-query';
import { AdmissionContract } from '../../../Contracts/admission.contract';
import { SubjectContract } from '../../../Contracts/subject.contract';
import { UserContract } from '../../../Contracts/user.contract';
import { handleError } from '../../../helpers';
import { useArray } from '../../../hooks';
import { State } from '../../../Libraries/State';
import { subjectService } from '../../../Services/subject.service';

type Props = {};

const Grades: FC<Props> = (props) => {
	const state = State.getInstance();
	const user = state.get<UserContract>('user');
	const { data: subjects } = useQuery('subjects', () => subjectService.fetch());
	const [admissions, setAdmissions] = useArray<AdmissionContract>();

	const fetch = async () => {
		try {
			const { data: admissions } = await axios.get<AdmissionContract[]>('/auth/admissions');
			setAdmissions([...admissions.reverse()]);
		} catch (error) {
			handleError(error);
		}
	};

	const findGrade = (subject: SubjectContract, admission: AdmissionContract) => {
		const student = admission.student;
		return student?.grades?.find((grade) => grade.year_id === admission.id && grade.subject_id === subject.id);
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
								<th className='text-center'>Subject Code</th>
								<th className='text-center'>Description</th>
								<th className='text-center'>Units</th>
								<th className='text-center'>Grade</th>
								<th className='text-center'>Status</th>
							</tr>
						</thead>
						<tbody>
							{subjects
								?.filter((subject) => {
									if (admission.year?.current) {
										return admission.student?.subjects?.find((s) => s.id === subject.id) ? true : false;
									} else {
										return admission.student?.previous_subjects?.find((s) => s.id === subject.id) ? true : false;
									}
								})
								.filter((subject) => {
									return (
										subject.level === admission.level &&
										subject.term === admission.term &&
										subject.course_id === admission.course_id &&
										subject.major_id === admission.major_id
									);
								})
								.filter((s) => {
									console.log(s);
									return true;
								})
								.map((subject) => (
									<tr key={index}>
										<td className='text-center'>{subject?.code}</td>
										<td className='text-center' style={{ minWidth: '100px' }}>
											{subject?.description}
										</td>
										<td className='text-center'>{subject?.units}</td>
										<td className='text-center'>
											{findGrade(subject, admission) ? `${findGrade(subject, admission)?.grade}%` : '-'}
										</td>
										<td className='text-center'>
											{admission.year?.current
												? findGrade(subject, admission)
													? findGrade(subject, admission)?.status
													: '-'
												: 'INC'}
										</td>
									</tr>
								))}
							<tr>
								<td className='text-center'>
									<b>Total Units</b>
								</td>
								<td></td>
								<td className='text-center'>
									{subjects
										?.filter((subject) => {
											if (admission.year?.current) {
												return admission.student?.subjects?.find((s) => s.id === subject.id) ? true : false;
											} else {
												return admission.student?.previous_subjects?.find((s) => s.id === subject.id)
													? true
													: false;
											}
										})
										.filter((subject) => {
											return (
												subject.level === admission.level &&
												subject.term === admission.term &&
												subject.course_id === admission.course_id &&
												subject.major_id === admission.major_id
											);
										})
										.reduce((prev, next) => prev + next.units, 0) || 0}
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
