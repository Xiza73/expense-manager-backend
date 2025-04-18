import { z as zod } from 'zod';

import { Parameters } from '@/domain/parameter.interface';
import { commonValidations } from '@/utils/common-validation.util';

import { Month } from '../month.enum';

const UpdateAccountRequestObject = zod.object({
  description: zod.string().optional(),
  month: commonValidations.month,
  year: commonValidations.year,
  currency: commonValidations.currency,
  amount: zod.number().min(0, 'Amount must be a positive number'),
  color: zod.string().optional(),
});
export type UpdateAccountRequestObject = zod.infer<typeof UpdateAccountRequestObject>;

export const UpdateAccountRequestSchema = zod.object({
  body: UpdateAccountRequestObject,
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
  description: 'My Account',
  month: Month.JANUARY,
  year: 2023,
  currency: 'USD',
  amount: 1000,
  color: 'red',
};
