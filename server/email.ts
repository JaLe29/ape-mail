/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from './env';

type Email = nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

const emailGlobal = global as typeof global & {
	email?: Email;
};

const NAME_EMAIL = 'Evidia';
const BASE_EMAIL = 'noreply@evidia.cz';

const email: Email =
	emailGlobal.email ||
	nodemailer.createTransport({
		host: 'smtp.seznam.cz',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: BASE_EMAIL, // generated ethereal user
			pass: env.EMAIL_PASSWORD, // generated ethereal password
		},
	});

export const sendEmail = async (to: string, subject: string, html: string) => {
	email.sendMail({
		from: `"${NAME_EMAIL}" <${BASE_EMAIL}>`,
		to: to,
		subject: subject,
		html: html,
		// attachments,
	});
};

if (env.NODE_ENV !== 'production') {
	emailGlobal.email = email;
}
