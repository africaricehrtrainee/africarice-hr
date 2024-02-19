-- DropForeignKey
ALTER TABLE `evaluations` DROP FOREIGN KEY `Evaluations_supervisorId_fkey`;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;
