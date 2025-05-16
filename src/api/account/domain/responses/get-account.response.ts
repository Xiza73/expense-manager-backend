import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';
import { commonValidations } from '@/utils/common-validation.util';

import { Currency } from '../currency.enum';
import { Month } from '../month.enum';

export const GetAccountResponseObject = z.object({
  id: z.number(),
  description: z.string().nullable(),
  isMonthly: z.boolean(),
  month: z.nativeEnum(Month).nullable(),
  year: z.number().nullable(),
  currency: z.nativeEnum(Currency),
  amount: commonValidations.toValidNumber,
  balance: commonValidations.toValidNumber,
  expenseAmount: commonValidations.toValidNumber,
  incomeAmount: commonValidations.toValidNumber,
  idealDailyExpenditure: commonValidations.toValidNumber,
  realDailyExpenditure: commonValidations.toValidNumber,
  leftDailyExpenditure: commonValidations.toValidNumber,
  realDaysSpent: commonValidations.toValidNumber,
  daysInDebt: commonValidations.toValidNumber,
  date: commonValidations.toValidDateWithoutTimezone,
  isDefault: z.boolean(),
  color: z.string().nullable(),
});
type GetAccountResponseObject = zod.infer<typeof GetAccountResponseObject>;

export const GetAccountResponseSchema = ServiceResponseSchema(GetAccountResponseObject);
export type GetAccountResponse = ServiceResponse<GetAccountResponseObject | null>;
