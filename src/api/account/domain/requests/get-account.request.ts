import { Parameters } from '@/domain/parameter.interface';

export const GetAccountRequestParameters: Parameters = [
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
