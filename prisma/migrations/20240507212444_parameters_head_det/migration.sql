-- CreateTable
CREATE TABLE "ParamHeader" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParamHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParamDetail" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "idParam" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParamDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParamDetail" ADD CONSTRAINT "ParamDetail_idParam_fkey" FOREIGN KEY ("idParam") REFERENCES "ParamHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
