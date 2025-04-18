import dotenv from 'dotenv';
import { bool, cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  // Environment Configuration
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test', 'local'] }),
  PORT: port({ devDefault: testOnly(3000) }),
  HOST: host({ devDefault: testOnly('localhost') }),

  // CORS Settings
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  WHITE_LIST_URLS: str(),
  ALLOW_ALL_ORIGINS: bool({ devDefault: testOnly(false) }),

  // Rate Limit
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),

  // Session Configuration
  JWT_SECRET: str(),

  // Database Configuration
  DB_HOST: str({ devDefault: testOnly('localhost') }),
  DB_PORT: port({ devDefault: testOnly(5432) }),
  DB_USER: str({ devDefault: testOnly('postgres') }),
  DB_PASS: str({ devDefault: testOnly('password') }),
  DB_NAME: str({ devDefault: testOnly('database') }),

  // Other variables
  FRONTEND_URL: str(),
});
