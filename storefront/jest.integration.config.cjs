const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

// Integration test configuration
const customJestConfig = {
  displayName: 'integration',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/__tests__/integration/**/*.integration.test.{js,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/e2e/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.cjs'],
  // Longer timeout for integration tests
  testTimeout: 30000,
  // Run tests serially to avoid conflicts
  maxWorkers: 1,
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage/integration',
  coverageReporters: ['text', 'lcov', 'html'],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
}

module.exports = createJestConfig(customJestConfig)
