import { SubjectContract } from '../Contracts/subject.contract';
import { Service } from '../Libraries/Service';

export class SubjectService extends Service<SubjectContract> {}

export const subjectService = new SubjectService('/subjects');
