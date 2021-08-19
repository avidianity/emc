import React, { FC, useEffect } from 'react';
import Datatable, { ColumnSortFunction, ConditionalStyles, Format, Selector, TableColumnBase } from 'react-data-table-component';
import { useState } from 'react';
import { outIf } from '../../helpers';
import Tooltip from './Tooltip';
import ReactTooltip from 'react-tooltip';

export interface TableColumn<T = any> extends TableColumnBase {
	title?: string | number | React.ReactNode;
	cell?: (row: T, rowIndex: number, column: TableColumn<T>, id: string | number) => React.ReactNode;
	conditionalCellStyles?: ConditionalStyles<T>[];
	format?: Format<T> | undefined;
	selector?: Selector<T>;
	sortFunction?: ColumnSortFunction<T>;
	accessor?: string;
}

export type TableProps = {
	title: string;
	columns: TableColumn[];
	buttons?: any;
	loading: boolean;
	onRefresh: () => void;
	items: any[];
	misc?: any;
};

const Table: FC<TableProps> = ({ columns, title, buttons, loading, onRefresh, items, misc }) => {
	const [data, setData] = useState(items);

	useEffect(() => {
		setData(items);
	}, [items]);

	useEffect(() => {
		ReactTooltip.rebuild();
		setTimeout(() => ReactTooltip.rebuild(), 1000);
	});

	return (
		<>
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
										data-tip='Refresh'>
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
							columns={columns
								.map((column) => ({
									name: column.title,
									sortable: true,
									...column,
								}))
								.map((column) => {
									if (column.accessor) {
										return {
											...column,
											selector: ((row: any) => row[column.accessor!]) as any,
										};
									}

									return column;
								})}
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
							theme={'default'}
						/>
					</div>
				</div>
			</div>
			<Tooltip />
		</>
	);
};

export default Table;
