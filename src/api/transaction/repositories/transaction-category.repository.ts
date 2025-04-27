import { AppDataSource } from '@/data-source';

import { TransactionCategory } from '../entities/transaction-category.entity';

export const transactionCategoryRepository = AppDataSource.getRepository(TransactionCategory);
