-- CreateTable
CREATE TABLE `ClubList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clubName` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `oneLine` VARCHAR(191) NOT NULL,
    `short` VARCHAR(191) NOT NULL,
    `isRecruiting` INTEGER NOT NULL,
    `recruitPeriod` VARCHAR(191) NULL,
    `recruitTarget` VARCHAR(191) NULL,
    `pageURL` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tagName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClubTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clubId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClubTag` ADD CONSTRAINT `ClubTag_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `ClubList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClubTag` ADD CONSTRAINT `ClubTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `TagList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
