import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authenticate } from '@/api/auth/middlewares/auth.middleware';
import { createApiResponses } from '@/config/api-docs/openAPIResponseBuilders';
import { NullResponseSchema } from '@/domain/responses/null.response';
import { Method, Module } from '@/domain/route.enum';
import { validateRequest } from '@/utils/http-handlers.util';

import { transactionServiceController } from '../controllers/transaction-service.controller';
import { CreateTransactionServiceRequestSchema } from '../domain/requests/create-transaction-services.request';
import { UpdateTransactionServiceRequestSchema } from '../domain/requests/update-transaction-service.request';
import { GetTransactionServicesResponseSchema } from '../domain/responses/get-transaction-services.response';

export const transactionServiceRegistry = new OpenAPIRegistry();

export const transactionServiceRouter: Router = (() => {
  const router = Router();

  transactionServiceRegistry.registerPath({
    method: Method.GET,
    path: '/api/transaction-service',
    tags: [Module.TRANSACTION_SERVICE],
    responses: createApiResponses([
      {
        schema: GetTransactionServicesResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/', authenticate, transactionServiceController.getTransactionServices);

  transactionServiceRegistry.registerPath({
    method: Method.POST,
    path: '/api/transaction-service',
    tags: [Module.TRANSACTION_SERVICE],
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.CREATED,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: {
            name: 'My Transaction Service',
          },
        },
      },
    },
  });
  router.post(
    '/',
    authenticate,
    validateRequest(CreateTransactionServiceRequestSchema),
    transactionServiceController.createTransactionService
  );

  transactionServiceRegistry.registerPath({
    method: Method.PUT,
    path: '/api/transaction-service/{id}',
    tags: [Module.TRANSACTION_SERVICE],
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
        description: 'Transaction Service ID',
        schema: {
          type: 'number',
          example: 1,
        },
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          example: {
            name: 'My Transaction Service',
          },
        },
      },
    },
  });
  router.put(
    '/:id',
    authenticate,
    validateRequest(UpdateTransactionServiceRequestSchema),
    transactionServiceController.updateTransactionService
  );

  transactionServiceRegistry.registerPath({
    method: Method.DELETE,
    path: '/api/transaction-service/{id}',
    tags: [Module.TRANSACTION_SERVICE],
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
        description: 'Transaction Service ID',
        schema: {
          type: 'number',
          example: 1,
        },
      },
    ],
  });
  router.delete('/:id', authenticate, transactionServiceController.deleteTransactionService);

  return router;
})();
