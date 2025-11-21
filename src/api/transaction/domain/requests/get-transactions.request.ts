import { z as zod } from 'zod';

import { z } from '@/config/zod.config';
import { ListRequestParameters, ListSchemaQuery } from '@/domain/list-response.interface';
import { Order } from '@/domain/order.interface';
import { Parameters } from '@/domain/parameter.interface';
import { commonValidations } from '@/utils/common-validation.util';

import { PaymentMethod } from '../payment-method.enum';
import { TransactionType } from '../transaction-type.enum';

export const GetTransactionsFieldOrder = {
  DATE: 'date',
  NAME: 'name',
  CATEGORY: 'category',
  SERVICE: 'service',
  PAYMENT_METHOD: 'paymentMethod',
  TYPE: 'type',
  AMOUNT: 'amount',
};
export type GetTransactionsFieldOrder = (typeof GetTransactionsFieldOrder)[keyof typeof GetTransactionsFieldOrder];

const GetTransactionsRequestObject = z.object({
  ...ListSchemaQuery.shape,
  search: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  accountId: commonValidations.toValidNumber,
  categoryId: commonValidations.toValidNumber.optional(),
  serviceId: commonValidations.toValidNumber.optional(),
  isPaid: z.boolean().optional(),
  fieldOrder: z.nativeEnum(GetTransactionsFieldOrder).optional(),
  order: z.nativeEnum(Order).default(Order.DESC),
});
export type GetTransactionsRequestObject = zod.infer<typeof GetTransactionsRequestObject>;

export const GetTransactionsRequestSchema = z.object({
  query: GetTransactionsRequestObject,
});

export const GetTransactionsRequestParameters: Parameters = [
  ...ListRequestParameters,
  {
    name: 'type',
    in: 'query',
    required: false,
    description: 'Transaction type',
    schema: {
      type: 'string',
      example: TransactionType.EXPENSE,
    },
  },
  {
    name: 'accountId',
    in: 'query',
    required: false,
    description: 'Account ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
  {
    name: 'categoryId',
    in: 'query',
    required: false,
    description: 'Category ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
  {
    name: 'serviceId',
    in: 'query',
    required: false,
    description: 'Service ID',
    schema: {
      type: 'number',
      example: 1,
    },
  },
  {
    name: 'fieldOrder',
    in: 'query',
    required: false,
    description: 'Field order',
    schema: {
      type: 'string',
      example: GetTransactionsFieldOrder.DATE,
    },
  },
  {
    name: 'order',
    in: 'query',
    required: false,
    description: 'Order',
    schema: {
      type: 'string',
      example: Order.DESC,
    },
  },
];
