import { StatusCodes } from 'http-status-codes';
import { Equal, IsNull, Or } from 'typeorm';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

import { transactionCategoryRepository } from '../../repositories/transaction-category.repository';

export const transactionCategoryServiceUtil = {
  getExistingTransactionCategory: async (categoryId: number, userId: number) => {
    const existingCategory = await transactionCategoryRepository.findOneBy({
      id: categoryId,
      user_id: Or(Equal(userId), IsNull()),
    });

    if (!existingCategory) {
      throw new ServiceResponse(
        ResponseStatus.Failed,
        'Category not found',
        null,
        StatusCodes.NOT_FOUND,
        ErrorCode.TRAN_CATEGORY_NOT_FOUND_404
      );
    }

    return existingCategory;
  },
};
