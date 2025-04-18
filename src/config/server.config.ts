import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from '@/middlewares/error-handler.middleware';
import { rateLimiterMiddleware } from '@/middlewares/rate-limiter.middleware';
import { requestLoggerMiddleware } from '@/middlewares/request-logger.middleware';

import { openAPIRouter } from './api-docs/openAPIRouter';
import { env } from './env.config';
import { routes } from './routes.config';

const _app: Express = express();

// Set the application to trust the reverse proxy
_app.set('trust proxy', true);

// Middlewares
_app.use(morgan('dev'));
_app.use(urlencoded({ extended: true }));
_app.use(json());
_app.use(cookieParser());
_app.use(
  session({
    secret: env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
// _app.use(passport.initialize());
// _app.use(passport.session());

_app.use(helmet());
_app.use(helmet.xssFilter());
_app.use(helmet.hidePoweredBy());
_app.use(
  helmet.hsts({
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  })
);
_app.use(helmet.frameguard({ action: 'deny' }));
_app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      frameAncestors: ["'none'"],
      connectSrc: ["'self'"],
    },
  })
);
_app.use(rateLimiterMiddleware);

// Request logging
_app.use(requestLoggerMiddleware());

// Routes
const whitelist = env.WHITE_LIST_URLS.split(',');

_app.use(
  '/',
  cors({
    origin: (origin: string | undefined, callback: any) => {
      if (env.ALLOW_ALL_ORIGINS) return callback(null, true);
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
  routes
);

// Swagger UI
_app.use(openAPIRouter);

// Error handlers
_app.use(errorHandler());

export const app = _app;
