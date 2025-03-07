-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "contactype" TEXT;

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bitacora" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bitacora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "alertLevel" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bitacora" ADD CONSTRAINT "Bitacora_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
