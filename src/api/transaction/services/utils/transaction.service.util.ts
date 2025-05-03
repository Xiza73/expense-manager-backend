import { StatusCodes } from 'http-status-codes';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

import { GetTransactionsFieldOrder } from '../../domain/requests/get-transactions.request';
import { transactionRepository } from '../../repositories/transaction.repository';

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
