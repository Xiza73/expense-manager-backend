import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { Parameters } from '@/domain/parameter.interface';

import { commonValidations } from './common-validation.util';

export const IdRequestParam = z.object({
  id: commonValidations.toValidNumber,
});
export type IdRequestParam = zod.infer<typeof IdRequestParam>;

export const idParamExample = (description: string): Parameters => {
  return [
    {
      name: 'id',
      in: 'path',
      required: true,
      description,
      schema: {
        type: 'number',
        example: 1,
      },
    },
  ];
};
