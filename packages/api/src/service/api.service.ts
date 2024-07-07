/* eslint-disable no-console */
import { getTemplates, replaceTemplates } from '@ape-mail/shared';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { EmailService } from './email.service';

const BODY_VALIDATOR = z.object({
	toEmail: z.string().email(),
	template: z.string(),
	values: z.record(z.string(), z.string().or(z.number())),
	project: z.string().optional(),
	files: z
		.array(
			z.object({
				filename: z.string(),
				path: z.string().url(),
				contentType: z.enum(['application/pdf']),
			}),
		)
		.optional(),
});

type BodyType = z.infer<typeof BODY_VALIDATOR>;

export class ApiService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly emailService: EmailService,
	) {}

	async send(req: FastifyRequest, res: FastifyReply) {
		if (req.method !== 'POST') {
			res.status(405).send({ status: 'Only POST requests allowed' });
			return;
		}
		if (req.headers['content-type'] !== 'application/json') {
			res.status(400).send({ status: 'Content-Type must be application/json' });
			return;
		}

		const body = req.body as BodyType;

		try {
			BODY_VALIDATOR.parse(body);
		} catch (err) {
			const validationError = fromError(err);
			console.log(validationError.toString());
			res.status(400).send({ status: validationError.toString() });
			return;
		}

		// eslint-disable-next-line prefer-const
		let [template, contact] = await Promise.all([
			this.prisma.template.findUnique({
				where: {
					key: body.template,
				},
			}),
			this.prisma.contact.findFirst({
				where: {
					email: body.toEmail,
					project: body.project,
				},
			}),
		]);

		if (!template) {
			res.status(404).send({ status: 'Template not found' });
			return;
		}

		const templateBodyTemplate = getTemplates(template.body);
		const templateSubjectTemplate = getTemplates(template.subject);
		const requestTemplates = Object.keys(body.values);

		const templates = [...templateBodyTemplate, ...templateSubjectTemplate];
		const missingTemplates = templates.filter(t => !requestTemplates.includes(t));

		if (missingTemplates.length) {
			res.status(400).send({ status: `Missing template values: ${missingTemplates.join(', ')}` });
			return;
		}

		if (!contact) {
			// create contact if not exist
			contact = await this.prisma.contact.create({
				data: {
					email: body.toEmail,
					project: body.project,
				},
			});
		}

		const getParentTemplate = async () =>
			this.prisma.template.findUnique({
				where: {
					id: template.rootTemplateId!,
				},
			});

		const parentTemplate = template.rootTemplateId ? await getParentTemplate() : undefined;

		if (template.rootTemplateId && !parentTemplate) {
			res.status(404).send({ status: 'Parent template not found' });
			return;
		}

		const emailBody = parentTemplate
			? replaceTemplates(replaceTemplates(parentTemplate.body, { body: template.body }), body.values)
			: replaceTemplates(template.body, body.values);
		const emailSubject = replaceTemplates(template.subject, body.values);

		await this.prisma.message.create({
			data: {
				contactId: contact.id,
				body: emailBody,
				subject: emailSubject,
				templateId: template.id,
			},
		});

		await this.emailService.sendEmail(body.toEmail, emailSubject, emailBody, body.files);

		res.status(200).send({ status: 'ok' });
	}
}
