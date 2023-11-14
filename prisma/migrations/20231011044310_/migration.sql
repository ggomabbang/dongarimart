-- DropForeignKey
ALTER TABLE `clubtag` DROP FOREIGN KEY `ClubTag_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `clubtag` DROP FOREIGN KEY `ClubTag_tagId_fkey`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `verifiedEmail` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JoinedClub` (
    `userId` INTEGER NOT NULL,
    `clubId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isLeader` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`userId`, `clubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `detail` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL,
    `isNotice` BOOLEAN NOT NULL DEFAULT false,
    `reportCount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clubtag` ADD CONSTRAINT `clubtag_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `clublist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clubtag` ADD CONSTRAINT `clubtag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `taglist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JoinedClub` ADD CONSTRAINT `JoinedClub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JoinedClub` ADD CONSTRAINT `JoinedClub_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `clublist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `clublist` RENAME INDEX `ClubList_clubName_key` TO `clublist_clubName_key`;

-- RenameIndex
ALTER TABLE `taglist` RENAME INDEX `TagList_tagName_key` TO `taglist_tagName_key`;
