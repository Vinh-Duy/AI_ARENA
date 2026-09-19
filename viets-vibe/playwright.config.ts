import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const localChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath =
  process.env.PLAYWRIGHT_CHROME_PATH ||
  (process.platform === "darwin" && existsSync(localChrome)
    ? localChrome
    : undefined);
const devMode = process.env.PLAYWRIGHT_DEV === "1";
const baseURL = devMode ? "http://localhost:3000" : "http://127.0.0.1:3100";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    launchOptions: { executablePath },
    trace: "retain-on-failure",
  },
  webServer: {
    command: devMode
      ? "npm run dev -- --hostname 127.0.0.1 --port 3000"
      : "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  reporter: "list",
});
