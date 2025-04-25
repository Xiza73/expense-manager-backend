import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Account } from './api/account/entities/account.entity';
import { AuthToken } from './api/auth/entities/auth-token.entity';
import { Transaction } from './api/transaction/entities/transaction.entity';
import { TransactionCategory } from './api/transaction/entities/transaction-category.entity';
import { TransactionService } from './api/transaction/entities/transaction-service.entity';
import { env } from './config/env.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [AuthToken, Account, Transaction, TransactionService, TransactionCategory],
  subscribers: [],
  migrations: [],
});
