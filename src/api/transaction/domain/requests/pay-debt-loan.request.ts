import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';
import { IdRequestParam } from '@/utils/id-param-example.util';

const PayDebtLoanRequestObject = z.object({
  amount: commonValidations.toValidNumber,
  isPartial: z.boolean().default(false),
  description: z.string().optional(),
});
export type PayDebtLoanRequestObject = zod.infer<typeof PayDebtLoanRequestObject>;

export const PayDebtLoanRequestSchema = z.object({
  body: PayDebtLoanRequestObject,
  params: IdRequestParam,
});

export const PayDebtLoanRequestParameters = [
  {
    name: 'amount',
    in: 'body',
    required: true,
    description: 'Amount',
    schema: {
      type: 'number',
      example: 100,
    },
  },
  {
    name: 'isPartial',
    in: 'body',
    required: false,
    description: 'Is partial',
    schema: {
      type: 'boolean',
      example: false,
    },
  },
  {
    name: 'description',
    in: 'body',
    required: false,
    description: 'Description',
    schema: {
      type: 'string',
      example: 'Payment for the rent',
    },
  },
];

export const PayDebtLoanRequestExample: PayDebtLoanRequestObject = {
  amount: 100,
  isPartial: false,
  description: 'Payment for the rent',
};
