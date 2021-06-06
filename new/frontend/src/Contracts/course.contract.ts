import { ModelContract } from './model.contract';

export interface CourseContract extends ModelContract {
	code: string;
	description: string;
	open: boolean;
	majors: string;
}
