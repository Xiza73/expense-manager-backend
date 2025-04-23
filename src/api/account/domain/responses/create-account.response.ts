import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

export const CreateAccountResponseObject = z.object({
  id: z.number(),
});
export type CreateAccountResponseObject = zod.infer<typeof CreateAccountResponseObject>;

export const CreateAccountResponseSchema = ServiceResponseSchema(CreateAccountResponseObject);
export type CreateAccountResponse = ServiceResponse<CreateAccountResponseObject | null>;
