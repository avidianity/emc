import { SectionContract } from '../Contracts/section.contract';
import { Service } from '../Libraries/Service';

export class SectionService extends Service<SectionContract> {}

export const sectionService = new SectionService('/sections');
