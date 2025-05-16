import { StatusCodes } from 'http-status-codes';

import { transactionRepository } from '@/api/transaction/repositories/transaction.repository';
import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

import { Month, MonthOrder } from '../../domain/month.enum';
import { Account } from '../../entities/account.entity';
import { accountRepository } from '../../repositories/account.repository';

export const accountServiceUtil = {
  getExistingAccount: async (accountId: number, userId: number) => {
    const existingAccount = await accountRepository.findOneBy({ id: accountId, user_id: userId });

    if (!existingAccount) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Account not found',
        null,
        StatusCodes.NOT_FOUND,
        ErrorCode.ACCOUNT_NOT_FOUND_404
      );
    }

    return existingAccount;
  },

  validateNotExistMonthlyAccount: async (userId: number, month: Month, year: number, description?: string) => {
    const existingAccount = await accountRepository.findOneBy({
      user_id: userId,
      month,
      year,
      description,
    });

    if (existingAccount) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Account already exists for this month, year and description',
        null,
        StatusCodes.BAD_REQUEST,
        ErrorCode.ACCOUNT_ALREADY_EXISTS_400
      );
    }
  },

  validateNotExistNamedAccount: async (userId: number, description: string) => {
    const existingAccount = await accountRepository.findOneBy({
      user_id: userId,
      description,
    });

    if (existingAccount) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Account already exists for this name',
        null,
        StatusCodes.BAD_REQUEST,
        ErrorCode.ACCOUNT_ALREADY_EXISTS_400
      );
    }
  },

  getIsDefaultAccount: async (userId: number, month?: Month, year?: number) => {
    let isDefault = false;

    const latestAccount = (
      await accountRepository.find({
        where: { user_id: userId },
        order: {
          date: 'DESC',
        },
        take: 1,
      })
    )?.[0];

    if (!latestAccount) return true;

    if (!month) return false;
    if (!year) return false;

    if (latestAccount?.isDefault) {
      const latestAccountDate = new Date(latestAccount.date);
      const newAccountDate = new Date(`${year}-${MonthOrder[month]}-01`);
      const latestAccountMonth = latestAccountDate.getMonth();
      const newAccountMonth = newAccountDate.getMonth();
      const latestAccountYear = latestAccountDate.getFullYear();
      const newAccountYear = newAccountDate.getFullYear();

      if (
        newAccountMonth > latestAccountMonth ||
        (newAccountMonth === latestAccountMonth && newAccountYear > latestAccountYear)
      ) {
        accountRepository.update(latestAccount.id, {
          isDefault: false,
        });

        isDefault = true;
      }
    }

    return isDefault;
  },

  validateUpdateDateAccount: async (account: Account, month?: Month, year?: number, description?: string) => {
    if (month !== account.month || year !== account.year) {
      const existingAccountForMonth = await accountRepository.findOneBy({
        user_id: account.user_id,
        month,
        year,
        description,
      });

      if (existingAccountForMonth) {
        throw new ServiceResponse(
          ResponseStatus.Failed,
          'Account already exists for this month, year and description',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.ACCOUNT_ALREADY_EXISTS_400
        );
      }
    }
  },

  validateUpdateCurrencyAccount: async (account: Account, currency: string) => {
    const existingTransactions = await transactionRepository.count({
      where: {
        account_id: account.id,
      },
    });

    if (existingTransactions && existingTransactions > 0 && currency !== account.currency) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Please delete all transactions before changing the currency',
        null,
        StatusCodes.BAD_REQUEST,
        ErrorCode.TRANSACTIONS_ALREADY_EXISTS_400
      );
    }
  },

  validateCurrencyAccount: (account: Account, currency: string) => {
    if (account.currency !== currency) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Please select a account with the same currency',
        null,
        StatusCodes.NOT_FOUND,
        ErrorCode.SETTINGS_NOT_FOUND_404
      );
    }
  },
};
