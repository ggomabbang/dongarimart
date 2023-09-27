/*
  Warnings:

  - The primary key for the `clubtag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `clubtag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clubtag` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `assginedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`clubId`, `tagId`);
