import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { handleError } from '../../helpers';
import { userService } from '../../Services/user.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());

	if (isError) {
		handleError(error);
	}

	return (
		<Table
			onRefresh={() => refetch()}
			title='Users'
			loading={loading}
			items={
				items?.map((user) => ({
					...user,
					full_name: (
						<>
							{user.last_name}, {user.first_name} {user.middle_name || ''}
						</>
					),
					actions: (
						<>
							{/* <Link to={url(`${user.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1 d-none'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(user.id);
								}}>
								<i className='fas fa-trash'></i>
							</button> */}
						</>
					),
				})) || []
			}
			columns={[
				{
					title: '#',
					accessor: 'id',
				},
				{
					title: 'User Number',
					accessor: 'uuid',
				},
				{
					title: 'User Type',
					accessor: 'role',
				},
				{
					title: 'Full Name',
					accessor: 'full_name',
				},
				{
					title: 'Email',
					accessor: 'email',
				},
				{
					title: 'Phone Number',
					accessor: 'number',
				},
			]}
			buttons={
				<>
					{/* <Link to={url(`add`)} className='btn btn-primary btn-sm ml-2'>
						<i className='fas fa-plus'></i>
					</Link> */}
				</>
			}
		/>
	);
};

export default List;
