import dayjs from 'dayjs';
import React, { createRef, FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker, toJSON } from '../../helpers';
import { useArray, useNullable, useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { userService } from '../../Services/user.service';

import Table from '../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('users', () => userService.fetch());
	const [selected, setSelected] = useArray<number>();
	const [teacher, setTeacher] = useNullable<UserContract>();
	const modalRef = createRef<HTMLDivElement>();
	const history = useHistory();

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Teacher?')) {
				await userService.delete(id);
				toastr.info('Teacher has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const update = async (teacher: UserContract) => {
		try {
			await userService.update(teacher.id, { active: !teacher.active });
			toastr.success(`Teacher ${teacher.active ? 'disabled' : 'enabled'} successfully.`);
			refetch();
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns = [
		{
			title: 'Teacher #',
			accessor: 'uuid',
		},
		{
			title: 'Name',
			accessor: 'name',
		},
		{
			title: 'Email',
			accessor: 'email',
		},
		{
			title: 'Status',
			accessor: 'status',
		},
	];

	if (['Registrar'].includes(user?.role || '')) {
		columns.unshift({
			title: '#',
			accessor: 'toggle',
		});
		columns.push({ title: 'Actions', accessor: 'actions' });
	}

	useEffect(() => {
		if (modalRef.current) {
			$(modalRef.current).on('hidden.bs.modal', () => setTeacher(null));
		}
	}, [modalRef, setTeacher]);

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Teachers'
				loading={loading}
				items={
					items
						?.filter((user) => user.role === 'Teacher')
						.map((teacher) => ({
							...teacher,
							toggle: (
								<>
									<div className='custom-control custom-checkbox'>
										<input
											type='checkbox'
											className='custom-control-input'
											id={toJSON(teacher)}
											onChange={(e) => {
												const id = e.target.value.toNumber();
												if (selected.includes(id)) {
													const index = selected.findIndex((number) => number === id);
													selected.splice(index, 1);
												} else {
													selected.push(id);
												}
												setSelected([...selected]);
											}}
											value={teacher.id}
											checked={selected.includes(teacher.id!)}
										/>
										<label className='custom-control-label' htmlFor={toJSON(teacher)}></label>
									</div>
								</>
							),
							name: (
								<>
									{teacher.last_name}, {teacher.first_name} {teacher.middle_name || ''}
								</>
							),
							birthday: dayjs(teacher.birthday).format('MMMM DD, YYYY'),
							age: new Date().getFullYear() - dayjs(teacher.birthday).year(),
							status: teacher.active ? (
								<span className='badge badge-success'>Active</span>
							) : (
								<span className='badge badge-danger'>Inactive</span>
							),
							actions: (
								<div style={{ minWidth: '100px' }}>
									<Link to={url(`${teacher.id}/edit`)} className='btn btn-warning btn-sm mx-1' title='Edit'>
										<i className='fas fa-edit'></i>
									</Link>
									<button
										className='btn btn-primary btn-sm mx-1'
										title='View'
										onClick={(e) => {
											e.preventDefault();
											setTeacher(teacher);
											if (modalRef.current) {
												$(modalRef.current).modal('show');
											}
										}}>
										<i className='fas fa-eye'></i>
									</button>
									{user?.role === 'Registrar' ? (
										<button
											className={`btn btn-${teacher.active ? 'danger' : 'info'} btn-sm mx-1`}
											onClick={async (e) => {
												e.preventDefault();
												if (
													await Asker.notice(
														`Are you sure you want to ${teacher.active ? 'disable' : 'enable'} this teacher? ${
															teacher.active
																? 'If you disable this teacher, this teacher can’t access the system. And you can’t distribute subjects to this teacher.'
																: 'If you enable this teacher, this teacher can access the system. And you can distribute subject to this teacher.'
														}`
													)
												) {
													update(teacher);
												}
											}}
											title={teacher.active ? 'Disable' : 'Enable'}>
											<i className={`fas fa-user-${teacher.active ? 'times' : 'check'}`}></i>
										</button>
									) : null}
									<button
										className='btn btn-danger btn-sm mx-1 d-none'
										onClick={(e) => {
											e.preventDefault();
											deleteItem(teacher.id);
										}}>
										<i className='fas fa-trash'></i>
									</button>
								</div>
							),
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
						{['Registrar'].includes(user?.role || '') ? (
							<>
								<button
									className='btn btn-primary btn-sm ml-2'
									title='Enable Selected'
									onClick={async (e) => {
										e.preventDefault();
										if (selected.length > 0) {
											if (
												await Asker.danger(
													`Are you sure you want to enable ${selected.length} ${
														selected.length === 1 ? 'teacher' : 'teachers'
													}? If you enable ${selected.length === 1 ? 'this' : 'these'} ${
														selected.length === 1 ? 'teacher' : 'teachers'
													}, ${selected.length === 1 ? 'this' : 'these'} ${
														selected.length === 1 ? 'teacher' : 'teachers'
													} can access the system.`
												)
											) {
												try {
													await Promise.all(selected.map((id) => userService.update(id, { active: true })));
													toastr.success(
														`${selected.length} ${
															selected.length === 1 ? 'teacher' : 'teachers'
														} enabled successfully.`
													);
													setSelected([]);
													refetch();
												} catch (error) {
													console.log(error);
													toastr.error('Unable to enable teachers.');
												}
											}
										}
									}}>
									<i className={`fas fa-user-check`}></i>
								</button>
								<button
									className='btn btn-danger btn-sm ml-2'
									title='Disable Selected'
									onClick={async (e) => {
										e.preventDefault();
										if (selected.length > 0) {
											if (
												await Asker.danger(
													`Are you sure you want to disable ${selected.length} ${
														selected.length === 1 ? 'teacher' : 'teachers'
													}? If you disable ${selected.length === 1 ? 'this' : 'these'} ${
														selected.length === 1 ? 'teacher' : 'teachers'
													}, ${selected.length === 1 ? 'this' : 'these'} ${
														selected.length === 1 ? 'teacher' : 'teachers'
													} can’t access the system. And you can’t distribute subjects to ${
														selected.length === 1 ? 'this' : 'these'
													} ${selected.length === 1 ? 'teacher' : 'teachers'}.`
												)
											) {
												try {
													await Promise.all(selected.map((id) => userService.update(id, { active: false })));
													toastr.success(
														`${selected.length} ${
															selected.length === 1 ? 'teacher' : 'teachers'
														} disabled successfully.`
													);
													setSelected([]);
													refetch();
												} catch (error) {
													console.log(error);
													toastr.error('Unable to disable teachers.');
												}
											}
										}
									}}>
									<i className={`fas fa-user-times`}></i>
								</button>
							</>
						) : null}
					</>
				}
			/>
			<div ref={modalRef} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>View Teacher</h5>
							<button
								type='button'
								className='close'
								onClick={(e) => {
									e.preventDefault();
									if (modalRef.current) {
										$(modalRef.current).modal('hide');
									}
								}}>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							{teacher && (
								<div className='container-fluid row'>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Teacher #</label>
										{teacher.uuid}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Name</label>
										{teacher.last_name}, {teacher.first_name} {teacher.last_name || ''}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Phone Number</label>
										{teacher.number}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Email</label>
										{teacher.email}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Address</label>
										{teacher.address}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Gender</label>
										{teacher.gender}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Birthday</label>
										{dayjs(teacher.birthday).format('MMMM DD, YYYY')}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Age</label>
										{dayjs().year() - dayjs(teacher.birthday).year()}
									</div>
									<div className='col-12 col-md-6 col-lg-4 p-2 border'>
										<label className='font-weight-bold d-block'>Status</label>
										{teacher.active ? (
											<span className='badge badge-success'>Active</span>
										) : (
											<span className='badge badge-danger'>Inactive</span>
										)}
									</div>
								</div>
							)}
						</div>
						<div className='modal-footer'>
							{teacher && (
								<button
									className='btn btn-warning btn-sm mx-1'
									title='Edit'
									onClick={(e) => {
										e.preventDefault();
										if (modalRef.current) {
											$(modalRef.current).modal('hide');
											history.push(url(`${teacher.id}/edit`));
										}
									}}>
									Edit
								</button>
							)}
							<button
								type='button'
								className='btn btn-secondary btn-sm'
								onClick={(e) => {
									e.preventDefault();
									if (modalRef.current) {
										$(modalRef.current).modal('hide');
									}
								}}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default List;
