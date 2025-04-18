import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { env } from './config/env.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/api/**/*.entity{.ts,.js}'],
  subscribers: [__dirname + '/api/**/*.subscriber{.ts,.js}'],
  migrations: [],
});
