import { publicProcedure, router } from '../trpc';
import { contactRouter } from './contact.router';
import { templateRouter } from './template.router';

export const appRouter = router({
	healthcheck: publicProcedure.query(() => 'yay!'),
	template: templateRouter,
	contact: contactRouter,
});

export type AppRouter = typeof appRouter;
