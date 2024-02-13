/*
  Warnings:

  - You are about to drop the column `comment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `kpi` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `selfComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `selfGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `successConditions` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `objectives` table. All the data in the column will be lost.
  - Added the required column `objectiveOneTitle` to the `Objectives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `objectives` DROP COLUMN `comment`,
    DROP COLUMN `deadline`,
    DROP COLUMN `description`,
    DROP COLUMN `grade`,
    DROP COLUMN `kpi`,
    DROP COLUMN `selfComment`,
    DROP COLUMN `selfGrade`,
    DROP COLUMN `successConditions`,
    DROP COLUMN `title`,
    ADD COLUMN `objectiveFourComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveFourDeadline` VARCHAR(191) NULL,
    ADD COLUMN `objectiveFourDescription` VARCHAR(191) NULL,
    ADD COLUMN `objectiveFourGrade` INTEGER NULL,
    ADD COLUMN `objectiveFourKpi` VARCHAR(191) NULL,
    ADD COLUMN `objectiveFourSelfComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveFourSelfGrade` INTEGER NULL,
    ADD COLUMN `objectiveFourSuccessConditions` VARCHAR(191) NULL,
    ADD COLUMN `objectiveFourTitle` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneDeadline` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneDescription` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneGrade` INTEGER NULL,
    ADD COLUMN `objectiveOneKpi` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneSelfComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneSelfGrade` INTEGER NULL,
    ADD COLUMN `objectiveOneSuccessConditions` VARCHAR(191) NULL,
    ADD COLUMN `objectiveOneTitle` VARCHAR(191) NOT NULL,
    ADD COLUMN `objectiveThreeComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveThreeDeadline` VARCHAR(191) NULL,
    ADD COLUMN `objectiveThreeDescription` VARCHAR(191) NULL,
    ADD COLUMN `objectiveThreeGrade` INTEGER NULL,
    ADD COLUMN `objectiveThreeKpi` VARCHAR(191) NULL,
    ADD COLUMN `objectiveThreeSelfComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveThreeSelfGrade` INTEGER NULL,
    ADD COLUMN `objectiveThreeSuccessConditions` VARCHAR(191) NULL,
    ADD COLUMN `objectiveThreeTitle` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoDeadline` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoDescription` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoGrade` INTEGER NULL,
    ADD COLUMN `objectiveTwoKpi` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoSelfComment` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoSelfGrade` INTEGER NULL,
    ADD COLUMN `objectiveTwoSuccessConditions` VARCHAR(191) NULL,
    ADD COLUMN `objectiveTwoTitle` VARCHAR(191) NULL;
