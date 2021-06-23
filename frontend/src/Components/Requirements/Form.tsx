import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { RequirementContract } from '../../Contracts/requirement.contract';
import { Asker, handleError, setValues } from '../../helpers';
import { useMode } from '../../hooks';
import { requirementService } from '../../Services/requirement.service';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<RequirementContract>();
	const [id, setID] = useState(-1);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();

	const fetch = async (id: any) => {
		try {
			const data = await requirementService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: RequirementContract) => {
		setProcessing(true);
		try {
			if (mode === 'Edit' && (await Asker.notice('Are you sure you want to update?')) === false) {
				return;
			}
			await (mode === 'Add' ? requirementService.create(data) : requirementService.update(id, data));
			toastr.success('Requirement has been saved successfully.');
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
					<h5 className='card-title'>{mode} Requirement</h5>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-group'>
							<label htmlFor='name'>Name</label>
							<input {...register('name')} type='text' id='code' className='form-control' disabled={processing} />
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
