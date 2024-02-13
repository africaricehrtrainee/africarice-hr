/*
  Warnings:

  - You are about to drop the column `selfCommitmentRating` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `selfCompetencyRating` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `selfEfficiencyRating` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `selfInitiativeRating` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `selfLeadershipRating` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `selfRespectRating` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `selfGrade` on the `objectives` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `evaluations` DROP COLUMN `selfCommitmentRating`,
    DROP COLUMN `selfCompetencyRating`,
    DROP COLUMN `selfEfficiencyRating`,
    DROP COLUMN `selfInitiativeRating`,
    DROP COLUMN `selfLeadershipRating`,
    DROP COLUMN `selfRespectRating`;

-- AlterTable
ALTER TABLE `objectives` DROP COLUMN `selfGrade`;

-- AlterTable
ALTER TABLE `steps` ADD COLUMN `dateTo` VARCHAR(191) NULL;
