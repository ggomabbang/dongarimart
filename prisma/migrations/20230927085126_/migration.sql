/*
  Warnings:

  - You are about to drop the column `assginedAt` on the `clubtag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clubtag` DROP COLUMN `assginedAt`,
    ADD COLUMN `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
