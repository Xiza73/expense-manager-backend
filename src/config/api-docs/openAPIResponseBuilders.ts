import { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { getCodeDescription } from '@/domain/code-description.map';
import { ServiceResponseSchema } from '@/domain/service-response.model';

// export function createApiResponse(schema: z.ZodTypeAny, statusCode = StatusCodes.OK) {
//   return {
//     [statusCode]: {
//       description: getCodeDescription(statusCode),
//       content: {
//         'application/json': {
//           schema: ServiceResponseSchema(schema),
//         },
//       },
//     },
//   };
// }

export interface ApiResponseConfig {
  schema: z.ZodTypeAny;
  statusCode: StatusCodes;
}

export function createApiResponses(configs: ApiResponseConfig[]) {
  const responses: { [key: string]: ResponseConfig } = {};
  configs.forEach(({ schema, statusCode }) => {
    responses[statusCode] = {
      description: getCodeDescription(statusCode),
      content: {
        'application/json': {
          schema: ServiceResponseSchema(schema),
        },
      },
    };
  });
  return responses;
}
