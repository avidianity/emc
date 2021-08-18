import axios from 'axios';
import { FreeObject } from '../Contracts/misc';
import { SectionContract } from '../Contracts/section.contract';
import { Service } from '../Libraries/Service';

export class SectionService extends Service<SectionContract> {
	async advance(params?: FreeObject) {
		const { data } = await axios.get<SectionContract[]>(`${this.resolveURL(params)}/advance`);

		return data;
	}
}

export const sectionService = new SectionService('/sections');
