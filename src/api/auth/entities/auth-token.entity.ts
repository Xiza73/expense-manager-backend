import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Account } from '@/api/account/entities/account.entity';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import { TransactionCategory } from '@/api/transaction/entities/transaction-category.entity';
import { TransactionService } from '@/api/transaction/entities/transaction-service.entity';

@Entity({ name: 'auth_token' })
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  alias: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Account, (account) => account.user, {})
  accounts: Account[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {})
  transactions: Transaction[];

  @OneToMany(() => TransactionCategory, (transactionCategory) => transactionCategory.user, {})
  transactionCategory: TransactionCategory[];

  @OneToMany(() => TransactionService, (transactionService) => transactionService.user, {})
  transactionService: TransactionService[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
