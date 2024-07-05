import { TemplateType } from '@prisma/client';
import { z } from 'zod';

export const removeTemplate = z.object({
	id: z.string().uuid(),
});

export const oneTemplate = z.object({
	id: z.string().uuid(),
});

export const listTemplate = z.object({
	type: z.nativeEnum(TemplateType).optional(),
});

export const createTemplate = z.object({
	name: z.string(),
	body: z.string(),
	subject: z.string(),
	key: z.string(),
	type: z.nativeEnum(TemplateType),
	rootTemplateId: z.string().uuid().optional(),
});

export const updateTemplate = z.object({
	id: z.string().uuid(),
	name: z.string(),
	body: z.string(),
	subject: z.string(),
	key: z.string(),
	type: z.nativeEnum(TemplateType),
	rootTemplateId: z.string().uuid().optional(),
});
