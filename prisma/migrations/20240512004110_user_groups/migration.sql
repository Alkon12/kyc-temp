-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Group" (
    "id" VARCHAR(40) NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "userId" TEXT NOT NULL,
    "groupId" VARCHAR(40) NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
