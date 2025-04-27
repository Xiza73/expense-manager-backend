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

  @Column({ type: 'timestamp without time zone' })
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

    const thisExpenseAmount = this.type === TransactionType.EXPENSE ? Number(this.amount) : 0;
    const thisIncomeAmount = this.type === TransactionType.INCOME ? Number(this.amount) : 0;

    let expenseAmount = transactions.reduce(
      (sum, t) => sum + (t.type === TransactionType.EXPENSE ? Number(t.amount) : 0),
      0
    );
    let incomeAmount = transactions.reduce(
      (sum, t) => sum + (t.type === TransactionType.INCOME ? Number(t.amount) : 0),
      0
    );

    if (!isDeleted) {
      expenseAmount += thisExpenseAmount;
      incomeAmount += thisIncomeAmount;
    }

    expenseAmount = Math.round(expenseAmount * 100) / 100;
    incomeAmount = Math.round(incomeAmount * 100) / 100;

    const balance = Math.round((Number(account.amount) - expenseAmount + incomeAmount) * 100) / 100;

    await accountRepo.update(this.account_id, { balance, expenseAmount, incomeAmount });
  }

  @AfterInsert()
  async afterInsert() {
    await this.updateAccount();
  }

  @AfterUpdate()
  async afterUpdate() {
    await this.updateAccount();
  }

  @BeforeRemove()
  async beforeRemove() {
    await this.updateAccount(true);
  }
}
