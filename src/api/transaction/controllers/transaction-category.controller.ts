import { Request, Response } from 'express';

import { handleControllerError, handleServiceResponse } from '@/utils/http-handlers.util';

import { transactionCategoryService } from '../services/transaction-category.service';

export const transactionCategoryController = {
  getTransactionCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceResponse = await transactionCategoryService.getTransactionCategories(req.decodedUser);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  createTransactionCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceResponse = await transactionCategoryService.createTransactionCategory(req.decodedUser, req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  updateTransactionCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const serviceResponse = await transactionCategoryService.updateTransactionCategory(req.decodedUser, id, req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  deleteTransactionCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceResponse = await transactionCategoryService.deleteTransactionCategory(
        req.decodedUser,
        Number(req.params.id)
      );

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
