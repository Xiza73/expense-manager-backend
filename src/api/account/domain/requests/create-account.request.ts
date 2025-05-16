import { z as zod } from 'zod';

import { commonValidations } from '@/utils/common-validation.util';

import { Month } from '../month.enum';

const CreateAccountRequestObject = zod.object({
  isMonthly: zod.boolean().default(true),
  description: zod.string().optional(),
  month: commonValidations.month.optional(),
  year: commonValidations.year.optional(),
  currency: commonValidations.currency,
  amount: zod.number().min(0, 'Amount must be a positive number'),
  color: zod.string().optional(),
});
export type CreateAccountRequestObject = zod.infer<typeof CreateAccountRequestObject>;

export const CreateAccountRequestSchema = zod.object({
  body: CreateAccountRequestObject,
});

export const CreateAccountRequestExample: CreateAccountRequestObject = {
  isMonthly: true,
  description: 'My Account',
  month: Month.JANUARY,
  year: 2023,
  currency: 'USD',
  amount: 1000,
  color: 'red',
};
