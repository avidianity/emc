import axios from 'axios';
import React, { FC, useMemo } from 'react';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { CourseContract } from '../../Contracts/course.contract';
import { MajorContract } from '../../Contracts/major.contract';
import { SubjectContract } from '../../Contracts/subject.contract';
import { UserContract } from '../../Contracts/user.contract';
import { handleError, Asker } from '../../helpers';
import { useNullable, useURL } from '../../hooks';
import { State } from '../../Libraries/State';
import { courseService } from '../../Services/course.service';
import { subjectService } from '../../Services/subject.service';
import Table, { TableColumn } from '../Shared/Table';
import Tooltip from '../Shared/Tooltip';

type Props = {};

const List: FC<Props> = (props) => {
	const { data: items, isFetching: loading, isError, error, refetch } = useQuery('subjects', () => subjectService.fetch());
	const { data: courses } = useQuery('courses', () => courseService.fetch());
	const [course, setCourse] = useNullable<CourseContract>();
	const [major, setMajor] = useNullable<MajorContract>();

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	const deleteItem = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this Subject?')) {
				await subjectService.delete(id);
				toastr.info('Subject has been deleted.', 'Notice');
				refetch();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const user = State.getInstance().get<UserContract>('user');

	const columns: TableColumn[] = [
		{
			title: 'Subject Code',
			accessor: 'code',
			minWidth: '150px',
		},
		{
			title: 'Subject Description',
			accessor: 'description',
			minWidth: '450px',
		},
		{
			title: 'Course',
			accessor: 'course_name',
			minWidth: '350px',
		},
		{
			title: 'Year Level',
			accessor: 'level',
			minWidth: '150px',
		},
		{
			title: 'Semester',
			accessor: 'term',
			minWidth: '150px',
		},
		{
			title: 'Units',
			accessor: 'units',
		},
	];

	if (['Registrar', 'Teacher'].includes(user?.role || '')) {
		columns.push({
			title: 'Actions',
			minWidth: '100px',
			cell: (subject: SubjectContract) => (
				<>
					{user?.role === 'Teacher' ? (
						<>
							<Link to={url(`${subject.id}/view`)} className='btn btn-info btn-sm mx-1' data-tip='View'>
								<i className='fas fa-eye'></i>
							</Link>
							<a
								href={`${axios.defaults.baseURL}/exports/teacher/classlist/${subject.id}`}
								download
								className={`btn btn-warning btn-sm mx-1 ${
									subject.students_count && subject.students_count > 0 ? '' : 'disabled'
								}`}
								data-tip='Download Classlist'>
								<i className='fas fa-file-excel'></i>
							</a>
						</>
					) : null}
					{user?.role === 'Registrar' ? (
						<>
							<Link to={url(`${subject.id}/edit`)} className='btn btn-warning btn-sm mx-1' data-tip='Edit'>
								<i className='fas fa-edit'></i>
							</Link>
							<button
								className='btn btn-danger btn-sm mx-1'
								onClick={(e) => {
									e.preventDefault();
									deleteItem(subject.id);
								}}
								data-tip='Delete'>
								<i className='fas fa-trash'></i>
							</button>
						</>
					) : null}
				</>
			),
		});
	}

	const refine = (items: SubjectContract[]) =>
		items
			.filter((subject) => {
				if (course && major) {
					return subject.course_id === course.id && subject.major_id === major.id;
				} else if (course) {
					return subject.course_id === course.id;
				} else if (major) {
					return subject.major_id === major.id;
				}

				return true;
			})
			.map((subject) => ({
				...subject,
				course_name: `${subject.course?.code}${subject.major ? ` - Major in ${subject.major.name}` : ''}`,
			}));

	const memoizedRefine = useCallback(refine, [refine]);

	const memoized = useMemo(() => memoizedRefine(items || []), [items, memoizedRefine]);
	const raw = refine(items || []);

	return (
		<>
			<Table
				onRefresh={() => refetch()}
				title='Subjects'
				loading={loading}
				items={items && items.length >= 250 ? memoized : raw}
				columns={columns}
				buttons={
					<>
						{user?.role === 'Registrar' ? (
							<Link to={url(`add`)} className='btn btn-primary btn-sm ml-2' data-tip='Add Subject'>
								<i className='fas fa-plus'></i>
							</Link>
						) : null}
					</>
				}
				misc={
					<>
						<label className='mb-0 mt-2 mx-1'>
							Course:
							<select
								className='custom-select custom-select-sm form-control form-control-sm'
								onChange={(e) => {
									const id = e.target.value.toNumber();
									if (id === 0) {
										setCourse(null);
										setMajor(null);
									} else {
										const course = courses?.find((course) => course.id === id);
										if (course) {
											setCourse(course);
										}
									}
								}}>
								<option value='0'>All</option>
								{courses?.map((course, index) => (
									<option value={course.id} key={index}>
										{course.code}
									</option>
								))}
							</select>
						</label>
						{course ? (
							<label className='mb-0 mt-2 mx-1'>
								Major:
								<select
									className='custom-select custom-select-sm form-control form-control-sm'
									onChange={(e) => {
										const id = e.target.value.toNumber();
										if (id === 0) {
											setMajor(null);
										} else {
											const major = course?.majors?.find((major) => major.id === id);
											if (major) {
												setMajor(major);
											}
										}
									}}>
									<option value='0'>All</option>
									{course.majors?.map((major, index) => (
										<option value={major.id} key={index}>
											{major.name}
										</option>
									))}
								</select>
							</label>
						) : null}
					</>
				}
			/>
			<Tooltip />
		</>
	);
};

export default List;
