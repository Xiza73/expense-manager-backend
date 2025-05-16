import { z as zod } from 'zod';

import { Parameters } from '@/domain/parameter.interface';
import { commonValidations } from '@/utils/common-validation.util';

import { Month } from '../month.enum';

const UpdateAccountRequestObject = zod.object({
  isMonthly: zod.boolean().default(true),
  description: zod.string().optional(),
  month: commonValidations.month.optional(),
  year: commonValidations.year.optional(),
  currency: commonValidations.currency,
  amount: zod.number().min(0, 'Amount must be a positive number'),
  color: zod.string().optional(),
});
export type UpdateAccountRequestObject = zod.infer<typeof UpdateAccountRequestObject>;

const UpdateAccountRequestParam = zod.object({
  id: commonValidations.toValidNumber,
});
export type UpdateAccountRequestParam = zod.infer<typeof UpdateAccountRequestParam>;

export const UpdateAccountRequestSchema = zod.object({
  body: UpdateAccountRequestObject,
  params: UpdateAccountRequestParam,
});

export const UpdateAccountRequestParameters: Parameters = [
  {
    name: 'id',
    in: 'path',
    required: true,
    description: 'Account ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
];

export const UpdateAccountRequestExample: UpdateAccountRequestObject = {
  isMonthly: true,
  description: 'My Account',
  month: Month.JANUARY,
  year: 2023,
  currency: 'USD',
  amount: 1000,
  color: 'red',
};
