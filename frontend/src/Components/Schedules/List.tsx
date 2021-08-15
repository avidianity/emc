import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { ScheduleContract } from '../../Contracts/schedule.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { scheduleService } from '../../Services/schedule.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('schedules', () => scheduleService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Schedule?')) {
				await scheduleService.delete(id);
				toastr.info('Schedule has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns: TableColumn[] = [
		{
			title: 'Course',
			accessor: 'course',
			minWidth: '375px',
		},
		{
			title: 'Subject',
			accessor: 'subject',
			minWidth: '350px',
		},
		{
			title: 'Section',
			accessor: 'section',
		},
		{
			title: 'Teacher',
			accessor: 'teacher',
			minWidth: '250px',
		},
		{
			title: 'Year',
			accessor: 'year',
		},
		{
			title: 'Times',
			accessor: 'times',
			minWidth: '250px',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			minWidth: '60px',
			cell: (schedule: ScheduleContract) =>
				user?.role === 'Registrar' ? (
					<>
						<Link to={url(`${schedule.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
							<i className='fas fa-edit'></i>
						</Link>
						<button
							className='btn btn-danger btn-sm mx-1'
							onClick={(e) => {
								e.preventDefault();
								deleteItem(schedule.id);
							}}
							data-tip='Delete'>
							<i className='fas fa-trash'></i>
						</button>
					</>
				) : null,
		});
	}

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Schedules'
				loading={loading}
				items={
					items?.map((schedule) => ({
						...schedule,
						section: schedule.section?.name,
						subject: schedule?.subject?.description,
						course: `${schedule.course?.code}${schedule.major ? ` - Major in ${schedule.major.name}` : ''}`,
						teacher: `${schedule.teacher?.last_name}, ${schedule.teacher?.first_name} ${schedule.teacher?.middle_name || ''}`,
						times: (
							<>
								{schedule.payload.map((row, index) =>
									row.start_time && row.end_time ? (
										<span className='d-block' key={index}>
											{row.day} {dayjs(row.start_time).format('hh:mm A')} - {dayjs(row.end_time).format('hh:mm A')}
										</span>
									) : null
								)}
							</>
						),
					})) || []
				}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Registrar' ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Schedule'>
								<i className='fas fa-plus'></i>
							</Link>
						) : null}
					</>
				}
			/>
			<Tooltip />
		</>
	);
};

export default List;
