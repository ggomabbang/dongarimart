/*
  Warnings:

  - A unique constraint covering the columns `[clubName]` on the table `ClubList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ClubList_clubName_key` ON `ClubList`(`clubName`);
