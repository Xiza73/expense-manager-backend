import { Router } from 'express';

const ModuleKey = {
  AUTH: 'AUTH',
  ACCOUNT: 'ACCOUNT',
  TRANSACTION: 'TRANSACTION',
  TRANSACTION_CATEGORY: 'TRANSACTION_CATEGORY',
  TRANSACTION_SERVICE: 'TRANSACTION_SERVICE',
} as const;
type ModuleKey = (typeof ModuleKey)[keyof typeof ModuleKey];

export const Module = {
  [ModuleKey.AUTH]: 'auth',
  [ModuleKey.ACCOUNT]: 'account',
  [ModuleKey.TRANSACTION]: 'transaction',
  [ModuleKey.TRANSACTION_CATEGORY]: 'transaction-category',
  [ModuleKey.TRANSACTION_SERVICE]: 'transaction-service',
} as const;
export type Module = (typeof Module)[keyof typeof Module];

export const ModulePath = {
  [ModuleKey.AUTH]: '/api/auth',
  [ModuleKey.ACCOUNT]: '/api/account',
  [ModuleKey.TRANSACTION]: '/api/transaction',
  [ModuleKey.TRANSACTION_CATEGORY]: '/api/transaction-category',
  [ModuleKey.TRANSACTION_SERVICE]: '/api/transaction-service',
} as const;
export type ModulePath = (typeof ModulePath)[keyof typeof ModulePath];

export interface Route {
  path: ModulePath;
  router: Router;
}

export enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}
