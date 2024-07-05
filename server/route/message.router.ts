import { prisma } from '@/server/prisma';
import dayjs from 'dayjs';
import { publicProcedure, router } from '../trpc';

export const messageRouter = router({
	totalEmails: publicProcedure.query(async () => {
		const result = await prisma.message.count();
		return result;
	}),
	totalEmailsToday: publicProcedure.query(async () => {
		const result = await prisma.message.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('day').toDate(),
				},
			},
		});
		return result;
	}),
	totalEmailsLastWeek: publicProcedure.query(async () => {
		const result = await prisma.message.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('week').toDate(),
				},
			},
		});
		return result;
	}),
	totalEmailsLastHour: publicProcedure.query(async () => {
		const result = await prisma.message.count({
			where: {
				createdAt: {
					gte: dayjs().subtract(1, 'hour').toDate(),
				},
			},
		});
		return result;
	}),
});
