import { CourseContract } from './course.contract';
import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';

export interface SubjectContract extends ModelContract {
	code: string;
	description: string;
	course_id: number;
	level: string;
	term: string;
	units: string;
	course?: CourseContract;
	schedules?: ScheduleContract[];
	users_count?: number;
}
