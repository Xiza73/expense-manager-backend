import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ServiceResponse, ServiceResponseSchema } from '@/domain/service-response.model';

import { Currency } from '../currency.enum';
import { Month } from '../month.enum';

export const GetAccountsResponseObject = z.object({
  accounts: z.array(
    z.object({
      id: z.number(),
      description: z.string().nullable(),
      month: z.nativeEnum(Month),
      year: z.number(),
      currency: z.nativeEnum(Currency),
      color: z.string().nullable(),
    })
  ),
});
type GetAccountsResponseObject = zod.infer<typeof GetAccountsResponseObject>;

export const GetAccountsResponseSchema = ServiceResponseSchema(GetAccountsResponseObject);
export type GetAccountsResponse = ServiceResponse<GetAccountsResponseObject | null>;
