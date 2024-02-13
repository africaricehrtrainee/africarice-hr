-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `Objectives_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `objectives` MODIFY `supervisorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;
