import { AdmissionContract } from '../Contracts/admission.contract';
import { Service } from '../Libraries/Service';

export class AdmissionService extends Service<AdmissionContract> {}

export const admissionService = new AdmissionService('/admissions');
