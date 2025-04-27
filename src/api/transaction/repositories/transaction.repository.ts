import { AppDataSource } from '@/data-source';

import { Transaction } from '../entities/transaction.entity';

export const transactionRepository = AppDataSource.getRepository(Transaction);
