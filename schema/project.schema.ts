import { z } from 'zod';

export const createApp = z.object({
	name: z
		.string({ message: 'Name must be a string' })
		.min(1, { message: "Name can't be empty" })
		.max(255, { message: 'Name must be less than 255 characters' }),
});

export const removeApp = z.object({
	id: z.string().uuid(),
});

// export const listApp = z.object({
// 	name: z.string(),
// 	id: z.string(),
// });

// export type creatAppSchema = z.TypeOf<typeof createApp>;
