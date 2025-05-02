import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import { daysInMonth } from '@/utils/date.util';

import { Currency } from '../domain/currency.enum';
import { Month, MonthOrder } from '../domain/month.enum';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: Month })
  month: Month;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'timestamp without time zone' })
  date: Date;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  expenseAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  incomeAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  idealDailyExpenditure: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  realDailyExpenditure: number;

  @Column({ type: 'int', default: 0 })
  realDaysSpent: number;

  @Column({ type: 'int', default: 0 })
  daysInDebt: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  color: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.account, {})
  transactions: Transaction[];

  @ManyToOne(() => AuthToken, (authToken) => authToken.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: AuthToken;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateDate() {
    this.date = new Date(`${this.year}-${MonthOrder[this.month]}-01`);
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateIdealDailyExpenditure() {
    this.idealDailyExpenditure = this.amount / daysInMonth(MonthOrder[this.month], this.year);
  }
}
