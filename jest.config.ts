import { pathsToModuleNameMapper } from 'ts-jest'
import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', __dirname],
  moduleNameMapper: pathsToModuleNameMapper({
    '@type/*': ['src/types/*'],
    '@assets/*': ['./assets/*'],
    '@domain': ['src/domain'],
    '@domain/*': ['src/domain/*'],
    '@infrastructure': ['src/infrastructure'],
    '@infrastructure/*': ['src/infrastructure/*'],
    '@api': ['src/api'],
    '@api/*': ['src/api/*'],
    '@app': ['src/app'],
    '@app/*': ['src/app/*'],
    '@client/*': ['src/client/*'],
    "@service": ["src/service"],
    "@service/*": ["src/service/*"],
    "@styles": ["src/styles"],
    "@styles/*": ["src/styles/*"],
    '@/*': ['src/*'],
    
  }),
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
     "\\.(gql|graphql)$": "@graphql-tools/jest-transform"
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(jose))/'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  preset: 'ts-jest',
  // testEnvironment: 'node',
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  // Commenting out setupFiles to avoid loading the entire application dependencies when testing domain models
  // setupFiles: ['./src/infrastructure/inversify.config.ts'],
}

export default config
