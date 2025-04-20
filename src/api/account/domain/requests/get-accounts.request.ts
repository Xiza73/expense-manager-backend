import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ListRequestParameters, ListSchemaQuery } from '@/domain/list-response.interface';
import { Parameters } from '@/domain/parameter.interface';
import { commonValidations } from '@/utils/common-validation.util';

import { Month } from '../month.enum';

const GetAccountsRequestObject = z.object({
  ...ListSchemaQuery.shape,
  month: z.nativeEnum(Month).optional(),
  year: commonValidations.toValidNumber.optional(),
});
export type GetAccountsRequestObject = zod.infer<typeof GetAccountsRequestObject>;

export const GetAccountsRequestSchema = z.object({
  query: GetAccountsRequestObject,
});

export const GetAccountsRequestParameters: Parameters = [
  ...ListRequestParameters,
  {
    name: 'month',
    in: 'query',
    required: false,
    description: 'Month',
    schema: {
      type: 'string',
      example: Month.APRIL,
    },
  },
  {
    name: 'year',
    in: 'query',
    required: false,
    description: 'Year',
    schema: {
      type: 'number',
      example: 2022,
    },
  },
];
