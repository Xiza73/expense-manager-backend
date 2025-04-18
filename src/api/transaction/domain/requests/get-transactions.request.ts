import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ListSchemaQuery } from '@/domain/list-response.interface';
import { commonValidations } from '@/utils/common-validation.util';

import { TransactionType } from '../transaction-type.enum';

const GetTransactionsRequestObject = z.object({
  ...ListSchemaQuery.shape,
  type: z.nativeEnum(TransactionType).optional(),
  accountId: commonValidations.toValidNumber.optional(),
  categoryId: commonValidations.toValidNumber.optional(),
  serviceId: commonValidations.toValidNumber.optional(),
});
export type GetTransactionsRequestObject = zod.infer<typeof GetTransactionsRequestObject>;

export const GetTransactionsRequestSchema = z.object({
  query: GetTransactionsRequestObject,
});
