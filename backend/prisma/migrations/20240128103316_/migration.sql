-- CreateTable
CREATE TABLE `Employees` (
    `employeeId` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL DEFAULT 'staff',
    `email` VARCHAR(191) NOT NULL,
    `supervisorId` INTEGER NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NOT NULL,
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
    `selfEfficiencyRating` INTEGER NULL,
    `selfCompetency` VARCHAR(191) NULL,
    `selfCompetencyRating` INTEGER NULL,
    `selfCommitment` VARCHAR(191) NULL,
    `selfCommitmentRating` INTEGER NULL,
    `selfInitiative` VARCHAR(191) NULL,
    `selfInitiativeRating` INTEGER NULL,
    `selfRespect` VARCHAR(191) NULL,
    `selfRespectRating` INTEGER NULL,
    `selfLeadership` VARCHAR(191) NULL,
    `sefLeadershipRating` INTEGER NULL,

    PRIMARY KEY (`evaluationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation360` (
    `evaluation360Id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `evaluationYear` VARCHAR(191) NOT NULL DEFAULT '2024',
    `evaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'sent',
    `evaluatorOneId` INTEGER NULL,
    `evaluatorOneJobTitle` VARCHAR(191) NULL,
    `evaluatorOneGrade` INTEGER NULL,
    `evaluatorOneComment` VARCHAR(191) NULL,
    `evaluatorTwoId` INTEGER NULL,
    `evaluatorTwoJobTitle` VARCHAR(191) NULL,
    `evaluatorTwoGrade` INTEGER NULL,
    `evaluatorTwoComment` VARCHAR(191) NULL,
    `evaluatorThreeId` INTEGER NULL,
    `evaluatorThreeJobTitle` VARCHAR(191) NULL,
    `evaluatorThreeGrade` INTEGER NULL,
    `evaluatorThreeComment` VARCHAR(191) NULL,
    `evaluatorFourId` INTEGER NULL,
    `evaluatorFourJobTitle` VARCHAR(191) NULL,
    `evaluatorFourGrade` INTEGER NULL,
    `evaluatorFourComment` VARCHAR(191) NULL,
    `evaluatorFiveId` INTEGER NULL,
    `evaluatorFiveJobTitle` VARCHAR(191) NULL,
    `evaluatorFiveGrade` INTEGER NULL,
    `evaluatorFiveComment` VARCHAR(191) NULL,

    PRIMARY KEY (`evaluation360Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Objectives` (
    `objectiveId` INTEGER NOT NULL AUTO_INCREMENT,
    `evaluationId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `employeeId` INTEGER NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `evaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `selfEvaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `objectiveOneTitle` VARCHAR(191) NOT NULL,
    `objectiveOneDescription` VARCHAR(191) NULL,
    `objectiveOneSuccessConditions` VARCHAR(191) NULL,
    `objectiveOneDeadline` VARCHAR(191) NULL,
    `objectiveOneKpi` VARCHAR(191) NULL,
    `objectiveOneGrade` INTEGER NULL,
    `objectiveOneComment` VARCHAR(191) NULL,
    `objectiveOneSelfGrade` INTEGER NULL,
    `objectiveOneSelfComment` VARCHAR(191) NULL,
    `objectiveTwoTitle` VARCHAR(191) NULL,
    `objectiveTwoDescription` VARCHAR(191) NULL,
    `objectiveTwoSuccessConditions` VARCHAR(191) NULL,
    `objectiveTwoDeadline` VARCHAR(191) NULL,
    `objectiveTwoKpi` VARCHAR(191) NULL,
    `objectiveTwoGrade` INTEGER NULL,
    `objectiveTwoComment` VARCHAR(191) NULL,
    `objectiveTwoSelfGrade` INTEGER NULL,
    `objectiveTwoSelfComment` VARCHAR(191) NULL,
    `objectiveThreeTitle` VARCHAR(191) NULL,
    `objectiveThreeDescription` VARCHAR(191) NULL,
    `objectiveThreeSuccessConditions` VARCHAR(191) NULL,
    `objectiveThreeDeadline` VARCHAR(191) NULL,
    `objectiveThreeKpi` VARCHAR(191) NULL,
    `objectiveThreeGrade` INTEGER NULL,
    `objectiveThreeComment` VARCHAR(191) NULL,
    `objectiveThreeSelfGrade` INTEGER NULL,
    `objectiveThreeSelfComment` VARCHAR(191) NULL,
    `objectiveFourTitle` VARCHAR(191) NULL,
    `objectiveFourDescription` VARCHAR(191) NULL,
    `objectiveFourSuccessConditions` VARCHAR(191) NULL,
    `objectiveFourDeadline` VARCHAR(191) NULL,
    `objectiveFourKpi` VARCHAR(191) NULL,
    `objectiveFourGrade` INTEGER NULL,
    `objectiveFourComment` VARCHAR(191) NULL,
    `objectiveFourSelfGrade` INTEGER NULL,
    `objectiveFourSelfComment` VARCHAR(191) NULL,

    PRIMARY KEY (`objectiveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Steps` (
    `stepId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `deadline` VARCHAR(191) NOT NULL,
    `sent` BOOLEAN NOT NULL,

    PRIMARY KEY (`stepId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectiveComments` (
    `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    `objectiveId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `content` DATETIME(3) NOT NULL,

    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_evaluatorOneId_fkey` FOREIGN KEY (`evaluatorOneId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_evaluatorTwoId_fkey` FOREIGN KEY (`evaluatorTwoId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_evaluatorThreeId_fkey` FOREIGN KEY (`evaluatorThreeId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_evaluatorFourId_fkey` FOREIGN KEY (`evaluatorFourId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation360` ADD CONSTRAINT `Evaluation360_evaluatorFiveId_fkey` FOREIGN KEY (`evaluatorFiveId`) REFERENCES `Employees`(`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluations`(`evaluationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectives` ADD CONSTRAINT `Objectives_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectiveComments` ADD CONSTRAINT `ObjectiveComments_objectiveId_fkey` FOREIGN KEY (`objectiveId`) REFERENCES `Objectives`(`objectiveId`) ON DELETE RESTRICT ON UPDATE CASCADE;
