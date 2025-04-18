import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { IdParamRequestParams } from '@/domain/requests/id-param.request';

export const UpdateTransactionCategoryRequestObject = z.object({
  name: z.string(),
});
export type UpdateTransactionCategoryRequestObject = zod.infer<typeof UpdateTransactionCategoryRequestObject>;

export const UpdateTransactionCategoryRequestSchema = z.object({
  body: UpdateTransactionCategoryRequestObject,
  params: IdParamRequestParams,
});
