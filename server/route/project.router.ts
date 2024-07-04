import { createApp, removeApp } from '@/schema/project.schema';
import { prisma } from '@/server/prisma';
import { publicProcedure, router } from '../trpc';

export const projectRouter = router({
	create: publicProcedure.input(createApp).mutation(async ({ input }) => {
		const { name } = input;

		const result = await prisma.project.create({
			data: {
				name,
			},
		});
		return result;
	}),
	list: publicProcedure.query(async () => {
		const result = await prisma.project.findMany();
		return result;
	}),
	remove: publicProcedure.input(removeApp).mutation(async ({ input }) => {
		const { id } = input;

		await prisma.project.delete({
			where: {
				id,
			},
		});

		return true;
	}),
});
