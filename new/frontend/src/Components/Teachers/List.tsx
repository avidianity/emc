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
			if (await Asker.danger('Are you sure you want to delete this Teacher?')) {
				await userService.delete(id);
				toastr.info('Teacher has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const update = async (teacher: UserContract) => {
		try {
			await userService.update(teacher.id, { active: !teacher.active });
			toastr.success(`Teacher ${teacher.active ? 'disabled' : 'enabled'} successfully.`);
			refetch();
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns = [
		{
			title: 'Teacher #',
			accessor: 'uuid',
		},
		{
			title: 'Name',
			accessor: 'name',
		},
		{
			title: 'Phone Number',
			accessor: 'number',
		},
		{
			title: 'Email',
			accessor: 'email',
		},
		{
			title: 'Address',
			accessor: 'address',
		},
		{
			title: 'Gender',
			accessor: 'gender',
		},
		{
			title: 'Birthday',
			accessor: 'birthday',
		},
		{
			title: 'Age',
			accessor: 'age',
		},
		{
			title: 'Status',
			accessor: 'status',
		},
	];

	if (user?.role === 'Admin') {
		columns.push({ title: 'Actions', accessor: 'actions' });
	}

	return (
		<Table
			onRefresh={() => refetch()}
			title='Teachers'
			loading={loading}
			items={
				items
					?.filter((user) => user.role === 'Teacher')
					.map((teacher) => ({
						...teacher,
						name: (
							<>
								{teacher.last_name}, {teacher.first_name} {teacher.middle_name || ''}
							</>
						),
						birthday: dayjs(teacher.birthday).format('MMMM DD, YYYY'),
						age: new Date().getFullYear() - dayjs(teacher.birthday).year(),
						status: teacher.active ? (
							<span className='badge badge-success'>Active</span>
						) : (
							<span className='badge badge-danger'>Inactive</span>
						),
						actions: (
							<div style={{ minWidth: '100px' }}>
								<Link to={url(`${teacher.id}/edit`)} className='btn btn-warning btn-sm mx-1' title='Edit'>
									<i className='fas fa-edit'></i>
								</Link>
								<button
									className={`btn btn-${teacher.active ? 'danger' : 'info'} btn-sm mx-1`}
									onClick={async (e) => {
										e.preventDefault();
										if (
											await Asker.notice(
												`Are you sure you want to ${teacher.active ? 'disable' : 'enable'} this teacher?`
											)
										) {
											update(teacher);
										}
									}}
									title={teacher.active ? 'Disable' : 'Enable'}>
									<i className={`fas fa-user-${teacher.active ? 'times' : 'check'}`}></i>
								</button>
								<button
									className='btn btn-danger btn-sm mx-1 d-none'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(teacher.id);
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