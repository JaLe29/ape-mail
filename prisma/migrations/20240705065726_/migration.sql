/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('ROOT', 'CHILD');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "type" "TemplateType" NOT NULL DEFAULT 'CHILD';

-- DropTable
DROP TABLE "Todo";
