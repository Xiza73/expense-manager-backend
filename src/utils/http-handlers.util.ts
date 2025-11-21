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

const handleBoolean = (value: string) => {
  if (value === 'true') return true;
  if (value === 'false') return false;

  return value;
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    let query: any = req.query;

    if (query) {
      query = Object.fromEntries(
        Object.entries(req.query).map(([key, value]) => [key, typeof value === 'string' ? handleBoolean(value) : value])
      );
    }

    const cleanReq = schema.parse({ body: req.body, query, params: req.params });

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
