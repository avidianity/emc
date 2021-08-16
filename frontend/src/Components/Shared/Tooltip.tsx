import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';

type Props = {};

const Tooltip: FC<Props> = (props) => {
	const history = useHistory();

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	useEffect(() => {
		const unlisten = history.listen(() => ReactTooltip.rebuild());
		return () => {
			unlisten();
		};
	}, [history]);

	return <ReactTooltip />;
};

export default Tooltip;
