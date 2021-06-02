import React, { FC } from 'react';
import { UserContract } from '../../Contracts/user.contract';
import { outIf } from '../../helpers';
import { State } from '../../Libraries/State';

type Props = {};

const Analytics: FC<Props> = (props) => {
	const user = State.getInstance().get<UserContract>('user');

	return (
		<div className={`container ${outIf(user?.role === 'Student', 'd-none')}`}>
			<div className='row'>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Old Students</p>
									<span className='text-white h3 mb-0' id='old-students'>
										0
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>New Students</p>
									<span className='text-white h3 mb-0' id='new-students'>
										0
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Male Students</p>
									<span className='text-white h3 mb-0' id='male-students'>
										0
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Female Students</p>
									<span className='text-white h3 mb-0' id='female-students'>
										0
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{user?.role === 'Registrar' ? (
					<>
						<div className='col-12 col-md-6 mt-5'>
							<div className='card bg-dark text-white shadow'>
								<div className='card-body'>
									<div className='row align-items-center'>
										<div className='col-3 text-center'>
											<span className='circle circle-sm'>
												<i className='fe fe-16 fe-users mb-0'></i>
											</span>
										</div>
										<div className='col pr-0'>
											<p className='small mb-0'>Pending Enrollees</p>
											<span className='text-white h3 mb-0' id='pending-enrollees'>
												0
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 col-md-6 mt-5'>
							<div className='card bg-dark text-white shadow'>
								<div className='card-body'>
									<div className='row align-items-center'>
										<div className='col-3 text-center'>
											<span className='circle circle-sm'>
												<i className='fe fe-16 fe-users mb-0'></i>
											</span>
										</div>
										<div className='col pr-0'>
											<p className='small mb-0'>Graduates</p>
											<span className='text-white h3 mb-0' id='graduates'>
												0
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				) : null}
				<div className='col-12'>
					<div className='container mt-5'>
						<div className='card shadow bg-dark text-white'>
							<div className='card-header'>
								<h4 className='card-title'>Students per Course</h4>
							</div>
							<div className='card-body table-responsive'>
								<table id='analytics-courses-table' className='table table-hover'>
									<thead className='thead-dark'>
										<tr>
											<th>Code</th>
											<th>Description</th>
											<th>Students</th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
