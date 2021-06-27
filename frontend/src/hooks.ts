import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouteMatch } from 'react-router-dom';
import { SectionContract } from './Contracts/section.contract';
import { YearContract } from './Contracts/year.contract';

export function useURL() {
	const match = useRouteMatch();

	return (path: string) => `${match.path}${path}`;
}

export function useMode() {
	return useState<'Add' | 'Edit'>('Add');
}

export function useNullable<T>(data?: T) {
	return useState<T | null>(data || null);
}

export function useArray<T>(data?: T[]) {
	return useState<T[]>(data || []);
}

export function useCurrentYear(options?: { onSuccess: (year?: YearContract) => void }) {
	return useQuery(
		['years', 'current'],
		async () => {
			const { data } = await axios.get<YearContract | null>('/years/current');
			if (data) {
				return data;
			}
		},
		{
			onSuccess(year) {
				options?.onSuccess(year);
			},
		}
	);
}

export function useCurrentSection() {
	const [section, setSection] = useNullable<SectionContract>();

	useEffect(() => {
		axios
			.get('/sections/current')
			.then((response) => setSection(response.data))
			.catch((error) => console.log(error.toJSON()));
		// eslint-disable-next-line
	}, []);

	return section;
}
