import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useURL } from '../../hooks';

type Props = {};

const Selection: FC<Props> = (props) => {
	const url = useURL();

	return (
		<div className='vh-100 d-flex'>
			<div className='card align-self-center mx-auto'>
				<div className='card-body'>
					<Link className='m-2 d-block btn btn-primary btn-lg' to={url(`admin`)}>
						Admin
					</Link>
					<Link className='m-2 d-block btn btn-info btn-lg' to={url(`registrar`)}>
						Registrar
					</Link>
					<Link className='m-2 d-block btn btn-success btn-lg' to={url(`teacher`)}>
						Teacher
					</Link>
					<Link className='m-2 d-block btn btn-danger btn-lg' to={url(`student`)}>
						Student
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Selection;
