import nodemailer from 'nodemailer';
import { ENV_EMAIL_PASSWORD } from '../const';

const NAME_EMAIL = 'Evidia';
const BASE_EMAIL = 'noreply@evidia.cz';

export class EmailService {
	private email = nodemailer.createTransport({
		host: 'smtp.seznam.cz',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: BASE_EMAIL, // generated ethereal user
			pass: ENV_EMAIL_PASSWORD, // generated ethereal password
		},
	});

	sendEmail(
		to: string,
		subject: string,
		html: string,
		attachments?: {
			filename: string;
			contentType: 'application/pdf';
			path: string;
		}[],
	) {
		this.email.sendMail({
			from: `"${NAME_EMAIL}" <${BASE_EMAIL}>`,
			to,
			subject,
			html,
			attachments,
		});
	}
}
