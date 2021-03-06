import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouteMatch } from 'react-router-dom';
import { SectionContract } from './Contracts/section.contract';
import { YearContract } from './Contracts/year.contract';

export function useURL() {
	const match = useRouteMatch();

	return (path: string) => {
		const rootFragments = match.path.split('');
		const pathFragments = path.split('');

		if (rootFragments.last() === '/' && pathFragments.first() === '/') {
			rootFragments.pop();
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		} else if (rootFragments.last() !== '/' && pathFragments.first() !== '/') {
			rootFragments.push('/');
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		} else if (rootFragments.last() !== '/' && pathFragments.first() !== '/') {
			rootFragments.push('/');
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		} else {
			return `${rootFragments.join('')}${pathFragments.join('')}`;
		}
	};
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

			return undefined;
		},
		{
			onSuccess(year) {
				options?.onSuccess(year);
			},
		}
	);
}

export function useCurrentSection() {
	const { data } = useQuery('current-section', async () => {
		try {
			const { data } = await axios.get<SectionContract>('/sections/current');
			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	});

	return data;
}
