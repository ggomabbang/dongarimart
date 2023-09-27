/*
  Warnings:

  - A unique constraint covering the columns `[tagName]` on the table `TagList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TagList_tagName_key` ON `TagList`(`tagName`);
