import { extendZodWithOpenApi, ZodContentObject } from '@asteasolutions/zod-to-openapi';
import { z as _z } from 'zod';

extendZodWithOpenApi(_z);

export const z = _z;

export type ZodBody = {
  content: ZodContentObject;
};
