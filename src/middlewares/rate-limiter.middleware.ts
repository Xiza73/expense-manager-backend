import { Request } from 'express';
import { MemoryStore, rateLimit } from 'express-rate-limit';

import { env } from '@/config/env.config';

export const rateLimiterMiddleware = rateLimit({
  legacyHeaders: true,
  limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later.',
  // how long to keep records of requests in memory
  // in milliseconds
  store: new MemoryStore(),
  standardHeaders: true,
  windowMs: 1000 * env.COMMON_RATE_LIMIT_WINDOW_MS,
  keyGenerator: (req: Request) => req.ip as string,
});
