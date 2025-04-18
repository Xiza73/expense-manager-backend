import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';

export const IdParamRequestParams = z.object({
  id: commonValidations.toValidNumber,
});
export type IdParamRequestParams = zod.infer<typeof IdParamRequestParams>;
