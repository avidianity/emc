import { YearContract } from '../Contracts/year.contract';
import { Service } from '../Libraries/Service';

export class YearService extends Service<YearContract> {}

export const yearService = new YearService('/years');
