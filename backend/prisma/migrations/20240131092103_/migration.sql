/*
  Warnings:

  - You are about to drop the column `objectiveFourComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourDeadline` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourDescription` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourKpi` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourSelfComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourSelfGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourSuccessConditions` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveFourTitle` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneDeadline` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneDescription` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneKpi` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneSelfComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneSelfGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneSuccessConditions` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveOneTitle` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeDeadline` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeDescription` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeKpi` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeSelfComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeSelfGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeSuccessConditions` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveThreeTitle` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoDeadline` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoDescription` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoKpi` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoSelfComment` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoSelfGrade` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoSuccessConditions` on the `objectives` table. All the data in the column will be lost.
  - You are about to drop the column `objectiveTwoTitle` on the `objectives` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `objectivecomments` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `objectives` DROP COLUMN `objectiveFourComment`,
    DROP COLUMN `objectiveFourDeadline`,
    DROP COLUMN `objectiveFourDescription`,
    DROP COLUMN `objectiveFourGrade`,
    DROP COLUMN `objectiveFourKpi`,
    DROP COLUMN `objectiveFourSelfComment`,
    DROP COLUMN `objectiveFourSelfGrade`,
    DROP COLUMN `objectiveFourSuccessConditions`,
    DROP COLUMN `objectiveFourTitle`,
    DROP COLUMN `objectiveOneComment`,
    DROP COLUMN `objectiveOneDeadline`,
    DROP COLUMN `objectiveOneDescription`,
    DROP COLUMN `objectiveOneGrade`,
    DROP COLUMN `objectiveOneKpi`,
    DROP COLUMN `objectiveOneSelfComment`,
    DROP COLUMN `objectiveOneSelfGrade`,
    DROP COLUMN `objectiveOneSuccessConditions`,
    DROP COLUMN `objectiveOneTitle`,
    DROP COLUMN `objectiveThreeComment`,
    DROP COLUMN `objectiveThreeDeadline`,
    DROP COLUMN `objectiveThreeDescription`,
    DROP COLUMN `objectiveThreeGrade`,
    DROP COLUMN `objectiveThreeKpi`,
    DROP COLUMN `objectiveThreeSelfComment`,
    DROP COLUMN `objectiveThreeSelfGrade`,
    DROP COLUMN `objectiveThreeSuccessConditions`,
    DROP COLUMN `objectiveThreeTitle`,
    DROP COLUMN `objectiveTwoComment`,
    DROP COLUMN `objectiveTwoDeadline`,
    DROP COLUMN `objectiveTwoDescription`,
    DROP COLUMN `objectiveTwoGrade`,
    DROP COLUMN `objectiveTwoKpi`,
    DROP COLUMN `objectiveTwoSelfComment`,
    DROP COLUMN `objectiveTwoSelfGrade`,
    DROP COLUMN `objectiveTwoSuccessConditions`,
    DROP COLUMN `objectiveTwoTitle`,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `deadline` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `grade` INTEGER NULL,
    ADD COLUMN `kpi` VARCHAR(191) NULL,
    ADD COLUMN `objectiveYear` VARCHAR(191) NOT NULL DEFAULT '2024',
    ADD COLUMN `selfComment` VARCHAR(191) NULL,
    ADD COLUMN `selfGrade` INTEGER NULL,
    ADD COLUMN `successConditions` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;
