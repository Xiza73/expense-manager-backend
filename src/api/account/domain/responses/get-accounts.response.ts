import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';
import { commonValidations } from '@/utils/common-validation.util';

import { Currency } from '../currency.enum';
import { Month } from '../month.enum';

export const GetAccountsResponseObject = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      description: z.string().nullable(),
      month: z.nativeEnum(Month),
      year: z.number(),
      currency: z.nativeEnum(Currency),
      amount: commonValidations.toValidNumber,
      balance: commonValidations.toValidNumber,
      expenseAmount: commonValidations.toValidNumber,
      incomeAmount: commonValidations.toValidNumber,
      isDefault: z.boolean(),
      color: z.string().nullable(),
    })
  ),
  total: commonValidations.toValidNumber,
  pages: commonValidations.toValidNumber,
  page: commonValidations.toValidNumber,
});
type GetAccountsResponseObject = zod.infer<typeof GetAccountsResponseObject>;

export const GetAccountsResponseSchema = ServiceResponseSchema(GetAccountsResponseObject);
export type GetAccountsResponse = ServiceResponse<GetAccountsResponseObject | null>;
