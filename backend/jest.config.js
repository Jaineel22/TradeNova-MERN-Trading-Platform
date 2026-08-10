module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testTimeout: 20000,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/config/db.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
};
