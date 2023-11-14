/*
  Warnings:

  - Changed the type of `emailVerified` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `verifiedEmail` BOOLEAN NOT NULL DEFAULT false,
    DROP COLUMN `emailVerified`,
    ADD COLUMN `emailVerified` DATETIME(3) NOT NULL;
