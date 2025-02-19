module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/backend/tests/**/*.test.js"],
  testTimeout: 30000,
};
