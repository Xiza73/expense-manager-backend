import { StatusCodes } from 'http-status-codes';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage, handleServiceError } from '@/utils/error.util';

import { CreateAccountRequestObject } from '../domain/requests/create-account.request';
import { GetAccountsRequestObject } from '../domain/requests/get-accounts.request';
import { UpdateAccountRequestObject } from '../domain/requests/update-account.request';
import { CreateAccountResponse, CreateAccountResponseObject } from '../domain/responses/create-account.response';
import { GetAccountResponse, GetAccountResponseObject } from '../domain/responses/get-account.response';
import { GetAccountsResponse, GetAccountsResponseObject } from '../domain/responses/get-accounts.response';
import { accountRepository } from '../repositories/account.repository';
import { accountServiceUtil } from './utils/account.service.util';

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
        .orderBy('account.date', 'DESC')
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
      const account = await accountRepository.findOneBy({ user_id: user.id, isDefault: true });

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

  createAccount: async (user: AuthToken, data: CreateAccountRequestObject): Promise<CreateAccountResponse> => {
    try {
      await accountServiceUtil.validateNotExistAccount(user.id, data.month, data.year);

      const isDefault = await accountServiceUtil.getIsDefaultAccount(user.id, data.month, data.year);

      const newAccount = accountRepository.create({
        ...data,
        balance: data.amount,
        user_id: user.id,
        isDefault,
      });

      const account = await accountRepository.save(newAccount);

      const response = CreateAccountResponseObject.parse({
        id: account.id,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account created successfully',
        response,
        StatusCodes.CREATED,
        SuccessCode.SUCCESS_201
      );
    } catch (error) {
      return handleServiceError('Failed on create account', error);
    }
  },

  updateAccount: async (
    user: AuthToken,
    accountId: number,
    data: UpdateAccountRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingAccount = await accountServiceUtil.getExistingAccount(accountId, user.id);

      await accountServiceUtil.validateUpdateDateAccount(existingAccount, data.month, data.year);

      await accountServiceUtil.validateUpdateCurrencyAccount(existingAccount, data.currency);

      existingAccount.balance = Number(existingAccount.balance) + Number(data.amount) - Number(existingAccount.amount);
      existingAccount.amount = data.amount;
      existingAccount.currency = data.currency;
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
      return handleServiceError('Failed to update account', error);
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

  setDefaultAccount: async (user: AuthToken, accountId: number): Promise<NullResponse> => {
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

      const defaultAccount = await accountRepository.findOneBy({ user_id: user.id, isDefault: true });

      if (defaultAccount?.id === existingAccount.id) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Account is already default',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.ACCOUNT_ALREADY_DEFAULT_400
        );
      }

      if (defaultAccount) {
        await accountRepository.update(defaultAccount.id, {
          isDefault: false,
        });
      }

      await accountRepository.update(existingAccount.id, {
        isDefault: true,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Account set as default successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to set account as default', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
