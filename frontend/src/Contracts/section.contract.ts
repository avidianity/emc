import { CourseContract } from './course.contract';
import { MajorContract } from './major.contract';
import { ModelContract } from './model.contract';
import { ScheduleContract } from './schedule.contract';
import { UserContract } from './user.contract';
import { YearContract } from './year.contract';

export interface SectionContract extends ModelContract {
	name: string;
	level: string;
	term: string;
	course_id: number;
	major_id?: number;
	year_id?: number;
	limit: number;
	course?: CourseContract;
	major?: MajorContract;
	year?: YearContract;
	students?: UserContract[];
	schedules?: ScheduleContract[];
	students_count?: number;
}
