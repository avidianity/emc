import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UnitContract } from '../../Contracts/unit.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { unitService } from '../../Services/unit.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('units', () => unitService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Unit?')) {
				await unitService.delete(id);
				toastr.info('Unit has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns: TableColumn[] = [
		{
			title: 'ID',
			accessor: 'id',
		},
		{
			title: 'Course',
			accessor: 'course',
			minWidth: '375px',
		},
		{
			title: 'Units',
			accessor: 'units',
		},
		{
			title: 'Semester',
			accessor: 'term',
			minWidth: '150px',
		},
		{
			title: 'level',
			accessor: 'level',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			minWidth: '100px',
			cell: (unit: UnitContract) => (
				<>
					{user?.role === 'Registrar' ? (
						<>
							<Link to={url(`${unit.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(unit.id);
								}}
								data-tip='Delete'>
								<i className='fas fa-trash'></i>
							</button>
						</>
					) : null}
				</>
			),
		});
	}

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Student Units'
				loading={loading}
				items={
					items?.map((unit) => ({
						...unit,
						course: `${unit.course?.code}${unit.major ? ` - Major in ${unit.major.name}` : ''}`,
					})) || []
				}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Registrar' ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Unit'>
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
