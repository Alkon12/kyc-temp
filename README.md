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

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=test

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

### db manage

yarn prisma studio

### graphql web

http://localhost:3000/api/graphql

USER ---- ACCOUNT
USER ----> RESERVATION <------> VEHICLE
USER ----> ASSIGNMENT <------> VEHICLE

Otra branch con otros cambios 33333333

CAMBIO 3333

# GIT

                            custom branch ------> V      custom branch 2 ------> V       RELEASE

dev (DEVELOP) ---------------------------------->-------------------------------->----------> V
main (PROD) --------------------------------------------------------------------------------->-------------->

Actualizar pc local conn lo que haya en el servidor (NO A NIVEL ARCHIVOS, SOLO BRANCHES)

```
git fetch --all
```

Pararse en branch `dev` y bajar todos los cambios que hubiera en pc local

```
git checkout dev
git pull
```

Crear una custom branch

```
git checkout -B feat-custom-1
```

[Trabajar desde VSCODE]

Para bajar los cambios de esa custom branch a `dev`, crear Pull Request (VER COMO EN AZURE)

Aca Rodri hace algun cambio sobre la brach leads

Domain
Entities
Value Objects
Services Interfaces
Repositories Interfaces
Factories
Por ej: Entity -> DTO o DTO -> Entity

API
Graphql
Schemas
Resolvers

App
Services Implementations

Infra
Repositories Implementations
ORM Prisma
Prisma Entities

---

CITAS

BORRAR SCHEDULES Y SLOTS

delete FROM "Schedule"

delete FROM "Slot"

delete from "Appointment"

-- EJECUTAR CREACIÓN DE SCHEDULES Y SLOTS (DADA LA FECHA, TOMA EL MES Y EL AÑO Y CREA TODOS LOS SCHEDULES Y SLOTS DE ESE AÑO/MES)

OPERATION
mutation CreateSchedule($date: DateTime) {
createSchedule(date: $date)
}

VARIABLES
{
"date": "2024-05-26"
}

-- VALIDAR QUE SE HAYAN CREADO

OPERATION
query FindScheduleByDate($startDate: DateTime, $endDate: DateTime) {
findScheduleByDate(start_date: $startDate, end_date: $endDate) {
date
end_time
id
slots {
end_time
id
idSchedule
idUser
start_time
status
}
start_time
}
}

VARIABLES
{
"startDate": "2024-05-28",
"endDate": "2024-05-28"
}

-- CREAR UNA CITA, EL IDSLOT SE TOMA DE LA CONSULTA ANTERIOR Y EL ID APPLICATION SE TOMA ALGUNO EXISTENTE EN LA TABLA, DEBE GRABAR LA CITA Y DEJAR EL SLOT COMO UNAVAILABLE, se crea internamente la url para conectarse

mutation CreateAppointment($idSlot: String!, $applicationId: String!) {
createAppointment(idSlot: $idSlot, applicationId: $applicationId) {
applicationId
id
idSlot
meetLink
status
}
}

VARIABLE
{ "idSlot": "4537ec2b-071a-4136-be7a-b6a171a158f2",
"applicationId": "4ee83aa6-6ab6-4d84-9a62-2f4fc817dd2f"
}

-- CANCELAR UNA CITA, SE TOMA EL IDCITA DE LA TABLA Y SE EJECUTA, EL SLOT DEBE QUEDAR COMO AVAILABLE Y LA CITA COMO CANCELADA, PERMITIENDO REUTILIZAR EL SLOT

mutation CancelAppointment($cancelAppointmentId: String!) {
cancelAppointment(id: $cancelAppointmentId) {
applicationId
id
idSlot
status
meetLink
}
}

VARIABLE
{
"cancelAppointmentId": "0a8d2130-a97c-4c4f-b8de-89db248ff3d6"
}

--COMPLETAR CITA , este evento ocurre cuando la cita se lleva a cabo es decir,se tiene la video llamada y se temrina

mutation CompleteAppointment($completeAppointmentId: String!) {
completeAppointment(id: $completeAppointmentId) {
applicationId
id
idSlot
meetLink
status
}
}

{
"completeAppointmentId": "5c834a41-457f-40c0-af29-f7e2561f8716"
}

--RE AGENDAR, se pasa como vairable el nuevo idslot a afectar, y cambia disponibilidad, el anterior lo deja disponible y el nuevo lo deja apartado

mutation RescheduleAppointment($rescheduleAppointmentId: String!, $idSlot: String!) {
rescheduleAppointment(id: $rescheduleAppointmentId, idSlot: $idSlot) {
applicationId
id
idSlot
meetLink
status
}
}

{ "rescheduleAppointmentId": "44d79354-0ab6-4154-b2a1-f64d77e0b2f6",
"idSlot": "7994840f-8abc-4f1e-a335-0b29815a6ff2"
}

--PROBAR JITSI, acceder a la url localhost:3000/backoffice/meeting, esto dbe cargar la pantalla con jitsi integrado y de momento con un nombre d ereunión fijo, aunque ya está preparado para que lo reciba dinámicamente

---

### Fix The migration `xxxxxxx` was modified after it was applied.

https://echobind.com/post/make-prisma-ignore-a-migration-change

shasum -a 256 prisma/migrations/20240921115520_address_new/migration.sql

And update checksum in migration table
