-- DropForeignKey
ALTER TABLE "TaskGroup" DROP CONSTRAINT "TaskGroup_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_productId_fkey";

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskGroup" ADD CONSTRAINT "TaskGroup_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
