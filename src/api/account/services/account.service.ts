import { StatusCodes } from 'http-status-codes';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { AppDataSource } from '@/data-source';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { CreateAccountRequestObject } from '../domain/requests/create-account.request';
import { UpdateAccountRequestObject } from '../domain/requests/update-account.request';
import { GetAccountResponse, GetAccountResponseObject } from '../domain/responses/get-account.response';
import { GetAccountsResponse, GetAccountsResponseObject } from '../domain/responses/get-accounts.response';
import { Account } from '../entities/account.entity';
import { monthYearOrder } from '../utils/month-year-order.util';

export const accountRepository = AppDataSource.getRepository(Account);

export const accountService = {
  getAccounts: async (user: AuthToken): Promise<GetAccountsResponse> => {
    try {
      const accounts = await accountRepository.find({
        where: { user_id: user.id },
        // order: { createdAt: 'DESC' },
      });

      accounts.sort((a, b) => monthYearOrder(a.month, a.year, b.month, b.year));

      const response = GetAccountsResponseObject.parse({ accounts });

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
