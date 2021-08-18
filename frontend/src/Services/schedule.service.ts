import axios from 'axios';
import { FreeObject } from '../Contracts/misc';
import { ScheduleContract } from '../Contracts/schedule.contract';
import { Service } from '../Libraries/Service';

export class ScheduleService extends Service<ScheduleContract> {
	async advance(params?: FreeObject) {
		const { data } = await axios.get<ScheduleContract[]>(`${this.resolveURL(params)}/advance`);

		return data;
	}
}

export const scheduleService = new ScheduleService('/schedules');
