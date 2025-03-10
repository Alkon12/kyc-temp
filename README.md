# Uber

## install

(copy from .env.example)
.env

```js
DATABASE_URL=
NEXTAUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=323232

UBER_DB_DATABASE_NAME=uber
UBER_DB_USERNAME=admin
UBER_DB_PASSWORD=
```

`docker compose up`
or if you want to execute it as deamon, without printing the logs in the terminal
`docker compose up -d`

```shell
yarn install
```

and to apply pending migrations to any dev, use

```shell
yarn prisma migrate deploy
```

Ref https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production#production-and-testing-environments

## run

### Update schemas

yarn graphql

### execute

```shell
yarn dev
```

o

```
npm run dev
```

## DB changes migration

yarn prisma generate DB from the schema

```shell
yarn prisma db push
```

```shell
yarn prisma db seed
```

when playing with struct use

```shell
yarn prisma db push
```

Ref https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema

but then, alway make migrations, so after making any schema change, generate new migration

```shell
yarn prisma migrate dev --name migration_name
```

## tools

### graphql web

http://localhost:3000/api/graphql

### Fix The migration `xxxxxxx` was modified after it was applied.

https://echobind.com/post/make-prisma-ignore-a-migration-change

shasum -a 256 prisma/migrations/20240921115520_address_new/migration.sql

And update checksum in migration table
