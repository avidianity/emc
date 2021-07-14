import { ModelContract } from './model.contract';
import { SubjectContract } from './subject.contract';
import { UserContract } from './user.contract';

export interface PreviousSubjectContract extends ModelContract {
	subject_id: number;
	student_id: number;
	subject?: SubjectContract;
	student?: UserContract;
}
