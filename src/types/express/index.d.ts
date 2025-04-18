import { Multer } from 'multer';

import { AuthToken } from '@/api/auth/entities/auth-token.entity';

export {};

declare global {
  namespace Express {
    export interface Request {
      multer: Multer;
      decodedUser: AuthToken;
    }
  }
}
