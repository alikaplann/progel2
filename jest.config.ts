module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts','js','json'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
};