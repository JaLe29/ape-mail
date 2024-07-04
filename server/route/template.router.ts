import { createTemplate, oneTemplate, removeTemplate, updateTemplate } from '@/schema/template.schema';
import { prisma } from '@/server/prisma';
import { publicProcedure, router } from '../trpc';

export const templateRouter = router({
	list: publicProcedure.query(async () => {
		const result = await prisma.template.findMany();
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
			data,
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
			data: input,
		});
		return id;
	}),
});
