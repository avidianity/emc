import { ModelContract } from './model.contract';
import { SubjectContract } from './subject.contract';
import { UserContract } from './user.contract';
import { YearContract } from './year.contract';

export interface GradeContract extends ModelContract {
	student_id: number;
	subject_id: number;
	teacher_id: number;
	grade: number;
	status: string;
	year_id: number;
	year?: YearContract;
	subject?: SubjectContract;
	teacher?: UserContract;
	student?: UserContract;
}
