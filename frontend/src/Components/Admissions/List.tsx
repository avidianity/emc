import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { statuses } from '../../constants';
import { AdmissionContract } from '../../Contracts/admission.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useNullable, useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { admissionService } from '../../Services/admission.service';
import { userService } from '../../Services/user.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

type UserInput = {
	payment_status: 'Not Paid' | 'Partially Paid' | 'Fully Paid';
};

const updatePaymentModalRef = v4();

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('admissions', () => admissionService.fetch());
	const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser, setValue: setValueUser } = useForm<UserInput>();
	const [student, setStudent] = useNullable<number>();

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

	const submitUser = async (data: UserInput) => {
		try {
			await userService.update(student, data);
			toastr.success('Student payment updated succesfully.');
			refetch();
		} catch (error) {
			handleError(error);
		} finally {
			$(`#${updatePaymentModalRef}`).modal('hide');
			setStudent(null);
			resetUser();
		}
	};

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

	const columns: TableColumn[] = [
		{
			title: 'Reference Number',
			accessor: 'reference_number',
			minWidth: '160px',
		},
		{
			title: 'Name',
			accessor: 'student_name',
			minWidth: '250px',
		},
		{
			title: 'Gender',
			accessor: 'gender',
		},
		{
			title: 'Course',
			accessor: 'course',
			minWidth: '350px',
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
			title: 'Payment Status',
			accessor: 'payment_status',
			minWidth: '200px',
		},
	];

	if (user?.role === 'Registrar') {
		columns.push({
			title: 'Actions',
			minWidth: '250px',
			cell: (admission: AdmissionContract) =>
				user?.role === 'Registrar' ? (
					<>
						<Link to={url(`${admission.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
							<i className='fas fa-edit'></i>
						</Link>
						<button
							className='btn btn-secondary btn-sm mx-1'
							data-tip='Update Payment'
							onClick={(e) => {
								e.preventDefault();
								const modal = $(`#${updatePaymentModalRef}`);
								if (modal.length > 0) {
									setStudent(admission.student?.id!);
									setValueUser('payment_status', admission.student?.payment_status!);
									modal.modal('toggle');
								}
							}}>
							<i className='fas fa-money-bill'></i>
						</button>
						<button
							className={`btn btn-${admission.student?.active ? 'danger' : 'info'} btn-sm mx-1`}
							onClick={async (e) => {
								e.preventDefault();
								if (
									await Asker.notice(
										`Are you sure you want to ${admission.student?.active ? 'unconfirm' : 'confirm'} this student?`
									)
								) {
									update(admission.student!);
								}
							}}
							data-tip={admission.student?.active ? 'Unconfirm' : 'Confirm'}>
							<i className={`fas fa-user-${admission.student?.active ? 'times' : 'check'}`}></i>
						</button>
						<button
							className='btn btn-danger btn-sm mx-1'
							onClick={(e) => {
								e.preventDefault();
								deleteItem(admission.id);
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
				title='Admissions'
				loading={loading}
				items={
					items
						?.filter((admission) => !admission.student?.active && !admission.done)
						.map((admission) => ({
							...admission,
							id_number: admission.student?.uuid,
							student_name: `${admission.student?.last_name}, ${admission.student?.first_name} ${
								admission.student?.middle_name || ''
							}`,
							gender: admission.student?.gender,
							course: `${admission.course?.code}${admission.major ? ` - Major in ${admission.major.name}` : ''}`,
							requirements: admission.requirements?.map((requirement, index) => (
								<span className='d-block' key={index}>
									{requirement}
								</span>
							)),
							payment_status: (
								<span className={`badge badge-${statuses[admission.student?.payment_status!]}`}>
									{admission.student?.payment_status}
								</span>
							),
						})) || []
				}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Registrar' ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Admission'>
								<i className='fas fa-plus'></i>
							</Link>
						) : null}
					</>
				}
			/>
			<div id={updatePaymentModalRef} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Update Payment</h5>
							<button type='button' className='close' data-dismiss='modal'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<form onSubmit={handleSubmitUser(submitUser)}>
							<div className='modal-body'>
								<div className='form-group'>
									<label htmlFor='payment_status'>Payment Status</label>
									<select {...registerUser('payment_status')} id='payment_status' className='form-control'>
										<option value='Not Paid'>Not Paid</option>
										<option value='Partially Paid'>Partially Paid</option>
										<option value='Fully Paid'>Fully Paid</option>
									</select>
								</div>
							</div>
							<div className='modal-footer'>
								<button type='submit' className='btn btn-primary btn-sm'>
									Submit
								</button>
								<button type='button' className='btn btn-secondary btn-sm' data-dismiss='modal'>
									Close
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<Tooltip />
		</>
	);
};

export default List;
