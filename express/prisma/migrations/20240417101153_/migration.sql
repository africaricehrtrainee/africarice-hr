-- AlterTable
ALTER TABLE `Evaluations` ADD COLUMN `overall` VARCHAR(255) NULL,
    ADD COLUMN `overallRating` INTEGER NULL,
    ADD COLUMN `selfOverall` VARCHAR(255) NULL;
