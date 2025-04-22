import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';
import { commonValidations } from '@/utils/common-validation.util';

export const GetTransactionServicesResponseObject = z.object({
  data: z.array(
    z.object({
      id: commonValidations.toValidNumber,
      name: z.string(),
    })
  ),
});
export type GetTransactionServicesResponseObject = zod.infer<typeof GetTransactionServicesResponseObject>;

export const GetTransactionServicesResponseSchema = ServiceResponseSchema(GetTransactionServicesResponseObject);
export type GetTransactionServicesResponse = ServiceResponse<GetTransactionServicesResponseObject | null>;
