import { logger } from '@/config/logger.config';

export const toString = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    logger.error('Error on convert data to string', error);

    return '';
  }
};

export const toObject = <T>(data: string, defaultData?: T): T => {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error('Error on convert string to object', error);

    return defaultData || ({} as T);
  }
};
