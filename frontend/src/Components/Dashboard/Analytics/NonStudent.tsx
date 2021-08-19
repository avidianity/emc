import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { CourseContract } from '../../../Contracts/course.contract';
import { SubjectContract } from '../../../Contracts/subject.contract';
import { UserContract } from '../../../Contracts/user.contract';
import { State } from '../../../Libraries/State';

Chart.register(...registerables);

type Props = {};

const NonStudent: FC<Props> = (props) => {
	const user = State.getInstance().get<UserContract>('user');
	const [data, setData] = useState({
		students: {
			old: 0,
			new: 0,
			total: 0,
		},
		courses: [] as CourseContract[],
		genders: {
			males: 0,
			females: 0,
		},
		graduates: 0,
		enrollees: {
			pending: 0,
		},
		subjects: [] as SubjectContract[],
	});

	const fetch = async () => {
		try {
			const [students, courses, genders, graduates, enrollees, subjects] = await Promise.all([
				axios.get<{ old: number; new: number; total: number }>('/analytics/students').then((response) => response.data),
				axios.get<CourseContract[]>('/analytics/courses').then((response) => response.data),
				axios.get<{ males: number; females: number }>('/analytics/genders').then((response) => response.data),
				axios.get<number>('/analytics/graduates').then((response) => response.data),
				axios.get<{ pending: number }>('/analytics/enrollees').then((response) => response.data),
				axios.get<SubjectContract[]>('/analytics/subjects').then((response) => response.data),
			]);
			setData({
				students,
				courses,
				subjects,
				genders,
				graduates,
				enrollees,
			});

			return {
				courses,
				subjects,
			};
		} catch (error) {
			console.log(error);
			return {
				courses: [],
				subjects: [],
			};
		}
	};

	useEffect(() => {
		const charts: Chart<any>[] = [];

		fetch().then(({ courses }) => {
			try {
				charts.push(
					new Chart($('#course') as any, {
						type: 'bar',
						data: {
							labels: courses.map((course) => course.code),
							datasets: [
								{
									label: '# of Students',
									data: courses.map((course) => course.admissions_count),
									backgroundColor: ['#4fa1ff'],
									borderColor: ['#4fa1ff'],
									borderWidth: 0,
								},
							],
						},
						options: {
							scales: {
								y: {
									beginAtZero: true,
									ticks: {
										precision: 0,
									},
								},
							},
						},
					})
				);
			} catch (error) {
				console.log('chartjs', error);
			}
		});

		return () => {
			charts.forEach((chart) => chart.destroy());
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className={`container-fluid`}>
			<div className='row'>
				<div className={`col-12 col-md-${user?.role === 'Registrar' ? '3' : '6'}`}>
					<div className='card text-dark shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Male Students</p>
									<span className='h3 mb-0' id='male-students'>
										{data.genders.males}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`col-12 col-md-${user?.role === 'Registrar' ? '3' : '6'}`}>
					<div className='card text-dark shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Female Students</p>
									<span className='h3 mb-0' id='female-students'>
										{data.genders.females}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{user?.role === 'Registrar' ? (
					<>
						<div className='col-12 col-md-3'>
							<div className='card text-dark shadow'>
								<div className='card-body'>
									<div className='row align-items-center'>
										<div className='col-3 text-center'>
											<span className='circle circle-sm'>
												<i className='fe fe-16 fe-users mb-0'></i>
											</span>
										</div>
										<div className='col pr-0'>
											<p className='small mb-0'>Pending Enrollees</p>
											<span className='h3 mb-0' id='pending-enrollees'>
												{data.enrollees.pending}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='card text-dark shadow'>
								<div className='card-body'>
									<div className='row align-items-center'>
										<div className='col-3 text-center'>
											<span className='circle circle-sm'>
												<i className='fe fe-16 fe-users mb-0'></i>
											</span>
										</div>
										<div className='col pr-0'>
											<p className='small mb-0'>Total Students</p>
											<span className='h3 mb-0' id='total-students'>
												{data.students.total}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				) : null}
				<div className='col-12'>
					<hr className='mt-5' />
				</div>
				<div className='col-12'>
					<div className='card shadow'>
						<div className='card-header'>
							<h4 className='card-title'>Students per Course</h4>
						</div>
						<div className='card-body'>
							<canvas id='course'></canvas>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NonStudent;
