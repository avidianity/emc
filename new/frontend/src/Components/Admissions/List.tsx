import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { admissionService } from '../../Services/admission.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('admissions', () => admissionService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Admission?')) {
				await admissionService.delete(id);
				toastr.info('Admission has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns = [
		{
			title: 'Student ID Number',
			accessor: 'id_number',
		},
		{
			title: 'Student',
			accessor: 'student',
		},
		{
			title: 'Gender',
			accessor: 'gender',
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
			title: 'Pre-Registered',
			accessor: 'pre_registration',
		},
		{
			title: 'Requirements',
			accessor: 'requirements',
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
			title='Admissions'
			loading={loading}
			items={
				items?.map((admission) => ({
					...admission,
					id_number: admission.student?.uuid,
					student: `${admission.student?.last_name}, ${admission.student?.first_name} ${admission.student?.middle_name || ''}`,
					gender: admission.student?.gender,
					course: admission.course?.code,
					pre_registration: admission.pre_registration ? (
						<span className='badge badge-success'>Yes</span>
					) : (
						<span className='badge badge-danger'>No</span>
					),
					requirements: admission.requirements.map((requirement, index) => (
						<span className='d-block' key={index}>
							{requirement}
						</span>
					)),
					actions:
						user?.role === 'Registrar' ? (
							<>
								<Link to={url(`${admission.id}/edit`)} className='btn btn-warning btn-sm mx-1' title='Edit'>
									<i className='fas fa-edit'></i>
								</Link>
								<button
									className='btn btn-danger btn-sm mx-1 d-none'
									onClick={(e) => {
										e.preventDefault();
										deleteItem(admission.id);
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
