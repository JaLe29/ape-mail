import { publicProcedure, router } from '../trpc';
import { projectRouter } from './project.router';
import { todoRouter } from './todo.router';

export const appRouter = router({
	healthcheck: publicProcedure.query(() => 'yay!'),
	todo: todoRouter,
	project: projectRouter,
});

export type AppRouter = typeof appRouter;
