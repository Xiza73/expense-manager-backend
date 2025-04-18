import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ListRequestParameters, ListSchemaQuery } from '@/domain/list-response.interface';
import { Parameters } from '@/domain/parameter.interface';
import { commonValidations } from '@/utils/common-validation.util';

import { TransactionType } from '../transaction-type.enum';

const GetTransactionsRequestObject = z.object({
  ...ListSchemaQuery.shape,
  type: z.nativeEnum(TransactionType).optional(),
  accountId: commonValidations.toValidNumber,
  categoryId: commonValidations.toValidNumber.optional(),
  serviceId: commonValidations.toValidNumber.optional(),
});
export type GetTransactionsRequestObject = zod.infer<typeof GetTransactionsRequestObject>;

export const GetTransactionsRequestSchema = z.object({
  query: GetTransactionsRequestObject,
});

export const GetTransactionsRequestParameters: Parameters = [
  ...ListRequestParameters,
  {
    name: 'type',
    in: 'query',
    required: false,
    description: 'Transaction type',
    schema: {
      type: 'string',
      example: TransactionType.EXPENSE,
    },
  },
  {
    name: 'accountId',
    in: 'query',
    required: false,
    description: 'Account ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
  {
    name: 'categoryId',
    in: 'query',
    required: false,
    description: 'Category ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
  {
    name: 'serviceId',
    in: 'query',
    required: false,
    description: 'Service ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
];
