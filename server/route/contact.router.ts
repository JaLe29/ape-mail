import { prisma } from '@/server/prisma';
import dayjs from 'dayjs';
import { publicProcedure, router } from '../trpc';

export const contactRouter = router({
	list: publicProcedure.query(async () => {
		const result = await prisma.contact.findMany();

		const grouped = await prisma.message.groupBy({
			by: ['contactId'],
			_count: {
				contactId: true,
			},
		});

		return result.map(contact => {
			const messages = grouped.find(group => group.contactId === contact.id);

			return {
				...contact,
				messagesCount: messages?._count?.contactId || 0,
			};
		});
	}),
	//
	totalContacts: publicProcedure.query(async () => {
		const result = await prisma.contact.count();
		return result;
	}),
	totalContactsToday: publicProcedure.query(async () => {
		const result = await prisma.contact.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('day').toDate(),
				},
			},
		});
		return result;
	}),
	totalContactsLastWeek: publicProcedure.query(async () => {
		const result = await prisma.contact.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('week').toDate(),
				},
			},
		});
		return result;
	}),
	totalContactsLastHour: publicProcedure.query(async () => {
		const result = await prisma.contact.count({
			where: {
				createdAt: {
					gte: dayjs().subtract(1, 'hour').toDate(),
				},
			},
		});
		return result;
	}),
});
