import { z as zod } from 'zod';

import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

export const SignInResponseObject = zod.object({
  alias: zod.string().optional(),
});
export type SignInResponseObject = zod.infer<typeof SignInResponseObject>;

export const SignInResponseSchema = ServiceResponseSchema(SignInResponseObject);
export type SignInResponse = ServiceResponse<SignInResponseObject | null>;
