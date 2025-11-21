import { StatusCodes } from 'http-status-codes';
import { Brackets } from 'typeorm';

import { accountServiceUtil } from '@/api/account/services/utils/account.service.util';
import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { copy } from '@/utils/copy.util';
import { handleErrorMessage, handleServiceError } from '@/utils/error.util';

import { CreateTransactionRequestObject } from '../domain/requests/create-transaction.request';
import { GetTransactionsFieldOrder, GetTransactionsRequestObject } from '../domain/requests/get-transactions.request';
import { PayDebtLoanRequestObject } from '../domain/requests/pay-debt-loan.request';
import { UpdateTransactionRequestObject } from '../domain/requests/update-transaction.request';
import { GetTransactionResponse, GetTransactionResponseObject } from '../domain/responses/get-transaction.response';
import { GetTransactionsResponse, GetTransactionsResponseObject } from '../domain/responses/get-transactions.response';
import { transactionRepository } from '../repositories/transaction.repository';
import { transactionServiceUtil } from './utils/transaction.service.util';
import { transactionCategoryServiceUtil } from './utils/transaction-category.service.util';
import { transactionServiceServiceUtil } from './utils/transaction-service.service.util';

export const transactionService = {
  getTransactions: async (
    user: AuthToken,
    {
      accountId,
      categoryId,
      fieldOrder,
      isPaid,
      limit,
      order,
      page,
      paymentMethod,
      search,
      serviceId,
      type,
    }: GetTransactionsRequestObject
  ): Promise<GetTransactionsResponse> => {
    try {
      const queryBuilder = transactionRepository
        .createQueryBuilder('transaction')
        .withDeleted()
        .leftJoinAndSelect('transaction.account', 'account')
        .leftJoinAndSelect('transaction.category', 'category')
        .leftJoinAndSelect('transaction.service', 'service')
        .where('transaction.user_id = :userId', { userId: user.id });

      if (accountId) {
        queryBuilder.andWhere('transaction.account_id = :accountId', { accountId });
      }

      if (categoryId) {
        queryBuilder.andWhere('transaction.category_id = :categoryId', { categoryId });
      }

      if (serviceId) {
        queryBuilder.andWhere('transaction.service_id = :serviceId', { serviceId });
      }

      if (isPaid !== undefined) {
        queryBuilder.andWhere('transaction.isPaid = :isPaid', { isPaid });
      }

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('transaction.name ILIKE :search', { search: `%${search}%` }).orWhere(
              'transaction.description ILIKE :search',
              { search: `%${search}%` }
            );
          })
        );
      }

      if (type) {
        queryBuilder.andWhere('transaction.type = :type', { type });
      }

      if (paymentMethod) {
        queryBuilder.andWhere('transaction.paymentMethod = :paymentMethod', { paymentMethod });
      }

      if (fieldOrder && order) {
        const sortByField = transactionServiceUtil.getSortByField(fieldOrder);

        queryBuilder.orderBy(sortByField, order);
        if (fieldOrder !== GetTransactionsFieldOrder.DATE) queryBuilder.addOrderBy('transaction.date', 'DESC');
      } else {
        queryBuilder.orderBy('transaction.date', 'DESC');
      }

      if (page && limit) {
        queryBuilder.take(limit).skip((page - 1) * limit);
      }

      const transactionsResponse = await queryBuilder.getManyAndCount();

      const transactions = transactionsResponse[0];
      const total = transactionsResponse[1];
      const pages = limit ? Math.ceil(total / limit) : 1;

      const response = GetTransactionsResponseObject.parse({
        data: transactions,
        total,
        pages,
        page: page || 1,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transactions retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve transactions', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  getTransaction: async (user: AuthToken, transactionId: number): Promise<GetTransactionResponse> => {
    try {
      const transaction = await transactionRepository.findOne({
        where: { id: transactionId, user_id: user.id },
        withDeleted: true,
      });

      if (!transaction) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRANSACTION_NOT_FOUND_404
        );
      }

      const response = GetTransactionResponseObject.parse(transaction);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve transaction', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  createTransaction: async (user: AuthToken, data: CreateTransactionRequestObject): Promise<NullResponse> => {
    try {
      const existingAccount = await accountServiceUtil.getExistingAccount(data.accountId, user.id);

      // const existingSettings = await settingsRepository.findOneBy({ user_id: user.id });

      // if (existingAccount.currency !== currency && !existingSettings?.exchangeRate) {
      accountServiceUtil.validateCurrencyAccount(existingAccount, data.currency);

      await transactionCategoryServiceUtil.getExistingTransactionCategory(data.categoryId, user.id);

      if (data.serviceId) await transactionServiceServiceUtil.getExistingTransactionService(data.serviceId, user.id);

      const { date: toCreateDate } = data;

      if (existingAccount.isMonthly) transactionServiceUtil.validateDateRange(existingAccount.date, toCreateDate);

      const isDebtLoanTransaction = transactionServiceUtil.isDebtLoanTransaction(data.type);

      const newTransaction = transactionRepository.create({
        ...data,
        ...(data.description
          ? { description: data.description }
          : {
              description: undefined,
            }),
        isDebtLoan: isDebtLoanTransaction,
        isPaid: !isDebtLoanTransaction,
        date: toCreateDate,
        category_id: data.categoryId,
        service_id: data.serviceId,
        account_id: data.accountId,
        user_id: user.id,
      });

      await transactionRepository.save(newTransaction);

      // if (isDebtLoanTransaction && data.isPaid)
      //   await transactionServiceUtil.createPaidTransaction(newTransaction, user.id);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction created successfully',
        null,
        StatusCodes.CREATED,
        SuccessCode.SUCCESS_201
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed on creating transaction', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  updateTransaction: async (
    user: AuthToken,
    transactionId: number,
    data: UpdateTransactionRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingTransaction = copy(await transactionServiceUtil.getExistingTransaction(transactionId, user.id));

      const existingAccount = await accountServiceUtil.getExistingAccount(data.accountId, user.id);

      // const existingSettings = await settingsRepository.findOneBy({ user_id: user.id });

      // if (existingAccount.currency !== currency && !existingSettings?.exchangeRate) {
      accountServiceUtil.validateCurrencyAccount(existingAccount, data.currency);

      await transactionCategoryServiceUtil.getExistingTransactionCategory(data.categoryId, user.id);

      if (data.serviceId) await transactionServiceServiceUtil.getExistingTransactionService(data.serviceId, user.id);

      const { date: toCreateDate } = data;

      if (existingAccount.isMonthly) transactionServiceUtil.validateDateRange(existingAccount.date, toCreateDate);

      const isDebtLoanTransaction = transactionServiceUtil.isDebtLoanTransaction(data.type);

      if (existingTransaction.isDebtLoan && existingTransaction.isPaid)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction is already paid, update the expense/income transaction instead',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.TRANSACTION_ALREADY_PAID_400
        );

      existingTransaction.amount = data.amount;
      existingTransaction.category_id = data.categoryId;
      existingTransaction.name = data.name;
      existingTransaction.date = data.date;
      existingTransaction.type = data.type;
      existingTransaction.paymentMethod = data.paymentMethod;
      existingTransaction.description = data.description || null;
      existingTransaction.service_id = data.serviceId || null;
      existingTransaction.account_id = data.accountId;
      existingTransaction.isDebtLoan = isDebtLoanTransaction;
      existingTransaction.isPaid = !isDebtLoanTransaction;

      delete existingTransaction.service;
      delete existingTransaction.category;

      await transactionRepository.save(existingTransaction);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction updated successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return handleServiceError('Failed to update transaction', error);
    }
  },

  payDebtLoan: async (
    user: AuthToken,
    transactionId: number,
    { amount, isPartial, description }: PayDebtLoanRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingTransaction = await transactionServiceUtil.getExistingDebtLoanTransaction(transactionId, user.id);
      const startAmount = existingTransaction.amount;

      transactionServiceUtil.validateAlreadyPaidTransaction(existingTransaction.isPaid);

      if (isPartial) {
        if (amount <= 0)
          return new ServiceResponse(
            ResponseStatus.Failed,
            'Partial payment amount must be greater than zero',
            null,
            StatusCodes.BAD_REQUEST,
            ErrorCode.INVALID_PARTIAL_PAYMENT_AMOUNT_400
          );

        if (amount > existingTransaction.amount)
          return new ServiceResponse(
            ResponseStatus.Failed,
            'Partial payment amount cannot exceed the total amount of the debt/loan',
            null,
            StatusCodes.BAD_REQUEST,
            ErrorCode.PARTIAL_PAYMENT_EXCEEDS_TOTAL_AMOUNT_400
          );

        existingTransaction.amount = amount;
      }

      await transactionServiceUtil.createPaidTransaction(existingTransaction, description || '', user.id);

      existingTransaction.isPaid = true;
      if (isPartial) {
        existingTransaction.amount = startAmount - amount;
        existingTransaction.isPaid = false;
      }

      await transactionRepository.save(existingTransaction);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction paid successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return handleServiceError('Failed to pay debt/loan', error);
    }
  },

  deleteTransaction: async (user: AuthToken, transactionId: number): Promise<NullResponse> => {
    try {
      const existingTransaction = await transactionRepository.findOneBy({ id: transactionId, user_id: user.id });

      if (!existingTransaction) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRANSACTION_NOT_FOUND_404
        );
      }

      await transactionRepository.remove(existingTransaction);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction deleted successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to delete transaction', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
