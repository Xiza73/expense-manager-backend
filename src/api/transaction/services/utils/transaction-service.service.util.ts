import { StatusCodes } from 'http-status-codes';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

import { transactionServiceRepository } from '../../repositories/transaction-service.repository';

export const transactionServiceServiceUtil = {
  getExistingTransactionService: async (serviceId: number, userId: number) => {
    const existingService = await transactionServiceRepository.findOneBy({ id: serviceId, user_id: userId });

    if (!existingService) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Service not found',
        null,
        StatusCodes.NOT_FOUND,
        ErrorCode.TRAN_SERVICE_NOT_FOUND_404
      );
    }

    return existingService;
  },
};
