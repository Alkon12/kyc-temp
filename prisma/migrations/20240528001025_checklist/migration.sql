-- CreateTable
CREATE TABLE "Checklist" (
    "id" VARCHAR(150) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationChecklist" (
    "applicationId" TEXT NOT NULL,
    "checklistId" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ApplicationChecklist_pkey" PRIMARY KEY ("applicationId","checklistId")
);

-- CreateTable
CREATE TABLE "ChecklistDependency" (
    "dependsOnId" VARCHAR(150) NOT NULL,
    "checklistId" VARCHAR(150) NOT NULL,

    CONSTRAINT "ChecklistDependency_pkey" PRIMARY KEY ("dependsOnId","checklistId")
);

-- AddForeignKey
ALTER TABLE "ApplicationChecklist" ADD CONSTRAINT "ApplicationChecklist_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationChecklist" ADD CONSTRAINT "ApplicationChecklist_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistDependency" ADD CONSTRAINT "ChecklistDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistDependency" ADD CONSTRAINT "ChecklistDependency_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
