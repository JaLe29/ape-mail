import { TemplateType } from '@ape-mail/shared';
import { initTRPC } from '@trpc/server';
import dayjs from 'dayjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type SuperJSON from 'superjson';
import { z } from 'zod';
import { Context } from './context';
// This is a type-only import, so won't get transformed to `require()`.
// HACK: The `superjson` library is ESM-only (does not support CJS), while our codebase is CJS.
// This is a workaround to still get to use the latest version of the library from our codebase.
// https://github.com/blitz-js/superjson/issues/268
// https://www.npmjs.com/package/fix-esm
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const fixESM = require('fix-esm');
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const SuperJSON: SuperJSON = fixESM.require('superjson');

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});
export const publicProcedure = t.procedure;
export const { router } = t;

const paginationTemplate = z.object({
	take: z.number().int(),
	skip: z.number().int(),
});
// template schemas

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
	description: z.string().optional(),
});

export const updateTemplate = z.object({
	id: z.string().uuid(),
	name: z.string(),
	body: z.string(),
	subject: z.string(),
	key: z.string(),
	type: z.nativeEnum(TemplateType),
	rootTemplateId: z.string().uuid().optional(),
	description: z.string().optional(),
});
// end of template schemas

// contact schemas
export const listContacts = z.object({
	pagination: paginationTemplate.optional(),
});
// end of contact schemas

// router
export const contactRouter = router({
	list: publicProcedure.input(listContacts).query(async ({ ctx, input }) => {
		const pagination = input.pagination || { take: 10, skip: 0 };

		const result = await ctx.prisma.contact.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			...pagination,
		});

		const grouped = await ctx.prisma.message.groupBy({
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
	totalContacts: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.contact.count();
		return result;
	}),
	totalContactsToday: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.contact.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('day').toDate(),
				},
			},
		});
		return result;
	}),
	totalContactsLastWeek: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.contact.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('week').toDate(),
				},
			},
		});
		return result;
	}),
	totalContactsLastHour: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.contact.count({
			where: {
				createdAt: {
					gte: dayjs().subtract(1, 'hour').toDate(),
				},
			},
		});
		return result;
	}),
});
export const messageRouter = router({
	totalEmails: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.message.count();
		return result;
	}),
	totalEmailsToday: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.message.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('day').toDate(),
				},
			},
		});
		return result;
	}),
	totalEmailsLastWeek: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.message.count({
			where: {
				createdAt: {
					gte: dayjs().startOf('week').toDate(),
				},
			},
		});
		return result;
	}),
	totalEmailsLastHour: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.message.count({
			where: {
				createdAt: {
					gte: dayjs().subtract(1, 'hour').toDate(),
				},
			},
		});
		return result;
	}),
});

export const templateRouter = router({
	list: publicProcedure.input(listTemplate).query(async ({ input, ctx }) => {
		const result = await ctx.prisma.template.findMany({ where: { type: input.type } });
		return result;
	}),
	one: publicProcedure.input(oneTemplate).query(async ({ input, ctx }) => {
		const { id } = input;
		const result = await ctx.prisma.template.findUnique({ where: { id } });
		return result;
	}),
	update: publicProcedure.input(updateTemplate).mutation(async ({ input, ctx }) => {
		const { id, ...data } = input;

		await ctx.prisma.template.update({
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
	remove: publicProcedure.input(removeTemplate).mutation(async ({ input, ctx }) => {
		const { id } = input;

		await ctx.prisma.template.delete({
			where: {
				id,
			},
		});

		return true;
	}),
	create: publicProcedure.input(createTemplate).mutation(async ({ input, ctx }) => {
		const { id } = await ctx.prisma.template.create({
			data: {
				...input,
				subject: input.type === TemplateType.CHILD ? input.subject : 'Root template has no subject',
			},
		});
		return id;
	}),
});

// end of routers

export const appRouter = t.router({
	template: templateRouter,
	contact: contactRouter,
	message: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
