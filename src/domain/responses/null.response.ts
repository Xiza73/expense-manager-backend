import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

const NullResponseObject = z.null();
type NullResponseObject = zod.infer<typeof NullResponseObject>;

export const NullResponseSchema = ServiceResponseSchema(NullResponseObject);
export type NullResponse = ServiceResponse<NullResponseObject | null>;
