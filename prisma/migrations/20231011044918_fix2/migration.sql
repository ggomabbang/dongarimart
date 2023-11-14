/*
  Warnings:

  - You are about to alter the column `isRecruiting` on the `clublist` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `clublist` MODIFY `isRecruiting` BOOLEAN NOT NULL DEFAULT false;
