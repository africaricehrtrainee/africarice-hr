import cron from "node-cron";
import chalk from "chalk";
import sendMail, {
    mailEvaluationStep,
    mailNotificationStep,
} from "../../services/mail-service";
import { lightFormat } from "date-fns";
// Schedule the task to run every 5 seconds (using a cron expression)

export default async function cronJob() {
    const log = console.log;
    // Define your task function here
    function evaluationStepJob() {
        log(
            chalk.black.bgGreenBright(
                `🗲 Running evaluation schedule job at ${lightFormat(
                    new Date(),
                    "hh:mm:ss"
                )}`
            )
        );
        mailEvaluationStep();
        // Replace this with your actual task logic
    }

    function evaluationAlertJob() {
        log(
            chalk.black.bgGreenBright(
                `🗲 Running evaluation alert job at ${lightFormat(
                    new Date(),
                    "hh:mm:ss"
                )}`
            )
        );
        mailNotificationStep();
    }

    cron.schedule("*/10 * * * *", evaluationStepJob);

    log(
        chalk.black.bgYellow(
            "\u03BB Evaluation schedule notification every 10 minutes"
        )
    );
    cron.schedule("*/5 * * * *", evaluationAlertJob);

    log(
        chalk.black.bgYellow(
            "\u03BB Alert service notification run every 5 minute"
        )
    );
    // Alternatively, you can use a more human-readable syntax (recommended)
    // cron.schedule('*/5 * * * *', myTask);
}
