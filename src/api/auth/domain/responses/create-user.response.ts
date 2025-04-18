import { z as zod } from 'zod';

import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

const CreateUserResponseObject = zod.null();
type CreateUserResponseObject = zod.infer<typeof CreateUserResponseObject>;

export const CreateUserResponseSchema = ServiceResponseSchema(CreateUserResponseObject);
export type CreateUserResponse = ServiceResponse<CreateUserResponseObject | null>;
