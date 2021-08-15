import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { userService } from '../../Services/user.service';

import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Registrar?')) {
				await userService.delete(id);
				toastr.info('Registrar has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const update = async (registrar: UserContract) => {
		try {
			await userService.update(registrar.id, { active: !registrar.active });
			toastr.success(`Registrar ${registrar.active ? 'disabled' : 'enabled'} successfully.`);
			refetch();
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns: TableColumn[] = [
		{
			title: 'Registrar #',
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
			title: 'Status',
			accessor: 'status',
		},
	];

	if (user?.role === 'Admin') {
		columns.push({
			title: 'Actions',
			cell: (registrar: UserContract) => (
				<div style={{ minWidth: '100px' }}>
					<Link to={url(`${registrar.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
						<i className='fas fa-edit'></i>
					</Link>
					<button
						className={`btn btn-${registrar.active ? 'danger' : 'info'} btn-sm mx-1`}
						onClick={async (e) => {
							e.preventDefault();
							if (await Asker.notice(`Are you sure you want to ${registrar.active ? 'disable' : 'enable'} this registrar?`)) {
								update(registrar);
							}
						}}
						data-tip={registrar.active ? 'Disable' : 'Enable'}>
						<i className={`fas fa-user-${registrar.active ? 'times' : 'check'}`}></i>
					</button>
					<button
						className='btn btn-danger btn-sm mx-1 d-none'
						onClick={(e) => {
							e.preventDefault();
							deleteItem(registrar.id);
						}}
						data-tip='Delete'>
						<i className='fas fa-trash'></i>
					</button>
				</div>
			),
		});
	}

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Registrars'
				loading={loading}
				items={
					items
						?.filter((user) => user.role === 'Registrar')
						.map((registrar) => ({
							...registrar,
							name: (
								<>
									{registrar.last_name}, {registrar.first_name} {registrar.middle_name || ''}
								</>
							),
							birthday: dayjs(registrar.birthday).format('MMMM DD, YYYY'),
							age: new Date().getFullYear() - dayjs(registrar.birthday).year(),
							status: registrar.active ? (
								<span className='badge badge-success'>Active</span>
							) : (
								<span className='badge badge-danger'>Inactive</span>
							),
						})) || []
				}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Admin' ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Registrar'>
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
