import { RequirementContract } from '../Contracts/requirement.contract';
import { Service } from '../Libraries/Service';

export class RequirementService extends Service<RequirementContract> {}

export const requirementService = new RequirementService('/requirements');
