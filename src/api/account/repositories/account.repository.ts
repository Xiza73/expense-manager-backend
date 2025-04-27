import { AppDataSource } from '@/data-source';

import { Account } from '../entities/account.entity';

export const accountRepository = AppDataSource.getRepository(Account);
