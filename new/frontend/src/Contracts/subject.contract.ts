import { CourseContract } from './course.contract';
import { MajorContract } from './major.contract';
import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';

export interface SubjectContract extends ModelContract {
	code: string;
	description: string;
	course_id: number;
	level: string;
	term: string;
	units: string;
	major_id?: number;
	course?: CourseContract;
	schedules?: ScheduleContract[];
	major?: MajorContract;
	students_count?: number;
}
