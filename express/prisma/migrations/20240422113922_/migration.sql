/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Employees` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `bgLevel` VARCHAR(191) NULL,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `grade` VARCHAR(191) NULL,
    ADD COLUMN `personalEmail` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `phone2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `label` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Positions` (
    `positionId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `division` VARCHAR(191) NOT NULL,
    `subUnit` VARCHAR(191) NOT NULL,
    `cgGroup` VARCHAR(191) NOT NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `notice` DATETIME(3) NOT NULL,
    `supervisorId` INTEGER NULL,

    PRIMARY KEY (`positionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Settings_name_key` ON `Settings`(`name`);

-- AddForeignKey
ALTER TABLE `Positions` ADD CONSTRAINT `Positions_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Positions`(`positionId`) ON DELETE SET NULL ON UPDATE CASCADE;
