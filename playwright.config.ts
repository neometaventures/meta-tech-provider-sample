// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

import { defineConfig, devices } from '@playwright/test';
import {getBaseUrl} from '../../libs/playwright/src';
import * as path from 'path';

const appDir = path.resolve(__dirname);

// getBaseUrl handles all environments:
// 1. PLAYWRIGHT_BASE_URL env var (deployed previews)
// 2. NEST_APP_SERVER env var (CI via Buck's nest_app_resource_provider)
// 3. Local dev server (hostname + port from .next/dev/status.json)
const baseURL = getBaseUrl(appDir);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
