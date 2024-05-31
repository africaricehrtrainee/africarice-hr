-- AlterTable
ALTER TABLE `Evaluations` MODIFY `efficiency` VARCHAR(255) NULL,
    MODIFY `competency` VARCHAR(255) NULL,
    MODIFY `commitment` VARCHAR(255) NULL,
    MODIFY `initiative` VARCHAR(255) NULL,
    MODIFY `respect` VARCHAR(255) NULL,
    MODIFY `leadership` VARCHAR(255) NULL,
    MODIFY `selfEfficiency` VARCHAR(255) NULL,
    MODIFY `selfCompetency` VARCHAR(255) NULL,
    MODIFY `selfCommitment` VARCHAR(255) NULL,
    MODIFY `selfInitiative` VARCHAR(255) NULL,
    MODIFY `selfRespect` VARCHAR(255) NULL,
    MODIFY `selfLeadership` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Evaluator360` MODIFY `interpersonalComment` VARCHAR(255) NULL,
    MODIFY `collaborationComment` VARCHAR(255) NULL,
    MODIFY `leadershipComment` VARCHAR(255) NULL,
    MODIFY `commitmentComment` VARCHAR(255) NULL,
    MODIFY `teamworkComment` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Objectives` MODIFY `title` VARCHAR(255) NULL,
    MODIFY `description` VARCHAR(255) NULL,
    MODIFY `successConditions` VARCHAR(255) NULL,
    MODIFY `deadline` VARCHAR(255) NULL,
    MODIFY `kpi` VARCHAR(255) NULL,
    MODIFY `comment` VARCHAR(255) NULL,
    MODIFY `selfComment` VARCHAR(255) NULL,
    MODIFY `midtermSelfComment` VARCHAR(255) NULL,
    MODIFY `midtermComment` VARCHAR(255) NULL;
