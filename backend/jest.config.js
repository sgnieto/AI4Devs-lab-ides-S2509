module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/helpers/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/src/tests/helpers/jest-setup.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@users/(.*)$': '<rootDir>/src/users/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@candidates/(.*)$': '<rootDir>/src/candidates/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: { lines: 0, statements: 0, functions: 0, branches: 0 },
    './src/auth/**': { lines: 70, statements: 70, functions: 60, branches: 50 },
  },
};