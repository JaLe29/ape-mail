import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import { K8SService } from './service/k8s.service';
import { buildContext } from './trpc/context';
import { appRouter, type AppRouter } from './trpc/router';

export const bootstrap = async (): Promise<void> => {
	const prisma = new PrismaClient();
	const k8SServiceInstance = new K8SService();

	await prisma.$connect();

	const fastify = Fastify({
		maxParamLength: 5000,
		logger: false,
	});

	await fastify.register(cors, {
		// put your options here
		methods: ['*'],
		origin: '*',
	});

	const distPath = path.join('/', 'usr', 'app', 'client'); // path.join(__dirname, '..', '..', 'client', 'dist');
	fastify.register(fastifyStatic, {
		root: distPath,
		prefix: '/',
	});

	fastify.setNotFoundHandler((req, res) => {
		const stream = fs.createReadStream(path.join(distPath, 'index.html'));
		res.type('text/html').send(stream);
	});

	fastify.get('/k8s/live', (req, res) => k8SServiceInstance.liveRequest(req, res));
	fastify.get('/k8s/ready', (req, res) => k8SServiceInstance.readyRequest(req, res));

	fastify.register(fastifyTRPCPlugin, {
		prefix: '/trpc',
		trpcOptions: {
			router: appRouter,
			createContext: buildContext(prisma),
			onError({ path: pp, error }) {
				// eslint-disable-next-line no-console
				console.error(`Error in tRPC handler on path '${pp}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
	});

	await fastify.listen({ host: '0.0.0.0', port: 2000 });
	k8SServiceInstance.setReady();

	// eslint-disable-next-line no-console
	console.log('http://localhost:2000');
};
