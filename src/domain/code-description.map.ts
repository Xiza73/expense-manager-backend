import { StatusCodes } from 'http-status-codes';

export const CodeDescription: {
  [key in StatusCodes]?: string;
} = {
  [StatusCodes.OK]: 'Success',
  [StatusCodes.CREATED]: 'Created',
  [StatusCodes.ACCEPTED]: 'Accepted',
  [StatusCodes.NO_CONTENT]: 'No Content',
  [StatusCodes.RESET_CONTENT]: 'Reset Content',
  [StatusCodes.BAD_REQUEST]: 'Bad Request',
  [StatusCodes.UNAUTHORIZED]: 'Unauthorized',
  [StatusCodes.FORBIDDEN]: 'Forbidden',
  [StatusCodes.NOT_FOUND]: 'Not Found',
  [StatusCodes.CONFLICT]: 'Conflict',
} as const;
export type CodeDescription = (typeof CodeDescription)[keyof typeof CodeDescription];

export const getCodeDescription = (code: StatusCodes): string => {
  return CodeDescription[code] ?? 'Unknown';
};
