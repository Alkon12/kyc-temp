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
    '@/*': ['src/*'],
  }),
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/infrastructure/inversify.config.ts'],
}

export default config
