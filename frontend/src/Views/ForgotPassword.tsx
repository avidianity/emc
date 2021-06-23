import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {};

type Inputs = {
	old_password: string;
	new_password: string;
};

const ForgotPassword: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit } = useForm<Inputs>();

	const submit = async (data: Inputs) => {};

	return (
		<div className='container-fluid d-flex'>
			<div className='mx-auto'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='form-group'>
						<label htmlFor='old_password'>Old Password</label>
						<input
							{...register('old_password')}
							type='password'
							id='old_password'
							className='form-control'
							disabled={processing}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='new_password'>New Password</label>
						<input
							{...register('new_password')}
							type='password'
							id='new_password'
							className='form-control'
							disabled={processing}
							pattern='^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$'
						/>
						<small className='form-text text-muted'>
							Password must contain atleast uppercase and lowercase letters, numbers and special characters.
						</small>
					</div>
					<div className='form-group'>
						<button type='submit' className='btn btn-primary btn-sm' disabled={processing}>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
