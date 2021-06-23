import { MajorContract } from './major.contract';
import { ModelContract } from './model.contract';

export interface CourseContract extends ModelContract {
	code: string;
	description: string;
	open: boolean;
	majors?: MajorContract[];
	admissions_count?: number;
}
