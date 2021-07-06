import { UnitContract } from '../Contracts/unit.contract';
import { Service } from '../Libraries/Service';

export class UnitService extends Service<UnitContract> {}

export const unitService = new UnitService('/units');
