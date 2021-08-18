import React, { FC } from 'react';
import { UserContract } from '../../../Contracts/user.contract';
import { State } from '../../../Libraries/State';
import NonStudent from './NonStudent';
import Student from './Student';

type Props = {};

const Analytics: FC<Props> = (props) => {
	const user = State.getInstance().get<UserContract>('user');

	return user?.role === 'Student' ? <Student></Student> : <NonStudent />;
};

export default Analytics;
