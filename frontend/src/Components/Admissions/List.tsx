import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { admissionService } from '../../Services/admission.service';
import { userService } from '../../Services/user.service';
import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('admissions', () => admissionService.fetch());

	const url = useURL();

	const update = async (student: UserContract) => {
		try {
			await userService.update(student.id, { active: !student.active });
			toastr.success(`Student ${student.active ? 'disabled' : 'enabled'} successfully.`);
			refetch();
		} catch (error) {
			handleError(error);
		}
	};

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
				items
					?.filter((admission) => !admission.student?.active && !admission.done)
					.map((admission) => ({
						...admission,
						id_number: admission.student?.uuid,
						student: `${admission.student?.last_name}, ${admission.student?.first_name} ${
							admission.student?.middle_name || ''
						}`,
						gender: admission.student?.gender,
						course: `${admission.course?.code}${admission.major ? ` - Major in ${admission.major.name}` : ''}`,
						requirements: admission.requirements?.map((requirement, index) => (
							<span className='d-block' key={index}>
								{requirement}
							</span>
						)),
						actions:
							user?.role === 'Registrar' ? (
								<div style={{ minWidth: '350px' }}>
									<Link to={url(`${admission.id}/edit`)} className='btn btn-warning btn-sm mx-1' title='Edit'>
										<i className='fas fa-edit'></i>
									</Link>
									<button
										className={`btn btn-${admission.student?.active ? 'danger' : 'info'} btn-sm mx-1`}
										onClick={async (e) => {
											e.preventDefault();
											if (
												await Asker.notice(
													`Are you sure you want to ${
														admission.student?.active ? 'unconfirm' : 'confirm'
													} this student?`
												)
											) {
												update(admission.student!);
											}
										}}
										title={admission.student?.active ? 'Unconfirm' : 'Confirm'}>
										<i className={`fas fa-user-${admission.student?.active ? 'times' : 'check'}`}></i>
									</button>
									<button
										className='btn btn-danger btn-sm mx-1'
										onClick={(e) => {
											e.preventDefault();
											deleteItem(admission.id);
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
