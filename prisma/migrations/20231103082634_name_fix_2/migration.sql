/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT '이름을 설정해 주세요';
