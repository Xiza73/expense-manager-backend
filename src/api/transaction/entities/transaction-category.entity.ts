import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';

import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction-category' })
export class TransactionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  color: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  user_id?: number;

  @OneToMany(() => Transaction, (transaction) => transaction.category, {})
  transactions: Transaction[];

  @ManyToOne(() => AuthToken, (authToken) => authToken.transactionCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: AuthToken;
}
