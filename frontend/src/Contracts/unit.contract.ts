import { CourseContract } from './course.contract';
import { MajorContract } from './major.contract';
import { ModelContract } from './model.contract';

export interface UnitContract extends ModelContract {
	units: number;
	course_id: number;
	major_id?: number;
	level: string;
	term: string;
	course?: CourseContract;
	major?: MajorContract;
}
