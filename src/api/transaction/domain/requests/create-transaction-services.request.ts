import { z as zod } from 'zod';

import { z } from '@/config/zod.config';

export const CreateTransactionServiceRequestObject = z.object({
  name: z.string(),
});
export type CreateTransactionServiceRequestObject = zod.infer<typeof CreateTransactionServiceRequestObject>;

export const CreateTransactionServiceRequestSchema = z.object({
  body: CreateTransactionServiceRequestObject,
});
