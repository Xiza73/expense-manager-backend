import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Not,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Currency } from '@/api/account/domain/currency.enum';
import { Account } from '@/api/account/entities/account.entity';
import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { AppDataSource } from '@/data-source';

import { PaymentMethod } from '../domain/payment-method.enum';
import { TransactionType } from '../domain/transaction-type.enum';
import { getCurrentAmounts, getDaysLeftInMonth, getDaysPassedInMonth } from '../utils/update-account.util';
import { TransactionCategory } from './transaction-category.entity';
import { TransactionService } from './transaction-service.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  // @Column({ type: 'boolean', default: false })
  // isRecurring: boolean;

  @Column({ type: 'boolean', default: false })
  isDebtLoan: boolean;

  @Column({ type: 'boolean', default: true })
  isPaid: boolean;

  @Column({ type: 'timestamp without time zone' })
  date: Date;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: false })
  category_id: number;

  @Column({ type: 'int', nullable: true })
  service_id?: number | null;

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
    nullable: true,
  })
  @JoinColumn({ name: 'service_id', referencedColumnName: 'id' })
  service?: TransactionService;

  @ManyToOne(() => Account, (account) => account.transactions, {
    eager: true,
  })
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

  private async updateAccount(isDeleted: boolean = false) {
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const accountRepo = AppDataSource.getRepository(Account);

    const transactions = await transactionRepo.find({
      where: { account_id: this.account_id, id: Not(this.id) },
    });

    const account = await accountRepo.findOneBy({ id: this.account_id });

    if (!account) return;

    const thisIdealDailyExpenditure = Number(account.idealDailyExpenditure);

    const { expenseAmount, incomeAmount } = getCurrentAmounts(transactions, this.amount, this.type, isDeleted);

    const totalExpenseAmount = expenseAmount - incomeAmount;

    const daysPassedInMonth = getDaysPassedInMonth(transactions, this.date);
    const daysLeftInMonth = getDaysLeftInMonth(transactions, this.date);

    const realDailyExpenditure = Math.round((totalExpenseAmount / daysPassedInMonth) * 100) / 100;

    let realDaysSpent = Math.round((totalExpenseAmount / thisIdealDailyExpenditure) * 100) / 100;
    realDaysSpent = Math.ceil(realDaysSpent);

    let daysInDebt = Math.round(realDaysSpent - daysPassedInMonth);
    daysInDebt = daysInDebt < 0 ? 0 : daysInDebt;

    const balance = Math.round((Number(account.amount) - totalExpenseAmount) * 100) / 100;

    const leftDailyExpenditure = Math.round((balance / daysLeftInMonth) * 100) / 100;

    await accountRepo.update(this.account_id, {
      balance,
      expenseAmount,
      incomeAmount,
      realDailyExpenditure,
      leftDailyExpenditure,
      realDaysSpent,
      daysInDebt,
    });
  }

  @AfterInsert()
  @AfterUpdate()
  async afterInsert() {
    await this.updateAccount();
  }

  @BeforeRemove()
  async beforeRemove() {
    await this.updateAccount(true);
  }
}
