import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authenticate } from '@/api/auth/middlewares/auth.middleware';
import { createApiResponses } from '@/config/api-docs/openAPIResponseBuilders';
import { NullResponseSchema } from '@/domain/responses/null.response';
import { Method, Module } from '@/domain/route.enum';
import { validateRequest } from '@/utils/http-handlers.util';
import { idParamExample } from '@/utils/id-param-example.util';

import { transactionController } from '../controllers/transaction.controller';
import {
  CreateTransactionRequestExample,
  CreateTransactionRequestSchema,
} from '../domain/requests/create-transaction.request';
import {
  GetTransactionsRequestParameters,
  GetTransactionsRequestSchema,
} from '../domain/requests/get-transactions.request';
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
    summary: 'Get all transactions',
    responses: createApiResponses([
      {
        schema: GetTransactionsResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: GetTransactionsRequestParameters,
  });
  router.get('/', authenticate, validateRequest(GetTransactionsRequestSchema), transactionController.getTransactions);

  transactionRegistry.registerPath({
    method: Method.GET,
    path: '/api/transaction/{id}',
    tags: [Module.TRANSACTION],
    summary: 'Get a transaction',
    responses: createApiResponses([
      {
        schema: GetTransactionResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: idParamExample('Transaction ID'),
  });
  router.get('/:id', authenticate, transactionController.getTransaction);

  transactionRegistry.registerPath({
    method: Method.POST,
    path: '/api/transaction',
    tags: [Module.TRANSACTION],
    summary: 'Create a transaction',
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
    path: '/api/transaction/{id}',
    tags: [Module.TRANSACTION],
    summary: 'Update a transaction',
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
    parameters: idParamExample('Transaction ID'),
  });
  router.put(
    '/:id',
    authenticate,
    validateRequest(UpdateTransactionRequestSchema),
    transactionController.updateTransaction
  );

  transactionRegistry.registerPath({
    method: Method.POST,
    path: '/api/transaction/{id}/pay',
    tags: [Module.TRANSACTION],
    summary: 'Pay a debt/loan',
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: idParamExample('Transaction ID'),
  });
  router.post('/:id/pay', authenticate, transactionController.payDebtLoan);

  transactionRegistry.registerPath({
    method: Method.DELETE,
    path: '/api/transaction/{id}',
    tags: [Module.TRANSACTION],
    summary: 'Delete a transaction',
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: idParamExample('Transaction ID'),
  });
  router.delete('/:id', authenticate, transactionController.deleteTransaction);

  return router;
})();
