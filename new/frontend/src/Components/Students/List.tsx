import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { userService } from '../../Services/user.service';

import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Student?')) {
				await userService.delete(id);
				toastr.info('Student has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const update = async (student: UserContract) => {
		try {
			await userService.update(student.id, { active: !student.active });
			toastr.success(`Student ${student.active ? 'disabled' : 'enabled'} successfully.`);
			refetch();
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns = [
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
			title: 'Course',
			accessor: 'course',
		},
		{
			title: 'Status',
			accessor: 'status',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({ title: 'Actions', accessor: 'actions' });
	}

	return (
		<Table
			onRefresh={() => refetch()}
			title='Students'
			loading={loading}
			items={
				items
					?.filter((user) => user.role === 'Student')
					.map((student) => ({
						...student,
						name: (
							<>
								{student.last_name}, {student.first_name} {student.middle_name || ''}
							</>
						),
						year: student.admissions?.last()?.level,
						course: student.admissions?.last()?.course?.code,
						birthday: dayjs(student.birthday).format('MMMM DD, YYYY'),
						age: new Date().getFullYear() - dayjs(student.birthday).year(),
						status: student.active ? (
							<span className='badge badge-success'>Confirmed</span>
						) : (
							<span className='badge badge-danger'>Unconfirmed</span>
						),
						actions: (
							<div style={{ minWidth: '100px' }}>
								<Link to={url(`${student.id}/edit`)} className='btn btn-warning btn-sm mx-1' title='Edit'>
									<i className='fas fa-edit'></i>
								</Link>
								<button
									className={`btn btn-${student.active ? 'danger' : 'info'} btn-sm mx-1`}
									onClick={async (e) => {
										e.preventDefault();
										if (
											await Asker.notice(
												`Are you sure you want to ${student.active ? 'unconfirm' : 'confirm'} this student?`
											)
										) {
											update(student);
										}
									}}
									title={student.active ? 'Unconfirm' : 'Confirm'}>
									<i className={`fas fa-user-${student.active ? 'times' : 'check'}`}></i>
								</button>
								<button
									className='btn btn-danger btn-sm mx-1 d-none'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(student.id);
									}}>
									<i className='fas fa-trash'></i>
								</button>
							</div>
						),
					})) || []
			}
			columns={columns}
			buttons={
				<>
					{user?.role === 'Admin' ? (
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
