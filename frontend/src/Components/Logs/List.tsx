import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { handleError } from '../../helpers';
import { logService } from '../../Services/log.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('logs', () => logService.fetch());

	if (isError) {
		handleError(error);
	}

	const columns = [
		{
			title: 'ID',
			accessor: 'id',
		},
		{
			title: 'Message',
			accessor: 'message',
			minWidth: '300px',
		},
		{
			title: 'IP Address',
			accessor: 'ip_address',
			minWidth: '250px',
		},
		{
			title: 'Device',
			accessor: 'device',
			minWidth: '300px',
		},
		{
			title: 'Browser',
			accessor: 'browser',
		},
		{
			title: 'User',
			accessor: 'user',
			minWidth: '300px',
		},
		{
			title: 'Date',
			accessor: 'created_at',
			minWidth: '300px',
		},
	];

	return (
		<Table
			onRefresh={() => refetch()}
			title='Logs'
			loading={loading}
			items={
				items?.map((log) => ({
					...log,
					created_at: dayjs(log.created_at).format('MMMM DD, YYYY hh:mm A'),
					user: `${log.payload?.last_name}, ${log.payload?.first_name} ${log.payload?.middle_name || ''}`,
				})) || []
			}
			columns={columns}
		/>
	);
};

export default List;
