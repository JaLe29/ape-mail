import { sendEmail } from '@/server/email';
import { prisma } from '@/server/prisma';
import { getTemplates, replaceTemplates } from '@/utils/string';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

type ResponseData = {
	message: string;
};

const BODY_VALIDATOR = z.object({
	toEmail: z.string().email(),
	template: z.string(),
	values: z.record(z.string(), z.string().or(z.number())),
});

type BodyType = z.infer<typeof BODY_VALIDATOR>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests allowed' });
		return;
	}
	if (req.headers['content-type'] !== 'application/json') {
		res.status(400).send({ message: 'Content-Type must be application/json' });
		return;
	}

	const body = req.body as BodyType;

	try {
		BODY_VALIDATOR.parse(body);
	} catch (err) {
		const validationError = fromError(err);
		console.log(validationError.toString());
		res.status(400).json({ message: validationError.toString() });
		return;
	}

	// eslint-disable-next-line prefer-const
	let [template, contact] = await Promise.all([
		prisma.template.findUnique({
			where: {
				key: body.template,
			},
		}),
		prisma.contact.findFirst({
			where: {
				email: body.toEmail,
			},
		}),
	]);

	if (!template) {
		res.status(404).json({ message: 'Template not found' });
		return;
	}

	const templateBodyTemplate = getTemplates(template.body);
	const templateSubjectTemplate = getTemplates(template.subject);
	const requestTemplates = Object.keys(body.values);

	const templates = [...templateBodyTemplate, ...templateSubjectTemplate];
	const missingTemplates = templates.filter(template => !requestTemplates.includes(template));

	if (missingTemplates.length) {
		res.status(400).json({ message: `Missing template values: ${missingTemplates.join(', ')}` });
		return;
	}

	if (!contact) {
		// create contact if not exist
		contact = await prisma.contact.create({
			data: {
				email: body.toEmail,
			},
		});
	}

	const emailBody = replaceTemplates(template.body, body.values);
	const emailSubject = replaceTemplates(template.subject, body.values);

	await prisma.message.create({
		data: {
			contactId: contact.id,
			body: emailBody,
			subject: emailSubject,
			templateId: template.id,
		},
	});

	await sendEmail(body.toEmail, emailSubject, emailBody);

	res.status(200).json({ message: 'Hello from Next.js!' });
}
