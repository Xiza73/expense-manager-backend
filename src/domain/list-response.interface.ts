import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';

export const ListSchemaQuery = z.object({
  page: commonValidations.toValidNumber.default(1),
  limit: commonValidations.toValidNumber.default(10),
});
