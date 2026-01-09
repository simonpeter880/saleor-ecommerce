// Integration test setup file
// This file runs before each integration test suite

// Set test environment variables
process.env.NEXT_PUBLIC_SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/';
process.env.NODE_ENV = 'test';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to retry failed operations
  retry: async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await global.testUtils.wait(delay);
      }
    }
  },
};

// Console setup for cleaner test output
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  // Filter out expected warnings
  const warning = args[0];
  if (
    typeof warning === 'string' &&
    (warning.includes('Warning: ReactDOM.render') ||
     warning.includes('Warning: useLayoutEffect'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  // Filter out expected errors
  const error = args[0];
  if (
    typeof error === 'string' &&
    (error.includes('Not implemented: HTMLFormElement.prototype.submit') ||
     error.includes('Error: Not implemented'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Cleanup
afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
