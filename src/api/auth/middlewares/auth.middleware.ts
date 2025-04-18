import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppDataSource } from '@/data-source';
import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';
import { handleServiceResponse } from '@/utils/http-handlers.util';

import { AuthToken } from '../entities/auth-token.entity';
import { getBearerToken } from '../utils/token.util';

const authTokenRepository = AppDataSource.getRepository(AuthToken);

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          'Token was not provided',
          null,
          StatusCodes.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED_BY_MIDDLEWARE_401
        ),
        res
      );

      return;
    }

    const authToken = await authTokenRepository.findOneBy({ token });

    if (!authToken) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          'Invalid token',
          null,
          StatusCodes.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED_BY_MIDDLEWARE_TOKEN_401
        ),
        res
      );

      return;
    }

    req.decodedUser = authToken;

    next();
  } catch (err) {
    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Invalid token error', err),
        null,
        StatusCodes.UNAUTHORIZED,
        ErrorCode.UNKNOWN_400
      ),
      res
    );
  }
};

export const adminOnly = async (req: Request, res: Response, next: NextFunction): Promise<void> =>
  await authenticate(req, res, async () => {
    try {
      if (!req.decodedUser?.isAdmin) {
        return handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            'You are not authorized to access this resource',
            null,
            StatusCodes.UNAUTHORIZED,
            ErrorCode.UNAUTHORIZED_BY_MIDDLEWARE_401
          ),
          res
        );
      }

      next();
    } catch (error) {
      return handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          handleErrorMessage('Error checking admin access', error),
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorCode.UNKNOWN_500
        ),
        res
      );
    }
  });
