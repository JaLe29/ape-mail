import { config } from 'dotenv';
import 'source-map-support/register';

config();

(async () => {
	const { bootstrap } = await import('./boot');
	await bootstrap();
})().catch(e => {
	// eslint-disable-next-line no-console
	console.error('Application failed to bootstrap...', e);
	process.exit(1);
});
