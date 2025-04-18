import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { accountRegistry } from '@/api/account/routes/account.router';
import { authRegistry } from '@/api/auth/routes/auth.route';
import { transactionRegistry } from '@/api/transaction/routes/transaction.route';
import { transactionCategoryRegistry } from '@/api/transaction/routes/transaction-category.route';
import { transactionServiceRegistry } from '@/api/transaction/routes/transaction-service.route';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    authRegistry,
    accountRegistry,
    transactionRegistry,
    transactionCategoryRegistry,
    transactionServiceRegistry,
  ]);
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
    security: [
      {
        bearerAuth: [],
        apiKeyAuth: [],
      },
    ],
  });
}
