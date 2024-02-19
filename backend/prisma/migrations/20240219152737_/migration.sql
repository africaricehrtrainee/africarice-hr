-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `Employees_supervisorId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_supervisorId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluations` DROP FOREIGN KEY `Evaluations_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluator360` DROP FOREIGN KEY `Evaluator360_evaluatorId_fkey`;

-- DropForeignKey
ALTER TABLE `objectivecomments` DROP FOREIGN KEY `ObjectiveComments_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `Objectives_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `Objectives_supervisorId_fkey`;

-- DropForeignKey
ALTER TABLE `updates` DROP FOREIGN KEY `Updates_employeeId_fkey`;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluator360` ADD CONSTRAINT `Evaluator360_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectiveComments` ADD CONSTRAINT `ObjectiveComments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Updates` ADD CONSTRAINT `Updates_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;
