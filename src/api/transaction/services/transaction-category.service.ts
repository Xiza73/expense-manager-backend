import { StatusCodes } from 'http-status-codes';
import { Not } from 'typeorm';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { NullResponse } from '@/domain/responses/null.response';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { CreateTransactionCategoryRequestObject } from '../domain/requests/create-transaction-category.request';
import { UpdateTransactionCategoryRequestObject } from '../domain/requests/update-transaction-category.response';
import {
  GetTransactionCategoriesResponse,
  GetTransactionCategoriesResponseObject,
} from '../domain/responses/get-transaction-categories.response';
import { transactionCategoryRepository } from './transaction.service';

export const transactionCategoryService = {
  getTransactionCategories: async (user: AuthToken): Promise<GetTransactionCategoriesResponse> => {
    try {
      const transactionCategories = await transactionCategoryRepository.find({
        where: { user_id: user.id },
        order: { name: 'ASC' },
      });

      const response = GetTransactionCategoriesResponseObject.parse({
        data: transactionCategories,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction categories retrieved successfully',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to retrieve transaction categories', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  createTransactionCategory: async (
    user: AuthToken,
    { name }: CreateTransactionCategoryRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingTransactionCategory = await transactionCategoryRepository.findOneBy({
        name,
        user_id: user.id,
      });

      if (existingTransactionCategory) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction category already exists',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.TRANSACTION_CATEGORY_ALREADY_EXISTS_400
        );
      }

      const newTransactionCategory = transactionCategoryRepository.create({
        name,
        user_id: user.id,
      });

      await transactionCategoryRepository.save(newTransactionCategory);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction category created successfully',
        null,
        StatusCodes.CREATED,
        SuccessCode.SUCCESS_201
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to create transaction category', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  updateTransactionCategory: async (
    user: AuthToken,
    transactionCategoryId: number,
    { name }: UpdateTransactionCategoryRequestObject
  ): Promise<NullResponse> => {
    try {
      const existingTransactionCategory = await transactionCategoryRepository.findOneBy({
        id: transactionCategoryId,
        user_id: user.id,
      });

      if (!existingTransactionCategory) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction category not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRANSACTION_CATEGORY_NOT_FOUND_404
        );
      }

      const existingTransactionWithSameName = await transactionCategoryRepository.findOneBy({
        name,
        user_id: user.id,
        id: Not(existingTransactionCategory.id),
      });

      if (existingTransactionWithSameName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction category already exists',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.TRANSACTION_CATEGORY_ALREADY_EXISTS_400
        );
      }

      existingTransactionCategory.name = name;

      await transactionCategoryRepository.save(existingTransactionCategory);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction category updated successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to update transaction category', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  deleteTransactionCategory: async (user: AuthToken, transactionCategoryId: number): Promise<NullResponse> => {
    try {
      const existingTransactionCategory = await transactionCategoryRepository.findOneBy({
        id: transactionCategoryId,
        user_id: user.id,
      });

      if (!existingTransactionCategory) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Transaction category not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.TRANSACTION_CATEGORY_NOT_FOUND_404
        );
      }

      await transactionCategoryRepository.delete(existingTransactionCategory.id);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Transaction category deleted successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Failed to delete transaction category', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
