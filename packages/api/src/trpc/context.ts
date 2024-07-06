import { PrismaClient } from '@prisma/client';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export const buildContext = (prisma: PrismaClient) => {
	const createContext = ({ req, res }: CreateFastifyContextOptions) => {
		const user = { name: req.headers.username ?? 'anonymous' };
		return { req, res, user, prisma };
	};

	return createContext;
};

export type Context = Awaited<ReturnType<typeof buildContext>>;
