import { StatusCodes } from 'http-status-codes';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

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
