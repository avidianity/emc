import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { CourseContract } from '../../Contracts/course.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { courseService } from '../../Services/course.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('courses', () => courseService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Course?')) {
				await courseService.delete(id);
				toastr.info('Course has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns: TableColumn[] = [
		{
			title: 'Course Code',
			accessor: 'code',
		},
		{
			title: 'Course Description',
			accessor: 'description',
			minWidth: '350px',
		},
		{
			title: 'Majors',
			accessor: 'majors_name',
			minWidth: '250px',
		},
		{
			title: 'Status',
			accessor: 'open',
			minWidth: '150px',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			minWidth: '150px',
			cell: (course: CourseContract) =>
				user?.role === 'Registrar' ? (
					<>
						<Link to={url(`${course.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
							<i className='fas fa-edit'></i>
						</Link>
						<button
							className='btn btn-danger btn-sm mx-1'
							onClick={(e) => {
								e.preventDefault();
								deleteItem(course.id);
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
				title='Courses'
				loading={loading}
				items={
					items?.map((course) => ({
						...course,
						open: course.open ? (
							<span className='badge badge-success'>Open for Enrollment</span>
						) : (
							<span className='badge badge-danger'>Not Open for Enrollment</span>
						),
						majors_name: course.majors?.map((major, index) => (
							<span className='d-block' key={index}>
								{major.name}
							</span>
						)),
					})) || []
				}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Registrar' ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Course'>
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
