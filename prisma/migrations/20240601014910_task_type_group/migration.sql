-- CreateTable
CREATE TABLE "TaskTypeGroup" (
    "taskTypeId" TEXT NOT NULL,
    "groupId" VARCHAR(40) NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "TaskTypeGroup_pkey" PRIMARY KEY ("taskTypeId","groupId")
);

-- AddForeignKey
ALTER TABLE "TaskTypeGroup" ADD CONSTRAINT "TaskTypeGroup_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "TaskType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTypeGroup" ADD CONSTRAINT "TaskTypeGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
