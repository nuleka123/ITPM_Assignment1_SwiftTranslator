const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  reporter: [["html"], ["list"]],
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
});
