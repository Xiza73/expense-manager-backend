import { z as zod } from 'zod';

const SignInRequestBody = zod.object({
  token: zod.string().min(1, 'Token is required').max(36, 'Token must be at most 36 characters long'),
});
type SignInRequestBody = zod.infer<typeof SignInRequestBody>;

export const SignInRequestSchema = zod.object({
  body: SignInRequestBody,
});
