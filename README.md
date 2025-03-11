# KYC

## Install

Copy .env.example to .env and fill the variables

`docker compose up` (or `docker compose up -d` to execute as deamon)

Install libraries
```shell
yarn install
```

db structure
```shell
yarn prisma migrate deploy
```

db base data
```shell
yarn prisma db seed
```

generate/update graphql schema
```shell
yarn graphql
```

### Execute

run local server
```shell
yarn dev
```

### Touch

when modifying prisma.schema, then create a migration for those changes
```shell
yarn prisma migrate dev --name migration_name
```

build
```shell
yarn dev
```

## tools

### graphql web

http://localhost:3000/api/graphql

### Fix The migration `xxxxxxx` was modified after it was applied.

https://echobind.com/post/make-prisma-ignore-a-migration-change

shasum -a 256 prisma/migrations/20240921115520_address_new/migration.sql

And update checksum in migration table
