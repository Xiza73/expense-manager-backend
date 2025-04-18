import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authenticate } from '@/api/auth/middlewares/auth.middleware';
import { createApiResponses } from '@/config/api-docs/openAPIResponseBuilders';
import { NullResponseSchema } from '@/domain/responses/null.response';
import { Method, Module } from '@/domain/route.enum';
import { validateRequest } from '@/utils/http-handlers.util';

import { transactionController } from '../controllers/transaction.controller';
import {
  CreateTransactionRequestExample,
  CreateTransactionRequestSchema,
} from '../domain/requests/create-transaction.request';
import { GetTransactionsRequestSchema } from '../domain/requests/get-transactions.request';
import {
  UpdateTransactionRequestExample,
  UpdateTransactionRequestSchema,
} from '../domain/requests/update-transaction.request';
import { GetTransactionResponseSchema } from '../domain/responses/get-transaction.response';
import { GetTransactionsResponseSchema } from '../domain/responses/get-transactions.response';

export const transactionRegistry = new OpenAPIRegistry();

export const transactionRouter: Router = (() => {
  const router = Router();

  transactionRegistry.registerPath({
    method: Method.GET,
    path: '/api/transaction',
    tags: [Module.TRANSACTION],
    responses: createApiResponses([
      {
        schema: GetTransactionsResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: [
      {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number',
        schema: {
          type: 'number',
          example: 1,
        },
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of items per page',
        schema: {
          type: 'number',
          example: 10,
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
    ],
  });
  router.get('/', authenticate, validateRequest(GetTransactionsRequestSchema), transactionController.getTransactions);

  transactionRegistry.registerPath({
    method: Method.GET,
    path: '/api/transaction/{id}',
    tags: [Module.TRANSACTION],
    responses: createApiResponses([
      {
        schema: GetTransactionResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Transaction ID',
        schema: {
          type: 'number',
          example: 1,
        },
      },
    ],
  });
  router.get('/:id', authenticate, transactionController.getTransaction);

  transactionRegistry.registerPath({
    method: Method.POST,
    path: '/api/transaction',
    tags: [Module.TRANSACTION],
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.CREATED,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: CreateTransactionRequestExample,
        },
      },
    },
  });
  router.post(
    '/',
    authenticate,
    validateRequest(CreateTransactionRequestSchema),
    transactionController.createTransaction
  );

  transactionRegistry.registerPath({
    method: Method.PUT,
    path: '/api/transaction',
    tags: [Module.TRANSACTION],
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: UpdateTransactionRequestExample,
        },
      },
    },
  });
  router.put(
    '/',
    authenticate,
    validateRequest(UpdateTransactionRequestSchema),
    transactionController.updateTransaction
  );

  transactionRegistry.registerPath({
    method: Method.DELETE,
    path: '/api/transaction/{id}',
    tags: [Module.TRANSACTION],
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Transaction ID',
        schema: {
          type: 'number',
          example: 1,
        },
      },
    ],
  });
  router.delete('/:id', authenticate, transactionController.deleteTransaction);

  return router;
})();
