import { z as zod } from 'zod';

const CreateUserRequestBody = zod.object({
  token: zod.string().min(1, 'Token is required').max(36, 'Token must be at most 36 characters long'),
});
type CreateUserRequestBody = zod.infer<typeof CreateUserRequestBody>;

export const CreateUserRequestSchema = zod.object({
  body: CreateUserRequestBody,
});
