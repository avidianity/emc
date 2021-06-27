import { CourseContract } from './course.contract';
import { ModelContract } from './model.contract';
import { UserContract } from './user.contract';
import { YearContract } from './year.contract';

export interface SectionContract extends ModelContract {
	name: string;
	level: string;
	term: string;
	course_id: number;
	year_id: number;
	course?: CourseContract;
	year?: YearContract;
	students?: UserContract[];
}
