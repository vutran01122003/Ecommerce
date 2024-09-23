import { TypeOf, z } from 'zod';

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password should be 8 character minimum')
    })
});

export type LoginInput = TypeOf<typeof loginSchema>;

export default loginSchema;
