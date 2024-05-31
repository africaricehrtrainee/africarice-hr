-- CreateTable
CREATE TABLE `Employees` (
    `employeeId` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL DEFAULT 'staff',
    `email` VARCHAR(191) NOT NULL,
    `supervisorId` INTEGER NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NULL,
    `jobTitle` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Employees_email_key`(`email`),
    UNIQUE INDEX `Employees_matricule_key`(`matricule`),
    PRIMARY KEY (`employeeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluations` (
    `evaluationId` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `supervisorJobTitle` VARCHAR(191) NOT NULL,
    `evaluationYear` VARCHAR(191) NOT NULL DEFAULT '2024',
    `evaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `efficiency` VARCHAR(191) NULL,
    `efficiencyRating` INTEGER NULL,
    `competency` VARCHAR(191) NULL,
    `competencyRating` INTEGER NULL,
    `commitment` VARCHAR(191) NULL,
    `commitmentRating` INTEGER NULL,
    `initiative` VARCHAR(191) NULL,
    `initiativeRating` INTEGER NULL,
    `respect` VARCHAR(191) NULL,
    `respectRating` INTEGER NULL,
    `leadership` VARCHAR(191) NULL,
    `leadershipRating` INTEGER NULL,
    `selfEvaluationStatus` VARCHAR(191) NOT NULL,
    `selfEfficiency` VARCHAR(191) NULL,
    `selfCompetency` VARCHAR(191) NULL,
    `selfCommitment` VARCHAR(191) NULL,
    `selfInitiative` VARCHAR(191) NULL,
    `selfRespect` VARCHAR(191) NULL,
    `selfLeadership` VARCHAR(191) NULL,

    PRIMARY KEY (`evaluationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation360` (
    `evaluation360Id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `evaluationYear` VARCHAR(191) NOT NULL DEFAULT '2024',

    PRIMARY KEY (`evaluation360Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluator360` (
    `evaluator360Id` INTEGER NOT NULL AUTO_INCREMENT,
    `evaluatorStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `evaluationId` INTEGER NOT NULL,
    `evaluatorId` INTEGER NOT NULL,
    `evaluatorJobTitle` VARCHAR(191) NOT NULL,
    `interpersonalComment` VARCHAR(191) NULL,
    `collaborationComment` VARCHAR(191) NULL,
    `leadershipComment` VARCHAR(191) NULL,
    `commitmentComment` VARCHAR(191) NULL,
    `teamworkComment` VARCHAR(191) NULL,

    PRIMARY KEY (`evaluator360Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Objectives` (
    `objectiveId` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `objectiveYear` VARCHAR(191) NOT NULL DEFAULT '2024',
    `employeeId` INTEGER NOT NULL,
    `supervisorId` INTEGER NULL,
    `evaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `selfEvaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `reviewStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `selfReviewStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `successConditions` VARCHAR(191) NULL,
    `deadline` VARCHAR(191) NULL,
    `kpi` VARCHAR(191) NULL,
    `grade` INTEGER NULL,
    `comment` VARCHAR(191) NULL,
    `selfComment` VARCHAR(191) NULL,
    `midtermSelfComment` VARCHAR(191) NULL,
    `midtermComment` VARCHAR(191) NULL,

    PRIMARY KEY (`objectiveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Steps` (
    `stepId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `dateFrom` VARCHAR(191) NOT NULL,
    `dateTo` VARCHAR(191) NOT NULL,
    `sent` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`stepId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectiveComments` (
    `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    `objectiveId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `settingId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`settingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alerts` (
    `alertId` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `recipientId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Alerts_hash_recipientId_key`(`hash`, `recipientId`),
    PRIMARY KEY (`alertId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluator360` ADD CONSTRAINT `Evaluator360_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation360`(`evaluation360Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluator360` ADD CONSTRAINT `Evaluator360_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectiveComments` ADD CONSTRAINT `ObjectiveComments_objectiveId_fkey` FOREIGN KEY (`objectiveId`) REFERENCES `Objectives`(`objectiveId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectiveComments` ADD CONSTRAINT `ObjectiveComments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alerts` ADD CONSTRAINT `Alerts_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `Employees`(`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE;
