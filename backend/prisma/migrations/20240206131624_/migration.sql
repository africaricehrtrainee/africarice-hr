-- CreateTable
CREATE TABLE `Updates` (
    `updateId` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `type` ENUM('OBJECTIVE_SUBMIT', 'OBJECTIVE_VALID', 'OBJECTIVE_INVALID') NOT NULL,

    PRIMARY KEY (`updateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Updates` ADD CONSTRAINT `Updates_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
