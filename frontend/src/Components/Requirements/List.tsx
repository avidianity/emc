import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { requirementService } from '../../Services/requirement.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('requirements', () => requirementService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Requirement?')) {
				await requirementService.delete(id);
				toastr.info('Requirement has been deleted.', 'Notice');
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
			title: 'Name',
			accessor: 'name',
		},
		{
			title: 'Created',
			accessor: 'created_at',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			accessor: 'actions',
		});
	}

	return (
		<Table
			onRefresh={() => refetch()}
			title='Requirements'
			loading={loading}
			items={
				items?.map((requirement) => ({
					...requirement,
					created_at: dayjs(requirement.created_at).format('MMMM DD, YYYY hh:mm A'),
					actions:
						user?.role === 'Registrar' ? (
							<>
								<Link to={url(`${requirement.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
									<i className='fas fa-edit'></i>
								</Link>
								<button
									className='btn btn-danger btn-sm mx-1'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(requirement.id);
									}}>
									<i className='fas fa-trash'></i>
								</button>
							</>
						) : null,
				})) || []
			}
			columns={columns}
			buttons={
				<>
					{user?.role === 'Registrar' ? (
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
