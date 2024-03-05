/*
  Warnings:

  - You are about to drop the column `evaluatorComment` on the `evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorGrade` on the `evaluator360` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `evaluator360` DROP COLUMN `evaluatorComment`,
    DROP COLUMN `evaluatorGrade`,
    ADD COLUMN `collaborationComment` VARCHAR(191) NULL,
    ADD COLUMN `commitmentComment` VARCHAR(191) NULL,
    ADD COLUMN `interpersonalComment` VARCHAR(191) NULL,
    ADD COLUMN `leadershipComment` VARCHAR(191) NULL,
    ADD COLUMN `teamworkComment` VARCHAR(191) NULL;
