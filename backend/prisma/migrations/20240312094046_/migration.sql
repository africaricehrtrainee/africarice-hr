/*
  Warnings:

  - You are about to drop the `objectivehistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `objectivehistory` DROP FOREIGN KEY `ObjectiveHistory_objectiveId_fkey`;

-- AlterTable
ALTER TABLE `objectives` ADD COLUMN `reviewStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    ADD COLUMN `selfReviewStatus` VARCHAR(191) NOT NULL DEFAULT 'draft';

-- DropTable
DROP TABLE `objectivehistory`;
