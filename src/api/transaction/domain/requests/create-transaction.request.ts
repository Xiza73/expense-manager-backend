import { z as zod } from 'zod';

import { Currency } from '@/api/account/domain/currency.enum';
import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';

import { TransactionType } from '../transaction-type.enum';

export const CreateTransactionRequestObject = z.object({
  name: z.string(),
  description: z.string().nullable(),
  amount: commonValidations.toValidNumber,
  currency: z.nativeEnum(Currency),
  type: z.nativeEnum(TransactionType),
  date: commonValidations.toValidDate.optional(),
  paymentMethod: commonValidations.paymentMethod,
  isActive: z.boolean().default(true),
  categoryId: z.number(),
  serviceId: z.number().optional(),
  accountId: z.number(),
});
export type CreateTransactionRequestObject = zod.infer<typeof CreateTransactionRequestObject>;

export const CreateTransactionRequestSchema = z.object({
  body: CreateTransactionRequestObject,
});

export const CreateTransactionRequestExample: CreateTransactionRequestObject = {
  name: 'My Transaction',
  description: 'This is my transaction',
  amount: 100,
  currency: 'USD',
  type: 'INCOME',
  paymentMethod: 'CREDIT_CARD',
  isActive: true,
  categoryId: 1,
  serviceId: 1,
  accountId: 1,
  date: new Date(),
};
