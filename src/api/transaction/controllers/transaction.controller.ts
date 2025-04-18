import { Request, Response } from 'express';

import { handleControllerError, handleServiceResponse } from '@/utils/http-handlers.util';

import { transactionService } from '../services/transaction.service';

export const transactionController = {
  getTransactions: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await transactionService.getTransactions(req.decodedUser, req.query as any);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  getTransaction: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await transactionService.getTransaction(req.decodedUser, Number(req.params.id));

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  createTransaction: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await transactionService.createTransaction(req.decodedUser, req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  updateTransaction: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await transactionService.updateTransaction(
        req.decodedUser,
        Number(req.params.id),
        req.body
      );

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  deleteTransaction: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await transactionService.deleteTransaction(req.decodedUser, Number(req.params.id));

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
