import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { SectionContract } from '../../Contracts/section.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { sectionService } from '../../Services/section.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('sections', () => sectionService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Section?')) {
				await sectionService.delete(id);
				toastr.info('Section has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns: TableColumn<SectionContract>[] = [
		{
			title: 'ID',
			accessor: 'id',
		},
		{
			title: 'Name',
			accessor: 'name',
			minWidth: '150px',
		},
		{
			title: 'Year Level',
			accessor: 'level',
			minWidth: '150px',
		},
		{
			title: 'Semester',
			accessor: 'term',
			minWidth: '150px',
		},
		{
			title: 'Course',
			accessor: 'course',
			minWidth: '250px',
		},
		{
			title: 'Slots',
			accessor: 'limit',
			minWidth: '100px',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			minWidth: '200px',
			cell: (section: SectionContract) =>
				user?.role === 'Registrar' ? (
					<>
						<Link to={url(`${section.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
							<i className='fas fa-edit'></i>
						</Link>
						<button
							className='btn btn-danger btn-sm mx-1 d-none'
							onClick={(e) => {
								e.preventDefault();
								deleteItem(section.id);
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
				title='Sections'
				loading={loading}
				items={
					items
						?.filter((section) => section.year?.current)
						.map((section) => ({
							...section,
							course: `${section.course?.code}${section.major ? ` - Major in ${section.major.name}` : ''}`,
							limit: `${section.students_count}/${section.limit}`,
						})) || []
				}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Registrar' && items && items.length === 0 ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Section'>
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
