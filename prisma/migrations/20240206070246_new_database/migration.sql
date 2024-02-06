-- CreateTable
CREATE TABLE `ClubList` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `clubName` VARCHAR(20) NOT NULL,
    `classification` VARCHAR(20) NOT NULL,
    `oneLine` VARCHAR(100) NOT NULL,
    `short` VARCHAR(500) NOT NULL,
    `isRecruiting` BOOLEAN NOT NULL DEFAULT false,
    `pageURL` VARCHAR(255) NULL,
    `view` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL,

    UNIQUE INDEX `ClubList_clubName_key`(`clubName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecruitSchedule` (
    `clubId` INTEGER UNSIGNED NOT NULL,
    `recruitStart` DATE NOT NULL,
    `recruitEnd` DATE NOT NULL,

    PRIMARY KEY (`clubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagList` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tagName` VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TagList_tagName_key`(`tagName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClubTag` (
    `clubId` INTEGER UNSIGNED NOT NULL,
    `tagId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`clubId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `clubId` INTEGER UNSIGNED NULL,
    `title` VARCHAR(100) NOT NULL DEFAULT 'No title',
    `content` TEXT NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL,
    `isNotice` BOOLEAN NOT NULL DEFAULT false,
    `isRecruit` BOOLEAN NOT NULL DEFAULT false,
    `reportCount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `view` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
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

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL DEFAULT '이름',
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    `emailConfirm` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JoinedClub` (
    `userId` INTEGER UNSIGNED NOT NULL,
    `clubId` INTEGER UNSIGNED NOT NULL,
    `joinedAt` DATE NOT NULL,
    `isLeader` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`userId`, `clubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerifyingEmail` (
    `email` VARCHAR(30) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `tokenExpires` TIMESTAMP(3) NOT NULL,
    `verifiedDone` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `VerifyingEmail_token_key`(`token`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `userId` INTEGER UNSIGNED NOT NULL,
    `token` CHAR(36) NULL,
    `tokenExpires` TIMESTAMP(3) NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
