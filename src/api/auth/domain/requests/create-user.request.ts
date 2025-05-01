import { z as zod } from 'zod';

const CreateUserRequestObject = zod.object({
  token: zod.string().min(1, 'Token is required').max(36, 'Token must be at most 36 characters long'),
  alias: zod.string().min(1, 'Alias is required').max(36, 'Alias must be at most 36 characters long'),
});
export type CreateUserRequestObject = zod.infer<typeof CreateUserRequestObject>;

export const CreateUserRequestSchema = zod.object({
  body: CreateUserRequestObject,
});

export const CreateUserRequestExample: CreateUserRequestObject = {
  token: 'string',
  alias: 'string',
};
