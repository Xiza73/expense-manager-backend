import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'eslint.config.mjs',
        'tsup.config.ts',
        'vite.config.mts',
        '**/node_modules/**',
        '**/release.config.cjs',
        '**/index.ts',
        '**/models/**',
        '**/interfaces/**',
        '**/config/**',
      ],
    },
    globals: true,
    restoreMocks: true,
  },
  plugins: [tsconfigPaths()],
});
