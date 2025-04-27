import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { Account } from '@/api/account/entities/account.entity';
import { accountRepository } from '@/api/account/repositories/account.repository';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import { logger } from '@/config/logger.config';
import { handleErrorMessage } from '@/utils/error.util';

import { TransactionType } from '../domain/transaction-type.enum';
import { transactionRepository } from '../repositories/transaction.repository';

@EventSubscriber()
export class TransactionSubscriber implements EntitySubscriberInterface<Transaction> {
  listenTo() {
    return Transaction;
  }

  async afterInsert(event: InsertEvent<Transaction>) {
    try {
      const account = await accountRepository.findOneBy({ id: event.entity.account_id });

      if (!account) return;

      let balance = Number(account.balance);
      let expenseAmount = Number(account.expenseAmount);
      let incomeAmount = Number(account.incomeAmount);

      const transactionAmount = Number(event.entity.amount);

      balance += event.entity.type === TransactionType.EXPENSE ? -transactionAmount : transactionAmount;

      if (event.entity.type === TransactionType.EXPENSE) {
        expenseAmount += transactionAmount;
      } else {
        incomeAmount += transactionAmount;
      }

      balance = Math.round(balance * 100) / 100;
      expenseAmount = Math.round(expenseAmount * 100) / 100;
      incomeAmount = Math.round(incomeAmount * 100) / 100;

      const newAccount: Partial<Account> = {
        ...account,
        balance,
        expenseAmount,
        incomeAmount,
      };

      await accountRepository.save(newAccount);
    } catch (error) {
      logger.error(handleErrorMessage('Failed to update account after transaction creation', error));
    }
  }

  async afterUpdate(event: UpdateEvent<Transaction>) {
    try {
      if (!event.entity) {
        logger.error('Transaction not found');

        return;
      }

      const account = await accountRepository.findOneBy({ id: event.entity.account_id });

      if (!account) return;

      const prevTransaction = await transactionRepository.findOneBy({ id: event.entity.id });

      if (!prevTransaction) return;

      const currentTransaction = event.entity;

      let balance = Number(prevTransaction.account.balance);
      let expenseAmount = Number(prevTransaction.account.expenseAmount);
      let incomeAmount = Number(prevTransaction.account.incomeAmount);

      const currentTransactionAmount = Number(currentTransaction.amount);
      const prevTransactionAmount = Number(prevTransaction.amount);

      balance += prevTransaction.type === TransactionType.EXPENSE ? prevTransactionAmount : -prevTransactionAmount;
      balance +=
        currentTransaction.type === TransactionType.EXPENSE ? -currentTransactionAmount : currentTransactionAmount;

      if (prevTransaction.type === TransactionType.EXPENSE) {
        expenseAmount -= prevTransactionAmount;
      } else {
        incomeAmount -= prevTransactionAmount;
      }

      if (currentTransaction.type === TransactionType.EXPENSE) {
        expenseAmount += currentTransactionAmount;
      } else {
        incomeAmount += currentTransactionAmount;
      }

      balance = Math.round(balance * 100) / 100;
      expenseAmount = Math.round(expenseAmount * 100) / 100;
      incomeAmount = Math.round(incomeAmount * 100) / 100;

      const newAccount: Partial<Account> = {
        ...account,
        balance,
        expenseAmount,
        incomeAmount,
      };

      await accountRepository.save(newAccount);
    } catch (error) {
      logger.error(handleErrorMessage('Failed to update account after transaction update', error));
    }
  }

  async afterRemove(event: RemoveEvent<Transaction>) {
    try {
      if (!event.entity) {
        logger.error('Transaction not found');

        return;
      }

      const account = await accountRepository.findOneBy({ id: event.entity.account_id });

      if (!account) return;

      let balance = Number(account.balance);
      let expenseAmount = Number(account.expenseAmount);
      let incomeAmount = Number(account.incomeAmount);

      const transactionAmount = Number(event.entity.amount);

      balance += event.entity.type === TransactionType.EXPENSE ? transactionAmount : -transactionAmount;

      if (event.entity.type === TransactionType.EXPENSE) {
        expenseAmount -= transactionAmount;
      } else {
        incomeAmount -= transactionAmount;
      }

      balance = Math.round(balance * 100) / 100;
      expenseAmount = Math.round(expenseAmount * 100) / 100;
      incomeAmount = Math.round(incomeAmount * 100) / 100;

      const newAccount: Partial<Account> = {
        ...account,
        balance,
        expenseAmount,
        incomeAmount,
      };

      await accountRepository.save(newAccount);
    } catch (error) {
      logger.error(handleErrorMessage('Failed to update account after transaction deletion', error));
    }
  }
}
