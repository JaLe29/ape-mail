import { prisma } from '@/server/prisma';
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
});
