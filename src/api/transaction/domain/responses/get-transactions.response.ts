import { z as zod } from 'zod';

import { Currency } from '@/api/account/domain/currency.enum';
import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';
import { commonValidations } from '@/utils/common-validation.util';

import { PaymentMethod } from '../payment-method.enum';
import { TransactionType } from '../transaction-type.enum';

export const GetTransactionsResponseObject = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      amount: commonValidations.toValidNumber,
      currency: z.nativeEnum(Currency),
      type: z.nativeEnum(TransactionType),
      date: z.string(),
      paymentMethod: z.nativeEnum(PaymentMethod),
      isActive: z.boolean(),
      category: z.object({
        id: z.number(),
        name: z.string(),
      }),
      service: z.object({
        id: z.number(),
        name: z.string(),
      }),
      account: z.object({
        id: z.number(),
      }),
    })
  ),
  total: z.number(),
  pages: z.number(),
  page: z.number(),
});
export type GetTransactionsResponseObject = zod.infer<typeof GetTransactionsResponseObject>;

export const GetTransactionsResponseSchema = ServiceResponseSchema(GetTransactionsResponseObject);
export type GetTransactionsResponse = ServiceResponse<GetTransactionsResponseObject | null>;
