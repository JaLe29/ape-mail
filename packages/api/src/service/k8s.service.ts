import { FastifyReply, FastifyRequest } from 'fastify';

export class K8SService {
	private ready: boolean = false;

	setReady() {
		this.ready = true;
	}

	liveRequest(req: FastifyRequest, res: FastifyReply) {
		if (this.ready) {
			res.code(200).header('Content-Type', 'application/json; charset=utf-8').send({ status: 'ok' });
			return;
		}

		res.code(503).header('Content-Type', 'application/json; charset=utf-8').send({ status: 'nok' });
	}

	readyRequest(req: FastifyRequest, res: FastifyReply) {
		if (this.ready) {
			res.code(200).header('Content-Type', 'application/json; charset=utf-8').send({ status: 'ok' });
			return;
		}

		res.code(503).header('Content-Type', 'application/json; charset=utf-8').send({ status: 'nok' });
	}
}
