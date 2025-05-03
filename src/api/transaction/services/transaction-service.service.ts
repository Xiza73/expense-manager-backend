import { StatusCodes } from 'http-status-codes';
import { Equal, IsNull, Not, Or } from 'typeorm';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { CreateTransactionServiceRequestObject } from '../domain/requests/create-transaction-services.request';
import { UpdateTransactionServiceRequestObject } from '../domain/requests/update-transaction-service.request';
import {
  GetTransactionServicesResponse,
  GetTransactionServicesResponseObject,
} from '../domain/responses/get-transaction-services.response';
import { transactionServiceRepository } from '../repositories/transaction-service.repository';

export const transactionServiceService = {
  getTransactionServices: async (user: AuthToken): Promise<GetTransactionServicesResponse> => {
    try {
      const transactionServices = await transactionServiceRepository.find({
        where: [
          { user_id: user.id },
          {
            user_id: IsNull(),
          },
        ],
        order: { name: 'ASC' },
      });

      const response = GetTransactionServicesResponseObject.parse({
        data: transactionServices,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction services retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve transaction services', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  createTransactionService: async (
    user: AuthToken,
    { name }: CreateTransactionServiceRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingTransactionService = await transactionServiceRepository.findOneBy({
        name,
        user_id: Or(Equal(user.id), IsNull()),
      });

      if (existingTransactionService) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction service already exists',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.TRANSACTION_SERVICE_ALREADY_EXISTS_400
        );
      }

      const newTransactionService = transactionServiceRepository.create({
        name,
        user_id: user.id,
      });

      await transactionServiceRepository.save(newTransactionService);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction service created successfully',
        null,
        StatusCodes.CREATED,
        SuccessCode.SUCCESS_201
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to create transaction service', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  updateTransactionService: async (
    user: AuthToken,
    transactionServiceId: number,
    { name }: UpdateTransactionServiceRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingTransactionService = await transactionServiceRepository.findOneBy({
        id: transactionServiceId,
        user_id: user.id,
      });

      if (!existingTransactionService) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction service not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRANSACTION_SERVICE_NOT_FOUND_404
        );
      }

      const existingTransactionWithSameName = await transactionServiceRepository.findOneBy({
        name,
        user_id: user.id,
        id: Not(existingTransactionService.id),
      });

      if (existingTransactionWithSameName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction service already exists',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.TRANSACTION_SERVICE_ALREADY_EXISTS_400
        );
      }

      existingTransactionService.name = name;

      await transactionServiceRepository.save(existingTransactionService);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction service updated successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to update transaction service', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  deleteTransactionService: async (user: AuthToken, transactionServiceId: number): Promise<NullResponse> => {
    try {
      const existingTransactionService = await transactionServiceRepository.findOneBy({
        id: transactionServiceId,
        user_id: user.id,
      });

      if (!existingTransactionService) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction service not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRANSACTION_SERVICE_NOT_FOUND_404
        );
      }

      await transactionServiceRepository.softDelete(existingTransactionService.id);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction service deleted successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to delete transaction service', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
