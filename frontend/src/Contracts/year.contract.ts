import { ModelContract } from './model.contract';

export interface YearContract extends ModelContract {
	start: number;
	end: number;
	semester: string;
	semester_start: string;
	semester_end: string;
	registration_start: string;
	registration_end: string;
	current: boolean;
	grade_start: string;
	grade_end: string;
}
