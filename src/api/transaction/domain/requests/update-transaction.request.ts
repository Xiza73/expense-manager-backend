import { z as zod } from 'zod';

import { Currency } from '@/api/account/domain/currency.enum';
import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';
import { IdRequestParam } from '@/utils/id-param-example.util';

import { TransactionType } from '../transaction-type.enum';

export const UpdateTransactionRequestObject = z.object({
  name: z.string(),
  description: z.string().nullable(),
  amount: commonValidations.toValidNumber,
  currency: z.nativeEnum(Currency),
  type: z.nativeEnum(TransactionType),
  isPaid: z.boolean().default(true),
  paymentMethod: commonValidations.paymentMethod,
  categoryId: z.number(),
  serviceId: z.number().optional(),
  accountId: z.number(),
  date: commonValidations.toValidDate,
});
export type UpdateTransactionRequestObject = zod.infer<typeof UpdateTransactionRequestObject>;

export const UpdateTransactionRequestSchema = z.object({
  body: UpdateTransactionRequestObject,
  params: IdRequestParam,
});

export const UpdateTransactionRequestExample: UpdateTransactionRequestObject = {
  name: 'My Transaction',
  description: 'This is my transaction',
  amount: 100,
  currency: 'USD',
  type: 'INCOME',
  isPaid: true,
  paymentMethod: 'CREDIT_CARD',
  categoryId: 1,
  serviceId: 1,
  accountId: 1,
  date: new Date(),
};
