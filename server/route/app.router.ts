import { publicProcedure, router } from '../trpc';
import { contactRouter } from './contact.router';
import { messageRouter } from './message.router';
import { templateRouter } from './template.router';

export const appRouter = router({
	healthcheck: publicProcedure.query(() => 'yay!'),
	template: templateRouter,
	contact: contactRouter,
	message: messageRouter,
});

export type AppRouter = typeof appRouter;
