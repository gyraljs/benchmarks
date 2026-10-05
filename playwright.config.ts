import { defineConfig, devices } from '@playwright/test';

// Correctness: the same spec runs against every framework's production build, so a fast but
// broken implementation can't win the benchmark.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4321', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: false,
  },
});
