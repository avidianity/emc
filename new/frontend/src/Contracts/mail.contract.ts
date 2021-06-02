import { ModelContract } from './model.contract';

export interface MailContract extends ModelContract {
	uuid: string;
	to: string;
	subject: string;
	status: string;
	sent: string | null;
	body: string;
}
