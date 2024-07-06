import { z } from 'zod';

const TEMPLATE_PATTERN = /\{\{(.*?)\}\}/g;

export const getTemplates = (html: string) => {
	const templates: string[] = [];

	const matches = html.match(TEMPLATE_PATTERN);

	matches?.forEach(match => {
		templates.push(match.replace(/\{\{|\}\}/g, ''));
	});

	return templates;
};

export const replaceTemplates = (html: string, templates: Record<string, string | number>) => {
	let newHtml = html;

	Object.keys(templates).forEach(key => {
		newHtml = newHtml.replace(new RegExp(`{{${key}}}`, 'g'), `${templates[key]}`);
	});

	return newHtml;
};

export const isUUID = (uuid: string) => {
	const uuidV4Schema = z.string().uuid();
	try {
		uuidV4Schema.parse(uuid);
		return true;
	} catch {
		return false;
	}
};
