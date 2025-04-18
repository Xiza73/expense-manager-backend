import { Parameters } from '@/domain/parameter.interface';

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
