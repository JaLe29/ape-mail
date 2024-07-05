import { createTemplate, listTemplate, oneTemplate, removeTemplate, updateTemplate } from '@/schema/template.schema';
import { prisma } from '@/server/prisma';
import { TemplateType } from '@prisma/client';
import { publicProcedure, router } from '../trpc';

export const templateRouter = router({
	list: publicProcedure.input(listTemplate).query(async ({ input }) => {
		const result = await prisma.template.findMany({ where: { type: input.type } });
		return result;
	}),
	one: publicProcedure.input(oneTemplate).query(async ({ input }) => {
		const { id } = input;
		const result = await prisma.template.findUnique({ where: { id } });
		return result;
	}),
	update: publicProcedure.input(updateTemplate).mutation(async ({ input }) => {
		const { id, ...data } = input;

		await prisma.template.update({
			where: {
				id,
			},
			data: {
				...data,
				subject: input.type === TemplateType.CHILD ? input.subject : 'Root template has no subject',
			},
		});

		return true;
	}),
	remove: publicProcedure.input(removeTemplate).mutation(async ({ input }) => {
		const { id } = input;

		await prisma.template.delete({
			where: {
				id,
			},
		});

		return true;
	}),
	create: publicProcedure.input(createTemplate).mutation(async ({ input }) => {
		const { id } = await prisma.template.create({
			data: {
				...input,
				subject: input.type === TemplateType.CHILD ? input.subject : 'Root template has no subject',
			},
		});
		return id;
	}),
});
