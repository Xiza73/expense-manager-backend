import { StatusCodes } from 'http-status-codes';

import { accountRepository } from '@/api/account/services/account.service';
import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { AppDataSource } from '@/data-source';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { CreateTransactionRequestObject } from '../domain/requests/create-transaction.request';
import { GetTransactionsRequestObject } from '../domain/requests/get-transactions.request';
import { UpdateTransactionRequestObject } from '../domain/requests/update-transaction.request';
import { GetTransactionResponse, GetTransactionResponseObject } from '../domain/responses/get-transaction.response';
import { GetTransactionsResponse, GetTransactionsResponseObject } from '../domain/responses/get-transactions.response';
import { Transaction } from '../entities/transaction.entity';
import { TransactionCategory } from '../entities/transaction-category.entity';
import { TransactionService } from '../entities/transaction-service.entity';

export const transactionRepository = AppDataSource.getRepository(Transaction);
export const transactionCategoryRepository = AppDataSource.getRepository(TransactionCategory);
export const transactionServiceRepository = AppDataSource.getRepository(TransactionService);

export const transactionService = {
  getTransactions: async (
    user: AuthToken,
    { page = 1, limit = 10, accountId, categoryId, serviceId }: GetTransactionsRequestObject
  ): Promise<GetTransactionsResponse> => {
    try {
      const queryBuilder = transactionRepository
        .createQueryBuilder('transaction')
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

      const transactionsResponse = await queryBuilder
        .orderBy('transaction.createdAt', 'DESC')
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      const transactions = transactionsResponse[0];
      const total = transactionsResponse[1];
      const pages = Math.ceil(total / limit);

      const response = GetTransactionsResponseObject.parse({
        data: transactions,
        total,
        pages,
        page,
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
      const transaction = await transactionRepository.findOneBy({ id: transactionId, user_id: user.id });

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

  createTransaction: async (
    user: AuthToken,
    {
      amount,
      currency,
      isActive,
      name,
      type,
      description,
      categoryId,
      serviceId,
      accountId,
      date,
    }: CreateTransactionRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingAccount = await accountRepository.findOneBy({ id: accountId, user_id: user.id });

      if (!existingAccount) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.ACCOUNT_NOT_FOUND_404
        );
      }

      // const existingSettings = await settingsRepository.findOneBy({ user_id: user.id });

      // if (existingAccount.currency !== currency && !existingSettings?.exchangeRate) {
      if (existingAccount.currency !== currency) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          // 'You need to set up your exchange rate',
          'Please select a account with the same currency',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.SETTINGS_NOT_FOUND_404
        );
      }

      const existingCategory = await transactionCategoryRepository.findOneBy({ id: categoryId, user_id: user.id });

      if (!existingCategory) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Category not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRAN_CATEGORY_NOT_FOUND_404
        );
      }

      const existingService = await transactionServiceRepository.findOneBy({ id: serviceId, user_id: user.id });

      if (!existingService) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Service not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRAN_SERVICE_NOT_FOUND_404
        );
      }

      if (date) {
        if (isNaN(date.getTime())) {
          return new ServiceResponse(
            ResponseStatus.Failed,
            'Invalid date',
            null,
            StatusCodes.BAD_REQUEST,
            ErrorCode.UNKNOWN_400
          );
        }
      }

      const newTransaction = transactionRepository.create({
        amount,
        currency,
        isActive,
        name,
        type,
        ...(description ? { description } : {}),
        ...(date
          ? { date }
          : {
              date: new Date(),
            }),
        category_id: categoryId,
        service_id: serviceId,
        account_id: accountId,
        user_id: user.id,
      });

      await transactionRepository.save(newTransaction);

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
        handleErrorMessage('Failed to recognize text', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  updateTransaction: async (
    user: AuthToken,
    {
      id: transactionId,
      amount,
      currency,
      isActive,
      name,
      date,
      type,
      description,
      categoryId,
      serviceId,
      accountId,
    }: UpdateTransactionRequestObject
  ): Promise<NullResponse> => {
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

      const existingAccount = await accountRepository.findOneBy({ id: accountId, user_id: user.id });

      if (!existingAccount) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.ACCOUNT_NOT_FOUND_404
        );
      }

      // const existingSettings = await settingsRepository.findOneBy({ user_id: user.id });

      // if (existingAccount.currency !== currency && !existingSettings?.exchangeRate) {
      if (existingAccount.currency !== currency) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          // 'You need to set up your exchange rate',
          'Please select a account with the same currency',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.SETTINGS_NOT_FOUND_404
        );
      }

      const existingCategory = await transactionCategoryRepository.findOneBy({ id: categoryId, user_id: user.id });

      if (!existingCategory) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Category not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRAN_CATEGORY_NOT_FOUND_404
        );
      }

      const existingService = await transactionServiceRepository.findOneBy({ id: serviceId, user_id: user.id });

      if (!existingService) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Service not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRAN_SERVICE_NOT_FOUND_404
        );
      }

      existingTransaction.amount = amount;
      existingTransaction.category_id = categoryId;
      existingTransaction.currency = currency;
      existingTransaction.isActive = isActive;
      existingTransaction.name = name;
      existingTransaction.date = date;
      existingTransaction.type = type;
      existingTransaction.description = description || undefined;
      existingTransaction.service_id = serviceId;
      existingTransaction.account_id = accountId;

      await transactionRepository.save(existingTransaction);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction updated successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to update transaction', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
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
