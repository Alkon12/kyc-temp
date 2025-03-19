# KYC Service Development Guide

## Build & Commands
- Development: `yarn dev` or `yarn devWin` (Windows)
- Build: `yarn build`
- Lint: `yarn lint`
- Format: `yarn prettier:write`
- Test: `yarn test`
- Test single file: `jest path/to/file.test.ts`
- Test watch mode: `yarn test:watch`
- Database: `yarn migrate` (deploy migrations), `yarn seed` (seed data)
- GraphQL: `yarn graphql` (generate schema code)

## Code Style Guidelines
- **Architecture**: Follow domain-driven design principles
- **Naming**: PascalCase for classes/types, camelCase for variables/methods
- **TypeScript**: Use explicit types, avoid `any`, prefer interfaces for public APIs
- **Error Handling**: Domain errors extend from `DomainError` class
- **Testing**: Use Jest with AAA pattern (Arrange-Act-Assert)
- **Imports**: Absolute paths with `@` aliases (e.g., `@domain`, `@infrastructure`)
- **Components**: Add server components in `(server-components)` directory
- **Services**: Each service should have corresponding interface and implementation