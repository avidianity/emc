import { ModelContract } from './model.contract';

export interface LogContract<T = any> extends ModelContract {
	payload: T;
	message: string;
}
