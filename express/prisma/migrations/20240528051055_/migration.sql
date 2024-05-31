-- DropForeignKey
ALTER TABLE `AccountRecoveries` DROP FOREIGN KEY `AccountRecoveries_employeeId_fkey`;

-- AddForeignKey
ALTER TABLE `AccountRecoveries` ADD CONSTRAINT `AccountRecoveries_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;
