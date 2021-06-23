import dayjs from 'dayjs';
import React, { createRef, FC } from 'react';
import { useQuery } from 'react-query';
import { FreeObject } from '../../Contracts/misc';
import { handleError } from '../../helpers';
import { mailService } from '../../Services/mail.service';
import Table from '../Shared/Table';

type Props = {};

const colors: FreeObject = {
	Sent: 'success',
	Pending: 'warning',
	Failed: 'danger',
};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('mails', () => mailService.fetch());
	const modalRef = createRef<HTMLDivElement>();

	if (isError) {
		handleError(error);
	}

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Email Outbox'
				loading={loading}
				items={
					items?.map((mail) => ({
						...mail,
						created_at: dayjs(mail.created_at).format('MMMM DD, YYYY hh:mm A'),
						status: <span className={`badge badge-${colors[mail.status]}`}>{mail.status}</span>,
						sent: mail.sent ? dayjs(mail.sent).format('MMMM DD, YYYY hh:mm A') : '',
						actions: (
							<>
								<button
									className='btn btn-primary btn-sm mx-1'
									onClick={(e) => {
										e.preventDefault();
										if (modalRef.current) {
											const modal = $(modalRef.current);

											modal.find('.modal-body').html(mail.body);
											modal.find('#password').addClass('d-none');
											modal.modal('show');
										}
									}}>
									View
								</button>
							</>
						),
					})) || []
				}
				columns={[
					{
						title: 'Created',
						accessor: 'created_at',
					},
					{
						title: 'To',
						accessor: 'to',
					},
					{
						title: 'Subject',
						accessor: 'subject',
					},
					{
						title: 'Status',
						accessor: 'status',
					},
					{
						title: 'Sent',
						accessor: 'sent',
					},
					{
						title: 'Actions',
						accessor: 'actions',
					},
				]}
			/>
			<div ref={modalRef} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>View Mail</h5>
							<button type='button' className='close' data-dismiss='modal'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'></div>
						<div className='modal-footer'>
							<button type='button' className='btn btn-secondary btn-sm' data-dismiss='modal'>
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
