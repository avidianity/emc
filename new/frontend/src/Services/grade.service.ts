import { GradeContract } from '../Contracts/grade.contract';
import { Service } from '../Libraries/Service';

export class GradeService extends Service<GradeContract> {}

export const gradeService = new GradeService('/grades');
