import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { UserContract } from '../../../Contracts/user.contract';
import { State } from '../../../Libraries/State';
import { scheduleService } from '../../../Services/schedule.service';
import { userService } from '../../../Services/user.service';

type Props = {};

const Schedules: FC<Props> = (props) => {
	const state = State.getInstance();
	const temp = state.get<UserContract>('user');
	const { data: user } = useQuery(['user', temp?.id], () => userService.fetchOne(temp?.id));
	const { data: schedules } = useQuery('schedules', () => scheduleService.fetch());

	const admission = user?.admissions?.last();

	if (!user || !admission) {
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
						<th>Schedules</th>
						<th>Instructor</th>
					</tr>
				</thead>
				<tbody>
					{schedules?.map((schedule, index) => (
						<tr key={index}>
							<td>{schedule.subject?.code}</td>
							<td>{schedule.subject?.description}</td>
							<td>
								{schedule.payload.map((row) => {
									if (!row.start_time && !row.end_time) {
										return null;
									}

									return (
										<span className='d-block'>
											{row.day} {dayjs(row.start_time!).format('hh:mm A')} - {dayjs(row.end_time!).format('hh:mm A')}
										</span>
									);
								})}
							</td>
							<td>
								{schedule.teacher?.last_name}, {schedule.teacher?.first_name} {schedule.teacher?.middle_name || ''}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Schedules;
