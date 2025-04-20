import { Request, Response } from 'express';

import { handleControllerError, handleServiceResponse } from '@/utils/http-handlers.util';

import { accountService } from '../services/account.service';

export const accountController = {
  getAccounts: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await accountService.getAccounts(req.decodedUser, req.query);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  getAccount: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await accountService.getAccount(req.decodedUser, Number(req.params.id));

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  getLatestAccount: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await accountService.getLatestAccount(req.decodedUser);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  createAccount: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await accountService.createAccount(req.decodedUser, req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  updateAccount: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await accountService.updateAccount(req.decodedUser, Number(req.params.id), req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  deleteAccount: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await accountService.deleteAccount(req.decodedUser, Number(req.params.id));

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
