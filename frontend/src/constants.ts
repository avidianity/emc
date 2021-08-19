export const statuses = {
	'Not Paid': 'danger',
	'Fully Paid': 'success',
	'Partially Paid': 'warning',
};

export const DEVELOPMENT = process.env.NODE_ENV === 'development';

export const PRODUCTION = process.env.NODE_ENV === 'production';

export const TESTING = process.env.NODE_ENV === 'test';
