import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodSchema } from 'zod';

import { ErrorCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const handleControllerError = (error: Error, response: Response) => {
  const errorMessage = error.message || 'Internal server error';

  return response
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR, 'UNKN500')
    );
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanReq = schema.parse({ body: req.body, query: req.query, params: req.params });

    req.body = cleanReq.body;
    req.query = cleanReq.query;
    req.params = cleanReq.params;

    next();
  } catch (err) {
    const firstError = (err as ZodError).errors[0];
    const errorMessage = `Invalid input for ${firstError.path.join('.')}: ${firstError.message}`;
    const statusCode = StatusCodes.BAD_REQUEST;

    res
      .status(statusCode)
      .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode, ErrorCode.UNKNOWN_400));
  }
};
