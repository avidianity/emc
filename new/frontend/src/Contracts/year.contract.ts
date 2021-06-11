import { ModelContract } from './model.contract';

export interface YearContract extends ModelContract {
	start: number;
	end: number;
	semester_start: string;
	semester_end: string;
	current: boolean;
}
