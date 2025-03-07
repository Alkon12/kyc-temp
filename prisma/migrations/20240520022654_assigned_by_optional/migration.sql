-- AlterTable
ALTER TABLE "TaskGroup" ALTER COLUMN "assignedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserGroup" ALTER COLUMN "assignedBy" DROP NOT NULL;
