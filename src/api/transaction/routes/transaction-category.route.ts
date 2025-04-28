import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { adminOnly, authenticate } from '@/api/auth/middlewares/auth.middleware';
import { createApiResponses } from '@/config/api-docs/openAPIResponseBuilders';
import { NullResponseSchema } from '@/domain/responses/null.response';
import { Method, Module } from '@/domain/route.enum';
import { validateRequest } from '@/utils/http-handlers.util';

import { transactionCategoryController } from '../controllers/transaction-category.controller';
import { CreateTransactionCategoryRequestSchema } from '../domain/requests/create-transaction-category.request';
import { UpdateTransactionCategoryRequestSchema } from '../domain/requests/update-transaction-category.response';
import { GetTransactionCategoriesResponseSchema } from '../domain/responses/get-transaction-categories.response';

export const transactionCategoryRegistry = new OpenAPIRegistry();

export const transactionCategoryRouter: Router = (() => {
  const router = Router();

  transactionCategoryRegistry.registerPath({
    method: Method.GET,
    path: '/api/transaction-category',
    tags: [Module.TRANSACTION_CATEGORY],
    responses: createApiResponses([
      {
        schema: GetTransactionCategoriesResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/', authenticate, transactionCategoryController.getTransactionCategories);

  transactionCategoryRegistry.registerPath({
    method: Method.POST,
    path: '/api/transaction-category',
    tags: [Module.TRANSACTION_CATEGORY],
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
            name: 'My Transaction Category',
          },
        },
      },
    },
  });
  router.post(
    '/',
    // TODO: Add adminOnly for now, will be removed later on premium plan
    adminOnly,
    validateRequest(CreateTransactionCategoryRequestSchema),
    transactionCategoryController.createTransactionCategory
  );

  transactionCategoryRegistry.registerPath({
    method: Method.PUT,
    path: '/api/transaction-category/{id}',
    tags: [Module.TRANSACTION_CATEGORY],
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
        description: 'Transaction Category ID',
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
            name: 'My Transaction Category',
          },
        },
      },
    },
  });
  router.put(
    '/:id',
    // TODO: Add adminOnly for now, will be removed later on premium plan
    adminOnly,
    validateRequest(UpdateTransactionCategoryRequestSchema),
    transactionCategoryController.updateTransactionCategory
  );

  transactionCategoryRegistry.registerPath({
    method: Method.DELETE,
    path: '/api/transaction-category/{id}',
    tags: [Module.TRANSACTION_CATEGORY],
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
        description: 'Transaction Category ID',
        schema: {
          type: 'number',
          example: 1,
        },
      },
    ],
  });
  router.delete(
    '/:id',
    // TODO: Add adminOnly for now, will be removed later on premium plan
    adminOnly,
    transactionCategoryController.deleteTransactionCategory
  );

  return router;
})();
