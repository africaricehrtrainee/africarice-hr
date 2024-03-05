-- AlterTable
ALTER TABLE `objectives` ADD COLUMN `midtermComment` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Settings` (
    `settingId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`settingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
