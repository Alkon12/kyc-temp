#!/bin/sh
yarn prisma generate
# yarn build
yarn prisma migrate deploy
yarn prisma migrate status 
yarn start