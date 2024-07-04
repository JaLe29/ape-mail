/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Template` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Template_key_key" ON "Template"("key");
