import { LogContract } from '../Contracts/log.contract';
import { Service } from '../Libraries/Service';

export class LogService extends Service<LogContract> {}

export const logService = new LogService('/logs');
