import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { YearContract } from '../../Contracts/year.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { yearService } from '../../Services/year.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('years', () => yearService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const setAsCurrent = async (year: YearContract) => {
		try {
			if (await Asker.notice('Are you sure you want to set the current school year?')) {
				await yearService.update(year.id, { current: true });
				toastr.info(`Year ${year.start} - ${year.end} has been set as current school year.`, 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this School Year?')) {
				await yearService.delete(id);
				toastr.info('School Year has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns = [
		{
			title: 'ID',
			accessor: 'id',
		},
		{
			title: 'Year',
			accessor: 'year',
			minWidth: '200px',
		},
		{
			title: 'Semester',
			accessor: 'semester',
			minWidth: '150px',
		},
		{
			title: 'Start',
			accessor: 'semester_start',
			minWidth: '200px',
		},
		{
			title: 'End',
			accessor: 'semester_end',
			minWidth: '200px',
		},
		{
			title: 'Registration Date',
			accessor: 'registration',
			minWidth: '250px',
		},
		{
			title: 'Grade Encoding Date',
			accessor: 'grade',
			minWidth: '400px',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			accessor: 'actions',
			minWidth: '200px',
		});
	}

	return (
		<Table
			onRefresh={() => refetch()}
			title='School Years'
			loading={loading}
			items={
				items?.map((year) => ({
					...year,
					year: (
						<>
							{`${year.start} - ${year.end}`}{' '}
							{year.current ? <span className='badge badge-success mb-1 ml-1'>Current</span> : ''}
						</>
					),
					semester_start: dayjs(year.semester_start).format('MMMM DD, YYYY'),
					semester_end: dayjs(year.semester_end).format('MMMM DD, YYYY'),
					registration: `${dayjs(year.registration_start).format('MMMM DD, YYYY')} to ${dayjs(year.registration_end).format(
						'MMMM DD, YYYY'
					)}`,
					grade: `${dayjs(year.grade_start).format('MMMM DD, YYYY hh:mm A')} to ${dayjs(year.grade_end).format(
						'MMMM DD, YYYY hh:mm A'
					)}`,
					actions:
						user?.role === 'Registrar' ? (
							<>
								<Link to={url(`${year.id}/edit`)} className='btn btn-warning btn-sm mx-1' title='Edit'>
									<i className='fas fa-edit'></i>
								</Link>
								{!year.current ? (
									<button
										className='btn btn-success btn-sm mx-1'
										onClick={(e) => {
											e.preventDefault();
											setAsCurrent(year);
										}}
										title='Set as Current'>
										<i className='fas fa-check'></i>
									</button>
								) : null}
								<button
									className='btn btn-danger btn-sm mx-1 d-none'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(year.id);
									}}
									title='Delete'>
									<i className='fas fa-trash'></i>
								</button>
							</>
						) : null,
				})) || []
			}
			columns={columns}
			buttons={
				<>
					{user?.role === 'Registrar' && items && items.length === 0 ? (
						<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2'>
							<i className='fas fa-plus'></i>
						</Link>
					) : null}
				</>
			}
		/>
	);
};

export default List;
