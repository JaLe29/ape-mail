/*
  Warnings:

  - You are about to drop the column `projectId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TemplatesInCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TemplatesInCategory" DROP CONSTRAINT "TemplatesInCategory_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TemplatesInCategory" DROP CONSTRAINT "TemplatesInCategory_templateId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "projectId";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "TemplatesInCategory";
