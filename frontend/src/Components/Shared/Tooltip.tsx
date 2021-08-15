import React, { FC, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

type Props = {};

const Tooltip: FC<Props> = (props) => {
	useEffect(() => {
		ReactTooltip.rebuild();
	});

	return <ReactTooltip />;
};

export default Tooltip;
