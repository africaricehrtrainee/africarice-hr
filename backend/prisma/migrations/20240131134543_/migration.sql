/*
  Warnings:

  - You are about to drop the column `sefLeadershipRating` on the `evaluations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `evaluations` DROP COLUMN `sefLeadershipRating`,
    ADD COLUMN `selfLeadershipRating` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ObjectiveComments` ADD CONSTRAINT `ObjectiveComments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
