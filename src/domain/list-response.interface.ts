import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';

import { Parameters } from './parameter.interface';

export const ListSchemaQuery = z.object({
  page: commonValidations.optionalNumber,
  limit: commonValidations.optionalNumber,
});

export const ListRequestParameters: Parameters = [
  {
    name: 'page',
    in: 'query',
    required: false,
    description: 'Page number',
    schema: {
      type: 'number',
      example: 1,
    },
  },
  {
    name: 'limit',
    in: 'query',
    required: false,
    description: 'Number of items per page',
    schema: {
      type: 'number',
      example: 10,
    },
  },
];
