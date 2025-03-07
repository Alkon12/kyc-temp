-- CreateTable
CREATE TABLE "Advisor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extId" TEXT NOT NULL,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleStatus" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ScheduleStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleSlot_pkey" PRIMARY KEY ("id")
);
