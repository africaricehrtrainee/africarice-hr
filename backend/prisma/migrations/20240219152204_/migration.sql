-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `Employees_supervisorId_fkey`;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;
