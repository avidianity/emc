import { ModelContract } from './model.contract';

export interface MajorContract extends ModelContract {
	name: string;
	short_name: string;
	course_id: number;
}
