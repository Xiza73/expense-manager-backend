import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

export const GetTransactionServicesResponseObject = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});
export type GetTransactionServicesResponseObject = zod.infer<typeof GetTransactionServicesResponseObject>;

export const GetTransactionServicesResponseSchema = ServiceResponseSchema(GetTransactionServicesResponseObject);
export type GetTransactionServicesResponse = ServiceResponse<GetTransactionServicesResponseObject | null>;
