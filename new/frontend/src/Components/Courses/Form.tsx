import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { CourseContract } from '../../Contracts/course.contract';
import { handleError, setValues } from '../../helpers';
import { useMode } from '../../hooks';
import { courseService } from '../../Services/course.service';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<CourseContract>();
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();

	const fetch = async (id: any) => {
		try {
			const data = await courseService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: CourseContract) => {
		setProcessing(true);
		try {
			await (mode === 'Add' ? courseService.create(data) : courseService.update(id, data));
			toastr.success('Course has been saved successfully.');
			reset();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			fetch(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title'>{mode} Course</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-group'>
							<label htmlFor='code'>Course Code</label>
							<input {...register('code')} type='text' id='code' className='form-control' disabled={processing} />
							<small className='form-text text-muted'>
								Course code may not be editable in the future, be careful on your entry.
							</small>
						</div>
						<div className='form-group'>
							<label htmlFor='description'>Course Description</label>
							<textarea
								{...register('description')}
								id='description'
								cols={30}
								rows={4}
								className='form-control'
								disabled={processing}></textarea>
						</div>
						<div className='form-group'>
							<div className='custom-control custom-checkbox'>
								<input
									{...register('open')}
									type='checkbox'
									className='custom-control-input'
									id='open'
									disabled={processing}
								/>
								<label className='custom-control-label' htmlFor='open'>
									Open for Enrollment
								</label>
							</div>
						</div>
						<div className='form-group d-flex'>
							<button type='button' className='btn btn-secondary' onClick={() => history.goBack()} disabled={processing}>
								Return
							</button>
							<button type='submit' className='btn btn-primary ml-auto' disabled={processing}>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
