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
		},
		{
			title: 'Date',
			accessor: 'created_at',
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
				})) || []
			}
			columns={columns}
		/>
	);
};

export default List;
