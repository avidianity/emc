import axios from 'axios';
import React, { createRef, FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { UserContract } from '../../Contracts/user.contract';
import { handleError } from '../../helpers';
import { useNullable } from '../../hooks';
import { State } from '../../Libraries/State';
import { userService } from '../../Services/user.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

type Inputs = {
	password: string;
	new_password: string;
	repeat_password: string;
	user_id: number;
};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());
	const user = State.getInstance().get<UserContract>('user');
	const [selected, setSelected] = useNullable<number>();
	const modalRef = createRef<HTMLDivElement>();
	const { register, handleSubmit, reset } = useForm<Inputs>();

	const submit = async (data: Inputs) => {
		if (!selected) {
			return toastr.error('No user selected.');
		}

		if (data.new_password !== data.repeat_password) {
			return toastr.error('New password does not match repeat password.');
		}

		try {
			data.user_id = selected;
			await axios.post('/users/change', data);
			toastr.success('User password changed successfully.');
			if (modalRef.current) {
				$(modalRef.current).modal('hide');
			}
			setSelected(null);
		} catch (error) {
			handleError(error);
		}
	};

	if (isError) {
		handleError(error);
	}

	const columns: TableColumn[] = [
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
	];

	if (user?.role === 'Admin') {
		columns.push({
			title: 'Actions',
			cell: (user: UserContract) => (
				<>
					<button
						className='btn btn-warning btn-sm mx-1'
						onClick={(e) => {
							e.preventDefault();
							setSelected(user.id!);
							if (modalRef.current) {
								$(modalRef.current).modal('toggle');
							}
						}}
						data-tip='Change Password'>
						<i className='fas fa-key'></i>
					</button>
					{/* <Link to={url(`${user.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1 d-none'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(user.id);
								}}
                                data-tip='Delete'>
								<i className='fas fa-trash'></i>
							</button> */}
				</>
			),
		});
	}

	useEffect(() => {
		if (modalRef.current) {
			$(modalRef.current).on('hidden.bs.modal', () => reset());
		}
		//eslint-disable-next-line
	}, []);

	return (
		<>
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
					})) || []
				}
				columns={columns}
				buttons={
					<>
						{/* <Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add User'>
						<i className='fas fa-plus'></i>
					</Link> */}
					</>
				}
			/>
			<div ref={modalRef} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Change Password</h5>
							<button type='button' className='close' data-dismiss='modal'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<form onSubmit={handleSubmit(submit)}>
							<div className='modal-body'>
								<div className='container-fluid'>
									<div className='form-group'>
										<label htmlFor='password'>Your Password</label>
										<input {...register('password')} type='password' id='password' className='form-control' />
									</div>
									<div className='form-group mt-3'>
										<label htmlFor='new_password'>User's New Password</label>
										<input {...register('new_password')} type='password' id='new_password' className='form-control' />
									</div>
									<div className='form-group'>
										<label htmlFor='repeat_password'>Repeat New Password</label>
										<input
											{...register('repeat_password')}
											type='password'
											id='repeat_password'
											className='form-control'
										/>
									</div>
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
