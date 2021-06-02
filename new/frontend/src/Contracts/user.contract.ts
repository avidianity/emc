import { AdmissionContract } from './admission.contract';
import { ModelContract } from './model.contract';

export interface UserContract extends ModelContract {
	uuid: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	gender?: string;
	address?: string;
	place_of_birth?: string;
	birthday?: string;
	role: string;
	email: string;
	number: string;
	active: boolean;
	password: string;
	fathers_name?: string;
	mothers_name?: string;
	fathers_occupation?: string;
	mothers_occupation?: string;
	admissions?: AdmissionContract[];
}
