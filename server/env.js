// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { z } = require('zod');

/*eslint sort-keys: "error"*/
const envSchema = z.object({
	DATABASE_URL: z.string(),
	EMAIL_PASSWORD: z.string(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
});

const env = envSchema.safeParse(process.env);
console.log(process.env);
console.log('--');
console.log(env.data);
if (!env.success) {
	console.error(env.error);
	console.error('❌ Invalid environment variables:');
	process.exit(1);
}

module.exports.env = env.data;
