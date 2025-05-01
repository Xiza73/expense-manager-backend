import { Request, Response } from 'express';

import { handleControllerError, handleServiceResponse } from '@/utils/http-handlers.util';

import { authService } from '../services/auth.service';

export const authController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await authService.createUser(req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  setAlias: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await authService.setAlias(req.body);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  signIn: async (req: Request, res: Response) => {
    try {
      const serviceResponse = await authService.signIn(req.body.token);

      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
