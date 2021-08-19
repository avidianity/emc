import React, { forwardRef, useEffect } from 'react';

type Props = {};

const Loader = forwardRef<HTMLDivElement, Props>((props, ref) => {
	useEffect(() => {
		if (typeof ref === 'object' && ref?.current) {
			$(ref.current).modal({
				backdrop: 'static',
				keyboard: false,
				focus: false,
				show: false,
			});
		}
	}, [ref]);

	return (
		<div ref={ref} className='modal' tabIndex={-1}>
			<div className='modal-dialog modal-dialog-centered modal-md'>
				<div className='modal-content border-0 shadow' style={{ borderRadius: '10px' }}>
					<div className='modal-body'>
						<div className='p-5'>
							<h1 className='modal-title text-center'>Please Wait</h1>
							<div className='d-flex h-100 w-100 align-items-center justify-content-center'>
								<i className='fas fa-sync fa-6x fa-spin text-dark'></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Loader;
