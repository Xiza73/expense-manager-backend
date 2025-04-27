import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/domain/service-response.model';

import { ErrorCode } from '../domain/code-mapper.map';
import { ResponseStatus } from '../domain/service-response.model';

export const handleErrorMessage = (prefix: string, error: any): string => {
  try {
    if (Array.isArray(JSON.parse(error))) {
      const errArray: any[] = JSON.parse(error);

      const errMessage = errArray
        .reduce((acc: string[], curr: any) => {
          const message = curr.message;

          return [...acc, `${curr.path.join('.')}: ${message}`];
        }, [])
        .join(' | ');

      return `${prefix}: ${errMessage}`;
    }

    if (error instanceof Error) {
      if (error.message.includes('numeric field overflow')) {
        return `${prefix}: Amount is too high`;
      }

      return `${prefix}: ${error.message}`;
    }

    return prefix;
  } catch (err) {
    if (error instanceof Error) {
      if (error.message.includes('numeric field overflow')) {
        return `${prefix}: Amount is too high`;
      }

      return `${prefix}: ${error.message}`;
    }

    return `${prefix}: ${err}`;
  }
};

export const handleServiceError = (prefix: string, error: any): ServiceResponse => {
  if (error instanceof ServiceResponse) return error;

  return new ServiceResponse(
    ResponseStatus.Failed,
    handleErrorMessage('Failed', error),
    null,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ErrorCode.UNKNOWN_500
  );
};
