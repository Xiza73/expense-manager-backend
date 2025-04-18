import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

export const GetTransactionCategoriesResponseObject = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});
export type GetTransactionCategoriesResponseObject = zod.infer<typeof GetTransactionCategoriesResponseObject>;

export const GetTransactionCategoriesResponseSchema = ServiceResponseSchema(GetTransactionCategoriesResponseObject);
export type GetTransactionCategoriesResponse = ServiceResponse<GetTransactionCategoriesResponseObject | null>;
