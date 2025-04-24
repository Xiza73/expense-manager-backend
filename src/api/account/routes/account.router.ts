import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authenticate } from '@/api/auth/middlewares/auth.middleware';
import { createApiResponses } from '@/config/api-docs/openAPIResponseBuilders';
import { NullResponseSchema } from '@/domain/responses/null.response';
import { Method, Module } from '@/domain/route.enum';
import { validateRequest } from '@/utils/http-handlers.util';
import { idParamExample } from '@/utils/id-param-example.util';

import { accountController } from '../controllers/account.controller';
import { CreateAccountRequestExample, CreateAccountRequestSchema } from '../domain/requests/create-account.request';
import { GetAccountRequestParameters } from '../domain/requests/get-account.request';
import {
  UpdateAccountRequestExample,
  UpdateAccountRequestParameters,
  UpdateAccountRequestSchema,
} from '../domain/requests/update-account.request';
import { CreateAccountResponseSchema } from '../domain/responses/create-account.response';
import { GetAccountResponseSchema } from '../domain/responses/get-account.response';
import { GetAccountsResponseSchema } from '../domain/responses/get-accounts.response';

export const accountRegistry = new OpenAPIRegistry();

export const accountRouter: Router = (() => {
  const router = Router();

  accountRegistry.registerPath({
    method: Method.GET,
    path: '/api/account',
    tags: [Module.ACCOUNT],
    summary: 'Get all accounts',
    responses: createApiResponses([
      {
        schema: GetAccountsResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/', authenticate, accountController.getAccounts);

  accountRegistry.registerPath({
    method: Method.GET,
    path: '/api/account/latest',
    tags: [Module.ACCOUNT],
    summary: 'Get the latest account',
    responses: createApiResponses([
      {
        schema: GetAccountResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/latest', authenticate, accountController.getLatestAccount);

  accountRegistry.registerPath({
    method: Method.GET,
    path: '/api/account/{id}',
    tags: [Module.ACCOUNT],
    summary: 'Get an account',
    responses: createApiResponses([
      {
        schema: GetAccountResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: GetAccountRequestParameters,
  });
  router.get('/:id', authenticate, accountController.getAccount);

  accountRegistry.registerPath({
    method: Method.POST,
    path: '/api/account',
    tags: [Module.ACCOUNT],
    summary: 'Create an account',
    responses: createApiResponses([
      {
        schema: CreateAccountResponseSchema,
        statusCode: StatusCodes.CREATED,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: CreateAccountRequestExample,
        },
      },
    },
  });
  router.post('/', authenticate, validateRequest(CreateAccountRequestSchema), accountController.createAccount);

  accountRegistry.registerPath({
    method: Method.PUT,
    path: '/api/account/{id}',
    tags: [Module.ACCOUNT],
    summary: 'Update an account',
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: UpdateAccountRequestParameters,
    requestBody: {
      content: {
        'application/json': {
          example: UpdateAccountRequestExample,
        },
      },
    },
  });
  router.put('/:id', authenticate, validateRequest(UpdateAccountRequestSchema), accountController.updateAccount);

  accountRegistry.registerPath({
    method: Method.DELETE,
    path: '/api/account/{id}',
    tags: [Module.ACCOUNT],
    summary: 'Delete an account',
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: idParamExample('Account ID'),
  });
  router.delete('/:id', authenticate, accountController.deleteAccount);

  accountRegistry.registerPath({
    method: Method.PATCH,
    path: '/api/account/default/:id',
    tags: [Module.ACCOUNT],
    summary: 'Set an account as default',
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    parameters: idParamExample('Account ID'),
  });
  router.patch('/default/:id', authenticate, accountController.setDefaultAccount);

  return router;
})();
