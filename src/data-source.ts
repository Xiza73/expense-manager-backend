import 'reflect-metadata';

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { Account } from './api/account/entities/account.entity';
import { AuthToken } from './api/auth/entities/auth-token.entity';
import { Transaction } from './api/transaction/entities/transaction.entity';
import { TransactionCategory } from './api/transaction/entities/transaction-category.entity';
import { TransactionService } from './api/transaction/entities/transaction-service.entity';
import { TransactionCategorySeeder } from './api/transaction/seeds/transaction-category.seed';
import { TransactionServiceSeeder } from './api/transaction/seeds/transaction-service.seed';
import { env } from './config/env.config';

const appDataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [AuthToken, Account, Transaction, TransactionService, TransactionCategory],
  seeds: [TransactionCategorySeeder, TransactionServiceSeeder],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(appDataSourceOptions);
