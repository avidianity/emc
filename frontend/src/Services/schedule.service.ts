import { ScheduleContract } from '../Contracts/schedule.contract';
import { Service } from '../Libraries/Service';

export class ScheduleService extends Service<ScheduleContract> {}

export const scheduleService = new ScheduleService('/schedules');
