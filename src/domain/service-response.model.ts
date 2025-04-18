import { z } from 'zod';

import { ResponseCode } from './code-mapper.map';

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
  code: ResponseCode;

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: number, code: ResponseCode) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z.null(),
  statusCode: z.number(),
  code: z.string(),
});

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
    code: z.string(),
  });
