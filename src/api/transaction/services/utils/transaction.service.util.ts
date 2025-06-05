import { StatusCodes } from 'http-status-codes';
import { In } from 'typeorm';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

import { GetTransactionsFieldOrder } from '../../domain/requests/get-transactions.request';
import { ExtraTransactionType, TransactionType } from '../../domain/transaction-type.enum';
import { Transaction } from '../../entities/transaction.entity';
import { transactionRepository } from '../../repositories/transaction.repository';
import { transactionServiceServiceUtil } from './transaction-service.service.util';

const SortByField: { [key in GetTransactionsFieldOrder]: string } = {
  [GetTransactionsFieldOrder.DATE]: 'transaction.date',
  [GetTransactionsFieldOrder.NAME]: 'transaction.name',
  [GetTransactionsFieldOrder.CATEGORY]: 'category.name',
  [GetTransactionsFieldOrder.SERVICE]: 'service.name',
  [GetTransactionsFieldOrder.PAYMENT_METHOD]: 'transaction.paymentMethod',
  [GetTransactionsFieldOrder.TYPE]: 'transaction.type',
  [GetTransactionsFieldOrder.AMOUNT]: 'transaction.amount',
};

export const transactionServiceUtil = {
  getExistingTransaction: async (transactionId: number, userId: number) => {
    const existingTransaction = await transactionRepository.findOneBy({ id: transactionId, user_id: userId });

    if (!existingTransaction) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Transaction not found',
        null,
        StatusCodes.NOT_FOUND,
        ErrorCode.TRANSACTION_NOT_FOUND_404
      );
    }

    return existingTransaction;
  },

  isDebtLoanTransaction: (transactionType: TransactionType) => {
    return transactionType === ExtraTransactionType.DEBT || transactionType === ExtraTransactionType.LOAN;
  },

  getExistingDebtLoanTransaction: async (transactionId: number, userId: number) => {
    const existingTransaction = await transactionRepository.findOneBy({
      id: transactionId,
      user_id: userId,
      type: In([ExtraTransactionType.DEBT, ExtraTransactionType.LOAN]),
    });

    if (!existingTransaction) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Transaction not found',
        null,
        StatusCodes.NOT_FOUND,
        ErrorCode.TRANSACTION_NOT_FOUND_404
      );
    }

    return existingTransaction;
  },

  validateAlreadyPaidTransaction: (isPaid: boolean) => {
    if (isPaid) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Transaction is already paid',
        null,
        StatusCodes.BAD_REQUEST,
        ErrorCode.TRANSACTION_ALREADY_PAID_400
      );
    }
  },

  createPaidTransaction: async (transaction: Transaction, userId: number) => {
    let serviceId = transaction.service_id;

    if (transaction.service_id) {
      try {
        await transactionServiceServiceUtil.getExistingTransactionService(transaction.service_id, userId);
      } catch (_) {
        serviceId = null;
      }
    }
    const transactionType =
      transaction.type === ExtraTransactionType.LOAN ? TransactionType.INCOME : TransactionType.EXPENSE;

    const paidTransaction: Partial<Transaction> = transactionRepository.create({
      ...transaction,
      isDebtLoan: false,
      type: transactionType,
      isPaid: true,
      service_id: serviceId,
    });

    transaction.isPaid = true;

    delete paidTransaction.id;

    await transactionRepository.save(paidTransaction);
  },

  validateDateRange: (accountDate: Date, toCreateDate?: Date) => {
    if (!toCreateDate) toCreateDate = new Date();

    accountDate = new Date(accountDate);
    const toCreateMonth = toCreateDate.getMonth();
    const accountMonth = accountDate.getMonth();
    const toCreateYear = toCreateDate.getFullYear();
    const accountYear = accountDate.getFullYear();
    const isOutOfDate = toCreateMonth !== accountMonth || toCreateYear !== accountYear;

    if (isOutOfDate) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Transaction date should be in the same month and year as the account',
        null,
        StatusCodes.BAD_REQUEST,
        ErrorCode.TRANSACTION_DATE_OUT_OF_DATE_400
      );
    }
  },

  getSortByField: (fieldOrder: GetTransactionsFieldOrder) => {
    return SortByField[fieldOrder];
  },
};
