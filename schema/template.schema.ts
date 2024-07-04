import { z } from 'zod';

export const removeTemplate = z.object({
	id: z.string().uuid(),
});

export const oneTemplate = z.object({
	id: z.string().uuid(),
});

export const createTemplate = z.object({
	name: z.string(),
	body: z.string(),
	subject: z.string(),
	key: z.string(),
});

export const updateTemplate = z.object({
	id: z.string().uuid(),
	name: z.string(),
	body: z.string(),
	subject: z.string(),
	key: z.string(),
});
