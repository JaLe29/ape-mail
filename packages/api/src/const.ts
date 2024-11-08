export const loadString = (path: string, allowValues?: string[]): string => {
	const tmp = process.env[path];

	if (!tmp) {
		throw new Error(`Env ${path} was not found!`);
	}

	if (allowValues && !allowValues.includes(tmp)) {
		throw new Error(`Env ${path} is not allowed! Allowed values are: ${JSON.stringify(allowValues, null, 2)}`);
	}

	return tmp;
};

export const loadNullableString = (path: string, allowValues?: string[]): undefined | string => {
	const tmp = process.env[path];

	if (tmp && allowValues && !allowValues.includes(tmp ?? '')) {
		throw new Error(`Env ${path} is not allowed! Allowed values are: ${JSON.stringify(allowValues, null, 2)}`);
	}

	return tmp;
};

export const loadNumber = (path: string): number => {
	const tmp = process.env[path];

	if (!tmp) {
		throw new Error(`Env ${path} was not found!`);
	}

	return parseInt(tmp, 10);
};

export const loadNulableNumber = (path: string): undefined | number => {
	const tmp = process.env[path];

	if (tmp) {
		return parseInt(tmp, 10);
	}
	return undefined;
};

//
export const ENV_SENDGRID_API_KEY = loadString('SENDGRID_API_KEY');
