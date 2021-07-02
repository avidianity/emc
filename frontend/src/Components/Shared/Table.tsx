import React, { FC, useEffect } from 'react';
import { v4 } from 'uuid';
import { outIf } from '../../helpers';

export type TableProps = {
	title: string;
	columns: { title: string; accessor: string }[];
	buttons?: any;
	casts?: { [key: string]: (value: any) => any };
	loading: boolean;
	onRefresh: () => void;
	items: any[];
	misc?: any;
};

const Table: FC<TableProps> = ({ columns, title, buttons, casts, loading, onRefresh, items, misc }) => {
	const id = v4();

	const cast = (key: string, value: any) => {
		if (casts && key in casts) {
			return casts[key](value);
		}

		return value;
	};

	useEffect(() => {
		const message = $('.dataTables_empty');
		if (items.length > 0 || loading) {
			message.addClass('d-none');
		}
		if (!loading && items.length === 0) {
			message.removeClass('d-none');
		}
	});

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
					<table id={id} className='table table-hover'>
						<thead>
							<tr>
								{columns.map((column, index) => (
									<th key={index}>{column.title}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									{columns.map(({ accessor }, index) => (
										<td key={index}>{cast(accessor, item[accessor])}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Table;
