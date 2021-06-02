import React, { FC } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { routes } from '../../routes';
import Form from './Form';
import Selection from './Selection';

type Props = {};

const Login: FC<Props> = (props) => {
	const url = useURL();
	const state = State.getInstance();
	const history = useHistory();

	if (state.has('user')) {
		history.push(routes.DASHBOARD);
		return null;
	}

	return (
		<Switch>
			<Route path={url('/')} exact component={Selection} />
			<Route path={url('/:role')} component={Form} />
		</Switch>
	);
};

export default Login;
