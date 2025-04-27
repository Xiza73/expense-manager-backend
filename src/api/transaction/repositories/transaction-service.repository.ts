import { AppDataSource } from '@/data-source';

import { TransactionService } from '../entities/transaction-service.entity';

export const transactionServiceRepository = AppDataSource.getRepository(TransactionService);
