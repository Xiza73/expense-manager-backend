import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';
import { commonValidations } from '@/utils/common-validation.util';

import { Currency } from '../currency.enum';
import { Month } from '../month.enum';

export const GetAccountResponseObject = z.object({
  id: z.number(),
  description: z.string().nullable(),
  month: z.nativeEnum(Month),
  year: z.number(),
  currency: z.nativeEnum(Currency),
  amount: commonValidations.toValidNumber,
  balance: commonValidations.toValidNumber,
  expenseAmount: commonValidations.toValidNumber,
  incomeAmount: commonValidations.toValidNumber,
  color: z.string().nullable(),
});
type GetAccountResponseObject = zod.infer<typeof GetAccountResponseObject>;

export const GetAccountResponseSchema = ServiceResponseSchema(GetAccountResponseObject);
export type GetAccountResponse = ServiceResponse<GetAccountResponseObject | null>;
