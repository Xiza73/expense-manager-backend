import { Router } from 'express';

import { accountRouter } from '@/api/account/routes/account.router';
import { authRouter } from '@/api/auth/routes/auth.route';
import { transactionRouter } from '@/api/transaction/routes/transaction.route';
import { transactionCategoryRouter } from '@/api/transaction/routes/transaction-category.route';
import { transactionServiceRouter } from '@/api/transaction/routes/transaction-service.route';
import { ModulePath, Route } from '@/domain/route.enum';

const routeList: Route[] = [
  {
    path: ModulePath.AUTH,
    router: authRouter,
  },
  {
    path: ModulePath.ACCOUNT,
    router: accountRouter,
  },
  {
    path: ModulePath.TRANSACTION,
    router: transactionRouter,
  },
  {
    path: ModulePath.TRANSACTION_CATEGORY,
    router: transactionCategoryRouter,
  },
  {
    path: ModulePath.TRANSACTION_SERVICE,
    router: transactionServiceRouter,
  },
];

export const routes = (() => {
  const routes: Router = Router();

  routeList.forEach((route) => {
    routes.use(route.path, route.router);
  });

  return routes;
})();
