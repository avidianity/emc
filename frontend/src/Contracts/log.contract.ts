import { ModelContract } from './model.contract';
import { UserContract } from './user.contract';

export interface LogContract extends ModelContract {
	payload: UserContract;
	message: string;
	ip_address: string;
	device: string;
	browser: string;
}
