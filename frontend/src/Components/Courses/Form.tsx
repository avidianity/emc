import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { Asker, handleError, setValues } from '../../helpers';
import { useArray, useMode } from '../../hooks';
import { courseService } from '../../Services/course.service';

type Props = {};

type Inputs = CourseContract & { force: boolean };

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useMode();
	const { register, setValue, handleSubmit, reset } = useForm<Inputs>({
		defaultValues: {
			force: false,
		},
	});
	const [id, setID] = useState(-1);
	const [majors, setMajors] = useArray<MajorContract>();
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();

	const fetch = async (id: any) => {
		try {
			const data = await courseService.fetchOne(id);
			setID(data.id!);
			setValues(setValue, data);
			setMajors(data.majors!);
			setMode('Edit');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (data: Inputs) => {
		const formats = [/[A-Z]{4}/g, /[A-Z]{4} - [A-Z]{1,}/g];
		for (const format of formats) {
			if (format.test(data.code)) {
				setProcessing(true);
				try {
					data.majors = majors;
					await (mode === 'Add' ? courseService.create(data) : courseService.update(id, data));
					toastr.success('Course has been saved successfully.');
					setMajors([]);
					return reset();
				} catch (error: any) {
					if (error.response?.status === 409) {
						if (await Asker.save(error.response?.data?.message)) {
							data.force = true;
							await submit(data);
							return;
						}
					} else {
						handleError(error);
					}
				} finally {
					setProcessing(false);
				}
				return;
			}
		}
		return toastr.error('Course Code does not follow correct format.');
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
							<label htmlFor='code' className='required'>
								Course Code
							</label>
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
						<div className='form-group'>
							<h4>Majors</h4>
							<button
								className='btn btn-info btn-sm'
								onClick={(e) => {
									e.preventDefault();
									majors.push({ name: '', course_id: 0, short_name: '' });
									setMajors([...majors]);
								}}>
								Add
							</button>
							<small className='my-3 form-text text-muted'>
								Example: <br />
								Name: 'Mathematics'
								<br /> Short Name: 'M'
							</small>
							<div className='row'>
								{majors.map((major, index) => (
									<div className='col-12 col-md-6 col-lg-4 col-xl-3 p-2' key={index}>
										<div className='p-2 border rounded'>
											<button
												className='btn btn-danger btn-sm mb-2'
												onClick={(e) => {
													e.preventDefault();
													majors.splice(index, 1);
													setMajors([...majors]);
												}}>
												Remove
											</button>
											<div className='my-2'>
												<h5 className='mb-0'>Major {index + 1}</h5>
											</div>
											<div className='form-group'>
												<label htmlFor={`name-${index}`} className='required'>
													Name
												</label>
												<input
													type='text'
													id={`name-${index}`}
													className='form-control'
													onChange={(e) => {
														major.name = e.target.value;
														majors.splice(index, 1, major);
														setMajors([...majors]);
													}}
													value={major.name}
												/>
											</div>
											<div className='form-group'>
												<label htmlFor={`short-name-${index}`}>Short Name</label>
												<input
													type='text'
													id={`short-name-${index}`}
													className='form-control'
													onChange={(e) => {
														major.short_name = e.target.value;
														majors.splice(index, 1, major);
														setMajors([...majors]);
													}}
													value={major.short_name}
												/>
											</div>
										</div>
									</div>
								))}
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
