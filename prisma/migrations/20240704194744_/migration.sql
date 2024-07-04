/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Template` table. All the data in the column will be lost.
  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
ADD COLUMN     "body" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "content",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;
