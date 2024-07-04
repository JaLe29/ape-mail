/*
  Warnings:

  - You are about to drop the column `projectId` on the `Template` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_projectId_fkey";

-- DropIndex
DROP INDEX "Template_key_projectId_key";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "projectId";

-- CreateTable
CREATE TABLE "TemplatesInCategory" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "TemplatesInCategory_pkey" PRIMARY KEY ("templateId","projectId")
);

-- AddForeignKey
ALTER TABLE "TemplatesInCategory" ADD CONSTRAINT "TemplatesInCategory_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplatesInCategory" ADD CONSTRAINT "TemplatesInCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
