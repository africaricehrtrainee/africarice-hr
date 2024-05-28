-- AlterTable
ALTER TABLE `Steps` ADD COLUMN `messageFr` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AccountRecoveries` (
    `recoveryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `employeeId` INTEGER NOT NULL,

    PRIMARY KEY (`recoveryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountRecoveries` ADD CONSTRAINT `AccountRecoveries_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
