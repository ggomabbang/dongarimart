/*
  Warnings:

  - You are about to drop the column `image` on the `clublist` table. All the data in the column will be lost.
  - You are about to drop the column `recruitEnd` on the `clublist` table. All the data in the column will be lost.
  - You are about to drop the column `recruitStart` on the `clublist` table. All the data in the column will be lost.
  - You are about to drop the column `recruitTarget` on the `clublist` table. All the data in the column will be lost.
  - You are about to alter the column `pageURL` on the `clublist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(255)`.
  - You are about to drop the column `createAt` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `verifyingemail` table. All the data in the column will be lost.
  - You are about to drop the column `session` on the `verifyingemail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `VerifyingEmail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `VerifyingEmail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clubtag` DROP FOREIGN KEY `ClubTag_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `clubtag` DROP FOREIGN KEY `ClubTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `joinedclub` DROP FOREIGN KEY `JoinedClub_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `joinedclub` DROP FOREIGN KEY `JoinedClub_userId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_userId_fkey`;

-- AlterTable
ALTER TABLE `clublist` DROP COLUMN `image`,
    DROP COLUMN `recruitEnd`,
    DROP COLUMN `recruitStart`,
    DROP COLUMN `recruitTarget`,
    MODIFY `pageURL` VARCHAR(255) NULL,
    MODIFY `view` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `post` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `clubId` INTEGER UNSIGNED NULL,
    ADD COLUMN `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isRecruit` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `title` VARCHAR(100) NOT NULL DEFAULT 'No title',
    ADD COLUMN `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `taglist` MODIFY `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `image`,
    DROP COLUMN `name`,
    ADD COLUMN `emailConfirm` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `salt` VARCHAR(30) NULL,
    MODIFY `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `verifyingemail` DROP COLUMN `code`,
    DROP COLUMN `session`,
    ADD COLUMN `token` VARCHAR(255) NOT NULL,
    ADD COLUMN `tokenCreated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    MODIFY `verifiedDone` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `RecruitSchedule` (
    `clubId` INTEGER UNSIGNED NOT NULL,
    `recruitEnd` DATE NOT NULL,

    PRIMARY KEY (`clubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `postId` INTEGER UNSIGNED NULL,
    `clubId` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `Image_filename_key`(`filename`),
    UNIQUE INDEX `Image_clubId_key`(`clubId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recruit` (
    `postId` INTEGER UNSIGNED NOT NULL,
    `recruitStart` DATE NOT NULL,
    `recruitEnd` DATE NOT NULL,
    `recruitURL` VARCHAR(1000) NULL,
    `recruitTarget` VARCHAR(1000) NULL,

    PRIMARY KEY (`postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `VerifyingEmail_token_key` ON `VerifyingEmail`(`token`);

-- AddForeignKey
ALTER TABLE `RecruitSchedule` ADD CONSTRAINT `RecruitSchedule_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `ClubList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClubTag` ADD CONSTRAINT `ClubTag_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `ClubList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClubTag` ADD CONSTRAINT `ClubTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `TagList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `ClubList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `ClubList`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recruit` ADD CONSTRAINT `Recruit_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JoinedClub` ADD CONSTRAINT `JoinedClub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JoinedClub` ADD CONSTRAINT `JoinedClub_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `ClubList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
