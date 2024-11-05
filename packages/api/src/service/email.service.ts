import sgMail from '@sendgrid/mail';
import axios from 'axios';
import { ENV_SENDGRID_API_KEY } from '../const';

// const NAME_EMAIL = 'Evidia Robot';
const BASE_EMAIL = 'robot@evidia.cz';

sgMail.setApiKey(ENV_SENDGRID_API_KEY);
export class EmailService {
	async sendEmail(
		to: string,
		subject: string,
		html: string,
		attachments?: {
			filename: string;
			contentType: 'application/pdf';
			path: string;
		}[],
	) {
		const bufferAttachments = await Promise.all(
			attachments?.map(async file => {
				const response = await axios.get(file.path, { responseType: 'arraybuffer' });
				const buffer = Buffer.from(response.data, 'utf-8');
				return {
					content: buffer.toString('base64'),
					type: file.contentType,
					filename: file.filename,
					disposition: 'attachment',
				};
			}) ?? [],
		);

		const msg = {
			to,
			from: BASE_EMAIL, // Use the email address or domain you verified above
			subject,
			html,
			attachments: bufferAttachments.length === 0 ? undefined : bufferAttachments,
		};

		try {
			await sgMail.send(msg);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);

			if (error.response) {
				// eslint-disable-next-line no-console
				console.error(error.response.body);
			}
		}
		/*
		try {
			this.email.sendMail({
				from: `"${NAME_EMAIL}" <${BASE_EMAIL}>`,
				to,
				subject,
				html,
				attachments,
			});
		} catch (error) {
			console.error(error);
		}
			*/
	}
}
