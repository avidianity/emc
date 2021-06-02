import { CourseContract } from './course.contract';
import { ModelContract } from './model.contract';

export interface AdmissionContract extends ModelContract {
	course_id: number;
	level: string;
	status: string;
	term: string;
	graduated: boolean;
	student_id: number;
	course?: CourseContract;
}
