import { createTRPCProxyClient } from '@trpc/client';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import type { AppRouter } from '../../../api/src/trpc/router';

export const BASE_API = import.meta.env.VITE_BASE_URL ?? window.location.origin;

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
	transformer: superjson as any,

	links: [
		httpBatchLink({
			headers() {
				return {
					authorization: undefined,
				};
			},
			url: `${BASE_API}/trpc`,
			// maxURLLength: MAX_URL_LEN,
		}),
	],
});

export const trcpProxyClient = createTRPCProxyClient<AppRouter>({
	transformer: superjson as any,
	links: [
		httpBatchLink({
			headers() {
				return {
					authorization: undefined,
				};
			},
			url: `${BASE_API}/trpc`,
			// maxURLLength: MAX_URL_LEN,
		}),
	],
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
