import { CourseContract } from './course.contract';
import { ModelContract } from './model.contract';
import { UserContract } from './user.contract';
import { YearContract } from './year.contract';

export interface AdmissionContract extends ModelContract {
	course_id: number;
	level: string;
	status: string;
	term: string;
	pre_registration?: boolean;
	student_id: number;
	year_id: number;
	requirements: string[];
	course?: CourseContract;
	student?: UserContract;
	year?: YearContract;
}
