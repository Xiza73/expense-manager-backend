import { z as zod } from 'zod';

import { Currency } from '@/api/account/domain/currency.enum';
import { PaymentMethod } from '@/api/transaction/domain/payment-method.enum';
import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';
import { commonValidations } from '@/utils/common-validation.util';

import { TransactionType } from '../transaction-type.enum';

export const GetTransactionResponseObject = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  amount: commonValidations.toValidNumber,
  currency: z.nativeEnum(Currency),
  type: z.nativeEnum(TransactionType),
  paymentMethod: z.nativeEnum(PaymentMethod),
  date: commonValidations.toValidDateWithoutTimezone,
  isActive: z.boolean(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  service: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  account: z.object({
    id: z.number(),
  }),
});
type GetTransactionResponseObject = zod.infer<typeof GetTransactionResponseObject>;

export const GetTransactionResponseSchema = ServiceResponseSchema(GetTransactionResponseObject);
export type GetTransactionResponse = ServiceResponse<GetTransactionResponseObject | null>;
