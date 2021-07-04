import React, { FC, useEffect } from 'react';
import Datatable from 'react-data-table-component';
import { useState } from 'react';
import { State } from '../../Libraries/State';
import { outIf } from '../../helpers';

export type TableProps = {
	title: string;
	columns: { title: string; accessor: string }[];
	buttons?: any;
	loading: boolean;
	onRefresh: () => void;
	items: any[];
	misc?: any;
};

const Table: FC<TableProps> = ({ columns, title, buttons, loading, onRefresh, items, misc }) => {
	const state = State.getInstance();
	const [mode, setMode] = useState(state.get<string>('mode') || 'dark');
	const [data, setData] = useState(items);

	useEffect(() => {
		setData(items);
	}, [items]);

	useEffect(() => {
		const key = state.listen<string>('mode', (mode) => setMode(mode));

		return () => {
			state.unlisten(key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card shadow'>
				<div className='card-header'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-12 d-flex align-items-center'>
								<h4 className='card-title mb-0'>{title}</h4>
								<button
									className='btn btn-info btn-sm ml-auto'
									disabled={loading}
									onClick={(e) => {
										e.preventDefault();
										onRefresh();
									}}
									title='Refresh'>
									<i className={`fas fa-sync-alt ${outIf(loading, 'fa-spin')}`}></i>
								</button>
								{buttons}
							</div>
							{misc ? <div className='col-12'>{misc}</div> : null}
						</div>
					</div>
				</div>
				<div className={`card-body table-responsive`}>
					<Datatable
						columns={columns.map((column) => ({
							name: column.title,
							selector: ((row: any) => row[column.accessor]) as any,
							sortable: true,
							...column,
						}))}
						data={data}
						pagination
						fixedHeader
						subHeader
						subHeaderComponent={
							<div className='d-flex align-items-center'>
								<input
									type='text'
									placeholder='Search'
									className='form-control'
									onChange={(e) => {
										const text = e.target.value;

										if (text.length > 0) {
											setData(
												items.filter((item) => {
													for (const key of Object.keys(item)) {
														const value = item[key];
														if (value && value.toString().includes(text)) {
															return true;
														}
													}

													return false;
												})
											);
										} else {
											setData(items);
										}
									}}
								/>
							</div>
						}
						theme={mode === 'dark' ? 'dark' : 'default'}
					/>
				</div>
			</div>
		</div>
	);
};

export default Table;
