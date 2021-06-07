import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { CourseContract } from '../../Contracts/course.contract';
import { UserContract } from '../../Contracts/user.contract';
import { outIf } from '../../helpers';
import { State } from '../../Libraries/State';
import { Chart, registerables } from 'chart.js';
import { SubjectContract } from '../../Contracts/subject.contract';
Chart.register(...registerables);

type Props = {};

const Analytics: FC<Props> = (props) => {
	const user = State.getInstance().get<UserContract>('user');
	const [data, setData] = useState({
		students: {
			old: 0,
			new: 0,
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
				axios.get<{ old: number; new: number }>('/analytics/students').then((response) => response.data),
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

		fetch().then(({ courses, subjects }) => {
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
									backgroundColor: [
										'rgba(255, 99, 132, 0.2)',
										'rgba(54, 162, 235, 0.2)',
										'rgba(255, 206, 86, 0.2)',
										'rgba(75, 192, 192, 0.2)',
										'rgba(153, 102, 255, 0.2)',
										'rgba(255, 159, 64, 0.2)',
									],
									borderColor: [
										'rgba(255, 99, 132, 1)',
										'rgba(54, 162, 235, 1)',
										'rgba(255, 206, 86, 1)',
										'rgba(75, 192, 192, 1)',
										'rgba(153, 102, 255, 1)',
										'rgba(255, 159, 64, 1)',
									],
									borderWidth: 1,
								},
							],
						},
						options: {
							scales: {
								y: {
									beginAtZero: true,
								},
							},
						},
					})
				);

				charts.push(
					new Chart($('#subject') as any, {
						type: 'bar',
						data: {
							labels: subjects.map((subject) => subject.code),
							datasets: [
								{
									label: '# of Students',
									data: subjects.map((subject) => subject.students_count),
									backgroundColor: [
										'rgba(255, 99, 132, 0.2)',
										'rgba(54, 162, 235, 0.2)',
										'rgba(255, 206, 86, 0.2)',
										'rgba(75, 192, 192, 0.2)',
										'rgba(153, 102, 255, 0.2)',
										'rgba(255, 159, 64, 0.2)',
									],
									borderColor: [
										'rgba(255, 99, 132, 1)',
										'rgba(54, 162, 235, 1)',
										'rgba(255, 206, 86, 1)',
										'rgba(75, 192, 192, 1)',
										'rgba(153, 102, 255, 1)',
										'rgba(255, 159, 64, 1)',
									],
									borderWidth: 1,
								},
							],
						},
						options: {
							scales: {
								y: {
									beginAtZero: true,
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
		<div className={`container-fluid ${outIf(user?.role === 'Student', 'd-none')}`}>
			<div className='row'>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Old Students</p>
									<span className='text-white h3 mb-0' id='old-students'>
										{data.students.old}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>New Students</p>
									<span className='text-white h3 mb-0' id='new-students'>
										{data.students.new}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Male Students</p>
									<span className='text-white h3 mb-0' id='male-students'>
										{data.genders.males}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6 col-xl-3'>
					<div className='card bg-dark text-white shadow'>
						<div className='card-body'>
							<div className='row align-items-center'>
								<div className='col-3 text-center'>
									<span className='circle circle-sm'>
										<i className='fe fe-16 fe-users mb-0'></i>
									</span>
								</div>
								<div className='col pr-0'>
									<p className='small mb-0'>Female Students</p>
									<span className='text-white h3 mb-0' id='female-students'>
										{data.genders.females}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{user?.role === 'Registrar' ? (
					<>
						<div className='col-12 col-md-6 mt-5'>
							<div className='card bg-dark text-white shadow'>
								<div className='card-body'>
									<div className='row align-items-center'>
										<div className='col-3 text-center'>
											<span className='circle circle-sm'>
												<i className='fe fe-16 fe-users mb-0'></i>
											</span>
										</div>
										<div className='col pr-0'>
											<p className='small mb-0'>Pending Enrollees</p>
											<span className='text-white h3 mb-0' id='pending-enrollees'>
												{data.enrollees.pending}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 col-md-6 mt-5'>
							<div className='card bg-dark text-white shadow'>
								<div className='card-body'>
									<div className='row align-items-center'>
										<div className='col-3 text-center'>
											<span className='circle circle-sm'>
												<i className='fe fe-16 fe-users mb-0'></i>
											</span>
										</div>
										<div className='col pr-0'>
											<p className='small mb-0'>Graduates</p>
											<span className='text-white h3 mb-0' id='graduates'>
												{data.graduates}
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
				<div className='col-12 col-md-6'>
					<div className='card shadow'>
						<div className='card-header'>
							<h4 className='card-title'>Students per Course</h4>
						</div>
						<div className='card-body'>
							<canvas id='course'></canvas>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6'>
					<div className='card shadow'>
						<div className='card-header'>
							<h4 className='card-title'>Students per Subject</h4>
						</div>
						<div className='card-body'>
							<canvas id='subject'></canvas>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
