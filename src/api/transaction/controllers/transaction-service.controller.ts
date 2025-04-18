import { Request, Response } from 'express';

import { handleControllerError, handleServiceResponse } from '@/utils/http-handlers.util';

import { transactionServiceService } from '../services/transaction-service.service';

export const transactionServiceController = {
  getTransactionServices: async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceResponse = await transactionServiceService.getTransactionServices(req.decodedUser);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  createTransactionService: async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceResponse = await transactionServiceService.createTransactionService(req.decodedUser, req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  updateTransactionService: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const serviceResponse = await transactionServiceService.updateTransactionService(req.decodedUser, id, req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  deleteTransactionService: async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceResponse = await transactionServiceService.deleteTransactionService(
        req.decodedUser,
        Number(req.params.id)
      );

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
