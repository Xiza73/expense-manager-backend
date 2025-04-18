import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { IdParamRequestParams } from '@/domain/requests/id-param.request';

export const UpdateTransactionServiceRequestObject = z.object({
  name: z.string(),
});
export type UpdateTransactionServiceRequestObject = zod.infer<typeof UpdateTransactionServiceRequestObject>;

export const UpdateTransactionServiceRequestSchema = z.object({
  body: UpdateTransactionServiceRequestObject,
  params: IdParamRequestParams,
});
