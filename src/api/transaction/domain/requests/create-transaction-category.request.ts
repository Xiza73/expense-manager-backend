import { z as zod } from 'zod';

import { z } from '@/config/zod.config';

export const CreateTransactionCategoryRequestObject = z.object({
  name: z.string(),
});
export type CreateTransactionCategoryRequestObject = zod.infer<typeof CreateTransactionCategoryRequestObject>;

export const CreateTransactionCategoryRequestSchema = z.object({
  body: CreateTransactionCategoryRequestObject,
});
