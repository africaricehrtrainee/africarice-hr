/*
  Warnings:

  - You are about to drop the column `comment` on the `objectivehistory` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `objectivehistory` table. All the data in the column will be lost.
  - You are about to drop the column `selfComment` on the `objectivehistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `objectivehistory` DROP COLUMN `comment`,
    DROP COLUMN `grade`,
    DROP COLUMN `selfComment`;
