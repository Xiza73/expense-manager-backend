import { StatusCodes } from 'http-status-codes';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { AppDataSource } from '@/data-source';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { CreateAccountRequestObject } from '../domain/requests/create-account.request';
import { GetAccountsRequestObject } from '../domain/requests/get-accounts.request';
import { UpdateAccountRequestObject } from '../domain/requests/update-account.request';
import { GetAccountResponse, GetAccountResponseObject } from '../domain/responses/get-account.response';
import { GetAccountsResponse, GetAccountsResponseObject } from '../domain/responses/get-accounts.response';
import { Account } from '../entities/account.entity';
import { monthYearOrder } from '../utils/month-year-order.util';

export const accountRepository = AppDataSource.getRepository(Account);

export const accountService = {
  getAccounts: async (
    user: AuthToken,
    { page = 1, limit = 10, month, year }: GetAccountsRequestObject
  ): Promise<GetAccountsResponse> => {
    try {
      const queryBuilder = accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.user', 'user')
        .where('account.user_id = :userId', { userId: user.id });

      if (month) {
        queryBuilder.andWhere('account.month = :month', { month });
      }

      if (year) {
        queryBuilder.andWhere('account.year = :year', { year });
      }

      const accountsResponse = await queryBuilder
        .orderBy('account.createdAt', 'DESC')
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      const accounts = accountsResponse[0];
      const total = accountsResponse[1];
      const pages = Math.ceil(total / limit);

      const response = GetAccountsResponseObject.parse({
        data: accounts,
        total,
        pages,
        page,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Accounts retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve accounts', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  getAccount: async (user: AuthToken, accountId: number): Promise<GetAccountResponse> => {
    try {
      const account = await accountRepository.findOneBy({ id: accountId, user_id: user.id });

      if (!account) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.ACCOUNT_NOT_FOUND_404
        );
      }

      const response = GetAccountResponseObject.parse(account);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve account', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  getLatestAccount: async (user: AuthToken): Promise<GetAccountResponse> => {
    try {
      const accounts = await accountRepository.find({
        where: { user_id: user.id },
      });

      if (!accounts.length) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.ACCOUNT_NOT_FOUND_404
        );
      }

      const account = accounts.sort((a, b) => monthYearOrder(b.month, b.year, a.month, a.year))[0];

      if (!account) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.ACCOUNT_NOT_FOUND_404
        );
      }

      const response = GetAccountResponseObject.parse(account);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve account', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  createAccount: async (user: AuthToken, data: CreateAccountRequestObject): Promise<NullResponse> => {
    try {
      const existingAccount = await accountRepository.findOneBy({
        user_id: user.id,
        month: data.month,
        year: data.year,
      });

      if (existingAccount) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account already exists for this month and year',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.ACCOUNT_ALREADY_EXISTS_400
        );
      }

      const newAccount = accountRepository.create({
        ...data,
        balance: data.amount,
        user_id: user.id,
      });

      await accountRepository.save(newAccount);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account created successfully',
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

  updateAccount: async (
    user: AuthToken,
    accountId: number,
    data: UpdateAccountRequestObject
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

      if (data.month !== existingAccount.month || data.year !== existingAccount.year) {
        const existingAccountForMonth = await accountRepository.findOneBy({
          user_id: user.id,
          month: data.month,
          year: data.year,
        });

        if (existingAccountForMonth) {
          return new ServiceResponse(
            ResponseStatus.Failed,
            'Account already exists for this month and year',
            null,
            StatusCodes.BAD_REQUEST,
            ErrorCode.ACCOUNT_ALREADY_EXISTS_400
          );
        }
      }

      if (data.currency !== existingAccount.currency) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Currency cannot be changed',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.ACCOUNT_CANNOT_CHANGE_CURRENCY_400
        );
      }

      existingAccount.balance = Number(existingAccount.balance) + Number(data.amount) - Number(existingAccount.amount);
      existingAccount.amount = data.amount;
      existingAccount.color = data.color || null;
      existingAccount.description = data.description || null;
      existingAccount.month = data.month;
      existingAccount.year = data.year;

      await accountRepository.save(existingAccount);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account updated successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to update account', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  deleteAccount: async (user: AuthToken, accountId: number): Promise<NullResponse> => {
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

      await accountRepository.delete(existingAccount.id);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account deleted successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to delete account', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
