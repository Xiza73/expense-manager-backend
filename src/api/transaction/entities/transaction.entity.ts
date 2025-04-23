import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Currency } from '@/api/account/domain/currency.enum';
import { Account } from '@/api/account/entities/account.entity';
import { AuthToken } from '@/api/auth/entities/auth-token.entity';

import { PaymentMethod } from '../domain/payment-method.enum';
import { TransactionType } from '../domain/transaction-type.enum';
import { TransactionCategory } from './transaction-category.entity';
import { TransactionService } from './transaction-service.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: false })
  category_id: number;

  @Column({ type: 'int', nullable: false })
  service_id: number;

  @Column({ type: 'int', nullable: false })
  account_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => TransactionCategory, (category) => category.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: TransactionCategory;

  @ManyToOne(() => TransactionService, (service) => service.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'service_id', referencedColumnName: 'id' })
  service: TransactionService;

  @ManyToOne(() => Account, (account) => account.transactions, {})
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => AuthToken, (authToken) => authToken.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: AuthToken;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
