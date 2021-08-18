import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { SubjectContract } from '../../../Contracts/subject.contract';
import { UserContract } from '../../../Contracts/user.contract';
import { useArray } from '../../../hooks';
import { State } from '../../../Libraries/State';

type Props = {};

const Student: FC<Props> = (props) => {
	const user = State.getInstance().get<UserContract>('user');
	const [failed, setFailed] = useArray<SubjectContract>();

	useEffect(() => {
		axios
			.get('/auth/subjects')
			.then((response) => setFailed(response.data))
			.catch(console.error);
		// eslint-disable-next-line
	}, []);

	if (!user) {
		return null;
	}

	return (
		<div className='container'>
			<div className='card'>
				<div className='card-body'>
					<h4 className='card-title'>
						{user.last_name}, {user.first_name} {user.middle_name || ''}
					</h4>
					<p className='card-text'>
						{(() => {
							switch (user.payment_status) {
								case 'Partially Paid':
									return 'Please settle your remaining balance, you will be left behind upon increment if you are unable to settle your account balance.';
								case 'Fully Paid':
									return 'You are fully paid.';
								case 'Not Paid':
									return 'You have not paid. Please settle your account balance.';
							}
						})()}
					</p>
					{failed.length > 0 ? (
						<>
							<h6>Failed Subjects</h6>
							<div className='row'>
								{failed.map((subject, index) => (
									<div className='col-12 col-md-6 col-lg-4' key={index}>
										<p>{subject.description}</p>
									</div>
								))}
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Student;
