import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createApiResponses } from '@/config/api-docs/openAPIResponseBuilders';
import { NullResponseSchema } from '@/domain/responses/null.response';
import { Method, Module } from '@/domain/route.enum';
import { validateRequest } from '@/utils/http-handlers.util';

import { authController } from '../controllers/auth.controller';
import { CreateUserRequestExample, CreateUserRequestSchema } from '../domain/requests/create-user.request';
import { SignInRequestSchema } from '../domain/requests/sign-in.request';
import { CreateUserResponseSchema } from '../domain/responses/create-user.response';
import { SignInResponseSchema } from '../domain/responses/sign-in.response';
import { adminOnly } from '../middlewares/auth.middleware';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = Router();

  authRegistry.registerPath({
    method: Method.POST,
    path: '/api/auth',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: CreateUserResponseSchema,
        statusCode: StatusCodes.CREATED,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: CreateUserRequestExample,
        },
      },
    },
  });
  router.post('/', adminOnly, validateRequest(CreateUserRequestSchema), authController.createUser);

  authRegistry.registerPath({
    method: Method.PUT,
    path: '/api/auth/alias',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: NullResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: CreateUserRequestExample,
        },
      },
    },
  });
  router.put('/alias', adminOnly, validateRequest(CreateUserRequestSchema), authController.setAlias);

  authRegistry.registerPath({
    method: Method.POST,
    path: '/api/auth/sign-in',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: SignInResponseSchema,
        statusCode: StatusCodes.OK,
      },
    ]),
    requestBody: {
      content: {
        'application/json': {
          example: {
            token: 'string',
          },
        },
      },
    },
  });
  router.post('/sign-in', validateRequest(SignInRequestSchema), authController.signIn);

  return router;
})();
