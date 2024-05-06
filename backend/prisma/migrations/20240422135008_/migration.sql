/*
  Warnings:

  - You are about to drop the column `collaborationComment` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `collaborationRating` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `commitmentComment` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `commitmentRating` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `interpersonalComment` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `interpersonalRating` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `leadershipComment` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `leadershipRating` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `teamworkComment` on the `Evaluator360` table. All the data in the column will be lost.
  - You are about to drop the column `teamworkRating` on the `Evaluator360` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Evaluator360` DROP COLUMN `collaborationComment`,
    DROP COLUMN `collaborationRating`,
    DROP COLUMN `commitmentComment`,
    DROP COLUMN `commitmentRating`,
    DROP COLUMN `interpersonalComment`,
    DROP COLUMN `interpersonalRating`,
    DROP COLUMN `leadershipComment`,
    DROP COLUMN `leadershipRating`,
    DROP COLUMN `teamworkComment`,
    DROP COLUMN `teamworkRating`,
    ADD COLUMN `questionFive` VARCHAR(255) NULL,
    ADD COLUMN `questionFour` VARCHAR(255) NULL,
    ADD COLUMN `questionOne` VARCHAR(255) NULL,
    ADD COLUMN `questionThree` VARCHAR(255) NULL,
    ADD COLUMN `questionTwo` VARCHAR(255) NULL,
    ADD COLUMN `ratingFive` INTEGER NULL,
    ADD COLUMN `ratingFour` INTEGER NULL,
    ADD COLUMN `ratingOne` INTEGER NULL,
    ADD COLUMN `ratingThree` INTEGER NULL,
    ADD COLUMN `ratingTwo` INTEGER NULL;
