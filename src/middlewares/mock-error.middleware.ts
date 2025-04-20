import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleServiceResponse } from '@/utils/http-handlers.util';

export const mockErrorMiddleware = (req: Request, res: Response, _next: NextFunction): void => {
  handleServiceResponse(
    new ServiceResponse(
      ResponseStatus.Failed,
      'Something went wrong',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
      ErrorCode.UNKNOWN_500
    ),
    res
  );

  return;
};
