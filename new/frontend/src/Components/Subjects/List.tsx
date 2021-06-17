import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { subjectService } from '../../Services/subject.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('subjects', () => subjectService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Subject?')) {
				await subjectService.delete(id);
				toastr.info('Subject has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns = [
		{
			title: 'Subject Code',
			accessor: 'code',
		},
		{
			title: 'Subject Description',
			accessor: 'description',
		},
		{
			title: 'Course',
			accessor: 'course',
		},
		{
			title: 'Year Level',
			accessor: 'level',
		},
		{
			title: 'Semester',
			accessor: 'term',
		},
		{
			title: 'Units',
			accessor: 'units',
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
			title='Subjects'
			loading={loading}
			items={
				items?.map((subject) => ({
					...subject,
					course: `${subject.course?.code}${subject.major ? ` - Major in ${subject.major.name}` : ''}`,
					actions:
						user?.role === 'Registrar' ? (
							<div style={{ minWidth: '100px' }}>
								<Link to={url(`${subject.id}/edit`)} className='btn btn-warning btn-sm mx-1'>
									<i className='fas fa-edit'></i>
								</Link>
								<button
									className='btn btn-danger btn-sm mx-1'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(subject.id);
									}}>
									<i className='fas fa-trash'></i>
								</button>
							</div>
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
